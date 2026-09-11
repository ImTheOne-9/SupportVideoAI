import { spawn } from 'node:child_process';
import { isPortAvailable } from './runtime_preflight.mjs';

if (!await isPortAvailable(5173)) {
  console.error('Cổng 5173 đang được sử dụng. Hãy đóng Vite cũ trước khi chạy desktop:dev.');
  process.exit(1);
}

const children = [];
let stopping = false;
const start = (label, command, args) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
    env: { ...process.env, CREATORUTILS_RENDERER_URL: 'http://127.0.0.1:5173' },
  });
  child.stdout.on('data', chunk => process.stdout.write(`[${label}] ${chunk}`));
  child.stderr.on('data', chunk => process.stderr.write(`[${label}] ${chunk}`));
  children.push(child);
  return child;
};

const stop = code => {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill();
  setTimeout(() => process.exit(code), 300);
};

process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));

const vite = start('WEB', process.execPath, ['node_modules/vite/bin/vite.js', '--port', '5173', '--host', '127.0.0.1', '--strictPort']);
vite.on('exit', code => { if (!stopping) stop(code || 1); });

const deadline = Date.now() + 30_000;
while (!await fetch('http://127.0.0.1:5173').then(response => response.ok).catch(() => false)) {
  if (Date.now() > deadline) stop(1);
  await new Promise(resolvePromise => setTimeout(resolvePromise, 250));
}

const electron = start('DESKTOP', process.execPath, ['node_modules/electron/cli.js', '.']);
electron.on('exit', code => { if (!stopping) stop(code || 0); });
