# dsh-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[881bd28](https://github.com/PC2005-cloud/dsh-pet/tree/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 5,648](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C648&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PC2005-cloud/dsh-pet) [![npm 30d 415,863](https://img.shields.io/static/v1?label=npm+30d&message=415%2C863&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet)
<!-- END META -->

> **功能**：在 DSH 页面或桌面显示动画宠物，联动会话工作状态，并提供宠物聊天、余额查询与语音等可选功能。

> **亮点**：把Host会话/goal轮次和工具在途规约成有来源状态并映到Web/Helper，shared handler保持业务一致；已含气泡会话跳转，见 [Q02](#research-q02)/[Q03](#research-q03)。

> **主要限制**：单条优先级隐藏其他会话，poll失败静默保留旧图；success非业务验收，HTTP依Host鉴权、Helper可降级无sandbox，自动模型/余额/语音费用隐私与退出并非只看动画就不存在，见 [Q02](#research-q02)至 [Q04](#research-q04)。

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
  - [Q01 · 当前子包是什么，陪伴和实际任务结果如何区分？](#detail-section-11)
  - [Q02 · 多会话怎样聚合到动画，能否识别等待/终态与连接中断？](#detail-section-12)
  - [Q03 · HTTP/桌面桥权限、配置持久及卸载保证到哪里？](#detail-section-13)
  - [Q04 · 聊天、余额和语音怎样真正外发，失败会不会假装成功？](#detail-section-14)
  - [Q05 · 什么具体用法值得先试，怎样停止？](#detail-section-15)
  - [Q06 · 现成能力之外还能提出什么可推翻方向？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH且偏好动画陪伴的个人用户，一只Web宠物观察脱敏会话状态；不作为唯一任务/余额验收，见 [Q01](#research-q01)。

静态桌宠、宿主原会话列表和供应商余额页。插件把注意力提示接动画，但未证明减少任务遗漏或提高效率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 动画状态 | 会话注意力提示 | 单条优先级/静默断线旧图 |
| 来源跳转 | 回原会话核对 | 已实现，非新假设 |
| 聊天 | 宠物短对话/动画名 | 模型fallback与记忆可外发 |
| 余额 | 当前provider账户快照 | 失败不伪0，非全部商已验 |
| 语音 | 文字合成/缓存 | 可联网、音频落盘 |
| Helper | 桌面宠物/托盘 | 可下载/no-sandbox回退/卸载需核pid |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失/边界 |
| --- | --- | --- |
| Node>=22.12 / DSH peers | Host/Web接线 | compatible为作者声明 |
| 素材/构建成品/React | 透明动画和界面 | 成品完整未验 |
| Host受保护本机路由 | HTTP业务访问 | 本插件handler未自行鉴权 |
| Electron/图形环境 | 可选Helper | 可下载/失败降级，可能no-sandbox |
| 模型/credentials/账号/TTS | 可选外发能力 | 失败fallback/额外隐私费用 |
| 可写用户根 | 配置/记忆/音频 | 串行不等崩溃原子持久 |

#### 步骤

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 独立profile/固定成品 | 不用真实会话凭据 |
| 限功能 | 一只Web/关余额whisper语音等 | 核无Helper及额外网络 |
| 观察 | 一轮状态与来源跳转 | 原列表/目标才是确认面 |
| 异常 | 断连/错误看旧图与日志 | 不据success继续业务 |
| 退出 | 关自动面卸载刷新、核pid | 记忆/音频/配置另保留清理 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 边界 |
| --- | --- | --- | --- |
| 首次 | 包/素材/可选Electron | 安装/兼容/开关核对 | 未测时长 |
| 持续 | 动画GPU/长轮询、可选LLM/TTS/余额 | 查状态/价格/隐私与更新 | 无已测省费省时 |
| 失败 | 已用模型费/坏记忆/旧图 | 回原列表/查磁盘与provider | 失败非未付费 |
| 退出 | Helper/配置/记忆/音频 | 停自动面/核进程/清理 | 不自动收回外发数据 |

#### 效果

| 项目 | 当前支持 | 未确认 |
| --- | --- | --- |
| 陪伴提示 | 状态/动画/气泡接线 | 真实偏好/注意力收益 |
| 会话辨识 | 同源状态与跳转已有 | 多会话遗漏率/及时性 |
| 余额 | official真实GET/结构失败 | 全provider/即时与现金决策 |
| 聊天/语音 | stream/TTS/缓存真实调用 | 费用、质量、无隐私外溢 |

> **思考**：单条优先级隐藏其他会话，poll失败静默保留旧图；success非业务验收，HTTP依Host鉴权、Helper可降级无sandbox，自动模型/余额/语音费用隐私与退出并非只看动画就不存在，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把Host会话/goal轮次和工具在途规约成有来源状态并映到Web/Helper，shared handler保持业务一致；已含气泡会话跳转，见 [Q02](#research-q02)/[Q03](#research-q03)。

规约goal/工具在途、长轮询counter与config队列清晰；必须区分单条聚合/全部会话、pipe业务一致/权限一致、timer停止/请求取消与持久原子性，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

单条优先级隐藏其他会话，poll失败静默保留旧图；success非业务验收，HTTP依Host鉴权、Helper可降级无sandbox，自动模型/余额/语音费用隐私与退出并非只看动画就不存在，见 [Q02](#research-q02)至 [Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有DSH的动画爱好者只开一只Web workStatus，关余额/whisper/语音/聊天扩展并核没有Helper；状态不符/额外调用就停回原列表，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生子包0.4.5/source，定向核会话状态到Web长轮询、HTTP/pipe/Helper卸载与代表聊天、official余额及Edge合成。未运行/素材和发行包/Host认证全链/独立模式/全部provider、API与第三方扩展未全审，仅建议关自动面一只Web小试。

- 已检查：作者 README、包清单、源码路径 dsh-pet/README.md、dsh-pet/cordis.patch.yml、dsh-pet/package.json、dsh-pet/src/client/app.ts、dsh-pet/src/client/pet/multi.ts、dsh-pet/src/client/pet/state-poll.ts、dsh-pet/src/host/balance/index.ts、dsh-pet/src/host/balance/internal.ts、dsh-pet/src/host/balance/providers/deepseek-official.ts、dsh-pet/src/host/chat.ts、dsh-pet/src/host/config/save.ts、dsh-pet/src/host/helper/child.ts、dsh-pet/src/host/index.ts、dsh-pet/src/host/plugin/balance-poll.ts、dsh-pet/src/host/plugin/chat-memory.ts、dsh-pet/src/host/plugin/desktop/spawn.ts、dsh-pet/src/host/plugin/http-route.ts、dsh-pet/src/host/plugin/lifecycle.ts、dsh-pet/src/host/plugin/loops.ts、dsh-pet/src/host/plugin/session-watch.ts、dsh-pet/src/host/plugin/work-status-bridge.ts、dsh-pet/src/host/routes/state.ts、dsh-pet/src/host/routes/voice.ts、dsh-pet/src/host/voice/edge.ts、dsh-pet/src/host/voice/speak.ts、dsh-pet/src/host/work-status.ts 及固定范围 inventory；组件：dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：子包package/patch、Host/app slots、session-watch/work-status/bridge→state route→poll/multi、HTTP/config queue、desktop spawn/pipe/child stop与sandbox fallback/lifecycle、chat/model fallback/记忆写、余额dispatch/official HTTP、voice route/queue/Edge SDK。未执行/全Host准入/独立模式/所有API权限/素材发行完整性/所有外部provider与第三方memory/Helper renderer。
- 下一步：- 下一步固定成品/Host一只Web宠物，脱敏会话核档位来源/断线/退出和网络。
- 外部能力另逐项许可，记实际provider/usage/文件结果，未做真实请求。
- 传输新鲜度需先排除已有全局提示足够，再做同任务断连对照。

**分析版本**

- **仓库**：[PC2005-cloud/dsh-pet](https://github.com/PC2005-cloud/dsh-pet)
- **版本号**：0.4.5（[固定提交 881bd28](https://github.com/PC2005-cloud/dsh-pet/tree/881bd2811ee151f774303b4aba5eedb2ec5e996c)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

比较现有全局提示和宠物级传输新鲜度，依据成功响应而非叶子变化判断断线，误认不降或干扰上升则放弃；来源跳转已有不再提，见 [Q06](#research-q06)。

- 下一步固定成品/Host一只Web宠物，脱敏会话核档位来源/断线/退出和网络。
- 外部能力另逐项许可，记实际provider/usage/文件结果，未做真实请求。
- 传输新鲜度需先排除已有全局提示足够，再做同任务断连对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 34 | 6478 | 4644 | 1681 | — |
| .md | source | 1 | 7 | — | — | 65 |
| .mjs | source | 13 | 950 | 658 | 240 | — |
| .mjs | test | 5 | 777 | 691 | 51 | — |
| .md | test | 1 | 15 | — | — | 183 |
| .js | test | 1 | 17 | 16 | 0 | — |
| .ts | test | 200 | 33987 | 27952 | 2921 | — |
| .ts | source | 391 | 47612 | 32082 | 12573 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 140](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=140&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 138](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=138&color=737b86&logo=github)](https://github.com/PC2005-cloud/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核原生子包会话到动画的真实接线、聚合/断线/生命周期与代表聊天余额语音外发，限定未知权限和成品。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 当前子包是什么，陪伴和实际任务结果如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

0.4.5 dsh-pet子包原生Host/Web bundle，另有standalone CLI和Electron Helper，不把仓库根/独立模式与插件模式混称。真实Host入口注入webServer/model/credentials/llm/commands/connection，组装会话观察、余额、聊天记忆、语音、待办和Helper；Web实际注册overlay与设置页。面向偏好动画陪伴、想从工作状态气泡感知DSH会话的个人用户，参照静态桌宠和原会话列表，增量是事件驱动状态和共享请求实现，不是替用户完成任务或经验证提高效率。

README素材动画数量是作者描述，未按已构建资源逐个验；本轮仅审状态与选定聊天/余额/语音/生命周期代表链，不称646源码文件全部审计。包写的0.2.1-rc.3/0.2.2-alpha.2/0.2.2-rc.1 compatible为作者兼容声明，不是本轮运行通过。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:1-6](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/package.json#L1-L6)

子包版本和自述。

```text
{
  "name": "dsh-pet",
  "version": "0.4.5",
  "description": "吃白饭的蓝色大肥鱼，赖在 DeepSeek Harness 里不走了。平时爱玩魔方、爱吃各种零食、偶尔打个盹，闲不住就在桌面上溜达两圈，被你拖来甩去也照旧赖着；你忙起来它跟着忙前忙后，也会帮你打理余额钱包，闲下来爱碎碎念，还乐意陪你唠两句。",
  "icon": "assets/logo.png",
  "keywords": [
```

**依据 2 · 源码核查**：[dsh-pet/package.json:45-66](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/package.json#L45-L66)

Host/client及standalone导出。

<details>
<summary>查看原文（22行）</summary>

```text
  "bin": {
    "dsh-pet-standalone": "lib/standalone.js"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "assets/webm",
    "runtime/electron-helper",
    "assets/fonts",
```

</details>

**依据 3 · 源码核查**：[dsh-pet/package.json:111-142](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/package.json#L111-L142)

bundle/Web与兼容/peer声明。

<details>
<summary>查看原文（32行）</summary>

```text
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.3": "compatible",
        "0.2.2-alpha.2": "compatible",
        "0.2.2-rc.1": "compatible"
      }
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 4 · 源码核查**：[dsh-pet/cordis.patch.yml:23-25](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/cordis.patch.yml#L23-L25)

实际插件行。

```text
- insert:
    - id: dsh-pet
      name: 'dsh-pet'             # 模块名：解析到 lib/index.js
```

**依据 5 · 源码核查**：[dsh-pet/src/host/index.ts:29-37](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/index.ts#L29-L37)

Host名字与必需服务。

```text
/** 插件行 id（与 cordis.patch.yml 一致） */
export const name = 'pet';
/** 需要注入的服务：webServer（路由）+ agentDefaultModel（当前服务商）+ credentials（凭证）+ llm（对话模型调用）+ commands（/balance 斜杠命令）+ connection（桌面 Helper「打开 AI 设置」用的已鉴权站点 URL） */
export const inject = ['webServer', 'agentDefaultModel', 'credentials', 'llm', 'commands', 'connection'];

/** 宿主插件主体：注册 `/dsh-pet-7340` 前缀路由与斜杠命令（/balance /pet /chat）；ctx 暂用 any（peer 类型包本地不可解析）。 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- DSH 注入的 ctx（webServer/locale 等 service 无静态类型）
export function apply(ctx: any): void {
  const setup = createHostSetup(ctx);
```

**依据 6 · 源码核查**：[dsh-pet/src/host/index.ts:79-125](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/index.ts#L79-L125)

真实余额/聊天/语音/待办/路由装配。

<details>
<summary>查看原文（47行）</summary>

```text
  const balancePoll = createBalancePoll({ ctx, configPaths, getActivePetId, log, state, standaloneAiBalance });
  const { effectivePetList, balancePeriodSec, whisperPeriodSec, refreshBalance, resolveActivePetId, petDisplayName } =
    balancePoll;

  // 待办清单：一份用户级数据（不分宠物），落盘在插件数据根；提醒循环与 /todos 路由共用同一个实例。
  const todos = new TodoStore({ file: join(userRoot, TODO_FILE_NAME), log });

  const desktopHelper = createDesktopHelper({
    ctx,
    configPaths,
    effectivePetList,
    log,
    reportDownload,
    thumbUserRoot,
    // 惰性取用：handlePetRoute 在下方装配，Helper 只在启动/收请求时才真正调用它
    getHandlePetRoute: () => httpRoute.handlePetRoute,
  });
  const { startHelper, stopHelper, markDisposed } = desktopHelper;

  const deps: PetRouteDeps = {
    ...setup,
    ...petLookup,
    ...workStatusBridge,
    ...chatMemory,
    ...balancePoll,
    ...desktopHelper,
    ...sessionNotify,
    ctx,
    todos,
    // 语音合成：缓存落 userRoot，失败只留日志，不打断宿主
    voice: createVoiceService({ userRoot, log }),
    // 语音识别：能力来自宿主（DSH 的 speechToText），没启用时服务自己在调用时回 unsupported
    speech: createHearService({ speechToText: () => setup.optionalService('speechToText') }),
  };
  const httpRoute = createHttpRoute(deps);
  registerHttpRoute(ctx, httpRoute.handlePetRoute);

  registerSessionWatch({
    ctx,
    cancelTerminalCleanup,
    lastTodoText,
    lastReplyText,
    notifyActivityTimers,
    publishWorkStatus,
    pushNotifyFrame,
    scheduleCompletionNotify,
    scheduleTerminalCleanup,
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/client/app.ts:178-194](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/app.ts#L178-L194)

真正overlay与设置slot。

<details>
<summary>查看原文（17行）</summary>

```text

      // 宠物 overlay：容器渲染多个 PetCard。
      ctx.slots.inject('shell.overlay', function* () {
        yield ctx.slots.register({ name: 'shell.overlay', id: 'pet', order: 1000 }, () => h(PetMulti, {}));
      });

      // 设置页「桌宠配置」：大小、位置、模型，保存即时生效。
      // useRef 供「AI 模型」下拉的浮层定位与外部点击判定使用。
      const PetConfigSection = makePetConfigSection({ h, useState, useEffect, useRef, useCallback, t }, ctx);
      ctx.slots.inject('settings.section', function* () {
        yield ctx.slots.register(
          { name: 'settings.section', id: 'pet-config', order: 30, label: () => t('nav'), inject: () => ({ t }) },
          PetConfigSection,
        );
      });

      // 快捷键独立注册：不挂在侧栏注册里——侧栏服务缺失时侧栏没了，快捷键不该跟着没。
```

</details>

**依据 8 · 作者声明**：[dsh-pet/README.md:1-7](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/README.md#L1-L7)

作者动画桌宠/素材许可描述，不作数量验收。

```text
# dsh-pet 🐾

一只住在 DeepSeek Harness 里的桌面宠物，一百余个透明动画，可多开、能上桌面。

安装与完整文档：**<https://github.com/PC2005-cloud/dsh-pet>**

许可：代码 MIT；素材禁止商用；二创在公开渠道须署名（同上链接）。
```

#### 缺口

- 无真实用户需求强度、任务效率、发布资源和Host兼容验收。
  **影响**：只支持有偏好的用户低风险观察，不把动画或声明当工作成果。
  **进一步探讨**：固定成品/Host与一个脱敏会话，逐状态核动画/气泡和原列表，不比较动画素材数量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多会话怎样聚合到动画，能否识别等待/终态与连接中断？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

session-watch按Host session.header.id/id记账，未知缺id合入unknown；turn/start、tool/call/result、approval/asked、turn/end规约成档位。普通completed映success，goal续跑中间轮只result，goal收尾依据模型update_goal arguments动作标记而非外部验收；max-tokens/timeout/error映error，aborted/未知清该会话，终态短暂后清理。tool并发callId表未清时强制working，防先回结果就庆祝；仍依赖Host事件完整/匹配。

WorkStatusStore按waiting>error>working>thinking>result>success取一个条目，同档只比seq（跨会话seq不必代表墙钟最新），state/task/sessionId同源；不显示全部活跃会话。work bridge仅working→result在5秒窗内延迟补写，反向和终态不压，外部API槽sessionId改null；存在最多这类呈现延迟，不是精确即时监控。

/state只读内存，可counter/since长轮询，有变化/超时返回；HTTP断开cancel等待。Web runStatePoll成功更新叶子，失败静默退避且不清旧快照，卸载isAlive false后不再分发，不是服务断开就显示真实idle。multi把workStatus传有开关宠物并已有onFocusSession跳转，来源会话/可点气泡已实现，不可重提为新功能。快照显示success只表规约终态，不能证明外部任务真的成功。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:155-177](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/session-watch.ts#L155-L177)

实际Host会话归属与todo详情。

<details>
<summary>查看原文（23行）</summary>

```text
    const dispose = ctx.on('session/event', (session: unknown, event: unknown) => {
      const type = (event as { type?: string } | null)?.type;
      if (!type) return;
      const sessionId = String(
        (session as { id?: unknown; header?: { id?: unknown } } | null)?.header?.id ??
          (session as { id?: unknown } | null)?.id ??
          'unknown',
      );
      if (type === 'todo/write') {
        // 任务详情文案只写该会话的条目（state/task 同源，不可能串会话）。会话没有活动条目
        // （已空闲/已清理）→ 不动：不会被展示，写进去只会成为一条幽灵文案。
        // 清单里再无 in_progress/pending 时返回 null，气泡回落到档位文案。
        const text = currentTaskFromTodo(event as { data?: { todos?: Array<{ status?: string; content?: string }> } });
        // 缓存无条件更新：工具跑完要靠它把气泡恢复回来（见下方 tool/call 的接线）
        lastTodoText.set(sessionId, text);
        // 工具正在执行时不覆盖气泡：「修改 index.ts」比清单里那句更能说明此刻在动什么
        if ((toolsInFlight.get(sessionId)?.size ?? 0) > 0) return;
        if (workStatus.has(sessionId)) {
          workStatus.setTask(sessionId, text);
          publishWorkStatus(); // 任务文案变化也要写 S（气泡内容靠它更新）
        }
        return;
      }
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/work-status.ts:23-28](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/work-status.ts#L23-L28)

普通终态映射。

```text
function turnEndState(kind: string): HostWorkStatusState | null {
  if (kind === 'completed') return 'success';
  if (kind === 'error' || kind === 'max-tokens' || kind === 'timeout') return 'error';
  if (kind === 'blocked') return 'waiting';
  return null;
}
```

**依据 3 · 源码核查**：[dsh-pet/src/host/work-status.ts:45-97](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/work-status.ts#L45-L97)

goal动作/完成规约和事件映射。

<details>
<summary>查看原文（53行）</summary>

```text
export function goalUpdateAction(args: string): 'complete' | 'blocked' | null {
  try {
    const o = JSON.parse(args) as { action?: unknown } | null;
    const action = String(o?.action ?? '');
    if (action === 'complete' || action === 'blocked') return action;
  } catch {
    /* 非法 JSON：按未收尾处理 */
  }
  return null;
}

/**
 * turn/end completed 的终局判定：非 goal 轮直接 success；自动续跑轮的中间轮 → result（本轮完成
 * 不等于整个任务完成，不庆祝）；收尾轮 complete → success，blocked → error（目标被阻塞结束，
 * 诚实地表沮丧而非庆祝）。
 */
export function completedState(turn: WorkStatusTurnContext | undefined): HostWorkStatusState {
  if (!turn?.goalRound) return 'success';
  if (turn.closing === 'blocked') return 'error';
  if (turn.closing === 'complete') return 'success';
  return 'result';
}

/** 从会话事件压缩出工作状态；无变化 / 不关心返回 null。
 *  turn 为当前回合上下文（goal 续跑轮判定），只影响 turn/end completed 的终局语义。 */
export function reduceWorkStatus(
  event: {
    type?: string;
    data?: Record<string, unknown> & { reason?: { kind?: string } };
  },
  turn?: WorkStatusTurnContext,
): HostWorkStatusState | null {
  switch (event?.type) {
    case 'turn/start':
      return 'thinking';
    case 'tool/call': {
      // 问用户问题的工具（选择题弹窗）＝ 等用户答复，不是普通干活
      if (String(event?.data?.name ?? '') === USER_QUESTION_TOOL) return 'waiting';
      return 'working';
    }
    case 'tool/result':
      return 'result';
    case 'approval/asked':
      return 'waiting';
    case 'turn/end': {
      // completed→success、错误系→error、blocked→waiting；其余（aborted 等）→null＝清该会话回空闲
      const reason = turnEndState(String(event?.data?.reason?.kind ?? ''));
      // 本轮完成是否等于整个任务完成交给 completedState（goal 续跑轮的中间轮不庆祝）
      if (reason === 'success') return completedState(turn);
      return reason;
    }
    default:
      return null; // todo/write 等：不切动画（详情文案由调用方另行处理）
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/session-watch.ts:210-259](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/session-watch.ts#L210-L259)

aborted清理/并发工具与终态清理。

<details>
<summary>查看原文（50行）</summary>

```text
      }
      let next = reduceWorkStatus(
        event as { type?: string; data?: Record<string, unknown> & { reason?: { kind?: string } } },
        turnFlags.get(sessionId),
      );
      if (!next) {
        // turn/end 的 null（aborted / 未知 kind）＝该会话回合已结束：清掉会话状态，让展示回到空闲或
        // 落到其他活跃会话，防止回合被打断后永久卡在上一档；其他事件的 null 是「不关心」，忽略。
        if (type === 'turn/end') {
          turnFlags.delete(sessionId);
          cancelTerminalCleanup(sessionId); // 条目都要清了，别留一个到点后无事可做的定时器
          lastTodoText.delete(sessionId); // 按会话记的两份缓存跟着会话一起消失（防泄漏）
          toolsInFlight.delete(sessionId);
          workStatus.clear(sessionId); // 条目连同任务详情文案一起消失（clear 内部会重算展示）
          publishWorkStatus(); // 回合被打断 → 回到空闲：前端据此收起常驻气泡
        }
        return;
      }
      const seq = Number((event as { seq?: unknown }).seq ?? 0);
      // 工具详情（「修改 index.ts」这类具体描述）：比通用档位文案有用得多，workStatusEnabled
      // 的宠物直接把它当气泡文本。
      // 必须在 setState 之后写：setTask 要求会话条目已存在，而条目正是 setState 建出来的——
      // 顺序反了这一句会被静默丢弃（不报错，最难查的那种）。
      const detail =
        type === 'tool/call' ? toolDetailFromEvent(event as { data?: { name?: unknown; arguments?: unknown } }) : null;
      const outcome = trackToolEvent(toolsInFlight, sessionId, {
        type,
        callId: toolCallIdOf(event),
        detail,
        lastTodo: lastTodoText.get(sessionId) ?? null,
      });
      // 还有操作没完就把档位压回 working：结果档与「仍在执行」的文案同时出现会自相矛盾。
      if (outcome?.keepWorking) next = 'working';
      const changed = workStatus.setState(sessionId, next, seq);
      if (outcome?.task !== undefined) workStatus.setTask(sessionId, outcome.task);
      publishWorkStatus(); // 档位或文案变了 → 写 S（内容没变时它自己会短路，不产生多余写入）
      // 同会话同状态不重复更新（防刷屏）：写已经落定，这里只负责跳过终态清理的重排
      if (!changed) return;
      // 终态只展示短暂窗口后自动清理：陈旧完成态不再浮上来（Bug 3 的一环，顺带缓解 Bug 2 残留）。
      // 回到非终态则取消那次待执行的清理——否则它到点时会话已非终态，既不清也不重排，
      // 条目（连同旧任务文案）就永久留下了。
      if (next === 'success' || next === 'error') scheduleTerminalCleanup(sessionId);
      else cancelTerminalCleanup(sessionId);
    });
    return () => {
      dispose();
      for (const t of terminalTimers.values()) clearTimeout(t);
      terminalTimers.clear();
    };
  }, 'dsh-pet: work-status session events');
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/work-status.ts:130-174](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/work-status.ts#L130-L174)

真实单条优先级/seq选择和来源。

<details>
<summary>查看原文（45行）</summary>

```text
/** 工作状态快照（= /state 里 sections.workStatus 的 data）：state 为主状态；task 为 todo 详情（可 null）。 */
export interface WorkStatusSnapshot {
  state: HostWorkStatusState | null; // null = 尚无会话活动（空闲）
  task: string | null; // 当前任务详情（todo/write 提供，可 null）
  /** 当前展示条目所属会话；空闲或外部槽（`api`）时为 null，客户端据此决定气泡能不能点。 */
  sessionId: string | null;
  ts: number; // 最近一次变化的时间戳（轮询侧据此检测变化）
}

/** 每会话聚合条目。 */
export interface SessionWorkEntry {
  /** 该会话当前档位。 */
  state: HostWorkStatusState;
  /** 该会话最近事件的序号，同档位时按它取最近。 */
  seq: number;
  /** 任务详情文案；null = 该会话没有清单。 */
  task: string | null;
  /** 该条目所属会话；`pickDisplayed` 只遍历 values，所以带着它才能知道展示的是哪一条。 */
  sessionId: string;
}

/** 展示优先级：waiting > error > working > thinking > result > success。
 *  result 高于 success：任何会话的进行中过渡态都不被别处已完成态压过，防中途庆祝；同档按最近更新优先。 */
export const WORK_STATUS_PRIORITY: Record<HostWorkStatusState, number> = {
  waiting: 60,
  error: 50,
  working: 40,
  thinking: 30,
  result: 25,
  success: 20,
};

/** 展示用条目：所有会话里优先级最高者（同优先级取 seq 更大者）；无会话返回 undefined。 */
export function pickDisplayed(entries: Iterable<SessionWorkEntry>): SessionWorkEntry | undefined {
  let best: SessionWorkEntry | undefined;
  for (const entry of entries) {
    if (
      !best ||
      WORK_STATUS_PRIORITY[entry.state] > WORK_STATUS_PRIORITY[best.state] ||
      (WORK_STATUS_PRIORITY[entry.state] === WORK_STATUS_PRIORITY[best.state] && entry.seq > best.seq)
    ) {
      best = entry;
    }
  }
  return best;
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/work-status-bridge.ts:16-62](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/work-status-bridge.ts#L16-L62)

5秒方向延迟及来源发布。

<details>
<summary>查看原文（47行）</summary>

```text
export function createWorkStatusBridge(deps: WorkStatusBridgeInput) {
  const { state, workStatus, EXTERNAL_WORK_SESSION } = deps;
  // 工作状态快照写进 S：内容真的变了才写（每次写都推进 counter，前端据此重播档位动画）。
  // 只压「距上次写入不足 WORK_STATE_GAP_MS 的 working → result」——工具秒回时会来回切十几次，
  // 每切一次前端就把片段从第 0 帧重播；反向不压（开工迟到比多换一次片更糟），终态不压。
  const WORK_STATE_GAP_MS = 5000;

  let publishedWork = '\u0000';

  let publishedState: string | null = null;

  let publishedWorkAt = 0;

  let workFlushTimer: ReturnType<typeof setTimeout> | null = null;

  const publishWorkStatus = (): void => {
    const snap = workStatus.snapshot();
    // 会话也算内容：同档同文案换了会话，页面必须知道，否则点气泡会跳到上一条会话。
    const key = String(snap.state) + '\u0000' + String(snap.task) + '\u0000' + String(snap.sessionId ?? '');
    if (key === publishedWork) return;
    // 抖动判定：只压 working → result 这一个方向（同档只换文案不算抖动，照常立即写；
    // 反向 result → working 立即写）
    const busyFlip = publishedState === 'working' && snap.state === 'result';
    const wait = WORK_STATE_GAP_MS - (Date.now() - publishedWorkAt);
    if (busyFlip && wait > 0) {
      // 整条不写（档位与文案一起压住）：到点再取最新快照补写
      // （不要在这里缓存 snap——期间可能又变了）
      workFlushTimer ??= setTimeout(() => {
        workFlushTimer = null;
        publishWorkStatus();
      }, wait);
      return;
    }
    if (workFlushTimer !== null) {
      clearTimeout(workFlushTimer);
      workFlushTimer = null;
    }
    publishedWork = key;
    publishedState = snap.state;
    publishedWorkAt = Date.now();
    // 外部槽（`api`）不是真实 DSH 会话：这里写成 null，客户端才不会把气泡做成一个点了没反应的入口。
    const sessionId = snap.sessionId === null || snap.sessionId === EXTERNAL_WORK_SESSION ? null : snap.sessionId;
    state.writeSection('workStatus', { state: snap.state, task: snap.task, sessionId });
  };

  /** 停掉挂起的补写定时器（插件卸载时调用）。 */
  const stopWorkStatusFlush = (): void => {
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/routes/state.ts:66-117](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/routes/state.ts#L66-L117)

实际counter长轮询/断开取消。

<details>
<summary>查看原文（52行）</summary>

```text
  // 不带 = 立刻返回全量。等待语义与 GET /playback/{id} 的 wait 同一套（上限同值、断线同一个 signal）。
  if (rest === 'state') {
    if (method !== 'GET') return methodNotAllowed();
    const headers = { 'cache-control': 'no-cache, no-store' };
    const parsed = parseStateWaitQuery(url.searchParams.get('since'), url.searchParams.get('timeout'));
    // since/timeout 是业务参数：给错了是调用方的问题，但仍属「请求已进处理器」
    if (parsed.kind === 'error') return failResult('bad-request', parsed.error);
    const current = state.read();
    // 两者都没传 → 立刻返回；已经有新东西 → 也立刻返回（别白等一整个 timeout）。
    // timeout=0 走挂起分支，下一拍就醒，等价「立刻返回」，这里不特判。
    if (parsed.kind === 'none' || current.counter !== parsed.since) {
      return okResult(current, headers);
    }
    const since = parsed.since;
    return await new Promise<RouteResult>((resolveWait) => {
      let settled = false;
      /** 收尾：只认第一次（唤醒 / 超时 / 取消 / 调用方断开 都可能先后到达） */
      const settle = (result: RouteResult): void => {
        if (settled) return;
        settled = true;
        resolveWait(result);
      };
      // 唤醒时才 read()：store 保证「叶子已写定」之后才叫醒，所以这里拿到的一定是新状态
      const cancel = state.wait({
        since,
        timeoutMs: parsed.timeoutMs,
        onWake: () => settle(okResult(state.read(), headers)),
      });
      // 调用方断开：取消等待者（清掉它的超时定时器），以「无需应答」收尾。
      const onAbort = (): void => {
        cancel();
        settle({ kind: 'none' });
      };
      if (signal?.aborted) {
        onAbort();
        return;
      }
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  }

  // 外部写入工作状态：POST 设置固定外部槽 `api` 的档位（task 省略 = 保留，null = 清空），
  // DELETE 清空回空闲（幂等）。只解决「外部程序把状态告诉桌宠」，不做多写者仲裁/租约/会话管理；
  // 外部槽与会话一起参与现有优先级（waiting > error > working > thinking > result > success）。
  if (rest === 'work-status') {
    if (method === 'DELETE') {
      if (workStatus.clear(EXTERNAL_WORK_SESSION)) publishWorkStatus();
      return { kind: 'text', status: 204, body: '' };
    }
    if (method !== 'POST') return methodNotAllowed();
    if (Buffer.byteLength(body ?? '', 'utf8') > 8 * 1024) return payloadTooLarge('body too large');
    let parsed: unknown;
```

</details>

**依据 8 · 源码核查**：[dsh-pet/src/client/pet/state-poll.ts:30-53](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/state-poll.ts#L30-L53)

成功分发/失败退避/卸载检查。

<details>
<summary>查看原文（24行）</summary>

```text
 * @returns 无返回值；循环结束后自然收尾。
 */
export async function runStatePoll(deps: StatePollDeps): Promise<void> {
  /** 宿主是否支持长轮询：首拍带 counter 就是支持。 */
  let longPoll = false;
  /** 上次拿到的 counter，作为长轮询的 since。 */
  let since: number | undefined;
  while (deps.isAlive()) {
    let state: PollState | null = null;
    try {
      state = await deps.fetch(longPoll && since !== undefined ? { since, timeoutMs: deps.waitMs } : undefined);
    } catch {
      /* 轻量轮询失败静默，下一拍再试。 */
    }
    if (!deps.isAlive()) return;
    if (state !== null) {
      longPoll = typeof state.counter === 'number';
      if (longPoll && typeof state.counter === 'number') since = state.counter;
      deps.onState(state);
    }
    // 长轮询命中或首拉时立刻再请求；失败或老宿主则退避一个间隔。
    if (state === null || !longPoll) await sleep(deps.fallbackMs);
  }
}
```

</details>

**依据 9 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:221-229](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/multi.ts#L221-L229)

叶子更新React状态。

```text
          case 'workStatus': {
            const snap = readWorkStatus(leaf);
            if (snap) {
              setWorkStatus(snap);
              setWorkStatusTick((t) => t + 1); // 任何变化都触发，含回到空闲。
            }
            return;
          }
          case 'notify':
```

**依据 10 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:332-344](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/multi.ts#L332-L344)

实际poll接线。

<details>
<summary>查看原文（13行）</summary>

```text
      void runStatePoll({
        fetch: (options) =>
          fetchState(
            undefined,
            options === undefined ? undefined : { since: options.since, timeoutMs: options.timeoutMs },
          ),
        onState: applyState,
        waitMs: STATE_WAIT_MS,
        fallbackMs: STATE_FALLBACK_MS,
        isAlive: () => alive,
      });
      return () => {
        alive = false;
```

</details>

**依据 11 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:350-363](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/multi.ts#L350-L363)

按开关传状态与来源跳转。

<details>
<summary>查看原文（14行）</summary>

```text
          // 未启用工作状态联动：在分发处就断掉，下游（动画恢复、播完判定、气泡）不必各判一次。
          const workOn = p.workStatusEnabled;
          return h(Card, {
            key: p.id,
            cfg: p as RuntimePet,
            balance,
            balanceTick,
            balanceNoticeTick,
            balanceManual,
            workStatus: workOn ? workStatus : null,
            workStatusTick: workOn ? workStatusTick : 0,
            onFocusSession: jumpToSession,
            say: sayRef.current[p.id],
            sayTick,
```

</details>

#### 缺口

- 未运行多会话乱序/丢事件/Host版本及动画素材；未全审全局已有连接提示。
  **影响**：动画可能延迟或保留旧状态，不能代替原生列表和目标核验。
  **进一步探讨**：两会话不同seq同时waiting/working，断开Host后核气泡/跳转/重连，记录误识别与原列表差异。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · HTTP/桌面桥权限、配置持久及卸载保证到哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

HTTP prefix真实读取body并把res close变signal，调用唯一handlePetRoute；该函数对config及pet-display/pet-config读改写用进程内串行queue，拒绝后也继续后续队列。桌面Helper通过child pipe复用同函数且不传取消signal，业务复用不是两端相同鉴权。prefix本层未见connection.requestRejection/Origin认证，本项未绑定具体Host路由准入实现，必须依赖已受保护的本机DSH服务；不把路径随机后缀或桌面pipe称用户授权，也不称这是已利用漏洞。独立模式request-security未全审，本文不推荐直接公网暴露或standalone。

配置串行只是防同进程交错；同步默认配置路径直接writeFileSync，聊天记忆mkdir/writeFile也非显式temp+rename，磁盘失败/截断/多进程不是由queue消除。chat在模型完成后先await记忆写入再写动画/气泡，故请求失败可能已付模型费，而没有最终气泡；readMemory读失败/坏JSON可回空并记录，不能承诺坏盘自动无损恢复。

Helper仅需要desktop时启动，web/none且无既有托盘跳过，无图形环境跳过，缺Electron可下载；启动失败浏览器仍可用。退出markDisposed、清补写/锁/挂起wait，再stopHelper；实际stop发kill便返回，不等exit，重配另有stopAndWait。子进程有特定sandbox初始化失败降级--no-sandbox重试路径（显式DSH_PET_GPU_SANDBOX=1可阻降级），所以不笼统称桌面Helper始终沙箱保护。本轮推荐纯Web显示避免引入该进程，仍需核无helper和无不期望外发；卸载清定时器不证明已发模型/第三方请求都取消或数据清除。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:29-61](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/http-route.ts#L29-L61)

唯一业务函数和config队列真实实现。

<details>
<summary>查看原文（33行）</summary>

```text
export function createHttpRoute(deps: PetRouteDeps): { handlePetRoute: HttpRouteHandler } {
  // 配置请求覆盖完整读改写：下一次更新必须读取前一次完成后的配置。
  // GET /config 同样排队，避免写入尚未完成时读到空文件而回退内置默认。
  let configQueue: Promise<void> = Promise.resolve();

  /** 单次业务路由（HTTP 落盘与桌面 Helper 管道共用同一份实现）：输入 rawUrl + method + body 文本，
   *  返回 RouteResult，消费方各自落盘——业务逻辑只有一份，两端天然一致。
   *  signal 可选：调用方断开时中止挂起等待（只有 /playback 的 wait 分支会用到；管道侧不传）。 */
  const handlePetRoute = async (
    rawUrl: string,
    method: string,
    body?: string,
    signal?: AbortSignal,
  ): Promise<RouteResult> => {
    const url = new URL(rawUrl, 'http://localhost');
    const rest = decodeURIComponent(url.pathname.slice(ROUTE_SEGMENT.length + 1));
    const run = (): Promise<RouteResult> => dispatchPetRoute(url, rest, method, body, signal);
    // 写配置的三条路径（PUT/POST /config、POST /pet-display、POST /pet-config）都是「读当前配置
    // → 白名单重建整段 pets → 写盘」，并发交错会互相覆盖，必须共用一条串行队列；
    // GET /config 同样排队，避免写入尚未完成时读到空文件而回退内置默认。
    const isConfigQueue = rest === 'config' || ((rest === 'pet-display' || rest === 'pet-config') && method === 'POST');
    if (isConfigQueue) {
      const pending = configQueue.then(run, run);
      configQueue = pending.then(
        () => undefined,
        () => undefined,
      );
      return pending;
    }
    return run();
  };

  // 路由层依赖表：显式传参取代闭包捕获，各领域模块因此可独立演进（见 ./routes/index.ts）
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/http-route.ts:72-102](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/http-route.ts#L72-L102)

prefix/body/close signal实际路由，无本层认证。

<details>
<summary>查看原文（31行）</summary>

```text
export function registerHttpRoute(ctx: HostContext, handlePetRoute: HttpRouteHandler): void {
  ctx.effect(
    () =>
      ctx.webServer.register({
        kind: 'prefix',
        path: ROUTE_SEGMENT,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
          // 挂起等待（/playback?wait=）期间调用方可能提前断开：据此中止等待，
          // 否则那个等待者要一直留到超时才回收。'close' 在正常应答后也会触发，但那时监听已摘掉。
          const abort = new AbortController();
          const onClose = (): void => abort.abort();
          res.on('close', onClose);
          try {
            // PATCH 也带体（待办的部分更新）；GET / DELETE 不读，避免无谓地等一个不会来的结束事件。
            const readsBody = req.method === 'PUT' || req.method === 'POST' || req.method === 'PATCH';
            const body = readsBody ? await readBody(req) : undefined;
            const result = await handlePetRoute(req.url ?? '/', req.method ?? 'GET', body, abort.signal);
            res.off('close', onClose);
            if (result.kind === 'json') sendJson(res, result.status, result.obj, result.headers);
            else if (result.kind === 'text') sendText(res, result.status, result.body);
            else if (result.kind === 'none') {
              /* 调用方已断开：不再写（写了会抛） */
            } else sendFile(req, res, result.file, result.contentType); // 非 async：流在 open 后自己 pipe，错误内部收口
          } catch (e) {
            res.off('close', onClose);
            // 连接已断（挂起等待被中止后也可能撞上）→ 不再写，避免二次抛错
            if (!res.destroyed && !res.writableEnded) {
              // 请求体超限与客户端中断是用户侧问题，不能报成 500；断连时连响应都写不出去。
              const code = (e as { code?: string }).code;
              if (code === 'body-too-large')
                sendJson(res, 413, failureBody('payload-too-large', 'request body too large'));
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:114-144](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/desktop/spawn.ts#L114-L144)

Helper认证站点与pipe调用同handler且无signal。

<details>
<summary>查看原文（31行）</summary>

```text
    // 的签名 Cookie，其余请求一律 401，故传 origin 而不是另拼地址。令牌等价登录态：只经子进程环境变量
    // 递到 helper 内存，不落盘、不进日志。
    const siteUrl = ctx.connection.authenticatedUrl(origin);
    // 桌面渲染端也从同一份 handlePetRoute 拿成品配置（每只宠物一个局部小窗口；经管道，不走 HTTP——
    // DSH Desktop 2.0.3+ 会拦插件自拉进程的裸 HTTP 请求，浏览器访问闸门只放行带令牌的请求）
    const configUrl = `${origin}${ROUTE_SEGMENT}/config`;
    helper = new HelperProcess(
      {
        electronPath,
        env: {
          DSH_PET_CONFIG_URL: configUrl,
          // 已鉴权站点 URL（含本进程启动令牌）：只供 helper 的「打开」首项使用，任何日志都不许出现它
          DSH_PET_SITE_URL: siteUrl,
          // 宿主形态决定菜单首项的去向与文案（同名「打开」项，三种形态三种语义）：
          //   desktop    = DSH 桌面应用 → 唤起应用主窗口（helper 走 dsh://open）
          //   standalone = 独立模式 → 本机 AI 设置页
          //   web        = dsh web → DSH 站点
          DSH_PET_OPEN_TARGET: resolveOpenTarget(siteUrl, isDesktopHost()),
          DSH_PET_SCALE: '1',
          // 打开 bridge 协议：main.js 注册 dsh-pet-bridge scheme，把渲染端请求经管道转给宿主
          DSH_PET_BRIDGE: '1',
          // 每只桌面宠物一个局部小窗口：透传宠物列表（[{id,size}]）
          DSH_PET_PETS: JSON.stringify(desktopPetList()),
        },
        // bridge 协议处理器 = HTTP 路由同一份 handlePetRoute（业务逻辑唯一，两端天然一致）；
        // 形状转换在 ./bridge-response，本模块只管把请求转进去。
        bridgeHandler: async (req) => {
          const result = await getHandlePetRoute()(req.url ?? '/', req.method ?? 'GET', req.body);
          return toBridgeResponse(req.id, result);
        },
      },
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/config/save.ts:227-231](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/config/save.ts#L227-L231)

同步默认配置直接writeFileSync。

```text
export function syncUserConfigFromDefault(paths: ConfigPaths): void {
  const raw = readFileSync(paths.defaultFile, 'utf8');
  mkdirSync(dirname(paths.userFile), { recursive: true });
  writeFileSync(paths.userFile, raw, 'utf8');
}
```

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:80-108](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/chat-memory.ts#L80-L108)

记忆坏读回空、直接写和串行队列。

<details>
<summary>查看原文（29行）</summary>

```text
    let raw: string;
    try {
      raw = await readFile(memoryPath, 'utf8');
    } catch {
      return {}; // 文件不存在 = 尚无记忆
    }
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
      return parsed as Record<string, Record<string, { messages: ChatMemoryMessage[] }>>;
    } catch (e) {
      log.error(
        `dsh-pet: 记忆文件无法解析（对话将从头开始）：${memoryPath}（${e instanceof Error ? e.message : String(e)}）`,
      );
      return {};
    }
  };

  const writeMemory = async (mem: Record<string, Record<string, { messages: ChatMemoryMessage[] }>>): Promise<void> => {
    await mkdir(userRoot, { recursive: true });
    await writeFile(memoryPath, JSON.stringify(mem, null, 2), 'utf8');
  };

  /** 把一次读写封进串行队列（同进程内防交错），返回 fn 的结果 */
  const withMemoryLock = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = chatQueue.then(fn, fn);
    chatQueue = run.then(
      () => undefined,
      () => undefined,
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:354-390](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/chat-memory.ts#L354-L390)

生成成功后先记忆写，再capture/动画。

<details>
<summary>查看原文（37行）</summary>

```text
      const generated = await generateChat({
        ctx,
        system: patch?.system ?? system,
        history: patch?.history ?? list,
        userText: patch?.userText ?? text,
        pool,
        actions,
        preferred: configuredModel(found.conf, 'chatModel'),
        image,
      });
      if (!generated.ok) return generated;
      const now = Date.now();
      // 用户上传的图只存不送：记忆要能还原「这一轮带过图」（聊天记录存档），但不把图本体重发给模型；
      // AI 配的图只回填名称标记（见 chat.ts 的 historyMarkersOf），同样不带图本体。
      entry.messages.push({ role: 'user', content: text, ts: now, ...(image ? { image } : {}) });
      entry.messages.push({
        role: 'assistant',
        content: generated.text,
        ts: now,
        ...(generated.image ? { meme: generated.image } : {}),
        // 动作名与配图名同类：落盘只存名字，回放历史时由 chat.ts 以 [动作:名] 回填——
        // 否则模型记不得自己演过什么，用户说「换一个」它无从判断
        ...(generated.action ? { action: generated.action } : {}),
      });
      await writeMemory(mem);
      // 第三方记忆：落盘后异步接收；不等待、失败只记日志，不能影响这一轮回复。
      captureTurn(petId, {
        userText: text,
        replyText: generated.text,
        ts: now,
        ...(generated.action !== undefined ? { action: generated.action } : {}),
        ...(generated.image !== undefined ? { image: generated.image } : {}),
      });
      // 动作先写：与 POST /anim 同一条写回链路（记录 + anim 叶子），渲染端据此播放并回报执。
      if (generated.action !== undefined) {
        const record = playback.create(petId, generated.action);
        state.writePet(petId, 'anim', { name: generated.action, playbackId: record.playbackId });
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:156-182](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/desktop/spawn.ts#L156-L182)

不需桌面和无图形环境跳过。

<details>
<summary>查看原文（27行）</summary>

```text

  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!getHasDesktopPet() && !(desktopModeEverActive && getTrayOn())) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${getTrayOn()}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
```

</details>

**依据 8 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:190-214](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/desktop/spawn.ts#L190-L214)

缺Electron下载与失败降级。

<details>
<summary>查看原文（25行）</summary>

```text
    // 但不在实际查询的路径上（DSH_HOME 不一致）。把真正查的路径一起打出来。
    log.warn(
      `[dsh-pet] 未找到 Electron 可执行文件：DSH_HOME=${dshHomeDir()}，查找路径=${defaultElectronExe()}` +
        `，DSH_PET_ELECTRON_PATH=${process.env.DSH_PET_ELECTRON_PATH ?? '(未设置)'}`,
    );
    log.warn(`[dsh-pet] 开始下载 Electron 到 ${defaultElectronExe()} ...`);
    electronEnsure = ensureElectronDownload({
      // 下载全过程写进工作状态气泡（用户没有控制台，只能靠它看进度与失败原因）
      onLog: ({ text, level, done }) =>
        reportDownload(text, level === 'warn' ? 'error' : done ? 'success' : 'working', done),
      // 同一份进度也落盘：气泡只在有宠物显示时可见，桌面版 Helper 起不来时它就没有载体
      logger: log,
    })
      .then((path) => {
        if (path) {
          launchHelper(path);
        } else {
          log.warn(
            '[dsh-pet] Electron download failed; desktop pet unavailable. Set DSH_PET_ELECTRON_PATH and restart, or retry later.',
          );
        }
      })
      .finally(() => {
        electronEnsure = undefined;
      });
```

</details>

**依据 9 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:26-44](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/lifecycle.ts#L26-L44)

卸载清理与stopHelper。

<details>
<summary>查看原文（19行）</summary>

```text
/** 注册卸载清理；返回的清理函数由 ctx.effect 收集。 */
export function registerLifecycle(deps: LifecycleInput): void {
  const { ctx, lock, markDisposed, playback, state, stopDownloadSlotTimer, stopHelper, stopWorkStatusFlush } = deps;
  // 随插件生命周期清理：桌面 Helper 回收（异步下载完成后不再拉起）+ 结束所有挂起的等待
  // （回执与 /state 长轮询不结束的话，插件重载会留下一批悬挂响应，各自要等到超时才收尾）。
  ctx.effect(() => () => {
    markDisposed();
    // 工作状态的补写定时器：卸载后它到点已经没有意义（叶子连同长轮询一起收尾），清掉免得挂着
    stopWorkStatusFlush();
    // 下载日志的「清槽」定时器：同上，卸载后它到点已经没有意义
    stopDownloadSlotTimer();
    // 占用锁：卸载时把锁全撤掉并写一次叶子——不写的话渲染端要等 TTL 到点才解除静止
    // （写叶子必须在 state.cancelAll() 之前：那之后挂起的等待者已经收尾了）。
    lock.releaseAll();
    playback.cancelAll();
    state.cancelAll();
    stopHelper('dsh-host-stop');
  });
}
```

</details>

**依据 10 · 源码核查**：[dsh-pet/src/host/helper/child.ts:280-310](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/helper/child.ts#L280-L310)

stop仅发kill，stopAndWait另等。

<details>
<summary>查看原文（31行）</summary>

```text
  /** 停止 helper：发 SIGTERM 即返回，不等它退出。宿主退出 / 插件卸载路径用它——宿主马上就没了
   *  （Windows 有 job 对象、POSIX 有 helper 自己的 host-liveness 兜底）。
   *  停止后要立刻重启的场景必须用 stopAndWait()，否则新旧进程会短暂重叠。 */
  stop(reason = 'plugin-disposed'): void {
    this.stopping = true;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = undefined;
    this.logger.debug?.(`dsh-pet desktop helper stopping (${reason})`);
    const child = this.child;
    if (!child) return;
    child.kill();
  }

  /**
   * 停止 helper 并等它真正退出：只发一次 SIGTERM 就 spawn 新进程是不行的——Electron 收到 SIGTERM 后
   * 关窗、销毁 GPU/动画合成器是异步的（几百 ms 起），旧窗口（旧大小）还没消失、新窗口已经画出来，
   * 桌面上会短暂出现「两只宠物」。所以：① 先置 `stopping`（由 stop() 完成），守护逻辑不得把这次主动
   * 停止误判成崩溃去自动重启；② 只等 `exit` 不等 `close`——stdio 管道关闭远早于进程真正退出；③ 超时
   * （默认 3s）升级 SIGKILL，再给 1s 宽限，仍未退出就放弃等待，配置保存绝不能被无限挂住。
   */
  async stopAndWait(reason = 'plugin-disposed', timeoutMs = HELPER_STOP_TIMEOUT_MS): Promise<void> {
    this.stop(reason);
    const child = this.child;
    if (!child) return;
    await waitForChildExit(child, timeoutMs, () => {
      this.logger.warn?.(`dsh-pet desktop helper 未在 ${timeoutMs}ms 内退出，升级 SIGKILL（${reason}）`);
      try {
        child.kill('SIGKILL');
      } catch {
        /* 已经退出了 */
      }
```

</details>

**依据 11 · 源码核查**：[dsh-pet/src/host/helper/child.ts:314-332](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/helper/child.ts#L314-L332)

特定sandbox失败降级及显式阻止条件。

<details>
<summary>查看原文（19行）</summary>

```text
  /** 沙箱初始化失败的特殊崩溃 → 改用 `--no-sandbox` 立刻重试一次，不计入退避与熔断额度。 */
  private applySandboxFallback(code: number | null): boolean {
    const applied = shouldFallbackToNoSandbox({
      code,
      sawOutput: this.hasChildOutput,
      ranMs: Date.now() - this.lastStartAt,
      alreadyApplied: this.hasSandboxFallbackApplied,
      customCommand: Boolean(this.options.command),
      // 用户在 GPU 沙箱那层设的「保留沙箱」开关：自动降级不得越过显式设定。
      sandboxOptOut: process.env.DSH_PET_GPU_SANDBOX === '1',
    });
    if (!applied) return false;
    this.hasSandboxFallbackApplied = true;
    this.logger.warn?.(
      `dsh-pet desktop helper 因 Chromium 沙箱初始化失败而秒退（${describeExit(code, null)}），` +
        `改用 --no-sandbox 重试一次${this.launchIdentity}`,
    );
    this.start();
    return true;
```

</details>

#### 缺口

- 未核具体Host认证/pipe全协议/Helper渲染与资产权限/所有写盘和崩溃退出。
  **影响**：不能承诺全部署安全、退出无残留或请求失败未发生模型费。
  **进一步探讨**：本机受保护Host新profile只Web，关桌面和托盘，核进程；副本再测写失败/卸载等待和残留，别在生产配置试恢复默认。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 聊天、余额和语音怎样真正外发，失败会不会假装成功？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

定时余额启动即tick，只有醒着且balanceEnabled的宠物才refresh；读内置配置失败会停止周期直到重启。定时whisper按whisperEnabled与独立AI策略/周期、display、锁/睡眠过滤，再publish队列；这不等插件整体无自动模型面，用户应先关相应开关。

聊天先按宠物读取有界历史，第三方memory recall可替system/history/userText，失败降级；generateChat优先配置模型、失败可fallback当前对话模型并日志，不保证永远用用户首选供应商。真实llm.stream发送system/history/userText/可选图片与动作/表情名单，sessionId为插件身份，60秒独立deadline，不显式maxTokens；不是主Agent工具调用/任务委托。模型动作只在允许动画名中提取并写playback/state，不据此说它能执行任意命令。调用路由的断连signal未接到该聊天deadline，本轮不宣称浏览器关窗即取消模型。

余额从standalone或Host current provider选择，经credentials.resolve(credentialRef)取ref key，账号路径另软取deepseekAccount.getBalance；official实现真GET api.deepseek.com/user/balance带Bearer并校balance_infos/各币种，非屏幕估价。失败unsupported/credential-missing/fetch-error写state，不伪造0。第三方provider拿不到解析key/account，20秒race只结束等待不取消其请求；内置fetch20秒、最多3次网络异常重试，非HTTP错误全重试，不外推所有供应商正确。

/voice/speak实际调用service，缓存miss排队到EdgeTTS或已注册provider；内置依赖按需import并generate(text,voice...)后写mp3。即使没有额外LLM生成，语音也可能联网、存文本派生音频；模型费用/网络/磁盘与第三方记忆隐私另计。本轮未审所有余额商/TTS协议/待办/第三方扩展，建议都关再只观动画。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:62-100](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/loops.ts#L62-L100)

启动余额tick/启用与睡眠条件、失败停周期。

<details>
<summary>查看原文（39行）</summary>

```text
    function arm(sec: number): void {
      if (disposed) return;
      timer = setTimeout(() => void tick(), Math.max(1000, sec * 1000));
    }
    async function tick(): Promise<void> {
      let sec: number;
      try {
        const cfg = readAllConfig(configPaths);
        sec = balancePeriodSec(cfg);
        // 没有任何「醒着且启用余额」的宠物 → 不查（省外部调用）：睡着的宠物不看不听，
        // 拉了也只会白花一次外部 API；配置改了或醒了，下一拍自然跟上。
        const pets = flattenPetList(cfg);
        if (pets.some((p) => p.balanceEnabled === true && !sleep.sleeping(String(p.id ?? '')))) {
          await refreshBalance();
        } else {
          log.info('[dsh-pet] 余额周期跳过：没有醒着且启用余额的宠物');
        }
      } catch (e) {
        // 读配置抛错 = 安装损坏（readAllConfig 只在内置默认缺失/损坏时抛，用户层写坏只会告警回退）：
        // 不再重排——每 30 分钟重试一次没有意义，而且会白占一个常驻定时器。留一行 warn：这条路径
        // 会让余额周期永久停摆，不打日志就与「查了但没变化」无法区分。
        log.warn(
          '[dsh-pet] 余额周期读配置失败，周期刷新已停止（重启 DSH 后恢复）：' +
            (e instanceof Error ? e.message : String(e)),
        );
        return;
      }
      arm(sec);
    }
    void tick(); // 启动即拉一次，不等第一个周期
    return () => {
      disposed = true;
      if (timer !== null) clearTimeout(timer);
    };
  }, 'dsh-pet: balance poll');

  // 碎碎念周期：host 侧调度。一拍 = 读一次配置 + 把「到点」的宠物排进错峰队列；下一拍按最短周期排。
  // 用固定拍 + 逐宠物比对 lastWhisperAt，而不是每宠一个定时器：宠物随配置增删、周期随条目改，
  // 固定拍天然跟上，不用维护一堆定时器的生命周期。
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:150-193](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/loops.ts#L150-L193)

whisper实际开关/可见/锁/睡眠过滤。

<details>
<summary>查看原文（44行）</summary>

```text
        let due = 0;
        let notDue = 0;
        const skipped: string[] = [];
        for (const pet of flattenPetList(cfg)) {
          const petId = String(pet.id ?? '');
          if (!petId) continue;
          // petId 就是从同一份 cfg 拍平出来的，所以必然命中（findPetInstance 与 flattenPetList
          // 搜索同一集合）；查不到只可能是两者口径漂移——跳过这一拍，不猜也不兜底 main。
          const found = findPetInstance(cfg, petId);
          if (!found) continue;
          checked += 1;
          const schedule = automaticWhisperSchedule(
            standaloneAiPolicy(),
            pet.whisperEnabled === true,
            whisperPeriodSec(found.conf),
          );
          if (!schedule.enabled) {
            // 两种「没启用」分开记：宠物自己关掉，与独立模式 AI 未就绪，处理方式完全不同
            skipped.push(petId + ': ' + (pet.whisperEnabled === true ? '独立模式 AI 未就绪' : 'whisperEnabled=false'));
            continue;
          }
          // 配置上不显示的宠物不生成：用户选「都不显示」就是不用了，后台继续调模型纯属白烧额度（#237）。
          // 放在 min 之前：不可见的宠物也不该把整拍的周期拖住。不推进 lastWhisperAt——
          // 与占用锁同一口径，重新可见后下一拍立刻补一句。
          const display = String(pet.display ?? '');
          if (!isDisplayed(display)) {
            skipped.push(petId + ': display=none');
            continue;
          }
          const sec = schedule.periodSec;
          min = Math.min(min, sec);
          if (now - (lastWhisperAt.get(petId) ?? 0) < sec * 1000) {
            notDue += 1;
            continue;
          }
          // 占用锁：这只宠物被占用时跳过这一拍——不生成也不补（碎碎念是瞬时事件，过期即弃），
          // 且不推进 lastWhisperAt：锁一放开，下一拍就该照常说。
          // 只挡这一处 per-pet 来源；全局段（balance / workStatus）由渲染端按宠物忽略——
          // 宿主跳过写入会连带静音别的宠物。
          if (lock.locked(petId)) {
            skipped.push(petId + ': 占用锁跳过');
            continue;
          }
          // 睡觉：不生成、也不推进 lastWhisperAt——醒来的下一拍立刻补一句，与占用锁同一口径。
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/chat-memory.ts:345-365](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/chat-memory.ts#L345-L365)

第三方memory patch及真实generateChat调用。

<details>
<summary>查看原文（21行）</summary>

```text
        );
      }
      // 第三方记忆：对话前修改内容；失败或超时降级为原内容（见 recallPatch）。
      const patch = await recallPatch(petId, {
        system,
        history: list.map(({ role, content, ts }) => ({ role, content, ts })),
        userText: text,
      });
      // 模型：条目配置的 chatModel 优先（留空 = 不指定）；生成侧失败会回落到当前对话的模型重试一次
      const generated = await generateChat({
        ctx,
        system: patch?.system ?? system,
        history: patch?.history ?? list,
        userText: patch?.userText ?? text,
        pool,
        actions,
        preferred: configuredModel(found.conf, 'chatModel'),
        image,
      });
      if (!generated.ok) return generated;
      const now = Date.now();
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/chat.ts:123-151](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/chat.ts#L123-L151)

配置模型候选/fallback日志。

<details>
<summary>查看原文（29行）</summary>

```text
export async function generateChat(input: ChatGenerateInput): Promise<ChatGenerateResult> {
  const { ctx, system, history, userText, preferred, image } = input;
  // 表情包侧的读池 / 校验函数按可变数组签名；这里复制一份，避免把调用方数组的引用往下传
  const pool: MemeEntry[] = [...(input.pool ?? [])];
  // 动作名单同样是「空 = 关闭」：开关关掉或 categories 没配任何动作时，指令与解析都不介入。
  const actions: string[] = [...(input.actions ?? [])];
  // 候选链：配置的模型优先 → 当前对话的模型兜底（chatModel 留空时链上只有后者）
  const candidates = modelCandidates(ctx, preferred);
  if (candidates.length === 0) {
    return { ok: false, reason: 'provider-missing', message: '当前对话未配置模型' };
  }
  const llm = (ctx as { llm?: { stream(o: unknown): AsyncIterable<unknown> } }).llm;
  if (!llm || typeof llm.stream !== 'function') {
    return { ok: false, reason: 'generate-error', message: 'LLM 服务不可用' };
  }
  // 依次尝试：配置的模型失败（凭据被删 / 模型下架 / 该服务商没配 key）时回落到当前对话的模型
  // 重试一次——那才是用户当前真正在用的模型，报错更有意义。
  // 兜底文案与失败分支同源，避免两处字面量漂移
  let last: ChatGenerateResult = { ok: false, reason: 'generate-error', message: noTextReason(undefined) };
  for (const [i, sel] of candidates.entries()) {
    const result = await generateWith(ctx, { llm, sel, system, history, userText, pool, actions, image });
    if (result.ok) return result;
    last = result;
    // 回落要留痕：配的模型没生效时能在日志里看到原因（否则「我明明配了 A，怎么还是用 B」没法查）
    if (i + 1 < candidates.length) {
      defaultLog(
        'warn',
        `dsh-pet: 对话用 ${modelLabel(sel)} 生成失败（${result.message ?? result.reason}），回落到 ${modelLabel(candidates[i + 1])}`,
      );
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/chat.ts:170-190](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/chat.ts#L170-L190)

历史组装与独立deadline。

<details>
<summary>查看原文（21行）</summary>

```text
async function generateWith(ctx: { llm?: unknown }, once: GenerateOnce): Promise<ChatGenerateResult> {
  const { llm, sel, system, history, userText, pool, actions, image } = once;
  // 历史 → dsh-llm 消息：user 经 createUserMessage（plugin 来源），assistant 经 createAssistantMessage
  // （provider/model 只是消息的角色载体，不涉及适配器回放）。
  // 时间前缀只加在 user 上（模型会照抄 assistant 自己那侧的格式）；配图/动作标记只加在 assistant 上。
  const nowMs = Date.now();
  const historyMessages = history.map((m) =>
    m.role === 'user'
      ? createUserMessage({
          content: [{ type: 'text', text: userHistoryTextOf(m, nowMs) }],
          source: { kind: 'user' },
        })
      : createAssistantMessage({
          content: [{ type: 'text', text: m.content + historyMarkersOf(m) }],
          source: { provider: sel.provider, model: sel.model },
        }),
  );

  const deadline = AbortSignal.timeout(TIMEOUT_MS);
  // 仅当模型声明支持 reasoning effort（含 "off"）时才传，否则省略：
  // 无 reasoning 元数据的模型显式传 off 会被 dsh-llm 判为 UNSUPPORTED_REASONING_EFFORT，
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/chat.ts:192-247](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/chat.ts#L192-L247)

真正stream的内容、无maxTokens和异常/空文本失败。

<details>
<summary>查看原文（56行）</summary>

```text
  const supportsOff = await supportsReasoningOff(ctx, sel.provider, sel.model);
  // 配图 / 动作：各自的清单非空才把指令附进 user 正文（空 = 该功能关闭）。
  // 顺序固定「配图在前、动作在后」：配图是既有行为，新增的动作排在它后面，不改既有提示词的位置。
  const wantImage = pool.length > 0;
  const wantAction = actions.length > 0;
  const instruction = (wantImage ? imageInstruction(pool) : '') + (wantAction ? actionInstruction(actions) : '');
  const content: Record<string, unknown>[] = [
    { type: 'text', text: instruction === '' ? userText : userText + instruction },
  ];
  // 图片块排在文本块之后：提示词先到、像素后到，模型更容易按提示去看图。
  if (image !== undefined) content.push({ type: 'image', attachment: image });
  const options = {
    provider: sel.provider,
    model: sel.model,
    // 调用身份（见 llm-call.ts）：缺它时 opencode-go 回 400
    sessionId: PET_CALL_IDENTITY,
    messages: [
      ...historyMessages,
      createUserMessage({
        // PetImageRef 与 dsh-llm 的 ImageAttachmentRef 字段一致，差异只有品牌化类型（attachmentId 是 branded string）；
        // 插件侧不引 @deepseek-ai/dsh-attachment 的类型包，这里显式断言一次。
        content: content as unknown as Parameters<typeof createUserMessage>[0]['content'],
        source: { kind: 'user' },
      }),
    ],
    system,
    // 不显式限 maxTokens：与碎碎念同因——推理模型把思考计入预算，显式小上限会截断正文；
    // 不传由 dsh-llm 按适配器 defaultMaxTokens 兜底，对话短回复输出仍短。
    temperature: 1,
    // 统一关闭深度思考：闲聊对话不需要推理（与碎碎念同一约束；仅模型声明支持时传）
    ...(supportsOff ? { reasoningEffort: ReasoningEffortId('off') } : {}),
    signal: deadline,
  };

  const assembler = new BlockAssembler();
  try {
    for await (const chunk of llm.stream(options)) {
      assembler.push(chunk as Parameters<BlockAssembler['push']>[0]);
    }
  } catch (e) {
    return {
      ok: false,
      reason: 'generate-error',
      message: e instanceof Error ? e.message : String(e),
    };
  }
  const text = assembler
    .blocks()
    .filter((b) => b.type === 'text')
    .map((b) => ('text' in b ? (b as { text: string }).text : ''))
    .join('')
    .trim();
  if (!text) return { ok: false, reason: 'generate-error', message: noTextReason(assembler.finish) };
  if (!wantImage && !wantAction) return { ok: true, text };
  // 先剥动作再剥配图：两种标记互不依赖，顺序不影响结果；动作的无效名称也会被剥（见 extractChatAction）。
  const acted: { text: string; action?: string } = wantAction ? extractChatAction(text, actions) : { text };
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/plugin/balance-poll.ts:74-101](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/balance-poll.ts#L74-L101)

真实provider/credential/account与state。

<details>
<summary>查看原文（28行）</summary>

```text
  const refreshBalance = async (manual = false): Promise<void> => {
    // 开始 + 结果各一行：否则 logs.txt 里既看不出「有没有查」，也看不出「查了但余额没变」。
    log.info(`[dsh-pet] 余额刷新开始（${manual ? '手动' : '周期'}）`);
    const mark = <T>(v: T): T | (T & { manual: true }) => (manual ? { ...v, manual: true } : v);
    try {
      // 独立模式自己选余额服务商、自己持密钥：它的 provider 不是聊天用的那个，
      // 也不能经 DSH 的 credential store 解析，所以优先走 standaloneAi 交出来的凭证。
      const standalone = standaloneAiBalance();
      const provider = standalone?.provider || ctx.agentDefaultModel.currentSelection().provider;
      const result = await queryBalance(
        provider,
        async (ref) => {
          if (standalone?.apiKey) return standalone.apiKey;
          const rc = await ctx.credentials.resolve(credentialRef(ref));
          return rc?.value;
        },
        // `deepseek-account`（免费额度 / 平台登录）没有 API Key：它的凭证是 DSH 账号服务
        // 持有的授权记录，只能经 getBalance 查询。账号服务是可选服务（软取，不放进 inject）
        // ——没装账号插件时它不在场，此时该路由报 credential-missing 而不是崩。
        async () => {
          const account = ctx.get('deepseekAccount', false);
          if (!account) return undefined;
          return account.getBalance(accountClientMetadata());
        },
      );
      state.writeSection('balance', mark(result));
      // 失败也写 S（前端弹文字说明），日志同样留一条：否则「查了、失败了」与「根本没查」
      // 在文件里长得一模一样。成功用 info，失败用 warn（亮度不同，扫一眼就能分辨）。
```

</details>

**依据 8 · 源码核查**：[dsh-pet/src/host/balance/index.ts:47-86](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/balance/index.ts#L47-L86)

缺支持/凭据拒绝，第三方race非取消。

<details>
<summary>查看原文（40行）</summary>

```text
  provider: string,
  resolveKey: (ref: string) => Promise<string | undefined>,
  resolveAccount?: () => Promise<AccountBalanceSnapshot | null | undefined>,
): Promise<BalanceResult> {
  const def = matchBalanceProvider(provider);
  if (!def) return failed(provider, 'unsupported');

  // 第三方 provider 没有 credential：不解析 key、也不给 resolveAccount，
  // 否则等于允许它顺带查用户的 DSH 账号余额。
  if (!('credential' in def)) {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeout = new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error('余额查询超时（20 秒），请稍后重试')), PLUGIN_FETCH_TIMEOUT_MS);
        timer.unref();
      });
      // 超时只结束宿主等待，不宣称取消第三方请求；迟到结果由 race 丢弃。
      return await Promise.race([def.fetch({ provider }), timeout]);
    } catch (e) {
      return fetchFailed(provider, e);
    } finally {
      if (timer !== undefined) clearTimeout(timer);
    }
  }

  // 凭证检查放在 try 之外：解析凭证抛错属意外，由调用方兜底；账号路由改判账号服务是否在场。
  let key = '';
  if (def.credential.mode === 'ref') {
    const resolved = await resolveKey(def.credential.ref);
    if (!resolved) return failed(provider, 'credential-missing', '缺少凭证 ' + def.credential.ref);
    key = resolved;
  } else if (!resolveAccount) {
    return failed(provider, 'credential-missing', '缺少账号服务（' + provider + '）');
  }

  try {
    return await def.fetch({ provider, key, resolveAccount });
  } catch (e) {
    return fetchFailed(provider, e);
  }
```

</details>

**依据 9 · 源码核查**：[dsh-pet/src/host/balance/providers/deepseek-official.ts:15-43](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/balance/providers/deepseek-official.ts#L15-L43)

真实official endpoint与币种校验。

<details>
<summary>查看原文（29行）</summary>

```text
export const deepseekOfficial: BalanceProvider = {
  id: 'deepseek-official',
  credential: { mode: 'ref', ref: 'DEEPSEEK_API_KEY' },
  async fetch({ key, provider }) {
    const res = await fetchWithRetry('https://api.deepseek.com/user/balance', key);
    if (!res.ok) throw new Error('deepseek balance HTTP ' + res.status);
    const body: unknown = await res.json();
    const infos = (body as { balance_infos?: unknown })?.balance_infos;
    if (!Array.isArray(infos) || infos.length === 0)
      throw new Error('dsh-pet: deepseek balance 响应缺少 balance_infos');
    const wallets = infos.map((raw) => {
      const w = obj(raw) ?? {};
      const currency = str(w.currency, 'currency');
      const fullBalance = deepseekFullBalance(currency);
      return {
        currency,
        total: str(w.total_balance, 'total_balance'),
        granted: str(w.granted_balance, 'granted_balance'),
        toppedUp: str(w.topped_up_balance, 'topped_up_balance'),
        ...(fullBalance === undefined ? {} : { fullBalance }),
      };
    });
    return {
      ok: true,
      provider,
      shape: 'money',
      data: { wallets, tier: deepseekPricingTier() },
    };
  },
```

</details>

**依据 10 · 源码核查**：[dsh-pet/src/host/balance/internal.ts:11-35](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/balance/internal.ts#L11-L35)

Bearer/fetch timeout与网络异常重试。

<details>
<summary>查看原文（25行）</summary>

```text
/** 单次抓取超时（ms）。 */
const FETCH_TIMEOUT_MS = 20_000;
/** 单次抓取失败后的重试次数（间隔 0.8s）。 */
const RETRIES = 3;

/** 发起一次带超时的 fetch；失败抛错，是否重试由调用方决定。 */
async function fetchOnce(url: string, key: string): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: 'Bearer ' + key, 'User-Agent': 'dsh-pet-balance' },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

/** 带重试地抓取；全部失败时抛出最后一次错误。 */
export async function fetchWithRetry(url: string, key: string): Promise<Response> {
  let last: unknown;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      return await fetchOnce(url, key);
    } catch (e) {
      last = e;
      if (i < RETRIES) await new Promise((r) => setTimeout(r, 800));
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
```

</details>

**依据 11 · 源码核查**：[dsh-pet/src/host/routes/voice.ts:21-31](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/routes/voice.ts#L21-L31)

真实voice请求到service。

<details>
<summary>查看原文（11行）</summary>

```text
  if (rest === 'voice/speak') {
    if (method !== 'POST') return methodNotAllowed();
    let parsed: unknown;
    try {
      parsed = JSON.parse(body ?? 'null');
    } catch {
      return invalidJson();
    }
    const result = await deps.voice.speak(parsed);
    if (!result.ok) return failResult(result.reason, result.message);
    return { kind: 'file', file: result.file, contentType: 'audio/mpeg' };
```

</details>

**依据 12 · 源码核查**：[dsh-pet/src/host/voice/speak.ts:142-173](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/voice/speak.ts#L142-L173)

缓存/限队/实际synthesize调用。

<details>
<summary>查看原文（32行）</summary>

```text
  async function speak(raw: unknown): Promise<SpeakResult> {
    const parsed = parseSpeakInput(raw);
    if (!parsed.ok) return { ok: false, reason: 'bad-request', message: parsed.message };
    const { text, voice, rate } = parsed.value;
    // 每次请求现查一次：第三方可能运行中才注册、也可能被卸载，启动快照会漏掉这两种
    const provider = activeVoiceProvider();
    const source = provider ? provider.id : BUILTIN_VOICE_ID;
    // 第三方没有音色概念，缓存键里把 voice 置空；来源进键，换实现不会命中旧音频
    const target = cachePath(userRoot, cacheKey(source, provider ? '' : voice, rate, text));
    const startedMs = Date.now();
    const cached = await findCached(target);
    if (cached) {
      log?.info?.(`[dsh-pet] voice speak: cache=hit chars=${text.length} voice=${source}`);
      return { ok: true, file: cached };
    }
    if (queueUsed >= MAX_QUEUE) {
      log?.warn?.(`[dsh-pet] voice speak: queue full (max ${MAX_QUEUE}) chars=${text.length} voice=${source}`);
      return { ok: false, reason: 'voice-busy', message: 'voice queue is full, retry later' };
    }
    const queue = { dropped: false };
    const queuedMs = Date.now();
    try {
      await enqueue(async () => {
        if (isQueueStale(queuedMs, Date.now(), staleWaitMs)) {
          queue.dropped = true;
          return;
        }
        const dir = await ensureCacheDir(userRoot);
        if (provider) await synthesizeWithProvider(provider, { text, voice, rate, target });
        else await synthesizeImpl({ signal: AbortSignal.timeout(BUILTIN_TIMEOUT_MS), target, text, voice, rate });
        // 淘汰放在成功之后：失败时不该为腾地方而删掉还能用的缓存
        await pruneCache(dir);
```

</details>

**依据 13 · 源码核查**：[dsh-pet/src/host/voice/edge.ts:51-62](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/voice/edge.ts#L51-L62)

实际SDK按需加载/generate及写音频。

<details>
<summary>查看原文（12行）</summary>

```text
 */
export async function synthesize({ signal, text, voice, rate, target }: SynthInput): Promise<void> {
  const staging = `${target}.part`;
  try {
    // 按需加载：包缺失时这里抛 MODULE_NOT_FOUND，由下面统一归成 VoiceSynthError。
    // CJS 包经 dynamic import 后可能只露 default，两种形状都认。
    const mod = (await import('@andresaya/edge-tts')) as EdgeTtsModule & { default?: EdgeTtsModule };
    const EdgeTTS = mod.EdgeTTS ?? mod.default?.EdgeTTS;
    if (!EdgeTTS) throw new VoiceSynthError('依赖未导出 EdgeTTS');
    const tts = new EdgeTTS();
    const result = await tts.generate(text, voice, { rate, signal, timeout: SYNTHESIS_TIMEOUT_MS });
    await writeFile(staging, result.audio);
```

</details>

#### 缺口

- 未调用真实模型/余额/TTS，未全审memory provider、全部供应商、聊天路由和所有自动面。
  **影响**：不能保证费用上限、首选模型不外溢、余额即时/完整，默认开关需用户核。
  **进一步探讨**：逐宠物关余额/whisper/语音与扩展，只Web观状态；需聊天另在脱敏小样本核provider、历史和usage，并先接受fallback/记忆政策。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么具体用法值得先试，怎样停止？

**研究主题**：依赖、兼容与流程、采用判断、效果与总成本

#### 完整回答

偏好动画陪伴且已有兼容本地DSH的用户，可在新profile/脱敏会话只留一只Web宠物，workStatusEnabled开、display=web，先关balanceEnabled、whisperEnabled、语音/对话/第三方记忆/待办扩展并核无Helper/托盘、无不期望网络；不输入真实聊天或凭据，只看一轮thinking/working/result/waiting的来源跳转并与原会话确认。不能因为本轮只观动画就称Host整体只读；所有工具仍按原Host权限。状态过旧/错会话/出现额外调用就停回原会话列表。

Node>=22.12、Cordis/DSH peers、React与素材/构建成品是条件；compatible列表作者自述。固定checkout无随包生成资源完整性/发行包验收，不能把未装成品说开箱通过。首次安装/重启/开关/模型和素材校验；持续长轮询/动画GPU/可选Helper内存、模型/余额/TTS网络、记忆与音频磁盘，人工辨状态和兼容维护。失败可能只告警退旧状态/停止周期，需原界面查；退出关自动面、卸载/刷新、核Helper确退，保留或清记忆/语音/配置按个人策略，卸载没有自动删除/已外发收回保证。现金/资源量/人工时间与陪伴收益均未测，不用省时或低余额警告推节省。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/package.json:98-142](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/package.json#L98-L142)

Node/依赖/兼容和peer条件。

<details>
<summary>查看原文（45行）</summary>

```text
    "check:runtime": "eslint --config eslint.runtime.config.js runtime/electron-helper"
  },
  "license": "MIT",
  "engines": {
    "node": ">=22.12.0"
  },
  "dependencies": {
    "@andresaya/edge-tts": "^1.9.1",
    "@anthropic-ai/sdk": "0.135.0",
    "@electron-internal/extract-zip": "^1.0.5",
    "@electron/get": "^5.1.0",
    "openai": "7.39.0",
    "zod": "4.6.7"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "dshReleases": {
        "0.2.1-rc.3": "compatible",
        "0.2.2-alpha.2": "compatible",
        "0.2.2-rc.1": "compatible"
      }
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-agent-default-model": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-connection": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-commands": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-credentials": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-home-paths": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.0-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.0-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:350-363](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/multi.ts#L350-L363)

状态按开关分发，来源跳转已有。

<details>
<summary>查看原文（14行）</summary>

```text
          // 未启用工作状态联动：在分发处就断掉，下游（动画恢复、播完判定、气泡）不必各判一次。
          const workOn = p.workStatusEnabled;
          return h(Card, {
            key: p.id,
            cfg: p as RuntimePet,
            balance,
            balanceTick,
            balanceNoticeTick,
            balanceManual,
            workStatus: workOn ? workStatus : null,
            workStatusTick: workOn ? workStatusTick : 0,
            onFocusSession: jumpToSession,
            say: sayRef.current[p.id],
            sayTick,
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:62-100](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/loops.ts#L62-L100)

余额启用条件与周期失败。

<details>
<summary>查看原文（39行）</summary>

```text
    function arm(sec: number): void {
      if (disposed) return;
      timer = setTimeout(() => void tick(), Math.max(1000, sec * 1000));
    }
    async function tick(): Promise<void> {
      let sec: number;
      try {
        const cfg = readAllConfig(configPaths);
        sec = balancePeriodSec(cfg);
        // 没有任何「醒着且启用余额」的宠物 → 不查（省外部调用）：睡着的宠物不看不听，
        // 拉了也只会白花一次外部 API；配置改了或醒了，下一拍自然跟上。
        const pets = flattenPetList(cfg);
        if (pets.some((p) => p.balanceEnabled === true && !sleep.sleeping(String(p.id ?? '')))) {
          await refreshBalance();
        } else {
          log.info('[dsh-pet] 余额周期跳过：没有醒着且启用余额的宠物');
        }
      } catch (e) {
        // 读配置抛错 = 安装损坏（readAllConfig 只在内置默认缺失/损坏时抛，用户层写坏只会告警回退）：
        // 不再重排——每 30 分钟重试一次没有意义，而且会白占一个常驻定时器。留一行 warn：这条路径
        // 会让余额周期永久停摆，不打日志就与「查了但没变化」无法区分。
        log.warn(
          '[dsh-pet] 余额周期读配置失败，周期刷新已停止（重启 DSH 后恢复）：' +
            (e instanceof Error ? e.message : String(e)),
        );
        return;
      }
      arm(sec);
    }
    void tick(); // 启动即拉一次，不等第一个周期
    return () => {
      disposed = true;
      if (timer !== null) clearTimeout(timer);
    };
  }, 'dsh-pet: balance poll');

  // 碎碎念周期：host 侧调度。一拍 = 读一次配置 + 把「到点」的宠物排进错峰队列；下一拍按最短周期排。
  // 用固定拍 + 逐宠物比对 lastWhisperAt，而不是每宠一个定时器：宠物随配置增删、周期随条目改，
  // 固定拍天然跟上，不用维护一堆定时器的生命周期。
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/plugin/loops.ts:158-177](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/loops.ts#L158-L177)

whisper开关/可见性条件。

<details>
<summary>查看原文（20行）</summary>

```text
          const found = findPetInstance(cfg, petId);
          if (!found) continue;
          checked += 1;
          const schedule = automaticWhisperSchedule(
            standaloneAiPolicy(),
            pet.whisperEnabled === true,
            whisperPeriodSec(found.conf),
          );
          if (!schedule.enabled) {
            // 两种「没启用」分开记：宠物自己关掉，与独立模式 AI 未就绪，处理方式完全不同
            skipped.push(petId + ': ' + (pet.whisperEnabled === true ? '独立模式 AI 未就绪' : 'whisperEnabled=false'));
            continue;
          }
          // 配置上不显示的宠物不生成：用户选「都不显示」就是不用了，后台继续调模型纯属白烧额度（#237）。
          // 放在 min 之前：不可见的宠物也不该把整拍的周期拖住。不推进 lastWhisperAt——
          // 与占用锁同一口径，重新可见后下一拍立刻补一句。
          const display = String(pet.display ?? '');
          if (!isDisplayed(display)) {
            skipped.push(petId + ': display=none');
            continue;
```

</details>

**依据 5 · 源码核查**：[dsh-pet/src/host/plugin/desktop/spawn.ts:156-182](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/desktop/spawn.ts#L156-L182)

纯Web且无托盘可跳Helper。

<details>
<summary>查看原文（27行）</summary>

```text

  const startHelper = (): void => {
    if (inProcessHost) return; // 应用模式：不探测、不下载 Electron
    if (helper || electronEnsure || disposed) return;
    if (!getHasDesktopPet() && !(desktopModeEverActive && getTrayOn())) {
      // 诊断日志（issue #168）：这条短路不打日志，就是「桌面模式凭空消失：无进程、无目录、无提示」
      // 的直接成因。用 info 而非 warn——纯网页用户这是正常状态；只打一次避免刷屏。
      // 托盘关掉后这里也会命中：没人需要那个图标，空常驻没有意义。
      if (!noDesktopSkipped) {
        noDesktopSkipped = true;
        log.info(
          `[dsh-pet] 无桌面宠物（display 均为 web/none）且无需保留托盘（tray=${getTrayOn()}），已跳过桌面 Helper 启动`,
        );
      }
      return;
    }
    // 无图形显示环境（Linux 服务器 / 容器）：直接放弃，不探测、不下载、不拉起。
    // 否则 Electron 会「拉起即崩」，被守护循环反复重启并刷满 core dump。
    if (!hasGraphicalDisplay()) {
      if (!displayWarned) {
        displayWarned = true;
        log.warn(
          '[dsh-pet] 未检测到图形显示环境（DISPLAY/WAYLAND_DISPLAY 均为空），已跳过桌面宠物。' +
            '浏览器内宠物不受影响；如需在服务器上启用桌面模式，请配置 Xvfb 后设置 DSH_PET_DESKTOP_FORCE=1。',
        );
      }
      return;
```

</details>

**依据 6 · 源码核查**：[dsh-pet/src/host/plugin/lifecycle.ts:26-44](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/plugin/lifecycle.ts#L26-L44)

卸载清等待/锁/Helper。

<details>
<summary>查看原文（19行）</summary>

```text
/** 注册卸载清理；返回的清理函数由 ctx.effect 收集。 */
export function registerLifecycle(deps: LifecycleInput): void {
  const { ctx, lock, markDisposed, playback, state, stopDownloadSlotTimer, stopHelper, stopWorkStatusFlush } = deps;
  // 随插件生命周期清理：桌面 Helper 回收（异步下载完成后不再拉起）+ 结束所有挂起的等待
  // （回执与 /state 长轮询不结束的话，插件重载会留下一批悬挂响应，各自要等到超时才收尾）。
  ctx.effect(() => () => {
    markDisposed();
    // 工作状态的补写定时器：卸载后它到点已经没有意义（叶子连同长轮询一起收尾），清掉免得挂着
    stopWorkStatusFlush();
    // 下载日志的「清槽」定时器：同上，卸载后它到点已经没有意义
    stopDownloadSlotTimer();
    // 占用锁：卸载时把锁全撤掉并写一次叶子——不写的话渲染端要等 TTL 到点才解除静止
    // （写叶子必须在 state.cancelAll() 之前：那之后挂起的等待者已经收尾了）。
    lock.releaseAll();
    playback.cancelAll();
    state.cancelAll();
    stopHelper('dsh-host-stop');
  });
}
```

</details>

**依据 7 · 源码核查**：[dsh-pet/src/host/helper/child.ts:280-310](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/helper/child.ts#L280-L310)

停止返回与真实退出有别。

<details>
<summary>查看原文（31行）</summary>

```text
  /** 停止 helper：发 SIGTERM 即返回，不等它退出。宿主退出 / 插件卸载路径用它——宿主马上就没了
   *  （Windows 有 job 对象、POSIX 有 helper 自己的 host-liveness 兜底）。
   *  停止后要立刻重启的场景必须用 stopAndWait()，否则新旧进程会短暂重叠。 */
  stop(reason = 'plugin-disposed'): void {
    this.stopping = true;
    if (this.restartTimer) clearTimeout(this.restartTimer);
    this.restartTimer = undefined;
    this.logger.debug?.(`dsh-pet desktop helper stopping (${reason})`);
    const child = this.child;
    if (!child) return;
    child.kill();
  }

  /**
   * 停止 helper 并等它真正退出：只发一次 SIGTERM 就 spawn 新进程是不行的——Electron 收到 SIGTERM 后
   * 关窗、销毁 GPU/动画合成器是异步的（几百 ms 起），旧窗口（旧大小）还没消失、新窗口已经画出来，
   * 桌面上会短暂出现「两只宠物」。所以：① 先置 `stopping`（由 stop() 完成），守护逻辑不得把这次主动
   * 停止误判成崩溃去自动重启；② 只等 `exit` 不等 `close`——stdio 管道关闭远早于进程真正退出；③ 超时
   * （默认 3s）升级 SIGKILL，再给 1s 宽限，仍未退出就放弃等待，配置保存绝不能被无限挂住。
   */
  async stopAndWait(reason = 'plugin-disposed', timeoutMs = HELPER_STOP_TIMEOUT_MS): Promise<void> {
    this.stop(reason);
    const child = this.child;
    if (!child) return;
    await waitForChildExit(child, timeoutMs, () => {
      this.logger.warn?.(`dsh-pet desktop helper 未在 ${timeoutMs}ms 内退出，升级 SIGKILL（${reason}）`);
      try {
        child.kill('SIGKILL');
      } catch {
        /* 已经退出了 */
      }
```

</details>

#### 缺口

- 未安装/验证素材包、实际兼容、资源消耗和用户净收益。
  **影响**：只能满足已有动画偏好的小试，不把它当唯一工作提醒/余额账本。
  **进一步探讨**：固定Host/成品一会话核状态与退出，记录GPU/内存/网络/人工切回次数；无帮助就卸载回原界面。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现成能力之外还能提出什么可推翻方向？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

现有贡献是会话事件→单条来源明确状态→Web/Helper动画与共享业务请求，goal中间轮/工具在途的特别处理减少明显假庆祝；这仍是注意力呈现，非已测任务效率或事实验证。状态已带sessionId且多端有focusSession/onFocusSession，不将“加来源跳转”再次记作创新。

候选是为这一宠物状态轮询显示传输新鲜度：依据最近一次成功response/长轮询超时回复，而非状态叶子最后变化时间；工作没变但连接活着不能被误标断线，网络失败保留旧图时则明确待核。当前runStatePoll吞错误、只有onState没有onError，已读段没有把失败发布给pet气泡；未审全局是否已有同等提示，若已有则复用。两会话等待/工作交替中随机断连，对比现状、全局连接提示和宠物新鲜度的错认工作/漏等人输入、切回次数及干扰；无改善或静态长任务误报增加即推翻。未实现/未验证，不计作当前贡献或评分加分。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-pet/src/client/pet/state-poll.ts:10-21](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/state-poll.ts#L10-L21)

poll依赖接口只有成功回调。

<details>
<summary>查看原文（12行）</summary>

```text
export interface StatePollDeps {
  /** 拉一次状态；`timeoutMs` 已按宿主能力决定，`undefined` 表示普通请求。 */
  fetch: (options?: { since: number; timeoutMs: number }) => Promise<PollState | null>;
  /** 拿到有效快照后分发叶子。 */
  onState: (state: PollState) => void;
  /** 长轮询的挂起时长（ms）。 */
  waitMs: number;
  /** 失败或老宿主时的退避间隔（ms）。 */
  fallbackMs: number;
  /** 组件是否仍然挂载；false 时循环立刻退出。 */
  isAlive: () => boolean;
}
```

</details>

**依据 2 · 源码核查**：[dsh-pet/src/client/pet/state-poll.ts:30-53](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/state-poll.ts#L30-L53)

失败不分发/退避的真实缺口。

<details>
<summary>查看原文（24行）</summary>

```text
 * @returns 无返回值；循环结束后自然收尾。
 */
export async function runStatePoll(deps: StatePollDeps): Promise<void> {
  /** 宿主是否支持长轮询：首拍带 counter 就是支持。 */
  let longPoll = false;
  /** 上次拿到的 counter，作为长轮询的 since。 */
  let since: number | undefined;
  while (deps.isAlive()) {
    let state: PollState | null = null;
    try {
      state = await deps.fetch(longPoll && since !== undefined ? { since, timeoutMs: deps.waitMs } : undefined);
    } catch {
      /* 轻量轮询失败静默，下一拍再试。 */
    }
    if (!deps.isAlive()) return;
    if (state !== null) {
      longPoll = typeof state.counter === 'number';
      if (longPoll && typeof state.counter === 'number') since = state.counter;
      deps.onState(state);
    }
    // 长轮询命中或首拉时立刻再请求；失败或老宿主则退避一个间隔。
    if (state === null || !longPoll) await sleep(deps.fallbackMs);
  }
}
```

</details>

**依据 3 · 源码核查**：[dsh-pet/src/host/routes/state.ts:72-112](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/routes/state.ts#L72-L112)

无变更长轮询仍可超时回复，不能以叶子ts当断线。

<details>
<summary>查看原文（41行）</summary>

```text
    if (parsed.kind === 'error') return failResult('bad-request', parsed.error);
    const current = state.read();
    // 两者都没传 → 立刻返回；已经有新东西 → 也立刻返回（别白等一整个 timeout）。
    // timeout=0 走挂起分支，下一拍就醒，等价「立刻返回」，这里不特判。
    if (parsed.kind === 'none' || current.counter !== parsed.since) {
      return okResult(current, headers);
    }
    const since = parsed.since;
    return await new Promise<RouteResult>((resolveWait) => {
      let settled = false;
      /** 收尾：只认第一次（唤醒 / 超时 / 取消 / 调用方断开 都可能先后到达） */
      const settle = (result: RouteResult): void => {
        if (settled) return;
        settled = true;
        resolveWait(result);
      };
      // 唤醒时才 read()：store 保证「叶子已写定」之后才叫醒，所以这里拿到的一定是新状态
      const cancel = state.wait({
        since,
        timeoutMs: parsed.timeoutMs,
        onWake: () => settle(okResult(state.read(), headers)),
      });
      // 调用方断开：取消等待者（清掉它的超时定时器），以「无需应答」收尾。
      const onAbort = (): void => {
        cancel();
        settle({ kind: 'none' });
      };
      if (signal?.aborted) {
        onAbort();
        return;
      }
      signal?.addEventListener('abort', onAbort, { once: true });
    });
  }

  // 外部写入工作状态：POST 设置固定外部槽 `api` 的档位（task 省略 = 保留，null = 清空），
  // DELETE 清空回空闲（幂等）。只解决「外部程序把状态告诉桌宠」，不做多写者仲裁/租约/会话管理；
  // 外部槽与会话一起参与现有优先级（waiting > error > working > thinking > result > success）。
  if (rest === 'work-status') {
    if (method === 'DELETE') {
      if (workStatus.clear(EXTERNAL_WORK_SESSION)) publishWorkStatus();
```

</details>

**依据 4 · 源码核查**：[dsh-pet/src/host/work-status.ts:130-136](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/host/work-status.ts#L130-L136)

现成来源sessionId。

```text
/** 工作状态快照（= /state 里 sections.workStatus 的 data）：state 为主状态；task 为 todo 详情（可 null）。 */
export interface WorkStatusSnapshot {
  state: HostWorkStatusState | null; // null = 尚无会话活动（空闲）
  task: string | null; // 当前任务详情（todo/write 提供，可 null）
  /** 当前展示条目所属会话；空闲或外部槽（`api`）时为 null，客户端据此决定气泡能不能点。 */
  sessionId: string | null;
  ts: number; // 最近一次变化的时间戳（轮询侧据此检测变化）
```

**依据 5 · 源码核查**：[dsh-pet/src/client/pet/multi.ts:350-363](https://github.com/PC2005-cloud/dsh-pet/blob/881bd2811ee151f774303b4aba5eedb2ec5e996c/dsh-pet/src/client/pet/multi.ts#L350-L363)

现成状态/会话跳转接线。

<details>
<summary>查看原文（14行）</summary>

```text
          // 未启用工作状态联动：在分发处就断掉，下游（动画恢复、播完判定、气泡）不必各判一次。
          const workOn = p.workStatusEnabled;
          return h(Card, {
            key: p.id,
            cfg: p as RuntimePet,
            balance,
            balanceTick,
            balanceNoticeTick,
            balanceManual,
            workStatus: workOn ? workStatus : null,
            workStatusTick: workOn ? workStatusTick : 0,
            onFocusSession: jumpToSession,
            say: sayRef.current[p.id],
            sayTick,
```

</details>

#### 缺口

- 未核全局连接提示与真实误认率/新提示干扰。
  **影响**：只能提出需要先证需求的候选，不断言产品缺少任何断线提示。
  **进一步探讨**：先查宿主全局提示，再脱敏同任务断连盲测；若已有提示足够就不再新增宠物功能。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
