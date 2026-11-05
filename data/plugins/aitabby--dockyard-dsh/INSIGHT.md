# Dockyard DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[654b82d](https://github.com/AITabby/dockyard-dsh/tree/654b82d716751a4c8fb872cbf043de694b7f424b)

<!-- BEGIN META -->
[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AITabby/dockyard-dsh)
<!-- END META -->

> **功能**：以原生provider适配和账户池在DSH管理登录、模型目录、额度与多Key请求切换。

> **亮点**：[Q01](#research-q01) 账户健康opToken和输出前切换；[Q02](#research-q02) 统一授权与引用存储。

> **主要限制**：[Q04](#research-q04) 根无条件改198.18/15的ipaddr分类且无restore；[Q03](#research-q03) usage目的地接受配置HTTPS并携key。

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
  - [Q01 · 根入口怎样把账户池变成DSH模型路由？](#detail-section-11)
  - [Q02 · OAuth、凭据存储和账户删除提供什么保证？](#detail-section-12)
  - [Q03 · 原生Key池、上下文与传输怎样改动既有请求？](#detail-section-13)
  - [Q04 · 安装、宿主网络补丁和退出需要哪些动作？](#detail-section-14)
  - [Q05 · 健康持久化失败是否应显式显示？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多个模型账号、愿意在独立DSH进程验证路由与凭据的开发者。

逐个配置DSH provider并手工管理登录与切换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 账户池 | 策略选择与健康守卫 | 无可用账号失败 |
| OAuth接入 | PKCE/state及凭据引用 | 授权可用性供应商条件 |
| DSH请求适配 | 原生流及输出前failover | 不保证停止和费用 |
| 原生Key池 | 解析补丁与usage | HTTPS配置目标可携key |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH/Node | 必需 | 注册adapter与remote | 宿主版本需验证 |
| 官方账号或API key | 按provider必需 | 认证模型额度 | 供应商可用性及条款外部条件 |
| DSH credentials/macOS Keychain | 凭据必需 | secret与state引用分离 | 平台不可用需明确失败 |
| Swift/CLI/本机会话 | 部分provider需要 | native或CLI fallback | 按实际平台选择，不承诺全覆盖 |
| 独立进程 | 试用条件 | 隔离全局ipaddr补丁 | 禁插件不足恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份state/key引用与provider配置，建独立进程 | 接受网络分类补丁 |
| 连接 | 单测试provider核OAuth和key存储 | 真实目的地与账号一致 |
| 请求 | 核输出前重试和输出后不切、取消 | 资源停止及费用分别检查 |
| 退出 | 撤销账号token再移除并完整重启 | 确认adapter与ipaddr恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 登录helper与依赖资源未测 | 核平台和provider真实可用 | 无桌面安装验证 |
| 持续 | 推理/订阅/API及刷新请求费 | 核额度unknown和状态 | 账号轮换不保证免费 |
| 故障 | 本地state及主机存储占盘 | 处理坏状态空池和持久化失败 | 重试可能已有上游费用 |
| 退出 | 完整进程重启与供应商撤销 | 清secret及fallback引用 | 列表删除非撤销或停在途 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 账户选择 | manual/sticky/roundrobin/failover及opToken | 真实容量与稳定性 |
| 授权引用 | PKCE/state与宿主credential映射 | 供应商权限及撤销 |
| 流切换 | 首实质输出前缓冲 | 取消和费用不重复证明 |
| Key控制 | 适配器解析补丁和usage查询 | 目标配置及实际挂载 |

> **思考**：[Q04](#research-q04) 根无条件改198.18/15的ipaddr分类且无restore；[Q03](#research-q03) usage目的地接受配置HTTPS并携key。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 账户健康opToken和输出前切换；[Q02](#research-q02) 统一授权与引用存储。

[Q03](#research-q03) Key查询和模型执行均须核目的地，不能由HTTPS校验推导官方白名单。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 根无条件改198.18/15的ipaddr分类且无restore；[Q03](#research-q03) usage目的地接受配置HTTPS并携key。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 独立进程先核全局补丁恢复再接测试账号。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态覆盖共享账户路由、OAuth、凭据和Key补丁；各provider真实授权与额度未运行。

- 已检查：作者 README、包清单、源码路径 package.json、packages/account-pool/src/account-pool.mjs、packages/core/src/dsh-route.mjs、packages/dsh-bridge/src/llm-adapter.mjs、packages/dsh-plugin/src/dockyard-credential-store.mjs、packages/dsh-plugin/src/dockyard-remote-host.mjs、packages/dsh-plugin/src/index.mjs、packages/dsh-plugin/src/native-key-pool-host.mjs、packages/dsh-plugin/src/native-usage.mjs、packages/dsh-plugin/src/vpn-ssrf-patch.mjs、packages/oauth/src/browser-oauth-authorizer.mjs、packages/providers/src/cli-agent-transport.mjs、packages/providers/src/native-transport.mjs、packages/runtime/src/dockyard-runtime.mjs、packages/runtime/src/state-store.mjs、packages/vault/src/index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根DSH provider插件及其共享核心；桌面app分发未计已验证能力，各供应商具体可用性未知。
- 下一步：测试账号核OAuth取消、secret删除、输出前后重试、磁盘失败及完整重启恢复，未执行。

**分析版本**

- **仓库**：[AITabby/dockyard-dsh](https://github.com/AITabby/dockyard-dsh)
- **版本号**：0.1.18（[固定提交 654b82d](https://github.com/AITabby/dockyard-dsh/tree/654b82d716751a4c8fb872cbf043de694b7f424b)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 健康保存未知的可见性是否改善重启恢复需对照。

测试账号核OAuth取消、secret删除、输出前后重试、磁盘失败及完整重启恢复，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 701 | — | — | 6852 |
| .mjs | source | 83 | 31092 | 27814 | 1290 | — |
| .js | source | 1 | 18959 | 18555 | 590 | — |
| .mjs | test | 28 | 10645 | 9732 | 325 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AITabby/dockyard-dsh/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AITabby/dockyard-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Dockyard怎样把账户池接入DSH原生请求，认证、切换、重试和宿主副作用的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根入口怎样把账户池变成DSH模型路由？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

根package main指向packages/dsh-plugin/dist，实际是DSH host/client provider插件；仓库桌面app是另一分发载体，不把其安装运行体验计为根插件已验证能力。apply组合provider executors/catalog loaders，注册llm adapter并保留disposer；账户runtime、命令和GUI共用同一实例，目录warm仅对已连接或显式warm能力provider启动。注册支持不等于各第三方端点现在可用。

账户池先排除过期/冷却和本次已失败账号，manual明确账号或默认、failover取首可用，sticky按session/request分配并受限清理，round-robin轮转。每select给单调opToken，旧report不能覆盖更新健康状态。stream暂存结构帧，只有实质输出才向外提交，空输出转错误；只有failover政策、无显式accountId且rate/quota/auth/empty等标记可切账号，有输出后不重放，避免重复工具副作用。这不是任意错误自动重试，也不保证远端失败前无费用。健康保存失败被吞以保留原响应，重启可能看不到最新失败。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-20](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/package.json#L13-L20)

根DSH入口

```text
  },
  "main": "./packages/dsh-plugin/dist/index.mjs",
  "exports": {
    ".": "./packages/dsh-plugin/dist/index.mjs",
    "./client": "./packages/dsh-plugin/lib/client.js",
    "./remote": "./packages/dsh-plugin/src/dockyard-typert.remote.mjs",
    "./typert": "./packages/dsh-plugin/src/dockyard-typert.host.mjs",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[packages/dsh-plugin/src/index.mjs:104-159](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/index.mjs#L104-L159)

共用runtime及注册释放

<details>
<summary>查看原文（56行）</summary>

```text
    runtimeOptions.providers = createDefaultProviderEntries(runtimeOptions);
    catalogWarmers = Object.entries(runtimeOptions.catalogLoaders)
      .filter(([, loader]) => typeof loader === "function");
  }
  const runtime = config.runtime ?? new DockyardRuntime(runtimeOptions);

  // Initialize the account pools before warming only providers that are
  // actually connected. This keeps optional vendors out of the model menu and
  // prevents their official session sources from competing for startup/network time.
  if (catalogWarmers.length > 0 && typeof runtime.init === "function") {
    void (async () => {
      await runtime.init();
      const providers = runtime.snapshot?.().providers ?? [];
      const connected = new Set(
        providers
          .filter((provider) => Array.isArray(provider.accounts) && provider.accounts.length > 0)
          .map((provider) => provider.providerId),
      );
      const accountsByProvider = new Map(providers.map((provider) => [provider.providerId, provider.accounts ?? []]));
      await Promise.all(catalogWarmers
        .filter(([providerId]) => connected.has(providerId)
          || runtime.hasProviderCapability?.(providerId, PROVIDER_BEHAVIOR_CAPABILITIES.CATALOG_WARMUP))
        .map(([providerId, loader]) => loader({ accounts: accountsByProvider.get(providerId) ?? [], secretStore: runtime.secretStore }).catch(() => null)));
    })().catch((error) => {
      contextLogger(ctx, "dockyard-dsh").warn?.(error);
    });
  }

  const adapter = createDockyardLlmAdapter({
    runtime,
    providerIds: config.providers ?? runtime.listProviderIds(),
    catalogCachePath: config.catalogCachePath ?? defaultCatalogCachePath(),
    // Resolve this only when a request is actually streamed. The attachment
    // service is installed by DSH's base profile after plugin composition;
    // reading it while the plugin graph is being composed breaks boot.
    attachmentsResolver: () => {
      try {
        return typeof ctx.get === "function" ? ctx.get("attachments") : ctx.attachments;
      } catch {
        return undefined;
      }
    },
  });
  const installAdapter = () => {
    const result = ctx.llm.registerAdapter(adapter.providers(), adapter);
    // DSH may hand back a disposer for hot reload/unplug; keep it so the
    // effect can unregister instead of leaving a stale adapter behind.
    return typeof result?.dispose === "function" ? result.dispose.bind(result)
      : typeof result === "function" ? result : null;
  };
  if (typeof ctx.effect === "function") {
    ctx.effect(() => {
      const disposeAdapter = installAdapter();
      return () => {
        try { disposeAdapter?.(); } catch { /* one failing dispose must not break teardown */ }
      };
```

</details>

**依据 3 · 源码核查**：[packages/account-pool/src/account-pool.mjs:124-183](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/account-pool/src/account-pool.mjs#L124-L183)

选账号与opToken

<details>
<summary>查看原文（60行）</summary>

```text
  select(context = {}) {
    const now = this.clock();
    this.#pruneSessionAssignments(now.getTime());
    const eligible = this.#eligibleAccounts(now);
    if (eligible.length === 0) {
      throw new AccountSelectionError(`No eligible accounts for provider ${this.providerId}`, {
        providerId: this.providerId,
      });
    }

    const excludedIds = new Set(Array.isArray(context.excludeAccountIds) ? context.excludeAccountIds : []);
    const selectable = eligible.filter((candidate) => !excludedIds.has(candidate.accountId));
    if (selectable.length === 0) {
      throw new AccountSelectionError("No eligible account remains after selection exclusions", {
        providerId: this.providerId,
        excludeAccountIds: [...excludedIds],
      });
    }

    let account;
    if (this.policy === ACCOUNT_SELECTION_POLICY.MANUAL) {
      const requestedId = context.accountId ?? this.#defaultAccountId ?? (
        selectable.length === 1 ? selectable[0].accountId : null
      );
      if (!requestedId) throw new AccountSelectionError("Manual policy requires accountId");
      account = selectable.find((candidate) => candidate.accountId === requestedId);
      if (!account) throw new AccountSelectionError(`Account is not eligible: ${requestedId}`, { accountId: requestedId });
    } else {
      const sticky = this.policy === ACCOUNT_SELECTION_POLICY.STICKY_SESSION;
      const assignmentKey = sticky ? context.sessionId ?? context.requestId ?? null : null;
      const assignment = assignmentKey ? this.#sessionAssignments.get(assignmentKey) : null;
      const assignedId = typeof assignment === "string" ? assignment : assignment?.accountId;
      account = assignedId
        ? selectable.find((candidate) => candidate.accountId === assignedId)
        : null;
      if (!account) {
        account = this.policy === ACCOUNT_SELECTION_POLICY.FAILOVER
          ? selectable[0]
          : this.#next(selectable);
      }
      if (assignmentKey) {
        this.#sessionAssignments.delete(assignmentKey);
        this.#sessionAssignments.set(assignmentKey, {
          accountId: account.accountId,
          lastUsedAt: now.getTime(),
        });
        this.#pruneSessionAssignments(now.getTime());
      }
    }

    const timestamp = now.toISOString();
    const updated = {
      ...account,
      lastUsedAt: timestamp,
      updatedAt: timestamp,
    };
    this.#accounts.set(updated.accountId, updated);
    const summary = accountSummary(updated);
    return { ...summary, opToken: ++this.#operationSeq };
  }
```

</details>

**依据 4 · 源码核查**：[packages/account-pool/src/account-pool.mjs:219-234](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/account-pool/src/account-pool.mjs#L219-L234)

旧健康报告拒绝

<details>
<summary>查看原文（16行）</summary>

```text
  report(accountId, result = {}, { opToken } = {}) {
    const account = this.#accounts.get(accountId);
    // Requests may finish after the user removes their account. Health for a
    // deleted record has no destination and must not replace the provider's
    // response with an unrelated selection error.
    if (!account) return null;

    // A report from an older operation must never overwrite newer health
    // state (e.g. a stale success flipping auth_expired back to healthy).
    // Unversioned reports (no opToken) keep their previous behavior.
    if (opToken !== undefined) {
      const lastReported = this.#reportedOpByAccount.get(accountId) ?? 0;
      if (opToken <= lastReported) return accountSummary(account);
      this.#reportedOpByAccount.set(accountId, opToken);
    }

```

</details>

**依据 5 · 源码核查**：[packages/core/src/dsh-route.mjs:10-14](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/core/src/dsh-route.mjs#L10-L14)

故障切换条件

```text
function shouldFailover(error, accountPool, context) {
  return accountPool.policy === ACCOUNT_SELECTION_POLICY.FAILOVER
    && !context.accountId
    && (error?.rateLimited || error?.quotaExhausted || error?.authExpired || error?.emptyOutput);
}
```

**依据 6 · 源码核查**：[packages/core/src/dsh-route.mjs:160-224](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/core/src/dsh-route.mjs#L160-L224)

输出前缓冲与重试边界

<details>
<summary>查看原文（65行）</summary>

```text

    stream(request, context = {}) {
      return (async function* streamWithHealth() {
        const excludedIds = new Set(context.excludeAccountIds ?? []);
        let lastError = null;
        while (true) {
          let account;
          try {
            account = accountPool.select(selectionContext(context, excludedIds));
          } catch (selectionError) {
            throw lastError ?? selectionError;
          }
          excludedIds.add(account.accountId);
          const auth = accountPool.resolve(account.accountId);
          const selectedAccount = providerAccount(account, auth);
          const selectedRequest = requestWithContextWindow(
            request,
            providerModule.manifest.id,
            request?.model,
            account.accountId,
            contextWindowOverrides,
          );
          const pending = [];
          let hasOutput = false;
          try {
            const output = providerModule.stream(selectedRequest, { account: selectedAccount, auth }, context);
            for await (const chunk of await output) {
              if (!hasOutput && !hasSubstantiveStreamOutput(chunk)) {
                pending.push(chunk);
                continue;
              }
              if (!hasOutput) {
                hasOutput = true;
                for (const buffered of pending) yield buffered;
              }
              yield chunk;
            }
            if (!hasOutput) {
              const terminalError = pending.map(errorFromTerminalChunk).find(Boolean);
              const error = terminalError ?? new Error("Provider stream ended without substantive output");
              if (!terminalError) {
                error.code = "EMPTY_STREAM_OUTPUT";
                error.emptyOutput = true;
              }
              throw error;
            }
            reportAccount(accountPool, account.accountId, { status: "success" }, { opToken: account.opToken });
            return;
          } catch (error) {
            reportAccount(accountPool, account.accountId, {
              status: failureStatus(error),
              cooldownUntil: failureCooldown(error, selectedAccount),
              message: error?.message,
            }, { opToken: account.opToken });
            if (!hasOutput && shouldFailover(error, accountPool, context)) {
              lastError = error;
              continue;
            }
            throw error;
          }
        }
      })();
    },
  };
}
```

</details>

**依据 7 · 源码核查**：[packages/runtime/src/dockyard-runtime.mjs:950-973](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/dockyard-runtime.mjs#L950-L973)

健康持久化失败不替响应

<details>
<summary>查看原文（24行）</summary>

```text
  async stream(providerId, request, context = {}) {
    await this.init();
    const route = this.bridge.getRoute(providerId);
    if (!route) throw new Error(`Unknown Dockyard provider route: ${providerId}`);
    const output = route.stream(request, providerContext(this, context));
    const runtime = this;
    return (async function* streamWithPersistedHealth() {
      try {
        for await (const chunk of await output) yield chunk;
      } finally {
        // dsh-route reports success/auth failure while the stream is being
        // consumed. Persist that result after either completion or failure so
        // a later popup refresh and a process restart see the same health.
        try {
          await runtime.#saveState([providerId]);
        } catch {
          // Never replace the provider's response error with a state-store
          // error. The next explicit refresh can still persist the snapshot.
        }
      }
    })();
  }

  snapshot() {
```

</details>

#### 缺口

- 各provider实时目录、授权可用性和失败重试真实费用未验证
  **影响**：不能把账号池等同稳定可用或降费
  **进一步探讨**：独立profile两测试账号对照输出前/后失败及固定账号不切换

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth、凭据存储和账户删除提供什么保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

共用浏览器OAuth authorizer产生PKCE及随机state，callback只绑定loopback，回调和手动code#state都校state；finalize有单flight与cancel状态复查，callback/code交换与import后再检查cancel。但取消session并非供应商侧token撤销，也不自动撤销已完成的导入/在途网络。provider具体scopes、官方身份与条款仍是外部条件，不能由统一authorizer推导全部登录都安全或可用。

DSH Credentials适配将opaque ref哈希成宿主变量名，新写走credentials.set；读缺失可fallback旧本机存储。macOS vault使用Swift Keychain helper，非darwin原始vault unavailable；因此Windows实际依赖宿主credentials，不可照旧macOS-only描述概括。账号快照只ref而非token，state使用跨进程锁、temp0600/fsync/rename，更新锁内合并；损坏JSON复读后归档并回空池，这是可恢复启动设计，不是保留可用账号保证。remove先删池并保存，再尝试删本地secret，失败只diagnostic。移除列表不会供应商登出、撤销token或中止已选账号在途请求，也不能当完整凭据销毁证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/oauth/src/browser-oauth-authorizer.mjs:164-194](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/oauth/src/browser-oauth-authorizer.mjs#L164-L194)

回调state校验

<details>
<summary>查看原文（31行）</summary>

```text
  async function handleCallback(session, req, res) {
    const requestUrl = new URL(req.url ?? "/", "http://localhost");
    if (requestUrl.pathname !== session.callbackPath) {
      res.statusCode = 404;
      res.end("Not found");
      return;
    }
    const error = requestUrl.searchParams.get("error");
    const code = requestUrl.searchParams.get("code") ?? "";
    const state = requestUrl.searchParams.get("state") ?? "";
    if (state !== session.state) {
      session.status = "failed";
      session.diagnostic = "OAuth state 校验失败";
      responseHtml(res, "授权未完成", "安全校验失败，可以关闭此页面并重新开始授权。", 400);
      await cleanup(session);
      return;
    }
    if (error) {
      session.callback = { error, state };
      responseHtml(res, "授权未完成", "官方授权被拒绝，可以关闭此页面。");
      return;
    }
    if (!code) {
      session.callback = { error: "授权回调没有返回 code", state };
      responseHtml(res, "授权未完成", "回调缺少授权码，可以关闭此页面。");
      return;
    }
    session.callback = { code, state };
    responseHtml(res, "授权成功", "已收到授权回调，正在返回 Dockyard DSH。");
  }

```

</details>

**依据 2 · 源码核查**：[packages/oauth/src/browser-oauth-authorizer.mjs:283-301](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/oauth/src/browser-oauth-authorizer.mjs#L283-L301)

PKCE/state生成

<details>
<summary>查看原文（19行）</summary>

```text
  async function begin() {
    const pkce = createPkce();
    const session = {
      sessionId: `${providerId}:browser:${randomUUID()}`,
      providerId,
      status: "pending",
      authorizationUrl: null,
      instructions,
      startedAt: new Date().toISOString(),
      browserOpened,
      authorizationCodeRequired,
      callbackPath,
      callbackPort,
      redirectUri,
      state: base64Url(randomBytes(24)),
      codeVerifier: pkce.verifier,
      callback: null,
      server: null,
      timer: null,
```

</details>

**依据 3 · 源码核查**：[packages/oauth/src/browser-oauth-authorizer.mjs:241-279](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/oauth/src/browser-oauth-authorizer.mjs#L241-L279)

singleflight及取消复查

<details>
<summary>查看原文（39行）</summary>

```text
  async function finalize(session, context = {}) {
    if (session.result) return session.result;
    if (session.cancelled || session.status === "cancelled") return publicSession(session);
    if (session.finalizing) return session.finalizing;
    session.finalizing = (async () => {
      try {
        const callback = session.callback;
        if (session.cancelled || session.status === "cancelled") return publicSession(session);
        if (!callback && !session.credentials) return publicSession(session);
        if (callback?.error) throw new Error(callback.error);
        const exchanged = session.credentials ?? await exchangeCode({
          code: callback.code,
          state: callback.state,
          codeVerifier: session.codeVerifier,
          redirectUri: session.redirectUri,
          context,
        });
        if (session.cancelled || session.status === "cancelled") return publicSession(session);
        const accounts = await importCredentials(exchanged, context);
        if (session.cancelled || session.status === "cancelled") return publicSession(session);
        if (!Array.isArray(accounts) || accounts.length === 0) {
          throw new Error("官方授权完成，但 provider 没有返回可接入的订阅账号");
        }
        session.status = "completed";
        session.result = {
          ...publicSession(session),
          accounts,
          diagnostic: null,
        };
        return session.result;
      } catch (error) {
        if (session.cancelled || session.status === "cancelled") return publicSession(session);
        session.status = "failed";
        session.diagnostic = redactError(error);
        return publicSession(session);
      } finally {
        await cleanup(session);
      }
    })();
```

</details>

**依据 4 · 源码核查**：[packages/oauth/src/browser-oauth-authorizer.mjs:360-391](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/oauth/src/browser-oauth-authorizer.mjs#L360-L391)

手动state与cancel清理

<details>
<summary>查看原文（32行）</summary>

```text
    const parsed = extractCodeInput(input);
    if (String(input ?? "").length > 8192) {
      session.diagnostic = "授权回调输入过长，请粘贴官方返回的完整回调地址。";
      return publicSession(session);
    }
    if (parsed.state !== session.state) {
      session.status = "failed";
      session.diagnostic = "OAuth state 校验失败，请重新提交当前会话返回的回调地址。";
      await cleanup(session);
      return publicSession(session);
    } else if (parsed.error) {
      session.callback = { error: parsed.error, state: parsed.state };
    } else if (!parsed.code) {
      session.diagnostic = "请粘贴包含 state 的完整回调地址，或使用 code#state 格式。";
      return publicSession(session);
    } else {
      session.callback = { code: parsed.code, state: parsed.state };
    }
    return finalize(session, context);
  }

  async function cancel(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return { sessionId, providerId, status: "missing" };
    session.cancelled = true;
    session.status = "cancelled";
    await cleanup(session);
    sessions.delete(sessionId);
    return { sessionId, providerId, status: "cancelled" };
  }

  return Object.freeze({ begin, poll, submitAuthorizationCode, cancel });
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin/src/dockyard-credential-store.mjs:26-56](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/dockyard-credential-store.mjs#L26-L56)

宿主存储及fallback

<details>
<summary>查看原文（31行）</summary>

```text
export function createDockyardCredentialStore(credentials, fallback = null) {
  const usable = credentials
    && typeof credentials.resolve === "function"
    && typeof credentials.set === "function"
    && typeof credentials.unset === "function";

  return {
    async read(ref) {
      if (usable) {
        const resolved = await credentials.resolve(dshCredentialRef(ref));
        const parsed = parseCredential(resolved?.value);
        if (parsed !== null) return parsed;
      }
      return typeof fallback?.read === "function" ? fallback.read(ref) : null;
    },

    async write(ref, value) {
      if (usable) {
        await credentials.set(dshCredentialRef(ref), JSON.stringify(value));
        return ref;
      }
      if (typeof fallback?.write !== "function") throw new Error("DSH Credentials 尚未就绪");
      return fallback.write(ref, value);
    },

    async delete(ref) {
      if (usable) await credentials.unset(dshCredentialRef(ref));
      if (typeof fallback?.delete === "function") await fallback.delete(ref);
    },
  };
}
```

</details>

**依据 6 · 源码核查**：[packages/runtime/src/state-store.mjs:126-179](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/state-store.mjs#L126-L179)

损坏归档空池

<details>
<summary>查看原文（54行）</summary>

```text

  async load() {
    // Corruption recovery archives the broken file; that mutation must not
    // race a concurrent writer's temp-file+rename commit, so read and recover
    // under the same cross-process lock the writer holds.
    return withFileLock(this.filePath, () => this.#loadUnlocked());
  }

  /**
   * Load without acquiring the file lock. Callers already holding the lock
   * (save/update) use this to avoid re-entrant lock acquisition.
   */
  async #loadUnlocked() {
    let raw;
    try {
      raw = await readFile(this.filePath, "utf8");
    } catch (error) {
      if (error?.code === "ENOENT") return emptyState();
      throw error;
    }
    try {
      return this.#parse(raw);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      // The file may have been corrupt only momentarily: another process could
      // have committed a valid snapshot right after our read. Re-read once
      // under the lock before concluding the state is unrecoverable.
      try {
        raw = await readFile(this.filePath, "utf8");
        return this.#parse(raw);
      } catch (retryError) {
        if (retryError?.code === "ENOENT") return emptyState();
        if (!(retryError instanceof SyntaxError)) throw retryError;
      }
      // A corrupt state file must not brick the whole plugin at boot. Archive
      // the broken file and fall back to a fresh empty state so a later save
      // can rebuild the snapshot from the live account pool.
      const archivePath = `${this.filePath}.corrupted.${Date.now()}`;
      await rename(this.filePath, archivePath).catch(() => {});
      return emptyState();
    }
  }

  #parse(raw) {
    const parsed = JSON.parse(raw);
    return {
      ...emptyState(),
      ...parsed,
      pools: parsed?.pools && typeof parsed.pools === "object" ? parsed.pools : {},
    };
  }

  async save(state) {
    return withFileLock(this.filePath, async () => {
```

</details>

**依据 7 · 源码核查**：[packages/runtime/src/state-store.mjs:182-213](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/state-store.mjs#L182-L213)

锁内写状态

<details>
<summary>查看原文（32行）</summary>

```text
      const current = await this.#loadUnlocked();
      return this.#write({ ...current, ...(state ?? {}) });
    });
  }

  async update(mutator) {
    if (typeof mutator !== "function") throw new TypeError("State update mutator must be a function");
    return withFileLock(this.filePath, async () => {
      const current = await this.#loadUnlocked();
      const next = await mutator(current);
      return this.#write(next);
    });
  }

  async #write(state) {
    const next = {
      ...emptyState(),
      ...state,
      updatedAt: new Date().toISOString(),
    };
    await mkdir(dirname(this.filePath), { recursive: true, mode: 0o700 });
    const tempPath = `${this.filePath}.${randomUUID()}.tmp`;
    let committed = false;
    try {
      await writeFile(tempPath, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 });
      // Crash consistency: fsync the temp file before the rename so the new
      // snapshot cannot be lost (or arrive half-written) after a power cut,
      // then fsync the directory so the rename itself is durable.
      const handle = await open(tempPath, "r+");
      try {
        await handle.sync();
      } finally {
```

</details>

**依据 8 · 源码核查**：[packages/runtime/src/dockyard-runtime.mjs:884-907](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/dockyard-runtime.mjs#L884-L907)

移除先保存后删除secret

<details>
<summary>查看原文（24行）</summary>

```text
  async removeAccount(providerId, accountId) {
    await this.init();
    const entry = this.#entry(providerId);
    const credential = entry.pool.resolve(accountId);
    if (!entry.pool.remove(accountId)) {
      throw new Error(`Account does not exist: ${accountId}`);
    }
    await this.#saveState([providerId]);

    const diagnostics = [];
    if (credential.credentialRef && typeof this.secretStore?.delete === "function") {
      try {
        await this.secretStore.delete(credential.credentialRef);
      } catch (error) {
        diagnostics.push(`清理本机 Keychain 引用失败：${redactError(error)}`);
      }
    }
    return {
      providerId,
      accountId,
      removed: true,
      defaultAccountId: entry.pool.getDefaultAccountId(),
      diagnostics,
    };
```

</details>

#### 缺口

- 供应商端撤销、宿主credential保护和中途取消import未实测
  **影响**：账号可消失但token或请求仍有效，坏状态会空池
  **进一步探讨**：测试账户导出ref清单后验证删除和供应商撤销分别完成

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 原生Key池、上下文与传输怎样改动既有请求？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

NativeKeyPoolHost不仅管理新provider，还patch已有适配器resolveApiKey/resolveModel/prepareCall，并监听llm/stream，通过AsyncLocalStorage把本次选key与排除集传给解析函数。failover最多试configured key数，未可见输出时才重试，已发可见chunk不切；已知参数/模型/context错误不轮询其他key。status显示native-single-key时说明patch未挂，不应仍宣称池已生效。LLM adapter另在compaction强制minimal reasoning、thinking false，并按context override改模型元数据，这是行为改写，不是透明无损转发。

通用native fetch接调用signal和300秒timer，流解析finally清理；CLI流向进程树TERM再延迟KILL并等待关闭，Windows经taskkill路径，真实远端命令与provider取消仍需验证。usage读profile.baseURL优先于内置地址，合法HTTPS或HTTP loopback即可，带选中apiKey访问user/balance/credits；这不是固定官方域名白名单，用户配置其他HTTPS目的地时凭据会跟过去。远程控制层只转服务调用并剥离auth私有字段，未在这些方法看到独立用户ACL；要验证宿主remote授权，不能说共享部署已隔离。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/native-key-pool-host.mjs:239-262](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/native-key-pool-host.mjs#L239-L262)

监听和恢复patch

<details>
<summary>查看原文（24行）</summary>

```text
  async start() {
    await this.readyPromise;
    await this.contextWindowOverrides?.ready?.();
    this.resolveServices();
    this.patchAdapters();
    if (typeof this.ctx.on === "function") {
      this.offAdapters = this.ctx.on("llm/adapters-updated", () => this.patchAdapters());
      this.offStreams = this.ctx.on("llm/stream", (options, next) => this.stream(options, next));
    }
    this.patchAdapters();
    return this;
  }

  dispose() {
    this.offAdapters?.();
    this.offStreams?.();
    this.offAdapters = null;
    this.offStreams = null;
    for (const patch of this.patches.splice(0)) {
      if (patch.config?.resolveApiKey?.[PATCH_MARK] === patch.wrapper) {
        patch.config.resolveApiKey = patch.original;
      }
      if (patch.target?.[patch.method]?.[PATCH_MARK] === patch.wrapper) {
        patch.target[patch.method] = patch.original;
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/src/native-key-pool-host.mjs:293-322](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/native-key-pool-host.mjs#L293-L322)

补丁适配器

<details>
<summary>查看原文（30行）</summary>

```text
      const original = config?.resolveApiKey;
      if (!config || typeof original !== "function" || original?.[PATCH_MARK]) continue;
      // llm-pi-ai resolves `(provider, profile)`, while the optional native
      // DeepSeek adapter resolves `(connection)`. Keep both wire contracts
      // intact; the request-level pool only replaces the bearer value.
      const directConnectionResolver = typeof config.options === "function"
        && typeof config.resolveUserId === "function";
      const wrapper = directConnectionResolver
        ? async (connection) => this.resolveDirectApiKey(connection, original)
        : async (providerId, profile) => this.resolveApiKey(providerId, profile, original);
      Object.defineProperty(wrapper, PATCH_MARK, { value: wrapper });
      config.resolveApiKey = wrapper;
      this.patches.push({ config, original, wrapper });

      // DSH records request/context from the model metadata resolved by the
      // adapter, before the later llm/stream waterfall runs. Patch the
      // adapter's model seams too, otherwise a request override can be real
      // at the provider boundary while the session meter still shows the
      // catalog's stale 262K/272K capacity.
      this.patchAdapterMethod(adapter, "modelOf", (modelOf) => function (...args) {
        const model = applyNativeProviderModelCompat(args[1], modelOf.apply(this, args));
        const contextWindow = thisHost.contextWindowForModel(args[1], args[2]);
        return applyModelContextWindow(model, contextWindow);
      });
      this.patchAdapterMethod(adapter, "resolveModel", (resolveModel) => async function (...args) {
        const model = applyNativeProviderModelCompat(args[0], await resolveModel.apply(this, args));
        const contextWindow = thisHost.contextWindowForModel(args[0], args[1]);
        return applyModelContextWindow(model, contextWindow);
      });
      this.patchAdapterMethod(adapter, "prepareCall", (prepareCall) => async function (...args) {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/src/native-key-pool-host.mjs:531-588](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/native-key-pool-host.mjs#L531-L588)

输出前Key重试

<details>
<summary>查看原文（58行）</summary>

```text
  async *stream(options, next) {
    if (typeof next !== "function") return;
    if (this.#contextOverrideRequests.delete(options)) {
      yield* next();
      return;
    }
    const requestState = { excluded: new Set(), lastResolvedKey: null };
    if (!this.shouldRetry(options?.provider)) {
      yield* iterateWithContext(this.#requestContext, requestState, async () => {
        return this.streamWithContextWindow(options, next, requestState);
      });
      return;
    }
    const configured = await this.configuredKeys(this.records.get(options.provider));
    const attempts = Math.max(1, configured.filter((entry) => entry.configured).length);
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      // Failover semantics: the first attempt uses the primary key; each
      // retry excludes the key that just failed so the next attempt advances
      // to the next configured key. The exclusion set is cleared when the
      // stream settles so healthy requests return to the primary key.
      if (attempt > 0 && requestState.lastResolvedKey) {
        requestState.excluded.add(requestState.lastResolvedKey);
      }
      const buffered = [];
      let emitted = false;
      let retryable = false;
      try {
        const output = iterateWithContext(this.#requestContext, requestState, async () => {
          return this.streamWithContextWindow(options, next, requestState);
        });
        for await (const chunk of output) {
          if (VISIBLE_STREAM_CHUNKS.has(chunk?.type)) emitted = true;
          if (!emitted) buffered.push(chunk);
          else if (buffered.length > 0) {
            yield* buffered.splice(0);
            yield chunk;
          } else yield chunk;
          if (chunk?.type === "finish" && chunk.reason?.kind === "error") {
            // Retry unclassified terminal failures, but skip known
            // non-retryable request errors (invalid argument, unsupported
            // model, context length): they fail identically on every other
            // key and would only burn the pool and pollute key health.
            retryable = !emitted && !nonRetryableStreamFailure(chunk.reason.failure);
            if (retryable && attempt + 1 < attempts) break;
          }
        }
      } catch (error) {
        retryable = !emitted && retryableStreamError(error);
        if (!retryable || attempt + 1 >= attempts) throw error;
      }
      if (retryable && !emitted && attempt + 1 < attempts) continue;
      if (buffered.length > 0) yield* buffered;
      return;
    }
  }

  async refreshUsage(providerId, signal) {
    const synced = await this.syncProvider(providerId);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-bridge/src/llm-adapter.mjs:538-583](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-bridge/src/llm-adapter.mjs#L538-L583)

compaction和请求上下文

<details>
<summary>查看原文（46行）</summary>

```text
    async *stream(options) {
      await ensureRuntimeReady();
      if (!providerHasConnectedAccount(runtime, options.provider)) {
        throw new ValidationError(`Provider ${options.provider} has no connected Dockyard account`);
      }
      // The model picker has already selected an id. Catalog discovery is
      // useful for metadata and validation, but it must not delay the first
      // provider request on a cold start or after a catalog TTL expires.
      const catalog = cachedProviderCatalog(options.provider);
      if (!catalog) warmProviderCatalog(options.provider);
      const model = catalog
        ? providerCatalogModels(options.provider, catalog).find((entry) => entry.id === options.model)
        : null;
      if (requestHasImageInCurrentTurn(options) && Array.isArray(model?.inputModalities)
        && !model.inputModalities.includes("image")) {
        throw unsupportedContentError(
          `模型 ${model.name ?? model.id} 的实时 provider catalog 未声明图片输入能力`,
        );
      }
      const request = model
        ? {
            ...options,
            ...(model.context ? { modelContext: { ...model.context } } : {}),
            ...(model.defaultMaxTokens !== undefined
              ? { modelContext: { ...(model.context ?? {}), maxTokens: model.defaultMaxTokens } }
              : {}),
          }
        : { ...options };
      if (options.purpose === "compaction") {
        // Strip heavy reasoning effort during compaction so summarization runs swiftly
        // without timing out or spending minutes in chain-of-thought exploration.
        request.purpose = "compaction";
        request.reasoningEffort = "minimal";
        request.reasoning_effort = "minimal";
        request.thinking = false;
      }
      const attachments = typeof attachmentsResolver === "function"
        ? attachmentsResolver()
        : undefined;
      const stream = await runtime.stream(options.provider, request, {
        accountId: options.accountId,
        requestId: options.requestId,
        sessionId: options.sessionId,
        ...(options.signal ? { signal: options.signal } : {}),
        ...(attachments ? { attachments } : {}),
      });
```

</details>

**依据 5 · 源码核查**：[packages/providers/src/native-transport.mjs:221-250](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/providers/src/native-transport.mjs#L221-L250)

signal/timeout

<details>
<summary>查看原文（30行）</summary>

```text
export async function fetchNativeResponse(url, init = {}, {
  providerId,
  timeoutMs = 300_000,
  fetchImpl = fetch,
} = {}) {
  const controller = new AbortController();
  let timedOut = false;
  let cleaned = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const upstreamSignal = init.signal;
  const abort = () => controller.abort(upstreamSignal?.reason);
  const timeoutError = nativeProviderError(providerId, "request timed out");
  timeoutError.code = "ETIMEDOUT";
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    clearTimeout(timer);
    upstreamSignal?.removeEventListener?.("abort", abort);
  };
  const control = { providerId, cleanup, get timedOut() { return timedOut; }, timeoutError };
  let handedOff = false;
  if (upstreamSignal) {
    if (upstreamSignal.aborted) abort();
    else upstreamSignal.addEventListener("abort", abort, { once: true });
  }
  try {
    const response = await fetchImpl(url, { ...init, signal: controller.signal });
```

</details>

**依据 6 · 源码核查**：[packages/providers/src/cli-agent-transport.mjs:201-233](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/providers/src/cli-agent-transport.mjs#L201-L233)

进程树终止

<details>
<summary>查看原文（33行）</summary>

```text
  return (async function* streamLines() {
    const detached = PROCESS_GROUP_PLATFORM;
    const child = spawnCli(command, args, {
      env,
      ...(cwd ? { cwd } : {}),
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true,
      detached,
      ...(signal ? { signal } : {}),
    });
    const stdout = [];
    const stderr = [];
    const stdoutSize = { total: 0 };
    const stderrSize = { total: 0 };
    let outputLimitError = null;
    let spawnError = null;
    let timedOut = false;
    let abortRequested = Boolean(signal?.aborted);
    let closedResult = null;
    let forceTimer = null;
    let timer = null;
    let terminationRequested = false;
    const terminate = () => {
      if (closedResult || terminationRequested) return;
      terminationRequested = true;
      killProcessTree(child, "SIGTERM", { detached });
      forceTimer = setTimeout(() => {
        if (!closedResult) {
          killProcessTree(child, "SIGKILL", { detached });
        }
      }, KILL_GRACE_MS);
      forceTimer.unref?.();
    };
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin/src/native-usage.mjs:11-19](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/native-usage.mjs#L11-L19)

profile目的地优先

```text
function baseUrlFor(providerId, profile) {
  const configured = typeof profile?.baseURL === "string" ? profile.baseURL.trim() : "";
  const baseUrl = configured || builtinBaseUrls.get(providerId) || null;
  return baseUrl ? validateNativeEndpoint(baseUrl, { providerId }) : null;
}

function endpoint(baseUrl, path) {
  if (!baseUrl) throw new Error("provider 没有返回可用的 base URL");
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
```

**依据 8 · 源码核查**：[packages/dsh-plugin/src/native-usage.mjs:41-58](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/native-usage.mjs#L41-L58)

余额携key

<details>
<summary>查看原文（18行）</summary>

```text
function bearerHeaders(apiKey) {
  return { Authorization: `Bearer ${apiKey}`, Accept: "application/json" };
}

function updatedAt() {
  return new Date().toISOString();
}

function deepseekBalanceModule() {
  return {
    id: "deepseek-balance",
    supports: ["deepseek", "deepseek-official"],
    async fetch({ providerId, profile, apiKey, signal }) {
      const body = await readJson(await fetch(endpoint(baseUrlFor(providerId, profile), "user/balance"), {
        method: "GET",
        headers: bearerHeaders(apiKey),
        signal,
      }));
```

</details>

**依据 9 · 源码核查**：[packages/providers/src/native-transport.mjs:30-47](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/providers/src/native-transport.mjs#L30-L47)

允许HTTPS非白名单

<details>
<summary>查看原文（18行）</summary>

```text
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`${providerId} endpoint is invalid`);
  }
  if (url.username || url.password) {
    throw new Error(`${providerId} endpoint must not include embedded credentials`);
  }
  if (url.hash) {
    throw new Error(`${providerId} endpoint must not include a URL fragment`);
  }
  const localHttp = url.protocol === "http:" && isLoopbackHostname(url.hostname);
  if (url.protocol !== "https:" && !localHttp) {
    throw new Error(`${providerId} endpoint must use HTTPS; HTTP is only allowed for loopback development`);
  }
  return url.toString();
}
```

</details>

**依据 10 · 源码核查**：[packages/dsh-plugin/src/dockyard-remote-host.mjs:39-70](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/dockyard-remote-host.mjs#L39-L70)

远程转发边界

<details>
<summary>查看原文（32行）</summary>

```text

  async snapshot() {
    return this.dockyard.snapshot();
  }

  async refresh(request = {}) {
    const providerId = request?.providerId ?? null;
    const result = await this.dockyard.refresh(providerId);
    return envelope(result, await this.dockyard.snapshot());
  }

  async scan(request = {}) {
    const result = await this.dockyard.scan(request?.providerId ?? null);
    return envelope(result, await this.dockyard.snapshot());
  }

  async add(request = {}) {
    const result = await this.dockyard.add(
      request?.providerId ?? null,
      request?.candidateId ?? null,
      {
        apiKey: request?.apiKey ?? null,
        label: request?.label ?? "",
      },
    );
    return envelope(result, await this.dockyard.snapshot());
  }

  async login(request) {
    // The browser client opens a synchronous popup before this RPC call;
    // suppress the host-level `open` fallback to avoid a duplicate tab.
    const result = publicAuthResult(await this.dockyard.startAuthorization(request.providerId, { openBrowser: false }));
```

</details>

#### 缺口

- 宿主适配器版本、真实停止、Key池请求作用域及remote权限未运行
  **影响**：可能选key未生效或误配目的地，不能凭UI保证实际账号
  **进一步探讨**：只测试目标域名和无敏感key，记录真实headers目的地、取消及输出后不重试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、宿主网络补丁和退出需要哪些动作？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

根入口无条件patchFakeIpVpnSupport，改所有发现的ipaddr IPv4.prototype.range，把198.18/19开头改unicast，保留其他range原逻辑。它不是仅对模型域名或确认VPN时生效，也没有restore disposer；禁用插件后同进程仍可能保持补丁，需重启进程恢复原模块。该范围可能用于VPN fake-IP，也可能确实是保留测试网络，不能把允许它普遍称安全修复。

运行需兼容DSH/Node、模型账号、宿主credentials或macOS Swift/Keychain，官方本机会话源与CLI按provider和平台不同；不要因README免费字样推导无限额度或可用性。模型/订阅/API费用按供应商实际产生，轮换和CLI工具会多请求，catalog/额度刷新也联网；UI额度unknown应保持未知。试用仅独立DSH进程和可丢弃工作区，先备份state、credential refs与原provider配置，明确这一进程网络range被改后再接一测试账号，核目的地、key、取消与compaction。若不能接受宿主网络补丁、远程ACL未知或授权状态不明，应停用。退出先停在途生成和OAuth，删除本地账号及key引用并在供应商侧撤销，再移除插件并完整重启，核无adapter补丁和198.18分类恢复。独立桌面app构建/签名未在本研究运行，不作为安装成功证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/src/index.mjs:53-55](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/index.mjs#L53-L55)

无条件VPN patch

```text
export function apply(ctx, config = {}) {
  patchFakeIpVpnSupport();
  const runtimeOptions = { ...(config.runtimeOptions ?? {}) };
```

**依据 2 · 源码核查**：[packages/dsh-plugin/src/vpn-ssrf-patch.mjs:28-76](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/vpn-ssrf-patch.mjs#L28-L76)

全实例原型补丁无restore

<details>
<summary>查看原文（49行）</summary>

```text

  const patchedPrototypes = new Set();
  const applyProtoPatch = (proto) => {
    if (!proto?.range || patchedPrototypes.has(proto)) return;
    const origRange = proto.range;
    proto.range = function () {
      if (this.octets?.[0] === 198 && (this.octets?.[1] === 18 || this.octets?.[1] === 19)) {
        return "unicast";
      }
      return origRange.call(this);
    };
    patchedPrototypes.add(proto);
  };

  // 1. Patch the statically imported ipaddr.js
  if (ipaddr?.IPv4?.prototype) {
    applyProtoPatch(ipaddr.IPv4.prototype);
  }

  // 2. Discover and patch any other ipaddr.js instances in the runtime (e.g. Electron asar)
  const req = createRequire(import.meta.url);
  const candidates = [
    "ipaddr.js",
    "/Applications/DeepSeek Harness.app/Contents/Resources/app.asar/dsh/node_modules/ipaddr.js",
  ];
  if (typeof process?.execPath === "string") {
    try {
      candidates.push(join(dirname(dirname(process.execPath)), "Resources/app.asar/dsh/node_modules/ipaddr.js"));
    } catch {}
  }

  for (const cand of candidates) {
    try {
      const mod = req(cand);
      if (mod?.IPv4?.prototype) applyProtoPatch(mod.IPv4.prototype);
    } catch {}
  }

  if (typeof req?.cache === "object" && req.cache) {
    for (const [key, val] of Object.entries(req.cache)) {
      if (key.includes("ipaddr") && val?.exports?.IPv4?.prototype) {
        applyProtoPatch(val.exports.IPv4.prototype);
      }
    }
  }

  isPatched = true;
  return true;
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/src/index.mjs:181-200](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/index.mjs#L181-L200)

宿主credential接入

<details>
<summary>查看原文（20行）</summary>

```text
    if (typeof ctx.provide === "function") ctx.provide("dockyard", service);
    // Cordis only makes the injected credential/settings services available
    // after this effect enters the active plugin fiber. Do not construct the
    // host during apply(), or a missing service can abort the entire DSH boot.
    let nativeKeyPool = config.nativeKeyPool ?? null;
    const install = () => {
      try {
        const credentials = typeof ctx.get === "function" ? ctx.get("credentials") : ctx.credentials;
        if (credentials && typeof runtime.setSecretStore === "function") {
          runtime.setSecretStore(createDockyardCredentialStore(credentials, runtime.secretStore));
        }
      } catch (error) {
        contextLogger(ctx, "dockyard-dsh").warn?.(`DSH Credentials 接入失败，将保留原有安全存储：${error.message}`);
      }
      // Start after the Cordis effect enters the active plugin fiber. Native
      // key-pool wiring is optional and must never prevent the DSH web host
      // from booting while the service graph is still settling.
      nativeKeyPool ??= new NativeKeyPoolHost(ctx, {
        logger: config.serviceOptions?.logger ?? contextLogger(ctx, "dockyard-dsh"),
        contextWindowOverrides: runtime.contextWindowOverrides,
```

</details>

**依据 4 · 源码核查**：[packages/vault/src/index.mjs:109-135](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/vault/src/index.mjs#L109-L135)

macOS helper与平台界限

<details>
<summary>查看原文（27行）</summary>

```text
  async read(ref) {
    try {
      const output = await runKeychainHelper({ operation: "read", service: this.service, account: ref, value: null });
      return output.found ? JSON.parse(output.value) : null;
    } catch (error) {
      throw error;
    }
  }

  async write(ref, value) {
    await runKeychainHelper({
      operation: "write",
      service: this.service,
      account: ref,
      value: JSON.stringify(value),
    });
    return ref;
  }

  async delete(ref) {
    await runKeychainHelper({ operation: "delete", service: this.service, account: ref, value: null });
  }
}

export function createDefaultSecretStore({ platform = process.platform } = {}) {
  if (platform !== "darwin") return new UnavailableSecretStore({ platform });
  return new MacOSKeychainStore();
```

</details>

**依据 5 · 源码核查**：[packages/runtime/src/dockyard-runtime.mjs:733-782](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/dockyard-runtime.mjs#L733-L782)

刷新去重超时及过时结果拒绝

<details>
<summary>查看原文（50行）</summary>

```text
  async refreshAccount(providerId, accountId, { force = false, tolerateFailure = false } = {}) {
    await this.init();
    // Deduplicate only calls with identical semantics: a lenient background
    // refresh must never answer a strict foreground call (and vice versa),
    // and forced refreshes must not be satisfied by cached in-flight ones.
    const key = `${providerId}\u0000${accountId}\u0000${force ? "force" : "auto"}\u0000${tolerateFailure ? "lenient" : "strict"}`;
    const existing = this.#accountRefreshPromises.get(key);
    if (existing) return existing;

    const promise = (async () => {
      try {
        return await withRefreshTimeout(
          (signal) => this.#refreshAccountNow(providerId, accountId, { force, tolerateFailure, signal }),
          { providerId, accountId, timeoutMs: this.refreshTimeoutMs },
        );
      } catch (error) {
        if (!error?.refreshTimeout || !tolerateFailure) throw error;
        await this.init();
        const entry = this.#entry(providerId);
        if (entry.pool.get(accountId)) {
          entry.pool.report(accountId, { status: "error", message: error.message });
          await this.#saveState([providerId]);
        }
        return { account: entry.pool.get(accountId), diagnostics: [error.message] };
      }
    })();
    this.#accountRefreshPromises.set(key, promise);
    try {
      return await promise;
    } finally {
      if (this.#accountRefreshPromises.get(key) === promise) this.#accountRefreshPromises.delete(key);
    }
  }

  async #refreshAccountNow(providerId, accountId, { force = false, tolerateFailure = false, signal } = {}) {
    await this.init();
    const entry = this.#entry(providerId);
    providerAccount(entry.pool, accountId);
    const diagnostics = [];
    let authorizationFailure = null;
    let refresh = null;
    try {
      refresh = await entry.module.refreshAccount(
        providerAccount(entry.pool, accountId),
        providerContext(this, { force, signal }),
      );
      // A provider may ignore AbortSignal and resolve after our timeout. Never
      // commit a late refresh result into the live pool.
      if (signal?.aborted) throw signal.reason ?? refreshTimeoutError(providerId, accountId, this.refreshTimeoutMs);
      this.#applyPatch(entry.pool, accountId, refresh);
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin/src/dockyard-remote-host.mjs:1-17](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/dsh-plugin/src/dockyard-remote-host.mjs#L1-L17)

公开OAuth结果剥离

<details>
<summary>查看原文（17行）</summary>

```text
import { Remote, TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";

export function publicAuthResult(result) {
  if (!result || typeof result !== "object") return result;
  return {
    status: result.status,
    ...(result.providerId ? { providerId: result.providerId } : {}),
    ...(result.sessionId ? { sessionId: result.sessionId } : {}),
    ...(result.authorizationUrl ? { authorizationUrl: result.authorizationUrl } : {}),
    ...(result.instructions ? { instructions: result.instructions } : {}),
    ...(result.browserOpened ? { browserOpened: true } : {}),
    ...(result.inputRequired ? { inputRequired: true } : {}),
    ...(result.authorizationCodeRequired ? { authorizationCodeRequired: true } : {}),
    ...(result.diagnostic ? { diagnostic: result.diagnostic } : {}),
    ...(Array.isArray(result.accounts) ? { accounts: result.accounts } : {}),
  };
}
```

</details>

#### 缺口

- 所有provider平台矩阵、实时额度和应用卸载恢复未验证
  **影响**：真实操作成本与权限边界不确定
  **进一步探讨**：独立进程先核补丁接受度和恢复，再单provider试用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 健康持久化失败是否应显式显示？

**研究主题**：新假设与验证

#### 完整回答

当前stream终于保存健康但失败被吞，避免覆盖原provider结果。可检验改进是保留原响应同时在快照另给healthPersistence=unknown，提示重启可能忘记冷却，而不把正常输出误作失败重试。对照磁盘只读/锁超时/正常路径，观察用户是否错误重复选过期账号、重启后重复费用和恢复时间。若现有日志已足够或提示造成不必要的重复刷新，则不支持新增状态的收益；该方向不能解决供应商额度或所有并发事务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/runtime/src/dockyard-runtime.mjs:950-973](https://github.com/AITabby/dockyard-dsh/blob/654b82d716751a4c8fb872cbf043de694b7f424b/packages/runtime/src/dockyard-runtime.mjs#L950-L973)

原响应优先和持久化吞失败

<details>
<summary>查看原文（24行）</summary>

```text
  async stream(providerId, request, context = {}) {
    await this.init();
    const route = this.bridge.getRoute(providerId);
    if (!route) throw new Error(`Unknown Dockyard provider route: ${providerId}`);
    const output = route.stream(request, providerContext(this, context));
    const runtime = this;
    return (async function* streamWithPersistedHealth() {
      try {
        for await (const chunk of await output) yield chunk;
      } finally {
        // dsh-route reports success/auth failure while the stream is being
        // consumed. Persist that result after either completion or failure so
        // a later popup refresh and a process restart see the same health.
        try {
          await runtime.#saveState([providerId]);
        } catch {
          // Never replace the provider's response error with a state-store
          // error. The next explicit refresh can still persist the snapshot.
        }
      }
    })();
  }

  snapshot() {
```

</details>

#### 缺口

- 显示持久化未知对恢复有无收益未测
  **影响**：新提示可能制造噪声或额外刷新
  **进一步探讨**：故障注入测试账号并比较重启选择和用户恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
