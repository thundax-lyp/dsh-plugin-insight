# dsh-fail-logger

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bce6c99](https://github.com/Areium/dsh-fail-logger/tree/bce6c992d67485475caeed00b8997704b3657d93)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/Areium/dsh-fail-logger) [![npm 30d 1,149](https://img.shields.io/static/v1?label=npm+30d&message=1%2C149&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-fail-logger) [![最新发布 2026-08-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-fail-logger)
<!-- END META -->

> **实现功能**：从 DSH 会话事件采集工具失败，去重计数后写入本地 Skill，并可注入预防和恢复提示。

> **核心亮点**：相对人工翻查会话日志，插件把明确标记的工具失败变成按原因计数和分类的本地 Skill，并可在后续步骤提供预防提示。它没有模型修复器或自动纠错保证，贡献是把运行事实组织成可复用恢复资料；规则注入的行为影响应单独评估。[Q01](#research-q01)

> **风险与缺陷**：能否可靠保存失败记录决定后续记忆价值。flush 在 writeAtomic 状态文件之前就 dirty=false，而 catch 只安排再次调用 flush，没有恢复 dirty；下一次回调可能直接被开头 guard 忽略。因此写失败不必然如注释所说保持重试，Skill 写失败时还可能出现账本已提交而文本未更新。该路径来自源码顺序，未执行故障复现。[Q02](#research-q02)

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
  - [Q01 · 哪些失败进入记忆，怎样供后续模型使用？](#detail-section-11)
  - [Q02 · 写失败是否保持重试和账本一致？](#detail-section-12)
  - [Q03 · 隐私、提示、安装和恢复的总成本是什么？](#detail-section-13)
  - [Q04 · 原子失败事件投影能否使重试更可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向反复排查工具错误的 DSH 使用者，把散落会话中的失败沉淀为后续可加载的本地记录。

简单替代为搜索原始会话日志并把复发原因手工写入 AGENTS 或 Skill。插件增加持续聚合与规则提示，但人工流程更容易避免误合并和全局上下文负担；本次没有同条件比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 跨模式失败采集 | 关联原生与代码模式的失败及参数 | 只覆盖进入日志且标 isError 的事件 |
| 分类实录 | 按原因去重、计数、趋势和 TTL 维护 | 正则归一化可能合并不同根因 |
| 本地 Skill 写入 | 给后续任务提供恢复资料 | 需目录可写，写入一致性待补证 |
| 三层预防提示 | 静态规则、高频错误与恢复入口 | 默认影响系统提示，可关闭；效果未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH session/event 与 systemPrompt | 宿主必需 | 观察失败及可选提示 | 事件结构变化会漏记；提示可配置关闭 |
| Node >=20 与可写本地目录 | 落盘必需 | 状态、锁、Skill 更新 | 权限失败需人工检查重试与一致性 |
| 模型加载 Skill 或接受系统规则 | 效果必需 | 把记录用于后续任务 | 记录存在不等于减少失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 Skill 并配置脱敏与目录 | 可写、权限和数据边界明确 |
| 加载 | 宿主加载 bundle | 激活日志和写入探测通过 |
| 记录 | 工具产生 isError 事件 | JSON 计数与 Skill 区段同步 |
| 验收 | 用户检查覆盖、脱敏和复发 | 写失败不丢失不重复，否则停用排查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有宿主和本地目录，金额未知 | 配置目录、权限与脱敏规则，时长未知 | systemPrompt 服务是声明依赖 |
| 持续使用 | 文件合并、每步提示 token 与 Skill 加载 | 检查误合并、敏感信息和恢复建议 | 不逐错误调用模型，净 token 成本未测 |
| 失败恢复 | 重试和备份空间未知 | 对账状态 JSON 与 Skill 区段，恢复备份 | dirty guard 可能中断自动重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 失败聚合 | 三类事件解析和去重计数 | 全部工具错误是否标 isError |
| 后续可见 | Skill 区段及系统提示注册 | 模型是否采纳以及是否减少复发 |
| 隐私保护 | 多类凭据正则及 Markdown 转义 | 未知密钥格式、自然语言注入和漏检率 |

> **思考**：能否可靠保存失败记录决定后续记忆价值。flush 在 writeAtomic 状态文件之前就 dirty=false，而 catch 只安排再次调用 flush，没有恢复 dirty；下一次回调可能直接被开头 guard 忽略。因此写失败不必然如注释所说保持重试，Skill 写失败时还可能出现账本已提交而文本未更新。该路径来自源码顺序，未执行故障复现。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对人工翻查会话日志，插件把明确标记的工具失败变成按原因计数和分类的本地 Skill，并可在后续步骤提供预防提示。它没有模型修复器或自动纠错保证，贡献是把运行事实组织成可复用恢复资料；规则注入的行为影响应单独评估。[Q01](#research-q01)

相对人工翻查会话日志，插件把明确标记的工具失败变成按原因计数和分类的本地 Skill，并可在后续步骤提供预防提示。它没有模型修复器或自动纠错保证，贡献是把运行事实组织成可复用恢复资料；规则注入的行为影响应单独评估。[Q01](#research-q01)

增量账本与磁盘锁合并避免简单覆盖，事件关联表有容量和时间界限，模板提示区与用户 Skill 其他部分分离，值得借鉴。写入状态与文本分两步且 dirty 提前清零削弱恢复；正则脱敏能减小风险，无法证明完整隐私或指令隔离。复用应带故障注入和投影一致性验收。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

能否可靠保存失败记录决定后续记忆价值。flush 在 writeAtomic 状态文件之前就 dirty=false，而 catch 只安排再次调用 flush，没有恢复 dirty；下一次回调可能直接被开头 guard 忽略。因此写失败不必然如注释所说保持重试，Skill 写失败时还可能出现账本已提交而文本未更新。该路径来自源码顺序，未执行故障复现。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在复制的非敏感日志上观察，关闭全局提示做基线，验证不同模式失败覆盖及文件写失败恢复。只有计数和文本一致、敏感样本被遮蔽且重复错误确有减少，再扩大试用；普通 shell 非零退出未标 isError 不在覆盖内。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

事件到本地记忆的设计有源码支持，失败恢复存在 dirty 提前清零的具体风险，减少重复错误的因果效果未验证。设计假设未实现。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/seed-body.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读固定入口的事件解析、提示注册、脱敏规则、flush 和退出处理；未全面审计所有分类正则、测试或宿主事件实现。
- 下一步：在副本目录对状态写与文本写分别注入失败，重启后核对事件数、趋势和 Skill，另测试两进程竞争；用相同任务比较关闭与开启提示的复发率、合格交付和总 token。本轮未运行。

**分析版本**

- **仓库**：[Areium/dsh-fail-logger](https://github.com/Areium/dsh-fail-logger)
- **版本号**：0.5.5（[固定提交 bce6c99](https://github.com/Areium/dsh-fail-logger/tree/bce6c992d67485475caeed00b8997704b3657d93)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可提出未验证的事件账本加可重建投影方案：先给增量稳定 ID，原子提交账本后独立生成 Skill，失败只重做投影，提交完成前保持 dirty。用状态写失败、Skill 写失败和双进程竞争注入验证，若出现丢事件、重复计数或投影不能收敛，方案即不成立；额外 ID 和恢复元数据会增加维护成本。[Q04](#research-q04)

在副本目录对状态写与文本写分别注入失败，重启后核对事件数、趋势和 Skill，另测试两进程竞争；用相同任务比较关闭与开启提示的复发率、合格交付和总 token。本轮未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 627 | 524 | 77 | — |
| .md | source | 3 | 464 | — | — | 6320 |
| .mjs | test | 1 | 756 | 678 | 55 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-24），可前往 [GitHub Issues](https://github.com/Areium/dsh-fail-logger/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：失败事件怎样转化为可信恢复记忆，写入一致性和提示边界是否支撑采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些失败进入记忆，怎样供后续模型使用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

处理器缓存 tool/call 的名称和参数，以 tool/result 的 tool-result 块 isError 为门槛，代码内嵌工具由 tool/code-dispatch 的 isError 进入同一记录链。消息归一化、脱敏后按错误类型和内容键聚合，再写入本地状态和 Skill。相对人工搜索日志，核心增量是跨会话可复用的恢复资料及高频错误提示；普通命令退出非零但未标 isError 会被跳过，进程崩溃也未必产生事件。记录能成为模型上下文，但不能证明错误率降低，规则还可能改变后续行为。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:576-609](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L576-L609)

三种事件及 isError 触发边界决定实际采集范围。

<details>
<summary>查看原文（34行）</summary>

```text
  const handle = (_session, event) => {
    try {
      if (event.type === 'tool/call') {
        const d = event.data;
        if (d && (typeof d.callId === 'string') && typeof d.name === 'string') {
          const now = Date.now();
          for (const [cid, item] of callInfo) if (now - item.at > CALL_MAP_TTL_MS) callInfo.delete(cid);
          if (callInfo.size >= CALL_MAP_CAP) callInfo.delete(callInfo.keys().next().value);
          callInfo.set(d.callId, { name: d.name, args: d.arguments, at: now });
        }
        return;
      }
      if (event.type === 'tool/result') {
        const ts = event.time;
        const m = event.data?.message;
        if (!m) return;
        const blocks = Array.isArray(m.content) ? m.content : null;
        const blk = blocks ? (blocks.find((b) => b && typeof b === 'object' && b.type === 'tool-result') ?? null) : null;
        const isError = blk ? blk.isError === true : m.isError === true;
        if (!isError) return;
        if (!blk && !warnedShape) {
          warnedShape = true;
          console.warn('[dsh-fail-logger] tool/result without a tool-result block (legacy shape) — recorded via message.isError fallback');
        }
        const callId = (blk && (blk.toolCallId || m.source?.callId)) || m.callId || m.source?.callId;
        const info = typeof callId === 'string' ? callInfo.get(callId) : undefined;
        recordToolFailure(info?.name ?? 'unknown', blk ? blk.content : m.content, { code: event.data?.error?.code, args: info?.args, ts });
        return;
      }
      if (event.type === 'tool/code-dispatch') {
        const d = event.data;
        if (!d || d.isError !== true) return;
        recordToolFailure(d.name ?? 'unknown', d.content, { args: d.arguments, ts: event.time });
      }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:131-151](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L131-L151)

预防、高频错误和恢复提示是主动系统提示贡献，超出纯旁观记录。

<details>
<summary>查看原文（21行）</summary>

```text
  if (config.injectInstructions !== false && ctx.systemPrompt && ctx.effect) {
    ctx.effect(() => {
      ctx.systemPrompt.section({
        name: 'fail-logger:prevention',
        order: 90,
        text: PREVENTION_TEXT,
      });
      if (TOP_ERRORS_MAX > 0) {
        ctx.systemPrompt.section({
          name: 'fail-logger:top-errors',
          order: 185,
          text: () => topSummary,
        });
      }
      ctx.systemPrompt.section({
        name: 'fail-logger:recovery',
        order: 190,
        text: RECOVERY_TEXT,
      });
    }, 'dsh-fail-logger.instructions');
  }
```

</details>

#### 缺口

- 真实宿主各工具的错误标记覆盖与失败减少效果未知。
  **影响**：不能宣称全失败覆盖或越用越少错。
  **进一步探讨**：对同批工具错误检查事件并比较提示开关后的复发。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 写失败是否保持重试和账本一致？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

flush 开头在 dirty 为假时返回，写状态前却先 dirty=false；如果状态写入或 Skill 更新抛错，catch 仅安排两秒后再调用 flush，没有把 dirty 改回 true，回调可能立即返回。这和注释的保持 dirty 重试不一致。两份文件之间也不是共同事务，状态成功而 Skill 失败会造成文本滞后。锁内读盘合并和成功后清空本进程增量是合理设计，但失败路径应先证明重试不会漏记或重放。这里是可定位的控制流问题，尚无执行故障记录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:457-465](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L457-L465)

dirty guard 是重试能否执行的必要条件。

```text
  const flush = () => {
    if (!dirty || !memState) return;
    if (!acquireLock()) {
      // 锁被其他进程持有：保留 dirty，稍后重试（不丢计数）
      timer = setTimeout(() => { timer = null; flush(); }, 500);
      return;
    }
    try {
      const disk = loadDiskState();
```

**依据 2 · 源码核查**：[lib/index.js:499-514](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L499-L514)

dirty 在写入前清零，catch 没恢复，状态和文本分开写入。

<details>
<summary>查看原文（16行）</summary>

```text
      for (const [k, v] of Object.entries(merged.entries)) out.entries[k] = (() => { const { key: _k, ...rest } = v; return rest; })();
      dirty = false;
      writeAtomic(STATE_FILE, JSON.stringify(out, null, 2));
      lastWrittenTotal = typeof out.totalEvents === 'number' ? out.totalEvents : lastWrittenTotal;
      writeSection(renderSection(merged));
      // 会话内冻结:二级(top-errors)只取启动快照(loadDiskState),会话中不再重渲染——新会话启动时自动读盘更新
      if (TOP_ERRORS_MAX > 0 && TOP_ERRORS_REFRESH === 'flush') topSummary = renderTopErrors(merged);
      // 关键：落盘成功后 memState 归零（纯增量账本）
      memState = { entries: {}, days: {} };
    } catch (e) {
      // 写失败：保持 dirty，并调度重试
      console.error('[dsh-fail-logger] flush failed (will retry):', e?.message ?? e);
      timer = setTimeout(() => { timer = null; flush(); }, 2000);
    } finally {
      releaseLock();
    }
```

</details>

#### 缺口

- 各写失败位置的实际丢失与重复表现未复现。
  **影响**：不能给出故障发生率或断言每次都会丢数据。
  **进一步探讨**：分别令 JSON 与 Skill 写失败，观察重试、下一次事件与重启对账。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 隐私、提示、安装和恢复的总成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

插件默认落盘到宿主技能目录，记录经过凭据模式遮蔽和 Markdown 转义，消息原文仍可能包含未匹配的路径或秘密。系统提示静态规则及高频错误会增加每步上下文，并可能影响正常任务，关闭 injectInstructions 可评估记录链的独立价值。首次成本为目录权限、备份和规则调整，持续成本为文件写入、上下文和人工复核，恢复成本为核对 JSON 与 Skill 两份投影；金额和时间未实测。当前应先观察和修复写失败路径，再用非敏感副本对照验证收益，不能只因不调用额外模型就称零成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:99-124](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L99-L124)

默认路径、配置和可扩展脱敏规则说明采用条件。

<details>
<summary>查看原文（26行）</summary>

```text
export function apply(ctx, config = {}) {
  const DSH_HOME = process.env.DSH_HOME || join(os.homedir(), '.dsh');
  const LOG_DIR = expandHome(process.env.FAIL_LOG_DIR || process.env.PTC_FAIL_LOG_DIR || config.logDir || join(DSH_HOME, 'skills', 'fail-log-guide'));
  const SKILL_FILE = join(LOG_DIR, 'SKILL.md');
  const STATE_FILE = join(LOG_DIR, '.failures.json');
  const LOCK_FILE = STATE_FILE + '.lock';
  const MAX_ENTRIES = Math.max(1, Math.floor(Number(config.maxEntries) || 10));
  const MAX_MSG = Math.max(1, Math.floor(Number(config.maxMsg) || 200));
  const MARKER = typeof config.marker === 'string' && MARKER_RE.test(config.marker) ? config.marker : 'FAIL-LOG';
  const FLUSH_MS = Math.max(0, Number(config.flushMs) || 300);
  const TTL_DAYS = Math.max(0, Math.floor(Number(config.ttlDays) || 30));
  const TOP_ERRORS_MAX = config.topErrors === false ? 0 : (Number.isFinite(Number(config.topErrors)) ? Math.max(0, Math.floor(Number(config.topErrors))) : 3);
  // 二级(top-errors)刷新模式:'session'=启动快照后会话内冻结(默认,避免 system prompt 中段变化击穿 LLM 前缀缓存),新会话/重启时自动读盘更新;'flush'=每次落盘后刷新(旧行为)
  const TOP_ERRORS_REFRESH = config.topErrorsRefresh === 'flush' ? 'flush' : 'session';
  const BEGIN_MARK = '<!-- ' + MARKER + ':BEGIN -->';
  const END_MARK = '<!-- ' + MARKER + ':END -->';
  const SECTION_RE = new RegExp(escapeRe(BEGIN_MARK) + '[\\s\\S]*?' + escapeRe(END_MARK), 'g');
  const REDACT = [...REDACT_DEFAULT];
  const IGNORE = [];
  (Array.isArray(config.ignore) ? config.ignore : []).forEach((re, i) => {
    try { IGNORE.push(new RegExp(re, 'i')); }
    catch (e) { console.warn('[dsh-fail-logger] ignore[' + i + '] is not a valid regex and was skipped: ' + (e?.message ?? e)); }
  });
  (Array.isArray(config.redact) ? config.redact : []).forEach((re, i) => {
    try { REDACT.push([new RegExp(re, 'g'), '***']); }
    catch (e) { console.warn('[dsh-fail-logger] redact[' + i + '] is not a valid regex and was skipped: ' + (e?.message ?? e)); }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:179-196](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L179-L196)

指令模式过滤与转义是有限防护，不能证明全覆盖。

<details>
<summary>查看原文（18行）</summary>

```text
  const redact = (s) => { for (const [re, rep] of REDACT) s = s.replace(re, rep); return s; };
  // Markdown 消毒：剥控制字符、转义表格竖线与行首 #
  // 指令注入防御（语义消毒）：结构化标签 + 常见祈使句 → [redacted]；剩余尖括号实体转义兜底
  const INSTRUCTION_PATTERNS = [
    [/<\s*system-reminder[\s\S]*?<\s*\/\s*system-reminder\s*>/gi, '[redacted]'],
    [/<\s*skill_content[\s\S]*?<\s*\/\s*skill_content\s*>/gi, '[redacted]'],
    [/<\s*available_skills[\s\S]*?<\s*\/\s*available_skills\s*>/gi, '[redacted]'],
    [/ignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?/gi, '[redacted]'],
    [/忽略(?:之前|以上|前面).{0,12}(?:指令|指示|要求)/gi, '[redacted]'],
    [/现在(?:立刻|马上|立即)?(?:执行|运行|下载|删除)/gi, '[redacted]'],
    [/先(?:立刻|马上|立即)?(?:执行|运行|下载|删除)/gi, '[redacted]'],
    [/disregard\s+(?:all\s+)?(?:previous|prior)\s+instructions?/gi, '[redacted]'],
    [/do\s+not\s+follow\s+(?:the\s+)?(?:instructions?|rules?)\s+above/gi, '[redacted]'],
  ];
  const stripInstructions = (s) => { for (const [re, rep] of INSTRUCTION_PATTERNS) s = s.replace(re, rep); return s; };
  const mdSafe = (s) => stripInstructions(redact(String(s).replace(/[\x00-\x1f\x7f]/g, ' ')))
    .replace(/\|/g, '\\|').replace(/^#/gm, '\\#').replace(/`/g, '\\`')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
```

</details>

#### 缺口

- 敏感格式漏检和提示净收益无同条件数据。
  **影响**：不适合直接把敏感日志广泛纳入提示。
  **进一步探讨**：先用合成敏感样本及固定任务集检查泄漏、复发和 token。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 原子失败事件投影能否使重试更可靠？

**研究主题**：新假设与验证

#### 完整回答

现版把增量合并、状态提交和 Skill 文本更新放在一次 flush，但只有单文件原子性。可推导未验证设计，让失败事件先带稳定 ID 提交到权威账本，Skill 作为可重建投影，投影失败不再重加增量；dirty 只在对应阶段成功后清零。新增元数据和磁盘开销必须计入。最小验证覆盖提交前崩溃、提交后投影失败、竞争与重启，要求每个事件只计一次且文本最终收敛。若仍需人工猜测哪个阶段成功或同事件重复计数，则该设计未满足目标。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:499-511](https://github.com/Areium/dsh-fail-logger/blob/bce6c992d67485475caeed00b8997704b3657d93/lib/index.js#L499-L511)

顺序写两个文件是设计假设的直接推导依据，非已经实现的事务。

<details>
<summary>查看原文（13行）</summary>

```text
      for (const [k, v] of Object.entries(merged.entries)) out.entries[k] = (() => { const { key: _k, ...rest } = v; return rest; })();
      dirty = false;
      writeAtomic(STATE_FILE, JSON.stringify(out, null, 2));
      lastWrittenTotal = typeof out.totalEvents === 'number' ? out.totalEvents : lastWrittenTotal;
      writeSection(renderSection(merged));
      // 会话内冻结:二级(top-errors)只取启动快照(loadDiskState),会话中不再重渲染——新会话启动时自动读盘更新
      if (TOP_ERRORS_MAX > 0 && TOP_ERRORS_REFRESH === 'flush') topSummary = renderTopErrors(merged);
      // 关键：落盘成功后 memState 归零（纯增量账本）
      memState = { entries: {}, days: {} };
    } catch (e) {
      // 写失败：保持 dirty，并调度重试
      console.error('[dsh-fail-logger] flush failed (will retry):', e?.message ?? e);
      timer = setTimeout(() => { timer = null; flush(); }, 2000);
```

</details>

#### 缺口

- 事件唯一 ID 可用性及额外存储成本未知。
  **影响**：幂等方案可能需要宿主配合。
  **进一步探讨**：先设计可重放事件标识与故障注入原型再测资源和恢复。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
