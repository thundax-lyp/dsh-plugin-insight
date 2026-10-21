# dsh-language-guard

> 以系统提示片段和周期提醒约束回复语言，支持语言命令与界面语言跟随。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[68cdc5c](https://github.com/58fly/dsh-language-guard/tree/68cdc5c77c3755fbfe4d4d7e9e45f4bd8e6a6ce3)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/58fly/dsh-language-guard) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-language-guard) · **脚本有更新，待重新洞察**
<!-- END META -->

**使用建议**：有稳定语言偏好可先试B档。繁体或任务语言与界面不同请手动设置；用含英文代码和引用的长对话检查是否误改内容。

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

替代是自定义系统提示或每轮语言要求；插件增加配置迁移、动态档位和提醒，不改变模型权重。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册head/mid/tail三个稳定section，动态读取强度和语言；language.js纯函数处理auto/manual及旧配置；cycle.js在D档按轮次插入自检提醒。

- **用户命令**：/language语言控制
- **事件监听**：D档周期自检提醒

核心依赖systemPrompt；settings与commands可选，设置表单依赖Schemastery解析链。

读取配置及界面语言→解析目标语言→装配三处提示→D档周期提醒→/language可覆盖；缺偏好信号回退配置，不猜系统语言。

<a id="detail-section-4"></a>

### 成本与效果

首次选自动/手动与档位；持续成本是提示token和复核错误翻译，现金随模型token，人工需处理繁简与多语任务例外。

可减少重复语言提醒，但无可比漂移率实验，强度高不代表更准确。

<a id="detail-section-5"></a>

### 工程亮点

语言解析纯函数与宿主分离，空串哨兵保护迁移；设置服务懒注入和Schemastery导入失败告警提供降级。可借鉴稳定section与显式回退。

源码依据：[lib/index.js](https://github.com/58fly/dsh-language-guard/blob/68cdc5c77c3755fbfe4d4d7e9e45f4bd8e6a6ce3/lib/index.js)、[lib/language.js](https://github.com/58fly/dsh-language-guard/blob/68cdc5c77c3755fbfe4d4d7e9e45f4bd8e6a6ce3/lib/language.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合长对话容易语言漂移的多语用户，尤其需要固定回复语言而保留代码标识的任务。

- **建议**：待验证假设：按实际语言漂移触发提醒，比固定每N轮更省上下文。用混合代码、多语引文和长会话对照漂移率、错误提醒与token；若识别器误判引用导致额外约束，则否定。

有稳定语言偏好可先试B档。繁体或任务语言与界面不同请手动设置；用含英文代码和引用的长对话检查是否误改内容。

**核查状态**：已检查固定版本源码，未安装、执行目标插件或完成真实宿主验收。已有贡献仅由固定版本源码支持，实际宿主和任务效果尚未验证；未来设计假设保持未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **用户命令**：/language语言控制
- **事件监听**：D档周期自检提醒

- **思考**：提示层约束无法保证模型推理和回答始终遵守语言要求；多处注入增加token，D档提醒进入既有user/message还可能影响任务上下文。mapPreference把所有zh主标签映成zh-CN，繁体偏好需manual，不能宣称自动精确跟随。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者主张语言守卫；实际贡献是把语言偏好解析、强度档位及周期提醒做成可配置宿主集成。相对每轮手工要求中文，减少重复输入；三态未设置哨兵保留旧用户手选语言，属于有用迁移设计，不是语言能力创新。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[58fly/dsh-language-guard](https://github.com/58fly/dsh-language-guard)
- **版本号**：0.3.1（[固定提交 68cdc5c7](https://github.com/58fly/dsh-language-guard/tree/68cdc5c77c3755fbfe4d4d7e9e45f4bd8e6a6ce3)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/language.js、作者README与固定范围inventory；源码抽读不等于完整审计。
- 未完成：目标插件执行、测试、安装、模型调用和真实宿主验收。
- 证据限制：核查固定提交内列明入口、核心实现及相关配置/作者材料的源码子集；未执行插件、其测试、安装、付费请求或真实宿主验收，未核实独立用户采用。
- 下一步：固定宿主跑繁简、旧配置、缺settings、多语引用及长对话对照，记录任务正确性与语言漂移；本轮未执行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：按实际语言漂移触发提醒，比固定每N轮更省上下文。用混合代码、多语引文和长会话对照漂移率、错误提醒与token；若识别器误判引用导致额外约束，则否定。

固定宿主跑繁简、旧配置、缺settings、多语引用及长对话对照，记录任务正确性与语言漂移；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：4cabe13f957dd762ef4e915a1828f9bb5ccaa74d67d2f6ac1dc9c688d4d35a62。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 32 | 10742 | — | — | 152560 |
| .js | source | 7 | 2423 | 1682 | 555 | — |
| .mjs | source | 5 | 1160 | 880 | 155 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/58fly/dsh-language-guard/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
