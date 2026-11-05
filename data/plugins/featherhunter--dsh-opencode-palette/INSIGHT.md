# DSH OpenCode Palette

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c965752](https://github.com/FeatherHunter/dsh-opencode-palette/tree/c9657527977b68755e8470c0662a36bbf2c9ef19)

<!-- BEGIN META -->
[![GitHub ★ 98](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=98&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-opencode-palette) [![npm 30d 8,915](https://img.shields.io/static/v1?label=npm+30d&message=8%2C915&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-palette) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-opencode-palette)
<!-- END META -->

> **功能**：把预置和自定义语义配色映射到 DSH，并持久保存主题。

> **亮点**：[Q01](#research-q01) 想在 DSH 换配色与字体的用户可选择预置或自定义主题。引擎把语义颜色映射到 DSH token，客户端清理旧 override 后重新生成。自定义主题经宿主目录保存，浏览器缓存作离线兜底。相比临时 CSS 调整，它复用语义主题与持久配置。

> **主要限制**：[Q02](#research-q02) 宿主用临时文件后 rename 保存单主题，避免部分 JSON 可见；多窗口最后写入冲突仍需测试。POST 路由校验消息形状并分发，实际认证依赖 connection 外层。客户端生成失败回到默认主题，但不证明全部页面都可读。

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
  - [Q01 · 调色板怎样改变宿主界面？](#detail-section-11)
  - [Q02 · 主题保存与接口权限有什么边界？](#detail-section-12)
  - [Q03 · 如何试用与停用？](#detail-section-13)
  - [Q04 · 怎样减少升级后静默缺色？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要自定义 DSH 视觉与字体的用户。

手工 CSS 或默认主题。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题 | 配色与字体 | 需宿主接口 |
| 编辑 | 保存自定义 | 权限依赖宿主 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH theme | 必需 | 应用 token | 恢复默认 |
| 宿主存储 | 自定义需要 | 主题持久化 | 仅预置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份主题 | 测试 profile |
| 验证 | 深浅模式和代码 | 核对可读性 |
| 退出 | 恢复默认禁用 | 保留主题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 资源未知 | 选主题 | 未测 |
| 持续 | 渲染成本未知 | 升级核对 | 按宿主 |
| 退出 | 恢复时间未知 | 检查目录 | 读回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主题 | 语义映射及保存 | 真实可读性 |
| 回退 | 生成失败默认 | 页面覆盖 |

> **思考**：[Q02](#research-q02) 宿主用临时文件后 rename 保存单主题，避免部分 JSON 可见；多窗口最后写入冲突仍需测试。POST 路由校验消息形状并分发，实际认证依赖 connection 外层。客户端生成失败回到默认主题，但不证明全部页面都可读。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 想在 DSH 换配色与字体的用户可选择预置或自定义主题。引擎把语义颜色映射到 DSH token，客户端清理旧 override 后重新生成。自定义主题经宿主目录保存，浏览器缓存作离线兜底。相比临时 CSS 调整，它复用语义主题与持久配置。

[Q02](#research-q02) 宿主用临时文件后 rename 保存单主题，避免部分 JSON 可见；多窗口最后写入冲突仍需测试。POST 路由校验消息形状并分发，实际认证依赖 connection 外层。客户端生成失败回到默认主题，但不证明全部页面都可读。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 宿主用临时文件后 rename 保存单主题，避免部分 JSON 可见；多窗口最后写入冲突仍需测试。POST 路由校验消息形状并分发，实际认证依赖 connection 外层。客户端生成失败回到默认主题，但不证明全部页面都可读。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试 profile 备份 custom-themes，用一款预置和一个合成自定义主题核对输入、代码、弹层与浅深模式。运行费用主要是浏览器渲染与维护配色，未测。退出时恢复默认并禁用插件，保留主题目录按需清理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码及作者说明，未执行目标。

- 已检查：作者 README、包清单、源码路径 README.md、runtime/client.ts、runtime/custom-store.ts、runtime/host.ts、src/engine/map-dsh.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定身份及其直接依赖的代表实现。
- 下一步：核对消息认证、双窗口和 DOM 兼容。

**分析版本**

- **仓库**：[FeatherHunter/dsh-opencode-palette](https://github.com/FeatherHunter/dsh-opencode-palette)
- **版本号**：2.1.13（[固定提交 c965752](https://github.com/FeatherHunter/dsh-opencode-palette/tree/c9657527977b68755e8470c0662a36bbf2c9ef19)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对现有 token 映射增加只读兼容检查，列出缺失变量与回退区域。用升级前后 DOM 对照视觉错误和修复时间，若误报警多且收益不足则撤回。

核对消息认证、双窗口和 DOM 兼容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 115 | 23397 | — | — | 448042 |
| .ts | source | 50 | 13940 | 11263 | 1981 | — |
| .mjs | source | 4 | 872 | 780 | 40 | — |
| .js | source | 11 | 177 | 161 | 7 | — |
| .ts | test | 19 | 7390 | 6069 | 860 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/FeatherHunter/dsh-opencode-palette/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话地图如何组织和传递上下文？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 调色板怎样改变宿主界面？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

想在 DSH 换配色与字体的用户可选择预置或自定义主题。引擎把语义颜色映射到 DSH token，客户端清理旧 override 后重新生成。自定义主题经宿主目录保存，浏览器缓存作离线兜底。相比临时 CSS 调整，它复用语义主题与持久配置。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/map-dsh.ts:1-24](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/src/engine/map-dsh.ts#L1-L24)

语义到宿主映射

<details>
<summary>查看原文（24行）</summary>

```text
// map-dsh.ts — ★ 单一真相源：opencode 主题语义颜色 → DSH 界面 CSS 变量/元素规则
// DSH 升级改 CSS 变量名时，只需要改这一个文件。
// 值 = opencode 颜色名；generate.ts 负责取值与派生（提亮/透明/对比色）。

import { shade, withAlpha, contrastText, mixHex, readableTextOn, contrastRatio, blendOntoBase, type ResolvedColorMap } from './resolve.ts'

// 派生 token 的 helpers 来自 resolve.ts（shade/withAlpha/contrastText）

// 派生 token 的取槽助手：解析失败的颜色在历史行为里会流入 helper 被宽容处理（不抛错、由
// buildTokens 的 try/catch 兜底或原样输出），这里保持同一运行时语义，仅把类型收窄成 string。
const slot = (c: ResolvedColorMap, key: string): string => c[key] as string

// ── 1. token 层：theme.overrideTokens 注册的 --dsw-alias-* 变量 ──
// 格式: [DSH 变量, 来源颜色]（来源缺失/透明/解析失败 → 该 token 自动跳过，不污染）
// 高度梯子（第一性原理：opencode background/backgroundPanel/backgroundElement 本就是
// 深色 step1<step2<step3 台阶，与 DSH base<panel<element 浮起方向一致）：
//   step1 页面底 ← DSH 950 级（base/sidebar/unselected）；
//   step2 浮起面（中层）← DSH 850 级（tag/placeholder/bubble/multi-select 芯片）；
//   step3 浮层 ← DSH 750~800 级（citation/banner/toast/tooltip/tip/selector）。
export const TOKEN_MAP: ReadonlyArray<readonly [string, string]> = [
  // 页面底：step1（DSH 深色 900~950 级：base/sidebar/unselected）
  ['--dsw-alias-bg-base', 'background'],
  ['--dsw-alias-bg-layer-1', 'background'],
  ['--dsw-alias-bg-layer-2', 'background'],
```

</details>

**依据 2 · 源码核查**：[runtime/client.ts:736-760](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/client.ts#L736-L760)

重生成与 override

<details>
<summary>查看原文（25行）</summary>

```text
    function applyStyle() {
      if (!theme) return
      // 1) 先清理旧注入（幂等）
      if (tokenDispose) { try { tokenDispose() } catch (e) { /* 忽略 */ } tokenDispose = null }
      // 2) 完整重生成
      let render
      try {
        const iid = ipIdOf(state.theme)
        const found = iid ? findIpPreset(iid) : findCustom(customIdOf(state.theme))
        if (iid || isCustomKey(state.theme)) {
          // IP 预置与自定义主题共用渲染管线（37 色 + 外观）；拿不到就回退默认主题，绝不留旧注入
          render = found
            ? renderCustomTheme(found, { mode: state.mode, size: state.size, fontKey: state.fontKey })
            : renderTheme(DEFAULT_STATE.theme, { mode: 'mono', size: 13, fontKey: 'JetBrains Mono' })
        } else {
          render = renderTheme(safeThemeName(state.theme), {
            mode: state.mode, size: state.size, fontKey: state.fontKey,
          })
        }
      } catch (e) {
        console.error('[dsh-opencode-palette] 渲染失败，回退默认主题:', e)
        render = renderTheme(DEFAULT_STATE.theme, { mode: 'mono', size: 13, fontKey: 'JetBrains Mono' })
      }
      // 3) token 层（issue 45：自持画布两半同值=深色观感；委托画布按外观取作者值）
      tokenDispose = theme.overrideTokens('opencode-palette', render.tokens)
```

</details>

**依据 3 · 源码核查**：[runtime/custom-store.ts:1-24](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/custom-store.ts#L1-L24)

宿主与缓存分工

<details>
<summary>查看原文（24行）</summary>

```text
// custom-store.ts — 自定义主题本地缓存与宿主对账（#86）
// 零导入，打包前后同一语义。localStorage 只做离线/测试兜底，真值恒在宿主。

// 命名空间键（与 STORAGE_KEY 同前缀，避免与宿主其他数据碰撞；
// 票面「缓存一份 customThemes」指缓存内容，键名按仓内习惯加前缀）。
export const CUSTOM_CACHE_KEY = 'dsh.opencode-palette.customThemes'

// localStorage 的最小面：只用到读写两法；测试可传同形假件，无存储时传 null。
interface CustomStorage {
  getItem?(key: string): string | null
  setItem?(key: string, value: string): unknown
}

// 缓存里主题的最小公共形状：只约束 name/id，其余字段原样透传（零导入，不引用引擎/宿主类型）。
interface CachedTheme {
  readonly id?: unknown
  readonly name?: unknown
}

// 本地缓存形状（themes 与宿主列表同构，内容不做校验，坏数据在读取侧兜底）。
interface CustomCache {
  themes: CachedTheme[]
  dirPath: string
}
```

</details>

**依据 4 · 作者声明**：[README.md:123-146](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/README.md#L123-L146)

作者说明编辑

<details>
<summary>查看原文（24行）</summary>

```text
<summary>新增自定义主题</summary>

37 个颜色逐个调，右边预览实时联动，存成专属胶囊。

https://github.com/user-attachments/assets/349dba7f-4cdb-4281-b71c-c39c6f9dfccd

1. 点新增，37 个颜色逐个调，右边预览实时联动。
2. 点预览里的元素，左边对应那行会滚到中间并打开取色器。
3. 存好后胶囊落在 `<DSH_HOME>/opencode-palette/custom-themes/` 里。

</details>

---

<details>
<summary>编辑自定义主题</summary>

回来改存好的胶囊，改完界面即时换上新配色。

https://github.com/user-attachments/assets/4ff48986-142f-404b-bb1b-70d948d95ba8

1. 打开存好的自定义主题，进编辑。
2. 改要动的颜色，预览里即时看效果。
3. 保存，界面即时换上新的配色。
```

</details>

#### 缺口

- 未验证真实 DOM 与宿主升级
  **影响**：视觉覆盖和可读性未知
  **进一步探讨**：用长代码与表单逐主题核对

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题保存与接口权限有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主用临时文件后 rename 保存单主题，避免部分 JSON 可见；多窗口最后写入冲突仍需测试。POST 路由校验消息形状并分发，实际认证依赖 connection 外层。客户端生成失败回到默认主题，但不证明全部页面都可读。

#### 证据与依据

**依据 1 · 源码核查**：[runtime/host.ts:321-345](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/host.ts#L321-L345)

原子文件替换

<details>
<summary>查看原文（25行）</summary>

```text
/** 原子写：tmp 落盘 + rename（半成品只可能是 .tmp- 前缀，扫描器只认 .json）。 */
async function saveCustomTheme(homeDir: string, theme: unknown) {
  if (theme === null || typeof theme !== 'object' || Array.isArray(theme)) {
    return { ok: false, error: { code: 'invalid-argument', message: 'theme must be an object' } }
  }
  // 类型：上面已验过是非数组对象，读字段前按可读面收窄（id 仍逐个校验）。
  const src = theme as RawCustomTheme
  if (typeof src.id !== 'string' || !CUSTOM_ID_PATTERN.test(src.id)) {
    return { ok: false, error: { code: 'invalid-id', message: 'invalid theme id: ' + String(src.id).slice(0, 80) } }
  }
  const dirPath = await ensureCustomThemesDir(homeDir)
  // 类型：id 已按 CUSTOM_ID_PATTERN 全匹配验过，normalizeCustomTheme 只在 id 非法时回 null，这里不可能为 null。
  const normalized = normalizeCustomTheme(src, null, new Date().toISOString()) as CustomTheme
  normalized.updatedAt = new Date().toISOString()
  const target = join(dirPath, normalized.id + '.json')
  const tmp = join(dirPath, normalized.id + '.tmp-' + process.pid + '-' + Date.now())
  try {
    await writeFile(tmp, JSON.stringify(normalized, null, 2) + '\n', 'utf8')
    await rename(tmp, target)
  } catch (e) {
    try { await unlink(tmp) } catch (ignored) { /* 半成品尽力清 */ }
    throw e
  }
  const listed = await readCustomThemes(homeDir)
  return { ok: true, dirPath: listed.dirPath, theme: normalized, themes: listed.themes }
```

</details>

**依据 2 · 源码核查**：[runtime/host.ts:485-510](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/host.ts#L485-L510)

宿主 POST 分发

<details>
<summary>查看原文（26行）</summary>

```text
  const routeFetch = async function (request: Request): Promise<Response> {
    if (!request || request.method !== 'POST') return new Response('method not allowed', { status: 405 })
    let body: RpcRequestBody | null = null
    try { body = (await request.json()) as RpcRequestBody | null } catch (e) { return new Response('body is not JSON', { status: 400 }) }
    // 类型：body 已在这一句的 && 右侧窄化为非空；后两次读取在外层条件里窄不回来，故用 !（擦除后运行时不变）。
    const rpcId = typeof (body && body.rpcId) === 'string' && RPC_ID_PATTERN.test(body!.rpcId) ? body!.rpcId : 'invalid-request'
    const reply = function (result: unknown) { return Response.json({ type: 'server-response', rpcId: rpcId, result: result }) }
    const reject = function (why: string) { return reply({ ok: false, error: { code: 'gateway/bad-request', message: why, details: {} } }) }
    if (!body || body.type !== 'client-request') return reject('invalid client-request message')
    const call = body.payload
    if (call === null || typeof call !== 'object') return reject('missing call payload')
    const phoneName = call.method
    if (typeof phoneName !== 'string' || !ENDPOINT_PATTERN.test(phoneName)) return reject('invalid phone name')
    const pathname = String((request.url && request.url.split('?')[0]) || '')
    if (!pathname.endsWith(ROUTE_PATH)) return reject('request path is not on route ' + ROUTE_PATH)
    return reply(await dispatch(phoneName, call.payload))
  }

  try {
    const connection = ctx.get('connection')
    const fetchRegistry = connection === undefined || connection === null ? undefined : connection.fetch
    if (fetchRegistry === undefined || typeof fetchRegistry.register !== 'function') {
      fail('register', 'connection.fetch.register-missing')
      return
    }
    fetchRegistry.register({ path: ROUTE_PATH, methods: ['POST'], requestBody: 'buffered', fetch: routeFetch })
```

</details>

**依据 3 · 源码核查**：[runtime/client.ts:736-760](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/client.ts#L736-L760)

回退与 token

<details>
<summary>查看原文（25行）</summary>

```text
    function applyStyle() {
      if (!theme) return
      // 1) 先清理旧注入（幂等）
      if (tokenDispose) { try { tokenDispose() } catch (e) { /* 忽略 */ } tokenDispose = null }
      // 2) 完整重生成
      let render
      try {
        const iid = ipIdOf(state.theme)
        const found = iid ? findIpPreset(iid) : findCustom(customIdOf(state.theme))
        if (iid || isCustomKey(state.theme)) {
          // IP 预置与自定义主题共用渲染管线（37 色 + 外观）；拿不到就回退默认主题，绝不留旧注入
          render = found
            ? renderCustomTheme(found, { mode: state.mode, size: state.size, fontKey: state.fontKey })
            : renderTheme(DEFAULT_STATE.theme, { mode: 'mono', size: 13, fontKey: 'JetBrains Mono' })
        } else {
          render = renderTheme(safeThemeName(state.theme), {
            mode: state.mode, size: state.size, fontKey: state.fontKey,
          })
        }
      } catch (e) {
        console.error('[dsh-opencode-palette] 渲染失败，回退默认主题:', e)
        render = renderTheme(DEFAULT_STATE.theme, { mode: 'mono', size: 13, fontKey: 'JetBrains Mono' })
      }
      // 3) token 层（issue 45：自持画布两半同值=深色观感；委托画布按外观取作者值）
      tokenDispose = theme.overrideTokens('opencode-palette', render.tokens)
```

</details>

#### 缺口

- 宿主身份和并发写入未知
  **影响**：不能保证主题编辑权限与冲突恢复
  **进一步探讨**：测试无身份请求、双窗口和坏主题

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用与停用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在测试 profile 备份 custom-themes，用一款预置和一个合成自定义主题核对输入、代码、弹层与浅深模式。运行费用主要是浏览器渲染与维护配色，未测。退出时恢复默认并禁用插件，保留主题目录按需清理。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-66](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/README.md#L55-L66)

安装

<details>
<summary>查看原文（12行）</summary>

````text

```bash
# ① 还没装 DSH CLI 先装（已装跳过）
npm install -g @deepseek-ai/dsh

# ② 把插件装进你的 profile
dsh plugin --profile web add dsh-opencode-palette

# ③ 装完重启 DSH（或刷新浏览器页面）
```

**① 装好插件。**
````

</details>

**依据 2 · 作者声明**：[README.md:123-146](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/README.md#L123-L146)

自定义持久化

<details>
<summary>查看原文（24行）</summary>

```text
<summary>新增自定义主题</summary>

37 个颜色逐个调，右边预览实时联动，存成专属胶囊。

https://github.com/user-attachments/assets/349dba7f-4cdb-4281-b71c-c39c6f9dfccd

1. 点新增，37 个颜色逐个调，右边预览实时联动。
2. 点预览里的元素，左边对应那行会滚到中间并打开取色器。
3. 存好后胶囊落在 `<DSH_HOME>/opencode-palette/custom-themes/` 里。

</details>

---

<details>
<summary>编辑自定义主题</summary>

回来改存好的胶囊，改完界面即时换上新配色。

https://github.com/user-attachments/assets/4ff48986-142f-404b-bb1b-70d948d95ba8

1. 打开存好的自定义主题，进编辑。
2. 改要动的颜色，预览里即时看效果。
3. 保存，界面即时换上新的配色。
```

</details>

**依据 3 · 源码核查**：[src/engine/map-dsh.ts:1-3](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/src/engine/map-dsh.ts#L1-L3)

宿主变量兼容

```text
// map-dsh.ts — ★ 单一真相源：opencode 主题语义颜色 → DSH 界面 CSS 变量/元素规则
// DSH 升级改 CSS 变量名时，只需要改这一个文件。
// 值 = opencode 颜色名；generate.ts 负责取值与派生（提亮/透明/对比色）。
```

#### 缺口

- 未运行或测资源
  **影响**：兼容和清理未知
  **进一步探讨**：对照默认界面截图及配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少升级后静默缺色？

**研究主题**：新假设与验证

#### 完整回答

对现有 token 映射增加只读兼容检查，列出缺失变量与回退区域。用升级前后 DOM 对照视觉错误和修复时间，若误报警多且收益不足则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/map-dsh.ts:1-24](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/src/engine/map-dsh.ts#L1-L24)

映射真相源

<details>
<summary>查看原文（24行）</summary>

```text
// map-dsh.ts — ★ 单一真相源：opencode 主题语义颜色 → DSH 界面 CSS 变量/元素规则
// DSH 升级改 CSS 变量名时，只需要改这一个文件。
// 值 = opencode 颜色名；generate.ts 负责取值与派生（提亮/透明/对比色）。

import { shade, withAlpha, contrastText, mixHex, readableTextOn, contrastRatio, blendOntoBase, type ResolvedColorMap } from './resolve.ts'

// 派生 token 的 helpers 来自 resolve.ts（shade/withAlpha/contrastText）

// 派生 token 的取槽助手：解析失败的颜色在历史行为里会流入 helper 被宽容处理（不抛错、由
// buildTokens 的 try/catch 兜底或原样输出），这里保持同一运行时语义，仅把类型收窄成 string。
const slot = (c: ResolvedColorMap, key: string): string => c[key] as string

// ── 1. token 层：theme.overrideTokens 注册的 --dsw-alias-* 变量 ──
// 格式: [DSH 变量, 来源颜色]（来源缺失/透明/解析失败 → 该 token 自动跳过，不污染）
// 高度梯子（第一性原理：opencode background/backgroundPanel/backgroundElement 本就是
// 深色 step1<step2<step3 台阶，与 DSH base<panel<element 浮起方向一致）：
//   step1 页面底 ← DSH 950 级（base/sidebar/unselected）；
//   step2 浮起面（中层）← DSH 850 级（tag/placeholder/bubble/multi-select 芯片）；
//   step3 浮层 ← DSH 750~800 级（citation/banner/toast/tooltip/tip/selector）。
export const TOKEN_MAP: ReadonlyArray<readonly [string, string]> = [
  // 页面底：step1（DSH 深色 900~950 级：base/sidebar/unselected）
  ['--dsw-alias-bg-base', 'background'],
  ['--dsw-alias-bg-layer-1', 'background'],
  ['--dsw-alias-bg-layer-2', 'background'],
```

</details>

**依据 2 · 源码核查**：[runtime/client.ts:755-760](https://github.com/FeatherHunter/dsh-opencode-palette/blob/c9657527977b68755e8470c0662a36bbf2c9ef19/runtime/client.ts#L755-L760)

回退生成

```text
      } catch (e) {
        console.error('[dsh-opencode-palette] 渲染失败，回退默认主题:', e)
        render = renderTheme(DEFAULT_STATE.theme, { mode: 'mono', size: 13, fontKey: 'JetBrains Mono' })
      }
      // 3) token 层（issue 45：自持画布两半同值=深色观感；委托画布按外观取作者值）
      tokenDispose = theme.overrideTokens('opencode-palette', render.tokens)
```

#### 缺口

- 宿主变量稳定性未知
  **影响**：诊断可能需版本基线
  **进一步探讨**：先抽样界面与 token

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
