# dsh-worktable（01_content）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6cb86b6](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content)

<!-- BEGIN META -->
[![GitHub ★ 772](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=772&color=yellow&logo=github&style=flat)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **实现功能**：在侧栏提供项目抽屉、分栏窗格、会话绑定与项目产物挂载。

> **核心亮点**：将会话产物交接绑定到具体项目窗格，避免按共享目录盲读结果的常见歧义；这是身份与交接机制的增量，终端/浏览器/原生会话能力分别来自宿主与上游。

> **风险与缺陷**：manifest隔离不等于文件沙箱：主机file/write直接pathResolve用户路径，写端无本组件工作区containment；终端继承process.env且执行完整shell，路由未见本包独立信任检查。多个项目主动指同一产物仍能互改，挂载身份正确不能证明内容独立。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者把多个项目、会话和本地预览组织在同一工作台，需人工验收各项目产物。

参照宿主会话栏、普通浏览器/终端及侧栏工作台；本组件增量是项目×窗格×会话绑定与有身份的产物挂载，非整仓所有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：项目抽屉、控制室和分栏窗口
- **Host 路由**：工作台文件/工作区/终端接口
- **后台**：项目窗格绑定和产物挂载

**流程与依赖**

01_content主机注册文件/写入/工作区/终端路由，客户端slots与split引擎存布局；WidgetMountRegistry用project/pane/session/bindingId生成专属manifest，并在目录/窗口变化时撤销旧关联。

宿主slots/会话/connection服务，终端可选ws/node-pty；浏览器来源localStorage存项目/布局，模型完成自定义任务才可能产生产物。独立package版本0.4.0以组件材料为准。

建项目/绑定会话→选窗口任务→先持久绑定身份→发送宿主会话→读取当前manifest/产物→挂载窗口→人工验收；旧关联拒绝补挂，失败保留待办。

**效果与成本**

配置项目和绑定、模型任务token与人工复核、文件和终端维护；本地layout不跨浏览器来源同步，iframe网页有自身网络/资源成本。

项目隔离身份有具体实现，作者Windows验证不等于本轮宿主验收；无并行交付效率或错误挂载率数据。

> **思考**：manifest隔离不等于文件沙箱：主机file/write直接pathResolve用户路径，写端无本组件工作区containment；终端继承process.env且执行完整shell，路由未见本包独立信任检查。多个项目主动指同一产物仍能互改，挂载身份正确不能证明内容独立。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将会话产物交接绑定到具体项目窗格，避免按共享目录盲读结果的常见歧义；这是身份与交接机制的增量，终端/浏览器/原生会话能力分别来自宿主与上游。

将会话产物交接绑定到具体项目窗格，避免按共享目录盲读结果的常见歧义；这是身份与交接机制的增量，终端/浏览器/原生会话能力分别来自宿主与上游。

绑定持久化失败阻止任务发送、失效关联显式撤销与专属结果路径可借鉴；布局存储和文件内容不是同一隔离层。

源码依据：[01_content/src/index.ts](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts)、[01_content/src/client/index.tsx](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/index.tsx)、[01_content/src/client/widgetMount.ts](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts)、[01_content/src/client/split.tsx](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/split.tsx)。

<a id="detail-section-5"></a>

### 1.4 主要限制

manifest隔离不等于文件沙箱：主机file/write直接pathResolve用户路径，写端无本组件工作区containment；终端继承process.env且执行完整shell，路由未见本包独立信任检查。多个项目主动指同一产物仍能互改，挂载身份正确不能证明内容独立。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用隔离项目验证绑定、结果归属、关闭撤销和终端；本地文件和完整Shell权限须与使用环境匹配。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：0.4.0（[固定提交 6cb86b6c](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

- 已检查：01_content/src/index.ts、01_content/src/client/index.tsx、01_content/src/client/widgetMount.ts、01_content/src/client/split.tsx、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离工作区核路由外层授权、manifest身份、软链接/目标范围与终端清理；本轮未启动或发任务。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：把产物能力绑定规范根/目标摘要和生成版本，在挂载前核引用，可同时减少错挂与旧内容覆盖。用同目录两项目、改绑/关闭、同名结果和迟到完成核身份/内容一致性；未拒迟到产物则不做自动验收。

未来隔离工作区核路由外层授权、manifest身份、软链接/目标范围与终端清理；本轮未启动或发任务。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：01_content；内容摘要：a884ad56fb3fa44d187743b10926390942f5ca88214576be3a43cdc77af02fad。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 565 | 446 | 94 | — |
| .mjs | test | 1 | 72 | 45 | 14 | — |
| .js | source | 2 | 24411 | 23005 | 1945 | — |
| .md | source | 1 | 88 | — | — | 2236 |
| .ts | source | 14 | 2400 | 2088 | 201 | — |
| .tsx | source | 2 | 6500 | 5790 | 500 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aisland-SJL/dsh-worktable/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
