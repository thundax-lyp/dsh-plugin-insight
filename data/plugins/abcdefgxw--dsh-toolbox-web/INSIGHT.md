# dsh-toolbox-web

> 在 Web 管理会话、回收站、搜索与配置，并提供后台定时心跳。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[c915fdb](https://github.com/AbcdefgXW/dsh-toolbox-web/tree/c915fdb857bea9380ed0c181169d43c8350c4d7e)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web) [![npm 30d 1,058](https://img.shields.io/static/v1?label=npm+30d&message=1%2C058&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web) [![最新发布 2026-09-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-toolbox-web)
<!-- END META -->

**使用建议**：可按只读搜索和会话整理需求分功能评估；在线编辑/截断原会话需要先解决代际与并发一致性，不能仅因带回收站就视为全程可逆。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：DSH操作者集中整理大量会话、恢复误删内容或定时唤醒任务；管理结果应可恢复且与宿主持久状态一致。

- **建议**：将编辑/截断迁到宿主版本化事务接口，先确认目标代和快照摘要、可靠备份成功再写，并让恢复成为同事务操作，可能减少旧代修改和并发丢事件。用v3日志、运行中追加、备份失败和进程中断案例要求不写错代且原事件完整；若宿主无事务接口，应限制为离线导出编辑而非在线覆盖。

可按只读搜索和会话整理需求分功能评估；在线编辑/截断原会话需要先解决代际与并发一致性，不能仅因带回收站就视为全程可逆。

核查状态：管理RPC、文件回收/改写与心跳路径源码支持；恢复完整性、宿主并发一致性和规模效果未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

宿主会话操作、索引查询和离线备份脚本；本项统一UI与后台心跳，核心存储格式仍需宿主契约保障。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：通过typert/localStore声明ToolsApi管理RPC，非额外手写HTTP路径。
- **界面**：会话/回收站/搜索/配置等Web工具箱入口。
- **后台**：间隔/定点心跳与回收站保留期清理，可选msg-hub渠道任务。

**流程与依赖**

Host通过ToolsApi服务和typert invocations暴露管理操作，前端调用；回收站移动数据和meta，跨设备复制后删除；搜索逐帧解压并可用官方索引，设置独立JSON。后台timer根据配置给live Agent followup，渠道目标可经msg-hub task转发。对话编辑/截断直接解压再重写会话文件。

DSH agents/session API、typert/localStore、Web运行时、Node zstd与文件权限；msg-hub和embedding可选，后台只在Host存活时运行。

Web触发RPC→读取/移动/改写文件→返回结果；后台按间隔/定点配置唤醒目标live Agent或渠道task，目标缺失记失败。回收站可恢复/过期清理，恢复目标冲突加后缀。

MIT Web bundle，Node>=22.13用于zstd；官方包随宿主版本，js-yaml配置校验。默认Linux路径在macOS/Windows需显式DSH_HOME/工作区配置。

**效果与成本**

现金：启用心跳额外模型调用，可选embedding远程API；人工：配置路径/保留期、核对编辑与恢复。回收站30天默认清理、搜索解压内存及缓存需纳入部署预算，作者性能未复现。

减少散落脚本管理，给误删恢复入口；不保证删除/编辑事务安全或定时任务成功完成，“已注入”只表明followup写出。

- **思考**：管理操作是否与正在运行的宿主持久化一致？messages列表使用resolveSessionLog最高代，编辑/截断却硬编码session.jsonl.zstd，可能改旧代；backup失败返回null仍继续写原文件，写入非rename且无expected revision/live会话锁。回收站先移动后写meta也有中途失败窗口；UI默认关闭某功能不等于后端授权，RPC方法自身只作参数校验。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把会话整理、可恢复删除与定时任务入口集中到一个Web工具箱；回收站比直接rm多恢复路径，逐帧搜索避免长期保留整份解压文本。业务增量在运维操作的集中化，不是新会话存储引擎；原生索引/fork能力归宿主。

把会话整理、可恢复删除与定时任务入口集中到一个Web工具箱；回收站比直接rm多恢复路径，逐帧搜索避免长期保留整份解压文本。业务增量在运维操作的集中化，不是新会话存储引擎；原生索引/fork能力归宿主。

逐帧按seq取片段、回收站跨设备移动兼容、JSON配置临时写rename值得借鉴；但消息写路径与新代日志读取不一致，备份失败未阻止改写。心跳结果应区分注入与完成。

固定源码依据：[index.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/index.js)、[client.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/client.js)、[lib/trash.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/trash.js)、[lib/messages.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/messages.js)、[lib/search.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/search.js)、[lib/config.js](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/lib/config.js)、[package.json](https://github.com/AbcdefgXW/dsh-toolbox-web/blob/c915fdb857bea9380ed0c181169d43c8350c4d7e/package.json)。

<a id="detail-section-5"></a>

### 主要限制

管理操作是否与正在运行的宿主持久化一致？messages列表使用resolveSessionLog最高代，编辑/截断却硬编码session.jsonl.zstd，可能改旧代；backup失败返回null仍继续写原文件，写入非rename且无expected revision/live会话锁。回收站先移动后写meta也有中途失败窗口；UI默认关闭某功能不等于后端授权，RPC方法自身只作参数校验。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.29；版本日期：2026-09-16（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[c915fdb8](https://github.com/AbcdefgXW/dsh-toolbox-web/tree/c915fdb857bea9380ed0c181169d43c8350c4d7e)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根Host RPC/心跳、trash、messages持久改写、search帧读取和config模块，以及client入口/README；未审计所有管理/embedding实现，不将广泛功能列表当全部已核。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

将编辑/截断迁到宿主版本化事务接口，先确认目标代和快照摘要、可靠备份成功再写，并让恢复成为同事务操作，可能减少旧代修改和并发丢事件。用v3日志、运行中追加、备份失败和进程中断案例要求不写错代且原事件完整；若宿主无事务接口，应限制为离线导出编辑而非在线覆盖。

未运行目标；最小验证应注入v3会话、并发append、备份失败、移动后meta失败以及心跳未完成情况，再测大量历史搜索峰值内存。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 14 | 6557 | 5648 | 683 | — |
| .md | source | 2 | 369 | — | — | 4365 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A17.359Z..2026-10-21T05%3A34%3A17.359Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbcdefgXW/dsh-toolbox-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A34%3A17.359Z..2026-10-21T05%3A34%3A17.359Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
