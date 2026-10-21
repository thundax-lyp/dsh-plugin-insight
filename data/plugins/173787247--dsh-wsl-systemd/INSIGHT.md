# dsh-wsl-systemd

> 在 DSH 中只读查看 systemd 用户服务的状态与近期日志。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a2e7fba](https://github.com/173787247/dsh-wsl-systemd/tree/a2e7fba0ac5ac273634697e1503fdb6676cc557f)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-systemd)
<!-- END META -->

**使用建议**：适合已用 systemd --user 管理服务的人做只读排障；先确认用户总线和日志权限，修复服务仍需人工操作。

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

源码支持所述适配机制；贡献评价属于有固定源码依据的解释。尚未安装或运行，效果与宿主兼容未验证；新设计推演均未实现。

[重点创新推演与最小验证](#innovation)

- **用途**：WSL 内维护 Ollama 等用户服务的人，想从服务状态和日志定位故障，交付是可人工解释的诊断材料。

采用建议：适合已用 systemd --user 管理服务的人做只读排障；先确认用户总线和日志权限，修复服务仍需人工操作。

本次比较参照为上述人工命令、平台接口或本地脚本；没有独立同任务运行对照，不声称整体收益或首创。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：systemd_status、systemd_user_list、systemd_user_show、journal_tail、systemd_user_journal

**流程与依赖**

Node≥18、DSH、systemctl/journalctl 和有效用户会话必要；不依赖 Windows 托盘；系统级服务不在该 --user 范围内。

先 status，列用户服务，再 show 和 journal_tail 交叉检查；异常由工具错误返回，修复后重新查询，插件不自动重启。

**效果与成本**

无新增订阅；人工成本是建立用户服务与阅读日志，重试和日志截断需计入诊断时间，未测节省。

受益于经常排查用户单元的人；一次性故障直接运行两条命令可能更省配置。

- **思考**：userAvailable 把退出码0/1/3映为可用，这只是探测近似；能访问用户总线并不证明目标服务存在或健康。缺日志权限、无用户会话和应用故障应分别判定，否则诊断会把环境问题归到服务。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对原生 systemctl/journalctl 手工执行，贡献是把用户会话范围和有限日志抽成模型工具，未新增服务管理机制；注册层没有 start/stop/enable，有利于把诊断和修复责任分开。

相对原生 systemctl/journalctl 手工执行，贡献是把用户会话范围和有限日志抽成模型工具，未新增服务管理机制；注册层没有 start/stop/enable，有利于把诊断和修复责任分开。

lib/systemd.js 把单元校验与执行分离、固定 show 属性减少模型噪声；但 stderr 累积和探测退出码语义仍需维护。index.js journal_tail 与 systemd_user_journal 是别名，不能算两种诊断能力。 源码：[index.js](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/index.js)、[lib/systemd.js](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/lib/systemd.js)、[test/systemd.test.js](https://github.com/173787247/dsh-wsl-systemd/blob/a2e7fba0ac5ac273634697e1503fdb6676cc557f/test/systemd.test.js)。

<a id="detail-section-5"></a>

### 主要限制

userAvailable 把退出码0/1/3映为可用，这只是探测近似；能访问用户总线并不证明目标服务存在或健康。缺日志权限、无用户会话和应用故障应分别判定，否则诊断会把环境问题归到服务。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 index.js、lib/systemd.js、test/systemd.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 a2e7fba0ac5ac273634697e1503fdb6676cc557f，检查作者说明、入口、所列核心实现与测试内容；未执行测试或插件、未核实外部套件和独立用户效果。
- 下一步：在有/无 user bus、存在/缺失单元和拒绝日志权限的 WSL 会话逐项对照原生命令；若探测可用但实际查询失败，要求报告环境错误而非健康结论。

**分析版本**

- **仓库**：[173787247/dsh-wsl-systemd](https://github.com/173787247/dsh-wsl-systemd)
- **版本号**：0.1.1（[固定提交 a2e7fba](https://github.com/173787247/dsh-wsl-systemd/tree/a2e7fba0ac5ac273634697e1503fdb6676cc557f)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

未形成新的技术机制假设：当前价值主要是成熟命令的边界清楚的适配。优先补证 userAvailable 与实际 list/show 可用性是否一致，再考虑扩展。

在有/无 user bus、存在/缺失单元和拒绝日志权限的 WSL 会话逐项对照原生命令；若探测可用但实际查询失败，要求报告环境错误而非健康结论。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 118 | — | — | 487 |
| .js | source | 2 | 246 | 226 | 2 | — |
| .js | test | 1 | 8 | 7 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-systemd/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
