# DSH Schema 工具

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DSH 中校验 JSON Schema 子集、定位错误、解释约束并应用显式默认值。

> **亮点**：注册验证和错误路径工具，使会话内可重复定位结构问题，同时让部分支持与完整通过有可辨字段。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：远程 ref 不受支持，子集模式的 valid=null 不能视为通过。模式检查失败也可能来自 worker 未能完成。[Q02](#research-q02)

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
  - [Q01 · 在 DSH 中审阅生成的 JSON，开发者怎样定位具体错误？](#detail-section-11)
  - [Q02 · 局部 Schema 验证与默认值规范化，能否直接作为生产数据通过判据？](#detail-section-12)
  - [Q03 · 怎样把工具用于小样本复查，能否阻止 Agent 将子集结果当通过？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 会话里生成小型配置或结构化结果的开发者，可核对具体失败字段。

项目已有完整 Schema 验证器应继续承担生产验收。会话内子集工具可用于早期反馈和修复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 结构验证 | 定位数据偏离约束 | 仅支持固定子集 |
| 失败路径 | 按实例位置归并规则 | 继承截断，可能不完整 |
| 静态解释 | 查看约束节点 | 不替代运行校验 |
| 规范化 | 为缺失字段应用有效显式默认值 | 分支不明确就跳过，仍需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis 与 DSH tools | 是 | 挂载子包 | 不能在该环境注册 |
| 支持的本地 Schema 词汇 | 完整判定需要 | 解释和验证规则 | 用已有完整验证器 |
| Node worker | pattern 检查需要 | 处理正则匹配 | 可能出现 pattern-timeout |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 用配置专用 profile 添加固定包 | 类别列表出现 schema |
| 诊断 | 给出小型 JSON 及对应 Schema | 核对错误字段是否正确 |
| 验收 | 用完整验证器确认提交 | 不完整或截断时继续查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 未测 | 验证版本和 profile | 作者兼容仅历史声明 |
| 持续 | JSON 复制、遍历或 worker，金额未知 | 确认支持范围及输出边界 | 模型误判比例未知 |
| 恢复 | 未测 | 转回项目验证器复查 | 不把诊断视为合格门禁 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定位错误 | 按实例路径记录并可聚合关键词 | 能否减少模型修复轮次 |
| 可检查的规范化 | 深复制与显式默认分支规则 | 在实际任务中节省时间 |

> **思考**：远程 ref 不受支持，子集模式的 valid=null 不能视为通过。模式检查失败也可能来自 worker 未能完成。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：注册验证和错误路径工具，使会话内可重复定位结构问题，同时让部分支持与完整通过有可辨字段。[Q01](#research-q01) [Q02](#research-q02)

将受支持子集与完整规则区分，可沿错误定位回查。默认值只应用于明确和验证通过的分支。模式错误需依据当次结果诊断。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

远程 ref 不受支持，子集模式的 valid=null 不能视为通过。模式检查失败也可能来自 worker 未能完成。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先使用非敏感样例检查已知错误位置，再使用项目验证器确认生产规则。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核查源码、注册、受限结果和默认值路径。宿主执行和模型对结果的理解未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-schema/package.json、packages/dsh-tool-schema/cordis.patch.yml、packages/dsh-tool-schema/lib/index.js、packages/dsh-tool-schema/lib/validator.js、packages/dsh-tool-schema/lib/normalize.js、packages/dsh-tool-schema/lib/ref.js、packages/dsh-tool-schema/lib/pattern-worker.js、packages/dsh-tool-schema/README.md 及固定范围 inventory；组件：packages/dsh-tool-schema。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本的子包及已提交运行产物。未验证宿主、完整 Schema 一致性测试、实际模型改写或部署收益。
- 下一步：在同一宿主比较受支持字段失败、外部 ref、超时及歧义默认值。看 Agent 是否保留不完整状态，并比较完整验证器。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可给 Agent 输出受限状态时的明确处理动作，再用一个支持与一个远程引用的相同案例确认是否减少误判通过。[Q03](#research-q03)

在同一宿主比较受支持字段失败、外部 ref、超时及歧义默认值。看 Agent 是否保留不完整状态，并比较完整验证器。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 12 | 2170 | 1887 | 286 | — |
| .md | source | 2 | 293 | — | — | 2902 |
| .ts | source | 12 | 2529 | 2050 | 333 | — |
| .ts | test | 9 | 1357 | 1141 | 78 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-14），可前往 [GitHub Issues](https://github.com/omdsh-dev/dsh-toolkit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：怎样在 DSH 中诊断 JSON 数据，并区分子集结果和生产通过条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH 中审阅生成的 JSON，开发者怎样定位具体错误？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

工具先由独立子包补丁注入 profile，再通过宿主 tools 注册 schema。validate 直接调用预检和验证器，返回带实例位置和 Schema 位置的结构化错误。paths 从同一错误结果按 instancePath 去重，并按位置稳定输出关键词摘要；因为使用已收集的错误，它继承截断状态，不能保证穷举错误。explain 独立提供静态约束树。相较把数据给模型自行判断，用户可以用同一个本地实现重复诊断；已有的完整 Schema CLI 同样可以提供路径和严格验证，这里主要增加会话内反馈。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-schema/package.json:21-37](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/package.json#L21-L37)

宿主 peer 和 bundle 导出。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-schema/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/cordis.patch.yml#L1-L4)

挂载子包。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-schema
      name: '@deepseek-ai/dsh-tool-schema'
```

**依据 3 · 源码核查**：[packages/dsh-tool-schema/lib/index.js:68-115](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/index.js#L68-L115)

四个公开动作及路径摘要对核心错误的复用。

<details>
<summary>查看原文（48行）</summary>

```text
async function dispatch(args) {
    const action = args.action;
    const opts = {
        strictSchema: args.strictSchema !== false,
        maxErrors: clampMaxErrors(args.maxErrors),
    };
    const schema = args.schema;
    switch (action) {
        case 'validate': {
            ensureData(args, action);
            const core = await validateCore(args.data, schema, opts);
            return capJsonOutput({ action: 'validate', ...core });
        }
        case 'paths': {
            ensureData(args, action);
            const core = await validateCore(args.data, schema, opts);
            const byPath = new Map();
            for (const e of core.errors) {
                let set = byPath.get(e.instancePath);
                if (!set) {
                    set = new Set();
                    byPath.set(e.instancePath, set);
                }
                set.add(e.keyword);
            }
            const paths = [...byPath.entries()]
                .map(([path, keywords]) => ({ path, keywords: [...keywords].sort() }))
                .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
            return capJsonOutput({
                action: 'paths',
                valid: core.valid,
                paths,
                errorCount: core.errors.length,
                truncated: core.truncated,
            });
        }
        case 'normalize': {
            ensureData(args, action);
            return capJsonOutput(await normalizeAction(args.data, schema, opts));
        }
        case 'explain': {
            return capJsonOutput(explainSchema(schema, { strictSchema: opts.strictSchema }));
        }
        default:
            throw new Error(`schema: unknown action "${action}"`);
    }
}
export function apply(ctx) {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-schema/lib/index.js:115-144](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/index.js#L115-L144)

登记模型工具和参数定义。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'schema',
        description: 'JSON Schema validation over explicit JSON data (draft 2020-12 subset, zero network, zero dynamic code). ' +
            'Actions: validate (verdict with RFC 6901 instancePath/schemaPath errors), paths (failure paths with keyword ' +
            'summaries), explain (static constraint-tree nodes), normalize (deep copy + apply explicit `default` for missing ' +
            'properties, then validate; never mutates input, never coerces types). Supported keywords: type/enum/const, object ' +
            '(required/properties/additionalProperties/minProperties/maxProperties), array (items/minItems/maxItems/' +
            'uniqueItems), string (minLength/maxLength/pattern), number (minimum/maximum/exclusive*/multipleOf), ' +
            'allOf/anyOf/oneOf/not, local $ref (# and #/$defs/...). Unsupported schema keywords are NEVER silently ignored: ' +
            'they are reported as schemaIssues (code unsupported-keyword); with strictSchema=true (default) validation fails, ' +
            'with strictSchema=false the supported subset is validated and valid=null with complete=false is returned. ' +
            'Pattern validation runs in an isolated worker with a shared 1000ms hard budget (ReDoS guard); data/schema size ' +
            '(256KiB each), nesting depth (64), schema nodes (10000), traversal nodes (100000), errors (100 default, max ' +
            '1000), $ref chain (64), and canonical output (1MiB) are all bounded.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['validate', 'paths', 'explain', 'normalize'],
                description: 'Operation to perform.',
            },
            data: {
                type: 'json',
                description: 'Instance to validate/normalize (required for validate/paths/normalize; null is valid data).',
            },
            schema: {
                type: 'json',
                required: true,
                description: 'JSON Schema (boolean or object; draft 2020-12 subset).',
```

</details>

#### 缺口

- 未验证宿主实际加载和模型如何读到结构化错误
  **影响**：不能确认目标 profile 可用
  **进一步探讨**：在隔离环境让模型指出固定坏样例的字段，并比对实际工具记录

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 局部 Schema 验证与默认值规范化，能否直接作为生产数据通过判据？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程、功能与机制

#### 完整回答

不能直接等同。ref 仅解析根自身或从 $defs 开始的本地指针，不获取外部引用。默认 strictSchema 遇到 schemaIssues 就返回 valid=false 和 complete=false；关闭严格模式时仍在可遍历的子集上试算，但对整个规则给 valid=null。pattern 候选在一次遍历后进入同一 worker 批次，未得到结果的检查会标为 pattern-timeout；工作线程报错或提前退出也可导致缺失结果，因此这一错误不证明正则语义不匹配。normalize 深复制输入，只写已经通过该子 Schema 验证的兼容默认值，oneOf 或 anyOf 只有唯一既有分支匹配才深入；随后再检查修改后的副本。需核对 valid、complete、schemaIssues 与截断字段；有告警或缺依据时仍以项目完整验证器验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-schema/lib/ref.js:43-92](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/ref.js#L43-L92)

本地 ref 允许形态和外部拒绝路径。

<details>
<summary>查看原文（50行）</summary>

```text
export function parseRef(ref) {
    if (ref === '#')
        return { ok: true, tokens: [] };
    if (!ref.startsWith('#')) {
        return {
            ok: false,
            code: 'ref-invalid',
            message: 'remote/absolute/relative refs are not supported; only "#" or "#/$defs/<token>"',
        };
    }
    if (!ref.startsWith('#/')) {
        return { ok: false, code: 'ref-invalid', message: `unsupported ref form "${ref}"; only "#" or "#/..." pointers are supported` };
    }
    const rawTokens = ref.slice(2).split('/');
    const tokens = [];
    for (const raw of rawTokens) {
        const decoded = unescapeToken(raw);
        if (decoded === null) {
            return { ok: false, code: 'ref-invalid', message: `invalid JSON Pointer escape in "${ref}"` };
        }
        tokens.push(decoded);
    }
    return { ok: true, tokens };
}
/**
 * 在 schema 根中解析本地 `$ref`。仅允许 `#` 与 `#/$defs/<token>...`；
 * 第一个 token 必须为 `$defs`，否则视为非法引用形式。
 */
export function resolveRef(root, ref) {
    const parsed = parseRef(ref);
    if (!parsed.ok)
        return parsed;
    const { tokens } = parsed;
    if (tokens.length === 0)
        return { ok: true, value: root };
    if (tokens[0] !== '$defs') {
        return {
            ok: false,
            code: 'ref-invalid',
            message: `only local refs of the form "#" or "#/$defs/<token>" are supported (got "${ref}")`,
        };
    }
    let current = root;
    for (const token of tokens) {
        if (typeof current !== 'object' || current === null) {
            return { ok: false, code: 'ref-missing', message: `ref target "${ref}" does not exist` };
        }
        if (!Object.hasOwn(current, token)) {
            return { ok: false, code: 'ref-missing', message: `ref target "${ref}" does not exist (missing "${token}")` };
        }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-schema/lib/validator.js:688-738](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/validator.js#L688-L738)

strict、子集结果和完整结果的区别。

<details>
<summary>查看原文（51行）</summary>

```text
    if (pre.schemaIssues.length > 0 && opts.strictSchema) {
        return {
            complete: false,
            valid: false,
            supportedSubsetValid: null,
            errors: [],
            schemaIssues: pre.schemaIssues,
            checkedNodes: 0,
            truncated: false,
        };
    }
    // schema 根既非 boolean 也非对象（如数字）：subset 模式也无从验证
    if (!(typeof schema === 'boolean' || (typeof schema === 'object' && schema !== null && !Array.isArray(schema)))) {
        return {
            complete: false,
            valid: null,
            supportedSubsetValid: null,
            errors: [],
            schemaIssues: pre.schemaIssues,
            checkedNodes: 0,
            truncated: false,
        };
    }
    const outcome = await runWalk(data, schema, {
        maxErrors,
        strictSchema: opts.strictSchema,
        ...(opts.patternBudgetMs !== undefined ? { patternBudgetMs: opts.patternBudgetMs } : {}),
        nodePaths: pre.nodePaths,
        validPatterns: pre.validPatterns,
    });
    if (pre.schemaIssues.length > 0) {
        // strictSchema=false：subset 模式（valid 恒为 null，绝不表述为整个 schema 有效）
        return {
            complete: false,
            valid: null,
            supportedSubsetValid: outcome.valid,
            errors: outcome.errors,
            schemaIssues: pre.schemaIssues,
            checkedNodes: outcome.checkedNodes,
            truncated: outcome.truncated,
        };
    }
    return {
        complete: true,
        valid: outcome.valid,
        supportedSubsetValid: outcome.valid,
        errors: outcome.errors,
        schemaIssues: [],
        checkedNodes: outcome.checkedNodes,
        truncated: outcome.truncated,
    };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-schema/lib/validator.js:593-609](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/validator.js#L593-L609)

执行模式匹配，给未完成检查添加错误。

<details>
<summary>查看原文（17行）</summary>

```text
    validateNode(ctx, schema, data, '', '#');
    const budgetMs = opts.patternBudgetMs ?? PATTERN_BUDGET_MS;
    if (!state.stopped && !main.truncated && state.patternChecks.length > 0) {
        const result = await runPatternChecksInWorker(state.patternChecks, budgetMs);
        for (const check of state.patternChecks) {
            const m = result.matched[check.id];
            if (m === undefined) {
                pushError(check.owner, {
                    instancePath: check.instancePath,
                    schemaPath: check.schemaPath,
                    keyword: 'pattern',
                    code: 'pattern-timeout',
                    message: `pattern validation timed out (${budgetMs}ms shared budget)`,
                });
            }
            else if (!m) {
                pushError(check.owner, {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-schema/lib/pattern-worker.js:70-89](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/pattern-worker.js#L70-L89)

worker 启动后消息、错误及退出结果。

<details>
<summary>查看原文（20行）</summary>

```text
        worker.once('message', (msg) => {
            settle(() => {
                if (msg.ok) {
                    resolve({ matched: msg.matched ?? {}, timedOut: false });
                }
                else {
                    resolve({ matched: msg.matched ?? {}, timedOut: true, error: msg.error ?? 'pattern worker failed' });
                }
            });
        });
        worker.once('error', (err) => {
            const message = err instanceof Error ? err.message : String(err);
            settle(() => resolve({ matched: {}, timedOut: true, error: message }));
        });
        worker.once('exit', (code) => {
            // 正常路径已由 message 处理 settle；此处仅未响应时可达 → 视为超时
            settle(() => resolve({ matched: {}, timedOut: true, error: `pattern worker exited with code ${code}` }));
        });
        worker.postMessage({ id: 1, checks, budgetMs });
    });
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-schema/lib/normalize.js:67-89](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/normalize.js#L67-L89)

只写足以验证的显式默认值。

<details>
<summary>查看原文（23行）</summary>

```text
        if (Object.hasOwn(schema, 'properties') && isJsonRecord(schema.properties)) {
            const props = schema.properties;
            for (const key of Object.keys(props)) {
                const sub = props[key];
                const childIp = `${ip}/${escapeToken(key)}`;
                if (Object.hasOwn(record, key)) {
                    await applyDefaults(sub, record[key], childIp, ctx);
                }
                else if (isJsonRecord(sub) && Object.hasOwn(sub, 'default')) {
                    const def = sub.default;
                    const defSchemaPath = `${schemaPathOf(ctx, sub)}/default`;
                    if (!isJsonCompatible(def)) {
                        warn(ctx, childIp, defSchemaPath, 'default-invalid', 'default value is not JSON-compatible; not applied');
                        continue;
                    }
                    const verdict = await validateCore(def, sub, { maxErrors: 1, strictSchema: true });
                    if (verdict.valid === true) {
                        record[key] = deepCopyJson(def);
                        ctx.applied.push(childIp);
                    }
                    else {
                        warn(ctx, childIp, defSchemaPath, 'default-invalid', 'default value does not validate against its sub-schema; not applied');
                    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-schema/lib/normalize.js:102-118](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/normalize.js#L102-L118)

唯一匹配分支才继续。

<details>
<summary>查看原文（17行）</summary>

```text
    // oneOf / anyOf：恰好一个分支（不应用 default 时）匹配才进入
    for (const comb of ['oneOf', 'anyOf']) {
        if (Array.isArray(schema[comb])) {
            const branches = schema[comb];
            const matched = [];
            for (let i = 0; i < branches.length; i++) {
                const verdict = await validateCore(instance, branches[i], { maxErrors: 1, strictSchema: true });
                if (verdict.valid === true)
                    matched.push(i);
            }
            if (matched.length === 1) {
                await applyDefaults(branches[matched[0]], instance, ip, ctx);
            }
            else {
                warn(ctx, ip, `${schemaPathOf(ctx, schema)}/${comb}`, 'normalize-skip-branch', `${comb}: ${matched.length} branches match without defaults; defaults not applied`);
            }
        }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-tool-schema/lib/normalize.js:170-192](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/normalize.js#L170-L192)

深复制后重新验证结果并保留告警。

<details>
<summary>查看原文（23行）</summary>

```text
    const value = deepCopyJson(data);
    const ctx = {
        root: schema,
        nodePaths: pre.nodePaths,
        applied: [],
        warnings: [],
        opts,
    };
    await applyDefaults(schema, value, '', ctx);
    const core = await validateCore(value, schema, opts);
    return {
        action: 'normalize',
        complete: core.complete,
        valid: core.valid,
        supportedSubsetValid: core.supportedSubsetValid,
        value,
        appliedDefaults: ctx.applied,
        warnings: ctx.warnings,
        errors: core.errors,
        schemaIssues: core.schemaIssues,
        truncated: core.truncated,
    };
}
```

</details>

#### 缺口

- 复杂或高回溯 Schema 的实际响应和诊断效果未验证
  **影响**：无法判断不完整错误对 Agent 修复的影响
  **进一步探讨**：用本地 $defs、外部引用和超时样例分开对照完整验证器

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样把工具用于小样本复查，能否阻止 Agent 将子集结果当通过？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合已有 DSH 且需要检查小型配置字段的人，先选择可比较的 JSON 和项目规则，记录未知关键字或超出范围的受限结果。初装需核对 profile 与 peer；持续使用会复制 JSON、遍历规则或为模式检查启动 worker，人工还要区分错误位置、规则本身不支持和诊断截断。未测人工与现金成本。生产门禁继续沿用完整验证器。可以探索为 Agent 增加需要处理的下一步枚举，例如需要人工核对规则方言，并让工具输出直接区分不完整状态。用相同的一个受支持样例和一个远程引用比较是否能阻止错误打上通过标签；如果现有 schemaIssues/complete 已被可靠判断，额外回执就没有增量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-schema/lib/index.js:68-101](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/index.js#L68-L101)

默认严格模式与诊断输出。

<details>
<summary>查看原文（34行）</summary>

```text
async function dispatch(args) {
    const action = args.action;
    const opts = {
        strictSchema: args.strictSchema !== false,
        maxErrors: clampMaxErrors(args.maxErrors),
    };
    const schema = args.schema;
    switch (action) {
        case 'validate': {
            ensureData(args, action);
            const core = await validateCore(args.data, schema, opts);
            return capJsonOutput({ action: 'validate', ...core });
        }
        case 'paths': {
            ensureData(args, action);
            const core = await validateCore(args.data, schema, opts);
            const byPath = new Map();
            for (const e of core.errors) {
                let set = byPath.get(e.instancePath);
                if (!set) {
                    set = new Set();
                    byPath.set(e.instancePath, set);
                }
                set.add(e.keyword);
            }
            const paths = [...byPath.entries()]
                .map(([path, keywords]) => ({ path, keywords: [...keywords].sort() }))
                .sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
            return capJsonOutput({
                action: 'paths',
                valid: core.valid,
                paths,
                errorCount: core.errors.length,
                truncated: core.truncated,
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-schema/lib/validator.js:718-737](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/lib/validator.js#L718-L737)

结果已经包含完整性边界。

<details>
<summary>查看原文（20行）</summary>

```text
    if (pre.schemaIssues.length > 0) {
        // strictSchema=false：subset 模式（valid 恒为 null，绝不表述为整个 schema 有效）
        return {
            complete: false,
            valid: null,
            supportedSubsetValid: outcome.valid,
            errors: outcome.errors,
            schemaIssues: pre.schemaIssues,
            checkedNodes: outcome.checkedNodes,
            truncated: outcome.truncated,
        };
    }
    return {
        complete: true,
        valid: outcome.valid,
        supportedSubsetValid: outcome.valid,
        errors: outcome.errors,
        schemaIssues: [],
        checkedNodes: outcome.checkedNodes,
        truncated: outcome.truncated,
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-schema/README.md:92-100](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-schema/README.md#L92-L100)

作者的历史宿主消费陈述，独立运行未做。

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis@^4.0.1` + `@deepseek-ai/dsh-tools@>=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants@>=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）

```

#### 缺口

- 未测模型是否处理 valid=null 或 truncated
  **影响**：不能断言能防止错误通过
  **进一步探讨**：给同一 Agent 测试受支持与不支持 Schema，核对是否正确拒绝门禁

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
