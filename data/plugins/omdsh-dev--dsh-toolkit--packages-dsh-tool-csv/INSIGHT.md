# dsh-tool-csv

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中解析 CSV 文本、按列精确查找并输出统计。

> **亮点**：[Q01](#research-q01) 的引号状态和列级匹配让会话直接复核带逗号、换行的字段。

> **主要限制**：[Q02](#research-q02) 发现 query 取首个同名列，parse 却由后值覆盖；limit 也不限制预解析成本。

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
  - [Q01 · CSV 文本如何变成统计或匹配结果？](#detail-section-11)
  - [Q02 · 重复列名、空行与 limit 会改变什么？](#detail-section-12)
  - [Q03 · 怎样验证后再试用，如何减少预览被误当成可对账结果？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在会话临时查看小型公开 CSV 的开发者可核对字段、行数和指定列的匹配样本。

grep 便于找文本，CSV 脚本或表格工具能够保留列位置及处理更大文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CSV 解析 | 转换小型表格 | 重复表头后值覆盖 |
| 精确查询 | 筛选指定列 | 同名列取首个，保留表头 |
| 结构统计 | 检查字段和空行 | 独立动作，转换回执不自动带警告 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Cordis 与 DSH tools | 是 | 注册 csv | 使用原 CSV 工具 |
| 公开小样本与唯一表头 | 本建议要求 | 避免重名和会话数据问题 | 保留源列序号另行分析 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 预检 | 用户准备样本并调用 stats | 检查重复列名与异常宽度 |
| 匹配 | Agent 按列做精确查询 | 对照原行字段 |
| 退出 | 用户禁用组件 | 回到 CSV 脚本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主和包，金额未知 | 核对包来源和 profile | 装载未验证 |
| 持续 | 模型传参、全量解析，金额未知 | 对照样本并复查截断 | 单位任务耗时未知 |
| 失败恢复 | 可能重跑或改用本地脚本 | 从原始文件复核列与行 | 实际退出待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 字段解析 | 引号状态机与 BOM 处理 | 真实回执一致性 |
| 精确匹配 | 支持列名或索引 | 重复列名时需检查 |
| 网格统计 | 源码返回宽度及重名警告 | 用户能否及时发现异常 |

> **思考**：[Q02](#research-q02) 发现 query 取首个同名列，parse 却由后值覆盖；limit 也不限制预解析成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的引号状态和列级匹配让会话直接复核带逗号、换行的字段。

[Q02](#research-q02) 确认用无原型对象映射表头，但字段重复仍会覆盖。采用前须核对过滤列与转换列是否一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发现 query 取首个同名列，parse 却由后值覆盖；limit 也不限制预解析成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 建议先跑 stats，再试有唯一表头的公开样本。出现 [Q02](#research-q02) 的重名或完整性要求时改用本地解析。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持文本解析、匹配与统计。重名列路径分歧可静态确认，宿主使用效果待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-csv/package.json、packages/dsh-tool-csv/cordis.patch.yml、packages/dsh-tool-csv/lib/index.js、packages/dsh-tool-csv/lib/parse.js、packages/dsh-tool-csv/lib/query.js、packages/dsh-tool-csv/README.md 及固定范围 inventory；组件：packages/dsh-tool-csv。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定子包注册、输入解析、查询与统计；未执行插件、安装、测试或真实宿主。
- 下一步：用重名表头、不规则宽度、全空字段行、引号内换行和明确 limit 的公开样本比较三个动作，并在禁用后检查工具清单。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提议回执显示列索引及截断，使用重名表头对照可否复原源列。

用重名表头、不规则宽度、全空字段行、引号内换行和明确 limit 的公开样本比较三个动作，并在禁用后检查工具清单。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 419 | 348 | 75 | — |
| .md | source | 2 | 294 | — | — | 2432 |
| .ts | source | 4 | 482 | 359 | 89 | — |
| .ts | test | 3 | 336 | 274 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：临时检查一份小型 CSV 时，何时可以直接使用会话工具，怎样识别会改变字段身份或完整性的情况？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · CSV 文本如何变成统计或匹配结果？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护者可以将小型公开表格文本传给 csv，回调先统一分隔符和 header 选项，再完整解析。双引号状态机保留引号内逗号与换行，处理重复引号，闭合后遇到非法字符时抛错；query 按列名或 1 起索引选择列，严格比较字符串，最终将匹配行和表头返回。与 grep 按文本找词相比，这条链区分列和字段值。成熟 CSV 库也能实现，插件的增量是同会话直接接入统计和过滤；没有文件或网络读取入口。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-csv/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/package.json#L21-L38)

声明 Cordis、tools 与 invariants peer，bundle 指向补丁，默认导出指向 lib/index.js。

<details>
<summary>查看原文（18行）</summary>

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
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-csv/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/cordis.patch.yml#L1-L4)

按固定包名插入 tool-csv。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-csv
      name: '@deepseek-ai/dsh-tool-csv'
```

**依据 3 · 源码核查**：[packages/dsh-tool-csv/lib/index.js:49-56](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/index.js#L49-L56)

注入 tools 并注册 csv。

```text
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'csv',
        description: 'Parse, query, and summarize CSV text. ' +
            'Actions: parse (to JSON array), query (filter rows by exact column value), ' +
            'stats (row/column counts), to_json (alias of parse). ' +
            'RFC 4180, quoted fields with commas/newlines supported, BOM ignored. ' +
            'Pure text processing: no file or network access.',
```

**依据 4 · 源码核查**：[packages/dsh-tool-csv/lib/index.js:90-97](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/index.js#L90-L97)

注册回调进入本包实际执行逻辑并呈现回执。

```text
        output: {
            schema: { type: 'string' },
            render: (_args, value) => [{ type: 'text', text: value }],
        },
        execute: args => Promise.resolve(runAction(args)),
        timeoutMs: 2000,
    }));
}
```

**依据 5 · 源码核查**：[packages/dsh-tool-csv/lib/index.js:12-45](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/index.js#L12-L45)

默认 header 与实际分发、文本回执。

<details>
<summary>查看原文（34行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools';
import { parseCsv, normalizeDelimiter } from './parse.js';
import { queryRows, statsGrid, toJsonRows, normalizeLimit } from './query.js';
export const name = '@deepseek-ai/dsh-tool-csv';
export const inject = ['tools'];
function runAction(args) {
    const action = args.action;
    if (typeof args.csv !== 'string') {
        throw new Error('csv: csv must be a string');
    }
    const delimiter = normalizeDelimiter(args.delimiter);
    // header 默认 true；非布尔值回退默认
    const header = typeof args.header === 'boolean' ? args.header : true;
    const { rows, skippedBlank } = parseCsv(args.csv, { delimiter, header });
    if (action === 'parse' || action === 'to_json') {
        return JSON.stringify(toJsonRows(rows, header, delimiter, args.limit));
    }
    if (action === 'query') {
        if (typeof args.column !== 'string' || args.column === '') {
            throw new Error('csv: query requires a non-empty column');
        }
        if (typeof args.value !== 'string') {
            throw new Error('csv: query requires a string value');
        }
        const result = queryRows(rows, {
            column: args.column,
            value: args.value,
            header,
            limit: normalizeLimit(args.limit),
        });
        return JSON.stringify(result.rows);
    }
    if (action === 'stats') {
        return JSON.stringify(statsGrid(rows, header, skippedBlank));
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-csv/lib/parse.js:71-106](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/parse.js#L71-L106)

引号状态和非法闭合后的异常。

<details>
<summary>查看原文（36行）</summary>

```text
    for (; i < len; i++) {
        const ch = text[i];
        if (inQuotes) {
            if (ch === '"') {
                if (text[i + 1] === '"') {
                    field += '"';
                    i++;
                } // "" 转义
                else {
                    inQuotes = false;
                    afterQuote = true;
                } // 闭合引号
            }
            else {
                field += ch;
            }
        }
        else if (afterQuote) {
            // RFC 4180：闭合引号后只允许分隔符、行结束或 EOF
            if (ch === delim) {
                pushField();
                afterQuote = false;
            }
            else if (ch === '\n' || ch === '\r') {
                if (ch === '\r' && text[i + 1] === '\n')
                    i++;
                pushRow();
                afterQuote = false;
            }
            else {
                throw new Error(`csv: invalid character "${ch}" after closing quote at position ${i}`);
            }
        }
        else if (ch === '"' && field === '') {
            inQuotes = true; // 仅字段开头是引号时进入引用态
        }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-tool-csv/lib/query.js:74-97](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/query.js#L74-L97)

严格匹配及表头回执。

<details>
<summary>查看原文（24行）</summary>

```text
export function queryRows(grid, options) {
    const index = resolveColumn(grid, options.column, options.header);
    const limit = normalizeLimit(options.limit);
    const dataRows = options.header && grid.length > 0 ? grid.slice(1) : grid;
    const matched = [];
    for (const row of dataRows) {
        const field = row[index];
        if (field !== undefined && field === options.value) {
            matched.push(row);
            if (matched.length >= limit)
                break;
        }
    }
    const columns = [];
    if (options.header && grid.length > 0) {
        columns.push(...grid[0]);
    }
    else {
        const width = gridWidth(grid);
        for (let i = 1; i <= width; i++)
            columns.push(String(i));
    }
    const rows = options.header && grid.length > 0 ? [grid[0], ...matched] : matched;
    return { rows, columns };
```

</details>

**依据 8 · 作者声明**：[packages/dsh-tool-csv/README.md:9-25](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/README.md#L9-L25)

作者描述临时任务与限制。

<details>
<summary>查看原文（17行）</summary>

```text
## 动机

Agent 会话里表格形态的数据（导出文件、API 响应、报告片段）出现频率很高。现有路径是起 `bash` 进程让模型现写解析脚本：

1. **每次调用都起进程**——Windows 上尤其昂贵
2. **模型手写 CSV 解析器错误率高**——引号内逗号、`""` 转义、BOM、跨行字段、CRLF 这些边界手写代码极易踩坑，且结果不可验证

本插件提供确定性、零依赖、纯函数的 CSV 处理：一次函数调用，毫秒级返回结构化 JSON。

与 `dsh-tool-json` 形成"结构化数据处理"对：JSON 管对象，CSV 管表格。

## 安全模型

- **零依赖**：不引入 csv 解析库，手写状态机（单遍扫描，O(n)）
- **纯函数**：不读文件、不写文件、不联网、不 eval
- **无注入面**：查询过滤只做字面精确匹配（`===`），不支持表达式求值
- **预算**：输入上限 256,000 字节（超限直接报错，不截断）；`timeoutMs: 2000`；`limit` 默认 100 行防输出膨胀
```

</details>

#### 缺口

- 真实会话中引号样本的传参和回执
  **影响**：影响能否可靠少用脚本
  **进一步探讨**：使用同一公开多行字段样本对照 CSV 库

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 重复列名、空行与 limit 会改变什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

重复列名是首个应检查的反例。query 的 indexOf 选择第一个同名列，但有表头的 parse/to_json 逐键赋值，最后一个同名列覆盖先出现者；stats 报告后值覆盖，不能据此推断 query 也按后值过滤。若数据字段全空，即使表格写了多个分隔符，pushRow 也只计空行并丢弃行，行号无法直接对齐原文件。limit 在解析完成之后作用于返回行数，默认 100，提供较大正数时没有独立最高行数，query 在 header 模式可额外返回表头。256000 字节输入门槛限制提交规模，但不替代输出字节限制，特别是对象键在每行重复时。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-csv/lib/query.js:29-35](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/query.js#L29-L35)

默认值与合法正数的处理。

```text
/** 规范化 limit：非法值（undefined/null/非有限/负数/0/小数）回退到默认 100。 */
export function normalizeLimit(limit) {
    if (typeof limit !== 'number' || !Number.isFinite(limit) || limit < 1) {
        return DEFAULT_LIMIT;
    }
    return Math.floor(limit);
}
```

**依据 2 · 源码核查**：[packages/dsh-tool-csv/lib/query.js:44-60](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/query.js#L44-L60)

query 同名列取首个。

<details>
<summary>查看原文（17行）</summary>

```text
function resolveColumn(grid, column, header) {
    if (grid.length === 0) {
        throw new Error('csv: empty CSV has no columns');
    }
    if (header) {
        const headerRow = grid[0];
        const byName = headerRow.indexOf(column);
        if (byName !== -1)
            return byName;
        const byIndex = parseIndex(column);
        if (byIndex !== null) {
            if (byIndex > headerRow.length) {
                throw new Error(`csv: column index ${byIndex} out of bounds (${headerRow.length} columns)`);
            }
            return byIndex - 1;
        }
        throw new Error(`csv: column "${column}" not found in header and not a valid 1-based index`);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-csv/lib/query.js:106-138](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/query.js#L106-L138)

stats 重名及宽度警告。

<details>
<summary>查看原文（33行）</summary>

```text
    if (header) {
        const headerRow = grid[0];
        // 重复列名：后出现的列覆盖先出现的（与多数 CSV 库一致），并报告
        const seen = new Set();
        const duplicates = new Set();
        for (const name of headerRow) {
            if (seen.has(name))
                duplicates.add(name);
            seen.add(name);
        }
        if (duplicates.size > 0) {
            warnings.push(`duplicate column names: ${[...duplicates].join(', ')} (later ones win)`);
        }
        let fewer = 0;
        let more = 0;
        for (const row of grid.slice(1)) {
            if (row.length < headerRow.length)
                fewer++;
            else if (row.length > headerRow.length)
                more++;
        }
        if (fewer > 0) {
            warnings.push(`${fewer} data row(s) have fewer fields than the header (missing fields filled with null)`);
        }
        if (more > 0) {
            warnings.push(`${more} data row(s) have more fields than the header (extra fields merged into the last column)`);
        }
        return {
            rows: grid.length - 1,
            columns: width,
            columnNames: [...headerRow],
            emptyRows,
            warnings,
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-csv/lib/query.js:153-176](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/query.js#L153-L176)

parse 同名键按行覆盖及字段归并。

<details>
<summary>查看原文（24行）</summary>

```text
/** 网格 → JSON 值（header=true 时对象数组；header=false 时数组数组）。 */
export function toJsonRows(grid, header, delimiter, limit) {
    const cap = normalizeLimit(limit);
    if (grid.length === 0)
        return [];
    if (!header) {
        return grid.slice(0, cap).map(row => [...row]);
    }
    const headerRow = grid[0];
    const out = [];
    for (const row of grid.slice(1, cap + 1)) {
        // 多余字段并入最后一个字段（用分隔符连接）
        const effective = row.length > headerRow.length
            ? [...row.slice(0, headerRow.length - 1), row.slice(headerRow.length - 1).join(delimiter)]
            : row;
        // null-prototype 对象：__proto__/constructor/prototype 等表头作为普通字段写入，
        // 不会被原型 setter 吞掉（JSON.stringify 对 null-prototype 对象输出不变）
        const obj = Object.create(null);
        for (let i = 0; i < headerRow.length; i++) {
            obj[headerRow[i]] = i < effective.length ? effective[i] : null;
        }
        out.push(obj);
    }
    return out;
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-csv/lib/parse.js:37-68](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/parse.js#L37-L68)

字节限制和全空数据行统计。

<details>
<summary>查看原文（32行）</summary>

```text
/** 解析 CSV 文本为字符串网格；跳过空行；BOM 剥离；输入字节上限检查；严格引号校验。 */
export function parseCsv(text, options) {
    if (typeof text !== 'string') {
        throw new Error('csv: csv must be a string');
    }
    if (Buffer.byteLength(text, 'utf8') > MAX_INPUT_BYTES) {
        throw new Error(`csv: input exceeds ${MAX_INPUT_BYTES} bytes`);
    }
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;
    let afterQuote = false; // 闭合引号后只允许分隔符/行结束/EOF
    let skippedBlank = 0;
    let i = 0;
    const len = text.length;
    const delim = options.delimiter;
    // BOM 剥离
    if (text.charCodeAt(0) === 0xfeff)
        i = 1;
    const pushField = () => {
        row.push(field);
        field = '';
    };
    const pushRow = () => {
        pushField();
        if (row.some(f => f !== '')) {
            rows.push(row);
        }
        else {
            skippedBlank++;
        }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验证后再试用，如何减少预览被误当成可对账结果？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先在隔离 profile 确认 Cordis/tools、同版 bundle 和工具清单，再输入小型公开 CSV，先看 stats 中的重名与不规则行，再验证 query。只需要预览时可用，涉及对账、重复字段或未截断导出时保留原文件并使用能保存列序号的脚本。模型传输原始文本和输出可能增加上下文，文件不应含未经允许的记录。可检验的改进是在回执报告列索引和是否截断；用同一重复表头、空行和 limit 对照，若仍无法从返回值定位源列，或者用户无需溯源却多承受大回执，改进收益有限。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-tool-csv/README.md:34-48](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/README.md#L34-L48)

作者的参数与动作范围。

<details>
<summary>查看原文（15行）</summary>

```text
| `action` | string | ✅ | `parse` / `query` / `stats` / `to_json` |
| `csv` | string | ✅ | CSV 文本（RFC 4180；引号字段可含逗号/换行；`""` 转义；忽略 BOM） |
| `column` | string | | 查询列：列名（有表头时）或 1-based 索引如 `"2"` |
| `value` | string | | 查询精确匹配值（严格相等，非子串） |
| `delimiter` | string | | 分隔符，默认 `","`；单字符或 `"tab"` |
| `header` | boolean | | 首行是否为表头，默认 `true`；`false` 时行解析为数组 |
| `limit` | integer | | 返回行数上限（query/parse），默认 100 |

## Actions

| action | 功能 | 输出示例 |
|---|---|---|
| `parse` | 解析为 JSON 数组（有表头时每行一个对象） | `[{"name":"Alice","city":"NYC"}]` |
| `query` | 按列名/索引精确过滤行（结果含表头，可回读） | `[["name","city"],["Alice","NYC"]]` |
| `stats` | 行数 / 列数 / 列名 / 空行数 / 警告（含重复列名、字段数不一致） | `{"rows":2,"columns":2,...}` |
```

</details>

**依据 2 · 作者声明**：[packages/dsh-tool-csv/README.md:82-96](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/README.md#L82-L96)

作者记录兼容步骤。

<details>
<summary>查看原文（15行）</summary>

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）


## 安装

### Profile Bundle（推荐）

DSH 0.1.5-rc.1（npm）起，本插件可作为独立 bundle 一键安装到任意 profile（仓库位于 https://github.com/omdsh-dev，public）：
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-csv/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/package.json#L2-L11)

私有子包与 Node 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-csv",
  "description": "DSH CSV data tool: parse/query/stats over RFC 4180 CSV text, zero-dependency state-machine parser",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-csv/lib/index.js:36-45](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-csv/lib/index.js#L36-L45)

query 仅序列化 rows，stats 独立动作。

<details>
<summary>查看原文（10行）</summary>

```text
        const result = queryRows(rows, {
            column: args.column,
            value: args.value,
            header,
            limit: normalizeLimit(args.limit),
        });
        return JSON.stringify(result.rows);
    }
    if (action === 'stats') {
        return JSON.stringify(statsGrid(rows, header, skippedBlank));
```

</details>

#### 缺口

- 未验证固定子包在目标 profile 的打包、装卸和回执预算
  **影响**：影响使用成本和退出
  **进一步探讨**：先试少量公开样本并核对禁用后的工具清单

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
