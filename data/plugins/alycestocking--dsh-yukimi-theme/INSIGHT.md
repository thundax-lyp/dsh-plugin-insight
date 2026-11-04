# dsh-cgss-idol-theme

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5813a4c](https://github.com/AlyceStocking/dsh-cgss-idol-theme/tree/5813a4c84e53fd028dfa56d5c462515ec5a6d974)

<!-- BEGIN META -->
[![npm 30d 807](https://img.shields.io/static/v1?label=npm+30d&message=807&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cgss-idol-theme) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-cgss-idol-theme)
<!-- END META -->

> **功能**：CGSS 多角色 Web 主题，提供角色配色、卡面、沉浸阅读和 Windows 桌宠会话提醒。

> **亮点**：把角色主题与会话状态联动。对离开 DSH 窗口的 Windows 用户，待答和待批进入独立桌宠，点回目标会话处理；只需换色的用户可留在 Web。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：置顶桌宠仍携带会话标题，提醒在共享屏幕上会改变任务信息的可见范围。在线图像与随包台词也有各自的来源条件。[Q04](#research-q04)

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
  - [Q01 · 主题和桌宠服务什么任务？](#detail-section-11)
  - [Q02 · 从注册到提醒与返回会话如何连接？](#detail-section-12)
  - [Q03 · 轻量包怎样找到可信运行时，旧用户如何迁移？](#detail-section-13)
  - [Q04 · 标题与素材跨越什么边界？](#detail-section-14)
  - [Q05 · 怎样试用，何种改动值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢 CGSS 的用户可以改变 DSH 会话外观。Windows 桌面用户还可让桌宠提醒根会话的待答、待批与本轮结果。

原生界面适合不需要外部素材的工作会话；普通换色只能改变外观。桌宠的额外价值在离开 DSH 窗口后仍能看到指定的会话状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 角色主题和阅读 | 个性化会话界面 | 样式与在线素材按环境检查 |
| 桌宠提醒 | 识别待答、待批和本轮结果 | Windows x64，需要匹配的桌面 Profile 和运行时 |
| 返回会话 | 从提醒跳回对应会话 | 实际回跳和状态消退需验证 |

**流程与依赖**

| 依赖 | 用途 | 条件 |
|---|---|---|
| DSH Web 与主题接口 | 注入样式与角色部件 | 目标版本的页面结构需核对 |
| Windows x64 与 Electron | 独立桌宠 | 显式缓存或完整桌面包 |
| 外部图片 CDN | 角色图和背景 | 弱网、离线和来源条件影响可用性 |

| 阶段 | 操作 | 过关点 |
|---|---|---|
| Web | 独立 Profile 检查切角色和阅读 | 关闭后回到默认界面 |
| 桌面 | 确认运行时，完整重启 Host 和 Desktop | 匿名等待提醒能返回正确会话 |
| 退出 | 停用插件、关闭 helper | 无残余窗口，旧偏好备份可取回 |

**效果与成本**

| 阶段 | 资源 | 人工与失败边界 |
|---|---|---|
| Web | npm 或 Git 下载与在线图片 | 核对样式和素材条件 |
| 桌宠 | Electron 下载、解压和每次校验磁盘 I/O | 确认 Windows 环境、重启与排查缓存 |
| 迁移与退出 | 保留旧目录备份 | 旧雪美偏好需自行重设或回退 |

| 效果 | 源码支持 | 仍待验证 |
|---|---|---|
| 角色外观 | 令牌覆盖、图像与浏览器收藏 | 可读性和弱网表现 |
| 等待通知 | 事件聚合及状态回跳 | 漏看、错跳、关闭和共享屏幕影响 |

> **思考**：置顶桌宠仍携带会话标题，提醒在共享屏幕上会改变任务信息的可见范围。在线图像与随包台词也有各自的来源条件。[Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把角色主题与会话状态联动。对离开 DSH 窗口的 Windows 用户，待答和待批进入独立桌宠，点回目标会话处理；只需换色的用户可留在 Web。[Q01](#research-q01) [Q02](#research-q02)

浏览器令牌和 DOM 样式绑定 effect 清理，Host 将投影监听和 helper 生命周期收在一起。Windows 运行时使用临时提取、锁及同目录 rename；后续重算文件摘要会带来 I/O。多进程握手和本地验证各有边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

置顶桌宠仍携带会话标题，提醒在共享屏幕上会改变任务信息的可见范围。在线图像与随包台词也有各自的来源条件。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

用隔离 Web Profile 先看浅深色对话和退出；桌宠只在匿名会话试待答、待批和回跳。错跳、外部素材不适合或标题不应置顶时，关闭对应组件。[Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Web 样式注入、根会话提醒管道与显式运行时安装。真实界面、当前发布、素材权利和提示收益待核实。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js、package.json、cordis.patch.yml、lib/desktop-process.js、lib/desktop-runtime.js、lib/desktop-state.js、desktop/main.cjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定根包清单、bundle patch、浏览器入口片段、Host、命名管道、Electron 缓存和桌宠窗口。未执行插件、测试、发布安装、图片访问或 GUI 验收。
- 下一步：对照关闭与开启插件时的浅深色会话，在 Windows x64 用匿名并行会话触发审批、问答和结束，记录回跳、关闭与重复提示；再测试缺运行时和图像失败。

**分析版本**

- **仓库**：[AlyceStocking/dsh-cgss-idol-theme](https://github.com/AlyceStocking/dsh-cgss-idol-theme)
- **版本号**：1.3.4（[固定提交 5813a4c](https://github.com/AlyceStocking/dsh-cgss-idol-theme/tree/5813a4c84e53fd028dfa56d5c462515ec5a6d974)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可试验泛化标题的共享屏幕模式，同时保留用于回跳的会话身份。若匿名化后误点增加或录屏仍可看出原标题，就需要调整或放弃。尚未验证。[Q05](#research-q05)

对照关闭与开启插件时的浅深色会话，在 Windows x64 用匿名并行会话触发审批、问答和结束，记录回跳、关闭与重复提示；再测试缺运行时和图像失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 3077 | 2853 | 491 | — |
| .cjs | source | 2 | 404 | 389 | 16 | — |
| .md | source | 11 | 1046 | — | — | 27754 |
| .mjs | source | 14 | 1117 | 1030 | 41 | — |
| .cjs | test | 5 | 451 | 437 | 18 | — |
| .mjs | test | 20 | 3090 | 2866 | 18 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-cgss-idol-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-cgss-idol-theme/issues?q=is%3Aissue+created%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/AlyceStocking/dsh-cgss-idol-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T14%3A32%3A21.161Z..2026-11-04T14%3A32%3A21.161Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：偏好 CGSS 外观的用户能否只启用 Web 主题，或在 Windows 桌面得到能定位回正确会话的提醒，并知道每条路径的限制与退出办法？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 主题和桌宠服务什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Web 路径给日常 DSH 读写会话加角色配色、背景和交互部件。它适合对 CGSS 角色有明确偏好、希望在长会话里保留浅深色阅读体验的人。收藏在浏览器 localStorage 单独保存，写入失败时保留当次可用性。浅深色是样式条件，易读性仍取决于长代码、页面宽度与用户视觉需要。

桌宠另服务于把 Host 窗口切走的 Windows 桌面用户。相较默认在 DSH 界面内查看消息或只换背景，它可将根会话的待答、待批与本轮结果搬到桌面，点击后尝试回原会话。审批仍应在原会话处理；确认标准是提醒与目标会话一致、已处理提醒不会重复干扰。单窗口用户或只需配色的人从桌面路径获得的增量较小。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-24](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/README.md#L9-L24)

作者区分阅读、收藏与小人互动。

<details>
<summary>查看原文（16行）</summary>

```text
## 功能与覆盖范围

- **空白底板修复（1.3.4）**：修复思考时出现的空白小框和新会话顶部的半透明空栏；保留状态提示、布局按钮及正常标题/标签页，兼容浅色/深色与宽屏/窄屏。详见[验证记录](docs/empty-surfaces-validation.md)。

- **桌宠启动修复（1.3.3）**：修复 DSH Electron Host 将有效独立运行时误判为未安装的问题。运行时物理文件检查使用 Electron 的 `original-fs`，保留原有哈希和路径安全检查，不修改全局 ASAR 行为。已有有效 Electron 44.5.1 缓存无需重新下载；更新后需完整重启 Host。

- **偶像查询与收藏（1.3.2）**：Web 面板与 Windows 桌宠均使用单个可搜索下拉框，输入姓名或罗马字即可筛选。点击旁边的五角星收藏当前偶像，已收藏显示橙色实心星；下拉列表为收藏角色加星标并优先排列，组内保持目录顺序。支持方向键、Enter 选择与 Escape 关闭。收藏保存在各自的本地存储中，重开后保留；Web 与桌宠之间不共享收藏。

- **角色目录**：列出 190 位偶像，当前 **188 位可选**。向井拓海、村上巴因采集时返回 HTTP 567 暂列为“待收录”，不是断言其没有素材。另有 8 套缺少配套图标元数据的服装暂被排除。详见[收录报告](research/roster/README.md)与[例外清单](research/roster/coverage.json)。
- **素材目录**：可选角色包含 1,850 套服装、7,400 张小人姿态图与 3,702 张 CGSS 背景的 URL。印象色、签名、Mobamas 卡片、贴纸与过场动画按角色数据提供；并非每位角色都有贴纸或过场动画。
- **角色配色与阅读**：强调色和光晕跟随角色印象色，适配浅色/深色；聊天内容、工具和部分管理页面使用半透明磨砂底板，历史记录上下渐隐，输入卡片独立遮挡滚动内容。
- **小人互动**：拖动、单击翻转并显示台词、双击换装、长按打开角色/服装/背景选择。聚焦后可用 Enter/空格互动、菜单键打开设置、Escape 关闭设置。Windows 桌宠的设置是独立可拖动窗口；页面内面板跟随小人，闲置后收起。
- **装饰与布局**：签名水印、可选 Mobamas 轮播（默认关闭），不额外预留装饰侧栏。宽度小于 1100px 或高度小于 640px 时自动隐藏卡片与签名，小人缩小；沉浸模式另有显示规则。
- **纯背景模式**：点击聊天空白背景或按 Alt+I，临时收起侧栏、标题、输入栏和历史记录；再点背景、向上滚轮或按 Esc 恢复。历史消息与交互控件不是普通背景点击区。
- **沉浸阅读模式**：长按历史区域 650 毫秒或按 Alt+Shift+I，收起侧栏、标题与输入栏但保留可滚动的历史记录；再次长按、再次按快捷键或按 Esc 恢复，退出后还原原布局。移动、滚动、改变文字选区会取消长按；按钮、链接、输入控件及宽表格不触发此长按。
- **台词与问候**：点击优先抽取当前服装的中文译文，再回退到公共台词或 `。。。。。`；每个池使用洗牌队列，一轮抽完才重新洗牌，多条台词时避免新一轮首句紧接上一轮末句重复。启动按本机时间问候（11 点前早晨、11–17 点前午间、17 点起深夜场景），切换角色使用“体力已满”场景。均为文字，**没有语音播放，也不是模型生成的对话**。
```

</details>

**依据 2 · 作者声明**：[README.md:29-38](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/README.md#L29-L38)

作者将桌宠提醒限定在会话事件和本轮结果。

<details>
<summary>查看原文（10行）</summary>

```text
## Windows 桌宠

独立桌宠仅在 **Windows 的 desktop profile** 启动；普通 Web profile 不启动桌面辅助程序。透明窗口可在 DSH 主窗口最小化或隐藏后继续显示，停用插件或退出 Host 时关闭。桌宠就绪后隐藏页面内小人；启动失败时保留页面内小人。

- 监听运行中或仍有等待请求的主会话，不为子代理单独弹提醒。
- 提醒区区分正常结束、失败、中止、需要回答和需要审批，使用当前角色的场景台词，不再统一使用占位文案。正常结束仅指本轮结束，不表示整个项目已完成。
- 询问和审批保留到请求处理完；结束提醒约显示 5 秒，有等待提醒时排队。新提醒触发一次翻转；气泡显示期间维护置顶而不抢键盘焦点。
- 点击气泡唤起 Harness 并定位会话，不会自动回答或批准请求。
- 支持跨显示器拖动、屏幕边界约束和透明空白区域鼠标穿透。小人位置与设置面板位置独立保存。
- 只预热当前角色的当前服装与下一套，最多 8 张；解码缓存有并发与容量上限。换装等待解码，失败时保留原图；设置窗口不批量预热服装。
```

</details>

**依据 3 · 源码核查**：[lib/client.js:966-979](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/client.js#L966-L979)

浏览器收藏有独立存储键，持久化失败有本次会话退路。

<details>
<summary>查看原文（14行）</summary>

```text
			const FAVORITES_KEY = "dsh-cgss-idol-theme:favorite-idols:v1";
			const normalizeFavorites = value => new Set(Array.isArray(value) ? value.filter(id => typeof id === "string" && CHARACTER_LIST.some(c => c.id === id)) : []);
			const readFavorites = () => {
				try { return normalizeFavorites(JSON.parse(window.localStorage.getItem(FAVORITES_KEY))); } catch { return new Set(); }
			};
			let favoriteIds = readFavorites();
			const favoriteListeners = new Set();
			const publishFavorites = next => { favoriteIds = next; favoriteListeners.forEach(fn => fn(next)); };
			const toggleFavorite = id => {
				const next = new Set(favoriteIds);
				if (next.has(id)) next.delete(id); else next.add(id);
				try { window.localStorage.setItem(FAVORITES_KEY, JSON.stringify([...next])); } catch { /* Private mode/quota: keep this session usable. */ }
				publishFavorites(next);
			};
```

</details>

**依据 4 · 源码核查**：[lib/index.js:36-54](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L36-L54)

Host 只跟踪根会话，经状态快照发布。

<details>
<summary>查看原文（19行）</summary>

```text
  const titleOf = session => projections.stateOf(session, 'title') || '会话';
  const isRoot = agent => agents.roots().includes(agent);
  const track = agent => {
    if (!agent?.session || !isRoot(agent)) return false;
    sessions.set(agent.session.id, agent.session);
    state.track(agent.session.id, { title: titleOf(agent.session), running: agent.status === 'running' });
    return true;
  };
  const questionsOf = session => [
    ...(projections.stateOf(session, 'userQuestions')?.questions.active ?? []),
    ...[...(toolQuestions.get(session.id) ?? [])].map(callId => ({ callId })),
    ...[...liveQuestions.values()].filter(question => question.sessionId === session.id),
  ];
  const publish = () => {
    if (disposed || publishTimer) return;
    // Coalesce automatic approval decisions so they do not look like a human wait.
    publishTimer = setTimeout(() => {
      publishTimer = undefined;
      if (!disposed && state.active) safely(() => helper?.send(state.snapshot()));
```

</details>

#### 缺口

- 缺真实用户的提醒漏看和阅读反馈。
  **影响**：可说明任务，不能估计时间节省或视觉改善。
  **进一步探讨**：用两组匿名会话对照 Web 原样、只换主题和桌宠开启后的读写与提醒。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从注册到提醒与返回会话如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

npm 清单声明 Web 客户端导出和 DSH bundle patch，patch 插入内部条目 cgss-idol-theme。客户端读取 theme 注入并设置令牌覆盖，同时通过 effect 添加 CSS 且在清理时删除。Host 侧 apply 在非 Windows 或非 desktop Profile 时返回，主题和桌宠因此可分开看待。

桌面 Host 订阅根会话投影与事件，将当前询问合并并在 25 毫秒定时器里发快照。问答 waterfall 保留 next，在 finally 清掉本次请求，旧询问工具也可由 tool/call 与 tool/result 补足。启动时读取当前打开轮次的事件标识以恢复未决项。子进程通过随机命名管道和 token 握手；缺运行时只记错误并返回空 helper。点击桌宠发 open-session，Host 写待导航状态，浏览器在连接 RPC 取回并确认。插件卸载会注销监听、关闭 helper。源码能定位路径，当前真实 Host 对投影和连接服务的契约、导航成功和重启后的通知顺序尚未验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-30](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/package.json#L23-L30)

根包导出 Host 与 Web 客户端。

```text
  "description": "CGSS 偶像主题：多角色 Web 配色与卡面、沉浸阅读、Windows 桌宠和会话提醒。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

**依据 2 · 源码核查**：[cordis.patch.yml:3-11](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/cordis.patch.yml#L3-L11)

启用的 bundle 将真实 Host 插件挂载到 Profile。

```text
# Applied when this bundle appears in a profile's dsh.profile.bundles list.
# The host half owns a Windows desktop companion in the desktop profile;
# other profiles keep the Web theme only. The browser half (dsh.client) is
# discovered automatically through the package's dsh.client declaration +
# exports["./client"].

- insert:
    - id: cgss-idol-theme
      name: 'dsh-cgss-idol-theme'
```

**依据 3 · 源码核查**：[lib/client.js:150-167](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/client.js#L150-L167)

覆盖令牌和追加样式置于 effect 管理。

<details>
<summary>查看原文（18行）</summary>

```text
					"--dsw-alias-label-primary": { light: "#16203a", dark: "#f2f5ff" },
					"--dsw-alias-label-secondary": { light: "#3a4560", dark: "#b9c2de" },
					"--dsw-alias-state-error-primary": { light: "#d64545", dark: "#ff6b6b" },
					"--dsw-alias-state-success-primary": { light: "#31b56a", dark: "#3dd68c" },
					"--dsw-alias-state-warn-primary": { light: "#e6a23c", dark: "#f0b429" },
					"--dsw-specific-sidebar-fill": { light: "rgba(214,226,248,0.88)", dark: "rgba(20,24,51,0.84)" },
				};
				ctx.effect(() => theme.overrideTokens("yukimi-sajo", tokens));
			}

			ctx.effect(() => {
				const tag = document.createElement("style");
				tag.dataset.plugin = "dsh-cgss-idol-theme";
				tag.textContent = css;
				document.head.appendChild(tag);
				return () => tag.remove();
			});

```

</details>

**依据 4 · 源码核查**：[lib/index.js:8-13](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L8-L13)

Host 桌宠限定 Windows desktop。

```text
export const inject = ['connection', 'webServer', 'agents', 'sessionProjections'];

export function apply(ctx) {
  if (process.platform !== 'win32' || ctx.get('profileContext')?.name !== 'desktop') return;
  try { installDesktop(ctx); }
  catch (error) { startupError(error); throw error; }
```

**依据 5 · 源码核查**：[lib/index.js:88-105](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L88-L105)

问答 wrapper 保留后续流程并撤销临时登记。

<details>
<summary>查看原文（18行）</summary>

```text
  // Delegate the waterfall unchanged. Session events also cover older blocking question tools.
  listen('user-questions/request', async (request, next) => {
    const agent = request.agent;
    if (!agent || !isRoot(agent) || request.signal?.aborted) return next();
    // Legacy ask_user_question has no wait.callId; its tool/call already owns the notice.
    if (!request.wait?.callId && toolQuestions.get(agent.id)?.size) return next();
    const callId = request.wait?.callId || randomUUID(), key = `${agent.id}:${callId}`;
    safely(() => {
      track(agent); liveQuestions.set(key, { sessionId: agent.id, callId });
      state.ask(agent.id, callId, request.questions?.some(question => question.intent?.kind === 'plan-review'));
      publish();
    });
    try { return await next(); }
    finally {
      liveQuestions.delete(key);
      if (!disposed) safely(() => syncQuestions(agent.session));
    }
  }, { prepend: true });
```

</details>

**依据 6 · 源码核查**：[lib/index.js:107-123](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L107-L123)

恢复打开轮次内未决请求身份。

<details>
<summary>查看原文（17行）</summary>

```text
  for (const agent of agents.roots()) safely(() => {
    if (!track(agent)) return;
    const start = projections.stateOf(agent.session, 'turnBoundary')?.openTurnStartSeq;
    if (Number.isSafeInteger(start) && start >= 0) {
      const approvals = new Map(), calls = new Set();
      // Only inspect request identities in the current open turn; no chat content or old history.
      for (let seq = start; seq < agent.session.seq; seq++) {
        const event = agent.session.eventAt(seq);
        if (event?.type === 'approval/asked') approvals.set(event.data.id, event);
        if (event?.type === 'approval/decided') approvals.delete(event.data.id);
        if (event?.type === 'tool/call' && event.data.name === 'ask_user_question') calls.add(event.data.callId);
        if (event?.type === 'tool/result') calls.delete(event.data.message?.toolCallId);
      }
      toolQuestions.set(agent.id, calls);
      for (const event of approvals.values()) state.observe(agent.id, event);
    }
    syncQuestions(agent.session);
```

</details>

**依据 7 · 源码核查**：[lib/desktop-process.js:59-80](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-process.js#L59-L80)

握手超时及 token 校验。

<details>
<summary>查看原文（22行）</summary>

```text
    const handshakeTimer = setTimeout(() => connection.destroy(), 2000);
    handshakeTimer.unref();
    connection.on('error', error => { if (authenticated && !closing) fail(error); });
    connection.on('close', () => {
      clearTimeout(handshakeTimer); connections.delete(connection);
      if (authenticated && !ended && !closing) fail(new Error('桌宠连接已断开。'));
    });
    connection.on('data', chunk => {
      buffer += chunk;
      if (Buffer.byteLength(buffer, 'utf8') > 65536) { connection.destroy(); return; }
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const raw = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
        let message;
        try { message = JSON.parse(raw); } catch { continue; }
        if (!message || typeof message !== 'object' || Array.isArray(message)) continue;
        if (!authenticated) {
          if (message.type !== 'bridge-hello' || message.token !== token) { connection.destroy(); return; }
          authenticated = true; socket = connection; clearTimeout(handshakeTimer); closeServer();
          for (const line of pending.splice(0)) socket.write(line);
          continue;
        }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:129-160](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L129-L160)

连接 RPC、子进程消息与卸载边界。

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.get('connection').register(ctx, '/yukimi', async (endpoint, payload) => {
    if (disposed) return { ok: false, error: { code: 'yukimi/disposed', message: 'Plugin stopped', details: {} } };
    if (endpoint === 'state') return { ok: true, value: state.clientSnapshot() };
    if (endpoint === 'preferences') {
      const preferences = state.updatePreferences(payload);
      if (state.active) helper?.send({ type: 'preferences', preferences });
      return { ok: true, value: preferences };
    }
    if (endpoint === 'ack-navigation') return { ok: true, value: state.ackNavigation(payload?.requestId) };
    return { ok: false, error: { code: 'yukimi/unknown-endpoint', message: 'Unknown endpoint', details: {} } };
  });
  helper = startHelper({
    onError: report,
    onExit() { state.active = false; helper = null; },
    onMessage(message) {
      if (disposed) return;
      safely(() => {
        if (message.type === 'ready') { state.active = true; publish(); }
        if (message.type === 'preferences') { state.updatePreferences(message.preferences); publish(); }
        if (message.type === 'open-session') state.navigate(message.sessionId);
        if (message.type === 'notice-shown' && validId(message.id)) state.acknowledge(message.id);
      });
    },
  });
  const dispose = () => {
    if (disposed) return;
    disposed = true; state.active = false; clearTimeout(publishTimer);
    for (const stop of stopEvents) stop();
    stopProjection(); liveQuestions.clear(); toolQuestions.clear(); sessions.clear();
    helper?.close(); helper = null;
  };
  ctx.effect(() => dispose);
```

</details>

**依据 9 · 源码核查**：[lib/client.js:916-935](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/client.js#L916-L935)

浏览器轮询导航状态并在成功路径确认请求。

<details>
<summary>查看原文（20行）</summary>

```text
							}
						}
						const state = await call("state", {});
						if (!alive) return;
						if (typeof state?.active !== "boolean") throw new Error("Invalid Yukimi desktop state");
						setLocal({ ...sanitizePreferences(state.preferences), ...pendingPreferences, desktopActive: state.active });
						const navigation = state.navigation;
						if (typeof navigation?.requestId !== "string" || typeof navigation?.sessionId !== "string") return;
						if (lastOpenedRequestId !== navigation.requestId) {
							const workspace = ctx.get("uiWorkspace");
							if (typeof workspace?.openSession !== "function") return;
							await workspace.openSession(navigation.sessionId);
							if (!alive) return;
							lastOpenedRequestId = navigation.requestId;
						}
						await call("ack-navigation", { requestId: navigation.requestId });
					} catch {
						// A stopped helper or older web Host restores the original in-page pet.
						if (alive) setLocal({ desktopActive: false });
					} finally {
```

</details>

#### 缺口

- 未用真实桌面验证投影、审批和多会话切换。
  **影响**：不能保证不会漏、重发或跳错。
  **进一步探讨**：分别触发审批、问答、取消和关闭插件，观察事件归属、消退和回跳。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 轻量包怎样找到可信运行时，旧用户如何迁移？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

桌宠路径限制 Windows x64。helper 优先找完整包内的 EXE，其次找经验证的固定 Electron 缓存，最后才探测开发依赖。轻量包将大体积运行时拆到显式 CLI，Node 门槛由包清单声明。安装在 DSH_HOME 下持有目录锁，复制 ZIP 到独占暂存后按固定 SHA-256 检查，解压后列文件和哈希，再以 rename 交付；缓存存在但坏时拒绝覆盖。运行时查找对文件内容逐个计算哈希，与本地安装写出的清单对照。这给出了离线安装与识别普通缓存损坏的途径；同时改写缓存及其清单的本地操作者属于不同威胁，文件清单本身不是外部签名。

拆分节省 Web 取得包时的传输，桌宠仍要另付 Electron 下载和磁盘空间，校验是每次 status 与缓存解析的本地 I/O。旧包要按 README 先停用再安装，作者明确原雪美目录不自动迁，继续保留备份可减少回退成本。不能从源码包名推出 registry 当前可下到对应包。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:67-79](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/package.json#L67-L79)

CLI、Node 门槛与下载依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "devDependencies": {
    "@electron/packager": "20.3.0",
    "electron": "44.5.1"
  },
  "engines": {
    "node": ">=22.12.0"
  },
  "bin": {
    "dsh-cgss-idol-runtime": "./scripts/desktop-runtime.mjs"
  },
  "dependencies": {
    "@electron/get": "5.1.0",
    "extract-zip": "2.0.1"
```

</details>

**依据 2 · 源码核查**：[lib/desktop-process.js:12-25](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-process.js#L12-L25)

完整包、缓存及开发运行时的查找优先级和缺失处理。

<details>
<summary>查看原文（14行）</summary>

```text
export function helperCommand({ root: packageRoot = root, dshHome, platform = process.platform, arch = process.arch, resolveCached = findCachedRuntime } = {}) {
  if (platform !== 'win32' || arch !== 'x64') return null;
  const bundled = path.join(packageRoot, 'desktop', 'runtime', 'win32-x64', 'CGSS Idol Desktop.exe');
  if (existsSync(bundled)) return { executable: bundled, args: [] };
  const cached = resolveCached({ dshHome, platform, arch });
  if (cached) return { executable: cached, args: [path.join(packageRoot, 'desktop', 'main.cjs')] };
  const development = path.join(packageRoot, 'node_modules', 'electron', 'dist', 'electron.exe');
  if (existsSync(development)) return { executable: development, args: [path.join(packageRoot, 'desktop', 'main.cjs')] };
  return null;
}

export function launchHelper({ onMessage, onExit, onError, command = helperCommand(), spawnProcess = spawn,
  dataDirectory = path.join(process.env.DSH_HOME || path.join(homedir(), '.dsh'), 'idol-desktop'), startupTimeout = 20000 }) {
  if (!command) { onError(new Error('桌宠运行时未安装。请按 README 显式运行 dsh-cgss-idol-runtime install，或安装 GitHub 完整桌宠包；Web 主题仍可使用。')); return null; }
```

</details>

**依据 3 · 源码核查**：[lib/desktop-runtime.js:96-114](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-runtime.js#L96-L114)

每次有效缓存查找重新枚举并校验文件。

<details>
<summary>查看原文（19行）</summary>

```text
function validCache(directory) {
  if (!noLinks(directory).isDirectory()) return false;
  const manifestPath = path.join(directory, manifestName);
  if (!noLinks(manifestPath).isFile()) return false;
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.schema !== 1 || manifest.version !== RUNTIME_VERSION || manifest.platform !== 'win32'
    || manifest.arch !== 'x64' || manifest.archiveSha256 !== RUNTIME_SHA256 || !manifest.files) return false;
  const files = inventory(directory), names = Object.keys(files);
  requireComplete(files, directory);
  return names.length === Object.keys(manifest.files).length && names.every(name => Object.hasOwn(manifest.files, name)
    && files[name].size === manifest.files[name].size && files[name].sha256 === manifest.files[name].sha256);
}

/** Synchronous, read-only, offline lookup. Invalid, linked or unsupported caches return null. */
export function findCachedRuntime(options = {}) {
  if (!supported(options)) return null;
  const directory = runtimeDirectory(options);
  try { return validCache(directory) ? path.join(directory, 'electron.exe') : null; } catch { return null; }
}
```

</details>

**依据 4 · 源码核查**：[lib/desktop-runtime.js:135-169](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-runtime.js#L135-L169)

安装锁、拒绝覆盖、私有 ZIP 校验、清单与 rename。

<details>
<summary>查看原文（35行）</summary>

```text
/** Explicit install only. Dependency overrides are for trusted, offline tests. */
export async function installRuntime(options = {}, dependencies = {}) {
  if (!supported(options)) throw new Error('Desktop runtime installation supports Windows x64 only.');
  const directory = runtimeDirectory(options), parent = path.dirname(directory);
  await ensureDirectory(parent);
  const lock = directory + '.lock';
  try { await mkdir(lock); } catch (error) {
    if (error.code === 'EEXIST') throw new Error('Runtime install is locked: ' + lock + '. If no installer is running, remove this stale lock manually.');
    throw error;
  }
  let staging;
  try {
    if (exists(directory)) {
      const executable = findCachedRuntime(options);
      if (!executable) throw new Error('Existing runtime cache is invalid; refusing to overwrite: ' + directory);
      return { executable, directory, reused: true };
    }
    const source = path.resolve(options.archive || await (dependencies.download || downloadRuntime)());
    if (!noLinks(source).isFile()) throw new Error('Archive is not a regular file: ' + source);
    staging = await mkdtemp(path.join(parent, '.' + RUNTIME_NAME + '-'));
    const archive = path.join(staging, 'electron.zip'), extracted = path.join(staging, 'runtime');
    // Hash a private copy so changes to an external archive cannot race extraction.
    await copyFile(source, archive);
    const digest = await (dependencies.hashArchive || fileHash)(archive);
    if (digest !== RUNTIME_SHA256) throw new Error('Electron archive SHA256 mismatch; expected ' + RUNTIME_SHA256 + ', received ' + digest);
    await mkdir(extracted);
    await (dependencies.extract || extractRuntime)(archive, { dir: extracted, onEntry: checkEntry });
    if (exists(path.join(extracted, manifestName))) throw new Error('Archive contains a reserved runtime manifest.');
    const files = inventory(extracted);
    requireComplete(files, extracted);
    await writeFile(path.join(extracted, manifestName), JSON.stringify({ schema: 1, version: RUNTIME_VERSION,
      platform: 'win32', arch: 'x64', archiveSha256: RUNTIME_SHA256, files }, null, 2) + '\n', { flag: 'wx' });
    if (exists(directory)) throw new Error('Runtime destination appeared during installation; refusing to overwrite.');
    await rename(extracted, directory);
    return { executable: path.join(directory, 'electron.exe'), directory, reused: false };
```

</details>

**依据 5 · 作者声明**：[README.md:46-52](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/README.md#L46-L52)

作者给旧包停用、目录保留和完整重启要求。

```text
### 从旧包迁移

仓库改名不会自动把已安装的旧包依赖改成新包。请在会话空闲时操作，并先备份桌宠偏好：

1. 在“插件”页停用并移除已安装的 `dsh-yukimi-theme` 或 `dsh-idol-theme`，再安装新包。不要同时启用新旧主题，它们共用部分 RPC、样式和存储实现。
2. `dsh-idol-theme` 的 `idol-desktop` 数据目录继续沿用。原雪美版使用 `yukimi-desktop`；本次改名**不自动搬迁该目录**，请保留原文件作为备份，需要时在新主题重新设置。
3. 安装后确认新包总开关和内部 `cgss-idol-theme` 条目均启用，再完整重启对应的 DSH 服务或桌面应用及 Host。
```

**依据 6 · 作者声明**：[README.md:94-104](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/README.md#L94-L104)

作者说明缓存开销及验证范围。

<details>
<summary>查看原文（11行）</summary>

````text
运行时固定为 Electron **44.5.1 / Windows x64**，保存在 `$DSH_HOME/idol-desktop/runtimes/electron-44.5.1-win32-x64/`（默认 `DSH_HOME` 为 `~/.dsh`），而不是 npx 临时目录。有效的同版本缓存直接复用，不重复下载。当前每次执行 `status`，以及 Host 启动时解析缓存，都会逐文件读取并进行 SHA-256 校验，覆盖整个 Electron 缓存（约几百 MB）；此校验不联网，但每次检查/启动都有磁盘 I/O 成本，并非仅首次验证。安装并用 `status` 确认后，检查插件开关并**完整重启 DSH Desktop 与 Host**；Host 使用固定缓存中的 Electron 运行当前已安装插件的 [desktop/main.cjs](<desktop/main.cjs>)，无需保留 npx 临时目录。

可通过 `--archive` 使用预先下载的[官方 Electron zip](https://github.com/electron/electron/releases/download/v44.5.1/electron-v44.5.1-win32-x64.zip)，离线安装运行时：

```powershell
npx --yes --package=dsh-cgss-idol-theme@1.3.4 dsh-cgss-idol-runtime install --archive "D:\Downloads\electron-v44.5.1-win32-x64.zip" --dsh-home "D:\DSHData"
```

在线下载与 `--archive` 都必须通过相同的固定 SHA-256 校验：`9b382492dcfee91f8f9e92c91f7972550a1b95d2299cac72279dab33a600d7db`，来源为[官方 v44.5.1 SHASUMS256.txt](https://github.com/electron/electron/releases/download/v44.5.1/SHASUMS256.txt)。`--archive` 只免除运行时下载；npx 所需的 npm 包及依赖也必须已缓存，才能在完全离线时执行。

**轻量 npm 下载不等于桌宠总磁盘占用变小**：首次使用桌宠仍需单独下载、解压 Electron。1.3.3 已在真实 DSH Electron 执行环境中验证独立桌宠启动至 `BRIDGE_READY` 并正常关闭（隔离偏好目录）；尚未逐项验证真实用户会话的 GUI 交互，不能将 CLI 的 `Ready` 单独视为桌宠现场验收通过。npm 尚不可用时先用 GitHub 安装 Web 主题；桌宠可使用下方已发布的 v1.3.0 完整包或源码完整构建流程。
````

</details>

#### 缺口

- 未实测缓存校验耗时与桌面启动开销。
  **影响**：无法估计慢盘、坏缓存或残留锁下的恢复成本。
  **进一步探讨**：在 Windows x64 临时 DSH_HOME 比较 Web 启动、冷装、有效缓存和坏缓存，记录时间、空间与错误。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 标题与素材跨越什么边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

本地 IPC 发送的是由 Host 压缩的提醒状态。标题截断到 100 字符，但仍进入通知的 title 字段，有的场景文本也会替换营业名为标题。独立窗口置顶，因而会议共享屏幕时标题仍可能暴露任务名称。命名管道握手与窗口沙箱减少了跨进程接入面，无法改变用户正在共享的屏幕内容。浏览器 RPC 的 state 返回活动、偏好和导航字段，桌面快照另含通知，不应把两者的数据范围混为一谈。

远程图片依赖 BWiki CDN，作者明确提醒统计是采集及结构覆盖。源码中的默认背景是外链，文本与元数据则随包分发的情况有作者说明。代码许可与角色、图像、原台词或译文授权是不同来源；本轮没有核验各自权利条件，也没有访问 CDN 判断可用率。低网速或工作环境要求无外部素材请求时，适合回退原生主题。

#### 证据与依据

**依据 1 · 源码核查**：[lib/desktop-state.js:36-56](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-state.js#L36-L56)

标题进入提醒对象，场景填充用同一个标题。

<details>
<summary>查看原文（21行）</summary>

```text
  track(sessionId, { title, running } = {}) {
    if (!validId(sessionId)) return;
    const current = this.sessions.get(sessionId) ?? { title: '会话', running: false };
    if (typeof title === 'string' && title.trim()) current.title = title.trim().slice(0, 100);
    if (typeof running === 'boolean') current.running = running;
    this.sessions.set(sessionId, current);
    for (const notice of this.notices.values()) if (notice.sessionId === sessionId) notice.title = current.title;
  }

  addNotice(sessionId, kind, key, persistent) {
    if (!this.sessions.has(sessionId) || typeof key !== 'string' || key.length > 512) return;
    const id = noticeId(sessionId, key);
    if (this.notices.has(id)) return id;
    const scene = SCENE_BY_KIND[kind];
    if (!scene) return;
    const title = this.sessions.get(sessionId).title;
    const line = sceneText(this.preferences.characterId, scene);
    this.notices.set(id, {
      id, key, sessionId, kind, title,
      text: line ? fillScene(line, title) : PLACEHOLDER,
      persistent, createdAt: this.now(),
```

</details>

**依据 2 · 源码核查**：[lib/desktop-state.js:110-123](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-state.js#L110-L123)

桌面快照与客户端快照字段不同。

<details>
<summary>查看原文（14行）</summary>

```text
  snapshot() {
    // A late helper should not replay yesterday's completion while pending questions have no expiry.
    for (const [id, notice] of this.notices) if (!notice.persistent && this.now() - notice.createdAt > 15 * 60_000) this.notices.delete(id);
    return {
      type: 'state', active: this.active,
      runningCount: [...this.sessions.values()].filter(session => session.running).length,
      notices: [...this.notices.values()].map(notice => ({ ...notice })),
      preferences: { ...this.preferences },
    };
  }

  clientSnapshot() {
    return { active: this.active, preferences: { ...this.preferences }, navigation: this.navigation ? { ...this.navigation } : null };
  }
```

</details>

**依据 3 · 源码核查**：[desktop/main.cjs:279-283](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/desktop/main.cjs#L279-L283)

桌宠窗口置顶且启用隔离和沙箱。

```text
  });
  window = new BrowserWindow({ ...bounds, title: '偶像 · 桌宠', transparent: true, frame: false, resizable: false, maximizable: false, minimizable: false, alwaysOnTop: true, skipTaskbar: true, show: false, hasShadow: false, backgroundColor: '#00000000', webPreferences: { preload: path.join(__dirname, 'preload.cjs'), contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true, spellcheck: false, devTools: false } });
  window.setAlwaysOnTop(true, 'floating');
  noticeLayer = logic.createNoticeLayer(window);
  window.setIgnoreMouseEvents(true, { forward: true });
```

**依据 4 · 源码核查**：[lib/client.js:17-21](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/client.js#L17-L21)

默认背景使用可追溯的远程图片 URL。

```text
			"body {",
			"  background-color: #eef2fa;",
			"  background-image: var(--yukimi-bg, url('https://patchwiki.biligame.com/images/imascg/4/40/9qylnl62pskrgo7hqfrrqi1pidi5qan.png'));",
			"  background-repeat: no-repeat;",
			"  background-attachment: fixed;",
```

**依据 5 · 作者声明**：[README.md:158-163](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/README.md#L158-L163)

作者区分图片、随包文本与代码许可。

```text
## 版权与来源

- 本仓库**代码**按 [MIT License](LICENSE) 开源，作者 AlyceStocking。
- 《偶像大师 灰姑娘女孩》的角色、官方美术及原始台词等权利归 Bandai Namco Entertainment / Cygames 等相应权利人所有。本项目为非官方同人主题，不代表官方授权或合作。
- 图片来自 [BWiki imascg](https://wiki.biligame.com/imascg) 的在线 URL，仓库不打包官方图片或音频；但**确实包含采集的中文台词文本、译文及素材元数据**，并将台词嵌入[角色注册表](<lib/characters.js>)和[浏览器入口](<lib/client.js>)随插件分发。因此不能声称“不分发任何官方素材”。图片在运行时仍会下载/缓存以显示，远程引用也不等于取得授权。
- 台词译文与 wiki 内容的权利及使用条件归相应权利人/贡献者，**不因存放于此仓库而纳入代码的 MIT 授权**。请遵守来源站点及权利人的条件；本项目不授予对角色、美术、原文或译文的商用许可。
```

#### 缺口

- 缺真实界面的标题显示范围与内容权利逐项依据。
  **影响**：共享屏幕情形需预先约束；不据此判断公开分发条件。
  **进一步探讨**：用非敏感标题验证窗口可见性，并向对应权利来源核对拟用素材。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样试用，何种改动值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可先在隔离 Profile 试 Web，切两位角色并查看浅深色代码块、卡片、阅读模式退出以及弱网退回。关闭插件并刷新，核对样式恢复。如果只是希望换色，停在 Web 阶段即可。Windows 桌面试用应备份旧偏好且只用匿名标题，检查两类等待、取消、回到正确会话和完整关闭。出现持续错跳、标题不宜显示或运行时故障时，停用桌宠并回到 DSH 内置会话界面。

一个未验证的假设是给提醒加入默认泛化标题的共享屏幕选项，同时保留可点回的 sessionId。因为 Host 已把标题和会话身份分字段，显示层可以先验证隐藏标题对回跳的影响。设置两组相同的匿名等待，比较普通与泛化模式中的误点、响应时间和录屏里的标题泄露。若泛化后误点明显上升，或仍能从可见文本读出原题名，就无法支持这个方案。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:365-389](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/client.js#L365-L389)

浏览器有退出沉浸模式的事件与清理入口。

<details>
<summary>查看原文（25行）</summary>

```text
				const onWheel = event => { cancelPress(); if (immersive && event.deltaY < 0) apply(false); };
				const onKey = event => {
					if ((immersive || reading) && event.key === "Escape") { cancelPress(); apply(false); }
					// Fallback hotkey; also proves the view works if a host layer swallows clicks.
					if (!event.repeat && event.altKey && !event.ctrlKey && !event.metaKey && (event.key === "i" || event.key === "I")) { event.preventDefault(); cancelPress(); if (event.shiftKey) toggleReading(); else toggle(); }
				};
				// Choose one stream: Chromium emits compatibility mouse events after pointer
				// events, so listening to both needs fragile timing-based deduplication.
				const pointer = typeof window.PointerEvent === "function";
				const listeners = [
					[window, pointer ? "pointerdown" : "mousedown", onDown, true],
					[window, pointer ? "pointermove" : "mousemove", onMove, true],
					[window, pointer ? "pointerup" : "mouseup", onUp, true],
					[window, "pointercancel", cancelPress, true],
					[window, "blur", cancelPress, true],
					[window, "scroll", cancelPress, true],
					[window, "wheel", onWheel, { passive: true, capture: true }],
					[document, "keydown", onKey, true],
				];
				apply(false, false);
				for (const [target, type, listener, options] of listeners) target.addEventListener(type, listener, options);
				return () => {
					for (const [target, type, listener, options] of listeners) target.removeEventListener(type, listener, options);
					cancelPress();
					apply(false, false);
```

</details>

**依据 2 · 源码核查**：[lib/desktop-state.js:45-56](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/desktop-state.js#L45-L56)

会话身份与标题可独立处理。

<details>
<summary>查看原文（12行）</summary>

```text
  addNotice(sessionId, kind, key, persistent) {
    if (!this.sessions.has(sessionId) || typeof key !== 'string' || key.length > 512) return;
    const id = noticeId(sessionId, key);
    if (this.notices.has(id)) return id;
    const scene = SCENE_BY_KIND[kind];
    if (!scene) return;
    const title = this.sessions.get(sessionId).title;
    const line = sceneText(this.preferences.characterId, scene);
    this.notices.set(id, {
      id, key, sessionId, kind, title,
      text: line ? fillScene(line, title) : PLACEHOLDER,
      persistent, createdAt: this.now(),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:140-160](https://github.com/AlyceStocking/dsh-cgss-idol-theme/blob/5813a4c84e53fd028dfa56d5c462515ec5a6d974/lib/index.js#L140-L160)

回跳与关闭有明确状态和清理入口。

<details>
<summary>查看原文（21行）</summary>

```text
  helper = startHelper({
    onError: report,
    onExit() { state.active = false; helper = null; },
    onMessage(message) {
      if (disposed) return;
      safely(() => {
        if (message.type === 'ready') { state.active = true; publish(); }
        if (message.type === 'preferences') { state.updatePreferences(message.preferences); publish(); }
        if (message.type === 'open-session') state.navigate(message.sessionId);
        if (message.type === 'notice-shown' && validId(message.id)) state.acknowledge(message.id);
      });
    },
  });
  const dispose = () => {
    if (disposed) return;
    disposed = true; state.active = false; clearTimeout(publishTimer);
    for (const stop of stopEvents) stop();
    stopProjection(); liveQuestions.clear(); toolQuestions.clear(); sessions.clear();
    helper?.close(); helper = null;
  };
  ctx.effect(() => dispose);
```

</details>

#### 缺口

- 未实测选项，也未确认共享环境的可用性。
  **影响**：仅能提出验证方案，不能确认可替代现有标题。
  **进一步探讨**：比较两种文本模式下的回跳成功率和可见内容。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
