# DSH EasyRewrite

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d71a306](https://github.com/Renzic-Stone/DSH-EasyRewrite/tree/d71a3062c03eb84d2f154a36d5d9909cd72fff37)

<!-- BEGIN META -->
[![GitHub ★ 129](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=129&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Renzic-Stone/DSH-EasyRewrite) [![npm 30d 2,833](https://img.shields.io/static/v1?label=npm+30d&message=2%2C833&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-easyrewrite) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-easyrewrite)
<!-- END META -->

> **功能**：原位重编辑与撤回重发，并可找回历史会话版本

> **亮点**：[Q01](#research-q01) 将编辑、重发和版本切换串在消息界面。

> **主要限制**：[Q03](#research-q03) Vault 预保存、草稿和后续移交缺少单一原子提交证据。

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
  - [Q01 · 可复核的贡献是什么？](#detail-section-11)
  - [Q02 · 如何处理重发？](#detail-section-12)
  - [Q03 · 能否证明不丢数据？](#detail-section-13)
  - [Q04 · 采用和退出怎样安排？](#detail-section-14)
  - [Q05 · 什么结果否定价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需要更正长会话中的旧提示。

手工复制前文并开新会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 手工复制前文并开新会话。 | 可直接比较 | 保留人工步骤 |
| DSH EasyRewrite | 将编辑、重发和版本切换串在消息界面。 | Vault 预保存、草稿和后续移交缺少单一原子提交证据。 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 宿主 | 必需 | 按历史边界 fork 或创建子会话，使用 Vault 和本地草稿支持重发及旧版本恢复。 | 用隔离 profile 确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户需要更正长会话中的旧提示。 | 保留原流程 |
| 试验 | 按历史边界 fork 或创建子会话，使用 Vault 和本地草稿支持重发及旧版本恢复。 | 观察固定版本 |
| 复核 | 隔离 profile 校验取消、确认、恢复及三个失败点。 | 比对任务结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与运行成本未知 | 配置准备耗时未知 | 视 profile 而定 |
| 持续 | 持续运行成本未知 | 日常维护耗时未知 | 视任务频率而定 |
| 恢复 | 回退成本未知 | 恢复原流程耗时未知 | 视已有数据而定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 修正旧提示词并保留可重开的分支与附件 | 可在保留原版本和附件时减少重建上下文的人工耗时。 | 隔离 profile 校验取消、确认、恢复及三个失败点。 |

> **思考**：[Q03](#research-q03) Vault 预保存、草稿和后续移交缺少单一原子提交证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将编辑、重发和版本切换串在消息界面。

客户端按不同边界选择宿主会话操作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Vault 预保存、草稿和后续移交缺少单一原子提交证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 隔离 profile 校验取消、确认、恢复及三个失败点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的修正旧提示词并保留可重开的分支与附件。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/features/bubble/view.js、src/core/session.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的修正旧提示词并保留可重开的分支与附件。未执行目标代码或实际宿主验证。
- 下一步：记录请求与会话日志逐项对照。

**分析版本**

- **仓库**：[Renzic-Stone/DSH-EasyRewrite](https://github.com/Renzic-Stone/DSH-EasyRewrite)
- **版本号**：3.0.0（[固定提交 d71a306](https://github.com/Renzic-Stone/DSH-EasyRewrite/tree/d71a3062c03eb84d2f154a36d5d9909cd72fff37)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可在保留原版本和附件时减少重建上下文的人工耗时。

记录请求与会话日志逐项对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 40 | 34 | 0 | — |
| .md | source | 17 | 2276 | — | — | 34446 |
| .js | source | 36 | 23355 | 21615 | 1404 | — |
| .mjs | test | 11 | 2276 | 1749 | 230 | — |
| .md | test | 1 | 8 | — | — | 81 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/Renzic-Stone/DSH-EasyRewrite/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：修正旧提示词并保留可重开的分支与附件

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可复核的贡献是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在长会话中发现旧提示有误时，手工复制前文会重做上下文和附件。插件把编辑、fork、打开新会话和旧版本查找接进同一界面。验收应能在原气泡编辑，取消时上下文无变化，确认后只新建预期分支，并可找回旧版本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-19](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/README.md#L15-L19)

作者描述确认后才变更及兼容范围

```text
**在 DeepSeek Harness Web 里使用撤回键和气泡编辑功能轻松编辑已发出的消息——轻量、原版风格、惰性、无痕、数据任何情况下0丢失。保护您修改过程中的每一份灵感。**

单击自己的消息气泡即可原位编辑；点击复制键旁的撤回键可撤回该消息及其后的全部内容。**一切修改都发生在你真正确认之后**——在按下「确定」（编辑）或「发送」（撤回）之前，对话、模型上下文、会话日志纹丝不动。

> 兼容 DeepSeek Harness Web（**v3.0.0 全面适配 dsh 0.2.x 与 0.1.7 系列**，引入独立影子仓储 Vault 与全附件无损流转；0.1.1-rc.2 及更早宿主用户请停留 **2.3.1**——该线最终版，功能完整可用，仅不再追加新功能）。纯官方扩展点实现，不改 DSH 源码。
```

**依据 2 · 源码核查**：[src/features/bubble/view.js:980-1009](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L980-L1009)

普通消息 fork，首条消息创建子会话

<details>
<summary>查看原文（30行）</summary>

```text
          var newId = null;
          if (isNoBoundaryEdit) {
            newId = await createBlankChildSession(sid, props);
            if (!newId) {
              log("error", "edit", "首条消息创建空白新会话失败（编辑重发中止）");
              setPrimaryButtonSendingState(false);
              setEditing(true);
              setOpError(L.errGeneric);
              setTimeout(function () { setOpError(null); }, 5000);
              return;
            }
          } else {
            try {
              newId = await props.ctxSessions.fork({ sessionId: sid, atSeq: data.boundary });
            } catch (e) {
              var emEdit = String(e && e.message ? e.message : e);
              log("error", "edit", "fork 失败", { err: emEdit });
              if (/has no completed turn to fork from/i.test(emEdit)) {
                newId = await createBlankChildSession(sid, props);
                if (!newId) {
                  setPrimaryButtonSendingState(false);
                  setEditing(true);
                  setOpError(L.errGeneric);
                  setTimeout(function () { setOpError(null); }, 5000);
                  return;
                }
              } else {
                setPrimaryButtonSendingState(false);
                setEditing(true); // 恢复编辑态
                setOpError(/has not completed the turn/i.test(emEdit) ? (L.turnOpenNotice || L.errGeneric) : L.errGeneric);
```

</details>

**依据 3 · 源码核查**：[src/core/session.js:337-360](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/core/session.js#L337-L360)

提供 Vault 版本恢复

<details>
<summary>查看原文（24行）</summary>

```text
/** 跨体系统一恢复会话版本（支持 Vault 影子仓储快照原子还原与官方老归档 unarchive） */
export async function restoreSessionVersion(fam, targetVersion, props) {
  if (fam && fam.isVault) {
    const res = await fetch("/bubble/vault/restore", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: fam.sessionId,
        workspaceId: fam.workspaceId,
        targetVersionNumber: targetVersion.versionNumber,
        storageMode: fam.storageMode
      }),
      keepalive: true
    }).then((r) => r.json()).catch(() => null);

    if (res && res.ok) {
      if (props && typeof props.openSession === "function") {
        props.openSession(fam.sessionId);
      } else {
        invokeOpenSession(null, fam.sessionId);
      }
      return { ok: true, isVault: true };
    }
    return { ok: false, error: res?.error || "restore-failed" };
```

</details>

#### 缺口

- 界面承诺需要会话状态佐证。
  **影响**：缩短重做路径且保留检查点。
  **进一步探讨**：使用一条首消息和一条中段消息测试。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何处理重发？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

普通修改按历史序号 fork，首轮无边界则建空白子会话。客户端写入待重发草稿、附件引用和模型选择后打开新会话，再异步移交旧会话。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/bubble/view.js:980-1009](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L980-L1009)

按会话边界选择分支路径

<details>
<summary>查看原文（30行）</summary>

```text
          var newId = null;
          if (isNoBoundaryEdit) {
            newId = await createBlankChildSession(sid, props);
            if (!newId) {
              log("error", "edit", "首条消息创建空白新会话失败（编辑重发中止）");
              setPrimaryButtonSendingState(false);
              setEditing(true);
              setOpError(L.errGeneric);
              setTimeout(function () { setOpError(null); }, 5000);
              return;
            }
          } else {
            try {
              newId = await props.ctxSessions.fork({ sessionId: sid, atSeq: data.boundary });
            } catch (e) {
              var emEdit = String(e && e.message ? e.message : e);
              log("error", "edit", "fork 失败", { err: emEdit });
              if (/has no completed turn to fork from/i.test(emEdit)) {
                newId = await createBlankChildSession(sid, props);
                if (!newId) {
                  setPrimaryButtonSendingState(false);
                  setEditing(true);
                  setOpError(L.errGeneric);
                  setTimeout(function () { setOpError(null); }, 5000);
                  return;
                }
              } else {
                setPrimaryButtonSendingState(false);
                setEditing(true); // 恢复编辑态
                setOpError(/has not completed the turn/i.test(emEdit) ? (L.turnOpenNotice || L.errGeneric) : L.errGeneric);
```

</details>

**依据 2 · 源码核查**：[src/features/bubble/view.js:1043-1079](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L1043-L1079)

记录续发数据及转移旧会话

<details>
<summary>查看原文（37行）</summary>

```text
            }
            if (outgoingFiles.length > 0) stageOutgoingFiles(newId, outgoingFiles);
          } catch (eOf) { /* ignore */ }
          if (bottomFiles && bottomFiles.length > 0) {
            stageBottomDraftFiles(newId, bottomFiles);
          }
          try {
            localStorage.setItem("dsh-easyrewrite:resume-send:" + newId, JSON.stringify({
              draftText: newText,
              t: Date.now(),
              imageIds: editImgIds,
              attachRefs: editAttachRefs,
              sel: msel,
              stagedDraft: stagedDraftPayload
            }));
          } catch (e) { /* ignore */ }

          var opened2 = safeOpenSession(newId, props);
          if (!opened2) {
            log("error", "edit", "打开新会话失败，回滚状态", { newId: newId });
            try { localStorage.removeItem("dsh-easyrewrite:resume-send:" + newId); } catch (e) {}
            setPrimaryButtonSendingState(false);
            setEditing(true);
            setOpError(L.errGeneric);
            return;
          }
          try {
            fetch("/bubble/vault/retire-session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ sessionId: sid, replacementSessionId: newId }),
              keepalive: true
            }).catch(function () {});
          } catch (eRet) { log("warn", "edit", "移入影子仓储失败", { err: String(eRet && eRet.message ? eRet : eRet) }); }
          log("info", "edit", "编辑重发：打开新会话 + 原会话移入影子仓储", { newId: newId });
          // 成功打开新会话后再清除 pending
          if (isEditPending) writePending(sid, null);
```

</details>

#### 缺口

- 打开失败和重发失败是不同阶段。
  **影响**：需要检查新旧两边的状态。
  **进一步探讨**：记录新旧 ID、发送次数和附件摘要。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能否证明不丢数据？

**研究主题**：缺陷与关键质疑

#### 完整回答

作者的零丢失主张超出静态证据。Vault 预保存请求没有 await 并吞掉失败，移交同样异步；localStorage 写入异常也会被忽略。浏览器存储、网络和会话 RPC 多步失败可造成可见状态不一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/bubble/view.js:971-995](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L971-L995)

预保存未等待就继续 fork

<details>
<summary>查看原文（25行）</summary>

```text
          // 影子仓储预保存：在截断/创建新版本前将当前完整会话备份为快照
          try {
            fetch("/bubble/vault/save", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ sessionId: sid, summary: "编辑重发前完整快照" }),
              keepalive: true
            }).catch(function () {});
          } catch (eVs) {}
          var newId = null;
          if (isNoBoundaryEdit) {
            newId = await createBlankChildSession(sid, props);
            if (!newId) {
              log("error", "edit", "首条消息创建空白新会话失败（编辑重发中止）");
              setPrimaryButtonSendingState(false);
              setEditing(true);
              setOpError(L.errGeneric);
              setTimeout(function () { setOpError(null); }, 5000);
              return;
            }
          } else {
            try {
              newId = await props.ctxSessions.fork({ sessionId: sid, atSeq: data.boundary });
            } catch (e) {
              var emEdit = String(e && e.message ? e.message : e);
```

</details>

**依据 2 · 源码核查**：[src/features/bubble/view.js:1049-1076](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L1049-L1076)

续发和移交允许失败后继续

<details>
<summary>查看原文（28行）</summary>

```text
          try {
            localStorage.setItem("dsh-easyrewrite:resume-send:" + newId, JSON.stringify({
              draftText: newText,
              t: Date.now(),
              imageIds: editImgIds,
              attachRefs: editAttachRefs,
              sel: msel,
              stagedDraft: stagedDraftPayload
            }));
          } catch (e) { /* ignore */ }

          var opened2 = safeOpenSession(newId, props);
          if (!opened2) {
            log("error", "edit", "打开新会话失败，回滚状态", { newId: newId });
            try { localStorage.removeItem("dsh-easyrewrite:resume-send:" + newId); } catch (e) {}
            setPrimaryButtonSendingState(false);
            setEditing(true);
            setOpError(L.errGeneric);
            return;
          }
          try {
            fetch("/bubble/vault/retire-session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ sessionId: sid, replacementSessionId: newId }),
              keepalive: true
            }).catch(function () {});
          } catch (eRet) { log("warn", "edit", "移入影子仓储失败", { err: String(eRet && eRet.message ? eRet : eRet) }); }
```

</details>

#### 缺口

- 未核实宿主端是否另有强一致保护。
  **影响**：数据恢复仍需在故障场景验证。
  **进一步探讨**：分别模拟预保存失败和草稿存储不可写。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和退出怎样安排？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者建议按宿主版本安装。先用隔离 profile，备份会话与测试附件，分别验收 edit 和 recall。退出前恢复或导出仍有用的旧版本，再卸载并核对原版会话可打开。初始成本来自兼容、权限和测试，持续成本来自分支与快照增长，未知存储量和恢复耗时要实际测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:17-19](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/README.md#L17-L19)

兼容边界由作者描述

```text
单击自己的消息气泡即可原位编辑；点击复制键旁的撤回键可撤回该消息及其后的全部内容。**一切修改都发生在你真正确认之后**——在按下「确定」（编辑）或「发送」（撤回）之前，对话、模型上下文、会话日志纹丝不动。

> 兼容 DeepSeek Harness Web（**v3.0.0 全面适配 dsh 0.2.x 与 0.1.7 系列**，引入独立影子仓储 Vault 与全附件无损流转；0.1.1-rc.2 及更早宿主用户请停留 **2.3.1**——该线最终版，功能完整可用，仅不再追加新功能）。纯官方扩展点实现，不改 DSH 源码。
```

**依据 2 · 作者声明**：[README.md:34-39](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/README.md#L34-L39)

作者给出安装命令

````text
## 快速开始

```sh
# npm一键安装
dsh plugin --profile web add dsh-easyrewrite
```
````

**依据 3 · 源码核查**：[src/core/session.js:337-369](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/core/session.js#L337-L369)

恢复路径分 Vault 和传统归档

<details>
<summary>查看原文（33行）</summary>

```text
/** 跨体系统一恢复会话版本（支持 Vault 影子仓储快照原子还原与官方老归档 unarchive） */
export async function restoreSessionVersion(fam, targetVersion, props) {
  if (fam && fam.isVault) {
    const res = await fetch("/bubble/vault/restore", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: fam.sessionId,
        workspaceId: fam.workspaceId,
        targetVersionNumber: targetVersion.versionNumber,
        storageMode: fam.storageMode
      }),
      keepalive: true
    }).then((r) => r.json()).catch(() => null);

    if (res && res.ok) {
      if (props && typeof props.openSession === "function") {
        props.openSession(fam.sessionId);
      } else {
        invokeOpenSession(null, fam.sessionId);
      }
      return { ok: true, isVault: true };
    }
    return { ok: false, error: res?.error || "restore-failed" };
  }

  // 传统官方 lineage 归档还原
  const targetId = typeof targetVersion === "string" ? targetVersion : (targetVersion.id || targetVersion.sessionId);
  await fetch("/bubble/unarchive", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ sessionId: targetId }),
    keepalive: true
```

</details>

#### 缺口

- 保留策略和卸载后可读性未实测。
  **影响**：关系到迁移及退出成本。
  **进一步探讨**：只在可备份 profile 验证。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么结果否定价值？

**研究主题**：新假设与验证

#### 完整回答

对比手工分支和插件，检查文本、附件摘要、旧版本可达性、任务用时。分别注入预保存失败、浏览器存储失败和会话切换失败。若原版本消失、重复发送、附件哈希不一致，或取消仍改变日志，当前配置不满足采用条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/bubble/view.js:971-1009](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L971-L1009)

保存与分支可注入故障

<details>
<summary>查看原文（39行）</summary>

```text
          // 影子仓储预保存：在截断/创建新版本前将当前完整会话备份为快照
          try {
            fetch("/bubble/vault/save", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ sessionId: sid, summary: "编辑重发前完整快照" }),
              keepalive: true
            }).catch(function () {});
          } catch (eVs) {}
          var newId = null;
          if (isNoBoundaryEdit) {
            newId = await createBlankChildSession(sid, props);
            if (!newId) {
              log("error", "edit", "首条消息创建空白新会话失败（编辑重发中止）");
              setPrimaryButtonSendingState(false);
              setEditing(true);
              setOpError(L.errGeneric);
              setTimeout(function () { setOpError(null); }, 5000);
              return;
            }
          } else {
            try {
              newId = await props.ctxSessions.fork({ sessionId: sid, atSeq: data.boundary });
            } catch (e) {
              var emEdit = String(e && e.message ? e.message : e);
              log("error", "edit", "fork 失败", { err: emEdit });
              if (/has no completed turn to fork from/i.test(emEdit)) {
                newId = await createBlankChildSession(sid, props);
                if (!newId) {
                  setPrimaryButtonSendingState(false);
                  setEditing(true);
                  setOpError(L.errGeneric);
                  setTimeout(function () { setOpError(null); }, 5000);
                  return;
                }
              } else {
                setPrimaryButtonSendingState(false);
                setEditing(true); // 恢复编辑态
                setOpError(/has not completed the turn/i.test(emEdit) ? (L.turnOpenNotice || L.errGeneric) : L.errGeneric);
```

</details>

**依据 2 · 源码核查**：[src/features/bubble/view.js:1043-1085](https://github.com/Renzic-Stone/DSH-EasyRewrite/blob/d71a3062c03eb84d2f154a36d5d9909cd72fff37/src/features/bubble/view.js#L1043-L1085)

草稿、打开与移交是独立阶段

<details>
<summary>查看原文（43行）</summary>

```text
            }
            if (outgoingFiles.length > 0) stageOutgoingFiles(newId, outgoingFiles);
          } catch (eOf) { /* ignore */ }
          if (bottomFiles && bottomFiles.length > 0) {
            stageBottomDraftFiles(newId, bottomFiles);
          }
          try {
            localStorage.setItem("dsh-easyrewrite:resume-send:" + newId, JSON.stringify({
              draftText: newText,
              t: Date.now(),
              imageIds: editImgIds,
              attachRefs: editAttachRefs,
              sel: msel,
              stagedDraft: stagedDraftPayload
            }));
          } catch (e) { /* ignore */ }

          var opened2 = safeOpenSession(newId, props);
          if (!opened2) {
            log("error", "edit", "打开新会话失败，回滚状态", { newId: newId });
            try { localStorage.removeItem("dsh-easyrewrite:resume-send:" + newId); } catch (e) {}
            setPrimaryButtonSendingState(false);
            setEditing(true);
            setOpError(L.errGeneric);
            return;
          }
          try {
            fetch("/bubble/vault/retire-session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ sessionId: sid, replacementSessionId: newId }),
              keepalive: true
            }).catch(function () {});
          } catch (eRet) { log("warn", "edit", "移入影子仓储失败", { err: String(eRet && eRet.message ? eRet : eRet) }); }
          log("info", "edit", "编辑重发：打开新会话 + 原会话移入影子仓储", { newId: newId });
          // 成功打开新会话后再清除 pending
          if (isEditPending) writePending(sid, null);
        } catch (err) {
          log("error", "edit", "编辑重发请求失败", { err: String(err && err.message ? err.message : err) });
          setPrimaryButtonSendingState(false);
          setEditing(true); // 网络异常也恢复编辑态
        } finally {
          editInFlight = false;
```

</details>

#### 缺口

- 暂无故障复现。
  **影响**：可以排除只看按钮成功的误判。
  **进一步探讨**：记录请求与会话日志逐项对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
