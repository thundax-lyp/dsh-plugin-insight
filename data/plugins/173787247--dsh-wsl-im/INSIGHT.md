# dsh-wsl-im

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[c36e7cc](https://github.com/173787247/dsh-wsl-im/tree/c36e7cc4ae651756c7d81ff100401de10c10440a)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-wsl-im)
<!-- END META -->

> **功能**：把多平台 IM 消息、媒体和聊天会话桥接到 DSH Agent，再把文本回复送回原聊天。

> **亮点**：把现有 DSH Agent 工具能力带到多个聊天入口，支持工作区与多媒体转接。详见[Q01](#research-q01)。

> **主要限制**：requireAllowlist 默认关闭、空名单放行，Agent 默认 danger-full-access；权限设置失败仍继续。这使远程聊天可能驱动宿主工具。详见[Q02](#research-q02)。

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
  - [Q01 · IM 桥接实际覆盖哪些工作流？](#detail-section-11)
  - [Q02 · 入站用户怎样映射到权限与 Agent？](#detail-section-12)
  - [Q03 · 附件和回复链路带来什么数据与控制边界？](#detail-section-13)
  - [Q04 · 部署前最低验证与替代方案是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望从飞书、企微、钉钉、QQ、Slack、Discord、Telegram 或 Mattermost 远程访问 DSH。

直接在 DSH 本地/Web 会话输入，或为单个平台单独做安全网关；插件统一多 IM 入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| IM 收发 | 远程调用 Agent | 平台实测未做 |
| 白名单 | 限制用户 | 默认空名单全放行 |
| 附件 | 转给 Agent | 文件/内容需审计 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| 各 IM bot 凭据/API | 接收回复 | 对应适配器失败 |
| DSH agents/sessions/attachments | 创建会话和媒体保存 | 功能缺失 |
| 最小权限和白名单 | 限远端操作者 | 默认开放高风险 |
| 网络/代理 | 平台 WS/API | 连接失败 |

#### 隔离接入

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 身份 | 设 requireAllowlist 与真实 ID | 未列者拒绝 |
| 权限 | 最小权限 preset 并查失败 | 权限明确生效 |
| 媒体 | 文本/图片/PDF/语音测试 | 仅指定目录保留 |
| 运行 | 逐平台看回复与重连 | 无串聊/越权 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 初次 | 各平台 bot、凭据和 DSH 预设 | 白名单默认开放 |
| 每次 | 消息、媒体、模型调用与回复 | 远程工具执行面 |
| 持续 | 凭据轮换、重连、存储清理、安全审计 | 多平台协议变化 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 消息桥接 | 每聊天 Agent 会话及回复 | 平台实际可靠性 |
| 媒体 | 附件保存/本地提取 | 大文件与保留边界 |
| 权限 | 可配置白名单/预设 | 默认开放风险实际范围 |

> **思考**：requireAllowlist 默认关闭、空名单放行，Agent 默认 danger-full-access；权限设置失败仍继续。这使远程聊天可能驱动宿主工具。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把现有 DSH Agent 工具能力带到多个聊天入口，支持工作区与多媒体转接。详见[Q01](#research-q01)。

适配器按平台接入、Bridge 串行每聊天的 turn；session/event 汇集回复。入口默认允许空名单且 Agent 预设为 standard/danger-full-access；设置失败继续。

<a id="detail-section-5"></a>

### 1.4 主要限制

requireAllowlist 默认关闭、空名单放行，Agent 默认 danger-full-access；权限设置失败仍继续。这使远程聊天可能驱动宿主工具。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

不按默认设置暴露真实 bot。先启用强制白名单、最小权限并测试平台身份与附件边界；必要时只开 mock/隔离 bot。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核多平台适配和会话链路；默认空名单放行、Agent 高权限与权限设置失败非阻断是显著安全边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/config.js、lib/bridge.js、lib/inbound-media.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态阅读固定提交的 README、配置、Bridge、入口与媒体处理；未启动 bot、DSH Agent 或访问平台。
- 下一步：真实测试 bot 的白名单和权限注入、平台身份、群聊、附件大小/文件名、错误回显、会话隔离与断线重连。

**分析版本**

- **仓库**：[173787247/dsh-wsl-im](https://github.com/173787247/dsh-wsl-im)
- **版本号**：0.3.8（[固定提交 c36e7cc](https://github.com/173787247/dsh-wsl-im/tree/c36e7cc4ae651756c7d81ff100401de10c10440a)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把白名单与最小权限设为默认 fail-closed，并验证各平台身份/附件/权限矩阵后再开放真实 bot；现版未实现。详见[Q04](#research-q04)。

真实测试 bot 的白名单和权限注入、平台身份、群聊、附件大小/文件名、错误回显、会话隔离与断线重连。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 369 | — | — | 2838 |
| .js | source | 22 | 4203 | 3681 | 259 | — |
| .js | test | 1 | 482 | 460 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-im/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-im/issues?q=is%3Aissue+created%3A2026-09-22T05%3A53%3A01.687Z..2026-10-22T05%3A53%3A01.687Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-wsl-im/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A53%3A01.687Z..2026-10-22T05%3A53%3A01.687Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实多平台 IM 到 DSH Agent 的会话、附件和权限链路，判断默认暴露风险与可用性证据。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · IM 桥接实际覆盖哪些工作流？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件把飞书、企微、钉钉、QQ、Slack、Discord、Telegram、Mattermost 等消息经过各自适配器送入 Bridge，再为每个 platform:chatId 创建会话，调用 ctx.agents 并把文本回复发回原聊天。启动时按平台登记工作区；图片/文件作为附件保存，文件还复制到 inbox，PDF 可预抽取文本，语音可尝试本地 ASR。这样远程聊天可使用 DSH 的标准 Agent 工具，不只做通知；各平台认证、入站下载和回复方式不同，源码存在适配器，但本轮没有真实平台端到端验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:8-91](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/index.js#L8-L91)

注册状态工具、按配置启动桥接和工作区。

<details>
<summary>查看原文（84行）</summary>

```text
export const inject = [
  "agentDefaultModel",
  "agents",
  "sessions",
  "loader",
  "tools",
  "systemPrompt",
  "attachments",
  "agentPresets",
  "permissionPresets",
  "workspaceRegistry",
];

import { Bridge, ensureImWorkspaces } from "./lib/bridge.js";
import { resolveConfig } from "./lib/config.js";

export function apply(ctx, raw = {}) {
  const config = resolveConfig(raw, process.env);
  let bridge;

  ctx.systemPrompt.section({
    name: "tool:im_status",
    order: 126,
    text:
      "dsh-wsl-im bridges Feishu / WeCom / DingTalk / QQ / Slack / Discord / Telegram / Mattermost " +
      "directly into dsh agents over outbound long connections, long-poll, or webhook. " +
      "Use im_status to see which adapters are up. Never paste bot secrets into chat.",
  });

  ctx.tools.register({
    name: "im_status",
    description:
      "Show dsh-wsl-im adapter status (Feishu / WeCom / DingTalk / QQ / Slack / Discord / Telegram / Mattermost / mock).",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [{ type: "text", text: formatStatus(v) }],
    },
    timeoutMs: 5_000,
    isConcurrencySafe: () => true,
    async execute() {
      return bridge ? bridge.status() : { ok: false, error: "bridge not started" };
    },
    presentCall: () => ({ card: "generic", title: "IM status" }),
    presentResult: (_a, r) => ({
      card: "generic",
      title: r.isError ? "IM status failed" : "IM status",
      content: r.content,
    }),
  });

  const start = async () => {
    if (bridge) {
      bridge.stop();
      bridge = undefined;
    }
    if (!config.enabled) {
      console.info("[dsh-wsl-im] disabled");
      ctx.logger?.info?.("dsh-wsl-im: disabled");
      return;
    }
    try {
      const rows = await ensureImWorkspaces(ctx.workspaceRegistry, {
        base: config.agent.cwd || undefined,
      });
      console.info(
        `[dsh-wsl-im] workspaces ${rows.map((w) => `${w.title}:${w.path}`).join(" | ")}`,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[dsh-wsl-im] workspace register failed: ${msg}`);
    }
    const flags = Object.entries(config.adapters)
      .filter(([, v]) => v?.enabled)
      .map(([k]) => k);
    console.info(`[dsh-wsl-im] starting adapters=[${flags.join(",") || "none"}]`);
    bridge = new Bridge(ctx, config);
    bridge.start().catch((err) => {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[dsh-wsl-im] start failed: ${msg}`);
      ctx.logger?.warn?.(`dsh-wsl-im: start failed: ${msg}`);
    });
  };

```

</details>

**依据 2 · 源码核查**：[lib/bridge.js:74-160](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L74-L160)

适配器接入与会话事件汇集。

<details>
<summary>查看原文（87行）</summary>

```text
    .map((b) => b.text)
    .join("");
}

export class Bridge {
  constructor(ctx, config) {
    this.ctx = ctx;
    this.config = config;
    this.chats = new Map();
    this.pending = new Map();
    this.adapters = [];
    this.disposeListener = undefined;
    this.stopped = false;
    this.idleTimer = undefined;
  }

  async start() {
    this.disposeListener = this.ctx.on("session/event", (session, event) => {
      const collector = this.pending.get(session.id);
      if (!collector) return;
      if (event.type === "assistant/message") {
        const text = assistantText(event.data?.message);
        if (text) collector.parts.push(text);
      } else if (event.type === "turn/end") {
        collector.reason = event.data?.reason;
      }
    });

    this.warnAllowlists();

    const adapters = createAdapters({
      config: this.config,
      onMessage: (input) => this.handleMessage(input),
      logger: this.ctx.logger,
    });

    for (const adapter of adapters) {
      try {
        if (this.shouldBlockAdapter(adapter.name)) {
          const msg = `${adapter.name}: requireAllowlist set but allowedUserIds is empty — refused start`;
          console.warn(`[dsh-wsl-im] ${msg}`);
          this.ctx.logger?.warn?.(`dsh-wsl-im: ${msg}`);
          continue;
        }
        await adapter.start();
        this.adapters.push(adapter);
        console.info(`[dsh-wsl-im] ${adapter.name} started (${adapter.detail?.() || ""})`);
        this.ctx.logger?.info?.(`dsh-wsl-im: ${adapter.name} started`);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[dsh-wsl-im] ${adapter.name} failed: ${msg}`);
        this.ctx.logger?.warn?.(`dsh-wsl-im: ${adapter.name} failed: ${msg}`);
      }
    }

    if (this.config.agent.idleTimeoutMs > 0) {
      this.idleTimer = setInterval(
        () => this.reapIdle(),
        Math.min(this.config.agent.idleTimeoutMs, 60_000),
      );
      this.idleTimer.unref?.();
    }
  }

  stop() {
    this.stopped = true;
    if (this.disposeListener) this.disposeListener();
    if (this.idleTimer) clearInterval(this.idleTimer);
    for (const a of this.adapters) {
      try {
        a.stop();
      } catch {
        /* ignore */
      }
    }
    this.adapters = [];
    for (const chat of this.chats.values()) chat.dispose().catch(() => {});
    this.chats.clear();
  }

  status() {
    const allow = this.allowlistReport();
    return {
      ok: true,
      chats: this.chats.size,
      allowlistOpen: allow.open,
      requireAllowlist: Boolean(this.config.requireAllowlist),
```

</details>

**依据 3 · 源码核查**：[lib/bridge.js:268-457](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L268-L457)

每聊天建会话、转发文本/附件及回复。

<details>
<summary>查看原文（190行）</summary>

```text
    }
    await reply(`未知命令 ${cmd}（/help）`);
  }

  async getOrCreateChat(key) {
    let chat = this.chats.get(key);
    if (!chat) {
      chat = await this.createChat(key);
      this.chats.set(key, chat);
    }
    chat.lastUsed = Date.now();
    return chat;
  }

  async createChat(key) {
    const ctx = this.ctx;
    const selection = ctx.get("agentDefaultModel")?.currentSelection?.();
    if (!selection) throw new Error("agentDefaultModel unavailable");
    const provider = this.config.agent.provider || selection.provider;
    const model = this.config.agent.model || selection.model;
    const cwd = this.resolveAgentCwd(key.split(":")[0]);
    const presetId = this.config.agent.preset || "standard";
    const permissionPreset = this.config.agent.permissionPreset || "danger-full-access";

    const { importDsh } = await import("./dsh-import.js");
    const { SessionId } = await importDsh("@deepseek-ai/dsh-session");
    const { installModelSelection } = await importDsh("@deepseek-ai/dsh-agent");

    // Match dsh-webhook / api-session: join a full agent preset (bash/read/fs).
    const presets = ctx.agentPresets;
    if (!presets?.mount) {
      throw new Error("agentPresets.mount unavailable — cannot compose standard tools for IM");
    }
    const resolvedPreset = await presets.resolve(presetId);
    if (presets.standingKeyFor) {
      await presets.standingKeyFor(resolvedPreset.id);
    }
    if (ctx.permissionPresets?.resolve && permissionPreset) {
      try {
        ctx.permissionPresets.resolve(permissionPreset);
      } catch (e) {
        console.warn(
          `[dsh-wsl-im] permissionPresets.resolve(${permissionPreset}) failed: ${e?.message || e}`,
        );
      }
    }

    const sessionId = SessionId(`wsl-im-${randomUUID()}`);
    console.info(
      `[dsh-wsl-im] createChat key=${key} preset=${resolvedPreset.id} cwd=${cwd} model=${provider}/${model}`,
    );
    const handle = await ctx.agents.create({
      sessionId,
      meta: { cwd, agentPreset: resolvedPreset.id },
      agentOptions: { provider, model },
      setup: async (agentCtx) => {
        installModelSelection(agentCtx, {
          current: { provider, model },
          assembled: undefined,
        });
        await presets.mount(agentCtx, resolvedPreset.id);
      },
    });

    /* The sidebar groups sessions by workspace, and a workspace resolves its
     * sessions from the session's canonical cwd at read time — a session that was
     * never registered matches none of them, so an IM chat would exist on disk and
     * still be invisible under its platform. Registration is the only thing that
     * puts it there; everything above this line creates the session but leaves it
     * unowned. Failures stay non-fatal: an ungrouped chat is still reachable, and
     * a bridge that refuses to answer because the sidebar could not be updated
     * would be worse than one that does not appear in the sidebar. */
    try {
      const workspace = await ctx.workspaceRegistry?.resolveByPath?.(cwd);
      if (workspace?.attachSession) await workspace.attachSession(sessionId);
    } catch (e) {
      console.warn(`[dsh-wsl-im] attachSession failed: ${e?.message || e}`);
    }

    if (ctx.permissionPresets?.set && permissionPreset) {
      try {
        ctx.permissionPresets.set(handle.agent.session, permissionPreset);
      } catch (e) {
        console.warn(
          `[dsh-wsl-im] permissionPresets.set(${permissionPreset}) failed: ${e?.message || e}`,
        );
      }
    }
    await handle.agent.whenIdle();
    return {
      key,
      agent: handle.agent,
      dispose: handle.dispose,
      busy: Promise.resolve(),
      lastUsed: Date.now(),
      cwd,
    };
  }

  resolveAgentCwd(platform) {
    return resolveImWorkspace(platform, { base: this.config.agent.cwd || undefined });
  }

  async runTurn(chat, input) {
    const { importDsh } = await import("./dsh-import.js");
    const { createUserMessage } = await importDsh("@deepseek-ai/dsh-llm");
    const sessionId = chat.agent.session.id;
    const collector = { parts: [], reason: undefined };
    this.pending.set(sessionId, collector);
    try {
      const prefix =
        this.config.agent.instructionPrefix ||
        "你是 IM 助手。对附件：优先用 bash/read 打开工作区或附件路径；PDF 可用 pdftotext。不要只说读不到就结束——先尝试工具。不要为读文件去 spawn Agent Team。";
      let textBody =
        input.text ||
        (input.images?.length
          ? "请查看图片。"
          : input.files?.length
            ? "请阅读附件。"
            : "");

      // Pre-extract PDF text when pdftotext is available (avoids tool-less dead ends).
      const files = Array.isArray(input.files) ? input.files : [];
      const extracted = [];
      for (const f of files) {
        try {
          const { extractLocalText } = await import("./extract-text.js");
          const t = extractLocalText(f.data, f.name);
          if (t) extracted.push({ name: f.name, text: t });
        } catch (e) {
          console.warn(`[dsh-wsl-im] extract skip: ${e?.message || e}`);
        }
      }
      if (extracted.length) {
        const blocks = extracted
          .map((e) => `----- 附件 ${e.name} 正文提取 -----\n${e.text}`)
          .join("\n\n");
        textBody = `${textBody}\n\n以下是本机从附件提取的文本，请据此总结要点：\n\n${blocks}`;
      }

      const content = prefix ? `${prefix}\n\n${textBody}` : textBody;
      const parts = [{ type: "text", text: content }];

      const store = this.ctx.attachments;
      const images = Array.isArray(input.images) ? input.images : [];
      if (images.length) {
        if (!store?.saveImages) {
          throw new Error("ctx.attachments.saveImages unavailable (need dsh-attachment-local)");
        }
        const refs = await store.saveImages(
          images.map((img, i) => ({
            data: img.data,
            mediaType: img.mediaType,
            name: img.name || `wecom-${i + 1}`,
          })),
        );
        for (const ref of refs) {
          parts.push({ type: "image", attachment: ref });
        }
        console.info(`[dsh-wsl-im] attached ${refs.length} image(s) to user message`);
      }

      if (files.length) {
        if (!store?.saveFile) {
          throw new Error("ctx.attachments.saveFile unavailable (need dsh-attachment-local)");
        }
        const inbox = join(chat.cwd || this.resolveAgentCwd("im"), "inbox");
        try {
          mkdirSync(inbox, { recursive: true });
        } catch {
          /* ignore */
        }
        const savedAudio = [];
        for (const [i, f] of files.entries()) {
          const ref = await store.saveFile({
            data: f.data,
            name: f.name || `wecom-file-${i + 1}`,
          });
          parts.push({ type: "file", attachment: ref });
          // Also drop a copy in agent cwd so workspace-write sandbox can read it.
          try {
            const dest = join(inbox, f.name || `wecom-file-${i + 1}`);
            writeFileSync(dest, Buffer.from(f.data));
            console.info(`[dsh-wsl-im] copied attachment to ${dest}`);
            const { isProbablyAudioName } = await import("./local-asr.js");
            if (isProbablyAudioName(f.name || dest)) savedAudio.push(dest);
          } catch (e) {
            console.warn(`[dsh-wsl-im] inbox copy failed: ${e?.message || e}`);
          }
        }
```

</details>

#### 缺口

- 未用任何真实 IM 平台验证消息认证、附件或回复。
  **影响**：多平台可用性与稳定性不能从适配器存在推出。
  **进一步探讨**：在隔离 bot 上逐平台测文本、群聊、图片、文件、断线重连和回复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入站用户怎样映射到权限与 Agent？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

默认 requireAllowlist 由空配置/环境得到 false；各平台 allowedUserIds 为空时 isAllowed 返回 true，启动只警告，不阻止远程用户。只有显式打开 requireAllowlist 才拒绝空名单平台。新会话默认挂载 standard Agent preset，并选择 danger-full-access 权限预设；设置预设失败时只打印警告后继续创建。因此把公网/群聊机器人接入时，默认行为让所有发送者尝试驱动带宿主工具的 Agent，且权限可能无法确认成功。源码只保证有检查路径，不能证明平台身份标识与权限边界在所有适配器都正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/config.js:1-10](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/config.js#L1-L10)

requireAllowlist 默认未开启。

<details>
<summary>查看原文（10行）</summary>

```text
/** Merge cordis config + env (env fills empty strings). Never log secrets. */

export function resolveConfig(raw = {}, env = process.env) {
  const a = raw.adapters || {};
  return {
    enabled: raw.enabled !== false,
    /** When true, refuse to start non-mock adapters with empty allowedUserIds. */
    requireAllowlist: bool(raw.requireAllowlist, env.DSH_IM_REQUIRE_ALLOWLIST),
    voiceAsr: {
      enabled: raw.voiceAsr?.enabled !== false && env.DSH_IM_VOICE_ASR !== "0",
```

</details>

**依据 2 · 源码核查**：[lib/config.js:82-95](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/config.js#L82-L95)

standard 和 danger-full-access 默认预设。

<details>
<summary>查看原文（14行）</summary>

```text
    agent: {
      cwd: str(raw.agent?.cwd || env.DSH_IM_AGENT_CWD),
      provider: str(raw.agent?.provider || env.DSH_IM_PROVIDER),
      model: str(raw.agent?.model || env.DSH_IM_MODEL),
      /** Agent preset id (tools/prompt). Default `standard` so bash/read exist. */
      preset: str(raw.agent?.preset || env.DSH_IM_PRESET || "standard") || "standard",
      /** Permission preset: workspace-write | danger-full-access | … */
      permissionPreset: str(
        raw.agent?.permissionPreset || env.DSH_IM_PERMISSION_PRESET || "danger-full-access",
      ),
      maxMessageLength: num(raw.agent?.maxMessageLength, 4000),
      idleTimeoutMs: num(raw.agent?.idleTimeoutMs, 30 * 60 * 1000),
      instructionPrefix: str(raw.agent?.instructionPrefix || ""),
      /**
```

</details>

**依据 3 · 源码核查**：[lib/bridge.js:180-251](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L180-L251)

空名单仅告警、shouldBlockAdapter 依赖显式开关、isAllowed 空名单放行。

<details>
<summary>查看原文（72行）</summary>

```text
      perPlatform[name] = { allowedCount: n, open: n === 0 };
      if (n === 0) open = true;
    }
    return { open, perPlatform };
  }

  warnAllowlists() {
    const { open, perPlatform } = this.allowlistReport();
    if (!open) return;
    const names = Object.entries(perPlatform)
      .filter(([, v]) => v.open)
      .map(([k]) => k);
    console.warn(
      `[dsh-wsl-im] SECURITY: empty allowedUserIds on [${names.join(", ")}] — ANYONE can drive host tools. Set allowedUserIds or DSH_IM_REQUIRE_ALLOWLIST=1`,
    );
  }

  shouldBlockAdapter(adapterName) {
    if (!this.config.requireAllowlist) return false;
    const name = String(adapterName || "").toLowerCase();
    if (name === "mock") return false;
    const cfg = this.config.adapters?.[name];
    if (!cfg?.enabled) return false;
    return !Array.isArray(cfg.allowedUserIds) || cfg.allowedUserIds.length === 0;
  }

  async handleMessage(input) {
    const { platform, chatId, userId, text, images, files } = input;
    const imgCount = Array.isArray(images) ? images.length : 0;
    const fileCount = Array.isArray(files) ? files.length : 0;
    console.info(
      `[dsh-wsl-im] handleMessage ${platform} user=${userId} chat=${chatId} text=${String(text || "").slice(0, 40)} images=${imgCount} files=${fileCount}`,
    );
    if ((typeof text !== "string" || !text.trim()) && imgCount === 0 && fileCount === 0) return;
    if (!this.isAllowed(platform, userId)) {
      await input.reply("⛔ 无权限使用此助手。");
      return;
    }
    if (text?.startsWith("/") && imgCount === 0 && fileCount === 0) {
      await this.handleCommand(`${platform}:${chatId}`, text, input);
      return;
    }
    const key = `${platform}:${chatId}`;
    try {
      const chat = await this.getOrCreateChat(key);
      const run = chat.busy.then(() => this.runTurn(chat, input));
      chat.busy = run.catch((e) => {
        console.warn(`[dsh-wsl-im] turn error: ${e?.message || e}`);
      });
      await run;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[dsh-wsl-im] handleMessage failed: ${msg}`);
      try {
        await input.reply(`⚠️ dsh 处理失败: ${msg}`);
      } catch {
        /* ignore */
      }
    }
  }

  isAllowed(platform, userId) {
    const list = this.config.adapters[platform]?.allowedUserIds || [];
    return list.length === 0 || list.includes(String(userId));
  }

  async handleCommand(key, text, input) {
    const reply = (msg) => input.reply(formatImOutbound(msg, { platform: input.platform }));
    const [cmd] = text.split(/\s+/);
    if (cmd === "/help") {
      await reply("命令: /help /reset /status\n直接发消息即可与 dsh 对话。");
      return;
```

</details>

**依据 4 · 源码核查**：[lib/bridge.js:286-357](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L286-L357)

创建会话挂载工具并设置权限预设；设置失败仅警告。

<details>
<summary>查看原文（72行）</summary>

```text
    const provider = this.config.agent.provider || selection.provider;
    const model = this.config.agent.model || selection.model;
    const cwd = this.resolveAgentCwd(key.split(":")[0]);
    const presetId = this.config.agent.preset || "standard";
    const permissionPreset = this.config.agent.permissionPreset || "danger-full-access";

    const { importDsh } = await import("./dsh-import.js");
    const { SessionId } = await importDsh("@deepseek-ai/dsh-session");
    const { installModelSelection } = await importDsh("@deepseek-ai/dsh-agent");

    // Match dsh-webhook / api-session: join a full agent preset (bash/read/fs).
    const presets = ctx.agentPresets;
    if (!presets?.mount) {
      throw new Error("agentPresets.mount unavailable — cannot compose standard tools for IM");
    }
    const resolvedPreset = await presets.resolve(presetId);
    if (presets.standingKeyFor) {
      await presets.standingKeyFor(resolvedPreset.id);
    }
    if (ctx.permissionPresets?.resolve && permissionPreset) {
      try {
        ctx.permissionPresets.resolve(permissionPreset);
      } catch (e) {
        console.warn(
          `[dsh-wsl-im] permissionPresets.resolve(${permissionPreset}) failed: ${e?.message || e}`,
        );
      }
    }

    const sessionId = SessionId(`wsl-im-${randomUUID()}`);
    console.info(
      `[dsh-wsl-im] createChat key=${key} preset=${resolvedPreset.id} cwd=${cwd} model=${provider}/${model}`,
    );
    const handle = await ctx.agents.create({
      sessionId,
      meta: { cwd, agentPreset: resolvedPreset.id },
      agentOptions: { provider, model },
      setup: async (agentCtx) => {
        installModelSelection(agentCtx, {
          current: { provider, model },
          assembled: undefined,
        });
        await presets.mount(agentCtx, resolvedPreset.id);
      },
    });

    /* The sidebar groups sessions by workspace, and a workspace resolves its
     * sessions from the session's canonical cwd at read time — a session that was
     * never registered matches none of them, so an IM chat would exist on disk and
     * still be invisible under its platform. Registration is the only thing that
     * puts it there; everything above this line creates the session but leaves it
     * unowned. Failures stay non-fatal: an ungrouped chat is still reachable, and
     * a bridge that refuses to answer because the sidebar could not be updated
     * would be worse than one that does not appear in the sidebar. */
    try {
      const workspace = await ctx.workspaceRegistry?.resolveByPath?.(cwd);
      if (workspace?.attachSession) await workspace.attachSession(sessionId);
    } catch (e) {
      console.warn(`[dsh-wsl-im] attachSession failed: ${e?.message || e}`);
    }

    if (ctx.permissionPresets?.set && permissionPreset) {
      try {
        ctx.permissionPresets.set(handle.agent.session, permissionPreset);
      } catch (e) {
        console.warn(
          `[dsh-wsl-im] permissionPresets.set(${permissionPreset}) failed: ${e?.message || e}`,
        );
      }
    }
    await handle.agent.whenIdle();
    return {
```

</details>

#### 缺口

- 没有完整的真实平台身份伪造/群聊可见范围测试。
  **影响**：不能量化默认暴露到谁或实际宿主权限。
  **进一步探讨**：逐平台验证发送者 ID、白名单、权限 preset 成功/失败和可用工具。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 附件和回复链路带来什么数据与控制边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Bridge 将 IM 文本连同固定指令前缀发给 Agent；附件存 attachment store 并另写平台工作区 inbox，PDF 本地抽取后正文直接追加消息，语音可尝试本地转写。输出收集会话中的 assistant/message 并按平台格式切分返回；错误消息也可能发回聊天。虽然适配器对部分媒体采用文件名清理和下载主机限制，但完整端到端的下载上限、内容可信度、敏感数据保留和提示注入隔离未获验证。允许 IM 输入驱动工具时，不应将附件文本当可信指令。

#### 证据与依据

**依据 1 · 源码核查**：[lib/bridge.js:364-456](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L364-L456)

附件保存、inbox 复制、PDF/ASR 和 Agent 消息构建。

<details>
<summary>查看原文（93行）</summary>

```text
    };
  }

  resolveAgentCwd(platform) {
    return resolveImWorkspace(platform, { base: this.config.agent.cwd || undefined });
  }

  async runTurn(chat, input) {
    const { importDsh } = await import("./dsh-import.js");
    const { createUserMessage } = await importDsh("@deepseek-ai/dsh-llm");
    const sessionId = chat.agent.session.id;
    const collector = { parts: [], reason: undefined };
    this.pending.set(sessionId, collector);
    try {
      const prefix =
        this.config.agent.instructionPrefix ||
        "你是 IM 助手。对附件：优先用 bash/read 打开工作区或附件路径；PDF 可用 pdftotext。不要只说读不到就结束——先尝试工具。不要为读文件去 spawn Agent Team。";
      let textBody =
        input.text ||
        (input.images?.length
          ? "请查看图片。"
          : input.files?.length
            ? "请阅读附件。"
            : "");

      // Pre-extract PDF text when pdftotext is available (avoids tool-less dead ends).
      const files = Array.isArray(input.files) ? input.files : [];
      const extracted = [];
      for (const f of files) {
        try {
          const { extractLocalText } = await import("./extract-text.js");
          const t = extractLocalText(f.data, f.name);
          if (t) extracted.push({ name: f.name, text: t });
        } catch (e) {
          console.warn(`[dsh-wsl-im] extract skip: ${e?.message || e}`);
        }
      }
      if (extracted.length) {
        const blocks = extracted
          .map((e) => `----- 附件 ${e.name} 正文提取 -----\n${e.text}`)
          .join("\n\n");
        textBody = `${textBody}\n\n以下是本机从附件提取的文本，请据此总结要点：\n\n${blocks}`;
      }

      const content = prefix ? `${prefix}\n\n${textBody}` : textBody;
      const parts = [{ type: "text", text: content }];

      const store = this.ctx.attachments;
      const images = Array.isArray(input.images) ? input.images : [];
      if (images.length) {
        if (!store?.saveImages) {
          throw new Error("ctx.attachments.saveImages unavailable (need dsh-attachment-local)");
        }
        const refs = await store.saveImages(
          images.map((img, i) => ({
            data: img.data,
            mediaType: img.mediaType,
            name: img.name || `wecom-${i + 1}`,
          })),
        );
        for (const ref of refs) {
          parts.push({ type: "image", attachment: ref });
        }
        console.info(`[dsh-wsl-im] attached ${refs.length} image(s) to user message`);
      }

      if (files.length) {
        if (!store?.saveFile) {
          throw new Error("ctx.attachments.saveFile unavailable (need dsh-attachment-local)");
        }
        const inbox = join(chat.cwd || this.resolveAgentCwd("im"), "inbox");
        try {
          mkdirSync(inbox, { recursive: true });
        } catch {
          /* ignore */
        }
        const savedAudio = [];
        for (const [i, f] of files.entries()) {
          const ref = await store.saveFile({
            data: f.data,
            name: f.name || `wecom-file-${i + 1}`,
          });
          parts.push({ type: "file", attachment: ref });
          // Also drop a copy in agent cwd so workspace-write sandbox can read it.
          try {
            const dest = join(inbox, f.name || `wecom-file-${i + 1}`);
            writeFileSync(dest, Buffer.from(f.data));
            console.info(`[dsh-wsl-im] copied attachment to ${dest}`);
            const { isProbablyAudioName } = await import("./local-asr.js");
            if (isProbablyAudioName(f.name || dest)) savedAudio.push(dest);
          } catch (e) {
            console.warn(`[dsh-wsl-im] inbox copy failed: ${e?.message || e}`);
          }
```

</details>

**依据 2 · 源码核查**：[lib/bridge.js:458-512](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L458-L512)

会话响应与错误回传。

<details>
<summary>查看原文（55行）</summary>

```text
        console.info(`[dsh-wsl-im] attached ${files.length} file(s) to user message`);

        if (savedAudio.length && this.config.voiceAsr?.enabled !== false) {
          const { localAsrTranscribe, NO_ASR_HINT } = await import("./local-asr.js");
          const asrBits = [];
          for (const dest of savedAudio) {
            const r = await localAsrTranscribe(dest, this.config.voiceAsr || {});
            if (r.ok && r.text) {
              asrBits.push(r.text);
              console.info(`[dsh-wsl-im] local ASR ok engine=${r.engine} chars=${r.text.length}`);
            } else {
              console.info(`[dsh-wsl-im] local ASR skip: ${r.error || "unknown"}`);
            }
          }
          if (asrBits.length) {
            textBody = `[语音转写] ${asrBits.join(" ")}\n\n${textBody}`;
            parts[0] = { type: "text", text: prefix ? `${prefix}\n\n${textBody}` : textBody };
          } else if (/Whisper|转写为空|没有可用转写/i.test(textBody)) {
            textBody = `${NO_ASR_HINT}\n（原附件仍在 inbox）\n\n${textBody}`;
            parts[0] = { type: "text", text: prefix ? `${prefix}\n\n${textBody}` : textBody };
          }
        }
      }

      chat.agent.followup(
        createUserMessage({
          content: parts,
          // dsh ≥0.1.7 session format v4 rejects retired kind:"plugin";
          // use producer-owned kind (see dsh-session-format-v3-to-v4 rewritePluginSource).
          source: { kind: "plugin:dsh-wsl-im", form: "relay" },
        }),
      );
      await chat.agent.whenIdle();
      await this.ctx.sessions.flush(chat.agent.session);
      const answer = formatImOutbound(collector.parts.join("\n\n").trim(), {
        platform: input.platform,
      });
      if (collector.reason?.kind === "error") {
        const err = collector.reason.error;
        await input.reply(
          formatImOutbound(`⚠️ ${err?.code || "error"}: ${err?.message || "unknown"}`, {
            platform: input.platform,
          }),
        );
        return;
      }
      if (!answer) {
        await input.reply(formatImOutbound("(无文本回复)", { platform: input.platform }));
        return;
      }
      for (const chunk of splitText(answer, this.config.agent.maxMessageLength)) {
        await input.reply(chunk);
      }
      await this.maybeVecmemOnReply(input.platform, answer);
    } catch (err) {
```

</details>

**依据 3 · 源码核查**：[lib/inbound-media.js:10-71](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/inbound-media.js#L10-L71)

部分媒体分类与文件名清理。

<details>
<summary>查看原文（62行）</summary>

```text
  if (kind === "image") return "请查看这张图片并简要描述内容。";
  if (kind === "audio") {
    return (
      `用户发来语音，平台转写为空，音频已落到工作区「${name}」。` +
      "将尝试本机 Whisper；若失败请用户改发文字。"
    );
  }
  if (kind === "video") {
    return (
      `用户发来视频附件「${name}」。` +
      "当前不会自动理解画面或抽音轨转写；请确认已落盘到工作区 inbox，并请用户补充文字说明或改发截图/文字。"
    );
  }
  return `请阅读附件「${name}」并总结要点。`;
}

export function asrText(raw) {
  const asr = String(raw || "").trim();
  return asr ? `[语音转写] ${asr}` : "";
}

export function hostAllowed(url, suffixes) {
  let host;
  try {
    host = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }
  return suffixes.some((s) => host === s.replace(/^\./, "") || host.endsWith(s));
}

export const QQ_MEDIA_HOSTS = [".qq.com", ".qq.com.cn", ".myqcloud.com", ".ugcimg.cn"];
export const DING_MEDIA_HOSTS = [".dingtalk.com", ".alicdn.com", ".aliyuncs.com"];

export function sanitizeFileName(name, fallback) {
  const base = String(name || fallback || "im-file")
    .replace(/[\\/:*?"<>|\x00-\x1f]/g, "_")
    .trim();
  return (base || fallback || "im-file").slice(0, 180);
}

/**
 * Turn downloaded bytes into a bridge image or file.
 * @returns {{ image?: { data: Uint8Array, mediaType: string }, file?: { data: Uint8Array, name: string }, name: string }}
 */
export function toBridgePart({ kind, name, data, fallbackName }) {
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data || []);
  if (!bytes.length) throw new Error("media: empty download");
  const safe = sanitizeFileName(name, fallbackName || "im-file");
  if (kind === "image") {
    const mediaType = sniffImageMediaType(bytes);
    if (mediaType) {
      return { image: { data: new Uint8Array(bytes), mediaType }, name: safe };
    }
  }
  let finalName = ensureFileExtension(safe, bytes);
  if (kind === "video" && !/\.[A-Za-z0-9]{1,8}$/.test(finalName)) finalName = `${finalName}.mp4`;
  if (kind === "audio" && !sniffFileExtension(bytes) && !/\.[A-Za-z0-9]{1,8}$/.test(finalName)) {
    finalName = `${finalName}.silk`;
  }
  return { file: { data: new Uint8Array(bytes), name: finalName }, name: finalName };
}
```

</details>

#### 缺口

- 未检查每个平台真实文件大小/路径/类型组合及宿主 attachment store 行为。
  **影响**：附件风险与保留周期无法确认。
  **进一步探讨**：对不可信附件、超大文件、同名文件与异常下载做隔离回放，审计落盘和错误回显。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署前最低验证与替代方案是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议暂不按默认配置将真实 IM bot 接入主机。先显式设置 requireAllowlist=1 和每个平台用户 ID 白名单，改为最小权限 Agent preset，并在隔离工作区用 mock/测试 bot 检查每种入站内容只影响允许的会话与路径；权限设置失败应阻止会话创建，接入前给出配置自检。这是改进方向，现版仅部分提供开关。还需计入各平台 bot 凭据、网络代理、会话/附件存储、重连与审核成本。相较在 DSH Web 中手动开启会话，IM 桥扩大可达性，也扩大了远程输入面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-90](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/README.md#L70-L90)

作者说明平台配置和空名单安全提示。

<details>
<summary>查看原文（21行）</summary>

````text
```sh
# track default branch; do not pin 0.2.0
dsh plugin --profile web add github:173787247/dsh-wsl-im
```

**Awesome:** entry draft in [`docs/awesome-entry.yml`](./docs/awesome-entry.yml) — submit to [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) after the repo is ≥1 day old (CI gate).

Source env (see `examples/dsh-wsl-im.env.example`), restart web, **new session**. Tool: `im_status`.

### Mock smoke (no real bot)

```sh
export DSH_IM_MOCK=1
# restart dsh web, then:
curl -s http://127.0.0.1:18999/mock -H 'content-type: application/json' \
  -d '{"text":"/status","chatId":"t1"}'
```

## Security

Empty `allowedUserIds` = everyone. Set a whitelist before exposing bots. IM input can drive tools on the host.
````

</details>

**依据 2 · 源码核查**：[lib/config.js:1-95](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/config.js#L1-L95)

开关和权限预设默认值。

<details>
<summary>查看原文（95行）</summary>

```text
/** Merge cordis config + env (env fills empty strings). Never log secrets. */

export function resolveConfig(raw = {}, env = process.env) {
  const a = raw.adapters || {};
  return {
    enabled: raw.enabled !== false,
    /** When true, refuse to start non-mock adapters with empty allowedUserIds. */
    requireAllowlist: bool(raw.requireAllowlist, env.DSH_IM_REQUIRE_ALLOWLIST),
    voiceAsr: {
      enabled: raw.voiceAsr?.enabled !== false && env.DSH_IM_VOICE_ASR !== "0",
      timeoutMs: num(raw.voiceAsr?.timeoutMs ?? env.DSH_IM_VOICE_ASR_TIMEOUT_MS, 300_000),
      language: str(raw.voiceAsr?.language || env.DSH_IM_VOICE_ASR_LANG),
    },
    adapters: {
      mock: {
        enabled: bool(a.mock?.enabled, env.DSH_IM_MOCK),
        port: num(a.mock?.port ?? env.DSH_IM_MOCK_PORT, 18999),
      },
      feishu: {
        enabled: bool(a.feishu?.enabled, env.DSH_IM_FEISHU),
        appId: str(a.feishu?.appId || env.FEISHU_APP_ID || env.DSH_IM_FEISHU_APP_ID),
        appSecret: str(a.feishu?.appSecret || env.FEISHU_APP_SECRET || env.DSH_IM_FEISHU_APP_SECRET),
        allowedUserIds: idList(a.feishu?.allowedUserIds, env.DSH_IM_FEISHU_ALLOWED_USER_IDS),
      },
      wecom: {
        enabled: bool(a.wecom?.enabled, env.DSH_IM_WECOM),
        // Vendor names: BotID / 长连接 Secret.
        botId: str(a.wecom?.botId || env.WECOM_BOT_ID || env.DSH_IM_WECOM_BOT_ID),
        secret: str(a.wecom?.secret || env.WECOM_BOT_SECRET || env.DSH_IM_WECOM_SECRET),
        allowedUserIds: idList(a.wecom?.allowedUserIds, env.DSH_IM_WECOM_ALLOWED_USER_IDS),
      },
      dingtalk: {
        enabled: bool(a.dingtalk?.enabled, env.DSH_IM_DINGTALK),
        clientId: str(a.dingtalk?.clientId || env.DINGTALK_CLIENT_ID || env.DSH_IM_DINGTALK_CLIENT_ID),
        clientSecret: str(
          a.dingtalk?.clientSecret || env.DINGTALK_CLIENT_SECRET || env.DSH_IM_DINGTALK_CLIENT_SECRET,
        ),
        allowedUserIds: idList(a.dingtalk?.allowedUserIds, env.DSH_IM_DINGTALK_ALLOWED_USER_IDS),
      },
      qq: {
        enabled: bool(a.qq?.enabled, env.DSH_IM_QQ),
        appId: str(a.qq?.appId || env.QQ_APP_ID || env.DSH_IM_QQ_APP_ID),
        appSecret: str(a.qq?.appSecret || env.QQ_APP_SECRET || env.DSH_IM_QQ_APP_SECRET),
        allowedUserIds: idList(a.qq?.allowedUserIds, env.DSH_IM_QQ_ALLOWED_USER_IDS),
      },
      slack: {
        enabled: bool(a.slack?.enabled, env.DSH_IM_SLACK),
        botToken: str(a.slack?.botToken || env.SLACK_BOT_TOKEN || env.DSH_IM_SLACK_BOT_TOKEN),
        appToken: str(a.slack?.appToken || env.SLACK_APP_TOKEN || env.DSH_IM_SLACK_APP_TOKEN),
        allowedUserIds: idList(a.slack?.allowedUserIds, env.DSH_IM_SLACK_ALLOWED_USER_IDS),
      },
      discord: {
        enabled: bool(a.discord?.enabled, env.DSH_IM_DISCORD),
        botToken: str(a.discord?.botToken || env.DISCORD_BOT_TOKEN || env.DSH_IM_DISCORD_BOT_TOKEN),
        applicationId: str(
          a.discord?.applicationId || env.DISCORD_APPLICATION_ID || env.DSH_IM_DISCORD_APPLICATION_ID,
        ),
        allowedUserIds: idList(a.discord?.allowedUserIds, env.DSH_IM_DISCORD_ALLOWED_USER_IDS),
      },
      telegram: {
        enabled: bool(a.telegram?.enabled, env.DSH_IM_TELEGRAM),
        botToken: str(a.telegram?.botToken || env.TELEGRAM_BOT_TOKEN || env.DSH_IM_TELEGRAM_BOT_TOKEN),
        botUsername: str(
          a.telegram?.botUsername || env.TELEGRAM_BOT_USERNAME || env.DSH_IM_TELEGRAM_BOT_USERNAME,
        ),
        allowedUserIds: idList(a.telegram?.allowedUserIds, env.DSH_IM_TELEGRAM_ALLOWED_USER_IDS),
      },
      mattermost: {
        enabled: bool(a.mattermost?.enabled, env.DSH_IM_MATTERMOST),
        baseUrl: str(a.mattermost?.baseUrl || env.MATTERMOST_URL || env.DSH_IM_MATTERMOST_URL),
        botToken: str(a.mattermost?.botToken || env.MATTERMOST_TOKEN || env.DSH_IM_MATTERMOST_TOKEN),
        webhookPath: str(
          a.mattermost?.webhookPath || env.MATTERMOST_WEBHOOK_PATH || env.DSH_IM_MATTERMOST_WEBHOOK_PATH || "/mattermost",
        ),
        port: num(a.mattermost?.port ?? env.MATTERMOST_WEBHOOK_PORT ?? env.DSH_IM_MATTERMOST_PORT, 19000),
        webhookToken: str(
          a.mattermost?.webhookToken || env.MATTERMOST_WEBHOOK_TOKEN || env.DSH_IM_MATTERMOST_WEBHOOK_TOKEN,
        ),
        allowedUserIds: idList(a.mattermost?.allowedUserIds, env.DSH_IM_MATTERMOST_ALLOWED_USER_IDS),
      },
    },
    agent: {
      cwd: str(raw.agent?.cwd || env.DSH_IM_AGENT_CWD),
      provider: str(raw.agent?.provider || env.DSH_IM_PROVIDER),
      model: str(raw.agent?.model || env.DSH_IM_MODEL),
      /** Agent preset id (tools/prompt). Default `standard` so bash/read exist. */
      preset: str(raw.agent?.preset || env.DSH_IM_PRESET || "standard") || "standard",
      /** Permission preset: workspace-write | danger-full-access | … */
      permissionPreset: str(
        raw.agent?.permissionPreset || env.DSH_IM_PERMISSION_PRESET || "danger-full-access",
      ),
      maxMessageLength: num(raw.agent?.maxMessageLength, 4000),
      idleTimeoutMs: num(raw.agent?.idleTimeoutMs, 30 * 60 * 1000),
      instructionPrefix: str(raw.agent?.instructionPrefix || ""),
      /**
```

</details>

**依据 3 · 源码核查**：[lib/bridge.js:180-251](https://github.com/173787247/dsh-wsl-im/blob/c36e7cc4ae651756c7d81ff100401de10c10440a/lib/bridge.js#L180-L251)

安全警告与放行逻辑。

<details>
<summary>查看原文（72行）</summary>

```text
      perPlatform[name] = { allowedCount: n, open: n === 0 };
      if (n === 0) open = true;
    }
    return { open, perPlatform };
  }

  warnAllowlists() {
    const { open, perPlatform } = this.allowlistReport();
    if (!open) return;
    const names = Object.entries(perPlatform)
      .filter(([, v]) => v.open)
      .map(([k]) => k);
    console.warn(
      `[dsh-wsl-im] SECURITY: empty allowedUserIds on [${names.join(", ")}] — ANYONE can drive host tools. Set allowedUserIds or DSH_IM_REQUIRE_ALLOWLIST=1`,
    );
  }

  shouldBlockAdapter(adapterName) {
    if (!this.config.requireAllowlist) return false;
    const name = String(adapterName || "").toLowerCase();
    if (name === "mock") return false;
    const cfg = this.config.adapters?.[name];
    if (!cfg?.enabled) return false;
    return !Array.isArray(cfg.allowedUserIds) || cfg.allowedUserIds.length === 0;
  }

  async handleMessage(input) {
    const { platform, chatId, userId, text, images, files } = input;
    const imgCount = Array.isArray(images) ? images.length : 0;
    const fileCount = Array.isArray(files) ? files.length : 0;
    console.info(
      `[dsh-wsl-im] handleMessage ${platform} user=${userId} chat=${chatId} text=${String(text || "").slice(0, 40)} images=${imgCount} files=${fileCount}`,
    );
    if ((typeof text !== "string" || !text.trim()) && imgCount === 0 && fileCount === 0) return;
    if (!this.isAllowed(platform, userId)) {
      await input.reply("⛔ 无权限使用此助手。");
      return;
    }
    if (text?.startsWith("/") && imgCount === 0 && fileCount === 0) {
      await this.handleCommand(`${platform}:${chatId}`, text, input);
      return;
    }
    const key = `${platform}:${chatId}`;
    try {
      const chat = await this.getOrCreateChat(key);
      const run = chat.busy.then(() => this.runTurn(chat, input));
      chat.busy = run.catch((e) => {
        console.warn(`[dsh-wsl-im] turn error: ${e?.message || e}`);
      });
      await run;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.warn(`[dsh-wsl-im] handleMessage failed: ${msg}`);
      try {
        await input.reply(`⚠️ dsh 处理失败: ${msg}`);
      } catch {
        /* ignore */
      }
    }
  }

  isAllowed(platform, userId) {
    const list = this.config.adapters[platform]?.allowedUserIds || [];
    return list.length === 0 || list.includes(String(userId));
  }

  async handleCommand(key, text, input) {
    const reply = (msg) => input.reply(formatImOutbound(msg, { platform: input.platform }));
    const [cmd] = text.split(/\s+/);
    if (cmd === "/help") {
      await reply("命令: /help /reset /status\n直接发消息即可与 dsh 对话。");
      return;
```

</details>

#### 缺口

- 无远端 bot 运行的安全/稳定性结果及维护工时。
  **影响**：无法量化多平台接入收益与代价。
  **进一步探讨**：按平台进行受控试点，记录成功率、越权尝试、附件存储和人工处理时间。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
