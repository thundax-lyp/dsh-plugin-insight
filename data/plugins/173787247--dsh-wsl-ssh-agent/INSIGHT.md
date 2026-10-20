# dsh-wsl-ssh-agent

> 诊断WSL的SSH代理环境、已加载密钥数量与Windows代理桥接条件。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[9971638](https://github.com/173787247/dsh-wsl-ssh-agent/tree/99716388c9fa204b53bb6e931a239810d4524a0b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-ssh-agent)
<!-- END META -->

**使用建议**：把live socket当启发式提示，失败时查看sshAddDetail；不要在聊天中复制私钥。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

已有贡献：把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。

结论边界：本次为固定版本源码核查，未执行目标代码或真实宿主验收，未核实独立使用效果。下文设计假设均未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：Git SSH认证失败时，区分环境未继承、代理失效、未加载密钥与Windows桥接未配。

- **建议**：待验证假设：分别表示路径存在、socket类型、代理协议可达和目标授权，可减少把不同失败合并；额外探测可能增加延迟和权限要求。

采用建议：把live socket当启发式提示，失败时查看sshAddDetail；不要在聊天中复制私钥。

手工查看环境、ssh-add及Windows代理状态；插件聚合已有命令结果。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：ssh_agent_hint：SSH代理与Windows桥接诊断。

**流程与依赖**

依赖WSL、OpenSSH工具和宿主进程环境；Windows转发另需npiperelay/socat与Windows OpenSSH agent。

先读诊断，人工核对对应会话环境，再配置代理或加载测试密钥，最后独立验证目标授权。

**效果与成本**

进程探测、配置桥接和用户核对人工为主，无恢复率实测。

把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。 sockAlive只由exists判断，路径存在不证明是可服务的socket；ssh-add失败被归为keyCount=0，与真实空代理不同，可能误导加载密钥建议。

- **思考**：sockAlive只由exists判断，路径存在不证明是可服务的socket；ssh-add失败被归为keyCount=0，与真实空代理不同，可能误导加载密钥建议。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。

把常见SSH代理排障线索聚合为不回传私钥内容的提示；不自动建立代理桥接，也不证明目标Git服务认证通过。

建议构造与探测可注入依赖，便于边界验证；未知、失败与零数量应保留区别。

<a id="detail-section-5"></a>

### 主要限制

sockAlive只由exists判断，路径存在不证明是可服务的socket；ssh-add失败被归为keyCount=0，与真实空代理不同，可能误导加载密钥建议。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/ssh-agent.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查入口和诊断实现；未读用户密钥、调用ssh-add或连接Git服务。
- 下一步：用普通文件冒充socket路径、空代理和拒绝连接样例核对诊断，再在获准测试目标验证认证；若仍混淆网络与授权则需独立状态。

**分析版本**

- **仓库**：[173787247/dsh-wsl-ssh-agent](https://github.com/173787247/dsh-wsl-ssh-agent)
- **版本号**：0.2.0（[固定提交 9971638](https://github.com/173787247/dsh-wsl-ssh-agent/tree/99716388c9fa204b53bb6e931a239810d4524a0b)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：分别表示路径存在、socket类型、代理协议可达和目标授权，可减少把不同失败合并；额外探测可能增加延迟和权限要求。

用普通文件冒充socket路径、空代理和拒绝连接样例核对诊断，再在获准测试目标验证认证；若仍混淆网络与授权则需独立状态。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 104 | — | — | 616 |
| .js | source | 3 | 247 | 221 | 4 | — |
| .js | test | 1 | 39 | 35 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-ssh-agent/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
