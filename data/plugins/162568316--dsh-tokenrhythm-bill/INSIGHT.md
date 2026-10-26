# dsh-tokenrhythm-bill

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[df72615](https://github.com/162568316/dsh-tokenrhythm-bill/tree/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill) [![npm 30d 1,642](https://img.shields.io/static/v1?label=npm+30d&message=1%2C642&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill) [![最新发布 2026-10-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-09&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-tokenrhythm-bill)
<!-- END META -->

> **实现功能**：在DSH侧栏集中查看基元及可选四平台的余额、模型价格和用量，管理多账号会话与平台密钥。

> **核心亮点**：将五套费用/会话协议、账号槽、字段归一和密钥操作接入DSH面板，减少门户切换；不提供新计费协议。详见[Q02](#research-q02)。

> **风险与缺陷**：按需密码/key明文与宿主凭据写入要求可信访问控制；插件自身没有独立请求授权守卫。模型探测缓存仅model ID，切平台/key可能误复用；state直写及并发回滚缺版本协调。详见[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 谁需要费用面板，结果怎样才有业务价值？](#detail-section-11)
  - [Q02 · 浏览器、Host和平台怎样协作，亮点是什么？](#detail-section-12)
  - [Q03 · 凭据与路由是否构成独立安全边界？](#detail-section-13)
  - [Q04 · 费用字段和分页能支撑哪些结论？](#detail-section-14)
  - [Q05 · 连通检测会不会计费，缓存绑定什么身份？](#detail-section-15)
  - [Q06 · 启用需要什么，怎样有序操作？](#detail-section-16)
  - [Q07 · 资源回收和失败恢复有什么优点与缺口？](#detail-section-17)
  - [Q08 · 首次、持续与恢复成本和效果怎样判断？](#detail-section-18)
  - [Q09 · 推荐结论与可继续探讨的创新是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在DSH使用基元律动，并可能跨阶跃、ZCode、清枢和OpenCSG账户工作的个人用户。余额、限时额度、模型价目、用量和密钥管理聚到侧栏，减少在多个门户间切换。默认仅启用基元，其他平台显式开启；不是所有供应商的统一正式结算账本，也不建立每个DSH任务与账单项的因果归属。

合格结果应同时带平台、账号、数据时间、缓存/分页状态和币种单位。余额或套餐额度不足可提示人工处理，但模型价格卡不证明实际扣费正确，连通成功不证明任务效果。跨平台费用、赠送额度和套餐不能不经口径核对直接相加。

人工门户查询是基线。插件的增量在上下文内查看和操作，代价是把多个高权限凭据集中到同一宿主。适合愿意管理本机敏感状态的单人环境，不能只按面板外观决定在共享远程DSH启用。

人工在各平台门户查看余额/用量与管理key；插件增量是DSH内聚合，凭据集中管理和协议维护是新增成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 费用聚合 | 余额、额度、用量与模型价格 | 平台/币种/窗口不同，不作正式对账 |
| 多账号会话 | 按账号槽保存并续登 | 账号密码和会话集中本机state |
| 密钥管理 | 创建、删除、按需明文/写宿主key | 敏感管理面，依赖可信Host授权 |
| 连通检测 | 小型真实模型请求 | 可能计费，缓存未绑定provider/key |
| 部分结果 | 窗口总量与分页明细分离 | partial和null不等于完整验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、DSH Cordis/webServer与Web界面 | 必需 | Host路由和客户端面板 | 纯Node导入不代表完成集成 |
| settings.yaml和凭据文件/env | 相应提供商必需 | 模型目录/API key解析 | 无provider/key时明确失败 |
| 平台账号/网络/合法会话 | 按系统 | 余额/账单/密钥操作 | 失效可能自动登录或提示错误 |
| ZCode本机credentials/config | 仅ZCode | 读桌面套餐身份 | 无文件返回NO_CREDENTIALS |
| 敏感文件保护与可信Host访问控制 | 使用前提 | 多平台凭据集中保管 | 不适合未经保护的共享暴露面 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核固定版本、宿主访问权限和凭据备份 | 拒绝未授权敏感路由访问 |
| 启用 | 挂bundle，默认仅基元 | 入口出现且manifest指向预期provider |
| 接入 | 逐个平台显式开关/账号 | 核账号身份，不一次导入全部秘密 |
| 查询 | 核数据时间、账号、partial和单位 | 错误不当零余额，缓存不当新取数据 |
| 变更 | 密钥创建/删除/切换独立确认 | 对照平台状态和宿主凭据版本 |
| 收尾 | 停用并管理本机state/平台key | 卸载不代表凭据或平台key自动撤销 |

包无第三方dependencies声明，使用内置Node能力和宿主服务；其测试脚本是作者资产，本轮未执行。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 平台账号与本机state备份资源 | 配宿主访问控制、账号和state保护 | 多平台协议兼容时间/费用未知，宜逐个启用 |
| 持续使用 | 轮询分页、续登网络和model-check真实模型调用 | 维护账号与平台协议 | 实际请求量/平台费用未知，30模型/3并发仅限单批 |
| 失败恢复 | 重查平台/state/凭据文件资源，费用未知 | 核账号身份、限流/协议变化、state与凭据版本 | 静默保存和并发覆盖可增恢复人工，不填金额 |



#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 少切门户 | 侧栏聚合账号、余额和用量 | 无同任务人工耗时对照 |
| 少误解不完整统计 | null与partial、窗口信封和明细分开 | 不证明当前上游字段含义都正确 |
| 快速排查连通 | 有并发/时间预算的真实小请求 | 缓存未绑定身份，不代表业务质量 |
| 更方便密钥操作 | 创建/删除/reveal及宿主key-use | 权限和保密成本增加，无独立安全收益测量 |

不声称节省具体金额、提高准确率或能避免超支。收费渠道/额度政策属于平台实时规则，本轮固定版本研究不替平台作承诺。

> **思考**：按需密码/key明文与宿主凭据写入要求可信访问控制；插件自身没有独立请求授权守卫。模型探测缓存仅model ID，切平台/key可能误复用；state直写及并发回滚缺版本协调。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将五套费用/会话协议、账号槽、字段归一和密钥操作接入DSH面板，减少门户切换；不提供新计费协议。详见[Q02](#research-q02)。

将五套费用/会话协议、账号槽、字段归一和密钥操作接入DSH面板，减少门户切换；不提供新计费协议。详见[Q02](#research-q02)。

Host前缀注册包在ctx.effect，客户端提醒轮询有clearInterval/stopped，侧栏slot也经effect注册，提供明确生命周期出口。网络请求有AbortController预算，OpenCSG后页失败保留partial，账号槽过滤有助避免陈旧跨账号会话。不能因实现长就否定这些具体约束。

fetchWithTimeout在fetch返回headers后finally清timer，调用者再res.text解析body；故15秒不覆盖完整body读取。慢/不结束body可超过该预算，且没有绑定前端断开请求的取消链。model-check自己的timer覆盖json/text读取，二者保证不同。state保存失败静默、坏JSON回空状态，界面继续工作不证明凭据成功持久化，重启后可能丢失。

前端轮询清理不等于全部已发上游请求被abort，Hosteffect回收路由也不取消已经在跑的调用。较大的单体路由和手写平台协议需要按版本维护，作者测试数量不能代替具体异常恢复覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

按需密码/key明文与宿主凭据写入要求可信访问控制；插件自身没有独立请求授权守卫。模型探测缓存仅model ID，切平台/key可能误复用；state直写及并发回滚缺版本协调。详见[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，先核宿主敏感路由访问边界、缓存身份与凭据写入并发，再考虑可信单人环境只读单平台评估。详见[Q09](#research-q09)。

合格结果应同时带平台、账号、数据时间、缓存/分页状态和币种单位。余额或套餐额度不足可提示人工处理，但模型价格卡不证明实际扣费正确，连通成功不证明任务效果。跨平台费用、赠送额度和套餐不能不经口径核对直接相加。

人工门户查询是基线。插件的增量在上下文内查看和操作，代价是把多个高权限凭据集中到同一宿主。适合愿意管理本机敏感状态的单人环境，不能只按面板外观决定在共享远程DSH启用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。聚合/分页归一有价值，敏感路由依赖宿主权限、缓存身份与写入恢复边界需先明确。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、lib/client.js、lib/opencsg.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定包/README、Host关键路由/账号槽/状态/分页/探测与客户端注册清理、OpenCSG归一；不宣称全17k行审计，不执行测试/宿主或平台操作。
- 下一步：可继续从同名模型切provider/key、未授权reveal、分页失败、文件并发和慢body受控对照入手，核身份/权限/恢复，再比较人工门户耗时。

**分析版本**

- **仓库**：[162568316/dsh-tokenrhythm-bill](https://github.com/162568316/dsh-tokenrhythm-bill)
- **版本号**：0.7.2（[固定提交 df72615](https://github.com/162568316/dsh-tokenrhythm-bill/tree/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索平台/账号/密钥指纹绑定的数据收据、敏感操作授权和文件版本写入，比较误归属、丢更新与额外开销；未实现。详见[Q09](#research-q09)。

可继续从同名模型切provider/key、未授权reveal、分页失败、文件并发和慢body受控对照入手，核身份/权限/恢复，再比较人工门户耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 17110 | 12610 | 4123 | — |
| .md | source | 2 | 299 | — | — | 23933 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill/issues?q=is%3Aissue+created%3A2026-09-22T06%3A07%3A29.258Z..2026-10-22T06%3A07%3A29.258Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/162568316/dsh-tokenrhythm-bill/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A07%3A29.258Z..2026-10-22T06%3A07%3A29.258Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本核查五平台费用面板的聚合价值、身份口径、凭据管理和恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要费用面板，结果怎样才有业务价值？

**研究主题**：场景与需求

#### 完整回答

面向在DSH使用基元律动，并可能跨阶跃、ZCode、清枢和OpenCSG账户工作的个人用户。余额、限时额度、模型价目、用量和密钥管理聚到侧栏，减少在多个门户间切换。默认仅启用基元，其他平台显式开启；不是所有供应商的统一正式结算账本，也不建立每个DSH任务与账单项的因果归属。

合格结果应同时带平台、账号、数据时间、缓存/分页状态和币种单位。余额或套餐额度不足可提示人工处理，但模型价格卡不证明实际扣费正确，连通成功不证明任务效果。跨平台费用、赠送额度和套餐不能不经口径核对直接相加。

人工门户查询是基线。插件的增量在上下文内查看和操作，代价是把多个高权限凭据集中到同一宿主。适合愿意管理本机敏感状态的单人环境，不能只按面板外观决定在共享远程DSH启用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-9](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/README.md#L1-L9)

多平台可选接入及面板作者定位。

```text
# dsh-tokenrhythm-bill

**基元律动费用中心** —— DeepSeek Harness（DSH）插件，把[基元律动 tokenrhythm.studio](https://tokenrhythm.studio) 的模型清单、账户余额、用量与密钥管理，集中到侧栏底部一个小面板里；另支持阶跃星辰（StepFun）Step Plan、ZCode 桌面端套餐额度、[清枢智汇 tierflow.cn](https://tierflow.cn) 与 [OpenCSG opencsg.com](https://opencsg.com) 的**可选**接入（默认只显示基元，另四家在**设置 → 系统管理**里勾上才出现）。

在 DSH 侧栏底部（设置按钮上方）点击「基元律动-费用中心」入口即可打开可拖拽面板；也可以直接按 **`Ctrl+J`**（macOS `Cmd+J`）呼出/收起。入口左侧是**品牌标 + 名称**，右侧常驻**总余额胶囊**（切号即刷、预警转琥珀色）；**悬停入口**可浮出**限时余额时间线**——逐笔列出每笔限时额度和「N 天后失效」（实时计算，无限时额度时不显示）；侧栏收起时只保留品牌图标。

## 界面预览

> 截图取自 v0.5.2（当时是三页签）。当前版本已扩展为 **余额 / 用量 / 模型 / 状态 / 密钥** 五个页签 + 标题位提供商切换器（基元律动｜阶跃｜ZCode｜清枢｜OpenCSG，**只列已启用的系统**），版式沿用同一套设计令牌，功能以正文为准。
```

**依据 2 · 源码核查**：[lib/index.js:1893-1899](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1893-L1899)

默认系统与至少留一个的策略。

```text
  // ---- 启用的系统（0.6.2「系统管理」）----
  // 面板里能出现哪几家（基元 / 阶跃 / ZCode / 清枢智汇 / OpenCSG）：**默认只有基元**，另四家要在
  // 设置 → 系统管理里显式勾上才出现。prefs.systems 是权威；老存档里只有 0.6.x 的
  // ZCode 总开关（prefs.zcode），缺 systems 时按它推导——老用户开过 ZCode 的不会被悄悄关掉。
  // 不变式：**至少留一个**（全关等于面板空转），任何入口进来的全关状态都落回基元。
  const SYS_KEYS = ['tr', 'step', 'zcode', 'tf', 'oc']
  const systemsOf = (prefs) => {
```

**依据 3 · 源码核查**：[lib/index.js:4901-4919](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4901-L4919)

manifest中provider和账号会话状态。

<details>
<summary>查看原文（19行）</summary>

```text
        writeJson(res, {
          ok: true,
          version: PKG_VERSION,
          // 启用的系统随 manifest 一起回（客户端首包播种 provider 要用，别等 /prefs 那一包）
          systems: systemsOf(state.prefs),
          providers: visible.map((p) => {
            const key = resolveKey(p)
            return {
              id: p.id,
              displayName: p.displayName,
              baseURL: p.baseURL,
              apiKeyEnv: p.apiKeyEnv,
              hasKey: key !== '',
              keyHint: maskSecret(key),
              balanceCapable: p.balanceCapable,
              modelCount: p.models.length,
            }
          }),
          session: { configured: state.cookie !== '', valid: probe.valid, hint: maskSecret(state.cookie), account: sessionAccount || null, accountName: meName || null, realname },
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览器、Host和平台怎样协作，亮点是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Cordis bundle插入tokenrhythm-bill节点，Host注入webServer并注册统一prefix，浏览器client提供侧栏入口、覆盖面板和后台提醒。Host读取settings与凭据、持有各平台会话，浏览器调用本地路由取得归一后的余额、账单、模型和密钥列表，避免把每次上游cookie直接交前端。

账号池与会话槽按平台/账号组织，载入时只接受仍在账号池内的会话；切显示目标不必销毁其他账号会话。OpenCSG账单首页收窗口总数/金额，再分页收明细，减少把页内统计冒充全窗口的风险。ZCode从本机桌面credentials/config/device信息构建查询身份，不是只读取DSH模型API key。

贡献是多套门户协议、账户切换、字段归一与DSH界面的工程集成。它没有新的计费协议或财务核算模型，上游注释里的逆向/实测记录是作者线索，本轮没有独立重放这些平台协议。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/cordis.patch.yml#L1-L9)

Host与client两半bundle。

```text
# dsh-tokenrhythm-bill bundle patch: inserts the dual-face plugin row into the web
# profile roster. The node half (exports ".") runs in the host process (settings
# parsing, credential resolution, balance/trend/keys proxying, model connectivity
# checks), and the dsh.client declaration in package.json loads the browser half
# (exports "./client") in the web GUI (sidebar.footer.action entry + shell.overlay
# panel).
- insert:
    - id: tokenrhythm-bill
      name: 'dsh-tokenrhythm-bill'
```

**依据 2 · 源码核查**：[lib/index.js:1799-1812](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1799-L1812)

webServer注入和宿主文件来源。

<details>
<summary>查看原文（14行）</summary>

```text
export const name = 'dsh-tokenrhythm-bill'

export const inject = ['webServer']

export function apply(ctx) {
  // ---- DSH 目录与文件 ----
  const dshDir = () => (process.env.DSH_HOME && String(process.env.DSH_HOME))
    || (typeof os !== 'undefined' && os.homedir ? join(os.homedir(), '.dsh') : null)
  const settingsPath = () => { const d = dshDir(); return d === null ? null : join(d, 'settings.yaml') }
  const credentialsPath = () => { const d = dshDir(); return d === null ? null : join(d, '.credentials.yaml') }
  // 会话 Cookie + 面板几何都存这个文件（0600），不进浏览器、不进 settings。
  const statePath = () => { const d = dshDir(); return d === null ? null : join(d, 'tokenrhythm-bill-state.json') }
  // 旧项目名（dsh-model-balance）时代的 state 文件：新文件缺失时读它做一次性迁移。
  const legacyStatePath = () => { const d = dshDir(); return d === null ? null : join(d, 'model-balance-state.json') }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1842-1875](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1842-L1875)

账号槽过滤与多平台状态。

<details>
<summary>查看原文（34行）</summary>

```text
        if (isObj(data.step)) {
          const stepAccounts = sanitizeStepAccounts(data.step.accounts)
          state.step = {
            accounts: stepAccounts,
            activeAccount: typeof data.step.activeAccount === 'string' ? data.step.activeAccount : '',
            device: typeof data.step.device === 'string' && /^[A-Za-z0-9_-]{8,80}$/.test(data.step.device.trim()) ? data.step.device.trim() : '',
            // 按账号分槽的长会话（oasis cookie）。平台 token 有效期长（~30min 且可续），
            // 登录一次即可长期复用——落盘后连重启都不必重登。串号是安全事故，故键名必须落在账号池内。
            sessions: sanitizeStepSessions(data.step.sessions, stepAccounts),
            prefs: sanitizeStepPrefs(data.step.prefs),
          }
        }
        if (isObj(data.tf)) {
          const tfAccounts = sanitizeTfAccounts(data.tf.accounts)
          state.tf = {
            accounts: tfAccounts,
            activeAccount: typeof data.tf.activeAccount === 'string' ? data.tf.activeAccount : '',
            // 平台会话是 30 天的 HttpOnly cookie（Max-Age=2592000），按账号分槽落盘后
            // 连重启都不必重登；串号是安全事故，故键名必须落在账号池内。
            sessions: sanitizeTfSessions(data.tf.sessions, tfAccounts),
          }
        }
        if (isObj(data.oc)) {
          const ocAccounts = sanitizeOcAccounts(data.oc.accounts)
          state.oc = {
            accounts: ocAccounts,
            activeAccount: typeof data.oc.activeAccount === 'string' ? data.oc.activeAccount : '',
            // 这里的凭据是平台签的本地 JWT（Bearer），同样按账号分槽落盘；
            // 串号是安全事故，故键名必须落在账号池内。
            sessions: sanitizeOcSessions(data.oc.sessions, ocAccounts),
            // 新建时落盘的明文密钥副本（用户定稿 2026-10-17）：按账号分槽、只认账号池内的
            // 槽名（串号 = 将 A 账号的明文挂到 B 账号名下，是安全事故，见 ocNormalizeSavedKeys）。
            savedKeys: ocLib.ocNormalizeSavedKeys(data.oc.savedKeys, ocAccounts),
          }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:4790-4808](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4790-L4808)

读取ZCode本机凭据与身份。

<details>
<summary>查看原文（19行）</summary>

```text
  let zcodeQuotaCache = null
  let zcodeQuotaBusy = null
  // 全量额度：优先按 config 的 provider 段建双通道（start-plan → z.ai billing，
  // coding-plan → bigmodel monitor），没有通道再退 candidate tokens 逐个试。
  const fetchZcodeQuota = async (force) => {
    if (!force && zcodeQuotaCache !== null && Date.now() - zcodeQuotaCache.ts < ZCODE_QUOTA_TTL_MS) {
      return { ok: true, ...zcodeQuotaCache.data, cached: true }
    }
    if (zcodeQuotaBusy !== null) return zcodeQuotaBusy
    zcodeQuotaBusy = (async () => {
      const creds = readZcodeJson('credentials.json')
      if (creds === null || !isObj(creds)) {
        return { ok: false, code: 'NO_CREDENTIALS', error: '未找到 ZCode 登录凭证（' + zcodeV2File('credentials.json') + ' 不存在或不可读）' }
      }
      const config = readZcodeJson('config.json')
      const mid = zcodeDeviceMid()
      const secret = zc.defaultSecret(zcodeHomeDir())
      const identity = zc.identityFromCredentials(creds, secret)
      const parts = []
```

</details>

**依据 5 · 源码核查**：[lib/client.js:6437-6442](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/client.js#L6437-L6442)

侧栏入口注册。

```text
      // 侧栏底部动作（footerActions 在 settingsArea 之前渲染 → 天然在设置按钮上方）。
      ctx.effect(() => slots.inject('sidebar.footer.action', () => slots.register(
        { name: 'sidebar.footer.action', id: 'tokenrhythm-bill-entry', order: 10 },
        (props) => React.createElement(EntryButton, props),
      )), 'tokenrhythm-bill: sidebar entry');

```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 凭据与路由是否构成独立安全边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

state JSON存cookie、账号密码、多平台会话和本面板新建密钥的明文副本。saveState直写文件并传mode0600，失败静默；这不是加密存储，也不是原子写。mode是创建选项，不能据此推断现有文件权限每次被收紧。账户列表掩码不等于浏览器永远拿不到秘密，OpenCSG password和apikey-reveal GET会按需返回完整值，这是显式设计。

serve入口直接按pathname/method分派，本文件没有独立Origin/Host/来源地址或请求身份守卫。系统启用开关只是功能选择，账号identifier只是查找目标，不是请求方授权。路由包含读密码、创建删除平台key、修改账号池及写宿主凭据，故宿主webServer的访问控制是关键前提。不能从插件无守卫直接声称某部署已暴露、浏览器同源策略已被绕过或已发生泄漏。

阶跃key-use有临时文件rename和回读校验，优于无校验直接覆盖，但固定tmp名、先读orig再写和失败回滚没有跨请求/其他编辑器的CAS协调；并发改凭据可能覆盖对方变更，回滚失败被忽略而响应仍写“已回滚”。readBody也不设长度上限，是否受宿主限制未知。敏感路由需要独立权限、审计和写前版本前提，不能把“仅存本机”当完整安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1884-1890](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1884-L1890)

state直写、mode与静默错误。

```text
  const saveState = () => {
    const file = statePath()
    if (file === null) return
    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify({ cookie: state.cookie, csrf: state.csrf, prefs: state.prefs, accounts: state.accounts, activeAccount: state.activeAccount, update: state.update, step: state.step, tf: state.tf, oc: state.oc, savedAt: Date.now() }, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    } catch { /* best-effort：丢持久化不丢功能 */ }
```

**依据 2 · 源码核查**：[lib/index.js:4871-4883](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4871-L4883)

无大小上限读取与直接路由分派。

<details>
<summary>查看原文（13行）</summary>

```text
  async function readBody(req) {
    let text = ''
    for await (const chunk of req) text += chunk
    if (text === '') return {}
    try { return JSON.parse(text) } catch { return {} }
  }

  const serve = async (req, res) => {
    try {
      const url = new URL(req.url || '/', 'http://x')
      const pathname = url.pathname

      if (pathname === '/dsh-tokenrhythm-bill/manifest' && req.method === 'GET') {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:6192-6200](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L6192-L6200)

密码按需完整响应。

```text
      // 明文密码单取：账号列表里只有掩码，要看真值必须走这里（点击眼睛才发这一次请求）
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/account/password' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        loadState()
        const want = url.searchParams.get('identifier')
        const key = ocSessKey(want === null ? state.oc.activeAccount : want)
        const hit = state.oc.accounts.find((a) => ocSessKey(a.identifier) === key)
        if (!hit) { writeJson(res, { ok: false, error: '账号不存在' }, 404); return }
        writeJson(res, { ok: true, identifier: hit.identifier, password: hit.password })
```

**依据 4 · 源码核查**：[lib/index.js:6250-6256](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L6250-L6256)

本地新建key明文reveal。

```text
      // 本机明文的单取与忘记：reveal 只在「这把 key 创建时落过本机」时有值（平台没有这个
      // 口，复制的是我们自己存的那份）；forget 只清本机副本，不动平台那把。两条都只在本机
      // 文件里查表，零上游请求（与基元 /key-reveal 同一条信任边界）。
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/apikey-reveal' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        const token = ocKeyRevealLocal(ocUserParam(url.searchParams), url.searchParams.get('keyId'))
        writeJson(res, token === null ? { ok: false, error: '本机没有这把密钥的完整值（只有在本面板里创建的密钥才会留存）' } : { ok: true, key: token })
```

**依据 5 · 源码核查**：[lib/index.js:5857-5868](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5857-L5868)

固定tmp、校验与best-effort回滚。

<details>
<summary>查看原文（12行）</summary>

```text
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
```

</details>

**依据 6 · 源码核查**：[lib/index.js:6280-6286](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L6280-L6286)

全局异常处理与prefix注册。

```text
      writeJson(res, { ok: false, error: 'not found' }, 404)
    } catch (err) {
      try { writeJson(res, { ok: false, error: String((err && err.message) || err) }, 500) } catch { /* socket 已断 */ }
    }
  }

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/dsh-tokenrhythm-bill', handler: serve }), 'tokenrhythm-bill: routes')
```

#### 缺口

- 当前宿主webServer的真实授权、绑定地址和代理链未纳入该插件固定源码。
  **影响**：不能判断具体部署的外部可达性或凭据路由权限。
  **进一步探讨**：可继续核同版本宿主注册链及无权限请求的拒绝点，先确认信任边界。
- 并发key-use/外部编辑与故障回滚没有受控交错证据。
  **影响**：静态控制流提示丢更新风险，不称已发生损坏。
  **进一步探讨**：以两请求和外部编辑的固定交错核文件版本、tmp和回滚收据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 费用字段和分页能支撑哪些结论？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

OpenCSG归一显式区分窗口信封与明细行。total_value、total_prompt_token等从窗口级字段取，行里分别取输入/输出/推理/缓存与created_at；缺失返回null，不把缺数据当0。分页最多取配置上限，首页失败作为失败，后续失败或触顶标partial，窗口总数只在首页保存，已取行用于分布。这一结构能保留“总量已得、细分不全”的差别。

不能把作者源码注释中称已实测的字段语义当本轮独立验收。平台协议、单位、退款/赠送/套餐口径和时区可能变化；本轮只核固定实现，未抓当前平台真实账单。其他四平台有独立逻辑，统一UI不保证单位和统计窗口相同。

因此它是辅助费用观察面板。对账需要平台原始窗口、币种、账号、查询时间与partial一起保存，并核行和窗口的可比性。对字段缺失的保守null处理值得保留，但不能用一个成功HTTP状态证明业务数字正确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/opencsg.js:934-970](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/opencsg.js#L934-L970)

窗口与行字段独立，缺失null。

<details>
<summary>查看原文（37行）</summary>

```text
function ocNormalizeBills(body) {
  const raw = ocIsObj(body) && ocIsObj(body.data) ? body.data : null
  if (raw === null) {
    return { ok: false, apiCount: null, valueCents: null, totalTokensIn: null, totalTokensOut: null, totalTokensReasoning: null, totalTokensCached: null, totalConsumption: null, totalCalls: null, rows: [] }
  }
  const list = Array.isArray(raw.data) ? raw.data : []
  const rows = []
  for (const r of list) {
    if (!ocIsObj(r)) continue
    let createdAtMs = ocTsToMs(r.created_at)
    if (createdAtMs !== null && createdAtMs < 0) createdAtMs = null // Go 零值（与 ocNormalizeApiKeys 同一坑）
    rows.push({
      apiId: ocStr(r.instance_name),
      tokensIn: ocPickNum(r, ['prompt_token']),
      tokensOut: ocPickNum(r, ['completion_token']),
      tokensReasoning: ocPickNum(r, ['reasoning_token']),
      tokensCached: ocPickNum(r, ['prompt_cached_token']),
      // 行级调用次数与 token 合计（2026-10-17 实测坐实，见上方注释；缺失就是 null，不当 0）
      calls: ocPickNum(r, ['count']),
      consumption: ocPickNum(r, ['consumption']),
      createdAtMs,
      costCents: ocPickNum(r, ['value', 'cost']),
    })
  }
  return {
    ok: true,
    apiCount: ocNum(raw.total),
    valueCents: ocCents(raw.total_value),
    totalTokensIn: ocNum(raw.total_prompt_token),
    totalTokensOut: ocNum(raw.total_completion_token),
    totalTokensReasoning: ocNum(raw.total_reasoning_token),
    totalTokensCached: ocNum(raw.total_prompt_cached_token),
    // 窗口 token 合计与调用次数（服务端算好的，与分页无关；行合计实测逐位相符）
    totalConsumption: ocNum(raw.total_consumption),
    totalCalls: ocNum(raw.total_count),
    rows,
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:4350-4383](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4350-L4383)

分页、首页统计和partial标记。

<details>
<summary>查看原文（34行）</summary>

```text
      const all = []
      for (let page = 1; page <= ocLib.OC_BILL_MAX_PAGES; page++) {
        const q = ocLib.ocBillsQuery({
          scene: ocLib.OC_BILL_SCENE_API, fromDate: win.fromDate, toDate: win.toDate, per, page,
        })
        const b = await ocApi('GET', ocLib.OC_PATH.billsOf(uuid) + '?' + q, { token: sess.token, scheme: sess.scheme })
        if (!b.ok) {
          // 第一页就失败 → 整段按失败处理（与旧版同款）；后续页失败 → 已有行照样用，标 partial
          if (page === 1) {
            if (ocSessRejected(b)) return { ok: false, code: b.code, error: ocLib.ocErrorText(b.code, b.message), authFailed: true }
            noteFail(b)
          } else {
            api.partial = true
          }
          break
        }
        const bills = ocLib.ocNormalizeBills({ msg: b.message, data: b.data })
        if (page === 1) {
          // 窗口级读数只在首页收（服务端按整个窗口算的，每页回的都一样，不重复覆盖）
          api.apiCount = bills.apiCount
          api.valueCents = bills.valueCents
          api.totalTokensIn = bills.totalTokensIn
          api.totalTokensOut = bills.totalTokensOut
          api.totalTokensReasoning = bills.totalTokensReasoning
          api.totalTokensCached = bills.totalTokensCached
          api.totalConsumption = bills.totalConsumption
          api.totalCalls = bills.totalCalls
        }
        all.push(...bills.rows)
        // 取完了：这一页不满 per，或（知道 total 时）行数已经够了
        const enough = bills.rows.length < per || (bills.apiCount !== null && all.length >= bills.apiCount)
        if (enough) break
        if (page === ocLib.OC_BILL_MAX_PAGES) api.partial = true // 撞上限：还有行没取回来
      }
```

</details>

**依据 3 · 作者声明**：[lib/opencsg.js:899-931](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/opencsg.js#L899-L931)

作者协议/实测说明，未由本轮重放。

<details>
<summary>查看原文（33行）</summary>

```text
 * e.data.total || 0`、`te.value = (Math.abs(e.data.total_value || 0) / 100).toFixed(2)`
 * —— 行数组在 `body.data.data`，而 `total`（条数）与 `total_value`（金额，分）挂在 `body.data`。
 * 与 `/user/{username}/order/resources` 那种单层嵌套不同，这里**必须下钻一层**：少钻一层拿到
 * `undefined`，界面就会显示「本期没有任何调用」而其实有一堆。
 *
 * 行级字段名逐字来自门户那张表的列定义（`apiCalls` 页签）：
 *   `instance_name`（接口名，空时门户显示 '-'）、`prompt_token`、`completion_token`、
 *   `reasoning_token`、`prompt_cached_token`（这四个门户都 `?? 0`）、`value`（该行金额，分）。
 * 另外三个字段是 2026-10-17 直接读回包挖出来并**逐行对账坐实**的（当时以为没有证据而扣住
 * 没归一，这轮把证据补上了）：
 *   · `count` —— **这一行聚合了多少次调用**（AtestA 实测：三行 count = 100 / 82 / 3，
 *     行合计 185 与信封 `total_count` 185 逐位相符；C1677 同验：14 === 14）。
 *   · `consumption` —— 这一行的 token 合计，**逐行等于 prompt + completion**
 *     （9189554 + 50165 = 9239719；三行全中），行合计又与信封 `total_consumption` 相符。
 *   · `created_at` —— 记录时间（RFC3339 带微秒）。**注意它不能当「按天分组」的键用**：
 *     实测两个账号的所有行都落在同一天（10-16），无法证明一行是「接口×天」还是
 *     「接口×窗口」，所以界面不拿它铺日历——只当这一行的记录时间显示。
 *   费用类字段：`value`（该行金额，**单位是分**，实测 2026-10-17 为**负数**——扣费记负）、
 *   `total_value`（窗口合计）。用户 2026-10-18 明确要「按接口怎么没花费」，所以
 *   `value` 归一成行级 `costCents` 并参与聚合；`cash_value` / `voucher_value` 的拆分语义
 *   仍未坐实（现金/代金券各占多少没验证过），照旧**不归一不展示**。
 *   **符号怎么处理**：门户那行合计是逐字 `(Math.abs(total_value) / 100).toFixed(2)`——
 *   「花费」这个词本身就是正的数额。界面跟着取绝对值显示，但**协议层存的是原值**（负数
 *   照实留着），并在悬浮里写明白是扣费，不悄悄改账。
 *
 * `apiCount` 取 `total`（条数）而不是 `rows.length`：rows 只有当前页，total 是整个窗口的。
 * 拿不到就 null——**不拿 rows.length 顶替**（那会把「共 37 个接口」悄悄说成「10 个」，是少报）。
 *
 * **整窗口合计**（2026-10-16 坐实四路 token；2026-10-17 坐实 `total_consumption` /
 * `total_count`）：`total_prompt_token` / `total_completion_token` / `total_reasoning_token`
 * / `total_prompt_cached_token` / `total_consumption`（= 输入 + 输出）/ `total_count`
 * （= 各行 count 之和 = 窗口内调用次数），都是服务端按**整个窗口**算好的，与分页无关。
 * 剩下的 `total_voucher_value` / `total_cash_value` / `total_duration` 语义仍未实测坐实
```

</details>

#### 缺口

- 多平台真实账单字段、币种/时区与更新延迟缺少同窗口对照原件。
  **影响**：不能正式对账或量化费用显示误差。
  **进一步探讨**：选匿名固定响应和官方账单窗口，核null、退款、赠送与分页分布，逐平台保留样例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 连通检测会不会计费，缓存绑定什么身份？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

model-check不是无业务副作用的ping。它对选中provider的chat/completions发真实Bearer请求，用户消息ping、max_tokens1，每个探测30秒abort、最多3worker并发，批次最多30个待探测模型。平台可能收输入和最低调用费用，HTTP成功甚至非JSON也视为可达，不代表输出正确、工具调用可用或完整任务可靠。

缓存是apply内共享Map，buildCheckPlan仅用model ID读，探测结束也只用modelId写；provider、baseURL、账号/key指纹都不在key。60秒内非force请求若切provider或替换key而模型同名，可能复用前一身份的可达/延迟结果，变成错误归属；源码没有在此链看到身份维度。force可重测但不能修正默认缓存语义。

首次与重复并发请求也未见inflight去重，TTL只对完成结果生效，连续点击在首轮完成前仍可能重复请求。缓存命中不等于当前账号刚完成检测，也不能把延迟当吞吐或费用评测。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1036-1066](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1036-L1066)

cache只以id查找。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildCheckPlan(models, cache, force, now, ttl) {
  const ttlMs = Number(ttl) > 0 ? Number(ttl) : CHECK_TTL_MS
  const nowMs = typeof now === 'number' && Number.isFinite(now) ? now : Date.now()
  const hit = (id) => {
    if (cache == null) return null
    try {
      if (typeof cache.get === 'function') return cache.get(id) || null
      return isObj(cache) ? (cache[id] || null) : null
    } catch { return null }
  }
  const seen = {}
  const toProbe = []
  const cachedResults = {}
  const list = Array.isArray(models) ? models : []
  for (const raw of list) {
    if (typeof raw !== 'string') continue // 只接受字符串模型 ID（数字/对象等一律无效）
    const id = asStr(raw)
    if (id === '' || seen[id]) continue
    seen[id] = true
    if (toProbe.length >= CHECK_MAX_MODELS) break
    const h = hit(id)
    if (!force && h && typeof h === 'object' && typeof h.ts === 'number' && nowMs - h.ts < ttlMs) {
      cachedResults[id] = {
        status: h.status, ms: h.ms, error: h.error || null, errorKind: h.errorKind || null,
        checkedAt: h.checkedAt, cached: true,
      }
      continue
    }
    toProbe.push(id)
  }
  return { toProbe, cachedResults }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2125-2135](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L2125-L2135)

实例级Map与fetch timeout。

<details>
<summary>查看原文（11行）</summary>

```text
  // ---- /model-check 批量检测 TTL 缓存：model -> { ts, status, ms, error, errorKind, checkedAt } ----
  // 60s 内同模型不重复真实探测（防连续点「立即检测」重复计费）；force 绕过。
  const checkCache = new Map()
  const fetchWithTimeout = async (url, init) => {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      return await fetch(url, { ...init, signal: ac.signal })
    } finally {
      clearTimeout(timer)
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:5325-5341](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5325-L5341)

provider/key选定后仍传共享缓存。

<details>
<summary>查看原文（17行）</summary>

```text
        const body = await readBody(req)
        const { providers } = readProviders()
        const wantId = body && typeof body.provider === 'string' ? body.provider.trim() : ''
        const provider = wantId !== ''
          ? providers.find((p) => p.id === wantId) || null
          : providers.find((p) => p.balanceCapable) || providers[0] || null
        if (!provider) { writeJson(res, { ok: false, error: '没有可用提供商（检查 settings.yaml 或 profile 补丁层里的 llm-pi-ai.providers）' }, 404); return }
        const key = resolveKey(provider)
        if (key === '') { writeJson(res, { ok: false, code: 'NO_KEY', error: '未读到 ' + provider.apiKeyEnv + '（env 与 ~/.dsh/.credentials.yaml 都没有）' }, 409); return }
        const force = body && body.force === true
        const plan = buildCheckPlan(body ? body.models : null, checkCache, force, Date.now(), CHECK_TTL_MS)
        if (plan.toProbe.length === 0 && Object.keys(plan.cachedResults).length === 0) {
          writeJson(res, { ok: false, error: '请至少勾选一个模型（models 为字符串数组，最多 ' + CHECK_MAX_MODELS + ' 个）' }, 400); return
        }
        const base = (provider.baseURL || '').replace(/\/+$/, '')
        if (base === '') { writeJson(res, { ok: false, error: '提供商 ' + provider.id + ' 的 baseURL 为空，无法探测' }, 500); return }
        const chatUrl = /\/v\d+$/.test(base) ? base + '/chat/completions' : base + '/v1/chat/completions'
```

</details>

**依据 4 · 源码核查**：[lib/index.js:5347-5385](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5347-L5385)

真实模型请求、非JSON成功与modelId写缓存。

<details>
<summary>查看原文（39行）</summary>

```text
        const probeOne = async (modelId) => {
          await new Promise((r) => setTimeout(r, Math.floor(Math.random() * CHECK_JITTER_MS)))
          const t0 = Date.now()
          const ac = new AbortController()
          const timer = setTimeout(() => ac.abort(), CHECK_TIMEOUT_MS)
          let http = 0
          let detail = '网络错误'
          try {
            const r2 = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
              body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
              signal: ac.signal,
            })
            http = r2.status
            if (r2.ok) {
              detail = ''
              try { await r2.json() } catch { /* 200 非 JSON 也视为可达 */ }
            } else {
              const t = await r2.text().catch(() => '')
              let msg = t.slice(0, 160)
              try {
                const j = JSON.parse(t)
                if (isObj(j) && j.error !== undefined) msg = String((isObj(j.error) ? (j.error.message || j.error) : j.error))
              } catch { /* 保留原始文本 */ }
              detail = 'HTTP ' + http + (msg ? ' ' + msg : '')
            }
          } catch (err) {
            detail = (err && (err.name === 'AbortError' || err.name === 'TimeoutError'))
              ? '超时（' + CHECK_TIMEOUT_MS + 'ms）'
              : String((err && err.message) || err)
          } finally {
            clearTimeout(timer)
          }
          const ms = Date.now() - t0
          const cls = classifyProbe(http, detail)
          const entry = { status: cls.status, ms, error: cls.error, errorKind: cls.errorKind, checkedAt: Math.floor(Date.now() / 1000), cached: false }
          results[modelId] = entry
          checkCache.set(modelId, Object.assign({ ts: Date.now() }, entry))
```

</details>

**依据 5 · 源码核查**：[lib/index.js:5387-5395](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5387-L5395)

最多3worker。

```text
        // 并发 ≤3 的 worker 池从共享队列取任务（JS 单线程，qIdx 无需锁）。
        await (async () => {
          const workers = []
          for (let w = 0; w < Math.min(CHECK_CONCURRENCY, queue.length); w++) {
            workers.push((async () => {
              while (qIdx < queue.length) {
                const id = queue[qIdx]
                qIdx++
                await probeOne(id)
```

#### 缺口

- 跨provider/换key同模型缓存没有真实交互复现。
  **影响**：不把静态身份缺失写成已发生误报。
  **进一步探讨**：两套无敏感受控endpoint用相反状态、相同model ID，在TTL内切换并对照force。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 启用需要什么，怎样有序操作？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=20、DSH Cordis/webServer与Web界面 | 必需 | Host路由和客户端面板 | 纯Node导入不代表完成集成 |
| settings.yaml和凭据文件/env | 相应提供商必需 | 模型目录/API key解析 | 无provider/key时明确失败 |
| 平台账号/网络/合法会话 | 按系统 | 余额/账单/密钥操作 | 失效可能自动登录或提示错误 |
| ZCode本机credentials/config | 仅ZCode | 读桌面套餐身份 | 无文件返回NO_CREDENTIALS |
| 敏感文件保护与可信Host访问控制 | 使用前提 | 多平台凭据集中保管 | 不适合未经保护的共享暴露面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核固定版本、宿主访问权限和凭据备份 | 拒绝未授权敏感路由访问 |
| 启用 | 挂bundle，默认仅基元 | 入口出现且manifest指向预期provider |
| 接入 | 逐个平台显式开关/账号 | 核账号身份，不一次导入全部秘密 |
| 查询 | 核数据时间、账号、partial和单位 | 错误不当零余额，缓存不当新取数据 |
| 变更 | 密钥创建/删除/切换独立确认 | 对照平台状态和宿主凭据版本 |
| 收尾 | 停用并管理本机state/平台key | 卸载不代表凭据或平台key自动撤销 |

包无第三方dependencies声明，使用内置Node能力和宿主服务；其测试脚本是作者资产，本轮未执行。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-20](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/package.json#L1-L20)

版本/ESM/exports。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-tokenrhythm-bill",
  "version": "0.7.2",
  "description": "基元律动费用中心：账户余额与限时额度（含体验卡兑换码入口，数据账号行带实名状态徽章）、按分类筛选的模型价格卡（含折扣与峰谷分时计价）、近 30 天用量热力日历、自定义连通检测与平台密钥管理；基元律动 / 阶跃 / ZCode / 清枢智汇 / OpenCSG 五家在「设置 → 系统管理」里独立开关（默认只显示基元，至少留一个）；阶跃页签按账号展示头像、实名状态、套餐与余额；ZCode 页签查看桌面端套餐额度（读本机凭证）；清枢智汇页签展示用户信息与套餐用量；OpenCSG 页签用账号密码登录（支持多账号），账户卡展示账户余额与待发放余额（数据时间常驻），用量页照基元版式给窗口 token/调用合计与按接口拆分（翻页取全量），另有平台 API Key 管理（列表掩码 / 创建即在本机留存一份明文 / 删除仅自建）。凭据只存本机 host。",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "tests",
    "image",
    "cordis.patch.yml",
    "LICENSE",
    "README.md"
  ],
  "keywords": [
```

</details>

**依据 2 · 源码核查**：[package.json:40-55](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/package.json#L40-L55)

Node与Web声明，作者测试脚本。

<details>
<summary>查看原文（16行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "test": "node --test --test-force-exit \"tests/*.spec.mjs\""
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  }
}
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-9](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/cordis.patch.yml#L1-L9)

bundle接线。

```text
# dsh-tokenrhythm-bill bundle patch: inserts the dual-face plugin row into the web
# profile roster. The node half (exports ".") runs in the host process (settings
# parsing, credential resolution, balance/trend/keys proxying, model connectivity
# checks), and the dsh.client declaration in package.json loads the browser half
# (exports "./client") in the web GUI (sidebar.footer.action entry + shell.overlay
# panel).
- insert:
    - id: tokenrhythm-bill
      name: 'dsh-tokenrhythm-bill'
```

**依据 4 · 源码核查**：[lib/index.js:4794-4808](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4794-L4808)

ZCode文件依赖与缺失响应。

<details>
<summary>查看原文（15行）</summary>

```text
  const fetchZcodeQuota = async (force) => {
    if (!force && zcodeQuotaCache !== null && Date.now() - zcodeQuotaCache.ts < ZCODE_QUOTA_TTL_MS) {
      return { ok: true, ...zcodeQuotaCache.data, cached: true }
    }
    if (zcodeQuotaBusy !== null) return zcodeQuotaBusy
    zcodeQuotaBusy = (async () => {
      const creds = readZcodeJson('credentials.json')
      if (creds === null || !isObj(creds)) {
        return { ok: false, code: 'NO_CREDENTIALS', error: '未找到 ZCode 登录凭证（' + zcodeV2File('credentials.json') + ' 不存在或不可读）' }
      }
      const config = readZcodeJson('config.json')
      const mid = zcodeDeviceMid()
      const secret = zc.defaultSecret(zcodeHomeDir())
      const identity = zc.identityFromCredentials(creds, secret)
      const parts = []
```

</details>

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 资源回收和失败恢复有什么优点与缺口？

**研究主题**：工程质量与复用

#### 完整回答

Host前缀注册包在ctx.effect，客户端提醒轮询有clearInterval/stopped，侧栏slot也经effect注册，提供明确生命周期出口。网络请求有AbortController预算，OpenCSG后页失败保留partial，账号槽过滤有助避免陈旧跨账号会话。不能因实现长就否定这些具体约束。

fetchWithTimeout在fetch返回headers后finally清timer，调用者再res.text解析body；故15秒不覆盖完整body读取。慢/不结束body可超过该预算，且没有绑定前端断开请求的取消链。model-check自己的timer覆盖json/text读取，二者保证不同。state保存失败静默、坏JSON回空状态，界面继续工作不证明凭据成功持久化，重启后可能丢失。

前端轮询清理不等于全部已发上游请求被abort，Hosteffect回收路由也不取消已经在跑的调用。较大的单体路由和手写平台协议需要按版本维护，作者测试数量不能代替具体异常恢复覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2128-2145](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L2128-L2145)

timeout止于fetch返回，body随后读。

<details>
<summary>查看原文（18行）</summary>

```text
  const fetchWithTimeout = async (url, init) => {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), UPSTREAM_TIMEOUT_MS)
    try {
      return await fetch(url, { ...init, signal: ac.signal })
    } finally {
      clearTimeout(timer)
    }
  }
  const fetchUpstreamModels = async (provider, key) => {
    // baseURL 已以 /v1 等版本段结尾（settings 实际布局）时直接接 /models，
    // 否则补 /v1/models —— 避免拼出 /v1/v1/models。
    const base = provider.baseURL.replace(/\/+$/, '')
    const url = /\/v\d+$/.test(base) ? base + '/models' : base + '/v1/models'
    const init = { headers: { Authorization: 'Bearer ' + key } }
    let res = await fetchWithTimeout(url, init)
    if (RETRYABLE_STATUS.has(res.status)) res = await fetchWithTimeout(url, init)
    const bodyText = await res.text()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1878-1890](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1878-L1890)

坏状态回空与保存错误静默。

<details>
<summary>查看原文（13行）</summary>

```text
    } catch { /* 不可读 → 空状态 */ }
    stepLoadSessions() // 落盘的长会话装进内存 Map（多账号并存的前提）
    tfLoadSessions() // 清枢智汇同款：30 天会话按账号分槽落盘
    ocLoadSessions() // OpenCSG 同款：本地 JWT 按账号分槽落盘
    return state
  }
  const saveState = () => {
    const file = statePath()
    if (file === null) return
    try {
      mkdirSync(dirname(file), { recursive: true })
      writeFileSync(file, JSON.stringify({ cookie: state.cookie, csrf: state.csrf, prefs: state.prefs, accounts: state.accounts, activeAccount: state.activeAccount, update: state.update, step: state.step, tf: state.tf, oc: state.oc, savedAt: Date.now() }, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    } catch { /* best-effort：丢持久化不丢功能 */ }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:6429-6442](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/client.js#L6429-L6442)

轮询和slot effect清理。

<details>
<summary>查看原文（14行）</summary>

```text
        const start = () => {
          check()
          timer = setInterval(check, 5 * 60 * 1000)
        }
        start()
        return () => { stopped = true; if (timer !== null) clearInterval(timer) }
      }, 'tokenrhythm-bill: alert poll');

      // 侧栏底部动作（footerActions 在 settingsArea 之前渲染 → 天然在设置按钮上方）。
      ctx.effect(() => slots.inject('sidebar.footer.action', () => slots.register(
        { name: 'sidebar.footer.action', id: 'tokenrhythm-bill-entry', order: 10 },
        (props) => React.createElement(EntryButton, props),
      )), 'tokenrhythm-bill: sidebar entry');

```

</details>

**依据 4 · 源码核查**：[lib/index.js:6280-6286](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L6280-L6286)

Host注册effect。

```text
      writeJson(res, { ok: false, error: 'not found' }, 404)
    } catch (err) {
      try { writeJson(res, { ok: false, error: String((err && err.message) || err) }, 500) } catch { /* socket 已断 */ }
    }
  }

  ctx.effect(() => ctx.webServer.register({ kind: 'prefix', path: '/dsh-tokenrhythm-bill', handler: serve }), 'tokenrhythm-bill: routes')
```

#### 缺口

- 慢body/浏览器断开与停用过程的资源释放缺少受控记录。
  **影响**：不能保证全调用15秒结束或停用立即停止上游。
  **进一步探讨**：用headers立即但body延迟的受控服务及断连序列，记录请求和timer清理。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 首次、持续与恢复成本和效果怎样判断？

**研究主题**：效果与总成本

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 平台账号与本机state备份资源 | 配宿主访问控制、账号和state保护 | 多平台协议兼容时间/费用未知，宜逐个启用 |
| 持续使用 | 轮询分页、续登网络和model-check真实模型调用 | 维护账号与平台协议 | 实际请求量/平台费用未知，30模型/3并发仅限单批 |
| 失败恢复 | 重查平台/state/凭据文件资源，费用未知 | 核账号身份、限流/协议变化、state与凭据版本 | 静默保存和并发覆盖可增恢复人工，不填金额 |

#### 效果

| 目标 | 源码支持的增量 | 证据边界 |
| --- | --- | --- |
| 少切门户 | 侧栏聚合账号、余额和用量 | 无同任务人工耗时对照 |
| 少误解不完整统计 | null与partial、窗口信封和明细分开 | 不证明当前上游字段含义都正确 |
| 快速排查连通 | 有并发/时间预算的真实小请求 | 缓存未绑定身份，不代表业务质量 |
| 更方便密钥操作 | 创建/删除/reveal及宿主key-use | 权限和保密成本增加，无独立安全收益测量 |

不声称节省具体金额、提高准确率或能避免超支。收费渠道/额度政策属于平台实时规则，本轮固定版本研究不替平台作承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.js:6429-6434](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/client.js#L6429-L6434)

持续后台轮询。

```text
        const start = () => {
          check()
          timer = setInterval(check, 5 * 60 * 1000)
        }
        start()
        return () => { stopped = true; if (timer !== null) clearInterval(timer) }
```

**依据 2 · 源码核查**：[lib/index.js:5347-5359](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5347-L5359)

检测实际发送模型请求。

<details>
<summary>查看原文（13行）</summary>

```text
        const probeOne = async (modelId) => {
          await new Promise((r) => setTimeout(r, Math.floor(Math.random() * CHECK_JITTER_MS)))
          const t0 = Date.now()
          const ac = new AbortController()
          const timer = setTimeout(() => ac.abort(), CHECK_TIMEOUT_MS)
          let http = 0
          let detail = '网络错误'
          try {
            const r2 = await fetch(chatUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + key },
              body: JSON.stringify({ model: modelId, messages: [{ role: 'user', content: 'ping' }], max_tokens: 1 }),
              signal: ac.signal,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:4350-4383](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L4350-L4383)

分页与partial。

<details>
<summary>查看原文（34行）</summary>

```text
      const all = []
      for (let page = 1; page <= ocLib.OC_BILL_MAX_PAGES; page++) {
        const q = ocLib.ocBillsQuery({
          scene: ocLib.OC_BILL_SCENE_API, fromDate: win.fromDate, toDate: win.toDate, per, page,
        })
        const b = await ocApi('GET', ocLib.OC_PATH.billsOf(uuid) + '?' + q, { token: sess.token, scheme: sess.scheme })
        if (!b.ok) {
          // 第一页就失败 → 整段按失败处理（与旧版同款）；后续页失败 → 已有行照样用，标 partial
          if (page === 1) {
            if (ocSessRejected(b)) return { ok: false, code: b.code, error: ocLib.ocErrorText(b.code, b.message), authFailed: true }
            noteFail(b)
          } else {
            api.partial = true
          }
          break
        }
        const bills = ocLib.ocNormalizeBills({ msg: b.message, data: b.data })
        if (page === 1) {
          // 窗口级读数只在首页收（服务端按整个窗口算的，每页回的都一样，不重复覆盖）
          api.apiCount = bills.apiCount
          api.valueCents = bills.valueCents
          api.totalTokensIn = bills.totalTokensIn
          api.totalTokensOut = bills.totalTokensOut
          api.totalTokensReasoning = bills.totalTokensReasoning
          api.totalTokensCached = bills.totalTokensCached
          api.totalConsumption = bills.totalConsumption
          api.totalCalls = bills.totalCalls
        }
        all.push(...bills.rows)
        // 取完了：这一页不满 per，或（知道 total 时）行数已经够了
        const enough = bills.rows.length < per || (bills.apiCount !== null && all.length >= bills.apiCount)
        if (enough) break
        if (page === ocLib.OC_BILL_MAX_PAGES) api.partial = true // 撞上限：还有行没取回来
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:5857-5868](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5857-L5868)

凭据写入/失败恢复成本。

<details>
<summary>查看原文（12行）</summary>

```text
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
```

</details>

#### 缺口

- 没有相同账号窗口下人工门户与面板的耗时、请求数、误报率对照。
  **影响**：不能量化效率或节省。
  **进一步探讨**：匿名固定任务比较操作次数、数据口径正确、网络量与恢复时间。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 推荐结论与可继续探讨的创新是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。多平台面板和保守字段归一有实用价值，但这是可读取密码、保存密钥并修改宿主凭据的管理面，当前插件代码依赖宿主访问控制；检测缓存未含provider/密钥身份，state写入和凭据并发恢复也需改善。不能仅凭侧栏便利给普通共享环境直接推荐安装。单人可信环境的源码评估者可先只读、单平台，避免导入高价值账号和执行密钥变更。

可继续探讨“身份绑定的数据/变更收据”。缓存key绑定平台、账号和key不可逆指纹，余额/账单带来源时间/窗口/完整性；敏感操作独立授权并带预期文件版本，持久化用原子替换和可见错误，明文reveal按最小范围短时授权。相较现有分散字符串响应，目标是减少切号误归属与丢更新，同时保留界面便利。

这是假设未实现。最小对照覆盖同名模型跨provider、换key、分页失败、并发key-use/外部编辑、未授权reveal和慢body。记录错误身份命中、丢更新、拒绝率、请求量/延迟和人工恢复时间；若安全闸门增加操作负担而未减少这些错误，不计有效创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1036-1066](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L1036-L1066)

身份缓存方案的现状基线。

<details>
<summary>查看原文（31行）</summary>

```text
export function buildCheckPlan(models, cache, force, now, ttl) {
  const ttlMs = Number(ttl) > 0 ? Number(ttl) : CHECK_TTL_MS
  const nowMs = typeof now === 'number' && Number.isFinite(now) ? now : Date.now()
  const hit = (id) => {
    if (cache == null) return null
    try {
      if (typeof cache.get === 'function') return cache.get(id) || null
      return isObj(cache) ? (cache[id] || null) : null
    } catch { return null }
  }
  const seen = {}
  const toProbe = []
  const cachedResults = {}
  const list = Array.isArray(models) ? models : []
  for (const raw of list) {
    if (typeof raw !== 'string') continue // 只接受字符串模型 ID（数字/对象等一律无效）
    const id = asStr(raw)
    if (id === '' || seen[id]) continue
    seen[id] = true
    if (toProbe.length >= CHECK_MAX_MODELS) break
    const h = hit(id)
    if (!force && h && typeof h === 'object' && typeof h.ts === 'number' && nowMs - h.ts < ttlMs) {
      cachedResults[id] = {
        status: h.status, ms: h.ms, error: h.error || null, errorKind: h.errorKind || null,
        checkedAt: h.checkedAt, cached: true,
      }
      continue
    }
    toProbe.push(id)
  }
  return { toProbe, cachedResults }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:5857-5868](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L5857-L5868)

版本写入方案基线。

<details>
<summary>查看原文（12行）</summary>

```text
        const tmp = cp + '.tokenrhythm.tmp'
        try {
          writeFileSync(tmp, patched.text, { mode: 0o600 })
          renameSync(tmp, cp)
          const after = readTextSafe(cp)
          const now = extractCredentialFromText('STEP_API_KEY', after)
          const sameLines = String(after).split('\n').length === orig.split('\n').length
          if (typeof after !== 'string' || String(now).trim() !== fullKey || !sameLines) throw new Error('verify')
        } catch {
          try { writeFileSync(cp, orig, { mode: 0o600 }) } catch { /* 回滚也失败：保留错误响应，不再放大 */ }
          try { if (existsSync(tmp)) unlinkSync(tmp) } catch { /* 尽力清理临时副本 */ }
          writeJson(res, { ok: false, code: 'WRITE_FAILED', error: '凭据文件写入校验未通过，已回滚原内容' }, 500); return
```

</details>

**依据 3 · 源码核查**：[lib/index.js:6192-6200](https://github.com/162568316/dsh-tokenrhythm-bill/blob/df72615bc5c8f6ccfe287b8a3cfef627923b2f1f/lib/index.js#L6192-L6200)

最小reveal授权方案基线。

```text
      // 明文密码单取：账号列表里只有掩码，要看真值必须走这里（点击眼睛才发这一次请求）
      if (pathname === '/dsh-tokenrhythm-bill/opencsg/account/password' && req.method === 'GET') {
        if (!ocEnabled()) { writeJson(res, ocDisabledResponse()); return }
        loadState()
        const want = url.searchParams.get('identifier')
        const key = ocSessKey(want === null ? state.oc.activeAccount : want)
        const hit = state.oc.accounts.find((a) => ocSessKey(a.identifier) === key)
        if (!hit) { writeJson(res, { ok: false, error: '账号不存在' }, 404); return }
        writeJson(res, { ok: true, identifier: hit.identifier, password: hit.password })
```

#### 缺口

- 身份收据、版本写入与独立敏感操作授权尚未实现。
  **影响**：不作为当前能力或提高评分。
  **进一步探讨**：按固定交错/权限/分页用例先比较错误率与额外开销。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
