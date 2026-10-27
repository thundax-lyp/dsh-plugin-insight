# Vox Director

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[6a85a7c](https://github.com/Alisa0808/vox-director/tree/6a85a7c341610442a6a5b1885e6e0217ab82a11f)

<!-- BEGIN META -->
[![GitHub ★ 2,469](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C469&color=yellow&logo=github&style=flat)](https://github.com/Alisa0808/vox-director)
<!-- END META -->

> **实现功能**：以主题和 beats 配置编排拼贴视频的图像、运动、旁白、音乐和字幕，并用 ffmpeg 合成。

> **核心亮点**：以beat/shot身份联接多模态阶段和本地音画组装，减少手工交接；生成模型贡献归服务提供方。见[Q01](#research-q01)。

> **风险与缺陷**：底层POST不重试但上层pending超时会submit新ID，且批末才落成品URL；未知任务不能当失败安全重跑。见[Q03](#research-q03)。

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
  - [Q01 · 视频Skill为谁增加什么交付？](#detail-section-11)
  - [Q02 · 阶段、任务状态和ffmpeg怎样接线？](#detail-section-12)
  - [Q03 · 付费重试与内容一致性怎样限制一键承诺？](#detail-section-13)
  - [Q04 · 什么采用结论与可证伪生产改进有依据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有媒体制作经验的创作者研究短解说/广告的多阶段拼贴视频流水线。

手工媒体API+本地剪辑或静态图/旁白为基线；不用模型功能数量证明编排ROI。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| beat/shot编排 | 统一脚本到镜头身份 | Agent指南，人类决策不是脚本硬门 |
| Atlas阶段调用 | 图像/运动/音频生成 | 付费外部服务，pending重提要对账 |
| 本地合成 | MP4音画与字幕 | 工具链和人工内容验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可读Skill并运行Python的Agent | 必需 | 遵循编排与人类门 | 非DSH原生注册 |
| Atlas账号/key与可用模型 | 云生成必需 | 图/动/声音 | 费用与可用性未知，不盲重提 |
| ffmpeg/ffprobe/Pillow | 本地合成必需 | 音画和字幕 | 阶段不能交付最终片 |
| 人类创意/事实审阅 | 合格片必需 | 节拍、风格与内容 | 模型完成非内容验收 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 规划 | 创作者审批beat map及风格 | 叙事与预算/素材范围清楚 |
| 生成 | Agent按shot调用并保存回执 | 先核ID结果再继续 |
| 合成 | 本地ffmpeg组装与人审 | 事实/连续性/字幕/音量合格 |
| 恢复 | 停新建任务，按ID对账 | 复用已下载素材，不重跑整片 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | API账号、ffmpeg/Pillow和存储；金额未知 | 节拍/风格审阅与工具配置 | 未执行第三方调用 |
| 持续使用 | 每shot图/视频、TTS/音乐及编码 | 事实、连续性、字幕和声音复核 | 当前价格与返工未知 |
| 失败恢复 | 旧pending与新ID可能并存，金额未知 | 对账预测ID和本地产物 | 不把超时当安全重提 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多阶段组织 | beats与shot共用身份 | 合格片率/人工节时 |
| 音画合成 | ffmpeg混音和拼接 | 真实媒体兼容与观感 |
| 恢复 | 已有URL跳过 | 未知远端任务与费用闭环 |

> **思考**：底层POST不重试但上层pending超时会submit新ID，且批末才落成品URL；未知任务不能当失败安全重跑。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以beat/shot身份联接多模态阶段和本地音画组装，减少手工交接；生成模型贡献归服务提供方。见[Q01](#research-q01)。

以beat/shot身份联接多模态阶段和本地音画组装，减少手工交接；生成模型贡献归服务提供方。见[Q01](#research-q01)。

beat/shot显式身份和provider隔离值得借鉴；低层不重试POST与高层stall重提要同时审，移植需先补持久回执而非复制默认重试，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

底层POST不重试但上层pending超时会submit新ID，且批末才落成品URL；未知任务不能当失败安全重跑。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察编排和回执边界，付费试验需先有明确预算/逐任务对账；源码检查不授权生成。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

编排与组装源码可核查，非原生DSH插件；付费pending重提和回执恢复缺口使先观察，持久对账为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、SKILL.md、scripts/atlas_cloud.py、scripts/provider.py、scripts/keyframes.py、scripts/assemble.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码核Python编排与组装，不执行付费API或ffmpeg，不验模型ID可用性/实际价格/成片效果。
- 下一步：先模拟provider延迟/中断核重复提交和恢复，再在明确预算授权下做单shot质量/费用对照；本轮不实际生成。

**分析版本**

- **仓库**：[Alisa0808/vox-director](https://github.com/Alisa0808/vox-director)
- **版本号**：1.0.0（[固定提交 6a85a7c](https://github.com/Alisa0808/vox-director/tree/6a85a7c341610442a6a5b1885e6e0217ab82a11f)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是持久shot指纹和预测回执，pending先对账再新建；延迟/中断模拟无重复收益则重新评估。见[Q04](#research-q04)。

先模拟provider延迟/中断核重复提交和恢复，再在明确预算授权下做单shot质量/费用对照；本轮不实际生成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1677 | — | — | 17917 |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/Alisa0808/vox-director/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/Alisa0808/vox-director/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A29.764Z..2026-10-27T02%3A07%3A29.764Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Alisa0808/vox-director/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A29.764Z..2026-10-27T02%3A07%3A29.764Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查通用视频Skill编排增量、人工决策和付费失败恢复

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 视频Skill为谁增加什么交付？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

短解说或广告创作者可从一个主题生成脚本节拍、拼贴关键帧、运动、旁白、音乐和字幕，并本地合成为MP4。合格结果应是叙事事实准确、画面/声音一致且可审的短片，不只是脚本成功结束。相对逐个调用媒体API再手工剪辑，它以beats.json保存叙事和镜头身份，统一多阶段输入并保留中间产物；相对简单静态图加旁白，它增加多模型运动和主持人等能力，也增加费用与一致性风险。根是可被编码Agent读取的Skill与Python脚本，package未声明DSH bundle，不能据目录收录称原生DSH安装插件。模型图像/视频/声音能力来自Atlas服务，贡献在创作编排和本地组装而非生成模型原创。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-7](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/README.md#L5-L7)

作者定位通用Agent Skill与Atlas/ffmpeg

```text
**Turn one topic into a finished Vox-style paper-collage explainer / ad video — script, collage keyframes, motion, voice-over, music and captions, all automated.**

An **agent skill** that runs end to end on the [Atlas Cloud](https://www.atlascloud.ai/?utm_source=github&utm_campaign=vox_director) API + local `ffmpeg`, usable by any coding agent (Claude Code, Codex, etc.). You give it a one-line topic; it gives you an `mp4`.
```

**依据 2 · 作者声明**：[README.md:44-56](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/README.md#L44-L56)

beats驱动的阶段及人工决策

<details>
<summary>查看原文（13行）</summary>

````text
One topic flows through one script per stage, all driven by a single `beats.json` per project:

```
topic
  │
  ├─ 1. beat map        pick a narrative arc → write beats.json      ◀── GATE 1: you approve the beat map
  ├─ 2. style bake-off  render the same beat in 3–4 themes           ◀── GATE 2: you pick the look by eye
  ├─ 3. keyframes       one collage poster per beat  (nano-banana-2)
  ├─ 4. motion          animate each poster          (gemini-omni-flash i2v)
  ├─ 5. voice + music   one narrator (xai/tts) + BGM (minimax/music)
  ├─ 6. assemble        ffmpeg: concat, duck music under VO, burn captions + watermark
  └─ final.mp4
```
````

</details>

**依据 3 · 源码核查**：[SKILL.md:52-66](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/SKILL.md#L52-L66)

叙事字段和先审beat map要求

<details>
<summary>查看原文（15行）</summary>

```text
## Standard workflow (topic → film)

This is the default, most-automated path. Every stage is one script, all driven by a single
`beats.json` per project under `out/<project>/`.

1. **Topic → beat map.** First **read `references/beat-layer.md`** (the story layer) and pick a
   narrative `arc` that fits the topic (`timeline` for history, `pas`/`bab` for ads,
   `how_it_works` for explainers, `man_in_hole` for transformations, …). Then write
   `out/<project>/beats.json` following that arc: **beat-1 headline must be a ≤3s hook**; beat
   count per duration (30s→6–8, 60s→10–12); split each beat into **2 shots** (wide+detail) with
   **per-shot `camera_move` VARIED across adjacent beats** (never repeat; `static` on the payoff)
   and **rich `element_motion`** (see step 4). Each beat: `narration`, `title_cn`/`title_en`,
   `scene`, `bg`, `feel`, `hook`. This draft is the **first mandatory approval gate** — show the
   user the beat map before generating (the aspect-routing approximation in step 4 is the other
   one). Examples in `examples/`.
```

</details>

#### 缺口

- 真实创作者的合格片率与对手工流水线净收益未知
  **影响**：不能确认端到端自动化提高产出质量
  **进一步探讨**：同一15秒非敏感主题比较脚本链与手工/静态基线，按事实、连续性、音画和人工返工验收

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 阶段、任务状态和ffmpeg怎样接线？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

Skill要求先核API key、ffmpeg/ffprobe及Pillow，再写beats并取得用户节拍/视觉方向判断；这些是Agent工作指令，直接运行脚本不必然受同样硬门约束。Provider抽象当前只有Atlas后端，阶段调用submit/poll/download。keyframes对已有keyframe_url跳过，为未生成shot组spec，批量run_jobs后下载并把URL/路径写回beats；assemble按beat和shot读取时长，以ffmpeg归一、拼接，混旁白与音乐并压低BGM。共享beats让阶段可复用，但任务ID只在run_jobs内存状态/日志，不在提交后立即持久到beats；中断恢复不能仅靠已有成品URL覆盖所有已计费任务。可借鉴叙事身份与产物解耦，代价是须为每阶段补明确任务回执和资产完整性。

#### 证据与依据

**依据 1 · 源码核查**：[SKILL.md:45-66](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/SKILL.md#L45-L66)

前置及人工gate属于指南

<details>
<summary>查看原文（22行）</summary>

```text
## Prerequisites (check, don't skip)

- `echo "${ATLASCLOUD_API_KEY:+set}"` — if empty, tell the user to set it (get one at
  https://www.atlascloud.ai/console/api-keys) and stop.
- `command -v ffmpeg ffprobe` — required for assembly (`brew install ffmpeg` on macOS).
- `python3 -c "import PIL"` — Pillow, for captions/watermark overlays.

## Standard workflow (topic → film)

This is the default, most-automated path. Every stage is one script, all driven by a single
`beats.json` per project under `out/<project>/`.

1. **Topic → beat map.** First **read `references/beat-layer.md`** (the story layer) and pick a
   narrative `arc` that fits the topic (`timeline` for history, `pas`/`bab` for ads,
   `how_it_works` for explainers, `man_in_hole` for transformations, …). Then write
   `out/<project>/beats.json` following that arc: **beat-1 headline must be a ≤3s hook**; beat
   count per duration (30s→6–8, 60s→10–12); split each beat into **2 shots** (wide+detail) with
   **per-shot `camera_move` VARIED across adjacent beats** (never repeat; `static` on the payoff)
   and **rich `element_motion`** (see step 4). Each beat: `narration`, `title_cn`/`title_en`,
   `scene`, `bg`, `feel`, `hook`. This draft is the **first mandatory approval gate** — show the
   user the beat map before generating (the aspect-routing approximation in step 4 is the other
   one). Examples in `examples/`.
```

</details>

**依据 2 · 源码核查**：[scripts/provider.py:93-104](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/provider.py#L93-L104)

job状态在内存且打印pid

<details>
<summary>查看原文（12行）</summary>

```text
def run_jobs(prov, specs, *, poll_s=3, stall_s=90, max_retries=2, deadline_s=900):
    """Submit + poll a batch of jobs, resubmitting any that FAIL or STALL.

    specs: dict of key -> submit() callable returning a job id. A job that fails,
    or stays pending past `stall_s`, is resubmitted (fresh id) up to `max_retries`
    times — this is what stops one stuck prediction from wasting the whole deadline.
    Returns key -> output URL (or None). Prints progress like the old loops did.
    """
    st = {}
    for key, submit in specs.items():
        st[key] = {"pid": submit(), "t": time.time(), "tries": 0}
        print(f"[{key}] submitted {st[key]['pid']}")
```

</details>

**依据 3 · 源码核查**：[scripts/keyframes.py:49-85](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/keyframes.py#L49-L85)

已有URL跳过与批后写回

<details>
<summary>查看原文（37行）</summary>

```text
    prov = get_provider(doc.get("provider"))
    specs, by_key = {}, {}
    for beat in doc["beats"]:
        for shot, key in shots_of(beat):
            if shot.get("kind") == "host":      # presenter shots use host_plates.py
                continue
            if shot.get("keyframe_url"):        # already generated (e.g. reused wide) -> skip
                continue
            scene = shot["scene"]
            if style == "collage":
                prompt = compose_collage_prompt(scene, beat["title_cn"], beat["title_en"],
                                                beat.get("bg", "warm ochre"), aspect,
                                                with_title=shot.get("title", True),
                                                style=collage_style, palette=t_palette,
                                                type_style=t_type, finish=t_finish)
            else:
                prompt = compose_keyframe_prompt(era, scene, beat["title_cn"],
                                                 beat["title_en"], aspect)
            shot["keyframe_prompt"] = prompt
            specs[key] = (lambda p=prompt: prov.submit_image(img_model, p,
                                                             **image_params(img_model, aspect, img_res)))
            by_key[key] = shot

    done = run_jobs(prov, specs, poll_s=3, stall_s=75, max_retries=2, deadline_s=300)

    for key, url in done.items():
        if not url:
            continue
        dest = os.path.join(kf_dir, f"kf_{key}.jpg")
        prov.download(url, dest)
        shot = by_key[key]
        shot["keyframe_url"] = url
        shot["keyframe_path"] = dest
        print(f"[{key}] saved {dest}")

    with open(bpath, "w") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
```

</details>

**依据 4 · 源码核查**：[scripts/assemble.py:145-157](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/assemble.py#L145-L157)

旁白/BGM压低混合链

<details>
<summary>查看原文（13行）</summary>

```text
    nlabels = []
    for i, bs in enumerate(beat_spans):
        ms = int(bs["start"] * 1000)
        chain.append(f"[{narr_base+i}:a]adelay={ms}:all=1[n{i}]")
        nlabels.append(f"[n{i}]")
    # pad the narration mix to the FULL duration, else sidechaincompress follows the (shorter)
    # narration length and -shortest clips the tail (e.g. a silent payoff/ending beat).
    chain.append(f"{''.join(nlabels)}amix=inputs={nb}:normalize=0:duration=longest,volume={voice_vol},apad,atrim=0:{total}[narrmix]")
    # a filter-output label can only be consumed once -> split narration in two
    chain.append("[narrmix]asplit=2[narrA][narrB]")
    chain.append(f"[{bgm_idx}:a]atrim=0:{total},volume={music_vol},afade=t=out:st={max(total-2,0):.2f}:d=2[bgt]")
    chain.append("[bgt][narrA]sidechaincompress=threshold=0.02:ratio=12:attack=5:release=350[bgd]")
    chain.append(f"[narrB][bgd]amix=inputs=2:normalize=0:duration=longest,volume=1.4,atrim=0:{total}[a]")
```

</details>

#### 缺口

- 中断后远端已提交任务与本地产物对账未形成完整依据
  **影响**：可能重提交而非续接已计费工作
  **进一步探讨**：先保存逐shot预测ID与状态，遇中断按ID查结果，再决定是否创建新任务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 付费重试与内容一致性怎样限制一键承诺？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

底层atlas_cloud注释说POST不自动重试，因为会建计费任务，GET轮询才安全重试；但上层run_jobs遇failed或pending超stall会调用submit创建新ID，最多再试两次。keyframes默认75秒stall、300秒总期限，一个尚pending的任务并未证明失败，重新提交可能同时保留旧远端任务并增加账单。这个事实削弱无监督“一题成片”承诺，不等于已复现重复扣费，实际计费仍依服务。首次需账号、工具链和人工风格选择；持续每shot图像/视频、TTS音乐与本地编码，修改脚本/字体错误可触发重新生成；失败要核所有已知job ID和下载产物，不重跑整片。没有当前金额、任务规模与返工频率，不引用作者估计当固定价格。模型ID漂移、文本渲染、人物/声音一致性及叙事事实仍需人审；肖像/声音输入还涉及具体素材使用边界，生成成功不等于可交付。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/atlas_cloud.py:9-15](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/atlas_cloud.py#L9-L15)

底层明确计费POST不重试

```text
  1. Every request MUST send a real User-Agent header — the default urllib UA
     is blocked by the WAF and returns 403 Forbidden.
  2. Generated assets live on OSS behind the user's local proxy; python's
     urlretrieve dies with "Remote end closed connection". Download via curl.
  3. POST generation calls are NOT retried (they create billable tasks).
     GET polls are safe to retry.

```

**依据 2 · 源码核查**：[scripts/provider.py:115-130](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/provider.py#L115-L130)

pending超时再次submit新ID

<details>
<summary>查看原文（16行）</summary>

```text
            r = prov.get_status(s["pid"])
            status = r["status"]
            if status == "completed":
                done[key] = r["output"]
                print(f"[{key}] done")
            elif status == "failed" or (status == "pending" and now - s["t"] > stall_s):
                if s["tries"] < max_retries:
                    s["tries"] += 1
                    s["pid"] = submit()
                    s["t"] = time.time()
                    why = "failed" if status == "failed" else f"stalled>{int(stall_s)}s"
                    print(f"[{key}] {why} -> resubmit #{s['tries']} ({s['pid']})")
                elif status == "failed":
                    done[key] = None
                    print(f"[{key}] FAILED: {(r.get('error') or '')[:120]}")
                # stalled + out of retries: keep waiting until the deadline
```

</details>

**依据 3 · 源码核查**：[scripts/keyframes.py:72-85](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/keyframes.py#L72-L85)

默认重试参数及最后才保存URL

<details>
<summary>查看原文（14行）</summary>

```text
    done = run_jobs(prov, specs, poll_s=3, stall_s=75, max_retries=2, deadline_s=300)

    for key, url in done.items():
        if not url:
            continue
        dest = os.path.join(kf_dir, f"kf_{key}.jpg")
        prov.download(url, dest)
        shot = by_key[key]
        shot["keyframe_url"] = url
        shot["keyframe_path"] = dest
        print(f"[{key}] saved {dest}")

    with open(bpath, "w") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
```

</details>

**依据 4 · 作者声明**：[README.md:86-86](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/README.md#L86-L86)

作者提醒模型ID漂移

```text
Model IDs drift — the skill fetches the live list from `GET https://api.atlascloud.ai/api/v1/models` before running.
```

#### 缺口

- 重复/未完成预测的实际费用和清理方式未知
  **影响**：付费失败恢复不明，当前不宜无人监督生产
  **进一步探讨**：对已有ID只读对账并记录结算/取消规则，先确认成本上限和恢复再生成任何新任务

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么采用结论与可证伪生产改进有依据？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有媒体API和ffmpeg经验的创作者可以先观察此编排，阅读beats与示例定位用途；本轮不据源码推荐直接启动整片付费流水线。相比手工脚本，它集中镜头身份和组装，但pending重提交与任务回执持久化缺口妨碍可控成本承诺。若日后在明确预算内试验，应先做非敏感单shot，人工确认叙事/风格，并逐任务回执对账；遇结果未知立刻停止新建任务，退回已下载静态图加本地剪辑。未验证方向是在每次submit前后保存shot指纹/预测ID/费用状态，pending只轮询或人工取消，不当失败补位。最小验证用模拟provider让旧任务延迟后成功，比较当前与持久回执方案的重复提交、产物恢复和人工时间；若无法减少重复且明显妨碍有时限交付，再评估保留用户明确授权的竞速重提，而非默认重试。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/provider.py:101-130](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/provider.py#L101-L130)

提交/重提状态是持久回执推导起点

<details>
<summary>查看原文（30行）</summary>

```text
    st = {}
    for key, submit in specs.items():
        st[key] = {"pid": submit(), "t": time.time(), "tries": 0}
        print(f"[{key}] submitted {st[key]['pid']}")

    done = {}
    deadline = time.time() + deadline_s
    while len(done) < len(specs) and time.time() < deadline:
        time.sleep(poll_s)
        now = time.time()
        for key, submit in specs.items():
            if key in done:
                continue
            s = st[key]
            r = prov.get_status(s["pid"])
            status = r["status"]
            if status == "completed":
                done[key] = r["output"]
                print(f"[{key}] done")
            elif status == "failed" or (status == "pending" and now - s["t"] > stall_s):
                if s["tries"] < max_retries:
                    s["tries"] += 1
                    s["pid"] = submit()
                    s["t"] = time.time()
                    why = "failed" if status == "failed" else f"stalled>{int(stall_s)}s"
                    print(f"[{key}] {why} -> resubmit #{s['tries']} ({s['pid']})")
                elif status == "failed":
                    done[key] = None
                    print(f"[{key}] FAILED: {(r.get('error') or '')[:120]}")
                # stalled + out of retries: keep waiting until the deadline
```

</details>

**依据 2 · 源码核查**：[scripts/keyframes.py:74-85](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/scripts/keyframes.py#L74-L85)

产物URL落盘时点

<details>
<summary>查看原文（12行）</summary>

```text
    for key, url in done.items():
        if not url:
            continue
        dest = os.path.join(kf_dir, f"kf_{key}.jpg")
        prov.download(url, dest)
        shot = by_key[key]
        shot["keyframe_url"] = url
        shot["keyframe_path"] = dest
        print(f"[{key}] saved {dest}")

    with open(bpath, "w") as f:
        json.dump(doc, f, ensure_ascii=False, indent=2)
```

</details>

**依据 3 · 作者声明**：[README.md:66-73](https://github.com/Alisa0808/vox-director/blob/6a85a7c341610442a6a5b1885e6e0217ab82a11f/README.md#L66-L73)

作者强调先图后动及人类决策

```text
1. **The look is born in the image step.** Each beat is a finished collage *poster*. All the collage DNA (torn paper, cut-outs, halftone, headline text) lives in that image — if the poster isn't a rich collage, nothing downstream saves it.
2. **The motion is added after.** By default an AI video model animates the whole poster (the "living poster" path). For dramatic *piece-by-piece* assembly, an optional local keyframe engine cuts the poster into parts and drives them frame-by-frame (no content filters, pixel-exact — great for real people).

Two human decision gates keep you in control (approve the beat map; pick the style); everything else is automated.

## Models (verified on Atlas Cloud)

| Job | Model |
```

#### 缺口

- 回执方案与真实服务计费/取消契约未验证
  **影响**：不认定已解决生产成本或独立新插件机会
  **进一步探讨**：先模拟延迟/中断证明不重复，再按服务契约设计有限实际测试

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
