# dsh-ls125-uv-probe

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c252d58](https://github.com/2333hutao/dsh-ls125-uv-probe/tree/c252d589d1d021bc08a386cd110e96cd011cb4a2)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2333hutao/dsh-ls125-uv-probe)
<!-- END META -->

> **功能**：把 LS125/UVALED-X3 私有 UART 读取协议、抓取分析工具及 F103 参考固件注册成 DSH 技能。

> **亮点**：针对单一探头整理命令、字段、CRC、参考固件和抓取路线，比通用串口教程更具可操作性。详见[Q02](#research-q02)。

> **主要限制**：“完全逆向/全部测量证据”范围超出本包可见材料：原始案例在另仓，列出的三份样本只见一份，部分字节和命令仍未定。详见[Q03](#research-q03)。

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
  - [Q01 · 这个条目是实时探头驱动还是供工程师使用的协议技能？](#detail-section-11)
  - [Q02 · 协议知识与可移植实现具体覆盖哪些字节和条件？](#detail-section-12)
  - [Q03 · 证据包完整性与“完全逆向”说法的边界在哪里？](#detail-section-13)
  - [Q04 · 试用需要什么硬件、软件及操作风险？](#detail-section-14)
  - [Q05 · 怎样以最少风险把协议技能用于工程复核？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：工程师需脱离原装仪表用自制 MCU 读取紫外探头，并复核字段、单位与清零操作。

原装表直接读取，或工程师独立抓取 UART 并手写驱动；本包降低特定接口的探索起点。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 技能注册 | 暴露文档 | 不实时读硬件 |
| 协议规格 | 设计自制主机 | 特定设备且部分字节未定 |
| 工具/固件 | 复现与移植 | 本轮未执行，硬件安全需复核 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH skills 服务 | 注册知识 | 无技能入口 |
| LS125/UVALED-X3 与正确供电/接线 | 硬件验证 | 无法独立验结论 |
| 抓取/解码与 MCU 工具链 | 复现/移植 | 仅能读作者文档 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 材料审阅 | 核命令、字段和样本 | 能定位到原始证据 |
| 只读复核 | 离线解帧、台架轮询 | CRC、读数与表显匹配 |
| 有状态操作 | 审批后清零 | 前后状态可追溯 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 阅读 | 安装技能并审文档 | DSH 注册兼容 |
| 复核 | 探头/原表、逻辑分析仪、MCU | 设备批次差异 |
| 应用 | 固件移植、校准与安全接线 | 单位误差、现场可靠性 |

| 结果 | 可见材料 | 未证实 |
| --- | --- | --- |
| 技能注册 | index.js 登记正文 | 宿主实际可用 |
| 协议读取 | 字段、CRC、固件和一份抓取 | 多批次正确性 |
| 硬件验证 | 作者 21/21 帧报告 | 独立重演 |

> **思考**：“完全逆向/全部测量证据”范围超出本包可见材料：原始案例在另仓，列出的三份样本只见一份，部分字节和命令仍未定。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：针对单一探头整理命令、字段、CRC、参考固件和抓取路线，比通用串口教程更具可操作性。详见[Q02](#research-q02)。

包运行时不直接读串口。前置元数据窄解析，资源路径交 skills 服务；测量工具和 MCU 固件是供人工后续使用的资源。

<a id="detail-section-5"></a>

### 1.4 主要限制

“完全逆向/全部测量证据”范围超出本包可见材料：原始案例在另仓，列出的三份样本只见一份，部分字节和命令仍未定。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只读轮询与离线抓取先行，清零单独审批；在独立仪表/标准光源下复核后才上生产设备。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可确认技能注册、协议材料和一份抓取；21/21 帧及全部硬件结论仍为作者报告，原始多轮案例不在本包。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、index.js、skill/SKILL.md、skill/PROTOCOL.md、skill/tools/uv-analyze.cjs、skill/firmware/f103_probe/main.c 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交入口、README、技能、协议、工具及固件源码，核一份采样文件存在；未执行目标脚本、固件或硬件。
- 下一步：独立解码随包二进制并核帧头/CRC；取得原始案例与缺失抓取，跨批次探头对照标准光源、原表与固件读数。

**分析版本**

- **仓库**：[2333hutao/dsh-ls125-uv-probe](https://github.com/2333hutao/dsh-ls125-uv-probe)
- **版本号**：1.0.0（[固定提交 c252d58](https://github.com/2333hutao/dsh-ls125-uv-probe/tree/c252d589d1d021bc08a386cd110e96cd011cb4a2)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

逐项结论绑定可重放采样偏移与硬件版本，清零加单独确认/前后快照，可降低工程误用；尚未实现。详见[Q05](#research-q05)。

独立解码随包二进制并核帧头/CRC；取得原始案例与缺失抓取，跨批次探头对照标准光源、原表与固件读数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 101 | 57 | 33 | — |
| .md | source | 7 | 847 | — | — | 9232 |
| .cjs | source | 6 | 756 | 612 | 82 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2333hutao/dsh-ls125-uv-probe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/2333hutao/dsh-ls125-uv-probe/issues?q=is%3Aissue+created%3A2026-09-22T05%3A40%3A15.869Z..2026-10-22T05%3A40%3A15.869Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2333hutao/dsh-ls125-uv-probe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A40%3A15.869Z..2026-10-22T05%3A40%3A15.869Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分协议技能注册、作者硬件实测与本包可复核材料。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个条目是实时探头驱动还是供工程师使用的协议技能？

**研究主题**：场景与需求

#### 完整回答

包的运行入口只读取 skill/SKILL.md 前置元数据，将正文和资源目录注册到 DSH skills 服务；没有在 DSH 中打开串口或实时读取探头。实际交付是供工程师/agent 设计自制 MCU 主机的协议文档、离线抓取分析脚本和 F103 固件源码。合格结果是在兼容硬件上独立复核命令、单位、CRC、清零副作用，而不是仅安装包后获得测量值。基线是原装 LS125 仪表或工程师自行抓包/手写驱动。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:21-25](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/index.js#L21-L25)

只注入 skills。

```text
/** Cordis plugin name. */
const name = 'ls125-uv-probe';

/** This plugin contributes a skill, so it needs the skills service. */
const inject = ['skills'];
```

**依据 2 · 源码核查**：[index.js:70-100](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/index.js#L70-L100)

注册技能正文与资源目录。

<details>
<summary>查看原文（31行）</summary>

```text
function apply(ctx) {
  if (!existsSync(skillFile)) {
    ctx.logger?.warn?.(`${name}: skill body not found at ${skillFile}; nothing registered`);
    return;
  }

  const { meta, body } = parseFrontmatter(readFileSync(skillFile, 'utf8'));

  ctx.skills.register({
    name: meta.name || name,
    description: meta.description || FALLBACK_DESCRIPTION,
    ...(meta.whenToUse ? { whenToUse: meta.whenToUse } : {}),
    content: body.trimStart(),
    source: 'runtime',
    resourceBase: { kind: 'directory', path: skillDir },
    metadata: {
      package: 'dsh-ls125-uv-probe',
      bundled: [
        'PROTOCOL.md',
        'LESSONS.md',
        'AGENTS.md',
        'README.md',
        'tools/',
        'firmware/',
        'captures/',
      ],
    },
  });
}

export { apply, inject, name };
```

</details>

**依据 3 · 作者声明**：[README.zh.md:1-20](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/README.zh.md#L1-L20)

作者宣称自制主机可替代表。

<details>
<summary>查看原文（20行）</summary>

```text
# dsh-ls125-uv-probe

一个 **DeepSeek Harness 技能插件**，面向 **林上 LinShang LS125 紫外辐照计**及其 **UVALED-X3** 紫外探头：
把表与探头之间的私有 UART 协议完整逆向出来，并附带抓取/解码工具链，以及一份**已验证的探头主机固件**
—— 可以**完全脱离原装表**读取探头。

装上之后，你的 agent 就多了一个 `ls125-uv-probe` 技能：协议速查表、命令字节、工具链用法，
以及那些"让一套完全正常的设备看起来像坏了"的坑。

> English: [README.md](README.md)

## 它能回答什么

| 问题 | 答案 |
|---|---|
| 能不能不用原装表、用我自己的单片机读这个探头？ | **能** —— 已在 STM32F103 上验证：21/21 帧、零 CRC 错、零超时 |
| 协议是什么？ | **9600 8N1**，每 500 ms 轮询一次，探头回 28 字节帧，带 **CRC-16/MODBUS** |
| 有没有隐藏的握手、挑战应答或 ID 校验？ | **没有** —— 轮询命令就是一条恒定不变的 8 字节串 |
| 能清掉探头里的记录吗？ | **能** —— 有第二条命令，会同时清零能量、最小值和时间计数 |
| 必须发原装表那套开机配置命令吗？ | **不用** —— 只发轮询就够了（已验证） |
```

</details>

**依据 4 · 源码核查**：[package.json:1-18](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/package.json#L1-L18)

包发布结构。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-ls125-uv-probe",
  "version": "1.0.0",
  "description": "LinShang LS125 UV irradiance meter / UVALED-X3 probe: fully reverse-engineered 9600 8N1 protocol (28-byte frames, CRC-16/MODBUS, poll + clear commands) provided as a DSH skill, together with the capture/decode toolchain and a verified STM32F103 host firmware.",
  "type": "module",
  "main": "index.js",
  "exports": {
    ".": "./index.js",
    "./package.json": "./package.json"
  },
  "files": [
    "index.js",
    "cordis.patch.yml",
    "skill",
    "README.md",
    "README.zh.md",
    "README.i18n.yaml",
    "LICENSE"
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 协议知识与可移植实现具体覆盖哪些字节和条件？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

技能文档给出 9600 8N1、每 500ms 的 8 字节轮询、10 字节清零、28 字节回帧布局、CRC-16/MODBUS 和单位换算；固件与工具源码提供抓取/解码/参考实现。仓库内有一份 750000 字节的 3 秒逻辑采样二进制，可支持进一步离线复核，但本轮未执行解码或上硬件。关键增量是把特定私有接口的命令、字段、校验和实验路线打包成技能，不是通用串口协议算法。作者宣称 21/21 帧和零错误属于作者实测报告。

#### 证据与依据

**依据 1 · 作者声明**：[skill/SKILL.md:17-49](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md#L17-L49)

协议速查和参考实现指向。

<details>
<summary>查看原文（33行）</summary>

````text
## 1. 协议速查

**物理层**：UART **9600 8N1**，空闲高。三根信号：
`D0` = 主机→探头、`D2` = 探头→主机、`D4` = 静态控制线（**可悬空**，与复位/清零无关）。

**主机命令（末尾 2 字节 = CRC-16/MODBUS 小端）**

```
轮询（每 500 ms 必发）  AB 20 60 00 14 00 89 07
清零                    AB 21 20 00 02 00 01 00 3D 8A
```

**探头回帧（28 字节，帧头 `AB 20 60 00 14 00`）**

| 偏移 | 类型 | 含义 | 单位 |
|---|---|---|---|
| 6–9 | float LE | 实时辐照度 | **µW/cm²**（表显 mW/cm² = ÷1000） |
| 10–13 | float LE | 累积能量 | **µJ/cm²**（= ∫辐照度 dt） |
| 14–15 | uint16 LE | 距上次清零的时间 | **×0.1 s** |
| 16–17 | 2B | 恒 0（含义未定，已排除单位/量程） | — |
| 18–21 | float LE | 最小值 | µW/cm² |
| 22–25 | float LE | 平均辐照度 | µW/cm² |
| 26–27 | uint16 LE | **CRC-16/MODBUS**（over 0–25） | — |

**CRC**：poly `0x8005`（反射实现 `0xA001`）、init `0xFFFF`、LSB-first、xorout `0`。

**关键性质**（都实测过）
- 帧内数值**永远是 µW/cm² / µJ/cm²**，不随表上的单位档变化 ⇒ **主机不用管单位设置**。
- **最大值不在帧里** ⇒ 自己从实时流统计（表也是这么做的）。
- **探头只在被轮询时回帧**，且**不需要任何上电握手**。
- 表的开机配置命令（`AB 40 …` 等 9 条）**自制主机一条都不用发**。

**参考实现**：`firmware/f103_probe/main.c`（轮询 + CRC + 四字段解析 + 可选清零）。
````

</details>

**依据 2 · 作者声明**：[skill/PROTOCOL.md:95-139](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L95-L139)

字段和 CRC 规格及作者验证描述。

<details>
<summary>查看原文（45行）</summary>

````text
## 3. 探头 → 主机：28 字节定长数据帧

| 偏移 | 类型 | 含义 | 单位 | 验证方式 |
|---|---|---|---|---|
| 0–5 | — | 帧头 `AB 20 60 00 14 00`（与轮询命令前 6 字节相同） | — | 全帧一致 |
| 6–9 | float LE | **实时辐照度** | **µW/cm²** | 表显最大值**三轮逐位吻合**（3284.0359↔3.2840 / 3286.2664↔3.2863 / 3290.4019↔3.2904） |
| 10–13 | float LE | **累积能量** | **µJ/cm²** | `d/dt == 辐照度`；清零归零；量级吻合（0.1%） |
| 14–15 | uint16 LE | **距上次清零的时间** | **×0.1 s** | 每帧 +5；清零归零；定量核对 95×0.1 s=9.5 s ≈ 10 s；**表上就有此显示** |
| 16–17 | 2B | 恒 0，含义未定 | — | 切单位后仍为 0 ⇒ **非单位/量程字段** |
| 18–21 | float LE | **最小值 `P_MIN`** | µW/cm² | 清零后跳成当前读数；长期 0 时与表显 `P_MIN 0.0000` 一致；**最大值不可能长期为 0** |
| 22–25 | float LE | **平均辐照度 `P_AVG`** | µW/cm² | 稳态下与实时值相等（差 0.4%） |
| 26–27 | uint16 LE | **CRC-16/MODBUS**(over 0–25) | — | 见下 |

**关键性质**

- **帧内数值永远是 µW/cm² / µJ/cm²，不随表上的单位档变化。**
  证据：单位切到 mW/cm² 时，表显 `P 9.0948 mW/cm²`，帧内 `f6 ≈ 9094.8`；表显 `E 9.3203 mJ/cm²`，
  帧内 `f10 ≈ 9320` ⇒ 一一对应。
- **最大值 `P_MAX` 不在帧里**（16–17 恒 0、其余字段均已定性）⇒ 表自己从实时流统计。
  **自制主机同理：自己取历史最大/最小/平均即可。**
- **探头只在被轮询时回帧**（用 openocd `halt` 暂停主机后，两条线双双 0 边沿）。
- **不需要任何上电握手**：自制主机一开轮询探头即正常应答。
- 表的设置（`Units` / `Energy display` / `Standard Selection` / `Auto off`）**都不进帧**；
  `Energy display = NO` 时帧里 `f10` 照常有值 ⇒ 纯显示开关。

---

## 4. 校验和：CRC-16/MODBUS

```
poly 0x8005（反射实现 0xA001）
init 0xFFFF
LSB-first (refin/refout)
xorout 0x0000
覆盖范围：字节 0 .. 25
存放：字节 26..27，小端
```

**验证**：对两轮独立抓取（238 帧 / 148 帧）穷举 65536 个多项式 × 两种位序 × 3 个初值 × 4 种覆盖范围，
**唯一命中同一条**；再用主机命令交叉验证：

| 命令 | 前 N 字节的 CRC | 小端 | 实际末两字节 |
|---|---|---|---|
| 轮询 `AB 20 60 00 14 00` | 0x0789 | `89 07` | `89 07` ✓ |
| 清零 `AB 21 20 00 02 00 01 00` | 0x8A3D | `3D 8A` | `3D 8A` ✓ |
````

</details>

**依据 3 · 源码核查**：[skill/tools/uv-analyze.cjs:19-57](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/tools/uv-analyze.cjs#L19-L57)

脚本包含 UART 解码和帧头切分。

<details>
<summary>查看原文（39行）</summary>

```text
// ---- UART 8N1 decode ----
const bytes = [], samples = [];
let i = 1;
while (i < N) {
  if (bit(i - 1) === 1 && bit(i) === 0) {
    const start = i;
    const at = k => bit(Math.min(N - 1, Math.round(start + spb * (k + 0.5))));
    if (at(0) === 0) {
      let v = 0;
      for (let k = 1; k <= 8; k++) if (at(k)) v |= (1 << (k - 1));
      if (at(9) === 1) { bytes.push(v); samples.push(start); }
      i = Math.round(start + spb * 10);
      continue;
    }
  }
  i++;
}

const HDR = [0xAB, 0x20, 0x60, 0x00, 0x14, 0x00];
const starts = [];
for (let p = 0; p + HDR.length <= bytes.length; p++) {
  let ok = true;
  for (let k = 0; k < HDR.length; k++) if (bytes[p + k] !== HDR[k]) { ok = false; break; }
  if (ok) { starts.push(p); p += HDR.length - 1; }
}
const lenCount = {};
const rawFrames = [];
for (let f = 0; f < starts.length; f++) {
  const a = starts[f], b = (f + 1 < starts.length) ? starts[f + 1] : bytes.length;
  const d = bytes.slice(a, b);
  lenCount[d.length] = (lenCount[d.length] || 0) + 1;
  rawFrames.push({ t: samples[a] / sr, d });
}
const mainLen = Number(Object.keys(lenCount).sort((x, y) => lenCount[y] - lenCount[x])[0]);
const F = rawFrames.filter(f => f.d.length === mainLen);
const hex = v => v.toString(16).padStart(2, '0').toUpperCase();

console.log('frames total=' + rawFrames.length + '  mainLen=' + mainLen + '  used=' + F.length);
console.log('duration=' + (N / sr).toFixed(2) + 's  frame interval=' + (F.length > 1 ? ((F[F.length - 1].t - F[0].t) / (F.length - 1)).toFixed(3) : '?') + 's');
```

</details>

**依据 4 · 源码核查**：[skill/firmware/f103_probe/main.c:1-60](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/firmware/f103_probe/main.c#L1-L60)

随包固件源码。

<details>
<summary>查看原文（60行）</summary>

```text
/*
 * main.c - STM32F103 acts as the HOST side of the LinShang LS125 probe link,
 *          with NO original meter involved.
 *
 * It sends the fixed 8-byte poll every 500 ms on USART1 and parses the probe's
 * 28-byte reply (CRC-16/MODBUS + three little-endian floats).
 *
 * Wiring:
 *   PA9  USART1_TX  9600 8N1  -> probe's "meter->probe" line  (was LA channel D0)
 *   PA10 USART1_RX  9600 8N1  <- probe's "probe->meter" line  (was LA channel D2)
 *   PA2  USART2_TX 115200 8N1 -> debug ASCII (optional: clip to a spare LA channel)
 *   GND <-> probe GND,  5V -> probe 5V
 *   probe's 3rd signal (was LA channel D4, always low) is LEFT FLOATING on purpose,
 *   to find out whether the probe actually needs it.
 *
 * The original meter MUST be unplugged, else its TX fights ours on the same wire.
 *
 * No interrupts are used at all: RX is polled (9600 baud = 1.04 ms/byte, plenty).
 * PB12/13/14 (the RGB light source used earlier) are kept OFF.
 */

#include <stdint.h>

#define RCC_APB2ENR (*(volatile uint32_t *)0x40021018u)
#define RCC_APB1ENR (*(volatile uint32_t *)0x4002101Cu)

#define GPIOA_CRL   (*(volatile uint32_t *)0x40010800u)
#define GPIOA_CRH   (*(volatile uint32_t *)0x40010804u)
#define GPIOB_CRH   (*(volatile uint32_t *)0x40010C04u)
#define GPIOB_BSRR  (*(volatile uint32_t *)0x40010C10u)

#define USART1_SR   (*(volatile uint32_t *)0x40013800u)
#define USART1_DR   (*(volatile uint32_t *)0x40013804u)
#define USART1_BRR  (*(volatile uint32_t *)0x40013808u)
#define USART1_CR1  (*(volatile uint32_t *)0x4001380Cu)

#define USART2_SR   (*(volatile uint32_t *)0x40004400u)
#define USART2_DR   (*(volatile uint32_t *)0x40004404u)
#define USART2_BRR  (*(volatile uint32_t *)0x40004408u)
#define USART2_CR1  (*(volatile uint32_t *)0x4000440Cu)

#define SYSTICK_CTRL (*(volatile uint32_t *)0xE000E010u)
#define SYSTICK_LOAD (*(volatile uint32_t *)0xE000E014u)
#define SYSTICK_VAL  (*(volatile uint32_t *)0xE000E018u)

#define SYSCLK_HZ 8000000u
#define BIT(n) (1u << (n))

#define PIN_RED   12u
#define PIN_GREEN 14u
#define PIN_BLUE  13u

/* ---------------- millisecond time base (polled, no interrupt) ---------------- */
static volatile uint32_t g_ms = 0u;

static void systick_start(void)
{
    SYSTICK_LOAD = (SYSCLK_HZ / 1000u) - 1u;
    SYSTICK_VAL  = 0u;
    SYSTICK_CTRL = 5u;              /* ENABLE=1, CLKSOURCE=processor clock */
```

</details>

#### 缺口

- 本轮未独立解码采样或运行固件。
  **影响**：不能把作者测量结果当独立验证。
  **进一步探讨**：从二进制独立提帧、核 CRC/字段，再用可控硬件比对仪表。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 证据包完整性与“完全逆向”说法的边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

README/技能称有多轮抓取、原始 17 节证据、21/21 固件验证，但原始案例指向另一个 nanodla-logic-analyzer 路径，本仓库可见的 captures 仅一份 f103host-3s，技能正文列的 dark、20s、188s 样本并未随该固定提交出现。文档仍标帧偏移 16–17 含义未定、AB70 参数疑似量程，因此“完全逆向”只能理解为已知轮询/清零读取路径可用的作者主张，不能扩展到全部命令、所有硬件版本或计量标定。清零改变探头累积能量、最小值、计时，是有状态副作用。

#### 证据与依据

**依据 1 · 作者声明**：[skill/SKILL.md:9-13](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md#L9-L13)

作者完整逆向/21帧和外部案例指向。

```text
**一句话**：探头**只需要被 9600 8N1 轮询**，就会每 500 ms 回报一个 28 字节测量帧。
协议已完全逆向，**可以用自制 MCU 完全替代原装表**（已实测：21/21 帧、零 CRC 错、零超时）。

本技能是操作入口；完整规格见工程包里的 `PROTOCOL.md`，方法论与踩坑见 `LESSONS.md`，
原始证据（17 节）见 `nanodla-logic-analyzer/references/case-ls125-uv-meter.md`。
```

**依据 2 · 作者声明**：[skill/SKILL.md:69-71](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md#L69-L71)

正文列三份样本。

```text
包里自带样本（无需硬件）：
`captures\ls125-dark-3s.bin`（1 MHz / 3 s）、`ls125-f103host-20s.bin`（250 kHz / 20 s）、
`ls125-settings-188s.bin`（100 kHz / 188 s，含表的完整配置命令序列）。
```

**依据 3 · 作者声明**：[skill/PROTOCOL.md:95-118](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L95-L118)

16–17 未定与读取路径。

<details>
<summary>查看原文（24行）</summary>

```text
## 3. 探头 → 主机：28 字节定长数据帧

| 偏移 | 类型 | 含义 | 单位 | 验证方式 |
|---|---|---|---|---|
| 0–5 | — | 帧头 `AB 20 60 00 14 00`（与轮询命令前 6 字节相同） | — | 全帧一致 |
| 6–9 | float LE | **实时辐照度** | **µW/cm²** | 表显最大值**三轮逐位吻合**（3284.0359↔3.2840 / 3286.2664↔3.2863 / 3290.4019↔3.2904） |
| 10–13 | float LE | **累积能量** | **µJ/cm²** | `d/dt == 辐照度`；清零归零；量级吻合（0.1%） |
| 14–15 | uint16 LE | **距上次清零的时间** | **×0.1 s** | 每帧 +5；清零归零；定量核对 95×0.1 s=9.5 s ≈ 10 s；**表上就有此显示** |
| 16–17 | 2B | 恒 0，含义未定 | — | 切单位后仍为 0 ⇒ **非单位/量程字段** |
| 18–21 | float LE | **最小值 `P_MIN`** | µW/cm² | 清零后跳成当前读数；长期 0 时与表显 `P_MIN 0.0000` 一致；**最大值不可能长期为 0** |
| 22–25 | float LE | **平均辐照度 `P_AVG`** | µW/cm² | 稳态下与实时值相等（差 0.4%） |
| 26–27 | uint16 LE | **CRC-16/MODBUS**(over 0–25) | — | 见下 |

**关键性质**

- **帧内数值永远是 µW/cm² / µJ/cm²，不随表上的单位档变化。**
  证据：单位切到 mW/cm² 时，表显 `P 9.0948 mW/cm²`，帧内 `f6 ≈ 9094.8`；表显 `E 9.3203 mJ/cm²`，
  帧内 `f10 ≈ 9320` ⇒ 一一对应。
- **最大值 `P_MAX` 不在帧里**（16–17 恒 0、其余字段均已定性）⇒ 表自己从实时流统计。
  **自制主机同理：自己取历史最大/最小/平均即可。**
- **探头只在被轮询时回帧**（用 openocd `halt` 暂停主机后，两条线双双 0 边沿）。
- **不需要任何上电握手**：自制主机一开轮询探头即正常应答。
- 表的设置（`Units` / `Energy display` / `Standard Selection` / `Auto off`）**都不进帧**；
  `Energy display = NO` 时帧里 `f10` 照常有值 ⇒ 纯显示开关。
```

</details>

**依据 4 · 作者声明**：[skill/PROTOCOL.md:81-91](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L81-L91)

AB70 参数仍为推测。

<details>
<summary>查看原文（11行）</summary>

```text
### 2.5 命令字节族规律

| 首字节 | 形态 | 推测含义 |
|---|---|---|
| `AB 20 xx ...` | 6B 载荷 + CRC = 8B | **读/查询**（轮询即 `AB 20 60 00 14 00`） |
| `AB 21 xx ...` | 8B 载荷 + CRC = 10B | **写**（`AB 21 20 ...` = 清零） |
| `AB 40 xx ...` | 8B 载荷 + CRC = 10B | **写设置/标定** |
| `AB 70 xx ...` | 11–14B 载荷 + CRC | **进入测量/量程类** |

**`AB 70 80` 载荷的第 9–11 字节会变**：`01 7E 80`(0x017E80=98944) ↔ `00 BF 40`(0x00BF40=48960)，
**约 2 倍**，疑似**量程/增益**（单位是 1000 倍关系，不是 2 倍）。
```

</details>

**依据 5 · 作者声明**：[skill/PROTOCOL.md:37-52](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L37-L52)

清零三字段变化。

<details>
<summary>查看原文（16行）</summary>

````text
### 2.2 清零

```
AB 21 20 00 02 00 01 00 | 3D 8A
└──── 8 字节载荷 ──────┘ └ CRC ┘
```

按表上的 `DEL` 时，表在**一次轮询之后紧跟**这条命令发出（抓到的"帧"是 18 字节 = 8+10）。

**清零的三个效果**（用自制 F103 复现验证）：

| 字段 | 清零前 | 清零后 |
|---|---|---|
| 累积能量（10–13） | 2,883,738 | **4,101.7**（归零并重新累加） |
| 最小值（18–21） | 0.000 | **9088.459**（重置为当前读数） |
| 计时（14–15） | 3182 | **4**（归零重新计时） |
````

</details>

#### 缺口

- 原始 17 节案例不在当前包内。
  **影响**：实测链条不能完整复核。
  **进一步探讨**：取得对应版本原始案例及三份抓取，核哈希与结论映射。
- 无不同探头固件版本与计量对照。
  **影响**：通用性及精度未知。
  **进一步探讨**：跨批次探头和标准光源重复测量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用需要什么硬件、软件及操作风险？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

阅读技能无需硬件；复核须 LS125/UVALED-X3、可靠供电/共地、逻辑分析仪或 MCU、相应固件工具链和可观测原表显示。包运行入口只依赖 DSH skills 注册，peer 约束 @deepseek-ai/dsh-skill；抓取脚本/固件则另有 Windows libusb、FX2LA 或 STM32F103 生态成本。技能明确警告原装表与自制主机 TX 不能同时接、分析仪输入不能直接接 5V；清零命令会更改探头内部累计状态。Windows sigrok 故障归因及兼容范围属于作者观察，不能直接推广。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:40-47](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/package.json#L40-L47)

peer 与 Bundle。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-skill": ">=0.1.0-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.2.0-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  }
```

**依据 2 · 源码核查**：[index.js:70-100](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/index.js#L70-L100)

注册路径。

<details>
<summary>查看原文（31行）</summary>

```text
function apply(ctx) {
  if (!existsSync(skillFile)) {
    ctx.logger?.warn?.(`${name}: skill body not found at ${skillFile}; nothing registered`);
    return;
  }

  const { meta, body } = parseFrontmatter(readFileSync(skillFile, 'utf8'));

  ctx.skills.register({
    name: meta.name || name,
    description: meta.description || FALLBACK_DESCRIPTION,
    ...(meta.whenToUse ? { whenToUse: meta.whenToUse } : {}),
    content: body.trimStart(),
    source: 'runtime',
    resourceBase: { kind: 'directory', path: skillDir },
    metadata: {
      package: 'dsh-ls125-uv-probe',
      bundled: [
        'PROTOCOL.md',
        'LESSONS.md',
        'AGENTS.md',
        'README.md',
        'tools/',
        'firmware/',
        'captures/',
      ],
    },
  });
}

export { apply, inject, name };
```

</details>

**依据 3 · 作者声明**：[skill/SKILL.md:78-87](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md#L78-L87)

接线与工具风险警告。

<details>
<summary>查看原文（10行）</summary>

```text
## 3. 硬规则（每条都真实踩过）

1. **原装表必须拔掉**才能接自制主机 —— 否则两个 TX 抢同一根线。
2. **必须共地**；**逻辑分析仪的 GND 一定要接**，否则 8 通道全部悬空读高、什么都看不到。
3. **不要把 5V 接到分析仪任何通道**（输入范围 [−0.5, 5.25] V）。
4. **分析仪打不开（`LIBUSB_ERROR_NOT_SUPPORTED`）时不要去修驱动** ——
   那是 sigrok 内置的 2016 年 libusb 的问题，重装/重启/换口全部无效；
   **用 `tools/fx2cap.cjs` 绕开**。
5. **fx2lafw 没有 STOP 命令** ⇒ 抓取前必须 USB 复位（工具已默认做）；**别 kill 抓取进程**（会丢数据，用 `--stopfile`）。
6. **怀疑解码器之前先看原始游程** —— 基于边沿的解码器会被 1 采样宽的串扰毛刺打断，
```

</details>

**依据 4 · 作者声明**：[README.zh.md:65-68](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/README.zh.md#L65-L68)

作者 Windows libusb 说法。

```text
工具链绕开了一个长期存在的 sigrok 问题：所有 Windows 版 sigrok 都静态链接同一个 **2016 年的 libusb**，
它的后端派发在某些系统上必然失败，于是 `fx2lafw` 报 `LIBUSB_ERROR_NOT_SUPPORTED`，而 `--scan` 却还能列出设备。
**重装驱动没用。** `fx2cap.cjs` 改用官方 libusb 直接与设备通信，并补上 sigrok 没有的两个能力：
**没有抓取时长上限**、以及**软触发**。
```

#### 缺口

- 未运行硬件/抓取工具。
  **影响**：实际兼容和操作成本未知。
  **进一步探讨**：隔离台架记录安装、接线、抓取、校验时间和失败点。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样以最少风险把协议技能用于工程复核？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先把当前包当协议候选与参考固件，保存原表基线；在不发送清零命令的只读轮询下，独立解析所附抓取并核 28 字节帧头/CRC/时间间隔，再在隔离台架用仪表读数和标准光源比对单位及误差。新的未实现假设是将协议结论逐条链接到可重放抓取偏移、实验记录和硬件版本，并为清零单独设确认与前后快照；这样更适合工程审查。对照手工逆向看独立复核耗时、错误命令率、单位误判与复现率。

#### 证据与依据

**依据 1 · 作者声明**：[skill/PROTOCOL.md:122-139](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L122-L139)

CRC 规格与作者对照。

<details>
<summary>查看原文（18行）</summary>

````text
## 4. 校验和：CRC-16/MODBUS

```
poly 0x8005（反射实现 0xA001）
init 0xFFFF
LSB-first (refin/refout)
xorout 0x0000
覆盖范围：字节 0 .. 25
存放：字节 26..27，小端
```

**验证**：对两轮独立抓取（238 帧 / 148 帧）穷举 65536 个多项式 × 两种位序 × 3 个初值 × 4 种覆盖范围，
**唯一命中同一条**；再用主机命令交叉验证：

| 命令 | 前 N 字节的 CRC | 小端 | 实际末两字节 |
|---|---|---|---|
| 轮询 `AB 20 60 00 14 00` | 0x0789 | `89 07` | `89 07` ✓ |
| 清零 `AB 21 20 00 02 00 01 00` | 0x8A3D | `3D 8A` | `3D 8A` ✓ |
````

</details>

**依据 2 · 作者声明**：[skill/SKILL.md:69-95](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md#L69-L95)

样本与复核路径。

<details>
<summary>查看原文（27行）</summary>

```text
包里自带样本（无需硬件）：
`captures\ls125-dark-3s.bin`（1 MHz / 3 s）、`ls125-f103host-20s.bin`（250 kHz / 20 s）、
`ls125-settings-188s.bin`（100 kHz / 188 s，含表的完整配置命令序列）。

**采样率必须 ≥ 波特率 × 10**（9600 用 100–250 kHz 足够；
115200 在 250 kHz 下只有 2.2 采样/位，**解不出来**）。

---

## 3. 硬规则（每条都真实踩过）

1. **原装表必须拔掉**才能接自制主机 —— 否则两个 TX 抢同一根线。
2. **必须共地**；**逻辑分析仪的 GND 一定要接**，否则 8 通道全部悬空读高、什么都看不到。
3. **不要把 5V 接到分析仪任何通道**（输入范围 [−0.5, 5.25] V）。
4. **分析仪打不开（`LIBUSB_ERROR_NOT_SUPPORTED`）时不要去修驱动** ——
   那是 sigrok 内置的 2016 年 libusb 的问题，重装/重启/换口全部无效；
   **用 `tools/fx2cap.cjs` 绕开**。
5. **fx2lafw 没有 STOP 命令** ⇒ 抓取前必须 USB 复位（工具已默认做）；**别 kill 抓取进程**（会丢数据，用 `--stopfile`）。
6. **怀疑解码器之前先看原始游程** —— 基于边沿的解码器会被 1 采样宽的串扰毛刺打断，
   把合法的 8N1 报成乱码。

---

## 4. 复核方式（改结论前必做）

要推翻本文任何结论，必须给出**新的实测证据**（新抓取的字节，或与表显的逐位对照），
不能靠推理。最有力的验证手段是**让仪器自己的显示屏当权威参照**：
```

</details>

**依据 3 · 作者声明**：[skill/PROTOCOL.md:37-52](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md#L37-L52)

清零会改变测量状态。

<details>
<summary>查看原文（16行）</summary>

````text
### 2.2 清零

```
AB 21 20 00 02 00 01 00 | 3D 8A
└──── 8 字节载荷 ──────┘ └ CRC ┘
```

按表上的 `DEL` 时，表在**一次轮询之后紧跟**这条命令发出（抓到的"帧"是 18 字节 = 8+10）。

**清零的三个效果**（用自制 F103 复现验证）：

| 字段 | 清零前 | 清零后 |
|---|---|---|
| 累积能量（10–13） | 2,883,738 | **4,101.7**（归零并重新累加） |
| 最小值（18–21） | 0.000 | **9088.459**（重置为当前读数） |
| 计时（14–15） | 3182 | **4**（归零重新计时） |
````

</details>

#### 缺口

- 证据索引与清零确认未实现。
  **影响**：不能算现有能力。
  **进一步探讨**：补全证据后由非作者复核并量化。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
