# KeyFlow Typing Studio

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0ba4187](https://github.com/654970/dsh-typing-studio/tree/0ba4187b5db26fa3351ae4d083a426305b440bbd)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：DSH内的中英文打字练习面板，提供拼音、计时、上屏计分和本地记录。

> **亮点**：相对独立打字网页，增量是DSH内双语主题集成、IME组合结束计分及本地短练习；没有证据表明改变学习方法或提高迁移成绩。[Q01](#research-q01)

> **主要限制**：成绩按UTF-16码元计量，最佳只来自近期保留记录，存储写失败被忽略；显示成绩不等于跨文本公平或已持久保存。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁值得在DSH内练习，已有增量是什么？](#detail-section-11)
  - [Q02 · IME与纠错计分是否可解释，有什么边界？](#detail-section-12)
  - [Q03 · 训练数据是否可靠保存，成本与恢复如何？](#detail-section-13)
  - [Q04 · 工程设计和采用结论是什么？](#detail-section-14)
  - [Q05 · 如何使训练成绩更可信且可迁移？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有DSH并愿意短时练习中英文输入的用户；合格交付是一次可解释的练习反馈，不是正式能力认证。[Q01](#research-q01)

独立打字网页或本地文本练习是简单基线；本项比较集成与输入事件机制，没有同文本同输入法学习实验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|双语练习|定时与逐字反馈|内置拼音，自定义无推断读音|
|IME计分|只评已提交文本|须实测本人输入法|
|本地记录|近期成绩与偏好|不跨浏览器，近期最佳非永久最佳|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|DSH slots/locale/React|必需|面板与多语言|入口无法挂载|
|本人IME兼容|中文练习必需|组合上屏反馈|先验收再使用成绩|
|localStorage可写|保存必需|偏好成绩文本|练习可继续但不能保证保留|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|打开打字训练|用户确认面板和语言|核查宿主槽位|
|选短文并测试IME|用户错字纠正后确认口径|停止使用不一致成绩|
|完成再重开|用户确认记录持久化|检查存储和保留策略|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|已有DSH与浏览器|安装、选择输入法和文本|配置耗时|
|持续|localStorage及页面资源|每次训练30/60/120秒并看错字|学习迁移收益|
|失败恢复|本地存储恢复|检查未保存数据、重练或迁移|恢复时间及丢失率|

#### 效果

|效果项|当前支持|未知|
|---|---|---|
|IME友好反馈|composition结束计分|各平台真实顺序|
|局部练习记录|本地成绩及近期最佳|写失败及历史最佳保留|
|输入能力提高|提供练习流程|未见文本迁移收益|

> **思考**：成绩按UTF-16码元计量，最佳只来自近期保留记录，存储写失败被忽略；显示成绩不等于跨文本公平或已持久保存。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对独立打字网页，增量是DSH内双语主题集成、IME组合结束计分及本地短练习；没有证据表明改变学习方法或提高迁移成绩。[Q01](#research-q01)

阶段门与runToken使异步输入/卸载不易写入过期结果，适合输入面板复用；存储回执和长期最佳的语义需改进。[Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

成绩按UTF-16码元计量，最佳只来自近期保留记录，存储写失败被忽略；显示成绩不等于跨文本公平或已持久保存。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有DSH且需要短时双语练习者可控试用；先验证本人IME、纠错口径及本地保存，不将成绩作为正式考试或长期学习成效证明。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

上屏计分及本地练习机制由源码支持；真实IME兼容和学习迁移效果未验证；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 client.js、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码级检查IME、计分、保存、历史最佳和槽位生命周期；未逐条校对段落拼音与视觉布局，未执行。
- 下一步：授权后用不同IME、扩展汉字、纠错、定时结束中输入及存储禁用核查，并以未见文本对照学习迁移。

**分析版本**

- **仓库**：[654970/dsh-typing-studio](https://github.com/654970/dsh-typing-studio)
- **版本号**：1.2.0（[固定提交 0ba4187](https://github.com/654970/dsh-typing-studio/tree/0ba4187b5db26fa3351ae4d083a426305b440bbd)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是显式字素口径、独立累计最佳和保存回执减少成绩误解；用扩展汉字、历史淘汰和配额失败对照，若解释和稳定性不改善则否定。[Q05](#research-q05)

授权后用不同IME、扩展汉字、纠错、定时结束中输入及存储禁用核查，并以未见文本对照学习迁移。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 178 | — | — | 1530 |
| .js | source | 2 | 3006 | 2904 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/654970/dsh-typing-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：双语练习是否提供可信IME反馈和持续训练价值，边界与采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁值得在DSH内练习，已有增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适用对象是愿意在开发工作间隙进行短时中英文打字练习的DSH用户，合格结果是完成定时段落并得到可解释的速度、准确率和错误反馈。README给出12篇原始段落、30/60/120秒以及自定义文本，slots注册侧栏和中央面板支持入口集成。相对独立网页训练，增量是宿主语言/主题一致、无额外账号及中文IME上屏边界；不改变打字学习方法，也没有证明更高学习收益。拼音是预生成注释，作者称pypinyin并人工校对；自定义中文没有自动读音，不能外推通用汉字教学。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-20](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/README.md#L7-L20)

作者功能与适用范围

<details>
<summary>查看原文（14行）</summary>

```text
**中文**：中英文双语打字训练插件，带逐字拼音、计时短文、输入法友好的评分、逐字反馈和本地记录。

## Features

- **Chinese and English practice** with 12 original passages across everyday life, technology, and culture.
- **Timed sessions** of 30, 60, or 120 seconds.
- **Pinyin guides** above every Chinese character, with a toggle to hide them for unassisted speed practice.
- **Custom passages** — paste your own Chinese or English text, keep up to 50 of them, and practise them next to the built-in set. Custom Chinese passages show without pinyin, because readings are not inferred.
- **IME-aware Chinese input** — only committed text is scored, so pinyin candidate editing does not create false misses.
- **Per-character feedback** with correct, incorrect, and current-character states. The passage follows your position automatically.
- **Live statistics** for time left, speed, accuracy, and passage progress.
- **Results and personal bests** in Chinese characters per minute or English net WPM, with the latest attempts kept locally.
- **Bilingual interface** that follows the active Harness locale (`zh` / `en`).
- **No backend, no network requests, no telemetry.** Practice preferences and records stay in the browser's `localStorage`.
```

</details>

**依据 2 · 源码核查**：[client.js:2962-2994](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2962-L2994)

语言和面板注册

<details>
<summary>查看原文（33行）</summary>

```text
    return {
      inject: ["slots", "locale"],
      apply(ctx) {
        ctx.effect(function () {
          const disposeEn = ctx.locale.register(NS, "en", EN);
          const disposeZh = ctx.locale.register(NS, "zh", ZH);
          return function () {
            disposeEn();
            disposeZh();
          };
        }, "typing-studio: locale dictionaries");

        const t = ctx.locale.bind(NS);
        const Entry = makeEntry(ctx.locale, t);

        ctx.slots.inject("sidebar.panellist", function () {
          return ctx.slots.register(
            {
              name: "sidebar.panellist",
              id: MAIN_ID,
              order: 17,
              label: function () {
                const label = t("nav.label");
                return label === "nav.label" ? EN["nav.label"] : label;
              }
            },
            SidebarIcon
          );
        });

        ctx.slots.inject("main", function () {
          return ctx.slots.register({ name: "main", key: MAIN_ID }, Entry);
        });
```

</details>

#### 缺口

- 缺少同任务基线的端到端收益结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · IME与纠错计分是否可解释，有什么边界？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

compositionStart设置标志使onChange不计分，compositionEnd异步提交最终value并用runToken防止过期任务写入；这是避免拼音候选输入被当错字的合理接线。commitValue按公共前后缀找修改区间，每次新提交字符累计尝试，纠错不会抹去已计错误；最终速度按当前正确字符/分钟，英文以5字符为词，与键击速度不同。文本使用JS字符串length及索引，是UTF-16码元而非用户感知字素；罕见汉字、emoji和组合字符可能占多个单位，不能声称所有语言字符计数一致。本轮未运行各平台IME，不能仅凭事件处理认定所有组合顺序正确。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2307-2340](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2307-L2340)

计分及修改区间

<details>
<summary>查看原文（34行）</summary>

```text
      function commitValue(rawValue) {
        if (phaseRef.current !== "running") return;
        const targetText = passage.text;
        let value = String(rawValue == null ? "" : rawValue).replace(/[\r\n]/g, "");
        if (value.length > targetText.length) value = value.slice(0, targetText.length);
        const previous = typedRef.current;
        if (value === previous) return;

        let nextAttempts = attemptsRef.current;
        let nextCorrectAttempts = correctAttemptsRef.current;
        let prefix = 0;
        while (prefix < previous.length && prefix < value.length && previous[prefix] === value[prefix]) prefix += 1;
        let suffix = 0;
        while (
          suffix < previous.length - prefix &&
          suffix < value.length - prefix &&
          previous[previous.length - 1 - suffix] === value[value.length - 1 - suffix]
        ) {
          suffix += 1;
        }
        const changedEnd = value.length - suffix;
        for (let i = prefix; i < changedEnd; i += 1) {
          nextAttempts += 1;
          if (value[i] === targetText[i]) nextCorrectAttempts += 1;
        }
        attemptsRef.current = nextAttempts;
        correctAttemptsRef.current = nextCorrectAttempts;
        setAttempts(nextAttempts);
        setCorrectAttempts(nextCorrectAttempts);
        typedRef.current = value;
        setTyped(value);

        if (value === targetText) {
          finishRef.current("complete", value, runTokenRef.current);
```

</details>

**依据 2 · 源码核查**：[client.js:2344-2362](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2344-L2362)

IME事件和过期token

<details>
<summary>查看原文（19行）</summary>

```text
      function handleInputChange(event) {
        if (composingRef.current) return;
        commitValue(event.currentTarget.value);
      }

      function handleCompositionStart() {
        composingRef.current = true;
        setComposing(true);
      }

      function handleCompositionEnd(event) {
        composingRef.current = false;
        setComposing(false);
        const value = event.currentTarget.value;
        const token = runTokenRef.current;
        window.setTimeout(function () {
          if (runTokenRef.current !== token) return;
          commitValue(value);
        }, 0);
```

</details>

**依据 3 · 源码核查**：[client.js:1637-1649](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1637-L1649)

正确字符与WPM公式

<details>
<summary>查看原文（13行）</summary>

```text
    function countCorrect(target, typed) {
      let correct = 0;
      const limit = Math.min(target.length, typed.length);
      for (let i = 0; i < limit; i += 1) {
        if (target[i] === typed[i]) correct += 1;
      }
      return correct;
    }

    function speedOf(lang, correct, elapsedMs) {
      if (!Number.isFinite(elapsedMs) || elapsedMs < 1200) return 0;
      const units = lang === "en" ? correct / 5 : correct;
      return Math.max(0, Math.round(units / (elapsedMs / 60000)));
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 训练数据是否可靠保存，成本与恢复如何？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

运行依赖宿主React、slots、locale和浏览器localStorage，无Host业务逻辑或外部网络调用在已读客户端中被发现。偏好、最近成绩和自定义文本写本地，隔离/换浏览器不自动同步。writeStorageJSON吞掉配额或隐私模式异常，使练习能继续，但UI没有明确保存失败回执，不能把继续可用等同记录已保存。history按时间排序后截断，best从当前history遍历得出，README称personal best实际只对保留记录成立，历史最好可能被淘汰。首次是安装和选语言/文本的人工时间，持续成本主要是训练本身及本地资源；没有付费依赖不代表学习时间为零。失败恢复应保留原记录、验证写入，不能随意清空训练历史；具体耗时、存储丢失率及学习增益未知。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1484-1499](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1484-L1499)

读取降级与写失败被吞

<details>
<summary>查看原文（16行）</summary>

```text
    function readStorageJSON(key, fallback) {
      try {
        const raw = window.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (error) {
        return fallback;
      }
    }

    function writeStorageJSON(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        /* A private or full storage must never break practice. */
      }
```

</details>

**依据 2 · 源码核查**：[client.js:1513-1544](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1513-L1544)

成绩归一及截断

<details>
<summary>查看原文（32行）</summary>

```text
    function sanitizeHistory(value) {
      if (!Array.isArray(value)) return [];
      const records = [];
      for (let i = 0; i < value.length; i += 1) {
        const raw = value[i];
        if (!isRecord(raw)) continue;
        const at = Number(raw.at);
        if (!Number.isFinite(at) || at <= 0) continue;
        const topic = raw.topic === "daily" || raw.topic === "tech" || raw.topic === "culture" || raw.topic === "custom" ? raw.topic : "daily";
        records.push({
          id: typeof raw.id === "string" ? raw.id : "record-" + at + "-" + i,
          at,
          lang: raw.lang,
          duration: DURATIONS.indexOf(Number(raw.duration)) >= 0 ? Number(raw.duration) : 60,
          topic,
          title: typeof raw.title === "string" ? raw.title.slice(0, 120) : "",
          speed: Math.max(0, Math.round(Number(raw.speed) || 0)),
          accuracy: Math.min(100, Math.max(0, Math.round(Number(raw.accuracy) || 0))),
          progress: Math.min(100, Math.max(0, Math.round(Number(raw.progress) || 0))),
          correct: Math.max(0, Math.round(Number(raw.correct) || 0)),
          attempts: Math.max(0, Math.round(Number(raw.attempts) || 0)),
          elapsedMs: Math.max(0, Math.round(Number(raw.elapsedMs) || 0)),
          reason: raw.reason === "complete" ? "complete" : "time",
          ranked: raw.ranked === true
        });
      }
      records.sort(function (left, right) { return right.at - left.at; });
      return records.slice(0, HISTORY_LIMIT);
    }

    function loadHistory() {
      return sanitizeHistory(readStorageJSON(HISTORY_KEY, []));
```

</details>

**依据 3 · 源码核查**：[client.js:1691-1702](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1691-L1702)

best只从保留history计算

<details>
<summary>查看原文（12行）</summary>

```text
    function findBest(history, lang) {
      let best = null;
      const minimumCorrect = lang === "en" ? 20 : 10;
      for (let i = 0; i < history.length; i += 1) {
        const record = history[i];
        if (record.lang !== lang || record.attempts <= 0) continue;
        if (record.elapsedMs < 10000 || record.correct < minimumCorrect) continue;
        if (!best || record.speed > best.speed || (record.speed === best.speed && record.accuracy > best.accuracy)) {
          best = record;
        }
      }
      return best;
```

</details>

**依据 4 · 作者声明**：[README.md:43-45](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/README.md#L43-L45)

作者说明本地记录范围

```text
## Privacy

The plugin writes three `localStorage` values: practice preferences, up to 16 practice records, and up to 50 custom passages (capped at 200 KB). Personal bests are derived from those records. Nothing is uploaded.
```

#### 缺口

- 缺少实际资源峰值、失败恢复时间与单位合格任务成本
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程设计和采用结论是什么？

**研究主题**：工程质量与复用、采用判断

#### 完整回答

runToken和phase防止结束或切换后旧回调写成绩，locale注册有effect释放，卸载时标记stopped并推进token，属于可复用的异步UI防旧结果设计。单文件把段落、翻译、CSS和业务混合，维护时须检查文本与评分一致；代码量不代表训练质量。建议对本来就在DSH内需要短练习的人做可控试用，不作教学成效或标准考试成绩来源。先以故意错字再纠正、不同IME、定时结束中组合输入及存储禁用做小样验收，确认口径可理解、卸载无残留入口；若丢分或保存提示误导则停止。训练效果应用相同未见文本在一周后对照独立练习基线，不以熟悉段落分数提高当迁移学习。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:2256-2275](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2256-L2275)

结束状态及时间/计分

<details>
<summary>查看原文（20行）</summary>

```text
      function finishRun(reason, forcedValue, token) {
        if (token !== undefined && token !== runTokenRef.current) return;
        if (phaseRef.current !== "running") return;
        phaseRef.current = "done";
        setPhase("done");
        composingRef.current = false;
        setComposing(false);

        const finalText = typeof forcedValue === "string" ? forcedValue : typedRef.current;
        const durationMs = duration * 1000;
        const actualElapsed = Math.max(0, Math.min(durationMs, Date.now() - startedAtRef.current));
        const elapsedMs = reason === "time" ? durationMs : Math.max(250, actualElapsed);
        const correct = countCorrect(passage.text, finalText);
        const attemptsMade = Math.max(attemptsRef.current, finalText.length);
        const correctMade = Math.min(attemptsMade, Math.max(correctAttemptsRef.current, correct));
        const accuracy = attemptsMade > 0 ? Math.round((correctMade / attemptsMade) * 100) : 0;
        const speed = speedOf(lang, correct, elapsedMs);
        const progress = targetLength > 0 ? finalText.length / targetLength : 0;
        const progressPercent = Math.min(100, Math.round(progress * 100));
        const ranked = finalText.length > 0 && elapsedMs >= 10000 && correct >= (lang === "en" ? 20 : 10);
```

</details>

**依据 2 · 源码核查**：[client.js:2399-2406](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2399-L2406)

卸载令旧回调失效

```text
      React.useEffect(
        function () {
          return function () {
            phaseRef.current = "stopped";
            runTokenRef.current += 1;
          };
        },
        []
```

**依据 3 · 源码核查**：[client.js:2964-2972](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L2964-L2972)

语言注册释放

```text
      apply(ctx) {
        ctx.effect(function () {
          const disposeEn = ctx.locale.register(NS, "en", EN);
          const disposeZh = ctx.locale.register(NS, "zh", ZH);
          return function () {
            disposeEn();
            disposeZh();
          };
        }, "typing-studio: locale dictionaries");
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何使训练成绩更可信且可迁移？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是将“保留记录中的最好”与独立持久累计最佳分开，并按字素分割提供明确计分口径，加上保存状态回执，降低跨输入法与数据淘汰造成的误解。推导来自UTF-16索引、16条近期历史和吞写异常三个已读机制；新增负担是迁移既有成绩口径、最佳重算和存储事务。最小实验保留一条早期最佳并生成超限记录、使用扩展汉字/组合字符、模拟写入配额失败，对照当前实现的计数、最佳保留与用户解释正确率。若仅增复杂性而不改善误解或稳定性，则否定；没有用户证据前不是独立产品机会。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1637-1649](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1637-L1649)

码元口径

<details>
<summary>查看原文（13行）</summary>

```text
    function countCorrect(target, typed) {
      let correct = 0;
      const limit = Math.min(target.length, typed.length);
      for (let i = 0; i < limit; i += 1) {
        if (target[i] === typed[i]) correct += 1;
      }
      return correct;
    }

    function speedOf(lang, correct, elapsedMs) {
      if (!Number.isFinite(elapsedMs) || elapsedMs < 1200) return 0;
      const units = lang === "en" ? correct / 5 : correct;
      return Math.max(0, Math.round(units / (elapsedMs / 60000)));
```

</details>

**依据 2 · 源码核查**：[client.js:1691-1702](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1691-L1702)

保留历史最佳

<details>
<summary>查看原文（12行）</summary>

```text
    function findBest(history, lang) {
      let best = null;
      const minimumCorrect = lang === "en" ? 20 : 10;
      for (let i = 0; i < history.length; i += 1) {
        const record = history[i];
        if (record.lang !== lang || record.attempts <= 0) continue;
        if (record.elapsedMs < 10000 || record.correct < minimumCorrect) continue;
        if (!best || record.speed > best.speed || (record.speed === best.speed && record.accuracy > best.accuracy)) {
          best = record;
        }
      }
      return best;
```

</details>

**依据 3 · 源码核查**：[client.js:1494-1499](https://github.com/654970/dsh-typing-studio/blob/0ba4187b5db26fa3351ae4d083a426305b440bbd/client.js#L1494-L1499)

写入缺少可见结果

```text
    function writeStorageJSON(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        /* A private or full storage must never break practice. */
      }
```

#### 缺口

- 未来设计假设的对照实验尚无结果
  **影响**：无法确认收益、代价或假设优于简单替代
  **进一步探讨**：按本题提出的对照记录正确率、总时间、资源与人工复核，保留失败样本

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
