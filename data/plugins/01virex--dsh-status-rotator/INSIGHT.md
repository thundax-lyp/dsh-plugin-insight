# dsh-status-rotator

> 为 DSH Web 状态栏提供阶段文案、打字机、渐变、弹幕和主题，支持在设置页自定义。

- **用途**：替换 DSH Web 状态文案，提供阶段感知词库、主题、打字机和弹幕效果。
- **亮点**：状态显示之外有设置持久化、配置校验和 SSE 同步，体验配置可以由用户调整。
- **思考**：装饰层已带来较大的前后端维护面；更多动效是否帮助判断运行状态，还是增加干扰和兼容负担？
- **建议**：适合重视界面氛围的个人用户体验；工作环境先关弹幕与动画，比较状态可读性和浏览器负担。

## 版本

固定提交 [bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1](https://github.com/01Virex/dsh-status-rotator/tree/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1)

## 场景、替代办法与合格交付

用户在等待模型时希望状态更可读或更有趣；合格结果是状态能随阶段变化且不遮挡操作。基线是宿主原生状态栏，不以词库数量或主题数量证明生产效率。

## 实现机制与依据

lib/index.js 提供配置读写与 SSE 通知；lib/client.js 负责状态和动效挂载，兼容不同设置 API。README 的 1362 词条和主题数为作者表述，本轮不作为工程能力评分。

本轮重点审读：[lib/index.js](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js)、[lib/client.js](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js)、[scripts/smoke-test.cjs](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/scripts/smoke-test.cjs)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

需要 DSH Web 的浏览器挂载位置与宿主设置／webServer 能力、可写配置目录；普通模式不需要额外模型。远程素材或额外效果的联网条件应按启用配置核查，不能把无 npm runtime dependencies 等同无环境依赖。

发布核查：已读取 npm latest 0.37.0；源码 package.json 为 0.37.0。版本号一致仍不证明 tarball 内容一致。未安装、未比对发布包字节。

## 用户、后台与失败流程

安装并重启／刷新 → 选主题和词库 → 启用所需效果 → 核对实际阶段与展示一致；升级后若挂载点失效，要检查浏览器缓存、宿主 API 和配置。关闭效果是最低成本的恢复路径。

## 首次、持续与迁移成本

首次主要是外观选择与兼容确认；持续有浏览器动画／定时器、SSE连接、设置存储和注意力成本，无模型收益实测。迁移需保留词库与配置，升级要复核 DOM／客户端契约。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 13 | 4184 | 70472 | — |
| .cjs | source | 25 | 7094 | — | 5859 |
| .js | source | 3 | 11855 | — | 9219 |
| .mjs | source | 1 | 111 | — | 88 |

- **界面**：前后端设置、状态栏挂载
- **后台**：定时器与配置同步

## 工程亮点

宿主配置校验、SSE连接清理及浏览器验证脚本体现了对实际挂载问题的处理；但已超出简单状态字符串替换，lib 与大量 scripts 不能都当作产品核心 LOC。没有运行其浏览器测试，不声称与当前宿主验收通过。

可借鉴配置变化实时广播、连接关闭清理和动效开关隔离；复用时应从最小状态适配层开始，避免把整套主题与词库维护成本带入业务插件。

上述工程判断依据：[lib/index.js](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/index.js)、[lib/client.js](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js)、[scripts/smoke-test.cjs](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/scripts/smoke-test.cjs)。

## 采用判断与最小验证

同一宿主同任务各跑 30 分钟，分别用原生状态、静态词库、完整动效；比较阶段辨识、误导状态、主线程占用和操作遮挡。若可读性无改善且资源占用上升，只保留静态模式或不用。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 42 · 近30天：新建 28／关闭 27／更新 28

统计日期：2026-10-19。
