# dsh-dep-vuln-scan

> 读取依赖锁文件并查询 OSV，生成漏洞、严重度和修复建议报告。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[db879fc](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/tree/db879fc01cd02b9f0821a87ba728a310ae08d9ac)

<!-- BEGIN META -->
[![npm 30d 106](https://img.shields.io/static/v1?label=npm+30d&message=106&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan) [![首次发布 2026-08-24](https://img.shields.io/static/v1?label=%E9%A6%96%E6%AC%A1%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-dep-vuln-scan)
<!-- END META -->

**使用建议**：适合已知锁文件的初筛；检查跳过/错误及实际包清单，修复前核公告维护线并做项目回归，别直接执行生成命令。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：开发者快速盘点锁定依赖的已知公告风险，交付包版本与漏洞表供人工修复；不评估实际可利用性。

- **建议**：待验证假设：报告把解析覆盖/未知版本、生态专属比较和可利用性证据分层，可减少“零漏洞=安全”和跨版本线错误升级。由有限parser/semver推导，未实现完整分层。以预发布、非semver、peer后缀和多修复线对照官方锁解析/公告，测漏包与修复建议错误；未知不能按干净计。

适合已知锁文件的初筛；检查跳过/错误及实际包清单，修复前核公告维护线并做项目回归，别直接执行生成命令。

核查状态：源码支持只读扫描与结构化错误；未调用OSV或跑目标测试，真实解析覆盖和漏洞确认未验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

参照OSV扫描/各包管理器审计与手工公告核对；未作召回率比较。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：dep_vuln_scan只读查询及报告。

**流程与依赖**

dep-scan发现锁文件，lockfile-parsers提取精确包版本，osv-client分块querybatch和详情并本地复核范围，report生成表格/修复命令与presentationMeta。

DSH tools/fs/systemPrompt、OSV API、锁文件精确版本和构建依赖。

发现锁→提取/去重包→分批查OSV→详情与范围核对→表格/汇总→人工决定升级；不写项目。

TS需构建，源码link依赖相邻dsh-src，发布包是否已替换必须另核；OSV网络为必需。

**效果与成本**

首次准备兼容宿主/依赖，持续网络与解析复核、升级回归测试；OSV作者称无需key，本轮不作商业/现价保证；人工修复成本未测。

集中已知漏洞线索和依赖定位；不能证明无未知漏洞、无漏包或安全可升级。

- **思考**：“确认存在”是否覆盖所有依赖和生态版本？pnpm/yarn行解析、requirements仅==、Maven属性等会跳过；自写semver不等于PyPI/Go/Maven完整排序，无法解析introduce/fixed可能误归类。最低fixed也不一定是当前维护线可安全升级目标，公告命中更不证明代码路径可利用。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对手动逐生态查公告，增量是将多锁文件解析、批量OSV查询及可回放报告集成到DSH；漏洞数据库与版本事实属于OSV，插件不创造新漏洞发现。

相对手动逐生态查公告，增量是将多锁文件解析、批量OSV查询及可回放报告集成到DSH；漏洞数据库与版本事实属于OSV，插件不创造新漏洞发现。

transport可注入、分块并发/重试与结构化errors便于复用；自写跨生态版本比较必须保守表达未知。

固定源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/index.ts)、[src/tools/dep-scan.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/tools/dep-scan.ts)、[src/lockfile-parsers.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/lockfile-parsers.ts)、[src/osv-client.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/osv-client.ts)、[src/semver.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/semver.ts)、[src/report.ts](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/src/report.ts)、[package.json](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/blob/db879fc01cd02b9f0821a87ba728a310ae08d9ac/package.json)。

<a id="detail-section-5"></a>

### 主要限制

“确认存在”是否覆盖所有依赖和生态版本？pnpm/yarn行解析、requirements仅==、Maven属性等会跳过；自写semver不等于PyPI/Go/Maven完整排序，无法解析introduce/fixed可能误归类。最低fixed也不一定是当前维护线可安全升级目标，公告命中更不证明代码路径可利用。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：0.1.1；版本日期：2026-08-24（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[db879fc0](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/tree/db879fc01cd02b9f0821a87ba728a310ae08d9ac)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读index、扫描编排、parser、OSV归一/semver和report；未联网或复跑录制fixture。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

待验证假设：报告把解析覆盖/未知版本、生态专属比较和可利用性证据分层，可减少“零漏洞=安全”和跨版本线错误升级。由有限parser/semver推导，未实现完整分层。以预发布、非semver、peer后缀和多修复线对照官方锁解析/公告，测漏包与修复建议错误；未知不能按干净计。

固定多生态fixture与官方解析比对，涵盖非semver/多修复线/网络失败，另测真实OSV；本轮均未执行。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 220 | — | — | 2990 |
| .ts | source | 6 | 2106 | 1586 | 384 | — |
| .ts | test | 1 | 580 | 501 | 42 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-dep-vuln-scan/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
