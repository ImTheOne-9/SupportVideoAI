import { spawn } from 'node:child_process';
import { pythonExecutable } from './python_runtime.mjs';

const child = spawn(pythonExecutable(), process.argv.slice(2), {
  cwd: process.cwd(),
  stdio: 'inherit',
  windowsHide: true,
  env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
});

child.once('error', error => {
  console.error(`Không thể chạy Python: ${error.message}`);
  process.exit(1);
});
child.once('exit', code => process.exit(code ?? 1));
