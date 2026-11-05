# 竹知了

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)

源码版本：[01f2c0e](https://github.com/imsai-sh/zhuzhiliao/tree/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5)

<!-- BEGIN META -->
[![GitHub ★ 2,875](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C875&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/imsai-sh/zhuzhiliao)
<!-- END META -->

> **功能**：在浏览器中模拟甩动传统竹知了，可按住画圈、自动甩或使用手机体感，并随动作发出模拟叫声。

> **亮点**：[Q01](#research-q01) 的录音声部把角速度和绳长比例变成响度与节奏，使操作者能改变何时发声；[Q02](#research-q02) 则让同一物理状态驱动可选的 3D 姿态，切回手绘时仍沿用原模拟。

> **主要限制**：[Q03](#research-q03) 的离线能力分为本地 HTML 与预缓存两条路径。预缓存失败或首页收到 HTTP 错误响应时，页面可能无法离线恢复，且本地 HTML 的 2D 路径仍依赖浏览器允许 Web Audio。

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
  - [Q01 · 按住画圈与播放一段知了录音相比，用户多做成了什么？](#detail-section-11)
  - [Q02 · 3D 视图改变了哪些反馈，输入、计数和音频由谁控制？](#detail-section-12)
  - [Q03 · 单文件、离线 PWA 与发声分别受什么条件约束？](#detail-section-13)
  - [Q04 · 从 Harness 目录进入时，应该把它接入宿主还是当独立网页阅读？](#detail-section-14)
  - [Q05 · 能否用现有状态给首次使用者解释静音原因？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想回顾或演示竹知了的读者可以在浏览器里画圈，让虚拟甩杆带动竹筒发声。

录音便于直接展示叫声，真实玩具提供触感和实体运动。浏览器模拟提供可控制的音画反馈，触感和声学还原程度仍需对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 动作驱动声音 | 让操作者控制叫声时机与节奏 | 浏览器须允许音频运行，录音解码失败可使用合成 |
| 手绘与 3D | 用不同画面表现同一运动状态 | 3D 依赖模块加载与 WebGL |
| 离线缓存 | 在已缓存时尝试断网打开首页 | 注册依赖安全上下文，首次断网无法预缓存 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持脚本和 Canvas 的浏览器 | 基础玩法必需 | 更新和呈现玩具 | 无法交互 |
| Web Audio 和用户激活 | 听见声音时必需 | 解锁并驱动音频 | 优先尝试页面提供的解锁方式，仍无声可只观察画面 |
| WebGL、同目录 3D 文件 | 3D 模式必需 | 加载和渲染程序模型 | 初始化不可用时沿用手绘路径 |
| 安全上下文和可读静态资源 | PWA 预缓存必需 | 注册 Worker 并缓存核心资源 | 保留本地 HTML 作 2D 路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 打开 | 读者在允许的个人使用范围内打开页面 | 看到手绘或 3D 玩具 |
| 互动 | 按住画圈并根据画面调整动作 | 观察绳和竹筒运动，尝试听见随速度变化的声音 |
| 恢复 | 无声时点按，3D 初始化不可用时用手绘 | 记录具体浏览器和模式，区别画面、音频和缓存问题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 金额及资源消耗未知 | 打开、解锁与首响耗时未知 | 2D 路径无需构建，3D 需要附加文件 |
| 持续使用 | 2D 与 3D 耗电差未知 | 适应手势或体感所需时间未知 | 体感和 PWA 取决于环境 |
| 失败恢复 | 资源重新加载开销未知 | 切换模式和复核缓存所需时间未知 | 受限存储的计数不可指望跨页面恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可控发声 | 角速度和绳长比例驱动响度，采样速率随转速变化 | 手感、听感和用户首响表现 |
| 渲染选择 | 初始化失败保留手绘，成功后 3D 消费原物理状态 | 低端设备代价与 WebGL 中途故障表现 |

> **思考**：[Q03](#research-q03) 的离线能力分为本地 HTML 与预缓存两条路径。预缓存失败或首页收到 HTTP 错误响应时，页面可能无法离线恢复，且本地 HTML 的 2D 路径仍依赖浏览器允许 Web Audio。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的录音声部把角速度和绳长比例变成响度与节奏，使操作者能改变何时发声；[Q02](#research-q02) 则让同一物理状态驱动可选的 3D 姿态，切回手绘时仍沿用原模拟。

同一组模拟状态可以驱动两种显示，便于按渲染条件取舍。[Q02](#research-q02) 核查的导入异常处理覆盖初始化，逐帧渲染的恢复仍需另测。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的离线能力分为本地 HTML 与预缓存两条路径。预缓存失败或首页收到 HTTP 错误响应时，页面可能无法离线恢复，且本地 HTML 的 2D 路径仍依赖浏览器允许 Web Audio。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 对源码学习可先对照指针目标、角速度和音频更新，再比较手绘与 3D 消费同一状态的方式。若在个人设备试玩时受模块或图形环境限制，可保留手绘模式。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交的网页入口、交互链和 3D 回退来自静态核查。实际听感、离线恢复和静音提示效果仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.html、3d/boot3d.js、3d/model.js、sw.js、LICENSE 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓网页源码、渲染接口、许可文字和 Service Worker。Web Audio、体感、浏览器离线恢复和设备性能未实测。
- 下一步：比较同一动作在 2D 和 3D 的首响及帧时间；再分别测已缓存与首次离线打开，并记录音频解锁和计数保存。

**分析版本**

- **仓库**：[imsai-sh/zhuzhiliao](https://github.com/imsai-sh/zhuzhiliao)
- **版本号**：未声明（[固定提交 01f2c0e](https://github.com/imsai-sh/zhuzhiliao/tree/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在现有转速和解锁提示上增加短时静音原因反馈，有可能减少首次操作者的无效重试。以首响时间和误导率对照现有界面，收益缺失或误导增加即否定。

比较同一动作在 2D 和 3D 的首响及帧时间；再分别测已缓存与首次离线打开，并记录音频解锁和计数保存。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 570 | 472 | 59 | — |
| .md | source | 2 | 204 | — | — | 3110 |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/imsai-sh/zhuzhiliao/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/imsai-sh/zhuzhiliao/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/imsai-sh/zhuzhiliao/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器版竹知了怎样把动作转成可感知的反馈，目录读者在什么条件下能使用它？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 按住画圈与播放一段知了录音相比，用户多做成了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

想回顾或演示传统玩具的人，可以用指针移动甩杆，并尝试让竹筒在绳拉紧时达到发声条件。指针按下会取消自动甩并更新目标坐标，触屏还会上移锚点。物理循环用甩杆与竹筒的相对位置计算角速度，按转速和绳长比例驱动发声强度。录音声部的音量、速率和音高也随状态变化。播放现成录音能听到音色，这个页面让操作者控制发声时机与节奏。自动甩也能把状态推到发声区间，因而有声音只能说明玩具进入发声状态，不能据此判断操作者掌握了手势。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-42](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/README.md#L36-L42)

作者描述指针、自动甩和体感三种入口。

```text
## 玩法

直接用浏览器打开 `index.html` 即可（无需构建、无需联网）。

- **按住屏幕画圈**：像甩真玩具一样，转得越快叫得越响（触屏时锚点会自动抬到指尖上方，避免手挡住小蝉）
- **自动甩**：不想动手就点它（空格键也行）
- **甩手机**（手机端，需 HTTPS 或本地文件）：握住手机划圈，重力方向在机身坐标里转动，直接驱动甩杆（iOS 首次需授权动作传感器；普通 http 局域网地址下浏览器不派发传感器事件，该按钮会自动隐藏）
```

**依据 2 · 源码核查**：[index.html:1247-1265](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1247-L1265)

按下和移动事件更新甩杆目标，手动按下关闭自动甩。

<details>
<summary>查看原文（19行）</summary>

```text
cv.addEventListener('pointerdown', e => {
  if(pointer.down) return;                 // 已有手指在甩，忽略误触的第二指
  pointer.down = true;
  pointer.id = e.pointerId;
  // 拇指按住时玩具画在指尖正下会被手挡住，触摸输入把锚点抬到指尖上方
  pointer.lift = e.pointerType === 'touch' ? Math.min(110, ROPE_LEN*0.9) : 0;
  interacted = true;
  cv.classList.add('holding');
  cv.setPointerCapture(e.pointerId);
  if(auto.on) setAuto(false);
  target.x = e.clientX;
  target.y = Math.max(12, e.clientY - pointer.lift);
  ensureAudio(true);
});
cv.addEventListener('pointermove', e => {
  if(!pointer.down || e.pointerId !== pointer.id) return;
  target.x = e.clientX;
  target.y = Math.max(12, e.clientY - pointer.lift);
});
```

</details>

**依据 3 · 源码核查**：[index.html:768-784](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L768-L784)

坐标和竹筒状态转换为绳方向的角速度。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[index.html:798-803](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L798-L803)

以绳长比例和转速组合成平滑发声强度。

```text
  ropeDist = Math.hypot(tube.x - stick.x, tube.y - stick.y);
  taut = clamp((ropeDist/ROPE_LEN - 0.88)/0.12, 0, 1);
  drive = clamp((rps - 1.1)/2.6, 0, 1);
  const tgt = Math.pow(drive, 1.25)*taut;
  active += (tgt - active)*Math.min(1, dt*(tgt > active ? 10 : 3.2));

```

**依据 5 · 源码核查**：[index.html:703-714](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L703-L714)

录音声部的响度、速率和音高受该状态驱动。

<details>
<summary>查看原文（12行）</summary>

```text
function updateAudio(){
  if(!AC || AC.state !== 'running' || !au || !au.mode) return;
  const t = AC.currentTime;
  // 总响度
  au.master.gain.setTargetAtTime(0.85*Math.pow(active, 1.3), t, 0.07);

  if(au.mode === 'sample'){
    // 甩得越快回放越快越高；再叠每圈相位的音高微摆(张力/多普勒感)
    const rate = clamp(Math.pow(rps/RECORDED_RPS, 0.7), 0.6, 1.5);
    au.sample.playbackRate.setTargetAtTime(active > 0.02 ? rate : 0.9, t, 0.09);
    au.sample.detune.setTargetAtTime(50*Math.sin(theta + 0.9)*clamp(active*1.6, 0, 1), t, 0.04);
    return;
```

</details>

#### 缺口

- 没有与录音或实物的用户对照
  **影响**：无法判断互动是否更容易理解、是否还原手感或能形成重复使用
  **进一步探讨**：对同一演示任务比较录音、浏览器画圈与实物的首响、理解和主观还原度

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 3D 视图改变了哪些反馈，输入、计数和音频由谁控制？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口将本地 Three.js 文件映射为模块，加载 WebGL 层成功后每帧传入甩杆、竹筒、转速、绳长和发声强度。渲染层以角加速度和竹筒移动速度近似计算两翼的弹簧阻尼运动，以绳长差控制垂度，并让发声强度驱动鼓面发光。模拟、声音和计数仍由页面更新函数处理，切换时只改变绘制分支。初始化不能创建 WebGL 渲染器会返回空值，导入失败也保持手绘路径。该回退位于加载阶段，逐帧调用没有同样的异常处理，不能据此保证渲染中途出错时自动切回。音频解码失败另走合成声部，与 3D 开关分离。

#### 证据与依据

**依据 1 · 源码核查**：[index.html:69-71](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L69-L71)

Three.js 来自项目内的 vendor 文件。

```text
<script type="importmap">
{"imports":{ "three":"./3d/vendor/three.module.min.js" }}
</script>
```

**依据 2 · 源码核查**：[index.html:1130-1152](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1130-L1152)

模块初始化、切换按钮及导入错误处理。

<details>
<summary>查看原文（23行）</summary>

```text
let toy3d = null, use3d = false;
let want3d = true;
try{ want3d = localStorage.getItem('zzl_3d') !== '0'; }catch(_){}
const STICK_TILT3D = Math.PI/2 - 1.15;   // 与 2D 版杆倾角一致（屏幕系→世界系换算）
function toyScale(){ return clamp(Math.min(W, H)*0.155, 64, 88); }  // 筒身高对应像素
function set3d(on){
  use3d = !!(on && toy3d);
  d3Btn.classList.toggle('on', use3d);
  d3Btn.textContent = use3d ? '手绘小蝉' : '3D 小蝉';
  cv3d.style.display = use3d ? '' : 'none';
  try{ localStorage.setItem('zzl_3d', use3d ? '1' : '0'); }catch(_){}
}
import('./3d/boot3d.js').then(m => {
  toy3d = m.init(cv3d);
  if(!toy3d) return;
  toy3d.resize(W, H, DPR, toyScale());
  d3Btn.style.display = '';
  set3d(want3d);
}).catch(() => {});
d3Btn.addEventListener('click', e => {
  e.stopPropagation();
  set3d(!use3d);
});
```

</details>

**依据 3 · 源码核查**：[index.html:953-958](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L953-L958)

绘制分支消费同一组主页面状态。

```text
  if(use3d){
    toy3d.render({ now, dt, stick, tube, ropeLen: ROPE_LEN, ropeDist,
                   omega, active, stickTilt: STICK_TILT3D });
  }else{
    drawToy(now);
  }
```

**依据 4 · 源码核查**：[3d/boot3d.js:13-19](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/3d/boot3d.js#L13-L19)

初始化 WebGL 失败时返回空值。

```text
export function init(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (_) {
    return null;
  }
```

**依据 5 · 源码核查**：[3d/boot3d.js:79-119](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/3d/boot3d.js#L79-L119)

姿态、翅膀及绳垂度由主页面状态派生。

<details>
<summary>查看原文（41行）</summary>

```text
      const sx = px2wx(st.stick.x) / SCALE, sy = px2wy(st.stick.y) / SCALE;
      const tx = px2wx(st.tube.x) / SCALE, ty = px2wy(st.tube.y) / SCALE;

      // 头(鼓面)朝绳方向
      const headAngle = Math.atan2(sy - ty, sx - tx) - Math.PI / 2;
      // 甩得越快绕绳轴自旋越快，静止时缓慢回摆
      spin += (st.omega * 0.45 + Math.sin(st.now * 0.6) * 0.15) * dt;

      // —— 翅膀跟随晃动 ——
      // 气流吹开：随穿行速度张开；晃动跟随：绳向角加速度让左右翅一先一后甩尾；
      // 弹簧-阻尼积分产生滞后与过冲；高速时再叠高频振翅。
      const speed = Math.hypot(st.tube.vx || 0, st.tube.vy || 0) / SCALE;
      const alpha = clamp((st.omega - prevOmega) / dt, -60, 60);
      prevOmega = st.omega;
      const rest = 0.15 + Math.min(0.85, speed * 0.16)
                 + Math.sin(st.now * 2.1) * 0.02;          // 静置时轻微呼吸
      const kick = alpha * 0.016;                          // 甩尾激励（左右反相）
      const stepWing = (w, force) => {
        w.v += ((force - w.a) * WING_STIFF - w.v * WING_DAMP) * dt;
        w.a += w.v * dt;
        return w.a;
      };
      const flutter = Math.min(1, speed * 0.10 + st.active) * Math.sin(st.now * 46) * 0.22;
      const wl = stepWing(wingL, rest - kick) + flutter;
      const wr = stepWing(wingR, rest + kick) + flutter * 0.85;

      // 绳松弛量 → 垂度（换算成模型单位）
      const sag = Math.max(0, (st.ropeLen - st.ropeDist) * 0.55) / SCALE;

      model.userData.drivePose({
        stick: { x: sx, y: sy },
        tube: { x: tx, y: ty },
        headAngle,
        spin,
        tilt: 0.14 + st.active * 0.10,   // 轻微出屏倾斜，转快时更立体
        stickTilt: st.stickTilt,
        wingL: wl, wingR: wr, sag,
      }, st.now);
      model.userData.setSing(st.active);

      renderer.render(scene, camera);
```

</details>

**依据 6 · 源码核查**：[3d/model.js:356-360](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/3d/model.js#L356-L360)

发声参数驱动模型发光。

```text
  root.userData.setSing = (v) => {
    meshes['membrane-top'].material.emissiveIntensity = v * 0.85;
  };

  root.userData.tick = (dt, t) => {
```

**依据 7 · 源码核查**：[index.html:603-614](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L603-L614)

录音数据解码失败会调用合成兜底。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 8 · 源码核查**：[index.html:798-812](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L798-L812)

发声强度与音频更新保持在页面循环。

<details>
<summary>查看原文（15行）</summary>

```text
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

#### 缺口

- 不同设备下的帧率、耗电和 WebGL 中途丢失表现未知
  **影响**：难以判断 3D 的长时间代价和恢复体验
  **进一步探讨**：在相同手势下比较 2D、3D 的帧时间与耗电，并单独记录上下文丢失时的画面和音频

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 单文件、离线 PWA 与发声分别受什么条件约束？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

单独保留 HTML 时，可用页面内的 2D 和嵌入音频路径。3D 还要能加载本地模块且建立 WebGL。PWA 缓存需要浏览器支持 Service Worker、当前为安全上下文且协议不是 file。安装要成功预缓存整组资源，资源缺失可使安装失败。导航缓存只在 fetch 拒绝时接管，HTTP 错误响应仍会作为响应返回，代码还会尝试把它写到首页缓存。断网前应检查已由 Worker 接管以及首页资源确实可用，持有 HTML 则可走独立的 2D 路径。出声还需浏览器允许 Web Audio 运行，手势触发解锁，AAC 解码错误改走合成。无痕或存储受限时计数保留于页面内存，保存失败没有提示，关闭页面后不应指望恢复。现金支出、首响耗时和维护成本均无测量。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-42](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/README.md#L38-L42)

作者说明直接打开 HTML 及体感权限条件。

```text
直接用浏览器打开 `index.html` 即可（无需构建、无需联网）。

- **按住屏幕画圈**：像甩真玩具一样，转得越快叫得越响（触屏时锚点会自动抬到指尖上方，避免手挡住小蝉）
- **自动甩**：不想动手就点它（空格键也行）
- **甩手机**（手机端，需 HTTPS 或本地文件）：握住手机划圈，重力方向在机身坐标里转动，直接驱动甩杆（iOS 首次需授权动作传感器；普通 http 局域网地址下浏览器不派发传感器事件，该按钮会自动隐藏）
```

**依据 2 · 源码核查**：[index.html:1276-1279](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1276-L1279)

页面用触摸结束、点击或键盘事件申请音频解锁。

```text
// 音频解锁只认这些事件：Android Chrome 上触摸授予激活的是 touchend
// (pointerup 在它之前派发、拿不到激活)，click/keydown 覆盖按钮和键盘
['touchend', 'click', 'keydown'].forEach(type =>
  document.addEventListener(type, () => ensureAudio(true), { capture: true, passive: true }));
```

**依据 3 · 源码核查**：[index.html:603-614](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L603-L614)

嵌入采样解码失败切至合成路径。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 4 · 源码核查**：[index.html:1360-1363](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1360-L1363)

安全上下文和协议限制，注册失败静默。

```text
/* —— Service Worker：安卓 Chrome 的安装提示以此为门槛，顺带离线可玩 —— */
if('serviceWorker' in navigator && window.isSecureContext && location.protocol !== 'file:'){
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
```

**依据 5 · 源码核查**：[sw.js:4-14](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/sw.js#L4-L14)

包括 3D 文件在内的核心资源批量预缓存。

<details>
<summary>查看原文（11行）</summary>

```text
const CACHE = 'zzl-v1';
const CORE = [
  './', './manifest.webmanifest', './apple-touch-icon.png',
  './icon-192.png', './icon-512.png',
  './3d/boot3d.js', './3d/model.js',
  './3d/vendor/three.module.min.js', './3d/vendor/OrbitControls.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
```

</details>

**依据 6 · 源码核查**：[sw.js:24-50](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/sw.js#L24-L50)

导航请求返回网络响应，只有拒绝才查缓存，静态请求检查 ok。

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

**依据 7 · 源码核查**：[index.html:1342-1354](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1342-L1354)

更新界面后延时尝试存储，失败静默。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

#### 缺口

- 离线、许可提示和存储状态的具体浏览器差异未知
  **影响**：无法量化首次试玩和故障恢复开销
  **进一步探讨**：逐项比较本地 HTML、首次断网、缓存后断网、错误导航响应和禁用本地存储的实际表现

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从 Harness 目录进入时，应该把它接入宿主还是当独立网页阅读？

**研究主题**：采用判断

#### 完整回答

本轮核查的固定提交为独立浏览器玩具。README 提到的 Fish Pocket 和 DSH 1024Store 链向不同仓库，页面的启动入口则是浏览器加载 index.html，随后处理指针输入、帧更新和 Web Audio。固定树未见插件包清单、宿主导出、工具注册或会话接线。要在 DSH 会话中增加工具或命令的人可以退出该条目的安装路径。想学习交互实现的人可以阅读源码，或按仓库许可在自己控制的设备上本地打开网页并从指针和 2D 模式开始。固定许可文字只列出阅读、个人修改和本地运行等授权，公开部署、再分发和商业使用须先取得作者书面授权。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/README.md#L3-L12)

当前仓库自述为玩具，两个 DSH 项目是外部链接。

<details>
<summary>查看原文（10行）</summary>

```text
一转就"哇哇"叫的传统玩具，Web 模拟版。零依赖单文件，手机优先。

**在线试玩：<https://imsai.top>**

> [!TIP]
> **新开源项目：[Fish Pocket](https://github.com/imsai-sh/fish-pocket)**
>
> 让 DeepSeek Harness 运行在 iPhone 和 iPad 上，随时随地使用。欢迎 Star 关注、一起共建。
>
> 往期推荐：[DSH 1024Store](https://github.com/imsai-sh/dsh-1024store)——DeepSeek Harness 的开源插件市场，在线搜索、安装和排行 dsh 插件：<https://deepseek1024.com>。
```

</details>

**依据 2 · 作者声明**：[README.md:36-42](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/README.md#L36-L42)

使用入口是浏览器页面。

```text
## 玩法

直接用浏览器打开 `index.html` 即可（无需构建、无需联网）。

- **按住屏幕画圈**：像甩真玩具一样，转得越快叫得越响（触屏时锚点会自动抬到指尖上方，避免手挡住小蝉）
- **自动甩**：不想动手就点它（空格键也行）
- **甩手机**（手机端，需 HTTPS 或本地文件）：握住手机划圈，重力方向在机身坐标里转动，直接驱动甩杆（iOS 首次需授权动作传感器；普通 http 局域网地址下浏览器不派发传感器事件，该按钮会自动隐藏）
```

**依据 3 · 源码核查**：[index.html:1154-1170](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1154-L1170)

页面直接推进更新、绘制和状态提示。

<details>
<summary>查看原文（17行）</summary>

```text
function frame(now){
  // 有些嵌入环境不派发 resize 事件，每帧自查尺寸变化（0 尺寸视为瞬态，忽略）
  if(window.innerWidth > 0 &&
     (window.innerWidth !== W || window.innerHeight !== H)) resize();
  // rAF 出现大间隙说明页面被冻结过(部分 WebView 不派发 visibilitychange)，宽限期重置
  if(now - last > 1000) acAdvanceWall = performance.now();
  const dt = Math.min(0.05, (now - last)/1000) || 0.016;
  last = now;
  update(dt);
  draw(now/1000, dt);
  hudTimer -= dt;
  if(hudTimer <= 0){
    hudTimer = 0.15;
    rpsEl.textContent = rps.toFixed(1);
    syncUnlock();
  }
  requestAnimationFrame(frame);
```

</details>

**依据 4 · 源码核查**：[index.html:1247-1265](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1247-L1265)

Canvas 是实际用户输入入口。

<details>
<summary>查看原文（19行）</summary>

```text
cv.addEventListener('pointerdown', e => {
  if(pointer.down) return;                 // 已有手指在甩，忽略误触的第二指
  pointer.down = true;
  pointer.id = e.pointerId;
  // 拇指按住时玩具画在指尖正下会被手挡住，触摸输入把锚点抬到指尖上方
  pointer.lift = e.pointerType === 'touch' ? Math.min(110, ROPE_LEN*0.9) : 0;
  interacted = true;
  cv.classList.add('holding');
  cv.setPointerCapture(e.pointerId);
  if(auto.on) setAuto(false);
  target.x = e.clientX;
  target.y = Math.max(12, e.clientY - pointer.lift);
  ensureAudio(true);
});
cv.addEventListener('pointermove', e => {
  if(!pointer.down || e.pointerId !== pointer.id) return;
  target.x = e.clientX;
  target.y = Math.max(12, e.clientY - pointer.lift);
});
```

</details>

**依据 5 · 源码核查**：[LICENSE:14-28](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/LICENSE#L14-L28)

区分本地研究和需另行授权的使用范围。

<details>
<summary>查看原文（15行）</summary>

```text
一、授予的权利

在完整遵守本许可的前提下，任何人可以：

1. 阅读、研究本软件的源码；
2. 在自己拥有或控制的设备上本地运行本软件；
3. 为学习、研究或个人使用的目的修改本软件。

二、未授予的权利（须事先取得作者书面授权）

1. 再分发本软件或其修改版——无论是否收费，无论以源码、编译产物还是打包形式；
2. 将本软件或其修改版部署到第三方可访问的位置，或据此提供任何形式的对外服务，
   包括但不限于公开网站、小程序、App、API、SDK；
3. 任何商业使用，包括在含广告、付费、引流或其他商业目的的场景中使用；
4. 移除、遮蔽或篡改本软件中的版权声明、作者署名或本许可文件。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用现有状态给首次使用者解释静音原因？

**研究主题**：新假设与验证

#### 完整回答

当前页面已显示转速，并调用解锁提示同步逻辑。转速数字单独无法解释为什么转动时仍安静：发声强度同时受绳长比例和转速门槛影响，音频链还要求上下文正在运行。可验证一个界面假设：保留原有转速与解锁提示，仅在手动甩且持续静音时，根据现有状态显示继续加速、拉紧绳或点按启声的当前首要原因。测试让首次体验者在同设备、同任务下随机使用原版或该提示版，分别尝试低速、绳松与音频未解锁。记录首响时间、错误重试、提示闪烁和误导率。如果首响和错误重试没有改善，或者误导增多，就否定该提示方案。

#### 证据与依据

**依据 1 · 源码核查**：[index.html:1162-1169](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L1162-L1169)

原页面已经刷新速度并同步音频解锁提示。

```text
  update(dt);
  draw(now/1000, dt);
  hudTimer -= dt;
  if(hudTimer <= 0){
    hudTimer = 0.15;
    rpsEl.textContent = rps.toFixed(1);
    syncUnlock();
  }
```

**依据 2 · 源码核查**：[index.html:798-803](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L798-L803)

同样转速可以因绳长比例不同而产生不同强度。

```text
  ropeDist = Math.hypot(tube.x - stick.x, tube.y - stick.y);
  taut = clamp((ropeDist/ROPE_LEN - 0.88)/0.12, 0, 1);
  drive = clamp((rps - 1.1)/2.6, 0, 1);
  const tgt = Math.pow(drive, 1.25)*taut;
  active += (tgt - active)*Math.min(1, dt*(tgt > active ? 10 : 3.2));

```

**依据 3 · 源码核查**：[index.html:703-707](https://github.com/imsai-sh/zhuzhiliao/blob/01f2c0e373f2f12519b383080bd8cc3ebad8b4d5/index.html#L703-L707)

音频上下文须处于运行状态。

```text
function updateAudio(){
  if(!AC || AC.state !== 'running' || !au || !au.mode) return;
  const t = AC.currentTime;
  // 总响度
  au.master.gain.setTargetAtTime(0.85*Math.pow(active, 1.3), t, 0.07);
```

#### 缺口

- 未实现提示对照，也未观察首次用户的实际困惑
  **影响**：提示的辨识价值和噪声代价均属假设
  **进一步探讨**：在相同设备上对照原有数字、解锁提示与分原因反馈

[返回分类](../../views/categories/OTHER.md) · [返回首页](../../../README.md)
