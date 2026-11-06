# DSH to Figma

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[3bd7813](https://github.com/Duoasa/DSH-to-Figma/tree/3bd7813850885a87c678e1f6b0d905b7aeac22d1)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Duoasa/DSH-to-Figma)
<!-- END META -->

> **功能**：将本地Figma companion或官方MCP接入DSH，读取设计上下文并编辑原生画布与资源。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)本地可写原生画布、上下文/截图/资源与Work绑定、三后端分离和串行失败门禁，产物可继续编辑而非只给图。

> **主要限制**：[Q03](#research-q03)任意脚本开始后可部分变更、取消不撤执行，读取解除uncertain不等视觉验收；配对副本含token/同信任域，文档对不等页面对。[Q04](#research-q04)设计质量/平台条件与总成本仍需真实验收。

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
  - [Q01 · 原生Figma桥为谁交付什么，与官方MCP何异？](#detail-section-11)
  - [Q02 · Work怎样绑定正确文件，脚本如何真正写画布？](#detail-section-12)
  - [Q03 · 配对和预检保护什么，失败为何需先看画布？](#detail-section-13)
  - [Q04 · 采用需要哪些实际安装、验收与退出工作？](#detail-section-14)
  - [Q05 · 怎样把脚本完成提升为可交接的设计变更？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-to-figma0.4.0是原生DSH工具/Skill插件，另含CLI与Figma companion。目标是让Agent读取设计上下文并在目标文件产出设计师可继续编辑的原生图层/组件/布局，而非只给静态截图/建议。成功须目标文件与页面正确、结构/变量和视觉符合需求，截图可核且设计师接手成本合理，不是脚本返回节点ID。

手动Figma、官方设计读取/云MCP与静态图复刻；Figma编辑/渲染、模型生成与MCP为已有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| local脚本 | 原生可编辑图层/布局 | companion/Figma权限，非事务 |
| 官方MCP | 按实际目录读取/云服务 | desktop/remote能力不同 |
| 文档绑定 | Work锁目标文件 | 页面仍需明确，非多租户 |
| 队列/uncertain | 避免未知时继续写 | 读取解除不是验收/重连需人工查 |
| 截图/资产 | 视觉对照和工作区资源 | 路径/预算有界，质量仍人验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22/DSH工具Skill服务/模型 | 必需 | 原生注册与生成 | 不是Figma自身能力替代 |
| 运行目标文件的Figma companion | local必需 | 真画布脚本/结果 | 另导manifest/保持窗口，两端升级 |
| 官方MCP/账号OAuth | desktop/remote按需 | 官方实际工具 | 不能假设本地写/云生成都支持 |
| 私有token/paired文件与可信本机 | local必需 | Bearer配对 | ZIP/code含凭据，不分享 |
| 明确file/page与可丢弃副本 | 本文前提 | 防错目标/失败恢复 | inspect读取不是验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选local/official及可丢弃设计副本 | 不混后端能力/费用 |
| 配对 | setup导manifest运行companion | status版本/目标明确，不分享token |
| 选目标 | 多文档显式选、读page/node | 单文件自动选不等page自动正确 |
| 小变更 | 原生节点→结构/变量/截图对账 | 返回ID/commitUndo非视觉验收 |
| 故障退出 | safeToRetry/画布核查、原生撤销/副本 | 不重放已发创建，停桥不回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Figma/模型/机器金额未知 | 双端/配对/目标和权限 | local额度主张非总成本零 |
| 持续 | token/平台/资产磁盘未知 | 结构视觉、字体变量与版本核验 | 设计师净返工未测 |
| 故障 | 部分节点/资源留存未知 | inspect后人工/原生撤销 | 非事务回滚/持久operation |
| 退出 | 设计/凭据/ZIP留存未知 | 停桥关companion/撤密钥清归属 | 已改画布/本机资产不自动清 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生初稿 | 沙箱真正执行Figma API | 设计质量/可接手性 |
| 目标绑定 | Work/workspace/文件断开拒绝 | 人选对page/完整权限隔离 |
| 失败 | 未发/已发/entered区分及uncertain | 真实中断/重复与撤销成本 |
| 资源/截图 | canonical/预算与结果图像 | 全facade/平台兼容/视觉验收 |

> **思考**：[Q03](#research-q03)任意脚本开始后可部分变更、取消不撤执行，读取解除uncertain不等视觉验收；配对副本含token/同信任域，文档对不等页面对。[Q04](#research-q04)设计质量/平台条件与总成本仍需真实验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)本地可写原生画布、上下文/截图/资源与Work绑定、三后端分离和串行失败门禁，产物可继续编辑而非只给图。

配对token私有化、Work/文件绑定不默重绑、串行active/unknown与scriptEntered前后错误区分可借鉴；inspect不是QA，commitUndo不是全事务，文档/页面目标须分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)任意脚本开始后可部分变更、取消不撤执行，读取解除uncertain不等视觉验收；配对副本含token/同信任域，文档对不等页面对。[Q04](#research-q04)设计质量/平台条件与总成本仍需真实验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

可丢弃Figma文件受限试用，先明确后端/file/page与能力，再做少量原生节点并核结构变量/截图。已发操作中断先读画布不重放，私有companion/ZIP不分享；敏感/目标不明退手工或官方读取。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持原生本地画布执行/官方读取分离与可靠性边界，可丢弃设计文件受限试用；未接Figma/Host/账号或做视觉质量验收。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、companion/code.js、companion/ui.html、index.mjs、lib/assets.mjs、lib/bridge.mjs、lib/companion.mjs、lib/official.mjs、lib/script-preflight.mjs、lib/storage.mjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核入口/Skill/官方目录、local选择/脚本/资源、bridge全150行、token存储、companion生成/manifest/UI polling片段与真实runtime脚本/error/busy、资产读写；未全审所有facade/motion/query/specs/OAuth/CLI/云功能和内嵌UI资产。
- 下一步：只读固定源码，不执行目标/脚本/Host/Figma/账号/MCP或视觉测试；一般冒烟为scope_boundary，端到端设计/恢复/成本是明确缺口。

**分析版本**

- **仓库**：[Duoasa/DSH-to-Figma](https://github.com/Duoasa/DSH-to-Figma)
- **版本号**：0.4.0（[固定提交 3bd7813](https://github.com/Duoasa/DSH-to-Figma/tree/3bd7813850885a87c678e1f6b0d905b7aeac22d1)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的目标/节点变量变更与视觉结构验收回执，用故障对照测错目标/重复和设计师返工，不把inspect当验收。

只读固定源码，不执行目标/脚本/Host/Figma/账号/MCP或视觉测试；一般冒烟为scope_boundary，端到端设计/恢复/成本是明确缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 37 | 2541 | — | — | 48203 |
| .mjs | source | 22 | 1487 | 1432 | 37 | — |
| .js | source | 5 | 1333 | 1300 | 34 | — |
| .mjs | test | 20 | 1898 | 1820 | 37 | — |
| .js | test | 5 | 168 | 166 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Duoasa/DSH-to-Figma/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核三后端、目标绑定与真实画布执行/失败恢复，判断设计交付条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生Figma桥为谁交付什么，与官方MCP何异？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-to-figma0.4.0是原生DSH工具/Skill插件，另含CLI与Figma companion。目标是让Agent读取设计上下文并在目标文件产出设计师可继续编辑的原生图层/组件/布局，而非只给静态截图/建议。成功须目标文件与页面正确、结构/变量和视觉符合需求，截图可核且设计师接手成本合理，不是脚本返回节点ID。

local默认由配对companion执行Figma Plugin API；desktop/remote接官方MCP并动态注册其真实工具，不强行假设两者具有同样画布写/云生成能力。相对官方桌面设计读取或手动复刻，本地模式增加任意原生画布脚本、资源与查询/截图接线，免官方MCP额度是作者主张不等零Figma/模型/人工成本。渲染、编辑权限、原生节点/动画和云生成来自Figma，Agent生成/判断来自模型，本组件做工作区/文档绑定与桥接。

README有复杂界面示例且承认最后少量间距未确认，不能当普遍设计质量或完整独立验证。API/编辑器能力仍按实际探测，不把manifest启私有API当所有账号都有功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:22-39](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/README.zh-CN.md#L22-L39)

作者本地模式和新增能力。

<details>
<summary>查看原文（18行）</summary>

```text
</div>

**本地模式不消耗官方 Figma MCP 调用额度。** DSH 会自动生成本机已配对的 Figma 插件，首次导入一次，之后运行即可连接。

## 0.4.0 新功能（发布准备中）

| 新功能 | 你可以做什么 |
| --- | --- |
| 原生动效 | 创建和调整关键帧、文字入场与动画样式，继续在 Figma 时间线中编辑 |
| 本地设计规范 | 导入 Markdown，让 DSH 读取、修改并导出规范副本 |
| 默认规范 | 选择一份设为默认，后续设计自动读取；重启后保留，直到切换或清除 |
| 能力检测 | 操作前确认当前编辑器支持什么，明确提示不可用的功能 |
| 内置使用指南 | 直接问 DSH 如何连接、使用或排错，自动查阅对应章节 |
| 界面与兼容性 | 更新插件图标和规范面板，延续宽松的宿主兼容范围，不锁定单个 RC |

动效以当前编辑器开放的 API 为准。本地 Markdown 不等于云端 Specs，修改副本不会自动覆盖原文件；默认规范保证读取当前版本，设计效果仍需检查。

**升级要点：** 同步更新 DSH 包与 Figma 配套插件，运行 `figma_setup` 后关闭并重新打开 Local 插件。0.4.0 尚未发布，下面的安装说明仍使用当前正式版。
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:125-131](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/README.zh-CN.md#L125-L131)

作者示例仍有未确认修正。

```text
<summary>查看 DSH 中的参考图、指令与返回结果</summary>

![DSH 中使用 GPT-6-Astra Max 复刻复杂界面的对话](assets/examples/advanced-model-ui-conversation.png)

</details>

本案例展示了更强模型在复杂界面任务中的应用效果。最终校对时曾断开 Figma 连接，少量文字间距修正尚未确认，仍可继续在画布中细化。
```

**依据 3 · 源码核查**：[package.json:1-40](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/package.json#L1-L40)

原生入口/CLI/companion/Skill/许可。

<details>
<summary>查看原文（40行）</summary>

```text
{
  "name": "dsh-to-figma",
  "version": "0.4.0",
  "description": "DSH to Figma — native canvas editing, design context, assets and screenshots for DeepSeek Harness.",
  "type": "module",
  "license": "MIT",
  "engines": {
    "node": ">=22",
    "dsh": "*"
  },
  "main": "index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "bin": {
    "dsh-figma": "cli.mjs"
  },
  "files": [
    "index.mjs",
    "cli.mjs",
    "lib",
    "companion",
    "skills",
    "assets",
    "locale",
    "cordis.patch.yml",
    "README.md",
    "CAPABILITIES.md",
    "CHANGELOG.md",
    "LICENSE",
    "codex-tool-baseline.json",
    "README.zh-CN.md",
    "README.en.md",
    "README.ja.md",
    "docs"
  ],
  "scripts": {
    "test": "node --test test/*.test.mjs",
```

</details>

**依据 4 · 源码核查**：[index.mjs:37-45](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L37-L45)

实际注册可调用Skill provider。

```text
async function registerSkill(ctx){
  const path=join(skillDir,'SKILL.md'),raw=await readFile(path,'utf8'),front=/^---\n([\s\S]*?)\n---\n/.exec(raw)
  if(!front)throw new Error('Figma skill metadata missing')
  const description=/^description: (.+)$/m.exec(front[1])?.[1]
  const summary={name:'figma-workbench',description,path,source:'bundled',provider:'dsh-figma',rank:BUNDLED_SKILL_RANK,invocation:{modelInvocable:true,userInvocable:true},resourceBase:{kind:'directory',path:skillDir},locator:path}
  ctx.skills.registerProvider(()=>({name:'dsh-figma',list:async()=>[summary],get:async({rank:_rank,locator:_locator,...metadata})=>({...metadata,content:raw.slice(front[0].length).trim()})}))
}
export async function applyWithDependencies(ctx,config={},deps={}){
  const backend=config.backend??'local',home=deps.home??resolveDshHome(),timeoutMs=config.toolCallTimeoutMs??120000
```

**依据 5 · 源码核查**：[index.mjs:195-227](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L195-L227)

官方目录发现/真实工具动态注册与失败。

<details>
<summary>查看原文（33行）</summary>

```text
  }
  const refresh=()=>{
    if(refreshing)return refreshing
    refreshing=exclusive(async()=>{
      assertOpen();if(backend==='local')return {available,tools:toolNames,errorCode}
      let discovery
      try{
        discovery=await connect({backend,home,desktopServerUrl:config.desktopServerUrl,clientId:config.oauthClientId,signal:shutdown.signal})
        const listed=await discovery.client.listTools(undefined,{timeout:15000,cacheMode:'refresh'})
        if(!Array.isArray(listed.tools)||listed.tools.length>300||new Set(listed.tools.map(t=>t.name)).size!==listed.tools.length)throw new Error('Invalid tool catalog')
        const instructions=discovery.client.getInstructions?.()??''
        if(Buffer.byteLength(instructions)>65536)throw new Error('Instructions too large')
        assertOpen();await Promise.all([...sessions.keys()].map(closeSession));assertOpen()
        for(const dispose of dynamic.splice(0))dispose()
        available=false;toolNames=[];remoteInstructions=''
        for(const tool of listed.tools){
          if(typeof tool.name!=='string'||!tool.name||tool.name.length>200)throw new Error('Invalid tool name')
          register(tool.name,tool.description??'',tool.inputSchema,(args,exec)=>exclusive(async()=>{
            const context=await execution(exec),connection=await connectionFor(context)
            const secured={...args}
            if(tool.name==='get_screenshot'&&tool.inputSchema?.properties?.enableBase64Response)secured.enableBase64Response=true
            try{return await connection.client.callTool({name:tool.name,arguments:secured},{signal:context.signal,timeout:timeoutMs,toolDefinition:tool})}
            catch(error){await closeSession(context.session.id);throw new Error('Official Figma call failed or was interrupted. The operation was not replayed. Inspect the canvas before retrying; check login, access and service status.')}
          }),{outputSchema:tool.outputSchema,taskRequired:tool.execution?.taskSupport==='required'})
        }
        toolNames=listed.tools.map(t=>t.name);remoteInstructions=instructions;available=true;errorCode=null;diagnostic=null
      }catch(error){diagnostic=figmaDiagnostic(error);errorCode=diagnostic.code;if(!available){for(const dispose of dynamic.splice(0))dispose();toolNames=[]}ctx.logger.warn(diagnostic.message)}
      finally{await discovery?.close()}
      return {available,tools:toolNames,errorCode,diagnostic}
    }).finally(()=>{refreshing=null});return refreshing
  }
  register('figma_reconnect','Refresh the official MCP tool catalog after login or enabling Figma desktop MCP. No canvas tools are called.',objectSchema(),async()=>result(await refresh()),{qualified:false})
  if(backend!=='local'){
```

</details>

#### 缺口

- 真实设计任务质量/设计师返工、Figma账号能力与当前MCP额度未独立核。
  **影响**：不把截图示例/无额度消费当生产效益或免费保证。
  **进一步探讨**：对同一需求比较手动/官方读取与本地原生编辑，记录结构/视觉/可接手性和全部成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Work怎样绑定正确文件，脚本如何真正写画布？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

原生工具通过createMcpToolDefinition注册，标记非并发安全；execution要求活跃Agent/绝对workspace并realpath，信号合并工具/Agent销毁/插件关闭。local建立桥后生成已配对companion，文档绑定存session.id+canonical workspace。首次只有一个文档可自动绑定，多文档必须显式select；已选断开或workspace变化拒绝，不按同名提示自动重绑。它隔离操作目标选择，非Figma账号/文件安全租户。

use_figma先Acorn预检代码，Host只解析不eval，再按local tool mutation/inspect属性走bridge.call。companion UI长轮询/poll取操作，postMessage给主插件，主线程busy串行runtime.run后/result回桥。真正execute用new Function包async代码，在Figma沙箱传facade与dsh helpers执行，成功commitUndo；不是在DSH主机执行页面脚本。执行前会切到文件第一个page，脚本若需要另一页应显式指定/读取，不能把文档选对当页面选对。

资源上传先canonical workspace内校验、no-follow读和批量12MiB预算/格式检查，下载在workspace独立.fig​ma/assets目录生成文件（代码目录名为.figma）；它保护本机资产路径但不证明设计对象内容安全/无秘密。官方desktop URL强制字面loopback /mcp，remote用OAuth/服务，错误关闭连接不自动重放。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:48-80](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L48-L80)

真实bindings、工具非并发、active Work/realpath/signals。

<details>
<summary>查看原文（33行）</summary>

```text
  const disposers=[],dynamic=[],sessions=new Map(),bindings=new Map(),agents=new WeakMap(),dead=new WeakSet(),shutdown=new AbortController(),performanceLogs=new Map()
  const figmaTasks=new LocalFigmaTasks(),localSpecs=new LocalSpecs(home),defaultSpec=new DefaultSpecPolicy(localSpecs)
  const bindDocument=(session,workspace,doc)=>{
    const binding={id:doc.connectionId,workspace,name:doc.name,editorType:doc.editorType,fileKey:doc.fileKey??null}
    bindings.set(session.id,binding);return binding
  }
  const metricsFor=session=>{let log=performanceLogs.get(session.id);if(!log){log=new PerformanceLog();performanceLogs.set(session.id,log)}return log}
  const connect=deps.connect??connectOfficial
  let gate=Promise.resolve()
  const exclusive=run=>{const next=gate.then(run);gate=next.catch(()=>{});return next}
  let stopped=false,bridge,companion,available=false,toolNames=[],remoteInstructions='',refreshing,errorCode=null,diagnostic=null
  const assertOpen=()=>{if(stopped)throw new Error('Figma plugin has stopped')}
  const register=(rawName,description,inputSchema,call,{qualified=true,outputSchema,taskRequired}={})=>{
    const tool=createMcpToolDefinition(ctx,{name:qualified?publicToolName('figma',rawName):rawName,rawName,description,inputSchema,outputSchema,taskRequired,call})
    tool.isConcurrencySafe=()=>false // Stateful document selection and mutations are barriers.
    const dispose=ctx.tools.register(tool);(qualified?dynamic:disposers).push(dispose)
  }
  const closeSession=async id=>{defaultSpec.forget(id);bindings.delete(id);performanceLogs.delete(id);figmaTasks.close(id);const connection=sessions.get(id);sessions.delete(id);if(connection)await connection.then(c=>c.close()).catch(()=>{})}
  const close=async()=>{
    if(stopped)return;stopped=true;shutdown.abort()
    for(const dispose of [...dynamic.splice(0),...disposers.splice(0)])dispose()
    await bridge?.close();await Promise.all([...sessions.keys()].map(closeSession));performanceLogs.clear();figmaTasks.clear();defaultSpec.clear();available=false
  }
  ctx.effect(()=>close,'dsh-figma.lifecycle')
  ctx.on('agent/disposed',({agent})=>{dead.add(agent);agents.get(agent)?.abort();void closeSession(agent.session.id)})
  ctx.on('internal/plugin',fiber=>{if(fiber===ctx.fiber&&fiber.uid===null)return close()},{global:true})
  await registerSkill(ctx)
  const execution=async exec=>{
    assertOpen();exec.signal.throwIfAborted()
    const agent=exec.agent,session=agent?.session
    if(!session||dead.has(agent)||!session.header.cwd||!isAbsolute(session.header.cwd))throw new Error('Figma tools require an active Work session with a workspace')
    let controller=agents.get(agent);if(!controller){controller=new AbortController();agents.set(agent,controller)}
    const signal=AbortSignal.any([exec.signal,controller.signal,shutdown.signal]),workspace=await realpath(session.header.cwd)
```

</details>

**依据 2 · 源码核查**：[index.mjs:118-166](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L118-L166)

选择/配对/目标校验/预检/bridge实际调用。

<details>
<summary>查看原文（49行）</summary>

```text
  register('figma_select_document','Bind this Work session to one explicitly chosen local Figma document. IDs come from figma_status. Never silently switches targets.',objectSchema({connectionId:{type:'string'}},['connectionId']),async(args,exec)=>{
    const {session,workspace}=await execution(exec)
    if(!bridge)throw new Error('Document binding is only used with the local backend')
    const doc=bridge.list().find(d=>d.connectionId===args.connectionId)
    if(!doc)throw new Error('Document is not connected')
    bindDocument(session,workspace,doc);return result({selected:doc})
  },{qualified:false})
  if(backend==='local'){
    try{
      bridge=deps.bridge??new LocalBridge({token:await bridgeToken(home),port:config.bridgePort??3055,timeoutMs})
      bridge.localSpecs=localSpecs
      await bridge.start()
      companion=await prepareCompanion(home,{port:bridge.port,token:bridge.token})
      await privateJson(join(await privateDirectory(home),'bridge.json'),{port:bridge.port,pid:process.pid,companion:companion.manifest,startedAt:new Date().toISOString()})
      for(const tool of LOCAL_TOOLS)register(tool.name,tool.description,tool.inputSchema,async(args,exec)=>{
        let dispatched=false
        try {
        const {session,workspace,signal}=await execution(exec)
        if(tool.name==='list_local_specs')return result(await localSpecs.list())
        if(tool.name==='read_local_spec'){const before=localSpecs.defaultState(),page=await localSpecs.read(args);defaultSpec.record(session.id,page,before);return result(page)}
        if(tool.name==='edit_local_spec')return result(await localSpecs.edit(args))
        let binding=bindings.get(session.id)
        if(!binding){
          const documents=bridge.list()
          if(documents.length!==1)throw new Error(documents.length?'Multiple Figma documents are connected. Choose the target with figma_select_document using figma_status.':'No Figma document is connected. Run the paired Figma companion; use figma_setup for its manifest path.')
          binding=bindDocument(session,workspace,documents[0])
        }
        const document=bridge.list().find(doc=>doc.connectionId===binding.id)
        if(!document)throw new Error('The previously selected Figma document disconnected. Read figma_status for documentBinding and bindingMatch hints. Explicitly choose the intended document with figma_select_document; it will not switch automatically.')
        if(binding.workspace!==workspace)throw new Error('Work workspace changed; explicitly select the document again')
        if((document.featureVersion??0)<requiredQueryFeatureVersion(tool.name,args))throw new Error('The connected Figma companion does not support these query features yet. Run figma_setup, then close and rerun DSH to Figma · Local from its paired manifest; inspect figma_status and reselect the document. Legacy queries remain available.')
        const context=figmaTasks.context(session.id,workspace,document,args)
        if(tool.name==='create_session')return result(figmaTasks.create(session.id,workspace,document,args))
        if(tool.name==='use_figma')preflightScript(args.code)
        const id=binding.id
        const performanceLog=metricsFor(session)
        const started=performance.now()
        let payload=args,response,output,bridgeMetric,status='failed'
        try{
          if(tool.name==='upload_assets')payload={parentId:args.parentId,assets:await readAssets(workspace,args.files)}
          if(tool.mutation)defaultSpec.assertRead(session.id)
          dispatched=true
          if(context.task){context.task.calls++;context.task.files.add(context.fileKey)}
          response=await bridge.call(id,tool.name,payload,{signal,mutation:tool.mutation,inspect:tool.inspect&&!requiresQueryFeatures(tool.name,args),onMetric:metric=>{bridgeMetric=metric}})
          signal.throwIfAborted()
          if(tool.name==='download_assets')response.value={...response.value,files:await saveAssets(workspace,response.assets)}
          const files=tool.name==='use_figma'&&response.assets?.length?await saveAssets(workspace,response.assets):[]
          output=localResult(response)
          if(files.length){output.structuredContent.files=files;output.content.push({type:'text',text:JSON.stringify({files})})}
```

</details>

**依据 3 · 源码核查**：[companion/ui.html:15-39](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/ui.html#L15-L39)

真实HTTP/Bearer/poll→主插件→result。

<details>
<summary>查看原文（25行）</summary>

```text
async function request(path,data,timeout=25000){const response=await fetch(endpoint+path,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(timeout)});const value=await response.json();if(!response.ok){const error=new Error(value.error||'Bridge unavailable');error.status=response.status;throw error}return value}
function schedule(){clearTimeout(retryTimer);if(desired&&!blocked&&token){const delay=Math.min(10000,1000*2**Math.min(retries++,4));retryTimer=setTimeout(()=>void connect(),delay)}}
function fail(error){active=false;button.disabled=false;if(inFlight){blocked=true;desired=false;show('连接在执行中中断，操作不会重放。请重新打开插件，并先让 DSH 检查画布。 / Interrupted during an operation; reopen and inspect before editing.','blocked');button.textContent='请重新打开插件 / Reopen plugin';button.disabled=true;return}if(error.status===401){desired=false;show('配对已失效。请让 DSH 调用 figma_setup，再运行生成的已配对插件。 / Pairing expired; use figma_setup.','unpaired');button.textContent='重试 / Retry';return}show('等待 DSH 启动…请确认已启用本地模式，将自动重连。 / Waiting for DSH local mode; reconnecting automatically.');button.textContent='立即重试 / Retry now';schedule()}
async function connect(){if(connecting||active||blocked||!desired||!metadata||!token)return;clearTimeout(retryTimer);connecting=true;button.disabled=true;const attempt=++generation
 try{
  if(connectionId){try{await request('/heartbeat',{connectionId},5000)}catch(error){if(error.status!==404&&error.status!==410)throw error;connectionId=null}}
  if(!connectionId){let fileKey=metadata.fileKey||null;const value=document.querySelector('#file').value.trim();if(!fileKey&&value){const url=new URL(value);if(!['figma.com','www.figma.com'].includes(url.hostname)||!['design','file','board','slides'].includes(url.pathname.split('/')[1]))throw new Error('Invalid Figma file URL');fileKey=url.pathname.split('/')[2];if(!/^[A-Za-z0-9]{5,128}$/.test(fileKey))throw new Error('Invalid Figma file URL')}
   const result=await request('/connect',{name:metadata.name,editorType:metadata.editorType,fileKey,clientId,featureVersion:metadata.featureVersion,capabilities:metadata.capabilities,companionVersion:metadata.companionVersion},5000);connectionId=result.connectionId}
  if(attempt!==generation||!desired)return
  active=true;retries=0;button.textContent='暂停连接 / Pause';show('可以回到 DSH 开始操作。请保持此窗口打开。 / Ready. Return to DSH; keep this window open.','connected');void specAction(()=>refreshSpecs());void poll(attempt)
 }catch(error){if(attempt===generation&&desired)fail(error)}finally{connecting=false;if(!blocked)button.disabled=false}
}
async function poll(epoch){while(active&&desired&&generation===epoch){try{const job=await request('/poll',{connectionId});if(!active||!desired||generation!==epoch)break;if(job.id){inFlight=job.id;show('正在执行 / Running: '+job.method,'connected');const result=await new Promise(resolve=>{pending.set(job.id,resolve);parent.postMessage({pluginMessage:{type:'execute',...job}},'*')});await request('/result',{connectionId,...result});inFlight=null;show(result.ok?'操作完成，等待下一步。 / Done. Ready for the next task.':'操作失败，请让 DSH 检查画布。 / Failed; inspect canvas.','connected')}}catch(error){if(generation===epoch&&desired)fail(error);break}}}
window.onmessage=event=>{if(event.source!==parent&&!(event.source===top&&['https://www.figma.com','https://figma.com'].includes(event.origin)))return;const message=event.data?.pluginMessage;if(!message)return
 if(message.type==='document'){
  metadata={name:message.name,editorType:message.editorType,fileKey:message.fileKey,featureVersion:message.featureVersion,capabilities:message.capabilities,companionVersion:message.companionVersion??null};document.querySelector('#document').textContent=message.name+' · '+message.editorType
  const config=message.connection
  if(config&&/^[a-f0-9]{64}$/.test(config.token)&&Number.isInteger(config.port)&&config.port>=1024&&config.port<=65535){token=config.token;endpoint='http://localhost:'+config.port;document.querySelector('#version').textContent=config.version||'';void connect()}
  else if(!token){show('首次使用：在 DSH 中说“帮我连接 Figma”，导入它提供的已配对 manifest，然后运行该插件。 / Ask DSH to prepare the paired companion and import its manifest once.','unpaired');button.textContent='重试 / Retry'}
 }
 if(message.type==='progress'&&inFlight){const nodes=Array.isArray(message.nodes)?message.nodes:[];show(nodes.length?'正在构建：'+nodes.slice(0,2).map(n=>String(n.name).slice(0,40)).join('、')+(nodes.length>2?' 等 '+nodes.length+' 项':'')+' / Building':'正在执行 / Running','connected')}
 if(message.type==='result'){const resolve=pending.get(message.id);if(resolve){pending.delete(message.id);resolve(message)}}
}
parent.postMessage({pluginMessage:{type:'describe'}},'*')
setInterval(()=>{if(active)void request('/heartbeat',{connectionId},5000).catch(()=>{})},10000)
```

</details>

**依据 4 · 源码核查**：[companion/code.js:650-668](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/code.js#L650-L668)

真实busy→runtime.run与结果。

<details>
<summary>查看原文（19行）</summary>

```text
let busy = false
figma.ui.onmessage = async message => {
  if (message.type === 'resize') {
    if (Number.isFinite(message.height)) figma.ui.resize(300, Math.max(158, Math.min(520, Math.round(message.height))))
    return
  }
  if (message.type === 'describe') {
    let capabilities
    try { capabilities = await globalThis.DshFigmaCapabilities.probe(figma) } catch {} // Discovery must not prevent pairing.
    figma.ui.postMessage({ type: 'document', name: figma.root.name, editorType: figma.editorType, fileKey: figma.fileKey || null, featureVersion: 4, capabilities, companionVersion: globalThis.DSH_FIGMA_BOOTSTRAP?.version || null, connection: globalThis.DSH_FIGMA_BOOTSTRAP || null })
    return
  }
  if (message.type !== 'execute') return
  if (busy) { figma.ui.postMessage({ type: 'result', id: message.id, ok: false, error: 'An operation is already running' }); return }
  busy = true
  try { const result = await runtime.run(message.method, message.args); figma.ui.postMessage({ type: 'result', id: message.id, ok: true, result }) }
  catch (error) { figma.ui.postMessage({ type: 'result', id: message.id, ok: false, error: String(error && error.message || error), safeToRetryWithoutCanvasRead: error?.safeToRetryWithoutCanvasRead === true }) }
  finally { busy = false }
}
```

</details>

**依据 5 · 源码核查**：[companion/code.js:493-507](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/code.js#L493-L507)

真实new Function/facade/首page/commitUndo。

<details>
<summary>查看原文（15行）</summary>

```text
      let value, assets
      switch (method) {
        case 'use_figma': {
          if (typeof args.code !== 'string' || !args.code.trim() || args.code.length > 150000) throw new Error('Provide a script of 1–150000 characters')
          const run = new Function('figma', 'dsh', '"use strict"; return (async () => {\n' + args.code + '\n})()')
          const first=f.root.children[0]
          if(first&&f.currentPage!==first)await f.setCurrentPageAsync(first)
          assets=[]
          const facade=await this.facade(images,assets)
          this.scriptEntered=true
          value = await run(facade, { ...this.motionHelpers, color(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) throw new Error('Use a six-digit hex color'); const n = parseInt(m[1],16); return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 } } })
          f.commitUndo(); break
        }
        case 'get_selection': value = { page: this.snapshot(f.currentPage, 0), selection: f.currentPage.selection.map(n => this.snapshot(n, 0)) }; break
        case 'list_fonts': {
```

</details>

**依据 6 · 源码核查**：[lib/script-preflight.mjs:14-28](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/script-preflight.mjs#L14-L28)

Host parse-only预检。

<details>
<summary>查看原文（15行）</summary>

````text
// Parse only: submitted code is never evaluated in the DSH host.
export function preflightScript(code) {
  if (typeof code !== 'string' || !code.trim() || code.length > 150000) {
    throw new ScriptPreflightError({code:'INVALID_SCRIPT',message:'Provide a script of 1–150000 characters.',hint:'Send JavaScript with top-level await/return; no Markdown fences.'})
  }
  if (code.trimStart().startsWith('```')) throw new ScriptPreflightError({code:'INVALID_SCRIPT',message:'Markdown code fences are not executable script input.',hint:'Remove the opening and closing fences and send only JavaScript. No script ran.'})
  const lines = code.split(/\r\n|[\n\r\u2028\u2029]/)
  const diagnostic = (name, loc, message, hint) => ({code:name,line:Math.max(1,Math.min(lines.length,loc.line-1)),column:loc.line-1>lines.length?lines.at(-1).length+1:loc.column+1,message,hint})
  let ast
  try { ast = parse(prefix + code + '\n})()', {ecmaVersion:'latest',locations:true}) }
  catch (error) {
    if (!error.loc) throw error
    throw new ScriptPreflightError(diagnostic('SCRIPT_SYNTAX',error.loc,error.message.replace(/ \(\d+:\d+\)$/,''),'Fix the indicated JavaScript syntax and retry. No script ran; do not inspect or recreate canvas objects for this error.'))
  }

````

</details>

**依据 7 · 源码核查**：[lib/assets.mjs:22-46](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/assets.mjs#L22-L46)

上传canonical/no-follow/预算/SVG限制。

<details>
<summary>查看原文（25行）</summary>

```text
  if(!Array.isArray(files)||!files.length||files.length>20)throw new Error('Provide 1–20 workspace files')
  const root=await realpath(workspace), assets=[]; let total=0
  for(const path of files){
    if(typeof path!=='string')throw new Error('File paths must be strings')
    const candidate=resolve(root,path)
    if(!inside(root,candidate))throw new Error('Asset must stay inside the current workspace')
    const canonical=await realpath(candidate)
    if(!inside(root,canonical))throw new Error('Asset symlink escapes the workspace')
    const file=await open(canonical,constants.O_RDONLY|(constants.O_NOFOLLOW??0))
    let bytes
    try { const info=await file.stat(); if(!info.isFile()||info.size>LIMIT-total)throw new Error('Asset batch exceeds 12 MiB'); bytes=await file.readFile(); if(bytes.length!==info.size||await realpath(candidate)!==canonical)throw new Error('Asset changed while reading') }
    finally { await file.close() }
    total+=bytes.length; if(total>LIMIT)throw new Error('Asset batch exceeds 12 MiB')
    const mimeType=imageMime(bytes), name=basename(path)
    if(mimeType)assets.push({name,mimeType,data:bytes.toString('base64')})
    else if(/\.svg$/i.test(name)){
      const svg=bytes.toString('utf8')
      if(!/<svg[\s>]/i.test(svg)||/<!DOCTYPE|<!ENTITY|<script[\s>]|<foreignObject[\s>]|\bon\w+\s*=|(?:href|src)\s*=\s*["']\s*(?:https?:|file:|javascript:|\/\/)|url\(\s*["']?\s*(?:https?:|file:|\/\/)/i.test(svg))throw new Error('SVG must be self-contained with no executable or external content')
      for(const match of svg.matchAll(/\b(?:href|src)\s*=\s*(["'])([\s\S]*?)\1/gi)) {
        if(!/^#[A-Za-z_][\w:.-]*$/.test(match[2])&&!/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(match[2]))throw new Error('SVG must be self-contained; external references are not supported')
      }
      if(/@import|url\(\s*["']?\s*[^#\s]/i.test(svg))throw new Error('SVG must be self-contained; external styles are not supported')
      assets.push({name,mimeType:'image/svg+xml',svg})
    } else throw new Error('Use PNG, JPEG, WebP, GIF or self-contained SVG assets')
  }
```

</details>

**依据 8 · 源码核查**：[lib/official.mjs:4-20](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/official.mjs#L4-L20)

官方loopback/OAuth传输与无重连重试。

<details>
<summary>查看原文（17行）</summary>

```text
export function desktopUrl(value='http://127.0.0.1:3845/mcp'){
  const u=new URL(value)
  if(u.protocol!=='http:'||!['127.0.0.1','[::1]'].includes(u.hostname)||u.username||u.password||u.search||u.hash||u.pathname!=='/mcp')throw new Error('Desktop MCP must use a literal loopback HTTP /mcp URL')
  return u.href
}
export async function connectOfficial({backend,home,desktopServerUrl,clientId,signal}){
  const remote=backend==='remote',url=remote?REMOTE_URL:desktopUrl(desktopServerUrl)
  const provider=remote?await oauthProvider(home,{clientId}):undefined
  const client=new Client({name:'dsh-to-figma',version:packageInfo.version})
  const transport=new StreamableHTTPClientTransport(new URL(url),{
    authProvider:provider,
    fetch:remote?oauthFetch:async(target,init)=>{if(new URL(target).origin!==new URL(url).origin)throw new Error('Unexpected desktop endpoint');return fetch(target,{...init,redirect:'error'})},
    reconnectionOptions:{maxRetries:0},
  })
  const close=async()=>{await client.close().catch(()=>{});await transport.close().catch(()=>{})}
  try{await client.connect(transport,{timeout:15000,signal});return {client,close}}catch(error){await close();throw error}
}
```

</details>

#### 缺口

- 全部Figma facade/节点/动画/query和真实资产/Host兼容未运行。
  **影响**：不能称所有编辑器可写或所有页面目标自动正确。
  **进一步探讨**：一个测试文件两页，明确选择/读取page再建少量节点，核结构/截图/资源落点。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配对和预检保护什么，失败为何需先看画布？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本机桥只listen127.0.0.1，精确Host/Origin（空、null及Figma域）加Bearer恒时等长比较，body24MiB限制。token由32随机字节生成，目录0700/文件0600，拒token符号链接；已配对companion把token嵌进code.js并生成ZIP，必须当秘密本地凭据，不分享。不是每文件各一把token或多用户隔离，持同token的本地程序/配对副本都在同信任域。

预检主要拒语法错误和已知Figma不支持的同步mainComponent/只读motion集合，不是任意脚本安全扫描或变更审批。companion只在scriptEntered前错误才给safeToRetryWithoutCanvasRead=true，不信脚本自行抛的属性；开始后任意失败可能已有节点/变量/页面变化，没有事务回滚，commitUndo只在成功路径调用，不能从一次调用推全有/全无。

每文档一active、队列最多30。发出后timeout/abort置uncertain并结束本机等待，不撤运行脚本；active保留到结果回，后续mutation被拒，要求get_metadata检查。读取成功只解除门禁，不证明视觉已符合或副作用全恢复。前端若执行中网络断开进入blocked/不重放。桥进程/文档断开会丢内存pending/uncertain，重连必须重新选择并人工核画布，不是持久operation事务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/bridge.mjs:18-46](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/bridge.mjs#L18-L46)

真实listen/Host/Origin/Bearer/body路由。

<details>
<summary>查看原文（29行）</summary>

```text
  constructor({ token, port = 3055, timeoutMs = 120000, localSpecs }) {
    this.localSpecs = localSpecs; this.token = token; this.port = port; this.timeoutMs = timeoutMs
    this.documents = new Map(); this.stopped = false
  }
  async start() {
    this.server = createServer((req, res) => this.route(req, res).catch(() => json(res, 400, { error: 'Invalid bridge request' })))
    this.server.requestTimeout = 30000
    await new Promise((resolve, reject) => { this.server.once('error', reject); this.server.listen(this.port, '127.0.0.1', resolve) })
    this.port = this.server.address().port
    this.timer = setInterval(() => {
      for (const doc of this.documents.values()) if (Date.now() - doc.lastSeen > 45000) this.remove(doc.id)
    }, 5000); this.timer.unref()
    return this
  }
  list() { return [...this.documents.values()].map(d => ({ connectionId: d.id, name: d.name, editorType: d.editorType, fileKey: d.fileKey, busy: !!d.active, needsInspection: d.uncertain, featureVersion: d.featureVersion, companionVersion: d.companionVersion, capabilities:capabilityReport(d.capabilities) })) }
  async route(req, res) {
    if (this.stopped) return json(res, 503, { error: 'Bridge stopped' })
    if (![ `127.0.0.1:${this.port}`, `localhost:${this.port}` ].includes(req.headers.host)) return json(res, 403, { error: 'Host rejected' })
    const origin = req.headers.origin
    if (origin && !ORIGINS.has(origin)) return json(res, 403, { error: 'Origin rejected' })
    if (origin) { res.setHeader('access-control-allow-origin', origin); res.setHeader('vary', 'Origin') }
    if (req.method === 'OPTIONS') {
      res.setHeader('access-control-allow-methods', 'POST')
      res.setHeader('access-control-allow-headers', 'Authorization, Content-Type')
      res.setHeader('access-control-allow-private-network', 'true')
      res.writeHead(204); return res.end()
    }
    if (!equal(req.headers.authorization, `Bearer ${this.token}`)) return json(res, 401, { error: 'Pairing token required' })
    if (req.method !== 'POST') return json(res, 405, { error: 'POST required' })
```

</details>

**依据 2 · 源码核查**：[lib/storage.mjs:5-35](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/storage.mjs#L5-L35)

真实私有目录/token生成/校验。

<details>
<summary>查看原文（31行）</summary>

```text
export async function privateDirectory(home) {
  const directory = join(home, 'figma')
  await mkdir(directory, { recursive: true, mode: 0o700 })
  if ((await lstat(directory)).isSymbolicLink()) throw new Error('Figma state directory cannot be a symlink')
  await chmod(directory, 0o700)
  return directory
}
export async function readJson(path, fallback = {}) {
  try { return JSON.parse(await readFile(path, 'utf8')) } catch (e) { if (e.code === 'ENOENT') return fallback; throw e }
}
export async function privateJson(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`
  try {
    const file = await open(temporary, 'wx', 0o600)
    try { await file.writeFile(JSON.stringify(value)); await file.sync() } finally { await file.close() }
    await rename(temporary, path)
  } finally { await rm(temporary, { force: true }) }
}
export async function bridgeToken(home) {
  const path = join(await privateDirectory(home), 'bridge-token')
  try {
    const file = await open(path, 'wx', 0o600)
    try { await file.writeFile(randomBytes(32).toString('hex')) } finally { await file.close() }
  } catch (e) { if (e.code !== 'EEXIST') throw e }
  const info = await lstat(path)
  if (!info.isFile() || info.isSymbolicLink()) throw new Error('Invalid bridge token file')
  await chmod(path, 0o600)
  const token = (await readFile(path, 'utf8')).trim()
  if (!/^[a-f0-9]{64}$/.test(token)) throw new Error('Invalid bridge token')
  return token
}
```

</details>

**依据 3 · 源码核查**：[lib/companion.mjs:8-24](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/companion.mjs#L8-L24)

token嵌bootstrap与私密副本提示。

<details>
<summary>查看原文（17行）</summary>

```text
export async function companionFiles({token,port=3055}={}){
  if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('Invalid companion bridge port')
  if(token!==undefined&&!/^[a-f0-9]{64}$/.test(token))throw new Error('Invalid companion pairing token')
  const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'))
  const manifest=JSON.parse(await readFile(join(root,'companion/manifest.json'),'utf8'))
  if(token){manifest.id='dsh-to-figma-local-'+createHash('sha256').update(token).digest('hex').slice(0,12);manifest.name='DSH to Figma · Local'}
  manifest.networkAccess.devAllowedDomains=[`http://localhost:${port}`]
  const bootstrap={version:pkg.version,port,...(token?{token}:{})}
  const code=`globalThis.DSH_FIGMA_BOOTSTRAP = ${JSON.stringify(bootstrap)};\n`+await readFile(join(root,'companion/code.js'),'utf8')
  return {
    'manifest.json':JSON.stringify(manifest,null,2)+'\n',
    'code.js':code,
    'ui.html':await readFile(join(root,'companion/ui.html'),'utf8'),
    'README.txt':`DSH to Figma ${pkg.version}\n\n${token?'PRIVATE PAIRED COPY — contains a local credential. Do not publish or share.\n本机专用已配对版本，含本机凭证，请勿上传或分享。':'Generic companion — contains no credentials. For automatic pairing, ask DSH to run figma_setup and import its generated manifest instead.\n通用版不含凭证。推荐让 DSH 调用 figma_setup，导入它生成的已配对 manifest。'}\n\nFigma desktop > Plugins > Development > Import plugin from manifest… > manifest.json\nKeep this folder in place. Open a Design file and run the plugin; keep its window open.\n保留此文件夹位置，在目标文件运行插件并保持窗口打开。DSH 本地模式默认端口为 3055。\n${token?'It connects automatically. One connected file is selected automatically; multiple files require an explicit choice.\n启动后自动连接。只有一个连接文件时自动选用，多个文件时明确选择。':'Manual fallback: run dsh-figma pair, then paste the token into Advanced in the plugin.\n手动备用方式：运行 dsh-figma pair，把密钥粘贴到插件高级设置。'}\n`,
    'LICENSE':await readFile(join(root,'LICENSE'),'utf8'),
    'FEATHER-LICENSE':await readFile(join(root,'assets/companion/FEATHER-LICENSE'),'utf8'),
  }
```

</details>

**依据 4 · 源码核查**：[lib/script-preflight.mjs:97-111](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/script-preflight.mjs#L97-L111)

实际特定Figma属性预检，不是通用安全证明。

<details>
<summary>查看原文（15行）</summary>

```text
      if (owner === 'node' && key === 'query') return 'query'
      if (owner === 'query' && ['first','last'].includes(key) || ['nodes','query'].includes(owner) && key === 'at') return 'node'
      if (owner === 'query' && key === 'toArray') return 'nodes'
    }
    return null
  }
  const fail = node => { throw new ScriptPreflightError(diagnostic('FIGMA_ASYNC_MAIN_COMPONENT',node.loc.start,'Synchronous mainComponent access is not supported in dynamic-page scripts.','Use const main = await instance.getMainComponentAsync(); then return main?.id or main?.name. No script ran; fix this access and retry.')) }
  for (const {target,scope} of writes) if (target.type === 'MemberExpression' && kind(target.object,scope) === 'node' && ['animationStyles','manualKeyframeTracks','timelines','animations'].includes(property(target))) {
    throw new ScriptPreflightError(diagnostic('FIGMA_READONLY_MOTION_COLLECTION',target.loc.start,'Native motion collections are read-only in the local editor.', 'Use applyManualKeyframeTrack/removeManualKeyframeTrack, setTimelineDuration, or dsh.updateAnimationStyle(node, applicationId, discoveredDefinitionId, configuration). Read the motion guide; replacement returns a new application ID. No script ran.'))
  }
  for (const node of accesses) if (kind(node.object,scopes.get(node)) === 'node') fail(node)
  for (const {pattern,init,scope} of patterns) if (kind(init,scope) === 'node') {
    for (const prop of pattern.properties) if (prop.type === 'Property' && (prop.computed ? prop.key.value : prop.key.name ?? prop.key.value) === 'mainComponent') fail(prop)
  }
}
```

</details>

**依据 5 · 源码核查**：[companion/code.js:482-505](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/code.js#L482-L505)

scriptEntered与仅执行前retry-safe/实际执行。

<details>
<summary>查看原文（24行）</summary>

```text
        result.metrics=this.metrics
        return result
      }catch(cause){
        // Never trust an exception property supplied by user code. Only pre-execution failures are retry-safe.
        const error=new Error(String(cause&&cause.message||cause))
        error.safeToRetryWithoutCanvasRead=method==='use_figma'&&!this.scriptEntered
        throw error
      }finally{this.clearPlaceholders?.();this.clearPlaceholders=null;this.metrics=null;this.readOptions={};this.snapshotBudget=null}
    }
    async execute(method, args = {}) {
      const f = this.figma, images = [], depth = integer(args.depth,3,0,10,'depth')
      let value, assets
      switch (method) {
        case 'use_figma': {
          if (typeof args.code !== 'string' || !args.code.trim() || args.code.length > 150000) throw new Error('Provide a script of 1–150000 characters')
          const run = new Function('figma', 'dsh', '"use strict"; return (async () => {\n' + args.code + '\n})()')
          const first=f.root.children[0]
          if(first&&f.currentPage!==first)await f.setCurrentPageAsync(first)
          assets=[]
          const facade=await this.facade(images,assets)
          this.scriptEntered=true
          value = await run(facade, { ...this.motionHelpers, color(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) throw new Error('Use a six-digit hex color'); const n = parseInt(m[1],16); return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 } } })
          f.commitUndo(); break
        }
```

</details>

**依据 6 · 源码核查**：[lib/bridge.mjs:82-145](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/bridge.mjs#L82-L145)

结果/uncertain/串行/队列/取消/断开实际。

<details>
<summary>查看原文（64行）</summary>

```text
    }
    if (req.url === '/result') {
      const job = doc.active
      if (!job || data.id !== job.id) return json(res, 409, { error: 'Unknown or already consumed operation' })
      doc.active = null
      if (!job.settled) {
        if (data.ok === true) {
          if (job.method === 'get_capabilities') doc.capabilities = capabilityReport(data.result?.value)
          if (job.inspect) doc.uncertain = false
          job.finish(null, data.result)
        } else {
          const safe = doc.featureVersion >= 3 && data.safeToRetryWithoutCanvasRead === true
          if (job.mutation && !safe) doc.uncertain = true
          job.finish(failure(`${String(data.error || 'Figma operation failed').slice(0, 2000)}; ${safe?'correct the error and retry':'inspect the canvas before retrying'}`,safe))
        }
      }
      json(res, 200, { accepted: true }); this.dispatch(doc); return
    }
    json(res, 404, { error: 'Unknown route' })
  }
  dispatch(doc) {
    if (doc.active || !doc.poll) return
    let job
    while ((job = doc.queue.shift())) {
      if (job.settled) continue
      if (doc.uncertain && job.mutation) { job.finish(new Error('Previous operation outcome is uncertain. Read get_metadata before another write.')); continue }
      doc.active = job; job.dispatched = true; job.dispatchedAt = performance.now()
      const poll = doc.poll; doc.poll = null; clearTimeout(poll.timer)
      json(poll.res, 200, { id: job.id, method: job.method, args: job.args }); return
    }
  }
  call(id, method, args, { signal, mutation = false, inspect = false, onMetric } = {}) {
    const doc = this.documents.get(id)
    if (this.stopped || !doc) return Promise.reject(new Error('Figma document is not connected'))
    if (doc.queue.length >= 30) return Promise.reject(new Error('Figma queue is full'))
    if (Buffer.byteLength(JSON.stringify(args)) > MAX_BODY - 1024) return Promise.reject(new Error('Figma request is too large'))
    return new Promise((resolve, reject) => {
      const job = { id: randomUUID(), method, args, mutation, inspect, settled: false, dispatched: false, queuedAt: performance.now() }
      let timer
      const cancel = () => {
        if (job.dispatched && mutation) doc.uncertain = true
        job.finish(failure(job.dispatched ? 'Figma operation interrupted; its outcome may be unknown. Do not replay. Wait for completion and inspect the canvas.' : 'Figma operation canceled before dispatch',!job.dispatched&&!doc.uncertain))
      }
      job.finish = (error, result) => {
        if (job.settled) return
        job.settled = true; clearTimeout(timer); signal?.removeEventListener('abort', cancel)
        if (!job.dispatched) doc.queue = doc.queue.filter(other => other !== job)
        const finishedAt = performance.now()
        try { onMetric?.({queueMs:(job.dispatchedAt??finishedAt)-job.queuedAt,bridgeMs:job.dispatched?finishedAt-job.dispatchedAt:null}) } catch {} // Diagnostics must never affect execution.
        error ? reject(error) : resolve(result)
      }
      timer = setTimeout(cancel, this.timeoutMs)
      if (signal?.aborted) return cancel()
      signal?.addEventListener('abort', cancel, { once: true })
      doc.queue.push(job); this.dispatch(doc)
    })
  }
  remove(id) {
    const doc = this.documents.get(id); if (!doc) return
    this.documents.delete(id)
    if (doc.poll) { clearTimeout(doc.poll.timer); json(doc.poll.res, 410, { error: 'Disconnected' }) }
    for (const job of [doc.active, ...doc.queue].filter(Boolean)) job.finish(new Error('Figma disconnected. Operation was not replayed; inspect the canvas after reconnecting.'))
  }
  async close() {
```

</details>

**依据 7 · 源码核查**：[companion/ui.html:15-27](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/ui.html#L15-L27)

执行中断blocked/不重放。

<details>
<summary>查看原文（13行）</summary>

```text
async function request(path,data,timeout=25000){const response=await fetch(endpoint+path,{method:'POST',headers:{authorization:'Bearer '+token,'content-type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(timeout)});const value=await response.json();if(!response.ok){const error=new Error(value.error||'Bridge unavailable');error.status=response.status;throw error}return value}
function schedule(){clearTimeout(retryTimer);if(desired&&!blocked&&token){const delay=Math.min(10000,1000*2**Math.min(retries++,4));retryTimer=setTimeout(()=>void connect(),delay)}}
function fail(error){active=false;button.disabled=false;if(inFlight){blocked=true;desired=false;show('连接在执行中中断，操作不会重放。请重新打开插件，并先让 DSH 检查画布。 / Interrupted during an operation; reopen and inspect before editing.','blocked');button.textContent='请重新打开插件 / Reopen plugin';button.disabled=true;return}if(error.status===401){desired=false;show('配对已失效。请让 DSH 调用 figma_setup，再运行生成的已配对插件。 / Pairing expired; use figma_setup.','unpaired');button.textContent='重试 / Retry';return}show('等待 DSH 启动…请确认已启用本地模式，将自动重连。 / Waiting for DSH local mode; reconnecting automatically.');button.textContent='立即重试 / Retry now';schedule()}
async function connect(){if(connecting||active||blocked||!desired||!metadata||!token)return;clearTimeout(retryTimer);connecting=true;button.disabled=true;const attempt=++generation
 try{
  if(connectionId){try{await request('/heartbeat',{connectionId},5000)}catch(error){if(error.status!==404&&error.status!==410)throw error;connectionId=null}}
  if(!connectionId){let fileKey=metadata.fileKey||null;const value=document.querySelector('#file').value.trim();if(!fileKey&&value){const url=new URL(value);if(!['figma.com','www.figma.com'].includes(url.hostname)||!['design','file','board','slides'].includes(url.pathname.split('/')[1]))throw new Error('Invalid Figma file URL');fileKey=url.pathname.split('/')[2];if(!/^[A-Za-z0-9]{5,128}$/.test(fileKey))throw new Error('Invalid Figma file URL')}
   const result=await request('/connect',{name:metadata.name,editorType:metadata.editorType,fileKey,clientId,featureVersion:metadata.featureVersion,capabilities:metadata.capabilities,companionVersion:metadata.companionVersion},5000);connectionId=result.connectionId}
  if(attempt!==generation||!desired)return
  active=true;retries=0;button.textContent='暂停连接 / Pause';show('可以回到 DSH 开始操作。请保持此窗口打开。 / Ready. Return to DSH; keep this window open.','connected');void specAction(()=>refreshSpecs());void poll(attempt)
 }catch(error){if(attempt===generation&&desired)fail(error)}finally{connecting=false;if(!blocked)button.disabled=false}
}
async function poll(epoch){while(active&&desired&&generation===epoch){try{const job=await request('/poll',{connectionId});if(!active||!desired||generation!==epoch)break;if(job.id){inFlight=job.id;show('正在执行 / Running: '+job.method,'connected');const result=await new Promise(resolve=>{pending.set(job.id,resolve);parent.postMessage({pluginMessage:{type:'execute',...job}},'*')});await request('/result',{connectionId,...result});inFlight=null;show(result.ok?'操作完成，等待下一步。 / Done. Ready for the next task.':'操作失败，请让 DSH 检查画布。 / Failed; inspect canvas.','connected')}}catch(error){if(generation===epoch&&desired)fail(error);break}}}
```

</details>

#### 缺口

- 配对文件ACL跨平台/完整密码学信任、脚本误操作和重连后恢复未测。
  **影响**：不能作跨账号托管或承诺任意脚本可撤销/安全。
  **进一步探讨**：隔离文件测执行前/后抛错、超时/断网、错误token/Origin；核真实对象后再重试，敏感文件先不用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要哪些实际安装、验收与退出工作？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

首次需Node>=22和匹配DSH服务/模型、Figma桌面打开目标文件，local模式从figma_setup生成私有companion manifest导入运行，保持窗口开；两端升级要同步，端口冲突/无文件/多文件等先status。desktop仅官方MCP相应能力，remote另OAuth/账号席位/限额，本地模式不提供云专属生成。包MIT不豁免Figma平台费用/权限，真实现价/总额未知。

持续是模型token、Figma/机器/资源磁盘、逐次结构与真实截图复核、字体/变量/编辑器能力差异和版本维护。metrics记录主机/桥/序列化/图片等诊断，不是模型token或生产净节时；截图只证明当次画面，不能替代图层可编辑性/布局/变量验收。

故障先读safeToRetry与目标状态，不重放已发创建；元数据后仍需针对对象/变量/图片核，并由Figma原生撤销或保留副本人工恢复，不能依bridge断开回滚。关闭插件会abort信号/停桥/清session绑定，暂停companion连接不撤已有设计/工作区资源，退出需保留设计副本并撤配对凭据/私有ZIP、关companion，清本地资源按归属。建议可丢弃文件先小范围原生节点和截图对照，目标/能力/结果不明就停，回Figma手工/已批准官方读取。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/package.json#L1-L10)

Node/版本/许可。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-to-figma",
  "version": "0.4.0",
  "description": "DSH to Figma — native canvas editing, design context, assets and screenshots for DeepSeek Harness.",
  "type": "module",
  "license": "MIT",
  "engines": {
    "node": ">=22",
    "dsh": "*"
  },
```

</details>

**依据 2 · 作者声明**：[README.zh-CN.md:50-60](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/README.zh-CN.md#L50-L60)

作者setup/版本/目标/截图与保持插件。

<details>
<summary>查看原文（11行）</summary>

````text
1. 从当前宿主配置和运行环境确认对应的 CLI、profile 与 DSH_HOME，使用这个宿主的 CLI。保留其他插件和现有配置；只有无法确定安装目标时才问我。
2. 从 GitHub 最新正式 Release 获取 Release 说明推荐的 dsh-to-figma-<版本>[-hotfix.N].tgz 和 SHA256SUMS，核对 SHA-256。使用 Release 安装包，不要猜测 npm 包版本，也不要把独立 Figma ZIP 当成 DSH 安装包。
3. 通过宿主原生 plugin --profile <当前 profile> add 命令安装或升级，使用 local 模式。若已有旧版，原位升级；仅在确认有重复入口时处理重复项。
4. 检查插件组件是否运行、工具是否可用。需要重启宿主时告诉我，重启后继续完成连接。
5. 调用 figma_setup，给我本机已配对插件 manifest.json 的完整路径，指导我在 Figma 桌面端导入并运行 DSH to Figma · Local。已导入过则更新原目录，关闭旧插件后重新运行。不要显示配对密钥或上传已配对文件。
6. 等我打开目标 Figma 文件并运行插件后，调用 figma_status，确认两端版本和连接状态。多文件时确认目标，再读取我选中的画板并返回截图；这一步不修改已有设计。
```

首次连接时，在 Figma 桌面端选择 **Plugins → Development → Import plugin from manifest…**，导入 DSH 给出的 `manifest.json`。在目标文件中运行 **DSH to Figma · Local**，保持插件窗口打开即可。

通常路径为 `~/.dsh/figma/companion/manifest.json`，以 `figma_setup` 返回的路径为准。升级后，两端插件需要同步更新；保留原导入目录，关闭并重新运行 Figma 插件。
````

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:152-170](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/README.zh-CN.md#L152-L170)

作者配对文件秘密/三后端说明。

<details>
<summary>查看原文（19行）</summary>

```text
把路径和 profile 替换为实际值。桌面版使用应用自带 CLI；其他宿主按实际 profile 安装。安装后在插件面板确认 **DSH to Figma → 运行中**，再让 DSH 调用 `figma_setup` 完成配对。

DSH 会生成已经配对的 Figma 插件，日常安装不需要额外下载 ZIP。Release 中的 `DSH-to-Figma-companion-0.3.2.zip` 是手动配对备用包。DSH 在本机生成的已配对目录与 ZIP 含配对凭证，请保留在本机；Release 中的通用 ZIP 不含凭证。

## 连接与配置

默认使用 `local` 模式：DSH 与 Figma 配套插件通过本机服务连接。单文件连接后自动选用，多文件时明确选择操作目标。

| 配置项 | 默认值 | 用途 |
| --- | --- | --- |
| `backend` | `local` | 选择 `local`、`desktop` 或 `remote` |
| `bridgePort` | `3055` | 本地连接端口 |
| `toolCallTimeoutMs` | `120000` | 单次工具调用超时，单位毫秒 |
| `desktopServerUrl` | `http://127.0.0.1:3845/mcp` | 桌面 MCP 地址 |
| `oauthClientId` | 空 | 远程登录所需的客户端配置 |

通过宿主插件管理器调整配置。[详细接入与配置说明](docs/setup.md)。

如果升级后未发现工具，先确认正在使用正确的宿主和 profile，检查插件面板，再重载或重启 DSH。Figma 端也要关闭旧插件后重新运行。反馈问题时请附上两端版本和错误信息。
```

</details>

**依据 4 · 源码核查**：[index.mjs:64-80](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L64-L80)

真实close/Agent dispose与合并信号。

<details>
<summary>查看原文（17行）</summary>

```text
  }
  const closeSession=async id=>{defaultSpec.forget(id);bindings.delete(id);performanceLogs.delete(id);figmaTasks.close(id);const connection=sessions.get(id);sessions.delete(id);if(connection)await connection.then(c=>c.close()).catch(()=>{})}
  const close=async()=>{
    if(stopped)return;stopped=true;shutdown.abort()
    for(const dispose of [...dynamic.splice(0),...disposers.splice(0)])dispose()
    await bridge?.close();await Promise.all([...sessions.keys()].map(closeSession));performanceLogs.clear();figmaTasks.clear();defaultSpec.clear();available=false
  }
  ctx.effect(()=>close,'dsh-figma.lifecycle')
  ctx.on('agent/disposed',({agent})=>{dead.add(agent);agents.get(agent)?.abort();void closeSession(agent.session.id)})
  ctx.on('internal/plugin',fiber=>{if(fiber===ctx.fiber&&fiber.uid===null)return close()},{global:true})
  await registerSkill(ctx)
  const execution=async exec=>{
    assertOpen();exec.signal.throwIfAborted()
    const agent=exec.agent,session=agent?.session
    if(!session||dead.has(agent)||!session.header.cwd||!isAbsolute(session.header.cwd))throw new Error('Figma tools require an active Work session with a workspace')
    let controller=agents.get(agent);if(!controller){controller=new AbortController();agents.set(agent,controller)}
    const signal=AbortSignal.any([exec.signal,controller.signal,shutdown.signal]),workspace=await realpath(session.header.cwd)
```

</details>

**依据 5 · 源码核查**：[index.mjs:167-175](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L167-L175)

metrics实际字段而非token。

```text
          if(tool.name==='use_figma')output.structuredContent.execution={fileKey:context.fileKey,sessionId:args.sessionId??null,description:args.description??null,skillNames:args.skillNames??null}
          status='ok';return output
        }finally{
          if(signal.aborted)status='canceled'
          performanceLog.record({tool:tool.name,status,hostMs:performance.now()-started,bridge:bridgeMetric,runtime:response?.metrics,
            textBytes:output?Buffer.byteLength(output.content[0].text):null,
            imageCount:output?output.content.filter(block=>block.type==='image').length:null,
            imageBytes:output?output.content.filter(block=>block.type==='image').reduce((total,block)=>total+Buffer.byteLength(block.data,'base64'),0):null})
        }
```

**依据 6 · 源码核查**：[lib/assets.mjs:49-69](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/assets.mjs#L49-L69)

本地下载资产实际目录/创建。

<details>
<summary>查看原文（21行）</summary>

```text
export async function saveAssets(workspace, assets) {
  if(!Array.isArray(assets)||assets.length>40)throw new Error('Invalid asset batch')
  // Decode and validate every byte before creating an output directory.
  let total=0
  const decoded=assets.map(asset=>{const bytes=decode(asset.data); total+=bytes.length;if(total>LIMIT)throw new Error('Asset batch exceeds 12 MiB');return {asset,bytes}})
  const root=await realpath(workspace)
  let directory=root
  for(const name of ['.figma','assets',randomUUID()]){
    directory=join(directory,name);await mkdir(directory,{mode:0o700}).catch(e=>{if(e.code!=='EEXIST')throw e})
    if((await lstat(directory)).isSymbolicLink()||await realpath(directory)!==directory)throw new Error('Asset output directory cannot be a symlink')
  }
  const files=[]
  for(const [index,{asset,bytes}] of decoded.entries()){
    const sniffed=imageMime(bytes), ext={'image/png':'.png','image/jpeg':'.jpg','image/webp':'.webp','image/gif':'.gif'}[sniffed]
    let name=String(asset.name||'asset').replace(/[^\p{L}\p{N}._-]+/gu,'-').replace(/^\.+/,'').slice(0,100)||'asset'
    if(ext&&name.endsWith('.bin'))name=name.slice(0,-4)+ext
    const path=join(directory,`${index+1}-${name}`), file=await open(path,'wx',0o600)
    try{await file.writeFile(bytes)}finally{await file.close()}
    files.push({path,name,mimeType:sniffed||asset.mimeType||'application/octet-stream',bytes:bytes.length})
  }
  return files
```

</details>

#### 缺口

- Figma/模型费、全部编辑器/席位、设计师验收与升级/撤销真实结果未验。
  **影响**：不把可写节点当生产交付或零总成本。
  **进一步探讨**：测试文件对结构/视觉/变量/撤销与重连做小型验收，记录设计师返工和全部资源/人工。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把脚本完成提升为可交接的设计变更？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可验证方向是面向设计师的变更清单/验收回执：每次编辑记录目标file/page与影响节点/变量、预期结构和截图，失败保留执行阶段/未知，人工确认后交给下一轮，而不是get_metadata读过即等于验收通过。基线是已有文档绑定、前置特定语法校验、串行uncertain门禁和截图能力；增量在设计交接责任可见，不是新生成模型。

最小对照同一个可丢弃设计任务，对现版与带回执版注入脚本中途失败、超时/断网/页面切换、字体缺失和变量误绑。指标为错误目标/重复节点、漏验的视觉/结构差异、设计师修复时间、总调用/人审。应保持原生可编辑图层并用真实截图及结构对账，不能以漂亮PNG替代。

若只是读取设计实现代码，官方读取已足够，无需启用任意画布脚本；若回执维护比手动修更重或无可核差异，就停止。方向未实现、不计现有创新或潜在经济省额。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:139-166](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/index.mjs#L139-L166)

目标绑定/实际call。

<details>
<summary>查看原文（28行）</summary>

```text
        let binding=bindings.get(session.id)
        if(!binding){
          const documents=bridge.list()
          if(documents.length!==1)throw new Error(documents.length?'Multiple Figma documents are connected. Choose the target with figma_select_document using figma_status.':'No Figma document is connected. Run the paired Figma companion; use figma_setup for its manifest path.')
          binding=bindDocument(session,workspace,documents[0])
        }
        const document=bridge.list().find(doc=>doc.connectionId===binding.id)
        if(!document)throw new Error('The previously selected Figma document disconnected. Read figma_status for documentBinding and bindingMatch hints. Explicitly choose the intended document with figma_select_document; it will not switch automatically.')
        if(binding.workspace!==workspace)throw new Error('Work workspace changed; explicitly select the document again')
        if((document.featureVersion??0)<requiredQueryFeatureVersion(tool.name,args))throw new Error('The connected Figma companion does not support these query features yet. Run figma_setup, then close and rerun DSH to Figma · Local from its paired manifest; inspect figma_status and reselect the document. Legacy queries remain available.')
        const context=figmaTasks.context(session.id,workspace,document,args)
        if(tool.name==='create_session')return result(figmaTasks.create(session.id,workspace,document,args))
        if(tool.name==='use_figma')preflightScript(args.code)
        const id=binding.id
        const performanceLog=metricsFor(session)
        const started=performance.now()
        let payload=args,response,output,bridgeMetric,status='failed'
        try{
          if(tool.name==='upload_assets')payload={parentId:args.parentId,assets:await readAssets(workspace,args.files)}
          if(tool.mutation)defaultSpec.assertRead(session.id)
          dispatched=true
          if(context.task){context.task.calls++;context.task.files.add(context.fileKey)}
          response=await bridge.call(id,tool.name,payload,{signal,mutation:tool.mutation,inspect:tool.inspect&&!requiresQueryFeatures(tool.name,args),onMetric:metric=>{bridgeMetric=metric}})
          signal.throwIfAborted()
          if(tool.name==='download_assets')response.value={...response.value,files:await saveAssets(workspace,response.assets)}
          const files=tool.name==='use_figma'&&response.assets?.length?await saveAssets(workspace,response.assets):[]
          output=localResult(response)
          if(files.length){output.structuredContent.files=files;output.content.push({type:'text',text:JSON.stringify({files})})}
```

</details>

**依据 2 · 源码核查**：[lib/bridge.mjs:82-108](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/lib/bridge.mjs#L82-L108)

uncertain只由inspect结果解除基线。

<details>
<summary>查看原文（27行）</summary>

```text
    }
    if (req.url === '/result') {
      const job = doc.active
      if (!job || data.id !== job.id) return json(res, 409, { error: 'Unknown or already consumed operation' })
      doc.active = null
      if (!job.settled) {
        if (data.ok === true) {
          if (job.method === 'get_capabilities') doc.capabilities = capabilityReport(data.result?.value)
          if (job.inspect) doc.uncertain = false
          job.finish(null, data.result)
        } else {
          const safe = doc.featureVersion >= 3 && data.safeToRetryWithoutCanvasRead === true
          if (job.mutation && !safe) doc.uncertain = true
          job.finish(failure(`${String(data.error || 'Figma operation failed').slice(0, 2000)}; ${safe?'correct the error and retry':'inspect the canvas before retrying'}`,safe))
        }
      }
      json(res, 200, { accepted: true }); this.dispatch(doc); return
    }
    json(res, 404, { error: 'Unknown route' })
  }
  dispatch(doc) {
    if (doc.active || !doc.poll) return
    let job
    while ((job = doc.queue.shift())) {
      if (job.settled) continue
      if (doc.uncertain && job.mutation) { job.finish(new Error('Previous operation outcome is uncertain. Read get_metadata before another write.')); continue }
      doc.active = job; job.dispatched = true; job.dispatchedAt = performance.now()
```

</details>

**依据 3 · 源码核查**：[companion/code.js:482-507](https://github.com/Duoasa/DSH-to-Figma/blob/3bd7813850885a87c678e1f6b0d905b7aeac22d1/companion/code.js#L482-L507)

脚本中途失败/成功undo基线。

<details>
<summary>查看原文（26行）</summary>

```text
        result.metrics=this.metrics
        return result
      }catch(cause){
        // Never trust an exception property supplied by user code. Only pre-execution failures are retry-safe.
        const error=new Error(String(cause&&cause.message||cause))
        error.safeToRetryWithoutCanvasRead=method==='use_figma'&&!this.scriptEntered
        throw error
      }finally{this.clearPlaceholders?.();this.clearPlaceholders=null;this.metrics=null;this.readOptions={};this.snapshotBudget=null}
    }
    async execute(method, args = {}) {
      const f = this.figma, images = [], depth = integer(args.depth,3,0,10,'depth')
      let value, assets
      switch (method) {
        case 'use_figma': {
          if (typeof args.code !== 'string' || !args.code.trim() || args.code.length > 150000) throw new Error('Provide a script of 1–150000 characters')
          const run = new Function('figma', 'dsh', '"use strict"; return (async () => {\n' + args.code + '\n})()')
          const first=f.root.children[0]
          if(first&&f.currentPage!==first)await f.setCurrentPageAsync(first)
          assets=[]
          const facade=await this.facade(images,assets)
          this.scriptEntered=true
          value = await run(facade, { ...this.motionHelpers, color(hex) { const m = /^#?([0-9a-f]{6})$/i.exec(hex); if (!m) throw new Error('Use a six-digit hex color'); const n = parseInt(m[1],16); return { r: ((n>>16)&255)/255, g: ((n>>8)&255)/255, b: (n&255)/255 } } })
          f.commitUndo(); break
        }
        case 'get_selection': value = { page: this.snapshot(f.currentPage, 0), selection: f.currentPage.selection.map(n => this.snapshot(n, 0)) }; break
        case 'list_fonts': {
```

</details>

#### 缺口

- 变更回执是否减少设计师返工而不显著增加调用未知。
  **影响**：不是已交付设计QA或已证实需求。
  **进一步探讨**：先同任务故障对照与人工验收；原生读取足够就不扩写。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
