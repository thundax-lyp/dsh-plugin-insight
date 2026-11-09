# Clutch DSH Fireworks

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Cerbur/clutch-dsh) [![npm 30d 1,425](https://img.shields.io/static/v1?label=npm+30d&message=1%2C425&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-fireworks) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cerbur/clutch-dsh-fireworks)
<!-- END META -->

> **功能**：为 DSH Web 的重要工具里程碑播放全局动画和可跳回来源会话的 toast，并提供内置及可导入动画。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 将选定的模型工具里程碑跨会话显示，并把通知接到原生导航。动画和 toast 有独立生命周期，可更换模板。

> **主要限制**：[Q03](#research-q03) 工具成功与浏览器播放之间没有确认闭环，短断线之外可漏掉，里程碑语义由模型选择。导入首帧会在保存前执行，隔离和资源效果需验证。

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
  - [Q01 · 用户何时收到烟花或通知，增量是什么？](#detail-section-11)
  - [Q02 · 会话工具事件如何走到动画与定位？](#detail-section-12)
  - [Q03 · 误提示、重放、导入执行有哪些边界？](#detail-section-13)
  - [Q04 · 如何装、哪些宿主服务必需？](#detail-section-14)
  - [Q05 · 怎样比较回合提示与多会话导航价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时关注多个 DSH Web 会话的用户，希望在当前页面感知重要里程碑并找到来源。[Q01](#research-q01)

原生会话列表和各对话内工具结果可用来查看、回读进展。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| happy_fireworks | 标记重要里程碑 | 由模型选择，工具成功无播放确认 |
| 全局 toast 与动画 | 跨会话感知与定位 | 仅 owner，队列及回放有限 |
| 动画设置 | 选择、预览、导入脚本 | 首帧预检会执行，脚本效果依赖浏览器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容 DSH Web、Cordis 与 Tools | 需要 | 接线工具、Host 和 Web | 不能走完整 Web 路径 |
| Gateway、Typert、Connection 和 owner | 通知需要 | 传递和订阅事件 | 无可见全局通知 |
| settings、dshHomePath 与可写配置 | 自定义需要 | 加载和保存动画 | 设置不可用或只读 |
| Worker、OffscreenCanvas | 脚本效果需要 | 隔离 Canvas 渲染 | 正式播放回退 Emoji |
| systemPrompt | 可选 | 引导里程碑调用 | 工具仍注册 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 在相容临时 Web profile 选内置 Emoji | owner 页面加载插件 |
| 触发 | 两个合成会话产生符合及不符合条件的工具事件 | 只显示符合条件的来源 toast |
| 定位 | 在其他页面点 toast | 打开正确来源，保留动画生命周期 |
| 故障及退出 | 断线、重启、卸载、观察 owner 和 guest | 符合时限，回到原生列表 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 相容 DSH 与子包 | 固定安装入口和配套宿主 | 未实测 |
| 持续 | 模型工具调用、事件缓冲和绘制 | 观察误报与动画 | 资源实际值未知 |
| 自定义 | 脚本文件、设置、预检 | 来源核对和故障排查 | 浏览器支持待验 |
| 退出 | 配置与脚本备份 | 卸载并检查持久化 | 恢复耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 里程碑感知 | owner 全局动画与 toast | 触发准确率和漏报 |
| 返回来源 | 调用 DSH 导航 | 跳转成功率与省时 |
| 动画定制 | 隔离 Worker、设置与文件 | 跨浏览器隔离及绘制成本 |

> **思考**：[Q03](#research-q03) 工具成功与浏览器播放之间没有确认闭环，短断线之外可漏掉，里程碑语义由模型选择。导入首帧会在保存前执行，隔离和资源效果需验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 将选定的模型工具里程碑跨会话显示，并把通知接到原生导航。动画和 toast 有独立生命周期，可更换模板。

[Q02](#research-q02) 有效事件到原生 Remote、全局槽位和并列播放两条支路可追溯。[Q03](#research-q03) 事件缓冲与文件持久化分开，导入验证会先执行脚本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 工具成功与浏览器播放之间没有确认闭环，短断线之外可漏掉，里程碑语义由模型选择。导入首帧会在保存前执行，隔离和资源效果需验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先用合成任务与内置 Emoji，在 owner/非 owner、过期和导航异常条件下验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包支持模型工具、原生事件流和会话导航，并实现脚本预检及持久化。真实模型调用、浏览器隔离、分发与使用效果未验收。

- 已检查：作者 README、包清单、源码路径 packages/clutch-dsh-fireworks/README.zh.md、packages/clutch-dsh-fireworks/src/contract/index.ts、packages/clutch-dsh-fireworks/src/index.ts、packages/clutch-dsh-fireworks/src/client/FireworksOverlay.tsx、packages/clutch-dsh-fireworks/src/fireworks-tool.ts、packages/clutch-dsh-fireworks/src/fireworks-projection.ts、packages/clutch-dsh-fireworks/src/client/fireworks-stream.ts、packages/clutch-dsh-fireworks/src/client/entry.ts、packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts、packages/clutch-dsh-fireworks/src/fireworks-remote.ts、packages/clutch-dsh-fireworks/src/fireworks-events.ts、packages/clutch-dsh-fireworks/src/client/AnimationSettings.tsx、packages/clutch-dsh-fireworks/src/client/animation-validation.ts、packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts、packages/clutch-dsh-fireworks/src/client/AnimationSurface.tsx、packages/clutch-dsh-fireworks/package.json、packages/clutch-dsh-fireworks/cordis.patch.yml、packages/clutch-dsh-fireworks/src/animation-files.ts、packages/clutch-dsh-fireworks/src/animation-library.ts、packages/clutch-dsh-fireworks/test/fireworks-host.test.mjs、packages/clutch-dsh-fireworks/test/fireworks-events.test.mjs、packages/clutch-dsh-fireworks/test/fireworks-cordis.test.mjs、packages/clutch-dsh-fireworks/test/fireworks-controller.test.mjs 及固定范围 inventory；组件：packages/clutch-dsh-fireworks。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只覆盖 packages/clutch-dsh-fireworks 固定提交。仓库根与兄弟包的工具和界面未计入。未运行目标、用例、模型或 Web profile。
- 下一步：[Q05](#research-q05) 对照原生列表、手动与 PTC 事件、错误、权限、断线、刷新和卸载；另用可信合成脚本检查浏览器。

**分析版本**

- **仓库**：[Cerbur/clutch-dsh](https://github.com/Cerbur/clutch-dsh)
- **版本号**：0.2.0（[固定提交 4714f11](https://github.com/Cerbur/clutch-dsh/tree/4714f11b634e13ea8f128692eae68a29bf3d6a6d)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 若多个合成会话中跳转更快、有效里程碑不漏且误触发可接受，才支持把提示用于任务巡查。

[Q05](#research-q05) 对照原生列表、手动与 PTC 事件、错误、权限、断线、刷新和卸载；另用可信合成脚本检查浏览器。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1078 | 1029 | 44 | — |
| .md | source | 13 | 2313 | — | — | 26959 |
| .mjs | source | 1 | 115 | 113 | 2 | — |
| .ts | source | 21 | 2544 | 2346 | 75 | — |
| .tsx | source | 3 | 770 | 757 | 2 | — |
| .mjs | test | 22 | 5844 | 5613 | 46 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/Cerbur/clutch-dsh/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)

暂未获取：近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认烟花插件怎样从会话工具事件产生 Web 通知、动画和定位动作，并确定可导入脚本的执行边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户何时收到烟花或通知，增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同时关注多个 DSH Web 会话的人可在当前页面看到某个会话里程碑的提示，并按 toast 返回来源会话。模型需选择 happy_fireworks 并产生符合条件的工具事件；系统提示可选，普通回合结束本身不会触发。对照基线是查看各会话列表和对话内工具结果。通知确认的是工具事件，里程碑质量取决于 Agent 的判断。

#### 证据与依据

**依据 1 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:62-67](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L62-L67)

作者预期重要里程碑而非日常操作。

```text
### 庆祝重要里程碑

安装后，Agent 会看到 `happy_fireworks` 工具的使用指引。当任务在收尾轮达到重要里程碑时，Agent
可以使用它，例如完成设计、验证功能、解决复杂 Bug，或完成重构后的全量验证。

这个工具不用于读取文件、检查 Git 状态或执行单次检查等日常中间步骤。
```

**依据 2 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:71-81](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L71-L81)

作者示例跨会话触发和返回。

<details>
<summary>查看原文（11行）</summary>

````text
可以明确要求 Agent 测试覆盖层：

```text
完成一个有意义的里程碑后，调用 happy_fireworks：
{"message":"礼花 MVP 已经可以测试了！"}
```

成功调用会出现在 conversation 中，并播放几秒覆盖层。可选消息会被 trim，并限制为适合 toast 的
短文本。程序化 tool-call dispatch 和直接顶层 tool result 都支持。任务运行时可以切换到其他
Session 或应用页面，全局效果仍会播放。点击 toast 上的 **Open session →** 返回来源 Session，
也可以点击 **×** 关闭通知。
````

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-fireworks/src/contract/index.ts:16-22](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/contract/index.ts#L16-L22)

系统提示限定里程碑的文本。

```text
export const FIREWORKS_GUIDANCE_SECTION_NAME = 'tool:fireworks' as const;
export const FIREWORKS_GUIDANCE_SECTION_ORDER = 2950;
export const FIREWORKS_GUIDANCE_PROMPT =
  'When you reach a major milestone—such as finishing an architecture/design document or implementation plan, ' +
  'completing a feature implementation and verifying it, resolving a complex bug, or passing full verification—' +
  'invoke the `happy_fireworks` tool to celebrate the achievement with the user in your concluding turn. ' +
  'Do not invoke it for routine intermediate actions (such as reading a file or running git status).';
```

**依据 4 · 源码核查**：[packages/clutch-dsh-fireworks/src/index.ts:71-82](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/index.ts#L71-L82)

可选系统提示及实际工具注册。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.inject(['sessionProjections'], (projectionContext) => {
    projectionContext.sessionProjections.register(createFireworksProjectionDefinition());
  });
  ctx.inject(['systemPrompt'], (promptContext) => {
    promptContext.systemPrompt?.section({
      name: FIREWORKS_GUIDANCE_SECTION_NAME,
      order: FIREWORKS_GUIDANCE_SECTION_ORDER,
      text: FIREWORKS_GUIDANCE_PROMPT,
    });
  });
  ctx.tools.register(happyFireworksTool);
}
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/FireworksOverlay.tsx:59-76](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/FireworksOverlay.tsx#L59-L76)

来源会话来自事件，按钮触发导航。

<details>
<summary>查看原文（18行）</summary>

```text
  const [navigationError, setNavigationError] = useState<string>();
  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <button
        className={styles.toastAction}
        type="button"
        onClick={() => {
          try {
            openSession(toast.sessionId);
            setNavigationError(undefined);
            dismiss();
          } catch {
            setNavigationError('Unable to open this session. Please try again.');
          }
        }}
      >
        <span>{toast.message ?? 'A big milestone deserves fireworks!'} 🎉</span>
        <span className={styles.toastHint}>Open session →</span>
```

</details>

#### 缺口

- 真实模型调用频率和导航省时未测。
  **影响**：用于追踪重要交付时需控制误庆祝。
  **进一步探讨**：用合成任务记录有插件和原生会话列表两条路径的通知和定位。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话工具事件如何走到动画与定位？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具返回 callId、可选消息和 presentation meta，Host 监听 session/event，从无错误且 meta 与 callId 一致的 tool/result，或对应工具且有 subCallId 的 PTC/code dispatch 投影发出带 sessionId 和时限的事件。Typert 通过宿主原生连接提供 owner 事件流和设置调用。浏览器挂 shell.overlay 和插件设置槽，接收事件并串行动画与 toast，跳转调用 uiWorkspace.openSession。当前事件的动画与 toast 均完成才前进，独立超时保证推进，卸载取消订阅并清理。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-fireworks/src/contract/index.ts:3-14](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/contract/index.ts#L3-L14)

工具名、事件名和时间窗口常量。

<details>
<summary>查看原文（12行）</summary>

```text
export const FIREWORKS_TOOL_NAME = 'happy_fireworks' as const;
export const FIREWORKS_PROJECTION_KEY = 'fireworks' as const;
export const FIREWORKS_META_KIND = 'clutch-dsh-fireworks' as const;
export const FIREWORKS_DURATION_MS = 3_200;
export const MAX_FIREWORKS_MESSAGE_CHARS = 120;
export const FIREWORKS_LAUNCH_EVENT = 'clutch_fireworks/launch' as const;
export const FIREWORKS_EVENTS_ENDPOINT = 'clutch_fireworks/events';
export const FIREWORKS_EVENT_TTL_MS = 30_000;
export const FIREWORKS_EVENT_LIMIT = 128;
export const FIREWORKS_TOAST_DURATION_MS = 8_000;
/** Fixed per-event deadline, including sandbox startup and both rendering branches. */
export const FIREWORKS_EVENT_TIMEOUT_MS = 12_000;
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-tool.ts:34-41](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-tool.ts#L34-L41)

向投影提供 presentation meta。

```text
            : `Happy fireworks launched: ${value.message} 🎉`,
      },
    ],
    presentationMeta: (_args, value) => ({
      kind: FIREWORKS_META_KIND,
      id: value.id,
      ...(value.message === undefined ? {} : { message: value.message }),
    }),
```

**依据 3 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-tool.ts:50-60](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-tool.ts#L50-L60)

调用 ID 与可选消息来自工具执行。

<details>
<summary>查看原文（11行）</summary>

```text
    title: result.isError ? 'Fireworks failed' : 'Happy fireworks 🎉',
    content: result.content,
  }),
  execute(args, exec) {
    const message = normalizeFireworksMessage(args.message);
    return Promise.resolve({
      id: String(exec.callId),
      ...(message === undefined ? {} : { message }),
    });
  },
});
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-projection.ts:54-62](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-projection.ts#L54-L62)

普通工具结果需无 error 与匹配 meta。

```text
  if (event.type === 'tool/result' && event.data.error === undefined) {
    const meta = parseFireworksMeta(event.data.meta);
    if (meta !== undefined && String(event.data.message.source.callId) === meta.id) {
      return {
        id: meta.id,
        ...(meta.message === undefined ? {} : { message: meta.message }),
      };
    }
  }
```

**依据 5 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-projection.ts:64-85](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-projection.ts#L64-L85)

程序化及旧事件对应工具、标志及 subCallId。

<details>
<summary>查看原文（22行）</summary>

```text
  const isPtcDispatch =
    (event.type as string) === 'tool/ptc-dispatch' ||
    (event.type as string) === 'tool/code-dispatch';

  if (
    isPtcDispatch &&
    !(event.data as { isError?: boolean })?.isError &&
    (event.data as { name?: string })?.name === FIREWORKS_TOOL_NAME
  ) {
    const rawArgs = (event.data as { arguments?: unknown })?.arguments;
    const record =
      rawArgs !== null && typeof rawArgs === 'object' && !Array.isArray(rawArgs)
        ? (rawArgs as Record<string, unknown>)
        : undefined;
    const message = normalizeFireworksMessage(record?.message);
    const subCallId = (event.data as { subCallId?: unknown })?.subCallId;
    if (typeof subCallId === 'string' && subCallId.length > 0) {
      return {
        id: subCallId,
        ...(message === undefined ? {} : { message }),
      };
    }
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-fireworks/src/index.ts:53-69](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/index.ts#L53-L69)

Host 注册并由会话工具事件产生全局流事件。

<details>
<summary>查看原文（17行）</summary>

```text
    const registry = connectionContext.typert as unknown as {
      register(contribution: typeof FIREWORKS_HOST): () => Promise<void>;
    };
    connectionContext.effect(() => registry.register(FIREWORKS_HOST));
    connectionContext.on(FIREWORKS_LAUNCH_EVENT, (event) => feed.publish(event));
    connectionContext.on('session/event', (session, event) => {
      const signal = applyFireworksProjection(null, event);
      if (signal === null) return;
      const issuedAt = Date.now();
      connectionContext.emit(FIREWORKS_LAUNCH_EVENT, {
        ...signal,
        type: FIREWORKS_LAUNCH_EVENT,
        sessionId: String(session.id),
        issuedAt,
        expiresAt: issuedAt + FIREWORKS_EVENT_TTL_MS,
      });
    });
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/fireworks-stream.ts:29-46](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/fireworks-stream.ts#L29-L46)

复用逻辑流，finally dispose。

<details>
<summary>查看原文（18行）</summary>

```text
/** Mount once per plugin fiber, rather than on each reconnect. */
export function mountFireworksRemote(remote: FireworksRemote): Promise<TypertDisposer> {
  return remote.$mount(FIREWORKS_REMOTE);
}

/** Only a logical Remote stream: no fetch, socket, heartbeat or idle watchdog here. */
export async function* openFireworksStream(
  remote: FireworksRemote,
  query: FireworksResumeCursor,
  signal: AbortSignal,
): AsyncGenerator<FireworksEventBatch> {
  signal.throwIfAborted();
  const handle = remote.clutch_fireworks.events(query, signal);
  try {
    for await (const batch of handle) yield parseFireworksEventBatch(batch);
  } finally {
    handle.dispose();
  }
```

</details>

**依据 8 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/entry.ts:59-74](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/entry.ts#L59-L74)

全局槽位和 DSH 导航接线。

<details>
<summary>查看原文（16行）</summary>

```text
  const navigation = ctx.uiWorkspace as unknown as { openSession(id: string): unknown };
  ctx.effect(() => controller.start());
  ctx.slots.inject('shell.overlay', () =>
    ctx.slots.register(
      {
        name: 'shell.overlay',
        id: 'clutch-dsh-fireworks-overlay',
        order: 10,
        inject: () => ({
          controller,
          openSession: (sessionId: string) => navigation.openSession(sessionId),
        }),
      },
      FireworksOverlay,
    ),
  );
```

</details>

**依据 9 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts:142-149](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts#L142-L149)

动画、toast 和固定事件时限并行。

```text
    // Only now capture the template and start both rendering branches and their
    // fixed playback deadline. Later settings changes cannot alter this event.
    const active: ActiveCelebration = { event, animation: 'starting', toastDone: false };
    this.active = active;
    this.eventTimer = setTimeout(() => this.finishEvent(active), FIREWORKS_EVENT_TIMEOUT_MS);
    this.play(event, animation, undefined, event);
    this.toastTimer = setTimeout(() => this.dismissToast(event), FIREWORKS_TOAST_DURATION_MS);
  }
```

**依据 10 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts:208-226](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts#L208-L226)

播放和 toast 分别推进完成判据。

<details>
<summary>查看原文（19行）</summary>

```text
    } else if (status === 'done') {
      this.finishAnimation(burst);
    } else if (status === 'error' && this.active && this.active.animation !== 'fallback') {
      // The existing trusted fallback is the terminal error presentation, not a retry.
      this.active.animation = 'fallback';
      clearTimeout(this.burstTimer);
      this.burstTimer = setTimeout(() => this.finishAnimation(burst), FIREWORKS_DURATION_MS);
    }
  };

  readonly dismissToast = (toast = this.snapshot.toast): void => {
    if (!toast || this.snapshot.toast !== toast) return;
    clearTimeout(this.toastTimer);
    this.publish({ ...this.snapshot, toast: undefined });
    const active = this.active;
    if (active?.event === toast) {
      active.toastDone = true;
      this.finishIfComplete(active);
    }
```

</details>

**依据 11 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts:308-323](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts#L308-L323)

卸载撤销连接、计时器及队列。

<details>
<summary>查看原文（16行）</summary>

```text
  stop(): void {
    this.cancelPreview();
    this.connection?.abort();
    this.connection = undefined;
    const preparation = this.preparation;
    this.preparation = undefined;
    clearTimeout(this.preparationTimer);
    preparation?.abort();
    clearTimeout(this.burstTimer);
    clearTimeout(this.toastTimer);
    clearTimeout(this.eventTimer);
    this.active = undefined;
    this.pending = [];
    this.seen.clear();
    this.publish({});
  }
```

</details>

#### 缺口

- DSH 版本是否发出预期 PTC 事件、浏览器实际渲染和异步导航失败待验。
  **影响**：工具返回成功可能没有可见通知。
  **进一步探讨**：记录真实宿主 session/event 与浏览器播放观察，覆盖直接和 PTC 两种路径。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 误提示、重放、导入执行有哪些边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

事件仅供 owner，宿主和页面按会话及调用 ID 去重，30 秒和 128 项限制使回放适用于短断线；新 epoch 或刷新取静默基线，队列超时会丢。工具结果与 UI 播放没有确认闭环。导入 .js 在确认保存前就于 sandbox=allow-scripts 的不透明 iframe 通过 Blob Worker 执行首帧，CSP 禁连接且父页按来源和 token 接收状态；OffscreenCanvas、逐帧看门狗与清理限制部分资源。校验一帧不代表完整时间轴，播放失败会退到内置 Emoji。隔离实现不替代真实浏览器与宿主授权验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-remote.ts:17-28](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-remote.ts#L17-L28)

设置读写在服务端检查 owner。

<details>
<summary>查看原文（12行）</summary>

```text
  private animationLibrary(): AnimationLibrary {
    if (this.ctx.invocation?.peer.principal.kind !== 'owner')
      throw new Error('clutch_fireworks: owner required');
    if (!this.library)
      throw new Error('动画设置不可用，请重启 DSH / Restart DSH to load animation settings');
    return this.library;
  }
  loadAnimations(signal: AbortSignal) {
    return this.animationLibrary().load(signal);
  }
  saveAnimations(request: AnimationSaveRequest, signal: AbortSignal) {
    return this.animationLibrary().save(request, signal);
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-remote.ts:37-42](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-remote.ts#L37-L42)

聚合事件流检查 owner。

```text
  events(query: FireworksResumeCursor, signal: AbortSignal): AsyncIterable<FireworksEventBatch> {
    // A global feed includes multiple Sessions, even for broadly granted peers.
    if (this.ctx.invocation?.peer.principal.kind !== 'owner')
      throw new Error('clutch_fireworks: owner required');
    return this.feed.open(query, signal);
  }
```

**依据 3 · 源码核查**：[packages/clutch-dsh-fireworks/src/fireworks-events.ts:19-42](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/fireworks-events.ts#L19-L42)

去重、上限、过期及静默基线。

<details>
<summary>查看原文（24行）</summary>

```text
  publish(event: FireworksLaunchEvent): void {
    if (this.disposed || event.expiresAt <= this.now()) return;
    this.entries = this.entries.filter((entry) => entry.event.expiresAt > this.now());
    if (
      this.entries.some(
        (entry) => entry.event.sessionId === event.sessionId && entry.event.id === event.id,
      )
    )
      return;
    this.entries.push({ cursor: ++this.cursor, event });
    this.entries = this.entries.slice(-FIREWORKS_EVENT_LIMIT);
    for (const wake of [...this.subscribers]) wake();
  }

  private read(epoch?: string, cursor?: number): FireworksEventBatch {
    const baseline = epoch !== this.epoch || cursor === undefined || cursor > this.cursor;
    return {
      epoch: this.epoch,
      cursor: this.cursor,
      events: baseline
        ? []
        : this.entries
            .filter((entry) => entry.cursor > cursor && entry.event.expiresAt > this.now())
            .map((entry) => entry.event),
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts:276-303](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/fireworks-controller.ts#L276-L303)

同 epoch 才接收，断线后带游标恢复。

<details>
<summary>查看原文（28行）</summary>

```text
  private async listen(signal: AbortSignal): Promise<void> {
    let epoch: string | undefined;
    let cursor: number | undefined;
    while (!signal.aborted) {
      try {
        const query = epoch === undefined ? {} : { epoch, after: cursor };
        for await (const value of this.request(query, signal)) {
          if (signal.aborted) return;
          const batch = parseFireworksEventBatch(value);
          // Fresh/restarted Host baselines stay silent. Reconnects resume the cursor.
          if (epoch === batch.epoch && cursor !== undefined && batch.cursor >= cursor)
            this.accept(batch.events);
          epoch = batch.epoch;
          cursor = batch.cursor;
        }
      } catch {
        // Playback owns its own lifetime; losing transport never stops an active event.
      }
      if (!signal.aborted) {
        await new Promise<void>((resolve) => {
          const finish = () => {
            clearTimeout(timer);
            signal.removeEventListener('abort', finish);
            resolve();
          };
          const timer = setTimeout(finish, 1_000);
          signal.addEventListener('abort', finish, { once: true });
        });
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/AnimationSettings.tsx:239-248](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/AnimationSettings.tsx#L239-L248)

导入限制与先执行校验。

<details>
<summary>查看原文（10行）</summary>

```text
    try {
      if (!/\.js$/i.test(value.name)) throw new Error('请选择 .js 动画脚本');
      if (value.size > MAX_SCRIPT_BYTES) throw new Error('动画脚本不能超过 64 KiB');
      if (customAnimationCount(store.getSnapshot().preferences) >= MAX_CUSTOM_ANIMATIONS)
        throw new Error('最多导入 8 个自定义动画，请先删除一个');
      const source = await value.text();
      if (controller.signal.aborted) return;
      const template = parseAnimation(source, 'custom-' + crypto.randomUUID());
      await validate(template, controller.signal);
      if (!controller.signal.aborted) setPendingImport(template);
```

</details>

**依据 6 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/AnimationSettings.tsx:256-272](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/AnimationSettings.tsx#L256-L272)

明确确认才调用保存。

<details>
<summary>查看原文（17行）</summary>

```text
  const confirmImport = async () => {
    if (!pendingImport) return;
    const template = pendingImport;
    cancelPreview();
    const success = await update((current) => {
      if (customAnimationCount(current) >= MAX_CUSTOM_ANIMATIONS)
        throw new Error('最多导入 8 个自定义动画，请先删除一个');
      return {
        ...current,
        active: template.id,
        scripts: { ...current.scripts, [template.id]: template.source },
      };
    }, '已导入并设为当前使用。');
    if (success) {
      setPendingImport(undefined);
      setPreviewReady(false);
    }
```

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-validation.ts:6-14](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-validation.ts#L6-L14)

隐藏验证 iframe 的 sandbox。

```text
export function validateAnimation(template: AnimationTemplate, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const frame = document.createElement('iframe');
    const token = crypto.randomUUID();
    let disconnectTheme = () => {};
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('aria-hidden', 'true');
    frame.style.cssText =
      'position:fixed;width:640px;height:480px;visibility:hidden;pointer-events:none';
```

**依据 8 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-validation.ts:24-36](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-validation.ts#L24-L36)

首帧 ready、消息来源和超时。

<details>
<summary>查看原文（13行）</summary>

```text
    const receive = (event: MessageEvent) => {
      if (event.source !== frame.contentWindow || event.data?.token !== token) return;
      if (event.data.type === 'clutch_fireworks/ready') finish();
      if (event.data.type === 'clutch_fireworks/error') finish(String(event.data.message));
    };
    const abort = () => finish('校验已取消');
    const timeout = setTimeout(() => finish('动画校验超时，请检查脚本'), 4000);
    window.addEventListener('message', receive);
    signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) return abort();
    frame.srcdoc = animationDocument(template, token, 1, '', true, readAnimationTheme());
    disconnectTheme = connectAnimationTheme(frame, token);
    document.body.append(frame);
```

</details>

**依据 9 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts:240-249](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts#L240-L249)

清帧、终止 Worker 并撤销 Blob。

<details>
<summary>查看原文（10行）</summary>

```text
  const stop = () => {
    if (finished) return;
    finished = true;
    validateAfterRedraw = undefined;
    clearTimeout(watchdog);
    cancelAnimationFrame(raf);
    removeEventListener('message', receiveTheme);
    removeEventListener('pagehide', stop);
    worker?.terminate();
    if (url) URL.revokeObjectURL(url);
```

</details>

**依据 10 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts:285-293](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts#L285-L293)

750ms 帧限及减少动态的验证。

```text
    const sendFrame = (midpoint: boolean) => {
      finalFrame = !midpoint && time === options.durationMs;
      watchdog = setTimeout(() => fail('动画帧超时 / Animation frame timed out'), 750);
      worker.postMessage({
        type: reducedMotion && !midpoint ? 'validate' : 'frame',
        frame: midpoint
          ? { ...frame, time: options.durationMs * 0.5, progress: 0.5, delta: 0 }
          : frame,
      });
```

**依据 11 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts:310-315](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts#L310-L315)

OffscreenCanvas 和 Blob Worker。

```text
  try {
    if (!canvas.transferControlToOffscreen) throw new Error('OffscreenCanvas unavailable');
    const offscreen = canvas.transferControlToOffscreen();
    url = URL.createObjectURL(new Blob([options.workerSource], { type: 'text/javascript' }));
    worker = new Worker(url);
    worker.onerror = () => fail('脚本语法或运行错误 / Animation script failed');
```

**依据 12 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts:364-375](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/animation-sandbox.ts#L364-L375)

注入 Worker 源码、转义与 CSP。

<details>
<summary>查看原文（12行）</summary>

```text
  const workerSource = `"use strict";\n${template.source}\n;(${workerRuntime.toString()})(typeof render === 'function' ? render : null);`;
  const options = JSON.stringify({
    workerSource,
    durationMs: template.durationMs,
    token,
    seed,
    message,
    validationOnly,
    theme: theme === 'light' ? 'light' : 'dark',
  }).replaceAll('<', '\\u003c');
  return `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob:; worker-src blob:; style-src 'unsafe-inline'; connect-src 'none'; img-src data:; base-uri 'none'; form-action 'none'"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}canvas{width:100%;height:100%;display:block}</style><canvas aria-hidden="true"></canvas><script>(${frameRuntime.toString()})(${options})</script>`;
}
```

</details>

**依据 13 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/AnimationSurface.tsx:61-79](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/AnimationSurface.tsx#L61-L79)

正式失败回 Emoji，预览失败无替代。

<details>
<summary>查看原文（19行）</summary>

```text
    window.addEventListener('message', listener);
    return () => {
      clearTimeout(startup);
      window.removeEventListener('message', listener);
    };
  }, [document]);
  // A failed or unsupported script never owns or suppresses the toast.
  if (error) return preview ? null : <EmojiFallback signal={signal} />;
  return (
    <iframe
      ref={frame}
      className={styles.animationFrame}
      title={preview ? '动画预览' : 'clutch_fireworks animation'}
      sandbox="allow-scripts"
      referrerPolicy="no-referrer"
      srcDoc={document.html}
      aria-hidden={!preview}
      tabIndex={-1}
    />
```

</details>

**依据 14 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:168-174](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L168-L174)

作者区分短断线和浏览器播放确认。

```text
- 重复的 Session/tool-call identity 会被忽略。临时事件源
  和播放队列各最多保留 128 项，事件在 30 秒后过期。过期或溢出的待播事件会被丢弃，
  短暂断线可以在这些限制内补收。
- 每个已连接的 owner 页面独立消费事件。效果仅显示在对应 DSH 窗口内，不创建操作系统桌面
  覆盖层。工具成功结果表示请求已记录，不表示浏览器确认完成了播放。
- 全局庆祝仅向 owner 页面开放，使用 DSH 已鉴权的连接。短暂断线可在上述限制内补收；
  刷新页面或 Host 重启不会重播旧庆祝。卸载插件会停止事件接收并移除其 UI。
```

#### 缺口

- 浏览器的 CSP 继承、Worker 资源峰值、错误导航及 owner 可见范围未动态验证。
  **影响**：恶意脚本、受限浏览器和共享屏幕下的工具消息需作为不同风险场景。
  **进一步探讨**：用合成来源和可信脚本验证权限、网络拦截、超时和减少动态模式。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何装、哪些宿主服务必需？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

子包声明 Host/Client 产物、Cordis 补丁、DSH 相关 peer >=0.2.1-rc.1，构建依赖固定到 rc.2。作者给出 npm 安装和本地先构建两条路径，本提交无跟踪 lib。tools 接线核心，Typert/Connection/槽位驱动 Web；systemPrompt 提示可选，自定义设置需 settings 与 dshHomePath 及可写配置。脚本按内容哈希写私有目录，设置带 revision CAS，成功后再清旧引用；若写文件后 CAS 失败，需核对孤立文件。卸载和保存数据清理分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-fireworks/package.json:21-39](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/package.json#L21-L39)

Host 与 Web 出口。

<details>
<summary>查看原文（19行）</summary>

```text
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "import": "./lib/index.js",
      "default": "./lib/index.js"
    },
    "./contract": {
      "types": "./lib/contract/index.d.ts",
      "import": "./lib/contract/index.js",
      "default": "./lib/contract/index.js"
    },
    "./animation": {
      "types": "./lib/animation.d.ts",
      "default": "./lib/animation.js"
    },
    "./client": {
      "types": "./lib/client/entry.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-fireworks/package.json:48-71](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/package.json#L48-L71)

构建和 Web 依赖声明。

<details>
<summary>查看原文（24行）</summary>

```text
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "scripts": {
    "prepublishOnly": "pnpm run build",
    "build": "tsc -p tsconfig.json && node scripts/build-client.mjs",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "pnpm run build && node --test test/*.test.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-gateway",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-fireworks/package.json:84-106](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/package.json#L84-L106)

宿主 peer 最低与部分开发版本。

<details>
<summary>查看原文（23行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-api-gateway": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-typert-protocol": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-typert-registry": ">=0.2.1-rc.1",
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/dsh-client-ui-layout": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-renderer": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-session-projection": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-connection": ">=0.2.1-rc.1",
    "@deepseek-ai/dsh-client-ui-workspace": ">=0.2.1-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-api-gateway": "0.2.1-rc.2",
    "@deepseek-ai/dsh-typert-protocol": "0.2.1-rc.2",
    "@deepseek-ai/dsh-typert-registry": "0.2.1-rc.2",
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
```

</details>

**依据 4 · 源码核查**：[packages/clutch-dsh-fireworks/cordis.patch.yml:1-3](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/cordis.patch.yml#L1-L3)

子包 profile 补丁。

```text
- insert:
    - id: clutch-dsh-fireworks
      name: '@cerbur/clutch-dsh-fireworks'
```

**依据 5 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:14-23](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L14-L23)

作者 npm 安装入口。

<details>
<summary>查看原文（10行）</summary>

````text
### 从 npm 安装

在已安装 DSH CLI 的环境中：

```bash
dsh plugin --profile web add @cerbur/clutch-dsh-fireworks
dsh web
```

如果使用 DeepSeek Harness 源码 checkout 且没有独立的 `dsh` 命令，可使用等价的
````

</details>

**依据 6 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:26-44](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L26-L44)

作者构建后本地安装和 lib 边界。

<details>
<summary>查看原文（19行）</summary>

````text
### 从本地 checkout 安装

先构建 package 和 DSH 源码 checkout，再用绝对路径添加 package：

```bash
cd /absolute/path/to/clutch-dsh
pnpm install
pnpm --filter @cerbur/clutch-dsh-fireworks build

cd /absolute/path/to/deepseek-harness
pnpm install
pnpm run build
pnpm dsh plugin --profile web add /absolute/path/to/clutch-dsh/packages/clutch-dsh-fireworks
pnpm dsh web
```

生成的 `lib/` 目录不会提交，因此应使用这个已构建的本地 checkout 流程，而不要从原始
`github:` path 直接安装。修改 `package.json` 或 `cordis.patch.yml` 后，需要重新执行绝对
路径安装命令。
````

</details>

**依据 7 · 源码核查**：[packages/clutch-dsh-fireworks/src/index.ts:27-48](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/index.ts#L27-L48)

核心 tools 与分支依赖 settings、Typert。

<details>
<summary>查看原文（22行）</summary>

```text
export const name = 'clutch-dsh-fireworks';
export const inject = ['tools'];
export const Config: z<{ animation: unknown }> = z.object({
  animation: z.any().default(DEFAULT_STORED_ANIMATION_PREFERENCES).volatile(),
});

export function apply(ctx: Context): void {
  ctx.inject(['settings'], (scope) => {
    const settings = (
      scope as unknown as {
        settings: { configure(presentation: { auto: boolean }, owner: unknown): () => void };
      }
    ).settings;
    scope.effect(() => settings.configure({ auto: false }, scope.fiber));
  });
  ctx.inject(['typert'], (connectionContext) => {
    const feed = new FireworksEventFeed();
    connectionContext.effect(() => () => feed.dispose());
    const service = new FireworksRemoteService(connectionContext, feed);
    connectionContext.inject(['settings', 'dshHomePath'], (scope) => {
      const ports = scope as unknown as { settings: AnimationSettingsPort; dshHomePath(): string };
      const library = new AnimationLibrary(new AnimationFiles(ports.dshHomePath()), ports.settings);
```

</details>

**依据 8 · 源码核查**：[packages/clutch-dsh-fireworks/src/animation-files.ts:39-65](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/animation-files.ts#L39-L65)

读文件 NOFOLLOW、大小和哈希检查。

<details>
<summary>查看原文（27行）</summary>

```text
  async read(path: string, id: string, signal?: AbortSignal): Promise<string> {
    if (!isAnimationFilePath(path)) throw new Error('Invalid animation file reference');
    signal?.throwIfAborted();
    const directory = await this.directory(false);
    const file = await open(
      join(directory, path.slice(ANIMATION_FILES_DIRECTORY.length + 1)),
      constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK,
    );
    try {
      const info = await file.stat();
      if (!info.isFile()) throw new Error('Invalid animation file type');
      if (info.size > MAX_SCRIPT_BYTES)
        throw new CorruptAnimationFileError('Invalid animation file size');
      const bytes = Buffer.alloc(MAX_SCRIPT_BYTES + 1);
      let length = 0;
      while (length < bytes.length) {
        const { bytesRead } = await file.read(bytes, length, bytes.length - length, null);
        if (bytesRead === 0) break;
        length += bytesRead;
      }
      if (length > MAX_SCRIPT_BYTES)
        throw new CorruptAnimationFileError('Animation exceeds 64 KiB');
      const source = bytes.subarray(0, length).toString('utf8');
      if (path !== `${ANIMATION_FILES_DIRECTORY}/${hash(source)}.js`)
        throw new CorruptAnimationFileError('Animation file checksum mismatch');
      parseAnimation(source, id);
      signal?.throwIfAborted();
```

</details>

**依据 9 · 源码核查**：[packages/clutch-dsh-fireworks/src/animation-files.ts:88-101](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/animation-files.ts#L88-L101)

独占临时文件、sync、原子换名。

<details>
<summary>查看原文（14行）</summary>

```text
    const directory = await this.directory(true);
    const temporary = join(directory, `.${randomUUID()}.tmp`);
    const file = await open(temporary, 'wx', 0o600);
    try {
      await file.writeFile(source, 'utf8');
      await file.sync();
      await file.close();
      signal?.throwIfAborted();
      await rename(temporary, join(directory, `${hash(source)}.js`));
      return path;
    } finally {
      await file.close();
      await unlink(temporary).catch((error: NodeJS.ErrnoException) => {
        if (error.code !== 'ENOENT') throw error;
```

</details>

**依据 10 · 源码核查**：[packages/clutch-dsh-fireworks/src/animation-library.ts:106-120](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/animation-library.ts#L106-L120)

保存串行及 revision 冲突拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
  save(request: AnimationSaveRequest, signal: AbortSignal): Promise<AnimationSettingsValue> {
    return this.enqueue(() => this.update(request, signal));
  }
  private async update(
    request: AnimationSaveRequest,
    signal: AbortSignal,
  ): Promise<AnimationSettingsValue> {
    signal.throwIfAborted();
    const preferences = parseAnimationPreferences(request.preferences);
    if (!Number.isSafeInteger(request.expectedRevision) || request.expectedRevision < 0)
      throw new Error('Invalid settings revision');
    if (!this.settings.writable) throw new Error('Settings are read-only');
    const descriptor = this.descriptor();
    if (descriptor.revision !== request.expectedRevision)
      throw new Error('SETTINGS_CONFLICT: Settings changed; reload before saving');
```

</details>

**依据 11 · 源码核查**：[packages/clutch-dsh-fireworks/src/animation-library.ts:149-186](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/animation-library.ts#L149-L186)

文件写入先于配置 CAS，旧引用成功后才清。

<details>
<summary>查看原文（38行）</summary>

```text
    for (const [id, source] of Object.entries(preferences.scripts)) {
      // Reuse unchanged references directly. Besides avoiding redundant I/O, this
      // cannot recreate bytes deleted between the preflight read and config CAS.
      files[id] =
        'version' in previous && previousSources[id] === source
          ? previous.files[id]
          : await this.files.write(source, id, signal);
      const template = parseAnimation(source, id);
      metadata[id] = { name: template.name, durationMs: template.durationMs };
    }
    signal.throwIfAborted();
    const stored: StoredAnimationPreferences = {
      version: 2,
      active: preferences.active,
      files,
      ...(Object.keys(metadata).length ? { metadata } : {}),
    };
    await this.settings.mutate(
      ANIMATION_NAMESPACE,
      [{ op: 'set', path: ['animation'], value: stored }],
      request.expectedRevision,
    );
    // Config CAS must succeed before removing bytes. Preserve hashes still used
    // by another id, live namespace, or persisted DSH profile.
    const retained = new Set(Object.values(files));
    const failures: string[] = [];
    if ('version' in previous) {
      for (const path of new Set(Object.values(previous.files))) {
        if (retained.has(path)) continue;
        try {
          const live = this.settings.describe().some(({ ns, value }) => {
            if (ns !== ANIMATION_NAMESPACE) return false;
            const animation = (value as { animation?: unknown })?.animation;
            if (!animation) return false;
            const parsed = parseStoredAnimationPreferences(animation);
            return 'version' in parsed && Object.values(parsed.files).includes(path);
          });
          if (!live) await this.files.removeUnreferenced(path);
```

</details>

**依据 12 · 作者声明**：[packages/clutch-dsh-fireworks/README.zh.md:193-202](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/README.zh.md#L193-L202)

作者卸载命令。

<details>
<summary>查看原文（10行）</summary>

````text
## 卸载

使用 DSH CLI：

```bash
dsh plugin --profile web remove @cerbur/clutch-dsh-fireworks
```

如果使用 DeepSeek Harness checkout，可对同一个 package name 使用
`pnpm dsh plugin --profile web remove`。
````

</details>

#### 缺口

- 仓库声明范围的所有宿主兼容、实际 npm 可用性和回滚耗时未知。
  **影响**：升级、只读配置或旧状态影响自定义工作流。
  **进一步探讨**：用隔离 profile 固定包，覆盖只读设置、保存冲突、卸载和备份恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样比较回合提示与多会话导航价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

在两个合成会话对照原生列表和内置 Emoji 路径，预先标注完成、失败和日常步骤，再比较真实模型触发比例、错报、定位耗时、准确率和遮挡。补做 owner/non-owner、短断线、刷新、排队过期及卸载。首轮只用内置动画，观察提示是否被误读为验收；关键事件被漏掉或误导时回到原生会话列表。

#### 证据与依据

**依据 1 · 源码核查**：[packages/clutch-dsh-fireworks/test/fireworks-host.test.mjs:75-88](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/test/fireworks-host.test.mjs#L75-L88)

成功投影有项目测试定义，未执行。

<details>
<summary>查看原文（14行）</summary>

```text
test('reduces only a valid successful fireworks result', () => {
  const initial = null;
  const signal = applyFireworksProjection(
    initial,
    resultEvent({
      meta: { kind: FIREWORKS_META_KIND, id: 'call-42', message: 'MVP shipped!' },
    }),
  );
  assert.deepEqual(signal, { id: 'call-42', message: 'MVP shipped!' });

  assert.equal(
    applyFireworksProjection(
      signal,
      resultEvent({
```

</details>

**依据 2 · 源码核查**：[packages/clutch-dsh-fireworks/test/fireworks-events.test.mjs:28-47](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/test/fireworks-events.test.mjs#L28-L47)

静默基线和短期续接测试定义，未执行。

<details>
<summary>查看原文（20行）</summary>

```text
test('fresh subscribers and restarted hosts establish silent baselines', async () => {
  const feed = new FireworksEventFeed();
  feed.publish(launch('old'));
  assert.deepEqual((await opening(feed)).events, []);
  assert.deepEqual((await opening(feed, { epoch: 'previous-host', after: 99 })).events, []);
  assert.deepEqual((await opening(feed, { epoch: feed.epoch, after: 999 })).events, []);
  feed.dispose();
});

test('native streams push multiple events, deduplicate Session/call pairs and resume cursors', async (t) => {
  const feed = new FireworksEventFeed();
  t.after(() => feed.dispose());
  const readers = [open(feed), open(feed)];
  const baseline = (await readers[0].next()).value;
  await readers[1].next();
  const waiting = readers.map((reader) => reader.next());
  feed.publish(launch('same-call', 'first'));
  feed.publish(launch('same-call', 'first'));
  for (const result of await Promise.all(waiting))
    assert.equal(result.value.events[0].sessionId, 'first');
```

</details>

**依据 3 · 源码核查**：[packages/clutch-dsh-fireworks/test/fireworks-cordis.test.mjs:139-145](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/test/fireworks-cordis.test.mjs#L139-L145)

非 owner 读聚合流的负向用例定义，未执行。

```text
test('native Gateway rejects invalid cursors and non-owner aggregate reads even with an allow policy', async (t) => {
  const { ctx, mount, stream } = await harness(t);
  await mount();
  await assert.rejects(stream({ epoch: 'only-one-field' }));
  const guest = new Peer(ctx, { principal: { kind: 'fixture-guest' }, interactions: 'none' });
  await assert.rejects(stream({}, guest), /owner required/);
});
```

**依据 4 · 源码核查**：[packages/clutch-dsh-fireworks/test/fireworks-controller.test.mjs:125-145](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/test/fireworks-controller.test.mjs#L125-L145)

跨会话串行用例定义，未执行。

<details>
<summary>查看原文（21行）</summary>

```text
test('serializes complete events across Sessions and preserves A toast until it ends', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout', 'Date'], now: 1_000 });
  const controller = new FireworksController(async () => {
    throw new Error('unused');
  });
  t.after(() => controller.stop());
  controller.accept([launch('a'), launch('a'), launch('a', 'second')]);
  assert.equal(controller.getSnapshot().burst.sessionId, 'background');
  t.mock.timers.tick(FIREWORKS_DURATION_MS);
  assert.equal(controller.getSnapshot().burst, undefined);
  assert.equal(controller.getSnapshot().toast.sessionId, 'background');
  controller.accept([launch('a', 'second')]);
  assert.equal(controller.getSnapshot().burst, undefined, 'new batches cannot bypass A toast');
  t.mock.timers.tick(FIREWORKS_TOAST_DURATION_MS - FIREWORKS_DURATION_MS);
  assert.equal(controller.getSnapshot().burst.sessionId, 'second');
  assert.equal(controller.getSnapshot().toast.sessionId, 'second');
  t.mock.timers.tick(FIREWORKS_DURATION_MS);
  assert.equal(controller.getSnapshot().burst, undefined);
  assert.equal(controller.getSnapshot().toast.sessionId, 'second');
  t.mock.timers.tick(FIREWORKS_TOAST_DURATION_MS);
  assert.equal(controller.getSnapshot().toast, undefined);
```

</details>

**依据 5 · 源码核查**：[packages/clutch-dsh-fireworks/src/client/FireworksOverlay.tsx:63-76](https://github.com/Cerbur/clutch-dsh/blob/4714f11b634e13ea8f128692eae68a29bf3d6a6d/packages/clutch-dsh-fireworks/src/client/FireworksOverlay.tsx#L63-L76)

用来源 Session ID 对照定位。

<details>
<summary>查看原文（14行）</summary>

```text
        className={styles.toastAction}
        type="button"
        onClick={() => {
          try {
            openSession(toast.sessionId);
            setNavigationError(undefined);
            dismiss();
          } catch {
            setNavigationError('Unable to open this session. Please try again.');
          }
        }}
      >
        <span>{toast.message ?? 'A big milestone deserves fireworks!'} 🎉</span>
        <span className={styles.toastHint}>Open session →</span>
```

</details>

#### 缺口

- 没有观察到真实模型触发和用户识别结果。
  **影响**：是否值得在多会话工作采用依赖误报与干扰。
  **进一步探讨**：同一用户在固定脚本对照导航和状态判断，预先设定退出条件。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
