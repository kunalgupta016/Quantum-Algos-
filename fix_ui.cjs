const fs = require('fs');
const path = require('path');

const directories = [
  './src/pages/AdminPanel',
  './src/components/EducationalTabs',
  './src/pages/NewsPage',
  './src/pages/BlogsPage',
  './src/pages/DocsPage'
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // text-white -> text-[var(--color-app-text-main)]
  content = content.replace(/text-white/g, 'text-[var(--color-app-text-main)]');
  
  // text-gray-400 -> text-[var(--color-app-text-muted)]
  content = content.replace(/text-gray-400/g, 'text-[var(--color-app-text-muted)]');
  
  // text-gray-300 -> text-[var(--color-app-text-muted)]
  content = content.replace(/text-gray-300/g, 'text-[var(--color-app-text-muted)]');
  
  // text-gray-500 -> text-[var(--color-app-text-light)]
  content = content.replace(/text-gray-500/g, 'text-[var(--color-app-text-light)]');

  // Input background classes
  content = content.replace(/bg-white\/5/g, 'bg-[var(--color-app-input-bg)]');
  content = content.replace(/bg-black\/30/g, 'bg-[var(--color-app-input-bg)]');
  content = content.replace(/bg-\[\#1e1e1e\]/g, 'bg-[var(--color-app-input-bg)]');
  
  // Input borders
  content = content.replace(/border-white\/10/g, 'border-[var(--color-app-input-border)]');
  content = content.replace(/border-white\/20/g, 'border-[var(--color-app-border)]');

  // Generic backgrounds (if any)
  content = content.replace(/bg-gray-800/g, 'bg-[var(--color-app-surface)]');
  content = content.replace(/bg-gray-900/g, 'bg-[var(--color-app-base)]');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
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
console.log('Done replacing classes');
