# Enterprise Connection

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e581370](https://github.com/techflag/workdsh/tree/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection)

<!-- BEGIN META -->
[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techflag/workdsh)
<!-- END META -->

> **功能**：以固定版本捆绑企业身份与协作依赖的 WorkDSH 安装壳，安装代码后仍须后台验证企业账号权限。

> **亮点**：固定依赖集合、可追commit/sha256的pack清单和复用身份客户端构成有限分发贡献；核心身份/协作归其他包和后台，不计整仓能力，见 [Q01](#research-q01)。

> **主要限制**：源码缺浏览器出口但有明确生成链，不能判空占位也不能判成品可用；安装代码不等授权，装配不复制个人profile也不等登录后企业正文不上传，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

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
  - [Q01 · 企业连接子包自己的能力是什么，缺少浏览器文件是占位还是构建交付？](#detail-section-11)
  - [Q02 · 从安装页到企业身份/退出，实际责任在哪？](#detail-section-12)
  - [Q03 · 何时值得采用，有没有独立生产插件方向？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：公司管理员给匹配WorkDSH Desktop用户分发企业代码，再连接账号；不是给任意DSH用户即装即用的企业后台，见 [Q01](#research-q01)。

分别安装固定身份与协作依赖并由Desktop装配；本包简化成一个代码分发对象，未替代认证、后台、权限与模型配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 来源 | 边界 |
|---|---|---|
| 固定代码集合 | 本壳pack+dependencies | 构建链存在不等成品验收 |
| 企业账号页 | 身份依赖client重标识 | 不自行建立成员身份 |
| 登录/退出与正文按钮 | 身份客户端+Main/后台 | 本轮未验完整授权/同步 |

**流程与依赖**

| 依赖 | 用途 | 缺失或边界 |
|---|---|---|
| 精确WorkDSH/DSH 0.2.1-rc.2组合 | 客户端与desktop入口 | 非通用宿主兼容声明 |
| 身份alpha.3/协作alpha.1 | 实际账号和业务代码 | 根壳空apply，不独立提供 |
| pack生产脚本与产物 | 生成client、捆绑依赖与manifest | 固定源码不等已发行验收 |
| Desktop/Main及公司后台 | 登录、固定成员、权限与数据 | 安装不授企业权限 |
| 组织/成员与数据规则 | 授权范围和正文生命周期 | 账号目录不是安全沙箱 |

| 阶段 | 执行者/动作 | 成功判据 |
|---|---|---|
| 分发 | 管理员给固定包 | 核manifest/宿主/依赖/哈希 |
| 安装 | 用户匹配个人Desktop profile | 代码落盘且desktop入口有效 |
| 登录 | Desktop/Main与后台核成员 | 不以安装成功当身份 |
| 使用 | 权限服务和协作依赖 | 核资源授权及正文同步状态 |
| 退出 | POST退出及Main生命周期 | 本地账号与后台记录分别核 |

**效果与成本**

| 阶段 | 现金/资源 | 人工/时间 |
|---|---|---|
| 首次 | 后台与发行存储成本未知 | 部署、成员、精确版本和证书/网络配置 |
| 持续 | 服务/同步/网络成本未知 | 身份、协作、宿主升级维护 |
| 故障 | 账号/同步待处理资源未知 | 跨Main/Host/后台核权与状态 |
| 退出 | 后台记录另有生命周期 | 退出、卸载、删除正文分别确认 |

| 项目 | 当前支持 | 未知 |
|---|---|---|
| 代码交付 | 固定依赖打包链 | 发行产物安装可用 |
| 安装隔离 | 装配代码不复制profile | 完整账号/资源隔离实证 |
| 企业采用 | 登录页和精确兼容门槛 | 业务收益、需求和持续费用 |

> **思考**：源码缺浏览器出口但有明确生成链，不能判空占位也不能判成品可用；安装代码不等授权，装配不复制个人profile也不等登录后企业正文不上传，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：固定依赖集合、可追commit/sha256的pack清单和复用身份客户端构成有限分发贡献；核心身份/协作归其他包和后台，不计整仓能力，见 [Q01](#research-q01)。

[Q01](#research-q01) 明确生成产物和固定依赖manifest值得保留；[Q02](#research-q02) 版本/出口校验与安装不授权限是正确分工，但安全结论必须另查Main和后台，不从薄壳推导。

<a id="detail-section-5"></a>

### 1.4 主要限制

源码缺浏览器出口但有明确生成链，不能判空占位也不能判成品可用；安装代码不等授权，装配不复制个人profile也不等登录后企业正文不上传，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察为主，已有公司测试后台和对应Desktop才验证包与账号全链；不把它推荐为独立通用企业插件，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包和直接生产/装配依赖已核，建议观察。未构建发行包、登录后台或审计完整授权/正文链，不承诺企业隔离可用。

- 已检查：作者 README、包清单、源码路径 apps/desktop/src/enterprise-plugins.ts、apps/web/scripts/pack-enterprise-connection.mjs、packages/enterprise-connection/README.md、packages/enterprise-connection/cordis.patch.yml、packages/enterprise-connection/index.mjs、packages/enterprise-connection/package.json、packages/providers/identity-enterprise/README.md、packages/providers/identity-enterprise/src/client.tsx、packages/providers/identity-enterprise/src/index.ts 及固定范围 inventory；组件：packages/enterprise-connection。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：组件自身四个跟踪文件完整读；为归因只读apps/web pack、Desktop enterprise-plugins及身份依赖根/Account/README，未把全仓作为本组件统计或完整安全审计。
- 下一步：固定包核manifest与完整commit，授权隔离后台验证登录/过期/撤权/换组织/退出/重启和正文删除，检查个人数据未复制与实际资源权限。本轮仅源码，不执行构建登录。

**分析版本**

- **仓库**：[techflag/workdsh](https://github.com/techflag/workdsh)
- **版本号**：0.1.0-alpha.2（[固定提交 e581370](https://github.com/techflag/workdsh/tree/e58137020fb4f5f863f551d8ae4234e6c3d355ea)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未形成独立产品方向；可验证交付/身份/资源/正文各状态的验收收据能否减少安装即授权误判，依赖现有manifest与状态而未实现，见 [Q03](#research-q03)。

固定包核manifest与完整commit，授权隔离后台验证登录/过期/撤权/换组织/退出/重启和正文删除，检查个人数据未复制与实际资源权限。本轮仅源码，不执行构建登录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 2 | 2 | 0 | — |
| .md | source | 1 | 3 | — | — | 87 |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/techflag/workdsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=12&color=737b86&logo=github)](https://github.com/techflag/workdsh/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/techflag/workdsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分清企业连接子包交付壳、依赖身份客户端、Desktop装配及后台授权的实际责任。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 企业连接子包自己的能力是什么，缺少浏览器文件是占位还是构建交付？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

该组件是private的workdsh-enterprise-connection 0.1.0-alpha.2，属于原生插件交付壳；index.mjs的apply为空，bundle只插入自己的行。它固定捆绑身份0.1.0-alpha.3和协作0.1.0-alpha.1，不是独立认证后台或模型服务。目标是公司管理员给个人WorkDSH用户交付企业代码，再由用户连接公司账号；安装权限不能等同企业账号/资源权限。相对用户自行找齐两个依赖，贡献是一个固定依赖集合的外部包和安装入口，不能把全仓协作、身份、模型与业务能力算为该子包原创。

源码目录没有声明导出的client.browser.js，但找到明确生产脚本：先构建并pack两个依赖到stage/node_modules，复制身份依赖的浏览器bundle、改ModuleLoader ID为连接包，再pack并输出含commit/sha256/依赖的manifest。这使缺文件可解释为构建产物，而不能直接判占位或已发行可用。本轮不执行脚本或下载Release，所以只确认生产链存在，产物哈希与安装验收仍未知；包peer精确DSH 0.2.1-rc.2、Cordis4.0.5和React19.2.4等，不能当通用DSH插件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/enterprise-connection/package.json:1-16](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection/package.json#L1-L16)

private交付包、版本、host/client出口。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "workdsh-enterprise-connection",
  "version": "0.1.0-alpha.2",
  "private": true,
  "type": "module",
  "description": "企业连接：安装后连接公司账号与协作，权限由后台登录验证",
  "exports": {
    ".": "./index.mjs",
    "./client": "./client.browser.js"
  },
  "files": [
    "index.mjs",
    "client.browser.js",
    "cordis.patch.yml",
    "README.md"
  ],
```

</details>

**依据 2 · 源码核查**：[packages/enterprise-connection/package.json:38-48](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection/package.json#L38-L48)

两个固定捆绑依赖。

<details>
<summary>查看原文（11行）</summary>

```text
  "bundledDependencies": [
    "workdsh-provider-identity-enterprise",
    "workdsh-plugin-enterprise-collaboration"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.2",
```

</details>

**依据 3 · 源码核查**：[packages/enterprise-connection/index.mjs:1-2](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection/index.mjs#L1-L2)

宿主空apply。

```text
export const name="workdsh-enterprise-connection";
export function apply() {}
```

**依据 4 · 源码核查**：[packages/enterprise-connection/cordis.patch.yml:1-3](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection/cordis.patch.yml#L1-L3)

仅本行挂载。

```text
- insert:
    - id: workdsh-enterprise-connection
      name: workdsh-enterprise-connection
```

**依据 5 · 源码核查**：[apps/web/scripts/pack-enterprise-connection.mjs:5-24](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/apps/web/scripts/pack-enterprise-connection.mjs#L5-L24)

依赖构建、浏览器重标识、打包和带sha256清单。

<details>
<summary>查看原文（20行）</summary>

```text
const source=resolve(import.meta.dirname,'../../../packages/enterprise-connection');
const output=resolve(process.argv[2]??'/private/tmp/workdsh-enterprise-delivery');mkdirSync(output,{recursive:true});
const stage=mkdtempSync(join(tmpdir(),'enterprise-delivery-'));cpSync(source,stage,{recursive:true,filter:p=>!p.includes('/node_modules')});
const packages={'workdsh-provider-identity-enterprise':'../../../packages/providers/identity-enterprise','workdsh-plugin-enterprise-collaboration':'../../../packages/plugins/enterprise-collaboration'};
for(const [name,path] of Object.entries(packages)){
 execFileSync('corepack',['pnpm','--filter',name,'build'],{cwd:resolve(import.meta.dirname,'..'),stdio:'pipe'});
 const directory=resolve(import.meta.dirname,path);const pkg=JSON.parse(readFileSync(join(directory,'package.json'),'utf8'));
 execFileSync('corepack',['pnpm','--filter',name,'exec','pnpm','pack','--pack-destination',stage],{cwd:resolve(import.meta.dirname,'..'),stdio:'pipe'});
 const target=join(stage,'node_modules',name);mkdirSync(target,{recursive:true});
 execFileSync('tar',['-xzf',join(stage,name+'-'+pkg.version+'.tgz'),'--strip-components=1','-C',target]);
}
const browser=readFileSync(resolve(import.meta.dirname,packages['workdsh-provider-identity-enterprise'],'dist/client.browser.js'),'utf8');
writeFileSync(join(stage,'client.browser.js'),browser.replace('id: "workdsh-provider-identity-enterprise"','id: "workdsh-enterprise-connection"'));
writeFileSync(join(stage,'pnpm-workspace.yaml'),'nodeLinker: hoisted\n');
execFileSync('corepack',['pnpm','pack','--pack-destination',output],{cwd:stage,stdio:'inherit'});

const pkg=JSON.parse(readFileSync(join(source,'package.json'),'utf8'));
const filename=pkg.name+'-'+pkg.version+'.tgz';const archive=readFileSync(join(output,filename));
const metadata={kind:'workdsh-enterprise-plugin',name:pkg.name,version:pkg.version,dshVersion:pkg.peerDependencies['@deepseek-ai/dsh'],sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim(),filename,bytes:archive.length,sha256:createHash('sha256').update(archive).digest('hex'),components:pkg.dependencies};
writeFileSync(join(output,'enterprise-plugin-manifest.json'),JSON.stringify(metadata,null,2)+'\n');
```

</details>

#### 缺口

- 没有发行包、SHA256SUMS及安装图形验收的实证。
  **影响**：不能从安装壳或静态依赖推导企业后台已可用或隔离已验收。
  **进一步探讨**：在明确授权环境核发行包与固定commit/manifest、内容、依赖版本及正确Desktop安装，但本轮不执行。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从安装页到企业身份/退出，实际责任在哪？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

连接包复用身份依赖的Account客户端。该页请求同源/api/auth/me，每30秒刷新，401/404显示尚未连接，未连接点击workdsh://entry交Desktop入口；安装本身不自造成员。退出POST/api/auth/logout，local=true则回本地无账号态，否则跳/login；正文同步和后台正文删除按钮也属于身份依赖，明确展示pending/确认条数，并要求删除确认，不是连接壳自己实现。

Desktop的installedEnterprisePlugins检查连接包确已落盘、依赖包名、desktop入口及精确宿主版本，compose只pack安装代码到企业profile并安装，不复制源profile或凭据。真正后台核验、Main令牌、固定成员、资源授权和正文上传在身份/协作依赖及Desktop/后台实现，这里只读到归属和部分客户端/装配，未完整安全审计。README的“不复制个人数据”应解释为装配不复制个人profile，不等于登录后企业会话永不上传：身份依赖文档明确有已显示用户/助手文字同步，排除推理/工具/附件只是作者契约，本轮没有从所有生产链独立验证。账号目录分离也不能当同OS用户安全沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[packages/providers/identity-enterprise/src/client.tsx:24-37](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/providers/identity-enterprise/src/client.tsx#L24-L37)

账号实际查询和状态刷新。

<details>
<summary>查看原文（14行）</summary>

```text
  useEffect(() => {
    const lifetime = new AbortController();
    const load = () => fetch('/api/auth/me', { credentials: 'same-origin', signal: AbortSignal.any([lifetime.signal, AbortSignal.timeout(8000)]) })
      .then(async response => {
        if (response.status === 404 || response.status === 401) { setDesktop(true); setAccount(undefined); setError(''); return; }
        const value = await response.json() as AccountStatus & { local?: boolean };
        if (value.local || value.desktop) setDesktop(true);
        if (!response.ok) throw new Error('企业登录已失效，请重新登录。');
        if (!value.displayName || !value.email || !value.organizationName || !['OWNER', 'ADMIN', 'MEMBER'].includes(value.role)) throw new Error('企业账号信息不完整，请重试。');
        if (!lifetime.signal.aborted) { setAccount(value); setError(''); }
      }).catch(cause => { if (!lifetime.signal.aborted) { setAccount(undefined); setError(cause instanceof Error ? cause.message : '企业账号读取失败。'); } })
      .finally(() => { if (!lifetime.signal.aborted) setLoading(false); });
    void load();
    const timer = setInterval(() => { void load(); }, 30000);
```

</details>

**依据 2 · 源码核查**：[packages/providers/identity-enterprise/src/client.tsx:63-97](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/providers/identity-enterprise/src/client.tsx#L63-L97)

退出、deep link、同步和后台删除入口。

<details>
<summary>查看原文（35行）</summary>

```text
  const logout = async () => {
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: '{}', signal: AbortSignal.timeout(8000) });
      if (!response.ok) throw new Error('退出失败，请重试。');
      const value = await response.json().catch(() => ({})) as { local?: boolean };
      if (value.local === true) { setDesktop(true); setAccount(undefined); setError('已退出企业账号。'); return; }
      window.location.assign('/login');
    } catch (cause) { setError(cause instanceof Error ? cause.message : '退出失败，请重试。'); }
    finally { setBusy(false); }
  };
  return <section style={style} data-testid="enterprise-account">
    <h1 style={{ fontSize: 24, marginTop: 0 }}>企业账号</h1>
    <p style={{ color: 'var(--dsw-alias-label-secondary)', lineHeight: 1.7 }}>查看当前登录的企业成员信息。</p>
    {loading ? <p role="status">正在读取账号…</p> : account ? <>
      <div style={{ padding: 24, borderRadius: 16, border: '1px solid var(--dsw-alias-border-l2)', background: 'var(--dsw-alias-bg-layer-1)' }}>
        <strong style={{ fontSize: 18 }}>{account.displayName}</strong>
        <p style={{ color: 'var(--dsw-alias-label-secondary)' }}>{account.email}</p>
        <dl style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 14, marginTop: 24, marginBottom: 0 }}>
          <dt>所在组织</dt><dd style={{ margin: 0 }}>{account.organizationName}</dd>
          <dt>组织角色</dt><dd style={{ margin: 0 }}>{{ OWNER: '负责人', ADMIN: '管理员', MEMBER: '成员' }[account.role]}</dd>
        </dl>
      </div>
      <button style={{ ...button, marginTop: 16 }} disabled={busy} onClick={() => void logout()}>{busy ? '正在退出…' : '退出企业账号'}</button>
    </> : <div><p>企业插件已安装。连接公司后台并登录后，才会启用企业账号和权限。个人数据不会自动复制到企业空间。</p><button style={button} onClick={() => window.location.assign('workdsh://entry')}>连接企业</button></div>}
    {desktop && account && <section aria-label="企业正文同步" style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 18 }}>企业正文同步</h2>
      <p style={{ lineHeight: 1.7, color: 'var(--dsw-alias-label-secondary)' }}>同步用户与助手已显示的文字；不上传思考、工具轨迹或附件。失败时本地记录保留，可重试。已同步正文由本组织有权限的管理员只读查看。</p>
      <button style={button} disabled={busy} onClick={() => void syncAction('retry')}>重试同步</button>
      {sync && <p role="status">{sync.sessions.filter(row => !row.deleted && (row.pending || row.error)).length} 个会话待确认</p>}
      {sync?.sessions.map(row => <div key={row.sessionId} style={{ marginTop: 12, borderTop: '1px solid var(--dsw-alias-border-l2)', paddingTop: 12 }}>
        <code>{row.sessionId}</code><p>{row.deleted ? '后台正文已删除；此会话不再上传。' : `后台已确认 ${row.acknowledged} / 本地 ${row.recordCount} 条正文`}</p>
        {row.deletePending && <p>后台删除待确认；此会话已暂停上传，可重试。</p>}
        {row.error && <p role="alert">{row.error}</p>}
        {!row.deleted && row.acknowledged > 0 && <button style={button} disabled={busy} onClick={() => { if (window.confirm('删除该会话的后台正文？本地记录保留，此会话将停止同步。')) void syncAction('delete', row.sessionId); }}>删除后台正文</button>}
```

</details>

**依据 3 · 源码核查**：[apps/desktop/src/enterprise-plugins.ts:8-23](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/apps/desktop/src/enterprise-plugins.ts#L8-L23)

已安装代码与精确版本校验。

<details>
<summary>查看原文（16行）</summary>

```text
export function installedEnterprisePlugins(profile:string,version:string):string[]{
 if(!existsSync(join(profile,'package.json')))return [];
 const manifest=JSON.parse(readFileSync(join(profile,'package.json'),'utf8'));
 const bundle=manifest.dependencies?.['workdsh-enterprise-connection'];
 const bundleRoot=join(profile,'node_modules','workdsh-enterprise-connection');
 if(bundle&&!existsSync(join(bundleRoot,'package.json')))throw Error('企业连接包尚未完成安装');
 const names:string[]=[];
 for(const name of enterprisePluginNames){
  if(!bundle&&![manifest.dependencies,manifest.optionalDependencies].some(section=>section?.[name]))continue;
  const path=join(bundle?bundleRoot:profile,'node_modules',name,'package.json');
  if(!existsSync(path))throw Error('企业插件尚未完成安装：'+name);
  const pkg=JSON.parse(readFileSync(path,'utf8'));
  if(pkg.name!==name||!pkg.exports?.['./desktop']||pkg.peerDependencies?.['@deepseek-ai/dsh']!==version)throw Error('企业插件与当前 DSH 不兼容：'+name);
  names.push(name);
 }
 return names;
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src/enterprise-plugins.ts:25-44](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/apps/desktop/src/enterprise-plugins.ts#L25-L44)

只pack代码装配，不复制profile。

<details>
<summary>查看原文（20行）</summary>

```text
export async function composeInstalledEnterprisePlugins(source:string,target:string,version:string,node:string,pnpm:string):Promise<string[]>{
 const names=installedEnterprisePlugins(source,version);
 if(!names.includes(enterprisePluginNames[0]))throw Error('请先在个人空间的插件管理中安装企业账号插件，再进行企业登录');
 const manifestFile=join(target,'package.json');const manifest=JSON.parse(readFileSync(manifestFile,'utf8'));
 const archives=join(target,'enterprise-plugin-archives');mkdirSync(archives,{recursive:true,mode:0o700});
 manifest.dependencies??={};
 // Pack installed code through the bundled package manager; do not copy Profile files or credentials.
 for(const name of names){
  const sourceManifest=JSON.parse(readFileSync(join(source,'package.json'),'utf8'));
  const directory=join(sourceManifest.dependencies?.['workdsh-enterprise-connection']?join(source,'node_modules','workdsh-enterprise-connection'):source,'node_modules',name);
  const pkg=JSON.parse(readFileSync(join(directory,'package.json'),'utf8'));
  await execute(node,[pnpm,'pack','--pack-destination',archives],{cwd:directory,timeout:240000});
  const filename=name+'-'+pkg.version+'.tgz';
  if(!readdirSync(archives).includes(filename))throw Error('企业插件导出失败：'+name);
  manifest.dependencies[name]='file:./enterprise-plugin-archives/'+filename;
 }
 for(const name of enterprisePluginNames)if(!names.includes(name)){delete manifest.dependencies[name];delete manifest.optionalDependencies?.[name];}
 writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n',{mode:0o600});
 await execute(node,[pnpm,'--dir',target,'install','--prod','--force'],{cwd:target,timeout:240000});
 return names;
```

</details>

**依据 5 · 源码核查**：[packages/providers/identity-enterprise/src/index.ts:3-5](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/providers/identity-enterprise/src/index.ts#L3-L5)

根入口也不建立成员身份。

```text
/** Explicit enterprise account client companion; member identity uses /desktop. */
export const name = 'workdsh-provider-identity-enterprise';
export function apply(_ctx: Context): void {}
```

**依据 6 · 源码核查**：[packages/providers/identity-enterprise/README.md:16-36](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/providers/identity-enterprise/README.md#L16-L36)

Main、权限和正文同步属于依赖契约而非本壳能力。

<details>
<summary>查看原文（21行）</summary>

```text
`./desktop` 的纯 JSON Config 为 `{ authFile, principalId, organizationId, deviceId }`。Desktop Main 先经后台核验成员，再提供这些固定值；插件读取 Main 所属账号目录中的 `enterprise-auth.json`，核对 `authorityUrl`、桥能力 `authorityKey`、`backendUrl` 及同一成员、组织和设备。authority 仅允许字面回环 `127.0.0.1` 的受控随机端口，拒绝重定向与绑定变更。

真实后台成员 token 仅保存在 Electron Main 内存。文件中的随机能力只允许调用本机桥的封闭路由，不是后台成员 token；页面、模型和 Profile 不接收它。本包不持有服务器 service key。POSIX 检查文件 0600 权限和当前 UID；Windows 拒绝符号链接并核对文件描述符，依赖 Main 创建的当前 OS 用户 userData 目录 ACL。目录分离不构成同 OS 用户之间的安全沙箱，Windows 实际打包尚未验收。

企业装配须移除个人身份提供方，安装 `./desktop`，并显式启用共同 access 的 `autoBindFixedMemberSessions`。每次企业身份解析和同步操作都通过 Main 复验固定成员，不因 Profile 或缓存信息而放行；登录过期、成员变化、密码待修改及后台不可达时拒绝，不降级个人身份。

客户端仍使用同源 `/api/auth/me` 和 `/api/auth/logout`。Desktop 由本插件贡献这些受官方 Connection 托管的 Host 路由；账号响应含 `desktop: true`，退出响应为 `{ local: true }`，页面不跳转远程登录。Main 拥有窗口、进程停止、认证文件清理及后台撤销生命周期。账号页同时显示同步状态，并提供重试与明确的后台正文删除操作。

本包不注册模型 provider、不自动写入模型配置。企业成员仍在完整官方自定义模型 API 页手工填写公司内部地址、Key、协议和模型；个人自配模型可以并存。协作和通知仍是独立外置插件，本次身份适配不表示其 Desktop 装配已完成。

## 可见正文同步契约

同步监听官方公开 `session/created`、`session/event` 与 `session/flush`，随后通过共同 `workdshSessionAccess.inspect` 冷读，核验真实固定成员及 Session 所有权。上传范围只包括 `source.kind === 'user'` 的用户文字和已提交的助手文字，包括已提交的中断前缀；系统消息、注入内容、思考、工具轨迹和附件不进入 payload。

正文是按官方事件序号稳定标识的可见文字日志：后续编辑不会改写已上传的旧前缀。客户端只提交 `{ version: 1, deviceId, sessionId, revision, requestId, entries }`，entry 仅含 `{ seq, recordId, role, text }`；组织和成员由后台当前登录确定。Main 注入冻结设备，后台拒绝同一 Session 的无约束多设备写入。

受保护的 `enterprise-visible-sync.json` 与 authFile 位于同一账号目录，保存待发送正文、修订及 requestId。发送前持久化请求；丢失回执时重试原 payload，不生成另一份记录。后台只接受严格新增的不可变前缀，返回实际修订与条数；失败保留本地记录和错误状态，不虚报成功。后台限制 JSON 512 KiB、512 条、单条文字 64 KiB、文字总计 256 KiB；超限拒绝，不静默截断。

删除后台正文前先持久化删除意图并暂停该会话上传。后台 tombstone 幂等，丢失响应可在重启后重试；确认后该会话不再上传。本地官方会话数据保留。`session/disposed` 只是释放/回滚，不被当作删除事件；官方界面本地删除也不等于后台正文删除。

客户端过滤已知 private key、API token、JWT、Bearer 等形状及实际桥能力，后台也拒绝明显凭据形状；这不能语义保证任意正文不含秘密。后台接收的是客户端提交的可见日志，不是不可绕过的终端完整审计。管理员读取须由后台组织范围授权且留访问审计，不能获得成员凭据或 Host 管理权限。
```

</details>

#### 缺口

- 未完整查认证桥、后台资源授权、会话隔离和正文同步链。
  **影响**：不能从安装壳或静态依赖推导企业后台已可用或隔离已验收。
  **进一步探讨**：以授权测试成员做登录/过期/撤权/换组织/退出/重启与正文上传删除验收，分别核Main、Host和后台数据，不用安装页替代。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得采用，有没有独立生产插件方向？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前建议观察，只适用于已有公司后台与对应WorkDSH Desktop维护者验证交付，不建议普通用户把包直接装到任意DSH试企业能力。首次要准备服务、组织/成员、精确宿主、固定发行包和证书/网络条件，现金与时间均未知；持续有身份/协作/后台/客户端同步升级及运维，失败需核安装缓存、账号、过期/撤权和后台记录，不能靠重装授予权限。退出账号不是卸载代码，卸载代码也不等于撤销后台记录或删除已上传正文；保留个人空间与授权边界要由真正生产链验收。

本壳本身没有足够依据形成独立产品方向，通用“企业连接”已有宿主原生分发和多个依赖承担核心职责。可验证工程假设是交付前用机器可核manifest记录固定commit、宿主版本和依赖/产物哈希，再在安装页分别显示“代码已安装”“后台身份已验证”“资源访问已验”“正文同步待/已确认”。现有pack manifest和登录页状态提供依据，但把它们联成可审阅验收收据还未实现。以错版本包、缺desktop出口、后台不可达/撤权和同步丢响应测试，若不能减少误把安装当授权、也不减少排错时间，应不做独立插件。

#### 证据与依据

**依据 1 · 源码核查**：[apps/web/scripts/pack-enterprise-connection.mjs:21-24](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/apps/web/scripts/pack-enterprise-connection.mjs#L21-L24)

现有包证据清单。

```text
const pkg=JSON.parse(readFileSync(join(source,'package.json'),'utf8'));
const filename=pkg.name+'-'+pkg.version+'.tgz';const archive=readFileSync(join(output,filename));
const metadata={kind:'workdsh-enterprise-plugin',name:pkg.name,version:pkg.version,dshVersion:pkg.peerDependencies['@deepseek-ai/dsh'],sourceCommit:execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim(),filename,bytes:archive.length,sha256:createHash('sha256').update(archive).digest('hex'),components:pkg.dependencies};
writeFileSync(join(output,'enterprise-plugin-manifest.json'),JSON.stringify(metadata,null,2)+'\n');
```

**依据 2 · 源码核查**：[apps/desktop/src/enterprise-plugins.ts:13-20](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/apps/desktop/src/enterprise-plugins.ts#L13-L20)

安装/兼容失败明确拒绝。

```text
 if(bundle&&!existsSync(join(bundleRoot,'package.json')))throw Error('企业连接包尚未完成安装');
 const names:string[]=[];
 for(const name of enterprisePluginNames){
  if(!bundle&&![manifest.dependencies,manifest.optionalDependencies].some(section=>section?.[name]))continue;
  const path=join(bundle?bundleRoot:profile,'node_modules',name,'package.json');
  if(!existsSync(path))throw Error('企业插件尚未完成安装：'+name);
  const pkg=JSON.parse(readFileSync(path,'utf8'));
  if(pkg.name!==name||!pkg.exports?.['./desktop']||pkg.peerDependencies?.['@deepseek-ai/dsh']!==version)throw Error('企业插件与当前 DSH 不兼容：'+name);
```

**依据 3 · 源码核查**：[packages/providers/identity-enterprise/src/client.tsx:87-97](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/providers/identity-enterprise/src/client.tsx#L87-L97)

安装与身份/同步状态区分。

<details>
<summary>查看原文（11行）</summary>

```text
    </> : <div><p>企业插件已安装。连接公司后台并登录后，才会启用企业账号和权限。个人数据不会自动复制到企业空间。</p><button style={button} onClick={() => window.location.assign('workdsh://entry')}>连接企业</button></div>}
    {desktop && account && <section aria-label="企业正文同步" style={{ marginTop: 24 }}>
      <h2 style={{ fontSize: 18 }}>企业正文同步</h2>
      <p style={{ lineHeight: 1.7, color: 'var(--dsw-alias-label-secondary)' }}>同步用户与助手已显示的文字；不上传思考、工具轨迹或附件。失败时本地记录保留，可重试。已同步正文由本组织有权限的管理员只读查看。</p>
      <button style={button} disabled={busy} onClick={() => void syncAction('retry')}>重试同步</button>
      {sync && <p role="status">{sync.sessions.filter(row => !row.deleted && (row.pending || row.error)).length} 个会话待确认</p>}
      {sync?.sessions.map(row => <div key={row.sessionId} style={{ marginTop: 12, borderTop: '1px solid var(--dsw-alias-border-l2)', paddingTop: 12 }}>
        <code>{row.sessionId}</code><p>{row.deleted ? '后台正文已删除；此会话不再上传。' : `后台已确认 ${row.acknowledged} / 本地 ${row.recordCount} 条正文`}</p>
        {row.deletePending && <p>后台删除待确认；此会话已暂停上传，可重试。</p>}
        {row.error && <p role="alert">{row.error}</p>}
        {!row.deleted && row.acknowledged > 0 && <button style={button} disabled={busy} onClick={() => { if (window.confirm('删除该会话的后台正文？本地记录保留，此会话将停止同步。')) void syncAction('delete', row.sessionId); }}>删除后台正文</button>}
```

</details>

**依据 4 · 源码核查**：[packages/enterprise-connection/README.md:1-3](https://github.com/techflag/workdsh/blob/e58137020fb4f5f863f551d8ae4234e6c3d355ea/packages/enterprise-connection/README.md#L1-L3)

管理员分发、安装不授权限、退出回个人。

```text
# 企业连接

在个人空间的“插件 → 添加插件”安装管理员提供的本包，然后进入“设置 → 企业账号 → 连接企业”。账号和协作代码由本包固定版本交付；安装本身不会获得企业权限，不复制个人数据。退出企业账号返回个人空间。
```

#### 缺口

- 缺真实部署验收、后台可得性与需求/成本对照。
  **影响**：不能从安装壳或静态依赖推导企业后台已可用或隔离已验收。
  **进一步探讨**：先跟维护者在隔离公司测试环境核完整权限和数据生命周期，记录误判与恢复时间，再决定是否补验收收据。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
