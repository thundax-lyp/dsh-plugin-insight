# dsh-effort-slider

> 为 DSH 模型菜单增加推理强度滑块，并向第三方模型供给方言配置。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[97bf5c1](https://github.com/2768651338/dsh-effort-slider/tree/97bf5c1e5881ea0fcfb543844346fe86b87ff620)

<!-- BEGIN META -->
[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) [![npm 30d 1,403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)
<!-- END META -->

**使用建议**：适合了解自定义路由协议的用户；用实际请求日志确认档位参数与服务端行为后再据此控制成本。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：使用第三方模型路由的用户在发送前调整推理档位，希望请求参数与所选档位一致。

适合了解自定义路由协议的用户；用实际请求日志确认档位参数与服务端行为后再据此控制成本。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照DSH内置档位菜单和手工pi-ai配置，未比较其他滑块插件实现。

effort-core生成五档reasoning元数据和各协议compat映射；宿主读取settings并在revision核对后mutate，客户端滑块写入会话模型设置。


DSH llm/settings和客户端模型目录服务、pi-ai映射及兼容端点；README声明0.2.1-rc.2适配未由本次运行确认。

读取模型目录，跳过原生推理与用户自定义项，供给缺失映射；用户拖动释放吸附档位，写入后下一请求使用所选设置，错误显示状态。

无单独外部服务成本依据；人工需确认方言、端点支持及宿主版本，模型推理开销可能随档位变化；未测延迟或费用。

减少配置字段手改，但端点支持决定价值，视觉档位不提供效果保证。

- **后台**：推理档位元数据和多方言compat供给
- **界面**：模型菜单推理强度滑块

- **思考**：界面存在五档不证明端点接受或区别处理五档。wireFor仅在openai-completions注入compat，其余依赖pi-ai；off多数映射null即不发参数，不能保证服务端关闭思考。resolveModelInfo失败视为无原生推理也可能造成不必要供给。

<a id="detail-section-4"></a>

### 工程贡献

纯effort-core与宿主服务分离，deepEqualJson、注入识别和revision重读支撑幂等更新；复用时须保留用户自定义配置跳过条件。 源码依据：[src/effort-core.ts](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L24)、[src/index.ts](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L114)、[src/client/effort/EffortPanel.tsx](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/client/effort/EffortPanel.tsx#L85)。

- **亮点**：相对内置档位菜单，主要增量不是火焰视觉，而是为缺少推理元数据的第三方路由补齐映射，并在写前重读防止覆盖并发用户编辑；将界面控制和线上协议适配联结。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[2768651338/dsh-effort-slider](https://github.com/2768651338/dsh-effort-slider)
- **版本号**：0.5.1（[固定提交 97bf5c1](https://github.com/2768651338/dsh-effort-slider/tree/97bf5c1e5881ea0fcfb543844346fe86b87ff620)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：以端点能力探测结果约束滑块档位，并区分关闭与未发送参数，可减少显示成功而实际无效的控制。由统一档位和协议差异推导，探测会产生请求成本且不能依靠模型自述。

最小验证：使用记录请求体的不同方言端点，逐档检查字段与响应usage；注入不支持字段及配置并发编辑，比较误报有效控制率。若探测不能可靠区分端点支持则不发布能力结论。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2697 | — | — | 36270 |
| .js | source | 2 | 1760 | 1562 | 223 | — |
| .ts | source | 9 | 1938 | 1450 | 351 | — |
| .tsx | source | 1 | 426 | 321 | 85 | — |
| .mjs | test | 8 | 1416 | 1167 | 156 | — |
| .ts | test | 1 | 8 | 6 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2768651338/dsh-effort-slider/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
