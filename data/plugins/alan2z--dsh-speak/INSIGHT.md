# dsh-speak

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[5c23e7d](https://github.com/Alan2Z/dsh-speak/tree/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee)

<!-- BEGIN META -->
[![GitHub ★ 18](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=18&color=yellow&logo=github&style=flat)](https://github.com/Alan2Z/dsh-speak) [![npm 30d 1,659](https://img.shields.io/static/v1?label=npm+30d&message=1%2C659&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-speak) [![最新发布 2026-09-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-speak)
<!-- END META -->

> **实现功能**：将助手回复与可选事件交给本机语音引擎播报，提供队列状态与重播。

> **核心亮点**：将播报生命周期与会话消息身份关联，单进程队列比每消息直接spawn更一致；语音合成归系统引擎，PR队列机制明确归上游贡献。

> **风险与缺陷**：队列全局且enqueue无容量/过期限制，多会话高频消息可能延迟播报过时提醒；控制/WS路由未在本包独立核来源，依赖宿主栅栏。日志含正文片段，不能把本地处理等同无留痕。

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

> **用途**：离开屏幕时听回复和审批提醒，重要细节仍回到原文核查。

参照系统say/SAPI与直接逐消息朗读；项目合并作者原实现和victorwads队列/重播贡献，增量在宿主事件与统一语音状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：会话回复、审批及可选状态播报
- **后台**：本机TTS FIFO与子进程管理
- **Host 路由**：播报控制及状态WebSocket
- **界面**：重播动作与语音设置

**流程与依赖**

session/event抽文本，默认节流最终回复或逐消息入FIFO，单个原生进程运行；临时文件传给macOS shell或Windows PowerShell，WebSocket发布当前item，POST控制播放/停止。

宿主session/event/webServer/configForms、ws、schemastery，macOS say/Perl或Windows SAPI/PowerShell及本地声音；Linux无等价引擎分支。

事件→过滤与节流→全局队列→临时文本→系统TTS→进程退出清理→下项；用户可停止或替换重播，队列状态同步UI。

**效果与成本**

无云TTS费用但文本写临时文件、日志记录前80字符且可被周围听见；队列积压/长文占时间，人工仍回看代码与被摘要内容。

本地播报和队列有源码支持，无可达性或任务完成效率实测。

> **思考**：队列全局且enqueue无容量/过期限制，多会话高频消息可能延迟播报过时提醒；控制/WS路由未在本包独立核来源，依赖宿主栅栏。日志含正文片段，不能把本地处理等同无留痕。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将播报生命周期与会话消息身份关联，单进程队列比每消息直接spawn更一致；语音合成归系统引擎，PR队列机制明确归上游贡献。

将播报生命周期与会话消息身份关联，单进程队列比每消息直接spawn更一致；语音合成归系统引擎，PR队列机制明确归上游贡献。

队列统一自动/手动item、token防旧进程退出篡改新状态、macOS进程组停止可借鉴；语音进程存在不证明实际扬声器成功输出。

源码依据：[adapters/dsh/speech-hook.js](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/adapters/dsh/speech-hook.js)、[client/client.js](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/client/client.js)、[engine/speak.sh](https://github.com/Alan2Z/dsh-speak/blob/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee/engine/speak.sh)。

<a id="detail-section-5"></a>

### 1.4 主要限制

队列全局且enqueue无容量/过期限制，多会话高频消息可能延迟播报过时提醒；控制/WS路由未在本包独立核来源，依赖宿主栅栏。日志含正文片段，不能把本地处理等同无留痕。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合本机听取提醒；先核播报范围、隐私、停止与长文策略，不依赖声音代替审批原文。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[Alan2Z/dsh-speak](https://github.com/Alan2Z/dsh-speak)
- **版本号**：1.8.2（[固定提交 5c23e7d9](https://github.com/Alan2Z/dsh-speak/tree/5c23e7d934fd5a72ae481bdda729ff3d44ab42ee)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

- 已检查：adapters/dsh/speech-hook.js、client/client.js、engine/speak.sh、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来固定系统声音核队列积压、停止清理、跨会话身份、路由授权和隐私配置；本轮未播放语音。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：按会话/事件优先级和时效丢弃过期普通播报，并保留审批原文链接，可降低队列延迟而不漏重要提醒。用多会话长文/取消审批比较提醒时延、漏报和可追溯性；高优先级被饿死则否定。

未来固定系统声音核队列积压、停止清理、跨会话身份、路由授权和隐私配置；本轮未播放语音。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：413a48c3e7132257e7f38559f4e63152409cfc6f60f4b1a34453b8e4783dfeca。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 2771 | 1955 | 695 | — |
| .md | source | 4 | 1911 | — | — | 19817 |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/Alan2Z/dsh-speak/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
