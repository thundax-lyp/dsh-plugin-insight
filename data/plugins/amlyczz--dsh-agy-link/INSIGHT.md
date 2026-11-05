# dsh-agy-link

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d1c2fb8](https://github.com/amlyczz/dsh-agy-link/tree/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2)

<!-- BEGIN META -->
[![GitHub ★ 148](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=148&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-agy-link) [![npm 30d 11,371](https://img.shields.io/static/v1?label=npm+30d&message=11%2C371&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-agy-link)
<!-- END META -->

> **功能**：把本地 Antigravity CLI 接入 DSH，并提供账号池和配额管理。

> **亮点**：[Q01](#research-q01) 将 CLI 模型纳入 DSH 并接入账号池。

> **主要限制**：[Q02](#research-q02) 机器凭据槽、主环境继承和外部服务都要核对。

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
  - [Q01 · 模型怎样进入 DSH？](#detail-section-11)
  - [Q02 · 账号轮换和凭据隔离能保证什么？](#detail-section-12)
  - [Q03 · 怎样试用或退出？](#detail-section-13)
  - [Q04 · 怎样减少错误轮换？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 agy 授权并希望在 DSH 使用模型的开发者。

直接运行单账号 agy 并手工判断故障。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型接入 | 通过本地 CLI 请求模型 | 需实际授权和网络 |
| 账号池 | 选择及冷却账号 | 凭据槽和退出需验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH、Node 与 agy | 必需 | 注册并执行模型 | 保留原生 CLI |
| 可用授权与网络 | 真实请求必需 | 提供外部服务 | 停在检查 |
| 隔离系统 | 凭据测试需要 | 测试槽恢复 | 不改真实账号 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 检查 | 用户核对固定包和 CLI | 确认出口与账号 |
| 观察 | 操作者用虚拟凭据验证 | 核对写回与还原 |
| 退出 | 用户停止并检查主账号 | 恢复单账号 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | CLI 与账户成本未知 | 准备授权和代理 | 未实测 |
| 持续 | 模型、代理与轮询资源 | 维护多账号 | 真实费用未知 |
| 恢复 | 重试与重授权资源 | 核对凭据槽 | 可能需要人工 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主接入 | 注册 adapter 并驱动 CLI | 真实兼容 |
| 账号调度 | 按出口及错误选择 | 真实额度与状态恢复 |

> **思考**：[Q02](#research-q02) 机器凭据槽、主环境继承和外部服务都要核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将 CLI 模型纳入 DSH 并接入账号池。

[Q02](#research-q02) 按 grant 识别凭据写回，不能代替 OS 验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 机器凭据槽、主环境继承和外部服务都要核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先检查隔离条件。[Q02](#research-q02) 要核对实际凭据还原。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持注册和代表凭据机制。未运行 agy、真实账号或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/adapter.ts、src/host/credential-slot.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定注册、账号和进程代表路径，未执行。
- 下一步：使用虚拟 CLI、出口和凭据槽测试取消、故障、恢复。

**分析版本**

- **仓库**：[amlyczz/dsh-agy-link](https://github.com/amlyczz/dsh-agy-link)
- **版本号**：0.5.5（[固定提交 d1c2fb8](https://github.com/amlyczz/dsh-agy-link/tree/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将轮换原因可视化并验证对排障的影响。

使用虚拟 CLI、出口和凭据槽测试取消、故障、恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 4460 | — | — | 97311 |
| .mts | source | 3 | 198 | 154 | 23 | — |
| .mjs | source | 2 | 270 | 226 | 24 | — |
| .ts | source | 51 | 28101 | 21443 | 5080 | — |
| .ts | test | 55 | 15902 | 13170 | 1404 | — |
| .mjs | test | 1 | 306 | 227 | 68 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/amlyczz/dsh-agy-link/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：agy 模型如何进入宿主，轮换和凭据边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型怎样进入 DSH？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有 agy 账号而希望保留 DSH 会话的开发者，可由宿主模型路由委托本地 CLI。宿主启用时注册适配器，后者构造 stream-json 参数，进程前复查取消，为备用账号准备单独 home 或凭据设施，并选择代理。与逐个窗口手工运行 CLI 相比，它提供统一路由和账号调度。模型、认证及用量仍由外部程序和服务决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:202-209](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/README.md#L202-L209)

作者说明架构

```text
## 🧩 架构与工作原理

1. **短生命周期进程驱动**：每一轮 DSH 对话启动一个独立的官方 `agy -p --output-format stream-json` 进程，解析 NDJSON 事件流。
2. **多账号沙箱机制**：除主账号沿用系统默认 Keychain / HOME 外，所有备用账号在插件私有目录下建立专属 HOME 隔离区，独立写入 agy 格式的标准 OAuth 凭证。Windows 上 agy 的凭据实际存放在机器级 Credential Manager（`gemini:antigravity`），插件因此以「身份级引用计数租约」接管该槽：**同一授权的多个会话并行运行**，只有账号**身份切换**才串行，且由最后一个持有者还原主账号凭据。
3. **多 Bucket 官方配额汇总**：插件定时后台静默轮询官方 `v1internal:retrieveUserQuotaSummary`，精准掌控每个账号的 5h 滚动削峰水位、7d 账号阶梯周额度，以及付费账号的 Argon 独立周池。
4. **会话级无缝故障转移**：当遭遇 HTTP 429、额度耗尽或凭证异常时，号池调度器自动标记当前账号家族进入冷却（或按额度到期时间择优轮换），并无缝将后续请求路由到池内下一个有效账号。
5. **失败分类与自愈**：错误按 AUTH / NETWORK / RATE_LIMIT / ELIGIBILITY 等精确分类；网络抖动借由 agy 运行日志自动甄别为可重试故障，绝不误伤健康账号的登录状态。
6. **辅助通道隔离**：`/tsl` 翻译、会话标题生成、任务目标推导等通过独立专用辅助通道执行，共享号池与冷却机制，不占主会话绑定与工具权限。
```

**依据 2 · 源码核查**：[src/index.ts:652-674](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/index.ts#L652-L674)

探测与注册

<details>
<summary>查看原文（23行）</summary>

```text
          log('dormant: ' + dormantReason)
          return
        }
        dormantReason = null
        log('agy detected: ' + (versionCache ?? 'unknown version'))
      } catch {
        log('version probe failed — continuing with fallback catalog')
      }
      await catalog.refreshIfNeeded().catch(() => undefined)
      notifyPicker()
    })();
  }, 4_000)
  bootProbeTimer.unref?.()
  ctx.effect(() => () => clearTimeout(bootProbeTimer))

  // ---- llm registration (dormant-safe) ----
  if (getConfig().enabled) {
    try {
      ctx.llm.registerAdapter([PROVIDER_ID], adapter)
      log('registered provider route: ' + PROVIDER_ID)
    } catch (e) {
      log('adapter registration failed: ' + String(e))
    }
```

</details>

**依据 3 · 源码核查**：[src/host/adapter.ts:1138-1150](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/adapter.ts#L1138-L1150)

流式 CLI 参数

<details>
<summary>查看原文（13行）</summary>

```text
    const args: string[] = ['--output-format', 'stream-json', '--print-timeout', ptMins + 'm']
    if (opts.permissionMode === 'skip') args.push('--dangerously-skip-permissions')
    else args.push('--mode', opts.permissionMode)
    const effectiveModel = resolveModelSlug(opts.model)
    if (effectiveModel !== '') args.push('--model', effectiveModel)
    const isGemini = effectiveModel === '' || effectiveModel.toLowerCase().startsWith('gemini') || effectiveModel.toLowerCase().startsWith('argon')
    if (isGemini && opts.effort && opts.effort !== '') args.push('--effort', opts.effort)
    if (opts.conversationId) args.push('--conversation', opts.conversationId)
    for (const d of opts.addDirs ?? []) args.push('--add-dir', d)
    args.push(...opts.extraArgs)
    if (opts.promptViaStdin) {
      args.push('--input-format', 'stream-json')
    } else {
```

</details>

**依据 4 · 源码核查**：[src/host/adapter.ts:2262-2289](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/adapter.ts#L2262-L2289)

取消、HOME 与环境

<details>
<summary>查看原文（28行）</summary>

```text
    if (options.signal?.aborted) {
      releaseOnce()
      throw new LlmError('request aborted before the agy process was spawned', Err.AGY_ERROR)
    }
    // Only SECONDARY pool accounts get an isolated HOME. The primary
    // account rides the real system HOME (agy 1.1.15 keeps credentials in
    // the macOS Keychain); injecting HOME there signs agy out ("Please
    // sign in") and every turn fails with an auth error.
    if (account && account.dir) ensureIsolatedKeychain(account.dir)
    // Snapshot agy's per-run log set BEFORE spawning so evidence found after
    // the run can be attributed to THIS run (each invocation writes a fresh
    // cli-*.log). The stderr banner for a failed silent auth is byte-identical
    // for a genuine sign-out and for a keyring validation that died on the
    // network; only this log separates the two.
    const runLogHome = agyHomeDirFor(account)
    const runLogsBefore = snapshotAgyLogs(runLogHome)
    const effectiveProxy = account?.proxyUrl || cfg.proxyUrl || detectSystemProxy() || undefined
    const env = {
      ...process.env,
      // Identity for the MCP reverse bridge (issue #55): agy passes its env to
      // the MCP server it spawns, so the bridge script learns which DSH session
      // this run belongs to and the host can resolve the calling agent.
      ...(sessionKey === '' ? {} : { DSH_MCP_SESSION: sessionKey }),
      ...(cfg.disableTelemetry
        ? {
            DO_NOT_TRACK: '1',
            DISABLE_TELEMETRY: '1',
            GOOGLE_CLOUD_DISABLE_TELEMETRY: '1',
```

</details>

#### 缺口

- 未执行 CLI 或账号授权
  **影响**：无法证实模型与平台兼容
  **进一步探讨**：先在隔离宿主用虚拟 CLI 核对参数和取消

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 账号轮换和凭据隔离能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

共享出口的网络错误不会按账号轮换，过载也保持当前账号；独立出口网络错误及认证问题可转移，认证隔离有证据判据。凭据槽代码在运行期间维护同身份租约，最后释放时只有同 grant 的变化才写回备用账号，再尽力还原主账号。它仍操作机器级凭据状态，异常退出或第三方改槽的最终状态需核实。进程环境以宿主环境展开，单独 HOME 不是通用进程隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/adapter.ts:2628-2669](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/adapter.ts#L2628-L2669)

网络、过载及认证边界

<details>
<summary>查看原文（42行）</summary>

```text
        //  - AUTH: the account is marked authRequired below, which already
        //    excludes it from rotation; rotating here makes the intent explicit.
        // Account-scoped failures that must advance the pointer so the retry tries another account:
        //  - RATE_LIMIT: account quota spent (cooldown applied in recordFailure above)
        //  - NETWORK / AUTH: transport blip or dead login for this specific account
        // Server capacity overload (OVERLOADED / 503 / 529): Google-side pressure.
        // We deliberately STAY on the current account with exponential backoff rather
        // than rotating, protecting healthy accounts in the pool from cascaded exhaustion.
        //
        // A transport failure only belongs on that list when the accounts have
        // SEPARATE egress. With one shared proxy the failure says nothing about
        // the account: rotating repoints the session, drops the conversation
        // binding and spends the rotation budget a quota hop needs.
        const sharedEgressNetwork = failure.code === Err.NETWORK && this.sharesSingleEgress()
        const rotateAway = !outcome.aborted && failure.code !== Err.RATE_LIMIT
          && failure.code !== Err.OVERLOADED
          && !sharedEgressNetwork
          && (failure.code === Err.NETWORK
            || failure.code === Err.AUTH)
        if (rotateAway && account) this.deps.pool?.advanceAccount(account.id, family)
        // Only authoritative auth states may flag an account: the old
        // /auth/i substring matched "oauth2.googleapis.com … i/o timeout"
        // transport noise and quarantined healthy accounts until a manual
        // quota refresh disproved the flag. NETWORK is not AUTH, and
        // shouldMarkAuthRequired additionally exempts transport-shaped text.
        if (account && shouldMarkAuthRequired(failure.code, failure.message)) {
          // Authoritative OAuth evidence (invalid_grant, revoked…) or the
          // explicit re-login paths quarantine immediately. A bare "not signed
          // in" banner carries no such proof — it is byte-identical for a real
          // sign-out and a keyring validation that lost the network race — so
          // it needs a second independent confirmation before it may take the
          // account out of rotation.
          const authoritative = isAuthoritativeAuthError(rawErrText + ' ' + runLogText)
          if (failure.code === Err.AUTH && !authoritative) {
            this.deps.pool?.noteAuthFailure(account.id, failure.message)
          } else {
            this.deps.pool?.markAuthRequired(account.id, failure.message)
          }
        }
        // A conversation only becomes unusable when the login died or agy
        // itself rejected the id. Rate limits / overload / transport blips do
        // NOT invalidate it: deleting the binding there threw away a resumable
```

</details>

**依据 2 · 源码核查**：[src/host/credential-slot.ts:1242-1288](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/credential-slot.ts#L1242-L1288)

租约、同身份写回及主槽恢复

<details>
<summary>查看原文（47行）</summary>

```text
    installSlotOrThrow(io, accountRaw, log, account.alias || account.id)
    releaseLockFileNow()
    // This account's identity is installed and STAYS installed while any
    // same-identity peer is live: the mutex this lease holds is handed back by
    // the LAST holder, which also restores the primary. Until then agy may
    // rotate the access token in place as often as it likes — the grant (and
    // therefore the identity) is unchanged.
    const state: InstalledIdentity = {
      fingerprint: accountFingerprint,
      holders: 1,
      finish: (): void => {
        try {
          const afterRaw = io.readSlot()
          const afterFingerprint = credentialFingerprint(afterRaw)
          if (sameCredentialGrant(afterRaw, accountRaw)) {
            // Slot still belongs to this account: agy may have refreshed the
            // access token, so persist it back into the account's own file.
            if (afterRaw && afterRaw !== accountRaw) {
              writeFileAtomic(accountFile, afterRaw)
            }
          } else if (afterFingerprint !== null) {
            // The slot was taken over while this run was live. Writing it back
            // would copy a FOREIGN credential into this account's file — the
            // exact bug that destroyed this pool. Leave the file untouched.
            log(
              `[agy-link] credential slot was replaced during ${account.alias || account.id}'s run — ` +
                'refusing to write a foreign credential into the account file',
            )
          }
        } finally {
          try {
            installSlotBestEffort(io, primary.raw, log, 'primary')
          } finally {
            done()
          }
        }
      },
    }
    installedIdentity = state
    // Identity installed: peers on this grant may join now. A queued switcher
    // keeps its own claim, so this only releases THIS run's guard.
    releaseClaim()
    slotEvents.emit('installed', accountFingerprint)
    return {
      identity: account.email,
      release: (): void => leaveInstalledIdentity(state),
    }
```

</details>

**依据 3 · 源码核查**：[src/host/adapter.ts:2266-2289](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/adapter.ts#L2266-L2289)

备用与宿主环境的差别

<details>
<summary>查看原文（24行）</summary>

```text
    // Only SECONDARY pool accounts get an isolated HOME. The primary
    // account rides the real system HOME (agy 1.1.15 keeps credentials in
    // the macOS Keychain); injecting HOME there signs agy out ("Please
    // sign in") and every turn fails with an auth error.
    if (account && account.dir) ensureIsolatedKeychain(account.dir)
    // Snapshot agy's per-run log set BEFORE spawning so evidence found after
    // the run can be attributed to THIS run (each invocation writes a fresh
    // cli-*.log). The stderr banner for a failed silent auth is byte-identical
    // for a genuine sign-out and for a keyring validation that died on the
    // network; only this log separates the two.
    const runLogHome = agyHomeDirFor(account)
    const runLogsBefore = snapshotAgyLogs(runLogHome)
    const effectiveProxy = account?.proxyUrl || cfg.proxyUrl || detectSystemProxy() || undefined
    const env = {
      ...process.env,
      // Identity for the MCP reverse bridge (issue #55): agy passes its env to
      // the MCP server it spawns, so the bridge script learns which DSH session
      // this run belongs to and the host can resolve the calling agent.
      ...(sessionKey === '' ? {} : { DSH_MCP_SESSION: sessionKey }),
      ...(cfg.disableTelemetry
        ? {
            DO_NOT_TRACK: '1',
            DISABLE_TELEMETRY: '1',
            GOOGLE_CLOUD_DISABLE_TELEMETRY: '1',
```

</details>

**依据 4 · 作者声明**：[README.md:202-208](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/README.md#L202-L208)

作者说明平台凭据槽

```text
## 🧩 架构与工作原理

1. **短生命周期进程驱动**：每一轮 DSH 对话启动一个独立的官方 `agy -p --output-format stream-json` 进程，解析 NDJSON 事件流。
2. **多账号沙箱机制**：除主账号沿用系统默认 Keychain / HOME 外，所有备用账号在插件私有目录下建立专属 HOME 隔离区，独立写入 agy 格式的标准 OAuth 凭证。Windows 上 agy 的凭据实际存放在机器级 Credential Manager（`gemini:antigravity`），插件因此以「身份级引用计数租约」接管该槽：**同一授权的多个会话并行运行**，只有账号**身份切换**才串行，且由最后一个持有者还原主账号凭据。
3. **多 Bucket 官方配额汇总**：插件定时后台静默轮询官方 `v1internal:retrieveUserQuotaSummary`，精准掌控每个账号的 5h 滚动削峰水位、7d 账号阶梯周额度，以及付费账号的 Argon 独立周池。
4. **会话级无缝故障转移**：当遭遇 HTTP 429、额度耗尽或凭证异常时，号池调度器自动标记当前账号家族进入冷却（或按额度到期时间择优轮换），并无缝将后续请求路由到池内下一个有效账号。
5. **失败分类与自愈**：错误按 AUTH / NETWORK / RATE_LIMIT / ELIGIBILITY 等精确分类；网络抖动借由 agy 运行日志自动甄别为可重试故障，绝不误伤健康账号的登录状态。
```

#### 缺口

- 未运行跨进程租约或操作系统凭据恢复
  **影响**：无法保证崩溃下状态或所有账号隔离
  **进一步探讨**：在隔离 OS 测试账号切换、断开及外部占槽

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用或退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者要求 DSH、Node、agy 和网络连通。应先固定制品及本地 CLI，以虚拟账号机制验证读取、取消和预期出口，不在日常机器上首次演练多账号覆盖。持续成本包括 CLI 进程、后台额度读取及代理维护；未核实服务条款、价格或实时可用性。若凭据不能读回或账号状态异常，应停止多账号并沿用单账号原生 CLI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:112-146](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/README.md#L112-L146)

作者环境和安装说明

<details>
<summary>查看原文（35行）</summary>

````text
## 📋 前置要求

在安装本插件前，请确保具备以下环境：

| 前置项 | 说明 / 验证方式 |
| --- | --- |
| **1. 系统网络代理** | **【必须开启】**（推荐开启 Clash / Surge / v2rayA / Sing-box 的 TUN 模式或设置 `HTTPS_PROXY` 环境变量，确保可流畅连接 Google 服务） |
| **2. DeepSeek Harness (DSH)** | 你正在使用的 DSH 客户端；`dsh --version` 可验证 |
| **3. Node.js ≥ 24** | DSH 依赖环境；`node --version` 验证 |
| **4. Google Antigravity `agy` CLI** | 按 [Google 官方安装文档](https://antigravity.google/docs/cli/install) 安装（支持 macOS / Linux / Windows）。`agy --version` 能输出版本号即表示安装成功 |

> 💡 **提示**：即使你的 agy 尚未登录，也可以直接安装插件！在 DSH 界面顶部点击 `AGY` 徽标或进入「设置 → Antigravity」，点击「➕ 添加账号」即可直接在浏览器中完成登录。

---

## 🚀 快速上手

```bash
# 0. 确保系统代理 / TUN 模式已开启（国内网络必需）：
export HTTPS_PROXY=http://127.0.0.1:7890 HTTP_PROXY=http://127.0.0.1:7890

# 1. 安装插件（npm 官方包，无需编译构建）：
dsh plugin --profile web add dsh-agy-link

# 升级到最新版：
# dsh plugin --profile web add dsh-agy-link@latest --registry https://registry.npmjs.org

# 2. 启动 DSH Web GUI，在输入框中检查状态：
#   /agy status

# 3. 登录与添加账号：
#   方式 A：点击顶部导航栏的 "AGY (n)" 徽标，点击 "➕ 添加账号"，浏览器一键登录；
#   方式 B：输入框执行 /agy auth 为主账号发起登录。

# 4. 在 /model 选择器中挑选 Antigravity 模型，立即开启对话！
````

</details>

**依据 2 · 作者声明**：[README.md:250-252](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/README.md#L250-L252)

服务条款条件

```text
## ⚠️ 免责声明

本插件仅通过调用用户本地官方安装的未修改 `agy` CLI 进程进行交互。使用本插件需遵循 Google Antigravity 服务条款。
```

**依据 3 · 源码核查**：[src/host/credential-slot.ts:1252-1276](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/credential-slot.ts#L1252-L1276)

退出需核对凭据槽

<details>
<summary>查看原文（25行）</summary>

```text
      finish: (): void => {
        try {
          const afterRaw = io.readSlot()
          const afterFingerprint = credentialFingerprint(afterRaw)
          if (sameCredentialGrant(afterRaw, accountRaw)) {
            // Slot still belongs to this account: agy may have refreshed the
            // access token, so persist it back into the account's own file.
            if (afterRaw && afterRaw !== accountRaw) {
              writeFileAtomic(accountFile, afterRaw)
            }
          } else if (afterFingerprint !== null) {
            // The slot was taken over while this run was live. Writing it back
            // would copy a FOREIGN credential into this account's file — the
            // exact bug that destroyed this pool. Leave the file untouched.
            log(
              `[agy-link] credential slot was replaced during ${account.alias || account.id}'s run — ` +
                'refusing to write a foreign credential into the account file',
            )
          }
        } finally {
          try {
            installSlotBestEffort(io, primary.raw, log, 'primary')
          } finally {
            done()
          }
```

</details>

#### 缺口

- 未测试制品、真实环境与卸载
  **影响**：实际费用及退出恢复未知
  **进一步探讨**：用可丢弃账号和虚拟凭据检查恢复后再考虑接入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少错误轮换？

**研究主题**：新假设与验证

#### 完整回答

现有逻辑区分共享出口与独立出口，可把决策原因和当前账号身份以脱敏形式显示，辅助判断修代理或重新授权。对照现有界面，在共享代理断开、单出口断开、额度耗尽和认证失效四种情形测正确决策与重试。若误轮换或排障时间未降，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/adapter.ts:2628-2665](https://github.com/amlyczz/dsh-agy-link/blob/d1c2fb8d5e82ac10da0059768dafa6b9fc6242a2/src/host/adapter.ts#L2628-L2665)

可显示的决策边界

<details>
<summary>查看原文（38行）</summary>

```text
        //  - AUTH: the account is marked authRequired below, which already
        //    excludes it from rotation; rotating here makes the intent explicit.
        // Account-scoped failures that must advance the pointer so the retry tries another account:
        //  - RATE_LIMIT: account quota spent (cooldown applied in recordFailure above)
        //  - NETWORK / AUTH: transport blip or dead login for this specific account
        // Server capacity overload (OVERLOADED / 503 / 529): Google-side pressure.
        // We deliberately STAY on the current account with exponential backoff rather
        // than rotating, protecting healthy accounts in the pool from cascaded exhaustion.
        //
        // A transport failure only belongs on that list when the accounts have
        // SEPARATE egress. With one shared proxy the failure says nothing about
        // the account: rotating repoints the session, drops the conversation
        // binding and spends the rotation budget a quota hop needs.
        const sharedEgressNetwork = failure.code === Err.NETWORK && this.sharesSingleEgress()
        const rotateAway = !outcome.aborted && failure.code !== Err.RATE_LIMIT
          && failure.code !== Err.OVERLOADED
          && !sharedEgressNetwork
          && (failure.code === Err.NETWORK
            || failure.code === Err.AUTH)
        if (rotateAway && account) this.deps.pool?.advanceAccount(account.id, family)
        // Only authoritative auth states may flag an account: the old
        // /auth/i substring matched "oauth2.googleapis.com … i/o timeout"
        // transport noise and quarantined healthy accounts until a manual
        // quota refresh disproved the flag. NETWORK is not AUTH, and
        // shouldMarkAuthRequired additionally exempts transport-shaped text.
        if (account && shouldMarkAuthRequired(failure.code, failure.message)) {
          // Authoritative OAuth evidence (invalid_grant, revoked…) or the
          // explicit re-login paths quarantine immediately. A bare "not signed
          // in" banner carries no such proof — it is byte-identical for a real
          // sign-out and a keyring validation that lost the network race — so
          // it needs a second independent confirmation before it may take the
          // account out of rotation.
          const authoritative = isAuthoritativeAuthError(rawErrText + ' ' + runLogText)
          if (failure.code === Err.AUTH && !authoritative) {
            this.deps.pool?.noteAuthFailure(account.id, failure.message)
          } else {
            this.deps.pool?.markAuthRequired(account.id, failure.message)
          }
```

</details>

#### 缺口

- 未核对既有界面提示及实际表现
  **影响**：无法确定提示增量
  **进一步探讨**：先查现有状态，再对照模拟故障

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
