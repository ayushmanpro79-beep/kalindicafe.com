const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".sql": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (reqPath === "/") reqPath = "/index.html";
  const filePath = path.join(root, reqPath);
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath).toLowerCase()] || "text/plain; charset=utf-8"
    });
    res.end(data);
  });
});

server.listen(4173, "127.0.0.1", () => {
  console.log("Cryptopedia preview server running on http://127.0.0.1:4173");
});
