# dsh-chinese-traditional-wisdom-skill

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[0e0804f](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/tree/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill) [![npm 30d 1,146](https://img.shields.io/static/v1?label=npm+30d&message=1%2C146&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-chinese-traditional-wisdom-skill) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dhicoc/dsh-chinese-traditional-wisdom-skill)
<!-- END META -->

> **功能**：将玄枢传统文化 Skill、本地 TypeScript 计算和结构化事实核验资源封装进 DSH。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)确认贡献是把玄枢技能与本地资源通过DSH provider暴露，并保留结构化计算和核验流程。适配器未创造排盘算法或自动强制核验，独立文化/科学效果均无证据。

> **主要限制**：[Q03](#research-q03)表明claims一致性不是现实预测有效性，也不证明全条对话隐私。实际调用与核验仍依赖Agent遵循流程，不能用32项CLI或本地计算主张代替自主执行验收。

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
  - [Q01 · DSH包装为哪类用户增加了什么？](#detail-section-11)
  - [Q02 · 技能加载后会自动注册32个模型工具吗？](#detail-section-12)
  - [Q03 · claims通过、真太阳时与本地优先分别证明什么？](#detail-section-13)
  - [Q04 · 装包与完成可复核文化计算之间还有哪些投入？](#detail-section-14)
  - [Q05 · 哪项工程边界值得复用，如何验证其价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为明确学习传统文化或比较本地规则计算的人，在DSH发现玄枢技能和资源；不为普通人生问题自动提供术数解释，也不支持专业决策保证。

相对手动复制上游Skill，减少发现与资源定位拼接；上游玄枢内容和引擎不是DSH包装原创。相对直接问模型，要求本次确定性结果而非凭记忆填值，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| DSH技能provider | 发现主Skill与相对资源 | 包装适配，不自动注册32个模型工具 |
| 本地计算CLI资源 | 按明确输入执行传统规则计算 | 需独立Node/pnpm依赖，算法未全面独立核验 |
| 结构化claims核验 | 比较本次结果与字段断言 | 部分工具无verifier，不核验自由解释或现实效果 |
| 脱敏结果包 | 交接已核验facts和provenance | 无原始输入且不可replay，不是加密认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills服务及根包peer | 技能发现必需 | 注册provider | 装包不保证引擎已可运行 |
| Node24.12至24.x、pnpm10.26.1及visual依赖 | CLI计算必需 | tsx与本地引擎 | 根包Node>=20声明不足以运行全部资源 |
| 宿主执行/文件能力与Agent遵循规则 | 对话计算必需 | 输入、调用及claims核验 | 不自动注册CLI为模型工具，也不强制报告门禁 |
| 可靠地点历史时区资料 | 真太阳时才需 | 外部事实前提 | 不可核实时只可显式确认民用降级 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 加载 | 宿主发现provider并读取Skill及RULES | 确认明确文化请求，不自动术数化普通问题 |
| 准备 | 用户补必要输入，Agent配置CLI依赖 | 不猜出生时间，缺输入追问 |
| 计算核验 | Agent运行engine后独立verify | 同本次成功envelope且claims通过；两次失败停止 |
| 交付退出 | 分开事实、解释与现实边界 | 不保证预测，清理临时输入并可禁用provider |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 依赖下载、本地运行、宿主模型费用未知 | 配置Node/pnpm、定位资源、核对输入 | 未执行完整配置 |
| 持续 | 模型解释与本地计算资源未知 | 每次补输入、运行和核验；时区需外部查证 | 不能从本地推断免费或节时 |
| 失败恢复 | 重试与排障资源未知 | 两次失败停止，保留脱敏原因不猜结果 | 无端到端恢复案例 |
| 退出 | 清理临时输入与禁用provider成本未知 | 返回上游文档或独立引擎 | 脱敏结果包不可直接replay |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主适配 | provider暴露Skill和资源 | DSH实际加载与Agent遵循 |
| 可追溯事实 | CLI解析、tool身份与claims校验 | 具体算法独立正确性及报告事实泄漏 |
| 文化解释 | Skill要求与结构事实分开 | 现实效果与科学预测均不能由校验推出 |

> **思考**：[Q03](#research-q03)表明claims一致性不是现实预测有效性，也不证明全条对话隐私。实际调用与核验仍依赖Agent遵循流程，不能用32项CLI或本地计算主张代替自主执行验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)确认贡献是把玄枢技能与本地资源通过DSH provider暴露，并保留结构化计算和核验流程。适配器未创造排盘算法或自动强制核验，独立文化/科学效果均无证据。

[Q02](#research-q02)、[Q03](#research-q03)的parser、tool身份、无verifier拒绝和脱敏结果包是清楚的接口边界；资源来自玄枢，provider只负责发现。规则文字不等于执行门禁，最终报告仍需核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)表明claims一致性不是现实预测有效性，也不证明全条对话隐私。实际调用与核验仍依赖Agent遵循流程，不能用32项CLI或本地计算主张代替自主执行验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

先阅读Skill和RULES，把目标限定为文化学习或核验流程研究；优先用不含个人身份的公开fixture查一个已有verifier的工具。先补齐CLI依赖，再记录真实结果与claims，不拿文档示例当本次计算。出现缺输入靠猜、模型补造或把解释当预测就停止；退出时清理临时输入并禁用provider。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查DSH provider与本地计算/核验关键接线，未运行宿主、引擎或独立算法对照。强制事实门禁是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、skills/SKILL.md、skills/RULES.md、skills/apps/visual/package.json、skills/apps/visual/scripts/run-engine.ts、skills/apps/visual/scripts/run-engine-agent.ts、skills/apps/visual/src/legacy/directRunner.ts、skills/apps/visual/src/legacy/localToolRegistry.ts、skills/apps/visual/src/legacy/localClaimVerifier.ts、skills/apps/visual/src/legacy/resultBundle.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码检查包装provider、Skill规则、CLI调度、claims与结果包、真太阳时前提；未审计每个引擎、Dashboard全功能或全部古籍资料。
- 下一步：未运行目标代码、测试、安装、引擎、Dashboard或个人数据；只有源码与作者声明。未验证预测有效性、具体算法完整性、实际宿主兼容或全链路隐私。

**分析版本**

- **仓库**：[dhicoc/dsh-chinese-traditional-wisdom-skill](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill)
- **版本号**：1.3.0（[固定提交 0e0804f](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/tree/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b)）
- **版本日期**：2026-10-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证方向，为一个非敏感、已有verifier的任务绑定本轮执行摘要与claims门禁，再允许输出“本次计算事实”。比较未验证事实泄漏、误拒和人工恢复成本，不改善或恢复过重即否定；不扩展为传统解释现实效果保证。

未运行目标代码、测试、安装、引擎、Dashboard或个人数据；只有源码与作者声明。未验证预测有效性、具体算法完整性、实际宿主兼容或全链路隐私。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 16 | 2176 | 1874 | 115 | — |
| .js | source | 3 | 183 | 160 | 16 | — |
| .md | source | 67 | 16732 | — | — | 260183 |
| .ts | test | 93 | 10154 | 8715 | 328 | — |
| .ts | source | 159 | 24370 | 20166 | 2286 | — |
| .tsx | test | 16 | 1692 | 1443 | 30 | — |
| .tsx | source | 76 | 17560 | 15836 | 928 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分DSH适配、本地引擎与claims核验的贡献及采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH包装为哪类用户增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它适合明确学习传统文化术语、比较规则或研究可追溯本地计算的用户。README把玄枢Skill打包为DSH Cordis插件；lib/index实际只注册skills provider，将同包SKILL.md及资源暴露给宿主。相对手动复制提示词，增量是可发现的技能入口、相对资源目录和整套本地工具材料。相对直接使用上游玄枢，它不是重新发明排盘或计算算法，贡献应归于宿主适配和打包。

作者README泛称人生困惑等会触发，但固定SKILL明确只对用户显式请求传统文化或计算进入；普通人生、医疗、财务建议不应自动套入术数。本次判断以实际Skill规则收窄场景。合格交付是本次规则计算的结构化事实与文化解释分开，不能把规则内部一致性当现实预测正确。需要科学预测或专业决策支持的人不应以它替代相应方法。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-30](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/README.md#L19-L30)

作者说明包装归属、上游内容与用途边界。

<details>
<summary>查看原文（12行）</summary>

```text
## 这是什么

本仓库是一个 **dsh Cordis 插件**（由 `skill2dsh` 生成），它把 Skill `chinese-traditional-wisdom-ai-agent-workflow`（产品名 **玄枢**）原样打包进 dsh。装上之后，当你在 dsh 里提出人生困惑、健康调养、事业决策、婚恋、择居、占问或传统文化相关问题时，dsh 会加载这个 Skill，由 AI Agent 按 `SKILL.md` 的路由规则调用**本地确定性引擎**完成排盘与推演，再分层输出事实、文化解释与现实建议。

**玄枢**本身是一个本地优先的传统文化参考工具：

- 核心计算（八字、紫微、六爻、梅花、奇门、大六壬、太乙、五运六气、体质、风水、姓名等）在**本地纯 TypeScript 引擎**中运行，不把完整生辰上传到远端。
- 模型**不自行推演或补全**干支 / 数值；所有确定性事实来自本次本地引擎结果（`ToolEnvelope`）。
- 输出严格区分「本地计算事实 / 传统文化解释 / 现实行动建议 / 免责声明」四层，避免把文化阐释误当确定结论。
- 附带一个 **Dashboard**（24 个工作区），可本地浏览盘面、修改输入并查看可视化结果。

> ⚠️ 传统文化参考，非绝对预测。本插件不构成医疗诊断、投资建议或现实结果保证。详见下方「使用边界」。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:49-92](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/lib/index.js#L49-L92)

provider提供技能描述、资源目录和正文，apply只注册provider。

<details>
<summary>查看原文（44行）</summary>

```text
const provider = {
  name: 'chinese-traditional-wisdom-skill',
  list() {
    const files = [];
    walk(SKILLS_ROOT, files);
    const byName = new Map();
    for (const f of files) {
      const raw = fs.readFileSync(f, 'utf8');
      const fm = parseFrontmatter(raw);
      let name = (fm.name || '').trim().replace(/^["']|["']$/g, '');
      const description = (fm.description || '').trim();
      const rel = path.relative(SKILLS_ROOT, f);
      const cand = {
        name: name || path.basename(path.dirname(f)),
        description,
        invocation: { modelInvocable: true, userInvocable: true },
        provider: provider.name,
        source: 'bundled',
        resourceBase: { kind: 'directory', path: path.dirname(f) },
        rank: 0,
        locator: pathToFileURL(f),
        metadata: fm,
      };
      const prev = byName.get(cand.name);
      if (!prev || rel.split(path.sep).length < prev._rel.split(path.sep).length) {
        cand._rel = rel;
        byName.set(cand.name, cand);
      }
    }
    const list = [];
    for (const c of byName.values()) { delete c._rel; list.push(c); }
    return Promise.resolve(list);
  },
  async get(candidate) {
    const p = fileURLToPath(candidate.locator);
    const raw = fs.readFileSync(p, 'utf8');
    const m = raw.match(/^---[\r\n][\s\S]*?[\r\n]---[\r\n]?/);
    const content = m ? raw.slice(m[0].length) : raw;
    return Object.assign({}, candidate, { content });
  },
};

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider);
```

</details>

**依据 3 · 源码核查**：[skills/SKILL.md:30-38](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/SKILL.md#L30-L38)

实际触发规则比README泛化描述更窄。

```text
## 1. 三路分流

先判定请求属于哪条路径，不要把普通人生问题自动术数化：

1. **文化知识**：用户询问经典、思想、历史或术语时，读取 reference、古籍和知识库；没有确定性计算就不调用排盘引擎。
2. **传统计算**：只有用户明确请求排盘、起卦、择日、体质问卷或本地传统计算时，才进入工具、claims 校验和分层输出。
3. **高风险现实问题**：医疗急症、自伤风险、投资借贷、法律事项、结构性房屋改造或未授权第三人分析，先给专业转介和边界提示；仅在用户仍明确要求时补充文化背景，不给现实效果保证。

普通医疗、法律、财务、心理、关系或职场建议应优先使用现实信息和专业支持。传统文化内容不得替代急救、诊断、治疗、持牌财务意见或建筑安全评估。
```

#### 缺口

- 没有用户的重复文化学习需求和对手动加载的操作成本对照。
  **影响**：不能凭领域广度判定采用必要性或市场机会。
  **进一步探讨**：选明确文化学习任务，比较手动阅读原技能与宿主发现后的完成和复核负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 技能加载后会自动注册32个模型工具吗？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

不会从包装入口自动得到32个宿主模型工具。provider递归寻找SKILL.md、按名称去重并优先较浅路径，get读取正文并去掉frontmatter；只有ctx.skills.registerProvider接线，没有ctx.tools注册。32项是资源内的CLI registry，Agent需要已有shell/文件工具执行指定命令并按Skill继续核验，不能把CLI数量当模型已挂载工具数量。

执行链路是CLI读取JSON并交给runLocalTool；后者parseLocalToolCall解析后按LOCAL_TOOL_RUNNERS分派并附provenance。核验是另一个CLI子命令读取结果envelope和claims，检查结果成功及tool身份后调用对应validator。输入不合法、引擎失败和不支持verifier都有明确错误，但自动先执行后核验的端到端约束主要依靠Skill和Agent遵循；普通engine输出并不强制随即verify。

这比模型凭记忆填干支更可追溯，却不保证Agent必定调用命令或不编写超出claims的解释。包内测试声明不是本次运行证据；未在宿主装载或执行引擎，实际接入仍是未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:49-92](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/lib/index.js#L49-L92)

技能provider实际接线，无模型工具注册。

<details>
<summary>查看原文（44行）</summary>

```text
const provider = {
  name: 'chinese-traditional-wisdom-skill',
  list() {
    const files = [];
    walk(SKILLS_ROOT, files);
    const byName = new Map();
    for (const f of files) {
      const raw = fs.readFileSync(f, 'utf8');
      const fm = parseFrontmatter(raw);
      let name = (fm.name || '').trim().replace(/^["']|["']$/g, '');
      const description = (fm.description || '').trim();
      const rel = path.relative(SKILLS_ROOT, f);
      const cand = {
        name: name || path.basename(path.dirname(f)),
        description,
        invocation: { modelInvocable: true, userInvocable: true },
        provider: provider.name,
        source: 'bundled',
        resourceBase: { kind: 'directory', path: path.dirname(f) },
        rank: 0,
        locator: pathToFileURL(f),
        metadata: fm,
      };
      const prev = byName.get(cand.name);
      if (!prev || rel.split(path.sep).length < prev._rel.split(path.sep).length) {
        cand._rel = rel;
        byName.set(cand.name, cand);
      }
    }
    const list = [];
    for (const c of byName.values()) { delete c._rel; list.push(c); }
    return Promise.resolve(list);
  },
  async get(candidate) {
    const p = fileURLToPath(candidate.locator);
    const raw = fs.readFileSync(p, 'utf8');
    const m = raw.match(/^---[\r\n][\s\S]*?[\r\n]---[\r\n]?/);
    const content = m ? raw.slice(m[0].length) : raw;
    return Object.assign({}, candidate, { content });
  },
};

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider);
```

</details>

**依据 2 · 源码核查**：[skills/apps/visual/scripts/run-engine.ts:33-43](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/scripts/run-engine.ts#L33-L43)

主CLI调用本地runner并以JSON输出或报错。

<details>
<summary>查看原文（11行）</summary>

```text
async function main() {
  const [tool, inputFile] = process.argv.slice(2);
  if (!tool) throw new LocalToolError('INVALID_INPUT', '用法：pnpm engine <tool> <input-json-file>（或将 JSON 传入 stdin）。');
  const result = await runLocalTool(tool, await readInput(inputFile, tool));
  stdout.write(`${JSON.stringify(result)}\n`);
}

main().catch((error: unknown) => {
  stderr.write(`${JSON.stringify(localToolErrorPayload(error))}\n`);
  process.exitCode = 1;
});
```

</details>

**依据 3 · 源码核查**：[skills/apps/visual/src/legacy/directRunner.ts:157-165](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/directRunner.ts#L157-L165)

解析、分派及provenance的实际链路。

```text
export async function runLocalTool(tool: string, rawInput: unknown): Promise<DirectResult> {
  try {
    const { tool: parsedTool, input } = parseLocalToolCall(tool, record(rawInput));
    const result = await LOCAL_TOOL_RUNNERS[parsedTool](input as never);
    return attachLocalProvenance(parsedTool, input, result);
  } catch (error) {
    if (error instanceof LocalToolError) throw error;
    throw asLocalToolError('ENGINE_FAILURE', error, tool);
  }
```

**依据 4 · 源码核查**：[skills/apps/visual/src/legacy/localClaimVerifier.ts:48-81](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/localClaimVerifier.ts#L48-L81)

独立核验的成功envelope、工具身份及字段验证。

<details>
<summary>查看原文（34行）</summary>

```text
export function verifyLocalToolClaims(
  tool: LocalToolName,
  rawEnvelope: unknown,
  rawClaims: unknown,
): PublicClaimVerification {
  const definition = LOCAL_TOOL_REGISTRY[tool];
  if (definition.claimVerifier === 'none') {
    throw new LocalToolError('UNSUPPORTED_INPUT', `${tool} 当前没有公开结构化 claims 校验器。`, tool);
  }
  if (!Array.isArray(rawClaims)) {
    throw new LocalToolError('INVALID_INPUT', 'claims 必须是 JSON 数组。', tool);
  }

  const envelope = object(rawEnvelope, 'envelope') as unknown as ToolEnvelope<unknown>;
  if (envelope.ok !== true || !envelope.data) {
    throw new LocalToolError('INVALID_INPUT', '只能校验本次成功 ToolEnvelope.data。', tool);
  }
  if (envelope.tool !== definition.resultToolId) {
    throw new LocalToolError('INPUT_COMBINATION_INVALID', `envelope.tool=${String(envelope.tool)} 不是 ${tool} 的结果。`, tool);
  }

  const validation = runVerifier(tool, envelope.data, rawClaims) as unknown as {
    valid: boolean;
    violations: Array<{ index: number }>;
  };
  const invalidIndexes = new Set(validation.violations.map(({ index }) => index));
  return {
    valid: validation.valid,
    tool,
    verifiedFacts: rawClaims
      .map((claim, index) => ({ index, claim: object(claim, `claims[${index}]`) }))
      .filter(({ index }) => !invalidIndexes.has(index)),
    violations: validation.violations,
  };
```

</details>

**依据 5 · 源码核查**：[skills/apps/visual/scripts/run-engine-agent.ts:107-127](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/scripts/run-engine-agent.ts#L107-L127)

verify、bundle、present是独立命令。

<details>
<summary>查看原文（21行）</summary>

```text
  const tool = requireTool(toolArg);
  if (command === 'describe') {
    stdout.write(`${JSON.stringify(describeLocalTool(tool))}\n`);
    return;
  }
  if (command === 'verify') {
    const envelope = await readJson(firstPath, 'envelope', tool);
    const claims = await readJson(secondPath, 'claims', tool);
    stdout.write(`${JSON.stringify(verifyLocalToolClaims(tool, envelope, claims))}\n`);
    return;
  }
  if (command === 'bundle') {
    const input = await readJson(firstPath, 'input', tool);
    const claims = secondPath ? await readJson(secondPath, 'claims', tool) : [];
    if (!Array.isArray(claims)) throw new LocalToolError('INVALID_INPUT', 'claims 必须是 JSON 数组。', tool);
    stdout.write(serializeSafeResultBundle(await createSafeResultBundle(tool, input, claims)));
    return;
  }
  if (command === 'present') {
    const input = await readJson(firstPath, 'input', tool);
    stdout.write(`${JSON.stringify(await presentLocalTool(tool, input))}\n`);
```

</details>

#### 缺口

- DSH宿主是否正确加载、Agent是否遵循两步核验链未实际执行。
  **影响**：不能将源码接线等同完整自主Agent已成功办结。
  **进一步探讨**：在后续授权环境观察一次技能发现、真实命令结果与独立verify，再核对最终报告所引事实。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · claims通过、真太阳时与本地优先分别证明什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

claims验证只证明指定结构字段与给定本次envelope一致；没有verifier的registry项会拒绝验证。RULES明确不覆盖自由文本、传统解释、现实效果或专业建议，因此“核验通过”不能证明事件预测或健康结论正确。结果包保存脱敏provenance和已核验facts，inputIncluded与replayable为false；完整性指纹也不能当加密签名或权威认证。

真太阳时路径要求外部核验经度、历史时区与UTC偏移等输入；directRunner会复算resolution和birth一致性，民用降级必须显式确认。它能防止把不一致数据标已核验，但外部证据是否真实仍由用户/Agent负责，不能从字段齐全倒推出正确地点和时区。

本地引擎运行不表示整条对话数据不离开机器。生辰可能已经作为对话输入给所用模型，临时JSON文件也含输入；Skill的不长期记录要求是操作约束，需要宿主、模型与用户共同遵守。资源内脱敏结果包与Dashboard历史规则不能替代对话链路的隐私证明。使用时应只取必要数据，文化解释不应升级为医疗、财务或住房安全结论。

#### 证据与依据

**依据 1 · 源码核查**：[skills/RULES.md:51-69](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/RULES.md#L51-L69)

核验边界明确排除解释与现实效果。

<details>
<summary>查看原文（19行）</summary>

```text
## 6. 本地 claims 校验边界

引擎结果必须保留能力模式：`local-exact` 表示本地精确历法或真实排盘，`local-approx` 表示本地确定性近似规则；两者都不授权模型自行推演。

- `validate*Claims(data, claims)` 是纯本地函数；`data` 必须来自本次同一 `ToolEnvelope`。
- 校验覆盖结构化事实，如柱、宫位、星曜、数值、日期、枚举、映射项与已排序条目。
- 不覆盖自由文本、传统解释、置信说明、应期、策略、综合结论、医疗建议或现实效果。
- 校验返回通过，只可说明“结构化 claims 与本次结果一致”；不得说“自由文本已自动校验”。
- 失败的 claim 必须删除，或从当前结果重新提取；禁止通过换词继续表述为本次计算事实。

| 反模式 | 正确做法 |
|---|---|
| “这个我凭知识能排” | 运行对应本地 Engine/CLI。 |
| 用旧结果支撑本次结论 | 重新运行工具并使用本次 ToolEnvelope。 |
| 把建议、应期或解释放入 claims | claims 仅包含结构化事实；解释明确区分。 |
| 校验失败后软化措辞仍当作事实 | 删除断言或重新提取真实字段。 |
| 声称整段文字已校验 | 仅说明结构化 claims 已核对。 |

最终说明可附最小依据，如：`引擎依据：bazi_calculate（local-exact）；结构化事实已与本次结果核对。` 不暴露内部原始数据或不必要的个人信息。
```

</details>

**依据 2 · 源码核查**：[skills/apps/visual/src/legacy/localClaimVerifier.ts:48-66](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/localClaimVerifier.ts#L48-L66)

none verifier拒绝以及envelope来源检查。

<details>
<summary>查看原文（19行）</summary>

```text
export function verifyLocalToolClaims(
  tool: LocalToolName,
  rawEnvelope: unknown,
  rawClaims: unknown,
): PublicClaimVerification {
  const definition = LOCAL_TOOL_REGISTRY[tool];
  if (definition.claimVerifier === 'none') {
    throw new LocalToolError('UNSUPPORTED_INPUT', `${tool} 当前没有公开结构化 claims 校验器。`, tool);
  }
  if (!Array.isArray(rawClaims)) {
    throw new LocalToolError('INVALID_INPUT', 'claims 必须是 JSON 数组。', tool);
  }

  const envelope = object(rawEnvelope, 'envelope') as unknown as ToolEnvelope<unknown>;
  if (envelope.ok !== true || !envelope.data) {
    throw new LocalToolError('INVALID_INPUT', '只能校验本次成功 ToolEnvelope.data。', tool);
  }
  if (envelope.tool !== definition.resultToolId) {
    throw new LocalToolError('INPUT_COMBINATION_INVALID', `envelope.tool=${String(envelope.tool)} 不是 ${tool} 的结果。`, tool);
```

</details>

**依据 3 · 源码核查**：[skills/apps/visual/src/legacy/resultBundle.ts:34-61](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/resultBundle.ts#L34-L61)

结果包只写脱敏facts/provenance，明确不含原始输入且不可replay。

<details>
<summary>查看原文（28行）</summary>

```text
export async function createSafeResultBundle(tool: LocalToolName, input: unknown, claims: unknown[] = []): Promise<SafeResultBundle> {
  const result = await runLocalTool(tool, input) as ToolEnvelope<unknown> | TrueSolarTimeResolution;
  const definition = LOCAL_TOOL_REGISTRY[tool];
  if (!result.provenance) throw new LocalToolError('ENGINE_FAILURE', '本次结果缺少 provenance。', tool);
  if (definition.resultKind === 'ToolEnvelope' && (result as ToolEnvelope<unknown>).ok !== true) {
    throw new LocalToolError('ENGINE_FAILURE', (result as ToolEnvelope<unknown>).error?.message ?? '本次工具未生成成功结果。', tool);
  }

  let verifiedFacts: unknown[] = [];
  if (claims.length > 0) {
    const verification = verifyLocalToolClaims(tool, result, claims);
    if (!verification.valid) throw new LocalToolError('INPUT_COMBINATION_INVALID', 'claims 含未通过本次结果校验的断言，不能生成结果包。', tool);
    verifiedFacts = verification.verifiedFacts.map(({ claim }) => safeClaim(claim));
  }

  const base: BundleWithoutIntegrity = {
    schemaVersion: '1.0.0',
    tool,
    resultToolId: definition.resultToolId,
    resultVersion: definition.resultKind === 'ToolEnvelope' ? (result as ToolEnvelope<unknown>).version : '1.0.0',
    provenance: result.provenance,
    verifiedFacts,
    limitations: result.provenance.limitations,
    disclaimers: ['本结果包只记录脱敏 provenance 与已核验结构化 facts，不包含传统解释、现实效果保证或原始输入。'],
    inputIncluded: false,
    replayable: false,
  };
  return { ...base, integrity: resultBundleIntegrity(base) };
```

</details>

**依据 4 · 源码核查**：[skills/apps/visual/src/legacy/directRunner.ts:64-98](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/directRunner.ts#L64-L98)

真太阳时复算和民用降级显式确认。

<details>
<summary>查看原文（35行）</summary>

```text
function verifiedTrueSolarResolution(value: unknown): TrueSolarTimeResolution {
  const resolution = value as TrueSolarTimeResolution | undefined;
  if (!resolution?.civilBirth || !resolution.trueSolarBirth || !resolution.location) {
    throw new Error('timeBasis=true-solar-verified 必须提供完整 trueSolarResolution。');
  }
  const recomputed = resolveTrueSolarTime(resolution.civilBirth, resolution.location);
  const keys: Array<keyof TrueSolarTimeResolution> = [
    'trueSolarBirth',
    'longitudeCorrectionMinutes',
    'equationOfTimeMinutes',
    'trueSolarCorrectionMinutes',
    'crossedDate',
    'crossedShichen',
    'crossedZiChu',
    'evidence',
  ];
  if (!keys.every((key) => sameValue(resolution[key], recomputed[key]))) {
    throw new Error('trueSolarResolution 与本地真太阳时复算结果不一致。');
  }
  return recomputed;
}

function timeSource(birth: ParsedBirth, context: TimeSourceContext) {
  if (context.timeBasis === 'civil-unverified') {
    if (context.civilFallbackConfirmed !== true) throw new Error('timeBasis=civil-unverified 必须显式传 civilFallbackConfirmed=true。');
    return { timeBasis: 'civil-unverified', verification: null, notice: '未完成真太阳时复核' };
  }
  if (context.timeBasis === 'true-solar-verified') {
    const resolution = verifiedTrueSolarResolution(context.trueSolarResolution);
    for (const key of TIME_SOURCE_BIRTH_KEYS) {
      if ((birth[key] ?? 0) !== (resolution.trueSolarBirth[key] ?? 0)) throw new Error(`trueSolarBirth 与 birth.${key} 不一致。`);
    }
    return { timeBasis: 'true-solar-verified', verification: resolution };
  }
  throw new Error('涉及八字的工具必须声明 timeBasis。');
```

</details>

**依据 5 · 源码核查**：[skills/SKILL.md:75-85](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/SKILL.md#L75-L85)

外部地点时区核验是明确前提。

<details>
<summary>查看原文（11行）</summary>

```text
## 3. 真太阳时

此链路只用于八字预处理：

1. 收集民用出生记录（公历年月日、时分、性别、可定位出生地）。
2. 在外部可靠来源核验经度、IANA 时区、出生当日 UTC 偏移、夏令时和 `utcOffsetEvidence`；模型不得凭记忆填写。
3. 调用 `resolve_true_solar_time`，直接取得 `trueSolarBirth` 与 `trueSolarResolution`。
4. 真太阳时路径将该出生记录同时作为八字 `birth` 与 `trueSolarBirth` 或 `trueSolarResolution`，并传入 `timeBasis: 'true-solar-verified'`，再解读其返回的 `ToolEnvelope`。
5. 无法可靠核验时，先告知限制；仅在用户知情下使用民用出生记录，传入 `timeBasis: 'civil-unverified'` 与 `civilFallbackConfirmed: true`，并标注“未完成真太阳时复核”。

Dashboard 只能展示核验、待核验和民用降级状态，不能自行猜测地点或历史时区。
```

</details>

**依据 6 · 源码核查**：[skills/RULES.md:3-15](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/RULES.md#L3-L15)

文化与隐私使用规则，不能作为执行层强制证明。

<details>
<summary>查看原文（13行）</summary>

```text
> 每次咨询前必须读取。本系统提供传统文化参考、生活指导与哲学思辨，不是科学预测、医疗诊断或心理治疗。

## 1. 医疗与安全红线

- 涉及健康症状，先建议就医；养生内容仅作文化参考。
- 禁止提供处方、剂量、替代治疗或保证疗效。
- 禁止用命理制造焦虑、恐吓、绝对化吉凶或协助恶意分析他人。

## 2. 隐私与表达

- 完整生辰、具体地点和可识别信息不得写入长期存储、日志或 field-journal。
- 命理报告必须注明“本分析为传统文化视角的文化参考，非绝对预测，请理性看待”。
- 负面解读必须给出建设性、非宿命化的建议。
```

</details>

#### 缺口

- 未独立检查所有传统引擎算法、外部历法资料和真实对话的数据流。
  **影响**：不能声称算法全部正确、科学预测有效或全链路隐私已验收。
  **进一步探讨**：按具体工具选择公开非个人fixture核对独立历法参照，并审查实际模型与日志部署的数据去向。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 装包与完成可复核文化计算之间还有哪些投入？

**研究主题**：效果与总成本、采用判断

#### 完整回答

根包只声明Node>=20及Cordis/DSH skill peer；内嵌visual应用要求Node>=24.12且<25、pnpm10.26.1，Skill要求到apps/visual安装冻结依赖。因此成功装上provider不等于本地引擎已准备好。用户或Agent仍要找到资源目录、补齐输入、选择工具、执行并保存临时envelope/claims、核验，再分层解释；涉及真太阳时还要外部查验地点和历史时区。

现金支出有宿主模型调用、依赖下载和本地运行资源，但没有本次金额与耗时数据；持续成本包括每次输入确认、规则版本和流派差异的记录、输出核对。失败两次应停止盲试，不以模型记忆填结果；退出可禁用provider、返回上游文档或直接使用引擎，按隐私规则清理临时输入，不把脱敏结果包当可重放备份。

采用判断为观察，原因不是所有文化学习都不适用，而是本次只确认适配和局部核验结构，尚未检查具体引擎的独立正确性、宿主调用成功和用户合格结果。若继续研究，优先选一个不含个人身份的历法fixture，完整记录调用与claims；出现缺失输入靠猜、引擎失败后模型补答或把解释当预测时立即停止。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-37](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/package.json#L23-L37)

根包运行时及peer声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "test": "node _selftest.mjs"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-skill": "^0.2.0-rc.2"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-skill": "^0.2.0-rc.2"
  },
  "license": "MIT"
```

</details>

**依据 2 · 源码核查**：[skills/apps/visual/package.json:6-8](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/package.json#L6-L8)

内嵌应用有更高Node与固定pnpm条件。

```text
  "packageManager": "pnpm@10.26.1",
  "engines": {
    "node": ">=24.12.0 <25"
```

**依据 3 · 源码核查**：[skills/SKILL.md:8-28](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/SKILL.md#L8-L28)

运行、验证、Fail-Two和临时结果要求。

<details>
<summary>查看原文（21行）</summary>

````text
## 0. 本地直调前置检查

> **硬规则：模型不得自行推演、排盘、校时、算数、补全干支或把参考文本伪装为本次计算。**

1. 将本文件所在目录记为 `<SKILL_ROOT>`，读取 `RULES.md` 与 `tool-index.md`。
2. 确认 `apps/visual/scripts/run-engine.ts` 存在；需要执行时使用 Node `24.12.x` 与 pnpm `10.26.1`，在 `apps/visual` 运行 `pnpm install --frozen-lockfile`。
3. 选择本地工具后，准备 JSON 输入文件并执行：

```bash
cd apps/visual && pnpm engine <tool> <input-json-file>
```

4. 首次接入或不确定输入契约时，先运行 `pnpm engine:list` 与 `pnpm engine:describe <tool>`。八字可使用 `pnpm engine:present bazi_calculate <input-json-file>` 直接取得隐私安全、已核验的结构化事实；其他工具在 typed presentation 接入前仍按下一步处理。
5. 除 `resolve_true_solar_time` 直接返回 `TrueSolarTimeResolution` 外，CLI 返回 `ToolEnvelope`。只从该次 `ToolEnvelope.data` 提取确定性事实；将 envelope 与最小 claims 分别写入临时 JSON 后，用 `pnpm engine:verify <tool> <envelope-json-file> <claims-json-file>` 核对 registry 已绑定 verifier 的结构化 claims；无 verifier 的工具不得伪造已核验事实。校验通过后才能写成“本次引擎结果”。 不得向用户原样回显整个 `ToolEnvelope`、`input_normalized` 或其他内部原始数据。
6. 引擎失败时遵守 Fail-Two：停止盲目重试，检查输入和备用方案；不要用模型记忆补答。

本地 CLI 与 Dashboard 都使用纯 TypeScript 引擎；32 个 registry 工具经 `parseLocalToolInput()` / `runLocalTool()` 执行一次性契约，独立分析命令经各自输入 parser 调用纯本地引擎，Dashboard 按页面直接调用纯引擎。Python 工具仅可作命令行交叉验证，不是对话计算数据源。

CLI 结果统一附带脱敏 provenance。需要跨会话交接时可运行 pnpm engine:bundle <tool> <input.json> [claims.json]，并用 pnpm engine:bundle:verify <bundle.json> 检查完整性；结果包不含原始输入、不可直接 replay，FNV 指纹不是密码学签名。

Dashboard 本地历史默认不保存。操作后仅生成内存中的脱敏预览，用户主动确认后才写入 localStorage；可设置自动过期或一键清空。导入结果包必须先通过完整性校验，且 `inputIncluded` / `replayable` 均为 false。完整生辰、地点、姓名和原始咨询问题不写入历史，也不提供加密持久化入口。
````

</details>

**依据 4 · 源码核查**：[skills/RULES.md:17-29](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/RULES.md#L17-L29)

失败两次与输入缺失追问规则。

<details>
<summary>查看原文（13行）</summary>

```text
## 3. Fail-Two 规则

同一计算连续失败两次时停止重试：记录脱敏失败原因，检查输入和 `tool-index.md` 的备用路径；若仍不能计算，明确告知当前环境无法产生可复核结果。禁止第三次盲试或凭模型知识补答。

## 4. 输入完备性

| 输入 | 适用场景 | 缺失时处理 |
|---|---|---|
| 出生年月日、历法 | 命理、紫微、流年 | 追问，不猜测 |
| 出生时分 | 依赖时辰的工具 | 追问或改用不依赖时辰的能力；不得默认子时 |
| 性别 | 紫微、八宅等 | 追问 |
| 问题描述 | 所有咨询 | 追问具体目标 |
| 体质、住宅、起卦输入 | 对应场景 | 追问必要字段或缩小结论范围 |
```

</details>

#### 缺口

- 没有端到端合格案例、配置耗时和维护负担记录。
  **影响**：不能以本地或无需专用API推断低成本与可靠采用。
  **进一步探讨**：用单个无个人输入的公开例子记录首次配置、执行、核验和清理，再决定是否扩展领域。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪项工程边界值得复用，如何验证其价值？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

值得借鉴的是将确定性计算、结构化claim一致性检查和自然语言解释分开，并对没有verifier的工具明确拒绝已核验称谓。输入parser、tool identity与结果包脱敏组成了可追溯交接的基础；这些属于包内玄枢资源的工程设计，DSH包装主要负责暴露资源，不应把它们全归于适配器原创。

未验证假设是在DSH层为一个已具verifier的非敏感历法任务增加强制执行记录：只有匹配本轮结果摘要的claims通过才允许最终报告使用“本次计算事实”，而解释仍单独标注。相对当前仅靠Skill提示，它把流程约束变成可观察门禁，但需要宿主工具调用关联、结果摘要和拒绝恢复成本。不能仅靠模型再说一遍规则实现。

最小验证比较当前Skill流程与门禁流程处理同一批正常、缺输入、工具身份错配和虚构claim样本，记录未验证事实进入报告次数、错误拒绝与额外人工修正。若门禁不减少事实泄漏、或代价使合法任务经常无法恢复，就否定该方案。它不验证传统解释的现实有效性，本次没有实施。

#### 证据与依据

**依据 1 · 源码核查**：[skills/apps/visual/src/legacy/localClaimVerifier.ts:48-81](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/localClaimVerifier.ts#L48-L81)

类型、身份与结构化事实核验提供门禁基础。

<details>
<summary>查看原文（34行）</summary>

```text
export function verifyLocalToolClaims(
  tool: LocalToolName,
  rawEnvelope: unknown,
  rawClaims: unknown,
): PublicClaimVerification {
  const definition = LOCAL_TOOL_REGISTRY[tool];
  if (definition.claimVerifier === 'none') {
    throw new LocalToolError('UNSUPPORTED_INPUT', `${tool} 当前没有公开结构化 claims 校验器。`, tool);
  }
  if (!Array.isArray(rawClaims)) {
    throw new LocalToolError('INVALID_INPUT', 'claims 必须是 JSON 数组。', tool);
  }

  const envelope = object(rawEnvelope, 'envelope') as unknown as ToolEnvelope<unknown>;
  if (envelope.ok !== true || !envelope.data) {
    throw new LocalToolError('INVALID_INPUT', '只能校验本次成功 ToolEnvelope.data。', tool);
  }
  if (envelope.tool !== definition.resultToolId) {
    throw new LocalToolError('INPUT_COMBINATION_INVALID', `envelope.tool=${String(envelope.tool)} 不是 ${tool} 的结果。`, tool);
  }

  const validation = runVerifier(tool, envelope.data, rawClaims) as unknown as {
    valid: boolean;
    violations: Array<{ index: number }>;
  };
  const invalidIndexes = new Set(validation.violations.map(({ index }) => index));
  return {
    valid: validation.valid,
    tool,
    verifiedFacts: rawClaims
      .map((claim, index) => ({ index, claim: object(claim, `claims[${index}]`) }))
      .filter(({ index }) => !invalidIndexes.has(index)),
    violations: validation.violations,
  };
```

</details>

**依据 2 · 源码核查**：[skills/apps/visual/src/legacy/resultBundle.ts:34-61](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/skills/apps/visual/src/legacy/resultBundle.ts#L34-L61)

不通过claims拒绝结果包，但普通engine到报告仍靠调用方组织。

<details>
<summary>查看原文（28行）</summary>

```text
export async function createSafeResultBundle(tool: LocalToolName, input: unknown, claims: unknown[] = []): Promise<SafeResultBundle> {
  const result = await runLocalTool(tool, input) as ToolEnvelope<unknown> | TrueSolarTimeResolution;
  const definition = LOCAL_TOOL_REGISTRY[tool];
  if (!result.provenance) throw new LocalToolError('ENGINE_FAILURE', '本次结果缺少 provenance。', tool);
  if (definition.resultKind === 'ToolEnvelope' && (result as ToolEnvelope<unknown>).ok !== true) {
    throw new LocalToolError('ENGINE_FAILURE', (result as ToolEnvelope<unknown>).error?.message ?? '本次工具未生成成功结果。', tool);
  }

  let verifiedFacts: unknown[] = [];
  if (claims.length > 0) {
    const verification = verifyLocalToolClaims(tool, result, claims);
    if (!verification.valid) throw new LocalToolError('INPUT_COMBINATION_INVALID', 'claims 含未通过本次结果校验的断言，不能生成结果包。', tool);
    verifiedFacts = verification.verifiedFacts.map(({ claim }) => safeClaim(claim));
  }

  const base: BundleWithoutIntegrity = {
    schemaVersion: '1.0.0',
    tool,
    resultToolId: definition.resultToolId,
    resultVersion: definition.resultKind === 'ToolEnvelope' ? (result as ToolEnvelope<unknown>).version : '1.0.0',
    provenance: result.provenance,
    verifiedFacts,
    limitations: result.provenance.limitations,
    disclaimers: ['本结果包只记录脱敏 provenance 与已核验结构化 facts，不包含传统解释、现实效果保证或原始输入。'],
    inputIncluded: false,
    replayable: false,
  };
  return { ...base, integrity: resultBundleIntegrity(base) };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:91-93](https://github.com/dhicoc/dsh-chinese-traditional-wisdom-skill/blob/0e0804ff96f0b3021147b5d52f45f77c2d8eb33b/lib/index.js#L91-L93)

宿主适配仅注册provider，新增强制门禁尚未实现。

```text
export function apply(ctx) {
  ctx.skills.registerProvider(() => provider);
}
```

#### 缺口

- 强制门禁对事实泄漏和恢复成本的改善未知。
  **影响**：不能作为现有安全或正确性保证。
  **进一步探讨**：用明确正常与失败样本对照，测事实泄漏、误拒及人工修正，效果不优则否定。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
