# dsh-cyber-particle

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e08111d](https://github.com/AKS1st/dsh-cyber-particle/tree/e08111d59df009454d9de6b8384907f697e038f6)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-cyber-particle)
<!-- END META -->

> **实现功能**：DSH Web Canvas 粒子网络背景，提供设置页与本地持久化。

> **核心亮点**：无需 Host 路由即可提供双语可调的穿透式粒子背景。详见[Q01](#research-q01)。

> **风险与缺陷**：prefers-reduced-motion 命中后初次不启动，但页面可见性恢复无条件 start；损坏本地配置直接入计算。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 粒子背景提供何种体验，是否涉及宿主业务？](#detail-section-11)
  - [Q02 · 粒子密度、颜色和资源如何调整？](#detail-section-12)
  - [Q03 · 减动效偏好与后台恢复是否保持一致？](#detail-section-13)
  - [Q04 · 持久化配置是否始终受 UI 的范围和格式约束？](#detail-section-14)
  - [Q05 · 何时适合启用，怎样改进持续动画？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户美化 Web 界面；纯装饰，不改变模型或业务流程。详见[Q01](#research-q01)。

静态皮肤已可美化界面；动态效果须证明观感收益大于持续帧耗/分心。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 动态背景 | 界面装饰 | 前台持续定时绘制 |
| 参数设置 | 调密度/速度/颜色 | 坏存储值未校验 |
| 减动效/暂停 | 初次与后台停 | 恢复前台会意外启动 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH Web slots/timer | 必需 | overlay/设置/定时 | 无界面/动画 |
| Canvas/localStorage | 体验必需 | 渲染/偏好 | 无动画或不持久 |
| 浏览器媒体/可见性事件 | 无障碍 | 减动效/后台暂停 | 当前恢复有缺口 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 安装 | Web profile 装/重启 | overlay 和设置页出现 |
| 调整 | 改数量/速度/颜色 | 即时生效并持久 |
| 检查 | 切后台与减动效 | 动画按偏好停 |
| 恢复 | 重置或卸载 | timer/样式释放 |

**效果与成本**

#### 成本

| 阶段 | 资源成本 | 人工投入 | 边界 |
| --- | --- | --- | --- |
| 安装 | DSH Web，金额未知 | 安装/重启 | 兼容未测 |
| 前台运行 | 约 30fps、最多 240 粒子两两比较 | 调设置/关动画 | CPU/GPU/电量未知 |
| 故障 | 本地配置损坏/动效不适 | 重置存储或卸载 | reduce 恢复有缺口 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 粒子网络 | Canvas 运动/连线 | 真实观感与帧率 |
| 设置 | 滑块/颜色/localStorage | 坏数据恢复稳定性 |
| 低干扰 | pointer-events:none/隐藏暂停 | 减动效跨后台持续生效 |

> **思考**：prefers-reduced-motion 命中后初次不启动，但页面可见性恢复无条件 start；损坏本地配置直接入计算。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：无需 Host 路由即可提供双语可调的穿透式粒子背景。详见[Q01](#research-q01)。

无需 Host 路由即可提供双语可调的穿透式粒子背景。详见[Q01](#research-q01)。

视口面积归一化与组件清理可复用；O(n²) 连线成本和减动效恢复缺口需测。详见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

prefers-reduced-motion 命中后初次不启动，但页面可见性恢复无条件 start；损坏本地配置直接入计算。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

作为个人装饰观察；减动效用户和低性能设备建议先关闭或等修复/性能验证。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核本地动画/清理；减动效仅首启门控，隐藏后恢复会重启动画；存储配置不校验。目标 GUI/性能未测。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、Host/Client；未运行插件、宿主、浏览器或性能测试；旧 META 仅复用。
- 下一步：真实浏览器测 reduce+隐藏恢复、偏好动态改变、坏 localStorage、前后台帧耗、电量和交互穿透。

**分析版本**

- **仓库**：[AKS1st/dsh-cyber-particle](https://github.com/AKS1st/dsh-cyber-particle)
- **版本号**：0.2.3（[固定提交 e08111d](https://github.com/AKS1st/dsh-cyber-particle/tree/e08111d59df009454d9de6b8384907f697e038f6)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是持续减动效监听、恢复配置校验和低帧率/静态模式，以真实帧耗和后台恢复验收。详见[Q05](#research-q05)。

真实浏览器测 reduce+隐藏恢复、偏好动态改变、坏 localStorage、前后台帧耗、电量和交互穿透。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 443 | 374 | 32 | — |
| .md | source | 2 | 111 | — | — | 960 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dsh-cyber-particle/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：粒子背景能否在可控资源和减动效条件下稳定提供装饰体验？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 粒子背景提供何种体验，是否涉及宿主业务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件给 DSH Web 加全屏穿透 Canvas 粒子网络和中英双语设置页，供想要动态界面装饰的个人用户。Host index.js 无业务行为，客户端仅使用 shell.overlay、settings.section 和本地存储，没有外部数据/模型能力；因此贡献是可定制的界面效果，不应推断效率提升。作者截图/跨屏一致性为展示或声明，本轮未运行目标浏览器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-11](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/README.md#L1-L11)

作者描述装饰场景/无服务端行为

<details>
<summary>查看原文（11行）</summary>

```text
# cyber-particle — DeepSeek Harness 粒子网络背景插件

[English](./README.en.md) | 中文

为 DeepSeek Harness Web 界面提供动态粒子网络背景：灰白散点从屏幕边缘随机飞入、直线穿过界面、离开后从新的边缘再次进入；彼此距离小于阈值的粒子自动连线，形成不断变化的网状结构。

渲染在界面全屏覆盖层上，`pointer-events` 穿透，不影响鼠标/键盘交互，也不改动任何界面配色。无 npm 运行时依赖。

内置「设置 → 粒子背景」页：可实时调节粒子数量、半径、线条粗细、连线距离、移动速度，用调色板改粒子/线条颜色，一键重置为默认；调整即时生效并持久化到浏览器 `localStorage`，刷新页面或重启后自动恢复。设置页文案跟随 DSH 语言设置（中文 / English）。

> 服务端无任何行为：所有渲染与设置都在浏览器侧完成，不注册任何 webServer 路由，可被 dshmarket 像皮肤一样热切换（不产生路由冲突）。
```

</details>

**依据 2 · 源码核查**：[index.js:1-8](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/index.js#L1-L8)

Host 空壳

```text
/**
 * Cyber Particle Network — node half.
 *
 * 服务端侧无任何行为：全部渲染与设置都在浏览器侧完成（见 client.js），
 * 配置持久化到浏览器 localStorage，不注册 webServer 路由、不依赖宿主
 * 服务，因此可被 dshmarket 像皮肤一样热切换，不会产生重复路由冲突。
 */
export function apply() {}
```

**依据 3 · 源码核查**：[client.js:421-430](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L421-L430)

两个槽位注册

<details>
<summary>查看原文（10行）</summary>

```text
          // ---------- 注册 Slot ----------
          slots.inject('shell.overlay', () => slots.register(
            { name: 'shell.overlay', id: 'cybergrid-hud', order: -100 },
            () => React.createElement(ParticleOverlay, { store }),
          ))

          slots.inject('settings.section', () => slots.register(
            { name: 'settings.section', id: 'cyber-particle', order: 35, label: () => t('title'), locale: NS },
            (props) => React.createElement(ParticleSettings, { store, updateConfig, resetConfig, t: props.t }),
          ))
```

</details>

**依据 4 · 源码核查**：[client.js:316-322](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L316-L322)

pointerEvents none 和 aria-hidden

```text
            return React.createElement('div', {
              style: { position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 },
              'aria-hidden': true,
            }, React.createElement('canvas', {
              ref: setCanvasNode,
              style: { position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' },
            }))
```

#### 缺口

- 不同主题/屏幕实际观感和用户分心未测
  **影响**：不能证明性能或生产力收益
  **进一步探讨**：目标 GUI 比较可读性、交互穿透及偏好

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 粒子密度、颜色和资源如何调整？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端按视口面积相对 2560×1440 的平方根得 scale，限制 0.55–1.5；粒子数按 scale² 裁到 8–240，DPR 上限2。每帧约33ms 清 Canvas、更新位置并两两计算距离连线，越界从随机边缘重生；设置改动立即重算，localStorage 保存并可重置。页面隐藏时停 timer，组件卸载清订阅和监听。最大粒子数下成对比较 28,680 次/帧，真实 CPU/GPU/电量未测。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:157-211](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L157-L211)

参考分辨率/缩放/DPR 与配置派生

<details>
<summary>查看原文（55行）</summary>

```text
              const REF_W = 2560
              const REF_H = 1440
              const REF_AREA = REF_W * REF_H
              const rand = (a, b) => a + Math.random() * (b - a)

              let frame = 0
              let cw = 0
              let ch = 0
              let dpr = 1
              let scale = 1
              let cfg = store.get()

              let COUNT = 52
              let LINK = 180
              let LINE_W = 1.2
              let DOT_R = 2.2
              let SPD_MIN = 2.0
              let SPD_MAX = 4.2
              let DOT_FILL = 'rgba(125, 137, 153, 0.9)'
              let LINK_STYLES = []

              const buildLinkStyles = (hex) => {
                const rgb = hexToRgb(hex)
                const styles = []
                for (let i = 0; i <= 20; i++) {
                  styles.push('rgba(' + rgb + ', ' + (0.42 * (1 - i / 20)).toFixed(3) + ')')
                }
                return styles
              }

              const applySize = () => {
                const rw = canvasNode.clientWidth
                const rh = canvasNode.clientHeight
                if (rw === 0 || rh === 0) return false
                const nextDpr = clamp(window.devicePixelRatio || 1, 1, 2)
                const nextScale = clamp(Math.sqrt((rw * rh) / REF_AREA), 0.55, 1.5)
                const nextCfg = store.get()
                if (rw === cw && rh === ch && nextDpr === dpr && nextScale === scale && nextCfg === cfg) return true
                cw = rw
                ch = rh
                dpr = nextDpr
                scale = nextScale
                cfg = nextCfg
                COUNT = Math.round(clamp(cfg.count * scale * scale, 8, 240))
                LINK = cfg.linkDist * scale
                LINE_W = cfg.lineWidth * scale
                DOT_R = cfg.dotRadius * scale
                SPD_MIN = cfg.speed * (2 / 3)
                SPD_MAX = cfg.speed * 1.4
                DOT_FILL = hexToRgba(cfg.particleColor, 0.9)
                LINK_STYLES = buildLinkStyles(cfg.lineColor)
                canvasNode.width = Math.round(cw * dpr)
                canvasNode.height = Math.round(ch * dpr)
                c.setTransform(dpr, 0, 0, dpr, 0, 0)
                return true
```

</details>

**依据 2 · 源码核查**：[client.js:214-279](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L214-L279)

粒子运动/两两连线

<details>
<summary>查看原文（66行）</summary>

```text
              const spawn = (inside) => {
                let x, y, angle
                const w = cw
                const h = ch
                const edge = Math.floor(Math.random() * 4)
                if (edge === 0) { x = inside ? rand(0, w) : -24; y = rand(0, h); angle = rand(-1.1, 1.1) - Math.PI / 2 }
                else if (edge === 1) { x = inside ? rand(0, w) : w + 24; y = rand(0, h); angle = rand(-1.1, 1.1) + Math.PI / 2 }
                else if (edge === 2) { x = rand(0, w); y = inside ? rand(0, h) : -24; angle = rand(0.6, Math.PI - 0.6) }
                else { x = rand(0, w); y = inside ? rand(0, h) : h + 24; angle = rand(-Math.PI + 0.6, -0.6) }
                const speed = rand(SPD_MIN, SPD_MAX)
                return { x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed }
              }

              let particles = []
              const resizeParticles = () => {
                while (particles.length < COUNT) particles.push(spawn(true))
                if (particles.length > COUNT) particles.length = COUNT
              }

              if (!applySize()) return
              resizeParticles()

              const draw = () => {
                frame++
                if (frame % 12 === 0) {
                  if (!applySize()) return
                  resizeParticles()
                }
                const w = cw
                const h = ch
                c.clearRect(0, 0, w, h)
                for (const p of particles) {
                  p.x += p.vx
                  p.y += p.vy
                }
                for (let i = 0; i < particles.length; i++) {
                  const p = particles[i]
                  if (p.x < -30 || p.x > w + 30 || p.y < -30 || p.y > h + 30) {
                    particles[i] = spawn(false)
                  }
                }
                c.lineWidth = LINE_W
                for (let i = 0; i < particles.length; i++) {
                  for (let j = i + 1; j < particles.length; j++) {
                    const a = particles[i]
                    const b = particles[j]
                    const dx = a.x - b.x
                    const dy = a.y - b.y
                    const d2 = dx * dx + dy * dy
                    if (d2 < LINK * LINK) {
                      const t = 1 - Math.sqrt(d2) / LINK
                      c.strokeStyle = LINK_STYLES[Math.round(t * 20)]
                      c.beginPath()
                      c.moveTo(a.x, a.y)
                      c.lineTo(b.x, b.y)
                      c.stroke()
                    }
                  }
                }
                c.fillStyle = DOT_FILL
                for (const p of particles) {
                  c.beginPath()
                  c.arc(p.x, p.y, DOT_R, 0, Math.PI * 2)
                  c.fill()
                }
              }
```

</details>

**依据 3 · 源码核查**：[client.js:110-147](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L110-L147)

配置存储/恢复

<details>
<summary>查看原文（38行）</summary>

```text
          // 配置持久化到 localStorage（无服务端路由，无网络请求）。
          const STORAGE_KEY = 'cyber-particle:config'
          const STORAGE_LIMIT = 16 * 1024

          const persistConfig = (next) => {
            try {
              const value = JSON.stringify(next)
              if (value.length > STORAGE_LIMIT) return
              localStorage.setItem(STORAGE_KEY, value)
            } catch {
              // localStorage 不可用（隐私模式/配额）——保留内存态，本次会话有效。
            }
          }

          const updateConfig = (patch) => {
            store.set(patch)
            persistConfig(store.get())
          }

          const resetConfig = () => {
            store.set({ ...DEFAULTS })
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // 同上：清理失败忽略，下次写入会覆盖。
            }
          }

          // 启动时恢复持久化配置，读取失败静默（使用默认值）。
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const data = JSON.parse(raw)
              if (data && typeof data === 'object') store.set(data)
            }
          } catch {
            // 损坏的 JSON 或存储不可用——回退默认值。
          }
```

</details>

**依据 4 · 源码核查**：[client.js:281-314](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L281-L314)

timer、订阅/可见性清理

<details>
<summary>查看原文（34行）</summary>

```text
              draw()

              // 配置变化即时生效：重新派生尺寸/颜色并重建粒子池。
              const unsubscribe = store.subscribe(() => {
                if (applySize()) resizeParticles()
              })

              let reduce = false
              try {
                reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              } catch (e) { /* ignore */ }

              let timer = null
              const stop = () => {
                if (timer !== null) {
                  timer()
                  timer = null
                }
              }
              const start = () => {
                if (timer === null) timer = ctx.interval(draw, 33)
              }
              const onVisibility = () => {
                if (document.hidden) stop()
                else start()
              }
              document.addEventListener('visibilitychange', onVisibility)
              if (!reduce && !document.hidden) start()
              return () => {
                unsubscribe()
                document.removeEventListener('visibilitychange', onVisibility)
                stop()
              }
            }, [canvasNode, store])
```

</details>

#### 缺口

- 目标硬件帧耗和 30fps 稳定性未测
  **影响**：不能称低开销
  **进一步探讨**：各分辨率/性能档测帧耗、CPU/GPU/电量

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 减动效偏好与后台恢复是否保持一致？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

初次挂载会读 prefers-reduced-motion:reduce，命中则不启动动画；但 onVisibility 在页面从隐藏回前台时无条件调用 start，未再检查 reduce，因此减动效用户只要切走再回来就会开始动画。它也只在初次读取媒体查询，不订阅运行中的偏好变化。该缺口影响无障碍和持续资源；无需假设浏览器已实际触发，代码路径足以定位，真实表现仍需验证。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:288-313](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L288-L313)

初始 reduce 门控与可见性恢复无条件 start

<details>
<summary>查看原文（26行）</summary>

```text
              let reduce = false
              try {
                reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              } catch (e) { /* ignore */ }

              let timer = null
              const stop = () => {
                if (timer !== null) {
                  timer()
                  timer = null
                }
              }
              const start = () => {
                if (timer === null) timer = ctx.interval(draw, 33)
              }
              const onVisibility = () => {
                if (document.hidden) stop()
                else start()
              }
              document.addEventListener('visibilitychange', onVisibility)
              if (!reduce && !document.hidden) start()
              return () => {
                unsubscribe()
                document.removeEventListener('visibilitychange', onVisibility)
                stop()
              }
```

</details>

**依据 2 · 作者声明**：[README.md:5-9](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/README.md#L5-L9)

作者称持续动态效果

```text
为 DeepSeek Harness Web 界面提供动态粒子网络背景：灰白散点从屏幕边缘随机飞入、直线穿过界面、离开后从新的边缘再次进入；彼此距离小于阈值的粒子自动连线，形成不断变化的网状结构。

渲染在界面全屏覆盖层上，`pointer-events` 穿透，不影响鼠标/键盘交互，也不改动任何界面配色。无 npm 运行时依赖。

内置「设置 → 粒子背景」页：可实时调节粒子数量、半径、线条粗细、连线距离、移动速度，用调色板改粒子/线条颜色，一键重置为默认；调整即时生效并持久化到浏览器 `localStorage`，刷新页面或重启后自动恢复。设置页文案跟随 DSH 语言设置（中文 / English）。
```

#### 缺口

- 目标浏览器媒体查询与后台事件时序未测
  **影响**：不能保证减动效偏好始终有效
  **进一步探讨**：模拟 reduce+隐藏/恢复及偏好实时变化并断言 timer 停止

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持久化配置是否始终受 UI 的范围和格式约束？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

UI slider 限定范围且颜色选取器返回色值，但启动从 localStorage 读 JSON 后直接 store.set，没有逐字段类型、上下界或颜色校验。篡改或历史坏形状如 count 为非数字、负半径/超大速度会进入计算；hexToRgb 对无效色回黑，但数值的 clamp 遇 NaN 可变 NaN。一般浏览器设置正常写入则不会有此问题，风险主要是损坏、手动改值或旧版本迁移。存储失败只保内存态且不提示。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:95-147](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L95-L147)

store 合并/持久化/恢复无 schema

<details>
<summary>查看原文（53行）</summary>

```text
          // ---------- 共享配置 store ----------
          let config = { ...DEFAULTS }
          const listeners = new Set()
          const store = {
            get() { return config },
            set(next) {
              config = { ...config, ...next }
              for (const fn of listeners) fn(config)
            },
            subscribe(fn) {
              listeners.add(fn)
              return () => { listeners.delete(fn) }
            },
          }

          // 配置持久化到 localStorage（无服务端路由，无网络请求）。
          const STORAGE_KEY = 'cyber-particle:config'
          const STORAGE_LIMIT = 16 * 1024

          const persistConfig = (next) => {
            try {
              const value = JSON.stringify(next)
              if (value.length > STORAGE_LIMIT) return
              localStorage.setItem(STORAGE_KEY, value)
            } catch {
              // localStorage 不可用（隐私模式/配额）——保留内存态，本次会话有效。
            }
          }

          const updateConfig = (patch) => {
            store.set(patch)
            persistConfig(store.get())
          }

          const resetConfig = () => {
            store.set({ ...DEFAULTS })
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // 同上：清理失败忽略，下次写入会覆盖。
            }
          }

          // 启动时恢复持久化配置，读取失败静默（使用默认值）。
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const data = JSON.parse(raw)
              if (data && typeof data === 'object') store.set(data)
            }
          } catch {
            // 损坏的 JSON 或存储不可用——回退默认值。
          }
```

</details>

**依据 2 · 源码核查**：[client.js:187-211](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L187-L211)

原始 cfg 进入数学计算

<details>
<summary>查看原文（25行）</summary>

```text
              const applySize = () => {
                const rw = canvasNode.clientWidth
                const rh = canvasNode.clientHeight
                if (rw === 0 || rh === 0) return false
                const nextDpr = clamp(window.devicePixelRatio || 1, 1, 2)
                const nextScale = clamp(Math.sqrt((rw * rh) / REF_AREA), 0.55, 1.5)
                const nextCfg = store.get()
                if (rw === cw && rh === ch && nextDpr === dpr && nextScale === scale && nextCfg === cfg) return true
                cw = rw
                ch = rh
                dpr = nextDpr
                scale = nextScale
                cfg = nextCfg
                COUNT = Math.round(clamp(cfg.count * scale * scale, 8, 240))
                LINK = cfg.linkDist * scale
                LINE_W = cfg.lineWidth * scale
                DOT_R = cfg.dotRadius * scale
                SPD_MIN = cfg.speed * (2 / 3)
                SPD_MAX = cfg.speed * 1.4
                DOT_FILL = hexToRgba(cfg.particleColor, 0.9)
                LINK_STYLES = buildLinkStyles(cfg.lineColor)
                canvasNode.width = Math.round(cw * dpr)
                canvasNode.height = Math.round(ch * dpr)
                c.setTransform(dpr, 0, 0, dpr, 0, 0)
                return true
```

</details>

**依据 3 · 源码核查**：[client.js:325-386](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L325-L386)

正常 UI 滑块/颜色范围

<details>
<summary>查看原文（62行）</summary>

```text
          // ---------- 设置页 ----------
          const SLIDER_FIELDS = [
            { key: 'count', labelKey: 'count', min: 10, max: 120, step: 1, lowKey: 'few', highKey: 'many' },
            { key: 'dotRadius', labelKey: 'dotRadius', min: 0.5, max: 6, step: 0.1, lowKey: 'small', highKey: 'large' },
            { key: 'lineWidth', labelKey: 'lineWidth', min: 0.2, max: 4, step: 0.1, lowKey: 'thin', highKey: 'thick' },
            { key: 'linkDist', labelKey: 'linkDist', min: 40, max: 400, step: 5, lowKey: 'near', highKey: 'far' },
            { key: 'speed', labelKey: 'speed', min: 0.5, max: 8, step: 0.1, lowKey: 'slow', highKey: 'fast' },
          ]
          const COLOR_FIELDS = [
            { key: 'particleColor', labelKey: 'particleColor' },
            { key: 'lineColor', labelKey: 'lineColor' },
          ]

          function useStore(store) {
            const [value, setValue] = React.useState(store.get())
            React.useEffect(() => store.subscribe(setValue), [store])
            return value
          }

          // 把数值映射成定性档位，避免不同屏幕尺寸下绝对数值引起歧义。
          function describe(t, value, min, max, lowKey, highKey) {
            const r = clamp((value - min) / (max - min), 0, 1)
            if (r < 0.2) return t('very') + t(lowKey)
            if (r < 0.4) return t(lowKey)
            if (r < 0.6) return t('medium')
            if (r < 0.8) return t(highKey)
            return t('very') + t(highKey)
          }

          function ParticleSettings({ store, updateConfig, resetConfig, t }) {
            const cfg = useStore(store)

            const sliderRows = SLIDER_FIELDS.map((field) => {
              const value = Number(cfg[field.key])
              const level = describe(t, value, field.min, field.max, field.lowKey, field.highKey)
              return React.createElement('div', { className: 'cp-field', key: field.key },
                React.createElement('div', { className: 'cp-field-label' }, t(field.labelKey)),
                React.createElement('span', { className: 'cp-cap' }, t(field.lowKey)),
                React.createElement('input', {
                  className: 'cp-range',
                  type: 'range',
                  min: field.min,
                  max: field.max,
                  step: field.step,
                  value,
                  onChange: (e) => updateConfig({ [field.key]: Number(e.target.value) }),
                }),
                React.createElement('span', { className: 'cp-cap' }, t(field.highKey)),
                React.createElement('div', { className: 'cp-badge' }, level))
            })

            const colorRows = COLOR_FIELDS.map((field) => {
              const value = String(cfg[field.key] || '')
              return React.createElement('div', { className: 'cp-field', key: field.key },
                React.createElement('div', { className: 'cp-field-label' }, t(field.labelKey)),
                React.createElement('input', {
                  className: 'cp-color',
                  type: 'color',
                  value,
                  onChange: (e) => updateConfig({ [field.key]: e.target.value }),
                }),
                React.createElement('div', { className: 'cp-hex' }, value))
```

</details>

**依据 4 · 源码核查**：[client.js:29-37](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L29-L37)

无效颜色回黑

```text
      function hexToRgb(hex) {
        const h = String(hex || '').replace('#', '')
        if (!/^[0-9a-fA-F]{6}$/.test(h)) return '0, 0, 0'
        return parseInt(h.slice(0, 2), 16) + ', ' + parseInt(h.slice(2, 4), 16) + ', ' + parseInt(h.slice(4, 6), 16)
      }

      function hexToRgba(hex, alpha) {
        return 'rgba(' + hexToRgb(hex) + ', ' + alpha + ')'
      }
```

#### 缺口

- 坏数据发生率/具体画面影响未测
  **影响**：不能保证所有恢复值都安全
  **进一步探讨**：夹具覆盖非数字/极值/坏色和存储拒写

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时适合启用，怎样改进持续动画？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

它适合能容忍前台 33ms 定时绘制的个人美化场景，页面隐藏可暂停、关闭插件可释放样式/组件，但没有性能自适应或显式暂停开关。未验证改进：把 reduce 状态带入每次 visibilitychange，并监听 media query change；恢复配置先做 schema/range 校验，提供低帧率/静态模式和明显开关。验收应覆盖低性能、背景恢复、减动效、损坏 localStorage 和实际遮挡。当前推荐 observe。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:281-314](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L281-L314)

timer 和减动效逻辑

<details>
<summary>查看原文（34行）</summary>

```text
              draw()

              // 配置变化即时生效：重新派生尺寸/颜色并重建粒子池。
              const unsubscribe = store.subscribe(() => {
                if (applySize()) resizeParticles()
              })

              let reduce = false
              try {
                reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              } catch (e) { /* ignore */ }

              let timer = null
              const stop = () => {
                if (timer !== null) {
                  timer()
                  timer = null
                }
              }
              const start = () => {
                if (timer === null) timer = ctx.interval(draw, 33)
              }
              const onVisibility = () => {
                if (document.hidden) stop()
                else start()
              }
              document.addEventListener('visibilitychange', onVisibility)
              if (!reduce && !document.hidden) start()
              return () => {
                unsubscribe()
                document.removeEventListener('visibilitychange', onVisibility)
                stop()
              }
            }, [canvasNode, store])
```

</details>

**依据 2 · 源码核查**：[client.js:110-147](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L110-L147)

存储边界

<details>
<summary>查看原文（38行）</summary>

```text
          // 配置持久化到 localStorage（无服务端路由，无网络请求）。
          const STORAGE_KEY = 'cyber-particle:config'
          const STORAGE_LIMIT = 16 * 1024

          const persistConfig = (next) => {
            try {
              const value = JSON.stringify(next)
              if (value.length > STORAGE_LIMIT) return
              localStorage.setItem(STORAGE_KEY, value)
            } catch {
              // localStorage 不可用（隐私模式/配额）——保留内存态，本次会话有效。
            }
          }

          const updateConfig = (patch) => {
            store.set(patch)
            persistConfig(store.get())
          }

          const resetConfig = () => {
            store.set({ ...DEFAULTS })
            try {
              localStorage.removeItem(STORAGE_KEY)
            } catch {
              // 同上：清理失败忽略，下次写入会覆盖。
            }
          }

          // 启动时恢复持久化配置，读取失败静默（使用默认值）。
          try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (raw) {
              const data = JSON.parse(raw)
              if (data && typeof data === 'object') store.set(data)
            }
          } catch {
            // 损坏的 JSON 或存储不可用——回退默认值。
          }
```

</details>

**依据 3 · 源码核查**：[client.js:417-430](https://github.com/AKS1st/dsh-cyber-particle/blob/e08111d59df009454d9de6b8384907f697e038f6/client.js#L417-L430)

样式清理和槽位

<details>
<summary>查看原文（14行）</summary>

```text
          ctx.on('dispose', () => {
            if (styleEl.parentNode) styleEl.parentNode.removeChild(styleEl)
          })

          // ---------- 注册 Slot ----------
          slots.inject('shell.overlay', () => slots.register(
            { name: 'shell.overlay', id: 'cybergrid-hud', order: -100 },
            () => React.createElement(ParticleOverlay, { store }),
          ))

          slots.inject('settings.section', () => slots.register(
            { name: 'settings.section', id: 'cyber-particle', order: 35, label: () => t('title'), locale: NS },
            (props) => React.createElement(ParticleSettings, { store, updateConfig, resetConfig, t: props.t }),
          ))
```

</details>

#### 缺口

- 改进与性能测量未实现
  **影响**：不能计作现有能力或给资源成本数字
  **进一步探讨**：目标机性能与无障碍矩阵通过后复评

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
