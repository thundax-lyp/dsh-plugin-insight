# AI 残渣清运

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[997d95c](https://github.com/1344738825/ai-residue-cleaner/tree/997d95c16a802678b702ba3378ae83c881abeee6)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：按规则把代理副产物移入可恢复回收站，并支持项目结项归档。

> **核心亮点**：相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](#research-q03)

> **风险与缺陷**：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向代理频繁生成探测脚本、备份、日志和缓存的项目，在不直接删除文件的前提下恢复整洁并保留结项清单。 [Q01](#research-q01)

基线是人工清理或一次性脚本；插件增加回收站、保留期和项目结项语义，但必须承担规则维护与恢复检查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 回合清运 | 按规则把副产物移动到分批回收站。 | 仅由固定版本源码确认；运行效果未验证 |
| 项目结项 | 保护开放项目并在关闭时分类归档。 | 仅由固定版本源码确认；运行效果未验证 |
| 恢复与清单 | 记录移动明细并支持还原。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python 3 与项目写权限 | 清运必需 | 运行 cleanup.py、移动和恢复文件 | JS 守则仍可用，清运明确提示失败 |
| ignore/extra/archive 规则 | 安全采用必需 | 区分正式产物、归档与残渣 | 命名误判可能移动有价值文件 |
| `.ai-residue-trash` 空间 | 必需 | 保留批次与清单 14 天 | 磁盘增长或无法恢复 |
| 可回查版本控制/备份 | 强烈建议 | 独立核对误收和引用改写 | 回收站损坏时缺少第二恢复路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 建规则 | 用户维护 ignore、archive 和项目状态 | dry-run 中正式产物不出现 |
| 回合清运 | turn/end 派生 Python 扫描并移动候选 | 生成批次清单且会话不被阻塞 |
| 结项 | 用户执行 close 并核对分类与引用改写 | 成品、归档和报告链接完整 |
| 恢复 | 用户按清单 restore 指定批次 | 文件哈希和原路径恢复；失败时从版本控制取回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python 与回收站磁盘 | 标注 ignore、归档规则并 dry-run | 配置分钟未知 |
| 持续使用 | 每回合目录扫描、移动 I/O、14 天存储 | 阅读清单和抽查正式产物 | 每千文件扫描秒数与移动字节未知 |
| 失败恢复 | 保留重复文件占磁盘 | restore、核对哈希与修复引用 | 误收率和恢复分钟未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可逆清理 | 回收站、批次清单和 restore 机制存在 | 真实仓库恢复成功率 |
| 项目保护 | open 状态跳过，close 分类归档 | 引用改写对复杂 Markdown 的正确率 |
| 安全范围 | 跳过 git、node_modules、嵌套仓库等 | 自定义命名下的误收/漏收率 |

> **思考**：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](#research-q03)

相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 [Q03](#research-q03)

解释器探测、失败提示、敏感目录排除和可逆移动体现防御性设计；后台启动后仍需要结果可观测性与针对真实仓库的误收测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。成功标准是目标残渣召回达到门槛、正式文件零误收、结项引用全部可打开且 restore latest 可恢复；出现一次无法恢复的误收或 detached 清理无清单即停止自动模式。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在带金标准的可丢弃仓库副本中包含正式报告、引用图片、备份、缓存和嵌套仓库；运行 dry-run、普通清理、close、restore，逐文件比对哈希和 Markdown 链接，并记录每千文件扫描秒数、移动字节、误收/漏收和人工分钟。任何正式产物误收且不能完整恢复即否定自动启用。

**分析版本**

- **仓库**：[1344738825/ai-residue-cleaner](https://github.com/1344738825/ai-residue-cleaner)
- **版本号**：0.1.2（[固定提交 997d95c](https://github.com/1344738825/ai-residue-cleaner/tree/997d95c16a802678b702ba3378ae83c881abeee6)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可加入“来源感知清理”，要求候选文件同时满足命名规则和本回合创建记录，再用清单预览训练项目级白名单，降低误收。 [Q08](#research-q08)

在带金标准的可丢弃仓库副本中包含正式报告、引用图片、备份、缓存和嵌套仓库；运行 dry-run、普通清理、close、restore，逐文件比对哈希和 Markdown 链接，并记录每千文件扫描秒数、移动字节、误收/漏收和人工分钟。任何正式产物误收且不能完整恢复即否定自动启用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 196 | — | — | 2872 |
| .js | source | 1 | 231 | 163 | 54 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1344738825/ai-residue-cleaner/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 AI 残渣清运 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向代理频繁生成探测脚本、备份、日志和缓存的项目，在不直接删除文件的前提下恢复整洁并保留结项清单。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是人工清理或一次性脚本；插件增加回收站、保留期和项目结项语义，但必须承担规则维护与恢复检查。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

```text
# AI 残渣清运 (ai-residue-cleaner)

AI 干完活,工地上到处是它留下的东西:探测脚本写了十几个(`_probe2.py`、`_probe3.py`、`_probe4.py`…),渲染出来的图、跑出来的结果、中途备份的目录,全堆在项目根目录。这个插件负责收拾:每回合结束自动把这类副产物收走,收到一个**可逆的回收站**里——不是删除,是移进 `.ai-residue-trash/<批次>/`,带清单,可以还原,14 天后才真删。

它还管两件相关的事:

- **项目制**。开工时用 `/residue-open` 声明一个产出目录,之后所有东西都往里放;没结项之前插件不清理,一切原地保留。结项时用 `/residue-close`:成品按类型归档(文稿、视频成品、音频、图片、数据),报告里引用的图片跟着报告走(引用路径自动改写,报告搬走后照样打得开),`*_results.txt` 这类之后可能还要翻的结果移进 `归档/`(长期保留,不进回收站),剩下的副产物进回收站,最后生成一份《结项清理清单》,写明哪些文件被收走了、收到了哪、去哪找回。
- **少说废话**。每个回合注入一条输出守则:直奔结论和新信息,不复述背景,不写空洞总结。

## 安装

**方式一:作为插件市场添加(ZCode / DeepSeek Harness 系客户端通用)**

客户端打开 **插件市场 → 添加 → 添加插件市场**,粘贴本仓库地址(或克隆到本地后选目录),然后在 **个人 → residue-cleaner-market** 里安装「AI 残渣清运」。

**方式二:Git 仓库直装(桌面端插件页)**

插件页直接粘贴 `https://github.com/1344738825/ai-residue-cleaner`。仓库同时是一个 cordis bundle,会以 Host 插件形式安装。

两种方式的差别:方式一走 Python 会话钩子(Stop / UserPromptSubmit),需要系统有 `python` 命令(3.8+,可执行名不同就改 `hooks/hooks.json` 里的 2 处);方式二走 JS bundle,回合结束时后台调一次 `cleanup.py`,需要**系统里有 Python 3**——插件按 `python3` → `python` → `py`(Windows)顺序自动探测,探不到就跳过清运、写宿主错误日志,并在会话里明确提示一次(不会静默),守则注入始终不受影响。三个斜杠命令(`/residue-open`、`/residue-close`、`/residue-trash`)两种方式都有。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

会话事件在首条消息注入简洁守则，在回合结束派生 Python 清理进程；Python 引擎按忽略规则、项目状态与保留期移动文件并维护批次清单。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对 `find` 加删除脚本，它把自动清理改成可逆移动，并用 open/close 项目状态保护进行中的产出、在结项时分类归档和改写引用。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：规则匹配仍可能把有价值但命名像临时文件的材料移走，后台 detached 进程也无法让当前回合确认最终结果；可恢复降低损失但没有消除误分类。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

宿主 JS 路径依赖 Python 3 和项目目录写权限；清理规则、忽略表与 `.ai-residue.json` 影响结果，嵌套仓库和关键目录显式跳过。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本包括安装 Python 3、审阅默认规则、建立 `.ai-residue-ignore` 和把回收站加入 gitignore；每回合持续成本是一次 detached 清理进程、目录扫描和回收站磁盘增长；失败恢复包括从 manifest 还原误收文件、处理 Python 缺失提示，以及结项后核对改写的文档引用。合格单位是一轮清理后工作区无目标残渣、正式产物未移动且所有引用仍可打开。当前缺少扫描文件数、移动字节、误收率、恢复分钟和 14 天存储峰值。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

#### 缺口

- 缺少真实仓库的候选文件数、扫描耗时、移动字节、误收/漏收率、恢复时间和保留期磁盘占用。
  **影响**：无法判断自动清运是否减少整理时间，或把风险转移到恢复和清单核对。
  **进一步探讨**：选取含已标注正式产物、临时文件和嵌套仓库的副本，先 dry-run 再执行/恢复，统计精确率、召回率、扫描秒数、移动字节与人工核对分钟。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

解释器探测、失败提示、敏感目录排除和可逆移动体现防御性设计；后台启动后仍需要结果可观测性与针对真实仓库的误收测试。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可加入“来源感知清理”，要求候选文件同时满足命名规则和本回合创建记录，再用清单预览训练项目级白名单，降低误收。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合副产物命名规律稳定、能先维护 ignore 且使用版本控制的项目试用；高价值数据目录或命名混乱仓库只运行 dry-run。成功标准是目标残渣召回达到门槛、正式文件零误收、结项引用全部可打开且 restore latest 可恢复；出现一次无法恢复的误收或 detached 清理无清单即停止自动模式。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-residue-cleaner/blob/997d95c16a802678b702ba3378ae83c881abeee6/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI 残渣清运 — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * 与 ZCode CLI 端的 hooks/ Python 钩子同源双端:本 bundle 服务 cordis 系宿主
 * (ZCode 桌面端、dsh),结构对齐 ai-look-up 的既有实践。
 *
 * 职责:
 * - `session/event` `user/message`: 每个会话首条消息注入一次输出守则(agent.inject),
 *   压制复述背景、空洞总结、客套话;
 * - `session/event` `turn/end`: 后台派生进程运行 hooks/cleanup.py 按项目制清运副产物
 *   (detached + stdio ignore,绝不阻塞会话)。
 *
 * 清运引擎是 Python,所以解释器是硬前提:缺 Python 3 时不再静默跳过——写宿主 error
 * 日志,并在会话里提示一次(见 resolvePython / PYTHON_MISSING_NOTICE),
 * 否则用户界面上什么都看不到,会误以为清运成功了。
 *
 * 清运引擎(cleanup.py)自行判断项目状态:未立项/已结项按常规清,项目 open 期间
 * 自动跳过且产出目录受保护——宿主侧无需任何判断逻辑。
 *
 * 扩展点(见 cordis-plugin-development skill,与 ai-look-up 相同):
 * - `session/event`
 * - `agent.inject()`
 */

import { spawn, spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const PLUGIN_ROOT = dirname(fileURLToPath(import.meta.url));
const CLEANUP_SCRIPT = join(PLUGIN_ROOT, 'hooks', 'cleanup.py');

const BREVITY_RULE = '【输出守则】回答直奔结论和新信息:不复述用户已知背景,不写客套话、空洞总结或教学铺垫;能用一句话说清就不用三句;除非用户明确要求,不主动生成报告、总结或逐条复述刚才做过的事。';

const DEFAULTS = {
  enabled: true,
  cleanupOnTurnEnd: true,
  brevityOnFirstMessage: true,
  // 空 = 自动探测:按 PYTHON_CANDIDATES 顺序找第一个可用的 Python 3。
```

</details>

#### 缺口

- 规则在真实混合仓库中的误收率和引用改写正确率未测。
  **影响**：文件移动具有直接副作用，可恢复声明不足以证明安全采用。
  **进一步探讨**：在可丢弃仓库副本中标注金标准，执行 dry-run、清理、结项和 restore，核对文件哈希、链接可达与 git diff。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
