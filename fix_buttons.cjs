const fs = require('fs');
const path = require('path');

const directories = [
  './src/pages/AdminPanel'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  content = content.replace(/bg-orange-600 hover:bg-orange-500 text-\[var\(--color-app-text-main\)\]/g, 'bg-orange-600 hover:bg-orange-500 text-white');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated buttons in', filePath);
  }
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      processFile(fullPath);
    }
  }
}

directories.forEach(walkDir);
console.log('Done fixing buttons');
