const fs = require('fs');
const path = require('path');

console.log('🔨 Creating browser-compatible demo build...');

// Read the main dist index.js
const distIndexPath = path.join(__dirname, '..', 'dist', 'index.js');
let content = fs.readFileSync(distIndexPath, 'utf-8');

// Remove zaraz-ts exports and imports for browser compatibility
content = content
  .replace(/export \* from 'zaraz-ts';/g, '// zaraz-ts exports removed for browser compatibility')
  .replace(/import { getZaraz } from 'zaraz-ts\/build\/helpers\/get-zaraz\.js';/g,
    'function getZaraz() { return typeof window !== \'undefined\' && window.zaraz ? window.zaraz : null; }');

// Ensure demo/dist directory exists
const demoDistDir = path.join(__dirname, '..', 'demo', 'dist');
fs.mkdirSync(demoDistDir, { recursive: true });

// Write the browser-compatible version
const demoIndexPath = path.join(demoDistDir, 'index.js');
fs.writeFileSync(demoIndexPath, content);

// Copy other dist files
const distFiles = fs.readdirSync(path.join(__dirname, '..', 'dist'));
distFiles.forEach(file => {
  if (file !== 'index.js') {
    const srcPath = path.join(__dirname, '..', 'dist', file);
    const destPath = path.join(demoDistDir, file);
    fs.copyFileSync(srcPath, destPath);
  }
});

console.log('✅ Browser-compatible demo build created at demo/dist/');
