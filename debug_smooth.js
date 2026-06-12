const fs = require('fs');
const vm = require('vm');
function makeMockElement(id) {
    return {
        id, textContent: '', innerHTML: '', value: '30', min: '10', max: '100',
        className: '', children: [], classList: { add(){}, remove(){}, toggle(){}, contains(){return false;} },
        style: {}, disabled: false, addEventListener(){}, removeEventListener(){}, appendChild(){},
        dispatchEvent(){}, querySelector(){return makeMockElement('inner');}, querySelectorAll(){return [];}
    };
}
const sandbox = {
    document: { getElementById: () => makeMockElement(), querySelector: () => makeMockElement(), querySelectorAll: () => [], createElement: () => makeMockElement(), addEventListener(){}, body: makeMockElement('body') },
    window: { addEventListener(){}, removeEventListener(){} },
    console, setTimeout, clearTimeout, Math, Array, Object, Promise, Map, Set, WeakMap
};
vm.createContext(sandbox);
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
src = src.replace(/\r?\n\}\);?\s*$/, '');
vm.runInContext(src, sandbox, { filename: 'renderer.js' });
const viz = sandbox.__viz;
console.log('smoothSort is function:', typeof viz.smoothSort);
viz.array = [5,3,8,1,9,2,7,4,6,0];
viz.isSorting = true;
viz.sleep = async () => {};
viz.smoothSort().then(() => {
    console.log('after:', viz.array);
    console.log('cmp=', viz.comparisons, 'swap=', viz.swaps);
});

