# ChatGPT Subscription

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a1658e5](https://github.com/songoao25/dsh-chatgpt-sub/tree/a1658e5102b7ee4a698e88c809ed60e72bc9c245)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/songoao25/dsh-chatgpt-sub) [![npm 30d 5,332](https://img.shields.io/static/v1?label=npm+30d&message=5%2C332&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chatgpt-sub) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-chatgpt-sub)
<!-- END META -->

> **功能**：为 DSH 接入 ChatGPT 账号登录、凭据续期和宿主模型路由，并在设置页显示绑定状态。

> **亮点**：将账号授权、续期和宿主提供方配置放入 DSH 设置页，减少重复配置路径。上游授权和实际调用尚无该组件的验收。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：绑定会改共享账号及宿主默认模型，撤销跨多项状态且可部分完成。登录成功不能建立上游允许或实际模型准入。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁需要在 DSH 绑定 ChatGPT，插件与宿主各做什么？](#detail-section-11)
  - [Q02 · OAuth 如何接入，登录失败是否可能已改共享状态？](#detail-section-12)
  - [Q03 · 后台续期、解绑和脚本卸载分别会清理哪些状态？](#detail-section-13)
  - [Q04 · 自更新如何改变版本，评估采用需要承担哪些成本？](#detail-section-14)
  - [Q05 · 怎样验证隔离凭据与分阶段状态能减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 ChatGPT/Codex 账号的 DSH 用户，希望保留当前工作区完成多轮模型任务。[Q01](#research-q01)

现有 DSH 模型可留在工作区，独立 Codex 客户端可处理相同代码任务。比较应记录工作区切换及账号状态维护。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 账号绑定 | 在 DSH 连接第三方账号 | 浏览器和环回，仍需上游准入 |
| 令牌续期 | 维护宿主凭据 | 共享登录文件可影响独立客户端 |
| 版本管理 | 检查、替换和回滚插件 | 仅符合条件的 profile 安装 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主设置与凭据服务 | 必需 | 创建提供方及绑定 | 核查是否已部分写入 |
| 浏览器、回调与网络 | 账号绑定所需 | 授权和交换 | 报告失败并检查状态 |
| 上游授权与可用账号 | 真实任务必需 | 验证模型调用 | 继续现有流程 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 评估 | 隔离 profile 复核绑定、撤销和目录 | 合成账号退出后状态可核对 |
| 准入 | 获取适用授权后再验目标模型 | 真实返回与路由状态一致 |
| 恢复 | 按共享登录、路由和凭据分别核对 | 保留用户原有设置 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号条件与资源未核 | 隔离账号和宿主配置 | 检查共享目录与默认模型 |
| 持续 | 额度、更新时间未测 | 登录续期、审计更新 | 自动更新可能改变版本 |
| 失败 | 恢复代价未测 | 逐项核对或还原 | 解绑不是上游撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内模型入口 | 设置和宿主凭据接线 | 真实模型准入与输出 |
| 持续登录 | 标记和周期刷新 | 多进程共享状态 |
| 退出 | 解绑分步、版本回滚 | 宿主移除与崩溃后的状态 |

> **思考**：绑定会改共享账号及宿主默认模型，撤销跨多项状态且可部分完成。登录成功不能建立上游允许或实际模型准入。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将账号授权、续期和宿主提供方配置放入 DSH 设置页，减少重复配置路径。上游授权和实际调用尚无该组件的验收。[Q01](#research-q01) [Q03](#research-q03)

绑定与更新各自采用分步写入和补偿。更新用注册表摘要检查完整性；共享凭据与宿主设置缺少跨进程、跨服务的统一提交。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

绑定会改共享账号及宿主默认模型，撤销跨多项状态且可部分完成。登录成功不能建立上游允许或实际模型准入。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

继续观察。仅在隔离本地目录和合成账号中核对所有权、半失败和解绑残留；真实账号采用以获得上游适用确认、固定宿主通过合格任务和明确恢复路径为前提。已出现状态变更时按受影响项核对，不盲用固定键清理脚本。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持账户桥接与状态页。上游授权、实际模型使用、并发凭据与退出恢复均未验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、scripts/build.mjs、src/host.js、uninstall.sh、scripts/purge-codex.py、src/self-update.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查，实际 lib/index.js 与 host 源除生成头相同。未核宿主适配器实现、当前服务条款或发布包。
- 下一步：未启动服务、授权、安装或执行目标测试。没有上游授权、账号套餐、配额和固定宿主模型请求验证。

**分析版本**

- **仓库**：[songoao25/dsh-chatgpt-sub](https://github.com/songoao25/dsh-chatgpt-sub)
- **版本号**：0.6.5（[固定提交 a1658e5](https://github.com/songoao25/dsh-chatgpt-sub/tree/a1658e5102b7ee4a698e88c809ed60e72bc9c245)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

比较隔离凭据与分阶段状态的原型，观察同名冲突、误报与恢复动作。新增凭据副本不能安全回收时推翻。[Q05](#research-q05)

未启动服务、授权、安装或执行目标测试。没有上游授权、账号套餐、配额和固定宿主模型请求验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 791 | — | — | 10447 |
| .js | source | 11 | 7042 | 6034 | 818 | — |
| .mjs | source | 2 | 273 | 190 | 59 | — |
| .mjs | test | 13 | 2393 | 1838 | 471 | — |
| .js | test | 1 | 389 | 320 | 48 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/songoao25/dsh-chatgpt-sub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 DSH 的第三方账号连接插件实际如何绑定账号、设置模型和撤回本地状态，区分已登录与上游实际准入。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要在 DSH 绑定 ChatGPT，插件与宿主各做什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标人群是在 DSH 工作区多轮处理任务且已有 ChatGPT/Codex 账号的用户。原办法是继续使用原配置的 DSH 模型，或在独立 Codex 客户端完成相同工作。这个 Cordis 插件配有 Web 设置页。包入口是已提交的 lib，构建脚本把 host 源复制至实际入口，并生成 Web 模块。绑定流程通过宿主 settings 设置 openai-codex 提供方和 SSE 传输，通过宿主 credentials 注入访问令牌。当宿主已有其他默认提供方时，流程会尝试将默认模型切到插件指定模型。提供方和模型调用由 DSH 接管，插件实现的是账号桥接和状态显示。页面 Connected 表示本地绑定步骤成功，模型可选、请求可执行、账号有额度以及上游是否允许此种第三方接入均是不同判据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-19](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/README.md#L13-L19)

作者描述账号登录、模型依赖及配套额度条。

```text
A DeepSeek Harness plugin that connects your ChatGPT account through OpenAI's sign-in page and lets you use the account's available ChatGPT models inside DSH. You need an account with Codex access and sufficient quota. The plugin does not reject Free accounts, but sign-in alone does not establish access to models in DSH; availability depends on OpenAI’s plan, client and model restrictions. See [OpenAI’s current plan information](https://learn.chatgpt.com/docs/pricing).

## What it does

Sign in from the plugin page, then select a model under the **ChatGPT** provider. The plugin maintains the sign-in and shows account status, expiry, and **Sign in again / Unbind** actions. Available models depend on your account and DSH's model support.

The companion [Bottom Info Bar](https://github.com/songoao25/dsh-bottom-info-bar) displays available quota windows and reset times. Both plugins can be installed independently; ChatGPT quota display needs a valid sign-in.
```

**依据 2 · 源码核查**：[package.json:21-51](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/package.json#L21-L51)

实际 lib 入口、Web 模块和 bundle。

<details>
<summary>查看原文（31行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "locale/*.json",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "docs/INSTALL.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "node scripts/build.mjs",
    "prepublishOnly": "npm run build",
    "test": "node tests/run-all.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": []
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:8-15](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/cordis.patch.yml#L8-L15)

真实 Cordis 插件行，限定模型桥接范围。

```text
- insert:
    - id: chatgpt-subscription
      name: 'dsh-chatgpt-sub'

# This plugin owns only ChatGPT subscription OAuth binding, token upkeep, and the
# openai-codex model route. It does NOT manage web search: the search provider
# (searchProvider, e.g. deepseek-official / exa) is configured by the user in their
# own profile layer, and this plugin never reads, rewrites, or switches search settings.
```

**依据 4 · 源码核查**：[scripts/build.mjs:18-40](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/scripts/build.mjs#L18-L40)

宿主和浏览器产物构建接线。

<details>
<summary>查看原文（23行）</summary>

```text
for (const file of ['self-update.js', 'version.js']) await copyFile(join(root, 'src', file), join(libDir, file))

// 1) host（ESM，原样复制，加文件头注释）
await writeFile(join(libDir, 'locales.js'), 'export const LOCALES = ' + JSON.stringify(LOCALES) + '\n')
const hostSource = await readFile(join(root, 'src', 'host.js'), 'utf8')
await writeFile(join(libDir, 'index.js'), `// Generated by scripts/build.mjs from src/host.js — do not edit directly.\n${hostSource}`)

// 2) client（CJS 模块源 → __ModuleLoader__ bundle）
// bundle id 必须等于包名（DSH 用它把 client bundle 和插件包对上），所以从 package.json
// 现读，而不是写死——以后再改名只动 package.json 一处。
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const clientSource = (await readFile(join(root, 'src', 'client-bundle.js'), 'utf8'))
  .replace('/*__LOCALES__*/{}', () => JSON.stringify(LOCALES))
  .replace('/*__LANGUAGE_RUNTIME__*/', () => createLanguageRuntime.toString())
const wrapped = [
  `window.__ModuleLoader__.load({ id: ${JSON.stringify(pkg.name)}, factory: (require) => {`,
  'var module = { exports: {} }; var exports = module.exports;',
  clientSource,
  'return module.exports;',
  '} });',
  '',
].join('\n')
await writeFile(join(libDir, 'client.js'), wrapped)
```

</details>

**依据 5 · 源码核查**：[src/host.js:611-616](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L611-L616)

宿主依赖声明。

```text
export default {
  inject: ['credentials', 'settings', 'timer', 'shell'],
  apply(ctx) {
    const SELF_UPDATE_ENABLED = process.env.DSH_CHATGPT_SELF_UPDATE !== 'off' && isLoadedAsProfilePlugin()
    const SELF_UPDATE_DELAY_MS = 8000
    // 此次 DSH 启动期间只要用户进入过插件设置页，自动更新就留到下次重启。
```

**依据 6 · 源码核查**：[src/host.js:702-748](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L702-L748)

现有路由冲突、SSE 提供方和默认模型切换。

<details>
<summary>查看原文（47行）</summary>

```text
    async function ensureCodexRoute(flag) {
      const settings = ctx.settings || ctx.get('settings');
      if (!settingsServiceReady(settings)) {
        return { ok: false, owned: false, code: 'route.dsh-not-ready', message: 'DSH 还没准备好，稍后会自动再试一次' };
      }
      try {
        const cur = readSettingsSection(settings, 'llm-pi-ai');
        const providers = cur && typeof cur === 'object' && cur.providers && typeof cur.providers === 'object' ? cur.providers : {};
        const existing = providers['openai-codex'];
        if (existing && existing.apiKeyEnv !== 'OPENAI_CODEX_API_KEY') {
          return { ok: false, owned: false, code: 'route.occupied', message: MSG_ROUTE_CONFLICT };
        }
        if (existing) {
          // 只有绑定标记证明是插件旧版本创建的路由时才升级；同名用户路由只读不删不改。
          if (flag && flag.routeOwned === true) {
            const patch = {};
            if (existing.displayName === 'Codex') patch.displayName = 'ChatGPT';
            if (existing.transport !== 'sse') patch.transport = 'sse';
            if (Object.keys(patch).length > 0) await settings.mutate('llm-pi-ai', [{ op: 'set', path: ['providers', 'openai-codex'], value: Object.assign({}, existing, patch) }]);
          }
          return { ok: true, owned: Boolean(flag && flag.routeOwned === true) };
        }
        await settings.mutate('llm-pi-ai', [{ op: 'set', path: ['providers', 'openai-codex'], value: { apiKeyEnv: 'OPENAI_CODEX_API_KEY', displayName: 'ChatGPT', transport: 'sse' } }]);
        return { ok: true, owned: true };
      } catch (err) {
        return { ok: false, owned: false, code: 'route.create-failed', message: 'ChatGPT 通道没建起来，稍后会自动再试一次' };
      }
    }

    async function removeOwnedCodexRoute(flag) {
      if (!flag.routeOwned && !codexRouteOwned) return;
      const settings = ctx.settings || ctx.get('settings');
      if (!settingsServiceReady(settings)) return;
      const cur = readSettingsSection(settings, 'llm-pi-ai');
      const route = cur && cur.providers && cur.providers['openai-codex'];
      if (route && route.apiKeyEnv === 'OPENAI_CODEX_API_KEY') {
        await settings.mutate('llm-pi-ai', [{ op: 'unset', path: ['providers', 'openai-codex'] }]);
      }
    }

    async function configureDefaultModel() {
      const service = ctx.get('agentDefaultModel');
      if (!service || typeof service.currentSelection !== 'function' || typeof service.saveSelection !== 'function') return { ok: false, previous: null, code: 'default-model.dsh-not-ready', message: 'DSH 还没准备好，暂时没法把默认模型切成 ChatGPT' };
      const current = service.currentSelection();
      if (!current || current.provider === 'openai-codex') return { ok: true, previous: null };
      await service.saveSelection({ provider: 'openai-codex', model: CODEX_DEFAULT_MODEL, reasoningEffort: current.reasoningEffort });
      return { ok: true, previous: current };
```

</details>

**依据 7 · 源码核查**：[src/host.js:1005-1027](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1005-L1027)

绑定标记和宿主凭据写入后报告健康。

<details>
<summary>查看原文（23行）</summary>

```text
        try {
          writeBindFlag(CODEX_BIND_FILE, Object.assign(withCredentialManaged(priorFlag), {
            routeOwned: route.owned,
            defaultModelManaged: Boolean(defaultModel.previous),
            previousDefaultModel: defaultModel.previous,
          }, { boundAt: nowIso }));
        } catch (err) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'write', code: 'oauth.flag-write-failed', message: '绑定成功了，但状态没存住。请重新绑定' };
          return;
        }
        try {
          await ctx.credentials.set('OPENAI_CODEX_API_KEY', exchanged.access_token);          codexInjectedToken = exchanged.access_token;
          codexCredentialOwned = true;
        } catch (err) {
          try { clearBindFlag(CODEX_BIND_FILE); } catch (clearErr) { /* 状态仍保持失败，下一次同步会继续清理 */ }
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'credentials', code: 'oauth.credentials-failed', message: '绑定失败：登录信息没能交给 DSH。请重试' };
          codexBridgeState = { ok: false, lastSyncAt: Date.now(), expiresAt: null, error: oauthLastError, routeConfigured: route.ok };
          return;
        }
        const expiresAtSec = codexExpiresAt(decodeJwtExp(exchanged.access_token), Date.parse(nowIso));
        codexBridgeState = { ok: true, lastSyncAt: Date.now(), expiresAt: expiresAtSec != null ? expiresAtSec * 1000 : null, error: null, routeConfigured: route.ok };
```

</details>

#### 缺口

- 没有核实上游授权、模型可用性、套餐限制或真实任务。
  **影响**：无法从登录成功推断该账号可把此插件作为生产推理入口。
  **进一步探讨**：先从上游取得适用确认，再由独立授权的验证使用固定宿主核对实际模型与结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth 如何接入，登录失败是否可能已改共享状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

设置 RPC 借宿主 connection.requestRejection 做请求拒绝，并要求变更方法用 POST。OAuth 生成 PKCE S256 和随机 state，环回监听校验回调路径、state 和单次接受，宿主随后交换授权码。成功交换后先写共享的 Codex 登录文件，再配置路由、默认模型、绑定标记和 DSH 凭据。单文件用固定临时名、rename 和权限位，跨文件与宿主写入没有统一提交。补偿仅在当前共享令牌仍匹配时恢复旧文件，并尽力还原默认模型与路由，部分补偿异常会被吞掉。写文件函数在 rename 后仍会 chmod，若此步失败，调用方可返回写失败而路径已经变化。使用同一用户目录的 Codex CLI 可能读到新的账号；共享文件或宿主已有状态不能靠 Connected 与失败文案反推。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:304-326](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L304-L326)

OAuth 环回地址、PKCE 和 state。

<details>
<summary>查看原文（23行）</summary>

```text
function oauthCallbackPort() {
  const v = Number(process.env.DSH_CHATGPT_OAUTH_PORT)
  return Number.isInteger(v) && v > 0 && v < 65536 ? v : 1455
}

// PKCE 对：verifier = 32 字节 base64url；challenge = 对 verifier 做 sha256 哈希后再 base64url 编码（S256）
function createPkcePair() {
  const verifier = randomBytes(32).toString('base64url')
  const challenge = createHash('sha256').update(verifier).digest('base64url')
  return { verifier: verifier, challenge: challenge }
}

// 构造授权跳转 URL（auth.openai.com/oauth/authorize；参数与 pi-ai/Codex CLI 一致；不含任何机密）
function buildAuthorizeUrl(state, codeChallenge) {
  const url = new URL('https://auth.openai.com/oauth/authorize')
  url.searchParams.set('client_id', CODEX_OAUTH_CLIENT_ID)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('redirect_uri', 'http://localhost:' + oauthCallbackPort() + OAUTH_CALLBACK_PATH)
  url.searchParams.set('code_challenge', codeChallenge)
  url.searchParams.set('code_challenge_method', 'S256')
  url.searchParams.set('state', state)
  url.searchParams.set('scope', OAUTH_SCOPE)
  return url.toString()
```

</details>

**依据 2 · 源码核查**：[src/host.js:495-520](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L495-L520)

授权码交换及失败分支。

<details>
<summary>查看原文（26行）</summary>

```text
async function exchangeAuthorizationCode(code, verifier) {
  try {
    const res = await fetch('https://auth.openai.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CODEX_OAUTH_CLIENT_ID,
        code: code,
        code_verifier: verifier,
        redirect_uri: 'http://localhost:' + oauthCallbackPort() + OAUTH_CALLBACK_PATH,
      }).toString(),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) return { ok: false, status: res.status }
    const body = await res.json()
    if (!body || typeof body.access_token !== 'string' || body.access_token.length === 0) return { ok: false, status: res.status }
    return {
      ok: true,
      access_token: body.access_token,
      refresh_token: typeof body.refresh_token === 'string' && body.refresh_token.length > 0 ? body.refresh_token : null,
      id_token: typeof body.id_token === 'string' && body.id_token.length > 0 ? body.id_token : null,
    }
  } catch (err) {
    return { ok: false, status: null } // 网络/超时等异常 → 调用方按"交换失败"处理
  }
```

</details>

**依据 3 · 源码核查**：[src/host.js:523-580](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L523-L580)

回调路径、state、单次接收和仅本机监听。

<details>
<summary>查看原文（58行）</summary>

```text
// 本地回调 server：仅监听 127.0.0.1；仅接受 /auth/callback；校验 state（防 CSRF/中间人）；
// 端口占用（EADDRINUSE）等监听失败 → resolve(null)（调用方返回明确错误，不崩溃）
function startOAuthCallbackServer(expectedState, onCode, port, language) {
  return new Promise(function (resolve) {
    let settled = false
    let accepted = false
    const fail = function () { if (!settled) { settled = true; resolve(null) } }
    const server = createServer(async function (req, res) {
      let pathname = '/'
      let params = null
      try {
        const url = new URL(req.url || '/', 'http://localhost')
        pathname = url.pathname
        params = url.searchParams
      } catch (err) {
        respondOAuthPage(res, 400, 'oauth.invalidAddress', language)
        return
      }
      if (pathname !== OAUTH_CALLBACK_PATH) {
        respondOAuthPage(res, 404, 'oauth.notFound', language)
        return
      }
      if (params.get('state') !== expectedState) {
        respondOAuthPage(res, 400, 'oauth.invalidState', language)
        return
      }
      const code = params.get('code')
      if (!code) {
        respondOAuthPage(res, 400, 'oauth.missingCode', language)
        return
      }
      if (accepted) {
        respondOAuthPage(res, 409, 'oauth.invalidState', language)
        return
      }
      accepted = true
      try {
        const result = await onCode(code)
        const ok = result && result.ok === true
        // Only dictionary-owned error text reaches the browser, never callback
        // parameters, server exceptions or credential values.
        const key = ok ? 'oauth.complete' : 'error.' + (result && result.error && result.error.code || 'oauth.exception')
        respondOAuthPage(res, ok ? 200 : 500, key, language, result && result.error && result.error.params)
      } catch (err) {
        respondOAuthPage(res, 500, 'error.oauth.exception', language)
      }
    })
    server.on('error', fail)
    server.listen(port, '127.0.0.1', function () {
      if (!settled) {
        settled = true
        resolve({
          server: server,
          port: port,
          close: function () { try { server.close() } catch (err) { /* 忽略 */ } },
        })
      }
    })
```

</details>

**依据 4 · 源码核查**：[src/host.js:1158-1208](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1158-L1208)

宿主拒绝接口和变更方法门禁。

<details>
<summary>查看原文（51行）</summary>

```text
    const MUTATING = { startCodexOAuth: true, unbindCodex: true, checkUpdate: true, enterUpdatePage: true, installUpdate: true, runUpdateCheck: true, setUpdateAuto: true, rollbackUpdate: true };

    function readBody(req, maxBytes) {
      return new Promise(function (resolve, reject) {
        let size = 0;
        const chunks = [];
        req.on('data', function (c) { size += c.length; if (size > maxBytes) { reject(Object.assign(new Error('payload too large'), { status: 413 })); req.destroy(); return; } chunks.push(c); });
        req.on('end', function () { resolve(Buffer.concat(chunks).toString('utf8')); });
        req.on('error', reject);
      });
    }

    function respond(res, status, payload) {
      res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify(payload));
    }

    // Do not reproduce this check from Origin headers here. The Desktop shell
    // validates dsh-app://app, then deliberately removes renderer headers and
    // injects its private Host cookie while forwarding to this local server.
    // `connection.requestRejection()` is the official, shared trust boundary:
    // Host/Origin anti-rebinding protection plus browser/desktop authentication.
    ctx.inject(['connection', 'webServer'], function (webCtx) {
      webCtx.effect(function () {
        try {
          const dispose = webCtx.webServer.register({
            kind: 'prefix',
            path: ROUTE_PREFIX,
            handler: async function (req, res) {
              try {
                const rejection = webCtx.connection.requestRejection(req);
                if (rejection !== undefined) {
                  respond(res, rejection, { error: rejection === 401 ? 'authentication required' : 'request rejected' });
                  return;
                }
                // handler 只收 (req, res) 两参；pathname 须从 req.url 自行解析（官方 webServer 契约）
                const url = new URL(req.url || '/', 'http://localhost');
                const path = url.pathname;
                if (!path.startsWith(ROUTE_PREFIX + '/')) { respond(res, 404, { error: 'not found' }); return; }
                const method = decodeURIComponent(path.slice(ROUTE_PREFIX.length + 1));
                if (!Object.hasOwn(ROUTES, method)) { respond(res, 404, { error: 'unknown method: ' + method }); return; }
                if (Object.hasOwn(MUTATING, method)) {
                  if (req.method !== 'POST') { respond(res, 405, { error: 'mutating methods require POST' }); return; }
                }
                let args = null;
                if (req.method === 'POST') {
                  const raw = await readBody(req, 64 * 1024);
                  if (raw.length > 0) { try { args = JSON.parse(raw); } catch (e) { respond(res, 400, { error: 'invalid JSON body' }); return; } }
                }
                const result = await ROUTES[method](args);
                respond(res, 200, result);
```

</details>

**依据 5 · 源码核查**：[src/host.js:258-270](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L258-L270)

固定临时名、rename 后权限设置。

<details>
<summary>查看原文（13行）</summary>

```text
function writeAuthJson(filePath, currentAuth, accessToken, refreshToken, lastRefreshIso) {
  const updated = {
    ...currentAuth,
    tokens: { ...(currentAuth.tokens && typeof currentAuth.tokens === 'object' ? currentAuth.tokens : {}), access_token: accessToken, refresh_token: refreshToken },
    last_refresh: lastRefreshIso,
  }
  const tmp = filePath + '.tmp'
  mkdirSync(dirname(filePath), { recursive: true, mode: 0o700 })
  writeFileSync(tmp, JSON.stringify(updated, null, 2) + '\n', { mode: 0o600 })
  chmodSync(tmp, 0o600)
  renameSync(tmp, filePath)
  chmodSync(filePath, 0o600)
  return updated
```

</details>

**依据 6 · 源码核查**：[src/host.js:924-944](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L924-L944)

补偿条件及异常吞掉的路径。

<details>
<summary>查看原文（21行）</summary>

```text
    async function rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken) {
      if (previousAuth !== undefined && typeof newAccessToken === 'string') {
        try {
          const current = readCodexAuthFile(CODEX_AUTH_FILE);
          const currentTokens = current.ok && current.auth.tokens && typeof current.auth.tokens === 'object' ? current.auth.tokens : {};
          if (current.ok && currentTokens.access_token === newAccessToken) {
            if (previousAuth === null) unlinkSync(CODEX_AUTH_FILE);
            else {
              const previousTokens = previousAuth.tokens && typeof previousAuth.tokens === 'object' ? previousAuth.tokens : {};
              writeAuthJson(CODEX_AUTH_FILE, previousAuth, typeof previousTokens.access_token === 'string' ? previousTokens.access_token : '', typeof previousTokens.refresh_token === 'string' ? previousTokens.refresh_token : null, previousAuth.last_refresh || null);
            }
          }
        } catch (err) {}
      }
      if (defaultModel && defaultModel.previous) {
        try { await restoreDefaultModel({ defaultModelManaged: true, previousDefaultModel: defaultModel.previous }); } catch (err) {}
      }
      if (route && route.ok) {
        try { await removeOwnedCodexRoute({ routeOwned: route.owned }); } catch (err) {}
      }
      codexRouteOwned = false;
```

</details>

**依据 7 · 源码核查**：[src/host.js:967-1027](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L967-L1027)

写共享文件、路由、默认模型、标记和凭据顺序。

<details>
<summary>查看原文（61行）</summary>

```text
        const nowIso = new Date().toISOString();
        const read = readCodexAuthFile(CODEX_AUTH_FILE);
        previousAuth = read.ok ? read.auth : null;
        newAccessToken = exchanged.access_token;
        const authToWrite = buildOAuthAuthObject(read.ok ? read.auth : null, exchanged, nowIso);
        try {
          writeAuthJson(CODEX_AUTH_FILE, authToWrite, exchanged.access_token, authToWrite.tokens.refresh_token != null ? authToWrite.tokens.refresh_token : null, nowIso);
        } catch (err) {
          oauthLastError = { kind: 'write', code: 'oauth.write-failed', message: '登录成功了，但没能存到本地。请重新绑定' };
          return;
        }
        const priorFlag = readBindFlag(CODEX_BIND_FILE);
        route = await ensureCodexRoute(priorFlag);
        if (!route.ok) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'route-conflict', code: route.code || 'route.unknown', message: route.message };
          return;
        }
        codexRouteOwned = route.owned;
        try {
          defaultModel = await configureDefaultModel();
          if (!defaultModel.previous && priorFlag.defaultModelManaged) defaultModel.previous = priorFlag.previousDefaultModel;
        } catch (err) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'default-model', code: 'oauth.default-model-manual', message: '绑定成功了，但没能自动设为默认模型。请到「模型」设置里手动选一次 ChatGPT' };
          return;
        }
        if (!defaultModel.ok) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'default-model', code: defaultModel.code || 'default-model.unknown', message: defaultModel.message };
          return;
        }
        const claim = await classifyCodexCredentialSlot(priorFlag, exchanged.access_token);
        if (!claim.claim) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'credentials-conflict', code: 'credentials.conflict', message: MSG_CREDENTIAL_CONFLICT };
          return;
        }
        try {
          writeBindFlag(CODEX_BIND_FILE, Object.assign(withCredentialManaged(priorFlag), {
            routeOwned: route.owned,
            defaultModelManaged: Boolean(defaultModel.previous),
            previousDefaultModel: defaultModel.previous,
          }, { boundAt: nowIso }));
        } catch (err) {
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'write', code: 'oauth.flag-write-failed', message: '绑定成功了，但状态没存住。请重新绑定' };
          return;
        }
        try {
          await ctx.credentials.set('OPENAI_CODEX_API_KEY', exchanged.access_token);          codexInjectedToken = exchanged.access_token;
          codexCredentialOwned = true;
        } catch (err) {
          try { clearBindFlag(CODEX_BIND_FILE); } catch (clearErr) { /* 状态仍保持失败，下一次同步会继续清理 */ }
          await rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken);
          oauthLastError = { kind: 'credentials', code: 'oauth.credentials-failed', message: '绑定失败：登录信息没能交给 DSH。请重试' };
          codexBridgeState = { ok: false, lastSyncAt: Date.now(), expiresAt: null, error: oauthLastError, routeConfigured: route.ok };
          return;
        }
        const expiresAtSec = codexExpiresAt(decodeJwtExp(exchanged.access_token), Date.parse(nowIso));
        codexBridgeState = { ok: true, lastSyncAt: Date.now(), expiresAt: expiresAtSec != null ? expiresAtSec * 1000 : null, error: null, routeConfigured: route.ok };
```

</details>

**依据 8 · 作者声明**：[README.md:53-59](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/README.md#L53-L59)

作者指出 Codex CLI 共享文件的账号影响。

```text
**Sign in again** renews the binding. **Unbind** disconnects the account from this plugin. An existing Codex CLI sign-in is not automatically adopted by the plugin.

## Sign-in data and updates

Authorization and model requests communicate with official OpenAI endpoints. Sign-in tokens are saved in the standard local `~/.codex/auth.json` file with owner-only permissions and synchronized into DSH's credential store. Signing in can update that shared file, so it can affect which account Codex CLI uses. Tokens are transmitted to OpenAI for authorized requests; they are not written to plugin logs.

Unbinding and uninstalling preserve `~/.codex/auth.json` and remove the plugin's binding and managed DSH entries. The plugin refreshes sign-in automatically. Under **Version and updates**, automatic updates (default) check npm when DSH starts, verify and replace the plugin files, then take effect after a restart. Manual mode checks without installing; installation asks for confirmation. Failed updates restore the previous files, and settings offer rollback when needed. Sign-in data is preserved. Local checkout and linked installs require a code update and rebuild; see [docs/INSTALL.md](docs/INSTALL.md).
```

#### 缺口

- 未注入实际文件系统、浏览器和宿主失败。
  **影响**：无法保证跨进程同时刷新或中途失败后全状态一致。
  **进一步探讨**：在隔离目录和桩服务逐步注入失败，比较登录文件、路由、选择及凭据是否恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 后台续期、解绑和脚本卸载分别会清理哪些状态？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

绑定标记用于判断是否同步，启动后周期执行。同进程同步有单飞，续期使用共享文件中的刷新凭据，失败时尝试重读较新的文件。尚无与其他进程共享文件的锁；成功的写入基于先前读取的认证对象。路由和凭据按本进程或标记中的所有权决定清理，已有凭据可因同值、同账号或已绑定时被判断为过期而被接管。标记已认领时，解绑清理直接 unset 凭据，没有回读确认仍是原值。解绑按路由、默认模型、凭据、绑定标记顺序清理，保留共享登录文件，也不发起上游撤销。路由删除遇宿主 settings 未就绪会提前返回，因此解绑成功响应本身不能证明提供方已移除。独立 uninstall.sh 继续按固定键清理 DSH 设置和凭据，未使用绑定所有权判断，可能触及用户自有同名配置。仅看 README 的卸载承诺不能证明普通宿主移除会执行等价清理。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:396-412](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L396-L412)

凭据判定支持同账号和过期接管。

<details>
<summary>查看原文（17行）</summary>

```text
function classifyCodexCredential(existingValue, candidateToken, options) {
  const opts = options && typeof options === 'object' ? options : {}
  if (opts.ownedInProcess === true) return { claim: true, reason: 'owned' }
  if (opts.managed === true) return { claim: true, reason: 'managed' }
  const existing = typeof existingValue === 'string' ? existingValue : ''
  if (existing.length === 0) return { claim: true, reason: 'empty' }
  const candidate = typeof candidateToken === 'string' ? candidateToken : ''
  if (candidate.length === 0) return { claim: false, reason: 'no-candidate' }
  if (existing === candidate) return { claim: true, reason: 'same-value' }
  const existingAccount = codexAccountIdFromJwt(existing)
  const candidateAccount = codexAccountIdFromJwt(candidate)
  if (existingAccount && candidateAccount && existingAccount === candidateAccount) return { claim: true, reason: 'same-account' }
  const nowSec = typeof opts.nowSeconds === 'number' ? opts.nowSeconds : Math.floor(Date.now() / 1000)
  if (opts.boundFlag === true && codexIsTokenExpired(existing, nowSec) && !codexIsTokenExpired(candidate, nowSec)) {
    return { claim: true, reason: 'expired-stale' }
  }
  return { claim: false, reason: 'other' }
```

</details>

**依据 2 · 源码核查**：[src/host.js:731-784](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L731-L784)

所有权、路由未就绪早退、默认选择与凭据清理。

<details>
<summary>查看原文（54行）</summary>

```text
    async function removeOwnedCodexRoute(flag) {
      if (!flag.routeOwned && !codexRouteOwned) return;
      const settings = ctx.settings || ctx.get('settings');
      if (!settingsServiceReady(settings)) return;
      const cur = readSettingsSection(settings, 'llm-pi-ai');
      const route = cur && cur.providers && cur.providers['openai-codex'];
      if (route && route.apiKeyEnv === 'OPENAI_CODEX_API_KEY') {
        await settings.mutate('llm-pi-ai', [{ op: 'unset', path: ['providers', 'openai-codex'] }]);
      }
    }

    async function configureDefaultModel() {
      const service = ctx.get('agentDefaultModel');
      if (!service || typeof service.currentSelection !== 'function' || typeof service.saveSelection !== 'function') return { ok: false, previous: null, code: 'default-model.dsh-not-ready', message: 'DSH 还没准备好，暂时没法把默认模型切成 ChatGPT' };
      const current = service.currentSelection();
      if (!current || current.provider === 'openai-codex') return { ok: true, previous: null };
      await service.saveSelection({ provider: 'openai-codex', model: CODEX_DEFAULT_MODEL, reasoningEffort: current.reasoningEffort });
      return { ok: true, previous: current };
    }

    async function restoreDefaultModel(flag) {
      if (!flag.defaultModelManaged || !flag.previousDefaultModel) return;
      const service = ctx.get('agentDefaultModel');
      if (!service || typeof service.currentSelection !== 'function' || typeof service.saveSelection !== 'function') return;
      const current = service.currentSelection();
      if (current && current.provider === 'openai-codex') await service.saveSelection(flag.previousDefaultModel);
    }

    // ---------- 令牌看护（严格官方模式：绑定标记唯一事实） ----------
    // 判定的不是「槽里有没有东西」，而是「槽里那东西是不是本插件的」。
    // 旧实现只判空，导致插件把自己早期注入的令牌当成别人的，永久拒绝更新 —— 红字死锁的根因。
    async function classifyCodexCredentialSlot(flag, candidateToken) {
      if (codexCredentialOwned) return { claim: true, reason: 'owned' };
      if (flag && flag.credentialManaged === true) return { claim: true, reason: 'managed' };
      if (typeof ctx.credentials.resolve !== 'function') return { claim: false, reason: 'no-credentials-service' };
      const existing = await ctx.credentials.resolve('OPENAI_CODEX_API_KEY');
      return classifyCodexCredential(
        existing && typeof existing === 'object' ? existing.value : '',
        candidateToken,
        { boundFlag: Boolean(flag && flag.bound), nowSeconds: Math.floor(Date.now() / 1000) }
      );
    }

    async function clearInjectedCodexCredential(flag) {
      if (!codexCredentialOwned && !(flag && flag.credentialManaged === true)) return true;
      try {
        await ctx.credentials.unset('OPENAI_CODEX_API_KEY');
        codexInjectedToken = null;
        codexCredentialOwned = false;
        return true;
      } catch (err) {
        codexInjectedToken = null;
        return false;
      }
```

</details>

**依据 3 · 源码核查**：[src/host.js:787-815](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L787-L815)

单飞与按绑定标记同步。

<details>
<summary>查看原文（29行）</summary>

```text
    async function syncCodexToken() {
      if (syncInFlight) return syncInFlight;
      syncInFlight = syncCodexTokenOnce().catch(function () {
        codexBridgeState = { ok: false, lastSyncAt: Date.now(), expiresAt: null, error: { kind: 'exception', code: 'sync.exception', message: '同步时出了点问题，稍后会自动再试一次' }, routeConfigured: codexBridgeState.routeConfigured };
      }).finally(function () { syncInFlight = null; });
      return syncInFlight;
    }

    async function syncCodexTokenOnce() {
      const nowMs = Date.now();
      const nowSec = Math.floor(nowMs / 1000);
      const flag = readBindFlag(CODEX_BIND_FILE);
      if (!flag.bound) {
        const cleared = await clearInjectedCodexCredential(flag);
        try { await removeOwnedCodexRoute(flag); codexRouteOwned = false; } catch (err) {
          codexBridgeState = { ok: false, lastSyncAt: nowMs, expiresAt: null, error: { kind: 'route-cleanup', code: 'unbind.route-cleanup', message: '解绑后没清理干净，稍后会自动再试一次' }, routeConfigured: true };
          return;
        }
        codexBridgeState = { ok: false, lastSyncAt: nowMs, expiresAt: null, error: cleared ? { kind: 'unbound', code: 'state.unbound', message: '还没有绑定 ChatGPT 账号' } : { kind: 'credentials-cleanup', code: 'state.unbound-dirty', message: '还没有绑定，而且之前留下的登录信息也没清掉' }, routeConfigured: false };
        return;
      }
      if (!codexBridgeState.routeConfigured) {
        const route = await ensureCodexRoute(flag);
        if (!route.ok) {
          codexBridgeState = { ok: false, lastSyncAt: nowMs, expiresAt: null, error: { kind: 'route-conflict', code: route.code || 'route.unknown', message: route.message }, routeConfigured: false };
          return;
        }
        codexRouteOwned = route.owned;
        codexBridgeState.routeConfigured = true;
```

</details>

**依据 4 · 源码核查**：[src/host.js:843-897](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L843-L897)

续期、失败重读和凭据落盘。

<details>
<summary>查看原文（55行）</summary>

```text
      if (codexNeedsRefresh(expiresAtSec, nowSec)) {
        if (!refresh) {
          error = { kind: 'auth', code: 'token.expiring', message: '登录快到期了，而且没法自动续期，请重新绑定' };
        } else {
          const pair = await refreshCodexTokenPair(refresh);
          if (pair) {
            try {
              const nextRefresh = pair.refresh_token || refresh;
              const updated = writeAuthJson(CODEX_AUTH_FILE, auth, pair.access_token, nextRefresh, new Date().toISOString());
              token = pair.access_token;
              expiresAtSec = codexExpiresAt(decodeJwtExp(pair.access_token), Date.parse(updated.last_refresh));
            } catch (err) {
              token = pair.access_token;
              expiresAtSec = codexExpiresAt(decodeJwtExp(pair.access_token), nowMs);
              error = { kind: 'write', code: 'token.refresh-write-failed', message: '续期成功，但没能存到本地，下次可能还要重新绑定' };
            }
          } else {
            const reRead = readCodexAuthFile(CODEX_AUTH_FILE);
            const reAuth = reRead.ok ? reRead.auth : null;
            const reTokens = reAuth && reAuth.tokens && typeof reAuth.tokens === 'object' ? reAuth.tokens : {};
            const reAccess = typeof reTokens.access_token === 'string' ? reTokens.access_token : '';
            const reRefreshMs = reAuth && typeof reAuth.last_refresh === 'string' ? Date.parse(reAuth.last_refresh) : NaN;
            if (reAuth && reAccess && !isNaN(reRefreshMs) && (isNaN(lastRefreshMs) || reRefreshMs > lastRefreshMs)) {
              token = reAccess;
              expiresAtSec = codexExpiresAt(decodeJwtExp(reAccess), reRefreshMs);
            } else {
              error = { kind: 'auth', code: 'token.refresh-failed', message: '自动续期失败，请重新绑定' };
            }
          }
        }
      } else {
        token = access;
      }

      if (!token && error) {
        const cleared = await clearInjectedCodexCredential(flag);
        if (!cleared) error = { kind: 'credentials-cleanup', code: 'token.invalid-dirty', message: '登录信息用不了，旧信息也没清掉，请重新绑定' };
      }
      if (token && token !== codexInjectedToken) {
        const claim = await classifyCodexCredentialSlot(flag, token);
        if (!claim.claim) {
          error = { kind: 'credentials-conflict', code: 'credentials.conflict', message: MSG_CREDENTIAL_CONFLICT };
        } else try {
          await ctx.credentials.set('OPENAI_CODEX_API_KEY', token);
          codexInjectedToken = token;
          codexCredentialOwned = true;
          // 账本迁移：老版本绑定标记缺「凭据归本插件所有」一栏，成功接管后立即补记，
          // 之后每次同步都能一步自证，不必再依赖同源判定 —— 防复发。
          if (!(flag && flag.credentialManaged === true)) {
            try { writeBindFlag(CODEX_BIND_FILE, withCredentialManaged(flag)); } catch (migErr) { /* 记账失败不影响本次可用，下周期再补 */ }
          }
        } catch (err) {
          const cleared = await clearInjectedCodexCredential(flag);
          error = cleared ? { kind: 'credentials', code: 'credentials.sync-failed', message: '登录信息同步到 DSH 失败，请重试或重新绑定' } : { kind: 'credentials-cleanup', code: 'credentials.sync-failed-dirty', message: '登录信息同步失败，且旧信息清理也未成功，请重新绑定' };
        }
```

</details>

**依据 5 · 源码核查**：[src/host.js:1065-1079](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1065-L1079)

解绑顺序与失败出口。

<details>
<summary>查看原文（15行）</summary>

```text
    async function unbindCodexRpc() {
      if (oauthInFlight) return { ok: false, error: { kind: 'in-flight', code: 'unbind.in-flight', message: '正在等你在浏览器里完成授权，请先把它做完，或等它超时' } };
      try {
        const flag = readBindFlag(CODEX_BIND_FILE);
        await removeOwnedCodexRoute(flag);
        codexRouteOwned = false;
        await restoreDefaultModel(flag);
        const cleared = await clearInjectedCodexCredential(flag);
        if (!cleared) throw new Error('credentials cleanup failed');
        clearBindFlag(CODEX_BIND_FILE);
        codexBridgeState = { ok: false, lastSyncAt: Date.now(), expiresAt: null, error: { kind: 'unbound', code: 'unbind.done', message: '已经解除绑定' }, routeConfigured: false };
        return { ok: true, bound: false };
      } catch (err) {
        return { ok: false, error: { kind: 'exception', code: 'unbind.exception', message: '解绑失败，请重试' } };
      }
```

</details>

**依据 6 · 源码核查**：[src/host.js:1215-1225](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1215-L1225)

Web 路由撤销及周期同步注册。

<details>
<summary>查看原文（11行）</summary>

```text
          return function () { dispose(); };
        } catch (err) {
          console.warn('[dsh-chatgpt-sub] webServer 路由注册失败', String((err && err.message) || err));
        }
      }, 'dsh-chatgpt-sub: Web routes');
    }, 'dsh-chatgpt-sub: Web routes');

    // ---------- 启动即刷 + 30min 令牌看护 ----------
    // 只有绑定标记存在时，syncCodexToken 才注册 ChatGPT 路由；未绑定状态绝不触碰用户配置。
    syncCodexToken();
    ctx.interval(syncCodexToken, CODEX_SYNC_INTERVAL_MS);
```

</details>

**依据 7 · 源码核查**：[uninstall.sh:29-54](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/uninstall.sh#L29-L54)

独立脚本移除包后仍调用清理。

<details>
<summary>查看原文（26行）</summary>

```text
  echo "==> 从 profile '$PROFILE' 卸载 dsh-chatgpt-sub"
  # 兼容两次包名：dsh-chatgpt-sub（现名）与 dsh-chatgpt-subscription（0.3.x 旧名）
  REMOVED=0
  for PKG in dsh-chatgpt-sub dsh-chatgpt-subscription; do
    if dsh plugin --profile "$PROFILE" remove "$PKG"; then REMOVED=1; fi
  done
  if [[ "$REMOVED" != "1" ]]; then
    echo "  ⚠ 插件移除失败（可能已卸载或 profile 不存在），继续清理配置。"
  fi
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> 清理 openai-codex 路由配置与 OPENAI_CODEX_API_KEY 凭据"
if command -v python3 >/dev/null 2>&1; then
  python3 "$ROOT/scripts/purge-codex.py"
else
  echo "⚠ 未找到 python3，无法自动清理。请手动操作："
  echo "  1) 删除 ~/.dsh/settings.yaml 中的 llm-pi-ai.providers.openai-codex 段"
  echo "  2) 删除 ~/.dsh/.credentials.yaml 中的 OPENAI_CODEX_API_KEY 行"
fi

echo "==> 清理绑定标记目录（~/.dsh/dsh-chatgpt-sub/，以及旧版 ~/.dsh/dsh-chatgpt-subscription/）"
DATA_DIR="${DSH_CHATGPT_DATA_DIR:-$HOME/.dsh/dsh-chatgpt-sub}"
DEFAULT_DATA_DIR="$HOME/.dsh/dsh-chatgpt-sub"
LEGACY_DATA_DIR="$HOME/.dsh/dsh-chatgpt-subscription"
```

</details>

**依据 8 · 源码核查**：[scripts/purge-codex.py:131-167](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/scripts/purge-codex.py#L131-L167)

固定键删除与默认全局路径，不核所有权。

<details>
<summary>查看原文（37行）</summary>

```text
def purge_settings(path):
    """移除 llm-pi-ai.providers.openai-codex 段；返回 (是否改动, 说明)。"""
    if not os.path.isfile(path):
        return False, "settings.yaml 不存在（%s），跳过" % path
    new_lines, removed = remove_path(read_lines(path), ["llm-pi-ai", "providers", "openai-codex"])
    if not removed:
        return False, "settings.yaml 未包含 llm-pi-ai.providers.openai-codex，无需清理"
    bak = path + ".bak-" + time.strftime("%Y%m%d%H%M%S")
    shutil.copy2(path, bak)
    write_lines_atomic(path, new_lines)
    return True, "settings.yaml 已移除 openai-codex 段（修改前备份：%s）" % bak


def purge_credentials(path):
    """移除 OPENAI_CODEX_API_KEY 行；返回 (是否改动, 说明)。"""
    if not os.path.isfile(path):
        return False, ".credentials.yaml 不存在（%s），跳过" % path
    lines = read_lines(path)
    out = [line for line in lines if key_of(line) != "OPENAI_CODEX_API_KEY"]
    removed = len(lines) - len(out)
    if removed == 0:
        return False, ".credentials.yaml 未包含 OPENAI_CODEX_API_KEY，无需清理"
    write_lines_atomic(path, out)
    return True, ".credentials.yaml 已移除 %d 行 OPENAI_CODEX_API_KEY 凭据" % removed


def main():
    ap = argparse.ArgumentParser(description="dsh-chatgpt-sub 卸载清理：移除 openai-codex 配置与凭据")
    ap.add_argument("--settings", default=os.path.expanduser("~/.dsh/settings.yaml"),
                    help="settings.yaml 路径（默认 ~/.dsh/settings.yaml）")
    ap.add_argument("--credentials", default=os.path.expanduser("~/.dsh/.credentials.yaml"),
                    help=".credentials.yaml 路径（默认 ~/.dsh/.credentials.yaml）")
    args = ap.parse_args()
    for changed, msg in (purge_settings(args.settings), purge_credentials(args.credentials)):
        print(("✔ " if changed else "· ") + msg)
    print("提示：运行中的 DeepSeek Harness 把配置/凭据保存在内存里，改动需重启 DSH 后生效；"
          "~/.codex/auth.json（codex CLI 自己的登录态）未做任何改动。")
```

</details>

#### 缺口

- 未验证多个 DSH profile、Codex CLI 同时续期和宿主原生移除。
  **影响**：出现遗留或用户更改后可能需要人工恢复。
  **进一步探讨**：用合成双账号和两个 profile 测绑定中、同步中和重启后的配置差异。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 自更新如何改变版本，评估采用需要承担哪些成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

宿主需具备设置、凭据、计时、shell、连接、Web 路由和默认模型能力。实际授权还需浏览器可达回调、可用账号及网络。profile 内的安装默认开启自更新，启动延迟检查 npm，设置页访问与环境开关限制自动安装。下载用注册表返回的 SHA-512、包名版本及允许路径校验。应用备份后逐文件替换，普通异常走回滚，整批没有原子提交，进程硬中止结果未核。首次成本由用户承担准备隔离 profile、凭据目录与重启时间。持续成本是登录续期、额度核查和更新审计。失败成本包括核对共享登录、默认模型、提供方及凭据后恢复原配置。合格任务需要账号准入、一次目标模型真实返回，以及解绑后隔离状态正确恢复。现金、额度、人工分钟均未知。当前观察，使用原有 DSH 模型或独立客户端保留工作路径，只在授权与固定宿主验收明确后重新判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:53-85](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L53-L85)

profile 探测、绑定与共享凭据目录边界。

<details>
<summary>查看原文（33行）</summary>

```text
function dshHomeDir() { return process.env.DSH_HOME || join(homedir(), '.dsh') }
function isLoadedAsProfilePlugin() {
  try {
    const real = realpathSync(PACKAGE_DIR)
    const profilesRoot = realpathSync(join(dshHomeDir(), 'profiles')) + sep
    // Windows 与 macOS 默认文件系统不区分大小写：盘符或目录大小写不一致
    // （如 C:\ 与 c:\）时逐字比较会误判为「非 profile 安装」，自更新被静默关闭。
    // 平台分支只在这一处做一次，调用方只读布尔结果。
    if (process.platform === 'win32' || process.platform === 'darwin') {
      return real.toLowerCase().startsWith(profilesRoot.toLowerCase())
    }
    return real.startsWith(profilesRoot)
  } catch { return false }
}


const DATA_DIR = process.env.DSH_CHATGPT_DATA_DIR || join(homedir(), '.dsh', 'dsh-chatgpt-sub')
// Update state follows this DSH installation; existing binding files keep their established location.
const UPDATE_DATA_DIR = process.env.DSH_CHATGPT_DATA_DIR || join(dshHomeDir(), 'dsh-chatgpt-sub')
// 一次性迁移：0.3.x 时包名是 dsh-chatgpt-subscription，绑定标记目录随包名升级。
// 默认路径下旧目录存在、新目录不存在时整体搬移（绑定标记跟着走，用户不用重新绑定）；
// 显式指定 DSH_CHATGPT_DATA_DIR 的是开发/测试隔离场景，一律不动。
// 搬移失败就落在新目录从头开始：auth.json 里的令牌不受影响，代价只是重新绑定一次。
const LEGACY_DATA_DIR = join(homedir(), '.dsh', 'dsh-chatgpt-subscription')
if (!process.env.DSH_CHATGPT_DATA_DIR && existsSync(LEGACY_DATA_DIR) && !existsSync(DATA_DIR)) {
  try { renameSync(LEGACY_DATA_DIR, DATA_DIR); } catch { }
}
const CODEX_BIND_FILE = process.env.DSH_CHATGPT_BIND_FILE || join(DATA_DIR, 'codex-bind.json')

const CODEX_OAUTH_CLIENT_ID = 'app_EMoamEEZ73f0CkXaXp7hrann' // OpenAI OAuth 公开 client_id（token 续期用，非密钥）
const CODEX_DEFAULT_MODEL = process.env.DSH_CHATGPT_DEFAULT_MODEL || 'gpt-5.6-luna'
const CODEX_AUTH_FILE = process.env.DSH_CHATGPT_AUTH || join(homedir(), '.codex', 'auth.json')
const OAUTH_CALLBACK_TIMEOUT_MS = Number(process.env.DSH_CHATGPT_OAUTH_TIMEOUT_MS) > 0 ? Number(process.env.DSH_CHATGPT_OAUTH_TIMEOUT_MS) : 5 * 60 * 1000
```

</details>

**依据 2 · 源码核查**：[src/host.js:611-645](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L611-L645)

宿主依赖、自动更新条件与计时。

<details>
<summary>查看原文（35行）</summary>

```text
export default {
  inject: ['credentials', 'settings', 'timer', 'shell'],
  apply(ctx) {
    const SELF_UPDATE_ENABLED = process.env.DSH_CHATGPT_SELF_UPDATE !== 'off' && isLoadedAsProfilePlugin()
    const SELF_UPDATE_DELAY_MS = 8000
    // 此次 DSH 启动期间只要用户进入过插件设置页，自动更新就留到下次重启。
    // 页面里点「检查更新」仍只检查；安装必须由确认动作触发。
    let updatePageVisited = false
    let selfUpdater = null
    if (SELF_UPDATE_ENABLED) {
      selfUpdater = createSelfUpdater({
        packageDir: PACKAGE_DIR,
        dataDir: UPDATE_DATA_DIR,
        runningVersion: packageVersion(),
        autoInstallAllowed: function () { return !updatePageVisited },
        log: function (message) { try { console.warn('[dsh-chatgpt-sub] ' + message) } catch (err) { /* 日志失败无害 */ } },
      })
      selfUpdater.loadState()
      // 定时器随插件生命周期清理：宿主 ctx 提供 effect；桩 ctx / 老宿主没有时退回直接挂定时器
      // （unref 保证不会拖住进程退出）。读 ctx.effect 一律包在 try 里 —— cordis 4 的 Context 是
      // Proxy，某些形态下读未声明的属性会抛 "without inject"，这一点本仓库已踩过三次。
      const scheduleSelfUpdate = function () {
        const timer = setTimeout(function () {
          if (updatePageVisited) return
          selfUpdater.run().catch(function () { /* 状态已落盘，无需上抛 */ })
        }, SELF_UPDATE_DELAY_MS)
        if (timer && typeof timer.unref === 'function') timer.unref()
        return function () { clearTimeout(timer) }
      }
      try {
        if (typeof ctx.effect === 'function') ctx.effect(scheduleSelfUpdate, 'dsh-chatgpt-sub: self update')
        else scheduleSelfUpdate()
      } catch (err) {
        try { scheduleSelfUpdate() } catch (err2) { /* 定时器都挂不上就放弃自动更新，信息栏照常 */ }
      }
```

</details>

**依据 3 · 源码核查**：[src/host.js:1175-1208](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1175-L1208)

连接与 Web 接线。

<details>
<summary>查看原文（34行）</summary>

```text
    // Do not reproduce this check from Origin headers here. The Desktop shell
    // validates dsh-app://app, then deliberately removes renderer headers and
    // injects its private Host cookie while forwarding to this local server.
    // `connection.requestRejection()` is the official, shared trust boundary:
    // Host/Origin anti-rebinding protection plus browser/desktop authentication.
    ctx.inject(['connection', 'webServer'], function (webCtx) {
      webCtx.effect(function () {
        try {
          const dispose = webCtx.webServer.register({
            kind: 'prefix',
            path: ROUTE_PREFIX,
            handler: async function (req, res) {
              try {
                const rejection = webCtx.connection.requestRejection(req);
                if (rejection !== undefined) {
                  respond(res, rejection, { error: rejection === 401 ? 'authentication required' : 'request rejected' });
                  return;
                }
                // handler 只收 (req, res) 两参；pathname 须从 req.url 自行解析（官方 webServer 契约）
                const url = new URL(req.url || '/', 'http://localhost');
                const path = url.pathname;
                if (!path.startsWith(ROUTE_PREFIX + '/')) { respond(res, 404, { error: 'not found' }); return; }
                const method = decodeURIComponent(path.slice(ROUTE_PREFIX.length + 1));
                if (!Object.hasOwn(ROUTES, method)) { respond(res, 404, { error: 'unknown method: ' + method }); return; }
                if (Object.hasOwn(MUTATING, method)) {
                  if (req.method !== 'POST') { respond(res, 405, { error: 'mutating methods require POST' }); return; }
                }
                let args = null;
                if (req.method === 'POST') {
                  const raw = await readBody(req, 64 * 1024);
                  if (raw.length > 0) { try { args = JSON.parse(raw); } catch (e) { respond(res, 400, { error: 'invalid JSON body' }); return; } }
                }
                const result = await ROUTES[method](args);
                respond(res, 200, result);
```

</details>

**依据 4 · 源码核查**：[src/self-update.js:196-228](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/self-update.js#L196-L228)

包名、版本、路径和 SHA-512 校验。

<details>
<summary>查看原文（33行）</summary>

```text
export function verifyPayload(files, options) {
  const { integrity, version } = options || {}
  if (!Array.isArray(files)) throw new Error('payload files are invalid')
  const seenPaths = new Set()
  for (const file of files) {
    if (!file || typeof file.path !== 'string' || seenPaths.has(file.path)) {
      throw new Error('payload has duplicate or invalid path: ' + String(file && file.path))
    }
    seenPaths.add(file.path)
  }
  const manifestFile = files.find((file) => file.path === 'package.json')
  if (!manifestFile) throw new Error('payload has no package.json')
  let manifest
  try {
    manifest = JSON.parse(manifestFile.data.toString('utf8'))
  } catch {
    throw new Error('payload package.json is not valid JSON')
  }
  if (manifest.name !== PACKAGE_NAME) throw new Error('payload package name mismatch: ' + String(manifest.name))
  if (version && manifest.version !== version) throw new Error('payload version mismatch: ' + String(manifest.version) + ' != ' + version)
  if (parseSemver(manifest.version) === null) throw new Error('payload version is not semver: ' + String(manifest.version))
  if (typeof integrity === 'string' && integrity.length > 0) {
    const [algorithm, expected] = integrity.split('-')
    // 给了校验值就必须验得动：算法不是 sha512 一律拒绝，绝不「看不懂就跳过校验」。
    if (algorithm !== 'sha512' || !expected) throw new Error('payload integrity uses an unsupported algorithm: ' + String(algorithm))
    const digest = createHash('sha512').update(options.tarball).digest('base64')
    if (digest !== expected) throw new Error('payload integrity mismatch')
  }
  for (const file of files) {
    if (!isAllowedPayloadPath(file.path)) throw new Error('payload path not allowed: ' + file.path)
    if (resolveSafePath('/', file.path) === null) throw new Error('payload path escapes: ' + file.path)
  }
  return manifest
```

</details>

**依据 5 · 源码核查**：[src/self-update.js:254-323](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/self-update.js#L254-L323)

备份、逐文件替换与回滚。

<details>
<summary>查看原文（70行）</summary>

```text
export function applyPayload(files, context) {
  const { packageDir, backupDir, log } = context || {}
  if (!packageDir || !backupDir) throw new Error('applyPayload needs packageDir and backupDir')
  if (!Array.isArray(files)) throw new Error('applyPayload needs files')
  // 先完整预检，避免一个后置的异常路径导致前面的合法文件已经被替换。
  const targets = files.map((file) => {
    const path = file && file.path
    const target = resolveSafePayloadTarget(packageDir, path)
    if (!target) throw new Error('refusing to write outside package or through a symbolic link: ' + String(path))
    return { file, target }
  })
  const before = listPayloadFiles(packageDir)
  // 备份当前内容（含目录结构），用于失败回滚
  rmSync(backupDir, { recursive: true, force: true })
  mkdirSync(backupDir, { recursive: true })
  const backedUp = []
  for (const relative of before) {
    const source = resolveSafePath(packageDir, relative)
    const target = resolveSafePath(backupDir, relative)
    if (!source || !target || !existsSync(source)) continue
    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(source, target)
    backedUp.push(relative)
  }
  const restoredFiles = () => {
    rmSync(backupDir, { recursive: true, force: true })
  }
  const written = []
  try {
    for (const entry of targets) {
      const { file, target } = entry
      mkdirSync(dirname(target), { recursive: true })
      const temp = target + '.update-tmp'
      writeFileSync(temp, file.data)
      renameSync(temp, target)
      written.push(file.path)
    }
  } catch (error) {
    rollbackPayload({ packageDir, backupDir, before: backedUp, written })
    restoredFiles()
    if (typeof log === 'function') log('update rolled back: ' + error.message)
    throw error
  }
  return { before: backedUp, written, backupDir }
}

export function rollbackPayload(context) {
  const { packageDir, backupDir, before, written } = context || {}
  if (!packageDir || !backupDir) return { restored: [], removed: [] }
  const keep = new Set(Array.isArray(before) ? before : [])
  const removed = []
  for (const relative of Array.isArray(written) ? written : []) {
    if (keep.has(relative)) continue
    const target = resolveSafePath(packageDir, relative)
    if (!target) continue
    rmSync(target, { force: true })
    removed.push(relative)
  }
  const restored = []
  if (existsSync(backupDir)) {
    for (const relative of keep) {
      const source = resolveSafePath(backupDir, relative)
      const target = resolveSafePath(packageDir, relative)
      if (!source || !target || !existsSync(source)) continue
      mkdirSync(dirname(target), { recursive: true })
      copyFileSync(source, target)
      restored.push(relative)
    }
  }
  return { restored, removed }
```

</details>

**依据 6 · 源码核查**：[src/self-update.js:344-365](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/self-update.js#L344-L365)

默认自动更新与状态恢复。

<details>
<summary>查看原文（22行）</summary>

```text
  // holdVersion：用户回滚过的版本。回滚是「新版有问题」时的逃生门，若重启后 8 秒的自动检查又把它
  // 装回来，等于逃生门自己会关上。因此回滚后只暂缓「正好等于该版本」的更新，更高版本照常进行。
  let state = { autoUpdate: true, pendingVersion: null, holdVersion: null, updatedAt: null, lastError: null, lastCheckAt: null }
  // 并发去重按动作分槽：检查是纯读、安装是写，两者语义不同，不能共用一个在途 promise ——
  // 共用会让「检查在跑时来的安装请求」变成什么都不做的空转（拿到的是检查的结果）。
  const inFlight = { check: null, install: null }

  function loadState() {
    try {
      const parsed = JSON.parse(readFileSync(stateFile, 'utf8'))
      if (parsed && typeof parsed === 'object') {
        state = {
          autoUpdate: parsed.autoUpdate !== false,
          pendingVersion: typeof parsed.pendingVersion === 'string' ? parsed.pendingVersion : null,
          holdVersion: typeof parsed.holdVersion === 'string' ? parsed.holdVersion : null,
          updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : null,
          lastError: typeof parsed.lastError === 'string' ? parsed.lastError : null,
          lastCheckAt: typeof parsed.lastCheckAt === 'number' ? parsed.lastCheckAt : null,
        }
      }
    } catch { /* 首次运行或文件损坏：用默认值 */ }
    return state
```

</details>

**依据 7 · 源码核查**：[src/self-update.js:445-454](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/self-update.js#L445-L454)

下载后校验与替换门。

<details>
<summary>查看原文（10行）</summary>

```text
  async function performUpdate(target, manual) {
    const tarball = await downloadTarball(target.version)
    const files = extractPackageFiles(tarball)
    verifyPayload(files, { integrity: target.integrity, version: target.version, tarball })
    // 用户打开设置页后，即使启动时的自动下载已经开始，也不得在当前页面替换插件文件。
    if (!manual && !autoInstallAllowed()) return false
    const result = applyPayload(files, { packageDir, backupDir: join(backupRoot, target.version), log })
    pruneBackups()
    return !!result
  }
```

</details>

**依据 8 · 作者声明**：[README.md:55-63](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/README.md#L55-L63)

作者描述共享登录、更新与退出。

```text
## Sign-in data and updates

Authorization and model requests communicate with official OpenAI endpoints. Sign-in tokens are saved in the standard local `~/.codex/auth.json` file with owner-only permissions and synchronized into DSH's credential store. Signing in can update that shared file, so it can affect which account Codex CLI uses. Tokens are transmitted to OpenAI for authorized requests; they are not written to plugin logs.

Unbinding and uninstalling preserve `~/.codex/auth.json` and remove the plugin's binding and managed DSH entries. The plugin refreshes sign-in automatically. Under **Version and updates**, automatic updates (default) check npm when DSH starts, verify and replace the plugin files, then take effect after a restart. Manual mode checks without installing; installation asks for confirmation. Failed updates restore the previous files, and settings offer rollback when needed. Sign-in data is preserved. Local checkout and linked installs require a code update and rebuild; see [docs/INSTALL.md](docs/INSTALL.md).

## Uninstall and roll back

Remove the plugin from the desktop app's **Plugins** page, or use `dsh plugin --profile web remove dsh-chatgpt-sub` for the CLI web profile, then restart DSH. Uninstalling keeps `~/.codex/auth.json` (the Codex CLI's own sign-in) and removes this plugin's binding and the DSH entries it manages. To go back a version instead of removing the plugin, **Version and updates** offers rollback after a failed update or while a newer build waits for a restart. Do not include sign-in files, credentials, or account details in bug reports.
```

#### 缺口

- 未执行当前包的更新、崩溃恢复、合法账号请求或真实卸载。
  **影响**：无法确认完整采用、兼容性和单个合格任务成本。
  **进一步探讨**：先用本地包与合成账号验证回滚和状态隔离，再在具备上游许可和账号授权时验收真实任务。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样验证隔离凭据与分阶段状态能减少误判？

**研究主题**：新假设与验证

#### 完整回答

可比较当前共享凭据流程与独立账户存储加分阶段状态的原型。原型显示授权码交换、本地保存、DSH 凭据、实际提供方准入和解绑回读，每一步分别报告。先用合成身份和桩提供方制造同名槽、续期冲突、默认模型失败和解绑不完整。记录跨账户改写次数、Connected 误报、人工恢复动作和失败定位时间。候选方案需保持相同任务能力，同时减少共享文件串扰或恢复代价。若隔离不能减少误报，或引入新的凭据副本且无法回收，应推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:924-944](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L924-L944)

现有失败补偿和共享状态。

<details>
<summary>查看原文（21行）</summary>

```text
    async function rollbackBindingSetup(route, defaultModel, previousAuth, newAccessToken) {
      if (previousAuth !== undefined && typeof newAccessToken === 'string') {
        try {
          const current = readCodexAuthFile(CODEX_AUTH_FILE);
          const currentTokens = current.ok && current.auth.tokens && typeof current.auth.tokens === 'object' ? current.auth.tokens : {};
          if (current.ok && currentTokens.access_token === newAccessToken) {
            if (previousAuth === null) unlinkSync(CODEX_AUTH_FILE);
            else {
              const previousTokens = previousAuth.tokens && typeof previousAuth.tokens === 'object' ? previousAuth.tokens : {};
              writeAuthJson(CODEX_AUTH_FILE, previousAuth, typeof previousTokens.access_token === 'string' ? previousTokens.access_token : '', typeof previousTokens.refresh_token === 'string' ? previousTokens.refresh_token : null, previousAuth.last_refresh || null);
            }
          }
        } catch (err) {}
      }
      if (defaultModel && defaultModel.previous) {
        try { await restoreDefaultModel({ defaultModelManaged: true, previousDefaultModel: defaultModel.previous }); } catch (err) {}
      }
      if (route && route.ok) {
        try { await removeOwnedCodexRoute({ routeOwned: route.owned }); } catch (err) {}
      }
      codexRouteOwned = false;
```

</details>

**依据 2 · 源码核查**：[src/host.js:1065-1096](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/src/host.js#L1065-L1096)

解绑与状态接口是对照观测点。

<details>
<summary>查看原文（32行）</summary>

```text
    async function unbindCodexRpc() {
      if (oauthInFlight) return { ok: false, error: { kind: 'in-flight', code: 'unbind.in-flight', message: '正在等你在浏览器里完成授权，请先把它做完，或等它超时' } };
      try {
        const flag = readBindFlag(CODEX_BIND_FILE);
        await removeOwnedCodexRoute(flag);
        codexRouteOwned = false;
        await restoreDefaultModel(flag);
        const cleared = await clearInjectedCodexCredential(flag);
        if (!cleared) throw new Error('credentials cleanup failed');
        clearBindFlag(CODEX_BIND_FILE);
        codexBridgeState = { ok: false, lastSyncAt: Date.now(), expiresAt: null, error: { kind: 'unbound', code: 'unbind.done', message: '已经解除绑定' }, routeConfigured: false };
        return { ok: true, bound: false };
      } catch (err) {
        return { ok: false, error: { kind: 'exception', code: 'unbind.exception', message: '解绑失败，请重试' } };
      }
    }

    function getCodexBridgeStatusRpc() {
      const flag = readBindFlag(CODEX_BIND_FILE);
      // 账号摘要只在已绑定时读一次本地登录文件；邮箱已在 host 侧脱敏，完整值不跨进程传输。
      const read = flag.bound ? readCodexAuthFile(CODEX_AUTH_FILE) : { ok: false };
      const summary = read.ok ? codexAccountSummary(read.auth) : null;
      return {
        ok: codexBridgeState.ok,
        bound: flag.bound,          // 绑定标记是唯一事实
        oauthInFlight: oauthInFlight,
        expiresAt: codexBridgeState.expiresAt,
        lastSyncAt: codexBridgeState.lastSyncAt,
        error: oauthLastError || codexBridgeState.error,
        routeConfigured: codexBridgeState.routeConfigured,
        account: summary ? { email: summary.email, plan: planDisplayName(summary.plan) } : null,
      };
```

</details>

**依据 3 · 源码核查**：[scripts/purge-codex.py:131-154](https://github.com/songoao25/dsh-chatgpt-sub/blob/a1658e5102b7ee4a698e88c809ed60e72bc9c245/scripts/purge-codex.py#L131-L154)

同名路由和凭据碰撞的反例材料。

<details>
<summary>查看原文（24行）</summary>

```text
def purge_settings(path):
    """移除 llm-pi-ai.providers.openai-codex 段；返回 (是否改动, 说明)。"""
    if not os.path.isfile(path):
        return False, "settings.yaml 不存在（%s），跳过" % path
    new_lines, removed = remove_path(read_lines(path), ["llm-pi-ai", "providers", "openai-codex"])
    if not removed:
        return False, "settings.yaml 未包含 llm-pi-ai.providers.openai-codex，无需清理"
    bak = path + ".bak-" + time.strftime("%Y%m%d%H%M%S")
    shutil.copy2(path, bak)
    write_lines_atomic(path, new_lines)
    return True, "settings.yaml 已移除 openai-codex 段（修改前备份：%s）" % bak


def purge_credentials(path):
    """移除 OPENAI_CODEX_API_KEY 行；返回 (是否改动, 说明)。"""
    if not os.path.isfile(path):
        return False, ".credentials.yaml 不存在（%s），跳过" % path
    lines = read_lines(path)
    out = [line for line in lines if key_of(line) != "OPENAI_CODEX_API_KEY"]
    removed = len(lines) - len(out)
    if removed == 0:
        return False, ".credentials.yaml 未包含 OPENAI_CODEX_API_KEY，无需清理"
    write_lines_atomic(path, out)
    return True, ".credentials.yaml 已移除 %d 行 OPENAI_CODEX_API_KEY 凭据" % removed
```

</details>

#### 缺口

- 没有实现或执行原型。
  **影响**：不能判断隔离代价与真实授权行为。
  **进一步探讨**：仅对合成账号做固定故障回放，并保留逐状态人工标注。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
