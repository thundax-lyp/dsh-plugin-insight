# Archify

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[25cf370](https://github.com/tt-a1i/archify/tree/25cf37080fc8b1dbe758a4efc3935b55f3327083)

<!-- BEGIN META -->
[![GitHub ★ 88,446](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88%2C446&color=yellow&logo=github&style=flat)](https://github.com/tt-a1i/archify)
<!-- END META -->

> **实现功能**：将需求、代码关系和解释内容组织成交互式图表及单页 HTML。

> **核心亮点**：相对直接让模型绘图，贡献是把结构化创作、交互产物和绑定实际文件的阶段验收串成流程；它提高交付可追溯性，不证明模型理解正确。[Q01](#research-q01) [Q02](#research-q02)

> **风险与缺陷**：产物与收据一致不等于关系和结论正确；源码证据选择及异常流程覆盖仍由作者负责，自动可读性不能代替语义复核。[Q03](#research-q03)

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
  - [Q01 · Archify 的交互式交付相对简单画图增加了什么？](#detail-section-11)
  - [Q02 · finalize 如何绑定交付证据，能否用一份旧收据替代当前文件？](#detail-section-12)
  - [Q03 · 门禁不能证明哪些正确性，使用者需承担什么成本？](#detail-section-13)
  - [Q04 · 如何提高证据审阅效率，什么用户适合试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合向开发者或协作者解释架构、流程和复杂答案；结果需同时可读、可核对。

参照为手工关系清单、静态图和模型直接写SVG；本次只比较机制，没有同条件效果排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 结构化交互图 | 解释系统关系和流程 | 模型需正确取舍来源，自动检查不证明语义 |
| 单页解释产物 | 组织结论、面板与图表 | 不等于仪表盘，内容由Agent编写 |
| finalize交付 | 绑定候选、HTML与检查收据 | 正常路径需要shell和相应浏览器环境 |

启动条件与不满足时的影响见[Q03](#research-q03)的“启动与依赖”表。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户提供问题和可读取来源 | 确定范围与合格关系 |
| 创作 | Agent按Skill写JSON | 保留来源和重要异常 |
| 交付 | finalize执行各阶段 | 仅通过收据可声明自动检查通过 |
| 复核 | 用户对照源码读图 | 语义错误回到候选修订 |

**效果与成本**

首次使用、持续使用、失败恢复的现金/资源与人工成本见[Q03](#research-q03)的“成本”表；没有实测金额或时长的项目保持未知。

已实现机制与未确定效果分开列在[Q03](#research-q03)的“效果”表，不从源码或作者声明推算业务收益。

> **思考**：产物与收据一致不等于关系和结论正确；源码证据选择及异常流程覆盖仍由作者负责，自动可读性不能代替语义复核。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对直接让模型绘图，贡献是把结构化创作、交互产物和绑定实际文件的阶段验收串成流程；它提高交付可追溯性，不证明模型理解正确。[Q01](#research-q01) [Q02](#research-q02)

相对直接让模型绘图，贡献是把结构化创作、交互产物和绑定实际文件的阶段验收串成流程；它提高交付可追溯性，不证明模型理解正确。[Q01](#research-q01) [Q02](#research-q02)

入口 CLI 动态加载 finalize；其阶段明确为 validate、deliver、check、browser-check。收据不仅检查成功布尔值，还校验候选和产物的 SHA-256、字节数、receiptId、provenance 与所需视口覆盖。写收据时先创建独占临时文件，捕获普通文件绑定，在提交前重新核对，再经共享发布函数写入；这使“某文件曾通过”与“当前字节已通过”之间有具体防串线机制。

这个贡献是证据一致性和交付协议。它并不将错误业务描述变为正确关系，也不等于所有写入竞态已被本次证明消除。浏览器自动门禁验证容纳、可读性、主题等条件，Skill同时明确通过收据不包含人工感知审查。可借鉴的是阶段收据与实际字节绑定、拒绝不完整证据；迁移时需一起移植路径、普通文件身份和原子发布约束，单独拷贝一个哈希字段不等价。

<a id="detail-section-5"></a>

### 1.4 主要限制

产物与收据一致不等于关系和结论正确；源码证据选择及异常流程覆盖仍由作者负责，自动可读性不能代替语义复核。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先选一条熟悉的请求链，检查关系、来源与HTML交付，再决定扩大；无法承担源码复核时先保留简单图。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有源码支持交付协议与交互组织机制；任务收益未独立实测，未来证据门禁假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、archify/SKILL.md、archify/package.json、archify/bin/archify.mjs、archify/bin/finalize.mjs、archify/renderers/shared/atomic-output.mjs、archify/references/delivery-contract.md、archify/references/repository-authoring.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交核心9文件抽读；inventory为partial inspected snapshot，不是完整LOC。两个NUL导致全量统计失败；未据此宣称上游运行故障。未检查全部图种和第三方viewer实现。
- 下一步：以固定仓库关系清单盲评语义正确性、遗漏和总修订时间，分别记录自动门禁和人工审阅。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：未声明（[固定提交 25cf370](https://github.com/tt-a1i/archify/tree/25cf37080fc8b1dbe758a4efc3935b55f3327083)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是在保留重要关系的前提下增加逐关系事实性质和证据覆盖门禁，比较人工清单能否减少遗漏且不放大复核负担。[Q04](#research-q04)

以固定仓库关系清单盲评语义正确性、遗漏和总修订时间，分别记录自动门禁和人工审阅。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：608858fba6677f92cf3cd959e82342b28024e6d365f5cfb9ef63795e0840d455。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 10326 | 9763 | 241 | — |
| .md | source | 4 | 1449 | — | — | 16158 |

</details>

**活跃度**

[![Issue 未关闭 150](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=150&color=grey&logo=github&style=flat)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 139](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=139&color=grey&logo=github&style=flat)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 87](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=87&color=grey&logo=github&style=flat)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Archify如何将复杂解释变成可追溯、可验收的交互交付物？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Archify 的交互式交付相对简单画图增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Archify 面向需要解释系统关系、变更流程或复杂结论的人。输入可以是需求描述、Mermaid 或仓库材料，合格结果是带规格 JSON、交互 HTML 和验收收据的解释产物；代码架构图还须保持源码证据。相比手工画图或让模型直接写 SVG，增量是把创作约束、JSON中间表示、交互阅读及发布检查组合成可重复流程，而不是证明模型自动理解所有代码。

根组件的 Skill 当前声明 3.2.0，覆盖多种图和 explainer。它不同于 DSH 子目录适配包，后者 release.json 固定的是另一历史 Skill 提交；不能把根组件能力当作已发布适配包能力。作者给出的共享单页与源码卡片说明了交付形式，尚无本次独立用户对照。画得完整、可打开和判断正确是三个不同验收目标。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:87-107](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/README.md#L87-L107)

作者说明无需仓库也可生成，解释页包含结论、面板和来源。

<details>
<summary>查看原文（21行）</summary>

````text
- **Diagrams that explain.** Steps sit beside the diagram they walk through and light its parts as you read. Click any node to open the full interactive view.
- **Easy to check.** Claims cite numbered sources; repository excerpts are pinned to a commit and open in a source card.
- **Easy to share.** One HTML file with four styles and light or dark themes. Export a PNG, WebP or JPG long image, or print to PDF. Ask about any panel to get a follow-up your agent can use to revise just that panel.

```text
Use Archify to answer as one page: our API's P99 went from 80 ms to 600 ms
while the mean barely moved. What is the likely cause, and how should we investigate?
```

Live examples: [First HTTPS visit](https://archify.si/cases/explainer/tls-first-visit.html) · [P99 latency (Chinese)](https://archify.si/cases/explainer/p99-tail-latency.html) · [How Archify finalize keeps the last good file, read from this repository (Chinese)](https://archify.si/cases/explainer/finalize-delivery.html) · [First rental checklist (Chinese)](https://archify.si/cases/explainer/first-rental.html)

<a id="sponsors"></a>

## ❤️ Sponsors

<p align="center">
  <a href="https://www.kimi.ai/?aff=archify"><img src="docs/assets/sponsors/archify-kimi-work.png" alt="Archify × Kimi Work collaboration banner" width="800" /></a>
</p>

**Archify × Kimi Work.** Find Archify in the Kimi Work plugin store as **Interactive Architecture Diagram**. Describe your system in one sentence to create an interactive diagram. **[Try it in Kimi Work →](https://www.kimi.ai/?aff=archify)**

````

</details>

**依据 2 · 源码核查**：[archify/SKILL.md:18-47](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/SKILL.md#L18-L47)

Skill规定选择产物、编写完整候选、仓库证据和finalize。

<details>
<summary>查看原文（30行）</summary>

````text
## Choose the artifact

- When the user asks to draw or visualize a system, flow, schema or history, use a native diagram and the Type router.
- Use `explainer` when the user asks for the answer as a page: a page, one page, an explainer, something to share (“做成一页”, “用页面讲”, “answer with a page”). Without such a request, answer in text or draw the requested diagram. A page made on request ends its reply with the one-line mode offer under Output.
- A rules line in context changes this. `[archify explainer: proactive]`: also make a page, unasked, for an explanation, comparison, trade-off, decision, diagnosis, review or plan that needs a table, steps or several sections. `[archify explainer: always-on]`: every reply that reaches a conclusion also gets a compact page of at most four panels, delivered without opening it, its link closing the reply. `[archify explainer: on-demand]`: only when asked, and never offer a mode.
- In every mode a page needs a conclusion with some structure behind it: chat, one-line answers, raw command output and text-only requests get none.
- For `explainer`, read [Explainer authoring](references/explainer-authoring.md) for its conclusion, reasons, scope, board layout and optional native diagrams. Write the complete draft, then run `finalize explainer` for validation, atomic delivery and artifact checks. Use panel patch for local content revisions.

## Existing candidate handoff

When the user supplies a frozen candidate, run `finalize` first as one CLI invocation. Its passing receipt completes the automated gates; follow any visual review recommendation under Delivery before claiming visual quality. For repair, follow step 5.

`finalize` includes a bounded update check in its delivery receipt; see Update awareness.

## Native diagram authoring

Use this path for ordinary generation. Read branch references only when their stated trigger applies.

1. Choose `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `class`, `tree`, `timeline`, or `waterfall` from the question.
2. Use the exact schema and example paths in the Type router without listing their directories. Read [Authoring defaults](references/authoring-defaults.md) and the mode's example in a bounded batch separate from project documents and complete schemas so neither is truncated; recover any missing section before writing. For Architecture, use the matching showcase example. For every mode except Architecture, also read the mode and common schemas. Read the relevant schema definition before choosing any new field, enum, or constrained text, especially boundary kinds. Examples teach shape, not facts. Use fresh IDs, wording, and layout. Go directly to the candidate without preliminary help, doctor, starter validation, temporary diagrams, or output-path listing. Query brands only for an explicitly requested mark; read [Brand marks](references/brand-marks.md) for an unknown mark with a user-provided URL.
3. Once the requested scope and, for a real codebase, [source evidence](references/repository-authoring.md) are covered, write the complete candidate directly without planning coordinates in prose. Choose Architecture abstraction and connected placement using Authoring defaults before coordinates: show the main user journey and necessary branches, preserve control roles and behavior-changing conditions, and leave enough room for actual relationship labels. No node, relationship, source, view, card, or boundary count is a target or ceiling. Use automatic routes first; add explicit routing only for necessary branch, return, supplied geometry, or measured repair. Set `meta.quality_profile` to `"showcase"` unless the user requests dense `standard`. For ERD, use a table-first layout: show every physical column in `entities[].attributes`, keep its SQL type and source comment, state every key role a column carries (`key` takes a role or a list, so a junction column is `["pk", "fk"]`, and every `fk` column also needs `references` like `"orders.id"`), and never move columns into cards as a substitute for the table. Classify tables into functional domains before placement, give each domain a concise `tag`, and place its members in one solid rectangle of grid cells — a single row, a single column, or a filled rectangular block, not an L or diagonal. A tagged table always needs `row`/`col`, because absolute coordinates have no grid cells and a domain whose tables do not fill one rectangle cannot be drawn as a band: the renderer reports `erd/domain-not-drawn` instead of publishing a diagram that cannot name the domain. A multi-domain schema reads best as one domain per column — each `tag` a vertical run — because the reader scales a wide canvas up to the reader width and shrinks a tall one until the page fits, so the wide arrangement is the one that stays complete and legible inside a laptop viewport. A schema-first ERD over roughly 8 tables or 50 fields is itself a dense map: author its first complete-field pass at `standard` and upgrade only once the layout still reads.
4. Once the complete first candidate is written, run `finalize` directly. Its first gate is showcase validation; successful first drafts need no separate pre-validation. Keep the candidate unchanged while the command runs:

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   For a repository-backed candidate, include evidence on the first draft and use the complete first command: `node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`. Pass the `--quality` that matches `meta.quality_profile`, such as `standard` for a dense first ERD pass.

   A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed. Use its compact summary; run standalone commands only for a separate request or focused failure diagnosis.
````

</details>

#### 缺口

- 未有同条件用户理解或决策质量对照
  **影响**：不能量化交互形式相对静态图的业务收益
  **进一步探讨**：同仓库任务对比静态图与交互产物，盲评关系正确率、理解时间与人工修订

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · finalize 如何绑定交付证据，能否用一份旧收据替代当前文件？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口 CLI 动态加载 finalize；其阶段明确为 validate、deliver、check、browser-check。收据不仅检查成功布尔值，还校验候选和产物的 SHA-256、字节数、receiptId、provenance 与所需视口覆盖。写收据时先创建独占临时文件，捕获普通文件绑定，在提交前重新核对，再经共享发布函数写入；这使“某文件曾通过”与“当前字节已通过”之间有具体防串线机制。

这个贡献是证据一致性和交付协议。它并不将错误业务描述变为正确关系，也不等于所有写入竞态已被本次证明消除。浏览器自动门禁验证容纳、可读性、主题等条件，Skill同时明确通过收据不包含人工感知审查。可借鉴的是阶段收据与实际字节绑定、拒绝不完整证据；迁移时需一起移植路径、普通文件身份和原子发布约束，单独拷贝一个哈希字段不等价。

#### 证据与依据

**依据 1 · 源码核查**：[archify/bin/finalize.mjs:22-34](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/bin/finalize.mjs#L22-L34)

阶段常量及产物身份函数。

<details>
<summary>查看原文（13行）</summary>

```text
export const FINALIZE_STAGES = Object.freeze(['validate', 'deliver', 'check', 'browser-check']);
const FINALIZE_UPDATE_DEADLINE_MS = 4_000;

function sha256(buffer) {
  return createHash('sha256').update(buffer).digest('hex');
}

function identity(file) {
  try {
    const bytes = fs.readFileSync(file);
    return { path: path.resolve(file), sha256: sha256(bytes), bytes: bytes.byteLength };
  } catch {
    return { path: path.resolve(file) };
```

</details>

**依据 2 · 源码核查**：[archify/bin/finalize.mjs:59-86](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/bin/finalize.mjs#L59-L86)

收据临时写入、regular-file绑定、原子提交及清理。

<details>
<summary>查看原文（28行）</summary>

```text
  let binding;
  let stagedIdentity;
  try {
    fs.writeFileSync(temporary, serialized, { flag: 'wx' });
    const metadata = fs.lstatSync(temporary, { bigint: true });
    stagedIdentity = { device: metadata.dev, inode: metadata.ino };
    if (capture.mode !== null) fs.chmodSync(temporary, capture.mode);
    const staged = captureRegularFileBinding(temporary, {
      subject: 'finalize-receipt', expectedIdentity: stagedIdentity,
      expectedSha256: sha256(serialized), expectedBytes: serialized.byteLength,
      ...(capture.mode === null ? {} : { expectedMode: capture.mode }),
    });
    if (staged.status !== 'captured') throw receiptWriteError(file, staged);
    binding = staged.binding;
    beforeCommit();
    const publication = publishRegularFileBinding(binding, temporary, capture.snapshot, { subject: 'finalize-receipt' });
    if (!['committed', 'committed-with-warning'].includes(publication.status)) throw receiptWriteError(file, publication);
    // Preserve recovery evidence instead of reporting a clean completion when cleanup failed.
    if (publication.status === 'committed-with-warning') throw receiptWriteError(file, publication);
    const next = captureReceipt(file);
    if (!pathsAlias(next.commitPath, capture.commitPath)) {
      throw receiptWriteError(file, { status: 'different', reason: { code: 'receipt-slot-changed' } });
    }
    return next;
  } finally {
    if (binding) releaseRegularFileBinding(binding);
    if (stagedIdentity) removeOwnedRegularFile(temporary, stagedIdentity, { subject: 'finalize-receipt' });
  }
```

</details>

**依据 3 · 源码核查**：[archify/bin/finalize.mjs:195-220](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/bin/finalize.mjs#L195-L220)

不同阶段核对receipt结构、产物身份、provenance及浏览器证据。

<details>
<summary>查看原文（26行）</summary>

```text
      && validReceiptId(receipt.receiptId)
      && isReceiptObject(receipt.specification)
      && validIdentity(receipt.specification)
      && validIdentity(receipt.artifact)
      && validDeliveryValidation(receipt, quality, options);
  }
  if (stage === 'check') {
    return validIdentity(receipt.artifact)
      && allChecksPassed(receipt.checks)
      && receipt.provenance === 'current'
      && validReceiptId(receipt.deliveryReceiptId)
      && validCheckComposition(receipt, quality);
  }
  return receipt.command === 'browser-check'
    && receipt.schemaVersion === 1
    && receipt.status === 'pass'
    && receipt.evidenceKind === 'automated-browser'
    && validIdentity(receipt.artifact)
    && receipt.provenance === 'current'
    && validReceiptId(receipt.deliveryReceiptId)
    && receipt.containment?.status === 'pass'
    && receipt.themeStates?.status === 'pass'
    && receipt.readability?.status === 'pass'
    && receipt.viewerChrome?.status === 'pass'
    && validBrowserEvidence(receipt);
}
```

</details>

**依据 4 · 源码核查**：[archify/SKILL.md:87-103](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/SKILL.md#L87-L103)

作者明确自动门禁和感知审查的边界。

<details>
<summary>查看原文（17行）</summary>

```text
## Delivery

Use the `finalize` command above for the first candidate and after a repair.

`finalize` stops at the first non-passing gate. Its compact stdout and `<output-stem>.finalize-summary.json` are ordinary evidence. A passing run creates no screenshots and reports `visualReview: "not-requested"`.

When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.

Read [Delivery contract](references/delivery-contract.md) for failed gates, standalone commands, provenance/recovery, repeated delivery, exports, or opening. Native diagram recovery follows `deliver` → strict provenance `check` → `browser-check`; captures require strict provenance. Explainer delivery uses validate, deliver and check as described in its authoring guide.

For workflow viewport overflow, read [Workflow viewport repair](references/authoring-contract.md#workflow-viewport-repair) before the next layout edit.

When reporting verification details, distinguish artifact checks, browser evidence, captures, and actual perceptual review. For an explicitly requested immediate preview or active desktop loop, see [Optional opening](references/delivery-contract.md#optional-opening).
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 门禁不能证明哪些正确性，使用者需承担什么成本？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

关键质疑是源码支持与展示质量之间的断层。Skill要求仓库图从第一版携带证据，但规范/浏览器门禁主要约束格式、布局和产物一致性；选择错误抽象、遗漏重要异常分支仍需研究者核查。流程减少了交付手续的不确定性，没有消除读源码、裁剪范围和人工复核。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 能读取Skill并使用文件与shell的Agent | 正常CLI流程必需 | 作者规格和调用CLI | 不能完成正常自动交付 |
| Node >=18 | 当前清单声明必需 | CLI和渲染器 | 声明之外兼容未知 |
| 可用Chrome及其运行环境 | native图浏览器门禁必需 | 自动浏览器检查 | finalize不能获得完整通过收据 |
| 原仓库与证据选择 | 仓库图必需 | 支撑关系和源码引用 | 仅能声明描述性或假设性图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型、Node、浏览器资源；金额未知 | 安装Skill、确认工具和样例；时长未知 | 开源许可不等于端到端零成本 |
| 持续使用 | 模型上下文和渲染/浏览器开销未知 | 抽象、证据核查和读图复核 | 未测合格图单位成本 |
| 失败恢复 | 修订与重跑资源未知 | 读诊断，修候选，独立保存后续证据 | 不能用非零退出冒充成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 产物身份一致性 | 源码核对字节身份和阶段收据 | 故障注入实测范围 |
| 可阅读的交互交付 | Skill与门禁设计支持 | 用户理解提升与语义准确率 |

根目录全量inventory因 diagnostics.mjs 的两个NUL被本工程统计器拒绝。本轮仅对固定Git中9个核心文件建立SOURCE-SUBSET，inventory只统计其支持扩展名，不表示完整代码规模。这是研究材料边界，不能直接判定插件无法运行。

#### 证据与依据

**依据 1 · 源码核查**：[archify/package.json:1-16](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/package.json#L1-L16)

私有Skill包声明Node与CLI。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "archify",
  "version": "3.2.0",
  "private": true,
  "type": "module",
  "description": "JSON-IR diagram renderers (architecture / workflow / sequence / dataflow / lifecycle / erd / class / tree / timeline / waterfall).",
  "license": "MIT",
  "bin": {
    "archify": "./bin/archify.mjs"
  },
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "generate:viewer": "node ../scripts/generate-viewer.mjs",
    "check:viewer": "node ../scripts/generate-viewer.mjs --check",
```

</details>

**依据 2 · 源码核查**：[archify/SKILL.md:111-120](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/SKILL.md#L111-L120)

作者说明shell可用性和fallback限制。

<details>
<summary>查看原文（10行）</summary>

````text
## Setup and fallback

No install is required inside the skill package. For setup diagnosis, verify with:

```bash
node bin/archify.mjs doctor
node bin/archify.mjs demo <output-directory>
```

For native diagrams, when shell access is unavailable, hand-place architecture SVG into `assets/template.html`, use CSS semantic classes rather than inline colors, and follow the visual review contract in `references/delivery-contract.md`. Explainers require their renderer and real delivery gates; if those are unavailable, report the limitation and give a text answer when useful, without claiming HTML delivery.
````

</details>

**依据 3 · 源码核查**：[archify/SKILL.md:93-103](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/SKILL.md#L93-L103)

修复、证据目录与感知审查边界。

<details>
<summary>查看原文（11行）</summary>

```text
When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.

Read [Delivery contract](references/delivery-contract.md) for failed gates, standalone commands, provenance/recovery, repeated delivery, exports, or opening. Native diagram recovery follows `deliver` → strict provenance `check` → `browser-check`; captures require strict provenance. Explainer delivery uses validate, deliver and check as described in its authoring guide.

For workflow viewport overflow, read [Workflow viewport repair](references/authoring-contract.md#workflow-viewport-repair) before the next layout edit.

When reporting verification details, distinguish artifact checks, browser evidence, captures, and actual perceptual review. For an explicitly requested immediate preview or active desktop loop, see [Optional opening](references/delivery-contract.md#optional-opening).
```

</details>

#### 缺口

- 缺少语义错误但格式合格的对抗样本结果
  **影响**：尚不知交付门禁覆盖业务错误的比例
  **进一步探讨**：构建含遗漏关系、错误方向和失真来源的候选，检查哪些错误只能人工发现
- 无合格图成本采样
  **影响**：无法估算修订负担
  **进一步探讨**：记录首次创作、失败重试、人工审核总时间及token

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何提高证据审阅效率，什么用户适合试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可检验的新假设是为每条关键关系加入“事实/推断/待确认”标记，并把源码证据缺失作为单独门禁，而非把布局通过当作可信度。这从当前身份收据与Skill的源码证据要求推导，属于未来设计，不宣称当前已实现。新增负担是定义重要关系、处理动态依赖和维护证据映射，简单方案是人工关系清单，不应先增加复杂自动判定。

最小验证使用同一仓库、同一模型与预算，比较现有流程、人工关系清单和证据门禁；盲评错误关系检出、复核时间和遗漏率。若门禁只增加标注工作而不减少遗漏，或促使作者删去难证实但重要的关系，就否定其收益。

推荐有shell与浏览器环境、愿意复核源码的开发者先试用单一请求路径，验收关系正确、产物可开、来源可追溯。对要求自动生成即可信、无人工复核的使用者，当前证据不足以支持这种采用。先留存一个已验收产物；不能稳定交付或复核成本高于简单图时停止。

#### 证据与依据

**依据 1 · 源码核查**：[archify/SKILL.md:38-49](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/SKILL.md#L38-L49)

源码证据、finalize和修复约束提供假设推导与试用边界。

<details>
<summary>查看原文（12行）</summary>

````text
3. Once the requested scope and, for a real codebase, [source evidence](references/repository-authoring.md) are covered, write the complete candidate directly without planning coordinates in prose. Choose Architecture abstraction and connected placement using Authoring defaults before coordinates: show the main user journey and necessary branches, preserve control roles and behavior-changing conditions, and leave enough room for actual relationship labels. No node, relationship, source, view, card, or boundary count is a target or ceiling. Use automatic routes first; add explicit routing only for necessary branch, return, supplied geometry, or measured repair. Set `meta.quality_profile` to `"showcase"` unless the user requests dense `standard`. For ERD, use a table-first layout: show every physical column in `entities[].attributes`, keep its SQL type and source comment, state every key role a column carries (`key` takes a role or a list, so a junction column is `["pk", "fk"]`, and every `fk` column also needs `references` like `"orders.id"`), and never move columns into cards as a substitute for the table. Classify tables into functional domains before placement, give each domain a concise `tag`, and place its members in one solid rectangle of grid cells — a single row, a single column, or a filled rectangular block, not an L or diagonal. A tagged table always needs `row`/`col`, because absolute coordinates have no grid cells and a domain whose tables do not fill one rectangle cannot be drawn as a band: the renderer reports `erd/domain-not-drawn` instead of publishing a diagram that cannot name the domain. A multi-domain schema reads best as one domain per column — each `tag` a vertical run — because the reader scales a wide canvas up to the reader width and shrinks a tall one until the page fits, so the wide arrangement is the one that stays complete and legible inside a laptop viewport. A schema-first ERD over roughly 8 tables or 50 fields is itself a dense map: author its first complete-field pass at `standard` and upgrade only once the layout still reads.
4. Once the complete first candidate is written, run `finalize` directly. Its first gate is showcase validation; successful first drafts need no separate pre-validation. Keep the candidate unchanged while the command runs:

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   For a repository-backed candidate, include evidence on the first draft and use the complete first command: `node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`. Pass the `--quality` that matches `meta.quality_profile`, such as `standard` for a dense first ERD pass.

   A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed. Use its compact summary; run standalone commands only for a separate request or focused failure diagnosis.

5. A non-zero exit is never success. Read compact stdout or `evidence.summaryReceipt`, then [repair the failed gate](references/delivery-contract.md#failed-finalize-and-candidate-repair), including its repair limit. Preserve requested meaning and source evidence. For several tangled Architecture routes, read [Architecture layout repair](references/architecture-layout-repair.md); for measured field or geometry failures, read [Authoring contract](references/authoring-contract.md). Edit the connected neighborhood and rerun the complete `finalize` command from step 4. Once a run has reached `browser-check`, the output path owns that evidence: give every later run its own `--out-dir <folder>/review-<n>`.
````

</details>

**依据 2 · 源码核查**：[archify/bin/finalize.mjs:195-220](https://github.com/tt-a1i/archify/blob/25cf37080fc8b1dbe758a4efc3935b55f3327083/archify/bin/finalize.mjs#L195-L220)

已有门禁核对产物而非业务真值，形成新增证据层的参照。

<details>
<summary>查看原文（26行）</summary>

```text
      && validReceiptId(receipt.receiptId)
      && isReceiptObject(receipt.specification)
      && validIdentity(receipt.specification)
      && validIdentity(receipt.artifact)
      && validDeliveryValidation(receipt, quality, options);
  }
  if (stage === 'check') {
    return validIdentity(receipt.artifact)
      && allChecksPassed(receipt.checks)
      && receipt.provenance === 'current'
      && validReceiptId(receipt.deliveryReceiptId)
      && validCheckComposition(receipt, quality);
  }
  return receipt.command === 'browser-check'
    && receipt.schemaVersion === 1
    && receipt.status === 'pass'
    && receipt.evidenceKind === 'automated-browser'
    && validIdentity(receipt.artifact)
    && receipt.provenance === 'current'
    && validReceiptId(receipt.deliveryReceiptId)
    && receipt.containment?.status === 'pass'
    && receipt.themeStates?.status === 'pass'
    && receipt.readability?.status === 'pass'
    && receipt.viewerChrome?.status === 'pass'
    && validBrowserEvidence(receipt);
}
```

</details>

#### 缺口

- 证据门禁对成本和遗漏率的影响未测
  **影响**：假设不能计入已有贡献或收益
  **进一步探讨**：执行固定任务三臂对照，并保留重要关系不得删减的验收约束

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
