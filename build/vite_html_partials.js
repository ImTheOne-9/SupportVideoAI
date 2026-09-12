import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const INCLUDE_PATTERN = /<!--\s*@include\s+([^\s]+)\s*-->/g;

export function htmlPartials(root = process.cwd()) {
  const partialsRoot = resolve(root, 'src/ui/partials');
  return {
    name: 'creatorutils-html-partials',
    enforce: 'pre',
    async transformIndexHtml(html) {
      const matches = [...html.matchAll(INCLUDE_PATTERN)];
      let transformed = html;
      for (const match of matches) {
        const partialPath = resolve(partialsRoot, match[1]);
        if (!partialPath.startsWith(partialsRoot)) throw new Error(`Partial nằm ngoài thư mục cho phép: ${match[1]}`);
        transformed = transformed.replace(match[0], await readFile(partialPath, 'utf8'));
      }
      return transformed;
    },
    configureServer(server) {
      server.watcher.add(partialsRoot);
      server.watcher.on('change', path => {
        if (path.startsWith(partialsRoot)) server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
