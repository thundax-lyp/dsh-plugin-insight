# dsh-purge Community

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[84c7f61](https://github.com/kingcharleslzy-ai/dsh-purge/tree/84c7f61a42944cda4dac70c95d6f1233318996e4)

<!-- BEGIN META -->
[![GitHub ★ 3,840](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C840&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingcharleslzy-ai/dsh-purge)
<!-- END META -->

> **功能**：集中管理 DSH 提示注入、宿主补丁、自检与备份回滚。

> **亮点**：将状态、配置与多宿主变更组织到统一入口；减少确认不证明模型任务质量提升。[Q01](#research-q01)

> **主要限制**：补丁会改写文件写限制和默认沙箱语义；profile 快照失败仍继续且应用结果可能部分成功。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 社区插件集中提供什么，适合谁？](#detail-section-11)
  - [Q02 · 补丁如何改变权限边界？](#detail-section-12)
  - [Q03 · 快照、应用与回滚是否原子？](#detail-section-13)
  - [Q04 · 分发、解析错误与日常使用有什么成本？](#detail-section-14)
  - [Q05 · 怎样检验更可信的变更状态放行？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有权管理 DSH 宿主、研究提示和控制行为的用户；基线是原生权限配置和手动备份。[Q01](#research-q01)

使用原生权限和审批配置并保留官方宿主副本。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 宿主补丁 | 修改提示与权限行为 | 授权隔离实例，核对差异 |
| 快照恢复 | 保存与恢复变更 | 非跨宿主单事务 |
| 状态 | 报告补丁及审计 | 完成摘要不证明全成功 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 有授权隔离 DSH 实例 | 研究必需 | 宿主修改 | 不应用 |
| 正确 profile 与宿主路径 | 必需 | 定位修改目标 | 停止并核对 |
| 可验证备份 | 变更必需 | 恢复 | 不继续 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对实例并制作备份 | 确认可恢复 |
| 检查 | 查看补丁与权限差异 | 不接受变化则停止 |
| 验证 | 查看逐项状态与回滚 | 失败不视为完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 隔离实例与磁盘 | 阅读权限变更 | 不同安装路径保障不同 |
| 持续 | 备份与维护 | 对照锚点和状态 | 不能证明任务质量 |
| 恢复 | 保存备份资源 | 检查宿主和 profile | 非单一事务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 集中管理 | 可查看及应用补丁 | 实际收益 |
| 备份 | host 备份失败会中止该宿主写入 | 全局原子恢复 |

> **思考**：补丁会改写文件写限制和默认沙箱语义；profile 快照失败仍继续且应用结果可能部分成功。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将状态、配置与多宿主变更组织到统一入口；减少确认不证明模型任务质量提升。[Q01](#research-q01)

每宿主先备份，profile 快照失败仅警告；逐项状态及审计存在，但工具完成摘要不列失败。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

补丁会改写文件写限制和默认沙箱语义；profile 快照失败仍继续且应用结果可能部分成功。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只在授权隔离实例核对补丁、完整状态和回滚；依赖原生控制的日常环境保留原配置。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持权限改写、宿主备份和逐项报告；未执行目标，清单有两条解析错误。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/core.js、lib/index.js、scripts/export-engagement-report.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 364 个指定扩展名文件、排除 1；scripts/export-engagement-report.mjs 有两条解析错误（非首位 shebang），未执行目标。
- 下一步：在可丢弃实例验证宿主备份失败、profile 快照失败、锚点漂移、逐项报告和恢复。

**分析版本**

- **仓库**：[kingcharleslzy-ai/dsh-purge](https://github.com/kingcharleslzy-ai/dsh-purge)
- **版本号**：1.6.67（[固定提交 84c7f61](https://github.com/kingcharleslzy-ai/dsh-purge/tree/84c7f61a42944cda4dac70c95d6f1233318996e4)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：统一显示备份、逐目标差异及重启回读的状态凭据，可减少误认全成功；须对照现有审计测误报和恢复。[Q05](#research-q05)

在可丢弃实例验证宿主备份失败、profile 快照失败、锚点漂移、逐项报告和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 112 | 9539 | — | — | 161771 |
| .js | source | 126 | 82234 | 75436 | 4968 | — |
| .mjs | source | 41 | 3438 | 3154 | 221 | — |
| .mjs | test | 76 | 8273 | 7745 | 331 | — |
| .cjs | test | 9 | 1981 | 1965 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 60](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=60&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/kingcharleslzy-ai/dsh-purge/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：社区插件如何修改 DSH 控制边界，快照、写入和回滚有何限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 社区插件集中提供什么，适合谁？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

此社区版将 DSH 提示词、规则、宿主补丁、状态自检及备份回滚集中，面向有权管理自己宿主并理解控制变化的研究者。原生权限设置及手动保留官方宿主副本是基线；集中操作减少多文件维护，但减少确认不能证明任务质量或安全改善。作者称一次设置减少打断，实际代码明确包含审批与沙箱改写，应按实际控制变化评估。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:37-48](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/README.md#L37-L48)

作者描述目标与便利。

<details>
<summary>查看原文（12行）</summary>

```text
## 它是什么

dsh-purge Community 是一个跑在你自己机器上的 Harness 附加组件。它把日常使用里最消耗注意力的几件事收敛到一处：

- **看清楚状态**：安装、补丁、注入到底有没有就绪，一条命令或一屏面板给结论；
- **少一些往返**：把反复出现的确认与打断，收敛成一次设置；
- **随时能回去**：应用、回滚、开关都留记录，操作前自动快照；
- **方便做实验**：提示词、规则、预设集中管理，改坏了能撤。

目标很简单：**让助手更连贯地配合你的学习与动手实验**，而不是每做一步都先停下来问一句。

社区里通常把它叫作「破甲」或「无限制模式」插件——指的是它降低了交互层面的摩擦，让 agent 能连续执行任务；它不改模型本身，也不改变你要做的事。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1741-1747](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/index.js#L1741-L1747)

注册应用工具并明示审批/沙箱绕过。

```text
    ctx.tools.register({
      name: "purge_apply",
      description: `应用 dsh 指令权威性清洗：${core.ALL_PATCHES.length} patch（提示词层+代码默认+引擎级审批/沙箱绕过）+ shim 注入 + override 文件。需重启 dsh 完全生效。`,
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {},
```

**依据 3 · 源码核查**：[package.json:1-7](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/package.json#L1-L7)

社区包身份与入口。

```text
{
  "name": "dsh-purge-community",
  "version": "1.6.67",
  "description": "让 AI 更专注地辅助学习与动手实验：DSH 附加组件，提供状态自检、提示词与规则管理、本机备份与回滚。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
```

#### 缺口

- 未运行目标、宿主或补丁；清单一文件有两条解析错误
  **影响**：无法证明应用、恢复及所列其他功能可用
  **进一步探讨**：只在有授权的隔离实例核验差异、备份与回滚

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 补丁如何改变权限边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

固定源码的代码补丁将 sandbox-local 中 deny file-write 替换成 allow file-write，将默认 workspace-write 改为 danger-full-access（注释指出 UI/环境仍可覆盖）；注册工具也说明引擎级审批和沙箱绕过。实际生效依赖宿主布局、匹配、配置和重启，不能仅凭安装或插件禁用推断修改已生效或撤销。它改变原控制语义，而不只是跳过提示。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:2794-2814](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L2794-L2814)

文件写限制和默认模式替换。

<details>
<summary>查看原文（21行）</summary>

```text
const CODE_PATCHES = [
  {
    id: 6, name: "SANDBOX_DENY_FILE_WRITE", layer: "代码", layer_en: "Code",
    desc: "沙箱 deny file-write / sandbox deny",
    file: "sandbox-local",
    rel: ["lib", "index.js"],
    patterns: ['"(deny file-write*)"'],
    replace: '"(allow file-write*)"',
    marker: "(allow file-write*)",
  },
  {
    // 只改 YAML 默认值，不写 DSH_PERMISSION_MODE，避免锁死设置页。
    id: 7, name: "SANDBOX_MODE_DEFAULT", layer: "代码", layer_en: "Code",
    desc: "沙箱默认 danger-full-access（可被 UI 切换，不写死 env） / soft default only",
    file: "base",
    rel: ["cordis.patch.yml"],
    patterns: [
      "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'workspace-write'",
    ],
    replace: "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'danger-full-access'",
    marker: "mode: !!js process.env.DSH_PERMISSION_MODE ?? 'danger-full-access'",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1741-1747](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/index.js#L1741-L1747)

工具描述审批/沙箱绕过。

```text
    ctx.tools.register({
      name: "purge_apply",
      description: `应用 dsh 指令权威性清洗：${core.ALL_PATCHES.length} patch（提示词层+代码默认+引擎级审批/沙箱绕过）+ shim 注入 + override 文件。需重启 dsh 完全生效。`,
      parameters: {
        type: "object",
        additionalProperties: false,
        properties: {},
```

**依据 3 · 源码核查**：[README.md:54-56](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/README.md#L54-L56)

作者说明预设排除不撤全局宿主补丁。

```text
### 让不同预设保留自己的提示词

1.6.40 新增 `excludePresets`：默认空列表，保持原有行为；可将 `roleplay`、`minimal` 等预设排除在 Purge 提示词注入之外，保留命令、面板与工具。切换预设、并行会话和子 Agent 各自判断，宿主兜底也遵守排除。配置示例、升级步骤与边界见 [按预设排除说明](docs/maintenance-issue-53.md)。这不会撤销全局宿主补丁。
```

#### 缺口

- 未运行目标、宿主或补丁；清单一文件有两条解析错误
  **影响**：无法证明应用、恢复及所列其他功能可用
  **进一步探讨**：只在有授权的隔离实例核验差异、备份与回滚

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 快照、应用与回滚是否原子？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

多宿主应用对每个宿主先执行 host 备份，备份错误会抛错并取消该宿主后续补丁写入；这是重要反证，不能说所有备份失败都继续。另在逐补丁应用内，profile 快照异常只记录并继续；每条 patch 可能出现 missing、notFound、write_error，结果逐项汇总。工具返回“完成”只数 applied/already，不能证明所有项目成功；跨宿主也不是单一全局事务，操作后须读完整状态并核实回滚。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:1925-1944](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L1925-L1944)

每宿主备份失败取消后续该宿主写入。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const raw of enumeratePatchAiBases({ discover: options.forApply === true || options.discover === true })) {
    const aiBase = await resolveAiBaseForApply(raw, options);
    if (!aiBase) continue;
    const key = path.normalize(aiBase).replace(/\\/g, "/").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const backups = await backupAll(aiBase);
    if (backups.errors.length) {
      const readOnlyLinux = process.platform === "linux" && backups.errors.some(([, error]) => /EACCES|EPERM|EROFS/.test(String(error)));
      const remedy = readOnlyLinux
        ? " Linux 宿主目录不可写。请重新运行 Linux 安装脚本创建用户可写副本，退出当前 DSH，再用 ~/.local/bin/dsh web 启动后应用。无需修改 /usr 权限。"
        : " Check permissions and retry.";
      throw new Error(`Host backup failed (${backups.errors.length} files); patch writes cancelled.${remedy}`);
    }
    if (settings.hooksDenyBypass === false) {
      const restored = await restoreHookDenyForBases([aiBase]);
      hookDenyRestoreFailed.push(...restored.failed);
      hookDenyRestoreChanged.push(...restored.changed);
    }
    const report = await applyPatches(aiBase, selected, options);
```

</details>

**依据 2 · 源码核查**：[lib/core.js:7195-7210](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L7195-L7210)

profile 快照失败记录后继续。

<details>
<summary>查看原文（16行）</summary>

```text

export async function applyPatches(aiBase, patches = ALL_PATCHES, options = {}) {
  // 每次整份写入前先做一次 profile 级快照。快照失败不阻断：逐文件 .dshpurge.bak 仍在，
  // 但要在日志里留痕，方便事后确认"这次没有 profile 快照"。
  let snapshot = "skipped";
  try {
    const home = findDshHome();
    if (home) {
      snapshot = (await new Maintenance({ home, aiBase }).backup("before-host-patches"))?.id || "done";
    }
  } catch (e) {
    snapshot = `error:${e && e.message ? e.message : e}`;
    console.warn("[dsh-purge] profile snapshot before apply failed:", snapshot);
  }
  restoreMissingOriginalsFromBak(aiBase);
  refreshStaleBaksForUpgrade(aiBase);
```

</details>

**依据 3 · 源码核查**：[lib/core.js:7280-7306](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L7280-L7306)

逐项写错误及状态。

<details>
<summary>查看原文（27行）</summary>

```text
            else already += 1;
          } catch (e) {
            lastError = `write_error:${e}`;
          }
          continue;
        }
        if (filePatchSettled(text, p, fp)) {
          already += 1;
        } else if (patchHasRemainingWork(text, p, fp) || p.strictFiles) {
          notFound += 1;
        }
      }
    }
    const status = rollupPatchStatus({
      applied, already, missing, notFound, lastError, keyCount: keys.length,
      layoutSoft: isLayoutSoftPatch(p),
      strictFiles: !!p.strictFiles,
    });
    report.push({
      patch_id: p.id,
      name: p.name,
      status,
      path: paths[0] || files[keys[0]],
      applied,
      already,
      missing,
    });
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1764-1774](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/index.js#L1764-L1774)

工具输出统计 applied/already。

<details>
<summary>查看原文（11行）</summary>

```text
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

#### 缺口

- 未运行目标、宿主或补丁；清单一文件有两条解析错误
  **影响**：无法证明应用、恢复及所列其他功能可用
  **进一步探讨**：只在有授权的隔离实例核验差异、备份与回滚

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 分发、解析错误与日常使用有什么成本？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要对应 DSH host、实例/profile、写入权限以及可验证的宿主备份；作者说明社区安装器迁移前备份，但官方 CLI 安装不提供相同的校验与快照。固定 inventory 364 个指定扩展名文件、排除 1，两个解析错误均位于 scripts/export-engagement-report.mjs，文件将 shebang 放在 import 后，故不能声称该报告脚本可用或清单全部解析。未执行任何脚本；日常需要原权限控制的用户应保留原生配置，研究只在隔离副本、验证完整差异和回滚后进行。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:90-97](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/README.md#L90-L97)

官方 CLI 和社区安装器保障不同。

````text

```sh
dsh plugin --profile web add "https://github.com/kingcharleslzy-ai/dsh-purge/releases/download/v1.6.67/dsh-purge-community-1.6.67.tgz"
```

`web` 必须与实际启动的 profile 一致；自定义数据目录需要沿用该实例的 `DSH_HOME`。命令使用本次发行的固定版本 URL；不是 `npm install -g`，也不是安装裸 npm 包名。本项目通过 GitHub 发行，**不要替换成 `add dsh-purge` 或 `add dsh-purge-community`**。官方 CLI 的安装不会额外运行我们安装器的 Release SHA256 比对及迁移快照；需要这些功能时选方式三。[官方 CLI 安装说明](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/user/develop/basic/publish.zh.md)

### 方式三：社区安装器（备份、旧版迁移、恢复）
````

**依据 2 · 源码核查**：[README.md:151-156](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/README.md#L151-L156)

安装器边界、校验和恢复建议。

```text
- 社区安装器在迁移前备份，调用当前实例的官方 `dsh plugin --profile … add …`，再核对安装版本和入口；保留提示词、规则、更新偏好及其他插件设置。
- **不是“完全不碰宿主目录”**：解包桌面布局缺失/损坏 `app/runtime` 链接时，会保留旧链接并修复到该安装的 runtime；冲突则停止。Linux 系统宿主只读时可能创建用户副本，并在成功后切换用户启动器。详见[安装指南](docs/INSTALLATION.md)。
- 插件加载前若市场安装失败（issue #7），插件本身尚未运行；先读脱敏错误、核对依赖来源，不能承诺安装器能修复所有市场或网络错误。
- 不自动应用宿主补丁、不自动重启、不改代理、不修改全局 npm 源或清空缓存。脚本和 bootstrap 从本仓库 `master` 下载；Release 包另做 SHA256 校验，这不是对下载脚本的独立签名验证。
- 命令退出码非零就视为失败。安装成功后记录 `backup_id`，核对磁盘版本；运行中的 DSH 仍可能显示旧版，待用户方便时手动退出重开。`dry-run` 成功、备份存在或市场卡片出现都不能替代安装成功证据。
- 回滚优先用「Purge → 状态 → 本机备份」，选择本次安装前的备份；无界面时按[安装指南中的 CLI 回滚](docs/INSTALLATION.md#cli-rollback)执行。不要假设 `purge-community` 已加入系统 PATH。
```

**依据 3 · 源码核查**：[scripts/export-engagement-report.mjs:1-4](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/scripts/export-engagement-report.mjs#L1-L4)

shebang 出现在 import 之后，与解析诊断一致。

```text
import { removeTreeNoFollowSync } from "../lib/remove-tree.js";
#!/usr/bin/env node
/**
 * 把一个靶标的得分报告导出成可移动的交付包：`<outDir>/<靶标>-红队成果复现报告.md` + `<outDir>/shots/`。
```

#### 缺口

- 未运行目标、宿主或补丁；清单一文件有两条解析错误
  **影响**：无法证明应用、恢复及所列其他功能可用
  **进一步探讨**：只在有授权的隔离实例核验差异、备份与回滚

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验更可信的变更状态放行？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：将 profile/host 备份、每个目标摘要、补丁结果及重启后回读组成明确完成凭据，任何失败呈部分或失败而非只展示完成，可能减少误以为已完全生效或可回滚。现有每宿主备份中止、逐项报告和审计是反证，并非从零建立；状态本身不能证明模型遵守新提示。用可丢弃 host 模拟权限不足、锚点漂移、中途写入失败及旧进程，测漏报、恢复成功、时间与隐私暴露；无改进或误报过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[lib/core.js:1925-1944](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L1925-L1944)

已有 host 备份门槛。

<details>
<summary>查看原文（20行）</summary>

```text
  for (const raw of enumeratePatchAiBases({ discover: options.forApply === true || options.discover === true })) {
    const aiBase = await resolveAiBaseForApply(raw, options);
    if (!aiBase) continue;
    const key = path.normalize(aiBase).replace(/\\/g, "/").toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    const backups = await backupAll(aiBase);
    if (backups.errors.length) {
      const readOnlyLinux = process.platform === "linux" && backups.errors.some(([, error]) => /EACCES|EPERM|EROFS/.test(String(error)));
      const remedy = readOnlyLinux
        ? " Linux 宿主目录不可写。请重新运行 Linux 安装脚本创建用户可写副本，退出当前 DSH，再用 ~/.local/bin/dsh web 启动后应用。无需修改 /usr 权限。"
        : " Check permissions and retry.";
      throw new Error(`Host backup failed (${backups.errors.length} files); patch writes cancelled.${remedy}`);
    }
    if (settings.hooksDenyBypass === false) {
      const restored = await restoreHookDenyForBases([aiBase]);
      hookDenyRestoreFailed.push(...restored.failed);
      hookDenyRestoreChanged.push(...restored.changed);
    }
    const report = await applyPatches(aiBase, selected, options);
```

</details>

**依据 2 · 源码核查**：[lib/core.js:7293-7326](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/core.js#L7293-L7326)

已有逐项报告与审计。

<details>
<summary>查看原文（34行）</summary>

```text
    const status = rollupPatchStatus({
      applied, already, missing, notFound, lastError, keyCount: keys.length,
      layoutSoft: isLayoutSoftPatch(p),
      strictFiles: !!p.strictFiles,
    });
    report.push({
      patch_id: p.id,
      name: p.name,
      status,
      path: paths[0] || files[keys[0]],
      applied,
      already,
      missing,
    });
  }
  {
    const summary = summarizeApplyReport(report);
    logAudit("apply", {
      host: aiBase,
      host_version: (() => {
        try {
          return JSON.parse(fs.readFileSync(path.join(aiBase, "dsh-agent-loop", "package.json"), "utf8")).version;
        } catch {
          return "unknown";
        }
      })(),
      applied: summary.applied,
      already: summary.already,
      failed: summary.failed.length,
      failed_ids: summary.failed.map((r) => r.patch_id),
      snapshot,
    });
  }
  return report;
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1764-1774](https://github.com/kingcharleslzy-ai/dsh-purge/blob/84c7f61a42944cda4dac70c95d6f1233318996e4/lib/index.js#L1764-L1774)

工具摘要未列失败。

<details>
<summary>查看原文（11行）</summary>

```text
        const toolMulti = await core.applyPatchesAllHosts(core.ALL_PATCHES, {
          preserveClientBundles: false,
          forApply: true,
        });
        await core.patchAllShims();
        const flash = core.silenceCmdFlash(toolMulti.hosts[0]?.aiBase || state.ai_base);
        const report = toolMulti.report;
        const applied = report.filter((r) => r.status === "applied").length;
        const already = report.filter((r) => r.status === "already").length;
        const scrubNote = scrubbed.length ? ` desktop_scrub=${scrubbed.length}` : "";
        return { text: `清洗完成 / applied=${applied}, already=${already}.${scrubNote} phase-1=${flash.phase1} 重启 dsh 生效.` };
```

</details>

#### 缺口

- 未运行目标、宿主或补丁；清单一文件有两条解析错误
  **影响**：无法证明应用、恢复及所列其他功能可用
  **进一步探讨**：只在有授权的隔离实例核验差异、备份与回滚

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
