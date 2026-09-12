import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export function pythonExecutable(root = process.cwd()) {
  const candidate = process.platform === 'win32'
    ? resolve(root, '.venv/Scripts/python.exe')
    : resolve(root, '.venv/bin/python');
  return existsSync(candidate) ? candidate : (process.platform === 'win32' ? 'python' : 'python3');
}
