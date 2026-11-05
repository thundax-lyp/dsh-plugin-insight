# dsh-plugin-task-forge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8eb92c3](https://github.com/121212165/dsh-plugin-task-forge/tree/8eb92c35cd8be927150aabb88f8de5c18d547958)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/121212165/dsh-plugin-task-forge)
<!-- END META -->

> **功能**：在 DSH 将需求编成任务书，支持跨窗口交接、版本回读、缺口和台账。

> **亮点**：[Q01](#research-q01) 将交接包和版本回读纳入同一工作流。

> **主要限制**：[Q02](#research-q02) 结构 READY 不能证明理解，多文件状态仍可部分更新。

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
  - [Q01 · 任务书怎样交接并回读？](#detail-section-11)
  - [Q02 · READY 和落盘能保证什么？](#detail-section-12)
  - [Q03 · 如何试用与退出？](#detail-section-13)
  - [Q04 · 怎样减少结构正确的误放行？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在多个 Agent 窗口交接同一开发任务的操作者。

复制需求和 Markdown 说明，在各窗口手工跟踪变更。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务书 | 保存并交接需求 | 按版本和窗口追踪 |
| 回读 | 记录理解声明与缺口 | 人工核对语义 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 和 pnpm | 安装必需 | 挂载命令和工具 | 改手工交接 |
| 可写任务目录 | 必需 | 保存版本及台账 | 停止导出 |
| quota 历史 | 可选 | 提供预算观测 | 按文字启发式估算 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 编写 | 操作者用合成需求建立任务书 | 核对验收条件 |
| 发送 | 操作者导出并粘贴 | 核对目标和版本 |
| 回读 | 接收方复述，操作者登记 | 缺条件时补答并重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型和磁盘费用未知 | 配置与检查 patch | 未实测 |
| 持续 | 编译和回读 token | 维护版本及缺口 | 估算不等于结算 |
| 恢复 | 重复编译资源未知 | 检查任务、事件和文件 | 防部分写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 交接 | 导出自包含文件 | 真实理解率 |
| 台账 | 记录版本与窗口 | 跨进程一致性 |

> **思考**：[Q02](#research-q02) 结构 READY 不能证明理解，多文件状态仍可部分更新。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将交接包和版本回读纳入同一工作流。

[Q02](#research-q02) 原子替换限单文件，不能覆盖多文件步骤。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 结构 READY 不能证明理解，多文件状态仍可部分更新。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从临时目录试用。[Q02](#research-q02) READY 后继续检查验收条目与文件。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核对固定命令和写入机制，未验证真实跨窗任务。

- 已检查：作者 README、包清单、源码路径 README.md、src/handshake.ts、src/plugin.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件的命令、回读和文件机制，未运行目标代码。
- 下一步：对照新版、旧版、缺口和导出故障。

**分析版本**

- **仓库**：[121212165/dsh-plugin-task-forge](https://github.com/121212165/dsh-plugin-task-forge)
- **版本号**：0.2.0（[固定提交 8eb92c3](https://github.com/121212165/dsh-plugin-task-forge/tree/8eb92c35cd8be927150aabb88f8de5c18d547958)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用验收项 ID 的缺失提示减少错误放行。

对照新版、旧版、缺口和导出故障。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1633 | 1461 | 174 | — |
| .md | source | 1 | 138 | — | — | 2634 |
| .ts | source | 8 | 1874 | 1533 | 195 | — |
| .ts | test | 9 | 1931 | 1590 | 100 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+created%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/121212165/dsh-plugin-task-forge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A43%3A55.370Z..2026-11-05T02%3A43%3A55.370Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：跨窗口任务书怎样交接、确认和更新？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务书怎样交接并回读？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

使用多个 AI 窗口做同一任务的操作者原本需要复制目标、约束、验收条件和后续改动。relay 把当前任务书渲染为文件并记录目标，IDE 目标另写一份本地引用；普通目标仍由操作者粘贴。接收方按模板复述，操作者把回读贴回 ack。当前版本且无待补信息可记为 ready；缺口进入任务书，answer 写入决策并提醒重发版本。贡献是可追踪的交接记录和版本闭环。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-89](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/README.md#L65-L89)

协议、文件和注入说明

<details>
<summary>查看原文（25行）</summary>

````text
## 回读握手协议（无损的全部保障）

每份任务书尾部固定携带握手指令，要求接收方在开工前输出：

```
version: <它读到的版本号>
【回读】用自己的话复述目标、约束、验收标准（逐条对应编号）
【缺口】发现的信息不足或矛盾，逐条编号；没有写"无"
STATUS: READY 或 STATUS: NEED-INPUT
```

- 回读**结构不完整**（缺 STATUS / 缺 version / 缺复述）→ `/ack` 直接判无效并给出补救话术；
- version 和最新版不一致 → 按旧版处理并警告，需要重发新版；
- 缺口逐条 `/answer` 后版本 +1，**所有交接引用必须带 `id@version`**——版本号是跨窗口唯一权威。

## 数据落盘

```
~/.dsh/task-forge/
├── tasks/<id>/task.md      # 任务书本体（frontmatter + 六段正文 + 握手指令）
├── outbox/<id>-v<n>.md     # 交接包导出
└── ledger.jsonl            # 握手台账（每次 created/revised/relayed/acked/… 一行）
```

进行中任务（非 done）按 limit/maxChars 预算注入每个会话的系统提示（`## 进行中任务（task-forge）`），新窗口一开就知道有哪些任务在飞。
````

</details>

**依据 2 · 源码核查**：[src/plugin.ts:380-418](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L380-L418)

实际导出与 IDE 分支

<details>
<summary>查看原文（39行）</summary>

```text
  ctx.commands.register({
    name: 'relay',
    description: '导出任务书交接包（自包含单文件，含握手指令）：/relay <id> [--to <窗口名>|ide:<工具名>]',
    input: { hint: '<id> [--to <窗口名>|ide:zcode]' },
    handler: ({ rawInput }) => {
      const raw = String(rawInput ?? '');
      const found = taskById(raw);
      if ('error' in found) return { kind: 'error', text: `没有任务书 ${found.error || '(空)'}。/forge-list 先看台账。` };
      const toMatch = /\s--to\s+(\S+)/.exec(raw);
      const requested = toMatch ? parseIdeTarget(toMatch[1]) : null;
      const ide = requested === null ? null : ideTargetFor(requested);
      if (requested !== null && ide === null) {
        return { kind: 'error', text: `不认识 ide:${requested}。可派发：${IDE_TARGETS.map((target) => `ide:${target.tool}`).join(' / ')}。不带 ide: 前缀就按普通窗口名处理（把文件贴给那个窗口）。` };
      }
      const target = requested !== null ? `ide:${requested}` : (toMatch?.[1] ?? '未命名窗口');
      const task = store.loadTask(found.id)!;
      const now = new Date().toISOString();
      task.targets = withTarget(task.targets, target);
      task.status = 'relayed';
      task.updatedAt = now;
      store.saveTask(task);
      store.appendEvent({ ts: now, task: task.id, event: 'relayed', version: task.version, status: task.status, title: task.title, target });
      const dest = store.outboxPath(outboxName(task));
      const markdown = renderTaskMarkdown(task);
      writeAtomic(dest, markdown);
      const lines = [`交接包已导出：${dest}`];
      if (ide) {
        const ref = resolve(hubReferencePath(task, config.hubPath));
        writeAtomic(ref, markdown);
        lines.push(renderIdeRelayNote(ide, ref));
      } else {
        lines.push(`把该文件全文粘贴给「${target}」窗口的 AI。对方必须按文内握手指令先回读（复述+缺口+STATUS），STATUS: READY 之前不会开工。`);
      }
      lines.push(`收到回读后：/ack ${task.id}${toMatch ? ` --to ${target}` : ''} <粘贴回读内容>`);
      const summary = quotaSummary();
      lines.push(renderCostLine(estimateTaskCost({ text: markdown, windows: task.targets.length, steps: quotaHistory() }), costPrice(summary)));
      const warning = budgetWarningLine(summary);
      if (warning) lines.push(warning);
      return { kind: 'success', text: lines.join('\n') };
```

</details>

**依据 3 · 源码核查**：[src/plugin.ts:422-456](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L422-L456)

ACK 判定及记录

<details>
<summary>查看原文（35行）</summary>

```text
  ctx.commands.register({
    name: 'ack',
    description: '登记接收方的回读：/ack <id> [--to <窗口名>] <回读全文>（READY 放行 / NEED-INPUT 落成缺口）',
    input: { hint: '<id> [--to <窗口名>] <回读全文>' },
    handler: ({ rawInput }) => {
      const input = String(rawInput ?? '').trim();
      const found = taskById(input);
      if ('error' in found) return { kind: 'error', text: `用法：/ack <id> [--to <窗口名>] <回读全文>。没有任务书 ${found.error || '(空)'}。` };
      const task = store.loadTask(found.id)!;
      const toMatch = /\s--to\s+(\S+)/.exec(input);
      // One holder needs no flag; several windows must say which one read back,
      // otherwise the per-window ledger would credit the wrong window.
      const target = toMatch?.[1] ?? (task.targets.length === 1 ? task.targets[0]!.name : null);
      const content = input.trim().slice(found.tokenLen).replace(/\s--to\s+\S+/, '').trim();
      const hs = parseHandshake(content);
      if (!hs.ok) return { kind: 'error', text: renderAckReply(hs, task, target ?? '对方') };
      const now = new Date().toISOString();
      const wantsInput = needsSenderInput(hs);
      const passing = !wantsInput && !isStaleVersion(hs, task.version);
      if (target && !wantsInput) task.targets = withTargetAcked(task.targets, target, hs.version!, now);
      const qids = wantsInput ? nextGapQids(task, hs.gaps.length) : [];
      if (qids.length) task.open = [task.open.trim(), ...hs.gaps.map((gap, index) => `${qids[index]} (来自对方回读): ${gap}`)].filter(Boolean).join('\n');
      if (passing) task.status = 'ready';
      task.updatedAt = now;
      store.saveTask(task);
      // 日志里的 version 永远记任务书当前的真实版本——foldStates 是后写者
      // 胜，把对方声称的旧版本号追加成最后一行会让台账版本倒退；旧版本
      // 只留在 note 里供排查。
      store.appendEvent({
        ts: now,
        task: task.id,
        event: 'acked',
        version: task.version,
        status: passing ? 'ready' : task.status,
        title: task.title,
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:470-498](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L470-L498)

回答与重发指引

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.commands.register({
    name: 'answer',
    description: '回答任务书的开放缺口（版本 +1）：/answer <id> <Q编号> <答案>',
    input: { hint: '<id> <Q编号> <答案>' },
    handler: ({ rawInput }) => {
      const input = String(rawInput ?? '').trim();
      const found = taskById(input);
      if ('error' in found) return { kind: 'error', text: `用法：/answer <id> <Q编号> <答案>。没有任务书 ${found.error || '(空)'}。` };
      const task = store.loadTask(found.id)!;
      const rest = input.trim().slice(found.tokenLen).trim();
      const [qid, ...answerParts] = rest.split(/\s+/);
      const answer = answerParts.join(' ').trim();
      if (!qid || !answer) return { kind: 'error', text: `用法：/answer ${task.id} <Q编号> <答案>。缺口编号见 /forge-list 或上次 /ack 输出。` };
      const result = applyAnswer(task, qid, answer);
      if (result.kind === 'missing') return { kind: 'error', text: `${task.id} 的开放缺口里没有 ${qid}。当前缺口：\n${task.open || '（无）'}` };
      store.saveTask(result.task);
      store.appendEvent({
        ts: new Date().toISOString(),
        task: result.task.id,
        event: 'gap-resolved',
        version: result.task.version,
        status: result.task.status,
        title: result.task.title,
        note: `${result.qid} → ${result.decisionId}`,
      });
      const targets = targetNames(result.task.targets).join(' 和 ') || '还没有窗口交接过';
      const base = `${result.qid} 已答并写入 ${result.decisionId}，任务书现在是 ${result.task.id}@v${result.task.version}。已交接窗口：${targets}——需要把新版重新 /relay 给它们，让对方按新版重新回读。`;
      const remaining = remainingGapIds(result.task.open);
      if (result.task.phase !== 'awaiting-answers') return { kind: 'success', text: base };
```

</details>

#### 缺口

- 未使用真实多窗口或 IDE 接收者
  **影响**：无法确定交接理解与返工率
  **进一步探讨**：以同一任务比较手工复制和版本任务书

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · READY 和落盘能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

握手解析检查状态、版本和非空复述，并对仍有缺口的 READY 作降级。内容是否完整仍靠操作者，外部窗口执行不受台账事务约束。ACK 在 passing 前可对无缺口且有目标的旧版本记回读版本，任务 ready 仍要求当前版。单文件通过临时文件改名保存。relay 先修改任务并追加事件，再写交接包或 IDE 副本，后续写失败可能留下已交接记录。所见路径没有跨文件事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/handshake.ts:53-96](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/handshake.ts#L53-L96)

解析、待补与版本判据

<details>
<summary>查看原文（44行）</summary>

```text
export function parseHandshake(input: string): Handshake {
  const text = String(input ?? '');
  const issues: string[] = [];

  const statusMatch = lastMatch(STATUS_RE, text);
  const status = (statusMatch ? (statusMatch[1]!.toUpperCase().startsWith('READY') ? 'ready' : 'need-input') : null) as HandshakeStatus | null;
  if (!statusMatch) issues.push('缺少 STATUS 行（READY / NEED-INPUT）——没有明确放行，不能当握手通过');

  const versionMatch = lastMatch(VERSION_RE, text);
  const version = versionMatch ? Number.parseInt(versionMatch[1]!, 10) : null;
  if (version === null) issues.push('缺少 version 确认（接收方必须注明它读到的是哪一版）');

  const restatement = sectionAfter(text, MARKERS.restatement);
  if (!restatement) issues.push('缺少【回读】段——没有复述理解就不算确认');

  const rawGaps = sectionAfter(text, MARKERS.gaps);
  const gaps: string[] = [];
  if (!rawGaps) {
    issues.push('缺少【缺口】段');
  } else {
    for (const line of rawGaps.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean) continue;
      if (/^(无|none|没有)$/i.test(clean)) break;
      if (CHROME_RE.test(clean)) continue;
      const numbered = NUMBERED_RE.exec(clean);
      const body = (numbered ? numbered[2]! : clean.replace(/^[-*]\s*/, '')).replace(/\*\*/g, '').replace(/^[\s#]+|[\s]+$/g, '');
      if (!body || CHROME_RE.test(body)) continue;
      gaps.push(body);
    }
  }

  return { ok: status !== null && restatement !== '' && version !== null, status, version, restatement, gaps, issues };
}

/** A receiver that stamps READY while still listing questions has answered them on
 * the sender's behalf. That is not a green light — see the STATUS rule in HANDSHAKE_TEXT. */
export function needsSenderInput(hs: Handshake): boolean {
  return hs.gaps.length > 0 && (hs.status === 'need-input' || hs.status === 'ready');
}

export function isStaleVersion(hs: Handshake, current: number): boolean {
  return hs.version !== null && hs.version !== current;
}
```

</details>

**依据 2 · 源码核查**：[src/plugin.ts:80-85](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L80-L85)

单文件替换

```text
export function writeAtomic(dest: string, content: string): void {
  mkdirSync(dirname(dest), { recursive: true });
  const tmp = `${dest}.${process.pid}.tmp`;
  writeFileSync(tmp, content, 'utf8');
  renameSync(tmp, dest);
}
```

**依据 3 · 源码核查**：[src/plugin.ts:394-409](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L394-L409)

多文件写入先后

<details>
<summary>查看原文（16行）</summary>

```text
      const target = requested !== null ? `ide:${requested}` : (toMatch?.[1] ?? '未命名窗口');
      const task = store.loadTask(found.id)!;
      const now = new Date().toISOString();
      task.targets = withTarget(task.targets, target);
      task.status = 'relayed';
      task.updatedAt = now;
      store.saveTask(task);
      store.appendEvent({ ts: now, task: task.id, event: 'relayed', version: task.version, status: task.status, title: task.title, target });
      const dest = store.outboxPath(outboxName(task));
      const markdown = renderTaskMarkdown(task);
      writeAtomic(dest, markdown);
      const lines = [`交接包已导出：${dest}`];
      if (ide) {
        const ref = resolve(hubReferencePath(task, config.hubPath));
        writeAtomic(ref, markdown);
        lines.push(renderIdeRelayNote(ide, ref));
```

</details>

**依据 4 · 源码核查**：[src/plugin.ts:435-456](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L435-L456)

当前版本和按目标记录

<details>
<summary>查看原文（22行）</summary>

```text
      const content = input.trim().slice(found.tokenLen).replace(/\s--to\s+\S+/, '').trim();
      const hs = parseHandshake(content);
      if (!hs.ok) return { kind: 'error', text: renderAckReply(hs, task, target ?? '对方') };
      const now = new Date().toISOString();
      const wantsInput = needsSenderInput(hs);
      const passing = !wantsInput && !isStaleVersion(hs, task.version);
      if (target && !wantsInput) task.targets = withTargetAcked(task.targets, target, hs.version!, now);
      const qids = wantsInput ? nextGapQids(task, hs.gaps.length) : [];
      if (qids.length) task.open = [task.open.trim(), ...hs.gaps.map((gap, index) => `${qids[index]} (来自对方回读): ${gap}`)].filter(Boolean).join('\n');
      if (passing) task.status = 'ready';
      task.updatedAt = now;
      store.saveTask(task);
      // 日志里的 version 永远记任务书当前的真实版本——foldStates 是后写者
      // 胜，把对方声称的旧版本号追加成最后一行会让台账版本倒退；旧版本
      // 只留在 note 里供排查。
      store.appendEvent({
        ts: now,
        task: task.id,
        event: 'acked',
        version: task.version,
        status: passing ? 'ready' : task.status,
        title: task.title,
```

</details>

#### 缺口

- 未模拟并发或磁盘写入失败
  **影响**：无法确定多进程和重试后一致性
  **进一步探讨**：在临时目录注入 outbox 写失败并核对任务与台账

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者报告 0.1.7-alpha.1 环境，Git 安装涉及 prepare 构建及合并 patch。建议用独立 profile 和合成需求验证。默认任务书、outbox 和事件日志单独落盘，IDE 模式还可在项目写副本。持续成本包括任务书编译和每个窗口回读，预算依赖 quota 历史或启发式，不能当结算。退出时从测试 profile 移除并按用途处理台账与 IDE 副本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:28-42](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/README.md#L28-L42)

安装及作者验证范围

<details>
<summary>查看原文（15行）</summary>

````text
## 安装

三步，实测于 `@deepseek-ai/dsh@0.1.7-alpha.1`（需 `pnpm` 在 PATH 上）：

```sh
# ① 装进 profile：dsh plugin 把参数原样转发给 pnpm，git 包会自动跑 prepare 构建 lib/
dsh plugin --profile web add github:121212165/dsh-plugin-task-forge
```

② 把本仓库根目录 `cordis.patch.yml` 的内容**并进** `$DSH_HOME/profiles/web/cordis.patch.yml`。
该文件默认是 `[]`，所以要么整份替换，要么把 insert 条目并进同一个数组；**不要直接追加**——
追加会形成两个 YAML 文档，启动即报
`failed to parse overlay ... end of the stream or a document separator is expected`（本机实测踩过）。

③ 重启 dsh。配置层与 client 半都要重启才生效（客户端按 boot 时算出的内容 rev 下发，硬刷新浏览器没用）。
````

</details>

**依据 2 · 作者声明**：[README.md:80-103](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/README.md#L80-L103)

数据范围、预算和路径

<details>
<summary>查看原文（24行）</summary>

````text
## 数据落盘

```
~/.dsh/task-forge/
├── tasks/<id>/task.md      # 任务书本体（frontmatter + 六段正文 + 握手指令）
├── outbox/<id>-v<n>.md     # 交接包导出
└── ledger.jsonl            # 握手台账（每次 created/revised/relayed/acked/… 一行）
```

进行中任务（非 done）按 limit/maxChars 预算注入每个会话的系统提示（`## 进行中任务（task-forge）`），新窗口一开就知道有哪些任务在飞。

## 配置

| 字段 | 默认 | 作用 |
|---|---|---|
| `enabled` | `true` | 关掉后 apply 直接返回，不注册任何命令/工具/注入 |
| `dataPath` | `~/.dsh/task-forge` | 任务书本体、交接包与台账的根目录；支持 `~` 前缀 |
| `hubPath` | `.hub` | `--to ide:<工具名>` 那份项目内副本的目录，相对当前工作目录解析（写绝对路径也可以） |
| `quotaSummaryPath` | `~/.dsh/quota/summary.json` | quota 发布的预算契约文件；读不到就当没装 quota，不警告也不报错。支持 `~` 前缀 |
| `quotaHistoryPath` | `~/.dsh/quota/history.json` | quota 的每步用量历史（`{sessionId: [{input,output,cacheRead}]}`），**单任务预估**的观测基数；读不到就退回按字数的启发式并在输出里明说 |
| `limit` / `maxChars` | `8` / `900` | 注入段的条数与字符预算；超限的行截断而不是丢弃最新任务 |
| `order` | `690` | 注入段在系统提示里的排序位置 |

`limit`、`maxChars`、`order`、`hubPath`、`quotaHistoryPath` 都走启动自检：填错**启动即失败并点名 task-forge**，不会带着一个不可用的台账静默运行。
````

</details>

**依据 3 · 源码核查**：[src/plugin.ts:402-417](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/plugin.ts#L402-L417)

副本与预算输出

<details>
<summary>查看原文（16行）</summary>

```text
      const dest = store.outboxPath(outboxName(task));
      const markdown = renderTaskMarkdown(task);
      writeAtomic(dest, markdown);
      const lines = [`交接包已导出：${dest}`];
      if (ide) {
        const ref = resolve(hubReferencePath(task, config.hubPath));
        writeAtomic(ref, markdown);
        lines.push(renderIdeRelayNote(ide, ref));
      } else {
        lines.push(`把该文件全文粘贴给「${target}」窗口的 AI。对方必须按文内握手指令先回读（复述+缺口+STATUS），STATUS: READY 之前不会开工。`);
      }
      lines.push(`收到回读后：/ack ${task.id}${toMatch ? ` --to ${target}` : ''} <粘贴回读内容>`);
      const summary = quotaSummary();
      lines.push(renderCostLine(estimateTaskCost({ text: markdown, windows: task.targets.length, steps: quotaHistory() }), costPrice(summary)));
      const warning = budgetWarningLine(summary);
      if (warning) lines.push(warning);
```

</details>

#### 缺口

- 未测量模型费用、数据残留或挂载时间
  **影响**：无法给出部署与交接净收益
  **进一步探讨**：验证工作区写入、禁用和手工流程切回

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少结构正确的误放行？

**研究主题**：新假设与验证

#### 完整回答

在已有非空复述和版本比对上，可要求回读逐条列出任务书验收项 ID，并只提示缺少的编号，让操作者核对语义而不自动放行。用正确、漏条件、旧版和自称 READY 四类回读对照，测错误接受及额外审核时间。若不减少漏验收或造成正常回读阻塞，则撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-78](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/README.md#L65-L78)

现有逐条对应文字要求

<details>
<summary>查看原文（14行）</summary>

````text
## 回读握手协议（无损的全部保障）

每份任务书尾部固定携带握手指令，要求接收方在开工前输出：

```
version: <它读到的版本号>
【回读】用自己的话复述目标、约束、验收标准（逐条对应编号）
【缺口】发现的信息不足或矛盾，逐条编号；没有写"无"
STATUS: READY 或 STATUS: NEED-INPUT
```

- 回读**结构不完整**（缺 STATUS / 缺 version / 缺复述）→ `/ack` 直接判无效并给出补救话术；
- version 和最新版不一致 → 按旧版处理并警告，需要重发新版；
- 缺口逐条 `/answer` 后版本 +1，**所有交接引用必须带 `id@version`**——版本号是跨窗口唯一权威。
````

</details>

**依据 2 · 源码核查**：[src/handshake.ts:53-96](https://github.com/121212165/dsh-plugin-task-forge/blob/8eb92c35cd8be927150aabb88f8de5c18d547958/src/handshake.ts#L53-L96)

结构判定未逐条比对 ID

<details>
<summary>查看原文（44行）</summary>

```text
export function parseHandshake(input: string): Handshake {
  const text = String(input ?? '');
  const issues: string[] = [];

  const statusMatch = lastMatch(STATUS_RE, text);
  const status = (statusMatch ? (statusMatch[1]!.toUpperCase().startsWith('READY') ? 'ready' : 'need-input') : null) as HandshakeStatus | null;
  if (!statusMatch) issues.push('缺少 STATUS 行（READY / NEED-INPUT）——没有明确放行，不能当握手通过');

  const versionMatch = lastMatch(VERSION_RE, text);
  const version = versionMatch ? Number.parseInt(versionMatch[1]!, 10) : null;
  if (version === null) issues.push('缺少 version 确认（接收方必须注明它读到的是哪一版）');

  const restatement = sectionAfter(text, MARKERS.restatement);
  if (!restatement) issues.push('缺少【回读】段——没有复述理解就不算确认');

  const rawGaps = sectionAfter(text, MARKERS.gaps);
  const gaps: string[] = [];
  if (!rawGaps) {
    issues.push('缺少【缺口】段');
  } else {
    for (const line of rawGaps.split(/\r?\n/)) {
      const clean = line.trim();
      if (!clean) continue;
      if (/^(无|none|没有)$/i.test(clean)) break;
      if (CHROME_RE.test(clean)) continue;
      const numbered = NUMBERED_RE.exec(clean);
      const body = (numbered ? numbered[2]! : clean.replace(/^[-*]\s*/, '')).replace(/\*\*/g, '').replace(/^[\s#]+|[\s]+$/g, '');
      if (!body || CHROME_RE.test(body)) continue;
      gaps.push(body);
    }
  }

  return { ok: status !== null && restatement !== '' && version !== null, status, version, restatement, gaps, issues };
}

/** A receiver that stamps READY while still listing questions has answered them on
 * the sender's behalf. That is not a green light — see the STATUS rule in HANDSHAKE_TEXT. */
export function needsSenderInput(hs: Handshake): boolean {
  return hs.gaps.length > 0 && (hs.status === 'need-input' || hs.status === 'ready');
}

export function isStaleVersion(hs: Handshake, current: number): boolean {
  return hs.version !== null && hs.version !== current;
}
```

</details>

#### 缺口

- 未复核用户实际回读和接受动作
  **影响**：不能确定新增核对有净收益
  **进一步探讨**：先用固定反例做人工盲测

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
