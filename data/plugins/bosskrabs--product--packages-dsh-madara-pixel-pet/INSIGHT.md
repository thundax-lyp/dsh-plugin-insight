# 宇智波斑像素桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[2eb032c](https://github.com/BossKrabs/product/tree/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：以像素斑角色显示 Harness 任务状态，支持拖动及点击互动。

> **亮点**：[Q01](#research-q01) 主要提供角色素材、独立运行目录与设置接入；状态和原生运行继承上游。

> **主要限制**：[Q03](#research-q03) helper 只比较大小、皮肤只比较 manifest 哈希；同版本资源变化可能未更新，尚未复现。

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
  - [Q01 · 适合谁，相对原版桌宠增加什么？](#detail-section-11)
  - [Q02 · 状态如何到原生窗口？](#detail-section-12)
  - [Q03 · 运行文件更新和失败处理有什么边界？](#detail-section-13)
  - [Q04 · 兼容、资产和隐私条件是什么？](#detail-section-14)
  - [Q05 · 如何试用并停止？](#detail-section-15)
  - [Q06 · 内容完整性校验是否值得改善更新？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望以像素角色观察任务状态的 Windows x64 DSH 用户。

使用 DSH 原有任务界面或上游大肥鱼桌宠；实际体验差异未测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 限制 |
|---|---|---|
| 原生桌宠 | 显示动作和交互 | Windows x64，未实测 |
| 任务状态 | 消费会话事件 | reducer 属于上游 |

**流程与依赖**

| 条件 | 用途 | 边界 |
|---|---|---|
| Windows x64 与兼容 DSH | 宿主和原生窗口 | 其他平台 apply 直接返回 |
| dsh-dafeiyu 0.1.22 | helper 和 reducer | 上游数据行为未审 |
| 本地运行目录 | 复制程序与素材 | 关闭后保留文件 |

| 步骤 | 动作 | 结果或边界 |
|---|---|---|
| 安装 | 安装依赖及本包 | 需匹配平台 |
| 启动 | 复制 helper 与素材 | 失败记录日志 |
| 运行 | 会话事件交给 reducer | 上游决定映射 |
| 停止 | 停用并检查进程 | 本地文件保留需核实 |

**效果与成本**

| 阶段 | 资源或费用 | 人工时间 |
|---|---|---|
| 首次 | 下载与磁盘占用未测 | 安装与兼容验证 |
| 持续 | 原生进程资源未测 | 调整和观察 |
| 恢复 | 保留日志与运行库 | 停用和检查进程 |

| 效果 | 固定源码支持 | 未确定 |
|---|---|---|
| 角色显示 | 资源清单与 helper 接线 | 实际显示和体验 |
| 任务状态 | 事件传入上游 reducer | 状态准确性 |

> **思考**：[Q03](#research-q03) helper 只比较大小、皮肤只比较 manifest 哈希；同版本资源变化可能未更新，尚未复现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 主要提供角色素材、独立运行目录与设置接入；状态和原生运行继承上游。

[Q02](#research-q02) 复用上游 helper 并清理订阅；[Q03](#research-q03) 内容更新依赖大小和清单哈希。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) helper 只比较大小、皮肤只比较 manifest 哈希；同版本资源变化可能未更新，尚未复现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离 profile 测试并确认依赖及素材权利，不适用时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持静态接线和资源更新判断；原生桌面及完整依赖未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-madara-pixel-pet/README.md、packages/dsh-madara-pixel-pet/package.json、packages/dsh-madara-pixel-pet/index.js、packages/dsh-madara-pixel-pet/settings-scope.js、packages/dsh-madara-pixel-pet/ASSET-NOTICE.md 及固定范围 inventory；组件：packages/dsh-madara-pixel-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态核查本组件与声明依赖，不运行 Windows helper；材料检出帧未落盘但 Git 树有帧路径。
- 下一步：在 Windows x64 隔离环境核实画面、状态、交互、helper 生命周期和更新行为。

**分析版本**

- **仓库**：[BossKrabs/product](https://github.com/BossKrabs/product)
- **版本号**：1.0.0（[固定提交 2eb032c](https://github.com/BossKrabs/product/tree/2eb032cb14be44c35501757fd4f3f25449730a17)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 建议评估资源内容摘要，需结合发布保证与测量判断。

在 Windows x64 隔离环境核实画面、状态、交互、helper 生命周期和更新行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 67 | — | — | 1104 |
| .js | source | 2 | 168 | 156 | 10 | — |
| .mjs | test | 1 | 49 | 44 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BossKrabs/product/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌宠增量、上游依赖、文件准备与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，相对原版桌宠增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望用像素斑形象显示 DSH 任务状态的 Windows x64 用户可考虑此包。它提供角色动作清单、独立运行目录、配置与宿主接线；状态转换和原生 helper 来自 dsh-dafeiyu，并非此包自行实现。相对上游原版主要增量是形象和隔离的实例，而非新的任务理解能力；README 声称 16 组动作和交互，未实际展示验证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-madara-pixel-pet/README.md:1-13](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/README.md#L1-L13)

作者说明形象、平台和使用。

<details>
<summary>查看原文（13行）</summary>

```text
# 宇智波斑像素桌宠

带有红甲、长发和写轮眼的像素风宇智波斑原生桌面伴侣。支持待机眨眼、思考、结印工作、搜索张望、等待、完成、错误、拖拽、落地、摸头、戳动及空闲动作，共 16 组。任务状态直接来自 Harness 会话事件。

## 安装与使用

支持 Windows x64，已验证 Harness 0.2.1-rc.2。通过官方桌面应用的「插件 → 添加插件」选择 dsh-madara-pixel-pet-1.0.0.tgz，安装后启用。依赖会从原作者的 dsh-dafeiyu@0.1.22 自动安装；无需单独启用大肥鱼 bundle。

在本插件的配置中调整角色大小、气泡大小、空闲动作频率、减少动态、提示音和气泡显示。角色可拖动，松手播放落地；不同位置点击或双击触发互动。随 Harness 启动和退出。

如果已经启用原版大肥鱼，两者会各显示一个角色。只想保留斑时，在插件管理中关闭大肥鱼，保留本插件。关闭或卸载本插件会停止斑的进程；设置、日志和本地运行库保留供重装使用。

本插件不会修改大肥鱼文件，也不需要管理员权限。运行目录是 DSH_HOME/plugins/madara-pixel-pet；未指定 DSH_HOME 时使用 ~/.dsh/plugins/madara-pixel-pet。首次启动会把原作者预编译运行库和本包的像素帧复制到独立目录。首次联网安装仍需下载上游依赖；运行时不调用图像生成或模型 API。
```

</details>

**依据 2 · 作者声明**：[packages/dsh-madara-pixel-pet/README.md:19-21](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/README.md#L19-L21)

作者说明上游归属。

```text
## 来源与授权

原生运行库、任务状态转换和进程管理来自 QCYTSN/dsh-dafeiyu；本包新增独立的像素斑素材、动作清单、运行目录及生命周期与配置接入。详见 THIRD-PARTY-NOTICES.md、ASSET-NOTICE.md 和 LICENSE。人物是非官方同人外观。
```

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:7-9](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L7-L9)

引入上游 reducer 和 helper。

```text
import Schema from '@deepseek-ai/schemastery';
import {CompanionReducer,HelperProcess} from 'dsh-dafeiyu';
import {createSettingsScope} from './settings-scope.js';
```

#### 缺口

- 没有实际用户或 Windows 桌面效果对照
  **影响**：不能断言偏好、效率或视觉质量
  **进一步探讨**：在兼容环境比较原版及本包。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态如何到原生窗口？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Windows x64 apply 创建 settings scope、准备独立运行目录，构造上游 HelperProcess 和 CompanionReducer，订阅全局 session/event 与 session/disposed。事件交给 reducer，所得消息送 helper；配置变化可更新环境和 config 消息，停止时清订阅并终止 helper。事件处理异常被捕获并记录；helper 的内部行为、事件映射与窗口绘制由外部依赖决定，本次没有检查其执行结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:34-54](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L34-L54)

运行目录、二进制与资源复制。

<details>
<summary>查看原文（21行）</summary>

```text
export function runtimeHome(env=process.env){return join(env.DSH_HOME||join(homedir(),'.dsh'),'plugins','madara-pixel-pet');}
export function prepareRuntime(options={}){
  const dependencyRoot=options.dependencyRoot||dirname(require.resolve('dsh-dafeiyu/package.json'));
  const base=options.runtimeRoot||runtimeHome();
  const directory=join(base,pkg.version),manifest=join(root,'assets','pet-manifest.json');
  const digest=createHash('sha256').update(readFileSync(manifest)).digest('hex');
  const executable=join(directory,'madara-pixel-pet-helper.exe');
  const original=join(dependencyRoot,'runtime','bin','win32-x64','dsh-dafeiyu-helper.exe');
  mkdirSync(directory,{recursive:true});
  if(!existsSync(executable)||statSync(executable).size!==statSync(original).size){const temporary=executable+'.new';copyFileSync(original,temporary);renameSync(temporary,executable);}
  const marker=join(directory,'skin.sha256');
  if(!existsSync(marker)||readFileSync(marker,'utf8')!==digest){
    const assets=join(directory,'assets');mkdirSync(assets,{recursive:true});
    cpSync(join(root,'assets','pet'),join(assets,'pet'),{recursive:true});
    for(const file of ['sounds','cursors','cursor_grab.cur','cursor_grabbing.cur']){const source=join(dependencyRoot,'assets',file);if(existsSync(source))cpSync(source,join(assets,file),{recursive:true});}
    copyFileSync(manifest,join(assets,'pet-manifest.json.new'));renameSync(join(assets,'pet-manifest.json.new'),join(assets,'pet-manifest.json'));
    // Write the marker only after all runtime assets are present.
    const bytes=Buffer.from(digest);const fs=require('node:fs');fs.writeFileSync(marker,bytes);
  }
  return {command:executable,args:[],tempDirectory:join(base,'tmp'),logFile:join(base,'helper.log'),env:{DSH_DAFEIYU_LAYOUT_PATH:join(base,'layout.json')}};
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:55-75](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L55-L75)

helper、reducer 与配置接线。

<details>
<summary>查看原文（21行）</summary>

```text
export function createController(ctx,settings,runtime,engine={HelperProcess,CompanionReducer}){
  let bridge=null,reducer=null,disposed=false;
  const logger=ctx.logger||console;
  const message=(kind,data={})=>({protocolVersion:1,kind,timestamp:Date.now(),...data});
  const launch=(config)=>{
    if(disposed||bridge||!config.enabled)return;
    reducer=new engine.CompanionReducer({includeSubagents:config.includeSubagents});
    bridge=new engine.HelperProcess({...runtime,env:{...runtime.env,DSH_DAFEIYU_SCALE:String(config.scale),DSH_DAFEIYU_BUBBLE_SCALE:String(config.bubbleScale),DSH_DAFEIYU_REDUCED_MOTION:config.reducedMotion?'1':'0',DSH_DAFEIYU_SOUND_ENABLED:config.soundEnabled?'1':'0'},onSettingsChange:patch=>{void Promise.resolve(settings.update?.(patch)).catch(error=>logger.warn?.('像素斑设置未能保存',error));}},logger);
    bridge.start();bridge.send(message('hello',{host:'deepseek-harness',pluginVersion:pkg.version}));bridge.send(message('state',{state:'IDLE',message:'等待新的任务',detail:'HARNESS · 像素宇智波斑'}));
  };
  const stop=()=>{bridge?.stop('madara-pet-disabled');bridge=null;reducer=null;};
  const configure=(value)=>{
    const next=normalize(value);if(!next.enabled){stop();return;}launch(next);if(!bridge)return;
    Object.assign(bridge.options.env,{DSH_DAFEIYU_SCALE:String(next.scale),DSH_DAFEIYU_BUBBLE_SCALE:String(next.bubbleScale),DSH_DAFEIYU_ACTIVITY_LEVEL:next.activityLevel,DSH_DAFEIYU_REDUCED_MOTION:next.reducedMotion?'1':'0',DSH_DAFEIYU_SOUND_ENABLED:next.soundEnabled?'1':'0',DSH_DAFEIYU_BUBBLE_MODE:next.bubbleMode});
    for(const m of reducer.setIncludeSubagents(next.includeSubagents))bridge.send(m);
    bridge.send(message('config',{...next,soundStates:['SUCCESS','ERROR'],bubbleStates:['SUCCESS','ERROR','WAITING'],openUrl:'dsh://open',openLabel:'打开 Harness'}));
  };
  const event=(session,event)=>{if(!bridge||!reducer)return;try{for(const m of reducer.handle(session,event))bridge.send(m);}catch(error){logger.warn?.('像素斑未能处理任务事件',error);}};
  const sessionDisposed=session=>{if(!bridge||!reducer)return;try{for(const m of reducer.disposeSession(session))bridge.send(m);}catch(error){logger.warn?.('像素斑未能移除任务状态',error);}};
  const unwatch=settings.watch(configure);configure(settings.get());
  return {event,sessionDisposed,configure,dispose(){disposed=true;unwatch?.();stop();}};
```

</details>

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:77-87](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L77-L87)

平台守卫、订阅和清理。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx,config={}){
  if(process.platform!=='win32'||process.arch!=='x64'){ctx.logger?.warn?.('当前版本仅支持 Windows x64 原生桌宠。');return;}
  ctx.effect(()=>{
    let controller,settings,offEvent,offDisposed;
    try{
      settings=createSettingsScope(ctx,Config,config,normalize);
      controller=createController(ctx,settings,prepareRuntime());
      offEvent=ctx.on('session/event',controller.event,{global:true});offDisposed=ctx.on('session/disposed',controller.sessionDisposed,{global:true});
    }catch(error){controller?.dispose();settings?.dispose?.();ctx.logger?.error?.('宇智波斑桌宠本次未能启动',error);return;}
    return()=>{offEvent?.();offDisposed?.();controller.dispose();settings.dispose?.();};
  },'madara-pixel-pet: native companion');
```

</details>

#### 缺口

- 没有执行 Windows 原生进程或核上游依赖内部
  **影响**：不能验证状态映射、窗口绘制与进程实际退出
  **进一步探讨**：隔离 Windows 环境观察状态和停止后进程。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行文件更新和失败处理有什么边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

运行目录按包版本划分；helper 不存在或大小不同才复制，上游可执行文件同大小变化不会触发替换。皮肤更新仅根据 pet-manifest.json 哈希，像素帧变化但清单字节未变时可能复用旧资源；只有复制成功后才写标记。prepareRuntime 失败会被 apply 捕获并记日志，插件不继续注册事件。当前材料检出没有工作树像素帧，Git 树列有帧路径；未把这个材料边界当作上游缺文件，也未验证打包文件完整性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:34-53](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L34-L53)

helper 大小检查、manifest 哈希和复制。

<details>
<summary>查看原文（20行）</summary>

```text
export function runtimeHome(env=process.env){return join(env.DSH_HOME||join(homedir(),'.dsh'),'plugins','madara-pixel-pet');}
export function prepareRuntime(options={}){
  const dependencyRoot=options.dependencyRoot||dirname(require.resolve('dsh-dafeiyu/package.json'));
  const base=options.runtimeRoot||runtimeHome();
  const directory=join(base,pkg.version),manifest=join(root,'assets','pet-manifest.json');
  const digest=createHash('sha256').update(readFileSync(manifest)).digest('hex');
  const executable=join(directory,'madara-pixel-pet-helper.exe');
  const original=join(dependencyRoot,'runtime','bin','win32-x64','dsh-dafeiyu-helper.exe');
  mkdirSync(directory,{recursive:true});
  if(!existsSync(executable)||statSync(executable).size!==statSync(original).size){const temporary=executable+'.new';copyFileSync(original,temporary);renameSync(temporary,executable);}
  const marker=join(directory,'skin.sha256');
  if(!existsSync(marker)||readFileSync(marker,'utf8')!==digest){
    const assets=join(directory,'assets');mkdirSync(assets,{recursive:true});
    cpSync(join(root,'assets','pet'),join(assets,'pet'),{recursive:true});
    for(const file of ['sounds','cursors','cursor_grab.cur','cursor_grabbing.cur']){const source=join(dependencyRoot,'assets',file);if(existsSync(source))cpSync(source,join(assets,file),{recursive:true});}
    copyFileSync(manifest,join(assets,'pet-manifest.json.new'));renameSync(join(assets,'pet-manifest.json.new'),join(assets,'pet-manifest.json'));
    // Write the marker only after all runtime assets are present.
    const bytes=Buffer.from(digest);const fs=require('node:fs');fs.writeFileSync(marker,bytes);
  }
  return {command:executable,args:[],tempDirectory:join(base,'tmp'),logFile:join(base,'helper.log'),env:{DSH_DAFEIYU_LAYOUT_PATH:join(base,'layout.json')}};
```

</details>

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:77-86](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L77-L86)

准备失败与清理。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx,config={}){
  if(process.platform!=='win32'||process.arch!=='x64'){ctx.logger?.warn?.('当前版本仅支持 Windows x64 原生桌宠。');return;}
  ctx.effect(()=>{
    let controller,settings,offEvent,offDisposed;
    try{
      settings=createSettingsScope(ctx,Config,config,normalize);
      controller=createController(ctx,settings,prepareRuntime());
      offEvent=ctx.on('session/event',controller.event,{global:true});offDisposed=ctx.on('session/disposed',controller.sessionDisposed,{global:true});
    }catch(error){controller?.dispose();settings?.dispose?.();ctx.logger?.error?.('宇智波斑桌宠本次未能启动',error);return;}
    return()=>{offEvent?.();offDisposed?.();controller.dispose();settings.dispose?.();};
```

</details>

#### 缺口

- 未检查所有资源字节、npm 包和同版本重装
  **影响**：无法确认旧资源风险是否实际发生
  **进一步探讨**：对同版本修改帧与同大小 helper 的隔离样本做更新测试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 兼容、资产和隐私条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 Windows x64、Node >=22.19、DSH 0.2.1-rc.2，精确依赖 dsh-dafeiyu 0.1.22；首次准备会复制依赖中的原生程序和资源并写入 DSH_HOME 下本地目录。README 声称不读取屏幕或凭据，源码能看到事件转发但未审上游 helper 的所有数据处理，不能证明完整隐私行为。角色是非官方同人，资产通知说明代码 MIT 不授予角色权利；商业再分发需另核权利。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-pet/package.json:1-27](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/package.json#L1-L27)

版本和平台声明。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=22.19",
    "dsh": "0.2.1-rc.2"
  },
  "license": "SEE LICENSE IN LICENSE",
  "keywords": [
    "deepseek-harness",
    "dsh-plugin",
    "madara",
    "pixel-art"
  ],
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "name": "dsh-madara-pixel-pet",
  "description": "宇智波斑像素桌宠：16 组透明动作，跟随 Harness 任务状态，支持拖动与点击互动。",
  "os": [
    "win32"
  ],
  "cpu": [
    "x64"
  ],
```

</details>

**依据 2 · 源码核查**：[packages/dsh-madara-pixel-pet/package.json:43-54](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/package.json#L43-L54)

精确依赖与 bundle。

<details>
<summary>查看原文（12行）</summary>

```text
  "dependencies": {
    "dsh-dafeiyu": "0.1.22",
    "@deepseek-ai/schemastery": "3.18.4"
  },
  "scripts": {
    "test": "node --test test/*.test.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:34-53](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L34-L53)

本地复制与运行目录。

<details>
<summary>查看原文（20行）</summary>

```text
export function runtimeHome(env=process.env){return join(env.DSH_HOME||join(homedir(),'.dsh'),'plugins','madara-pixel-pet');}
export function prepareRuntime(options={}){
  const dependencyRoot=options.dependencyRoot||dirname(require.resolve('dsh-dafeiyu/package.json'));
  const base=options.runtimeRoot||runtimeHome();
  const directory=join(base,pkg.version),manifest=join(root,'assets','pet-manifest.json');
  const digest=createHash('sha256').update(readFileSync(manifest)).digest('hex');
  const executable=join(directory,'madara-pixel-pet-helper.exe');
  const original=join(dependencyRoot,'runtime','bin','win32-x64','dsh-dafeiyu-helper.exe');
  mkdirSync(directory,{recursive:true});
  if(!existsSync(executable)||statSync(executable).size!==statSync(original).size){const temporary=executable+'.new';copyFileSync(original,temporary);renameSync(temporary,executable);}
  const marker=join(directory,'skin.sha256');
  if(!existsSync(marker)||readFileSync(marker,'utf8')!==digest){
    const assets=join(directory,'assets');mkdirSync(assets,{recursive:true});
    cpSync(join(root,'assets','pet'),join(assets,'pet'),{recursive:true});
    for(const file of ['sounds','cursors','cursor_grab.cur','cursor_grabbing.cur']){const source=join(dependencyRoot,'assets',file);if(existsSync(source))cpSync(source,join(assets,file),{recursive:true});}
    copyFileSync(manifest,join(assets,'pet-manifest.json.new'));renameSync(join(assets,'pet-manifest.json.new'),join(assets,'pet-manifest.json'));
    // Write the marker only after all runtime assets are present.
    const bytes=Buffer.from(digest);const fs=require('node:fs');fs.writeFileSync(marker,bytes);
  }
  return {command:executable,args:[],tempDirectory:join(base,'tmp'),logFile:join(base,'helper.log'),env:{DSH_DAFEIYU_LAYOUT_PATH:join(base,'layout.json')}};
```

</details>

**依据 4 · 作者声明**：[packages/dsh-madara-pixel-pet/README.md:15-21](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/README.md#L15-L21)

作者隐私和依赖声明。

```text
## 状态与隐私

显示真实会话任务、工具调用和待办状态。不读取屏幕，不读取或发布账号凭据。内部错误被限制在本插件内，避免阻断 Harness 的其他会话事件订阅。

## 来源与授权

原生运行库、任务状态转换和进程管理来自 QCYTSN/dsh-dafeiyu；本包新增独立的像素斑素材、动作清单、运行目录及生命周期与配置接入。详见 THIRD-PARTY-NOTICES.md、ASSET-NOTICE.md 和 LICENSE。人物是非官方同人外观。
```

**依据 5 · 作者声明**：[packages/dsh-madara-pixel-pet/ASSET-NOTICE.md:1-5](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/ASSET-NOTICE.md#L1-L5)

资产权利声明。

```text
# 素材与授权

本项目是用户定制的非官方同人外观。宇智波斑和《火影忍者》的角色名称、形象及相关权利属于各自权利人；项目不声称拥有这些角色权利，也不声称得到原作或 DeepSeek 官方认可。

项目代码适用 LICENSE 中的 MIT 许可；该代码许可不授予角色、商标或其他第三方素材的权利。人物素材由内置图像生成功能按用户要求生成。像素桌宠帧采用保留透明度的无损打包；完整图像生成提示词随源代码保留。
```

#### 缺口

- 未审上游二进制、目标系统和素材权利
  **影响**：不能确认隐私、兼容或再分发许可
  **进一步探讨**：核依赖来源、数据流和相关权利。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用并停止？

**研究主题**：采用判断、效果与总成本

#### 完整回答

已有兼容 Windows x64 宿主且愿意使用同人角色的用户可在隔离 profile 验证启用、任务事件、声音、缩放、拖动和关闭；先了解运行目录保留策略。若 helper 无法启动、任务状态不准、影响桌面操作或不接受数据与素材边界，应停用并回到原有状态界面；README 称日志和运行库保留，需核实后再按个人需要处理。没有目标环境测试，安装耗时、资源占用与显示质量均未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:65-86](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L65-L86)

禁用、订阅和清理。

<details>
<summary>查看原文（22行）</summary>

```text
  const stop=()=>{bridge?.stop('madara-pet-disabled');bridge=null;reducer=null;};
  const configure=(value)=>{
    const next=normalize(value);if(!next.enabled){stop();return;}launch(next);if(!bridge)return;
    Object.assign(bridge.options.env,{DSH_DAFEIYU_SCALE:String(next.scale),DSH_DAFEIYU_BUBBLE_SCALE:String(next.bubbleScale),DSH_DAFEIYU_ACTIVITY_LEVEL:next.activityLevel,DSH_DAFEIYU_REDUCED_MOTION:next.reducedMotion?'1':'0',DSH_DAFEIYU_SOUND_ENABLED:next.soundEnabled?'1':'0',DSH_DAFEIYU_BUBBLE_MODE:next.bubbleMode});
    for(const m of reducer.setIncludeSubagents(next.includeSubagents))bridge.send(m);
    bridge.send(message('config',{...next,soundStates:['SUCCESS','ERROR'],bubbleStates:['SUCCESS','ERROR','WAITING'],openUrl:'dsh://open',openLabel:'打开 Harness'}));
  };
  const event=(session,event)=>{if(!bridge||!reducer)return;try{for(const m of reducer.handle(session,event))bridge.send(m);}catch(error){logger.warn?.('像素斑未能处理任务事件',error);}};
  const sessionDisposed=session=>{if(!bridge||!reducer)return;try{for(const m of reducer.disposeSession(session))bridge.send(m);}catch(error){logger.warn?.('像素斑未能移除任务状态',error);}};
  const unwatch=settings.watch(configure);configure(settings.get());
  return {event,sessionDisposed,configure,dispose(){disposed=true;unwatch?.();stop();}};
}
export function apply(ctx,config={}){
  if(process.platform!=='win32'||process.arch!=='x64'){ctx.logger?.warn?.('当前版本仅支持 Windows x64 原生桌宠。');return;}
  ctx.effect(()=>{
    let controller,settings,offEvent,offDisposed;
    try{
      settings=createSettingsScope(ctx,Config,config,normalize);
      controller=createController(ctx,settings,prepareRuntime());
      offEvent=ctx.on('session/event',controller.event,{global:true});offDisposed=ctx.on('session/disposed',controller.sessionDisposed,{global:true});
    }catch(error){controller?.dispose();settings?.dispose?.();ctx.logger?.error?.('宇智波斑桌宠本次未能启动',error);return;}
    return()=>{offEvent?.();offDisposed?.();controller.dispose();settings.dispose?.();};
```

</details>

**依据 2 · 作者声明**：[packages/dsh-madara-pixel-pet/README.md:7-13](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/README.md#L7-L13)

作者安装、保留和运行说明。

```text
支持 Windows x64，已验证 Harness 0.2.1-rc.2。通过官方桌面应用的「插件 → 添加插件」选择 dsh-madara-pixel-pet-1.0.0.tgz，安装后启用。依赖会从原作者的 dsh-dafeiyu@0.1.22 自动安装；无需单独启用大肥鱼 bundle。

在本插件的配置中调整角色大小、气泡大小、空闲动作频率、减少动态、提示音和气泡显示。角色可拖动，松手播放落地；不同位置点击或双击触发互动。随 Harness 启动和退出。

如果已经启用原版大肥鱼，两者会各显示一个角色。只想保留斑时，在插件管理中关闭大肥鱼，保留本插件。关闭或卸载本插件会停止斑的进程；设置、日志和本地运行库保留供重装使用。

本插件不会修改大肥鱼文件，也不需要管理员权限。运行目录是 DSH_HOME/plugins/madara-pixel-pet；未指定 DSH_HOME 时使用 ~/.dsh/plugins/madara-pixel-pet。首次启动会把原作者预编译运行库和本包的像素帧复制到独立目录。首次联网安装仍需下载上游依赖；运行时不调用图像生成或模型 API。
```

#### 缺口

- 未在 Windows 和真实会话操作
  **影响**：不能保证关闭、恢复或资源消耗
  **进一步探讨**：用可回退配置观察进程和保留文件。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 内容完整性校验是否值得改善更新？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证方案：为 helper 与所有资源生成内容摘要，并在更新前检查，降低同大小可执行文件或未改 manifest 的帧变化被漏掉的可能。代价是多读文件及版本维护复杂度；若发布保证每次变更均更换版本与清单，当前机制可能已足够。以同版本替换与正常升级样本比较检查耗时、误复制和漏检；没有原型或实验。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-madara-pixel-pet/index.js:38-51](https://github.com/BossKrabs/product/blob/2eb032cb14be44c35501757fd4f3f25449730a17/packages/dsh-madara-pixel-pet/index.js#L38-L51)

现有大小和 manifest 校验方式。

<details>
<summary>查看原文（14行）</summary>

```text
  const directory=join(base,pkg.version),manifest=join(root,'assets','pet-manifest.json');
  const digest=createHash('sha256').update(readFileSync(manifest)).digest('hex');
  const executable=join(directory,'madara-pixel-pet-helper.exe');
  const original=join(dependencyRoot,'runtime','bin','win32-x64','dsh-dafeiyu-helper.exe');
  mkdirSync(directory,{recursive:true});
  if(!existsSync(executable)||statSync(executable).size!==statSync(original).size){const temporary=executable+'.new';copyFileSync(original,temporary);renameSync(temporary,executable);}
  const marker=join(directory,'skin.sha256');
  if(!existsSync(marker)||readFileSync(marker,'utf8')!==digest){
    const assets=join(directory,'assets');mkdirSync(assets,{recursive:true});
    cpSync(join(root,'assets','pet'),join(assets,'pet'),{recursive:true});
    for(const file of ['sounds','cursors','cursor_grab.cur','cursor_grabbing.cur']){const source=join(dependencyRoot,'assets',file);if(existsSync(source))cpSync(source,join(assets,file),{recursive:true});}
    copyFileSync(manifest,join(assets,'pet-manifest.json.new'));renameSync(join(assets,'pet-manifest.json.new'),join(assets,'pet-manifest.json'));
    // Write the marker only after all runtime assets are present.
    const bytes=Buffer.from(digest);const fs=require('node:fs');fs.writeFileSync(marker,bytes);
```

</details>

#### 缺口

- 无更新故障频率与原型
  **影响**：不能证明增加哈希值得
  **进一步探讨**：以真实发布约束和故障样本测量。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
