import { spawnSync } from 'node:child_process';

if (process.platform !== 'win32') {
  console.error('Bộ cài NSIS hiện chỉ được hỗ trợ trên Windows.');
  process.exit(1);
}

const steps = [
  ['Vite build', process.execPath, ['node_modules/vite/bin/vite.js', 'build']],
  ['Python sidecar', 'powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', 'scripts/build_engine.ps1']],
  ['NSIS installer', process.execPath, ['node_modules/electron-builder/cli.js', '--win', 'nsis']],
];

for (const [label, command, args] of steps) {
  console.log(`\n[${label}]`);
  const result = spawnSync(command, args, { cwd: process.cwd(), stdio: 'inherit', windowsHide: true });
  if (result.error) {
    console.error(`${label} không chạy được: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) process.exit(result.status ?? 1);
}
