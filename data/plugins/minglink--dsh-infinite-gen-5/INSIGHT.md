# 无限五代 IG5

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[914a989](https://github.com/Minglink/dsh-infinite-gen-5/tree/914a98990cada44fa7105cb31f085a8fbc5ac68c)

<!-- BEGIN META -->
[![GitHub ★ 3,459](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C459&color=yellow&logo=github&style=flat)](https://github.com/Minglink/dsh-infinite-gen-5)
<!-- END META -->

> **实现功能**：在DSH中整合二进制静态分析、原生调试、网络采集与证据工作台。

> **核心亮点**：[Q02](#research-q02)把样本稳定身份、多引擎worker、宿主审批与报告归属连成流程，减少地址/样本错配；底层反编译和调试能力归属原引擎。

> **风险与缺陷**：[Q03](#research-q03)审批不等于sandbox或完全Undo，事后审计写失败还可能无日志；静态推断不能替代真实执行证据。

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
  - [Q01 · 逆向工作台面向什么任务，合格交付物如何定义？](#detail-section-11)
  - [Q02 · 如何把多个引擎的对象身份与宿主审批连起来？](#detail-section-12)
  - [Q03 · 审批与Undo是否使执行安全且可完全撤销？](#detail-section-13)
  - [Q04 · 自包含安装是否等于接入轻量？](#detail-section-14)
  - [Q05 · 如何让证据链强于模型叙述而减少错误归因？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向处理自有或获授权二进制的逆向分析人员，将静态函数检视、调试、网络采集和证据报告连到DSH。合格交付物应绑定样本哈希、数据库修订和实际观察，区分反编译/仿真推断与执行证据。原办法是独立Ghidra、调试器和人工报告；需要跨引擎来回复核的任务才可能受益，偶发查看字符串不必承担整个工作台。作者说明Core8/Full40是暴露配置，不把工具数量当业务收益。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 静态分析 | 函数与样本调查 | 后端支持决定覆盖 |
| 多引擎执行 | Ghidra和原生调试适配 | 完整资产与权限 |
| 样本身份 | 报告绑定SHA和修订 | 不是结论正确认证 |
| 审批写入 | 控制修改/执行 | 外部效果不能完全Undo |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH profile与approval | 必需 | 工具和写入授权 | 写操作拒绝 |
| 完整引擎资产 | 相应后端必需 | 分析/调试 | doctor核查，不猜就绪 |
| 合法样本与恢复副本 | 必需 | 可控研究 | 不执行目标 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户核验完整包并装克隆profile | 冷启动并核profile版本 |
| 2 | 运行engines/doctor核查 | 实际启动而非文件存在 |
| 3 | 静态只读样本核对证据 | 异常保留记录重新open |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 完整包、引擎和数据库 | 资产hash与profile配置 | 体积时间未量化 |
| 持续 | 多worker/模型/样本空间 | 专业复核和授权 | 单位任务成本未知 |
| 失败恢复 | 重开引擎与数据库 | 核对实际修改和审计 | 外部Python效果不可逆 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 身份一致 | fd稳定hash与变动拒绝 | 完整业务恢复 |
| 受控修改 | approval门 | 原生执行与审计必达 |

> **思考**：[Q03](#research-q03)审批不等于sandbox或完全Undo，事后审计写失败还可能无日志；静态推断不能替代真实执行证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)把样本稳定身份、多引擎worker、宿主审批与报告归属连成流程，减少地址/样本错配；底层反编译和调试能力归属原引擎。

[Q02](#research-q02)把样本稳定身份、多引擎worker、宿主审批与报告归属连成流程，减少地址/样本错配；底层反编译和调试能力归属原引擎。

稳定fd指纹与引擎中立有界JSONL有借鉴价值；事后审计吞错是保持结果链与可追溯性之间的取舍。移植需保留样本身份、数据库修订、原生进程清理，不能只复制工具定义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)审批不等于sandbox或完全Undo，事后审计写失败还可能无日志；静态推断不能替代真实执行证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉逆向工具的DSH用户可先在克隆profile与可丢弃授权样本上试静态分析链。相比多工具手工搬运，它将样本身份和审批证据纳入同一工作台，但准确性和总耗时未实测。若运行资产、审计或副作用恢复不能核清，就停止调试写入并退回独立分析工具。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、source/project_store.js、source/worker_transport.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[Minglink/dsh-infinite-gen-5](https://github.com/Minglink/dsh-infinite-gen-5)
- **版本号**：1.1.0（[固定提交 914a989](https://github.com/Minglink/dsh-infinite-gen-5/tree/914a98990cada44fa7105cb31f085a8fbc5ac68c)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出关键修改意图与结果双记录的未验证假设，用磁盘故障和worker退出对照结果可判定性。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 70 | 4130 | — | — | 158481 |
| .js | source | 87 | 17299 | 16397 | 466 | — |
| .mjs | source | 162 | 22532 | 21487 | 493 | — |
| .mjs | example | 9 | 408 | 379 | 27 | — |

</details>

**活跃度**

[![Issue 未关闭 27](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=grey&logo=github&style=flat)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 14](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=14&color=grey&logo=github&style=flat)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+created%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/Minglink/dsh-infinite-gen-5/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A07%3A10.506Z..2026-10-26T09%3A07%3A10.506Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查无限五代 IG5的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 逆向工作台面向什么任务，合格交付物如何定义？

**研究主题**：场景与需求、采用判断

#### 完整回答

面向处理自有或获授权二进制的逆向分析人员，将静态函数检视、调试、网络采集和证据报告连到DSH。合格交付物应绑定样本哈希、数据库修订和实际观察，区分反编译/仿真推断与执行证据。原办法是独立Ghidra、调试器和人工报告；需要跨引擎来回复核的任务才可能受益，偶发查看字符串不必承担整个工作台。作者说明Core8/Full40是暴露配置，不把工具数量当业务收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-31](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/README.md#L13-L31)

任务方向、授权和能力边界

<details>
<summary>查看原文（19行）</summary>

```text
**无限五代（dsh-infinite-gen-5 / IG5）** 是面向 DeepSeek Harness（DSH）的逆向分析插件与可视化工作台，将静态分析、原生调试、流量采集、数据分析和智能体协作接入同一套工作流。

默认 **Core 8** 提供日常分析入口，按需展开 **Full 40**；13 个修改或执行入口经过宿主审批。分析围绕样本身份、数据库修订和证据报告展开，不把模型推测当作已验证结论。

[下载完整安装包](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.1.0) · [快速安装](#local-install) · [常用指令](#commands) · [使用文档](#documentation) · [版本更新](#updates) · [交流社区](#community)

> 仅限自有或合法授权目标的逆向工程、安全审计与教学研究。项目独立维护，与 DeepSeek 官方无隶属或官方背书关系；自有代码及文档的非商用要求见文末许可声明。

## 能做什么

| 方向 | 主要能力 | 使用边界 |
| :--- | :--- | :--- |
| 静态分析 | 函数、字符串、交叉引用、反编译、CFG、类型、结构体、虚表与跳转表检视 | 支持情况依赖具体后端；部分分析与未决结果保留标记 |
| 可视化工作台 | SVG CFG 平移/缩放、双击查看汇编、局部变量焦点高亮、结构体草稿与审计时间线 | 焦点行过滤不等于完整污点分析；编辑草稿仍需发送并审批 |
| 调试与仿真 | x64dbg 原生调试、断点、寄存器/内存、受限轨迹；Unicorn 单函数仿真 | 执行需要授权和审批；仿真不提供完整 OS、import 或 TLS 环境 |
| HTTP/HTTPS 采集 | 本机代理、显式 TLS 解密、流量历史、证据导出、请求重放与下发载荷提取 | 仅批准 origin；不自动修改系统代理或证书信任，不等同完整 Burp 功能 |
| 解密与协议 | 编码/压缩检查、XOR/AES、有界候选检索、PCAP/PCAPNG 解析、分帧与观察状态模型 | 不保证未知密钥恢复或隐藏服务器语义；缺口、冲突与外推假设保留 |
| IR 与去混淆研究 | 真实 p-code/SSA、单函数只读去混淆覆盖层、路径投影、状态组合与离线轨迹恢复 | 局部模型或数学证明不等于通用去壳、完整 VM 或业务恢复 |
| 调查与子代理协作 | 单函数 dossier、持久调查任务、受控 handoff、证据回交与根会话共享调用预算 | DSH 负责派工；插件核验身份/证据/生命周期，不认证模型理解或结论正确性 |
```

</details>

#### 缺口

- 专业用户跨引擎办结时间、准确性和实际采用未量化。
  **影响**：专业调查价值还不能换算为准确性或节时收益。
  **进一步探讨**：让熟悉Ghidra的研究者用同一授权样本比较人工报告与插件证据交接，核对可追溯性和纠错。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何把多个引擎的对象身份与宿主审批连起来？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

index创建WorkerManager并按目标路径/engine维护sessions与launching map；ProjectStore对样本打开稳定fd计算SHA并比较前后inode、size和时间，变动则拒绝，以区分“同路径不同样本”。worker_transport选择Ghidra或其他engine的Python进程，通过有界JSONL收帧、ready握手及请求期限通讯。宿主pre-execute对写工具要求agent及approval service，只有allowed-once进入next；post-execute另记审计。相对人工复制地址和报告，贡献是固定身份、受控调用与证据持久化的组合，不是取代Ghidra分析算法。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:99-119](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L99-L119)

池和目标engine键

<details>
<summary>查看原文（21行）</summary>

```text
// ── Worker 池（小样：1 目标 = 1 Python 进程，JSON-RPC over stdio） ──────────
class WorkerManager {
  constructor(cfg) {
    this.cfg = cfg;
    this.sessions = new Map(); // key: lower(abs target path)
    this.launching = new Map(); // serialize concurrent opens of the same target
    this.jobs = new Map(); // 后台分析作业的进度投影（工作台轮询 /ig5-jobs）
    this.seq = 0;
    this.scope = new AsyncLocalStorage();
    this.projects = new ProjectStore({ root: cfg.projectRoot });
    this.debugOwners = new Map();
    this.debugQueues = new Map();
    this.admissions = Promise.resolve();
    // A lease is recoverable only after both recorded owners are proven dead.
    const retained = this.remoteExecutionStatus();
    this.attachmentRecovery = this.projects.recoverAttachments({ retainDebugArtifacts: retained.map(row => 'artifact_' + row.targetSha256) });
  }

  sessionKey(target, engine = this.scope.getStore()?.engine || this.cfg.defaultEngine || 'reverse') {
    const absolute = path.resolve(String(target));
    const base = (this.cfg.host?.platform || process.platform) === 'win32' ? absolute.toLowerCase() : absolute;
```

</details>

**依据 2 · 源码核查**：[source/project_store.js:51-67](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/project_store.js#L51-L67)

稳定fd样本哈希与变动拒绝

<details>
<summary>查看原文（17行）</summary>

```text
/** Hash a stable file descriptor, detecting replacement or edits during the read. */
function fingerprint(target) {
  const fd = fs.openSync(target, 'r');
  try {
    const before = fs.fstatSync(fd, { bigint: true });
    if (!before.isFile()) fail('INVALID_TARGET', 'Target must be a regular file');
    const hash = createHash('sha256');
    const buffer = Buffer.allocUnsafe(1024 * 1024);
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, count));
    const after = fs.fstatSync(fd, { bigint: true });
    const current = fs.statSync(target, { bigint: true });
    for (const key of ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs']) {
      if (before[key] !== after[key] || after[key] !== current[key]) fail('TARGET_CHANGED', 'Target changed while its identity was being calculated');
    }
    return { sha256: hash.digest('hex'), size: before.size.toString() };
  } finally { fs.closeSync(fd); }
```

</details>

**依据 3 · 源码核查**：[source/worker_transport.js:15-46](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/worker_transport.js#L15-L46)

引擎进程配置

<details>
<summary>查看原文（32行）</summary>

```text
export function workerLaunch(cfg, engine, pluginRoot) {
  const paths = ['linux', 'darwin'].includes(cfg.host?.platform) ? path.posix : path;
  const env = { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };
  const builtinReverse = engine === 'reverse' && cfg.reverseProvider === 'bundled';
  const provider = builtinReverse ? 'ghidra' : engine;
  let executable, args;
  if (provider === 'reverse') {
    if (!cfg.reverseAvailable) throw new Error('Reverse runtime is unavailable; configure it or use engine=ghidra');
    executable = cfg.pythonExe;
    args = ['-X', 'utf8', paths.join(pluginRoot, 'worker', 'ig5_worker.py'), '--ida-dir', cfg.idaDir];
  } else {
    const pack = cfg[provider];
    if (!pack?.available) throw new Error(`${builtinReverse ? 'Bundled Reverse' : engine} runtime is unavailable: ${pack?.reason || 'not configured'}`);
    executable = pack.pythonExe;
    args = provider === 'x64dbg' && cfg.guestExecutionProfile
      ? ['-I', '-B', paths.join(pluginRoot, 'adapters', 'vmci', 'adapter.py'), '--profile', cfg.guestExecutionProfile.path, '--profile-sha256', cfg.guestExecutionProfile.sha256]
      : ['-I', '-B', paths.join(pluginRoot, 'adapters', provider, provider === 'ghidra' ? 'worker.py' : 'adapter.py')];
    if (provider === 'ghidra') Object.assign(env, {
      IG5_GHIDRA_HOME: pack.ghidraHome, IG5_JAVA_HOME: pack.javaHome,
      IG5_GHIDRA_PROJECT_ROOT: paths.join(cfg.projectRoot, builtinReverse ? 'reverse-databases' : 'ghidra-databases'),
      IG5_GHIDRA_ROUTE: engine,
    });
    else Object.assign(env, {
      ...(cfg.home ? { IG5_HOME: cfg.home } : {}),
      IG5_X64DBG_RUNTIME: pack.manifest,
      IG5_X64DBG_STATE_ROOT: paths.join(cfg.stateRoot || paths.join(cfg.home || cfg.artifactDir || cfg.projectRoot, 'state'), 'x64dbg'),
    });
  }
  return { executable, args, options: {
    stdio: ['pipe', 'pipe', 'pipe'], windowsHide: true, env,
    // A new POSIX process group lets timeout cleanup include native decompiler children.
    ...(['linux', 'darwin'].includes(cfg.host?.platform) ? { detached: true } : {}),
```

</details>

**依据 4 · 源码核查**：[source/worker_transport.js:81-100](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/worker_transport.js#L81-L100)

有界收帧和ready

<details>
<summary>查看原文（20行）</summary>

```text
    this.dataListener = data => {
      if (this.failure || this.disposed) return;
      const bytes = Buffer.isBuffer(data) ? data : Buffer.from(String(data), 'utf8');
      if (bytes.length > this.limits.bufferBytes - this.buffer.length) { this.protocolFailure('bufferBytes'); return; }
      this.buffer = this.buffer.length ? Buffer.concat([this.buffer, bytes]) : bytes;
      let end;
      while ((end = this.buffer.indexOf(10)) >= 0) {
        if (end > this.limits.lineBytes) { this.protocolFailure('lineBytes'); return; }
        const byteLength = end + 1, raw = this.buffer.subarray(0, end); this.buffer = this.buffer.subarray(end + 1);
        let line;
        try { line = this.decoder.decode(raw).trim(); }
        catch { this.protocolFailure('invalidUtf8'); return; }
        if (!line) continue;
        let message; try { message = JSON.parse(line); } catch { continue; }
        if (!message || typeof message !== 'object' || Array.isArray(message)) continue;
        if (message.ig5 === 'ready') {
          this.ready = true; this.readyMessage = message;
          for (const waiter of this.waiters) { this.timers.clearTimeout(waiter.timer); waiter.resolve(); }
          this.waiters.clear();
        }
```

</details>

**依据 5 · 源码核查**：[index.js:1001-1016](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L1001-L1016)

审批门

<details>
<summary>查看原文（16行）</summary>

```text
    let approval;
    try { approval = ctx.get('approval'); } catch { /* uncomposed host */ }
    if (!exec?.agent || typeof approval?.request !== 'function')
      return { kind: 'deny', reason: `IG5 ${exec.name} requires an active agent and an available approval service.` };
    let outcome;
    try {
      outcome = await approval.request({ agent: exec.agent, toolName: exec.name,
        callId: exec.callId, ...request, signal: exec.signal });
    } catch {
      if (exec?.signal?.aborted) return { kind: 'cancel' };
      return { kind: 'deny', reason: `IG5 ${exec.name} approval could not be confirmed; operation was not dispatched.` };
    }
    if (exec?.signal?.aborted || outcome === 'cancelled') return { kind: 'cancel' };
    if (outcome !== 'allowed-once')
      return { kind: 'deny', reason: `IG5 ${exec.name} approval was ${outcome === 'rejected' ? 'rejected' : 'unavailable'}; operation was not dispatched.` };
    return next();
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批与Undo是否使执行安全且可完全撤销？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

不是。源码工具描述明确Python执行不是sandbox，数据库事务Undo不撤销外部Python副作用；请求超时会回收worker，但不能据此认定目标进程或外部网络结果都未发生。post-execute写approvals.jsonl出错会吞掉，保证结果链继续却可能留下审计缺口，所以“经过审批”与“审计必达”需分开。Ghidra/JDK/Python/x64dbg依赖和Windows完整发行资产必须匹配；文件存在不代表引擎启动成功。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1018-1037](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L1018-L1037)

审计落盘失败被隔离

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    try {
      fs.mkdirSync(cfg.artifactDir, { recursive: true });
      const rec = {
        ts: new Date().toISOString(),
        tool: exec.name,
        args: exec.name === 'ig5_capture_control' ? {
          action: exec.arguments?.action, id: exec.arguments?.id, session_id: exec.arguments?.session_id,
          scope: exec.arguments?.scope, port: exec.arguments?.port, tls: exec.arguments?.tls,
          ...(exec.arguments?.request ? { request: { redacted: true, method: exec.arguments.request.method,
            headerNames: Object.keys(exec.arguments.request.headers || {}), bodyProvided: exec.arguments.request.body !== undefined } } : {}),
        } : exec.arguments,
        isError: result?.isError === true,
        detail: result?.isError ? result?.error?.message : result?.value,
      };
      fs.appendFileSync(path.join(cfg.artifactDir, 'approvals.jsonl'), JSON.stringify(rec) + '\n', 'utf8');
    } catch {
      // audit must never break the result path
    }
```

</details>

**依据 2 · 源码核查**：[index.js:1953-1959](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L1953-L1959)

非sandbox与外部效果不可撤销

```text
      description:
        'Execute approved Python in the selected analysis worker and capture bounded stdout. The bundled core exposes currentProgram, flat_api and a documented common legacy Reverse Python API subset; unavailable APIs fail explicitly. Database writes use one transaction with session Undo; external Python effects are not reversible. This is not a sandbox. Hanging scripts are stopped with their owned worker by the RPC timeout.',
      parameters: {
        type: 'object',
        properties: {
          target: { type: 'string', description: 'Target path previously opened with ig5_open' },
          code: { type: 'string', description: 'Python source; bundled core: Ghidra FlatProgramAPI/currentProgram or documented legacy Reverse API subset, max 64 KiB' },
```

**依据 3 · 源码核查**：[source/worker_transport.js:211-222](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/worker_transport.js#L211-L222)

RPC超时回收

<details>
<summary>查看原文（12行）</summary>

```text
  request(session, method, params, { timeoutMs, signal, onProgress, mutation = false, onTimeout } = {}) {
    if (signal?.aborted) return Promise.reject(Object.assign(new Error('IG5 operation cancelled before execution'), { code: 'ABORT_ERR' }));
    const id = ++session.seq;
    return new Promise((resolve, reject) => {
      const pending = { method, params, resolve, reject, onProgress: typeof onProgress === 'function' ? onProgress : undefined };
      const cleanup = () => { this.timers.clearTimeout(pending.timer); pending.removeAbort?.(); session.pending.delete(id); };
      pending.timer = this.timers.setTimeout(() => {
        cleanup();
        try { onTimeout?.(); }
        catch (error) { reject(error); return; }
        reject(new Error(`worker rpc 超时（${method}，${timeoutMs}ms），已回收该 worker，可重新 ig5_open`));
      }, timeoutMs);
```

</details>

**依据 4 · 作者声明**：[README.md:39-54](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/README.md#L39-L54)

完整资产与实际启动边界

<details>
<summary>查看原文（16行）</summary>

````text
需要已安装的 DeepSeek Harness profile。完整包内置 Ghidra/JDK/Python、x64dbg/Python/bridge 和上游源码、许可及哈希清单；**不需要商业 IDA 安装**，DSH 本身不随包提供。

1. 从 [v1.1.0 Release](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.1.0) 下载 `IG5-1.1.0-Windows-x64-full-20261020.zip` 和同名 `.sha256`，核对 SHA-256。
2. 完整解压，保留 `plugin/`、`manifest.json` 及所有运行资产；不要只复制安装脚本。
3. 在解压根目录打开 PowerShell，执行：

   ```powershell
   & .\plugin\install.ps1
   ```

4. 完全退出并重启 DSH，执行 `/ig5 engines` 和 `ig5_doctor` 检查实际可用性。
5. 用 `ig5_profile` 核对 `version=1.1.0`、`implementationRevision=20261020-controlled-delegation-1`，确认新实现已加载。

安装器核验完整资产、备份已有插件并配置 profile。缺件或哈希不符时拒绝安装；不要修改清单或跳过校验。诊断中的“文件存在”不等于引擎已成功启动；若系统策略阻止原生组件，应保留阻断证据，不通过复制或改名绕过。

> **Source code ZIP / tar.gz 与 git clone 是维护源码，不是完整离线安装包。** 普通安装请下载上述命名的 Windows 完整 ZIP。仅切换插件开关可能复用旧模块，更新后应冷启动 DSH。
````

</details>

#### 缺口

- 原生进程清理、崩溃时数据库修订和审计完整性未在本轮验收。
  **影响**：审计失败、worker退出和数据库中断可能造成未知结果，不能保证全Undo。
  **进一步探讨**：在可丢弃样本注入audit目录不可写、RPC超时和worker终止，核对数据库修订、原生子进程与报告。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自包含安装是否等于接入轻量？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次Windows用户需要下载核验完整包和profile，冷启动后检查engines/doctor/profile；源码clone不能代替离线完整资产。持续成本包括分析数据库、多个worker、样本存储和模型复核，maxSessions默认3且openTimeout默认30分钟，说明并非轻型看图工具。失败可能要重新open目标、确认数据库和报告身份，并人工修正中断状态。具备逆向工具经验的用户可在可丢弃样本与克隆profile中先试静态只读链；原生调试和任意Python应另行确认目标与恢复方法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-54](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/README.md#L39-L54)

资产安装及冷启动

<details>
<summary>查看原文（16行）</summary>

````text
需要已安装的 DeepSeek Harness profile。完整包内置 Ghidra/JDK/Python、x64dbg/Python/bridge 和上游源码、许可及哈希清单；**不需要商业 IDA 安装**，DSH 本身不随包提供。

1. 从 [v1.1.0 Release](https://github.com/Minglink/dsh-infinite-gen-5/releases/tag/v1.1.0) 下载 `IG5-1.1.0-Windows-x64-full-20261020.zip` 和同名 `.sha256`，核对 SHA-256。
2. 完整解压，保留 `plugin/`、`manifest.json` 及所有运行资产；不要只复制安装脚本。
3. 在解压根目录打开 PowerShell，执行：

   ```powershell
   & .\plugin\install.ps1
   ```

4. 完全退出并重启 DSH，执行 `/ig5 engines` 和 `ig5_doctor` 检查实际可用性。
5. 用 `ig5_profile` 核对 `version=1.1.0`、`implementationRevision=20261020-controlled-delegation-1`，确认新实现已加载。

安装器核验完整资产、备份已有插件并配置 profile。缺件或哈希不符时拒绝安装；不要修改清单或跳过校验。诊断中的“文件存在”不等于引擎已成功启动；若系统策略阻止原生组件，应保留阻断证据，不通过复制或改名绕过。

> **Source code ZIP / tar.gz 与 git clone 是维护源码，不是完整离线安装包。** 普通安装请下载上述命名的 Windows 完整 ZIP。仅切换插件开关可能复用旧模块，更新后应冷启动 DSH。
````

</details>

**依据 2 · 源码核查**：[index.js:62-74](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L62-L74)

状态目录、超时和session上限

<details>
<summary>查看原文（13行）</summary>

```text
    projectRoot: cfg.projectRoot || (cfg.artifactDir ? path.join(cfg.artifactDir, 'projects') : runtime.projectRoot),
    stateRoot: cfg.stateRoot || (cfg.artifactDir ? path.join(cfg.artifactDir, 'runtime-state') : path.join(runtime.home, 'state')),
    requestTimeoutMs: Number(cfg.requestTimeoutMs ?? 240_000),
    // 后台分析是长任务：单独一档超时，别让 240s 的短超时杀掉大二进制
    openTimeoutMs: Number(cfg.openTimeoutMs ?? 1_800_000),
    maxSessions: Number(cfg.maxSessions ?? 3),
    artifactDir: cfg.artifactDir || path.join(runtime.home, 'artifacts'),
    autoOpenHint: cfg.autoOpenHint !== false,
    backgroundOpen: cfg.backgroundOpen !== false,
    toolset: cfg.toolset || 'core',
    capture: cfg.capture ?? {},
    guestDebugProfiles: guestProfileConfiguration(cfg.guestDebugProfiles),
    remoteExecutionRoot: path.resolve(cfg.remoteExecutionRoot || path.join(runtime.home, 'remote-executions')),
```

</details>

**依据 3 · 源码核查**：[source/worker_transport.js:211-222](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/worker_transport.js#L211-L222)

超时重开提示

<details>
<summary>查看原文（12行）</summary>

```text
  request(session, method, params, { timeoutMs, signal, onProgress, mutation = false, onTimeout } = {}) {
    if (signal?.aborted) return Promise.reject(Object.assign(new Error('IG5 operation cancelled before execution'), { code: 'ABORT_ERR' }));
    const id = ++session.seq;
    return new Promise((resolve, reject) => {
      const pending = { method, params, resolve, reject, onProgress: typeof onProgress === 'function' ? onProgress : undefined };
      const cleanup = () => { this.timers.clearTimeout(pending.timer); pending.removeAbort?.(); session.pending.delete(id); };
      pending.timer = this.timers.setTimeout(() => {
        cleanup();
        try { onTimeout?.(); }
        catch (error) { reject(error); return; }
        reject(new Error(`worker rpc 超时（${method}，${timeoutMs}ms），已回收该 worker，可重新 ig5_open`));
      }, timeoutMs);
```

</details>

#### 缺口

- 实际安装体积、分析耗时、内存与恢复人时未核实。
  **影响**：资源和恢复负担未知，限制长期使用经济性。
  **进一步探讨**：记录完整包体积、冷启动、分析任务内存及重开数据库的人时，不将文件存在视为启动通过。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让证据链强于模型叙述而减少错误归因？

**研究主题**：新假设与验证

#### 完整回答

由样本稳定哈希和审计可能丢失推导未验证假设：对关键写入先持久记录意图、执行后绑定数据库修订与结果摘要，审计失败时明确标记结果待核对，可能比事后尽力append更适合团队交接。相对再增工具，增量是可区分未执行、成功和未知结果。使用可丢弃样本注入磁盘写失败与worker退出，对照当前事后日志和意图/结果双记录，核对能否恢复实际发生的修改；如果增加阻塞却不能提高可判定率，则不推广。

#### 证据与依据

**依据 1 · 源码核查**：[source/project_store.js:51-67](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/source/project_store.js#L51-L67)

稳定身份基础

<details>
<summary>查看原文（17行）</summary>

```text
/** Hash a stable file descriptor, detecting replacement or edits during the read. */
function fingerprint(target) {
  const fd = fs.openSync(target, 'r');
  try {
    const before = fs.fstatSync(fd, { bigint: true });
    if (!before.isFile()) fail('INVALID_TARGET', 'Target must be a regular file');
    const hash = createHash('sha256');
    const buffer = Buffer.allocUnsafe(1024 * 1024);
    let count;
    while ((count = fs.readSync(fd, buffer, 0, buffer.length, null)) > 0) hash.update(buffer.subarray(0, count));
    const after = fs.fstatSync(fd, { bigint: true });
    const current = fs.statSync(target, { bigint: true });
    for (const key of ['dev', 'ino', 'size', 'mtimeNs', 'ctimeNs']) {
      if (before[key] !== after[key] || after[key] !== current[key]) fail('TARGET_CHANGED', 'Target changed while its identity was being calculated');
    }
    return { sha256: hash.digest('hex'), size: before.size.toString() };
  } finally { fs.closeSync(fd); }
```

</details>

**依据 2 · 源码核查**：[index.js:1018-1037](https://github.com/Minglink/dsh-infinite-gen-5/blob/914a98990cada44fa7105cb31f085a8fbc5ac68c/index.js#L1018-L1037)

当前审计失败窗口

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.on('tools/post-execute', async (exec, result, next) => {
    if (!IG5_WRITE_TOOLS.has(exec?.name)) return next();
    try {
      fs.mkdirSync(cfg.artifactDir, { recursive: true });
      const rec = {
        ts: new Date().toISOString(),
        tool: exec.name,
        args: exec.name === 'ig5_capture_control' ? {
          action: exec.arguments?.action, id: exec.arguments?.id, session_id: exec.arguments?.session_id,
          scope: exec.arguments?.scope, port: exec.arguments?.port, tls: exec.arguments?.tls,
          ...(exec.arguments?.request ? { request: { redacted: true, method: exec.arguments.request.method,
            headerNames: Object.keys(exec.arguments.request.headers || {}), bodyProvided: exec.arguments.request.body !== undefined } } : {}),
        } : exec.arguments,
        isError: result?.isError === true,
        detail: result?.isError ? result?.error?.message : result?.value,
      };
      fs.appendFileSync(path.join(cfg.artifactDir, 'approvals.jsonl'), JSON.stringify(rec) + '\n', 'utf8');
    } catch {
      // audit must never break the result path
    }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
