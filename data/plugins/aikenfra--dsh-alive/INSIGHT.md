# dsh-alive

> 在会话头部轮询本地 ping 接口，显示在线状态点。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d17acfa](https://github.com/AikenFra/dsh-alive/tree/d17acfa8689666d799c94e196020a3efed11ad0a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/AikenFra/dsh-alive) [![npm 30d 848](https://img.shields.io/static/v1?label=npm+30d&message=848&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-alive) [![最新发布 2026-09-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-alive)
<!-- END META -->

**使用建议**：仅需Host连接提示时可评估；已有宿主连接指示或需要模型可用性监控者，先确认它是否提供额外信息。

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

- **用途**：Web用户想知道浏览器能否连到当前Host，不必发一条模型消息探活；交付是HTTP可达性提示。

- **建议**：把标签改为Host可达并附最近成功时间，给每次fetch明确截止且显示stale，可能减少错误健康判断。用Host正常但模型失败、HTTP挂起和代理返回200 HTML案例，要求不声称模型在线且超时进入未知；若仍保留旧绿色则假设失败。

仅需Host连接提示时可评估；已有宿主连接指示或需要模型可用性监控者，先确认它是否提供额外信息。

核查状态：HTTP探活与状态点源码可确认；未运行网络/浏览器，模型服务可用性不在探测范围。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

浏览器重载、宿主原生连接提示或普通HTTP监控；此处只是会话头部可见入口。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：/dsh-alive/ping进程内HTTP应答。
- **界面**：会话header在线/离线/检测中状态点及15秒轮询。

**流程与依赖**

Host注册/dsh-alive/ping并返回200和时间戳；client挂header.utilities组件，首次及每15秒fetch，按HTTP ok更新online/offline，卸载清timer。

DSH webServer、Web slots/React与fetch，不需模型或账号配置。

组件挂载→ping→按HTTP状态更新→每15秒再查→卸载清timer；无重启自动恢复watcher或告警服务。

DSH Web bundle，Host可选注入webServer，client需要slots/React；不是桌面/模型网关健康服务。

**效果与成本**

现金无模型调用；人工近于安装维护与理解状态范围，15秒轮询有少量HTTP/组件成本，挂起请求未限时。

避免用模型调用检查本地HTTP；无法保证模型、工具、任务和认证链正常。

- **思考**：绿色是否被误解成DeepSeek模型在线？client只看r.ok，不核响应JSON或模型/API状态；Host存活而模型认证/限额/上游断网仍绿色。fetch无timeout/AbortController，连接挂住时旧online可长期保留，固定interval可能叠请求，所以README“挂了立刻变红”超过实现保证。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：以不调用LLM的本地探活替代发消息测服务，成本与提示语义简单；增量是宿主slot接入，不是端到端健康检查。只要明确信号范围，它可辅助区分页面到Host的连接。

以不调用LLM的本地探活替代发消息测服务，成本与提示语义简单；增量是宿主slot接入，不是端到端健康检查。只要明确信号范围，它可辅助区分页面到Host的连接。

两面代码很小、effect清理timer，alive标记阻止卸载后setState；缺少请求截止与新鲜度状态，HTTP错误与上游模型错误不应混用。

固定源码依据：[dsh/index.js](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/dsh/index.js)、[client/client.js](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/client/client.js)、[package.json](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/package.json)、[cordis.patch.yml](https://github.com/AikenFra/dsh-alive/blob/d17acfa8689666d799c94e196020a3efed11ad0a/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

绿色是否被误解成DeepSeek模型在线？client只看r.ok，不核响应JSON或模型/API状态；Host存活而模型认证/限额/上游断网仍绿色。fetch无timeout/AbortController，连接挂住时旧online可长期保留，固定interval可能叠请求，所以README“挂了立刻变红”超过实现保证。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.2；版本日期：2026-09-09（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[d17acfa8](https://github.com/AikenFra/dsh-alive/tree/d17acfa8689666d799c94e196020a3efed11ad0a)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根dsh/index.js和client/client.js两条实现路径、README及包清单；未检查真实部署、模型上游或宿主原生连接提示是否重复。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

把标签改为Host可达并附最近成功时间，给每次fetch明确截止且显示stale，可能减少错误健康判断。用Host正常但模型失败、HTTP挂起和代理返回200 HTML案例，要求不声称模型在线且超时进入未知；若仍保留旧绿色则假设失败。

未运行；拟检查HTTP挂起/断网/代理200与上游模型故障，分别记录可达、响应有效和新鲜度。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 80 | 68 | 6 | — |
| .md | source | 1 | 89 | — | — | 639 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AikenFra/dsh-alive/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AikenFra/dsh-alive/issues?q=is%3Aissue+created%3A2026-09-21T07%3A59%3A11.423Z..2026-10-21T07%3A59%3A11.423Z)

暂未获取：近30天关闭。

统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
