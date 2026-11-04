# dsh-madara-pixel-theme

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2eb032c](https://github.com/BossKrabs/product/tree/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为 DSH Web 界面提供宇智波斑像素主题、字体及启动动画。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将像素视觉与设置面板集成到宿主。

> **主要限制**：[Q03](#research-q03) 首页样式依赖具体哈希类名，进度条只是装饰；宿主版本兼容未验证。

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
  - [Q01 · 主题提供什么，适合谁？](#detail-section-11)
  - [Q02 · 客户端如何覆盖和恢复主题？](#detail-section-12)
  - [Q03 · 启动动画和兼容声明的边界是什么？](#detail-section-13)
  - [Q04 · 安装、构建与退出有哪些条件？](#detail-section-14)
  - [Q05 · 兼容性检查能否降低样式失效？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向希望定制 DSH Web 界面的用户。

相对于 DSH 原有明暗主题，增加人物像素视觉、字体和可跳过动画，不增加业务功能。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题和字体 | 自定义配色和字体 | 依赖宿主主题 API 与 CSS |
| 人物背景 | 首页像素风格 | 选择器可能随宿主变化 |
| 启动动画 | 可跳过的装饰性开场 | 进度不是加载状态 |
| 设置 | 分别启停效果 | 本地偏好与恢复未运行验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH 0.2.1-rc.2 Web 主题与槽位 | 客户端必需 | 覆盖样式及设置 | 其他版本需验证 |
| 浏览器 localStorage、dialog | 偏好与动画条件 | 保存偏好及展示 | 无法使用时体验取决宿主 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主版本和许可 | 保留原主题设置 |
| 使用 | 用户启用并调整各项视觉效果 | 核对界面及动画可跳过 |
| 退出 | 用户关闭并检查恢复 | 恢复明暗主题及检查偏好 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地资源，费用未知 | 检查版本及许可 | 包与构建未测 |
| 持续使用 | 样式与动画开销未知 | 调整设置 | 性能未测 |
| 失败恢复 | 资源成本未知 | 禁用并检查外观 | 冲突恢复未测 |
| 退出 | 本地数据成本低但未测 | 检查偏好残留 | 自动清理未确认 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 像素主题 | 客户端样式与 token | 各平台实际显示 |
| 动画 | 可跳过与减少动态代码 | 无障碍及浏览器效果 |
| 恢复 | 清理覆盖和恢复偏好代码 | 多主题冲突场景 |

> **思考**：[Q03](#research-q03) 首页样式依赖具体哈希类名，进度条只是装饰；宿主版本兼容未验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将像素视觉与设置面板集成到宿主。

[Q02](#research-q02) 在 effect 内安装并清理覆盖，恢复先前明暗偏好；[Q03](#research-q03) 依赖宿主 DOM。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 首页样式依赖具体哈希类名，进度条只是装饰；宿主版本兼容未验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 确认版本和许可，在隔离 profile 检查外观冲突及退出。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持本地客户端主题与可关闭动画；桌面、Web、构建产物、无障碍和跨版本兼容未实际验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-madara-pixel-theme/README.md、packages/dsh-madara-pixel-theme/package.json、packages/dsh-madara-pixel-theme/index.js、packages/dsh-madara-pixel-theme/client.template.js、packages/dsh-madara-pixel-theme/boot.js、packages/dsh-madara-pixel-theme/build.cjs 及固定范围 inventory；组件：packages/dsh-madara-pixel-theme。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查子包清单、入口、模板、构建和动画；未逐项审计 CSS、素材版权或独立桌宠。
- 下一步：静态阅读固定源码，未运行构建、测试、宿主或浏览器；材料解析器报模板占位解析错误，未外推到生成客户端。

**分析版本**

- **仓库**：[BossKrabs/product](https://github.com/BossKrabs/product)
- **版本号**：1.0.0（[固定提交 2eb032c](https://github.com/BossKrabs/product/tree/2eb032cb14be44c35501757fd4f3f25449730a17)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设检测宿主界面或使用稳定槽位可减少静默失效；尚未实现。

静态阅读固定源码，未运行构建、测试、宿主或浏览器；材料解析器报模板占位解析错误，未外推到生成客户端。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 37 | — | — | 643 |
| .js | source | 4 | 334 | 324 | 12 | — |
| .cjs | source | 1 | 7 | 7 | 2 | — |
| .cjs | test | 1 | 34 | 34 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对像素主题的宿主接线、动态效果和兼容性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题提供什么，适合谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH Web 界面使用宇智波斑像素风格的用户可使用此主题；作者描述深蓝暗红配色、中文像素字体、人物背景和约三秒启动动画，设置项可分别关闭。包声明 Web Client 和主题、槽位注入，Host 入口为空函数，功能主要在客户端，不应与同仓库桌宠组件混同。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-madara-pixel-theme/README.md:1-19](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/README.md#L1-L19)

作者说明。

<details>
<summary>查看原文（19行）</summary>

````text
# 宇智波斑像素主题

深蓝、暗红与金色的 Harness 操作界面，中文像素字体，以及写轮眼旋转的约三秒启动动画。主题默认启用像素字体、首页人物背景和启动动画，每项均可独立关闭。

## 安装

已验证 DeepSeek Harness 0.2.1-rc.2 的 Windows 官方桌面端。通过应用的「插件 → 添加插件」选择本包的完整 .tgz 路径，安装后按提示启用。浏览器 WebUI 可执行：

```sh
dsh plugin --profile web add /path/to/dsh-madara-pixel-theme-1.0.0.tgz
```

在「设置 → 通用」中的「宇智波斑 · 像素主题」调整主题、首页人物与点阵、像素字体和启动动画。启动动画支持 Esc 跳过、重播、系统减少动态设置；其进度条为视觉效果，不能代表后台加载进度。关闭主题或卸载时移除样式与颜色覆盖，并恢复启用前的明暗模式。

主题和其他外观插件都可能覆盖界面颜色，建议一次只启用一个外观主题。本版本面向 Harness 0.2.1-rc.2 的界面结构；其他版本需重新验证。

## 源码与授权

运行时已包含编译好的 client.js，安装不运行构建脚本。源码执行 `node build.cjs` 可重新构建。所有资源本地加载；不联网下载字体，不读取会话或账号凭据。详见 LICENSE、ASSET-NOTICE.md 与 licenses/。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-theme/package.json:20-26](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/package.json#L20-L26)

固定版本代码。

```text
  "name": "dsh-madara-pixel-theme",
  "description": "宇智波斑像素主题：深蓝暗红配色、中文像素字体和可跳过的写轮眼启动动画。",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json"
  },
```

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-theme/package.json:41-51](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/package.json#L41-L51)

固定版本代码。

<details>
<summary>查看原文（11行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-madara-pixel-theme/index.js:1-2](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/index.js#L1-L2)

固定版本代码。

```text
export const name='madara-pixel-theme';
export function apply() {}
```

#### 缺口

- 未运行桌面或 Web 界面，不能证实显示效果
  **影响**：运行效果未知
  **进一步探讨**：在目标版本检查设置与界面。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 客户端如何覆盖和恢复主题？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端读取 localStorage 布尔偏好，默认启用主题、纹理、像素字体和动画；启用时保存此前 theme preference、注册 token 覆盖，写入 body data 属性并切暗色。设置面板挂在 settings.general.item；停用或 effect 清理移除覆盖、样式和属性并尝试恢复先前明暗偏好。恢复逻辑与其他主题同时更改时的最终表现未验证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-theme/client.template.js:8-30](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/client.template.js#L8-L30)

固定版本代码。

<details>
<summary>查看原文（23行）</summary>

```text
    const KEY='dsh.madara-pixel-theme.preferences.v1';
    function apply(ctx){
      const defaults={enabled:true,texture:true,pixelFont:true,bootAnimation:true};
      let prefs={...defaults};
      try {const saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(const key of Object.keys(defaults))if(typeof saved[key]==='boolean')prefs[key]=saved[key];}catch{}
      const subscribers=new Set();
      let removeTokens=null,removeBoot=null,disposed=false,previousTheme=null,autoTimer=null;
      const style=document.createElement('style');style.dataset.plugin='dsh-madara-pixel-theme';
      style.textContent=CSS+'\nbody[data-dsh-madara-theme="on"][data-dsh-madara-texture="on"] .Dc7zOa_root[data-phase="hero"]::before{background-image:url("'+PIXEL_MADARA_ART+'")}';
      function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}}
      function clearBody(){delete document.body.dataset.dshMadaraTheme;delete document.body.dataset.dshMadaraTexture;delete document.body.dataset.dshMadaraFont;}
      function playBoot(){if(disposed||!prefs.enabled)return;removeBoot?.();removeBoot=mountPixelBoot({onClose:()=>{removeBoot=null;}});}
      function update(patch={}){
        Object.assign(prefs,patch);
        if(!prefs.enabled||!prefs.bootAnimation)removeBoot?.();
        if(prefs.enabled){
          if(!removeTokens){previousTheme=ctx.theme.getTheme().preference;removeTokens=ctx.theme.overrideTokens('dsh-madara-pixel-theme',TOKENS);}
          document.body.dataset.dshMadaraTheme='on';document.body.dataset.dshMadaraTexture=prefs.texture?'on':'off';document.body.dataset.dshMadaraFont=prefs.pixelFont?'on':'off';
          if(ctx.theme.getTheme().preference!=='dark')ctx.theme.setTheme('dark');
        }else{
          removeTokens?.();removeTokens=null;clearBody();if(previousTheme){ctx.theme.setTheme(previousTheme);previousTheme=null;}
        }
        save();for(const listener of subscribers)listener({...prefs});
```

</details>

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-theme/client.template.js:33-44](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/client.template.js#L33-L44)

固定版本代码。

<details>
<summary>查看原文（12行）</summary>

```text
      function Settings(){
        const [value,setValue]=React.useState({...prefs});React.useEffect(()=>{subscribers.add(setValue);return()=>subscribers.delete(setValue);},[]);const e=React.createElement;
        const toggle=(key,label)=>e('button',{type:'button',className:'madara-theme-control','aria-pressed':value[key],onClick:()=>update({[key]:!prefs[key]})},label+(value[key]?'：开':'：关'));
        return e('section',{className:'madara-theme-settings','aria-label':'宇智波斑像素主题'},
          e('div',{className:'madara-theme-settings-title'},e('span',null,'宇智波斑 · 像素主题'),e('span',{className:'madara-theme-settings-caption'},'MADARA / 01')),
          e('p',{className:'madara-theme-settings-note'},'深蓝背景、暗红盔甲与金色高亮。首页人物背景、像素字体和约三秒启动动画可独立关闭。'),
          e('div',{className:'madara-theme-settings-actions'},toggle('enabled','界面主题'),toggle('texture','首页人物与点阵'),toggle('pixelFont','像素字体'),toggle('bootAnimation','启动动画'),e('button',{type:'button',className:'madara-theme-control',disabled:!value.enabled,onClick:playBoot},'重播动画')));
      }
      ctx.effect(()=>{document.head.appendChild(style);update();autoTimer=setTimeout(autoBoot,80);document.addEventListener('visibilitychange',autoBoot);return()=>{disposed=true;clearTimeout(autoTimer);document.removeEventListener('visibilitychange',autoBoot);removeBoot?.();removeTokens?.();style.remove();clearBody();if(previousTheme)ctx.theme.setTheme(previousTheme);subscribers.clear();};},'madara-pixel-theme: scoped theme');
      ctx.slots.inject('settings.general.item',()=>ctx.slots.register({name:'settings.general.item',id:'madara-pixel-theme',order:9},Settings));
    }
    return {name:'madara-pixel-theme',inject:['theme','slots'],apply};
```

</details>

#### 缺口

- 未在真实宿主验证持久化、主题冲突和恢复
  **影响**：运行效果未知
  **进一步探讨**：检查启停、重载、系统主题切换。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动动画和兼容声明的边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

动画通过 dialog 创建，支持 Escape、跳过、减少动态、自动结束和独立 4.2 秒硬停止，并恢复先前焦点；作者明确进度条是装饰而非后台加载进度。首页背景依赖带哈希样式类名和 data-phase 的选择器，界面版本变化可能失配；README 的 Windows 官方桌面验证是作者声明，非本次测试，其他环境不能由此推断兼容。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-theme/client.template.js:15-16](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/client.template.js#L15-L16)

固定版本代码。

```text
      const style=document.createElement('style');style.dataset.plugin='dsh-madara-pixel-theme';
      style.textContent=CSS+'\nbody[data-dsh-madara-theme="on"][data-dsh-madara-texture="on"] .Dc7zOa_root[data-phase="hero"]::before{background-image:url("'+PIXEL_MADARA_ART+'")}';
```

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-theme/boot.js:75-105](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/boot.js#L75-L105)

固定版本代码。

<details>
<summary>查看原文（31行）</summary>

```text
  function after(fn, ms) {
    const timer = setTimeout(() => { timers.delete(timer); if (!closed) fn(); }, ms);
    timers.add(timer);
    return timer;
  }
  function dispose() {
    if (closed) return;
    closed = true;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    motion.removeEventListener('change', onMotionChange);
    dialog.removeEventListener('cancel', onCancel);
    dialog.removeEventListener('close', dispose);
    dialog.remove();
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    onClose();
  }
  function finish() {
    if (closed || closeTimer !== null) return;
    if (motion.matches) { dispose(); return; }
    dialog.classList.add('is-leaving');
    closeTimer = after(dispose, 240);
  }
  function onCancel(event) { event.preventDefault(); dispose(); }
  function onMotionChange(event) { if (event.matches) dispose(); }
  dialog.querySelector('.madara-pixel-boot-skip').addEventListener('click', dispose);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', dispose);
  motion.addEventListener('change', onMotionChange);
  document.body.appendChild(dialog);
  try { dialog.showModal(); } catch { dispose(); return () => {}; }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-theme/boot.js:106-119](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/boot.js#L106-L119)

固定版本代码。

<details>
<summary>查看原文（14行）</summary>

```text
  after(() => {
    dialog.querySelector('.madara-pixel-boot-stage').textContent = '写轮眼 · 觉醒';
    dialog.querySelector('.madara-pixel-boot-count').textContent = '02 / 03';
    dialog.classList.add('is-awakened');
  }, 1050);
  after(() => {
    dialog.querySelector('.madara-pixel-boot-stage').textContent = 'HARNESS · 就绪';
    dialog.querySelector('.madara-pixel-boot-count').textContent = 'READY';
    dialog.classList.add('is-ready');
  }, 2250);
  after(finish, motion.matches ? 350 : 2800);
  // Independent hard stop: an intro must never trap the application.
  after(dispose, 4200);
  return dispose;
```

</details>

**依据 4 · 作者声明**：[packages/dsh-madara-pixel-theme/README.md:7-15](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/README.md#L7-L15)

作者说明。

````text
已验证 DeepSeek Harness 0.2.1-rc.2 的 Windows 官方桌面端。通过应用的「插件 → 添加插件」选择本包的完整 .tgz 路径，安装后按提示启用。浏览器 WebUI 可执行：

```sh
dsh plugin --profile web add /path/to/dsh-madara-pixel-theme-1.0.0.tgz
```

在「设置 → 通用」中的「宇智波斑 · 像素主题」调整主题、首页人物与点阵、像素字体和启动动画。启动动画支持 Esc 跳过、重播、系统减少动态设置；其进度条为视觉效果，不能代表后台加载进度。关闭主题或卸载时移除样式与颜色覆盖，并恢复启用前的明暗模式。

主题和其他外观插件都可能覆盖界面颜色，建议一次只启用一个外观主题。本版本面向 Harness 0.2.1-rc.2 的界面结构；其他版本需重新验证。
````

#### 缺口

- 未做真实浏览器、屏幕阅读器或多平台测试，不能确认无障碍和视觉兼容
  **影响**：运行效果未知
  **进一步探讨**：在目标宿主分别验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、构建与退出有哪些条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

清单声明 Node >=22.19、DSH 0.2.1-rc.2、Web Client；打包清单包含已生成 client.js 和许可材料。构建脚本读取字体、图片、CSS、token 和模板生成内嵌客户端，固定源码库存档的解析器将 boot.js 和模板占位表达式报告为解析错误；这属于模板占位语法，不能据此判定生成 client.js 同样失败。用户需核查目标版本、主题冲突及字体和图像许可，关闭后偏好仍可能留在 localStorage；未检验包与源码一致或卸载行为。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-theme/package.json:1-8](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/package.json#L1-L8)

固定版本代码。

```text
{
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=22.19",
    "dsh": "0.2.1-rc.2"
  },
```

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-theme/package.json:27-50](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/package.json#L27-L50)

固定版本代码。

<details>
<summary>查看原文（24行）</summary>

```text
  "files": [
    "index.js",
    "client.js",
    "cordis.patch.yml",
    "LICENSE",
    "ASSET-NOTICE.md",
    "licenses",
    "README.md",
    "CHANGELOG.md"
  ],
  "scripts": {
    "build": "node build.cjs",
    "test": "node --test test/*.test.cjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
```

</details>

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-theme/build.cjs:1-7](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/build.cjs#L1-L7)

固定版本代码。

```text
const fs=require('fs'),path=require('path');const dir=__dirname;
const font=(family,file,format,mime)=>'@font-face{font-family:"'+family+'";src:url(data:'+mime+';base64,'+fs.readFileSync(path.join(dir,'assets',file)).toString('base64')+') format("'+format+'");font-weight:400;font-style:normal;font-display:swap;}';
const css=font('Madara Silkscreen','Silkscreen-Regular.ttf','truetype','font/ttf')+font('Madara Fusion Pixel','fusion-pixel-12px-proportional-zh-Hans.woff2','woff2','font/woff2')+font('Madara Fusion Pixel Mono','fusion-pixel-12px-monospaced-zh-Hans.woff2','woff2','font/woff2')+fs.readFileSync(path.join(dir,'theme.css'),'utf8')+fs.readFileSync(path.join(dir,'boot.css'),'utf8');
const art='data:image/png;base64,'+fs.readFileSync(path.join(dir,'assets/madara-foreground.png')).toString('base64');
const boot=fs.readFileSync(path.join(dir,'boot.js'),'utf8').replace('/* MADARA_FOREGROUND_VALUE */',()=>JSON.stringify(art));
const client=fs.readFileSync(path.join(dir,'client.template.js'),'utf8').replace('/* CSS_VALUE */',()=>JSON.stringify(css)).replace('/* TOKENS_VALUE */',()=>JSON.stringify(JSON.parse(fs.readFileSync(path.join(dir,'tokens.json'),'utf8')))).replace('/* BOOT_VALUE */',()=>boot);
fs.writeFileSync(path.join(dir,'client.js'),client);console.log('Standalone Madara theme built.');
```

**依据 4 · 源码核查**：[packages/dsh-madara-pixel-theme/client.template.js:8-18](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/client.template.js#L8-L18)

固定版本代码。

<details>
<summary>查看原文（11行）</summary>

```text
    const KEY='dsh.madara-pixel-theme.preferences.v1';
    function apply(ctx){
      const defaults={enabled:true,texture:true,pixelFont:true,bootAnimation:true};
      let prefs={...defaults};
      try {const saved=JSON.parse(localStorage.getItem(KEY)||'{}');for(const key of Object.keys(defaults))if(typeof saved[key]==='boolean')prefs[key]=saved[key];}catch{}
      const subscribers=new Set();
      let removeTokens=null,removeBoot=null,disposed=false,previousTheme=null,autoTimer=null;
      const style=document.createElement('style');style.dataset.plugin='dsh-madara-pixel-theme';
      style.textContent=CSS+'\nbody[data-dsh-madara-theme="on"][data-dsh-madara-texture="on"] .Dc7zOa_root[data-phase="hero"]::before{background-image:url("'+PIXEL_MADARA_ART+'")}';
      function save(){try{localStorage.setItem(KEY,JSON.stringify(prefs));}catch{}}
      function clearBody(){delete document.body.dataset.dshMadaraTheme;delete document.body.dataset.dshMadaraTexture;delete document.body.dataset.dshMadaraFont;}
```

</details>

**依据 5 · 作者声明**：[packages/dsh-madara-pixel-theme/README.md:13-19](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/README.md#L13-L19)

作者说明。

```text
在「设置 → 通用」中的「宇智波斑 · 像素主题」调整主题、首页人物与点阵、像素字体和启动动画。启动动画支持 Esc 跳过、重播、系统减少动态设置；其进度条为视觉效果，不能代表后台加载进度。关闭主题或卸载时移除样式与颜色覆盖，并恢复启用前的明暗模式。

主题和其他外观插件都可能覆盖界面颜色，建议一次只启用一个外观主题。本版本面向 Harness 0.2.1-rc.2 的界面结构；其他版本需重新验证。

## 源码与授权

运行时已包含编译好的 client.js，安装不运行构建脚本。源码执行 `node build.cjs` 可重新构建。所有资源本地加载；不联网下载字体，不读取会话或账号凭据。详见 LICENSE、ASSET-NOTICE.md 与 licenses/。
```

#### 缺口

- 未运行构建、发布 tarball 或清理验证
  **影响**：不能确认资源及退出完整
  **进一步探讨**：隔离环境比对成品并检查本地存储。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 兼容性检查能否降低样式失效？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在挂载主题时检测首页目标节点或可公开的稳定槽位，并在不匹配时显示兼容提示，可能减少版本升级导致的人物背景静默缺失。可比较当前哈希选择器与稳定槽位方案在多个宿主版本和主题切换下的表现；若误报影响正常界面或其他视觉覆盖仍错误，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-theme/client.template.js:15-16](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/client.template.js#L15-L16)

固定版本代码。

```text
      const style=document.createElement('style');style.dataset.plugin='dsh-madara-pixel-theme';
      style.textContent=CSS+'\nbody[data-dsh-madara-theme="on"][data-dsh-madara-texture="on"] .Dc7zOa_root[data-phase="hero"]::before{background-image:url("'+PIXEL_MADARA_ART+'")}';
```

**依据 2 · 作者声明**：[packages/dsh-madara-pixel-theme/README.md:13-15](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-theme/README.md#L13-L15)

作者说明。

```text
在「设置 → 通用」中的「宇智波斑 · 像素主题」调整主题、首页人物与点阵、像素字体和启动动画。启动动画支持 Esc 跳过、重播、系统减少动态设置；其进度条为视觉效果，不能代表后台加载进度。关闭主题或卸载时移除样式与颜色覆盖，并恢复启用前的明暗模式。

主题和其他外观插件都可能覆盖界面颜色，建议一次只启用一个外观主题。本版本面向 Harness 0.2.1-rc.2 的界面结构；其他版本需重新验证。
```

#### 缺口

- 该检查尚未实现或测试
  **影响**：不能保证跨版本显示
  **进一步探讨**：用真实版本和截图对照验证。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
