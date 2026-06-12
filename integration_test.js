// 集成测试：使用 vm 模块运行 renderer.js，验证所有算法的统计正确
const fs = require('fs');
const vm = require('vm');

// 最小化 DOM mock：覆盖 document.querySelector / querySelectorAll
// 让 new SortingVisualizer() 不报错
function makeMockElement(id) {
    const el = {
        id, tag: 'div',
        textContent: '', innerHTML: '', value: '30',
        min: '10', max: '100',
        className: '', children: [],
        classList: {
            add() {}, remove() {}, toggle() {}, contains() { return false; }
        },
        style: {},
        disabled: false,
        addEventListener() {},
        removeEventListener() {},
        appendChild() {},
        dispatchEvent() {},
        querySelector() { return makeMockElement('inner'); },
        querySelectorAll() { return []; }
    };
    return el;
}

const mockDOM = {
    _listeners: new WeakMap(),
    getElementById(id) { return makeMockElement(id); },
    querySelector(sel) { return makeMockElement(sel); },
    querySelectorAll(sel) { return []; },
    createElement(tag) { return makeMockElement(tag); },
    addEventListener() {},
    removeEventListener() {},
    body: makeMockElement('body')
};

const sandbox = {
    document: mockDOM,
    window: { addEventListener() {}, removeEventListener() {} },
    console,
    setTimeout, clearTimeout, setInterval, clearInterval,
    Date, Math, Array, Object, String, Number, Boolean,
    Symbol, Promise, Error, JSON, Map, Set, WeakMap,
};
sandbox.global = sandbox;
vm.createContext(sandbox);

// 读源码，把末尾的 DOMContentLoaded 监听器去掉，整个类暴露在 sandbox 全局里
let src = fs.readFileSync('src/renderer.js', 'utf8');
const lastNewClass = src.lastIndexOf('new SortingVisualizer();');
if (lastNewClass >= 0) {
    // 把最后那个 new SortingVisualizer(); 替换为挂到 global
    const before = src.substring(0, lastNewClass);
    const after = src.substring(lastNewClass + 'new SortingVisualizer();'.length);
    src = before + 'globalThis.__viz = new SortingVisualizer();' + after;
}
// 同时把开头的 addEventListener 调用也处理掉（保留 class 定义）
src = src.replace(
    /document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{/g,
    ''
);
// 把开头的 { 单独留下时可能会有一个 } 多余，把最后一个 `});` 拆掉
// 由于上面只移除了函数开头的 `document.addEventListener('DOMContentLoaded', () => {`，
// 原文件中对应还剩一个 `});`，需要消除
src = src.replace(/\}\)\s*\}\);\s*$/, '}');
// 上面正则不健壮，做简单处理：把所有尾部 `});` 去掉（含 CRLF）
src = src.replace(/\r?\n\}\);?\s*$/, '');

vm.runInContext(src, sandbox, { filename: 'renderer.js' });

const viz = sandbox.__viz;
if (!viz) {
    console.error('FAIL: SortingVisualizer not initialized');
    // 调试：打印源码尾部
    console.error('=== last 300 chars of source ===');
    console.error(src.slice(-300));
    process.exit(1);
}

// 测试每个算法
const algorithms = [
    ['bubble',     'standard', 1, 1],
    ['selection',  'standard', 1, 1],
    ['insertion',  'standard', 1, 1],
    ['quick',      'standard', 1, 1],
    ['merge',      'standard', 1, 1],
    ['shell',      'standard', 1, 1],
    ['heap',       'standard', 1, 1],
    ['counting',   'non-compare', 0, 1],
    ['bucket',     'non-compare', 0, 1],
    ['radix',      'non-compare', 0, 1],
    ['comb',       'standard', 1, 1],
    ['oddEven',    'standard', 1, 1],
    ['cocktail',   'standard', 1, 1],
    ['gnome',      'standard', 1, 1],
    ['patience',   'standard', 1, 1],
    ['library',    'standard', 1, 1],
    ['block',      'standard', 1, 1],
    ['smooth',     'standard', 1, 1],
    ['tournament', 'standard', 1, 1],
    ['intro',      'standard', 1, 1],
    ['tim',        'standard', 1, 1],
];

let pass = 0, fail = 0;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
    console.log('=== Algorithm Stats Integration Test ===\n');
    for (const [name, kind, minCmp, minSwap] of algorithms) {
        const methodName = name + 'Sort';
        if (typeof viz[methodName] !== 'function') {
            console.log(`  SKIP ${name}: 方法不存在`);
            continue;
        }
        // 重置
        viz.array = [5, 3, 8, 1, 9, 2, 7, 4, 6, 0];
        viz.comparisons = 0;
        viz.swaps = 0;
        viz.isSorting = true;
        viz.isPaused = false;
        viz.isStepMode = false;
        viz.stepRequested = false;
        // 把 sleep 改为同步放行
        viz.sleep = async () => {};

        try {
            await viz[methodName]();
        } catch (e) {
            console.log(`  FAIL ${name.padEnd(11)} 异常: ${e.message}`);
            fail++;
            continue;
        }
        viz.isSorting = false;

        const okCmp = viz.comparisons >= minCmp;
        const okSwap = viz.swaps >= minSwap;
        const sorted = JSON.stringify(viz.array) === JSON.stringify([0,1,2,3,4,5,6,7,8,9]);
        if (okCmp && okSwap && sorted) {
            console.log(`  PASS ${name.padEnd(11)} cmp=${String(viz.comparisons).padStart(3)} swap=${String(viz.swaps).padStart(3)} ${kind}`);
            pass++;
        } else {
            console.log(`  FAIL ${name.padEnd(11)} cmp=${viz.comparisons} (>=${minCmp}? ${okCmp}) swap=${viz.swaps} (>=${minSwap}? ${okSwap}) sorted=${sorted}`);
            if (!sorted) console.log(`         array after: ${JSON.stringify(viz.array)}`);
            fail++;
        }
        await sleep(5);
    }

    console.log(`\n========== Summary ==========`);
    console.log(`PASS: ${pass}, FAIL: ${fail}`);
    process.exit(fail > 0 ? 1 : 0);
})();
