# Ledger Memory

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[edca61f](https://github.com/18477514055/dsh-ledger-memory/tree/edca61f3b974db244205ba510be42f9c96834f82)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/18477514055/dsh-ledger-memory) [![npm 30d 4,123](https://img.shields.io/static/v1?label=npm+30d&message=4%2C123&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ledger-memory)
<!-- END META -->

> **功能**：为 DSH 项目保存活跃台账、经验卡与交接资料，自动注入记忆并提供压缩胶囊和会话文本指针回读。

> **亮点**：坏manifest/路径拒写、记忆根真实路径复核和实际stage判据，加上记忆接线提高可检查性，见 [Q01](#research-q01) 至 [Q03](#research-q03)。

> **主要限制**：grant不绑root/正文，主写与审计非事务，超大事件seq回读可缺整事件，V2仍默认stage；不能承诺无损或完整追责，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 跨会话记忆比项目笔记多什么，合格接续如何判断？](#detail-section-11)
  - [Q02 · 路径拒写、原则授权与审计能保证什么？](#detail-section-12)
  - [Q03 · 原文回读和自动暂存分别有什么边界？](#detail-section-13)
  - [Q04 · 何种范围可试用，如何改进授权和多资产收据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：持续跨会话推进同项目的用户可维护状态/卡片/交接并自动注入，合格接续仍核真实目标与文件，见 [Q01](#research-q01)。

手工AGENTS/项目笔记和人工交接；插件增量在发现、注入、归档/卡及胶囊生命周期，语义正确不由存储机制提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 活跃记忆/卡 | 跨会话状态接续 | 人核语义与真实工作区 |
| 路径/原则 | 拒错根与用户grant | grant非内容版本绑定 |
| 胶囊/seq | 文本按需回读 | 非全事件无损备份 |
| Git策略 | 布局相关stage | V3禁、V2默认可写index |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19/匹配DSH事件工具 | 必需 | 注入/交互/写回 | 无服务按分支失败，非零依赖 |
| 正确root/可读清单/记忆根 | 写入必需 | 位置和隐私 | 代表守卫拒坏清单/越界 |
| session.eventAt | 回读必需 | seq提取文本 | 缺接口失败；大事件仍需替代 |
| Git及V2/V3布局 | stage相关必需 | 中央暂存判据 | V3禁、V2默认可能写index |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份并核root/清单/布局 | 路径、隐私、stage明确 |
| 接续 | pre-step注入/卡片/胶囊 | 人核真实目标和文件 |
| 写入 | 用户具体审原则变更 | 比对主写、清单和审计 |
| 恢复 | 原文seq/归档与备份 | 缺事件/日志即停止自动依赖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 文件/备份金额未知 | root/清单/隐私/stage配置 | V2/V3差别 |
| 持续使用 | 注入/压缩模型和存储未知 | 卡片/目标与回执复核 | 无净节token证明 |
| 失败恢复 | 原文/归档/日志资源未知 | 对齐多资产与实际index | 非全局事务、大事件缺口 |
| 退出 | 记忆存档未知 | 禁用并查残留/备份 | 不撤历史或index |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 记忆接续 | 台账/卡/注入 | 目标恢复正确率 |
| 追责 | 路径守卫/授权/审计 | 精确批准与多资产完整 |
| 原文回读 | eventAt文本/截断标记 | 超大事件可完整恢复 |

> **思考**：grant不绑root/正文，主写与审计非事务，超大事件seq回读可缺整事件，V2仍默认stage；不能承诺无损或完整追责，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：坏manifest/路径拒写、记忆根真实路径复核和实际stage判据，加上记忆接线提高可检查性，见 [Q01](#research-q01) 至 [Q03](#research-q03)。

[Q02](#research-q02) 公共拒写避免错误基准降级值得借鉴；临时清理所有权、grant绑定和多资产回执仍需增强，不能用rename概括可靠性。

<a id="detail-section-5"></a>

### 1.4 主要限制

grant不绑root/正文，主写与审计非事务，超大事件seq回读可缺整事件，V2仍默认stage；不能承诺无损或完整追责，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可备份V3非关键项目先核拒写/授权/stage和压缩回读，定期人工比对真实工作区；缺口出现暂停自动依赖，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表路径/授权/写入/回读/stage源码已核，试用可备份V3项目；未运行目标或长期记忆实验。未来收据方案未验证。

- 已检查：作者 README、包清单、源码路径 lib/base.js、lib/index.js、lib/part1.js、lib/part2-tools.js、lib/part2.js、lib/part3.js、lib/part4.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：旧六题/11 findings和自code依赖复核，完整inventory；当前读入口、公共路径/atomic、原则grant/写与审计、seq文本和中央stage代表链，未全审所有扩展模式/UI/压缩支路。
- 下一步：在副本注入双root、并发正文、坏清单、链接、审计/登记失败、临时碰撞及大事件，核实际文件/index与记忆目标恢复。本轮未执行。

**分析版本**

- **仓库**：[18477514055/dsh-ledger-memory](https://github.com/18477514055/dsh-ledger-memory)
- **版本号**：1.6.2（[固定提交 edca61f](https://github.com/18477514055/dsh-ledger-memory/tree/edca61f3b974db244205ba510be42f9c96834f82)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

精确内容/版本授权、多资产收据与片内文本回读，故障矩阵若不能减少错写/遗漏则否定，见 [Q04](#research-q04)。

在副本注入双root、并发正文、坏清单、链接、审计/登记失败、临时碰撞及大事件，核实际文件/index与记忆目标恢复。本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 22 | 35185 | 19291 | 14154 | — |
| .md | source | 6 | 1437 | — | — | 16435 |
| .mjs | source | 589 | 96621 | 70504 | 20410 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/18477514055/dsh-ledger-memory/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：项目记忆的路径、授权、审计、文本回读与stage边界能否支撑可追责接续？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话记忆比项目笔记多什么，合格接续如何判断？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-ledger-memory 1.6.2是DSH原生插件，为持续推进同项目的用户维护活跃台账、流水、原则、决策/目标/经验卡和交接资料。相对手工AGENTS或笔记，增加清单定位、pre-step自动注入、归档/卡索引和压缩前后胶囊/seq指针接线；内容仍由模型与人判定，合格是恢复正确目标、决策与真实工作区，而不是写了更多记忆。

入口pre-step在next后处理压缩/注入，并会吞部分压缩异常继续对话，故不能用会话继续证明胶囊已保存。依赖Node>=22.19、宿主tools/事件/session和可写项目目录，自动压缩/分类还依赖模型能力与上下文契约。包自述“逐字/只追加”须按载体解释，活跃状态可替换，宿主日志、文本提取和磁盘胶囊并不是同一份无损档案。实际总token与跨会话恢复正确率均未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/package.json#L2-L4)

版本与作者功能范围。

```text
  "name": "dsh-ledger-memory",
  "version": "1.6.2",
  "description": "台账记忆（Ledger Memory）—— 给 DSH 一个项目自己的记忆载体：活跃台账每回合自动注入、只追加的回合流水与活动日志（L0–L4，含逐字存档）、关键决策/目标树/经验教训的卡片化记忆，压缩前抓逐字胶囊、压缩后连台账一起注回，把对话锁定到某个项目目录（跨重启保持），以及跨会话的交接单闭环。可回溯、可追查。★ 1.6.2（安全补全）：1.6.1 的路径边界只覆盖初始化入口，本次补上全部日常读写入口（含链接与越界清单一律拒绝，不再降级写回源码根）；合规检查的「可修」项现在真的会修；扩展记忆（6 种模式）的未知模式不再导致卡片永久删不掉；V3 首轮注入与迁移的指针、忽略规则不再错位。",
```

**依据 2 · 源码核查**：[package.json:29-54](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/package.json#L29-L54)

原生入口、Node与分发。

<details>
<summary>查看原文（26行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md"
  ],
  "scripts": {
    "test": "node tools/selftest.mjs",
    "probes": "node tools/_probe-dirty-source.mjs && node tools/_probe-capsule-persistence.mjs",
    "probes:all": "node tools/_probe-assertion-can-fail.mjs && node tools/_probe-dirty-source.mjs && node tools/_probe-capsule-persistence.mjs",
    "probes:mutation": "node tools/_probe-assertion-can-fail.mjs"
  },
  "engines": {
    "node": ">=22.19.0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:332-358](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/index.js#L332-L358)

pre-step与压缩异常处理接线。

<details>
<summary>查看原文（27行）</summary>

```text
  // ★ 入口选 `agent/pre-step` 的原因（与 6.会话工作区用途 同款，已在真机验证）：
  //   它是 waterfall，`next()` 之后拿到本步真正要发的 messages，能在**已认领消息之后**
  //   插一条自定义消息；而 systemPrompt.context 每次装配都重算 ⇒ 会写进
  //   runtime-context 快照、每步都变 ⇒ 打烂 prompt 缓存。pre-step 只在**内容变了**时插。
  if (cfg.inject !== false) {
    ctx.on("agent/pre-step", async ({ agent, messages }, next) => {
      const decision = await next();
      // ── ★★★★★ 2026-10-18（D244）：**长回合中途：先补义务 → 全量压缩 → 继续** ──
      //
      //   用户原话（逐字）：*"如果遇到一个非常长的工作，则工作到准备接近压缩线的时候，
      //   强制进行这些义务，然后进行一次强制的全量压缩，压缩完之后模型接着工作，
      //   整个过程不需要任何操作。"*
      //
      //   ★★★ 位置是**本钩子的第一件事**，而且必须在 `await next()` **之后**：
      //     - **之后**：内核自己的 `agent/pre-step` 压缩（`dsh-compaction-basic:840-853`）
      //       已经跑完了 ⇒ 我们量到的是**压后**的水位，不会与它抢同一段 surface
      //       （抢了会撞 `assertNoActiveCompaction`，`:938`）。
      //     - **第一件事**：这个函数后面有一串 `return`（`text === undefined` / `already` /
      //       `note.id` 不合法）—— 放在后面就会被**跳过**，那是"偶尔才生效"的坑。
      //   ★ 它自己吞掉一切异常，**绝不**影响注入与对话（见 `runMidTurnCompact` 的 catch）。
      try {
        // ★ D257：`runMidTurnCompact` 现在是 async（内部必须 await 压缩，原因见下）。
        //   这里**要 await** —— 我们就是要让这一拍停住等摘要落地；
        //   但用 try/catch 包住，异常绝不外溢影响注入与对话。
        await runMidTurnCompact(ctx, state, agent, {
          turn: decision?.turn ?? 0,
          runTurnCompact: () => {
```

</details>

#### 缺口

- 尚无真实项目目标恢复、胶囊完整和净token对照。
  **影响**：不能把文件/指针存在或单文件原子替换当可靠长期记忆与完整审计。
  **进一步探讨**：备份非关键项目，以人为真值核交接前后目标/文件与实际产物，并计全部模型与复核负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 路径拒写、原则授权与审计能保证什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

当前refuseIfMemoryRootUnsafe对坏manifest、被拒memoryRoot及指定字段直接返回，不允许降级写回源码根；代表writePrinciples先过该守卫，再以memoryBase算目标并isUnderReal校验。这比只校“在项目根下”更明确，但本轮仅核代表入口及公共守卫，不以注释声称全部日常读写已全面安全审计。

用户卡选择生成grant比模型自填authorizedBy强，写入口从真实sessionId读取内存grant，成功消费；grant只含时间/来源/reason，不绑root、目标正文或expected revision，是一次会话窗口而非精确内容批准。原则主写完成后，清单登记失败被吞，审计失败也吞并仍ok。writeFileAtomic临时名为pid+毫秒且wx独占，但创建失败catch仍unlink同名路径，未判断是否拥有，潜在碰撞清理问题须隔离验证；rename也不防跨进程丢更新。这些不等于已发生数据损失，却限制完整可追责承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/base.js:468-523](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/base.js#L468-L523)

坏清单和不安全路径拒绝。

<details>
<summary>查看原文（56行）</summary>

```text
export function refuseIfMemoryRootUnsafe(info, watchFields = []) {
  const unsafe = Array.isArray(info?.unsafePaths) ? info.unsafePaths : [];
  // ★★★★★ 2026-10-25（D320 · Gemini 审查 004 的 F-05 第二半）：
  //   **清单坏档时也必须拒绝写**，而不只是拒绝 `memoryRoot` 越界。
  //
  //   🔴 为什么必须在这里拦：清单坏掉 ⇒ `inspect` 读不出 `memoryRoot` ⇒ `memoryBase` 退回
  //     源码根 ⇒ 一切"写记忆"的路径都会**写进源码树**，而它们**全都**已经会调本函数。
  //     ⇒ 把坏档并进同一个拒绝口，就**一次性挡住了全部写入点**，不用在十几处各加一条。
  //     （这正是 D316 那条纪律正着用：同一隐患，所有入口同一种处置 —— 而"所有入口"
  //       指的就是"都走这一个函数"。）
  //   ★ 判据：**能复用的闸门就别新开一扇**；新开一扇必然漏掉某些入口。
  const badManifest = unsafe.find((u) => u && u.field === "manifest");
  if (badManifest !== undefined) {
    return {
      ok: false,
      reason:
        "`.dsh-ledger.json` **存在但读不出来**，所以这一次**什么都没写**：\n" +
        `  · 文件：\`${String(badManifest.value)}\`\n  · 原因：${String(badManifest.why)}\n` +
        "★ 为什么不能继续：读不出清单 ⇒ 拿不到 `memoryRoot` ⇒ 记忆基准会退回**项目源码根**，\n" +
        "  于是记忆会写进源码树，还会被 `git add` / npm 打包一起带走 —— 这是**泄露**，不是降级。\n" +
        "★ 修法：把 `.dsh-ledger.json` 修成合法 JSON（常见原因：尾随逗号 / 中文标点 / 少了 `active`），" +
        "或删掉它让插件按新项目处理。",
      hint: "fix-manifest-json",
    };
  }
  const bad = unsafe.find((u) => u && u.field === "memoryRoot");
  if (bad !== undefined) {
    return {
      ok: false,
      reason:
        `清单里的 \`memoryRoot\` 被拒绝，所以这一次**什么都没写**：\n` +
        `  · 值：\`${String(bad.value)}\`\n  · 原因：${String(bad.why)}\n` +
        "★ 为什么不继续（把记忆写回项目源码根）：那会让**你以为记忆隔离在子目录、实际全在源码根**，\n" +
        "  而且会被 `git add` / npm 打包一起带走 —— 这是**泄露**，不是降级。\n" +
        "★ 修法：把 `.dsh-ledger.json` 里的 `memoryRoot` 改成**项目内部的相对路径**（例如 `<项目名>-ledger-memory`），再重试。",
      unsafeManifestPath: bad,
      nothingWritten: true,
    };
  }
  const fields = Array.isArray(watchFields) ? watchFields : [watchFields];
  for (const f of fields) {
    const u = unsafe.find((x) => x && x.field === f);
    if (u !== undefined) {
      return {
        ok: false,
        reason:
          `清单里的 \`${u.field}\` 被拒绝，所以这一次**什么都没写**：\n  · 值：\`${String(u.value)}\`\n  · 原因：${String(u.why)}\n` +
          "★ 为什么不继续（降级成单文件写或改写别处）：那会让**你以为写到了配置的目标、实际写去了另一个文件** ——\n" +
          "  静默降级比直接报错更危险。\n" +
          `★ 修法：把 \`.dsh-ledger.json\` 里的 \`${u.field}\` 改成**项目内部的相对路径**，再重试。`,
        unsafeManifestPath: u,
        nothingWritten: true,
      };
    }
  }
  return undefined;
```

</details>

**依据 2 · 源码核查**：[lib/part2.js:45-53](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2.js#L45-L53)

代表原则入口先公共守卫。

```text
export function writePrinciples(root, { content, mode, authorizedBy, exec, tag } = {}) {
  const info = inspect(root);
  // ★★★★★ 2026-10-25（D317 · Gemini 审查 004 F-01①）：**`memoryRoot` 越界时必须拒绝，不许写进源码根**。
  //   🔴 病（比"忘了加守卫"更隐蔽）：本函数 L96 **有** `isUnderReal(memBase, abs)` —— 看着像有边界。
  //     但 `inspect()` 在 `memoryRoot` 越界时把 `memoryBase` **降级回 `projectRoot`**
  //     ⇒ `memBase` 就是源码根 ⇒ 那次校验**必然通过** ⇒ 原则文件落在源码树里。
  //   ★ 判据：**"有校验"不等于"挡住了"** —— 校验的**基准**若跟着降级，它就变成了自证。
  const unsafePr = refuseIfMemoryRootUnsafe(info);
  if (unsafePr !== undefined) return unsafePr;
```

**依据 3 · 源码核查**：[lib/part2.js:97-112](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2.js#L97-L112)

真实路径复核。

<details>
<summary>查看原文（16行）</summary>

```text
  // ★ V3（D289）：原则是**记忆** ⇒ 基准是 `memoryBase`（V2 里它就是项目根，行为不变）。
  //   ★ 边界校验也**必须跟着同一个基准**：`isUnder(root, abs)` 若仍用项目根，
  //     V3 下 `abs` 在记忆子目录里 —— 仍算"在项目根下"，校验会通过（碰巧对）；
  //     但反过来，若哪天 memoryRoot 指向项目外的**合法**位置，用项目根校验就会误拒。
  //     ⇒ 基准与校验**共用同一个变量**，不给自己留"两处各判一次"的机会。
  const memBase = memoryBaseOf(info, root);
  const abs = path.resolve(memBase, relPath);
  const realPr = isUnderReal(memBase, abs);
  if (!realPr.ok) {
    return {
      ok: false,
      refused: true,
      nothingWritten: true,
      unsafeManifestPath: { field: "principles", value: relPath, why: realPr.why },
      reason: `拒绝写入：原则文件路径 \`${relPath}\` 越出了记忆根边界（${realPr.why}）—— 一个字节都没写。`,
    };
```

</details>

**依据 4 · 源码核查**：[lib/part2-tools.js:154-168](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2-tools.js#L154-L168)

用户卡生成会话grant。

<details>
<summary>查看原文（15行）</summary>

```text
      const answers = Array.isArray(result?.answers) ? result.answers : [];
      const first = answers[0] ?? {};
      const selected = Array.isArray(first.selected) ? first.selected : [];
      const picked = String(selected[0] ?? "");
      // ★ 判据只看"用户点的是不是授权那一条" —— 取不到就当**没授权**（宁可少开一次）。
      const authorized = picked.includes("授权") && !picked.includes("不授权");

      if (!authorized) {
        return {
          ok: true,
          authorized: false,
          reason: "用户没有授权（或没做出选择）⇒ 我**仍然没有**修改原则的路径，只能提议。",
        };
      }
      state.principleGrants.set(sid, { at: Date.now(), authorizedBy: "user-card", reason });
```

</details>

**依据 5 · 源码核查**：[lib/part4.js:2810-2845](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part4.js#L2810-L2845)

grant消费与写入目标未绑定。

<details>
<summary>查看原文（36行）</summary>

```text
    const sidForGrant = String(exec?.agent?.session?.header?.id ?? "");
    const grant = sidForGrant === "" ? undefined : principleGrantOf(state, sidForGrant);
    const authorizedBy = grant === undefined ? "" : grant.authorizedBy;
    if (authorizedBy === "") {
      return {
        ok: false,
        reason:
          "**根本原则条例只能由用户授权后写入** —— 这次调用没有携带**由用户动作产生**的授权，所以一个字节都没写。\n" +
          (forged
            ? "★ 注意：你（或调用方）传了 `authorizedBy`，但**那个字符串从来就不是授权凭据** ——\n" +
              "  任何人都能写一个字符串，所以它证明不了任何事（v1.2.8 起已把它从工具参数里彻底移除）。\n"
            : "") +
          "★ 正确流程（两条，任选）：\n" +
          `  ① 用 \`${PRINCIPLE_GRANT_TOOL}\` 弹一张**授权卡片**，用户点了"授权"即可（一次一授权）；\n` +
          "  ② 用 `ledger_propose_principle` 登记**一条具体提议**，" +
          "再请用户敲 `/ledger principles approve` —— ★ 批准**只在命令行层**，你调不到。",
        refused: true,
        ...(forged ? { selfAssertedAuthIgnored: true } : {}),
        hint: PRINCIPLE_GRANT_TOOL,
      };
    }
    const r = writePrinciples(root, {
      content,
      mode: explicitMode ?? "append",
      authorizedBy,
      exec,
      tag,
    });
    // ★★★ **一次一授权**：写成功后**立刻消费掉**那个窗口。
    //   ★ 为什么必须消费（而不是留着）：留着就等于"点一次 = 此后随便改"，
    //     守卫当场退化成空的。用户的原话是"解锁**改原则的权利**"，
    //     而本项目一贯的取舍是"授权针对**某一次具体修改**"（见 `PRINCIPLE_AUTH_TTL_MS`）。
    if (r.ok === true && grant !== undefined) {
      consumePrincipleGrant(state, sidForGrant);
    }
    return r;
```

</details>

**依据 6 · 源码核查**：[lib/part2.js:115-151](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2.js#L115-L151)

主写、清单/审计失败降级。

<details>
<summary>查看原文（37行）</summary>

```text
  const existing = readTextSafe(abs) ?? "";
  const body = typeof content === "string" ? content : "";
  const m = mode === "append" && existing.trim() !== "" ? "append" : mode === "replace" ? "replace" : "append";
  const next = m === "append" && existing.trim() !== "" ? `${existing}\n\n${body}\n` : `${body}\n`;

  // ★ 原子写：临时文件 + rename（与归档那条同一套做法，见 A2 的修法）。
  //   ★ 为什么这里也要原子：这是**用户的原则**，写坏一次就等于规则丢失。
  const _w = writeFileAtomic(abs, next);
  if (_w.ok !== true) throw new Error(String(_w.reason ?? "原子写失败"));
  if (needRegisterPr) {
    // ★ 落盘成功后再登记进清单 —— 防止路径越界或写盘失败时提前污染 .dsh-ledger.json。
    try {
      registerPrinciplesInManifest(root, info, relPath);
    } catch {
      /* 登记失败不挡写入：文件写下去，下次 inspect 会按 guess 认到它 */
    }
  }

  // ★★ 用户要求"每一次修改都同步到日志中" —— 走**同一个**审计出口。
  const rec = {
    kind: AUDIT_KIND_PRINCIPLE,
    tag: tag ?? "(无编号)",
    target: "principles",
    mode: m,
    relPath,
    lines: countLines(next),
    sessionId: String(exec?.agent?.session?.header?.id ?? ""),
    authorizedBy: String(authorizedBy ?? "unknown"),
  };
  let audit;
  try {
    audit = appendAudit(root, info, rec);
  } catch {
    /* 审计写失败不许挡住原则落盘（与台账那条同一口径） */
  }
  return {
    ok: true,
```

</details>

**依据 7 · 源码核查**：[lib/base.js:323-349](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/base.js#L323-L349)

临时独占失败仍清理。

<details>
<summary>查看原文（27行）</summary>

```text
export function writeFileAtomic(file, data, opts) {
  const abs = path.resolve(file);
  const tmp = `${abs}.tmp-${process.pid}-${Date.now().toString(36)}`;
  try {
    ensureDir(path.dirname(abs));
  } catch (e) {
    return { ok: false, reason: `创建目录失败：${String((e && e.message) || e)}` };
  }
  try {
    // ① 独占创建（`wx`）：临时名撞了就直接失败，绝不覆盖别人的临时文件
    fs.writeFileSync(tmp, data, { encoding: "utf8", flag: "wx" });
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 连临时文件都没建出来，没什么可清的 */
    }
    return { ok: false, reason: `写临时文件失败：${String((e && e.message) || e)}`, tmp };
  }
  try {
    // ② 原子替换
    fs.renameSync(tmp, abs);
  } catch (e) {
    try {
      fs.unlinkSync(tmp);
    } catch {
      /* 清理失败不掩盖真正的原因 */
```

</details>

#### 缺口

- 未验证双root/并发改文、审计失败及临时名碰撞后恢复。
  **影响**：不能把文件/指针存在或单文件原子替换当可靠长期记忆与完整审计。
  **进一步探讨**：副本中固定授权后换root/正文，注入审计/登记失败和同毫秒写，核实际文件/日志/回执，不能以整体ok掩盖部分失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原文回读和自动暂存分别有什么边界？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

seq回读用session.eventAt读取并通过eventTextOf提取文本，超过maxChars在事件边界break保留truncated标记。单事件大于预算时连该事件都未返回，拆seq区间也不能将一个事件拆开，所以胶囊指针不是保证任意长原文可读，更不等原始事件对象全量备份；恢复需知道遗漏边界，而不能反复请求同一seq。

自动Git暂存要按布局分别看。shouldAutoStage在V3记忆子目录无条件allow:false，即使清单autoGitAdd:true也不生效；V2仍默认允许，除非清单显式false。stage是实际Git副作用，不能对所有项目泛称关闭，也不能将配置值当实际结果。插件把configured与真实判据分开展示有可借鉴性；首次采用必须核项目root/清单/V2V3及隐私，失败恢复应查真实index和记忆路径，不运行自己的git add来验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part1.js:1826-1851](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part1.js#L1826-L1851)

文本seq回读与超预算事件break。

<details>
<summary>查看原文（26行）</summary>

```text
  const maxChars = Math.max(200, Number(opts?.maxChars) || 24000);
  const withReasoning = opts?.reasoning !== false;
  if (typeof session?.eventAt !== "function") {
    return { ok: false, reason: "这个执行里没有可读的会话（session.eventAt 不存在）" };
  }
  const out = [];
  let chars = 0;
  let truncated = false;
  for (let seq = a; seq <= b; seq += 1) {
    let e;
    try {
      e = session.eventAt(seq);
    } catch {
      e = undefined;
    }
    if (e === undefined || e === null) continue;
    const text = eventTextOf(e, withReasoning);
    if (text === "") continue;
    const hit = text.length;
    if (chars + hit > maxChars) {
      // ★ 超闸门就**在事件边界截断**并如实标注 —— 绝不许悄悄截半个事件（那会失真）。
      truncated = true;
      break;
    }
    chars += hit;
    out.push({ seq, type: e.type, time: e.time, text });
```

</details>

**依据 2 · 源码核查**：[lib/part2.js:3754-3781](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2.js#L3754-L3781)

V3拒绝与V2默认stage。

<details>
<summary>查看原文（28行）</summary>

```text
export function shouldAutoStage(info) {
  const projectRoot = typeof info?.projectRoot === "string" ? info.projectRoot : "";
  if (projectRoot === "") return { allow: false, reason: "没有项目根" };
  if (!fs.existsSync(path.join(projectRoot, ".git"))) {
    return { allow: false, reason: "项目不是 git 仓库" };
  }

  const mb = memoryBaseOf(info, projectRoot);
  let isV3 = false;
  try {
    isV3 = path.resolve(mb) !== path.resolve(projectRoot);
  } catch {
    isV3 = mb !== projectRoot;
  }

  if (isV3) {
    return {
      allow: false,
      v3: true,
      reason:
        "第三代项目（记忆在 " +
        mb +
        "）默认禁止自动暂存；清单里的 autoGitAdd 不能重新开启它（任务书 §3.1）",
    };
  }

  const allow = info?.manifest?.autoGitAdd !== false;
  return { allow, reason: allow ? "第二代默认允许（清单未显式关闭）" : "清单显式关闭" };
```

</details>

**依据 3 · 源码核查**：[lib/part3.js:3717-3727](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part3.js#L3717-L3727)

unsafe/configured与实际stage判据区分。

<details>
<summary>查看原文（11行）</summary>

```text
        // ★ 清单被降级的证据（`../` / 绝对路径 / 符号链接逃逸）：有值就说明**配置没被采纳**，
        //   这正是"报了 memoryRoot 却还在项目根"的唯一解释 —— 必须一起报出来，否则那是个哑谜。
        memoryRootUnsafe: info.memoryRootUnsafe ?? null,
        manifestBroken: info.manifestBroken ?? null,
        unsafePaths: info.unsafePaths ?? null,
        // ★ 010 的 D-01 之一：`autoGitAdd` 是**残留还是真开了**。
        //   `shouldAutoStage()` 对 V3 无条件拒绝，所以 `autoGitAdd:true` 在 V3 下**不生效**；
        //   但"清单里写着 true"和"真的会 stage"是两件事，分开报才不会被误读。
        autoGitAddConfigured: info.manifest?.autoGitAdd ?? null,
        autoStage: (() => {
          const r = shouldAutoStage(info);
```

</details>

#### 缺口

- 超大单事件回读替代、真实暂存集合和多布局恢复未验收。
  **影响**：不能把文件/指针存在或单文件原子替换当可靠长期记忆与完整审计。
  **进一步探讨**：构造超预算事件和V2/V3副本，核文本缺口、阶段回执/真实index及退出，不用作者事故注释代复现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种范围可试用，如何改进授权和多资产收据？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议只在可备份V3非关键项目限定试用，先核root、清单和拒写、授权窗口、暂存策略及压缩回读；定期人工比较记忆与真实文件/目标。首次有布局、隐私和规则配置，持续有卡/台账整理、注入/压缩模型token与复核，失败需对齐主文件/清单/审计/归档，现金及时间未知。禁用不会撤历史或修复已写项目，V2的Git index也需另核；出现日志/文本缺口或未经具体认可的原则变更，应停止自动依赖，回备份与手工笔记。

可证伪假设是授权绑定session、real root、目标、内容摘要及expected revision，主写/清单/审计各状态汇成收据；超大事件提供明确片内偏移回读。相对继续堆记忆类型，这可能减少错写与假完整，但新增冲突重提、恢复日志和回读复杂度。用双root、并发正文、审计失败、超大事件对照当前与新方案，测错写阻断、证据完整、误阻及人工恢复；仍无法恢复或合法操作频繁误阻则否定。没有长期记忆效果实证，不预认新方案收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/part4.js:2810-2843](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part4.js#L2810-L2843)

当前会话授权窗口的可绑定点。

<details>
<summary>查看原文（34行）</summary>

```text
    const sidForGrant = String(exec?.agent?.session?.header?.id ?? "");
    const grant = sidForGrant === "" ? undefined : principleGrantOf(state, sidForGrant);
    const authorizedBy = grant === undefined ? "" : grant.authorizedBy;
    if (authorizedBy === "") {
      return {
        ok: false,
        reason:
          "**根本原则条例只能由用户授权后写入** —— 这次调用没有携带**由用户动作产生**的授权，所以一个字节都没写。\n" +
          (forged
            ? "★ 注意：你（或调用方）传了 `authorizedBy`，但**那个字符串从来就不是授权凭据** ——\n" +
              "  任何人都能写一个字符串，所以它证明不了任何事（v1.2.8 起已把它从工具参数里彻底移除）。\n"
            : "") +
          "★ 正确流程（两条，任选）：\n" +
          `  ① 用 \`${PRINCIPLE_GRANT_TOOL}\` 弹一张**授权卡片**，用户点了"授权"即可（一次一授权）；\n` +
          "  ② 用 `ledger_propose_principle` 登记**一条具体提议**，" +
          "再请用户敲 `/ledger principles approve` —— ★ 批准**只在命令行层**，你调不到。",
        refused: true,
        ...(forged ? { selfAssertedAuthIgnored: true } : {}),
        hint: PRINCIPLE_GRANT_TOOL,
      };
    }
    const r = writePrinciples(root, {
      content,
      mode: explicitMode ?? "append",
      authorizedBy,
      exec,
      tag,
    });
    // ★★★ **一次一授权**：写成功后**立刻消费掉**那个窗口。
    //   ★ 为什么必须消费（而不是留着）：留着就等于"点一次 = 此后随便改"，
    //     守卫当场退化成空的。用户的原话是"解锁**改原则的权利**"，
    //     而本项目一贯的取舍是"授权针对**某一次具体修改**"（见 `PRINCIPLE_AUTH_TTL_MS`）。
    if (r.ok === true && grant !== undefined) {
      consumePrincipleGrant(state, sidForGrant);
```

</details>

**依据 2 · 源码核查**：[lib/part2.js:122-151](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part2.js#L122-L151)

多资产部分状态收据依据。

<details>
<summary>查看原文（30行）</summary>

```text
  const _w = writeFileAtomic(abs, next);
  if (_w.ok !== true) throw new Error(String(_w.reason ?? "原子写失败"));
  if (needRegisterPr) {
    // ★ 落盘成功后再登记进清单 —— 防止路径越界或写盘失败时提前污染 .dsh-ledger.json。
    try {
      registerPrinciplesInManifest(root, info, relPath);
    } catch {
      /* 登记失败不挡写入：文件写下去，下次 inspect 会按 guess 认到它 */
    }
  }

  // ★★ 用户要求"每一次修改都同步到日志中" —— 走**同一个**审计出口。
  const rec = {
    kind: AUDIT_KIND_PRINCIPLE,
    tag: tag ?? "(无编号)",
    target: "principles",
    mode: m,
    relPath,
    lines: countLines(next),
    sessionId: String(exec?.agent?.session?.header?.id ?? ""),
    authorizedBy: String(authorizedBy ?? "unknown"),
  };
  let audit;
  try {
    audit = appendAudit(root, info, rec);
  } catch {
    /* 审计写失败不许挡住原则落盘（与台账那条同一口径） */
  }
  return {
    ok: true,
```

</details>

**依据 3 · 源码核查**：[lib/part1.js:1844-1848](https://github.com/18477514055/dsh-ledger-memory/blob/edca61f3b974db244205ba510be42f9c96834f82/lib/part1.js#L1844-L1848)

超大事件缺口依据。

```text
    const hit = text.length;
    if (chars + hit > maxChars) {
      // ★ 超闸门就**在事件边界截断**并如实标注 —— 绝不许悄悄截半个事件（那会失真）。
      truncated = true;
      break;
```

#### 缺口

- 真实采用、授权绑定/多资产收据与长期接续对照未执行。
  **影响**：不能把文件/指针存在或单文件原子替换当可靠长期记忆与完整审计。
  **进一步探讨**：以新匿名项目和故障矩阵检验错误、恢复、总token及人时，再决定是否持续采用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
