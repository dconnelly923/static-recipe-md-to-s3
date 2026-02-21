const fs = require("fs");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function resetDir(p) {
  fs.rmSync(p, { recursive: true, force: true });
  ensureDir(p);
}

module.exports = { ensureDir, resetDir };
