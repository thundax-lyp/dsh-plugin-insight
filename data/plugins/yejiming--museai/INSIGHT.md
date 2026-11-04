# MuseAI

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b601d64](https://github.com/yejiming/MuseAI/tree/b601d648c15dc9905480f3637504fd9438244d5d)

<!-- BEGIN META -->
[![GitHub ★ 682](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=682&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yejiming/MuseAI)
<!-- END META -->

> **功能**：本地角色对话、文字冒险与故事世界资料管理应用。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示角色资料与人工确认归档结合；长期质量未对照。

> **主要限制**：[Q03](#research-q03) 显示公开 LAN 状态返回含 token 的结构；[Q02](#research-q02) 归档多步写入无显式回滚。

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
  - [Q01 · MuseAI 面向什么人，相对普通聊天的增量是什么？](#detail-section-11)
  - [Q02 · 聊天与角色记忆从输入到归档如何接线？](#detail-section-12)
  - [Q03 · 局域网模式的 token 是否限制了未授权访问？](#detail-section-13)
  - [Q04 · 本地存储是否意味着不发送内容，使用与退出成本是什么？](#detail-section-14)
  - [Q05 · 如何同时改善 LAN 凭据与归档中断后的恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望长期整理角色卡、世界观和对话的角色互动与文字冒险用户。

普通模型聊天和手工文档也可保存人物与对话；本应用组织角色资料与归档交互。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 角色对话 | 使用角色和历史请求模型 | 内容发送配置的服务 |
| 记忆归档 | 用户审阅并更新角色 | 多步保存失败可能不一致 |
| LAN 访问 | 手机连接桌面应用 | 公开状态可能泄露访问 token |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| 桌面 Tauri 环境 | 应用运行需要 | 界面与本地命令 | 无法运行 |
| 模型端点与 API key | 生成需要 | 聊天和记忆分析 | 请求不可用 |
| 本地存储与备份 | 持续使用需要 | 保存会话及角色 | 故障可能丢数据 |
| 可信网络隔离 | 使用 LAN 前需审查 | 防止未授权访问 | 公开状态存在凭据暴露路径 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户备份目录并核对模型提供商 | 无法接受外发则停止 |
| 聊天 | 用户选择角色并发送非敏感样本 | 结果错误时人工修正 |
| 归档 | 检查分析后确认角色变化 | 保存失败时核对角色和会话 |
| LAN | 保持关闭直至访问边界被修复验证 | 不可信网络不得启用 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 桌面环境、模型凭据 | 设置角色和服务商 | 兼容未知 |
| 持续 | 模型调用与磁盘 | 审核和备份 | 实际费用未知 |
| 恢复 | 备份副本 | 检查部分归档状态 | 故障恢复未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 角色归档 | 用户确认及保存源码 | 记忆真实性和持久一致性 |
| 本地记录 | 应用状态写入 | 全路径隐私 |
| LAN 访问 | 服务路由源码 | 公开状态风险的实际可达性 |

> **思考**：[Q03](#research-q03) 显示公开 LAN 状态返回含 token 的结构；[Q02](#research-q02) 归档多步写入无显式回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示角色资料与人工确认归档结合；长期质量未对照。

[Q02](#research-q02) 保留用户确认环节，但角色更新与会话保存分步；[Q03](#research-q03) 公开状态与 token 鉴权存在交叉边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示公开 LAN 状态返回含 token 的结构；[Q02](#research-q02) 归档多步写入无显式回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅在可信环境用非敏感资料观察并备份；[Q03](#research-q03) 的状态暴露未修复核实前不启用 LAN。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

定向检查固定版本源码；未运行目标、网络服务或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/pages/Chat.tsx、src/stores/diskStorage.ts、src-tauri/src/mobile_server.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查桌面角色聊天、归档确认、磁盘存储和 LAN 路由；未全审模型请求、全部文件接口与宿主网络。
- 下一步：在隔离网络核对无凭据状态请求与受保护 API，注入保存失败，并验证备份恢复；本次均未运行。

**分析版本**

- **仓库**：[yejiming/MuseAI](https://github.com/yejiming/MuseAI)
- **版本号**：0.9.8（[固定提交 b601d64](https://github.com/yejiming/MuseAI/tree/b601d648c15dc9905480f3637504fd9438244d5d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出隐藏公开状态凭据及协调归档恢复，需测试配对与故障。

在隔离网络核对无凭据状态请求与受保护 API，注入保存失败，并验证备份恢复；本次均未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 46 | 14055 | — | — | 192928 |
| .tsx | test | 27 | 5661 | 4933 | 14 | — |
| .ts | test | 24 | 2619 | 2294 | 14 | — |
| .tsx | source | 40 | 26720 | 24864 | 241 | — |
| .ts | source | 32 | 5984 | 5321 | 109 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/yejiming/MuseAI/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立角色互动应用的归档、模型外发与局域网访问边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · MuseAI 面向什么人，相对普通聊天的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

MuseAI 是独立 Tauri 本地桌面应用，面向维护角色设定、长期对话及文字冒险的用户；README 链接的 DSH 客户端插件位于另一个仓库，不能把根应用当 DSH 插件。相对普通聊天，它组织角色卡、会话和用户确认的记忆归档，但长期一致性、陪伴感或实际创作收益未对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-13](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/README.md#L1-L13)

作者介绍应用并另链 DSH 插件。

<details>
<summary>查看原文（13行）</summary>

```text
# MuseAI — 本地 AI 伴侣、文字冒险与穿书互动应用

[English](README_EN.md) | 简体中文


> ### 🆕 重要更新：MuseAI 现在可以装进 DeepSeek Harness
> 新增 DSH 客户端插件 —— 把 MuseAI 装进 DeepSeek Harness
> 
> 一边用 DSH 干活，一边与 AI 冒险！→ https://github.com/yejiming/dsh-museai-tavern

MuseAI 是一款面向沉浸式角色互动的本地 AI 应用。你可以创建自己的角色与世界设定，和角色持续对话、共同经历冒险，并在一次次互动中积累关系、记忆与羁绊。

它不只是普通的 AI 聊天工具，也不只是写作软件。MuseAI 更像一个可以保存世界、角色、记忆和关系的本地 AI 互动世界。
```

</details>

**依据 2 · 作者声明**：[README.md:228-234](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/README.md#L228-L234)

作者描述持续资料与用途。

```text
**Q：MuseAI 和普通 AI 聊天工具有什么区别？**

A：普通 AI 聊天工具通常以单次对话为主，角色、世界观和记忆容易散落在不同窗口里。MuseAI 会把世界书、角色卡、聊天记录、冒险记录和羁绊变化保存在本地，让同一个角色可以长期延续。

**Q：MuseAI 是 AI 伴侣应用还是 AI 写作工具？**

A：MuseAI 当前更适合作为本地 AI 伴侣、AI 角色聊天、文字冒险和穿书互动应用使用。作品管理、大纲、反向大纲和去 AI 味属于辅助创作能力，用来帮助你整理故事世界和互动素材。
```

**依据 3 · 源码核查**：[package.json:1-14](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/package.json#L1-L14)

私有应用和 Tauri 工具链。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "museai",
  "private": true,
  "version": "0.9.8",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "test": "vitest run"
  },
  "dependencies": {
    "@ant-design/icons": "^6.2.3",
```

</details>

**依据 4 · 源码核查**：[src/pages/Chat.tsx:930-952](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L930-L952)

归档确认写回角色和会话。

<details>
<summary>查看原文（23行）</summary>

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
```

</details>

#### 缺口

- 缺少用户对照与长期体验数据
  **影响**：无法证明记忆质量或陪伴效果
  **进一步探讨**：固定角色任务对比普通聊天并评估一致性与人工纠错。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 聊天与角色记忆从输入到归档如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端将用户消息与已有历史组装后，向 start_chat_completion_stream 传入提供商地址、API key、模型、系统提示和消息；记忆归档先按用户/角色组合历史并调用 analyze_character_memory，解析结果后展示给用户编辑。用户确认时先更新角色字段、设置归档标志，再调用 saveCurrentSession 保存；这不是单一原子写，保存失败时捕获并提示，但已更新的内存及角色字段没有在该分支回滚。不能把提取出的记忆视作客观事实。

#### 证据与依据

**依据 1 · 源码核查**：[src/pages/Chat.tsx:528-560](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L528-L560)

构造消息与模型请求。

<details>
<summary>查看原文（33行）</summary>

```text
    const nextMessages = [...messages, userMessage, pendingAgentMessage];
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
    setInput('');
    setIsStreaming(true);
    scrollToBottomOnce();

    try {
      // Map Zustand Messages to LLM API message schema
      const modelMessages = nextMessages.slice(0, -1).map(msg => ({
        id: msg.id,
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const runId = await invoke<string>('start_chat_completion_stream', {
        request: {
          agentId: 'partnerChat',
          modelInterface: settings.modelInterface,
          baseUrl: settings.llmBaseUrl,
          apiKey: settings.llmApiKey,
          model: settings.llmModel,
          temperature: settings.agentConfigs?.partnerChat?.temperature ?? 0.3,
          maxOutputTokens: settings.agentConfigs?.partnerChat?.maxOutputTokens ?? 32000,
          maxContextTokens: settings.agentConfigs?.partnerChat?.maxContextTokens ?? 200000,
          compactionTurnThreshold: settings.agentConfigs?.partnerChat?.compactionTurnThreshold ?? 20,
          frequencyPenalty: settings.agentConfigs?.partnerChat?.frequencyPenalty ?? 0.3,
          presencePenalty: settings.agentConfigs?.partnerChat?.presencePenalty ?? 0.2,
          topP: settings.agentConfigs?.partnerChat?.topP ?? 0.9,
          thinkingDepth: settings.agentConfigs?.partnerChat?.thinkingDepth ?? 'off',
          systemPrompt: effectiveSystemPrompt,
          workspacePath: null,
          messages: modelMessages,
```

</details>

**依据 2 · 源码核查**：[src/pages/Chat.tsx:872-915](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L872-L915)

归档请求及分析结果。

<details>
<summary>查看原文（44行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/pages/Chat.tsx:930-962](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L930-L962)

确认时先更新角色及状态，再保存并提示错误。

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

**依据 4 · 源码核查**：[src/pages/Chat.tsx:318-342](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L318-L342)

会话保存内容。

<details>
<summary>查看原文（25行）</summary>

```text
  const saveCurrentSession = useCallback(async (title = sessionTitleRef.current, sessionIdOverride?: string) => {
    const userMessages = messagesRef.current.filter(m => m.role === 'user');
    if (userMessages.length === 0) return false;
    const currentSessionId = sessionIdOverride
      ? ensureSessionId(sessionIdOverride, 'partner-session')
      : ensureCurrentSessionId();

    try {
      await invoke<AgentSessionSummary>('save_agent_session', {
        session: {
          id: currentSessionId,
          title,
          savedAt: Date.now(),
          messages: messagesRef.current,
          selectedReferenceFiles: [],
          selectedOutlineFile: null,
          todos: [],
          contextCompaction: contextCompactionRef.current,
          isArchived: isSessionArchivedRef.current,
          characterCardId: selectedCharacterCardIdRef.current,
          selectedWorldBookId: selectedWorldBookIdRef.current,
          selectedStylePresetIds: selectedStylePresetIdsRef.current,
          initialStylePresetIds: initialStylePresetIdsRef.current,
          initialSystemPromptSnapshot: initialSystemPromptSnapshotRef.current,
        }
```

</details>

#### 缺口

- 未模拟写入失败和 Zustand 异步持久化
  **影响**：不能确定失败后的磁盘与内存最终状态
  **进一步探讨**：隔离环境注入会话保存失败并重启对照角色和归档标志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 局域网模式的 token 是否限制了未授权访问？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

服务尝试监听 0.0.0.0 的 4080–4085 端口，并通过 HTTP URL 的查询参数提供 token；状态和会话等路径经过 token 验证。然而 /api/mobile/status 被明确列为公开路径，其处理器直接序列化完整 MobileServiceStatus；服务启动后 status 同时含 token 和带 token 的 URL。由此可推断能访问该服务的网络客户端无需先持 token 即可能从公开状态取得 token，再访问受保护 API；此为固定源码链分析，未运行攻击，也未确认防火墙或具体部署可达性。默认 token 可在会话间更换，启用固定 token 时会写入本地文件。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/mobile_server.rs:27-34](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L27-L34)

状态包含 URL 与 token。

```text
#[derive(Clone, Serialize, Deserialize, Debug, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct MobileServiceStatus {
    pub is_running: bool,
    pub url: Option<String>,
    pub token: Option<String>,
    pub fixed_token_enabled: bool,
    pub error: Option<String>,
```

**依据 2 · 源码核查**：[src-tauri/src/mobile_server.rs:99-128](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L99-L128)

随机和固定 token 存取。

<details>
<summary>查看原文（30行）</summary>

```text
pub fn get_mobile_access_token() -> String {
    let cell = MOBILE_ACCESS_TOKEN.get_or_init(|| Mutex::new(String::new()));
    let mut guard = cell.lock().unwrap();
    if guard.is_empty() {
        *guard = current_fixed_mobile_token_path()
            .and_then(|path| load_token_from_path(&path))
            .unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
    }
    guard.clone()
}

/// Enables or disables the fixed mobile access token under a given user data root.
/// When enabled the token is persisted to `config/mobile-fixed-token` and reused
/// across restarts; when disabled the persisted token is removed and a fresh
/// random token is generated for the current session.
pub fn set_mobile_fixed_token_at(base: &std::path::Path, enabled: bool) -> Result<String, String> {
    let path = fixed_mobile_token_path(base);
    if enabled {
        let token =
            load_token_from_path(&path).unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        fs::write(&path, &token).map_err(|e| e.to_string())?;
        set_mobile_access_token(token.clone());
        Ok(token)
    } else {
        let _ = fs::remove_file(&path);
        let token = uuid::Uuid::new_v4().to_string();
        set_mobile_access_token(token.clone());
```

</details>

**依据 3 · 源码核查**：[src-tauri/src/mobile_server.rs:242-263](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L242-L263)

status 列为公开路径。

<details>
<summary>查看原文（22行）</summary>

```text
fn is_public_path(path: &str) -> bool {
    matches!(path, "/" | "/api/mobile/status") || path.starts_with("/assets/")
}

fn extract_token_from_cookies(cookie_header: &str) -> Option<String> {
    cookie_header.split(';').find_map(|kv| {
        let mut parts = kv.splitn(2, '=');
        let key = parts.next()?.trim();
        let val = parts.next()?.trim();
        if key == "mobile_token" {
            Some(val.to_string())
        } else {
            None
        }
    })
}

fn validate_token(req: &Request) -> bool {
    let path = req.uri().path();
    if is_public_path(path) {
        return true;
    }
```

</details>

**依据 4 · 源码核查**：[src-tauri/src/mobile_server.rs:265-291](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L265-L291)

其他路径接受 header、query 或 cookie token。

<details>
<summary>查看原文（27行）</summary>

```text
    let expected = get_mobile_access_token();

    if let Some(header_val) = req.headers().get("X-Mobile-Token") {
        if let Ok(s) = header_val.to_str() {
            if s == expected {
                return true;
            }
        }
    }

    if let Some(query) = req.uri().query() {
        if let Some(token) = parse_query(query).get("token") {
            if token == &expected {
                return true;
            }
        }
    }

    if let Some(cookie_header) = req.headers().get(header::COOKIE) {
        if let Ok(s) = cookie_header.to_str() {
            if let Some(token) = extract_token_from_cookies(s) {
                if token == expected {
                    return true;
                }
            }
        }
    }
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/mobile_server.rs:372-375](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L372-L375)

公开处理器返回完整状态。

```text
async fn get_mobile_status() -> impl IntoResponse {
    let status = get_status();
    axum::Json(status)
}
```

**依据 6 · 源码核查**：[src-tauri/src/mobile_server.rs:1642-1682](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L1642-L1682)

状态及数据接口均挂同一 middleware。

<details>
<summary>查看原文（41行）</summary>

```text
pub fn create_mobile_router<R: Runtime>(app_handle: AppHandle<R>) -> Router {
    Router::new()
        .route("/", get(serve_html::<R>))
        .route("/assets/{*path}", get(serve_static_assets::<R>))
        .route("/api/mobile/status", get(get_mobile_status))
        .route(
            "/api/mobile/state/{name}",
            get(get_app_state::<R>).post(save_app_state::<R>),
        )
        .route(
            "/api/mobile/sessions",
            get(list_sessions::<R>).post(save_session::<R>),
        )
        .route(
            "/api/mobile/sessions/{id}",
            get(load_session::<R>).delete(delete_session::<R>),
        )
        .route(
            "/api/mobile/sessions/{id}/title",
            put(update_session_title::<R>),
        )
        .route(
            "/api/mobile/sessions/{id}/analyze-memory",
            post(analyze_session_memory::<R>),
        )
        .route("/api/mobile/summarize", post(summarize_title::<R>))
        .route(
            "/api/mobile/character-cards/convert-silly-tavern",
            post(convert_character_card_to_silly_tavern_endpoint::<R>),
        )
        .route(
            "/api/mobile/sessions/{id}/archive",
            post(archive_session_memory::<R>),
        )
        .route("/api/mobile/chat/start", post(start_run_endpoint::<R>))
        .route("/api/mobile/story/start", post(start_run_endpoint::<R>))
        .route("/api/mobile/chat/stop", post(stop_run_endpoint::<R>))
        .route("/api/mobile/stream", get(subscribe_stream))
        .fallback(serve_html::<R>)
        .layer(axum::middleware::from_fn(auth_middleware))
        .with_state(app_handle)
```

</details>

**依据 7 · 源码核查**：[src-tauri/src/mobile_server.rs:1685-1692](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L1685-L1692)

监听所有接口。

```text
pub async fn start_server<R: Runtime>(app_handle: AppHandle<R>) -> Result<(), String> {
    let mut listener = None;
    let mut port = 4080;

    for p in 4080..=4085 {
        let addr = SocketAddr::from(([0, 0, 0, 0], p));
        if let Ok(l) = tokio::net::TcpListener::bind(&addr).await {
            listener = Some(l);
```

**依据 8 · 源码核查**：[src-tauri/src/mobile_server.rs:1710-1718](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L1710-L1718)

运行状态赋予 token 与 URL。

```text
    let lan_ip = get_lan_ip().unwrap_or(IpAddr::V4(std::net::Ipv4Addr::new(127, 0, 0, 1)));
    let token = get_mobile_access_token();
    let url = format!("http://{}:{}/?token={}", lan_ip, port, token);

    set_status(MobileServiceStatus {
        is_running: true,
        url: Some(url),
        token: Some(token),
        fixed_token_enabled: is_fixed_mobile_token_enabled(),
```

#### 缺口

- 未运行服务、检查防火墙或其他外层网关
  **影响**：不能声称实际发生泄露或任意网络均可达
  **进一步探讨**：隔离环境以无凭据客户端请求 status，再核对数据 API、访问控制与监听地址。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地存储是否意味着不发送内容，使用与退出成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

本地磁盘保存角色及会话，聊天和记忆分析请求明确包含模型地址、API key、消息或角色内容，实际由所配置服务处理，不能称内容绝不出机。使用者需审查提供商及模型费用、定期备份角色会话，并核对归档写入；启用局域网服务时 Q03 的公开状态令 token 不能作为可靠的网络隔离。若敏感内容、模型发送或网络风险无法接受，应停止 LAN 服务并避免发送敏感内容；备份和恢复是否成功仍需验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:206-222](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/README.md#L206-L222)

作者的数据路径与备份建议。

<details>
<summary>查看原文（17行）</summary>

```text

所有用户数据统一存放在 `~/Documents/MuseAI/` 目录下：

| 数据类型 | 存储位置 |
| --- | --- |
| 作品文件 | `~/Documents/MuseAI/articles/` |
| 范文库 | `~/Documents/MuseAI/references/` |
| 大纲文件 | `~/Documents/MuseAI/outline/` |
| 版本历史 | 各文件同目录下的 `.versions/` 文件夹 |
| 角色卡 / 世界书 | `~/Documents/MuseAI/config/partner-store.json` |
| 智能伴侣会话 | `~/Documents/MuseAI/agent-sessions/partner-session-*.json` |
| 故事冒险会话 | `~/Documents/MuseAI/agent-sessions/story-session-*.json` |
| 写作 Agent 会话 | `~/Documents/MuseAI/agent-sessions/session-*.json` |
| 应用设置 | `~/Documents/MuseAI/config/settings-store.json` |
| 各模块 UI 状态 | `~/Documents/MuseAI/config/*.json` |

建议定期备份 `~/Documents/MuseAI/` 目录，以防数据丢失。
```

</details>

**依据 2 · 源码核查**：[src/stores/diskStorage.ts:9-33](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/stores/diskStorage.ts#L9-L33)

应用状态写入和无删除实现。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/pages/Chat.tsx:543-560](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L543-L560)

对话请求传输配置及消息。

<details>
<summary>查看原文（18行）</summary>

```text
      const runId = await invoke<string>('start_chat_completion_stream', {
        request: {
          agentId: 'partnerChat',
          modelInterface: settings.modelInterface,
          baseUrl: settings.llmBaseUrl,
          apiKey: settings.llmApiKey,
          model: settings.llmModel,
          temperature: settings.agentConfigs?.partnerChat?.temperature ?? 0.3,
          maxOutputTokens: settings.agentConfigs?.partnerChat?.maxOutputTokens ?? 32000,
          maxContextTokens: settings.agentConfigs?.partnerChat?.maxContextTokens ?? 200000,
          compactionTurnThreshold: settings.agentConfigs?.partnerChat?.compactionTurnThreshold ?? 20,
          frequencyPenalty: settings.agentConfigs?.partnerChat?.frequencyPenalty ?? 0.3,
          presencePenalty: settings.agentConfigs?.partnerChat?.presencePenalty ?? 0.2,
          topP: settings.agentConfigs?.partnerChat?.topP ?? 0.9,
          thinkingDepth: settings.agentConfigs?.partnerChat?.thinkingDepth ?? 'off',
          systemPrompt: effectiveSystemPrompt,
          workspacePath: null,
          messages: modelMessages,
```

</details>

**依据 4 · 源码核查**：[src/pages/Chat.tsx:893-910](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L893-L910)

归档分析包含角色和对话。

<details>
<summary>查看原文（18行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src-tauri/src/mobile_server.rs:242-263](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L242-L263)

公开状态的安全边界。

<details>
<summary>查看原文（22行）</summary>

```text
fn is_public_path(path: &str) -> bool {
    matches!(path, "/" | "/api/mobile/status") || path.starts_with("/assets/")
}

fn extract_token_from_cookies(cookie_header: &str) -> Option<String> {
    cookie_header.split(';').find_map(|kv| {
        let mut parts = kv.splitn(2, '=');
        let key = parts.next()?.trim();
        let val = parts.next()?.trim();
        if key == "mobile_token" {
            Some(val.to_string())
        } else {
            None
        }
    })
}

fn validate_token(req: &Request) -> bool {
    let path = req.uri().path();
    if is_public_path(path) {
        return true;
    }
```

</details>

#### 缺口

- 没有全网络出口、费用和恢复实验
  **影响**：不能断定全部外发路径或量化成本
  **进一步探讨**：用非敏感样本观察网络和备份恢复并核对供应商数据条款。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何同时改善 LAN 凭据与归档中断后的恢复？

**研究主题**：新假设与验证

#### 完整回答

基于 Q03 的公开状态含 token，可假设将无凭据状态输出限制为不含 URL、token 的健康字段并仅在可信桌面通道显示配对信息，降低凭据暴露；基于 Q02 的多步归档，可假设以持久操作记录或受控回滚协调角色与会话。方案均未实现；对照无凭据请求与故障注入，核对配对可用性、未授权读取、角色和会话一致性以及恢复复杂度，若正常配对受损或新风险高于改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src-tauri/src/mobile_server.rs:242-263](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L242-L263)

公开状态入口。

<details>
<summary>查看原文（22行）</summary>

```text
fn is_public_path(path: &str) -> bool {
    matches!(path, "/" | "/api/mobile/status") || path.starts_with("/assets/")
}

fn extract_token_from_cookies(cookie_header: &str) -> Option<String> {
    cookie_header.split(';').find_map(|kv| {
        let mut parts = kv.splitn(2, '=');
        let key = parts.next()?.trim();
        let val = parts.next()?.trim();
        if key == "mobile_token" {
            Some(val.to_string())
        } else {
            None
        }
    })
}

fn validate_token(req: &Request) -> bool {
    let path = req.uri().path();
    if is_public_path(path) {
        return true;
    }
```

</details>

**依据 2 · 源码核查**：[src-tauri/src/mobile_server.rs:372-375](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src-tauri/src/mobile_server.rs#L372-L375)

直接返回状态。

```text
async fn get_mobile_status() -> impl IntoResponse {
    let status = get_status();
    axum::Json(status)
}
```

**依据 3 · 源码核查**：[src/pages/Chat.tsx:930-962](https://github.com/yejiming/MuseAI/blob/b601d648c15dc9905480f3637504fd9438244d5d/src/pages/Chat.tsx#L930-L962)

角色写入与会话保存顺序。

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

#### 缺口

- 候选方案未实现也未测试
  **影响**：无法保证安全或完整事务
  **进一步探讨**：开展无凭据 LAN 访问与归档写入故障矩阵。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
