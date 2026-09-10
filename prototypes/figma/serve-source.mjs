import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const [baseline, updated] = process.argv.slice(2).map(p => path.resolve(p));
if (!baseline || !updated) throw new Error('Pass baseline and updated TSX paths');
// Read-only bridge for opening the authored source in a browser and pasting it
// through the Figma code editor. No page scripts or hidden app APIs are used.
const files = { '/baseline.txt': baseline, '/WebApp.txt': updated };
http.createServer((req, res) => {
  const file = files[req.url];
  if (!file) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(file));
}).listen(8741, '127.0.0.1', () => console.log('Source bridge: http://127.0.0.1:8741/WebApp.txt and http://127.0.0.1:8741/baseline.txt'));
