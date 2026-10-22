# dsh-almost-full-access

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[269ab86](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access) [![npm 30d 820](https://img.shields.io/static/v1?label=npm+30d&message=820&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-almost-full-access)
<!-- END META -->

> **实现功能**：为 DSH 增加近全权限预设，以命令规则、子代理和用户审批门控部分 shell 执行。

> **核心亮点**：将确定性命令分析、无工具子代理审查和会话审批 UI 接成低摩擦权限原型；但这种应用层组合不能替代宿主的统一执行授权。详见[Q01](#research-q01)。

> **风险与缺陷**：几处条件未满足时直接 next，而 preset 底层是 danger-full-access/approval never；remembered/LLM 缓存仅按 32 位命令哈希，GET queue 和 POST decide 无独立登录绑定。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 该预设解决什么权限体验，相对宿主原生模式新增什么？](#detail-section-11)
  - [Q02 · 确定性规则、子代理、审批与失败回退如何流转？](#detail-section-12)
  - [Q03 · 同命令记忆是否精确绑定，审批端点是否独立确认操作者？](#detail-section-13)
  - [Q04 · 安装覆盖、日常审查与失败恢复的成本是什么？](#detail-section-14)
  - [Q05 · 怎样让审批绑定、工具覆盖和故障默认值满足安全模式要求？](#detail-section-15)
  - [Q06 · 此固定版本能否作为用户的默认安全权限档？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想减少工作区外可逆操作审批、保留危险命令确认的 Windows DSH 用户；安全交付须覆盖所有实际执行路径。详见[Q01](#research-q01)。

宿主 workspace-write 和原生逐项审批有统一权限边界；本预设若放宽底层权限，应证明所有执行入口同样受强制保护，目前不足。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预设安装 | 增加近全权限档 | 基础为 danger-full-access/never |
| shell 审查 | 拦部分命名 shell 工具 | 新工具/无 session/无 command 可直通 |
| 审批记忆 | 减少重复确认 | 仅 32 位哈希绑定 |
| 审批面板 | 展示并处理命令 | 独立身份/Origin 绑定依赖 Host |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools/subagents/permissionPresets 等 | 必需 | 审查与预设查询 | 部分缺失会不加载或门控直通 |
| webServer/userQuestions/客户端面板 | 审批必需 | 用户决策 | 回退文本或超时拒绝 |
| profile patch 写权限 | 安装必需 | 注册预设与插件 | 不生效或覆盖其他预设 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 仅隔离虚拟机备份 profile | 可回滚，工具清单已枚举 |
| 安装 | dry-run 核差异后手工装配 | preset/插件均加载 |
| 审查 | 对危险命令核原文/目录/工具/影响 | 用户明确决策，未授权不执行 |
| 复盘 | 注入新工具、服务失败与碰撞情形 | 任一风险不得直通 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH/模型子代理环境；金额未知 | 备份/审查 profile permission 整块替换；耗时未知 | 宿主接口兼容未核 |
| 持续使用 | 子代理调用与日志、审批等待；数值未知 | 审批逐条审看、维护规则与工具名单 | 新工具可越过门控 |
| 失败恢复 | 未授权操作可能不可逆；损失未知 | 恢复预设、审计和系统状态；耗时未知 | 日志 best-effort |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 命令分流 | 确定性规则/子代理/审批源码 | 真实宿主的工具覆盖 |
| 审批复用 | 会话内命令哈希记忆 | 碰撞及跨上下文安全性 |
| 失败拒绝 | abort、超时、子代理异常路径 | session/preset 不可用时会直通 |

> **思考**：几处条件未满足时直接 next，而 preset 底层是 danger-full-access/approval never；remembered/LLM 缓存仅按 32 位命令哈希，GET queue 和 POST decide 无独立登录绑定。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将确定性命令分析、无工具子代理审查和会话审批 UI 接成低摩擦权限原型；但这种应用层组合不能替代宿主的统一执行授权。详见[Q01](#research-q01)。

将确定性命令分析、无工具子代理审查和会话审批 UI 接成低摩擦权限原型；但这种应用层组合不能替代宿主的统一执行授权。详见[Q01](#research-q01)。

确定性风险先于 LLM、工具禁用子代理及审批超时可借鉴；安全门控必须放在统一执行边界。详见[Q05](#research-q05)。

固定版本跨插件比较保留为未验证设计推演。跨插件固定源码比较中，本项记住审批与LLM裁决仅用32位命令文本短哈希，未绑定会话、cwd和脚本版本；余额侧栏按probe缓存并取首匹配route凭据；zcode-usage-stats把磁盘缓存固定到HOME下web profile且模块缓存未按当前sessionPersistence分区；plugin-balance把请求给出的目标URL/path与header或服务端凭据组合，Bearer随目标发送。四者分别是权限决定、账户归属、历史范围及凭据目的地问题，不能用同一种缓存优化替代各自边界。zcode入口已有宿主requestRejection，不能把缓存范围问题扩写为匿名可访问。由此保留未验证假设，为操作声明必要上下文身份与版本（会话、规范工作区/脚本摘要、route与非秘密账户指纹、目标origin、采样范围和时间），缺身份拒复用，变化即使旧结论失效；凭据目的地还必须独立验证允许接收方。最小对照用两个工作区同名异内容脚本、双route账户切换、双profile同HOME缓存以及伪造custom目标，要求不误批、不混数、不误发秘密，同时测维护与恢复工时。若绑定后仍误归属/误授权，或维护成本超过收益则否定；本轮未执行这些对照。

比较依据见[Alnita-M/dsh-Almost_Full_Access](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L276-L291)、[AlienGene/dsh-llm-balance-siderbar](https://github.com/AlienGene/dsh-llm-balance-siderbar/blob/b35aa1e8501051ab3541cea2f43f0609b214f9a1/src/state.ts#L87-L101)、[Amer-CN/zcode-usage-stats](https://github.com/Amer-CN/zcode-usage-stats/blob/9a4381658e754515dac50611da461970462032ec/lib/index.mjs#L280-L308)、[Andrew111888/dsh-plugin-balance](https://github.com/Andrew111888/dsh-plugin-balance/blob/96bb1592c949456aa37ccc3a296085f59df2ee9c/lib/index.js#L726-L759)。旧原文副本缺失，本轮重新保存固定 Git 原文，不声称旧副本逐字一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

几处条件未满足时直接 next，而 preset 底层是 danger-full-access/approval never；remembered/LLM 缓存仅按 32 位命令哈希，GET queue 和 POST decide 无独立登录绑定。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

重要环境不推荐；仅隔离虚拟机作安全研究原型，修补强制边界并经独立验证后重评。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认审批流程存在，但底层无沙箱、门控有限、服务解析失败直通、短哈希记忆和路由授权依赖宿主；未实测真实绕过。安全增强假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、lib/index.js、lib/analyze.js、lib/client.js、scripts/install.mjs、scripts/patch-lib.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README、SECURITY、Host/Client、规则分析、安装器与 patch；未执行目标测试、真实宿主/攻击链或安装；旧 META 仅复用。
- 下一步：隔离 VM 中枚举执行工具/参数、session 故障、哈希碰撞、跨会话审批和路由认证，核未授权副作用为零并比较审批延迟。

**分析版本**

- **仓库**：[Alnita-M/dsh-Almost_Full_Access](https://github.com/Alnita-M/dsh-Almost_Full_Access)
- **版本号**：1.2.0（[固定提交 269ab86](https://github.com/Alnita-M/dsh-Almost_Full_Access/tree/269ab865fd02a4dded171eaecc40b1255f5df227)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是宿主统一强制授权、失败默认拒绝，强摘要+原文/会话/目录绑定审批记忆，路由绑定真实认证会话；以新工具、碰撞和服务故障夹具核未授权执行。详见[Q05](#research-q05)。

隔离 VM 中枚举执行工具/参数、session 故障、哈希碰撞、跨会话审批和路由认证，核未授权副作用为零并比较审批延迟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 390 | — | — | 4770 |
| .js | source | 3 | 1255 | 1052 | 154 | — |
| .mjs | source | 3 | 1098 | 881 | 137 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+created%3A2026-09-21T08%3A01%3A03.040Z..2026-10-21T08%3A01%3A03.040Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alnita-M/dsh-Almost_Full_Access/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A01%3A03.040Z..2026-10-21T08%3A01%3A03.040Z)



统计日期：2026-10-21。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Almost Full Access 的审批保护是否覆盖实际执行通道、缓存与端点授权边界，能否作为安全权限模式？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 该预设解决什么权限体验，相对宿主原生模式新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向 Windows DSH Web/Desktop 用户，希望比 workspace-write 更易做工作区外可逆操作，同时对删除、系统变更和动态命令保留人工审批。合格交付需要所有可能改变目标环境的执行路径都受与宣传一致的门控，审批与命令精确绑定，默认拒绝在故障时真正阻止执行。作者把预设、文本规则、LLM 子代理审查、面板、审计与安装器组合；原生 sandbox/approval 和工具拦截接口属于宿主。该包的 permission 预设实际给 danger-full-access/approval never，保护完全依赖插件对 tools/pre-execute 的覆盖。作者已声明只覆盖命名 shell 工具，其他执行工具不受保护；因此不能称其为完整安全边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-32](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/README.md#L1-L32)

作者的权限定位和审查承诺。

<details>
<summary>查看原文（32行）</summary>

```text
# 🛡️ dsh-Almost Full Access

介于 **workspace-write** 与 **Full access** 之间的权限模式，专为 [DeepSeek Harness](https://github.com/deepseek-ai) (dsh) Web 版设计。

## 一种权限预设 · 轻量规则 + 动态命令子代理审查

切换到 **🛡️ Almost Full Access**（位于 workspace-write 与 Full access 之间）后：

**确定性规则（毫秒级，命中即弹审批面板）** 只拦两类：
1. **不可逆损失**：删除/清空/覆写粉碎（rm、ri、Remove-Item、shred、truncate…）、卸载（winget/pip/npm uninstall、msiexec /x…）、格式化/分区；
2. **影响系统正确运行**：引导、服务、驱动、系统注册表（HKLM）、账户、策略、防火墙、计划任务、卷影副本、`setx /M`，以及**写系统关键路径**（C:\Windows、Program Files、ProgramData、/etc、/usr、`\\.\PhysicalDriveN` 等）。

**动态/间接命令（交 LLM 子代理快审）**：`iex`、`curl`/下载执行、`Start-Process`、`ssh`、`sudo`、脚本调用、`.NET` 写类调用、拼接构造等——子代理判 safe 直接放行，判 risky 才弹面板；同命令 5 分钟内复用审查结果。

**直接放行（可逆、用户级）**：工作区外新建/复制/解压到普通路径、HKCU 用户注册表、安装软件（winget/pip/msiexec /i）、`setx`（无 /M）、工作区内一切操作。

## Safe Mode 的两层审查

1. **确定性快路径（毫秒级）**：危险动词表（`bcdedit` / `diskpart` / `Stop-Service` / `pnputil` / `takeown` / `reg add HKLM` / `winget` / PowerShell 别名 `ri` `ni` `sc` `sp` …）+ 工作区外写路径包含判断（支持 `C:\`、`%TEMP%`、`$env:`、UNC、注册表路径、`..\` 相对路径穿越、`/etc` 等 POSIX 路径）+ .NET 静态调用/动态拼接/反引号等间接构造一律交子代理。
2. **LLM 子代理兜底**：只有动态/间接命令（`iex`、`Invoke-WebRequest`、下载、`.NET` 调用、调用运算符、字符串拼接、`$(…)`、外部程序调用等）才起子代理审查；**确定性命中的风险锁定为必审批，子代理无法改判放行**。

命中风险 → 弹出**风格 A 简约审批面板**（悬浮于输入框上方，蓝色品牌盾牌 logo）：

- 风险徽章（高风险/中风险/需确认）+ 判定来源
- 命令单行摘要（点击展开全文、一键复制）
- 逐条影响列表（高风险首条红色强调）
- 工作区/工作目录上下文
- **允许执行**（左，次按钮）/ **拒绝执行**（右，主按钮）· `Esc` = 拒绝
- **记住本次会话的此命令**：以命令哈希为键，仅内容完全相同的命令免重复审批（同类不同命令仍需确认）；高风险（引导类）命令不可记忆
- 10 分钟未决自动拒绝；Client 面板不可用时自动降级为文本审批卡

安全命令毫秒放行、零开销；切回其它权限模式（只读/工作区/Full access）时门控自动关闭。
```

</details>

**依据 2 · 源码核查**：[scripts/patch-lib.mjs:22-48](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/patch-lib.mjs#L22-L48)

almost-full-access 预设实际为 danger-full-access/approval never。

<details>
<summary>查看原文（27行）</summary>

```text
export const PERMISSION_BLOCK = `# dsh-Almost Full Access: 权限模式预设（🛡️ Almost Full Access）
- id: permission
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: ask
      workspace-write:
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never

`;

export const INSERT_BLOCK = `# dsh-Almost Full Access: 插件本体挂载
- insert:
    - id: afaccess
      name: dsh-almost-full-access

`;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:120-125](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L120-L125)

只列出有限 shell 工具名。

```text
  // A3：门控覆盖的 shell 执行工具名（可扩展；描述与文档按此边界声明）
  const GATED_TOOLS = new Set(['pwsh', 'bash', 'powershell', 'cmd', 'sh', 'zsh', 'fish', 'shell'])
  // v1.2.0：Almost Full Access 单一审查模式 —— 确定性规则只拦不可逆/系统级；
  // 动态/间接命令由 LLM 子代理审查兜底（同命令 5 分钟结果缓存，避免繁琐）
  const GATED_PRESETS = new Set(['almost-full-access'])
  const llmVerdictCache = new Map() // commandHash -> { verdict, impacts, ts }
```

**依据 4 · 源码核查**：[lib/index.js:453-467](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L453-L467)

非列名工具、无 agent/预设/命令字符串时直接 next。

<details>
<summary>查看原文（15行）</summary>

```text
  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
    if (command.trim() === '') return next()
```

</details>

**依据 5 · 作者声明**：[SECURITY.md:19-27](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/SECURITY.md#L19-L27)

作者声明其他命令类工具不覆盖。

````text
- 会话记忆仅存在于 Host 进程内存，键为命令哈希（同命令免重复审批），高风险
  （引导类）命令不可记忆；
- 确定性规则命中的命令锁定为必审批，LLM 子代理无法将其改判为 safe 放行；
- 审查提示词声明命令文本不可信（防提示注入），代码围栏对 ``` 做了转义；
- 命令在执行前被中断（abort）一律按拒绝处理（fail-closed）；
- 超时/降级一律按拒绝处理（fail-closed）；
- 审计日志写入 `$DSH_HOME/afaccess/afaccess.log`，常见密钥模式已脱敏；
- 门控覆盖 pwsh/bash/powershell/cmd 等 shell 执行工具；其他命令执行类工具
  （若宿主注册）不在审查范围，请在文档声明的边界内使用该预设。
````

#### 缺口

- 目标宿主的全部执行工具、事件顺序和内建保护未核
  **影响**：不能枚举真实绕过范围或断言宿主无其他独立限制
  **进一步探讨**：目标版本列出所有执行/文件写入工具，逐条核是否经过门控与底层权限

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 确定性规则、子代理、审批与失败回退如何流转？

**研究主题**：功能与机制

#### 完整回答

仅在当前 preset 为 almost-full-access 且工具名在 GATED_TOOLS、arguments.command 为字符串时进入 analyzeCommand。确定性 impacts 非空直接 risky；否则 ambiguous 启无工具子代理返回结构化 safe/risky，并按命令哈希缓存 5 分钟；其余确定性 safe 直接 next。risky 建 pending 审批，浏览器 GET queue 轮询并 POST decide；面板不活跃 20 秒后尝试 userQuestions 文本卡，10 分钟未决拒绝，abort 也拒绝。审批通过才 next。这个流程对所拦路径有明确 fail-closed 意图；不过读取当前 session/preset 失败时返回空字符串并直接 next，因而宿主服务出错并非统一拒绝。审计是异步 best-effort，日志失败不阻止执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:161-199](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L161-L199)

session/preset 失败回退到空字符串。

<details>
<summary>查看原文（39行）</summary>

```text
  // v1.1.1（dsh 0.1.1-rc.2 适配）：Agent 接口不再暴露 session，
  // 经 sessions 服务按 agent.id 回退获取 Session（兼容旧运行时仍保留 agent.session）
  function sessionOf(agent) {
    try {
      if (agent === undefined || agent === null) return undefined
      if (agent.session !== undefined && agent.session !== null) return agent.session
      if (sessions !== undefined && agent.id !== undefined && typeof agent.id === 'string') {
        return sessions.get(agent.id)
      }
    } catch (err) { }
    return undefined
  }

  function sessionWorkspace(agent) {
    try {
      const session = sessionOf(agent)
      if (sandboxPolicy !== undefined && session !== undefined) {
        const policy = sandboxPolicy.resolve({ session })
        // v1.2.0：resolve() 返回的字段是 workspaceRoot（不是 root）；
        // 旧代码恒为 undefined，只能靠下面的 session.header.cwd 兜底。
        if (typeof policy?.workspaceRoot === 'string' && policy.workspaceRoot !== '') return policy.workspaceRoot
      }
      if (session !== undefined && session.header !== undefined && typeof session.header.cwd === 'string') {
        return session.header.cwd
      }
    } catch (err) { }
    return state.workspace
  }

  // v1.1.1（dsh 0.1.1-rc.2 适配）：permissionPresets.current 签名由 (events) 变为 (session)
  function currentPreset(agent) {
    try {
      if (permissionPresets !== undefined) {
        const session = sessionOf(agent)
        if (session !== undefined) return permissionPresets.current(session) || ''
      }
    } catch (err) { }
    return ''
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:223-291](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L223-L291)

审批队列、超时和记忆。

<details>
<summary>查看原文（69行）</summary>

````text
  function createApproval(rec) {
    return new Promise((resolve) => {
      let settled = false
      const settle = (d) => {
        if (settled) return
        settled = true
        rec.decision = d
        rec.decidedAt = Date.now()
        rec.expiresAt = Date.now() + 10000
        clearTimeout(rec.timeoutTimer)
        clearTimeout(rec.fallbackTimer)
        if (rec.abortHandler !== undefined) { try { rec.signal.removeEventListener('abort', rec.abortHandler) } catch (err) { } }
        pending.delete(rec.approvalId)
        decidedCache.set(rec.approvalId, rec)
        resolve(d)
      }
      rec.settle = settle
      pending.set(rec.approvalId, rec)
      rec.timeoutTimer = setTimeout(() => {
        audit('TIMEOUT ' + rec.approvalId + ' auto-denied after 10min')
        settle('timeout-denied')
      }, 600000)
      rec.abortHandler = () => { settle('aborted') }
      try { rec.signal.addEventListener('abort', rec.abortHandler, { once: true }) } catch (err) { }
      // A9：仅当面板最近 30s 内未轮询（面板关闭/浏览器不可达）才降级文本审批卡
      rec.fallbackTimer = setTimeout(async () => {
        if (settled) return
        if (lastPollAt !== 0 && Date.now() - lastPollAt < 30000) return
        audit('FALLBACK ' + rec.approvalId + ' no client panel; falling back to text card')
        try {
          const answer = await userQuestions.ask({
            agent: rec.agent,
            signal: rec.signal,
            questions: [{
              id: 'afaccess-approve',
              header: '🛡️ Almost Full Access · 命令审批',
              question: '审查认为该命令可能影响系统，是否允许执行？',
              detail: ['命令：', '```', rec.command.slice(0, 3000), '```', '', '审查发现的具体影响：', rec.impacts.map((x, i) => (i + 1) + '. ' + x).join('\n'), '', '工作区目录：' + (rec.workspaceRoot || '（未知）')].join('\n'),
              options: [
                { label: '拒绝执行', description: '阻止该命令运行。' },
                { label: '允许执行', description: '放行该命令，由你承担影响。' }
              ]
            }]
          })
          const chosen = answer.answers.find((item) => item.id === 'afaccess-approve')
          settle(chosen !== undefined && chosen.selected.includes('允许执行') ? 'approved' : 'denied')
        } catch (err) {
          settle('denied')
        }
      }, 20000)
    })
  }

  function requestApproval(rec) {
    // A5：随机 approvalId，避免顺序 ID 可枚举
    rec.approvalId = 'afacc-apr-' + randomUUID().replace(/-/g, '').slice(0, 12)
    // A6：记忆键 = 命令哈希（同命令免重复审批）；高风险（引导类）不可记忆
    if (rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
      const mem = remembered.get(rec.commandHash)
      if (mem !== undefined) {
        rec.decision = mem
        rec.auto = true
        state.counters.autoDecided += 1
        audit('AUTO ' + rec.approvalId + ' key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + mem)
        return Promise.resolve(mem)
      }
    }
    audit('APPROVAL ' + rec.approvalId + ' source=' + rec.source + ' severity=' + rec.severity + ' category=' + rec.category + ' cmd=' + rec.command.slice(0, 120).replace(/\n/g, ' '))
    return createApproval(rec)
````

</details>

**依据 3 · 源码核查**：[lib/index.js:294-340](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L294-L340)

子代理无工具审查。

<details>
<summary>查看原文（47行）</summary>

````text
  async function runReview(command, toolName, workdir, parent, signal, workspace, analysis) {
    const lines = [REVIEW_PROMPT.replace('{workspace}', workspace || '（未知）')]
    if (analysis !== undefined && Array.isArray(analysis.impacts) && analysis.impacts.length > 0) {
      lines.push('确定性预分析已发现以下风险（请逐条核对，并在 impacts 中补充更具体的描述，不得遗漏）：')
      analysis.impacts.forEach((x, i) => lines.push((i + 1) + '. ' + x))
      lines.push('')
    } else if (analysis !== undefined && analysis.ambiguous === true) {
      lines.push('该命令包含动态执行/网络下载/外部程序调用/拼接构造等间接行为，确定性分析无法判定，请重点审查其真实效果。')
      lines.push('')
    }
    lines.push('即将执行的命令（工具：' + toolName + '）：')
    lines.push('```')
    // A4：代码围栏转义，防止命令内含 ``` 逃逸围栏注入伪系统指令
    lines.push(String(command).replace(/```/g, "'''"))
    lines.push('```')
    if (workdir) lines.push('工作目录：' + workdir)
    lines.push('')
    lines.push('输出要求：你的最终结论必须通过 structured_output 工具以 JSON 返回：')
    lines.push('- verdict："safe" 表示不存在上述三类风险；"risky" 表示存在至少一类风险')
    lines.push('- impacts：字符串数组，逐条用中文说明可能造成的具体影响；verdict 为 "safe" 时为空数组')
    const prompt = [{ type: 'text', text: lines.join('\n') }]
    const run = await subagents.start(providerName(), {
      label: 'almost-full-access-review',
      prompt,
      parent,
      signal,
      outputSchema: REVIEW_SCHEMA,
      toolFilter: { allow: [] }
    })
    reviewChildren.add(run.id)
    if (run.localAgent !== undefined) reviewChildren.add(run.localAgent.id)
    try {
      const result = await run.result
      if (result.stopReason !== 'completed' || result.structured === undefined) {
        return { verdict: 'risky', impacts: ['审查子代理未能正常完成（' + result.stopReason + '），无法确认命令安全性，需人工审批。'], source: 'degraded' }
      }
      const value = result.structured
      return {
        verdict: value.verdict === 'safe' ? 'safe' : 'risky',
        impacts: Array.isArray(value.impacts) ? value.impacts.map(String) : [],
        source: 'llm'
      }
    } finally {
      reviewChildren.delete(run.id)
      if (run.localAgent !== undefined) reviewChildren.delete(run.localAgent.id)
      await run.dispose().catch(() => { })
    }
````

</details>

**依据 4 · 源码核查**：[lib/index.js:453-549](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L453-L549)

门控条件、判定和 next/deny。

<details>
<summary>查看原文（97行）</summary>

```text
  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
    if (command.trim() === '') return next()
    const workdir = (args !== null && typeof args === 'object' && typeof args.workdir === 'string')
      ? args.workdir : ''
    const workspace = sessionWorkspace(agent)
    if (workspace !== '' && workspace !== state.workspace) state.workspace = workspace
    audit('GATE ' + exec.name + ' preset=' + preset + ' cmd=' + command.slice(0, 200).replace(/\n/g, ' '))

    const analysis = analyzeCommand(command, workspace, workdir)
    audit('ANALYZE ambiguous=' + String(analysis.ambiguous) + ' impacts=' + JSON.stringify(analysis.impacts))

    // A4：确定性命中优先且锁定为必审批——LLM 只能裁决「仅模糊」的命令，不能把
    // 确定性风险改判为 safe 免审批（防止命令文本注入审查员改口）。
    let review
    if (analysis.impacts.length > 0) {
      state.counters.detRisky += 1
      review = { verdict: 'risky', impacts: analysis.impacts, source: 'deterministic' }
    } else if (analysis.ambiguous) {
      state.counters.llmReviewed += 1
      // v1.1.1：同命令 LLM 审查结果 5 分钟内复用（Safe 模式去繁琐；命令文本不变则结论不变）
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
      }
    } else {
      state.counters.detSafe += 1
      review = { verdict: 'safe', impacts: [], source: 'deterministic' }
    }
    // A7：abort 一律拒绝，不进入下游执行链
    if (exec.signal.aborted) return abortDeny()
    if (review.verdict === 'safe') return next()

    const source = review.source === 'llm' ? 'llm' : review.source === 'degraded' ? 'degraded' : 'deterministic'
    const ruleIds = source === 'deterministic' ? (analysis.ruleIds || []) : []
    const severity = source === 'degraded' ? 'low' : ruleIds.some((id) => HIGH_RULE_PREFIXES.some((pre) => id.indexOf(pre) === 0)) ? 'high' : 'medium'
    const category = ruleIds.length > 0 ? ruleIds[0] : source === 'llm' ? 'llm-risky' : 'degraded'
    const record = {
      toolName: exec.name,
      command: command.length > 8000 ? command.slice(0, 8000) : command,
      truncated: command.length > 8000,
      commandHash: hashCommand(command),
      workdir,
      workspaceRoot: workspace,
      preset,
      source,
      severity,
      ruleIds,
      impacts: Array.isArray(review.impacts) && review.impacts.length > 0 ? review.impacts : ['（审查未给出具体影响描述）'],
      category,
      rememberable: severity !== 'high' && (category || '').indexOf('boot:') !== 0,
      ts: new Date().toISOString(),
      decision: null,
      auto: false,
      signal: exec.signal,
      agent
    }
    const decision = await requestApproval(record)
    state.counters.pending = pending.size
    if (decision === 'approved') {
      state.counters.approved += 1
      audit('DECISION ' + record.approvalId + ' approved' + (record.auto ? ' (remembered)' : ''))
      return next()
    }
    state.counters.denied += 1
    audit('DECISION ' + record.approvalId + ' ' + decision + (record.auto ? ' (remembered)' : ''))
    const impactText = (record.impacts || []).map((line, i) => (i + 1) + '. ' + line).join('\n')
    return { kind: 'deny', reason: 'Almost Full Access：用户拒绝执行该命令。' + impactText.slice(0, 400) }
```

</details>

#### 缺口

- 宿主 tools/pre-execute 的错误处理、session 可用性和并发行为未测
  **影响**：无法量化真实 fail-open 路径触发率
  **进一步探讨**：注入 session/preset 查找失败、取消信号和各工具参数形态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 同命令记忆是否精确绑定，审批端点是否独立确认操作者？

**研究主题**：缺陷与关键质疑

#### 完整回答

hashCommand 是 32 位 DJB2 风格字符串哈希，remembered 和 LLM verdict cache 都仅按该短哈希查找，未二次核对完整命令；若攻击者构造不同命令同哈希且两个命令都落入可记忆/模糊分支，已批准命令的决定可被碰撞命令复用。风险不需假设随机 UUID 被猜中，而是缓存键的碰撞边界；本轮未构造可利用命令实证。GET /api/afaccess/queue 无本插件身份检查，暴露待审批原命令与 approvalId；POST decide 只查可伪造的自定义头以及可缺省的 Origin/Referer（存在时仅判 hostname 是否 localhost，未核与实际请求源同源），不绑定用户会话或审批者。真实外部可达性取决于宿主 webServer 的认证和端口绑定，不能仅凭代码断言公网可利用。

#### 证据与依据

**依据 1 · 源码核查**：[lib/analyze.js:325-329](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/analyze.js#L325-L329)

32 位命令哈希实现。

```text
export function hashCommand(cmd) {
  let h = 5381
  for (let i = 0; i < cmd.length; i++) h = ((h << 5) + h + cmd.charCodeAt(i)) | 0
  return 'h' + (h >>> 0).toString(16)
}
```

**依据 2 · 源码核查**：[lib/index.js:276-291](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L276-L291)

记忆仅按 commandHash 查找。

<details>
<summary>查看原文（16行）</summary>

```text
  function requestApproval(rec) {
    // A5：随机 approvalId，避免顺序 ID 可枚举
    rec.approvalId = 'afacc-apr-' + randomUUID().replace(/-/g, '').slice(0, 12)
    // A6：记忆键 = 命令哈希（同命令免重复审批）；高风险（引导类）不可记忆
    if (rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
      const mem = remembered.get(rec.commandHash)
      if (mem !== undefined) {
        rec.decision = mem
        rec.auto = true
        state.counters.autoDecided += 1
        audit('AUTO ' + rec.approvalId + ' key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + mem)
        return Promise.resolve(mem)
      }
    }
    audit('APPROVAL ' + rec.approvalId + ' source=' + rec.source + ' severity=' + rec.severity + ' category=' + rec.category + ' cmd=' + rec.command.slice(0, 120).replace(/\n/g, ' '))
    return createApproval(rec)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:483-505](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L483-L505)

LLM 结论也按 hash 缓存。

<details>
<summary>查看原文（23行）</summary>

```text
    } else if (analysis.ambiguous) {
      state.counters.llmReviewed += 1
      // v1.1.1：同命令 LLM 审查结果 5 分钟内复用（Safe 模式去繁琐；命令文本不变则结论不变）
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:350-399](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L350-L399)

queue/decide 路由及请求头/Origin 校验。

<details>
<summary>查看原文（50行）</summary>

```text
  // ============ HTTP 端点（浏览器审批面板数据通道） ============
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/queue',
    handler: (req, res) => {
      lastPollAt = Date.now()
      const now = Date.now()
      const items = []
      for (const rec of pending.values()) items.push(recordToWire(rec))
      for (const rec of decidedCache.values()) {
        if (rec.expiresAt > now) items.push(recordToWire(rec))
        else decidedCache.delete(rec.approvalId)
      }
      json(res, 200, { ok: true, items })
    }
  }), 'afaccess: queue route')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/decide',
    handler: async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { ok: false, reason: 'method' })
      // A5：CSRF 防护——要求同源面板携带的自定义请求头；若有 Origin/Referer 则必须是回环地址
      if (req.headers['x-afaccess-client'] !== '1') return json(res, 403, { ok: false, reason: 'origin' })
      const origin = req.headers['origin'] || req.headers['referer'] || ''
      if (origin !== '') {
        try {
          const hostname = new URL(origin).hostname
          if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) return json(res, 403, { ok: false, reason: 'origin' })
        } catch (err) {
          return json(res, 403, { ok: false, reason: 'origin' })
        }
      }
      const args = await readBody(req)
      if (args === null || typeof args !== 'object') return json(res, 400, { ok: false, reason: 'body' })
      const id = typeof args.approvalId === 'string' ? args.approvalId : ''
      const rec = pending.get(id)
      if (rec === undefined) return json(res, 200, { ok: false, reason: 'unknown' })
      if (rec.decision !== null) return json(res, 200, { ok: false, reason: 'already-decided' })
      const decision = args.decision === 'approved' ? 'approved' : 'denied'
      // A5/A6：记忆写入强制绑定服务端 rec.commandHash（忽略客户端提供的任意键）；
      // 高风险（引导类/高严重度）命令一律不可记忆
      if (args.remember === true && rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
        remembered.set(rec.commandHash, decision)
        audit('REMEMBER key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + decision)
      }
      rec.settle(decision)
      json(res, 200, { ok: true })
    }
  }), 'afaccess: decide route')
```

</details>

#### 缺口

- 碰撞命令构造、宿主路由认证与远程绑定尚未验证
  **影响**：无法证明可达攻击链和损害概率
  **进一步探讨**：隔离夹具生成不同同哈希命令并验证复用；测 Host 路由身份/绑定策略

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装覆盖、日常审查与失败恢复的成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需要 DSH profile 可写、Node>=16、tools/subagents/userQuestions/permissionPresets/sandboxPolicy/webServer/sessions 服务与客户端面板；安装器把包复制到 profiles/node_modules，并替换或追加顶层 permission 块和插件 insert 块。这是对 profile 权限预设的整体覆盖，可能与其它自定义 permission 预设冲突，需事先审查差异并备份。持续成本是模糊命令的子代理调用/等待、危险命令逐次审批、日志与会话记忆；模型调用现金成本、误判率和时间未测。失败恢复包括恢复原预设、撤销误放行操作、审计失败时另找宿主记录；权限层失效可能已越过恢复点。作者测试和自述版本兼容不是本轮独立验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-63](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/package.json#L1-L63)

包和环境声明。

<details>
<summary>查看原文（63行）</summary>

```text
{
  "name": "dsh-almost-full-access",
  "version": "1.2.0",
  "description": "dsh-Almost Full Access - 介于 workspace-write 与 Full access 之间的权限模式：每条命令先经确定性规则 + 子代理审查，危险命令弹出风格A简约审批面板（允许/拒绝/记住本次会话），支持会话记忆自动放行与审计日志。静态插件包，支持桌面版（Electron）与 Web 版 profile，重启后自动加载。",
  "private": false,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Alnita-M/dsh-Almost_Full_Access.git"
  },
  "homepage": "https://github.com/Alnita-M/dsh-Almost_Full_Access#readme",
  "bugs": "https://github.com/Alnita-M/dsh-Almost_Full_Access/issues",
  "keywords": [
    "deepseek",
    "deepseek-harness",
    "dsh",
    "permission",
    "approval",
    "security",
    "almost-full-access",
    "命令审批"
  ],
  "bin": {
    "dsh-afaccess-install": "scripts/install.mjs"
  },
  "files": [
    "lib/",
    "cordis.patch.yml",
    "scripts/install.mjs",
    "scripts/patch-lib.mjs",
    "assets/afaccess-logo.svg",
    "docs/",
    "CHANGELOG.md",
    "README.md",
    "LICENSE",
    "SECURITY.md"
  ],
  "engines": {
    "node": ">=16"
  },
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-primitives"
      ]
    }
  },
  "scripts": {
    "check": "node --check lib/index.js && node --check lib/analyze.js && node --check lib/client.js && node --check scripts/install.mjs && node --check scripts/patch-lib.mjs && node --check scripts/test.mjs",
    "test": "node scripts/test.mjs"
  },
  "license": "MIT"
```

</details>

**依据 2 · 源码核查**：[scripts/install.mjs:172-211](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/install.mjs#L172-L211)

复制文件并写 profile patch。

<details>
<summary>查看原文（40行）</summary>

```text
// v1.0.3：未安装 DSH 时给出明确警告，避免"安装成功但无效"
if (!existsSync(join(dshHome, "profiles"))) {
	console.warn("⚠️  未检测到 DSH 配置目录：" + join(dshHome, "profiles"));
	console.warn("   请确认这台电脑已安装 DeepSeek Harness 且 DSH_HOME 指向正确；");
	console.warn("   否则本插件虽然会复制到 " + dshHome + "，但 dsh 不会加载它。");
} else if (enable && profiles.length === 0) {
	console.warn("⚠️  未检测到客户端 profile（desktop / web），因此没有写入任何 cordis.patch.yml。");
	console.warn("   已存在的 profile：" + (existingProfiles(dshHome).join(", ") || "（无）"));
	console.warn("   用 --profile <name> 或 --all-profiles 指定要启用插件的 profile。");
}

await mkdir(target, { recursive: true });
for (const entry of ["lib", "cordis.patch.yml", "package.json", "README.md", "LICENSE", "SECURITY.md", "assets"]) {
	await cp(join(sourceRoot, entry), join(target, entry), { recursive: true, force: true });
}
await mkdir(join(target, "scripts"), { recursive: true });
await cp(fileURLToPath(import.meta.url), join(target, "scripts", "install.mjs"), { force: true });
// v1.0.3：patch-lib 必须随包复制，否则全局安装后 install.mjs 的 import 会失败
await cp(join(sourceRoot, "scripts", "patch-lib.mjs"), join(target, "scripts", "patch-lib.mjs"), { force: true });

if (enable) {
	for (const name of profiles) {
		const patchPath = patchPathOf(name);
		const existed = existsSync(patchPath);
		if (!existed && !existsSync(join(dshHome, "profiles", name))) {
			console.warn(`⚠️  profile "${name}" 不存在，跳过：` + patchPath);
			continue;
		}
		await mkdir(dirname(patchPath), { recursive: true });
		const current = await readOptional(patchPath) ?? "";
		let next = replacePermissionBlock(current).text;
		next = ensurePermissionBlock(next); // 无顶层 permission 块的干净 patch：追加预设（否则模式缺失）
		next = ensureInsertBlock(next);
		if (next !== current) await writeFile(patchPath, next, "utf8");
		console.log(`Patched ${name}: ${patchPath}`);
	}
}

await verify(enable);
console.log("Installation complete.");
```

</details>

**依据 3 · 源码核查**：[scripts/patch-lib.mjs:79-148](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/patch-lib.mjs#L79-L148)

替换整个 permission 预设块。

<details>
<summary>查看原文（70行）</summary>

```text
/**
 * 替换/追加 permission 预设块（config 为整体替换，必须完整覆盖 dsh-base 的预设表）。
 * 若已有顶层 `- id: permission`（缩进 0）条目，则从该行替换到下一个顶层条目之前。
 * 找不到顶层块时返回 { replaced:false }（由调用方 ensurePermissionBlock 兜底追加）。
 *
 * 幂等性（v1.2.0 修复）：替换范围要**连同该条目自己的注释行**一起吃掉，
 * 否则每重跑一次安装器就会多累积一行注释；同时替换区间的右边界要回退到
 * 下一个顶层条目的注释之前，否则那条注释会被误删。文件头部注释块永不吞噬。
 */
export function replacePermissionBlock(text) {
	const txt = stripBom(text);
	const lines = txt.split(/\r?\n/);
	const meaningful = meaningfulPatchLines(txt);
	const start = meaningful.find(({ indent, content }) => indent === 0 && (content === "- id: permission" || /^-?\s*id:\s*permission\s*$/.test(content)));
	if (start === void 0) return { text: withoutEmptySequenceRoot(txt), replaced: false };
	// 左边界：连同该条目自己的注释行一起替换（但不吃文件头部注释块，也不吃第 0 行）。
	// 只吞噬**本插件自有标记**的注释行（可跨其间的空行），这样历史版本累积的
	// 重复注释会在下次安装时收敛为一行，且绝不会误伤文件头或其它插件的注释。
	let headEnd = start.index;
	let cursor = headEnd - 1;
	let from = headEnd;
	let sawOwnComment = false;
	while (cursor >= 0) {
		const line = lines[cursor];
		if (/^[ \t]*#/.test(line)) {
			if (!line.includes(OWN_COMMENT_MARK)) break;
			sawOwnComment = true;
			from = cursor;
			cursor -= 1;
			continue;
		}
		if (sawOwnComment && /^[ \t]*$/.test(line)) {
			from = cursor;
			cursor -= 1;
			continue;
		}
		break;
	}
	if (sawOwnComment && from > 0) headEnd = from;
	// 右边界：下一个顶层条目（缩进 0 且以 "- " 开头，且不是该块自身的延续）
	let end = lines.length;
	for (let i = start.index + 1; i < lines.length; i++) {
		const line = lines[i];
		if (/^[ \t]*$/.test(line) || /^\s*#/.test(line)) continue;
		const indent = line.match(/^[ \t]*/)[0].length;
		if (indent === 0 && line.trim().startsWith("- ")) {
			end = i;
			break;
		}
	}
	// 右边界回退：保留下一个顶层条目自己的注释行
	while (end - 1 > start.index && /^[ \t]*#/.test(lines[end - 1])) end -= 1;
	const head = lines.slice(0, headEnd).join("\n").trimEnd();
	const tail = lines.slice(end).join("\n").trimStart();
	let out = head;
	if (head !== "") out += "\n\n";
	out += PERMISSION_BLOCK.trimEnd();
	if (tail !== "") out += "\n\n" + tail;
	return { text: out, replaced: true };
}

/** 确保顶层 permission 预设块存在（无则追加到末尾）——全新电脑空 patch 的关键兜底。 */
export function ensurePermissionBlock(text) {
	const txt = stripBom(text);
	const meaningful = meaningfulPatchLines(txt);
	const hasTop = meaningful.some(({ indent, content }) => indent === 0 && (content === "- id: permission" || /^-?\s*id:\s*permission\s*$/.test(content)));
	if (hasTop) return txt;
	const base = withoutEmptySequenceRoot(txt).trimEnd();
	return base === "" ? PERMISSION_BLOCK.trimEnd() : `${base}\n\n${PERMISSION_BLOCK.trimEnd()}`;
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:154-159](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L154-L159)

审计 best-effort。

```text
  // A8/A10：异步追加 + 脱敏
  function audit(line) {
    try {
      appendFile(join(auditDir, 'afaccess.log'), '[' + new Date().toISOString() + '] ' + redact(line) + '\n', 'utf8').catch(() => { })
    } catch (err) { /* audit is best-effort */ }
  }
```

**依据 5 · 作者声明**：[README.md:60-89](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/README.md#L60-L89)

安装与作者兼容说明。

<details>
<summary>查看原文（30行）</summary>

```text
> 安装器会把插件复制到 `~/.dsh/profiles/node_modules/dsh-almost-full-access/`，
> 并幂等更新**客户端 profile** 的 `cordis.patch.yml`（权限预设表 + 插件挂载）：
> 默认写入已存在的 `desktop`（桌面版 Electron）与 `web`，可用
> `--profile <name>` / `--all-profiles` 精确指定。
> **全新电脑**（`cordis.patch.yml` 为空或不存在）也会自动写入完整的预设块与挂载块；
> 若未检测到 DSH 配置目录会打印警告（请先安装 DeepSeek Harness 再装本插件）。
> 其他安装器选项：`--check` / `--dry-run` / `--no-enable` / `--help`。
>
> 要求 **Node.js ≥ 16**（安装器与插件使用 ESM / top-level await）。

### 安装后

1. **硬刷新浏览器**（Ctrl+Shift+R）；`profiles/*/cordis.patch.yml` 由 `dsh-hmr` 监听并**热重载**，
   通常**无需重启 dsh**（若未生效再重启）；
2. 在会话权限选择器中切换到 **🛡️ Almost Full Access**；
3. 输入命令即可体验：安全命令毫秒放行，危险命令弹出审批面板。

卸载：删除 `~/.dsh/profiles/node_modules/dsh-almost-full-access/` 并从
`~/.dsh/profiles/<desktop|web>/cordis.patch.yml` 移除对应两块（或重装后 `--no-enable` 对照还原）。

---

## 🖥️ 兼容性

| 项 | 要求 |
|---|---|
| DSH | **桌面版（Electron，`profiles/desktop`）** 或 **Web 版（`profiles/web`）**，静态插件机制 |
| 平台 | Windows（命令审查目标为 PowerShell，`pwsh` 工具） |
| 权限模式 | 仅 `almost-full-access` 模式启用门控，其余模式零开销 |
| 已验证版本 | dsh **0.2.0-rc.2**（桌面版内嵌运行时）与 dsh 0.1.7-rc.1 |
```

</details>

#### 缺口

- 真实子代理费用、误判/恢复时间与宿主版本适配未测
  **影响**：不能量化安全收益或部署成本
  **进一步探讨**：隔离 profile 差异比较与审查延迟/错误统计，并核真实宿主接口

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样让审批绑定、工具覆盖和故障默认值满足安全模式要求？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

代码中确定性命中优先于 LLM、子代理 toolFilter 为空、abort 阻断、随机 approvalId 和文本回退可借鉴；但关键风险是将无沙箱预设交给有限命名工具的应用层门控。未验证方向是底层执行授权由宿主统一强制，未识别工具/参数或 session/preset 解析失败时默认拒绝；审批记忆用强碰撞抗性的完整命令摘要并复核原文/工作目录/会话/工具，decide 绑定真实认证会话和 CSRF token，保留原 permission 块的其他预设。最小验证覆盖新工具、缺参数、服务故障、哈希碰撞、跨会话审批、远程路由与热重载，检查未经显式批准的副作用数为零。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:315-340](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L315-L340)

子代理无工具且错误转 risky。

<details>
<summary>查看原文（26行）</summary>

```text
    const run = await subagents.start(providerName(), {
      label: 'almost-full-access-review',
      prompt,
      parent,
      signal,
      outputSchema: REVIEW_SCHEMA,
      toolFilter: { allow: [] }
    })
    reviewChildren.add(run.id)
    if (run.localAgent !== undefined) reviewChildren.add(run.localAgent.id)
    try {
      const result = await run.result
      if (result.stopReason !== 'completed' || result.structured === undefined) {
        return { verdict: 'risky', impacts: ['审查子代理未能正常完成（' + result.stopReason + '），无法确认命令安全性，需人工审批。'], source: 'degraded' }
      }
      const value = result.structured
      return {
        verdict: value.verdict === 'safe' ? 'safe' : 'risky',
        impacts: Array.isArray(value.impacts) ? value.impacts.map(String) : [],
        source: 'llm'
      }
    } finally {
      reviewChildren.delete(run.id)
      if (run.localAgent !== undefined) reviewChildren.delete(run.localAgent.id)
      await run.dispose().catch(() => { })
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:453-549](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L453-L549)

当前门控缺省直通条件。

<details>
<summary>查看原文（97行）</summary>

```text
  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
    if (command.trim() === '') return next()
    const workdir = (args !== null && typeof args === 'object' && typeof args.workdir === 'string')
      ? args.workdir : ''
    const workspace = sessionWorkspace(agent)
    if (workspace !== '' && workspace !== state.workspace) state.workspace = workspace
    audit('GATE ' + exec.name + ' preset=' + preset + ' cmd=' + command.slice(0, 200).replace(/\n/g, ' '))

    const analysis = analyzeCommand(command, workspace, workdir)
    audit('ANALYZE ambiguous=' + String(analysis.ambiguous) + ' impacts=' + JSON.stringify(analysis.impacts))

    // A4：确定性命中优先且锁定为必审批——LLM 只能裁决「仅模糊」的命令，不能把
    // 确定性风险改判为 safe 免审批（防止命令文本注入审查员改口）。
    let review
    if (analysis.impacts.length > 0) {
      state.counters.detRisky += 1
      review = { verdict: 'risky', impacts: analysis.impacts, source: 'deterministic' }
    } else if (analysis.ambiguous) {
      state.counters.llmReviewed += 1
      // v1.1.1：同命令 LLM 审查结果 5 分钟内复用（Safe 模式去繁琐；命令文本不变则结论不变）
      const cmdHash = hashCommand(command)
      const cached = llmVerdictCache.get(cmdHash)
      if (cached !== undefined && Date.now() - cached.ts < LLM_CACHE_TTL) {
        review = { verdict: cached.verdict, impacts: cached.impacts, source: 'llm' }
        audit('LLM-CACHE hit ' + cmdHash + ' -> ' + cached.verdict)
      } else {
        try {
          review = await runReview(command, exec.name, workdir, agent, exec.signal, workspace, analysis)
        } catch (err) {
          // A7：abort 不再 fail-open
          if (exec.signal.aborted) return abortDeny()
          review = { verdict: 'risky', impacts: ['命令审查子代理启动失败（' + String(err?.message ?? err) + '），无法自动判定安全性，需人工审批。'], source: 'degraded' }
        }
        if (review.source === 'llm') {
          if (llmVerdictCache.size >= LLM_CACHE_MAX) {
            const oldest = llmVerdictCache.keys().next().value
            if (oldest !== undefined) llmVerdictCache.delete(oldest)
          }
          llmVerdictCache.set(cmdHash, { verdict: review.verdict, impacts: review.impacts, ts: Date.now() })
        }
      }
    } else {
      state.counters.detSafe += 1
      review = { verdict: 'safe', impacts: [], source: 'deterministic' }
    }
    // A7：abort 一律拒绝，不进入下游执行链
    if (exec.signal.aborted) return abortDeny()
    if (review.verdict === 'safe') return next()

    const source = review.source === 'llm' ? 'llm' : review.source === 'degraded' ? 'degraded' : 'deterministic'
    const ruleIds = source === 'deterministic' ? (analysis.ruleIds || []) : []
    const severity = source === 'degraded' ? 'low' : ruleIds.some((id) => HIGH_RULE_PREFIXES.some((pre) => id.indexOf(pre) === 0)) ? 'high' : 'medium'
    const category = ruleIds.length > 0 ? ruleIds[0] : source === 'llm' ? 'llm-risky' : 'degraded'
    const record = {
      toolName: exec.name,
      command: command.length > 8000 ? command.slice(0, 8000) : command,
      truncated: command.length > 8000,
      commandHash: hashCommand(command),
      workdir,
      workspaceRoot: workspace,
      preset,
      source,
      severity,
      ruleIds,
      impacts: Array.isArray(review.impacts) && review.impacts.length > 0 ? review.impacts : ['（审查未给出具体影响描述）'],
      category,
      rememberable: severity !== 'high' && (category || '').indexOf('boot:') !== 0,
      ts: new Date().toISOString(),
      decision: null,
      auto: false,
      signal: exec.signal,
      agent
    }
    const decision = await requestApproval(record)
    state.counters.pending = pending.size
    if (decision === 'approved') {
      state.counters.approved += 1
      audit('DECISION ' + record.approvalId + ' approved' + (record.auto ? ' (remembered)' : ''))
      return next()
    }
    state.counters.denied += 1
    audit('DECISION ' + record.approvalId + ' ' + decision + (record.auto ? ' (remembered)' : ''))
    const impactText = (record.impacts || []).map((line, i) => (i + 1) + '. ' + line).join('\n')
    return { kind: 'deny', reason: 'Almost Full Access：用户拒绝执行该命令。' + impactText.slice(0, 400) }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:350-399](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L350-L399)

当前审批路由。

<details>
<summary>查看原文（50行）</summary>

```text
  // ============ HTTP 端点（浏览器审批面板数据通道） ============
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/queue',
    handler: (req, res) => {
      lastPollAt = Date.now()
      const now = Date.now()
      const items = []
      for (const rec of pending.values()) items.push(recordToWire(rec))
      for (const rec of decidedCache.values()) {
        if (rec.expiresAt > now) items.push(recordToWire(rec))
        else decidedCache.delete(rec.approvalId)
      }
      json(res, 200, { ok: true, items })
    }
  }), 'afaccess: queue route')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/decide',
    handler: async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { ok: false, reason: 'method' })
      // A5：CSRF 防护——要求同源面板携带的自定义请求头；若有 Origin/Referer 则必须是回环地址
      if (req.headers['x-afaccess-client'] !== '1') return json(res, 403, { ok: false, reason: 'origin' })
      const origin = req.headers['origin'] || req.headers['referer'] || ''
      if (origin !== '') {
        try {
          const hostname = new URL(origin).hostname
          if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) return json(res, 403, { ok: false, reason: 'origin' })
        } catch (err) {
          return json(res, 403, { ok: false, reason: 'origin' })
        }
      }
      const args = await readBody(req)
      if (args === null || typeof args !== 'object') return json(res, 400, { ok: false, reason: 'body' })
      const id = typeof args.approvalId === 'string' ? args.approvalId : ''
      const rec = pending.get(id)
      if (rec === undefined) return json(res, 200, { ok: false, reason: 'unknown' })
      if (rec.decision !== null) return json(res, 200, { ok: false, reason: 'already-decided' })
      const decision = args.decision === 'approved' ? 'approved' : 'denied'
      // A5/A6：记忆写入强制绑定服务端 rec.commandHash（忽略客户端提供的任意键）；
      // 高风险（引导类/高严重度）命令一律不可记忆
      if (args.remember === true && rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
        remembered.set(rec.commandHash, decision)
        audit('REMEMBER key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + decision)
      }
      rec.settle(decision)
      json(res, 200, { ok: true })
    }
  }), 'afaccess: decide route')
```

</details>

**依据 4 · 源码核查**：[scripts/patch-lib.mjs:22-48](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/patch-lib.mjs#L22-L48)

无沙箱预设的底层配置。

<details>
<summary>查看原文（27行）</summary>

```text
export const PERMISSION_BLOCK = `# dsh-Almost Full Access: 权限模式预设（🛡️ Almost Full Access）
- id: permission
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: ask
      workspace-write:
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never

`;

export const INSERT_BLOCK = `# dsh-Almost Full Access: 插件本体挂载
- insert:
    - id: afaccess
      name: dsh-almost-full-access

`;
```

</details>

#### 缺口

- 统一强制授权和会话绑定未实现/测试
  **影响**：不能将设想算作现有安全保证
  **进一步探讨**：原型与真实宿主故障注入对照未授权执行次数和恢复成本

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 此固定版本能否作为用户的默认安全权限档？

**研究主题**：采用判断

#### 完整回答

不推荐作为保护重要机器、敏感文件或多用户环境的默认权限档。底层 danger-full-access/approval never 加有限工具门控、session/preset 故障直通、32 位命令哈希共用批准结果与端点身份依赖宿主，均与“危险命令必须审批”的核心承诺存在未封闭边界。可在隔离虚拟机、无重要数据且禁用真实敏感权限的环境做研究原型，并逐条测试所有执行入口和审批链。当前建议 not_recommended 用于安全权限控制；测试也不等于生产保证。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/patch-lib.mjs:22-40](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/scripts/patch-lib.mjs#L22-L40)

预设无沙箱/内建审批。

<details>
<summary>查看原文（19行）</summary>

```text
export const PERMISSION_BLOCK = `# dsh-Almost Full Access: 权限模式预设（🛡️ Almost Full Access）
- id: permission
  config:
    presets:
      read-only:
        sandbox: read-only
        approval: ask
      workspace-write:
        sandbox: workspace-write
        approval: ask
      almost-full-access:
        sandbox: danger-full-access
        approval: never
        name: 🛡️ Almost Full Access
        description: Full file access with lightweight checks — only irreversible actions (deletes, uninstalls, formatting) and changes that affect normal boot or system/drivers require approval; dynamic/indirect commands are reviewed by a subagent before execution.
      danger-full-access:
        sandbox: danger-full-access
        approval: never

```

</details>

**依据 2 · 源码核查**：[lib/index.js:453-467](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L453-L467)

有限门控且缺信息直通。

<details>
<summary>查看原文（15行）</summary>

```text
  // ============ 门控 ============
  ctx.on('tools/pre-execute', async (exec, next) => {
    if (!GATED_TOOLS.has(exec.name)) return next()
    const agent = exec.agent
    if (agent === undefined || reviewChildren.has(agent.id)) return next()

    const preset = currentPreset(agent)
    if (preset !== '') state.lastPreset = preset
    if (!GATED_PRESETS.has(preset)) return next()

    const args = exec.arguments
    const command = (args !== null && typeof args === 'object' && typeof args.command === 'string')
      ? args.command
      : (typeof args === 'string' ? args : '')
    if (command.trim() === '') return next()
```

</details>

**依据 3 · 源码核查**：[lib/analyze.js:325-329](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/analyze.js#L325-L329)

32 位哈希。

```text
export function hashCommand(cmd) {
  let h = 5381
  for (let i = 0; i < cmd.length; i++) h = ((h << 5) + h + cmd.charCodeAt(i)) | 0
  return 'h' + (h >>> 0).toString(16)
}
```

**依据 4 · 源码核查**：[lib/index.js:350-399](https://github.com/Alnita-M/dsh-Almost_Full_Access/blob/269ab865fd02a4dded171eaecc40b1255f5df227/lib/index.js#L350-L399)

路由独立身份检查边界。

<details>
<summary>查看原文（50行）</summary>

```text
  // ============ HTTP 端点（浏览器审批面板数据通道） ============
  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/queue',
    handler: (req, res) => {
      lastPollAt = Date.now()
      const now = Date.now()
      const items = []
      for (const rec of pending.values()) items.push(recordToWire(rec))
      for (const rec of decidedCache.values()) {
        if (rec.expiresAt > now) items.push(recordToWire(rec))
        else decidedCache.delete(rec.approvalId)
      }
      json(res, 200, { ok: true, items })
    }
  }), 'afaccess: queue route')

  ctx.effect(() => webServer.register({
    kind: 'exact',
    path: '/api/afaccess/decide',
    handler: async (req, res) => {
      if (req.method !== 'POST') return json(res, 405, { ok: false, reason: 'method' })
      // A5：CSRF 防护——要求同源面板携带的自定义请求头；若有 Origin/Referer 则必须是回环地址
      if (req.headers['x-afaccess-client'] !== '1') return json(res, 403, { ok: false, reason: 'origin' })
      const origin = req.headers['origin'] || req.headers['referer'] || ''
      if (origin !== '') {
        try {
          const hostname = new URL(origin).hostname
          if (!['127.0.0.1', 'localhost', '::1'].includes(hostname)) return json(res, 403, { ok: false, reason: 'origin' })
        } catch (err) {
          return json(res, 403, { ok: false, reason: 'origin' })
        }
      }
      const args = await readBody(req)
      if (args === null || typeof args !== 'object') return json(res, 400, { ok: false, reason: 'body' })
      const id = typeof args.approvalId === 'string' ? args.approvalId : ''
      const rec = pending.get(id)
      if (rec === undefined) return json(res, 200, { ok: false, reason: 'unknown' })
      if (rec.decision !== null) return json(res, 200, { ok: false, reason: 'already-decided' })
      const decision = args.decision === 'approved' ? 'approved' : 'denied'
      // A5/A6：记忆写入强制绑定服务端 rec.commandHash（忽略客户端提供的任意键）；
      // 高风险（引导类/高严重度）命令一律不可记忆
      if (args.remember === true && rec.severity !== 'high' && (rec.category || '').indexOf('boot:') !== 0) {
        remembered.set(rec.commandHash, decision)
        audit('REMEMBER key=' + rec.commandHash + ' category=' + rec.category + ' -> ' + decision)
      }
      rec.settle(decision)
      json(res, 200, { ok: true })
    }
  }), 'afaccess: decide route')
```

</details>

#### 缺口

- 真实宿主额外保护和可利用攻击链未完整核查
  **影响**：不宜宣称已实测绕过，但也不能以此推荐为安全控制
  **进一步探讨**：先修复强制边界，再做独立红队/故障注入与宿主验收

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
