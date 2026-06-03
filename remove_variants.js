const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/**/*.tsx', { cwd: 'd:/Brandex_Projects/varsity-tribe', absolute: true });
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<Container')) {
    const updated = content.replace(/<Container([^>]*)variant=['"][^'"]*['"]/g, '<Container$1');
    if (updated !== content) {
      fs.writeFileSync(file, updated);
    }
  }
});
