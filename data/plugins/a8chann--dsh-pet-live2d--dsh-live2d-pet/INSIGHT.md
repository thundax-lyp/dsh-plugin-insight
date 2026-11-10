# DSH Live2D 桌宠

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a14f0e0](https://github.com/A8Chann/dsh-pet-live2d/tree/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 74](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=74&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 14,804](https://img.shields.io/static/v1?label=npm+30d&message=14%2C804&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d)
<!-- END META -->

> **功能**：在 DSH Web 界面显示可拖动、跟随鼠标并随会话状态切换动作和表情的 Live2D 宠物。

> **亮点**：[Q01](#research-q01) 角色把工具活动、等待和终止等宿主事件映射为可调的动作与声音，同时以贴边锚点维护位置。

> **主要限制**：[Q02](#research-q02) blocked 与未知结束原因可以触发庆祝，网页静音未核对声音帧的会话身份。[Q03](#research-q03) 内置素材更新只用清单识别已修改的副本。

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
  - [Q01 · 角色反馈比原生提示和静态装饰增加了什么？](#detail-section-11)
  - [Q02 · 完成、取消和多会话提醒有哪些可判断与不可判断的边界？](#detail-section-12)
  - [Q03 · 运行、同步与更新分别引入哪些负担？](#detail-section-13)
  - [Q04 · 谁适合观察这套提醒，怎样验证按会话归属能减少打扰？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 用户可用角色动作观察工具、等待和结束等阶段。

原生会话状态提示可直接核对任务归属和结果。静态宠物也能提供装饰，交互与状态反馈需要另做。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 角色界面 | 动作、表情、拖拽和贴边 | 需可用的宿主和图形运行时 |
| 会话提醒 | 把阶段映射到动画与声音 | 全局动画和网页静音有多会话限制 |
| 设置和素材 | 管理共享装扮、相位与本地位置 | 内置模型升级前需备份同名自定义素材 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 与宿主事件 | 必需 | 路由和会话阶段 | 回宿主原生状态 |
| 图形能力与 Cubism Core | 渲染必需 | 加载角色模型 | 检查本地 Core 或 CDN |
| 可用的素材与授权 | 使用素材时必需 | 载入动作与贴图 | 采用有授权的素材 |
| 对应平台壳 | 桌面层必需 | 运行独立桌宠 | 保留页面内显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份宠物和设置目录 | 在隔离环境加载模型 |
| 观察 | 比对一次宿主任务与动画 | 不以庆祝替代结果确认 |
| 退出 | 停用提醒和宠物，按需恢复素材 | 回到原生状态提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Core 下载及本机图形资源 | 核对素材、宿主及浏览器 | 未测安装成本 |
| 持续 | 动画、连接和轮询 | 检查相位与提醒是否准确 | 未测帧率、功耗 |
| 恢复 | 备份及恢复空间 | 处理同名素材覆盖或重载 | 未测恢复工时 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 角色状态反馈 | 原生事件到相位与动作 | 用户识别效果与误报频率 |
| 网页锚定 | 边距、夹紧和旧档兼容路径 | 所有视口与缩放的表现 |
| 设置同步 | 宿主文件及客户端回退 | 多窗口并发写与素材恢复 |

> **思考**：[Q02](#research-q02) blocked 与未知结束原因可以触发庆祝，网页静音未核对声音帧的会话身份。[Q03](#research-q03) 内置素材更新只用清单识别已修改的副本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 角色把工具活动、等待和终止等宿主事件映射为可调的动作与声音，同时以贴边锚点维护位置。

相位快照和提醒帧分离，避免同相位跨会话的提醒被全局动画去重压掉。相位变化不强制打断手动播放。资源白名单和设置通道分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) blocked 与未知结束原因可以触发庆祝，网页静音未核对声音帧的会话身份。[Q03](#research-q03) 内置素材更新只用清单识别已修改的副本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 保持观察，在备份素材的隔离环境对照宿主状态。出现错误庆祝或漏提醒时关闭宠物音效，回到原生状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

宿主、事件、存储和渲染接线获得固定源码支持。误报与漏报条件来自静态分支，发生频率待验证。按会话身份约束提示是设计假设。

- 已检查：作者 README、包清单、源码路径 dsh-live2d-pet/cordis.patch.yml、dsh-live2d-pet/lib/index.js、dsh-live2d-pet/lib/client.js、dsh-live2d-pet/package.json、dsh-live2d-pet/pets/ds-whale-girl/LICENSE、dsh-live2d-pet/lib/settings.js 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 dsh-live2d-pet 的作者材料及代表性 Web 源码。桌面壳独立构建只引用作者发布边界，未核实桌面实际行为。未访问 CDN 或运行宿主。
- 下一步：以两会话验证 completed、blocked、主动取消及掉线时的原生状态、SSE 和声音，另在隔离素材目录对照同名文件升级前后字节。

**分析版本**

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.6.0（[固定提交 a14f0e0](https://github.com/A8Chann/dsh-pet-live2d/tree/a14f0e0a267f48e3bb8c6081c02614a77fef6949)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 将提醒帧和前台会话绑定，并为 blocked 或未知提供独立结果提示，可能减少背景会话漏报。

以两会话验证 completed、blocked、主动取消及掉线时的原生状态、SSE 和声音，另在隔离素材目录对照同名文件升级前后字节。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1423 | — | — | 22981 |
| .js | source | 7 | 14205 | 9321 | 4340 | — |
| .ts | source | 1 | 32 | 18 | 13 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-10），可前往 [GitHub Issues](https://github.com/A8Chann/dsh-pet-live2d/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 网页用户能否用这只 Live2D 宠物辨认会话状态，同时保留界面可用性、提醒可控性和自定义素材？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 角色反馈比原生提示和静态装饰增加了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对在同一 DSH Web 窗口持续使用模型、喜欢角色反馈的用户，宠物把工具执行和会话结束等宿主活动表现为动作、表情、台词和可选提示音。适合检验的任务是一次需要等待工具或用户输入的短会话，比较用户能否正确识别何时需要切回原会话。原生状态提示能给出更直接的会话归属，静态宠物可提供相似的装饰，两者都无需这一层状态转换。

Cordis bundle 加载 host 路由和 Web 客户端。host 订阅状态、工具等事件，SSE 新连接先取得全局相位快照，再接受实时帧；客户端等宠物就绪后建立 EventSource，依照配置映射相位为动作和表情。动画相位与声音帧分开，可以让同一相位的第二个会话仍到达声音分支。客户端的贴边位置存为左右边与像素偏移，兼容旧比例及像素存档。重新投影时先夹到当前视口再记锚。增量是将宿主事件转成有角色形象的反馈和可调互动，消息发送、停止和结果判读仍在宿主。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/cordis.patch.yml:1-8](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/cordis.patch.yml#L1-L8)

固定 bundle 入口。

```text
# dsh-live2d-pet bundle patch: inserts its plugin row into the web plugin
# roster. One row mounts both halves — the host side (Live2D pet discovery,
# the model reference-closure asset route, the runtime route) and the browser
# side (the floating Live2D pet surface, served from this package's
# lib/client.js).
- insert:
    - id: live2d-pet
      name: dsh-pet-live2d
```

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1900-1908](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1900-L1908)

宿主注入并真实注册路由。

```text
  ctx.inject(['webServer'], (host) => {
    for (const route of buildRoutes(hub, display, dshHome())) {
      try {
        host.effect(() => host.webServer.register(route), 'live2d-pet: route ' + route.path)
      } catch (error) {
        host.logger?.warn('live2d-pet: route ' + route.path + ' failed: ' + String(error))
      }
    }
  })
```

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1473-1493](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1473-L1493)

工具活动来自宿主瀑布事件，处理后继续原链。

<details>
<summary>查看原文（21行）</summary>

```text
  let toolIdleTimer
  onWaterfall('tools/pre-execute', (exec, next) => {
    if (toolIdleTimer !== undefined) {
      clearTimeout(toolIdleTimer)
      toolIdleTimer = undefined
    }
    const toolAgentId = exec?.agent?.id ?? exec?.session?.id
    cancelCelebration(toolAgentId) // 又有工具开跑：只取消这个会话的待庆祝
    const name = exec?.name
    hub.set('tool', typeof name === 'string' ? name : '')
    hub.notify('tool', typeof name === 'string' ? name : '', toolAgentId)
    return next()
  })
  onWaterfall('tools/post-execute', (_exec, _result, next) => {
    if (toolIdleTimer !== undefined) clearTimeout(toolIdleTimer)
    toolIdleTimer = setTimeout(() => {
      toolIdleTimer = undefined
      // Only step down if nothing else has taken over in the meantime.
      if (hub.phase === 'tool') hub.set('thinking', '')
    }, TOOL_IDLE_MS)
    return next()
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:1614-1658](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1614-L1658)

同源事件流的快照、订阅与清理。

<details>
<summary>查看原文（45行）</summary>

```text
function eventsRoute(hub) {  return {
    kind: 'exact',
    path: API + '/events',
    handler: (request, response) => {
      if (!loopbackOnly(request)) {
        response.writeHead(403)
        response.end()
        return
      }
      if (request.method !== 'GET' || hub === undefined) {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      response.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      })
      const frame = (payload) => {
        // Guard every write: the peer may have gone away mid-push.
        try {
          response.write('data: ' + JSON.stringify(payload) + '\n\n')
        } catch {
          /* stream already closed */
        }
      }
      frame(hub.snapshot())
      const unsubscribe = hub.subscribe(frame)
      const ping = setInterval(() => {
        try {
          response.write(': ping\n\n')
        } catch {
          /* stream already closed */
        }
      }, SSE_PING_MS)
      ping.unref?.()
      const close = () => {
        clearInterval(ping)
        unsubscribe()
      }
      request.on('close', close)
      response.on('close', close)
      response.on('error', close)
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/client.js:7992-8003](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L7992-L8003)

客户端就绪后连接到宿主事件端点。

<details>
<summary>查看原文（12行）</summary>

```text
    // ---- session activity (#4) -----------------------------------------
    // The host pushes the agent's coarse phase over same-origin SSE; each
    // transition drives a motion + expression so the pet visibly follows what
    // the assistant is doing. EventSource reconnects on its own.
    useEffect(() => {
      if (!ready || typeof window.EventSource === "undefined") return undefined;
      let source;
      try {
        source = new window.EventSource(API + "/events");
      } catch {
        return undefined;
      }
```

</details>

**依据 6 · 源码核查**：[dsh-live2d-pet/lib/client.js:8145-8162](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L8145-L8162)

相位接到表情、台词与动作组。

<details>
<summary>查看原文（18行）</summary>

```text
          } else {
            motion.current.setSustain(null);
          }
        }
        const expression = phaseExpressionRef.current[phase];
        if (expression !== undefined) {
          phasePinsRef.current[expression] = true;
          commitPinsRef.current();
        }
        // 相位台词（pet.json 的 `lines.phase.<相位>`，用户可在设置里改）。
        // 空字符串 = 这个相位不弹（idle 就没有），所以这里只是"有才弹"。
        const line = linesNow().phase[phase] ?? "";
        if (line !== "") say(line);
      };
      // The sustain loop lives in the controller, but the phase -> group map
      // comes from the pet manifest, so hand the resolver over. 池子里抽到过动作的
      // 相位优先用它自己那一轮的结果，否则重播的会是另一套动作。
      motion.current.setPhaseResolver((phase) => phaseGroupRef.current[phase] ?? phaseMotionRef.current[phase]);
```

</details>

**依据 7 · 源码核查**：[dsh-live2d-pet/lib/client.js:6434-6470](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L6434-L6470)

锚点定位和旧存档读取。

<details>
<summary>查看原文（37行）</summary>

```text
    const anchorFromPos = (p, width) => {
      const left = window.innerWidth - p.right - width;
      const centre = left + width / 2;
      const side = centre <= window.innerWidth / 2 ? "left" : "right";
      const offset = side === "left" ? left : p.right;
      return { side, offset, bottom: p.bottom };
    };
    const posFromAnchor = (a, width) => ({
      right: a.side === "left" ? (window.innerWidth - a.offset - width) : a.offset,
      bottom: a.bottom,
    });

    const [petId, setPetId] = useState(() => loadStored().petId);
    const [size, setSize] = useState(() => {
      const stored = loadStored().size;
      return typeof stored === "number" && stored >= MIN_SIZE && stored <= MAX_SIZE ? stored : DEFAULT_SIZE;
    });
    const [pos, setPos] = useState(() => {
      const stored = loadStored();
      const width = size;
      // 新存档：按「锚边 + 像素偏移」还原。
      if ((stored.side === "left" || stored.side === "right") && typeof stored.offset === "number") {
        const p = posFromAnchor({ side: stored.side, offset: stored.offset, bottom: typeof stored.bottom === "number" ? stored.bottom : 0 }, width);
        return { right: clampRight(p.right, width), bottom: clampBottom(p.bottom, width) };
      }
      // 上一版存档是中心比例 fx/fy：换算成像素。
      if (typeof stored.fx === "number" && typeof stored.fy === "number") {
        const p = {
          right: window.innerWidth - stored.fx * window.innerWidth - width / 2,
          bottom: window.innerHeight - stored.fy * window.innerHeight - width / 2,
        };
        return { right: clampRight(p.right, width), bottom: clampBottom(p.bottom, width) };
      }
      // 更老的存档只有 right/bottom。
      const right = typeof stored.right === "number" ? Math.max(0, stored.right) : 24;
      const bottom = typeof stored.bottom === "number" ? Math.max(-BOTTOM_OVERHANG_MAX, stored.bottom) : 0;
      return { right: clampRight(right, width), bottom: clampBottom(bottom, width) };
```

</details>

**依据 8 · 源码核查**：[dsh-live2d-pet/lib/client.js:6484-6492](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L6484-L6492)

落点夹紧后回算锚并写入存档。

```text
    /** 把锚落成像素、夹进视口并写档；夹过之后以最终落点回算锚，避免下次继续越界。 */
    const commitAnchor = (a, width) => {
      const raw = posFromAnchor(a, width);
      const right = clampRight(raw.right, width);
      const bottom = clampBottom(raw.bottom, width);
      anchorRef.current = anchorFromPos({ right, bottom }, width);
      saveStored({ right: Math.round(right), bottom: Math.round(bottom), side: anchorRef.current.side, offset: Math.round(anchorRef.current.offset), fx: undefined, fy: undefined });
      return { right, bottom };
    };
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 完成、取消和多会话提醒有哪些可判断与不可判断的边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

宿主在已观察到 running 的会话再次 idle 时查最近 turn/end。已知异常原因包含 error、aborted、interrupted、max-tokens，用户主动中止走安静归位。旧宿主拿不到 reason 且本轮曾收到 agent/error 时也可报失败。其余值进入完成逻辑，包括源码明确写出的 blocked 和未知，所以庆祝仅是插件映射，不能当任务成功回执。完成逻辑使用 450 ms 计时器，后续工具、运行或输入可撤销；默认等待任意正在运行的子代理集合清空。该集合没有按父会话分组，不同主会话存在交叉延迟的条件。

声音帧有 sessionId 和唯一 key，客户端按 key 去重。网页播放从 frame 读取 phase 和 key，调用只接受 phase 的播放函数。免打扰使用文档可见性和窗口焦点，因此没有把当前所见会话与帧的 sessionId 对照。同一窗口正在看 A 时，后台会话 B 结束仍可能因 A 所在页面可见而被静音，实际效果需双会话验证。网页只通过 sound 帧触发，老宿主缺少待办轮询能力时，提问事件仍能推相位但该分支未发独立声音帧。桌面壳目前可用相位变化作为声音后备，这项作者说明只作为另一发行形态的边界。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:1330-1352](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1330-L1352)

终止原因读取及异常分类。

<details>
<summary>查看原文（23行）</summary>

```text
  /** 读本会话最近一条 `turn/end` 的 reason；拿不到返回 undefined（旧宿主降级）。 */
  const lastTurnReason = (agent) => {
    try {
      const session = agent?.session
      const events = typeof session?.snapshotEvents === 'function' ? session.snapshotEvents() : undefined
      if (!Array.isArray(events)) return undefined
      for (let i = events.length - 1; i >= 0; i -= 1) {
        const event = events[i]
        if (event?.type === 'turn/end') return event.data?.reason
      }
      return undefined
    } catch {
      return undefined
    }
  }
  const isUserAbort = (reason) => {
    if (!reason || reason.kind !== 'aborted') return false
    const cause = reason.reason
    if (cause === 'user' || cause === 'cancel') return true
    return Boolean(cause && typeof cause === 'object' && (cause.kind === 'user' || cause.kind === 'cancel'))
  }
  const isAbnormalReason = (reason) => Boolean(reason
    && ['error', 'aborted', 'interrupted', 'max-tokens'].includes(reason.kind))
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1370-1388](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1370-L1388)

450 ms 计时和全局子代理数量门槛。

<details>
<summary>查看原文（19行）</summary>

```text
  const DONE_DEBOUNCE_MS = 450
  // 提醒范围 = 'main' 时不等子会话（主会话一结束就庆祝）；其余范围沿用子会话聚合。
  const scopeIsMainOnly = () => {
    try { return typeof getScope === 'function' && getScope() === 'main' } catch { return false }
  }
  const scheduleCelebration = (agent) => {
    const agentId = sessionKeyOf(agent)
    if (!scopeIsMainOnly() && activeSubagents > 0) { pendingCelebrateSessions.add(agentId); return }
    if (inboxBusy(agent)) return // 还有排队输入：这一轮不是真正的结束
    const previous = celebrateTimers.get(agentId)
    if (previous !== undefined) clearTimeout(previous)
    const timer = setTimeout(() => {
      celebrateTimers.delete(agentId)
      if (!scopeIsMainOnly() && activeSubagents > 0) { pendingCelebrateSessions.add(agentId); return }
      hub.celebrate()
      hub.notify('done', '', agentId)
    }, DONE_DEBOUNCE_MS)
    celebrateTimers.set(agentId, timer)
    timer?.unref?.()
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1394-1411](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1394-L1411)

子代理集合按运行中的 ID 汇总。

<details>
<summary>查看原文（18行）</summary>

```text
    // 子代理的 status 也是全局事件；主会话的「完成/失败」判定不能拿它当自己结束。
    if (agent?.session?.header?.origin === 'subagent') {
      if (status === 'running') {
        runningSubagents.add(agent.id)
        activeSubagents = runningSubagents.size
        if (hub.phase !== 'waiting' && hub.phase !== 'asking') {
          hub.set('helper', agent.session.header.title ?? agent.id ?? '')
        }
        hub.notify('helper', '', agent.id)
      } else if (status === 'idle') {
        runningSubagents.delete(agent.id)
        activeSubagents = runningSubagents.size
        if (activeSubagents > 0) return
        const waiting = [...pendingCelebrateSessions]
        pendingCelebrateSessions.clear()
        if (waiting.length > 0) {
          hub.celebrate()
          for (const id of waiting) hub.notify('done', '', id)
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:1427-1451](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1427-L1451)

未知与 blocked 进入完成，用户中止不报失败。

<details>
<summary>查看原文（25行）</summary>

```text
    if (status !== 'idle') return
    const key = sessionKeyOf(agent)
    if (!ranSessions.delete(key)) { // 插件加载时就空闲的会话：不庆祝
      if (hub.phase !== 'done') hub.set('idle', '')
      return
    }
    const reason = lastTurnReason(agent)
    const wasError = erredSessions.delete(key)
    if (isAbnormalReason(reason)) {
      if (isUserAbort(reason)) {
        hub.set('idle', '')  // 用户主动中止：安静归位
      } else {
        hub.set('failed', '')                    // 出错 / 中断 / 超长：判失败，不庆祝
        hub.notify('failed', '', key)
      }
      return
    }
    if (reason === undefined && wasError) {         // 旧宿主无 reason，但本轮见过 agent/error
      hub.set('failed', '')
      hub.notify('failed', '', key)
      return
    }
    // completed / blocked / 未知：按完成处理（延迟 + 可取消）
    if (hub.phase !== 'done') hub.set('idle', '')
    scheduleCelebration(agent)
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/index.js:1220-1240](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1220-L1240)

声音帧含 sessionId 与独立 key。

<details>
<summary>查看原文（21行）</summary>

```text
  /**
   * 发一条独立的“提醒事件”。它不参与全局 phase 去重，因此同一个 phase 的
   * 第二个会话事件也会被推给浏览器；浏览器按 key 去重并播放提示音。
   */
  notify(phase, detail = '', sessionId = '', key) {
    const eventKey = key ?? `${phase}:${sessionId}:${Date.now()}:${++this.eventSeq}`
    const payload = {
      type: 'sound',
      phase,
      detail,
      sessionId,
      key: eventKey,
      at: Date.now(),
    }
    for (const listener of this.listeners) {
      try {
        listener(payload)
      } catch {
        /* a dead stream must not break the others */
      }
    }
```

</details>

**依据 6 · 源码核查**：[dsh-live2d-pet/lib/client.js:8190-8228](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L8190-L8228)

声音按 key 去重，但播放分支未使用 sessionId。

<details>
<summary>查看原文（39行）</summary>

```text
      const onMessage = (event) => {
        let payload;
        try {
          payload = JSON.parse(event.data);
        } catch {
          return;
        }
        // 独立的 per-session 提醒帧：每个 key 单独响一次，不受全局 phase 去重影响。
        // 同一页面可能有多份客户端实例，用 window 级 key 集合去重；跨窗口不再用
        // claim 抢，避免把当前窗口自己判掉（宁可多窗口重复，也不漏）。
        if (payload?.type === "sound") {
          const soundPhase = payload.phase;
          if (typeof soundPhase !== "string") return;
          sawSoundFrame = true;
          const key = typeof payload.key === "string" ? payload.key : soundPhase;
          const seen = window.__dshPetSeenSoundFrames instanceof Set
            ? window.__dshPetSeenSoundFrames
            : (window.__dshPetSeenSoundFrames = new Set());
          if (seen.has(key)) return;
          seen.add(key);
          if (seen.size > 300) {
            let drop = 100;
            for (const oldKey of seen) {
              seen.delete(oldKey);
              if (--drop <= 0) break;
            }
          }
          if (isPhaseSoundOwner(layerStore.value.owner)) playPhaseSoundNow(soundPhase);
          if (soundPhase !== phaseRef.current) {
            setPhaseState(soundPhase);
            phaseRef.current = soundPhase;
            const soundOwner = motion.current.kind();
            if (motion.current.isPlaying() && soundOwner !== "phase") {
              pendingPhase.current = soundPhase;
            } else {
              applyPhase(soundPhase);
            }
          }
          return;
```

</details>

**依据 7 · 源码核查**：[dsh-live2d-pet/lib/client.js:4931-4952](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L4931-L4952)

播放只按相位、显示状态和焦点判断。

<details>
<summary>查看原文（22行）</summary>

```text
  const reminderSoundAllowed = (phase) => {
    if (typeof document === "undefined") return true;
    if (isDesktopShell) return true;
    const notify = PHASE_OVERRIDES.notify ?? {};
    if (phase === "helper" && (notify.scope ?? "wait") !== "all") return false;
    const mode = notify.currentMode ?? "hidden";
    if (document.visibilityState === "hidden") return true;
    if (mode === "always") return true;
    if (mode === "unfocused" && document.hasFocus() === false) return true;
    return false;
  };

  const playPhaseSoundNow = (phase) => {
    if (!reminderSoundAllowed(phase)) return;
    if (!FLAGS.soundEnabled || !(TUNING.soundVolume > 0)) return;
    if (Object.prototype.hasOwnProperty.call(PHASE_OVERRIDES.sounds, phase)
      && PHASE_OVERRIDES.sounds[phase].length === 0) return;
    const uploaded = uploadedSoundFor(phase);
    if (uploaded !== undefined) {
      stopUploadedSound();
      playUploadedSound(phase, uploaded, TUNING.soundVolume);
      return;
```

</details>

**依据 8 · 源码核查**：[dsh-live2d-pet/lib/index.js:1514-1526](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1514-L1526)

提问瀑布只变更相位。

<details>
<summary>查看原文（13行）</summary>

```text
  onWaterfall('user-questions/request', (_request, next) => {
    hub.set('asking', '')
    const answered = typeof next === 'function' ? next() : undefined
    const back = () => {
      if (hub.phase === 'asking') hub.set('thinking', '')
    }
    if (answered !== null && typeof answered?.then === 'function') {
      answered.then(back, back)
      return answered
    }
    back()
    return answered
  })
```

</details>

**依据 9 · 源码核查**：[dsh-live2d-pet/lib/index.js:1566-1593](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1566-L1593)

宿主轮询能力存在时给提问与审批发声。

<details>
<summary>查看原文（28行）</summary>

```text
  // **先做能力探测再接管**：这个方法 0.2.2 才有（0.2.1-rc.2 的 gateway 上没有）。
  // 老宿主上它拿不到、清单恒为空，若照旧执行 `else hub.set('thinking')`，
  // 就会把 `approval/request` 刚设好的 waiting 每 250 ms 踩回去一次 —— 用户看到的是
  // "审批时宠物闪一下就回去干活"。所以方法不存在时整段不介入，交回上面的事件订阅。
  const seenPendingKeys = new Set()
  const pendingTimer = setInterval(() => {
    let gateway
    try {
      gateway = typeof ctx.get === 'function' ? ctx.get('typertGateway') : undefined
    } catch {
      gateway = undefined
    }
    if (typeof gateway?.getPendingRemoteEvents !== 'function') return
    try {
      const rows = gateway.getPendingRemoteEvents() ?? []
      let phase = ''
      const nextPending = new Set()
      for (const row of rows) {
        if (row?.event !== 'approval/request' && row?.event !== 'user-questions/request') continue
        const kind = row.event === 'approval/request' ? 'waiting' : 'asking'
        phase = kind === 'waiting' ? 'waiting' : (phase === '' ? 'asking' : phase)
        const agentId = row.agentId === undefined ? '' : String(row.agentId)
        const key = `pending:${row.event}:${agentId}`
        nextPending.add(key)
        if (!seenPendingKeys.has(key)) {
          seenPendingKeys.add(key)
          hub.notify(kind, '', agentId)
        }
```

</details>

**依据 10 · 源码核查**：[dsh-live2d-pet/lib/client.js:8230-8243](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L8230-L8243)

普通相位在桌面壳才作为声音回退。

<details>
<summary>查看原文（14行）</summary>

```text
        const phase = payload?.phase;
        if (typeof phase !== "string") return;
        const initial = !receivedInitialPhase;
        receivedInitialPhase = true;
        setPhaseState(phase);
        if (phase === phaseRef.current) return;
        phaseRef.current = phase;
        // 网页端：phase 帧只负责动画，声音统一由 type:"sound" 帧按 session/key 触发。
        // 桌面壳：Rust 宿主半区还没有 sound 帧，那里继续按"相位变了就响"（与 3.5.0 一致），
        // 否则桌面用户在 #16 之后会彻底听不到提醒。
        if (!initial && !sawSoundFrame && isDesktopShell
          && isPhaseSoundOwner(layerStore.value.owner)) {
          playPhaseSoundNow(phase);
        }
```

</details>

#### 缺口

- 没有两个会话并发和老宿主的实测事件序列
  **影响**：不能断言误报及漏报频率
  **进一步探讨**：同时跑前台与后台测试会话，记录 reason、SSE 和最终是否出声

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行、同步与更新分别引入哪些负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次渲染依赖可用的 Web 宿主、图形环境和 Cubism Core。资产路由只在模型引用闭包中命中路径，随后交给有大小上限的文件服务。缺本地 Core 时，host 从官方 CDN 取脚本，检查体积和特征字符串后缓存；下载异常返回 502，代码这一步没有固定版本摘要。作者材料把内置模型美术与代码分别列出许可。选择桌面显示还涉及同版本的可选平台包和壳构建。

位置和尺寸保留在客户端存储。装扮和配置经同源请求共享，宿主文件对 tuning、overrides 和 outfit 三类整体合并，写入递增 rev；单个对象的并发改动没有按字段合并或比较预期版本。宿主读文件失败时回空默认值，写路径直接覆盖文件。内置模型首次安装时递归复制。更新使用 pet.json 的历史或本次同步指纹判断副本归属，若清单未改但同名表情、贴图或动作被自定义，随后递归覆盖仍会改写这些文件。自定义新文件未必受影响。停用界面与恢复文件分开操作。采用成本包括首次核对 Core 和授权、持续渲染资源与排障、升级前保留素材目录，以及需要时还原设置。没有每会话实际资源和恢复工时测量。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/package.json:44-59](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/package.json#L44-L59)

声明 Web 形态及桌面可选平台包。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.1.5-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "optionalDependencies": {
    "dsh-pet-live2d-desktop-darwin-arm64": "3.6.0",
    "dsh-pet-live2d-desktop-win32-x64": "3.6.0"
  },
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1011-1021](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1011-L1021)

资产白名单和文件大小分类。

<details>
<summary>查看原文（11行）</summary>

```text
      const pet = buildCatalog().find((candidate) => candidate.id === id)
      // The closure probe is a Set lookup on scan-time normalized paths, so a
      // crafted '..' / '.' segment can never match a real file.
      if (pet === undefined || !pet.closure.has(rel)) {
        response.writeHead(404)
        response.end()
        return
      }
      const ext = extname(rel).toLowerCase()
      const cap = ext === '.json' ? CAP_JSON : (ext === '.moc3' ? CAP_MODEL : CAP_IMAGE)
      serveFile(request, response, pet.dir, join(pet.dir, rel), cap)
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1035-1067](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1035-L1067)

CDN 下载的实际检查、缓存与 502。

<details>
<summary>查看原文（33行）</summary>

```text
const CORE_CDN = 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'

/** 本地没有 Core 时：去 Live2D 官方 CDN 拿一份，顺手缓存到本地。 */
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
    response.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'content-length': String(bytes.length),
      'cache-control': 'public, max-age=86400',
      'x-live2d-core-source': 'cdn',
    })
    response.end(bytes)
  } catch (error) {
    sendJson(response, 502, {
      ok: false,
      error: 'cubism-core-unavailable',
      detail: String(error?.message ?? error),
      hint: 'Cubism Core 是 Live2D 的专有运行时，本插件不内置。可以让这台机器能访问 '
        + CORE_CDN + '，或自行下载后放到 ' + join(runtimeDir(), 'live2dcubismcore.min.js'),
    })
```

</details>

**依据 4 · 作者声明**：[dsh-live2d-pet/pets/ds-whale-girl/LICENSE:1-10](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/pets/ds-whale-girl/LICENSE#L1-L10)

作者文件列出美术许可。

<details>
<summary>查看原文（10行）</summary>

```text
DS鲸鱼娘 — Live2D 模型素材
================================================================================

本目录下的一切美术内容（c_0120.moc3 / 贴图 / expressions / motions / model /
catalog.json / 截图）采用：

    CC BY-NC-SA 4.0
    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh

    署名 — 非商业性使用 — 相同方式共享
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/settings.js:60-97](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/settings.js#L60-L97)

顶层合并、递增 rev、直接写文件的实现。

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * 写共享设置（**合并写**：只动传进来的那几项，别把别的窗口写的擦掉）。
 *
 * 返回写好之后的那一份（含新的 `rev`）。写失败时返回 `null` —— 调用方要能区分
 * "没写成功"和"写成功了"，否则页面会以为同步好了。
 */
export function writeSettings(home, patch) {
  if (patch === null || typeof patch !== 'object') return null
  const current = readSettings(home)
  const next = {
    tuning: current.tuning,
    overrides: current.overrides,
    outfit: current.outfit,
    rev: current.rev + 1,
    at: Date.now(),
  }
  let touched = false
  for (const key of SETTINGS_KEYS) {
    const value = patch[key]
    if (value === null) continue          // 没传 = 不动这一项
    if (value === undefined) continue
    if (typeof value !== 'object' || Array.isArray(value)) continue
    next[key] = value
    touched = true
  }
  // **没有实际内容就不算一次写入**：不推进 `rev`、也不落盘。
  //
  // 这一条是防回环的：页面按 `rev` 判断"我这份是不是旧的"，如果"只带 rev 的空写"也推进
  // 版本号，另一个窗口就会以为有变化、于是回写一次 → 互相推着转。
  // （单元测试先红在这里，才有了这条注释。）
  if (!touched) return current
  try {
    mkdirSync(dirname(settingsPath(home)), { recursive: true })
    writeFileSync(settingsPath(home), JSON.stringify(next, null, 2) + '\n')
    return next
  } catch {
    return null
  }
```

</details>

**依据 6 · 源码核查**：[dsh-live2d-pet/lib/client.js:4292-4316](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L4292-L4316)

客户端先留本地副本，再发共享设置请求。

<details>
<summary>查看原文（25行）</summary>

```text
  const persistShared = (patch) => {
    for (const [name, key] of Object.entries(sharedKeys())) {
      if (patch[name] === undefined) continue;
      writeLocal(key, patch[name]);
    }
    if (applyingHost) return;
    if (hostAvailable === false) return;
    try {
      void fetch(SETTINGS_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
        cache: "no-store",
      }).then((response) => {
        if (response.status === 404) { hostAvailable = false; return null; }
        if (!response.ok) return null;
        return response.json();
      }).then((payload) => {
        if (payload === null || payload === undefined) return;
        hostAvailable = true;
        if (typeof payload.rev === "number") sharedRev = payload.rev;
      }).catch(() => { /* 宿主不在就算了，本地那份已经写好了 */ });
    } catch {
      /* 同上 */
    }
```

</details>

**依据 7 · 源码核查**：[dsh-live2d-pet/lib/index.js:754-791](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L754-L791)

更新只验 pet.json，随后递归覆盖。

<details>
<summary>查看原文（38行）</summary>

```text
      const targetManifest = join(target, 'pet.json')

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
      notes.push(name + '：宠物默认值更新到 ' + version + '（原先 ' + was + '）')
```

</details>

#### 缺口

- 没有性能数据及相同文件并发修改的故障注入
  **影响**：无法估计帧率、写入失败或冲突的实际代价
  **进一步探讨**：隔离目录构造同名素材和双写，备份前后逐文件比对并记录帧率

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合观察这套提醒，怎样验证按会话归属能减少打扰？

**研究主题**：采用判断、新假设与验证

#### 完整回答

在希望观察 DSH Web 工作节奏且可用隔离环境的用户中，先观察原生状态旁的角色动画，以一个可人工判读的工具调用作为样本。当前保持观察，因为结束相位把 blocked 纳入庆祝、当前会话静音没有匹配会话 ID，关键通知不能由角色承担。看到成功提示与宿主结果不符、需要回答时没提醒或素材发生覆盖，就关闭宠物提醒或停用插件，回到原生会话提示；有定制素材时还原隔离备份。

设计假设是客户端把当前可见会话 ID 与提示帧 ID 匹配，并对未知或 blocked 分开标记，避免把页面可见直接当成该任务已被用户看到。最小对照为在同一可见页面启动 A 和 B，依次让 A 完成、B 在后台 blocked，再加入两会话的子代理并交换前台。对照现有规则与身份绑定规则，记录每一会话应发及实发提醒、提醒延迟、用户正确判断率。若错过的必要提醒未减少或无关提醒明显增加，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:1427-1451](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1427-L1451)

提供 blocked 和未知的对照输入。

<details>
<summary>查看原文（25行）</summary>

```text
    if (status !== 'idle') return
    const key = sessionKeyOf(agent)
    if (!ranSessions.delete(key)) { // 插件加载时就空闲的会话：不庆祝
      if (hub.phase !== 'done') hub.set('idle', '')
      return
    }
    const reason = lastTurnReason(agent)
    const wasError = erredSessions.delete(key)
    if (isAbnormalReason(reason)) {
      if (isUserAbort(reason)) {
        hub.set('idle', '')  // 用户主动中止：安静归位
      } else {
        hub.set('failed', '')                    // 出错 / 中断 / 超长：判失败，不庆祝
        hub.notify('failed', '', key)
      }
      return
    }
    if (reason === undefined && wasError) {         // 旧宿主无 reason，但本轮见过 agent/error
      hub.set('failed', '')
      hub.notify('failed', '', key)
      return
    }
    // completed / blocked / 未知：按完成处理（延迟 + 可取消）
    if (hub.phase !== 'done') hub.set('idle', '')
    scheduleCelebration(agent)
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1224-1233](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/index.js#L1224-L1233)

帧已有可用的会话身份。

<details>
<summary>查看原文（10行）</summary>

```text
  notify(phase, detail = '', sessionId = '', key) {
    const eventKey = key ?? `${phase}:${sessionId}:${Date.now()}:${++this.eventSeq}`
    const payload = {
      type: 'sound',
      phase,
      detail,
      sessionId,
      key: eventKey,
      at: Date.now(),
    }
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/client.js:4931-4945](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L4931-L4945)

现有播放规则只使用页面级条件。

<details>
<summary>查看原文（15行）</summary>

```text
  const reminderSoundAllowed = (phase) => {
    if (typeof document === "undefined") return true;
    if (isDesktopShell) return true;
    const notify = PHASE_OVERRIDES.notify ?? {};
    if (phase === "helper" && (notify.scope ?? "wait") !== "all") return false;
    const mode = notify.currentMode ?? "hidden";
    if (document.visibilityState === "hidden") return true;
    if (mode === "always") return true;
    if (mode === "unfocused" && document.hasFocus() === false) return true;
    return false;
  };

  const playPhaseSoundNow = (phase) => {
    if (!reminderSoundAllowed(phase)) return;
    if (!FLAGS.soundEnabled || !(TUNING.soundVolume > 0)) return;
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/client.js:8200-8217](https://github.com/A8Chann/dsh-pet-live2d/blob/a14f0e0a267f48e3bb8c6081c02614a77fef6949/dsh-live2d-pet/lib/client.js#L8200-L8217)

现有网页帧去重与播放接线。

<details>
<summary>查看原文（18行）</summary>

```text
        if (payload?.type === "sound") {
          const soundPhase = payload.phase;
          if (typeof soundPhase !== "string") return;
          sawSoundFrame = true;
          const key = typeof payload.key === "string" ? payload.key : soundPhase;
          const seen = window.__dshPetSeenSoundFrames instanceof Set
            ? window.__dshPetSeenSoundFrames
            : (window.__dshPetSeenSoundFrames = new Set());
          if (seen.has(key)) return;
          seen.add(key);
          if (seen.size > 300) {
            let drop = 100;
            for (const oldKey of seen) {
              seen.delete(oldKey);
              if (--drop <= 0) break;
            }
          }
          if (isPhaseSoundOwner(layerStore.value.owner)) playPhaseSoundNow(soundPhase);
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
