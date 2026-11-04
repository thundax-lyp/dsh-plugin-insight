# Token Bank

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[fba634c](https://github.com/wink-run/tokenbank/tree/fba634c061a04cefe68a0121036d1fd5dcaf509d)

<!-- BEGIN META -->
[![GitHub ★ 111](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=111&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/wink-run/tokenbank)
<!-- END META -->

> **功能**：独立运行的 AI 网关客户端，集中配置模型来源、路由与用量，并提供 DSH 配置接入。

> **亮点**：把源级冷却与候选切换集中于独立网关，让上游拒绝可在链内处理。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：接管会重写 YAML。解析异常退空和流式开始后难重试是实际边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 在 DSH 场景下它是插件还是独立网关？](#detail-section-11)
  - [Q02 · 网关降级减少哪种手工操作？](#detail-section-12)
  - [Q03 · 配置接管失败时能否安全退出？](#detail-section-13)
  - [Q04 · 什么时候增加网关比直连更可靠？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用多个模型来源的开发者可以通过一个网关管理 DSH 接入与候选切换。

对照直连和手动更换上游。单源稳定时额外一跳和配置副作用可能不值得。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 本地网关 | 汇总路由 | 云和社区另有通路 |
| DSH 接入 | 改 provider 及凭据 | 需回读和可恢复 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| 独立网关 | 接入模型请求 | 需要进程持续运行 |
| DSH 配置和凭据 | 路由接管 | 隔离目录并备份 |

| 步骤 | 操作 | 失败处理 |
| --- | --- | --- |
| 准备 | 备份和模拟来源 | 检查监听与数据流 |
| 试用 | 测试两种失败 | 核对流式结果 |
| 回退 | 恢复配置并直连 | 回读凭据与实际请求 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置和凭据 | 配置人时 |
| 持续 | 网关和日志 | 时延和人工 |
| 恢复 | 重建直连 | 比对配置 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 候选切换 | 故障时完成同一请求 | 真实宿主未测 |

> **思考**：接管会重写 YAML。解析异常退空和流式开始后难重试是实际边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把源级冷却与候选切换集中于独立网关，让上游拒绝可在链内处理。见 [Q01](#research-q01)、[Q02](#research-q02)。

分离独立应用和 DSH 接入模块，凭据与设置两次落盘，退回需核对两者。

<a id="detail-section-5"></a>

### 1.4 主要限制

接管会重写 YAML。解析异常退空和流式开始后难重试是实际边界。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只用模拟上游和临时配置检验接管、失败与退出，不能确认恢复就保留直连。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认独立入口、DSH 配置改写和降级片段。真实网关兼容、费用和完整回退待验证。

- 已检查：作者 README、包清单、源码路径 client/package.json、client/electron/local-gateway.js、client/electron/dsh-config.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查独立分发、网关关键路由、DSH 接入；未审计共享市场、云同步或全部协议适配。
- 下一步：用测试目录分别覆盖损坏 YAML、首字节前后失败和恢复原连接。

**分析版本**

- **仓库**：[wink-run/tokenbank](https://github.com/wink-run/tokenbank)
- **版本号**：未声明（[固定提交 fba634c](https://github.com/wink-run/tokenbank/tree/fba634c061a04cefe68a0121036d1fd5dcaf509d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将首字节前后故障分开，对照网关和直连的完成率、流语义和回退。见 [Q04](#research-q04)。

用测试目录分别覆盖损坏 YAML、首字节前后失败和恢复原连接。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 244 | 83423 | 70131 | 8132 | — |
| .js | test | 154 | 15625 | 13782 | 694 | — |
| .cjs | source | 1 | 526 | 392 | 74 | — |
| .jsx | source | 53 | 43759 | 39383 | 2482 | — |
| .md | source | 55 | 28279 | — | — | 146105 |
| .mjs | source | 1 | 60 | 50 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/wink-run/tokenbank/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/wink-run/tokenbank/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/wink-run/tokenbank/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立网关怎样接管 DSH 请求与配置，接管和回退有什么风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH 场景下它是插件还是独立网关？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

使用多个模型工具的开发者可将客户端流量转入统一地址，以便核对上游切换。固定分发的 client/package.json 将 Electron 主入口设在本地应用，网关 start 默认绑定 127.0.0.1，但绑定地址可传入。DSH 接入代码改的是 settings YAML 的 provider apiKeyEnv，并写入独立网关凭据。它是独立网关客户端，不是通过原生 DSH 插件加载。相比手动配置多个上游，集中控制依赖网关持续运行；云端、社区资源和协议转换功能须另行区分，不由回环地址推出全部数据留在本地。

#### 证据与依据

**依据 1 · 源码核查**：[client/package.json:1-15](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/package.json#L1-L15)

Electron 工程入口与版本

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "llm-proxy-client",
  "version": "0.6.0",
  "private": true,
  "main": "electron/main.js",
  "scripts": {
    "dev": "node scripts/gen-icons.js && concurrently \"vite\" \"wait-on http://localhost:5173 && npx electron .\"",
    "dev:vite": "vite",
    "prebuild": "node scripts/gen-icons.js && node scripts/gen-changelog.js",
    "build": "vite build && electron-builder",
    "gen-icons": "node scripts/gen-icons.js",
    "changelog": "node scripts/gen-changelog.js",
    "test": "ELECTRON_RUN_AS_NODE=1 electron --test electron/__tests__/*.test.js",
    "test:cli-runtime": "ELECTRON_RUN_AS_NODE=1 electron --test electron/__tests__/cli-runtime-deps.test.js",
    "postinstall": "electron-rebuild -f -w better-sqlite3",
```

</details>

**依据 2 · 源码核查**：[client/electron/local-gateway.js:4252-4268](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L4252-L4268)

默认回环且支持传入地址

<details>
<summary>查看原文（17行）</summary>

```text
function start(port, getConfig, saveConfig, bindHost = '127.0.0.1', onListenError) {
  if (_server) return;
  // 日志管道断开（stdout/stderr 被下游关闭，如 `| head`、父进程退出）不应打断网关：
  // 否则 EPIPE 会以未捕获异常冒泡（console.log → write EPIPE）拖垮进程。吞掉即可。
  try {
    if (!process.stdout.__tbEpipeGuard) { process.stdout.on('error', () => {}); process.stdout.__tbEpipeGuard = true; }
    if (!process.stderr.__tbEpipeGuard) { process.stderr.on('error', () => {}); process.stderr.__tbEpipeGuard = true; }
  } catch {}
  _port       = port || 11430;
  _getConfig  = getConfig;
  _saveConfig = saveConfig || null;
  _server     = http.createServer(handleRequest);
  // 图像生成上游可能 30–120s 无响应字节（内部轮询），放宽服务端超时
  _server.requestTimeout = 600_000;
  _server.headersTimeout = 610_000;
  _server.listen(_port, bindHost, () => {
    console.log(`[gateway] listening on ${bindHost}:${_port}`);
```

</details>

**依据 3 · 源码核查**：[client/electron/dsh-config.js:90-106](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/dsh-config.js#L90-L106)

接入是 YAML 和凭据修改

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * 已纳管 settings.yaml：apiKeyEnv 改成独立名，并同步 .credentials.yaml。
 * 幂等：已是独立名且 key 一致则不写盘。
 */
function syncDshGatewayKey(settingsFile, apiKey) {
  if (!settingsFile || !apiKey) return { changed: false };
  const dshHome = path.dirname(settingsFile);
  const doc = loadYaml(settingsFile);
  let settingsChanged = false;
  const current = doc?.['llm-pi-ai']?.providers?.tokenbank?.apiKeyEnv;
  if (current !== DSH_API_KEY_ENV) {
    deepSetDot(doc, API_KEY_ENV_DOT, DSH_API_KEY_ENV);
    settingsChanged = true;
  }
  if (settingsChanged) writeYaml(settingsFile, doc);
  const credChanged = writeDshCredentials(dshHome, apiKey);
  return { changed: settingsChanged || credChanged };
```

</details>

**依据 4 · 作者声明**：[README.md:78-101](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/README.md#L78-L101)

作者说明本地和云端路径

<details>
<summary>查看原文（24行）</summary>

````text
## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Desktop (Electron · Mac / Windows) or CLI / Docker Web UI      │
│  Gateway · Models · Assets · Playground · Usage · …          │
└────────────────────────────┬────────────────────────────────────┘
                             │ loopback
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Local gateway  :11430/v1                                       │
│  · Anthropic Messages / OpenAI Chat / Codex Responses adapters  │
│  · keyScene rewrite · scene/task-type routing · compression     │
│  · Built-in MCP relay (prompts / models / resources / bridge)   │
└───────────────┬─────────────────────────────┬───────────────────┘
                │ local keys stay on device     │ login + relay key
                ▼                             ▼
     Ollama / free API / sub / PAYG      Token Bank cloud
                                             │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                         Community P2P   Remote agents   Multi-device
                         (WebSocket)     (run elsewhere) usage merge
```
````

</details>

#### 缺口

- 未实际对 DSH 请求做拦截核对
  **影响**：未知实际 Profile 与协议兼容
  **进一步探讨**：用隔离 DSH 和模拟上游核对请求路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 网关降级减少哪种手工操作？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

固定路由片段在源级限流或认证失败时记录 cooldown，并为单账号多模型维护失效源集合。相比每次自己切换 provider，可在同一次请求的候选链内避开不可用源。降级不是任意时点可重试：上游响应已写给客户端时，代码不再做原地改参重试，以免混合输出。共享同一上游的候选仍可能共同失败。没有同题数据支持省 token 或成本下降，也未独立验证各协议与工具调用语义。

#### 证据与依据

**依据 1 · 源码核查**：[client/electron/local-gateway.js:2607-2625](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L2607-L2625)

开始响应后的改参重试边界

<details>
<summary>查看原文（19行）</summary>

```text
async function callProvider(provider, isAnthropic, streaming, reqPath, body, attemptModel, res, routeMeta = null) {
  const providerId = provider && provider.id;
  // 已学习的 set/strip：首包改写，避免每次先 400 再同源重试
  let reqBody = upstreamHints.applyHints(body, providerId, attemptModel);
  if (reqBody !== body) {
    const desc = upstreamHints.describeMutations(upstreamHints.getMerged(providerId, attemptModel));
    debugLog('上游约束按学习表首包改参', { model: attemptModel, provider: providerId, desc });
    console.log(`[gateway] body-fix (learned) ${desc} model="${attemptModel}" via "${providerId}"`);
  }

  try {
    return await callProviderOnce(provider, isAnthropic, streaming, reqPath, reqBody, attemptModel, res, routeMeta);
  } catch (err) {
    // 响应已开始写出则无法改参重试；429 等硬错误交给外层 cooldown 降级
    if (res && res.headersSent) throw err;

    // thinking 多轮缺 reasoning_content：补占位后同源再试（修好后再 failover 到第二源才有意义）
    if (isMissingReasoningContentError(err)) {
      const fixedReasoning = ensureReasoningContentOnAssistants(reqBody);
```

</details>

**依据 2 · 源码核查**：[client/electron/local-gateway.js:3399-3407](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L3399-L3407)

候选链与已失效源集合

```text
      fail(_stratScene.scene_name, null); return;
    }
    const routeErrors = [];
    const deadSources = new Set();   // 已发生配额/鉴权级失败(429/401/403)的源，跳过其余模型加速降级
    for (const c of ordered) {
      if (deadSources.has(c.provider.id)) continue;
      {
        const p2pReject = rejectP2pIfUnconfigured(c.provider, res, isResponses);
        if (p2pReject) { lastErr = p2pAbortError(p2pReject); recordError(c.model, callerKey, lastErr, reqPath); return; }
```

**依据 3 · 源码核查**：[client/electron/local-gateway.js:3435-3452](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L3435-L3452)

硬错误冷却和源级跳过

<details>
<summary>查看原文（18行）</summary>

```text
        });
        routeErrors.push({ id: c.provider.id, err }); lastErr = err;
        recordRouteReward(routeReqCtx, c.model, 0);   // 自进化路由：失败 → reward 0（冷却被后验吸收）
        recordProviderFail(c.provider, c.model, err, Date.now() - t0, callerKey, reqPath);
        noteCooldown(c.provider, c.model, err, stratSharer);   // 硬失败(429/401/403/402)记冷却，下次请求下沉此候选
        // 源级失效跳过：仅对「单账号多模型」的直连源有效（如 openai 一个账号下多个 gpt-* 全 429）。
        // p2p 所有模型共享同一 provider.id(tokenbank-p2p) 但各是独立 worker，一个挂不代表其它挂，
        // 绝不能因某个 p2p 模型源级失败就拉黑整个 p2p 池（否则会跳过后面能用的 agnes 等）。
        if (isSourceLevelError(err) && !isP2pProvider(c.provider)) deadSources.add(c.provider.id);
        if (res.headersSent) return;
        await pauseBeforeNextProvider(err);
      }
    }
    lastErr = pickBestRouteError(routeErrors) || lastErr;
    fail(_stratScene.scene_name, null);
    return;
  }

```

</details>

#### 缺口

- 未运行流式故障和协议转换
  **影响**：不能判断模型切换的部分响应或工具调用一致性
  **进一步探讨**：用模拟上游分别在首字节前后失败并核对客户端最终输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置接管失败时能否安全退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先备份并回读 DSH 配置，在隔离目录配临时无敏感凭据。YAML 读取发生解析错误时返回空对象，写入整份序列化 YAML。若原文件损坏或格式不合预期，不能假定原内容保留。凭据写 0600 并尝试 chmod，错误被忽略。取消纳管删除当前和旧网关键，必要时删除空凭据文件，其他字段在可解析时保留。首次成本是接入、账号和备份，持续增加一跳及日志保管；失败恢复以原备份和直连为准，不能只信按钮。使用者应按一次正确请求记录路由时延、复核和实际现金支出。

#### 证据与依据

**依据 1 · 源码核查**：[client/electron/dsh-config.js:24-43](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/dsh-config.js#L24-L43)

解析失败退空与整份写入

<details>
<summary>查看原文（20行）</summary>

```text
function loadYaml(file) {
  const yaml = require('js-yaml');
  try {
    if (!fs.existsSync(file)) return {};
    const doc = yaml.load(fs.readFileSync(file, 'utf8')) || {};
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return {};
    return doc;
  } catch {
    return {};
  }
}

function writeYaml(file, doc, mode) {
  const yaml = require('js-yaml');
  const opts = { encoding: 'utf8' };
  if (mode != null) opts.mode = mode;
  fs.writeFileSync(file, yaml.dump(doc, { lineWidth: 120 }), opts);
  if (mode != null) {
    try { fs.chmodSync(file, mode); } catch { /* ignore */ }
  }
```

</details>

**依据 2 · 源码核查**：[client/electron/dsh-config.js:50-87](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/dsh-config.js#L50-L87)

凭据迁移和删除边界

<details>
<summary>查看原文（38行）</summary>

```text
/** 写独立网关 key，并清掉会与 Codex shell env 撞车的 TOKENBANK_API_KEY */
function writeDshCredentials(dshHome, apiKey) {
  if (!dshHome || !apiKey) return false;
  const file = credPath(dshHome);
  const cred = loadYaml(file);
  let changed = false;
  if (cred[DSH_API_KEY_ENV] !== String(apiKey)) {
    cred[DSH_API_KEY_ENV] = String(apiKey);
    changed = true;
  }
  if (cred[LEGACY_API_KEY_ENV] != null) {
    delete cred[LEGACY_API_KEY_ENV];
    changed = true;
  }
  if (changed) {
    try { fs.mkdirSync(dshHome, { recursive: true }); } catch { /* ignore */ }
    writeYaml(file, cred, 0o600);
  }
  return changed;
}

/** 取消纳管：只删我们写入的网关 key，保留用户其他凭证 */
function revertDshCredentials(dshHome) {
  if (!dshHome) return false;
  const file = credPath(dshHome);
  if (!fs.existsSync(file)) return false;
  const cred = loadYaml(file);
  let changed = false;
  for (const k of [DSH_API_KEY_ENV, LEGACY_API_KEY_ENV]) {
    if (cred[k] != null) { delete cred[k]; changed = true; }
  }
  if (!changed) return false;
  if (Object.keys(cred).length === 0) {
    try { fs.unlinkSync(file); } catch { /* ignore */ }
  } else {
    writeYaml(file, cred, 0o600);
  }
  return true;
```

</details>

**依据 3 · 作者声明**：[README.md:24-33](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/README.md#L24-L33)

作者说明配置热改和协议适配

<details>
<summary>查看原文（10行）</summary>

```text
### Technical Highlights

**Zero-Intrusion Integration**  
Declarative application handlers (CLI env injection + config hot-patching) enable seamless onboarding without modifying agent applications.

**Multi-Protocol Adaptation Layer**  
Transparent protocol conversion (Anthropic Messages, OpenAI Chat, Codex Responses) allows agents to use third-party models without awareness.

**Unified Asset Layer Architecture**  
Community agents run directly on users' existing agent applications (Codex, Claude, Cursor, etc.) without rebuilding harnesses, executing within user-accumulated MCP/Skill/Prompt assets for dual reuse of runtimes and tool ecosystems.
```

</details>

#### 缺口

- 未验证 Windows 权限及真实接管回退
  **影响**：无法承诺凭据和用户注释完全复原
  **进一步探讨**：比较接管前后文件与请求路径，测试格式损坏和停止后的退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么时候增加网关比直连更可靠？

**研究主题**：新假设与验证

#### 完整回答

待验证假设是在主上游首字节前限流时，独立备用上游可提高同一任务完成率。固定模型、等价输出条件和模拟故障，比较 DSH 直连与网关；分别测首字节前后失败、配置恢复、工具语义和尾时延。若成功率未升、流式内容损坏或配置不能完整恢复，就保留直连。限流日志是线索，不是任务完成证据。

#### 证据与依据

**依据 1 · 源码核查**：[client/electron/local-gateway.js:2607-2625](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L2607-L2625)

流开始前后应分层试验

<details>
<summary>查看原文（19行）</summary>

```text
async function callProvider(provider, isAnthropic, streaming, reqPath, body, attemptModel, res, routeMeta = null) {
  const providerId = provider && provider.id;
  // 已学习的 set/strip：首包改写，避免每次先 400 再同源重试
  let reqBody = upstreamHints.applyHints(body, providerId, attemptModel);
  if (reqBody !== body) {
    const desc = upstreamHints.describeMutations(upstreamHints.getMerged(providerId, attemptModel));
    debugLog('上游约束按学习表首包改参', { model: attemptModel, provider: providerId, desc });
    console.log(`[gateway] body-fix (learned) ${desc} model="${attemptModel}" via "${providerId}"`);
  }

  try {
    return await callProviderOnce(provider, isAnthropic, streaming, reqPath, reqBody, attemptModel, res, routeMeta);
  } catch (err) {
    // 响应已开始写出则无法改参重试；429 等硬错误交给外层 cooldown 降级
    if (res && res.headersSent) throw err;

    // thinking 多轮缺 reasoning_content：补占位后同源再试（修好后再 failover 到第二源才有意义）
    if (isMissingReasoningContentError(err)) {
      const fixedReasoning = ensureReasoningContentOnAssistants(reqBody);
```

</details>

**依据 2 · 源码核查**：[client/electron/local-gateway.js:3435-3452](https://github.com/wink-run/tokenbank/blob/fba634c061a04cefe68a0121036d1fd5dcaf509d/client/electron/local-gateway.js#L3435-L3452)

源级降级可作为故障注入观察点

<details>
<summary>查看原文（18行）</summary>

```text
        });
        routeErrors.push({ id: c.provider.id, err }); lastErr = err;
        recordRouteReward(routeReqCtx, c.model, 0);   // 自进化路由：失败 → reward 0（冷却被后验吸收）
        recordProviderFail(c.provider, c.model, err, Date.now() - t0, callerKey, reqPath);
        noteCooldown(c.provider, c.model, err, stratSharer);   // 硬失败(429/401/403/402)记冷却，下次请求下沉此候选
        // 源级失效跳过：仅对「单账号多模型」的直连源有效（如 openai 一个账号下多个 gpt-* 全 429）。
        // p2p 所有模型共享同一 provider.id(tokenbank-p2p) 但各是独立 worker，一个挂不代表其它挂，
        // 绝不能因某个 p2p 模型源级失败就拉黑整个 p2p 池（否则会跳过后面能用的 agnes 等）。
        if (isSourceLevelError(err) && !isP2pProvider(c.provider)) deadSources.add(c.provider.id);
        if (res.headersSent) return;
        await pauseBeforeNextProvider(err);
      }
    }
    lastErr = pickBestRouteError(routeErrors) || lastErr;
    fail(_stratScene.scene_name, null);
    return;
  }

```

</details>

#### 缺口

- 无独立对照
  **影响**：不能给可用性和费用收益
  **进一步探讨**：用模拟上游与同一组 DSH 请求收集指标

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
