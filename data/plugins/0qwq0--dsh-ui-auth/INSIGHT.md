# dsh-ui-auth

> 为 DSH Web 提供登录、用户管理、会话隔离与按用户模型凭证管理，支持 TOTP 和通行密钥。

- **用途**：为多人使用的 DSH Web 增加登录、用户隔离和按用户模型凭证管理。
- **亮点**：不仅拦页面，还处理 REST、WebSocket mux帧归属和私有模型配置的信封加密。
- **思考**：共享服务的安全边界依赖宿主路由、传输与升级契约；有登录页不等于所有数据面已隔离，也不抵御控制服务进程的管理员。
- **建议**：仅作为隔离测试环境的候选，先做双用户REST／WS／凭证和升级回归，尚无本轮真实宿主安全验收。

## 版本

固定提交 [6c5e87b44be4e973b092910968001916bb97d22e](https://github.com/0QwQ0/dsh-ui-auth/tree/6c5e87b44be4e973b092910968001916bb97d22e)

## 场景、替代办法与合格交付

小团队想共用DSH Web而隔离工作区、会话和API凭证。合格交付物是用户A无法读取／操作B的资源，撤销与退出立即影响长连接；基线是各用户独立实例与反向代理认证，两者复杂度与隔离强度应同时比较。

## 实现机制与依据

lib/index.js 接管server request／upgrade并注册/auth路由；modern-gateway.js投影HTTP结果与代理mux帧；profile-kek.js以用户口令派生KEK包装每配置随机DEK，AAD绑定uid/profileId。登录口令不直接持久化为明文key。

本轮重点审读：[lib/index.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/index.js)、[lib/modern-gateway.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/modern-gateway.js)、[lib/modern-policy.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/modern-policy.js)、[lib/profile-kek.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/profile-kek.js)。固定文本材料已保存；完整文件统计不表示每行代码都经过人工审计。

## 安装与效果依赖

当前包声明 DSH >=0.2.0-rc.2 <0.3.0，旧0.1传输线已移除；需要 Cordis、ws、simplewebauthn、qrcode及可写用户／会话存储。Passkey需要localhost或HTTPS安全上下文；操作者还要管理邀请码、恢复和反向代理配置。

发布核查：已读取 npm latest 0.7.1；源码 package.json 为 0.7.1。版本号一致仍不证明 tarball 内容一致。未安装、未比对发布包字节。

## 用户、后台与失败流程

隔离部署 → 初始化管理员 → 设置HTTPS和邀请 → 创建两个测试用户 → 分配模型与权限 → 验证REST／WS交叉访问 → 演练退出、改权、重启和丢失登录因子的恢复。升级宿主后重跑全部传输与路由测试，而不是只检查登录。

## 首次、持续与迁移成本

首次包括身份策略、TLS、数据迁移与多用户回归；持续包括口令派生、加解密、mux代理、审计留存和宿主适配；迁移需保护加密数据与恢复路径。无新增模型调用不等于无运维成本。

## 工程规模与能力清单

| 扩展名 | 范围 | 文件数 | 总行数 | Markdown字数 | 代码行 |
|---|---|---:|---:|---:|---:|
| .md | source | 14 | 3381 | 58130 | — |
| .js | source | 12 | 9818 | — | 8996 |
| .ts | source | 12 | 8122 | — | 6639 |
| .cjs | test | 2 | 288 | — | 244 |
| .mjs | test | 35 | 6084 | — | 4406 |

- **Host 路由**：认证路由与传输策略
- **界面**：用户设置
- **后台**：WebSocket 代理

## 工程亮点

策略、网关、配置加密和用户路由分模块，未知端点／帧拒绝和长连接归属复核是实质机制；直接包裹底层server监听器也意味着较强宿主耦合。口令派生加密可缩小静态存储读者权限，但不保证拥有进程控制权的人无法截获后续明文，本轮没有渗透验收。

可借鉴把身份同时延伸到HTTP与长连接、对私有配置使用AAD和每条DEK；复用前明确威胁模型、管理员权限、密码重置和升级测试成本，不能只复制登录页。

上述工程判断依据：[lib/index.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/index.js)、[lib/modern-gateway.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/modern-gateway.js)、[lib/modern-policy.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/modern-policy.js)、[lib/profile-kek.js](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/lib/profile-kek.js)。

## 采用判断与最小验证

双用户覆盖列表、搜索、下载、创建、删除、mux未知帧、退出／角色变更和服务重启；检查未授权请求无内容前缀外泄及失败时拒绝。另做口令重置后的配置恢复演练；任何跨用户读取都应停止共享部署。

## 核查说明

- 首次分析；不代表本周新发布。
- 已阅读固定版本的源码、配置和测试文件。
- 未实际运行或安装插件，也未在 DSH 中试用或比较模型任务效果。
- 作者的自测和发布说明未经独立验证。
- Issue 数量仅供参考，不代表使用人数或实际收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 3 · 近30天：新建 3／关闭 3／更新 3

统计日期：2026-10-19。
