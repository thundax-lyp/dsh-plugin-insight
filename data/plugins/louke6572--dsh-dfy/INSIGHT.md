# dsh-Dfy

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[df08522](https://github.com/louke6572/dsh-Dfy/tree/df08522f54aef92182524488ff2cbbeedde780fa)

<!-- BEGIN META -->
[![GitHub ★ 88](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=88&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/louke6572/dsh-Dfy) [![npm 30d 1,522](https://img.shields.io/static/v1?label=npm+30d&message=1%2C522&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dfy) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-dfy)
<!-- END META -->

> **功能**：DSH 桌宠与余额挂件套件，组合 QQ 桥接、B站互动及本地跨平台记忆管理。

> **亮点**：已有贡献是把陪伴界面、账户观察和两平台Agent状态组织到同一插件，并有QQ准入/工具白名单与记忆规则；不能从合并、动画数推断更安全或更值得持续使用，见[Q01](#research-q01)至[Q04](#research-q04)。

> **主要限制**：本机落盘不表示网络不外发，规则脱敏不保证语义匿名；QQ工具限制不能覆盖B站默认danger-full-access调度会话与自动go互动，见[Q03](#research-q03)、[Q04](#research-q04)和[Q06](#research-q06)。

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
  - [Q01 · 根项目是何类型、服务谁、增量在哪？](#detail-section-11)
  - [Q02 · QQ消息如何进入Agent并返回？](#detail-section-12)
  - [Q03 · 权限与工具白名单限制什么？](#detail-section-13)
  - [Q04 · 双向记忆的脱敏是否保证不外流？](#detail-section-14)
  - [Q05 · 余额挂件与价格说明能信到哪？](#detail-section-15)
  - [Q06 · B站自动互动与恢复副作用是什么？](#detail-section-16)
  - [Q07 · 全周期成本支持何种采用？](#detail-section-17)
  - [Q08 · 什么可验证改进值得考虑？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要陪伴界面、用量观察及专用账号持续互动的DSH用户，可按平台分层启用；合格交付需知道内容准出与停机边界，见[Q01](#research-q01)。

独立桌宠、厂商余额页面、QQ机器人与B站脚本可分别完成原任务；组合插件减少配置入口和角色状态搬运，尚无净采用收益对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 桌宠与挂件 | 本地陪伴/用量观察 | 可不启社交，动画数非收益证据 |
| QQ Agent桥接 | 消息入宿主循环并真实外发 | 依登录/白名单/token，非每条人工确认 |
| B站调度 | 独立会话自动阅读互动 | 默认权限与go副作用须单核 |
| 双向记忆 | 角色间派生本地简报 | 规则脱敏不保证语义匿名或不出机 |
| 余额账本 | 平台观测与事件估算 | 来源和人工校正，非现价账单 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需性 | 用途 | 缺失或边界 |
| --- | --- | --- | --- |
| Windows、Node>=22.13、兼容DSH | 作者声明主要环境 | Host/client与状态 | 本轮未运行安装 |
| API/账户凭据及可达接口 | 余额可选 | 查平台余额或估算 | 无接口显示来源差异，非账单 |
| SnowLuma登录、OneBot与宿主模型 | QQ可选 | 消息→Agent→真实发送 | accepted不等于送达/已读 |
| B站Cookie、调度与模型 | B站可选 | 自动读取与互动 | 默认会话权限需核，go可真发 |
| 可外发内容与本地可写目录 | 记忆条件 | 原始/派生/备份 | 本机存储不保证匿名或不出机 |

#### 分层验证

| 步骤 | 动作 | 成功与停止判据 |
| --- | --- | --- |
| 本地展示 | 平台自动启动/记忆均关，只看桌宠余额 | 核用量来源，不引账号 |
| QQ隔离验证 | 测试账号/自建群投递无敏感样本 | 核目标/白名单/真实发送 |
| B站单独验证 | 先读代码和权限配置再决定是否测试 | 不将dry当每条人工确认 |
| 记忆预览 | 核派生片段、身份和备份 | 规则通过不等于可外发 |
| 退出 | 停调度桥接、关开关、撤凭据 | 证明不再发；外部内容另管 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 未知 |
| --- | --- | --- | --- |
| 首次 | 安装依赖且postinstall修依赖文件 | 版本、扫码、凭据与权限配置 | 失败率/耗时未知 |
| 持续 | 桥接/调度、网络、模型、可选语音和存储 | 准入、内容监督与角色维护 | 金额/净收益未测 |
| 恢复 | 重试及原始/派生/备份 | 区分accepted、发送、账号/限流 | 不能承诺恰好一次 |
| 退出 | 存量数据与外部消息 | 停发、撤凭据、处理记录 | 外部已发不能靠关开关撤回 |

#### 效果

| 效果 | 当前证据 | 未证实 |
| --- | --- | --- |
| 统一陪伴入口 | 组合Host/界面与角色状态 | 动画数与持续采用价值 |
| QQ Agent | 宿主prompt与工具真实发送 | 账号隔离/恰好一次/回复质量 |
| 记忆 | 白名单、规则清洗与备份 | 语义匿名与跨平台同意 |
| 用量 | 来源标签与余额校正 | 现价/账单/节费 |

> **思考**：本机落盘不表示网络不外发，规则脱敏不保证语义匿名；QQ工具限制不能覆盖B站默认danger-full-access调度会话与自动go互动，见[Q03](#research-q03)、[Q04](#research-q04)和[Q06](#research-q06)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有贡献是把陪伴界面、账户观察和两平台Agent状态组织到同一插件，并有QQ准入/工具白名单与记忆规则；不能从合并、动画数推断更安全或更值得持续使用，见[Q01](#research-q01)至[Q04](#research-q04)。

根入口分依赖挂载有合理性，QQ schema隐藏与执行拒绝分层、记忆输出复检和余额来源区分值得借鉴。但多后台/角色状态增加恢复负担，B站权限不同，需按通道验收，见[Q03](#research-q03)至[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本机落盘不表示网络不外发，规则脱敏不保证语义匿名；QQ工具限制不能覆盖B站默认danger-full-access调度会话与自动go互动，见[Q03](#research-q03)、[Q04](#research-q04)和[Q06](#research-q06)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察。先仅本地展示且停社交/记忆自动化，后续如需验证只用专用测试账号和无敏感样本；错发、重复、泄密或不能证明停发时停止，回独立桌宠与人工社交，见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

根插件、真实QQ/模型/平台外发和本地记忆链有源码支持；隐私、权限、停发和采用收益未实测。准出预览为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、backend/lib/index.js、backend/lib/memory.js、backend/lib/privacy.js、backend/lib/scheduler.js、backend/qq-tool-restrict.mjs、backend/tools/commands/comment.mjs、cordis.patch.yml、lib/index.js、package.json、scripts/patch-snowluma-sdk.mjs、src/bridge.js、src/mcp-snowluma-safe.js、widget/lib/accounting.mjs、widget/lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对根组合、QQ入站准入/宿主投递/OneBot外发、preset执行白名单、安全MCP发送、QQ到B站记忆及隐私规则、widget余额来源、B站调度权限与评论CLI、安装postinstall。未穷举全部桌宠UI/动画、语音、反向记忆源、自动互动命令、角色迁移与更新器；不据组件名泛化全项目安全。
- 下一步：- 固定源码与作者材料检查，无目标执行。
- 未安装、登录账号、发送消息/评论、调用模型或改权限。
- 本地存储与网络外发区分，隐私声明保留作者/源码/未验证边界。
- 未核现价、平台政策及完整运行效果。

**分析版本**

- **仓库**：[louke6572/dsh-Dfy](https://github.com/louke6572/dsh-Dfy)
- **版本号**：0.7.3（[固定提交 df08522](https://github.com/louke6572/dsh-Dfy/tree/df08522f54aef92182524488ff2cbbeedde780fa)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是给跨平台记忆增加按来源与版本的准出预览和撤销映射，比较漏出、错杀与审阅负担，不承诺撤回已发内容，见[Q08](#research-q08)。

- 固定源码与作者材料检查，无目标执行。
- 未安装、登录账号、发送消息/评论、调用模型或改权限。
- 本地存储与网络外发区分，隐私声明保留作者/源码/未验证边界。
- 未核现价、平台政策及完整运行效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 7407 | — | — | 52349 |
| .js | source | 119 | 96680 | 85001 | 9019 | — |
| .mjs | source | 118 | 18978 | 14737 | 3253 | — |
| .md | example | 2 | 59 | — | — | 583 |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/louke6572/dsh-Dfy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/louke6572/dsh-Dfy/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/louke6572/dsh-Dfy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌宠、用量与QQ/B站桥接如何形成真实插件交付，外发和跨平台记忆边界能否支撑采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是何类型、服务谁、增量在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是可挂载的DSH原生组合插件，不是单独QQ服务或桌宠素材库。package导出Host/client，cordis patch挂主插件与qq-mode配置垫片，lib/index立即挂widget，再等服务应用SurfCore后端。面向希望在DSH用陪伴界面观察用量、并以QQ/B站人格持续互动的人；不用社交时桌宠可独立使用，不应把连接全部平台当必要前提。

原办法是独立桌宠/余额页面加QQ机器人和B站脚本，贡献是统一入口、角色状态与跨平台记忆组织。动画段数不证明用户价值，QQ消息卡展示不等于Agent安全执行。“数据只存本机”仅能限定本地状态落盘，不能覆盖模型请求、QQ发送和B站互动的网络外发。合格交付是用户知道开启哪些平台、哪些内容会被模型/他人看到，并能停止后台。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-43](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/package.json#L1-L43)

真实Host/client和postinstall。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "dsh-dfy",
  "version": "0.7.3",
  "displayName": "dsh-Dfy",
  "description": "QQ × B站 × 桌宠一体化插件：统一设置窗口、小鲸鱼余额挂件、106 段透明动画桌宠、QQ 消息卡与双向脱敏记忆。",
  "type": "module",
  "engines": {
    "node": ">=22.13.0"
  },
  "icon": "./icon.png",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./qq-tool-restrict.mjs": "./backend/qq-tool-restrict.mjs",
    "./icon": "./icon.png",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "scripts": {
    "setup": "node scripts/setup-dsh.mjs",
    "build": "node build.mjs",
    "presets": "node scripts/build-agent-preset-patches.mjs",
    "snowluma": "node scripts/install-snowluma.mjs",
    "audit": "node widget/tools/ci-audit.mjs --no-pack",
    "postinstall": "node scripts/patch-snowluma-sdk.mjs"
  },
  "dependencies": {
    "@deepseek-ai/dsh-host-apiproxy": "0.1.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.1",
    "@modelcontextprotocol/sdk": "^1.30.0",
    "@snowluma/mcp": "^1.14.20",
    "@snowluma/sdk": "^1.14.20",
    "edge-tts": "^1.0.1",
    "js-yaml": "^4.3.2",
    "ws": "^8.22.1",
    "zod": "^4.4.3"
  },
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
        "./presets/qq-chat.patch.yml",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:19-52](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/lib/index.js#L19-L52)

根入口组合与依赖延迟。

<details>
<summary>查看原文（34行）</summary>

```text

export const name = 'dsh-dfy';
export const inject = [];

function applySurfcore(ctx, config) {
  try {
    oldServer.apply(ctx, config);
  } catch (err) {
    console.error('[whalecore] surfcore apply failed:', err);
  }
}

export function apply(ctx, config) {
  // ① 挂件：立即注册（路由 / tapIndex / 桌面 index-inject 行都在 apply 里同步完成）
  try {
    whaleServer.apply(ctx, config);
  } catch (err) {
    console.error('[whalecore] whale widget apply failed:', err);
  }

  // ② SurfCore：等它依赖的三个服务就绪后再应用（与原对象级 inject 等价）
  try {
    const deps = Array.isArray(oldServer.inject) ? oldServer.inject : [];
    if (deps.length && typeof ctx.inject === 'function') {
      ctx.inject(deps, (sub) => applySurfcore(sub || ctx, config));
    } else {
      applySurfcore(ctx, config);
    }
  } catch (err) {
    console.error('[whalecore] surfcore inject failed:', err);
  }
}

export default { name, inject, apply };
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-19](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/cordis.patch.yml#L1-L19)

主插件与配置垫片。

<details>
<summary>查看原文（19行）</summary>

```text
# ============================================================================
# dsh-Dfy —— 挂载声明
# ============================================================================
# 一个包，两行：
#   · dsh-dfy：主插件（id 与包名一致），宿主入口 lib/index.js
#     （挂件 + SurfCore 后端都在这个入口里组装）
#   · qq-mode：QQ 桥接的 Config 命名空间。桥接通过 DSH settings 写 qq-mode，
#     这一行不能删；它不是第二个用户插件。
#
# ⚠️ qq-mode 的 name 必须指向 shims/ 里的转发垫片：
#    宿主会按 loader 行文件最近的 package.json 读 dsh.client，直接指到
#    backend/lib/qq-mode.js 会把旧的设置界面一起加载进来。
- insert:
    - id: dsh-dfy
      name: dsh-dfy
      config: {}
    - id: qq-mode
      name: ./shims/qq-mode/lib/qq-mode.js
      config: {}
```

</details>

**依据 4 · 作者声明**：[README.md:5-9](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/README.md#L5-L9)

作者平台及本地数据宣称。

```text
小鲸鱼余额挂件 + 桌宠（106 段透明动画）+ QQ 消息卡，QQ / B站 / 双向脱敏记忆由包内自带的 SurfCore 提供。

> English: an all-in-one **DeepSeek Harness (DSH) plugin** — balance whale widget, transparent desktop pet,
> QQ message card bridged through SnowLuma, Bilibili dynamics/comments, and local redacted memory.
> One plugin for the DSH web GUI; data stays on this machine.
```

#### 缺口

- 无真实陪伴/管理场景与独立工具对照。
  **影响**：统一入口增量不等于用户愿持续使用。
  **进一步探讨**：分开观察仅挂件与开启社交的任务、负担和退出行为。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · QQ消息如何进入Agent并返回？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

不是只把文字转发：handleIncoming先按模式/会话准入和sender黑名单拒绝，再处理引用、媒体、角色记忆与唤醒。投递时ensureSession创建/复用DSH会话，内容带对齐/俚语上下文和可选图像，sessions.prompt(mode queue)交给宿主Agent循环。宿主事件流与MCP安全包装支持返回，onebotSend最终POST SnowLuma的send_private_msg或send_group_msg，并检查HTTP/OneBot返回。

准入allow按会话ID比较，空allow时取allowAllWhenEmpty，不能写成“空清单一定拒绝”；群会话准入与群成员黑名单是两层。模型、宿主队列、OneBot登录/令牌、可达桥接是各自依赖。accepted只说明宿主接受prompt，不能证明最终回复送达，OneBot成功也不是收件人已读。重连/重试、限流/合并能改变响应时序，本轮不宣称端到端恰好一次。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.js:1714-1723](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/bridge.js#L1714-L1723)

空白名单行为可配置。

<details>
<summary>查看原文（10行）</summary>

```text
function allowed(kind, id, cfg) {
  // OneBot 事件里的 id 可能是数字也可能是字符串（int64 序列化差异），统一转字符串比较。
  // 配置字段兼容单数（group/private）与复数（groups/privates）两种写法。
  const s = String(id);
  const denyList = cfg.deny[kind] ?? cfg.deny[kind + 's'] ?? [];
  if (denyList.map(String).includes(s)) return false;
  const allowList = cfg.allow[kind] ?? cfg.allow[kind + 's'] ?? [];
  if (allowList.length > 0) return allowList.map(String).includes(s);
  return cfg.allowAllWhenEmpty;
}
```

</details>

**依据 2 · 源码核查**：[src/bridge.js:14641-14657](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/bridge.js#L14641-L14657)

会话与sender前置拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
  async function handleIncoming(kind, id, event, cfg) {
    const key = convKey(kind, id);
    // 群画像：成员数缓存用于小群/大群分层；失败不影响消息处理。
    if (kind === 'group') void ensureGroupMeta(id);
    if (!modeAllowed(key, kind, id, cfg, currentMode)) {
      logThrottled(`unauth:${key}`, 10 * 60_000, `忽略未授权会话 ${key}（当前模式 ${currentMode}，来自 ${event.user_id}；同类日志 10 分钟内只记一次）`);
      return;
    }
    // 人的黑名单（deny.users）：**在一切副作用之前**返回 —— 不入库、不进上下文、
    // 不写记忆卡、不计鱼群、不触发唤醒。放在后面任何一处都等于「他还能叫醒你」。
    if (senderBlocked(event.user_id, cfg.deny?.users)) {
      appendActivity(`${key} [黑名单] 忽略 ${String(event.user_id)} 的消息（deny.users）`);
      log(`[黑名单] 忽略 ${key} 来自 ${event.user_id} 的消息（deny.users）`);
      return;
    }
    const resolveAtName = async (qq) => {
      // 只有群聊才需要把 @QQ号 解析成群名片/昵称；私聊没有群成员概念
```

</details>

**依据 3 · 源码核查**：[src/bridge.js:15161-15194](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/bridge.js#L15161-L15194)

实际宿主prompt与接受状态。

<details>
<summary>查看原文（34行）</summary>

```text

    let sessionId;
    try {
      sessionId = await ensureSession(key);
    } catch (error) {
      if (String(error?.message ?? error).includes('会话创建期间已重置')) {
        enqueueForRetry(key, promptText, { media: mediaList });
        return;
      }
      throw error;
    }
    let content = [{ type: 'text', text: withAlignmentContext(key, withSlangContext(promptText)) }];
    if (Array.isArray(mediaList) && mediaList.length > 0) {
      const imageParts = await resolveMediaList(mediaList);
      content = [{ type: 'text', text: withAlignmentContext(key, withSlangContext(promptText)) }, ...imageParts];
    }
    if (!isCurrentSession(key, sessionId)) throw new Error('投递前会话已重置或权限已变化');
    const accepted = await api.sessions.prompt({
      sessionId,
      mode: 'queue',
      content
    });
    if (!accepted.result.ok) {
      const errText = `${accepted.result.error.code}: ${accepted.result.error.message}`;
      const safeErrText = shouldAuditKey(key) && SENSITIVE_RE.test(errText) ? '（含敏感信息，已隐藏）' : errText;
      await sendToQQ(key, `⚠️ 消息未被接受：${safeErrText}`);
      return;
    }
    if (accepted.result.value.command) {
      // 斜杠命令直接有结果，不走模型
      if (accepted.result.value.command.text) await auditAndSend(key, mdToPlain(accepted.result.value.command.text));
      return;
    }
    if (cfg.ackMessage && currentMode !== 'reserved2') await sendToQQ(key, cfg.ackMessage);
```

</details>

**依据 4 · 源码核查**：[src/bridge.js:9247-9305](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/bridge.js#L9247-L9305)

实际OneBot外发及返回判定。

<details>
<summary>查看原文（59行）</summary>

```text
      log(`发送内容命中违规黑名单，已阻止发送 (${kind}:${id})`);
      appendActivity(`${kind}:${id} [guard] 发送被拦截（内容命中违规黑名单，未发出）`);
      throw new Error('发送内容命中违规关键词黑名单，已阻止发送');
    }
    segments.push({ type: 'text', data: { text: escapeCqText(rawMessage) } });
    const action = kind === 'private' ? 'send_private_msg' : 'send_group_msg';
    const params = kind === 'private' ? { user_id: Number(id), message: segments } : { group_id: Number(id), message: segments };
    const httpUrl = String(cfg.snowluma?.httpUrl || 'http://127.0.0.1:3000').replace(/\/+$/, '');
    const sendKey = `${kind}:${id}`;
    let res;
    try {
      res = await fetch(`${httpUrl}/${action}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          ...(cfg.snowluma?.accessToken ? { authorization: `Bearer ${cfg.snowluma.accessToken}` } : {})
        },
        body: JSON.stringify(params),
        signal: AbortSignal.timeout(15000)
      });
    } catch (error) {
      noteSendFailure(sendKey, error);
      throw error;
    }
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.status !== 'ok' || body.retcode !== 0) {
      const hint = res.status === 426 ? '（HTTP 426：snowluma.httpUrl 可能指向了 WebSocket 端口，请检查 config.json 的 snowluma.httpUrl 是否为 OneBot HTTP API 地址）' : '';
      const error = new Error(`OneBot ${action} 失败: ${body.wording || body.retcode || res.status}${hint}`);
      noteSendFailure(sendKey, error);
      throw error;
    }
    noteSendSuccess(sendKey);
    // 私聊回复也镜像给桌宠（模型回复多走 /api/send/*，不一定经过 sendToQQ）
    if (kind === 'private') mirrorPetMessage({ role: 'assistant', key: sendKey, sender: '', text: rawMessage });
    return body.data;
  }

  // 直接发任意 OneBot 消息段（卡片/分享卡用）。文本发送仍走 sendToQQ，
  // 这样限速、审计和会话守卫不被绕过。
  async function onebotSendSegments(kind, id, segments) {
    if (!Array.isArray(segments) || !segments.length) throw new Error('消息段为空');
    const action = kind === 'private' ? 'send_private_msg' : 'send_group_msg';
    const params = kind === 'private' ? { user_id: Number(id), message: segments } : { group_id: Number(id), message: segments };
    const httpUrl = String(cfg.snowluma?.httpUrl || 'http://127.0.0.1:3000').replace(/\/+$/, '');
    const res = await fetch(`${httpUrl}/${action}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(cfg.snowluma?.accessToken ? { authorization: `Bearer ${cfg.snowluma.accessToken}` } : {})
      },
      body: JSON.stringify(params),
      signal: AbortSignal.timeout(20000)
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok || body.status !== 'ok' || body.retcode !== 0) {
      throw new Error(`OneBot ${action} 失败: ${body.wording || body.retcode || res.status}`);
    }
    return body.data;
  }
```

</details>

**依据 5 · 源码核查**：[src/mcp-snowluma-safe.js:490-513](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/mcp-snowluma-safe.js#L490-L513)

发送工具通过bridge agent API。

<details>
<summary>查看原文（24行）</summary>

```text
server.tool(
  'qq_send_group_message',
  '向指定 QQ 群发送一条纯文本消息；如需引用某条消息，可传 replyToMessageId（非零整数，可为负数），可先用 qq_get_recent_messages / qq_get_message_detail 查询。二代模式（reserved2）下这是可用的发送工具之一，但优先使用 qq_send_message；reserved2 下调用时必须携带会话令牌 token，否则会被拒绝。不要在发送后输出“已发送”类汇报。目标群必须命中系统白名单（config.json 的 allow.groups），否则拒绝。',
  {
    groupId: z.union([z.number(), z.string()]).describe('群号（必须在白名单内）'),
    message: z.string().describe('消息文本，纯文本，不要用 Markdown 或 CQ 码'),
    replyToMessageId: z.union([z.number(), z.string()]).optional().describe('要引用/回复的消息 id（非零整数，可为负数，可选）'),
    token: z.string().optional().describe('二代会话令牌（reserved2 模式下必填；closed-agent 模式不需要）')
  },
  async ({ groupId, message, replyToMessageId, token }) => {
    try {
      const cleanMessage = unquoteJsonString(message);
      const data = await agentApi('/api/send/group', {
        method: 'POST',
        // token 既放 body（兼容旧调用）又放 header：桥接的「agent 流量」判定基于 header，
        // 只带 body 会让这条请求在桥接眼里像控制台请求，绕过 agent 专用的闸门与审计。
        ...(token ? { headers: { 'x-agent-token': token } } : {}),
        body: JSON.stringify({ groupId: String(groupId), message: cleanMessage, replyToMessageId, token: token || undefined })
      });
      return { content: [{ type: 'text', text: serializeModelData(data) }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `发送失败：${error?.message ?? error}` }], isError: true };
    }
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限与工具白名单限制什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

QQ preset引用包内qq-tool-restrict，先逐个restrict已知危险工具，未知工具异常汇总跳过；再tools.guard按允许的MCP命名空间和少量exact工具执行白名单，未命中拒绝。它区分“工具表隐藏”与“执行拒绝”，不把restrict失败当全部执行放开；但允许前缀包含QQ发送、语音等真实外发，safe不是只读。其有效性仍依preset实际挂载、宿主guard语义、MCP实现和token/目标校验，不能仅看名字保证全链隔离。

MCP发送包装把会话token传body/header，桥接再执行目标/模式/发送检查；不是每条消息都先让人批准。Host设置路由本机回环、非GET同源及可选connection拒绝，属于本机控制面围栏，不是多租户账号授权。QQ工具白名单不能直接应用于独立B站调度会话；后者有不同权限接线，见Q06。未运行任何社交账号或越权测试。

#### 证据与依据

**依据 1 · 源码核查**：[backend/qq-tool-restrict.mjs:163-185](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/qq-tool-restrict.mjs#L163-L185)

允许命名空间范围。

<details>
<summary>查看原文（23行）</summary>

```text
const SAFE_PREFIXES = [
  'mcp__snowluma__',
  'mcp__snowluma-host__',
  'mcp__web-search-safe__',
]

// 无害模型侧工具：ask_user_question 用于把问题转给管理员/用户，
// todo_write 仅维护任务列表。若后续 preset 不再挂载这些工具，保留无害。
const SAFE_EXACT = new Set([
  'ask_user_question',
  'todo_write',
  // 第三方上下文压缩（billion-context 注入的全局工具）：只操作上下文，不含本地执行/网络写操作。
  // 2026-10-30 用户要求放行：不放行时模型会反复重试被拒工具（实测一个回合 197 次），
  // 且 QQ 会话本身没有这两套压缩就更容易爆上下文。
  'compress',
  'decompress',
  'search_context',
  'acp_status',
  'acp_cache',
])

// 给「插件兼容性体检」读取的只读快照：不要在别处再抄一份白名单。
export const SAFE_EXACT_TOOLS = Object.freeze([...SAFE_EXACT])
```

</details>

**依据 2 · 源码核查**：[backend/qq-tool-restrict.mjs:188-235](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/qq-tool-restrict.mjs#L188-L235)

restrict逐个处理与执行白名单。

<details>
<summary>查看原文（48行）</summary>

```text
export function apply(ctx) {
  // 1) 把已知危险全局工具从 schema 隐藏（restrict 只影响继承的全局层，
  //    不会误删 preset 自己注册的 scoped 工具）。
  // 逐个 restrict：当前 DSH 版本不存在的工具名会单独抛错并跳过，
  // 不会导致整批限制失败（restrict 的 unknown 校验是整批原子性的）。
  //
  // 口径（2026-09-27 实测 web profile 的全局层）：实际存在的全局工具只有
  // `dev_*`（注入器）与三个 MCP 命名空间的工具；`read`/`pwsh`/`subagent` 这类
  // 是**各 preset 行自己注册的 scoped 工具**，在 QQ preset 里根本没挂载，
  // 因此本名单主要防的是"别的 composition 把它们注册进全局层"这种回归，
  // 以及 MCP 之外的宿主工具（plugin-guard / cordis 检查工具等）。
  //
  // 2026-11-04 实测（web profile + agent-team bundle）：
  //   · apply 时能看到的可 restrict 名字只有 4 个全局 MCP 资源工具，其余 64 个
  //     全部报 "unknown global tool"——因为 `spawn_teammate` / `team_task_*` /
  //     第三方 MCP（shared_memory）是**别的插件在 agent 作用域里注册的**，
  //     dsh-tools 的语义是「scoped registrations remain visible」，restrict 管不到；
  //   · 因此 QQ 会话的 tool schema 里确实会出现这些工具，模型可能先试调它们
  //     （执行期被 guard 拒绝），再误判「我没有发送工具」而只输出文本。
  //   延迟重扫同样无效（1/3/10/30 秒后 restrictableNames 仍是那 4 个），所以不做重试；
  //   真正的边界是下面的执行期白名单，另外 bridge 的桌宠输入提示已显式给出
  //   key/令牌与「直接调 qq_send_message」，实测不再出现「只输出文本」。
  const skipped = []
  const sweep = () => {
    for (const name of KNOWN_DANGEROUS_GLOBAL_TOOLS) {
      try {
        ctx.tools.restrict({ deny: [name] })
      } catch {
        skipped.push(name)
      }
    }
  }
  sweep()
  if (skipped.length) {
    const list = skipped.length > 8 ? `${skipped.slice(0, 8).join(', ')} 等` : skipped.join(', ')
    // 只汇总一行：以前每个工具打一行，DSH 启动时刷几百行日志，把真实告警淹没（2026-10-28 用户反馈）。
    console.error(`[qq-tool-restrict] 跳过 ${skipped.length}/${KNOWN_DANGEROUS_GLOBAL_TOOLS.length} 个当前版本不存在的工具名：${list}（执行期白名单仍生效）`)
  }

  // 2) 执行期白名单：任何不在允许范围内的工具调用都会被拒绝。
  ctx.tools.guard((exec) => {
    const name = exec?.name
    if (typeof name !== 'string' || name.length === 0) return '工具名无效，已拒绝'
    if (SAFE_EXACT.has(name)) return
    if (SAFE_PREFIXES.some((prefix) => name.startsWith(prefix))) return
    return `工具 "${name}" 不在 QQ 桥接白名单内，已拒绝（仅允许 QQ MCP 工具与无害模型侧工具）`
  })
}
```

</details>

**依据 3 · 源码核查**：[src/mcp-snowluma-safe.js:490-513](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/src/mcp-snowluma-safe.js#L490-L513)

真实发送和token传递。

<details>
<summary>查看原文（24行）</summary>

```text
server.tool(
  'qq_send_group_message',
  '向指定 QQ 群发送一条纯文本消息；如需引用某条消息，可传 replyToMessageId（非零整数，可为负数），可先用 qq_get_recent_messages / qq_get_message_detail 查询。二代模式（reserved2）下这是可用的发送工具之一，但优先使用 qq_send_message；reserved2 下调用时必须携带会话令牌 token，否则会被拒绝。不要在发送后输出“已发送”类汇报。目标群必须命中系统白名单（config.json 的 allow.groups），否则拒绝。',
  {
    groupId: z.union([z.number(), z.string()]).describe('群号（必须在白名单内）'),
    message: z.string().describe('消息文本，纯文本，不要用 Markdown 或 CQ 码'),
    replyToMessageId: z.union([z.number(), z.string()]).optional().describe('要引用/回复的消息 id（非零整数，可为负数，可选）'),
    token: z.string().optional().describe('二代会话令牌（reserved2 模式下必填；closed-agent 模式不需要）')
  },
  async ({ groupId, message, replyToMessageId, token }) => {
    try {
      const cleanMessage = unquoteJsonString(message);
      const data = await agentApi('/api/send/group', {
        method: 'POST',
        // token 既放 body（兼容旧调用）又放 header：桥接的「agent 流量」判定基于 header，
        // 只带 body 会让这条请求在桥接眼里像控制台请求，绕过 agent 专用的闸门与审计。
        ...(token ? { headers: { 'x-agent-token': token } } : {}),
        body: JSON.stringify({ groupId: String(groupId), message: cleanMessage, replyToMessageId, token: token || undefined })
      });
      return { content: [{ type: 'text', text: serializeModelData(data) }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `发送失败：${error?.message ?? error}` }], isError: true };
    }
  }
```

</details>

**依据 4 · 源码核查**：[backend/lib/index.js:716-741](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/index.js#L716-L741)

本机同源路由与宿主围栏。

<details>
<summary>查看原文（26行）</summary>

```text
  const disposers = [];
  function route(kind, pathname, handler) {
    disposers.push(ctx.webServer.register({
      kind,
      path: pathname,
      handler: async (req, res) => {
        if (!isLoopbackReq(req)) { json(res, 403, { ok: false, error: '只接受本机回环访问' }); return; }
        if (req.method !== 'GET' && !sameOrigin(req)) { json(res, 403, { ok: false, error: '跨站请求被拒绝' }); return; }
        // Content-Type 只对**浏览器**写请求强制（判据=http-guard.isBrowserRequest）；
        // curl / 本机脚本 / 桌宠进程不带 Content-Type 也放行，body 交给 readJsonBody 解析。
        const ctRejection = contentTypeRejection(req);
        if (ctRejection) {
          json(res, 415, { ok: false, code: 'CONTENT_TYPE', error: ctRejection });
          return;
        }
        try {
          const conn = ctx.get('connection');
          if (conn && typeof conn.requestRejection === 'function') {
            const code = conn.requestRejection(req);
            if (code !== undefined && code !== null && code !== false) {
              res.statusCode = typeof code === 'number' ? code : 403;
              res.end();
              return;
            }
          }
          await handler(req, res);
```

</details>

#### 缺口

- 未验真实preset与宿主Guard组合。
  **影响**：不能证明其它插件注册/异常条件下隔离成立。
  **进一步探讨**：在隔离账号验证非白名单工具拒绝与允许发送的目标约束。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 双向记忆的脱敏是否保证不外流？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能保证。QQ→B站默认需enabled显式开，读取本地公开群feed，按允许群/管理员是否纳入筛选，再用正则拒绝或替换已知秘密/个人信息并限制长度；群别名和昵称组织成人可读简报，写入角色记忆目录供后续B站会话注入。B站→QQ有另一公开材料读取路径，本轮核查其模块接线而未穷举所有原始记录边界。群准入不等于每个发言者同意跨平台再利用，昵称、主题与原句也可能保持可识别性。

privacy的scanText/sanitizeText/assertSafeOutput是形态规则，不是语义匿名化或不含秘密的证明。原始feed、聊天状态与派生简报是不同数据；派生脱敏不会自动删除原始记录与备份。sync落盘成功只说明规则通过，之后注入模型和生成外部内容仍有传播风险。README“本机数据”不当网络不出机；采用前应预览派生文本、核可外发范围，不能直接将群记忆扩到生产沟通。

#### 证据与依据

**依据 1 · 源码核查**：[backend/lib/memory.js:113-168](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L113-L168)

群/owner筛选与sanitize。

<details>
<summary>查看原文（56行）</summary>

```text
    scanned: items.length,
    kept: 0,
    dropped: 0,
    redactions: 0,
    ownerSkipped: 0,
    privateSkipped: 0,
    groupSkipped: 0,
    byReason: {},
    groups: groups.size,
    policyVersion: PRIVACY_POLICY_VERSION,
  };
  const kept = [];
  for (const item of items) {
    const gate = isPublicGroupMessage({
      key: `group:${item.groupId}`,
      groupIds: allowedGroups,
      text: item.text,
      senderId: item.senderId,
      ownerId,
      includeOwner: cfg.includeOwner === true,
    });
    if (!gate.ok) {
      stats.dropped += 1;
      if (gate.reason.includes('管理员')) stats.ownerSkipped += 1;
      else if (gate.reason.includes('私信')) stats.privateSkipped += 1;
      else if (gate.reason.includes('白名单')) stats.groupSkipped += 1;
      stats.byReason[gate.reason] = (stats.byReason[gate.reason] ?? 0) + 1;
      continue;
    }
    const result = cleanMessage(item.text);
    if (!result.ok) {
      stats.dropped += 1;
      stats.byReason[result.reason || 'privacy'] = (stats.byReason[result.reason || 'privacy'] ?? 0) + 1;
      continue;
    }
    stats.redactions += result.hits.length;
    stats.kept += 1;
    const safeName = sanitizeText(item.senderName, { dropUnsafeLines: false, keepNumbers: false, maxChars: 24 });
    kept.push({
      ...item,
      clean: result.text,
      groupAlias: groups.get(item.groupId) || '群?',
      senderAlias: (cfg.useNicknames !== false && safeName.ok && safeName.text) ? safeName.text : '群友',
      topics: topicLabels(result.text),
    });
  }
  return { cfg, privacy, allowedGroups, stats, kept, groups };
}

function buildQqForBiliDoc(collected, { qqConfig } = {}) {
  const { cfg, stats, kept, groups } = collected;
  const links = listLinks();
  const qqById = new Map(links.filter((link) => link.identities.qq).map((link) => [link.identities.qq.id, link]));
  const lines = [];
  lines.push('# QQ 群里的近况（给 B站 那边看）');
  lines.push('');
```

</details>

**依据 2 · 源码核查**：[backend/lib/memory.js:185-200](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L185-L200)

昵称/主题/样本及身份对齐仍组成文本。

<details>
<summary>查看原文（16行）</summary>

```text
  const senderEntries = [...bySender.values()].sort((a, b) => b.samples.length - a.samples.length);
  if (!senderEntries.length) {
    lines.push('- （这段时间没有可同步的公开群消息）');
  } else {
    for (const entry of senderEntries.slice(0, 20)) {
      const topics = [...entry.topics.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([label]) => label);
      const aligned = links.find((link) => link.identities.qq?.id === entry.senderId)?.identities?.bili;
      const who = aligned?.name ? `（B站「${aligned.name}」）` : '';
      lines.push(`- ${entry.groupAlias} · ${entry.senderAlias}${who}：${topics.length ? `最近常聊 ${topics.join('、')}` : '最近聊得比较杂'}${entry.samples[0] ? `；说过「${entry.samples[0]}」` : ''}`);
    }
  }
  lines.push('');

  // 最近话题（每群最多 8 条）
  lines.push('## 二、最近群里在聊什么');
  lines.push('');
```

</details>

**依据 3 · 源码核查**：[backend/lib/memory.js:296-324](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L296-L324)

显式enabled、备份、复检和写盘。

<details>
<summary>查看原文（29行）</summary>

```text
export function syncQqToBili({ force = false } = {}) {
  const all = readAll();
  const unified = all.unified;
  const qq = all.qq;
  if (unified.memory?.qqToBili?.enabled !== true) {
    return { ok: true, skipped: 'disabled', reason: 'QQ → B站 记忆同步没有开启' };
  }
  const collected = collectQqMemory({ unified, qqConfig: qq });
  if (!collected.kept.length) {
    const doc = buildQqForBiliDoc(collected);
    backupFile(qqForBiliFile(), 'qq-for-bili');
    writeTextAtomic(qqForBiliFile(), `${doc}\n`);
    const stats = { ...collected.stats, chars: doc.length, ok: true, empty: true };
    writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
    appendAudit({ direction: 'qq->bili', ok: true, ...stats });
    return { ok: true, stats, path: qqForBiliFile() };
  }
  const doc = buildQqForBiliDoc(collected, { qqConfig: qq });
  // 最后一道闸：任何严重命中都拒绝落盘（不把“疑似泄露”写成事实）。
  assertSafeOutput(doc.replace(/\b\d{5,12}\b/g, ''), 'QQ→B站记忆');
  backupFile(qqForBiliFile(), 'qq-for-bili');
  writeTextAtomic(qqForBiliFile(), `${doc}\n`);
  const stats = { ...collected.stats, chars: doc.length, ok: true };
  writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
  appendAudit({ direction: 'qq->bili', ok: true, ...stats });
  // 顺手扫描身份对齐候选（只从公开群消息里找“我B站是…”）
  let candidates = 0;
  if (all.unified.alignment?.autoDetect !== false) {
    candidates = scanQqFeedForCandidates({ maxMessages: 800 }).added;
```

</details>

**依据 4 · 源码核查**：[backend/lib/privacy.js:71-86](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/privacy.js#L71-L86)

扫描来自规则。

<details>
<summary>查看原文（16行）</summary>

```text
export function scanText(input) {
  const text = String(input ?? '');
  const secrets = collect(text, SEVERE_SECRET);
  const pii = collect(text, PII);
  const contacts = collect(text, CONTACT);
  const privateTopic = PRIVATE_TOPIC.test(text);
  const hits = [...secrets, ...pii, ...contacts];
  return {
    text,
    hits,
    secrets,
    pii,
    contacts,
    privateTopic,
    severe: secrets.length > 0 || pii.some((h) => h.severe) || contacts.some((h) => h.severe) || privateTopic,
  };
```

</details>

**依据 5 · 源码核查**：[backend/lib/privacy.js:135-163](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/privacy.js#L135-L163)

文本清洗与输出再检。

<details>
<summary>查看原文（29行）</summary>

```text
export function sanitizeText(input, options = {}) {
  const { dropUnsafeLines = true, keepNumbers = false, maxChars = 1200 } = options;
  const raw = normalizeText(input);
  if (!raw) return { ok: false, text: '', dropped: true, reason: 'empty', hits: [] };
  const scan = scanText(raw);
  if (scan.severe && dropUnsafeLines) {
    return { ok: false, text: '', dropped: true, reason: scan.privateTopic ? 'private-topic' : 'secret-or-pii', hits: scan.hits };
  }
  let text = sanitizeUrl(raw);
  for (const pattern of SEVERE_SECRET) text = text.replace(pattern.re, '[已隐藏]');
  for (const pattern of PII) text = text.replace(pattern.re, '[已隐藏]');
  if (!keepNumbers) text = redactNumbers(text);
  text = text.replace(/\s+/g, ' ').trim();
  if (!text) return { ok: false, text: '', dropped: true, reason: 'redacted-empty', hits: scan.hits };
  if (text.length > maxChars) text = `${text.slice(0, maxChars)}…`;
  return { ok: true, text, dropped: false, reason: '', hits: scan.hits };
}

/** 生成文件落盘前的最后一道闸：严重命中直接拒绝。 */
export function assertSafeOutput(text, label = 'memory') {
  const scan = scanText(text);
  const severe = scan.hits.filter((hit) => hit.severe);
  if (severe.length) {
    const error = new Error(`隐私闸门拒绝写入 ${label}：命中 ${severe.map((h) => h.label).join('、')}`);
    error.code = 'PRIVACY_BLOCKED';
    error.hits = severe.map((h) => ({ kind: h.kind, label: h.label }));
    throw error;
  }
  return true;
```

</details>

#### 缺口

- 未穷举隐私规则、B站反向全部原始材料及真实可识别性。
  **影响**：不支持“绝不泄露”或双向全链隐私保证。
  **进一步探讨**：用无真人信息的对抗样本验证输出/备份/模型注入，并让用户预览准出内容。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 余额挂件与价格说明能信到哪？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

用量面包含平台余额API、事件token估算及本地Codex rollout统计等不同来源。widget显式在无余额接口时以events模式显示，并对未配置价格的非DeepSeek模型返回null，只记token不强套DeepSeek金额，这比统一价格换算更诚实。自定义价按最长子串优先匹配模型，汇率与时段/节日仍来自用户与内置表，本轮未核现行官方定价，不能当真实账单或最新价格。

accounting按余额观测和人工充值/其它扣款校正组织“今日已用”；余额差不能天然归因本插件或当前会话，多客户端消费、充值和接口延迟要人工核对。金额精度函数不证明采集完整，平台返回余额也不是本插件节约费用的证据。每轮事件计费与余额账本需看来源标签，不应相加当额外费用。持续模型调用、自动唤醒与社交多步任务费用没有本轮测量。

#### 证据与依据

**依据 1 · 源码核查**：[widget/lib/index.js:659-687](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/widget/lib/index.js#L659-L687)

自定义匹配与第三方未定价null。

<details>
<summary>查看原文（29行）</summary>

```text
// 用户自定义单价（自定义 API 模型面板里填的「元/百万 token」），按 matchIds 子串匹配，优先于内置价目表
let CUSTOM_PRICES = {}
// 自定义单价的币种/汇率（与 CUSTOM_PRICES 同键）：单价若按美元填写，记账时按用户填的汇率换算成人民币
let CUSTOM_PRICE_META = {}
function customPriceMetaFor(model) {
  const m = String(model || '').toLowerCase()
  // 按键长降序：最长命中优先，避免短关键字（如 pro）误伤别的模型
  for (const key of Object.keys(CUSTOM_PRICE_META).sort((a, b) => b.length - a.length)) {
    if (key && m.indexOf(key) !== -1) return CUSTOM_PRICE_META[key]
  }
  return null
}
function priceFor(model) {
  const m = String(model || '').toLowerCase()
  // 自定义单价同样按键长降序匹配（与 customPriceMetaFor 保持一致）
  for (const key of Object.keys(CUSTOM_PRICES).sort((a, b) => b.length - a.length)) {
    if (key && m.indexOf(key) !== -1) return CUSTOM_PRICES[key]
  }
  // 内置价目表只覆盖 DeepSeek 自己的模型。GLM / Kimi / 豆包 / SenseNova / Agnes 等第三方路由的
  // 单价与 DeepSeek 完全不同，套用内置价会把金额算错一个数量级（实测混用一天：真扣 ¥2.22，
  // 用 DeepSeek 价折算成 ¥32）。这些模型没配「自定义单价」时返回 null ⇒ 只记 token、不折算金额。
  if (m.indexOf('deepseek') === 0) {
    if (m.indexOf('pro') >= 0) return PRICING['deepseek-v4-pro']
    return PRICING['deepseek-flash']
  }
  return null
}
// bucket time is an epoch second; derive the Beijing local hour to pick peak vs off-peak price.
// 2026-08-23 起（北京时间）周末（周六/周日）全天按谷价；生效时刻之前的历史
```

</details>

**依据 2 · 源码核查**：[widget/lib/index.js:3287-3308](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/widget/lib/index.js#L3287-L3308)

Codex与events/API来源区别。

<details>
<summary>查看原文（22行）</summary>

```text
          // 订阅额度（kind='quota' 的模板，如智谱/Kimi/MiniMax Coding）：前端据此显示额度行与模块
          entry.planSupport = !!tplM.quota
          // Codex 模式：不查余额、不需要密钥，直接给本地会话统计（今日/本月/累计/近7天）
          if (tplM.kind === 'codex') {
            // 这里能等：模型列表请求可以稍等一下在途扫描（最多 2.5s），但绝不触发同步扫描
            if (!codexStats) codexStats = await codexSummaryEnsured(2500)
            entry.codex = codexStats
            entry.hasKey = true
            entry.error = codexStats && codexStats.ok ? null
              : (codexStats && codexStats.disabled ? null : ((codexStats && codexStats.error) || '未找到 Codex 会话目录'))
          }
          // 没有余额接口的厂商（如火山方舟）：余额显示「—」，只用会话事件估算
          entry.balanceMode = hasBalanceApi ? 'api' : 'events'
          if (hasBalanceApi && hasKey) {
            const r = await fetchModelBalance(m)
            if (r && r.ok) {
              entry.balance = r.remaining
              if (r.currency) entry.currency = r.currency
              apiRecordBalance(m.id, r.remaining)
              const u = apiTodayUsage(m.id, entry.currency || m.currency)
              entry.todayUsage = u.amount
              entry.usageSource = u.source
```

</details>

**依据 3 · 源码核查**：[widget/lib/accounting.mjs:123-135](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/widget/lib/accounting.mjs#L123-L135)

余额来源及review状态。

<details>
<summary>查看原文（13行）</summary>

```text
export function balanceSummary(ledger, day = beijingDay()) {
  const book = currentBook(ledger)
  const row = book && book.days && book.days[day]
  if (!row) return null
  const correction = row.correction
  const needsReview = row.creditUnits > (correction ? correction.creditUnits : 0)
  const source = needsReview ? 'balance-needs-review' : correction ? 'balance-corrected' : 'balance-observed'
  return {
    day, amount: preciseMoney(observedAmount(row)), currency: book.currency, source,
    label: needsReview ? '已观测消费 · 待核对余额调整' : correction ? '已校正消费' : '已观测消费',
    firstObservedAt: row.firstAt, lastObservedAt: row.lastAt,
    openingBalance: row.openingUnits / SCALE, currentBalance: row.lastUnits / SCALE,
    observedDecrease: row.debitUnits / SCALE, observedIncrease: row.creditUnits / SCALE,
```

</details>

**依据 4 · 源码核查**：[widget/lib/accounting.mjs:207-239](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/widget/lib/accounting.mjs#L207-L239)

人工充值/其它扣款校正。

<details>
<summary>查看原文（33行）</summary>

```text
export function reconcileBalance(ledger, input, now = Date.now()) {
  const day = String(input.day || '')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) throw new Error('请选择有效的记账日期')
  const book = currentBook(ledger)
  const row = book && book.days && book.days[day]
  if (!row) throw new Error('这一天没有余额观测记录，无法校正')
  if (input.revision !== revisionOf(ledger, row)) {
    const err = new Error('余额或校正记录已更新，请重新打开校正窗口后核对金额')
    err.status = 409
    throw err
  }
  if (input.action !== 'reset' && input.confirmed !== true) throw new Error('请先确认已核对本统计区间的全部余额调整')
  let correction = null
  if (input.action !== 'reset') {
    const creditsUnits = adjustmentUnits(input.credits, true)
    const otherDebitsUnits = adjustmentUnits(input.otherDebits)
    const amountUnits = row.openingUnits + creditsUnits - otherDebitsUnits - row.lastUnits
    if (!Number.isSafeInteger(amountUnits) || amountUnits < 0) {
      throw new Error('校正后消费为负或超出范围，请核对统计起点与累计到账金额')
    }
    correction = {
      at: Number(now), creditsUnits, otherDebitsUnits, amountUnits,
      debitUnits: row.debitUnits, creditUnits: row.creditUnits,
    }
  }
  row.correctionLog ||= []
  row.correctionLog.push({ at: Number(now), previous: row.correction, next: correction })
  if (row.correctionLog.length > 50) row.correctionLog.splice(0, row.correctionLog.length - 50)
  row.correction = correction
  row.revision = (row.revision || 0) + 1
  const summary = balanceSummary(ledger, day)
  ledger.history ||= {}
  ledger.history[day] = summary.amount
```

</details>

#### 缺口

- 未独立核现价、账单和真实采集覆盖。
  **影响**：金额只能按来源解释，不作费用建议或节省结论。
  **进一步探讨**：用用户自愿提供的脱敏账本比对余额变化、充值与事件估算。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · B站自动互动与恢复副作用是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

B站调度不是桌宠动画计时器：scheduler通过宿主sessionController唤醒固定会话，提示读视频/评论并用CLI dry→go执行点赞、评论、分享。comment入口要求显式--dry或--go，go路径真实POST reply/add；标志是程序参数，不是每次都由用户批准，Agent可按自动提示选go。登录Cookie、账号身份、模型及站点接口/规则是独立依赖，dry也会联网核账号，不能称完全离线预览。

更重要的是调度在session/created与tick读取agent.sandbox，缺省danger-full-access，并调用permissionPresets.set修改该B站会话。它限定匹配sessionId，不意味着整宿主升权；但也不能将QQ白名单/受限档描述套在它身上。服务缺失返回失败仍允许生物钟继续，需验证实际权限与执行结果。停止调度不等于撤回已发评论/动态或删除记忆，重启/角色切换还涉及不同持久状态，不能把所有副作用当可逆设置。

#### 证据与依据

**依据 1 · 源码核查**：[backend/lib/scheduler.js:354-369](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/scheduler.js#L354-L369)

调度提示包含真实go互动。

<details>
<summary>查看原文（16行）</summary>

```text
    '4.6) ⭐ **给鱼点赞**（看完后独立做，不是每条都点）：深读的 BV 里评论多的，跑 `fish-guard like --bvid <BV> --dry` 看目标 → 去掉 `--dry` 真点',
    '     ⚠️ 每天最多 6 个 · 每次最多 4 个 · 两次之间有随机间隔；遇到风控会自己停并记下原因，别硬刷 ✗',
    '     （设置页「鱼群保护 · 运行状态」能看到今天赞了几条、上次失败在哪个 code）',
    // 2026-10-23（主人定）：**每次醒来至少发一条主动评论**，鱼群泛滥时强制聚拢。
    //   以前 4.7 是"有话说就说"；现在改成硬规则，避免她看到鱼多就整轮不说话。
    '4.7) ⭐ **每次醒来至少发一条主动评论（2026-10-23 主人定的硬规则）**：',
    '     看完想吐槽/想夸/想接梗/想补充 → 直接发一条普通评论（不 @ 我，是你自己在说话）：',
    '     `recon <BV>` 拿 aid → `comment --oid <aid> --bvid <BV> --message "…" --auto --dry` → 改成 `--go` → `thread` 复核 ✓',
    `     ⚠️ **鱼群泛滥时默认强制聚拢**（当前设置：${B.fishGuard?.forceGather === false ? '关；要强制就加 --force-gather' : '开'}）：就算没有“回复少/新鲜/没回过”的鱼楼，也强行挑一条鱼楼回；`,
    '        **不许拿“没有可聚拢鱼楼”当理由不发**。设置页「鱼群保护 → 每次醒来强制聚拢」默认开；仍占主动评论额度 ✓',
    '     ⚠️ **不带 --share 才是普通评论**；带 --share 才是"分享给我"（那条才要评分 + rank 1 + @ 我 ✓）',
    '     ⚠️ 分寸：**代码硬上限** 一天 ' + capText(L.daily) + ' 条 · 任意两条隔 ' + L.globalMin + ' 分钟 · 同一 UP ' + L.perUpMin + ' 分钟 1 条 · 同一视频 ' + L.perVideoMin + ' 分钟 1 条',
    '        （额度/冷却满了就停，别硬刷；这不是“强制”能绕过的 ✓）',
    // 2026-10-20（用户定）：**热评也能搭话** —— 挂在别人评论下面的楼中楼，不是顶层 ✓
    '4.8) ⭐ **搭话**：`debrief` 的热评里，有人说到你心坎里 / 有明显错漏 / 想接个梗 → 回他一句：',
    '     `comment --oid <aid> --bvid <BV> --root <rpid> --parent <rpid> --message "…" --auto --ta --dry` → `--go`',
```

</details>

**依据 2 · 源码核查**：[backend/lib/scheduler.js:439-467](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/scheduler.js#L439-L467)

明确设置单会话权限。

<details>
<summary>查看原文（29行）</summary>

```text
export function applySessionPermissionTo(ctx, session, target = 'danger-full-access', log = () => {}) {
  let presets;
  try { presets = ctx?.permissionPresets; } catch { presets = undefined; }
  if (!presets) {
    try { presets = ctx?.get?.('permissionPresets'); } catch { presets = undefined; }
  }
  if (!session || !presets?.set) return { ok: false, reason: 'permission-services-unavailable' };
  try {
    const current = typeof presets.current === 'function' ? presets.current(session) : '';
    if (current === target) return { ok: true, changed: false, current, target };
    presets.set(session, target);
    log(`[权限] B站 会话已切到 ${target}（原 ${current || '?'}）`);
    return { ok: true, changed: true, current, target };
  } catch (error) {
    log(`[权限] 设置 → ${target} 失败：${String(error?.message ?? error)}`);
    return { ok: false, reason: 'set-failed', error: String(error?.message ?? error) };
  }
}

export function applySessionPermission(ctx, sessionId, target = 'danger-full-access', log = () => {}) {
  let sessions;
  try { sessions = ctx?.sessions; } catch { sessions = undefined; }
  if (!sessions) {
    try { sessions = ctx?.get?.('sessions'); } catch { sessions = undefined; }
  }
  if (!sessions?.get) return { ok: false, reason: 'permission-services-unavailable' };
  const session = sessions.get(sessionId);
  if (!session) return { ok: false, reason: 'session-not-active' };
  return applySessionPermissionTo(ctx, session, target, log);
```

</details>

**依据 3 · 源码核查**：[backend/lib/scheduler.js:545-566](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/scheduler.js#L545-L566)

tick与创建事件默认full access。

<details>
<summary>查看原文（22行）</summary>

```text
  function ensurePermission(where = 'tick') {
    const target = String(config().agent?.sandbox || 'danger-full-access')
    const result = applySessionPermission(ctx, sessionId, target, (message) => log(message))
    if (!result.ok && result.reason !== 'session-not-active' && result.reason !== 'permission-services-unavailable') {
      log(`[权限] ${where} 无法自动设置 B站 会话权限：${result.reason}`);
    }
    return result
  }

  // 会话创建事件是最可靠的时机：此时 session 对象已经存在，可以在第一句 prompt 之前
  // 把权限切成 danger-full-access；不用等 ensureSession 之后再猜 ctx.sessions 有没有同步。
  let permissionListenerOff = null
  try {
    if (typeof ctx.on === 'function') {
      permissionListenerOff = ctx.on('session/created', (session) => {
        if (!session || session.id !== sessionId) return
        try {
          const target = String(config().agent?.sandbox || 'danger-full-access')
          applySessionPermissionTo(ctx, session, target, (message) => log(message))
        } catch (error) {
          log(`[权限] session/created 处理失败：${String(error?.message ?? error)}`)
        }
```

</details>

**依据 4 · 源码核查**：[backend/tools/commands/comment.mjs:113-117](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/tools/commands/comment.mjs#L113-L117)

dry/go明确参数要求。

```text
  console.error('usage: --oid <aid|comment_id_str> [--bvid <BV...> | --referer <url>] --message "<text>" [--type 1|11|17] [--root <rpid> --parent <rpid>] [--force-gather|--no-force-gather] [--no-fish-gather] [--dry | --go]')
  process.exit(2)
}
if (dry && go) { console.error('pick either --dry or --go, not both'); process.exit(2) }
if (!dry && !go) { console.error('refusing to run without an explicit --dry or --go'); process.exit(2) }
```

**依据 5 · 源码核查**：[backend/tools/commands/comment.mjs:399-433](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/tools/commands/comment.mjs#L399-L433)

dry退出与go实际POST。

<details>
<summary>查看原文（35行）</summary>

```text

if (dry) {
  console.log('\n[dry] 未发送。确认文案与账号后，把 --dry 换成 --go 再跑一次。')
  process.exit(0)
}

// 闸门：自主发言（--auto）或分享型（--share）才拦；主人授权的发言只显示额度
{
  const target = bvid ? `BV:${bvid}` : `oid:${oid}`
  const chk = quota(['check', '--type', 'comment', '--target', target, ...(SHARE ? ['--share'] : AUTO ? ['--auto'] : [])])
  console.log(`\n[限额闸] ${chk.out}`)
  if (chk.code !== 0) {
    console.error('  → 拒绝发送。这是硬约束第 4 条的代码实现，不要绕过（要发请主人当场授权，或改白名单/额度）。')
    process.exit(2)
  }
}

// 出站身份闸（2026-10-23 用户要求：只准自己互认，不许泄露主人和别人的信息）
// 公开面一旦把主人/别人的 QQ 号或 B站 mid 贴出去就收不回来；提示词只是概率约束，这里是硬拦。
try {
  assertOutboundIdentitySafe(message, { surface: 'B站 评论' });
} catch (error) {
  console.error(`\n✗ ${error.message}`);
  process.exit(9);
}
// 判重（--once-per-person）已在入口处检查，这里直接发
console.log('\n[go] 发送中…')
const res = await fetch(url, {
  method: 'POST',
  headers: {
    'user-agent': UA,
    referer,
    origin: 'https://www.bilibili.com',
    'content-type': 'application/x-www-form-urlencoded',
    cookie: cookieHeader,
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 全周期成本支持何种采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察。可先只评估本地桌宠/余额视图，并明确QQ、B站自动启动、跨平台记忆和语音都关闭；不是一次安装即可安全接入群。若要验证桥接，使用专用测试账号与自建测试群、已知无敏感内容，逐条核对准入、外发目标、模型上下文和停机后无继续发送。不得把B站默认权限或自动go当普通挂件必要成本。

首次有Windows/Node/DSH兼容、SnowLuma扫码与API/模型凭据配置；package postinstall会修改依赖dist相对导入，不是纯素材安装。持续有宿主与桥接后台、平台网络、模型多步调用、语音可选服务和原始/派生/备份存储；费用与人工监督时间未知。失败恢复要区分宿主accepted、OneBot发送、平台账号/限流、记忆和角色状态；退出要关平台开关/调度/桥接、撤凭据并按需处理本地记录，已发外部内容需另行管理。出现错对象、泄密、重复发或无法证明停发时停止，回独立桌宠和人工社交。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-42](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/package.json#L25-L42)

postinstall与网络/语音依赖。

<details>
<summary>查看原文（18行）</summary>

```text
    "audit": "node widget/tools/ci-audit.mjs --no-pack",
    "postinstall": "node scripts/patch-snowluma-sdk.mjs"
  },
  "dependencies": {
    "@deepseek-ai/dsh-host-apiproxy": "0.1.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.1",
    "@modelcontextprotocol/sdk": "^1.30.0",
    "@snowluma/mcp": "^1.14.20",
    "@snowluma/sdk": "^1.14.20",
    "edge-tts": "^1.0.1",
    "js-yaml": "^4.3.2",
    "ws": "^8.22.1",
    "zod": "^4.4.3"
  },
  "dsh": {
    "bundle": {
      "patch": [
        "./cordis.patch.yml",
```

</details>

**依据 2 · 源码核查**：[scripts/patch-snowluma-sdk.mjs:30-50](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/scripts/patch-snowluma-sdk.mjs#L30-L50)

安装会写依赖dist。

<details>
<summary>查看原文（21行）</summary>

```text
  const distRoot = path.join(ROOT, 'node_modules', pkg, 'dist');
  if (!fs.existsSync(distRoot)) {
    console.log(`[patch-snowluma] ${pkg}: dist 不存在，跳过`);
    continue;
  }
  let patched = 0;
  for (const file of walk(distRoot)) {
    if (!file.endsWith('.js')) continue;
    let src;
    try {
      src = fs.readFileSync(file, 'utf8');
    } catch (error) {
      failed += 1;
      console.log(`[patch-snowluma] ${pkg}: 读不了 ${path.relative(distRoot, file)}（${error?.code ?? error}），跳过`);
      continue;
    }
    const next = src.replace(/from\s+'(\.[^']+)'/g, (m, spec) => {
      if (spec.endsWith('.js') || spec.endsWith('.json')) return m;
      const target = path.resolve(path.dirname(file), spec);
      if (fs.existsSync(target + '.js')) return m.replace(spec, spec + '.js');
      if (fs.existsSync(target + '.json')) return m.replace(spec, spec + '.json');
```

</details>

**依据 3 · 源码核查**：[backend/lib/index.js:641-668](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/index.js#L641-L668)

SnowLuma启动/连通前提。

<details>
<summary>查看原文（28行）</summary>

```text
    if (process.env.SURFCORE_SKIP_AUTOSTART === '1') return { ok: true, skipped: 'skip-autostart' };
    const cfg = readQqConfig().config?.snowluma ?? {};
    if (cfg.allowLaunch !== true) return { ok: true, skipped: 'allowLaunch=false' };
    if (Date.now() - snowBootFailAt < 5 * 60_000) return { ok: false, skipped: 'cooldown' };
    snowBootBusy = true;
    try {
      const launched = await launchSnowLuma().catch((error) => ({ ok: false, error: String(error?.message ?? error) }));
      // 首次使用（还没扫码登录）不自动折腾，交给用户在面板里走一次向导
      if (launched?.needsLogin) return { ok: false, error: '首次使用：需要先扫码登录一次' };
      const deadline = Date.now() + 10_000;
      while (Date.now() < deadline) {
        if ((await portOpen(3000)) || (await portOpen(3001))) break;
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      const found = await discoverSnowLumaConnection({ cfg: readQqConfig().config ?? {}, timeoutMs: 5000 }).catch(() => null);
      if (found?.ok) {
        const next = { httpUrl: found.baseUrl };
        if (found.wsUrl) next.wsUrl = found.wsUrl;
        if (found.token) next.accessToken = found.token;
        if (found.wsToken) next.wsToken = found.wsToken;
        // 配置已经一致就别每次都写盘
        const same = cfg.accessToken === next.accessToken && cfg.wsToken === next.wsToken && cfg.httpUrl === next.httpUrl;
        if (!same) saveQqConfig({ snowluma: next });
        pluginLog('[boot] SnowLuma 已就绪：', `${found.self?.nickname ?? ''}（${found.self?.user_id ?? ''}）`);
        return { ok: true, account: String(found.self?.nickname ?? '') };
      }
      snowBootFailAt = Date.now();
      return { ok: false, error: launched?.message || '还没连上 OneBot（确认电脑上的 QQ 已登录）' };
```

</details>

**依据 4 · 源码核查**：[backend/lib/scheduler.js:545-566](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/scheduler.js#L545-L566)

B站高权限需单独核。

<details>
<summary>查看原文（22行）</summary>

```text
  function ensurePermission(where = 'tick') {
    const target = String(config().agent?.sandbox || 'danger-full-access')
    const result = applySessionPermission(ctx, sessionId, target, (message) => log(message))
    if (!result.ok && result.reason !== 'session-not-active' && result.reason !== 'permission-services-unavailable') {
      log(`[权限] ${where} 无法自动设置 B站 会话权限：${result.reason}`);
    }
    return result
  }

  // 会话创建事件是最可靠的时机：此时 session 对象已经存在，可以在第一句 prompt 之前
  // 把权限切成 danger-full-access；不用等 ensureSession 之后再猜 ctx.sessions 有没有同步。
  let permissionListenerOff = null
  try {
    if (typeof ctx.on === 'function') {
      permissionListenerOff = ctx.on('session/created', (session) => {
        if (!session || session.id !== sessionId) return
        try {
          const target = String(config().agent?.sandbox || 'danger-full-access')
          applySessionPermissionTo(ctx, session, target, (message) => log(message))
        } catch (error) {
          log(`[权限] session/created 处理失败：${String(error?.message ?? error)}`)
        }
```

</details>

**依据 5 · 源码核查**：[backend/lib/memory.js:296-324](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L296-L324)

派生与备份持续状态。

<details>
<summary>查看原文（29行）</summary>

```text
export function syncQqToBili({ force = false } = {}) {
  const all = readAll();
  const unified = all.unified;
  const qq = all.qq;
  if (unified.memory?.qqToBili?.enabled !== true) {
    return { ok: true, skipped: 'disabled', reason: 'QQ → B站 记忆同步没有开启' };
  }
  const collected = collectQqMemory({ unified, qqConfig: qq });
  if (!collected.kept.length) {
    const doc = buildQqForBiliDoc(collected);
    backupFile(qqForBiliFile(), 'qq-for-bili');
    writeTextAtomic(qqForBiliFile(), `${doc}\n`);
    const stats = { ...collected.stats, chars: doc.length, ok: true, empty: true };
    writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
    appendAudit({ direction: 'qq->bili', ok: true, ...stats });
    return { ok: true, stats, path: qqForBiliFile() };
  }
  const doc = buildQqForBiliDoc(collected, { qqConfig: qq });
  // 最后一道闸：任何严重命中都拒绝落盘（不把“疑似泄露”写成事实）。
  assertSafeOutput(doc.replace(/\b\d{5,12}\b/g, ''), 'QQ→B站记忆');
  backupFile(qqForBiliFile(), 'qq-for-bili');
  writeTextAtomic(qqForBiliFile(), `${doc}\n`);
  const stats = { ...collected.stats, chars: doc.length, ok: true };
  writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
  appendAudit({ direction: 'qq->bili', ok: true, ...stats });
  // 顺手扫描身份对齐候选（只从公开群消息里找“我B站是…”）
  let candidates = 0;
  if (all.unified.alignment?.autoDetect !== false) {
    candidates = scanQqFeedForCandidates({ maxMessages: 800 }).added;
```

</details>

#### 缺口

- 无宿主/账号验收、平台政策核查、完整费用与真实采用反馈。
  **影响**：不建议直接生产社交采用。
  **进一步探讨**：先按禁用分层与测试账号矩阵核验，记录停发、隐私误报/漏报和总调用成本。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么可验证改进值得考虑？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把跨平台记忆变成显式“准出预览”，在首次新来源/身份对齐/隐私规则变化时要求用户审阅，并保存原始来源到派生条目的可撤销映射；后续模型只能引用已准出片段。现有正则和群白名单不表达发言人同意，也无法保证语义匿名，简单增加更多正则仍有漏检。

相对现状增量在用户能知道哪条记忆将跨边界、撤销后哪些派生需重建，而非承诺删除外部已发消息。代价是审批负担、来源索引和版本迁移。最小验证用合成群资料、别名重识别与混入秘密样本，对比规则自动写盘和准出预览的漏出、错杀、审阅时间及撤销完成率；若人工审阅不可承受或依旧无法改善准出判断，否定方案。没有用户或商业验证，不把它说成生产机会。

#### 证据与依据

**依据 1 · 源码核查**：[backend/lib/memory.js:113-168](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L113-L168)

现有准入与规则。

<details>
<summary>查看原文（56行）</summary>

```text
    scanned: items.length,
    kept: 0,
    dropped: 0,
    redactions: 0,
    ownerSkipped: 0,
    privateSkipped: 0,
    groupSkipped: 0,
    byReason: {},
    groups: groups.size,
    policyVersion: PRIVACY_POLICY_VERSION,
  };
  const kept = [];
  for (const item of items) {
    const gate = isPublicGroupMessage({
      key: `group:${item.groupId}`,
      groupIds: allowedGroups,
      text: item.text,
      senderId: item.senderId,
      ownerId,
      includeOwner: cfg.includeOwner === true,
    });
    if (!gate.ok) {
      stats.dropped += 1;
      if (gate.reason.includes('管理员')) stats.ownerSkipped += 1;
      else if (gate.reason.includes('私信')) stats.privateSkipped += 1;
      else if (gate.reason.includes('白名单')) stats.groupSkipped += 1;
      stats.byReason[gate.reason] = (stats.byReason[gate.reason] ?? 0) + 1;
      continue;
    }
    const result = cleanMessage(item.text);
    if (!result.ok) {
      stats.dropped += 1;
      stats.byReason[result.reason || 'privacy'] = (stats.byReason[result.reason || 'privacy'] ?? 0) + 1;
      continue;
    }
    stats.redactions += result.hits.length;
    stats.kept += 1;
    const safeName = sanitizeText(item.senderName, { dropUnsafeLines: false, keepNumbers: false, maxChars: 24 });
    kept.push({
      ...item,
      clean: result.text,
      groupAlias: groups.get(item.groupId) || '群?',
      senderAlias: (cfg.useNicknames !== false && safeName.ok && safeName.text) ? safeName.text : '群友',
      topics: topicLabels(result.text),
    });
  }
  return { cfg, privacy, allowedGroups, stats, kept, groups };
}

function buildQqForBiliDoc(collected, { qqConfig } = {}) {
  const { cfg, stats, kept, groups } = collected;
  const links = listLinks();
  const qqById = new Map(links.filter((link) => link.identities.qq).map((link) => [link.identities.qq.id, link]));
  const lines = [];
  lines.push('# QQ 群里的近况（给 B站 那边看）');
  lines.push('');
```

</details>

**依据 2 · 源码核查**：[backend/lib/memory.js:185-200](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L185-L200)

派生文本含身份关联。

<details>
<summary>查看原文（16行）</summary>

```text
  const senderEntries = [...bySender.values()].sort((a, b) => b.samples.length - a.samples.length);
  if (!senderEntries.length) {
    lines.push('- （这段时间没有可同步的公开群消息）');
  } else {
    for (const entry of senderEntries.slice(0, 20)) {
      const topics = [...entry.topics.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([label]) => label);
      const aligned = links.find((link) => link.identities.qq?.id === entry.senderId)?.identities?.bili;
      const who = aligned?.name ? `（B站「${aligned.name}」）` : '';
      lines.push(`- ${entry.groupAlias} · ${entry.senderAlias}${who}：${topics.length ? `最近常聊 ${topics.join('、')}` : '最近聊得比较杂'}${entry.samples[0] ? `；说过「${entry.samples[0]}」` : ''}`);
    }
  }
  lines.push('');

  // 最近话题（每群最多 8 条）
  lines.push('## 二、最近群里在聊什么');
  lines.push('');
```

</details>

**依据 3 · 源码核查**：[backend/lib/memory.js:296-324](https://github.com/louke6572/dsh-Dfy/blob/df08522f54aef92182524488ff2cbbeedde780fa/backend/lib/memory.js#L296-L324)

现有备份落盘链路。

<details>
<summary>查看原文（29行）</summary>

```text
export function syncQqToBili({ force = false } = {}) {
  const all = readAll();
  const unified = all.unified;
  const qq = all.qq;
  if (unified.memory?.qqToBili?.enabled !== true) {
    return { ok: true, skipped: 'disabled', reason: 'QQ → B站 记忆同步没有开启' };
  }
  const collected = collectQqMemory({ unified, qqConfig: qq });
  if (!collected.kept.length) {
    const doc = buildQqForBiliDoc(collected);
    backupFile(qqForBiliFile(), 'qq-for-bili');
    writeTextAtomic(qqForBiliFile(), `${doc}\n`);
    const stats = { ...collected.stats, chars: doc.length, ok: true, empty: true };
    writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
    appendAudit({ direction: 'qq->bili', ok: true, ...stats });
    return { ok: true, stats, path: qqForBiliFile() };
  }
  const doc = buildQqForBiliDoc(collected, { qqConfig: qq });
  // 最后一道闸：任何严重命中都拒绝落盘（不把“疑似泄露”写成事实）。
  assertSafeOutput(doc.replace(/\b\d{5,12}\b/g, ''), 'QQ→B站记忆');
  backupFile(qqForBiliFile(), 'qq-for-bili');
  writeTextAtomic(qqForBiliFile(), `${doc}\n`);
  const stats = { ...collected.stats, chars: doc.length, ok: true };
  writeSyncState({ lastQqToBili: { at: new Date().toISOString(), ...stats } });
  appendAudit({ direction: 'qq->bili', ok: true, ...stats });
  // 顺手扫描身份对齐候选（只从公开群消息里找“我B站是…”）
  let candidates = 0;
  if (all.unified.alignment?.autoDetect !== false) {
    candidates = scanQqFeedForCandidates({ maxMessages: 800 }).added;
```

</details>

#### 缺口

- 无准出审批接受度和撤销覆盖实验。
  **影响**：不能认为额外流程值得。
  **进一步探讨**：比较合成样本的正确准出与人工负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
