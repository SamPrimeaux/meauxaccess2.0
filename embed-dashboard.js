const fs = require('fs');

// Read dashboard HTML
const html = fs.readFileSync('src/dashboard.html', 'utf8');

// Escape backticks and template literals
const escaped = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\${/g, '\\${');

// Create embed file
const embed = `export default \`${escaped}\`;`;

fs.writeFileSync('src/dashboard-embed.ts', embed);
console.log('? Dashboard embedded successfully');
