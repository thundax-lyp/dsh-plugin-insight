# dsh-tool-encoding

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中对 UTF-8 文本编解码、计算摘要并生成 UUID。

> **亮点**：[Q01](#research-q01) 将公开文本转换做成直接的会话工具，[Q02](#research-q02) 的严格 Base64 门槛补足宽容解码可能忽略的字符与未用位错误。

> **主要限制**：[Q02](#research-q02) 的 UTF-8 解码器可能丢弃前导 BOM。[Q03](#research-q03) 的参数记录意味着把文本转成摘要也不会避免原文进入会话。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 工具如何处理公开样本，常规 shell 的哪一步被替换？](#detail-section-11)
  - [Q02 · 严格解码能否保持所有合法 UTF-8 文本往返？](#detail-section-12)
  - [Q03 · 哪些数据适合进入会话，如何核实后再决定是否使用？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要反复检查公开 API 样本或构造 URL 参数片段的开发者，可以直接请求会话工具并复核转换结果。

本地 shell、Node 脚本或现有编码器均可完成转换。文件摘要宜直接读取字节，本地命令也便于把数据留在会话之外。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 文本编码转换 | 检查公开 API 字段 | UTF-8；URL 按 component |
| 文本摘要 | 复核公开字符串 | 不接受文件字节，不传机密 |
| UUID | 生成临时标识 | 依赖 Node 随机接口 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH tools、Cordis 和兼容 Node | 是 | 挂载并注册工具 | 回到本地转换 |
| 可记录的 UTF-8 文本 | 是 | 限制数据形态和泄露风险 | 将操作留在会话外 |
| 目标 profile 能解析该子包 | 是 | 执行固定版本 | 停在观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认隔离 profile 加载 | 清单出现 encoding |
| 核对 | 用公开文本测试合法和非法输入 | 结果与独立对照一致 |
| 退出 | 禁用插件并复查清单 | 仍可使用原本地工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 包与宿主环境，金额未知 | 核对 profile 和记录范围 | 固定包安装待验 |
| 持续 | 进程内转换及模型调用，金额未知 | 筛选公开样本并复核 | 单位任务耗时未知 |
| 失败恢复 | 可能重复调用，金额未知 | 换本地工具校验字节及错误 | 实际退出回执待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 编解码 | 分支及严格校验直接可见 | 真实任务错误率 |
| 哈希和 UUID | 运行时标准接口接线 | 宿主日志管理效果 |
| 带 BOM 文本往返 | 解码使用默认 BOM 处理 | 目标环境结果需对照 |

> **思考**：[Q02](#research-q02) 的 UTF-8 解码器可能丢弃前导 BOM。[Q03](#research-q03) 的参数记录意味着把文本转成摘要也不会避免原文进入会话。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将公开文本转换做成直接的会话工具，[Q02](#research-q02) 的严格 Base64 门槛补足宽容解码可能忽略的字符与未用位错误。

[Q02](#research-q02) 在 Buffer 前检查标准编码的未用位和 padding，按 UTF-8 字节限制资源。解码参数对 BOM 的默认处理值得加入回归测试。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的 UTF-8 解码器可能丢弃前导 BOM。[Q03](#research-q03) 的参数记录意味着把文本转成摘要也不会避免原文进入会话。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 建议在隔离 profile 仅用公开样本复核 [Q02](#research-q02) 的往返和拒绝行为。机密、文件字节及要求保留 BOM 的文本交给本地工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具接线、UTF-8 校验及转换分支已按固定源码核对。BOM 边界来自源码推断，兼容、会话记录和任务收益仍待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-encoding/package.json、packages/dsh-tool-encoding/cordis.patch.yml、packages/dsh-tool-encoding/lib/index.js、packages/dsh-tool-encoding/lib/encoding.js、packages/dsh-tool-encoding/README.md 及固定范围 inventory；组件：packages/dsh-tool-encoding。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定子包包声明、profile 补丁、注册和实际执行分支；未运行插件、测试、安装或宿主。
- 下一步：在隔离 profile 对比普通 Unicode、前导 BOM、非法 UTF-8、非零填充位、残缺 padding 和不完整 URI；核对公开标记是否留在记录。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出在工具契约中显式公布 BOM 策略，用多种编解码往返样本检查用户能否选到与数据一致的动作。

在隔离 profile 对比普通 Unicode、前导 BOM、非法 UTF-8、非零填充位、残缺 padding 和不完整 URI；核对公开标记是否留在记录。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 285 | 231 | 58 | — |
| .md | source | 2 | 344 | — | — | 2569 |
| .ts | source | 3 | 311 | 222 | 60 | — |
| .ts | test | 2 | 298 | 242 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-toolkit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话里的 UTF-8 编码、摘要与 UUID 操作在什么条件下可代替临时 shell，在哪些输入下会改变数据或产生泄露风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具如何处理公开样本，常规 shell 的哪一步被替换？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

维护 API 或分析样本时，调用方可直接传 action 和非敏感 UTF-8 字符串。包在 profile 注入 tools，注册 encoding；入口按 action 调用 executeAction，输出以 JSON.stringify 渲染为回执。文本编码由 Buffer 或 URI 函数完成，hash 对字符串按 UTF-8 计算摘要，UUID 使用 Node 随机接口。与在 JSON 参数里再构造 shell 引号相比，工具参数直接承载样本文本。常用转换与随机源来自标准运行时，增量是会话入口和一致的输入边界。全文件摘要仍宜直接在本地计算字节，不必把文件读进对话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-encoding/package.json:21-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/package.json#L21-L38)

声明 peer、补丁及默认入口。

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-encoding/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/cordis.patch.yml#L1-L4)

明确挂载条目及包名。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-encoding
      name: '@deepseek-ai/dsh-tool-encoding'
```

**依据 3 · 源码核查**：[packages/dsh-tool-encoding/lib/index.js:9-29](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/index.js#L9-L29)

宿主 tools 服务及支持动作。

<details>
<summary>查看原文（21行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools';
import { executeAction } from './encoding.js';
export const name = '@deepseek-ai/dsh-tool-encoding';
export const inject = ['tools'];
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'encoding',
        description: 'Encoding and hashing utilities (UTF-8 text only). ' +
            'Actions: base64_encode, base64_decode, base64url_encode, base64url_decode, ' +
            'url_encode (encodes one URL component, not a complete query string), ' +
            'url_decode, hex_encode, hex_decode, hash (md5/sha1/sha256/sha512, ' +
            'non-security use only), uuid. Inputs and outputs are strings. ' +
            'Do not pass secrets or tokens (tool arguments are recorded in session logs).',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: [
                    'base64_encode', 'base64_decode', 'base64url_encode', 'base64url_decode',
                    'url_encode', 'url_decode', 'hex_encode', 'hex_decode', 'hash', 'uuid',
                ],
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-encoding/lib/index.js:42-51](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/index.js#L42-L51)

executeAction 和回执。

<details>
<summary>查看原文（10行）</summary>

```text
        output: {
            schema: { type: 'json' },
            render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
        },
        execute: (args) => {
            const { action, ...rest } = args;
            return Promise.resolve(executeAction(action, rest));
        },
        timeoutMs: 1000,
    }));
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:111-137](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L111-L137)

URI component、hex、哈希和 UUID 的实际调用。

<details>
<summary>查看原文（27行）</summary>

```text
function urlEncode(input) {
    return encodeURIComponent(input);
}
function urlDecode(input) {
    try {
        return decodeURIComponent(input);
    }
    catch {
        throw new Error('encoding: invalid percent-encoding');
    }
}
function hexEncode(input) {
    return Buffer.from(input, 'utf8').toString('hex');
}
function hexDecode(input) {
    assertHex(input);
    return decodeUtf8Strict(Buffer.from(input, 'hex'));
}
function digest(algorithm, input) {
    if (!Object.hasOwn(ALGORITHMS, algorithm)) {
        throw new Error(`encoding: unknown algorithm "${algorithm}"`);
    }
    return createHash(algorithm).update(input, 'utf8').digest('hex');
}
function newUuid() {
    return randomUUID();
}
```

</details>

**依据 6 · 作者声明**：[packages/dsh-tool-encoding/README.md:11-13](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/README.md#L11-L13)

作者以 shell 转义和跨平台命令作比较。

```text
## 动机

Agent 处理编码/哈希是日常高频操作：查看 API 响应里的 base64 字段（JWT payload）、构造 query 参数、校验文件完整性（sha256）、生成 UUID。当前做法 `bash -c "echo ... | base64"` 的问题：进程开销、**引号转义地狱**（base64 串嵌进 bash 命令再嵌进 JSON 参数，双层转义错误率极高）、跨平台工具命名不一致（`md5` vs `md5sum` vs `shasum -a 256`）。
```

#### 缺口

- 缺少同任务的转义错误率与耗时
  **影响**：不能量化会话工具的实际优势
  **进一步探讨**：用固定公开多语言样本比较一次合格回执和人工修正

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 严格解码能否保持所有合法 UTF-8 文本往返？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

标准 base64 拒绝空白、残缺 padding 和非零的未用位。base64url 先将替代字符转回标准字母表，无 padding 时补齐，有显式但残缺的 padding 时拒绝，再复用同一严格校验。解码所得字节进入 fatal UTF-8 解码器，避免把非法字节替换成 U+FFFD。这里没有设置 ignoreBOM: true。按 TextDecoder 的默认 BOM 处理推断，前导 U+FEFF 编为字节 EF BB BF 后，经 base64、base64url 或 hex 回读会丢掉起始标记。URL 解码走另一条路径，不应合并为同一种往返承诺。输入按 UTF-8 字节计量并拒绝孤立代理项，工具不应接收任意二进制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:22-47](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L22-L47)

检查 Unicode 与字节数；fatal 解码未显式保留 BOM。

<details>
<summary>查看原文（26行）</summary>

```text
/** 拒绝 well-formed Unicode 之外的孤立 surrogate（所有文本输入统一入口）。 */
function validateUnicode(input) {
    if (!input.isWellFormed())
        throw new Error('encoding: invalid Unicode (lone surrogate)');
}
/** 输入字节上限（UTF-8 字节数，非 UTF-16 code unit 数）。 */
function assertInputBytes(input) {
    if (Buffer.byteLength(input, 'utf8') > MAX_INPUT_BYTES) {
        throw new Error(`encoding: input exceeds ${MAX_INPUT_BYTES} bytes`);
    }
}
/** 输出字节上限（编码膨胀防护）。 */
function assertOutputBytes(output) {
    if (Buffer.byteLength(output, 'utf8') > MAX_OUTPUT_BYTES) {
        throw new Error(`encoding: output exceeds ${MAX_OUTPUT_BYTES} bytes`);
    }
}
/** fatal UTF-8 解码：非法序列抛错；合法 U+FFFD（ef bf bd）不误伤。 */
function decodeUtf8Strict(buffer) {
    try {
        return new TextDecoder('utf-8', { fatal: true }).decode(buffer);
    }
    catch {
        throw new Error('encoding: invalid UTF-8 output');
    }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:48-69](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L48-L69)

标准 base64 补位和 canonical 检查。

<details>
<summary>查看原文（22行）</summary>

```text
/** 标准 base64 输入校验（无空白、`=` 仅末尾 ≤2、长度必须为 4 的倍数、canonical unused bits）。 */
function assertBase64(input) {
    if (!BASE64_RE.test(input))
        throw new Error('encoding: invalid base64 input');
    // 长度非 4 倍数一律拒绝（含模 4 余 1/2/3）：Node 的宽容解码会静默截断，必须自己拦
    if (input.length % 4 !== 0)
        throw new Error('encoding: invalid base64 input');
    // RFC 4648 canonical（ENC-02）：最后量子的 unused bits 必须为 0
    //   xx== → 第二字符低 4 bit 为 0；xxx= → 第三字符低 2 bit 为 0
    // 否则多个编码映射到同一文本（如 'Zh==' 与 canonical 'Zg==' 都解出 'f'）
    const dataLen = input.length - (input.endsWith('==') ? 2 : input.endsWith('=') ? 1 : 0);
    if (dataLen % 4 === 2) {
        const second = BASE64_ALPHABET.indexOf(input.charAt(dataLen - 1));
        if (second === -1 || (second & 0b1111) !== 0)
            throw new Error('encoding: non-canonical base64 input');
    }
    else if (dataLen % 4 === 3) {
        const third = BASE64_ALPHABET.indexOf(input.charAt(dataLen - 1));
        if (third === -1 || (third & 0b11) !== 0)
            throw new Error('encoding: non-canonical base64 input');
    }
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:76-112](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L76-L112)

编码、base64url 兼容归一和 URL 分路。

<details>
<summary>查看原文（37行）</summary>

```text
function b64Encode(input) {
    return Buffer.from(input, 'utf8').toString('base64');
}
function b64Decode(input) {
    assertBase64(input);
    return decodeUtf8Strict(Buffer.from(input, 'base64'));
}
function b64UrlEncode(input) {
    // Node 18.14+ 支持 'base64url'：无 padding、-/_ 字符集
    return Buffer.from(input, 'utf8').toString('base64url');
}
function b64UrlDecode(input) {
    // 宽容读入：+/ 与 -_ 双字符集、可选 padding → 归一为标准 base64
    const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    // RECHECK-ENC-01：显式 padding 必须完整（数据 + padding 为 4 的倍数），
    // 残缺 padding（如 'Zg='）拒绝而非自动补全；无 padding 时按量子补齐
    let padded;
    const firstPadding = normalized.indexOf('=');
    if (firstPadding !== -1) {
        const data = normalized.slice(0, firstPadding);
        const padding = normalized.slice(firstPadding);
        if (!/^={1,2}$/.test(padding))
            throw new Error('encoding: invalid base64 input');
        padded = data + padding;
        if (padded.length % 4 !== 0)
            throw new Error('encoding: invalid base64 input');
    }
    else {
        if (normalized.length % 4 === 1)
            throw new Error('encoding: invalid base64 input');
        padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    }
    assertBase64(padded); // 含 canonical unused bits 校验
    return decodeUtf8Strict(Buffer.from(padded, 'base64'));
}
function urlEncode(input) {
    return encodeURIComponent(input);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:122-127](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L122-L127)

hex 走同一严格 UTF-8 解码。

```text
function hexEncode(input) {
    return Buffer.from(input, 'utf8').toString('hex');
}
function hexDecode(input) {
    assertHex(input);
    return decodeUtf8Strict(Buffer.from(input, 'hex'));
```

**依据 5 · 作者声明**：[packages/dsh-tool-encoding/README.md:65-80](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/README.md#L65-L80)

作者给出前导 U+FEFF 的编码示例及文本范围。

<details>
<summary>查看原文（16行）</summary>

```text
## 支持的操作

| action | 说明 | 示例 |
|--------|------|------|
| `base64_encode` / `base64_decode` | RFC 4648 标准 base64（严格校验） | `"foobar"` → `"Zm9vYmFy"` |
| `base64url_encode` / `base64url_decode` | JWT 风格，输出无 padding，解码兼容 `+/` 与可选 padding | `"\uFEFF"` → `"77u_"` |
| `url_encode` / `url_decode` | **component 语义**（非完整 query）：空格 `%20` 非 `+`，`!'()*` 不转义，`decode("+")` → `"+"` | `"a b"` → `"a%20b"` |
| `hex_encode` / `hex_decode` | UTF-8 字节 hex；解码结果必须合法 UTF-8 | `"AB"` → `"4142"` |
| `hash` | md5/sha1/sha256/sha512 hex 摘要；**仅非安全用途** | `sha256("")` → `e3b0c442...` |
| `uuid` | UUID v4 字符串（`crypto.randomUUID()`） | `"550e8400-..."` |

语义契约：

- **v1 是 UTF-8 文本工具**：所有输入输出为字符串；二进制内容用 hex 表示；解码结果必须合法 UTF-8
- **所有 action 返回字符串**（含 `uuid`）
- **不要对机密材料使用本工具**：tool 参数会记录进会话日志
```

</details>

#### 缺口

- 本轮未验证目标宿主的 BOM 往返回执
  **影响**：不能把静态推断当作已复现实验
  **进一步探讨**：在目标 Node 与 DSH 版本中对照前导及中间 U+FEFF、普通 Unicode、非法 UTF-8

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些数据适合进入会话，如何核实后再决定是否使用？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

只有已允许进入会话的公开文本适合试用。工具描述明确提示参数可被写入会话日志，hash 虽只输出摘要，输入字段仍含原文。文件校验应直接对文件字节计算，已存在的文件摘要命令是退路。作者报告 rc.1 consumer 验证，本轮尚未证实同提交的私有子包如何被目标 profile 加载。隔离 profile 用公开小样本比较输出、错误和会话记录，失败时关闭插件并回到本地命令。可验证的改进是把解码的 BOM 保留策略写入工具契约并随动作提示，仅当真实消费者能正确区分文本和字节转换且兼容既有输入时采用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-encoding/lib/index.js:15-21](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/index.js#L15-L21)

工具文本明确限定 UTF-8、提示会话记录。

```text
        name: 'encoding',
        description: 'Encoding and hashing utilities (UTF-8 text only). ' +
            'Actions: base64_encode, base64_decode, base64url_encode, base64url_decode, ' +
            'url_encode (encodes one URL component, not a complete query string), ' +
            'url_decode, hex_encode, hex_decode, hash (md5/sha1/sha256/sha512, ' +
            'non-security use only), uuid. Inputs and outputs are strings. ' +
            'Do not pass secrets or tokens (tool arguments are recorded in session logs).',
```

**依据 2 · 源码核查**：[packages/dsh-tool-encoding/lib/encoding.js:153-168](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/lib/encoding.js#L153-L168)

UUID 拒绝额外参数，hash 接收字符串并校验。

<details>
<summary>查看原文（16行）</summary>

```text
    switch (action) {
        case 'uuid': {
            // AUDIT-ENC-02：拒绝任意额外参数（含拼写错误字段），不只检查已知字段
            if (Object.keys(actionParams).length > 0) {
                throw new Error('encoding: uuid takes no parameters');
            }
            return newUuid();
        }
        case 'hash': {
            if (typeof actionParams.algorithm !== 'string')
                throw new Error('encoding: missing required parameter "algorithm"');
            if (typeof actionParams.input !== 'string')
                throw new Error('encoding: missing required parameter "input"');
            validateUnicode(actionParams.input);
            assertInputBytes(actionParams.input);
            return digest(actionParams.algorithm, actionParams.input);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-encoding/package.json:2-11](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/package.json#L2-L11)

私有子包与 Node 范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "name": "@deepseek-ai/dsh-tool-encoding",
  "description": "DSH encoding tool plugin",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "license": "MIT",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

</details>

**依据 4 · 作者声明**：[packages/dsh-tool-encoding/README.md:82-97](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-encoding/README.md#L82-L97)

作者报告兼容及打包链，非本轮复现。

<details>
<summary>查看原文（16行）</summary>

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1` 的隔离 consumer 中完成全链路验证：

- **类型/运行时**：`@deepseek-ai/cordis@^4.0.1` + `@deepseek-ai/dsh-tools@>=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants@>=0.0.1-rc.1 <0.2.0`（peer）；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 0.1.5-rc.1 consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）


## 版本适配

- **适配 DSH 版本**: DSH 0.1.5-rc.1（npm）
- **bundle 声明**: `package.json` 的 `dsh.bundle`（patch 指向 `cordis.patch.yml`）+ `exports` 导出
- **patch 格式**: `cordis.patch.yml` 使用 `- insert:` 列表（patch 是 id-targeted 语义，裸 `- id:` 条目会报 `entry not found`）
- **files**: 发布 tarball 含 `lib/`、`src/`、`cordis.patch.yml`
```

</details>

#### 缺口

- 宿主实际日志内容、包来源与卸载回执未核
  **影响**：决定是否能在目标 profile 采用，无法用文案证明保密
  **进一步探讨**：用公开标记值核对真实会话记录，并确认卸载后工具清单

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
