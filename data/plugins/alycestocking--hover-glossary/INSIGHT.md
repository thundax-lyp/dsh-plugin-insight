# hover-glossary

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[620b85d](https://github.com/AlyceStocking/hover-glossary/tree/620b85d4291e6983cc2d1205ff76f4833978f38b)

<!-- BEGIN META -->
[![npm 30d 48](https://img.shields.io/static/v1?label=npm+30d&message=48&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/hover-glossary) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/hover-glossary)
<!-- END META -->

> **实现功能**：在DSH聊天正文悬停显示本地词库的一到多条释义，支持大小写/全角归一化与中文最长词匹配。

> **核心亮点**：把本地多义词库、真实字形定位、消息/控件范围与归一化最长匹配组合到同屏浮层，减少手工查词切换；不做语境消歧。详见[Q02](#research-q02)。

> **风险与缺陷**：启动自检先取Text并记录前24字符/完整token，再报告范围判定；无模型调用不能推出无内容诊断。鼠标单通道和长token候选预算也有限制。详见[Q03](#research-q03)。

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
  - [Q01 · 给谁解决什么阅读问题，释义是否意味着理解正确？](#detail-section-11)
  - [Q02 · 取字、归一化和多义排序如何组合？](#detail-section-12)
  - [Q03 · 本地查词的隐私、性能和交互边界有哪些？](#detail-section-13)
  - [Q04 · 怎样启用维护，三阶段要付出什么？](#detail-section-14)
  - [Q05 · 采用建议与进一步探索该从哪里入手？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在DSH浏览器聊天中阅读技术术语/缩写、想少复制跳转词典的用户。鼠标停在已发送用户/助手正文，显示静态词库的1到多条解释。合格结果是取到光标真实字符、命中正确词边界、列出登记释义并保留正文，不能把最长词或最高权重当作上下文语义判定。

基线是复制术语到词典/搜索或手查项目术语表；增量是同屏低切换的静态查词，不生成新释义，不核事实。seed含WHO的多义和推理领域术语，词库内容/覆盖由维护者提供，未覆盖词不会自动调用模型补全。作者对Desktop只报告安装注册与入口检查，旧CLI/Edge悬停验证是作者报告，不转述为本轮独立验收。

复制术语到外部词典/手查术语表；插件提供同屏静态释义，不改变内容真实性验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 悬停词典 | 同屏一到多条固定释义 | 单Text/鼠标；非语境消歧 |
| 归一化最长匹配 | 全角/大小写/中文词 | 英文短语从首词开始 |
| 本地词库 | 不调用模型查词 | 启动诊断仍可能记局部文本 |
| 维护Skill | 单源重建/安装检查 | 不是聊天模型工具 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web UI renderer/slots与shell.overlay | 加载浮层 | Desktop安装注册不等悬停验收 |
| caret/elementFromPoint/Range浏览器API和消息DOM标记 | 真实字形/聊天范围 | 版本变化要核；非聊天诊断仍可能取字 |
| Node>=20和profile依赖安装 | host/package加载 | Git含lib；旧动态RPC不是持久词库API |
| seed-data与构建副本一致 | 离线释义 | 更新需重建/刷新，不自动学习 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | profile安装后重启/刷新 | 同时核client模块与slots授权 |
| 查词 | 已发送正文真实字形处悬停 | 非链接/编辑区，候选释义需自己判断 |
| 更新 | 改唯一seed再重建同步包 | 新词/大小写/短语/重启持久性分别核 |
| 停用 | 卸载监听/overlay，刷新 | 正文不改；已有console记录不由删全局抹除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装包与内联词库内存，无额外模型API | 核宿主DOM/API、诊断策略和词库适用性 | 实际工时/安装费用未知 |
| 持续使用 | 鼠标查询CPU/React状态与浮层，无直接LLM调用 | 选择释义、纠正文义和维护seed | 总DSH会话费用不等0；长Text延时未知 |
| 失败恢复 | 重建/重载/清监听，旧console仍按宿主管理 | 定位DOM/副本漂移/错误释义并回滚固定包 | 恢复耗时与console保留未知 |



#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少切换 | 同屏显示已登记多义 | 不做语境消歧或事实核验 |
| 不请求模型 | 内联词库本地匹配 | 启动诊断可能记录局部文字 |
| 可持续维护 | 单源构建/固定安装 | 需人工重建刷新 |

仓库glossary-mapping是维护流程Skill，不是聊天运行时模型工具；不应因为包里有它就说用户查词会消耗模型。作者测试与浏览器报告可作为作者材料，本轮不运行。

> **思考**：启动自检先取Text并记录前24字符/完整token，再报告范围判定；无模型调用不能推出无内容诊断。鼠标单通道和长token候选预算也有限制。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把本地多义词库、真实字形定位、消息/控件范围与归一化最长匹配组合到同屏浮层，减少手工查词切换；不做语境消歧。详见[Q02](#research-q02)。

把本地多义词库、真实字形定位、消息/控件范围与归一化最长匹配组合到同屏浮层，减少手工查词切换；不做语境消歧。详见[Q02](#research-q02)。

没有模型请求/RPC并不等于完全没有内容诊断。apply自动selfCheck，对窗口中心附近取字，先保存Text前24字符与glyph/offset，再调用classify，且不论允许与否都继续tokenAt，把token与判定存全局并console.log。连续中文token可长于24字符。故即使坐标落在非聊天文字，诊断也可能含该处文本；代码不支持断言发送远端，控制台是否被宿主采集/留存未知。应缩减为无文本的API/计数诊断或显式选择后才探测。

lookupAt的window默认16不是全文工作量硬上限。tokenAt可把连续中文当长token，起点枚举回溯至其开头，首起点stop至少到tokenEnd，再构建/归一化/排序候选。50ms只是事件间隔，不限制一次计算耗时；大会话长Text的成本没有测量。不要把已建索引等同恒定时间查词。

浮层pointer-events:none但内容maxHeight/overflow:auto，超长多义列表不能直接靠鼠标进入滚动；只有鼠标mousemove，没有键盘焦点/触屏查询入口，role=tooltip不足以保证辅助技术关联。定义用React文本子节点，不使用innerHTML。scope依赖宿主data标记，单Text/第一词短语为明确覆盖限制，不是跨节点分词。

<a id="detail-section-5"></a>

### 1.4 主要限制

启动自检先取Text并记录前24字符/完整token，再报告范围判定；无模型调用不能推出无内容诊断。鼠标单通道和长token候选预算也有限制。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，非敏感个人环境按诊断策略可限定试用；保密/键盘优先需求应先处理日志与交互边界。详见[Q05](#research-q05)。

基线是复制术语到词典/搜索或手查项目术语表；增量是同屏低切换的静态查词，不生成新释义，不核事实。seed含WHO的多义和推理领域术语，词库内容/覆盖由维护者提供，未覆盖词不会自动调用模型补全。作者对Desktop只报告安装注册与入口检查，旧CLI/Edge悬停验证是作者报告，不转述为本轮独立验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。纯客户端匹配成立，控制台内容边界与可达交互需优先核清。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/lexicon.mjs、src/seed-data.mjs、plugin/client-panel.js、lib/client.js、lib/index.js、scripts/build-client.mjs、.dsh/skills/glossary-mapping/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定lexicon/seed样例、UI模板与built关键对应、构建/包/维护Skill；不运行目标测试/浏览器/宿主。
- 下一步：可继续比较无原文诊断/消息范围、长token预算与键盘可达性，固定合成材料，不用真实对话。

**分析版本**

- **仓库**：[AlyceStocking/hover-glossary](https://github.com/AlyceStocking/hover-glossary)
- **版本号**：1.1.0（[固定提交 620b85d](https://github.com/AlyceStocking/hover-glossary/tree/620b85d4291e6983cc2d1205ff76f4833978f38b)）
- **版本日期**：2026-10-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索无文本诊断、显式词域/键盘锁定浮层与候选预算，比较日志最小化/正确率/延时，未实现。详见[Q05](#research-q05)。

可继续比较无原文诊断/消息范围、长token预算与键盘可达性，固定合成材料，不用真实对话。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 169 | — | — | 2005 |
| .js | source | 5 | 2581 | 2262 | 164 | — |
| .mjs | source | 3 | 1208 | 958 | 200 | — |
| .mjs | test | 5 | 1068 | 795 | 174 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/hover-glossary/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/hover-glossary/issues?q=is%3Aissue+created%3A2026-09-22T09%3A53%3A11.466Z..2026-10-22T09%3A53%3A11.466Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AlyceStocking/hover-glossary/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A53%3A11.466Z..2026-10-22T09%3A53%3A11.466Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对本地查词贡献、字形/范围/多义机制、诊断内容/长文本/可达性边界与维护成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 给谁解决什么阅读问题，释义是否意味着理解正确？

**研究主题**：场景与需求

#### 完整回答

适合在DSH浏览器聊天中阅读技术术语/缩写、想少复制跳转词典的用户。鼠标停在已发送用户/助手正文，显示静态词库的1到多条解释。合格结果是取到光标真实字符、命中正确词边界、列出登记释义并保留正文，不能把最长词或最高权重当作上下文语义判定。

基线是复制术语到词典/搜索或手查项目术语表；增量是同屏低切换的静态查词，不生成新释义，不核事实。seed含WHO的多义和推理领域术语，词库内容/覆盖由维护者提供，未覆盖词不会自动调用模型补全。作者对Desktop只报告安装注册与入口检查，旧CLI/Edge悬停验证是作者报告，不转述为本轮独立验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-9](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/README.md#L3-L9)

功能和不同环境作者验收边界。

```text
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的可持久安装浏览器插件：鼠标停在用户或助手聊天正文中的词上，显示 **1 → N 条释义**。

例如 `WHO` 显示“1. 世卫组织（缩写）；2. 谁（代词）”。词库与查询在浏览器内完成，不发送模型请求、不注册模型工具、不添加系统提示词，没有额外的词库面板或启动诊断卡片。

## 当前版本与兼容性

当前版本为 **1.1.0**。词库包含 GLM-5.3-Flash、vLLM Ascend 等推理术语；查询完全在浏览器内执行。已完成 DSH Desktop 0.2.0-rc.2 的包安装、注册和入口检查，桌面悬停效果尚未验收；原有真实浏览器验证环境为 Harness CLI 0.1.5-rc.1 / 客户端组件 0.1.5-rc.2。
```

**依据 2 · 源码核查**：[src/seed-data.mjs:670-704](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/src/seed-data.mjs#L670-L704)

领域释义为固定登记文本。

<details>
<summary>查看原文（35行）</summary>

```text
  ],
  下采样: [
    { text: 'downsample：降低分辨率的压缩步骤；视觉塔经 Conv2d 下采样和 PatchMerger 输出 [P/m²,H]', kind: '术语', weight: 100, tags: ['多模态'] },
  ],
  聊天模板: [
    { text: 'chat template：把对话消息渲染成带角色等特殊标记的模型输入文本', kind: '术语', weight: 100, tags: ['推理基础'] },
  ],
  'causal mask': [
    { text: '因果掩码：阻止 token 注意到未来位置；NoPE 不等于不需要因果 mask', kind: '术语', weight: 100, tags: ['注意力'] },
  ],
  因果掩码: [
    { text: '即 causal mask，自回归生成的基本约束', kind: '术语', weight: 100, tags: ['注意力'] },
  ],
  padding: [
    { text: '填充：对齐批次/图规格补的无效位置；必须保留无效状态，图模式 padding 不能污染结果', kind: '术语', weight: 100, tags: ['算子'] },
  ],
  预热: [
    { text: 'warmup：正式服务前的试跑；图模式预热做 capture，首 token 慢先区分冷启动与稳态', kind: '术语', weight: 100, tags: ['执行模式'] },
  ],
  抢占: [
    { text: 'preemption：资源不足时请求被暂时换出；tail 块在结束/抢占时归还 BlockPool', kind: '术语', weight: 100, tags: ['调度'] },
  ],
  回放: [
    { text: 'replay：图执行重放录制的设备调用；MTP 语境指从接受边界恢复状态继续推进', kind: '术语', weight: 100, tags: ['执行模式'] },
  ],
  FULL_DECODE_ONLY: [
    { text: 'cudagraph_mode 取值：只对 decode 阶段录制完整图，教程主模型采用', kind: '标识符', weight: 100, tags: ['执行模式'] },
  ],
  cudagraph_mode: [
    { text: 'vLLM 图模式配置字段：历史命名沿用 CUDA，Ascend 上实际对应 ACL Graph', kind: '标识符', weight: 100, tags: ['执行模式'] },
  ],
  MC2: [
    { text: '昇腾 Matmul 与通信融合路线；MoE 具体走 all-to-all 还是 MC2 由硬件和 runner 配置决定', kind: '缩写', weight: 100, tags: ['通信'] },
  ],
};
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 取字、归一化和多义排序如何组合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

profile主入口host为空apply，client内联lexicon/seed并在shell.overlay注册React浮层；不依赖旧动态host RPC。build脚本从两个源文件生成内联副本，package声明UI renderer模块，factory另声明slots服务授权，两者职责不同。

charAtPoint用elementFromPoint和caret API取得Text位置，再用字符Range矩形核指针是否落到字形。沿祖先排除链接/控件/contenteditable并要求user/assistant-step/steering标记，查询限定单Text，不拼跨强调节点。mousemove以50ms节流，查到同一key只更新位置，离开/滚动/失焦隐藏；卸载移除监听、诊断全局和状态。

NFKC/大小写与边缘符号归一化，词条按weight稳定降序。lookupAt枚举覆盖光标的候选，最长优先，并核Latin数字边界，避免WHO命中WHOLE；CJK连续文本可找内部词。空格短语只从当前token起点向右，第二词悬停不能回到第一词，属于明确边界。多义全部展示，不据上下文选择。贡献是本地词库、细粒度字形/消息范围与多义呈现接入，不是新语义模型。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/build-client.mjs:4-14](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/scripts/build-client.mjs#L4-L14)

两种产物/纯客户端profile。

<details>
<summary>查看原文（11行）</summary>

```text
 * 从 src/ 的单一实现生成产物:
 *
 * 1. plugin/cordis-define.json —— 动态插件 (进程内, 重启消失) 的 { host, client } 函数体。
 * 2. lib/ —— 仓库根目录本身就是可持久安装的 profile 包:
 *      lib/index.js      host 半边: 空 apply (纯客户端能力)
 *      lib/client.js     browser module: window.__ModuleLoader__.load({ id, factory })
 *
 * 根 package.json 是手工维护的发布清单 (含 dsh.bundle / dsh.client 声明),
 * 本脚本不生成它; 改动清单字段后运行 test/ 里的契约用例校验。
 *
 * 之所以能纯客户端: 词库内联在浏览器侧, 不需要 RPC, 也不依赖会话级服务。
```

</details>

**依据 2 · 源码核查**：[scripts/build-client.mjs:48-56](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/scripts/build-client.mjs#L48-L56)

唯一源内联。

```text
export function buildInlineSource() {
  const lexiconCode = loadInline('src/lexicon.mjs');
  const seedCode = loadInline('src/seed-data.mjs');
  return `/* 由 scripts/build-client.mjs 生成, 请勿手改; 改 src/ 后重新构建 */
${lexiconCode}

/* ---- 预置词库 (来自 src/seed-data.mjs) ---- */
${seedCode}
`;
```

**依据 3 · 源码核查**：[plugin/client-panel.js:62-102](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L62-L102)

字形取字。

<details>
<summary>查看原文（41行）</summary>

```text
    function charAtPoint(x, y) {
      if (!BROWSER) return null;
      const doc = BROWSER.doc;
      const element = doc.elementFromPoint(x, y);
      if (!element) return null;

      let node = null;
      let offset = -1;
      if (typeof doc.caretRangeFromPoint === 'function') {
        const range = doc.caretRangeFromPoint(x, y);
        if (range && range.startContainer && range.startContainer.nodeType === 3) {
          node = range.startContainer;
          offset = range.startOffset;
        }
      }
      if (!node && typeof doc.caretPositionFromPoint === 'function') {
        const position = doc.caretPositionFromPoint(x, y);
        if (position && position.offsetNode && position.offsetNode.nodeType === 3) {
          node = position.offsetNode;
          offset = position.offset;
        }
      }
      if (!node || offset < 0) return null;

      const data = typeof node.data === 'string' ? node.data : '';
      if (data.length === 0) return null;

      // caret 的 offset 可能落在所见字符右侧, 因此左右两侧都试
      const candidates = [];
      if (offset > 0 && isWordChar(data[offset - 1])) candidates.push(offset - 1);
      if (offset < data.length && isWordChar(data[offset])) candidates.push(offset);
      for (const at of candidates) {
        // caret API 会把行尾空白也吸附到最近文字; 验证指针确实落在字符矩形内。
        const glyph = doc.createRange();
        glyph.setStart(node, at);
        glyph.setEnd(node, at + 1);
        if (Array.from(glyph.getClientRects()).some(r => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)) {
          return { text: data, at, element: node.parentElement || element };
        }
      }
      return null;
```

</details>

**依据 4 · 源码核查**：[plugin/client-panel.js:106-126](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L106-L126)

消息/交互范围。

<details>
<summary>查看原文（21行）</summary>

```text
    function classify(element) {
      if (!element) return { ok: false, reason: 'no-element', chain: [] };
      const chain = [];
      let current = element;
      let inConversation = false;
      while (current && current !== BROWSER.doc.body && current !== BROWSER.doc.documentElement) {
        const tag = typeof current.tagName === 'string' ? current.tagName.toLowerCase() : '?';
        let cls = '';
        try {
          cls = typeof current.className === 'string' ? current.className : '';
        } catch (error) {
          cls = '';
        }
        if (chain.length < 6) chain.push(tag + (cls ? '.' + cls.split(' ').filter(Boolean).slice(0, 2).join('.') : ''));
        if (INTERACTIVE[tag]) return { ok: false, reason: 'inside-' + tag, chain };
        if (current.getAttribute && current.getAttribute('contenteditable') === 'true') return { ok: false, reason: 'editable', chain };
        const kind = current.getAttribute && current.getAttribute('data-chat-flow-kind');
        if (kind === 'user' || kind === 'assistant-step' || kind === 'steering') inConversation = true;
        current = current.parentElement;
      }
      return { ok: inConversation, reason: inConversation ? 'conversation' : 'outside-conversation', chain };
```

</details>

**依据 5 · 源码核查**：[src/lexicon.mjs:218-305](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/src/lexicon.mjs#L218-L305)

候选/边界/最长匹配。

<details>
<summary>查看原文（88行）</summary>

```text
  lookupAt(text, cursor, opts = {}) {
    const window = Math.min(
      Number.isFinite(opts.window) ? opts.window : 16,
      this.maxKeyLength > 0 ? this.maxKeyLength : 16,
    );
    let hit = tokenAt(text, cursor);
    // 光标没有落在词里时的两种情形:
    //  1) 紧跟在某个词右边的空白 -> 锚定该词, 面板保留用户刚看过的那个词;
    //  2) 被空白围住的纯空白位置 -> 向右跳到下一个词, 不越过它去猜左边的词;
    //  3) 其它非词字符 (标点) 且左侧紧邻词 -> 同样锚定左侧的词。
    if (!hit) {
      const pos = Math.max(0, Math.min(text.length, Math.trunc(cursor || 0)));
      const prev = pos > 0 ? text[pos - 1] : '';
      const staysLeft = (prev === ' ' || prev === '\t' || !isWordChar(text[pos] === undefined ? '' : text[pos])) && isWordChar(prev);
      if (staysLeft) {
        const left = tokenAt(text, pos - 1);
        if (left) hit = left;
      }
      if (!hit) {
        let next = pos;
        while (next < text.length && !isWordChar(text[next])) next += 1;
        if (next < text.length) return this.lookupAt(text, next, opts);
      }
    }
    const tokenStart = hit ? Math.min(hit.start, Math.max(0, Math.min(text.length, Math.trunc(cursor || 0)))) : 0;
    const tokenEnd = hit ? hit.end : 0;
    const anchored = hit !== null && hit !== undefined;
    // 扫描起点候选: 从光标所在 token 的首字符一直到光标本身。
    // 向左回溯是必要的 —— CJK 表格文字整段成一个 token, 光标压在 "世" 上时
    // 命中的应当是 "世卫组织" (从 "世" 开始), 而光标压在 "界" 上时应当
    // 仍能命中 "世界卫生组织" (从 "世" 开始)。
    // 不越过 token 首字符, 因此不会吞进前一个独立 token 的字。
    const starts = [];
    if (anchored) {
      const cursorPos = Math.max(0, Math.min(text.length, Math.trunc(cursor || 0)));
      for (let s = tokenStart; s <= cursorPos; s += 1) starts.push(s);
    }
    if (starts.length === 0) {
      starts.push(Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))));
    }
    const cursorPos = anchored ? Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))) : starts[0];
    const candidates = [];
    for (const start of starts) {
      // 每个起点最多向右读 "最长登记词" 个字符; 但光标所在 token 必须被读完,
      // 否则 "世界卫生组织发布报告" 这类长 token 的内部词会被截断。
      const stop = Math.min(text.length, Math.max(anchored && start === tokenStart ? tokenEnd : 0, start + Math.max(1, window)));
      let sawWordChar = false;
      for (let end = start + 1; end <= stop; end += 1) {
        const ch = text[end - 1];
        if (isWordChar(ch)) {
          sawWordChar = true;
          // 候选必须覆盖光标, 否则只是光标左侧的碎片
          if (end > cursorPos) {
            candidates.push({ key: normalize(text.slice(start, end)), start, end });
          }
          continue;
        }
        if (sawWordChar && (ch === ' ' || ch === '\t') && end < text.length && isWordChar(text[end])) continue;
        break;
      }
    }

    // 最长优先
    candidates.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
    for (const candidate of candidates) {
      const list = this.entries.get(candidate.key);
      if (list && list.length > 0) {
        // 拉丁词必须完整匹配: WHO 不应命中 WHOLE, API 不应命中 RAPID。
        // 汉字没有这种边界, 仍允许在连续正文中寻找已登记的多字词。
        const latin = /[\p{Script=Latin}\p{N}_]/u;
        if (latin.test(text[candidate.start]) && candidate.start > 0 && latin.test(text[candidate.start - 1])) continue;
        if (latin.test(text[candidate.end - 1]) && candidate.end < text.length && latin.test(text[candidate.end])) continue;
        return {
          term: text.slice(candidate.start, candidate.end),
          key: candidate.key,
          start: candidate.start,
          end: candidate.end,
          entries: list.map((e) => ({ ...e, tags: e.tags ? e.tags.slice() : [] })),
        };
      }
    }
    // 兜底: 光标所在词整体
    if (hit) {
      const key = normalize(hit.term);
      const list = this.entries.get(key);
      if (list && list.length > 0) {
        return { term: hit.term, key, start: hit.start, end: hit.end, entries: list.map((e) => ({ ...e })) };
      }
```

</details>

**依据 6 · 源码核查**：[plugin/client-panel.js:222-271](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L222-L271)

节流/清理/授权。

<details>
<summary>查看原文（50行）</summary>

```text
      const onMove = (event) => {
        const now = Date.now();
        if (now - last < 50) return;
        last = now;

        const x = event.clientX;
        const y = event.clientY;
        const hit = charAtPoint(x, y);
        if (!hit) {
          hide();
          return;
        }
        const verdict = classify(hit.element);
        if (!verdict.ok) {
          hide();
          return;
        }
        const match = INDEX.lookupAt(hit.text, hit.at);
        const key = match.key;
        if (match.entries.length === 0) {
          hide();
          return;
        }
        if (key === shown) {
          hoverStore.publish({ ...hoverStore.state, visible: true, x, y });
          return;
        }
        shown = key;
        hoverStore.publish({ visible: true, term: match.term, entries: match.entries, x, y });
      };

      const onLeave = () => hide();

      BROWSER.doc.addEventListener('mousemove', onMove, { passive: true });
      BROWSER.doc.addEventListener('mouseleave', onLeave, { passive: true });
      BROWSER.doc.addEventListener('scroll', onLeave, true);
      BROWSER.root.addEventListener('blur', onLeave);
      ctx.effect(() => () => {
        BROWSER.doc.removeEventListener('mousemove', onMove);
        BROWSER.doc.removeEventListener('mouseleave', onLeave);
        BROWSER.doc.removeEventListener('scroll', onLeave, true);
        BROWSER.root.removeEventListener('blur', onLeave);
        if (typeof globalThis !== 'undefined') delete globalThis.__hoverGlossaryDiag__;
        hoverStore.publish({ visible: false, term: '', entries: [], x: 0, y: 0 });
      });
    }

    exports.apply = apply;
    // Cordis 的服务访问授权, 与 manifest 中的模块依赖不是同一个列表。
    exports.inject = ['slots'];
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地查词的隐私、性能和交互边界有哪些？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

没有模型请求/RPC并不等于完全没有内容诊断。apply自动selfCheck，对窗口中心附近取字，先保存Text前24字符与glyph/offset，再调用classify，且不论允许与否都继续tokenAt，把token与判定存全局并console.log。连续中文token可长于24字符。故即使坐标落在非聊天文字，诊断也可能含该处文本；代码不支持断言发送远端，控制台是否被宿主采集/留存未知。应缩减为无文本的API/计数诊断或显式选择后才探测。

lookupAt的window默认16不是全文工作量硬上限。tokenAt可把连续中文当长token，起点枚举回溯至其开头，首起点stop至少到tokenEnd，再构建/归一化/排序候选。50ms只是事件间隔，不限制一次计算耗时；大会话长Text的成本没有测量。不要把已建索引等同恒定时间查词。

浮层pointer-events:none但内容maxHeight/overflow:auto，超长多义列表不能直接靠鼠标进入滚动；只有鼠标mousemove，没有键盘焦点/触屏查询入口，role=tooltip不足以保证辅助技术关联。定义用React文本子节点，不使用innerHTML。scope依赖宿主data标记，单Text/第一词短语为明确覆盖限制，不是跨节点分词。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/client-panel.js:130-153](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L130-L153)

自动诊断包含文本且先于范围过滤。

<details>
<summary>查看原文（24行）</summary>

```text
    function selfCheck() {
      const trace = {};
      trace.index = INDEX.size + ' 词 / ' + INDEX.itemCount + ' 条';
      trace.hasElementFromPoint = !!(BROWSER && BROWSER.doc.elementFromPoint);
      trace.hasCaretRangeFromPoint = !!(BROWSER && BROWSER.doc.caretRangeFromPoint);
      trace.hasCaretPositionFromPoint = !!(BROWSER && BROWSER.doc.caretPositionFromPoint);
      if (BROWSER) {
        const w = BROWSER.root.innerWidth || 0;
        const h = BROWSER.root.innerHeight || 0;
        const probe = charAtPoint(Math.round(w * 0.5), Math.round(h * 0.35));
        trace.probe = probe
          ? { ok: true, text: probe.text.slice(0, 24), at: probe.at, glyph: probe.text[probe.at] }
          : { ok: false };
        if (probe) {
          const verdict = classify(probe.element);
          trace.classify = { ok: verdict.ok, reason: verdict.reason, chain: verdict.chain.join(' < ') };
          const token = tokenAt(probe.text, probe.at);
          trace.token = token ? token.term : null;
          trace.inLexicon = token ? INDEX.has(normalize(token.term)) : false;
        }
      }
      if (typeof globalThis !== 'undefined') globalThis.__hoverGlossaryDiag__ = trace;
      console.log('[hover-glossary] 自检 ' + JSON.stringify(trace));
      return trace;
```

</details>

**依据 2 · 源码核查**：[lib/client.js:1099-1122](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/lib/client.js#L1099-L1122)

分发bundle同样保留诊断。

<details>
<summary>查看原文（24行）</summary>

```text
    function selfCheck() {
      const trace = {};
      trace.index = INDEX.size + ' 词 / ' + INDEX.itemCount + ' 条';
      trace.hasElementFromPoint = !!(BROWSER && BROWSER.doc.elementFromPoint);
      trace.hasCaretRangeFromPoint = !!(BROWSER && BROWSER.doc.caretRangeFromPoint);
      trace.hasCaretPositionFromPoint = !!(BROWSER && BROWSER.doc.caretPositionFromPoint);
      if (BROWSER) {
        const w = BROWSER.root.innerWidth || 0;
        const h = BROWSER.root.innerHeight || 0;
        const probe = charAtPoint(Math.round(w * 0.5), Math.round(h * 0.35));
        trace.probe = probe
          ? { ok: true, text: probe.text.slice(0, 24), at: probe.at, glyph: probe.text[probe.at] }
          : { ok: false };
        if (probe) {
          const verdict = classify(probe.element);
          trace.classify = { ok: verdict.ok, reason: verdict.reason, chain: verdict.chain.join(' < ') };
          const token = tokenAt(probe.text, probe.at);
          trace.token = token ? token.term : null;
          trace.inLexicon = token ? INDEX.has(normalize(token.term)) : false;
        }
      }
      if (typeof globalThis !== 'undefined') globalThis.__hoverGlossaryDiag__ = trace;
      console.log('[hover-glossary] 自检 ' + JSON.stringify(trace));
      return trace;
```

</details>

**依据 3 · 源码核查**：[src/lexicon.mjs:250-281](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/src/lexicon.mjs#L250-L281)

长token枚举/候选排序。

<details>
<summary>查看原文（32行）</summary>

```text
    const starts = [];
    if (anchored) {
      const cursorPos = Math.max(0, Math.min(text.length, Math.trunc(cursor || 0)));
      for (let s = tokenStart; s <= cursorPos; s += 1) starts.push(s);
    }
    if (starts.length === 0) {
      starts.push(Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))));
    }
    const cursorPos = anchored ? Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))) : starts[0];
    const candidates = [];
    for (const start of starts) {
      // 每个起点最多向右读 "最长登记词" 个字符; 但光标所在 token 必须被读完,
      // 否则 "世界卫生组织发布报告" 这类长 token 的内部词会被截断。
      const stop = Math.min(text.length, Math.max(anchored && start === tokenStart ? tokenEnd : 0, start + Math.max(1, window)));
      let sawWordChar = false;
      for (let end = start + 1; end <= stop; end += 1) {
        const ch = text[end - 1];
        if (isWordChar(ch)) {
          sawWordChar = true;
          // 候选必须覆盖光标, 否则只是光标左侧的碎片
          if (end > cursorPos) {
            candidates.push({ key: normalize(text.slice(start, end)), start, end });
          }
          continue;
        }
        if (sawWordChar && (ch === ' ' || ch === '\t') && end < text.length && isWordChar(text[end])) continue;
        break;
      }
    }

    // 最长优先
    candidates.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
```

</details>

**依据 4 · 源码核查**：[plugin/client-panel.js:30-40](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L30-L40)

pointer-events设置。

<details>
<summary>查看原文（11行）</summary>

```text
    const CSS = [
      '.hg-tip{position:fixed;z-index:2147483000;max-width:min(380px,calc(100vw - 24px));pointer-events:none;box-sizing:border-box;',
      'padding:6px 10px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);',
      'background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);',
      'box-shadow:0 6px 24px rgba(0,0,0,.28);font-size:12px;line-height:1.6;}',
      '.hg-tip-head{display:flex;align-items:baseline;gap:6px;margin-bottom:2px;}',
      '.hg-tip-word{font-weight:600;}',
      '.hg-tip-tag{color:var(--dsw-alias-label-secondary);font-size:11px;}',
      '.hg-tip ol{margin:0;padding-left:18px;}',
      '.hg-tip li{margin:1px 0;}',
      '.hg-tip .hg-tip-kind{color:var(--dsw-alias-label-secondary);font-size:11px;margin-left:6px;}',
```

</details>

**依据 5 · 源码核查**：[plugin/client-panel.js:156-189](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L156-L189)

浮层高度/文本渲染。

<details>
<summary>查看原文（34行）</summary>

```text
    function GlossaryTip() {
      const [state, setState] = React.useState(hoverStore.state);
      React.useEffect(() => {
        const listener = (next) => setState(next);
        hoverStore.listeners.add(listener);
        return () => hoverStore.listeners.delete(listener);
      }, []);
      if (!state.visible) return null;
      const width = BROWSER ? BROWSER.root.innerWidth : 1200;
      const height = BROWSER ? BROWSER.root.innerHeight : 800;
      const below = state.y < height / 2;
      const style = { left: Math.max(12, Math.min(state.x + 14, width - 392)) + 'px',
        top: below ? state.y + 18 + 'px' : undefined,
        bottom: below ? undefined : height - state.y + 12 + 'px',
        maxHeight: Math.max(40, (below ? height - state.y - 30 : state.y - 24)) + 'px', overflow: 'auto' };
      const head = React.createElement(
        'div',
        { className: 'hg-tip-head' },
        React.createElement('span', { className: 'hg-tip-word' }, state.term),
        React.createElement('span', { className: 'hg-tip-tag' }, state.entries.length + ' 条'),
      );
      const body = React.createElement(
        'ol',
        null,
        state.entries.map((entry, index) =>
          React.createElement(
            'li',
            { key: index },
            entry.text,
            entry.kind ? React.createElement('span', { className: 'hg-tip-kind' }, entry.kind) : null,
          ),
        ),
      );
      return React.createElement('div', { className: 'hg-tip', role: 'tooltip', style: style }, head, body);
```

</details>

#### 缺口

- 宿主是否自动收集控制台以及保留期限未确定。
  **影响**：本地console内容不能推断远端泄露，也不能保证只存内存。
  **进一步探讨**：检查实际部署日志策略，诊断默认不记原文。
- 长中文文本计算开销和多义列表/键盘可达性缺少对照。
  **影响**：不承诺低延时或所有输入方式可用。
  **进一步探讨**：固定无秘密Text/多义规模与键盘路径，测查询耗时和读完比例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样启用维护，三阶段要付出什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH Web UI renderer/slots与shell.overlay | 加载浮层 | Desktop安装注册不等悬停验收 |
| caret/elementFromPoint/Range浏览器API和消息DOM标记 | 真实字形/聊天范围 | 版本变化要核；非聊天诊断仍可能取字 |
| Node>=20和profile依赖安装 | host/package加载 | Git含lib；旧动态RPC不是持久词库API |
| seed-data与构建副本一致 | 离线释义 | 更新需重建/刷新，不自动学习 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | profile安装后重启/刷新 | 同时核client模块与slots授权 |
| 查词 | 已发送正文真实字形处悬停 | 非链接/编辑区，候选释义需自己判断 |
| 更新 | 改唯一seed再重建同步包 | 新词/大小写/短语/重启持久性分别核 |
| 停用 | 卸载监听/overlay，刷新 | 正文不改；已有console记录不由删全局抹除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装包与内联词库内存，无额外模型API | 核宿主DOM/API、诊断策略和词库适用性 | 实际工时/安装费用未知 |
| 持续使用 | 鼠标查询CPU/React状态与浮层，无直接LLM调用 | 选择释义、纠正文义和维护seed | 总DSH会话费用不等0；长Text延时未知 |
| 失败恢复 | 重建/重载/清监听，旧console仍按宿主管理 | 定位DOM/副本漂移/错误释义并回滚固定包 | 恢复耗时与console保留未知 |

#### 效果

| 目标 | 已实现增量 | 边界 |
| --- | --- | --- |
| 少切换 | 同屏显示已登记多义 | 不做语境消歧或事实核验 |
| 不请求模型 | 内联词库本地匹配 | 启动诊断可能记录局部文字 |
| 可持续维护 | 单源构建/固定安装 | 需人工重建刷新 |

仓库glossary-mapping是维护流程Skill，不是聊天运行时模型工具；不应因为包里有它就说用户查词会消耗模型。作者测试与浏览器报告可作为作者材料，本轮不运行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-44](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/package.json#L23-L44)

模块/Node配置。

<details>
<summary>查看原文（22行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer"
      ]
    }
  },
  "scripts": {
    "build": "node scripts/build-client.mjs",
    "test": "node test/run.mjs",
    "test:browser": "node test/browser.mjs"
  },
  "engines": {
    "node": ">=20"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
```

</details>

**依据 2 · 作者声明**：[README.md:13-37](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/README.md#L13-L37)

作者安装/重建步骤。

<details>
<summary>查看原文（25行）</summary>

````text
用 dsh 自带的插件管理命令安装（包装好后会出现在「设置 → 插件」管理界面里，可启停、可移除）：

```bash
# 从 npm 安装
dsh plugin --profile desktop add hover-glossary@1.1.0
# GitHub 源码安装（当前可用）
dsh plugin --profile desktop add github:AlyceStocking/hover-glossary
```

Desktop 用户安装后完全退出并重新打开应用。Web 用户将命令中的 `desktop` 换成 `web`，然后重启 `dsh web`，通过启动时打印的认证 URL 打开页面。仅更新浏览器 bundle 时通常刷新即可；变更 manifest 或装配后应重启并验证。包和词库在磁盘上，重启后重新装载。

> 不要用手动复制到 `node_modules` + 编辑 `cordis.patch.yml` 的方式安装：那样插件能运行，但因为不是 profile 的 pnpm 依赖，插件管理 UI 不会列出它。也不要用只驻留进程内存的 `cordis_define` / `cordis_run` 代替 profile 安装。

## 更新映射

唯一词库源文件是 `src/seed-data.mjs`：

```js
TERM: [
  { text: '第一解释', kind: '缩写', weight: 100 },
  { text: '第二解释', kind: '代词', weight: 10 },
],
```

`weight` 越大越靠前，相同权重保留登记顺序。改动后运行 `node scripts/build-client.mjs` 与 `node test/run.mjs`，重新安装并刷新验证。完整流程在 [glossary-mapping skill](.dsh/skills/glossary-mapping/SKILL.md)。
````

</details>

**依据 3 · 源码核查**：[.dsh/skills/glossary-mapping/SKILL.md:8-30](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/.dsh/skills/glossary-mapping/SKILL.md#L8-L30)

持久更新和旧RPC边界。

<details>
<summary>查看原文（23行）</summary>

```text
The repository root is the installable package. The sole persistent mapping source is
`src/seed-data.mjs`. Do not add a glossary GUI or model-facing tools.

## Durable update

1. Edit the source mapping, preserving unrelated entries.
2. From the repository root run `node scripts/build-client.mjs`.
3. Run `node test/run.mjs` (16 tests). Tests do not regenerate files;
   a stale artifact should fail verification.
4. Install or update with `dsh plugin --profile web add github:AlyceStocking/hover-glossary`.
5. Reload the browser and hover a changed word in a sent user or assistant message.
   Restart Harness when the manifest or composition changed, and whenever verifying
   persistence. Open the authenticated URL printed at startup.
6. Review the diff before committing. Publish only when requested.

Do not install by copying files into `~/.dsh/profiles/node_modules/` and editing
`cordis.patch.yml` by hand: the plugin runs, but because it is not a pnpm dependency
of the profile, the plugin management UI never lists it. The bundle's own
`cordis.patch.yml` mounts the entry automatically once the package is installed as a
profile dependency.

The package has an empty Host `apply` and a browser module containing the lexicon.
It uses no RPC or model request. Dynamic `cordis_define` / `cordis_run` state and the
```

</details>

**依据 4 · 源码核查**：[plugin/client-panel.js:255-266](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L255-L266)

清理不删除console历史。

<details>
<summary>查看原文（12行）</summary>

```text
      BROWSER.doc.addEventListener('mousemove', onMove, { passive: true });
      BROWSER.doc.addEventListener('mouseleave', onLeave, { passive: true });
      BROWSER.doc.addEventListener('scroll', onLeave, true);
      BROWSER.root.addEventListener('blur', onLeave);
      ctx.effect(() => () => {
        BROWSER.doc.removeEventListener('mousemove', onMove);
        BROWSER.doc.removeEventListener('mouseleave', onLeave);
        BROWSER.doc.removeEventListener('scroll', onLeave, true);
        BROWSER.root.removeEventListener('blur', onLeave);
        if (typeof globalThis !== 'undefined') delete globalThis.__hoverGlossaryDiag__;
        hoverStore.publish({ visible: false, term: '', entries: [], x: 0, y: 0 });
      });
```

</details>

#### 缺口

- 同任务手查词典与悬停的用时/误解率、维护投入没有可比数据。
  **影响**：不量化学习效率或成本节省。
  **进一步探讨**：固定术语任务，对照手查/本插件并记录选择释义正确性和维护时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用建议与进一步探索该从哪里入手？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察，或在无敏感对话且可接受诊断策略的个人环境限定试用。主要用途清晰，固定源码能支撑本地查词/清理机制；但自动诊断文本与鼠标单通道需要先处理，严格保密/键盘优先环境不宜直接启用。Desktop现版本作者只验安装入口，不能外推具体悬停表现。

由启动诊断越过范围过滤、长期限CPU与多义交互限制可推导“最少信息的可达查词适配”。诊断只报告API可用/计数，显式用户请求才处理已获准Text；键盘选择明确词域，浮层可锁定/滚动但不抢正文焦点；候选预算/超限退出避免长Text无界工作。

这是未实现假设。对照原版与适配版，固定用户/助手/侧栏/编辑区探针、长中文、跨样式、多个释义和键盘任务；以日志无原文、拒绝范围不处理、正确查词率、延时与读完比例为判据。反例是严格预算漏长词、锁定浮层抢输入、完全去诊断导致难定位兼容问题；若减少记录却仍有正文出现在诊断，或可达操作明显降低查词正确性/卡住输入，则核心假设被反证。所需人工交互核查和基准维护另计，不把未来适配计入现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/client-panel.js:130-153](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L130-L153)

诊断推导起点。

<details>
<summary>查看原文（24行）</summary>

```text
    function selfCheck() {
      const trace = {};
      trace.index = INDEX.size + ' 词 / ' + INDEX.itemCount + ' 条';
      trace.hasElementFromPoint = !!(BROWSER && BROWSER.doc.elementFromPoint);
      trace.hasCaretRangeFromPoint = !!(BROWSER && BROWSER.doc.caretRangeFromPoint);
      trace.hasCaretPositionFromPoint = !!(BROWSER && BROWSER.doc.caretPositionFromPoint);
      if (BROWSER) {
        const w = BROWSER.root.innerWidth || 0;
        const h = BROWSER.root.innerHeight || 0;
        const probe = charAtPoint(Math.round(w * 0.5), Math.round(h * 0.35));
        trace.probe = probe
          ? { ok: true, text: probe.text.slice(0, 24), at: probe.at, glyph: probe.text[probe.at] }
          : { ok: false };
        if (probe) {
          const verdict = classify(probe.element);
          trace.classify = { ok: verdict.ok, reason: verdict.reason, chain: verdict.chain.join(' < ') };
          const token = tokenAt(probe.text, probe.at);
          trace.token = token ? token.term : null;
          trace.inLexicon = token ? INDEX.has(normalize(token.term)) : false;
        }
      }
      if (typeof globalThis !== 'undefined') globalThis.__hoverGlossaryDiag__ = trace;
      console.log('[hover-glossary] 自检 ' + JSON.stringify(trace));
      return trace;
```

</details>

**依据 2 · 源码核查**：[src/lexicon.mjs:250-281](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/src/lexicon.mjs#L250-L281)

预算推导起点。

<details>
<summary>查看原文（32行）</summary>

```text
    const starts = [];
    if (anchored) {
      const cursorPos = Math.max(0, Math.min(text.length, Math.trunc(cursor || 0)));
      for (let s = tokenStart; s <= cursorPos; s += 1) starts.push(s);
    }
    if (starts.length === 0) {
      starts.push(Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))));
    }
    const cursorPos = anchored ? Math.max(0, Math.min(text.length, Math.trunc(cursor || 0))) : starts[0];
    const candidates = [];
    for (const start of starts) {
      // 每个起点最多向右读 "最长登记词" 个字符; 但光标所在 token 必须被读完,
      // 否则 "世界卫生组织发布报告" 这类长 token 的内部词会被截断。
      const stop = Math.min(text.length, Math.max(anchored && start === tokenStart ? tokenEnd : 0, start + Math.max(1, window)));
      let sawWordChar = false;
      for (let end = start + 1; end <= stop; end += 1) {
        const ch = text[end - 1];
        if (isWordChar(ch)) {
          sawWordChar = true;
          // 候选必须覆盖光标, 否则只是光标左侧的碎片
          if (end > cursorPos) {
            candidates.push({ key: normalize(text.slice(start, end)), start, end });
          }
          continue;
        }
        if (sawWordChar && (ch === ' ' || ch === '\t') && end < text.length && isWordChar(text[end])) continue;
        break;
      }
    }

    // 最长优先
    candidates.sort((a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start);
```

</details>

**依据 3 · 源码核查**：[plugin/client-panel.js:156-189](https://github.com/AlyceStocking/hover-glossary/blob/620b85d4291e6983cc2d1205ff76f4833978f38b/plugin/client-panel.js#L156-L189)

可达交互起点。

<details>
<summary>查看原文（34行）</summary>

```text
    function GlossaryTip() {
      const [state, setState] = React.useState(hoverStore.state);
      React.useEffect(() => {
        const listener = (next) => setState(next);
        hoverStore.listeners.add(listener);
        return () => hoverStore.listeners.delete(listener);
      }, []);
      if (!state.visible) return null;
      const width = BROWSER ? BROWSER.root.innerWidth : 1200;
      const height = BROWSER ? BROWSER.root.innerHeight : 800;
      const below = state.y < height / 2;
      const style = { left: Math.max(12, Math.min(state.x + 14, width - 392)) + 'px',
        top: below ? state.y + 18 + 'px' : undefined,
        bottom: below ? undefined : height - state.y + 12 + 'px',
        maxHeight: Math.max(40, (below ? height - state.y - 30 : state.y - 24)) + 'px', overflow: 'auto' };
      const head = React.createElement(
        'div',
        { className: 'hg-tip-head' },
        React.createElement('span', { className: 'hg-tip-word' }, state.term),
        React.createElement('span', { className: 'hg-tip-tag' }, state.entries.length + ' 条'),
      );
      const body = React.createElement(
        'ol',
        null,
        state.entries.map((entry, index) =>
          React.createElement(
            'li',
            { key: index },
            entry.text,
            entry.kind ? React.createElement('span', { className: 'hg-tip-kind' }, entry.kind) : null,
          ),
        ),
      );
      return React.createElement('div', { className: 'hg-tip', role: 'tooltip', style: style }, head, body);
```

</details>

#### 缺口

- 无文本诊断/预算与键盘适配尚未实现。
  **影响**：不是现有隐私/可达性保证。
  **进一步探讨**：用合成无秘密DOM与固定词典对照原型的拒绝/正确率/耗时。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
