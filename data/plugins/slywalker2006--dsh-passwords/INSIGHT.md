# dsh-passwords

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[3219789](https://github.com/slywalker2006/dsh-passwords/tree/3219789be4870e2888df9ef879448d442b87662d)

<!-- BEGIN META -->
[![GitHub ★ 82](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=82&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/slywalker2006/dsh-passwords) [![npm 30d 2,714](https://img.shields.io/static/v1?label=npm+30d&message=2%2C714&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-passwords) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-passwords)
<!-- END META -->

> **功能**：为共享DSH提供账号网关、逐资源权限、粗用量配额和管理界面，需独立部署与宿主桥接。

> **亮点**：[Q03](#research-q03) 实质贡献是身份、会话grant、运行时通道分类与撤销接线组合；不是单独登录页，也非已证明的全租户隔离。

> **主要限制**：[Q02](#research-q02) 内存logout吊销不跨重启；[Q04](#research-q04) 客户端计数不构成不可信用户硬预算；全代理面未穷尽。

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
  - [Q01 · 多人共享DSH改变哪些任务，何为合格授权？](#detail-section-11)
  - [Q02 · 主用户初始化、登录会话和吊销怎样实现？](#detail-section-12)
  - [Q03 · HTTP/WebSocket工作区会话授权如何覆盖？](#detail-section-13)
  - [Q04 · 配额、模型和文件/终端限制依什么执行？](#detail-section-14)
  - [Q05 · 部署、补丁、持久状态和退出的条件成本是什么？](#detail-section-15)
  - [Q06 · 可借鉴什么机制，假设如何证伪？](#detail-section-16)
  - [Q07 · 谁能采用，何时退出？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向有运维能力的小团队管理员，让子用户仅访问分配的工作区/会话。

共享宿主凭据或分别维护反代认证/资源分配；本组件集中这些配置，仍不能替代OS隔离。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 账号登录与管理 | 初始化、JWT、子用户及凭据版本 | logout黑名单仅当前网关进程 |
| 逐资源授权 | 目录/会话grant与HTTP/WS代表对象检查 | 全代理/动态插件未穷尽，非OS隔离 |
| 模型与沙盒策略 | 代表请求按有效模型和授权沙盒拒绝/钉档 | 共享Host协议耦合，实际执行边界待验 |
| 用量配额 | 投影上报并在后续请求做阈值检查 | 客户端可漏报；非权威硬预算 |
| 审计及字段保护 | bcrypt、AES-GCM字段与HMAC查询 | 不加密全部数据，无自动密钥迁移 |
| 部署与管理入口 | CLI网关、Docker/反代和设置卡片 | 版本补丁和端口需验，更新/卸载回滚未测 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node/固定DSH及补丁 | 必需 | 插件桥接和网关协议 | 门禁支持不等逐版本运行通过 |
| 独立网关与只经网关的拓扑 | 远程共享必需 | HTTP/WS认证授权 | 上游直连/额外端口可绕边界 |
| SQLite与匹配.env密钥 | 必需 | 账户/权限/审计持久化 | 丢键不可解密，无自动迁移 |
| TLS/反代或SSH转发 | 跨机访问需配置 | 保Host与WS、保护凭据 | Docker本地回环示例不能直接当公网部署 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离准备 | 只发布回环网关端口，备份DB与密钥 | 核固定版本与手工管理员救援 |
| 账号授权 | 主用户创建A/B及目录/逐会话grant | 不同账号负向HTTP/WS读取均拒绝 |
| 撤销核验 | 登出/重启/改密失败通知与权限并发 | 旧token与在途结果不因健康页而被认定安全 |
| 退出 | 关闭外部入口再按文档卸载补丁/重启 | 保数据密钥，恢复验证后再决定清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务器/容器、域名/TLS与本地持久卷 | 版本补丁/端口/负向矩阵和备份演练 | 现金/工时未测 |
| 持续 | 网关/SQLite/WS、审计日志和供应商tokens | 账户权限维护、证书与更新 | 客户端配额不是供应商硬账单 |
| 失败 | 重跑生成/运维与恢复资源 | 关闭暴露、核旧会话与DB密钥/补丁恢复 | 恢复成本未知，丢键不可自动迁移 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 账号分配 | 服务端JWT/用户/cv检查链存在 | 跨全部通道隔离未验 |
| 会话授权 | 代表grant/目录/所有权及WS分类已接 | 动态插件/全mux覆盖未穷尽 |
| 配额显示 | 浏览器投影增量上报和后续请求阈值 | 非恶意客户端硬预算，节省费用未测 |

> **思考**：[Q02](#research-q02) 内存logout吊销不跨重启；[Q04](#research-q04) 客户端计数不构成不可信用户硬预算；全代理面未穷尽。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03) 实质贡献是身份、会话grant、运行时通道分类与撤销接线组合；不是单独登录页，也非已证明的全租户隔离。

[Q03](#research-q03) 同引用授权函数/epoch与协议分层可借鉴；[Q05](#research-q05) 补丁/版本/持久状态和全代理面增加维护成本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 内存logout吊销不跨重启；[Q04](#research-q04) 客户端计数不构成不可信用户硬预算；全代理面未穷尽。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q07](#research-q07) 仅观察可丢弃部署；先负向矩阵与密钥恢复，失败关闭外部入口，不依赖健康检查升级生产。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认代表身份/授权链及具体反证；未运行宿主、部署或越权测试，未穷举全部代理/第三方端点。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、package.json、src/auth.ts、src/gateway.ts、src/plugin.ts、src/proxy.ts、src/client/token.tsx、src/admin.ts、src/encrypt.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定AuthService、代表HTTP门卫/会话根、WS upgrade、模型/沙盒门禁、客户端计数/上报、字段加密及部署退出文档。未穷举proxy全部响应/流、媒体/更新/补丁事务和第三方插件。
- 下一步：只读固定3219789be4870e2888df9ef879448d442b87662d；额外Git原件proxy.fixed.ts用于取回源码证据，未执行目标/测试/安装/网络服务；真实隔离、用量与运维结果未知。

**分析版本**

- **仓库**：[slywalker2006/dsh-passwords](https://github.com/slywalker2006/dsh-passwords)
- **版本号**：2.7.8（[固定提交 3219789](https://github.com/slywalker2006/dsh-passwords/tree/3219789be4870e2888df9ef879448d442b87662d)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 服务器预算预留/幂等结算和持久吊销收据是假设，须先证明入口全覆盖，当前未实现。

只读固定3219789be4870e2888df9ef879448d442b87662d；额外Git原件proxy.fixed.ts用于取回源码证据，未执行目标/测试/安装/网络服务；真实隔离、用量与运维结果未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 23 | 5228 | — | — | 71677 |
| .mjs | source | 10 | 1661 | 1349 | 206 | — |
| .ts | source | 28 | 27885 | 21218 | 5521 | — |
| .tsx | source | 5 | 4306 | 3614 | 509 | — |
| .ts | test | 77 | 35043 | 28529 | 4431 | — |
| .mjs | test | 1 | 202 | 160 | 22 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/slywalker2006/dsh-passwords/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：小团队能否用账号网关共享DSH，并在每条实际通道上保持资源授权与可撤销边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多人共享DSH改变哪些任务，何为合格授权？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在一台服务器共享DSH的小团队管理员：先建立主账号，再分配子用户、目录和逐会话授权，让用户经网关登录。基线是共享一个宿主凭据、手工配置反代认证与分别维护共享范围；本组件将账号/权限/配额/审计界面与宿主桥接组合。合格交付不仅能登录，还须A看不到B资源、撤销后旧HTTP/WS不能继续读取、额度口径可解释。

根包确有cordis name/inject/apply导出和client bundle，是原生插件，同时带CLI独立网关。它不是密码保管器；“多租户”在这里是应用网关层资源控制，不能据此声称OS进程/内核/宿主管理员隔离。共享模型服务与宿主仍在同一拓扑，越过网关的直连入口和获授权插件能力另需验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-69](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L49-L69)

作者场景、核心流程和声明功能。

<details>
<summary>查看原文（21行）</summary>

```text

| 你想做什么 | dsh-passwords 提供什么 |
|---|---|
| 小团队共用服务器上的 DSH | 独立登录账号、子用户管理与用量配额 |
| 只把指定项目或对话分享给他人 | 工作区白名单与逐会话授权 |
| 集中管理远程访问 | 登录限流、审计日志，以及宿主机自动 HTTPS 或反代部署 |

核心使用流程：主用户创建子账号 → 分配工作区、会话和额度 → 子用户登录并使用获授权的资源。

## 功能

- **登录认证**：首次配置创建主用户；网页与受保护的 API 需要登录，会话 12 小时有效
- **HTTPS 部署**：宿主机直接部署支持自动申请与续期证书、HTTP 跳转 HTTPS（需公网域名可解析及 80/443 可达）；Docker 默认由外层反代提供 HTTPS
- **多租户**：一个主用户加任意多个子用户，账号管理全部在 dsh 设置页完成
- **权限与配额**：目录白名单（可读取目录 `allowedFolders`）、逐会话开关、每小时 token 上限、每日时长上限、沙盒三档、上传与下载开关、SSH 与终端开关、封禁
- **会话授权**：工作区权限不自动包含其中全部会话，主用户逐会话授予；归档状态在工作区列表与会话列表间保持一致
- **运维视图**：主用户可查看全部工作区与会话，下载非敏感普通文件
- **审计与安全**：登录限流与锁定、审计日志、SQLite 中用户名及审计敏感字段加密、密码 bcrypt 哈希、登出即吊销会话
- **设置页卡片**：远程设置补丁重载、软件更新、账号与权限管理、站内留言，全部中英双语

## 界面截图
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1-4](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/index.ts#L1-L4)

原生插件入口与独立CLI网关分工。

```text
// dsh-passwords 的 dsh 插件入口（cordis 插件：name/inject/apply）。
// dsh 通过 cordis.yml 里的 insert 条目按包名加载本包时，解析的就是这个入口。
// 网关进程本体在 src/cli.ts（bin 入口），两者互不干扰。
export { name, inject, apply } from './plugin.js';
```

**依据 3 · 源码核查**：[package.json:1-30](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/package.json#L1-L30)

根包插件和CLI双入口。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "dsh-passwords",
  "version": "2.7.8",
  "description": "dsh-passwords: a server-grade gateway that turns DeepSeek Harness into a multi-tenant platform — remote access + automatic HTTPS, per-subuser permissions & quotas, sandbox enforcement, first-run setup, SQLite auth with at-rest encryption, rate-limit and audit log (bilingual zh/en UI)",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "bin": {
    "dsh-passwords": "dist/cli.js"
  },
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./dist/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "license": "GPL-3.0-only",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

#### 缺口

- 真实团队需求频次及全通道隔离未验
  **影响**：不能把宣传多租户当生产安全证明
  **进一步探讨**：用两个子账号和单独管理员做负向资源测试

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主用户初始化、登录会话和吊销怎样实现？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

AuthService先查是否初始化，校setupKey及用户名/密码策略，bcrypt rounds10后交数据库setupInitialAdmin最终判定；这不是前端单次标志。登录有账号/IP失败计数、锁定及不存在用户dummy bcrypt；JWT含sub、username、credential_version，12小时HS256。网关sessionOf再按ID读用户并比用户名/cv，验签结果缓存30秒且不超过JWT exp；改名重用旧用户名不能仅凭名字继承身份。

POST logout校Origin、清cookie并把token放内存revokedTokens，关闭该user的WS/mux；这对当前网关进程有效，但黑名单不持久，重启后仍未过期且cv不变的已复制JWT不再受该内存记录拒绝，不能宣称跨重启永久登出吊销。改密/改名/删除走凭据版本及插件通知失效，内部接口要求回环+恒定时间密钥并清缓存/断连接；通知失败会警告，代码承认HTTP缓存可有最多30秒窗口。关闭连接不等远端正在运行的工具已停，须单独验。

#### 证据与依据

**依据 1 · 源码核查**：[src/auth.ts:127-161](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/auth.ts#L127-L161)

首次setup调用链。

<details>
<summary>查看原文（35行）</summary>

```text
    }
    // 注入特征拦截（setupKey 与 username 进系统前先查）
    assertNoSqlInjection(input.setupKey, 'setupKey');
    if (input.setupKey !== this.config.setupKey) {
      await this.db.audit('setup_failure', {
        username: input.username || null,
        ip: meta.ip,
        userAgent: meta.userAgent,
        detail: '预设密钥错误',
      });
      throw new AuthError('INVALID_SETUP_KEY', {}, 401);
    }
    const username = assertUsername(input.username);
    const password = assertPassword(input.password);

    const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    // 最终 check + insert 必须处于同一 SQLite 写事务，避免两个并发 setup 都创建 admin。
    if (this.db.setupInitialAdmin(username, hash) === null) {
      throw new AuthError('ALREADY_INITIALIZED', {}, 409);
    }
    await this.db.audit('setup_success', {
      username,
      ip: meta.ip,
      userAgent: meta.userAgent,
      detail: '平台初始化完成',
    });
  }

  /** 登录：用户名 + 密码 → JWT（含防暴力破解与审计） */
  async login(
    input: { username: string; password: string },
    meta: RequestMeta = {},
  ): Promise<{ token: string; username: string }> {
    // 输入长度上限：防止未认证请求用超长字符串消耗 HMAC/bcrypt CPU
    const username = (typeof input.username === 'string' ? input.username : '').trim().slice(0, 64);
```

</details>

**依据 2 · 源码核查**：[src/auth.ts:264-292](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/auth.ts#L264-L292)

JWT签发和算法白名单。

<details>
<summary>查看原文（29行）</summary>

```text
    const token = jwt.sign(
      { sub: String(user.id), username: user.username, cv: user.credential_version },
      this.config.jwtSecret,
      { expiresIn: TOKEN_TTL },
    );
    return { token, username: user.username };
  }

  /** 校验 JWT（Web 中间件用）；cv 为签入时的凭据版本，改密后旧 token 失效。
   *  exp 为 JWT 自身的到期时间（秒级 epoch，无则 undefined）——网关会话缓存
   *  的 TTL 必须与其取最小值，否则缓存命中会在 JWT 过期后额外接受最多 30 秒。 */
  verifyToken(token: string): { userId: number; username: string; cv: number; exp?: number } {
    try {
      // 算法白名单：只接受 HS256（对称密钥），拒绝 alg:none / RS→HS 混淆等变体
      const payload = jwt.verify(token, this.config.jwtSecret, { algorithms: ['HS256'] }) as jwt.JwtPayload;
      const cv = typeof payload.cv === 'number' ? payload.cv : 0;
      const exp = typeof payload.exp === 'number' && Number.isFinite(payload.exp) ? payload.exp : undefined;
      return { userId: Number(payload.sub), username: String(payload.username), cv, exp };
    } catch {
      throw new AuthError('INVALID_TOKEN', {}, 401);
    }
  }

  // ── 用户管理（dsh 设置页卡片调用） ────────────────────────────

  /** 验证主用户当前密码；不创建新会话，也不改变 credential_version。 */
  async verifyAdminPassword(caller: AuthedUser, password: string, meta: RequestMeta = {}): Promise<void> {
    const ip = meta.ip ?? 'unknown';
    const attempt = await this.db.getLoginAttempt(caller.username, `purge:${ip}`);
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3115-3174](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3115-L3174)

缓存、cv与内存吊销。

<details>
<summary>查看原文（60行）</summary>

```text
  >();
  const SESSION_CACHE_TTL_MS = 30_000;

  // F-04：登出吊销（内存黑名单）。JWT 无状态，登出只能靠网关侧短期黑名单
  // 使已登出 token 立即失效（TTL 与 JWT 有效期一致，到期自动清理）。
  // 改密/改名已有 credential_version 机制使旧 token 失效，此处只补登出路径。
  // 已知残余（容量权衡）：条目最长保留 12h，持有凭据的用户可反复登录/登出制造
  // 唯一 token 撑大该 Map（成功登录无速率限制）；不能超容量淘汰——未过期条目
  // 必须保持拒绝，否则已登出会话复活。后续可考虑 SQLite TTL 撤销表、随机会话
  // id、或对成功登录/登出加限速（见 PROCESS 步骤 41 残余清单）。
  const revokedTokens = new Map<string, number>();
  const TOKEN_TTL_MS = 12 * 3600 * 1000;

  function revokeToken(token: string): void {
    revokedTokens.set(token, Date.now() + TOKEN_TTL_MS);
    sessionCache.delete(token);
  }

  function isTokenRevoked(token: string): boolean {
    const expiresAt = revokedTokens.get(token);
    if (expiresAt === undefined) return false;
    if (expiresAt > Date.now()) return true;
    revokedTokens.delete(token);
    return false;
  }

  function sessionOf(req: Request): { userId: number; username: string } | null {
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    if (!token) return null;
    const now = Date.now();
    const hit = sessionCache.get(token);
    if (hit) {
      if (hit.expireAt > now) return hit.user;
      sessionCache.delete(token);
    }
    try {
      const user = auth.verifyToken(token);
      // F-04：登出后的 token 立即拒绝（不重新进入缓存）
      if (isTokenRevoked(token)) return null;
      // 用户被删除/重置/改密后旧会话必须失效（缓存有效期 30 秒内生效）
      // 按 sub（用户 ID）定位，而非按 token.username：否则用户改名后新建同名用户，
      // 旧 token 会以新用户身份（sub 仍是旧 ID）通过校验。ID 命中后仍比对用户名，
      // 确保被指向的用户确实是 token 签发时的那个身份。
      const row = db.getUserById(user.userId);
      if (row === null) return null;
      if (row.username !== user.username) return null;
      if (user.cv !== row.credential_version) return null;
      // 缓存 TTL 与 JWT 到期时间取最小值：否则刚过期就被缓存的 token 会在
      // 命中路径上绕过验签，额外存活最多 30 秒
      const expMs = user.exp !== undefined ? user.exp * 1000 : undefined;
      const cacheTtl =
        expMs !== undefined ? Math.min(SESSION_CACHE_TTL_MS, Math.max(0, expMs - now)) : SESSION_CACHE_TTL_MS;
      if (cacheTtl <= 0) return null; // JWT 已到期：不得进入缓存
      sessionCache.set(token, { user: { userId: user.userId, username: user.username }, expireAt: now + cacheTtl });
      return { userId: user.userId, username: user.username };
    } catch {
      return null;
    }
  }

```

</details>

**依据 4 · 源码核查**：[src/gateway.ts:3425-3455](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3425-L3455)

logout清cookie并关闭连接。

<details>
<summary>查看原文（31行）</summary>

```text
  app.get('/gateway/logout', (_req, res) => {
    res.status(405).type('html').send('405 Method Not Allowed');
  });
  app.post('/gateway/logout', (req, res) => {
    // 同站子域页面可借表单强制登出（SameSite=Lax 只挡跨站、不挡同站子域）：
    // 与网关写路由同口径做 Origin 主机校验，提交方与 Host 不一致时拒绝。
    if (!originHostMatches(req, configuredOriginHosts)) {
      res.status(403).type('text/plain').send('403 Forbidden');
      return;
    }
    // F-04：服务端吊销——登出的 token 立即失效（黑名单 12h），
    // 即使 Cookie 已被攻击者复制，该 token 也无法再通过认证门卫
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    // 必须在吊销前解析会话：revokeToken 会清 sessionCache，之后无法可靠定位旧 WS。
    const session = sessionOf(req);
    if (token) revokeToken(token);
    if (session !== null) {
      closeUserWebSocketClients(session.userId, 1008, 'Session ended');
      closeUserRemoteMuxClients(session.userId, 1008, 'Session ended');
    }
    // 清除会话 Cookie 时必须与写入时同样带 Secure：部分浏览器不允许无 Secure
    // 的 Set-Cookie 覆盖已存在的 Secure Cookie，否则登出后客户端仍持有旧会话。
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${requestIsSecure(req) ? '; Secure' : ''}`,
    );
    res.redirect(302, '/gateway/login');
  });

  // ── 内部接口：dsh 插件通知网关重载远程设置补丁 ───────────────
  // 仅限本机 dsh 插件调用：要求回环地址 + 恒定时间比对内部密钥
```

</details>

**依据 5 · 源码核查**：[src/gateway.ts:3490-3519](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3490-L3519)

内部失效认证及连接关闭。

<details>
<summary>查看原文（30行）</summary>

```text
  app.post('/gateway/internal/session-invalidate', express.json({ limit: '4kb' }), (req, res) => {
    const remoteIp = req.socket.remoteAddress ?? '';
    if (remoteIp !== '127.0.0.1' && remoteIp !== '::1' && remoteIp !== '::ffff:127.0.0.1') {
      res.status(403).json({ ok: false, error: 'forbidden' });
      return;
    }
    const secret = typeof req.headers['x-internal-secret'] === 'string' ? req.headers['x-internal-secret'] : '';
    const expected = config.internalSecret;
    const a = Buffer.from(secret);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      res.status(403).json({ ok: false, error: 'forbidden' });
      return;
    }
    const body = (req.body ?? {}) as Record<string, unknown>;
    const userId = typeof body.userId === 'number' && Number.isSafeInteger(body.userId) ? body.userId : null;
    if (userId !== null) {
      for (const [token, entry] of sessionCache) {
        if (entry.user.userId === userId) sessionCache.delete(token);
      }
      // 插件只会在改密/改名/删除已完成后调用此端点；旧 WS 的升级时身份必须
      // 同步失效，避免 HTTP 已 401 而持续订阅仍读取旧数据。
      closeUserWebSocketClients(userId, 1008, 'Credentials changed');
      closeUserRemoteMuxClients(userId, 1008, 'Credentials changed');
    }
    res.status(200).json({ ok: true });
  });

  // ── 内部接口：自动更新引擎（插件经内部通道调用） ───────
  // 仅限本机 dsh 插件调用（回环 + 恒定时间比对内部密钥）。action：
```

</details>

**依据 6 · 源码核查**：[src/plugin.ts:382-388](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/plugin.ts#L382-L388)

通知未确认的缓存窗口。

```text
/** 改密/改名/删除后通知网关清会话缓存；网关未确认时记告警（旧会话最多 30 秒内仍有效）。 */
async function invalidateGatewaySessions(cfg: PlatformConfig, userId: number): Promise<void> {
  const confirmed = await notifyGatewaySessionInvalidate(cfg, userId);
  if (!confirmed) {
    console.warn(`[dsh-passwords] 网关未确认会话缓存清除（旧会话最多 30 秒内仍有效，凭据版本校验兜底）: userId=${userId}`);
  }
}
```

#### 缺口

- 跨进程吊销、连接在途动作停止与setup事务内部未全量复现
  **影响**：不能认定即时强吊销所有副作用
  **进一步探讨**：保存旧token后重启/改密/断通知分别核HTTP、WS与在途工具

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · HTTP/WebSocket工作区会话授权如何覆盖？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

HTTP门卫从原始URL迭代解码、压重复斜杠再规范化，网关自有路由只准精确已知集；外部/internal桥接端点拒绝，非网关请求必须sessionOf并检查子用户封禁。资源授权不是仅允许目录：authorizedSubuserSessionRoot需会话快照、显式grant或自建所有权、未disabled、词法或canonical路径白名单且不属别的子用户；文件还须绑定仍授权会话根并拒敏感路径。这比只在菜单隐藏项目多一层服务端对象判断。

实际WS upgrade在proxy.ts独立注册，先规范化、拒网关/internal路径、校Origin、JWT用户/cv/封禁，再分类owner-only、SSH和动态插件路径；SSH需allow_ssh，已授权连接登记撤销集合。remote.mux物理连接内还须逐逻辑流检查，不能凭upgrade一次认证当后续所有端点有权。gateway给proxy共享grant、过滤器与epoch等引用，授权变更推进epoch使旧快照失去回写资格。

本轮核到HTTP门卫、会话根判断、WS upgrade与代表模型/沙盒分支，没有穷举四千余行proxy全部响应重写、全部mux逻辑流/子代理、第三方动态插件以及下载媒体端点。故只确认这些机制存在，不能确认任意插件或未来协议都安全；反代仍需禁止绕过网关直接访问DSH上游，网关不能约束已获服务器执行能力的恶意代码。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway.ts:3714-3755](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3714-L3755)

原始路径规范化。

<details>
<summary>查看原文（42行）</summary>

```text
  // ── 认证门卫：非 /gateway 请求必须带有效会话 ─────────────────
  // 路径先用 WHATWG URL 规范化（. / .. / %2e%2e 均被归一），再做前缀判断——
  // 否则 /gateway/../api/xxx 会绕过前缀检查直达上游（dsh 侧 new URL 同样
  // 会归一化该路径，等于未认证调用任意 RPC）。解析失败一律按未认证处理，绝不 500。
  //
  // F-03 补强：WHATWG URL 会折叠 %2e 但【不解码 %2f】，导致 /gateway/..%2fapi/…
  // 在门卫眼里仍以 /gateway/ 开头而被放行，上游解码 %2f 后路径变成 /gateway/../api/…
  // （不匹配 dsh 任何路由 → SPA fallback 200，未认证泄露应用外壳）。
  // 修复要点（复检定位）：
  //   1. 必须从【原始 req.url】取路径——第一次 new URL 归一化时
  //      /gateway//../ 的空段会把 .. 吞掉（WHATWG 语义），再用归一化后的
  //      pathname 二次处理就太晚了；
  //   2. 迭代解码（最多 3 轮）：覆盖 %2f、%252f（双重编码）等；
  //   3. 解码后压平重复斜杠再 new URL 归一化，使 ../ 能正确折叠。
  // 绝对形式 request-target（http://host/...）先解析出 host 再取 pathname。
  function gatePathOf(reqUrl: string): string {
    let rawPath: string;
    if (/^https?:\/\//i.test(reqUrl)) {
      try {
        rawPath = new URL(reqUrl).pathname;
      } catch {
        rawPath = reqUrl;
      }
    } else {
      rawPath = reqUrl.split('?')[0];
    }
    return normalizeDecodedPath(rawPath);
  }

  /** 迭代解码（最多 3 轮）+ 压平重复斜杠 + WHATWG 归一化；畸形编码保持原样 */
  function normalizeDecodedPath(rawPath: string): string {
    let decoded = rawPath;
    for (let i = 0; i < 3; i++) {
      let next: string;
      try {
        next = decodeURIComponent(decoded);
      } catch {
        break; // 畸形百分号编码：保留当前值
      }
      if (next === decoded) break; // 无更多可解
      decoded = next;
    }
```

</details>

**依据 2 · 源码核查**：[src/gateway.ts:3835-3910](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3835-L3910)

认证与子用户门卫。

<details>
<summary>查看原文（76行）</summary>

```text
      // 外部请求一律 404（loopback 校验被代理拓扑绕过，不能依赖插件侧防护）
      if (gatePath.startsWith('/api/dsh-passwords/internal/')) {
        res.status(404).json({ ok: false, error: 'not found' });
        return;
      }
      const user = sessionOf(req);
      if (!user) {
        // Issue #35 / 审计 P3：自动探针路径（favicon、apple-touch-icon、manifest、
        // robots 等）未认证时直接 204，不渲染也不重定向；其余路径照原样 302。
        if (ANONYMOUS_STATIC_PROBES.has(gatePath)) {
          res.status(204).end();
          return;
        }
        // 重定向兼容层：记录原始 URL，登录后跳回。根路径是默认落点，
        // 不在地址栏附带 next 参数（不把内部路由目标甩到公开 URL 上）；
        // 登录成功后 safeNext 缺省回首页。
        const original = req.originalUrl;
        const target = original === '/' ? '/gateway/login' : `/gateway/login?next=${encodeURIComponent(original)}`;
        res.redirect(302, target);
        return;
      }
      const row = db.getUserById(user.userId);
      if (!row) {
        if (ANONYMOUS_STATIC_PROBES.has(gatePath)) {
          res.status(204).end();
          return;
        }
        const original = req.originalUrl;
        const target = original === '/' ? '/gateway/login' : `/gateway/login?next=${encodeURIComponent(original)}`;
        res.redirect(302, target);
        return;
      }
      // 所有路径型授权必须使用与上游转发完全相同的规范化路径。若使用 WHATWG
      // 原始 pathname，`/api%2Fsession%2Fhistory` 会在此处躲过检查、却在转发时
      // 解码为真实敏感路由（C-1）。query 仍由 URL 只读解析。
      const parsed = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
      const requestPath = gatePath;
      // 自身插件的写操作必须同源：Sec-Fetch-Site 可被缺省/伪造，且 text/plain
      // 可避免 CORS 预检；浏览器提供 Origin 时严格与请求 Host 一致。跨源攻击的
      // 本质是跨主机（攻击者无法在受害者主机名上托管内容），因此只比主机:端口、
      // 不比协议——否则 README 支持的 nginx/caddy 终结 TLS 反代部署（网关收到
      // 明文 HTTP、req.protocol=http，而浏览器 Origin=https）会全部误判 403。
      // Host 只信直接对端：仅当对端是本机回环（受信本地反代）才采纳
      // X-Forwarded-Host，公网直连请求不能带伪造头绕过。
      if (
        ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) &&
        requestPath.startsWith('/api/dsh-passwords/') &&
        !requestPath.startsWith('/api/dsh-passwords/internal/') &&
        typeof req.headers.origin === 'string'
      ) {
        if (!originHostMatches(req, configuredOriginHosts)) {
          res.status(403).type('text/plain').send('403 Forbidden');
          return;
        }
      }
      // 记录所有登录用户（含主用户）的用户 id：供 session.create/fork 响应回调
      // 登记 sessionId→cwd 缓存与已登记 SSH 端点的 SSRF 校验使用；权限行仍只挂子用户
      (req as Req).dshpwUser = user.userId;
      (req as Req).dshpwUsername = row.username;
      (req as Req).dshpwIsAdmin = row.role === 'admin';
      if (row.role !== 'admin') {
        const perms = effectivePermissions(user.userId);
        const lang = langOf(req);
        if (perms.banned) {
          res.status(403).type('html').send(forbiddenPage(lang, t(lang, 'gw.banned')));
          return;
        }
        // ── alpha.2 交付物路由的对象级授权（changes.summary|diff|open）──────────
        // 这三个官方路由的坐标全部在 query（sessionId + seq [+ index]），而上游只用
        // sessionId 查会话、不校验归属：把它归入官方面（或加进白名单）等于让任何
        // 子用户读走别人的变更摘要/差异，甚至触发宿主应用的打开动作。因此这里做
        // 对象级授权（会话快照 + 持久化 grant + 逐会话关闭 + 白名单目录 + 所有权），
        // 通过后才在分类分支里放行转发；否则直接 403。
        const changesRoute = req.method === 'GET' || req.method === 'POST'
          ? CHANGES_ROUTE_RE.exec(requestPath)
          : null;
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:2530-2550](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L2530-L2550)

会话对象grant/目录/归属判断。

<details>
<summary>查看原文（21行）</summary>

```text
  function authorizedSubuserSessionRoot(userId: number, sessionId: unknown, perms: UserPermissionsRow): string | null {
    if (typeof sessionId !== 'string' || sessionId.length === 0 || sessionId.length > 200) return null;
    const sessionPath = userSessionAccess.get(userId)?.get(sessionId);
    if (sessionPath === undefined) return null;
    if (!db.hasUserSessionGrant(userId, sessionId) && !workspaceOwnedByUser(userId, sessionPath)) return null;
    if (perms.disabled_sessions.includes(sessionId)) return null;
    // 白名单与所有权都按「词法 or 真实路径」复核：快照里的 cwd 与 persisted 记录都
    // 可能以别名/大小写/junction 形态出现，只看一种口径要么误拒合法会话（realpath
    // 失败时 canonicalizePathBestEffort 回退为字符串归一，不会比词法更松懈），
    // 要么让别名形态的他人工作区逃过所有权判定（后者由 canonical 化的
    // workspaceOwnedByAnotherSubuser 兜住）。
    const canonicalSessionPath = canonicalizePathBestEffort(sessionPath);
    if (!folderAllowed(sessionPath, perms.allowed_folders) &&
        !folderAllowed(canonicalSessionPath, perms.allowed_folders)) return null;
    if (workspaceOwnedByAnotherSubuser(userId, sessionPath)) return null;
    return sessionPath;
  }
  /**
   * 把一个只剩绝对路径的官方接口参数（/api/file 的 ?path=）绑回租户工作区：
   * 必须落在某个「仍然授权的会话工作区根」内，且在文件夹白名单内、不伸进其他
   * 子用户创建的工作区子树。只在命中包含关系时才查 grant，避免逐请求全表扫描。
```

</details>

**依据 4 · 源码核查**：[src/proxy.ts:3316-3410](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/proxy.ts#L3316-L3410)

实际WS升级入口及路径分类。

<details>
<summary>查看原文（95行）</summary>

```text
  // ── WebSocket upgrade 代理（原 gateway.ts L5976-L6670）───────────────────
  function attachUpgrade(server: UpgradeCapableServer): void {
  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    // F-03 同口径：网关前缀判定与转发路径都用「原始路径迭代解码 + 压平
    // 斜杠 + WHATWG 归一化」，与 HTTP 代理保持一致，杜绝 %2f/%2e 变体
    // 在 WS 升级请求里漂移（HTTP 侧已修，这里补齐同口径）。
    const rawPath = (req.url ?? '/').split('?')[0];
    const gatePath = normalizeDecodedPath(rawPath);
    if (gatePath === '/gateway' || gatePath.startsWith('/gateway/')) {
      socket.destroy();
      return;
    }
    const queryIndex = (req.url ?? '').indexOf('?');
    const fwdPath = gatePath + (queryIndex >= 0 ? stripGatewayAuthQuery(req.url ?? '/', gatePath) : '');
    // WebSocket 同样是浏览器携带 Cookie 的状态变更通道，先拒绝跨源升级。
    if (!originHostMatches(req)) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    // 认证检查（复用 Cookie；与 HTTP 侧一致：校验 cv + banned + 登出吊销）
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    let authed = false;
    let authUserId: number | null = null;
    let userRole: 'admin' | 'user' | null = null;
    if (token && !isTokenRevoked(token)) {
      try {
        const user = auth.verifyToken(token);
        const row = db.getUserById(user.userId);
        if (row !== null && row.username === user.username && user.cv === row.credential_version) {
          const perms = effectivePermissions(row.id);
          if (!perms.banned) {
            authed = true;
            authUserId = row.id;
            userRole = row.role === 'admin' ? 'admin' : 'user';
          }
        }
      } catch {
        authed = false;
      }
    }
    if (!authed) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      socket.destroy();
      return;
    }

    // P1-1：internal 端点不接受外部 WS 升级（仅限网关→dsh 本机 HTTP 调用）
    if (gatePath.startsWith('/api/dsh-passwords/internal/')) {
      socket.write('HTTP/1.1 404 Not Found\r\n\r\n');
      socket.destroy();
      return;
    }
    // 与 HTTP 侧一致：owner: 登记一律拒绝；ssh 登记与官方 terminal 共用 allowSsh；
    // 已加载普通插件的 WS 仍须命中运行时清单。
    const wsPathClass = classifySubuserPath(gatePath, {
      endpointRules: getEndpointRules(),
      transport: 'ws',
      dynamicManifest: getDynamicPluginManifest(),
    });

    const dynamicPluginPathPassed = userRole === 'user' && !isSubuserBlockedApiPath(gatePath) && (
      dynamicPluginApiPath(gatePath, getDynamicPluginManifest()) ||
      dynamicPluginRootPath(gatePath, getDynamicPluginManifest())
    );
    let userSshEndpointPassed = false;
    if (userRole === 'user') {
      // owner: 规则与跨 transport 的 SSH 登记一律拒绝（两把钥匙之外的能力不放行）。
      if (wsPathClass === 'owner-only' ||
          (wsPathClass !== 'ssh' && endpointAllowed(gatePath, getEndpointRules(), { capability: 'ssh' }))) {
        socket.end('HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\nConnection: close\r\n\r\n');
        return;
      }
      if (wsPathClass === 'ssh') {
        const perms = authUserId === null ? null : effectivePermissions(authUserId);
        if (perms === null || !perms.allow_ssh) {
          socket.end('HTTP/1.1 403 Forbidden\r\nContent-Length: 0\r\nConnection: close\r\n\r\n');
          return;
        }
        userSshEndpointPassed = true;
      }
    }
    if (dynamicPluginPathPassed || userSshEndpointPassed) {
      // SSH 登记或宿主插件清单授权建立后纳入撤销集合：运行时收紧时立即断开旧连接。
      registryAuthorizedSockets.add(socket);
      socket.once('close', () => { registryAuthorizedSockets.delete(socket); });
    }
    // RC.1's Remote streams share one physical /api/remote.mux carrier.
    // Keep the administrator path compatible with registered plugin streams;
    // subusers still require the resource-aware filtering below.
    if (gatePath === '/api/remote.mux') {
      const isSubuser = userRole === 'user';
      const wsServer = new WebSocket.WebSocketServer({ noServer: true, maxPayload: REMOTE_MUX_MAX_PAYLOAD_BYTES });
      wsServer.handleUpgrade(req, socket, head, (client: any) => {
        const endpointUrl = `${upstream.protocol === 'https:' ? 'wss' : 'ws'}://${upstreamAuthority}${fwdPath}`;
```

</details>

**依据 5 · 源码核查**：[src/gateway.ts:1834-1860](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L1834-L1860)

授权epoch失效及旧状态回写限制。

<details>
<summary>查看原文（27行）</summary>

```text
    return true;
  };
  /** 授权变更后失效内存快照：先推进 epoch（旧请求/旧 baseline 随即失去回写资格），
   *  再清空快照，等待新 baseline 重建。 */
  const invalidateUserSessionAccess = (userId: number): void => {
    bumpUserAccessEpoch(userId);
    userSessionAccess.delete(userId);
    pendingCreatedSessions.delete(userId);
    userWorkspaceIds.delete(userId);
    userWorkspacePaths.delete(userId);
    userArchivedSessionIds.delete(userId);
  };
  /**
   * 权限行已经提交、但后续还要 await 上游沙盒收紧时，立即让在途 create/fork
   * 响应失去回写 grant/access 的资格。刻意不清快照或关闭 mux：待沙盒定向撤销
   * 结束后仍由 invalidateUserSessionAccess 统一刷新，避免窗口内 baseline 读到未撤销 grant。
   */
  const fenceUserAccessEpoch = (userId: number): void => {
    bumpUserAccessEpoch(userId);
  };
  const replaceUserWorkspacePaths = (userId: number, paths: Map<string, string>, epoch: number, order = 0): void => {
    if (epoch < userAccessEpochFor(userId)) return;
    if (order !== 0 && order < (userAccessListOrder.get(userId) ?? 0)) return;
    userWorkspacePaths.set(userId, paths);
    userWorkspaceIds.set(userId, new Set(paths.keys()));
    notifyUserSessionAccessWaiters(userId);
  };
```

</details>

#### 缺口

- 代理响应/全部mux端点和第三方插件未穷尽；未验端口拓扑
  **影响**：不是可直接用于不可信租户的安全认证
  **进一步探讨**：列完整入口矩阵后逐端点做A/B越权、撤销、编码变形与直连测试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配额、模型和文件/终端限制依什么执行？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

token不是网关从模型供应商权威计费流核账：客户端TokenReporter从宿主tokenUsage取uncachedInput+output，忽略cacheRead/cacheWrite，首样本仅做基线、15秒POST差值；失败回滚pending但页面卸载补发仍可能失败。admin端只验证已登录、5秒节流和tokens数值区间，再给本人addTokens，没有服务端比对供应商账单。因而恶意/非标准客户端不报或报0可少计，正常重挂载也可能漏基线；此配额是协作计量提醒，不能当财务结算或不可信用户硬预算。

HTTP后续非静态非轮询请求按当日active_seconds及hourly_tokens阈值拒绝；这不撤销已开始的生成，不是逐token预算预留。模型限制在proxy的selectModel正向检查provider/model，其他请求借记录的有效模型判定，取不到拒绝；create允许非空白名单先建再选模型，不等默认模型已许可。受限沙盒会在转发前钉到授权档位并await内部回执，部分await后再读权限/epoch，降低收紧竞态；仍是共享Host的应用策略，不是独立容器边界。文件、上传、SSH等开关必须连同实际路由与第三方扩展单独验收，本轮未穷举全部出站通道。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/token.tsx:1-98](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/client/token.tsx#L1-L98)

客户端投影、基线、15秒差值与失败恢复。

<details>
<summary>查看原文（98行）</summary>

```text
// 不可见 token 上报组件：挂在 dsh 会话作用域槽 `conversation.composer.dock`。
// 该槽的标准 props 里带有 `useProjection`（dsh 的第五个框架 hook seat），
// 读 `tokenUsage` 投影（宿主 token-meter 计算的"全日志 provider 计费"）。
//
// ⚠️ 计费口径：只计 `uncachedInputTokens + outputTokens`。
// 实测 dsh 的 tokenUsage 投影里 `cacheReadTokens` 是【每个 step 的缓存累计量】
// 而非增量，而投影的 last-sample-replacing 聚合把它当增量逐 step 累加，
// 导致 cacheRead 虚高 60 倍（一个会话报出 1000 万+）。
// 因此 cacheRead/cacheWrite 不计入配额，避免子用户额度被系统性虚耗。
//
// 设计要点：投影值是【会话内累计值】而非增量。这里记录"上次观测到的累计值"，
// 只把差值累进 pending，再按固定间隔 POST 到密码门 `/gateway/api/usage/report`，
// 由网关按小时窗口累计后做子用户每小时 token 配额判定。首次观测值只作为基线
// 不计费（避免重开会话/重挂载重复计费）。组件渲染 null，不影响 dsh 界面。
import { useEffect, useRef } from 'react';
import type { UseProjection } from '@deepseek-ai/dsh-api-session-controller/client';

interface TokenUsageProjection {
  uncachedInputTokens?: number;
  outputTokens?: number;
  cacheReadTokens?: number;
  cacheWriteTokens?: number;
}

const REPORT_INTERVAL_MS = 15000;

export function TokenReporter({ useProjection }: { useProjection: UseProjection }) {
  // 槽未注入该 prop（dsh 版本差异/槽位变化）时 read 可能为 undefined：
  // 守卫后静默不启用，避免 read() 直接抛 TypeError 崩掉整个 dock 槽组件
  const read = useProjection as unknown as ((key: string) => unknown) | undefined;
  const usage =
    typeof read === 'function' ? (read('tokenUsage') as TokenUsageProjection | undefined) : undefined;

  const lastTotal = useRef<number | null>(null);
  const pending = useRef(0);
  const inFlight = useRef(false);
  const inFlightP = useRef<Promise<void> | null>(null);

  // 累计投影增量
  useEffect(() => {
    if (!usage) return;
    // 只计真实消耗（uncached 输入 + 输出）；cacheRead 因 dsh 投影虚高不计入
    const total = (usage.uncachedInputTokens ?? 0) + (usage.outputTokens ?? 0);
    if (lastTotal.current === null) {
      lastTotal.current = total;
      return;
    }
    const delta = total - lastTotal.current;
    if (delta > 0) pending.current += delta;
    lastTotal.current = total;
  }, [usage]);

  // 定时 flush；卸载时做最后一次 flush（会话切换不丢已产生的增量）
  useEffect(() => {
    const flush = () => {
      if (inFlight.current) return; // 上一轮请求未结束：下个周期再试，避免并发重复上报
      const n = pending.current;
      if (n <= 0) return;
      pending.current = 0;
      inFlight.current = true;
      const p = fetch('/gateway/api/usage/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tokens: n }),
      })
        .then((res) => {
          // 只有明确成功才算已上报；4xx/5xx 回滚到 pending 下个周期重试
          if (!res.ok) pending.current += n;
        })
        .catch(() => {
          pending.current += n; // 网络失败回滚，下个周期重试
        })
        .finally(() => {
          inFlight.current = false;
          inFlightP.current = null;
        });
      inFlightP.current = p;
    };
    const timer = window.setInterval(flush, REPORT_INTERVAL_MS);
    return () => {
      window.clearInterval(timer);
      flush();
      // 卸载时若上一轮仍 in-flight，等它完成后把期间积压的 pending 补发一次
      // （否则这部分增量直接丢失，配额少计费——注释承诺“卸载不丢增量”才真正成立）
      const p = inFlightP.current;
      if (p) {
        void p.finally(() => {
          const n = pending.current;
          if (n <= 0) return;
          pending.current = 0;
          void fetch('/gateway/api/usage/report', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ tokens: n }),
          }).catch(() => {
            // 页面即将销毁，无法再重试：失败仅影响本次计费，不再回滚
          });
        });
```

</details>

**依据 2 · 源码核查**：[src/admin.ts:2281-2304](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/admin.ts#L2281-L2304)

上报仅数值验证并记本人token。

<details>
<summary>查看原文（24行）</summary>

```text
  app.post('/gateway/api/usage/report', jsonBody, (req, res) => {
    const me = apiAuth(req, res);
    if (!me) return;
    const now = Date.now();
    const last = usageReportThrottle.get(me.userId) ?? 0;
    if (now - last < 5000) {
      res.status(429).json({ ok: false, code: 'RATE_LIMITED', error: '上报过于频繁' });
      return;
    }
    usageReportThrottle.set(me.userId, now);
    const body = (req.body ?? {}) as Record<string, unknown>;
    const tokens = Number(body.tokens);
    if (!Number.isFinite(tokens) || tokens < 0 || tokens > 100_000_000) {
      res.status(400).json({ ok: false, code: 'INVALID', error: 'tokens 无效' });
      return;
    }
    const rounded = Math.round(tokens);
    if (rounded <= 0) {
      res.json({ ok: true });
      return;
    }
    db.addTokens(me.userId, todayLocal(), rounded, new Date().toISOString());
    res.json({ ok: true });
  });
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:4175-4197](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L4175-L4197)

后续请求配额阈值门禁。

<details>
<summary>查看原文（23行）</summary>

```text
          }
          res.status(403).type('html').send(forbiddenPage(lang, t(lang, 'gw.workspaceDenied')));
          return;
        }
        if (!isStaticAsset(requestPath) && !isPollingRequest(requestPath)) {
          // 配额计时从子用户“说第一句话”（发消息锚点）才开始：
          // 未使用过的子用户（无当日记录且非锚点请求）不创建记录、不受配额限制
          const day = todayLocal();
          if (db.getUsage(user.userId, day) !== null || isUsageAnchorRequest(requestPath)) {
            const usage = touchUsageThrottled(user.userId);
            if (usage) {
              if (perms.daily_minutes_limit !== null && usage.active_seconds >= perms.daily_minutes_limit * 60) {
                res.status(403).type('html').send(forbiddenPage(lang, t(lang, 'gw.timeLimit')));
                return;
              }
              if (perms.hourly_token_limit !== null && usage.hourly_tokens >= perms.hourly_token_limit) {
                res.status(403).type('html').send(forbiddenPage(lang, t(lang, 'gw.tokenLimit')));
                return;
              }
            }
          }
        }
        // 附上权限，供后续文件夹限制中间件 / 代理 token 计量使用
```

</details>

**依据 4 · 源码核查**：[src/proxy.ts:2484-2515](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/proxy.ts#L2484-L2515)

有效模型门禁和create例外。

<details>
<summary>查看原文（32行）</summary>

```text
        // ── 模型白名单（allowed_models）判定 ──
        // 官方这些 RPC 都无法只靠请求体判定真实模型（create/fork/prompt 没有模型字段），
        // 所以：selectModel 对请求体里的 {provider, model} 正向校验；其余用网关记录的会话
        // 有效模型（官方 modelSelection 投影 / selectModel 结果 / Host 默认）再校验，拿不到
        // 就 fail-closed。受限用户创建的会话记录为 'default'（Host 共享默认），fork 新建会话
        // 同理（DSH fork 用 agentDefaultModel 而不是源会话模型，源模型与默认模型都要判）。
        // 判定只依赖 bodyObj/proxyPath 与传入的允许列表；reqAs 状态写入留在原始调用点。
        // 转发前门禁与沙盒 await 之后的复核共用本函数，避免两处逻辑漂移；null = 不限。
        const modelGateAllows = (allowed: readonly string[] | null): boolean => {
          if (allowed === null) return true;
          if (/^\/api\/session[.\/]selectModel$/.test(proxyPath)) {
            // 模型字段只从官方 wire 位置读取：有 ClientConnection envelope 时只看
            // args.request（DSH 同源解码）；否则兼容直接顶层字段的调用方。绝不允许顶层
            // 伪字段在 envelope 请求里“洗白”一个不同模型。缺字段/格式非法同样拒绝
            // （不能只靠上游 resolveCallConfig 报错）。
            const requestEnvelope = clientConnectionArgs(bodyObj);
            const requestPayload = rpcRequestPayload(bodyObj);
            const selection = modelSelectionFrom(requestPayload) ??
              (requestEnvelope === null ? modelSelectionFrom(bodyObj) : null);
            return selection !== null && modelChoiceVerdict(allowed, selection).ok;
          }
          if (/^\/api\/session[.\/]create$/.test(proxyPath)) {
            // create 不带模型：新会话用 Host 共享默认，默认不在白名单仍允许创建（客户端拿到
            // 过滤后的 modelCatalog 后可另选允许模型；prompt 会在模型未收敛时 fail-closed）。
            // 唯一提前拒绝：白名单为空（[] = 禁止全部），建了也永远用不了。
            return allowedModelSet(allowed)?.size !== 0;
          }
          // 用协议感知的会话地址解析（与所有权校验同源）：只认官方 RPC 的
          // request/args/address/sessionId 结构，不扫描请求体里的任意字段。
          const authorized = collectAuthorizedSessionIds(bodyObj);
          const sessionIds = authorized === null ? [] : [...authorized];
          if (sessionIds.length === 0) return false;
```

</details>

**依据 5 · 源码核查**：[src/proxy.ts:3170-3195](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/proxy.ts#L3170-L3195)

沙盒await与当前权限复核。

<details>
<summary>查看原文（26行）</summary>

```text

        // ── 受限子用户执行期沙盒确认：一次 run 被接纳前再夹一次档位 ──────────
        // 所有权校验已保证这些会话在本用户授权快照内；此处只负责把会话 log 里的
        // sandbox/mode 钉到授权档位。失败（内部接口不可用/会话不再活）一律 fail-closed：
        // 绝不把未确认档位的会话交给子用户跑。
        if (needsSandboxRunCheck) {
          const authorizedSessionIds = collectAuthorizedSessionIds(bodyObj);
          const runSessionIds = authorizedSessionIds === null ? [] : [...authorizedSessionIds];
          if (runSessionIds.length === 0) {
            upstreamReq.destroy();
            res.status(403).type('html').send(forbiddenPage(lang, t(lang, 'gw.folderDenied')));
            return;
          }
          const snapshotMode = reqAs.dshpwPerms!.sandbox_mode;
          const currentMode = db.getPermissions(reqAs.dshpwUser!)?.sandbox_mode ?? null;
          const runSandboxMode = strictestSandboxMode(snapshotMode, currentMode);
          if (runSandboxMode !== null) {
            for (const runSessionId of runSessionIds) {
              if (!(await applySandboxToSession(runSessionId, runSandboxMode))) {
                upstreamReq.destroy();
                if (!res.headersSent) res.status(502).type('text/plain').send('502 Sandbox enforcement failed');
                return;
              }
            }
          }
          if (res.headersSent || res.writableEnded || res.destroyed) return;
```

</details>

#### 缺口

- 供应商核账、全部WS配额执行与在途资源强停未知
  **影响**：不能承诺严格成本上限/完整通道封闭
  **进一步探讨**：用禁报告客户端、长生成跨阈值、多连接及撤销并发核对供应商账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署、补丁、持久状态和退出的条件成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

不是装一个界面包即可上线。固定2.7.8声明Node ^22.19或>=24，DSH版本门禁>=0.2.1-alpha.1 <0.2.2-0，Docker默认alpha.2；文档明确门禁范围不等逐版本实测。宿主安装器会编译、注册、修改DSH补丁并生成密钥；Docker持久卷分别保存DSH_HOME和平台.env/DB。自动TLS还需可解析公网域名与80/443，Docker通常外层反代保Host及WS；只绑定本地发布端口或SSH转发才是文档本地试用拓扑，不能直接把共享Host端口全公开。

SQLite用户密码是bcrypt，字段加密是随机IV AES-256-GCM，HMAC lookup与加密键从主密钥域分离；不保护所有数据，留言、部分权限/工作区路径仍不在该字段范围。MCP_DB_ENC_KEY缺省可从setupKey派生，无自动迁移，丢失或直接换键会使旧数据无法解密。备份必须保DB与匹配.env但分开保护，不把“加密”当可随意拷贝或安全共享凭据。

首次投入是版本/补丁兼容、端口与账号负向验收和备份演练；持续有网关/SQLite/WS、日志、证书、模型供应商与服务器费用，金额/工时均未知。升级可能改Host与配置，不能把设置页更新当零风险。文档卸载只移web profile link/bundle并回滚受管补丁，保留安装目录/DB/.env/证书，需重启；容器应停止但保卷，永久删卷是另一个不可恢复动作。本轮未执行安装/更新/卸载，也未全读更新事务，不能确认回滚可靠性。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-140](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L84-L140)

具体版本、部署拓扑、安装器副作用。

<details>
<summary>查看原文（57行）</summary>

````text

### 前置条件

- **Docker**：需要 Docker Engine 或 Docker Desktop 和一个 DeepSeek API key；镜像内置 DSH，不需要先在宿主机安装 Node.js 或 dsh。
- **宿主机**：运行环境需要 Node.js 22.19+（22.x）或 24+、可正常运行的 dsh、git 与 pnpm；一键安装器会检查依赖并按需安装，手动注册插件需要 pnpm。
- **DSH 版本**：版本门禁接受 `>=0.2.1-alpha.1 <0.2.2-0`，当前开发依赖与 Docker 默认运行时锁定 `0.2.1-alpha.2`。通过版本门禁不等于范围内每个版本都已实测，详见[版本兼容](#版本兼容)。

当前发布版本为 `2.7.8`，Docker 镜像内置 DSH `0.2.1-alpha.2`；源码检出以 `package.json` 为准。

### 推荐：Docker 本地试用

先启动容器，再通过浏览器创建主用户。以下多行命令适用于 bash，请将两个密钥占位值替换为自己的值：

```bash
docker run -d \
  --name dsh-passwords \
  --restart unless-stopped \
  -e DEEPSEEK_API_KEY=sk-你的key \
  -e SETUP_KEY=自己设定的强随机串 \
  -p 127.0.0.1:3088:3088 \
  -v dsh-home:/data/dsh \
  -v dsh-passwords-state:/data/dsh-passwords \
  skywalker237234/dsh-passwords:2.7.8
```

Windows PowerShell 可使用同一条命令的一行形式：

```powershell
docker run -d --name dsh-passwords --restart unless-stopped -e "DEEPSEEK_API_KEY=sk-你的key" -e "SETUP_KEY=自己设定的强随机串" -p 127.0.0.1:3088:3088 -v dsh-home:/data/dsh -v dsh-passwords-state:/data/dsh-passwords skywalker237234/dsh-passwords:2.7.8
```

在**运行 Docker 的机器上**打开 `http://127.0.0.1:3088`，输入你设置的 `SETUP_KEY` 创建主用户，此后使用账号密码登录。这个地址只在 Docker 宿主机本机可访问；若容器运行在远程服务器上，请通过 SSH 端口转发访问，或配置 nginx / Caddy 的 HTTPS 反代。

省略 `-e SETUP_KEY` 时，容器会生成随机密钥；首次配置前用下面的命令读取，配置成功后该文件自动删除：

```bash
docker exec dsh-passwords cat /data/dsh-passwords/setup-key.txt
```

新数据卷首次初始化会把传入的 `SETUP_KEY` 写入卷内 `.env`；改变该环境变量不会重建已有账号，Docker 运行时仍按下方的环境变量优先级取值。容器默认监听 `0.0.0.0:3088`，上面的端口映射只向宿主机回环地址发布；公网 HTTPS 由外层反代提供。

`2.7.8` 镜像内置 DSH `0.2.1-alpha.2`，验收记录见 [v2.7.8 发布说明](https://github.com/slywalker2006/dsh-passwords/releases/tag/v2.7.8)。部署后确认 `/gateway/healthz`、`/gateway/readyz` 返回 `ok:true`，并实际登录验证子账号授权；健康检查不能代替权限验收。

<details>
<summary><strong>Docker 进阶配置与数据目录</strong></summary>

- 自定义端口、域名或第三方端点时，可复制 `docker/.env.example` 为 `docker/.env`，通过 `--env-file docker/.env` 传入。Compose 可使用 `docker compose --env-file docker/.env -f docker/docker-compose.yml up -d`。
- Docker 使用容器专用模板。根目录 `.env.example` 用于宿主安装，其端口、TLS 与数据库路径默认值不同，不能直接作为容器的 `--env-file`。
- 公网反代时建议设置 `MCP_GATEWAY_PUBLIC_HOST` 为实际访问的域名；外层反代需要保留外部 Host 并支持 WebSocket。
- `dsh-home` 保存 DSH profile；`dsh-passwords-state` 保存 `.env`、数据库与相关状态。两个卷应持久保留，清理方式见[卸载](#卸载)。
- 分容器部署时给 dsh 容器加 `MCP_DSH_PATCH_ALLOW_BIND_ALL=1`；DSH `0.2.1-alpha.2` 的 `dsh-web-app` 仍需要该补丁才能绑定 `0.0.0.0`。

</details>

### 宿主机安装

安装器会完成依赖安装、编译、生成或补齐缺失密钥、注册插件与应用补丁，并沿用已有配置。以下入口任选一个；不要另外执行目录网站可能提供的 `dsh plugin add`，本项目需要安装器或手动注册脚本精确注册。
````

</details>

**依据 2 · 源码核查**：[src/encrypt.ts:25-62](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/encrypt.ts#L25-L62)

字段密钥、加密与失败行为。

<details>
<summary>查看原文（38行）</summary>

```text
}

export function createFieldCrypto(dbEncKey: string, setupKey: string): FieldCrypto {
  const master = dbEncKey || setupKey;
  if (!master) {
    // 纵深防御：主密钥为空时“加密”退化为可预测密钥（等于没加密）。
    // 正常入口（cli/plugin）都强制 SETUP_KEY 非空，这里兜底防未来新增入口漏拦。
    throw new Error('字段加密主密钥为空：请配置 SETUP_KEY 或 MCP_DB_ENC_KEY');
  }
  // 域分离：两个子密钥互不通用（HMAC 密钥即使泄露也无法解密字段数据）
  const fieldKey = createHash('sha256').update('dsh-field:' + master).digest();
  const lookupKey = createHash('sha256').update('dsh-lookup:' + master).digest();

  function encrypt(plain: string | null): string | null {
    if (plain === null) return null;
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', fieldKey, iv);
    const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return VERSION + Buffer.concat([iv, tag, ct]).toString('base64');
  }

  function decrypt(cipher: string | null): string | null {
    if (cipher === null) return null;
    if (!cipher.startsWith(VERSION)) return cipher; // 旧明文数据：原样返回（迁移前兼容）
    try {
      const buf = Buffer.from(cipher.slice(VERSION.length), 'base64');
      const iv = buf.subarray(0, 12);
      const tag = buf.subarray(12, 28);
      const ct = buf.subarray(28);
      const d = createDecipheriv('aes-256-gcm', fieldKey, iv);
      d.setAuthTag(tag);
      return Buffer.concat([d.update(ct), d.final()]).toString('utf8');
    } catch {
      // 密钥不匹配/数据损坏：标记而不是抛出（审计读取不阻断主流程）
      return '⟨无法解密⟩';
    }
  }
```

</details>

**依据 3 · 作者声明**：[README.md:195-209](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L195-L209)

卸载保留及永久删数据边界。

<details>
<summary>查看原文（15行）</summary>

````text
## 卸载

宿主机安装可在 dsh-passwords 安装目录执行：

```bash
node dist/cli.js uninstall
# 全局 npm 安装也可直接执行：
dsh-passwords uninstall
```

该命令只从 DSH web profile 移除 `dsh-passwords` 的 link 与 bundle，并回滚本插件管理的 dsh 补丁；其他插件和 bundle 会保留。完成后按提示重启 `dsh-web`。

卸载不会删除安装目录、`.env`、数据库、TLS/ACME 证书或其他插件。profile 依赖重建或补丁回滚失败时会恢复原 profile，避免留下半卸载状态。Docker 部署请按所用 Compose 或容器编排停止并移除容器；不要删除命名卷，除非也要永久清除数据。

Docker 内的“保命技能”不会自删容器。确需永久清除所有容器数据时，Compose 可执行 `docker compose down -v`；上面的 `docker run` 部署可先执行 `docker rm -f dsh-passwords`，再执行 `docker volume rm dsh-home dsh-passwords-state`。这些操作会删除数据卷，执行前请备份。
````

</details>

**依据 4 · 作者声明**：[README.md:362-375](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L362-L375)

未加密范围与无密钥迁移。

<details>
<summary>查看原文（14行）</summary>

```text

<details>
<summary><strong>数据库文件泄露是否有风险</strong></summary>

仍有风险。密码保存为 bcrypt 哈希，用户名及审计的 IP、User-Agent、详情等字段加密；留言正文、部分权限配置和工作区路径等内容不属于这项字段加密保护。密码哈希也可能被离线猜测。请分别保护数据库和 `.env` 密钥，并在备份时保留相匹配的版本。

</details>

<details>
<summary><strong>能否更换 MCP_DB_ENC_KEY</strong></summary>

当前没有自动密钥迁移功能，不能直接替换生效的密钥，否则历史加密字段将无法解密。手动配置且尚未完成首次配置时，留空的加密主密钥来自 `SETUP_KEY`，此时也不要直接更换 `SETUP_KEY`。

</details>
```

</details>

#### 缺口

- 补丁/更新全部事务和真实Docker/宿主兼容未验
  **影响**：运维恢复负担不能当低成本成熟方案
  **进一步探讨**：可丢弃实例先备份恢复、失败升级和卸载，核原DSH配置与认证拓扑

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可借鉴什么机制，假设如何证伪？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可借鉴的是HTTP/WS共用资源授权函数及失效epoch、运行时端点分类、子用户新建默认deny、权限收紧后断订阅与await沙盒回执。这些机制应按具体协议验证，而不是根据安全功能数量加分。

未实现方向是“服务器权威预算与持久吊销收据”：为登录会话分配持久session id/credential generation，注销写持久撤销；模型调用入口先预留预算、供应商结果幂等结算，UNKNOWN结果保留占用直到核对。增量针对当前内存revokedTokens与客户端计数；不应额外长期保存明文token或敏感消息。最小对照包括登出后网关重启、丢供应商ACK、客户端停报告、并发跨额度、撤销时旧mux与新请求交错；成功需无被撤销读取、无重复结算且未知不自动放行。若账单/用户等待变差、服务端仍有绕行入口或持久状态带来新泄露，则假设不支持，不能计入已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/gateway.ts:3115-3174](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3115-L3174)

内存吊销与缓存是改进参照。

<details>
<summary>查看原文（60行）</summary>

```text
  >();
  const SESSION_CACHE_TTL_MS = 30_000;

  // F-04：登出吊销（内存黑名单）。JWT 无状态，登出只能靠网关侧短期黑名单
  // 使已登出 token 立即失效（TTL 与 JWT 有效期一致，到期自动清理）。
  // 改密/改名已有 credential_version 机制使旧 token 失效，此处只补登出路径。
  // 已知残余（容量权衡）：条目最长保留 12h，持有凭据的用户可反复登录/登出制造
  // 唯一 token 撑大该 Map（成功登录无速率限制）；不能超容量淘汰——未过期条目
  // 必须保持拒绝，否则已登出会话复活。后续可考虑 SQLite TTL 撤销表、随机会话
  // id、或对成功登录/登出加限速（见 PROCESS 步骤 41 残余清单）。
  const revokedTokens = new Map<string, number>();
  const TOKEN_TTL_MS = 12 * 3600 * 1000;

  function revokeToken(token: string): void {
    revokedTokens.set(token, Date.now() + TOKEN_TTL_MS);
    sessionCache.delete(token);
  }

  function isTokenRevoked(token: string): boolean {
    const expiresAt = revokedTokens.get(token);
    if (expiresAt === undefined) return false;
    if (expiresAt > Date.now()) return true;
    revokedTokens.delete(token);
    return false;
  }

  function sessionOf(req: Request): { userId: number; username: string } | null {
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    if (!token) return null;
    const now = Date.now();
    const hit = sessionCache.get(token);
    if (hit) {
      if (hit.expireAt > now) return hit.user;
      sessionCache.delete(token);
    }
    try {
      const user = auth.verifyToken(token);
      // F-04：登出后的 token 立即拒绝（不重新进入缓存）
      if (isTokenRevoked(token)) return null;
      // 用户被删除/重置/改密后旧会话必须失效（缓存有效期 30 秒内生效）
      // 按 sub（用户 ID）定位，而非按 token.username：否则用户改名后新建同名用户，
      // 旧 token 会以新用户身份（sub 仍是旧 ID）通过校验。ID 命中后仍比对用户名，
      // 确保被指向的用户确实是 token 签发时的那个身份。
      const row = db.getUserById(user.userId);
      if (row === null) return null;
      if (row.username !== user.username) return null;
      if (user.cv !== row.credential_version) return null;
      // 缓存 TTL 与 JWT 到期时间取最小值：否则刚过期就被缓存的 token 会在
      // 命中路径上绕过验签，额外存活最多 30 秒
      const expMs = user.exp !== undefined ? user.exp * 1000 : undefined;
      const cacheTtl =
        expMs !== undefined ? Math.min(SESSION_CACHE_TTL_MS, Math.max(0, expMs - now)) : SESSION_CACHE_TTL_MS;
      if (cacheTtl <= 0) return null; // JWT 已到期：不得进入缓存
      sessionCache.set(token, { user: { userId: user.userId, username: user.username }, expireAt: now + cacheTtl });
      return { userId: user.userId, username: user.username };
    } catch {
      return null;
    }
  }

```

</details>

**依据 2 · 源码核查**：[src/client/token.tsx:35-67](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/client/token.tsx#L35-L67)

客户端增量上报是预算参照。

<details>
<summary>查看原文（33行）</summary>

```text
  const pending = useRef(0);
  const inFlight = useRef(false);
  const inFlightP = useRef<Promise<void> | null>(null);

  // 累计投影增量
  useEffect(() => {
    if (!usage) return;
    // 只计真实消耗（uncached 输入 + 输出）；cacheRead 因 dsh 投影虚高不计入
    const total = (usage.uncachedInputTokens ?? 0) + (usage.outputTokens ?? 0);
    if (lastTotal.current === null) {
      lastTotal.current = total;
      return;
    }
    const delta = total - lastTotal.current;
    if (delta > 0) pending.current += delta;
    lastTotal.current = total;
  }, [usage]);

  // 定时 flush；卸载时做最后一次 flush（会话切换不丢已产生的增量）
  useEffect(() => {
    const flush = () => {
      if (inFlight.current) return; // 上一轮请求未结束：下个周期再试，避免并发重复上报
      const n = pending.current;
      if (n <= 0) return;
      pending.current = 0;
      inFlight.current = true;
      const p = fetch('/gateway/api/usage/report', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ tokens: n }),
      })
        .then((res) => {
          // 只有明确成功才算已上报；4xx/5xx 回滚到 pending 下个周期重试
```

</details>

**依据 3 · 源码核查**：[src/gateway.ts:1834-1860](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L1834-L1860)

当前资源epoch可借鉴。

<details>
<summary>查看原文（27行）</summary>

```text
    return true;
  };
  /** 授权变更后失效内存快照：先推进 epoch（旧请求/旧 baseline 随即失去回写资格），
   *  再清空快照，等待新 baseline 重建。 */
  const invalidateUserSessionAccess = (userId: number): void => {
    bumpUserAccessEpoch(userId);
    userSessionAccess.delete(userId);
    pendingCreatedSessions.delete(userId);
    userWorkspaceIds.delete(userId);
    userWorkspacePaths.delete(userId);
    userArchivedSessionIds.delete(userId);
  };
  /**
   * 权限行已经提交、但后续还要 await 上游沙盒收紧时，立即让在途 create/fork
   * 响应失去回写 grant/access 的资格。刻意不清快照或关闭 mux：待沙盒定向撤销
   * 结束后仍由 invalidateUserSessionAccess 统一刷新，避免窗口内 baseline 读到未撤销 grant。
   */
  const fenceUserAccessEpoch = (userId: number): void => {
    bumpUserAccessEpoch(userId);
  };
  const replaceUserWorkspacePaths = (userId: number, paths: Map<string, string>, epoch: number, order = 0): void => {
    if (epoch < userAccessEpochFor(userId)) return;
    if (order !== 0 && order < (userAccessListOrder.get(userId) ?? 0)) return;
    userWorkspacePaths.set(userId, paths);
    userWorkspaceIds.set(userId, new Set(paths.keys()));
    notifyUserSessionAccessWaiters(userId);
  };
```

</details>

#### 缺口

- 持久会话/模型入口预算契约未实现
  **影响**：不提高现有隔离或经济评分
  **进一步探讨**：先证明权威入口全覆盖和最小持久状态，再做故障注入对照

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 谁能采用，何时退出？

**研究主题**：采用判断

#### 完整回答

观察，适合能维护服务器、补丁与账户策略的DSH管理员研究可丢弃环境，不直接作为恶意多租户生产隔离方案。先在只发布回环网关端口的测试实例启动固定版本，主用户建A/B，分别分配目录与逐会话grant，再对HTTP、WS/mux、文件/下载、SSH/终端和第三方插件做负向访问；healthz/readyz只说明进程准备，不替代越权测试。不要在本轮已静态确认的客户端token报告上承诺硬预算。

再测logout+网关重启、改密通知失败、权限收紧与长生成并发；持有旧token仍可读、出现未授权对象、未知动作结果或恢复不了DB/.env即停止开放远程访问，保留本地管理员救援并核日志。退出先停网关/外层暴露，再按文档回滚插件补丁和重启DSH，保留DB与匹配密钥直到恢复验证结束。源码研究能支持观察和限定试部署目标，不能代替全量安全审计或真实用户验收。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:125-135](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L125-L135)

健康不替代子账号授权验收及端口拓扑。

<details>
<summary>查看原文（11行）</summary>

```text
`2.7.8` 镜像内置 DSH `0.2.1-alpha.2`，验收记录见 [v2.7.8 发布说明](https://github.com/slywalker2006/dsh-passwords/releases/tag/v2.7.8)。部署后确认 `/gateway/healthz`、`/gateway/readyz` 返回 `ok:true`，并实际登录验证子账号授权；健康检查不能代替权限验收。

<details>
<summary><strong>Docker 进阶配置与数据目录</strong></summary>

- 自定义端口、域名或第三方端点时，可复制 `docker/.env.example` 为 `docker/.env`，通过 `--env-file docker/.env` 传入。Compose 可使用 `docker compose --env-file docker/.env -f docker/docker-compose.yml up -d`。
- Docker 使用容器专用模板。根目录 `.env.example` 用于宿主安装，其端口、TLS 与数据库路径默认值不同，不能直接作为容器的 `--env-file`。
- 公网反代时建议设置 `MCP_GATEWAY_PUBLIC_HOST` 为实际访问的域名；外层反代需要保留外部 Host 并支持 WebSocket。
- `dsh-home` 保存 DSH profile；`dsh-passwords-state` 保存 `.env`、数据库与相关状态。两个卷应持久保留，清理方式见[卸载](#卸载)。
- 分容器部署时给 dsh 容器加 `MCP_DSH_PATCH_ALLOW_BIND_ALL=1`；DSH `0.2.1-alpha.2` 的 `dsh-web-app` 仍需要该补丁才能绑定 `0.0.0.0`。

```

</details>

**依据 2 · 作者声明**：[README.md:195-209](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/README.md#L195-L209)

退出保留持久数据。

<details>
<summary>查看原文（15行）</summary>

````text
## 卸载

宿主机安装可在 dsh-passwords 安装目录执行：

```bash
node dist/cli.js uninstall
# 全局 npm 安装也可直接执行：
dsh-passwords uninstall
```

该命令只从 DSH web profile 移除 `dsh-passwords` 的 link 与 bundle，并回滚本插件管理的 dsh 补丁；其他插件和 bundle 会保留。完成后按提示重启 `dsh-web`。

卸载不会删除安装目录、`.env`、数据库、TLS/ACME 证书或其他插件。profile 依赖重建或补丁回滚失败时会恢复原 profile，避免留下半卸载状态。Docker 部署请按所用 Compose 或容器编排停止并移除容器；不要删除命名卷，除非也要永久清除数据。

Docker 内的“保命技能”不会自删容器。确需永久清除所有容器数据时，Compose 可执行 `docker compose down -v`；上面的 `docker run` 部署可先执行 `docker rm -f dsh-passwords`，再执行 `docker volume rm dsh-home dsh-passwords-state`。这些操作会删除数据卷，执行前请备份。
````

</details>

**依据 3 · 源码核查**：[src/gateway.ts:3425-3455](https://github.com/slywalker2006/dsh-passwords/blob/3219789be4870e2888df9ef879448d442b87662d/src/gateway.ts#L3425-L3455)

logout连接关闭待复核。

<details>
<summary>查看原文（31行）</summary>

```text
  app.get('/gateway/logout', (_req, res) => {
    res.status(405).type('html').send('405 Method Not Allowed');
  });
  app.post('/gateway/logout', (req, res) => {
    // 同站子域页面可借表单强制登出（SameSite=Lax 只挡跨站、不挡同站子域）：
    // 与网关写路由同口径做 Origin 主机校验，提交方与 Host 不一致时拒绝。
    if (!originHostMatches(req, configuredOriginHosts)) {
      res.status(403).type('text/plain').send('403 Forbidden');
      return;
    }
    // F-04：服务端吊销——登出的 token 立即失效（黑名单 12h），
    // 即使 Cookie 已被攻击者复制，该 token 也无法再通过认证门卫
    const token = readCookie(req.headers.cookie, COOKIE_NAME);
    // 必须在吊销前解析会话：revokeToken 会清 sessionCache，之后无法可靠定位旧 WS。
    const session = sessionOf(req);
    if (token) revokeToken(token);
    if (session !== null) {
      closeUserWebSocketClients(session.userId, 1008, 'Session ended');
      closeUserRemoteMuxClients(session.userId, 1008, 'Session ended');
    }
    // 清除会话 Cookie 时必须与写入时同样带 Secure：部分浏览器不允许无 Secure
    // 的 Set-Cookie 覆盖已存在的 Secure Cookie，否则登出后客户端仍持有旧会话。
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${requestIsSecure(req) ? '; Secure' : ''}`,
    );
    res.redirect(302, '/gateway/login');
  });

  // ── 内部接口：dsh 插件通知网关重载远程设置补丁 ───────────────
  // 仅限本机 dsh 插件调用：要求回环地址 + 恒定时间比对内部密钥
```

</details>

#### 缺口

- 真实越权矩阵、故障恢复与用户结果未测
  **影响**：不满足直接推荐生产的证据条件
  **进一步探讨**：先完成独立负向矩阵及备份救援，失败即关闭外部入口

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
