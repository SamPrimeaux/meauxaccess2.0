const fs = require('fs');

// Read dashboard.html
const html = fs.readFileSync('src/dashboard.html', 'utf8');

// Escape backticks and template literals
const escaped = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\${/g, '\\${');

// Write dashboard-embed.ts
const ts = `export default \`${escaped}\`;`;
fs.writeFileSync('src/dashboard-embed.ts', ts);

console.log('? Updated dashboard-embed.ts from dashboard.html');
