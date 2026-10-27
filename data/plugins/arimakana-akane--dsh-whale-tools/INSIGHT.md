# dsh-whale-tools

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5abe039](https://github.com/ArimaKana-Akane/dsh-whale-tools/tree/5abe0398129ad52ecb48d66f9b241c0a8241383d)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：为鲸鱼挂件提供上传图片抠图换装、当前图片服务、浏览器心跳及会话头部重启入口。

> **亮点**：相对手工编辑透明 PNG 并替换包文件，插件把上传、局部抠图和即时显示连成设置流程，默认通过用户路径与浏览器覆盖避免修改第三方包。贡献是挂件个性化便利，去背景本身是固定规则算法而非通用视觉分割。[Q01](#research-q01)

> **主要限制**：固定处理假设决定换装是否合格。CLI 默认先裁掉左侧30%并保留到98%宽，再按接近白色和最大连通域处理；主体在左侧、多主体、深色背景或独立肢体都可能损失，因此不能把任意位图可上传等同于任意图能正确抠出。上传成功后双文件顺序覆盖也没有共同原子事务。[Q01](#research-q01) [Q02](#research-q02)

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
  - [Q01 · 任意图片如何变成挂件，何种素材真正适用？](#detail-section-11)
  - [Q02 · 安装、重启和失败恢复有什么依赖及成本？](#detail-section-12)
  - [Q03 · 可预览裁切与提交能否减少错误换装？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已经安装鲸鱼挂件的用户，把适合白底抠图的图片换成个人挂件，并提供本地 web 服务的重启入口。

替代是用图像编辑器制作透明 PNG 后手工替换挂件图片。插件简化重复部署，但固定自动处理不如人工抠图灵活；重启和心跳是附带维护能力，不能加总为图片贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 图片上传抠图 | 生成透明挂件图 | 固定裁切和白底、最大主体假设 |
| 即时图片覆盖 | 不修改第三方包即可显示 | 依赖 .dshwv-img 类名 |
| 重启入口 | 重启本地 web profile 服务 | 固定 systemd 用户服务，需确认 |
| 浏览器心跳 | 记录页面存活 | touch 本地文件，本身不证明业务健康 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer、slots 和鲸鱼挂件 | 主功能必需 | 上传路由、设置和图层 | 上游 DOM 改变可能失效 |
| sharp 与 Node >=20 | 抠图必需 | 解析和重采样位图 | 子进程失败，需手动依赖 |
| systemctl --user | 仅重启必需 | 重启固定服务 | 返回已排程不保证实际成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份图并核对 sharp、挂件、服务名 | 恢复路径明确 |
| 上传 | 用户在外观设置选图 | 后端输出成功并显示新图 |
| 验收 | 用户检查主体与重载 | 完整合格才保留，否则还原 |
| 维护 | 用户确认重启 | 轮询恢复才算实际完成 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地 Node、sharp、宿主，金额未知 | 配依赖、备份图和配置，时长未知 | 原挂件和类名必需 |
| 持续使用 | 图像 RGBA 与连通域内存、周期请求 | 选图并检查裁切透明边缘 | 20MB体积、40M像素上限不等于低资源 |
| 失败恢复 | 重新处理和备份资源未知 | 恢复用户图与真源，排查进程和服务 | 双图覆盖可能部分成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 即时换图 | 上传输出与客户端 src 覆盖接线 | 当前挂件类名与实际可见性 |
| 抠图 | 白底连通去除和最大主体保留 | 任意素材质量和峰值资源 |
| 重启维护 | 排程 systemctl 命令 | 返回成功不证明服务重启成功 |

> **思考**：固定处理假设决定换装是否合格。CLI 默认先裁掉左侧30%并保留到98%宽，再按接近白色和最大连通域处理；主体在左侧、多主体、深色背景或独立肢体都可能损失，因此不能把任意位图可上传等同于任意图能正确抠出。上传成功后双文件顺序覆盖也没有共同原子事务。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工编辑透明 PNG 并替换包文件，插件把上传、局部抠图和即时显示连成设置流程，默认通过用户路径与浏览器覆盖避免修改第三方包。贡献是挂件个性化便利，去背景本身是固定规则算法而非通用视觉分割。[Q01](#research-q01)

上传临时文件 finally 清理、体积像素限制和默认关闭第三方补丁值得借鉴。runCutout 未见子进程超时或并发队列，输出两文件顺序写入；重启先回成功再 spawn，异步服务失败不能作为已完成。闸门结合回环、Origin 和头标记，可选令牌；本机进程不在该隔离承诺内。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

固定处理假设决定换装是否合格。CLI 默认先裁掉左侧30%并保留到98%宽，再按接近白色和最大连通域处理；主体在左侧、多主体、深色背景或独立肢体都可能损失，因此不能把任意位图可上传等同于任意图能正确抠出。上传成功后双文件顺序覆盖也没有共同原子事务。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

已有鲸鱼挂件者可备份原图后先用白底单主体试用，验收主体完整、透明边缘和重载显示；主体被裁或副图丢失就停止并用外部编辑。重启按钮只在明确 dsh-web-profiled.service 的本机环境使用。[Q02](#research-q02)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

图片处理和维护入口有源码支持；任意图片主张受固定裁切及颜色假设限制，真实质量、兼容和运行资源未测。预览提交假设未实现。

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js、tools/dsh-whale-mascot-cutout.cjs、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 README、包清单、host 路由闸门与上传/重启链、完整抠图脚本及客户端相关入口；未执行图像处理、安装或 systemctl，补丁脚本未全面审计。
- 下一步：以固定素材集比较自动与手工抠图的主体完整度、边缘质量、人工时间和资源峰值；另做双文件写中断及并发上传验证，重启在可恢复服务环境单独验收。均未执行。

**分析版本**

- **仓库**：[ArimaKana-Akane/dsh-whale-tools](https://github.com/ArimaKana-Akane/dsh-whale-tools)
- **版本号**：1.1.0（[固定提交 5abe039](https://github.com/ArimaKana-Akane/dsh-whale-tools/tree/5abe0398129ad52ecb48d66f9b241c0a8241383d)）
- **版本日期**：2026-09-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的改进是先展示可调裁切与去白底预览，用户确认后用版本化图片和指针提交替代顺序覆盖。以主体居左、多主体、深底和白底素材对照固定流水线，若质量不改善或操作负担高于手工编辑，否定其价值；提交中断还必须保持旧图可恢复。[Q03](#research-q03)

以固定素材集比较自动与手工抠图的主体完整度、边缘质量、人工时间和资源峰值；另做双文件写中断及并发上传验证，重启在可恢复服务环境单独验收。均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 727 | 563 | 127 | — |
| .md | source | 1 | 271 | — | — | 2954 |
| .cjs | source | 1 | 82 | 69 | 8 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ArimaKana-Akane/dsh-whale-tools/issues?q=is%3Aissue+created%3A2026-09-24T05%3A56%3A32.418Z..2026-10-24T05%3A56%3A32.418Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ArimaKana-Akane/dsh-whale-tools/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A56%3A32.418Z..2026-10-24T05%3A56%3A32.418Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：换装算法适用什么素材，维护入口和写入边界是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任意图片如何变成挂件，何种素材真正适用？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

上传接受常见位图后，CLI 默认裁切横向30%到98%、纵向2%到99%，把与边缘连通的近白像素变透明，再只留最大不透明连通域并缩放610方图。它适合白底、主体落在裁切区域的单体素材；居左主体会被预裁，多主体会被连通域选择丢弃，深底不满足去白假设。相对手工替换，上传和即时显示是便利增量，但算法不是任意图像的通用抠图，用户必须验收主体和边缘。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-whale-mascot-cutout.cjs:15-39](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/tools/dsh-whale-mascot-cutout.cjs#L15-L39)

固定裁切、像素上限和近白判定限定素材范围。

<details>
<summary>查看原文（25行）</summary>

```text
const sharp=loadSharp();
const SRC=process.argv[2], OUT=process.argv[3];
const TARGET=Number(process.argv[4]||610);
const X0=Number(process.argv[5]||0.30), Y0=Number(process.argv[6]||0.02);
const X1=Number(process.argv[7]||0.98), Y1=Number(process.argv[8]||0.99);
const WHITE=238;   // 认定"接近白"的阈值（含抗锯齿）

(async()=>{
  const meta=await sharp(SRC).metadata();
  if(!meta.width||!meta.height) throw new Error('无法读取图片尺寸（可能不是它能解的位图）');
  // 像素上限：下游是整幅 RGBA 解包 + flood fill + 连通域标记（各 4 字节/像素以上），
  // 超大图会成倍吃内存。本机有 spawn ENOMEM 前科，故在入口就挡住。
  const MAX_PIXELS=40e6;
  if(meta.width*meta.height>MAX_PIXELS){
    throw new Error(`图片太大：${meta.width}x${meta.height} = ${(meta.width*meta.height/1e6).toFixed(1)}M 像素，上限 ${MAX_PIXELS/1e6}M`);
  }
  const left=Math.round(meta.width*X0), top=Math.round(meta.height*Y0);
  const width=Math.round(meta.width*(X1-X0)), height=Math.round(meta.height*(Y1-Y0));
  const {data,info}=await sharp(SRC).extract({left,top,width,height}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const W=info.width,H=info.height,N=W*H,px=Buffer.from(data);
  console.log(`  裁剪: ${width}x${height}`);

  const isWhiteish=p=>{const i=p*4;return px[i]>=WHITE&&px[i+1]>=WHITE&&px[i+2]>=WHITE;};

  // 1) 边界洪水填充：只把"与画面边缘连通的白色"变透明（角色内部白皮肤不会被误删）
```

</details>

**依据 2 · 源码核查**：[tools/dsh-whale-mascot-cutout.cjs:50-72](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/tools/dsh-whale-mascot-cutout.cjs#L50-L72)

最大连通域保留会舍弃其他独立部件。

<details>
<summary>查看原文（23行）</summary>

```text
  console.log(`  外部白底: ${flood} 像素 (${(flood/N*100).toFixed(1)}%)`);

  // 2) 只保留最大连通域（丢弃气泡笔画、孤立噪点）
  const label=new Int32Array(N).fill(-1); let cur=0,best={size:0,label:-1};
  const opaque=p=>px[p*4+3]>16;
  for(let s=0;s<N;s++){
    if(label[s]!==-1||!opaque(s)) continue;
    let sp2=0; st[sp2++]=s; label[s]=cur; let cnt=0;
    while(sp2>0){ const p=st[--sp2]; cnt++; const x=p%W,y=(p-x)/W;
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){
        if(!dx&&!dy)continue; const nx=x+dx,ny=y+dy;
        if(nx<0||ny<0||nx>=W||ny>=H)continue; const q=ny*W+nx;
        if(label[q]===-1&&opaque(q)){label[q]=cur;st[sp2++]=q;}
      }}
    if(cnt>best.size)best={size:cnt,label:cur};
    cur++;
  }
  for(let p=0;p<N;p++) if(label[p]!==best.label) px[p*4+3]=0;
  console.log(`  保留最大连通域: ${best.size} 像素 (${(best.size/N*100).toFixed(1)}%)`);

  const rgba=await sharp(px,{raw:{width:W,height:H,channels:4}}).png().toBuffer();
  const tr=await sharp(rgba).trim({background:{r:0,g:0,b:0,alpha:0},threshold:1}).toBuffer({resolveWithObject:true});
  console.log(`  内容裁剪: ${W}x${H} → ${tr.info.width}x${tr.info.height}`);
```

</details>

#### 缺口

- 不同素材的保真和边缘质量未测。
  **影响**：不能把能上传等同于换装合格。
  **进一步探讨**：以居左、多主体、深底、白底四类图对照手工编辑。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装、重启和失败恢复有什么依赖及成本？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用、采用判断

#### 完整回答

主链依赖 Node、sharp、webServer 与鲸鱼挂件类名，重启另外依赖固定 systemd 用户服务。上传有20MB限制和临时清理，抠图子进程未见超时与并发限制，40M像素仍可产生多份大数组。输出先覆盖用户图再覆盖真源，不是双文件事务；第二步失败时不能假设旧图不变。重启先返回已安排再启动 detached systemctl，只证明请求排程。变更端点检查回环与 Origin/头标记，令牌可选，本机进程不被隔离。建议备份后用适合素材局部试用，资源量、金额和恢复时长未知。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:103-145](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/lib/index.js#L103-L145)

变更闸门是本机浏览器边界，不是进程沙箱。

<details>
<summary>查看原文（43行）</summary>

```text
function originIsLoopback(req) {
  const h = (req && req.headers) || {}
  const raw = h.origin || h.referer
  if (!raw) return true
  try { return isLoopbackHostname(new URL(String(raw)).hostname) } catch { return false }
}

function isDesktop(req) {
  if (ALLOW_REMOTE_ADMIN) return true
  try {
    if (!originIsLoopback(req)) return false
    const got = String((req && req.headers && req.headers[DESKTOP_HEADER]) || '')
    if (ADMIN_TOKEN) return got === ADMIN_TOKEN
    return got === '1'
  } catch {
    return false
  }
}

/** 变更类端点的统一门禁：回环 + 电脑端标志头。 */
function denyIfNotDesktop(req, res) {
  if (!isLoopback(req.socket && req.socket.remoteAddress)) {
    res.writeHead(403, JSON_HEADERS)
    res.end(JSON.stringify({ ok: false, error: '只允许本机访问' }))
    return true
  }
  if (!isDesktop(req)) {
    res.writeHead(403, JSON_HEADERS)
    res.end(JSON.stringify({
      ok: false,
      error: 'desktop_only',
      message: '该操作仅限电脑端（本机浏览器）执行；手机端只能查看。',
    }))
    return true
  }
  return false
}

export const name = 'dsh-whale-tools'
export const inject = ['webServer']

/**
 * 当前小鲸鱼图信息。`withFingerprint` 为 false（手机端等非电脑端调用）时**不返回**
```

</details>

**依据 2 · 源码核查**：[lib/index.js:200-214](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/lib/index.js#L200-L214)

子进程收集输出但未见超时与并发限制。

<details>
<summary>查看原文（15行）</summary>

```text
/** spawn 抠图 CLI，收集 stdout/stderr 供前端排错。 */
function runCutout(srcPath, outPath) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CUTOUT_CLI, srcPath, outPath, '610'], {
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    let log = ''
    child.stdout.on('data', (d) => { log += d })
    child.stderr.on('data', (d) => { log += d })
    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) resolve(log)
      else reject(new Error('抠图进程退出码 ' + code + '：' + log.trim().slice(-500)))
    })
  })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:310-331](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/lib/index.js#L310-L331)

双路径顺序覆盖与失败清理可跟踪。

<details>
<summary>查看原文（22行）</summary>

```text
        const body = await readBody(req, MAX_BODY)
        if (!body.length) throw new Error('请求体为空，未收到图片')
        if (!looksLikeRasterImage(body)) {
          throw new Error('不是可识别的位图（支持 PNG / JPEG / WebP / GIF / BMP；不接受 SVG 等矢量格式）')
        }
        fs.writeFileSync(tmpSrc, body)
        const log = await runCutout(tmpSrc, tmpOut)
        const outBytes = fs.readFileSync(tmpOut)
        // 先全部成功再覆盖：用户路径图与真源同步更新
        fs.mkdirSync(path.dirname(USER_IMAGE), { recursive: true })
        fs.copyFileSync(tmpOut, USER_IMAGE)
        fs.copyFileSync(tmpOut, SOURCE_IMAGE)
        res.writeHead(200, JSON_HEADERS)
        res.end(JSON.stringify({
          ok: true,
          bytes: outBytes.length,
          md5: crypto.createHash('md5').update(outBytes).digest('hex'),
          log: log.trim(),
        }))
      } catch (err) {
        res.writeHead(200, JSON_HEADERS)
        res.end(JSON.stringify({ ok: false, error: String((err && err.message) || err).slice(0, 600) }))
```

</details>

**依据 4 · 源码核查**：[lib/index.js:348-363](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/lib/index.js#L348-L363)

重启响应早于实际服务执行，必须另验收。

<details>
<summary>查看原文（16行）</summary>

```text
      // 先回包，再延迟自重启：restart 命令送达 systemd 后即与本进程脱钩。
      res.writeHead(200, JSON_HEADERS)
      res.end(JSON.stringify({ ok: true, message: '已安排重启 dsh-web-profiled.service' }))
      setTimeout(() => {
        try {
          const child = spawn('systemctl', ['--user', 'restart', 'dsh-web-profiled.service'], {
            detached: true,
            stdio: 'ignore',
          })
          child.unref()
        } catch (err) {
          try { console.error('[dsh-whale-tools] 重启 spawn 失败：', err) } catch (e) {}
        }
      }, 300)
    },
  }))
```

</details>

#### 缺口

- 并发上传和写失败的运行状态未知。
  **影响**：不能承诺失败不改变旧图或资源可控。
  **进一步探讨**：在副本目录模拟第二次写失败与并发，检查回滚和资源峰值。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 可预览裁切与提交能否减少错误换装？

**研究主题**：新假设与验证

#### 完整回答

固定裁切和最大主体是自动处理便捷与适用范围狭窄之间的取舍。可提出未验证设计，允许用户调整裁切并预览透明结果，确认后提交版本图，用一个当前指针选择版本；失败可继续指向旧版本。新增操作可能不适合偶发使用者。最小实验对照现版和原型的主体保留率、人工时间及提交中断恢复，若质量没有提高或负担高于外部编辑，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[tools/dsh-whale-mascot-cutout.cjs:15-19](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/tools/dsh-whale-mascot-cutout.cjs#L15-L19)

固定参数是可调预览方向的推导起点，不是现有 UI。

```text
const sharp=loadSharp();
const SRC=process.argv[2], OUT=process.argv[3];
const TARGET=Number(process.argv[4]||610);
const X0=Number(process.argv[5]||0.30), Y0=Number(process.argv[6]||0.02);
const X1=Number(process.argv[7]||0.98), Y1=Number(process.argv[8]||0.99);
```

**依据 2 · 源码核查**：[lib/index.js:318-322](https://github.com/ArimaKana-Akane/dsh-whale-tools/blob/5abe0398129ad52ecb48d66f9b241c0a8241383d/lib/index.js#L318-L322)

双写顺序提供版本提交改进依据。

```text
        // 先全部成功再覆盖：用户路径图与真源同步更新
        fs.mkdirSync(path.dirname(USER_IMAGE), { recursive: true })
        fs.copyFileSync(tmpOut, USER_IMAGE)
        fs.copyFileSync(tmpOut, SOURCE_IMAGE)
        res.writeHead(200, JSON_HEADERS)
```

#### 缺口

- 预览操作是否值得额外步骤未知。
  **影响**：不能认定对全部用户更便利。
  **进一步探讨**：测同一素材任务的总操作时间和返工率。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
