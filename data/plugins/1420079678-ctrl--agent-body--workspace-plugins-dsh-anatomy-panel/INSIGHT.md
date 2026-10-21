# dsh-anatomy-panel

> 读取Agent-Body运行时文件，在宿主HTTP路由展示器官体征、心跳、愈合账本与脉冲。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)
<!-- END META -->

**使用建议**：先限制在本地受控宿主使用，检查缺失数据能否报503，并核对脉冲文本的展示边界后再接入多人环境。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：维护Agent-Body部署的人需要查看后台状态，合格交付是实际文件异常能被看到，而非仅有漂亮仪表盘。

此前未入档；直接查看JSON和日志更低维护，本项减少人工对齐多个文件的步骤。

## 能力与限制

- **Host 路由**：/anatomy和/anatomy/data.json。
- **界面**：自包含体征面板及周期刷新。

**流程与依赖**

需要organism的bloodstream、vitals、reflexes与pulse文件，宿主必须保护同源路由；文件损坏时页面读不到不应显示正常。

启动已有organism后访问面板，对照状态与日志，异常时回到原始账本核实；目录缺失先修部署而非把空面板当零异常。

**兼容条件**

0.1.0 private Host-only组件，无客户端构建；依赖已有organism运行文件与宿主webServer，不能单装后期待完整数据。

**效果与成本**

无新增推理调用；轮询、文件读取和脉冲积累产生I/O，安装、权限配置和解释指标占人工时间，未做负载测量。

- **思考**：直接从运行文件投影避免另建采集服务；仪表盘显示已愈合不能证明业务故障真正恢复。

## 工程分析

- **亮点**：组件lib/index.js注册/anatomy与数据路由，每次请求重读organism文件，脉冲只读尾部256KB，页面约每三秒轮询。

尾部限量读取与缺失目录显式503可复用；路由依赖宿主访问控制，动态文案拼接HTML需要额外核验。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：体征是该框架自定义指标，不是任务正确率；脉冲文案进入innerHTML，未验证不可信日志文本的HTML处理。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用缺失、损坏和包含HTML符号的脉冲样本核对状态码与显示，比较面板和原件一致性，并测大日志轮询开销。

**分析版本**

固定提交 [9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-anatomy-panel)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 253 | 212 | 23 | — |
| .md | source | 1 | 55 | — | — | 630 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1420079678-ctrl/agent-body/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
