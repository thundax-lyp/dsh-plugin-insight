# dsh-tabbit

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[4d256b7](https://github.com/Tabbit-Browser/dsh-tabbit/tree/4d256b7db3317961e3599bf2820e8b1be6e2d2be)

<!-- BEGIN META -->
[![GitHub ★ 122](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=122&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tabbit-Browser/dsh-tabbit) [![npm 30d 2,395](https://img.shields.io/static/v1?label=npm+30d&message=2%2C395&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tabbit) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-tabbit)
<!-- END META -->

> **功能**：将 Tabbit 浏览器任务、网页抓取和标签提及接入 DSH，并为页面访问设置审批。

> **亮点**：[Q01](#research-q01) 连接本地真实浏览器、会话任务与宿主工具。

> **主要限制**：[Q02](#research-q02) 授权记忆、一般浏览器动作与抓取重定向需要区分。

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
  - [Q01 · Tabbit 为 DSH 网页任务增加什么？](#detail-section-11)
  - [Q02 · 已有审批能覆盖哪些网页访问？](#detail-section-12)
  - [Q03 · 何时值得试用？](#detail-section-13)
  - [Q04 · 怎样检验重定向是否真的无法触及内网？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要用现有浏览器读取渲染网页、登录页或标签上下文的 DSH 用户。

用 DSH 直接 HTTP 抓取，或由用户手动复制网页内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 浏览器任务 | 求值及标签认领 | 使用本地真实 profile |
| 网页抓取 | 使用浏览器获取网页 | 内网闸和 Runtime 边界需分别验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 Tabbit 与 launcher | 必需 | 运行浏览器任务 | 回原抓取或人工 |
| 匹配 Node 与 DSH Web | 必需 | 加载宿主与客户端插件 | 核对固定版本 |
| 测试浏览器配置 | 隔离验证需要 | 限制登录态范围 | 暂停试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核对版本并选测试实例 | 没有真实账号 |
| 验证 | 只读和拒绝路径 | 核对请求和工具结果 |
| 退出 | 清理任务并禁用插件 | 确认原抓取恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 额外浏览器运行开销未知 | 核对版本及 launcher | 未实测 |
| 持续 | 更新和进程成本未知 | 管理实例和授权 | 需实测 |
| 退出 | 恢复成本未知 | 检查遗留标签和抓取 | 按实际结果处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 网页上下文 | 浏览器任务求值接线 | 真实网站适配 |
| 内网控制 | 入参审批和最终 URL 内容拦截 | 实际网络边界 |

> **思考**：[Q02](#research-q02) 授权记忆、一般浏览器动作与抓取重定向需要区分。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 连接本地真实浏览器、会话任务与宿主工具。

[Q02](#research-q02) 分开核对权限钩子和 Runtime 导航。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 授权记忆、一般浏览器动作与抓取重定向需要区分。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先试独立实例中的合成页面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本代表源码核对，未运行 Tabbit 或 DSH。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/permissions/index.ts、src/tool-browser/index.ts、src/web-fetch/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主 bundle、浏览器工具、抓取和权限代表源码。
- 下一步：验证实例、按 origin 记忆、重定向请求和任务清理。

**分析版本**

- **仓库**：[Tabbit-Browser/dsh-tabbit](https://github.com/Tabbit-Browser/dsh-tabbit)
- **版本号**：0.4.1（[固定提交 4d256b7](https://github.com/Tabbit-Browser/dsh-tabbit/tree/4d256b7db3317961e3599bf2820e8b1be6e2d2be)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 请求前逐跳检查可能减少内网目标收到的未授权请求。

验证实例、按 origin 记忆、重定向请求和任务清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1579 | — | — | 10972 |
| .js | source | 1 | 424 | 225 | 188 | — |
| .mjs | source | 1 | 59 | 41 | 12 | — |
| .ts | source | 19 | 6584 | 3873 | 2357 | — |
| .mjs | test | 10 | 2937 | 2547 | 251 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/Tabbit-Browser/dsh-tabbit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Tabbit-Browser/dsh-tabbit/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Tabbit-Browser/dsh-tabbit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Tabbit 怎样复用浏览器实例，其权限有哪些边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Tabbit 为 DSH 网页任务增加什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要登录态、渲染页或正在打开的标签页的用户，可通过 DSH 工具把任务交给已有 Tabbit 实例。工具向客户端传代码及任务名，执行后记录会话、任务和实例。相比直接 HTTP 抓取，这条链能复用真实浏览器上下文，网页读取能力与已有登录态同时进入风险范围。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:10-22](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/package.json#L10-L22)

宿主 bundle 及浏览器相关入口

<details>
<summary>查看原文（13行）</summary>

```text
  "main": "./lib/core/index.js",
  "exports": {
    ".": "./lib/core/index.js",
    "./core": "./lib/core/index.js",
    "./permissions": "./lib/permissions/index.js",
    "./tool-browser": "./lib/tool-browser/index.js",
    "./web-fetch": "./lib/web-fetch/index.js",
    "./mentions": "./lib/mentions/index.js",
    "./installer": "./lib/installer/index.js",
    "./client": "./client/client.js",
    "./runtime": "./lib/runtime/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[src/tool-browser/index.ts:317-343](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/tool-browser/index.ts#L317-L343)

认领及求值调用

<details>
<summary>查看原文（27行）</summary>

```text
        let claimOutcome: Pick<BrowserToolValue, 'claimedTabCount' | 'ownedPageCount' | 'claimError'> = {};
        let claimAtCreation = requestedClaims;
        if (requestedClaims !== undefined && tabbit.sessionTasks(agentId).includes(task)) {
          claimAtCreation = undefined; // 已经在这里处理了，别再让 evaluate 撞 CLAIM_REQUIRES_NEW_TASK
          try {
            const claimed = await client.claimTabs(task, requestedClaims);
            claimOutcome = {
              claimedTabCount: requestedClaims.length,
              ...(claimed.ownedPageCount !== undefined ? { ownedPageCount: claimed.ownedPageCount } : {}),
            };
          } catch (error) {
            claimOutcome = {
              claimError: error instanceof TabbitCliError ? friendlyCliError(error) : String((error as Error)?.message ?? error),
            };
          }
        }

        let outcome;
        try {
          outcome = await client.evaluate({
            task,
            code: args.code,
            ...(args.read_only === true ? { readOnly: true } : {}),
            ...(args.timeout_ms !== undefined ? { timeoutMs: args.timeout_ms } : {}),
            ...(claimAtCreation !== undefined ? { claimTabs: claimAtCreation } : {}),
            signal: exec.signal, // 用户取消 → 一路传到 CLI 子进程被杀
          });
```

</details>

**依据 3 · 源码核查**：[src/tool-browser/index.ts:359-362](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/tool-browser/index.ts#L359-L362)

记录会话任务和实例

```text
        // 求值成功（哪怕代码本身失败）说明任务确实存在过：登记
        // "会话 × 任务 × 实际实例"，供会话结束时在正确实例上清理
        // （resolvedInstanceId 的意义见 runtime/client.ts）。
        tabbit.rememberSessionTask(agentId, task, client.resolvedInstanceId());
```

**依据 4 · 作者声明**：[README.md:13-20](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/README.md#L13-L20)

作者列出提及及登录态能力

```text
| **`tabbit_browser`** | 用户使用真实的 Tabbit 内置的 CLI 模式执行网页读取和网页操作。 |
| **浏览器代理的 `web_fetch`** | 把 dsh 的 `web_fetch` 改接到 Tabbit 上（dsh 自带的直连抓取器无 JS 渲染、无登录态、不走系统代理——在 fake-ip 代理环境下所有域名都会被它拒绝）。 |
| **"网页标签"输入框提及 `@`** | 在 dsh Web UI 输入框敲 `@`，会列出本会话浏览器任务中打开的页面**以及用户浏览器里的全部标签页**，可以选中成为上下文（标签组首页这类无内容的空壳页已被屏蔽）。 |
| **"标签组"输入框提及 `@`** | `@` 菜单里独立成组展示：按组名（或成员页标题/URL）搜出整个标签组。提及是轻量【引用】——chip 携带成员页清单、发送零等待，模型在对话里按需用 `tabbit_browser`/`web_fetch` 自提相关页面（过程可见、走权限审批），而不是发送时整组重取。 |
| **独立"页面读取"权限** | 完善的权限控制。因为与用户共享 cookie，dsh 访问 Tabbit 网页时会确认权限`pageAccess`（默认每会话询问一次）+ `intranetFetch`（web_fetch 访问内网目标默认逐次审批）。 |
| **`tabbit_browser_install` 工具** | 环境预检：检测已装稳定版 Tabbit、校验 launcher 与 Runtime Service；缺装/过旧时以 dsh 后台任务下载 Tabbit。 |
| **`tabbit_plugin_update` 工具** | 插件更新检查：每天最多查一次 npm 上的最新发布，有合适版本会离线静默安装； |
| **`tabbit` skill** | 告知模型使用 Tabbit 的最佳实践。默认使用 Tabbit 自带的 `~/.agents/skills/tabbit/` 的官方 skill（随浏览器 Runtime 同步演进）。本插件内为兜底版本。 |
```

#### 缺口

- 未运行真实 Tabbit 或核查跨平台实例选取
  **影响**：不能确认复用成功率或清理结果
  **进一步探讨**：在两个测试实例中核对命中与关闭

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 已有审批能覆盖哪些网页访问？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

默认 pageAccess 成功后按 agent 记忆，内网 web_fetch 的 ask 在识别到内网时按 agent 和 origin 记忆，README 的逐次审批概括与此不同。两个工具都受 pageAccess 管理，专门内网闸只对 web_fetch 入参；会话审批覆盖为 never 时 ask 有放行分支。浏览器抓取执行完成后才检查最终 URL 是否明显私有，因此该分支拒绝回传内容，不能由此证明导航请求或中间跳转未发生。

#### 证据与依据

**依据 1 · 源码核查**：[src/permissions/index.ts:78-99](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/permissions/index.ts#L78-L99)

会话覆盖及无审批通道

<details>
<summary>查看原文（22行）</summary>

```text
  exec: { agent?: { session: unknown } },
  askReason: string,
  settingsKey: 'pageAccess' | 'intranetFetch',
): AskOutcome {
  // ctx.get('approval')：按名取服务的"软"方式——不在 inject 里声明硬依赖，
  // 服务缺席时拿到 undefined 而不是崩溃。
  const approval = ctx.get('approval');
  if (approval !== undefined && exec.agent !== undefined) {
    try {
      // overrideOf(session)：读该会话的审批策略覆盖（dsh-user-approval API）。
      // ⚠️ 这个 API 只能在"开着的 turn"内调用（本处理器正是在 turn 内跑的）。
      if (approval.overrideOf(exec.agent.session as never) === 'never') return 'bypass';
    } catch {
      /* 会话形状不认识：当普通情况处理，照常询问 */
    }
  }
  if (approval === undefined) {
    return {
      kind: 'deny',
      reason: `This action needs user confirmation (settings tabbit.${settingsKey} = ask), but no approval channel is mounted in this composition. Set settings tabbit.${settingsKey} to "always" to allow it without prompts.`,
    };
  }
```

</details>

**依据 2 · 源码核查**：[src/permissions/index.ts:113-158](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/permissions/index.ts#L113-L158)

全局禁用及内网参数分支

<details>
<summary>查看原文（46行）</summary>

```text
  ctx.on('tools/pre-execute', async function (exec, next) {
    // 不归我们管的工具：立刻放行给下一个处理器。
    if (!GATED_TOOLS.has(exec.name)) return next();
    const settings = ctx.tabbit.currentSettings();

    // 总闸 never：两个工具一律拒绝。
    if (settings.pageAccess === 'never') {
      return {
        kind: 'deny' as const,
        reason: 'Tabbit Browser page access is disabled (settings tabbit.pageAccess = never).',
      };
    }

    // ── 附加闸：web_fetch 的内网目标检查（在总闸之前查，因为它更具体）──
    if (exec.name === 'web_fetch') {
      const url = urlArgumentOf(exec.arguments);
      if (url !== undefined) {
        // 内网判定（net.ts）：返回原因字符串 = 是内网；undefined = 公网/未知。
        const reason = await privateTargetReason(url);
        if (reason !== undefined) {
          if (settings.intranetFetch === 'never') {
            return {
              kind: 'deny' as const,
              reason: `web_fetch to a private/intranet target is disabled (${reason}; settings tabbit.intranetFetch = never).`,
            };
          }
          if (settings.intranetFetch === 'ask') {
            const agentId = exec.agent !== undefined ? String(exec.agent.id) : undefined;
            const origin = originOf(url);
            // 本会话对这个 origin 是否已授权过？
            const granted =
              agentId !== undefined && origin !== undefined && ctx.tabbit.hasIntranetGrant(agentId, origin);
            if (!granted) {
              const outcome = resolveAsk(
                ctx,
                exec,
                `web_fetch targets a PRIVATE/INTRANET address through your browser: ${reason}. First request to ${origin ?? 'this target'} in this session — allow it? (Set settings tabbit.intranetFetch to "always" to skip these prompts.)`,
                'intranetFetch',
              );
              if (outcome !== 'bypass') {
                // 真的发出了询问：按 callId 挂账，等 tools/result 里对账。
                if (outcome.kind === 'ask' && agentId !== undefined && origin !== undefined) {
                  pendingIntranetGrants.set(String(exec.callId), { agentId, origin });
                }
                return outcome;
              }
```

</details>

**依据 3 · 源码核查**：[src/permissions/index.ts:167-197](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/permissions/index.ts#L167-L197)

按成功记忆授权

<details>
<summary>查看原文（31行）</summary>

```text
    // ── 总闸：pageAccess = ask 且本会话还没授权过 → 发起询问 ──────────
    if (settings.pageAccess === 'ask' && exec.agent !== undefined && !ctx.tabbit.hasPageAccessGrant(String(exec.agent.id))) {
      const outcome = resolveAsk(
        ctx,
        exec,
        'First Tabbit Browser page access in this session: the agent will browse with your real browser profile, including logged-in sessions. Allow browser access for this session? (Set settings tabbit.pageAccess to "always" to skip this prompt.)',
        'pageAccess',
      );
      if (outcome !== 'bypass') return outcome;
    }

    // 所有门都过了：放行执行。
    return next();
  });

  // ── 事后记账：tools/result ────────────────────────────────────────────
  // 一次被门拦过的调用最终【成功】，说明用户点了允许（或策略放行）——把授权
  // 记进会话记忆，让询问做到"页面访问每会话一次、内网每会话每 origin 一次"，
  // 而不是每次调用都问。失败什么都不记（用户拒绝/执行出错，下次重试再问）。
  ctx.on('tools/result', (exec, result) => {
    // 先对内网挂账：找到本 callId 的账，成功才授信，成败都销账。
    const pending = pendingIntranetGrants.get(String(exec.callId));
    if (pending !== undefined) {
      pendingIntranetGrants.delete(String(exec.callId));
      if (!result.isError) ctx.tabbit.grantIntranet(pending.agentId, pending.origin);
    }
    // 再记总闸授权：任何受管工具的成功调用都算"用户认可过页面访问"。
    if (!GATED_TOOLS.has(exec.name)) return;
    if (result.isError) return;
    if (exec.agent === undefined) return;
    ctx.tabbit.grantPageAccess(String(exec.agent.id));
```

</details>

**依据 4 · 源码核查**：[src/web-fetch/index.ts:103-147](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/web-fetch/index.ts#L103-L147)

求值后检查最终地址

<details>
<summary>查看原文（45行）</summary>

```text
    const requestWasPrivate = hostIsObviouslyPrivate(url.hostname);

    let outcome;
    try {
      outcome = await this.tabbit.withFetchTask(async (client) => {
        return await client.evaluate({
          task: FETCH_TASK_NAME,
          readOnly: true, // 旧版 CLI 可声明只读；新版 CLI 无此参数，client 会自动兼容
          timeoutMs: EVAL_TIMEOUT_MS,
          code: buildFetchCode(url.href),
          ...(signal ? { signal } : {}),
        });
      });
    } catch (error) {
      // CLI 层错误 → 翻译成 dsh 的 WebError（错误码映射见 webErrorCode）。
      if (error instanceof TabbitCliError) {
        throw new WebError(`Tabbit browser fetch failed: ${error.message}`, webErrorCode(error));
      }
      throw error;
    }
    if (outcome.status === 'failed') {
      const message = outcome.errorMessage ?? 'navigation failed';
      const code = /timeout/iu.test(message) ? 'FETCH_TIMEOUT' : 'FETCH_FAILED';
      throw new WebError(`Tabbit browser fetch failed: ${message}`, code);
    }

    const value = (outcome.result?.value ?? {}) as Partial<FetchEvalValue>;
    const finalUrl = typeof value.finalUrl === 'string' && value.finalUrl !== '' ? value.finalUrl : url.href;

    // 【重定向围堵】：公网发起的请求，最终 URL 若落在私有目标上，拒绝返回
    // 内容——否则攻击者可用一个公网短链 302 到 http://127.0.0.1:8080/admin
    // 之类，绕过 intranetFetch 闸把内网内容送进模型上下文。
    if (!requestWasPrivate) {
      try {
        const finalHost = new URL(finalUrl).hostname;
        if (hostIsObviouslyPrivate(finalHost)) {
          throw new WebError(
            `fetch of ${url.href} redirected to a private target (${finalHost}); refusing to return its content`,
            'FETCH_BLOCKED_REDIRECT',
          );
        }
      } catch (error) {
        if (error instanceof WebError) throw error;
        /* 最终 URL 解析不了：按原始 URL 继续（不因解析失败误杀） */
      }
```

</details>

**依据 5 · 作者声明**：[README.md:13-18](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/README.md#L13-L18)

作者概述内网审批

```text
| **`tabbit_browser`** | 用户使用真实的 Tabbit 内置的 CLI 模式执行网页读取和网页操作。 |
| **浏览器代理的 `web_fetch`** | 把 dsh 的 `web_fetch` 改接到 Tabbit 上（dsh 自带的直连抓取器无 JS 渲染、无登录态、不走系统代理——在 fake-ip 代理环境下所有域名都会被它拒绝）。 |
| **"网页标签"输入框提及 `@`** | 在 dsh Web UI 输入框敲 `@`，会列出本会话浏览器任务中打开的页面**以及用户浏览器里的全部标签页**，可以选中成为上下文（标签组首页这类无内容的空壳页已被屏蔽）。 |
| **"标签组"输入框提及 `@`** | `@` 菜单里独立成组展示：按组名（或成员页标题/URL）搜出整个标签组。提及是轻量【引用】——chip 携带成员页清单、发送零等待，模型在对话里按需用 `tabbit_browser`/`web_fetch` 自提相关页面（过程可见、走权限审批），而不是发送时整组重取。 |
| **独立"页面读取"权限** | 完善的权限控制。因为与用户共享 cookie，dsh 访问 Tabbit 网页时会确认权限`pageAccess`（默认每会话询问一次）+ `intranetFetch`（web_fetch 访问内网目标默认逐次审批）。 |
| **`tabbit_browser_install` 工具** | 环境预检：检测已装稳定版 Tabbit、校验 launcher 与 Runtime Service；缺装/过旧时以 dsh 后台任务下载 Tabbit。 |
```

#### 缺口

- 未验证宿主审批事件组合、一般浏览器工具内网行为或 Runtime 拦截
  **影响**：无法判定对任意导航的隔离效果
  **进一步探讨**：用合成登录态和目标服务器计数验证拦截点与跨 origin 授权

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

有 Tabbit 稳定版、匹配的 Node 与 DSH Web profile 时，可用独立浏览器配置和合成页面先验证一个只读任务。确认实例、审批与关闭，再决定是否启用 web_fetch 替换。运维投入来自浏览器、宿主及插件三者版本；退出前清理测试任务并禁用插件，确认原抓取路径恢复。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-38](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/README.md#L24-L38)

安装和最低版本说明

<details>
<summary>查看原文（15行）</summary>

````text
### 前置条件

- 已安装稳定版 Tabbit Browser（[国际版](https://www.tabbit.ai) 或 [国内版](https://www.tabbit.com/)，≥1.9.0），且启动过（首次启动时注册 CLI launcher）；
- Node ≥ 22.19、dsh ≥ 0.1.1-rc.2（dsh 安装：`npm install -g @deepseek-ai/dsh`）。低于 0.1.2-alpha.1 的宿主上，网页版会话里内置的 `web_fetch` 工具不可用（`tabbit_browser` 不受影响）。

### 安装 dsh-tabbit
```bash
dsh plugin --profile web add dsh-tabbit                 # npm 主路线
```

### 其他安装模式

```bash
dsh plugin --profile web add github:Tabbit-Browser/dsh-tabbit # npm 不可达时的回退
dsh plugin --profile web add link:/path/to/dsh-tabbit   # 本地开发
````

</details>

**依据 2 · 源码核查**：[package.json:33-42](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/package.json#L33-L42)

Web 客户端注入

<details>
<summary>查看原文（10行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-input-trigger"
      ]
    }
```

</details>

**依据 3 · 作者声明**：[README.md:65-79](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/README.md#L65-L79)

实例优先级与权限说明

<details>
<summary>查看原文（15行）</summary>

```text
### 实例解析优先级

当本机有多个 Tabbit 版本时的优先级配置

1. `tabbit.instance` 显式设置；
2. **正在查看 dsh-web 的 Tabbit 实例**（自动检测：页面加载时 client 插件向 `/tabbit/instance-hint` 打点，服务端由 loopback socket 对端进程沿父链匹配实例注册表的 `browserPid`；仅 macOS，非 Tabbit 浏览器打开时自然不命中）——"在哪个 Tabbit 里看，就在哪个 Tabbit 里执行"；
3. 继承的 `TABBIT_PLAYWRIGHT_INSTANCE` 环境变量（嵌入形态：Tabbit 启动打包的 dsh 时注入自己的实例 id，即为权威通道）；
4. 注册表自动选择（唯一在线实例；歧义时报带实例列表的引导错误。Windows 上注册表不可读时委托原生 CLI 自行选择）。

Full access 说明：dsh 的 `danger-full-access` 权限预设会给会话写入审批策略 `never`（dsh 定义为"自动拒绝一切询问"）。本插件的权限门检测到该覆盖时**自动放行**，不再发出注定被拒的询问——Full access 就是完全访问（该模式下 bash 本就不受限，单拦浏览器工具没有防御价值）。例外：部署级把审批默认配成 `never`（非会话覆盖）时公开 API 读不到，仍会被拒；无审批通道的组合（如某些 headless 编排）会得到指明 `tabbit.pageAccess: always` 出路的拒绝信息。

## 权限及安全

- 基于对用户数据安全和用户登录态权限的考量，设计了独立的 `pageAccess` 权限，该权限独立于文件系统/沙箱权限，默认需用户确认。
- 授权记录：某工具调用成功后，本会话后续调用不再重复询问；失败不记入（失败后重试会再次询问）。
```

</details>

**依据 4 · 作者声明**：[README.md:103-107](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/README.md#L103-L107)

已知平台边界

```text
## 已知限制 / 路线图

- 收藏夹/书签的提及暂不支持。
- 截图进上下文要求当前模型路由支持图像输入。
- Windows 版本回归测试有限。
```

#### 缺口

- 未试安装、升级或退出
  **影响**：无法估计兼容排障时间及实际开销
  **进一步探讨**：隔离配置先验证一次只读、拒绝和清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样检验重定向是否真的无法触及内网？

**研究主题**：新假设与验证

#### 完整回答

对照现有事后拒绝内容，可试验由 Runtime 按每一跳目标及实际解析地址做请求前约束。用公网页跳回环、多跳后回公网和明确许可的内网目标，分别比较目标端实际收到的请求和模型收到的内容。若负例请求数不降或合法导航显著受损，则撤回或调整。

#### 证据与依据

**依据 1 · 源码核查**：[src/web-fetch/index.ts:103-147](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/web-fetch/index.ts#L103-L147)

现有检查在浏览器求值之后

<details>
<summary>查看原文（45行）</summary>

```text
    const requestWasPrivate = hostIsObviouslyPrivate(url.hostname);

    let outcome;
    try {
      outcome = await this.tabbit.withFetchTask(async (client) => {
        return await client.evaluate({
          task: FETCH_TASK_NAME,
          readOnly: true, // 旧版 CLI 可声明只读；新版 CLI 无此参数，client 会自动兼容
          timeoutMs: EVAL_TIMEOUT_MS,
          code: buildFetchCode(url.href),
          ...(signal ? { signal } : {}),
        });
      });
    } catch (error) {
      // CLI 层错误 → 翻译成 dsh 的 WebError（错误码映射见 webErrorCode）。
      if (error instanceof TabbitCliError) {
        throw new WebError(`Tabbit browser fetch failed: ${error.message}`, webErrorCode(error));
      }
      throw error;
    }
    if (outcome.status === 'failed') {
      const message = outcome.errorMessage ?? 'navigation failed';
      const code = /timeout/iu.test(message) ? 'FETCH_TIMEOUT' : 'FETCH_FAILED';
      throw new WebError(`Tabbit browser fetch failed: ${message}`, code);
    }

    const value = (outcome.result?.value ?? {}) as Partial<FetchEvalValue>;
    const finalUrl = typeof value.finalUrl === 'string' && value.finalUrl !== '' ? value.finalUrl : url.href;

    // 【重定向围堵】：公网发起的请求，最终 URL 若落在私有目标上，拒绝返回
    // 内容——否则攻击者可用一个公网短链 302 到 http://127.0.0.1:8080/admin
    // 之类，绕过 intranetFetch 闸把内网内容送进模型上下文。
    if (!requestWasPrivate) {
      try {
        const finalHost = new URL(finalUrl).hostname;
        if (hostIsObviouslyPrivate(finalHost)) {
          throw new WebError(
            `fetch of ${url.href} redirected to a private target (${finalHost}); refusing to return its content`,
            'FETCH_BLOCKED_REDIRECT',
          );
        }
      } catch (error) {
        if (error instanceof WebError) throw error;
        /* 最终 URL 解析不了：按原始 URL 继续（不因解析失败误杀） */
      }
```

</details>

**依据 2 · 源码核查**：[src/permissions/index.ts:126-155](https://github.com/Tabbit-Browser/dsh-tabbit/blob/4d256b7db3317961e3599bf2820e8b1be6e2d2be/src/permissions/index.ts#L126-L155)

原请求有内网审批

<details>
<summary>查看原文（30行）</summary>

```text
    // ── 附加闸：web_fetch 的内网目标检查（在总闸之前查，因为它更具体）──
    if (exec.name === 'web_fetch') {
      const url = urlArgumentOf(exec.arguments);
      if (url !== undefined) {
        // 内网判定（net.ts）：返回原因字符串 = 是内网；undefined = 公网/未知。
        const reason = await privateTargetReason(url);
        if (reason !== undefined) {
          if (settings.intranetFetch === 'never') {
            return {
              kind: 'deny' as const,
              reason: `web_fetch to a private/intranet target is disabled (${reason}; settings tabbit.intranetFetch = never).`,
            };
          }
          if (settings.intranetFetch === 'ask') {
            const agentId = exec.agent !== undefined ? String(exec.agent.id) : undefined;
            const origin = originOf(url);
            // 本会话对这个 origin 是否已授权过？
            const granted =
              agentId !== undefined && origin !== undefined && ctx.tabbit.hasIntranetGrant(agentId, origin);
            if (!granted) {
              const outcome = resolveAsk(
                ctx,
                exec,
                `web_fetch targets a PRIVATE/INTRANET address through your browser: ${reason}. First request to ${origin ?? 'this target'} in this session — allow it? (Set settings tabbit.intranetFetch to "always" to skip these prompts.)`,
                'intranetFetch',
              );
              if (outcome !== 'bypass') {
                // 真的发出了询问：按 callId 挂账，等 tools/result 里对账。
                if (outcome.kind === 'ask' && agentId !== undefined && origin !== undefined) {
                  pendingIntranetGrants.set(String(exec.callId), { agentId, origin });
```

</details>

#### 缺口

- 浏览器 Runtime 是否开放可用拦截接口待核
  **影响**：无法判断插件能否独立实现
  **进一步探讨**：先验证接口再搭建可计数的重定向实验

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
