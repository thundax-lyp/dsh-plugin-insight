# deepseek-harness-docker

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[0437140](https://github.com/runzhliu/deepseek-harness-docker/tree/043714057c0c2ef53a5023a3117c5f25fe5af62c)

<!-- BEGIN META -->
[![GitHub ★ 146](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=146&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/runzhliu/deepseek-harness-docker)
<!-- END META -->

> **功能**：将官方 DSH 发行物封装为带 Web UI 和 Chromium 桌面的容器运行环境。

> **亮点**：[Q01](#research-q01) 将发行物、浏览器和默认运行配置组装为可部署单元。

> **主要限制**：[Q02](#research-q02) 健康探针不覆盖实际模型和会话，浏览器禁用自身沙箱，容器硬化不能证明租户隔离。

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
  - [Q01 · 容器方案替部署者减少哪些准备？](#detail-section-11)
  - [Q02 · 运行边界、健康探针与 Chromium 隔离各证明什么？](#detail-section-12)
  - [Q03 · 如何低成本验证部署并安全退出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：部署者要为 DSH 建立可启动、可备份的独立实例。

手工配置 DSH CLI、Node、浏览器和部署文件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 容器部署 | 启动固定 DSH 发行物 | 需容器运行时与持久卷 |
| 浏览器桌面 | 提供 Chromium 和 noVNC | 与浏览器隔离、认证和网络策略分开验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持的容器运行时 | 必需 | 启动镜像与服务 | 无法启动 |
| 独立卷及测试凭据 | 验收必需 | 持久化及模型试验 | 需检查权限和恢复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定镜像并建立空卷 | 默认回环与版本明确 |
| 验收 | 用户查鉴权、模型、浏览器和重启 | 独立核对每项 |
| 退出 | 用户停用并用原部署或旧备份 | 保留测试记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 运行资源未知 | 拉取镜像、配置卷和凭据 | 依赖目标平台 |
| 持续 | 浏览器及模型资源未知 | 复核升级和卷 | 健康状态覆盖有限 |
| 失败 | 恢复开销未知 | 回旧卷并查日志 | 不能用未验证状态继续升级 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 部署 | 固定上游发行物与浏览器启动配置 | 目标环境实际稳定性 |
| 健康 | 检查三个本地 HTTP 入口 | 认证后会话和真实模型 |

> **思考**：[Q02](#research-q02) 健康探针不覆盖实际模型和会话，浏览器禁用自身沙箱，容器硬化不能证明租户隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将发行物、浏览器和默认运行配置组装为可部署单元。

[Q02](#research-q02) 基础容器限制降低默认暴露，仍需验证出站网络、浏览器和卷范围。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 健康探针不覆盖实际模型和会话，浏览器禁用自身沙箱，容器硬化不能证明租户隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用空卷在回环验收实际会话、浏览器和恢复，再扩大访问。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认基础镜像配置、入口及探针。真实构建、部署与任务未复验。

- 已检查：作者 README、包清单、源码路径 README.md、Dockerfile、compose.yaml、scripts/deepseek-harness-entrypoint、compose.lan.yaml、scripts/chromium-docker 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库 Dockerfile、Compose、入口和作者验证说明。未构建、拉取或运行容器及模型。
- 下一步：核对镜像、权限、认证、持久化、浏览器、网络与模型任务。

**分析版本**

- **仓库**：[runzhliu/deepseek-harness-docker](https://github.com/runzhliu/deepseek-harness-docker)
- **版本号**：未声明（[固定提交 0437140](https://github.com/runzhliu/deepseek-harness-docker/tree/043714057c0c2ef53a5023a3117c5f25fe5af62c)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 增加鉴权后写读和恢复验收，对照探针误通过率。

核对镜像、权限、认证、持久化、浏览器、网络与模型任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 1774 | — | — | 25707 |
| .js | source | 7 | 1002 | 936 | 17 | — |
| .js | test | 1 | 129 | 127 | 8 | — |
| .tsx | source | 1 | 55 | 54 | 1 | — |
| .cjs | source | 5 | 445 | 427 | 19 | — |
| .cjs | test | 1 | 83 | 78 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/runzhliu/deepseek-harness-docker/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/runzhliu/deepseek-harness-docker/issues?q=is%3Aissue+created%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/runzhliu/deepseek-harness-docker/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A25%3A48.280Z..2026-11-05T03%3A25%3A48.280Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：部署者能否用固定镜像获得可验收的 DSH 运行环境，并区分探针、持久化和隔离？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 容器方案替部署者减少哪些准备？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要独立 DSH 实例的团队可将固定上游 npm 发行物、Node 运行时与 Chromium/noVNC 组合部署，依赖卷区分工作区和 DSH 数据。相较手工装 Node、CLI 和图形浏览器，仓库提供容器入口和健康检查。根交付是运行环境，不能将仓库中可选插件或部署 Skill 当成根条目是 DSH 插件。正常交付应包括已固定的镜像、认证入口、可写工作区与重启后的数据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-25](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/README.md#L13-L25)

作者区分封装上游与容器版本。

<details>
<summary>查看原文（13行）</summary>

```text
DeepSeek Harness（DSH）以本地使用为中心，桌面版也延续了这一形态。企业内部推进 Agent 化，需要把运行环境部署到云上，按任务创建实例、动态分配资源，并支持快速迭代。**云上运行、动态供给、快速迭代，是企业内部 Agent 化的基础。**

本项目将官方 DSH npm 发行物封装为可复现的 Docker 运行环境，为通过 Kubernetes 部署和管理独立的 Agent 实例提供基础。默认提供 Web UI、非 root 的 Node.js 24 运行时与可视 Chromium/noVNC 桌面，可选插件市场和受保护局域网入口，不修改 DSH 源码。

**DeepSeek Harness 最早一批非官方 Docker 镜像项目之一，自 [2026 年 8 月 13 日](https://github.com/runzhliu/deepseek-harness-docker/commit/0d12e3bdb6dc5c0f408870b73b1914359a4f9aca) 起持续维护。** 提供 Docker Hub / GHCR 双架构镜像、Docker Compose、Rootless Podman 和 Helm 部署，持续跟进官方版本。

> 当前基线：`@deepseek-ai/dsh@0.2.2-rc.1`。DeepSeek Harness 仍处于预发布阶段；升级前应重新完成本文的构建和 Smoke Test。

`0.2.2-rc.1` 直接对应官方 [`dsh-v0.2.2-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1) Release 与 npm Registry 的 [`@deepseek-ai/dsh@0.2.2-rc.1`](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.2-rc.1)，并非本项目自定义版本。本项目封装 npm 成品而不从源码构建，因此以可安装的官方发行物为基线，并故意不发布漂移的 Docker `latest` 标签。

`0.2.2-rc.1` 新增插件更新、引用消息、完整会话 Markdown 复制和多语言界面，并改进手机操作、缓存与会话恢复。

> **0.2.2 迁移：** 最低 Node.js 为 `24.9`；自定义插件需核对 Session 投影、工具执行和 PTC 接口。Web Fetch 允许内网地址，部署需自行限制出站网络；自定义模型应显式填写容量。升级前备份数据卷，降级使用旧卷备份。详见[官方说明](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1)。
```

</details>

**依据 2 · 源码核查**：[Dockerfile:287-319](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/Dockerfile#L287-L319)

复制上游包并检查版本。

<details>
<summary>查看原文（33行）</summary>

```text
COPY --from=installer /usr/local/lib/node_modules/@deepseek-ai/dsh /usr/local/lib/node_modules/@deepseek-ai/dsh
COPY --from=installer /usr/local/lib/node_modules/pnpm /usr/local/lib/node_modules/pnpm
COPY --from=installer /opt/dsh-browser-use/node_modules/. /usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/
COPY scripts/chromium-docker /usr/local/bin/chromium-docker
COPY scripts/dsh-container /usr/local/bin/dsh
COPY scripts/deepseek-harness-entrypoint /usr/local/bin/deepseek-harness-entrypoint
COPY scripts/dsh-web-relay.cjs /opt/deepseek-harness/dsh-web-relay.cjs
COPY plugins/dsh-browser-desktop /opt/deepseek-harness/plugins/dsh-browser-desktop

RUN chmod 0755 /usr/local/bin/chromium-docker \
        /usr/local/bin/dsh \
        /usr/local/bin/deepseek-harness-entrypoint \
    && mkdir -p \
      /usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@runzhliu \
      /opt/deepseek-harness/plugins/dsh-browser-desktop/node_modules/@deepseek-ai \
    && ln -s /opt/deepseek-harness/plugins/dsh-browser-desktop \
      /usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@runzhliu/dsh-browser-desktop \
    && ln -s /usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/schemastery \
      /opt/deepseek-harness/plugins/dsh-browser-desktop/node_modules/@deepseek-ai/schemastery \
    && ln -s ../lib/node_modules/pnpm/bin/pnpm.cjs /usr/local/bin/pnpm \
    && ln -s ../lib/node_modules/pnpm/bin/pnpx.cjs /usr/local/bin/pnpx \
    && ln -s chromium-docker /usr/local/bin/chrome \
    && ln -s chromium-docker /usr/local/bin/google-chrome \
    && ln -s chromium-docker /usr/local/bin/google-chrome-stable \
    && if [ ! -e /usr/share/novnc/index.html ]; then \
      ln -s vnc.html /usr/share/novnc/index.html; \
    fi \
    && test "$(dsh --version)" = "${DSH_VERSION}" \
    && test "$(pnpm --version)" = "${PNPM_VERSION}" \
    && test "$(node -p 'require("/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-browser-use/package.json").version')" = "${DSH_VERSION}" \
    && test "$(node -p 'require("/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-experimental-browser-use-playwright-mcp/package.json").version')" = "${DSH_VERSION}" \
    && node -e "Promise.all([import('/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-browser-use/lib/index.js'), import('/usr/local/lib/node_modules/@deepseek-ai/dsh/node_modules/@deepseek-ai/dsh-experimental-browser-use-playwright-mcp/lib/index.js')])" \
    && chromium-docker --version
```

</details>

**依据 3 · 源码核查**：[Dockerfile:321-345](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/Dockerfile#L321-L345)

数据目录和非 root 用户。

<details>
<summary>查看原文（25行）</summary>

```text
ENV DSH_HOME=/home/node/.dsh \
    DSH_TELEMETRY_DISABLED=1 \
    DSH_NOVNC_ASSET_REVISION=${NOVNC_ASSET_REVISION} \
    CHROMIUM_FLAVOR=${CHROMIUM_FLAVOR} \
    HOME=/workspace \
    NPM_CONFIG_CACHE=/home/node/.dsh/npm-cache \
    DISPLAY=:99 \
    XDG_RUNTIME_DIR=/tmp/runtime-node \
    CHROME_BIN=/usr/local/bin/chromium-docker \
    CHROME_PATH=/usr/local/bin/chromium-docker \
    BROWSER=/usr/local/bin/chromium-docker \
    PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-docker \
    XDG_CACHE_HOME=/tmp/.cache \
    XDG_CONFIG_HOME=/tmp/.config \
    XDG_DATA_HOME=/tmp/.local/share

COPY --chown=node:node web.cordis.patch.yml /opt/deepseek-harness/web.cordis.patch.yml

RUN mkdir -p "${DSH_HOME}" /workspace \
    && chown -R node:node "${DSH_HOME}" /workspace

USER node
WORKDIR /workspace

EXPOSE 3080 6080
```

</details>

**依据 4 · 源码核查**：[compose.yaml:1-24](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/compose.yaml#L1-L24)

容器、端口和卷。

<details>
<summary>查看原文（24行）</summary>

```text
services:
  deepseek-harness:
    build:
      context: .
      args:
        DSH_VERSION: ${DSH_VERSION:-0.2.2-rc.1}
        IMAGE_VERSION: ${DSH_IMAGE_VERSION:-0.2.2-rc.1-r1}
        NODE_IMAGE: ${NODE_IMAGE:-docker.io/library/node:24-trixie}
        PNPM_VERSION: ${PNPM_VERSION:-10.15.1}
    image: ${DSH_IMAGE_REPOSITORY:-docker.io/runzhliu/deepseek-harness}:${DSH_IMAGE_VERSION:-0.2.2-rc.1-r1}
    ports:
      - "127.0.0.1:${DSH_PORT:-3080}:3080"
      - "127.0.0.1:${DSH_DESKTOP_PORT:-6080}:6080"
    environment:
      DSH_TELEMETRY_DISABLED: "1"
      DSH_DESKTOP_ENABLED: "1"
      DSH_BROWSER_USE_ENABLED: ${DSH_BROWSER_USE_ENABLED:-1}
      DSH_WEB_RELAY_INTERFACE: ${DSH_WEB_RELAY_INTERFACE:-}
      DSH_DESKTOP_PUBLIC_PORT: ${DSH_DESKTOP_PORT:-6080}
      HOME: /workspace
    volumes:
      - dsh-home:/home/node/.dsh
      - ${DSH_WORKSPACE:-dsh-workspace}:/workspace
    read_only: true
```

</details>

#### 缺口

- 没有独立重建与部署对照
  **影响**：无法证明制品可重复或实际接入时间
  **进一步探讨**：在两个架构以固定输入重建并回读版本

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 运行边界、健康探针与 Chromium 隔离各证明什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

基础 Compose 发布到主机回环，容器根文件系统只读、丢弃 capabilities、开启 no-new-privileges，但挂载的工作区和 DSH_HOME 仍可写。入口在 Web 模式启动 relay、按条件启动桌面，再启动 DSH，退出时清理子进程。内部 x11vnc 无密码并只听 localhost，经 websockify 暴露在容器端口；LAN overlay 有单地址绑定及 Caddy 配置，不能把基础回环与可选 LAN 混为一谈。Chromium 启动脚本传 --no-sandbox，容器限制不能证明浏览器自身隔离或多租户边界。健康检查要求 Web 返回 401、noVNC 和 CDP 响应，未做真实模型、认证后会话或浏览器任务。

#### 证据与依据

**依据 1 · 源码核查**：[compose.yaml:11-46](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/compose.yaml#L11-L46)

回环、硬化与探针。

<details>
<summary>查看原文（36行）</summary>

```text
    ports:
      - "127.0.0.1:${DSH_PORT:-3080}:3080"
      - "127.0.0.1:${DSH_DESKTOP_PORT:-6080}:6080"
    environment:
      DSH_TELEMETRY_DISABLED: "1"
      DSH_DESKTOP_ENABLED: "1"
      DSH_BROWSER_USE_ENABLED: ${DSH_BROWSER_USE_ENABLED:-1}
      DSH_WEB_RELAY_INTERFACE: ${DSH_WEB_RELAY_INTERFACE:-}
      DSH_DESKTOP_PUBLIC_PORT: ${DSH_DESKTOP_PORT:-6080}
      HOME: /workspace
    volumes:
      - dsh-home:/home/node/.dsh
      - ${DSH_WORKSPACE:-dsh-workspace}:/workspace
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,nodev,size=512m
    # Chromium uses /dev/shm for renderer processes. This mirrors the useful
    # runtime setting from docker-antigravity without adopting its amd64-only
    # desktop base image.
    shm_size: "1gb"
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    pids_limit: 512
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - "Promise.all([fetch('http://127.0.0.1:3080/'), fetch('http://127.0.0.1:6080/vnc.html'), fetch('http://127.0.0.1:9222/json/version')]).then(([web, desktop, cdp]) => { if (web.status !== 401 || !desktop.ok || !cdp.ok) process.exit(1) }).catch(() => process.exit(1))"
      interval: 15s
      timeout: 3s
      start_period: 20s
      retries: 3
```

</details>

**依据 2 · 源码核查**：[scripts/deepseek-harness-entrypoint:153-174](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/scripts/deepseek-harness-entrypoint#L153-L174)

VNC 转发。

<details>
<summary>查看原文（22行）</summary>

```text
  openbox >"${desktop_logs}/openbox.log" 2>&1 &
  openbox_pid=$!
  desktop_pids="${desktop_pids} ${openbox_pid}"

  x11vnc \
    -display "${DISPLAY}" \
    -forever -shared -repeat -noxdamage \
    -rfbport 5900 -localhost -nopw \
    >"${desktop_logs}/x11vnc.log" 2>&1 &
  x11vnc_pid=$!
  desktop_pids="${desktop_pids} ${x11vnc_pid}"

  websockify \
    --web=/usr/share/novnc \
    6080 127.0.0.1:5900 \
    >"${desktop_logs}/novnc.log" 2>&1 &
  novnc_pid=$!
  desktop_pids="${desktop_pids} ${novnc_pid}"

  run_browser >"${desktop_logs}/chromium.log" 2>&1 &
  browser_supervisor_pid=$!
  desktop_pids="${desktop_pids} ${browser_supervisor_pid}"
```

</details>

**依据 3 · 源码核查**：[scripts/deepseek-harness-entrypoint:177-210](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/scripts/deepseek-harness-entrypoint#L177-L210)

进程启动与退出。

<details>
<summary>查看原文（34行）</summary>

```text
trap handle_signal INT TERM HUP

install_browser_plugins

is_web=0
if [ "${1:-}" = web ] || { [ "${1:-}" = --profile ] && [ "${2:-}" = web ]; }; then
  is_web=1
fi
for argument in "$@"; do
  case "${argument}" in
    --help|-h|--version|--dump-config|--dump-config-schema) is_web=0 ;;
  esac
done

if [ "${is_web}" = 1 ]; then
  node /opt/deepseek-harness/dsh-web-relay.cjs "$$" "$@" &
  relay_pid=$!
fi

if [ "${is_web}" = 1 ] \
    && [ "${DSH_DESKTOP_ENABLED:-1}" = "1" ]; then
  start_desktop || {
    stop_children
    exit 1
  }
fi

/usr/local/bin/dsh "$@" &
dsh_pid=$!

wait "${dsh_pid}"
exit_code=$?
stop_children
exit "${exit_code}"
```

</details>

**依据 4 · 源码核查**：[compose.lan.yaml:1-38](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/compose.lan.yaml#L1-L38)

可选 LAN 网关。

<details>
<summary>查看原文（38行）</summary>

```text
services:
  deepseek-harness:
    command:
      - web
      - --patch
      - /opt/deepseek-harness/web.cordis.patch.yml
      - --no-open
      - --trusted-host
      - ${DSH_LAN_HOST:?set DSH_LAN_HOST to the LAN DNS name or server IP}
    environment:
      # The browser plugin keeps the current scheme and host, then replaces
      # only the port. Point it back at the HTTPS gateway so noVNC stays on the
      # authenticated, encrypted origin instead of exposing port 6080.
      DSH_DESKTOP_PUBLIC_PORT: ${DSH_LAN_HTTPS_PORT:-8443}

  lan-gateway:
    image: ${CADDY_IMAGE:-docker.io/library/caddy:2.11.4-alpine}
    depends_on:
      deepseek-harness:
        condition: service_healthy
    environment:
      DSH_LAN_HOST: ${DSH_LAN_HOST:?set DSH_LAN_HOST to the LAN DNS name or server IP}
      DSH_LAN_USERNAME: ${DSH_LAN_USERNAME:?set DSH_LAN_USERNAME}
      DSH_LAN_PASSWORD_HASH: ${DSH_LAN_PASSWORD_HASH:?set a Caddy bcrypt password hash}
    ports:
      # Bind one exact LAN interface instead of every host interface. The
      # container listens on an unprivileged internal port and terminates TLS.
      - "${DSH_LAN_BIND_ADDRESS:?set an exact server LAN IP}:${DSH_LAN_HTTPS_PORT:-8443}:8443"
    volumes:
      - type: bind
        source: ./config/Caddyfile.lan
        target: /etc/caddy/Caddyfile
        read_only: true
      - type: volume
        source: dsh-lan-caddy-data
        target: /data
      - type: volume
        source: dsh-lan-caddy-config
```

</details>

**依据 5 · 源码核查**：[scripts/chromium-docker:1-8](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/scripts/chromium-docker#L1-L8)

禁用 Chromium 沙箱。

```text
#!/bin/sh
set -eu

# The Harness container deliberately drops every Linux capability and enables
# no-new-privileges. Chromium's setuid/user-namespace sandbox cannot initialize
# under that policy, so keep the exception scoped to the already isolated
# browser process instead of weakening the container.
exec /usr/bin/chromium --no-sandbox "$@"
```

#### 缺口

- 无真实镜像、安全边界与模型任务验证
  **影响**：不能由 healthy 推断实际可用或租户隔离
  **进一步探讨**：部署测试实例核对端口、挂载、认证、网络及真实任务

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何低成本验证部署并安全退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

在独立测试卷使用固定镜像、容器运行时及无敏感模型凭据，先比较容器版本、回环端口、无凭据拒绝及会话重启后保留，再验证 Chromium 与真实目标任务。升级前单独备份旧卷，失败使用已核对的旧镜像和旧备份恢复。可试验将当前 HTTP/CDP 探针与一次鉴权后写读、重启恢复验收并列，比较错误通过率和部署时间。若不能发现卷与认证故障，或探针产生不可接受成本，则不用作门禁。

#### 证据与依据

**依据 1 · 源码核查**：[compose.yaml:21-46](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/compose.yaml#L21-L46)

持久卷与当前探针。

<details>
<summary>查看原文（26行）</summary>

```text
    volumes:
      - dsh-home:/home/node/.dsh
      - ${DSH_WORKSPACE:-dsh-workspace}:/workspace
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,nodev,size=512m
    # Chromium uses /dev/shm for renderer processes. This mirrors the useful
    # runtime setting from docker-antigravity without adopting its amd64-only
    # desktop base image.
    shm_size: "1gb"
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    pids_limit: 512
    restart: unless-stopped
    healthcheck:
      test:
        - CMD
        - node
        - -e
        - "Promise.all([fetch('http://127.0.0.1:3080/'), fetch('http://127.0.0.1:6080/vnc.html'), fetch('http://127.0.0.1:9222/json/version')]).then(([web, desktop, cdp]) => { if (web.status !== 401 || !desktop.ok || !cdp.ok) process.exit(1) }).catch(() => process.exit(1))"
      interval: 15s
      timeout: 3s
      start_period: 20s
      retries: 3
```

</details>

**依据 2 · 作者声明**：[README.md:19-31](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/README.md#L19-L31)

作者版本与备份提醒。

<details>
<summary>查看原文（13行）</summary>

```text
> 当前基线：`@deepseek-ai/dsh@0.2.2-rc.1`。DeepSeek Harness 仍处于预发布阶段；升级前应重新完成本文的构建和 Smoke Test。

`0.2.2-rc.1` 直接对应官方 [`dsh-v0.2.2-rc.1`](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1) Release 与 npm Registry 的 [`@deepseek-ai/dsh@0.2.2-rc.1`](https://www.npmjs.com/package/@deepseek-ai/dsh/v/0.2.2-rc.1)，并非本项目自定义版本。本项目封装 npm 成品而不从源码构建，因此以可安装的官方发行物为基线，并故意不发布漂移的 Docker `latest` 标签。

`0.2.2-rc.1` 新增插件更新、引用消息、完整会话 Markdown 复制和多语言界面，并改进手机操作、缓存与会话恢复。

> **0.2.2 迁移：** 最低 Node.js 为 `24.9`；自定义插件需核对 Session 投影、工具执行和 PTC 接口。Web Fetch 允许内网地址，部署需自行限制出站网络；自定义模型应显式填写容量。升级前备份数据卷，降级使用旧卷备份。详见[官方说明](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.2-rc.1)。

> **alpha.4 插件兼容性：** 第三方插件声明的 `engines.dsh` 优先用于判断 DSH 版本兼容性；未声明时继续沿用原有规则。升级第三方插件时应核对其支持范围。

> **alpha.3 迁移提醒：** Web / Desktop 优先使用已保存凭据；Headless 默认只读取环境变量和 `.env`，不再读取已保存密钥。旧 Azure provider 名称 `azure-openai-responses` 需迁移为 `azure`。`--from-default-profile` 重建已有自定义 Profile 会替换其插件和设置，升级现有实例时请保留原 Profile。详见[官方更新说明](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.1-alpha.3)。

> **升级提醒：** `0.1.7-alpha.1` 起 Session 日志为 V4。若从更早版本升级，必须先备份 `dsh-home`；依赖旧日志结构的工具需要适配 V4，降级前也应恢复升级前的卷备份，而不是让旧版直接读取已迁移数据。
```

</details>

**依据 3 · 作者声明**：[README.md:49-59](https://github.com/runzhliu/deepseek-harness-docker/blob/043714057c0c2ef53a5023a3117c5f25fe5af62c/README.md#L49-L59)

作者验证矩阵及模型范围。

<details>
<summary>查看原文（11行）</summary>

```text
## 项目状态

| 能力 | 状态 | 验证结果 |
| --- | --- | --- |
| Dockerfile | 可用 | `linux/arm64`、`linux/amd64` 构建与原生 PTY 实际启动均已验证 |
| Docker Compose | 可用 | Web token/cookie 认证、healthy、回环端口、重启持久化已验证 |
| Rootless Podman | 可用 | `keep-id` 用户映射、bind mount 写入、命名卷持久化与回环端口已纳入 CI |
| Helm | 可用 | 单副本 StatefulSet、PVC、Headless Service、NetworkPolicy；`helm lint --strict` 通过 |
| Web UI | 本机默认；可选受保护 LAN | 默认仅回环访问；LAN overlay 提供 HTTPS、Basic Auth、DSH token/cookie 与同源 noVNC |
| Headless | 可用 | 运行时注入 provider Secret；需在目标环境验证实际模型调用和沙箱 |
| Chromium | 默认 + 可选隐私变体 | Debian Chromium 默认镜像；独立 ungoogled-chromium 双架构镜像会验证无 GCM `:5228` 活动 |
```

</details>

#### 缺口

- 没有执行升级回滚或运行探针
  **影响**：无法确认资源及恢复时间
  **进一步探讨**：用可弃用卷模拟权限错、认证错、重启和回退

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
