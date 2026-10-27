# dsh-WallpaperAndCost

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[72f6c05](https://github.com/AppliedYuu/dsh-WallpaperAndCost/tree/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AppliedYuu/dsh-WallpaperAndCost)
<!-- END META -->

> **功能**：为 DSH 添加图片视频壁纸、余额用量组件和 Wallpaper Engine 本地媒体提取入口。

> **亮点**：将媒体背景、会话头部用量与本地工坊提取集成到宿主，凭据解析留在Host且未定价模型不虚填金额；价值是操作集中，未证明整体效率收益。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：提取函数自身未检查方法、来源或目录授权，实际访问控制依赖未核查的宿主；本地价格表按模型名估算也不能直接对账。合包用户须同时承担文件与凭据边界。[Q03](#research-q03) 当前价表可重算历史，缺单价字段会按0、坏表回退默认 flash 价，计价来源与版本必须另核查。[Q03](#research-q03)

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
  - [Q01 · 合并插件服务谁，贡献是否超过入口堆叠？](#detail-section-11)
  - [Q02 · 壁纸状态、费用数据和提取如何实现？](#detail-section-12)
  - [Q03 · 费用与本地文件权限能保证什么，成本如何？](#detail-section-13)
  - [Q04 · 能否拆出权限和计价来源边界？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在DSH内管理界面背景与查看供应商用量的人可集中使用多入口，服务器提取另需本地文件权限。[Q01](#research-q01)

系统壁纸、供应商控制台和独立提取脚本可分别完成任务；合包的优势主要是DSH内入口集中。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：壁纸设置、余额和OpenCode Go用量组件
- **Host 路由**：余额、会话估算、用量和工坊提取预览接口
- **事件监听**：会话事件驱动用量与费用更新

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots、locale与theme | 界面必需 | 设置和头部组件 | 对应UI不可用 |
| IndexedDB与浏览器媒体支持 | 上传壁纸必需 | 保存播放媒体 | 背景持久化或播放失败 |
| credentials与供应商账号 | 费用功能必需 | Host查询用量 | 无数据或错误 |
| Python/py与目录权限 | 服务器提取必需 | 解析工坊文件 | 提取失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户加载并选择功能 | 确认媒体与路由权限条件 |
| 配置 | 用户设置壁纸与测试凭据 | 来源及显示正确 |
| 提取 | 授权用户选择隔离目录 | 仅目标媒体产出，可清理 |
| 核对 | 用户比较估算与官方账单 | 差异保留说明，不自动记账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 媒体存储、设备和服务账号费用未知 | 配置媒体、凭据与Python | 各功能条件独立 |
| 持续使用 | 视频解码、轮询与存储资源未测 | 核对来源、缓存和价目表 | 估算不等于账单 |
| 失败恢复 | 重试提取与查询资源未知 | 清理媒体、输出、排查访问权限 | 未见完整退出清理证据 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 壁纸持久化 | IndexedDB与本地设置 | 长期配额和播放资源 |
| 费用查看 | Host凭据代理与估算规则 | 上游可用性和账单差异 |
| 工坊提取 | Python子进程与媒体路由 | 格式覆盖、权限与清理 |

> **思考**：提取函数自身未检查方法、来源或目录授权，实际访问控制依赖未核查的宿主；本地价格表按模型名估算也不能直接对账。合包用户须同时承担文件与凭据边界。[Q03](#research-q03) 当前价表可重算历史，缺单价字段会按0、坏表回退默认 flash 价，计价来源与版本必须另核查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将媒体背景、会话头部用量与本地工坊提取集成到宿主，凭据解析留在Host且未定价模型不虚填金额；价值是操作集中，未证明整体效率收益。[Q01](#research-q01) [Q02](#research-q02)

媒体与设置分存、凭据不传浏览器值得借鉴；execFile参数数组避免shell拼接。但合并功能将装饰、外部查询和文件处理置于同包，需明确路由访问和能力生命周期。[Q02](#research-q02) [Q02](#research-q02) 的价表文件与计价缓存指纹减少修改代码，但宿主存储保存与重放没有冻结历史价表，不能承担不可变审计账。

<a id="detail-section-5"></a>

### 1.4 主要限制

提取函数自身未检查方法、来源或目录授权，实际访问控制依赖未核查的宿主；本地价格表按模型名估算也不能直接对账。合包用户须同时承担文件与凭据边界。[Q03](#research-q03) 当前价表可重算历史，缺单价字段会按0、坏表回退默认 flash 价，计价来源与版本必须另核查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认宿主哪些人能访问这些路由，再决定是否需要服务器目录提取。费用面板按估算查看，重要支出回供应商账单核对；视频壁纸先观察设备资源。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

存储、凭据代理和提取接线有源码支持；宿主访问控制、上游可用性与账单准确性未验证。权限分层为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、pricing.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定JS存储、代理和提取路由核查；未执行Python、读取工坊目录、运行媒体或请求上游。
- 下一步：核查宿主全局鉴权、路由方法、目录授权、代表格式、媒体资源与账单差异，未执行。

**分析版本**

- **仓库**：[AppliedYuu/dsh-WallpaperAndCost](https://github.com/AppliedYuu/dsh-WallpaperAndCost)
- **版本号**：1.1.0（[固定提交 72f6c05](https://github.com/AppliedYuu/dsh-WallpaperAndCost/tree/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可按基础壁纸、查询和提取分层启用，用短期目录令牌约束文件操作，并给金额绑定规则与来源；以未授权目录拒绝和历史估算可重现验证，配置负担过高则否定。未实现。[Q04](#research-q04)

核查宿主全局鉴权、路由方法、目录授权、代表格式、媒体资源与账单差异，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4050 | 3473 | 386 | — |
| .md | source | 1 | 106 | — | — | 1540 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AppliedYuu/dsh-WallpaperAndCost/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AppliedYuu/dsh-WallpaperAndCost/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AppliedYuu/dsh-WallpaperAndCost/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：检验界面个性化、费用查看与本地提取组合的价值和权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 合并插件服务谁，贡献是否超过入口堆叠？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向既想自定义 DSH 工作界面、又想在会话内看余额和用量的用户。壁纸任务的合格结果是所选媒体与透明度持续生效，费用任务的合格结果是能分清平台真实数据和会话估算，创意工坊任务则是从有权限的本地条目中取得可预览媒体。三者没有同一个业务验收，合并主要减少安装入口，并没有证明它们共同改善任务交付。可识别增量包括会话头部就地查看用量、原图或视频的本地保存与创意工坊解析入口；相对系统壁纸和供应商控制台是宿主内集成，不是计费或媒体解码原理创新。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-38](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/README.md#L3-L38)

作者列出壁纸、提取与用量各自功能，不能据组合推断共同收益。

<details>
<summary>查看原文（36行）</summary>

````text
A merged DSH web plugin combining **wallpaper customization** and the **DeepSeek balance & usage widget**.

## Features

### 🎨 Wallpaper (壁纸)
- 8 built-in curated gradients (暮色 / 深渊 / 晨曦 / 森林 / 星夜 / 暖阳 / 青空 / 石墨)
- Upload your own images **at full original resolution** (no compression), stored in IndexedDB
- **动态壁纸：上传 MP4/WebM 视频，自动静音循环播放**（铺底 `<video>` 元素，object-fit: cover）
- Crop editor: drag to pan + zoom (100%–250%) with a live viewport-proportional preview
- Independent **absolute opacity sliders (0–100%)** for the left sidebar, the conversation column and the right sidebar — the right-sidebar slider now drives **both** the dsh-better-sidebar panel *and* DSH's official right sidebar (dsh-client-ui-sidebar-right, detected via `[data-sidebar-right-panel]`); the slider auto-appears whenever either sidebar is present
- Wallpaper choice persists across restarts (localStorage + IndexedDB)
- **创意工坊壁纸提取（服务器目录）**：输入 Wallpaper Engine 创意工坊条目文件夹的绝对路径（`…steamapps\workshop\content\431960\<id>`），由内置的 `scripts/extract_scene_pkg.py` 解析 `scene.pkg` / `.tex`（含 LZ4 解压、DXT/RGBA→PNG、内嵌 MP4），提取最佳壁纸供预览与下载。需要运行 DSH 的机器装有 Python 3（脚本为纯 Python，Pillow 可选）。
  - **桌面端支持「选择文件夹…」**：DSH Desktop（Windows）上可直接用系统原生文件夹选择器选取条目文件夹，自动填入绝对路径，避免手输/粘贴路径出错而报"文件夹不存在"。
  - **路径自动规整 + 明确报错**：路径会先去空白、剥成对引号、展开 `~`，并校验是否为绝对路径；读取失败会区分「文件夹不存在」「没有权限读取该文件夹（含 Windows 受控文件夹访问拦截）」「路径不是文件夹」，不再把权限问题笼统报成"文件夹不存在"。

### 🔍 Wallpaper Engine 创意工坊提取脚本
- 仓库自带独立脚本 `scripts/extract_scene_pkg.py`，可单独命令行使用：
  ```sh
  python scripts/extract_scene_pkg.py --folder <创意工坊条目文件夹> --out <输出目录>
  python scripts/extract_scene_pkg.py <scene.pkg>          # 或直接解析单个 pkg
  python scripts/extract_scene_pkg.py <scene.pkg> --list   # 只列出包内文件
  ```
- 支持容器：PKGV（scene.pkg）、TEXV0005/TEXI0001/TEXB000x（.tex）。内容类型：内嵌 JPEG/MP4、DXT1/3/5→.dds（有 Pillow 转 .png）、RGBA8888/R8 裸像素→.png、其余文件原样导出。
- 浏览器端另有无需 Python 的「从 Wallpaper 导入」入口（File System Access API 纯 JS 解包），两者互补。

### 💰 Balance & usage (余额与用量)
- Balance button in the conversation header: balance, today's consumption, this session's token usage & estimated cost
- Prices come from **`pricing.json`** (data, not code): regex model ids, an optional peak/off-peak split, CNY per million tokens — see [Model pricing](#model-pricing-pricingjson)
- Per-model and per-window (peak/off-peak) breakdown in the popover
- The per-session ledger is **durable**: a host restart no longer zeroes the token meter. It is written to `$DSH_HOME/storages/dsh-wallpaper-cost-sessions.json` and dropped only once that conversation is archived/deleted
- Platform consumption (`DEEPSEEK_PLATFORM_TOKEN`) is read from DSH's credential store by the host (`ctx.credentials.resolve`), the same way `DEEPSEEK_API_KEY` and `OPENCODE_GO_API_KEY` are — no in-widget token capture
- The DeepSeek API key never leaves the host (host-side routes only)

### 🏷 Model pricing (`pricing.json`)

The price table is one JSON file at the package root — editing it needs no code change and no rebuild; the host reloads it as soon as its mtime changes, and history is re-priced on the next replay.
````

</details>

**依据 2 · 源码核查**：[lib/client.js:2492-2512](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/client.js#L2492-L2512)

设置页与两个头部动作分别注册，支持独立任务界限。

<details>
<summary>查看原文（21行）</summary>

```text
    function apply(ctx) {
      // ---- wallpaper ----
      const slots = ctx.get('slots');
      const theme = ctx.get('theme');
      if (theme) themeSvc = theme;
      // ---- balance widget ----
      ctx.effect(() => { ctx.locale.register("balance", { zh, en }); }, "merged: balance dictionaries");
      ctx.effect(() => { injectStyles(); }, "merged: balance styles");
      if (slots) {
        slots.inject('settings.section', () => slots.register(
          { name: 'settings.section', id: 'wallpaper', order: 60, label: '壁纸' },
          () => React.createElement(SettingsPage),
        ));
        slots.inject("conversation.session.header.actions", () => slots.register(
          { name: "conversation.session.header.actions", id: "dsh-balance-widget", order: 30, locale: "balance" },
          BalanceWidget,
        ));
        slots.inject("conversation.session.header.actions", () => slots.register(
          { name: "conversation.session.header.actions", id: "dsh-opencode-go-usage", order: 40 },
          OpenCodeUsage,
        ));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 壁纸状态、费用数据和提取如何实现？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

客户端把显示设置留在 localStorage，把上传媒体留在 IndexedDB，再应用背景和透明度。费用路由在 Host 解析凭据并请求上游，浏览器接收结果而不是 API key；会话费用根据事件 token 与本地价格规则聚合，未知模型保留未定价。提取路由接收服务器绝对目录，创建输出目录，再用 execFile 启动内置 Python 脚本，读产物列表并提供文件预览。execFile 参数数组避免 shell 拼接，但操作仍会读取本地目录、消耗解压资源并写服务器输出。因此纯客户端壁纸与需要服务端权限的提取应分别评估。Python 路径尝试 python 再 py，跨平台是否具备该命令须核对。 当前计价数据来自随包 pricing.json，按 mtime 热重载并使重放缓存失效；会话 ledger 保存到宿主存储并在启动恢复，写盘使用临时文件后 rename。持久账本不是官方账单，当前表变化后历史重放会重算费用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:385-424](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/client.js#L385-L424)

IndexedDB 与localStorage分别保存媒体和设置。

<details>
<summary>查看原文（40行）</summary>

```text
          const req = indexedDB.open(IDB_NAME, 1);
          req.onupgradeneeded = () => { try { req.result.createObjectStore(IDB_STORE); } catch (e) {} };
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } catch (e) { reject(e); }
      });
    }

    function idbPut(key, value) {
      return idbOpen().then((db) => new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.objectStore(IDB_STORE).put(value, key);
          tx.oncomplete = () => { try { db.close(); } catch (e) {} resolve(); };
          tx.onerror = () => { try { db.close(); } catch (e) {} reject(tx.error); };
        } catch (e) { reject(e); }
      })).catch(() => {});
    }

    function idbGet(key) {
      return idbOpen().then((db) => new Promise((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readonly');
          const req = tx.objectStore(IDB_STORE).get(key);
          req.onsuccess = () => { try { db.close(); } catch (e) {} resolve(req.result); };
          req.onerror = () => { try { db.close(); } catch (e) {} reject(req.error); };
        } catch (e) { reject(e); }
      })).catch(() => undefined);
    }

    function persist(next) {
      try {
        if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
          localStorage.setItem(KEY, JSON.stringify({ ...next, uploads: [] }));
        }
      } catch (e) {}
      try {
        // 持久化时去掉运行时 objectURL (重启后需重新创建), Blob 本身可存 IndexedDB
        const clean = (next.uploads || []).map((u) => { const c = { ...u }; delete c.url; return c; });
        idbPut(IDB_UPLOADS_KEY, clean);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1173-1189](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1173-L1189)

凭据只在Host解析并加入上游请求。

<details>
<summary>查看原文（17行）</summary>

```text
      handler: async (req, res) => {
        try {
          const hit = await ctx.credentials.resolve("DEEPSEEK_API_KEY");
          if (hit === void 0) {
            sendJson(res, 503, {
              ok: false,
              error: "no-api-key",
              message: "未配置 DEEPSEEK_API_KEY：请在 设置 → 模型 中填写 DeepSeek API Key。"
            });
            return;
          }
          const response = await fetch(balanceUrl(), {
            headers: {
              Authorization: `Bearer ${hit.value}`,
              Accept: "application/json"
            },
            signal: AbortSignal.timeout(TIMEOUT_MS)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:824-853](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L824-L853)

提取以参数数组启动Python，包含超时与缓冲限制。

<details>
<summary>查看原文（30行）</summary>

```text
async function runExtractScript(args) {
  const attempt = (bin) =>   // 尝试用某个解释器(bin)再跑一次脚本
    new Promise((resolve, reject) => {
      execFile(
        bin,
        [EXTRACT_SCRIPT_PATH].concat(args),
        {
          timeout: 120000,
          maxBuffer: 32 * 1024 * 1024,
          windowsHide: true,
          encoding: "utf8"
        },
        (err, stdout, stderr) => {
          if (err) {
            if (err.code === "ENOENT") {
              if (bin === "py") {
                reject(new Error("未找到 Python：请安装 Python 3，或将 python / py 加入 PATH 后重启 DSH"));
              } else {
                attempt("py").then(resolve, reject);
              }
              return;
            }
            resolve({ code: typeof err.code === "number" ? err.code : 1, stdout: stdout || "", stderr: stderr || "" });
            return;
          }
          resolve({ code: 0, stdout: stdout || "", stderr: stderr || "" });
        }
      );
    });
  return attempt("python");
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1393-1404](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1393-L1404)

提取写输出目录并返回产物，确定副作用边界。

<details>
<summary>查看原文（12行）</summary>

```text
          const root = workshopOutRoot();
          mkdirSync(root, { recursive: true });
          const outDir = join(root, workshopJob(folder));
          const result = await runExtractScript(["--folder", folder, "--out", outDir]);
          const printed = `${tail(result.stdout, 3000)}${result.stderr ? "\n[stderr] " + tail(result.stderr, 1000) : ""}`;
          let files = [];
          try {
            files = readdirSync(outDir, { withFileTypes: true })
              .filter((d) => d.isFile())
              .map((d) => {
                const p = join(outDir, d.name);
                return { name: d.name, size: statSync(p).size, kind: mediaKind(d.name) };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:196-232](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L196-L232)

文件修改时间缓存和内容指纹决定价表刷新。

<details>
<summary>查看原文（37行）</summary>

```text
let pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: -1 };

/**
 * 读取/热重载 pricing.json。
 * mtime 未变 → 直接返回缓存；变了 → 重新解析编译；读不到或全表非法 → 用内置兜底价。
 * @returns {{ peakWindows: Array<{startHour:number,endHour:number}>, models: Array<object> }} 编译后的计价表
 */
export function pricingTable() {
  let mtime = -1;
  try {
    mtime = statSync(PRICING_PATH).mtimeMs;
  } catch {
    mtime = -1; // 文件不存在
  }
  if (mtime !== -1 && mtime === pricingState.fileMtime) return pricingState.table;
  if (mtime === -1) {
    if (pricingState.fileMtime !== -1 || pricingState.table !== FALLBACK_PRICING) {
      console.warn(`dsh-WallpaperAndCost: 找不到 ${PRICING_FILE}，已回退到内置 flash 价`);
    }
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: -1 };
    return pricingState.table;
  }
  try {
    const compiled = compilePricing(JSON.parse(readFileSync(PRICING_PATH, "utf8")));
    if (compiled === null) throw new Error("no usable model rule");
    pricingState = { table: compiled, fingerprint: fingerprintOf(compiled), fileMtime: mtime };
  } catch (error) {
    console.warn(`dsh-WallpaperAndCost: ${PRICING_FILE} 解析失败，已回退到内置 flash 价`, error instanceof Error ? error.message : error);
    pricingState = { table: FALLBACK_PRICING, fingerprint: fingerprintOf(FALLBACK_PRICING), fileMtime: mtime };
  }
  return pricingState.table;
}

/** 当前计价表的指纹（重放缓存据此失效）。 */
export function pricingFingerprint() {
  pricingTable();
  return pricingState.fingerprint;
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1081-1120](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1081-L1120)

启动恢复与延迟写盘、退出补写的实际接线。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx) {
  // 分会话账本：启动时把上次存盘的账本读回来(重启不清零)，之后随消息实时累加。
  // 落盘是防抖的：来消息只标脏并排一次 2 秒后的写盘。
  const ledger = loadSessionLedger();
  const bySession = new Map();
  const touchedAt = new Map();
  for (const [id, entry] of ledger) {
    bySession.set(id, entry.record);
    touchedAt.set(id, entry.updatedAt);
  }
  ledger.clear();
  let ledgerDirty = false;
  let ledgerTimer = null;

  const flushLedger = () => {
    if (!ledgerDirty) return;
    ledgerDirty = false;
    const out = new Map();
    for (const [id, record] of bySession) out.set(id, { record, updatedAt: touchedAt.get(id) ?? Date.now() });
    saveSessionLedger(out);
  };

  const scheduleLedgerSave = () => {
    ledgerDirty = true;
    if (ledgerTimer !== null) return;
    ledgerTimer = setTimeout(() => {
      ledgerTimer = null;
      flushLedger();
    }, LEDGER_SAVE_DEBOUNCE_MS);
    if (typeof ledgerTimer.unref === "function") ledgerTimer.unref();
  };

  // 插件卸载/宿主关闭时把没落盘的账本补写一次
  ctx.effect(() => () => {
    if (ledgerTimer !== null) {
      clearTimeout(ledgerTimer);
      ledgerTimer = null;
    }
    flushLedger();
  }, "dsh-WallpaperAndCost: ledger flush on teardown");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 费用与本地文件权限能保证什么，成本如何？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

价格规则按裸模型正则匹配，规则从 effectiveFrom=0 开始并有固定参考汇率；它表示该实现采用的估算，不证明任意供应商、历史合同和当前账单都相同，不能把页面估算称为财务对账。提取 handler 直接读 folder 参数并运行脚本，本函数未检查方法、Origin或逐目录授权，文件服务只作词法目录约束；实际远程可达性和全局鉴权由宿主决定，本次未核查，不能宣称已存在可利用的跨源漏洞，也不能假定有额外防护。原图视频不压缩增加浏览器存储、解码与磁盘成本。首次配置凭据和媒体、持续观察过期缓存与价目表、失败时清理媒体及提取输出均需人工。金额与耗时未知。由于合包带有本地目录处理和外部凭据通路，普通个性化用户宜先观察，待明确路由访问边界再试。 此版本把单价抽成 JSON 并支持峰谷，改善维护但没有生效时间轴；坏表会回退内置 flash 价，缺失价格字段会告警后按0，故“显示非零”也不是对账正确的保证。历史费用随当前价表重算，记录数持久化不代表历史金额不可变。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:245-269](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L245-L269)

当前表按裸模型正则、消息时段和effectiveFrom=0估价，没有历史价表版本。

<details>
<summary>查看原文（25行）</summary>

```text
 * 查价：给定"模型名 + 消息时间"，按正则匹配计价表，返回当时的单价。
 * 表里没有匹配的模型 → null（只计 tokens 不计费）。
 * @param model - 原始模型 id（可带 `provider/` 前缀）
 * @param timeMs - 该条消息发生的时间戳
 */
export function priceAt(model, timeMs) {
  const id = normalizeModel(model);
  const table = pricingTable();
  for (const entry of table.models) {
    // 正则全部非 /g，但保险起见重置 lastIndex
    entry.re.lastIndex = 0;
    if (!entry.re.test(id)) continue;
    const peak = entry.peak ? isPeak(table.peakWindows, timeMs) : false;
    const p = entry.peak ? (peak ? entry.peakPrice : entry.offPeakPrice) : entry.flatPrice;
    return {
      input: p.cacheMiss,
      cacheRead: p.cacheHit,
      output: p.output,
      peak,
      effectiveFrom: 0,
      label: entry.label
    };
  }
  return null;
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1341-1361](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1341-L1361)

提取入口直接处理参数，函数内未见方法与来源检查。

<details>
<summary>查看原文（21行）</summary>

```text
    () => ctx.webServer.register({
      kind: "exact",
      path: WORKSHOP_EXTRACT_ROUTE,
      // 流程：folder 参数 → 规整并校验路径 → 必须是存在的文件夹 → 跑脚本到输出目录 → 读产物列表；一个媒体都没有给 422
      handler: async (req, res) => {
        try {
          const raw = new URL(req.url ?? "/", "http://x").searchParams.get("folder") ?? "";
          const norm = normalizeWorkshopFolder(raw);
          if (norm.error === "empty") {
            sendJson(res, 400, {
              ok: false,
              error: "no-folder",
              message: "缺少 folder 参数（Wallpaper Engine 创意工坊条目文件夹的绝对路径）。"
            });
            return;
          }
          if (norm.error === "not-absolute") {
            sendJson(res, 400, { ok: false, error: "not-absolute", message: norm.message });
            return;
          }
          const folder = norm.folder;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1449-1468](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1449-L1468)

文件预览仅作词法路径约束，实际宿主访问控制需单独检查。

<details>
<summary>查看原文（20行）</summary>

```text
      handler: async (req, res) => {
        try {
          const url = new URL(req.url ?? "/", "http://x");
          const job = url.searchParams.get("job") ?? "";
          const name = url.searchParams.get("name") ?? "";
          if (!/^[0-9a-f]{16}$/.test(job) || name === "" || name.indexOf("\0") >= 0) {
            sendJson(res, 400, { ok: false, error: "bad-args", message: "参数不合法" });
            return;
          }
          const outDir = join(workshopOutRoot(), job);
          const target = join(outDir, name);
          const rel = relative(outDir, target);
          if (rel === "" || isAbsolute(rel) || rel.split(sep)[0] === "..") {
            sendJson(res, 400, { ok: false, error: "bad-path", message: "非法文件名" });
            return;
          }
          let data;
          try {
            data = readFileSync(target);
          } catch {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:139-154](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L139-L154)

单价字段无效被记0；不能把缺价静默看成免费。

<details>
<summary>查看原文（16行）</summary>

```text
/** 三价组：命中 / 未命中 / 输出。任意一项缺失按 0 处理并记一条告警。 */
function priceGroupOf(raw, where) {
  const src = raw !== null && typeof raw === "object" ? raw : {};
  const pick = (key) => {
    const n = toFinite(src[key]);
    if (!Number.isFinite(n)) {
      console.warn(`dsh-WallpaperAndCost: 计价表 ${where}.${key} 不是数字，按 0 处理`);
      return 0;
    }
    return n;
  };
  return { cacheHit: pick("cacheHit"), cacheMiss: pick("cacheMiss"), output: pick("output") };
}

// 把一份 pricing.json 的原始 JSON 编译成内部结构(正则只编译一次)
function compilePricing(raw) {
```

</details>

**依据 5 · 源码核查**：[pricing.json:1-12](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/pricing.json#L1-L12)

价表自述当前表热更新会重算历史，未提供有效期分段。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "$comment": "dsh-WallpaperAndCost 模型计价表（唯一数据源，代码里不再写死价格）。改完保存即可热生效：宿主按 mtime 重载，历史费用会按新表重算。",
  "$fields": {
    "peakWindows": "高峰时段（北京时，整点，[startHour, endHour)），周末全天按低谷计算；这段逻辑在代码里，窗口在这里配。",
    "models[].match": "模型 id 的正则（JS RegExp）。*** 不锚定首尾：只要 id 里包含 匹配子串 就算命中，所以不需要写 .* 包裹（写了也不会改变结果）。先按 '/' 切掉厂商前缀（deepseek-official/deepseek-v4-flash -> deepseek-v4-flash）再匹配。",
    "models[].flags": "正则标志，省略时默认 \"i\"（忽略大小写）；写成 \"\" 会变成大小写敏感。",
    "models[].label": "仅用于界面/日志展示。",
    "models[].peak": "是否区分峰谷。false = 只给 price 一组三个单价；true = 给 price.peak + price.offPeak 两组共六个单价。",
    "models[].price": "单价，单位 CNY / 百万 tokens。字段含义：cacheHit = 缓存命中输入，cacheMiss = 缓存未命中输入，output = 输出。",
    "models[].note": "备注，可省略。",
    "order": "规则按本文件顺序匹配，先命中先得；flash 在前、pro 在后（两种 id 不会互相误命中）。"
  },
```

</details>

#### 缺口

- 宿主全局鉴权、路由暴露范围与真实账单差异未知。
  **影响**：不能确认文件处理权限边界和计价准确性。
  **进一步探讨**：先核查宿主访问策略并对照脱敏供应商账单，分别检验估算口径。
- 原图视频资源与提取输出清理负担未测。
  **影响**：无法评价长期存储和解码成本。
  **进一步探讨**：用有授权的代表媒体测存储、播放与退出清理。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否拆出权限和计价来源边界？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的权限分层方案，将基础壁纸、供应商查询与服务器提取变成独立可启用能力。提取先由受控选择产生短期目录令牌，后续请求仅处理令牌绑定目录；计价在每个金额旁保存规则版本、供应商及估算/官方来源。推导来自不同验收和权限，不是把所有功能拆包本身视为创新。新增代价包括状态迁移、目录令牌生命周期与复杂提示。最小验证要求只启用壁纸时不挂服务端提取路由，未授权目录被拒绝，旧会话费用可重现同一规则；若配置负担超过权限收益或仍不能对账，应收窄方案。未实现，也不证明插件当前已隔离权限。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1341-1361](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L1341-L1361)

目录处理入口是令牌授权的推导基础。

<details>
<summary>查看原文（21行）</summary>

```text
    () => ctx.webServer.register({
      kind: "exact",
      path: WORKSHOP_EXTRACT_ROUTE,
      // 流程：folder 参数 → 规整并校验路径 → 必须是存在的文件夹 → 跑脚本到输出目录 → 读产物列表；一个媒体都没有给 422
      handler: async (req, res) => {
        try {
          const raw = new URL(req.url ?? "/", "http://x").searchParams.get("folder") ?? "";
          const norm = normalizeWorkshopFolder(raw);
          if (norm.error === "empty") {
            sendJson(res, 400, {
              ok: false,
              error: "no-folder",
              message: "缺少 folder 参数（Wallpaper Engine 创意工坊条目文件夹的绝对路径）。"
            });
            return;
          }
          if (norm.error === "not-absolute") {
            sendJson(res, 400, { ok: false, error: "not-absolute", message: norm.message });
            return;
          }
          const folder = norm.folder;
```

</details>

**依据 2 · 源码核查**：[lib/index.js:245-269](https://github.com/AppliedYuu/dsh-WallpaperAndCost/blob/72f6c05fc1eb348848d9ef5700ee68e7fcc5adae/lib/index.js#L245-L269)

当前表按裸模型正则、消息时段和effectiveFrom=0估价，没有历史价表版本。

<details>
<summary>查看原文（25行）</summary>

```text
 * 查价：给定"模型名 + 消息时间"，按正则匹配计价表，返回当时的单价。
 * 表里没有匹配的模型 → null（只计 tokens 不计费）。
 * @param model - 原始模型 id（可带 `provider/` 前缀）
 * @param timeMs - 该条消息发生的时间戳
 */
export function priceAt(model, timeMs) {
  const id = normalizeModel(model);
  const table = pricingTable();
  for (const entry of table.models) {
    // 正则全部非 /g，但保险起见重置 lastIndex
    entry.re.lastIndex = 0;
    if (!entry.re.test(id)) continue;
    const peak = entry.peak ? isPeak(table.peakWindows, timeMs) : false;
    const p = entry.peak ? (peak ? entry.peakPrice : entry.offPeakPrice) : entry.flatPrice;
    return {
      input: p.cacheMiss,
      cacheRead: p.cacheHit,
      output: p.output,
      peak,
      effectiveFrom: 0,
      label: entry.label
    };
  }
  return null;
}
```

</details>

#### 缺口

- 权限分层和金额来源展示未实现。
  **影响**：不能计入当前保障。
  **进一步探讨**：先验证路由按能力挂载和目录令牌生命周期，再检查用户理解。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
