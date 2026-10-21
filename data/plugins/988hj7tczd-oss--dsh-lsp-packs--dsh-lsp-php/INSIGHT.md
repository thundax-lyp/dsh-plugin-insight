# dsh-lsp-php

> 为DSH配置Intelephense或自定义PHP语言服务路由。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

**使用建议**：先选清楚默认服务或phpactor，再逐项测需要的导航动作；别从统一工具名推断高级功能免费可用。

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

- **用途**：适合已有PHP工程、需要把外部语言服务接入DSH的开发者。

- **建议**：未验证假设：把server实际能力与许可条件呈现在查询前，可减少把未实现操作误当连接失败。分别用两个server和四操作验证支持矩阵及报错归因；未知能力保持未知。

先选清楚默认服务或phpactor，再逐项测需要的导航动作；别从统一工具名推断高级功能免费可用。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

替代是PHP IDE或直接手配stdio；本包不包含PHP语言引擎。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **后台**：php provider、.php映射与可替换server配置

**流程与依赖**

php入口默认intelephense --stdio，provider php映射.php；README给phpactor的command/args覆盖示例，官方LspStdio负责启动协议。

官方fs/lsp/subprocess及LSP底座；README要求Intelephense或phpactor，后者需PHP；Node>=22.18及DSH<0.2.0声明。

安装所选外部server→覆盖命令参数→装PHP包→.php查询懒启动→按server能力返回；缺服务以占位报错。

**效果与成本**

首次安装所选server及相应Node/PHP环境；README指出高级功能可能要密钥，具体现金费用未核。人工需核许可、项目索引和替代配置。

降低PHP接线重复，无默认与替代服务效果对照。

- **思考**：README把Intelephense付费高级功能与phpactor替代分别说明，故工具暴露四操作不等于默认免费server都实现。测试只在默认intelephense存在时跑真实lane，不能证明phpactor兼容；替代还需PHP运行时。fallback仅保留默认.php表，不能保全覆盖。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：把默认PHP服务和替代启动参数封装成独立配置包，省手写servers表；Intelephense/phpactor的分析能力不属本项实现，提供替换字段不代表两个server效果相同。

把默认PHP服务和替代启动参数封装成独立配置包，省手写servers表；Intelephense/phpactor的分析能力不属本项实现，提供替换字段不代表两个server效果相同。

配置层允许完全替换args，适合不同启动子命令；协议和能力发现仍外包官方底座/server。统计仅PHP组件，catch-all与默认扩展回退是复用限制。

源码依据：[dsh-lsp-php/src/index.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts)、[dsh-lsp-php/README.md](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/README.md)、[dsh-lsp-php/cordis.yml](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/cordis.yml)、[dsh-lsp-php/tests/smoke.e2e.ts](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/tests/smoke.e2e.ts)。

<a id="detail-section-5"></a>

### 主要限制

README把Intelephense付费高级功能与phpactor替代分别说明，故工具暴露四操作不等于默认免费server都实现。测试只在默认intelephense存在时跑真实lane，不能证明phpactor兼容；替代还需PHP运行时。fallback仅保留默认.php表，不能保全覆盖。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb640](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：dsh-lsp-php/src/index.ts、dsh-lsp-php/README.md、dsh-lsp-php/cordis.yml、dsh-lsp-php/tests/smoke.e2e.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：固定宿主对两个server测四操作、许可限制、错误命令和覆盖扩展；本轮未执行或购买许可。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：把server实际能力与许可条件呈现在查询前，可减少把未实现操作误当连接失败。分别用两个server和四操作验证支持矩阵及报错归因；未知能力保持未知。

固定宿主对两个server测四操作、许可限制、错误命令和覆盖扩展；本轮未执行或购买许可。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：dsh-lsp-php；内容摘要：3111c8807e34631fb0fad96259735344ec3e980da52e573e802ca33e34640058。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 971 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 177 | 128 | 25 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
