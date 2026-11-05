# 终末地主题

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ada9396](https://github.com/ymh0000123/dsh-theme-endfield/tree/ada9396a957633a40bdad89ff084b0136b9515b4)

<!-- BEGIN META -->
[![GitHub ★ 159](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=159&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ymh0000123/dsh-theme-endfield) [![npm 30d 2,969](https://img.shields.io/static/v1?label=npm+30d&message=2%2C969&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-endfield) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-theme-endfield)
<!-- END META -->

> **功能**：为 DSH Web 提供终末地风格令牌和样式，以及可选宿主音频通知。

> **亮点**：[Q01](#research-q01) 提供可退出的主题覆盖及独立通知。

> **主要限制**：[Q03](#research-q03) 预览回执不是实际出声，远端音频在宿主。

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
  - [Q01 · 主题实际改变了哪里？](#detail-section-11)
  - [Q02 · 为什么浏览器后台也可能发提示？](#detail-section-12)
  - [Q03 · 预览成功表示声音已经播放吗？](#detail-section-13)
  - [Q04 · 如何先换主题并可撤回？](#detail-section-14)
  - [Q05 · 如何测试提示是否比视觉更有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢终末地风格的 DSH 用户可试外观覆盖。

默认主题没有额外样式依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 主题 | 改变外观 | 依赖宿主主题服务 |
| 音频 | 在宿主发提示 | 依赖播放器和听音位置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web 主题服务 | 必需 | 覆盖令牌 | 继续默认主题 |
| 系统音频 | 提示需要 | 播放声音 | 保留视觉提示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 启用 | 先试外观 | 检查对比度 |
| 核验 | 可选试音 | 核对宿主位置 |
| 退出 | 关功能或卸载 | 恢复默认外观 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源成本未知 | 安装耗时未知 | 按宿主版本 |
| 持续 | 渲染和音频开销未知 | 调整耗时未知 | 需确认播放器 |
| 恢复 | 恢复资源未知 | 排障耗时未知 | 重启或卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 主题与声音 | 已核对令牌和播放接线 | 真实渲染和漏看率 |

> **思考**：[Q03](#research-q03) 预览回执不是实际出声，远端音频在宿主。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 提供可退出的主题覆盖及独立通知。

客户端对重复应用和资源清理有显式路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 预览回执不是实际出声，远端音频在宿主。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只试外观，必要时再试听。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的主题应用、清理与音频通知的宿主边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、client.js、index.js、lib/audio.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的主题应用、清理与音频通知的宿主边界。未执行目标代码或实际宿主验证。
- 下一步：用受控审批测试不同设备布局

**分析版本**

- **仓库**：[ymh0000123/dsh-theme-endfield](https://github.com/ymh0000123/dsh-theme-endfield)
- **版本号**：1.2.3（[固定提交 ada9396](https://github.com/ymh0000123/dsh-theme-endfield/tree/ada9396a957633a40bdad89ff084b0136b9515b4)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较声音提示能否降低漏看。

用受控审批测试不同设备布局

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 55 | 23726 | 14508 | 9080 | — |
| .md | source | 12 | 2807 | — | — | 64485 |
| .js | test | 51 | 12399 | 8830 | 2873 | — |
| .js | example | 3 | 592 | 367 | 217 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ymh0000123/dsh-theme-endfield/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题应用、清理与音频通知的宿主边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题实际改变了哪里？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

客户端按主题服务覆盖令牌并插入样式。相比原主题只改颜色，它提供完整风格覆盖，但按钮或布局是否仍易用需要实测。相同构建的重复 apply 会退出，避免重复层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-8](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/README.md#L3-L8)

作者说明双端职责

```text
参考《明日方舟：终末地》官网风格的 DSH Web 主题插件：奶油纸底、墨黑文字、信号黄／武陵青强调色、全直角工业编辑风。

- **Client 侧**（`client.js`）：通过主题令牌与样式覆盖界面。
- **Host 侧**（`index.js`）：设置持久化与可选的音频通知（派生系统播放器子进程）。

两侧都不修改应用自身代码。
```

**依据 2 · 源码核查**：[client.js:52-93](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/client.js#L52-L93)

插入样式与重复应用控制

<details>
<summary>查看原文（42行）</summary>

```text
function insertCss(css) {
  // Dynamic Cordis runner provides the `styles` global; standalone bundle does not.
  if (typeof styles !== 'undefined' && styles && typeof styles.insert === 'function') {
    return styles.insert(css)
  }
  // Idempotency: the installed bundle can be applied more than once (boot loader +
  // cordis composition both mount it). Never stack duplicate theme stylesheets.
  document.querySelectorAll('style[data-plugin="dsh-theme-endfield"]').forEach((old) => old.remove())
  const el = document.createElement('style')
  el.setAttribute('data-plugin', 'dsh-theme-endfield')
  el.textContent = css
  document.head.appendChild(el)
  return () => {
    if (el.parentNode) el.parentNode.removeChild(el)
  }
}

function apply(ctx) {    // Idempotency: the installed bundle can be applied more than once (boot loader +
    // cordis composition both mount it). Only the first application owns tokens/styles;
    // duplicate overrideTokens would replace the layer and break the toggle's dispose.
    // The flag is RELEASED by the run's dispose (see the ctx.effect cleanup below), so
    // a dispose followed by a re-apply in the same page session mounts the theme again
    // instead of staying dead until a hard reload.
    if (typeof window !== 'undefined' && window.__dshThemeEndfieldApplied) {
      // Same build mounted again (boot loader + cordis composition): the first
      // mount owns tokens/styles, so leave it alone. A DIFFERENT build means this
      // module was swapped into a live tab by the rebuilt()/HMR path without a
      // dispose: the old sheet is still mounted and the flag would freeze the tab
      // on the old CSS. Drop that stale sheet and fall through to a fresh apply.
      if (window.__dshThemeEndfieldBuild === SHEET_MARKER) return
      try {
        document.querySelectorAll('style[data-plugin="dsh-theme-endfield"]').forEach((old) => old.remove())
      } catch (e) { /* no inspectable DOM (tests, non-browser host): nothing to clean */ }
    }
    // Claim the flag only once the theme service is actually there: a boot order where
    // it is still missing must not lock the flag in place and kill every later apply.
    const theme = ctx.get('theme')
    if (theme === undefined) return
    if (typeof window !== 'undefined') {
      window.__dshThemeEndfieldApplied = true
      window.__dshThemeEndfieldBuild = SHEET_MARKER
    }
```

</details>

**依据 3 · 源码核查**：[client.js:5779-5788](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/client.js#L5779-L5788)

实际令牌覆盖

<details>
<summary>查看原文（10行）</summary>

```text
    const mount = () => {
      if (mounted) return
      mounted = true
      disposeToken = theme.overrideTokens('edge-intelligence-theme', {
      '--dsw-alias-bg-base': {
        light: '#e8e8e2',
        dark: '#101110',
      },
      '--dsw-alias-bg-layer-1': {
        light: '#f2f2ec',
```

</details>

#### 缺口

- 未运行页面
  **影响**：无法判断对比度和可读性
  **进一步探讨**：对照常用操作的截图和键盘导航

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么浏览器后台也可能发提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主监听审批和提问，按开关请求播放，并继续 waterfall。音频运行时通过 subprocess 启动系统播放器，失败会尝试后续命令。因此发声依赖运行宿主的机器和系统音频，而不单靠浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:907-929](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/index.js#L907-L929)

审批与提问调用

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('approval/request', (request, next) => {
    attentionSeen.approval += 1;
    if (audio.diagnosing) audio.note('approval/request', String(request === undefined ? '' : request.kind || ''));
    if (audio.enabled(PREF.attention)) {
      /* This event is a waterfall: play() must never be allowed to throw past
         next(), or the whole approval chain dies exactly the way the
         tools/execute note below describes. play() itself guards its file
         parsing, so this is the belt to that brace. */
      try { audio.play('attention', { reason: 'approval request' }); }
      catch (error) { audio.note('play-threw', `approval/request: ${error && error.message ? error.message : error}`); }
    }
    return typeof next === 'function' ? next() : undefined;
  });

  ctx.on('user-questions/request', (request, next) => {
    attentionSeen.question += 1;
    if (audio.diagnosing) audio.note('user-questions/request', 'pending question');
    if (audio.enabled(PREF.attention)) {
      // Same waterfall contract as approval/request above.
      try { audio.play('attention', { reason: 'user question' }); }
      catch (error) { audio.note('play-threw', `user-questions/request: ${error && error.message ? error.message : error}`); }
    }
    return typeof next === 'function' ? next() : undefined;
```

</details>

**依据 2 · 源码核查**：[lib/audio.js:374-411](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/lib/audio.js#L374-L411)

启动播放器与失败处理

<details>
<summary>查看原文（38行）</summary>

```text
    const runtime = this;
    let index = 0;
    const tryNext = () => {
      if (index >= attempts.length) {
        runtime.playing.delete(slot);
        /* Nothing sounded, so the not-speaking window recorded in play() must be
           returned too — otherwise real notifications stay gated for the file's
           whole duration after a total player failure. */
        delete runtime.playUntil[slot];
        runtime.note('failed', `${slot}: no player command succeeded`);
        return;
      }
      const argv = attempts[index++];
      let handle;
      try {
        handle = subprocess.spawn({
          argv,
          cwd: process.platform === 'win32' ? (process.env.SystemRoot || 'C:\\Windows') : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 8000,
        });
      } catch (error) {
        tryNext();
        return;
      }
      Promise.resolve(handle.done).then(
        () => { runtime.playing.delete(slot); },
        (error) => {
          runtime.note('player-failed', `${slot}: ${argv[0]}`);
          tryNext();
        },
      );
    };
    tryNext();
    if (this.diagnosing) {
      this.note('played', `${slot} (${force ? 'preview' : reason || 'event'}) <- ${resolved.origin} volume=${volume}`);
    }
    return { played: true, file: resolved.file, origin: resolved.origin, volume };
```

</details>

#### 缺口

- 未测试不同系统输出
  **影响**：无法保证远端连接时用户能听到
  **进一步探讨**：分别检查宿主和浏览器所在设备

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预览成功表示声音已经播放吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

预览 GET 或 POST 触发 host play，遵循槽位开关但绕过去抖。play 会在播放器最终完成前返回 played，不能据此确认扬声器有声音。handler 内未见独立身份检查，应按部署核对宿主 Web 访问控制。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:997-1031](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/index.js#L997-L1031)

预览方法和返回

<details>
<summary>查看原文（35行）</summary>

```text
        handler: async (req, res) => {
          const url = String(req.url || '');
          const pathname = url.split('?')[0];
          const query = url.includes('?') ? new URLSearchParams(url.slice(url.indexOf('?') + 1)) : new URLSearchParams();
          /* Both preview routes force the play (bypassing the debounce window),
             because a preview that silently does nothing is indistinguishable
             from a broken feature. The GET form takes the slot in the query
             string so a non-JS caller can trigger the same play; neither route
             is a new capability — both end in audio.play() under the user's own
             settings, and the Host web server already authenticates the page. */
          const playForPreview = (slotId, reason) => {
            const id = String(slotId || '');
            // The slot's own switch is authoritative even for a preview: playing a
            // sound the user switched off would make the switch look broken.
            if (SLOT_IDS.includes(id) && !audio.slotEnabled(id)) {
              return { slot: id, played: false, why: `slot switch "${id}" is off` };
            }
            const result = audio.play(id, { force: true, reason });
            return Object.assign({ slot: id }, result);
          };
          try {
            if (req.method === 'GET' && pathname === '/theme-endfield/audio/state') {
              // `attention` rides along so a caller can tell "the host never got
              // the request" apart from "the host got it and chose to stay
              // silent" — the two look identical from the page otherwise.
              return send(res, 200, Object.assign(audio.snapshot(), { attention: Object.assign({}, attentionSeen) }));
            }
            if (req.method === 'GET' && pathname === '/theme-endfield/audio/preview') {
              const result = playForPreview(query.get('slot'), 'preview (GET)');
              return send(res, result.played ? 200 : 409, result);
            }
            if (req.method === 'POST' && pathname === '/theme-endfield/audio/preview') {
              const body = await readJson(req);
              const result = playForPreview(body.slot, 'settings preview');
              return send(res, result.played ? 200 : 409, result);
```

</details>

**依据 2 · 源码核查**：[lib/audio.js:386-411](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/lib/audio.js#L386-L411)

异步播放与早期返回

<details>
<summary>查看原文（26行）</summary>

```text
      const argv = attempts[index++];
      let handle;
      try {
        handle = subprocess.spawn({
          argv,
          cwd: process.platform === 'win32' ? (process.env.SystemRoot || 'C:\\Windows') : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 8000,
        });
      } catch (error) {
        tryNext();
        return;
      }
      Promise.resolve(handle.done).then(
        () => { runtime.playing.delete(slot); },
        (error) => {
          runtime.note('player-failed', `${slot}: ${argv[0]}`);
          tryNext();
        },
      );
    };
    tryNext();
    if (this.diagnosing) {
      this.note('played', `${slot} (${force ? 'preview' : reason || 'event'}) <- ${resolved.origin} volume=${volume}`);
    }
    return { played: true, file: resolved.file, origin: resolved.origin, volume };
```

</details>

#### 缺口

- 未实测路由保护和输出
  **影响**：无法断言可安全暴露或可听
  **进一步探讨**：在本机确认访问策略并试听

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何先换主题并可撤回？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先保持音频默认关闭，在 Web profile 比较输入、工具结果和设置页。若对比度不适或与其他覆盖冲突，按作者说明卸载并重启。客户端 dispose 会卸载样式、观察器和定时路径；实际热卸载和整进程重启差异未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-27](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/README.md#L10-L27)

安装与退出条件

<details>
<summary>查看原文（18行）</summary>

````text
## 安装

```bash
dsh plugin --profile web add github:ymh0000123/dsh-theme-endfield
```

重启或重新加载 `web` profile 后生效。卸载：

```bash
dsh plugin --profile web rm dsh-theme-endfield
```

### 更新插件文件时的加载时机

| 改动 | 生效方式 |
| --- | --- |
| Client 半 `client.js` | Host 按请求从磁盘读取，浏览器刷新即可 |
| Host 半 `index.js` | 只在 profile 启动时 import 一次，**必须整进程重启 DSH** |
````

</details>

**依据 2 · 作者声明**：[README.md:35-45](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/README.md#L35-L45)

音频可选且默认关闭

<details>
<summary>查看原文（11行）</summary>

```text
- **主题**：总开关、谷地黄／武陵青配色、直角／圆角模式。
- **背景**：等高线背景（默认关闭）及动态开关、`24 / 60 / 120 FPS`、速度 `1x / 2x / 4x`；可选鼠标轨迹（鼠标附近的等高线局部变形并逐渐恢复，默认关闭）；背景水印及持续显示。
- **动画**：输出滚动动画（默认开启，强度分 `柔和 / 标准 / 轻快`）——把模型流式输出的「整段跳一大格」摊成逐帧滑动，不改动应用自己的滚动位置，因此跟随不会中断，向上滚动、读者手势与系统「减少动态效果」下都保持瞬时；启动加载动画。
- **娱乐**：雷霆大字及入场动画；顶部余额胶囊（默认关闭）。
- **音频**：启动音、任务开始／结束音、需要回应时提示，音量与自定义音效目录可调（默认关闭）。

几处需要单独说明的行为：

- **顶部余额胶囊**：悬浮显示 DeepSeek API 余额与峰谷时段（高峰为工作日 `9-12` 点、`14-18` 点；周末、法定节假日与落在周末的调休日都按低谷半价）。会话使用 [dsh-codearts-auth](https://www.npmjs.com/package/dsh-codearts-auth) 渠道模型时自动切换为该渠道的剩余额度与积分消耗进度，随渠道切换实时跟随，主读数可在设置中选择右侧百分比显示剩余或已用。
- **输出滚动动画**与**渠道额度模式**的完整行为、默认值与边界情况见 [docs/features.md](docs/features.md)。
- **音频通知**的防噪规则与自定义音效见 [docs/audio-notifications.md](docs/audio-notifications.md)。
```

</details>

**依据 3 · 源码核查**：[client.js:10419-10461](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/client.js#L10419-L10461)

清理主题和观察器

<details>
<summary>查看原文（43行）</summary>

```text
    ctx.effect(() => () => {
      unmount()
      // Release the idempotency flag so a re-apply after this dispose can mount
      // the theme again; leaving it set killed the theme until a hard reload.
      // The build marker goes with it: a disposed page must look un-mounted to
      // the next apply() no matter which build performs it.
      if (typeof window !== 'undefined') {
        window.__dshThemeEndfieldApplied = false
        delete window.__dshThemeEndfieldBuild
      }
      if (watermarkObserver) watermarkObserver.disconnect()
      /* A deferred observer install may still be waiting on DOMContentLoaded when
         the run ends; drop the pending listener so a disposed run is not wired
         back into the page. removeEventListener is a no-op when it never fired
         or already ran ({ once }), so both branches are safe. */
      if (typeof document !== 'undefined' && typeof document.removeEventListener === 'function') {
        document.removeEventListener('DOMContentLoaded', watermarkObserverLate)
        document.removeEventListener('DOMContentLoaded', contourSchemeObserverLate)
        // The boot loader's pre-body deferral too: a dead run must not be wired
        // back in to mount an unstyled plate.
        if (loaderDomReadyPending !== null) {
          document.removeEventListener('DOMContentLoaded', loaderDomReadyPending)
          loaderDomReadyPending = null
        }
      }
      if (watermarkRaf !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(watermarkRaf)
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') window.removeEventListener('resize', onWatermarkResize)
      if (watermarkEl && watermarkEl.parentNode) watermarkEl.parentNode.removeChild(watermarkEl)
      if (contourScrollTimer !== null && typeof clearTimeout === 'function') clearTimeout(contourScrollTimer)
      contourScrollTimer = null
      contourScrollPaused = false
      // Both scroll listeners went on in capture mode, so both have to come off the
      // same way — dropping only 'scroll' leaks a scrollend listener per plugin run.
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('scroll', onContourScrollEvent, true)
        window.removeEventListener('scrollend', onContourScrollEndEvent, true)
      }
      // The plate owns a rAF handle and a fixed DOM node; both must go with the run.
      destroyLoader()
      // The contour layer owns a rAF handle, a ResizeObserver, a MutationObserver
      // and two canvases — every one of them has to go with the run.
      contourTeardown()
      if (contourSchemeObserver) contourSchemeObserver.disconnect()
```

</details>

#### 缺口

- 未运行宿主和浏览器
  **影响**：无法保证主题堆叠
  **进一步探讨**：单主题测试启用和卸载

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何测试提示是否比视觉更有用？

**研究主题**：新假设与验证

#### 完整回答

在合成审批任务中对照仅视觉与开启声音，记录漏看、误提示和响应时间。浏览器和宿主分机时作为独立条件。若漏看无改善或频繁干扰，则维持关闭。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:907-929](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/index.js#L907-L929)

审批和提问触发

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.on('approval/request', (request, next) => {
    attentionSeen.approval += 1;
    if (audio.diagnosing) audio.note('approval/request', String(request === undefined ? '' : request.kind || ''));
    if (audio.enabled(PREF.attention)) {
      /* This event is a waterfall: play() must never be allowed to throw past
         next(), or the whole approval chain dies exactly the way the
         tools/execute note below describes. play() itself guards its file
         parsing, so this is the belt to that brace. */
      try { audio.play('attention', { reason: 'approval request' }); }
      catch (error) { audio.note('play-threw', `approval/request: ${error && error.message ? error.message : error}`); }
    }
    return typeof next === 'function' ? next() : undefined;
  });

  ctx.on('user-questions/request', (request, next) => {
    attentionSeen.question += 1;
    if (audio.diagnosing) audio.note('user-questions/request', 'pending question');
    if (audio.enabled(PREF.attention)) {
      // Same waterfall contract as approval/request above.
      try { audio.play('attention', { reason: 'user question' }); }
      catch (error) { audio.note('play-threw', `user-questions/request: ${error && error.message ? error.message : error}`); }
    }
    return typeof next === 'function' ? next() : undefined;
```

</details>

**依据 2 · 源码核查**：[lib/audio.js:386-411](https://github.com/ymh0000123/dsh-theme-endfield/blob/ada9396a957633a40bdad89ff084b0136b9515b4/lib/audio.js#L386-L411)

发声位置在宿主

<details>
<summary>查看原文（26行）</summary>

```text
      const argv = attempts[index++];
      let handle;
      try {
        handle = subprocess.spawn({
          argv,
          cwd: process.platform === 'win32' ? (process.env.SystemRoot || 'C:\\Windows') : '/',
          stdio: { stdin: 'ignore', stdout: 'ignore', stderr: 'ignore' },
          graceMs: 8000,
        });
      } catch (error) {
        tryNext();
        return;
      }
      Promise.resolve(handle.done).then(
        () => { runtime.playing.delete(slot); },
        (error) => {
          runtime.note('player-failed', `${slot}: ${argv[0]}`);
          tryNext();
        },
      );
    };
    tryNext();
    if (this.diagnosing) {
      this.note('played', `${slot} (${force ? 'preview' : reason || 'event'}) <- ${resolved.origin} volume=${volume}`);
    }
    return { played: true, file: resolved.file, origin: resolved.origin, volume };
```

</details>

#### 缺口

- 没有操作者对照
  **影响**：提示收益未知
  **进一步探讨**：用受控审批测试不同设备布局

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
