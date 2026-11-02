# Skills-Link

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[26487ae](https://github.com/shanliuling/skills-link/tree/26487aee4948e9e11000422c8278f81dcb245f20)

<!-- BEGIN META -->
[![GitHub ★ 197](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=197&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/shanliuling/skills-link) [![npm 30d 78](https://img.shields.io/static/v1?label=npm+30d&message=78&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link) [![最新发布 2026-04-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-04-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/skills-link)
<!-- END META -->

> **功能**：以共享目录、符号链接或 Junction 在多个 AI App 间组织本地 Skill，并提供可选 Git 同步与规则同步入口。

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02) 把多App路径发现、导入与跨平台链接组织起来，少维护多份Skill字节。成熟ln/Git不归原创，目录同步不证明Skill在各Agent正确生效。

> **主要限制**：[Q02](#research-q02) 创建失败不自动还原，reset可删除master并覆盖多backup，rollback实际hard reset；[Q03](#research-q03)普通start可pull/add/commit/push，共享writer与远端变更影响所有App。必须先外部备份/关Git试，不把同步当安全分发。

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
  - [Q01 · 共享master相对手动复制/链接给谁增加什么？](#detail-section-11)
  - [Q02 · 导入/链接/备份与失败恢复是否事务安全？](#detail-section-12)
  - [Q03 · Git副作用和共享信任成本允许什么小试？](#detail-section-13)
  - [Q04 · 一个master是否等所有宿主能力一致，新方向如何证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多AI App个人用户集中可信Skill；基线手工复制/ln/Git。合格结果需各App确见预期版本且原目录可恢复，不是路径数量。

symlink/Junction与Git成熟；根增量为检测/导入/配置/健康及同步流程，非宿主语义兼容保证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| master共享链接 | 多App同一Skill字节 | 非宿主语义兼容/写入隔离 |
| 导入与备份 | 组织原Skill | 覆盖/创建失败非事务还原 |
| 可选Git同步 | 跨设备版本传递 | 可add全目录并push，先审范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node18+与目录权限 | CLI需 | 扫描/复制/链接 | 权限失败可能已挪备份 |
| symlink或Windows PowerShell Junction | 链接需 | 共享master | 平台实际未验 |
| 可信Skill与每host测试 | 采用前提 | 防兼容/权限扩散 | 同字节不等同语义 |
| Git/认证/远端 | 可选同步 | pull/commit/push | 先关闭，非只读检查 |
| 独立外部备份 | 迁移前需 | 恢复原目录 | 不盲用reset/hard rollback |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 复制master和两个测试App路径、关Git | 不碰唯一原配置 |
| 导入 | 核同名选择与内容 | 覆盖先删，失败查partial |
| 链接 | 检查实际target及每App加载 | 创建失败人工恢复备份 |
| 更新 | 一处修改后各host核行为 | 不以health代语义验证 |
| 退出 | 断link、手选备份恢复并留master | 不盲reset/rollback，回独立目录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node/master/备份空间 | 路径/同名/原数据备份 | 金额工时未知 |
| 持续 | 可选Git存储/网络 | 全writer审核和多host兼容 | 未测净维护收益 |
| 失败恢复 | 多backup/partial复制 | 手选版本和查Git分叉 | 自动恢复不足 |
| 退出 | 留master与备份 | 逐App独立目录核验 | CLI卸载不等还原 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 字节共享 | symlink/Junction同master | 各host加载/任务正确 |
| 导入维护 | 同名/备份和向导 | 创建失败自动还原 |
| 远端同步 | add/commit/push实际路径 | 秘密排除/并发冲突正确 |
| 退出 | 可手工用备份 | reset无损恢复不成立 |

> **思考**：[Q02](#research-q02) 创建失败不自动还原，reset可删除master并覆盖多backup，rollback实际hard reset；[Q03](#research-q03)普通start可pull/add/commit/push，共享writer与远端变更影响所有App。必须先外部备份/关Git试，不把同步当安全分发。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)与[Q02](#research-q02) 把多App路径发现、导入与跨平台链接组织起来，少维护多份Skill字节。成熟ln/Git不归原创，目录同步不证明Skill在各Agent正确生效。

[Q02](#research-q02)平台链接封装可用作组合，但备份与恢复非事务、字符串health有限；[Q03](#research-q03)pull失败继续和add全目录使外部副作用需明确知情。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 创建失败不自动还原，reset可删除master并覆盖多backup，rollback实际hard reset；[Q03](#research-q03)普通start可pull/add/commit/push，共享writer与远端变更影响所有App。必须先外部备份/关Git试，不把同步当安全分发。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)复制路径关Git试少量可信Skill，先验失败恢复，再考虑真实App和显式远端。无可靠恢复就回独立目录，不用reset作常规卸载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持共享链接与可选Git机制；无本轮平台/宿主执行。备份不等自动回滚，reset/hard rollback和自动push须独立控制，兼容提示假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、bin/skills-link.js、package.json、src/commands/link.ts、src/commands/reset.ts、src/commands/rollback.ts、src/commands/start.ts、src/commands/sync.ts、src/core/git.ts、src/core/scanner.ts、src/core/symlink.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根CLI source定向bin/start、copySkill、symlink/health、sync/Git/rollback/reset。未全审rules-link、add远端下载/扫描全部路径、watch与每App运行；无目标执行。
- 下一步：[Q04](#research-q04)复制路径做断链/权限/同名/多backup与三类Skill变更，逐host验加载；本轮未运行安装/链接/Git。

**分析版本**

- **仓库**：[shanliuling/skills-link](https://github.com/shanliuling/skills-link)
- **版本号**：1.3.0（[固定提交 26487ae](https://github.com/shanliuling/skills-link/tree/26487aee4948e9e11000422c8278f81dcb245f20)）
- **版本日期**：2026-05-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)逐host Skill版本/工具条件和改后待复核提示可能减少静默回归；三类变更比较漏错/误阻断/审核成本，不改善即否定，尚未实现不计贡献。

[Q04](#research-q04)复制路径做断链/权限/同名/多backup与三类Skill变更，逐host验加载；本轮未运行安装/链接/Git。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 660 | — | — | 1898 |
| .js | source | 2 | 154 | 129 | 1 | — |
| .ts | source | 26 | 5317 | 3811 | 817 | — |
| .ts | test | 3 | 208 | 155 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/shanliuling/skills-link/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核跨App共享Skill的导入/链接/Git与恢复副作用，限定复制目录无远端小试。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 共享master相对手动复制/链接给谁增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Skills-Link是Node CLI工具，根类型tool，供在多个本机AI编码App间维护同一批Skill的人使用。基线是手工复制目录或ln，合格结果是被选App看到预期版本且原目录可恢复，不是检测到41个路径就证明41个宿主兼容。README称每App skills目录成为同一master的链接；实际增量是检测/导入/配置向导、跨平台symlink/Junction与Git同步组织，ln和Git本身不是新算法。

同一文件即时可见也意味着任何写入者可改全体App的能力，不能解释成每宿主独立隔离。host是否遵守Skill、哪些工具可用和规则是否同语义并未由共享目录保证。bin入口默认runStart，sync/health/reset等另命令；rules-link是相关入口，本研究聚焦Skill路径和恢复，不把rules所有功能算已核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-12](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/README.md#L8-L12)

作者多App共享定位。

```text
**One skills folder, every AI app.**

Sync your local `skills` across 41+ AI coding agents with a single command.

Also supports rules sync: `rules-link`
```

**依据 2 · 作者声明**：[README.md:24-39](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/README.md#L24-L39)

共享目录/链接模型。

<details>
<summary>查看原文（16行）</summary>

````text
## How it works

```
  Claude Code ──┐
  Cursor ───────┤
  Windsurf ─────┤
  Cline ────────┼──▶  ~/AISkills/  ◀──▶  GitHub
  Gemini CLI ───┤        ▲
  Trae ─────────┤        │
  Roo Code ─────┘   Master Directory
                    (single source of truth)
```

Every app's `~/.xxx/skills` becomes a symlink pointing to one master directory. Add or edit a skill once — every app sees it instantly.

---
````

</details>

**依据 3 · 源码核查**：[bin/skills-link.js:68-105](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/bin/skills-link.js#L68-L105)

真实默认start与sync/health/reset等路由。

<details>
<summary>查看原文（38行）</summary>

```text
  .action(runApp)

program
  .command('sync')
  .description(t('cli.commands.sync'))
  .option('-m, --message <message>', t('cli.options.message'))
  .action((options) => runSync(options))

program
  .command('watch')
  .description(t('cli.commands.watch'))
  .action(runWatch)

program
  .command('health')
  .description(t('cli.commands.health'))
  .action(runHealth)

program
  .command('reset')
  .description(t('cli.commands.reset'))
  .option('-d, --dry-run', t('cli.options.dryRun'))
  .action((options) => runReset(options))

program
  .command('setup')
  .description(t('cli.commands.setup'))
  .action(() => runStart(true))

program
  .command('add')
  .description(t('cli.commands.add'))
  .argument('<repo>', 'GitHub repo (user/repo or URL)')
  .option('-s, --skill <name>', 'Specific skill to install')
  .action((repo, options) => runAdd([repo], options))

if (process.argv.length === 2) {
  runStart()
```

</details>

**依据 4 · 源码核查**：[package.json:1-8](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/package.json#L1-L8)

包版本与CLI入口。

```text
{
  "name": "skills-link",
  "version": "1.3.0",
  "type": "module",
  "description": "CLI tool for syncing local skills folders across multiple AI apps",
  "bin": {
    "skills-link": "bin/skills-link.js"
  },
```

#### 缺口

- 各App真实发现、Skill语义与同任务维护收益未验证。
  **影响**：不能据支持列表数量承诺兼容或节时。
  **进一步探讨**：只在复制配置/测试App路径做少量可信Skill，核版本发现和原目录恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导入/链接/备份与失败恢复是否事务安全？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

copySkill按文件夹basename作为目标名；同名默认skip，overwrite会先递归删除旧目标再拷贝，拷失败返回error并无整套回滚，不能称无损合并。createSymlink已有普通目录先rename为.backup/backupN，旧symlink先unlink，然后创建Junction或绝对symlink；创建失败不自动恢复原目录，失败对象还可能没有backup字段，因此需人工核磁盘而非只看最后提示。

checkLinkStatus用existsSync/lstat判断，再读link target作path.normalize字符串比较，不是完整realpath等价；断链existsSync为false会被当未链接，不能单靠health判数据完好。主流程每App独立继续，局部失败不回滚先成功链接。

恢复命令也不是无损撤销：rollback用户确认后调用git.reset --hard指定commit，虽然命令结束打印newCommitCreated，实际不创建新提交，会丢弃tracked未提交变更。reset先删链接、遍历所有.backup*依次删现original再rename备份，最后可删master和配置；多个备份可能覆盖先恢复版本，失败逐项打印而不停止后续。退出不应盲跑reset，先独立备份并人工选择要恢复的版本。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/scanner.ts:189-225](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/scanner.ts#L189-L225)

同名跳过/覆盖先删除及复制失败。

<details>
<summary>查看原文（37行）</summary>

```text
export function copySkill(skillPath: string, targetDir: string, overwrite: boolean = false): CopyResult {
  const skillName = path.basename(skillPath)
  const destPath = path.join(targetDir, skillName)

  // 检查目标是否已存在
  if (fs.existsSync(destPath)) {
    if (!overwrite) {
      return {
        success: false,
        skipped: true,
        message: `已存在同名 skill: ${skillName}`,
      }
    }
    // 覆盖：先删除
    try {
      fs.rmSync(destPath, { recursive: true, force: true })
    } catch (error) {
      return {
        success: false,
        message: `删除现有目录失败: ${(error as Error).message}`,
      }
    }
  }

  // 复制目录
  try {
    fs.mkdirSync(targetDir, { recursive: true })
    copyDirRecursive(skillPath, destPath)
    return {
      success: true,
      message: `已复制: ${skillName}`,
    }
  } catch (error) {
    return {
      success: false,
      message: `复制失败: ${(error as Error).message}`,
    }
```

</details>

**依据 2 · 源码核查**：[src/core/symlink.ts:120-158](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L120-L158)

exists/lstat和规范化字符串状态。

<details>
<summary>查看原文（39行）</summary>

```text
    }
  }

  // skills 路径不存在（应用已安装，但 skills 目录不存在，可以创建）
  if (!fs.existsSync(skillsPath)) {
    return {
      status: LinkStatus.NOT_LINKED,
      message: '未创建链接，可运行 link 命令创建',
    }
  }

  // 检查是否是符号链接
  if (!isSymlink(skillsPath)) {
    return {
      status: LinkStatus.NOT_LINKED,
      message: '路径存在但不是符号链接',
    }
  }

  // 检查符号链接目标是否正确
  const target = getSymlinkTarget(skillsPath)
  const normalizedTarget = target ? path.normalize(target) : null
  const normalizedMaster = path.normalize(masterDir)

  if (normalizedTarget !== normalizedMaster) {
    return {
      status: LinkStatus.WRONG_TARGET,
      message: `是符号链接但指向错误目录: ${target}`,
    }
  }

  return {
    status: LinkStatus.OK,
    message: '正常',
  }
}

/**
 * 安全执行 PowerShell 命令（参数化）
```

</details>

**依据 3 · 源码核查**：[src/core/symlink.ts:194-237](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L194-L237)

备份/删旧link再创建，catch无恢复。

<details>
<summary>查看原文（44行）</summary>

```text
  }

  // 确保目标目录存在
  if (!fs.existsSync(target)) {
    return {
      success: false,
      message: `目标目录不存在: ${target}`,
    }
  }

  try {
    // 先检查链接路径是否存在
    let backupPath: string | null = null
    if (fs.existsSync(linkPath)) {
      const stats = fs.lstatSync(linkPath)
      if (stats.isSymbolicLink()) {
        // 已是符号链接，删除
        fs.unlinkSync(linkPath)
      } else {
        // 普通目录，备份
        backupPath = `${linkPath}.backup`
        let counter = 1
        while (fs.existsSync(backupPath)) {
          backupPath = `${linkPath}.backup${counter}`
          counter++
        }
        fs.renameSync(linkPath, backupPath)
      }
    }

    // 根据平台创建符号链接
    if (isWindows) {
      // Windows: 使用 PowerShell 创建 Junction（无需管理员权限）
      return createWindowsJunction(target, linkPath, backupPath)
    } else {
      // macOS/Linux: 使用 Node.js 原生 symlink
      return createUnixSymlink(target, linkPath, backupPath)
    }
  } catch (error) {
    return {
      success: false,
      message: `创建符号链接失败: ${(error as Error).message}`,
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/core/symlink.ts:241-266](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L241-L266)

Junction失败结果与备份字段差异。

<details>
<summary>查看原文（26行）</summary>

```text
 * 创建 Windows Junction（无需管理员权限）
 */
function createWindowsJunction(target: string, linkPath: string, backupPath: string | null): LinkResult {
  try {
    const script = `New-Item -ItemType Junction -Path ${escapePowerShellString(linkPath)} -Target ${escapePowerShellString(target)}`
    const result = runPowerShell(script)

    if (!result.success) {
      return {
        success: false,
        message: `创建 Junction 失败: ${result.stderr || '未知错误'}`,
      }
    }

    return {
      success: true,
      message: 'Junction 创建成功',
      backup: backupPath || undefined,
    }
  } catch (error) {
    return {
      success: false,
      message: `创建 Junction 失败: ${(error as Error).message}`,
    }
  }
}
```

</details>

**依据 5 · 源码核查**：[src/core/symlink.ts:272-324](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L272-L324)

Unix权限检查/创建和失败。

<details>
<summary>查看原文（53行）</summary>

```text
  try {
    // 检查父目录是否可写
    const parentDir = path.dirname(linkPath)
    try {
      fs.accessSync(parentDir, fs.constants.W_OK)
    } catch (error) {
      return {
        success: false,
        message: `父目录无写入权限: ${parentDir}`,
        hint: '请检查目录权限或确认应用已正确安装',
      }
    }

    // 使用绝对路径创建符号链接，确保跨平台兼容
    const absoluteTarget = path.resolve(target)
    fs.symlinkSync(absoluteTarget, linkPath, 'dir')

    return {
      success: true,
      message: '符号链接创建成功',
      backup: backupPath || undefined,
    }
  } catch (error) {
    // 详细的错误处理
    let errorMessage = (error as Error).message
    let hint = ''

    const errorCode = (error as NodeJS.ErrnoException).code
    if (errorCode === 'EPERM') {
      errorMessage = '权限不足: 无法创建符号链接'
      hint = '用户目录下不应出现此问题，请检查文件系统权限'
    } else if (errorCode === 'EACCES') {
      errorMessage = '访问被拒绝: 权限不足'
      hint = '请检查是否有写入权限'
    } else if (errorCode === 'EEXIST') {
      errorMessage = '路径已存在且无法删除'
      hint = '请手动删除现有路径后重试'
    }

    return {
      success: false,
      message: errorMessage,
      hint,
      error: (error as Error).message,
    }
  }
}

/**
 * 创建 Junction 链接（别名，向后兼容）
 */
export const createJunction = createSymlink

```

</details>

**依据 6 · 源码核查**：[src/commands/link.ts:55-94](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/link.ts#L55-L94)

逐App部分成功/失败计数不回滚。

<details>
<summary>查看原文（40行）</summary>

```text
  for (const app of apps) {
    const { name, skillsPath } = app

    if (dryRun) {
      const result = createJunction(config.masterDir, skillsPath, true)
      logger.log(`  ${logger.dim('○')} ${name.padEnd(12)} → ${skillsPath}`)
      continue
    }

    const parentDir = path.dirname(skillsPath)
    if (!fs.existsSync(parentDir)) {
      logger.error(`${name.padEnd(12)} ${t('link.parentDirNotExist', { name: '', path: parentDir })}`)
      logger.hint(t('link.appNotInstalledHint'))
      failCount++
      continue
    }

    const result = createJunction(config.masterDir, skillsPath, false)

    if (result.success) {
      logger.success(t('link.linkSuccess', { name: name.padEnd(12), path: skillsPath }))
      if (result.backup) {
        logger.log(`    ${logger.dim(t('link.backupInfo', { path: result.backup }))}`)
      }
      successCount++
    } else {
      logger.error(t('link.linkFailed', { name: name.padEnd(12), error: result.message }))
      failCount++
    }
  }

  logger.newline()
  if (dryRun) {
    logger.hint(t('link.dryRunHint'))
  } else {
    if (successCount > 0) {
      logger.success(t('link.linksCreated', { count: successCount }))
    }
    if (failCount > 0) {
      logger.warn(t('link.linksFailed', { count: failCount }))
```

</details>

**依据 7 · 源码核查**：[src/commands/rollback.ts:99-129](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/rollback.ts#L99-L129)

用户确认后rollback及newCommitCreated提示。

<details>
<summary>查看原文（31行）</summary>

```text
    },
  ])

  // 确认回滚
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: t('rollback.confirmRollback', { hash: selectedCommit.hash }),
      default: false,
    },
  ])

  if (!confirm) {
    logger.info(t('common.cancelled'))
    return
  }

  // 执行回滚
  logger.newline()
  logger.info(t('rollback.rollingBack'))

  const result = await rollbackToCommit(
    config.masterDir,
    selectedCommit.hash,
  )

  if (result.success) {
    logger.success(t('rollback.rollbackSuccess', { message: selectedCommit.hash }))
    logger.success(t('rollback.newCommitCreated'))
  } else {
```

</details>

**依据 8 · 源码核查**：[src/core/git.ts:218-233](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/git.ts#L218-L233)

真实git reset --hard而非新commit。

<details>
<summary>查看原文（16行）</summary>

```text
  commitHash: string,
): Promise<GitResult> {
  try {
    const git = createGit(repoPath)
    await git.reset(['--hard', commitHash])
    return { success: true, message: `已回滚到 ${commitHash}` }
  } catch (error) {
    return { success: false, message: `回滚失败: ${(error as Error).message}` }
  }
}

/**
 * 同步操作（commit + push）
 */
export async function sync(
  repoPath: string,
```

</details>

**依据 9 · 源码核查**：[src/commands/reset.ts:236-278](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/reset.ts#L236-L278)

reset逐备份覆盖并可删master/配置。

<details>
<summary>查看原文（43行）</summary>

```text
function executeReset(changes: DetectedChanges) {
  // 1. 删除符号链接
  for (const link of changes.symlinks) {
    const result = removeSymlink(link.path)
    if (result.success) {
      logger.success(`${t('reset.deleteSymlink')}: ${link.app}`)
    } else {
      logger.error(`${t('reset.deleteFailed')}: ${link.app} - ${result.message}`)
    }
  }

  // 2. 恢复备份
  for (const backup of changes.backups) {
    try {
      // 如果原位置已存在，先删除
      if (fs.existsSync(backup.originalPath)) {
        fs.rmSync(backup.originalPath, { recursive: true, force: true })
      }
      // 重命名备份
      fs.renameSync(backup.backupPath, backup.originalPath)
      logger.success(`${t('reset.restoreBackup')}: ${backup.app}`)
    } catch (error) {
      logger.error(`${t('reset.restoreFailed')}: ${backup.app} - ${(error as Error).message}`)
    }
  }

  // 3. 删除 Master 目录
  if (changes.masterDir) {
    try {
      fs.rmSync(changes.masterDir.path, { recursive: true, force: true })
      logger.success(`${t('reset.deleteMasterDir')} (${changes.masterDir.skillCount} ${t('reset.skillCount')})`)
    } catch (error) {
      logger.error(`${t('reset.deleteFailed')}: ${(error as Error).message}`)
    }
  }

  // 4. 删除配置文件
  if (changes.configFile) {
    try {
      fs.rmSync(changes.configFile)
      logger.success(t('reset.deleteConfig'))
    } catch (error) {
      logger.error(`${t('reset.deleteFailed')}: ${(error as Error).message}`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Git副作用和共享信任成本允许什么小试？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需Node18+、文件系统目录权限，Git远端同步另需Git/认证/网络，Windows用PowerShell Junction，macOS/Linux原生symlink。共享内容应全是用户信任且不含秘密的Skill，远端git并非只下载数据：新增/改写Skill会影响所有已连App后续行为，可能形成供应链扩散，工具未核Skill安全与宿主兼容。

已配置Git的普通runStart不是只读状态检查：showStatus先pull，失败不阻后续自动导入/autoSync；autoSync commitChanges会git.add全目录并commit，autoPush=true还push，无实际变更hash则直接不push，旧未推提交不会由该分支自动补推。sync同样pull失败继续，必须读结果不能以界面成功泛化“全部远端一致”。master含config或无关文件时也可能被add，公开前单独审范围和秘密。

建议先复制master与两个测试App路径、关闭git.enabled/autoPush，小量可信Skill验证链接、编辑可见与备份恢复；不碰唯一原配置、不执行reset或hard rollback作常规退出。首次要选路径并解决同名/历史备份，持续审核所有writer和远端变更，失败需人工恢复并辨Git/链接分叉；现金含存储/网络/可选私有托管，工时金额未知。退出断开链接、恢复明确选中的备份并保留master，再逐App核独立目录，CLI卸载不等还原。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-28](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/package.json#L25-L28)

Node18+。

```text
  },
  "engines": {
    "node": ">=18.0.0"
  },
```

**依据 2 · 源码核查**：[src/core/symlink.ts:241-295](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L241-L295)

平台与权限依赖。

<details>
<summary>查看原文（55行）</summary>

```text
 * 创建 Windows Junction（无需管理员权限）
 */
function createWindowsJunction(target: string, linkPath: string, backupPath: string | null): LinkResult {
  try {
    const script = `New-Item -ItemType Junction -Path ${escapePowerShellString(linkPath)} -Target ${escapePowerShellString(target)}`
    const result = runPowerShell(script)

    if (!result.success) {
      return {
        success: false,
        message: `创建 Junction 失败: ${result.stderr || '未知错误'}`,
      }
    }

    return {
      success: true,
      message: 'Junction 创建成功',
      backup: backupPath || undefined,
    }
  } catch (error) {
    return {
      success: false,
      message: `创建 Junction 失败: ${(error as Error).message}`,
    }
  }
}

/**
 * 创建 macOS/Linux 符号链接（用户目录下无需 sudo）
 */
function createUnixSymlink(target: string, linkPath: string, backupPath: string | null): LinkResult {
  try {
    // 检查父目录是否可写
    const parentDir = path.dirname(linkPath)
    try {
      fs.accessSync(parentDir, fs.constants.W_OK)
    } catch (error) {
      return {
        success: false,
        message: `父目录无写入权限: ${parentDir}`,
        hint: '请检查目录权限或确认应用已正确安装',
      }
    }

    // 使用绝对路径创建符号链接，确保跨平台兼容
    const absoluteTarget = path.resolve(target)
    fs.symlinkSync(absoluteTarget, linkPath, 'dir')

    return {
      success: true,
      message: '符号链接创建成功',
      backup: backupPath || undefined,
    }
  } catch (error) {
    // 详细的错误处理
```

</details>

**依据 3 · 源码核查**：[src/commands/start.ts:425-445](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/start.ts#L425-L445)

普通start自动pull失败继续并sync。

<details>
<summary>查看原文（21行）</summary>

```text
async function showStatus(config: GlobalConfig) {
  // 先从远程拉取变更
  if (config.git?.enabled && config.git?.remote) {
    logger.info(t('start.pullingFromRemote'))
    const pullResult = await pullFromRemote(config.masterDir)
    if (pullResult.success) {
      logger.success(t('start.pullSuccess'))
    }
    // pull 失败不阻塞，继续后续流程
  }

  logger.info(t('start.detectingNew'))
  await autoImportNewSkills(config)

  // Sync to remote whenever git is configured, not only when new skills are imported.
  // This ensures uncommitted changes (e.g., skills added locally but not yet pushed)
  // are always pushed on every run.
  if (config.git?.enabled && config.git?.remote) {
    logger.newline()
    logger.info(t('start.syncingToGithub'))
    await autoSync(config)
```

</details>

**依据 4 · 源码核查**：[src/commands/start.ts:538-560](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/start.ts#L538-L560)

autoPush参数和同步提示。

<details>
<summary>查看原文（23行）</summary>

```text
async function autoSync(config: GlobalConfig) {
  try {
    const timestamp = new Date()
      .toISOString()
      .replace('T', ' ')
      .substring(0, 19)
    const result = await autoGitSync(
      config.masterDir,
      !!config.git?.autoPush,
      `sync: ${timestamp}`,
    )

    if (!result.success) {
      logger.error(t('start.syncFailed', { error: result.message }))
      return
    }

    // 没有变更需要提交，静默跳过
    if (!result.hash) {
      return
    }

    logger.success(t('start.syncedToGithub'))
```

</details>

**依据 5 · 源码核查**：[src/commands/sync.ts:31-64](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/sync.ts#L31-L64)

手动sync拉取失败仍继续。

<details>
<summary>查看原文（34行）</summary>

```text
  logger.title(t('sync.title'))

  // 先 pull 远程变更，避免覆盖
  logger.info(t('sync.pulling'))
  const pullResult = await pullFromRemote(config.masterDir)
  if (pullResult.success) {
    logger.success(t('sync.pullSuccess'))
  }
  // pull 失败不阻塞，继续同步

  const result = await autoGitSync(
    config.masterDir,
    !!config.git.autoPush,
    message,
  )

  if (!result.success) {
    logger.error(result.message)
    return
  }

  if (!result.hash) {
    logger.info(t('sync.noChanges'))
    return
  }

  logger.success(t('sync.commitSuccess', { hash: result.hash }))

  if (config.git.autoPush) {
    logger.success(t('sync.pushSuccess', { message: result.message }))
  } else {
    logger.hint(t('sync.autoPushDisabled'))
  }
}
```

</details>

**依据 6 · 源码核查**：[src/core/git.ts:108-124](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/git.ts#L108-L124)

add全目录并commit。

<details>
<summary>查看原文（17行）</summary>

```text
export async function commitChanges(
  repoPath: string,
  message: string,
): Promise<GitResult> {
  try {
    const git = createGit(repoPath)
    await git.add('.')
    const result = await git.commit(message)
    // simple-git 没有变更时 commit 返回空
    if (!result.commit) {
      return { success: true, message: 'nothing to commit' }
    }
    return {
      success: true,
      message: 'committed',
      hash: result.commit,
    }
```

</details>

**依据 7 · 源码核查**：[src/core/git.ts:259-295](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/git.ts#L259-L295)

只新commit有hash才push。

<details>
<summary>查看原文（37行）</summary>

```text
  autoPush: boolean,
  message?: string,
): Promise<GitResult> {
  try {
    const commitResult = await commitChanges(repoPath, message || 'Auto sync')
    if (!commitResult.success) {
      return commitResult
    }

    // 没有实际变更（commitChanges 返回 success 但无 hash）
    if (!commitResult.hash) {
      return { success: true, message: 'nothing to commit' }
    }

    if (!autoPush) {
      return commitResult
    }

    const hasRemoteConfig = await hasRemote(repoPath)
    if (!hasRemoteConfig) {
      return { ...commitResult, message: 'committed, but no remote configured' }
    }

    const pushResult = await pushToRemote(repoPath)
    return {
      ...pushResult,
      hash: commitResult.hash,
    }
  } catch (error) {
    return { success: false, message: `sync failed: ${(error as Error).message}` }
  }
}

/**
 * 检查是否有远端
 */
export async function hasRemote(repoPath: string): Promise<boolean> {
```

</details>

**依据 8 · 源码核查**：[src/commands/reset.ts:248-268](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/reset.ts#L248-L268)

恢复和删master风险。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const backup of changes.backups) {
    try {
      // 如果原位置已存在，先删除
      if (fs.existsSync(backup.originalPath)) {
        fs.rmSync(backup.originalPath, { recursive: true, force: true })
      }
      // 重命名备份
      fs.renameSync(backup.backupPath, backup.originalPath)
      logger.success(`${t('reset.restoreBackup')}: ${backup.app}`)
    } catch (error) {
      logger.error(`${t('reset.restoreFailed')}: ${backup.app} - ${(error as Error).message}`)
    }
  }

  // 3. 删除 Master 目录
  if (changes.masterDir) {
    try {
      fs.rmSync(changes.masterDir.path, { recursive: true, force: true })
      logger.success(`${t('reset.deleteMasterDir')} (${changes.masterDir.skillCount} ${t('reset.skillCount')})`)
    } catch (error) {
      logger.error(`${t('reset.deleteFailed')}: ${(error as Error).message}`)
```

</details>

#### 缺口

- 当前平台Junction/断链/权限和每App读取行为未执行。
  **影响**：不能据源码支持完整迁移或自动恢复。
  **进一步探讨**：复制路径核链接成功/创建失败/断链/同名/多backup，保留外部备份后才扩大。
- 远端权限、秘密排除与持续供应链审核未验证。
  **影响**：不建议默认autoPush或接未知Skill仓库。
  **进一步探讨**：启用前审master内容/ignore/远端private与变更审批，先显式手动Git。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一个master是否等所有宿主能力一致，新方向如何证伪？

**研究主题**：新假设与验证

#### 完整回答

共享字节不等共享语义，Skill可能引用特定工具、路径或预置，原本只给一个App的规则在其他App可能失效。目录状态OK也不能检验Agent是否加载、是否误触发或执行权限扩大。本轮没有运行目标或各宿主，数量/即时同步与真实任务正确性分开。

从Q02链接仅测目标、Q03共享writer扩散推导未实现假设：在应用映射旁保存已验证Skill版本和所需工具/host条件，并在master改变后标待复核，可能比全App透明同版本更少静默兼容回归。相对当前目录链接增量是逐host的兼容证据/人工确认，不是分叉复制全部文件。最小实验同一Skill含host专用/通用/危险依赖三类变更，对比仅health与版本条件提示，计漏兼容、误阻断、审核时间；漏错不降或审核成本超过手动复制则否定。未实现不计当前创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/symlink.ts:120-158](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/core/symlink.ts#L120-L158)

当前health只核路径/目标。

<details>
<summary>查看原文（39行）</summary>

```text
    }
  }

  // skills 路径不存在（应用已安装，但 skills 目录不存在，可以创建）
  if (!fs.existsSync(skillsPath)) {
    return {
      status: LinkStatus.NOT_LINKED,
      message: '未创建链接，可运行 link 命令创建',
    }
  }

  // 检查是否是符号链接
  if (!isSymlink(skillsPath)) {
    return {
      status: LinkStatus.NOT_LINKED,
      message: '路径存在但不是符号链接',
    }
  }

  // 检查符号链接目标是否正确
  const target = getSymlinkTarget(skillsPath)
  const normalizedTarget = target ? path.normalize(target) : null
  const normalizedMaster = path.normalize(masterDir)

  if (normalizedTarget !== normalizedMaster) {
    return {
      status: LinkStatus.WRONG_TARGET,
      message: `是符号链接但指向错误目录: ${target}`,
    }
  }

  return {
    status: LinkStatus.OK,
    message: '正常',
  }
}

/**
 * 安全执行 PowerShell 命令（参数化）
```

</details>

**依据 2 · 作者声明**：[README.md:95-114](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/README.md#L95-L114)

作者多App支持列表不是语义测试。

<details>
<summary>查看原文（20行）</summary>

````text
| OpenCode | OpenHands | Pi | Pochi |
| Qoder | Qwen Code | Replit | Roo Code |
| Trae | Trae CN | Windsurf | Zencoder |

Plus a `universal` fallback for any agent not listed. [Add new agents with one line of code.](src/core/path-detect.ts)

---

## Cross-device sync

```bash
# Machine A — push skills to GitHub
skills-link sync

# Machine B — clone and link
skills-link  # automatically pulls from remote
```

---

````

</details>

**依据 3 · 源码核查**：[src/commands/start.ts:425-445](https://github.com/shanliuling/skills-link/blob/26487aee4948e9e11000422c8278f81dcb245f20/src/commands/start.ts#L425-L445)

自动远端更新是复核失效提示起点。

<details>
<summary>查看原文（21行）</summary>

```text
async function showStatus(config: GlobalConfig) {
  // 先从远程拉取变更
  if (config.git?.enabled && config.git?.remote) {
    logger.info(t('start.pullingFromRemote'))
    const pullResult = await pullFromRemote(config.masterDir)
    if (pullResult.success) {
      logger.success(t('start.pullSuccess'))
    }
    // pull 失败不阻塞，继续后续流程
  }

  logger.info(t('start.detectingNew'))
  await autoImportNewSkills(config)

  // Sync to remote whenever git is configured, not only when new skills are imported.
  // This ensures uncommitted changes (e.g., skills added locally but not yet pushed)
  // are always pushed on every run.
  if (config.git?.enabled && config.git?.remote) {
    logger.newline()
    logger.info(t('start.syncingToGithub'))
    await autoSync(config)
```

</details>

#### 缺口

- 逐host版本条件提示能否减少静默回归未试验。
  **影响**：仅未来方向。
  **进一步探讨**：三类变更对照漏错/误报/总投入，无改善则放弃。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
