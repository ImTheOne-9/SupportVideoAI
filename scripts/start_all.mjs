import { spawn } from 'node:child_process';

const isWindows = process.platform === 'win32';
const npmCommand = isWindows ? (process.env.ComSpec || 'cmd.exe') : 'npm';
const npmArgs = isWindows ? ['/d', '/s', '/c', 'npm run dev'] : ['run', 'dev'];
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

start('API', 'python', ['-m', 'engine.api_server']);
start('WEB', npmCommand, npmArgs);

console.log('CreatorUtils đang khởi động. Mở http://127.0.0.1:5173');
