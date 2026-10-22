# dsh-calendar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6ce4095](https://github.com/AloneFu/dsh-calendar-plugin/tree/6ce4095ef800838f91abc162aa6d6646435f7605)

<!-- BEGIN META -->
[![npm 30d 5,884](https://img.shields.io/static/v1?label=npm+30d&message=5%2C884&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-calendar) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-calendar)
<!-- END META -->

> **实现功能**：在 DSH 右侧栏读 Obsidian 日记与待办，并受控写回 Markdown。

> **核心亮点**：以同一Markdown为真源将日历操作和DSH上下文连接，避免导入副本；写回保留行尾/BOM/任务元数据，比直接重写整篇更有针对性。日历/Tasks语法来自既有生态，业务角色仍是原用户。

> **风险与缺陷**：乐观并发保护是否强制覆盖所有写者？mutateTaskLine仅当body.expect为string才检查，未提供expect仍可写；锁只约束本插件请求，Obsidian等外部编辑不共锁，从读到rename存在覆盖窗口。日期isIsoDate只限月1–12/日1–31，2月31等可被接受。回读本行正确不证明文件其他行没有丢失。

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

> **用途**：已有Markdown日记/Tasks语法的用户在会话旁查看日历、时间块和待办，减少切换编辑器；合格交付是原文件正确更新且其他编辑不被覆盖。

Obsidian原生Calendar/Tasks/Day Planner；插件把同数据嵌入DSH，不替代其完整编辑器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：日记/任务扫描、setup与受控写回接口。
- **界面**：右侧tab/header日历入口与同源iframe日历页。

**流程与依赖**

Host解析复选框/日期/时间头，扫描指定root；iframe复用standalone/calendar.html作为唯一日历页，client注册右侧tab和header按钮。写回经路径约束、每文件锁、可选expect原行比较、临时写替换与回读校验，再写审计；配置存DSH_HOME。

DSH webServer/right tabs/slots、Node文件权限、指定Markdown目录；Obsidian插件配置只作可选兼容输入。

检测/选择vault日记root→保存配置→扫描日历/待办→勾选/改描述/改时间→路径及expect核对→写回/回读→审计；冲突需用户重载。

零额外运行包的DSH Web bundle；Obsidian只提供vault数据，不要求进程常驻，Day Planner/Calendar为显示兼容可选。

**效果与成本**

现金无独立模型/API；人工是指定root、维护语法和冲突处理；扫描大vault与iframe渲染开销、误写恢复时间未测。

减少日记与任务分散复制，保持原文件；未证明总管理时间或并发安全。

> **思考**：乐观并发保护是否强制覆盖所有写者？mutateTaskLine仅当body.expect为string才检查，未提供expect仍可写；锁只约束本插件请求，Obsidian等外部编辑不共锁，从读到rename存在覆盖窗口。日期isIsoDate只限月1–12/日1–31，2月31等可被接受。回读本行正确不证明文件其他行没有丢失。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以同一Markdown为真源将日历操作和DSH上下文连接，避免导入副本；写回保留行尾/BOM/任务元数据，比直接重写整篇更有针对性。日历/Tasks语法来自既有生态，业务角色仍是原用户。

以同一Markdown为真源将日历操作和DSH上下文连接，避免导入副本；写回保留行尾/BOM/任务元数据，比直接重写整篇更有针对性。日历/Tasks语法来自既有生态，业务角色仍是原用户。

单一HTML页避免双实现漂移，任务转换保元数据/BOM/EOL，写后回读并审计；每文件串行有用但不能约束Obsidian写者。

固定源码依据：[lib/index.js](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/index.js)、[lib/client.js](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/lib/client.js)、[standalone/calendar.html](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/standalone/calendar.html)、[package.json](https://github.com/AloneFu/dsh-calendar-plugin/blob/6ce4095ef800838f91abc162aa6d6646435f7605/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

乐观并发保护是否强制覆盖所有写者？mutateTaskLine仅当body.expect为string才检查，未提供expect仍可写；锁只约束本插件请求，Obsidian等外部编辑不共锁，从读到rename存在覆盖窗口。日期isIsoDate只限月1–12/日1–31，2月31等可被接受。回读本行正确不证明文件其他行没有丢失。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有Markdown任务日记者可评估；先备份并核外部编辑冲突策略，别把可选expect当强制版本事务。

核查状态：任务解析、单页嵌入与受控写回可确认；Obsidian并发编辑与完整日期语义未实测。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：1.1.0；版本日期：2026-10-04（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[6ce4095e](https://github.com/AloneFu/dsh-calendar-plugin/tree/6ce4095ef800838f91abc162aa6d6646435f7605)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host解析/写回/请求围栏、client tab/iframe接线及README；未运行独立日历页或外部Obsidian，未把外部编辑器安装当硬运行依赖。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

强制文件摘要/原行版本凭据并在写前再核整个文件，冲突返回差异而不覆盖，可能减少多编辑器丢更新。用缺expect、外部插行/改其他行和非法日期反例，要求拒绝冲突且合法任务元数据不变；若仅同插件串行通过不算外部并发保证。

未运行；拟跨编辑器并发插行/修改别行、缺expect、符号链接与非法日期验证，分别核整文件不丢与当前行准确。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 769 | — | — | 11344 |
| .js | source | 2 | 2002 | 1561 | 320 | — |
| .mjs | test | 5 | 984 | 786 | 131 | — |
| .mjs | source | 5 | 1077 | 838 | 169 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AloneFu/dsh-calendar-plugin/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
