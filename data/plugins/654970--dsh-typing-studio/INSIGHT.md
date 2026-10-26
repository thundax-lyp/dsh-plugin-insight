# dsh-typing-studio

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[e23f470](https://github.com/654970/dsh-typing-studio/tree/e23f470b81461435804faf15380fcd104f0a46c9)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：在 DSH Web 提供中英文计时打字练习、中文拼音、IME友好计分与本地记录。

> **核心亮点**：将中文拼音、IME提交感知和双语计时整合到DSH面板，减少切换且避免候选编辑直接误计。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：best只来自最近16条且按JS位置计字，不能当永久纪录或任意Unicode一致测量；熟题变快也不证明陌生任务改善。参见[Q02](#research-q02)。

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
  - [Q01 · 谁需要双语打字面板，它改变什么训练流程？](#detail-section-11)
  - [Q02 · IME、准确率、计时与个人最佳的边界是什么？](#detail-section-12)
  - [Q03 · 本地练习的采用成本与改进验证是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在工作间隙做本机双语自我练习；以清楚口径的练习记录验收，不作正式认证或健康/效率承诺。

独立打字网站或手工计时是参照；宿主内训练省切换但未证实比专用训练工具更有效。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 双语计时 | 自我练习 | 固定文本，非认证 |
| IME计分 | 避免候选误计 | 需目标IME核验 |
| 本地记录 | 查看近期成绩 | 最近16条派生best，非永久 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web slots/locale/React | 启动必需 | 面板与双语UI | 无面板，独立练习工具 |
| IME正确事件 | 中文计分必需 | 只计提交文本 | 分数不可信，停止测评 |
| localStorage | 记录必需 | 偏好与16条成绩 | 当次可练，持久未知 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户启用并开侧栏面板 | 中英文与时长可选 |
| 2 | 用户练习并回改 | IME候选不误计，原错误保留 |
| 3 | 用户查成绩与重启 | 记录一致；失败不作进步证据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 客户端包/浏览器 | 安装、选择语言与时长 | 金额/兼容未测 |
| 持续使用 | 渲染与本地存储 | 每轮30/60/120秒与复核 | 无强制外服，效果未测 |
| 失败恢复 | 重载/重练 | 查IME/记录，重设偏好 | 保存失败旁路，恢复工时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 中文输入 | composition后计分 | 多IME一致性 |
| 自我反馈 | 速度、准确率和逐字状态 | 陌生文本能力提升 |
| 记录 | 最近16条派生best | 永久最佳/存储失败恢复 |

> **思考**：best只来自最近16条且按JS位置计字，不能当永久纪录或任意Unicode一致测量；熟题变快也不证明陌生任务改善。参见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将中文拼音、IME提交感知和双语计时整合到DSH面板，减少切换且避免候选编辑直接误计。参见[Q01](#research-q01)、[Q02](#research-q02)。

将中文拼音、IME提交感知和双语计时整合到DSH面板，减少切换且避免候选编辑直接误计。参见[Q01](#research-q01)、[Q02](#research-q02)。

run token约束composition延迟回调、尝试累计不抹原错误值得借鉴；计量单位和历史窗口须显式，移植需逐IME与Unicode样例。

<a id="detail-section-5"></a>

### 1.4 主要限制

best只来自最近16条且按JS位置计字，不能当永久纪录或任意Unicode一致测量；熟题变快也不证明陌生任务改善。参见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

本机自我练习可试用，先核IME回改与重启；长期纪录/认证需求改独立受控测评。参见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

练习与IME提交过滤有源码支持；多IME、持久化和训练迁移未验证；独立最佳/字素基准是假设。

- 已检查：作者 README、包清单、源码路径 client.js、index.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查输入事件/计分/计时/存储/注册主链，未逐字核全部拼音或执行多IME/宿主。
- 下一步：未运行目标。跨IME、回改、到时、16条淘汰与陌生短文验证计分/迁移。

**分析版本**

- **仓库**：[654970/dsh-typing-studio](https://github.com/654970/dsh-typing-studio)
- **版本号**：1.1.0（[固定提交 e23f470](https://github.com/654970/dsh-typing-studio/tree/e23f470b81461435804faf15380fcd104f0a46c9)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是独立保存永久最佳、字素计量并用陌生文本基准区分背诵与迁移；需跨IME对照。参见[Q03](#research-q03)。

未运行目标。跨IME、回改、到时、16条淘汰与陌生短文验证计分/迁移。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2568 | 2488 | 10 | — |
| .md | source | 1 | 48 | — | — | 431 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/654970/dsh-typing-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：双语打字面板的计分、IME与训练收益边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要双语打字面板，它改变什么训练流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在DSH工作间隙练习中文输入法或英文键盘的用户可选择短文和30/60/120秒任务，以逐字正确率、速度和进度自我观察。合格交付是一轮有明确计量口径的本地练习记录，不是认证成绩，也不自动证明长期输入能力改善。

相对独立打字网站，本项把双语、中文拼音注音、IME提交过滤与本地记录放入宿主侧栏/中央面板，无强制后端。贡献是适配中文输入和降低切换，计时/逐字对比本身属于常规训练设计；拼音来自pypinyin预生成和作者校对，不能归为新语言模型能力。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-18](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/README.md#L5-L18)

作者列双语/IME/本地能力。

<details>
<summary>查看原文（14行）</summary>

```text
Repository: [654970/dsh-typing-studio](https://github.com/654970/dsh-typing-studio)

**中文**：中英文双语打字训练插件，带逐字拼音、计时短文、输入法友好的评分、逐字反馈和本地记录。

## Features

- **Chinese and English practice** with 12 original passages across everyday life, technology, and culture.
- **Timed sessions** of 30, 60, or 120 seconds.
- **Pinyin guides** above every Chinese character, with a toggle to hide them for unassisted speed practice.
- **IME-aware Chinese input** — only committed text is scored, so pinyin candidate editing does not create false misses.
- **Per-character feedback** with correct, incorrect, and current-character states. The passage follows your position automatically.
- **Live statistics** for time left, speed, accuracy, and passage progress.
- **Results and personal bests** in Chinese characters per minute or English net WPM, with the latest attempts kept locally.
- **Bilingual interface** that follows the active Harness locale (`zh` / `en`).
```

</details>

**依据 2 · 源码核查**：[client.js:2539-2555](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L2539-L2555)

宿主面板接线。

<details>
<summary>查看原文（17行）</summary>

```text
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
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · IME、准确率、计时与个人最佳的边界是什么？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

composition期间onChange不计分，compositionEnd用run token保护延迟提交；commitValue通过公共前后缀识别变更字符，累计尝试与正确尝试，回改不会抹掉原错误。速度按最终位置相等字符计数，英文除5；因此速度和准确率分母不同，不能简单把速度乘准确率等同净产出。粘贴/拖放被UI阻止，但没有可信竞赛的输入证明。

finish以Date.now计时并限时，10秒和最少正确字符才参与best，避免极短样本。但历史只保留最近16条，best从这些记录派生，故不是永久生涯纪录；老最佳会随窗口淘汰。比较使用JS字符串位置/length，不是Unicode字素，扩展汉字和组合字符不能当然按人感知一字计量。作者12篇固定材料可以练习，却不足以证明迁移到陌生文本。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1890-1945](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L1890-L1945)

累计提交与composition保护。

<details>
<summary>查看原文（56行）</summary>

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
        }
      }

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

**依据 2 · 源码核查**：[client.js:1384-1396](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L1384-L1396)

按字符串索引计正确/速度。

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

**依据 3 · 源码核查**：[client.js:1847-1883](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L1847-L1883)

计时与滚动历史。

<details>
<summary>查看原文（37行）</summary>

```text
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
        const bestBefore = findBest(history, lang);
        const newBest = ranked && (!bestBefore || speed > bestBefore.speed || (speed === bestBefore.speed && accuracy > bestBefore.accuracy));
        const now = Date.now();
        const record = {
          id: String(now) + "-" + Math.random().toString(36).slice(2, 7),
          at: now,
          lang,
          duration,
          topic: passage.topic,
          title: passage.title,
          speed,
          accuracy,
          progress: progressPercent,
          correct,
          attempts: attemptsMade,
          elapsedMs,
          reason,
          ranked
        };

        setRemainingMs(reason === "time" ? 0 : Math.max(0, durationMs - elapsedMs));
        if (finalText.length > 0) {
          const nextHistory = [record, ...history].slice(0, HISTORY_LIMIT);
          setHistory(nextHistory);
          writeStorageJSON(HISTORY_KEY, nextHistory);
```

</details>

**依据 4 · 源码核查**：[client.js:2253-2267](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L2253-L2267)

UI阻止粘贴/拖放。

<details>
<summary>查看原文（15行）</summary>

```text
                            type: "text",
                            lang: lang === "zh" ? "zh-CN" : "en",
                            autoComplete: "off",
                            autoCorrect: "off",
                            autoCapitalize: "off",
                            autoFocus: true,
                            spellCheck: false,
                            maxLength: targetLength,
                            placeholder: tr("console.placeholder"),
                            "aria-label": tr("console.inputLabel"),
                            onChange: handleInputChange,
                            onCompositionStart: handleCompositionStart,
                            onCompositionEnd: handleCompositionEnd,
                            onPaste: function (event) { event.preventDefault(); },
                            onDrop: function (event) { event.preventDefault(); }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地练习的采用成本与改进验证是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

启动依赖DSH Web的locale/conversation和React模块表、slots扩展；host为空，不需服务账号。首次安装并选择语言/时长，持续投入主要是练习时间、浏览器渲染与本地记录存储；保存失败被吞，练习继续但记录可能不持久。没有费用数据，不能把本地等同零资源或保证不丢记录；退出/清浏览器数据会影响偏好和best。

建议试用，适合自我练习且接受本机短历史的人，不适合竞赛认证或跨设备长期测评。先核自己的IME、回改、到时、重启记录；出现误计/记录丢失就停止用分数作进步依据。未验证假设是将历史滚动与持久最佳分离、增加陌生文本基准和字素计量。由滚动best与固定文本推导，可能区分熟练背诵和技能迁移，新增题库/版本校准成本。最小验证16条以上淘汰场景、不同IME和未练短文对照，记录计分一致与迁移正确率；若仅熟题变快则不支持训练迁移。

#### 证据与依据

**依据 1 · 源码核查**：[client.js:1312-1327](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L1312-L1327)

本地存储错误旁路。

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

**依据 2 · 源码核查**：[client.js:1439-1449](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/client.js#L1439-L1449)

best由现有记录选择。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 3 · 源码核查**：[package.json:42-53](https://github.com/654970/dsh-typing-studio/blob/e23f470b81461435804faf15380fcd104f0a46c9/package.json#L42-L53)

客户端依赖声明。

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
```

</details>

#### 缺口

- 多IME、重启持久和陌生材料迁移未验证
  **影响**：不能认定评分兼容或训练改善
  **进一步探讨**：按目标IME、16条滚动和未练短文核计分/迁移

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
