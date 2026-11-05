# dsh-codex

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[413c651](https://github.com/Yan-Zero/dsh-codex/tree/413c651e07820f2a4670049c8087077f074fa846)

<!-- BEGIN META -->
[![GitHub ★ 96](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=96&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Yan-Zero/dsh-codex) [![npm 30d 2,381](https://img.shields.io/static/v1?label=npm+30d&message=2%2C381&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex)
<!-- END META -->

> **功能**：通过插件自身 OAuth 凭据把 Codex 模型、搜索和图像能力接入 DSH。

> **亮点**：[Q01](#research-q01) 把账号模型路由接到现有 DSH 会话。

> **主要限制**：[Q02](#research-q02) 来源信任和刷新可靠性需按部署验证。

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
  - [Q01 · DSH 的 Codex 模型路由如何建立？](#detail-section-11)
  - [Q02 · 远程网页和凭据更新有哪些保护？](#detail-section-12)
  - [Q03 · 怎样先验证这条模型入口？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 工作流的用户希望接入账号许可的 Codex 路由。

在 Codex 原生入口完成任务或配置其他 DSH Provider。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型 | 账号允许的 Codex 路由 | 授权及额度独立 |
| 凭据 | 插件自有登录及刷新 | 远程网页需精确信任 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Codex 账号 | 必需 | 注册和授权 | 账号支持与额度独立 |
| 浏览器或设备码 | 登录需要 | 完成确认 | 远端需 origin 信任 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 独立 profile 固定单模型 | 核对权限 |
| 调用 | 完成文本和工具任务 | 比对流式结果 |
| 恢复 | 重启、退出并核查 | 错误时退原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 费用未知 | 授权并匹配配置 | 真实账号验收 |
| 持续 | 配额未知 | 维护模型和协议 | 检查上下文 |
| 失败 | 工时未知 | 重查凭据和来源 | 保留原生入口 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型接入 | 保留 DSH 会话工具工作流 | 真实授权与任务效果 |

> **思考**：[Q02](#research-q02) 来源信任和刷新可靠性需按部署验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把账号模型路由接到现有 DSH 会话。

[Q02](#research-q02) 来源检查和原子凭据写入已静态核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 来源信任和刷新可靠性需按部署验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单模型核心流程完成后再加可选能力。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对 adapter、来源及凭据更新，未登录或调用。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/auth-routes.ts、src/store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定路由、adapter 注册和凭据修改，未登录或访问账户。
- 下一步：文本、工具、重启、配额、撤销和反代。

**分析版本**

- **仓库**：[Yan-Zero/dsh-codex](https://github.com/Yan-Zero/dsh-codex)
- **版本号**：0.3.2（[固定提交 413c651](https://github.com/Yan-Zero/dsh-codex/tree/413c651e07820f2a4670049c8087077f074fa846)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 同任务对照上下文、工具及恢复一致性。

文本、工具、重启、配额、撤销和反代。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1230 | — | — | 19118 |
| .ts | source | 41 | 8966 | 7793 | 608 | — |
| .tsx | source | 5 | 2252 | 2131 | 24 | — |
| .ts | test | 26 | 5368 | 4897 | 105 | — |
| .tsx | test | 3 | 663 | 607 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Yan-Zero/dsh-codex/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Yan-Zero/dsh-codex/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Yan-Zero/dsh-codex/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否在 DSH 工作流中使用其账号允许的 Codex 模型？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 的 Codex 模型路由如何建立？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件通过浏览器或设备码登录取得自身凭据，向 llm 注册 Codex adapter，并挂搜索和图像工具。它让用户沿 DSH 的会话和工具表调用账号支持的模型。相对单独打开 Codex，贡献在宿主适配，不改变账号可用模型和额度，真实订阅授权与调用须独立验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-22](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/README.md#L7-L22)

作者列能力和产品边界。

<details>
<summary>查看原文（16行）</summary>

```text
Use a ChatGPT subscription in [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) through OpenAI's Codex sign-in flow—no OpenAI Platform API key required and no dsh source patch required.

`dsh-codex` is an independent dsh bundle. It adds:

- ChatGPT OAuth from the dsh Settings panel or a standalone CLI, with automatic token refresh
- the Codex GPT catalog, including vision-capable models when the account offers them
- a live client-side context-window capacity override for dsh's token meter and compaction policy
- streaming, tool calls, reasoning replay, prompt caching, and dsh compaction through the normal LLM service
- Codex standalone web search through dsh's existing `web_search` tool
- optional HTTP(S) URL input added to Harness's existing `read_image` tool
- an `imagegen` tool with a selectable GPT Image backend, workspace or conversation reference images, and automatic workspace output
- browser image input through dsh's existing paste and drop controls
- a per-conversation Fast Mode switch and compact weekly quota indicator in the Web composer
- optional backend-authorized model recovery, including hidden Luna Reserve routing
- a three-scope HTTP(S) proxy control for Codex-only or process-wide routing

```

</details>

**依据 2 · 源码核查**：[src/index.ts:311-328](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/index.ts#L311-L328)

adapter 与 fallback 接线。

<details>
<summary>查看原文（18行）</summary>

```text
  });
  ctx.llm.registerAdapter(
    [OPENAI_CODEX_PROVIDER],
    createOpenAICodexAdapter(
      credentials,
      () => ctx.get("attachments"),
      () => imageTools.responseApiSnapshot(),
      fastMode,
      () => imageTools.modelCatalogSnapshot().models,
      () => imageTools.contextWindowSnapshot().contextWindow,
      service.proxy.fetch,
      () => imageTools.fastModeSnapshot().fastModeDefault,
      modelProvider
    )
  );
  ctx.effect(
    () => installOpenAICodexModelFallback(ctx, service),
    "dsh-openai-codex: backend model fallback"
```

</details>

**依据 3 · 源码核查**：[src/index.ts:347-361](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/index.ts#L347-L361)

授权路由和图像工具。

<details>
<summary>查看原文（15行）</summary>

```text
  ctx.inject(["webServer"], (webCtx) =>
    registerOpenAICodexAuthRoutes(
      webCtx,
      credentials,
      undefined,
      fastMode,
      imageTools,
      service,
      service.proxy.fetch,
      () => service.proxy.apply()
    )
  );
  ctx.inject(["tools", "fs", "attachments"], (toolCtx) => {
    toolCtx.tools.register(
      imagegenTool(toolCtx, credentials, imageTools, service.proxy.fetch)
```

</details>

#### 缺口

- 真实账号政策、可用模型和调用未测
  **影响**：不能保证订阅当前可在此入口用
  **进一步探讨**：在用户许可下验收单模型文本与工具调用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 远程网页和凭据更新有哪些保护？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

路由核对 Host、有效 origin 与同源元数据；本地 loopback peer 可用，远端需显式精确 origin 信任。凭据修改串行或加文件锁，读当前值后执行更新，shared 路径再检查竞争并原子写入。仍需核查不同 Host 实例、刷新竞争和反代配置，不把路由保护当作多租户授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth-routes.ts:495-523](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/auth-routes.ts#L495-L523)

来源信任决定。

<details>
<summary>查看原文（29行）</summary>

```text
      ? fetchSite.trim().toLowerCase() === "cross-site"
      : Array.isArray(fetchSite) &&
        fetchSite.some((value) => value.trim().toLowerCase() === "cross-site");
  if (crossSite) return { trusted: false, error: "forbidden" };
  const host = req.headers.host;
  if (typeof host !== "string") return { trusted: false, error: "forbidden" };
  const origin = effectiveOrigin(req, host);
  if (origin === undefined) return { trusted: false, error: "forbidden" };
  if (!sameOriginMetadata(req, host))
    return { trusted: false, error: "forbidden" };
  if (localPeer && loopbackHost(host)) return { trusted: true };
  try {
    if (await trustedOrigins.has(origin)) return { trusted: true };
  } catch {
    // A malformed or too-broad sidecar fails closed without exposing contents.
    return { trusted: false, error: "forbidden" };
  }
  return {
    trusted: false,
    error: REMOTE_WEB_ORIGIN_NOT_TRUSTED,
  };
}

/** Whether a request is currently trusted; the sidecar is read on every call. */
export async function trustedRequest(
  req: IncomingMessage,
  trustedOrigins?: OpenAICodexTrustedOriginsStore
): Promise<boolean> {
  return (await trustedRequestDecision(req, trustedOrigins)).trusted;
```

</details>

**依据 2 · 源码核查**：[src/auth-routes.ts:862-876](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/auth-routes.ts#L862-L876)

路由每次执行信任判断。

<details>
<summary>查看原文（15行）</summary>

```text
      : new OpenAICodexTrustedOriginsStore());
  ctx.effect(() => {
    const authorize = async (
      req: IncomingMessage,
      res: ServerResponse
    ): Promise<boolean> => {
      const decision = await trustedRequestDecision(req, trustedOrigins);
      if (decision.trusted) return true;
      json(res, 403, { error: decision.error });
      return false;
    };
    const routes = [
      ctx.webServer.register({
        kind: "exact",
        path: OPENAI_CODEX_AUTH_STATUS_PATH,
```

</details>

**依据 3 · 源码核查**：[src/store.ts:168-204](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/store.ts#L168-L204)

凭据修改的竞争和写入。

<details>
<summary>查看原文（37行）</summary>

```text
  async modify(
    providerId: string,
    fn: (current: Credential | undefined) => Promise<Credential | undefined>,
  ): Promise<Credential | undefined> {
    if (providerId !== OPENAI_CODEX_PROVIDER) {
      throw new Error(`openai-codex: credential store does not own provider "${providerId}"`)
    }
    await mkdir(dirname(this.filename), { recursive: true, mode: 0o700 })
    const coordinate = this.shared ? serialize : withFileLock
    return coordinate(this.filename, async () => {
      const current = await this.readCurrent()
      const candidate = await fn(current === undefined ? undefined : cloneCredential(current))
      if (candidate === undefined) return current
      const document = parseDocument(JSON.stringify({
        version: AUTH_FORMAT_VERSION,
        credential: candidate,
      }), this.filename)
      let output: unknown = document
      if (this.shared) {
        // Re-read after refresh to retain concurrent edits to unrelated providers.
        await assertOwnerOnly(this.filename)
        try {
          const source = decodeCredentialDocument(await readFile(this.filename, 'utf8'))
          if (JSON.stringify(source.credential) !== JSON.stringify(current))
            throw new Error('openai-codex: credential changed during update; reload before retrying')
          output = source.update(document.credential)
          decodeCredentialDocument(JSON.stringify(output))
        } catch (error) {
          if (!isENOENT(error)) throw error
          if (current !== undefined) throw new Error('openai-codex: credential file was removed during update')
        }
      }
      await writeFileAtomic(this.filename, `${JSON.stringify(output, null, 2)}\n`, {
        mode: 0o600,
        dirMode: 0o700,
      })
      return cloneCredential(document.credential)
```

</details>

#### 缺口

- 没有反代和跨进程实测
  **影响**：真实远程部署和刷新可靠性未知
  **进一步探讨**：模拟 Origin 错误、撤销与并发刷新

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样先验证这条模型入口？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

在独立 profile 只开单模型文本任务，分别验收登录、流式工具调用、重启和退出。保持默认代理与恢复选项，先对照原生 Codex 的同任务结果与配额，再逐项开启图像或 fallback。出现路由或上下文差异时用原产品入口和已有会话。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-47](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/README.md#L26-L47)

安装、登录与信任配置。

<details>
<summary>查看原文（22行）</summary>

````text

Install the prebuilt bundle from npm into the selected dsh profile:

```sh
dsh plugin --profile web add dsh-codex
dsh web
```

From a DeepSeek Harness source checkout, use `pnpm dsh plugin --profile web add dsh-codex`. A local plugin checkout can still be installed with `link:/absolute/path/to/dsh-codex` for development.

Open **Settings → OpenAI Codex** and choose **Browser sign-in** or **Device code**. Browser sign-in shows an authorization link; click it to open the system browser, which returns to the dsh host's localhost callback when both run on the same machine. Device code works when the browser is on another machine. The account page shows live Codex quota bars and exact remaining percentages; exact credit balances or workspace limits appear only when the account API supplies them.

Loopback Web pages are trusted automatically. If dsh runs on another machine, the account page shows the exact origin command that must be approved on the dsh host, for example `dsh plugin --profile web exec dsh-codex trust-origin http://host:port`. The allowlist is exact-origin, stored separately from OAuth credentials, and can be inspected or revoked with `trusted-origins` and `untrust-origin`.

The CLI remains available for terminal and headless installations:

```sh
dsh plugin --profile web exec dsh-codex login
dsh plugin --profile web exec dsh-codex login --device-code
dsh plugin --profile web exec dsh-codex status
dsh plugin --profile web exec dsh-codex doctor --json
dsh plugin --profile web exec dsh-codex logout
````

</details>

**依据 2 · 源码核查**：[src/index.ts:273-281](https://github.com/Yan-Zero/dsh-codex/blob/413c651e07820f2a4670049c8087077f074fa846/src/index.ts#L273-L281)

可变选项和上下文设置。

```text
  const modelProvider = createOpenAICodexModelProvider((input, init) => service.proxy.fetch(input, init));
  const livePreferences = () => ({
    models: [...liveValue(config.models, openAICodexModelCatalog(modelProvider).map((model) => model.id))],
    contextWindow: liveValue(config.contextWindow, null),
    modifyReadImage: liveValue(config.modifyReadImage, true),
    shareImagegenWithOtherModels: liveValue(config.shareImagegenWithOtherModels, true),
    imageGenerationModel: liveValue(config.imageGenerationModel, DEFAULT_OPENAI_CODEX_IMAGE_MODEL),
    useWebSocketContextReuse: liveValue(config.useWebSocketContextReuse, false),
    useNativeCompaction: liveValue(config.useNativeCompaction, false),
```

#### 缺口

- 未复验真实配额或质量
  **影响**：不能推算价格和任务提升
  **进一步探讨**：记录两种入口的成功、token、上下文和错误

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
