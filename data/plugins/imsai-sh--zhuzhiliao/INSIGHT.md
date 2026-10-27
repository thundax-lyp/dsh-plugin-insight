# 竹知了

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

分析版本：[199e203](https://github.com/imsai-sh/zhuzhiliao/tree/199e203b038ffb515f3a21189a29da4b4fb8518f)

<!-- BEGIN META -->
[![GitHub ★ 2,880](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C880&color=yellow&logo=github&style=flat)](https://github.com/imsai-sh/zhuzhiliao)
<!-- END META -->

> **实现功能**：在浏览器中模拟竹知了玩具的甩动、发声与本机圈数记录。

> **核心亮点**：相对静态视频或录音，以角速度和绳张力共同驱动交互声音，增量属于玩具体验设计；不构成DSH能力。见[Q01](#research-q01)。

> **风险与缺陷**：它并非DSH插件，完整PWA/3D也不等于单文件离线；源码公开不授权第三方部署或再分发。见[Q03](#research-q03)。

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
  - [Q01 · 它是什么工程，与 DSH 有什么关系？](#detail-section-11)
  - [Q02 · 物理、发声、存储与可选3D如何接线？](#detail-section-12)
  - [Q03 · 离线、浏览器权限和分发条件是否支持采用？](#detail-section-13)
  - [Q04 · 该工程应如何采用，能推导什么新假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：传统玩具爱好者在手机浏览器通过画圈或传感器体验竹知了；它是独立Web项目。

录音播放或玩具视频是体验基线；DSH扩展任务则没有对应实现，不能用玩具效果替代插件验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 浏览器甩动与发声 | 独立数字玩具体验 | Canvas/Web Audio；非DSH能力 |
| 本机圈数 | 记录手动交互 | 仅浏览器存储，清理后会丢失 |
| 可选3D | 叠加视觉呈现 | 依赖WebGL与资源，失败回2D |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Canvas/Web Audio浏览器 | 必需 | 图形和声音 | 对应能力不可用 |
| 安全上下文/传感器授权 | 体感模式必需 | 动作输入 | 回到触控或自动甩 |
| WebGL及Three资源 | 3D可选 | 叠加渲染 | 回到2D |
| 作者许可范围 | 本地使用必要条件 | 决定允许的用途 | 不自行公开部署或再分发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户按许可在受控设备打开本地HTML | 页面可见，不交给DSH加载 |
| 交互 | 用户首次点击解锁声音并拖动画圈 | 速度与声音联动；失败检查音频权限 |
| 降级 | 用户无法体感或3D时选触控/2D | 仍可体验主物理与声音链 |
| 退出 | 用户关闭页面 | 本机计数仅保存在浏览器存储 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载HTML及可选资源，金额未知 | 音频解锁、可选传感器授权；耗时未知 | DSH安装不适用 |
| 持续使用 | 音频、Canvas与可选WebGL资源 | 交互体验；耗时按个人任务 | 能耗未测，PWA有后台更新 |
| 失败恢复 | 重载与资源重取，金额未知 | 切回2D或拖动模式 | 清数据会丢本机计数 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 互动声音 | 物理状态驱动采样/合成链 | 拟真、端到端延迟 |
| 本机记录 | localStorage累加人工圈数 | 清存储后的恢复 |
| DSH扩展 | 材料明确独立Web类型 | 未提供DSH集成 |

> **思考**：它并非DSH插件，完整PWA/3D也不等于单文件离线；源码公开不授权第三方部署或再分发。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对静态视频或录音，以角速度和绳张力共同驱动交互声音，增量属于玩具体验设计；不构成DSH能力。见[Q01](#research-q01)。

相对静态视频或录音，以角速度和绳张力共同驱动交互声音，增量属于玩具体验设计；不构成DSH能力。见[Q01](#research-q01)。

物理状态归主页面、渲染可选且初始化失败回退，是值得独立学习的分层；复用思想需自己实现或获得适用授权。SW的静态资源更新说明离线与联网生命周期要分开评价，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

它并非DSH插件，完整PWA/3D也不等于单文件离线；源码公开不授权第三方部署或再分发。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

不推荐作为DSH插件；许可允许的个人本地阅读与体验是不同任务。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

独立Web玩具机制可核查，未发现DSH入口；拟真和节能效果未实测，呈现模式对照为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、LICENSE、index.html、sw.js、3d/boot3d.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查独立Web源码、PWA与3D接线及作者许可文本；不运行浏览器，不做法律意见。
- 下一步：先确认研究目标是个人交互设计；呈现模式对照使用相同输入轨迹与设备，测辨识、延迟和能耗，不因有3D代码宣称体验提升。

**分析版本**

- **仓库**：[imsai-sh/zhuzhiliao](https://github.com/imsai-sh/zhuzhiliao)
- **版本号**：未声明（[固定提交 199e203](https://github.com/imsai-sh/zhuzhiliao/tree/199e203b038ffb515f3a21189a29da4b4fb8518f)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是固定同一物理轨迹，比较纯音频、2D与3D模式的拟真感和卡顿；若3D无辨识增益且更耗资源则保留2D默认。见[Q04](#research-q04)。

先确认研究目标是个人交互设计；呈现模式对照使用相同输入轨迹与设备，测辨识、延迟和能耗，不因有3D代码宣称体验提升。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 570 | 472 | 59 | — |
| .md | source | 2 | 202 | — | — | 3070 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/imsai-sh/zhuzhiliao/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查竹知了是否实现DSH任务及其独立Web玩具机制与采用边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么工程，与 DSH 有什么关系？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

竹知了是面向手机浏览器的传统发声玩具模拟，输入是画圈拖动、自动甩或动作传感器，合格结果是画面与声音随甩动变化。README中的DSH内容是另一个Awesome清单的推广链接，不是本工程的加载入口；根目录没有插件package清单。相对只播放录音或观看玩具视频，它将绳系质点的转动状态驱动发声和视觉，提供可交互体验，属于浏览器玩具设计。它不提供模型工具、DSH会话流程或宿主插件注册，因此不能作为可安装DSH插件推荐；这不否认其独立交互价值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L1-L10)

作者定位Web玩具，DSH只在其他清单推广中出现

<details>
<summary>查看原文（10行）</summary>

```text
# 竹知了

一转就"哇哇"叫的传统玩具，Web 模拟版。零依赖单文件，手机优先。

**在线试玩：<https://imsai.top>**

> [!TIP]
> **新开源项目：[Awesome DeepSeek Harness Plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)**
>
> 面向 DeepSeek harness 插件生态的 Awesome 清单，欢迎 Star 和共建。
```

</details>

**依据 2 · 作者声明**：[README.md:34-40](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L34-L40)

实际用户操作是浏览器交互

```text
## 玩法

直接用浏览器打开 `index.html` 即可（无需构建、无需联网）。

- **按住屏幕画圈**：像甩真玩具一样，转得越快叫得越响（触屏时锚点会自动抬到指尖上方，避免手挡住小蝉）
- **自动甩**：不想动手就点它（空格键也行）
- **甩手机**（手机端，需 HTTPS 或本地文件）：握住手机划圈，重力方向在机身坐标里转动，直接驱动甩杆（iOS 首次需授权动作传感器；普通 http 局域网地址下浏览器不派发传感器事件，该按钮会自动隐藏）
```

**依据 3 · 源码核查**：[index.html:768-802](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/index.html#L768-L802)

物理角速度及绳张力参与发声驱动

<details>
<summary>查看原文（35行）</summary>

```text
  const k = 1 - Math.exp(-dt*26);
  stick.x += (target.x - stick.x)*k;
  stick.y += (target.y - stick.y)*k;

  // 定步长积分
  let acc = dt;
  const h = 1/240;
  while(acc > 1e-6){ const s = Math.min(h, acc); physStep(s); acc -= s; }

  // 角速度(发声核心)：绳方向的转动快慢
  theta = Math.atan2(tube.y - stick.y, tube.x - stick.x);
  let dth = theta - prevTheta;
  while(dth >  Math.PI) dth -= TAU;
  while(dth < -Math.PI) dth += TAU;
  omega += (dth/dt - omega)*Math.min(1, dt*9);
  prevTheta = theta;
  rps = Math.abs(omega)/TAU;

  // 手动甩出的圈数计入「哇」——自动甩不算数
  if(!auto.on && active > 0.3){
    revAccum += Math.abs(dth);
    if(revAccum >= TAU){
      const n = Math.floor(revAccum/TAU);
      revAccum -= n*TAU;
      addWah(n);
    }
  }else{
    revAccum = 0;
  }

  ropeDist = Math.hypot(tube.x - stick.x, tube.y - stick.y);
  taut = clamp((ropeDist/ROPE_LEN - 0.88)/0.12, 0, 1);
  drive = clamp((rps - 1.1)/2.6, 0, 1);
  const tgt = Math.pow(drive, 1.25)*taut;
  active += (tgt - active)*Math.min(1, dt*(tgt > active ? 10 : 3.2));
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 物理、发声、存储与可选3D如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主页面用1/240秒子步调用physStep，再从绳方向变化平滑估计角速度，将每秒圈数和绳张紧度组合为active并更新声音。AudioContext优先解码内嵌采样，解码异常转入合成声部，声卡链有总增益、压缩器和分析器；静置8秒后挂起线程。手动圈数在自动模式关闭且active达阈值时累加，经800毫秒延迟写localStorage；存储异常静默降级，不把本机计数当全站数据。可选3D只接收主页面物理状态，WebGL初始化失败返回null，物理与声音仍归主页面所有。可借鉴的是把互动状态、音频和渲染职责分开并提供回退；新项目复用机制需重新实现或取得授权，不能把源码公开视作通用复用许可。

#### 证据与依据

**依据 1 · 源码核查**：[index.html:587-614](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/index.html#L587-L614)

采样解码失败回退合成声部

<details>
<summary>查看原文（28行）</summary>

```text
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if(!Ctx) return;
  AC = new Ctx();
  AC.resume().catch(() => {});
  acTimeLast = 0; acAdvanceWall = performance.now();

  // 公共输出链：总闸 → 压限 → 分析器 → 扬声器
  const master = AC.createGain(); master.gain.value = 0;
  const comp = AC.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 8;
  comp.attack.value = 0.004; comp.release.value = 0.18;
  const analyser = AC.createAnalyser(); analyser.fftSize = 1024;
  master.connect(comp); comp.connect(analyser); analyser.connect(AC.destination);
  au = { master, analyser, mode: null };

  // 解码内嵌录音；任何一步失败都回退合成
  try{
    if(!sampleBytes){
      const bin = atob(ZZL_SAMPLE);
      sampleBytes = new Uint8Array(bin.length);
      for(let i = 0; i < bin.length; i++) sampleBytes[i] = bin.charCodeAt(i);
    }
    // decodeAudioData 会 detach 传入的 buffer，给副本以便重建时复用
    AC.decodeAudioData(sampleBytes.slice().buffer,
      buf => startSampleVoice(buf),
      () => startSynthVoice());
  }catch(_){ startSynthVoice(); }
}
```

</details>

**依据 2 · 源码核查**：[index.html:772-812](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/index.html#L772-L812)

物理子步、角速度、人工圈数与音频休眠

<details>
<summary>查看原文（41行）</summary>

```text
  // 定步长积分
  let acc = dt;
  const h = 1/240;
  while(acc > 1e-6){ const s = Math.min(h, acc); physStep(s); acc -= s; }

  // 角速度(发声核心)：绳方向的转动快慢
  theta = Math.atan2(tube.y - stick.y, tube.x - stick.x);
  let dth = theta - prevTheta;
  while(dth >  Math.PI) dth -= TAU;
  while(dth < -Math.PI) dth += TAU;
  omega += (dth/dt - omega)*Math.min(1, dt*9);
  prevTheta = theta;
  rps = Math.abs(omega)/TAU;

  // 手动甩出的圈数计入「哇」——自动甩不算数
  if(!auto.on && active > 0.3){
    revAccum += Math.abs(dth);
    if(revAccum >= TAU){
      const n = Math.floor(revAccum/TAU);
      revAccum -= n*TAU;
      addWah(n);
    }
  }else{
    revAccum = 0;
  }

  ropeDist = Math.hypot(tube.x - stick.x, tube.y - stick.y);
  taut = clamp((ropeDist/ROPE_LEN - 0.88)/0.12, 0, 1);
  drive = clamp((rps - 1.1)/2.6, 0, 1);
  const tgt = Math.pow(drive, 1.25)*taut;
  active += (tgt - active)*Math.min(1, dt*(tgt > active ? 10 : 3.2));

  // 完全静置 8s 后挂起音频线程省电；任何交互的 ensureAudio 都会恢复
  if(active < 0.02 && rps < 0.15 && !pointer.down && !auto.on && !motion.on){
    idleTime += dt;
    if(idleTime > 8 && AC && AC.state === 'running') AC.suspend().catch(() => {});
  }else{
    idleTime = 0;
  }

  updateAudio();
```

</details>

**依据 3 · 源码核查**：[index.html:1333-1355](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/index.html#L1333-L1355)

本机计数持久化及存储异常降级

<details>
<summary>查看原文（23行）</summary>

```text
let myWah = 0;
try{
  myWah = parseInt(localStorage.getItem('zzl_mywah') || '0', 10) || 0;
  localStorage.removeItem('zzl_uid');   // 旧版全站计数的访客标识，后端已下线，清掉
}catch(_){ /* 无痕模式等 localStorage 不可用时静默降级 */ }

const fmt = n => n.toLocaleString('zh-Hans-CN');
function renderMine(){ stEls.mine.textContent = fmt(myWah); }

let mySaveTimer = 0;
function addWah(n){
  myWah += n;
  renderMine();
  stEls.mineWrap.classList.remove('minepop');
  void stEls.mineWrap.offsetWidth;      // 重启动画
  stEls.mineWrap.classList.add('minepop');
  if(!mySaveTimer){
    mySaveTimer = setTimeout(() => {
      mySaveTimer = 0;
      try{ localStorage.setItem('zzl_mywah', String(myWah)); }catch(_){}
    }, 800);
  }
}
```

</details>

**依据 4 · 源码核查**：[3d/boot3d.js:1-18](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/3d/boot3d.js#L1-L18)

3D叠加层与初始化失败返回

<details>
<summary>查看原文（18行）</summary>

```text
// 3D 渲染层引导：在主站 2D 画布之上叠一层透明 WebGL，
// 每帧接收主站物理状态（甩杆锚点/竹筒质点/转速/发声强度），
// 把程序化 3D 模型摆到对应位姿。物理、声音、计数全部留在主站。
//
// 主站通过动态 import() 加载本模块：file:// 直开或 WebGL 不可用时
// import 失败/init 返回 null，主站自动回落 2D 手绘小蝉。
import * as THREE from 'three';
import { createZhuzhiliaoModel } from './model.js';

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const clampDt = (dt) => (dt > 0 && dt < 0.05 ? dt : 0);

export function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (_) {
    return null;
```

</details>

#### 缺口

- 没有真实移动设备上的声音、触控和能耗对照
  **影响**：不能确认拟真感、延迟与节电效果
  **进一步探讨**：在相同设备对比录音播放与交互版本的延迟、崩溃和电量，按浏览器列结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 离线、浏览器权限和分发条件是否支持采用？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

2D主体验依赖浏览器Canvas和Web Audio，首次触摸/点击解锁音频；动作传感器模式另需安全上下文和iOS授权，不满足时应回到拖动或自动甩。README称单文件零依赖，源码另有可选Three.js渲染和Service Worker，不能把整个3D/PWA部署也叫没有附属资源。SW对导航网络优先、静态资源stale-while-revalidate，因此线上PWA会进行更新请求；作者“不再联网”应收窄为计数不上传，而非所有页面请求都消失。离线主文件与联网PWA是两种条件。许可允许受控设备本地运行和个人修改，明确不授予再分发、第三方部署及商业用途；本轮记录文中限制，不作法律推断。首次读取或本地体验需下载资源和权限选择，持续需浏览器音频/图形资源，失败恢复可刷新或切2D，清理浏览器数据会丢本机圈数；金额、工时、兼容范围均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-40](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L36-L40)

传感器安全上下文和权限前提

```text
直接用浏览器打开 `index.html` 即可（无需构建、无需联网）。

- **按住屏幕画圈**：像甩真玩具一样，转得越快叫得越响（触屏时锚点会自动抬到指尖上方，避免手挡住小蝉）
- **自动甩**：不想动手就点它（空格键也行）
- **甩手机**（手机端，需 HTTPS 或本地文件）：握住手机划圈，重力方向在机身坐标里转动，直接驱动甩杆（iOS 首次需授权动作传感器；普通 http 局域网地址下浏览器不派发传感器事件，该按钮会自动隐藏）
```

**依据 2 · 作者声明**：[README.md:118-129](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L118-L129)

作者明确许可使用与限制

<details>
<summary>查看原文（12行）</summary>

```text
## 许可与声明

**本项目不是 OSI 意义上的开源项目。** 源码公开是为了技术分享，完整条款见 [LICENSE](LICENSE)：

- **允许**：阅读研究源码、在自己拥有或控制的设备上本地运行、为学习或个人使用而修改
- **不授权**：再分发（含修改版，无论是否收费）、部署到第三方可访问的位置、对外提供任何
  形式的服务、任何商业使用、移除或篡改版权声明
- **内容限制**：不得用本项目或其修改版制作、传播侵犯他人合法权益的内容，包括未经许可
  使用真实人物的姓名、肖像、声音或其他人格标识；违反者许可自动终止

官方站点只有 <https://imsai.top>，其他域名上的部署均未经授权，与本项目和作者
无关——详见[页首声明](#竹知了)。需要超出上述范围的授权，请先联系作者取得书面许可。
```

</details>

**依据 3 · 源码核查**：[sw.js:24-50](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/sw.js#L24-L50)

PWA导航与静态资源存在网络更新请求

<details>
<summary>查看原文（27行）</summary>

```text
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  if (e.request.mode === 'navigate') {
    // 页面本体：网络优先，离线回退缓存
    e.respondWith(
      fetch(e.request).then(r => {
        const cp = r.clone();
        caches.open(CACHE).then(c => c.put('./', cp));
        return r;
      }).catch(() => caches.match('./'))
    );
    return;
  }

  // 静态资源：先出缓存，后台刷新
  e.respondWith(
    caches.match(e.request).then(hit => {
      const net = fetch(e.request).then(r => {
        if (r.ok) {
          const cp = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cp));
        }
        return r;
      }).catch(() => hit);
      return hit || net;
```

</details>

**依据 4 · 源码核查**：[index.html:1361-1363](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/index.html#L1361-L1363)

安全上下文才注册SW

```text
if('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:'){
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
```

#### 缺口

- README离线叙述与完整PWA/3D资源条件未统一
  **影响**：容易把单页2D离线能力扩大到所有模式
  **进一步探讨**：分别断网检查直接本地文件、首次PWA及缓存后PWA的完整资源依赖

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 该工程应如何采用，能推导什么新假设？

**研究主题**：新假设与验证、采用判断

#### 完整回答

对寻找DSH能力的读者，不推荐将本工程加入插件配置，因为已检查材料明确是独立玩具，DSH链接通往另一工程。对交互设计学习者，可在许可允许的本地范围阅读实现，比较采样回放与物理驱动的表达方式。由同一物理状态驱动声音与3D的分层可推导未验证假设：保持主状态不变，增加可切换的纯音频/2D/3D呈现，以检验视觉复杂度是否真正提高拟真感。最小验证固定同一触控输入轨迹，比较用户辨识、卡顿和能耗；若3D没有辨识收益且持续增加卡顿，就不应默认启用。此处仅是设计推导，未经授权不复制分发或部署。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L1-L10)

独立类型与DSH推广边界

<details>
<summary>查看原文（10行）</summary>

```text
# 竹知了

一转就"哇哇"叫的传统玩具，Web 模拟版。零依赖单文件，手机优先。

**在线试玩：<https://imsai.top>**

> [!TIP]
> **新开源项目：[Awesome DeepSeek Harness Plugins](https://github.com/imsai-sh/awesome-deepseek-harness-plugins)**
>
> 面向 DeepSeek harness 插件生态的 Awesome 清单，欢迎 Star 和共建。
```

</details>

**依据 2 · 源码核查**：[3d/boot3d.js:1-18](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/3d/boot3d.js#L1-L18)

渲染与物理分离提供可比较条件

<details>
<summary>查看原文（18行）</summary>

```text
// 3D 渲染层引导：在主站 2D 画布之上叠一层透明 WebGL，
// 每帧接收主站物理状态（甩杆锚点/竹筒质点/转速/发声强度），
// 把程序化 3D 模型摆到对应位姿。物理、声音、计数全部留在主站。
//
// 主站通过动态 import() 加载本模块：file:// 直开或 WebGL 不可用时
// import 失败/init 返回 null，主站自动回落 2D 手绘小蝉。
import * as THREE from 'three';
import { createZhuzhiliaoModel } from './model.js';

const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const clampDt = (dt) => (dt > 0 && dt < 0.05 ? dt : 0);

export function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (_) {
    return null;
```

</details>

**依据 3 · 作者声明**：[README.md:120-126](https://github.com/imsai-sh/zhuzhiliao/blob/199e203b038ffb515f3a21189a29da4b4fb8518f/README.md#L120-L126)

限制试用之外的分发方式

```text
**本项目不是 OSI 意义上的开源项目。** 源码公开是为了技术分享，完整条款见 [LICENSE](LICENSE)：

- **允许**：阅读研究源码、在自己拥有或控制的设备上本地运行、为学习或个人使用而修改
- **不授权**：再分发（含修改版，无论是否收费）、部署到第三方可访问的位置、对外提供任何
  形式的服务、任何商业使用、移除或篡改版权声明
- **内容限制**：不得用本项目或其修改版制作、传播侵犯他人合法权益的内容，包括未经许可
  使用真实人物的姓名、肖像、声音或其他人格标识；违反者许可自动终止
```

#### 缺口

- 呈现模式的需求与感知效果未测
  **影响**：不能把3D叠加当作已验证体验改进
  **进一步探讨**：在许可允许的个人研究范围先做呈现对照，再决定是否需要新的交互设计

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
