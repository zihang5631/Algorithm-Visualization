const fs = require('fs');
let src = fs.readFileSync('src/renderer.js', 'utf8');
const lastNewClass = src.lastIndexOf('new SortingVisualizer();');
if (lastNewClass >= 0) {
    const before = src.substring(0, lastNewClass);
    const after = src.substring(lastNewClass + 'new SortingVisualizer();'.length);
    src = before + 'globalThis.__viz = new SortingVisualizer();' + after;
}
src = src.replace(
    /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/g,
    ''
);
console.log('=== last 100 chars after substitution ===');
console.log(JSON.stringify(src.slice(-100)));
console.log('=== exact last 5 lines ===');
const lines = src.split('\n');
console.log(lines.slice(-5).join('\n'));
