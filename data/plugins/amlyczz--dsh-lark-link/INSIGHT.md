# dsh-lark-link

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[4e38acb](https://github.com/amlyczz/dsh-lark-link/tree/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/amlyczz/dsh-lark-link) [![npm 30d 3,293](https://img.shields.io/static/v1?label=npm+30d&message=3%2C293&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-link) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-link)
<!-- END META -->

> **功能**：DSH原生飞书/Lark桥，组合会话Agent、卡片、入站重放/出站队列及媒体回传。

> **亮点**：[Q02](#research-q02)真实远程Host接线；[Q03](#research-q03)有界replay/salvage；[Q04](#research-q04)outbox lane/回卡组合。

> **主要限制**：[Q02](#research-q02)默认开放/full access及卡片访问控制不同；[Q03](#research-q03)/[Q04](#research-q04)吞写盘失败/误完成/重复任务送达；[Q05](#research-q05)链接与raw诊断敏感面。

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
  - [Q01 · 飞书桥真正提供什么，默认权限与使用前提是什么？](#detail-section-11)
  - [Q02 · 从真实飞书事件到Agent/卡片，身份和任务边界在哪？](#detail-section-12)
  - [Q03 · 入站WAL和重放真的保证不丢不重吗？](#detail-section-13)
  - [Q04 · Outbox如何真实发飞书，送达和取消有什么边界？](#detail-section-14)
  - [Q05 · 文件、诊断和工作区的敏感副作用怎样限制？](#detail-section-15)
  - [Q06 · 当前应采用到什么程度，什么方向值得独立验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-lark-link0.6.2是MIT的DSH原生飞书/Lark双向桥，Node>=24、Lark SDK^1.73及大量Host服务peer为*，开发依赖0.1.2-rc.1不等当前Host兼容已验。面对已有私人DSH且需要手机派低风险任务/看结果的人，相比原生Web/终端和普通飞书机器人，新增是通道会话/卡片/重投组合；真实Agent模型/工具执行属于外部Host，卡片DONE和聊天回复不证明任务正确。

默认groupPolicy open、allowlist空、denyList空、permissionMode danger-full-access、preset ptc、auto replay true；不是安全只读助手默认。自动建应用setup会申请消息/群全量/表情/用户基础等权限并持久appId/Secret，30秒/零门槛是作者主张未实测；不安装、不扫码、不触真实账号。强制先核白名单/群策略、真实只读权限和自动重放关闭后，仍需审卡片/管理接口全部入口，不能只改文本白名单就视为安全。

官方DSH Web/终端及普通飞书bot加人工任务/送达对账，现有Agent执行/人审分工。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 双向桥 | 远程派任务/看回复 | 群共享/默认开放 |
| WAL/replay | 尝试恢复 | 非可靠接受/副作用幂等 |
| Outbox | 分lane发送 | 未接纳/未知送达可丢重 |
| 媒体/诊断 | 上传文件/日志 | 链接/raw秘密需核 |

**流程与依赖**

| 依赖或条件 | 必需性 | 用途 | 缺失/边界 |
|---|---|---|---|
| Node>=24/DSH服务 | 必需 | Host执行/持久 | peer*兼容未验 |
| Lark应用/SDK/权限/网络 | 必需 | 真收发 | 所有权限另审 |
| 操作者/群与只读策略 | 前提 | 控副作用 | 卡片不等文本入口 |
| 可写状态/媒体/日志 | 必需 | WAL/outbox/附件 | 失败可能吞下 |

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 离线 | 核全部入口/默认策略 | 不先接真实群 |
| 样例 | 独立低权应用/副本 | 核实际Host拒绝 |
| 故障 | 关auto replay/查效果 | 不盲重跑 |
| 退出 | 停桥/核发送/权限Key留存 | 不撤回已有副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 应用/Host/配置未知 | 权限/SDK核对 | 未接账号 |
| 持续 | 模型/工具/消息/磁盘未知 | 任务/隐私人审 | quota非总费封顶 |
| 故障 | 重复任务/未知送达未知 | 查WAL/Host/飞书 | 非一次性执行 |
| 退出 | 凭据/日志/文件留存未知 | 撤权限/备份/清理 | stop非撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 派任务 | 真Host followup | 正确/授权执行 |
| 回答 | 真SDK create | 用户收到/验收 |
| 恢复 | 真重放/重试 | 不丢不重 |

> **思考**：[Q02](#research-q02)默认开放/full access及卡片访问控制不同；[Q03](#research-q03)/[Q04](#research-q04)吞写盘失败/误完成/重复任务送达；[Q05](#research-q05)链接与raw诊断敏感面。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)真实远程Host接线；[Q03](#research-q03)有界replay/salvage；[Q04](#research-q04)outbox lane/回卡组合。

[Q03](#research-q03)可靠落盘与执行未fail closed；[Q04](#research-q04)enqueue返回/SDK接受/本地完成分开；[Q05](#research-q05)物理路径与raw诊断范围。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)默认开放/full access及卡片访问控制不同；[Q03](#research-q03)/[Q04](#research-q04)吞写盘失败/误完成/重复任务送达；[Q05](#research-q05)链接与raw诊断敏感面。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06)观察；所有入口/实际只读/回放副作用未核前不接真实群或生产目录，未知回官方Web和人工对账。

默认groupPolicy open、allowlist空、denyList空、permissionMode danger-full-access、preset ptc、auto replay true；不是安全只读助手默认。自动建应用setup会申请消息/群全量/表情/用户基础等权限并持久appId/Secret，30秒/零门槛是作者主张未实测；不安装、不扫码、不触真实账号。强制先核白名单/群策略、真实只读权限和自动重放关闭后，仍需审卡片/管理接口全部入口，不能只改文本白名单就视为安全。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

真实SDK→Host→飞书链可追，但零丢失主张不成立为保证，默认权限/入口与恢复边界显著，观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/application/diagnostics-service.ts、src/application/media-retention.ts、src/application/message-handler.ts、src/common/config.ts、src/common/paths.ts、src/host/auth-setup.ts、src/host/lark-client.ts、src/inbound/group-trigger.ts、src/inbound/inbound-wal.ts、src/inbound/replay-runner.ts、src/inbound/replay-salvage.ts、src/inbound/transport.ts、src/index.ts、src/outbound/event-forwarder.ts、src/outbound/outbox.ts、src/sessions/conversation-config.ts、src/sessions/conversation-manager.ts、src/sessions/dsh-adapter.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：新项source；核代表SDK/消息/群/卡片入口、create/followup/cancel/权限尽力、WAL/salvage/replay、outbox/SDK发送、文件链接/诊断原始日志上传；未全审2946行入口所有管理/QR/全部CardKit/SDK/Host外部实现。
- 下一步：仅只读固定源码；未安装运行目标/测试/模型/Host/飞书SDK网络/账号扫码/浏览器，无独立恢复/任务质量/安全/费用验证。

**分析版本**

- **仓库**：[amlyczz/dsh-lark-link](https://github.com/amlyczz/dsh-lark-link)
- **版本号**：0.6.2（[固定提交 4e38acb](https://github.com/amlyczz/dsh-lark-link/tree/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06)先统一操作者/逐请求关联与三层收据，比继续重试/卡片更值得验证。

仅只读固定源码；未安装运行目标/测试/模型/Host/飞书SDK网络/账号扫码/浏览器，无独立恢复/任务质量/安全/费用验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1824 | — | — | 26461 |
| .mjs | source | 1 | 99 | 80 | 10 | — |
| .ts | source | 42 | 12907 | 10431 | 1921 | — |
| .ts | test | 35 | 6636 | 5746 | 430 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/amlyczz/dsh-lark-link/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核真实飞书入站/身份→Host执行→出站结果，重点反证零丢失/重复执行与默认权限、媒体/诊断边界，独立形成采用和可验证方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书桥真正提供什么，默认权限与使用前提是什么？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-lark-link0.6.2是MIT的DSH原生飞书/Lark双向桥，Node>=24、Lark SDK^1.73及大量Host服务peer为*，开发依赖0.1.2-rc.1不等当前Host兼容已验。面对已有私人DSH且需要手机派低风险任务/看结果的人，相比原生Web/终端和普通飞书机器人，新增是通道会话/卡片/重投组合；真实Agent模型/工具执行属于外部Host，卡片DONE和聊天回复不证明任务正确。

默认groupPolicy open、allowlist空、denyList空、permissionMode danger-full-access、preset ptc、auto replay true；不是安全只读助手默认。自动建应用setup会申请消息/群全量/表情/用户基础等权限并持久appId/Secret，30秒/零门槛是作者主张未实测；不安装、不扫码、不触真实账号。强制先核白名单/群策略、真实只读权限和自动重放关闭后，仍需审卡片/管理接口全部入口，不能只改文本白名单就视为安全。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/package.json#L1-L10)

当前身份/MIT。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-lark-link",
  "version": "0.6.2",
  "description": "High-reliability Feishu/Lark bridge for DeepSeek Harness — QR one-click auth, multi-mode agents, card-based commands, zero-loss outbox, media in/out, session logs, reusable DSH Web GUI",
  "type": "module",
  "license": "MIT",
  "icon": "./assets/icon.svg",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/amlyczz/dsh-lark-link.git"
```

</details>

**依据 2 · 源码核查**：[package.json:34-55](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/package.json#L34-L55)

SDK与Host peer依赖。

<details>
<summary>查看原文（22行）</summary>

```text
  "dependencies": {
    "@larksuiteoapi/node-sdk": "^1.73.0",
    "axios": "^1.19.0",
    "fflate": "^0.8.3",
    "qrcode": "^1.5.4",
    "qrcode-terminal": "^0.12.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-commands": "*",
    "@deepseek-ai/dsh-credentials": "*",
    "@deepseek-ai/dsh-llm": "*",
    "@deepseek-ai/dsh-session": "*",
    "@deepseek-ai/dsh-storage-domain": "*",
    "@deepseek-ai/dsh-system-prompt": "*",
    "@deepseek-ai/dsh-tools": "*",
    "react": "^18.0.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
```

</details>

**依据 3 · 源码核查**：[package.json:101-128](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/package.json#L101-L128)

原生bundle/client及打包。

<details>
<summary>查看原文（28行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "slots"
      ],
      "platform": "web"
    }
  },
  "files": [
    "dist",
    "assets",
    "icon.svg",
    "cordis.patch.yml",
    "README.md",
    "LICENSE",
    "CHANGELOG.md"
  ],
  "scripts": {
    "dev:link": "node scripts/dev-link.mjs",
    "build": "tsdown",
    "check": "tsc --noEmit",
    "test": "node --experimental-strip-types --test \"test/**/*.test.ts\"",
    "prepack": "npm run build"
  },
  "engines": {
```

</details>

**依据 4 · 源码核查**：[package.json:128-131](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/package.json#L128-L131)

Node范围。

```text
  "engines": {
    "node": ">=24.0.0"
  }
}
```

**依据 5 · 源码核查**：[src/common/config.ts:111-173](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/common/config.ts#L111-L173)

真实默认群开放/空白名单/full access/自动重放。

<details>
<summary>查看原文（63行）</summary>

```text

export const DEFAULT_CONFIG: FeishuConfig = {
	credentialRef: "LARK_LINK_APP",
	// 群聊免 @（对齐 pi-feishu-link：setup 已申请群聊全量权限）——
	// 群聊里任何消息都触发，不必 @ 机器人。
	groupPolicy: "open",
	groupKeywords: ["lark", "小斯"],
	alsoOnReply: true,
	streaming: {
		// Default OFF (省流量): 每轮输出直发完整回复，流式卡作为可选增强
		// (pi 31dc3c9 用户决策)。/lark-config streaming.enabled=true 热改开启。
		enabled: false,
		printFrequencyMs: 120,
		printStep: 3,
	},
	reactions: {
		enabled: true,
		// Only Feishu-valid emoji types (FIRE/ROCKET/SUN/WHITE_CHECK_MARK are
		// invalid → addReaction 231001; Fire is valid, FIRE is not).
		pool: ["THUMBSUP", "OK", "HEART", "LAUGH", "SMILE", "WOW", "CLAP", "Fire"],
		done: "DONE",
	},
	attachments: {
		dir: "",
		// 7 days: long enough for multi-day conversations to re-read an
		// image with tools; the OS temp cleaner is an additional floor.
		retentionHours: 168,
	},
	outbox: {
		maxAttempts: 50,
		backoffMaxMs: 60_000,
		retainDays: 7,
		pendingCap: 10_000,
		blobThreshold: 24_000,
	},
	supervisor: {
		probeIntervalMs: 30_000,
		probeTimeoutMs: 8_000,
		probeFailThreshold: 3,
		maxReconnectAttempts: 8,
		idleKeepaliveMs: 20 * 60_000,
	},
	quota: {
		windowMinutes: 60,
		limit: 12,
	},
	denyList: [],
	sessionIdleTtlMs: 30 * 60_000,
	maxSessions: 32,
	allowlist: [],
	workspaceRoot: "",
	agentPreset: "ptc",
	permissionMode: "danger-full-access",
	replay: {
		// GH #14: keep the existing zero-loss default (auto replay ON);
		// opt out via /lark-config replay.auto=false or DSH_LARK_AUTO_REPLAY=0.
		auto: true,
		retentionMinutes: 30,
		maxAttempts: 2,
	},
};

/**
```

</details>

**依据 6 · 源码核查**：[src/host/auth-setup.ts:26-48](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/host/auth-setup.ts#L26-L48)

setup实际权限addons。

<details>
<summary>查看原文（23行）</summary>

```text
/** Bridge-dependent permission scopes (message + group-all + reactions). */
export const SETUP_SCOPES: readonly string[] = [
	"im:message",
	"im:message.send_as_bot",
	"im:chat",
	"im:resource",
	"im:message.group_msg", // all group messages (no @ required when policy=open)
	"im:message.reactions:write_only", // DONE / receipt reactions
	// GH #12: without a field-level contact scope, contact/v3/users/:open_id
	// returns HTTP 200 code=0 with name/en_name filtered to undefined — the
	// open_id is then an unresolvable identifier.
	"contact:user.base:readonly", // resolve the setup user's name/avatar
] as const;

/** Pure function — unit-testable addon builder. */
export function buildSetupAddons(): SetupAddons {
	return {
		scopes: { tenant: [...SETUP_SCOPES] },
		events: { items: { tenant: [REQUIRED_EVENT] } },
		callbacks: { items: ["card.action.trigger"] },
	};
}

```

</details>

**依据 7 · 源码核查**：[src/host/auth-setup.ts:95-124](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/host/auth-setup.ts#L95-L124)

真实registerApp/Secret/persist。

<details>
<summary>查看原文（30行）</summary>

```text
	return {
		async run(opts) {
			opts.onStatusChange?.("创建应用中…");
			const created = await deps.registerApp({
				source: "dsh-lark-link",
				addons: buildSetupAddons(),
				onQRCodeReady: (info) => opts.onQRCodeReady(info),
				onStatusChange: (info) => opts.onStatusChange?.(info.status ?? "…"),
			});
			const appId = created.client_id ?? "";
			const appSecret = created.client_secret ?? "";
			if (!appId || !appSecret) {
				throw new Error("registerApp 未返回 client_id/client_secret");
			}
			const domain = detectDomain(created.user_info);
			// GH #12: the registration poll is the ONLY moment this payload
			// exists — persist it now or it is gone for good. The key is
			// omitted when absent so the stored blob keeps its historical
			// shape (and manual appId/appSecret setups stay unchanged).
			const userInfo = normalizeUserInfo(created.user_info);
			// registerApp applies the addons (event subscription + scopes) at app
			// creation time; the transport later verifies im.message.receive_v1.
			opts.onStatusChange?.("校验事件订阅…");
			const result: SetupResult = userInfo
				? { appId, appSecret, domain, userInfo }
				: { appId, appSecret, domain };
			await deps.persist(result);
			opts.onStatusChange?.("完成 ✅");
			return result;
		},
```

</details>

**依据 8 · 作者声明**：[README.md:21-31](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/README.md#L21-L31)

作者零丢失/真Agent主张。

<details>
<summary>查看原文（11行）</summary>

```text
# 中文

**DeepSeek Harness × 飞书/Lark 双向桥接插件** —— 把你的 DSH 智能体装进飞书：扫码 30 秒上线、消息零丢失、卡片化交互、每飞书会话独立 Agent。手机上随时给 Agent 派任务、看结果、切模型切模式——不用守着终端。

## 🌟 为什么选 dsh-lark-link

- **零门槛**：扫码即建飞书应用，不用手搓开放平台、不用配回调、不用公网服务器
- **零丢失**：出站 Outbox + 入站 WAL 双持久化，进程崩溃 / 插件热更 / dsh 重启，消息和回答都补得回来
- **零学习成本**：所有切换类命令都是单选卡片，点一下即生效；DSH 原生命令（/goal /compact …）直接用
- **真 Agent**：不是聊天机器人——bash/文件/子代理/工作流全套工具，飞书里跑完整 Harness
- **统一控制台**：DSH 设置面板与插件详情页无缝复用专属控制台，四维监控、动态调控、无任何侧栏挤占
```

</details>

#### 缺口

- 当前Host兼容/全部SDK权限、真实需求/任务结果/配置生效和账户流程未独立验证。
  **影响**：不能按作者零丢失/真Agent类比直接生产采用。
  **进一步探讨**：先不接真实账号，核白名单/所有入口与Host拒绝行为，再低权私有样例。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从真实飞书事件到Agent/卡片，身份和任务边界在哪？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Lark SDK Client/WSClient+EventDispatcher接消息事件，transport归一message/chat/sender open_id后到MessageHandler；新消息先dedupe再allowlist（空全允许）和group trigger，然后命令分流/建会话路线。groupKey只chatId而非每个群成员独立，群共享Agent/目录/历史；群trigger mention只要任何mention/group_at或parent/root回复也可能触发，非严格必须@本bot或回复本bot证明。

ConversationManager按key进程内Promise链串行投递但agent.followup本身sync/void，不等整轮完成；ensureAgent真实Host agents.create/resume、cwd/preset→user message/附件→followup。权限apply仅尽力且失败warn继续，服务缺失保留组合默认，不是fail closed。/stop只agent.cancel，不保证shell/远端/已发消息回滚。

卡片是另一入口：handleCardAction直接按questionId resolve待答/直接bridgeHandler，所核回调没有重新走MessageHandler的open_id白名单，pseudo senderOpenId还被设chatId；问题卡片未在该分支将操作者/原chat与pending绑定。SDK来源校验/卡片可见性仍外部未知，但文本白名单不能推卡片授权，群员点击权限/问题动作必须另核，不能承诺所有操作同一访问控制。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/lark-client.ts:215-249](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/host/lark-client.ts#L215-L249)

真实SDK/WS/dispatcher建立与启动。

<details>
<summary>查看原文（35行）</summary>

```text
	// Node ≥18. Feishu endpoints are direct — disable proxy on the SDK's own
	// instance (which carries the response unwrap interceptors the SDK relies
	// on; a hand-built axios instance would break {code,data,msg} parsing).
	const dh = sdk.defaultHttpInstance as
		| { defaults?: { proxy?: boolean } }
		| undefined;
	if (dh?.defaults) dh.defaults.proxy = false;
	const clientOpts = {
		appId: opts.appId,
		appSecret: opts.appSecret,
		appType: sdk.AppType.SelfBuild,
		domain,
		loggerLevel: sdk.LoggerLevel.error,
	};

	const sdkClient = new sdk.Client(clientOpts);
	const dispatcher = new sdk.EventDispatcher({
		loggerLevel: sdk.LoggerLevel.error,
	});
	const wsClient = new sdk.WSClient(clientOpts);

	const client: FeishuClientLike = {
		on(event, handler) {
			dispatcher.register({ [event]: handler as (data: unknown) => unknown });
		},
		ws: {
			start() {
				try {
					wsClient.start({ eventDispatcher: dispatcher });
				} catch (err) {
					opts.logger?.error(
						`wsClient.start failed: ${err instanceof Error ? err.message : String(err)}`,
					);
				}
			},
```

</details>

**依据 2 · 源码核查**：[src/inbound/transport.ts:170-194](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/transport.ts#L170-L194)

真实消息/会话/sender归一。

<details>
<summary>查看原文（25行）</summary>

```text
	const msg = (raw.message ?? raw) as NonNullable<RawEvent["message"]> & {
		message_id?: string;
		chat_id?: string;
		chat_type?: string;
		message_type?: string;
		content?: string;
		parent_id?: string;
		root_id?: string;
		thread_id?: string;
		create_time?: string;
	};
	const messageId = msg.message_id ?? raw.message_id;
	const chatId = msg.chat_id ?? raw.chat_id;
	if (!messageId || !chatId) return undefined;

	const chatTypeRaw = (msg.chat_type ?? raw.chat_type ?? "p2p") as string;
	const chatType: ChatType = chatTypeRaw === "group" ? "group" : "p2p";
	const msgType = msgTypeOf(msg.message_type ?? raw.message_type);
	const senderOpenId =
		raw.sender?.sender_id?.open_id ??
		raw.operator?.operator_id?.open_id ??
		"unknown";

	const mentions = (msg.mentions ?? [])
		.map((m) => m.id?.open_id ?? m.id?.user_id ?? m.name ?? "")
```

</details>

**依据 3 · 源码核查**：[src/inbound/transport.ts:338-361](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/transport.ts#L338-L361)

事件→onMessage真实调用。

<details>
<summary>查看原文（24行）</summary>

```text
export const EVENT_MESSAGE = "im.message.receive_v1";
export const EVENT_CARD_ACTION = "card.action.trigger";

export function createTransport(deps: TransportDeps): Transport {
	let started = false;
	let wsReadyFlag = false;
	let botOpenId: string | undefined;
	const normalize = deps.normalize ?? normalizeInbound;

	const client = (): FeishuClientLike => deps.getClient();

	async function handleEvent(event: string, data: unknown): Promise<void> {
		deps.onEvent?.(event, data);
		if (event !== EVENT_MESSAGE) return;
		const raw = data as Record<string, unknown>;
		const msg = normalize(raw, { botOpenId });
		if (!msg) return;
		try {
			await deps.onMessage(msg);
		} catch (err) {
			deps.logger?.error(`onMessage failed: ${String(err)}`);
			// Never swallow silently: dispatch errors are observable in logs.
		}
	}
```

</details>

**依据 4 · 源码核查**：[src/application/message-handler.ts:297-316](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/application/message-handler.ts#L297-L316)

实际dedupe/白名单/群触发。

<details>
<summary>查看原文（20行）</summary>

```text
	async function handle(
		msg: FeishuInboundMessage,
		compensated: boolean,
	): Promise<"processed" | "dropped"> {
		// 1. dedupe (skip for compensation replay)
		if (!compensated && !deps.dedupe.add(msg.messageId)) {
			logger.info(`drop: duplicate ${msg.messageId}`);
			return "dropped";
		}
		// 2. allowlist (live getter — hot reload honored per message)
		const allowlist = deps.allowlist();
		if (allowlist.length > 0 && !allowlist.includes(msg.senderOpenId)) {
			logger.info(`drop: sender ${msg.senderOpenId} not in allowlist`);
			return "dropped";
		}
		// 3. group trigger
		if (!deps.groupTrigger.shouldTrigger(msg)) {
			logger.info(`drop: group policy for ${msg.chatId}`);
			return "dropped";
		}
```

</details>

**依据 5 · 源码核查**：[src/inbound/group-trigger.ts:29-54](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/group-trigger.ts#L29-L54)

真实open/mention/reply条件。

<details>
<summary>查看原文（26行）</summary>

```text
  return {
    shouldTrigger(msg) {
      if (msg.chatType !== "group") return true; // p2p always triggers
      const { policy, keywords, alsoOnReply } = deps.cfg();
      const botOpenId = deps.botOpenId?.();
      const isReplyToBot = msg.parentId !== undefined || msg.rootId !== undefined;
      switch (policy) {
        case "open":
          return true; // all group messages
        case "mention": {
          if (botOpenId !== undefined && msg.mentions.includes(botOpenId)) return true;
          if (msg.mentions.length > 0 || msg.chatMode === "group_at") return true;
          // alsoOnReply: trigger when the bot's own message was replied to.
          return alsoOnReply && isReplyToBot;
        }
        case "keywords":
          if (keywords.some((k) => (msg.text ?? "").includes(k))) return true;
          return alsoOnReply && isReplyToBot;
        case "reply":
          return isReplyToBot;
        default:
          return false;
      }
    },
  };
}
```

</details>

**依据 6 · 源码核查**：[src/sessions/conversation-manager.ts:55-77](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/conversation-manager.ts#L55-L77)

group/chat key与进程内链。

<details>
<summary>查看原文（23行）</summary>

```text
	const keyFor = (msg: FeishuInboundMessage): string =>
		msg.chatType === "p2p" ? `dm:${msg.chatId}` : `group:${msg.chatId}`;

	const enqueueSerial = <T>(
		key: string,
		task: () => Promise<T>,
	): Promise<T> => {
		const prev = queues.get(key) ?? Promise.resolve();
		const next = prev.then(task, task); // run task regardless of prior outcome
		queues.set(
			key,
			next.catch(() => undefined),
		);
		return next;
	};

	const ensureUnderCap = async (): Promise<void> => {
		if (deps.backend.size() < deps.maxSessions) return;
		deps.backend.disposeIdle(0); // dispose all idle first
		if (deps.backend.size() >= deps.maxSessions) {
			// Everything busy: brief wait for a slot, then dispose idle again.
			await new Promise((r) => setTimeout(r, 250));
			deps.backend.disposeIdle(0);
```

</details>

**依据 7 · 源码核查**：[src/sessions/conversation-manager.ts:83-109](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/conversation-manager.ts#L83-L109)

真实ensureAgent/事件订阅/followup投递。

<details>
<summary>查看原文（27行）</summary>

```text
		async handleMessage(msg, attachments) {
			const key = keyFor(msg);
			await ensureUnderCap();
			const agent: AgentHandle = await deps.backend.ensureAgent(key);
			// Attach the fan-out listener exactly once per agent.
			// Re-attach if the agent changed (e.g. after idle disposal + recreation,
			// the old hook is stale and won't forward the new agent's events).
			// Compare the HANDLE instance, not agent.agentId: on real DSH Agent.id is
			// the sessionId and resume() reuses it, so after idle disposal the new
			// agent has the SAME id but a fresh handle. Keying on agentId then wrongly
			// skips re-attaching and every event is silently dropped (GH #18).
			const prevAgent = hooksHandle.get(key);
			if (!hooks.has(key) || prevAgent !== agent) {
				hooks.get(key)?.(); // detach stale hook (no-op if same handle)
				const detach = agent.onEvent((e) => deps.onEvent?.(key, e));
				hooks.set(key, detach);
				hooksHandle.set(key, agent);
			}
			const rawText = msg.text ?? msg.content ?? "";
			const text = stripLeadingMentions(rawText) || rawText;
			await enqueueSerial(key, async () => {
				try {
					await agent.followup(text, attachments);
				} catch (err) {
					deps.logger?.warn(`followup failed for ${key}: ${String(err)}`);
				}
			});
```

</details>

**依据 8 · 源码核查**：[src/sessions/dsh-adapter.ts:844-861](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/dsh-adapter.ts#L844-L861)

真实Host create/cwd/preset/映射。

<details>
<summary>查看原文（18行）</summary>

```text
			if (resumedOwned) {
				owned = resumedOwned;
			} else {
				sessionId = bridgeKey(key);
				try {
					owned = await c.agents.create({
						sessionId,
						meta: {
							cwd: deps.cwd?.(key) ?? process.cwd(),
							// Normalize before handing the id to DSH (GH #11):
							// never emit the historical non-existent `code`.
							agentPreset: resolveAgentPreset(key, deps, presetOverrides),
						},
						...(agentOptions ? { agentOptions } : {}),
						setup,
					});
					deps.setActiveSessionId?.(key, sessionId);
				} catch (err) {
```

</details>

**依据 9 · 源码核查**：[src/sessions/dsh-adapter.ts:955-987](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/dsh-adapter.ts#L955-L987)

真实permission尽力apply/失败继续。

<details>
<summary>查看原文（33行）</summary>

```text
		// GH #8: scope the bridge's permissionMode to THIS session — the same
		// pattern the /permission handler uses — instead of writing the host's
		// global settings document (which silently flipped the deployment-wide
		// default, including non-Feishu sessions). Best-effort, never fatal;
		// absent services (bare host) just leave the composed default.
		try {
			const services = c as unknown as {
				get?(name: string): unknown;
			};
			const permission = services.get?.("permissionPresets") as
				| {
						apply?(
							session: unknown,
							name: string,
							setApproval: (policy: string) => void,
						): void;
				  }
				| undefined;
			const approval = services.get?.("approval") as
				| { setPolicy?(agent: unknown, policy: string): unknown }
				| undefined;
			const mode = deps.permissionMode?.();
			if (permission?.apply && agent.session && mode) {
				permission.apply(agent.session, mode, (policy) => {
					approval?.setPolicy?.(agent, policy);
				});
				deps.logger?.info(`permission for ${key} set to ${mode} (session-scoped)`);
			}
		} catch (err) {
			deps.logger?.warn(
				`permission apply failed for ${key}: ${err instanceof Error ? err.message : String(err)}`,
			);
		}
```

</details>

**依据 10 · 源码核查**：[src/sessions/dsh-adapter.ts:1034-1059](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/dsh-adapter.ts#L1034-L1059)

真实user message/followup/cancel。

<details>
<summary>查看原文（26行）</summary>

```text
				content[0] = { type: "text", text: parts.join("") };
				const message = createUserMessage({
					content: content as never,
					source: { kind: "user" },
				});
				if (content.length > 1) {
					// ImageBlock(s) attached: keep a text-only twin so an
					// image-unsupported model error can retry this very turn
					// without the blocks (path note is already in the text).
					pendingImageRetry.set(
						key,
						createUserMessage({
							content: [content[0]] as never,
							source: { kind: "user" },
						}),
					);
				} else {
					pendingImageRetry.delete(key);
				}
				// sync, void — errors surface via agent/error and turn/end(rejected)
				agent.followup(message);
			},
			rawAgent: agent,
			async cancel() {
				agent.cancel({ kind: "user" });
			},
```

</details>

**依据 11 · 源码核查**：[src/index.ts:1684-1735](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L1684-L1735)

卡片真实pending resolve入口，无该分支白名单校验。

<details>
<summary>查看原文（52行）</summary>

```text
	const handleCardAction = async (data: unknown): Promise<void> => {
		try {
			const raw = data as {
				action?: { value?: Record<string, unknown> };
				message?: { message_id?: string };
				open_id?: string;
			};
			const value = raw.action?.value ?? {};
			const op = typeof value.op === "string" ? value.op : "";
			logger.info(`card action data: ${JSON.stringify(raw).slice(0, 600)}`);
			const chatId =
				(raw as { context?: { open_chat_id?: string } }).context
					?.open_chat_id ??
				(raw as { operator?: { operator_id?: { open_id?: string } } }).operator
					?.operator_id?.open_id ??
				raw.open_id ??
				"";
			const messageId = raw.message?.message_id ?? "";
			if (!op) return;
			// op may be "name" (bare command) or "name:input" (picker callback).
			// Single-select answer: "uqa:<questionId>:<optionIndex>".
			// Multi-select answer: form submit op "uqam:<questionId>" — the
			// callback event carries action.formValue.answer (string[] of
			// selected option values, i.e. stringified option indexes).
			if (op.startsWith("uqam:")) {
				const questionId = op.slice("uqam:".length);
				const pending = pendingQuestions.get(questionId);
				if (pending) {
					clearTimeout(pending.timer);
					pendingQuestions.delete(questionId);
					const form = (raw as { action?: { formValue?: Record<string, unknown> } })
						.action?.formValue;
					const answer = form?.answer;
					const selectedValues = Array.isArray(answer)
						? answer.map((v) => String(v))
						: typeof answer === "string" && answer
							? [answer]
							: [];
					const selected = selectedValues.map((v) => {
						const i = Number(v);
						return Number.isInteger(i) && pending.options[i]
							? pending.options[i].label
							: v;
					});
					void sender
						.sendText(pending.chatId, `已收到你的选择 ✅（${selected.join("、")}）`)
						.catch(() => undefined);
					pending.resolve({
						id: questionId,
						selected,
					});
				}
```

</details>

**依据 12 · 源码核查**：[src/index.ts:1884-1909](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L1884-L1909)

卡片pseudo消息直达bridgeHandler及sender=chatId。

<details>
<summary>查看原文（26行）</summary>

```text
			const cmd = sep === -1 ? op : op.slice(0, sep);
			const arg = sep === -1 ? "" : op.slice(sep + 1);
			// messageId must be UNIQUE per click: durableReply dedupes command
			// replies by `bridge:<cmd>:<messageId>`, and the card message id is
			// the same for every click on that card — a second click (e.g.
			// picking another model from the picker) used to be swallowed as a
			// duplicate, so the user got NO confirmation for the new choice.
			// chatType: reuse the known route for this chat so the pseudo message
			// lands on the right conversation lane (group vs dm).
			const knownRoute = routeStore.all().find((r) => r.chatId === chatId);
			const pseudo: FeishuInboundMessage = {
				messageId: messageId
					? `${messageId}#${op}`
					: `card#${Date.now()}#${op}`,
				chatId,
				chatType: knownRoute?.chatType === "group" ? "group" : "p2p",
				chatMode: knownRoute?.chatType === "group" ? "group_all" : "p2p",
				senderOpenId: chatId,
				msgType: "interactive",
				content: "",
				text: "",
				mentions: [],
				timestamp: Date.now(),
			};
			await bridgeHandler(cmd, arg, pseudo);
		} catch (err) {
```

</details>

#### 缺口

- 全部卡片/管理接口、SDK来源与操作者权限/Host执行隔离、真实取消与群隔离未验。
  **影响**：不推荐公网/多用户/敏感任务；仅文本白名单不足完成安全配置。
  **进一步探讨**：固定伪造/不同操作者卡片与群共享样例做权限审计，全部入口拒绝成立前不接生产。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 入站WAL和重放真的保证不丢不重吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

入站agent-bound文本最多截8000字记录accept后再cm.handleMessage；媒体下载先行且WAL不保存完整附件，重放只构造text消息。WAL persistAll用0600临时segment+rename和旧文件清理，但总catch吞错误继续内存，accept不会因此阻断投递；丢盘/强杀仍能丢请求，外层try/catch也发现不了被吞失败，不能称先可靠持久后执行。会话配置JSON写失败也仅内存继续，重启可能回旧activeSessionId/目录配置。

默认30分钟窗口、最多2次重放，启动/手动runner先markReplay计数再salvage；salvage只取指定session最后一个assistant且时间不早于accept，未见请求id/turn强关联，多个排队请求或其他输出可能误认，不能当精确每请求完成证明。无可用输出就redispatch跳dedupe重进Agent，原轮已做文件/shell但未最终输出时可能重复副作用，不是exactly-once任务。

完成标记也以session route.lastMessageId，assistant输出入outbox后触发onDelivered，而非用户已收/业务验收。多次消息刷新route后原请求对应关系不强，必须逐请求核对；窗口/次数耗尽标failed是有界放弃，不是零丢失。关auto只关启动自动，手动replay仍可重跑，需人工先查日志/外部效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/application/message-handler.ts:340-385](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/application/message-handler.ts#L340-L385)

真实route更新/媒体先行/text截断/WAL尽力再投递。

<details>
<summary>查看原文（46行）</summary>

```text
			// Establish/refresh the delivery route (sessionKey → chatId) so the
			// event forwarder can route the agent's reply back to this Feishu chat.
			// Without this the forwarder drops every reply (routeFor → undefined).
			const sessionKey = cm.keyFor(msg);
			deps.ctx.router?.upsert({
				sessionKey,
				chatId: msg.chatId,
				chatType: msg.chatType,
				// Remember the trigger message so turn-end can DONE-reaction it.
				lastMessageId: msg.messageId,
				updatedAt: Date.now(),
			});
			// Inbound multimedia (M6): image → attachment store, file → text.
			const attachments = await resolveInboundAttachments(
				msg,
				deps.ctx,
				deps.inboundDir,
			);
			// Durably record the agent-bound request BEFORE enqueuing it, so a
			// crash/plugin-reload mid-turn can re-trigger it on boot. Only text
			// (media replay isn't reliable, and there may be none to rescue).
			const isText = msg.msgType === "text" || (msg.text ?? "").trim() !== "";
			// Only fresh inbound requests are journaled. A compensated re-dispatch
			// (missed-compensation for WS drops, or inbound-wal boot replay) must
			// NOT re-accept — replay already counted the attempt, and re-accepting
			// would reset its attempt cap and let a broken request loop forever.
			if (isText && !compensated && deps.wal) {
				try {
					deps.wal.accept({
						messageId: msg.messageId,
						sessionKey,
						chatId: msg.chatId,
						chatType: msg.chatType,
						senderOpenId: msg.senderOpenId,
						text: (msg.text ?? msg.content ?? "").slice(0, 8_000),
					});
				} catch (err) {
					logger.warn(
						`inbound-wal accept failed: ${
							err instanceof Error ? err.message : String(err)
						}`,
					);
				}
			}
			try {
				await cm.handleMessage(msg, attachments);
```

</details>

**依据 2 · 源码核查**：[src/inbound/inbound-wal.ts:105-160](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/inbound-wal.ts#L105-L160)

load跳坏行与真实tmp rename/catch吞写失败。

<details>
<summary>查看原文（56行）</summary>

```text
  function load(): void {
    let segs: string[] = [];
    try {
      segs = readdirSync(dir)
        .filter((f) => /^seg-.*\.jsonl$/.test(f))
        .sort();
    } catch {
      segs = [];
    }
    for (const seg of segs) {
      try {
        const lines = readFileSync(join(dir, seg), "utf8")
          .split("\n")
          .filter(Boolean);
        for (const line of lines) {
          try {
            const rec = JSON.parse(line) as InboundWalRecord;
            if (rec?.messageId) records.set(rec.messageId, rec);
          } catch {
            // skip corrupt line
          }
        }
      } catch {
        // missing/corrupt segment — skip
      }
    }
  }

  function persistAll(): void {
    try {
      const segFile = join(
        dir,
        `seg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jsonl`,
      );
      const tmp = `${segFile}.tmp`;
      const lines = [...records.values()].map((r) => JSON.stringify(r));
      writeFileSync(tmp, lines.join("\n") + "\n", { mode: 0o600 });
      let oldSegs: string[] = [];
      try {
        oldSegs = readdirSync(dir).filter((f) => /^seg-.*\.jsonl$/.test(f));
      } catch {
        oldSegs = [];
      }
      renameSync(tmp, segFile);
      for (const old of oldSegs) {
        if (old !== basename(segFile)) {
          try {
            rmSync(join(dir, old), { force: true });
          } catch {
            // best-effort cleanup
          }
        }
      }
    } catch {
      // best-effort persistence; in-memory continues
    }
```

</details>

**依据 3 · 源码核查**：[src/inbound/inbound-wal.ts:166-175](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/inbound-wal.ts#L166-L175)

accept内存+persist不阻断。

<details>
<summary>查看原文（10行）</summary>

```text
    accept(rec) {
      const full: InboundWalRecord = {
        ...rec,
        acceptedAt: now(),
        attempts: 0,
        state: "accepted",
      };
      records.set(rec.messageId, full);
      persistAll();
      return full;
```

</details>

**依据 4 · 源码核查**：[src/inbound/inbound-wal.ts:195-221](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/inbound-wal.ts#L195-L221)

真实次数/窗口/failed/markReplay。

<details>
<summary>查看原文（27行）</summary>

```text
      if (!rec) return false;
      if (rec.state === "delivered") return false;
      if (rec.attempts >= maxReplayAttempts) {
        // GH #9: the attempt budget is gone — leave a terminal marker
        // instead of lingering as accepted (invisible-but-unresolved).
        if (rec.state !== "failed") {
          rec.state = "failed";
          rec.failedAt = now();
          persistAll();
        }
        return false;
      }
      if (now() - rec.acceptedAt > replayRetentionMs) {
        // GH #14: out of the replay window → terminal too (same invariant:
        // every record is either replayable or failed, never limbo).
        if (rec.state !== "failed") {
          rec.state = "failed";
          rec.failedAt = now();
          persistAll();
        }
        return false;
      }
      rec.attempts += 1;
      rec.state = "replayed";
      persistAll();
      return true;
    },
```

</details>

**依据 5 · 源码核查**：[src/inbound/replay-runner.ts:40-82](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/replay-runner.ts#L40-L82)

真实mark→salvage→redispatch。

<details>
<summary>查看原文（43行）</summary>

```text
  return {
    async run(): Promise<ReplayRunResult> {
      let salvaged = 0;
      let replayed = 0;
      let skipped = 0;
      deps.prune?.();
      for (const rec of deps.wal.pendingReplays()) {
        if (!deps.wal.markReplay(rec.messageId)) {
          skipped++;
          continue;
        }
        // GH #9: the previous run may have COMPLETED the agent turn — the
        // session log already holds the final assistant output and only the
        // bridge event was lost. Answer from the log first; re-run the agent
        // only when no usable output exists.
        if (await deps.salvage(rec, deps.activeSessionId(rec.sessionKey))) {
          salvaged++;
          continue;
        }
        try {
          await deps.redispatch(rec);
          replayed++;
        } catch (err) {
          skipped++;
          deps.logger?.warn(
            `inbound replay failed for ${rec.messageId}: ${
              err instanceof Error ? err.message : String(err)
            }`,
          );
        }
      }
      if (salvaged > 0 || replayed > 0)
        deps.logger?.info(
          `inbound replay: ${salvaged} answered from session logs, ${replayed} re-dispatched`,
        );
      return {
        salvaged,
        replayed,
        skipped,
        pending: deps.wal.pendingReplays().length,
        failed: deps.wal.failedCount(),
      };
    },
```

</details>

**依据 6 · 源码核查**：[src/inbound/replay-salvage.ts:60-123](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/replay-salvage.ts#L60-L123)

真实末assistant时间筛选/入队/mark delivered。

<details>
<summary>查看原文（64行）</summary>

```text
  return blocks
    .filter((b) => b?.type === "text" && typeof b.text === "string")
    .map((b) => b.text)
    .join("");
}

export function createReplaySalvage(deps: ReplaySalvageDeps): ReplaySalvage {
  // In-process idempotency: a record salvaged once is never salvaged again
  // (cross-restart double-send is additionally blocked by the stable outbox
  // dedupe key).
  const salvaged = new Set<string>();

  return {
    async salvage(rec, sessionId) {
      if (!sessionId || salvaged.has(rec.messageId)) return false;
      let events: readonly unknown[] | undefined;
      try {
        const loaded = await deps.loadSession(sessionId);
        events = loaded?.events;
      } catch (err) {
        deps.logger?.warn(
          `replay-salvage: loadSession(${sessionId}) failed: ${err instanceof Error ? err.message : String(err)}`,
        );
        return false;
      }
      if (!events || events.length === 0) return false;
      // Newest first: the LAST assistant message of the session.
      for (let i = events.length - 1; i >= 0; i--) {
        const text = assistantTextOf(events[i]);
        if (text === undefined) continue;
        const time = (events[i] as { time?: number }).time;
        // Ordering proof: only an output recorded AFTER the request was
        // accepted answers THIS request. Without a timestamp we cannot prove
        // that — fall back to the normal replay path instead of guessing.
        if (typeof time !== "number" || time < rec.acceptedAt) return false;
        if (!text || text.trim() === "" || text === "No response.") return false;
        try {
          await deps.enqueue({
            dedupeKey: `wal-salvage:${rec.messageId}`,
            laneKey: rec.sessionKey,
            route: {
              sessionKey: rec.sessionKey,
              chatId: rec.chatId,
              chatType: rec.chatType,
            },
            kind: "assistant-output",
            payload: { kind: "text", text },
          });
        } catch (err) {
          deps.logger?.warn(
            `replay-salvage: enqueue failed for ${rec.messageId}: ${err instanceof Error ? err.message : String(err)}`,
          );
          return false;
        }
        salvaged.add(rec.messageId);
        deps.wal.delivered(rec.messageId);
        deps.logger?.info(
          `replay-salvage: answered ${rec.messageId} from session ${sessionId} (no agent re-run)`,
        );
        return true;
      }
      return false;
    },
  };
```

</details>

**依据 7 · 源码核查**：[src/index.ts:767-776](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L767-L776)

真实以route.lastMessageId标WAL完成。

<details>
<summary>查看原文（10行）</summary>

```text
		// Durable output enqueued → the triggering user request has been
		// answered, so it won't be re-triggered after a crash. Best-effort.
		onDelivered: (sessionKey) => {
			try {
				const route = routeStore.get(sessionKey);
				if (route?.lastMessageId) inboundWal.delivered(route.lastMessageId);
			} catch {
				// swallow — WAL failures never break delivery
			}
		},
```

</details>

**依据 8 · 源码核查**：[src/sessions/conversation-config.ts:39-81](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/conversation-config.ts#L39-L81)

映射/目录配置真实直接写/失败吞下。

<details>
<summary>查看原文（43行）</summary>

```text
	let data: Record<string, ConversationOverrides> = {};
	try {
		const parsed = JSON.parse(readFileSync(file, "utf8")) as Record<
			string,
			ConversationOverrides
		>;
		if (parsed && typeof parsed === "object") data = parsed;
	} catch {
		// first run — no file yet
	}

	const persist = (): void => {
		try {
			writeFileSync(file, JSON.stringify(data, null, 2), { mode: 0o600 });
		} catch {
			// best-effort; in-memory overrides still work
		}
	};

	const clean = (o: ConversationOverrides): ConversationOverrides => {
		const out: ConversationOverrides = {};
		if (o.workspaceRoot) out.workspaceRoot = o.workspaceRoot;
		if (o.provider) out.provider = o.provider;
		if (o.model) out.model = o.model;
		if (o.preset) out.preset = o.preset;
		if (o.activeSessionId) out.activeSessionId = o.activeSessionId;
		return out;
	};

	return {
		get(key) {
			return data[key] ? { ...data[key] } : {};
		},
		set(key, partial) {
			const merged = clean({ ...(data[key] ?? {}), ...partial });
			if (Object.keys(merged).length === 0) delete data[key];
			else data[key] = merged;
			persist();
		},
		clear(key) {
			delete data[key];
			persist();
		},
```

</details>

#### 缺口

- 崩溃/磁盘坏/队列关联与外部工具幂等、salvage正确归属未测。
  **影响**：不能用“零丢失”描述全部请求/副作用可靠性。
  **进一步探讨**：保持自动重放关闭，固定执行后无最终输出/写盘失败/两请求排队样例逐一对账再人工决定重试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Outbox如何真实发飞书，送达和取消有什么边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

assistant/message形成稳定messageId dedupeKey并enqueue，CardKit为可选预览/最终失败退outbox；出站内存队列按lane串行，跨lane可并行，payload大时spill文件，persist tmp+rename失败仍吞下继续。enqueue在stopped/重复/pendingCap满时返回undefined不抛错，event-forwarder不核返回值仍onDelivered，入站因此可能被标完成而实际没有新出站记录，容量/关闭不是零丢失保证。

deliverOne标sending再调用sender；sender实际转SDK im.message.create，参数没有本outbox的dedupeKey/uuid，发送成功→本地done持久之间崩溃、SDK已接受但响应丢失时重试可能重复。该key主要约束本地enqueue，不能说飞书exactly-once；SDK错误均标retryable，重试到上限/fatal后放弃，坏blob也fatal。用户是否看到/模型结果正确均不由SDK返回证明。

stop设置stopped并等当前activeDeliveries allSettled，不向SDK传取消/超时signal，不保证快速停止已在网络发送；conversations.disposeAll也不能撤回已做磁盘/远端副作用。恢复要查本地envelope、DSH日志和飞书实际message，未知先停止新投递/重放，不能盲重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/outbound/event-forwarder.ts:133-172](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/event-forwarder.ts#L133-L172)

真实message稳定key/enqueue后无返回核验即onDelivered。

<details>
<summary>查看原文（40行）</summary>

```text
        // Each complete assistant output is delivered as ONE Feishu message
        // (pi bdbc0a2: 每轮输出逐条发, turn_end 不再重复发最终). Empty output
        // (e.g. goal-activation turns) is skipped entirely (pi 5ac1c3d).
        const text = st.acc.length > event.text.length ? st.acc : event.text;
        st.acc = "";
        if (!text || text.trim() === "" || text === "No response.") return;
        st.hasOutput = true;
        if (st.stream && !st.stream.disposed) {
          // Streaming card active: settle it. On ANY failure fall through to
          // the durable outbox so content is never lost.
          try {
            const finalId = await st.stream.finalize(text);
            if (!finalId) throw new Error("CardKit finalize returned empty cardId");
            st.stream = undefined;
            deps.onDelivered?.(sessionKey); // card is final — treat as delivered
            return;
          } catch {
            st.stream = undefined;
            // fall through → outbox
          }
        }
        await deps.outbox.enqueue({
          // GH #15: key idempotency on DSH's stable AssistantMessage.id when
          // available. The previous `text.length:Date.now()` key was UNIQUE
          // on every enqueue, so a duplicated event delivery (leaked
          // session/event subscription) produced two identical Feishu
          // messages — and two different replies of equal length within the
          // same millisecond could be wrongly collapsed instead. The
          // Date.now() fallback only applies when messageId is absent
          // (legacy mocks), preserving prior behavior there.
          dedupeKey: event.messageId
            ? `${sessionKey}:assistant:msg:${event.messageId}`
            : `${sessionKey}:assistant:${text.length}:${Date.now()}`,
          laneKey: sessionKey,
          route: routeRefFor(route),
          kind: "assistant-output",
          payload: { kind: "text", text },
        });
        deps.onDelivered?.(sessionKey); // durable enqueue — request is delivered
        break;
```

</details>

**依据 2 · 源码核查**：[src/outbound/outbox.ts:170-192](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/outbox.ts#L170-L192)

真实outbox tmp写/rename/失败吞。

<details>
<summary>查看原文（23行）</summary>

```text
  function persistAll(): void {
    try {
      const segFile = segmentPath(Math.floor(now() / 1000));
      const lines = [...envelopes.values()].map((e) => JSON.stringify(e));
      // Rewrite a fresh segment for crash consistency (segment per flush batch).
      const tmp = `${segFile}.tmp`;
      writeFileSync(tmp, lines.join("\n") + "\n", { mode: 0o600 });
      renameSync(tmp, segFile);
      // Drop old segments beyond retention.
      const cutoff = now() - deps.cfg.retainDays * 86_400_000;
      for (const f of readdirSync(dir).filter((x) => /^seg-\d+\.jsonl$/.test(x))) {
        const ts = Number(basename(f).match(/\d+/)?.[0] ?? 0) * 1000;
        if (ts < cutoff) {
          try {
            rmSync(join(dir, f));
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // persistence best-effort; in-memory continues
    }
```

</details>

**依据 3 · 源码核查**：[src/outbound/outbox.ts:221-283](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/outbox.ts#L221-L283)

实际enqueue未接纳返回undefined与sending→sender。

<details>
<summary>查看原文（63行）</summary>

```text
  function enqueue(input: {
    dedupeKey: string;
    laneKey: string;
    route: RouteRef;
    kind: OutboundEnvelope["kind"];
    payload: EnvelopePayload;
    skipDedupe?: boolean;
  }): string | undefined {
    if (stopped) return undefined;
    // Idempotency is enforced at ENQUEUE time (any status): a dedupeKey that
    // has ever been enqueued is never delivered twice (at-least-once, not
    // at-most-once per enqueue — the SAME logical message must not double-send
    // even when two enqueues race within one drain window).
    if (!input.skipDedupe && sentKeys.has(input.dedupeKey)) return undefined;
    if (envelopes.size >= deps.cfg.pendingCap) {
      // Hard cap: refuse rather than unbounded growth.
      return undefined;
    }
    const id = randomUUID();
    const spilled = spill(input.payload);
    const env: DiskEnvelope = {
      id,
      dedupeKey: input.dedupeKey,
      laneKey: input.laneKey,
      route: input.route,
      kind: input.kind,
      status: "pending",
      attempts: 0,
      nextRetryAt: now(),
      createdAt: now(),
      updatedAt: now(),
      ...spilled,
    };
    envelopes.set(id, env);
    sentKeys.set(input.dedupeKey, id);
    const lane = lanes.get(input.laneKey) ?? [];
    lane.push(id);
    lanes.set(input.laneKey, lane);
    persistAll();
    // Wake an idle pump immediately — zero poll latency for new work.
    idleWake?.();
    emitStats();
    return id;
  }

  // ---- drain -------------------------------------------------------------
  async function deliverOne(id: string): Promise<void> {
    const env = envelopes.get(id);
    if (!env || env.status === "done" || env.status === "fatal") return;
    const payload = resolvePayload(env);
    if (!payload) {
      env.status = "fatal";
      env.error = "payload unresolved (blob missing)";
      env.updatedAt = now();
      return;
    }
    env.status = "sending";
    env.updatedAt = now();
    // Sender sees a fully-resolved envelope (payload always present here).
    const resolved: OutboundEnvelope = { ...env, payload } as OutboundEnvelope;
    const result = await deps.sender.deliver(resolved, payload);
    if (result.ok) {
      env.status = "done";
```

</details>

**依据 4 · 源码核查**：[src/outbound/outbox.ts:280-306](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/outbox.ts#L280-L306)

实际成功done/有界retry/fatal。

<details>
<summary>查看原文（27行）</summary>

```text
    const resolved: OutboundEnvelope = { ...env, payload } as OutboundEnvelope;
    const result = await deps.sender.deliver(resolved, payload);
    if (result.ok) {
      env.status = "done";
      env.updatedAt = now();
      if (env.dedupeKey) sentKeys.set(env.dedupeKey, env.id);
    } else {
      env.attempts += 1;
      env.error = result.error;
      env.updatedAt = now();
      if (!result.retryable || isFatal(result.error)) {
        env.status = "fatal";
      } else if (env.attempts >= deps.cfg.maxAttempts) {
        // Attempts exhausted — give up (ADR-4: bounded attempts then fatal).
        env.status = "fatal";
      } else {
        env.status = "failed";
        // Bounded exponential backoff, ceiling at backoffMaxMs.
        const backoff = Math.min(deps.cfg.backoffMaxMs, 1000 * 2 ** Math.min(env.attempts - 1, 10));
        env.nextRetryAt = now() + backoff;
      }
    }
    // A failed message is NOT re-inserted at the lane head (F1 fix): it was
    // already removed from its lane position at drain; it stays failed and is
    // re-drained by the retry sweep. New messages in the lane proceed.
    persistAll();
    emitStats();
```

</details>

**依据 5 · 源码核查**：[src/index.ts:575-594](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L575-L594)

真实sender分发/错误一律retryable。

<details>
<summary>查看原文（20行）</summary>

```text
	const outboxSender: OutboxSender = {
		async deliver(env, payload) {
			const chatId = env.route.chatId;
			try {
				if (payload.kind === "text") {
					if (payload.card !== undefined)
						await sender.sendCard(chatId, payload.card);
					else await sender.sendText(chatId, payload.text);
				} else if (payload.kind === "card") {
					await sender.sendCard(chatId, payload.card);
				} else if (payload.kind === "media") {
					await sender.sendFile(chatId, payload.fileKey, payload.type);
				} else if (payload.kind === "reaction") {
					await sender.addReaction(payload.messageId, payload.emojiType);
				}
				return { ok: true };
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				return { ok: false, retryable: true, error: message };
			}
```

</details>

**依据 6 · 源码核查**：[src/index.ts:455-483](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L455-L483)

真实文本/Markdown发送形状无uuid/dedupeKey。

<details>
<summary>查看原文（29行）</summary>

```text
		async sendText(chatId, text) {
			const client = getLarkClient();
			if (!client?.sendMessage) throw new Error("lark client not ready");
			// Markdown-ish replies render as schema-1.0 cards (Feishu renders the
			// markdown element in every client — old and new). Schema 2.0 cards
			// break older clients ("请升级至最新版本客户端" placeholder), and plain
			// text shows raw markdown source. 1.0 is the compatible middle
			// ground; oversize replies fall back to plain text.
			if (looksLikeMarkdown(text) && text.length <= 28_000) {
				await client.sendMessage({
					receive_id_type: chatId.startsWith("oc_") ? "chat_id" : "open_id",
					params: {
						receive_id: chatId,
						msg_type: "interactive",
						content: JSON.stringify(markdownCard(text)),
					},
				});
				return;
			}
			await client.sendMessage({
				receive_id_type: chatId.startsWith("oc_") ? "chat_id" : "open_id",
				params: {
					receive_id: chatId,
					msg_type: "text",
					content: JSON.stringify({ text }),
				},
			});
		},
		async sendCard(chatId, card) {
```

</details>

**依据 7 · 源码核查**：[src/host/lark-client.ts:271-281](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/host/lark-client.ts#L271-L281)

实际SDK im.message.create。

<details>
<summary>查看原文（11行）</summary>

```text
		async sendMessage(params) {
			// sender shape: { receive_id_type, params: { receive_id, msg_type, content } }
			const p = params as {
				receive_id_type: string;
				params: Record<string, unknown>;
			};
			return sdkClient.im.message.create({
				params: { receive_id_type: p.receive_id_type },
				data: p.params,
			});
		},
```

</details>

**依据 8 · 源码核查**：[src/outbound/outbox.ts:415-422](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/outbox.ts#L415-L422)

stop等当前发送，不发取消。

```text
    async stop() {
      stopped = true;
      if (pruneTimer) clearInterval(pruneTimer);
      pruneTimer = undefined;
      await Promise.allSettled([...activeDeliveries]);
    },
    pendingCount() {
      let n = 0;
```

**依据 9 · 源码核查**：[src/index.ts:2260-2276](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L2260-L2276)

实际停止桥/出站/会话清理。

<details>
<summary>查看原文（17行）</summary>

```text
		await supervisor?.stop();
		supervisor = undefined;
		await outbox.stop();
		await conversations.disposeAll();
		bridge.setStarted(false);
		status.setConn("stopped");
		lifecycleStarted = false;
		logger.info("bridge stopped");
	};

	// ---- tools ------------------------------------------------------------------
	ctx.tools.register(
		defineTool({
			name: "lark_send_local_file",
			description: "Send a local file or image to the current Feishu chat.",
			parameters: {
				path: {
```

</details>

#### 缺口

- 真实SDK幂等/断网/终止时限、重启回放送达和全部CardKit路径未测。
  **影响**：不作零丢失/不重复送达/stop已撤回承诺。
  **进一步探讨**：故障矩阵核SDK已接受响应丢失、pendingCap满与写盘失败，人工比飞书message后再重试。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 文件、诊断和工作区的敏感副作用怎样限制？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

lark_send_local_file按当前Agent反查route/工作区，resolve/relative做lexical containment，stat上限25MB后readFile、SDK upload再sendFile；这是实际数据出站，不是path声明。未realpath/lstat拒symlink，stat/read跟随链接，不能把路径字符串白名单当物理目录隔离；/workspace可改目录，Host默认full access更不能依桥过滤当权限边界。stat与read之间竞态/累计量未验，25MB也非所有进出站预算。

入站文件先SDK下载Buffer并写本地，再仅buf<=150000才文本提取；“有界文本提取”不是下载/磁盘总量上限。媒体有保留期清理，永久文件/会话日志/配置仍要管。文件内容直接拼用户文本并给Host，来源不可信/提示注入须模型和Host权限另控，本轮不执行。

/doctor构造脱敏配置报告，但ZIP还readRaw当前完整session及子Agent日志、直接打包上传回飞书；代码未在这些raw字节处redact，不能把ISSUE.md脱敏外推整ZIP安全，fallback findLatest session归属也需审。诊断可能含私密提示/文件/工具结果，须先离线核原始zip范围，不直接贴公共issue。QR/Web管理/凭据所有入口与SDK网络本轮未全审，限制采用而不以脱敏宣传作完备保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/common/paths.ts:45-64](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/common/paths.ts#L45-L64)

真实lexical resolve/relative，无realpath。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Resolve a file path for the lark_send_local_file tool and check that it
 * stays inside the workspace root (GH #7).
 * Returns { abs, ok } — ok=false means the path escapes the workspace and
 * must be rejected (拒绝: 路径不在工作区内).
 */
export function resolveInWorkspacePath(
	p: string,
	root: string,
): { abs: string; ok: boolean } {
	const abs = isAbsoluteAny(p) ? resolveWorkspaceTarget(p, root) : resolve(join(root, p));
	// Containment via relative(): safe against case and separator variance.
	// Pick the family that matches the inputs so drive-letter roots compare
	// correctly even when the host is posix.
	const useWin = win32.isAbsolute(root) || win32.isAbsolute(abs);
	const rel = useWin ? win32.relative(root, abs) : relative(root, abs);
	const ok =
		rel === "" || (!rel.startsWith("..") && !isAbsolute(rel) && !win32.isAbsolute(rel));
	return { abs, ok };
}
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2290-2367](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L2290-L2367)

真实当前route/路径/25MB/stat-read/上传发送。

<details>
<summary>查看原文（78行）</summary>

```text
				schema: { type: "string" },
				render: (_args, value) => [{ type: "text", text: value as string }],
			},
			async execute(args, exec) {
				// Resolve the requesting conversation FIRST: exec.agent.id is the
				// bridge session id (lark-link:dm:ou_x:nonce). The session id
				// carries the per-run nonce suffix while route keys do not —
				// prefer the backend reverse map, else strip the trailing nonce.
				const sessionId = (exec as { agent?: { id?: string } }).agent?.id ?? "";
				// The agent's workspace is its conversation's workspace (per-key
				// override ?? config.workspaceRoot; may differ from the dsh process
				// cwd after /workspace) — resolve relative paths against it and
				// whitelist it. Using process.cwd() wrongly rejects files the agent
				// just created in its workspace.
				const convKeyForWs =
					bridge.backend?.keyForSessionId?.(sessionId) ?? sessionId;
				const workspaceRoot =
					convCfg.get(convKeyForWs).workspaceRoot ??
					(getCfg().workspaceRoot || process.cwd());
				// GH #7: drive-letter paths are absolute too, and containment
				// must use relative() — startsWith("/") joined a Windows
				// absolute path under the root and then always rejected it.
				const { abs, ok: inWorkspace } = resolveInWorkspacePath(
					args.path,
					workspaceRoot,
				);
				if (!inWorkspace) return "拒绝: 路径不在工作区内";
				const prefix = "lark-link:";
				const backendKey = bridge.backend?.keyForSessionId?.(sessionId);
				const key =
					backendKey ??
					(sessionId.startsWith(prefix)
						? sessionId.slice(prefix.length).replace(/:[a-z0-9]{8,}$/, "")
						: sessionId);
				const route = routeStore.get(key);
				if (!route) return "错误: 无法定位当前飞书会话";
				const client = getLarkClient();
				if (!client) return "错误: lark 客户端未就绪";
				// Feishu image upload only accepts raster formats — non-raster
				// (svg etc.) falls back to file upload regardless of kind.
				const IMAGE_EXT = /\.(png|jpe?g|webp|gif)$/i;
				const isImage = args.kind === "image" && IMAGE_EXT.test(args.path);
				if (isImage ? !client.uploadImage : !client.uploadFile)
					return "错误: lark 客户端未就绪";
				let buf: Buffer;
				try {
					const st = statSync(abs);
					if (st.size > 25 * 1024 * 1024) return "错误: 文件超过 25MB 上限";
					buf = readFileSync(abs);
				} catch (err) {
					return `错误: 读取文件失败 (${err instanceof Error ? err.message : String(err)})`;
				}
				const fileName = args.path.split(/[\\/]/).pop() ?? "file";
				// Tolerate both real top-level and legacy {data:{...}} shapes (pi 2026-08-14).
				let uploadKey: string | undefined;
				if (isImage) {
					uploadKey = extractUploadKey(
						await client.uploadImage!({ image: buf }),
						"image_key",
					);
				} else {
					uploadKey = extractUploadKey(
						await client.uploadFile!({
							file_type: "file",
							file_name: fileName,
							file: buf,
						}),
						"file_key",
					);
				}
				if (!uploadKey) return "错误: 上传失败";
				await sender.sendFile(
					route.chatId,
					uploadKey,
					isImage ? "image" : "file",
				);
				return `已发送 ${args.path}`;
			},
```

</details>

**依据 3 · 源码核查**：[src/application/message-handler.ts:168-222](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/application/message-handler.ts#L168-L222)

真实下载/落盘后才150000文本限制。

<details>
<summary>查看原文（55行）</summary>

```text
		} else if (msg.msgType === "file") {
			const parsed = JSON.parse(msg.content ?? "{}") as {
				file_key?: string;
				file_name?: string;
			};
			const key = parsed.file_key;
			const name = parsed.file_name ?? "附件";
			if (key && ctx.transport) {
				const buf = await ctx.transport.downloadResource({
					messageId: msg.messageId,
					fileKey: key,
					type: "file",
				});
				if (buf && buf.length > 0) {
					// Persist the raw file locally too (same rationale as images).
					let localPath: string | undefined;
					if (inboundDir) {
						try {
							mkdirSync(join(inboundDir, "media"), { recursive: true });
							const path = join(
								inboundDir,
								"media",
								`feishu-${sanitizeAttachmentName(msg.messageId)}-${Date.now()}-${sanitizeAttachmentName(name)}`,
							);
							writeFileSync(path, buf);
							localPath = path;
						} catch (err) {
							ctx.logger.warn(
								`inbound file persist failed: ${err instanceof Error ? err.message : String(err)}`,
							);
						}
					}
					out.push({
						path: localPath ?? "feishu://file",
						kind: "file",
						name,
					});
					// Bounded text extraction for text-ish files.
					const MAX = 150_000;
					if (buf.length <= MAX) {
						const text = buf.toString("utf8");
						if (text && !text.includes("\uFFFD")) {
							out.push({
								path: "feishu://file-text",
								kind: "file",
								name: `${name} 内容提取`,
								textPreview: text,
							});
						}
					}
				}
			}
		}
	} catch (err) {
		ctx.logger.warn(
```

</details>

**依据 4 · 源码核查**：[src/application/media-retention.ts:29-54](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/application/media-retention.ts#L29-L54)

实际mtime媒体清理。

<details>
<summary>查看原文（26行）</summary>

```text
): SweepResult {
	if (!(retentionHours > 0)) return { deleted: 0, errors: 0 };
	let entries: string[];
	try {
		entries = readdirSync(mediaDir);
	} catch {
		return { deleted: 0, errors: 0 }; // missing dir — nothing to sweep
	}
	const cutoff = now - retentionHours * 3_600_000;
	let deleted = 0;
	let errors = 0;
	for (const name of entries) {
		const p = join(mediaDir, name);
		try {
			const st = statSync(p);
			if (st.isFile() && st.mtimeMs < cutoff) {
				// force + maxRetries: on Windows a file still held open (the
				// model reading it via read_image) fails with EBUSY/EPERM —
				// retry briefly, then leave it for the next hourly sweep.
				// Node's rm retries only the transient errno set, so this is
				// safe on every platform.
				rmSync(p, { force: true, maxRetries: 3, retryDelay: 100 });
				deleted++;
			}
		} catch {
			errors++; // raced away / unreadable — skip, next sweep retries
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1042-1085](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L1042-L1085)

doctor真实ZIP上传/回飞书。

<details>
<summary>查看原文（44行）</summary>

```text
				const diag = await diagnostics.build();
				const client = getLarkClient();
				if (client?.uploadFile) {
					try {
						const key = bridge.conversationKeyFor(msg);
						const sessionId =
							bridge.backend?.get(key)?.sessionId ?? findLatestLarkSessionId();
						const zipBuf = sessionId
							? await buildSessionExportZip(sessionId, diag.text, diag.issueMd)
							: undefined;
						if (zipBuf) {
							const fileName = `lark-link-doctor-${Date.now()}.zip`;
							const uploadKey = extractUploadKey(
								await client.uploadFile({
									file_type: "file",
									file_name: fileName,
									file: zipBuf,
								}),
								"file_key",
							);
							if (uploadKey) {
								await sender.sendFile(msg.chatId, uploadKey, "file");
								return true;
							}
						}
						// No session log or zip failed — send the report as a file.
						const fileName = `lark-link-doctor-${Date.now()}.md`;
						const buf = Buffer.from(
							`# dsh-lark-link 诊断包\n\n${diag.text}\n\n${diag.issueMd}\n`,
							"utf8",
						);
						const uploadKey = extractUploadKey(
							await client.uploadFile({
								file_type: "file",
								file_name: fileName,
								file: buf,
							}),
							"file_key",
						);
						if (uploadKey) {
							await sender.sendFile(msg.chatId, uploadKey, "file");
							return true;
						}
					} catch (err) {
```

</details>

**依据 6 · 源码核查**：[src/index.ts:2599-2673](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L2599-L2673)

真实root/子Agent raw session字节入zip材料。

<details>
<summary>查看原文（75行）</summary>

```text
	const buildSessionExportZip = async (
		sessionId: string,
		diagText: string,
		issueMd: string,
	): Promise<Buffer | undefined> => {
		try {
			const services = ctx as unknown as {
				get?(name: string): unknown;
			};
			const persistence = services.get?.("sessionPersistence") as
				| {
						readRaw?(
							id: string,
						): Promise<
							{ filename: string; content: string; meta?: unknown } | undefined
						>;
				  }
				| undefined;
			const query = services.get?.("sessionQuery") as
				| {
						traceSession?(id: string): Promise<{
							descendants: Array<{
								session: { header: { id: string } };
								descendants: Array<{
									session: { header: { id: string } };
									descendants: unknown[];
								}>;
							}>;
						}>;
				  }
				| undefined;
			const files: Array<{ name: string; data: Uint8Array }> = [];

			// Primary: same shape as the webui "Session log" download via the
			// sessionPersistence service.
			let root: { filename: string; content: string } | undefined;
			if (persistence?.readRaw) {
				try {
					root = await persistence.readRaw(sessionId);
				} catch (err) {
					logger.warn(
						`doctor: sessionPersistence.readRaw failed: ${err instanceof Error ? err.message : String(err)}`,
					);
				}
			} else {
				logger.warn(
					"doctor: sessionPersistence service unavailable — falling back to file scan",
				);
			}
			if (root) {
				files.push({
					name: root.filename,
					data: Buffer.from(root.content, "utf8"),
				});
				// Descendant (subagent) logs.
				const seen = new Set<string>([sessionId]);
				const collect = async (
					nodes: Array<{
						session: { header: { id: string } };
						descendants: unknown[];
					}>,
				): Promise<void> => {
					for (const node of nodes) {
						const id = node.session.header.id;
						if (seen.has(id)) continue;
						seen.add(id);
						const raw = await persistence?.readRaw?.(id);
						if (raw !== undefined) {
							const safe = id.replace(/[^A-Za-z0-9_-]/g, "_");
							files.push({
								name: `subagents/${safe}/${raw.filename}`,
								data: Buffer.from(raw.content, "utf8"),
							});
						}
						await collect((node.descendants ?? []) as typeof nodes);
```

</details>

**依据 7 · 源码核查**：[src/index.ts:2748-2758](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L2748-L2758)

真实zipSync直接压这些字节。

<details>
<summary>查看原文（11行）</summary>

```text
			// zipSync returns the archive directly — the streaming Zip callback
			// fires asynchronously, so reading its output synchronously would
			// yield an empty buffer).
			const { zipSync, strToU8 } = await import("fflate");
			const entries: Record<string, Uint8Array> = {};
			for (const f of files) {
				entries[f.name] = strToU8(new TextDecoder().decode(f.data));
			}
			const buf = Buffer.from(zipSync(entries, { level: 6 }));
			logger.info(
				`doctor: zip built (${files.length} files, ${buf.length} bytes)`,
```

</details>

**依据 8 · 源码核查**：[src/application/diagnostics-service.ts:20-36](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/application/diagnostics-service.ts#L20-L36)

仅报告配置redact位置。

<details>
<summary>查看原文（17行）</summary>

````text
export function createDiagnosticsService(deps: DiagnosticsDeps): DiagnosticsService {
  return {
    async build() {
      const s = deps.ctx.status.get();
      const cfg = deps.ctx.cfg();
      const lines: string[] = [
        "# dsh-lark-link 诊断包",
        "",
        `生成时间: ${new Date().toISOString()}`,
        `桥状态: ${deps.ctx.started() ? "运行中" : "未启动"}`,
        ...statusDetailLines(s),
        "",
        "## 配置（脱敏）",
        "```json",
        redactSecrets(JSON.stringify(cfg, null, 2), deps.secrets),
        "```",
      ];
````

</details>

#### 缺口

- 全部媒体资源上限/链接竞态、诊断日志秘密、管理路由认证/凭据保护与SDK运行未测。
  **影响**：不放敏感目录/群成员/生产凭据，不向外直接发诊断zip。
  **进一步探讨**：只用无链接低敏副本，核真实权限与ZIP原始内容/接收者再决定发送。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前应采用到什么程度，什么方向值得独立验证？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

建议观察，面向想在手机派任务的私人DSH用户，先离线核所有入口授权、实际只读生效和持久/回放语义；默认开放/Full access与卡片入口不一致未修清前，不接真实账号/群或生产目录。相对Web/终端，它集中远程输入/结果与卡片，但没有证明净成功率/运维节时，已有Agent的人审分工也未因换通道改变。

首次飞书应用/权限/SDK/Host/凭据配置，持续模型/工具/消息配额/日志媒体磁盘、人工任务验收和隐私，失败重复任务/未知送达/写盘丢失/权限回退恢复，退出应用权限/Key/留存清理的现金工时未知不填0。重连quota不是模型/外部副作用费用上限，maxSessions在所核manager为尽力释放非强占满拒绝，须独立预算；stop/删除会话不撤销飞书与工作区副作用。

独立假设：统一文本/卡片/管理入口操作者与逐请求operation_id，把可靠接受、Host执行外部效果、飞书接受分别记录，并对未知结果人工对账，可能比继续加卡片/重试更减少越权和重复执行。先比现有官方Web加人工清单/关闭自动重放与小修拒绝写盘失败，固定WAL写失败、已执行无输出、cap满、SDK响应丢失、群卡片错操作者、链接出站样例，测越权/重复/漏回、恢复人时与总成本；若清单足够或维护更重则放弃，不算当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/common/config.ts:159-173](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/common/config.ts#L159-L173)

当前权限与replay默认。

<details>
<summary>查看原文（15行）</summary>

```text
	maxSessions: 32,
	allowlist: [],
	workspaceRoot: "",
	agentPreset: "ptc",
	permissionMode: "danger-full-access",
	replay: {
		// GH #14: keep the existing zero-loss default (auto replay ON);
		// opt out via /lark-config replay.auto=false or DSH_LARK_AUTO_REPLAY=0.
		auto: true,
		retentionMinutes: 30,
		maxAttempts: 2,
	},
};

/**
```

</details>

**依据 2 · 源码核查**：[src/sessions/conversation-manager.ts:71-79](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/sessions/conversation-manager.ts#L71-L79)

当前cap仅尽力释放/等待。

```text
	const ensureUnderCap = async (): Promise<void> => {
		if (deps.backend.size() < deps.maxSessions) return;
		deps.backend.disposeIdle(0); // dispose all idle first
		if (deps.backend.size() >= deps.maxSessions) {
			// Everything busy: brief wait for a slot, then dispose idle again.
			await new Promise((r) => setTimeout(r, 250));
			deps.backend.disposeIdle(0);
		}
	};
```

**依据 3 · 源码核查**：[src/inbound/inbound-wal.ts:133-160](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/inbound/inbound-wal.ts#L133-L160)

当前持久失败不阻断。

<details>
<summary>查看原文（28行）</summary>

```text
  function persistAll(): void {
    try {
      const segFile = join(
        dir,
        `seg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jsonl`,
      );
      const tmp = `${segFile}.tmp`;
      const lines = [...records.values()].map((r) => JSON.stringify(r));
      writeFileSync(tmp, lines.join("\n") + "\n", { mode: 0o600 });
      let oldSegs: string[] = [];
      try {
        oldSegs = readdirSync(dir).filter((f) => /^seg-.*\.jsonl$/.test(f));
      } catch {
        oldSegs = [];
      }
      renameSync(tmp, segFile);
      for (const old of oldSegs) {
        if (old !== basename(segFile)) {
          try {
            rmSync(join(dir, old), { force: true });
          } catch {
            // best-effort cleanup
          }
        }
      }
    } catch {
      // best-effort persistence; in-memory continues
    }
```

</details>

**依据 4 · 源码核查**：[src/outbound/outbox.ts:229-238](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/outbound/outbox.ts#L229-L238)

当前cap/未接纳。

<details>
<summary>查看原文（10行）</summary>

```text
    if (stopped) return undefined;
    // Idempotency is enforced at ENQUEUE time (any status): a dedupeKey that
    // has ever been enqueued is never delivered twice (at-least-once, not
    // at-most-once per enqueue — the SAME logical message must not double-send
    // even when two enqueues race within one drain window).
    if (!input.skipDedupe && sentKeys.has(input.dedupeKey)) return undefined;
    if (envelopes.size >= deps.cfg.pendingCap) {
      // Hard cap: refuse rather than unbounded growth.
      return undefined;
    }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1884-1909](https://github.com/amlyczz/dsh-lark-link/blob/4e38acb37b0ed00fd15f2f4edb0c7428c6fb9004/src/index.ts#L1884-L1909)

卡片独立入口身份边界。

<details>
<summary>查看原文（26行）</summary>

```text
			const cmd = sep === -1 ? op : op.slice(0, sep);
			const arg = sep === -1 ? "" : op.slice(sep + 1);
			// messageId must be UNIQUE per click: durableReply dedupes command
			// replies by `bridge:<cmd>:<messageId>`, and the card message id is
			// the same for every click on that card — a second click (e.g.
			// picking another model from the picker) used to be swallowed as a
			// duplicate, so the user got NO confirmation for the new choice.
			// chatType: reuse the known route for this chat so the pseudo message
			// lands on the right conversation lane (group vs dm).
			const knownRoute = routeStore.all().find((r) => r.chatId === chatId);
			const pseudo: FeishuInboundMessage = {
				messageId: messageId
					? `${messageId}#${op}`
					: `card#${Date.now()}#${op}`,
				chatId,
				chatType: knownRoute?.chatType === "group" ? "group" : "p2p",
				chatMode: knownRoute?.chatType === "group" ? "group_all" : "p2p",
				senderOpenId: chatId,
				msgType: "interactive",
				content: "",
				text: "",
				mentions: [],
				timestamp: Date.now(),
			};
			await bridgeHandler(cmd, arg, pseudo);
		} catch (err) {
```

</details>

#### 缺口

- 真实持续需求/任务成功/费用与统一身份收据净价值未知。
  **影响**：观察不是可以直接配置上线；先核权限/失败样例。
  **进一步探讨**：与官方Web/人工计划比较，越权/重复/恢复成本无改善即否定新方向。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
