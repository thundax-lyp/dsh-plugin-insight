# EverOS

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[5b0979b](https://github.com/EverMind-AI/EverOS/tree/5b0979b1b7f3a0cbe235756ff098515ec490753e)

<!-- BEGIN META -->
[![GitHub ★ 13,600](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C600&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EverMind-AI/EverOS)
<!-- END META -->

> **功能**：以Markdown为真相源的本地优先记忆运行时，同步SQLite/LanceDB索引并支持用户与Agent记忆。

> **亮点**：将Markdown原件、错误可定位的派生索引与用户/agent轨道组合成可审阅纠错路径；抽取/排名依赖everalgo与模型，不宣称新算法。见 [Q02](#research-q02)。

> **主要限制**：有损抽取/合并和异步索引不保证下游事实正确；抽取非幂等且客户端取消后仍可能落写，盲重发风险需验收。见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要EverOS的记忆或运行系统定位，既有办法和合格产物是什么？](#detail-section-11)
  - [Q02 · 记忆写入、检索与生命周期怎样接线，具体增量来自哪里？](#detail-section-12)
  - [Q03 · 记忆组织机制能否改善最终任务？](#detail-section-13)
  - [Q04 · 启动、持续使用和失败恢复分别依赖什么，由谁承担成本？](#detail-section-14)
  - [Q05 · 由已确认机制与限制可提出什么可证伪改进，什么人值得试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：小团队开发者跨会话/应用保留并可修正事实与经验，以后续任务正确使用当前记忆为交付。

人工Markdown笔记加关键词检索、普通RAG与宿主项目文档是替代；同任务控制模型与检索预算比较语义正确和人工时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用户/Agent记忆 | 分轨保存事实与经验 | 抽取依赖模型且可能有损 |
| 派生检索 | keyword或可选语义检索 | 索引异步，scope非认证保证 |
| 直接编辑/重建 | 人审Markdown并恢复索引 | 传播/删除需验收 |
| 离线反思 | 聚类合并与再抽取 | 默认关闭，需LLM/embedding且不保证质量 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Python≥3.12及锁定库 | 启动必需 | runtime/SQLite/LanceDB | fresh install需兼容验收 |
| 可写memory root与scope | 持久记忆必需 | Markdown真相源/索引分区 | 路径或scope错误需停止写入核对 |
| LLM端点/密钥 | 抽取/边界必需 | 对话转记忆 | keyword可用不代表写入无需LLM |
| embedding/rerank/反思能力 | 对应方法必需 | 语义检索与演化 | 可退keyword，reflection默认关闭 |
| 外部DSH适配 | DSH集成必需 | 宿主接线 | 当前根研究不证明适配可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 开发者隔离root与scope、固定依赖/端点 | 手工原件与索引可读 |
| 2 | 开发者导入小样本并检索当前事实 | 原件/队列/结果一致，不以accepted当可检索 |
| 3 | 用户纠错/删除、断连并重建 | 无旧事实泄漏或重复抽取，否则停用演化核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Python/本地存储与模型导入资源未知 | scope/端点/依赖和导入核对 | 锁依赖与fresh install需验收 |
| 持续使用 | 抽取/embedding/检索/反思及索引维护 | 事实纠正、监控和备份 | local-first不等于本地推理或免费 |
| 失败恢复 | 重建/重试/重复抽取资源未知 | 核对原件、队列和已提交memcell | 非幂等写入不能盲重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可编辑记忆 | Markdown写入与scope存在 | 人工纠错是否完整传播 |
| 检索 | 派生队列、keyword/分轨接线 | 新鲜度、隔离与下游质量 |
| 演化 | 反思默认关、合并后再抽取/弃用 | 有损合并是否减少最终错误 |
| 运维 | 有界并发/重试与错误分类 | 长期磁盘/恢复/TCO |

> **思考**：有损抽取/合并和异步索引不保证下游事实正确；抽取非幂等且客户端取消后仍可能落写，盲重发风险需验收。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将Markdown原件、错误可定位的派生索引与用户/agent轨道组合成可审阅纠错路径；抽取/排名依赖everalgo与模型，不宣称新算法。见 [Q02](#research-q02)。

单文件fsync/replace、session锁后supervisor抽取、有界cascade与错误分类值得借鉴；原件可重建索引不等于全局事务一致，恢复应区分写入、抽取和索引阶段。reflection保留再抽取成功门槛，但语义正确仍需任务对照。

<a id="detail-section-5"></a>

### 1.4 主要限制

有损抽取/合并和异步索引不保证下游事实正确；抽取非幂等且客户端取消后仍可能落写，盲重发风险需验收。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用单用户非敏感记忆，先关reflection测人工笔记基线，再验证纠错、删除、重建与断连；DSH适配单独验收。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持可编辑原件、派生索引和双轨机制；最终任务改善、恢复与DSH适配未验证；记忆状态门控是假设。

- 已检查：作者 README、包清单、源码路径 pyproject.toml、docs/storage_layout.md、docs/reflection.md、src/everos/service/memorize.py、src/everos/service/search.py、src/everos/core/persistence/markdown/writer.py、src/everos/memory/cascade/worker.py、src/everos/memory/reflection/orchestrator.py、src/everos/memory/strategies/reflect_episodes.py、src/everos/memory/search/manager.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件为Python记忆基础设施；抽读memorize/search/writer/cascade/reflection及依赖，不审计全API/所有算法/认证，不读取外部DSH适配，不运行目标代码。inventory的JS/TS/Markdown统计不含Python LOC，不能推断核心规模。
- 下一步：20个时序/否定/纠正/跨项目任务，reflection关/开、索引故障与客户端断连矩阵，核对合格率、传播延迟、全部模型成本和人工纠错。

**分析版本**

- **仓库**：[EverMind-AI/EverOS](https://github.com/EverMind-AI/EverOS)
- **版本号**：未声明（[固定提交 5b0979b](https://github.com/EverMind-AI/EverOS/tree/5b0979b1b7f3a0cbe235756ff098515ec490753e)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的修正版本/索引状态/原件引用门控可能减少陈旧和误合并错误；20个纠错任务控制模型预算比较，错误不降则否定。见 [Q05](#research-q05)。

20个时序/否定/纠正/跨项目任务，reflection关/开、索引故障与客户端断连矩阵，核对合格率、传播延迟、全部模型成本和人工纠错。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 66 | 14308 | — | — | 80189 |
| .mjs | source | 1 | 199 | 179 | 1 | — |
| .mjs | test | 1 | 197 | 175 | 14 | — |
| .md | example | 2 | 174 | — | — | 1115 |
| .js | source | 17 | 2832 | 1862 | 585 | — |
| .cjs | source | 2 | 35 | 35 | 0 | — |
| .ts | source | 17 | 3332 | 2621 | 316 | — |
| .tsx | source | 9 | 1032 | 918 | 28 | — |

</details>

**活跃度**

[![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/EverMind-AI/EverOS/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交与截止时间的源码范围内，判断EverOS的Markdown记忆、派生索引和离线演化能否改善跨会话任务，以及关键一致性、质量与成本边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要EverOS的记忆或运行系统定位，既有办法和合格产物是什么？

**研究主题**：场景与需求

#### 完整回答

目标是需要跨会话、跨应用保留用户事实和agent经验，同时希望能直接审阅/修正数据的小团队开发者。输入是对话、文件或agent轨迹，合格结果是在后续任务检索到当前正确且属于相应app/project/owner的记忆，帮助完成任务；写出Markdown或命中向量不是最终成功。简单替代是人工维护项目笔记/AGENTS文档并关键词搜索，或普通RAG存储；EverOS新增抽取、用户/agent轨道和派生索引维护，但也加入模型判断与后台运维。根仓库是Python库/本地记忆runtime，README的DSH入口链接到另一plugins仓库，本轮未检查该适配，因此不称本根组件已提供可验收DSH插件。README对其他记忆库的泛化比较是作者观点，不当作全行业事实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:37-43](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/README.md#L37-L43)

作者本地优先/Markdown/索引定位

```text
## Why EverOS

EverOS is a Python library and local-first memory runtime for agents and
makers. It gives one portable memory layer across coding assistants, apps,
devices, and workflows from day one. It stores conversations, files, and agent
trajectories as readable Markdown, then syncs local SQLite and LanceDB indexes
for fast retrieval and self-evolving reuse.
```

**依据 2 · 作者声明**：[README.md:96-106](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/README.md#L96-L106)

生态适配链接在外部仓库

<details>
<summary>查看原文（11行）</summary>

```text
<tr>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/dsh"><img src="https://avatars.githubusercontent.com/u/148330874?s=200&amp;v=4" alt="DeepSeek Harness" width="72"><br><strong>DeepSeek Harness</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/hermes"><img src="https://github.com/user-attachments/assets/477eebc4-e615-4425-921e-368d7667e491" alt="Hermes" width="72"><br><strong>Hermes</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins/tree/main/openclaw"><img src="https://github.com/user-attachments/assets/01d948fe-1e2b-48e8-9b32-b8057cb3f336" alt="OpenClaw" width="72"><br><strong>OpenClaw</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/Raven"><img src="https://github.com/user-attachments/assets/27e1ea63-69d4-48b3-a884-7f0355926907" alt="Raven" width="72"><br><strong>Raven</strong></a></td>
<td width="400" align="center"><a href="https://github.com/EverMind-AI/plugins#plugins"><img src="https://raw.githubusercontent.com/langgenius/dify/280f81757d5fdea9c2dd804483c7f70c2e95cd9a/web/public/logo/logo-site.png" alt="Dify" width="112"><br><strong>Dify</strong></a></td>
</tr>
</table>

<br>

```

</details>

**依据 3 · 源码核查**：[pyproject.toml:1-11](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/pyproject.toml#L1-L11)

Python库及版本身份

<details>
<summary>查看原文（11行）</summary>

```text
[project]
name = "everos"
version = "1.5.1"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
authors = [
    {name = "EverMind AI"},
]
keywords = ["memory", "ai-agent", "markdown", "lancedb", "rag", "everos"]
```

</details>

#### 缺口

- 真实跨会话任务、纠错与人工笔记基线未收集
  **影响**：无法确认记忆价值和目标用户采用意愿
  **进一步探讨**：取得匿名重复任务，比较事实错误/纠正时间与最终合格交付

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 记忆写入、检索与生命周期怎样接线，具体增量来自哪里？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

memorize在session锁内做ingest和边界分组，随后由supervisor持有抽取任务，shield使客户端断开不取消已提交memcell的抽取。用户/agent双pipeline产生记忆，Markdown writer将临时文件fsync后原子替换；cascade把Markdown变化作为持久队列交给kind handler，成功才mark_done，服务错误有有界重试，其他错误转人工修复。search按owner/app/project编译过滤，用户检索episodes/profile与未处理消息，agent检索cases/skills，keyword在未配置embedding/rerank/LLM时仍能用。相对只做向量upsert，具体增量是可编辑原件与可重建索引、不同记忆轨道、可见失败队列共同组成纠错路径。抽取/排名算法主要依赖everalgo和模型，不将外部算法算此仓库原创。文件原子替换是单文件保证，不是Markdown/SQLite/LanceDB全局同步事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/service/memorize.py:315-344](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/service/memorize.py#L315-L344)

已提交抽取由supervisor持有，客户端取消不等于撤销

<details>
<summary>查看原文（30行）</summary>

```text
                payload,
                mode=mode,
                boundary_cfg=boundary_cfg,
                is_final=is_final,
                defer_extraction=defer_extraction,
                boundary_timeout=timeout_s,
            )
        finally:
            lock.release()
        if isinstance(prepared, MemorizeResult):
            return prepared
        ingested, boundary = prepared
        # The cells exist, so their extraction must not die with a cancelled
        # request (a client that went away). The task is owned by the
        # module's supervisor, which keeps it, retrieves its outcome and
        # waits for it at shutdown; the request only shields it.
        extraction = extractions.supervise(
            _extract(payload, ingested, boundary, mode=mode),
            session_id=session_id,
            memcell_ids=boundary.memcell_ids,
        )
        try:
            return await asyncio.shield(extraction)
        except asyncio.CancelledError:
            logger.warning(
                "memorize_extraction_continues_after_cancel",
                session_id=session_id,
                memcell_ids=boundary.memcell_ids,
            )
            raise
```

</details>

**依据 2 · 源码核查**：[src/everos/core/persistence/markdown/writer.py:138-164](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/core/persistence/markdown/writer.py#L138-L164)

路径边界与fsync/replace

<details>
<summary>查看原文（27行）</summary>

```text
    async def write(self, path: Path, content: str) -> Path:
        """Atomically write ``content`` to ``path``.

        Steps:
            1. Assert the target resolves inside the memory root.
            2. ``mkdir -p`` the parent directory.
            3. Write to ``<parent>/.<name>.tmp.<uuid>``.
            4. ``flush`` + ``fsync`` the temp file.
            5. ``os.replace`` the temp file onto ``path`` (atomic on POSIX).

        Returns:
            ``path`` (resolved as written).

        Raises:
            PathTraversalError: If ``path`` resolves outside the memory root.
        """
        target = Path(path)
        self._ensure_within_root(target)
        await anyio.Path(target.parent).mkdir(parents=True, exist_ok=True)
        tmp = target.parent / f".{target.name}.tmp.{uuid.uuid4().hex}"
        try:
            await anyio.to_thread.run_sync(_write_and_fsync, tmp, content)
            await anyio.to_thread.run_sync(_replace_with_retry, tmp, target)
        except Exception:
            # Best-effort cleanup of the staging file on failure.
            await _unlink_quiet(tmp)
            raise
```

</details>

**依据 3 · 源码核查**：[src/everos/memory/cascade/worker.py:813-835](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/cascade/worker.py#L813-L835)

handler缺失/重试预算失败状态

<details>
<summary>查看原文（23行）</summary>

```text
        handler = self._handlers.get(row.kind)
        if handler is None:
            await md_change_state_repo.mark_failed(
                row.md_path,
                retryable=False,
                error=f"no handler registered for kind {row.kind!r}",
                new_retry_count=row.retry_count,
            )
            return None

        if row.retry_count >= _MAX_TOTAL_RETRIES:
            logger.warning(
                "cascade_worker_retry_budget_exhausted",
                md_path=row.md_path,
                kind=row.kind,
                retry_count=row.retry_count,
            )
            await md_change_state_repo.mark_failed(
                row.md_path,
                retryable=False,
                error=f"retry budget exhausted after {row.retry_count} attempts",
                new_retry_count=row.retry_count,
            )
```

</details>

**依据 4 · 源码核查**：[src/everos/memory/cascade/worker.py:842-907](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/cascade/worker.py#L842-L907)

handler执行、错误分类与mark_done

<details>
<summary>查看原文（66行）</summary>

```text
                if row.change_type == "deleted":
                    outcome = await handler.handle_deleted(row.md_path)
                else:
                    try:
                        outcome = await handler.handle_added_or_modified(row.md_path)
                    except FileNotFoundError:
                        # The md disappeared between scanner enqueue and here
                        # (delete/modify race — cascade delete event may not
                        # arrive if it fires while the row is already in
                        # ``processing``). Fold into a deletion so the row
                        # completes with ``mark_done`` instead of failing.
                        outcome = await handler.handle_deleted(row.md_path)
            except ExternalServiceError as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                logger.warning(
                    "cascade_worker_recoverable",
                    md_path=row.md_path,
                    attempt=attempt,
                    error=last_error,
                )
                if attempt < self._max_retry:
                    retry_count += 1
                    await asyncio.sleep(self._retry_backoff * (attempt + 1))
                    continue
                # Inline attempts exhausted. Only stay retryable when
                # the cross-cycle budget still has room; otherwise
                # demote directly instead of taking an extra scanner
                # cycle to hit the entry-check short-circuit.
                await md_change_state_repo.mark_failed(
                    row.md_path,
                    retryable=retry_count < _MAX_TOTAL_RETRIES,
                    error=last_error,
                    new_retry_count=retry_count,
                )
                return None
            except Exception as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                self._unrecoverable_total += 1
                logger.exception(
                    "cascade_worker_unrecoverable",
                    md_path=row.md_path,
                    kind=row.kind,
                    unrecoverable_total=self._unrecoverable_total,
                )
                await md_change_state_repo.mark_failed(
                    row.md_path,
                    retryable=False,
                    error=last_error,
                    new_retry_count=retry_count,
                )
                return None

            logger.info(
                "cascade_worker_processed",
                md_path=row.md_path,
                kind=row.kind,
                change_type=row.change_type,
                upserted=outcome.upserted,
                deleted=outcome.deleted,
                skipped=outcome.skipped,
            )
            await md_change_state_repo.mark_done(row.md_path)
            # Only flag the kind as "touched" when we actually wrote
            # something — skipped rows leave the table untouched, so
            # optimizing would be pure overhead.
            return row.kind if (outcome.upserted or outcome.deleted) else None
```

</details>

**依据 5 · 源码核查**：[src/everos/service/search.py:8-18](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/service/search.py#L8-L18)

可选组件与keyword退化设计

<details>
<summary>查看原文（11行）</summary>

```text
Component policy (matches :class:`SearchManager` guards):

* Embedding / rerank / LLM clients are **optional at boot**; the manager
  is built lazily and only the methods that need them fail (with a clear
  message) when the corresponding section of settings is empty.
* ``KEYWORD`` searches therefore work without any of the three clients,
  which makes the endpoint usable in a freshly-installed dev setup.
* All three providers are pulled from their process-wide capability /
  singleton accessors (:func:`get_embedding_capability`,
  :func:`get_rerank_capability`, :func:`get_llm_client`); this module
  never keeps parallel singletons of its own.
```

</details>

**依据 6 · 源码核查**：[src/everos/memory/search/manager.py:214-238](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/search/manager.py#L214-L238)

scope过滤与user/agent检索路径

<details>
<summary>查看原文（25行）</summary>

```text
            where = compile_filters(
                req.filters,
                owner_id=req.owner_id,
                owner_type=req.owner_type,
                app_id=req.app_id,
                project_id=req.project_id,
            )
            self._validate_components(req)

            if req.owner_type == "user":
                episodes, profiles, unprocessed = await asyncio.gather(
                    self._search_episodes(req, where),
                    self._fetch_profile(req),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    episodes=episodes,
                    profiles=profiles,
                    unprocessed_messages=unprocessed,
                )
            else:  # "agent"
                (cases, skills), unprocessed = await asyncio.gather(
                    self._search_cases_and_skills(req, where),
                    self._load_unprocessed(req),
                )
```

</details>

**依据 7 · 源码核查**：[pyproject.toml:89-113](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/pyproject.toml#L89-L113)

everalgo算法依赖与锁定说明

<details>
<summary>查看原文（25行）</summary>

```text

    # Algorithm library (everalgo monorepo, published on PyPI).
    "everalgo-user-memory==0.4.0",
    "everalgo-agent-memory==0.4.0",
    "everalgo-rank==0.4.1",
    "everalgo-knowledge==0.1.1",

    # everalgo's own transitive layer, pinned to what this repo's uv.lock —
    # and therefore the whole test suite — actually resolves. The packages
    # above declare it as `>=0.2.0,<2.0.0`, treating a 0.x line as if a major
    # bump were the only breaking one, so a fresh `pip install everos` picks
    # up releases the suite has never run against. That is not theoretical:
    # everalgo-boundary 0.3.0 added a third required field to the public
    # `DetectionResult` NamedTuple while everalgo-agent-memory 0.4.0 still
    # builds it with two, so `POST /add` answered 500 on a default
    # (`memorize.mode = "agent"`) install of 1.2.3 while every local suite
    # stayed green on the locked 0.2.1. Raise these deliberately, together
    # with a run of the release smoke against a PyPI-resolved install.
    "everalgo-boundary==0.2.1",
    "everalgo-core==0.3.0",
    "everalgo-clustering==0.2.1",
]

[project.optional-dependencies]
multimodal = ["everalgo-parser[svg]>=0.2.1"]  # [svg] bundles cairosvg → SVG works by default
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 记忆组织机制能否改善最终任务？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码足以说明组织与检索机制，不能证明最终任务改善。最强支持是Markdown可修正、索引失败可定位、reflection先写合并并等待再抽取完成才弃用原成员，降低纯数据库黑箱纠错负担；最强反例是LLM抽取/合并可遗漏否定、时间或例外，后续检索即使更集中也可能更错。reflection文档明确是有损合并，默认关闭，策略要求embedding并调用外部EpisodeReflector；不能把“离线”理解为不使用外部模型。Memorize supervisor明确失败不自动重试，因为pipeline写Markdown/发事件非幂等；客户端超时后盲目重发可能重复，接受/抽取/索引可见是不同阶段。cascade有重试上限，永久失败需用户处理，并有LanceDB维护和存储增长约束，不能将本地三件套等同免运维。scope路径/过滤是逻辑分区，不是本轮已验证多租户认证。工程值得借鉴的是明确错误分类、有限并发、单文件写锁与派生索引；未审计全API、所有算法或全部恢复路径。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/service/memorize.py:70-80](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/service/memorize.py#L70-L80)

抽取非幂等，不自动重试

<details>
<summary>查看原文（11行）</summary>

```text
class ExtractionSupervisor:
    """Owns the extraction tasks that may outlive their request.

    A request whose client went away is cancelled while its extraction
    runs; the memcell is already committed, so the extraction must finish.
    ``supervise`` keeps the task referenced until it ends and retrieves its
    outcome: a failure is logged with the memcell ids (it is not retried
    here -- the pipelines write markdown and emit events and are not
    idempotent, the same reason the async queue does not retry a failed
    delivery), and ``drain`` lets the lifespan wait for what is still
    running at shutdown instead of dropping it.
```

</details>

**依据 2 · 作者声明**：[docs/reflection.md:34-44](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/docs/reflection.md#L34-L44)

反思默认低频/有损与可能变差

<details>
<summary>查看原文（11行）</summary>

````text

```toml
[strategies.reflect_episodes]
enabled = true
cron = "0 3 * * 0"        # optional: change the run time (here: Sundays at 03:00)
```

> **Don't run it too often.** Once a week at most is recommended. Each run
> is a lossy LLM merge; repeatedly re-consolidating the same memories can
> make the narrative *worse*, not better — which is why the default is
> weekly.
````

</details>

**依据 3 · 源码核查**：[src/everos/memory/strategies/reflect_episodes.py:50-90](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/strategies/reflect_episodes.py#L50-L90)

反思默认关闭、embedding guard及外部reflector

<details>
<summary>查看原文（41行）</summary>

```text
@offline_strategy(
    name="reflect_episodes",
    trigger=Cron(expr="0 2 * * 1"),
    emits=[EpisodeExtracted],
    enabled=False,
    max_retries=1,
)
async def reflect_episodes(event: CronTick, ctx: StrategyContext) -> None:
    """Run Reflection for all owner scopes.

    Args:
        event: Cron tick event (unused; triggers the scheduled run).
        ctx: OME strategy context for emit and logging.
    """
    # Body-guard: capability is checked here for defensive degradation.
    # Reflection re-embeds merged narratives, so it cannot run without
    # an embedder — silently no-op instead of raising deep inside the
    # orchestrator. Tier upgrades require a server restart; this guard
    # is not a hot-reload mechanism.
    #
    # ``debug`` level (not ``info``) is intentional; see the body-guard
    # in :func:`everos.memory.strategies.trigger_profile_clustering` for
    # the shared rationale (PR #361 round-3 review #8).
    if not get_embedding_capability().available:
        logger.debug(
            "strategy_gated_off_embedding_unavailable",
            strategy_name="reflect_episodes",
        )
        return

    # Deferred: avoid pulling LLM libs at module import time.
    from everalgo.user_memory import EpisodeReflector

    orchestrator = ReflectionOrchestrator(
        cluster_repo=cluster_repo,
        episode_store=episode_repo,
        atomic_fact_store=atomic_fact_repo,
        episode_writer=_get_episode_writer(),
        report_repo=reflection_report_repo,
        reflector=EpisodeReflector(llm=get_llm_client()),
        embedder=get_embedding_capability().require(),
```

</details>

**依据 4 · 源码核查**：[src/everos/memory/reflection/orchestrator.py:260-297](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/reflection/orchestrator.py#L260-L297)

合并/再抽取成功后才deprecate

<details>
<summary>查看原文（38行）</summary>

```text
        await self._detect_orphans(cluster_id, owner_id, app_id, project_id)

        scope = dict(owner_id=owner_id, app_id=app_id, project_id=project_id)
        members, episodes = await self._load_cluster_episodes(
            cluster_id=cluster_id, **scope
        )
        if not members or not episodes:
            return None

        mode, algo_result = await self._reflect_cluster(
            episodes=episodes,
            owner_id=owner_id,
        )
        if algo_result is None:
            return None

        merged_entry_id = await self._write_and_reextract(
            ctx=ctx,
            cluster_id=cluster_id,
            **scope,
            algo_result=algo_result,
            episodes=episodes,
            mode=mode,
            members=members,
        )
        if merged_entry_id is None:
            return None

        return await self._deprecate(
            ctx=ctx,
            cluster_id=cluster_id,
            owner_type=owner_type,
            **scope,
            original_members=members,
            merged_entry_id=merged_entry_id,
            algo_result=algo_result,
            mode=mode,
            episodes=episodes,
```

</details>

**依据 5 · 源码核查**：[src/everos/memory/reflection/orchestrator.py:479-500](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/reflection/orchestrator.py#L479-L500)

等待抽取事件，超时返回未完成

<details>
<summary>查看原文（22行）</summary>

```text
        event = EpisodeExtracted(
            memcell_id=merged_entry_id,
            episode_entry_id=merged_entry_id,
            episode_text=algo_result.episode,
            episode_timestamp_ms=_ts_to_ms(last_ts),
            owner_id=owner_id,
            session_id=None,
            app_id=app_id,
            project_id=project_id,
            source="reflection",
        )
        await ctx.emit(event)
        try:
            await ctx.wait_for_event(event.event_id, timeout=_WAIT_TIMEOUT_SECONDS)
        except TimeoutError:
            logger.error(
                "reflection_extraction_timeout",
                cluster_id=cluster_id,
                event_id=event.event_id,
                merged_entry_id=merged_entry_id,
            )
            return None
```

</details>

**依据 6 · 源码核查**：[src/everos/memory/cascade/worker.py:75-99](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/cascade/worker.py#L75-L99)

有限并发及负载取舍说明

<details>
<summary>查看原文（25行）</summary>

```text
# Conservative defaults — surface in settings if tuning is needed.
DEFAULT_BATCH_SIZE = 50
DEFAULT_HANDLER_CONCURRENCY = 4
"""Maximum handler executions in flight on one worker.

The bound is per worker, not per :meth:`CascadeWorker.drain_once` call: a
server drains from two places at once -- the background loop and whatever
calls ``drain_fully`` (``POST /cascade/quiesce`` does, before ``stop``) --
and a semaphore built per call would let those two overlap at twice this
number, in exactly the backlog-plus-quiesce case the bound exists for.

A daily-log handler first resolves existing rows by ``md_path``. On fragmented
Lance tables that lookup is a native flat scan: 50 simultaneous handlers grew
the production-data replay past 8.29 GiB and did not finish in 80 seconds,
while 1/2/4/8-way peaks were about 0.26/0.61/0.98/1.73 GiB. Keeping the claim
batch at 50 preserves queue semantics; bounding only execution prevents native
queries that outlive Python cancellation from multiplying memory and file
handles after a timeout.

A slot is held across :meth:`_process_one`, inline retry backoff included, so
a row failing against a down provider parks one slot for
``retry_backoff * max_retry * (max_retry + 1) / 2`` seconds (12s at the
defaults) with no native query in flight. That is deliberate -- backing off
harder against a provider that is already failing is the behaviour we want --
but it is why a fully-failing batch drains slower than it did unbounded.
```

</details>

#### 缺口

- 最终任务质量、错误修正传播、删除/隔离与崩溃恢复未运行
  **影响**：不支持自演化改善或安全隔离保证
  **进一步探讨**：对含否定/纠正/时序/跨项目的同任务做索引故障和reflection前后对照

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、持续使用和失败恢复分别依赖什么，由谁承担成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Python≥3.12与本地Markdown/SQLite/LanceDB构成运行基础；依赖清单对LanceDB、OpenAI SDK和everalgo有边界锁定，说明新环境安装与锁环境可能不同，需要固定resolved依赖验收。keyword检索可以无embedding，但对话抽取/边界仍调用LLM；hybrid、rerank、reflection依赖相应外部能力，local-first只说明数据/索引本地，不保证推理在本机。首次包括安装、配置memory root/身份scope、端点密钥与导入核对；持续包括抽取、embedding、检索/重排、离线演化、文件和索引存储；失败包括重建索引、人工修正、核对超时已写入状态和错误队列。金额、token、负载、维护人工均无实测，本轮不引用实时价格或估算单位成本。合格任务分母是正确使用记忆的下游交付，不能用存入条目数分摊出虚假低成本。

#### 证据与依据

**依据 1 · 源码核查**：[pyproject.toml:1-7](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/pyproject.toml#L1-L7)

Python版本与库身份

```text
[project]
name = "everos"
version = "1.5.1"
description = "EverOS — local-first markdown memory framework for AI agents and user chats; lightweight, dev-friendly, small-team"
license = {text = "Apache-2.0"}
readme = "README.md"
requires-python = ">=3.12"
```

**依据 2 · 源码核查**：[pyproject.toml:28-51](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/pyproject.toml#L28-L51)

本地存储与SDK依赖边界

<details>
<summary>查看原文（24行）</summary>

```text
    # Storage stack (md-first three-piece set)
    # Upper bound: 0.35.0 embeds lance-rust v9 (large storage/encoding jump, not
    # yet stable-released). 0.32-0.34 carry a compaction offset-overflow regression
    # (lance-format/lance#7653); we run 0.34.0 safely via the with_position=False
    # FTS workaround. Do not float past 0.34.x until 0.35 has been validated under
    # sustained churn (bounded + reclaimable index dir, no compaction crash) — see
    # docs/cascade_runbook.md. Never widen this floor back below 0.34 (older lance
    # cannot read v8 data).
    "lancedb>=0.34.0,<0.35.0",    # Vector + BM25 + scalar filter (Arrow-based)
    # Floor, not a new package: lancedb pulls pyarrow in anyway. 25.0.1 stops
    # the per-value `import pytz` attempt in to_pylist() (24 walked sys.path
    # for every tz-aware timestamp) and materialises rows without a Scalar
    # per element; 25.0.0 lacks the latter and has a mimalloc exit crash.
    "pyarrow>=25.0.1",
    "aiosqlite>=0.20.0",          # Async SQLite driver (used by SA async engine)
    "sqlmodel>=0.0.22",           # ORM (Pydantic + SQLAlchemy 2.0 async)
    "alembic>=1.13.0",            # SQLite schema migrations
    "greenlet>=3.0",              # Required by SQLAlchemy async

    # LLM & embedding (one provider per file pattern)
    # <3: openai 3.x (2026-09-24) moved to the httpx 1.0 pre-release line and its
    # client raises AttributeError on every request; 2.x is what the lock tests.
    "openai>=1.0.0,<3",

```

</details>

**依据 3 · 源码核查**：[src/everos/service/memorize.py:370-382](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/service/memorize.py#L370-L382)

边界检测调用LLM

<details>
<summary>查看原文（13行）</summary>

```text
    # Boundary detection runs an LLM (everalgo detect_boundaries). Wrap it in a
    # generation span so its token usage lands on a GENERATION observation
    # (costed by Langfuse) instead of the SPAN-typed request root (dropped).
    with memory_span("everos.memcell.boundary", observation_type="generation"):
        boundary = await prepare_cells(
            ingested,
            mode=mode,
            is_final=is_final,
            llm_client=get_llm_client(),
            prompt_loader=_get_prompt_loader(),
            hard_token_limit=boundary_cfg.hard_token_limit,
            hard_msg_limit=boundary_cfg.hard_msg_limit,
            timeout_seconds=boundary_timeout,
```

</details>

**依据 4 · 源码核查**：[src/everos/service/search.py:8-18](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/service/search.py#L8-L18)

keyword可缺外部能力但其他方法有前提

<details>
<summary>查看原文（11行）</summary>

```text
Component policy (matches :class:`SearchManager` guards):

* Embedding / rerank / LLM clients are **optional at boot**; the manager
  is built lazily and only the methods that need them fail (with a clear
  message) when the corresponding section of settings is empty.
* ``KEYWORD`` searches therefore work without any of the three clients,
  which makes the endpoint usable in a freshly-installed dev setup.
* All three providers are pulled from their process-wide capability /
  singleton accessors (:func:`get_embedding_capability`,
  :func:`get_rerank_capability`, :func:`get_llm_client`); this module
  never keeps parallel singletons of its own.
```

</details>

**依据 5 · 作者声明**：[docs/storage_layout.md:5-8](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/docs/storage_layout.md#L5-L8)

Markdown与派生索引定位

```text

The contents are the **source of truth**; SQLite and the configured
vector/BM25 index backend are derived indexes that can be rebuilt from
markdown alone.
```

#### 缺口

- 真实负载、外部费用、索引增长与纠错工时未知
  **影响**：无法判断总成本/扩展性/收益
  **进一步探讨**：记录全部模型与后台调用、磁盘/内存和人工修正，以合格任务对账

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 由已确认机制与限制可提出什么可证伪改进，什么人值得试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

未验证假设是把记忆使用前的“修正版本已索引+引用原件可回溯+合并有损风险”变成任务可见状态，比只返回高相似度记忆更能降低陈旧/误合并导致的下游错误。推导来自Q02可编辑真相源和Q03多阶段一致性及有损合并；增量是把现有队列/原件状态带入使用决策，不另建第二套真相源。最小实验20个含事实纠正、否定、时间变化和跨项目同名实体的任务，比较人工Markdown检索、当前EverOS（reflection关/开）与状态门控原型；控制同模型/检索预算，测语义错误、旧事实泄漏、修正到可检索延迟、合格率及总调用/人工成本。若只改善命中率而最终错误不降或门控延迟/成本抵消收益，则否定。当前建议有限试用在单用户、非敏感、可回滚memory root，先关闭reflection建立基线，验证修改/删除/重建/索引失败与客户端断连，不直接用个人事实自动触发不可逆动作。DSH适配需独立固定版本验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/everos/memory/cascade/worker.py:813-835](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/cascade/worker.py#L813-L835)

队列失败状态可作为门控信号

<details>
<summary>查看原文（23行）</summary>

```text
        handler = self._handlers.get(row.kind)
        if handler is None:
            await md_change_state_repo.mark_failed(
                row.md_path,
                retryable=False,
                error=f"no handler registered for kind {row.kind!r}",
                new_retry_count=row.retry_count,
            )
            return None

        if row.retry_count >= _MAX_TOTAL_RETRIES:
            logger.warning(
                "cascade_worker_retry_budget_exhausted",
                md_path=row.md_path,
                kind=row.kind,
                retry_count=row.retry_count,
            )
            await md_change_state_repo.mark_failed(
                row.md_path,
                retryable=False,
                error=f"retry budget exhausted after {row.retry_count} attempts",
                new_retry_count=row.retry_count,
            )
```

</details>

**依据 2 · 源码核查**：[src/everos/memory/search/manager.py:214-238](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/search/manager.py#L214-L238)

检索scope与结果组织

<details>
<summary>查看原文（25行）</summary>

```text
            where = compile_filters(
                req.filters,
                owner_id=req.owner_id,
                owner_type=req.owner_type,
                app_id=req.app_id,
                project_id=req.project_id,
            )
            self._validate_components(req)

            if req.owner_type == "user":
                episodes, profiles, unprocessed = await asyncio.gather(
                    self._search_episodes(req, where),
                    self._fetch_profile(req),
                    self._load_unprocessed(req),
                )
                data = SearchData(
                    episodes=episodes,
                    profiles=profiles,
                    unprocessed_messages=unprocessed,
                )
            else:  # "agent"
                (cases, skills), unprocessed = await asyncio.gather(
                    self._search_cases_and_skills(req, where),
                    self._load_unprocessed(req),
                )
```

</details>

**依据 3 · 源码核查**：[src/everos/memory/strategies/reflect_episodes.py:50-55](https://github.com/EverMind-AI/EverOS/blob/5b0979b1b7f3a0cbe235756ff098515ec490753e/src/everos/memory/strategies/reflect_episodes.py#L50-L55)

reflection默认关闭可建立基线

```text
@offline_strategy(
    name="reflect_episodes",
    trigger=Cron(expr="0 2 * * 1"),
    emits=[EpisodeExtracted],
    enabled=False,
    max_retries=1,
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
