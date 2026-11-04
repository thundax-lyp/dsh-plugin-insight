# WorkDSH 企业连接

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[e94c99d](https://github.com/techflag/workdsh/tree/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection)

<!-- BEGIN META -->
[![GitHub ★ 302](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=302&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/techflag/workdsh)
<!-- END META -->

> **功能**：从个人空间安装管理员归档后连接 WorkDSH 企业账号与协作。

> **亮点**：[Q01](#research-q01) 把两个固定依赖和身份客户端装入单个管理员交付物，保留可比对的工件清单。账号认证和协作业务分别由依赖及 Desktop 与后台完成。

> **主要限制**：[Q02](#research-q02) 固定版本下的精确 peer 和 Desktop 导出要求可能在部署中阻止企业激活；安装不能当成授权，也不能据此宣称企业数据和个人数据已实证隔离。

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
  - [Q01 · 企业连接包解决什么交付问题？](#detail-section-11)
  - [Q02 · 企业登录前后如何接线，何时会失败？](#detail-section-12)
  - [Q03 · 什么时候值得采用，退出和故障如何核验？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：管理员向已有 WorkDSH Desktop 的组织成员分发一个企业归档，成员通过个人空间安装后从设置连接企业账号。

管理员逐项交付身份和协作包，或维护预装企业组件的专用客户端。单归档减少分发对象数量，仍需同样的账号后台和精确宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 企业连接入口 | 从个人空间进入企业账号流程 | 浏览器出口由发行脚本生成 |
| 单归档分发 | 集中交付固定企业依赖 | 归档需要匹配版本与独立验收 |
| 企业 Profile 组装 | 将代码导入企业工作区 | 需后台核权，不等同数据隔离验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 管理员归档 | 必需 | 固定身份、协作和客户端代码 | 暂停安装并核验归档 |
| 匹配 WorkDSH Desktop / DSH 0.2.1-rc.5 | 必需 | 加载客户端和 Desktop 导出 | 拒绝企业激活 |
| 企业后台与有效账号 | 必需 | 认证、核权与退出撤销 | 留在个人空间 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 验包 | 管理员对清单和归档 | 版本及哈希一致，确认客户端与捆绑包 |
| 连接 | 用户从个人空间安装后发起企业登录 | 后台核权通过再组装并启动 |
| 退出 | 用户退出，管理员核对后台 | 分别确认退出、撤销与卸载 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 后台与打包资源未知 | 准备测试账户和版本匹配 | 需管理员提供归档 |
| 持续 | 服务及同步费用未知 | 跟踪精确依赖和宿主升级 | 未测维护工时 |
| 失败恢复 | 重试资源未知 | 核本机工作区、安装包及后台撤销 | 未证明失败回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 单归档分发 | 构建脚本生成客户端及组件清单 | 归档实物可用性 |
| 身份隔离 | 组装移除个人身份 bundle | 端到端权限和退出结果 |

> **思考**：[Q02](#research-q02) 固定版本下的精确 peer 和 Desktop 导出要求可能在部署中阻止企业激活；安装不能当成授权，也不能据此宣称企业数据和个人数据已实证隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把两个固定依赖和身份客户端装入单个管理员交付物，保留可比对的工件清单。账号认证和协作业务分别由依赖及 Desktop 与后台完成。

精确版本检查与安装数据分工见 [Q02](#research-q02)。企业 Profile 先写 manifest 后执行安装，因此故障时应查实际状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 固定版本下的精确 peer 和 Desktop 导出要求可能在部署中阻止企业激活；安装不能当成授权，也不能据此宣称企业数据和个人数据已实证隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 有匹配 Desktop 与测试后台才验证归档、身份和退出；任一边界未确认即暂停分发并退回个人空间。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包及配套接线的静态核查支持交付结构和条件；真实归档、后台和宿主未经本轮验收。

- 已检查：作者 README、包清单、源码路径 packages/enterprise-connection/README.md、packages/enterprise-connection/index.mjs、packages/enterprise-connection/cordis.patch.yml、packages/enterprise-connection/package.json、apps/web/scripts/pack-enterprise-connection.mjs、apps/desktop/src/enterprise-plugins.ts、apps/desktop/src/workdsh-main.ts、apps/desktop/src/enterprise-auth.ts、apps/desktop/scripts/accept-enterprise-installation.mjs 及固定范围 inventory；组件：packages/enterprise-connection。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓中的企业连接子包四个文件及其直接打包和 Desktop 接线。未运行构建、安装、验收脚本或企业后台。
- 下一步：在隔离企业账号中验证准确归档、错误版本、账号撤销、故障残留及退出；核对个人和企业 Profile 与后台审计。

**分析版本**

- **仓库**：[techflag/workdsh](https://github.com/techflag/workdsh)
- **版本号**：0.1.0-alpha.2（[固定提交 e94c99d](https://github.com/techflag/workdsh/tree/e94c99d5f9e143fb67fec84a74978eb8218daf32)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 可试验在企业接入流程独立显示归档核验、成员核验和退出撤销状态。若误判和二次核对均未减少，放弃扩展；目前只有源码推导。

在隔离企业账号中验证准确归档、错误版本、账号撤销、故障残留及退出；核对个人和企业 Profile 与后台审计。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 2 | 2 | 0 | — |
| .md | source | 1 | 3 | — | — | 87 |

</details>

**活跃度**

[![Issue 未关闭 12](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=12&color=737b86&logo=github)](https://github.com/techflag/workdsh/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：企业连接包如何交付、接入企业 Profile，以及哪些条件决定能否采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 企业连接包解决什么交付问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

WorkDSH 管理员可以把企业登录与协作所需的组件作为单一归档交给个人空间用户。组件的 Host 入口为空，Cordis 补丁仅登记组件名称；真正的账号与协作实现来自两个固定依赖。源树没有 manifest 指向的 client.browser.js，Web 打包脚本从身份组件构建产物生成这个入口，把两个依赖解包到暂存目录，再打一个私有包归档。清单附来源提交、宿主版本、组件版本、字节数与 SHA-256，可用于验收对照，源码没有显示安装入口自动校验此交付清单。相对手工安装两套组件，实质增量是让管理员分发一个可追溯的工件，同时保持企业代码可选；把归档装进个人空间只是交付的一步。

#### 证据与依据

**依据 1 · 作者声明**：[packages/enterprise-connection/README.md:1-3](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection/README.md#L1-L3)

说明管理员分发、用户连接与退出。

```text
# 企业连接

在个人空间的“插件 → 添加插件”安装管理员提供的本包，然后进入“设置 → 企业账号 → 连接企业”。账号和协作代码由本包固定版本交付；安装本身不会获得企业权限，不复制个人数据。退出企业账号返回个人空间。
```

**依据 2 · 源码核查**：[packages/enterprise-connection/index.mjs:1-2](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection/index.mjs#L1-L2)

Host 入口无业务逻辑。

```text
export const name="workdsh-enterprise-connection";
export function apply() {}
```

**依据 3 · 源码核查**：[packages/enterprise-connection/cordis.patch.yml:1-3](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection/cordis.patch.yml#L1-L3)

补丁仅声明加载组件。

```text
- insert:
    - id: workdsh-enterprise-connection
      name: workdsh-enterprise-connection
```

**依据 4 · 源码核查**：[packages/enterprise-connection/package.json:2-46](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection/package.json#L2-L46)

私有包声明客户端出口、捆绑依赖及精确 peer。

<details>
<summary>查看原文（45行）</summary>

```text
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
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
  },
  "dependencies": {
    "workdsh-provider-identity-enterprise": "0.1.0-alpha.3",
    "workdsh-plugin-enterprise-collaboration": "0.1.0-alpha.1"
  },
  "bundledDependencies": [
    "workdsh-provider-identity-enterprise",
    "workdsh-plugin-enterprise-collaboration"
  ],
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.5",
```

</details>

**依据 5 · 源码核查**：[apps/web/scripts/pack-enterprise-connection.mjs:5-24](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/web/scripts/pack-enterprise-connection.mjs#L5-L24)

生成浏览器入口、构建归档和清单。

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

- 没有管理员归档实物与签名或可信哈希来源
  **影响**：不能确认浏览器出口、两个依赖确实被装入当前发行物
  **进一步探讨**：固定一次交付归档，核清单来源并解包检查 manifest、浏览器出口和依赖

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 企业登录前后如何接线，何时会失败？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Desktop 从个人 Profile manifest 查找显式安装的连接包或企业依赖，检查文件存在、包名、desktop 导出与 DSH peer 完全一致。激活先向后台重新核验成员和组织，再将已安装代码打包到企业 Profile 的归档目录并运行生产依赖安装。随后移除个人身份 bundle，挂接企业组件，启动本机授权桥和企业 Runtime；定时复核认证及个人 Profile 依赖，失效时进入停止路径。组件接线阶段没有复制个人 Profile 的代码路径，但这项边界不能替代对后台数据权限与其他同步路径的审查。组装逐个生成包、写 manifest 后安装依赖，失败可能已留下中间文件，当前静态核查不足以承诺整条流程回滚。

#### 证据与依据

**依据 1 · 源码核查**：[apps/desktop/src/enterprise-plugins.ts:7-23](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/enterprise-plugins.ts#L7-L23)

安装检测和版本拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
export const enterprisePluginNames=['workdsh-provider-identity-enterprise','workdsh-plugin-enterprise-collaboration'] as const;
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

**依据 2 · 源码核查**：[apps/desktop/src/enterprise-plugins.ts:25-44](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/enterprise-plugins.ts#L25-L44)

只打包代码、写企业 Profile manifest 后安装。

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

**依据 3 · 源码核查**：[apps/desktop/src/workdsh-main.ts:398-423](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/workdsh-main.ts#L398-L423)

激活前验证，选入企业组件并启动工作区。

<details>
<summary>查看原文（26行）</summary>

```text
async function activateEnterprise(existingHome: boolean): Promise<void> {
  const session = enterprise
  if (!session) throw new Error('请重新登录企业账号')
  await session.login.verify()
  if (quitRequested) throw new Error('启动已取消')
  const pluginNames=await composeInstalledEnterprisePlugins(join(runtimeHome(),'profiles',PROFILE_NAME),join(session.home,'profiles',PROFILE_NAME),JSON.parse(readFileSync(join(bundledProfileDirectory(),'node_modules','@deepseek-ai','dsh','package.json'),'utf8')).version,bundledNodeExecutable(),join(bundledPrimaryRuntime(),'dependencies','pnpm','bin','pnpm.cjs'))
  if(quitRequested||enterprise!==session)throw new Error('企业启动已取消')
  const manifest = join(session.home, 'profiles', PROFILE_NAME, 'package.json')
  const selected = JSON.parse(readFileSync(manifest, 'utf8')) as { dsh?: { profile?: { bundles?: string[] } } }
  selected.dsh ??= {}; selected.dsh.profile ??= {}; selected.dsh.profile.bundles ??= []
  const bundles = selected.dsh.profile.bundles
  // Disable personal identity at composition, rather than allow an identity fallback.
  selected.dsh.profile.bundles = bundles.filter(name => name !== 'workdsh-provider-identity-local')
  for (const name of pluginNames) {
    if (!selected.dsh.profile.bundles.includes(name)) selected.dsh.profile.bundles.push(name)
  }
  writeFileSync(manifest, JSON.stringify(selected, null, 2) + '\n', { mode: 0o600 })
  session.authority = await startEnterpriseAuthority(session.login, session.deviceId, () => { void returnToEntry() }, () => { void returnToEntry() })
  // Record before writing either file, so a partial patch failure is also cleaned.
  session.authFile = join(session.home, 'enterprise-auth.json')
  const patch = desktopEnterprisePatch(session.home, session.authority, session.login.actor, session.login.backendUrl, session.deviceId, pluginNames.includes('workdsh-plugin-enterprise-collaboration'))
  session.authFile = patch.authFile
  const connection: DesktopConnection = { mode: 'enterprise', portalOrigin: session.login.backendUrl, organizationId: session.login.actor.organizationId, principalId: session.login.actor.id }
  if (window) await window.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(connectionLoadingHtml('正在启动企业工作区')))
  entrySurface = false
  await startRuntime(session.home, connection, [patch.patch], existingHome)
```

</details>

**依据 4 · 源码核查**：[apps/desktop/src/workdsh-main.ts:424-431](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/workdsh-main.ts#L424-L431)

运行中复核成员与已安装组件。

```text
  verifyTimer = setInterval(() => {
    if (verifying || switching) return
    verifying = true
    void session.login.verify().then(()=>{
      const current=installedEnterprisePlugins(join(runtimeHome(),'profiles',PROFILE_NAME),JSON.parse(readFileSync(join(bundledProfileDirectory(),'node_modules','@deepseek-ai','dsh','package.json'),'utf8')).version)
      if(pluginNames.some(name=>!current.includes(name)))throw new Error('企业插件已卸载，请重新安装后登录')
    }).catch(() => {
      dialog.showErrorBox('企业认证不可用', '企业账号已过期、被撤销、后台不可达或企业插件已卸载。本机企业运行将停止，请检查后重新登录。')
```

**依据 5 · 源码核查**：[apps/desktop/src/enterprise-auth.ts:45-62](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/enterprise-auth.ts#L45-L62)

客户端核对真实成员和组织，拒绝时尝试撤销。

<details>
<summary>查看原文（18行）</summary>

```text
    if (!data || typeof data.token !== 'string' || !/^[A-Za-z0-9_-]{32,256}$/u.test(data.token)) throw new Error('企业登录响应无效')
    try {
      const verified = await request(`${backend}/api/auth/me`, { headers: { Authorization: `Bearer ${data.token}` }, redirect: 'error', signal: AbortSignal.timeout(10_000) })
        .catch(() => { throw new Error('无法核验企业账号，请检查后台连接') })
      if (!verified.ok) throw new Error('企业账号核验失败')
      const actor = member(await verified.json())
      const admitted = data.member as { id?: unknown, organizationId?: unknown }
      if (!admitted || admitted.id !== actor.id || admitted.organizationId !== actor.organizationId) throw new Error('企业账号归属不一致')
      return new EnterpriseLogin(backend, data.token, actor, request)
    } catch (error) {
      // Login already created a backend session, even though local admission has not succeeded.
      let revoked = false
      try {
        const response = await request(`${backend}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${data.token}` }, redirect: 'error', signal: AbortSignal.timeout(10_000) })
        revoked = response.ok || response.status === 401
      } catch { /* local admission remains refused */ }
      if (!revoked) throw new Error(`${error instanceof Error ? error.message : '企业账号核验失败'}；后台登录撤销尚未确认`)
      throw error
```

</details>

#### 缺口

- 未检查完整后台权限和失败后企业 Profile 的所有状态
  **影响**：不能把源码上的装配边界当作账号隔离或原子回滚保证
  **进一步探讨**：用测试租户回放错版本、成员失效和依赖安装失败，核本机残留及后台审计

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候值得采用，退出和故障如何核验？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

已有管理员归档、匹配 DSH 0.2.1-rc.5 的 WorkDSH Desktop、可用测试企业后台和测试账号时，才具备核查安装、登录与协作的前提。验收脚本体现了 UI 安装、企业账号、协作、退出、重启和卸载的预期检查，但本轮未运行。退出清空本地 token 并取消请求，后台 logout 若不可达仍可能失败。管理员应分别核对本机退出、后台撤销和插件卸载；普通用户可退回个人空间，避免拿生产账号试错。需要承担后台、交付和宿主版本维护，以及失败时跨端排障，未量化成本。可对照只看安装成功与显示工件校验、身份核验、后台注销各状态的流程，测试能否减少把安装视为获权的误判；若重复核查或误判不降则放弃。

#### 证据与依据

**依据 1 · 源码核查**：[packages/enterprise-connection/package.json:42-66](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/packages/enterprise-connection/package.json#L42-L66)

精确客户端及宿主版本。

<details>
<summary>查看原文（25行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.5",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-layout": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-renderer": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-sidebar": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.1-rc.5",
    "react": "19.2.4",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.1-rc.5",
    "@deepseek-ai/dsh-session-persistence": "0.2.1-rc.5",
    "@deepseek-ai/dsh-session": "0.2.1-rc.5",
    "@deepseek-ai/dsh-util-values": "0.2.1-rc.5",
    "@deepseek-ai/dsh-api-session-controller": "0.2.1-rc.5",
    "@deepseek-ai/dsh": "0.2.1-rc.5",
    "@deepseek-ai/dsh-tools": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.1-rc.5",
    "react-dom": "19.2.4",
    "@deepseek-ai/dsh-client-ui-session": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-workspace": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-conversation": "0.2.1-rc.5",
    "@deepseek-ai/dsh-api-workspace-controller": "0.2.1-rc.5",
    "@deepseek-ai/dsh-client-ui-input-trigger": "0.2.1-rc.5",
    "@deepseek-ai/dsh-attachment": "0.2.1-rc.5",
    "@deepseek-ai/dsh-tool-present": "0.2.1-rc.5",
    "@deepseek-ai/dsh-fs": "0.2.1-rc.5"
```

</details>

**依据 2 · 源码核查**：[apps/desktop/src/enterprise-auth.ts:74-89](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/src/enterprise-auth.ts#L74-L89)

成员再核验和本地清空与后台撤销的分离。

<details>
<summary>查看原文（16行）</summary>

```text
  async verify(): Promise<EnterpriseMember> {
    const response = await this.request('/api/auth/me')
    if (!response.ok) throw new Error(`企业认证无效 (${response.status})`)
    const current = member(await response.json())
    if (current.id !== this.actor.id || current.organizationId !== this.actor.organizationId) throw new Error('企业账号归属已改变，请重新登录')
    return current
  }
  async logout(): Promise<boolean> {
    const token = this.#token
    this.#token = ''; this.cancelRequests()
    if (!token) return true
    try {
      const r = await this.#fetch(`${this.backendUrl}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(10_000) })
      return r.ok || r.status === 401
    }
    catch { return false }
```

</details>

**依据 3 · 源码核查**：[apps/desktop/scripts/accept-enterprise-installation.mjs:51-78](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/scripts/accept-enterprise-installation.mjs#L51-L78)

仓库验收代码规划安装、登录、协作与退出。

<details>
<summary>查看原文（28行）</summary>

```text
 await personal.getByText('插件安装中…',{exact:true}).waitFor({state:'hidden',timeout:180000});
 await personal.screenshot({path:join(directory,'installed-enterprise-plugin.png')});
 report.checks.installedThroughOfficialUi=true;
 await personal.getByText('设置',{exact:true}).first().click();
 await personal.getByText('企业账号',{exact:true}).first().click();
 await personal.getByRole('button',{name:'连接企业',exact:true}).waitFor({timeout:30000});
 await personal.screenshot({path:join(directory,'enterprise-connect.png')});
 await personal.getByRole('button',{name:'连接企业',exact:true}).click({noWaitAfter:true});
 const connectedEntry=await waitPage(p=>p.getByRole('heading',{name:'选择使用方式'}).count(),30000);
 report.checks.pluginConnectEntry=true;
 report.checks.enterpriseLoginEnabled=await connectedEntry.getByRole('button',{name:'企业登录',exact:true}).isEnabled();
 await connectedEntry.locator('#portal').fill(process.env.WORKDSH_TEST_BACKEND);
 await connectedEntry.getByRole('button',{name:'企业登录',exact:true}).click({noWaitAfter:true});
 const loginPage=await waitPage(p=>p.locator('#account').count());
 const accounts=JSON.parse(readFileSync(process.env.WORKDSH_TEST_ACCOUNTS,'utf8'));
 await loginPage.locator('#account').fill(accounts.members[0].email);
 await loginPage.locator('#password').fill(accounts.members[0].password);
 await loginPage.getByRole('button',{name:'登录并在本机运行'}).click({noWaitAfter:true});
 const enterprise=await waitPage(p=>/^http:\/\/127\.0\.0\.1:/.test(p.url())&&p.getByText('新会话',{exact:true}).count(),180000);
 const enterpriseContinue=enterprise.getByRole('button',{name:'继续',exact:true});if(await enterpriseContinue.count())await enterpriseContinue.click();
 await enterprise.getByText('协作',{exact:true}).first().click();
 await enterprise.getByRole('heading',{name:'协作',exact:true}).waitFor();
 report.checks.enterpriseCollaborationActive=true;
 await enterprise.getByText('设置',{exact:true}).first().click();
 await enterprise.getByText('企业账号',{exact:true}).first().click();
 await enterprise.getByRole('button',{name:'退出企业账号',exact:true}).click();
 await waitPage(p=>p.getByRole('heading',{name:'选择使用方式'}).count(),30000);
 report.checks.enterpriseLogout=true;
```

</details>

**依据 4 · 源码核查**：[apps/desktop/scripts/accept-enterprise-installation.mjs:84-105](https://github.com/techflag/workdsh/blob/e94c99d5f9e143fb67fec84a74978eb8218daf32/apps/desktop/scripts/accept-enterprise-installation.mjs#L84-L105)

重启、卸载与重新安装的预期检查。

<details>
<summary>查看原文（22行）</summary>

```text
 const restarted=await waitPage(p=>p.getByRole('heading',{name:'选择使用方式'}).count(),30000);
 report.checks.enterprisePluginSurvivesRestart=await restarted.getByRole('button',{name:'企业登录',exact:true}).isEnabled();
 report.checks.backendRemembered=await restarted.locator('#portal').inputValue()===process.env.WORKDSH_TEST_BACKEND;
 await restarted.getByRole('link',{name:'个人使用'}).click({noWaitAfter:true});
 const returnedPersonal=await waitPage(p=>/^http:\/\/127\.0\.0\.1:/.test(p.url())&&p.getByText('新会话',{exact:true}).count(),120000);
 await returnedPersonal.getByText('项目',{exact:true}).first().waitFor();
 report.checks.personalAfterLogout=true;
 await returnedPersonal.getByText('插件',{exact:true}).first().click();
 await returnedPersonal.getByText('workdsh-enterprise-connection',{exact:true}).click();
 await returnedPersonal.getByRole('button',{name:/卸载.*workdsh-enterprise-connection/}).click();
 await returnedPersonal.getByRole('button',{name:'卸载',exact:true}).click();
 await returnedPersonal.getByText('workdsh-enterprise-connection',{exact:false}).first().waitFor({state:'hidden',timeout:60000});
 report.checks.uninstalledThroughOfficialUi=true;
 const personalManifest=JSON.parse(readFileSync(join(env.WORKDSH_DESKTOP_USER_DATA,'dsh-home/profiles/workdsh/package.json'),'utf8'));
 report.checks.enterpriseDependencyRemoved=!personalManifest.dependencies?.['workdsh-enterprise-connection'];
 await returnedPersonal.getByRole('button',{name:'添加插件',exact:true}).click();
 await returnedPersonal.getByPlaceholder('例如 dsh-plugin-whale-pet').fill(process.env.WORKDSH_TEST_ENTERPRISE_ARCHIVE);
 await returnedPersonal.getByRole('button',{name:'安装',exact:true}).click();
 await returnedPersonal.getByRole('button',{name:'立即启用',exact:true}).waitFor({timeout:180000});
 await returnedPersonal.getByRole('button',{name:'立即启用',exact:true}).click();
 await returnedPersonal.getByText('插件安装中…',{exact:true}).waitFor({state:'hidden',timeout:180000});
 report.checks.reinstalledThroughOfficialUi=true;
```

</details>

#### 缺口

- 没有对应归档与企业后台上的实际运行或验收产物
  **影响**：缺少可确认的安装、权限及退出闭环，生产负担未量化
  **进一步探讨**：用隔离账号和归档运行正反用例，核对令牌撤销及个人与企业 Profile 状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
