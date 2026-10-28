# dsh-integration-settings

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在DSH设置中管理MCP，并预览同步兼容网关的模型清单与思考档位。

> **亮点**：相对手改YAML与上游混合开关，分叉提供模型同步/思考档位职责分离、增删预览和MCP JSON导入，降低操作复杂性的路径明确，收益未测。[Q01](#research-q01)

> **主要限制**：读取/models广告不是每档真实能力验证；非空不完整列表可删模型，定时分两步写，单文件rename也不保证并发与多文件事务。[Q02](#research-q02) [Q03](#research-q03) 同实例写队列不能防另一Host或手工改同一profile，且MCP双文件并非共同事务。

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
  - [Q01 · 分叉相对手工配置与上游提供什么增量？](#detail-section-11)
  - [Q02 · “真正支持思考档位”是如何识别的，清单同步会删除什么？](#detail-section-12)
  - [Q03 · 备份和原子写是否保证配置事务安全？](#detail-section-13)
  - [Q04 · 部署和自动同步的真实负担如何，谁可试用？](#detail-section-14)
  - [Q05 · 什么改进能更可靠地保护配置，如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向本地DSH profile管理员的MCP与网关配置任务；合格交付是目标profile实际可加载，需备份、重启和调用验收。[Q01](#research-q01)

简单基线为文本编辑器手改profile YAML并版本化备份；它少插件依赖但需理解loader语法。本轮未作同任务时间与错误率实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|MCP管理|生成受管patch并导入JSON|重启加载，备份与profile确认|
|模型同步|预览广告清单及思考档位|广告非真实生成验收|
|定时更新|自动同步|可删除模型、两步非事务|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|兼容DSH与目标profile|必需|设置槽位和patch加载|核查版本及徽标|
|可写配置和备份|修改必需|patch/MCP/凭据持久化|停止写入并先备份|
|可访问网关/models及凭据|同步必需|模型广告能力读取|保留旧配置，手动核对|
|管理员恢复能力|试用必需|停调度及回滚|仅观察|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|备份并确认profile|管理员核对目标|拒绝不明profile写入|
|预览MCP/模型差异|管理员确认增删及凭据|取消异常收缩|
|写入重启与真实调用|管理员确认加载和请求|停调度、恢复备份|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|宿主、网关和MCP资源|备份、profile选择、安装重启|成功率和耗时|
|持续|定时网络探测及配置写入|审阅增删与兼容维护|实际调用费用与工时|
|失败恢复|备份存储与重试|停调度、回滚多个文件、重启|并发/中断恢复时间|

#### 效果

|效果项|源码支持|未知|
|---|---|---|
|配置操作可视化|模型增删计划与备份|错误率/节时|
|思考档位同步|解析网关广告字段|真实档位请求兼容|
|配置恢复|文件备份和原子替换|并发与多文件一致性|

> **思考**：读取/models广告不是每档真实能力验证；非空不完整列表可删模型，定时分两步写，单文件rename也不保证并发与多文件事务。[Q02](#research-q02) [Q03](#research-q03) 同实例写队列不能防另一Host或手工改同一profile，且MCP双文件并非共同事务。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手改YAML与上游混合开关，分叉提供模型同步/思考档位职责分离、增删预览和MCP JSON导入，降低操作复杂性的路径明确，收益未测。[Q01](#research-q01)

备份与rename、Host/Origin和写头验证可复用；复用前须补整个文件基线检查、多文件中断策略及真实调用验收，不能把打包库体积计为创新。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

读取/models广告不是每档真实能力验证；非空不完整列表可删模型，定时分两步写，单文件rename也不保证并发与多文件事务。[Q02](#research-q02) [Q03](#research-q03) 同实例写队列不能防另一Host或手工改同一profile，且MCP双文件并非共同事务。

<a id="detail-section-6"></a>

### 1.5 使用建议

有备份与回滚能力的本地单用户profile可隔离试用手动配置；先验收MCP加载与代表模型请求，不先启用自动模型删除。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置计划、备份及写请求边界有源码支持；真实档位、配置成功率及并发恢复未验证；保护策略假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、LOCAL-PATCH.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码级读取打包lib中探测、同步、备份、定时和Origin处理；未逐行审计打包YAML库、全部MCP/凭据/UI代码，未执行。 本轮固定源码可从本地干净checkout取得；当前目录仓库身份/默认分支接口不可取得，不推断仓库删除或新版状态。补读MCP双文件写入与apply序列化。
- 下一步：在备份profile中验证MCP连通、代表模型档位调用、并发手改、非空截断和中断恢复；记录错误率、误删与总时间。

**分析版本**

- **仓库**：[2384418321/dsh-integration-settings](https://github.com/2384418321/dsh-integration-settings)
- **版本号**：0.2.10-dsh.5（[固定提交 b0f3e0c](https://github.com/2384418321/dsh-integration-settings/tree/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是基线文件摘要、延迟删除及代表档位真实请求共同减少配置退化；以截断/虚报/并发/退役对照误删和恢复成本，效果不改善则否定。[Q05](#research-q05)

在备份profile中验证MCP连通、代表模型档位调用、并发手改、非空截断和中断恢复；记录错误率、误删与总时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1405 | — | — | 19231 |
| .js | source | 2 | 9435 | 9024 | 356 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-28），可前往 [GitHub Issues](https://github.com/2384418321/dsh-integration-settings/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：可视化配置能否减少手改负担，模型能力与持久化安全的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 分叉相对手工配置与上游提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是管理多个MCP服务器与兼容网关的DSH桌面用户，交付物是目标profile可加载的配置及可理解的改动预览。README说明两个可视设置页，MCP受管JSON映射patch、网关思考档位与模型列表分离；LOCAL-PATCH明确UI菜单删减与sync/import JSON是本地分叉修改。相对手改YAML，增量是规范化、备份和模型增删预览；相对上游，分叉把思考解锁与模型同步分开并提供JSON批导入。YAML库、DSH loader、供应商模型列表不是本项目原创机制。它降低配置操作负担的路径明确，但没有独立用户错误率/恢复时间比较，不能由设置页数推出业务价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-19](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L9-L19)

作者界定配置职责

<details>
<summary>查看原文（11行）</summary>

```text
给 DeepSeek Harness（DSH）**设置**里补上两个可视化菜单：**MCP 管理** 与 **思考解锁**。后者把平时只能手改文件的事变成点选操作——自动识别每个 OpenAI 兼容网关真正支持的思考档位并写回模型选择器，也能设成定时自动更新。

> **本仓库是本地分叉版**（版本号带 `-dsh.N` 后缀）。与上游的差别见 [LOCAL-PATCH.md](LOCAL-PATCH.md)：
> 上游的 **Skill 管理** 与 **全局人设** 两个菜单已在本分叉移除（相关后端接口仍在，只是没有 UI 入口）；
> **思考档位解锁** 与 **可用模型清单** 已彻底拆成两件事，分别由「思考解锁」开关和独立的「同步模型清单」按钮负责。

| 设置菜单 | 管什么 | 背后落盘位置 |
| --- | --- | --- |
| **MCP 管理** | 增 / 删 / 改 / 启停 MCP 服务器；支持粘贴 `mcpServers` JSON 先预览再新增 | 当前 profile 的 `cordis.patch.yml`（受管区块）+ `.dsh-integration/mcp.json`（真理源） |
| **思考解锁** | 打开即自动识别每个网关真正支持的思考档位，一键解锁写回配置；可新增/编辑网关（不提供删除） | 当前 profile 的 `cordis.patch.yml`（`llm-pi-ai` 条目的 `config.providers`）+ `$DSH_HOME/.credentials.yaml`（`refs`，只存密钥） |
| **同步模型清单** | 独立按钮，与「思考解锁」开关语义分离：先预览「将新增 N 个 / 将移除 M 个」再确认；一次同步同时刷新思考强度等级与可用模型列表，两者同批生效；可与页面「定时更新」绑定同一调度（定时触发自动确认，并在 UI 提示上次差异摘要） | 同上（`config.providers` 的 `levels` 与 `models`）+ `$DSH_HOME/.dsh-integration/unlock-schedule.json`（定时状态与上次同步摘要） |
```

</details>

**依据 2 · 作者声明**：[LOCAL-PATCH.md:21-50](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/LOCAL-PATCH.md#L21-L50)

作者披露本地分叉增量

<details>
<summary>查看原文（30行）</summary>

```text
## 改动二：模型清单同步与思考档位解锁分开（0.2.10-dsh.2，2026-10-21）

**这次改到了 `lib/index.js`（服务端），不只是客户端 bundle。** 原先「全部解锁」一个开关同时表达
"网关支持哪些思考档位"和"这个网关有哪些可用模型"两件事，语义混淆；现在拆开：

- 服务端新增 `syncDigest()` / `planModelSync(raw, gatewayModels)` / `syncProviderModels(env, {...})`
  （`lib/index.js`，"模型清单同步"那一段），以及两个路由：
  - `POST /providers/models/sync-preview` → 只读预览，返回
    `{added,removed,kept,levels:{added,removed,kept},models:{added,removed,kept},levelModels,details,digest}`
  - `POST /providers/models/sync-apply` → 写盘，需 `confirm:true` + `expectedDigests`（或单个 `digest` 字符串）
- 写盘复用原有 `writeWithBackup()`（`.bak-<时间戳>` + 原子替换，保留 3 份）；写前 `validatePatchText()` 校验。
- 抓取失败（`/models` 空数组 / 非 2xx / 全部网关探测失败）→ apply 返回 **502 `error.provider.sync.probe`**，
  配置文件不动；`planModelSync` 另外拒绝生成空模型表。**绝不把模型清单写空。**
- 定时更新 `runScheduledUnlock()` 现在一轮跑两步：`unlockProviderThinking()`（档位）+ `syncProviderModels()`
  （模型清单），自动确认；差异摘要写进 `unlock-schedule.json` 的 `lastResult.sync`，UI 显示「上次差异」。
- 客户端 `Qe`（`integration-providers`）新增 `syncPlan` 状态与「同步模型清单」按钮、预览面板
  （将新增 N / 将移除 M、逐网关明细、档位增减、确认/取消），以及定时卡片里的上次同步差异提示。

## 改动三：MCP 粘贴 JSON 新增 + 界面脱敏（0.2.10-dsh.3，2026-10-21）

**服务端**（`lib/index.js`）：新增 `importMcpJsonServers()` / `parseMcpJsonDocument()` /
`normalizeMcpJsonServer()` / `mcpJsonWarnings()`，路由 `POST /mcp/import-json`。

- 入参 `{json, dryRun?, overwrite?}`；`json` 可以是粘贴字符串或已解析对象。
- 支持 `{"mcpServers":{…}}`、`{名称:配置}`、`{"servers":[…]}` 三种形状。
- `url` → `streamable-http`（`sse`/`http`/`streamableHttp` 归一到它）；`command` → `stdio`；
  只保留 `mcpConfig()` 认识的字段（`args`/`env`/`cwd`/`headers`/超时/`enabled`/`failOnStartupError`）。
- 返回 `{dryRun, wrote, added, updated, skipped, failed[{name,error}], warnings, serverCount, patchFile, mcpFile}`；
  逐条容错，一条都没成功就不落盘；写盘仍走 `writeMcpServers()`（校验 + 备份 + 原子）。
- URL 查询串/headers 里带凭据时进 `warnings`，提示会明文写进 `cordis.patch.yml`。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:9121-9166](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9121-L9166)

JSON导入dryRun和部分条目结果，最终进入MCP双文件写入。

<details>
<summary>查看原文（46行）</summary>

```text
async function importMcpJsonServers(body, env = process.env) {
  const parsed = parseMcpJsonDocument(body && (body.json !== void 0 ? body.json : body.text));
  const dryRun = !!(body && body.dryRun);
  const overwrite = !(body && body.overwrite === false);
  const current = await readMcpState(env);
  const list = current.servers.slice();
  const byName = /* @__PURE__ */ new Map(list.map((s) => [String(s.serverName).toLowerCase(), s]));
  const added = [];
  const updated = [];
  const skipped = [];
  const failed = [];
  const warnings = [];
  for (const name of parsed.names) {
    let server;
    try {
      server = normalizeMcpJsonServer(name, parsed.map[name]);
    } catch (err) {
      failed.push({ name: String(name), error: err && err.message ? err.message : String(err) });
      continue;
    }
    const key = server.serverName.toLowerCase();
    const existing = byName.get(key);
    if (existing) {
      if (!overwrite) {
        skipped.push(server.serverName);
        continue;
      }
      list[list.indexOf(existing)] = server;
      updated.push(server.serverName);
    } else {
      list.push(server);
      added.push(server.serverName);
    }
    byName.set(key, server);
    warnings.push(...mcpJsonWarnings(server));
  }
  if (!added.length && !updated.length) {
    if (!failed.length && !skipped.length) throw httpError(400, "error.mcp.json", "\u6CA1\u6709\u4EFB\u4F55\u670D\u52A1\u5668\u9700\u8981\u5199\u5165");
    return { dryRun, wrote: false, added, updated, skipped, failed, warnings, serverCount: list.length, patchFile: current.patchFile };
  }
  list.sort((a, b) => String(a.serverName).localeCompare(String(b.serverName)));
  if (dryRun) {
    return { dryRun: true, wrote: false, added, updated, skipped, failed, warnings, serverCount: list.length, patchFile: current.patchFile };
  }
  const written = await writeMcpServers(list, env);
  return {
```

</details>

#### 缺口

- 缺少手工配置对照的错误率和完成时间
  **影响**：不能确认配置便利转化为端到端收益
  **进一步探讨**：同一MCP/网关任务对照手工与UI，记录重启、修复与配置正确率

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · “真正支持思考档位”是如何识别的，清单同步会删除什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

probeGateway向baseURL/models发送Bearer凭据，处理超时/非2xx/非JSON/空列表，再由normalizeGatewayModel解析reasoning_supported_efforts、supports_reasoning等元数据。这是网关广告能力的规范化，不是每个档位真实生成请求的能力探测，因此README“真正支持”应收窄为网关声明。planModelSync以网关ID集合为准，现配置缺席的模型进入removed；保留模型合并上下文/输出上限及思考字段，dryRun产生摘要，apply重新探测并可检查expectedDigests，空表和全探测失败拒写。部分成功网关可继续，不能说全部网关一起原子更新。暂时返回非空但不完整列表仍可能移除有效模型；定时调用不带用户预览摘要，自动确认放大该风险。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7962-8014](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7962-L8014)

元数据解析与/models请求

<details>
<summary>查看原文（53行）</summary>

```text
function normalizeGatewayModel(raw) {
  const id = String(raw?.id ?? "").trim();
  if (!id) return null;
  const model = { id, name: String(raw?.name ?? raw?.display_name ?? "").trim() || id };
  const contextWindow = Number(raw?.context_length ?? raw?.context_window);
  if (Number.isFinite(contextWindow) && contextWindow > 0) model.contextWindow = Math.trunc(contextWindow);
  const maxTokens = Number(raw?.max_output_tokens ?? raw?.max_tokens);
  if (Number.isFinite(maxTokens) && maxTokens > 0) model.maxTokens = Math.trunc(maxTokens);
  const input = ["text"];
  if (raw?.supports_images === true || raw?.supports_vision === true) input.push("image");
  model.input = input;
  const levels = Array.isArray(raw?.reasoning_supported_efforts) ? raw.reasoning_supported_efforts.map((v) => String(v ?? "").trim()).filter(Boolean) : [];
  if (raw?.can_disable_thinking === true) levels.unshift("off");
  const efforts = raw?.supports_reasoning === true || levels.length ? buildEffortMap(levels) : null;
  if (efforts) model.reasoningEfforts = efforts;
  const fallback = String(raw?.reasoning_default_effort ?? "").trim();
  if (efforts && fallback && Object.prototype.hasOwnProperty.call(efforts, fallback)) {
    model.reasoning = fallback;
  }
  return model;
}
async function probeGateway({ baseURL, apiKey } = {}, fetchImpl) {
  const doFetch = fetchImpl ?? globalThis.fetch;
  if (typeof doFetch !== "function") throw httpError(500, "error.provider.fetch", "\u5F53\u524D\u8FD0\u884C\u65F6\u4E0D\u652F\u6301 fetch");
  const base = normalizeBaseURL(baseURL);
  const headers = { accept: "application/json" };
  const key = String(apiKey ?? "").trim();
  if (key) headers.authorization = `Bearer ${key}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  let res;
  try {
    res = await doFetch(`${base}/models`, { headers, signal: controller.signal, redirect: "follow" });
  } catch (err) {
    const reason = err?.name === "AbortError" ? `\u8D85\u8FC7 ${PROBE_TIMEOUT_MS / 1e3} \u79D2\u672A\u54CD\u5E94` : String(err?.message ?? err);
    throw httpError(502, "error.provider.probe", `\u8FDE\u63A5\u7F51\u5173\u5931\u8D25\uFF1A${reason}`);
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) {
    const hint = res.status === 401 || res.status === 403 ? "\uFF08API Key \u53EF\u80FD\u4E0D\u6B63\u786E\uFF09" : "";
    throw httpError(502, "error.provider.probe", `\u7F51\u5173 /models \u8FD4\u56DE HTTP ${res.status}${hint}`);
  }
  let payload;
  try {
    payload = await res.json();
  } catch {
    throw httpError(502, "error.provider.probe", "\u7F51\u5173 /models \u8FD4\u56DE\u7684\u4E0D\u662F JSON");
  }
  const rows = Array.isArray(payload?.data) ? payload.data : Array.isArray(payload) ? payload : [];
  const models = rows.map(normalizeGatewayModel).filter(Boolean);
  if (!models.length) throw httpError(502, "error.provider.probe", "\u7F51\u5173\u6CA1\u6709\u8FD4\u56DE\u4EFB\u4F55\u53EF\u7528\u6A21\u578B");
  return { baseURL: base, models };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8528-8568](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8528-L8568)

模型集合增删及字段合并

<details>
<summary>查看原文（41行）</summary>

```text
function planModelSync(raw, gatewayModels) {
  const configured = Array.isArray(raw?.models) ? raw.models : [];
  const gateway = /* @__PURE__ */ new Map();
  for (const row of Array.isArray(gatewayModels) ? gatewayModels : []) {
    const id = String(row?.id ?? "").trim();
    if (id) gateway.set(id, row);
  }
  const configuredById = /* @__PURE__ */ new Map();
  for (const row of configured) {
    const id = String(row?.id ?? "").trim();
    if (id) configuredById.set(id, row);
  }
  const addedIds = [];
  const keptIds = [];
  for (const id of gateway.keys()) {
    if (configuredById.has(id)) keptIds.push(id);
    else addedIds.push(id);
  }
  const removedIds = [...configuredById.keys()].filter((id) => !gateway.has(id));
  const models = [];
  const details = [];
  const levelAdded = /* @__PURE__ */ new Set();
  const levelRemoved = /* @__PURE__ */ new Set();
  const levelKept = /* @__PURE__ */ new Set();
  const levelModels = [];
  for (const id of [...keptIds, ...addedIds]) {
    const gw = gateway.get(id) || {};
    const prev = configuredById.get(id) || null;
    const model = { id, name: String(gw?.name ?? prev?.name ?? "").trim() || id };
    const contextWindow = Number(gw?.contextWindow ?? prev?.contextWindow);
    if (Number.isFinite(contextWindow) && contextWindow > 0) model.contextWindow = Math.trunc(contextWindow);
    const maxTokens = Number(gw?.maxTokens ?? prev?.maxTokens);
    if (Number.isFinite(maxTokens) && maxTokens > 0) model.maxTokens = Math.trunc(maxTokens);
    const kinds = (Array.isArray(gw?.input) ? gw.input : Array.isArray(prev?.input) ? prev.input : ["text"]).map((v) => String(v));
    model.input = kinds.filter((v) => v === "text" || v === "image");
    if (!model.input.length) model.input = ["text"];
    const before = levelKeySet(prev);
    const advertised = levelKeySet(gw);
    const after = advertised || before;
    const efforts = advertised ? declaredEfforts(gw) : prev ? declaredEfforts(prev) : null;
    if (efforts) model.reasoningEfforts = efforts;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8666-8698](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8666-L8698)

预览、摘要检查及持久化

<details>
<summary>查看原文（33行）</summary>

```text
      if (dryRun) {
        results.push({ ...base, status: plan.summary.changed ? "pending" : "current" });
        continue;
      }
      const expected = expectedDigests && typeof expectedDigests === "object" && expectedDigests[id] || (typeof defaultDigest === "string" && defaultDigest.trim() ? defaultDigest.trim() : null);
      if (expected && String(expected) !== plan.digest) {
        results.push({ ...base, status: "stale", error: "预览之后模型清单已变化，请重新预览再确认" });
        continue;
      }
      if (!plan.summary.changed) {
        results.push({ ...base, status: "current" });
        continue;
      }
      const merged = mergeProviderIntoPatch(nextPatch, id, { ...raw, models: plan.models });
      validatePatchText(merged);
      nextPatch = merged;
      results.push({ ...base, status: "synced" });
    } catch (err) {
      const message = err?.message || String(err);
      results.push({ id, verdict: "unreachable", status: "error", reason: `探测失败：${message}`, error: message });
    }
  }
  const probed = results.filter((row) => row.verdict === "gateway").length;
  if (!dryRun && !probed) {
    const detail = results.map((row) => `${row.id}: ${row.error || row.reason || row.status}`).join("；");
    throw httpError(502, "error.provider.sync.probe", `网关探测失败，未写入任何内容（${detail}）`);
  }
  const stale = results.filter((row) => row.status === "stale");
  if (!dryRun && stale.length) {
    throw httpError(409, "error.provider.sync.stale", `模型清单在预览之后发生变化（${stale.map((row) => row.id).join("、")}），请重新预览再确认`);
  }
  const changed = !dryRun && nextPatch !== patchText;
  if (changed) await writeWithBackup(p.patchFile, nextPatch, 384, 3);
```

</details>

#### 缺口

- 网关档位实际生成兼容与非空截断行为未测
  **影响**：不能确认解锁能成功请求或删除合理
  **进一步探讨**：在沙箱网关用有效/虚报档位和非空截断列表验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 备份和原子写是否保证配置事务安全？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

writeFileAtomic先写临时文件再rename并chmod，writeWithBackup保留变更前版本及3份备份，这能降低单文件半写风险。origin门检查loopback/可信Host、跨站Fetch和Origin一致；写操作还要求自定义头及JSON，属于积极边界。不能据此宣称并发事务安全：sync先读取patch和凭据，远端探测后才写patch，expectedDigest检查的是计划摘要，同一apply实例用serialize将写HTTP与定时任务排队；但未见跨进程锁或rename前比较整个文件当前摘要。手工同时修改或其他配置写入存在覆盖风险，需实验确定。配置涉及patch、MCP JSON、credentials和schedule，单文件原子不等于多文件提交/回滚；本轮未审计全部导入写入链和密钥生命周期。 writeMcpServers先写mcp.json再写patch，后一步失败可留下两份不一致；这是具体的多文件中断边界，不把同实例串行说成跨宿主事务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7483-7505](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7483-L7505)

临时文件替换和备份

<details>
<summary>查看原文（23行）</summary>

```text
async function writeFileAtomic(file, text, mode = 384) {
  await ensureDir(path.dirname(file));
  const tmp = `${file}.tmp-${process.pid}-${Date.now()}`;
  await fsp.writeFile(tmp, text, { mode });
  await fsp.rename(tmp, file);
  try {
    await fsp.chmod(file, mode);
  } catch {
  }
}
async function writeWithBackup(file, text, mode = 384, keep = 3) {
  const previous = await readTextFile(file, null);
  if (previous !== null && previous !== text) {
    const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:.]/g, "").slice(0, 17);
    const base = `${file}.bak-${stamp}`;
    let candidate = base;
    for (let index = 1; await fsp.stat(candidate).catch(() => null); index += 1) {
      candidate = `${base}-${index}`;
    }
    await writeFileAtomic(candidate, previous, mode);
    await pruneBackups(file, keep);
  }
  await writeFileAtomic(file, text, mode);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8605-8621](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8605-L8621)

读取基线后进行远端操作

<details>
<summary>查看原文（17行）</summary>

```text
async function syncProviderModels(env = process.env, { providerIds, onlyWorkbuddy = true, dryRun = true, expectedDigests, defaultDigest, source = "manual", fetchImpl } = {}) {
  const p = paths(env);
  const [patchText, credentialsText] = await Promise.all([readTextFile(p.patchFile, ""), readTextFile(p.credentialsFile, "")]);
  const { entryFound, providers } = readProvidersFromPatch(patchText);
  if (!entryFound) {
    throw httpError(404, "error.provider.entry", `这个 profile 的 cordis.patch.yml 里没有 - id: ${PROVIDERS_ENTRY_ID} 条目`);
  }
  let credentialNames = [];
  try {
    credentialNames = readCredentialNames(credentialsText);
  } catch {
    credentialNames = [];
  }
  const wanted = Array.isArray(providerIds) && providerIds.length ? providerIds.map((value) => validateProviderId(value)) : Object.keys(providers);
  let nextPatch = patchText;
  const results = [];
  for (const id of wanted) {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8919-8939](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8919-L8939)

来源及写请求边界

<details>
<summary>查看原文（21行）</summary>

```text
function validateOrigin(ctx, req) {
  const host = String(req.headers.host || "");
  const trusted = trustedHosts(ctx);
  const allowed = isLoopbackHost(host) || trusted.includes(host.toLowerCase()) || trusted.includes(host.toLowerCase().replace(/:\d+$/, ""));
  if (!allowed) throw httpError(403, "error.proto.untrustedHost", "Host \u4E0D\u5728\u53D7\u4FE1\u8303\u56F4\u5185");
  if (String(req.headers["sec-fetch-site"] || "").toLowerCase() === "cross-site") {
    throw httpError(403, "error.proto.crossSite", "\u62D2\u7EDD\u8DE8\u7AD9\u8BF7\u6C42");
  }
  const origin = req.headers.origin;
  if (origin && hostOf(origin) && hostOf(origin) !== host.toLowerCase()) {
    throw httpError(403, "error.proto.badOrigin", "Origin \u4E0E Host \u4E0D\u4E00\u81F4");
  }
}
function validateMutation(req) {
  if (String(req.headers[MUTATION_HEADER] || "") !== "1") {
    throw httpError(403, "error.proto.missingHeader", `\u5199\u64CD\u4F5C\u5FC5\u987B\u643A\u5E26 ${MUTATION_HEADER}: 1`);
  }
  const type = String(req.headers["content-type"] || "");
  if (!type.toLowerCase().includes("application/json")) {
    throw httpError(415, "error.proto.contentType", "\u5199\u64CD\u4F5C\u5FC5\u987B\u4F7F\u7528 application/json");
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:9322-9357](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L9322-L9357)

同一apply实例序列化HTTP变更与定时任务；不提供跨实例锁。

<details>
<summary>查看原文（36行）</summary>

```text
function apply(ctx) {
  setHostContext(ctx);
  let queue = Promise.resolve();
  const serialize = (task) => {
    const next = queue.then(task, task);
    queue = next.catch(() => {
    });
    return next;
  };
  const sweep = () => serialize(() => runScheduledUnlock(process.env)).catch(() => {
  });
  ctx.effect(
    () => {
      const timer = setInterval(() => {
        sweep();
      }, SCHEDULER_TICK_MS);
      if (typeof timer.unref === "function") timer.unref();
      sweep();
      return () => clearInterval(timer);
    },
    `${PLUGIN_NAME}: scheduled thinking unlock`
  );
  ctx.effect(
    () => ctx.webServer.register({
      kind: "prefix",
      path: API_PREFIX,
      handler: (req, res) => {
        const method = req.method || "GET";
        const run = method === "GET" || method === "HEAD" ? handle(ctx, req, res) : serialize(() => handle(ctx, req, res));
        Promise.resolve(run).catch((err) => fail(res, err));
      }
    }),
    `${PLUGIN_NAME}: API route`
  );
}
export {
```

</details>

**依据 5 · 源码核查**：[lib/index.js:7757-7772](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7757-L7772)

MCP JSON先写、patch后写，没有共同提交点。

<details>
<summary>查看原文（16行）</summary>

```text
async function writeMcpServers(servers, env = process.env) {
  const p = paths(env);
  const list = (Array.isArray(servers) ? servers : []).map(validateServer);
  const seen = /* @__PURE__ */ new Set();
  for (const server of list) {
    const key = server.serverName.toLowerCase();
    if (seen.has(key)) throw httpError(400, "error.mcp.duplicate", `serverName \u91CD\u590D\uFF1A${server.serverName}`);
    seen.add(key);
  }
  const patchText = await readTextFile(p.patchFile, "");
  const nextPatch = applyManagedBlock(patchText, renderManagedBlock(list));
  validatePatchText(nextPatch);
  validatePatchText(patchText === nextPatch ? patchText : nextPatch);
  await writeFileAtomic(p.mcpFile, JSON.stringify({ version: 1, servers: list }, null, 2) + "\n", 384);
  await writeWithBackup(p.patchFile, nextPatch, 384, 3);
  return { servers: list, patchFile: p.patchFile, mcpFile: p.mcpFile };
```

</details>

#### 缺口

- 缺少并发写和多文件中断恢复结果
  **影响**：不能确认配置一致性及回滚安全
  **进一步探讨**：同profile并发修改与中途失败后比对全部文件并验证loader

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和自动同步的真实负担如何，谁可试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次应备份profile，确认徽标指向目标环境，再用无敏感数据MCP做预览/写入/重启/连通验收。DSH加载patch需重启，网关需可访问/models和受控凭据；分叉直接维护打包lib，无src重建链增加长期升级成本。持续同步会联网并修改可用模型集合；定时runScheduledUnlock先解锁再sync，分开try/catch，可一项成功一项失败并记录lastError，不能当作单一事务。失败恢复需停定时、查摘要、恢复备份并重新启动，密钥与配置需分别核对。建议有备份/回滚能力的单用户本地profile隔离试用手动功能，先不启用自动模型删除；缺乏恢复能力或共享关键profile者观察。API费用、真实维护工时、失败恢复成本未测，不以无npm发布推断免费。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-29](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L23-L29)

宿主和重启条件

```text
## 环境要求

- **DSH 桌面版 0.2.0-rc.2**（本插件按该版本的 `settings.section` 槽位与 loader patch 机制开发；
  宿主包名从此版本起为 `@deepseek-ai/*`）。
- **Node.js `^22.19.0 || >=24`**：仅在本地构建 / 跑测试时需要；**直接安装不需要 Node**，
  因为仓库里已提交构建产物 `lib/`。
- 安装完成后**必须重启 DSH**：MCP 改动由 loader 在启动时读取（技能、人设改动即时生效）。
```

**依据 2 · 作者声明**：[README.md:89-111](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/README.md#L89-L111)

卸载及回滚说明

<details>
<summary>查看原文（23行）</summary>

````text
## 卸载

```bash
DSH="/Applications/DeepSeek Harness.app/Contents/Resources/runtime/cli/bin/dsh"
"$DSH" plugin --profile desktop remove dsh-integration-settings
```

再从 profile 的 `dsh.profile.bundles` 里删掉本包名，并（可选）清理 profile 的
`cordis.patch.yml` 中 `# >>> dsh-integration-settings:managed:mcp` 到
`# <<< dsh-integration-settings:managed:mcp` 之间的受管区块。

## 故障排查

| 现象 | 原因 / 处理 |
| --- | --- |
| **页面所有接口 404**（`定时更新状态读取失败：请求失败（HTTP 404）`），且插件状态是 `pending` | 宿主 `inject` 声明了**运行时不存在的服务**：cordis 等不到服务，fiber 永远停在 `pending`，`apply()` 不执行 ⇒ 路由根本没注册。0.2.6 及更早版本在 `webRuntime` 被新版 DSH 删除后即触发此问题 | 升级到 **0.2.7 及以上**（`inject` 已收成 `['webServer','sessions']`），然后**完全重启** DSH |
| `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED` | pnpm 11 默认不执行 git 依赖的 `prepare` | 在 profile 的 `pnpm-workspace.yaml` 加 `allowBuilds:` + `  '<包名>': true`，再重跑安装 |
| `sh: npm: command not found` / `spawnSync npx ENOENT` | 该 profile 里有依赖的 `prepare` 要跑 `npm install`，而这台机器没有 npm/npx | 装 Node.js（自带 npm/npx）后重试；细节见 [INSTALL.zh-CN.md](INSTALL.zh-CN.md) 第 7 节 |
| 装完了，设置里没有这两个菜单 | ① 确认 `list` 与 profile `package.json` 的 `dsh.profile.bundles` 里有本包名；② 确认重启的是**同一个** profile；③ 若 bundle 加载失败，DSH 启动时会往 stderr 打 `<bin>: skipping profile bundle "dsh-integration-settings": <原因>` 并静默跳过——常见原因是 `lib/` 缺失（构建产物未随仓库提供）、Node 版本过低或依赖解析失败 |
| 点进菜单一片空白 | `settings.section` 是 root scope 槽位，一旦在条目里调用 seat 上的 session hook（`usePanelInfo` 等）就会触发 `Minified React error #311`，shell 会把整个槽位替换成 `<div data-slot-error="settings.section"></div>`。改客户端代码时请守「root scope 条目不调用任何 seat hook」这条（见下方设计要点） |
| MCP 改了不生效 | profile patch 由 loader **启动时**读取：重启 DSH 后生效（页面上也有提示）。技能、人设改动即时生效 |
| 写操作报 403 / 415 | 宿主路由要求写请求带 `x-dsh-integration: 1` 与 `application/json`；非 loopback / 不可信 Host、`Origin` 与 `Host` 不一致、`Sec-Fetch-Site: cross-site` 一律 403 |
| patch 写坏了想回滚 | 每次写入前都会在 profile 目录留时间戳备份（保留 3 份），改名覆盖回去即可；也可以只删掉两行标记之间的受管区块 |
````

</details>

**依据 3 · 源码核查**：[lib/index.js:8781-8833](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8781-L8833)

定时两步及部分失败记录

<details>
<summary>查看原文（53行）</summary>

```text
async function runScheduledUnlock(env = process.env, { now = Date.now(), fetchImpl, force = false } = {}) {
  const schedule = await readSchedule(env);
  if (!force && !scheduleDue(schedule, now)) {
    return { ran: false, reason: schedule.enabled ? "not-due" : "disabled", schedule };
  }
  let report = null;
  let sync = null;
  let lastError = "";
  try {
    report = await unlockProviderThinking(env, { onlyWorkbuddy: schedule.onlyWorkbuddy, fetchImpl });
  } catch (err) {
    lastError = err?.message || String(err);
  }
  try {
    sync = await syncProviderModels(env, {
      onlyWorkbuddy: schedule.onlyWorkbuddy,
      dryRun: false,
      source: "schedule",
      fetchImpl
    });
  } catch (err) {
    const message = err?.message || String(err);
    lastError = lastError ? `${lastError}；${message}` : message;
  }
  const syncSummary = sync ? {
    changed: !!sync.changed,
    addedModels: sync.totals.added,
    removedModels: sync.totals.removed,
    keptModels: sync.totals.kept,
    levelModels: sync.totals.levelModels,
    syncedProviders: sync.syncedProviders,
    addedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.added || [])).slice(0, 40),
    removedIds: (sync.providers || []).flatMap((row) => (row.summary?.models?.removed || [])).slice(0, 40),
    addedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.added || [])))],
    removedLevels: [...new Set((sync.providers || []).flatMap((row) => (row.summary?.levels?.removed || [])))],
    failedProviders: sync.failedProviders
  } : null;
  const failed = [...new Set([
    ...((report?.providers || []).filter((row) => row.status === "error").map((row) => row.id)),
    ...((sync?.providers || []).filter((row) => row.status === "error").map((row) => row.id))
  ])];
  const next = normalizeSchedule({
    ...schedule,
    lastRunAt: now,
    nextRunAt: now + schedule.intervalMinutes * 6e4,
    lastError,
    lastResult: report || sync ? {
      changed: !!report?.changed || !!(sync && sync.changed),
      unlockedModels: report?.unlockedModels || 0,
      unlockedProviders: report?.unlockedProviders || [],
      failedProviders: failed,
      sync: syncSummary
    } : null,
```

</details>

#### 缺口

- 实际配置成功率和总恢复时间未知
  **影响**：采用收益不能量化
  **进一步探讨**：用备份profile完成安装、MCP加载、模型调用及恢复计时

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进能更可靠地保护配置，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是给同步增加基线文件摘要与“只加不删/连续多次缺席再删除”策略，并对代表档位做最小真实请求后标记verified，可减少临时模型列表收缩与广告字段错误造成的配置退化。推导来自/models元数据、removed集合和非事务定时两步。新增代价是历史状态、探测调用/费用、并发冲突处理与保留退役模型。最小验证使用非空截断、字段虚报、并发手改、真正退役四种网关响应，对照当前手动/定时模式，检查有效模型误删、错误档位、配置损坏、请求成本和恢复时间；若误删不降或长期保留错误模型使代价更高则否定。需要真实管理员任务与匿名配置样例后再判断独立插件机会。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:7973-7979](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L7973-L7979)

广告档位构成验证假设依据

```text
  const levels = Array.isArray(raw?.reasoning_supported_efforts) ? raw.reasoning_supported_efforts.map((v) => String(v ?? "").trim()).filter(Boolean) : [];
  if (raw?.can_disable_thinking === true) levels.unshift("off");
  const efforts = raw?.supports_reasoning === true || levels.length ? buildEffortMap(levels) : null;
  if (efforts) model.reasoningEfforts = efforts;
  const fallback = String(raw?.reasoning_default_effort ?? "").trim();
  if (efforts && fallback && Object.prototype.hasOwnProperty.call(efforts, fallback)) {
    model.reasoning = fallback;
```

**依据 2 · 源码核查**：[lib/index.js:8540-8546](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8540-L8546)

缺席直接列入删除

```text
  const addedIds = [];
  const keptIds = [];
  for (const id of gateway.keys()) {
    if (configuredById.has(id)) keptIds.push(id);
    else addedIds.push(id);
  }
  const removedIds = [...configuredById.keys()].filter((id) => !gateway.has(id));
```

**依据 3 · 源码核查**：[lib/index.js:8794-8803](https://github.com/2384418321/dsh-integration-settings/blob/b0f3e0c129a45f8431cd0db7dda9db634ff13aa4/lib/index.js#L8794-L8803)

定时不携带预览摘要

<details>
<summary>查看原文（10行）</summary>

```text
  try {
    sync = await syncProviderModels(env, {
      onlyWorkbuddy: schedule.onlyWorkbuddy,
      dryRun: false,
      source: "schedule",
      fetchImpl
    });
  } catch (err) {
    const message = err?.message || String(err);
    lastError = lastError ? `${lastError}；${message}` : message;
```

</details>

#### 缺口

- 保护策略及真实档位请求没有对照结果
  **影响**：尚不能作为已实现贡献或已确认需求
  **进一步探讨**：按本题四类响应与真实匿名任务做对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
