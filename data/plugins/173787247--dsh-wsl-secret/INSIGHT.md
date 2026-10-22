# dsh-wsl-secret

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[be996ef](https://github.com/173787247/dsh-wsl-secret/tree/be996ef420b165aebb759cda3957e65a966efe22)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret)
<!-- END META -->

> **实现功能**：按允许前缀读取pass或age秘密，并可注入当前DSH进程环境。

> **核心亮点**：复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。

> **风险与缺陷**：process.env是进程共享状态，后续插件或子进程可能继承；前后缀预览仍泄漏部分秘密。age路径仅词法检查未realpath，符号链接边界需验证，不能把allowPrefixes视为完整隔离。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent调用外部服务时，希望避免用户把完整密钥直接粘贴进聊天。

直接Shell导出或宿主凭据服务；插件复用pass/age，但全局环境不具宿主凭据引用的细粒度边界。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：pass条目列表、存在性、读取、age解密及秘密环境注入。

**流程与依赖**

依赖pass/GPG或age、已解锁身份、明确allowPrefixes及文件权限；空白名单拒绝读取。

先status和exists检查，再用测试条目to_env，核对消费者；真实采用前确认环境生命周期和并发覆盖。

**效果与成本**

密钥存储配置、解锁、权限核对及清理人工为主；未测泄漏率或端到端效率。

复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。 process.env是进程共享状态，后续插件或子进程可能继承；前后缀预览仍泄漏部分秘密。age路径仅词法检查未realpath，符号链接边界需验证，不能把allowPrefixes视为完整隔离。

> **思考**：process.env是进程共享状态，后续插件或子进程可能继承；前后缀预览仍泄漏部分秘密。age路径仅词法检查未realpath，符号链接边界需验证，不能把allowPrefixes视为完整隔离。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。

复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。

解密、校验、呈现分离可读性较好；生命周期、真实路径和消费者范围应显式建模。

<a id="detail-section-5"></a>

### 1.4 主要限制

process.env是进程共享状态，后续插件或子进程可能继承；前后缀预览仍泄漏部分秘密。age路径仅词法检查未realpath，符号链接边界需验证，不能把allowPrefixes视为完整隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅给最小前缀并使用非敏感测试值，默认不reveal；不要把进程内注入当秘密永不进入其他工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献：复用已有秘密存储并把解密值交给后续工具，减少直接回传完整秘密；这不是密钥隔离服务。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/secret.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查秘密名称、age路径、解密和环境注入实现；未读取任何用户秘密或执行解密。
- 下一步：以无真实凭据的测试秘密比较并行工具和子进程继承范围，检查结束后残留、符号链接和预览；若仍跨任务泄漏则否定隔离假设。

**分析版本**

- **仓库**：[173787247/dsh-wsl-secret](https://github.com/173787247/dsh-wsl-secret)
- **版本号**：0.2.0（[固定提交 be996ef](https://github.com/173787247/dsh-wsl-secret/tree/be996ef420b165aebb759cda3957e65a966efe22)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：为单次获准子进程注入环境并在结束后撤销，可缩小暴露范围；依赖工具若只读宿主全局环境则需新增接口。

以无真实凭据的测试秘密比较并行工具和子进程继承范围，检查结束后残留、符号链接和预览；若仍跨任务泄漏则否定隔离假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 255 | — | — | 1189 |
| .js | source | 2 | 540 | 500 | 9 | — |
| .js | test | 1 | 49 | 48 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-secret/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
