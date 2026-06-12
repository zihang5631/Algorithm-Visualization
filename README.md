# Algorithm Visualization (排序算法可视化)

> 使用 **JavaScript + Electron** 制作的排序算法可视化练手项目，通过动画直观展示各排序算法的执行过程。

## 🛠 技术栈
- **Electron** — 桌面应用壳
- **HTML5 / CSS3 / JavaScript (ES6+)** — UI 与算法逻辑
- **Canvas / DOM** — 柱状图可视化

---

## 📂 项目结构

- `[toolbar]` — 顶部工具栏
- `[page-header]` — 页面标题栏
- `[main-layout]` — 主布局
  - `left-rail (64px)` — 左侧窄导航
  - `.sidebar (320px 单列):`
    - 🔮 操作控制（4 按钮 2×2 网格）
    - ⚙️ 参数配置（2 滑块：速度 / 数组大小）
    - 📊 算法选择（21 种排序算法按钮）
  - `.main-content (flex:1):`
    - 柱状图可视化区域
    - 状态 / 计时 / 时间复杂度显示
    - 原始数据 / 日志面板

---

## ⚙️ 环境要求
- [Node.js](https://nodejs.org/) ≥ 14.x（含 npm）

---

## 🚀 快速开始

### 1. 克隆仓库

bash

git clone https://github.com/
你的用户名/Algorithm-Visualization.git

cd Algorithm-Visualization

### 2. 安装依赖
bash

npm install

### 3. 启动项目

**方式一：Electron 桌面运行（推荐）**

bash

npm start

**方式二：浏览器直接打开（仅前端部分）**

直接用浏览器打开 index.html

> ⚠️ 浏览器模式无法使用 Electron 主进程 API，部分功能可能受限。

---

## ✨ 已支持 / 规划中的算法（持续更新中）

| 类别 | 算法 |
|---|---|
| 交换排序 | 冒泡排序（Bubble Sort）、快速排序（Quick Sort） |
| 选择排序 | 选择排序（Selection Sort）、堆排序（Heap Sort） |
| 插入排序 | 插入排序（Insertion Sort）、希尔排序（Shell Sort）、鸡尾酒排序（Cocktail Sort）、地精排序（Gnome Sort）、奇偶排序（Odd-Even Sort） |
| 分治合并 | 归并排序（Merge Sort） |
| 非比较排序 | 计数排序（Counting Sort）、桶排序（Bucket Sort）、基数排序（Radix Sort） |
| 其他 | 梳排序（Comb Sort）、耐心排序（Patience Sort）、图书馆排序（Library Sort）、块排序（Block Sort）、平滑排序（Smooth Sort）、锦标赛排序（Tournament Sort）、内省排序（Intro Sort）、蒂姆排序（Tim Sort） |

- ☑️ 基础排序已实现中
- 🔄 其余算法逐步补充
- 🎯 计划对所有算法加入**逐步动画 + 时间复杂度标注 + 优化版本**

---

## 📌 TODO
- [ ] 增加暂停 / 单步执行 / 重置

---

## 📄 License
MIT © 2026 zihang5631
