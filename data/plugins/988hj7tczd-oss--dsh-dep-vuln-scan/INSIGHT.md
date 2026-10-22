# dsh-dep-vuln-scan

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[db879fc](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/tree/db879fc01cd02b9f0821a87ba728a310ae08d9ac)

<!-- BEGIN META -->
[![npm 30d 103](https://img.shields.io/static/v1?label=npm+30d&message=103&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan)
<!-- END META -->

> **实现功能**：读取常见项目锁文件，向OSV批量查询依赖版本公告，展示漏洞、修复候选与命令建议，并保存可重放结构化报告。

> **核心亮点**：把多生态锁输入、批量ID/共享详情查询与宿主可重放报告统一，减少手工切换；只读建议，不是新漏洞情报或可利用性验证。详见[Q02](#research-q02)。

> **风险与缺陷**：同生态多锁来源被最后路径覆盖，fixed未按包/区间完整约束且多漏洞仍取最小；扫描cap静默、错误时也可显示0受影响，不能据此clean，未运行真实公告对照。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要扫描，什么是合格结果？](#detail-section-11)
  - [Q02 · 锁文件到OSV报告如何连接？](#detail-section-12)
  - [Q03 · 覆盖、修复版本和来源有哪些限制？](#detail-section-13)
  - [Q04 · 启动与使用依赖什么？](#detail-section-14)
  - [Q05 · 工程、数据外发和取消如何？](#detail-section-15)
  - [Q06 · 成本、采用与未来假设怎么判断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH里维护多语言项目、希望先看到锁定依赖是否匹配已知OSV公告的开发者。输入是目录/单锁文件、生态过滤和fast/full，输出包版本、公告、修复建议与可重放报告。插件只建议命令，不运行安装或改锁文件。

合格结果要明确哪些文件/包被解析、哪些未覆盖、网络和详情失败是否影响结论，公告与包/版本对应，修复版本确实适合当前生态/分支并能处理本包全部相关漏洞。扫描命中不是可利用性验证，零命中也不是代码安全证明，升级命令成功还需要兼容/回归检查。

基线是各生态审计CLI或手工OSV查询。插件把常见锁文件和结构化报告放进一个宿主工具，省去逐生态命令切换；但最佳努力解析、版本简化和覆盖收据不足限制它替代成熟依赖治理流程。本轮不查实时漏洞，也不把录制fixture中的CVE/修复版当当前项目结论。

原生态审计CLI/人工OSV查询，插件统一初筛但不替代锁格式全解析、真实利用性或升级回归。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 锁发现 | 根级或递归多生态 | 深度8/200文件cap静默 |
| 解析 | 精确包/版本清单 | 最佳努力，部分空解析不报错 |
| OSV查询 | querybatch+共享详情 | 依网络，fixture仅测试 |
| 报告重放 | 漏洞/错误/SBOM摘要 | 多锁来源丢失，SBOM非标准全量 |
| 修复建议 | fixed和生态命令字符串 | 多分支/多漏洞约束不足，不执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18与DSH tools/fs/systemPrompt | 包声明/硬注入 | 工具、文件适配和提示词 | 版本/接口需匹配 |
| 固定DSH运行包依赖 | 包声明 | Cordis及0.1.1-rc.2服务 | 普通独立Node不具备宿主 |
| TypeScript构建产物lib | Git源码安装需要 | main/exports/patch入口 | 固定Git未跟踪lib，README要求先build |
| 可读锁文件/正确工作区根 | 扫描必需 | 包版本清单 | 默认fs.resolve('.')不显式传session cwd |
| api.osv.dev网络 | 实时查询必需 | 批量与详情 | 网络错不自动装载测试fixture |
| 公告/生态版本知识 | 升级采用条件 | 核对分支和兼容 | 不直接复制最早fixed命令 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主和项目，列期望锁文件/解析包 | 明确依赖名/版本将发OSV |
| 安装 | 按源码构建lib再挂独立profile | 不把Git缺lib泛化为npm包损坏 |
| 扫描 | 明确path和effort，先少量已知文件 | 核实际root/锁文件与packageCount |
| 解读 | 联合errors、漏格式和cap判断 | 零命中不自动给clean |
| 修复 | 读具体公告、所有漏洞和兼容分支，再决定升级 | 工具只建议，不改项目 |
| 恢复 | 失败重扫前保留原报告/时间和依赖清单 | 不把旧fixture当当前数据 |

README开头说相邻dsh-src link开发依赖，但固定package声明为发布依赖版本，安装材料也有不一致需核实际文件。只做源码检查，不构建、安装、查OSV或运行目标冒烟。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 构建/宿主包、锁文件读取 | 校准期望文件/包和网络 | 未测安装与大锁峰值 |
| 持续使用 | OSV批次+详情、并发4/16和模型报告上下文 | 读公告、核版本分支/来源与误报 | API无key不等于零网络/人工成本 |
| 失败恢复 | 报告、重扫请求与固定依赖原件 | 查截断/空解析/网络失败及升级兼容 | 无自动改项目，升级回归另计 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨生态输入 | 多种纯解析器与过滤 | 真实锁格式完整覆盖 |
| OSV匹配 | 版本query和两段详情 | 可利用性、未公开漏洞或所有详情成功 |
| 修复提示 | 生成fixed与命令 | 对应包/分支、消除全部漏洞 |
| 报告复用 | 结构化报告/错误与重放 | 可靠clean/全量来源归属 |

> **思考**：同生态多锁来源被最后路径覆盖，fixed未按包/区间完整约束且多漏洞仍取最小；扫描cap静默、错误时也可显示0受影响，不能据此clean，未运行真实公告对照。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把多生态锁输入、批量ID/共享详情查询与宿主可重放报告统一，减少手工切换；只读建议，不是新漏洞情报或可利用性验证。详见[Q02](#research-q02)。

把多生态锁输入、批量ID/共享详情查询与宿主可重放报告统一，减少手工切换；只读建议，不是新漏洞情报或可利用性验证。详见[Q02](#research-q02)。

纯解析、传输和文件适配分离，transport可注入，批量去重与共享详情池、错误分类使失败可见，presentationMeta重放避免额外请求。这些是有意义的工程设计，但测试stub/作者live声明不是本轮执行结果，也不能从api.osv免费/无key推断数据不外发。

POST发送每包name、ecosystem、version，不发送整锁文件或项目源码；这些仍可能暴露私有包命名/依赖构成。fs适配没有取exec.agent.session.cwd，只ctx.fs.resolve(path)，默认根与实际会话世界是否一致依宿主默认契约。读/列操作也没传exec.signal；signal主要接网络与发现循环，单次大read不一定随取消停止。

查询fetch合并timeout与caller signal，取消归非重试，但mergeSignals每次给caller增加once监听，只在abort触发移除，正常请求结束未见解除，长批次需注意监听累积。full SBOM只是依赖列表摘要，没有标准SBOM格式/许可证/可达性分析。所有文件读写边界依宿主fs，源代码本身没有写或安装路径；报告修复字符串也不等于shell安全引用或可直接执行。

<a id="detail-section-5"></a>

### 1.4 主要限制

同生态多锁来源被最后路径覆盖，fixed未按包/区间完整约束且多漏洞仍取最小；扫描cap静默、错误时也可显示0受影响，不能据此clean，未运行真实公告对照。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。继续探讨用固定双锁/多公告/失败语料核覆盖、来源和全部修复约束，再按真实生态审升级兼容，避免把报告当安全验收。详见[Q06](#research-q06)。

合格结果要明确哪些文件/包被解析、哪些未覆盖、网络和详情失败是否影响结论，公告与包/版本对应，修复版本确实适合当前生态/分支并能处理本包全部相关漏洞。扫描命中不是可利用性验证，零命中也不是代码安全证明，升级命令成功还需要兼容/回归检查。

基线是各生态审计CLI或手工OSV查询。插件把常见锁文件和结构化报告放进一个宿主工具，省去逐生态命令切换；但最佳努力解析、版本简化和覆盖收据不足限制它替代成熟依赖治理流程。本轮不查实时漏洞，也不把录制fixture中的CVE/修复版当当前项目结论。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多生态解析和两段OSV/报告接线；静默覆盖cap、多锁来源与最早fixed不足使结果需人工核对，不当安全或升级保证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/tools/dep-scan.ts、src/lockfile-parsers.ts、src/osv-client.ts、src/report.ts、src/semver.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定src读取fs适配/发现、主要锁格式边界、OSV两段与fixed/severity归一化、报告/修复；未审所有解析器语法或查实时公告，不构建运行目标。
- 下一步：进一步探讨从同生态双锁、跨package affected、多个修复分支及部分网络失败对照人工真值，比较覆盖/来源/欠修复和成本。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-dep-vuln-scan](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan)
- **版本号**：0.1.1（[固定提交 db879fc](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/tree/db879fc01cd02b9f0821a87ba728a310ae08d9ac)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索包occurrence来源与四段覆盖收据，并按生态/分支求所有公告修复约束，无法证明时给候选；比较错源/欠修复/假clean与成本，未实现。详见[Q06](#research-q06)。

进一步探讨从同生态双锁、跨package affected、多个修复分支及部分网络失败对照人工真值，比较覆盖/来源/欠修复和成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 220 | — | — | 2990 |
| .ts | source | 6 | 2106 | 1586 | 384 | — |
| .ts | test | 1 | 580 | 501 | 42 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/issues?q=is%3Aissue+created%3A2026-09-22T05%3A55%3A43.091Z..2026-10-22T05%3A55%3A43.091Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A55%3A43.091Z..2026-10-22T05%3A55%3A43.091Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**判断固定版本跨生态依赖公告查询的可行动性，重点核查覆盖、来源归属、修复版本与失败解释。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要扫描，什么是合格结果？

**研究主题：**场景与需求

#### 完整回答

面向在DSH里维护多语言项目、希望先看到锁定依赖是否匹配已知OSV公告的开发者。输入是目录/单锁文件、生态过滤和fast/full，输出包版本、公告、修复建议与可重放报告。插件只建议命令，不运行安装或改锁文件。

合格结果要明确哪些文件/包被解析、哪些未覆盖、网络和详情失败是否影响结论，公告与包/版本对应，修复版本确实适合当前生态/分支并能处理本包全部相关漏洞。扫描命中不是可利用性验证，零命中也不是代码安全证明，升级命令成功还需要兼容/回归检查。

基线是各生态审计CLI或手工OSV查询。插件把常见锁文件和结构化报告放进一个宿主工具，省去逐生态命令切换；但最佳努力解析、版本简化和覆盖收据不足限制它替代成熟依赖治理流程。本轮不查实时漏洞，也不把录制fixture中的CVE/修复版当当前项目结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-43](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/README.md#L16-L43)

作者定义只读扫描与参数。

<details>
<summary>查看原文（28行）</summary>

````text
## 功能一览

| 能力 | 说明 |
| --- | --- |
| 生态支持 | npm（`package-lock.json`/`pnpm-lock.yaml`/`yarn.lock`）、PyPI（`requirements.txt`/`Pipfile.lock`/`poetry.lock`）、Go（`go.mod`）、crates.io（`Cargo.lock`）、Maven（`pom.xml`/`build.gradle*`）、NuGet（`packages.lock.json`）、RubyGems（`Gemfile.lock`） |
| 数据源 | OSV `POST /v1/querybatch`，零配置、免费、商用友好 |
| 确认口径 | 仅展示**确认存在**的漏洞：查询带 `version` 让 OSV 过滤 + 本地 `introduced ≤ version < fixed` 区间复核（verifier 口径） |
| 修复信息 | 取 affected ranges 中**最早 fixed**；有修复版标 `√ 有修复版 <版本>`，否则「无修复版」 |
| 严重度 | CVSSv3 数值（≥9 critical / ≥7 high / ≥4 medium / <4 low），无数值时用 OSV qualitative 关键词 |
| effort | `fast`（默认）：只查根锁文件、并发 4、无 SBOM；`full`：递归子目录（跳过 `node_modules` 等）、并发 16、生成 SBOM 摘要 |
| 健壮性 | 分块（250/批）批量查询、并发池、30s 超时、2 次重试退避、HTTP 429 按 `Retry-After` 等待；所有失败以结构化 `errors` 返回，不阻塞会话 |
| 持久化 | `output.presentationMeta` 投影整个报告 → `tool/result.meta`，UI 卡片回放可复制 |

## 安装与使用

作为 DSH 插件 bundle 安装进 profile：

```sh
# 1. 构建（产出 lib/，bundle 行引用 dsh-dep-vuln-scan/lib/index.js）
pnpm install && pnpm build

# 2. 加入 profile（声明了 dsh.bundle，dsh 会把本包作为配置层挂载）
dsh plugin --profile demo add ./dsh-dep-vuln-scan

# 3. 验证挂载
dsh --profile demo --dump-config | grep -A2 dep-vuln-scan
```

````

</details>

**依据 2 · 源码核查**：[src/tools/dep-scan.ts:10-14](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L10-L14)

仅报告不安装/写入的代码职责。

```text
 * Read-only by design: the scanner never writes, edits, or installs — it only
 * reports remediation commands for the user to run with confirmation
 * (PRIMARY spec: "不写任何文件（只读分析）").
 *
 * @module dsh-dep-vuln-scan/tools/dep-scan
```

**依据 3 · 源码核查**：[src/report.ts:244-258](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L244-L258)

只生成命令字符串，非执行。

<details>
<summary>查看原文（15行）</summary>

```text
/** Per-ecosystem remediation command for each confirmed (package, earliest fix). */
export function remediationCommands(findings: readonly Finding[]): string[] {
  const commands: string[] = []
  for (const finding of findings) {
    const fixed = earliestFix(finding.vulns)
    if (fixed === undefined) {
      commands.push(`${finding.name}@{${finding.version}} 无修复版，需联系上游或制定缓解措施`)
      continue
    }
    const command = remediationCommand(finding.ecosystem, finding.name, fixed)
    commands.push(`${command}   # ${finding.name} ${finding.version} → ${fixed}`)
  }
  return commands
}

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 锁文件到OSV报告如何连接？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

工具通过FsAdapter/ctx.fs发现和读取锁文件，fast只根目录，full递归跳常见构建/VCS目录，解析为name/version/ecosystem，再过滤生态并按三元组去重查询。OSV两段路径先POST querybatch得到ID，再共享详情池GET漏洞对象，减少同公告重复取详情。fast/full分别并发4/16，详情/批次有超时、重试和结构化failure。

报告把query结果组为Finding，显示包/当前版本/漏洞/严重性/修复版，full附依赖清单摘要；presentationMeta保存结构化报告供工具结果重放，不依赖浏览器再查OSV。入口还注入系统提示告诉模型何时扫描。贡献是多生态输入、两段OSV网络和可重放宿主报告的组合，不是新的漏洞数据库或代码可利用性分析。

所有“confirmed”主要依OSV对确切版本query的匹配与本地解析准确；详情归一化没有重新把每个affected package和当前query逐一核对。运行默认fetch，不自动用recorded stub回退；录制响应属于测试注入transport，不能解释为离线仍能查到最新公告。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/dep-scan.ts:142-238](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L142-L238)

发现/解析/生态过滤到batch与报告。

<details>
<summary>查看原文（97行）</summary>

```text
export async function runDepScan(args: DepScanArgs, options: RunDepScanOptions): Promise<ScanReport> {
  const { fs, transport, signal } = options
  const effort = args.effort ?? 'fast'
  const rootPath = args.path ?? '.'
  const root = await fs.resolve(rootPath)
  const rootInfo = await fs.stat(root)
  const errors: OsvFailure[] = []
  const lockfiles: ScannedLockfile[] = []
  const packageBuckets = new Map<string, PackageEntry[]>()

  const collect = (parsed: ParsedLockfile, displayPath: string) => {
    if (parsed.ecosystem === 'unknown') {
      errors.push({
        kind: 'parse',
        message: `无法识别锁文件类型: ${parsed.fileName}`,
        retryable: false,
      })
      return
    }
    if (parsed.parseError !== undefined) {
      errors.push({
        kind: 'parse',
        message: `解析失败 ${parsed.fileName}: ${parsed.parseError}`,
        retryable: false,
      })
    }
    lockfiles.push({ ecosystem: parsed.ecosystem, path: displayPath, packageCount: parsed.entries.length })
    const bucket = packageBuckets.get(parsed.ecosystem) ?? []
    bucket.push(...parsed.entries)
    packageBuckets.set(parsed.ecosystem, bucket)
  }

  if (rootInfo === undefined) {
    errors.push({ kind: 'parse', message: `路径不存在: ${root.displayPath}`, retryable: false })
    return buildReport({ effort, root: root.displayPath, lockfiles, queries: [], vulnsByQuery: [], errors })
  }

  if (rootInfo.type === 'file') {
    const fileName = basename(root.displayPath)
    const content = await fs.readText(root)
    const parsed = parseLockfile(fileName, content)
    collect(parsed, root.displayPath)
  } else if (rootInfo.type === 'directory') {
    const discovered = await discoverDirectory(fs, root, effort, 0, signal)
    for (const file of discovered) {
      const fileName = basename(file.target.displayPath)
      const content = await fs.readText(file.target)
      const parsed = parseLockfile(fileName, content)
      collect(parsed, file.target.displayPath)
    }
  } else {
    errors.push({
      kind: 'parse',
      message: `路径不是常规文件或目录: ${root.displayPath}`,
      retryable: false,
    })
  }

  // Ecosystem filter (normalise user-facing names).
  const wanted = new Set((args.ecosystems ?? []).map((name) => ECOSYSTEM_ALIASES[name.toLowerCase()] ?? name))

  const queries: OsvQueryPackage[] = []
  for (const [ecosystem, entries] of packageBuckets) {
    if (wanted.size > 0 && !wanted.has(ecosystem)) continue
    for (const entry of entries) {
      queries.push({ name: entry.name, ecosystem, version: entry.version })
    }
  }

  const batch = await queryOsvBatch(queries, {
    transport,
    concurrency: concurrencyForEffort(effort),
    signal,
  })

  for (const failed of batch.failures) {
    const dedupeKey = `${failed.failure.kind}${failed.failure.status ?? ''}${failed.failure.message}`
    if (!errors.some((e) => `${e.kind}${e.status ?? ''}${e.message}` === dedupeKey)) {
      errors.push(failed.failure)
    }
  }

  const vulnsByQuery = batch.vulnsByQuery
  return buildReport({
    effort,
    root: root.displayPath,
    lockfiles,
    queries: batch.queries,
    vulnsByQuery,
    errors,
  })
}

/**
 * Recursively list lockfile files under a directory. `fast` scans the root
 * level only; `full` walks subdirectories (skipping `node_modules`/VCS/build
 * dirs) down to {@link MAX_DISCOVERY_DEPTH} and up to {@link MAX_LOCKFILES}
```

</details>

**依据 2 · 源码核查**：[src/osv-client.ts:299-366](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L299-L366)

共享ID详情池和归一化。

<details>
<summary>查看原文（68行）</summary>

```text
  })

  // 阶段 2：详情回查——真实 OSV 的 batch 只回 id；逐个 `GET /v1/vulns/{id}` 取
  // 完整记录（aliases/affected/summary/severity），并发池 + 退避重试；单个详情
  // 失败记入 failures 并跳过该条，绝不让一次详情抖动拖垮整次扫描。
  const allIds: string[] = []
  for (const list of rawByQuery) {
    if (list === null) continue
    for (const entry of list) {
      if (!allIds.includes(entry.id)) allIds.push(entry.id)
    }
  }
  const detailMap = new Map<string, OsvVulnerability>()
  const detailIndexById = new Map<string, number>()
  allIds.forEach((id, idx) => detailIndexById.set(id, idx))
  await runPool(allIds, Math.max(2, concurrency), signal, async (id) => {
    let lastFailure: OsvFailure | undefined
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (signal?.aborted) break
      if (attempt > 0) await sleep(150 * attempt)
      try {
        const { bodyText, status } = await transport.getJson(
          `${OSV_VULN_URL}/${encodeURIComponent(id)}`,
          { signal, timeoutMs },
        )
        if (status === 200) {
          detailMap.set(id, JSON.parse(bodyText) as OsvVulnerability)
          return
        }
        if (status === 404) {
          lastFailure = { kind: 'invalid-response', message: `OSV 详情 404：${id}`, retryable: false }
          continue
        }
        if (status === 429 || status >= 500) {
          lastFailure = { kind: status === 429 ? 'ratelimit' : 'http', message: `OSV 详情 HTTP ${status}：${id}`, retryable: true, status }
          continue
        }
        lastFailure = { kind: 'http', message: `OSV 详情 HTTP ${status}：${id}`, retryable: false, status }
        continue
      } catch (error) {
        const transportError = error as { failure?: OsvFailure }
        lastFailure = transportError.failure ?? { kind: 'network', message: `OSV 详情失败：${id}`, retryable: true }
        continue
      }
    }
    // 详情重试用尽：记录失败（挂到该 id 对应的第一个查询上）并跳过该条。
    if (lastFailure !== undefined) {
      for (let qi = 0; qi < unique.length; qi++) {
        const list = rawByQuery[qi]
        if (list !== null && list.some((entry) => entry.id === id)) {
          failures.push({ index: qi, query: unique[qi], failure: { ...lastFailure, message: `${lastFailure.message}` } })
          break
        }
      }
    }
  })

  const perQueryVulns: Array<NormalizedVuln[] | null> = new Array(unique.length).fill(null)
  unique.forEach((query, index) => {
    const raw = rawByQuery[index]
    if (raw === null || raw === undefined) return
    const vulns: NormalizedVuln[] = []
    for (const entry of raw) {
      const detail = detailMap.get(entry.id)
      if (detail === undefined) continue // 详情失败已在 failures 记录
      vulns.push(normalizeVulnerability(detail, query.version))
    }
    perQueryVulns[index] = vulns
```

</details>

**依据 3 · 源码核查**：[src/report.ts:105-125](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L105-L125)

query到Finding结构。

<details>
<summary>查看原文（21行）</summary>

```text
/** Convert per-query OSV results into `Finding` rows (only confirmed hits). */
function composeFindings(
  queries: OsvQueryPackage[],
  vulnsByQuery: NormalizedVuln[][],
  lockfiles: ScannedLockfile[],
): Finding[] {
  const ecosystemFor = new Map(lockfiles.map((lf) => [lf.ecosystem, lf.path]))
  const findings: Finding[] = []
  queries.forEach((query, index) => {
    const vulns = vulnsByQuery[index] ?? []
    if (vulns.length === 0) return
    findings.push({
      ecosystem: query.ecosystem,
      lockfile: ecosystemFor.get(query.ecosystem) ?? 'unknown',
      name: query.name,
      version: query.version,
      vulns,
      hasFix: vulns.some((v) => v.hasFix),
    })
  })
  return findings
```

</details>

**依据 4 · 源码核查**：[src/index.ts:25-36](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/index.ts#L25-L36)

一个工具与提示词接线。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.systemPrompt.section({
    name: 'tool:dep_vuln_scan',
    order: 111,
    text:
      'Use the dep_vuln_scan tool to audit a project’s dependency lockfiles '
      + '(npm/pnpm/yarn/pip/go/cargo/maven/gradle/nuget/rubygems) against the free OSV '
      + 'vulnerability database. It returns confirmed findings with CVSS scores and fix '
      + 'versions plus remediation commands — read-only, it never modifies lockfiles.',
  })

  ctx.tools.register(defineDepScanTool(ctx))
```

</details>

**依据 5 · 源码核查**：[src/osv-client.ts:170-198](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L170-L198)

默认全局fetch POST与错误。

<details>
<summary>查看原文（29行）</summary>

```text
    const { signal, timeoutMs } = opts
    const timeout = AbortSignal.timeout(timeoutMs ?? OSV_DEFAULT_TIMEOUT_MS)
    const merged = mergeSignals(signal, timeout)
    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: merged,
      })
    } catch (err) {
      if (merged.aborted && signal?.aborted) {
        throw new TransportError('扫描已取消', { kind: 'timeout', message: '扫描已取消', retryable: false })
      }
      if (merged.aborted) {
        throw new TransportError('OSV 请求超时', {
          kind: 'timeout',
          message: 'OSV 请求超时，请检查网络或稍后重试',
          retryable: true,
        })
      }
      throw new TransportError('无法访问 OSV', {
        kind: 'network',
        message: '无法访问 OSV，检查网络或稍后重试',
        retryable: true,
      })
    }
    return { status: response.status, bodyText: await response.text() }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 覆盖、修复版本和来源有哪些限制？

**研究主题：**缺陷与关键质疑

#### 完整回答

full最多深度8/200锁文件，discoverDirectory遇cap直接返回，没有truncated或跳过文件/目录计数回报告；解析器对pnpm/yarn/requirements/Maven最佳努力，部分不支持形态可空entries而非parseError。网络/详情失败被errors列出，但render在affectedPackages=0仍写“锁文件中的包均未发现已知漏洞”，容易把失败/零解析读成clean，必须连覆盖和errors一起看。

同生态多锁文件在composeFindings用Map(ecosystem→path)，后一个文件覆盖前一个；包query已失原文件归属，所有该生态漏洞都指最后锁文件，不能准确修复monorepo来源。严重性只读database_specific数值/词和cvss_v3.baseScore，没有处理顶层severity向量，可能显示unknown，不代表低危。

修复版遍历vuln全部affected且不按package/ecosystem筛，逐event把fixed和同event.introduced传versionInRange，而OSV事件常是独立introduced/fixed记录，未维护区间起点。无匹配时又取所有fixed最小。多漏洞remediation再取最早修复版，不能保证消除更高修复门槛的其余漏洞，甚至可给低于当前版建议。简化SemVer不等价PyPI/Maven/Go全部版本语义。因此建议命令需逐公告/分支人工复核，不自动执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/dep-scan.ts:249-275](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L249-L275)

发现cap直接返回，无覆盖状态。

<details>
<summary>查看原文（27行）</summary>

```text
  const walk = async (dir: FsAdapterTarget, currentDepth: number): Promise<void> => {
    if (signal?.aborted === true) return
    if (currentDepth > MAX_DISCOVERY_DEPTH || files.length >= MAX_LOCKFILES) return
    const entries = await fs.listDir(dir)
    for (const entry of entries) {
      if (files.length >= MAX_LOCKFILES) return
      if (entry.type === 'directory') {
        if (SKIP_DIRECTORIES.has(entry.name)) continue
        if (effort === 'full') await walk(entry.target, currentDepth + 1)
        continue
      }
      if (entry.type === 'file' && ecosystemForFile(entry.name) !== null) {
        files.push(entry)
      }
    }
  }
  await walk(target, depth)
  return files
}

function basename(path: string): string {
  const normalized = path.replace(/\\/g, '/').replace(/\/+$/, '')
  const index = normalized.lastIndexOf('/')
  return index >= 0 ? normalized.slice(index + 1) : normalized
}

// ---------------------------------------------------------------------------
```

</details>

**依据 2 · 源码核查**：[src/lockfile-parsers.ts:194-221](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/lockfile-parsers.ts#L194-L221)

pnpm行级形态不匹配可静默跳过。

<details>
<summary>查看原文（28行）</summary>

```text
export function parsePnpmLock(content: string): PackageEntry[] {
  const lines = content.split(/\r?\n/)
  const entries: PackageEntry[] = []
  let inPackages = false

  const header = /^\s{0,2}packages\s*:\s*$/
  const entry = /^\s{2}\/(?<name>@?[^@\s/:]+(?:\/[^@\s/:]+)*)@(?<version>[^\s():]+)(?:\([^)]*\))?\s*:\s*$/

  for (const line of lines) {
    if (inPackages) {
      // A top-level key (no leading whitespace) ends the packages section.
      if (!/^\s/.test(line)) {
        if (header.test(line)) continue // `packages:` can repeat across sections
        inPackages = false
        continue
      }
      const match = entry.exec(line)
      if (match === null || match.groups === undefined) continue
      const version = (match.groups.version ?? '').split('+')[0] ?? ''
      if (version === '') continue
      entries.push({ name: match.groups.name ?? '', version })
    } else if (header.test(line)) {
      inPackages = true
    }
  }
  return entries
}

```

</details>

**依据 3 · 源码核查**：[src/report.ts:105-125](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L105-L125)

同生态锁路径最后覆盖。

<details>
<summary>查看原文（21行）</summary>

```text
/** Convert per-query OSV results into `Finding` rows (only confirmed hits). */
function composeFindings(
  queries: OsvQueryPackage[],
  vulnsByQuery: NormalizedVuln[][],
  lockfiles: ScannedLockfile[],
): Finding[] {
  const ecosystemFor = new Map(lockfiles.map((lf) => [lf.ecosystem, lf.path]))
  const findings: Finding[] = []
  queries.forEach((query, index) => {
    const vulns = vulnsByQuery[index] ?? []
    if (vulns.length === 0) return
    findings.push({
      ecosystem: query.ecosystem,
      lockfile: ecosystemFor.get(query.ecosystem) ?? 'unknown',
      name: query.name,
      version: query.version,
      vulns,
      hasFix: vulns.some((v) => v.hasFix),
    })
  })
  return findings
```

</details>

**依据 4 · 源码核查**：[src/report.ts:190-200](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L190-L200)

errors与零受影响文案并存。

<details>
<summary>查看原文（11行）</summary>

```text
  if (report.errors.length > 0) {
    lines.push('> ⚠️ 扫描期间出现错误（以下查询可能不完整）：')
    for (const error of report.errors) {
      lines.push(`> - \`${error.kind}\`${error.status !== undefined ? ` (HTTP ${error.status})` : ''}: ${error.message}`)
    }
    lines.push('')
  }

  if (summary.affectedPackages === 0) {
    lines.push('**0 受影响** — 锁文件中的包均未发现已知漏洞（OSV）。')
    lines.push('')
```

</details>

**依据 5 · 源码核查**：[src/osv-client.ts:551-611](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L551-L611)

跨affected固定版本、逐event与全局最小。

<details>
<summary>查看原文（61行）</summary>

```text
export function normalizeVulnerability(vuln: OsvVulnerability, version: string): NormalizedVuln {
  const aliases = vuln.aliases ?? []
  const cve = aliases.find((alias) => alias.startsWith('CVE-'))
  const ghsa = aliases.find((alias) => alias.startsWith('GHSA-'))
  const displayId = cve ?? ghsa ?? vuln.id
  const summary = truncate(vuln.summary ?? vuln.details ?? '', 120)

  const { score, qualitative } = severityOf(vuln)
  const covering = coveringFixedVersions(vuln, version)
  const earliestCovering = minVersion(covering)
  const fixedVersion = earliestCovering ?? earliestFixedGlobally(vuln)

  return {
    id: vuln.id,
    aliases,
    displayId,
    cve,
    ghsa,
    summary,
    cvss: score,
    severity: qualitative,
    fixedVersion,
    hasFix: fixedVersion !== undefined,
  }
}

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized
}

/** The affected ranges whose `introduced ≤ version < fixed` hold. */
function coveringFixeds(vuln: OsvVulnerability, version: string): string[] {
  const fixed: string[] = []
  for (const affected of vuln.affected ?? []) {
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed !== undefined && versionInRange(version, event.introduced, event.fixed)) {
          fixed.push(event.fixed)
        }
      }
    }
  }
  return fixed
}

function coveringFixedVersions(vuln: OsvVulnerability, version: string): string[] {
  return coveringFixeds(vuln, version)
}

function earliestFixedGlobally(vuln: OsvVulnerability): string | undefined {
  const allFixed: string[] = []
  for (const affected of vuln.affected ?? []) {
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed !== undefined) allFixed.push(event.fixed)
      }
    }
  }
  return minVersion(allFixed)
}
```

</details>

**依据 6 · 源码核查**：[src/report.ts:285-298](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L285-L298)

多漏洞仍取最早fixed。

<details>
<summary>查看原文（14行）</summary>

```text

function earliestFix(vulns: readonly NormalizedVuln[]): string | undefined {
  let best: string | undefined
  for (const vuln of vulns) {
    if (!vuln.hasFix || vuln.fixedVersion === undefined) continue
    if (best === undefined) {
      best = vuln.fixedVersion
      continue
    }
    const cmp = compareVersions(vuln.fixedVersion, best)
    if (cmp !== null && cmp < 0) best = vuln.fixedVersion
  }
  return best
}
```

</details>

**依据 7 · 源码核查**：[src/osv-client.ts:619-637](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L619-L637)

CVSS字段覆盖范围。

<details>
<summary>查看原文（19行）</summary>

```text
function severityOf(vuln: OsvVulnerability): { score: number | undefined; qualitative: Severity } {
  const db = vuln.database_specific
  const numeric = numericSeverity(db?.severity)
  if (numeric !== undefined) return { score: numeric, qualitative: labelForScore(numeric) }
  if (typeof db?.cvss_v3?.baseScore === 'number' && Number.isFinite(db.cvss_v3.baseScore)) {
    const score = db.cvss_v3.baseScore
    return { score, qualitative: labelForScore(score) }
  }
  for (const affected of vuln.affected ?? []) {
    const perAffected = numericSeverity(affected.database_specific?.severity)
    if (perAffected !== undefined) return { score: perAffected, qualitative: labelForScore(perAffected) }
  }
  const keyword = (db?.severity ?? '').toLowerCase()
  if (keyword === 'critical') return { score: undefined, qualitative: 'critical' }
  if (keyword === 'high') return { score: undefined, qualitative: 'high' }
  if (keyword === 'medium' || keyword === 'moderate') return { score: undefined, qualitative: 'medium' }
  if (keyword === 'low') return { score: undefined, qualitative: 'low' }
  return { score: undefined, qualitative: 'unknown' }
}
```

</details>

#### 缺口

- 不同真实锁格式、生态版本、多个修复分支与公告包范围没有本轮对照。
  **影响：**不能承诺覆盖完整或推荐版消除全部漏洞，不量化真实漏报率。
  **进一步探讨：**固定多锁/多包公告/introduced-fixed事件流语料，对照原生态解析器与人工预期，并给失败/截断专门状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动与使用依赖什么？

**研究主题：**依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18与DSH tools/fs/systemPrompt | 包声明/硬注入 | 工具、文件适配和提示词 | 版本/接口需匹配 |
| 固定DSH运行包依赖 | 包声明 | Cordis及0.1.1-rc.2服务 | 普通独立Node不具备宿主 |
| TypeScript构建产物lib | Git源码安装需要 | main/exports/patch入口 | 固定Git未跟踪lib，README要求先build |
| 可读锁文件/正确工作区根 | 扫描必需 | 包版本清单 | 默认fs.resolve('.')不显式传session cwd |
| api.osv.dev网络 | 实时查询必需 | 批量与详情 | 网络错不自动装载测试fixture |
| 公告/生态版本知识 | 升级采用条件 | 核对分支和兼容 | 不直接复制最早fixed命令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 固定包/宿主和项目，列期望锁文件/解析包 | 明确依赖名/版本将发OSV |
| 安装 | 按源码构建lib再挂独立profile | 不把Git缺lib泛化为npm包损坏 |
| 扫描 | 明确path和effort，先少量已知文件 | 核实际root/锁文件与packageCount |
| 解读 | 联合errors、漏格式和cap判断 | 零命中不自动给clean |
| 修复 | 读具体公告、所有漏洞和兼容分支，再决定升级 | 工具只建议，不改项目 |
| 恢复 | 失败重扫前保留原报告/时间和依赖清单 | 不把旧fixture当当前数据 |

README开头说相邻dsh-src link开发依赖，但固定package声明为发布依赖版本，安装材料也有不一致需核实际文件。只做源码检查，不构建、安装、查OSV或运行目标冒烟。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:57-73](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/package.json#L57-L73)

构建与固定宿主依赖。

<details>
<summary>查看原文（17行）</summary>

```text
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "tsx --test tests/smoke.e2e.ts",
    "test:live": "DSH_OSV_LIVE=1 tsx --test tests/smoke.e2e.ts",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-fs": "0.1.1-rc.2",
    "@deepseek-ai/dsh-system-prompt": "0.1.1-rc.2",
    "@deepseek-ai/dsh-tools": "0.1.1-rc.2"
  },
  "devDependencies": {
    "@types/node": "^26.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.5.0"
```

</details>

**依据 2 · 源码核查**：[package.json:84-86](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/package.json#L84-L86)

Node要求。

```text
  "engines": {
    "node": ">=22.18.0"
  }
```

**依据 3 · 源码核查**：[src/index.ts:20-23](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/index.ts#L20-L23)

硬注入。

```text
export const name = 'dsh-dep-vuln-scan'

/** Hard dependencies: tools (registration), fs (lockfile reads), systemPrompt (guidance). */
export const inject = ['tools', 'fs', 'systemPrompt']
```

**依据 4 · 源码核查**：[src/tools/dep-scan.ts:83-106](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L83-L106)

fs适配不传session cwd/signal。

<details>
<summary>查看原文（24行）</summary>

```text
      const info = await ctx.fs.stat(toTarget(target))
      if (info === undefined) return undefined
      return { type: info.type }
    },
    async listDir(target) {
      const entries = await ctx.fs.listDir(toTarget(target))
      return entries.map((entry: FsDirEntry) => ({
        name: entry.name,
        type: entry.type,
        target: { handle: { target: entry.target } satisfies CtxFsHandle, displayPath: entry.target.displayPath },
      }))
    },
    async readText(target) {
      return ctx.fs.readText(toTarget(target))
    },
  }
}

/** Accepted `dep_vuln_scan` arguments (mirrors the defineTool parameters). */
export interface DepScanArgs {
  /** Project directory or lockfile path; defaults to the workspace root. */
  path?: string
  /** Ecosystem filter (user-facing names, case-insensitive). */
  ecosystems?: string[]
```

</details>

**依据 5 · 作者声明**：[README.md:3-10](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/README.md#L3-L10)

相邻link是作者开发说明。

```text
> [!IMPORTANT]
> **依赖前置：相邻 `dsh-src` 检出（`link:` 依赖）**
> 本项目在开发形态下使用 `link:` 依赖指向相邻的 DeepSeek Harness 源码检出（`dsh-src`），
> 与当前仓库保持同一父目录布局（`<parent>/dsh-src`）。克隆本仓库后：
> 1. 先把官方 `deepseek-ai/deepseek-harness` 检出到与本仓库同级的 `dsh-src/` 目录，并执行其 `pnpm install && pnpm run build`；
> 2. 再按下方「安装」一节执行本仓库的 `pnpm install --offline && pnpm build` 与测试。
> 发布到 npm 的版本会尽量把 `link:` 依赖替换为 registry 真实版本；无法替换的内部包保持 `link:`，见各包 README 说明。

```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 工程、数据外发和取消如何？

**研究主题：**工程质量与复用

#### 完整回答

纯解析、传输和文件适配分离，transport可注入，批量去重与共享详情池、错误分类使失败可见，presentationMeta重放避免额外请求。这些是有意义的工程设计，但测试stub/作者live声明不是本轮执行结果，也不能从api.osv免费/无key推断数据不外发。

POST发送每包name、ecosystem、version，不发送整锁文件或项目源码；这些仍可能暴露私有包命名/依赖构成。fs适配没有取exec.agent.session.cwd，只ctx.fs.resolve(path)，默认根与实际会话世界是否一致依宿主默认契约。读/列操作也没传exec.signal；signal主要接网络与发现循环，单次大read不一定随取消停止。

查询fetch合并timeout与caller signal，取消归非重试，但mergeSignals每次给caller增加once监听，只在abort触发移除，正常请求结束未见解除，长批次需注意监听累积。full SBOM只是依赖列表摘要，没有标准SBOM格式/许可证/可达性分析。所有文件读写边界依宿主fs，源代码本身没有写或安装路径；报告修复字符串也不等于shell安全引用或可直接执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/osv-client.ts:170-210](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L170-L210)

网络signal/timeout与合并监听。

<details>
<summary>查看原文（41行）</summary>

```text
    const { signal, timeoutMs } = opts
    const timeout = AbortSignal.timeout(timeoutMs ?? OSV_DEFAULT_TIMEOUT_MS)
    const merged = mergeSignals(signal, timeout)
    let response: Response
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: merged,
      })
    } catch (err) {
      if (merged.aborted && signal?.aborted) {
        throw new TransportError('扫描已取消', { kind: 'timeout', message: '扫描已取消', retryable: false })
      }
      if (merged.aborted) {
        throw new TransportError('OSV 请求超时', {
          kind: 'timeout',
          message: 'OSV 请求超时，请检查网络或稍后重试',
          retryable: true,
        })
      }
      throw new TransportError('无法访问 OSV', {
        kind: 'network',
        message: '无法访问 OSV，检查网络或稍后重试',
        retryable: true,
      })
    }
    return { status: response.status, bodyText: await response.text() }
  },
}

/** Combine an optional caller signal with the timeout signal. */
export function mergeSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
  if (a === undefined) return b
  if (a.aborted) return a
  const controller = new AbortController()
  const onAbort = () => controller.abort()
  a.addEventListener('abort', onAbort, { once: true })
  b.addEventListener('abort', onAbort, { once: true })
  return controller.signal
```

</details>

**依据 2 · 源码核查**：[src/osv-client.ts:408-418](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L408-L418)

querybatch只发包名/生态/版本。

<details>
<summary>查看原文（11行）</summary>

```text
  opts: { timeoutMs: number; maxAttempts: number; signal?: AbortSignal },
): Promise<{ vulns: Array<{ vulns?: OsvVulnerability[] } | null>; failed: Array<{ query: OsvQueryPackage; failure: OsvFailure }> }> {
  const payload = {
    queries: chunk.map((query) => ({
      package: { name: query.name, ecosystem: query.ecosystem },
      version: query.version,
    })),
  }

  let lastFailure: OsvFailure | null = null
  for (let attempt = 0; attempt < opts.maxAttempts; attempt++) {
```

</details>

**依据 3 · 源码核查**：[src/tools/dep-scan.ts:83-106](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L83-L106)

文件适配缺cwd/signal显式上下文。

<details>
<summary>查看原文（24行）</summary>

```text
      const info = await ctx.fs.stat(toTarget(target))
      if (info === undefined) return undefined
      return { type: info.type }
    },
    async listDir(target) {
      const entries = await ctx.fs.listDir(toTarget(target))
      return entries.map((entry: FsDirEntry) => ({
        name: entry.name,
        type: entry.type,
        target: { handle: { target: entry.target } satisfies CtxFsHandle, displayPath: entry.target.displayPath },
      }))
    },
    async readText(target) {
      return ctx.fs.readText(toTarget(target))
    },
  }
}

/** Accepted `dep_vuln_scan` arguments (mirrors the defineTool parameters). */
export interface DepScanArgs {
  /** Project directory or lockfile path; defaults to the workspace root. */
  path?: string
  /** Ecosystem filter (user-facing names, case-insensitive). */
  ecosystems?: string[]
```

</details>

**依据 4 · 源码核查**：[src/tools/dep-scan.ts:451-462](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L451-L462)

执行只给runDepScan signal，fs adapter仍独立。

<details>
<summary>查看原文（12行）</summary>

```text
    async execute(args, exec) {
      return runDepScan(args as DepScanArgs, {
        fs: adaptCtxFs(ctx),
        transport,
        signal: exec.signal,
      })
    },
  })
}

/** Re-export for tests / consumers. */
export type { NormalizedVuln, OsvFailure, OsvQueryPackage, ScanReport }
```

</details>

**依据 5 · 源码核查**：[src/report.ts:128-147](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L128-L147)

SBOM实际摘要结构。

<details>
<summary>查看原文（20行）</summary>

```text
function buildSbom(queries: OsvQueryPackage[]): SbomSummary {
  const byEcosystem = new Map<string, Set<string>>()
  const packages: Array<{ ecosystem: string; name: string; version: string }> = []
  for (const query of queries) {
    const bucket = byEcosystem.get(query.ecosystem) ?? new Set<string>()
    const id = `${query.name}@${query.version}`
    if (!bucket.has(id)) {
      bucket.add(id)
      packages.push({ ecosystem: query.ecosystem, name: query.name, version: query.version })
    }
    byEcosystem.set(query.ecosystem, bucket)
  }
  return {
    ecosystems: [...byEcosystem.entries()]
      .map(([ecosystem, set]) => ({ ecosystem, packageCount: set.size }))
      .sort((a, b) => b.packageCount - a.packageCount),
    packages: packages.sort((a, b) => a.ecosystem.localeCompare(b.ecosystem) || a.name.localeCompare(b.name)),
  }
}

```

</details>

#### 缺口

- 宿主默认fs根/权限、取消大文件与长批次监听行为未运行核查。
  **影响：**不能保证同会话目录或取消即时停止全部IO。
  **进一步探讨：**沿固定宿主fs契约核cwd，再用受控大文件与多批请求观察取消/监听释放，不查询真实敏感清单。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本、采用与未来假设怎么判断？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 构建/宿主包、锁文件读取 | 校准期望文件/包和网络 | 未测安装与大锁峰值 |
| 持续使用 | OSV批次+详情、并发4/16和模型报告上下文 | 读公告、核版本分支/来源与误报 | API无key不等于零网络/人工成本 |
| 失败恢复 | 报告、重扫请求与固定依赖原件 | 查截断/空解析/网络失败及升级兼容 | 无自动改项目，升级回归另计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨生态输入 | 多种纯解析器与过滤 | 真实锁格式完整覆盖 |
| OSV匹配 | 版本query和两段详情 | 可利用性、未公开漏洞或所有详情成功 |
| 修复提示 | 生成fixed与命令 | 对应包/分支、消除全部漏洞 |
| 报告复用 | 结构化报告/错误与重放 | 可靠clean/全量来源归属 |

建议观察。跨生态只读扫描有明确开发价值，网络/报告分层也便于复用；但覆盖静默截断、多锁来源错误和最早fixed聚合影响结果可行动性。继续探讨可先核一份已知锁文件与多个公告分支的人工真值，再评估monorepo来源及失败状态，不把扫描清单当安全验收。

未验证假设是保留package occurrence→锁文件来源，附解析/发现/查询/详情四段覆盖收据，修复采用按生态/包/分支的所有公告约束求交，并输出无法证明时的候选而非单最小版本。相比当前扁平query与最早fixed，可能减少错源/欠修复和假clean；代价是版本解析器与报告复杂度。最小对照用同生态双锁、多包affected公告、多个fixed分支和部分网络失败，比较来源/修复正确、漏警/误警、耗时和人工核对；若候选太多无法行动，需收窄范围。未实现，不计已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/report.ts:105-125](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L105-L125)

来源映射粒度是假设起点。

<details>
<summary>查看原文（21行）</summary>

```text
/** Convert per-query OSV results into `Finding` rows (only confirmed hits). */
function composeFindings(
  queries: OsvQueryPackage[],
  vulnsByQuery: NormalizedVuln[][],
  lockfiles: ScannedLockfile[],
): Finding[] {
  const ecosystemFor = new Map(lockfiles.map((lf) => [lf.ecosystem, lf.path]))
  const findings: Finding[] = []
  queries.forEach((query, index) => {
    const vulns = vulnsByQuery[index] ?? []
    if (vulns.length === 0) return
    findings.push({
      ecosystem: query.ecosystem,
      lockfile: ecosystemFor.get(query.ecosystem) ?? 'unknown',
      name: query.name,
      version: query.version,
      vulns,
      hasFix: vulns.some((v) => v.hasFix),
    })
  })
  return findings
```

</details>

**依据 2 · 源码核查**：[src/osv-client.ts:551-611](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts#L551-L611)

fixed归一化不保持包/区间。

<details>
<summary>查看原文（61行）</summary>

```text
export function normalizeVulnerability(vuln: OsvVulnerability, version: string): NormalizedVuln {
  const aliases = vuln.aliases ?? []
  const cve = aliases.find((alias) => alias.startsWith('CVE-'))
  const ghsa = aliases.find((alias) => alias.startsWith('GHSA-'))
  const displayId = cve ?? ghsa ?? vuln.id
  const summary = truncate(vuln.summary ?? vuln.details ?? '', 120)

  const { score, qualitative } = severityOf(vuln)
  const covering = coveringFixedVersions(vuln, version)
  const earliestCovering = minVersion(covering)
  const fixedVersion = earliestCovering ?? earliestFixedGlobally(vuln)

  return {
    id: vuln.id,
    aliases,
    displayId,
    cve,
    ghsa,
    summary,
    cvss: score,
    severity: qualitative,
    fixedVersion,
    hasFix: fixedVersion !== undefined,
  }
}

function truncate(text: string, max: number): string {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > max ? `${normalized.slice(0, max - 1)}…` : normalized
}

/** The affected ranges whose `introduced ≤ version < fixed` hold. */
function coveringFixeds(vuln: OsvVulnerability, version: string): string[] {
  const fixed: string[] = []
  for (const affected of vuln.affected ?? []) {
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed !== undefined && versionInRange(version, event.introduced, event.fixed)) {
          fixed.push(event.fixed)
        }
      }
    }
  }
  return fixed
}

function coveringFixedVersions(vuln: OsvVulnerability, version: string): string[] {
  return coveringFixeds(vuln, version)
}

function earliestFixedGlobally(vuln: OsvVulnerability): string | undefined {
  const allFixed: string[] = []
  for (const affected of vuln.affected ?? []) {
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed !== undefined) allFixed.push(event.fixed)
      }
    }
  }
  return minVersion(allFixed)
}
```

</details>

**依据 3 · 源码核查**：[src/report.ts:285-298](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts#L285-L298)

多漏洞最早fixed。

<details>
<summary>查看原文（14行）</summary>

```text

function earliestFix(vulns: readonly NormalizedVuln[]): string | undefined {
  let best: string | undefined
  for (const vuln of vulns) {
    if (!vuln.hasFix || vuln.fixedVersion === undefined) continue
    if (best === undefined) {
      best = vuln.fixedVersion
      continue
    }
    const cmp = compareVersions(vuln.fixedVersion, best)
    if (cmp !== null && cmp < 0) best = vuln.fixedVersion
  }
  return best
}
```

</details>

**依据 4 · 源码核查**：[src/tools/dep-scan.ts:249-275](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts#L249-L275)

覆盖cap未出收据。

<details>
<summary>查看原文（27行）</summary>

```text
  const walk = async (dir: FsAdapterTarget, currentDepth: number): Promise<void> => {
    if (signal?.aborted === true) return
    if (currentDepth > MAX_DISCOVERY_DEPTH || files.length >= MAX_LOCKFILES) return
    const entries = await fs.listDir(dir)
    for (const entry of entries) {
      if (files.length >= MAX_LOCKFILES) return
      if (entry.type === 'directory') {
        if (SKIP_DIRECTORIES.has(entry.name)) continue
        if (effort === 'full') await walk(entry.target, currentDepth + 1)
        continue
      }
      if (entry.type === 'file' && ecosystemForFile(entry.name) !== null) {
        files.push(entry)
      }
    }
  }
  await walk(target, depth)
  return files
}

function basename(path: string): string {
  const normalized = path.replace(/\\/g, '/').replace(/\/+$/, '')
  const index = normalized.lastIndexOf('/')
  return index >= 0 ? normalized.slice(index + 1) : normalized
}

// ---------------------------------------------------------------------------
```

</details>

#### 缺口

- 没有本轮与原生态审计工具/人工公告核对的质量和总成本比较。
  **影响：**不能量化扫描收益、漏报或升级成功率。
  **进一步探讨：**固定混合锁/公告语料与失败序列比较覆盖、来源、修复及人工耗时。
- occurrence覆盖收据与版本约束求交未实现。
  **影响：**不提升当前扫描完整性或修复保证。
  **进一步探讨：**以上述多锁/多公告/失败样本核对错源、欠修复、假clean和维护成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
