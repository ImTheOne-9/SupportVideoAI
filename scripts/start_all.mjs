import { spawn } from 'node:child_process';
import { formatPortError, isCreatorUtilsApiRunning, isPortAvailable } from './runtime_preflight.mjs';
import { pythonExecutable } from './python_runtime.mjs';

const children = [];
let stopping = false;

function start(label, command, args) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  child.stdout.on('data', chunk => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on('data', chunk => process.stderr.write(`[${label}] ${chunk}`));
  child.on('exit', code => {
    if (!stopping && code) {
      console.error(`${label} đã dừng với mã ${code}.`);
      stop(code);
    }
  });
  children.push(child);
  return child;
}

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill('SIGTERM');
  }
  setTimeout(() => process.exit(code), 250);
}

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

async function main() {
  if (!await isPortAvailable(5173)) {
    console.error(formatPortError(5173));
    process.exitCode = 1;
    return;
  }

  const apiAlreadyRunning = await isCreatorUtilsApiRunning();
  if (apiAlreadyRunning) {
    console.log('[API] Đang dùng lại CreatorUtils AI engine tại http://127.0.0.1:8765');
  } else if (!await isPortAvailable(8765)) {
    console.error(formatPortError(8765));
    process.exitCode = 1;
    return;
  } else {
    start('API', pythonExecutable(), ['-m', 'engine.api_server']);
  }

  start('WEB', process.execPath, ['node_modules/vite/bin/vite.js', '--port', '5173', '--host', '--strictPort']);
  console.log('CreatorUtils đang khởi động. Mở http://127.0.0.1:5173');
}

await main();
