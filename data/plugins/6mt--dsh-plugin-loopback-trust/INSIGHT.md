# dsh-plugin-loopback-trust

> 为反向代理域名访问的DSH网页恢复宿主设置持久化。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[838ddf0](https://github.com/6mt/dsh-plugin-loopback-trust/tree/838ddf0d79fb977be896c6cb5dcd0bba68015832)

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/6mt/dsh-plugin-loopback-trust)
<!-- END META -->

**使用建议**：仅适合已经配置访问控制的自管反代管理员核查后试用。先验证未授权访问被反代阻止，再验证设置保存与卸载恢复；公开匿名实例不宜启用。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
  - [远程接入的身份边界比较](#detail-section-7)
- [未来设计假设（未验证）](#detail-section-8)
- [辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：自管DSH经反向代理域名访问时，管理员需要修改模型与持久设置；合格结果是刷新后保留设置，且访问域仍满足部署方信任条件。

- **建议**：由全页布尔信任替代细分权限推导，可改为服务端签发、绑定会话与origin的设置能力声明，客户端仅在验证声明后开放持久化。相比伪造loopback可减少代理配置与权限分类不一致，但需要宿主协议改造；未验证。以受信任/未授权origin与过期会话测试，若未授权仍可开放设置则否定方案。

仅适合已经配置访问控制的自管反代管理员核查后试用。先验证未授权访问被反代阻止，再验证设置保存与卸载恢复；公开匿名实例不宜启用。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

本机loopback访问无需补丁；宿主原生trusted-host能力若覆盖前端分类更适合长期维护。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：启动时修改网页连接信任事实。

**流程与依赖**

依赖DSH客户端ModuleLoader、__DSH_TRANSPORT__与connection私有字段；反代认证是兑现安全使用的必要条件，不由此插件提供。

安装重启与硬刷新后客户端设置宿主事实，用户修改设置再刷新验收；若启动顺序漂移需重载或移除插件。

**效果与成本**

无额外服务订阅；首次成本集中在反代认证与升级兼容检查。运行不增加模型调用，但若错误授权导致设置被改，恢复成本不可从代码估算。

可减少域名访问下设置丢失和人工宿主补丁；没有实际部署验收或节省时间证据。

- **思考**：恢复持久化所依赖的信任是否与实际来源匹配？client.js对所有非loopback且无已有transport的页面设ownsHost，不按域名白名单判断。它保留服务器Host围栏，但前端能力分类已被放宽；因此有效性依赖反代认证和受信任访问者，不能把设置可写解释为部署安全得到增强。README兼容段残留<0.2表述而package实际<0.3，也需以安装清单核实。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对用户反复改内存设置或直接修补宿主，插件把反代网页的宿主拥有者事实作为独立客户端适配，零额外服务。它修复的是访问分类与持久设置的衔接，不提供新的认证或设置存储。

相对用户反复改内存设置或直接修补宿主，插件把反代网页的宿主拥有者事实作为独立客户端适配，零额外服务。它修复的是访问分类与持久设置的衔接，不提供新的认证或设置存储。

早期注入与后期缓存失效构成两层接线，避免覆盖桌面传输；可借鉴最小兼容补丁；移除后仍需整页重载使全局事实恢复，撤销行为待验证。代价是修改全局私有协议与只读属性，启动时序或宿主缓存结构变化会破坏收益。 源码依据：[client.js](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js)、[index.js](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/index.js)、[package.json](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/package.json)。

<a id="detail-section-5"></a>

### 主要限制

恢复持久化所依赖的信任是否与实际来源匹配？client.js对所有非loopback且无已有transport的页面设ownsHost，不按域名白名单判断。它保留服务器Host围栏，但前端能力分类已被放宽；因此有效性依赖反代认证和受信任访问者，不能把设置可写解释为部署安全得到增强。README兼容段残留<0.2表述而package实际<0.3，也需以安装清单核实。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[6mt/dsh-plugin-loopback-trust](https://github.com/6mt/dsh-plugin-loopback-trust)
- **版本号**：0.1.1（[固定提交 838ddf0d](https://github.com/6mt/dsh-plugin-loopback-trust/tree/838ddf0d79fb977be896c6cb5dcd0bba68015832)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 client.js、index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：在隔离反代实例验证匿名/已认证访问、保存刷新、桌面transport不覆盖、插件移除后恢复原分类；不写真实生产凭据。

<a id="detail-section-7"></a>

### 远程接入的身份边界比较

围绕反向代理访问自管DSH的同一场景，chicheng-gate在HTTP与WebSocket入口提供密码会话门禁，同时调整宿主信任与官方文件；loopback-trust只在客户端赋予ownsHost事实，不提供认证。两者解决不同接缝，组合后设置可写仍不能证明请求者身份正确或全部入口都被保护。该比较仅来自固定源码，未部署二者组合，也不构成端到端安全验收。维护取舍是独立门禁的部署/补丁负担与客户端私有协议的升级耦合。应在隔离实例以匿名/已认证、HTTP/WS、会话过期及宿主升级构造访问矩阵；若任何未授权请求仍获得设置写入能力，应否定组合满足访问边界的假设。

比较源码：[gate门禁与宿主适配](https://github.com/534119219/chicheng-gate/blob/cfee329acf7f886749469779259a6a9147a2b190/lib/index.js)；[loopback客户端信任适配](https://github.com/6mt/dsh-plugin-loopback-trust/blob/838ddf0d79fb977be896c6cb5dcd0bba68015832/client.js)。

<a id="detail-section-8"></a>

## 未来设计假设（未验证）

由全页布尔信任替代细分权限推导，可改为服务端签发、绑定会话与origin的设置能力声明，客户端仅在验证声明后开放持久化。相比伪造loopback可减少代理配置与权限分类不一致，但需要宿主协议改造；未验证。以受信任/未授权origin与过期会话测试，若未授权仍可开放设置则否定方案。

在隔离反代实例验证匿名/已认证访问、保存刷新、桌面transport不覆盖、插件移除后恢复原分类；不写真实生产凭据。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：2f43d6bdb72cb9430b098a720e02f491d043339135ed3a58ef245224db6b1d62。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 224 | — | — | 1592 |
| .js | source | 2 | 74 | 37 | 34 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/6mt/dsh-plugin-loopback-trust/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
