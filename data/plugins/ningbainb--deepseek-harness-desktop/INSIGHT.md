# DeepSeek Harness Desktop（社区版）

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[98269f1](https://github.com/ningbainb/deepseek-harness-desktop/tree/98269f1334e09d886f23ce5ae02589c28e403b9e)

<!-- BEGIN META -->
[![GitHub ★ 869](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=869&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ningbainb/deepseek-harness-desktop)
<!-- END META -->

> **功能**：集成官方 DSH Runtime 和 Web UI 的社区桌面客户端，提供窗口、插件及桌面操作入口。

> **亮点**：[Q01](#research-q01) 显示项目的贡献是独立桌面环境集成，模型和Agent能力仍归官方Runtime；[Q02](#research-q02)的消费确认背压相对截断输出保留了更合理的完整性目标，不代表全部接线已验证。

> **主要限制**：[Q02](#research-q02) 已贯通主preload到renderer的消费确认链，但空窗口可发送超大帧，yield后推进确认也不等于最终绘制或落盘；[Q03](#research-q03)说明宿主不是第三方代码沙箱，不能把安装便利等同安全保证。

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
  - [Q01 · 独立桌面宿主为谁提供什么增量？](#detail-section-11)
  - [Q02 · 消费确认如何控制流积压且保留完整输出？](#detail-section-12)
  - [Q03 · 兼容声明与一次授权可以推出什么权限保证？](#detail-section-13)
  - [Q04 · 哪些人可以怎样控制桌面客户端试用？](#detail-section-14)
  - [Q05 · 等待消费确认时增加诊断能否减少误判卡死？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望用安装包进入DSH编程环境且理解本机执行权限的开发者，可在独立profile试用社区客户端。

自行运行官方DSH Web可提供核心Agent与模型能力；社区桌面增量按安装、窗口和宿主接线评估，不把官方Runtime能力算新贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面客户端 | 从安装包进入DSH会话 | 社区身份、未签名与平台Preview需核对 |
| Runtime适配 | 生命周期及能力接口 | 依赖兼容官方Runtime |
| 流控制 | 等待真实消费并限制积压 | 大帧可越字节窗口，需正确确认接线 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配平台的安装包 | 是 | Electron与官方Runtime集成 | 不跨平台沿用验收 |
| 模型线路 | 编程必需 | 模型调用 | 环境启动不代表任务可用 |
| Git | Git操作必需 | 工作区版本管理 | macOS/Linux需安装 |
| 权限与独立profile认知 | 试用必需 | 控制本机执行范围 | 不在关键环境试装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 下载 | 用户核对平台、发行与摘要 | 了解签名/Preview边界 |
| 配置 | 建独立配置并接模型 | 不覆盖唯一配置 |
| 观察 | 非关键项目检查输出与重启 | 缺失则保留诊断并停止 |
| 退出 | 保留项目和profile后回退 | 回官方Web或原版本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 桌面/Runtime下载与磁盘，量未知 | 核对未签名来源、配置模型 | macOS/Linux需系统Git |
| 持续 | 桌面资源和模型API，金额未知 | 维护社区/上游兼容 | 正式遥测政策须了解 |
| 恢复 | 备份profile及回退资源未知 | 排查输出、配置与升级 | 保留原项目及可用版本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 桌面入口 | 社区包整合环境与界面 | 安装节时和稳定性 |
| 流积压 | 累计确认与双窗口 | 所有消费者确认时机和大帧内存 |
| 编程交付 | 复用官方Runtime | 成果质量与总成本提升 |

> **思考**：[Q02](#research-q02) 已贯通主preload到renderer的消费确认链，但空窗口可发送超大帧，yield后推进确认也不等于最终绘制或落盘；[Q03](#research-q03)说明宿主不是第三方代码沙箱，不能把安装便利等同安全保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 显示项目的贡献是独立桌面环境集成，模型和Agent能力仍归官方Runtime；[Q02](#research-q02)的消费确认背压相对截断输出保留了更合理的完整性目标，不代表全部接线已验证。

[Q02](#research-q02)独立流状态机具有可移植价值，安全整数和递增确认避免重复或未来序号释放积压；单大帧例外与生产者调用纪律是移植必须保留的条件。Provider能力facade减少上游对象外露，但文档不是权限实现证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 已贯通主preload到renderer的消费确认链，但空窗口可发送超大帧，yield后推进确认也不等于最终绘制或落盘；[Q03](#research-q03)说明宿主不是第三方代码沙箱，不能把安装便利等同安全保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅建议能核对发行来源和权限的开发者用独立profile及非关键目录探索，先确认启动、完整输出和重启保留结果；权限或恢复不清立即停止，回到官方Web。不把作者Windows验收转写为本轮安装验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查RuntimeProvider与preload→Electron wait/sent→renderer yield后ack链；消费确认不等于最终绘制或持久化。发布和平台验收为作者报告，未在本轮执行；等待诊断未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/security-boundaries.md、apps/dsh-desktop/src/runtime-stream-flow.mjs、apps/dsh-desktop/src/runtime-provider.mjs、apps/dsh-desktop/src/preload-main.cjs、apps/dsh-desktop/src/runtime-electron-transport.mjs、apps/dsh-desktop/src/runtime-renderer-bootstrap.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中RuntimeProvider、主preload、Electron流生产者、renderer消费确认与流窗口源码级核查，结合作者产品与安全文档；未执行安装包、模型或目标测试，不宣称全客户端安全审计。
- 下一步：进一步研究先追踪真实消费确认与权限主链，再对超大帧、慢消费、窗口关闭及重启做定向对照；记录完整性、内存和定位时间，不在本轮执行。

**分析版本**

- **仓库**：[ningbainb/deepseek-harness-desktop](https://github.com/ningbainb/deepseek-harness-desktop)
- **版本号**：5.1.0（[固定提交 98269f1](https://github.com/ningbainb/deepseek-harness-desktop/tree/98269f1334e09d886f23ce5ae02589c28e403b9e)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 推导等待确认的诊断快照，先排除现有上层已实现，再用慢消费者比较定位耗时与重启次数；不伪造确认，不能改善定位则否定。

进一步研究先追踪真实消费确认与权限主链，再对超大帧、慢消费、窗口关闭及重启做定向对照；记录完整性、内存和定位时间，不在本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 393 | 86693 | 78470 | 3459 | — |
| .md | source | 325 | 26883 | — | — | 384221 |
| .cjs | source | 11 | 1215 | 1077 | 61 | — |
| .mjs | test | 316 | 51376 | 47399 | 937 | — |
| .mjs | example | 12 | 764 | 740 | 9 | — |
| .md | example | 4 | 44 | — | — | 402 |
| .js | source | 146 | 19280 | 17791 | 1563 | — |
| .ts | source | 430 | 61814 | 47510 | 9900 | — |
| .tsx | source | 103 | 19697 | 16718 | 1823 | — |
| .tsx | test | 51 | 6975 | 6082 | 298 | — |
| .ts | test | 236 | 34617 | 30291 | 1470 | — |

</details>

**活跃度**

[![Issue 未关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/ningbainb/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/ningbainb/deepseek-harness-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)

暂未获取：近30天新建。

统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：社区独立桌面宿主相对官方Web提供什么集成增量，背压及兼容材料能支持何种试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立桌面宿主为谁提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是社区桌面客户端，不是可直接安装的单个DSH插件或官方Desktop。面向希望从安装包进入编程会话、插件和桌面集成的用户，以官方Runtime/Web UI提供模型与Agent能力，本项目承担Electron与社区宿主接线。相对用户自行运行Web服务，安装包捆绑Node/DSH和Windows Git减少环境准备；托盘、桌面窗口和远程开发是集成范围，不能据此断言编程结果更好。RuntimeProvider把生命周期和可选能力隔在facade后，避免把上游对象当公开插件接口。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-54](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/README.md#L35-L54)

产品身份、依赖捆绑及平台验证声明。

<details>
<summary>查看原文（20行）</summary>

```text
**DeepSeek Harness Desktop** 是社区维护的开源 AI 编程桌面客户端。

DeepSeek 官方尚未正式发布独立 Desktop 产品；本项目把公开的官方 **DSH Runtime、Web UI 与官方仓库中的 Desktop 能力边界** 融合为 Windows、macOS 与 Linux 桌面应用，并在独立社区宿主中补齐插件、Skills、任务自动化、Git、远程开发和桌面体验。它不是 DeepSeek 官方客户端，也不使用或覆盖未来官方 Desktop 的应用身份、数据目录与更新源。

支持 **Windows 10 / 11 x64**；同时提供 **macOS 13+ Apple Silicon arm64 Preview** 与 **Linux x64 Preview**。项目采用 **BSD-3-Clause** 许可证。

安装包已包含 Node.js 与 DSH；Windows 同时内置 Git，macOS 与 Linux 的 Git 操作需要系统安装 Git。

[产品介绍](https://1521003.xyz/) · [下载最新版](https://github.com/ningbainb/deepseek-harness-desktop/releases/latest) · [使用文档](docs/desktop.md) · [更新日志](CHANGELOG.md)

### 5.1.0：三端同版，完整输出与简洁设置

[5.1.0 正式 Release](https://github.com/ningbainb/deepseek-harness-desktop/releases/tag/desktop-v5.1.0) 于 2026-10-25 15:09:51 UTC 发布，使用官方 NPM Runtime/SDK `0.2.1-rc.2` 与 Electron `44.0.0`，不修改官方源码。[正式标签运行 40199647851](https://github.com/ningbainb/deepseek-harness-desktop/actions/runs/40199647851) 在 `eb1223ddfee78eccadd76d8022501cd1806d9d3d` 三端与 publish 全成功。五个公开安装文件已独立下载，字节、SHA-256、GitHub digest 与合并清单一致；Windows updater SHA-512 和 manifest 也已验证。

- 消费确认与流式背压保留完整输出和历史；异步资源读取与 HMR 重扫保留授权、缓存及取消清理语义，不宣称普遍性能百分比。
- 安装目录逐项校验，注册表失败逐项恢复；技能市场首次启用需确认，反馈、翻译、自动更新及项目布局扫描默认关闭，来源替换采用可恢复事务。确认不是执行沙箱。
- 无框拓展坞保留 15 个导航、搜索、控件、高级详情、关键风险提示、选中态与键盘焦点；仅独立设置窗口不挂载浮动宠物，主会话宠物与保存配置保留。
- Windows core 28/28、packaged-full 44/44，无豁免；真实 Setup 新装、4.3.0/5.0.0/5.0.1 分别升级、同版覆盖、重启、卸载与旧 provider/会话数据保全通过。默认官方皮肤、侧栏折叠、模型接入、Skills、托盘及既有入口保留。

Windows Desktop 单测 1943/1943、零跳过；macOS/Linux 各 1906 通过、37 项既有平台跳过、零失败（总计各 1943），scripts 三端均 213/213。三端均未签名，macOS 未公证且要求 arm64/macOS 13+，macOS/Linux 为 Preview；Linux 本版仅 Ubuntu 22.04 原生 Runner 验证，不借用 Ubuntu 24 历史结果。同号 5.1.0 本地内测包须手动下载正式包覆盖，不承诺同号自动更新。三端公开载荷的正式 telemetry 配置已核实，匿名统计和 opt-out 政策不变；未提交生产事件或验证生产入库。
```

</details>

**依据 2 · 源码核查**：[apps/dsh-desktop/src/runtime-provider.mjs:7-43](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-provider.mjs#L7-L43)

能力表与方法映射显示宿主适配职责。

<details>
<summary>查看原文（37行）</summary>

```text
export const RUNTIME_CAPABILITY_IDS = Object.freeze([
  'runtime.lifecycle',
  'profile.paths',
  'workspace.register',
  'session.create',
  'session.observe',
  'host-service.register',
  'transport.fetch',
  'transport.stream',
  'runtime.observe',
  'support.evidence',
])

/** 3.0 adds matrix states without removing the 2.x degraded/unsupported values. */
export const RUNTIME_PROVIDER_SUPPORT_STATUSES = Object.freeze([
  'known-good',
  'supported',
  'candidate',
  'blocked',
  'degraded',
  'unsupported',
])

export const RUNTIME_PROVIDER_ERROR_CODES = Object.freeze({
  CAPABILITY_UNSUPPORTED: 'runtime-capability-unsupported',
  OPERATION_FAILED: 'runtime-provider-operation-failed',
  INVALID_CONFIGURATION: 'runtime-provider-invalid-configuration',
})

const OPTIONAL_METHODS = Object.freeze({
  'workspace.register': 'registerWorkspace',
  'session.create': 'createSession',
  'session.observe': 'subscribeSession',
  'host-service.register': 'registerHostService',
  'transport.fetch': 'fetch',
  'transport.stream': 'openDuplex',
})
```

</details>

#### 缺口

- 独立用户在同任务下的安装与编程收益未核查
  **影响**：不能把集成数量当效能
  **进一步探讨**：对比干净环境下启动官方Web与社区安装包的配置、失败和完成任务时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消费确认如何控制流积压且保留完整输出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

流控制器为每个sent项目递增序号并记录字节，窗口同时限制64帧及1MiB；acknowledge只接受安全整数、递增且不超过已发送序号，确认后移除所有此前帧并唤醒等待。wait在窗口不足时停止生产者推进，drain等待清空；两者均受AbortSignal取消。单个超大帧在空窗口允许发送，所以字节窗口不是任意帧的硬内存上限。这个机制用背压代替截断，正确性依赖消费端只在真正处理后确认、调用方先wait再sent，并保证取消传播；只读该模块不能证明所有通道接线均正确。

进一步跟踪真实接线：preload-main 66行设置flowControl:true；runtime-electron-transport 194—208行在读取前wait，按字节wait后sent分配序号再发给renderer，完成后drain；232—236行要求ack来自原sender与ownerFrame才转acknowledge。renderer-bootstrap 130—132行先yield给异步迭代调用方，只有调用方再次推进时才调用consumed；累计16帧或下一个零延迟计时器flush到preload ack。这能支持“消费推进后确认”的源码判断，不是刚入队就确认，但不证明浏览器最终绘制或任务内容持久化。

#### 证据与依据

**依据 1 · 源码核查**：[apps/dsh-desktop/src/runtime-stream-flow.mjs:3-18](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-stream-flow.mjs#L3-L18)

字节计量和可取消iterator next。

<details>
<summary>查看原文（16行）</summary>

```text
export const RUNTIME_STREAM_WINDOW_FRAMES = 64
export const RUNTIME_STREAM_WINDOW_BYTES = 1024 * 1024

export function runtimeStreamItemBytes(value) {
  return serialize(value).byteLength
}

export function abortableStreamNext(iterator, signal) {
  signal.throwIfAborted()
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
    Promise.resolve().then(() => {
      signal.throwIfAborted()
      return iterator.next()
    }).then(resolve, reject).finally(() => signal.removeEventListener('abort', abort))
```

</details>

**依据 2 · 源码核查**：[apps/dsh-desktop/src/runtime-stream-flow.mjs:22-60](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-stream-flow.mjs#L22-L60)

窗口、序号、累计确认及取消等待完整链。

<details>
<summary>查看原文（39行）</summary>

```text
export function createRuntimeStreamFlow(signal) {
  const outstanding = []
  let bytes = 0
  let sequence = 0
  let acknowledged = 0
  let wake
  const fits = size => outstanding.length < RUNTIME_STREAM_WINDOW_FRAMES
    && (size === 0 ? bytes < RUNTIME_STREAM_WINDOW_BYTES : outstanding.length === 0 || bytes + size <= RUNTIME_STREAM_WINDOW_BYTES)
  const waitUntil = async predicate => {
    while (!predicate()) {
      signal.throwIfAborted()
      await new Promise((resolve, reject) => {
        const cleanup = () => {
          wake = undefined
          signal.removeEventListener('abort', abort)
        }
        const abort = () => { cleanup(); reject(signal.reason) }
        wake = () => { cleanup(); resolve() }
        signal.addEventListener('abort', abort, { once: true })
      })
    }
    signal.throwIfAborted()
  }
  return {
    wait: (size = 0) => waitUntil(() => fits(size)),
    drain: () => waitUntil(() => outstanding.length === 0),
    sent(size) {
      sequence += 1
      outstanding.push({ sequence, size })
      bytes += size
      return sequence
    },
    acknowledge(value) {
      if (!Number.isSafeInteger(value) || value <= acknowledged || value > sequence || signal.aborted) return false
      acknowledged = value
      while (outstanding.length > 0 && outstanding[0].sequence <= value) bytes -= outstanding.shift().size
      wake?.()
      return true
    },
```

</details>

**依据 3 · 源码核查**：[apps/dsh-desktop/src/preload-main.cjs:66-69](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/preload-main.cjs#L66-L69)

真实入口强制流控制开关并提供ack桥。

```text
  openRuntimeStream: (endpoint, payload) => ipcRenderer.invoke('desktop:runtime-stream-open', { endpoint, payload, flowControl: true }),
  acknowledgeRuntimeStream: (id, sequence) => ipcRenderer.invoke('desktop:runtime-stream-ack', id, sequence),
  writeRuntimeStream: (id, value) => ipcRenderer.invoke('desktop:runtime-stream-write', id, value),
  endRuntimeStream: (id) => ipcRenderer.invoke('desktop:runtime-stream-end', id),
```

**依据 4 · 源码核查**：[apps/dsh-desktop/src/runtime-electron-transport.mjs:194-236](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-electron-transport.mjs#L194-L236)

生产者wait→sent→发送→drain，并校验ack来源sender/frame。

<details>
<summary>查看原文（43行）</summary>

```text
          for (;;) {
            await entry.flow?.wait()
            const result = await abortableStreamNext(iterator, controller.signal)
            if (result.done) { completed = true; break }
            if (controller.signal.aborted || event.sender.isDestroyed?.()) return
            if (entry.flow) {
              const bytes = runtimeStreamItemBytes(result.value)
              await entry.flow.wait(bytes)
              const sequence = entry.flow.sent(bytes)
              event.sender.send(STREAM_FRAME_CHANNEL, { id, type: 'item', value: result.value, sequence })
            } else {
              event.sender.send(STREAM_FRAME_CHANNEL, { id, type: 'item', value: result.value })
            }
          }
          await entry.flow?.drain()
          if (!controller.signal.aborted && !event.sender.isDestroyed?.()) {
            event.sender.send(STREAM_FRAME_CHANNEL, { id, type: 'end' })
          }
        } catch (error) {
          resolveSource(undefined)
          if (!controller.signal.aborted && !event.sender.isDestroyed?.()) {
            event.sender.send(STREAM_FRAME_CHANNEL, {
              id,
              type: 'error',
              message: error instanceof Error ? error.message.slice(0, 1_000) : 'Runtime stream failed',
            })
          }
        } finally {
          if (!completed) {
            try { Promise.resolve(iterator?.return?.()).catch(() => {}) } catch {}
          }
          active.delete(id)
          unwatch(entry.sender, id)
        }
      })()
    })
    return id
  })
  ipcMain.handle(STREAM_ACK_CHANNEL, (event, id, sequence) => {
    if (typeof id !== 'string') return false
    const entry = active.get(id)
    if (entry?.sender !== event.sender || entry.ownerFrame !== event.senderFrame) return false
    return entry.flow?.acknowledge(sequence) ?? false
```

</details>

**依据 5 · 源码核查**：[apps/dsh-desktop/src/runtime-renderer-bootstrap.mjs:45-56](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-renderer-bootstrap.mjs#L45-L56)

累计16帧或零延时计时器flush消费确认。

<details>
<summary>查看原文（12行）</summary>

```text
    const flushAcknowledgement = () => {
      clearTimeout(state.ackTimer)
      state.ackTimer = undefined
      if (state.cancelled || state.finished || state.consumed <= state.acknowledged) return
      state.acknowledged = state.consumed
      Promise.resolve(bridge.acknowledgeRuntimeStream(state.id, state.consumed)).catch(error => stop(error))
    }
    const consumed = frame => {
      if (!Number.isSafeInteger(frame.sequence) || typeof bridge.acknowledgeRuntimeStream !== 'function') return
      state.consumed = frame.sequence
      if (state.consumed - state.acknowledged >= 16) flushAcknowledgement()
      else if (state.ackTimer === undefined) state.ackTimer = setTimeout(flushAcknowledgement, 0)
```

</details>

**依据 6 · 源码核查**：[apps/dsh-desktop/src/runtime-renderer-bootstrap.mjs:119-140](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-renderer-bootstrap.mjs#L119-L140)

yield后迭代器继续推进才标记消费，不等于最终绘制或持久化。

<details>
<summary>查看原文（22行）</summary>

```text
    return {
      async *[Symbol.asyncIterator]() {
        try {
          await started
          for (;;) {
            while (!state.cancelled && (state.frames.length === 0 || (quiescing && state.frames[0].type !== 'item'))) {
              await new Promise(resolve => { state.wake = resolve })
            }
            state.wake = undefined
            if (state.cancelled) throw state.reason ?? new Error('Runtime stream cancelled')
            const frame = state.frames.shift()
            if (frame.type === 'item') {
              yield frame.value
              consumed(frame)
            }
            else if (frame.type === 'end') return
            else throw new Error(frame.message ?? 'Runtime stream failed')
          }
        } finally {
          state.finished = true
          cleanup()
          if (state.id !== undefined) bridge.cancelRuntimeStream(state.id)
```

</details>

#### 缺口

- 上层最终绘制、持久化及极慢消费者的实际表现未执行核验
  **影响**：源码消费推进确认不能等于全部输出已落盘或内存严格固定
  **进一步探讨**：追踪上层存储与绘制完成点，并记录超大帧、慢消费者及关窗时的完整性和内存

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容声明与一次授权可以推出什么权限保证？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

作者把Runtime版本证据、桌面能力、插件权限和执行权限分开，且明确插件不是执行沙箱。安全文档记载一次原生确认可授权当前系统用户内的danger-full-access及approval never；因此用户不能把“安装后可运行”理解为受限工具环境。文件哈希能发现非预期字节，不证明发布者可信。三端未签名、macOS未公证且macOS/Linux仍Preview，README中的Windows验收数量和发布校验属于作者报告，本轮没有独立重做。Root package为private，仓库根聚合的名称/许可与桌面产品README不是同一发布身份，不能据根npm名推断可安装包。

#### 证据与依据

**依据 1 · 作者声明**：[docs/security-boundaries.md:7-19](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/docs/security-boundaries.md#L7-L19)

明确权限分界、full-user Runtime和哈希非信任证明。

<details>
<summary>查看原文（13行）</summary>

```text
| Boundary | Enforced rule |
| --- | --- |
| Renderer and plugin | Plugins use the public SDK and Contract only; Electron, raw preload, IPC, credentials, and Runtime Provider controls are not public plugin APIs. |
| Desktop capability | A declared capability is assessed evidence, not a permission grant; the current renderer surface and host policy decide availability. |
| Workspace opening | The Host requires a registered canonical workspace root, a relative allowlisted file, real-path revalidation, and a private main-to-Host capability before native opening. |
| Runtime selection | Stable starts only a matching `known-good` or `supported` matrix entry; candidate and blocked states cannot be promoted by local metadata. |
| Primary full-user Runtime | A one-time native confirmation authorizes `danger-full-access` and `approval: never` only within the current Windows user; every start still verifies official Runtime evidence and bytes, and no renderer or plugin can choose the overlay. |
| Automatic repair | A bounded repair Runtime works only in a private transaction workspace, receives redacted diagnostic context, and cannot commit changes until registered verification passes. Failed application is rolled back. |
| Child tool PATH | The app-owned `runtime-bin` directory is prepended only to Runtime, plugin installer, and terminal child environments; Desktop never changes process-global, user, or system PATH. |
| Plugin and preset integrity | Exact package and archive hashes detect unexpected bytes but do not establish publisher identity, trust, or broad code permission. |
| Task data | Worktree evidence retains bounded review metadata, not prompts, session transcripts, tool output, credentials, or unbounded unknown fields. |
| Diagnostics | Export is user initiated, destination chosen, confirmed, local only, and redacted before a ZIP or JSON package is written. |
| Legacy credential compatibility | Desktop reads only app-owned old Free Mode credential files, fills missing reference values in the child environment, never overwrites current credentials, and never logs secret values. |
```

</details>

**依据 2 · 作者声明**：[docs/security-boundaries.md:38-50](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/docs/security-boundaries.md#L38-L50)

遥测与沙箱非目标。

<details>
<summary>查看原文（13行）</summary>

```text
## Privacy defaults

Desktop transports its UI and RPC over the authenticated private pipe. Official account sign-in has a separate ephemeral `127.0.0.1` HTTP listener accepting only `GET /oauth/callback`; it exposes neither the UI, plugin assets nor RPC, and closes with the Runtime. The official NPM account provider retains PKCE, state validation, credential storage and cancellation ownership. Only HTTPS `platform.deepseek.com/dsh/authorize` popups may open directly in the system browser; other renderer-owned popups retain their existing deny policy. The optional bai recommendation is a third-party connection entry, not an official account login, and price comparisons require the same model's current prices.

Official packaged builds upload a fixed product-event vocabulary to the release-injected first-party endpoint. A Desktop-only local random secret derives rotating daily and monthly anonymous actors; the stable secret, IP, content, credentials, paths, and long-lived device identity are not persisted by the service. Development, source, test, and Fork builds have an inert committed configuration. Diagnostic export remains separately user initiated with `userInitiated: true` and `automaticUpload: false`; its manifest lists excluded secret values, project files, prompts, sessions, answers, tool results, user names, real home paths, and URL credentials.

Diagnostic collectors are bounded and independently timed out so a damaged recovery subsystem does not force a broad data capture. Logs are redacted for credentials and account paths, and lines carrying conversation or tool content are excluded rather than summarized.

## Non-goals

Desktop does not claim to sandbox arbitrary third-party plugin code, certify plugin publishers, authenticate a browser session from a capability declaration, scan arbitrary project content during migration, silently install presets, silently merge worktree changes, or auto-promote a candidate runtime.

This document is a product-boundary guide, not a substitute for a security review of a plugin, a package publisher, a local operating system, or an upstream DSH runtime. See [SDK quickstart](sdk-quickstart.md), [runtime support policy](runtime-support-policy.md), and [upgrade and rollback](upgrade-and-rollback.md).
```

</details>

**依据 3 · 作者声明**：[README.md:47-58](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/README.md#L47-L58)

平台、签名和验收范围。

<details>
<summary>查看原文（12行）</summary>

```text
[5.1.0 正式 Release](https://github.com/ningbainb/deepseek-harness-desktop/releases/tag/desktop-v5.1.0) 于 2026-10-25 15:09:51 UTC 发布，使用官方 NPM Runtime/SDK `0.2.1-rc.2` 与 Electron `44.0.0`，不修改官方源码。[正式标签运行 40199647851](https://github.com/ningbainb/deepseek-harness-desktop/actions/runs/40199647851) 在 `eb1223ddfee78eccadd76d8022501cd1806d9d3d` 三端与 publish 全成功。五个公开安装文件已独立下载，字节、SHA-256、GitHub digest 与合并清单一致；Windows updater SHA-512 和 manifest 也已验证。

- 消费确认与流式背压保留完整输出和历史；异步资源读取与 HMR 重扫保留授权、缓存及取消清理语义，不宣称普遍性能百分比。
- 安装目录逐项校验，注册表失败逐项恢复；技能市场首次启用需确认，反馈、翻译、自动更新及项目布局扫描默认关闭，来源替换采用可恢复事务。确认不是执行沙箱。
- 无框拓展坞保留 15 个导航、搜索、控件、高级详情、关键风险提示、选中态与键盘焦点；仅独立设置窗口不挂载浮动宠物，主会话宠物与保存配置保留。
- Windows core 28/28、packaged-full 44/44，无豁免；真实 Setup 新装、4.3.0/5.0.0/5.0.1 分别升级、同版覆盖、重启、卸载与旧 provider/会话数据保全通过。默认官方皮肤、侧栏折叠、模型接入、Skills、托盘及既有入口保留。

Windows Desktop 单测 1943/1943、零跳过；macOS/Linux 各 1906 通过、37 项既有平台跳过、零失败（总计各 1943），scripts 三端均 213/213。三端均未签名，macOS 未公证且要求 arm64/macOS 13+，macOS/Linux 为 Preview；Linux 本版仅 Ubuntu 22.04 原生 Runner 验证，不借用 Ubuntu 24 历史结果。同号 5.1.0 本地内测包须手动下载正式包覆盖，不承诺同号自动更新。三端公开载荷的正式 telemetry 配置已核实，匿名统计和 opt-out 政策不变；未提交生产事件或验证生产入库。

[5.1.0 双语发布说明](docs/launch/release-notes.md) · [三端实际资产清单](docs/launch/release-manifest-all-platforms.json) · [最终 Windows 截图来源](docs/screenshots/desktop-5.1.0/provenance.json)

以下原图来自正式标签 Windows 隔离 QA：主界面是实际主 WebContents，Dock 是宿主与子视图同窗原生采集，无 diagnostic 合成或模拟模型会话。未配置模型不代表已授权；Dock 图保留真实滚动截断，不表示全部控件同时可见，也不代表 macOS/Linux 截图、真人付费或断电回滚验收。
```

</details>

#### 缺口

- 安全文档全部实现未逐路由审计
  **影响**：不能把文档约定当完整授权证明
  **进一步探讨**：在固定宿主核心IPC及文件打开路径复核原生确认来源、scope及拒绝行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些人可以怎样控制桌面客户端试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议愿意管理独立社区profile、核对来源且理解本机工具权限的开发者，在非唯一工作目录先试用；目标是安装包启动、一个会话、完整输出和重启后可继续使用。首次需下载较大桌面/Runtime包，macOS/Linux还要系统Git，模型API与桌面内存磁盘另计。持续需维护社区宿主与官方预览Runtime的兼容，注意正式遥测默认与opt-out；失败恢复要保留profile和原项目，回退官方Web或之前可用安装包。未签名包不应未经核对在重要主机批量部署；出现完整输出缺失、profile恢复不清或权限提示超出预期时停止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-54](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/README.md#L35-L54)

捆绑范围与不同平台预览边界。

<details>
<summary>查看原文（20行）</summary>

```text
**DeepSeek Harness Desktop** 是社区维护的开源 AI 编程桌面客户端。

DeepSeek 官方尚未正式发布独立 Desktop 产品；本项目把公开的官方 **DSH Runtime、Web UI 与官方仓库中的 Desktop 能力边界** 融合为 Windows、macOS 与 Linux 桌面应用，并在独立社区宿主中补齐插件、Skills、任务自动化、Git、远程开发和桌面体验。它不是 DeepSeek 官方客户端，也不使用或覆盖未来官方 Desktop 的应用身份、数据目录与更新源。

支持 **Windows 10 / 11 x64**；同时提供 **macOS 13+ Apple Silicon arm64 Preview** 与 **Linux x64 Preview**。项目采用 **BSD-3-Clause** 许可证。

安装包已包含 Node.js 与 DSH；Windows 同时内置 Git，macOS 与 Linux 的 Git 操作需要系统安装 Git。

[产品介绍](https://1521003.xyz/) · [下载最新版](https://github.com/ningbainb/deepseek-harness-desktop/releases/latest) · [使用文档](docs/desktop.md) · [更新日志](CHANGELOG.md)

### 5.1.0：三端同版，完整输出与简洁设置

[5.1.0 正式 Release](https://github.com/ningbainb/deepseek-harness-desktop/releases/tag/desktop-v5.1.0) 于 2026-10-25 15:09:51 UTC 发布，使用官方 NPM Runtime/SDK `0.2.1-rc.2` 与 Electron `44.0.0`，不修改官方源码。[正式标签运行 40199647851](https://github.com/ningbainb/deepseek-harness-desktop/actions/runs/40199647851) 在 `eb1223ddfee78eccadd76d8022501cd1806d9d3d` 三端与 publish 全成功。五个公开安装文件已独立下载，字节、SHA-256、GitHub digest 与合并清单一致；Windows updater SHA-512 和 manifest 也已验证。

- 消费确认与流式背压保留完整输出和历史；异步资源读取与 HMR 重扫保留授权、缓存及取消清理语义，不宣称普遍性能百分比。
- 安装目录逐项校验，注册表失败逐项恢复；技能市场首次启用需确认，反馈、翻译、自动更新及项目布局扫描默认关闭，来源替换采用可恢复事务。确认不是执行沙箱。
- 无框拓展坞保留 15 个导航、搜索、控件、高级详情、关键风险提示、选中态与键盘焦点；仅独立设置窗口不挂载浮动宠物，主会话宠物与保存配置保留。
- Windows core 28/28、packaged-full 44/44，无豁免；真实 Setup 新装、4.3.0/5.0.0/5.0.1 分别升级、同版覆盖、重启、卸载与旧 provider/会话数据保全通过。默认官方皮肤、侧栏折叠、模型接入、Skills、托盘及既有入口保留。

Windows Desktop 单测 1943/1943、零跳过；macOS/Linux 各 1906 通过、37 项既有平台跳过、零失败（总计各 1943），scripts 三端均 213/213。三端均未签名，macOS 未公证且要求 arm64/macOS 13+，macOS/Linux 为 Preview；Linux 本版仅 Ubuntu 22.04 原生 Runner 验证，不借用 Ubuntu 24 历史结果。同号 5.1.0 本地内测包须手动下载正式包覆盖，不承诺同号自动更新。三端公开载荷的正式 telemetry 配置已核实，匿名统计和 opt-out 政策不变；未提交生产事件或验证生产入库。
```

</details>

**依据 2 · 作者声明**：[docs/security-boundaries.md:38-48](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/docs/security-boundaries.md#L38-L48)

遥测与非沙箱边界影响持续使用成本。

<details>
<summary>查看原文（11行）</summary>

```text
## Privacy defaults

Desktop transports its UI and RPC over the authenticated private pipe. Official account sign-in has a separate ephemeral `127.0.0.1` HTTP listener accepting only `GET /oauth/callback`; it exposes neither the UI, plugin assets nor RPC, and closes with the Runtime. The official NPM account provider retains PKCE, state validation, credential storage and cancellation ownership. Only HTTPS `platform.deepseek.com/dsh/authorize` popups may open directly in the system browser; other renderer-owned popups retain their existing deny policy. The optional bai recommendation is a third-party connection entry, not an official account login, and price comparisons require the same model's current prices.

Official packaged builds upload a fixed product-event vocabulary to the release-injected first-party endpoint. A Desktop-only local random secret derives rotating daily and monthly anonymous actors; the stable secret, IP, content, credentials, paths, and long-lived device identity are not persisted by the service. Development, source, test, and Fork builds have an inert committed configuration. Diagnostic export remains separately user initiated with `userInitiated: true` and `automaticUpload: false`; its manifest lists excluded secret values, project files, prompts, sessions, answers, tool results, user names, real home paths, and URL credentials.

Diagnostic collectors are bounded and independently timed out so a damaged recovery subsystem does not force a broad data capture. Logs are redacted for credentials and account paths, and lines carrying conversation or tool content are excluded rather than summarized.

## Non-goals

Desktop does not claim to sandbox arbitrary third-party plugin code, certify plugin publishers, authenticate a browser session from a capability declaration, scan arbitrary project content during migration, silently install presets, silently merge worktree changes, or auto-promote a candidate runtime.
```

</details>

**依据 3 · 源码核查**：[apps/dsh-desktop/src/runtime-stream-flow.mjs:54-60](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-stream-flow.mjs#L54-L60)

确认机制是试用需观察的关键结果。

```text
    acknowledge(value) {
      if (!Number.isSafeInteger(value) || value <= acknowledged || value > sequence || signal.aborted) return false
      acknowledged = value
      while (outstanding.length > 0 && outstanding[0].sequence <= value) bytes -= outstanding.shift().size
      wake?.()
      return true
    },
```

#### 缺口

- 安装、模型账单及恢复耗时未知
  **影响**：不能给出总体低成本或节时结论
  **进一步探讨**：记录干净安装及故障回退的资源、人工时间和任务账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 等待消费确认时增加诊断能否减少误判卡死？

**研究主题**：新假设与验证

#### 完整回答

从wait/drain依赖确认且受取消控制，可以提出未验证的等待诊断假设：向用户或诊断面板显示最后已发送/确认序号、积压字节和等待时长，不截断内容、不自动伪造确认。相对仅显示加载，可能帮助区分模型慢、传输堵塞与渲染未消费。先核对现有上层是否已有等价观测，再在受控慢消费者与断开中比较定位时间和人工重启次数；若诊断不能正确定位或泄露正文/拖慢消费则否定。

#### 证据与依据

**依据 1 · 源码核查**：[apps/dsh-desktop/src/runtime-stream-flow.mjs:22-60](https://github.com/ningbainb/deepseek-harness-desktop/blob/98269f1334e09d886f23ce5ae02589c28e403b9e/apps/dsh-desktop/src/runtime-stream-flow.mjs#L22-L60)

当前模块有序号、字节和等待状态但未导出诊断快照。

<details>
<summary>查看原文（39行）</summary>

```text
export function createRuntimeStreamFlow(signal) {
  const outstanding = []
  let bytes = 0
  let sequence = 0
  let acknowledged = 0
  let wake
  const fits = size => outstanding.length < RUNTIME_STREAM_WINDOW_FRAMES
    && (size === 0 ? bytes < RUNTIME_STREAM_WINDOW_BYTES : outstanding.length === 0 || bytes + size <= RUNTIME_STREAM_WINDOW_BYTES)
  const waitUntil = async predicate => {
    while (!predicate()) {
      signal.throwIfAborted()
      await new Promise((resolve, reject) => {
        const cleanup = () => {
          wake = undefined
          signal.removeEventListener('abort', abort)
        }
        const abort = () => { cleanup(); reject(signal.reason) }
        wake = () => { cleanup(); resolve() }
        signal.addEventListener('abort', abort, { once: true })
      })
    }
    signal.throwIfAborted()
  }
  return {
    wait: (size = 0) => waitUntil(() => fits(size)),
    drain: () => waitUntil(() => outstanding.length === 0),
    sent(size) {
      sequence += 1
      outstanding.push({ sequence, size })
      bytes += size
      return sequence
    },
    acknowledge(value) {
      if (!Number.isSafeInteger(value) || value <= acknowledged || value > sequence || signal.aborted) return false
      acknowledged = value
      while (outstanding.length > 0 && outstanding[0].sequence <= value) bytes -= outstanding.shift().size
      wake?.()
      return true
    },
```

</details>

#### 缺口

- 上层现有诊断覆盖与用户定位收益未知
  **影响**：可能是重复设计而非新功能
  **进一步探讨**：核对调用方诊断，再使用同样慢消费者记录定位与恢复表现

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
