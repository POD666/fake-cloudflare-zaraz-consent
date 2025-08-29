#!/usr/bin/env node

/**
 * Demo build script that bundles zaraz-ts with our package for browser compatibility
 */

import { writeFileSync, readFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the zaraz-ts source
const zarazTsPath = resolve(__dirname, 'node_modules/zaraz-ts/build/index.js');
const zarazTsContent = readFileSync(zarazTsPath, 'utf-8');

// Read our built index.js
const ourIndexPath = resolve(__dirname, 'dist/index.js');
const ourIndexContent = readFileSync(ourIndexPath, 'utf-8');

// Create a bundled version that includes zaraz-ts inline
const bundledContent = `
// Bundled zaraz-ts for demo (inlined to avoid module resolution issues)
${zarazTsContent.replace('exports.zaraz', 'const zarazExports')}

// Our package with zaraz-ts bundled
${ourIndexContent}

// Export bundled zaraz functions
export const zaraz = zarazExports;
`;

// Ensure demo/dist directory exists
mkdirSync(resolve(__dirname, 'demo/dist'), { recursive: true });

// Write the bundled file
writeFileSync(resolve(__dirname, 'demo/dist/index-bundled.js'), bundledContent);

console.log('✅ Demo build with bundled zaraz-ts created at demo/dist/index-bundled.js');
