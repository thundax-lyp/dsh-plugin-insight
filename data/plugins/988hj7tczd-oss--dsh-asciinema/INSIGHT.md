# dsh-asciinema

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c478634](https://github.com/988hj7tczd-oss/dsh-asciinema/tree/c47863413886ffac9b66ee13a9ab276ab195d5d9)

<!-- BEGIN META -->
[![npm 30d 384](https://img.shields.io/static/v1?label=npm+30d&message=384&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-asciinema) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-asciinema)
<!-- END META -->

> **实现功能**：把DSH会话工具结果文字缓冲为自有cast对象文件，提供会话录制/标记、HTML回看与纯文本转换。

> **核心亮点**：结合Session对象/ID隔离、单writer事件字节护栏及cast/HTML/文本三入口，减少手工保存工具文字。详见[Q02](#research-q02)。

> **风险与缺陷**：模板../../定位错误、帧间隔max再求和导致计时偏差，stop先移除再保存无重试句柄/卸载drain；输出含秘密/内容替换与导入上限需核，非官方互通。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 录的到底是什么，适合何种复盘？](#detail-section-11)
  - [Q02 · 会话隔离、有界录制和格式如何连接？](#detail-section-12)
  - [Q03 · 时序与终端显示保真有什么实际问题？](#detail-section-13)
  - [Q04 · HTML生成、文件保存与失败恢复是否可靠？](#detail-section-14)
  - [Q05 · 启动与交付形态怎么核？](#detail-section-15)
  - [Q06 · 首次持续失败成本与效果如何？](#detail-section-16)
  - [Q07 · 推荐和可继续探讨方向是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合把DSH会话中工具结果的可见文字留成可回看/分享的本地材料。term_rec开始/停止/标记/状态，term_play生成HTML或文本，term_cat拼接输出。不是终端PTY逐字节录像、视频录屏、命令重放或可验证执行审计。

录制监听tool/result完成块而非实时终端流，contentToText只取text并递归tool-result，图像/reasoning/tool-call不入文件。record_input默认false只是不录user/message输入，工具输出仍可能含原始秘密/文件内容；不能叫录制匿名。合格结果需准确说明采集范围、时序/截断、落盘成功和分享披露，不将回放当重现真实终端或任务成功。

基线是保存工具文本/手工终端录制。增量为会话事件到本地回放/文本统一工具，官方asciinema CLI/player互操作作者明确未宣称，不能凭.cast后缀/version2升级为已验证兼容。

手工保存工具文本或PTY录制；插件统一入口，但采样文字不等原终端，效果与恢复需对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| rec | 工具文字/可选输入录制 | 非PTY，输出也可含秘密 |
| scope/上限 | step停止/单writer封存 | 非某进程退出/全局预算 |
| play | 内嵌HTML或文字 | 模板路径/时间有缺口，非官方player |
| cat | 拼接去ANSI | 部分解析告警不回传 |
| autosave | 命名结束时保存 | fire-and-forget无drain/重试队列 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| 编译lib或按说明加载源码 | main/types入口 | 固定Git不预置lib，先build并核资产相对路径 |
| Node>=23.6或对应strip支持 | 直接TS测试/源码形态 | 发布ESM与宿主版本仍需精确核 |
| DSH tools/fs与session事件 | 工具/文件/录制 | inject无sessions但监听依事件契约 |
| 可写私有castsDir和分享许可 | 明文cast/内嵌HTML | 输出也可有秘密，输入默认false非脱敏 |
| 模板/浏览器 | 离线回看 | 当前路径有误；被catch接住才fallback，readText异步拒绝可令play失败；独立模板可?url fetch |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 核包 | 明确源码/已构建，核实际宿主依赖 | README邻dsh-src是作者开发布局，当前package列registry版本 |
| 选范围 | 只在可信会话小录制，定maxEvents/Bytes | scope=command为step边界 |
| 停并存 | 指name，核saved/路径/截断 | 错误不丢内存后再决定重试 |
| 转/回放 | 看issues与模板能力/时间 | cat可能丢告警，不等完整原屏幕 |
| 分享 | 审工具输出/环境/输入及HTML内嵌内容 | 生成HTML不等已匿名或可公开 |
| 收尾 | 明确停/保存，备份原件 | 不能靠崩溃/卸载自动保全 |

docs/store-evidence既保留“真实宿主待执行”旧说明又追加作者CLI add/dump/remove rc0，最多是作者声明的配置生命周期材料，不等本轮运行、录制完整性或官方互操作。package宽compatibility>=0.1.0也不能替代精确代际验收。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | TS构建/宿主依赖与模板资源 | 核源码入口、路径、私有输出目录 | 构建/适配时间金额未知 |
| 持续使用 | 结果文本提取/UTF8编码、每录制默认5000事件/1MiB数据、JSON/HTML复制 | 查看截断与内容分享审查 | 无独立模型请求不等下游cat进上下文费用0；多录制/导入不受单writer总额限制 |
| 失败恢复 | 重录/手动保原件、失败写/导入/HTML重生资源 | 核丢失句柄、时间偏差、覆盖/模板失败或fallback | 无durable pending/drain，恢复时间费用未知 |



#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 会话复盘 | 工具输出到文件/HTML | 不是PTY原始/官方互操作 |
| 规模控制 | 单writer数据/事件封存 | 整体内存/导入/后续提取未界定 |
| 可分享 | 自包含文字回看 | 明文含工具秘密，需审 |
| 恢复/可追溯 | 明确saved与部分issues | 先移除后写失败、cat丢告警 |

作者16项离线单元材料是设计覆盖，未实际加载host或浏览器的限定在README写明；本轮只检查源码，不据测试数推业务效果。

> **思考**：模板../../定位错误、帧间隔max再求和导致计时偏差，stop先移除再保存无重试句柄/卸载drain；输出含秘密/内容替换与导入上限需核，非官方互通。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：结合Session对象/ID隔离、单writer事件字节护栏及cast/HTML/文本三入口，减少手工保存工具文字。详见[Q02](#research-q02)。

结合Session对象/ID隔离、单writer事件字节护栏及cast/HTML/文本三入口，减少手工保存工具文字。详见[Q02](#research-q02)。

nextDelay每次算now-lastMs的单帧间隔，又取max(该间隔,上次delay)强制不减；castDuration和播放器按各delay求和。于是1/2/1秒三个间隔被表示为1/2/2，和5秒而非4秒，是内部时序算法就可推导的偏差，未执行目标。elapsed却用lastMs-startMs，总时间与文件duration也可分歧。不能把单调不减校验通过当真实时间轴保真。

默认timestamp在toCast/停止时生成，而非保存startTime的开始epoch；env来自宿主process.SHELL/TERM非实际工具shell。宽高是配置默认100x40，未订阅终端resize，所以不是捕获真实终端几何。工具结果本身通常已有截断/包装，此处只录可见字符串，不能恢复上游未记录字节。

播放器是剥ANSI+行缓冲textContent，去\r而非终端光标覆盖，不完整解释颜色/光标/屏幕控制；cat也是简单拼接去控制序列，不模拟终端最后屏幕。parser遇坏事件可跳过并保issues，term_play显示告警，但term_cat只拒绝cast=null，丢弃其余issues，文本“成功”可能是有损解析。

playerTemplatePath用new URL('../../assets/player.html',import.meta.url)。src/cast-io.ts或编译后的lib/cast-io.js都在仓库下一层，../../会跳到仓库父目录assets，而实际模板在仓库assets；正常布局会指向错误模板位置；若ctx.fs.resolve拒绝或本地同步异常被catch接住，返回null才触发最小模板fallback。第81行直接return ctx.fs.readText的Promise没有await，其异步拒绝不被该catch捕获，会经term_play第183行await传播为失败；实际缺文件在哪个阶段报错取决于宿主fs。不能一概声称静默fallback，也不把丰富seek/marker界面当每次实际加载。decodeURIComponent(url.pathname)也非平台fileURLToPath转换，Windows路径另需核。

renderPlayerHtml先转义JSON中的</并对title做HTML转义、播放器用textContent，这是有用的内容边界。但replaceAll的replacement传字符串，输出含$&/$`/$'等替换符时可能被当替换语法扩展而非原文字面；后续全局替换__TITLE__/__CAST_URL__也可改嵌入内容同名片段。需要用固定含这些串的材料对照，不能仅</script>测试就称任意输出逐字保真。

stop先registry.take移除并停止，再await saveCastFile；写失败时活动注册表已无该录制，缺重试句柄/持久待保存队列。session/disposed也先dropSession后fire-and-forget保存，用新signal不等卸载drain，失败只warn。正常不同session同name虽registry隔离，但castsDir与工作区同一物理路径时文件名相同，可覆盖；sanitize减少路径字符不构成全局唯一或安全权限保证。

读写经ctx.fs和session cwd，真正物理/权限/覆盖策略交给宿主；castsDir/path用户可配并非插件自行围栏。整文件readText/JSON/HTML输出无导入大小上限，录制上限不限制外部.cast。

<a id="detail-section-5"></a>

### 1.4 主要限制

模板../../定位错误、帧间隔max再求和导致计时偏差，stop先移除再保存无重试句柄/卸载drain；输出含秘密/内容替换与导入上限需核，非官方互通。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先修模板路径/时间与保存pending恢复，非秘密小样也须核采集/分享范围。详见[Q07](#research-q07)。

录制监听tool/result完成块而非实时终端流，contentToText只取text并递归tool-result，图像/reasoning/tool-call不入文件。record_input默认false只是不录user/message输入，工具输出仍可能含原始秘密/文件内容；不能叫录制匿名。合格结果需准确说明采集范围、时序/截断、落盘成功和分享披露，不将回放当重现真实终端或任务成功。

基线是保存工具文本/手工终端录制。增量为会话事件到本地回放/文本统一工具，官方asciinema CLI/player互操作作者明确未宣称，不能凭.cast后缀/version2升级为已验证兼容。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。输出复盘与单录制护栏明确，模板/计时/持久恢复基础缺口需先修。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/recorder.ts、src/cast-core.ts、src/cast-io.ts、src/tools/rec.ts、src/tools/play.ts、src/tools/cat.ts、assets/player.html、docs/store-evidence.md、tsconfig.build.json、cordis.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：七运行TS关键链和播放器/包/构建/作者材料；不执行目标测试/构建/录制/文件写/浏览器或命令重放。
- 下一步：可继续固定时序/特殊串/多会话与失败文件mock核内容hash/时间/保存状态和资源，不运行真实工具或重放命令。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-asciinema](https://github.com/988hj7tczd-oss/dsh-asciinema)
- **版本号**：0.1.1（[固定提交 c478634](https://github.com/988hj7tczd-oss/dsh-asciinema/tree/c47863413886ffac9b66ee13a9ab276ab195d5d9)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索统一时间语义与范围/模板版本/保存pending收据，字面嵌入与失败可恢复，比较完整率/资源；未实现。详见[Q07](#research-q07)。

可继续固定时序/特殊串/多会话与失败文件mock核内容hash/时间/保存状态和资源，不运行真实工具或重放命令。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 246 | — | — | 2884 |
| .ts | source | 7 | 1478 | 1136 | 201 | — |
| .ts | test | 1 | 449 | 352 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-asciinema/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-asciinema/issues?q=is%3Aissue+created%3A2026-09-22T09%3A19%3A14.555Z..2026-10-22T09%3A19%3A14.555Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-asciinema/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A19%3A14.555Z..2026-10-22T09%3A19%3A14.555Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核输出采集/终端区别、会话身份和上限、内部时间轴/模板/保存恢复、明文分享与依赖成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 录的到底是什么，适合何种复盘？

**研究主题**：场景与需求

#### 完整回答

适合把DSH会话中工具结果的可见文字留成可回看/分享的本地材料。term_rec开始/停止/标记/状态，term_play生成HTML或文本，term_cat拼接输出。不是终端PTY逐字节录像、视频录屏、命令重放或可验证执行审计。

录制监听tool/result完成块而非实时终端流，contentToText只取text并递归tool-result，图像/reasoning/tool-call不入文件。record_input默认false只是不录user/message输入，工具输出仍可能含原始秘密/文件内容；不能叫录制匿名。合格结果需准确说明采集范围、时序/截断、落盘成功和分享披露，不将回放当重现真实终端或任务成功。

基线是保存工具文本/手工终端录制。增量为会话事件到本地回放/文本统一工具，官方asciinema CLI/player互操作作者明确未宣称，不能凭.cast后缀/version2升级为已验证兼容。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-18](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/README.md#L12-L18)

作者录制/离线/互操作限制。

```text
DSH 插件:把会话中的终端/工具输出录制为 **asciinema v2（`.cast`）** 文件,提供内嵌播放器
（**自带离线渲染器**,标签结构对齐 asciinema-player 数据模型）回放与 HTML 导出。

- 语义对齐官方 asciinema CLI 三动作:**rec（录制）/ play（回放）/ cat（转文本）**。
- 录制来源低侵入:订阅 `session/event` 事件流中的 `tool/result` 输出(无需依赖 terminals 服务)。
- 独立实现 cast-core,不依赖 asciinema CLI;播放器数据内嵌,**完全离线渲染,无外部请求**。
  (未与官方 asciinema play/player 做互操作验证 —— ".cast 可被官方工具解析"不在本交付宣称内)
```

**依据 2 · 源码核查**：[src/recorder.ts:51-68](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L51-L68)

内容类型提取。

<details>
<summary>查看原文（18行）</summary>

```text
/** 从 ContentBlock 数组提取可见文本(递归进 tool-result 内层)。 */
export function contentToText(blocks: readonly ContentBlock[] | undefined): string {
  if (blocks === undefined) return ''
  let text = ''
  for (const block of blocks) {
    switch (block.type) {
      case 'text':
        text += block.text
        break
      case 'tool-result':
        text += contentToText(block.content)
        break
      default:
        // reasoning/image/tool-call 不入录制文本
        break
    }
  }
  return text
```

</details>

**依据 3 · 源码核查**：[src/recorder.ts:125-143](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L125-L143)

tool结果/可选user/step边界。

<details>
<summary>查看原文（19行）</summary>

```text
  private handleEvent(event: SessionEvent): void {
    // 注意延迟以事件到达顺序计算,而非事件时间戳 —— 与 v2 相对时间轴一致。
    switch (event.type) {
      case 'tool/result': {
        const blocks = event.data.message.content[0]?.content
        const text = contentToText(blocks)
        if (text !== '') this.writer.write(text)
        break
      }
      case 'user/message': {
        if (!this.recordInput) break
        const text = contentToText(event.data.content)
        if (text !== '') this.writer.push('i', text)
        break
      }
      case 'step/end': {
        // command 范围:当前 agent 步骤结束即封存。
        if (this.scope === 'command') this.finish('step/end')
        break
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话隔离、有界录制和格式如何连接？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

每次start取exec.agent.session，注册表按session.id:name隔离，事件监听另用Session对象恒等校验，避免正常跨会话结果混录。command scope在当前step/end停止，不是某个shell进程退出；若step含多工具，范围仍整个步骤。无session启动拒绝，status却在该判断前调用active(undefined)，会列全registry活动项，不能宣称缺会话状态也隔离。

writer按事件数/文本UTF8字节预检，超限封存拒绝后续内容，保truncationCause供stop回执，合理限制单录制增长。但上限只算data字符串而非JSON/对象/HTML占用，没全局录制数量/内存上限。writer seal后SessionRecorder.active仍true直到finish，仍监听/提取后续大结果，mark可返true但writer不再收事件，不等全部处理停止。

落盘是JSON.stringify整个{version,width,height,events,...}对象，reader JSON.parse同结构。其自写reader/writer闭环有实用自包含性，不等外部格式互通。具体贡献在会话对象/身份隔离、录制上限、文本/HTML双出口，而非新的终端协议或审计机制。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/rec.ts:135-174](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/rec.ts#L135-L174)

session/status顺序。

<details>
<summary>查看原文（40行）</summary>

```text
    async execute(args: TermRecArgs, exec: ToolRunContext) {
      const action = args.action ?? 'start'
      const session = exec.agent?.session

      if (action === 'status') {
        // 只列出当前会话的活动录制(跨会话隔离)。
        const active = deps.registry.active(session)
        const list = active.map((rec) => `「${rec.name}」(${rec.scope},${rec.eventCount} 事件)`)
        return {
          status: 'ok',
          message: list.length > 0 ? `录制中:${list.join(', ')}` : '当前没有活动录制',
          events: active.reduce((sum, rec) => sum + rec.eventCount, 0),
        }
      }

      if (session === undefined) {
        return {
          status: 'error',
          message: 'term_rec 只能在会话内调用(缺少 agent 会话上下文)',
        }
      }

      if (action === 'start') {
        const scope = args.scope ?? 'session'
        const { name, autoNamed } = defaultName(scope, args.name)
        if (deps.registry.get(name, session) !== undefined) {
          return { status: 'error', message: `本会话已有同名录制「${name}」,请先 term_rec action=stop` }
        }
        const recorder = deps.registry.start(deps.ctx, session, {
          name,
          scope,
          autoNamed,
          recordInput: args.record_input ?? deps.config.recordInput,
          writerOptions: {
            width: deps.config.width,
            height: deps.config.height,
            maxEvents: deps.config.maxEvents,
            maxBytes: deps.config.maxBytes,
          },
        })
```

</details>

**依据 2 · 源码核查**：[src/recorder.ts:108-143](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L108-L143)

对象隔离/步骤停止。

<details>
<summary>查看原文（36行）</summary>

```text
  private readonly onSessionEvent = (subject: Session, event: SessionEvent): void => {
    if (subject !== this.session || !this.active) return
    this.handleEvent(event)
  }

  private readonly onSessionDisposed = (subject: Session): void => {
    if (subject !== this.session) return
    this.finish('session/disposed')
  }

  /** 开始监听(幂等);句柄通过 ctx.on 返回的 disposer 管理,生命周期随 ctx。 */
  start(): this {
    this.disposers.push(this.ctx.on('session/event', this.onSessionEvent))
    this.disposers.push(this.ctx.on('session/disposed', this.onSessionDisposed))
    return this
  }

  private handleEvent(event: SessionEvent): void {
    // 注意延迟以事件到达顺序计算,而非事件时间戳 —— 与 v2 相对时间轴一致。
    switch (event.type) {
      case 'tool/result': {
        const blocks = event.data.message.content[0]?.content
        const text = contentToText(blocks)
        if (text !== '') this.writer.write(text)
        break
      }
      case 'user/message': {
        if (!this.recordInput) break
        const text = contentToText(event.data.content)
        if (text !== '') this.writer.push('i', text)
        break
      }
      case 'step/end': {
        // command 范围:当前 agent 步骤结束即封存。
        if (this.scope === 'command') this.finish('step/end')
        break
```

</details>

**依据 3 · 源码核查**：[src/recorder.ts:235-269](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L235-L269)

ID/name及无session活动全列。

<details>
<summary>查看原文（35行）</summary>

```text
  private keyFor(session: Session | undefined, name: string): string {
    return `${sessionKeyOf(session)}:${name}`
  }

  /** 开始一个新录制;同会话同名冲突时抛错(调用方转成工具错误返回)。 */
  start(ctx: Context, session: Session, options: RecorderStartOptions): SessionRecorder {
    const key = this.keyFor(session, options.name)
    if (this.byKey.has(key)) {
      throw new Error(`同会话已存在同名录制「${options.name}」,请先 term_rec action=stop`)
    }
    const recorder = new SessionRecorder(ctx, session, options).start()
    this.byKey.set(key, recorder)
    const list = this.bySession.get(session) ?? []
    list.push(recorder)
    this.bySession.set(session, list)
    return recorder
  }

  /** 按会话范围取录制:会话 A 只能取到自己会话的录制。 */
  get(name: string, session?: Session): SessionRecorder | undefined {
    return this.byKey.get(this.keyFor(session, name))
  }

  getNameOf(recorder: SessionRecorder): string | undefined {
    for (const [key, rec] of this.byKey) {
      if (rec === recorder) return key.slice(key.indexOf(':') + 1)
    }
    return undefined
  }

  /** 当前活动(未封存)的录制,按时间顺序;给会话则只列该会话的。 */
  active(session?: Session): SessionRecorder[] {
    const active = [...this.byKey.values()].filter((rec) => rec.isActive)
    if (session === undefined) return active
    return active.filter((rec) => rec.sessionOf === session)
```

</details>

**依据 4 · 源码核查**：[src/cast-core.ts:179-217](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L179-L217)

文本字节/事件封存。

<details>
<summary>查看原文（39行）</summary>

```text
  /** 预检:封存后或任一容量上限将超限时拒绝。 */
  private canAccept(dataLength: number): boolean {
    if (this.sealed) return false
    const maxEvents = this.options.maxEvents
    const maxBytes = this.options.maxBytes
    if (maxEvents !== undefined && this.events.length >= maxEvents) {
      this.sealBy('events')
      return false
    }
    if (maxBytes !== undefined && this.bytes + dataLength > maxBytes) {
      this.sealBy('bytes')
      return false
    }
    return true
  }

  private sealBy(reason: 'events' | 'bytes'): void {
    if (!this.sealed) {
      this.sealed = true
      this.truncationReason = reason
    }
  }

  private nextDelay(nowMs: number): number {
    const rawMs = Math.max(0, nowMs - this.lastMs)
    this.lastMs = nowMs
    const delay = roundDelay(rawMs)
    // 单调不减:四舍五入可能让相邻帧相等,不允许回退。
    this.lastDelay = delay >= this.lastDelay ? delay : this.lastDelay
    return this.lastDelay
  }

  /** 追加一个事件并按 v2 语义计算 delay。封存或超限后静默丢弃。 */
  push(type: CastEventType, data: string): void {
    const byteLength = utf8ByteLength(data)
    if (!this.canAccept(byteLength)) return
    const delay = this.nextDelay(monotonicMs())
    this.events.push([delay, type, data])
    this.bytes += byteLength
```

</details>

**依据 5 · 源码核查**：[src/cast-io.ts:51-55](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-io.ts#L51-L55)

整对象JSON落盘。

```text
  const fileName = `${sanitizeName(name)}.cast`
  const relPath = `${castsDir}/${fileName}`
  const target = await resolveTarget(ctx, session, relPath, signal)
  const content = JSON.stringify(cast)
  await ctx.fs.writeText(target, content, undefined, signal)
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 时序与终端显示保真有什么实际问题？

**研究主题**：缺陷与关键质疑

#### 完整回答

nextDelay每次算now-lastMs的单帧间隔，又取max(该间隔,上次delay)强制不减；castDuration和播放器按各delay求和。于是1/2/1秒三个间隔被表示为1/2/2，和5秒而非4秒，是内部时序算法就可推导的偏差，未执行目标。elapsed却用lastMs-startMs，总时间与文件duration也可分歧。不能把单调不减校验通过当真实时间轴保真。

默认timestamp在toCast/停止时生成，而非保存startTime的开始epoch；env来自宿主process.SHELL/TERM非实际工具shell。宽高是配置默认100x40，未订阅终端resize，所以不是捕获真实终端几何。工具结果本身通常已有截断/包装，此处只录可见字符串，不能恢复上游未记录字节。

播放器是剥ANSI+行缓冲textContent，去\r而非终端光标覆盖，不完整解释颜色/光标/屏幕控制；cat也是简单拼接去控制序列，不模拟终端最后屏幕。parser遇坏事件可跳过并保issues，term_play显示告警，但term_cat只拒绝cast=null，丢弃其余issues，文本“成功”可能是有损解析。

#### 证据与依据

**依据 1 · 源码核查**：[src/cast-core.ts:174-208](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L174-L208)

elapsed和max帧间隔。

<details>
<summary>查看原文（35行）</summary>

```text
  /** 距录制开始的相对秒数(截至最后一次 push)。 */
  get elapsed(): number {
    return roundDelay(Math.max(0, this.lastMs - this.startMs))
  }

  /** 预检:封存后或任一容量上限将超限时拒绝。 */
  private canAccept(dataLength: number): boolean {
    if (this.sealed) return false
    const maxEvents = this.options.maxEvents
    const maxBytes = this.options.maxBytes
    if (maxEvents !== undefined && this.events.length >= maxEvents) {
      this.sealBy('events')
      return false
    }
    if (maxBytes !== undefined && this.bytes + dataLength > maxBytes) {
      this.sealBy('bytes')
      return false
    }
    return true
  }

  private sealBy(reason: 'events' | 'bytes'): void {
    if (!this.sealed) {
      this.sealed = true
      this.truncationReason = reason
    }
  }

  private nextDelay(nowMs: number): number {
    const rawMs = Math.max(0, nowMs - this.lastMs)
    this.lastMs = nowMs
    const delay = roundDelay(rawMs)
    // 单调不减:四舍五入可能让相邻帧相等,不允许回退。
    this.lastDelay = delay >= this.lastDelay ? delay : this.lastDelay
    return this.lastDelay
```

</details>

**依据 2 · 源码核查**：[src/cast-core.ts:242-258](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L242-L258)

停止timestamp/env/几何。

<details>
<summary>查看原文（17行）</summary>

```text
  /** 生成完整 CastFile(含 header 与事件快照)。 */
  toCast(meta: CastWriterMeta = {}): CastFile {
    const cast: CastFile = {
      version: 2,
      width: this.width,
      height: this.height,
      timestamp: meta.timestamp ?? castTimestamp(),
      events: this.events.map((event) => [event[0], event[1], event[2]] as CastEvent),
    }
    if (meta.title !== undefined) cast.title = meta.title
    if (meta.env !== undefined) cast.env = { ...meta.env }
    else cast.env = defaultCastEnv()
    if (meta.idle_time_limit !== undefined) cast.idle_time_limit = meta.idle_time_limit
    else if (this.options.idleTimeLimit !== undefined) cast.idle_time_limit = this.options.idleTimeLimit
    if (meta.command !== undefined) cast.command = meta.command
    else if (this.options.command !== undefined) cast.command = this.options.command
    return cast
```

</details>

**依据 3 · 源码核查**：[src/cast-core.ts:442-458](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L442-L458)

文本/求和duration。

<details>
<summary>查看原文（17行）</summary>

```text
export function castToText(cast: CastFile, options: CastToTextOptions = {}): string {
  const strip = options.stripAnsi ?? true
  const includeInput = options.includeInput ?? false
  let output = ''
  for (const event of cast.events) {
    if (event[1] === 'o' || (includeInput && event[1] === 'i')) {
      output += event[2]
    }
  }
  return strip ? stripAnsi(output) : output
}

/** 播放时长(秒)= 各帧 delay 之和(近似)。 */
export function castDuration(cast: CastFile): number {
  let total = 0
  for (const event of cast.events) total += event[0]
  return Math.round(total * 1000) / 1000
```

</details>

**依据 4 · 源码核查**：[assets/player.html:135-145](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/assets/player.html#L135-L145)

行缓冲去回车/ANSI。

<details>
<summary>查看原文（11行）</summary>

```text
  function clearStage() { lines = []; stage.textContent = ''; }

  function appendOutput(chunk) {
    var text = stripAnsi(String(chunk))
    var parts = text.split('\n')
    for (var i = 0; i < parts.length; i++) {
      if (i > 0) lines.push('')
      lines[lines.length - 1] = (lines[lines.length - 1] !== undefined ? lines[lines.length - 1] : '') + parts[i].replace(/\r/g, '')
    }
    if (lines.length > height * 4) lines = lines.slice(-height * 4)
    stage.textContent = lines.slice(-height).join('\n')
```

</details>

**依据 5 · 源码核查**：[src/tools/cat.ts:44-55](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/cat.ts#L44-L55)

丢解析告警。

<details>
<summary>查看原文（12行）</summary>

```text
    async execute(args: TermCatArgs, exec: ToolRunContext) {
      const session = exec.agent?.session
      const raw = await readCastText(deps.ctx, session, args.path, exec.signal)
      const parsed = parseCast(raw)
      if (parsed.cast === null) {
        const first = parsed.issues[0]
        throw new Error(`无法解析 .cast 文件:${first !== undefined ? first.message : 'unknown error'}(path=${args.path})`)
      }
      return castToText(parsed.cast, {
        stripAnsi: !(args.raw ?? false),
        includeInput: args.include_input ?? false,
      })
```

</details>

#### 缺口

- 不规则事件间隔、终端控制序列与上游结果截断的真实复盘偏差未标注对照。
  **影响**：不保证时间/屏幕保真或完整终端记录。
  **进一步探讨**：用人工已知1/2/1间隔及CR/光标/ANSI固定数据核模型时序与显示，区分采集/格式/播放器误差。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · HTML生成、文件保存与失败恢复是否可靠？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

playerTemplatePath用new URL('../../assets/player.html',import.meta.url)。src/cast-io.ts或编译后的lib/cast-io.js都在仓库下一层，../../会跳到仓库父目录assets，而实际模板在仓库assets；正常布局会指向错误模板位置；若ctx.fs.resolve拒绝或本地同步异常被catch接住，返回null才触发最小模板fallback。第81行直接return ctx.fs.readText的Promise没有await，其异步拒绝不被该catch捕获，会经term_play第183行await传播为失败；实际缺文件在哪个阶段报错取决于宿主fs。不能一概声称静默fallback，也不把丰富seek/marker界面当每次实际加载。decodeURIComponent(url.pathname)也非平台fileURLToPath转换，Windows路径另需核。

renderPlayerHtml先转义JSON中的</并对title做HTML转义、播放器用textContent，这是有用的内容边界。但replaceAll的replacement传字符串，输出含$&/$`/$'等替换符时可能被当替换语法扩展而非原文字面；后续全局替换__TITLE__/__CAST_URL__也可改嵌入内容同名片段。需要用固定含这些串的材料对照，不能仅</script>测试就称任意输出逐字保真。

stop先registry.take移除并停止，再await saveCastFile；写失败时活动注册表已无该录制，缺重试句柄/持久待保存队列。session/disposed也先dropSession后fire-and-forget保存，用新signal不等卸载drain，失败只warn。正常不同session同name虽registry隔离，但castsDir与工作区同一物理路径时文件名相同，可覆盖；sanitize减少路径字符不构成全局唯一或安全权限保证。

读写经ctx.fs和session cwd，真正物理/权限/覆盖策略交给宿主；castsDir/path用户可配并非插件自行围栏。整文件readText/JSON/HTML输出无导入大小上限，录制上限不限制外部.cast。

#### 证据与依据

**依据 1 · 源码核查**：[src/cast-io.ts:65-96](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-io.ts#L65-L96)

模板路径/fallback/替换。

<details>
<summary>查看原文（32行）</summary>

```text
/** 播放器内嵌页模板文件(package 内 assets/player.html)的绝对路径。 */
export function playerTemplatePath(): string | undefined {
  try {
    const url = new URL('../../assets/player.html', import.meta.url)
    return decodeURIComponent(url.pathname)
  } catch {
    return undefined
  }
}

/** 读取播放器模板;缺失时返回 null(调用方回退内嵌最小模板)。 */
export async function loadPlayerTemplate(ctx: Context, signal: AbortSignal): Promise<string | null> {
  const path = playerTemplatePath()
  if (path === undefined) return null
  try {
    const target = await ctx.fs.resolve(path, { signal })
    return ctx.fs.readText(target, signal)
  } catch {
    return null
  }
}

/**
 * 用模板 + 内嵌 cast JSON 生成自包含回放 HTML(离线可播:无任何外部请求)。
 * 占位符:__CAST_JSON__ / __TITLE__ / __CAST_URL__。
 */
export function renderPlayerHtml(template: string, cast: CastFile, title: string): string {
  const json = JSON.stringify(cast).replace(/<\//g, '<\\/')
  return template
    .replaceAll('__CAST_JSON__', json)
    .replaceAll('__TITLE__', escapeHtml(title))
    .replaceAll('__CAST_URL__', '')
```

</details>

**依据 2 · 源码核查**：[src/tools/rec.ts:195-226](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/rec.ts#L195-L226)

先take后保存。

<details>
<summary>查看原文（32行）</summary>

```text
      // action === 'stop':只按当前会话找到并停止录制(跨会话隔离)。
      const requested = args.name !== undefined ? sanitizeName(args.name) : undefined
      const recorder = requested !== undefined ? deps.registry.take(requested, session) : (() => {
        const solo = deps.registry.soloActiveOf(session)
        return solo !== undefined ? deps.registry.take(solo.name, session) : undefined
      })()
      if (recorder === undefined) {
        return { status: 'error', message: '本会话没有可停止的录制(先 term_rec action=start 或指定存在 name)' }
      }

      const cast = recorder.finalCast ?? recorder.stop()
      if (cast === undefined) {
        return { status: 'error', message: `录制「${recorder.name}」没有可保存的内容` }
      }

      // 未命名且无内容 → 丢弃
      if (recorder.autoNamed && cast.events.length === 0) {
        return {
          status: 'discarded',
          name: recorder.name,
          message: '未命名录制没有任何输出,已自动丢弃(命名录制后即可保存)',
        }
      }

      const saved = await saveCastFile(
        deps.ctx,
        session,
        deps.config.castsDir,
        recorder.name,
        cast,
        exec.signal,
      )
```

</details>

**依据 3 · 源码核查**：[src/recorder.ts:283-304](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L283-L304)

take/drop移除。

<details>
<summary>查看原文（22行）</summary>

```text
  /** 按会话范围取出并移除注册项(同时停止录制),供写盘保存。 */
  take(name: string, session?: Session): SessionRecorder | undefined {
    const key = this.keyFor(session, name)
    const recorder = this.byKey.get(key)
    if (recorder === undefined) return undefined
    this.byKey.delete(key)
    const list = this.bySession.get(recorder.sessionOf) ?? []
    const index = list.indexOf(recorder)
    if (index >= 0) list.splice(index, 1)
    if (list.length === 0) this.bySession.delete(recorder.sessionOf)
    recorder.stop()
    return recorder
  }

  /** 按会话移除(不返回,供丢弃路径)。 */
  dropSession(session: Session): SessionRecorder[] {
    const list = this.bySession.get(session) ?? []
    for (const recorder of list) {
      this.byKey.delete(this.keyFor(recorder.sessionOf, recorder.name))
      recorder.stop()
    }
    this.bySession.delete(session)
```

</details>

**依据 4 · 源码核查**：[src/index.ts:58-76](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/index.ts#L58-L76)

autosave无drain。

<details>
<summary>查看原文（19行）</summary>

```text
  // 会话结束策略(验收标准 4):命名录制自动保存,未命名录制自动丢弃。
  ctx.on('session/disposed', (session: Session) => {
    const recorders = registry.forSession(session)
    if (recorders.length === 0) return
    registry.dropSession(session)
    for (const recorder of recorders) {
      if (recorder.autoNamed) {
        console.warn(`[dsh-asciinema] 未命名录制「${recorder.name}」随会话结束自动丢弃`)
        continue
      }
      const cast = recorder.finalCast
      if (cast === undefined || cast.events.length === 0) continue
      void saveCastFile(ctx, session, config.castsDir, recorder.name, cast, new AbortController().signal)
        .then((saved) => {
          console.info(`[dsh-asciinema] 会话结束,录制已保存:${saved.relPath}(${cast.events.length} 事件)`)
        })
        .catch((error: unknown) => {
          console.warn(`[dsh-asciinema] 会话结束自动保存失败:${error instanceof Error ? error.message : String(error)}`)
        })
```

</details>

**依据 5 · 源码核查**：[src/cast-io.ts:25-62](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-io.ts#L25-L62)

ctx.fs解析/写/读。

<details>
<summary>查看原文（38行）</summary>

```text
export async function resolveTarget(
  ctx: Context,
  session: Session | undefined,
  path: string,
  signal: AbortSignal,
): Promise<FsTarget> {
  const cwd = sessionCwd(session)
  return ctx.fs.resolve(path, cwd !== undefined ? { cwd, signal } : { signal })
}

export interface SaveCastResult {
  /** 相对会话工作区的路径,如 `.casts/demo.cast`。 */
  relPath: string
  /** 后端返回的绝对进程路径。 */
  absPath: string
}

/** 把 CastFile 序列化并写入 `<castsDir>/<name>.cast`(父目录自动创建)。 */
export async function saveCastFile(
  ctx: Context,
  session: Session | undefined,
  castsDir: string,
  name: string,
  cast: CastFile,
  signal: AbortSignal,
): Promise<SaveCastResult> {
  const fileName = `${sanitizeName(name)}.cast`
  const relPath = `${castsDir}/${fileName}`
  const target = await resolveTarget(ctx, session, relPath, signal)
  const content = JSON.stringify(cast)
  await ctx.fs.writeText(target, content, undefined, signal)
  return { relPath, absPath: ctx.fs.processPath(target) }
}

/** 读取并解析一个 .cast 文件文本。 */
export async function readCastText(ctx: Context, session: Session | undefined, path: string, signal: AbortSignal): Promise<string> {
  const target = await resolveTarget(ctx, session, path, signal)
  return ctx.fs.readText(target, signal)
```

</details>

#### 缺口

- 替换符内容、模板路径/Windows转换、写失败/同目录覆盖的完整恢复结果未受控模拟。
  **影响**：不保证字节保真/丰富播放器实际到达/保存失败可重试。
  **进一步探讨**：mock文件sink拒绝/路径/重复名，核待保存句柄与内容hash；用无秘密固定HTML数据核替换，避免覆盖用户文件。
- 宿主fs对模板缺文件在resolve还是readText阶段报错未知。
  **影响**：同一错路径可能降级或传播失败，不能一概保证fallback。
  **进一步探讨**：固定mock分别令resolve拒绝/readText异步拒绝，核term_play返回状态，不执行真实宿主。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动与交付形态怎么核？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| 编译lib或按说明加载源码 | main/types入口 | 固定Git不预置lib，先build并核资产相对路径 |
| Node>=23.6或对应strip支持 | 直接TS测试/源码形态 | 发布ESM与宿主版本仍需精确核 |
| DSH tools/fs与session事件 | 工具/文件/录制 | inject无sessions但监听依事件契约 |
| 可写私有castsDir和分享许可 | 明文cast/内嵌HTML | 输出也可有秘密，输入默认false非脱敏 |
| 模板/浏览器 | 离线回看 | 当前路径有误；被catch接住才fallback，readText异步拒绝可令play失败；独立模板可?url fetch |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 核包 | 明确源码/已构建，核实际宿主依赖 | README邻dsh-src是作者开发布局，当前package列registry版本 |
| 选范围 | 只在可信会话小录制，定maxEvents/Bytes | scope=command为step边界 |
| 停并存 | 指name，核saved/路径/截断 | 错误不丢内存后再决定重试 |
| 转/回放 | 看issues与模板能力/时间 | cat可能丢告警，不等完整原屏幕 |
| 分享 | 审工具输出/环境/输入及HTML内嵌内容 | 生成HTML不等已匿名或可公开 |
| 收尾 | 明确停/保存，备份原件 | 不能靠崩溃/卸载自动保全 |

docs/store-evidence既保留“真实宿主待执行”旧说明又追加作者CLI add/dump/remove rc0，最多是作者声明的配置生命周期材料，不等本轮运行、录制完整性或官方互操作。package宽compatibility>=0.1.0也不能替代精确代际验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:5-16](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/package.json#L5-L16)

main/types/source形态。

<details>
<summary>查看原文（12行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./src/*": "./src/*",
    "./assets/*": "./assets/*",
    "./cordis.yml": "./cordis.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[package.json:28-45](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/package.json#L28-L45)

Node/build/patch。

<details>
<summary>查看原文（18行）</summary>

```text
    "node": ">=23.6.0"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc -p tsconfig.json",
    "test": "node --no-warnings tests/smoke.e2e.ts",
    "test:debug": "node --trace-warnings tests/smoke.e2e.ts",
    "prepublishOnly": "npm run build"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "compatibility": {
      "node": ">=23.6.0",
      "dsh": ">=0.1.0"
    },
    "permissions": {
```

</details>

**依据 3 · 源码核查**：[src/index.ts:42-53](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/index.ts#L42-L53)

上限/config/inject。

<details>
<summary>查看原文（12行）</summary>

```text
export const Config: Schema<AsciinemaConfig> = Schema.object({
  width: Schema.number().step(1).min(1).max(1000).default(100),
  height: Schema.number().step(1).min(1).max(1000).default(40),
  maxEvents: Schema.number().step(1).min(1).default(5000),
  maxBytes: Schema.number().step(1).min(1024).default(1024 * 1024),
  recordInput: Schema.boolean().default(false),
  castsDir: Schema.string().default('.casts'),
  playerUrl: Schema.string().default(''),
})

/** 依赖:工具注册表 + 文件系统(会话工作区)。 */
export const inject = ['tools', 'fs']
```

</details>

**依据 4 · 作者声明**：[docs/store-evidence.md:1-38](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/docs/store-evidence.md#L1-L38)

作者前后生命周期记录。

<details>
<summary>查看原文（38行）</summary>

````text
# store-evidence — dsh-asciinema 一次性 Profile 安装 / 启动 / 卸载证据

本文件记录 DSH STORE 要求的一次性 Profile 安装、启动、卸载验证的证据与执行步骤。
**真实 Profile 运行**需在装有 DSH CLI 的宿主上执行（本仓库离线环境无法完成该步骤）；
以下同时记录已完成的离线等价证据，保证可复现、可审计。

## 1. 一次性 Profile 安装 / 启动 / 卸载步骤（在 DSH 宿主执行）
```bash
git clone https://github.com/988hj7tczd-oss/dsh-asciinema.git
cd dsh-asciinema
pnpm install --offline && pnpm build
export DSH_HOME=$(mktemp -d /tmp/dsh-asciinema-profile-XXXXXX)
dsh plugin --profile asciinema-demo add /path/to/dsh-asciinema
# 启动冒烟：Profile 正常启动；工具注册表出现 asciinema_rec / asciinema_play / asciinema_cat
dsh plugin --profile asciinema-demo remove dsh-asciinema
rm -rf "$DSH_HOME"
```

## 2. 已完成的离线等价证据（本仓库内可复现，2026-08-24）
| 检查 | 命令 | 结果 |
|---|---|---|
| 构建 | `pnpm build`（tsc -p tsconfig.build.json） | 0 错误，产出 `lib/index.js` 等 |
| 入口可加载 | `node -e "import('./lib/index.js')"` | `ENTRY_OK` |
| 冒烟测试 | `pnpm test`（node --no-warnings tests/smoke.e2e.ts） | **16/16 通过 / 0 失败** |
| 权限面 | `PERMISSIONS.md` | 无子进程命令面、无网络、无外部服务；录制上限受控 |

## 3. 仍未补全（待宿主环境）

## 3. 真实 Profile 运行记录（本机 dsh CLI 实测，2026-08-24 补充）
在隔离 `DSH_HOME`（mktemp）下用真实 DSH CLI 完成完整生命周期，命令与结果：

```bash
# 安装（npm 包或本地路径）
dsh plugin --profile ev-demo add dsh-asciinema@0.1.1
# 启动：Profile 正常 boot 无 fatal；插件层出现在组装配置树
dsh --profile ev-demo --dump-config   # → `# == dsh-asciinema` 行可见
# 卸载：移除后插件层消失
dsh plugin --profile ev-demo remove dsh-asciinema
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次持续失败成本与效果如何？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | TS构建/宿主依赖与模板资源 | 核源码入口、路径、私有输出目录 | 构建/适配时间金额未知 |
| 持续使用 | 结果文本提取/UTF8编码、每录制默认5000事件/1MiB数据、JSON/HTML复制 | 查看截断与内容分享审查 | 无独立模型请求不等下游cat进上下文费用0；多录制/导入不受单writer总额限制 |
| 失败恢复 | 重录/手动保原件、失败写/导入/HTML重生资源 | 核丢失句柄、时间偏差、覆盖/模板失败或fallback | 无durable pending/drain，恢复时间费用未知 |

#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 会话复盘 | 工具输出到文件/HTML | 不是PTY原始/官方互操作 |
| 规模控制 | 单writer数据/事件封存 | 整体内存/导入/后续提取未界定 |
| 可分享 | 自包含文字回看 | 明文含工具秘密，需审 |
| 恢复/可追溯 | 明确saved与部分issues | 先移除后写失败、cat丢告警 |

作者16项离线单元材料是设计覆盖，未实际加载host或浏览器的限定在README写明；本轮只检查源码，不据测试数推业务效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/cast-core.ts:179-217](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L179-L217)

单录制资源。

<details>
<summary>查看原文（39行）</summary>

```text
  /** 预检:封存后或任一容量上限将超限时拒绝。 */
  private canAccept(dataLength: number): boolean {
    if (this.sealed) return false
    const maxEvents = this.options.maxEvents
    const maxBytes = this.options.maxBytes
    if (maxEvents !== undefined && this.events.length >= maxEvents) {
      this.sealBy('events')
      return false
    }
    if (maxBytes !== undefined && this.bytes + dataLength > maxBytes) {
      this.sealBy('bytes')
      return false
    }
    return true
  }

  private sealBy(reason: 'events' | 'bytes'): void {
    if (!this.sealed) {
      this.sealed = true
      this.truncationReason = reason
    }
  }

  private nextDelay(nowMs: number): number {
    const rawMs = Math.max(0, nowMs - this.lastMs)
    this.lastMs = nowMs
    const delay = roundDelay(rawMs)
    // 单调不减:四舍五入可能让相邻帧相等,不允许回退。
    this.lastDelay = delay >= this.lastDelay ? delay : this.lastDelay
    return this.lastDelay
  }

  /** 追加一个事件并按 v2 语义计算 delay。封存或超限后静默丢弃。 */
  push(type: CastEventType, data: string): void {
    const byteLength = utf8ByteLength(data)
    if (!this.canAccept(byteLength)) return
    const delay = this.nextDelay(monotonicMs())
    this.events.push([delay, type, data])
    this.bytes += byteLength
```

</details>

**依据 2 · 源码核查**：[src/tools/play.ts:150-187](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/play.ts#L150-L187)

全读/HTML复制。

<details>
<summary>查看原文（38行）</summary>

```text
    async execute(args: TermPlayArgs, exec: ToolRunContext) {
      const session = exec.agent?.session
      const raw = await readCastText(deps.ctx, session, args.path, exec.signal)
      const parsed = parseCast(raw)
      if (parsed.cast === null) {
        const first = parsed.issues[0]
        throw new Error(`无法解析 .cast 文件:${first !== undefined ? first.message : 'unknown error'}(path=${args.path})`)
      }
      const cast = parsed.cast
      const seen = new Set(parsed.issues.map((issue) => issue.message))
      const warnings = validateCast(cast).filter((issue) => {
        if (seen.has(issue.message)) return false
        seen.add(issue.message)
        return true
      })
      const issues = [...seen]

      const mode = args.mode ?? 'auto'
      if (mode === 'text') {
        return {
          mode: 'text',
          path: args.path,
          events: cast.events.length,
          duration: castDuration(cast),
          width: cast.width,
          height: cast.height,
          title: cast.title,
          text: castToText(cast),
          issues,
        }
      }

      // html(默认)/auto:生成自包含回放页
      const template = (await loadPlayerTemplate(deps.ctx, exec.signal)) ?? FALLBACK_TEMPLATE
      const html = renderPlayerHtml(template, cast, cast.title ?? args.path)
      const htmlPath = htmlPathForCast(args.path)
      const target = await resolveTarget(deps.ctx, session, htmlPath, exec.signal)
      await deps.ctx.fs.writeText(target, html, undefined, exec.signal)
```

</details>

**依据 3 · 源码核查**：[src/tools/rec.ts:195-226](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/rec.ts#L195-L226)

恢复成本。

<details>
<summary>查看原文（32行）</summary>

```text
      // action === 'stop':只按当前会话找到并停止录制(跨会话隔离)。
      const requested = args.name !== undefined ? sanitizeName(args.name) : undefined
      const recorder = requested !== undefined ? deps.registry.take(requested, session) : (() => {
        const solo = deps.registry.soloActiveOf(session)
        return solo !== undefined ? deps.registry.take(solo.name, session) : undefined
      })()
      if (recorder === undefined) {
        return { status: 'error', message: '本会话没有可停止的录制(先 term_rec action=start 或指定存在 name)' }
      }

      const cast = recorder.finalCast ?? recorder.stop()
      if (cast === undefined) {
        return { status: 'error', message: `录制「${recorder.name}」没有可保存的内容` }
      }

      // 未命名且无内容 → 丢弃
      if (recorder.autoNamed && cast.events.length === 0) {
        return {
          status: 'discarded',
          name: recorder.name,
          message: '未命名录制没有任何输出,已自动丢弃(命名录制后即可保存)',
        }
      }

      const saved = await saveCastFile(
        deps.ctx,
        session,
        deps.config.castsDir,
        recorder.name,
        cast,
        exec.signal,
      )
```

</details>

**依据 4 · 源码核查**：[src/recorder.ts:125-143](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/recorder.ts#L125-L143)

持续提取。

<details>
<summary>查看原文（19行）</summary>

```text
  private handleEvent(event: SessionEvent): void {
    // 注意延迟以事件到达顺序计算,而非事件时间戳 —— 与 v2 相对时间轴一致。
    switch (event.type) {
      case 'tool/result': {
        const blocks = event.data.message.content[0]?.content
        const text = contentToText(blocks)
        if (text !== '') this.writer.write(text)
        break
      }
      case 'user/message': {
        if (!this.recordInput) break
        const text = contentToText(event.data.content)
        if (text !== '') this.writer.push('i', text)
        break
      }
      case 'step/end': {
        // command 范围:当前 agent 步骤结束即封存。
        if (this.scope === 'command') this.finish('step/end')
        break
```

</details>

#### 缺口

- 多录制/大导入的内存与复盘效率、失败恢复率无对照。
  **影响**：不能量化轻量/保真与节省时间。
  **进一步探讨**：固定无秘密文本比较手存日志/插件回放，测完整率、时间误差、峰值内存/人工修复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐和可继续探讨方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

观察。会话输出到本地回看有需求，session对象隔离/单writer上限与输入默认关闭值得保留；但模板路径、内部计时、保存失败移除/无drain和内容替换影响基本交付。先修路径/计时/保存恢复，再讨论小型非秘密会话试用，不以.cast名称承诺终端/官方互通。

由“单writer护栏≠完整持久交付”推导“采集范围和保存状态的版本收据”。计时明确从start累计或帧间隔一种语义、writer/reader/player统一；stop先封存保pending直到写成功，失败保句柄/原件，卸载drain。模板按包根定位并用函数replacement逐字嵌入；收据标源session/范围、截断、hash、模板版本与写/播放状态，不保更多秘密。

反例是宿主tool/result本来缺PTY字节，再正确的格式与收据也无法恢复；官方互通需独立固定样例，不能自写reader成功当真值。最小对照含1/2/1间隔、畸形事件、$&/__TITLE__/</script>、模板缺失、写拒绝/取消、同cwd同name、session缺失status。若仍丢pending、时序偏差/原文hash错或跨会话状态可见，核心假设被反证；比较恢复完整率与新增内存/IO，不以多保存副本无限增长换保证。方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[src/cast-core.ts:202-217](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-core.ts#L202-L217)

时间方案基线。

<details>
<summary>查看原文（16行）</summary>

```text
  private nextDelay(nowMs: number): number {
    const rawMs = Math.max(0, nowMs - this.lastMs)
    this.lastMs = nowMs
    const delay = roundDelay(rawMs)
    // 单调不减:四舍五入可能让相邻帧相等,不允许回退。
    this.lastDelay = delay >= this.lastDelay ? delay : this.lastDelay
    return this.lastDelay
  }

  /** 追加一个事件并按 v2 语义计算 delay。封存或超限后静默丢弃。 */
  push(type: CastEventType, data: string): void {
    const byteLength = utf8ByteLength(data)
    if (!this.canAccept(byteLength)) return
    const delay = this.nextDelay(monotonicMs())
    this.events.push([delay, type, data])
    this.bytes += byteLength
```

</details>

**依据 2 · 源码核查**：[src/tools/rec.ts:195-226](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/tools/rec.ts#L195-L226)

pending方案基线。

<details>
<summary>查看原文（32行）</summary>

```text
      // action === 'stop':只按当前会话找到并停止录制(跨会话隔离)。
      const requested = args.name !== undefined ? sanitizeName(args.name) : undefined
      const recorder = requested !== undefined ? deps.registry.take(requested, session) : (() => {
        const solo = deps.registry.soloActiveOf(session)
        return solo !== undefined ? deps.registry.take(solo.name, session) : undefined
      })()
      if (recorder === undefined) {
        return { status: 'error', message: '本会话没有可停止的录制(先 term_rec action=start 或指定存在 name)' }
      }

      const cast = recorder.finalCast ?? recorder.stop()
      if (cast === undefined) {
        return { status: 'error', message: `录制「${recorder.name}」没有可保存的内容` }
      }

      // 未命名且无内容 → 丢弃
      if (recorder.autoNamed && cast.events.length === 0) {
        return {
          status: 'discarded',
          name: recorder.name,
          message: '未命名录制没有任何输出,已自动丢弃(命名录制后即可保存)',
        }
      }

      const saved = await saveCastFile(
        deps.ctx,
        session,
        deps.config.castsDir,
        recorder.name,
        cast,
        exec.signal,
      )
```

</details>

**依据 3 · 源码核查**：[src/cast-io.ts:65-96](https://github.com/988hj7tczd-oss/dsh-asciinema/blob/c47863413886ffac9b66ee13a9ab276ab195d5d9/src/cast-io.ts#L65-L96)

模板/字面嵌入基线。

<details>
<summary>查看原文（32行）</summary>

```text
/** 播放器内嵌页模板文件(package 内 assets/player.html)的绝对路径。 */
export function playerTemplatePath(): string | undefined {
  try {
    const url = new URL('../../assets/player.html', import.meta.url)
    return decodeURIComponent(url.pathname)
  } catch {
    return undefined
  }
}

/** 读取播放器模板;缺失时返回 null(调用方回退内嵌最小模板)。 */
export async function loadPlayerTemplate(ctx: Context, signal: AbortSignal): Promise<string | null> {
  const path = playerTemplatePath()
  if (path === undefined) return null
  try {
    const target = await ctx.fs.resolve(path, { signal })
    return ctx.fs.readText(target, signal)
  } catch {
    return null
  }
}

/**
 * 用模板 + 内嵌 cast JSON 生成自包含回放 HTML(离线可播:无任何外部请求)。
 * 占位符:__CAST_JSON__ / __TITLE__ / __CAST_URL__。
 */
export function renderPlayerHtml(template: string, cast: CastFile, title: string): string {
  const json = JSON.stringify(cast).replace(/<\//g, '<\\/')
  return template
    .replaceAll('__CAST_JSON__', json)
    .replaceAll('__TITLE__', escapeHtml(title))
    .replaceAll('__CAST_URL__', '')
```

</details>

#### 缺口

- 统一时间/可恢复保存与包根模板方案未实现。
  **影响**：不计现有保真/可靠保存优势。
  **进一步探讨**：先无秘密固定样例/mock失败对照，再谈官方互操作；不重放真实工具/命令。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
