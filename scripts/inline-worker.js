const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const swPath = path.join(publicDir, 'sw.js');

if (!fs.existsSync(swPath)) {
  console.log('sw.js not found, skipping');
  process.exit(0);
}

let swContent = fs.readFileSync(swPath, 'utf8');

const workerMatch = swContent.match(/"(\/worker-[^"]+\.js)"/);
if (workerMatch) {
  const workerFilename = workerMatch[1].replace(/^\//, '');
  const workerPath = path.join(publicDir, workerFilename);
  
  if (fs.existsSync(workerPath)) {
    const workerContent = fs.readFileSync(workerPath, 'utf8');
    
    // Replace the reference in importScripts with empty string
    // This turns importScripts("/fallback...", "/worker-...") into importScripts("/fallback...", "")
    swContent = swContent.replace(/"\/worker-[^"]+\.js"/, '""');
    
    // Append the worker content at the end of sw.js
    swContent += '\n\n' + workerContent;
    
    fs.writeFileSync(swPath, swContent);
    console.log(`Inlined ${workerFilename} into sw.js for PWABuilder compatibility.`);
  }
}
