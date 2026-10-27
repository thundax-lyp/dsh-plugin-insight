# dsh-client-ui-aqua-patched

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[e3d96e4](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/tree/e3d96e46e3ef0034b1304663ffcd70a87ff70982)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched)
<!-- END META -->

> **功能**：Aqua 玻璃主题的非官方修补分支，针对 DSH 0.1.2-rc.1 修三处加载/设置入口问题。

> **亮点**：修复旧 Aqua 主题在 DSH 0.1.2 的三处接口断裂，延续原有外观能力。详见[Q01](#research-q01)。

> **主要限制**：交付 lib 是手工修补的预构建产物，src 未类型检查；只验证一个宿主版本，不能从源码镜像推断更广兼容。详见[Q02](#research-q02)。

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
  - [Q01 · 修补版给用户提供什么，修的是哪三处？](#detail-section-11)
  - [Q02 · 交付产物与源码和状态怎样对应？](#detail-section-12)
  - [Q03 · 采用时需注意哪些兼容和许可问题？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户在固定 DSH 0.1.2-rc.1 Web profile 使用玻璃主题与壁纸。

DSH 原生 UI 或上游未修补 Aqua；分支只针对后者的版本断裂。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 玻璃界面 | 个性化 | 视觉未独立验 |
| 修补入口 | 适配 0.1.2 | 更广版本未知 |
| 本地壁纸 | 自定义 | 配额和残留 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH 0.1.2-rc.1 | 已报告兼容 | 其它版本未验 |
| 浏览器 localStorage | 偏好/壁纸 | 状态不能保存 |
| 许可确认 | 分发使用 | 决策待定 |

#### 试用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 安装 | github 分支而非上游裸包 | 正确产物哈希 |
| UI | 开/关主题、壁纸 | 可恢复 |
| 升级 | 更换宿主版本 | 先验再迁移 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 安装 | GitHub/git、固定 DSH 版本 | 仅作者验证 0.1.2-rc.1 |
| 使用 | 浏览器存储/GPU | 大壁纸配额/性能未知 |
| 升级 | 重新适配/测试 | 手工产物 |

#### 效果

| 项 | 材料支持 | 未知 |
| --- | --- | --- |
| 玻璃主题 | src/预构建入口 | 本轮视觉未验 |
| 设置开关 | namespace/key/localStorage | 当前宿主实效 |
| 兼容 | 作者单版本报告 | 后续版本 |

> **思考**：交付 lib 是手工修补的预构建产物，src 未类型检查；只验证一个宿主版本，不能从源码镜像推断更广兼容。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：修复旧 Aqua 主题在 DSH 0.1.2 的三处接口断裂，延续原有外观能力。详见[Q01](#research-q01)。

通过 keyed slot 和空设置命名空间补 DSH 0.1.2 接口；交付以手工修补 lib 为真相，src 是镜像。

<a id="detail-section-5"></a>

### 1.4 主要限制

交付 lib 是手工修补的预构建产物，src 未类型检查；只验证一个宿主版本，不能从源码镜像推断更广兼容。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

固定版本的隔离 profile 装入、核哈希、重跑 CDP 与人工视觉/开关测试，确认许可再部署。详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

三处修复与检出产物哈希可核；作者报告的目标宿主 CDP 结果未独立复现，兼容面和授权链有边界。

- 已检查：作者 README、包清单、源码路径 README.zh.md、REPAIR.md、package.json、lib/client.js、lib/index.js、src/index.ts、src/client/index.ts、src/client/settings-store.ts、src/client/theme-layer.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README.zh、REPAIR、src/关键路径和当前 lib 哈希；未运行 DSH/CDP 或视觉验收。
- 下一步：目标 0.1.2-rc.1 重跑作者 CDP 与人工视觉；核状态残留、壁纸配额和版本升级。

**分析版本**

- **仓库**：[Aliww2468/dsh-client-ui-aqua-patched](https://github.com/Aliww2468/dsh-client-ui-aqua-patched)
- **版本号**：1.3.1-patch.1（[固定提交 e3d96e4](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/tree/e3d96e46e3ef0034b1304663ffcd70a87ff70982)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把补丁重建和固定宿主视觉回归自动化，可降低后续适配负担；该分支目前未实现。详见[Q03](#research-q03)。

目标 0.1.2-rc.1 重跑作者 CDP 与人工视觉；核状态残留、壁纸配额和版本升级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 751 | — | — | 8326 |
| .js | source | 6 | 4028 | 3516 | 583 | — |
| .tsx | source | 3 | 568 | 398 | 154 | — |
| .ts | source | 19 | 3907 | 2885 | 742 | — |
| .mjs | source | 2 | 229 | 184 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+created%3A2026-09-22T06%3A15%3A20.003Z..2026-10-22T06%3A15%3A20.003Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A15%3A20.003Z..2026-10-22T06%3A15%3A20.003Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实非官方 Aqua 修补分支的三项修复、实际交付产物及兼容/许可证边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 修补版给用户提供什么，修的是哪三处？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Aqua 将 DSH Web 的顶栏、侧栏、输入区等变为玻璃材质，提供流体/壁纸背景、云母/兼容模式及粒子装饰。本分支不是原创主题，作者明确列出三项适配 DSH 0.1.2 的修复：浏览器 import 改用 dsh-client-store、设置卡片注册加 key=aqua、Host 注册 aqua 设置命名空间。源码和包内产物有这些对应路径；本轮未重跑作者的 CDP 端到端夹具，因此“已在 0.1.2-rc.1 工作”属于作者报告。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-17](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/README.zh.md#L1-L17)

作者定位非官方修补分支及主题价值。

<details>
<summary>查看原文（17行）</summary>

```text
> **非官方修补分支 —— 已修复以适配 DSH 0.1.2-rc.1。**
> 上游 `dsh-client-ui-aqua@1.3.1`（npm，2026-08-17）与上游仓库 HEAD 在 DSH 0.1.2 线上均无法工作。
> 本分支修复了三处独立缺陷，并已在 DSH 0.1.2-rc.1（宿主 Node v22.21.1）上完成端到端验证。
> 诊断、逐项改动、证据与注意事项见 **[REPAIR.md](REPAIR.md)**。与上游作者无隶属、无背书、
> 无维护关系；按 **AGPL-3.0-only** 分发（见[许可证](#许可证)）。本分支所依据的上游源码说明
> 见[上游与本分支](#上游与本分支)。

# dsh-client-ui-aqua —— DeepSeek Harness 玻璃质感主题

[English](README.md) | 中文

## 一句话价值

装上它，DSH 网页端立刻变成磨砂玻璃——顶栏、侧边栏、输入框、统计行与轨迹视图化作悬浮玻璃片，背景可以是流动的流体板，也可以是你自己的壁纸。关掉唯一的总开关，界面完全还原，不留任何残留。

## 安装

```

</details>

**依据 2 · 作者声明**：[REPAIR.md:48-79](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/REPAIR.md#L48-L79)

三项修复与交付文件列表。

<details>
<summary>查看原文（32行）</summary>

````text

```
Error: keyed slot "settings.plugin.item" requires options.key
```

### 1.3 The host half serves no settings namespace, so the card can never render

The node half is `export function apply(): void {}`. Since rc.7 the settings page
dispatches cards **by served settings namespace** — `ConfigurablePluginsTab`
renders `renderSlot("settings.plugin.item", {}, { entryKey: ns })` once per
namespace the host answers for. With no namespace registered, no `entryKey`
equals `aqua`, so the card is never dispatched even after 1.2 is fixed: the
master on/off switch silently disappears.

---

## 2. Changes in this fork

| File | Change |
|---|---|
| `lib/client.js` | `require("@deepseek-ai/dsh-client-runtime/client")` → `require("@deepseek-ai/dsh-client-store")` |
| `lib/client.js` | `settings.plugin.item` registration gains `key: "aqua"` (keeps `id`) |
| `lib/index.js` | empty `apply()` → registers an empty pass-through settings namespace `aqua` via `ctx.inject(['settings'], scope => scope.settings.register('aqua', schema, { base: {} }))` |
| `src/client/settings-store.ts` | import re-pointed at `@deepseek-ai/dsh-client-store` |
| `src/client/index.ts` | slot registration gains `key: 'aqua'`; the type-only `ClientContext` import re-pointed at `@deepseek-ai/cordis` |
| `src/index.ts` | source-level mirror of the host-half namespace registration |
| `lib/types/index.d.ts` | matches the new `apply(ctx)` signature |
| `package.json` | version `1.3.1-patch.1`; `dsh.client.inject` and `peerDependencies` re-pointed from `dsh-client-runtime` to `dsh-client-store`; license statement corrected (see §5) |

The namespace registered by the node half is a deliberate **empty pass-through**:
Aqua keeps its state in `localStorage` behind the browser half, so the namespace's
only job is to make the card dispatchable. Host-side settings values for `aqua`
````

</details>

**依据 3 · 源码核查**：[src/index.ts:1-57](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/src/index.ts#L1-L57)

Host 注册 aqua 命名空间。

<details>
<summary>查看原文（57行）</summary>

```text
/**
 * Aqua theme-layer plugin, node half.
 *
 * Upstream this half is an empty `apply()`: the enable flag is a browser-local
 * preference and a client-only visual layer owns no host configuration.
 *
 * Since DSH 0.1.2-rc.1 that is not enough. The settings page dispatches plugin
 * cards by *served settings namespace* — `settings.plugin.item` is a keyed slot
 * rendered once per namespace the host answers for, and the key must match one
 * of them. Aqua's card is keyed `aqua`, but the host served no such namespace,
 * so the card never dispatched: registering the keyed slot first threw
 * `keyed slot "settings.plugin.item" requires options.key`, and would have
 * rendered nothing even once the key was supplied.
 *
 * The stored values are not the point — Aqua keeps them in localStorage behind
 * the browser half. This half therefore registers an empty pass-through
 * namespace whose only job is to make the card dispatchable. Its schema is
 * duck-typed to what the settings seam calls on it (callable plus `toJSON`), so
 * this package still needs no `@deepseek-ai/*` import at runtime.
 */

/** Settings namespace the browser half's card is keyed by. */
const AQUA_NAMESPACE = 'aqua'

/** Schema-shaped callable the settings seam accepts in place of a real schema. */
interface PassThroughSchema {
  (value: unknown): Record<string, unknown>
  toJSON(): {
    uid: number
    refs: Record<string, { type: string; meta: { default: Record<string, unknown> }; dict: Record<string, unknown> }>
  }
}

/** Minimal host context surface used here (avoids a runtime package import). */
interface HostContext {
  inject?: (deps: string[], callback: (scope: { settings: { register: (name: string, schema: unknown, options: { base: Record<string, unknown> } ) => unknown } }) => void) => void
}

const passThroughSchema = ((value: unknown) => ({ ...((value ?? {}) as Record<string, unknown>) })) as PassThroughSchema

passThroughSchema.toJSON = () => ({
  uid: 0,
  refs: { 0: { type: 'object', meta: { default: {} }, dict: {} } },
})

/**
 * Host plugin body: advertise the namespace the Aqua settings card dispatches
 * on, so `Settings → Plugins` can render its master switch.
 * @param ctx - cordis host context.
 */
export function apply(ctx: HostContext): void {
  if (typeof ctx.inject !== 'function') return
  ctx.inject(['settings'], (scope) => {
    try {
      scope.settings.register(AQUA_NAMESPACE, passThroughSchema, { base: {} })
    } catch (error) {
      console.error(`[ui-aqua] settings namespace skipped: ${String(error)}`)
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:180-189](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/src/client/index.ts#L180-L189)

卡片 keyed slot 用 aqua。

<details>
<summary>查看原文（10行）</summary>

```text
  // match the namespace the node half registers (`aqua`) or the card silently
  // never renders. `id` is kept for the older list-shaped slot.
  ctx.slots.inject('settings.plugin.item', () => ctx.slots.register({
    name: 'settings.plugin.item',
    id: 'aqua',
    key: 'aqua',
    order: 5,
    store: pluginStore,
    locale: NS,
    inject: pluginInjected,
```

</details>

#### 缺口

- 未在目标 DSH 0.1.2-rc.1 重跑浏览器。
  **影响**：真实视觉、插件冲突和设置卡片行为未独立证实。
  **进一步探讨**：在可回滚 profile 重跑作者夹具并人工检查壁纸/开关。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 交付产物与源码和状态怎样对应？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

README/REPAIR 指出上游 monorepo 依赖 workspace:^，本分支无法独立构建；实际安装的是手工修过的预构建 lib，而 src 只作可审镜像且未类型检查。本轮独立计算 lib/client.js 与 lib/index.js 的 SHA-256，分别为 c2e0…e214 与 983f…a56d，与 REPAIR.md 记载相同，仅证明当前检出字节匹配作者报告的测试对象，不证明测试结果。Host aqua namespace 是空 pass-through，真实主题状态在浏览器 localStorage；关闭开关移除视觉层，但偏好键仍保留，不能把“视觉恢复”理解成清空持久化数据。

#### 证据与依据

**依据 1 · 作者声明**：[REPAIR.md:69-87](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/REPAIR.md#L69-L87)

说明手工补丁、src 未类型检查及状态只在 localStorage。

<details>
<summary>查看原文（19行）</summary>

```text
| `lib/client.js` | `settings.plugin.item` registration gains `key: "aqua"` (keeps `id`) |
| `lib/index.js` | empty `apply()` → registers an empty pass-through settings namespace `aqua` via `ctx.inject(['settings'], scope => scope.settings.register('aqua', schema, { base: {} }))` |
| `src/client/settings-store.ts` | import re-pointed at `@deepseek-ai/dsh-client-store` |
| `src/client/index.ts` | slot registration gains `key: 'aqua'`; the type-only `ClientContext` import re-pointed at `@deepseek-ai/cordis` |
| `src/index.ts` | source-level mirror of the host-half namespace registration |
| `lib/types/index.d.ts` | matches the new `apply(ctx)` signature |
| `package.json` | version `1.3.1-patch.1`; `dsh.client.inject` and `peerDependencies` re-pointed from `dsh-client-runtime` to `dsh-client-store`; license statement corrected (see §5) |

The namespace registered by the node half is a deliberate **empty pass-through**:
Aqua keeps its state in `localStorage` behind the browser half, so the namespace's
only job is to make the card dispatchable. Host-side settings values for `aqua`
are stored but unused. The same technique is used in production by
`@liustack/modsearch` on this DSH line.

### Why the built artifacts are patched by hand

Upstream's repository is an extraction from the author's `deepseek-harness`
monorepo: every `@deepseek-ai/*` dependency is declared as `workspace:^`, and
`tsdown`/`typescript` are not declared at all even though `scripts.bundle` calls
```

</details>

**依据 2 · 作者声明**：[REPAIR.md:109-132](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/REPAIR.md#L109-L132)

作者 CDP 测试与两份产物哈希。

<details>
<summary>查看原文（24行）</summary>

````text
| Plugins tab card | “玻璃主题 …” card with master switch present |
| Master switch functional | click → layer removed, `localStorage['dsh.ui-aqua.enabled'] = "false"`, fluid canvas gone; click again → layer back, flag `"true"`; zero exceptions |

Shipped artifact hashes (SHA-256), i.e. the exact bytes that passed the tests:

```
lib/client.js  C2E0E6DFBAAC69ABF70D8A9D57FE233EDC2BDAFB0188709EAA1BE1FEB3FCE214
lib/index.js   983FE201220FFD74F103961E882B549AEAD22390567BF0D8BDF6582E3D07A56D
```

`lib/client.js.map` was removed: it belonged to upstream's repository build,
which is not the build shipped here.

Reproduce:

```sh
dsh plugin --profile web add link:<path-to-this-repo>       # or github:<owner>/<repo>
dsh --profile web --port 0 --no-open                        # note the printed token URL
node tools/cdp-aqua-test.mjs "http://127.0.0.1:<port>/?token=<token>" 15000
node tools/cdp-eval.mjs     "http://127.0.0.1:<port>/?token=<token>" 12000 @tools/expr-toggle.js
```

---

````

</details>

**依据 3 · 源码核查**：[src/client/theme-layer.ts:199-215](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/src/client/theme-layer.ts#L199-L215)

启用标记读写 localStorage。

<details>
<summary>查看原文（17行）</summary>

```text
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/theme-layer.ts:610-625](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/src/client/theme-layer.ts#L610-L625)

开关应用/撤销视觉层。

<details>
<summary>查看原文（16行）</summary>

```text
    if (value === this.enabled) return
    this.enabled = value
    writeEnabled(value)
    this.sync()
  }

  /** Set the rendering mode ('mica' or 'compat'). */
  setMode(value: 'mica' | 'compat'): void {
    if (value === this.settings.mode) return
    this.settings.mode = value
    writeMode(value)
    if (this.enabled) { this.applySettings(); this.applyTokens() }
  }

  /** Set the glass blur radius (px). */
  setBlur(value: number): void {
```

</details>

#### 缺口

- 未独立验证 lib 与 src 全量语义一致或重跑测试。
  **影响**：源码镜像不能替代预构建产物审计。
  **进一步探讨**：用固定 SHA 产物在隔离宿主做视觉/开关/卸载验证，必要时逐字节比较修补 diff。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用时需注意哪些兼容和许可问题？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

作者只在 DSH 0.1.2-rc.1 验证，且分支是一次性社区修复；直接安装 npm 裸包名会得到未修复上游版。主题无需运行时外部服务的声明来自作者对产物的静态审计，壁纸 data URL 存 localStorage 会受浏览器配额限制，GPU/视觉开销未测。上游仓库 LICENSE 为 AGPL、其 npm 包称 MIT，本分支按 AGPL-3.0-only 声明分发；这是一项明确的来源/再分发不确定性，不在本轮作法律判断。建议仅在相同目标版本隔离试用，确认许可适用性、视觉可读性、存储容量和升级恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:19-57](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/README.zh.md#L19-L57)

安装方式、版本基线及避免裸 npm 包。

<details>
<summary>查看原文（39行）</summary>

````text

```sh
dsh plugin --profile web add github:Aliww2468/dsh-client-ui-aqua-patched
dsh --profile web --dump-config     # 校验：应出现 "# == dsh-client-ui-aqua" 这一层
dsh web                             # 重启宿主；主题默认开启
```

需要 `git` 位于 `PATH` 且能访问 `github.com`（受限网络需要 HTTP 代理）。插件会把自身追加进 `dsh.profile.bundles`。各控件见[使用](#使用)；权限、外部服务与兼容性见[权限、外部服务与兼容性](#权限外部服务与兼容性)。

### 从本仓库安装（推荐）

上面那段就是全部：安装本修补版，并通过包内的 `dsh.bundle.patch` 自动注册为 profile 插件层，所有平台通用。

### 从本地克隆安装

```sh
git clone https://github.com/Aliww2468/dsh-client-ui-aqua-patched.git
dsh plugin --profile web add link:/本仓库的绝对路径
```

### 卸载

```sh
dsh plugin --profile web remove dsh-client-ui-aqua
```

然后重启 `dsh web`。所有视觉效果都是可释放的 effect，随插件一并回收，原生界面随之还原。

### 环境要求

DSH **0.1.2-rc.1**（本分支的验证基线，宿主 Node v22.21.1）。安装会往 profile 的
`dsh.profile.bundles` 追加 `dsh-client-ui-aqua`，因此**必须重启宿主**主题才会加载。

### ⚠️ 不要安装 npm 上的裸包名

```sh
dsh plugin --profile web add dsh-client-ui-aqua   # ← 装到的是上游未修复的 1.3.1
```

````

</details>

**依据 2 · 作者声明**：[README.zh.md:100-128](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/README.zh.md#L100-L128)

运行权限、localStorage、外部依赖与兼容表。

<details>
<summary>查看原文（29行）</summary>

```text
## 权限、外部服务与兼容性

以下结论审计自随包产物（`lib/client.js`、`lib/index.js`），即 REPAIR.md §3 中给出哈希的那份字节。

| 问题 | 结论 |
|---|---|
| 运行时网络请求 | **无。** 浏览器半中 `fetch`、`XMLHttpRequest`、`WebSocket`、`EventSource`、`sendBeacon` 出现次数均为 0；宿主半不 import 任何模块，也不触网。 |
| 文件 / 凭据 / Cookie | **无。** 不使用文件系统或凭据服务，不读 `document.cookie`，无 `eval` / `new Function`，不加载远程代码。 |
| 实际触碰的内容 | 往页面注入一张 `<style>` 与若干装饰性 DOM 节点（氛围场景、壁纸层、边缘渐隐），并注册一个名为 `aqua` 的设置命名空间。效果仅此而已。 |
| 存储的状态 | 仅 `localStorage` 中 `dsh.ui-aqua.*` 前缀的键（开关、模式、模糊度、磨砂度、背景、壁纸、鲸鱼、小鱼、网状、悬停、按下…）。自定义壁纸以 data URL 存在 `localStorage`，因此超大图片或视频可能触及浏览器存储配额。 |
| 遥测 / 账号 | 无。没有统计上报、不需要账号、不需要 API key。 |
| 安装期执行代码 | **无。** `package.json` 未声明 `install` / `postinstall` / `prepare`，且 `lib/` 随包提供预构建产物，因此 `dsh plugin add` 不会执行任何包脚本。 |
| 外部服务 | 主题本身不依赖任何外部服务。安装过程需访问一次 GitHub 且需要 `git`；受限网络下需要 HTTP 代理。 |
| 兼容性 | 仅在 **DSH 0.1.2-rc.1**（宿主 Node v22.21.1）上验证通过。上游的 peer 基线是 `^0.1.0-rc.5`，本分支未在其它 DSH 线上测试。上游已停止维护，未来 DSH 版本可能再次使其失效——建议把 `dump-config` 那一步固定进你的升级流程。 |
| 卸载 | `dsh plugin --profile web remove dsh-client-ui-aqua` 后重启。所有视觉效果都是可释放的 effect，移除即回收，原生界面随之还原。 |
| 维护 | 一次性的社区修复，非上游维护。无任何担保；唯一可依赖的兼容性承诺是那两组产物哈希。 |

## DSH 插件规范符合性

- **宿主半导出 `apply(ctx)`** —— `lib/index.js` 提供 `export { apply }` 与
  `function apply(ctx)`：它注册浏览器半卡片所依的 key（设置命名空间 `aqua`），这正是
  DSH 0.1.2 上总开关能被派发的原因。
- **浏览器半导出 `apply` + `inject`** —— `lib/client.js` 是 lazy-CJS 的
  `window.__ModuleLoader__.load({ id: "dsh-client-ui-aqua", factory })` 产物，工厂返回
  `exports.apply` 与 `exports.inject = ['theme', 'slots', 'locale']`。
- **bundle 补丁** —— `dsh.bundle.patch` 指向 `cordis.patch.yml`，其中插入唯一的加载器行
  `{ id: ui-aqua, name: 'dsh-client-ui-aqua' }`；包名与该行一致，因此一条
  `dsh plugin add` 即可同时完成安装与挂载。
- **浏览器 roster** —— `dsh.client` 声明 `platform: web`，并列出需先加载的模块 id。
```

</details>

**依据 3 · 作者声明**：[REPAIR.md:141-155](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/REPAIR.md#L141-L155)

作者说明兼容与许可证冲突。

<details>
<summary>查看原文（15行）</summary>

```text
- Office document previews, embedded-browser logins and other upstream caveats are
  unchanged.

## 5. License and copyright

- Upstream repository `LICENSE` = **GNU AGPL-3.0** (34.5 kB, read in full).
- The published npm tarball `dsh-client-ui-aqua@1.3.1` ships a 1.1 kB **MIT**
  `LICENSE` and declares `"license": "MIT"`. The same code, two licenses — an
  upstream inconsistency, not something this fork can resolve.
- This fork therefore follows the **more restrictive** reading: it keeps the
  upstream AGPL-3.0 `LICENSE` file untouched and is distributed under
  **AGPL-3.0-only**. All modifications are listed in §2 and the repository is
  public, satisfying AGPL's source-availability terms.
- Copyright in the original work remains with the upstream author. Please ask
  upstream to clarify the MIT/AGPL discrepancy before redistributing elsewhere.
```

</details>

**依据 4 · 源码核查**：[src/client/theme-layer.ts:368-378](https://github.com/Aliww2468/dsh-client-ui-aqua-patched/blob/e3d96e46e3ef0034b1304663ffcd70a87ff70982/src/client/theme-layer.ts#L368-L378)

壁纸 data URL 写 localStorage。

<details>
<summary>查看原文（11行）</summary>

```text
    return localStorage.getItem(WALLPAPER_KEY) ?? ''
  } catch {
    return ''
  }
}

/** Persist the wallpaper data URL (quota failures keep it in memory only). */
function writeWallpaper(value: string): void {
  try {
    localStorage.setItem(WALLPAPER_KEY, value)
  } catch {
```

</details>

#### 缺口

- 未核上游授权链、真实性能或其它 DSH 版本。
  **影响**：生产/再分发决策仍需独立许可和版本审查。
  **进一步探讨**：在目标部署确认许可、升级矩阵、性能与大壁纸配额；向上游确认冲突。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
