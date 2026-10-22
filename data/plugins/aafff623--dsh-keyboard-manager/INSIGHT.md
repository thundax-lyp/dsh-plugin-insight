# dsh-keyboard-manager

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6e4d700](https://github.com/Aafff623/dsh-keyboard-manager/tree/6e4d700ca56445a11d6c185efe9332c3680ad4d7)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager)
<!-- END META -->

> **实现功能**：以可配置 Ctrl 快捷键切换 DSH 侧栏、右面板和设置。

> **核心亮点**：把原生layout服务与可选better-sidebar按钮放在同一键盘动作路由，避开对React内部状态的直接修改；物理键码冲突时回默认表。增量是输入便利与兼容适配，不是新的会话或业务工作流。

> **风险与缺陷**：缺标记是否总是安全无动作？右栏找不到带right语义按钮会取最后一个按钮，插件DOM变化时可能点错。即使action找不到目标，外层已preventDefault，原浏览器行为仍被消费；严格Ctrl也未对一般文本输入框让路。配置只启动时拉一次，失联静默默认可能与用户预期不同。

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

> **用途**：偏好键盘操作的DSH Web用户快速切换布局，保留better-sidebar编辑器的保存操作；交付物是界面开关。

点击原界面开关或宿主自有快捷键即可；插件统一三动作并补可选插件适配。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Host 路由**：/plugin-config/dsh-keyboard-manager提供keymap JSON。
- **事件监听**：捕获keydown，将三组Ctrl组合路由到布局与按钮动作。

**流程与依赖**

Host exact路由提供静态keymap配置；client一次拉取后更新键码表。捕获阶段keydown只接受无其他修饰的Ctrl、非IME/重复/已消费事件；左栏调用layout，右栏优先插件按钮回退原生详情，设置通过按钮/Escape复用界面路径。

DSH layout和Web DOM；better-sidebar可选，不要求模型、外部CLI或数据服务。

加载默认keymap→异步拉Host覆盖→收到严格Ctrl按键→让路已有消费/输入法→选择原生或插件动作→卸载移除监听。

MIT双面bundle并提交lib，无构建Git安装主张未实操；无webServer时不注册路由，client保默认。

**效果与成本**

现金无API；人工需选择不冲突键码并随宿主/可选插件DOM维护，失败回退或误触会抵消操作收益。

减少鼠标移动，仍无操作时间或错误率测量；不提供布局状态持久化与任务自动化。

> **思考**：缺标记是否总是安全无动作？右栏找不到带right语义按钮会取最后一个按钮，插件DOM变化时可能点错。即使action找不到目标，外层已preventDefault，原浏览器行为仍被消费；严格Ctrl也未对一般文本输入框让路。配置只启动时拉一次，失联静默默认可能与用户预期不同。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把原生layout服务与可选better-sidebar按钮放在同一键盘动作路由，避开对React内部状态的直接修改；物理键码冲突时回默认表。增量是输入便利与兼容适配，不是新的会话或业务工作流。

把原生layout服务与可选better-sidebar按钮放在同一键盘动作路由，避开对React内部状态的直接修改；物理键码冲突时回默认表。增量是输入便利与兼容适配，不是新的会话或业务工作流。

单监听器、dispose清理、配置迟到后检查disposed，重复键码整体回默认；稳定data标记比哈希类名更易维护，但“最后按钮”弱化了语义路由保证。

固定源码依据：[src/index.ts](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/index.ts)、[src/config.ts](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/config.ts)、[src/client/index.ts](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/src/client/index.ts)、[package.json](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/package.json)、[cordis.patch.yml](https://github.com/Aafff623/dsh-keyboard-manager/blob/6e4d700ca56445a11d6c185efe9332c3680ad4d7/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺标记是否总是安全无动作？右栏找不到带right语义按钮会取最后一个按钮，插件DOM变化时可能点错。即使action找不到目标，外层已preventDefault，原浏览器行为仍被消费；严格Ctrl也未对一般文本输入框让路。配置只启动时拉一次，失联静默默认可能与用户预期不同。

<a id="detail-section-6"></a>

### 1.5 使用建议

键盘操作频繁者可列为小型界面增强候选；如有编辑器快捷键或自定义布局，先核对事件消费与目标按钮契约。

核查状态：三动作路由与配置回退由源码支持；浏览器快捷键冲突、真实插件版本兼容和节省操作未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.2.0；版本日期：2026-09-09（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[6e4d700c](https://github.com/Aafff623/dsh-keyboard-manager/tree/6e4d700ca56445a11d6c185efe9332c3680ad4d7)；本轮基准：2026-10-21T05:26:52Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根组件config、Host配置路由和client键盘/按钮路由全路径；未运行浏览器或可选better-sidebar。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

以稳定的具名动作服务取代“最后按钮”回退，并只在动作被确认处理后消费键盘事件，可能减少兼容误触。对按钮顺序变化、目标消失、编辑器焦点和配置请求失败的固定DOM样例检查不误点/不吞键；若服务不可用应显式禁用该动作。

未执行；拟测试不同浏览器/IME/文本框、better-sidebar按钮重排、缺标记与Host失联，不把仓库单测当真实验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 283 | — | — | 2436 |
| .mjs | source | 1 | 55 | 35 | 14 | — |
| .js | source | 2 | 199 | 189 | 5 | — |
| .ts | source | 3 | 255 | 189 | 40 | — |
| .mjs | test | 1 | 443 | 394 | 14 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+created%3A2026-09-21T05%3A34%3A14.887Z..2026-10-21T05%3A34%3A14.887Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aafff623/dsh-keyboard-manager/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A34%3A14.887Z..2026-10-21T05%3A34%3A14.887Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
