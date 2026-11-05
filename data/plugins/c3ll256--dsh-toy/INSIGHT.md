# DSH Toy

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[51b5825](https://github.com/c3ll256/dsh-toy/tree/51b582507aa8aad8332e1a5b5a0bc2ae607f4860)

<!-- BEGIN META -->
[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/c3ll256/dsh-toy) [![npm 30d 49](https://img.shields.io/static/v1?label=npm+30d&message=49&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toy) [![最新发布 2026-09-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-toy)
<!-- END META -->

> **功能**：把设备发现、连接和有强度时长约束的控制接入DSH

> **亮点**：[Q01](#research-q01) 集中发现连接、通道与命令限幅。

> **主要限制**：[Q03](#research-q03) 计时器和网络回执不保证物理停止。

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
  - [Q01 · 设备接入改变什么任务？](#detail-section-11)
  - [Q02 · 限幅和停止如何落到后端？](#detail-section-12)
  - [Q03 · 哪些失败不能靠定时器保证？](#detail-section-13)
  - [Q04 · 部署和退出具体要准备什么？](#detail-section-14)
  - [Q05 · 怎样支持或否定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权设备用户需要连接并执行可控输出。

手工配置Intiface与协议。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 型号选路及只读发现 | marker选远程，否则Buttplug；macOS广告扫描 | 非通用协议推断，有限RoomFun映射 |
| 自管Intiface | 拒连时启动，缺程序验SHA下载4.0.2 | 平台矩阵有限，cache复用不重验 |
| 远程分享控制 | token解析会话、ready握手、分通道op3 | 网络发送不等物理回执 |
| 限幅及停止 | 强度/时长检查、串行timer与条件close | 队列阻塞/失联不能保证停止 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node22.19及DSH宿主 | 共用前置 | 注册runtime和模型工具 | 安装兼容未运行 |
| 已有Buttplug服务与系统BLE/串口/HID权限 | 本地复用路径 | 发现受支持协议设备 | 仅ECONNREFUSED进入自动启动，其他错直接失败 |
| 本机可执行Intiface或支持平台的GitHub4.0.2包 | 自动引擎路径 | spawn自管引擎与有限映射 | ENOENT且允许才下载；不支持平台报错 |
| macOS Xcode CLT与蓝牙权限 | 只读原始发现 | 编译临时Swift广告扫描 | 其他平台/工具不可用退unknown |
| 新鲜授权MonsterParty token及API/WS网络 | 分享路径 | 解析会话和ready握手 | 无token拒绝，过期/不ready报错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 识别 | 用户确认授权及型号，未知macOS先只读广告扫描 | 多候选由用户确认，不把raw ID当控制设备 |
| 本地复用 | 连已有Buttplug并扫描已知协议 | 非ECONNREFUSED错误不另启动引擎 |
| 自动引擎 | 本地拒连时spawn，缺程序可验SHA下载4.0.2 | 核平台、缓存信任与启动窗 |
| 分享路径 | 配新token，HTTP解析→WS op2→sender/pid ready | 不ready停止，不将token交对话 |
| 空载与退出 | 小范围短时测试，显式stop并确认物理停止再disconnect | 核自管PID退出与缓存/token清理；外部服务另管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地硬件/引擎或4.0.2下载与cache，分享API网络，金额未知 | 型号/系统权限、CLT或新token配置，耗时未知 | 三路径条件不同，自动下载不覆盖全部平台 |
| 持续 | 引擎进程、蓝牙连接、WS心跳与模型调用，账单未知 | 维护兼容映射、固件、缓存信任和分享令牌，耗时未知 | 不以定时stop推物理停止 |
| 恢复 | 引擎重启、残留cache、远程会话资源未知 | 硬件stop、核SIGKILL后exit、撤销分享与清缓存，耗时未知 | 只停止自管进程；清配置不等服务端撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 限幅 | 控制前验证可见 | 其他路径及硬件响应未知 |
| 自动停止 | 超时排队发stop | 阻塞和失联的物理结果未知 |
| 连接便利 | 统一后端存在 | 步骤节省与真实兼容未测 |

> **思考**：[Q03](#research-q03) 计时器和网络回执不保证物理停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中发现连接、通道与命令限幅。

范围验证、代际计时器和close路径可追。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 计时器和网络回执不保证物理停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅模拟和空载授权测试，设备官方停止始终可达。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的在明确授权的设备上核对限幅、自动停止及失败边界。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/auto.ts、src/macos-ble.ts、src/intiface-user-config.ts、src/runtime.ts、src/buttplug.ts、src/monsterparty.ts、src/intiface-download.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的在明确授权的设备上核对限幅、自动停止及失败边界。未执行目标代码或实际宿主验证。
- 下一步：先使用模拟与空载受控设备，保留指令、回执和物理观测。

**分析版本**

- **仓库**：[c3ll256/dsh-toy](https://github.com/c3ll256/dsh-toy)
- **版本号**：0.3.0（[固定提交 51b5825](https://github.com/c3ll256/dsh-toy/tree/51b582507aa8aad8332e1a5b5a0bc2ae607f4860)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少连接步骤，须与硬件停止可靠性一起验证。

先使用模拟与空载受控设备，保留指令、回执和物理观测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1980 | 1905 | 78 | — |
| .md | source | 2 | 352 | — | — | 3622 |
| .ts | source | 11 | 2276 | 1965 | 147 | — |
| .ts | test | 5 | 427 | 391 | 9 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/c3ll256/dsh-toy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/c3ll256/dsh-toy/issues?q=is%3Aissue+created%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/c3ll256/dsh-toy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T06%3A34%3A44.234Z..2026-11-05T06%3A34%3A44.234Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在明确授权的设备上核对限幅、自动停止及失败边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 设备接入改变什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已拥有且授权控制设备的用户可以先说品牌型号，由Agent选择本地Buttplug或分享链后端，未知macOS硬件先只读BLE发现。相比自己启动Intiface再选协议，组件把连接选择和模型工具统一。型号映射是有限兼容资料，不能推断所有蓝牙设备都支持。合格结果是正确识别设备及输出通道，明确限制后执行并验证停止。 实际Auto按brand+model小写字符串匹配MonsterParty/Ankni等marker，否则一律走ManagedButtplug；unknown也进入该默认路径，非自动识别任意BLE协议。换targetKey先关闭旧后端，远程缺配置token就拒绝。Managed先尝试已有Buttplug，只有ECONNREFUSED才启动本地引擎，不会为协议/握手错误盲启动。macOS未知型号路径临时编译CoreBluetooth Swift助手，只收connectable广告、按RSSI排序最多50项，不连接或写特征；原始广告ID不成为可控制设备。非macOS/缺工具链退回unknown与已知协议扫描，多个候选须用户确认。内置额外映射仅RoomFun RF_CANNON_PT3的monsterpub通道，支持engine major4/5配置；这是代码映射并非本轮硬件复现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-19](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/README.md#L7-L19)

作者连接策略与协议归因

<details>
<summary>查看原文（13行）</summary>

```text
`dsh-toy` is a DeepSeek Harness plugin for connecting small toys to DSH.

At connection time, the agent first asks for the brand and model, then selects the connection method automatically. If the user genuinely does not know, the agent starts unknown-hardware discovery:

- On macOS, unknown hardware first uses read-only raw **CoreBluetooth** advertisement discovery, without starting Intiface or connecting to devices.
- Regular Bluetooth, serial, and USB models use **Buttplug / Intiface**. The plugin starts local Intiface Engine automatically when needed.
- Known sharing-link models from Ankni (安可尼), MizzZee (谜姬), and Zuiqingfeng (醉清风) use **MonsterParty**. Known dual-output devices expose their channels separately.

Users do not need to understand or select an underlying connection method, or manually start Intiface.

Brand and model names are not an allowlist. The agent passes any user-reported name through unchanged; unfamiliar names still use local hardware discovery. The plugin also supplies a verified local compatibility mapping for `RoomFun` devices reporting model `RF_CANNON_PT3`, exposed as **RoomFun Cannon** with one vibration channel.

The implementation follows protocol observations from [Chemtrails](https://github.com/Kristenkristen/Chemtrails), together with the device model and message formats documented by [Buttplug](https://github.com/buttplugio/buttplug) and the [Buttplug Protocol Specification](https://buttplug.io/docs/spec/). This repository contains an independent TypeScript implementation; see [NOTICE](NOTICE) for attribution.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:9-14](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/index.ts#L9-L14)

后端与runtime组合

```text
import { AutoToyBackend } from './auto.ts'
import { ButtplugBackend } from './buttplug.ts'
import { MonsterPartyBackend } from './monsterparty.ts'
import { scanMacOSRawBle } from './macos-ble.ts'
import { ToyRuntime } from './runtime.ts'
import type { ToyBackend, ToyDevice, ToyFeatureKind } from './types.ts'
```

**依据 3 · 源码核查**：[src/auto.ts:26-31](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/auto.ts#L26-L31)

型号marker选路

```text
/** Decide the transport from the user-supplied brand and model, without exposing provider selection. */
export function routeToyTarget(target: ToyTarget): ToyProvider {
  const identity = `${target.brand ?? ''} ${target.model}`.trim().toLocaleLowerCase()
  return MONSTERPARTY_MARKERS.some(marker => identity.includes(marker)) ? 'monsterparty' : 'buttplug'
}

```

**依据 4 · 源码核查**：[src/auto.ts:225-257](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/auto.ts#L225-L257)

仅拒绝连接时启动引擎

<details>
<summary>查看原文（33行）</summary>

```text
    await this.process.start(signal)
    try {
      const deadline = Date.now() + this.processConfig.startupTimeoutMs
      let lastError: unknown
      while (Date.now() < deadline) {
        signal.throwIfAborted()
        this.process.assertRunning()
        try {
          return await this.backend.connect(signal)
        } catch (error) {
          if (!isConnectionRefused(error)) throw error
          lastError = error
          await delay(100, signal)
        }
      }
      throw new ToyError(`Intiface Engine did not open ${this.processConfig.websocketUrl} within ${this.processConfig.startupTimeoutMs}ms${lastError instanceof Error ? `: ${lastError.message}` : ''}`)
    } catch (error) {
      await this.process.close()
      throw error
    }
  }

  scan(durationMs: number, signal: AbortSignal): Promise<ToyDevice[]> { return this.backend.scan(durationMs, signal) }
  list(): ToyDevice[] { return this.backend.list() }
  setLevel(command: ToyLevelCommand, signal: AbortSignal): Promise<void> { return this.backend.setLevel(command, signal) }
  stop(deviceId: string | undefined, signal?: AbortSignal): Promise<void> { return this.backend.stop(deviceId, signal) }

  async close(): Promise<void> {
    let backendFailure: unknown
    try {
      await this.backend.close()
    } catch (error) {
      backendFailure = error
```

</details>

**依据 5 · 源码核查**：[src/auto.ts:294-321](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/auto.ts#L294-L321)

target切换、unknown默认与token缺失

<details>
<summary>查看原文（28行）</summary>

```text
          throw new ToyError('This model uses a MonsterParty share link; configure a fresh MONSTERPARTY_TOKEN, then reconnect')
        }
        this.active = new MonsterPartyBackend(this.config.monsterParty)
      } else {
        this.active = new ManagedButtplugBackend(this.config.buttplug, this.config.intiface)
      }
      this.targetKey = targetKey
    }
    return this.active.connect(signal, target)
  }

  scan(durationMs: number, signal: AbortSignal): Promise<ToyDevice[]> { return this.requireActive().scan(durationMs, signal) }
  list(): ToyDevice[] { return this.active?.list() ?? [] }
  setLevel(command: ToyLevelCommand, signal: AbortSignal): Promise<void> { return this.requireActive().setLevel(command, signal) }
  stop(deviceId: string | undefined, signal?: AbortSignal): Promise<void> { return this.requireActive().stop(deviceId, signal) }

  async close(): Promise<void> {
    const active = this.active
    this.active = undefined
    this.targetKey = ''
    await active?.close()
  }

  private requireActive(): ToyBackend {
    if (this.active === undefined) throw new ToyError('No toy is connected; ask for its exact model and call toy_connect first')
    return this.active
  }
}
```

</details>

**依据 6 · 源码核查**：[src/macos-ble.ts:175-193](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/macos-ble.ts#L175-L193)

Swift临时编译和清理

<details>
<summary>查看原文（19行）</summary>

```text
  try {
    await writeFile(source, MACOS_RAW_BLE_SCANNER_SOURCE, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    try {
      await runFile('/usr/bin/xcrun', [
        'swiftc',
        '-module-cache-path', moduleCache,
        source,
        '-o', binary,
      ], signal, 30_000)
    } catch (error) {
      if (signal.aborted) throw error
      throw new ToyError(`Could not build the macOS CoreBluetooth scanner; install Xcode Command Line Tools: ${error instanceof Error ? error.message : String(error)}`)
    }
    const output = await runFile(binary, [String(durationMs)], signal, durationMs + 10_000)
    return parseRawBleScan(output)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
```

</details>

**依据 7 · 源码核查**：[src/intiface-user-config.ts:3-43](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/intiface-user-config.ts#L3-L43)

有限具体硬件映射

<details>
<summary>查看原文（41行）</summary>

```text
const ROOMFUN_PROTOCOL_ID = 'monsterpub'

/** Build an Intiface user config matching the executable's device-config major version. */
export function createIntifaceUserDeviceConfig(engineMajor: number): string {
  if (engineMajor !== 4 && engineMajor !== 5) {
    throw new Error(`Unsupported Intiface device-config major version: ${engineMajor}`)
  }
  return JSON.stringify({
    version: { major: engineMajor, minor: 0 },
    user_configs: {
      protocols: {
        [ROOMFUN_PROTOCOL_ID]: {
          communication: [{
            btle: {
              names: ['RoomFun'],
              services: {
                '00006000-0000-1000-8000-00805f9b34fb': {
                  tx: '00006001-0000-1000-8000-00805f9b34fb',
                  txmode: '00006002-0000-1000-8000-00805f9b34fb',
                },
                '00006010-0000-1000-8000-00805f9b34fb': {
                  rxblemodel: '00006014-0000-1000-8000-00805f9b34fb',
                },
              },
            },
          }],
          configurations: [{
            identifier: ['RF_CANNON_PT3'],
            name: 'RoomFun Cannon',
            id: '4cb2f81d-fb4f-4f70-a80f-72ef42e69bc1',
            features: [{
              id: 'c9281675-7ab0-4e1c-907a-1c4de52f8bac',
              index: 0,
              output: { vibrate: { value: [0, 100] } },
            }],
          }],
        },
      },
    },
  }, undefined, 2)
}
```

</details>

#### 缺口

- 实际设备兼容与通道映射未在本轮运行。
  **影响**：选错设备或通道会使任务结果与用户意图不一致。
  **进一步探讨**：先用模拟后端核对映射，硬件只在用户明确授权下测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 限幅和停止如何落到后端？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

模型工具调用ToyRuntime.control，先验证整数强度、时长和allowHold，再串行setLevel。后端成功后替换设备计时器，超时token防旧计时器停止新命令。stop无设备ID送全局停止，只有后端stop完成后清定时器。Buttplug按v3/v4发对应停止命令。 MonsterParty用配置token作为API的s查询参数，带User-Agent获取socket_url/sessionId/userId，再向返回地址建立WS并带Origin。op2握手需同时收到op6 sender.fd与op15 conn=true/pid才ready，pid中DS决定双通道、SUCK决定keyType。setLevel验证device/feature/kind，将强度编码op3的10槽vib数组，发送成功后更新本机强度；stop发送双通道0，仍不是设备物理回执。心跳op8失败terminate并仅清本地ready/强度。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:330-340](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/index.ts#L330-L340)

工具到runtime

<details>
<summary>查看原文（11行）</summary>

```text
    execute: async (args, exec) => runtime.control({
      deviceId: args.device_id,
      ...(args.feature_id === undefined ? {} : { featureId: args.feature_id }),
      kind: args.kind,
      intensityPercent: args.intensity_percent,
      ...(args.duration_seconds === undefined ? {} : { durationSeconds: args.duration_seconds }),
    }, exec.signal),
    presentCall: args => ({
      card: 'generic',
      title: `Set toy ${args.kind} to ${args.intensity_percent}%`,
      kind: 'other',
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:88-117](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L88-L117)

实际set与stop

<details>
<summary>查看原文（30行）</summary>

```text
  control(request: RuntimeControlRequest, signal: AbortSignal): Promise<RuntimeControlResult> {
    const durationSeconds = request.intensityPercent === 0
      ? 0
      : request.durationSeconds ?? this.safety.defaultDurationSeconds
    this.validateControl(request, durationSeconds)
    return this.exclusive(async () => {
      await this.backend.setLevel({
        deviceId: request.deviceId,
        ...(request.featureId === undefined ? {} : { featureId: request.featureId }),
        kind: request.kind,
        intensityPercent: request.intensityPercent,
      }, signal)
      this.clearTimer(request.deviceId)
      if (request.intensityPercent > 0 && durationSeconds > 0) this.scheduleStop(request.deviceId, durationSeconds)
      return {
        deviceId: request.deviceId,
        kind: request.kind,
        intensityPercent: request.intensityPercent,
        autoStopSeconds: durationSeconds > 0 ? durationSeconds : null,
      }
    }, signal)
  }

  /** Stop one device or all devices and cancel only the corresponding timers. */
  stop(deviceId: string | undefined, signal: AbortSignal): Promise<void> {
    return this.exclusive(async () => {
      await this.backend.stop(deviceId, signal)
      if (deviceId === undefined) this.clearTimers()
      else this.clearTimer(deviceId)
    }, signal)
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:142-171](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L142-L171)

范围和代际定时器

<details>
<summary>查看原文（30行）</summary>

```text
  private validateControl(request: RuntimeControlRequest, durationSeconds: number): void {
    if (!Number.isInteger(request.intensityPercent) || request.intensityPercent < 0
      || request.intensityPercent > this.safety.maxIntensityPercent) {
      throw new ToyError(`intensity_percent must be an integer from 0 to ${this.safety.maxIntensityPercent}`)
    }
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0 || durationSeconds > this.safety.maxDurationSeconds) {
      throw new ToyError(`duration_seconds must be from 0 to ${this.safety.maxDurationSeconds}`)
    }
    if (request.intensityPercent > 0 && durationSeconds === 0 && !this.safety.allowHold) {
      throw new ToyError('duration_seconds=0 is disabled; use a positive duration or enable allowHold')
    }
  }

  private scheduleStop(deviceId: string, seconds: number): void {
    const token = Symbol(deviceId)
    const timer = setTimeout(() => {
      void this.exclusive(async () => {
        const current = this.stopTimers.get(deviceId)
        if (current?.token !== token) return
        this.stopTimers.delete(deviceId)
        await this.backend.stop(deviceId)
      }, undefined).catch((error: unknown) => {
        try {
          this.reportFailure(error)
        } catch {
          // The transport is already stopped or failed; a diagnostic sink failure has no remaining recovery path.
        }
      })
    }, seconds * 1_000)
    this.stopTimers.set(deviceId, { token, timer })
```

</details>

**依据 4 · 源码核查**：[src/buttplug.ts:286-297](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/buttplug.ts#L286-L297)

协议停止分支

<details>
<summary>查看原文（12行）</summary>

```text
  async stop(deviceId: string | undefined, signal?: AbortSignal): Promise<void> {
    this.assertConnected()
    if (this.config.protocolVersion === 4) {
      await this.request('StopCmd', {
        ...(deviceId === undefined ? {} : { DeviceIndex: parseDeviceId(deviceId) }),
        Inputs: false,
        Outputs: true,
      }, signal)
      return
    }
    if (deviceId === undefined) await this.request('StopAllDevices', {}, signal)
    else await this.request('StopDeviceCmd', { DeviceIndex: parseDeviceId(deviceId) }, signal)
```

</details>

**依据 5 · 源码核查**：[src/monsterparty.ts:154-227](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/monsterparty.ts#L154-L227)

控制与stop/close以及token请求

<details>
<summary>查看原文（74行）</summary>

```text
    if (command.deviceId !== 'monsterparty:remote') throw new ToyError(`Unknown MonsterParty device: ${command.deviceId}`)
    const featureId = command.featureId
    if (featureId !== undefined
      && featureId !== 'monsterparty:remote:vibration'
      && featureId !== 'monsterparty:remote:suction') {
      throw new ToyError(`Unknown MonsterParty feature: ${featureId}`)
    }
    if ((featureId === 'monsterparty:remote:suction') !== (command.kind === 'suction') && featureId !== undefined) {
      throw new ToyError(`MonsterParty feature ${featureId} does not match kind ${command.kind}`)
    }
    let vibration = this.vibration
    let suction = this.suction
    if (command.kind === 'suction') {
      if (!this.dualMotor) throw new ToyError('Connected MonsterParty device has no separate suction feature')
      suction = command.intensityPercent
    } else if (command.kind === 'vibrate') {
      vibration = command.intensityPercent
    } else {
      throw new ToyError(`MonsterParty does not support ${command.kind}`)
    }
    await this.sendLevels(socket, vibration, suction)
    this.vibration = vibration
    this.suction = suction
  }

  async stop(deviceId: string | undefined, signal?: AbortSignal): Promise<void> {
    signal?.throwIfAborted()
    const socket = this.assertReady()
    if (deviceId !== undefined && deviceId !== 'monsterparty:remote') {
      throw new ToyError(`Unknown MonsterParty device: ${deviceId}`)
    }
    await this.sendLevels(socket, 0, 0)
    this.vibration = 0
    this.suction = 0
  }

  async close(): Promise<void> {
    const socket = this.socket
    if (socket === undefined) return
    this.stopHeartbeat()
    let stopFailure: unknown
    if (socket.readyState === WebSocket.OPEN && this.ready) {
      try {
        await this.stop(undefined)
      } catch (error) {
        stopFailure = error
      }
    }
    await closeWebSocket(socket)
    this.markDisconnected()
    if (stopFailure !== undefined) throw stopFailure
  }

  private async resolveSession(signal: AbortSignal): Promise<SessionInfo> {
    const url = new URL(this.config.apiUrl)
    url.searchParams.set('s', this.config.sessionToken)
    const timeout = AbortSignal.timeout(this.config.connectionTimeoutMs)
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, timeout]),
      headers: { 'User-Agent': this.config.userAgent },
    })
    if (!response.ok) throw new ToyError(`MonsterParty session request failed with HTTP ${response.status}`)
    const value: unknown = await response.json()
    if (isObject(value) && typeof value.errNo === 'number' && value.errNo !== 0) {
      throw new ToyError(`MonsterParty rejected the share token (errNo ${value.errNo})`)
    }
    return parseSessionInfo(value)
  }

  private waitUntilReady(socket: WebSocket, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted()
    return new Promise((resolve, reject) => {
      let settled = false
      let senderFd: string | number | undefined
```

</details>

**依据 6 · 源码核查**：[src/monsterparty.ts:235-311](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/monsterparty.ts#L235-L311)

ready判据、通道与心跳

<details>
<summary>查看原文（77行）</summary>

```text
        socket.off('close', onClose)
        if (error !== undefined) {
          reject(error)
          return
        }
        this.senderFd = senderFd
        this.pid = pid
        this.keyType = pid.toUpperCase().includes('SUCK') ? 'suck' : 'vib'
        this.dualMotor = pid.toUpperCase().includes('DS')
        this.ready = true
        resolve()
      }
      const maybeReady = (): void => {
        if (senderFd !== undefined && pid.length > 0) finish()
      }
      const onMessage = (data: WebSocket.RawData): void => {
        const message = parseFrame(frameText(data))
        if (message === undefined) return
        if (typeof message.errNo === 'number' && message.errNo !== 0) {
          finish(new ToyError(`MonsterParty handshake failed (errNo ${message.errNo})`))
          return
        }
        if (message.op === 6 && isObject(message.sender)
          && (typeof message.sender.fd === 'number' || typeof message.sender.fd === 'string')) {
          senderFd = message.sender.fd
        }
        if (message.op === 15 && message.conn === true) pid = typeof message.pid === 'string' ? message.pid : 'MonsterParty toy'
        maybeReady()
      }
      const onClose = (): void => { finish(new ToyError('MonsterParty WebSocket closed before the device became ready')) }
      const onAbort = (): void => {
        finish(signal.reason instanceof Error ? signal.reason : new DOMException('Aborted', 'AbortError'))
      }
      const timeout = setTimeout(() => {
        finish(new ToyError(`MonsterParty device was not ready after ${this.config.readyTimeoutMs}ms; check power and use a fresh share link`))
      }, this.config.readyTimeoutMs)
      socket.on('message', onMessage)
      socket.once('close', onClose)
      signal.addEventListener('abort', onAbort, { once: true })
    })
  }

  private async sendLevels(socket: WebSocket, vibration: number, suction: number): Promise<void> {
    const fd = this.senderFd
    if (fd === undefined) throw new ToyError('MonsterParty sender fd is unavailable')
    const vib = this.dualMotor
      ? [suction, vibration, vibration, vibration, vibration, 0, 0, 0, 0, 0]
      : Array<number>(10).fill(vibration)
    await sendJson(socket, { op: 3, vib, fd, keyType: this.keyType })
  }

  private startHeartbeat(socket: WebSocket): void {
    this.stopHeartbeat()
    this.heartbeat = setInterval(() => {
      void sendJson(socket, { op: 8 }).catch(() => {
        socket.terminate()
        this.markDisconnected()
      })
    }, this.config.heartbeatIntervalMs)
  }

  private stopHeartbeat(): void {
    if (this.heartbeat !== undefined) clearInterval(this.heartbeat)
    this.heartbeat = undefined
  }

  private markDisconnected(): void {
    this.stopHeartbeat()
    this.socket = undefined
    this.senderFd = undefined
    this.ready = false
    this.vibration = 0
    this.suction = 0
  }

  private assertReady(): WebSocket {
    const socket = this.socket
```

</details>

#### 缺口

- 后端确认与实际物理输出停止是否一致未验。
  **影响**：返回成功不能单独作为设备已停止的证据。
  **进一步探讨**：以模拟协议回执和物理观测分别验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些失败不能靠定时器保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

自动stop是排入同一串行队列，若此前操作挂起会延后，且stop失败只报告异步错误，进程崩溃也无法继续计时。disconnect/close先清计时器再backend.close，Buttplug仅在socket OPEN时尝试全局stop后关闭。网络断开或设备独立保持输出时，源码不能保证物理停止。 MonsterParty close先停心跳，仅socket OPEN且ready才尝试stop；即使stop失败仍关WS再抛stopFailure，若已失联则只清本机状态。远程API URL配置允许http及https，token在查询中，不能把“不进模型参数”解读为不经网络或日志。Intiface新下载包有固定SHA校验，但已存在cache executable仅access后复用、不重新hash，因此缓存被替换仍可执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:120-139](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L120-L139)

清计时器与close

<details>
<summary>查看原文（20行）</summary>

```text
  /** Disconnect without disposing the runtime, allowing a later reconnect. */
  disconnect(signal: AbortSignal): Promise<void> {
    return this.exclusive(async () => {
      signal.throwIfAborted()
      this.clearTimers()
      await this.backend.close()
    }, signal)
  }

  /** Reject new operations, stop timers, and await provider shutdown. */
  async close(): Promise<void> {
    if (this.disposing) {
      await this.tail
      return
    }
    this.disposing = true
    await this.exclusive(async () => {
      this.clearTimers()
      await this.backend.close()
    }, undefined, true)
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:155-169](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L155-L169)

排队停止及失败报告

<details>
<summary>查看原文（15行）</summary>

```text
  private scheduleStop(deviceId: string, seconds: number): void {
    const token = Symbol(deviceId)
    const timer = setTimeout(() => {
      void this.exclusive(async () => {
        const current = this.stopTimers.get(deviceId)
        if (current?.token !== token) return
        this.stopTimers.delete(deviceId)
        await this.backend.stop(deviceId)
      }, undefined).catch((error: unknown) => {
        try {
          this.reportFailure(error)
        } catch {
          // The transport is already stopped or failed; a diagnostic sink failure has no remaining recovery path.
        }
      })
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:186-200](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L186-L200)

串行队列

<details>
<summary>查看原文（15行）</summary>

```text
  private exclusive<T>(
    operation: () => Promise<T>,
    signal: AbortSignal | undefined,
    allowDisposing = false,
  ): Promise<T> {
    if (this.disposing && !allowDisposing) return Promise.reject(new ToyError('dsh-toy is shutting down'))
    let release!: () => void
    const predecessor = this.tail
    this.tail = new Promise(resolve => { release = resolve })
    return (async () => {
      await predecessor
      try {
        if (this.disposing && !allowDisposing) throw new ToyError('dsh-toy is shutting down')
        signal?.throwIfAborted()
        return await operation()
```

</details>

**依据 4 · 源码核查**：[src/buttplug.ts:300-314](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/buttplug.ts#L300-L314)

只在连接打开时发stop

<details>
<summary>查看原文（15行）</summary>

```text
  async close(): Promise<void> {
    const socket = this.socket
    if (socket === undefined) return
    this.stopPings()
    let stopFailure: unknown
    if (socket.readyState === WebSocket.OPEN) {
      try {
        await this.stop(undefined)
      } catch (error) {
        stopFailure = error
      }
    }
    await closeWebSocket(socket)
    this.loseConnection(new ToyError('Buttplug client closed'))
    if (stopFailure !== undefined) throw stopFailure
```

</details>

**依据 5 · 源码核查**：[src/monsterparty.ts:194-232](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/monsterparty.ts#L194-L232)

close有条件stop与token网络流

<details>
<summary>查看原文（39行）</summary>

```text
    let stopFailure: unknown
    if (socket.readyState === WebSocket.OPEN && this.ready) {
      try {
        await this.stop(undefined)
      } catch (error) {
        stopFailure = error
      }
    }
    await closeWebSocket(socket)
    this.markDisconnected()
    if (stopFailure !== undefined) throw stopFailure
  }

  private async resolveSession(signal: AbortSignal): Promise<SessionInfo> {
    const url = new URL(this.config.apiUrl)
    url.searchParams.set('s', this.config.sessionToken)
    const timeout = AbortSignal.timeout(this.config.connectionTimeoutMs)
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, timeout]),
      headers: { 'User-Agent': this.config.userAgent },
    })
    if (!response.ok) throw new ToyError(`MonsterParty session request failed with HTTP ${response.status}`)
    const value: unknown = await response.json()
    if (isObject(value) && typeof value.errNo === 'number' && value.errNo !== 0) {
      throw new ToyError(`MonsterParty rejected the share token (errNo ${value.errNo})`)
    }
    return parseSessionInfo(value)
  }

  private waitUntilReady(socket: WebSocket, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted()
    return new Promise((resolve, reject) => {
      let settled = false
      let senderFd: string | number | undefined
      let pid = ''
      const finish = (error?: Error): void => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
```

</details>

**依据 6 · 源码核查**：[src/intiface-download.ts:127-155](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/intiface-download.ts#L127-L155)

缓存只access与新包SHA校验

<details>
<summary>查看原文（29行）</summary>

```text
  } catch (error) {
    throw new ToyError(`Could not download Intiface Engine from the official release: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (!response.ok) throw new ToyError(`Official Intiface Engine download failed with HTTP ${response.status}`)
  const contentLength = Number(response.headers.get('content-length') ?? 0)
  if (contentLength > MAX_ARCHIVE_BYTES) throw new ToyError('Official Intiface Engine archive is unexpectedly large')
  const archive = Buffer.from(await response.arrayBuffer())
  if (archive.length > MAX_ARCHIVE_BYTES) throw new ToyError('Official Intiface Engine archive is unexpectedly large')
  const actualHash = createHash('sha256').update(archive).digest('hex')
  if (actualHash !== artifact.sha256) throw new ToyError('Official Intiface Engine archive failed SHA-256 verification')
  const body = extractIntifaceExecutable(archive)
  const temporary = `${executable}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`
  await writeFile(temporary, body, { mode: 0o755, flag: 'wx' })
  try {
    await chmod(temporary, 0o755)
    try {
      await rename(temporary, executable)
    } catch (error) {
      try {
        await access(executable)
      } catch {
        throw error
      }
    }
  } finally {
    await unlink(temporary).catch(() => {})
  }
  return executable
}
```

</details>

**依据 7 · 源码核查**：[src/index.ts:144-154](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/index.ts#L144-L154)

远程API协议允许http

<details>
<summary>查看原文（11行）</summary>

```text
  for (const [key, value, protocols] of [
    ['buttplugUrl', resolved.buttplugUrl, ['ws:', 'wss:']],
    ['monsterPartyApiUrl', resolved.monsterPartyApiUrl, ['http:', 'https:']],
  ] as const) {
    try {
      if (!protocols.some(protocol => protocol === new URL(value).protocol)) throw new Error('unsupported URL protocol')
    } catch {
      throw new Error(`dsh-toy: invalid ${key}`)
    }
  }
  if (resolved.intifaceExecutable.trim().length === 0) throw new Error('dsh-toy: intifaceExecutable cannot be empty')
```

</details>

#### 缺口

- 协议掉线行为及设备固件停止策略未知。
  **影响**：远程失联可能使用户需手动物理停止，不能无人值守控制。
  **进一步探讨**：用无身体接触的受控设备测试断流，始终保留设备硬件停止手段。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和退出具体要准备什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者部署前置为Node22.19及pnpm。三路径分别准备：本地已运行Buttplug需可达ws/wss服务、已授权设备及系统蓝牙/串口/HID权限；自动引擎路径先复用服务，ECONNREFUSED才校验local ws地址并spawn，ENOENT且autoDownload=true才下载固定4.0.2包。自动下载仅darwin-arm64、linux-arm64/linux-x64、win32-x64，32MiB上限、内置SHA256核archive、只提预期可执行文件、临时文件原子rename；缓存仍需独立信任。启动带BLE/serial/HID，版本检测2秒，major4/5才生成0600临时user-device-config；后台进程unref，仅管理自己spawn的进程。connect超启动窗会close；close先SIGTERM，2秒后SIGKILL并结束等待，finally删临时映射目录，但未再等待SIGKILL实际exit且不删下载缓存，不终止外部既有Intiface。MonsterParty路径需新鲜授权分享token，配置而非模型入参，API解析与ready握手均有限时；更换/撤销token须用服务端机制，删除配置不等撤销。退出先全局stop并由设备方确认物理停止，再disconnect；核自建引擎PID已退出、外部服务是否仍需保留，按需清cache并撤远程分享。macOS只读扫描需Xcode CLT、蓝牙授权，编译30秒限时，扫描1–60秒，finally删临时目录。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-40](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/README.md#L21-L40)

作者限制和部署前置

<details>
<summary>查看原文（20行）</summary>

````text
## Guardrails

- Sharing tokens stay in plugin configuration and never appear in model-visible tool arguments or results.
- Raw BLE discovery is read-only: it scans connectable advertisements without connecting or writing characteristics.
- Output stops automatically after 30 seconds by default.
- Zero-duration holds are disabled unless `allowHold: true` is explicitly configured.
- `maxIntensityPercent` and `maxDurationSeconds` are enforced before backend dispatch.
- A newer command replaces the previous automatic-stop timer for the same device.
- `toy_stop` without a device id performs a global stop.
- Plugin unload, HMR, and `toy_disconnect` stop output and await WebSocket shutdown.

Use only hardware you own or are explicitly authorized to control. Treat sharing tokens as temporary control credentials and keep them out of Git, logs, and conversations.

## Install

Requirements: Node.js 22.19 or newer and pnpm on `PATH`. Raw macOS BLE discovery additionally uses the Swift compiler from Xcode Command Line Tools. The bundle targets the `@deepseek-ai/dsh` 0.1.2-rc.1 line, which CI installs and boots on every change. Install pnpm once if needed with `npm install --global pnpm@10`, then add the plugin directly from GitHub:

```sh
npx -y @deepseek-ai/dsh plugin --profile web add github:c3ll256/dsh-toy
```
````

</details>

**依据 2 · 源码核查**：[src/auto.ts:92-184](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/auto.ts#L92-L184)

启动下载门槛、版本配置与SIGTERM/SIGKILL清理

<details>
<summary>查看原文（93行）</summary>

```text
    signal.throwIfAborted()
    if (this.child !== undefined && this.child.exitCode === null && this.child.signalCode === null) return
    const port = localWebsocketPort(this.config.websocketUrl)
    let child: ChildProcess
    try {
      const userDeviceConfigPath = await this.prepareUserDeviceConfig(this.executable, signal)
      child = await this.spawn(this.executable, port, userDeviceConfigPath, signal)
    } catch (error) {
      await this.removeUserDeviceConfig()
      if (errorCode(error) !== 'ENOENT' || !this.config.autoDownload) {
        throw new ToyError(`Could not start Intiface Engine (${this.executable}): ${error instanceof Error ? error.message : String(error)}`)
      }
      this.executable = await installIntifaceEngine(signal)
      try {
        const userDeviceConfigPath = await this.prepareUserDeviceConfig(this.executable, signal)
        child = await this.spawn(this.executable, port, userDeviceConfigPath, signal)
      } catch (downloadedError) {
        await this.removeUserDeviceConfig()
        throw new ToyError(`Could not start downloaded Intiface Engine (${this.executable}): ${downloadedError instanceof Error ? downloadedError.message : String(downloadedError)}`)
      }
    }
    this.child = child
    child.on('error', () => {})
    child.unref()
  }

  private async prepareUserDeviceConfig(executable: string, signal: AbortSignal): Promise<string | undefined> {
    if (this.config.useBuiltinUserDeviceConfig !== true) return undefined
    const major = await intifaceEngineMajor(executable, signal)
    if (major !== 4 && major !== 5) return undefined
    const directory = await mkdtemp(join(tmpdir(), 'dsh-toy-intiface-'))
    const path = join(directory, 'user-device-config.json')
    try {
      await writeFile(path, createIntifaceUserDeviceConfig(major), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    } catch (error) {
      await rm(directory, { recursive: true, force: true })
      throw error
    }
    this.userConfigDirectory = directory
    return path
  }

  private spawn(executable: string, port: number, userDeviceConfigPath: string | undefined, signal: AbortSignal): Promise<ChildProcess> {
    const child = spawn(executable, intifaceArguments(port, userDeviceConfigPath), {
      stdio: 'ignore',
      windowsHide: true,
    })
    return new Promise<ChildProcess>((resolve, reject) => {
      const finish = (error?: Error): void => {
        signal.removeEventListener('abort', onAbort)
        child.off('spawn', onSpawn)
        child.off('error', onError)
        if (error === undefined) resolve(child)
        else reject(error)
      }
      const onSpawn = (): void => { finish() }
      const onError = (error: Error): void => { finish(error) }
      const onAbort = (): void => {
        child.kill()
        finish(signal.reason instanceof Error ? signal.reason : new DOMException('Aborted', 'AbortError'))
      }
      child.once('spawn', onSpawn)
      child.once('error', onError)
      signal.addEventListener('abort', onAbort, { once: true })
    })
  }

  assertRunning(): void {
    const child = this.child
    if (child !== undefined && (child.exitCode !== null || child.signalCode !== null)) {
      this.child = undefined
      throw new ToyError(`Intiface Engine exited before opening ${this.config.websocketUrl}`)
    }
  }

  async close(): Promise<void> {
    const child = this.child
    this.child = undefined
    try {
      if (child === undefined || child.exitCode !== null || child.signalCode !== null) return
      child.kill('SIGTERM')
      await new Promise<void>((resolve) => {
        let settled = false
        const finish = (): void => {
          if (settled) return
          settled = true
          clearTimeout(timeout)
          child.off('exit', finish)
          resolve()
        }
        const timeout = setTimeout(() => {
          child.kill('SIGKILL')
          finish()
```

</details>

**依据 3 · 源码核查**：[src/intiface-download.ts:10-50](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/intiface-download.ts#L10-L50)

固定4.0.2平台矩阵与摘要

<details>
<summary>查看原文（41行）</summary>

```text
const RELEASE_TAG = 'intiface-engine-4.0.2'
const RELEASE_VERSION = '4.0.2'
const MAX_ARCHIVE_BYTES = 32 * 1024 * 1024

/** One pinned upstream artifact and its GitHub-provided SHA-256 digest. */
export interface IntifaceArtifact {
  name: string
  sha256: string
}

const ARTIFACTS: Readonly<Record<string, IntifaceArtifact>> = {
  'darwin-arm64': {
    name: 'intiface-engine-v4.0.2-macos-arm64.zip',
    sha256: '4331e57a68635f5b1ce062b29759ec75187773f53f80d15e0e13a2d253957909',
  },
  'linux-arm64': {
    name: 'intiface-engine-v4.0.2-linux-arm64.zip',
    sha256: 'bdedaa1f2e460e31a1b33fb6dfbb9d410d3e17929c16eb5b696aeb8b4adb4016',
  },
  'linux-x64': {
    name: 'intiface-engine-v4.0.2-linux-x64.zip',
    sha256: 'f1c61ab0abfab265beedfd89805a36c7641984b1baee680846814d22af3d6b3a',
  },
  'win32-x64': {
    name: 'intiface-engine-v4.0.2-win-x64.zip',
    sha256: '38797ab30121b55cdedd50b457b676f0fb0d3bee2da7bcd149a21a30170a284e',
  },
}

/** Return the pinned artifact for a supported Node platform/architecture pair. */
export function selectIntifaceArtifact(platform = process.platform, arch = process.arch): IntifaceArtifact {
  const artifact = ARTIFACTS[`${platform}-${arch}`]
  if (artifact === undefined) throw new ToyError(`Automatic Intiface Engine download is unavailable for ${platform}-${arch}`)
  return artifact
}

function cacheRoot(): string {
  if (process.env.DSH_TOY_CACHE_DIR !== undefined && process.env.DSH_TOY_CACHE_DIR.length > 0) {
    return process.env.DSH_TOY_CACHE_DIR
  }
  if (process.platform === 'win32') {
```

</details>

**依据 4 · 源码核查**：[src/intiface-download.ts:127-155](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/intiface-download.ts#L127-L155)

下载验证、缓存和临时文件

<details>
<summary>查看原文（29行）</summary>

```text
  } catch (error) {
    throw new ToyError(`Could not download Intiface Engine from the official release: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (!response.ok) throw new ToyError(`Official Intiface Engine download failed with HTTP ${response.status}`)
  const contentLength = Number(response.headers.get('content-length') ?? 0)
  if (contentLength > MAX_ARCHIVE_BYTES) throw new ToyError('Official Intiface Engine archive is unexpectedly large')
  const archive = Buffer.from(await response.arrayBuffer())
  if (archive.length > MAX_ARCHIVE_BYTES) throw new ToyError('Official Intiface Engine archive is unexpectedly large')
  const actualHash = createHash('sha256').update(archive).digest('hex')
  if (actualHash !== artifact.sha256) throw new ToyError('Official Intiface Engine archive failed SHA-256 verification')
  const body = extractIntifaceExecutable(archive)
  const temporary = `${executable}.${process.pid}.${randomBytes(6).toString('hex')}.tmp`
  await writeFile(temporary, body, { mode: 0o755, flag: 'wx' })
  try {
    await chmod(temporary, 0o755)
    try {
      await rename(temporary, executable)
    } catch (error) {
      try {
        await access(executable)
      } catch {
        throw error
      }
    }
  } finally {
    await unlink(temporary).catch(() => {})
  }
  return executable
}
```

</details>

**依据 5 · 源码核查**：[src/monsterparty.ts:194-232](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/monsterparty.ts#L194-L232)

远程stop/close和凭据流

<details>
<summary>查看原文（39行）</summary>

```text
    let stopFailure: unknown
    if (socket.readyState === WebSocket.OPEN && this.ready) {
      try {
        await this.stop(undefined)
      } catch (error) {
        stopFailure = error
      }
    }
    await closeWebSocket(socket)
    this.markDisconnected()
    if (stopFailure !== undefined) throw stopFailure
  }

  private async resolveSession(signal: AbortSignal): Promise<SessionInfo> {
    const url = new URL(this.config.apiUrl)
    url.searchParams.set('s', this.config.sessionToken)
    const timeout = AbortSignal.timeout(this.config.connectionTimeoutMs)
    const response = await fetch(url, {
      signal: AbortSignal.any([signal, timeout]),
      headers: { 'User-Agent': this.config.userAgent },
    })
    if (!response.ok) throw new ToyError(`MonsterParty session request failed with HTTP ${response.status}`)
    const value: unknown = await response.json()
    if (isObject(value) && typeof value.errNo === 'number' && value.errNo !== 0) {
      throw new ToyError(`MonsterParty rejected the share token (errNo ${value.errNo})`)
    }
    return parseSessionInfo(value)
  }

  private waitUntilReady(socket: WebSocket, signal: AbortSignal): Promise<void> {
    signal.throwIfAborted()
    return new Promise((resolve, reject) => {
      let settled = false
      let senderFd: string | number | undefined
      let pid = ''
      const finish = (error?: Error): void => {
        if (settled) return
        settled = true
        clearTimeout(timeout)
```

</details>

**依据 6 · 源码核查**：[src/macos-ble.ts:175-193](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/macos-ble.ts#L175-L193)

原始发现工具链与临时清理

<details>
<summary>查看原文（19行）</summary>

```text
  try {
    await writeFile(source, MACOS_RAW_BLE_SCANNER_SOURCE, { encoding: 'utf8', mode: 0o600, flag: 'wx' })
    try {
      await runFile('/usr/bin/xcrun', [
        'swiftc',
        '-module-cache-path', moduleCache,
        source,
        '-o', binary,
      ], signal, 30_000)
    } catch (error) {
      if (signal.aborted) throw error
      throw new ToyError(`Could not build the macOS CoreBluetooth scanner; install Xcode Command Line Tools: ${error instanceof Error ? error.message : String(error)}`)
    }
    const output = await runFile(binary, [String(durationMs)], signal, durationMs + 10_000)
    return parseRawBleScan(output)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
```

</details>

#### 缺口

- 本轮未运行三路径安装、下载、协议握手、进程退出或硬件；缓存可信性与服务端token撤销效果未实测。
  **影响**：源码可确认校验和退出设计，不能承诺该平台可用、结束用时、无残留或设备已停。
  **进一步探讨**：先模拟API/WS及进程退出/损坏缓存，用授权空载硬件单独验物理停止；分别记录三路径资源与人工耗时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样支持或否定采用？

**研究主题**：新假设与验证

#### 完整回答

比较手工Intiface与插件执行同一低强度短时命令，记录连接正确率、总步骤、实际输出和停止时延。注入超范围、hold未授权、连续替换、队列阻塞、失联和卸载。若越界被发送、停止超出可接受窗口或设备错配，则停止采用并回到设备官方控制。当前仅提出验证方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:142-171](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L142-L171)

边界与替换可测

<details>
<summary>查看原文（30行）</summary>

```text
  private validateControl(request: RuntimeControlRequest, durationSeconds: number): void {
    if (!Number.isInteger(request.intensityPercent) || request.intensityPercent < 0
      || request.intensityPercent > this.safety.maxIntensityPercent) {
      throw new ToyError(`intensity_percent must be an integer from 0 to ${this.safety.maxIntensityPercent}`)
    }
    if (!Number.isFinite(durationSeconds) || durationSeconds < 0 || durationSeconds > this.safety.maxDurationSeconds) {
      throw new ToyError(`duration_seconds must be from 0 to ${this.safety.maxDurationSeconds}`)
    }
    if (request.intensityPercent > 0 && durationSeconds === 0 && !this.safety.allowHold) {
      throw new ToyError('duration_seconds=0 is disabled; use a positive duration or enable allowHold')
    }
  }

  private scheduleStop(deviceId: string, seconds: number): void {
    const token = Symbol(deviceId)
    const timer = setTimeout(() => {
      void this.exclusive(async () => {
        const current = this.stopTimers.get(deviceId)
        if (current?.token !== token) return
        this.stopTimers.delete(deviceId)
        await this.backend.stop(deviceId)
      }, undefined).catch((error: unknown) => {
        try {
          this.reportFailure(error)
        } catch {
          // The transport is already stopped or failed; a diagnostic sink failure has no remaining recovery path.
        }
      })
    }, seconds * 1_000)
    this.stopTimers.set(deviceId, { token, timer })
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:186-200](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/runtime.ts#L186-L200)

阻塞反例

<details>
<summary>查看原文（15行）</summary>

```text
  private exclusive<T>(
    operation: () => Promise<T>,
    signal: AbortSignal | undefined,
    allowDisposing = false,
  ): Promise<T> {
    if (this.disposing && !allowDisposing) return Promise.reject(new ToyError('dsh-toy is shutting down'))
    let release!: () => void
    const predecessor = this.tail
    this.tail = new Promise(resolve => { release = resolve })
    return (async () => {
      await predecessor
      try {
        if (this.disposing && !allowDisposing) throw new ToyError('dsh-toy is shutting down')
        signal?.throwIfAborted()
        return await operation()
```

</details>

**依据 3 · 源码核查**：[src/buttplug.ts:286-314](https://github.com/c3ll256/dsh-toy/blob/51b582507aa8aad8332e1a5b5a0bc2ae607f4860/src/buttplug.ts#L286-L314)

协议stop及close可测

<details>
<summary>查看原文（29行）</summary>

```text
  async stop(deviceId: string | undefined, signal?: AbortSignal): Promise<void> {
    this.assertConnected()
    if (this.config.protocolVersion === 4) {
      await this.request('StopCmd', {
        ...(deviceId === undefined ? {} : { DeviceIndex: parseDeviceId(deviceId) }),
        Inputs: false,
        Outputs: true,
      }, signal)
      return
    }
    if (deviceId === undefined) await this.request('StopAllDevices', {}, signal)
    else await this.request('StopDeviceCmd', { DeviceIndex: parseDeviceId(deviceId) }, signal)
  }

  async close(): Promise<void> {
    const socket = this.socket
    if (socket === undefined) return
    this.stopPings()
    let stopFailure: unknown
    if (socket.readyState === WebSocket.OPEN) {
      try {
        await this.stop(undefined)
      } catch (error) {
        stopFailure = error
      }
    }
    await closeWebSocket(socket)
    this.loseConnection(new ToyError('Buttplug client closed'))
    if (stopFailure !== undefined) throw stopFailure
```

</details>

#### 缺口

- 没有本轮设备或协议运行数据。
  **影响**：无法确认人身接触场景安全或连接便利的净收益。
  **进一步探讨**：先使用模拟与空载受控设备，保留指令、回执和物理观测。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
