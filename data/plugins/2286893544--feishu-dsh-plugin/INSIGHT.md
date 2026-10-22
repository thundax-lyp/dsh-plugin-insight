# feishu-dsh-plugin

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[8cb7f88](https://github.com/2286893544/feishu-dsh-plugin/tree/8cb7f88b0eed0b8c59932e381f52f096c7e56df9)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/2286893544/feishu-dsh-plugin)
<!-- END META -->

> **实现功能**：通过自建飞书应用为 DSH 提供 IM、文档、Bitable、Sheets 和权限工具的集成插件。

> **核心亮点**：把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](#research-q01)。

> **风险与缺陷**：创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 25个飞书工具和 bundled Skill 解决何种任务？](#detail-section-11)
  - [Q02 · 凭据、连接检测和 REST 请求怎样工作？](#detail-section-12)
  - [Q03 · 创建后自动授权能保证人类完整控制吗？](#detail-section-13)
  - [Q04 · 图片输入与写操作暴露什么额外边界？](#detail-section-14)
  - [Q05 · 如何逐级采用并计算运行成本？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：企业自建飞书应用下的 Agent 读取与编辑协作资产；需 scopes 和对象授权。详见[Q01](#research-q01)。

飞书官方界面/SDK 可以显式管理授权和对象；插件减少跨资源调用编排，但需保持人工审核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| IM/文档/表格 | 读写协作资产 | scopes/对象授权 |
| 自动授权 | 人类接管新文档 | 失败不回滚 |
| 图片接入 | 路径/URL/base64 | 输入范围需宿主保护 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/skills | 必需 | Agent 入口 | 无工具 |
| 飞书自建应用凭据 | 必需 | 租户 token | 请求失败 |
| 业务 scopes/对象授权 | 必需 | 各资源访问 | 局部失败 |
| settings/webServer | 可选 | 配置/测试页 | profile/env 兜底 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 申请最小 scopes、设凭据 | test-connection 识别租户 |
| 读取 | 测试群/文档 | 确认权限 |
| 写入 | 测试文档/表格 | 人类账户复核 |
| 扩用 | 按工具分级授权 | 记录失败与补救 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 接入 | 飞书自建应用/DSH | 申请 scopes/分享对象 | 周期未知 |
| 调用 | 飞书 API 请求/限额 | 核输入与写入结果 | 费用/成功率未知 |
| 恢复 | 重试/补权限 | 人类核链接与授权 | 多步操作非原子 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 25工具 | 注册与 REST 封装 | 目标 scopes 可用 |
| 自动授权 | 尝试 full_access | 人类一定能打开 |
| 图片接入 | 路径/URL/base64 | 安全边界充分 |

> **思考**：创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](#research-q01)。

把多种飞书资源统一为 Agent 工具，含创建 wiki 文档与人类接管授权路径。详见[Q01](#research-q01)。

token 缓存/热更新/返回文本有参考性；自动授权失败和外部输入边界需显式化。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

创建成功不保证 grantOpenId 已获 full_access；图片 URL/本地路径缺约束，写操作需明确用户授权。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

按测试租户只读→写入→权限操作分级试用，所有发送/修改/分享需按用户范围授权。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持注册/REST 管线；创建后自动授权可失败但创建保留，图片读取范围和连接路由依赖宿主保护；目标租户未测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/client.js、lib/settings.js、lib/routes.js、assets/feishu.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、lib/index.js、lib/client.js、lib/settings.js、lib/routes.js、包声明；未连接飞书或调用目标工具。旧 META 仅复用。
- 下一步：目标测试租户测 scopes、grant 失败、人类访问、wiki 追加失败、图片 URL/文件边界、token 重试。

**分析版本**

- **仓库**：[2286893544/feishu-dsh-plugin](https://github.com/2286893544/feishu-dsh-plugin)
- **版本号**：0.1.0（[固定提交 8cb7f88](https://github.com/2286893544/feishu-dsh-plugin/tree/8cb7f88b0eed0b8c59932e381f52f096c7e56df9)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进为创建/授权事务化状态、图片 allowlist/限量、写操作幂等与连接路由鉴权加强。详见[Q05](#research-q05)。

目标测试租户测 scopes、grant 失败、人类访问、wiki 追加失败、图片 URL/文件边界、token 重试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 178 | — | — | 1931 |
| .js | source | 6 | 1784 | 1492 | 159 | — |
| .mjs | source | 3 | 526 | 463 | 27 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2286893544/feishu-dsh-plugin/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**飞书工具集能否在身份权限、写入后授权和外部输入边界下可靠工作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 25个飞书工具和 bundled Skill 解决何种任务？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件把自建企业飞书应用的 IM、云文档/知识库、Bitable、Sheets v2 及权限操作暴露为25个 feishu_* Agent 工具，另注册可显式/模型调用的 feishu Skill。使用者可在 DSH 会话中查群消息、生成/编辑文档和表格、管理分享。前提是应用已发布相应 scopes、机器人加入目标群/文档有授权；工具包含发送、删除、写表、改权限等外部副作用，必须按用户实际授权使用。固定源码只证注册/调用路径，未证目标租户能完成全部操作。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-6](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L3-L6)

作者25工具覆盖

```text
Feishu (Lark) tools for DeepSeek Harness: **25 `feishu_*` tools** covering chat
messages, cloud documents (including images, generated charts and tables),
bitable records, spreadsheet ranges and drive permissions — through your own
enterprise self-built Feishu app. Pure Node, no external dependencies, no Python.
```

**依据 2 · 作者声明**：[README.md:45-67](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L45-L67)

工具分组和 Skill

<details>
<summary>查看原文（23行）</summary>

```text
## Tools (25)

**Chat & messages** — `feishu_list_chats`, `feishu_list_chat_members`,
`feishu_send_text`, `feishu_send_post_message`, `feishu_read_chat_history`,
`feishu_recall_message`

**Documents (docx)** — `feishu_create_document`, `feishu_read_document`,
`feishu_read_document_blocks`, `feishu_append_document_blocks`,
`feishu_update_document_block`, `feishu_delete_document_block`,
`feishu_insert_table_into_document`, `feishu_insert_image_into_document`,
`feishu_insert_chart_into_document`, `feishu_resolve_wiki_node`

**Bitable** — `feishu_create_bitable`, `feishu_list_bitable_tables`,
`feishu_list_bitable_fields`, `feishu_write_bitable_record`,
`feishu_read_bitable_records`

**Sheets (classic v2 range API)** — `feishu_read_sheet_range`,
`feishu_write_sheet_range`

**Permissions** — `feishu_grant_document_access`,
`feishu_set_document_link_sharing`

A bundled `feishu` skill documents the workflows and known limits for the agent.
```

</details>

**依据 3 · 作者声明**：[README.md:79-86](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L79-L86)

飞书权限前提

```text
## Prerequisites (Feishu side)

- Enterprise self-built app with the bot enabled.
- Published scopes for reading chat history (`im:message.group_msg` …), docx
  read/write, bitable, sheets and drive permission management; the bot must be a
  member of the target chats, and documents the app must read must be shared
  with it.
- Credentials stay local; never share `appSecret` in chat or documents.
```

**依据 4 · 源码核查**：[lib/index.js:35-66](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L35-L66)

Skill provider

<details>
<summary>查看原文（32行）</summary>

```text
// ---------- bundled skill ----------
const SKILL_NAME = "feishu";
const ASSET_DIR_URL = new URL("../assets/", import.meta.url);
const SKILL_BODY_URL = new URL("../assets/feishu.md", import.meta.url);
const RESOURCE_BASE = { kind: "directory", path: fileURLToPath(ASSET_DIR_URL) };

const skillCandidate = {
  name: SKILL_NAME,
  description:
    "Operate Feishu (Lark) through the configured self-built app: send text or rich-text messages, read chat history and members, recall messages, create/read/edit documents (including tables, images and generated charts), manage bitable records, and read or write spreadsheet ranges. Use whenever the user asks to work with their Feishu docs, chat records, multi-dimensional tables or spreadsheets.",
  invocation: { modelInvocable: true, userInvocable: true },
  provider: "feishu-bridge",
  source: "bundled",
  resourceBase: RESOURCE_BASE,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_BODY_URL,
};

const skillProvider = {
  name: "feishu-bridge",
  list: () => Promise.resolve([skillCandidate]),
  async get(_candidate) {
    return {
      name: skillCandidate.name,
      description: skillCandidate.description,
      invocation: skillCandidate.invocation,
      provider: skillCandidate.provider,
      source: skillCandidate.source,
      resourceBase: RESOURCE_BASE,
      content: await readFile(SKILL_BODY_URL, "utf8"),
    };
  },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:576-592](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L576-L592)

工具注册

<details>
<summary>查看原文（17行）</summary>

```text
function apply(ctx, config = {}) {
  const resolved = resolveConfiguration(config);
  const client = new FeishuClient(resolved);
  // The settings card writes into this namespace; each change lands on the live
  // credentials object and is pushed straight into the REST client, so a saved
  // edit takes effect without a restart.
  installFeishuSettings(ctx, resolved, () => client.updateCredentials(resolved));
  for (const tool of toolsOf(client, resolved)) ctx.tools.register(tool);
  ctx.skills.registerProvider(() => skillProvider);

  // HTTP route behind the settings page's "test connection" button.
  ctx.inject(["webServer"], (host) => {
    host.effect?.(
      () => mountFeishuRoutes(host, { testConnection: () => testConnection(client, resolved, config) }),
      "feishu-bridge: test-connection route",
    );
  });
```

</details>

#### 缺口

- 目标飞书应用 scopes/租户授权未测
  **影响：**不能把静态工具注册当服务可用
  **进一步探讨：**目标租户逐能力最小权限验收

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据、连接检测和 REST 请求怎样工作？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

配置可来自 profile/环境，并由 settings namespace 实时写回 resolved 与 FeishuClient；appSecret 标为 secret，页面读时按宿主服务脱敏。Client 以 app_id/app_secret 换租户 token，缓存至到期前60秒，REST 请求30秒超时，对指定失效码清 token 重试一次。test-connection POST 限同源并返回应用/租户事实与掩码指纹；无 Origin 的请求只要求 Host，因此该检查不是插件独立身份认证，仍依赖宿主路由权限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:25-33](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L25-L33)

secret 配置与其他字段

```text
export const Config = z.object({
  appId: z.string().description("Feishu app ID of your self-built app (cli_...)."),
  appSecret: z.string().role("secret").description("Feishu app secret. Stored in the local profile and masked in the UI."),
  tenantDomain: z.string().description("Optional tenant domain such as acme.feishu.cn; auto-detected from the tenant API when omitted."),
  defaultChatId: z.string().description("Optional default chat_id (oc_...) used by chat tools when the call omits chat_id."),
  grantOpenId: z.string().description("Optional open_id (ou_...) granted full_access on every document/bitable this plugin creates, so the human operating the bot stays in full control of what the bot makes."),
  wikiSpaceId: z.string().description("Optional knowledge-base space id (digits). When set, feishu_create_document creates documents inside this knowledge base and returns a /wiki/ link."),
  wikiParentNodeToken: z.string().description("Optional knowledge-base node token used as the default parent for new wiki documents; empty means the knowledge-base root."),
});
```

**依据 2 · 源码核查**：[lib/settings.js:47-73](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/settings.js#L47-L73)

配置热更新

<details>
<summary>查看原文（27行）</summary>

```text
export function installFeishuSettings(ctx, resolved, onChange = () => {}) {
  const entry = {};
  for (const field of SETTINGS_FIELDS) entry[field] = resolved[field] ?? "";
  let source = () => entry;

  const apply = () => {
    const value = source() || {};
    for (const field of SETTINGS_FIELDS) {
      const next = value[field];
      if (typeof next === "string" && next !== resolved[field]) resolved[field] = next;
    }
    onChange();
  };

  // `inject` is the graceful-degradation boundary: on a host without a settings
  // service the callback never runs and the composed configuration stands.
  ctx.inject(["settings"], (scoped) => {
    const scope = scoped.settings.register(SETTINGS_NS, FeishuSettings, { base: entry });
    source = () => scope.get();
    scoped.effect(() => () => {
      source = () => entry;
      apply();
    });
    apply();
    scope.watch(apply);
  });
}
```

</details>

**依据 3 · 源码核查**：[lib/client.js:52-105](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/client.js#L52-L105)

token/REST/重试

<details>
<summary>查看原文（54行）</summary>

```text
  // ---------- transport ----------
  async _token() {
    if (this.token && Date.now() < this.tokenExpiresAt) return this.token;
    if (!this.appId || !this.appSecret) {
      throw new Error(
        "feishu-bridge is not configured: set appId and appSecret in " +
        "Settings → Plugins → Plugin configuration (or provide FEISHU_APP_ID / FEISHU_APP_SECRET)."
      );
    }
    const data = await this._request("POST", "/open-apis/auth/v3/tenant_access_token/internal", {
      app_id: this.appId,
      app_secret: this.appSecret,
    }, { auth: false });
    if (data.code !== 0) throw new FeishuError(data.code, data.msg || "token exchange failed", data);
    this.token = data.tenant_access_token;
    this.tokenExpiresAt = Date.now() + (Number(data.expire) || 7200) * 1000 - TOKEN_EXPIRY_BUFFER_MS;
    return this.token;
  }

  async _request(method, path, body, { auth = true } = {}) {
    const headers = { "Content-Type": "application/json; charset=utf-8" };
    if (auth) headers.Authorization = `Bearer ${await this._token()}`;
    const init = { method, headers, signal: AbortSignal.timeout(this.timeoutMs) };
    if (body !== undefined) init.body = JSON.stringify(body);
    let res;
    try {
      res = await fetch(BASE_URL + path, init);
    } catch (err) {
      throw new Error(`network error calling ${path}: ${err.message}`);
    }
    const text = await res.text();
    let parsed = {};
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(`unexpected response from ${path}: ${text.slice(0, 200)}`);
      }
    }
    if (!res.ok && parsed.code === undefined) {
      throw new Error(`HTTP ${res.status} from ${path}: ${text.slice(0, 200)}`);
    }
    return parsed;
  }

  async _api(method, path, body) {
    let data = await this._request(method, path, body);
    if ([99991663, 99991664, 99991668].includes(data.code)) {
      this.token = null;
      this.tokenExpiresAt = 0;
      data = await this._request(method, path, body);
    }
    if (data.code !== 0) throw new FeishuError(data.code, data.msg || "request failed", data);
    return data.data !== undefined ? data.data : data;
```

</details>

**依据 4 · 源码核查**：[lib/routes.js:19-70](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/routes.js#L19-L70)

连接检测方法和来源校验

<details>
<summary>查看原文（52行）</summary>

```text
/** Same-origin check: the route must not be reachable from another page. */
export function isSameOrigin(request) {
  const origin = request.headers?.origin;
  if (typeof origin !== "string" || origin.length === 0) {
    // Non-browser clients (curl) have no Origin; Host must still be present.
    return typeof request.headers?.host === "string";
  }
  try {
    return new URL(origin).host === request.headers?.host;
  } catch {
    return false;
  }
}

/** Masked fingerprint: enough to recognize a key, not enough to use it. */
export function fingerprint(secret) {
  if (typeof secret !== "string" || secret.length === 0) return null;
  if (secret.length <= 8) return `${"*".repeat(secret.length)} (len ${secret.length})`;
  return `${secret.slice(0, 4)}…${secret.slice(-3)} (len ${secret.length})`;
}

export const TEST_CONNECTION_PATH = "/dsh-plugin-feishu/test-connection";

/**
 * Mount the route.
 * @param host - host context exposing `webServer` (and optionally `effect`).
 * @param deps - `testConnection()` returning the non-secret report.
 * @returns disposer removing the route.
 */
export function mountFeishuRoutes(host, { testConnection }) {
  const dispose = host.webServer.register({
    kind: "exact",
    path: TEST_CONNECTION_PATH,
    handler: async (request, response) => {
      if (request.method !== "POST") {
        response.writeHead(405, { allow: "POST" });
        response.end();
        return;
      }
      if (!isSameOrigin(request)) {
        sendJson(response, 403, { ok: false, error: "cross-origin request refused" });
        return;
      }
      try {
        const report = await testConnection();
        sendJson(response, 200, { ok: true, ...report });
      } catch (err) {
        sendJson(response, 200, {
          ok: false,
          error: err?.message ?? String(err),
          ...(err?.code === undefined ? {} : { code: err.code }),
        });
```

</details>

#### 缺口

- 宿主 settings 与 Web 路由真实权限模型未核
  **影响：**凭据/连接检查的访问边界不能由 same-origin 单独保证
  **进一步探讨：**目标宿主检查未授权调用及租户 token 生命周期

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 创建后自动授权能保证人类完整控制吗？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

创建 docx/wiki/bitable 后如配 grantOpenId，会尝试给予指定人 full_access；但 autoGrantOwner 捕获失败并把“auto-grant failed”拼回文本，创建已经成功且不回滚。用户若只看到 created 链接就误以为有访问权，会产生机器可见、人类不可见的资产。wiki 创建还有先创建节点、后追加段落的多步路径，后步失败时可能留下空节点。可靠流程需核返回 grant 结果及由人类账户打开文档，失败时补授权而非再创建。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-31](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L23-L31)

作者自动授权语义

```text
| Field | Meaning |
|---|---|
| `appId` | Feishu app ID of your self-built app (`cli_...`) |
| `appSecret` | Feishu app secret — declared `role("secret")`, so it is redacted from every page read and shown as a password control that starts blank |
| `tenantDomain` | Optional (`acme.feishu.cn`); auto-detected from the tenant API when empty |
| `defaultChatId` | Optional (`oc_...`) used by the chat tools when a call omits `chat_id` |
| `grantOpenId` | Optional (`ou_...`) — every document/bitable the plugin creates is shared with this user (`full_access`), so the person operating the bot keeps control of what the bot made |
| `wikiSpaceId` | Optional knowledge-base space id; when set, new documents are created **inside that knowledge base** and the returned URL is a `/wiki/` link |
| `wikiParentNodeToken` | Optional default parent node for new wiki documents (empty means the knowledge-base root) |
```

**依据 2 · 源码核查**：[lib/index.js:121-136](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L121-L136)

授权失败捕获

<details>
<summary>查看原文（16行）</summary>

```text
// ---------- tools ----------
/**
 * Give the configured human full control over anything the bot creates.
 * Feishu keeps app-created documents in the app's own space and records the app
 * identity as the owner, so without this the person operating the bot is merely
 * "someone holding a link". A failed grant must never break doc creation.
 */
async function autoGrantOwner(client, config, token, type) {
  const openId = (config?.grantOpenId ?? "").trim();
  if (!openId) return "";
  try {
    await client.grantAccess(token, type, openId, "full_access");
    return `  granted full_access to ${openId}`;
  } catch (error) {
    return `  auto-grant failed: ${error?.message ?? String(error)}`;
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:229-254](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L229-L254)

创建后授权返回

<details>
<summary>查看原文（26行）</summary>

```text
    // ----- documents -----
    tool({
      name: "feishu_create_document",
      description: "Create a new Feishu document (docx) with a title and optional plain-text paragraphs. When a knowledge-base space is configured, the document is created INSIDE that knowledge base and the returned url is a /wiki/ link; pass standalone=true to create a plain document in the app cloud space instead.",
      parameters: {
        title: { type: "string", required: true, description: "Document title." },
        paragraphs: {
          type: "array",
          items: { type: "string" },
          description: "Optional plain-text paragraphs to write into the document.",
        },
        parent_node_token: { type: "string", description: "Optional knowledge-base node token to create the document under; defaults to the configured wikiParentNodeToken." },
        standalone: { type: "boolean", description: "Create a plain document in the app own cloud space instead of the knowledge base." },
      },
    }, async (args) => {
      const spaceId = (config?.wikiSpaceId ?? "").trim();
      if (spaceId && !args.standalone) {
        const parent = (args.parent_node_token ?? config?.wikiParentNodeToken ?? "").trim();
        const doc = await client.createWikiDocument(spaceId, args.title, args.paragraphs || [], parent);
        const grant = await autoGrantOwner(client, config, doc.document_id, "docx");
        return `created wiki document_id=${doc.document_id}  node_token=${doc.node_token}${doc.url ? `  url=${doc.url}` : ""}${grant}`;
      }
      const doc = await client.createDocument(args.title, args.paragraphs || []);
      const grant = await autoGrantOwner(client, config, doc.document_id, "docx");
      return `created document_id=${doc.document_id}${doc.url ? `  url=${doc.url}` : ""}${grant}`;
    }),
```

</details>

**依据 4 · 源码核查**：[lib/client.js:175-194](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/client.js#L175-L194)

wiki 节点创建与追加非原子

<details>
<summary>查看原文（20行）</summary>

```text
  /**
   * Create a docx inside a knowledge space.
   * `obj_token` is the document id every other docx call needs; `node_token` is
   * the segment that appears in the /wiki/ URL the user sees.
   */
  async createWikiDocument(spaceId, title, paragraphs = [], parentNodeToken = "") {
    const body = { obj_type: "docx", node_type: "origin", title };
    if (parentNodeToken) body.parent_node_token = parentNodeToken;
    const data = await this._api("POST", `/open-apis/wiki/v2/spaces/${encodeURIComponent(spaceId)}/nodes`, body);
    const node = data?.node ?? {};
    const documentId = assertString(node.obj_token, "obj_token");
    if (paragraphs.length > 0) {
      await this.appendBlocks(documentId, paragraphs.map((p) => ({ kind: "text", text: p })));
    }
    return {
      document_id: documentId,
      node_token: node.node_token,
      space_id: spaceId,
      url: await this.wikiUrl(node.node_token),
    };
```

</details>

#### 缺口

- 目标飞书 grant scope/文档实际共享未测
  **影响：**孤立或半成品文档及重复创建风险
  **进一步探讨：**目标测试故意撤 grant 权限并核人类可访问性

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 图片输入与写操作暴露什么额外边界？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

插图工具输入可读本地 image_path，或由 host fetch 任意 image_url（60秒），或接收 base64，再上传到飞书；从源码看 image_url 没有限制目标 host、协议或响应大小，本地路径也未限定目录。工具还可发送/撤回消息、修改文档/表格与链接分享，效果受飞书权限约束，但模型拿到工具时需要额外操作授权。若输入来自不可信内容，须在宿主层限制文件/网络可达范围与工具批准，不应仅凭应用 scopes 授权。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:102-119](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L102-L119)

本地路径/URL/base64读取

<details>
<summary>查看原文（18行）</summary>

```text
async function loadImageBytes({ image_path, image_url, image_base64 }) {
  if (image_path) {
    const buffer = await readFile(image_path);
    return { buffer, filename: path.basename(image_path) };
  }
  if (image_url) {
    const res = await fetch(image_url, { signal: AbortSignal.timeout(60_000) });
    if (!res.ok) throw new Error(`failed to download image: HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const name = path.basename(new URL(image_url).pathname) || "image.png";
    return { buffer, filename: name };
  }
  if (image_base64) {
    const cleaned = image_base64.replace(/^data:[^;]+;base64,/, "");
    return { buffer: Buffer.from(cleaned, "base64"), filename: "image.png" };
  }
  throw new Error("provide one of image_path, image_url or image_base64");
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:173-226](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L173-L226)

发送与撤回工具

<details>
<summary>查看原文（54行）</summary>

```text
    tool({
      name: "feishu_send_text",
      description: "Send a plain-text message to a Feishu chat (group or p2p) as the configured bot.",
      parameters: {
        chat_id: { type: "string", description: "The Feishu chat_id (oc_...) to send to; defaults to the configured defaultChatId." },
        text: { type: "string", required: true, description: "The message text to send." },
      },
    }, async (args) => {
      const sent = await client.sendText(chatId(args.chat_id), args.text);
      return `sent message_id=${sent.message_id} create_time=${fmtTime(sent.create_time)}`;
    }),

    tool({
      name: "feishu_send_post_message",
      description: "Send a rich-text (post) message with an optional title and multi-line body to a Feishu chat. Full-width colons and emoji are fine; the body is sent as plain text paragraphs.",
      parameters: {
        chat_id: { type: "string", description: "The Feishu chat_id (oc_...); defaults to the configured defaultChatId." },
        title: { type: "string", description: "Optional message title." },
        lines: {
          type: "array",
          items: { type: "string" },
          description: "Body lines, each rendered as its own paragraph.",
        },
      },
    }, async (args) => {
      const sent = await client.sendPost(chatId(args.chat_id), args.title, args.lines || []);
      return `sent post message_id=${sent.message_id} create_time=${fmtTime(sent.create_time)}`;
    }),

    tool({
      name: "feishu_read_chat_history",
      description: "Read recent messages of a Feishu chat the bot is in, in chronological order. Requires the app scope for reading group history.",
      parameters: {
        chat_id: { type: "string", description: "The Feishu chat_id (oc_...); defaults to the configured defaultChatId." },
        limit: { type: "number", description: "How many of the most recent messages to return (default 30, max 100)." },
      },
    }, async (args) => {
      const messages = await client.readChatHistory(chatId(args.chat_id), args.limit);
      return messages.length === 0
        ? "(no messages)"
        : messages
            .map((m) => `[${fmtTime(m.create_time)}] ${m.sender_type || "unknown"} <${m.msg_type}>: ${m.text}`)
            .join("\n");
    }),

    tool({
      name: "feishu_recall_message",
      description: "Recall (withdraw) a message the bot has sent. Only messages sent by this bot can be recalled.",
      parameters: {
        message_id: { type: "string", required: true, description: "The message_id (om_...) returned when the bot sent the message." },
      },
    }, async (args) => {
      const done = await client.recallMessage(args.message_id);
      return `recalled message_id=${done.message_id}`;
```

</details>

**依据 3 · 作者声明**：[README.md:51-65](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L51-L65)

文档/表格/分享工具

<details>
<summary>查看原文（15行）</summary>

```text
**Documents (docx)** — `feishu_create_document`, `feishu_read_document`,
`feishu_read_document_blocks`, `feishu_append_document_blocks`,
`feishu_update_document_block`, `feishu_delete_document_block`,
`feishu_insert_table_into_document`, `feishu_insert_image_into_document`,
`feishu_insert_chart_into_document`, `feishu_resolve_wiki_node`

**Bitable** — `feishu_create_bitable`, `feishu_list_bitable_tables`,
`feishu_list_bitable_fields`, `feishu_write_bitable_record`,
`feishu_read_bitable_records`

**Sheets (classic v2 range API)** — `feishu_read_sheet_range`,
`feishu_write_sheet_range`

**Permissions** — `feishu_grant_document_access`,
`feishu_set_document_link_sharing`
```

</details>

**依据 4 · 源码核查**：[lib/client.js:71-94](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/client.js#L71-L94)

REST 请求边界

<details>
<summary>查看原文（24行）</summary>

```text
  async _request(method, path, body, { auth = true } = {}) {
    const headers = { "Content-Type": "application/json; charset=utf-8" };
    if (auth) headers.Authorization = `Bearer ${await this._token()}`;
    const init = { method, headers, signal: AbortSignal.timeout(this.timeoutMs) };
    if (body !== undefined) init.body = JSON.stringify(body);
    let res;
    try {
      res = await fetch(BASE_URL + path, init);
    } catch (err) {
      throw new Error(`network error calling ${path}: ${err.message}`);
    }
    const text = await res.text();
    let parsed = {};
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error(`unexpected response from ${path}: ${text.slice(0, 200)}`);
      }
    }
    if (!res.ok && parsed.code === undefined) {
      throw new Error(`HTTP ${res.status} from ${path}: ${text.slice(0, 200)}`);
    }
    return parsed;
```

</details>

#### 缺口

- 宿主工具批准和网络沙箱策略未知
  **影响：**可能读取本地材料或请求不期望地址并外传
  **进一步探讨：**目标宿主验证文件/URL允许列表及写操作确认

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何逐级采用并计算运行成本？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

先配置自建飞书应用的最小 scopes、测试连接，再只开只读聊天/文档工具；写入类逐项用测试群和测试文档验收，核消息归属、授予人权限、Bitable/Sheets v2 API 限制。成本包括应用审批/权限配置、API 限额、失败重试和人工复核；本轮没有耗时/费用测量。可改进创建/授权事务化反馈、图像输入 allowlist/大小限制、非幂等写入的重试策略和更精确的连接路由鉴权；均属未验证假设。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-36](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L8-L36)

安装与配置

<details>
<summary>查看原文（29行）</summary>

````text
## Install

Requires DeepSeek Harness with plugin support (`dsh plugin`).

```sh
dsh plugin --profile web add dsh-plugin-feishu                  # once published to npm
dsh plugin --profile web add github:2286893544/feishu-dsh-plugin # straight from GitHub
```

Reload the profile, then configure the plugin on its own settings page:
**Settings → 飞书（Feishu）**. The client half (`client/client.js`) contributes
that sidebar page (a `settings.section`, the same slot community plugins such as
the side card use); it writes into the `feishu-bridge` settings namespace, so a
saved change applies immediately:

| Field | Meaning |
|---|---|
| `appId` | Feishu app ID of your self-built app (`cli_...`) |
| `appSecret` | Feishu app secret — declared `role("secret")`, so it is redacted from every page read and shown as a password control that starts blank |
| `tenantDomain` | Optional (`acme.feishu.cn`); auto-detected from the tenant API when empty |
| `defaultChatId` | Optional (`oc_...`) used by the chat tools when a call omits `chat_id` |
| `grantOpenId` | Optional (`ou_...`) — every document/bitable the plugin creates is shared with this user (`full_access`), so the person operating the bot keeps control of what the bot made |
| `wikiSpaceId` | Optional knowledge-base space id; when set, new documents are created **inside that knowledge base** and the returned URL is a `/wiki/` link |
| `wikiParentNodeToken` | Optional default parent node for new wiki documents (empty means the knowledge-base root) |

On a host without a settings service the card is simply absent and the composed
configuration stands. Both fallbacks remain: the profile patch entry
(`config: { appId, appSecret, ... }`) and the environment variables
`FEISHU_APP_ID`, `FEISHU_APP_SECRET`, `FEISHU_TENANT_DOMAIN`.
````

</details>

**依据 2 · 作者声明**：[README.md:69-86](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/README.md#L69-L86)

已知限制与前提

<details>
<summary>查看原文（18行）</summary>

```text
## Notes and limits

- Charts are rendered locally (pure Node PNG encoder + 5×7 ASCII font); chart
  titles and category labels are ASCII-only — non-ASCII characters are dropped.
  For Chinese labels, generate the image yourself and use
  `feishu_insert_image_into_document`.
- Spreadsheet tools use the classic sheets v2 range API.
- Only chats the bot belongs to can be read; other users' private chats are not
  accessible through the Feishu API.

## Prerequisites (Feishu side)

- Enterprise self-built app with the bot enabled.
- Published scopes for reading chat history (`im:message.group_msg` …), docx
  read/write, bitable, sheets and drive permission management; the bot must be a
  member of the target chats, and documents the app must read must be shared
  with it.
- Credentials stay local; never share `appSecret` in chat or documents.
```

</details>

**依据 3 · 源码核查**：[lib/index.js:121-136](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/index.js#L121-L136)

授权失败路径

<details>
<summary>查看原文（16行）</summary>

```text
// ---------- tools ----------
/**
 * Give the configured human full control over anything the bot creates.
 * Feishu keeps app-created documents in the app's own space and records the app
 * identity as the owner, so without this the person operating the bot is merely
 * "someone holding a link". A failed grant must never break doc creation.
 */
async function autoGrantOwner(client, config, token, type) {
  const openId = (config?.grantOpenId ?? "").trim();
  if (!openId) return "";
  try {
    await client.grantAccess(token, type, openId, "full_access");
    return `  granted full_access to ${openId}`;
  } catch (error) {
    return `  auto-grant failed: ${error?.message ?? String(error)}`;
  }
```

</details>

**依据 4 · 源码核查**：[lib/client.js:97-105](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/client.js#L97-L105)

失效 token 重试

```text
  async _api(method, path, body) {
    let data = await this._request(method, path, body);
    if ([99991663, 99991664, 99991668].includes(data.code)) {
      this.token = null;
      this.tokenExpiresAt = 0;
      data = await this._request(method, path, body);
    }
    if (data.code !== 0) throw new FeishuError(data.code, data.msg || "request failed", data);
    return data.data !== undefined ? data.data : data;
```

**依据 5 · 源码核查**：[lib/routes.js:19-70](https://github.com/2286893544/feishu-dsh-plugin/blob/8cb7f88b0eed0b8c59932e381f52f096c7e56df9/lib/routes.js#L19-L70)

路由边界

<details>
<summary>查看原文（52行）</summary>

```text
/** Same-origin check: the route must not be reachable from another page. */
export function isSameOrigin(request) {
  const origin = request.headers?.origin;
  if (typeof origin !== "string" || origin.length === 0) {
    // Non-browser clients (curl) have no Origin; Host must still be present.
    return typeof request.headers?.host === "string";
  }
  try {
    return new URL(origin).host === request.headers?.host;
  } catch {
    return false;
  }
}

/** Masked fingerprint: enough to recognize a key, not enough to use it. */
export function fingerprint(secret) {
  if (typeof secret !== "string" || secret.length === 0) return null;
  if (secret.length <= 8) return `${"*".repeat(secret.length)} (len ${secret.length})`;
  return `${secret.slice(0, 4)}…${secret.slice(-3)} (len ${secret.length})`;
}

export const TEST_CONNECTION_PATH = "/dsh-plugin-feishu/test-connection";

/**
 * Mount the route.
 * @param host - host context exposing `webServer` (and optionally `effect`).
 * @param deps - `testConnection()` returning the non-secret report.
 * @returns disposer removing the route.
 */
export function mountFeishuRoutes(host, { testConnection }) {
  const dispose = host.webServer.register({
    kind: "exact",
    path: TEST_CONNECTION_PATH,
    handler: async (request, response) => {
      if (request.method !== "POST") {
        response.writeHead(405, { allow: "POST" });
        response.end();
        return;
      }
      if (!isSameOrigin(request)) {
        sendJson(response, 403, { ok: false, error: "cross-origin request refused" });
        return;
      }
      try {
        const report = await testConnection();
        sendJson(response, 200, { ok: true, ...report });
      } catch (err) {
        sendJson(response, 200, {
          ok: false,
          error: err?.message ?? String(err),
          ...(err?.code === undefined ? {} : { code: err.code }),
        });
```

</details>

#### 缺口

- 目标租户额度、权限申请周期/实际成功率未知
  **影响：**无法给出全量安装或效益结论
  **进一步探讨：**测试租户先只读后按操作类别逐项写入验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
