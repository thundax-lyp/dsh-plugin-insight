# dsh-profile-stylist

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[05dfa3e](https://github.com/7gzgn/dsh-profile-stylist/tree/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：用宿主 LLM 起草 GitHub/Gitee 个人资料，默认 dry-run，确认后经浏览器填文本/头像并点击保存。

> **核心亮点**：把文案生成、头像模板和 GitHub/Gitee 浏览器写入接成资料编辑流程，并有默认体检视图。详见[Q01](#research-q01)。

> **风险与缺陷**：直接 apply 不执行作者宣称的 URL/长度收敛，且 Gitee 头像确认选择器与脚本 DOM 搜索类型不匹配。详见[Q03](#research-q03)与[Q04](#research-q04)。

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
  - [Q01 · 自动写个人资料覆盖什么任务和站点？](#detail-section-11)
  - [Q02 · 文案、图片和写入动作如何接线？](#detail-section-12)
  - [Q03 · “只收 http/https”和按站点长度截断是否覆盖直接写入？](#detail-section-13)
  - [Q04 · Gitee 头像确认路径和结果回报是否一致？](#detail-section-14)
  - [Q05 · 安装、权限和恢复需要哪些条件？](#detail-section-15)
  - [Q06 · 如何形成真正可审查的资料写入流程？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护自己的 GitHub/Gitee 资料、文案和头像；需已登录浏览器及人工审阅。详见[Q01](#research-q01)。

手工编辑个人资料可靠可回读；本项需证明生成/上传节省操作且减少误写。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| profile_author | 生文案 | 需人工核事实 |
| profile_apply dry-run | 体检 | 不绑定下一次确认 |
| confirm:true | 自动填表/点击保存 | 直接字段绕过 URL/长度限制，无回读 |
| Gitee 头像 | 上传/确认 | div 确认与脚本查 button 不匹配 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH tools/systemPrompt、browser | 写入必需 | 工具与站点操作 | 无法写入 |
| 宿主 LLM | 自动草稿必需 | 生文案 | author 失败 |
| GitHub/Gitee 登录与 DOM | 写入必需 | 资料页面 | 选择器失效/未授权 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 草稿 | 调 profile_author | 人工核真实性 |
| 预览 | 调 profile_apply 默认 dry-run | 检字段/头像/站点 |
| 确认 | 明确 confirm:true | 写后刷新资料页回读 |
| 故障 | 查实际已写字段 | 避免盲重试覆盖 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH LLM/browser 与账号，金额未知 | 配插件、登录、选择头像 | 站点 DOM 可变 |
| 写入 | LLM token/浏览器时间未知 | 审文案、dry-run、确认 | 直接 apply 校验缺口 |
| 恢复 | 可能部分写入 | 回读资料/手工纠正 | Gitee 头像确认不匹配 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 草稿生成 | LLM 与字段归一化 | 文案真实性/成本 |
| 默认体检 | confirm 非 true 为 dry-run | 用户一定先阅读草稿 |
| 站点写入 | 两站档案和浏览器脚本 | Gitee 头像/保存持久结果 |

> **思考**：直接 apply 不执行作者宣称的 URL/长度收敛，且 Gitee 头像确认选择器与脚本 DOM 搜索类型不匹配。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把文案生成、头像模板和 GitHub/Gitee 浏览器写入接成资料编辑流程，并有默认体检视图。详见[Q01](#research-q01)。

把文案生成、头像模板和 GitHub/Gitee 浏览器写入接成资料编辑流程，并有默认体检视图。详见[Q01](#research-q01)。

分 author/hosts/compose 层有利扩站；直接 apply 与生成层校验分叉，站点确认脚本未使用档案 selector。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

直接 apply 不执行作者宣称的 URL/长度收敛，且 Gitee 头像确认选择器与脚本 DOM 搜索类型不匹配。详见[Q03](#research-q03)与[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在测试账号观察；直接 apply 统一校验与 Gitee 头像确认修复、远端回读之后才扩大使用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持三工具和默认 dry-run，但直接 apply 绕过文案长度与 URL 归一化；Gitee 头像确认档案为 div 而脚本只找 button/input；未回读站点结果。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/hosts.js、lib/author.js、lib/constants.js、lib/compose.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、manifest、author/hosts/compose/index；未运行目标代码、站点浏览器或作者测试；旧 META 仅复用。
- 下一步：目标 GitHub/Gitee 测合法/非法 URL、超长、头像 div 确认、页面变化、提交回读、部分失败与测试账号恢复。

**分析版本**

- **仓库**：[7gzgn/dsh-profile-stylist](https://github.com/7gzgn/dsh-profile-stylist)
- **版本号**：0.2.2（[固定提交 05dfa3e](https://github.com/7gzgn/dsh-profile-stylist/tree/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是统一归一化、一次性摘要确认、按档案 selector 处理头像并提交后回读。详见[Q06](#research-q06)。

目标 GitHub/Gitee 测合法/非法 URL、超长、头像 div 确认、页面变化、提交回读、部分失败与测试账号恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 1360 | 972 | 307 | — |
| .md | source | 1 | 103 | — | — | 1116 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/7gzgn/dsh-profile-stylist/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：个人资料写入能否在统一字段约束和可验证确认下安全落地 GitHub/Gitee？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 自动写个人资料覆盖什么任务和站点？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件把“想要怎样的人设”分为 host LLM 生成草稿、资料字段/头像规划和浏览器写入三工具，目标是已登录 GitHub/Gitee 的个人资料页。它能读取本地头像或在页面 canvas 画 460px 模板图；默认 profile_apply dry-run，不自动打开页面。站点选择器“真机验证”是作者报告，本轮只核固定源码，没有重访当前网页，因此不保证今天仍有效。资料内容由模型生成后仍需用户审阅真实性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-32](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/README.md#L1-L32)

作者描述目标流程和默认 dry-run

<details>
<summary>查看原文（32行）</summary>

````text
# dsh-profile-stylist（个人资料配置）

**你说要什么样的人设，它写出来，并把资料页填好。**

"我想要个给主人打工的 AI 小助手，可爱但专业" → 它生成昵称/简介/标语 → 从你的素材库里挑一张头像（或按名字画一张）→ 打开你自己的资料页填进去。

> 它替用户写**关于他自己**的东西，所以默认值是三重的保守：
> **默认 dry-run**（不传 `confirm: true` 只演算）、**只认资料字段**（档案里没有密码/邮箱/安全设置）、
> **写前摊开**（要写什么、写到哪、用哪张图，提交前整份给人看）。

---

## 它做什么

| 步 | 动作 | 细节 |
| --- | --- | --- |
| ① | 生成文案 | 按"你的需求"让**宿主模型服务**出昵称/简介/标语/所在地/链接；写不出来就不写，**不编** |
| ② | 收敛草稿 | 字段白名单 + 按站点长度截断（GitHub bio 160 字符）+ **网址只收 http/https** |
| ③ | 选头像 | 素材库 / 你给的本地图片路径（本机没有图像生成服务，所以只这三条路） |
| ④ | 体检 | 目标站点能不能写这些字段、有哪些会超限、选择器是否验证过 |
| ⑤ | 写入（要显式确认） | 打开资料页 → 填文本 → 头像走 `File → DataTransfer → input.files → change` 交给站点自己的 JS → 点保存/确认 |
| ⑥ | 回报 | 填了哪些、缺哪些、头像是否确认、任何警告 |

## 三个工具

```
profile_assets  [target=github]                     # 看素材库里有哪些图
profile_author  wish="…" [host=github] [current=…]   # 出草稿，不写站点
profile_apply   fields='{"name":"…","bio":"…"}' [host=github] [avatarPath=…|avatarFromAssets=…] [confirm=true]
```

`profile_apply` **不传 `confirm: true` 就是 dry-run**：只做体检 + 展示，不打开页面、不点任何按钮。
````

</details>

**依据 2 · 作者声明**：[README.md:49-72](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/README.md#L49-L72)

GitHub/Gitee 范围和选择器声明

<details>
<summary>查看原文（24行）</summary>

```text
## 支持的站点

**一句话：只适合「git 系」的资料页 —— 目前就是 GitHub 和 Gitee，两家都是真机验证过的。**
其他的（微博 / 知乎 / B站 / 小红书 / 掘金…）**没有适配**，传了会直接拒绝，不猜选择器。

| 站点 | 状态 | 备注 |
| --- | --- | --- |
| **GitHub** | ✅ 选择器**真机验证过** | `#user_display_name` / `#user_profile_bio` / `#avatar_upload` + 「Set new profile picture」 |
| **Gitee** | ✅ 选择器**真机验证过**（2026-10-17，gitee.com/profile） | `#user_name` / `#user_bio` / `#user_company` / `#user_blog`，保存按钮 `button[name=commit]`（「更新」），头像 `#avatar-input` + `#confirm-avatar`（「确定」） |

**逐字段的支持差异**（同样是 git 站，字段并不完全一样）：

| 字段 | GitHub | Gitee |
| --- | --- | --- |
| 昵称 / 显示名 | ✅ | ✅ |
| 一句话简介 | ✅ | ✅ |
| 公司 / 组织 | ✅ | ✅ |
| 链接（主页） | ✅ | ✅ |
| **所在地** | ✅ | ❌ 两级下拉（省+市），明确不支持 |

**Gitee 的所在地写不了**：它是 `#user_province` + `#user_city` 两级下拉，不在字段表里 ——
传 `location` 会出现在 `unsupported`（明确告诉你不支持），不会静默失败。

不认识的站点**直接拒绝**，不猜选择器。
```

</details>

**依据 3 · 源码核查**：[lib/index.js:222-364](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L222-L364)

assets/author 工具注册

<details>
<summary>查看原文（143行）</summary>

```text
export function apply(ctx, config) {
  const cfg = config ?? {};
  if (cfg.enabled === false) return;
  const assetDir = typeof cfg.assetDir === 'string' && cfg.assetDir !== '' ? cfg.assetDir : ASSET_DIR;
  const disposers = [];

  if (ctx.tools !== undefined && typeof ctx.tools.register === 'function') {
    // ---------- ① 素材 ----------
    disposers.push(ctx.tools.register(defineTool({
      name: 'profile_assets',
      description: [
        '看个人资料插件能用的头像素材：素材库目录、有哪些图（名字/体积）。',
        '素材库目录固定为 `${USERPROFILE}\\.dsh\\dsh-profile-stylist\\assets\\avatars` —— 往里丢图就能用。',
        '本机没有图像生成服务，所以头像四条来源：素材库 / 用户给的本地路径 / 页面内 canvas 合成（initials·gradient·tagline） / 不给就不换。',
      ].join('\n'),
      timeoutMs: 30000,
      parameters: {
        target: { type: 'string', description: '可选：只查某个目标站点能用什么（github / gitee），用于回显字段能力' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            dir: { type: 'string' },
            created: { type: 'boolean' },
            count: { type: 'number' },
            assets: { type: 'json' },
            hosts: { type: 'json' },
            hint: { type: 'string' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `profile_assets 失败：${String(value.error)}` }];
          const rows = (value.assets ?? []).map((a) => `  · ${a.file}（${Math.round(a.bytes / 1024)}KB）`);
          const hosts = (value.hosts ?? []).map((h) => `  · ${h.key} — ${h.name}${h.verified ? '' : '（选择器未实测）'}`);
          const lines = [
            `🖼️ 素材库：${value.dir}${value.created ? '（刚建好）' : ''}`,
            rows.length > 0 ? rows.join('\n') : '  （空的 —— 往里放 png/jpg 就能用）',
            '可写站点：',
            hosts.join('\n'),
          ];
          if (value.hint) lines.push(`  ${value.hint}`);
          return [{
            type: 'text',
            text: lines.join('\n'),
          }];
        },
      },
      async execute(args) {
        try {
          const info = await ensureAssetDir(assetDir);
          const assets = await listAvatarAssets(assetDir);
          const hosts = listHosts();
          const out = { ok: true, dir: info.dir, created: info.created, count: assets.length, assets, hosts };
          if (typeof args?.target === 'string' && args.target !== '') out.hint = describeHost(args.target);
          return out;
        } catch (error) {
          return { ok: false, error: error instanceof Error ? error.message : String(error) };
        }
      },
    })));

    // ---------- ② 生成草稿 ----------
    disposers.push(ctx.tools.register(defineTool({
      name: 'profile_author',
      description: [
        '按"你想要什么样的个人主页"生成一份资料草稿：昵称 / 简介 / 标语 / 所在地 / 链接，**只出草稿，不写任何站点**。',
        '文案由宿主的模型服务生成（插件不持有任何 API key）；写不出的字段它宁可不写，也不编。',
        '头像另说：本机没有图像生成服务，头像要么从素材库挑（profile_assets 看清单），要么给一个本地图片路径。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
      parameters: {
        wish: { type: 'string', description: '必填：你想要什么样的资料（一句话，比如"一个给主人打工的 AI 小助手，可爱但专业"）' },
        host: { type: 'string', description: '站点（github 默认 / gitee）—— 影响字数上限与可写字段' },
        current: { type: 'string', description: '可选：当前资料的 JSON 字符串（可沿用可改写）' },
        maxFields: { type: 'number', description: `可选：最多写几个字段（默认 ${DEFAULTS.maxFields}）` },
        provider: { type: 'string', description: '可选：覆盖模型 provider' },
        model: { type: 'string', description: '可选：覆盖模型' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            host: { type: 'string' },
            fields: { type: 'json' },
            notes: { type: 'json' },
            preview: { type: 'string' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => {
          if (value.ok === false) return [{ type: 'text', text: `profile_author 失败：${String(value.error)}` }];
          return [{
            type: 'text',
            text: [
              `✍️ 草稿（${value.host}）—— 还没写任何站点：`,
              value.preview,
              '下一步：确认文案后调 `profile_apply`（**默认 dry-run**，加 `confirm:true` 才真的写）。',
            ].join('\n'),
          }];
        },
      },
      async execute(args) {
        const host = normalizeHost(args?.host) ?? 'github';
        try {
          const llm = llmOf(ctx);
          let current = undefined;
          if (typeof args?.current === 'string' && args.current.trim() !== '') {
            try {
              current = JSON.parse(args.current);
            } catch {
              current = { note: args.current };
            }
          }
          const draft = await draftProfile(ctx, llm, {
            wish: args?.wish,
            host,
            current,
            maxFields: args?.maxFields,
            provider: args?.provider,
            model: args?.model,
          });
          return {
            ok: true,
            host,
            fields: draft.fields,
            notes: draft.notes,
            preview: renderDraft(draft.fields, draft.notes),
          };
        } catch (error) {
          return { ok: false, host, error: error instanceof Error ? error.message : String(error) };
        }
      },
    })));

    // ---------- ③ 写入（默认 dry-run） ----------
    disposers.push(ctx.tools.register(defineTool({
      name: 'profile_apply',
```

</details>

**依据 4 · 源码核查**：[lib/index.js:363-450](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L363-L450)

apply 规划与 confirm 分支

<details>
<summary>查看原文（88行）</summary>

```text
    disposers.push(ctx.tools.register(defineTool({
      name: 'profile_apply',
      description: [
        '把一份资料草稿写进你自己的账号（内置档案：GitHub / Gitee，两份选择器都已在真机核对过）。',
        '**默认 dry-run**：不传 `confirm: true` 就只做体检 + 展示"要写什么、写到哪"，**不打开页面、不点任何按钮**。',
        '`confirm: true` 才会真的打开资料页填字段、并把头像交给站点的上传控件（仍然由站点自己的 JS 完成入库）。',
        `头像四选一：\`avatarPath\`（本地图片）/ \`avatarFromAssets\`（素材库里的文件名）/ \`avatarTemplate\`（**页面里 canvas 当场合成**：${Object.entries(AVATAR_TEMPLATES).map(([k, v]) => `${k}=${v.label}`).join('、')}）/ 都不给则不换头像。`,
        '**红线**：只写资料字段，不碰密码/邮箱/安全设置/支付。',
      ].join('\n'),
      timeoutMs: TOOL_TIMEOUT_MS,
      parameters: {
        fields: { type: 'string', description: '必填：要写的字段，JSON 字符串（如 {"name":"大肥鱼","bio":"…"}）' },
        host: { type: 'string', description: '站点（github 默认 / gitee）' },
        avatarPath: { type: 'string', description: '可选：本地头像图片的绝对路径' },
        avatarFromAssets: { type: 'string', description: '可选：素材库里的文件名（配合 profile_assets 使用）' },
        avatarTemplate: { type: 'string', description: `可选：没有素材图时当场合成一张 —— ${Object.keys(AVATAR_TEMPLATES).join(' / ')}（initials 纯色底+首字 / gradient 渐变底+首字 / tagline 深色底+名字+标语）` },
        avatarTagline: { type: 'string', description: '可选：tagline 模板里的那行标语（一句短话）' },
        avatarText: { type: 'string', description: '可选：合成头像用的名字（默认取 fields.name）' },
        confirm: { type: 'boolean', description: '**必须显式 true 才真的写入**；不传或 false = dry-run' },
        session: { type: 'string', description: '可选：复用哪个浏览器会话键（默认用插件自己的）' },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            ok: { type: 'boolean', required: true },
            mode: { type: 'string' },
            host: { type: 'string' },
            summary: { type: 'string' },
            result: { type: 'json' },
            hint: { type: 'string' },
            error: { type: 'string' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: renderApplyText(value) }],
      },
      async execute(args) {
        // ---- 解析字段 ----
        let fields = {};
        try {
          fields = typeof args?.fields === 'string' ? JSON.parse(args.fields) : (args?.fields ?? {});
        } catch {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 不是合法 JSON' };
        }
        if (fields === null || typeof fields !== 'object' || Array.isArray(fields)) {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 必须是对象' };
        }

        // ---- 头像（先只定位，不读内容） ----
        let avatar = null;
        let composeRequest = null;
        if (typeof args?.avatarTemplate === 'string' && args.avatarTemplate !== '') {
          const template = normalizeTemplate(args.avatarTemplate);
          if (template === null) {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `avatarTemplate 只能是 ${Object.keys(AVATAR_TEMPLATES).join(' / ')}` };
          }
          const nameText = String(fields.name ?? args?.avatarText ?? '').trim();
          if (AVATAR_TEMPLATES[template].needTagline && nameText === '') {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `${template} 模板需要名字（fields.name 或 avatarText）` };
          }
          composeRequest = {
            template,
            name: nameText === '' ? '?' : nameText,
            initials: pickInitials(nameText),
            tagline: typeof args?.avatarTagline === 'string' ? args.avatarTagline : '',
            palette: paletteFor(nameText),
            size: AVATAR_SIZE,
          };
          avatar = { kind: 'composed', template, label: `合成头像（${AVATAR_TEMPLATES[template].label}）` };
        } else if (typeof args?.avatarPath === 'string' && args.avatarPath !== '') {
          avatar = { kind: 'file', path: args.avatarPath, label: args.avatarPath };
        } else if (typeof args?.avatarFromAssets === 'string' && args.avatarFromAssets !== '') {
          avatar = { kind: 'asset', file: args.avatarFromAssets, label: `素材库：${args.avatarFromAssets}` };
        }

        const plan = planApply({ host: args?.host ?? 'github', fields, avatar });
        const dryRun = args?.confirm !== true;

        if (dryRun) {
          return {
            ok: true,
            mode: 'dry-run',
            host: plan.host,
            summary: plan.summary,
            hint: '这是 dry-run —— 什么都没动。确认无误后加 `confirm: true` 再调一次。',
          };
        }
```

</details>

**依据 5 · 源码核查**：[lib/compose.js:17-24](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/compose.js#L17-L24)

三类头像模板和尺寸

```text
export const AVATAR_TEMPLATES = Object.freeze({
  initials: { label: '纯色底 + 名字首字', needTagline: false },
  gradient: { label: '渐变底 + 名字首字', needTagline: false },
  tagline: { label: '深色底 + 名字 + 标语', needTagline: true },
});

/** 画布边长（px）。 */
export const AVATAR_SIZE = 460;
```

#### 缺口

- 当前站点 DOM、真实浏览器和生成质量未测
  **影响**：不能保证写入成功或文案真实
  **进一步探讨**：目标测试账号逐字段做 dry-run、确认、回读

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文案、图片和写入动作如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

profile_author 调宿主 llm 服务与默认模型路线，解析 JSON、限字段并对生成的 blog 做 http/https 检查；profile_apply 可独立接收 JSON fields，不要求先调用 author。confirm===true 后打开浏览器会话，准备图片 data URL 或 canvas，打开预设 profileUrl，通过页面脚本设置字段、触发 input/change，再按首个匹配保存按钮点击。返回只表示脚本报告按钮已点/头像控件确认，缺乏远端保存后的回读核验；页面导航与网络失败可能造成部分写入。

#### 证据与依据

**依据 1 · 源码核查**：[lib/author.js:124-167](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/author.js#L124-L167)

LLM 草稿、归一化与 blog 检查

<details>
<summary>查看原文（44行）</summary>

```text
export async function draftProfile(ctx, llm, request) {
  const wish = oneLine(request?.wish ?? '');
  if (wish === '') throw new Error('profile_author 需要一句"你想要什么样的资料"（wish）');
  const host = request?.host ?? 'github';
  const limits = hostSummary(host)?.limits ?? {};
  const current = request?.current && typeof request.current === 'object' ? request.current : null;

  const system = [
    '你是个人主页文案助手。按用户描述，写一份**真实、克制、不浮夸**的资料。',
    '规则：',
    '1. 只输出一个 JSON 对象，键只能从这些里选：' + Object.keys(FIELDS).join('、') + '。',
    '2. 写不出的键就别写，**不许编造**（没有公司就别编公司，没有博客就别编网址）。',
    `3. 简介（bio）必须 ≤ ${limits.bio ?? 160} 字符，单行，不换行，不用引号包裹。`,
    '4. 昵称（name）≤ 40 字符；标语（tagline）≤ 40 字符，风格与简介一致。',
    '5. 语言跟用户描述的语言一致（中文描述就写中文）。',
    '6. 不要 markdown、不要代码块、不要解释，只给 JSON。',
  ].join('\n');
  const user = [
    `站点：${host}`,
    `用户需求：${wish}`,
    current ? `当前资料（可沿用可改写）：${JSON.stringify(current)}` : '',
  ].filter(Boolean).join('\n');

  const route = resolveRoute(ctx, { provider: request?.provider, model: request?.model });
  const raw = await generateText(llm, {
    system,
    user,
    route,
    maxTokens: request?.maxTokens,
    timeoutMs: request?.timeoutMs,
  });
  const parsed = extractJsonObject(raw);
  const { fields, notes } = normalizeDraft(parsed ?? {}, { limits, maxFields: request?.maxFields });
  if (Object.keys(fields).length === 0) notes.push('模型没给出可用字段（原文已附在 raw 里）');

  // 网址字段做一次安全校验（只收 http/https）
  if (fields.blog) {
    const checked = safeUrl(fields.blog);
    if (checked === '') {
      delete fields.blog;
      notes.push('模型给的博客地址不合法，已丢弃（不写进任何站点）');
    } else fields.blog = checked;
  }
  return { fields, notes, raw, route };
```

</details>

**依据 2 · 源码核查**：[lib/index.js:400-450](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L400-L450)

apply 独立接 fields/dry-run

<details>
<summary>查看原文（51行）</summary>

```text
      async execute(args) {
        // ---- 解析字段 ----
        let fields = {};
        try {
          fields = typeof args?.fields === 'string' ? JSON.parse(args.fields) : (args?.fields ?? {});
        } catch {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 不是合法 JSON' };
        }
        if (fields === null || typeof fields !== 'object' || Array.isArray(fields)) {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 必须是对象' };
        }

        // ---- 头像（先只定位，不读内容） ----
        let avatar = null;
        let composeRequest = null;
        if (typeof args?.avatarTemplate === 'string' && args.avatarTemplate !== '') {
          const template = normalizeTemplate(args.avatarTemplate);
          if (template === null) {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `avatarTemplate 只能是 ${Object.keys(AVATAR_TEMPLATES).join(' / ')}` };
          }
          const nameText = String(fields.name ?? args?.avatarText ?? '').trim();
          if (AVATAR_TEMPLATES[template].needTagline && nameText === '') {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `${template} 模板需要名字（fields.name 或 avatarText）` };
          }
          composeRequest = {
            template,
            name: nameText === '' ? '?' : nameText,
            initials: pickInitials(nameText),
            tagline: typeof args?.avatarTagline === 'string' ? args.avatarTagline : '',
            palette: paletteFor(nameText),
            size: AVATAR_SIZE,
          };
          avatar = { kind: 'composed', template, label: `合成头像（${AVATAR_TEMPLATES[template].label}）` };
        } else if (typeof args?.avatarPath === 'string' && args.avatarPath !== '') {
          avatar = { kind: 'file', path: args.avatarPath, label: args.avatarPath };
        } else if (typeof args?.avatarFromAssets === 'string' && args.avatarFromAssets !== '') {
          avatar = { kind: 'asset', file: args.avatarFromAssets, label: `素材库：${args.avatarFromAssets}` };
        }

        const plan = planApply({ host: args?.host ?? 'github', fields, avatar });
        const dryRun = args?.confirm !== true;

        if (dryRun) {
          return {
            ok: true,
            mode: 'dry-run',
            host: plan.host,
            summary: plan.summary,
            hint: '这是 dry-run —— 什么都没动。确认无误后加 `confirm: true` 再调一次。',
          };
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:461-530](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L461-L530)

浏览器准备、注入与结果

<details>
<summary>查看原文（70行）</summary>

```text
        try {
          const sessionKey = typeof args?.session === 'string' && args.session !== '' ? args.session : PLUGIN_NAME;
          const session = await browser.open(sessionKey);

          // 头像：要么读成 data URL（页面侧靠它装配成 File），要么**当场画一张**。
          let avatarDataUrl = null;
          let avatarName = null;
          if (composeRequest !== null) {
            await browser.execute(session, {
              script: `window.__dshComposeReq = ${JSON.stringify(composeRequest)}; true`,
              timeoutMs: 10000,
            });
            const drawn = await browser.execute(session, { script: buildComposeScript(), timeoutMs: 20000 });
            let payload = null;
            try {
              payload = typeof drawn?.value === 'string' ? JSON.parse(drawn.value) : drawn?.value ?? null;
            } catch {
              payload = null;
            }
            if (payload?.ok !== true || typeof payload.dataUrl !== 'string') {
              throw new Error(`合成头像失败：${String(payload?.error ?? '页面没有返回图片')}`);
            }
            const decoded = decodePngDataUrl(payload.dataUrl);
            if (decoded.ok !== true) throw new Error(`合成头像失败：${decoded.error}`);
            avatarDataUrl = payload.dataUrl;
            avatarName = `composed-${composeRequest.template}.png`;
            avatar = { ...avatar, bytes: decoded.bytes, label: `${avatar.label}（${Math.round(decoded.bytes / 1024)}KB）` };
          } else if (avatar !== null) {
            const source = avatar.kind === 'file' ? avatar.path : join(assetDir, avatar.file);
            const image = await readImageBase64(source);
            avatarDataUrl = `data:${image.mime};base64,${image.base64}`;
            avatarName = image.file;
            avatar = { ...avatar, bytes: image.bytes, label: `${avatar.label}（${Math.round(image.bytes / 1024)}KB）` };
          }
          if (avatar !== null) {
            plan.avatar = avatar;
            plan.summary = planApply({ host: plan.host, fields: plan.check.supported, avatar }).summary;
          }

          await browser.openUrl(session, { url: plan.profile.profileUrl });

          const script = buildWriterScript();
          const request = {
            host: {
              fields: plan.profile.fields,
              form: plan.profile.form,
              avatar: plan.profile.avatar,
            },
            fields: plan.check.supported,
            avatarDataUrl,
            avatarName,
          };
          const executed = await browser.execute(session, {
            script: `window.__dshStylistReq = ${JSON.stringify(request)}; true`,
            timeoutMs: 20000,
          });
          if (executed && executed.ok === false) throw new Error('页面注入失败：' + String(executed.exception ?? ''));

          const written = await browser.execute(session, { script, timeoutMs: 90000 });
          if (written && written.ok === false) throw new Error('写入脚本失败：' + String(written.exception ?? ''));
          let result = null;
          try {
            result = typeof written?.value === 'string' ? JSON.parse(written.value) : written?.value ?? null;
          } catch {
            result = { ok: false, error: '页面没有回报可解析的结果' };
          }
          if (result && result.ok === false) throw new Error('页面侧报错：' + String(result.error ?? 'unknown'));
          return { ok: true, mode: 'apply', host: plan.host, summary: plan.summary, result };
        } catch (error) {
          return { ok: false, mode: 'apply', host: plan.host, summary: plan.summary, error: error instanceof Error ? error.message : String(error) };
```

</details>

**依据 4 · 源码核查**：[lib/index.js:85-175](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L85-L175)

页面填字段、头像、点击保存

<details>
<summary>查看原文（91行）</summary>

```text
export function buildWriterScript() {
  return `(async function () {
  try {
    var req = window.__dshStylistReq || {};
    var host = req.host || {};
    var fields = req.fields || {};
    var out = { ok: true, filled: [], missing: [], warnings: [], avatar: null };
    var F = host.fields || {};

    // ---------- 1) 文本字段 ----------
    for (var key in fields) {
      if (!Object.prototype.hasOwnProperty.call(fields, key)) continue;
      var sel = F[key];
      if (!sel) { out.missing.push(key); continue; }
      var el = null;
      try { el = document.querySelector(sel); } catch (e) { el = null; }
      if (!el) { out.missing.push(key); continue; }
      var tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') {
        var proto = tag === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
        var setter = Object.getOwnPropertyDescriptor(proto, 'value');
        if (setter && setter.set) setter.set.call(el, fields[key]); else el.value = fields[key];
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
        out.filled.push(key);
      } else {
        // contenteditable
        el.textContent = fields[key];
        el.dispatchEvent(new Event('input', { bubbles: true }));
        out.filled.push(key);
      }
    }

    // ---------- 2) 头像 ----------
    var av = host.avatar || {};
    if (req.avatarDataUrl && av.input) {
      var menu = av.menu ? document.querySelector(av.menu) : null;
      if (menu) { try { menu.click(); } catch (e) {} }
      var box = av.container ? document.querySelector(av.container) : null;
      var input = document.querySelector(av.input);
      if (!input) {
        out.avatar = { ok: false, reason: '页面里没有头像控件（' + av.input + '）' };
      } else {
        var blob = await fetch(req.avatarDataUrl).then(function (r) { return r.blob(); });
        var file = new File([blob], req.avatarName || 'avatar.png', { type: blob.type || 'image/png' });
        var dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // 等站点自己把图传上去（出现确认按钮即为就绪）
        var ready = false;
        for (var i = 0; i < 30; i++) {
          await new Promise(function (r) { setTimeout(r, 1000); });
          var texts = av.confirmText || [];
          var buttons = [].slice.call(document.querySelectorAll('button, input[type=submit]'));
          var hit = null;
          for (var b = 0; b < buttons.length; b++) {
            var t = (buttons[b].textContent || buttons[b].value || '').trim();
            for (var c = 0; c < texts.length; c++) { if (t.indexOf(texts[c]) >= 0) { hit = buttons[b]; break; } }
            if (hit) break;
          }
          if (!hit && box && /has-uploaded|is-uploaded/.test(box.className || '')) hit = 'state';
          if (hit) {
            if (hit !== 'state') { try { hit.click(); } catch (e) {} }
            ready = true;
            break;
          }
        }
        out.avatar = { ok: ready, bytes: file.size, confirmed: ready };
        if (!ready) out.warnings.push('头像传上去了但没等到确认按钮（可能站点改版或网络慢）');
      }
    }

    // ---------- 3) 文本保存 ----------
    if (req.save !== false && out.filled.length > 0) {
      var savers = (host.form && host.form.save) || [];
      for (var s = 0; s < savers.length; s++) {
        var btn = null;
        try { btn = document.querySelector(savers[s]); } catch (e) { btn = null; }
        if (btn) { try { btn.click(); out.saved = true; break; } catch (e) {} }
      }
      if (!out.saved) out.warnings.push('没找到保存按钮 —— 字段已填好，请手动点保存');
    }

    delete window.__dshStylistReq;
    return JSON.stringify(out);
  } catch (error) {
    return JSON.stringify({ ok: false, error: String((error && error.message) || error) });
  }
})()`;
}
```

</details>

#### 缺口

- 目标站点真实提交/回读、超时后部分状态未核
  **影响**：不能把 ok:true 等同站点持久保存
  **进一步探讨**：测试账号提交后刷新页面回读并覆盖部分失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “只收 http/https”和按站点长度截断是否覆盖直接写入？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

没有覆盖。author 草稿会对 blog 调 safeUrl，normalizeDraft 也做长度归一；但 profile_apply 直接接外部 JSON fields，经 planApply→checkAgainstHost 仅检查字段是否存在，超过上限只写 warning，supported 保留完整 String(value)，没有 safeUrl 检查。confirm:true 可把非 http(s) blog 或过长 bio 直接送入站点控件。站点自身可能拒绝，但插件不能宣称自身保证这两项收敛。默认 dry-run 只是参数分支；插件没有强制要求上一轮用户已看过草稿，调用者可直接 confirm:true。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-21](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/README.md#L7-L21)

作者宣称截断/URL 限制/写前展示

<details>
<summary>查看原文（15行）</summary>

```text
> 它替用户写**关于他自己**的东西，所以默认值是三重的保守：
> **默认 dry-run**（不传 `confirm: true` 只演算）、**只认资料字段**（档案里没有密码/邮箱/安全设置）、
> **写前摊开**（要写什么、写到哪、用哪张图，提交前整份给人看）。

---

## 它做什么

| 步 | 动作 | 细节 |
| --- | --- | --- |
| ① | 生成文案 | 按"你的需求"让**宿主模型服务**出昵称/简介/标语/所在地/链接；写不出来就不写，**不编** |
| ② | 收敛草稿 | 字段白名单 + 按站点长度截断（GitHub bio 160 字符）+ **网址只收 http/https** |
| ③ | 选头像 | 素材库 / 你给的本地图片路径（本机没有图像生成服务，所以只这三条路） |
| ④ | 体检 | 目标站点能不能写这些字段、有哪些会超限、选择器是否验证过 |
| ⑤ | 写入（要显式确认） | 打开资料页 → 填文本 → 头像走 `File → DataTransfer → input.files → change` 交给站点自己的 JS → 点保存/确认 |
```

</details>

**依据 2 · 源码核查**：[lib/author.js:155-167](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/author.js#L155-L167)

限制只在生成路径

<details>
<summary>查看原文（13行）</summary>

```text
  const parsed = extractJsonObject(raw);
  const { fields, notes } = normalizeDraft(parsed ?? {}, { limits, maxFields: request?.maxFields });
  if (Object.keys(fields).length === 0) notes.push('模型没给出可用字段（原文已附在 raw 里）');

  // 网址字段做一次安全校验（只收 http/https）
  if (fields.blog) {
    const checked = safeUrl(fields.blog);
    if (checked === '') {
      delete fields.blog;
      notes.push('模型给的博客地址不合法，已丢弃（不写进任何站点）');
    } else fields.blog = checked;
  }
  return { fields, notes, raw, route };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:400-450](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L400-L450)

apply 直接接 fields 且仅 confirm 布尔门

<details>
<summary>查看原文（51行）</summary>

```text
      async execute(args) {
        // ---- 解析字段 ----
        let fields = {};
        try {
          fields = typeof args?.fields === 'string' ? JSON.parse(args.fields) : (args?.fields ?? {});
        } catch {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 不是合法 JSON' };
        }
        if (fields === null || typeof fields !== 'object' || Array.isArray(fields)) {
          return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: 'fields 必须是对象' };
        }

        // ---- 头像（先只定位，不读内容） ----
        let avatar = null;
        let composeRequest = null;
        if (typeof args?.avatarTemplate === 'string' && args.avatarTemplate !== '') {
          const template = normalizeTemplate(args.avatarTemplate);
          if (template === null) {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `avatarTemplate 只能是 ${Object.keys(AVATAR_TEMPLATES).join(' / ')}` };
          }
          const nameText = String(fields.name ?? args?.avatarText ?? '').trim();
          if (AVATAR_TEMPLATES[template].needTagline && nameText === '') {
            return { ok: false, mode: 'dry-run', host: 'github', summary: '', error: `${template} 模板需要名字（fields.name 或 avatarText）` };
          }
          composeRequest = {
            template,
            name: nameText === '' ? '?' : nameText,
            initials: pickInitials(nameText),
            tagline: typeof args?.avatarTagline === 'string' ? args.avatarTagline : '',
            palette: paletteFor(nameText),
            size: AVATAR_SIZE,
          };
          avatar = { kind: 'composed', template, label: `合成头像（${AVATAR_TEMPLATES[template].label}）` };
        } else if (typeof args?.avatarPath === 'string' && args.avatarPath !== '') {
          avatar = { kind: 'file', path: args.avatarPath, label: args.avatarPath };
        } else if (typeof args?.avatarFromAssets === 'string' && args.avatarFromAssets !== '') {
          avatar = { kind: 'asset', file: args.avatarFromAssets, label: `素材库：${args.avatarFromAssets}` };
        }

        const plan = planApply({ host: args?.host ?? 'github', fields, avatar });
        const dryRun = args?.confirm !== true;

        if (dryRun) {
          return {
            ok: true,
            mode: 'dry-run',
            host: plan.host,
            summary: plan.summary,
            hint: '这是 dry-run —— 什么都没动。确认无误后加 `confirm: true` 再调一次。',
          };
        }
```

</details>

**依据 4 · 源码核查**：[lib/hosts.js:130-153](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/hosts.js#L130-L153)

checkAgainstHost 超长只警告且原值保留

<details>
<summary>查看原文（24行）</summary>

```text
 */
export function checkAgainstHost(host, fields) {
  const profile = hostProfile(host);
  const supported = {};
  const unsupported = [];
  const warnings = [];
  if (profile === null) {
    return { ok: false, supported, unsupported: Object.keys(fields ?? {}), warnings: ['不认识的站点：' + host] };
  }
  for (const [key, value] of Object.entries(fields ?? {})) {
    const selector = profile.fields[key];
    if (typeof selector !== 'string' || selector === '') {
      unsupported.push(key);
      continue;
    }
    const limit = profile.limits?.[key];
    if (Number.isFinite(limit) && String(value).length > limit) {
      warnings.push(`${key} 超过该站上限 ${limit} 字符，会被截断`);
    }
    supported[key] = String(value);
  }
  if (profile.verified !== true) warnings.push(`${profile.name} 的字段选择器尚未真机验证，可能要按现场调整`);
  return { ok: unsupported.length === 0, supported, unsupported, warnings };
}
```

</details>

**依据 5 · 源码核查**：[lib/index.js:503-520](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L503-L520)

supported 原值送页面脚本

<details>
<summary>查看原文（18行）</summary>

```text
          const request = {
            host: {
              fields: plan.profile.fields,
              form: plan.profile.form,
              avatar: plan.profile.avatar,
            },
            fields: plan.check.supported,
            avatarDataUrl,
            avatarName,
          };
          const executed = await browser.execute(session, {
            script: `window.__dshStylistReq = ${JSON.stringify(request)}; true`,
            timeoutMs: 20000,
          });
          if (executed && executed.ok === false) throw new Error('页面注入失败：' + String(executed.exception ?? ''));

          const written = await browser.execute(session, { script, timeoutMs: 90000 });
          if (written && written.ok === false) throw new Error('写入脚本失败：' + String(written.exception ?? ''));
```

</details>

#### 缺口

- 目标站点如何处理无效链接/超长内容未测
  **影响**：不能断言错误字段已持久化，但本地承诺不成立
  **进一步探讨**：对直接 apply 增安全归一化并用负例测试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Gitee 头像确认路径和结果回报是否一致？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Gitee 档案把确认控件设为 div#confirm-avatar，文本“确定”；页面脚本却只遍历 button 和 input[type=submit] 按文字寻找确认，Gitee 又未配 container 状态回退，故该 div 不会被选中，ready 在最长约 30 秒轮询后为 false，报告“头像传上去了但没等到确认按钮”。即使头像 input change 触发站点上传，当前实现也无法按该档案确认；README 所称 Gitee 头像“真机验证”不能替代这一代码路径核对。GitHub 走 button 文本则另需目标页面核实。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hosts.js:74-97](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/hosts.js#L74-L97)

Gitee 头像确认是 div#confirm-avatar，container 空

<details>
<summary>查看原文（24行）</summary>

```text
  gitee: {
    name: 'Gitee',
    aliases: ['gitee', 'gitee.com'],
    profileUrl: 'https://gitee.com/profile',
    fields: GITEE_FIELDS,
    form: {
      /** 真机：`<form id="edit_user_17709543" class="edit_user">` —— id 带用户号，所以按 class 找。 */
      selector: 'form.edit_user',
      save: ['button[name=commit]', 'input[name=commit]', 'button[type=submit]'],
    },
    avatar: {
      /** 没有菜单，直接是隐藏 input（真机：`<input id="avatar-input" type="file" accept="image/jpg,...">`）。 */
      menu: '',
      input: '#avatar-input',
      container: '',
      /** 传完要点「确定」（真机：`<div id="confirm-avatar">确定</div>`，不是 button）。 */
      confirm: ['#confirm-avatar'],
      confirmText: ['确定', '保存'],
    },
    /** 真机核对到的上限：姓名的 maxlength=60；其余字段页面上没设 maxlength。 */
    limits: { name: 60 },
    /** 2026-10-17 在 gitee.com/profile 真机核对过字段 id 与头像控件。 */
    verified: true,
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:118-155](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L118-L155)

写入脚本只遍历 button/input submit，轮询 30 秒

<details>
<summary>查看原文（38行）</summary>

```text
    // ---------- 2) 头像 ----------
    var av = host.avatar || {};
    if (req.avatarDataUrl && av.input) {
      var menu = av.menu ? document.querySelector(av.menu) : null;
      if (menu) { try { menu.click(); } catch (e) {} }
      var box = av.container ? document.querySelector(av.container) : null;
      var input = document.querySelector(av.input);
      if (!input) {
        out.avatar = { ok: false, reason: '页面里没有头像控件（' + av.input + '）' };
      } else {
        var blob = await fetch(req.avatarDataUrl).then(function (r) { return r.blob(); });
        var file = new File([blob], req.avatarName || 'avatar.png', { type: blob.type || 'image/png' });
        var dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // 等站点自己把图传上去（出现确认按钮即为就绪）
        var ready = false;
        for (var i = 0; i < 30; i++) {
          await new Promise(function (r) { setTimeout(r, 1000); });
          var texts = av.confirmText || [];
          var buttons = [].slice.call(document.querySelectorAll('button, input[type=submit]'));
          var hit = null;
          for (var b = 0; b < buttons.length; b++) {
            var t = (buttons[b].textContent || buttons[b].value || '').trim();
            for (var c = 0; c < texts.length; c++) { if (t.indexOf(texts[c]) >= 0) { hit = buttons[b]; break; } }
            if (hit) break;
          }
          if (!hit && box && /has-uploaded|is-uploaded/.test(box.className || '')) hit = 'state';
          if (hit) {
            if (hit !== 'state') { try { hit.click(); } catch (e) {} }
            ready = true;
            break;
          }
        }
        out.avatar = { ok: ready, bytes: file.size, confirmed: ready };
        if (!ready) out.warnings.push('头像传上去了但没等到确认按钮（可能站点改版或网络慢）');
      }
```

</details>

**依据 3 · 作者声明**：[README.md:54-58](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/README.md#L54-L58)

作者称 Gitee 头像选择器验证

```text
| 站点 | 状态 | 备注 |
| --- | --- | --- |
| **GitHub** | ✅ 选择器**真机验证过** | `#user_display_name` / `#user_profile_bio` / `#avatar_upload` + 「Set new profile picture」 |
| **Gitee** | ✅ 选择器**真机验证过**（2026-10-17，gitee.com/profile） | `#user_name` / `#user_bio` / `#user_company` / `#user_blog`，保存按钮 `button[name=commit]`（「更新」），头像 `#avatar-input` + `#confirm-avatar`（「确定」） |

```

#### 缺口

- Gitee 当前 DOM 与脚本运行结果未测
  **影响**：不能说所有 Gitee 头像更新失败，但确认实现不匹配
  **进一步探讨**：在测试账号实测并按选择器查询可点击 div，回读头像

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、权限和恢复需要哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

运行依赖 DSH tools/systemPrompt、宿主 llm/browser 服务、已登录目标站点的浏览器会话；用户要能查看生成草稿和真实写入回执。包 0.2.2 MIT，README 给 Windows junction 手装并称市场尚待收录，分发状态本轮未核。图片只核文件大小/扩展名并整张 base64 注入浏览器；真实 MIME、图像规格化和站点上传成功需目标测试。错误后可能文本已填/按钮已点，重试前须打开资料页核当前值，避免覆盖。建议仅测试账号观察，修复直接 apply 校验和 Gitee 确认后再广泛采用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-79](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/package.json#L1-L79)

包版本/兼容/依赖

<details>
<summary>查看原文（79行）</summary>

```text
{
  "name": "dsh-profile-stylist",
  "version": "0.2.2",
  "description": "Say what kind of profile you want; the agent writes it and puts it up. Generates nickname/bio/taglines with the host model, picks a local asset OR composes an avatar in-page with canvas (initials / gradient / tagline templates), then fills the profile page and uploads the picture - dry-run by default. GitHub and Gitee selectors are both verified on the live sites.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./constants": "./lib/constants.js",
    "./author": "./lib/author.js",
    "./hosts": "./lib/hosts.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "profile",
    "avatar",
    "bio",
    "nickname",
    "persona",
    "account",
    "github",
    "gitee",
    "branding",
    "个人资料",
    "头像",
    "简介"
  ],
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node test/smoke.mjs"
  },
  "publishConfig": {
    "access": "public"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/7gzgn/dsh-profile-stylist.git"
  },
  "homepage": "https://github.com/7gzgn/dsh-profile-stylist#readme",
  "bugs": {
    "url": "https://github.com/7gzgn/dsh-profile-stylist/issues"
  },
  "dsh": {
    "compatibility": {
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      }
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.4 <5.0.0",
    "@deepseek-ai/dsh-system-prompt": ">=0.2.0-rc.2 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.2 <0.3.0-0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-system-prompt": {
      "optional": true
    },
    "@deepseek-ai/dsh-tools": {
      "optional": true
    }
  }
}
```

</details>

**依据 2 · 作者声明**：[README.md:81-99](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/README.md#L81-L99)

作者安装与测试说明

<details>
<summary>查看原文（19行）</summary>

````text
## 安装

市场收录后在 DSH 里搜 `dsh-profile-stylist` 安装。手动安装：

```powershell
New-Item -ItemType Junction -Path "$env:USERPROFILE\.dsh\profiles\desktop\node_modules\dsh-profile-stylist" -Target "D:\dsh\projects\dsh-profile-stylist"
# profile 的 package.json：dependencies 加 "dsh-profile-stylist": "link:D:/dsh/projects/dsh-profile-stylist"
# 并把 "dsh-profile-stylist" 加进 dsh.profile.bundles（漏了不加载）→ 重启 DSH
```

**用之前先做两步**：① 装好内置浏览器插件；② 在浏览器窗口里登录目标站点。

## 测试

```powershell
node test/smoke.mjs      # 35 项：纯逻辑 / 站点档案 / 生成层（假 LLM）/ 写入层（假浏览器）/ 回执
```

测试**不联网、不碰真实浏览器、不读任何凭据**。在活代码树里跑会**直接退出**（先复制到 `D:\dsh\sandbox\`）。
````

</details>

**依据 3 · 源码核查**：[lib/author.js:222-242](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/author.js#L222-L242)

图片大小/扩展名读取

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 把一张本地图片读成 base64（供页面侧装配成 File）。
 * 只读、只在本机内存里过一道；调用方负责体积上限。
 * @param {string} path
 * @returns {Promise<{base64:string,mime:string,bytes:number,file:string}>}
 */
export async function readImageBase64(path) {
  const info = await stat(path);
  if (!info.isFile()) throw new Error('不是文件：' + path);
  if (info.size > AVATAR_SPEC.maxSourceBytes) {
    throw new Error(`图片太大（${info.size} 字节 > ${AVATAR_SPEC.maxSourceBytes}）—— 请先自己缩一下再放进素材库`);
  }
  const ext = extname(path).toLowerCase();
  if (!IMAGE_EXT.has(ext)) throw new Error('不支持的图片格式：' + ext);
  const buf = await readFile(path);
  const mime = ext === '.png' ? 'image/png'
    : ext === '.webp' ? 'image/webp'
      : ext === '.gif' ? 'image/gif'
        : 'image/jpeg';
  return { base64: buf.toString('base64'), mime, bytes: buf.length, file: basename(path) };
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:461-530](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L461-L530)

浏览器依赖与错误回报

<details>
<summary>查看原文（70行）</summary>

```text
        try {
          const sessionKey = typeof args?.session === 'string' && args.session !== '' ? args.session : PLUGIN_NAME;
          const session = await browser.open(sessionKey);

          // 头像：要么读成 data URL（页面侧靠它装配成 File），要么**当场画一张**。
          let avatarDataUrl = null;
          let avatarName = null;
          if (composeRequest !== null) {
            await browser.execute(session, {
              script: `window.__dshComposeReq = ${JSON.stringify(composeRequest)}; true`,
              timeoutMs: 10000,
            });
            const drawn = await browser.execute(session, { script: buildComposeScript(), timeoutMs: 20000 });
            let payload = null;
            try {
              payload = typeof drawn?.value === 'string' ? JSON.parse(drawn.value) : drawn?.value ?? null;
            } catch {
              payload = null;
            }
            if (payload?.ok !== true || typeof payload.dataUrl !== 'string') {
              throw new Error(`合成头像失败：${String(payload?.error ?? '页面没有返回图片')}`);
            }
            const decoded = decodePngDataUrl(payload.dataUrl);
            if (decoded.ok !== true) throw new Error(`合成头像失败：${decoded.error}`);
            avatarDataUrl = payload.dataUrl;
            avatarName = `composed-${composeRequest.template}.png`;
            avatar = { ...avatar, bytes: decoded.bytes, label: `${avatar.label}（${Math.round(decoded.bytes / 1024)}KB）` };
          } else if (avatar !== null) {
            const source = avatar.kind === 'file' ? avatar.path : join(assetDir, avatar.file);
            const image = await readImageBase64(source);
            avatarDataUrl = `data:${image.mime};base64,${image.base64}`;
            avatarName = image.file;
            avatar = { ...avatar, bytes: image.bytes, label: `${avatar.label}（${Math.round(image.bytes / 1024)}KB）` };
          }
          if (avatar !== null) {
            plan.avatar = avatar;
            plan.summary = planApply({ host: plan.host, fields: plan.check.supported, avatar }).summary;
          }

          await browser.openUrl(session, { url: plan.profile.profileUrl });

          const script = buildWriterScript();
          const request = {
            host: {
              fields: plan.profile.fields,
              form: plan.profile.form,
              avatar: plan.profile.avatar,
            },
            fields: plan.check.supported,
            avatarDataUrl,
            avatarName,
          };
          const executed = await browser.execute(session, {
            script: `window.__dshStylistReq = ${JSON.stringify(request)}; true`,
            timeoutMs: 20000,
          });
          if (executed && executed.ok === false) throw new Error('页面注入失败：' + String(executed.exception ?? ''));

          const written = await browser.execute(session, { script, timeoutMs: 90000 });
          if (written && written.ok === false) throw new Error('写入脚本失败：' + String(written.exception ?? ''));
          let result = null;
          try {
            result = typeof written?.value === 'string' ? JSON.parse(written.value) : written?.value ?? null;
          } catch {
            result = { ok: false, error: '页面没有回报可解析的结果' };
          }
          if (result && result.ok === false) throw new Error('页面侧报错：' + String(result.error ?? 'unknown'));
          return { ok: true, mode: 'apply', host: plan.host, summary: plan.summary, result };
        } catch (error) {
          return { ok: false, mode: 'apply', host: plan.host, summary: plan.summary, error: error instanceof Error ? error.message : String(error) };
```

</details>

#### 缺口

- 当前市场安装、真实图像处理与恢复耗时未测
  **影响**：不能给零风险自动写站结论
  **进一步探讨**：目标站点测试、回读、修复后再复评

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何形成真正可审查的资料写入流程？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证方向是对 author 与直接 apply 统一调用字段长度和 URL 校验，超长提供明确截断差异；把 dry-run 结果与用户确认绑定为一次性摘要/版本，写入后重新读取页面值而非只记录按钮点击。Gitee 头像按 profile.avatar.confirm 的选择器而不是只按 button 文本，缺控件时停止或明确部分成功。验收包含两站单字段/头像/未知站点、URL 非法、超长、会话错误和提交后回读。当前建议 observe。

#### 证据与依据

**依据 1 · 源码核查**：[lib/hosts.js:130-153](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/hosts.js#L130-L153)

现有字段检查只警告

<details>
<summary>查看原文（24行）</summary>

```text
 */
export function checkAgainstHost(host, fields) {
  const profile = hostProfile(host);
  const supported = {};
  const unsupported = [];
  const warnings = [];
  if (profile === null) {
    return { ok: false, supported, unsupported: Object.keys(fields ?? {}), warnings: ['不认识的站点：' + host] };
  }
  for (const [key, value] of Object.entries(fields ?? {})) {
    const selector = profile.fields[key];
    if (typeof selector !== 'string' || selector === '') {
      unsupported.push(key);
      continue;
    }
    const limit = profile.limits?.[key];
    if (Number.isFinite(limit) && String(value).length > limit) {
      warnings.push(`${key} 超过该站上限 ${limit} 字符，会被截断`);
    }
    supported[key] = String(value);
  }
  if (profile.verified !== true) warnings.push(`${profile.name} 的字段选择器尚未真机验证，可能要按现场调整`);
  return { ok: unsupported.length === 0, supported, unsupported, warnings };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:139-166](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L139-L166)

头像与保存回报有限

<details>
<summary>查看原文（28行）</summary>

```text
          var buttons = [].slice.call(document.querySelectorAll('button, input[type=submit]'));
          var hit = null;
          for (var b = 0; b < buttons.length; b++) {
            var t = (buttons[b].textContent || buttons[b].value || '').trim();
            for (var c = 0; c < texts.length; c++) { if (t.indexOf(texts[c]) >= 0) { hit = buttons[b]; break; } }
            if (hit) break;
          }
          if (!hit && box && /has-uploaded|is-uploaded/.test(box.className || '')) hit = 'state';
          if (hit) {
            if (hit !== 'state') { try { hit.click(); } catch (e) {} }
            ready = true;
            break;
          }
        }
        out.avatar = { ok: ready, bytes: file.size, confirmed: ready };
        if (!ready) out.warnings.push('头像传上去了但没等到确认按钮（可能站点改版或网络慢）');
      }
    }

    // ---------- 3) 文本保存 ----------
    if (req.save !== false && out.filled.length > 0) {
      var savers = (host.form && host.form.save) || [];
      for (var s = 0; s < savers.length; s++) {
        var btn = null;
        try { btn = document.querySelector(savers[s]); } catch (e) { btn = null; }
        if (btn) { try { btn.click(); out.saved = true; break; } catch (e) {} }
      }
      if (!out.saved) out.warnings.push('没找到保存按钮 —— 字段已填好，请手动点保存');
```

</details>

**依据 3 · 源码核查**：[lib/index.js:439-450](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L439-L450)

当前确认只是布尔分支

<details>
<summary>查看原文（12行）</summary>

```text
        const plan = planApply({ host: args?.host ?? 'github', fields, avatar });
        const dryRun = args?.confirm !== true;

        if (dryRun) {
          return {
            ok: true,
            mode: 'dry-run',
            host: plan.host,
            summary: plan.summary,
            hint: '这是 dry-run —— 什么都没动。确认无误后加 `confirm: true` 再调一次。',
          };
        }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:519-530](https://github.com/7gzgn/dsh-profile-stylist/blob/05dfa3ede30b5de6c3cc1c7adc328fe9d7e7fbc4/lib/index.js#L519-L530)

结果无远端回读

<details>
<summary>查看原文（12行）</summary>

```text
          const written = await browser.execute(session, { script, timeoutMs: 90000 });
          if (written && written.ok === false) throw new Error('写入脚本失败：' + String(written.exception ?? ''));
          let result = null;
          try {
            result = typeof written?.value === 'string' ? JSON.parse(written.value) : written?.value ?? null;
          } catch {
            result = { ok: false, error: '页面没有回报可解析的结果' };
          }
          if (result && result.ok === false) throw new Error('页面侧报错：' + String(result.error ?? 'unknown'));
          return { ok: true, mode: 'apply', host: plan.host, summary: plan.summary, result };
        } catch (error) {
          return { ok: false, mode: 'apply', host: plan.host, summary: plan.summary, error: error instanceof Error ? error.message : String(error) };
```

</details>

#### 缺口

- 改进尚未实现/验证
  **影响**：不能计入当前功能
  **进一步探讨**：隔离测试账号实现摘要确认与回读矩阵

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
