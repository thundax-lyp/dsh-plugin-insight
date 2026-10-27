# dsh-monitor

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4ef3cc6](https://github.com/AbnerAI/dsh-monitor/tree/4ef3cc6f3e4332a85d913a13ae929f5eb587818a)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AbnerAI/dsh-monitor) [![npm 30d 823](https://img.shields.io/static/v1?label=npm+30d&message=823&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-monitor) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-monitor)
<!-- END META -->

> **功能**：通过文件或命令轮询监听新内容，空闲时唤醒所属Agent，并提供查看和停止工具。

> **亮点**：用宿主Agent状态选择followup/inject，把无需模型忙轮询的源监听与显式解除接在工具中。详见[Q01](#research-q01)。

> **主要限制**：半行/轮换与命令重叠会误判增量，list/stop不核owner、shell直接用宿主权限，前移cursor与delivered不能证明收妥。详见[Q02](#research-q02)。

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
  - [Q01 · 它怎样让闲置Agent响应消息，“persistent”是什么范围？](#detail-section-11)
  - [Q02 · 文件和命令delta能可靠识别一条新消息吗？](#detail-section-12)
  - [Q03 · 所属会话隔离、命令权限和投递确认实际怎样？](#detail-section-13)
  - [Q04 · 启动条件和三阶段代价是什么？](#detail-section-14)
  - [Q05 · 怎样判断采用与推导改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有本地消息源，希望Agent空闲仍响应的场景。详见[Q01](#research-q01)。

人工读收件箱或Agent反复运行查询；本项接后台timer和Agent唤醒，不提供消息中间件耐久性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| monitor | arm文件或命令源 | 非空校验，无路径/权限收敛 |
| monitor_list/stop | 查看与解除 | 全实例Map不按owner限制 |
| 后台timer | 检查变化并唤醒 | 无磁盘恢复，命令可重叠 |
| plugin notice | followup或inject | 未ack，delivered非收妥 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| DSH tools/systemPrompt/Agent peers | 注册及唤醒 | followup/inject ABI依宿主 |
| 本地完整行NDJSON源 | file监听 | 无范围/绝对路径强校验 |
| POSIX /bin/sh（命令源） | 重跑命令 | 宿主权限/环境，非沙箱 |
| 宿主模型预算 | 通知后处理 | 本插件无费用/数量总限 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核受权可信消息源 | 用户 | 无敏感/破坏性命令 |
| monitor arm | Agent | 返回ID，从当前文件末尾开始 |
| timer检查并唤醒 | 插件/Agent | 计数仅请求投递，不是业务收据 |
| list/stop及补读 | 用户/Agent | 共享Map需额外隔离，重启需重建 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH工具/LLM/Agent运行时；文件源或POSIX /bin/sh命令环境 | 配可信消息源、明确监听和停止责任、排除敏感内容，工时未知 | 不含消息broker；本插件不提供持久注册/游标存储 |
| 持续使用 | timer轮询、全文件同步读取或每轮shell；通知引发宿主模型turn | 处理通知/重复/错误、维护source和interval，实际耗时未知 | 最低100ms，命令timeout10秒/maxBuffer16MiB是单次限制，非总预算；模型费用沿宿主未知 |
| 失败恢复 | 重启后重新arm、源日志/外部游标和模型重处理资源 | 核漏送/重送、停旧命令并人工补读，工时未知 | 新arm从当前文件末尾开始，不能自动补停机积压；没有投递ack/重试事务 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 空闲唤醒 | followup/inject接线 | Agent受理与最终处理 |
| 增量消息 | file byte/command前缀比较 | 拆行/轮换/并发下漏重送 |
| 省模型轮询 | timer检查未变不投递 | 实际费用/通知风暴净收益 |

> **思考**：半行/轮换与命令重叠会误判增量，list/stop不核owner、shell直接用宿主权限，前移cursor与delivered不能证明收妥。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用宿主Agent状态选择followup/inject，把无需模型忙轮询的源监听与显式解除接在工具中。详见[Q01](#research-q01)。

byte offset、plugin来源和unload timer清理有用；完整行缓冲、互斥、owner管理与确认重试均未闭合。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

半行/轮换与命令重叠会误判增量，list/stop不核owner、shell直接用宿主权限，前移cursor与delivered不能证明收妥。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，可信单用户file场景可继续探讨，但保外部日志补读，避免唯一通知链。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

后台唤醒接线可核；仅进程内持久，delta/管理隔离与确认边界受限；确认游标假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/types/index.d.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整383行发布代码、README、package/patch/类型声明；无目标/宿主运行或测试。
- 下一步：以拆行/多字节/同大小替换/慢命令乱序/失败恢复/跨owner/Agent拒收和重启构成可复现对照，比较有效受理及总成本。

**分析版本**

- **仓库**：[AbnerAI/dsh-monitor](https://github.com/AbnerAI/dsh-monitor)
- **版本号**：0.1.1（[固定提交 4ef3cc6](https://github.com/AbnerAI/dsh-monitor/tree/4ef3cc6f3e4332a85d913a13ae929f5eb587818a)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

owner能力+完整行世代+单flight/ack游标/outbox的watcher，以拆行/乱序/跨会话/拒收/重启反例检验，未验证。详见[Q05](#research-q05)。

以拆行/多字节/同大小替换/慢命令乱序/失败恢复/跨owner/Agent拒收和重启构成可复现对照，比较有效受理及总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 383 | 324 | 41 | — |
| .md | source | 1 | 130 | — | — | 714 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AbnerAI/dsh-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AbnerAI/dsh-monitor/issues?q=is%3Aissue+created%3A2026-09-22T09%3A47%3A27.535Z..2026-10-22T09%3A47%3A27.535Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AbnerAI/dsh-monitor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A47%3A27.535Z..2026-10-22T09%3A47%3A27.535Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版后台watcher能否可靠且有权限边界地唤醒所属Agent？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它怎样让闲置Agent响应消息，“persistent”是什么范围？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合已有本地NDJSON收件箱或可信命令状态源、希望Agent空闲时也处理新消息的人。原方案是让Agent反复查询/人工重开对话；本项monitor创建内存watcher并定时检查，idle用followup打开新turn，其余状态用inject，源标成plugin/notice而非隐去来源。monitor_list和monitor_stop提供查看和解除。这是宿主唤醒适配与后台轮询的组合贡献，不是新增消息中间件或可靠投递协议。

persistent仅指插件实例存活期间timer继续。watchers/cursor/delivered都在Map内，无磁盘恢复、重启恢复、session关闭订阅清理或跨机器服务。file arm从当时size跳过既有backlog，缺失文件从0等创建；command没有初始基线预读，首次非空stdout会通知。unload effect标stopped/clearInterval/delete，stop也清timer；已开始的命令不会因此被取消。README所谓durable within session不应外推成离线持久服务或重启不漏消息。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:9-24](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/README.md#L9-L24)

作者机制与耐久范围。

<details>
<summary>查看原文（16行）</summary>

```text
## How it works

The model calls the `monitor` tool to arm a watcher on a source:

- **`source: file`** — an append-only NDJSON inbox. New lines are delivered as they land.
- **`source: command`** — a shell command re-run on an interval. Its output delta since the last run is delivered.

On each new message the plugin wakes the agent:

| Agent state | Behavior |
|---|---|
| **idle** | `agent.followup()` — opens a new turn (harness analog of Claude Code's `<task-notification>`) |
| **busy** | `agent.inject()` — queues the message into the next step |

Watchers are durable within the session, disarmable on demand, and torn down automatically when the plugin is unloaded.

```

</details>

**依据 2 · 源码核查**：[lib/index.js:54-63](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L54-L63)

watcher仅内存。

<details>
<summary>查看原文（10行）</summary>

```text

/** One armed watcher. */
function makeWatcher(spec) {
  return {
    ...spec,
    cursor: null,          // file: byte offset; command: last output
    stopped: false,
    timer: null,           // disposer returned by ctx.setInterval
    delivered: 0
  };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:128-151](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L128-L151)

Map和文件起点。

<details>
<summary>查看原文（24行）</summary>

```text

  ctx.systemPrompt.section({
    name: "tool:monitor",
    order: 120,
    text: "You can arm persistent watchers with the monitor tool. A watcher delivers a message into this session whenever new content appears in its source — you are woken even while idle. Do not busy-poll a source you already watch; monitor_list shows what is armed, and monitor_stop disarms a watcher you no longer need."
  });

  function armWatcher(spec, owner) {
    const id = `monitor-${++seq}`;
    const watcher = makeWatcher({ ...spec, id, owner });
    watchers.set(id, watcher);

    // File sources start watching from the current end of the file: only new
    // lines are delivered, never the pre-existing backlog.
    if (watcher.source === "file") {
      watcher.path = expandHome(watcher.path);
      try {
        watcher.cursor = statSync(watcher.path).size;
      } catch {
        watcher.cursor = 0; // file may not exist yet; will be created later
      }
    }

    const tick = async () => {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:181-217](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L181-L217)

Agent投递与unload。

<details>
<summary>查看原文（37行）</summary>

```text
      if (w.stopped) return;
      const { text, summary } = noticeFor(w, content);
      const message = createUserMessage({
        content: [{ type: "text", text }],
        source: {
          kind: "plugin",
          plugin: "dsh-monitor",
          form: "notice",
          summary
        }
      });
      const agent = w.owner;
      if (agent) {
        if (agent.status === "idle") {
          agent.followup(message);
        } else {
          agent.inject(message);
        }
      }
      w.delivered += 1;
    };

    const interval = Math.max(watcher.pollIntervalMs ?? defaultPollMs, 100);
    // Global setInterval (harness convention). Cleanup is registered through
    // ctx.effect so every armed timer is torn down with the plugin fiber.
    const timer = setInterval(() => {
      void tick();
    }, interval);
    watcher.timer = () => clearInterval(timer);
    ctx.effect(() => () => {
      if (!watcher.stopped) {
        watcher.stopped = true;
        clearInterval(timer);
        watchers.delete(watcher.id);
      }
    });

```

</details>

**依据 5 · 源码核查**：[lib/index.js:221-229](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L221-L229)

stop清timer。

```text
  function stopWatcher(id) {
    const w = watchers.get(id);
    if (!w) return false;
    w.stopped = true;
    if (w.timer) w.timer();
    watchers.delete(id);
    return true;
  }

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件和命令delta能可靠识别一条新消息吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

文件每轮先stat size，再readFileSync整个文件再按byte cursor切片，正确使用byte offset可避免简单多字节字符偏移，但全文件读取与历史大小一起增长，并非只读新增字节。text.split换行把没有最终换行的半条JSON也当raw消息，立即cursor=size；下一轮只读后半条，不能重组原记录，跨块UTF8字符还可能成为替换符。stat与读取之间若继续append，读取buffer含更多字节而offset仍旧size，后轮会重读部分；替换同大小文件size相等直接跳过，没有inode/内容世代；变小才重置0并可能重新投递旧内容。安全前提须严格单writer原子完整行append且无竞争/轮换，源码并未落实这些假设。

命令delta只是stdout字符串前缀比较，若新结果不以前结果开头就重发全结果，不是集合差分；tail滚动窗口的旧行可重复。runCommand失败返回ok=false/stderr，但tick只取stdout，等于把失败设成空换行基线，恢复后把全部内容当新消息；失败通常无可见诊断。setInterval直接void tick无inFlight锁，慢命令可以重叠，后启动先完成/旧结果后到可逆转cursor与重复通知。单次命令10秒预算与最小100ms允许许多并发；没有per-watcher排队/重入保护或全局数量上限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:66-99](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L66-L99)

文件读增量。

<details>
<summary>查看原文（34行）</summary>

```text
/** Read new lines from an append-only NDJSON file after `fromOffset`. */
function readFileDelta(path, fromOffset) {
  let size = 0;
  try {
    size = statSync(path).size;
  } catch {
    return { lines: [], offset: fromOffset };
  }
  if (size === fromOffset) return { lines: [], offset: size };
  // Reset on truncation.
  const start = fromOffset === null || size < fromOffset ? 0 : fromOffset;
  // Read as a Buffer and slice by exact bytes (readFileSync `start` is
  // unreliable with string encodings across Node versions).
  const buf = readFileSync(path);
  const text = buf.subarray(start).toString("utf8");
  const offset = size;
  const lines = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    // NDJSON records: prefer the `content` field, fall back to the raw line.
    try {
      const rec = JSON.parse(line);
      const content = typeof rec?.content === "string" ? rec.content : line;
      lines.push({ raw: line, content, meta: rec });
    } catch {
      lines.push({ raw: line, content: line, meta: null });
    }
  }
  return { lines, offset };
}

/** Run a command and return { stdout, stderr, ok }. */
async function runCommand(cmd, cwd) {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:102-113](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L102-L113)

命令失败结构。

<details>
<summary>查看原文（12行）</summary>

```text
      cwd: cwd ?? process.cwd(),
      timeout: 10000,
      maxBuffer: 16 * 1024 * 1024
    });
    return { stdout: stdout ?? "", stderr: stderr ?? "", ok: true };
  } catch (error) {
    return { stdout: "", stderr: String(error?.message ?? error), ok: false };
  }
}

/** Format a wake-up message body with a bounded summary. */
function noticeFor(watcher, content) {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:153-178](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L153-L178)

cursor及忽略ok。

<details>
<summary>查看原文（26行）</summary>

```text
      try {
        if (watcher.source === "file") {
          const { lines, offset } = readFileDelta(watcher.path, watcher.cursor);
          watcher.cursor = offset;
          if (lines.length > 0) {
            for (const line of lines) await deliver(watcher, line.content);
          }
        } else if (watcher.source === "command") {
          const { stdout } = await runCommand(watcher.command, watcher.cwd);
          const current = stdout.endsWith("\n") ? stdout : `${stdout}\n`;
          const prev = watcher.cursor ?? "";
          if (prev !== current) {
            const delta = current.startsWith(prev)
              ? current.slice(prev.length)
              : current;
            watcher.cursor = current;
            const trimmed = delta.trim();
            if (trimmed) await deliver(watcher, trimmed);
          } else {
            watcher.cursor = current;
          }
        }
      } catch (error) {
        ctx.logger.warn(`dsh-monitor ${watcher.id}: ${String(error?.message ?? error)}`);
      }
    };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:202-208](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L202-L208)

无互斥interval。

```text

    const interval = Math.max(watcher.pollIntervalMs ?? defaultPollMs, 100);
    // Global setInterval (harness convention). Cleanup is registered through
    // ctx.effect so every armed timer is torn down with the plugin fiber.
    const timer = setInterval(() => {
      void tick();
    }, interval);
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 所属会话隔离、命令权限和投递确认实际怎样？

**研究主题**：缺陷与关键质疑

#### 完整回答

watcher保留exec.agent作为投递owner，但list遍历全实例Map不按exec.agent过滤，stop只按可枚举monitor-N ID查Map、不核owner；共享插件实例服务多会话时可看其他会话的文件/命令描述并停止其监听。“送给owner”并不等“只有owner能管理”。初始monitor仅检查文件/命令非空，未强制绝对路径、允许根、沙箱策略或命令审批；expandHome仅支持~和~/，relative path实际按宿主cwd读，~user及Windows反斜杠不在支持中。command直接/bin/sh -c执行模型提供字符串并继承默认宿主环境，cwd非空也不校验项目范围，不能当普通只读监控权限。

noticeFor调用外部boundContextSummary，但本地Config的maxNoticeBytes虽然读出却未参与任何截断，不能声称配置4096就是实际UTF8通知上限；具体boundContextSummary语义依peer。deliver先构造消息，followup/inject未await或核返回/ack，随即delivered++，且文件cursor在deliver前已前移。同步throw导致后续本批行可能漏；异步拒绝不在await链里，计数也不证明Agent已接收/处理。源文本虽plugin标识，仍送进user role上下文，没有内容指令隔离，外部不可信消息可能诱导后续操作。没有可靠重试、去重键、会话活跃检查或exactly-once保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:47-52](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L47-L52)

配置声明。

```text

const Config = z.object({
  // Cap on the model-facing wake-up message (UTF-8 bytes).
  maxNoticeBytes: z.number().min(64).default(4096),
  // Default poll interval for command sources (ms).
  defaultPollIntervalMs: z.number().min(100).default(2000)
```

**依据 2 · 源码核查**：[lib/index.js:112-124](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L112-L124)

摘要不使用maxNoticeBytes。

<details>
<summary>查看原文（13行）</summary>

```text
/** Format a wake-up message body with a bounded summary. */
function noticeFor(watcher, content) {
  const head = `[monitor ${watcher.name ?? watcher.id}] ${content}`;
  const summary = boundContextSummary(head);
  return {
    text: summary,
    summary
  };
}

function apply(ctx, config) {
  const maxNoticeBytes = config.maxNoticeBytes ?? 4096;
  const defaultPollMs = config.defaultPollIntervalMs ?? 2000;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:181-200](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L181-L200)

不等ack的投递计数。

<details>
<summary>查看原文（20行）</summary>

```text
      if (w.stopped) return;
      const { text, summary } = noticeFor(w, content);
      const message = createUserMessage({
        content: [{ type: "text", text }],
        source: {
          kind: "plugin",
          plugin: "dsh-monitor",
          form: "notice",
          summary
        }
      });
      const agent = w.owner;
      if (agent) {
        if (agent.status === "idle") {
          agent.followup(message);
        } else {
          agent.inject(message);
        }
      }
      w.delivered += 1;
```

</details>

**依据 4 · 源码核查**：[lib/index.js:276-299](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L276-L299)

只验非空的arm。

<details>
<summary>查看原文（24行）</summary>

```text
    async execute(args, exec) {
      if (args.source === "file" && !args.path) {
        throw new Error("monitor: source 'file' requires a non-empty path");
      }
      if (args.source === "command" && !args.command) {
        throw new Error("monitor: source 'command' requires a non-empty command");
      }
      const spec = {
        source: args.source,
        path: args.path,
        command: args.command,
        cwd: args.cwd,
        pollIntervalMs: args.poll_interval_ms,
        name: args.name
      };
      const watcher = armWatcher(spec, exec.agent);
      const description =
        args.source === "file" ? args.path : args.command;
      return {
        id: watcher.id,
        source: args.source,
        description
      };
    },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:331-343](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L331-L343)

全局list无owner过滤。

<details>
<summary>查看原文（13行）</summary>

```text
          : watchersList.map((w) => `${w.id} [${w.source}] ${w.description} (delivered ${w.delivered})`).join("\n")
      }]
    },
    execute(_args, exec) {
      const visible = [];
      for (const w of watchers.values()) {
        visible.push({
          id: w.id,
          source: w.source,
          description: w.source === "file" ? w.path : w.command,
          delivered: w.delivered
        });
      }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:371-376](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L371-L376)

stop无owner。

```text
          ? `Monitor ${value.id} disarmed.`
          : `No armed watcher ${value.id}.`
      }]
    },
    execute(args) {
      const stopped = stopWatcher(args.id);
```

**依据 7 · 源码核查**：[lib/index.js:102-109](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L102-L109)

宿主shell权限。

```text
      cwd: cwd ?? process.cwd(),
      timeout: 10000,
      maxBuffer: 16 * 1024 * 1024
    });
    return { stdout: stdout ?? "", stderr: stderr ?? "", ok: true };
  } catch (error) {
    return { stdout: "", stderr: String(error?.message ?? error), ok: false };
  }
```

#### 缺口

- peer boundContextSummary的实际截断语义和Agent followup/inject受理/会话生命周期契约
  **影响**：不能把本地delivered当确认收据，也不能把未使用配置当通知字节上限
  **进一步探讨**：核对应固定宿主API与通知去重/ack边界，区分已请求、已受理和已处理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动条件和三阶段代价是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

依赖tools/systemPrompt服务，schemastery/zod与dsh-agent/dsh-llm/dsh-tools/cordis peers。没有Skill注册或用户命令，systemPrompt段只是向模型说明可用工具。file方式Node原生fs可用，command硬编码/bin/sh所以普通原生Windows不满足，需要POSIX兼容环境，不能因Node跨平台就声称命令跨平台。README安装的latest只是作者示例，本分析固定0.1.1提交。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH工具/LLM/Agent运行时；文件源或POSIX /bin/sh命令环境 | 配可信消息源、明确监听和停止责任、排除敏感内容，工时未知 | 不含消息broker；本插件不提供持久注册/游标存储 |
| 持续使用 | timer轮询、全文件同步读取或每轮shell；通知引发宿主模型turn | 处理通知/重复/错误、维护source和interval，实际耗时未知 | 最低100ms，命令timeout10秒/maxBuffer16MiB是单次限制，非总预算；模型费用沿宿主未知 |
| 失败恢复 | 重启后重新arm、源日志/外部游标和模型重处理资源 | 核漏送/重送、停旧命令并人工补读，工时未知 | 新arm从当前文件末尾开始，不能自动补停机积压；没有投递ack/重试事务 |

与模型忙轮询相比，空闲timer可能减少无变化时的模型回合，但每条file行各触发通知，burst无合并/限速；command前缀重发、错误恢复和重叠会额外消耗。应以有效消息被正确处理的总开销计成本，不能用timer固定频率推出节省。代码树无可读测试文件，作者“等效Monitor”是功能定位，未给同负载漏重送/CPU/模型费对照；本轮只检查源码。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-54](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/package.json#L44-L54)

依赖和peers。

<details>
<summary>查看原文（11行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "zod": "^4.4.3"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/cordis": "^4.0.1"
  }
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:41-52](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L41-L52)

服务和配置。

<details>
<summary>查看原文（12行）</summary>

```text
const name = "dsh-monitor";
// Timers are NOT injected: the harness convention is plain global
// setTimeout/setInterval with cleanup registered through ctx.effect
// (the timer service mixin is only resolvable from the host context,
// not from tool-execution contexts). See dsh-schedule for the pattern.
const inject = ["tools", "systemPrompt"];

const Config = z.object({
  // Cap on the model-facing wake-up message (UTF-8 bytes).
  maxNoticeBytes: z.number().min(64).default(4096),
  // Default poll interval for command sources (ms).
  defaultPollIntervalMs: z.number().min(100).default(2000)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:129-133](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L129-L133)

提示段不是Skill。

```text
  ctx.systemPrompt.section({
    name: "tool:monitor",
    order: 120,
    text: "You can arm persistent watchers with the monitor tool. A watcher delivers a message into this session whenever new content appears in its source — you are woken even while idle. Do not busy-poll a source you already watch; monitor_list shows what is armed, and monitor_stop disarms a watcher you no longer need."
  });
```

**依据 4 · 源码核查**：[lib/index.js:102-109](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L102-L109)

平台/单次预算。

```text
      cwd: cwd ?? process.cwd(),
      timeout: 10000,
      maxBuffer: 16 * 1024 * 1024
    });
    return { stdout: stdout ?? "", stderr: stderr ?? "", ok: true };
  } catch (error) {
    return { stdout: "", stderr: String(error?.message ?? error), ok: false };
  }
```

**依据 5 · 源码核查**：[lib/index.js:153-161](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L153-L161)

逐行通知。

```text
      try {
        if (watcher.source === "file") {
          const { lines, offset } = readFileDelta(watcher.path, watcher.cursor);
          watcher.cursor = offset;
          if (lines.length > 0) {
            for (const line of lines) await deliver(watcher, line.content);
          }
        } else if (watcher.source === "command") {
          const { stdout } = await runCommand(watcher.command, watcher.cwd);
```

#### 缺口

- 真实消息负载下漏重送、通知风暴、模型费用和人工补偿工时
  **影响**：不能确认相对忙轮询的净收益，也不能确认消息达到即处理的时延上界
  **进一步探讨**：固定输入/到达率/慢命令与失败样本，以成功受理消息计资源及人工核对成本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样判断采用与推导改进？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察。异步唤醒有清楚用途，但半行/轮换/重叠造成delta失真，跨会话管理无owner限制，命令直用宿主shell及未ack前移cursor会影响核心可靠响应。不是因为没有冒烟而降级。可继续从可信单用户完整行append场景、只用file且有外部可补读原日志入手，不应承接唯一通知渠道或不可信命令源。普通用户把工具描述当绝对路径检查或把delivered当收妥会误判。

由这些机制可推“owner绑定的确认游标watcher”。参照现有byte offset/String cursor和每tick无锁，增加session能力、只允许受权source/执行器、文件世代+完整行缓冲、单flight及退避、消息稳定ID/outbox和受理ack后推进游标；持久化注册须明确重启追赶与保留边界，通知按预算合并且保原记录定位。最小反例覆盖拆行/UTF8、同大小替换、读期间追加、慢命令乱序、失败恢复、跨owner stop、Agent拒绝及重启。若仍丢完整消息/重复触发业务或owner可越权，否定可靠性；若节省模型费被outbox/人工开销抵消则否定经济收益。未验证，不计现有插件贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:66-99](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L66-L99)

文件游标参照。

<details>
<summary>查看原文（34行）</summary>

```text
/** Read new lines from an append-only NDJSON file after `fromOffset`. */
function readFileDelta(path, fromOffset) {
  let size = 0;
  try {
    size = statSync(path).size;
  } catch {
    return { lines: [], offset: fromOffset };
  }
  if (size === fromOffset) return { lines: [], offset: size };
  // Reset on truncation.
  const start = fromOffset === null || size < fromOffset ? 0 : fromOffset;
  // Read as a Buffer and slice by exact bytes (readFileSync `start` is
  // unreliable with string encodings across Node versions).
  const buf = readFileSync(path);
  const text = buf.subarray(start).toString("utf8");
  const offset = size;
  const lines = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    // NDJSON records: prefer the `content` field, fall back to the raw line.
    try {
      const rec = JSON.parse(line);
      const content = typeof rec?.content === "string" ? rec.content : line;
      lines.push({ raw: line, content, meta: rec });
    } catch {
      lines.push({ raw: line, content: line, meta: null });
    }
  }
  return { lines, offset };
}

/** Run a command and return { stdout, stderr, ok }. */
async function runCommand(cmd, cwd) {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:153-208](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L153-L208)

无互斥/ack参照。

<details>
<summary>查看原文（56行）</summary>

```text
      try {
        if (watcher.source === "file") {
          const { lines, offset } = readFileDelta(watcher.path, watcher.cursor);
          watcher.cursor = offset;
          if (lines.length > 0) {
            for (const line of lines) await deliver(watcher, line.content);
          }
        } else if (watcher.source === "command") {
          const { stdout } = await runCommand(watcher.command, watcher.cwd);
          const current = stdout.endsWith("\n") ? stdout : `${stdout}\n`;
          const prev = watcher.cursor ?? "";
          if (prev !== current) {
            const delta = current.startsWith(prev)
              ? current.slice(prev.length)
              : current;
            watcher.cursor = current;
            const trimmed = delta.trim();
            if (trimmed) await deliver(watcher, trimmed);
          } else {
            watcher.cursor = current;
          }
        }
      } catch (error) {
        ctx.logger.warn(`dsh-monitor ${watcher.id}: ${String(error?.message ?? error)}`);
      }
    };

    const deliver = async (w, content) => {
      if (w.stopped) return;
      const { text, summary } = noticeFor(w, content);
      const message = createUserMessage({
        content: [{ type: "text", text }],
        source: {
          kind: "plugin",
          plugin: "dsh-monitor",
          form: "notice",
          summary
        }
      });
      const agent = w.owner;
      if (agent) {
        if (agent.status === "idle") {
          agent.followup(message);
        } else {
          agent.inject(message);
        }
      }
      w.delivered += 1;
    };

    const interval = Math.max(watcher.pollIntervalMs ?? defaultPollMs, 100);
    // Global setInterval (harness convention). Cleanup is registered through
    // ctx.effect so every armed timer is torn down with the plugin fiber.
    const timer = setInterval(() => {
      void tick();
    }, interval);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:331-343](https://github.com/AbnerAI/dsh-monitor/blob/4ef3cc6f3e4332a85d913a13ae929f5eb587818a/lib/index.js#L331-L343)

owner隔离参照。

<details>
<summary>查看原文（13行）</summary>

```text
          : watchersList.map((w) => `${w.id} [${w.source}] ${w.description} (delivered ${w.delivered})`).join("\n")
      }]
    },
    execute(_args, exec) {
      const visible = [];
      for (const w of watchers.values()) {
        visible.push({
          id: w.id,
          source: w.source,
          description: w.source === "file" ? w.path : w.command,
          delivered: w.delivered
        });
      }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
