# 小克桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[8e2a207](https://github.com/aklnaaw/dsh-xiaoke-widget/tree/8e2a207bfc9ae3983168dcc847e54734771bce67)

<!-- BEGIN META -->
[![GitHub ★ 55](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=55&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aklnaaw/dsh-xiaoke-widget)
<!-- END META -->

> **功能**：在 DSH 界面显示余额、今日消费与每轮消耗，可切换角色和泡泡，继承原版鲸鱼的记账逻辑。

> **亮点**：[Q01](#research-q01) 新增角色、动态档位和余额预警形态，[Q02](#research-q02) 的核心采集与账本主要承接上游。

> **主要限制**：[Q03](#research-q03) 余额差、校正及本地估算对应不同口径，路由访问还依赖宿主和部署。不能根据一个余额数字证明完整账单。

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
  - [Q01 · 用户何时需要挂件，二创主要增加什么？](#detail-section-11)
  - [Q02 · 从 DSH 注入到余额和账本，实际接线在哪里？](#detail-section-12)
  - [Q03 · 价格、跨账本和接口守卫在哪些边界内成立？](#detail-section-13)
  - [Q04 · 依赖、资源和退出代价如何盘点？](#detail-section-14)
  - [Q05 · 数据来源与更新时间更显眼能否减少误读？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 用户要从当前会话顺手看余额或消耗，对照供应商控制台与原版鲸鱼挂件。

[Q01](#research-q01) 原版鲸鱼已有余额、定价与记账，比较两者的显示及人工核对便利。供应商账单单列。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 余额与消费泡泡 | 查看余额与本地估算 | 分辨来源与新鲜度 |
| 账本 | 记录观测及人工校正 | 需对照账户币种和账单 |
| 动态角色 | 展示余额预警 | 资源开销因设备而异 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web | 是 | 注入与宿主服务 | 先核对 profile 与重启 |
| 宿主凭据或账号、供应商网络 | 取数需要 | 查询余额 | 使用仿真或保留未知 |
| 512 高清资源 | 可选 | 高物理像素动态显示 | 使用内置档 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对 Host、凭据去向与资产许可 | 确认正确 profile |
| 查看 | 挂件请求余额和事件状态 | 核对来源、新鲜度与币种 |
| 退出 | 用户撤下高清或停用插件 | 盘点本地配置和账本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件与可选资产空间，实际费用未知 | 安装重启、核对凭据来源 | README 列静态和高清路径 |
| 持续使用 | 动画、网络和磁盘，实际占用未知 | 维护账本与核对来源 | 作者仅单机 Edge 数据 |
| 失败恢复 | 重取余额和资产资源未知 | 查缓存、旧值与校正 | 局部安装及退回内置档 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 常驻余额 | 实际取数、退让及来源状态 | 真实余额完整性与读数效率 |
| 每轮成本 | 按本地费率汇聚实际事件 | 与供应商账单的差值 |
| 动态预警 | 运行时选择档位与低余额形态 | 设备消耗与提醒价值 |

> **思考**：[Q03](#research-q03) 余额差、校正及本地估算对应不同口径，路由访问还依赖宿主和部署。不能根据一个余额数字证明完整账单。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 新增角色、动态档位和余额预警形态，[Q02](#research-q02) 的核心采集与账本主要承接上游。

[Q02](#research-q02) 区分注入、服务等待与取数。[Q03](#research-q03) 将账户币种、校正版本和代理访问视为单独边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 余额差、校正及本地估算对应不同口径，路由访问还依赖宿主和部署。不能根据一个余额数字证明完整账单。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用内置档和隔离配置核对读数，区分账本观察与估算，按需检查高清或退回静态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主注入、余额退让、记账、预警和可选高清。未复现真实余额、计费、安装和用户效果。

- 已检查：作者 README、包清单、源码路径 README.md、PROVENANCE.md、tools/build-xiaoke.mjs、lib/xiaoke-widget.js、package.json、cordis.patch.yml、lib/xiaoke-index.js、lib/accounting.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：查固定根组件的实际生成 Host、widget、记账与代表资源路径。未运行插件、服务、测试、浏览器或账号，也未核对当前市场费率。
- 下一步：[Q05](#research-q05) 使用仿真账户与同一设备比较来源识别、误读率和读取时长，记录静态和动态资源。

**分析版本**

- **仓库**：[aklnaaw/dsh-xiaoke-widget](https://github.com/aklnaaw/dsh-xiaoke-widget)
- **版本号**：0.4.2（[固定提交 8e2a207](https://github.com/aklnaaw/dsh-xiaoke-widget/tree/8e2a207bfc9ae3983168dcc847e54734771bce67)）
- **版本日期**：2026-10-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将来源、时点和过期状态就近呈现可能减少误读。按仿真账户及错误响应和现有界面对照。

[Q05](#research-q05) 使用仿真账户与同一设备比较来源识别、误读率和读取时长，记录静态和动态资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 1832 | 1349 | 411 | — |
| .js | source | 4 | 54767 | 52300 | 2457 | — |
| .md | source | 5 | 829 | — | — | 16690 |
| .cjs | source | 1 | 54 | 54 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/aklnaaw/dsh-xiaoke-widget/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：小克桌宠能展示哪些余额与消耗，它对原版的变化、接入边界和核对代价是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户何时需要挂件，二创主要增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH Web 长会话中需要顺手看余额或每轮消耗的用户，可查看常驻挂件或点泡泡，原办法是另开供应商控制台或看原版鲸鱼。作者明确余额、峰谷和记账继承原版，二创增加暖橙角色、语料、预警哭脸和动态分档。构建从保留的上游文件写出 Host 与 widget 两个真实入口，新增角色的许可由来源文档单列。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-20](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/README.md#L3-L20)

作者界定二创与可看内容。

<details>
<summary>查看原文（18行）</summary>

```text
DSH Web 界面右下角的一只桌宠。点她会冒出各种 Claude 味的碎碎念。

这是二创：原项目是 [MeteorNOX/DeepSeek-Balance-Whale-Widget](https://github.com/MeteorNOX/DeepSeek-Balance-Whale-Widget) 的小鲸鱼挂件，
我把角色和皮肤换成了 **Claude 拟人「小克」**，功能照旧。

> 「小克」是 SillyTavern 中文圈对 Claude 的习惯叫法。

![小克](assets/xiaoke1.png)

## 能看什么

余额、今日已用、峰谷定价、每轮消耗。泡泡内容全部可以自己排——显示什么、多大字、什么颜色、点一下冒出哪句，都在设置里改。

## 和原版的区别

- 小鲸鱼 → **小克**（橘发少女，手里拿着星芒手账本）
- DeepSeek 靛蓝 → **Claude 暖橙**（`#d97757`）
- 50 条鲸鱼味台词 → **63 条 Claude 味台词**
```

</details>

**依据 2 · 作者声明**：[README.md:32-43](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/README.md#L32-L43)

作者说明预警与动画。

<details>
<summary>查看原文（12行）</summary>

```text
## 动态小克

菜单 → 角色里多了两个内置角色：

- **小克（动态）**：会呼吸、会眨眼的小克
- **小克（含余额预警）**：平时一样；「余额预警」一触发（余额低于预警线）就换成大泪珠哭脸，余额回到预警线以上自动换回来

直接沿用「余额预警」的开关和阈值，不用另外设置。想马上看看哭脸：把预警线临时调得比当前余额高就行。
动图按挂件在屏幕上的实际大小自动挑档。插件自带 256 / 384 两档；想把挂件调得很大又不想糊，可以在「资源管理 → 动态小克 · 高清档」里
下载 512 高清包（约 18 MB，在 [AirsEDA 的 Releases](https://github.com/AirsEDA/dsh-xiaoke-widget/releases)，[本仓库的 Releases](https://github.com/aklnaaw/dsh-xiaoke-widget/releases) 里也有一份），再点「安装…」选中下载的 zip，装好占硬盘约 18 MB。

浏览器会把动图的每一帧解码后留在内存和显存里，各档比静态小克多占（作者电脑上的 Edge 实测，因电脑而异）：
```

</details>

**依据 3 · 作者声明**：[PROVENANCE.md:7-17](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/PROVENANCE.md#L7-L17)

作者声明代码、角色素材与上游资产的许可范围。

<details>
<summary>查看原文（11行）</summary>

```text
## 一、许可范围

| 范围 | 许可 |
|---|---|
| `lib/xiaoke-index.js`、`lib/xiaoke-widget.js` | **MIT**（生成产物，见 [`LICENSE`](LICENSE)；原始版权归 MeteorNOX） |
| `lib/accounting.mjs`、`skin/`、`tools/`、文档 | **MIT** |
| `assets/xiaoke1.png`（本项目新增的角色图） | **CC BY-NC-SA 4.0**（可自由使用，**不可商用**，需署名并以相同协议共享）—— 详见 [`LICENSE-ARTWORK`](LICENSE-ARTWORK) |
| `icon.png`（插件列表图标） | 由 `assets/xiaoke1.png` 裁切合成，**同样 CC BY-NC-SA 4.0**（见 [`LICENSE-ARTWORK`](LICENSE-ARTWORK)）。上游 v0.4.1 起 `package.json` 需要它，随上游那份是鲸鱼娘，本项目已换成小克 |
| `assets/xiaoke-anim-*.webp`、`assets/xiaoke-anim-cry-*.webp`（动态小克），以及 Releases 里的高清包 `xiaoke-anim-hd.zip` | 基于 `xiaoke1.png` 制作的衍生素材（经本项目作者同意），**同样 CC BY-NC-SA 4.0**（见 [`LICENSE-ARTWORK`](LICENSE-ARTWORK)） |
| `assets/` 其余文件（音效 / 泡泡图） | 沿用上游说明，见 [`upstream/PROVENANCE.upstream.md`](upstream/PROVENANCE.upstream.md) |
| `assets/approve-default.wav`、`ask-default.wav`、`cost-default.wav` | 上游 v0.4.0「音效四通道化」新增的默认音，随上游继承 |
```

</details>

**依据 4 · 源码核查**：[tools/build-xiaoke.mjs:30-37](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/tools/build-xiaoke.mjs#L30-L37)

从上游路径生成实际两个 JS 入口。

```text
import { HOST_PATCHES, WIDGET_PATCHES } from '../skin/xiaoke-features.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC_HOST = path.join(ROOT, 'upstream', 'lib', 'index.js')
const SRC_WIDGET = path.join(ROOT, 'upstream', 'assets', 'whale-widget.js')

const OUT_HOST = path.join(ROOT, 'lib', 'xiaoke-index.js')
const OUT_WIDGET = path.join(ROOT, 'lib', 'xiaoke-widget.js')
```

**依据 5 · 源码核查**：[lib/xiaoke-widget.js:20124-20130](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-widget.js#L20124-L20130)

实际 widget 的动态尺寸选档。

```text
function xkAnimRes() {
  var w = 0
  try { w = img.getBoundingClientRect().width } catch (err) {}
  var px = (w || 120) * (window.devicePixelRatio || 1)
  return px > 384 && xkHdInstalled ? 512 : px > 256 ? 384 : 256
}
function xkAnimUrl(cry) {
```

#### 缺口

- 未对比静态状态、原版鲸鱼与小克的识别用时和打扰。
  **影响**：有明确外观及动画差异，无法据此归因余额准确度或生产效率。
  **进一步探讨**：同一余额状态比较三个界面是否能让读者正确理解来源和预警。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 DSH 注入到余额和账本，实际接线在哪里？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

bundle 插入 Host，Host 先注册页面注入，再等 webServer、credentials 和 connection。余额先解析宿主 API 凭据，失败或没有时退到账号路径，API 请求有单次超时及失败分支。缓存会合并在途请求，临时故障可给旧余额并标记 stale。成功响应会尝试记账，故读余额端点内部也可能写本地账本。宿主订阅会话事件，按 turn 汇聚 assistant usage，在结束后写最近轮消耗及模型事件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-30](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/package.json#L15-L30)

实际 Host 入口和 bundle 声明。

<details>
<summary>查看原文（16行）</summary>

```text
  "type": "module",
  "main": "lib/xiaoke-index.js",
  "icon": "./icon.png",
  "files": [
    "lib",
    "assets",
    "icon.png",
    "cordis.patch.yml",
    "README.md",
    "PROVENANCE.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:14-16](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/cordis.patch.yml#L14-L16)

插入宿主条目。

```text
- insert:
    - id: xiaoke-widget
      name: dsh-xiaoke-widget
```

**依据 3 · 源码核查**：[lib/xiaoke-index.js:734-752](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L734-L752)

先注册注入，再等服务。

<details>
<summary>查看原文（19行）</summary>

```text
  apply(root) {
    const rowDisposers = []
    root.effect(() => () => { for (const d of rowDisposers) { try { d() } catch (err) {} } })
    // ① 结构化注入行：桌面端唯一能生效的通道（web 形态另有 tapIndex，两条并存、各自去重）
    rowDisposers.push(root.on('webserver/index-inject', (table) => {
      try {
        if (!Array.isArray(table)) return
        for (const row of table) {
          if (!row) continue
          if (row.kind === 'script-src' && row.src === '/dsh-xiaoke/widget.js') return // 旧版本推过 → 不重复
          if (row.kind === 'script' && typeof row.text === 'string'
            && row.text.indexOf('/dsh-xiaoke/widget.js') >= 0) return
        }
        table.push({ kind: 'script', placement: 'body', text: DESKTOP_WIDGET_ROW_TEXT })
      } catch (err) {}
    }))

    // ② 其余逻辑：等齐三个服务后再跑（等价于原来的对象级 inject，但不再挡住 ①）
    root.inject(['webServer', 'credentials', 'connection'], (ctx) => {
```

</details>

**依据 4 · 源码核查**：[lib/xiaoke-index.js:1295-1317](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L1295-L1317)

API key 优先与账号退让。

<details>
<summary>查看原文（23行）</summary>

```text
      let cred = null
      let credErr = null
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          cred = await ctx.credentials.resolve('DEEPSEEK_API_KEY')
          credErr = null
          break
        } catch (err) {
          credErr = err
          if (attempt === 0) { await new Promise((r) => setTimeout(r, 700)); continue }
          // v781：凭据服务报错时**也要试账号路**（以前直接 return，登录态用户就被这条挡住）
          return await accountFallback({ code: 'NO_KEY', error: '凭据读取失败: ' + String((err && err.message) || err).slice(0, 160) })
        }
      }
      if (!cred) {
        // v759（issue #157）：没有 API key 时退回 DSH 账号登录态；两条路互不干扰，API key 始终第一优先。
        return await accountFallback(null)
      }
      const apiFail = await fetchApiKeyBalance(cred)
      if (apiFail.ok) return apiFail
      // v781：key 路**任何**失败都再试一次账号路（401/结构异常/超时都算）
      void credErr
      return await accountFallback(apiFail)
```

</details>

**依据 5 · 源码核查**：[lib/xiaoke-index.js:1321-1349](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L1321-L1349)

超时、HTTP 和 JSON 检查。

<details>
<summary>查看原文（29行）</summary>

```text
    async function fetchApiKeyBalance(cred) {
      let lastErr = null
      for (let attempt = 0; attempt < 2; attempt++) {
        let res
        try {
          res = await fetch(BALANCE_URL, {
            headers: { Authorization: 'Bearer ' + cred.value },
            signal: AbortSignal.timeout(8000),
          })
        } catch (err) {
          lastErr = err
          if (attempt === 0) await new Promise((r) => setTimeout(r, 500))
          continue
        }
        if (!res.ok) {
          lastErr = new Error('HTTP ' + res.status)
          if (res.status < 500) break
          if (attempt === 0) await new Promise((r) => setTimeout(r, 500))
          continue
        }
        let data
        try {
          data = await res.json()
        } catch (err) {
          return { ok: false, code: 'PARSE', error: '余额接口返回不是合法 JSON' }
        }
        const info = pickBalanceInfo(data && data.balance_infos)
        if (!info || info.total_balance === undefined || !Number.isFinite(Number(info.total_balance))) {
          return { ok: false, code: 'SHAPE', error: '余额接口返回结构异常' }
```

</details>

**依据 6 · 源码核查**：[lib/xiaoke-index.js:3129-3166](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3129-L3166)

读余额的缓存、写账、旧值和失败。

<details>
<summary>查看原文（38行）</summary>

```text
    function getBalance(force = false) {
      const now = Date.now()
      if (!force && balanceCache && now - balanceCache.at < BALANCE_TTL_MS) {
        return Promise.resolve(publicBalance(balanceCache.payload))
      }
      if (balanceInFlight) return balanceInFlight
      balanceInFlight = fetchBalance()
        .then((payload) => {
          if (payload.ok) {
            // v759（issue #157 报告人踩到）：**"记不了账"不该吞掉已经拿到的余额**。
            // 以前 recordLedgerUsage 抛错会被最外层 .catch 包成「余额服务异常: …」，
            // 界面看起来像"接口没通"，其实余额已经拿到了（accountTag/币种不合法就会这样）。
            // 但要与"**账本整个读不出来**"区分开：那种情况必须保持 fail-closed（见下面的 rethrow）——
            // 一边是"余额拿到了、只是没记上账"，一边是"账本已经坏了、连今日已用都算不出来"，
            // 后者若也回 ok:true，用户会以为一切正常，而账本其实不可用。
            let ledgerError = ''
            try {
              recordLedgerUsage(payload.totalBalance, payload.currency, payload.accountTag, Date.parse(payload.updatedAt))
            } catch (err) {
              ledgerError = String((err && err.message) || err).slice(0, 160)
            }
            let visible
            try {
              visible = publicBalance(payload) // 读账本算今日已用/近 7 天
            } catch (err) {
              throw err // 账本读不出来（结构损坏等）→ 交给最外层 .catch，报 ok:false 并保留原记录
            }
            balanceCache = { at: Date.now(), payload } // 先缓存：之后即使记账失败，余额也继续显示
            return ledgerError ? { ...visible, ledgerError } : visible
          }
          if (payload.transient && balanceCache) {
            return { ...publicBalance(balanceCache.payload), stale: true, error: payload.error }
          }
          return publicBalance(payload)
        })
        .catch((err) => ({
          ok: false, code: 'ERROR',
          error: '余额服务异常: ' + String((err && err.message) || err).slice(0, 200),
```

</details>

**依据 7 · 源码核查**：[lib/xiaoke-index.js:1130-1139](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L1130-L1139)

宿主会话事件真实订阅。

<details>
<summary>查看原文（10行）</summary>

```text
    // 监听所有会话的追加事件；按会话 id 分桶，turn/end 时结算该会话本轮
    disposers.push(ctx.on('session/event', (session, event) => {
      const sid = session && session.id ? session.id : 'default'
      handleSessionEvent(sid, event)
      notePendingEvent(sid, event, session)
    }))
    // 会话销毁时清理残留聚合，避免内存泄漏
    disposers.push(ctx.on('session/disposed', (session) => {
      if (session && session.id) turnAggs.delete(session.id)
    }))
```

</details>

**依据 8 · 源码核查**：[lib/xiaoke-index.js:918-943](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L918-L943)

结算最近轮和模型用量。

<details>
<summary>查看原文（26行）</summary>

```text
    function finalizeTurn(sessionId) {
      const agg = turnAggs.get(sessionId)
      if (agg && agg.cost > 0) {
        // v862/v862b：子智能体的会话**照常记账**（金额与用量事件都写），
        //   只在「子智能体完成时不提示」开着时跳过 lastTurnSeq ⇒ 前端不会因为它响提示音。
        const isSub = subagentSessions.has(String(sessionId || '')) && subagentMuteOn()
        lastTurn = { turn: agg.turn, amount: agg.cost, tokens: agg.tokens, ts: agg.lastTs }
        if (!isSub) {
          lastTurnSeq++
          writeTurnSeq(lastTurnSeq)
        }
        // 按模型拆分写入用量事件(模型明细的唯一来源)
        const byModel = agg.byModel || {}
        const byModelTokens = agg.byModelTokens || {}
        const modelNames = Object.keys(byModel)
        if (modelNames.length) {
          for (const mname of modelNames) {
            appendUsageEvent({ ts: agg.lastTs, model: mname, cost: byModel[mname], tokens: byModelTokens[mname] || 0 })
            // 自定义模型：按 matchIds 归属到注册表里的模型（余额差不可用时作为该模型的今日已用兜底）
            apiAttributeEvent(mname, byModel[mname], byModelTokens[mname] || 0)
          }
        } else {
          appendUsageEvent({ ts: agg.lastTs, model: '未知', cost: agg.cost, tokens: agg.tokens })
        }
      }
      turnAggs.delete(sessionId)
```

</details>

**依据 9 · 源码核查**：[lib/xiaoke-index.js:3681-3709](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3681-L3709)

余额响应以 JSON 语义区分成功和失败。

<details>
<summary>查看原文（29行）</summary>

```text
    disposers.push(registerRoute({
      kind: 'exact',
      path: '/dsh-xiaoke/balance.json',
      handler: async (req, res) => {
        const t0 = Date.now()
        try {
          const refresh = new URL(req.url || '/', 'http://localhost').searchParams.get('refresh') === '1'
          const payload = await getBalance(refresh)
          // v793：给「关于/自检」面板留一条最近的取数结果（只记状态与耗时，不记任何凭据）
          try {
            balanceLast = {
              at: Date.now(),
              ms: Date.now() - t0,
              ok: !!payload.ok,
              code: String(payload.code || ''),
              error: payload.ok ? '' : String(payload.error || '').slice(0, 160),
              hasBalance: payload.totalBalance !== null && payload.totalBalance !== undefined,
              currency: String(payload.currency || ''),
            }
          } catch (err) {}
          res.writeHead(200, JSON_HEADERS)
          // v794：成功失败都带上版本 ⇒ 客户端不必依赖"余额成功"才拿到版号
          res.end(JSON.stringify(Object.assign({}, payload, { version: BUILD_VERSION, versionLabel: VERSION_LABEL })))
        } catch (err) {
          try {
            balanceLast = { at: Date.now(), ms: Date.now() - t0, ok: false, code: 'THROW', error: String((err && err.message) || err).slice(0, 160), hasBalance: false, currency: '' }
          } catch (e2) {}
          res.writeHead(200, JSON_HEADERS)
          res.end(JSON.stringify({ ok: false, code: 'ERROR', error: String((err && err.message) || err).slice(0, 200), version: BUILD_VERSION, versionLabel: VERSION_LABEL }))
```

</details>

#### 缺口

- 本次未验证账号/API 的实际返回、路由装载和请求合并在宿主中的行为。
  **影响**：不能根据余额页面就判断凭据、服务商口径或账本已完整。
  **进一步探讨**：用不含真实凭据的受控 API 响应核对账号退让、旧值和分轮事件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 价格、跨账本和接口守卫在哪些边界内成立？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

账号与币种形成独立账本，忽略重复或乱序采样，观测下降和上涨分别记录。校正要求当前 revision，冲突返回 409，用户提交到账和其他扣减后才能做区间重算。无观测时可退旧版记录或本地事件估计。轮消耗按缓存、输入和输出乘本地峰谷价，推理已并入输出，仍与真实账单分开。路由统一自校验 Host、跨站标记和 Origin，再检查写请求 authority 和可用的宿主栅栏。宿主栅栏抛错拒绝，缺失时只剩自校验。写请求检查的回环是 Host 头规则，部署后能否证明真实网络来源须另查。

#### 证据与依据

**依据 1 · 源码核查**：[lib/accounting.mjs:145-178](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/accounting.mjs#L145-L178)

按账户币种与单调时间记账。

<details>
<summary>查看原文（34行）</summary>

```text
export function observeBalance(ledger, snapshot) {
  const at = Number(snapshot.at ?? Date.now())
  const day = beijingDay(at)
  const units = moneyUnits(snapshot.balance)
  const currency = String(snapshot.currency || 'CNY').toUpperCase()
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('余额币种无效')
  const scope = String(snapshot.scope || 'default')
  if (!/^[a-zA-Z0-9_-]{1,80}$/.test(scope)) throw new Error('账户标识无效')
  const context = scope + '-' + currency
  let a = ledger.accounting
  if (!a || a.version !== ACCOUNTING_VERSION) {
    // Legacy totals have no trustworthy recharge metadata. Preserve them for
    // reference; begin a new explicitly timed observation window.
    a = ledger.accounting = {
      version: ACCOUNTING_VERSION, active: context, books: {}, migratedAt: at,
      legacyHistory: { ...(ledger.history || {}) },
    }
  }
  a.books ||= {}
  let book = a.books[context]
  if (!book) book = a.books[context] = { currency, days: {} }
  // Ignore duplicate/out-of-order samples, including a late sample from yesterday.
  if (book.lastAt != null && at <= book.lastAt) return balanceSummary(ledger, ledger.date)
  a.active = context
  let row = book.days[day]
  if (!row) {
    row = book.days[day] = {
      day, firstAt: at, lastAt: at, openingUnits: units, lastUnits: units,
      debitUnits: 0, creditUnits: 0, revision: 0, correction: null,
    }
  } else {
    const delta = row.lastUnits - units
    if (delta > 0) row.debitUnits += delta
    if (delta < 0) row.creditUnits -= delta
```

</details>

**依据 2 · 源码核查**：[lib/accounting.mjs:207-234](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/accounting.mjs#L207-L234)

校正必须核对 revision 和确认。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[lib/accounting.mjs:249-287](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/accounting.mjs#L249-L287)

观测、历史及事件估计的切换。

<details>
<summary>查看原文（39行）</summary>

```text
export function daySummary(ledger, day) {
  const observed = balanceSummary(ledger, day)
  const estimate = eventEstimate(ledger, day)
  const books = bookBreakdown(ledger, day)
  const others = books.filter(b => !b.active)
  // 同币种才谈"合计"；不同币种只列明本数
  const otherSame = others.filter(b => !observed || b.currency === observed.currency)
  const common = { eventEstimate: estimate, eventCurrency: 'CNY', bookBreakdown: books, bookCount: books.length }
  if (observed) {
    if (!otherSame.length) return { ...observed, ...common }
    const other = sumMoney(otherSame.map(b => b.amount))
    const tail = others.length > otherSame.length ? '（另有其它币种 ' + (others.length - otherSame.length) + ' 本）' : ''
    // ⚠️ 不要把金额拼进 label：`label` 会被前端直接当"今日已用"的**前缀**显示
    //    （「<label> <金额>」），塞第二个数字会读成两个数。另给 historyHint 供面板/悬停提示用。
    return {
      ...observed, ...common, otherBookAmount: other,
      historyHint: '另有 ' + otherSame.length + ' 个历史记账本（换过 API key）· ' + other.toFixed(2) + tail,
    }
  }
  // 当前本没有这一天的记录，但别的记账本有（换/删过 API key）⇒ 显示成「已观测消费 · 历史账户」，
  // 而不是退化成「本地估算 ¥0.00」（issue #163：数据没丢，只是没有任何入口能再看到它）
  const fromOther = others[0]
  if (fromOther) {
    return {
      day, amount: fromOther.amount, currency: fromOther.currency,
      source: 'balance-observed-other-account', label: '已观测消费 · 历史账户',
      firstObservedAt: fromOther.firstObservedAt, lastObservedAt: fromOther.lastObservedAt,
      needsReview: fromOther.needsReview, ...common,
      ...partialDayInfo(day, { firstAt: fromOther.firstObservedAt, lastAt: fromOther.lastObservedAt }),
    }
  }
  // An explicit historical total (even zero) wins over a conflicting estimate.
  const history = ledger.accounting ? ledger.accounting.legacyHistory : ledger.history
  const h = history && history[day]
  const hasHistory = typeof h === 'number' && Number.isFinite(h)
  return {
    day, amount: hasHistory ? preciseMoney(h) : estimate, currency: 'CNY',
    source: hasHistory ? 'legacy' : 'events', label: hasHistory ? '旧版记录 · 未校正' : '本地估算',
    partialDay: true, ...common,
```

</details>

**依据 4 · 源码核查**：[lib/xiaoke-index.js:966-986](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L966-L986)

token 计量及本地价。

<details>
<summary>查看原文（21行）</summary>

```text
        const input = Number(usage.inputTokens) || 0
        const cache = Number(usage.cacheReadTokens) || 0
        const output = Number(usage.outputTokens) || 0
        // 口径修正（issue #89 / PR #83）：dsh 保证 reasoningTokens ⊆ outputTokens
        // （见 dsh-token-meter 的校验 reasoningTokens > outputTokens 即判非法），
        // 所以 reasoning 不能再单独累加 —— 否则输出侧按输出价被重复计费（实测偏高约一倍）。
        const outputBilled = output // DSH outputTokens already includes reasoningTokens.
        const toks = input + cache + outputBilled
        agg.tokens += toks
        // 定价换算（CNY/百万 token；缓存命中=输入价，其余按各自档位），并按模型拆分
        const model = d.message && d.message.source ? d.message.source.model : ''
        // 每轮结算前刷新一次自定义单价（10 秒节流），让自定义 API 模型用用户填的价格计费
        try { refreshCustomPrices() } catch (err) {}
        const p = priceFor(model)
        const off = isPeakTime(Math.floor(Date.now() / 1000)) ? 1 : 0
        let costMsg = (cache / 1e6) * p.hit[off] + (input / 1e6) * p.miss[off] + (outputBilled / 1e6) * p.out[off]
        // 自定义单价若按美元填写，按用户填的汇率换算成人民币（账本统一按 CNY 记账）
        try {
          const meta = customPriceMetaFor(model)
          if (meta && meta.cur === 'USD' && Number(meta.rate) > 0) costMsg = costMsg * Number(meta.rate)
        } catch (err) {}
```

</details>

**依据 5 · 源码核查**：[lib/xiaoke-index.js:782-804](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L782-L804)

Host、跨站和同源检查。

<details>
<summary>查看原文（23行）</summary>

```text
    function selfRejection(req, opts) {
      try {
        const headers = (req && req.headers) || {}
        let hostUrl = null
        try { hostUrl = new URL('http://' + String(headers.host || '')) } catch (err) { return 403 } // 缺 Host / 畸形 → 拒
        const hostname = hostUrl.hostname
        const authority = hostUrl.host
        if (!isLoopbackHostname(hostname)) {
          const listed = TRUSTED_AUTHORITIES.some((e) => (e.indexOf(':') >= 0 ? e === authority.toLowerCase() : e === hostname.toLowerCase()))
          const fenceAvailable = !!(opts && opts.fenceAvailable)
          if (!listed && !fenceAvailable) return 403
        }
        // 下面两条与"信任列表"无关，任何情况下都执行：跨站标记、Origin 与 Host 不同源。
        const site = String(headers['sec-fetch-site'] || '').toLowerCase()
        if (site === 'cross-site') return 403
        const origin = headers.origin
        if (typeof origin === 'string' && origin && origin !== 'null') {
          let originUrl = null
          try { originUrl = new URL(origin) } catch (err) { return 403 }
          if (originUrl.host.toLowerCase() !== authority.toLowerCase()) return 403
        }
        return null
      } catch (err) { return 403 } // 校验器自身出错 → 拒绝（fail-closed）
```

</details>

**依据 6 · 源码核查**：[lib/xiaoke-index.js:825-849](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L825-L849)

写请求 authority 规则。

<details>
<summary>查看原文（25行）</summary>

```text
    const ADMIN_AUTHORITIES = String(process.env.DSHW_ADMIN_HOSTS || '')
      .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
    const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
    function writeRejection(req) {
      try {
        const method = String((req && req.method) || 'GET').toUpperCase()
        if (!WRITE_METHODS.has(method)) return null
        const headers = (req && req.headers) || {}
        let hostUrl = null
        try { hostUrl = new URL('http://' + String(headers.host || '')) } catch (err) { return 403 }
        if (isLoopbackHostname(hostUrl.hostname)) return null
        const authority = hostUrl.host.toLowerCase()
        const hostname = hostUrl.hostname.toLowerCase()
        if (ADMIN_AUTHORITIES.some((e) => (e.indexOf(':') >= 0 ? e === authority : e === hostname))) return null
        if (!writeRejection.warned) {
          writeRejection.warned = true
          try {
            console.warn('[xiaoke-balance] 已拒绝一个来自非本机的**写请求**（Host=' + authority + '）。'
              + '自 0.3.15 起，配置与凭据的改动只能在**本机**（回环地址）打开界面进行 —— '
              + '否则任何拿到 Web 会话的人都能把凭据改指向自己的服务器，从而把真实 API key 带走。'
              + '确需远端管理，请用环境变量 DSHW_ADMIN_HOSTS 声明允许的管理主机。')
          } catch (err) {}
        }
        return 403
      } catch (err) { return 403 } // 自身出错 → 拒绝（fail-closed）
```

</details>

**依据 7 · 源码核查**：[lib/xiaoke-index.js:851-887](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L851-L887)

所有路由经包装，宿主栅栏可选且异常拒绝。

<details>
<summary>查看原文（37行）</summary>

```text
    function rejected(req, res) {
      const deny = (code) => {
        try { res.statusCode = code || 403; res.end() } catch (err) {}
        return true
      }
      const conn = connectionFence()
      // 先算栅栏可用性，再自校验：非回环 Host 在"栅栏可用"时交给栅栏判（它知道 --trusted-host）
      const self = selfRejection(req, { fenceAvailable: !!conn })
      if (self !== null) return deny(self)
      // v761（安全修复 S1）：写完再放行 —— 读请求不受影响
      const write = writeRejection(req)
      if (write !== null) return deny(write)
      if (!conn) return false // 已通过自校验；此刻没有宿主栅栏可委托（加载时已 warn）
      let code
      try {
        code = conn.requestRejection(req)
      } catch (err) {
        // 旧实现这里是 `return false`：栅栏自己抛异常被当成"没被拒"而静默放行（#136 的第二条路径）
        if (!rejected.warned) {
          rejected.warned = true
          try { console.warn('[xiaoke-balance] 信任栅栏抛异常，已按拒绝处理：' + String((err && err.message) || err)) } catch (e2) {}
        }
        return deny(403)
      }
      if (code === undefined || code === null || code === false) return false
      return deny(typeof code === 'number' ? code : 403)
    }
    // 统一注册入口：所有路由自动套上信任栅栏
    function registerRoute(route) {
      const inner = route && route.handler
      const wrapped = Object.assign({}, route, {
        handler: async (req, res) => {
          if (rejected(req, res)) return
          return inner(req, res)
        },
      })
      return ctx.webServer.register(wrapped)
```

</details>

#### 缺口

- 价格、日切、真实账单与代理下的访问控制均未独立验证。
  **影响**：端点能展示统计与来源，不能用 HTTP 200 或本地估计确认当前余额、完整消费与授权。
  **进一步探讨**：用仿真金额对照充值、币种变化、乱序、旧 revision 和代理 Host 形状。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、资源和退出代价如何盘点？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者使用 Web profile 链接安装并重启，manifest 不声明具体 Node 下限。取数依赖宿主凭据或登录和供应商网络，纯动画可先用随包档。根据物理像素选 256 或 384，只有完成高清包安装且尺寸够大才取 512。Host 对每个高清素材核对固定 SHA-256，允许单个成员写入，installed 要求两个都在。删除高清素材后退回随包档。作者列 Edge 单机内存及显存样本，不能外推到其他设备；角色素材的分发条件按作者列的独立许可核对。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-51](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/README.md#L40-L51)

作者单设备资源报告及安装说明。

<details>
<summary>查看原文（12行）</summary>

```text
动图按挂件在屏幕上的实际大小自动挑档。插件自带 256 / 384 两档；想把挂件调得很大又不想糊，可以在「资源管理 → 动态小克 · 高清档」里
下载 512 高清包（约 18 MB，在 [AirsEDA 的 Releases](https://github.com/AirsEDA/dsh-xiaoke-widget/releases)，[本仓库的 Releases](https://github.com/aklnaaw/dsh-xiaoke-widget/releases) 里也有一份），再点「安装…」选中下载的 zip，装好占硬盘约 18 MB。

浏览器会把动图的每一帧解码后留在内存和显存里，各档比静态小克多占（作者电脑上的 Edge 实测，因电脑而异）：

| 档位 | 什么时候用 | 内存 | 显存 |
|---|---|---|---|
| 256 | 挂件在屏幕上不超过 256 物理像素（默认大小） | 约 30 MB | 约 40 MB |
| 384 | 不超过 384 物理像素 | 约 100 MB | 约 100 MB |
| 512 | 超过 384 物理像素，并且装了高清包 | 约 190 MB | 约 200 MB |

用核显的电脑，显存也是从内存里划的。
```

</details>

**依据 2 · 作者声明**：[README.md:54-65](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/README.md#L54-L65)

作者的安装和重启前置。

<details>
<summary>查看原文（12行）</summary>

````text
## 安装

```bash
dsh plugin --profile web add link:<这个目录>
```
### **嫌麻烦可以丢给dsh或者Claude Code和codex让他们装**

装完重启一下 `dsh web`。

## 说明

本人日常主要使用 Linux 系统，所以 Windows 上的 bug 我不一定能及时发现，请见谅。遇到了欢迎提 issue，能修就修。
````

</details>

**依据 3 · 源码核查**：[lib/xiaoke-index.js:3595-3604](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3595-L3604)

高清内容哈希及已安装要求。

<details>
<summary>查看原文（10行）</summary>

```text
    // 用户在「资源管理」里选下载好的 zip 安装到 DSH 数据目录的 xiaoke-anim-hd/，只装 SHA-256 核对得上的文件
    const XK_HD_DIR = path.join(DSH_HOME, 'xiaoke-anim-hd')
    const XK_HD_FILES = {"xiaoke-anim-512.webp":"253ae96ec79780700ab0552f08fb6016d52af891dbc789be8bfa2556fdbca88a","xiaoke-anim-cry-512.webp":"92fde1aa0f3c5454e88be5ddd215b7ec0f99bf7379063bc8fca196f88a370884"}
    const xkHdInstalled = () => Object.keys(XK_HD_FILES).every((f) => fs.existsSync(path.join(XK_HD_DIR, f)))
    // 从选中的文件里取出 webp：.webp 直接用；.zip 只读不压缩（stored）的条目，官方高清包就是这样打的
    function xkHdEntries(name, buf) {
      if (/\.webp$/i.test(name)) return [[path.basename(name), buf]]
      if (!/\.zip$/i.test(name)) return []
      let eocd = -1
      for (let i = buf.length - 22; i >= 0 && i >= buf.length - 65557; i--) {
```

</details>

**依据 4 · 源码核查**：[lib/xiaoke-index.js:3624-3655](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3624-L3655)

逐个成员校验、写入和可选移除。

<details>
<summary>查看原文（32行）</summary>

```text
    disposers.push(registerRoute({
      kind: 'exact',
      path: '/dsh-xiaoke/anim-hd.json',
      handler: async (req, res) => {
        try {
          if (req.method === 'POST') {
            // 高清包 zip 约 18MB，base64 后约 24MB
            const input = JSON.parse(await readBodyMax(req, 40 * 1024 * 1024))
            if (input.action === 'remove') {
              for (const f of Object.keys(XK_HD_FILES)) fs.rmSync(path.join(XK_HD_DIR, f), { force: true })
            } else if (input.action === 'install') {
              let got = 0
              for (const item of Array.isArray(input.files) ? input.files : []) {
                const m = /^data:[^,]*;base64,([A-Za-z0-9+/=]+)$/.exec(String((item && item.data) || ''))
                if (!m) continue
                for (const [name, bytes] of xkHdEntries(String(item.name || ''), Buffer.from(m[1], 'base64'))) {
                  if (XK_HD_FILES[name] !== createHash('sha256').update(bytes).digest('hex')) continue
                  fs.mkdirSync(XK_HD_DIR, { recursive: true })
                  const tmp = path.join(XK_HD_DIR, name + '.tmp')
                  fs.writeFileSync(tmp, bytes)
                  fs.renameSync(tmp, path.join(XK_HD_DIR, name))
                  got++
                }
              }
              if (!got) throw new Error('选中的文件里没有高清包的内容（请选下载的 xiaoke-anim-hd.zip）')
            }
          }
          res.writeHead(200, JSON_HEADERS)
          res.end(JSON.stringify({ ok: true, installed: xkHdInstalled() }))
        } catch (err) {
          res.writeHead(400, JSON_HEADERS)
          res.end(JSON.stringify({ ok: false, installed: xkHdInstalled(), error: String((err && err.message) || err).slice(0, 200) }))
```

</details>

**依据 5 · 源码核查**：[lib/xiaoke-index.js:3660-3675](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3660-L3675)

缺高清文件时回退。

<details>
<summary>查看原文（16行）</summary>

```text
    for (const [route, base] of [['/dsh-xiaoke/anim.webp', 'xiaoke-anim'], ['/dsh-xiaoke/anim-cry.webp', 'xiaoke-anim-cry']]) {
      disposers.push(registerRoute({
        kind: 'exact',
        path: route,
        handler: (req, res) => {
          try {
            const q = new URL(req.url || '/', 'http://localhost').searchParams.get('r')
            const hd = path.join(XK_HD_DIR, base + '-512.webp')
            const file = q === '256' || q === '384' ? path.join(PACKAGE_ROOT, 'assets', base + '-' + q + '.webp')
              : fs.existsSync(hd) ? hd : path.join(PACKAGE_ROOT, 'assets', base + '-384.webp')
            const bytes = fs.readFileSync(file)
            res.writeHead(200, { 'Content-Type': 'image/webp', 'Cache-Control': 'max-age=3600', 'Content-Length': String(bytes.length) })
            res.end(bytes)
          } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
            res.end('xiaoke anim unavailable: ' + String((err && err.message) || err))
```

</details>

**依据 6 · 源码核查**：[lib/xiaoke-widget.js:20124-20130](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-widget.js#L20124-L20130)

客户端实际选档。

```text
function xkAnimRes() {
  var w = 0
  try { w = img.getBoundingClientRect().width } catch (err) {}
  var px = (w || 120) * (window.devicePixelRatio || 1)
  return px > 384 && xkHdInstalled ? 512 : px > 256 ? 384 : 256
}
function xkAnimUrl(cry) {
```

#### 缺口

- 没有实测加载、内存、显存、退出后残留或账本费用。
  **影响**：下载和动画持续消耗要独立计入，初次若只需读余额可先用静态角色。
  **进一步探讨**：先用隔离 profile 与固定响应，记录下载字节、CPU/内存、确认来源和删除高清素材的恢复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 数据来源与更新时间更显眼能否减少误读？

**研究主题**：新假设与验证

#### 完整回答

目前返回账本来源、文字标签和币种，临时故障可返回 stale。可把观测区间、最近成功时间、来源和历史账户标在同一行，并分开余额观测、校正和本地估计。给同一批仿真账户、充值和网络中断做盲测，比较把旧值读成当前、把估计当账单的比例和定位时间。

#### 证据与依据

**依据 1 · 源码核查**：[lib/xiaoke-index.js:3120-3125](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3120-L3125)

已输出来源、标签、币种和账本信息。

```text
        // 峰谷切换点与节假日清单：前端倒计时要与宿主同源（否则法定节假日会算错切换点）
        peakNextChangeAt: nextPeakChangeAt(nowSec),
        peakHolidays: HOLIDAY_VALLEY_LIST,
        todayUsage: summary.amount, todayUsageCurrency: summary.currency,
        usageSource: summary.source, usageLabel: summary.label, usageMode: 'ledger',
        accounting: balanceSummary(led, todayKey()),
```

**依据 2 · 源码核查**：[lib/xiaoke-index.js:3150-3162](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/xiaoke-index.js#L3150-L3162)

失败时可保持旧值并标 stale。

<details>
<summary>查看原文（13行）</summary>

```text
            let visible
            try {
              visible = publicBalance(payload) // 读账本算今日已用/近 7 天
            } catch (err) {
              throw err // 账本读不出来（结构损坏等）→ 交给最外层 .catch，报 ok:false 并保留原记录
            }
            balanceCache = { at: Date.now(), payload } // 先缓存：之后即使记账失败，余额也继续显示
            return ledgerError ? { ...visible, ledgerError } : visible
          }
          if (payload.transient && balanceCache) {
            return { ...publicBalance(balanceCache.payload), stale: true, error: payload.error }
          }
          return publicBalance(payload)
```

</details>

**依据 3 · 源码核查**：[lib/accounting.mjs:249-287](https://github.com/aklnaaw/dsh-xiaoke-widget/blob/8e2a207bfc9ae3983168dcc847e54734771bce67/lib/accounting.mjs#L249-L287)

已有多种显示口径。

<details>
<summary>查看原文（39行）</summary>

```text
export function daySummary(ledger, day) {
  const observed = balanceSummary(ledger, day)
  const estimate = eventEstimate(ledger, day)
  const books = bookBreakdown(ledger, day)
  const others = books.filter(b => !b.active)
  // 同币种才谈"合计"；不同币种只列明本数
  const otherSame = others.filter(b => !observed || b.currency === observed.currency)
  const common = { eventEstimate: estimate, eventCurrency: 'CNY', bookBreakdown: books, bookCount: books.length }
  if (observed) {
    if (!otherSame.length) return { ...observed, ...common }
    const other = sumMoney(otherSame.map(b => b.amount))
    const tail = others.length > otherSame.length ? '（另有其它币种 ' + (others.length - otherSame.length) + ' 本）' : ''
    // ⚠️ 不要把金额拼进 label：`label` 会被前端直接当"今日已用"的**前缀**显示
    //    （「<label> <金额>」），塞第二个数字会读成两个数。另给 historyHint 供面板/悬停提示用。
    return {
      ...observed, ...common, otherBookAmount: other,
      historyHint: '另有 ' + otherSame.length + ' 个历史记账本（换过 API key）· ' + other.toFixed(2) + tail,
    }
  }
  // 当前本没有这一天的记录，但别的记账本有（换/删过 API key）⇒ 显示成「已观测消费 · 历史账户」，
  // 而不是退化成「本地估算 ¥0.00」（issue #163：数据没丢，只是没有任何入口能再看到它）
  const fromOther = others[0]
  if (fromOther) {
    return {
      day, amount: fromOther.amount, currency: fromOther.currency,
      source: 'balance-observed-other-account', label: '已观测消费 · 历史账户',
      firstObservedAt: fromOther.firstObservedAt, lastObservedAt: fromOther.lastObservedAt,
      needsReview: fromOther.needsReview, ...common,
      ...partialDayInfo(day, { firstAt: fromOther.firstObservedAt, lastAt: fromOther.lastObservedAt }),
    }
  }
  // An explicit historical total (even zero) wins over a conflicting estimate.
  const history = ledger.accounting ? ledger.accounting.legacyHistory : ledger.history
  const h = history && history[day]
  const hasHistory = typeof h === 'number' && Number.isFinite(h)
  return {
    day, amount: hasHistory ? preciseMoney(h) : estimate, currency: 'CNY',
    source: hasHistory ? 'legacy' : 'events', label: hasHistory ? '旧版记录 · 未校正' : '本地估算',
    partialDay: true, ...common,
```

</details>

#### 缺口

- 没有读者对照，现有标签可能已够用。
  **影响**：增加信息可能使泡泡更难读。
  **进一步探讨**：以既有标签作基线，效果不能抵消额外阅读成本则不增加。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
