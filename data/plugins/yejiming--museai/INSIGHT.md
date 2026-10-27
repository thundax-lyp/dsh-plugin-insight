# MuseAI

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[85c1ea7](https://github.com/yejiming/MuseAI/tree/85c1ea76c565e697f510cc45d82ebcb352458dd6)

<!-- BEGIN META -->
[![GitHub ★ 674](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=674&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yejiming/MuseAI)
<!-- END META -->

> **功能**：在本地管理角色、世界设定与会话，提供 AI 伴侣、文字冒险和穿书互动。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持将模型建议、用户编辑与角色归档组织为一个流程，减少资料分散；不能把自动抽取视作正确记忆。

> **主要限制**：[Q02](#research-q02) 的角色和归档更新早于会话保存，失败分支未见补偿；后端分析实现仍有定位缺口，核心可靠性尚不足以建议迁移真实档案。

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
  - [Q01 · 应用身份和相对手工角色卡的增量是什么？](#detail-section-11)
  - [Q02 · 封存按钮怎样更新角色与会话，失败是否一致？](#detail-section-12)
  - [Q03 · 模型与状态存储带来哪些操作和成本？](#detail-section-13)
  - [Q04 · 谁能试用，怎样验证记忆确实有帮助？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：角色互动创作者跨会话维护世界书、角色关系与关键事件，合格结果应是与原对话一致且可恢复的记忆。

参照手工角色卡、文本摘要和会话备份；本地桌面应用与另一个 DSH 客户端插件分开评价。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 角色会话 | 持续互动 | 需要角色和模型配置 |
| 记忆封存 | 分析并编辑角色事件 | 抽取准确性需用户核对 |
| 本地状态保存 | 保存设定与会话 | 不等同跨文件原子事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 模型 API 与密钥 | 分析必需 | 聊天和抽取 | 无法分析记忆 |
| 角色卡与世界书 | 任务必需 | 提供设定 | 缺少角色上下文 |
| 本地 Documents 存储及备份 | 保存必需 | 持续档案 | 失败需核对角色和会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置模型并复制虚构角色 | 连接测试与备份存在 |
| 分析 | 应用分析当前对话，用户编辑建议 | 逐项与对话一致 |
| 保存 | 应用更新角色再保存会话 | 两份内容均应核对 |
| 恢复 | 用户对照备份 | 不一致停止继续归档 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 桌面存储与模型服务 | 角色整理和备份 | 实际耗时未知 |
| 持续使用 | 聊天及归档分析调用 | 核对生成记忆 | token 与费用未知 |
| 失败恢复 | 重复分析及备份空间 | 核对多份状态 | 一致性恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 记忆工作流 | 模型建议可编辑并归档 | 长期准确与关系连续性 |
| 本地持久化 | config 文件写入 | 失败原子性和恢复完整性 |

> **思考**：[Q02](#research-q02) 的角色和归档更新早于会话保存，失败分支未见补偿；后端分析实现仍有定位缺口，核心可靠性尚不足以建议迁移真实档案。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持将模型建议、用户编辑与角色归档组织为一个流程，减少资料分散；不能把自动抽取视作正确记忆。

[Q02](#research-q02) 分离分析与人工编辑值得借鉴，但需引入跨角色和会话的提交边界；状态持久化删除目前无操作，退出需保留文件副本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的角色和归档更新早于会话保存，失败分支未见补偿；后端分析实现仍有定位缺口，核心可靠性尚不足以建议迁移真实档案。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 暂缓迁移唯一角色档案；先检查虚构副本与保存失败后状态，真实资料继续手工维护并备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

前端归档与文件写入有源码支持；后端模型链和失败一致性不足，长期收益未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/pages/Chat.tsx、src/utils/archiveAnalysis.ts、src/stores/diskStorage.ts、src-tauri/src/commands/workspace.rs、src-tauri/src/lib.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定客户端仓库，重点前端封存、状态持久化与 Rust 落盘；未研究另一个 DSH 插件仓库。
- 下一步：补查模型分析命令，验证保存失败和错误事件抽取；使用同剧情人工卡作对照，未执行。

**分析版本**

- **仓库**：[yejiming/MuseAI](https://github.com/yejiming/MuseAI)
- **版本号**：0.9.8（[固定提交 85c1ea7](https://github.com/yejiming/MuseAI/tree/85c1ea76c565e697f510cc45d82ebcb352458dd6)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出可回退差异与会话共同提交的封存方式，尚未实现验证；若不能减少错误记忆和恢复投入则否定。

补查模型分析命令，验证保存失败和错误事件抽取；使用同剧情人工卡作对照，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 46 | 14055 | — | — | 192928 |
| .tsx | test | 27 | 5668 | 4941 | 14 | — |
| .ts | test | 24 | 2619 | 2294 | 14 | — |
| .tsx | source | 40 | 26691 | 24835 | 241 | — |
| .ts | source | 32 | 5984 | 5321 | 109 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/yejiming/MuseAI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/yejiming/MuseAI/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/yejiming/MuseAI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：角色会话如何成为可持续且可核对的本地记忆？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 应用身份和相对手工角色卡的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

MuseAI 是本地角色互动桌面应用；README 指向另一个 dsh-museai-tavern 仓库，当前身份应为 client，不能把链接当本仓库 DSH 注册证据。目标是角色聊天和文字冒险中让设定、关系与关键事件持续保存。相对手工维护角色卡和分散会话，它把模型分析、可编辑记忆和归档放进同一用户流程；这是整合增量，不证明长期记忆准确或实际陪伴效果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:6-13](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/README.md#L6-L13)

作者区分本应用与独立 DSH 插件。

```text
> ### 🆕 重要更新：MuseAI 现在可以装进 DeepSeek Harness
> 新增 DSH 客户端插件 —— 把 MuseAI 装进 DeepSeek Harness
> 
> 一边用 DSH 干活，一边与 AI 冒险！→ https://github.com/yejiming/dsh-museai-tavern

MuseAI 是一款面向沉浸式角色互动的本地 AI 应用。你可以创建自己的角色与世界设定，和角色持续对话、共同经历冒险，并在一次次互动中积累关系、记忆与羁绊。

它不只是普通的 AI 聊天工具，也不只是写作软件。MuseAI 更像一个可以保存世界、角色、记忆和关系的本地 AI 互动世界。
```

**依据 2 · 作者声明**：[README.md:44-61](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/README.md#L44-L61)

目标任务与记忆主张。

<details>
<summary>查看原文（18行）</summary>

```text
### AI 伴侣与角色聊天

在「背景设定」中创建世界书和角色卡后，就可以到「伴侣对话」选择角色，开启一对一 AI 角色聊天。角色会根据人设、说话风格、与你的关系和过往记忆回应你，让对话更像一段持续发展的关系，而不是一次性的问答。

- 支持自定义角色姓名、性格、关系、底线、口头禅和背景故事
- 支持绑定世界书，让角色始终处在同一个故事世界中
- 支持归档记忆，提炼关键事件并更新角色卡
- 适合 AI 伴侣、AI 虚拟角色、OC 聊天、角色扮演和沉浸式陪伴

![MuseAI 智能伴侣：选择角色卡后与 AI 角色进行长期对话](assets/聊天页.png)

### 长期记忆与羁绊档案

每次对话或冒险结束后，你都可以让 MuseAI 分析本次经历，将关系变化、重要事件和相处模式写回角色档案。「羁绊」页面会按角色整理这些记录，形成可回顾的关系轨迹。

- **关系概览**：查看关系类型、相处模式与关系底线
- **羁绊时间线**：用时间轴记录关键事件
- **会话足迹**：只展示与该角色相关的聊天记录
```

</details>

**依据 3 · 源码核查**：[src/pages/Chat.tsx:914-920](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/pages/Chat.tsx#L914-L920)

模型建议进入可编辑字段。

```text
      const analysis = parseArchiveAnalysisResponse(resultStr);
      setArchiveAnalysis(analysis);
      setEditedTitle(analysis.sessionTitle || sessionTitle || '未命名会话');
      setEditedRelationType(analysis.userRelationType || '');
      setEditedRelationModel(analysis.userInteractionModel || '');
      setEditedRelationBottomLine(analysis.userRelationBottomLine || '');
      setEditedEvents(analysis.keyEvents || '');
```

#### 缺口

- 长期角色一致性缺少对照
  **影响**：不能把保存状态等同有效记忆
  **进一步探讨**：以固定角色和跨会话矛盾用例比较手工维护

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 封存按钮怎样更新角色与会话，失败是否一致？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

handleArchiveMemory 从用户和 Agent 消息构建历史，携模型配置调用 analyze_character_memory，解析返回值后供用户编辑。确认归档先更新角色字段，再设归档状态与标题，最后 await saveCurrentSession；保存失败显示错误，所读分支没有回退前面的字段及归档状态。因此可以确认这里存在多状态先后写入的设计风险，不能保证记忆和会话原子一致；未运行所以不声称已复现丢失。diskStorage 通过 appInvoke 保存，Rust 将字符串直接写入 config 文件。JSON 解析只保证语法，可接受对象，不验证记忆真实性。后端分析命令完整实现未在本次范围定位，作用仅能确认到前端调用和注册，核心模型链保留缺口。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/Chat.tsx:872-927](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/pages/Chat.tsx#L872-L927)

分析入口、上下文和结果编辑。

<details>
<summary>查看原文（56行）</summary>

```text
  const handleArchiveMemory = async () => {
    if (!selectedCharacterCard || messages.length === 0 || isStreaming || isSessionArchived) return;

    setIsAnalyzing(true);
    setIsArchiveModalOpen(true);
    setArchiveAnalysis(null);

    const chatHistoryLines: string[] = [];
    for (const m of messages) {
      if (m.role !== 'user' && m.role !== 'agent') {
        continue;
      }
        const sender = m.role === 'user' ? '我' : (selectedCharacterCard.name);
        const cleanContent = m.content.replace(/\[\[THINKING:[^\]]+\]\]/g, '').trim();
      if (cleanContent !== '') {
        chatHistoryLines.push(`${sender}: ${cleanContent}`);
      }
    }
    const chatHistoryText = chatHistoryLines.join('\n\n');

    try {
      const archiveConfig = settings.agentConfigs?.chatArchive || {};
      const resultStr = await invoke<string | Record<string, any>>('analyze_character_memory', {
        request: {
          modelInterface: settings.modelInterface,
          baseUrl: settings.llmBaseUrl,
          apiKey: settings.llmApiKey,
          model: settings.llmModel,
          temperature: archiveConfig.temperature ?? 0.3,
          maxOutputTokens: archiveConfig.maxOutputTokens ?? 32000,
          thinkingDepth: archiveConfig.thinkingDepth ?? 'off',
          systemPrompt: settings.chatArchivePrompt || undefined,
          chatHistory: chatHistoryText,
          targetCharacterName: selectedCharacterCard.name,
          targetCharacterContent: selectedCharacterCard.content,
          currentUserRelationType: selectedCharacterCard.fields?.userRelationType || '',
          currentUserInteractionModel: selectedCharacterCard.fields?.userInteractionModel || '',
          currentUserRelationBottomLine: selectedCharacterCard.fields?.userRelationBottomLine || '',
          currentEvents: selectedCharacterCard.fields?.keyEvents || '暂无共同经历的关键事件。'
        }
      });

      const analysis = parseArchiveAnalysisResponse(resultStr);
      setArchiveAnalysis(analysis);
      setEditedTitle(analysis.sessionTitle || sessionTitle || '未命名会话');
      setEditedRelationType(analysis.userRelationType || '');
      setEditedRelationModel(analysis.userInteractionModel || '');
      setEditedRelationBottomLine(analysis.userRelationBottomLine || '');
      setEditedEvents(analysis.keyEvents || '');
    } catch (err) {
      console.error('分析记忆失败:', err);
      message.error(`记忆分析失败：${String(err)}`);
      setIsArchiveModalOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
```

</details>

**依据 2 · 源码核查**：[src/pages/Chat.tsx:930-962](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/pages/Chat.tsx#L930-L962)

多状态更新早于会话持久化，catch 未回滚。

<details>
<summary>查看原文（33行）</summary>

```text
  const handleConfirmArchive = async () => {
    if (!selectedCharacterCard) return;

    try {
      // 1. Update character card fields in usePartnerStore
      updateItemFields(selectedCharacterCard.id, 'character_card', {
        userRelationType: editedRelationType,
        userInteractionModel: editedRelationModel,
        userRelationBottomLine: editedRelationBottomLine,
        keyEvents: editedEvents
      });

      // 2. Set current session archive status to true
      setIsSessionArchived(true);

      // 3. Set the new session title
      const finalTitle = editedTitle.trim() || '未命名会话';
      setSessionTitle(finalTitle);
      sessionTitleRef.current = finalTitle;
      isSessionArchivedRef.current = true;

      // 4. Save the archived session
      const saved = await saveCurrentSession();
      if (!saved) {
        throw new Error('保存归档会话失败');
      }

      message.success('伴侣记忆封存成功！当前会话已锁定归档。');
      setIsArchiveModalOpen(false);
    } catch (err) {
      console.error('封存记忆失败:', err);
      message.error(`封存记忆失败：${String(err)}`);
    }
```

</details>

**依据 3 · 源码核查**：[src/utils/archiveAnalysis.ts:1-20](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/utils/archiveAnalysis.ts#L1-L20)

JSON 解析没有领域事实核验。

<details>
<summary>查看原文（20行）</summary>

````text
export function parseArchiveAnalysisResponse(response: unknown): Record<string, any> {
  if (response && typeof response === 'object') {
    return response as Record<string, any>;
  }

  if (typeof response !== 'string') {
    throw new Error('记忆分析结果格式不正确');
  }

  const trimmed = response.trim();
  const fenced = trimmed.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  const jsonText = start >= 0 && end > start ? fenced.slice(start, end + 1) : fenced;

  try {
    return JSON.parse(jsonText);
  } catch {
    throw new Error('记忆分析结果不是合法 JSON，请重新分析');
  }
````

</details>

**依据 4 · 源码核查**：[src/stores/diskStorage.ts:9-34](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/stores/diskStorage.ts#L9-L34)

磁盘状态接口和删除无操作。

<details>
<summary>查看原文（26行）</summary>

```text
    getItem: async () => {
      try {
        const content = await appInvoke('load_app_state', { name });
        return content;
      } catch {
        if (localStorageKey) {
          const oldData = localStorage.getItem(localStorageKey);
          if (oldData !== null) {
            try {
              await appInvoke('save_app_state', { name, content: oldData });
              localStorage.removeItem(localStorageKey);
            } catch {
              // ignore save errors during migration
            }
            return oldData;
          }
        }
        return null;
      }
    },
    setItem: async (_, value) => {
      await appInvoke('save_app_state', { name, content: value });
    },
    removeItem: async () => {
      // no-op: app state deletion is not exposed
    },
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/commands/workspace.rs:510-529](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src-tauri/src/commands/workspace.rs#L510-L529)

命令将状态写到 Documents 下配置。

<details>
<summary>查看原文（20行）</summary>

```text
pub fn save_app_state_path(base: &Path, name: &str, content: &str) -> Result<(), String> {
    if name.contains('/') || name.contains('\\') || name.contains("..") {
        return Err("非法的状态名称".to_string());
    }
    let dir = base.join("MuseAI").join("config");
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{}.json", name));
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn load_app_state(app: AppHandle, name: String) -> Result<String, String> {
    let doc_dir = resolve_document_dir(&app)?;
    load_app_state_path(&doc_dir, &name)
}

#[tauri::command]
pub fn save_app_state(app: AppHandle, name: String, content: String) -> Result<(), String> {
    let doc_dir = resolve_document_dir(&app)?;
    save_app_state_path(&doc_dir, &name, &content)
```

</details>

#### 缺口

- 后端模型分析完整链与失败原子性未验证
  **影响**：不能充分支持记忆准确及可靠封存主张
  **进一步探讨**：补查命令实现并故障注入保存失败，核对角色和归档是否可恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 模型与状态存储带来哪些操作和成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需配置 API 地址、密钥和模型，再建立世界书与角色卡；本地保存的是作品、状态和会话，分析时 Chat.tsx 将历史与角色设定交给配置的模型服务，因此本地存储不意味着全部推理数据不出机。持续成本包括聊天与独立封存分析调用、人工纠错及定期备份；无本轮价格和工作量，不能估算单位合格剧情费用。失败恢复应先备份 Documents/MuseAI 并核对角色卡和会话，不能仅因成功弹窗推断两份数据已一致；退出可保留本地文件，但恢复操作与格式迁移没有实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:160-178](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/README.md#L160-L178)

配置与用户操作步骤。

<details>
<summary>查看原文（19行）</summary>

```text
### 2. 配置 AI 模型

首次启动后，进入「设置」页面，配置你的 AI 模型：

1. 填写 API Key（支持 OpenAI、Anthropic 及兼容 OpenAI 格式的第三方服务）
2. 填写 API 地址（如使用国内中转服务，在此填写自定义地址）
3. 选择模型名称（如 `deepseek-v4-flash`、`claude-sonnet-4-6` 等）
4. 点击「测试连接」，确认配置正确

![MuseAI 设置页：配置 OpenAI、Claude、DeepSeek、Kimi 等模型服务](assets/设置页.png)

你可以为伴侣聊天、冒险、穿书、去 AI 味、大纲等模块分别配置不同模型和参数，灵活搭配效果、速度与成本。

### 3. 开始使用

- **AI 伴侣**：在「背景设定」创建世界书和角色卡，再到「伴侣对话」选择角色开始聊天
- **文字冒险**：在「冒险」选择世界书和角色卡，输入开场剧情后开始 AI 跑团
- **穿书互动**：先到「穿书素材」装配大纲、世界书和角色卡，再进入「穿书」开始剧情
- **羁绊档案**：对话或冒险归档后，到「羁绊」查看关系变化和关键事件
```

</details>

**依据 2 · 作者声明**：[README.md:215-222](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/README.md#L215-L222)

本地存储位置和备份建议。

```text
| 角色卡 / 世界书 | `~/Documents/MuseAI/config/partner-store.json` |
| 智能伴侣会话 | `~/Documents/MuseAI/agent-sessions/partner-session-*.json` |
| 故事冒险会话 | `~/Documents/MuseAI/agent-sessions/story-session-*.json` |
| 写作 Agent 会话 | `~/Documents/MuseAI/agent-sessions/session-*.json` |
| 应用设置 | `~/Documents/MuseAI/config/settings-store.json` |
| 各模块 UI 状态 | `~/Documents/MuseAI/config/*.json` |

建议定期备份 `~/Documents/MuseAI/` 目录，以防数据丢失。
```

**依据 3 · 源码核查**：[src/pages/Chat.tsx:894-910](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/pages/Chat.tsx#L894-L910)

分析请求携历史、角色和 API 配置。

<details>
<summary>查看原文（17行）</summary>

```text
      const resultStr = await invoke<string | Record<string, any>>('analyze_character_memory', {
        request: {
          modelInterface: settings.modelInterface,
          baseUrl: settings.llmBaseUrl,
          apiKey: settings.llmApiKey,
          model: settings.llmModel,
          temperature: archiveConfig.temperature ?? 0.3,
          maxOutputTokens: archiveConfig.maxOutputTokens ?? 32000,
          thinkingDepth: archiveConfig.thinkingDepth ?? 'off',
          systemPrompt: settings.chatArchivePrompt || undefined,
          chatHistory: chatHistoryText,
          targetCharacterName: selectedCharacterCard.name,
          targetCharacterContent: selectedCharacterCard.content,
          currentUserRelationType: selectedCharacterCard.fields?.userRelationType || '',
          currentUserInteractionModel: selectedCharacterCard.fields?.userInteractionModel || '',
          currentUserRelationBottomLine: selectedCharacterCard.fields?.userRelationBottomLine || '',
          currentEvents: selectedCharacterCard.fields?.keyEvents || '暂无共同经历的关键事件。'
```

</details>

#### 缺口

- 封存调用费用和纠错时间未知
  **影响**：无法证明自动记忆更省成本
  **进一步探讨**：记录聊天与归档全调用账单、纠错次数及恢复时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁能试用，怎样验证记忆确实有帮助？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前建议观察，不把持有长期角色资料的用户直接导入正式档案：保存失败后的双状态一致性和后端模型链仍影响核心承诺。有开发能力的创作者可先用虚构副本审查，不迁移唯一角色资料。可验证的方向是把记忆修改作为待确认差异、与会话归档一起提交并保留回退点；这会增加存储和确认步骤，假设其减少错误记忆与恢复时间。以同一剧情对比人工角色卡和自动封存，检查虚构事件、关系漂移及失败恢复；若更难纠错或会话与角色不一致，回到手工角色卡和文件备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/Chat.tsx:930-962](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/src/pages/Chat.tsx#L930-L962)

保存顺序是事务式记忆假设的直接起点。

<details>
<summary>查看原文（33行）</summary>

```text
  const handleConfirmArchive = async () => {
    if (!selectedCharacterCard) return;

    try {
      // 1. Update character card fields in usePartnerStore
      updateItemFields(selectedCharacterCard.id, 'character_card', {
        userRelationType: editedRelationType,
        userInteractionModel: editedRelationModel,
        userRelationBottomLine: editedRelationBottomLine,
        keyEvents: editedEvents
      });

      // 2. Set current session archive status to true
      setIsSessionArchived(true);

      // 3. Set the new session title
      const finalTitle = editedTitle.trim() || '未命名会话';
      setSessionTitle(finalTitle);
      sessionTitleRef.current = finalTitle;
      isSessionArchivedRef.current = true;

      // 4. Save the archived session
      const saved = await saveCurrentSession();
      if (!saved) {
        throw new Error('保存归档会话失败');
      }

      message.success('伴侣记忆封存成功！当前会话已锁定归档。');
      setIsArchiveModalOpen(false);
    } catch (err) {
      console.error('封存记忆失败:', err);
      message.error(`封存记忆失败：${String(err)}`);
    }
```

</details>

**依据 2 · 作者声明**：[README.md:215-222](https://github.com/yejiming/MuseAI/blob/85c1ea76c565e697f510cc45d82ebcb352458dd6/README.md#L215-L222)

备份提供当前可行退路。

```text
| 角色卡 / 世界书 | `~/Documents/MuseAI/config/partner-store.json` |
| 智能伴侣会话 | `~/Documents/MuseAI/agent-sessions/partner-session-*.json` |
| 故事冒险会话 | `~/Documents/MuseAI/agent-sessions/story-session-*.json` |
| 写作 Agent 会话 | `~/Documents/MuseAI/agent-sessions/session-*.json` |
| 应用设置 | `~/Documents/MuseAI/config/settings-store.json` |
| 各模块 UI 状态 | `~/Documents/MuseAI/config/*.json` |

建议定期备份 `~/Documents/MuseAI/` 目录，以防数据丢失。
```

#### 缺口

- 事务式封存改善效果尚未验证
  **影响**：不是已有功能贡献
  **进一步探讨**：先检验失败时角色与会话均不改变，再比较纠错投入

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
