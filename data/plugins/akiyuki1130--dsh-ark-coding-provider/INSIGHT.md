# dsh-ark-coding-provider

> 将方舟Coding Plan聊天、模型目录、账户轮换与额度管理接入DSH。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a412af3](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/a412af3f085afe7989d1386efb426e3e4a1c3d8a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
<!-- END META -->

**使用建议**：适合已有方舟订阅者先做隔离模型/工具链测试；作者容量实测不等于本轮验证，也不代表服务今后不变。

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

- **用途**：有方舟订阅的DSH用户使用其兼容端点与多账户管理。

- **建议**：未验证假设：将模型能力记录绑定探测日期/端点，并在兼容性漂移时显式降级，能减少静态目录误承诺。用系统指令、工具回灌、图片、半流中断及额度失败矩阵核语义与重放边界；无安全重放证据时不做输出后自动重试。

适合已有方舟订阅者先做隔离模型/工具链测试；作者容量实测不等于本轮验证，也不代表服务今后不变。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照OpenAI兼容适配器与作者所述commandcode-provider形态；协议、模型与官方arkcli归上游，本项做DSH转换及账户生命周期。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：ark-coding LLM适配、账户轮换与模型发现
- **界面**：方舟模型/账户设置和quota卡片

**流程与依赖**

LlmAdapter映射消息/图片/工具与SSE，注册ark-coding、configurable provider和discovery；仅未输出chunk时对额度/认证/限流轮换账户；设置远程服务管理凭据、安装固定arkcli1.0.39并取官方quota。

宿主llm/credentials/attachments和远程UI协议、方舟账号/订阅/网络；CLI安装和SSO/AKSK额度链另需，API key聊天不自动有quota。

配置账户→可选CLI登录/目录quota→选模型→翻译请求→SSE→必要时输出前换账户→返回usage；取消传播，输出后失败原样抛。

**效果与成本**

订阅现金与多账户维护分列；CLI安装会联网执行上游安装流程，图片投影与重试有带宽/延迟，人工核账号/模型能力变化。

完整适配链有源码支持，无本轮兼容端到端或费用收益验证。

- **思考**：轮换以“任何chunk已发出”为保守界限，可避免重复输出，但不保证所有传输失败恢复；模型能力来自固定表与作者探测，不是每次discovery都重测容量。可配置apiBase会把key发往所填端点，CLI/账号生命周期仍是额外信任依赖。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把协议细节、账户冷却与凭据/官方quota入口组合，避免简单兼容URL配置遗漏系统指令和多轮工具语义；不是新LLM协议或模型能力。

把协议细节、账户冷却与凭据/官方quota入口组合，避免简单兼容URL配置遗漏系统指令和多轮工具语义；不是新LLM协议或模型能力。

options.system保留、工具type重建、单请求图片映射、首字节/idle超时、8MiB SSE行上限和输出后不轮换是具体机制。

源码依据：[index.js](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/index.js)、[models.js](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/models.js)、[accounts.js](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/accounts.js)、[arkcli.js](https://github.com/Akiyuki1130/dsh-ark-coding-provider/blob/a412af3f085afe7989d1386efb426e3e4a1c3d8a/arkcli.js)。

<a id="detail-section-5"></a>

### 主要限制

轮换以“任何chunk已发出”为保守界限，可避免重复输出，但不保证所有传输失败恢复；模型能力来自固定表与作者探测，不是每次discovery都重测容量。可配置apiBase会把key发往所填端点，CLI/账号生命周期仍是额外信任依赖。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[Akiyuki1130/dsh-ark-coding-provider](https://github.com/Akiyuki1130/dsh-ark-coding-provider)
- **版本号**：0.5.0（[固定提交 a412af3f](https://github.com/Akiyuki1130/dsh-ark-coding-provider/tree/a412af3f085afe7989d1386efb426e3e4a1c3d8a)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

- 已检查：index.js、models.js、accounts.js、arkcli.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：未来隔离账号/模拟SSE核取消、轮换、能力表与CLI版本；本轮未装CLI或访问付费模型。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：将模型能力记录绑定探测日期/端点，并在兼容性漂移时显式降级，能减少静态目录误承诺。用系统指令、工具回灌、图片、半流中断及额度失败矩阵核语义与重放边界；无安全重放证据时不做输出后自动重试。

未来隔离账号/模拟SSE核取消、轮换、能力表与CLI版本；本轮未装CLI或访问付费模型。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ceaf8b72c74e4bc54e57f4844c055b44aa91f906ea2006486fdb38da8e9dbb87。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 6750 | 4869 | 1521 | — |
| .md | source | 1 | 441 | — | — | 8106 |
| .mjs | test | 7 | 4425 | 3641 | 588 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Akiyuki1130/dsh-ark-coding-provider/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
