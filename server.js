#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const HOST = 'localhost';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Log requests
  console.log(`${req.method} ${req.url}`);

  // Set CORS headers for service worker
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Service-Worker-Allowed header for service worker
  if (req.url.includes('sw.js')) {
    res.setHeader('Service-Worker-Allowed', '/');
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Security: prevent directory traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Try to read the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found, try index.html
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
          res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'] });
          res.end(content);
        });
      } else {
        res.writeHead(500);
        res.end(`Server error: ${err}`);
      }
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║          🚀 PWA Development Server Started        ║
╚═══════════════════════════════════════════════════╝

✅ Server running at: http://${HOST}:${PORT}

📱 To test PWA:
   1. Open http://localhost:8000 in your browser
   2. Open DevTools (F12)
   3. Go to Application tab → Service Workers
   4. You should see the service worker registered
   5. Click "Install app" button in the address bar

🛑 To stop the server: Press Ctrl+C

  `);
});

process.on('SIGINT', () => {
  console.log('\n\nServer stopped.');
  process.exit(0);
});
