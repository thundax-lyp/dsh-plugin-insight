# BigA

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[90467c3](https://github.com/kobenfang/bigA/tree/90467c38203a942d6fcd587a09a82e1a5760118c)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kobenfang/bigA)
<!-- END META -->

> **功能**：将 A 股观察池与市场摘要 Skill 及其 Python 扫描脚本装入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 将本地股票池、脚本输出和摘要组织成可调用 Skill；行情和搜索仍来自外部。

> **主要限制**：[Q02](#research-q02) 日历失败可能被报成休市，评分权重和区间声明与代码不一致。

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
  - [Q01 · DSH 安装后交付什么，哪些部分由模型与脚本完成？](#detail-section-11)
  - [Q02 · 文档宣称的择时与数据缺失语义能复现吗？](#detail-section-12)
  - [Q03 · 如何在不使用实时信号的情况下评估这套流程？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复制作股票观察池和市场摘要的 DSH 用户。

人工表格、直接运行行情查询脚本和读原始数据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 技能提供 | 载入 BigA 指令及资源 | 模型另行执行 Python |
| 观察池扫描 | 提供市场字段和估分 | 外部数据和规则需独立核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH skills 与 Python | 必需 | 发现指令和执行扫描 | 退回人工表格 |
| 行情、日历和模型信息源 | 实际数据需 | 生成市场摘要 | 明确缺失并停止使用输出 |
| 独立定时器 | 自动推送需 | 运行 DSH 外部任务 | 只手动操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户指定离线测试工作区 | 无真实账户 |
| 对照 | 用户检查估分、缺失和资料 | 规则不一致则不采用 |
| 退出 | 用户禁用 Skill 与另配任务 | 回到人工数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行资源未知 | 配置独立工作区和样例 | 依赖 Python |
| 持续 | 数据与模型费用未知 | 复核数据和规则 | 外部源与模型影响 |
| 失败 | 重复执行成本未知 | 排查网络与误报 | 保留原素材 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 流程组织 | 源码可加载 Skill 和脚本 | 实际复核节时 |
| 摘要字段 | 计算技术和 PE 估分 | 准确性、可复现和行情时效 |

> **思考**：[Q02](#research-q02) 日历失败可能被报成休市，评分权重和区间声明与代码不一致。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将本地股票池、脚本输出和摘要组织成可调用 Skill；行情和搜索仍来自外部。

[Q02](#research-q02) 交易日日历使用布尔值折叠错误，技术分和文档需要契约化对照。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 日历失败可能被报成休市，评分权重和区间声明与代码不一致。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 仅将离线合成样本用于核格式和口径，异常回人工资料核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核 Skill provider、指令和扫描代码；没有运行行情、回测、投资收益或真实宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、SKILL.md、scripts/biga-scan.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 DSH provider、SKILL.md、manifest 和扫描器代表路径。未运行任何源、模型或任务。
- 下一步：离线对照日历失败、缺行情、短 K 线、异常分数和卸载路径。

**分析版本**

- **仓库**：[kobenfang/bigA](https://github.com/kobenfang/bigA)
- **版本号**：1.0.0（[固定提交 90467c3](https://github.com/kobenfang/bigA/tree/90467c38203a942d6fcd587a09a82e1a5760118c)）
- **版本日期**：2026-08-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 统一可核评分和明确未知标志，再测审阅误读及工时；无改善则保持人工。

离线对照日历失败、缺行情、短 K 线、异常分数和卸载路径。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 18 | 14 | 3 | — |
| .md | source | 7 | 443 | — | — | 4598 |
| .js | source | 1 | 85 | 74 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/kobenfang/bigA/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/kobenfang/bigA/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kobenfang/bigA/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：BigA 在 DSH 中实际如何交付数据和评分，能否追溯缺失与口径？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 安装后交付什么，哪些部分由模型与脚本完成？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

BigA 面向反复整理股票观察池和行情摘要的人。根 npm 包通过 manifest 的 dsh.bundle.patch 加载 Cordis 插件，插件入口向 DSH 注册 ctx.skills provider。它作为 DSH bundle 交付一个内置 Skill，list 用 SKILL.md 元数据描述候选，get 返回文档及目录。Host 入口没有注册行情工具或直接执行 Python。真正的行情采集、技术分和 PE 估分由 Python 扫描脚本计算，指令由 Agent 执行，并另行安排网络搜索和综合评分。脚本按 DSH_WORKSPACE 等环境变量找数据，默认找本地 memory，允许用 --codes 临时指定代码。与手写表格或直接运行数据脚本相比，增量主要是可由模型调用的流程和配套模板，并不因此取得预测能力。DSH 定时推送的说明依赖另装 BigTimer，不能把它记作本包已接线的调度。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/README.md#L1-L10)

作者定位为 DSH Skill。

<details>
<summary>查看原文（10行）</summary>

````text
# bigA

Agent Skill for DeepSeek Harness (dsh). See [SKILL.md](SKILL.md).

## 📦 Also on ClawHub (OpenClaw)

This skill is also published on [ClawHub](https://clawhub.ai) for OpenClaw users:

```bash
npx clawhub install biga
````

</details>

**依据 2 · 源码核查**：[package.json:2-19](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/package.json#L2-L19)

固定 manifest 指向 DSH bundle 补丁与 Host 入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "name": "@kobenfang/dsh-biga",
  "version": "1.0.0",
  "description": "Agent Skill for DeepSeek Harness (dsh): biga.",
  "type": "module",
  "main": "lib/index.js",
  "files": [
    "lib",
    "SKILL.md",
    "scripts",
    "references",
    "knowledge",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/cordis.patch.yml#L1-L3)

Cordis 补丁挂载包名对应的 Host 插件。

```text
- insert:
    - id: biga
      name: "@kobenfang/dsh-biga"
```

**依据 4 · 源码核查**：[lib/index.js:49-85](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/lib/index.js#L49-L85)

provider 的实际发现与读取。

<details>
<summary>查看原文（37行）</summary>

```text
const provider = {
  name: PKG.name,
  list() {
    if (!fs.existsSync(SKILL_FILE)) return Promise.resolve([]);
    const raw = fs.readFileSync(SKILL_FILE, 'utf8');
    const fm = parseFrontmatter(raw);
    const name = (fm.name || '').trim().replace(/^["']|["']$/g, '') || 'biga';
    const cand = {
      name,
      description: (fm.description || '').trim(),
      invocation: { modelInvocable: true, userInvocable: true },
      provider: PKG.name,
      source: 'bundled',
      resourceBase: { kind: 'directory', path: SKILL_DIR },
      rank: 0,
      locator: pathToFileURL(SKILL_FILE),
      metadata: fm,
    };
    return Promise.resolve([cand]);
  },
  async get(candidate) {
    const raw = fs.readFileSync(SKILL_FILE, 'utf8');
    return {
      name: candidate.name,
      description: candidate.description,
      body: raw,
      invocation: { modelInvocable: true, userInvocable: true },
      source: 'bundled',
      resourceBase: { kind: 'directory', path: SKILL_DIR },
      metadata: candidate.metadata,
    };
  },
};

export function apply(ctx) {
  return ctx.skills.registerProvider(() => provider);
}
```

</details>

**依据 5 · 作者声明**：[SKILL.md:29-47](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L29-L47)

DSH 与另包调度说明。

<details>
<summary>查看原文（19行）</summary>

```text
> **🌍 环境兼容（OpenClaw / DSH 双端）**
> - **OpenClaw**：脚本在技能目录下执行（`python3 scripts/biga-scan.py`），数据默认 `~/.openclaw/workspace/memory/`，定时推送走 `openclaw cron` + `openclaw message send`。
> - **DSH**：无 `openclaw` CLI，数据走 `$DSH_WORKSPACE/memory`（默认 `~/.dsh/workspace/memory`）；发送类命令自动降级为直接输出。**定时推送请先安装 BigTimer 技能**：`dsh plugin add github:kobenfang/BigTimer`，然后用 `bigtimer.py add` 创建定时任务。


# 📈 BigA · A股智能选股

## 📋 功能概览

BigA 是一款专业的 **A股智能选股与投资分析工具**，集成实时行情、量化评分、技术面分析、短线信号和自动推送，覆盖 A 股全流程投资决策。支持A股基本面筛选、市场情绪判断、分时量能与主力资金流向分析、板块轮动追踪，适合短线择时、量化选股、AI炒股与股票池管理。

**核心功能：**
- **📊 实时行情** — 沪深 A 股、创业板、科创板实时行情查询，支持个股/板块/大盘
- **🎯 智能选股** — 高科技×中小市值×好业绩三层筛选，动态管理 ≤30 支股票池
- **📈 技术面分析** — 自主研发 -10~+10 择时分体系，精准判断买卖时机
- **⭐ 量化评分** — 基本面(25%)+催化剂(25%)+技术面(20%)+热度(30%)，0-100 综合评分
- **🔔 短线信号** — 接近买点、启动信号、入场就绪度、超跌机会等多维度判断
- **⏰ 定时推送** — 每日开盘前瞻(08:30)、盘中异动监控、收盘复盘(15:30)自动推送
- **📉 综合研判** — PE 估值、营收增速、量价关系、均线金叉死叉、板块热度、资金流向
```

</details>

**依据 6 · 作者声明**：[SKILL.md:116-135](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L116-L135)

人工触发时脚本与模型分工。

<details>
<summary>查看原文（20行）</summary>

```text
## 工作流程

> **核心**: 所有主动数据拉取由 `scripts/biga-scan.py` 完成，模型负责组合脚本输出+催化剂搜索+最终评分输出。

**前置检查**：`scripts/biga-scan.py` 启动时自动调用深交所日历 API 判断当天是否为交易日（函数 `is_td()`）。非交易日 JSON 输出 `{"holiday":true}`，--segments 输出 `📅 非交易日`，脚本直接退出不扫描。模型遇到 holiday 标记时：开盘前瞻改外围追踪（美股/A50/汇率），盘中/复盘任务跳过。

### 用户手动触发
1. 检查 `workspace/memory/biga-installed`，不存在则提示安装
2. 读 `workspace/memory/biga-stock-pool.md`，不存在则搜索创建初始池
3. 执行 `python3 scripts/biga-scan.py --segments` 获取股票池分段文本
4. web_search 搜索大盘动态 + 最新催化剂
5. 模型综合：脚本技术面20分+PE15分 + 模型基本面催化剂40分 + 热度25分 → 总分0-100
6. 生成完整内容（不限字数），按推送格式组织
7. **分段推送**：
   - 解析 `---SEGMENT---`，先推送股票池分段
   - 池外关注单独一段，内容更详细（含催化因素、技术面亮点、操作建议）
   - 逐段 `openclaw message send` 发送，段间 `sleep 1.5`
   - **【发送校验】**：推送完成后检查本轮是否调用过 `openclaw message send`，若未曾调用则立即补发完整内容后再输出确认
8. 回复一行确认（如「📈 BigA · 筛选完成 ✅」）
9. **手动触发输出约束**：内容合并≤3段（股票池≤2段+池外1段），总字数≤1200字，搜索精简为1次，避免超时
```

</details>

**依据 7 · 源码核查**：[scripts/biga-scan.py:9-18](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L9-L18)

工作区查找。

<details>
<summary>查看原文（10行）</summary>

```text
OC=shutil.which("openclaw")or""
def _ws():
 for v in ("DSH_WORKSPACE","OPENCLAW_WORKSPACE"):
  if os.environ.get(v): return os.environ[v]
 if os.environ.get("OPENCLAW_GATEWAY_PORT") or os.environ.get("OPENCLAW_SERVICE_KIND"):
  return os.path.expanduser("~/.openclaw/workspace")
 if os.path.isdir(os.path.expanduser("~/.dsh")): return os.path.expanduser("~/.dsh/workspace")
 return os.path.expanduser("~/.openclaw/workspace")
_WM=os.path.join(_ws(),"memory")
K="/tmp/bk"; PP=os.path.join(_WM,"biga-stock-pool.md"); TP=os.path.join(_WM,"biga-technical-data.md")
```

</details>

**依据 8 · 源码核查**：[scripts/biga-scan.py:386-418](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L386-L418)

CLI 数据选项和空池处理。

<details>
<summary>查看原文（33行）</summary>

```text
def main():
 pp=PP;tp=TP;fm=False;sg_f=False;ss_cmd=False;cds=[]
 a2=list(sys.argv[1:]);i=0
 while i<len(a2):
  a=a2[i]
  if a in("--format","-f"): fm=True;a2.pop(i);continue
  if a in("--send-segments",): ss_cmd=True;a2.pop(i);continue
  if a in("--segments","-s"): sg_f=True;fm=True;a2.pop(i);continue
  if a.startswith("--codes="): cds=[c.strip()for c in a.split("=",1)[1].split(",")if c.strip()];a2.pop(i);continue
  if a=="--codes"and i+1<len(a2): cds=[c.strip()for c in a2[i+1].split(",")if c.strip()];a2.pop(i);a2.pop(i);continue
  i+=1
 # 交易日检查：非交易日直接退出
 if not is_td():
  td=datetime.now(C).strftime("%Y-%m-%d")
  if sg_f or fm:
   print(f"📅 非交易日 — {td} A股休市，不做A股分析")
   sys.exit(0)
  else:
   print(json.dumps({"holiday":True,"date":td,"note":"A股休市"},ensure_ascii=False))
   sys.exit(0)
 if ss_cmd and a2:
     # 快速模式：直接发送自定义JSON内容，跳过池读取
     import json as _j
     result = cmd_send_segments(' '.join(a2))
     print(_j.dumps(result, ensure_ascii=False))
     return
 if a2: pp=os.path.expanduser(a2[0])
 if len(a2)>1: tp=os.path.expanduser(a2[1])
 ts=time.time()
 if cds: st=[{"code":re.sub(r"^(sh|sz|bj)","",c.strip()),"note":"","rating":"","biga_score":0,"t":0,"l":""}for c in cds if len(c.strip())>=6]
 else: st=pp_(pp)
 if not st: print(json.dumps({"e":"空池"}));return
 sc=[s["code"]for s in st];qt=fq(sc+[ic for ic,_ in N])
```

</details>

#### 缺口

- 未在真实 Host 调用 provider 或调度
  **影响**：不能保证触发词识别、脚本权限或自动发送
  **进一步探讨**：只以合成素材在离线 profile 验证 Skill 发现和手动调用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档宣称的择时与数据缺失语义能复现吗？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

源码显示多个口径不一致。交易日检查请求深交所 HTTP 接口，任何异常都会返回 false，主流程把 false 输出为休市并正常退出。行情从腾讯 HTTP 请求，失败补拉新浪 HTTP，缺值还可能在最终报告用 0 代入，网络故障与真实数据状态易混。技术分文档称 -10 到 +10；ct 的技术分由趋势 -2 至 +4、涨跌分 +2 至 +5、量比 +2 至 +4 相加，代码返回未截断，理论算式不支持同一宣称。K 线不足时二十日均线直接复用五日均线，趋势信号退化。SKILL 概览、评分表和手动流程又给出不同的综合权重，脚本只输出技术和 PE 的估分，剩余由模型。可核的只是计算规则和冲突，无法把阈值当作经过验证的交易信号。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/biga-scan.py:27-37](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L27-L37)

异常等价非交易日。

<details>
<summary>查看原文（11行）</summary>

```text
def is_td():
 """查询深交所日历判断今天是否为A股交易日"""
 td=datetime.now(C).strftime("%Y-%m-%d");ym=td[:7]
 try:
  req=urllib.request.Request(f"http://www.szse.cn/api/report/exchange/onepersistenthour/monthList?month={ym}")
  req.add_header("User-Agent","Mozilla/5.0");req.add_header("Referer","http://www.szse.cn/aboutus/calendar/index.html")
  with urllib.request.urlopen(req,timeout=5)as r:d=json.loads(r.read().decode("utf-8"))
  for e in d.get("data",[]):
   if e.get("jyrq")==td:return e.get("jybz")=="1"
  return False
 except:return False
```

</details>

**依据 2 · 源码核查**：[scripts/biga-scan.py:81-112](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L81-L112)

明文 HTTP 行情和 fallback。

<details>
<summary>查看原文（32行）</summary>

```text
def fq(cs):
 if not cs: return {}
 qt={}
 missing=[]
 # 主接口: 腾讯(字段映射确认可靠,且更稳定)
 def _fetch(url):
  try: return urllib.request.urlopen(url, timeout=5).read().decode("gbk","ignore")
  except: return ""
 with ThreadPoolExecutor(max_workers=8) as ex:
  futs={}
  for c in cs:
   x=px(c);lk=c if c.startswith(("sh","sz","bj")) else x+c
   futs[ex.submit(_fetch,f"http://qt.gtimg.cn/q={lk}")]=lk
  for fu in futs:
   lk=futs[fu];d=fu.result()
   m=re.search(r'="([^"]*)"',d)
   if m and len(m.group(1).split("~"))>44:
    r=_parse_tx(m.group(1).split("~"))
    if r: qt[lk]=r
    else: missing.append(lk)
   else: missing.append(lk)
 # 备用: 新浪补拉腾讯失败的
 if missing:
  def _fetch_sina(url):
   try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Referer': 'http://finance.sina.com.cn'})
    return urllib.request.urlopen(req, timeout=5).read().decode("gbk","ignore")
   except: return ""
  with ThreadPoolExecutor(max_workers=8) as ex2:
   futs2={}
   for lk in missing:
    futs2[ex2.submit(_fetch_sina,f"http://hq.sinajs.cn/list={lk}")]=lk
```

</details>

**依据 3 · 源码核查**：[scripts/biga-scan.py:156-183](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L156-L183)

择时实际公式。

<details>
<summary>查看原文（28行）</summary>

```text
def ct(kl2,q):
 if not kl2 or len(kl2)<2: return {"score":0,"available":False}
 mp=f(q.get("price",0));mc=f(q.get("market_cap",0))
 ch=[k["code"] for k in kl2]
 ma5=sum(ch[-5:])/5;ma20=sum(ch[-20:])/20 if len(ch)>=20 else ma5
 vo=[k["v"]for k in kl2];avg=sum(vo)/len(vo);vr=kl2[-1]["v"]/avg if avg>0 else 0
 pct=f(q.get("change_pct",0))
 sc=0
 if ma5>ma20*1.02: sc+=4
 elif ma5>ma20: sc+=2
 elif ma5>ma20*0.98: sc+=0
 else: sc-=2
 sc+=5 if pct>3 else 4 if pct>0 else 3 if pct>-3 else 2
 sc+=4 if vr>1.5 else 3 if vr>0.8 else 2
 return {"score":sc,"available":True}

def ss(kl2,q,ts):
 if not kl2 or len(kl2)<5: return {"sg":"--","advice":"K线不足"}
 ch=[k["code"]for k in kl2];ma5=sum(ch[-5:])/5;ma20=sum(ch[-20:])/20 if len(ch)>=20 else ma5
 tp=f(q.get("price",0));mc=f(q.get("market_cap",0))
 pct=f(q.get("change_pct",0));vr=kl2[-1]["v"]/(sum(k["v"]for k in kl2[-20:])/len(kl2[-20:])) if len(kl2)>=20 else 0
 sc=0
 sc+=8 if ma5>ma20*1.05 else 6 if ma5>ma20 else 4 if ma5>ma20*0.95 else 2
 sc+=6 if pct>5 else 4 if pct>0 else 2 if pct>-3 else 1
 sc+=4 if vr>1.3 else 3 if vr>0.7 else 2
 sg="--" if sc<12 else "+" if sc<15 else "++" if sc<18 else "+++"
 adv="观望" if sc<10 else "持有" if sc<14 else "关注" if sc<17 else "买入"
 return {"sg":sg,"advice":adv,"score":sc}
```

</details>

**依据 4 · 源码核查**：[scripts/biga-scan.py:397-405](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L397-L405)

休市正常退出。

```text
 # 交易日检查：非交易日直接退出
 if not is_td():
  td=datetime.now(C).strftime("%Y-%m-%d")
  if sg_f or fm:
   print(f"📅 非交易日 — {td} A股休市，不做A股分析")
   sys.exit(0)
  else:
   print(json.dumps({"holiday":True,"date":td,"note":"A股休市"},ensure_ascii=False))
   sys.exit(0)
```

**依据 5 · 源码核查**：[scripts/biga-scan.py:424-448](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L424-L448)

缺值、技术分和脚本估分。

<details>
<summary>查看原文（25行）</summary>

```text
 for s in st:
  c=s["code"];q=qt.get(c if c.startswith(("sh","sz","bj")) else px(c)+c,{});kl2=kl.get(c,[])
  tm=ct(kl2,q)if kl2 else{"score":0,"available":False}
  st2=ss(kl2,q,tm.get("score",0))if kl2 else{"sg":"--","advice":"K线不足"}
  qp=q.get("price",0);qc=q.get("change_pct",0);qpe=q.get("pe",0);qtr=q.get("turnover_rate",0);qamp=q.get("amplitude",0);qmc=q.get("market_cap",0)
  ps=15 if 15<=qpe<=40 else 10 if 10<=qpe<=60 else 5 if qpe>0 else 0
  if not kl2 or len(kl2)<5: tsb=0
  else:
   cls=[k["code"]for k in kl2];ma5=sum(cls[-5:])/5;ma20=sum(cls[-20:])/20 if len(cls)>=20 else ma5
   tsb=(10 if ma5>ma20*1.02 else 7 if ma5>ma20 else 5 if ma5>ma20*0.98 else 3 if ma5>ma20*0.95 else 1)
   vols=[k["v"]for k in kl2];avg=sum(vols)/len(vols);vr2=kl2[-1]["v"]/avg if avg>0 else 1
   tsb+=(5 if qc>2 and vr2>1.2 else 4 if qc>0 and vr2>0.8 else 3 if qc>-2 else 1)+3
  if tsb>=14 and ps>=10 and tm.get("score",0)>=0: lt={"action":"买入","note":"技术强+PE合理"}
  elif tsb>=14 and tm.get("score",0)>=-2: lt={"action":"持有","note":"技术面好"}
  elif tsb>=10 and tm.get("score",0)>=-2: lt={"action":"持有","note":"趋势尚可"}
  elif tm.get("score",0)<=-5: lt={"action":"减仓","note":"技术走弱"}
  elif tsb<10: lt={"action":"观察","note":"技术偏弱"}
  else: lt={"action":"持有观察","note":"信号不明"}
  en={"code":c,"name":q.get("name",s.get("name","")),"rating":s.get("rating",""),"previous_biga":s.get("biga_score",0),
   "quote":{"price":qp,"change_pct":qc,"pe":qpe,"turnover_rate":qtr,"amplitude":qamp,"market_cap":qmc},
   "technical_timing":tm,"short_term":st2,"long_term":lt,"kline_available":len(kl2)>=5,"kline_days":len(kl2)}
  en["entry_readiness"]=entry_readiness(kl2,q)if kl2 else{"score":0,"note":"无K线"}
  en["risk_filter"]=risk_filter(kl2,q)
  en["breakout"]=breakout_signals(kl2,q)
  en["biga_estimate"]={"total":tsb+ps,"note":"脚本估分(技术+PE),完整BigA需模型补"}
```

</details>

**依据 6 · 作者声明**：[SKILL.md:40-46](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L40-L46)

概览声称择时区间和综合权重。

```text
**核心功能：**
- **📊 实时行情** — 沪深 A 股、创业板、科创板实时行情查询，支持个股/板块/大盘
- **🎯 智能选股** — 高科技×中小市值×好业绩三层筛选，动态管理 ≤30 支股票池
- **📈 技术面分析** — 自主研发 -10~+10 择时分体系，精准判断买卖时机
- **⭐ 量化评分** — 基本面(25%)+催化剂(25%)+技术面(20%)+热度(30%)，0-100 综合评分
- **🔔 短线信号** — 接近买点、启动信号、入场就绪度、超跌机会等多维度判断
- **⏰ 定时推送** — 每日开盘前瞻(08:30)、盘中异动监控、收盘复盘(15:30)自动推送
```

**依据 7 · 作者声明**：[SKILL.md:90-106](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L90-L106)

权重表与区间。

<details>
<summary>查看原文（17行）</summary>

```text
## 股票池评分(BigA, 0-100)

| 维度 | 权重 | 评分 | 脚本支持 |
|------|------|------|----------|
| 基本面 | 40 | PE合理(15-40,15分)+营收增速>20%(15分)+净利增(10分) | PE脚本算，营收/净利需模型 |
| 催化剂 | 25 | 政策利好(10)+产业向上(10)+消息(5) | ❌需模型 |
| 技术面 | 20 | 趋势向上(10)+量价(5)+相对强弱(5) | ✅脚本全自动 |
| 热度 | 15 | 板块热度(8)+资金流入(7) | ❌需模型 |

**管理**: 初始60📌 | >30支淘汰最低分 | 连3次<40自动移除

## 技术面择时分(-10~+10)

**与BigA评分正交**:BigA回答"股票好不好",择时分回答"何时买卖"
完整细则见`references/technical-timing-score.md`。由脚本自动计算，模型无需手动计算。

**总分判定**: ≥+6🔥买入 / +3~+5✅买入 / -2~+2👀持有 / -5~-3⚠️仅持有 / ≤-6🛑止盈
```

</details>

**依据 8 · 作者声明**：[SKILL.md:122-127](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L122-L127)

手动流程的另一套分组。

```text
### 用户手动触发
1. 检查 `workspace/memory/biga-installed`，不存在则提示安装
2. 读 `workspace/memory/biga-stock-pool.md`，不存在则搜索创建初始池
3. 执行 `python3 scripts/biga-scan.py --segments` 获取股票池分段文本
4. web_search 搜索大盘动态 + 最新催化剂
5. 模型综合：脚本技术面20分+PE15分 + 模型基本面催化剂40分 + 热度25分 → 总分0-100
```

#### 缺口

- 无独立回测及口径一致性验证
  **影响**：不能据规则推断有效性或把零值当实况
  **进一步探讨**：离线注入日历失败、空行情、短 K 线和极端样本，核数据有效性及文档一致性

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何在不使用实时信号的情况下评估这套流程？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

用合成市场样例和离线 DSH Profile 对照人工表格，先明确读取哪些目录和输出字段，再测 Agent 是否区分脚本估分、模型补分与数据未知。首次投入是 Python、工作区及资料准备，持续成本是数据源、模型搜索和人工复核；失败时保留原数据和报告，禁用 bundle 和另配任务，避免继续推送不完整输出。可以提出可证伪的改进：给行情与日历增加明确的不可用状态，并统一评分规则和证据引用。若盲评下错误理解比例、复核时间均不降，就保留人工汇总。没有跑实时、回测或定时推送。

#### 证据与依据

**依据 1 · 作者声明**：[SKILL.md:29-31](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L29-L31)

DSH 推送依赖另一组件。

```text
> **🌍 环境兼容（OpenClaw / DSH 双端）**
> - **OpenClaw**：脚本在技能目录下执行（`python3 scripts/biga-scan.py`），数据默认 `~/.openclaw/workspace/memory/`，定时推送走 `openclaw cron` + `openclaw message send`。
> - **DSH**：无 `openclaw` CLI，数据走 `$DSH_WORKSPACE/memory`（默认 `~/.dsh/workspace/memory`）；发送类命令自动降级为直接输出。**定时推送请先安装 BigTimer 技能**：`dsh plugin add github:kobenfang/BigTimer`，然后用 `bigtimer.py add` 创建定时任务。
```

**依据 2 · 作者声明**：[SKILL.md:116-135](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/SKILL.md#L116-L135)

当前流程含多步人工/模型工作。

<details>
<summary>查看原文（20行）</summary>

```text
## 工作流程

> **核心**: 所有主动数据拉取由 `scripts/biga-scan.py` 完成，模型负责组合脚本输出+催化剂搜索+最终评分输出。

**前置检查**：`scripts/biga-scan.py` 启动时自动调用深交所日历 API 判断当天是否为交易日（函数 `is_td()`）。非交易日 JSON 输出 `{"holiday":true}`，--segments 输出 `📅 非交易日`，脚本直接退出不扫描。模型遇到 holiday 标记时：开盘前瞻改外围追踪（美股/A50/汇率），盘中/复盘任务跳过。

### 用户手动触发
1. 检查 `workspace/memory/biga-installed`，不存在则提示安装
2. 读 `workspace/memory/biga-stock-pool.md`，不存在则搜索创建初始池
3. 执行 `python3 scripts/biga-scan.py --segments` 获取股票池分段文本
4. web_search 搜索大盘动态 + 最新催化剂
5. 模型综合：脚本技术面20分+PE15分 + 模型基本面催化剂40分 + 热度25分 → 总分0-100
6. 生成完整内容（不限字数），按推送格式组织
7. **分段推送**：
   - 解析 `---SEGMENT---`，先推送股票池分段
   - 池外关注单独一段，内容更详细（含催化因素、技术面亮点、操作建议）
   - 逐段 `openclaw message send` 发送，段间 `sleep 1.5`
   - **【发送校验】**：推送完成后检查本轮是否调用过 `openclaw message send`，若未曾调用则立即补发完整内容后再输出确认
8. 回复一行确认（如「📈 BigA · 筛选完成 ✅」）
9. **手动触发输出约束**：内容合并≤3段（股票池≤2段+池外1段），总字数≤1200字，搜索精简为1次，避免超时
```

</details>

**依据 3 · 源码核查**：[scripts/biga-scan.py:415-450](https://github.com/kobenfang/bigA/blob/90467c38203a942d6fcd587a09a82e1a5760118c/scripts/biga-scan.py#L415-L450)

脚本输出及缺值用于构造离线夹具。

<details>
<summary>查看原文（36行）</summary>

```text
 if cds: st=[{"code":re.sub(r"^(sh|sz|bj)","",c.strip()),"note":"","rating":"","biga_score":0,"t":0,"l":""}for c in cds if len(c.strip())>=6]
 else: st=pp_(pp)
 if not st: print(json.dumps({"e":"空池"}));return
 sc=[s["code"]for s in st];qt=fq(sc+[ic for ic,_ in N])
 kl,kf=fks(st)
 id_={}
 for ic,nm in N:
  if ic in qt: id_[nm]={"price":qt[ic].get("price",0),"change_pct":qt[ic].get("change_pct",0)}
 an=[]
 for s in st:
  c=s["code"];q=qt.get(c if c.startswith(("sh","sz","bj")) else px(c)+c,{});kl2=kl.get(c,[])
  tm=ct(kl2,q)if kl2 else{"score":0,"available":False}
  st2=ss(kl2,q,tm.get("score",0))if kl2 else{"sg":"--","advice":"K线不足"}
  qp=q.get("price",0);qc=q.get("change_pct",0);qpe=q.get("pe",0);qtr=q.get("turnover_rate",0);qamp=q.get("amplitude",0);qmc=q.get("market_cap",0)
  ps=15 if 15<=qpe<=40 else 10 if 10<=qpe<=60 else 5 if qpe>0 else 0
  if not kl2 or len(kl2)<5: tsb=0
  else:
   cls=[k["code"]for k in kl2];ma5=sum(cls[-5:])/5;ma20=sum(cls[-20:])/20 if len(cls)>=20 else ma5
   tsb=(10 if ma5>ma20*1.02 else 7 if ma5>ma20 else 5 if ma5>ma20*0.98 else 3 if ma5>ma20*0.95 else 1)
   vols=[k["v"]for k in kl2];avg=sum(vols)/len(vols);vr2=kl2[-1]["v"]/avg if avg>0 else 1
   tsb+=(5 if qc>2 and vr2>1.2 else 4 if qc>0 and vr2>0.8 else 3 if qc>-2 else 1)+3
  if tsb>=14 and ps>=10 and tm.get("score",0)>=0: lt={"action":"买入","note":"技术强+PE合理"}
  elif tsb>=14 and tm.get("score",0)>=-2: lt={"action":"持有","note":"技术面好"}
  elif tsb>=10 and tm.get("score",0)>=-2: lt={"action":"持有","note":"趋势尚可"}
  elif tm.get("score",0)<=-5: lt={"action":"减仓","note":"技术走弱"}
  elif tsb<10: lt={"action":"观察","note":"技术偏弱"}
  else: lt={"action":"持有观察","note":"信号不明"}
  en={"code":c,"name":q.get("name",s.get("name","")),"rating":s.get("rating",""),"previous_biga":s.get("biga_score",0),
   "quote":{"price":qp,"change_pct":qc,"pe":qpe,"turnover_rate":qtr,"amplitude":qamp,"market_cap":qmc},
   "technical_timing":tm,"short_term":st2,"long_term":lt,"kline_available":len(kl2)>=5,"kline_days":len(kl2)}
  en["entry_readiness"]=entry_readiness(kl2,q)if kl2 else{"score":0,"note":"无K线"}
  en["risk_filter"]=risk_filter(kl2,q)
  en["breakout"]=breakout_signals(kl2,q)
  en["biga_estimate"]={"total":tsb+ps,"note":"脚本估分(技术+PE),完整BigA需模型补"}
  an.append(en)
 el=round(time.time()-ts,1);r={"st":nw(),"stocks":an,"indices":id_,"sm":{"sc":len(st),"ks":len(kl),"el":el}}
```

</details>

#### 缺口

- 缺实际数据服务、发送和耗时结果
  **影响**：没有持续采用成本或信号效力依据
  **进一步探讨**：用离线夹具和人工复核对照，不接真实订单或账户

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
