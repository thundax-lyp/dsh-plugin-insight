# DeepSeek Harness for VS Code

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fa82d5e](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/tree/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98)

<!-- BEGIN META -->
[![GitHub ★ 59](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=59&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code)
<!-- END META -->

> **功能**：VS Code 客户端扩展，内嵌 DSH 网页并桥接工作区、剪贴板和可选 Copilot 模型请求。

> **亮点**：贡献是把完整DSH工作面与编辑器文件/剪贴板及模型入口衔接，支持远程Host与客户端中继；净效率和全平台兼容未测，见 [Q01](#research-q01)至 [Q03](#research-q03)。

> **主要限制**：打开面板会处理配套包/profile，Copilot工具和instructions不原样转交；取消/超时只停等待，DSH任务仍可能运行，使用者需独立核权限和收尾，见 [Q03](#research-q03)至 [Q05](#research-q05)。

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
  - [Q01 · 根扩展真实类型、给谁什么增量？](#detail-section-11)
  - [Q02 · 面板如何从检测启动到认证代理？](#detail-section-12)
  - [Q03 · 自动配套插件、文件和剪贴板有哪些副作用？](#detail-section-13)
  - [Q04 · Copilot转交怎样执行与取消？](#detail-section-14)
  - [Q05 · 安全、兼容和失败恢复需要核什么？](#detail-section-15)
  - [Q06 · 全周期成本支持什么具体用法？](#detail-section-16)
  - [Q07 · 可验证的新方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用DSH并希望在VS Code少切窗口的用户，可内嵌网页和导航工作区；可选Copilot入口实际委托DSH任务，须核执行身份与收尾，见 [Q01](#research-q01)。

编辑器+原生浏览器是直接替代；DSH自己工具/模型能力来自上游，根扩展只是接入客户端和任务委托，不等同内置配套插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 内嵌面板 | 编辑器看DSH完整网页 | 自动配套安装/profile写入，不是纯显示 |
| 文件/剪贴板中继 | 编辑器导航与复制 | 实际本地/客户端副作用，非OS沙箱 |
| 认证代理 | iframe/远程接入 | token留存及转发边界需验证 |
| Copilot模型入口 | 将对话委托DSH执行 | 忽略外来工具/过滤指令，取消仅停等待 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容VS Code与扩展Host | 必需 | 面板/命令与桥接 | 模型API旧版可缺，面板另一路 |
| DSH CLI或桌面内置CLI及可达Web | 必需 | 运行真实任务 | 缺CLI可经用户确认全局安装 |
| 可写DSH_HOME/web profile | 面板准备条件 | 配套包与声明 | 非只读嵌入，失败可能不完整 |
| 可信token/代理/远程转发 | 认证条件 | iframe及API接入 | globalState留存与Host位置需核 |
| DSH自身preset/模型/工具权限 | 委托条件 | 执行Copilot请求 | 不继承全部Copilot工具/指令 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 独立观察 | 专用窗口/DSH_HOME备份profile | 明确自动配套写入 |
| 面板 | 检测/经确认装CLI、启动/认证 | 页面/工作区分别核对 |
| 可选委托 | 核主机/preset/指令后提交 | 记录DSH sid及事件结果 |
| 取消 | 停等待后回DSH | 查仍活任务，不盲重发 |
| 退出 | 关受管进程/代理、另管配套与缓存 | 原浏览器可接回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 扩展/CLI/配套包/代理资源 | 安装、认证、工作区配置 | 实际耗时未测 |
| 持续 | VS Code/DSH双进程、轮询/模型工具 | 指令/映射/执行位置核对 | UI价格非现价，金额未知 |
| 失败恢复 | 不完整包、token、重复输入 | 查DSH仍活任务及映射 | 取消不自动收尾 |
| 退出 | profile/配套/debug存量 | 各层分别清理或保留 | 根停用不等于目标卸载 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 内嵌工作面 | 启动/代理/面板链 | 真机兼容与少切窗收益 |
| 文件/剪贴板 | 工作区stat与真实写剪贴板 | symlink/跨平台全边界 |
| Copilot委托 | DSH create/prompt/轮询 | 指令不丢和任务正确性 |
| 取消反馈 | 明示停止等待/仍运行 | 用户能否避免重复提交 |

> **思考**：打开面板会处理配套包/profile，Copilot工具和instructions不原样转交；取消/超时只停等待，DSH任务仍可能运行，使用者需独立核权限和收尾，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是把完整DSH工作面与编辑器文件/剪贴板及模型入口衔接，支持远程Host与客户端中继；净效率和全平台兼容未测，见 [Q01](#research-q01)至 [Q03](#research-q03)。

CLI净化、真实启动广播与任务等待/执行分离有可借鉴之处；配套升级删除后复制非事务，token/globalState和双侧映射增加恢复责任，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

打开面板会处理配套包/profile，Copilot工具和instructions不原样转交；取消/超时只停等待，DSH任务仍可能运行，使用者需独立核权限和收尾，见 [Q03](#research-q03)至 [Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察。先独立DSH_HOME/测试窗口核面板与自动配套写入，模型委托单独验指令、权限和取消留活。状态不明就回DSH原面板收尾，保留浏览器退路，不直接改日常profile，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

VS Code根客户端与真实启动/配套写入/任务委托链有源码支持；宿主/远程/退出与收益未实测，先观察。显式委托契约为未验证假设。

- 已检查：作者 README、包清单、源码路径 extension.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核根package/extension入口、检测/安装/启动、面板准备、配套包写入、认证代理关键分支、workspace/clipboard、Copilot过滤/会话/取消/结束与停用。未完整审4508行全部代理/事件/parser及各内置插件客户端，未运行目标/测试，不当全平台安全审计。
- 下一步：- 固定源码核查，无目标执行。
- 未装扩展/CLI/配套包、启动DSH或调用模型。
- 根类型client，内置DSH插件是配套，未相互混称。
- UI价类/限额和作者兼容不作现价或真机验收。

**分析版本**

- **仓库**：[Vithrive/Deepseek-Harness-for-VS-Code](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code)
- **版本号**：1.1.1（[固定提交 fa82d5e](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/tree/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是提交前显式展示DSH委托的主机/cwd/preset、丢弃指令与sid/留活状态，比较双编排误判和额外提示负担，见 [Q07](#research-q07)。

- 固定源码核查，无目标执行。
- 未装扩展/CLI/配套包、启动DSH或调用模型。
- 根类型client，内置DSH插件是配套，未相互混称。
- UI价类/限额和作者兼容不作现价或真机验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 429 | — | — | 10582 |
| .js | source | 7 | 5197 | 3744 | 1284 | — |
| .js | test | 16 | 3317 | 2783 | 382 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：忠实内嵌和Copilot转交如何组织DSH任务，哪些自动启动/安装、认证与双编排边界限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根扩展真实类型、给谁什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是VS Code扩展客户端，package.main为extension.js、contributes注册视图/命令和languageModelChatProviders，并非DSH Host apply插件。仓库内另带DSH配套插件，不能把它们与根身份混称。目标用户是已经在DSH工作、想在编辑器内看完整网页并发送工作区上下文的人；原办法是编辑器加独立浏览器，增量是少切窗口、文件导航/剪贴板中继与可选Copilot入口。

面板不是纯只读iframe包装：准备过程可能安装配套插件、写web profile、注册工作区并启动DSH。Copilot入口也不是把DeepSeek原始模型简单换个名字，而是向另一个DSH Agent会话投递任务。合格结果需明确执行在哪里、当前工作区/权限属于谁、取消或超时后谁收尾；不以“忠实呈现”推断没有额外状态和副作用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-35](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/package.json#L1-L35)

VS Code根客户端清单。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "deepseek-harness-vscode",
  "displayName": "DeepSeek Harness for VSCode",
  "description": "DeepSeek Harness (DSH) 的 VS Code 接入：侧边栏/标签页忠实呈现 DSH Web GUI 并自动检测启动，不影响用户对 DSH 本身的页面组织、第三方插件装配等二次开发行为；v0.7.13 起把 DSH 注册为 Copilot 聊天模型——模型选择器里出现 DeepSeek Harness 下属模型条目，接收 Copilot 组织好的现成对话、滤除对话内容无关的 prompt、交给 DSH 二次组织、流式回写，旨在利用 DSH 强大的任务编排与工具调用能力，发挥最大性能；v1.0.1 起自动识别官网 Windows 桌面版，用其内置 dsh CLI 启动（无需 npm/Node）；v1.1.0 起在 Remote-WSL / Remote-SSH 面板里用本机浏览器完成 DeepSeek 账号登录；v1.1.1 起面板内复制按钮经宿主剪贴板中继恢复可用",
  "version": "1.1.1",
  "publisher": "vithrive",
  "license": "MIT",
  "icon": "media/icon.png",
  "repository": {
    "type": "git",
    "url": "https://github.com/Vithrive/Deepseek-Harness-for-VS-Code.git"
  },
  "engines": {
    "vscode": "^1.75.0"
  },
  "categories": [
    "Other"
  ],
  "main": "./extension.js",
  "extensionKind": [
    "workspace"
  ],
  "activationEvents": [
    "onView:dsh.webview",
    "onCommand:dshPanel.resetChatMapping",
    "onCommand:dshPanel.chatStatus",
    "onStartupFinished"
  ],
  "contributes": {
    "languageModelChatProviders": [
      {
        "vendor": "dsh",
        "displayName": "DeepSeek Harness"
      }
    ],
```

</details>

**依据 2 · 源码核查**：[extension.js:2554-2588](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2554-L2588)

面板准备含安装/启动/注册。

<details>
<summary>查看原文（35行）</summary>

```text
async function preparePanelHtml(isTab) {
  // 先确保 dsh 已安装（远程场景即在服务器上检查/安装）。
  const installed = await ensureDshInstalled();
  if (!installed) {
    return {
      ok: false,
      kind: 'not-installed',
      reason: process.platform === 'win32'
        ? '未检测到 DeepSeek Harness（npm 版 dsh 或官网 Windows 桌面版），且已取消安装。请安装后点击“刷新”。'
        : '未检测到 DeepSeek Harness (dsh)，且已取消安装。请手动安装后点击“刷新”。'
    };
  }

  // 自动确保 DSH 侧配套插件 dsh-drop-caret 在位（拖文件/代码段插入对话框）。
  const pluginInstalled = await ensureDshPlugins();
  if (pluginInstalled && (await checkUrl(getUrl()))) {
    // 服务已在运行但插件刚装上，需重启 dsh web 才加载。
    vscode.window.showInformationMessage('已自动安装/更新 DSH 插件（dsh-drop-caret / dsh-webview-clipboard / dsh-vscode-file-links），请点击面板顶部的「重启 dsh web」使其生效。');
  }

  const ok = await ensureRunningOnce();
  if (!ok) {
    return {
      ok: false,
      kind: 'unreachable',
      reason: `无法连接 ${getUrl()}，且自动启动未成功（或已关闭自动启动）。`
    };
  }

  // 服务就绪后，尽力把 VSCode 当前工作区注册进 DSH 工作区列表（不阻塞渲染）。
  registerWorkspace().catch(() => {});
  // 解析最终展示地址：回环目标走受管认证代理（无感通过 dsh web 浏览器认证）；
  // 真远程（Remote-SSH / Dev Containers）再把地址经 asExternalUri 转发到客户端。
  const target = await resolvePanelTarget(isTab);
  if (target.forwardFailed) {
```

</details>

**依据 3 · 源码核查**：[extension.js:4048-4089](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4048-L4089)

Copilot模型provider注册。

<details>
<summary>查看原文（42行）</summary>

```text
      onDidChangeLanguageModelChatInformation: dshModelEmitter.event,
      provideLanguageModelChatInformation(_options, _token) {
        const info = dshModelDefs.map((m) => ({
          id: m.id,
          name: m.name,
          family: 'dsh',
          version: '0.8.9',
          detail: m.detail,
          tooltip: 'DeepSeek Harness：在工作区解析任务、执行工具后解答；模型与推理档位可配置',
          // 上下文/输出上限对齐 DSH 侧实际模型配置（llm-deepseek：contextWindow 1000000、
          // maxTokens 393216）——VS Code 据此决定塞给 DSH 的历史长度，写小了会静默截断。
          maxInputTokens: 1000000,
          maxOutputTokens: 393216,
          // 门控字段（对齐 vizards：isBYOK/isUserSelectable 让模型可被选、可配置）
          isBYOK: true,
          isUserSelectable: true,
          // toolCalling 声明为 true：Agent 模式的模型选择器只列出支持工具的模型。
          // DSH 用自己的工具执行，VS Code 传入的工具（options.tools）一律忽略、不返回工具调用，无冲突。
          capabilities: { toolCalling: true, imageInput: false },
          // 成本信息（对齐 vizards toModelCostInfo 字段，用合法货币串以免核心解析异常）
          priceCategory: 'low',
          ...m.cost,
          // 模型配置 schema：让 VS Code 在模型选择器里显示「推理档位」下拉，
          // 用户选中值经 options.modelConfiguration.reasoningEffort 传回 provider。
          configurationSchema: { properties: { reasoningEffort: dshReasoningEffortSchema } }
        }));
        // 落盘实际返回的 provider info，便于确认 configurationSchema 是否传给 VS Code。
        try {
          const dbgDir = path.join(os.homedir(), '.dsh-debug');
          fs.mkdirSync(dbgDir, { recursive: true });
          fs.writeFileSync(path.join(dbgDir, 'provider-info.json'), JSON.stringify({ ts: Date.now(), models: info }, null, 2), 'utf8');
        } catch (_) { /* 忽略 */ }
        return info;
      },
      provideLanguageModelChatResponse(model, messages, options, progress, token) {
        return handleDshModelRequest(model, messages, options, progress, token);
      },
      provideTokenCount(_model, text, _token) {
        const s = typeof text === 'string' ? text : (text && text.value ? text.value : '');
        return Promise.resolve(Math.max(1, Math.ceil(String(s).length / 3)));
      }
    };
```

</details>

#### 缺口

- 未有编辑器/浏览器对照与真实用户需求反馈。
  **影响**：不能证明少切窗口值得配套状态维护。
  **进一步探讨**：用同工作区任务比较导航错误、切窗和恢复负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 面板如何从检测启动到认证代理？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

ensureDshInstalled优先复用/探测已有CLI，缺少时按autoInstallDsh弹模态确认才执行npm全局安装，取消返回未安装；Windows桌面CLI和npx缓存为其它探测路径。ensureRunning能复用可达服务，否则autoStart调用spawn dsh web，cwd取工作区、默认回环与指定端口。端口可达、完整启动广播与实际页面可加载是不同阶段，不应把连上端口当模型可用。

认证代理捕获启动token，为目标Host换cookie并代理页面/API；remoteMode按代理密钥或已登记客户端authority放行。learnDshToken把token写VS Code globalState，并非SecretStorage接口。它解决iframe同站Cookie限制，却引入长期凭据状态/本地代理和远程转发信任边界；本轮未审全代理与所有浏览器组合，不把注释“不关闭安全机制”当已验证防护。Remote工作区运行的是扩展宿主位置的DSH，不能将远端动作误认在本机。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:330-387](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L330-L387)

检测缺失后用户确认安装。

<details>
<summary>查看原文（58行）</summary>

```text
async function ensureDshInstalled() {
  // 已解析成功过的启动方式直接复用（15 分钟内）：避免每次提问都起子进程探测
  // dsh/npx（并发聊天时重复探测会拖慢扩展宿主、造成后一个聊天卡顿）。
  if (dshInvocation && (Date.now() - dshInvocationAt) < 15 * 60 * 1000) {
    return true;
  }
  const inv = await resolveDshInvocation();
  if (inv) {
    dshInvocation = inv;
    dshInvocationAt = Date.now();
    return true;
  }

  if (!cfg().get('dshPanel.autoInstallDsh', true)) {
    return false;
  }

  const choice = await vscode.window.showWarningMessage(
    '检测到当前环境未安装 DeepSeek Harness (dsh)，是否现在安装？',
    { modal: true },
    '安装'
  );
  if (choice !== '安装') {
    return false;
  }

  const installed = await vscode.window.withProgress({
    location: vscode.ProgressLocation.Notification,
    title: '正在安装 DeepSeek Harness（npm install -g @deepseek-ai/dsh）…',
    cancellable: false
  }, async () => {
    try {
      await installDsh();
      return true;
    } catch (e) {
      // 桌面版用户通常没有 Node/npm：明确给出「装桌面版」这条路，别让用户去翻日志。
      const hint = process.platform === 'win32'
        ? '（也可改用官网 Windows 桌面版，扩展会自动识别它；或在 dshPanel.dshCommand 里直接指定其 CLI 路径）'
        : '';
      vscode.window.showErrorMessage(`DeepSeek Harness 安装失败：${e.message}${hint}`);
      return false;
    }
  });

  if (!installed) {
    return false;
  }
  const after = await resolveDshInvocation();
  if (after) {
    dshInvocation = after;
    dshInvocationAt = Date.now();
    return true;
  }
  return false;
}

/**
 * 工作区目录：优先 VS Code 打开的第一个工作区文件夹，否则退回用户主目录。
```

</details>

**依据 2 · 源码核查**：[extension.js:1269-1321](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L1269-L1321)

真实spawn与cwd/平台shell。

<details>
<summary>查看原文（53行）</summary>

```text
async function startDsh() {
  // 使用 ensureDshInstalled 解析出的启动方式（PATH 上的 dsh / 官网桌面版内置 CLI / npx）。
  // 兜底回退到配置的命令，避免异常时序下拿到空值。
  const inv = dshInvocation || { cmd: getDshCommand(), prefix: [] };
  // host/port 均已净化（getHost 白名单 / getPort 整数），cmd 经 sanitizeCommand
  // 拒绝 shell 元字符——Semgrep detect-child-process 指示的 shell:true 在此数据流
  // 下无注入面（win32 需 shell 命中 dsh.cmd shim，POSIX 不经 shell）。
  // 纵深校验（PR #12 思路）：cmd 来自 getDshCommand()（已净化），此处再拒一次。
  if (typeof inv.cmd !== 'string' || inv.cmd === '' || SHELL_META_PATTERN.test(inv.cmd)) {
    throw new Error('dsh 命令包含 shell 元字符或为空，已拒绝启动');
  }
  const args = [
    ...inv.prefix,
    'web',
    '--host', String(getHost()),
    '--port', String(getPort())
  ];
  // dsh 0.1.2-rc 起的 web 浏览器认证由扩展自动完成（受管认证代理），
  // 默认不再弹系统浏览器；需要保留旧行为时打开 dshPanel.openSystemBrowser。
  // 老版本 dsh 不识别 --no-open：探测支持才传，探测失败按支持处理（仍有回退）。
  if (!cfg().get('dshPanel.openSystemBrowser', false) && (dshNoOpenBroken !== true)) {
    if (await dshWebSupportsNoOpen(inv)) {
      args.push('--no-open');
    }
  }
  // Windows 经 cmd.exe 启动：含空格的 cmd 需区分两种形态——
  //   a) 单个存在的可执行文件（带空格目录，含官网桌面版内置 dsh.cmd）→ 整体加引号；
  //   b) 多 token 命令行前缀（如 "node C:\x\dsh.js"）→ 原样透传由 shell 分词（≤0.8.33 行为）。
  const cmdText = shellCommandText(inv.cmd);
  const child = spawn(cmdText, args, {
    cwd: getWorkspaceDir(),
    shell: process.platform === 'win32',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  managedChild = child;
  attachDshOutputReader(child);

  child.on('error', (err) => {
    if (activeView) {
      activeView.description = '启动失败';
    }
    vscode.window.showErrorMessage(`DeepSeek Harness 启动失败: ${err.message}`);
  });
  child.on('exit', (code) => {
    if (managedChild === child) {
      managedChild = null;
    }
  });

  return child;
}

```

</details>

**依据 3 · 源码核查**：[extension.js:1410-1423](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L1410-L1423)

复用或自动启动。

<details>
<summary>查看原文（14行）</summary>

```text
async function ensureRunning() {
  const url = getUrl();
  const autoStart = cfg().get('dshPanel.autoStart', true);

  if (await checkUrl(url)) {
    return true; // 已有服务，直接复用
  }

  if (!autoStart) {
    return false;
  }

  return startDshAndWaitReady(url);
}
```

</details>

**依据 4 · 源码核查**：[extension.js:750-808](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L750-L808)

代理密钥/authority与cookie交换。

<details>
<summary>查看原文（59行）</summary>

```text
function createAuthProxy(targetUrl, options) {
  return new Promise((resolve, reject) => {
    const target = new URL(targetUrl);
    const targetPort = Number(target.port) || (target.protocol === 'https:' ? 443 : 80);
    const remoteMode = !!(options && options.remote);
    // 扩展自身访问代理的共享密钥（远程模式下无密钥只能靠客户端 authority 白名单）。
    const proxyKey = crypto.randomBytes(24).toString('base64url');
    const clientAuthorities = new Set(); // 已转发给客户端的 authority（远程模式白名单）
    const cookies = new Map(); // authority -> 'name=value'
    const exchanges = new Map(); // authority -> Promise（并发去重）
    let token = null;
    let port = 0;

    /** 扩展自身请求带的密钥头（本地模式同样发送，代理侧本地不校验，无副作用）。 */
    function keyHeaders() {
      return { 'x-dsh-proxy-key': proxyKey };
    }

    /** 远程模式：无密钥请求只放行已登记给客户端的 authority。 */
    function allowsRequest(req) {
      if (!remoteMode) return true;
      if (req.headers && req.headers['x-dsh-proxy-key'] === proxyKey) return true;
      const authority = normAuthority(req.headers && req.headers.host);
      return !!(authority && clientAuthorities.has(authority));
    }

    /** 为指定 authority 换发 Cookie（GET /?token=，Host 指向代理自身 authority）。 */
    function exchangeFor(authority) {
      const key = normAuthority(authority) || String(authority);
      if (!token) return Promise.resolve(null);
      const inFlight = exchanges.get(key);
      if (inFlight) return inFlight;
      const p = new Promise((done) => {
        const req = http.request({
          hostname: target.hostname,
          port: targetPort,
          path: '/?token=' + encodeURIComponent(token),
          method: 'GET',
          headers: { host: key, connection: 'close', accept: '*/*' }
        }, (res) => {
          res.resume();
          let cookieValue = null;
          const setCookies = res.headers['set-cookie'];
          if (res.statusCode === 303 && Array.isArray(setCookies) && setCookies.length > 0) {
            const raw = setCookies[0];
            const eq = raw.indexOf('=');
            const semi = raw.indexOf(';');
            if (eq > 0 && (semi < 0 || semi > eq)) cookieValue = raw.slice(0, semi < 0 ? raw.length : semi).trim();
          }
          if (cookieValue) cookies.set(key, cookieValue);
          done(cookieValue);
        });
        req.on('error', () => done(null));
        req.setTimeout(5000, () => req.destroy(new Error('auth exchange timeout')));
        req.end();
      }).finally(() => exchanges.delete(key));
      exchanges.set(key, p);
      return p;
    }
```

</details>

**依据 5 · 源码核查**：[extension.js:645-661](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L645-L661)

token写globalState。

<details>
<summary>查看原文（17行）</summary>

```text
function learnDshToken(tokenOrUrl) {
  const token = extractTokenParam(tokenOrUrl);
  if (!token) return false;
  dshLaunchToken = token;
  if (dshAuthCapable !== true) {
    setDshAuthCapable(true);
  }
  if (gContext) {
    gContext.globalState.update(AUTH_PROXY_STATE_KEY, {
      target: getUrl(),
      token: token,
      ts: Date.now()
    }).then(() => {}, () => {});
  }
  if (authProxy) authProxy.onToken(token);
  return true;
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动配套插件、文件和剪贴板有哪些副作用？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

preparePanelHtml无须用户逐一确认便调用ensureDshPlugins，确保dsh-drop-caret与web profile声明；可选内置clipboard、file-links、open-external按默认开关写入。已有服务正运行且刚装配套插件时提示重启，不自动把“写成功”当已加载。npm pack回退删除旧目标再复制解压内容，不是事务升级，安装失败可能留下不完整包；本轮不执行这些动作。

文件链接先按工作区路径归属和stat存在判定，再在VS Code定位/打开；看到的是词法路径检查，没有本轮证据支持它构成symlink解析后的OS沙箱。剪贴板中继真实调用vscode.env.clipboard.writeText，允许远程Host影响客户端剪贴板，文本有大小与token约束但不能当只读显示。卸载根客户端不自动清配套DSH包/声明，相关profile和个人配置要分别管理。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:2554-2573](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2554-L2573)

真实准备时调用安装。

<details>
<summary>查看原文（20行）</summary>

```text
async function preparePanelHtml(isTab) {
  // 先确保 dsh 已安装（远程场景即在服务器上检查/安装）。
  const installed = await ensureDshInstalled();
  if (!installed) {
    return {
      ok: false,
      kind: 'not-installed',
      reason: process.platform === 'win32'
        ? '未检测到 DeepSeek Harness（npm 版 dsh 或官网 Windows 桌面版），且已取消安装。请安装后点击“刷新”。'
        : '未检测到 DeepSeek Harness (dsh)，且已取消安装。请手动安装后点击“刷新”。'
    };
  }

  // 自动确保 DSH 侧配套插件 dsh-drop-caret 在位（拖文件/代码段插入对话框）。
  const pluginInstalled = await ensureDshPlugins();
  if (pluginInstalled && (await checkUrl(getUrl()))) {
    // 服务已在运行但插件刚装上，需重启 dsh web 才加载。
    vscode.window.showInformationMessage('已自动安装/更新 DSH 插件（dsh-drop-caret / dsh-webview-clipboard / dsh-vscode-file-links），请点击面板顶部的「重启 dsh web」使其生效。');
  }

```

</details>

**依据 2 · 源码核查**：[extension.js:2275-2325](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2275-L2325)

自动确保声明和可选插件。

<details>
<summary>查看原文（51行）</summary>

```text
async function ensureDshPlugins() {
  const profileDir = dshWebProfileDir();
  try {
    const installed = await installedPluginVersion(profileDir, DSH_PLUGIN_NAME);
    await ensureProfileDeclaration(profileDir, DSH_PLUGIN_NAME, `^${DSH_PLUGIN_MIN}`);
    let changed = false;
    if (installed && compareVersions(installed, DSH_PLUGIN_MIN) >= 0) {
      // dsh-drop-caret 已满足，无需安装
    } else {
      // 未安装或版本过低：先试官方 dsh plugin add，失败回退 npm pack。
      const viaCli = await tryDshPluginAdd(DSH_PLUGIN_NAME);
      if (!viaCli) {
        await installPluginViaNpm(profileDir, DSH_PLUGIN_NAME);
      }
      await ensureProfileDeclaration(profileDir, DSH_PLUGIN_NAME, `^${DSH_PLUGIN_MIN}`);
      changed = true;
    }
    // 内置剪贴板兼容插件（文件随扩展直接写入，不走 npm）。
    // 仅在 macOS 的 VS Code webview 内嵌场景激活（DSH 页面本地判定），
    // Windows/Linux 上为惰性文件；可经 dshPanel.installClipboardPlugin 关闭。
    if (cfg().get('dshPanel.installClipboardPlugin', true)) {
      if (await ensureClipboardPlugin(profileDir)) {
        changed = true;
      }
    }
    // 内置工作区文件链接插件（文件随扩展直接写入，不走 npm）：
    // 让 DSH 对话里的工作区文件/文件夹链接改在 VS Code 资源管理器中定位并打开。
    // 配置为 off（不接管）时不安装/不更新，插件不动 DSH 既有行为。
    if (fileLinkAction() !== 'off') {
      if (await ensureFileLinkPlugin(profileDir)) {
        changed = true;
      }
    }
    // 内置外链/登录链接插件（文件随扩展直接写入，不走 npm）：
    // 面板内 window.open（典型：DeepSeek 账号登录的授权页）改为在客户端系统浏览器打开。
    // 可经 dshPanel.installOpenExternalPlugin 关闭。
    if (cfg().get('dshPanel.installOpenExternalPlugin', true)) {
      if (await ensureOpenExternalPlugin(profileDir)) {
        changed = true;
      }
    }
    return changed;
  } catch (e) {
    console.error(`[DeepSeek Harness] 自动安装 ${DSH_PLUGIN_NAME} 失败：`, e);
    vscode.window.showWarningMessage(`自动安装 DSH 插件 ${DSH_PLUGIN_NAME} 失败：${e.message}`);
    return false;
  }
}

/**
 * 规范化链接里的路径文本：去成对引号与首尾空白、反斜杠统一为 `/`、去掉 `./` 前缀。
```

</details>

**依据 3 · 源码核查**：[extension.js:2014-2044](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2014-L2044)

pack解压/删除旧目录后复制。

<details>
<summary>查看原文（31行）</summary>

```text
async function installPluginViaNpm(profileDir, plugin) {
  // 安全面守卫：plugin 仅允许内置常量（npm pack/tar 的命令拼接不做通用转义）。
  if (plugin !== DSH_PLUGIN_NAME) {
    throw new Error('installPluginViaNpm 仅支持内置插件 ' + DSH_PLUGIN_NAME);
  }
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-plugin-'));
  try {
    const packOut = await new Promise((resolve, reject) => {
      exec(
        `npm pack ${plugin} --pack-destination "${tmp}" --registry ${NPMJS_REGISTRY} --json`,
        { timeout: 180000, windowsHide: true },
        (err, stdout) => (err ? reject(new Error((stdout || '').trim() || err.message)) : resolve(stdout))
      );
    });
    const parsed = JSON.parse(packOut);
    const tarball = parsed && parsed[0] && parsed[0].filename ? parsed[0].filename : null;
    if (!tarball) throw new Error('npm pack 未能解析 tarball 文件名');
    const extractDir = path.join(tmp, 'extract');
    await fs.promises.mkdir(extractDir, { recursive: true });
    await new Promise((resolve, reject) => {
      exec(`tar -xzf "${path.join(tmp, tarball)}" -C "${extractDir}"`, { timeout: 60000, windowsHide: true }, (err) => (err ? reject(err) : resolve()));
    });
    const pkgSrc = path.join(extractDir, 'package');
    const dest = path.join(profileDir, 'node_modules', plugin);
    await fs.promises.rm(dest, { recursive: true, force: true });
    await fs.promises.cp(pkgSrc, dest, { recursive: true });
    return true;
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
```

</details>

**依据 4 · 源码核查**：[extension.js:2390-2409](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2390-L2409)

工作区候选/存在检查。

<details>
<summary>查看原文（20行）</summary>

```text
async function resolveWorkspaceTarget(raw) {
  const folders = (vscode.workspace.workspaceFolders || []).filter((f) => f.uri && f.uri.scheme === 'file');
  if (folders.length === 0) return null;
  const cleaned = normalizeLinkPath(raw);
  if (cleaned === '' || cleaned.length > 4096 || /[\u0000-\u001f\u007f]/.test(cleaned)) return null;
  const variants = [cleaned];
  const withoutLine = cleaned.replace(/[:#]L?\d+(?:-\d+)?$/i, '');
  if (withoutLine !== cleaned && withoutLine !== '') variants.push(withoutLine);
  for (const v of variants) {
    for (const uri of candidateLinkUris(v, folders)) {
      if (!folders.some((f) => isInsideFolder(uri.fsPath, f.uri.fsPath))) continue;
      try {
        const stat = await vscode.workspace.fs.stat(uri);
        return { uri, kind: stat.type === vscode.FileType.Directory ? 'folder' : 'file' };
      } catch {
        // 该候选不存在：试下一个
      }
    }
  }
  return null;
```

</details>

**依据 5 · 源码核查**：[extension.js:2443-2456](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2443-L2456)

真实写剪贴板。

<details>
<summary>查看原文（14行）</summary>

```text
  const value = typeof text === 'string' ? text : '';
  if (safeToken === '' || value.length === 0 || value.length > CLIPBOARD_TEXT_MAX) {
    reply(false);
    return;
  }
  const clipboard = vscode.env && vscode.env.clipboard;
  if (!clipboard || typeof clipboard.writeText !== 'function') {
    reply(false);
    return;
  }
  Promise.resolve(clipboard.writeText(value)).then(
    () => reply(true),
    () => reply(false)
  );
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Copilot转交怎样执行与取消？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

模型provider声明toolCalling:true以进入选择器，但实现说明忽略VS Code传入工具，不向Copilot返回工具调用；工作由DSH自己的工具执行。serialize/stripCopilotContext会移除instructions块与被判无关的系统/上下文文本，再用会话映射决定增量续聊或全量重发。它改变了指令边界，不能承诺Copilot工作区约束原样传给DSH；应核DSH自身preset、cwd和权限。固定UI模型token上限/价类也不证明实际路由支持同限额或最新价格，本轮不评价现价。

实际session.create、可选selectModel、session.prompt(mode queue)后轮询历史事件，先取游标避免丢本轮开始；不同endReason与无正文分别提示。用户取消只停止等待并写pending=false，代码明确任务仍在DSH运行；读历史失败和等待超时也不自动cancel。completed字段只是桥接结束状态，包括非正常endReason已提示的情况，不等于业务验收。避免取消后盲目重发；回DSH查同sid实际状态和工具结果。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:481-519](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L481-L519)

过滤Copilot上下文/指令。

<details>
<summary>查看原文（39行）</summary>

```text
function isJunkUserText(t) {
  if (!t) return true;
  if (/^You are an expert/i.test(t)) return true; // VS Code 系统提示词（含 <instructions><skills><description> 等）
  if (t.indexOf('<instructions>') >= 0 && t.indexOf('<skills>') >= 0) return true;
  if (/^\s*<(environment_info|workspace_info|context|reminderInstructions|user_info|instructions|userMemory|sessionMemory|repoMemory)>/.test(t)) return true;
  return false;
}

/**
 * 从 <userRequest>...</userRequest> 包裹中提取真实提问；未包裹返回 null。
 * @param {string} t
 * @returns {string|null}
 */
function extractUserRequest(t) {
  let m = t.match(/<userRequest>\s*([\s\S]*?)\s*<\/userRequest>/);
  if (m) return m[1].trim();
  // VS Code 也会把真实提问包在 <prompt>…</prompt> 里（前面常跟 instructions/上下文块）
  m = t.match(/<prompt>\s*([\s\S]*?)\s*<\/prompt>/);
  return m ? m[1].trim() : null;
}

/**
 * 剥离 VS Code 注入的 Copilot instructions 前置说明与 <instructions>…</instructions> 块。
 * 这些是「上下文」不是用户提问；DSH 有自己的指令体系，不应作为对话内容回传。
 * @param {string} t
 * @returns {string}
 */
function stripCopilotContext(t) {
  let s = String(t || '');
  // 去掉 <instructions>…</instructions>（含 .copilot/instructions 附件与 AGENTS.md 等引用）
  s = s.replace(/<instructions>[\s\S]*?<\/instructions>/gi, '');
  // 去掉 VS Code 的 instructions 前置说明句（中英文变体兜底）
  s = s.replace(/when generating code, please follow these user provided coding instructions\.?/gi, '');
  s = s.replace(/you can ignore an instruction if it contradicts a system message\.?/gi, '');
  return s.trim();
}

/**
 * 把 VS Code 当前工作区注册到 DSH 的工作区列表。
```

</details>

**依据 2 · 源码核查**：[extension.js:3797-3851](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3797-L3851)

创建/选模型/持久映射/真实prompt。

<details>
<summary>查看原文（55行）</summary>

```text
          const delta = serializeLmMessages((messages || []).slice(idx + 1));
          if (delta.trim()) taskText = delta;
        }
      }
      // 模型/档位切换：与上次选择不一致时重新 selectModel（同一聊天保持同一 DSH 会话）
      if (selectionKey && entry.selection !== selectionKey) {
        await selectModelForSession(base, sid, provider, chatModel, effort);
        entry.selection = selectionKey;
      }
      // 找不到上次提问（消息被编辑等）则用全量（重复但正确）
    } else {
      const createPayload = { cwd: workspacePath };
      const preset = cfg().get('dshPanel.chatAgentPreset', '');
      if (preset) createPayload.agentPreset = preset;
      const created = await dshRpc(base, 'session.create', createPayload, 20000);
      sid = created.sessionId;
      isNewSession = true;
      entry = { dshSessionId: sid, workspacePath, lastUserText: '', selection: '', pending: false, completed: false, lastUsedAt: Date.now() };
      map[chatKey] = entry;
      if (selectionKey) {
        await selectModelForSession(base, sid, provider, chatModel, effort);
        entry.selection = selectionKey;
      }
    }
    entry.lastUserText = currentPrompt;
    entry.lastAttachSig = currentAttachSig;
    entry.pending = true;
    entry.completed = false;
    entry.lastUsedAt = Date.now();
    await gContext.globalState.update(DSH_MODEL_MAP_KEY, map);
    if (!taskText.trim()) taskText = '用户：' + currentPrompt;
    // 先取事件游标（必须在提交任务之前，避免把 turn/start 一并吃掉导致流式判定失效）
    const timeoutMs = Number(cfg().get('dshPanel.chatTimeoutMs', 900000)) || 900000;
    const deadline = Date.now() + timeoutMs;
    let lastSeq = 0;
    let started = false;
    let emitted = false;
    try {
      const pre = await fetchSessionHistory(base, sid);
      const preEvents = (pre && Array.isArray(pre.events)) ? pre.events : [];
      for (const item of preEvents) {
        const e = item && item.event ? item.event : item;
        if (e && typeof e.seq === 'number' && e.seq > lastSeq) lastSeq = e.seq;
      }
    } catch (_) { /* 读不到游标从 0 开始 */ }

    await dshRpc(base, 'session.prompt', {
      requestId: 'vscode-' + Date.now().toString(36) + '-' + crypto.randomBytes(4).toString('hex'),
      sessionId: sid,
      mode: 'queue',
      content: [{ type: 'text', text: taskText }]
    }, 30000);
    progress.report(makeTextPart('⏳ 已提交给 DeepSeek Harness（' + displayModel + (effort ? ' · 档位 ' + effort : '') + '）' + (isNewSession ? '（新会话）' : '（续聊）') + '，正在执行…\n\n'));
    console.log('[DeepSeek Harness] dsh 模型请求已提交，session=' + sid);

```

</details>

**依据 3 · 源码核查**：[extension.js:3852-3894](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3852-L3894)

取消、状态失败、endReason与超时。

<details>
<summary>查看原文（43行）</summary>

```text
    while (Date.now() < deadline) {
      if (token.isCancellationRequested) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⏹ 已停止等待。任务仍在 DSH 中运行，可到 DSH 面板查看。'));
        return;
      }
      let hist;
      try {
        hist = await fetchSessionHistory(base, sid);
      } catch (e) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⚠️ 读取 DSH 任务状态失败：' + e.message + '（任务可能仍在运行，可到 DSH 面板查看）'));
        return;
      }
      const events = (hist && Array.isArray(hist.events)) ? hist.events : [];
      const res = applyDshEvents(events, { lastSeq, started, emitted }, progress);
      lastSeq = res.lastSeq;
      started = res.started;
      emitted = res.emitted;
      if (res.ended) {
        const reason = res.endReason;
        if (reason && reason.kind !== 'completed') {
          const errDesc = reason.error ? (reason.error.code + ': ' + reason.error.message) : reason.kind;
          progress.report(makeTextPart('\n\n> ⚠️ DSH 任务未正常完成（' + errDesc + '）。可到 DSH 面板查看。'));
        } else if (!res.emitted) {
          // 静默空回答是上一版最坑的故障形态（事件通道变了却看不出原因），这里明确提示。
          progress.report(makeTextPart('> ⚠️ DSH 本轮没有产生可回写的正文（可能只执行了工具调用）。可到 DSH 面板查看完整执行过程。'));
        }
        console.log('[DeepSeek Harness] dsh 模型请求完成');
        entry.pending = false;
        entry.completed = true;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        return;
      }
      await sleep(1000);
    }
    entry.pending = false;
    try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
    progress.report(makeTextPart('\n\n> ⏱ 超过等待上限（' + Math.round(timeoutMs / 60000) + ' 分钟）仍未完成。任务仍在 DSH 面板运行。'));
  } catch (e) {
    progress.report(makeTextPart('❌ DSH 模型执行出错：' + (e && e.message ? e.message : String(e))));
```

</details>

**依据 4 · 源码核查**：[extension.js:4048-4075](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4048-L4075)

工具能力声明、忽略外来工具与静态UI参数。

<details>
<summary>查看原文（28行）</summary>

```text
      onDidChangeLanguageModelChatInformation: dshModelEmitter.event,
      provideLanguageModelChatInformation(_options, _token) {
        const info = dshModelDefs.map((m) => ({
          id: m.id,
          name: m.name,
          family: 'dsh',
          version: '0.8.9',
          detail: m.detail,
          tooltip: 'DeepSeek Harness：在工作区解析任务、执行工具后解答；模型与推理档位可配置',
          // 上下文/输出上限对齐 DSH 侧实际模型配置（llm-deepseek：contextWindow 1000000、
          // maxTokens 393216）——VS Code 据此决定塞给 DSH 的历史长度，写小了会静默截断。
          maxInputTokens: 1000000,
          maxOutputTokens: 393216,
          // 门控字段（对齐 vizards：isBYOK/isUserSelectable 让模型可被选、可配置）
          isBYOK: true,
          isUserSelectable: true,
          // toolCalling 声明为 true：Agent 模式的模型选择器只列出支持工具的模型。
          // DSH 用自己的工具执行，VS Code 传入的工具（options.tools）一律忽略、不返回工具调用，无冲突。
          capabilities: { toolCalling: true, imageInput: false },
          // 成本信息（对齐 vizards toModelCostInfo 字段，用合法货币串以免核心解析异常）
          priceCategory: 'low',
          ...m.cost,
          // 模型配置 schema：让 VS Code 在模型选择器里显示「推理档位」下拉，
          // 用户选中值经 options.modelConfiguration.reasoningEffort 传回 provider。
          configurationSchema: { properties: { reasoningEffort: dshReasoningEffortSchema } }
        }));
        // 落盘实际返回的 provider info，便于确认 configurationSchema 是否传给 VS Code。
        try {
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安全、兼容和失败恢复需要核什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

扩展使用本机/远程VS Code Host权限执行启动和文件写入；command拒绝shell元字符，POSIX不经shell、Windows为cmd shim走shell，这降低特定输入注入面，不限制所选可执行文件本身权限。工作区设置、url、dshCommand与extensionKind/workspace决定执行位置，应只在用户信任的工作区/主机启用，本轮未做所有配置或代理攻击审计，不声称安全或已利用漏洞。

VS Code旧版没有languageModelChatProvider API时入口不注册，但面板是另一路；DSH模型命名和事件结构还要匹配实际版本。自动workspace.create失败不阻面板，因此看见页面不证明工作区已对上。停用按killOnDispose只杀本扩展managedChild并关代理，不回收所有已复用DSH服务、会话和配套插件。debugModelMessages可在工作区.dsh-debug写原始消息结构，排障者要考虑敏感上下文与留存。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:80-88](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L80-L88)

命令净化。

```text
function sanitizeCommand(cmd) {
  const s = String(cmd || '').trim();
  if (!s || SHELL_META_PATTERN.test(s)) return null;
  return s;
}

function getDshCommand() {
  // 配置了非法命令（含元字符）时回退 'dsh'，后续探测失败会自然落到桌面版/npx 兜底。
  return sanitizeCommand(cfg().get('dshPanel.dshCommand', 'dsh')) || 'dsh';
```

**依据 2 · 源码核查**：[extension.js:1297-1307](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L1297-L1307)

实际shell平台差异。

<details>
<summary>查看原文（11行）</summary>

```text
  const cmdText = shellCommandText(inv.cmd);
  const child = spawn(cmdText, args, {
    cwd: getWorkspaceDir(),
    shell: process.platform === 'win32',
    windowsHide: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });
  managedChild = child;
  attachDshOutputReader(child);

  child.on('error', (err) => {
```

</details>

**依据 3 · 源码核查**：[extension.js:524-535](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L524-L535)

工作区注册失败不阻面板。

<details>
<summary>查看原文（12行）</summary>

```text
async function registerWorkspace() {
  if (!cfg().get('dshPanel.autoRegisterWorkspace', true)) {
    return false;
  }
  try {
    const base = await apiBase();
    const value = await dshRpc(base, 'workspace.create', { path: getWorkspaceDir() }, 8000);
    return !!value;
  } catch {
    return false;
  }
}
```

</details>

**依据 4 · 源码核查**：[extension.js:4018-4025](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4018-L4025)

API/开关条件。

```text
function registerDshModelProvider(context) {
  if (!vscode.lm || typeof vscode.lm.registerLanguageModelChatProvider !== 'function') {
    console.warn('[DeepSeek Harness] vscode.lm 不可用，跳过 dsh 语言模型提供方注册');
    return;
  }
  if (!cfg().get('dshPanel.enableDshModel', true)) return;
  try {
    // 关键（借鉴 vizards.deepseek-v4-for-copilot）：提供 onDidChangeLanguageModelChatInformation
```

**依据 5 · 源码核查**：[extension.js:3636-3652](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3636-L3652)

可选原始消息debug落盘。

<details>
<summary>查看原文（17行）</summary>

```text
    // 调试捕获：把 VS Code 交给模型的消息结构原样落盘（排查序列化问题用）
    if (cfg().get('dshPanel.debugModelMessages', false)) {
      try {
        const debugDir = path.join(getWorkspaceDir(), '.dsh-debug');
        fs.mkdirSync(debugDir, { recursive: true });
        const dump = {
          ts: Date.now(),
          model: {
            id: model && model.id,
            vendor: model && model.vendor,
            family: model && model.family,
            version: model && model.version,
            name: model && model.name,
            modelKeys: model ? Object.keys(model) : []
          },
          options: {
            allKeys: options ? Object.keys(options) : [],
```

</details>

**依据 6 · 源码核查**：[extension.js:4431-4446](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4431-L4446)

停用只处理managedChild和代理。

<details>
<summary>查看原文（16行）</summary>

```text
function deactivate() {
  // 扩展停用时，按配置决定是否结束由本扩展启动的 dsh 进程。
  const killOnDispose = cfg().get('dshPanel.killOnDispose', true);
  if (killOnDispose && managedChild) {
    killTree(managedChild);
    managedChild = null;
  }
  // 关闭受管认证代理（令牌已缓存进 globalState，下次启动可无感复用）。
  if (authProxy) {
    const p = authProxy;
    authProxy = null;
    p.close().catch(() => {});
  }
}

module.exports = { activate, deactivate };
```

</details>

#### 缺口

- 未实际验证VS Code/DSH版本、远程转发和退出残留。
  **影响**：不能推全部平台/鉴权/指令传递都兼容。
  **进一步探讨**：分本地与远程测试检测、token换发、工作区、取消留活和停用范围。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本支持什么具体用法？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前建议观察。先在专用VS Code测试窗口与独立DSH_HOME的web profile评估面板，保留原浏览器退路，明确配套安装会发生；不要直接让日常profile承受自动包/声明修改。关闭可选模型provider后只核已存在任务的展示/文件导航，再独立验证Copilot→DSH交接、指令和取消留活，不能因模型选项出现就投入生产。DSH_HOME代码有入口但需要扩展宿主环境正确继承，不在本轮擅自设置或运行。

首次有VSIX/Marketplace、CLI或经确认全局安装、配套包、认证与工作区设置；持续有VS Code+DSH进程、代理/轮询、双侧历史存储和实际模型/工具费用。无强依赖不等于零成本，UI价类不是报价。失败恢复需查未完成安装、auth token、映射重复输入、DSH仍活任务；退出要分别关闭受管进程/代理、撤映射/token、处理配套包与debug文件。当前无宿主/费用效果证据，先观察而非已验证安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:1950-1956](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L1950-L1956)

独立DSH_HOME与固定web profile位置。

```text
function dshHomeDir() {
  return process.env.DSH_HOME || path.join(os.homedir(), '.dsh');
}

function dshWebProfileDir() {
  return path.join(dshHomeDir(), 'profiles', 'web');
}
```

**依据 2 · 源码核查**：[extension.js:2554-2588](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L2554-L2588)

首次自动处理多层状态。

<details>
<summary>查看原文（35行）</summary>

```text
async function preparePanelHtml(isTab) {
  // 先确保 dsh 已安装（远程场景即在服务器上检查/安装）。
  const installed = await ensureDshInstalled();
  if (!installed) {
    return {
      ok: false,
      kind: 'not-installed',
      reason: process.platform === 'win32'
        ? '未检测到 DeepSeek Harness（npm 版 dsh 或官网 Windows 桌面版），且已取消安装。请安装后点击“刷新”。'
        : '未检测到 DeepSeek Harness (dsh)，且已取消安装。请手动安装后点击“刷新”。'
    };
  }

  // 自动确保 DSH 侧配套插件 dsh-drop-caret 在位（拖文件/代码段插入对话框）。
  const pluginInstalled = await ensureDshPlugins();
  if (pluginInstalled && (await checkUrl(getUrl()))) {
    // 服务已在运行但插件刚装上，需重启 dsh web 才加载。
    vscode.window.showInformationMessage('已自动安装/更新 DSH 插件（dsh-drop-caret / dsh-webview-clipboard / dsh-vscode-file-links），请点击面板顶部的「重启 dsh web」使其生效。');
  }

  const ok = await ensureRunningOnce();
  if (!ok) {
    return {
      ok: false,
      kind: 'unreachable',
      reason: `无法连接 ${getUrl()}，且自动启动未成功（或已关闭自动启动）。`
    };
  }

  // 服务就绪后，尽力把 VSCode 当前工作区注册进 DSH 工作区列表（不阻塞渲染）。
  registerWorkspace().catch(() => {});
  // 解析最终展示地址：回环目标走受管认证代理（无感通过 dsh web 浏览器认证）；
  // 真远程（Remote-SSH / Dev Containers）再把地址经 asExternalUri 转发到客户端。
  const target = await resolvePanelTarget(isTab);
  if (target.forwardFailed) {
```

</details>

**依据 3 · 源码核查**：[extension.js:3852-3894](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3852-L3894)

取消/超时后续责任。

<details>
<summary>查看原文（43行）</summary>

```text
    while (Date.now() < deadline) {
      if (token.isCancellationRequested) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⏹ 已停止等待。任务仍在 DSH 中运行，可到 DSH 面板查看。'));
        return;
      }
      let hist;
      try {
        hist = await fetchSessionHistory(base, sid);
      } catch (e) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⚠️ 读取 DSH 任务状态失败：' + e.message + '（任务可能仍在运行，可到 DSH 面板查看）'));
        return;
      }
      const events = (hist && Array.isArray(hist.events)) ? hist.events : [];
      const res = applyDshEvents(events, { lastSeq, started, emitted }, progress);
      lastSeq = res.lastSeq;
      started = res.started;
      emitted = res.emitted;
      if (res.ended) {
        const reason = res.endReason;
        if (reason && reason.kind !== 'completed') {
          const errDesc = reason.error ? (reason.error.code + ': ' + reason.error.message) : reason.kind;
          progress.report(makeTextPart('\n\n> ⚠️ DSH 任务未正常完成（' + errDesc + '）。可到 DSH 面板查看。'));
        } else if (!res.emitted) {
          // 静默空回答是上一版最坑的故障形态（事件通道变了却看不出原因），这里明确提示。
          progress.report(makeTextPart('> ⚠️ DSH 本轮没有产生可回写的正文（可能只执行了工具调用）。可到 DSH 面板查看完整执行过程。'));
        }
        console.log('[DeepSeek Harness] dsh 模型请求完成');
        entry.pending = false;
        entry.completed = true;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        return;
      }
      await sleep(1000);
    }
    entry.pending = false;
    try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
    progress.report(makeTextPart('\n\n> ⏱ 超过等待上限（' + Math.round(timeoutMs / 60000) + ' 分钟）仍未完成。任务仍在 DSH 面板运行。'));
  } catch (e) {
    progress.report(makeTextPart('❌ DSH 模型执行出错：' + (e && e.message ? e.message : String(e))));
```

</details>

**依据 4 · 源码核查**：[extension.js:4431-4446](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4431-L4446)

退出边界。

<details>
<summary>查看原文（16行）</summary>

```text
function deactivate() {
  // 扩展停用时，按配置决定是否结束由本扩展启动的 dsh 进程。
  const killOnDispose = cfg().get('dshPanel.killOnDispose', true);
  if (killOnDispose && managedChild) {
    killTree(managedChild);
    managedChild = null;
  }
  // 关闭受管认证代理（令牌已缓存进 globalState，下次启动可无感复用）。
  if (authProxy) {
    const p = authProxy;
    authProxy = null;
    p.close().catch(() => {});
  }
}

module.exports = { activate, deactivate };
```

</details>

#### 缺口

- 完整接入/恢复总时间、模型费用与任务正确性未测。
  **影响**：不支持直接日常采用或收益承诺。
  **进一步探讨**：先以独立环境测安装/退出，再对同任务比较原浏览器和双编排的错误与总成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可验证的新方向是什么？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把Copilot转交改为显式“DSH任务委托”契约，展示执行主机/cwd/preset、哪些指令被删、DSH sid和取消后仍活状态，而不是依静态toolCalling字段让人以为仍在Copilot工具上下文。现有已经提示取消仍运行，候选增量是把该边界提前到提交前并持续显示，不重复造一套取消机制。

最小对照用不同工作区/主机、带instructions、安全约束、已有映射重问和取消/超时任务，比较执行位置/权限误判、重复提交、丢约束与额外操作。代价是跨客户端状态UI、明确信息摘要及模型接口适配；若用户理解无提升或提示负担过重则否定。没有实现、用户或市场验证。

#### 证据与依据

**依据 1 · 源码核查**：[extension.js:508-519](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L508-L519)

现有过滤。

<details>
<summary>查看原文（12行）</summary>

```text
function stripCopilotContext(t) {
  let s = String(t || '');
  // 去掉 <instructions>…</instructions>（含 .copilot/instructions 附件与 AGENTS.md 等引用）
  s = s.replace(/<instructions>[\s\S]*?<\/instructions>/gi, '');
  // 去掉 VS Code 的 instructions 前置说明句（中英文变体兜底）
  s = s.replace(/when generating code, please follow these user provided coding instructions\.?/gi, '');
  s = s.replace(/you can ignore an instruction if it contradicts a system message\.?/gi, '');
  return s.trim();
}

/**
 * 把 VS Code 当前工作区注册到 DSH 的工作区列表。
```

</details>

**依据 2 · 源码核查**：[extension.js:3797-3827](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3797-L3827)

委托会话身份和参数。

<details>
<summary>查看原文（31行）</summary>

```text
          const delta = serializeLmMessages((messages || []).slice(idx + 1));
          if (delta.trim()) taskText = delta;
        }
      }
      // 模型/档位切换：与上次选择不一致时重新 selectModel（同一聊天保持同一 DSH 会话）
      if (selectionKey && entry.selection !== selectionKey) {
        await selectModelForSession(base, sid, provider, chatModel, effort);
        entry.selection = selectionKey;
      }
      // 找不到上次提问（消息被编辑等）则用全量（重复但正确）
    } else {
      const createPayload = { cwd: workspacePath };
      const preset = cfg().get('dshPanel.chatAgentPreset', '');
      if (preset) createPayload.agentPreset = preset;
      const created = await dshRpc(base, 'session.create', createPayload, 20000);
      sid = created.sessionId;
      isNewSession = true;
      entry = { dshSessionId: sid, workspacePath, lastUserText: '', selection: '', pending: false, completed: false, lastUsedAt: Date.now() };
      map[chatKey] = entry;
      if (selectionKey) {
        await selectModelForSession(base, sid, provider, chatModel, effort);
        entry.selection = selectionKey;
      }
    }
    entry.lastUserText = currentPrompt;
    entry.lastAttachSig = currentAttachSig;
    entry.pending = true;
    entry.completed = false;
    entry.lastUsedAt = Date.now();
    await gContext.globalState.update(DSH_MODEL_MAP_KEY, map);
    if (!taskText.trim()) taskText = '用户：' + currentPrompt;
```

</details>

**依据 3 · 源码核查**：[extension.js:3852-3868](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L3852-L3868)

现有取消/失败提示。

<details>
<summary>查看原文（17行）</summary>

```text
    while (Date.now() < deadline) {
      if (token.isCancellationRequested) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⏹ 已停止等待。任务仍在 DSH 中运行，可到 DSH 面板查看。'));
        return;
      }
      let hist;
      try {
        hist = await fetchSessionHistory(base, sid);
      } catch (e) {
        entry.pending = false;
        try { await gContext.globalState.update(DSH_MODEL_MAP_KEY, map); } catch (_) {}
        progress.report(makeTextPart('\n\n> ⚠️ 读取 DSH 任务状态失败：' + e.message + '（任务可能仍在运行，可到 DSH 面板查看）'));
        return;
      }
      const events = (hist && Array.isArray(hist.events)) ? hist.events : [];
```

</details>

**依据 4 · 源码核查**：[extension.js:4060-4070](https://github.com/Vithrive/Deepseek-Harness-for-VS-Code/blob/fa82d5e158ab0a81426e870e6f42b2b1e65d6a98/extension.js#L4060-L4070)

toolCalling与DSH自有工具的差异。

<details>
<summary>查看原文（11行）</summary>

```text
          maxOutputTokens: 393216,
          // 门控字段（对齐 vizards：isBYOK/isUserSelectable 让模型可被选、可配置）
          isBYOK: true,
          isUserSelectable: true,
          // toolCalling 声明为 true：Agent 模式的模型选择器只列出支持工具的模型。
          // DSH 用自己的工具执行，VS Code 传入的工具（options.tools）一律忽略、不返回工具调用，无冲突。
          capabilities: { toolCalling: true, imageInput: false },
          // 成本信息（对齐 vizards toModelCostInfo 字段，用合法货币串以免核心解析异常）
          priceCategory: 'low',
          ...m.cost,
          // 模型配置 schema：让 VS Code 在模型选择器里显示「推理档位」下拉，
```

</details>

#### 缺口

- 未验证提交前契约能否降低双编排误判。
  **影响**：不能认为应另建产品。
  **进一步探讨**：用上述对照测误判和操作负担。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
