# DSH SSH Ops

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[bcea46d](https://github.com/caoyiwei850/dsh-ssh-ops/tree/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5)

<!-- BEGIN META -->
[![GitHub ★ 52](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=52&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/caoyiwei850/dsh-ssh-ops) [![npm 30d 5,005](https://img.shields.io/static/v1?label=npm+30d&message=5%2C005&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ssh-ops) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-ssh-ops)
<!-- END META -->

> **功能**：主对话与人工终端共用远端连接，集成SSH/SFTP/数据库和危险操作审批。

> **亮点**：[Q01](#research-q01)人机共享运维上下文；[Q03](#research-q03)一次性连接+命令授权；[Q04](#research-q04)回收站与表隔离保护组合。

> **主要限制**：[Q03](#research-q03)共享活动目标/黑名单非幂等或沙箱，普通命令可重试；[Q04](#research-q04)“保护”仍能覆文件/改表名，取消/close不回滚；[Q05](#research-q05)本地核心工具不迁远端。

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
  - [Q01 · 同屏人机运维台如何区别于已有SSH/DB工具？](#detail-section-11)
  - [Q02 · 连接目标、凭据和主机身份实际怎样确定？](#detail-section-12)
  - [Q03 · 危险审批真的挡执行吗，取消和断线会怎样？](#detail-section-13)
  - [Q04 · 文件/数据库保护会产生什么真实副作用？](#detail-section-14)
  - [Q05 · 远程工作区和退出能否替代远端运行环境？](#detail-section-15)
  - [Q06 · 如何从宽工具箱走向可验证运维交接？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：原生DSH Web双端插件dsh-ssh-ops0.4.4，让主对话驱动远端，同时人可在右侧真实终端接管，并含SFTP、隧道和数据库工具。目标是具体服务器上的诊断/变更及人可核结果，不是终端能打开。基线是SSH客户端+DB客户端与对话来回搬运，SSH加密、驱动和PTY是已有ssh2/DB能力，不是本插件发明。

现成SSH/DB客户端、DSH远端执行/文件插件；传输加密/SQL驱动已有，UI集中不是新流程。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| SSH命令/PTY | 远端运维和人工接管 | 共享目标/规则不是沙箱 |
| SFTP | 读写删除 | 写可直接覆盖，回收会过期 |
| DB | 执行/事务/保护 | 隔离改表本身影响业务 |
| 工作区 | SFTP远端根映射 | 核心本地工具仍本地 |
| 日志/连接 | 可见/清理 | 非全事务审计恢复 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH Web/tools/storageDomain/credentials | 必需 | 原生双端服务 | 宿主版本须核 |
| SSH低权账号/核实指纹 | SSH必需 | 实际远端执行 | TOFU首次非独立核实 |
| DB账号/驱动/网络 | 按需 | 查询/事务/隔离 | 方言/权限/恢复不同 |
| Host审批/操作者/备份 | 写操作前提 | 人工责任和恢复 | 黑名单不是完整安全边界 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 准备 | 专用测试账号和备份 | 不从对话喂生产密钥 |
| 连接 | 核host/id/指纹与当前终端 | 多连接显式指定 |
| 诊断 | 小量只读，核cwd与结果 | 不因规则放行认幂等 |
| 变更 | 单项审批，核文件/服务/表 | 备份/回收事件逐项核 |
| 中断退出 | 查结果不明/远端状态再恢复 | 停连接不回滚，清凭据日志残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 机器/DB/模型费用未知 | 身份权限/兼容/备份 | 开源非总成本0 |
| 持续 | token/日志/备份空间未知 | 目标/审批/结果核验 | 容量限制非合规审计 |
| 故障 | 停服/部分写/重复未知 | 查远端、还表/回收文件 | 保护过程也可改业务对象 |
| 退出 | 凭据/日志/远端留存未知 | 逐项归属清除与验证 | close不回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 人机可见 | 命令结果回面板/工具 | 净运维耗时与错目标 |
| 审批 | 单命令单连接一次凭据 | 全Agent冻结/规则完备 |
| 可逆化 | mv回收/备份改表 | 一致备份/业务恢复 |
| 失败 | 超时/部分不重放/unknown | 普通脚本幂等/远端取消 |

> **思考**：[Q03](#research-q03)共享活动目标/黑名单非幂等或沙箱，普通命令可重试；[Q04](#research-q04)“保护”仍能覆文件/改表名，取消/close不回滚；[Q05](#research-q05)本地核心工具不迁远端。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)人机共享运维上下文；[Q03](#research-q03)一次性连接+命令授权；[Q04](#research-q04)回收站与表隔离保护组合。

[Q03](#research-q03)授权绑定目标和命令并内层消费值得借鉴；必须把规则识别/幂等、取消/回滚、备份/恢复和本机/远端工具分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)共享活动目标/黑名单非幂等或沙箱，普通命令可重试；[Q04](#research-q04)“保护”仍能覆文件/改表名，取消/close不回滚；[Q05](#research-q05)本地核心工具不迁远端。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)观察；先测试服务器低权诊断及可逆小变更，显式目标，失败核远端，不批量生产放行。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只读支持代表连接/命令/文件/SQL执行与失败链，未实连或全审全部协议/面板；观察，受控低权诊断先行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/db-ops.js、src/hostkey.js、src/index.js、src/remote-workspace.js、src/safety.js、src/session-log.js、src/tools/db.js、src/tools/sftp.js、src/tools/ssh-session.js、src/trash.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核原生注册、代表ssh2身份/exec/PTY/审批、SFTP工具删除及直接写、DB普通SQL/危险guard改表/事务结束、工作区路径/卸载/日志片段；未全审5282行Host、全部数据库/隧道/批量/HTTP字节面/客户端和测试。
- 下一步：只读固定源码，不运行插件测试或实连SSH/DB/Host；没有运行/恢复/安全全审或效果成本保证。

**分析版本**

- **仓库**：[caoyiwei850/dsh-ssh-ops](https://github.com/caoyiwei850/dsh-ssh-ops)
- **版本号**：0.4.4（[固定提交 bcea46d](https://github.com/caoyiwei850/dsh-ssh-ops/tree/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)目标/变更/结果不明与核验恢复回执，故障对照验证错主机/重复/恢复人工，不当当前能力。

只读固定源码，不运行插件测试或实连SSH/DB/Host；没有运行/恢复/安全全审或效果成本保证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 2239 | — | — | 67957 |
| .js | source | 61 | 16941 | 12592 | 3399 | — |
| .mjs | source | 13 | 1774 | 1443 | 236 | — |
| .jsx | source | 11 | 6081 | 5218 | 595 | — |
| .mjs | test | 71 | 11278 | 8925 | 1290 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/caoyiwei850/dsh-ssh-ops/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/caoyiwei850/dsh-ssh-ops/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/caoyiwei850/dsh-ssh-ops/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核共享目标身份、真实变更/审批和失败恢复，区分运维台与远端运行环境。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同屏人机运维台如何区别于已有SSH/DB工具？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

原生DSH Web双端插件dsh-ssh-ops0.4.4，让主对话驱动远端，同时人可在右侧真实终端接管，并含SFTP、隧道和数据库工具。目标是具体服务器上的诊断/变更及人可核结果，不是终端能打开。基线是SSH客户端+DB客户端与对话来回搬运，SSH加密、驱动和PTY是已有ssh2/DB能力，不是本插件发明。

贡献是活动连接/远程工作区、模型工具与人工终端并存、危险命令原生审批、删除回收站与DB隔离等组合。界面集中本身不算业务流程创新；能具体归因的是命中危险规则时将执行责任交人确认，再由一次性授权执行。没有实际生产任务效益或全功能安全验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-7](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/README.md#L5-L7)

作者同屏远端运维用途。

```text
# DSH SSH Ops

> DeepSeek Harness 的 SSH 运维插件：在主对话中驱动当前服务器，同时在右侧保留真实的交互式终端，并集成文件管理、端口转发与数据库管理。
```

**依据 2 · 源码核查**：[package.json:1-20](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/package.json#L1-L20)

原生包身份/版本/MIT。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-ssh-ops",
  "description": "SSH ops and database tools for DSH Web UI: connect to remote servers via SSH terminal/SFTP/tunnels, and connect to MySQL/PostgreSQL/Redis/MongoDB databases. Host half manages sessions with ssh2; client half renders the terminal and database panel.",
  "icon": "./icon.svg",
  "version": "0.4.4",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/caoyiwei850/dsh-ssh-ops.git"
  },
  "bugs": {
    "url": "https://github.com/caoyiwei850/dsh-ssh-ops/issues"
  },
  "homepage": "https://github.com/caoyiwei850/dsh-ssh-ops#readme",
  "keywords": [
    "dsh",
    "deepseek-harness",
    "plugin",
    "ssh",
    "terminal",
```

</details>

**依据 3 · 源码核查**：[src/index.js:5215-5225](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L5215-L5225)

实际SSH/SFTP/隧道/批量/DB/日志工具注册。

<details>
<summary>查看原文（11行）</summary>

```text
  registerTools(ctx) {
    // Tool bodies live in src/tools/*; each register function binds this
    // service instance via closure (defineTool invokes execute as a bare
    // function, so the tools reach service methods through this argument).
    registerSshSessionTools(ctx, this);
    registerSftpTools(ctx, this);
    registerTunnelTools(ctx, this);
    registerBatchTools(ctx, this);
    if (this.config.registerDbAgentTools !== false) registerDbTools(ctx, this);
    registerSessionLogTools(ctx, this);
  }
```

</details>

#### 缺口

- 无真实运维事故/耗时/返工对照。
  **影响**：工具齐全不证明生产适用或安全保证。
  **进一步探讨**：限定测试服务器完成诊断与一项可逆变更，和现有SSH/DB客户端比较。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 连接目标、凭据和主机身份实际怎样确定？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Agent可显式connection_id，否则优先服务实例的activeConnectionId、再退到唯一连接，多连接无活动目标拒绝。这是共享服务的选择状态，不是每Agent/工作区的独立租户授权；运行中切换活动连接应明确核host/id。保存资源自动连接由agentAutoConnect开关拒绝/放行，实际连接后打开终端再选为active；这提供可见性，不取代账号权限。凭据解析来自宿主credentials，手工把密码/私钥传模型参数仍有对话留存风险。

真正传输new ssh2.Client并client.connect(config)，可有跳板。hostVerifier实际接SHA256指纹判据；默认accept-new信首次、变化拒绝，verify拒绝未知，off放行；knownHosts尚未初始化时attach函数也不附verifier。首次TOFU不等独立核实名机，旧设备握手可降级算法，需由操作者确认。依赖DSH工具/存储域/凭据、兼容Web客户端与远端SSH/数据库权限，不能按“一个插件”估部署成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3689-3711](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3689-L3711)

显式/活动/唯一连接与歧义拒绝。

<details>
<summary>查看原文（23行）</summary>

```text
  resolveConnection(connectionId) {
    const resourceNames = this.savedResourceNameList();
    if (connectionId !== undefined) {
      const connection = this.connections.get(connectionId);
      if (connection !== undefined) return { ok: true, connectionId, connection };
      return { ok: false, error: fail("no-connection", noConnectionGuidance(connectionId, resourceNames, this.agentAutoConnect)) };
    }
    if (this.activeConnectionId !== null) {
      const connection = this.connections.get(this.activeConnectionId);
      if (connection !== undefined) {
        return { ok: true, connectionId: this.activeConnectionId, connection };
      }
      this.activeConnectionId = null;
    }
    if (this.connections.size === 1) {
      const [resolvedId, connection] = this.connections.entries().next().value;
      return { ok: true, connectionId: resolvedId, connection };
    }
    if (this.connections.size === 0) {
      return { ok: false, error: fail("no-connection", noConnectionGuidance(undefined, resourceNames, this.agentAutoConnect)) };
    }
    return { ok: false, error: fail("connection-selection-required", "multiple SSH connections are open; select a server in the SSH panel or provide connection_id") };
  }
```

</details>

**依据 2 · 源码核查**：[src/index.js:2292-2330](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L2292-L2330)

自动连接开关、实际profileConnect、失败回退与终端打开。

<details>
<summary>查看原文（39行）</summary>

```text
  async agentConnectProfile(request) {
    if (!this.agentAutoConnect) {
      return { ok: false, error: fail("auto-connect-disabled", t(AUTO_CONNECT_DISABLED_MESSAGE)) };
    }
    let resolved;
    try {
      resolved = resolveProfileRef(
        [...this.requireProfileTable().entries()].map(([profileId, record]) => ({ profileId, name: record.name })),
        request.resource
      );
    } catch (error) {
      return { ok: false, error: fail("profile-list-failed", error.message) };
    }
    if (!resolved.ok) return { ok: false, error: fail(resolved.code, resolved.message) };
    const knownConnectionIds = new Set(this.connections.keys());
    const previousActiveConnectionId = this.activeConnectionId;
    const connected = await this.profileConnect({ profileId: resolved.profileId, reuseExisting: true });
    if (!connected.ok) return connected;
    const connectionId = connected.value.connectionId;
    const reused = knownConnectionIds.has(connectionId);
    const rollback = async (error, openedSessionId = null) => {
      if (!reused) await this.disconnect({ connectionId }).catch(() => {});
      else if (openedSessionId !== null) await this.closeSession({ sessionId: openedSessionId }).catch(() => {});
      this.activeConnectionId = previousActiveConnectionId;
      return { ok: false, error };
    };
    let terminalOpened = false;
    const connection = this.connections.get(connectionId);
    if (connection === undefined) return rollback(fail("no-connection", `connection "${connectionId}" disappeared before its terminal opened`));
    // Visibility is the safeguard: the agent's target machine must appear in
    // the right-side panel, not just exist as an invisible transport.
    let openedSessionId = null;
    if (connection.sessions.size === 0) {
      const opened = await this.openSession({ connectionId, openedBy: "agent" });
      if (!opened.ok) return rollback(opened.error);
      openedSessionId = opened.value.sessionId;
      terminalOpened = true;
    }
    const selected = await this.selectConnection({ connectionId });
```

</details>

**依据 3 · 源码核查**：[src/index.js:1085-1098](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L1085-L1098)

宿主凭据引用解析。

<details>
<summary>查看原文（14行）</summary>

```text
   */
  async resolveCredentialAuth(refs, authKind) {
    const primary = await this.ctx.credentials.resolve(credentialRef(authKind === "password" ? refs.password : refs.privateKey));
    if (primary === undefined) return undefined;
    const passphrase = authKind === "key"
      ? await this.ctx.credentials.resolve(credentialRef(refs.passphrase))
      : undefined;
    const secondary = await this.ctx.credentials.resolve(credentialRef(authKind === "password" ? refs.privateKey : refs.password));
    const secondaryPassphrase = authKind === "password"
      ? await this.ctx.credentials.resolve(credentialRef(refs.passphrase))
      : undefined;
    return assembleAuth(authKind, primary.value, {
      passphraseValue: passphrase?.value,
      secondaryValue: secondary?.value,
```

</details>

**依据 4 · 源码核查**：[src/hostkey.js:14-18](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/hostkey.js#L14-L18)

默认accept-new模式。

```text

/** Host-key verification modes, in the order used by the UI selector. */
export const HOST_KEY_MODES = ["accept-new", "verify", "off"];

export const DEFAULT_HOST_KEY_MODE = "accept-new";
```

**依据 5 · 源码核查**：[src/hostkey.js:74-96](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/hostkey.js#L74-L96)

实际verify/off/TOFU裁决。

<details>
<summary>查看原文（23行）</summary>

```text
  if (mode === "off") return { accept: true };

  if (mode === "verify") {
    if (!known) return { accept: false, reason: "unseen-host" };
    if (known.fingerprint !== presentedFingerprint) {
      return { accept: false, reason: "host-key-mismatch", expected: known.fingerprint, got: presentedFingerprint };
    }
    return { accept: true };
  }

  // accept-new (default): trust on first use, reject on change.
  if (!known) return { accept: true, record: { fingerprint: presentedFingerprint, algorithm } };
  if (known.fingerprint !== presentedFingerprint) {
    return { accept: false, reason: "host-key-mismatch", expected: known.fingerprint, got: presentedFingerprint };
  }
  return { accept: true };
}

/**
 * Adapter over a dsh-storage-domain table (get/put/delete/entries) that
 * addresses known hosts by host:port. Pure delegation — no caching, so the
 * table remains the single source of truth and reconnects see fresh state.
 */
```

</details>

**依据 6 · 源码核查**：[src/index.js:1258-1290](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L1258-L1290)

Host实际指纹验证与无store/off不挂验证。

<details>
<summary>查看原文（33行）</summary>

```text
   * Build an ssh2 `hostVerifier` (key, verify) => boolean for a host:port.
   * Decides accept/record/reject against the known_hosts store; on rejection
   * stashes a verdict on `state` so the caller surfaces a non-retriable error,
   * and on first-seen acceptance stashes a record-to-persist after `ready`.
   */
  makeHostVerifier(state, host, port, mode) {
    return (key) => {
      try {
        const algorithm = blobAlgorithm(key);
        const presented = keyFingerprint(key);
        const known = this.knownHosts?.get(host, port);
        const verdict = decideHostKey({ mode, known, presentedFingerprint: presented, algorithm });
        if (!verdict.accept) {
          state.hostKeyMismatch = { reason: verdict.reason, host, port, mode, expected: verdict.expected, got: verdict.got ?? presented };
          return false;
        }
        if (verdict.record) {
          state.hostKeyToRecord = { host, port, fingerprint: verdict.record.fingerprint, algorithm: verdict.record.algorithm };
        }
        return true;
      } catch (error) {
        state.hostKeyMismatch = { reason: "verifier-error", host, port, mode, message: error.message };
        return false;
      }
    };
  }

  /** Attach a TOFU verifier to an ssh2 connect config (no-op when off or store not ready). */
  attachHostVerifier(config, state, host, port, mode) {
    const effective = mode ?? DEFAULT_HOST_KEY_MODE;
    if (this.knownHosts === null || effective === "off") return;
    config.hostVerifier = this.makeHostVerifier(state, host, port, effective);
  }
```

</details>

**依据 7 · 源码核查**：[src/index.js:1359-1408](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L1359-L1408)

ssh2实例/认证配置和hostVerifier进入真实connect。

<details>
<summary>查看原文（50行）</summary>

```text
      const client = new Client();
      record.client = client;
      try {
        await new Promise((resolve, reject) => {
          // ssh2 can emit several protocol errors while a handshake is dying
          // (observed live: "Connection lost before handshake" twice in a
          // row). The first event settles the wait; the standing error
          // listener must outlive it, because an 'error' emission with zero
          // listeners crashes the whole DSH process. A cancelled connect is
          // broken out of via the close event below.
          let settled = false;
          const onReady = () => { if (!settled) { settled = true; resolve(); } };
          const onError = (cause) => { if (!settled) { settled = true; reject(cause); } };
          const onClose = () => { if (!settled) { settled = true; reject(new Error("connection closed before handshake completed")); } };
          client.once("ready", onReady);
          client.on("error", onError);
          client.once("close", onClose);
          const config = { ...record.connectConfig };
          // Single source of truth for the legacy KEX set: `legacy: true`
          // seeds the flag, an automatic downgrade flips it mid-loop, and this
          // is the only place a handshake's options are assembled (so the two
          // paths can never drift apart).
          if (record.legacyAlgorithms) {
            config.algorithms = { ...(config.algorithms ?? {}), ...LEGACY_VRP_ALGORITHMS };
          }
          // Keyboard-interactive support: only when a saved password exists to
          // answer prompts with, and never on the plain-password fallback
          // attempt (where the device killed the transport mid-prompt).
          const hasPassword = record.connectConfig.password !== undefined;
          config.tryKeyboard = hasPassword && !record.kbdFallbackTried;
          if (config.tryKeyboard) {
            client.on("keyboard-interactive", (name, instructions, instructionsLang, prompts, finish) => {
              record.authTracker.kbdSeen = true;
              finish(prompts.map(() => record.connectConfig.password));
            });
          }
          // ssh2's own default handler walks the same method order; this one
          // additionally records what was tried and what the server accepts,
          // so a failed login produces a diagnosis instead of a bare line.
          config.authHandler = makeAuthHandler(record.authTracker, {
            hasPassword,
            hasPrivateKey: record.connectConfig.privateKey !== undefined,
            // A forwarded agent doubles as an auth source (ssh2's separate
            // "agent" method), so a keyless resource can still log in.
            hasAgent: typeof record.connectConfig.agent === "string",
            tryKeyboard: config.tryKeyboard
          });
          if (sock !== undefined) config.sock = sock;
          this.attachHostVerifier(config, record, record.host, record.port, record.hostKeyMode);
          client.connect(config);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 危险审批真的挡执行吗，取消和断线会怎样？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

ssh_exec预执行用当前连接策略评估命令，命中规则经Host approval.request等待；无审批/拒绝/取消均deny。allowed-once记录callId→connection+完整命令的有时效凭据，内层exec再次消费、匹配且一次性，连接切换或命令改变不会获同一授权。简单字面删除获准后改执行回收站脚本，其他获准危险命令可真实运行。

真正执行走client.exec(pty:false)收stdout/stderr/close，限制返回输出、超时本地settle后close通道；ssh_exec execute未把exec.signal传给service，不能承诺Host取消即终止远端命令。超时也不是变更回滚。明显危险命令及回收站不透明重放，但判定普通命令在传输丢失后可自动重试一次；黑名单未识别的有副作用脚本不是幂等证明，不能总称“结果不明不重放”。

策略有standard/custom/allowAll，后者直接放行。Agent交互ssh_write按行镜像策略检查，但writeToConnection遍历连接所有活跃session转发，不等只写一个前台shell；人工终端write直接写流不拦截。因此既有规则不是脚本沙箱/OS最小权限，也不能从一次挂起推断整个Agent绝无其他行动。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/ssh-session.js:25-80](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/ssh-session.js#L25-L80)

审批真实请求、预执行拒绝和授权记录。

<details>
<summary>查看原文（56行）</summary>

```text
export async function askOperatorApproval(ctx, execution, reason) {
  let approval;
  try { approval = ctx.get("approval"); } catch { approval = undefined; }
  if (approval === undefined || execution?.agent === undefined || execution?.callId === undefined) {
    return { outcome: "unavailable" };
  }
  try {
    const outcome = await approval.request({
      agent: execution.agent,
      toolName: execution.name,
      callId: execution.callId,
      reason,
      signal: execution.signal
    });
    return { outcome: typeof outcome === "string" ? outcome : "unavailable" };
  } catch {
    return { outcome: "unavailable" };
  }
}

export function registerSshSessionTools(ctx, service) {
  // Dangerous-command gate for ssh_exec: the tools/pre-execute waterfall
  // evaluates the exact policy the exec path will enforce and, when the
  // command is deny-listed, suspends the whole call on the host's approval
  // channel — the agent cannot act, retry, or route around while the
  // operator decides. On "allow" a one-shot voucher (callId -> connection +
  // command) is recorded for the tool body to consume past the inner gate.
  // No approval channel at all degrades to deny, never to execute.
  if (typeof ctx.on === "function") ctx.on("tools/pre-execute", (execution, next) => {
    if (execution?.name !== "ssh_exec") return typeof next === "function" ? next() : undefined;
    return (async () => {
      const command = typeof execution.arguments?.command === "string" ? execution.arguments.command : "";
      const selected = service.resolveConnection(execution.arguments?.connection_id);
      if (!selected.ok) return typeof next === "function" ? next() : undefined; // no target: let the tool report the honest error
      const policy = service.resolveExecPolicy(selected.connectionId);
      const decision = assessShellCommand(command, policy);
      if (decision.ok) return typeof next === "function" ? next() : undefined;
      let trashNote = "";
      if (decision.category === CATEGORY_DELETE_FILES && parseSimpleDeleteCommand(command)) {
        trashNote = t("（批准后实际执行的是移入回收站的可逆操作，不会真删）");
      }
      const host = selected.connection.host ?? "";
      const reason = t(`AI 请求在 ${host} 上执行危险命令，已被执行策略（${execPolicyLabel(policy.mode)}）拦截：\n${command}\n风险类别：${t(decision.category ?? decision.reason)}${trashNote}\n批准=本次执行；拒绝=命令不会运行。`);
      const { outcome } = await askOperatorApproval(ctx, execution, reason);
      if (outcome === "allowed-once") {
        service.recordOperatorApproval(execution.callId, selected.connectionId, command);
        return typeof next === "function" ? next() : undefined;
      }
      if (outcome === "rejected") {
        return { kind: "deny", reason: t(`操作者拒绝了该危险命令（${command}）。请勿重试或换写法绕行；如确需执行，请让操作者自行在终端运行，或请其调整右侧面板的执行策略。`) };
      }
      if (outcome === "cancelled") {
        return { kind: "deny", reason: t("危险命令的确认被取消，命令未执行。请勿重试；如确需执行请与操作者确认。") };
      }
      return { kind: "deny", reason: t(`该命令属于危险操作（${t(decision.category ?? decision.reason)}），必须由操作者确认，但当前宿主没有可用的审批通道，命令未执行。请勿重试或绕行；请操作者直接在终端手动执行。`) };
    })();
```

</details>

**依据 2 · 源码核查**：[src/tools/ssh-session.js:345-359](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/ssh-session.js#L345-L359)

exec工具实际调用只传callId/timeout，未传signal。

<details>
<summary>查看原文（15行）</summary>

```text
      }
    },
    async execute(args, exec) {
      const result = await service.executeCommand({
        connectionId: args.connection_id,
        command: args.command,
        timeoutMs: args.timeout_ms ?? 30000,
        // The pre-execute gate records its voucher under the execution id;
        // the inner gate consumes it so an operator-approved command runs.
        approvalToken: exec?.callId
      });
      if (!result.ok) throw new Error(`ssh_exec failed: ${result.error.message}`);
      return result.value;
    }
  }));
```

</details>

**依据 3 · 源码核查**：[src/index.js:2807-2839](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L2807-L2839)

有时效一次性连接+命令凭据消费。

<details>
<summary>查看原文（33行）</summary>

```text
  recordOperatorApproval(callId, connectionId, command) {
    if (callId === undefined) return;
    // Partially-constructed instances in unit tests never initialized the map.
    if (this.operatorApprovals === undefined) this.operatorApprovals = new Map();
    const previous = this.operatorApprovals.get(callId);
    if (previous?.timer !== undefined) clearTimeout(previous.timer);
    const ttl = this.operatorApprovalTtlMs ?? OPERATOR_APPROVAL_TTL_MS;
    const expiresAt = Date.now() + ttl;
    const timer = setTimeout(() => {
      const current = this.operatorApprovals?.get(callId);
      if (current?.expiresAt === expiresAt) this.operatorApprovals.delete(callId);
    }, ttl);
    timer.unref?.();
    this.operatorApprovals.set(callId, { connectionId, command, expiresAt, timer });
  }

  /**
   * Consume the approval voucher for one execution: exactly once, only for
   * the same connection and command the operator actually saw and allowed.
   * A mismatched or stale (TTL 5 min) voucher is silently not a grant — the
   * inner gate then denies as if no approval existed.
   */
  consumeOperatorApproval(callId, connectionId, command) {
    const approvals = this.operatorApprovals;
    if (callId === undefined || approvals === undefined) return false;
    const voucher = approvals.get(callId);
    if (voucher === undefined) return false;
    approvals.delete(callId);
    if (voucher.timer !== undefined) clearTimeout(voucher.timer);
    if (Date.now() >= voucher.expiresAt) return false;
    return voucher.connectionId === connectionId && voucher.command === command;
  }

```

</details>

**依据 4 · 源码核查**：[src/index.js:3264-3308](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3264-L3308)

二次执行门禁、简单删除改写和重试判据。

<details>
<summary>查看原文（45行）</summary>

```text
  async execOnConnection(connectionId, command, timeoutMs = 30000, retried = false, approvalToken) {
    const policy = this.resolveExecPolicy(connectionId);
    const decision = assessShellCommand(command, policy);
    // Dangerous commands are never replayed after an ambiguous transport loss:
    // the first dispatch may already have taken effect. Apply this to released
    // destructive categories too, not only to ask-approved calls.
    const retryOnTransportLoss = decision.ok && assessShellCommand(command).ok;
    let trashScript = null;
    if (!decision.ok) {
      // A simple, fully-literal rm/unlink/rmdir is executed as the reversible
      // trash move, never as a real deletion — whether the operator approved
      // the ask or no approval exists at all. Real `rm` only ever happens
      // when the operator types it in their own terminal.
      if (decision.category === CATEGORY_DELETE_FILES) {
        const parsed = parseSimpleDeleteCommand(command);
        if (parsed) trashScript = buildTrashCommand(parsed.targets);
      }
      // The tools/pre-execute gate asked through the host approval channel
      // and, on "allow", recorded a voucher for THIS call. It is consumed
      // here exactly once and only for the same connection+command. Without
      // a valid grant the command stays blocked — as a structured result,
      // with no queue: the ask suspends the tool call itself, so there is
      // nothing left for a panel to approve after the fact.
      if (!(approvalToken !== undefined && this.consumeOperatorApproval(approvalToken, connectionId, command))) {
        return this.blockedExecResult(connectionId, command, t(decision.category ?? decision.reason), policy);
      }
      if (trashScript) {
        // Approved simple delete: the reversible trash move is what actually
        // runs on the exec channel; the agent sees its output like any exec.
        return await this.runPreparedExec(connectionId, trashScript, command, true, timeoutMs, retried, false);
      }
      // Approved non-trash command: fall through and run it as written.
    }
    // Network-CLI routing (#33): a connection whose exec probe timed out
    // without a byte back has no POSIX exec channel (VRP, Comware, IOS…).
    // Type the command into the already-open interactive terminal and
    // complete on prompt return instead of hanging on exec.
    const conn = this.connections.get(connectionId);
    // The flag is only trusted while the login shell is NOT known to be
    // POSIX: a host that answered `echo $SHELL` provably has a working exec
    // channel, so a stale flag must never divert it to the terminal.
    if (conn !== void 0 && conn.execStalled && !posixLoginShell(conn.loginShell)) {
      return this.cliExecOnConnection(conn, command, timeoutMs);
    }
    const result = await this.runPreparedExec(connectionId, command, command, false, timeoutMs, retried, retryOnTransportLoss);
```

</details>

**依据 5 · 源码核查**：[src/index.js:3179-3222](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3179-L3222)

真实exec/超时本地settle、close与输出收集。

<details>
<summary>查看原文（44行）</summary>

```text
  async collectExecOutput(client, command, timeoutMs) {
    const stream = await new Promise((resolve, reject) => {
      client.exec(command, { pty: false }, (error, s) => {
        if (error) reject(error);
        else resolve(s);
      });
    });
    const state = { exitCode: null, stdout: "", stderr: "", truncated: false, timedOut: false };
    // Settling is local-first: the timeout resolves NOW and only then tries
    // to close the channel. Settling via the 'close' event alone would depend
    // on the peer answering CHANNEL_CLOSE — a device that never responded to
    // the exec request will not respond to the close either, and the caller
    // would hang forever (#33). resolve() is idempotent, so a later close
    // event is harmless.
    let settle = () => {};
    const timer = setTimeout(() => {
      state.timedOut = true;
      settle();
      try { stream.close(); } catch {}
    }, timeoutMs);
    try {
      await new Promise((resolve) => {
        settle = resolve;
        stream.on("data", (chunk) => {
          const result = appendCapped(state.stdout, chunk.toString("utf8"), this.config.maxCommandOutputBytes);
          state.stdout = result.text;
          state.truncated ||= result.truncated;
        });
        stream.stderr.on("data", (chunk) => {
          const result = appendCapped(state.stderr, chunk.toString("utf8"), this.config.maxCommandOutputBytes);
          state.stderr = result.text;
          state.truncated ||= result.truncated;
        });
        stream.on("close", (code) => {
          state.exitCode = typeof code === "number" ? code : null;
          settle();
        });
        stream.on("error", () => settle());
      });
    } finally {
      clearTimeout(timer);
    }
    return state;
  }
```

</details>

**依据 6 · 源码核查**：[src/index.js:3464-3495](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3464-L3495)

执行与普通命令传输丢失重试一次。

<details>
<summary>查看原文（32行）</summary>

```text
  async runPreparedExec(connectionId, prepared, displayCommand, trashRun, timeoutMs = 30000, retried = false, retryOnTransportLoss = true) {
    const conn = this.connections.get(connectionId);
    if (conn === void 0) return { ok: false, error: fail("no-connection", `connection "${connectionId}" does not exist`) };
    if (!(await this.ensureAlive(conn))) {
      return { ok: false, error: fail("connection-lost", `connection "${connectionId}" is down and could not be re-established`) };
    }
    // An exec channel always starts in the login home directory — the panel's
    // interactive shell may be somewhere else entirely. When the login shell
    // is POSIX-family, prepend the interactive-cwd prologue (see exec-cwd.js)
    // so the command runs where the operator's terminal is, and the resolved
    // directory comes back on a stripped marker line. Trash moves and other
    // destructive commands opt out of the transparent transport-loss retry so
    // one operator grant can never dispatch the same dangerous action twice.
    const shell = await this.resolveLoginShell(conn);
    const sent = posixLoginShell(shell) ? buildCwdAwareCommand(prepared) : prepared;
    const commandId = randomUUID();
    const startedAt = new Date().toISOString();
    const startedAtMs = Date.now();
    let state;
    try {
      state = await this.collectExecOutput(conn.client, sent, timeoutMs);
    } catch (error) {
      // The transport may have died between the liveness check and the exec.
      // Safe/idempotent calls may retry; destructive calls must report an
      // unknown outcome because the first dispatch may already have run.
      if (retryOnTransportLoss && !retried && conn.dead && (await this.ensureAlive(conn))) {
        return this.runPreparedExec(connectionId, prepared, displayCommand, trashRun, timeoutMs, true, retryOnTransportLoss);
      }
      return { ok: false, error: fail("exec-failed", error.message) };
    }
    const { cwd, stdout: execStdout } = extractExecCwd(state.stdout);
    let stdout = execStdout;
```

</details>

**依据 7 · 源码核查**：[src/safety.js:140-161](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/safety.js#L140-L161)

黑名单策略custom/allowAll放行。

<details>
<summary>查看原文（22行）</summary>

```text
 * irreversible-delete risk on this connection).
 */
export function assessShellCommand(command, policy = STANDARD_POLICY) {
  if (typeof command !== "string") return blocked(t("命令不是文本"), null);
  const value = command.trim();
  if (!value) return { ok: true };

  const tier = normalizePolicy(policy);
  if (tier.mode === "allowAll") return { ok: true };

  const released = tier.mode === "custom" ? new Set(tier.allow) : null;
  for (const [pattern, categoryKey, category] of IRREVERSIBLE_BLOCK_LIST) {
    if (!pattern.test(value)) continue;
    if (released !== null && released.has(categoryKey)) continue;
    return blocked(category, categoryKey);
  }
  return { ok: true };
}

/**
 * Whether a blocked command can be safely prefilled into the interactive
 * terminal's input line. Control characters are rejected because Tab would
```

</details>

**依据 8 · 源码核查**：[src/index.js:3581-3621](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3581-L3621)

Agent交互转发所有活跃session并逐行策略。

<details>
<summary>查看原文（41行）</summary>

```text
  writeToConnection(connectionId, input) {
    const conn = this.connections.get(connectionId);
    if (conn === void 0) return { ok: false, error: fail("no-connection", `connection "${connectionId}" does not exist`) };
    // The tier resolves per connection, not per session: every shell of this
    // server shares the same gate.
    const policy = this.resolveExecPolicy(connectionId);
    let written = 0;
    let blockedReason = null;
    for (const sessionId of conn.sessions) {
      const session = this.sessions.get(sessionId);
      if (session && session.exited === null && session.stream !== null) {
        try {
          const guarded = this.prepareTerminalInput(session, input, policy);
          if (guarded.forwarded) session.stream.write(guarded.forwarded);
          written += guarded.forwarded.length;
          blockedReason ??= guarded.blockedReason;
        } catch {}
      }
    }
    if (blockedReason) return { ok: false, error: fail("unsafe-command", blockedReason) };
    return { ok: true, value: { written } };
  }

  /** Add a local policy notice to the same buffer rendered by the terminal. */
  appendTerminalNotice(session, message) {
    this.appendSessionOutput(session, `\r\n\x1b[33m${t(POLICY_NOTICE_PREFIX)} ${message}\x1b[0m\r\n`);
  }

  /**
   * Preserve normal terminal editing, but submit a line only after host-side
   * policy approval. A denied line is cleared with Ctrl-U before the shell can
   * execute it. History navigation and tab completion fail closed as well.
   */
  prepareTerminalInput(session, text, policy = null) {
    session.inputRevision = (session.inputRevision ?? 0) + 1;
    const { forwarded, blockedReason } = processTerminalInput(session, text, (line) => assessShellCommand(line, policy ?? undefined));
    if (blockedReason !== null) this.appendTerminalNotice(session, blockedReason);
    return { forwarded, blockedReason };
  }

  /**
```

</details>

**依据 9 · 源码核查**：[src/index.js:2555-2577](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L2555-L2577)

人工输入实际直写流。

<details>
<summary>查看原文（23行）</summary>

```text
  async write(request) {
    const session = this.sessions.get(request.sessionId);
    if (session === void 0) return { ok: false, error: fail("no-session", `session "${request.sessionId}" does not exist`) };
    if (session.exited !== null || session.stream === null) return { ok: false, error: fail("exited", `session "${request.sessionId}" has already exited`) };
    let text;
    try {
      text = decodeData(request.data);
    } catch {
      return { ok: false, error: fail("bad-data", "input is not valid base64") };
    }
    try {
      if (text) {
        // This path is interactive operator input and stays unguarded. The
        // standing boundary is that a human's own keystrokes are never
        // policed; agent calls use writeToConnection()/execOnConnection().
        session.stream.write(text);
        this.updateInputMirror(session, text);
      }
    } catch (error) {
      return { ok: false, error: fail("write-failed", error.message) };
    }
    return { ok: true, value: { written: text.length } };
  }
```

</details>

#### 缺口

- 真实断线/取消/并发审批与Agent整体调度未验证。
  **影响**：只确认本调用门禁，不承诺全Agent冻结/远端撤销或普通命令幂等。
  **进一步探讨**：在测试主机模拟已发命令断线、取消和多终端，核结果/重复与恢复成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 文件/数据库保护会产生什么真实副作用？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

SFTP模型删除也先确认，按解析得到的绝对目标消费同样凭据，执行回收站脚本或无法解析时原删除，禁止透明重放；底层sftpDelete本身是真unlink/rmdir，不能把UI/服务所有路径笼统称永不删除。回收站脚本mv目标并写manifest，但下次新删除会顺带rm过期回收站项；脚本总exit0且以事件表述单项失败，因此退出码0不能当所有文件已回收。SFTP普通write实际createWriteStream直接覆盖，没有在此方法先临时文件再原子替换，不能把README面板流式上传能力套给所有写工具。

DB模型入口明确origin=agent。普通SQL通过驱动实际执行；危险SQL不是纯无副作用拒绝：guard先备份，DROP TABLE可quarantineRename实际改表名，即使并非真正DROP仍会中断业务依赖；隔离表最终DROP仅Agent拒绝、面板可执行。backup条目可失败，备份与改名不构成全库一致快照。事务接口可执行/commit/rollback，commit超时可能返回unknown并丢连接，必须核数据再重试；不据源码声称业务回滚已演练。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/sftp.js:31-61](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/sftp.js#L31-L61)

SFTP删除审批实际门禁。

<details>
<summary>查看原文（31行）</summary>

```text
  if (typeof ctx.on === "function") ctx.on("tools/pre-execute", (execution, next) => {
    if (execution?.name !== "sftp_delete") return typeof next === "function" ? next() : undefined;
    return (async () => {
      let preview;
      try {
        preview = await resolveTarget(execution, execution.arguments?.connection_id, execution.arguments?.path);
      } catch {
        return typeof next === "function" ? next() : undefined; // bad path: let the tool report the honest error
      }
      const conn = service.connections?.get(preview.connectionId);
      const host = conn?.host ?? preview.connectionId;
      const command = `rm -rf ${shellQuote(preview.path)}`;
      const reason = t(`AI 请求删除 ${host} 上的：\n${preview.path}\n（等价于 \`${command}\`）。批准后优先执行移入回收站的可逆删除；拒绝则不会删除任何内容。`);
      const { outcome } = await askOperatorApproval(ctx, execution, reason);
      if (outcome === "allowed-once") {
        service.recordOperatorApproval(execution.callId, preview.connectionId, command);
        return typeof next === "function" ? next() : undefined;
      }
      const denied = outcome === "rejected"
        ? t(`操作者拒绝了删除 ${preview.path}。请勿重试或换路径绕行；确需删除请让操作者自行处理。`)
        : outcome === "cancelled"
          ? t("删除操作的确认被取消，未删除任何内容。请勿重试；确需删除请与操作者确认。")
          : t(`删除 ${preview.path} 必须由操作者确认，但当前宿主没有可用的审批通道，未删除任何内容。请让操作者自行删除。`);
      return { kind: "deny", reason: denied };
    })();
  });

  ctx.tools.register(defineTool({
    name: "sftp_list",
    description: "List the entries of a remote directory over SFTP on a connected server (the one open in the right-side SSH terminal unless connection_id is given). In a remote workspace a relative path resolves under the bound remote root. Returns file/directory entries with sizes and mtimes.",
    parameters: {
```

</details>

**依据 2 · 源码核查**：[src/tools/sftp.js:191-210](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/sftp.js#L191-L210)

删除凭据消费、回收或原命令、超时非0错误。

<details>
<summary>查看原文（20行）</summary>

```text
    async execute(args, exec) {
      // The pre-execute gate asked the operator and, on "allow", recorded a
      // voucher under this execution's id; it is consumed here exactly once.
      // In a remote workspace the ask always names the resolved absolute
      // path, so the operator sees exactly what would be removed.
      const resolved = await resolveTarget(exec, args.connection_id, args.path);
      const command = `rm -rf ${shellQuote(resolved.path)}`;
      const parsed = parseSimpleDeleteCommand(command);
      const trashScript = parsed ? buildTrashCommand(parsed.targets) : null;
      if (!(exec?.callId !== undefined && service.consumeOperatorApproval(exec.callId, resolved.connectionId, command))) {
        return { path: resolved.path, blocked: true, reason: t("删除文件或目录（SFTP）"), command };
      }
      // Approved: the reversible trash move is what actually runs whenever
      // the path allows it; only a non-parseable path deletes for real.
      const result = await service.runPreparedExec(resolved.connectionId, trashScript ?? command, command, true, 30000, false, false);
      if (!result.ok) throw new Error(`sftp_delete failed: ${result.error.message}`);
      if (result.value.timedOut || result.value.exitCode !== 0) {
        const detail = result.value.stderr?.trim() || `exit code ${result.value.exitCode ?? "unknown"}`;
        throw new Error(`sftp_delete outcome is not successful: ${detail}`);
      }
```

</details>

**依据 3 · 源码核查**：[src/index.js:4448-4471](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L4448-L4471)

底层SFTP实际unlink/rmdir。

<details>
<summary>查看原文（24行）</summary>

```text
  async sftpDelete(request) {
    const selected = this.resolveConnection(request.connectionId);
    if (!selected.ok) return selected;
    const sftp = await this.requireSftp(selected.connection);
    if (!sftp.ok) return sftp;
    try {
      const isDir = await new Promise((resolve, reject) => {
        sftp.sftp.stat(request.path, (error, attrs) => {
          if (error) reject(error);
          else resolve((attrs.mode & 0o170000) === 0o040000);
        });
      });
      await new Promise((resolve, reject) => {
        const fn = isDir ? sftp.sftp.rmdir : sftp.sftp.unlink;
        fn.call(sftp.sftp, request.path, (error) => {
          if (error) reject(error);
          else resolve();
        });
      });
      return { ok: true, value: { path: request.path, isDirectory: isDir } };
    } catch (error) {
      return { ok: false, error: fail("sftp-delete-failed", `${request.path}: ${error.message}`) };
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/trash.js:190-239](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/trash.js#L190-L239)

真实过期purge、mv、manifest与总exit0。

<details>
<summary>查看原文（50行）</summary>

```text
  const list = targets.map(quoteTarget).join(" ");
  return [
    '__dsh_t="$HOME/.dsh-trash"',
    'mkdir -p "$__dsh_t" || { printf \'__DSH_TRASH_V1__\\terror\\ttrash-dir\\n\'; exit 0; }',
    "__dsh_n=$(date +%s)",
    '__dsh_m="$__dsh_t/manifest.tsv"',
    "if [ -f \"$__dsh_m\" ]; then",
    `  __dsh_cut=$((__dsh_n - ${retentionSec}))`,
    '  __dsh_tmp="$__dsh_t/.purge.$$"',
    "  awk -F'\\t' -v c=\"$__dsh_cut\" '$3+0 > 0 && $3+0 < c { print $1 }' \"$__dsh_m\" > \"$__dsh_tmp\" 2>/dev/null || : > \"$__dsh_tmp\"",
    '  __dsh_purged=0',
    '  while IFS= read -r __dsh_x; do',
    '    case "$__dsh_x" in ""|"."|".."|*/*) continue ;; esac',
    '    if rm -rf "$__dsh_t/$__dsh_x"; then __dsh_purged=$((__dsh_purged + 1)); fi',
    '  done < "$__dsh_tmp"',
    '  if [ "$__dsh_purged" -gt 0 ]; then',
    "    awk -F'\\t' -v c=\"$__dsh_cut\" '!($3+0 > 0 && $3+0 < c)' \"$__dsh_m\" > \"$__dsh_tmp\" 2>/dev/null && cat \"$__dsh_tmp\" > \"$__dsh_m\"",
    '  fi',
    '  rm -f "$__dsh_tmp"',
    `  printf '${TRASH_MARKER}\\tpurged\\t%d\\n' "$__dsh_purged"`,
    "fi",
    "__dsh_i=0",
    `for __dsh_p in ${list}; do`,
    '  case "$__dsh_p" in /*) : ;; *) __dsh_p="./$__dsh_p" ;; esac',
    '  __dsh_q=$__dsh_p',
    '  while : ; do case "$__dsh_q" in */) __dsh_q="${__dsh_q%/}" ;; *) break ;; esac; done',
    '  case "$__dsh_q" in /*) __dsh_abs=$__dsh_q ;; *) __dsh_abs="$(pwd -P 2>/dev/null || pwd)/${__dsh_q#./}" ;; esac',
    '  if [ ! -e "$__dsh_q" ] && [ ! -L "$__dsh_q" ]; then',
    `    printf '${TRASH_MARKER}\\tmissing\\t%s\\n' "$__dsh_abs"`,
    '    continue',
    '  fi',
    '  __dsh_b=${__dsh_q##*/}',
    '  __dsh_name="$__dsh_n-$__dsh_b"',
    '  __dsh_d="$__dsh_t/$__dsh_name"',
    '  while [ -e "$__dsh_d" ] || [ -L "$__dsh_d" ]; do',
    '    __dsh_i=$((__dsh_i + 1))',
    '    __dsh_name="$__dsh_n-$__dsh_i-$__dsh_b"',
    '    __dsh_d="$__dsh_t/$__dsh_name"',
    '  done',
    '  if mv "$__dsh_q" "$__dsh_d"; then',
    '    printf \'%s\\t%s\\t%s\\t%s\\n\' "$__dsh_name" "$__dsh_abs" "$__dsh_n" "$(date -u +%Y%m%dT%H%M%SZ)" >> "$__dsh_m"',
    `    printf '${TRASH_MARKER}\\tmoved\\t%s\\t%s\\n' "$__dsh_abs" "$__dsh_d"`,
    '  else',
    `    printf '${TRASH_MARKER}\\tfailed\\t%s\\n' "$__dsh_abs"`,
    '  fi',
    'done',
    'exit 0'
  ].join("\n");
}

```

</details>

**依据 5 · 源码核查**：[src/tools/sftp.js:148-153](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/sftp.js#L148-L153)

模型写工具调用sftpWriteFile。

```text
    async execute(args, exec) {
      const target = await resolveTarget(exec, args.connection_id, args.path);
      const result = await service.sftpWriteFile({ connectionId: target.connectionId, path: target.path, data: Buffer.from(args.content, "utf8").toString("base64") });
      if (!result.ok) throw new Error(`sftp_write failed: ${result.error.message}`);
      return result.value;
    }
```

**依据 6 · 源码核查**：[src/index.js:3845-3862](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3845-L3862)

实际直接写流覆盖。

<details>
<summary>查看原文（18行）</summary>

```text
  async sftpWriteFile(request) {
    const selected = this.resolveConnection(request.connectionId);
    if (!selected.ok) return selected;
    const sftp = await this.requireSftp(selected.connection);
    if (!sftp.ok) return sftp;
    try {
      const buf = Buffer.from(request.data, "base64");
      await new Promise((resolve, reject) => {
        const stream = sftp.sftp.createWriteStream(request.path);
        stream.on("close", resolve);
        stream.on("error", reject);
        stream.end(buf);
      });
      return { ok: true, value: { path: request.path, bytes: buf.length } };
    } catch (error) {
      return { ok: false, error: fail("sftp-write-failed", `${request.path}: ${error.message}`) };
    }
  }
```

</details>

**依据 7 · 源码核查**：[src/tools/db.js:220-234](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/tools/db.js#L220-L234)

Agent来源传入真实dbExecute。

<details>
<summary>查看原文（15行）</summary>

```text
    async execute(args, exec) {
      const result = await service.dbExecute({ dbConnectionId: args.db_connection_id, sql: args.sql, params: args.params, signal: exec?.signal, origin: "agent" });
      if (!result.ok) {
        if (result.error.code === "unsafe-sql") {
          const hasBackup = Array.isArray(result.error.backup) && result.error.backup.length > 0;
          return {
            affectedRows: 0, truncated: false, blocked: true,
            reason: result.error.message, sql: args.sql,
            ...(hasBackup ? { backup: result.error.backup } : {})
          };
        }
        throw new Error(`db_execute failed: ${result.error.message}`);
      }
      return result.value;
    }
```

</details>

**依据 8 · 源码核查**：[src/db-ops.js:1031-1057](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1031-L1057)

普通SQL真实驱动和危险判断转guard。

<details>
<summary>查看原文（27行）</summary>

```text
  async execute(request) {
    let record;
    try { record = this.getRecord(request.dbConnectionId); }
    catch (error) { return fail("no-db-connection", error.message); }
    const assessment = assessSqlStatement(request.sql);
    if (assessment.blocked) {
      // Destructive SQL never executes, but it no longer dies silently: the
      // target is backed up (and for DROP TABLE, quarantined by rename) so
      // the operation stays recoverable. See guardDestructiveSql.
      return this.guardDestructiveSql(record, request, assessment);
    }
    if (!isSqlType(record.type)) {
      return fail("unsupported-op", `db_execute only supports SQL databases (mysql/postgresql/opengauss/sqlite/clickhouse), use db_run for ${record.type}`);
    }
    try {
      const opts = { signal: request.signal, label: "db_execute" };
      let affectedRows, insertId;
      if (record.type === "mysql") {
        const r = await this.mysqlQueryOnce(record, request.sql, request.params ?? [], opts);
        const [rows] = r;
        if (Array.isArray(rows)) {
          affectedRows = rows.length;
        } else {
          affectedRows = rows.affectedRows ?? 0;
          if (rows.insertId) insertId = rows.insertId;
        }
      } else if (record.type === "sqlite") {
```

</details>

**依据 9 · 源码核查**：[src/db-ops.js:1089-1100](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1089-L1100)

危险guard origin和blocked构造。

<details>
<summary>查看原文（12行）</summary>

```text
   */
  async guardDestructiveSql(record, request, assessment) {
    const agentOrigin = request.origin === "agent";
    if (!isSqlType(record.type)) return fail("unsafe-sql", assessment.reason);

    const blocked = (backup, message) => {
      const text = t(`${message ?? assessment.reason}。${backupSummary(backup)}\nSQL 未执行；请勿重试/绕行，由人工在数据库面板执行。`);
      // An empty backup list stays absent — no point attaching noise.
      return agentOrigin
        ? { ok: false, error: { code: "unsafe-sql", message: text, ...(backup.length > 0 ? { backup } : {}) } }
        : { ok: false, error: { code: "unsafe-sql", message: text } };
    };
```

</details>

**依据 10 · 源码核查**：[src/db-ops.js:1131-1171](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1131-L1171)

隔离表Agent最终删除拒绝、备份和改名分支。

<details>
<summary>查看原文（41行）</summary>

```text
    const bareName = target.identifier.split(".").pop();
    if (QUARANTINE_SUFFIX_RE.test(bareName)) {
      // Purging a quarantined table is the one human-final step. The
      // identifier is lexer-built, but the whitelist stays the gate.
      if (!validateDbIdentifier(target.identifier).ok) return blocked([]);
      if (agentOrigin) {
        return blocked([], t(`隔离表的最终删除必须由操作者在数据库面板执行（当前请求来自 Agent，已拦截）`));
      }
      try {
        await this.runQuarantineSql(record, `DROP TABLE ${target.identifier}`, request.signal);
      } catch (error) {
        return fail("db-execute-failed", error.message);
      }
      return { ok: true, value: { affectedRows: 0, truncated: false } };
    }

    // Rows must be read before anything hides the table — backup FIRST.
    const backup = [await this.backupTableSnapshot(record, target.identifier, request.signal)];

    if (target.verb === "TRUNCATE" || !QUARANTINE_CAPABLE_TYPES.has(record.type)) {
      // Truncate empties a table in place and this engine cannot rename to
      // safety — blocked with the backup attached.
      const why = target.verb === "TRUNCATE" ? t("TRUNCATE 无法隔离改名") : t(`引擎 ${record.type} 不支持隔离改名`);
      return blocked(backup, t(`${assessment.reason}。${why}，已自动备份后拦截`));
    }

    const renamed = await this.quarantineRename(record, target.identifier, request.signal);
    if (!renamed.ok) {
      return blocked(backup, t(`${assessment.reason}。隔离改名失败（${renamed.error}），已自动备份后拦截`));
    }
    if (renamed.renamedTo === null) {
      return { ok: true, value: { affectedRows: 0, truncated: false, quarantined: false, notice: t("表不存在，未做任何变更（IF EXISTS 语义）"), backup } };
    }
    const notice = t(`已隔离改名（数据未删除，可随时改回）。彻底删除请由操作者在数据库面板执行：DROP TABLE ${renamed.renamedTo}`);
    if (agentOrigin) {
      return { ok: true, value: { affectedRows: 0, truncated: false, quarantined: true, renamedTo: renamed.renamedTo, backup, notice } };
    }
    return blocked(backup, notice);
  }

  /**
```

</details>

**依据 11 · 源码核查**：[src/db-ops.js:1236-1265](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1236-L1265)

实际RENAME/ALTER TABLE调用。

<details>
<summary>查看原文（30行）</summary>

```text
  async quarantineRename(record, identifier, signal) {
    const bare = identifier.split(".").pop();
    const listed = await this.listTables({ dbConnectionId: record.id, signal }).catch(() => ({ ok: false, error: { message: "listTables failed" } }));
    if (!listed.ok) return { ok: false, error: listed.error.message };
    const names = listed.value.tables;
    if (!names.includes(bare)) return { ok: true, renamedTo: null };
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    let candidate = `${bare}_to_be_dropped_${stamp}`;
    let n = 2;
    while (names.includes(candidate)) {
      candidate = `${bare}_to_be_dropped_${stamp}_${n}`;
      n++;
    }
    const qualified = identifier.includes(".");
    const newIdentifier = qualified ? `${identifier.slice(0, identifier.length - bare.length)}${candidate}` : candidate;
    if (!validateDbIdentifier(newIdentifier).ok) {
      return { ok: false, error: t(`隔离名 ${newIdentifier} 不是合法标识符（过长或含特殊字符）`) };
    }
    try {
      if (record.type === "mysql") {
        await this.mysqlQueryOnce(record, "RENAME TABLE ?? TO ??", [identifier, newIdentifier], { signal, label: "db_quarantine_rename" });
      } else if (record.type === "sqlite") {
        sqliteExecute(record.client, `ALTER TABLE "${bare.replace(/"/g, '""')}" RENAME TO "${candidate.replace(/"/g, '""')}"`, []);
      } else {
        await this.pgQueryOnce(record, `ALTER TABLE ${quotePgIdentifier(identifier)} RENAME TO ${quotePgIdentifier(candidate)}`, [], { signal, label: "db_quarantine_rename" });
      }
    } catch (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, renamedTo: newIdentifier };
```

</details>

**依据 12 · 源码核查**：[src/db-ops.js:1686-1737](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1686-L1737)

真实commit/rollback与超时unknown/释放清理。

<details>
<summary>查看原文（52行）</summary>

```text
  async dbTxCommit(request) {
    return await this.finishTransaction(request.txId, "COMMIT", "db-tx-commit-failed", request.signal);
  }

  async dbTxRollback(request) {
    return await this.finishTransaction(request.txId, "ROLLBACK", "db-tx-rollback-failed", request.signal);
  }

  async finishTransaction(txId, action, errorCode, signal) {
    const tx = this.dbTransactions.get(txId);
    if (!tx) return fail("tx-missing", `transaction ${txId} not found or already finished`);
    const label = action === "COMMIT" ? "db_tx_commit" : "db_tx_rollback";
    // The connection's connect-time override (if any) travels on the handle.
    const opBudget = tx.handle.opTimeoutMs ?? this.dl("op");
    let killed = false;
    try {
      const settled = tx.handle.kind === "mysql"
        ? await raceDeadline(tx.handle.conn.query(action), {
          signal, timeoutMs: opBudget, label, onLose: () => { killed = true; }
        })
        : await raceDeadline(tx.handle.client.query(action), {
          signal, timeoutMs: opBudget, label, onLose: () => { killed = true; }
        });
      void settled;
      if (killed) {
        // Raced out: the connection is mid-protocol and its transaction state
        // is unknown, so drop it instead of returning it to the pool.
        if (tx.handle.kind === "mysql") tx.handle.conn.destroy();
        else tx.handle.client.release(new Error(`${label}: connection killed after timeout`));
        this.dbTransactions.delete(txId);
        if (tx.timer) clearTimeout(tx.timer);
        return fail(errorCode, `${label} timed out after ${opBudget}ms: the transaction outcome is unknown — verify the data before retrying`);
      }
      if (tx.handle.kind === "mysql") tx.handle.conn.release();
      else tx.handle.client.release();
      if (tx.timer) clearTimeout(tx.timer);
      this.dbTransactions.delete(txId);
      const value = { txId, finished: true };
      value[action === "COMMIT" ? "committed" : "rolledBack"] = true;
      return { ok: true, value };
    } catch (error) {
      this.dbTransactions.delete(txId);
      if (tx.timer) clearTimeout(tx.timer);
      try {
        if (tx.handle.kind === "mysql") tx.handle.conn.destroy();
        else tx.handle.client.release(killed ? new Error(`${label}: connection killed after cancel/timeout`) : undefined);
      } catch {}
      return fail(errorCode, error.message);
    }
  }

  /** Timer/transport-driven cleanup: rolls back and releases the connection. */
```

</details>

#### 缺口

- 备份完整性/恢复、SQL方言与普通写丢失/部分文件未实测。
  **影响**：保护过程自身可能停服或留不完整恢复材料。
  **进一步探讨**：用可丢弃库/文件核备份行数/DDL、改名依赖影响、逐项回收事件与提交结果不明。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 远程工作区和退出能否替代远端运行环境？

**研究主题**：采用判断、效果与总成本

#### 完整回答

远程工作区将本机workspace绑定资源/远端根，SFTP路径做POSIX词法normalize和包含判断；这不把核心read/write/bash迁到远端，也不是经过realpath的远端符号链接隔离证明。用户仍需明确哪些工具在本机/远端运行，绑定不等完整远端DSH Runtime。

卸载清理结束SSH/jump/tunnel连接并清会话/授权Map、关闭DB，不自动恢复远端已改文件、服务、表名或已提交事务。终端日志按文件/sidecar留宿主磁盘，默认单会话8MiB/总256MiB，错误处理不应崩会话但不是持久审计成功保证；日志可能含终端敏感内容，脱敏输出不等原始日志全脱敏。

应先专用低权测试账号、核host/id/root，备份并人工批准单项可逆变更，核结果再扩大。机器/数据库/模型token、日志磁盘和人审/恢复费用未知，不能把开源免费当总成本0；退出需逐项清凭据/绑定/日志和远端残留。

#### 证据与依据

**依据 1 · 作者声明**：[src/remote-workspace.js:1-17](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/remote-workspace.js#L1-L17)

作者明确核心本地工具不改远端。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Remote workspaces: one DSH workspace directory bound to a saved SSH resource
 * and one absolute remote root (issue #38).
 *
 * The binding never rewrites DSH itself. A Workspace stays the host directory
 * DSH already canonicalized, so every core facility keeps working untouched:
 * `read`/`write`/`edit` keep addressing the local filesystem, `glob`/`grep`
 * keep spawning the packaged local ripgrep, and the native bash tool keeps
 * running on the operator's machine. What the binding buys is (a) a model-
 * visible declaration that names the remote root and the tools that actually
 * reach it, and (b) workspace-relative path resolution plus an implicit
 * connection for this plugin's own SFTP tools — "file work lands on the remote
 * by default" without pretending the local filesystem is the remote one.
 *
 * Remote paths are POSIX regardless of the host platform, so every remote path
 * helper here uses `node:path`'s posix API; only the local side uses the host
 * separator.
```

</details>

**依据 2 · 源码核查**：[src/remote-workspace.js:112-132](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/remote-workspace.js#L112-L132)

实际词法路径包含检查。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveRemotePath(basePath, input, workspaceRoot = basePath) {
  const base = normalizeRemoteRoot(basePath);
  const boundary = normalizeRemoteRoot(workspaceRoot);
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new RemoteWorkspacePathError("path must not be empty", REMOTE_WORKSPACE_OUTSIDE);
  }
  assertNoControlCharacters(input);
  const raw = input.trim();
  const joined = raw.startsWith("/") ? raw : posix.join(base, raw);
  const normalized = posix.normalize(joined);
  if (!isRemotePathInside(boundary, normalized)) {
    throw new RemoteWorkspacePathError(`path escapes the remote workspace root ${JSON.stringify(boundary)}: ${JSON.stringify(raw)}`, REMOTE_WORKSPACE_OUTSIDE);
  }
  return normalized;
}

/**
 * The workspace-relative part of a local path, or `null` when the path is not
 * inside that workspace. Compared lexically: DSH stores both the workspace
 * path and a session's cwd after `realpath`, so string prefixes are the same
 * identity. `""` means the path IS the workspace root.
```

</details>

**依据 3 · 源码核查**：[src/index.js:525-545](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L525-L545)

卸载真实连接/跳板/隧道/DB清理。

<details>
<summary>查看原文（21行）</summary>

```text
    // Tear down all connections when the plugin fiber unloads.
    ctx.effect(() => () => {
      for (const conn of this.connections.values()) {
        conn.closing = true;
        if (conn.reconnectTimer !== null) clearTimeout(conn.reconnectTimer);
        // Unload closes tunnel listeners too: a surviving listener's late
        // accept would call forwardOut on an ended client (#32).
        this.closeConnectionTunnels(conn);
        try { conn.client?.end(); } catch {}
        for (const hop of conn.hops ?? []) { try { hop.end(); } catch {} }
      }
      this.connections.clear();
      this.sessions.clear();
      this.exitedSessions.clear();
      for (const voucher of this.operatorApprovals.values()) {
        if (voucher.timer !== undefined) clearTimeout(voucher.timer);
      }
      this.operatorApprovals.clear();
      this.activeConnectionId = null;
      try { this.dbOps?.closeAll().catch(() => {}); } catch {}
    }, "ssh-ops: cleanup");
```

</details>

**依据 4 · 源码核查**：[src/session-log.js:15-24](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/session-log.js#L15-L24)

默认日志容量。

<details>
<summary>查看原文（10行）</summary>

```text
/** Defaults: one session may keep 8 MB, the directory 256 MB. */
export const SESSION_LOG_LIMITS = Object.freeze({
  maxSessionBytes: 8 * 1024 * 1024,
  maxTotalBytes: 256 * 1024 * 1024,
  /** Longest prefix of a session that search scans, so one huge log cannot stall the panel. */
  maxSearchBytes: 32 * 1024 * 1024,
  maxSearchHits: 200
});

const META_SUFFIX = ".json";
```

</details>

**依据 5 · 源码核查**：[src/session-log.js:46-77](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/session-log.js#L46-L77)

宿主文件创建日志与错误处理。

<details>
<summary>查看原文（32行）</summary>

```text
  async init() {
    this.ready ??= mkdir(this.dir, { recursive: true }).catch(() => {});
    await this.ready;
  }

  metaPath(sessionId) { return join(this.dir, `${safeId(sessionId)}${META_SUFFIX}`); }
  logPath(sessionId) { return join(this.dir, `${safeId(sessionId)}${LOG_SUFFIX}`); }

  /** Is this session already being recorded (its entry exists)? */
  has(sessionId) {
    return this.entries.has(sessionId);
  }

  /**
   * Open a log for one session. The entry exists as soon as this returns
   * (before the directory or stream is ready), so an append that arrives in
   * the same tick is buffered rather than dropped — callers that record
   * lazily call begin() and append() back to back.
   */
  async begin({ sessionId, connectionId, name, host, port, openedBy, startedAt = new Date().toISOString() }) {
    const entry = {
      sessionId, connectionId: connectionId ?? null, name: name ?? null,
      host: host ?? null, port: port ?? null, openedBy: openedBy ?? null,
      startedAt, endedAt: null, exitCode: null, bytes: 0, truncated: false,
      /** Chunks that arrived before the write stream existed. */
      pending: []
    };
    this.entries.set(sessionId, entry);
    await this.init();
    const stream = createWriteStream(this.logPath(sessionId), { flags: "a" });
    stream.on("error", () => { /* a broken log must not crash the session */ });
    this.streams.set(sessionId, stream);
```

</details>

#### 缺口

- 日志/凭据实际权限、完整留存/清除和恢复人工费用未知。
  **影响**：不能将有日志/有close当审计或回滚完成。
  **进一步探讨**：列归属清单演练退出并核服务/表/文件与日志凭据残留。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何从宽工具箱走向可验证运维交接？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：以host指纹+连接/实际cwd+变更摘要锁定一项变更，记录已发/结果不明/验证/恢复材料，所有有副作用调用默认不因“未命中黑名单”自动重放，再把核验责任交操作者，可能比继续扩工具更能减少错主机和重复变更。这不是现有已实现的事务/持久作业系统。

对照现有SSH客户端与当前插件，在测试服务器切换活动连接、双PTY、已发断线、DB提交超时和回收站单项失败，记录错目标/重复/恢复成功、审批等待和全部人工费用；若不能减少错误或净恢复负担不降即停止。现阶段观察，只读诊断也先显式目标和低权，生产写操作不据静态报告放行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:3464-3495](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3464-L3495)

普通命令仍可能自动重放是具体改进起点。

<details>
<summary>查看原文（32行）</summary>

```text
  async runPreparedExec(connectionId, prepared, displayCommand, trashRun, timeoutMs = 30000, retried = false, retryOnTransportLoss = true) {
    const conn = this.connections.get(connectionId);
    if (conn === void 0) return { ok: false, error: fail("no-connection", `connection "${connectionId}" does not exist`) };
    if (!(await this.ensureAlive(conn))) {
      return { ok: false, error: fail("connection-lost", `connection "${connectionId}" is down and could not be re-established`) };
    }
    // An exec channel always starts in the login home directory — the panel's
    // interactive shell may be somewhere else entirely. When the login shell
    // is POSIX-family, prepend the interactive-cwd prologue (see exec-cwd.js)
    // so the command runs where the operator's terminal is, and the resolved
    // directory comes back on a stripped marker line. Trash moves and other
    // destructive commands opt out of the transparent transport-loss retry so
    // one operator grant can never dispatch the same dangerous action twice.
    const shell = await this.resolveLoginShell(conn);
    const sent = posixLoginShell(shell) ? buildCwdAwareCommand(prepared) : prepared;
    const commandId = randomUUID();
    const startedAt = new Date().toISOString();
    const startedAtMs = Date.now();
    let state;
    try {
      state = await this.collectExecOutput(conn.client, sent, timeoutMs);
    } catch (error) {
      // The transport may have died between the liveness check and the exec.
      // Safe/idempotent calls may retry; destructive calls must report an
      // unknown outcome because the first dispatch may already have run.
      if (retryOnTransportLoss && !retried && conn.dead && (await this.ensureAlive(conn))) {
        return this.runPreparedExec(connectionId, prepared, displayCommand, trashRun, timeoutMs, true, retryOnTransportLoss);
      }
      return { ok: false, error: fail("exec-failed", error.message) };
    }
    const { cwd, stdout: execStdout } = extractExecCwd(state.stdout);
    let stdout = execStdout;
```

</details>

**依据 2 · 源码核查**：[src/index.js:3689-3711](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/index.js#L3689-L3711)

共享活动连接目标选择。

<details>
<summary>查看原文（23行）</summary>

```text
  resolveConnection(connectionId) {
    const resourceNames = this.savedResourceNameList();
    if (connectionId !== undefined) {
      const connection = this.connections.get(connectionId);
      if (connection !== undefined) return { ok: true, connectionId, connection };
      return { ok: false, error: fail("no-connection", noConnectionGuidance(connectionId, resourceNames, this.agentAutoConnect)) };
    }
    if (this.activeConnectionId !== null) {
      const connection = this.connections.get(this.activeConnectionId);
      if (connection !== undefined) {
        return { ok: true, connectionId: this.activeConnectionId, connection };
      }
      this.activeConnectionId = null;
    }
    if (this.connections.size === 1) {
      const [resolvedId, connection] = this.connections.entries().next().value;
      return { ok: true, connectionId: resolvedId, connection };
    }
    if (this.connections.size === 0) {
      return { ok: false, error: fail("no-connection", noConnectionGuidance(undefined, resourceNames, this.agentAutoConnect)) };
    }
    return { ok: false, error: fail("connection-selection-required", "multiple SSH connections are open; select a server in the SSH panel or provide connection_id") };
  }
```

</details>

**依据 3 · 源码核查**：[src/db-ops.js:1708-1727](https://github.com/caoyiwei850/dsh-ssh-ops/blob/bcea46d268fa0f6c07d86cbbf1dd658a0d6519c5/src/db-ops.js#L1708-L1727)

提交结果不明需查数据。

<details>
<summary>查看原文（20行）</summary>

```text
        });
      void settled;
      if (killed) {
        // Raced out: the connection is mid-protocol and its transaction state
        // is unknown, so drop it instead of returning it to the pool.
        if (tx.handle.kind === "mysql") tx.handle.conn.destroy();
        else tx.handle.client.release(new Error(`${label}: connection killed after timeout`));
        this.dbTransactions.delete(txId);
        if (tx.timer) clearTimeout(tx.timer);
        return fail(errorCode, `${label} timed out after ${opBudget}ms: the transaction outcome is unknown — verify the data before retrying`);
      }
      if (tx.handle.kind === "mysql") tx.handle.conn.release();
      else tx.handle.client.release();
      if (tx.timer) clearTimeout(tx.timer);
      this.dbTransactions.delete(txId);
      const value = { txId, finished: true };
      value[action === "COMMIT" ? "committed" : "rolledBack"] = true;
      return { ok: true, value };
    } catch (error) {
      this.dbTransactions.delete(txId);
```

</details>

#### 缺口

- 回执/默认不重放能否提升效果未验证。
  **影响**：不能给当前商业创新或恢复保证加分。
  **进一步探讨**：做上述故障对照，以错目标和净恢复成本决定继续。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
