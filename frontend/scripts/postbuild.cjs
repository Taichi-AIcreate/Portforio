const fs = require('fs');
const path = require('path');

// dist/index.htmlをdist/404.htmlにコピー
const sourcePath = path.join(__dirname, '../dist/index.html');
const targetPath = path.join(__dirname, '../dist/404.html');

try {
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log('✅ Successfully copied dist/index.html to dist/404.html');
  } else {
    console.error('❌ Source file dist/index.html not found');
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error copying file:', error);
  process.exit(1);
}
