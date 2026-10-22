# dsh-boo550wt-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[fbe2189](https://github.com/456erddgr/dsh-boo550wt-animation/tree/fbe21895707437df844ef3f928ae42783a4781b5)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation)
<!-- END META -->

> **实现功能**：在 DSH 启动就绪前展示视频、图片、网页或小游戏，并提供设置与素材管理。

> **核心亮点**：相对启动后再弹层，它把遮罩挂载时机提前到 ready 结算前，并把媒体服务、设置、上传和六款小游戏组合为一套离线可配入口。贡献是启动交接和素材生命周期的工程组合；内置 three.js 场景主要归属上游 earth-migration，不能算本插件原创渲染引擎。 参见[Q03](#research-q03)。

> **风险与缺陷**：核心价值依赖遮罩绝不把正常界面困住。自定义网页可能不发完成消息，视频可能受自动播放和解码影响，WebGL/25MB 资源会增加启动负担；虽然有 Esc、按钮、错误降级和硬上限，真实机器上的焦点、无障碍、低端 GPU 与异常内容恢复未验证。允许绝对路径和远端 URL 还扩大本地文件与网络边界。 参见[Q04](#research-q04)。

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
  - [Q01 · 可定制启动遮罩适合谁，合格退出是什么？](#detail-section-11)
  - [Q02 · 遮罩、媒体路由、上传和设置如何协作？](#detail-section-12)
  - [Q03 · dsh-boo550wt-animation 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 启动阻塞、外部网页与大素材会带来什么风险？](#detail-section-14)
  - [Q05 · dsh-boo550wt-animation 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 视觉体验的首次、持续和故障成本如何计量？](#detail-section-16)
  - [Q07 · 上传原子性、路径防护和退出兜底是否可借鉴？](#detail-section-17)
  - [Q08 · 能否把装饰遮罩改成有预算的启动健康门？](#detail-section-18)
  - [Q09 · dsh-boo550wt-animation 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向愿意用品牌片头、静态图、网页或小游戏定制 DSH 启动体验的桌面用户。输入是模式、媒体或网页地址、时长和声音设置；合格结果是在应用后台正常加载时先显示遮罩，并能在播放结束、通关、Esc、按钮、错误或硬上限触发后可靠交还界面。简单替代是宿主原生启动页或不加遮罩。

参见[Q01](#research-q01)。

基线是不增加启动遮罩，或使用固定宿主 splash；基线缺少可配内容但不会为装饰承担额外关键路径和素材边界。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 四类启动内容 | 视频、图片、网页或小游戏 | 网页和媒体失败必须受硬上限约束 |
| 六款小游戏 | 以通关作为交还信号 | iframe 会占键盘，按钮需始终可用 |
| 素材管理 | 上传、去重、切换与删除 | 上传上限 512MB，绝对路径扩大边界 |
| 设置与预览 | 修改时长、声音、淡出并临时预览 | Host 配置下次重启生效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| desktop profile 与完全重启 | 必需 | 加载 Host 注入和路由 | 设置存在但启动遮罩不生效 |
| webServer/index-inject 与 settings slot | 必需 | 早期遮罩和设置面板 | 接口漂移会丢入口或路由 |
| 媒体文件/网页/WebGL | 按模式必需 | 提供展示内容 | 解码、网络或 GPU 失败时应兜底退出 |
| 用户设置的 maxSeconds | 效果必需 | 限制最坏阻塞时间 | 过大会放大卡住影响 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 用户加入 desktop profile 并重启 | 设置项出现；否则核 bundle |
| 配置 | 选择模式、素材、声音与上限并预览 | 预览可退出且保存成功 |
| 启动 | Host 先注入遮罩，后台渲染应用 | 内容正常结束或用户跳过 |
| 故障/退出 | 错误或上限调用 finish，必要时删坏素材或卸载 | 主界面恢复可操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 素材存储、可能 25MB WebGL 资产；金额未知 | 安装重启、制作/上传和调参 | 512MB 上传上限，工时未知 |
| 持续使用 | 每次启动解码、I/O、GPU/网络 | 等待或主动跳过 | 不同模式资源峰值未知 |
| 失败恢复 | 临时/坏素材占用与重试 | Esc/按钮、排错、删素材或卸载 | 卡死率与恢复分钟数未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 首屏一致性 | ready 前注入避免先闪主界面再覆盖 | 真实设备首帧与闪烁率未知 |
| 内容选择 | 四模式、六游戏、上传和绝对路径已实现 | 可访问性与长期新鲜度未知 |
| 失败交还 | Esc、按钮、错误与硬上限多路兜底 | 焦点和低端 GPU 下未实测 |

> **思考**：核心价值依赖遮罩绝不把正常界面困住。自定义网页可能不发完成消息，视频可能受自动播放和解码影响，WebGL/25MB 资源会增加启动负担；虽然有 Esc、按钮、错误降级和硬上限，真实机器上的焦点、无障碍、低端 GPU 与异常内容恢复未验证。允许绝对路径和远端 URL 还扩大本地文件与网络边界。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对启动后再弹层，它把遮罩挂载时机提前到 ready 结算前，并把媒体服务、设置、上传和六款小游戏组合为一套离线可配入口。贡献是启动交接和素材生命周期的工程组合；内置 three.js 场景主要归属上游 earth-migration，不能算本插件原创渲染引擎。 参见[Q03](#research-q03)。

相对启动后再弹层，它把遮罩挂载时机提前到 ready 结算前，并把媒体服务、设置、上传和六款小游戏组合为一套离线可配入口。贡献是启动交接和素材生命周期的工程组合；内置 three.js 场景主要归属上游 earth-migration，不能算本插件原创渲染引擎。 参见[Q03](#research-q03)。

流式上传、临时文件、内容摘要去重、白名单文件名和 rename 发布降低半文件与穿越风险；媒体 Range/HEAD 适配浏览器解码，完成路径集中到 finish/guard 是可借鉴的退出设计。代价是注入脚本、Host 路由、设置 UI 与大量 vendored WebGL 资产形成宽维护面，且网页/iframe消息的来源约束需要实际审计与验证。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心价值依赖遮罩绝不把正常界面困住。自定义网页可能不发完成消息，视频可能受自动播放和解码影响，WebGL/25MB 资源会增加启动负担；虽然有 Esc、按钮、错误降级和硬上限，真实机器上的焦点、无障碍、低端 GPU 与异常内容恢复未验证。允许绝对路径和远端 URL 还扩大本地文件与网络边界。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。仅适合明确重视启动展示、能接受每次启动延迟且愿意固定本地素材的用户；先用 image 模式和短硬上限验证 Esc/按钮/错误交还，远端网页和 3D 模式在低端设备与敏感环境中暂缓。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认了 ready 前遮罩、媒体路由、流式上传与多路退出兜底；不同焦点、坏媒体和低端 GPU 下能否按 maxSeconds 交还主界面尚未运行，启动健康门仍是未验证推演，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/inject.js、lib/upload.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、配置、注入、Host 路由、媒体和上传关键源码；不审计全部 vendored three.js/earth-migration。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：优先做五类故障注入和 30 次冷启动资源测量；任何退出路径超过 maxSeconds、主界面不可操作或上传残留 .tmp 即停止采用。

**分析版本**

- **仓库**：[456erddgr/dsh-boo550wt-animation](https://github.com/456erddgr/dsh-boo550wt-animation)
- **版本号**：1.4.0（[固定提交 fbe2189](https://github.com/456erddgr/dsh-boo550wt-animation/tree/fbe21895707437df844ef3f928ae42783a4781b5)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把遮罩改成“有硬预算的启动健康门”：只展示可取消的资源预热与诊断进度，超过例如 2 秒立即交还主界面并把剩余工作转后台。它可能保留品牌体验同时降低启动阻塞，但需防止把装饰插件升级为虚假的健康信号。 参见[Q08](#research-q08)。

优先做五类故障注入和 30 次冷启动资源测量；任何退出路径超过 maxSeconds、主界面不可操作或上传残留 .tmp 即停止采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 3034 | 2468 | 352 | — |
| .md | source | 2 | 186 | — | — | 2518 |
| .mjs | source | 5 | 1478 | 1226 | 151 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+created%3A2026-09-22T16%3A02%3A08.556Z..2026-10-22T16%3A02%3A08.556Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/456erddgr/dsh-boo550wt-animation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A02%3A08.556Z..2026-10-22T16%3A02%3A08.556Z)



统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 fbe21895707437df844ef3f928ae42783a4781b5 上判断 dsh-boo550wt-animation 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可定制启动遮罩适合谁，合格退出是什么？

**研究主题**：场景与需求

#### 完整回答

面向愿意用品牌片头、静态图、网页或小游戏定制 DSH 启动体验的桌面用户。输入是模式、媒体或网页地址、时长和声音设置；合格结果是在应用后台正常加载时先显示遮罩，并能在播放结束、通关、Esc、按钮、错误或硬上限触发后可靠交还界面。简单替代是宿主原生启动页或不加遮罩。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 遮罩、媒体路由、上传和设置如何协作？

**研究主题**：功能与机制

#### 完整回答

Host 通过 webserver/index-inject 在启动 ready 前注入样式与脚本，并在 /boot-animation 下提供配置、媒体 Range/HEAD、小游戏、网页代理与上传管理；客户端 settings.section 读写配置。上传流先写 .tmp、计算摘要去重，再 rename 发布；遮罩用多个完成信号和 maxSeconds 守卫退出。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-79](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/index.js#L76-L79)

Host 入口注册注入、配置和媒体路由。

```text
export function apply(ctx, config) {
  const defaults = normalizeConfig(config);
  if (defaults.enabled === false) {
    ctx.logger?.("boot-animation").info?.("disabled by config");
```

**依据 2 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-boo550wt-animation 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对启动后再弹层，它把遮罩挂载时机提前到 ready 结算前，并把媒体服务、设置、上传和六款小游戏组合为一套离线可配入口。贡献是启动交接和素材生命周期的工程组合；内置 three.js 场景主要归属上游 earth-migration，不能算本插件原创渲染引擎。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-79](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/index.js#L76-L79)

Host 入口注册注入、配置和媒体路由。

```text
export function apply(ctx, config) {
  const defaults = normalizeConfig(config);
  if (defaults.enabled === false) {
    ctx.logger?.("boot-animation").info?.("disabled by config");
```

**依据 2 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动阻塞、外部网页与大素材会带来什么风险？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心价值依赖遮罩绝不把正常界面困住。自定义网页可能不发完成消息，视频可能受自动播放和解码影响，WebGL/25MB 资源会增加启动负担；虽然有 Esc、按钮、错误降级和硬上限，真实机器上的焦点、无障碍、低端 GPU 与异常内容恢复未验证。允许绝对路径和远端 URL 还扩大本地文件与网络边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

**依据 2 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

#### 缺口

- 不同浏览器焦点、自动播放、iframe 与低端 GPU 条件下所有退出路径是否都能按上限交还界面
  **影响**：任何卡住都会让纯装饰能力反而阻断核心应用
  **进一步探讨**：在视频坏编码、404 网页、不发消息 iframe、WebGL 失败和键盘焦点被吃掉时测 Esc、按钮、错误与硬上限的交还矩阵

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-boo550wt-animation 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 desktop profile、Host 重启、webServer/index-inject 与 settings slot；不同模式分别依赖浏览器媒体、文件路径、网络网页或 WebGL。失败时应由 0.9 秒错误放弃、立即跳过按钮或 maxSeconds 解锁；上传失败还需清临时文件，卸载不自动说明是否清用户素材。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-79](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/index.js#L76-L79)

Host 入口注册注入、配置和媒体路由。

```text
export function apply(ctx, config) {
  const defaults = normalizeConfig(config);
  if (defaults.enabled === false) {
    ctx.logger?.("boot-animation").info?.("disabled by config");
```

**依据 2 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 视觉体验的首次、持续和故障成本如何计量？

**研究主题**：效果与总成本

#### 完整回答

合格任务是一次启动遮罩在预算内退出并交还可操作界面。首次成本包括安装重启、素材制作/上传和参数调试；持续成本是每次启动的等待、解码、I/O、GPU/内存和可能网络访问；失败恢复包括强制跳过、排查坏媒体及清理上传。作者截图和自检说明不能给出不同机器的 P95 交还时延或卡死率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

**依据 2 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

#### 缺口

- 各模式对冷启动 P50/P95、CPU/GPU 峰值、内存、磁盘 I/O 和失败恢复时间的影响
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：在同一机器做空白基线及 video/image/web/game 各 30 次冷启动，记录 ready 到可操作时延、资源峰值、超时率和人工干预

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 上传原子性、路径防护和退出兜底是否可借鉴？

**研究主题**：工程质量与复用

#### 完整回答

流式上传、临时文件、内容摘要去重、白名单文件名和 rename 发布降低半文件与穿越风险；媒体 Range/HEAD 适配浏览器解码，完成路径集中到 finish/guard 是可借鉴的退出设计。代价是注入脚本、Host 路由、设置 UI 与大量 vendored WebGL 资产形成宽维护面，且网页/iframe消息的来源约束需要实际审计与验证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-79](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/index.js#L76-L79)

Host 入口注册注入、配置和媒体路由。

```text
export function apply(ctx, config) {
  const defaults = normalizeConfig(config);
  if (defaults.enabled === false) {
    ctx.logger?.("boot-animation").info?.("disabled by config");
```

**依据 2 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否把装饰遮罩改成有预算的启动健康门？

**研究主题**：新假设与验证

#### 完整回答

可把遮罩改成“有硬预算的启动健康门”：只展示可取消的资源预热与诊断进度，超过例如 2 秒立即交还主界面并把剩余工作转后台。它可能保留品牌体验同时降低启动阻塞，但需防止把装饰插件升级为虚假的健康信号。

#### 证据与依据

**依据 1 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

**依据 2 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

#### 缺口

- 健康门是否能在不延长关键路径的情况下提供可信状态
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：原型只允许 2 秒前台预算，比较无插件与健康门的可操作时延、误报率和用户跳过率；P95 增加超过 10% 即否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-boo550wt-animation 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。仅适合明确重视启动展示、能接受每次启动延迟且愿意固定本地素材的用户；先用 image 模式和短硬上限验证 Esc/按钮/错误交还，远端网页和 3D 模式在低端设备与敏感环境中暂缓。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-8](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/README.md#L5-L8)

作者定义四模式与结束方式。

```text
支持四种模式，全部可以在设置面板里改：

| 模式 | 内容 | 结束方式 |
| --- | --- | --- |
```

**依据 2 · 源码核查**：[lib/inject.js:228-231](https://github.com/456erddgr/dsh-boo550wt-animation/blob/fbe21895707437df844ef3f928ae42783a4781b5/lib/inject.js#L228-L231)

遮罩以定时守卫集中触发 finish。

```text
    guard = setTimeout(finish, Math.round(seconds * 1000) + CONFIG.graceMs);
  }

  function onMediaError() {
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
