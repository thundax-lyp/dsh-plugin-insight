# dsh-wsl-cred

> 读取Git凭据助手与远端类型，给出WSL使用Windows Git Credential Manager的排障提示。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cred/commits)
<!-- END META -->

## 版本

固定提交 [1c45da3969a109959783373175150c87a3a33fa0](https://github.com/173787247/dsh-wsl-cred/tree/1c45da3969a109959783373175150c87a3a33fa0)

## 用途与采用点评

- **用途**：WSL中git push认证失败的开发者需要区分HTTPS凭据与SSH代理问题，交付是明确下一步核查而非得到token。
- **亮点**：lib/cred.js执行git config与remote get-url，分类HTTPS/SSH并隐藏URL userinfo，探测常见Windows GCM路径，生成相应建议。
- **思考**：把SSH与HTTPS路径分开能减少错修；找到GCM可执行文件不证明凭据存在或具备目标仓库写权限。
- **建议**：先确认工具工作目录和远端协议，只读查看配置后再人工修改；不要为了验证把token贴进会话。

## 场景与替代办法

WSL中git push认证失败的开发者需要区分HTTPS凭据与SSH代理问题，交付是明确下一步核查而非得到token。

此前未入档；原生命令可提供同样证据，本项优势是把多处结果整理为可读提示。

## 依赖与流程

需要Git配置可读、正确仓库cwd及实际认证后端；GCM路径与Windows安装布局可能不同，模型建议仍需操作者核对。

查看cred_hint，确认远端类型和helper，再在终端核实认证状态；修复后使用只读目标访问测试，不直接把提示视为已授权。

## 成本与效果

无外部服务订阅，主要是探测时间与人工修认证配置；错误套用全局helper会影响其他仓库，回退时间应计入。

把SSH与HTTPS路径分开能减少错修；找到GCM可执行文件不证明凭据存在或具备目标仓库写权限。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d3ccda63a061ecf58816ed9a0ad91f5de4ccff1ad83789db4d62ad50f945dbae。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 154 | — | — | 768 |
| .js | source | 3 | 235 | 210 | 3 | — |
| .js | test | 1 | 55 | 49 | 2 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：cred_hint。

## 工程亮点

远端分类和建议生成分离便于复用，常见URL userinfo已掩码；helper读取失败回退为空会混同未配置与读取失败。

## 分发与兼容

0.2.0，Node>=18，依赖git和WSL/Windows路径假设；实际目标仓库与进程cwd是否一致需确认。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；原生命令可提供同样证据，本项优势是把多处结果整理为可读提示。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：不调用credential fill、不验证实际登录或推送权限；helper原文会显示，不能把不主动读取口令等同任意自定义配置都已脱敏。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用HTTPS带userinfo、SSH、自定义helper和无origin仓库验证脱敏与分类，另测试配置读取失败是否清楚区分。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 0／更新 0

统计日期：2026-10-20。
