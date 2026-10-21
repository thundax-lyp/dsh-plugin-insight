# dsh-about

> 在设置中显示当前 DSH 版本，并代理读取官方 GitHub 发布说明。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[febf7b0](https://github.com/1010n111/dsh-about/tree/febf7b0da6a2255ddfd84028c624ad9e4953dd83)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1010n111/dsh-about)
<!-- END META -->

**使用建议**：与实际 dsh --version 对照后使用，路径识别失败时保留未知而不据此判断升级成功。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：需要确认实际运行版本及更新内容的用户不必另外打开终端和发布页。

终端版本命令加官方发布页更直接；该插件提供界面聚合，不增加权威信息。

## 能力与限制

- **Host 路由**：只读版本和发布记录端点。

**流程与依赖**

本地版本读取依赖安装布局；发布说明依赖 GitHub API 和网络。

打开关于页读取版本与发布记录；网络错误和版本无法定位应分别排查。

**兼容条件**

包版本 0.0.4，依赖宿主 Web、文件和客户端模块服务。

**效果与成本**

无模型成本，联网发布信息受 GitHub 可用性影响；收益主要是少量查询便利。

- **思考**：能把当前版本与发布说明放在一起，但不会执行更新，也不证明新版本适合当前插件组合。

## 工程分析

- **亮点**：宿主从 clientModules 路径反推包版本，注册只读 version/releases 路由，对 GitHub 响应缓存五分钟。

失败返回明确状态、短时缓存可借鉴；解析双语正文依赖上游发布文本格式。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：路径反推可能受安装布局影响；没有验证每种打包方式，发布说明也不是兼容验收。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试 pnpm、npx 和桌面布局，并模拟离线、限流和单语发布正文。

**分析版本**

固定提交 [febf7b0](https://github.com/1010n111/dsh-about/tree/febf7b0da6a2255ddfd84028c624ad9e4953dd83)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 4 | 1199 | 1004 | 131 | — |
| .md | source | 1 | 96 | — | — | 928 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/1010n111/dsh-about/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
