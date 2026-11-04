# Sealos Skills

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[a8e45c9](https://github.com/labring/sealos-skills/tree/a8e45c97b498c460901dcf526a874ee949a9e0ea)

<!-- BEGIN META -->
[![GitHub ★ 83](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=83&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/labring/sealos-skills)
<!-- END META -->

> **功能**：向 DSH 注册 Sealos 部署与运维技能，提供模板部署、数据库、存储及故障诊断指引。

> **亮点**：[Q01](#research-q01) 将平台特定资源知识和部署验证路径接入DSH技能服务，属于知识编排与接口适配增量。

> **主要限制**：[Q02](#research-q02) 发布白名单没有包含托管分支引用的同级技能；脚本ready也不保证页面合格，必须限定本地路径并继续检查真实页面。

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
  - [Q01 · 这个包如何把部署知识接入 DSH，而不是自行执行云平台？](#detail-section-11)
  - [Q02 · 文档中的托管模式与验证步骤是否由发布包完整支撑？](#detail-section-12)
  - [Q03 · 从接入到失败恢复需要什么，部署成功代表什么？](#detail-section-13)
  - [Q04 · 如何收窄试用范围，并验证更可靠的交付边界？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：该包为在 Sealos Cloud 部署或运维应用的 DSH 用户提供 use-sealos 技能。package.json 声明 bundle patch，index.js 注入 skills 服务并注册 provider；list 返回单个候选，get 按名称返回技能定义，资源基目录指向技能文件夹。随后实际部署由模型读取技能、调用其 Python 脚本和 kubectl 完成，而不是 provider 自动执行。相比用户手动查阅部署文档并拼接命令，增量是按平台资源模型、模板路径和失败诊断组织的一份可加载操作知识。Kubernetes、Template API、数据库控制器和模型决策能力不属于本包原创；没有用户任务实测来证明15分钟路径或成功率。

基线为人工查阅Sealos/Kubernetes文档再执行命令；不将云平台能力算作本包贡献，也没有同任务运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| use-sealos技能加载 | 将平台部署知识交给DSH模型 | 需要skills服务，不自动执行部署 |
| 模板API辅助脚本 | 部署模板与查询实例 | 需要目标workspace凭据、网络与配额 |
| 就绪与HTTP诊断 | 查询工作负载并探测URL | ready不等于业务页面合格 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH skills 服务与bundle加载 | 必需 | 注册use-sealos | provider不能工作 |
| Sealos账号、目标workspace凭据与Python | 部署必需 | 认证和Template API | 停止并检查账号、地区与配额 |
| kubectl | 验收运维必需 | 回读工作负载及清理 | 不能验收或管理资源 |
| Docker buildx及镜像仓库 | 源码构建才需 | 产生linux/amd64镜像 | 可先选官方镜像或停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 接入 | 用户加载bundle并核对技能资源 | use-sealos可读取 |
| 准备 | 用户确认账号、命名空间与预算 | 凭据对应期望workspace |
| 执行 | 模型选择模板或构建镜像并请求部署 | 保存实例名称与请求结果 |
| 验收 | 用户与模型查就绪和真实页面 | 错误页或托管缺文件时停止，修复既有资源 |
| 退出 | 用户确认后清理测试资源 | 云端回读资源已删，检查剩余存储费用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 账号配额、构建资源费用未知 | 凭据和模板核对耗时未知 | 已有Sealos账号较合适 |
| 持续使用 | 应用、数据库、存储按平台计费，金额未知 | 查看状态与页面 | 不能据作者时间宣传量化节时 |
| 失败恢复 | 重建镜像和残留资源费用未知 | 查日志、修复原实例 | 不盲目重复部署 |
| 退出 | 剩余持久存储费用未知 | 删除后回读 | 需明确资源清单 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 技能发现 | provider注册单个技能并带资源基目录 | 目标DSH版本真实加载 |
| 部署交付 | 模板请求、就绪和页面核查路径可追溯 | 合格部署率、实际费用与节时 |

> **思考**：[Q02](#research-q02) 发布白名单没有包含托管分支引用的同级技能；脚本ready也不保证页面合格，必须限定本地路径并继续检查真实页面。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将平台特定资源知识和部署验证路径接入DSH技能服务，属于知识编排与接口适配增量。

[Q02](#research-q02) 前置解析技能元数据、按需读取与取消信号检查易复用；打包白名单与跨目录引用需要统一验收，HTTP可达和业务页面正确应明确分层。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发布白名单没有包含托管分支引用的同级技能；脚本ready也不保证页面合格，必须限定本地路径并继续检查真实页面。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定本地、无生产数据的小应用；同时验收页面和工作负载，托管资源缺失立即停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定版本的技能注册、部署请求和验证分支；支持局部本地试用，云端可用性未验证，未来联合契约是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、plugins/sealos/skills/use-sealos/SKILL.md、plugins/sealos/skills/use-sealos/scripts/sealos-api.py、plugins/sealos/skills/use-sealos/scripts/wait-app.sh 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、package、index、use-sealos技能与部署和等待脚本关键分支；未读取全部平台实现，未做跨租户授权验证。
- 下一步：未安装、执行目标脚本或部署云资源；仅源码检查。后续在隔离命名空间检查实际包、错误页面和清理。

**分析版本**

- **仓库**：[labring/sealos-skills](https://github.com/labring/sealos-skills)
- **版本号**：2.0.0（[固定提交 a8e45c9](https://github.com/labring/sealos-skills/tree/a8e45c97b498c460901dcf526a874ee949a9e0ea)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对发布资源闭包和页面语义建立联合验收契约，可能减少错误报完；尚未实现或验证。

未安装、执行目标脚本或部署云资源；仅源码检查。后续在隔离命名空间检查实际包、错误页面和清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 1915 | — | — | 12799 |
| .js | source | 3 | 283 | 250 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/labring/sealos-skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/labring/sealos-skills/issues?q=is%3Aissue+created%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/labring/sealos-skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T02%3A13%3A37.357Z..2026-11-04T02%3A13%3A37.357Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Sealos 技能包能否把平台部署知识转成可核验、可退出的 DSH 工作流？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个包如何把部署知识接入 DSH，而不是自行执行云平台？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

该包为在 Sealos Cloud 部署或运维应用的 DSH 用户提供 use-sealos 技能。package.json 声明 bundle patch，index.js 注入 skills 服务并注册 provider；list 返回单个候选，get 按名称返回技能定义，资源基目录指向技能文件夹。随后实际部署由模型读取技能、调用其 Python 脚本和 kubectl 完成，而不是 provider 自动执行。相比用户手动查阅部署文档并拼接命令，增量是按平台资源模型、模板路径和失败诊断组织的一份可加载操作知识。Kubernetes、Template API、数据库控制器和模型决策能力不属于本包原创；没有用户任务实测来证明15分钟路径或成功率。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:6-39](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/index.js#L6-L39)

技能provider真实注册与名称匹配

<details>
<summary>查看原文（34行）</summary>

```text
/** Same rank as packaged dsh skill providers (`BUNDLED_SKILL_RANK` in `@deepseek-ai/dsh-skill`). */
const BUNDLED_SKILL_RANK = 600
const SKILL_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const PROVIDER_NAME = 'sealos'
const SKILL_DIR = fileURLToPath(new URL('./plugins/sealos/skills/use-sealos/', import.meta.url))
const SKILL_FILE = fileURLToPath(new URL('./plugins/sealos/skills/use-sealos/SKILL.md', import.meta.url))
const RESOURCE_BASE = { kind: 'directory', path: SKILL_DIR }
const INVOCATION = { modelInvocable: true, userInvocable: true }

export const name = 'sealos-skill'
export const inject = ['skills']

/**
 * Register the packaged `use-sealos` skill on `ctx.skills`.
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  parseSkillFile(readFileSync(SKILL_FILE, 'utf8'))
  ctx.skills.registerProvider(() => ({
    name: PROVIDER_NAME,
    async list(options) {
      options?.signal?.throwIfAborted()
      const skill = await loadSkill(options?.signal)
      options?.signal?.throwIfAborted()
      return [toCandidate(skill)]
    },
    async get(candidate, options) {
      options?.signal?.throwIfAborted()
      const skill = await loadSkill(options?.signal)
      if (candidate.name !== skill.name) return undefined
      return toDefinition(skill)
    },
  }))
}
```

</details>

**依据 2 · 源码核查**：[package.json:14-18](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/package.json#L14-L18)

发布文件范围

```text
  "files": [
    "index.js",
    "cordis.patch.yml",
    "plugins/sealos/skills/use-sealos"
  ],
```

**依据 3 · 作者声明**：[plugins/sealos/skills/use-sealos/SKILL.md:18-52](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L18-L52)

平台模型及工具职责

<details>
<summary>查看原文（35行）</summary>

```text
## Sealos resource model

Sealos Cloud is a multi-tenant Kubernetes platform. Everything a user owns
lives in one **namespace** (`ns-xxx`) per **workspace**, accessed with a
restricted **kubeconfig** (`~/.sealos/kubeconfig`). Within the namespace:

- **Apps** are ordinary Deployments/StatefulSets + Service + Ingress, labeled
  `cloud.sealos.io/app-deploy-manager: <app>` so the Sealos "App Launchpad" UI
  can manage them. Public HTTPS comes free via `<host>.<region-domain>` and a
  wildcard cert.
- **Databases** are KubeBlocks `Cluster` CRs managed by the "Database" UI.
- **Template store** hosts 200+ one-click templates (`sealos-api.py
  store-list`); deployed templates are tracked as instances and appear in the
  UI.
- **Object storage** buckets are `ObjectStorageBucket` CRs with S3-compatible
  credentials in managed secrets.
- A **region** is one cluster + domain (e.g. `usw-1.sealos.io` for
  international, `bja.sealos.run` etc. for China). The Template API lives at
  `https://template.<region-domain>`.

## Tools

Resolve `scripts/` and `references/` against this skill's directory, not the
project working directory.

- `scripts/sealos-api.py` — auth (`status`, `login`, `workspaces`, `switch`)
  and the Template API (`deploy`, `store-list`). Deploying through the
  Template API (not raw `kubectl apply`) is what makes resources show up as a
  deletable unit in the Sealos UI.
- `kubectl` with `export KUBECONFIG=~/.sealos/kubeconfig` — all reads,
  debugging, and deletions. The kubeconfig is namespace-scoped; you cannot see
  or touch other tenants.
- `scripts/wait-app.sh` — post-deploy verification (workload readiness + URL
  probe + failure diagnostics).
- `docker buildx` — only for the source-build path.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文档中的托管模式与验证步骤是否由发布包完整支撑？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

需要区分本地交互路径与 Brain 托管路径。use-sealos 在 managed 环境要求转到同级 sealos-deploy，但发布files仅含 index.js、patch 和 use-sealos 子树，index provider也只返回use-sealos；因此按该发布清单构造的包不包含托管入口文件。仓库存在托管技能不等于发布包已提供它。另一个边界是 wait-app.sh 将非000且小于500的HTTP状态视为可响应，404也可令脚本返回ready；技能规则另要求真实页面2xx/3xx并检查SSR错误正文，因此用户或模型仍须独立检查页面，不能只信脚本ready。这里核查的是固定文件的可达性和条件分支，没有执行打包或云部署，不能宣称已经复现失败。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-18](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/package.json#L14-L18)

发布白名单不包含同级托管技能

```text
  "files": [
    "index.js",
    "cordis.patch.yml",
    "plugins/sealos/skills/use-sealos"
  ],
```

**依据 2 · 源码核查**：[index.js:9-13](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/index.js#L9-L13)

provider绑定唯一use-sealos目录

```text
const PROVIDER_NAME = 'sealos'
const SKILL_DIR = fileURLToPath(new URL('./plugins/sealos/skills/use-sealos/', import.meta.url))
const SKILL_FILE = fileURLToPath(new URL('./plugins/sealos/skills/use-sealos/SKILL.md', import.meta.url))
const RESOURCE_BASE = { kind: 'directory', path: SKILL_DIR }
const INVOCATION = { modelInvocable: true, userInvocable: true }
```

**依据 3 · 源码核查**：[plugins/sealos/skills/use-sealos/SKILL.md:54-59](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L54-L59)

托管分支引用未随包白名单包含的同级资源

```text
## Preflight

If `SEALAI_DEPLOY_MODE` is `managed` (a Brain-managed sandbox), stop here and
follow [../sealos-deploy/SKILL.md](../sealos-deploy/SKILL.md) instead — that
mode forbids login and interactive prompts. Everything below is the local
interactive path.
```

**依据 4 · 源码核查**：[plugins/sealos/skills/use-sealos/scripts/wait-app.sh:169-192](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/scripts/wait-app.sh#L169-L192)

HTTP小于500可退出成功

<details>
<summary>查看原文（24行）</summary>

```text
HTTP_CODE=""
if [ -n "$URL" ]; then
  while :; do
    # NOTE: -w prints its code even when curl fails (e.g. 000 on timeout), so
    # a `|| echo 000` fallback would concatenate into "000000" and a numeric
    # -lt test would then treat it as 0 and pass. Capture, then sanitize.
    HTTP_CODE=$(curl -k -s -o /dev/null -w '%{http_code}' --max-time 30 -L "$URL" 2>/dev/null) || true
    case "$HTTP_CODE" in *[!0-9]* | "") HTTP_CODE=000 ;; esac
    HTTP_CODE=$(printf '%03d' "$((10#$HTTP_CODE))")
    if [ "$HTTP_CODE" != "000" ] && [ "$HTTP_CODE" -lt 500 ]; then
      break
    fi
    ELAPSED=$(( $(date +%s) - START ))
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
      diagnose
      printf '{"ready":false,"reason":"workloads ready but URL not responding","url":"%s","last_http_code":"%s"}\n' "$URL" "$HTTP_CODE"
      exit 1
    fi
    echo "waiting for URL (${ELAPSED}s): last code $HTTP_CODE" >&2
    sleep 5
  done
fi

printf '{"ready":true,"elapsed_seconds":%s,"http_code":"%s"}\n' "$ELAPSED" "${HTTP_CODE:-skipped}"
```

</details>

**依据 5 · 源码核查**：[plugins/sealos/skills/use-sealos/SKILL.md:139-159](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L139-L159)

独立真实页面验证和变更后回读规则

<details>
<summary>查看原文（21行）</summary>

```text
## Execution rules

1. **Never report a deploy as successful without evidence**: `wait-app.sh`
   exits 0 AND the public URL returns a real page (2xx/3xx, and for
   SSR apps the body is not an error page). If verification fails, triage via
   [operate.md](references/operate.md) — do not re-deploy blindly.
2. Production images are built and pushed as **linux/amd64** (`docker buildx
   build --platform linux/amd64`). Apple Silicon defaults produce arm64
   images that crash-loop on Sealos with `exec format error`.
3. Resource requests/limits follow the platform ladder
   ([platform.md](references/platform.md)); requests are derived from limits,
   and memory always uses `Mi` values.
4. Deploy through the Template API. Fall back to `kubectl apply` only for
   single resources during debugging, and remember `kubectl apply` rejects
   Deployment+`volumeClaimTemplates` (use StatefulSet).
5. Destructive actions (deleting apps, databases, buckets; switching
   workspace on a shared machine), public-access changes, credential rotation,
   and system-tool installation require explicit user confirmation first.
6. Never print secret values. Read them into shell variables or pipe them;
   show the user only names and how to fetch values.
7. After mutations, read back state (`kubectl get ...`) before describing it.
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 从接入到失败恢复需要什么，部署成功代表什么？

**研究主题**：效果与总成本、依赖、兼容与流程

#### 完整回答

本地路径需要Sealos账号及目标workspace的kubeconfig，Python脚本读取凭据向地区Template API发送部署请求；源码构建另外需要Docker buildx、镜像仓库和对应凭据。deploy命令将HTTP 200/201映射success，并另外返回Brain adoption结果，但HTTP接受不是工作负载就绪，项目接管失败也不应通过重新创建实例掩盖。部署、数据库和存储会消耗账号配额，金额与具体任务耗时未采集。用户承担确认命名空间、资源额度、公开入口、检查就绪与页面以及失败清理的责任。普通运维可用kubectl回读日志；删除资源和公开访问变更在技能中要求确认。这些是操作约束，强制权限来自云平台kubeconfig和宿主工具授权，不能把提示文档当租户隔离证明。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/sealos/skills/use-sealos/SKILL.md:61-109](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L61-L109)

认证、配额及部署后的接管/验证步骤

<details>
<summary>查看原文（49行）</summary>

````text
```bash
python3 scripts/sealos-api.py status
```

- `authenticated: true` → proceed; note `namespace` and `region_domain`.
- Not authenticated → run `python3 scripts/sealos-api.py login` **in the
  background**, watch its stderr, and relay the sign-in URL to the user the
  moment it prints (the code expires; never sit silently until the command
  ends). Users can alternatively paste a kubeconfig from the Sealos web
  console (top-left avatar → kubeconfig) into `~/.sealos/kubeconfig`.
- Wrong region? `login --region <url>`. Wrong workspace? `workspaces` +
  `switch <name>`.

Deploys, database creation, and storage consume the account's quota/balance —
if a deploy is rejected with a quota error, report it; do not silently retry
with smaller numbers.

## Deploy decision tree (the 15-minute path)

When the user wants something deployed, classify it FIRST — the wrong path
wastes the whole time budget:

1. **Known self-hosted product** (Uptime Kuma, Metabase, n8n, ...):
   `python3 scripts/sealos-api.py store-list --search <name>`.
   - Store hit → deploy the store template ([deploy.md](references/deploy.md),
     Path A). Fastest and battle-tested; done in ~3 min.
   - No store hit → check [recipes.md](references/recipes.md) for a
     ready-made recipe, else use the official Docker image and write a
     template ([deploy.md](references/deploy.md), Path B). **Never build a
     product from source when an official image exists.**
2. **User's own project (has source code)**: look for an existing
   Dockerfile/compose file, else generate one, build for **linux/amd64**,
   push, then deploy the image ([build.md](references/build.md) then
   [deploy.md](references/deploy.md) Path B).
3. **Just a database / bucket**: [databases.md](references/databases.md) /
   platform.md's object storage section — deploy as a minimal template.

After ANY deploy, verify before reporting:

```bash
bash scripts/wait-app.sh -u https://<host>.<region-domain> deployment/<name> [cluster/<name>-pg ...]
```

On `*.sealos.io` regions, local deploys also claim a Brain Project in-script;
if `brain_adoption.ok` is false, or `warnings` still lists
`incompleteResourceSet` after verify, run `sealos-api.py adopt <instance>` —
never redeploy. On `*.sealos.run` this is skipped
(`brain_adoption.reason: not-sealos-io`). See
[deploy.md](references/deploy.md).
````

</details>

**依据 2 · 源码核查**：[plugins/sealos/skills/use-sealos/scripts/sealos-api.py:526-563](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/scripts/sealos-api.py#L526-L563)

模板请求与HTTP成功、adoption返回

<details>
<summary>查看原文（38行）</summary>

```text
def cmd_deploy(args):
    if not os.path.exists(args.template):
        fail("template file not found", path=args.template)
    with open(args.template) as f:
        yaml_text = f.read()

    deploy_args = parse_deploy_args(args)
    extra_labels = parse_extra_labels(args)
    kubeconfig = load_kubeconfig()
    domain = region_domain()
    url = f"https://template.{domain}/api/v2alpha/templates/raw"
    body = {"yaml": yaml_text, "args": deploy_args, "dryRun": bool(args.dry_run)}
    if extra_labels:
        body["extraLabels"] = extra_labels
    status, resp = http_json(
        url,
        method="POST",
        headers={"Authorization": urllib.parse.quote(kubeconfig, safe="")},
        data=body,
        timeout=120,
    )
    ok = status in (200, 201)
    result = {
        "success": ok,
        "dry_run": bool(args.dry_run),
        "status": status,
        "deploy_url": url,
        "response": resp,
    }
    if ok:
        result["brain_adoption"] = maybe_adopt_template_instance(
            extract_instance_name(resp),
            template_name=template_name_from_yaml(yaml_text),
            dry_run=bool(args.dry_run),
        )
    print(json.dumps(result, indent=2))
    if not ok:
        sys.exit(1)
```

</details>

**依据 3 · 源码核查**：[plugins/sealos/skills/use-sealos/SKILL.md:139-172](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L139-L172)

危险变更确认与回读不是服务器权限机制

<details>
<summary>查看原文（34行）</summary>

```text
## Execution rules

1. **Never report a deploy as successful without evidence**: `wait-app.sh`
   exits 0 AND the public URL returns a real page (2xx/3xx, and for
   SSR apps the body is not an error page). If verification fails, triage via
   [operate.md](references/operate.md) — do not re-deploy blindly.
2. Production images are built and pushed as **linux/amd64** (`docker buildx
   build --platform linux/amd64`). Apple Silicon defaults produce arm64
   images that crash-loop on Sealos with `exec format error`.
3. Resource requests/limits follow the platform ladder
   ([platform.md](references/platform.md)); requests are derived from limits,
   and memory always uses `Mi` values.
4. Deploy through the Template API. Fall back to `kubectl apply` only for
   single resources during debugging, and remember `kubectl apply` rejects
   Deployment+`volumeClaimTemplates` (use StatefulSet).
5. Destructive actions (deleting apps, databases, buckets; switching
   workspace on a shared machine), public-access changes, credential rotation,
   and system-tool installation require explicit user confirmation first.
6. Never print secret values. Read them into shell variables or pipe them;
   show the user only names and how to fetch values.
7. After mutations, read back state (`kubectl get ...`) before describing it.
8. One deploy at a time per app name; name collisions in a shared namespace
   break selectors. Random suffixes (`-a1b2c3d4`) are there for a reason —
   keep them.
9. If the agent sandbox blocks writes outside the workspace, escalate file
   access for writing `~/.sealos/kubeconfig`, using the Docker socket, and any
   command that must read that kubeconfig.

## Response format

After each operation report: what was deployed/changed (names + namespace),
the public URL if any, verification evidence (ready state, HTTP code), and
credentials location (secret names, never values). On failure: the failing
resource, the decisive log/event lines, and the next action you are taking.
```

</details>

#### 缺口

- 没有固定账户与同任务部署成本/恢复记录
  **影响**：不能给出完成一次合格部署的总费用和时间
  **进一步探讨**：在隔离命名空间记录一次成功和一次故障的资源账单、人工处置与删除回读

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何收窄试用范围，并验证更可靠的交付边界？

**研究主题**：新假设与验证、采用判断

#### 完整回答

对已有Sealos账号且熟悉命名空间资源的用户，可只在本地交互路径试用一个可删除、无生产数据的应用；先确认实际包内资源可读，生成模板后检查资源预算，再同时验收工作负载与真实页面。如果环境要求managed路径、包内同级技能缺失，或页面返回404/错误正文，应停止并返回人工文档流程。由发布边界和HTTP条件可提出未验证假设：把技能引用资源的完整性检查与页面语义验收加入交付契约，比单一ready更能避免错误报完。最小比较让相同模板分别返回200正常、200错误页、404与超时，并检测本地和托管两种打包引用；若新契约仍把缺文件或错误页放行，或只增加提示而不改变用户决策，该假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-18](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/package.json#L14-L18)

包内资源范围决定试用模式

```text
  "files": [
    "index.js",
    "cordis.patch.yml",
    "plugins/sealos/skills/use-sealos"
  ],
```

**依据 2 · 源码核查**：[plugins/sealos/skills/use-sealos/scripts/wait-app.sh:169-192](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/scripts/wait-app.sh#L169-L192)

脚本响应检查需补充语义验收

<details>
<summary>查看原文（24行）</summary>

```text
HTTP_CODE=""
if [ -n "$URL" ]; then
  while :; do
    # NOTE: -w prints its code even when curl fails (e.g. 000 on timeout), so
    # a `|| echo 000` fallback would concatenate into "000000" and a numeric
    # -lt test would then treat it as 0 and pass. Capture, then sanitize.
    HTTP_CODE=$(curl -k -s -o /dev/null -w '%{http_code}' --max-time 30 -L "$URL" 2>/dev/null) || true
    case "$HTTP_CODE" in *[!0-9]* | "") HTTP_CODE=000 ;; esac
    HTTP_CODE=$(printf '%03d' "$((10#$HTTP_CODE))")
    if [ "$HTTP_CODE" != "000" ] && [ "$HTTP_CODE" -lt 500 ]; then
      break
    fi
    ELAPSED=$(( $(date +%s) - START ))
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
      diagnose
      printf '{"ready":false,"reason":"workloads ready but URL not responding","url":"%s","last_http_code":"%s"}\n' "$URL" "$HTTP_CODE"
      exit 1
    fi
    echo "waiting for URL (${ELAPSED}s): last code $HTTP_CODE" >&2
    sleep 5
  done
fi

printf '{"ready":true,"elapsed_seconds":%s,"http_code":"%s"}\n' "$ELAPSED" "${HTTP_CODE:-skipped}"
```

</details>

**依据 3 · 源码核查**：[plugins/sealos/skills/use-sealos/SKILL.md:139-159](https://github.com/labring/sealos-skills/blob/a8e45c97b498c460901dcf526a874ee949a9e0ea/plugins/sealos/skills/use-sealos/SKILL.md#L139-L159)

现有人工/模型检查作为比较基线

<details>
<summary>查看原文（21行）</summary>

```text
## Execution rules

1. **Never report a deploy as successful without evidence**: `wait-app.sh`
   exits 0 AND the public URL returns a real page (2xx/3xx, and for
   SSR apps the body is not an error page). If verification fails, triage via
   [operate.md](references/operate.md) — do not re-deploy blindly.
2. Production images are built and pushed as **linux/amd64** (`docker buildx
   build --platform linux/amd64`). Apple Silicon defaults produce arm64
   images that crash-loop on Sealos with `exec format error`.
3. Resource requests/limits follow the platform ladder
   ([platform.md](references/platform.md)); requests are derived from limits,
   and memory always uses `Mi` values.
4. Deploy through the Template API. Fall back to `kubectl apply` only for
   single resources during debugging, and remember `kubectl apply` rejects
   Deployment+`volumeClaimTemplates` (use StatefulSet).
5. Destructive actions (deleting apps, databases, buckets; switching
   workspace on a shared machine), public-access changes, credential rotation,
   and system-tool installation require explicit user confirmation first.
6. Never print secret values. Read them into shell variables or pipe them;
   show the user only names and how to fetch values.
7. After mutations, read back state (`kubectl get ...`) before describing it.
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
