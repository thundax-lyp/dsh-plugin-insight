# agent-clinic

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e88d6ec](https://github.com/1687210989/agent-clinic/tree/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/agent-clinic)
<!-- END META -->

> **实现功能**：只读扫描本地DSH会话，生成带证据定位的使用问题诊断、配置处方与插件候选，并提供面板和CLI。

> **核心亮点**：把本地事件定位、真实profile当前值和可执行处方联结，撤掉已不弱于建议的动作并保留实例证据，比泛化优化建议更具体；仍属启发式调查流程。详见[Q03](#research-q03)。

> **风险与缺陷**：E1按整会话同参数组筛布尔错误，没有比较错误内容或连续性，却输出连续同错；高输出和跨会话复问也不证明浪费或失忆。web访问控制和默认抄录需独立核对。详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种情况下需要体检，合格诊断是什么？](#detail-section-11)
  - [Q02 · 会话读取、统计信号与证据行如何关联？](#detail-section-12)
  - [Q03 · 相比日志仪表盘与通用建议，贡献是什么？](#detail-section-13)
  - [Q04 · 诊断阈值、推荐及隐私信任有什么关键限制？](#detail-section-14)
  - [Q05 · 安装、采用与恢复的依赖和流程是什么？](#detail-section-15)
  - [Q06 · 总成本和处方效果能推断到哪里？](#detail-section-16)
  - [Q07 · 工程可借鉴处和维护责任是什么？](#detail-section-17)
  - [Q08 · 什么新假设值得继续探讨？](#detail-section-18)
  - [Q09 · 对哪些用户值得试用或暂缓？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人维护者排查失败、Token和资产使用线索，逐条查原日志后决定是否调整；合格交付是可复核候选解释和动作，非自动因果诊断。

手读轨迹、写统计脚本或向Agent要通用优化建议是直接参照；本项目增加定位、配置当前值和处方步骤，不自动证明诊断原因或效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地扫描与统计 | 读取DSH日志形成事件和Token/错误概览 | 需原生zstd，读取/坏帧错误要参与解释 |
| 规则诊断 | 对重复失败、输出、资产与跨会话线索给候选 | 阈值命中不是原因或业务失败证明 |
| 证据展开 | file#L区间与上下文分页 | 原件可变，定位不绑定不可变源摘要 |
| 配置处方 | 当前值、片段、步骤、自否决和反馈 | YAML子集与抄录默认需人工核对 |
| 目录候选 | 本地匹配或显式live查公开元数据 | 未审阅的候选不能视为安全推荐 |
| 模型工具与面板 | 会话内查报告、show与web展示 | tools接口和web访问控制需复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.15且存在原生zstd API | 解析声明必需 | 会话解压 | 明确返回/抛出不支持说明 |
| 可读DSH会话路径与对应格式 | 分析必需 | 生成统一事件 | 读/解析失败保留错误；不能解释为没异常 |
| 本机profile patch及随附默认抄录表 | 配置类处方需要 | 确定当前值与片段 | YAML子集或版本漂移需人工核对 |
| tools.defineTool接口 | 模型工具分支需要 | 注册scan/show/report | 缺接口记录日志并跳过工具注册 |
| webServer与客户端slots/layout/sidebar包 | 面板分支需要 | 三路由与面板 | CLI不因此不可用；访问控制需独立审查 |
| ~/.agent-clinic可写 | 指纹/反馈/目录状态需要 | 本地持久观测 | 指纹可关闭，失败显式提示未判定 |
| npm/GitHub及可能的中继 | 显式live/catalog-sync需要 | 查找插件公开元数据 | 默认本地诊断不依赖联网 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户明确会话和profile范围，选择CLI/Skill或插件 | 不把WorkBuddy部署入口当已支持其会话解析 |
| 运行 | 先本地report，逐条用show展开证据 | 核对读失败、坏帧及阈值含义 |
| 决策 | 人工审核当前值、片段、风险和退出办法 | 只执行明确适用于本机版本的候选动作 |
| 恢复 | 必要时还原配置，重跑对照；清理自有指纹/反馈状态 | 不删除原会话来抹去异常 |

Skill文案要求显式联网，模型工具与默认report本地分析；但web路由是否真实只由授权用户触发不能由按钮设计保证。插件maxSessions作用于scan之后的结果裁剪，不是扫描前的I/O上限。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、会话全量解压和内存，量未测 | 核对数据路径、格式与profile，理解阈值 | 本轮无安装或扫描耗时 |
| 持续使用 | 文件监听、脏状态后全量重扫、指纹与目录状态 | 逐条show复核，判断合理重试及误报 | maxSessions不是读文件上限 |
| 失败恢复 | 解码/目录失败重读、配置回滚和重跑 | 追查证据定位、撤销不合适片段、清自有状态 | 没有自动证明处方有效的验收记录 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 异常调查 | 规则命中附本地locator和上下文展开 | 各指标解释准确性、误报/漏报 |
| 建议具体性 | 真实profile值、自否决与操作片段 | 对任务质量和总费用的改善 |
| 默认本地性 | 本地读取与规则，显式live才查公开元数据 | 实际web访问认证和本机状态隐私 |

处方重跑后“指标不再命中”只说明阈值结果改变，可能因为减少能力、换任务或数据窗口改变，不能直接视为问题解决。比如减少输出或工具数能让某项安静下来，却可能损害合格交付率。缺少价格、任务负载、人工时间与结果对照，不能给节省百分比、回本时间或单位成本。

> **思考**：E1按整会话同参数组筛布尔错误，没有比较错误内容或连续性，却输出连续同错；高输出和跨会话复问也不证明浪费或失忆。web访问控制和默认抄录需独立核对。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地事件定位、真实profile当前值和可执行处方联结，撤掉已不弱于建议的动作并保留实例证据，比泛化优化建议更具体；仍属启发式调查流程。详见[Q03](#research-q03)。

把本地事件定位、真实profile当前值和可执行处方联结，撤掉已不弱于建议的动作并保留实例证据，比泛化优化建议更具体；仍属启发式调查流程。详见[Q03](#research-q03)。

可借鉴的组织是适配层、诊断层、证据展开和处方分离，统一结构化analyze再供Markdown与面板渲染。区间locator解析转发到同一个基础实现，解码后行号口径一致；同类型卡片合并保留instances，避免仅留下不可复核摘要。配置来源和被撤处方显式列出也能让用户知道“没建议”与“没评估”的差别。

维护责任来自多份外部契约。YAML仅支持项目定义子集，随附默认和包默认是手工抄录，不会自动随宿主升级更新；目录元数据、事件格式和web服务接口也需要复核。多帧解码按magic扫描切片，不是完整zstd帧语法解析，坏帧计数能暴露一部分损失，不能单凭存在error字段认定完全保真。

插件web注册调用返回的disposer没有在所读apply中保存，文件watch为模块级单例，apply末尾未见对应生命周期清理。不能据此宣称热卸载一定泄露，但需要核对Cordis所接管资源范围。作者DOM桩与smoke有大量断言，README也明确真实计时、CSS、React并发和网络竞态不在桩覆盖内；本轮只读源码，不运行这些测试或复述徽章为验证结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

E1按整会话同参数组筛布尔错误，没有比较错误内容或连续性，却输出连续同错；高输出和跨会话复问也不证明浪费或失忆。web访问控制和默认抄录需独立核对。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。愿意继续评估的维护者可从离线小范围会话逐条复核开始，先澄清E1真实判据和配置来源；未核对鉴权前不依赖web面板，任何处方均需回滚与任务对照。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持证据到动作的组织贡献；E1同错/连续解释、配置漂移与访问边界仍有限制；反例优先收据为未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SKILL.md、plugin/index.js、src/adapters/dsh.mjs、src/adapters/zstd-frames.mjs、src/evidence/index.mjs、src/diagnostics/index.mjs、src/report.mjs、src/prescriber/index.mjs、src/config/index.mjs、src/privacy/fingerprints.mjs、src/catalog/live.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查Skill/插件入口、会话解码、证据定位、E1/C1/K1/K2代表规则、配置/处方、指纹与live查询；没有声称审计全部22项或执行目标代码，未验证上层访问控制。
- 下一步：进一步探讨可先用正常重试/同参数不同错/成功高输出/模板复问反例核查诊断语义，再核对访问控制并对候选处方作合格任务对照。

**分析版本**

- **仓库**：[1687210989/agent-clinic](https://github.com/1687210989/agent-clinic)
- **版本号**：0.2.0（[固定提交 e88d6ec](https://github.com/1687210989/agent-clinic/tree/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索反例优先的处方评估收据，用固定任务与源摘要同时比较指标、交付质量及人工/费用，避免把不命中当问题解决；未实现。详见[Q08](#research-q08)。

进一步探讨可先用正常重试/同参数不同错/成功高输出/模板复问反例核查诊断语义，再核对访问控制并对候选处方作合格任务对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3768 | — | — | 59546 |
| .js | source | 2 | 2068 | 1705 | 264 | — |
| .mjs | source | 22 | 13435 | 10326 | 2368 | — |
| .mjs | example | 1 | 981 | 695 | 215 | — |
| .mjs | test | 1 | 2101 | 1790 | 206 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+created%3A2026-09-22T04%3A55%3A31.908Z..2026-10-22T04%3A55%3A31.908Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A55%3A31.908Z..2026-10-22T04%3A55%3A31.908Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本本地证据诊断与配置处方的贡献、解释准确性及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种情况下需要体检，合格诊断是什么？

**研究主题**：场景与需求

#### 完整回答

面向持续使用DSH的个人开发者和维护者。当工具失败、上下文变长或Token增多时，用户想知道具体哪里发生过异常、能否复核、现有配置可如何调整。插件把本地会话变成带file#L证据的诊断与处方，也提供CLI和可单独安装的Skill流程。合格输出是可定位的观察、解释边界和带风险/验证方法的候选动作，不是仅给一个总Token数字。

替代办法是手工读日志、写统计脚本或让Agent泛泛建议省Token。本项目具体改变了“发现异常到查原件再决定动作”的组织方式。它不自动执行处方、不代安装，也不诊断代码质量；读者仍要确认阈值命中是否属于自己的任务，复核配置覆盖语义并判断动作是否合适。

“体检”是使用分析比喻，不是一个经校准的原因诊断器。尤其输出多、反复调用或相同问题跨会话出现，都可能有合理任务解释。报告可帮助形成调查线索，不能凭标签就认定模型浪费或长期记忆失效。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:20-40](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/SKILL.md#L20-L40)

作者定义报告、原件复核、可执行处方及不代安装。

<details>
<summary>查看原文（21行）</summary>

```text
## 触发后做什么

1. **出报告**：运行 `./run.sh report`，得到带证据的体检报告（含处方）
2. **复核**：对报告里的任一结论，用 `./run.sh show "<定位符>"` 展开原始记录亲眼确认
3. **只报事实**：没有检测到问题的维度必须显式说明，不要编造问题
4. **给方案**：每条问题至少给一条**可执行**处方；报告末尾另附「省 token 开关清单」（陈列，不是结论）

## 硬性约束

执行本技能时必须遵守：

| 约束 | 说明 |
|---|---|
| **只读** | 绝不修改 `~/.dsh/` 下任何文件（读 profile 配置是为了说出"当前值"，也只读） |
| **零外发（默认）** | 体检本体（scan / diagnose / report / 面板）默认不发送任何内容到外部服务。**联网动作只有两个，都需显式指定**：<br>① `./run.sh catalog-sync` —— 同步插件目录（npm registry + 经 `gh-proxy.com` 中继的 GitHub 公开仓库元数据），不上传任何本地数据；<br>② `./run.sh report --live` —— **发现问题后当场联网现搜插件**（见下） |
| **可定位** | 每个结论必须附 `file#L` 定位，不可复现的结论不出 |
| **未异常要说明** | 没有检测到问题的维度必须显式列出"未检测到异常" |
| **处方必须可执行** | 每条处方必须给出：YAML 片段 / 命令 / 插件安装入口 / 界面路径 / 指向具体动作的建议；并附**分步操作指引**、风险、验证方式、出处 |
| **不编插件** | 只推荐插件目录里的包，且每条都要说明**命中原因**；目录条目三类并标出处（人工核实 / npm 同步 / GitHub 核实），官方内置包单独标注；**热度（star / 下载量）如实展示，只用于同分排序、不参与对症打分**；检索不到就诚实说"无插件可解" |
| **处方有上限** | 默认最多 4 条，每个问题至少 1 条；当前值已经不弱于建议时**撤掉该条**并说明原因；同一个插件只出现一次 |
| **不代安装** | 处方只给命令与片段，由用户自己执行 |
```

</details>

**依据 2 · 源码核查**：[src/report.mjs:10-17](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/report.mjs#L10-L17)

报告要求带证据定位，配置读取支撑当前值而非泛化建议。

```text
 * 硬性要求（任务书 §5.3 / docs/report-format.md）：
 *   1. 每个结论必须带证据定位与复核命令
 *   2. 必须列出「未检测到异常的维度」
 *   3. 必须列出「未实现的维度」—— 不假装全知
 *   4. 零对话原文；证据只给定位符，原文由 show 命令按需展开
 *
 * 2026-10-15 修正：处方不再是"一句正确的废话"。`analyze()` 现在会先读一次
 * 本机真实生效配置（只读），处方因此能说出「当前 12500 → 建议 6000」。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话读取、统计信号与证据行如何关联？

**研究主题**：功能与机制

#### 完整回答

扫描器递归枚举匹配的DSH会话文件，区分目录读取失败与单文件解析失败。parseSession只读文件buffer，decodeFrames以zstd magic寻找切片逐帧解码，拼接文本后按JSONL生成统一事件并保留解码后全局行号。尾部空行处理与证据readRange一致，减少定位偏移。无法解析JSON计badLines，坏压缩帧计badFrames；这些范围信息应参与结论，而不是被当成没有问题。

诊断器从统一事件配对工具调用与结果，按工具名和参数hash分组，或按会话基线、配置资产和跨会话文本指纹生成finding。报告analyze产结构化结果，Markdown与面板分别渲染，不靠客户端重新解析Markdown。证据展开复用同一个decodeFrames与locator解析，输出上下文和分页提示。

固定文件路径与行号能让读者回到本地原始事件，但当前locator未绑定文件内容摘要或历史快照，源文件继续追加/删除或坏帧变化时需重新检查定位。多帧处理是针对作者数据格式的适配，作者463帧成功和本机耗时属于其报告，本轮没有执行解码或复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapters/dsh.mjs:284-318](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/adapters/dsh.mjs#L284-L318)

只读解码与全局行号，明确坏行跳过并计数。

<details>
<summary>查看原文（35行）</summary>

```text
export function parseSession(file) {
  const buf = fs.readFileSync(file); // 只读，绝不写回
  const { frames, badFrames, text, plain } = decodeFrames(buf);

  const rawLines = text.split('\n');
  // 文本以 \n 结尾时 split 会产生一个尾部空串，它不是真实行 —— 去掉，
  // 保证 totalLines 准确，且与 evidence.readRange 的行号完全一致。
  if (rawLines.length && rawLines[rawLines.length - 1] === '') rawLines.pop();

  const events = [];
  let meta = null;
  let sessionId = null;
  let title = null;
  let badLines = 0;
  let unmapped = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const raw = rawLines[i];
    if (!raw.trim()) continue;

    let rec;
    try {
      rec = JSON.parse(raw);
    } catch {
      badLines += 1;
      continue;
    }

    const lineNo = i + 1; // 解码后的全局行号（1-based）

    // header：字段在顶层
    if (rec.type === 'session') {
      meta = { ...rec };
      sessionId = rec.id ?? path.basename(path.dirname(file));
      continue;
```

</details>

**依据 2 · 源码核查**：[src/adapters/dsh.mjs:597-620](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/adapters/dsh.mjs#L597-L620)

目录/解析错误分别保留。

<details>
<summary>查看原文（24行）</summary>

```text
export function scanSessions(opts = {}) {
  const root = resolveSessionsRoot(opts);
  const { files, errors: scanErrors } = findSessionFilesDetailed(root);
  const sessions = [];
  // 目录读取失败与文件解析失败**分开记**：前者让人以为"没数据"，后者让人以为"没问题"
  const errors = scanErrors.map((e) => ({
    kind: 'read',
    file: e.dir,
    code: e.code,
    message:
      e.code === 'EACCES' || e.code === 'EPERM'
        ? `无权限读取目录（${e.code}）`
        : `读取目录失败：${e.message}`,
  }));

  for (const f of files) {
    try {
      sessions.push(parseSession(f));
    } catch (e) {
      errors.push({ kind: 'parse', file: f, code: e?.code ?? null, message: e?.message ?? String(e) });
    }
  }

  return { root, sessions, errors, fileCount: files.length };
```

</details>

**依据 3 · 源码核查**：[src/adapters/zstd-frames.mjs:68-94](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/adapters/zstd-frames.mjs#L68-L94)

magic分片、坏帧计数、明文回退的实际实现。

<details>
<summary>查看原文（27行）</summary>

```text
export function decodeFrames(buf) {
  assertZstdSupport();

  const offsets = findFrameOffsets(buf);

  // 非 zstd：可能是无压缩的明文 .jsonl，原样返回
  if (offsets.length === 0) {
    return { frames: 0, badFrames: 0, text: buf.toString('utf8'), plain: true };
  }

  const parts = [];
  let badFrames = 0;

  for (let i = 0; i < offsets.length; i++) {
    const start = offsets[i];
    const end = i + 1 < offsets.length ? offsets[i + 1] : buf.length;
    try {
      let part = zlib.zstdDecompressSync(buf.subarray(start, end)).toString('utf8');
      // 防御：若帧未以换行结尾，补一个，避免与下一帧首行粘连成坏行
      if (part.length > 0 && !part.endsWith('\n')) part += '\n';
      parts.push(part);
    } catch {
      badFrames += 1; // 坏帧跳过并计数，绝不中断整体扫描
    }
  }

  return { frames: offsets.length, badFrames, text: parts.join(''), plain: false };
```

</details>

**依据 4 · 源码核查**：[src/evidence/index.mjs:36-82](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/evidence/index.mjs#L36-L82)

相同解码及行号口径、区间分页。

<details>
<summary>查看原文（47行）</summary>

```text
export function readRange(file, line, context = 2, endLine = undefined, opts = {}) {
  const buf = fs.readFileSync(file);
  const { text, frames, badFrames, plain } = decodeFrames(buf);
  const all = text.split('\n');
  // 与 adapters/dsh.mjs 保持一致：去掉尾部空串，保证行号严格对齐
  if (all.length && all[all.length - 1] === '') all.pop();

  const end = Number.isInteger(endLine) && endLine > line ? endLine : line;
  for (const n of [line, end]) {
    if (n < 1 || n > all.length) {
      const err = new Error(`行号 ${n} 超出范围（该文件共 ${all.length} 行）`);
      err.code = 'LINE_OUT_OF_RANGE';
      throw err;
    }
  }

  const winStart = Math.max(1, line - context); // 本次请求窗口起点（未翻页时）
  const offset = Math.max(0, Math.trunc(Number(opts.offset) || 0));
  const pageFrom = Math.min(all.length, winStart + offset);
  // 区间跨度大时行数会爆掉：默认上限 200 行（可用 limit 显式调整）
  const MAX_LINES = Math.max(1, Math.trunc(Number(opts.limit) || 0) || 200);
  const wanted = end + context - pageFrom + 1;
  const truncated = wanted > MAX_LINES;
  const to = truncated ? Math.min(all.length, pageFrom + MAX_LINES - 1) : Math.min(all.length, end + context);
  const from = pageFrom;

  const lines = [];
  for (let n = from; n <= to; n++) {
    lines.push({ no: n, text: all[n - 1] ?? '', isTarget: n >= line && n <= end });
  }

  return {
    file,
    from,
    to,
    totalLines: all.length,
    frames,
    badFrames,
    plain,
    lines,
    rangeStart: line,
    rangeEnd: end,
    truncated,
    offset,
    limit: MAX_LINES,
    // 还有多少行没展开（截断后用来说明"下一页从哪开始"）
    remaining: truncated ? Math.max(0, end + context - to) : 0,
```

</details>

#### 缺口

- 未核查复杂压缩帧、部分写入和历史原件删除下定位稳定性。
  **影响**：不能由可点击file#L推断全部日志完整或长期可复核。
  **进一步探讨**：可从损坏帧、追加中快照、原件变更的固定样本入手，同时保存字节摘要并检查定位漂移。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比日志仪表盘与通用建议，贡献是什么？

**研究主题**：贡献与相对优势

#### 完整回答

核心贡献是把“可复核异常线索”和“按本机配置生成的候选动作”连起来。prescriber按指标targets筛选remedy，再以当前配置skipIf撤掉已经不弱于建议的项，保留用户拒绝状态，随后加入目录匹配的未安装插件。不是只把诊断ID映射成一句“建议优化”，而是生成片段、步骤、出处和验证方向。

配置层体现一个具体接线增量。它区分包内默认、随附bundle配置和profile整行config替换，不把覆盖行简单深合并。这使“当前12500建议6000”之类说明至少有本地输入来源。报告按指标合并卡片但保留每处scope与locator，兼顾入口简洁和逐项复核。

相较手写日志脚本，这是一套较完整的调查交付组织；相较自动安装器，它保持人做决策与执行。底层阈值、hash、目录检索和YAML片段都是成熟办法，未识别全球新算法。静态结构支持减少泛化建议的潜力，但没有对照证明处方改善实际任务质量或净成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/prescriber/index.mjs:434-465](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/prescriber/index.mjs#L434-L465)

targets筛选、当前配置自否决、拒绝记录与目录结果。

<details>
<summary>查看原文（32行）</summary>

```text
export function prescribeOne(finding, opts = {}) {
  const ctx = opts.ctx ?? {};
  const snap = ctx.config ?? null;
  const rejected = new Set(opts.rejected ?? []);
  const out = [];

  const candidates = REMEDIES.filter((r) => r.targets.includes(finding.id)).sort(
    (a, b) => (a.priority ?? 99) - (b.priority ?? 99),
  );

  for (const remedy of candidates) {
    const check = selfJustify(remedy, finding.id);
    if (!check.ok) continue;
    // 当前值已经不弱于建议 → 撤掉这条，绝不为了"有话说"而凑数。
    // 注意：**只有真的读到了配置快照**才做这个否决 —— 读不到配置时不该假装知道当前值。
    const skip = snap && typeof remedy.skipIf === 'function' ? remedy.skipIf(snap, finding) : null;
    if (skip) continue;
    const built = buildPrescription(remedy, finding, ctx);
    if (rejected.has(built.targetId)) continue;
    out.push({ ...built, skipped: null });
  }

  // 插件目录检索结果也参与排序：**能动手的排在纯建议前面**
  // （用户明确希望"能省 token 的插件"被建议出来，而不是被一句行为建议盖住）
  const seenIds = new Set(out.map((r) => r.targetId));
  for (const rx of pluginRecommendations(finding, ctx)) {
    if (rejected.has(rx.targetId)) continue;
    if (seenIds.has(rx.targetId)) continue;
    seenIds.add(rx.targetId);
    out.push(rx);
  }

```

</details>

**依据 2 · 源码核查**：[src/config/index.mjs:328-369](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/config/index.mjs#L328-L369)

配置优先级及整行替换语义。

<details>
<summary>查看原文（42行）</summary>

```text
export function readEffectiveConfig(env = process.env) {
  const patch = readProfilePatch(env);
  const patchRows = new Map();
  for (const r of patch.rows) patchRows.set(r.id, r);

  const rows = {};
  for (const shipped of SHIPPED_ROWS) {
    const override = patchRows.get(shipped.id);
    const pkgDefaults = PACKAGE_DEFAULTS[shipped.id] ?? {};
    // 生效值优先级：profile 覆盖 > 随附 bundle config > 包内默认值
    const effective = {};
    for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) effective[k] = v;
    Object.assign(effective, shipped.config);
    let source = 'bundle-default';
    if (override) {
      // 整体替换语义：覆盖行的 config 即最终 config（未写的键回落到包内默认）
      const replaced = {};
      for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) replaced[k] = v;
      Object.assign(replaced, override.config);
      for (const k of Object.keys(effective)) delete effective[k];
      Object.assign(effective, replaced);
      source = 'profile';
    }
    rows[shipped.id] = {
      id: shipped.id,
      name: shipped.name,
      note: shipped.note,
      config: effective,
      bundleConfig: shipped.config,
      profileConfig: override ? override.config : null,
      source,
      disabled: override?.disabled ?? null,
    };
  }

  return {
    patchPath: patch.path,
    patchExists: patch.exists,
    profileDir: patch.profileDir,
    warnings: patch.warnings,
    rows,
  };
```

</details>

**依据 3 · 源码核查**：[src/report.mjs:44-83](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/report.mjs#L44-L83)

合并同指标卡片同时保留instances证据。

<details>
<summary>查看原文（40行）</summary>

```text
export function groupFindings(findings) {
  const byId = new Map();
  for (const f of findings) {
    if (!byId.has(f.id)) byId.set(f.id, []);
    byId.get(f.id).push(f);
  }

  const groups = [];
  for (const [id, list] of byId) {
    const first = list[0];
    const sessions = [...new Set(list.map((f) => f.scope).filter(Boolean))];
    const tools = [...new Set(list.map((f) => f.tool).filter(Boolean))];
    const dangerPatterns = [...new Set(list.flatMap((f) => f.dangerPatterns ?? []))];
    const repeatCount = Math.max(...list.map((f) => f.repeatCount ?? 0)) || null;
    const severity = pickSeverity(list);
    const headline = buildHeadline(id, list, tools);

    const instances = list.map((f) => ({
      scope: f.scope ?? null,
      summary: f.summary,
      impact: f.impact ?? null,
      confidence: f.confidence ?? null,
      evidence: (f.evidence ?? []).map((e) => ({ locator: e.locator, note: e.note ?? null })),
    }));

    // 用于出处方的"聚合 finding"：处方文案对着整体数字说话，
    // 而不是只描述第一个会话（否则合并后会张冠李戴）。
    const meta = {
      id,
      title: first.title,
      category: first.category,
      severity,
      scope: sessions[0] ?? null,
      summary: headline,
      tool: tools[0] ?? null,
      repeatCount,
      dangerPatterns,
      evidence: instances.flatMap((i) => i.evidence).slice(0, 12),
      occurrenceCount: list.length,
      sessions,
```

</details>

#### 缺口

- 没有处方前后同任务、同模型和同预算的效果对照。
  **影响**：只能确认交付组织比通用建议具体，不能确认效果提升。
  **进一步探讨**：可选择一类重复失败任务，将处方与不调整配置的对照并行比较合格率和总成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 诊断阈值、推荐及隐私信任有什么关键限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键的事实/解释边界可从E1看到。实现先按整个会话的同工具同参数分组，再只判断配对结果is_error是否为真；没有比较错误内容，也没有检查这些失败在事件序列里连续发生。因此输出“相同参数连续失败”“同错误”比真实判据更强。它支持重复失败候选，不足以单独证明死循环或没有推进。C1也只是和其他主会话单位请求输出基线比较，源码自己说明输出大未必浪费；confidence常数不能视为校准准确率。

K1用规范化同文本指纹跨会话重复推断疑似失忆，K2以早期没有失败、后来出现失败推断疑似重新排查。重复模板、刻意复问、任务变化均可产生相同信号。指纹不落正文但salt与观测同文件保存，能暴露跨会话相等关系，不能称完全匿名。默认report还可能写指纹文件，所以“只读”具体指原DSH会话，而非零本地写入。

插件report/live/watch路由处理器忽略req，没有插件内方法、Origin或用户身份检查；live虽然UI声称只有按钮触发，HTTP层本身不验证这份意图。上层webServer是否保护仍未知，远程部署不能只依靠“本地分析”标签。live目录候选基于公开元数据且明确未审阅源码，匹配不等于推荐插件已安全或能解决该用户的问题。以上为静态核查，未进行攻击或误报复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/diagnostics/index.mjs:74-110](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/diagnostics/index.mjs#L74-L110)

同参数组中筛is_error，无错误内容比较或连续性判断，却输出更强措辞。

<details>
<summary>查看原文（37行）</summary>

```text
function detectE1(ctx, opts) {
  const minRepeat = opts.minRepeatCount ?? 3;
  const findings = [];

  for (const s of ctx.scan.sessions) {
    const { calls, byId } = pairCalls(s);
    for (const [key, list] of groupIdenticalCalls(calls)) {
      if (list.length < minRepeat) continue;

      // 防误报：只取「同参数 + 同错误」的调用；参数有变化的试错不算
      const errored = list.filter((c) => {
        const r = byId.get(c.tool_call_id);
        return r && r.is_error;
      });
      if (errored.length < minRepeat) continue;

      const toolName = key.split('|')[0];
      const first = errored[0];
      const last = errored[errored.length - 1];
      findings.push({
        id: 'E1',
        title: '死循环',
        category: 'E',
        severity: SEVERITY.HIGH,
        scope: s.sessionId,
        tool: toolName,
        repeatCount: errored.length,
        summary: `${toolName} 用相同参数连续失败 ${errored.length} 次`,
        evidence: [
          {
            locator: `${first.locator}-L${lineOf(last.locator)}`,
            note: `${errored.length} 次同参数同错误的调用`,
          },
          ...errored.map((c) => ({ locator: c.locator, note: `${toolName} 失败` })),
        ],
        impact: `约 ${errored.length} 次无效工具调用`,
        confidence: 0.9,
```

</details>

**依据 2 · 源码核查**：[src/diagnostics/index.mjs:473-481](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/diagnostics/index.mjs#L473-L481)

C1承认产出多不必然浪费，confidence为常数。

```text
      summary:
        `本会话单位请求 output ${num(x.perRequest)}（共 ${num(x.output)} / ${x.requests} 次请求），` +
        `是主会话基线 ${num(useBase)} 的 ${(x.perRequest / useBase).toFixed(1)} 倍（阈值 ${ratio} 倍；` +
        `基线为${selfExcluded ? '排除本会话后的其余主会话' : '全体主会话（可对照样本不足）'}中位值）`,
      evidence: [{ locator: worst.locator, note: `单次 output 最高的一条（${num(worst.output_tokens ?? 0)} token）` }],
      impact:
        `相对基线约多消耗 ${num(Math.round((x.perRequest - useBase) * x.requests))} output token；` +
        `注意：产出量大不必然是浪费，请结合 E1（死循环）/E5（冗余调用）/C2（上下文膨胀）判断`,
      confidence: 0.6,
```

**依据 3 · 源码核查**：[src/privacy/fingerprints.mjs:147-158](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/privacy/fingerprints.mjs#L147-L158)

salt和observations同文件落盘，只读范围不能泛化。

<details>
<summary>查看原文（12行）</summary>

```text
export function saveStore(store, { path: file = STORE_PATH } = {}) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    // 只写我们认识的字段，避免把调用方的临时对象整包落盘
    const payload = {
      version: STORE_VERSION,
      salt: store.salt,
      createdAt: store.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      observations: store.observations ?? {},
    };
    fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
```

</details>

**依据 4 · 源码核查**：[plugin/index.js:487-518](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L487-L518)

report处理器不读取请求作认证或来源判断。

<details>
<summary>查看原文（32行）</summary>

```text
      ws.register({
        kind: 'exact',
        path: '/api/agent-clinic/report',
        handler: async (_req, res) => {
          const send = (code, payload) => {
            const body = JSON.stringify(payload);
            res.writeHead(code, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            });
            res.end(body);
          };
          try {
            // 旋钮同样要生效：面板路由与模型工具必须同一口径
            // （待优化报告 §3：这里是最后一处漏传 opts 的地方）
            // 决策 D4：指纹也要在同一处开（扫描前），否则面板里的 K1/K2 永远不判定
            const fp = beginFingerprintRun();
            const scan = limitSessions(scanSessions({ dshHome: config.dshHome }), config.maxSessions);
            const summary = summarize(scan);
            const ctxReport = { scan, summary };
            const fpOpts = fp.diagnosticOpts(scan);
            const fpData = analyze(ctxReport, { ...analyzeOptsFromConfig(config), ...fpOpts, ...feedbackOpts() });
            const fpNotice = fingerprintNotice(fp.finish(scan));
            send(200, {
              ok: true,
              version: API_VERSION,
              generatedAt: new Date().toISOString(),
              report: buildReport(ctxReport, { ...analyzeOptsFromConfig(config), ...fpOpts, ...feedbackOpts() }),
              data: fpNotice ? { ...fpData, fingerprintNotice: fpNotice } : fpData,
            });
          } catch (e) {
            send(500, { ok: false, error: String(e?.message ?? e) });
```

</details>

**依据 5 · 源码核查**：[plugin/index.js:528-551](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L528-L551)

live处理器可直接触发本地分析和外部检索。

<details>
<summary>查看原文（24行）</summary>

```text
      ws.register({
        kind: 'exact',
        path: '/api/agent-clinic/live',
        handler: async (_req, res) => {
          const send = (code, payload) => {
            const body = JSON.stringify(payload);
            res.writeHead(code, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            });
            res.end(body);
          };
          try {
            // 决策 D4：现搜路径同样要开指纹，否则"点联网现搜后 K1/K2 又不判定"——
            // 同一面板两种口径（与旋钮那处是同一类问题）
            const fp = beginFingerprintRun();
            const scan = limitSessions(scanSessions({ dshHome: config.dshHome }), config.maxSessions);
            const summary = summarize(scan);
            const fpOpts = fp.diagnosticOpts(scan);
            // 现搜也要带上旋钮：否则"点联网后阈值又变回默认"——同一面板两种口径
            const { data, live } = await analyzeLive({ scan, summary }, {
              ...analyzeOptsFromConfig(config),
              ...fpOpts,
              liveOptions: { budgetMs: LIVE_BUDGET_MS },
```

</details>

**依据 6 · 源码核查**：[src/catalog/live.mjs:230-237](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/catalog/live.mjs#L230-L237)

候选元数据来源明确未审阅源码。

```text
    source: {
      type: 'third-party',
      package: slug,
      doc: 'GitHub 仓库（实时检索；只核实仓库存在与元数据，未审阅源码）',
      via: `本次体检联网现搜（匹配式：${query}）`,
      verifiedAt: new Date().toISOString().slice(0, 10),
    },
    risk: `来自 GitHub（未发 npm；只核实了仓库存在与元数据，未审阅源码）。安装需按仓库 README 自行操作：https://github.com/${slug}`,
```

#### 缺口

- 上层webServer访问认证、远程监听配置未核查。
  **影响**：不能确认本地会话报告和live触发的访问边界。
  **进一步探讨**：继续探讨应先核对实际部署鉴权链、匿名请求及跨源触发，再考虑打开web面板。
- E1、C1和K1/K2缺少独立标注任务下的误报/漏报评估。
  **影响**：阈值命中不应直接升级为原因诊断或自动配置动作。
  **进一步探讨**：可按合理重试、任务差异、模板复问等反例组织盲评样本，分开核对观察正确性和解释正确性。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、采用与恢复的依赖和流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.15且存在原生zstd API | 解析声明必需 | 会话解压 | 明确返回/抛出不支持说明 |
| 可读DSH会话路径与对应格式 | 分析必需 | 生成统一事件 | 读/解析失败保留错误；不能解释为没异常 |
| 本机profile patch及随附默认抄录表 | 配置类处方需要 | 确定当前值与片段 | YAML子集或版本漂移需人工核对 |
| tools.defineTool接口 | 模型工具分支需要 | 注册scan/show/report | 缺接口记录日志并跳过工具注册 |
| webServer与客户端slots/layout/sidebar包 | 面板分支需要 | 三路由与面板 | CLI不因此不可用；访问控制需独立审查 |
| ~/.agent-clinic可写 | 指纹/反馈/目录状态需要 | 本地持久观测 | 指纹可关闭，失败显式提示未判定 |
| npm/GitHub及可能的中继 | 显式live/catalog-sync需要 | 查找插件公开元数据 | 默认本地诊断不依赖联网 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户明确会话和profile范围，选择CLI/Skill或插件 | 不把WorkBuddy部署入口当已支持其会话解析 |
| 运行 | 先本地report，逐条用show展开证据 | 核对读失败、坏帧及阈值含义 |
| 决策 | 人工审核当前值、片段、风险和退出办法 | 只执行明确适用于本机版本的候选动作 |
| 恢复 | 必要时还原配置，重跑对照；清理自有指纹/反馈状态 | 不删除原会话来抹去异常 |

Skill文案要求显式联网，模型工具与默认report本地分析；但web路由是否真实只由授权用户触发不能由按钮设计保证。插件maxSessions作用于scan之后的结果裁剪，不是扫描前的I/O上限。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapters/zstd-frames.mjs:20-41](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/adapters/zstd-frames.mjs#L20-L41)

通过API存在性核对原生zstd条件。

<details>
<summary>查看原文（22行）</summary>

```text
/** 运行环境是否支持原生 zstd 解码（Node >= 22.15） */
export function hasZstdSupport() {
  return typeof zlib.zstdDecompressSync === 'function';
}

/**
 * 断言运行环境支持 zstd，否则抛出可操作的错误。
 * 绝不静默降级 —— 缺依赖时必须让用户看见。
 */
export function assertZstdSupport() {
  if (hasZstdSupport()) return;
  throw new Error(
    [
      '运行环境不支持原生 zstd 解码，无法读取 DSH 会话文件。',
      `当前 Node 版本：${process.version}（需要 >= 22.15.0）`,
      '',
      '解决办法（任选其一）：',
      '  1) 升级 Node：nvm install 22 && nvm use 22',
      '  2) 从 https://nodejs.org 安装 22.x LTS 或更高版本',
      '',
      '本工具不会静默跳过无法解码的数据。',
    ].join('\n'),
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:399-429](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L399-L429)

tools接口缺失时跳过，注册scan及dsh_home参数。

<details>
<summary>查看原文（31行）</summary>

```text
  ctx.inject(['tools'], (toolCtx) => {
    let defineTool;
    try {
      // 动态取，避免本地无 peer 时模块导入失败
      ({ defineTool } = toolCtx.tools?.defineTool ? toolCtx.tools : {});
    } catch {
      defineTool = undefined;
    }

    // 若 Harness 未在 ctx.tools 上暴露 defineTool，则退回静态导入路径
    if (typeof defineTool !== 'function') {
      log('ctx.tools.defineTool 不可用，跳过工具注册（请在 DSH 内核对 API）');
      return;
    }

    const TEXT_OUTPUT = {
      schema: { type: 'text' },
      render: (_args, value) => [{ type: 'text', text: String(value) }],
    };

    toolCtx.tools.register(
      defineTool({
        name: 'agent_clinic_scan',
        description:
          '扫描本地 DSH 会话并输出使用概览（会话数、帧、行、工具调用、错误率、token）。只读，零外发。',
        parameters: {
          dsh_home: { type: 'string' },
        },
        output: TEXT_OUTPUT,
        execute(args) {
          return Promise.resolve(runScan({ dshHome: args?.dsh_home ?? config.dshHome }));
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:195-223](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L195-L223)

先scanSessions再limitSessions，且开启指纹本地状态。

<details>
<summary>查看原文（29行）</summary>

```text
function runReport(opts = {}, config = {}) {
  if (!hasZstdSupport()) {
    return `运行环境不支持原生 zstd 解码（需要 Node >= 22.15，当前 ${process.version}）。`;
  }
  const fp = beginFingerprintRun();
  const scan = limitSessions(scanSessions({ dshHome: opts.dshHome }), config.maxSessions);
  const summary = summarize(scan);
  const text = buildReport(
    { scan, summary },
    { ...analyzeOptsFromConfig(config), ...fp.diagnosticOpts(scan), ...feedbackOpts() },
  );
  const notice = fingerprintNotice(fp.finish(scan));
  return notice ? `${text}\n\n> ⚠ ${notice}\n` : text;
}

/** 结构化体检结果（供客户端面板渲染卡片式 UI，避免解析 markdown 文本） */
function runAnalyze(opts = {}, config = {}) {
  if (!hasZstdSupport()) {
    throw new Error(`运行环境不支持原生 zstd 解码（需要 Node >= 22.15，当前 ${process.version}）`);
  }
  const fp = beginFingerprintRun();
  const scan = limitSessions(scanSessions({ dshHome: opts.dshHome }), config.maxSessions);
  const summary = summarize(scan);
  // opts 必须传下去：否则 maxSessions / minRepeatCount 就是"改了没效果"的旋钮
  const data = analyze(
    { scan, summary },
    { ...analyzeOptsFromConfig(config), ...fp.diagnosticOpts(scan), ...feedbackOpts() },
  );
  const notice = fingerprintNotice(fp.finish(scan));
```

</details>

**依据 4 · 作者声明**：[SKILL.md:27-46](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/SKILL.md#L27-L46)

作者明确只读DSH、默认本地、显式联网和环境要求。

<details>
<summary>查看原文（20行）</summary>

```text
## 硬性约束

执行本技能时必须遵守：

| 约束 | 说明 |
|---|---|
| **只读** | 绝不修改 `~/.dsh/` 下任何文件（读 profile 配置是为了说出"当前值"，也只读） |
| **零外发（默认）** | 体检本体（scan / diagnose / report / 面板）默认不发送任何内容到外部服务。**联网动作只有两个，都需显式指定**：<br>① `./run.sh catalog-sync` —— 同步插件目录（npm registry + 经 `gh-proxy.com` 中继的 GitHub 公开仓库元数据），不上传任何本地数据；<br>② `./run.sh report --live` —— **发现问题后当场联网现搜插件**（见下） |
| **可定位** | 每个结论必须附 `file#L` 定位，不可复现的结论不出 |
| **未异常要说明** | 没有检测到问题的维度必须显式列出"未检测到异常" |
| **处方必须可执行** | 每条处方必须给出：YAML 片段 / 命令 / 插件安装入口 / 界面路径 / 指向具体动作的建议；并附**分步操作指引**、风险、验证方式、出处 |
| **不编插件** | 只推荐插件目录里的包，且每条都要说明**命中原因**；目录条目三类并标出处（人工核实 / npm 同步 / GitHub 核实），官方内置包单独标注；**热度（star / 下载量）如实展示，只用于同分排序、不参与对症打分**；检索不到就诚实说"无插件可解" |
| **处方有上限** | 默认最多 4 条，每个问题至少 1 条；当前值已经不弱于建议时**撤掉该条**并说明原因；同一个插件只出现一次 |
| **不代安装** | 处方只给命令与片段，由用户自己执行 |

## 环境要求

- Node ≥ 22.15（原生 zstd 解码）
- **node 不必在 PATH 上** —— `./run.sh` 会自动定位（PATH → WorkBuddy 托管目录 → DSH 运行时 → nvm/volta/fnm 等）
- 若自动定位失败，可用 `AGENT_CLINIC_NODE=/path/to/node` 显式指定
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 总成本和处方效果能推断到哪里？

**研究主题**：效果与总成本

#### 完整回答

单位任务应是定位一个真实使用问题并通过安全调整让同类任务更可靠或总成本更低，而不是报告命中数量。插件本地规则不需要调用外部LLM，但没有因此证明总成本低；读取解压全部会话、人工验证和尝试处方都要计入。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、会话全量解压和内存，量未测 | 核对数据路径、格式与profile，理解阈值 | 本轮无安装或扫描耗时 |
| 持续使用 | 文件监听、脏状态后全量重扫、指纹与目录状态 | 逐条show复核，判断合理重试及误报 | maxSessions不是读文件上限 |
| 失败恢复 | 解码/目录失败重读、配置回滚和重跑 | 追查证据定位、撤销不合适片段、清自有状态 | 没有自动证明处方有效的验收记录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 异常调查 | 规则命中附本地locator和上下文展开 | 各指标解释准确性、误报/漏报 |
| 建议具体性 | 真实profile值、自否决与操作片段 | 对任务质量和总费用的改善 |
| 默认本地性 | 本地读取与规则，显式live才查公开元数据 | 实际web访问认证和本机状态隐私 |

处方重跑后“指标不再命中”只说明阈值结果改变，可能因为减少能力、换任务或数据窗口改变，不能直接视为问题解决。比如减少输出或工具数能让某项安静下来，却可能损害合格交付率。缺少价格、任务负载、人工时间与结果对照，不能给节省百分比、回本时间或单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:195-223](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L195-L223)

完整扫描和分析路径未在扫描前限制maxSessions。

<details>
<summary>查看原文（29行）</summary>

```text
function runReport(opts = {}, config = {}) {
  if (!hasZstdSupport()) {
    return `运行环境不支持原生 zstd 解码（需要 Node >= 22.15，当前 ${process.version}）。`;
  }
  const fp = beginFingerprintRun();
  const scan = limitSessions(scanSessions({ dshHome: opts.dshHome }), config.maxSessions);
  const summary = summarize(scan);
  const text = buildReport(
    { scan, summary },
    { ...analyzeOptsFromConfig(config), ...fp.diagnosticOpts(scan), ...feedbackOpts() },
  );
  const notice = fingerprintNotice(fp.finish(scan));
  return notice ? `${text}\n\n> ⚠ ${notice}\n` : text;
}

/** 结构化体检结果（供客户端面板渲染卡片式 UI，避免解析 markdown 文本） */
function runAnalyze(opts = {}, config = {}) {
  if (!hasZstdSupport()) {
    throw new Error(`运行环境不支持原生 zstd 解码（需要 Node >= 22.15，当前 ${process.version}）`);
  }
  const fp = beginFingerprintRun();
  const scan = limitSessions(scanSessions({ dshHome: opts.dshHome }), config.maxSessions);
  const summary = summarize(scan);
  // opts 必须传下去：否则 maxSessions / minRepeatCount 就是"改了没效果"的旋钮
  const data = analyze(
    { scan, summary },
    { ...analyzeOptsFromConfig(config), ...fp.diagnosticOpts(scan), ...feedbackOpts() },
  );
  const notice = fingerprintNotice(fp.finish(scan));
```

</details>

**依据 2 · 源码核查**：[plugin/index.js:264-277](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L264-L277)

watch脏状态会触发runAnalyze全量分析。

<details>
<summary>查看原文（14行）</summary>

```text
function refreshState(dshHome, config = {}) {
  const data = runAnalyze({ dshHome }, config);
  watchState.signature = signatureOf(data);
  watchState.count = data.findings.length;
  watchState.ids = data.findings.map((f) => f.id);
  watchState.generatedAt = new Date().toISOString();
  return data;
}

/** 轻量状态：签名变了客户端才去拉全量报告，所以要保证它足够便宜 */
function currentState(dshHome, config = {}) {
  if (watchState.dirty || watchState.signature === '') {
    refreshState(dshHome, config);
    watchState.dirty = false;
```

</details>

**依据 3 · 源码核查**：[src/prescriber/index.mjs:104-124](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/prescriber/index.mjs#L104-L124)

处方验证常以重跑指标是否仍命中为起点，不是业务结果验收。

<details>
<summary>查看原文（21行）</summary>

```text
  if (Array.isArray(remedy.steps)) return remedy.steps;
  if (typeof remedy.steps === 'function') return remedy.steps(finding, ctx, action);

  const snap = ctx.config ?? null;
  const verify = remedy.verify
    ? `验证：${remedy.verify}`
    : '验证：重跑 ./run.sh report，看这条指标是否还命中。';

  // --- 改配置：打开文件 → 定位 → 替换/追加 → 保存 → 生效 → 验证 ---
  if (remedy.kind === REMEDY_KIND.CONFIG && remedy.row) {
    const file = action?.file || '~/.dsh/profiles/<profile>/cordis.patch.yml';
    const exists = snap?.patchExists;
    return [
      `用任意文本编辑器打开这个文件：${file}` +
        (exists
          ? ''
          : '　—— 该文件当前不存在，按同样路径新建一个即可（目录 ~/.dsh/profiles/desktop/ 已存在）'),
      `在文件里搜索这一行：- id: ${remedy.row.id}`,
      '分两种情况：① 搜到了 → 用下面的 YAML 片段把它**整段替换**（profile patch 是「整体替换」这一行的 config，没变的键也要一起写进去，缩进保持 2 空格）；② 没搜到 → 把片段**追加到文件末尾**',
      '保存文件。profile 配置默认会热重载；若行为没有变化，完全退出 Harness（从托盘退出，不是关窗口）再重新打开',
      verify,
```

</details>

#### 缺口

- 没有相同任务的处方前后合格率、人工复核与总费用。
  **影响**：不能把指标下降写成效率或经济收益已经验证。
  **进一步探讨**：可将任务交付质量、失败重试和人工时间纳入处方对照，控制模型、输入和窗口。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 工程可借鉴处和维护责任是什么？

**研究主题**：工程质量与复用

#### 完整回答

可借鉴的组织是适配层、诊断层、证据展开和处方分离，统一结构化analyze再供Markdown与面板渲染。区间locator解析转发到同一个基础实现，解码后行号口径一致；同类型卡片合并保留instances，避免仅留下不可复核摘要。配置来源和被撤处方显式列出也能让用户知道“没建议”与“没评估”的差别。

维护责任来自多份外部契约。YAML仅支持项目定义子集，随附默认和包默认是手工抄录，不会自动随宿主升级更新；目录元数据、事件格式和web服务接口也需要复核。多帧解码按magic扫描切片，不是完整zstd帧语法解析，坏帧计数能暴露一部分损失，不能单凭存在error字段认定完全保真。

插件web注册调用返回的disposer没有在所读apply中保存，文件watch为模块级单例，apply末尾未见对应生命周期清理。不能据此宣称热卸载一定泄露，但需要核对Cordis所接管资源范围。作者DOM桩与smoke有大量断言，README也明确真实计时、CSS、React并发和网络竞态不在桩覆盖内；本轮只读源码，不运行这些测试或复述徽章为验证结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/evidence/index.mjs:86-103](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/evidence/index.mjs#L86-L103)

parseRange转发及统一区间读原件。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * 解析 "<file>#L<line>" 或 "<file>#L<start>-L<end>" 形式的定位符。
 *
 * 2026-10-15 决策 D7：这里**不再有第二份解析实现** —— 统一转发给
 * `src/adapters/base.mjs` 的 `parseLocator`（唯一实现，支持区间）。
 * 保留本导出是为了不改动既有调用方（CLI / 插件 / 自检）。
 */
export function parseRange(locator) {
  return parseLocator(locator);
}

/** 把一段定位符渲染成可读的证据块（默认脱敏：超长行截断） */
export function renderEvidence(locator, { context = 2, maxLen = 400, offset = 0, limit = undefined } = {}) {
  const range = parseRange(locator);
  if (!range) throw new Error(`无法解析定位符：${locator}`);

  // 带上区间终点：旧版本只读 range.start，955 行跨度的证据只能看到开头 5 行
  const r = readRange(range.file, range.start, context, range.end, { offset, limit });
```

</details>

**依据 2 · 源码核查**：[src/report.mjs:44-83](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/report.mjs#L44-L83)

实例证据与综合卡片保留关联。

<details>
<summary>查看原文（40行）</summary>

```text
export function groupFindings(findings) {
  const byId = new Map();
  for (const f of findings) {
    if (!byId.has(f.id)) byId.set(f.id, []);
    byId.get(f.id).push(f);
  }

  const groups = [];
  for (const [id, list] of byId) {
    const first = list[0];
    const sessions = [...new Set(list.map((f) => f.scope).filter(Boolean))];
    const tools = [...new Set(list.map((f) => f.tool).filter(Boolean))];
    const dangerPatterns = [...new Set(list.flatMap((f) => f.dangerPatterns ?? []))];
    const repeatCount = Math.max(...list.map((f) => f.repeatCount ?? 0)) || null;
    const severity = pickSeverity(list);
    const headline = buildHeadline(id, list, tools);

    const instances = list.map((f) => ({
      scope: f.scope ?? null,
      summary: f.summary,
      impact: f.impact ?? null,
      confidence: f.confidence ?? null,
      evidence: (f.evidence ?? []).map((e) => ({ locator: e.locator, note: e.note ?? null })),
    }));

    // 用于出处方的"聚合 finding"：处方文案对着整体数字说话，
    // 而不是只描述第一个会话（否则合并后会张冠李戴）。
    const meta = {
      id,
      title: first.title,
      category: first.category,
      severity,
      scope: sessions[0] ?? null,
      summary: headline,
      tool: tools[0] ?? null,
      repeatCount,
      dangerPatterns,
      evidence: instances.flatMap((i) => i.evidence).slice(0, 12),
      occurrenceCount: list.length,
      sessions,
```

</details>

**依据 3 · 源码核查**：[src/config/index.mjs:328-348](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/config/index.mjs#L328-L348)

生效配置构造依赖抄录默认与profile。

<details>
<summary>查看原文（21行）</summary>

```text
export function readEffectiveConfig(env = process.env) {
  const patch = readProfilePatch(env);
  const patchRows = new Map();
  for (const r of patch.rows) patchRows.set(r.id, r);

  const rows = {};
  for (const shipped of SHIPPED_ROWS) {
    const override = patchRows.get(shipped.id);
    const pkgDefaults = PACKAGE_DEFAULTS[shipped.id] ?? {};
    // 生效值优先级：profile 覆盖 > 随附 bundle config > 包内默认值
    const effective = {};
    for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) effective[k] = v;
    Object.assign(effective, shipped.config);
    let source = 'bundle-default';
    if (override) {
      // 整体替换语义：覆盖行的 config 即最终 config（未写的键回落到包内默认）
      const replaced = {};
      for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) replaced[k] = v;
      Object.assign(replaced, override.config);
      for (const k of Object.keys(effective)) delete effective[k];
      Object.assign(effective, replaced);
```

</details>

**依据 4 · 源码核查**：[plugin/index.js:567-591](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L567-L591)

watch路由注册结束未保存disposer，apply无显式总清理返回。

<details>
<summary>查看原文（25行）</summary>

```text
      ws.register({
        kind: 'exact',
        path: '/api/agent-clinic/watch',
        handler: async (_req, res) => {
          const send = (code, payload) => {
            const body = JSON.stringify(payload);
            res.writeHead(code, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            });
            res.end(body);
          };
          try {
            send(200, currentState(config.dshHome, config));
          } catch (e) {
            send(500, { ok: false, error: String(e?.message ?? e) });
          }
        },
      });
      log('已注册只读路由 /api/agent-clinic/watch（轻量状态，供客户端轮询）');
    });
  } catch (e) {
    log(`路由注册失败（不影响其他功能）：${e?.message ?? e}`);
  }
}
```

</details>

#### 缺口

- 宿主是否自动接管路由disposer与fs.watch生命周期未核查。
  **影响**：不能确认热重载、多实例与卸载后的资源行为。
  **进一步探讨**：可从固定Cordis注册和fiber销毁契约入手，再对多次加载/禁用观察路由与watcher数量。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得继续探讨？

**研究主题**：新假设与验证

#### 完整回答

可探索“反例优先的处方评估收据”，保持未验证状态。现有链条能显示规则阈值和当前配置，却容易把指标下降当改善。E1同参数失败不一定连续同错，C1高输出未必浪费，说明在给出动作前显式列合理解释并绑定任务交付标准可能更有价值。

新方案可把每条候选处方关联一份小型对照，固定任务、模型和源日志摘要，记录调整前后合格率、失败重试、费用及人工复核；同时列“只是换了任务”“删掉必要能力”“数据不完整”等反例解释。它不是自动执行器，也不把用户反馈“感兴趣”算作有效。额外收据会增加采集与隐私负担，可能只值得用于高影响配置变更。

最小验证选一组已有人确认原因的重复失败任务，再加入正常重试、成功高输出和模板复问反例，比现有规则+处方与反例收据版的错误建议率、交付质量和操作时间。如果只增加阅读负担而不能减少错误动作，或为规避指标牺牲任务完成，就否定收益主张。本方案未实现，不加入本插件创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/diagnostics/index.mjs:74-110](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/diagnostics/index.mjs#L74-L110)

E1真实判据与更强诊断措辞的差异引出反例需求。

<details>
<summary>查看原文（37行）</summary>

```text
function detectE1(ctx, opts) {
  const minRepeat = opts.minRepeatCount ?? 3;
  const findings = [];

  for (const s of ctx.scan.sessions) {
    const { calls, byId } = pairCalls(s);
    for (const [key, list] of groupIdenticalCalls(calls)) {
      if (list.length < minRepeat) continue;

      // 防误报：只取「同参数 + 同错误」的调用；参数有变化的试错不算
      const errored = list.filter((c) => {
        const r = byId.get(c.tool_call_id);
        return r && r.is_error;
      });
      if (errored.length < minRepeat) continue;

      const toolName = key.split('|')[0];
      const first = errored[0];
      const last = errored[errored.length - 1];
      findings.push({
        id: 'E1',
        title: '死循环',
        category: 'E',
        severity: SEVERITY.HIGH,
        scope: s.sessionId,
        tool: toolName,
        repeatCount: errored.length,
        summary: `${toolName} 用相同参数连续失败 ${errored.length} 次`,
        evidence: [
          {
            locator: `${first.locator}-L${lineOf(last.locator)}`,
            note: `${errored.length} 次同参数同错误的调用`,
          },
          ...errored.map((c) => ({ locator: c.locator, note: `${toolName} 失败` })),
        ],
        impact: `约 ${errored.length} 次无效工具调用`,
        confidence: 0.9,
```

</details>

**依据 2 · 源码核查**：[src/diagnostics/index.mjs:473-481](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/diagnostics/index.mjs#L473-L481)

C1已经承认高输出非浪费，为扩展对照提供线索。

```text
      summary:
        `本会话单位请求 output ${num(x.perRequest)}（共 ${num(x.output)} / ${x.requests} 次请求），` +
        `是主会话基线 ${num(useBase)} 的 ${(x.perRequest / useBase).toFixed(1)} 倍（阈值 ${ratio} 倍；` +
        `基线为${selfExcluded ? '排除本会话后的其余主会话' : '全体主会话（可对照样本不足）'}中位值）`,
      evidence: [{ locator: worst.locator, note: `单次 output 最高的一条（${num(worst.output_tokens ?? 0)} token）` }],
      impact:
        `相对基线约多消耗 ${num(Math.round((x.perRequest - useBase) * x.requests))} output token；` +
        `注意：产出量大不必然是浪费，请结合 E1（死循环）/E5（冗余调用）/C2（上下文膨胀）判断`,
      confidence: 0.6,
```

**依据 3 · 源码核查**：[src/prescriber/index.mjs:104-124](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/prescriber/index.mjs#L104-L124)

重跑指标是当前可执行验证入口，需要业务标准补充。

<details>
<summary>查看原文（21行）</summary>

```text
  if (Array.isArray(remedy.steps)) return remedy.steps;
  if (typeof remedy.steps === 'function') return remedy.steps(finding, ctx, action);

  const snap = ctx.config ?? null;
  const verify = remedy.verify
    ? `验证：${remedy.verify}`
    : '验证：重跑 ./run.sh report，看这条指标是否还命中。';

  // --- 改配置：打开文件 → 定位 → 替换/追加 → 保存 → 生效 → 验证 ---
  if (remedy.kind === REMEDY_KIND.CONFIG && remedy.row) {
    const file = action?.file || '~/.dsh/profiles/<profile>/cordis.patch.yml';
    const exists = snap?.patchExists;
    return [
      `用任意文本编辑器打开这个文件：${file}` +
        (exists
          ? ''
          : '　—— 该文件当前不存在，按同样路径新建一个即可（目录 ~/.dsh/profiles/desktop/ 已存在）'),
      `在文件里搜索这一行：- id: ${remedy.row.id}`,
      '分两种情况：① 搜到了 → 用下面的 YAML 片段把它**整段替换**（profile patch 是「整体替换」这一行的 config，没变的键也要一起写进去，缩进保持 2 空格）；② 没搜到 → 把片段**追加到文件末尾**',
      '保存文件。profile 配置默认会热重载；若行为没有变化，完全退出 Harness（从托盘退出，不是关窗口）再重新打开',
      verify,
```

</details>

#### 缺口

- 反例收据是否减少错误处方而非仅增加文档尚无比较。
  **影响**：仍为研究假设，不能提高现有诊断准确性评分。
  **进一步探讨**：可从已有原因标签的任务样本盲评入手，比较误建议、任务结果和人工操作时间。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对哪些用户值得试用或暂缓？

**研究主题**：采用判断

#### 完整回答

结论为观察。面向愿意读原始日志、理解启发式阈值的个人维护者，它有完整而有价值的证据到动作组织；但E1的同错/连续措辞超出实现、配置默认漂移和web路由访问边界仍会影响正确采用。本轮不把它放进直接试用推荐名单，也不因规则多和徽章高就升级。

继续评估时可先选择离线CLI/Skill、本地最小会话范围，关闭不需要的指纹持久化，逐条核对E1失败是否相同且连续、C1是否只是复杂任务、K1是否为模板复问，再对候选配置作可回滚小范围对照。web面板必须先核对上层认证和监听范围；live检索只表示候选元数据匹配，另装插件仍需独立研究。

如果报告中的读取/坏帧错误不能解释、处方当前值与真实宿主不符、阈值下降但任务质量退步，或网页可被非授权用户读取，则停止依赖该诊断。没有安装、真实宿主核心功能和禁用验收，不给值得安装结论。未来如果规则措辞、配置契约与访问边界澄清，并有任务对照，可重新判断受控试用。

#### 证据与依据

**依据 1 · 源码核查**：[src/diagnostics/index.mjs:74-110](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/diagnostics/index.mjs#L74-L110)

关键诊断措辞超出同参数布尔失败分组。

<details>
<summary>查看原文（37行）</summary>

```text
function detectE1(ctx, opts) {
  const minRepeat = opts.minRepeatCount ?? 3;
  const findings = [];

  for (const s of ctx.scan.sessions) {
    const { calls, byId } = pairCalls(s);
    for (const [key, list] of groupIdenticalCalls(calls)) {
      if (list.length < minRepeat) continue;

      // 防误报：只取「同参数 + 同错误」的调用；参数有变化的试错不算
      const errored = list.filter((c) => {
        const r = byId.get(c.tool_call_id);
        return r && r.is_error;
      });
      if (errored.length < minRepeat) continue;

      const toolName = key.split('|')[0];
      const first = errored[0];
      const last = errored[errored.length - 1];
      findings.push({
        id: 'E1',
        title: '死循环',
        category: 'E',
        severity: SEVERITY.HIGH,
        scope: s.sessionId,
        tool: toolName,
        repeatCount: errored.length,
        summary: `${toolName} 用相同参数连续失败 ${errored.length} 次`,
        evidence: [
          {
            locator: `${first.locator}-L${lineOf(last.locator)}`,
            note: `${errored.length} 次同参数同错误的调用`,
          },
          ...errored.map((c) => ({ locator: c.locator, note: `${toolName} 失败` })),
        ],
        impact: `约 ${errored.length} 次无效工具调用`,
        confidence: 0.9,
```

</details>

**依据 2 · 源码核查**：[src/config/index.mjs:328-369](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/src/config/index.mjs#L328-L369)

本地配置来源有依据但依赖抄录表。

<details>
<summary>查看原文（42行）</summary>

```text
export function readEffectiveConfig(env = process.env) {
  const patch = readProfilePatch(env);
  const patchRows = new Map();
  for (const r of patch.rows) patchRows.set(r.id, r);

  const rows = {};
  for (const shipped of SHIPPED_ROWS) {
    const override = patchRows.get(shipped.id);
    const pkgDefaults = PACKAGE_DEFAULTS[shipped.id] ?? {};
    // 生效值优先级：profile 覆盖 > 随附 bundle config > 包内默认值
    const effective = {};
    for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) effective[k] = v;
    Object.assign(effective, shipped.config);
    let source = 'bundle-default';
    if (override) {
      // 整体替换语义：覆盖行的 config 即最终 config（未写的键回落到包内默认）
      const replaced = {};
      for (const [k, v] of Object.entries(pkgDefaults)) if (!k.startsWith('_')) replaced[k] = v;
      Object.assign(replaced, override.config);
      for (const k of Object.keys(effective)) delete effective[k];
      Object.assign(effective, replaced);
      source = 'profile';
    }
    rows[shipped.id] = {
      id: shipped.id,
      name: shipped.name,
      note: shipped.note,
      config: effective,
      bundleConfig: shipped.config,
      profileConfig: override ? override.config : null,
      source,
      disabled: override?.disabled ?? null,
    };
  }

  return {
    patchPath: patch.path,
    patchExists: patch.exists,
    profileDir: patch.profileDir,
    warnings: patch.warnings,
    rows,
  };
```

</details>

**依据 3 · 源码核查**：[plugin/index.js:487-518](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/plugin/index.js#L487-L518)

路由访问控制需要上层契约。

<details>
<summary>查看原文（32行）</summary>

```text
      ws.register({
        kind: 'exact',
        path: '/api/agent-clinic/report',
        handler: async (_req, res) => {
          const send = (code, payload) => {
            const body = JSON.stringify(payload);
            res.writeHead(code, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            });
            res.end(body);
          };
          try {
            // 旋钮同样要生效：面板路由与模型工具必须同一口径
            // （待优化报告 §3：这里是最后一处漏传 opts 的地方）
            // 决策 D4：指纹也要在同一处开（扫描前），否则面板里的 K1/K2 永远不判定
            const fp = beginFingerprintRun();
            const scan = limitSessions(scanSessions({ dshHome: config.dshHome }), config.maxSessions);
            const summary = summarize(scan);
            const ctxReport = { scan, summary };
            const fpOpts = fp.diagnosticOpts(scan);
            const fpData = analyze(ctxReport, { ...analyzeOptsFromConfig(config), ...fpOpts, ...feedbackOpts() });
            const fpNotice = fingerprintNotice(fp.finish(scan));
            send(200, {
              ok: true,
              version: API_VERSION,
              generatedAt: new Date().toISOString(),
              report: buildReport(ctxReport, { ...analyzeOptsFromConfig(config), ...fpOpts, ...feedbackOpts() }),
              data: fpNotice ? { ...fpData, fingerprintNotice: fpNotice } : fpData,
            });
          } catch (e) {
            send(500, { ok: false, error: String(e?.message ?? e) });
```

</details>

**依据 4 · 作者声明**：[SKILL.md:33-40](https://github.com/1687210989/agent-clinic/blob/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4/SKILL.md#L33-L40)

作者将执行和安装决策留给人，适合作为候选调查流程。

```text
| **只读** | 绝不修改 `~/.dsh/` 下任何文件（读 profile 配置是为了说出"当前值"，也只读） |
| **零外发（默认）** | 体检本体（scan / diagnose / report / 面板）默认不发送任何内容到外部服务。**联网动作只有两个，都需显式指定**：<br>① `./run.sh catalog-sync` —— 同步插件目录（npm registry + 经 `gh-proxy.com` 中继的 GitHub 公开仓库元数据），不上传任何本地数据；<br>② `./run.sh report --live` —— **发现问题后当场联网现搜插件**（见下） |
| **可定位** | 每个结论必须附 `file#L` 定位，不可复现的结论不出 |
| **未异常要说明** | 没有检测到问题的维度必须显式列出"未检测到异常" |
| **处方必须可执行** | 每条处方必须给出：YAML 片段 / 命令 / 插件安装入口 / 界面路径 / 指向具体动作的建议；并附**分步操作指引**、风险、验证方式、出处 |
| **不编插件** | 只推荐插件目录里的包，且每条都要说明**命中原因**；目录条目三类并标出处（人工核实 / npm 同步 / GitHub 核实），官方内置包单独标注；**热度（star / 下载量）如实展示，只用于同分排序、不参与对症打分**；检索不到就诚实说"无插件可解" |
| **处方有上限** | 默认最多 4 条，每个问题至少 1 条；当前值已经不弱于建议时**撤掉该条**并说明原因；同一个插件只出现一次 |
| **不代安装** | 处方只给命令与片段，由用户自己执行 |
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
