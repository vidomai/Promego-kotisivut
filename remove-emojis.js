const fs = require('fs');
const path = require('path');

// Folders to exclude from processing
const EXCLUDED_FOLDERS = ['vanhat_versiot', 'Jussilta materiaali'];

// Function to remove all emojis and special Unicode characters
function removeEmojis(text) {
  // This regex matches all emojis and special Unicode characters
  return text.replace(
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{27FF}]|[\u{2300}-\u{23FF}]|[\u{1F000}-\u{1F02F}]|[\u{1F0A0}-\u{1F0FF}]|[\u{1F100}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{200D}]|[\u{FE0F}]/gu,
    ''
  );
}

// Check if folder should be excluded
function isExcluded(folderPath) {
  const relativePath = path.relative(__dirname, folderPath);
  const firstFolder = relativePath.split(path.sep)[0];
  return EXCLUDED_FOLDERS.includes(firstFolder);
}

// Process only root-level HTML files (non-recursive)
function processRootHtmlFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    // Only process .html files at root level, skip directories
    if (file.isFile() && file.name.endsWith('.html')) {
      const fullPath = path.join(dir, file.name);
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = removeEmojis(content);

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`✓ Processed: ${file.name}`);
        count++;
      }
    }
  }

  return count;
}

// Start processing
const startDir = __dirname;
console.log('Processing root-level HTML files only...');
console.log(`Excluded folders: ${EXCLUDED_FOLDERS.join(', ')}\n`);
const processedCount = processRootHtmlFiles(startDir);
console.log(`\n✓ Emojis removed from ${processedCount} HTML files.`);
