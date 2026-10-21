# dsh-piano

> 在 DSH 浮动面板中用 Web Audio 合成钢琴音并支持滑动刮奏。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

分析版本：[6d04df3](https://github.com/439436269-ctrl/dsh-piano/tree/6d04df38659655b3c71136bfe0172d0d14439d64)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-piano) · [![npm 30d 560](https://img.shields.io/static/v1?label=npm+30d&message=560&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-piano) · [![首次发布 2026-10-09](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-piano)
<!-- END META -->

**使用建议**：适合轻量即兴发声；在目标浏览器确认音频延迟和拖动行为，不作为专业键盘替代。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：用户在工作间隙即兴点击和滑动发声；交付是即时声音，不是MIDI录制或专业音乐制作。

适合轻量即兴发声；在目标浏览器确认音频延迟和拖动行为，不作为专业键盘替代。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照普通网页合成钢琴，不主张音色算法原创或专业音乐功能。

客户端在shell.overlay挂浮动键盘，指针捕获与elementFromPoint识别跨键滑动；Web Audio以基音泛音和噪声瞬态合成，共享输出压缩链。


DSH浏览器模块加载器、React、shell.overlay、Web Audio及用户手势解锁，位置与音量存localStorage。

打开浮动按钮触发AudioContext，按键合成声音，捕获指针后跨键触发新音，调音量/八度并保留本地设置。

本地音频计算和少量设置存储，无网络服务调用；人工为浏览器音频权限/兼容排查，无法据零依赖推断性能。

降低临时娱乐的切换成本，未发现软件交付或音乐创作效率证据。

- **界面**：浮动钢琴与滑动刮奏（Web Audio合成）

- **思考**：零网络不意味着低延迟或专业音色；快速滑奏会叠加多音，压缩器避免削波仍不能证明无音频抖动。没有录制、节拍与导出证据，不宜扩展为内容生产工具。

<a id="detail-section-4"></a>

### 工程贡献

共享低通压缩器与缓存噪声Buffer避免重复主链分配；浏览器能力缺失时返回空，不提供错误反馈。复用需补足生命周期资源关闭核查。 源码依据：[lib/client.js](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/client.js#L57)、[lib/index.js](https://github.com/439436269-ctrl/dsh-piano/blob/6d04df38659655b3c71136bfe0172d0d14439d64/lib/index.js#L9)。

- **亮点**：相对独立浏览器小钢琴，增量是无采样、无网络依赖地嵌入DSH；共享压缩器和缓存噪声缓冲减少每音重复资源分配。音乐合成方法本身属已有技术组合。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[439436269-ctrl/dsh-piano](https://github.com/439436269-ctrl/dsh-piano)
- **版本号**：0.2.0（[固定提交 6d04df3](https://github.com/439436269-ctrl/dsh-piano/tree/6d04df38659655b3c71136bfe0172d0d14439d64)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：限制并回收并发voice，并在不可用AudioContext时明确提示，可改善低性能设备的连奏体验；由共享链和浏览器静默失败分支推导，voice上限可能截断尾音。

最小验证：低性能浏览器连续滑动并限制4/8/16个voice，测音频掉帧、输入延迟及尾音截断；若改善资源却显著恶化听感则否定。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 445 | 376 | 47 | — |
| .md | source | 1 | 50 | — | — | 520 |
| .mjs | test | 1 | 36 | 32 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-piano/issues) 查看。

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
