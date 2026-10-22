# dsh-leak-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[8b578f8](https://github.com/7gzgn/dsh-leak-guard/tree/8b578f80898b80acc77285f3f4c095b433dda0a4)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：发布前本地遍历文本和敏感文件名，按凭据模式返回位置、级别与六字符预览，提供scan和rules工具动作。

> **核心亮点**：把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](#research-q02)。

> **风险与缺陷**：缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](#research-q03)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 发布前扫描能交付什么，是否构成硬闸？](#detail-section-11)
  - [Q02 · 规则、遍历与脱敏有什么实际贡献？](#detail-section-12)
  - [Q03 · 什么条件下ok=true仍代表没有完成审计？](#detail-section-13)
  - [Q04 · 低误报规则与脱敏还留下什么边界？](#detail-section-14)
  - [Q05 · 启用和三阶段成本应该怎样看？](#detail-section-15)
  - [Q06 · 推荐结论与继续探讨入口是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合开发者在公开仓库/publish/外发目录前，以本地启发式检查现有文本中的凭据线索，再人工复核/移除。基线手工grep/检查文件名或专门secret scanner；插件把规则扫描接入DSH工具并返回脱敏发现，便于模型/人看位置。

没有git hook、发布拦截或工具授权中间件，systemPrompt“必须扫描”只是行为指引。扫描目标来自参数/default cwd，不是将要发布的staged tree、历史或npm pack精确清单；修改/打包发生后旧结果不能证明当前发布内容。ok只定义为当前已收集发现没有critical/high，绝非没有凭据或已完整覆盖。合格交付必须连同覆盖限制/跳过/错误看，不能只看绿灯。

手工grep/敏感文件检查或成熟secret scanner；本插件提供模型审计入口/克制回执，不交付完整发布认证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模式/文件名扫描 | 凭据线索定位 | 有过滤/漏报，非有效性验证 |
| 熵检测 | 可选medium候选 | 需上下文/人工复核，不阻绿灯 |
| 克制预览 | 六字符/长度 | 路径/前缀仍是信息 |
| 规则目录 | 列22内容规则 | 不包含11文件名规则 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18与DSH tools/systemPrompt | 工具和提示 | 动态defineTool退化不保证任意宿主API可用 |
| 明确目标路径和读取权限 | 当前文本遍历 | 缺失/不可读根也可绿灯 |
| 规则/过滤/预算适合发布清单 | 发现凭据线索 | 不是历史/归档/完整发布对象扫描 |
| 人工复核与独立发布控制 | 处理发现/真实轮换 | prompt不是硬闸 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核工具注册/版本 | 不从可选peer推所有版本兼容 |
| 定义对象 | 显式路径/发布清单/权限 | 避免默认宿主cwd |
| 扫描 | 选择规则/扩展/熵 | 绿灯连同跳过/覆盖看 |
| 处理 | 脱敏报告人工复核，真实泄露轮换并清历史 | 删除工作区文本不撤销旧秘密 |
| 发布复核 | 内容变更后重新核精确对象 | 独立审批/闸，不信旧scan回执 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/规则与工具prompt上下文 | 定范围/过滤、对照发布清单 | 配置工时/主机费用未知 |
| 持续使用 | 文本读取/正则/内存与报告上下文 | 复核误报/漏报和规则更新 | 无独立LLM/上传API不等宿主总token0；总目录耗时未知 |
| 失败恢复 | 重扫/异常文件/发布停止资源 | 补覆盖、确认泄露后轮换与历史清理 | 真泄露恢复成本可高；工时/额度未知 |



#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少漏显式模式 | 22内容/11文件名规则 | 有静默跳过/白名单漏报 |
| 降报告原文量 | 六字符+长度而非整行 | 文件名/路径仍可敏感 |
| 接入DSH审计 | scan/rules工具 | 非自动发布拦截 |

启用熵会增加medium候选复核负担，且medium不阻ok；单文件上限/只扫类型减少资源也减少覆盖，不可当净收益。

> **思考**：缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](#research-q02)。

把本地模式/文件名审计整合为DSH工具，按位置级别给克制预览，模块可独立复核；非有效凭据验证。详见[Q02](#research-q02)。

占位符匹配是整个raw是否包含example/sample/dummy/四个x等子串，真实形状凭据若恰包含这些也会丢弃；它不验证远端有效性，critical是启发式级别而非证明活钥。同行具体命中导致所有generic都跳，独立的另一密码也可能被一起漏掉，不只去同一个泄露重复。Azure regex末尾==后接word boundary要求后字符是word，在常见结束/引号位置反而可能不匹配；Gitee上下文形状也只是一种约定。

六字符预览比回显整行克制，但路径/文件名不脱敏、前缀/长度仍是元数据，不保证完全无信息。敏感文件名提示恒写“未读取内容”，后续实际仍可能读取内容，文案容易让人误解访问范围。文件名规则loose-token-file含必需的点而只有扩展名组可选，裸token或.gh-token不一定命中，不能照README枚举推断全部覆盖。

作者smoke构造少量前缀/占位符/目录/文件名正例；其“脱敏”every条件含||true恒真，另有长度<=40断言只能限制长度，不能证明原文没有泄露。self-scan是自己规则扫自己，不是独立真值/召回测量。代码小且模块化/独立导出有利复核，性能/精确率/召回率需独立样例，不把“秒级/宁可漏”作为实测。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺失根/权限失败/静默长行与限额可使未完整扫描仍ok=true，工具丢截断且小正数预算可round0；绿灯不能当发布安全证明。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，仅额外线索，不自动发布；先修覆盖/错误/预算状态，保留独立扫描与人工审查。详见[Q06](#research-q06)。

没有git hook、发布拦截或工具授权中间件，systemPrompt“必须扫描”只是行为指引。扫描目标来自参数/default cwd，不是将要发布的staged tree、历史或npm pack精确清单；修改/打包发生后旧结果不能证明当前发布内容。ok只定义为当前已收集发现没有critical/high，绝非没有凭据或已完整覆盖。合格交付必须连同覆盖限制/跳过/错误看，不能只看绿灯。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。线索检测适配成立，绿灯/覆盖语义不足以承担宣传中的发布闸。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/scanner.js、lib/patterns.js、test/smoke.mjs、test/self-scan.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整lib三文件、作者smoke/self-scan设计和包；不运行目标扫描器/测试/宿主，不读取真实凭据。
- 下一步：可继续合成真值/对象变更/错误限额矩阵，比较complete可信度与误报负担，不使用真密钥。

**分析版本**

- **仓库**：[7gzgn/dsh-leak-guard](https://github.com/7gzgn/dsh-leak-guard)
- **版本号**：0.1.1（[固定提交 8b578f8](https://github.com/7gzgn/dsh-leak-guard/tree/8b578f80898b80acc77285f3f4c095b433dda0a4)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索complete/partial/error覆盖收据与精确发布对象摘要、正整数预算和范围去重，按合成真值/变更矩阵证伪；未实现。详见[Q06](#research-q06)。

可继续合成真值/对象变更/错误限额矩阵，比较complete可信度与误报负担，不使用真密钥。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 760 | 587 | 113 | — |
| .md | source | 1 | 107 | — | — | 1050 |
| .mjs | test | 2 | 122 | 88 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-leak-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-leak-guard/issues?q=is%3Aissue+created%3A2026-09-22T10%3A08%3A46.069Z..2026-10-22T10%3A08%3A46.069Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7gzgn/dsh-leak-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A08%3A46.069Z..2026-10-22T10%3A08%3A46.069Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核线索审计与发布闸区别、规则/覆盖/绿灯语义、脱敏与反例、成本及可证伪覆盖回执。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 发布前扫描能交付什么，是否构成硬闸？

**研究主题**：场景与需求

#### 完整回答

适合开发者在公开仓库/publish/外发目录前，以本地启发式检查现有文本中的凭据线索，再人工复核/移除。基线手工grep/检查文件名或专门secret scanner；插件把规则扫描接入DSH工具并返回脱敏发现，便于模型/人看位置。

没有git hook、发布拦截或工具授权中间件，systemPrompt“必须扫描”只是行为指引。扫描目标来自参数/default cwd，不是将要发布的staged tree、历史或npm pack精确清单；修改/打包发生后旧结果不能证明当前发布内容。ok只定义为当前已收集发现没有critical/high，绝非没有凭据或已完整覆盖。合格交付必须连同覆盖限制/跳过/错误看，不能只看绿灯。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-31](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L25-L31)

提示而非执行闸。

```text
export const LEAK_GUARD_GUIDANCE = [
  '本机已安装 **dsh-leak-guard**（发布前凭据审计）：提供 `leak_guard` 工具，在**本地**扫描文件/目录里有没有 API key、token、私钥、数据库连接串、明文密码等不该公开的东西，发现结果**脱敏**返回（只留前 6 个字符）。',
  '**什么时候必须用**：把任何东西推到公开仓库 / 发给别人 / 上传之前 —— 尤其是 `git push`、发布 npm 包、把工作区打包外发之前。',
  '用法：`leak_guard({ action: "scan", path: "<目录或文件的绝对路径>" })`，返回 `ok=true` 才算干净；`ok=false` 时先处理 `findings` 里的 critical/high 项再发布。',
  '其它动作：`action:"rules"` 列出全部检测规则；`entropy:true` 额外启用高熵随机串检测（噪声略多，默认关闭）。',
  '它**不联网、不上传任何内容**，只读你指定的路径。',
].join('\n');
```

**依据 2 · 源码核查**：[lib/index.js:153-183](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L153-L183)

目标/动作/返回字段。

<details>
<summary>查看原文（31行）</summary>

```text
      async execute(args) {
        const action = ((args && args.action) || 'scan').trim().toLowerCase();

        if (action === 'rules') {
          return { action: 'rules', rules: ruleCatalog() };
        }

        if (action !== 'scan') {
          return { action, error: `unknown action: ${action}（支持 scan / rules）` };
        }

        const target = ((args && args.path) || '').trim() || process.cwd();
        const only = typeof args?.only === 'string' && args.only.trim() !== ''
          ? args.only.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined;

        try {
          const result = await scanPath(target, {
            entropy: args?.entropy === true,
            maxFindings: typeof args?.max_findings === 'number' && args.max_findings > 0
              ? Math.min(Math.round(args.max_findings), 2000)
              : undefined,
            only,
          });
          return {
            action: 'scan',
            ok: result.ok,
            counts: result.counts,
            findings: result.findings,
            stats: result.stats,
          };
```

</details>

**依据 3 · 源码核查**：[lib/scanner.js:312-328](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L312-L328)

ok只按已发现严重项。

<details>
<summary>查看原文（17行）</summary>

```text
  const blocked = deduped.filter(
    (f) => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH,
  );

  return {
    target,
    ok: blocked.length === 0,
    findings: deduped.slice(0, opts.maxFindings),
    truncated: deduped.length > opts.maxFindings,
    counts: {
      critical: deduped.filter((f) => f.severity === SEVERITY.CRITICAL).length,
      high: deduped.filter((f) => f.severity === SEVERITY.HIGH).length,
      medium: deduped.filter((f) => f.severity === SEVERITY.MEDIUM).length,
      total: deduped.length,
    },
    stats,
  };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规则、遍历与脱敏有什么实际贡献？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

一个leak_guard工具含scan/rules动作，动态defineTool缺失可退恒等；注入tools/systemPrompt，注册句柄effect卸载。核心仅fs/path和本地正则，无网络/上传/文件写接口；工具结果仍可进入DSH/模型，不能推论整条宿主链路不外发。

scanner lstat遍历、跳符号链接/常见依赖构建目录和二进制后缀，默认文件1MiB，NUL前8KiB二进制探测；敏感文件名先记high，再应用only/大小/内容过滤。逐行内容先粗筛，再具体规则；同行已有具体命中则跳泛化赋值/Bearer。占位符正则过滤，熵检测默认关，启用仍要求上下文词/长度/熵阈值并只记medium。

当前源码22条内容规则、11条文件名规则，README声称23需以固定表为准；rules动作只列22条内容规则，不列敏感文件名规则。每个命中保存相对路径/行/规则/级别，preview只留匹配文本前6字符加长度，排序去重。贡献是易读的本地审计适配与克制回显，非凭据有效性验证或新秘密检测算法。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:37-43](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L37-L43)

defineTool退化。

```text
let defineTool = (def) => def;
try {
  const mod = await import('@deepseek-ai/dsh-tools');
  if (mod && typeof mod.defineTool === 'function') defineTool = mod.defineTool;
} catch {
  /* 宿主外运行：保持恒等实现 */
}
```

**依据 2 · 源码核查**：[lib/index.js:190-211](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L190-L211)

卸载。

<details>
<summary>查看原文（22行）</summary>

```text
    disposers.push(ctx.tools.register(definition));
  }

  if (cfg.announceToAgent !== false && ctx.systemPrompt !== undefined
    && typeof ctx.systemPrompt.section === 'function') {
    disposers.push(ctx.systemPrompt.section({
      name: 'plugin:leak-guard',
      order: SECTION_ORDER,
      text: LEAK_GUARD_GUIDANCE,
    }));
  }

  if (typeof ctx.effect === 'function' && disposers.length > 0) {
    ctx.effect(() => () => {
      for (const dispose of disposers) {
        try {
          if (typeof dispose === 'function') dispose();
        } catch {
          /* 卸载失败不阻断其它清理 */
        }
      }
    }, 'dsh-leak-guard: teardown');
```

</details>

**依据 3 · 源码核查**：[lib/scanner.js:25-44](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L25-L44)

默认过滤/限额。

<details>
<summary>查看原文（20行）</summary>

```text
/** 默认跳过的目录名（大小写不敏感）。 */
export const DEFAULT_SKIP_DIRS = [
  'node_modules', '.git', '.hg', '.svn', 'dist', 'build', 'out', 'coverage',
  '.next', '.nuxt', '.cache', '.parcel-cache', '.turbo', '.venv', 'venv',
  '__pycache__', '.idea', '.vs', 'target', 'vendor', '.gradle', '.terraform',
];

/** 默认跳过的扩展名（二进制 / 归档，扫了也是浪费时间）。 */
export const DEFAULT_SKIP_EXTS = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.bmp', '.svgz',
  '.mp3', '.mp4', '.mov', '.avi', '.wav', '.flac', '.webm',
  '.zip', '.gz', '.tgz', '.bz2', '.xz', '.7z', '.rar', '.jar', '.war',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.class', '.pyc', '.o', '.a',
  '.woff', '.woff2', '.ttf', '.otf', '.eot', '.pdf', '.docx', '.xlsx',
  '.pptx', '.sqlite', '.db', '.i64', '.idb', '.asar', '.node',
];

const DEFAULT_MAX_BYTES = 1024 * 1024; // 单文件 1MB 上限
const DEFAULT_MAX_FINDINGS = 200;
const HARD_LINE_LIMIT = 20000;
```

</details>

**依据 4 · 源码核查**：[lib/scanner.js:74-106](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L74-L106)

逐规则/六字符。

<details>
<summary>查看原文（33行）</summary>

```text
function runRules(rules, line, relPath, lineNo, out) {
  for (const rule of rules) {
    const re = new RegExp(rule.regex.source, rule.regex.flags);
    let m;
    while ((m = re.exec(line)) !== null) {
      const raw = m[0];
      if (m.index === re.lastIndex) re.lastIndex += 1;
      if (raw.length === 0) continue;
      if (PLACEHOLDER_RE.test(raw)) continue;
      out.push({
        file: relPath,
        line: lineNo,
        rule: rule.id,
        label: rule.label,
        severity: rule.severity,
        preview: redact(raw),
      });
    }
  }
}

/** 高熵候选必须同时具备的「上下文词」，否则不报（压误报）。 */
const ENTROPY_CONTEXT_RE = /(key|token|secret|password|passwd|pwd|credential|auth|密钥|令牌|密码)/i;

/** 路径转正斜杠，便于跨平台匹配。 */
function toPosix(p) {
  return p.split(sep).join('/');
}

/** 只留前 6 个字符的脱敏预览。 */
export function redact(match) {
  const head = match.slice(0, 6);
  return `${head}…（${match.length} 字符）`;
```

</details>

**依据 5 · 源码核查**：[lib/scanner.js:134-174](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L134-L174)

逐行/熵/泛化策略。

<details>
<summary>查看原文（41行）</summary>

```text
export function scanText(text, relPath, opts = {}) {
  const findings = [];
  const lines = text.split(/\r?\n/).slice(0, HARD_LINE_LIMIT);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.length === 0 || line.length > 5000) continue;
    if (!QUICK_RE.test(line) && !ENTROPY_CANDIDATE_RE.test(line)) {
      ENTROPY_CANDIDATE_RE.lastIndex = 0;
      continue;
    }

    // 先跑具体规则；这一行已经有具体命中时，泛化规则让位（同一条泄露不报两遍）
    const hits = [];
    runRules(SPECIFIC_RULES, line, relPath, i + 1, hits);
    if (hits.length === 0) runRules(GENERIC_RULES, line, relPath, i + 1, hits);
    findings.push(...hits);

    if (opts.entropy === true && ENTROPY_CONTEXT_RE.test(line)) {
      const re = new RegExp(ENTROPY_CANDIDATE_RE.source, 'g');
      let m;
      while ((m = re.exec(line)) !== null) {
        const raw = m[0];
        if (raw.length < ENTROPY_MIN_LENGTH) continue;
        if (PLACEHOLDER_RE.test(raw)) continue;
        if (shannonEntropy(raw) < 4.5) continue;
        // 已经由具体规则报过的，不重复报
        if (findings.some((f) => f.line === i + 1 && f.preview.startsWith(raw.slice(0, 6)))) continue;
        findings.push({
          file: relPath,
          line: i + 1,
          rule: 'high-entropy-string',
          label: '高熵随机串（疑似密钥，需人工确认）',
          severity: SEVERITY.MEDIUM,
          preview: redact(raw),
        });
      }
    }
  }

  return findings;
```

</details>

**依据 6 · 源码核查**：[lib/patterns.js:32-44](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js#L32-L44)

11文件名规则。

<details>
<summary>查看原文（13行）</summary>

```text
export const SENSITIVE_FILE_PATTERNS = [
  { id: 'dotenv', label: '.env 环境变量文件', regex: /(^|\/)\.env(\.[A-Za-z0-9_-]+)?$/ },
  { id: 'dsh-credentials', label: 'DSH 凭据文件', regex: /(^|\/)\.credentials\.ya?ml$/ },
  { id: 'loose-token-file', label: '裸 token 文件', regex: /(^|\/)(\.gh-token|\.npm-token|\.pypi-token|token|tokens)\.(txt|json|ya?ml)?$/ },
  { id: 'git-credentials', label: 'git 明文凭据', regex: /(^|\/)\.git-credentials$/ },
  { id: 'npmrc', label: 'npm 配置（可能含 _authToken）', regex: /(^|\/)\.npmrc$/ },
  { id: 'netrc', label: 'netrc 明文凭据', regex: /(^|\/)\.netrc$/ },
  { id: 'ssh-private-key', label: 'SSH 私钥', regex: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/ },
  { id: 'key-file', label: '私钥/证书文件', regex: /\.(pem|key|p12|pfx|jks|keystore|ppk)$/i },
  { id: 'gcloud-key', label: 'GCP 服务账号密钥', regex: /service[-_]?account[^/]*\.json$/i },
  { id: 'aws-credentials', label: 'AWS 凭据文件', regex: /(^|\/)\.aws\/credentials$/ },
  { id: 'kubeconfig', label: 'kubeconfig', regex: /(^|\/)(kubeconfig|\.kube\/config)$/ },
];
```

</details>

**依据 7 · 源码核查**：[lib/patterns.js:50-198](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js#L50-L198)

22内容与目录动作。

<details>
<summary>查看原文（149行）</summary>

```text
export const RULES = [
  // ── 大模型 / AI 服务 ───────────────────────────────────────────
  {
    id: 'llm-api-key',
    label: 'LLM API key（sk- 前缀）',
    severity: SEVERITY.CRITICAL,
    regex: /\bsk-[A-Za-z0-9_-]{16,}\b/g,
  },
  {
    id: 'anthropic-key',
    label: 'Anthropic API key',
    severity: SEVERITY.CRITICAL,
    regex: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/g,
  },
  {
    id: 'huggingface-token',
    label: 'HuggingFace token',
    severity: SEVERITY.CRITICAL,
    regex: /\bhf_[A-Za-z0-9]{25,}\b/g,
  },

  // ── 代码托管 ──────────────────────────────────────────────────
  {
    id: 'github-token',
    label: 'GitHub token（ghp_/gho_/ghu_/ghs_/ghr_）',
    severity: SEVERITY.CRITICAL,
    regex: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g,
  },
  {
    id: 'github-pat-fine-grained',
    label: 'GitHub fine-grained PAT',
    severity: SEVERITY.CRITICAL,
    regex: /\bgithub_pat_[A-Za-z0-9_]{50,}\b/g,
  },
  {
    id: 'gitlab-token',
    label: 'GitLab token',
    severity: SEVERITY.CRITICAL,
    regex: /\bglpat-[A-Za-z0-9_-]{18,}\b/g,
  },
  {
    id: 'gitee-token',
    label: 'Gitee 私人令牌',
    severity: SEVERITY.HIGH,
    regex: /\b[0-9a-f]{32}\b(?=[^\n]{0,40}(gitee|私人令牌|access[_-]?token))/gi,
  },

  // ── 云厂商 ────────────────────────────────────────────────────
  {
    id: 'aws-access-key-id',
    label: 'AWS Access Key ID',
    severity: SEVERITY.CRITICAL,
    regex: /\b(AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    id: 'aliyun-access-key',
    label: '阿里云 AccessKey',
    severity: SEVERITY.CRITICAL,
    regex: /\bLTAI[A-Za-z0-9]{12,}\b/g,
  },
  {
    id: 'tencent-secret-id',
    label: '腾讯云 SecretId',
    severity: SEVERITY.HIGH,
    regex: /\bAKID[A-Za-z0-9]{13,}\b/g,
  },
  {
    id: 'google-api-key',
    label: 'Google API key',
    severity: SEVERITY.CRITICAL,
    regex: /\bAIza[0-9A-Za-z_-]{35}\b/g,
  },
  {
    id: 'azure-key',
    label: 'Azure / 通用 88 位 base64 密钥',
    severity: SEVERITY.MEDIUM,
    regex: /\b[A-Za-z0-9+/]{86}==\b/g,
  },

  // ── 支付 / 通信 ───────────────────────────────────────────────
  {
    id: 'stripe-secret',
    label: 'Stripe secret key',
    severity: SEVERITY.CRITICAL,
    regex: /\bsk_(live|test)_[A-Za-z0-9]{20,}\b/g,
  },
  {
    id: 'slack-token',
    label: 'Slack token',
    severity: SEVERITY.CRITICAL,
    regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g,
  },
  {
    id: 'telegram-bot-token',
    label: 'Telegram bot token',
    severity: SEVERITY.CRITICAL,
    regex: /\b\d{8,12}:AA[A-Za-z0-9_-]{30,}\b/g,
  },
  {
    id: 'sendgrid-key',
    label: 'SendGrid API key',
    severity: SEVERITY.CRITICAL,
    regex: /\bSG\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g,
  },

  // ── 私钥 / 证书 ───────────────────────────────────────────────
  {
    id: 'private-key-block',
    label: '私钥内容块',
    severity: SEVERITY.CRITICAL,
    regex: /-----BEGIN (RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/g,
  },
  {
    id: 'jwt',
    label: 'JWT（可能含身份声明，视场景而定）',
    severity: SEVERITY.MEDIUM,
    regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  },

  // ── 连接串 / 通用赋值 ─────────────────────────────────────────
  {
    id: 'db-connection-string',
    label: '带密码的数据库连接串',
    severity: SEVERITY.CRITICAL,
    regex: /\b(postgres(ql)?|mysql|mongodb(\+srv)?|redis|amqp|mssql|clickhouse):\/\/[^\s:@/]{1,64}:[^\s:@/]{3,128}@/gi,
  },
  {
    id: 'assignment-secret',
    label: '硬编码的秘密赋值（password/secret/token/api_key = "…"）',
    severity: SEVERITY.HIGH,
    regex: /\b(pass(word|wd)?|pwd|secret|token|api[_-]?key|access[_-]?key|private[_-]?key|client[_-]?secret)\b\s*[:=]\s*['"`]([^'"`\n]{8,200})['"`]/gi,
  },
  {
    id: 'bearer-token',
    label: '硬编码 Bearer token',
    severity: SEVERITY.HIGH,
    regex: /\bBearer\s+[A-Za-z0-9\-._~+/]{25,}=*/g,
  },
  {
    id: 'basic-auth-url',
    label: 'URL 内嵌用户名密码',
    severity: SEVERITY.HIGH,
    regex: /\bhttps?:\/\/[^\s:@/]{1,64}:[^\s:@/]{3,128}@[^\s/]+/gi,
  },
];

/** 概览用的规则清单（不含正则，供 `rules` 动作输出）。 */
export function ruleCatalog() {
  return RULES.map((r) => ({ id: r.id, label: r.label, severity: r.severity }));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么条件下ok=true仍代表没有完成审计？

**研究主题**：缺陷与关键质疑

#### 完整回答

路径lstat失败只filesSkipped++后返回，目录readdir失败直接return；所以不存在/不可读根可得到零发现ok=true，而非失败。readFile失败/二进制/超大/默认跳目录也不将ok设false，超大仅medium。scanText只前20000行，超过5000字符的整行跳过且无覆盖记录。git历史、归档二进制/构建产物也在范围外，若这些进入实际发布清单不能据工作区绿灯放行。

maxFindings不仅限制返回，还在遍历入口和目录循环提前停止。若已有medium达到上限可不再访问后续critical文件，且truncated仅按去重后发现数>上限判定，恰等上限时仍false。工具execute还完全丢弃scanner.truncated，render显式硬填false；覆盖中断不能从最终发现列表推断。尤其工具max_findings正数先round，0.1可成0，scanPath入口length>=0立刻停止，静态路径推出空扫描ok=true。这不是实测结果，但足以否定把ok作安全闸。

未绑定内容hash/扫描清单/发布对象，扫描后变更与忽略项未闭合；60秒工具期限未向扫描器传signal，总文件数/总字节无上限，超时不能证明停止。文件lstat与readFile分离存在变化窗口，正常情况下跳symlink不等对抗并发替换的物理边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scanner.js:216-241](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L216-L241)

错误/目录/限额停止。

<details>
<summary>查看原文（26行）</summary>

```text
  async function walk(absPath) {
    if (findings.length >= opts.maxFindings) return;
    let st;
    try {
      st = await lstat(absPath);
    } catch {
      stats.filesSkipped += 1;
      return;
    }
    if (st.isSymbolicLink()) return; // 不跟随符号链接

    if (st.isDirectory()) {
      const name = absPath.slice(absPath.lastIndexOf(sep) + 1).toLowerCase();
      if (absPath !== base && opts.skipDirs.has(name)) return;
      stats.dirsVisited += 1;
      let entries;
      try {
        entries = await readdir(absPath);
      } catch {
        return;
      }
      for (const entry of entries) {
        if (findings.length >= opts.maxFindings) return;
        await walk(join(absPath, entry));
      }
      return;
```

</details>

**依据 2 · 源码核查**：[lib/scanner.js:261-298](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L261-L298)

过滤/大小/读取异常。

<details>
<summary>查看原文（38行）</summary>

```text
    const dot = absPath.lastIndexOf('.');
    const ext = dot > 0 ? absPath.slice(dot).toLowerCase() : '';
    if (opts.only !== null && !opts.only.has(ext)) {
      stats.filesSkipped += 1;
      return;
    }
    if (opts.skipExts.has(ext)) {
      stats.filesSkipped += 1;
      return;
    }
    if (st.size > opts.maxBytes) {
      stats.filesSkipped += 1;
      findings.push({
        file: relPath,
        line: 0,
        rule: 'skipped:too-large',
        label: `文件超过 ${Math.round(opts.maxBytes / 1024)}KB，未扫描内容`,
        severity: SEVERITY.MEDIUM,
        preview: `${Math.round(st.size / 1024)} KB`,
      });
      return;
    }

    let buf;
    try {
      buf = await readFile(absPath);
    } catch {
      stats.filesSkipped += 1;
      return;
    }
    if (looksBinary(buf)) {
      stats.filesSkipped += 1;
      return;
    }

    stats.filesScanned += 1;
    stats.bytesScanned += buf.length;
    findings.push(...scanText(buf.toString('utf8'), relPath, opts));
```

</details>

**依据 3 · 源码核查**：[lib/scanner.js:134-140](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L134-L140)

行数/行长静默跳。

```text
export function scanText(text, relPath, opts = {}) {
  const findings = [];
  const lines = text.split(/\r?\n/).slice(0, HARD_LINE_LIMIT);

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.length === 0 || line.length > 5000) continue;
```

**依据 4 · 源码核查**：[lib/scanner.js:303-328](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L303-L328)

去重计数与truncated。

<details>
<summary>查看原文（26行）</summary>

```text
  const deduped = [];
  const seen = new Set();
  for (const f of sortFindings(findings)) {
    const k = `${f.file}|${f.line}|${f.rule}|${f.preview}`;
    if (seen.has(k)) continue;
    seen.add(k);
    deduped.push(f);
  }

  const blocked = deduped.filter(
    (f) => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH,
  );

  return {
    target,
    ok: blocked.length === 0,
    findings: deduped.slice(0, opts.maxFindings),
    truncated: deduped.length > opts.maxFindings,
    counts: {
      critical: deduped.filter((f) => f.severity === SEVERITY.CRITICAL).length,
      high: deduped.filter((f) => f.severity === SEVERITY.HIGH).length,
      medium: deduped.filter((f) => f.severity === SEVERITY.MEDIUM).length,
      total: deduped.length,
    },
    stats,
  };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:169-183](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L169-L183)

round0与丢截断。

<details>
<summary>查看原文（15行）</summary>

```text
        try {
          const result = await scanPath(target, {
            entropy: args?.entropy === true,
            maxFindings: typeof args?.max_findings === 'number' && args.max_findings > 0
              ? Math.min(Math.round(args.max_findings), 2000)
              : undefined,
            only,
          });
          return {
            action: 'scan',
            ok: result.ok,
            counts: result.counts,
            findings: result.findings,
            stats: result.stats,
          };
```

</details>

**依据 6 · 源码核查**：[lib/index.js:141-149](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L141-L149)

render硬填false。

```text
          return [{
            type: 'text',
            text: summarize({
              ok: value.ok === true,
              counts: value.counts ?? { critical: 0, high: 0, medium: 0, total: 0 },
              findings: Array.isArray(value.findings) ? value.findings : [],
              stats: value.stats ?? { filesScanned: 0, filesSkipped: 0, bytesScanned: 0 },
              truncated: false,
            }),
```

#### 缺口

- 覆盖不完整/错误状态的回执契约尚未实现。
  **影响**：当前绿灯不能作为发布安全证明。
  **进一步探讨**：用假目录/合成medium先满额、缺失根与0.1参数矩阵区分complete/partial/error，再与发布清单绑定。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 低误报规则与脱敏还留下什么边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

占位符匹配是整个raw是否包含example/sample/dummy/四个x等子串，真实形状凭据若恰包含这些也会丢弃；它不验证远端有效性，critical是启发式级别而非证明活钥。同行具体命中导致所有generic都跳，独立的另一密码也可能被一起漏掉，不只去同一个泄露重复。Azure regex末尾==后接word boundary要求后字符是word，在常见结束/引号位置反而可能不匹配；Gitee上下文形状也只是一种约定。

六字符预览比回显整行克制，但路径/文件名不脱敏、前缀/长度仍是元数据，不保证完全无信息。敏感文件名提示恒写“未读取内容”，后续实际仍可能读取内容，文案容易让人误解访问范围。文件名规则loose-token-file含必需的点而只有扩展名组可选，裸token或.gh-token不一定命中，不能照README枚举推断全部覆盖。

作者smoke构造少量前缀/占位符/目录/文件名正例；其“脱敏”every条件含||true恒真，另有长度<=40断言只能限制长度，不能证明原文没有泄露。self-scan是自己规则扫自己，不是独立真值/召回测量。代码小且模块化/独立导出有利复核，性能/精确率/召回率需独立样例，不把“秒级/宁可漏”作为实测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/patterns.js:25-26](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js#L25-L26)

宽子串白名单。

```text
export const PLACEHOLDER_RE =
  /(x{4,}|y{4,}|\*{4,}|your[_-]?(api[_-]?)?(key|token|secret|password)|my[_-]?(key|token|secret)|example|sample|placeholder|dummy|fake|test[_-]?key|redacted|changeme|change[_-]?me|<[^>]{1,40}>|\$\{[^}]{1,40}\}|%[A-Z_]{1,30}%|\.{3,}|…|待填|填写|替换|\b(user(name)?|admin|root|test|foo|john|jane):(pass(word)?|pwd|secret|123456?)\b)/i;
```

**依据 2 · 源码核查**：[lib/patterns.js:32-43](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js#L32-L43)

文件名点号形状。

<details>
<summary>查看原文（12行）</summary>

```text
export const SENSITIVE_FILE_PATTERNS = [
  { id: 'dotenv', label: '.env 环境变量文件', regex: /(^|\/)\.env(\.[A-Za-z0-9_-]+)?$/ },
  { id: 'dsh-credentials', label: 'DSH 凭据文件', regex: /(^|\/)\.credentials\.ya?ml$/ },
  { id: 'loose-token-file', label: '裸 token 文件', regex: /(^|\/)(\.gh-token|\.npm-token|\.pypi-token|token|tokens)\.(txt|json|ya?ml)?$/ },
  { id: 'git-credentials', label: 'git 明文凭据', regex: /(^|\/)\.git-credentials$/ },
  { id: 'npmrc', label: 'npm 配置（可能含 _authToken）', regex: /(^|\/)\.npmrc$/ },
  { id: 'netrc', label: 'netrc 明文凭据', regex: /(^|\/)\.netrc$/ },
  { id: 'ssh-private-key', label: 'SSH 私钥', regex: /(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/ },
  { id: 'key-file', label: '私钥/证书文件', regex: /\.(pem|key|p12|pfx|jks|keystore|ppk)$/i },
  { id: 'gcloud-key', label: 'GCP 服务账号密钥', regex: /service[-_]?account[^/]*\.json$/i },
  { id: 'aws-credentials', label: 'AWS 凭据文件', regex: /(^|\/)\.aws\/credentials$/ },
  { id: 'kubeconfig', label: 'kubeconfig', regex: /(^|\/)(kubeconfig|\.kube\/config)$/ },
```

</details>

**依据 3 · 源码核查**：[lib/patterns.js:123-127](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/patterns.js#L123-L127)

Azure边界。

```text
    id: 'azure-key',
    label: 'Azure / 通用 88 位 base64 密钥',
    severity: SEVERITY.MEDIUM,
    regex: /\b[A-Za-z0-9+/]{86}==\b/g,
  },
```

**依据 4 · 源码核查**：[lib/scanner.js:146-150](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L146-L150)

同行全generic抑制。

```text
    // 先跑具体规则；这一行已经有具体命中时，泛化规则让位（同一条泄露不报两遍）
    const hits = [];
    runRules(SPECIFIC_RULES, line, relPath, i + 1, hits);
    if (hits.length === 0) runRules(GENERIC_RULES, line, relPath, i + 1, hits);
    findings.push(...hits);
```

**依据 5 · 源码核查**：[lib/scanner.js:248-258](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L248-L258)

文件名文案。

<details>
<summary>查看原文（11行）</summary>

```text
    // 敏感文件名：不管内容如何，先记一笔
    const nameHits = matchSensitiveFile(relPath);
    for (const hit of nameHits) {
      findings.push({
        file: relPath,
        line: 0,
        rule: `file:${hit.id}`,
        label: `敏感文件：${hit.label}`,
        severity: SEVERITY.HIGH,
        preview: '(文件名命中，未读取内容)',
      });
```

</details>

**依据 6 · 源码核查**：[test/smoke.mjs:81-97](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/test/smoke.mjs#L81-L97)

有限断言/恒真脱敏。

<details>
<summary>查看原文（17行）</summary>

```text
  const rules = result.findings.map((f) => f.rule);
  check('识别出 GitHub token', rules.includes('github-token'));
  check('识别出 LLM api key', rules.includes('llm-api-key'));
  check('识别出数据库连接串', rules.includes('db-connection-string'));
  check('识别出 .env 文件名', rules.some((r) => r.startsWith('file:dotenv')));
  check('占位符不误报（docs.md 无发现）', !result.findings.some((f) => f.file === 'docs.md'));
  check('跳过 node_modules', !result.findings.some((f) => f.file.includes('node_modules')));
  check('ok=false（确实有阻塞项）', result.ok === false);
  check('预览已脱敏（长度不会被完整回显）', result.findings.every((f) => !/\s/.test(f.preview) || true));
  check('规则表非空', ruleCatalog().length >= 15);

  const secretsInPreview = result.findings.filter((f) => f.preview.length > 40);
  check('预览不超过 40 字符（脱敏）', secretsInPreview.length === 0,
    secretsInPreview.map((f) => `${f.file}:${f.line}`).join(','));
} finally {
  await rm(dir, { recursive: true, force: true });
}
```

</details>

#### 缺口

- 真实分布下的召回/误报/敏感元数据泄露风险无独立标注数据。
  **影响**：不能称替代成熟扫描器或报告绝对脱敏。
  **进一步探讨**：构造假凭据/分离同行密码/白名单子串/边界文件名反例，人工标注后比较专用扫描器。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启用和三阶段成本应该怎样看？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=18与DSH tools/systemPrompt | 工具和提示 | 动态defineTool退化不保证任意宿主API可用 |
| 明确目标路径和读取权限 | 当前文本遍历 | 缺失/不可读根也可绿灯 |
| 规则/过滤/预算适合发布清单 | 发现凭据线索 | 不是历史/归档/完整发布对象扫描 |
| 人工复核与独立发布控制 | 处理发现/真实轮换 | prompt不是硬闸 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核工具注册/版本 | 不从可选peer推所有版本兼容 |
| 定义对象 | 显式路径/发布清单/权限 | 避免默认宿主cwd |
| 扫描 | 选择规则/扩展/熵 | 绿灯连同跳过/覆盖看 |
| 处理 | 脱敏报告人工复核，真实泄露轮换并清历史 | 删除工作区文本不撤销旧秘密 |
| 发布复核 | 内容变更后重新核精确对象 | 独立审批/闸，不信旧scan回执 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地包/规则与工具prompt上下文 | 定范围/过滤、对照发布清单 | 配置工时/主机费用未知 |
| 持续使用 | 文本读取/正则/内存与报告上下文 | 复核误报/漏报和规则更新 | 无独立LLM/上传API不等宿主总token0；总目录耗时未知 |
| 失败恢复 | 重扫/异常文件/发布停止资源 | 补覆盖、确认泄露后轮换与历史清理 | 真泄露恢复成本可高；工时/额度未知 |

#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少漏显式模式 | 22内容/11文件名规则 | 有静默跳过/白名单漏报 |
| 降报告原文量 | 六字符+长度而非整行 | 文件名/路径仍可敏感 |
| 接入DSH审计 | scan/rules工具 | 非自动发布拦截 |

启用熵会增加medium候选复核负担，且medium不阻ok；单文件上限/只扫类型减少资源也减少覆盖，不可当净收益。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:36-43](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/package.json#L36-L43)

Node/测试。

```text
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
```

**依据 2 · 源码核查**：[lib/index.js:79-112](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L79-L112)

工具/预算入口。

<details>
<summary>查看原文（34行）</summary>

```text
  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    const definition = defineTool({
      name: 'leak_guard',
      description: [
        '本地凭据审计：在把文件/目录发布出去（git push、发 npm、打包外发）之前，扫描里面有没有 API key、token、私钥、数据库连接串、明文密码等不该公开的秘密。',
        '不联网、不上传；发现结果脱敏（只留匹配串前 6 个字符）。',
        "action='scan'（默认）：扫描 path。返回 ok（true = 没有 critical/high 发现）、counts、findings[]、stats。",
        "action='rules'：列出全部检测规则，不需要 path。",
        'path 建议传绝对路径；不传则退回宿主进程的当前工作目录，通常不是你想要的，所以尽量显式给。',
        'entropy=true 时额外启用高熵随机串检测（只在该行含 key/token/secret 等上下文词时才报，仍可能有个别噪声）。',
        'only 可传扩展名列表（如 ".js,.md"）只扫这些类型。',
      ].join('\n'),
      timeoutMs: 60000,
      parameters: {
        action: {
          type: 'string',
          description: "One of: scan (default), rules. 'scan' 扫路径；'rules' 列出规则表。",
        },
        path: {
          type: 'string',
          description: '要扫描的目录或文件的绝对路径。强烈建议显式传（默认是宿主 cwd）。',
        },
        entropy: {
          type: 'boolean',
          description: '是否启用高熵随机串检测。默认 false。',
        },
        max_findings: {
          type: 'number',
          description: '最多返回多少条发现（默认 200）。',
        },
        only: {
          type: 'string',
          description: '只扫这些扩展名，逗号分隔，例如 ".js,.ts,.md"（默认扫全部文本文件）。',
        },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:153-183](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L153-L183)

参数/结果。

<details>
<summary>查看原文（31行）</summary>

```text
      async execute(args) {
        const action = ((args && args.action) || 'scan').trim().toLowerCase();

        if (action === 'rules') {
          return { action: 'rules', rules: ruleCatalog() };
        }

        if (action !== 'scan') {
          return { action, error: `unknown action: ${action}（支持 scan / rules）` };
        }

        const target = ((args && args.path) || '').trim() || process.cwd();
        const only = typeof args?.only === 'string' && args.only.trim() !== ''
          ? args.only.split(',').map((s) => s.trim()).filter(Boolean)
          : undefined;

        try {
          const result = await scanPath(target, {
            entropy: args?.entropy === true,
            maxFindings: typeof args?.max_findings === 'number' && args.max_findings > 0
              ? Math.min(Math.round(args.max_findings), 2000)
              : undefined,
            only,
          });
          return {
            action: 'scan',
            ok: result.ok,
            counts: result.counts,
            findings: result.findings,
            stats: result.stats,
          };
```

</details>

**依据 4 · 源码核查**：[lib/scanner.js:200-209](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L200-L209)

过滤选项。

<details>
<summary>查看原文（10行）</summary>

```text
export async function scanPath(target, options = {}) {
  const opts = {
    entropy: options.entropy === true,
    maxBytes: options.maxBytes ?? DEFAULT_MAX_BYTES,
    maxFindings: options.maxFindings ?? DEFAULT_MAX_FINDINGS,
    skipDirs: new Set([...DEFAULT_SKIP_DIRS, ...(options.skipDirs ?? [])].map((s) => s.toLowerCase())),
    skipExts: new Set(DEFAULT_SKIP_EXTS),
    only: Array.isArray(options.only) && options.only.length > 0
      ? new Set(options.only.map((e) => (e.startsWith('.') ? e.toLowerCase() : `.${e.toLowerCase()}`)))
      : null,
```

</details>

#### 缺口

- 中等项目秒级性能、误报复核工时和轮换恢复成本无可比记录。
  **影响**：不填节省金额/耗时。
  **进一步探讨**：固定合成目录规模/真值，分别记录扫描、人工复核、修复/轮换投入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 推荐结论与继续探讨入口是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察，可作为额外线索工具，不把ok=true用于自动发布。用途重要、模块/输出简单，但缺失根/中断覆盖与参数round0等可产生误导绿灯，systemPrompt反而要求绿灯后发布，需先修回执语义。保留成熟扫描与人工发布审查，报告里不放真实秘密。

由扫描对象未绑定、静默错误/限额与绿灯混同可推导“覆盖收据驱动的发布审计”。把结果拆complete/partial/error与findings severity，记录目标/规则/排除/错误/截断和内容摘要，完整且无阻塞才可进入独立发布审批；先正整数校验预算，文件/行限额必须产生覆盖状态，精确匹配范围才抑制泛化规则。

未实现。与现版对照缺失根、权限失败、medium满额后critical、0.1/NaN预算、长行/后20000行、白名单子串、扫描后变更与打包产物，固定合成非真凭据真值。反例是过度fail-closed令大仓无法工作、内容hash/日志本身暴露元数据、误报过多迫用户绕过；需显式可审查豁免而非静默跳。若仍有未扫对象显示complete、发布对象变更仍复用旧绿灯或报告泄露原值，则假设被反证。覆盖正确性/告警精度/人工负担分开量，不以发现数量多为成功。

#### 证据与依据

**依据 1 · 源码核查**：[lib/scanner.js:216-241](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L216-L241)

覆盖错误推导。

<details>
<summary>查看原文（26行）</summary>

```text
  async function walk(absPath) {
    if (findings.length >= opts.maxFindings) return;
    let st;
    try {
      st = await lstat(absPath);
    } catch {
      stats.filesSkipped += 1;
      return;
    }
    if (st.isSymbolicLink()) return; // 不跟随符号链接

    if (st.isDirectory()) {
      const name = absPath.slice(absPath.lastIndexOf(sep) + 1).toLowerCase();
      if (absPath !== base && opts.skipDirs.has(name)) return;
      stats.dirsVisited += 1;
      let entries;
      try {
        entries = await readdir(absPath);
      } catch {
        return;
      }
      for (const entry of entries) {
        if (findings.length >= opts.maxFindings) return;
        await walk(join(absPath, entry));
      }
      return;
```

</details>

**依据 2 · 源码核查**：[lib/scanner.js:312-328](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/scanner.js#L312-L328)

状态混同推导。

<details>
<summary>查看原文（17行）</summary>

```text
  const blocked = deduped.filter(
    (f) => f.severity === SEVERITY.CRITICAL || f.severity === SEVERITY.HIGH,
  );

  return {
    target,
    ok: blocked.length === 0,
    findings: deduped.slice(0, opts.maxFindings),
    truncated: deduped.length > opts.maxFindings,
    counts: {
      critical: deduped.filter((f) => f.severity === SEVERITY.CRITICAL).length,
      high: deduped.filter((f) => f.severity === SEVERITY.HIGH).length,
      medium: deduped.filter((f) => f.severity === SEVERITY.MEDIUM).length,
      total: deduped.length,
    },
    stats,
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:25-31](https://github.com/7gzgn/dsh-leak-guard/blob/8b578f80898b80acc77285f3f4c095b433dda0a4/lib/index.js#L25-L31)

发布行为风险。

```text
export const LEAK_GUARD_GUIDANCE = [
  '本机已安装 **dsh-leak-guard**（发布前凭据审计）：提供 `leak_guard` 工具，在**本地**扫描文件/目录里有没有 API key、token、私钥、数据库连接串、明文密码等不该公开的东西，发现结果**脱敏**返回（只留前 6 个字符）。',
  '**什么时候必须用**：把任何东西推到公开仓库 / 发给别人 / 上传之前 —— 尤其是 `git push`、发布 npm 包、把工作区打包外发之前。',
  '用法：`leak_guard({ action: "scan", path: "<目录或文件的绝对路径>" })`，返回 `ok=true` 才算干净；`ok=false` 时先处理 `findings` 里的 critical/high 项再发布。',
  '其它动作：`action:"rules"` 列出全部检测规则；`entropy:true` 额外启用高熵随机串检测（噪声略多，默认关闭）。',
  '它**不联网、不上传任何内容**，只读你指定的路径。',
].join('\n');
```

#### 缺口

- 完整覆盖/摘要与独立发布绑定方案未实现。
  **影响**：不是现有发布硬闸。
  **进一步探讨**：以合成真值/变更矩阵先校验状态和对象一致性，再评审批负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
