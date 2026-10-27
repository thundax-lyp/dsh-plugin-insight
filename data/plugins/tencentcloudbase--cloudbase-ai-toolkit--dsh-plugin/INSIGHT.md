# CloudBase DSH 插件

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c4ab728](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 1,150](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C150&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit) [![npm 30d 2,254](https://img.shields.io/static/v1?label=npm+30d&message=2%2C254&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cloudbase/dsh-plugin)
<!-- END META -->

> **功能**：把 CloudBase MCP、包内 Skill 和数据库/部署结果卡片接入 DSH 会话。

> **亮点**：减少会话与CloudBase控制台间切换，统一展示数据库和部署结果，云后端能力归上游；不是从一句话到可用应用的效果证明。[Q01](#research-q01)

> **主要限制**：插件固定SHA不固定cached/latest MCP；两条bridge环境语义不同，面板set_env与调用未作为所读路径中的原子事务，不应先用于生产写入。[Q03](#research-q03)

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
  - [Q01 · CloudBase后端搬进DSH真正减少哪一步？](#detail-section-11)
  - [Q02 · 工具、面板写入和Skill如何接入宿主？](#detail-section-12)
  - [Q03 · 固定插件版本能否保证MCP工具和目标环境固定？](#detail-section-13)
  - [Q04 · 当前应怎样控制云端写入和安装维护投入？](#detail-section-14)
  - [Q05 · 怎样把会话环境选择变成可核对的请求约束？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有CloudBase环境的DSH开发者从代码继续管理后端与部署；合格结果在正确环境可验证。[Q01](#research-q01)

CloudBase控制台或直接MCP工具；子插件增加DSH卡片与Skill，非原创数据库/部署能力。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP桥 | 云数据库/存储/部署入口 | 动态MCP、登录和环境 |
| 面板卡片 | 展示数据和写意图 | append不等执行已通过 |
| Skill | CloudBase应用流程指导 | 需实际资源验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH/Node及服务 | 必需 | MCP/会话/界面 | 核版本与Web构建 |
| MCP可执行包 | 必需 | 真实云工具 | 固定并记录actual版本 |
| CloudBase登录和测试环境 | 云操作必需 | 授权与目标 | 不明则只读核查 |
| 备份和费用边界 | 写入前必需 | 恢复与资源成本 | 不做生产变更 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户审安装和固定MCP | 实际版本明确 |
| 授权 | 用户device-code并选测试环境 | status与目标对应 |
| 核查 | 单会话只读查询 | 环境数据一致 |
| 扩展前 | 用户核审批和恢复 | 未通过则回控制台 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、MCP拉包及云测试环境 | 登录选环境、Web重建、安装脚本审阅 | 耗时未知 |
| 持续使用 | 模型、数据库、存储和托管 | 版本/环境/审批核查 | 云费用未知 |
| 失败恢复 | 备份、资源回滚及额外调用 | 查正确环境与实际写入 | 未验恢复与退出 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话后端入口 | MCP/面板/Skill接线 | 端到端应用质量 |
| 写意图分离 | UI只append消息 | 所有路径approval执行 |
| 环境选择 | session cache与set_env | 并发请求目标一致性 |

> **思考**：插件固定SHA不固定cached/latest MCP；两条bridge环境语义不同，面板set_env与调用未作为所读路径中的原子事务，不应先用于生产写入。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少会话与CloudBase控制台间切换，统一展示数据库和部署结果，云后端能力归上游；不是从一句话到可用应用的效果证明。[Q01](#research-q01)

UI意图与执行分开、bundled Skill provider可借鉴；需核动态MCP身份和环境事务，不能把UI卡片当权限或交付证明。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

插件固定SHA不固定cached/latest MCP；两条bridge环境语义不同，面板set_env与调用未作为所读路径中的原子事务，不应先用于生产写入。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先固定MCP并做单会话测试环境只读核查；环境/审批未清前不删除或发布，失败退回控制台核对原资源。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DSH接线与写意图分离有源码支持；双会话环境一致性、实际MCP版本、approval及云资源恢复未验证。请求级目标绑定是未验证假设。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/README.md、dsh-plugin/package.json、dsh-plugin/cordis.patch.yml、dsh-plugin/scripts/mcp-launch.mjs、dsh-plugin/src/server/index.ts、dsh-plugin/src/server/mcp-bridge.ts、dsh-plugin/src/server/mcp-client.ts、dsh-plugin/src/server/skill-provider.ts、dsh-plugin/src/client/components/WriteOpToolCard.tsx 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读dsh-plugin子目录的manifest/README/patch/launcher/host/bridge/写卡片/Skill provider；不把根MCP源码等同实际latest版本，未运行宿主或云资源。
- 下一步：固定MCP版本，在双会话双测试环境交错只读与取消预览，核目标/审批/恢复；本轮未执行。[Q05](#research-q05)

**分析版本**

- **仓库**：[TencentCloudBase/CloudBase-AI-Toolkit](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit)
- **版本号**：0.2.3（[固定提交 c4ab728](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/tree/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是请求绑定session/env/MCP版本和资源，原子选择环境与调用，两会话交错测试错环境和取消副作用。[Q05](#research-q05)

固定MCP版本，在双会话双测试环境交错只读与取消预览，核目标/审批/恢复；本轮未执行。[Q05](#research-q05)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 268 | — | — | 2536 |
| .mjs | source | 5 | 447 | 373 | 36 | — |
| .cjs | source | 1 | 93 | 84 | 2 | — |
| .tsx | source | 37 | 3115 | 2830 | 107 | — |
| .ts | source | 30 | 6869 | 6034 | 326 | — |
| .ts | example | 1 | 166 | 155 | 12 | — |
| .ts | test | 19 | 2060 | 1875 | 48 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH后端桥是否把正确环境和审批贯穿到云资源操作，动态MCP依赖有哪些限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · CloudBase后端搬进DSH真正减少哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是使用CloudBase且在DSH开发全栈原型的开发者，需要从生成代码继续建数据结构、传文件和部署。子插件把CloudBase MCP经宿主桥接、Skill与数据/部署卡片放在会话，减少切控制台及手工解释工具结果；合格结果是正确环境中资源可访问且应用行为通过核查，不是卡片出现域名。数据库、身份、存储与托管由CloudBase上游提供，本插件贡献为DSH集成和呈现。独立MCP已够用或不使用CloudBase的用户，未必需要这个Web半和重建前端负担。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:3-15](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/README.md#L3-L15)

作者定位全栈应用与上游后端。

<details>
<summary>查看原文（13行）</summary>

```text
> **在 DeepSeek Harness 里，从一句话到可用的全栈应用。**
>
> 你在 DSH 里 vibecoding 时，最烦的事是什么？模型很聪明，但写完代码没地方跑——数据库要开控制台建、文件要自己传、部署要切去另一个网站。**一离开对话，心流就断了。**
>
> `@cloudbase/dsh-plugin` 把 CloudBase 后端搬进 DSH：
>
> - **数据库**：文档库和 PostgreSQL，对话里建表和查询
> - **存储与认证**：上传文件，配置登录
> - **前后端部署**：前端托管和后端部署，拿到可访问地址
>
> 你的模型（DeepSeek / Claude / 随便换）、你的后端（自己的 CloudBase 环境）、你的数据（本地会话 + 自己数据库）。

CloudBase backend for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness). Compatible with **DSH `>=0.1.0-rc.6 <0.3.0`** (verified on `0.2.0-rc.2`) · Node `>=18` · MCP tools follow `@cloudbase/cloudbase-mcp@latest`.
```

</details>

**依据 2 · 作者声明**：[dsh-plugin/README.md:58-69](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/README.md#L58-L69)

MCP桥、表格、预览与写操作说明。

<details>
<summary>查看原文（12行）</summary>

```text
| DeployPreviewCard | `manageHosting` upload 后 iframe 预览真实域名 + 打开按钮 |
| 交付物行 | 会话尾部展示产物路径 + 域名 |
| Sites skill | downloadTemplate(react) → Vite → 建表 → manageHosting → 域名 |

写操作（SQL / 上传 / 删行）一律注入会话，由模型按 DSH approval 执行，插件 UI 不绕过权限模型。

## 注意事项

1. **pnpm v9+ 默认禁止依赖 install 脚本**：必须 `enable-scripts=true` 后再 `pnpm install`（一键脚本已包含此步）。
2. **Web UI 插件要重建 DSH web 前端**：装完看不到卡片时，从 DSH 安装目录执行 `pnpm run build:web` 再重启；Headless 不需要。
3. **首次 npx 拉包可能 10–90s**：headless 首轮工具列表可能为空，重试即可。
4. **不要给插件配置 `CLOUDBASE_API_KEY`**：无效 Key 会挡住 device-code 登录。登录与环境选择全部走 `mcp__cloudbase__auth`。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具、面板写入和Skill如何接入宿主？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

cordis.patch插入dsh-mcp-client并让node运行mcp-launch，宿主管MCP framing和公开工具注册。另一个host apply创建CloudBaseMcpBridge给面板数据服务，Typert注册远程服务，并注册包内cloudbase Skill provider而非覆盖用户Skill目录。WriteOpToolCard点击run只append构造的用户消息，表示交由会话模型/宿主工具继续执行，不是卡片自己直接写SQL；但这也不证明最终宿主approval在全部路径不可绕过。可借鉴的是把UI写意图和真正工具执行分开、用provider登记bundled Skill；移植依赖systemPrompt、sessions、typert、skills和客户端服务。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/cordis.patch.yml:8-20](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/cordis.patch.yml#L8-L20)

宿主MCP客户端与本插件同时插入。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: mcp-cloudbase
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: cloudbase
        transport: stdio
        command: node
        # fileURLToPath is unavailable in the !!js evaluator; replicate it safely.
        # On Windows URL#pathname yields "/C:/..." (leading slash), which node
        # then resolves as "C:\C:\..." → MODULE_NOT_FOUND. Strip it on win32.
        args: [!!js '(() => { const raw = new URL("node_modules/@cloudbase/dsh-plugin/scripts/mcp-launch.mjs", baseUrl).pathname; let p = raw; try { p = decodeURIComponent(raw); } catch (e) { p = raw; } return /^\/[A-Za-z]:/.test(p) ? p.slice(1) : p; })()']
        env: {}
    - id: cloudbase-dsh-plugin
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/index.ts:49-85](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/index.ts#L49-L85)

独立面板bridge/远程服务与Skill注册。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx: PluginContext): void {
  const sessionEnvCache = new SessionEnvCache();
  const bridge = new CloudBaseMcpBridge({
    sessionEnvCache,
    getSessionId: () => resolveCurrentSessionId(ctx),
  });
  const data: CloudBaseData = createCloudBaseDataService(
    bridge,
    createAppend(ctx),
    (sessionId) => {
      // 显式 sessionId 优先（RPC 从面板传入）；否则回退当前会话上下文。
      if (sessionId) return ctx.sessions?.get?.(sessionId);
      return ctx.sessions?.current?.();
    },
    sessionEnvCache,
    () => resolveCurrentSessionId(ctx),
  );
  // TypertRemoteService 构造器自动把实例注册为 Cordis service（serviceKey="cloudbaseData"）。
  // 同时把 endpoints 注册进 typert local 注册表：api-gateway 的 claimsEndpoint 优先命中
  // local（不依赖 fiber state；srcClaims 的 strict ctx.get 在 apply 期间收集不到导致 404）。
  new CloudBaseRemoteService(ctx as never, data);
  try {
    ctx.typert?.register?.(buildCloudBaseTypertContribution());
  } catch (error) {
    ctx.logger?.warn?.(
      `[cloudbase] typert register skipped: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  ctx.effect?.(() => () => bridge.dispose());

  try {
    registerBundledSkill(ctx.skills);
  } catch (error) {
    ctx.logger?.warn?.(
      `[cloudbase] skill register skipped: ${error instanceof Error ? error.message : String(error)}`,
    );
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/client/components/WriteOpToolCard.tsx:55-60](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/client/components/WriteOpToolCard.tsx#L55-L60)

按钮只append用户消息，不直接执行写。

```text
  const skip = () => setDecision("skipped");

  const run = () => {
    void appendUserMessage(props.cloudbaseData, buildRunQueryMessage(op)).then(() => {
      setDecision("confirmed");
    });
```

**依据 4 · 源码核查**：[dsh-plugin/src/server/skill-provider.ts:51-63](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/skill-provider.ts#L51-L63)

Skill provider不覆用户根。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * Register the packaged CloudBase skill on `ctx.skills`.
 *
 * DSH discovers filesystem skills one level under `~/.dsh/skills`. Copying the
 * bundle there either hides it (no parent `SKILL.md`) or overwrites whatever
 * the user already installed. The host's own bundled skills register a
 * provider instead (`dsh-skill-badge`). This does the same: one candidate,
 * body and `references/` read from the package, nothing written to the user
 * skill root.
 */
export function registerBundledSkill(skills: SkillRegistry | undefined): void {
  const provider = createBundledSkillProvider();
  skills?.registerProvider?.(() => provider);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 固定插件版本能否保证MCP工具和目标环境固定？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

不能。launcher优先环境覆盖/缓存再npx latest，cached按mtime挑已有安装，固定插件SHA不固定实际MCP二进制版本和工具数。无API Key转交不意味着无需认证：实际复用本机登录态或device-code并选CloudBase环境。README说不随会话自动改环境，但面板bridge源码ensureSessionEnv会按session cache必要时set_env，再发实际工具请求；这是两条接线不同语义，不能只照README宣称全局环境稳定。set_env与工具调用分开await、共享lastInjectedEnvId，所读路径未见完整原子串行约束，跨会话切换应视为待验证竞态而非已复现错库。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/scripts/mcp-launch.mjs:13-60](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/scripts/mcp-launch.mjs#L13-L60)

缓存mtime优先和latest回退。

<details>
<summary>查看原文（48行）</summary>

```text
const MCP_PACKAGE = "@cloudbase/cloudbase-mcp@latest";

function findCachedBin() {
  const npxRoot = join(homedir(), ".npm", "_npx");
  if (!existsSync(npxRoot)) return undefined;
  let best;
  let entries;
  try {
    entries = readdirSync(npxRoot);
  } catch {
    return undefined;
  }
  for (const name of entries) {
    const bin = join(npxRoot, name, "node_modules", ".bin", "cloudbase-mcp");
    if (!existsSync(bin)) continue;
    let mtime = 0;
    try {
      mtime = statSync(bin).mtimeMs;
    } catch {
      continue;
    }
    if (!best || mtime > best.mtime) best = { path: bin, mtime };
  }
  return best?.path;
}

function findCachedEntry(bin) {
  const entry = join(dirname(dirname(bin)), "@cloudbase", "cloudbase-mcp", "dist", "cli.cjs");
  return existsSync(entry) ? entry : undefined;
}

function resolveLaunch() {
  if (process.env.CLOUDBASE_MCP_COMMAND) {
    return {
      command: process.env.CLOUDBASE_MCP_COMMAND,
      args: process.env.CLOUDBASE_MCP_ARGS
        ? process.env.CLOUDBASE_MCP_ARGS.split(",").map((part) => part.trim()).filter(Boolean)
        : ["-y", MCP_PACKAGE],
      shell: false,
    };
  }
  const cached = findCachedBin();
  if (cached) {
    const entry = findCachedEntry(cached);
    if (entry) return { command: process.execPath, args: [entry], shell: false };
    if (process.platform !== "win32") return { command: cached, args: [], shell: false };
  }
  return { command: "npx", args: ["-y", MCP_PACKAGE], shell: process.platform === "win32" };
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:185-198](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/mcp-client.ts#L185-L198)

set_env与调用分开。

<details>
<summary>查看原文（14行）</summary>

```text
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.ensureReady();
    if (name === "auth" && args.action === "set_env" && typeof args.envId === "string") {
      const response = await this.request("tools/call", { name, arguments: args });
      const payload = this.unwrapResponse(response, name);
      // 成功后才记录注入态并广播：失败时保留旧绑定，避免观察者误同步
      this.lastInjectedEnvId = args.envId;
      this.notifyEnvChanged(args.envId);
      return payload;
    }
    const rebound = await this.ensureSessionEnv(name, args);
    if (rebound) this.notifyEnvChanged(rebound);
    const response = await this.request("tools/call", { name, arguments: args });
    return this.unwrapResponse(response, name);
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:353-364](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/mcp-client.ts#L353-L364)

面板bridge按会话缓存隐式重绑。

<details>
<summary>查看原文（12行）</summary>

```text
  private async ensureSessionEnv(name: string, args: Record<string, unknown>): Promise<string | undefined> {
    if (!this.sessionEnvCache || !cloudbaseToolNeedsEnv(name, args)) return undefined;
    const sessionId = this.getSessionId?.();
    if (!sessionId) return undefined;
    const bound = this.sessionEnvCache.get(sessionId);
    if (!bound?.envId || bound.envId === this.lastInjectedEnvId) return undefined;
    await this.request("tools/call", {
      name: "auth",
      arguments: { action: "set_env", envId: bound.envId },
    });
    this.lastInjectedEnvId = bound.envId;
    return bound.envId;
```

</details>

**依据 4 · 作者声明**：[dsh-plugin/README.md:47-55](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/README.md#L47-L55)

作者登录与环境说明。

```text

> 调用 `mcp__cloudbase__auth`，`action=start_auth`，`authMode=device`，把 verification URL 给我。

浏览器授权一次后登录态持久化。再用 `mcp__cloudbase__auth`（`action=set_env`）选择环境，后续工具自动使用该环境。

## 功能

| 能力 | 说明 |
|---|---|
```

#### 缺口

- 双会话并发环境切换与独立MCP进程状态是否一致未验证。
  **影响**：数据库/部署目标存在重要采用不确定性。
  **进一步探讨**：两个隔离环境并发只读带标识查询，捕获set_env与实际请求，禁止生产写入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前应怎样控制云端写入和安装维护投入？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议观察，先由已有CloudBase测试环境的开发者做单会话只读核查，再决定是否扩大。首次需兼容DSH/Node、正确登录环境、拉MCP包，Web模式还可能重建宿主前端；README要求enable-scripts=true会扩大profile安装脚本执行，不应把它视作没有成本的固定步骤。持续投入包含云数据库/存储/托管、模型及MCP升级维护，金额和端到端时间未知；错误写入和部署可能产生资源费用或数据损失。未核环境稳定前不做删除/发布，先保存导出和原部署，失败回控制台只读核对并停止自动操作。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:25-42](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/README.md#L25-L42)

安装脚本、允许依赖脚本与Web构建条件。

<details>
<summary>查看原文（18行）</summary>

````text
或手动：

```bash
dsh plugin --profile web add @cloudbase/dsh-plugin
# pnpm ≥9 默认禁止依赖 install 脚本（protobufjs 会失败）
echo "enable-scripts=true" >> ~/.dsh/profiles/web/.npmrc
(cd ~/.dsh/profiles/web && pnpm install)
# UI 插件需要重建 DSH web 前端
pnpm --dir "$(dirname "$(dirname "$(command -v dsh)")")" run build:web || true
dsh --profile web
```

**Headless（只要 MCP 工具，不要前端构建）：**

```bash
dsh plugin --profile headless add @cloudbase/dsh-plugin
dsh --profile headless "列出所有 mcp__cloudbase__ 工具"
```
````

</details>

**依据 2 · 作者声明**：[dsh-plugin/README.md:71-77](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/README.md#L71-L77)

首次npx、环境与Skill限制。

```text

## 隐私

凭据只存本机（tcb 登录态或 `~/.dsh/.credentials.yaml`，权限 600），插件不上传密钥，读操作只访问你自己的 CloudBase 环境。

## 开发

```

**依据 3 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:185-198](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/mcp-client.ts#L185-L198)

环境与请求关系决定采用前提。

<details>
<summary>查看原文（14行）</summary>

```text
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.ensureReady();
    if (name === "auth" && args.action === "set_env" && typeof args.envId === "string") {
      const response = await this.request("tools/call", { name, arguments: args });
      const payload = this.unwrapResponse(response, name);
      // 成功后才记录注入态并广播：失败时保留旧绑定，避免观察者误同步
      this.lastInjectedEnvId = args.envId;
      this.notifyEnvChanged(args.envId);
      return payload;
    }
    const rebound = await this.ensureSessionEnv(name, args);
    if (rebound) this.notifyEnvChanged(rebound);
    const response = await this.request("tools/call", { name, arguments: args });
    return this.unwrapResponse(response, name);
```

</details>

#### 缺口

- 本机宿主approval、云费用、资源回滚和退出无同版验收。
  **影响**：不能推荐生产数据库写入或持续安装。
  **进一步探讨**：固定MCP版本，在测试环境验目标、审批、读写恢复和卸载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把会话环境选择变成可核对的请求约束？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是在每次有副作用调用中显式绑定session、envId、实际MCP版本和目标资源，再原子执行环境选择与工具请求；若上游支持直接env参数应优先使用，避免共享全局set_env。由Q03双桥与分开await推导，相对缓存提示多了请求级目标确认，但增加适配和兼容成本。最小实验两会话各绑不同测试环境，交错只读查询再模拟写预览/取消，比较现流程与原型的错环境数、拒绝/重试与延迟。任何错环境或取消后写入都否定原型保证；没有运行则保持假设，不宣称已确认现实现错库。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:185-198](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/mcp-client.ts#L185-L198)

请求级环境选择和操作分离。

<details>
<summary>查看原文（14行）</summary>

```text
  async callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
    await this.ensureReady();
    if (name === "auth" && args.action === "set_env" && typeof args.envId === "string") {
      const response = await this.request("tools/call", { name, arguments: args });
      const payload = this.unwrapResponse(response, name);
      // 成功后才记录注入态并广播：失败时保留旧绑定，避免观察者误同步
      this.lastInjectedEnvId = args.envId;
      this.notifyEnvChanged(args.envId);
      return payload;
    }
    const rebound = await this.ensureSessionEnv(name, args);
    if (rebound) this.notifyEnvChanged(rebound);
    const response = await this.request("tools/call", { name, arguments: args });
    return this.unwrapResponse(response, name);
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/src/server/mcp-client.ts:353-364](https://github.com/TencentCloudBase/CloudBase-AI-Toolkit/blob/c4ab728d2a7dd6b3d7af9dc1a197b22836c0fb92/dsh-plugin/src/server/mcp-client.ts#L353-L364)

共享注入态提供并发实验动因。

<details>
<summary>查看原文（12行）</summary>

```text
  private async ensureSessionEnv(name: string, args: Record<string, unknown>): Promise<string | undefined> {
    if (!this.sessionEnvCache || !cloudbaseToolNeedsEnv(name, args)) return undefined;
    const sessionId = this.getSessionId?.();
    if (!sessionId) return undefined;
    const bound = this.sessionEnvCache.get(sessionId);
    if (!bound?.envId || bound.envId === this.lastInjectedEnvId) return undefined;
    await this.request("tools/call", {
      name: "auth",
      arguments: { action: "set_env", envId: bound.envId },
    });
    this.lastInjectedEnvId = bound.envId;
    return bound.envId;
```

</details>

#### 缺口

- 请求级目标绑定是否获得上游支持及净收益未知。
  **影响**：仅设计方向。
  **进一步探讨**：固定两会话两环境与MCP版本做可重复交错对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
