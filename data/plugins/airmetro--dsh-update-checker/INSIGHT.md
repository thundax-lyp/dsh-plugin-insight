# dsh-update-checker

> 检查 DSH 与插件版本，提供备份、更新、回滚及重启入口。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d9b20e1](https://github.com/Airmetro/dsh-update-checker/tree/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8)

<!-- BEGIN META -->
[![GitHub ★ 19](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=19&color=yellow&logo=github&style=flat)](https://github.com/Airmetro/dsh-update-checker) [![npm 30d 7,523](https://img.shields.io/static/v1?label=npm+30d&message=7%2C523&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-update-checker) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-update-checker)
<!-- END META -->

**使用建议**：可用于梳理更新管理方案；实际启用写更新前先核同源授权、备份范围与脚本执行，重要部署不把版本回读相等当功能验收。

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

- **用途**：本地DSH操作者集中维护Host和插件版本；合格交付是依赖与profile一致、失败可恢复且新实例实际可用。

- **建议**：使用一次性本地操作凭证/同源检查，加签名或内容摘要固定更新物，并把安装脚本副作用与包文件回滚分开显示，可能降低误触与“已回滚即一切恢复”的误判。对跨站text/plain confirm请求、代理替换包、原位同步失败及脚本写外部文件案例，验证明确拒绝或保留未知副作用；未拒绝则否定安全闭环。

可用于梳理更新管理方案；实际启用写更新前先核同源授权、备份范围与脚本执行，重要部署不把版本回读相等当功能验收。

核查状态：扫描、暂存替换、备份和writeGate源码可核；更新/回滚/重启未执行，不能承诺部署安全。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

手工包管理更新+备份脚本或宿主更新器；插件把多布局维护集中，但需独立批准和功能验收。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **Host 路由**：检查、更新、回滚、备份、重启与状态管理接口。
- **界面**：shell.overlay更新横幅与设置页操作。
- **后台**：扫描、暂存安装、备份/替换和watchdog重启流程。

**流程与依赖**

扫描部署/profile中的包并查询npm/GitHub，暂存安装后备份替换或原位同步，再更新profile依赖/锁文件；主程序更新可失败回滚，restart watchdog用新实例ID确认。Host暴露状态/更新/备份/重启等路由，client横幅和设置操作。

DSH webServer、文件权限、npm/pnpm、网络/代理，POSIX重启需ss/lsof等能力，桌面某路径要求手动重启。

检查→选择目标/confirm→暂存/备份→安装/替换→回读版本/依赖→必要重启→实例确认；失败尝试恢复并记录，脚本外部副作用另核。

Node DSH Web/桌面插件，npm/pnpm与不同部署布局需匹配；原位同步为目录rename受阻回退，不具运行中代码一致性保证。

**效果与成本**

现金包括包下载/存储与可能构建外部资源；人工是版本策略、备份保留、恢复演练和兼容验收，服务重启有中断成本。

降低布局/锁文件漏更新的手工错误，备份回滚提供恢复手段；未证明真实升级合格率或零停机。

- **思考**：更新入口是否具充分的授权与供应链保证？writeGate只核remoteAddress回环与confirm=true，未在该函数见Origin/Host或JSON Content-Type检查；浏览器跨站请求仍来自loopback，需核完整入口才能保证写操作不可被诱发。ghRequest对匹配GitHub域关闭证书校验，又可安装构建脚本；可用性兼容取舍削弱真实性保证，备份不能撤销安装脚本的外部副作用。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相较只报新版本，把包布局、profile持久声明与回滚一起处理，避免更新后install又拉回旧版；实例ID检查比仅端口200更能辨识新进程。增量是部署维护闭环设计，npm/GitHub版本号不证明依赖兼容或功能验收。

相较只报新版本，把包布局、profile持久声明与回滚一起处理，避免更新后install又拉回旧版；实例ID检查比仅端口200更能辨识新进程。增量是部署维护闭环设计，npm/GitHub版本号不证明依赖兼容或功能验收。

暂存目录→旧目录旁移→换入并在失败时恢复，阻塞rename可原位同步；检测新实例ID有益。GitHub请求专门TLS降级和原位多文件同步需要清楚暴露风险，不能称全事务。

固定源码依据：[lib/index.js](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/lib/index.js)、[package.json](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/package.json)、[cordis.patch.yml](https://github.com/Airmetro/dsh-update-checker/blob/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8/cordis.patch.yml)。

<a id="detail-section-5"></a>

### 主要限制

更新入口是否具充分的授权与供应链保证？writeGate只核remoteAddress回环与confirm=true，未在该函数见Origin/Host或JSON Content-Type检查；浏览器跨站请求仍来自loopback，需核完整入口才能保证写操作不可被诱发。ghRequest对匹配GitHub域关闭证书校验，又可安装构建脚本；可用性兼容取舍削弱真实性保证，备份不能撤销安装脚本的外部副作用。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 版本号：1.7.3；版本日期：2026-10-21（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[d9b20e1d](https://github.com/Airmetro/dsh-update-checker/tree/d9b20e1de7298f43a8bd50d0e3565685bb17eeb8)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根lib/index.js扫描/暂存替换、ghRequest、writeGate与重启路径，README及包清单；未审计全部6200行和各OS脚本，不作供应链安全审计结论。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

使用一次性本地操作凭证/同源检查，加签名或内容摘要固定更新物，并把安装脚本副作用与包文件回滚分开显示，可能降低误触与“已回滚即一切恢复”的误判。对跨站text/plain confirm请求、代理替换包、原位同步失败及脚本写外部文件案例，验证明确拒绝或保留未知副作用；未拒绝则否定安全闭环。

未更新、回滚或启动watchdog。提出隔离副本的失败/跨站/脚本副作用实验，分别验证包恢复、profile一致与业务功能。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 477 | — | — | 12475 |
| .js | source | 2 | 8396 | 7754 | 1 | — |
| .mjs | test | 49 | 5722 | 5058 | 50 | — |
| .mjs | source | 4 | 2126 | 1959 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Airmetro/dsh-update-checker/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
