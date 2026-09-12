const { app, BrowserWindow, ipcMain, safeStorage } = require('electron');
const { spawn, spawnSync } = require('node:child_process');
const { createServer } = require('node:http');
const { existsSync, readFileSync, writeFileSync } = require('node:fs');
const { extname, join, normalize, resolve, sep } = require('node:path');

const API_PORT = Number(process.env.CREATORUTILS_API_PORT || 8765);
const API_URL = `http://127.0.0.1:${API_PORT}`;
let engineProcess = null;
let rendererServer = null;

function projectRoot() {
  return resolve(__dirname, '..');
}

function secretPath() {
  return join(app.getPath('userData'), 'gemini-key.bin');
}

function registerSecretHandlers() {
  ipcMain.handle('secrets:get-gemini-key', () => {
    const path = secretPath();
    if (!existsSync(path) || !safeStorage.isEncryptionAvailable()) return '';
    try {
      return safeStorage.decryptString(readFileSync(path));
    } catch {
      return '';
    }
  });
  ipcMain.handle('secrets:set-gemini-key', (_event, value) => {
    if (!safeStorage.isEncryptionAvailable()) {
      throw new Error('Windows không cung cấp kho mã hóa an toàn cho tài khoản hiện tại.');
    }
    writeFileSync(secretPath(), safeStorage.encryptString(String(value || '')));
    return true;
  });
}

async function apiReady() {
  try {
    const response = await fetch(`${API_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    const payload = await response.json();
    return response.ok && payload.ok && payload.apiVersion >= 7;
  } catch {
    return false;
  }
}

function startEngine() {
  const root = projectRoot();
  let command;
  let args;
  if (app.isPackaged) {
    command = join(process.resourcesPath, 'engine', 'creatorutils-engine.exe');
    args = [];
  } else {
    const venvPython = join(root, '.venv', 'Scripts', 'python.exe');
    command = existsSync(venvPython) ? venvPython : 'python';
    args = ['-m', 'engine.api_server'];
  }
  const ffmpegPath = app.isPackaged
    ? join(process.resourcesPath, 'ffmpeg', 'ffmpeg.exe')
    : require('ffmpeg-static');
  engineProcess = spawn(command, args, {
    cwd: app.isPackaged ? process.resourcesPath : root,
    windowsHide: true,
    stdio: app.isPackaged ? 'ignore' : 'inherit',
    env: {
      ...process.env,
      PYTHONIOENCODING: 'utf-8',
      CREATORUTILS_FFMPEG_PATH: ffmpegPath,
    },
  });
  engineProcess.once('error', error => console.error('Không thể khởi động AI engine:', error));
}

async function ensureEngine() {
  if (await apiReady()) return;
  startEngine();
  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    await new Promise(resolvePromise => setTimeout(resolvePromise, 500));
    if (await apiReady()) return;
    if (engineProcess?.exitCode != null) break;
  }
  throw new Error('AI engine không khởi động được trong 90 giây.');
}

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

function startStaticRenderer() {
  const distRoot = resolve(projectRoot(), 'dist');
  rendererServer = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    let filePath = resolve(distRoot, normalize(relative));
    if (!filePath.startsWith(`${distRoot}${sep}`) && filePath !== distRoot) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (!existsSync(filePath)) filePath = join(distRoot, 'index.html');
    response.writeHead(200, {
      'Content-Type': MIME[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': filePath.endsWith('index.html') ? 'no-cache' : 'public, max-age=31536000, immutable',
    });
    response.end(readFileSync(filePath));
  });
  return new Promise((resolvePromise, reject) => {
    rendererServer.once('error', reject);
    rendererServer.listen(0, '127.0.0.1', () => {
      resolvePromise(`http://127.0.0.1:${rendererServer.address().port}`);
    });
  });
}

async function createWindow() {
  await ensureEngine();
  const window = new BrowserWindow({
    width: 1500,
    height: 960,
    minWidth: 1120,
    minHeight: 720,
    backgroundColor: '#111214',
    show: false,
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  window.once('ready-to-show', () => window.show());
  const rendererUrl = app.isPackaged
    ? await startStaticRenderer()
    : process.env.CREATORUTILS_RENDERER_URL || 'http://127.0.0.1:5173';
  await window.loadURL(rendererUrl);
}

async function runSmokeTest() {
  await ensureEngine();
  const rendererUrl = await startStaticRenderer();
  const [healthResponse, rendererResponse] = await Promise.all([
    fetch(`${API_URL}/api/health`),
    fetch(rendererUrl),
  ]);
  const health = await healthResponse.json();
  const html = await rendererResponse.text();
  if (!healthResponse.ok || !health.ok || !health.ffmpegReady) {
    throw new Error('Packaged AI engine hoặc FFmpeg chưa sẵn sàng.');
  }
  if (!rendererResponse.ok || !html.includes('CreatorUtils')) {
    throw new Error('Packaged renderer không trả về giao diện CreatorUtils.');
  }
  return { ok: true, apiVersion: health.apiVersion, ffmpegReady: health.ffmpegReady };
}

function writeSmokeResult(payload) {
  const resultPath = process.env.CREATORUTILS_SMOKE_RESULT;
  if (resultPath) writeFileSync(resultPath, JSON.stringify(payload, null, 2));
}

function stopServices() {
  rendererServer?.close();
  if (engineProcess && engineProcess.exitCode == null) {
    if (process.platform === 'win32') {
      spawnSync('taskkill.exe', ['/pid', String(engineProcess.pid), '/t', '/f'], {
        windowsHide: true,
        stdio: 'ignore',
      });
    } else {
      engineProcess.kill('SIGTERM');
    }
  }
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const window = BrowserWindow.getAllWindows()[0];
    if (window) {
      if (window.isMinimized()) window.restore();
      window.focus();
    }
  });
  app.whenReady().then(async () => {
    try {
      if (process.env.CREATORUTILS_SMOKE_TEST === '1') {
        writeSmokeResult(await runSmokeTest());
        stopServices();
        app.exit(0);
        return;
      }
      registerSecretHandlers();
      await createWindow();
    } catch (error) {
      console.error(error);
      writeSmokeResult({ ok: false, error: String(error?.message || error) });
      stopServices();
      app.exit(1);
    }
  });
}

app.on('window-all-closed', () => app.quit());
app.on('before-quit', stopServices);
