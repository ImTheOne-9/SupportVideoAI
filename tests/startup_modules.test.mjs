import test from 'node:test';
import assert from 'node:assert/strict';
import { escapeHtml } from '../src/shared/html.js';
import { formatPortError, isPortAvailable } from '../scripts/runtime_preflight.mjs';
import { pythonExecutable } from '../scripts/python_runtime.mjs';

test('escapeHtml bảo vệ các giá trị đưa vào template', () => {
  assert.equal(escapeHtml('<img src="x" onerror=\'bad()\'>&'), '&lt;img src=&quot;x&quot; onerror=&#39;bad()&#39;&gt;&amp;');
});

test('preflight nhận biết một cổng khả dụng', async () => {
  assert.equal(await isPortAvailable(0), true);
  assert.match(formatPortError(5173), /5173/);
});

test('Python runtime ưu tiên virtual environment của dự án', () => {
  const executable = pythonExecutable(process.cwd());
  assert.match(executable.replaceAll('\\', '/'), /\.venv\/Scripts\/python\.exe$/i);
});
