# dsh-web-lan-access

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[dd1bb47](https://github.com/AcidGr/dsh-web-lan-access/tree/dd1bb4766725b985330da906154adcf435e2c439)

<!-- BEGIN META -->
[![GitHub ★ 39](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=39&color=yellow&logo=github&style=flat)](https://github.com/AcidGr/dsh-web-lan-access) [![npm 30d 1,470](https://img.shields.io/static/v1?label=npm+30d&message=1%2C470&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-web-lan-access)
<!-- END META -->

> **实现功能**：让DSH网页监听全部网卡，并为局域网页面提供Host能力声明与地址信任配置。

> **核心亮点**：将监听、Host地址围栏与客户端能力声明配套，解决只加载页面但API/设置不可用的问题。网络服务和权限机制来自宿主，插件主要是兼容适配。

> **风险与缺陷**：能访问是否等于已认证？trustedHosts按本机地址生成、ownsHost是页面声明，均不鉴别人或设备。通配监听还主动解除宿主原有限制；有VPN网卡不等于所有可达请求可信。

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

> **用途**：可信私网内跨设备访问DSH，要求能打开设置且访问边界明确。

显式绑定单一私网地址或经认证代理更窄；此方案方便多网卡，增加暴露范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：继承WebServer监听与index tap接线。
- **界面**：远程页面Host transport声明。

**流程与依赖**

DSH webServer/webStartup/connection与os.networkInterfaces；认证和TLS需部署层另行负责。

禁用默认监听器，挂子类监听全部接口，重建trustedHosts，页面启动时声明Host所有权并使用普通fetch。

**效果与成本**

无模型费；首次网络/认证配置，持续宿主升级及网络边界运维成本。

减少远程接入的配置断点，未证明安全部署或跨设备效率。

> **思考**：能访问是否等于已认证？trustedHosts按本机地址生成、ownsHost是页面声明，均不鉴别人或设备。通配监听还主动解除宿主原有限制；有VPN网卡不等于所有可达请求可信。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将监听、Host地址围栏与客户端能力声明配套，解决只加载页面但API/设置不可用的问题。网络服务和权限机制来自宿主，插件主要是兼容适配。

将监听、Host地址围栏与客户端能力声明配套，解决只加载页面但API/设置不可用的问题。网络服务和权限机制来自宿主，插件主要是兼容适配。

用loopback重验保留端口/TLS等约束、tap清理可借鉴；依赖错误文本和隐式网卡信任需回归。 源码依据：[lib/index.js](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/index.js)、[lib/webserver.js](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/lib/webserver.js)、[cordis.patch.yml](https://github.com/AcidGr/dsh-web-lan-access/blob/dd1bb4766725b985330da906154adcf435e2c439/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

能访问是否等于已认证？trustedHosts按本机地址生成、ownsHost是页面声明，均不鉴别人或设备。通配监听还主动解除宿主原有限制；有VPN网卡不等于所有可达请求可信。

<a id="detail-section-6"></a>

### 1.5 使用建议

只在已有可信访问控制的临时私网环境核查；先证明未认证请求不能写宿主，再考虑日常远程使用。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AcidGr/dsh-web-lan-access](https://github.com/AcidGr/dsh-web-lan-access)
- **版本号**：1.4.0（[固定提交 dd1bb476](https://github.com/AcidGr/dsh-web-lan-access/tree/dd1bb4766725b985330da906154adcf435e2c439)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/webserver.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/webserver.js、cordis.patch.yml；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：最小验证比较普通页面与未认证远程请求的读写能力，加入VPN/换IP并重载，卸载后重启检查恢复。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由三层接线推导，可将远程能力声明绑定短期认证会话及允许接口清单，保持监听地址与用户身份分离。未验证；无凭据、过期会话和新网卡加入均应不能取得Host写能力，否则否定。

最小验证比较普通页面与未认证远程请求的读写能力，加入VPN/换IP并重载，卸载后重启检查恢复。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：1d0a91c9f7c4f0b92b5fa0b3d4df933557aa4ca6b4ec0c1b971d09f8db9bcf50。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 212 | 77 | 121 | — |
| .md | source | 2 | 387 | — | — | 3975 |
| .js | test | 1 | 106 | 94 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AcidGr/dsh-web-lan-access/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
