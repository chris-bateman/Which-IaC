import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const port = Number(process.env.PORT ?? 3000);
const basePath = process.env.BASE_PATH ?? '/';
const root = process.env.STATIC_ROOT ?? 'out';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    res.writeHead(400);
    res.end('Bad Request');
    return;
  }

  const url = new URL(req.url, `http://localhost:${port}`);
  let pathname = url.pathname;

  if (basePath !== '/' && pathname.startsWith(basePath)) {
    pathname = pathname.slice(basePath.length) || '/';
  }

  if (pathname.endsWith('/')) {
    pathname += 'index.html';
  }

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = normalize(join(root, pathname));
  if (!filePath.startsWith(normalize(root))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    await readFile(filePath);
    const ext = extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': contentTypes[ext] ?? 'application/octet-stream' });
    createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static server running at http://127.0.0.1:${port}${basePath}/`);
});
