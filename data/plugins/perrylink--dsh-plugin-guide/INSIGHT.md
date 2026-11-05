# dsh-plugin-guide

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b7d2fa5](https://github.com/PerryLink/dsh-plugin-guide/tree/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-plugin-guide) [![npm 30d 8,679](https://img.shields.io/static/v1?label=npm+30d&message=8%2C679&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guide) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-guide)
<!-- END META -->

> **功能**：提供 DSH 插件安装启动、用户流程和 Cordis 实践指南，并将检查与搭建任务路由到对应项目。

> **亮点**：它把兼容识别、完整用户旅程和工程实践分成不同证据轨道，减少把静态识别误称运行通过的概念混淆；实际减少误称的效果未测。[Q01](#research-q01)

> **主要限制**：知识包不拥有检查结论，且外部main链接与未锁版本的命令可能漂移，读者须另固定检查器与结果，不能据指南出认证。[Q03](#research-q03)

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
  - [Q01 · 插件作者如何从三层指南决定下一步核查？](#detail-section-11)
  - [Q02 · 指南如何装入宿主，引用和卸载由谁处理？](#detail-section-12)
  - [Q03 · 读完指南是否证明插件通过，依赖与失效点是什么？](#detail-section-13)
  - [Q04 · 采用指南的投入和退出办法是否可控？](#detail-section-14)
  - [Q05 · 能否从路由边界形成新的验证方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH插件作者可在设计和评审时查找该收集什么证据、该使用哪个检查入口。[Q01](#research-q01)

直接阅读官方开发文档和各检查器说明可完成同一任务；本组件的增量是将不同问题分层和路由，不能替代原始规则。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 按需指南Skill | 帮助作者定位兼容、旅程与实践问题 | 依赖skills服务；本包不执行检查 |
| 包内参考文档 | 解释证据和常见误称 | 外部规则链接需另固定版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills服务与effect | 加载必需 | 注册和撤回指南 | 不能注册时直接读文档 |
| Node >=24.9.0；DSH >=0.2.2-0 <0.3.0 | 包声明 | 运行兼容 | 超范围须重新核查 |
| dsh-standards等外部项目 | 执行检查时必需 | 取得检查结果 | 仅可阅读指南，不宣称已检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 作者选定目标插件和固定版本 | 明确要核查哪一层 |
| 加载 | 宿主注册指南Skill | 正文与相对docs可读，否则直接读文件 |
| 使用 | 作者按路由另固定工具并收集证据 | 结果附版本、环境与原件 |
| 退出 | 作者停用Skill，回原始文档 | 不保留无依据的通过说法 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装与模型阅读费用未知 | 阅读分层和核对版本，耗时未知 | 入口不调用外部API |
| 持续使用 | 上下文与外部检查资源未知 | 收集证据、维护版本对应 | 不自动执行检查 |
| 失败恢复 | 重新检查资源未知 | 追溯失效链接与误称结论 | 可直接阅读固定原文 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 按需知识入口 | index.js实际注册Skill与资源根 | 宿主实际加载 |
| 证据分层 | 正文明确静态与运行差别 | 是否降低误称或漏检 |
| 任务路由 | 给出外部工具入口 | 外部工具当前能力与检查结果 |

> **思考**：知识包不拥有检查结论，且外部main链接与未锁版本的命令可能漂移，读者须另固定检查器与结果，不能据指南出认证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把兼容识别、完整用户旅程和工程实践分成不同证据轨道，减少把静态识别误称运行通过的概念混淆；实际减少误称的效果未测。[Q01](#research-q01)

入口仅依赖skills服务并用effect管理注册，知识资源根明确；正则只适合本包简单frontmatter，复用复杂YAML需另设计。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

知识包不拥有检查结论，且外部main链接与未锁版本的命令可能漂移，读者须另固定检查器与结果，不能据指南出认证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用一个固定版本插件试做证据清单，另保存检查工具版本与原件；出现认证误称或路由漂移时回到固定原文。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Skill注册和分层指导有固定材料支持，评审质量与外部checker能力未验证，卡片设计为假设。

- 已检查：作者 README、包清单、源码路径 index.js、SKILL.md、docs/levels.md、docs/entry.md、docs/flow.md、docs/boost.md、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查本包入口、patch、Skill和四份指南；未取得外部checker固定源码或运行结果，不继承其能力或认证。
- 下一步：以同批评审记录比较误称、漏项和人工时间；卡片假设另做升级对照。

**分析版本**

- **仓库**：[PerryLink/dsh-plugin-guide](https://github.com/PerryLink/dsh-plugin-guide)
- **版本号**：0.4.3（[固定提交 b7d2fa5](https://github.com/PerryLink/dsh-plugin-guide/tree/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

版本绑定路由卡片可能提高升级后结论变化的可解释性；需比较解释率和维护时间，不成立就保留现有日志。这是未实现假设。[Q05](#research-q05)

以同批评审记录比较误称、漏项和人工时间；卡片假设另做升级对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1293 | — | — | 16951 |
| .js | source | 1 | 56 | 32 | 20 | — |
| .mjs | test | 1 | 59 | 53 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PerryLink/dsh-plugin-guide/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：三层指南是否能帮助插件作者选择正确证据与检查入口，而不把知识指导当认证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件作者如何从三层指南决定下一步核查？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它服务于设计或评审DSH插件、容易把包识别和运行可用混淆的作者。合格结果是知道应核查哪类证据并找到对应工具，不是取得认证。相对直接读宿主文档，它把安装启动、用户旅程和Cordis实践分开解释，并给出检查路由；这是知识整理与任务分流的增量。指南明确自己不执行评判，自动检查归dsh-standards、规则正文归dsh-plugin-spec、搭建归dsh-primer；不能将这些外部工具的能力计入本组件。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:16-44](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/SKILL.md#L16-L44)

三层定义与外部任务路由。

<details>
<summary>查看原文（29行）</summary>

```text
## The three layers

1. **ENTRY — can it be recognized, installed, and started?**
   - Checkable compatibility gate.
   - Use `dsh-standards`; do not infer a pass from the manifest alone.
   - `recognized` is not the same as `runtime`; `static` is not a pass.

2. **FLOW — can a user install, configure, use, upgrade, and remove it without
   fighting it?**
   - J1–J8 user journeys.
   - Runtime evidence is required for a runtime claim; `not-run` is not a pass.
   - The flow harness is still a draft; report its limits honestly.

3. **BOOST — does it use Cordis well?**
   - LEV-1–8 practices: effects, inject/get, volatile config, event modes,
     seams, stable prompt prefixes, bounded parallel/jobs, composition.
   - This is a **practice library**, not a grade. It has evidence cards, not a
     plugin-level pass/fail.
   - Never turn BOOST into a certification or a score.

## Route the work

- **Run a check:** `npx dsh-standards <plugin-dir> --scope entry --entry-claim static`
  for recognition; add a host/runtime when claiming runtime.
- **Three-layer self-check:** `npx -p dsh-standards dsh-levels <plugin-dir> --format json`.
- **Build or scaffold a plugin:** use the `dsh-primer` skill/CLI. The old
  `dsh-plugin-dev` command belongs to `dsh-primer`, not to this guide.
- **Read the rules:** `dsh-plugin-spec`; **read the guide:** this package;
  **run the checks:** `dsh-standards`.
```

</details>

**依据 2 · 源码核查**：[docs/levels.md:14-54](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/docs/levels.md#L14-L54)

区分兼容、旅程与实践证据。

<details>
<summary>查看原文（41行）</summary>

```text
## ENTRY

ENTRY is the compatibility floor. It checks the package shape, entry points,
bundle patch, version/peer range, metadata, labels, and — when a runtime claim is
made — an actual start.

- `recognized` means the package can be identified. It is **not** a runtime
  pass.
- `runtime` requires an actual plugin start or bundle boot (G0–G3).
- `static` is not a pass. `not-run` is not a pass.

Start here: [ENTRY guide](entry.md) and the canonical
[31-DSH-ENTRY](https://github.com/PerryLink/dsh-standards/blob/main/31-DSH-ENTRY%E5%85%A5%E9%97%A8%E8%A7%84%E8%8C%83.md).

## FLOW

FLOW is the user journey: install/remove, enable/disable, configuration,
first success, permissions, upgrade/rollback, observability, and client/server
modes.

- The current FLOW harness is a draft. Some J1–J8 checks have runtime evidence;
  others are static preflight or `not-run`.
- `runtime`, `failed`, and `not-run` are the FLOW statuses. A partial run is
  `not-run`, never a soft pass.

Start here: [FLOW guide](flow.md) and the canonical
[32-DSH-FLOW](https://github.com/PerryLink/dsh-standards/blob/main/32-DSH-FLOW%E9%A1%BA%E7%95%85%E8%A7%84%E8%8C%83.md).

## BOOST

BOOST is a practice library for using Cordis well: effects, inject/get,
volatile configuration, event modes, seams, stable prompt prefixes, bounded
parallel/jobs, and composition.

- A practice can be evidenced; a plugin does not get a “BOOST level”.
- The measured examples are fixtures or synthetic captures, not production
  baselines.
- It is not a certification, score, or market gate.

Start here: [BOOST guide](boost.md) and the canonical
[33-DSH-BOOST](https://github.com/PerryLink/dsh-standards/blob/main/33-DSH-BOOST%E5%8A%A0%E9%80%9F%E5%AE%9E%E8%B7%B5.md).
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 指南如何装入宿主，引用和卸载由谁处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle patch插入dsh-plugin-guide运行时；模块声明必需skills服务，在apply中同步读取本包SKILL.md，剥离简单YAML头，将正文注册为按需Skill。resourceBase指向包目录，允许正文相对引用docs；register返回值由ctx.effect管理，卸载时撤回注册。它不直接导入宿主实现，也没有CLI执行、网络请求或工程改写链路。frontmatter解析只是正则抽取单行description而非完整YAML解析，当前本包简单格式匹配，但复用时不能承诺复杂YAML都成立。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-34](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/index.js#L12-L34)

服务声明、包根和简化frontmatter解析。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = 'dsh-plugin-guide'
export const inject = ['skills']

const packageRoot = dirname(fileURLToPath(import.meta.url))

/**
 * Strip the YAML frontmatter block from SKILL.md and return the description
 * plus the instruction body. A malformed or missing block falls back to the
 * full text as the body.
 *
 * @param text - raw SKILL.md content.
 * @returns parsed description (when the frontmatter carries one) and body.
 */
export function splitFrontmatter(text) {
  const open = /^---\r?\n/.exec(text)
  if (!open) return { description: undefined, body: text }
  const rest = text.slice(open[0].length)
  const close = /\r?\n---[ \t]*(?:\r?\n|$)/.exec(rest)
  if (!close) return { description: undefined, body: text }
  const meta = rest.slice(0, close.index)
  const body = rest.slice(close.index + close[0].length).replace(/^(?:[ \t]*\r?\n)+/, '')
  const match = /^description:[ \t]*(.+?)[ \t]*$/m.exec(meta)
  return { description: match?.[1]?.trim(), body }
```

</details>

**依据 2 · 源码核查**：[index.js:42-55](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/index.js#L42-L55)

真实注册、资源根和effect清理。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx) {
  const skillPath = join(packageRoot, 'SKILL.md')
  const { description, body } = splitFrontmatter(readFileSync(skillPath, 'utf8'))
  ctx.effect(() =>
    ctx.skills.register({
      name: 'dsh-plugin-guide',
      source: 'bundled',
      description:
        description
        ?? 'DSH plugin quality guide: ENTRY, FLOW, and BOOST layers, with check routing and evidence rules.',
      content: body,
      resourceBase: { kind: 'directory', path: packageRoot },
    }),
  )
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:5-9](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/cordis.patch.yml#L5-L9)

bundle运行时插入。

```text
- insert:
    # `id`: stable row identifier used by later layers to override this row.
    - id: dsh-plugin-guide
      # `name`: the module the loader imports; resolves to this package's entry (package.json#main → index.js).
      name: dsh-plugin-guide
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 读完指南是否证明插件通过，依赖与失效点是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不证明。ENTRY的recognized只说明包形态能识别；FLOW草案目前有fixture和静态预检混合边界；BOOST是实践卡片而非插件等级。外部规范链接指向main，执行工具由npx独立取得，本固定指南没有锁定其未来版本，因此只能把这些链接当后续路线，不能把外部checker当前行为当已核查事实。宿主需提供skills与effect接口；包声明Node >=24.9.0和DSH >=0.2.2-0 <0.3.0，实际加载兼容仍限源码层。

#### 证据与依据

**依据 1 · 源码核查**：[docs/entry.md:20-29](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/docs/entry.md#L20-L29)

识别与运行证据严格区分。

<details>
<summary>查看原文（10行）</summary>

```text
## The two claims

| Claim | Meaning | What it needs |
|---|---|---|
| `static` / `recognized` | the package shape can be identified | manifest/entry inspection only |
| `runtime` | it actually starts or boots | plugin L1, or bundle G0–G3 |

`recognized` is not a pass. A bundle is not proven by importing its server
entry; it needs G0–G3. A client-only package is build-only unless a browser
probe exists.
```

</details>

**依据 2 · 源码核查**：[docs/flow.md:35-49](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/docs/flow.md#L35-L49)

草案覆盖边界和外部入口。

<details>
<summary>查看原文（15行）</summary>

````text
## Current limit

The runtime harness is still a draft. J1/J2/J4/J6 have runtime evidence on
fixtures; J3/J7 have fixture-level runtime; J5/J8 have static preflight; browser
rendering is not yet covered. The guide must state which journey was actually
run.

The source harness lives in
[`40-checker/scripts/journey.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey.mjs)
and
[`journey-runtime.mjs`](https://github.com/PerryLink/dsh-standards/blob/main/40-checker/scripts/journey-runtime.mjs).
The three-layer audit reads FLOW evidence through `--flow-evidence`:

```sh
npx -p dsh-standards dsh-levels ./my-plugin --flow-evidence flow.json --format json
````

</details>

**依据 3 · 源码核查**：[docs/boost.md:57-74](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/docs/boost.md#L57-L74)

fixture证据与外部审计命令。

<details>
<summary>查看原文（18行）</summary>

````text
## Current limits

- The measured examples are fixture-level, provider-capture, or synthetic timer
  results. They are not production baselines.
- LEV-3, LEV-6, and LEV-7 have the strongest current evidence; the others have
  loader/context-level fixtures.
- BOOST is not a market gate and must not become a certification.

## Run the audit

```sh
npx -p dsh-standards dsh-levels ./my-plugin \
  --boost-evidence boost.json --format json
```

Without evidence, the result is `not-measured`, not a pass. See
[`40-checker`](https://github.com/PerryLink/dsh-standards/tree/main/40-checker)
for the evidence schema and examples.
````

</details>

**依据 4 · 源码核查**：[package.json:29-32](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/package.json#L29-L32)

声明运行环境范围。

```text
  "engines": {
    "node": ">=24.9.0",
    "dsh": ">=0.2.2-0 <0.3.0"
  },
```

#### 缺口

- 外部检查器和规范未作为本次固定材料取得。
  **影响**：不能判断外部工具是否执行了指南描述的全部规则。
  **进一步探讨**：开展检查时另固定dsh-standards版本与原始结果，记录环境和退出码。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用指南的投入和退出办法是否可控？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次使用要安装bundle或直接阅读文档，再确认Skill和相对引用可读取。持续使用主要是模型阅读上下文、作者收集证据与运行外部检查的人工成本；本包入口本身不发起外部API或进程，但实际模型花费、检查时间和缺陷减少量未知。相比手工追读多份文档，统一路由可能减少找入口的摩擦，却没有对照测量。可先在一个插件评审中试用，检查是否正确保留not-run和静态边界；如果模型开始把指南当认证、引用已失效或版本条件不符，就停止使用并返回固定宿主文档人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:42-55](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/index.js#L42-L55)

入口只读取注册知识正文。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx) {
  const skillPath = join(packageRoot, 'SKILL.md')
  const { description, body } = splitFrontmatter(readFileSync(skillPath, 'utf8'))
  ctx.effect(() =>
    ctx.skills.register({
      name: 'dsh-plugin-guide',
      source: 'bundled',
      description:
        description
        ?? 'DSH plugin quality guide: ENTRY, FLOW, and BOOST layers, with check routing and evidence rules.',
      content: body,
      resourceBase: { kind: 'directory', path: packageRoot },
    }),
  )
```

</details>

**依据 2 · 源码核查**：[SKILL.md:46-58](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/SKILL.md#L46-L58)

证据规则与非认证边界。

<details>
<summary>查看原文（13行）</summary>

```text
## Evidence rules

- `static` ≠ `runtime`; `recognized` ≠ `pass`; `not-run` ≠ `pass`.
- A PASS needs a command, artifact, environment, and date.
- BOOST evidence is per practice, not per plugin.
- If evidence is missing, write `not-run`, `not-measured`, or `incomplete`.
- Do not say “official”, “certified”, “secure”, “recommended”, or “ranked”.

## Boundary

This project is non-official and has no certification, accreditation, security
audit, or market gate. It does not score or rank plugins. When in doubt, link to
the source document and state what was not run.
```

</details>

#### 缺口

- 没有同类评审任务的耗时、漏检率或上下文开销对照。
  **影响**：不能证明指南使评审更快或质量更高。
  **进一步探讨**：同批插件对比人工文档阅读与Skill辅助，统计证据误称、漏项及人工时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否从路由边界形成新的验证方向？

**研究主题**：新假设与验证

#### 完整回答

可提出固定版本路由卡片的未验证假设。Q03发现知识正文固定而外部main链接及npx工具会漂移，若每次评审把指南版本、checker精确版本、规则提交和原始结果绑定成卡片，可能减少跨版本误解。最小验证是在工具升级前后重跑同组插件，比较无法解释的结论变化和维护卡片的时间；若变化已能由现有日志解释，或维护负担超过收益，就不应增加这层结构。它不是本组件已实现的能力，也不能由此推断真实市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:38-44](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/SKILL.md#L38-L44)

外部命令未固定精确版本。

```text
- **Run a check:** `npx dsh-standards <plugin-dir> --scope entry --entry-claim static`
  for recognition; add a host/runtime when claiming runtime.
- **Three-layer self-check:** `npx -p dsh-standards dsh-levels <plugin-dir> --format json`.
- **Build or scaffold a plugin:** use the `dsh-primer` skill/CLI. The old
  `dsh-plugin-dev` command belongs to `dsh-primer`, not to this guide.
- **Read the rules:** `dsh-plugin-spec`; **read the guide:** this package;
  **run the checks:** `dsh-standards`.
```

**依据 2 · 源码核查**：[docs/entry.md:16-18](https://github.com/PerryLink/dsh-plugin-guide/blob/b7d2fa52d6d6cce7a992fc25ba7086ce31afa69b/docs/entry.md#L16-L18)

规则链接指向main。

```text
The exact rule IDs and evidence rules are in
[`31-DSH-ENTRY`](https://github.com/PerryLink/dsh-standards/blob/main/31-DSH-ENTRY%E5%85%A5%E9%97%A8%E8%A7%84%E8%8C%83.md)
and [`40-checker`](https://github.com/PerryLink/dsh-standards/tree/main/40-checker).
```

#### 缺口

- 版本绑定卡片尚未实现、效果未知。
  **影响**：不计入现有采用优势。
  **进一步探讨**：用固定样本升级对照检验解释率和维护时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
