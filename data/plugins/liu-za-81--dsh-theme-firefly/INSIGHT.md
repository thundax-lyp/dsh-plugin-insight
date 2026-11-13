# dsh-theme-firefly

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[22a172c](https://github.com/Liu-ZA-81/dsh-theme-firefly/tree/22a172cde2b8f4f55c4267c55d969e770d11d911)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Liu-ZA-81/dsh-theme-firefly) [![npm 30d 3,963](https://img.shields.io/static/v1?label=npm+30d&message=3%2C963&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-firefly) [![最新发布 2026-08-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-firefly)
<!-- END META -->

> **功能**：为 DeepSeek Harness Web 提供流萤主题配色、壁纸、开屏动画及声音。

> **亮点**：[Q01](#research-q01) 确认主题令牌、媒体和定制界面的实际接线，并将素材清单与服务端资源分开。

> **主要限制**：[Q02](#research-q02) 追到 URL 解码后绕过字符串前缀的路径，读取可越过素材白名单，满足前置条件时 DELETE 可移动壁纸目录的同前缀兄弟文件。上传也按磁盘预算整包缓冲，实际宿主访问边界待验。

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
  - [Q01 · 怎样从主题 bundle 到浏览器主题及壁纸？](#detail-section-11)
  - [Q02 · 壁纸写入有何资源限制，媒体路由能否将访问限制在允许目录内？](#detail-section-12)
  - [Q03 · 单机观察到什么程度可以试用，哪种改进能减少媒体导入代价？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望定制个人 DSH Web 界面的用户可使用固定配色和壁纸素材，按需观察壁纸导入。

保持宿主默认主题或只替换颜色可避免上传、额外媒体和持久文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题配置 | 应用流萤风格和交互 | 需要兼容 Web 主题服务 |
| 壁纸管理 | 导入及选择服务器素材 | 需要授权、磁盘和进程内存边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web 主题服务与生成客户端 | 是 | 主题注册与媒体界面 | 回到原主题 |
| webServer 和可写的 DSH_HOME | 上传时必需 | 提供媒体及持久文件 | 只观察内置配色及可用资源 |
| 目标部署的扩展路由授权 | 远程使用必需 | 限制上传、查看和删除 | 保持本机隔离 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 装载检查 | 用户核对 bundle 和客户端产物 | 主题注册且宿主可恢复原主题 |
| 观察 | 使用内置素材与小型公开壁纸 | 核对回执、刷新和实际落盘 |
| 退出 | 禁用并核对服务器状态 | 恢复原主题，单独核对媒体目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载素材及包资源，费用未知 | 检查 Web 服务与 profile | 打包字节未验 |
| 持续 | 媒体流、存储与上传内存 | 管理壁纸及回收文件 | 峰值和耗时未知 |
| 失败恢复 | 重试及清理资源未知 | 查看异常回执和服务器文件 | 部分落盘可能残留 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 主题界面 | 模板注册主题和启动媒体功能 | 实际包兼容与体验 |
| 壁纸导入 | 写服务器并回传 URL | 真实鉴权、内存和并发 |
| 关闭 | 宿主可移除插件行 | 主题及文件是否完全清理 |

> **思考**：[Q02](#research-q02) 追到 URL 解码后绕过字符串前缀的路径，读取可越过素材白名单，满足前置条件时 DELETE 可移动壁纸目录的同前缀兄弟文件。上传也按磁盘预算整包缓冲，实际宿主访问边界待验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 确认主题令牌、媒体和定制界面的实际接线，并将素材清单与服务端资源分开。

[Q01](#research-q01) 的构建映射可以审计，外置素材便于避免整包内联；[Q02](#research-q02) 的同步写入及内存缓冲限制高负载使用。 文件访问边界应使用路径段与实际路径核验，不能使用裸字符串前缀。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 追到 URL 解码后绕过字符串前缀的路径，读取可越过素材白名单，满足前置条件时 DELETE 可移动壁纸目录的同前缀兄弟文件。上传也按磁盘预算整包缓冲，实际宿主访问边界待验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只在本机隔离 profile 以合成素材观察，并按 [Q02](#research-q02) 检查越界拒绝；发现可达时保持默认主题，避免在常用或共享实例启用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可定位宿主路由、客户端构建和主题注册。目标安装、远程授权与资源开销待验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、build.cjs、lib/index.js、lib/client.template.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读固定模板、构建注入与壁纸服务，仅用通用 URL/path 复核路径变换；未执行构建、安装、插件、目标请求或宿主。
- 下一步：隔离验证主题注册、回到原主题、扩展路由权限、编码路径越界拒绝、小文件失败和禁用后的媒体状态。

**分析版本**

- **仓库**：[Liu-ZA-81/dsh-theme-firefly](https://github.com/Liu-ZA-81/dsh-theme-firefly)
- **版本号**：0.1.3（[固定提交 22a172c](https://github.com/Liu-ZA-81/dsh-theme-firefly/tree/22a172cde2b8f4f55c4267c55d969e770d11d911)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出流式临时文件和并发预算，用中断对照检查峰值和失败残留。

隔离验证主题注册、回到原主题、扩展路由权限、编码路径越界拒绝、小文件失败和禁用后的媒体状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .cjs | source | 1 | 175 | 148 | 28 | — |
| .md | source | 4 | 431 | — | — | 4576 |
| .js | source | 2 | 2330 | 2050 | 171 | — |
| .mjs | source | 1 | 213 | 161 | 48 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Liu-ZA-81/dsh-theme-firefly/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Liu-ZA-81/dsh-theme-firefly/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Liu-ZA-81/dsh-theme-firefly/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH Web 使用流萤主题时，外置媒体和服务器壁纸存储能带来怎样的定制体验，上传需要怎样的运行边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样从主题 bundle 到浏览器主题及壁纸？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这个主题面向希望在同一 DSH Web 使用定制背景与配色的个人用户。profile 插入主题包，宿主的 apply 挂出素材路由，客户端导出指向由模板及素材清单生成的 lib/client.js。模板在 ctx.effect 里注册色彩令牌并立即 setTheme，接着启用壁纸、音乐、粒子和音效。与只改颜色的基本主题相比，它将素材切换和主题激活一起交付。客户端产物在此提交未跟踪，构建脚本明确写出导出目标；尚无同版实际产物字节可复核。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:10-28](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/package.json#L10-L28)

宿主与客户端导出及 prepack 的构建路径。

<details>
<summary>查看原文（19行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "FAQ.md",
    "assets",
    "GIF",
    "music"
  ],
  "scripts": {
    "prepack": "node build.cjs --clean"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:38-48](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/package.json#L38-L48)

声明 profile 补丁和 Web 主题宿主依赖。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-theme"
      ]
    }
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:5-7](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/cordis.patch.yml#L5-L7)

固定包插入 UI 主题行。

```text
- insert:
    - id: ui-theme-firefly
      name: 'dsh-theme-firefly'
```

**依据 4 · 源码核查**：[build.cjs:147-175](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/build.cjs#L147-L175)

模板加素材 manifest 后写出客户端入口。

<details>
<summary>查看原文（29行）</summary>

```text
// ── 4) 注入 ──
let src = fs.readFileSync(templatePath, "utf8");
const manifestJson = JSON.stringify(manifest);
src = src.replace(
  /\/\*__FIREFLY_BG_MANIFEST_START__\*\/[\s\S]*?\/\*__FIREFLY_BG_MANIFEST_END__\*\//,
  `/*__FIREFLY_BG_MANIFEST_START__*/${manifestJson}/*__FIREFLY_BG_MANIFEST_END__*/`
);
src = src.replace(
  /\/\*__FIREFLY_GIF_START__\*\/[\s\S]*?\/\*__FIREFLY_GIF_END__\*\//,
  `/*__FIREFLY_GIF_START__*/${JSON.stringify(gifUri)}/*__FIREFLY_GIF_END__*/`
);
if (musicManifest.length > 0) {
  src = src.replace(
    /\/\*__FIREFLY_MUSIC_START__\*\/[\s\S]*?\/\*__FIREFLY_MUSIC_END__\*\//,
    `/*__FIREFLY_MUSIC_START__*/${JSON.stringify(musicManifest)}/*__FIREFLY_MUSIC_END__*/`
  );
}
if (emoteManifest.length > 0) {
  src = src.replace(
    /\/\*__FIREFLY_EMOTES_START__\*\/[\s\S]*?\/\*__FIREFLY_EMOTES_END__\*\//,
    `/*__FIREFLY_EMOTES_START__*/${JSON.stringify(emoteManifest)}/*__FIREFLY_EMOTES_END__*/`
  );
}
src = src.replace(
  /\/\*__FIREFLY_DEFAULT_COVER_START__\*\/[\s\S]*?\/\*__FIREFLY_DEFAULT_COVER_END__\*\//,
  `/*__FIREFLY_DEFAULT_COVER_START__*/${JSON.stringify(defaultCoverUri)}/*__FIREFLY_DEFAULT_COVER_END__*/`
);
fs.writeFileSync(clientPath, src);
console.log(`OK: built lib/client.js = ${(src.length / 1048576).toFixed(1)} MB`);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:295-298](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L295-L298)

宿主 apply 安装静态与上传路由。

```text
/** DSH 插件应用入口（DSH 调用）。 */
export function apply(ctx) {
  registerAssets(ctx);
}
```

**依据 6 · 源码核查**：[lib/client.template.js:1948-1996](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/client.template.js#L1948-L1996)

实际注册并激活主题，然后启动各界面能力。

<details>
<summary>查看原文（49行）</summary>

```text
		function apply(ctx) {
			ctx.effect(() => {
				// 1) 注入身份层样式
				if (!document.querySelector("style[data-firefly-theme]")) {
					const style = document.createElement("style");
					style.dataset.fireflyTheme = THEME_ID;
					style.textContent = identityCSS();
					document.head.appendChild(style);
				}

				// 2) 注册主题并激活
				try {
					ctx.theme.register({
						id: THEME_ID,
						colorScheme: "dark",
						tokens: TOKENS
					});
					ctx.theme.setTheme(THEME_ID);
				} catch (e) {
					console.error("dsh-theme-firefly register failed", e);
				}

				// 3) 锁深色（防止主题服务切回亮色把壁纸冲淡）
				document.documentElement.style.colorScheme = "dark";
				document.body.toggleAttribute("data-ds-dark-theme", true);
				const darkObserver = new MutationObserver(() => {
					document.documentElement.style.colorScheme = "dark";
					document.body.toggleAttribute("data-ds-dark-theme", true);
				});
				darkObserver.observe(document.body, { attributes: true, attributeFilter: ["data-ds-dark-theme"] });

				// 4) 右下角可拖动工具条（承载四个按钮，弹层跟随其位置）
				const dockState = startDock();
				const dock = dockState.el;

				// 4.5) 背景音乐（先挂载，按钮排最左）
				const stopMusic = startMusic(dock);

				// 4.6) 壁纸（图片/动态视频，可切换）
				const stopWallpaper = startWallpaper(dock);

				// 5) 开屏变身动画（每次加载播放）
				playTransformIntro();

				// 6) 萤火氛围
				const stopAmbience = startAmbience(dock);

				// 7) 声音设置（打字音效 + 壁纸音量，排最右）
				const stopType = startSoundPanel(dock);
```

</details>

**依据 7 · 作者声明**：[README.md:35-49](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/README.md#L35-L49)

作者的壁纸、导入与持久化范围。

<details>
<summary>查看原文（15行）</summary>

```text
## ✨ 功能特性

### 壁纸系统（图片 / 动态视频）

- 全屏 `cover` 铺底，界面容器半透明让壁纸透出；左暗右亮渐变遮罩保证聊天区可读
- 「**景**」按钮弹出常驻面板：
  - **类型**：动态（mp4）/ 静态（图片），各自独立记忆当前壁纸
  - **选择**：弹出缩略图网格（正方形预览、固定三行、可滚动），点卡片直接应用该壁纸
  - **移除**：在网格中勾选一张/多张后点「移除」——内置壁纸记为隐藏、运行时导入的壁纸从服务器删除（移入回收站，可恢复）
  - **随机**：勾选若干张后点「随机」——把它们设为随机轮换池并立即进入随机模式（不勾选则等于全部）
  - **随机间隔**：自定义分钟数（默认 5 分钟）
  - **＋ 添加壁纸**：从本机一次多选导入图片/视频（Ctrl/框选），同名同大小自动去重，立即生效（**服务器磁盘持久化**：写入 `$DSH_HOME/theme-firefly/wallpapers/`，刷新/重启/换浏览器都在；列表显示上传时的原始文件名）
  - **上传上限**：按服务器剩余磁盘空间动态计算（默认单文件最多占剩余空间 80%，底线 512MB），装得下就传，快满自动收紧
  - **默认壁纸**：首次安装（无历史记录）时优先展示 `assets/Default_wallpaper.png`
  - 选择面板点右上角「**—**」或再点「选择」收起；点「**确定**」收起设置面板，所有设置实时生效并持久化
```

</details>

#### 缺口

- 尚未核实实际发版客户端产物是否与模板及素材对应
  **影响**：源码可定位构建链但无法证明同版包加载成功
  **进一步探讨**：在隔离环境检查包内容、素材清单和主题切换

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 壁纸写入有何资源限制，媒体路由能否将访问限制在允许目录内？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

客户端以 raw body 上传文件并等成功 JSON，再把 URL 加入壁纸池。宿主使用整个请求的 chunks，写盘时 Buffer.concat 产生连续副本。按可用磁盘 80% 计算，但结果取和 512 MiB 的最大值，statfs 失败返回 1 GiB，因而该门槛不能代表进程内存预算，也未对所有并发请求作总限额。服务端扩展名检查不能判定实际文件字节格式。上传、删除与静态路径由同一注册处理器分发，所读代码没有在该处理器内实施请求身份隔离，实际可达性取决于宿主。壁纸数据和原名会落到 DSH_HOME，浏览器偏好及壁纸文件分属两处。

静态路径检查可以被绕开。处理器先用 URL 解析，再 decodeURIComponent；字面量的上级目录段可能已经被 URL 规整，编码斜杠 %2F 则留到解码才变成路径分隔符。以 /theme-firefly-assets/assets/..%2Fpackage.json 为例，解码后首段仍是 assets，后续 normalize 才把路径规整到插件根 package.json，仍通过 startsWith(ROOT)。两次上跳后如果目标落在插件根同名前缀的兄弟目录，字符串前缀也可继续通过。wallpapers 分支和 DELETE 使用的同类检查可接受 ../wallpapers-private/file.png 这类同前缀兄弟路径；DELETE 会把存在的普通目标文件重命名到壁纸回收目录，要求宿主进程可写。无公共前缀的任意路径不会由这个反例直接通过。读取或重命名还取决于宿主/代理是否把该 URL 交给处理器、鉴权和实际文件。通用 URL 与 path 函数用于核对字符串变换，未调用插件处理器、请求服务或操作文件。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:48-68](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L48-L68)

动态门槛及服务器持久目录。

<details>
<summary>查看原文（21行）</summary>

```text
const MAX_UPLOAD_RATIO = 0.8;      // 单文件最多占用剩余空间的 80%
const MIN_UPLOAD_LIMIT = 512 * 1024 * 1024; // 硬底线 512MB
const FALLBACK_UPLOAD_LIMIT = 1024 * 1024 * 1024; // statfs 失败回退 1GB

function uploadLimitBytes(dir) {
  try {
    const s = statfsSync(dir);
    const avail = s.bavail * s.bsize; // bavail=非 root 可用块数，bsize=块大小
    if (!(avail > 0)) return FALLBACK_UPLOAD_LIMIT;
    // 受 2^53 安全整数约束（实际磁盘远达不到），Math.floor 求整
    const bySpace = Math.floor(avail * MAX_UPLOAD_RATIO);
    return Math.max(bySpace, MIN_UPLOAD_LIMIT);
  } catch {
    return FALLBACK_UPLOAD_LIMIT;
  }
}

/** 用户壁纸存储目录：$DSH_HOME/theme-firefly/wallpapers/（DSH_HOME 缺失时回退 ~/.dsh）。 */
function wallpaperDir() {
  const base = process.env.DSH_HOME || join(os.homedir(), '.dsh');
  return join(base, 'theme-firefly', 'wallpapers');
```

</details>

**依据 2 · 源码核查**：[lib/index.js:105-156](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L105-L156)

注册路由和各动作分发。

<details>
<summary>查看原文（52行）</summary>

```text
export function registerAssets(ctx) {
  if (typeof ctx?.inject !== 'function') return false;
  let wired = false;
  ctx.inject(['webServer'], (wctx) => {
    const webServer = wctx?.get?.('webServer');
    if (!webServer?.register) return;
    try {
      webServer.register({
        kind: 'prefix',
        path: '/theme-firefly-assets',
        handler(req, res) {
          const url = new URL(req.url ?? '/', 'http://x');
          const pathname = decodeURIComponent(url.pathname);
          const rel = pathname.replace(/^\/theme-firefly-assets\//, '');
          const top = rel.split('/')[0];

          // ── POST 上传 ──
          if (req.method === 'POST' && rel === 'upload') {
            handleUpload(req, res);
            return;
          }

          // ── DELETE 删除用户壁纸 ──
          if (req.method === 'DELETE' && top === 'wallpapers') {
            handleDelete(req, res, rel);
            return;
          }

          // ── GET 用户壁纸清单 ──
          if (req.method === 'GET' && rel === 'wallpapers/list') {
            handleList(res);
            return;
          }

          // ── 目录白名单（wallpapers 在 wallpapersDir，其余在插件根）──
          if (!ALLOWED_DIRS.has(top)) {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('not found');
            return;
          }
          const base = top === 'wallpapers' ? wallpaperDir() : ROOT;
          // rel 含顶层目录（如 wallpapers/custom-x.mp4），wallpapers 时 base 已是目录，去掉顶层
          const relFile = top === 'wallpapers' ? rel.slice('wallpapers/'.length) : rel;
          const file = normalize(join(base, relFile));
          if (!file.startsWith(base) || !existsSync(file) || !statSync(file).isFile() || basename(file).startsWith('.trash-')) {
            res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
            res.end('not found');
            return;
          }
          const mime = MIME[extname(file).toLowerCase()] ?? 'application/octet-stream';
          res.writeHead(200, { 'content-type': mime, 'cache-control': 'no-cache' });
          createReadStream(file).pipe(res);
```

</details>

**依据 3 · 源码核查**：[lib/index.js:233-279](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L233-L279)

内存缓冲、扩展名校验和写入。

<details>
<summary>查看原文（47行）</summary>

```text
function handleUpload(req, res) {
  const chunks = [];
  let size = 0;
  let aborted = false;
  const dir = wallpaperDir();
  const limit = uploadLimitBytes(dir);
  req.on('data', (c) => {
    if (aborted) return;
    size += c.length;
    if (size > limit) { // 单文件上限：按磁盘剩余空间动态计算（uploadLimitBytes）
      aborted = true;
      const mb = Math.round(limit / 1024 / 1024);
      res.writeHead(413, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'file too large', limit, limitMb: mb }));
      // 不 req.destroy()：粗暴断连会在 DSH 反代的 keep-alive 连接池留下半死连接，
      // 后续请求复用它会 EPIPE/408/502（实测：214MB 超限 destroy 后，反代对后续上传全挂）。
      // 用 drain 丢弃剩余 body，等客户端发完再自然关闭，保持连接池健康。
      req.on('data', () => {});
      req.resume();
      return;
    }
    chunks.push(c);
  });
  req.on('end', () => {
    if (aborted) return;
    // 文件名从 ?name= 查询参数取（客户端 fetch 时带上）
    const url = new URL(req.url ?? '/', 'http://x');
    const name = decodeURIComponent(url.searchParams.get('name') ?? 'wallpaper');
    const ext = extname(name).toLowerCase();
    if (!ALLOWED_UPLOAD_EXT.has(ext)) {
      res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'unsupported type: ' + ext }));
      return;
    }
    try {
      const id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
      const file = join(dir, id + ext);
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, Buffer.concat(chunks));
      const kind = ext === '.mp4' ? 'video' : 'image';
      // 保存原始文件名（去扩展名）到 labels 映射，使列表能显示用户上传时的名字而非 custom-xxx
      const label = name.replace(/\.[^.]+$/, '');
      const map = loadLabels();
      map[id] = label;
      saveLabels(map); // 注意：先清空 chunks 引用，避免大文件期间持有内存副本
      chunks.length = 0;
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
```

</details>

**依据 4 · 源码核查**：[lib/client.template.js:799-826](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/client.template.js#L799-L826)

上传超时及成功才入池。

<details>
<summary>查看原文（28行）</summary>

```text
						const key = file.name + ":" + file.size;
						if (customKeys.has(key)) continue; // 同名同大小视为重复，跳过
						const kind = file.type.startsWith("video") ? "video" : "image";
						// 上传到服务器磁盘（raw body + ?name= 文件名），成功后用服务器 URL。
						// 注意：customKeys.add 在成功后才执行——失败不占位，用户可重试同一文件。
						let up;
						let respStatus = 0;
						try {
							// 120s 超时中断：大文件(数百MB)上传若因网络/后端卡住，不再无限挂起
							const ctrl = new AbortController();
							const timer = setTimeout(() => ctrl.abort(), 120000);
							try {
								const resp = await fetch(WALLPAPER_API + "/upload?name=" + encodeURIComponent(file.name), {
									method: "POST",
									body: file,
									signal: ctrl.signal,
								});
								respStatus = resp.status;
								up = await resp.json();
							} finally {
								clearTimeout(timer);
							}
						} catch (e) {
							up = null;
						}
						if (!up || !up.ok) { failed++; continue; } // 上传失败：提示在下方统一给出
						customKeys.add(key);
						const item = { id: up.id, kind: up.kind || kind, data: up.url, label: up.label || file.name, custom: true };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:167-195](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L167-L195)

DELETE 先对路径做字符串前缀判断，再将目标移动到壁纸回收目录。

<details>
<summary>查看原文（29行）</summary>

```text
/** 删除用户壁纸文件（仅允许 wallpapers/ 目录内）。 */
function handleDelete(req, res, rel) {
  try {
    const dir = wallpaperDir();
    const relFile = rel.startsWith('wallpapers/') ? rel.slice('wallpapers/'.length) : rel;
    const file = normalize(join(dir, relFile));
    // 仅允许 wallpapers/ 目录内的常规文件（排除 .trash-* 回收文件自身）
    if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile() || basename(file).startsWith('.trash-')) {
      res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'bad file' }));
      return;
    }
    if (!existsSync(file)) {
      res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'not found' }));
      return;
    }
    // 用 rename 到回收命名（.trash 前缀），保留可恢复性而非直接删
    const trash = join(dir, '.trash-' + Date.now().toString(36) + '-' + rel.replace(/[/\\]/g, '_'));
    mkdirSync(dir, { recursive: true });
    renameSync(file, trash);
    // 同步清理名字映射，避免列表残留已删壁纸的 label 记录
    const id = basename(file).replace(/\.[^.]+$/, '');
    const map = loadLabels();
    if (map[id]) { delete map[id]; saveLabels(map); }
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
```

</details>

#### 缺口

- 宿主和代理对编码斜杠、扩展路由授权及请求大小的真实处理未知
  **影响**：源码处理器的目录检查已可绕开，目标部署能否读取或重命名还取决于这些前置条件和文件权限
  **进一步探讨**：在隔离宿主用合成文件分别测试未经授权、编码斜杠、同前缀兄弟路径及删除回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 单机观察到什么程度可以试用，哪种改进能减少媒体导入代价？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先在本机隔离 profile 验证生成的客户端、静态素材和宿主主题服务，使用内置媒体观察前端，然后核对小型公开壁纸的回执、刷新和禁用。保留原有主题可恢复使用；主题禁用不证明服务器壁纸清理，路径和回收命名应单独清点。需要远程共享或大文件前，先验证请求鉴权和资源开销。可以比较有全局并发额度的流式临时文件与当前整包缓冲，保留错误后的清理与原子换名。若峰值没有下降、失败残留增加或小文件更慢到影响使用，则不能支持替换。

启用媒体路由前，要使用合成的同前缀兄弟目录核对编码路径被拒绝。出现越界时保留默认主题，避免在常用或共享实例启用该版本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-28](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/package.json#L17-L28)

素材范围及生成客户端的 prepack。

<details>
<summary>查看原文（12行）</summary>

```text
  "files": [
    "lib",
    "cordis.patch.yml",
    "README.md",
    "FAQ.md",
    "assets",
    "GIF",
    "music"
  ],
  "scripts": {
    "prepack": "node build.cjs --clean"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:171-195](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L171-L195)

删除会改名回收并更新标签，失败有响应。

<details>
<summary>查看原文（25行）</summary>

```text
    const relFile = rel.startsWith('wallpapers/') ? rel.slice('wallpapers/'.length) : rel;
    const file = normalize(join(dir, relFile));
    // 仅允许 wallpapers/ 目录内的常规文件（排除 .trash-* 回收文件自身）
    if (!file.startsWith(dir) || !existsSync(file) || !statSync(file).isFile() || basename(file).startsWith('.trash-')) {
      res.writeHead(400, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'bad file' }));
      return;
    }
    if (!existsSync(file)) {
      res.writeHead(404, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: 'not found' }));
      return;
    }
    // 用 rename 到回收命名（.trash 前缀），保留可恢复性而非直接删
    const trash = join(dir, '.trash-' + Date.now().toString(36) + '-' + rel.replace(/[/\\]/g, '_'));
    mkdirSync(dir, { recursive: true });
    renameSync(file, trash);
    // 同步清理名字映射，避免列表残留已删壁纸的 label 记录
    const id = basename(file).replace(/\.[^.]+$/, '');
    const map = loadLabels();
    if (map[id]) { delete map[id]; saveLabels(map); }
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
```

</details>

**依据 3 · 源码核查**：[lib/index.js:267-289](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/lib/index.js#L267-L289)

写文件后保存标签，错误可能发生在写入之后。

<details>
<summary>查看原文（23行）</summary>

```text
    try {
      const id = 'custom-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);
      const file = join(dir, id + ext);
      mkdirSync(dir, { recursive: true });
      writeFileSync(file, Buffer.concat(chunks));
      const kind = ext === '.mp4' ? 'video' : 'image';
      // 保存原始文件名（去扩展名）到 labels 映射，使列表能显示用户上传时的名字而非 custom-xxx
      const label = name.replace(/\.[^.]+$/, '');
      const map = loadLabels();
      map[id] = label;
      saveLabels(map); // 注意：先清空 chunks 引用，避免大文件期间持有内存副本
      chunks.length = 0;
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        ok: true,
        id,
        kind,
        label,
        url: '/theme-firefly-assets/wallpapers/' + encodeURIComponent(id + ext),
      }));
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: false, error: String(e?.message ?? e) }));
```

</details>

**依据 4 · 作者声明**：[README.md:37-49](https://github.com/Liu-ZA-81/dsh-theme-firefly/blob/22a172cde2b8f4f55c4267c55d969e770d11d911/README.md#L37-L49)

作者的导入和回收描述。

<details>
<summary>查看原文（13行）</summary>

```text
### 壁纸系统（图片 / 动态视频）

- 全屏 `cover` 铺底，界面容器半透明让壁纸透出；左暗右亮渐变遮罩保证聊天区可读
- 「**景**」按钮弹出常驻面板：
  - **类型**：动态（mp4）/ 静态（图片），各自独立记忆当前壁纸
  - **选择**：弹出缩略图网格（正方形预览、固定三行、可滚动），点卡片直接应用该壁纸
  - **移除**：在网格中勾选一张/多张后点「移除」——内置壁纸记为隐藏、运行时导入的壁纸从服务器删除（移入回收站，可恢复）
  - **随机**：勾选若干张后点「随机」——把它们设为随机轮换池并立即进入随机模式（不勾选则等于全部）
  - **随机间隔**：自定义分钟数（默认 5 分钟）
  - **＋ 添加壁纸**：从本机一次多选导入图片/视频（Ctrl/框选），同名同大小自动去重，立即生效（**服务器磁盘持久化**：写入 `$DSH_HOME/theme-firefly/wallpapers/`，刷新/重启/换浏览器都在；列表显示上传时的原始文件名）
  - **上传上限**：按服务器剩余磁盘空间动态计算（默认单文件最多占剩余空间 80%，底线 512MB），装得下就传，快满自动收紧
  - **默认壁纸**：首次安装（无历史记录）时优先展示 `assets/Default_wallpaper.png`
  - 选择面板点右上角「**—**」或再点「选择」收起；点「**确定**」收起设置面板，所有设置实时生效并持久化
```

</details>

#### 缺口

- 未在目标宿主验证启用、关闭及服务器残留
  **影响**：限制采用建议
  **进一步探讨**：检查完整装卸、异常后的目录状态和无登录访问

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
