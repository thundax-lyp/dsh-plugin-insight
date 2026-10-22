# dsh-subagent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[679dd4f](https://github.com/1373700184/dsh-subagent/tree/679dd4fb7838fcb473c8b368e20aa24a43af99aa)

<!-- BEGIN META -->
[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent) · **脚本有更新，待重新洞察**
<!-- END META -->

> **实现功能**：把 Qoder、OpenCode、Pi、CodeBuddy 等 CLI 接到 DSH 子代理。

> **核心亮点**：相比在多个终端搬运任务，插件统一委派句柄、驱动事件与父侧状态，并把外部模型链嵌入DSH。DRIVERS/sink分离减少生命周期重复；外部CLI能力与宿主子代理helper归上游，后端数量和“免费”preset名称都不证明质量或低成本。

> **风险与缺陷**：归一的completed是否可靠？OpenCode/Pi的usesResultEvent=false使exit0且无timeout即可完成，error事件仅记账；首JSON后直接await handle.result，allowedWaitSeconds不是全程硬截止。POSIX取消仅杀直接子进程，末尾无换行stdout没有flush。默认bypass_permissions并自动失败换模型时，任务副作用可能重复。

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

> **用途**：已有各CLI账号环境的开发者把可独立验收的任务委派出去，父侧取得最终文本、进度和文件变化；上下文必须显式交接。

直接在终端运行CLI再粘贴结果；本项统一委派监督但没有继承上下文或共享事务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Agent/Preset**：patch定义free-subagents指挥preset，组合现有宿主工具。
- **模型工具**：五个外部CLI委派工具由上游tool-subagent绑定，另有free_subagent_status运行查询。
- **用户命令**：按provider名称commands.register向父会话发送委派followup，/free_subagent_status直接查询内存账本。
- **Host 路由**：设置页CLI探测RPC。
- **界面**：配置页及工具调用进度呈现。
- **后台**：外部CLI子进程执行、事件账本和模型链回退。

**流程与依赖**

Provider/Run复用DSH子代理helper，DRIVERS把qoder-json/codebuddy-json/opencode-json/pi-json归一到sink；stdin传任务，一次性进程收集JSON行。模型链按首事件等待决定切换，有界内存账本支撑状态查询；patch还注册五个委派工具和free-subagents preset。

DSH subagents/commands/tools/web client服务、对应已安装登录CLI和工作目录权限；缺二进制在启动/探测阶段暴露。

用户命令或父工具委派→显式prompt→启动CLI→按首事件/失败切模型→最终文本回父侧→人工核对变更；状态查询显示截断账本。

bundle默认五委派工具并带自由子代理preset；README安装段仍说两个工具，报告以固定patch为准。四驱动一次性，不继承父上下文、不提供续话或结构化输出保证。

**效果与成本**

现金由各CLI订阅/API、回退次数决定，内置credits/rates不是结算凭证；人工包括登录、版本适配、补齐上下文和结果验收。有界24次运行/200事件的内存账本不能长期审计。

核心是统一外部执行的可见性与委派接口，省时省钱和编码质量必须按具体任务测量。

> **思考**：归一的completed是否可靠？OpenCode/Pi的usesResultEvent=false使exit0且无timeout即可完成，error事件仅记账；首JSON后直接await handle.result，allowedWaitSeconds不是全程硬截止。POSIX取消仅杀直接子进程，末尾无换行stdout没有flush。默认bypass_permissions并自动失败换模型时，任务副作用可能重复。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相比在多个终端搬运任务，插件统一委派句柄、驱动事件与父侧状态，并把外部模型链嵌入DSH。DRIVERS/sink分离减少生命周期重复；外部CLI能力与宿主子代理helper归上游，后端数量和“免费”preset名称都不证明质量或低成本。

相比在多个终端搬运任务，插件统一委派句柄、驱动事件与父侧状态，并把外部模型链嵌入DSH。DRIVERS/sink分离减少生命周期重复；外部CLI能力与宿主子代理helper归上游，后端数量和“免费”preset名称都不证明质量或低成本。

驱动事件与运行账本解耦，CodeBuddy以独立驱动映射permission参数并区分credits/USD报告，stderr保留尾部并有配置探测；slash命令只是发followup让父Agent调用工具，不保证已开始执行。首次事件、最终事件和退出码的区别值得保留而非用单状态掩盖。

固定源码依据：[lib/index.js](https://github.com/1373700184/dsh-subagent/blob/679dd4fb7838fcb473c8b368e20aa24a43af99aa/lib/index.js)、[lib/client.js](https://github.com/1373700184/dsh-subagent/blob/679dd4fb7838fcb473c8b368e20aa24a43af99aa/lib/client.js)、[cordis.patch.yml](https://github.com/1373700184/dsh-subagent/blob/679dd4fb7838fcb473c8b368e20aa24a43af99aa/cordis.patch.yml)、[package.json](https://github.com/1373700184/dsh-subagent/blob/679dd4fb7838fcb473c8b368e20aa24a43af99aa/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

归一的completed是否可靠？OpenCode/Pi的usesResultEvent=false使exit0且无timeout即可完成，error事件仅记账；首JSON后直接await handle.result，allowedWaitSeconds不是全程硬截止。POSIX取消仅杀直接子进程，末尾无换行stdout没有flush。默认bypass_permissions并自动失败换模型时，任务副作用可能重复。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有对应CLI且可隔离工作目录者可评估；不可重复写入任务应先解决回退幂等、全程超时和进程树取消，不能因preset叫“自由”而放宽验收。

核查状态：四协议适配、命令和preset由源码确认；完成语义、硬截止、费用与产物质量未实测。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.8.4；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[679dd4fb](https://github.com/1373700184/dsh-subagent/tree/679dd4fb7838fcb473c8b368e20aa24a43af99aa)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件Provider、Run、四驱动、回退、账本、探测、客户端注册与preset patch；不核账号额度或外部CLI实现，未执行任何目标命令。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

给各驱动定义终态错误契约和产物断言，将绝对截止传播至Run，可能减少exit0误成功与有心跳无限等。固定样例覆盖error后exit0、无换行终帧、持续心跳无结果与正常交付，比较误成功率及取消残留；若统一契约误判合法协议，则返回驱动特有状态而非强装统一完成。

未运行CLI或测试；提出终态、deadline、取消树和重复副作用对照样例，独立检查产物后再判断完成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 1866 | 1689 | 124 | — |
| .md | source | 1 | 96 | — | — | 1404 |
| .mjs | source | 1 | 30 | 28 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1373700184/dsh-subagent/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
