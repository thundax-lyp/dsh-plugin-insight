# dsh-better-edit

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[009b922](https://github.com/Rianico/dsh-better-edit/tree/009b922d591d93dd7d311fc5412717678d24ed3f)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Rianico/dsh-better-edit) [![npm 30d 3,502](https://img.shields.io/static/v1?label=npm+30d&message=3%2C502&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-edit) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-edit)
<!-- END META -->

> **功能**：为 DSH 提供使用内容哈希行锚点的读取、范围编辑与撤销工具。

> **亮点**：[Q01](#research-q01) 将上游内容锚点接入 DSH 文件策略，代理可提交短范围引用并回查 diff。

> **主要限制**：[Q02](#research-q02) 规范化不保留 ASCII 空白语义，[Q03](#research-q03) 撤销数据库失败也可能已经写过文件。

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
  - [Q01 · 哈希工具相对行号和文本替换多提供什么？](#detail-section-11)
  - [Q02 · 哪些内容和并发情况仍需要读回？](#detail-section-12)
  - [Q03 · 撤销失败和成本如何判断？](#detail-section-13)
  - [Q04 · 怎样验证适用范围和新保护？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复让代理修改代码的 DSH 用户，可在测试仓库验证目标范围和最终 diff。

原生行号和文本替换在小范围同样可用，移动或重复时需重读；插件用短锚点和已读证据缩小提交。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 锚点读取与编辑 | 短地址修改指定范围 | 需核对已读和实际内容 |
| 撤销 | 恢复最近一次修改 | 外部修改会使记录过期 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 工具与文件服务 | 必需 | 注册与校验写入 | 回原生工具 |
| 已读锚点和可写目标 | 编辑必需 | 定位修改 | 重读后核对 |
| 独立测试分支 | 试用条件 | 检查 diff 和退出 | 暂不改文件 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 读取 | 代理读取确定目标 | 核对当前锚点 |
| 编辑 | 只改一个明确范围 | diff 只含预期变化 |
| 撤销 | 用户检查撤销及磁盘 | 不一致时读回后停重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 工具及存储未知 | 配置并比较同任务 | 兼容未验 |
| 持续 | token 和缓存未知 | 审阅 diff 和重读 | 作者结果不可外推 |
| 失败恢复 | 重新计算未知 | 读回文件与撤销状态 | 写后存储失败需区分 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 短范围编辑 | 锚点与宿主写接线 | 误改率及净 token |
| 撤销 | 逐字比对和恢复 | 故障下磁盘与缓存一致性 |

> **思考**：[Q02](#research-q02) 规范化不保留 ASCII 空白语义，[Q03](#research-q03) 撤销数据库失败也可能已经写过文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将上游内容锚点接入 DSH 文件策略，代理可提交短范围引用并回查 diff。

范围验证与宿主写策略分层，撤销文件和数据库分别提交；可见错误后仍要查实际文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 规范化不保留 ASCII 空白语义，[Q03](#research-q03) 撤销数据库失败也可能已经写过文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 在测试分支先改一处已知范围，读回 diff 和撤销后再决定是否扩大。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查工具覆盖、规范化、宿主写入和撤销。作者基准未重跑。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/tool-edit.ts、src/hashline/hash-assign.ts、src/hashline/anchor-pipeline.ts、src/fs-bridge.ts、src/tool-undo.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定源码中 DSH 工具注册、哈希分配、写入和撤销。未运行宿主、目标代码及基准，未覆盖全部编码与远端文件提供者。
- 下一步：用同样任务比原生编辑、锚点、格式化、语义空白及并发保存的真实结果。

**分析版本**

- **仓库**：[Rianico/dsh-better-edit](https://github.com/Rianico/dsh-better-edit)
- **版本号**：1.2.1（[固定提交 009b922](https://github.com/Rianico/dsh-better-edit/tree/009b922d591d93dd7d311fc5412717678d24ed3f)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 为语义敏感的空白保留原字节核对，可能降低错误接受，同时保留常见格式化容忍。

用同样任务比原生编辑、锚点、格式化、语义空白及并发保存的真实结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 59 | 6850 | — | — | 79191 |
| .ts | source | 67 | 16002 | 12323 | 2727 | — |
| .mjs | source | 3 | 614 | 439 | 138 | — |
| .js | source | 2 | 85 | 66 | 15 | — |
| .ts | test | 165 | 35481 | 30196 | 2478 | — |
| .mjs | test | 1 | 1373 | 1187 | 192 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-11），可前往 [GitHub Issues](https://github.com/Rianico/dsh-better-edit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：常用 DSH Agent 编辑文件的人能否用内容锚点定位预期改动，并在外部变更或撤销异常时识别真实文件状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哈希工具相对行号和文本替换多提供什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

反复让代理修改小块代码的开发者可以比较同一段移动后是否仍能正确找到它。合格编辑需只改变指定区间，留下可读 diff。插件在 agent 创建时注册自己的 read、edit、str_replace_editor 和 undo，编辑请求用两端锚点及替换文本，沿当前会话 cwd 解析目标并调用共享 mutation。分配器以规范化行哈希为种子，在有限位图中探测未占用值，重复行也可分到不同显示锚点。较行号移动和重复抄整段原文，它增加短地址及会话已读验证；项目 README 承认继承上游方法，贡献主要是 DSH 工具和文件策略接入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:132-150](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/index.ts#L132-L150)

宿主文件桥、sandbox 与会话工具注册。

<details>
<summary>查看原文（19行）</summary>

```text
    // `fs` is host-plane: use the plugin's own context (covered by
    // inject) rather than the agent's scoped one, whose fiber chain does
    // not declare it. The session's live directory still reaches the bridge
    // per call via `execCwd` (the `workingDirectory` service, falling back to
    // `exec.agent.session.header.cwd`).
    const io = ctxFsIO(rootCtx.fs as FileSystem, rootCtx);
    const disposers: Array<() => void> = [];
    const sandbox = new FsSandboxController(rootCtx);
    // Keep owned definitions by reference for self-heal identity check
    const hashReadDef = buildReadTool(io);
    disposers.push(agent.ctx.tools.register(hashReadDef));
    const hashEditDef = buildEditTool(io, sandbox);
    disposers.push(agent.ctx.tools.register(hashEditDef));
    // Governed shadow of the preset's built-in str_replace_editor
    // (ADR-0015): identical contract, encoding-governed mutations.
    const hashStrReplaceDef = buildStrReplaceEditorTool(io, sandbox);
    disposers.push(agent.ctx.tools.register(hashStrReplaceDef));
    disposers.push(registerUndoTool(rootCtx, agent.ctx, io, sandbox));
    disposers.push(registerWriteHook(rootCtx, agent.ctx, io));
```

</details>

**依据 2 · 源码核查**：[src/tool-edit.ts:143-166](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/tool-edit.ts#L143-L166)

写权限与两端锚点传入 mutation。

<details>
<summary>查看原文（24行）</summary>

```text
          const sandboxPolicy = await sandbox.resolvePolicy(
            "edit",
            { file: resolvedFile, edits: req.edits } as unknown as FsEscalationArgs,
            exec,
          );

          abortIf(signal);
          const items: PreparedItem[] = [];
          for (let index = 0; index < req.edits.length; index++) {
            const e = req.edits[index]!;
            items.push({
              index,
              file: resolvedFile!,
              absolutePath: await io.resolve(resolvedFile!, cwd, signal),
              anchor_from: e.anchor_from,
              anchor_to: e.anchor_to,
              replace_with: e.replace_with,
              fileWarning: index === 0 ? fileWarning : undefined,
              ...(req.mode !== undefined ? { mode: req.mode } : {}),
            });
          }

          // Deep seam: one interface, all lifecycle branching concentrates in Mutation
          return execute({ io, items, sessionKey, signal, exec, sandbox, sandboxPolicy });
```

</details>

**依据 3 · 源码核查**：[src/hashline/hash-assign.ts:154-181](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/hashline/hash-assign.ts#L154-L181)

有限空间的哈希分配和保留位图。

<details>
<summary>查看原文（28行）</summary>

```text
export function lineHashesPure(
  content: string,
  reservedHashes: ReadonlySet<string> = new Set(),
  // optional counts for richer error — when caller knows retired vs served split
  retiredCount?: number,
  servedCount?: number,
): string[] {
  const lines = splitLines(content);
  const hashes = new Array<string>(lines.length);
  const used = new Uint32Array(BITSET_WORDS);
  for (const hash of reservedHashes) markHashUsed(used, hash);
  const hint = { value: 0 };
  const canonCache = new Map<string, string>();
  try {
    for (let i = 0; i < lines.length; i++) {
      const c = getCanon(canonCache, lines[i]!);
      const baseIdx = (xxh32(c) >>> 14) % HASH_SPACE;
      const h = assignHash(used, baseIdx, hint);
      hashes[i] = h;
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    if (e instanceof AnchorSpaceExhaustedError) throw e;
    if (msg.includes("probing failed over") || msg.includes("Cannot allocate")) {
      const rc = retiredCount ?? reservedHashes.size;
      const sc = servedCount ?? 0;
      throw new AnchorSpaceExhaustedError(rc, sc);
    }
```

</details>

**依据 4 · 作者声明**：[README.md:328-334](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/README.md#L328-L334)

作者列出方法先例与上游。

```text
MIT — see [LICENSE](LICENSE).

## Acknowledgments

From Can Bölük's [_The Harness Problem_](https://stencil.so/blog/the-harness-problem). Thanks to [pi-hashline-edit](https://github.com/RimuruW/pi-hashline-edit), [pi-hashline-edit-pro](https://github.com/YuGiMob/pi-hashline-edit-pro), [pi-better-edit](https://github.com/Rianico/pi-better-edit), [@oh-my-pi/hashline](https://www.npmjs.com/package/@oh-my-pi/hashline). Reading: [hash-anchors](https://dirac.run/posts/hash-anchors-myers-diff-single-token).

---
```

#### 缺口

- 没有在相同任务重跑原生工具对照。
  **影响**：不能独立确认节省 token 或准确率。
  **进一步探讨**：相同宿主、模型和编辑目标记录输出、重读及错改。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些内容和并发情况仍需要读回？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

锚点 canon 去掉 ASCII 空白，没有区分它来自缩进还是字符串字面量。因此内容地址稳定可用于某些格式化变化，也会把只改字符串空白的两行视作同一规范形式。范围守卫会比较已提供的规范内容或锚点并拒绝已检测到的变化，宿主写桥还调 fs/write-intent 并把策略交给 fs.writeText。需要分清范围验证、宿主版本校验以及文件语义。现有接线无法证明所有保留锚点都对应相同语义，也不能从一个拒绝分支推断所有并发覆盖路径。运行前需验证宿主文件服务与相关权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/hashline/hash-assign.ts:105-114](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/hashline/hash-assign.ts#L105-L114)

规范化直接删除 ASCII 空白。

<details>
<summary>查看原文（10行）</summary>

```text
export const CANON_VERSION = 2;

const CANON_RE = /[ \t\r\n]+/g;

export function canon(line: string): string {
  return line.replace(CANON_RE, "");
}
/** Single definition of served_leases.canon_hash / line_lineage.canon_hash (CP2). */
export function canonDigest(line: string): string {
  return String(xxh32(canon(line)));
```

</details>

**依据 2 · 源码核查**：[src/hashline/anchor-pipeline.ts:1095-1123](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/hashline/anchor-pipeline.ts#L1095-L1123)

范围内已提供内容和锚点不符时拒绝。

<details>
<summary>查看原文（29行）</summary>

```text
  // Retired-anchor interior check (whole-span) — gated on canon inequality (fail-closed only for different canon)
  for (let k = 0; k < servedLen; k++) {
    const h = fileHashes[startLine - 1 + k];
    if (h && retiredSet.has(h)) {
      const expectedCanon = servedCanons?.[from + k] ?? undefined;
      const actualCanon = canon(fileLines[startLine - 1 + k] ?? "");
      if (expectedCanon !== undefined && expectedCanon !== null && expectedCanon !== actualCanon) {
        throw new ServedRejectionError({
          code: "E_STALE_RANGE",
          headline: `line ${startLine + k}${where} uses retired anchor "${h}" (freed since last full read, canon changed). Re-read.`,
          servedBlock: echo,
          firstOffendingLine: startLine + k,
          servedRows: echoRows,
        });
      }
    }
  }
  for (let k = 0; k < servedLen; k++) {
    // The leased route's `null` skip is `checksPosition`'s decision (the identity gate already
    // adjudicated the hole); the mirror route's holes rejected in the scan above.
    if (!checksPosition(route, served[from + k])) continue;
    if (served[from + k] !== fileHashes[startLine - 1 + k]) {
      const offendingLine = startLine + k;
      throw new ServedRejectionError({
        code: "E_STALE_RANGE",
        headline: `line ${offendingLine}${where} differs from what was served. Re-read.`,
        servedBlock: echo,
        firstOffendingLine: offendingLine,
        servedRows: echoRows,
```

</details>

**依据 3 · 源码核查**：[src/fs-bridge.ts:336-359](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/fs-bridge.ts#L336-L359)

实际宿主写意图与策略调用。

<details>
<summary>查看原文（24行）</summary>

```text
      try {
        const target = await fs.resolve(absolutePath, {
          ...(signal === undefined ? {} : { signal }),
        });
        const intent = await ctx.waterfall("fs/write-intent", target, exec, () => undefined);
        // Seam owns Save-with-Encoding memo update and normalizeToUtf8 check.
        // Provider expects UTF-8 string; for legacy without normalize we keep
        // string as-is (next read re-detects via version bump).
        try {
          const cfgW = loadConfig();
          const key = String(
            (target as unknown as { targetKey?: string }).targetKey ?? absolutePath,
          );
          // Honor manual override if content was produced via write({encoding}) — not wired here,
          // encodingHint is not part of writeText signature for ctxFsIO in current call sites.
          // Check existing memo for legacy preservation.
          const existing = _getEncodingState(key);
          const prep = prepareForSave(content, existing, { normalizeToUtf8: cfgW.normalizeToUtf8 });
          // For Save with Encoding hint, prepareForSave would create newState — not used in this path (tool-undo/write-hook carry hint separately)
          if (prep.newState) _setEncodingState(key, prep.newState as FileEncodingState);
          // content stays as UTF-8 string for provider; prep.textToWrite is same as content
        } catch {} // biome-ignore: best-effort
        const outcome = await fs.writeText(target, content, intent, signal, sandboxPolicy);
        ctx.emit("fs/observed", target, { kind: "present", version: outcome.version }, exec);
```

</details>

#### 缺口

- 未用真实宿主试字符串空白变化和并发写。
  **影响**：不能断言目标语义变化必被发现。
  **进一步探讨**：用字面量有意改空格及其他进程并发保存做受控对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 撤销失败和成本如何判断？

**研究主题**：效果与总成本、缺陷与关键质疑、工程质量与复用

#### 完整回答

撤销先读当前原文，若与上次编辑结果不逐字匹配，清除撤销记录并报过期，避免直接覆盖外部修改。文件恢复先执行，随后数据库事务采纳快照、退休锚点、清除撤销对；存储失败时抛 E_UNDO_NOT_RECORDED，此时文件已经写过，应读回后再决定下一步。减少编辑 payload 可能节约输出，但重新服务锚点、宿主重试、存储和审查也耗时。README 中的效果数字来自特定语料与运行，不能转写成当前宿主的净收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool-undo.ts:108-125](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/tool-undo.ts#L108-L125)

逐字比较当前结果，外部变化时拒绝撤销。

<details>
<summary>查看原文（18行）</summary>

```text
        const undo = await getUndo(absolutePath);
        if (!undo) {
          return `No undo history for ${path}. There is no previous edit to revert.`;
        }

        let currentRaw: string;
        try {
          currentRaw = await io.readText(absolutePath, signal);
        } catch (error) {
          if (codeOf(error) === "E_NOT_FOUND") {
            await clearUndo(absolutePath);
            return formatError("E_UNDO_STALE", { path, reason: "deleted" });
          }
          throw error;
        }
        if (currentRaw !== undo.bom + restoreEndings(undo.resultContent, undo.originalEnding)) {
          await clearUndo(absolutePath);
          return formatError("E_UNDO_STALE", { path, reason: "modified" });
```

</details>

**依据 2 · 源码核查**：[src/tool-undo.ts:226-263](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/tool-undo.ts#L226-L263)

先回写文件，再写数据库事务，失败显式报错。

<details>
<summary>查看原文（38行）</summary>

```text
          await io.writeText(
            absolutePath,
            undo.bom + restoreEndings(undo.content, undo.originalEnding),
            signal,
            exec,
            sandboxPolicy,
          );
        } catch (error) {
          throw sandbox.mapError(error, sandboxPolicy);
        }

        // The file is reverted; the store state must move as ONE unit: the snapshot/lineage adopt
        // (`upsertSnapshot`), the retirement of the anchors the revert freed, and the undo-pair
        // clear (`deleteUndoPair`) are all-or-nothing. `withStore` routes every call through the
        // store's single re-entrant transaction owner (the store was just loaded for this
        // workspace, so `currentStore()` is that same handle). Fail loud: a cleared pair over an
        // un-adopted snapshot, or a revert without its retirement, is a desync no later read or
        // edit can see.
        // SAFETY: loadHashStore returns the InternalHashStore
        // (HashStore & ServedPersistence & LineageStore); its public return type is narrowed, and
        // this unit needs the served face for the retirement that commits with the adopt.
        const store = (await loadHashStore()) as InternalHashStore;
        try {
          withStore(() => {
            store.upsertSnapshot(
              absolutePath,
              contentChecksum(undo.content),
              splitLines(undo.content).length,
              restoredHashes,
              undo.content,
            );
            retireAnchorsInStore(store, sessionKey, absolutePath, retiredByUndo);
            store.deleteUndoPair(absolutePath);
          });
        } catch (error) {
          // Not a swallow: the raw cause is logged for diagnosis, then the tool fails loud.
          console.error("Failed to record the undo restore in the hash store:", error);
          throw new DomainError("E_UNDO_NOT_RECORDED", { path });
```

</details>

**依据 3 · 作者声明**：[README.md:200-207](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/README.md#L200-L207)

作者列出有限语料和单次运行条件。

```text
Percent vs `str_replace`. External row pinned corpus, `cl100k_base`; local `npm run benchmark` in upstream.

| engine          | calls | tokens |      saved | ok  |
| --------------- | ----: | -----: | ---------: | :-: |
| OMP             | **6** | 28,467 |          — | ✅  |
| hashline `edit` | **3** | 12,593 | **-55.8%** | ✅  |

Single stochastic run, `opencode-go/gpt-5.6-luna` high. [Artifact](https://github.com/Rianico/pi-better-edit/blob/main/benchmarks/results/2026-08-17-practical-token-benchmark.md).
```

#### 缺口

- 没有测每次合格编辑的总 token、重读与恢复开销。
  **影响**：无法确认大文件、多工具或错误恢复时仍净节省。
  **进一步探讨**：固定模型对照一组重复行和外部修改，累计所有交互与人工时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证适用范围和新保护？

**研究主题**：新假设与验证、采用判断

#### 完整回答

适合在独立测试仓库先试一处重复行或移动后的目标编辑，核对 diff 后再撤销；出现过期锚点、文件状态与提示不符或原字节变化时，先停止重放并回 Git diff。未验证设计是为字符串等空白有语义的段保留原字节摘要，同时对确认的缩进变化保留当前容忍。用同一组纯格式化、字面量空格变化、锚点冲突和外部并发场景比较错改率、拒绝率、重读次数与额外计算。如果无法显著减少错误接受或破坏常见格式化场景，则维持原流程和人工检查。

#### 证据与依据

**依据 1 · 源码核查**：[src/hashline/hash-assign.ts:105-114](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/hashline/hash-assign.ts#L105-L114)

现有删空白构成对照。

<details>
<summary>查看原文（10行）</summary>

```text
export const CANON_VERSION = 2;

const CANON_RE = /[ \t\r\n]+/g;

export function canon(line: string): string {
  return line.replace(CANON_RE, "");
}
/** Single definition of served_leases.canon_hash / line_lineage.canon_hash (CP2). */
export function canonDigest(line: string): string {
  return String(xxh32(canon(line)));
```

</details>

**依据 2 · 源码核查**：[src/hashline/anchor-pipeline.ts:1109-1123](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/hashline/anchor-pipeline.ts#L1109-L1123)

旧范围守卫决定拒绝。

<details>
<summary>查看原文（15行）</summary>

```text
      }
    }
  }
  for (let k = 0; k < servedLen; k++) {
    // The leased route's `null` skip is `checksPosition`'s decision (the identity gate already
    // adjudicated the hole); the mirror route's holes rejected in the scan above.
    if (!checksPosition(route, served[from + k])) continue;
    if (served[from + k] !== fileHashes[startLine - 1 + k]) {
      const offendingLine = startLine + k;
      throw new ServedRejectionError({
        code: "E_STALE_RANGE",
        headline: `line ${offendingLine}${where} differs from what was served. Re-read.`,
        servedBlock: echo,
        firstOffendingLine: offendingLine,
        servedRows: echoRows,
```

</details>

**依据 3 · 源码核查**：[src/tool-undo.ts:123-125](https://github.com/Rianico/dsh-better-edit/blob/009b922d591d93dd7d311fc5412717678d24ed3f/src/tool-undo.ts#L123-L125)

回查已有原文校验。

```text
        if (currentRaw !== undo.bom + restoreEndings(undo.resultContent, undo.originalEnding)) {
          await clearUndo(absolutePath);
          return formatError("E_UNDO_STALE", { path, reason: "modified" });
```

#### 缺口

- 语义敏感摘要未实现。
  **影响**：能否在不增加太多误拒绝时改善尚未知。
  **进一步探讨**：用相同文件和两种策略跑隔离对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
