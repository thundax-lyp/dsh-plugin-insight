# dsh-wsl-browser

> 从WSL调用Windows默认浏览器打开HTTP或HTTPS地址，并给出localhost排障提示。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-browser/commits)
<!-- END META -->

## 版本

固定提交 [24d8fd47f7566945fe697cb985df4f43e02dd3a7](https://github.com/173787247/dsh-wsl-browser/tree/24d8fd47f7566945fe697cb985df4f43e02dd3a7)

## 用途与采用点评

- **用途**：Agent在WSL得到报告或服务地址后，用户希望在Windows浏览器直接查看，验收是实际页面可达。
- **亮点**：lib/browser.js只接受http/https URL并转义PowerShell单引号，入口通过wsl-host调用Start-Process；localhost仅给替代地址提示。
- **思考**：消除复制地址的微小重复操作，收益来自入口便利；HTTP协议允许不等于目标可信。
- **建议**：适合已用WSL开发的人，先打开测试URL并核对默认浏览器，远端服务先确认监听和访问权限。

## 场景与替代办法

Agent在WSL得到报告或服务地址后，用户希望在Windows浏览器直接查看，验收是实际页面可达。

此前未入档；手动复制地址已足够轻，频繁从WSL打开服务页面时入口可能更方便。

## 依赖与流程

需要WSL、Windows默认浏览器和PowerShell互操作；网络、证书与服务绑定地址决定页面是否能打开。

输入URL，插件请求Windows打开，用户确认页面；失败先区分启动器、localhost映射与服务本身，不重复开多个标签。

## 成本与效果

无新增推理或抓取服务费用，主要是跨系统启动延迟、配置互操作与人工确认页面；没有实测省时数据。

消除复制地址的微小重复操作，收益来自入口便利；HTTP协议允许不等于目标可信。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：74ea2bcf03c6aba4453b5c91f95207aafb258af146da62c42b082f8a00555d6c。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 161 | — | — | 838 |
| .js | source | 3 | 184 | 164 | 4 | — |
| .js | test | 1 | 16 | 14 | 4 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：win_open_url。

## 工程亮点

URL协议检查与PowerShell字面量转义可复用，localhost不擅自重写避免误指向；调用结果仍需区分启动与页面加载。

## 分发与兼容

0.1.0，Node>=18，要求WSL互操作及可用Windows PowerShell；不适用于纯Linux或macOS宿主。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；手动复制地址已足够轻，频繁从WSL打开服务页面时入口可能更方便。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：打开请求成功不证明浏览器已显示目标，也不抓取或读取网页；localhost在Windows与WSL中的可达性依部署而定。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试引号、Unicode、非法协议、localhost和外部HTTPS，确认只打开预期地址，并记录启动成功但加载失败的情形。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
