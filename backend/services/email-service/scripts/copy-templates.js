// Cross-platform script to copy templates
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Source and destination paths
const srcTemplatesDir = path.join(projectRoot, 'src', 'templates');
const distTemplatesDir = path.join(projectRoot, 'dist', 'templates');

// Create directory recursively if it doesn't exist
function createDirRecursive(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Copy directory recursively
function copyDir(src, dest) {
  createDirRecursive(dest);

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Create dist/templates directory
createDirRecursive(distTemplatesDir);

// Copy templates
console.log(`Copying templates from ${srcTemplatesDir} to ${distTemplatesDir}`);
copyDir(srcTemplatesDir, distTemplatesDir);
console.log('Templates copied successfully');
