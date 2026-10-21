# dsh-youreyes

> 为文本模型接入OpenAI兼容、Gemini、Ollama及IDE视觉通道并保存视觉证据。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[86f02fa](https://github.com/54xkeee/dsh-youreyes/tree/86f02fa124cd158438e4d9290625d2f8dd610967)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/54xkeee/dsh-youreyes) [![npm 30d 1,126](https://img.shields.io/static/v1?label=npm+30d&message=1%2C126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-youreyes) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-youreyes)
<!-- END META -->

**使用建议**：需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代为原生多模态模型或手动向视觉服务提问；此方案保留文本模型但引入一层有损视觉描述。

<a id="detail-section-3"></a>

### 能力、依赖与流程

src/index.ts注册包装provider及vision工具，channels.ts分发Antigravity/OpenAI/Gemini/Ollama；vision-core组织证据和缓存。allowedImageDirs空数组保留旧版任意路径行为。

- **模型工具**：vision识图/OCR/区域/比较
- **事件监听**：会话视觉证据及压缩恢复

依赖宿主webServer/llm/tools/sessions/attachments及Schemastery；各通道需对应API、IDE订阅或本地Ollama视觉模型。

附件占位→vision读取图片→选通道→标准识图/复杂升级→保存结构化证据→后续问题复用；失败需查端点能力及本地路径权限。

<a id="detail-section-4"></a>

### 成本与效果

首次配置API或Ollama视觉模型，IDE通道另需可用工作区；现金按远端识图，Ollama消耗本机资源，人工承担OCR与摘要遗漏复核。

统一入口与缓存能减少重复配置与调用，但无同条件准确率、吞吐或独立采用证据。

<a id="detail-section-5"></a>

### 工程亮点

渠道模块与证据纯函数分离利于替换供应商；真实路径目录校验是可借鉴边界。宽松默认目录和legacy stream修复增加兼容复杂度，应复核宿主版本。

源码依据：[src/index.ts](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/index.ts)、[src/channels.ts](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/channels.ts)、[src/vision-core.ts](https://github.com/54xkeee/dsh-youreyes/blob/86f02fa124cd158438e4d9290625d2f8dd610967/src/vision-core.ts)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合已有多种视觉端点、希望保留文本主模型的截图分析；本地Ollama适合需要控制图片外传的任务。

- **建议**：待验证假设：给每条视觉证据附加不可变通道与外传策略，并在回退前检查策略，可减少本地隐私预期错配。以本地失效和云端可用的组合验证是否阻止未授权回退，同时测可用性损失。

需要多端点或本地视觉的用户可先在隔离会话试用；显式设置通道与允许目录，别只凭图片输入开关判断模型已经支持原图推理。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：vision识图/OCR/区域/比较
- **事件监听**：会话视觉证据及压缩恢复

- **思考**：插件声明图片输入只表示能转交外部识图，不会改变主模型固有能力。空的allowedImageDirs不限制本地图片目录；auto通道选择和云端回退须核对，否则本地识图的预期可能与实际数据路径不符。文字证据可能遗漏原图细节。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者主张给纯文本模型看图；可确认的贡献是将通用兼容端点及本地Ollama纳入同一视觉证据流程，而非限定单一视觉供应商。README明确继承vision-toolkit机制；缓存、分层证据和压缩恢复属集成实现，不是新视觉算法。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[54xkeee/dsh-youreyes](https://github.com/54xkeee/dsh-youreyes)
- **版本号**：0.1.0（[固定提交 86f02fa1](https://github.com/54xkeee/dsh-youreyes/tree/86f02fa124cd158438e4d9290625d2f8dd610967)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/channels.ts、src/vision-core.ts、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：固定通道测试本地路径限制、图片发送目标、OCR细节及压缩恢复；本轮只核源码，作者样例不作准确率依据。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：给每条视觉证据附加不可变通道与外传策略，并在回退前检查策略，可减少本地隐私预期错配。以本地失效和云端可用的组合验证是否阻止未授权回退，同时测可用性损失。

固定通道测试本地路径限制、图片发送目标、OCR细节及压缩恢复；本轮只核源码，作者样例不作准确率依据。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：60f3fca4be2b7496bd8e36704fc18d2c58792847e1bb62a3347275042de1d0a8。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 49 | 43 | 2 | — |
| .md | source | 2 | 580 | — | — | 4871 |
| .ts | source | 4 | 1607 | 1426 | 107 | — |
| .tsx | source | 1 | 350 | 334 | 2 | — |
| .mjs | test | 1 | 244 | 212 | 13 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/54xkeee/dsh-youreyes/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
