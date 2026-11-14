# DSH 时间工具

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：为 DSH 提供当前时间、IANA 时区转换、UTC 日历运算和固定时长差。

> **亮点**：把时间转换、格式检查和固定时长计算纳入一次结构化工具调用，让 Agent 可用同一契约复核 UTC 记录。[Q01](#research-q01)

> **主要限制**：timezone 只影响显示。夏令时前后加一个 UTC 日历日，不能当成次日同一当地时间的排程。[Q02](#research-q02)

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
  - [Q01 · 已有 DSH 的协作者把 UTC 时间戳转为接收者时区时，实际调用哪些步骤？](#detail-section-11)
  - [Q02 · 增加一天或一个月是否保留夏令时切换后的当地墙钟时间？](#detail-section-12)
  - [Q03 · 哪些用户值得试，怎样确认没有把 UTC 加法当作当地调度？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：处理会议记录或 UTC 日志的 DSH 用户，可将明确时间戳转为接收者时区，并复查统一的时间格式。

已有终端或日历库即可计算。工具将结构化参数和结果直接交给 DSH，省去按操作系统改写同一命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 当前时间 | 读取当前进程时钟 | 默认按 UTC 展示 |
| 时区转换 | 显示明确时刻在预期时区的表达 | 需要可解析 ISO 与有效时区 |
| 日期加减 | 推算 UTC 日历日期 | 月底裁剪，时区只影响显示 |
| 时长差 | 求两个时间点的带符号毫秒差 | 不推导月和年 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools 与 Cordis peers | 是 | 装配工具 | 无法确认加载 |
| IANA 时区与有效 ISO | 转换需要 | 指定同一时间点的显示 | 未知时区、非法时间会拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 用户在隔离 profile 安装固定子包 | 工具列表出现 time |
| 核查 | 用已知时间点转换并比较 | 核对原 ISO 和显示 |
| 退出 | 出现当地日历要求时切回已有日历 | 保持发起人定义的当地时间 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 未量化 | 核对 peer、profile 和标准时间样例 | 不确定实际宿主组合 |
| 持续 | 工具调用和时区转换耗用未测 | 核对源时间戳和动作 | 自然语言可能要先改成 ISO |
| 失败恢复 | 未量化 | 使用已有日历或独立脚本复核 | 本地排程需另走日历语义 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 重用时区换算 | Intl 生成指定时区表示并返回原 ISO 口径 | 不同宿主时区数据库结果 |
| 避免日期静默溢出 | 核心检查日历日与偏移范围 | 自然语言输入由模型改写的正确性 |

> **思考**：timezone 只影响显示。夏令时前后加一个 UTC 日历日，不能当成次日同一当地时间的排程。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把时间转换、格式检查和固定时长计算纳入一次结构化工具调用，让 Agent 可用同一契约复核 UTC 记录。[Q01](#research-q01)

时间结果保留明确的时区来源。输入和结果范围都有限制，月末及固定时长使用不同的数据路径。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

timezone 只影响显示。夏令时前后加一个 UTC 日历日，不能当成次日同一当地时间的排程。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先选择有时区的已知 UTC 时间点核对转换。当地重复排程仍用日历，避免直接把 UTC 加法作为次日本地时间。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核查固定子包分发、注册与日期语义。未执行工具或测试；实际宿主加载、时区数据和效率未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-time/README.md、packages/dsh-tool-time/package.json、packages/dsh-tool-time/cordis.patch.yml、packages/dsh-tool-time/lib/index.js、packages/dsh-tool-time/lib/time.js 及固定范围 inventory；组件：packages/dsh-tool-time。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件及其 Node 时间处理链路。未运行固定宿主、Intl 数据、环境时钟或模型工具。
- 下一步：同一模型和宿主，用已知 UTC、无偏移时间、月底及夏令时切换各一例核对输出，并记录改写输入耗时。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为本地日历加法单设可识别口径，并要求对夏令时重复或缺失时刻显式裁决。先用同一组切换点比较它与当前工具的误用次数。[Q03](#research-q03)

同一模型和宿主，用已知 UTC、无偏移时间、月底及夏令时切换各一例核对输出，并记录改写输入耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 367 | 310 | 59 | — |
| .md | source | 2 | 370 | — | — | 2960 |
| .ts | source | 3 | 416 | 320 | 62 | — |
| .ts | test | 2 | 398 | 328 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：需要核对跨时区时间点或日期偏移的 DSH 用户，能否用一个本地工具得到可复核结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 DSH 的协作者把 UTC 时间戳转为接收者时区时，实际调用哪些步骤？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

先由 profile 补丁插入独立 tool-time 包，再由 lib 入口注入 tools 并登记 time。convert 要求 value 和 IANA 时区，执行路径先限制字符串长度、拒绝空时区，再按固定 ISO 形式解析时间点。纯日期按 UTC 零点解释，完整日期时间必须有偏移，非法日历日期和超范围偏移会提前失败。Intl 将同一瞬间转换成接收者当地显示，结果仍保留 ISO 和时区来源，因而可复查调用者交给模型的时间点。相比提示模型心算时差，或每次选择系统 date 参数，结构化工具更容易让团队复用同一契约。now 则读取当前进程的时钟，不适合重现历史参考时刻。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-time/package.json:21-39](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/package.json#L21-L39)

宿主 peer、补丁和真正产物出口。

<details>
<summary>查看原文（19行）</summary>

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
  "files": [
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-time/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/cordis.patch.yml#L1-L4)

独立工具的 profile 行。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-time
      name: '@deepseek-ai/dsh-tool-time'
```

**依据 3 · 源码核查**：[packages/dsh-tool-time/lib/index.js:1-40](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/index.js#L1-L40)

工具入口和结构化参数。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * DSH 时间工具插件。
 *
 * 注册 `time` 工具：严格 ISO 解析、IANA 时区转换、UTC 日历运算、固定时长差。
 * 接入方式：在 cordis.yml 追加：
 *   - id: tool-time
 *     name: '@deepseek-ai/dsh-tool-time'
 */
import { defineTool } from '@deepseek-ai/dsh-tools';
import { executeAction } from './time.js';
export const name = '@deepseek-ai/dsh-tool-time';
export const inject = ['tools'];
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'time',
        description: 'Time utilities: current time (default UTC), IANA timezone conversion, ' +
            'UTC calendar arithmetic (add/subtract with month-end clamping), and ' +
            'fixed-duration difference between two strict ISO 8601 timestamps. ' +
            'Actions: now, convert, add, diff.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['now', 'convert', 'add', 'diff'],
                description: 'Operation to perform.',
            },
            value: {
                type: 'string',
                description: 'Strict ISO 8601 timestamp (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ with optional .SSS and +/-HH:MM offset) for convert/add.',
            },
            timezone: {
                type: 'string',
                description: 'IANA timezone name, e.g. "Asia/Shanghai" (default: UTC; display only, arithmetic stays UTC).',
            },
            from: {
                type: 'string',
                description: 'Start timestamp for diff (strict ISO 8601).',
            },
            to: {
                type: 'string',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-time/lib/time.js:22-79](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L22-L79)

ISO 解析、偏移合法性与 Intl 时区。

<details>
<summary>查看原文（58行）</summary>

```text
    const m = ISO_RE.exec(value);
    if (!m)
        throw new Error('time: invalid ISO timestamp');
    const [, y, mo, d, h, mi, s, , tz] = m;
    const year = Number(y);
    const month = Number(mo);
    const day = Number(d);
    // 日历校验（Date 会把 2026-02-30 归一化，必须自己拦）：
    // 月份 1-12 + 按目标年月查表的天数上限（闰年 2 月 29 自动正确）
    if (month < 1 || month > 12)
        throw new Error('time: invalid calendar date');
    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    if (day < 1 || day > daysInMonth)
        throw new Error('time: invalid calendar date');
    if (tz === undefined) {
        // 纯日期：按 UTC 零点解释
        const date = new Date(Date.UTC(year, month - 1, day));
        if (Number.isNaN(date.getTime()))
            throw new Error('time: invalid calendar date');
        return date;
    }
    // 完整日期时间：时/分/秒范围校验（防 Date 静默归一化 25:00 等）
    const hour = Number(h);
    const minute = Number(mi);
    const second = Number(s ?? '0');
    if (hour > 23 || minute > 59 || second > 59)
        throw new Error('time: invalid ISO timestamp');
    if (tz !== 'Z') {
        // 数字偏移：±14:00 内、分钟 ≤59（ISO 8601 规范范围）
        const om = /^([+-])(\d{2}):(\d{2})$/.exec(tz);
        if (!om)
            throw new Error('time: invalid ISO timestamp');
        const oh = Number(om[2]);
        const omin = Number(om[3]);
        if (oh > 14 || (oh === 14 && omin > 0) || omin > 59)
            throw new Error('time: invalid ISO timestamp');
    }
    const date = new Date(value); // 正则保证 ISO 形态；Date 原生解析偏移
    if (Number.isNaN(date.getTime()) || !Number.isFinite(date.getTime())) {
        throw new Error('time: invalid ISO timestamp');
    }
    return date;
}
// ── Intl 时区格式化（环境固定：en-CA + hourCycle h23） ──
/** 目标时区的墙钟各字段（parts 字典）。非法时区抛 `time: unknown timezone`。 */
function wallClockParts(date, timezone) {
    let dtf;
    try {
        dtf = new Intl.DateTimeFormat('en-CA', {
            timeZone: timezone,
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hourCycle: 'h23',
        });
    }
    catch {
        throw new Error(`time: unknown timezone "${timezone}"`);
    }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-time/lib/time.js:226-251](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L226-L251)

实际 now/convert 分派。

<details>
<summary>查看原文（26行）</summary>

```text
export function executeAction(action, params, clock = () => Date.now()) {
    switch (action) {
        case 'now': {
            const timezone = params.timezone;
            if (timezone !== undefined) {
                assertStringLength(timezone, 'timezone');
                if (timezone === '')
                    throw new Error('time: timezone must not be empty');
            }
            const timestamp = clock();
            if (!Number.isFinite(timestamp))
                throw new Error('time: clock returned invalid timestamp');
            const date = new Date(timestamp);
            if (!Number.isFinite(date.getTime()))
                throw new Error('time: clock returned out-of-range timestamp');
            const explicit = timezone !== undefined;
            return buildResult(date, explicit ? timezone : 'UTC', explicit ? 'explicit' : 'default-utc');
        }
        case 'convert': {
            assertStringLength(params.value, 'value');
            assertStringLength(params.timezone, 'timezone');
            if (params.timezone === '')
                throw new Error('time: timezone must not be empty');
            const date = parseStrictISO(params.value);
            return buildResult(date, params.timezone, 'explicit');
        }
```

</details>

#### 缺口

- 实际目标宿主还未加载该固定子包
  **影响**：不能确定目标宿主能否注册和展示结构化时间
  **进一步探讨**：在已匹配 peer 的隔离 profile 检查工具列表，再试已知 UTC 转换

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增加一天或一个月是否保留夏令时切换后的当地墙钟时间？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程、功能与机制

#### 完整回答

不一定。add 的 days 用 UTC 日期字段递增，月份按 UTC 调整并将目标日压到月底，timezone 只用于格式化输出。在纽约春季跳时附近，UTC 同一时刻的本地显示可能比前一天晚一小时。因而用它算晚一天的 UTC 执行点和用它安排每周当地 09:00 是两个不同任务。diff 对两个时刻做带符号毫秒差，受安全整数和支持年份限制，只拆出固定时长，没有当地日历周期。若来源只给本地不带偏移的墙钟时间，数据提供者要先确定时区及冲突时采用哪一次本地时刻。这个约束来自动作实现，而 README 所谓跨 DST 的日历直觉只能按 UTC 口径理解。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-time/lib/time.js:128-172](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L128-L172)

月末裁剪从 UTC 年月日计算，days 使用 UTC。

<details>
<summary>查看原文（45行）</summary>

```text
        formatted,
    };
}
// ── 日历运算（UTC 基准） ──
/** 月/年运算：先置 1 日 → 定位目标年月 → 按目标月最大天数钳制。 */
function addMonthsClamped(date, months) {
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + months;
    const target = new Date(Date.UTC(y, m, 1)); // Date 自动滚年
    const lastDay = new Date(Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0)).getUTCDate();
    target.setUTCDate(Math.min(date.getUTCDate(), lastDay));
    return target;
}
function addCalendar(date, amount, unit) {
    const result = new Date(date);
    switch (unit) {
        case 'seconds':
            result.setUTCSeconds(result.getUTCSeconds() + amount);
            break;
        case 'minutes':
            result.setUTCMinutes(result.getUTCMinutes() + amount);
            break;
        case 'hours':
            result.setUTCHours(result.getUTCHours() + amount);
            break;
        case 'days':
            result.setUTCDate(result.getUTCDate() + amount);
            break;
        case 'weeks': {
            const total = amount * 7;
            if (!Number.isSafeInteger(total))
                throw new Error('time: amount out of range for unit "weeks"');
            result.setUTCDate(result.getUTCDate() + total);
            break;
        }
        case 'months': {
            // RECHECK-TIME-02：与 weeks/years 一致，前置拒绝超出 Date 支持范围的月份数
            if (Math.abs(amount) > MAX_MONTH_AMOUNT) {
                throw new Error('time: amount out of range for unit "months"');
            }
            const r = addMonthsClamped(result, amount);
            if (!Number.isFinite(r.getTime()))
                throw new Error('time: result outside supported range');
            result.setTime(r.getTime());
            break;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-time/lib/time.js:184-218](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L184-L218)

日期范围和固定时长分解。

<details>
<summary>查看原文（35行）</summary>

```text
    }
    if (!Number.isFinite(result.getTime()))
        throw new Error('time: result outside supported range');
    // RECHECK3-TIME-01：结果年份必须留在工具的 1000–9999 契约内
    // （否则 BCE/扩展年份会让 Intl era 年与 offset 计算产生错误输出）
    assertSupportedResultYear(result);
    return result;
}
// ── diff（固定时长，无月份/年份） ──
function diffBetween(from, to) {
    const ms = to.getTime() - from.getTime();
    // AUDIT-TIME-02：duration 精度保护——差值必须有限且在安全整数内
    if (!Number.isFinite(ms) || Math.abs(ms) > Number.MAX_SAFE_INTEGER) {
        throw new Error('time: diff duration out of range');
    }
    const sign = ms > 0 ? 1 : ms < 0 ? -1 : 0;
    const abs = Math.abs(ms);
    const totalSeconds = Math.floor(abs / 1000);
    const absolute = {
        days: Math.floor(totalSeconds / 86_400),
        hours: Math.floor((totalSeconds % 86_400) / 3_600),
        minutes: Math.floor((totalSeconds % 3_600) / 60),
        seconds: totalSeconds % 60,
        milliseconds: abs % 1000,
    };
    return {
        sign: sign,
        milliseconds: ms,
        seconds: sign * totalSeconds,
        minutes: sign * Math.floor(abs / 60_000),
        hours: sign * Math.floor(abs / 3_600_000),
        days: sign * Math.floor(abs / 86_400_000),
        weeks: sign * Math.floor(abs / 604_800_000),
        absolute,
    };
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-time/lib/time.js:252-278](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L252-L278)

timezone 仅用于结果展示，diff 单独解析起止。

<details>
<summary>查看原文（27行）</summary>

```text
        case 'add': {
            assertStringLength(params.value, 'value');
            const unit = params.unit;
            if (typeof unit !== 'string' || !UNITS.includes(unit)) {
                throw new Error(`time: unknown unit "${String(unit)}"`);
            }
            if (typeof params.amount !== 'number' || !Number.isSafeInteger(params.amount)) {
                throw new Error('time: amount must be a safe integer');
            }
            const date = parseStrictISO(params.value);
            if (params.timezone !== undefined) {
                assertStringLength(params.timezone, 'timezone');
                if (params.timezone === '')
                    throw new Error('time: timezone must not be empty');
            }
            const timezone = params.timezone ?? 'UTC';
            const result = addCalendar(date, params.amount, unit);
            const source = params.timezone !== undefined ? 'explicit' : 'default-utc';
            return buildResult(result, timezone, source);
        }
        case 'diff': {
            assertStringLength(params.from, 'from');
            assertStringLength(params.to, 'to');
            // RECHECK5-TIME-01：diff 输入同样受结果年份契约约束（offset 换算后的 instant）
            // ——与 convert 对相同输入的行为保持一致，避免跨 action 不一致
            const fromDate = parseStrictISO(params.from);
            const toDate = parseStrictISO(params.to);
```

</details>

**依据 4 · 作者声明**：[packages/dsh-tool-time/README.md:80-89](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/README.md#L80-L89)

作者明确时区只影响展示。

<details>
<summary>查看原文（10行）</summary>

```text
语义契约：

- **`add` 始终基于 UTC 运算**（日历日语义，跨 DST 保持"日历日"直觉）；`timezone` 仅决定 `local`/`formatted` 展示
- **月份/年份钳制**：`2026-01-31 + 1 month = 2026-02-28`；`2028-02-29 + 1 year = 2029-02-28`（先置 1 日 → 定位目标年月 → 按目标月最大天数钳制）
- **`diff` 仅固定时长**：`sign` + 带符号总量 + `absolute` 余数分解（月/年无法从毫秒唯一推导，不提供）。字段语义（AUDIT-TIME-03）：
  - `milliseconds` 是**精确带符号**总时长
  - `seconds`/`minutes`/`hours`/`days`/`weeks` 是 `sign * floor(abs / unit)`（对绝对值截断后带符号）
  - `absolute` 是 `abs` 的**非负余数分解**（如 -1500ms → `milliseconds: -1500, seconds: -1, absolute: {seconds: 1, milliseconds: 500}`）
  - 差值超过安全整数范围抛 `time: diff duration out of range`
- **默认 UTC**：省略 `timezone` 时结果与运行环境无关（`timezoneSource: "default-utc"`）
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些用户值得试，怎样确认没有把 UTC 加法当作当地调度？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有 DSH、经常转换已有 UTC 时间点的人可选两个已知时间用于试用，其中一个跨夏令时。核对固定瞬间转出的当地时间，再检查月底和非法输入是否符合约定。出现“次日同一当地时间”这一需求时，应回到已有日历或带时区日历语义的排程库。首次成本来自 profile 安装、peer 和输入改写，持续成本来自工具调用及确认模型选择了 convert 还是 add。未测 Token、人工时间或金额。可探索在加法输出明确标记 UTC 或当地日历口径、并允许用户选择两者，遇到重复或不存在的本地时刻要求给出裁决。用同一组两个 DST 切点测试，比较错误和额外输入成本。若现有字段解释已足够避免错误，额外动作就无明显价值。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-time/lib/time.js:252-270](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/lib/time.js#L252-L270)

当前未把 timezone 送入 UTC arithmetic。

<details>
<summary>查看原文（19行）</summary>

```text
        case 'add': {
            assertStringLength(params.value, 'value');
            const unit = params.unit;
            if (typeof unit !== 'string' || !UNITS.includes(unit)) {
                throw new Error(`time: unknown unit "${String(unit)}"`);
            }
            if (typeof params.amount !== 'number' || !Number.isSafeInteger(params.amount)) {
                throw new Error('time: amount must be a safe integer');
            }
            const date = parseStrictISO(params.value);
            if (params.timezone !== undefined) {
                assertStringLength(params.timezone, 'timezone');
                if (params.timezone === '')
                    throw new Error('time: timezone must not be empty');
            }
            const timezone = params.timezone ?? 'UTC';
            const result = addCalendar(date, params.amount, unit);
            const source = params.timezone !== undefined ? 'explicit' : 'default-utc';
            return buildResult(result, timezone, source);
```

</details>

**依据 2 · 作者声明**：[packages/dsh-tool-time/README.md:91-104](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-time/README.md#L91-L104)

作者陈述一次消费环境及分发条件，本次未复跑。

<details>
<summary>查看原文（14行）</summary>

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1`（npm 私有包）的隔离 consumer 中完成全链路验证：

- **类型/运行时**：peer 为 `@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 DSH 0.1.5-rc.1（npm）consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）


## 版本适配

- **适配 DSH**: DSH 0.1.5-rc.1（npm）（profile/bundle 插件系统）
- **bundle 声明**: `package.json` 的 `dsh.bundle`（patch 指向 `cordis.patch.yml`）+ `exports` 导出
```

</details>

#### 缺口

- 去年和当前宿主未做同条件实际任务比较
  **影响**：未证明对正常 UTC 任务的准确率与节省时间
  **进一步探讨**：在两个预选例子核对工具动作、输入和输出，再同已有日历结果比较

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
