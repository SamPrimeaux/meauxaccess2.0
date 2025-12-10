const fs = require('fs');

// Read iaccess HTML
const html = fs.readFileSync('src/iaccess.html', 'utf8');

// Escape backticks and template literals
const escaped = html
  .replace(/\\/g, '\\\\')
  .replace(/`/g, '\\`')
  .replace(/\${/g, '\\${');

// Create embed file
const embed = `export default \`${escaped}\`;`;

fs.writeFileSync('src/iaccess-embed.ts', embed);
console.log('? iAccess embedded successfully');
