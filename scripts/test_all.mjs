import { spawnSync } from 'node:child_process';
import { pythonExecutable } from './python_runtime.mjs';

const steps = [
  ['Python compile', pythonExecutable(), ['-m', 'compileall', '-q', 'engine', 'tests']],
  ['JavaScript tests', process.execPath, ['--test', 'tests/*.test.mjs']],
  ['Python tests', pythonExecutable(), ['-m', 'unittest', 'discover', '-s', 'tests', '-v']],
  ['Vite build', process.execPath, ['node_modules/vite/bin/vite.js', 'build']],
];

for (const [label, command, args] of steps) {
  console.log(`\n[${label}]`);
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    windowsHide: true,
    env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
  });
  if (result.error) {
    console.error(`${label} không chạy được: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
