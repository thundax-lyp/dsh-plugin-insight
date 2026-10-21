# dsh-plugin-namecards

> 为 DSH 插件列表添加本地名片、中文备注、图标、文件夹和收藏。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c7d92ef](https://github.com/3Tiga3/dsh-plugin-namecards/tree/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/3Tiga3/dsh-plugin-namecards) [![npm 30d 860](https://img.shields.io/static/v1?label=npm+30d&message=860&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards) [![首次发布 2026-10-18](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-namecards)
<!-- END META -->

**使用建议**：插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。

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

- **用途**：安装插件较多的用户按自己的用途命名分组、查找并启停插件，交付是可迁移的个人管理布局。

插件较多且愿意维护个人目录的用户可评估；启停前核对真实包名，导出备份后再迁移布局。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照官方插件列表和手工记名；未确认其他名片管理器独立效果。

宿主包装pluginManager.listBundles返回展示字段，名片布局保存在cards.json；本地HTTP处理导入导出和图标，启停转调官方manager方法。


DSH webServer、pluginManager及客户端插件管理面；本地数据目录可写，内部接口兼容需持续核查。

读本地名片，按包身份装饰列表，用户编辑分组/图标并保存；导出迁移，启停请求调用官方manager，按宿主要求重启。

本地图标和JSON存储；人工为备注维护、导入冲突及宿主内部接口适配，未测大列表查找工时。

个人分类可能改善可发现性，不能从自动图标推断功能与可靠性。

- **Host 路由**：本机名片、图标与布局导入导出
- **界面**：插件名片、分组、收藏和官方启停入口

- **思考**：名片覆盖可能遮蔽上游身份和说明，特别是同名备注；启停不是单纯展示操作，实际效果仍由官方manager与重启决定。HTTP仅检查loopback不能等同完整浏览器来源隔离，仍需核查部署代理的边界。

<a id="detail-section-4"></a>

### 工程贡献

归一化限制文本、图标与键数量，临时文件rename写入，迁移保留旧目录；包装manager时记录并在dispose恢复原函数。复用需维护生命周期及稳定身份。 源码依据：[lib/index.js](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/index.js#L563)、[lib/client.js](https://github.com/3Tiga3/dsh-plugin-namecards/blob/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e/lib/client.js#L1067)。

- **亮点**：相对官方平铺列表，将个人解释与上游包元数据分离，允许用户本地维护备注和分组；导出含图标与布局便于迁移，不需要修改每个插件源文件。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[3Tiga3/dsh-plugin-namecards](https://github.com/3Tiga3/dsh-plugin-namecards)
- **版本号**：0.6.2（[固定提交 c7d92ef](https://github.com/3Tiga3/dsh-plugin-namecards/tree/c7d92efb00e61c2062afe2a1aa6e67a4a7edc85e)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：编辑与展示同时保留不可改包名和生效/待重启状态，能降低备注导致的误启停；由展示覆盖与官方启停委派组合推导，代价是紧凑列表多占空间。

最小验证：准备同备注不同包、待重启启停和导入旧布局任务，比较保留真实身份/生效状态前后误操作与查找时间；不改善误操作则否定。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2136 | 1892 | 83 | — |
| .md | source | 1 | 70 | — | — | 840 |
| .mjs | test | 2 | 449 | 403 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/3Tiga3/dsh-plugin-namecards/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
