const fs = require('fs');
const content = fs.readFileSync('research.html', 'utf8');
const scriptMatch = content.match(/<script([^>]*)>/gi);
console.log("Script tags:", scriptMatch);
