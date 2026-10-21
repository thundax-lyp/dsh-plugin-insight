# dsh-zspace

> 将极空间 NAS 文件管理与容器诊断能力接入 DSH，自动选择直连或中转。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[7074390](https://github.com/439436269-ctrl/dsh-zspace/tree/70743909450191c09f3dcef15d46d8d0119200a9)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/439436269-ctrl/dsh-zspace) · [![npm 30d 1242](https://img.shields.io/static/v1?label=npm+30d&message=1%2C242&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-zspace) · [![首次发布 2026-10-06](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-10-06&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-zspace)
<!-- END META -->

**使用建议**：先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。

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

- **用途**：已有极空间NAS的用户在本地或远程网络用会话管理文件与诊断容器；交付是核实后的文件状态和设备状态。

先用只读列表、stat及测试文件评估；重要写入和删除固定通道并核对结果，网络失败后确认实际状态再重试。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工极空间客户端、单通道WebDAV；跨网络收益来自桌面客户端已有中转，不归为插件新协议。

通过已登录桌面客户端中转或WebDAV访问同一工具面；router按PROPFIND可达性选路，网络失败冷却后同调用回退中转；删除等工具有显式confirm。


极空间NAS权限、运行且登录的桌面客户端与其本地API；WebDAV直连需服务和环境变量凭据，DSH模型工具注册。

status确认当前通道和根路径，读取与扫描，必要时执行明确文件变更再stat复核；容器异常先做真实进程健康检查，再判断操作或人工恢复。

需要既有NAS与桌面客户端/账号，WebDAV可选；人工为权限、映射、凭据、变更核对和恢复，故障回退增加延迟和重复操作风险。

统一网络路径减少手工切换；自动选路可用性不应掩盖不同变更语义和未知执行结果。

- **模型工具**：NAS文件读写/移动/删除、容器查询和健康诊断

- **思考**：自动回退对读取和写入并不等价。router将remove/move/copy/upload等均路由，WebDAV请求已生效但响应超时仍可能在relay重试，存在结果未知后重复副作用；两通道删除回收站语义也不同。confirm=true是参数条件，不能代替用户意图确认或幂等保证。

<a id="detail-section-4"></a>

### 工程贡献

router将可达性、冷却和传输错误分类集中；工具按单能力拆分，健康诊断保留探针可信度。复用需另加变更幂等/结果核对，不能无差别套用读操作回退。 源码依据：[lib/client/router.js](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/client/router.js#L63)、[lib/tools/remove.js](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/tools/remove.js#L7)、[lib/tools/docker-health.js](https://github.com/439436269-ctrl/dsh-zspace/blob/70743909450191c09f3dcef15d46d8d0119200a9/lib/tools/docker-health.js#L23)。

- **亮点**：相对手工NAS界面或单WebDAV连接，将跨网络桌面中转与局域网直连封装为同一模型工具面；容器健康用真实进程列表区别于表面running，避免把探针没运行解释为健康。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[439436269-ctrl/dsh-zspace](https://github.com/439436269-ctrl/dsh-zspace)
- **版本号**：0.4.0（[固定提交 7074390](https://github.com/439436269-ctrl/dsh-zspace/tree/70743909450191c09f3dcef15d46d8d0119200a9)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：区分只读可重试与变更结果未知，变更超时先核对目标摘要/存在性再决定回退，可减少重复写与跨通道语义漂移。由通用dispatch及删除语义差异推导，核对需额外请求且并发写时可能仍未知。

最小验证：可控NAS测试目录中让WebDAV变更成功后丢弃响应，观察relay回退是否重复；比较变更核对方案的重复文件、错误删除及未知率，无法判定时保持unknown。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 618 | — | — | 9835 |
| .js | source | 43 | 4789 | 3056 | 1443 | — |
| .js | test | 4 | 1940 | 1596 | 214 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-zspace/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
