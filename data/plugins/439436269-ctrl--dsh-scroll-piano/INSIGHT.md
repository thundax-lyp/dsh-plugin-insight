# dsh-scroll-piano

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[756fa15](https://github.com/439436269-ctrl/dsh-scroll-piano/tree/756fa15ba689f2cb0af38f20f4270c21f44f703d)

<!-- BEGIN META -->
[![npm 30d 1,565](https://img.shields.io/static/v1?label=npm+30d&message=1%2C565&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-scroll-piano) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-scroll-piano)
<!-- END META -->

> **功能**：把对话滚动位置映射为音高，并用消息刻度提供跳转导航。

> **亮点**：把空间位置编码为声音并叠加导航刻度，是交互组合创新；它不改善模型回答或搜索语义。 详见[Q03](#research-q03)。

> **主要限制**：依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM；自动播放需用户手势，声音也可能干扰读屏或共享办公。 详见[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 场景：适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览？](#detail-section-11)
  - [Q02 · 机制：客户端观察对话 DOM 和尺寸，把指针/滚动位置映射到 WebAudio 音高，并从用户消息节点生成可点击刻度。？](#detail-section-12)
  - [Q03 · 贡献：把空间位置编码为声音并叠加导航刻度，是交互组合创新？](#detail-section-13)
  - [Q04 · 局限：依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM？](#detail-section-14)
  - [Q05 · 依赖：仅客户端但依赖 shell.overlay、WebAudio、MutationObserver/ResizeObserver 与稳定 DOM？](#detail-section-15)
  - [Q06 · 成本与效果：没有外部费用，成本是持续观察布局、音频节点和用户注意力？](#detail-section-16)
  - [Q07 · 工程：本地状态、观察器清理和音量/位置开关便于复用？](#detail-section-17)
  - [Q08 · 假设：将刻度导航与声音分别开关，并以消息语义 API 取代 DOM 猜测，可能保留导航价值而减少维护和感官负担。？](#detail-section-18)
  - [Q09 · 采用：保持观察？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览；不需要声音时浏览器查找/原生滚动足够。 详见[Q01](#research-q01)。

适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览；不需要声音时浏览器查找/原生滚动足够。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

#### 能力明细

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 界面 | 滚动音阶、用户消息刻度和点击跳转 | 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| shell.overlay | 必需 | 覆盖刻度/交互层 | 无入口 |
| WebAudio 与用户手势 | 声音时 | 播放音阶 | 静音但刻度可留 |
| 对话 DOM 结构 | 必需 | 定位消息/滚动容器 | 升级后可能失效 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 启用 | 在设置开声音/刻度 | 先调低音量 |
| 滚动 | 指针靠近边缘/滚动 | 听音高变化 |
| 导航 | 点击用户消息刻度 | 核焦点和定位 |
| 回退 | 关闭声音或插件 | 恢复原生滚动 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 长会话 | DOM 观察与刻度计算 | 调音量/位置 | CPU 未测 |
| 感官 | 连续音高占注意力 | 按场景静音 | 读屏冲突未知 |
| 升级 | 内部 DOM 选择器漂移 | 重新适配 | 无稳定 API |

#### 效果

| 效果项 | 源码支持 | 验证指标 |
| --- | --- | --- |
| 位置感知 | 音高映射滚动 | 定位时间 |
| 消息导航 | 点击用户消息刻度 | 命中准确率 |
| 原生滚动对照 | 娱乐性增益为主 | 任务耗时差 |

> **思考**：依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM；自动播放需用户手势，声音也可能干扰读屏或共享办公。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把空间位置编码为声音并叠加导航刻度，是交互组合创新；它不改善模型回答或搜索语义。 详见[Q03](#research-q03)。

本地状态、观察器清理和音量/位置开关便于复用；应增加 reduced-motion/reduced-audio 与语义节点适配层。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM；自动播放需用户手势，声音也可能干扰读屏或共享办公。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察；仅对明确喜欢听觉反馈的个人用户，在长会话和读屏环境先核 CPU、焦点、静音及 DOM 升级回退。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定客户端源码支持 WebAudio 音高映射、用户消息刻度与本地偏好；未在长会话、读屏或升级后 DOM 中运行，导航准确率、感官负担和观察器成本均不能从实现存在外推。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README.md、lib/index.js、lib/client.js 与 prepared inventory；未安装、未运行、未访问真实账号/设备/服务。长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证。
- 下一步：下一步只做本项可证伪实验：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务。

**分析版本**

- **仓库**：[439436269-ctrl/dsh-scroll-piano](https://github.com/439436269-ctrl/dsh-scroll-piano)
- **版本号**：0.3.5（[固定提交 756fa15](https://github.com/439436269-ctrl/dsh-scroll-piano/tree/756fa15ba689f2cb0af38f20f4270c21f44f703d)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将刻度导航与声音分别开关，并以消息语义 API 取代 DOM 猜测，可能保留导航价值而减少维护和感官负担。 详见[Q08](#research-q08)。

下一步只做本项可证伪实验：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 569 | 469 | 84 | — |
| .md | source | 1 | 90 | — | — | 1233 |
| .mjs | test | 1 | 47 | 43 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/439436269-ctrl/dsh-scroll-piano/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：滚动钢琴的听觉反馈与消息刻度是否足以抵消 DOM 脆弱性和无障碍成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 场景：适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览？

**研究主题**：场景与需求

#### 完整回答

适合长对话中用声音感知位置、用右侧刻度跳到用户消息的个人化浏览；不需要声音时浏览器查找/原生滚动足够。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：场景相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：场景结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 机制：客户端观察对话 DOM 和尺寸，把指针/滚动位置映射到 WebAudio 音高，并从用户消息节点生成可点击刻度。？

**研究主题**：功能与机制

#### 完整回答

客户端观察对话 DOM 和尺寸，把指针/滚动位置映射到 WebAudio 音高，并从用户消息节点生成可点击刻度。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1-10](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/lib/client.js#L1-L10)

固定提交复核：机制相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-scroll-piano — browser half.
 *
 * 鼠标滑过 DSH 界面**右侧边缘的竖条区域**（聊天区滚动条/把手那一条）时，
 * 按鼠标的**纵向位置**发出钢琴音：越靠上音越高、越靠下音越低（特雷门琴式）。
 *
 * 为什么按「窗口右侧竖条 + 坐标」而不是抓某个 DOM 元素：那根滚动条是浏览器
 * **原生滚动条**（不在 DOM 里，类名还带 hash），抓不到也没法定制；用一个全局
 * `pointermove` + `clientX` 落到竖条区间、`clientY` 映射音高，最稳。
 *
```

</details>

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：机制结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 贡献：把空间位置编码为声音并叠加导航刻度，是交互组合创新？

**研究主题**：贡献与相对优势

#### 完整回答

把空间位置编码为声音并叠加导航刻度，是交互组合创新；它不改善模型回答或搜索语义。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：贡献相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：贡献结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 局限：依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM？

**研究主题**：缺陷与关键质疑

#### 完整回答

依赖 data-chat-flow、直接子节点 key 和 overflow 父级等内部 DOM；自动播放需用户手势，声音也可能干扰读屏或共享办公。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1-10](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/lib/client.js#L1-L10)

固定提交复核：局限相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-scroll-piano — browser half.
 *
 * 鼠标滑过 DSH 界面**右侧边缘的竖条区域**（聊天区滚动条/把手那一条）时，
 * 按鼠标的**纵向位置**发出钢琴音：越靠上音越高、越靠下音越低（特雷门琴式）。
 *
 * 为什么按「窗口右侧竖条 + 坐标」而不是抓某个 DOM 元素：那根滚动条是浏览器
 * **原生滚动条**（不在 DOM 里，类名还带 hash），抓不到也没法定制；用一个全局
 * `pointermove` + `clientX` 落到竖条区间、`clientY` 映射音高，最稳。
 *
```

</details>

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：局限结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 依赖：仅客户端但依赖 shell.overlay、WebAudio、MutationObserver/ResizeObserver 与稳定 DOM？

**研究主题**：依赖、兼容与流程

#### 完整回答

仅客户端但依赖 shell.overlay、WebAudio、MutationObserver/ResizeObserver 与稳定 DOM；偏好写 localStorage。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：依赖相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：依赖结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本与效果：没有外部费用，成本是持续观察布局、音频节点和用户注意力？

**研究主题**：效果与总成本

#### 完整回答

没有外部费用，成本是持续观察布局、音频节点和用户注意力；长会话 CPU、内存及刻度准确率未量化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：成本与效果相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：成本与效果结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程：本地状态、观察器清理和音量/位置开关便于复用？

**研究主题**：工程质量与复用

#### 完整回答

本地状态、观察器清理和音量/位置开关便于复用；应增加 reduced-motion/reduced-audio 与语义节点适配层。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:1-10](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/lib/client.js#L1-L10)

固定提交复核：工程相关声明与实现入口。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-scroll-piano — browser half.
 *
 * 鼠标滑过 DSH 界面**右侧边缘的竖条区域**（聊天区滚动条/把手那一条）时，
 * 按鼠标的**纵向位置**发出钢琴音：越靠上音越高、越靠下音越低（特雷门琴式）。
 *
 * 为什么按「窗口右侧竖条 + 坐标」而不是抓某个 DOM 元素：那根滚动条是浏览器
 * **原生滚动条**（不在 DOM 里，类名还带 hash），抓不到也没法定制；用一个全局
 * `pointermove` + `clientX` 落到竖条区间、`clientY` 映射音高，最稳。
 *
```

</details>

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：工程结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 假设：将刻度导航与声音分别开关，并以消息语义 API 取代 DOM 猜测，可能保留导航价值而减少维护和感官负担。？

**研究主题**：新假设与验证

#### 完整回答

将刻度导航与声音分别开关，并以消息语义 API 取代 DOM 猜测，可能保留导航价值而减少维护和感官负担。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：假设相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：假设结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 采用：保持观察？

**研究主题**：采用判断

#### 完整回答

保持观察；仅对明确喜欢听觉反馈的个人用户，在长会话和读屏环境先核 CPU、焦点、静音及 DOM 升级回退。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/439436269-ctrl/dsh-scroll-piano/blob/756fa15ba689f2cb0af38f20f4270c21f44f703d/README.md#L1-L5)

固定提交复核：采用相关声明与实现入口。

```text
# dsh-scroll-piano · 滚动钢琴

鼠标滑过 DSH **聊天区右边缘的竖条**（滚动条/把手那一条）时，按鼠标的**纵向位置**发出钢琴音：**越靠上音越高、越靠下音越低**（特雷门琴式）。

## 效果
```

#### 缺口

- 长会话节点规模、宿主 DOM 升级与读屏组合下的可用性未验证
  **影响**：采用结论只能到固定源码解释，不能外推为真实运行效果
  **进一步探讨**：用 50/500/2000 条消息测刻度命中、CPU 与观察器数量，并用键盘/读屏/reduced-motion 完成跳转任务

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
