"use strict";
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..", "app");
const port = Number(process.env.PORT || 4797);
if (!Number.isInteger(port) || port < 1024 || port > 65535) {
  console.error("PORT must be an integer between 1024 and 65535.");
  process.exit(1);
}
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const server = http.createServer(async (req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }
  let target;
  try {
    const name = decodeURIComponent(
      new URL(req.url, "http://127.0.0.1").pathname,
    );
    if (name.includes("\0") || name.includes("\\"))
      throw new Error("Invalid path");
    target = path.resolve(root, "." + (name === "/" ? "/index.html" : name));
  } catch {
    res.writeHead(400);
    res.end("Bad request");
    return;
  }
  if (!target.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  try {
    const stat = await fs.stat(target);
    if (!stat.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const bytes = req.method === "HEAD" ? null : await fs.readFile(target);
    res.writeHead(200, {
      "Content-Type": types[path.extname(target)] || "application/octet-stream",
      "Content-Length": stat.size,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(bytes);
  } catch (error) {
    const code =
      error.code === "ENOENT" || error.code === "ENOTDIR" ? 404 : 500;
    res.writeHead(code);
    res.end(code === 404 ? "Not found" : "Unable to read file");
  }
});
server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.listen(port, "127.0.0.1", () =>
  console.log(
    "GlassHome preview: http://127.0.0.1:" +
      port +
      "\nLocal browser preview only. No TV connection.",
  ),
);
