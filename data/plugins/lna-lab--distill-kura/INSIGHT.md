# distill-kura

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3a02c04](https://github.com/lna-lab/distill-kura/tree/3a02c04e5155cd66d49cfd95d11b09239499c97d)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lna-lab/distill-kura)
<!-- END META -->

> **功能**：为 Agent 提供按证据蒸馏的长期记忆、语义召回及按模式分库，含 HTTP、MCP 与 DSH 适配。

> **亮点**：将来源分类和确定性表面检查接到草稿签名、规范写入恢复，再用整索引语义选择及明确不可达回退找记忆；根不是单独原生插件，见 [Q01](#research-q01)至 [Q04](#research-q04)。

> **主要限制**：引文出现不等于结论真实，store路由不等保密隔离；默认直接写、适配只读与服务策略分层，超时不撤销服务写，见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 这是原生插件还是记忆服务，解决谁的什么任务？](#detail-section-11)
  - [Q02 · 请求如何落库，成功与失败实际代表什么？](#detail-section-12)
  - [Q03 · 证据门禁到底保证什么，草稿怎样变成记忆？](#detail-section-13)
  - [Q04 · 召回怎样控制猜测、上下文和模型故障？](#detail-section-14)
  - [Q05 · DSH与MCP适配器是否真正执行只读、模式绑定和取消？](#detail-section-15)
  - [Q06 · 怎样付出可控代价验证，而不是直接积累私密错误记忆？](#detail-section-16)
  - [Q07 · 下一步值得验证什么增量？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期Agent日志维护者要跨会话找回有依据的事实/决定；先用脱敏副本核错记与召回，见 [Q01](#research-q01)。

手工Markdown与关键词检索。根服务组织证据蒸馏和识别索引，DSH/MCP只是接入面；不把标准库/作者基准当已验高效。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 证据蒸馏 | 日志到有原文草稿 | 不保证语义为真 |
| 分层召回 | 索引识别/链接上下文 | 模型与预算影响结果 |
| 多库/模式 | 分开路由/模型配置 | 无HTTP认证非保密隔离 |
| DSH/MCP桥 | 模型读/可选直接写 | 客户端readonly与服务策略分层 |
| WAL | 恢复规范写入 | 非跨全部后续动作事务 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失或边界 |
| --- | --- | --- |
| Python>=3.11 | 根CLI/HTTP/MCP | 标准库不等无推理依赖 |
| 可用模型端点/环境凭据 | 语义选择和蒸馏 | 未配则降级或pending |
| 独立进程/OS权限/loopback | 信任边界 | HTTP无认证 |
| store/journal/model profile | 范围配置 | 路由不能代保密隔离 |
| Node>=20与dsh-tools peer | DSH适配 | Host契约未运行 |

#### 步骤

| 步骤 | 动作 | 判断与退路 |
| --- | --- | --- |
| 准备 | 新库/脱敏日志副本、禁cues | 不接私密/生产库 |
| 配置 | loopback独立进程，store与journal/model profile明确 | 不混信任级别 |
| 召回 | 命中/近似/无关/断端点 | 看how与预算字段 |
| 蒸馏 | run后人工核原文/草稿，再决定pour | draft不等已提交 |
| 停止 | 停调度服务和适配，保留Markdown/证据 | 状态不明先查不盲重试 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | Python/端点/副本存储 | 部署/信任与源配置 | 未测安装时间 |
| 持续 | 整索引prompt及多角色调用 | 原文/草稿复核 | 本地或API费用未知 |
| 失败 | pending/WAL/隔离材料 | 区分拒绝/中断/提交未知 | 不把abort当撤销 |
| 退出 | Markdown/工坊/密钥备份 | 停调度并撤适配 | 已外发内容不能收回 |

#### 效果

| 效果 | 当前支持 | 未确认 |
| --- | --- | --- |
| 原文约束 | 子串/分类/成文检查 | 语义正确/多语覆盖 |
| 记忆查找 | 分层召回/拒选/降级路径 | 准确率/时延/需求 |
| 写入恢复 | 锁与WAL重放/隔离 | 真实磁盘/崩溃验收 |
| 生产收益 | 作者有基准自述 | 本轮无净收益验证 |

> **思考**：引文出现不等于结论真实，store路由不等保密隔离；默认直接写、适配只读与服务策略分层，超时不撤销服务写，见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将来源分类和确定性表面检查接到草稿签名、规范写入恢复，再用整索引语义选择及明确不可达回退找记忆；根不是单独原生插件，见 [Q01](#research-q01)至 [Q04](#research-q04)。

写入门禁与WAL提供可追路径，HTTP无认证、策略分层和跨阶段非共同事务需按实际部署解释。未完整核其余运维命令，不给全库安全保证，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

引文出现不等于结论真实，store路由不等保密隔离；默认直接写、适配只读与服务策略分层，超时不撤销服务写，见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用限定为有本地推理/日志运维能力的维护者在独立脱敏副本禁cues，先核召回路径、再人工审一轮草稿。遇跨库/依据不符或提交未知就停止并查副本，回手工Markdown，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定核心服务、DSH/MCP、gate/pipeline及WAL已核；未运行目标/模型/作者基准，未完整审CueLedger/评分与其余运维子命令。只推荐禁cues的单信任域脱敏副本试用。

- 已检查：作者 README、包清单、源码路径 README.md、distill_kura/distill/gate.py、distill_kura/distill/pipeline.py、distill_kura/distill/sources.py、distill_kura/fastpath.py、distill_kura/mcp.py、distill_kura/recall.py、distill_kura/registry.py、distill_kura/server.py、distill_kura/store.py、distill_kura/thinker.py、docs/TRUST.md、dsh-plugin/lib/index.js、dsh-plugin/package.json、pyproject.toml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：README/pyproject、CLI蒸馏出口、HTTP处理器、registry选择/建库/模型profile、store策略/写入锁/WAL/结果、gate核心、pipeline候选→草稿→pour/失败批次、recall/Endpoint以及DSH和MCP关键接线；未执行，未完整审其余运维/基准、CueLedger与fastpath评分。
- 下一步：- 最小验证：脱敏库四类查询核how/预算与原文。
- 再核一轮草稿、pour与结果未知，保留副本可回退。
- 这些验证尚未执行，不能把作者基准当本轮结果。

**分析版本**

- **仓库**：[lna-lab/distill-kura](https://github.com/lna-lab/distill-kura)
- **版本号**：Python 根包 0.3.0；DSH 适配包 0.1.0（[固定提交 3a02c04](https://github.com/lna-lab/distill-kura/tree/3a02c04e5155cd66d49cfd95d11b09239499c97d)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是绑定请求/store/manifest/revision的阶段收据，用三故障样本测误重试及判读负担，现有结果足够则放弃，见 [Q07](#research-q07)。

- 最小验证：脱敏库四类查询核how/预算与原文。
- 再核一轮草稿、pour与结果未知，保留副本可回退。
- 这些验证尚未执行，不能把作者基准当本轮结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 4803 | — | — | 36639 |
| .md | example | 16 | 458 | — | — | 3722 |
| .js | source | 1 | 599 | 409 | 170 | — |
| .mjs | test | 4 | 704 | 581 | 90 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lna-lab/distill-kura/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/lna-lab/distill-kura/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对根Python服务与适配器的证据写入、召回、隔离和结果边界，判断单信任域副本试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是原生插件还是记忆服务，解决谁的什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根交付是 Python 0.3.0 记忆库/CLI、HTTP服务与MCP桥，另含 dsh-plugin 0.1.0 原生适配器，本根按 infrastructure 归因，不能把 Python 服务等同原生Host插件。面向已有长期Agent日志、需要跨会话找回事实/人类决定的单信任域维护者，合格结果是可追溯到原文的记忆和带来源/召回路径的上下文，而非自动认定为真。参照手工维护 Markdown 和记忆关键词检索：增量在分类证据约束的蒸馏、索引触发语+模型识别与按模式路由。Python标准库无向量数据库/embedding依赖，但外部推理仍可能存在，不能把零Python运行依赖写成零资源。README性能/基准为作者报告，本轮未复现，不据数值证明更快/更准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/README.md#L3-L10)

作者提供的多种分发面。

```text
**A long-term memory for agents that is distilled, not accumulated.**
Recall works by *meaning*, writing is gated by *evidence*, and one server can hold
several separate memories — one per agent mode — so switching mode switches what the
agent remembers.

Ships as a [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) plugin,
an MCP server for any other host, an HTTP service, and a Python library. Standard
library only; no vector database, no embeddings, no framework.
```

**依据 2 · 作者声明**：[README.md:28-43](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/README.md#L28-L43)

作者解释检索/写入痛点及方法，非本轮效果验证。

<details>
<summary>查看原文（16行）</summary>

```text
Two failures kill an agent's long-term memory, and they kill it from opposite sides.

**Retrieval by keyword misses the thing you needed.** A question about *"SSD inference
chips"* shares no word with a memory titled *"running the 2.6T model off an SSD tier"* —
yet they are the same subject. Word search returns nothing; the agent answers from
nowhere. The fix here is not embeddings but *recognition*: the entire index (one line
per memory, written as a recognition trigger) goes into one prompt, and a small model
names what bears on the question. An index of ~500 memories is around 6k tokens — a
few percent of a modern context window, and it sits in the prefix cache.

**Writing everything poisons the store.** An agent asserts something; a naive distiller
records the assertion as a fact; the next agent reads it back as ground truth and
repeats it with more confidence. That loop is self-reinforcing, and prompt instructions
do not stop it — measured, not assumed. So the write path is gated by deterministic
Python: every candidate memory must carry quotes that exist *character-for-character*
in the raw material, tagged with where they came from.
```

</details>

**依据 3 · 源码核查**：[pyproject.toml:5-30](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/pyproject.toml#L5-L30)

Python版本、零运行依赖与CLI入口。

<details>
<summary>查看原文（26行）</summary>

```text
[project]
name = "distill-kura"
version = "0.3.0"
description = "Distilled long-term memory for agents: recall by meaning, write only what evidence supports"
readme = "README.md"
requires-python = ">=3.11"
license = { text = "MIT" }
authors = [{ name = "Lna-Lab" }]
keywords = ["memory", "llm", "agent", "rag", "long-term-memory", "dsh-plugin"]
classifiers = [
  "Programming Language :: Python :: 3.11",
  "Programming Language :: Python :: 3.12",
  "Programming Language :: Python :: 3.13",
  "License :: OSI Approved :: MIT License",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
]
dependencies = []          # standard library only, on purpose

[project.optional-dependencies]
dev = ["pytest>=7"]
# Exact token counting is a benchmarking concern, never a runtime one: the core must
# stay installable with nothing behind it.
bench = ["tokenizers>=0.15"]

[project.scripts]
kura = "distill_kura.cli:main"
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/package.json:1-29](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/package.json#L1-L29)

单独适配包版本、入口、peer和Node下限。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "dsh-distill-kura",
  "version": "0.1.0",
  "description": "Distilled long-term memory (蔵/kura) for DeepSeek Harness — recall by meaning, one kura per agent mode",
  "type": "module",
  "main": "lib/index.js",
  "license": "MIT",
  "keywords": [
    "dsh-plugin",
    "memory",
    "long-term-memory",
    "rag",
    "kura"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lna-lab/distill-kura.git",
    "directory": "dsh-plugin"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*"
  },
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test": "node --import ./test/register.mjs --test test/plugin.test.mjs"
  }
}
```

</details>

#### 缺口

- 未执行作者基准或真实长期记忆任务。
  **影响**：需求强度与净效果不能由示例速度推导。
  **进一步探讨**：用脱敏日志集对照手工Markdown/关键词检索，标注事实依据与漏召回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求如何落库，成功与失败实际代表什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

HTTP精确路由按store/mode选库，未知通常404；显式auto_store_root允许安全名字首用建库，因此GET也未必完全无磁盘变化。/remember调用remember_direct，策略不准则403；frozen拒绝所有规范记忆写，distiller-only拒绝直接写而允许verified pour。路由分库不是用户认证：处理器没有鉴权，默认绑定127.0.0.1；可达端口进程可指定任一store。共享进程不能混不同信任级别，出站模型Bearer也不是服务端鉴权。

_write在锁中构造记忆与索引目标，_commit先同步payload/哈希及intent，再逐文件replace、revision和清理；下次写锁先重放完整WAL，损坏事务隔离留证。它提供恢复路径，不是对并发读暴露一个原子数据库快照；磁盘异常/HTTP断连后的客户端错误不能推出未提交。分组索引已有slug不重写hook，返回ok:true也可indexed:false，必须检查结果字段与doctor，不能只认HTTP200。read/recall也写读取日志，frozen不等目录完全只读。

#### 证据与依据

**依据 1 · 源码核查**：[distill_kura/server.py:83-107](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/server.py#L83-L107)

选择库及显式自动建库退路。

<details>
<summary>查看原文（25行）</summary>

```text
        def _split(self, path: str) -> tuple[str, str, dict]:
            """→ (route, store-selector, query). Understands /s/<store>/<route>."""
            u = urllib.parse.urlsplit(path)
            q = {k: v[0] for k, v in urllib.parse.parse_qs(u.query).items()}
            p = u.path
            sel = q.get("store") or q.get("mode") or ""
            m = re.match(r"/s/([^/]+)(/.*)?$", p)
            if m:
                sel = urllib.parse.unquote(m.group(1))
                p = m.group(2) or "/"
            return p, sel, q

        def _store(self, sel: str):
            try:
                return reg.store(sel or None), None
            except KeyError:
                # Opt-in auto-provisioning: when `[server] auto_store_root` is set, a
                # caller-supplied store name (e.g. from an OpenCode plugin routing the
                # working directory) creates its store on first use. Anything else —
                # no root, a mode name, an unsafe name — stays the strict error.
                st = reg.ensure_store(sel)
                if st is not None:
                    return st, None
                return None, {"error": f"unknown store or mode: {sel!r}",
                              "stores": sorted(reg.stores), "modes": reg.modes}
```

</details>

**依据 2 · 源码核查**：[distill_kura/server.py:231-267](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/server.py#L231-L267)

真实POST策略与返回。

<details>
<summary>查看原文（37行）</summary>

```text
        def _do_POST(self):
            path, sel, _ = self._split(self.path)
            try:
                n = int(self.headers.get("Content-Length") or 0)
            except ValueError:
                return self._send(400, {"error": "bad Content-Length"})
            try:
                p = json.loads(self.rfile.read(n) or b"{}")
            except ValueError:
                return self._send(400, {"error": "bad json"})
            sel = sel or p.get("store") or p.get("mode") or ""
            st, err = self._store(sel)
            if err:
                return self._send(404, err)
            if path == "/recall":
                tot = p.get("total_chars")
                return self._send(200, recall(st, reg.models_for(st).thinker,
                                              p.get("question", ""),
                                              int(p.get("hops", 1)), int(p.get("top", 3)),
                                              int(p.get("chars", 6000)),
                                              int(tot) if tot else None,
                                              fastpath_cfg=reg.fastpath_cfg_for(st)))
            if path == "/remember":
                # A tool call or a script: a DIRECT write, refused unless the store's
                # policy allows one. The distiller's verified pour is a different door.
                r = st.remember_direct(p.get("slug", ""), p.get("description", ""),
                                       p.get("body", ""), p.get("type", "project"),
                                       p.get("hook"), p.get("title"),
                                       tags=p.get("tags"), annotations=_annotations(p))
                return self._send(200 if r.get("ok") else 403, r)
            if path == "/annotate":
                # Tags and the three sentences on an existing memory, through the DIRECT
                # door: a distiller-only store refuses this too. The distiller's own
                # annotations go through `annotate_verified`, which has no route.
                r = st.annotate_direct(p.get("slug", ""), tags=p.get("tags"),
                                       annotations=_annotations(p))
                return self._send(200 if r.get("ok") else 403, r)
```

</details>

**依据 3 · 源码核查**：[distill_kura/registry.py:400-413](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/registry.py#L400-L413)

默认loopback和auto_store_root。

<details>
<summary>查看原文（14行）</summary>

```text

@dataclass
class Registry:
    stores: dict[str, Store]
    modes: dict[str, str]
    models: Models
    default: str
    profiles: dict = field(default_factory=dict)
    host: str = "127.0.0.1"
    port: int = 8085
    config_path: str | None = None
    # Where a store NOT declared in kura.toml may be auto-provisioned on first use.
    # None = strict default: an unknown store is an error, never created.
    auto_store_root: str | None = None
```

</details>

**依据 4 · 源码核查**：[distill_kura/registry.py:563-586](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/registry.py#L563-L586)

安全名字的自动创建。

<details>
<summary>查看原文（24行）</summary>

```text
    def ensure_store(self, name: str) -> Store | None:
        """Auto-provision a store that kura.toml does not declare, under
        `[server] auto_store_root` — or None when that is not possible.

        This is the deliberate, opt-in exception to "an unknown store is an error":
        a host that routes the working directory to a logical store (an OpenCode
        plugin) needs the store to exist on first use. The store is created on disk
        (`init_files`) and held in memory; kura.toml is never rewritten. A store that
        IS configured, or a name that is not a single safe path component, is never
        created — the caller keeps the strict error instead."""
        if not self.auto_store_root or not name:
            return None
        # Never shadow a configured store or a mode.
        if name in self.modes or name in self.raw.get("stores", {}):
            return None
        if name in self.auto_stores:
            return self.stores[name]
        if not _STORE_NAME.match(name):
            return None
        st = Store(name=name, path=os.path.join(self.auto_store_root, name))
        st.init_files()
        self.stores[name] = st
        self.auto_stores.add(name)
        return st
```

</details>

**依据 5 · 源码核查**：[distill_kura/store.py:574-613](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L574-L613)

direct和verified的策略区别。

<details>
<summary>查看原文（40行）</summary>

```text
    def _frozen_refused(self) -> dict | None:
        """The one refusal every write door gives first, spelled once."""
        if self.write_policy == FROZEN:
            return {"ok": False, "error": f"store '{self.name}' is frozen: nothing may write"}
        return None

    def _direct_refused(self) -> dict | None:
        # Frozen first: do not point the caller at a door that is also shut.
        if (r := self._frozen_refused()):
            return r
        if self.write_policy != DIRECT_ALLOWED:
            return {"ok": False, "error": f"store '{self.name}' is {self.write_policy}: "
                                          f"direct writes are refused; memories enter "
                                          f"through the distiller's evidence gate"}
        return None

    def remember_direct(self, slug: str, description: str, body: str,
                        type_: str = "project", hook: str | None = None,
                        title: str | None = None, tags=None,
                        annotations: dict | None = None) -> dict:
        """A write that did NOT come through the distiller's evidence gate — a tool call,
        the CLI, a human. Allowed only under `direct-allowed`."""
        if (r := self._direct_refused()):
            return r
        return self._write(slug, description, body, type_, hook, title,
                           tags=tags, annotations=annotations, signed=False)

    def pour_verified(self, slug: str, description: str, body: str,
                      type_: str = "project", hook: str | None = None,
                      title: str | None = None, meta: dict | None = None,
                      tags=None, annotations: dict | None = None) -> dict:
        """A write from a draft that passed the gate. Refused only when `frozen`.

        A separate method rather than a `verified=True` argument on purpose: the
        capability then shows up in the shape of the code, and no caller can acquire it
        by flipping a flag it happens to have in scope."""
        if (r := self._frozen_refused()):
            return r
        return self._write(slug, description, body, type_, hook, title, meta,
                           tags=tags, annotations=annotations, signed=True)
```

</details>

**依据 6 · 源码核查**：[distill_kura/store.py:957-984](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L957-L984)

写锁先恢复。

<details>
<summary>查看原文（28行）</summary>

```text
    def _locked(self, replay: bool = True):
        """One writer at a time, per store.

        A memory and its index line are two files. Without a lock, two writers
        interleave and the second one's read-modify-write of `MEMORY.md` drops the
        first's line: the memory exists and nothing points at it, which makes it
        invisible to recall — the failure `doctor()` reports as `not_in_index`, after
        the fact. Cheap enough to take on every write.

        The lock is also where crash replay lives, and the placement is load-bearing:
        replay applies a leftover transaction's FINAL bytes, so it must run before any
        new mutation — a write that landed first would be silently overwritten by the
        older promise. Every mutation goes through here, so replay cannot be forgotten.
        `replay=False` is for `doctor()` alone, which replays explicitly to report it.

        Package-internal, but not store-internal: the composite operations that must
        look like one write enter here too — `tidy` (distill/pipeline.py), the loom's
        `persist` and the trail's write. Underscore means "inside distill_kura", not
        "inside this class"; it is not part of the published API."""
        os.makedirs(self.still, exist_ok=True)
        with open(os.path.join(self.still, "store.lock"), "w") as lk:
            fcntl.flock(lk, fcntl.LOCK_EX)
            try:
                if replay:
                    self._wal_replay()
                yield
            finally:
                fcntl.flock(lk, fcntl.LOCK_UN)
```

</details>

**依据 7 · 源码核查**：[distill_kura/store.py:1106-1144](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L1106-L1144)

payload/intent提交及应用顺序。

<details>
<summary>查看原文（39行）</summary>

```text
    def _commit(self, slug: str, op: str, targets: dict[str, bytes]) -> int:
        """Commit one canonical change — the final bytes of each file — through
        the WAL. Must be called under `_locked()`. Returns the new revision."""
        rev = self.revision() + 1
        txid = f"{time.time_ns():020d}-{os.getpid()}"
        txdir = os.path.join(self._wal_dir, txid)
        os.makedirs(txdir)
        files = []
        for i, target in enumerate(sorted(targets)):
            pname = f"payload-{i}"
            self._write_synced(os.path.join(txdir, pname), targets[target])
            files.append({"payload": pname, "target": target,
                          "sha256": hashlib.sha256(targets[target]).hexdigest()})
        intent = {"txid": txid, "slug": slug, "op": op, "next_revision": rev, "files": files}
        # The intent is written LAST: its presence, with every hash checking out, is
        # what makes the promise binding. A crash before this point promised nothing
        # (the leftover is quarantined, loudly, with canonical files untouched).
        self._write_synced(os.path.join(txdir, "intent.json"),
                           json.dumps(intent, ensure_ascii=False).encode("utf-8"))
        self._fsync_dir(txdir)
        self._fsync_dir(self._wal_dir)
        self._apply(txdir, intent)
        return rev

    def _apply(self, txdir: str, intent: dict) -> None:
        """Keep the promise: memory file first, index second, revision third, then
        clear the WAL entry. The same order on commit and on replay, so a crash at
        ANY point re-runs to the same final state."""
        for e in sorted(intent["files"], key=lambda e: e["target"] == INDEX):
            with open(os.path.join(txdir, e["payload"]), "rb") as f:
                data = f.read()
            self._replace_file(os.path.join(self.path, e["target"]), data)
        # max(): a replay of an already-applied transaction must not wind back.
        self._set_revision(max(self.revision(), int(intent["next_revision"])))
        self._fsync_dir(self.path)
        for fn in os.listdir(txdir):
            os.unlink(os.path.join(txdir, fn))
        os.rmdir(txdir)
        self._fsync_dir(self._wal_dir)
```

</details>

**依据 8 · 源码核查**：[distill_kura/store.py:1184-1211](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L1184-L1211)

恢复或隔离损坏事务。

<details>
<summary>查看原文（28行）</summary>

```text
    def _wal_replay(self) -> dict:
        """Finish what a crash interrupted. Must run under the lock, BEFORE any new
        mutation (see `_locked`). An intact transaction is applied and cleared; a
        broken one goes to `_still/wal-quarantine/` with its payloads kept for a
        person to inspect — deleting the debris would delete the only evidence."""
        wal = self._wal_dir
        report: dict = {"replayed": [], "quarantined": []}
        if not os.path.isdir(wal):
            return report
        for txid in sorted(os.listdir(wal)):
            txdir = os.path.join(wal, txid)
            intent = self._wal_intact(txdir)
            if intent is None:
                os.makedirs(self._wal_quarantine, exist_ok=True)
                dest = os.path.join(self._wal_quarantine, txid)
                if os.path.exists(dest):     # quarantined before under this name: keep both
                    dest += f".{time.time_ns()}"
                os.replace(txdir, dest)
                self._fsync_dir(self._wal_quarantine)
                self._fsync_dir(wal)
                report["quarantined"].append(os.path.basename(dest))
                continue
            self._apply(txdir, intent)
            report["replayed"].append(txid)
        if report["replayed"]:
            self._titles = None
            self._slugs_cache = None
        return report
```

</details>

**依据 9 · 源码核查**：[distill_kura/store.py:1318-1336](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L1318-L1336)

ok结果可不更新分组索引，真实_commit。

<details>
<summary>查看原文（19行）</summary>

```text
            if new_index is None:
                # Present but not matched above means a grouped or non-standard line:
                # deliberately not rewritten (see the docstring), hence indexed: False.
                if f"({slug}.md)" not in entries:
                    # Title must be a name one can say aloud — never a truncated description.
                    t1 = self._sayable_title(t1, d1 if len(d1) <= 34 else slug)
                    sep = "" if (not cur or cur.endswith("\n")) else "\n"
                    new_index = f"{cur}{sep}{self._index_line(t1, slug, d1)}\n"
                    result = {"ok": True, "slug": slug, "created": not existed, "indexed": True}
                else:
                    result = {"ok": True, "slug": slug, "created": not existed, "indexed": False}

            targets = {f"{slug}.md": rendered.encode("utf-8")}
            if new_index is not None:
                targets[INDEX] = new_index.encode("utf-8")
            self._commit(slug, "write", targets)
            self._titles = None
            self._slugs_cache = None
            return result
```

</details>

**依据 10 · 作者声明**：[docs/TRUST.md:7-22](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/docs/TRUST.md#L7-L22)

作者明确无认证/非保密边界。

<details>
<summary>查看原文（16行）</summary>

```text
Several kura behind one server are **independent as routing**: separate memories,
separate index, separate distiller watermark, separate model profile if you configure
one. A bound agent cannot wander between them, and a name cannot become a path.

They are **not a confidentiality boundary.** The server has no authentication. Any
process that can reach its port can name any store it holds; any process that can read
the directory can read the memories. The bound-agent machinery keeps a *model* inside
its lane — it does not keep a *process* out.

Both halves matter. The first is what makes modes useful. The second is why the
following is not optional.

## The rule

**One trust level per process.** Do not put a private store and a less-trusted store in
the same registry, and do not point a less-trusted agent at a server that holds one.
```

</details>

**依据 11 · 作者声明**：[docs/TRUST.md:63-71](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/docs/TRUST.md#L63-L71)

frozen仍可写派生工坊。

```text
| `direct-allowed` (default) | yes | yes |
| `distiller-only` | **no** | yes |
| `frozen` | no | **no** |

`frozen` means **no memory and no index changes**. The workshop under `_still/` may still
be written — the read log, and a woven cloth if you point `cloth_path` outside the store
— because those are derived artifacts, not memory. A frozen store refuses to have a cloth
woven *inside* it at all, so an archive that should keep a resident map needs
`cloth_path` set somewhere else.
```

#### 缺口

- 没有崩溃注入或并发读/磁盘故障实验。
  **影响**：仅支持有恢复设计，不保证真实环境无丢失/即时一致。
  **进一步探讨**：复制库中在intent前后/索引替换时断进程，核重放、隔离和读者所见状态；请求结果不明先查库不盲重试。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 证据门禁到底保证什么，草稿怎样变成记忆？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

DSH日志按来源kind=user与事件分类USER/SELF/ACT/TOOL，reasoning不入文本；这依赖宿主日志标签可信。gate按类型聚合原文，最多六条、长度阈值及归一化子串找quote，压回已有库的echo；缺原文候选丢弃，SELF-only必须自称判断。类标签声明与实际找到类不符时采用found[0]，所以不是外部身份认证。数字与人类归因等成文表面再经确定性检查，scribe一次修正再失败丢弃；这能挡部分无根据表述，子串/正则不能证明引文蕴含结论、测量可靠或所有语言均覆盖。

_process_batch真实调用spot→gate→novelty→compose→stage；run产物是草稿，不是已经入库。brain传输失败将批次留pending；scribe传输失败另存候选，形状不符则可以不产草稿，不把这两者混同“无新知识”。pour先验HMAC与manifest存在/完整，再调用pour_verified，成功后改草稿后缀和可能发routing receipt。记忆提交后的草稿重命名/后续receipt并非同一WAL事务，后续异常需查实际库；receipt失败不撤销pour。HMAC密钥和原件同目录，可写该文件系统的principal可能读钥，不能作敌对租户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[distill_kura/distill/sources.py:382-415](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/sources.py#L382-L415)

DSH事件来源与四分类。

<details>
<summary>查看原文（34行）</summary>

```text
    def _classify(d: dict) -> Segment | None:
        t = d.get("type")
        data = d.get("data")
        if not isinstance(data, dict):
            return None
        if t == "user/message":
            if (data.get("source") or {}).get("kind") != "user":
                return None                       # injected context is not the human
            txt = " ".join(c.get("text", "") for c in (data.get("content") or [])
                           if isinstance(c, dict) and c.get("type") == "text").strip()
            # Prefix, not substring: `source.kind` above has already decided
            # provenance, so this is belt-and-braces. (ClaudeCodeSource has no such
            # label and must match anywhere in the part — see its walk.)
            if not txt or txt.startswith("<system-reminder") or txt.startswith("Current runtime context"):
                return None
            return Segment("USER", txt)
        if t == "assistant/chunk":
            c = data.get("chunk") or {}
            if c.get("type") == "block-end":
                b = c.get("block") or {}
                if b.get("type") == "text" and (b.get("text") or "").strip():
                    return Segment("SELF", b["text"].strip())
            return None                            # reasoning blocks are dropped
        if t == "tool/call":
            return Segment("ACT", f"{data.get('name')} {(data.get('arguments') or '')[:600]}")
        if t == "tool/result":
            parts = []
            for c in (data.get("message") or {}).get("content") or []:
                if isinstance(c, dict) and c.get("type") == "tool-result":
                    for cc in c.get("content") or []:
                        if isinstance(cc, dict) and cc.get("type") == "text":
                            parts.append(cc.get("text", ""))
            txt = "\n".join(parts).strip()
            return Segment("TOOL", txt) if txt else None
```

</details>

**依据 2 · 源码核查**：[distill_kura/distill/gate.py:69-132](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/gate.py#L69-L132)

真实引文/echo/class和SELF门禁。

<details>
<summary>查看原文（64行）</summary>

```text
def gate(cands: list[dict], segs: list[Segment], store_text: str = "") -> tuple[list[dict], list[dict], list[dict]]:
    """→ (kept, dropped, ideas). `store_text` is the normalised full text of the store."""
    hay = {c: norm("\n".join(s.text for s in segs if s.cls == c))
           for c in ("USER", "TOOL", "ACT", "SELF")}
    kept: list[dict] = []
    dropped: list[dict] = []
    ideas: list[dict] = []

    for c in cands:
        if str(c.get("kind", "")).lower() == "idea":
            blob = f"{c.get('topic', '')} {c.get('why', '')}"
            if _FACT_IN_IDEA_CLOTHING.search(blob):
                dropped.append({**c, "why_dropped": "a factual report dressed as an idea"})
                continue
            ideas.append(c)
            continue

        good: list[dict] = []
        classes: set[str] = set()
        echoed = 0
        for q in (c.get("quotes") or [])[:6]:
            q = str(q)
            m = _QUOTE_TAG.match(q)
            claimed, body = (m.group(1), m.group(2)) if m else (None, q)
            claimed = {"KEN": "USER", "ME": "SELF"}.get(claimed, claimed)   # legacy tags
            body = norm(body)[:MAX_QUOTE]
            if len(body) < MIN_QUOTE:
                continue
            found = [k for k, v in hay.items() if body and body in v]
            if not found:
                continue                       # not in the material: fabricated or paraphrased
            if store_text and body in store_text:
                echoed += 1                    # the store reading itself back
                continue
            cls = claimed if claimed in found else found[0]
            good.append({"class": cls, "text": body})
            classes.add(cls)

        if not good:
            dropped.append({**c, "why_dropped": ("echo of text already in the store" if echoed
                                                 else "quotes not found in the raw material")})
            continue

        judgement = classes == {"SELF"}
        if judgement and not _JUDGEMENT_WORDS.search(
                f"{c.get('why', '')} {c.get('topic', '')}"):
            dropped.append({**c, "why_dropped": "turning the agent's own words into a fact"})
            continue

        claims_number = bool(_ANY_DIGIT.search(f"{c.get('why', '')} {c.get('topic', '')}"))
        grounded = bool(classes & {"TOOL", "ACT"})
        entry = {**c,
                 "evidence": good,
                 "classes": sorted(classes),
                 "judgement": judgement,
                 "unverified_numbers": claims_number and not grounded}
        # Callsigns are verified against the SURVIVING quotes, not the raw material:
        # a phrase that only ever appeared in a dropped quote was never evidence.
        cues, cue_refused = verify_callsigns(c.get("callsigns"), good)
        if cues or cue_refused:
            entry["routing_cues"] = cues
            entry["routing_cues_refused"] = cue_refused
        kept.append(entry)
    return kept, dropped, ideas
```

</details>

**依据 3 · 源码核查**：[distill_kura/distill/pipeline.py:540-601](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L540-L601)

成文表面检查与一次修正。

<details>
<summary>查看原文（62行）</summary>

```text
        user = (f"CANDIDATE: {c.get('topic')}\nKIND: {c.get('kind')}\n"
                f"The distiller's reading (**not evidence — never cite it**): "
                f"{c.get('why')}\n{warn}\n"
                f"=== EVIDENCE (this is everything) ===\n{ev}\n\n"
                f"=== NEARBY MEMORIES (candidates for [[links]]) ===\n"
                f"{hints or '(nothing close)'}\n")
        # The scribe is a model: its finished text gets the same deterministic floor
        # as the candidate's quotes did. One retry with the violations named, then drop.
        for attempt in (1, 2):
            out = scribe_call(prompts.SCRIBE_SYS, user)
            if out is None and failures is not None:
                # A transport fact, not a verdict: the caller keeps the candidate and
                # its evidence for another try instead of losing it to a bad minute.
                failures.append(getattr(error_endpoint, "last_error", "")
                                or "the scribe did not answer")
            if out is None or not out:
                if observations is not None:
                    observations.append({"attempt": attempt, "shape": True,
                                         "surface": out or "", "violations": []})
            if not out:
                return None
            slug = re.search(r"^SLUG:\s*(.+)$", out, re.M)
            title = re.search(r"^TITLE:\s*(.+)$", out, re.M)
            desc = re.search(r"^DESC:\s*(.+)$", out, re.M)
            body = re.search(r"^BODY:\s*\n(.*)$", out, re.S | re.M)
            if not (slug and desc and body):
                if observations is not None:
                    observations.append({"attempt": attempt, "shape": True,
                                         "surface": out, "violations": []})
                return None
            text = desc.group(1) + "\n" + body.group(1)
            # The floor sees everything that will be stored or indexed: the title
            # lands in MEMORY.md and the resident map, the curation sentences are
            # saved under the curation mark — all of it is model-written surface.
            _, s_ann, _ = _curation_of(out)
            cand_ann = " ".join(str(c.get(k) or "") for k in ANNOTATION_KEYS)
            surface = "\n".join([slug.group(1), (title.group(1) if title else ""), text,
                                 " ".join(s_ann.values()), cand_ann])
            topology = (set(known_slugs) if known_slugs is not None
                        else set(self._known_slugs(_safe_slug(slug.group(1)))))
            # The output's own slug is code-chosen and is live in the same breath. A
            # frozen packet supplies the rest of the topology; omitting this one
            # mechanical member would reject a self-link that production accepts.
            topology.add(_safe_slug(slug.group(1)))
            bad = final_surface_violations(surface, c["evidence"], c["classes"],
                                           known_slugs=topology)
            if observations is not None:
                observations.append({"attempt": attempt, "shape": False,
                                     "surface": surface, "violations": list(bad)})
            if not bad:
                break
            if attempt == 2:
                _log(f"      ✗ final surface fails the floor: {bad}")
                return None
            user += ("\n⚠️ REJECTED — fix these and answer again: "
                     f"{'; '.join(bad)}. A number must come from the evidence itself "
                     "(do not compute new ones); never credit the human without their "
                     "own quoted words.\n")
        _, plain = _split_draft(body.group(1))
        return self._draft_record(c, out, slug=_safe_slug(slug.group(1)),
                                  title=(title.group(1).strip()[:40] if title else ""),
                                  description=desc.group(1).strip()[:200], body=plain)
```

</details>

**依据 4 · 源码核查**：[distill_kura/distill/pipeline.py:1402-1430](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1402-L1430)

spot失败与gate/novelty接线。

<details>
<summary>查看原文（29行）</summary>

```text
        t0 = time.time()
        cands, failure = self.spot_checked(segs)
        if failure:
            # NOT zero candidates: the brain never answered. The mark has already moved
            # past this stretch and does not come back, so the segments themselves are
            # what the caller shelves — nothing here may look like a finished batch.
            _log(f"  ⚠ the brain did not answer ({failure['reason']}): {failure['detail'][:120]}")
            self._metric({"source_key": key, "segments": len(segs), "by_class": by,
                          "raw_chars": raw_chars, "pending": failure["reason"],
                          "pending_detail": failure["detail"][:200]})
            return {"failure": failure}
        _log(f"  brain found {len(cands)} candidates ({time.time()-t0:.1f}s)")
        kept, dropped, ideas = gate(cands, segs, self.store_text())
        for i in ideas:
            self.seeds.sow(f"{i.get('topic')} — {i.get('why')}", "brain/spot")
            _log(f"    🌱 seed: {i.get('topic')} — {str(i.get('why'))[:70]}")
        sown += len(ideas)
        killed += len(dropped)
        for d in dropped:
            _log(f"    ✗ {d.get('topic')} — {d['why_dropped']}")
            with open(os.path.join(self.still, "dropped.jsonl"), "a", encoding="utf-8") as f:
                f.write(json.dumps({**d, "at": datetime.now(timezone.utc).isoformat()},
                                   ensure_ascii=False) + "\n")

        to_write = []
        for c in kept:
            near = kura_recall(self.store, self.models.thinker,
                               c.get("why") or c["topic"], hops=0, top=3, chars=1200)
            verdict, why, target = self.novelty(c, near)
```

</details>

**依据 5 · 源码核查**：[distill_kura/distill/pipeline.py:1480-1509](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1480-L1509)

scribe失败留候选及stage。

<details>
<summary>查看原文（30行）</summary>

```text
        drafted, draft_chars, draft_text = [], 0, []
        if to_write:
            t1 = time.time()
            def _one(cn):
                fails: list[str] = []
                try:
                    return cn[0], self.compose(cn[0], cn[1], fails), fails
                except Exception as ex:      # a transport fact, not a verdict
                    return cn[0], None, fails + [f"{type(ex).__name__}: {ex}"]

            with ThreadPoolExecutor(max_workers=self.slots) as pool:
                for c, d, fails in pool.map(_one, to_write):
                    if not d and fails:
                        # The scribe was unreachable. The journal behind this candidate
                        # is past the mark, so the candidate and its evidence packet are
                        # kept whole for the next pass — the retry unit here is one
                        # candidate, not the batch.
                        f = self.pending_compose.save(
                            {"kind": "compose", "key": key, "path": path,
                             "candidate": c, "reason": "scribe error",
                             "detail": fails[0][:200]})
                        composes_pending += 1
                        _log(f"      ⚠ the scribe did not answer — kept for a retry "
                             f"({os.path.basename(f)}): {fails[0][:120]}")
                        continue
                    if not d:
                        _log("      the scribe did not keep the shape")
                        continue
                    _log(f"      wrote {d['slug']} → {os.path.basename(self.stage(d, path))}")
                    made.append(d["slug"])
```

</details>

**依据 6 · 源码核查**：[distill_kura/distill/pipeline.py:889-978](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L889-L978)

真实pour验签/manifest/落库后草稿与receipt。

<details>
<summary>查看原文（90行）</summary>

```text
    def pour(self, slug: str) -> dict:
        # A draft is named by a bare slug. Joined as a path, `../../../out/o` read a file
        # from anywhere on the filesystem into the store and renamed the original.
        if slug != os.path.basename(slug) or slug in ("", ".", ".."):
            return {"ok": False, "why": "a draft is named by a bare slug, not a path"}
        p = os.path.join(self.drafts_dir, f"{slug}.md")
        if not os.path.exists(p):
            return {"ok": False, "why": "no such draft"}
        raw = open(p, encoding="utf-8").read()
        # The distiller no longer writes this flag: the final-surface floor refuses a
        # composed text that credits the human before a draft can ever be staged. It
        # stays here for the drafts the floor never saw — one written by hand into the
        # directory, or one carried over from an older distiller — because the answer
        # to "should this be a memory?" must not depend on which version staged it.
        if "🚫" in self._draft_head(raw):
            return {"ok": False, "why": "credits the human with no [USER] evidence; not poured"}
        if not self._draft_mark_valid(slug, raw):
            return {"ok": False,
                    "why": "this draft carries no valid gate mark — it was not staged by "
                           "the distiller, or its name, kind, manifest or body was "
                           "edited afterwards"}
        env = self._envelope_of(raw)
        if env and self.store.load_manifest_verified(env[1]) is None:
            return {"ok": False,
                    "why": "the evidence manifest this draft claims is missing or "
                           "tampered — provenance must exist before the memory does"}
        body = re.sub(r"<!--.*?-->\s*", "", raw, flags=re.S)
        kind = re.search(r"kind:\s*(\w+)", raw)
        head, add = _split_draft(body)
        title = ""
        # Curation lines were inside the signed text, so they are the distiller's own.
        # A TAGS line that does not parse here was not written by stage() — refuse
        # rather than pour a memory with a frontmatter nobody can read.
        try:
            tags = normalize_tags(head.get("TAGS") or [])
        except ValueError as e:
            return {"ok": False, "why": f"draft TAGS line unreadable: {e}"}
        ann = {k: head[k.upper()] for k in ANNOTATION_KEYS if head.get(k.upper())}
        if head.get("EXTENDS"):
            target = head["EXTENDS"]
            cur = self.store.read(target)
            m = re.match(r"^---\n.*?\n---\n(.*)$", cur, re.S)
            if not m:
                return {"ok": False, "why": f"cannot parse {target}"}
            dm = re.search(r"^description:\s*(.+)$", cur, re.M)
            slug_out = target
            desc = dm.group(1).strip().strip('"') if dm else target
            new_body = m.group(1).rstrip() + "\n\n" + add
        else:
            slug_out = slug
            desc = head.get("DESC") or slug
            title = head.get("TITLE", "")
            new_body = add
        # The pour has been through the gate, so it uses the verified door: a store set
        # to `distiller-only` accepts this and refuses a bare tool call.
        man = re.search(r"evidence_manifest:\s*(sha256:[0-9a-f]{64})", self._draft_head(raw))
        r = self.store.pour_verified(slug_out, desc, new_body,
                                     type_=kind.group(1) if kind else "project",
                                     title=title,
                                     meta={"evidence_manifest": man.group(1)} if man else None,
                                     tags=tags, annotations=ann)
        if r.get("ok"):
            # Numbered, like the staging side: a later draft of the same slug is
            # staged under the plain name again (the poured one no longer occupies
            # `<slug>.md`), and renaming straight onto `<slug>.md.poured` destroyed
            # the earlier draft's text, evidence header and mark with no trace.
            os.rename(p, _free_path(os.path.dirname(p), os.path.basename(p)[:-3],
                                    ".md.poured"))
            self._store_text = None
            # The route becomes real only now that the memory does. A staged draft
            # carried its cues as provenance; a TOSSed or quarantined one never
            # reaches this line, so no unpoured draft can grow a route. A receipt
            # that cannot be minted does NOT fail the pour — but it is never
            # silent: the result says so.
            cue_receipt = "none"
            if man:
                hexd = man.group(1).split("sha256:", 1)[-1]
                vm = self.store.load_manifest_verified(hexd)
                if vm and vm.get("routing_cues"):
                    from ..cues import CueLedger
                    res = CueLedger(self.store).issue(
                        memory_slug=slug_out,
                        evidence_manifest=f"sha256:{hexd}",
                        routing_cues=vm["routing_cues"],
                        accepted_via="extends" if head.get("EXTENDS") else "new")
                    cue_receipt = "issued" if res["ok"] else f"failed: {res['why']}"
                    if not res["ok"]:
                        _log(f"  ⚠ cue receipt refused for {slug_out} — {res['why']}")
            if cue_receipt != "none":
                r["cue_receipt"] = cue_receipt
```

</details>

**依据 7 · 源码核查**：[distill_kura/distill/pipeline.py:1634-1678](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1634-L1678)

run保留失败批次与pending返回。

<details>
<summary>查看原文（45行）</summary>

```text
    def run(self, session: str | None = None, chunks: int = 1) -> dict:
        """One pass: the shelf first, then new water.

        The answer says `ok: False` when a batch is left owing — a brain that did not
        answer is not "nothing to do", and a scheduler that read it as such would sit
        out its backoff while water it has already reserved waits on the shelf."""
        tally = self._work_pending()
        pending_file = pending_reason = None
        scan_pending_bytes = 0
        for _ in range(chunks):
            got = self.sip_one(session)
            if not got:
                break
            if isinstance(got, SipPending):
                # bounded discard through an oversized line: the mark did not move,
                # nothing was drunk — the caller retries without draining (PR #5).
                scan_pending_bytes += got.scan_pending_bytes
                continue
            segs, path, key = got
            if not segs:
                continue
            res = self._process_batch(segs, path, key)
            self._add(tally, res)
            failure = res.get("failure")
            if failure:
                pending_file = self.pending.save(
                    {"kind": "batch", "key": key, "path": path,
                     "start": self.marks.read().get(key, 0),
                     "segments": [{"cls": s.cls, "text": s.text} for s in segs],
                     "reason": failure["reason"], "detail": failure["detail"][:400]})
                pending_reason = failure["reason"]
                tally["pending_left"] += 1
                _log(f"  ⇢ the batch is kept for the next pass: "
                     f"{os.path.basename(pending_file)}")
                break                      # a mouth that just failed will fail again
        made = tally["drafts"]
        answer = {"ok": pending_file is None, "drafts": made,
                  "dropped": tally["dropped"], "covered": tally["covered"],
                  "recurred": tally["recurred"], "seeds": tally["seeds"],
                  "cue_receipts": tally["cue_receipts"],
                  "cue_receipt_failures": tally["cue_receipt_failures"],
                  "pending": tally["pending_left"] + tally["composes_pending"]}
        if pending_file:
            return {**answer, "why": "brain error", "pending_file": pending_file,
                    "reason": pending_reason}
```

</details>

**依据 8 · 源码核查**：[distill_kura/store.py:617-625](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/store.py#L617-L625)

密钥就在库旁及权限限制。

```text
    # `_still/gate.key` is the same key the distiller signs drafts with (it used to be
    # read from pipeline.py; it lives here now so the store can sign what it writes
    # through the verified door). The mark covers the memory's curation — slug, tags,
    # the three sentences — so a tag added by hand to a file in a `distiller-only`
    # store shows up in `doctor` as tampering instead of reading as the gate's word.
    #
    # Honest about its limit, as in docs/TRUST.md: the key sits next to the memories,
    # so whoever can write the directory can usually read the key. This stops a tool
    # with a file handle and an accident, not a principal with the filesystem.
```

#### 缺口

- 未验证多语种误归因、语义蕴含和恶意日志/文件写入。
  **影响**：不能承诺所有入库内容真实或抵御有目录权限的攻击者。
  **进一步探讨**：用引文真实但结论不蕴含、USER/TOOL错类、数字错单位与写后重命名故障样本核误接收/结果未知。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 召回怎样控制猜测、上下文和模型故障？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

recall先尝试确定性fastpath，命中则不问thinker；无命中才整索引进入模型prompt选slug，再walk links。fastpath另有verified callsign先行路由，非所有检索都走同一种评分，未独立审完CueLedger，故不把调用名当其安全证明。thinker返回空列表是meaning→none，不强塞关键词结果；不可达None才words降级，并在how标记。因此“没有上下文”可能是未记住/语义拒选/预算截断，必须连picked/included/dropped_for_budget看。

chars是单记忆限制，total_chars另控整体；有截断兜底与返回chars/tokens_est/路径。模型调用在Endpoint发/chat/completions、可从环境取Bearer，默认120秒，只在HTTP400尝试generic体；空URL不偷连默认服务，其他网络/形状失败返回None。整索引送往端点，分store未分模型profile仍共享推理方；私密库需独立进程/账号与明确端点。字数/token估计不是账单或效果。

#### 证据与依据

**依据 1 · 源码核查**：[distill_kura/recall.py:45-77](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/recall.py#L45-L77)

整索引prompt与模型选slug。

<details>
<summary>查看原文（33行）</summary>

```text
def pick_prompt(store: Store) -> str:
    """The exact system prompt the thinker is asked to pick with.

    Factored out for `warm.py`: warming the mouth's prefix cache only works when the
    bytes it prefills are the bytes recall will send. Two copies of this concatenation
    would drift the first time either side was touched, and the drift is invisible —
    the warm pass still "succeeds", recall still pays the cold prefill.
    """
    return PICK_SYS.format(label=store.label) + store.index_text()


def pick_by_meaning(store: Store, thinker: Endpoint, question: str, top: int) -> list[str] | None:
    raw = thinker.ask(pick_prompt(store), question, max_tokens=500)
    if raw is None:
        return None
    m = re.search(r"\[.*?\]", raw, re.S)
    if m:
        try:
            got = json.loads(m.group(0))
            # Models answer with `slug`, `slug.md`, `[slug]`, `path/slug.md` — all
            # the same intent. `Store._clean` is where that shape-tidying lives; a
            # second copy here drifted from it the moment either side was touched.
            picked = [store._clean(x) for x in got if isinstance(x, str)][:top]
            if picked:
                return picked
        except ValueError:
            pass
    # Deterministic net: whatever the format, a real slug in the answer is a pick.
    hits: list[str] = []
    for slug in store.known_slugs():
        if slug in raw and slug not in hits:
            hits.append(slug)
    return hits[:top]
```

</details>

**依据 2 · 源码核查**：[distill_kura/recall.py:140-216](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/recall.py#L140-L216)

fastpath→meaning→words、预算与结果字段。

<details>
<summary>查看原文（77行）</summary>

```text
def recall(store: Store, thinker: Endpoint | None, question: str, hops: int = 1,
           top: int = 3, chars: int = 6000, total_chars: int | None = None,
           fastpath_cfg: dict | None = None) -> dict:
    """Recall by recognition.

    `chars` is the budget for ONE memory, not for the answer: link-walking can return
    ten of them, so a caller reading it as a ceiling on the response was out by an order
    of magnitude. `total_chars` is the ceiling on the whole context; memories are filled
    in walk order until it runs out, and the reply says how much of each budget was used.

    `fastpath_cfg` is the `[fastpath]` table (`enabled`, `gate`); None means the
    defaults. The reply always says what tier zero did (`fastpath_verdict`, `fastpath_ms`).
    """
    t0 = time.time()
    cfg = fastpath_cfg or {}
    fp_ms, fp_verdict, picked, how = None, "disabled", None, ""
    fp: dict = {}
    if cfg.get("enabled", True):
        # Tier zero: a gated hit IS the pick and the thinker is never asked — which
        # also means a direct question still finds its memory when the thinker is
        # down, instead of degrading straight to word overlap. The callsign pre-head
        # answers first when the question contains a verified shared word.
        fp = fastpath.lookup(store, question, top=top,
                             gate=cfg.get("gate", fastpath.DEFAULT_GATE),
                             cues=cfg.get("cues", True))
        fp_ms, fp_verdict = fp["ms"], fp["verdict"]
        if fp["hits"]:
            picked, how = [h["slug"] for h in fp["hits"]], "fastpath"
            if fp.get("cue"):
                how = "fastpath-cue"
    if picked is None:
        picked = pick_by_meaning(store, thinker, question, top) if thinker else None
        if picked is None:
            picked, how = pick_by_words(store, question, top), "words(thinker unreachable)"
        elif not picked:
            # The thinker read the whole index and named nothing. That is an answer —
            # overriding it with word overlap would hand back look-alikes for a
            # question this store knows nothing about. Refusal is a feature.
            how = "meaning→none"
        else:
            how = "meaning"
    order = store.walk(picked, hops)
    parts, used, included = [], 0, []
    for s in order:
        room = chars if total_chars is None else min(chars, total_chars - used)
        if room <= 0:
            break                       # the budget is spent; say so rather than trim to nothing
        piece = f"=== {store.label}: {s} ===\n{fit(store.read(s), question, room)}"
        # A ceiling that is exceeded by a little is not a ceiling. `fit` keeps a memory's
        # opening whole (cutting from the top loses the frontmatter), so a piece can come
        # back larger than the room it was given — in which case it does not go in at all.
        if total_chars is not None and used + len(piece) + 2 > total_chars:
            break
        parts.append(piece)
        included.append(s)
        used += len(piece) + 2
    if order and not included and total_chars:
        # A budget too small for even one memory must not answer with silence. Give back
        # the best-ranked one, cut to fit and labelled as cut: a partial memory is an
        # answer, an empty context reads as "nothing is remembered".
        head = fit(store.read(order[0]), question, max(120, total_chars - 80))
        # The ceiling is on the WHOLE context, header included — the main loop above
        # accounts for it piece by piece, and this branch used to guess a fixed -60
        # margin that a long label + slug walked straight past.
        header = f"=== {store.label}: {order[0]} (truncated) ===\n"
        parts = [header + head[:max(0, total_chars - len(header))]]
        included = [order[0]]
    ctx = "\n\n".join(parts)
    store.note_read(included, "recall")
    return {"store": store.name, "question": question, "how": how, "picked": picked,
            "fastpath_verdict": fp_verdict, "fastpath_ms": fp_ms,
            "fastpath_cue": fp.get("cue"),
            "walked": order, "included": included,
            "dropped_for_budget": [s for s in order if s not in included],
            "context": ctx, "chars": len(ctx), "chars_per_memory": chars,
            "total_chars": total_chars, "tokens_est": estimate(ctx),
            "elapsed_s": round(time.time() - t0, 2)}
```

</details>

**依据 3 · 源码核查**：[distill_kura/fastpath.py:298-322](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/fastpath.py#L298-L322)

callsign先行和_score调用，未外推CueLedger实现。

<details>
<summary>查看原文（25行）</summary>

```text
def lookup(store: Store, question: str, top: int = 3,
           gate: float = DEFAULT_GATE, cues: bool = True, body: bool = True) -> dict:
    """→ {"hits": [{slug, score, heads}…], "verdict": "ok"|"no-confident-hit"|"untestable", "ms"}.

    Empty hits is the honest answer, never a failure: it means "this question needs
    judgement", and the caller falls through to the thinker.

    Before the five heads run, one exact pre-head: a verified USER callsign the
    question contains, unique in the store, routes straight to its memory. It is
    NOT mixed into the scoring (no weights, no gate arithmetic) — the shared word
    either names one memory or the pre-head is silent, and the five heads run
    exactly as before."""
    t0 = time.perf_counter()
    if cues:
        from .cues import CueLedger
        cue = CueLedger(store).direct(question)
        if cue:
            return {"hits": [{"slug": cue["slug"], "score": "cue",
                              "heads": {"cue": cue["cue"]}}],
                    "verdict": "ok", "cue": cue["cue"],
                    "ms": round((time.perf_counter() - t0) * 1000, 3)}
    idx = index_for(store, body=body)
    hits, verdict = _score(idx, question, top, float(gate))
    return {"hits": hits, "verdict": verdict, "cue": None,
            "ms": round((time.perf_counter() - t0) * 1000, 3)}
```

</details>

**依据 4 · 源码核查**：[distill_kura/thinker.py:44-67](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/thinker.py#L44-L67)

出站Bearer/timeout配置。

<details>
<summary>查看原文（24行）</summary>

```text
def bearer_headers(api_key_env: str | None) -> dict:
    """`{"Authorization": "Bearer <key>"}` when the named variable is set and non-empty,
    else `{}`. Empty counts as unset — the rule all three callers (ask, alive and
    payforward._post) already applied separately, in three copies of the same block."""
    key = os.environ.get(api_key_env, "") if api_key_env else ""
    return {"Authorization": f"Bearer {key}"} if key else {}


@dataclass
class Endpoint:
    # No built-in default: an unset url used to silently become 127.0.0.1:8000, so a
    # half-written config sent traffic to whatever happened to be listening there.
    url: str = ""
    model: str = "default"
    api_key_env: str | None = None
    timeout: float = 120.0
    temperature: float = 0.2
    effort: str = "low"              # low | medium | high — mapped onto every dialect
    thinking: bool = False           # for templates that only know enable_thinking
    dialect: str = "vllm"            # vllm | openai | generic — see the module docstring
    extra: dict = field(default_factory=dict)   # merged into the request body verbatim
    name: str = "thinker"
    last_error: str = ""             # why the last call failed, for health and logs
    last_usage: dict | None = None   # usage from the last answered call, when reported
```

</details>

**依据 5 · 源码核查**：[distill_kura/thinker.py:97-146](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/thinker.py#L97-L146)

真实HTTP和有限重试/失败。

<details>
<summary>查看原文（50行）</summary>

```text
    def _choice(self, system: str, user: str, max_tokens: int,
                timeout: float | None, temperature: float | None) -> dict | None:
        """The raw `choices[0]` of one request, or None when the call did not produce
        one. Every caller of this endpoint goes through here, so the retry ladder, the
        `last_error` wording and the "unconfigured is unreachable" rule exist once —
        `ask()` and `ask_full()` differ only in what they read off the reply, never in
        how the call is made."""
        if not self.url:
            self.last_error = "no url configured"
            return None                 # unconfigured is unreachable, not "somewhere else"
        self.last_usage = None
        headers = {"Content-Type": "application/json", **bearer_headers(self.api_key_env)}
        # The note rides the HTTP failure instead of being written to last_error here:
        # written here it was a dead store — every exit path below reassigns last_error
        # before returning, so no operator could ever see it. A missing key surfaces as
        # a 401, and that is the message that needs to say the variable was never set.
        key_note = ("" if not self.api_key_env or "Authorization" in headers
                    else f"; {self.api_key_env} is not set")
        for dialect in (self.dialect, "generic"):
            try:
                req = urllib.request.Request(
                    self.url.rstrip("/") + "/chat/completions",
                    data=json.dumps(self._body(system, user, max_tokens, temperature,
                                               dialect)).encode(),
                    headers=headers)
                with urllib.request.urlopen(req, timeout=timeout or self.timeout) as r:
                    d = json.load(r)
                self.last_usage = d.get("usage") if isinstance(d.get("usage"), dict) else None
                choice = d["choices"][0]
                choice["message"]           # the shape ask() has always demanded
                self.last_error = ""
                return choice
            except urllib.error.HTTPError as e:
                detail = ""
                try:
                    detail = e.read().decode()[:200]
                except Exception:
                    pass
                self.last_error = f"HTTP {e.code} ({dialect} body{key_note}): {detail}"
                # 400 usually means "I do not know that field". Worth one plainer attempt;
                # anything else is a key, a model name or a server, and retrying is noise.
                if e.code != 400 or dialect == "generic":
                    return None
            except (urllib.error.URLError, TimeoutError, OSError) as e:
                self.last_error = f"unreachable: {type(e).__name__}: {e}"
                return None
            except (KeyError, ValueError, IndexError) as e:
                self.last_error = f"unexpected reply shape: {type(e).__name__}: {e}"
                return None
        return None
```

</details>

**依据 6 · 源码核查**：[distill_kura/registry.py:588-598](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/registry.py#L588-L598)

每store模型profile或共享默认。

<details>
<summary>查看原文（11行）</summary>

```text
    def models_for(self, store: Store) -> Models:
        """The model roles THIS store may use.

        One shared set of endpoints means one endpoint sees every store's index, every
        journal and every draft — so separating stores on disk buys nothing against the
        model. A store naming a profile gets that profile and nothing else; an undefined
        profile is a load error rather than a quiet fall back to the shared one."""
        want = store.model_profile
        if not want:
            return self.models
        return self.profiles[want]
```

</details>

#### 缺口

- 未完整审CueLedger/fastpath评分、未跑检索对照与端点兼容。
  **影响**：不能给召回正确率或稳定低延迟保证；低信任域不能只靠store隔离。
  **进一步探讨**：先禁用cues以缩小首试范围，对已知命中/近似/无关/端点断开四类问句核how与证据，再另验callsign机制。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · DSH与MCP适配器是否真正执行只读、模式绑定和取消？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

DSH包通过peer工具库注册工具，设store且不allowSwitch时绑定，去掉参数并强制target而非仅提示词。readonly默认true时不注册remember并装tools.guard，开放时实际POST/remember，这是绕过蒸馏的直接门，描述中的“human explicitly asks”不是人工确认状态机；仍由Python策略再拒绝。HTTP可达者不受这个guard限制。缓存地图同步塞systemPrompt，后台首次取和定时刷新，避免Promise进提示词；卸载清timer未显式取消在飞fetch。call转exec.signal/timeout到AbortController，只停止客户端等待，不能取消Python已进行的模型/写事务。

MCP也有READONLY默认与call_tool拒绝，不是只隐藏列表；KURA_STORE绑定和会话选择是桥进程内状态，不能把共享一个桥视为每用户隔离。WRITE_LOG在HTTP成功之后尽力追加，OSError吞掉，故不是写前授权/强审计保证。DSH Host guard单调契约与真实peer兼容未运行验证，不能据注释称整个部署已只读。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/package.json:20-28](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/package.json#L20-L28)

peer与Node依赖。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*"
  },
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test": "node --import ./test/register.mjs --test test/plugin.test.mjs"
  }
```

**依据 2 · 源码核查**：[dsh-plugin/lib/index.js:126-151](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/lib/index.js#L126-L151)

fetch和本地取消/timeout。

<details>
<summary>查看原文（26行）</summary>

```text
async function call(cfg, method, path, body, signal, headers = {}) {
  const ac = new AbortController();
  const onAbort = () => ac.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => ac.abort(), cfg.timeoutMs);
  try {
    const res = await fetch(cfg.url + path, {
      method,
      signal: ac.signal,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 304) return UNCHANGED;
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`kura answered non-JSON (${res.status}): ${text.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(`kura ${res.status}: ${data.error || text.slice(0, 200)}`);
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/index.js:284-300](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/lib/index.js#L284-L300)

绑定时去store参数与target强制。

<details>
<summary>查看原文（17行）</summary>

```text
 * Strip the `store` parameter from a bound agent's tools.
 *
 * A bound agent cannot use it — `target()` ignores it — so leaving it in the schema
 * only invites the model to try, and every turn pays for describing a parameter that
 * does nothing. (Least disclosure, not a security boundary: a process that can reach
 * the HTTP port can name any store. See docs/TRUST.md.)
 */
function withoutStoreParam(tool) {
  if (!tool.parameters || !("store" in tool.parameters)) return tool;
  const { store, ...rest } = tool.parameters;
  return { ...tool, parameters: rest };
}

function tools(cfg, state) {
  const target = (store) => (state.bound ? cfg.store : store || state.current);

  // Registration order is the schema order a small model sees; the guidance says
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/lib/index.js:517-595](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/lib/index.js#L517-L595)

写工具、guard与实际注册/地图刷新。

<details>
<summary>查看原文（79行）</summary>

```text
  if (!cfg.readonly) {
    list.push(defineTool({
      name: "kura_remember",
      description:
        `Write ONE fact into ${cfg.label}. This bypasses the distiller's evidence gate, so use ` +
        `it only when the human explicitly asks for something to be remembered. One fact per ` +
        `call, with its date in the text. The index line you give is a recognition trigger, not ` +
        `a summary: it is read every single time, the body only when opened.`,
      parameters: {
        slug: { type: "string", description: "kebab-case id", required: true },
        description: {
          type: "string",
          description: "One index line — a recognition trigger, not a summary",
          required: true,
        },
        body: { type: "string", description: "The fact itself", required: true },
        store: { type: "string", description: "Which kura. Omit for the current one." },
      },
      output: TEXT,
      async execute(args, exec) {
        const to = target(args.store);
        const d = await call(cfg, "POST", "/remember" + q(to),
          { slug: args.slug, description: args.description, body: args.body }, exec?.signal);
        return `${head(to)} ${JSON.stringify(d)}`;
      },
    }));
  }

  return state.bound ? list.map(withoutStoreParam) : list;
}

/**
 * Rule 3: read-only is enforced outside the tools. A monotonic guard cannot be
 * overturned by another listener, so the deployment stays read-only even if some other
 * plugin would rather allow the call.
 */
function readonlyGuard(cfg) {
  return (execution) => {
    if (execution.name !== "kura_remember") return undefined;
    return `${cfg.label} is read-only here. Memories enter through the distiller's evidence ` +
      `gate (kura distill run / drain), not by a tool call.`;
  };
}

function apply(ctx, config) {
  const cfg = settle(config);
  // Bound = pinned to one kura for this agent: the preset IS the mode switch.
  const state = {
    current: cfg.store,
    bound: cfg.store !== "" && !cfg.allowSwitch,
    map: emptyMap(cfg.store),
    // selector → the store the server resolves it to; a mode's target does not move.
    resolved: new Map(),
  };
  const cache = mapCache(cfg, state);
  state.cache = cache;

  for (const tool of tools(cfg, state)) {
    ctx.effect(() => ctx.tools.register(tool), `distill-kura.${tool.name}`);
  }
  if (cfg.readonly) {
    ctx.effect(() => ctx.tools.guard(readonlyGuard(cfg)), "distill-kura.readonly-guard");
  }

  if (cfg.prefill) {
    // Synchronous by contract: hand back the cached string, never a Promise.
    ctx.effect(
      () =>
        ctx.systemPrompt.section({
          name: "distill-kura:map",
          order: cfg.promptOrder,
          text: () => cache.text(),   // arrow: keeps `this` = cache inside text()
        }),
      "distill-kura.map-section",
    );
    cache.refresh();                       // first fill, not awaited
    const timer = setInterval(() => { cache.refresh(); }, cfg.refreshMs);
    if (typeof timer.unref === "function") timer.unref();
    ctx.effect(() => () => clearInterval(timer), "distill-kura.map-refresh");
```

</details>

**依据 5 · 源码核查**：[distill_kura/mcp.py:54-64](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/mcp.py#L54-L64)

绑定环境与默认readonly。

<details>
<summary>查看原文（11行）</summary>

```text
_RAW_STORE = os.environ.get("KURA_STORE")
STORE = (_RAW_STORE or "").strip()                      # "" = free mode
if _RAW_STORE is not None and _RAW_STORE != "" and not STORE:
    # A preset that meant to bind, bound to nothing: whitespace collapsed to free mode
    # and the other kura's memories came back through it.
    sys.exit("KURA_STORE is set to whitespace. Unset it for free mode, or name a store.")
LABEL = os.environ.get("KURA_LABEL", "the kura")
READONLY = os.environ.get("KURA_READONLY", "1") not in ("", "0", "false", "no")
WRITE_LOG = os.environ.get("KURA_WRITE_LOG", "")
PROTOCOL_VERSION = "2025-06-18"

```

</details>

**依据 6 · 源码核查**：[distill_kura/mcp.py:283-299](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/mcp.py#L283-L299)

实际调用时再拒写。

<details>
<summary>查看原文（17行）</summary>

```text
def call_tool(name: str, args: dict) -> str:
    global _session_store
    if READONLY and name == "kura_remember":
        raise PermissionError(
            "this bridge is read-only: memories enter through the distiller's evidence "
            "gate, not by tool call (set KURA_READONLY=0 to allow writing)")
    if name not in {t["name"] for t in TOOLS}:
        raise ValueError(f"unknown tool: {name}")
    store = _store_arg(args)

    if name == "kura_list":
        if STORE:
            return f"This agent is bound to the '{STORE}' kura."
        d = http("GET", "/stores")
        cur = store or d.get("default")
        lines = [f"current: {cur}"]
        for n, s in (d.get("stores") or {}).items():
```

</details>

**依据 7 · 源码核查**：[distill_kura/mcp.py:361-378](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/mcp.py#L361-L378)

HTTP写后审计尽力失败吞掉。

<details>
<summary>查看原文（18行）</summary>

```text
    if name == "kura_remember":
        d = http("POST", "/remember" + _q(store),
                 {"slug": args.get("slug"), "description": args.get("description"),
                  "body": args.get("body"), "tags": args.get("tags"),
                  **{k: args[k] for k in ("belongs_because", "keep", "may_fade") if args.get(k)}})
        if WRITE_LOG:
            try:
                # A bare filename has no directory component; os.makedirs("") raised
                # FileNotFoundError, which the except swallowed, so write-logging
                # silently never happened.
                os.makedirs(os.path.dirname(WRITE_LOG) or ".", exist_ok=True)
                with open(WRITE_LOG, "a", encoding="utf-8") as f:
                    f.write(json.dumps({"ts": time.strftime("%Y-%m-%dT%H:%M:%S"),
                                        "store": store, "args": args, "result": d},
                                       ensure_ascii=False) + "\n")
            except OSError:
                pass
        return json.dumps(d, ensure_ascii=False)
```

</details>

#### 缺口

- 没有真实Host/MCP会话/取消实验。
  **影响**：只支持源码接线，不保证宿主guard语义/断连后的后台行为。
  **进一步探讨**：固定Host和单独桥进程，在副本用已取消信号/超时核请求、服务任务与记忆状态，避免把abort当回滚。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样付出可控代价验证，而不是直接积累私密错误记忆？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议限定试用：有Python/本地推理运维能力的单人维护者，用脱敏日志副本、独立loopback进程/新库先禁cues，保持DSH readonly且服务distiller-only；显式绑定store和每库journal/model profile，先核四类recall路径，再人工看一轮run草稿与原文，决定是否pour。不要一开始接私密长期日志、开放端口、多信任域或自动night/tend。任一跨库返回、无原文支持/把pending当空、客户端超时且库状态不清，就停调用并查副本doctor/原文件，回手工Markdown；不推荐直接生产常驻。

首次是Python>=3.11配置/库备份，DSH另需Node>=20与同一peer；外部推理按端点计费/本地机器成本未知。持续有整索引prompt、brain/novelty/scribe/judge多轮、草稿原文审查、pending/WAL/工坊存储与模型兼容维护；无embedding不代表免费。失败恢复须分模型不可达、候选被拒、写入结果不明及WAL隔离，不能统一重跑。退出先停止调度/服务与适配，保留规范Markdown和证据/工坊/密钥备份；清除需另决定，远端模型已见数据不能靠卸载收回。作者基准不作本次省时/准确率/现金收益。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:5-30](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/pyproject.toml#L5-L30)

根安装/运行要求。

<details>
<summary>查看原文（26行）</summary>

```text
[project]
name = "distill-kura"
version = "0.3.0"
description = "Distilled long-term memory for agents: recall by meaning, write only what evidence supports"
readme = "README.md"
requires-python = ">=3.11"
license = { text = "MIT" }
authors = [{ name = "Lna-Lab" }]
keywords = ["memory", "llm", "agent", "rag", "long-term-memory", "dsh-plugin"]
classifiers = [
  "Programming Language :: Python :: 3.11",
  "Programming Language :: Python :: 3.12",
  "Programming Language :: Python :: 3.13",
  "License :: OSI Approved :: MIT License",
  "Topic :: Scientific/Engineering :: Artificial Intelligence",
]
dependencies = []          # standard library only, on purpose

[project.optional-dependencies]
dev = ["pytest>=7"]
# Exact token counting is a benchmarking concern, never a runtime one: the core must
# stay installable with nothing behind it.
bench = ["tokenizers>=0.15"]

[project.scripts]
kura = "distill_kura.cli:main"
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/package.json:20-28](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/package.json#L20-L28)

适配要求。

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": "*"
  },
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test": "node --import ./test/register.mjs --test test/plugin.test.mjs"
  }
```

**依据 3 · 作者声明**：[docs/TRUST.md:19-55](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/docs/TRUST.md#L19-L55)

信任级别的部署代价。

<details>
<summary>查看原文（37行）</summary>

````text
## The rule

**One trust level per process.** Do not put a private store and a less-trusted store in
the same registry, and do not point a less-trusted agent at a server that holds one.

```
                 ┌── shared / neutral ──────────┐   ┌── private ─────────────────┐
  config         │ kura-shared.toml             │   │ kura-private.toml          │
  process        │ port 8085 (or a unix socket) │   │ port 8086, different user   │
  stores         │ shared-notes, scratch        │   │ project-alpha               │
  models         │ any endpoint you like        │   │ a local endpoint only       │
  agents         │ any                          │   │ the private preset only     │
                 └──────────────────────────────┘   └────────────────────────────┘
```

Concretely:

- A separate `kura.toml` per trust level. **Do not even list a private store's name in a
  shared config** — a name, a label and a memory count are themselves information.
- A separate process and port per trust level. A unix domain socket behind a reverse
  proxy is better than a TCP port if you have the option.
- A separate OS user, or a container, where the levels really differ. File permissions
  are the boundary that actually holds.
- Never mount a private store's directory into a less-trusted process, workspace or
  container.
- Never put a private config inside a repository a less-trusted agent can read.
- Bind every agent: `store: "…"` in the plugin (which now binds by itself), or
  `KURA_STORE=…` for the MCP bridge.
- Set `write_policy` deliberately per store — see below.

## Why not one process with access control

A permission layer inside a single process would have to be trusted by everything in
that process, and this is a small dependency-free core whose value is that you can read
all of it. An OS user boundary is stronger, older and easier to verify than any token
check we could add. If you need multi-tenant serving with authentication, put a proxy in
front and keep one kura process per tenant behind it.
````

</details>

**依据 4 · 作者声明**：[docs/TRUST.md:109-126](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/docs/TRUST.md#L109-L126)

journal范围独立与重叠风险。

<details>
<summary>查看原文（18行）</summary>

````text
## Journal intake is a boundary too

Separating memories buys nothing if both stores drink from the same journal. With more
than one store configured, the distiller **refuses to guess**: bind each store to its
own root.

```toml
[stores.maker.distill.journals]
dsh = "~/dsh/sessions-maker"

[stores.eq.distill.journals]
dsh = { root = "~/dsh/sessions", exclude_glob = ["**/maker-*/**"] }
```

The registry also refuses, at load, a journal root that contains a store: the distiller
would re-ingest memories as raw material and file model-written text as the human's
words, which breaks the one guarantee the evidence gate gives. Override with
`[server] allow_path_overlap = true` only if you understand exactly why you want it.
````

</details>

**依据 5 · 源码核查**：[distill_kura/recall.py:45-57](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/recall.py#L45-L57)

整索引请求成本路径。

<details>
<summary>查看原文（13行）</summary>

```text
def pick_prompt(store: Store) -> str:
    """The exact system prompt the thinker is asked to pick with.

    Factored out for `warm.py`: warming the mouth's prefix cache only works when the
    bytes it prefills are the bytes recall will send. Two copies of this concatenation
    would drift the first time either side was touched, and the drift is invisible —
    the warm pass still "succeeds", recall still pays the cold prefill.
    """
    return PICK_SYS.format(label=store.label) + store.index_text()


def pick_by_meaning(store: Store, thinker: Endpoint, question: str, top: int) -> list[str] | None:
    raw = thinker.ask(pick_prompt(store), question, max_tokens=500)
```

</details>

**依据 6 · 源码核查**：[distill_kura/distill/pipeline.py:1402-1430](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1402-L1430)

brain与novelty调用。

<details>
<summary>查看原文（29行）</summary>

```text
        t0 = time.time()
        cands, failure = self.spot_checked(segs)
        if failure:
            # NOT zero candidates: the brain never answered. The mark has already moved
            # past this stretch and does not come back, so the segments themselves are
            # what the caller shelves — nothing here may look like a finished batch.
            _log(f"  ⚠ the brain did not answer ({failure['reason']}): {failure['detail'][:120]}")
            self._metric({"source_key": key, "segments": len(segs), "by_class": by,
                          "raw_chars": raw_chars, "pending": failure["reason"],
                          "pending_detail": failure["detail"][:200]})
            return {"failure": failure}
        _log(f"  brain found {len(cands)} candidates ({time.time()-t0:.1f}s)")
        kept, dropped, ideas = gate(cands, segs, self.store_text())
        for i in ideas:
            self.seeds.sow(f"{i.get('topic')} — {i.get('why')}", "brain/spot")
            _log(f"    🌱 seed: {i.get('topic')} — {str(i.get('why'))[:70]}")
        sown += len(ideas)
        killed += len(dropped)
        for d in dropped:
            _log(f"    ✗ {d.get('topic')} — {d['why_dropped']}")
            with open(os.path.join(self.still, "dropped.jsonl"), "a", encoding="utf-8") as f:
                f.write(json.dumps({**d, "at": datetime.now(timezone.utc).isoformat()},
                                   ensure_ascii=False) + "\n")

        to_write = []
        for c in kept:
            near = kura_recall(self.store, self.models.thinker,
                               c.get("why") or c["topic"], hops=0, top=3, chars=1200)
            verdict, why, target = self.novelty(c, near)
```

</details>

**依据 7 · 源码核查**：[distill_kura/distill/pipeline.py:1480-1509](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1480-L1509)

并行scribe和pending代价。

<details>
<summary>查看原文（30行）</summary>

```text
        drafted, draft_chars, draft_text = [], 0, []
        if to_write:
            t1 = time.time()
            def _one(cn):
                fails: list[str] = []
                try:
                    return cn[0], self.compose(cn[0], cn[1], fails), fails
                except Exception as ex:      # a transport fact, not a verdict
                    return cn[0], None, fails + [f"{type(ex).__name__}: {ex}"]

            with ThreadPoolExecutor(max_workers=self.slots) as pool:
                for c, d, fails in pool.map(_one, to_write):
                    if not d and fails:
                        # The scribe was unreachable. The journal behind this candidate
                        # is past the mark, so the candidate and its evidence packet are
                        # kept whole for the next pass — the retry unit here is one
                        # candidate, not the batch.
                        f = self.pending_compose.save(
                            {"kind": "compose", "key": key, "path": path,
                             "candidate": c, "reason": "scribe error",
                             "detail": fails[0][:200]})
                        composes_pending += 1
                        _log(f"      ⚠ the scribe did not answer — kept for a retry "
                             f"({os.path.basename(f)}): {fails[0][:120]}")
                        continue
                    if not d:
                        _log("      the scribe did not keep the shape")
                        continue
                    _log(f"      wrote {d['slug']} → {os.path.basename(self.stage(d, path))}")
                    made.append(d["slug"])
```

</details>

#### 缺口

- 没有安装/宿主、脱敏集对照或持续运营成本。
  **影响**：只有受控副本试用依据，不能承诺生产ROI。
  **进一步探讨**：记录错记/漏召回、每轮模型usage、人工审阅和恢复分钟，与手工Markdown同集对照后再决定是否常驻。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 下一步值得验证什么增量？

**研究主题**：新假设与验证

#### 完整回答

候选是把跨阶段结果做成同一操作收据：候选已拒/草稿待审/规范已提交/附属动作失败/客户端结果未知分别呈现，携带store、manifest、revision与请求id，再据其决定能否重试。推导自run只产草稿、pour后重命名及receipt不与规范记忆同事务、客户端abort不回滚；不宣称本版已经重复写或丢数据。与仅看ok/HTTP成功的基线比较，在端点断开、写后重命名故障、请求超时三样本中测误重试/错误已完成判断与审阅负担。若现有doctor/结果字段已足以稳定区分，或收据维护负担更大，则推翻该方向。

#### 证据与依据

**依据 1 · 源码核查**：[distill_kura/distill/pipeline.py:945-978](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L945-L978)

规范提交后仍有后续动作。

<details>
<summary>查看原文（34行）</summary>

```text
        r = self.store.pour_verified(slug_out, desc, new_body,
                                     type_=kind.group(1) if kind else "project",
                                     title=title,
                                     meta={"evidence_manifest": man.group(1)} if man else None,
                                     tags=tags, annotations=ann)
        if r.get("ok"):
            # Numbered, like the staging side: a later draft of the same slug is
            # staged under the plain name again (the poured one no longer occupies
            # `<slug>.md`), and renaming straight onto `<slug>.md.poured` destroyed
            # the earlier draft's text, evidence header and mark with no trace.
            os.rename(p, _free_path(os.path.dirname(p), os.path.basename(p)[:-3],
                                    ".md.poured"))
            self._store_text = None
            # The route becomes real only now that the memory does. A staged draft
            # carried its cues as provenance; a TOSSed or quarantined one never
            # reaches this line, so no unpoured draft can grow a route. A receipt
            # that cannot be minted does NOT fail the pour — but it is never
            # silent: the result says so.
            cue_receipt = "none"
            if man:
                hexd = man.group(1).split("sha256:", 1)[-1]
                vm = self.store.load_manifest_verified(hexd)
                if vm and vm.get("routing_cues"):
                    from ..cues import CueLedger
                    res = CueLedger(self.store).issue(
                        memory_slug=slug_out,
                        evidence_manifest=f"sha256:{hexd}",
                        routing_cues=vm["routing_cues"],
                        accepted_via="extends" if head.get("EXTENDS") else "new")
                    cue_receipt = "issued" if res["ok"] else f"failed: {res['why']}"
                    if not res["ok"]:
                        _log(f"  ⚠ cue receipt refused for {slug_out} — {res['why']}")
            if cue_receipt != "none":
                r["cue_receipt"] = cue_receipt
```

</details>

**依据 2 · 源码核查**：[distill_kura/distill/pipeline.py:1669-1678](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/distill_kura/distill/pipeline.py#L1669-L1678)

run草稿/pending结果。

<details>
<summary>查看原文（10行）</summary>

```text
        made = tally["drafts"]
        answer = {"ok": pending_file is None, "drafts": made,
                  "dropped": tally["dropped"], "covered": tally["covered"],
                  "recurred": tally["recurred"], "seeds": tally["seeds"],
                  "cue_receipts": tally["cue_receipts"],
                  "cue_receipt_failures": tally["cue_receipt_failures"],
                  "pending": tally["pending_left"] + tally["composes_pending"]}
        if pending_file:
            return {**answer, "why": "brain error", "pending_file": pending_file,
                    "reason": pending_reason}
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/lib/index.js:126-151](https://github.com/lna-lab/distill-kura/blob/3a02c04e5155cd66d49cfd95d11b09239499c97d/dsh-plugin/lib/index.js#L126-L151)

本地取消不带事务协议。

<details>
<summary>查看原文（26行）</summary>

```text
async function call(cfg, method, path, body, signal, headers = {}) {
  const ac = new AbortController();
  const onAbort = () => ac.abort();
  signal?.addEventListener("abort", onAbort, { once: true });
  const timer = setTimeout(() => ac.abort(), cfg.timeoutMs);
  try {
    const res = await fetch(cfg.url + path, {
      method,
      signal: ac.signal,
      headers: { "Content-Type": "application/json", ...headers },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (res.status === 304) return UNCHANGED;
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`kura answered non-JSON (${res.status}): ${text.slice(0, 200)}`);
    }
    if (!res.ok) throw new Error(`kura ${res.status}: ${data.error || text.slice(0, 200)}`);
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onAbort);
  }
```

</details>

#### 缺口

- 收据需求及净价值未验证。
  **影响**：仅本次推演，不计现有贡献。
  **进一步探讨**：先以三故障样本盲读现有返回与拟议状态，比较错误重试和人工判读，再决定是否实现。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
