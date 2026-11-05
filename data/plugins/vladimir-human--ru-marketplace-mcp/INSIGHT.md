# RU Marketplace MCP

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[416b065](https://github.com/Vladimir-Human/ru-marketplace-mcp/tree/416b065d03c971be86d982ccb5a6a1855069f09d)

<!-- BEGIN META -->
[![GitHub ★ 173](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=173&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vladimir-Human/ru-marketplace-mcp)
<!-- END META -->

> **功能**：跨市场读取价格、库存和商品信息，并汇总比价和原生商品复核。

> **亮点**：[Q01](#research-q01) 把多来源报价与健康状态放进同一响应。

> **主要限制**：[Q03](#research-q03) 榜单排名不能替代同款、条件或库存验证。

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
  - [Q01 · 聚合查询改变了什么？](#detail-section-11)
  - [Q02 · 哪些价格可以排序？](#detail-section-12)
  - [Q03 · 商品卡复核是否能保证成交？](#detail-section-13)
  - [Q04 · 怎样试用并保留人工退路？](#detail-section-14)
  - [Q05 · 先比价再验卡能提高决策质量吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨来源比较商品的用户可以看聚合证据。

手工逐站核对能检查商品卡但耗时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 比价 | 统一普通卢布价 | 受来源与条件限制 |
| 验卡 | 复核所选商品 | 不能保证成交 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Python MCP 环境 | 必需 | 提供工具 | 无法调用 |
| 可用源站 | 查询必需 | 提供行情 | 返回部分失败 |
| Chrome/CDP | 部分来源需要 | 执行读取 | 跳过对应来源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 查询 | 选标准型号和来源 | 看来源状态 |
| 核对 | 回查卡片 | 区分变体与价格类型 |
| 退出 | 回到原站 | 人工核实 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 环境费用未知 | 安装耗时未知 | 不同来源条件不同 |
| 持续 | 请求费用未知 | 核验耗时未知 | 限流和站点变化 |
| 恢复 | 重试未知 | 排障未知 | 保留局部结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨源归并 | 并发、分类和排序可查 | 实际覆盖和查找时间 |

> **思考**：[Q03](#research-q03) 榜单排名不能替代同款、条件或库存验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把多来源报价与健康状态放进同一响应。

来源错误隔离，外币保留但不参加排名。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 榜单排名不能替代同款、条件或库存验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用匿名来源和标准型号试查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根仓 MCP 代码，未运行源站、CDP 或服务。

- 已检查：作者 README、包清单、源码路径 packages/compare-connector/src/compare_connector/server.py、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根仓 MCP 代码，未运行源站、CDP 或服务。
- 下一步：按固定样例标注身份和可用价格

**分析版本**

- **仓库**：[Vladimir-Human/ru-marketplace-mcp](https://github.com/Vladimir-Human/ru-marketplace-mcp)
- **版本号**：1.6.0（[固定提交 416b065](https://github.com/Vladimir-Human/ru-marketplace-mcp/tree/416b065d03c971be86d982ccb5a6a1855069f09d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 比较有无卡片复核的错误率。

按固定样例标注身份和可用价格

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 91 | 16400 | — | — | 142018 |
| .md | example | 1 | 37 | — | — | 201 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Vladimir-Human/ru-marketplace-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查跨市场排序能提供什么证据、失效与浏览器依赖。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合查询改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要比较同类商品的操作者可以让 MCP 并发查询选定来源，再读统一结果。相比逐个网站查找，省去手工归并，但站点商品身份及变体仍需复核。

#### 证据与依据

**依据 1 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1156-1172](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1156-L1172)

并发查询和缺安装结果

<details>
<summary>查看原文（17行）</summary>

```text
    log_event("compare_prices.start", query=text, sources=active, limit=per_source_limit, in_stock_only=in_stock_only)
    if ctx is not None:
        await ctx.info(f"compare_prices: {text!r} across {', '.join(active)}")

    results = await asyncio.gather(*(_run_source(name, text, per_source_limit) for name in active))

    outcomes = [outcome for outcome, _ in results]
    offers: list[MarketOffer] = _dedupe(offer for _, source_offers in results for offer in source_offers)

    for name in missing:
        outcomes.append(
            SourceOutcome(
                source=name,
                status="not_installed",
                detail="connector package is not installed in this environment",
            )
        )
```

</details>

**依据 2 · 作者声明**：[README.md:8-17](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/README.md#L8-L17)

作者声明跨市场及依赖

<details>
<summary>查看原文（10行）</summary>

```text
**MCP-серверы для российских и китайских маркетплейсов.** Цены, наличие,
рейтинги, отзывы и реквизиты продавцов с Wildberries, Ozon, Яндекс Маркета,
Детского мира, Авито, AliExpress, Taobao, Мегамаркета, Lamoda, DNS и Ситилинка.
Плюс недвижимость с Циана и
сравнение цен по всем товарным источникам одним вызовом.

Только чтение. Ключи API, токены и регистрация не нужны — площадки с жёстким
анти-ботом читаются через ваш собственный Chrome. Одно исключение по желанию:
опциональный MPStats берёт платный токен (`MPSTATS_MP_AUTH`) — без него всё
остальное работает как прежде.
```

</details>

#### 缺口

- 无任务对照
  **影响**：无法量化节省
  **进一步探讨**：对照同一组商品

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些价格可以排序？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

只有符合普通卢布价格判据的条目进入有价段，外币及未达库存条件保留在后段。每个来源有独立超时和错误；complete 由失败来源决定，不覆盖商品等价性、查询上限或当前成交价。

#### 证据与依据

**依据 1 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:985-1011](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L985-L1011)

独立超时和错误

<details>
<summary>查看原文（27行）</summary>

```text
    Never raises: a comparison with three of four sources is useful, while an
    exception would discard the three that worked.
    """
    started = time.monotonic()
    try:
        offers = await asyncio.wait_for(_SEARCH_IMPLS[name](query, limit), timeout=SOURCE_TIMEOUT_S)
    except TimeoutError:
        return (
            SourceOutcome(
                source=name,
                status="timeout",
                detail=f"no response within {SOURCE_TIMEOUT_S:.0f}s",
                error_code=ErrorCode.TIMEOUT.value,
                retryable=True,
                elapsed_ms=round((time.monotonic() - started) * 1000),
            ),
            [],
        )
    except Exception as exc:
        return (
            SourceOutcome(
                source=name,
                **_source_error(exc),
                elapsed_ms=round((time.monotonic() - started) * 1000),
            ),
            [],
        )
```

</details>

**依据 2 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1174-1193](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1174-L1193)

分组并排序

<details>
<summary>查看原文（20行）</summary>

```text
    # Rank on everyday ruble prices only. The currency check is explicit rather
    # than implied by price_rub being None: an adapter that starts populating
    # price_rub from a foreign-currency field should fail this filter, not
    # quietly win the comparison.
    priced_all = [offer for offer in offers if _ranks_in_rubles(offer)]
    priced = sorted(
        (offer for offer in priced_all if not in_stock_only or offer.in_stock is True),
        key=lambda offer: offer.price_rub or 0.0,
    )
    # Unpriced offers keep their place at the end rather than being dropped:
    # "found, but not priced in rubles" is information, and for Taobao the yuan
    # price still rides along in price_native.
    unpriced = [
        offer for offer in offers if not _ranks_in_rubles(offer) or (in_stock_only and offer.in_stock is not True)
    ]
    ranked = priced + unpriced
    foreign = [offer for offer in offers if offer.currency != "rub"]

    ok_sources = [outcome.source for outcome in outcomes if outcome.status == "ok"]
    failed_sources = [outcome.source for outcome in outcomes if outcome.status != "ok"]
```

</details>

**依据 3 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1268-1280](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1268-L1280)

结果标志与证据

<details>
<summary>查看原文（13行）</summary>

```text
    return CompareResponse(
        query=text,
        sources_queried=active,
        sources_ok=ok_sources,
        complete=not failed_sources,
        total_offers=len(ranked),
        cheapest=cheapest,
        cheapest_comparable=cheapest_comparable,
        price_spread_rub=price_spread,
        offers=ranked,
        source_outcomes=outcomes,
        warnings=warnings,
        server_version=SERVER_VERSION,
```

</details>

#### 缺口

- 无实时数据
  **影响**：无法判断解析变化和价格时效
  **进一步探讨**：固定同款与不同币种做对照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 商品卡复核是否能保证成交？

**研究主题**：缺陷与关键质疑

#### 完整回答

原生复核会按来源检查所请求行，亚型不匹配报错，条件价格不当作普通价格认证。搜索和卡片也可能观察到不同报价，且一些来源使用带身份的 Chrome。读操作仍向外部站点发请求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1410-1448](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1410-L1448)

精确行与条件价格

<details>
<summary>查看原文（39行）</summary>

```text
            raise_tool_error(
                BadRequestError(
                    f"yandex variant mismatch: expected sku_id {expected_variant_id!r}, card returned {observed_variant or '<missing>'}"
                )
            )
    record = payload if isinstance(payload, dict) else {}
    if name == "wildberries":
        # Price and identity must describe the same requested row, never an
        # arbitrary first item from a batch envelope.
        items = record.get("items")
        candidates = (
            [item for item in items if isinstance(item, dict) and str(item.get("nm_id")) == requested_numeric_id]
            if isinstance(items, list)
            else []
        )
        record = candidates[0] if len(candidates) == 1 else {}
    elif name == "detsky_mir":
        product = record.get("product")
        record = product if isinstance(product, dict) and str(product.get("product_id")) == requested_numeric_id else {}
    verification: dict[str, object] | None = None
    if expected_price_rub is not None:
        price_field = "price" if name == "ozon" else "price_rub"
        price_kind = record.get("price_kind")
        if not isinstance(price_kind, str):
            price_kind = ""
        # A Yandex card without an everyday price carries only the subscriber
        # (Plus) amount: certifying it would confirm a price most buyers cannot
        # get, so the kind is reported instead of the comparison being made.
        if (
            not price_kind
            and name == "yandex_market"
            and record.get("price_rub") is None
            and record.get("price_with_plus") is not None
        ):
            price_kind = "subscription"
        if isinstance(price_kind, str) and price_kind and price_kind != "regular":
            # A conditional amount (WB Wallet, subscription) is not the everyday
            # price, so certifying it against expected_price_rub would confirm a
            # price most buyers cannot get. Report the kind and refuse to compare.
```

</details>

**依据 2 · 作者声明**：[README.md:33-44](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/README.md#L33-L44)

不同来源的网络和登录条件

<details>
<summary>查看原文（12行）</summary>

```text
| ----------------- | ------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Wildberries**   | 8            | анонимный HTTP                                                             | Поиск, карточки, отзывы, вопросы о товаре, реквизиты продавца, каталог и товары категории |
| **Яндекс Маркет** | 2            | анонимный HTTP                                                             | Цены разных продавцов, разбивка оценок по звёздам, отзывы                                 |
| **Детский мир**   | 3            | анонимный HTTP                                                             | Детские товары, наличие в офлайн-магазинах, категории                                     |
| **Ozon**          | 3            | ваш Chrome; с домашнего IP часто и без него                                | Поиск, карточки, отзывы                                                                   |
| **Авито**         | 3            | ваш Chrome + российский домашний IP и запросы вразрядку — иначе блок по IP | Поиск объявлений, карточки, репутация продавца                                            |
| **Taobao**        | 2            | ваш Chrome с активным входом в Taobao                                      | Поиск и карточки, цены в юанях                                                            |
| **Мегамаркет**    | 2            | ваш Chrome с активным входом — анонимной сессии API отдаёт пусто           | Поиск и карточки через мобильный API                                                      |
| **Lamoda**        | 2            | карточки: HTTP GraphQL → Chrome при отказе; поиск — Chrome                            | Поиск, карточки с размерами                                                               |
| **DNS**           | 2            | ваш Chrome (Qrator)                                                        | Поиск и карточки электроники                                                              |
| **Ситилинк**      | 2            | ваш Chrome (Qrator)                                                        | Поиск и карточки электроники                                                              |
| **AliExpress**    | 2            | ваш Chrome (x5sec)                                                       | Поиск и карточки, цены в рублях                            |
```

</details>

#### 缺口

- 未验证源站和浏览器授权
  **影响**：不能保证覆盖或实际价格
  **进一步探讨**：在合规隔离环境核对商品、变体和价差

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用并保留人工退路？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

选择标准型号与少量可访问来源，先看 source_outcomes，再到原始卡片核对价格、条件和库存。服务需要 Python MCP 环境；部分来源需要 Chrome CDP 与匹配网络。失败就保留局部结果并用原站查，不用服务直接下单。

#### 证据与依据

**依据 1 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1192-1193](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1192-L1193)

来源成功与失败分类

```text
    ok_sources = [outcome.source for outcome in outcomes if outcome.status == "ok"]
    failed_sources = [outcome.source for outcome in outcomes if outcome.status != "ok"]
```

**依据 2 · 作者声明**：[README.md:33-45](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/README.md#L33-L45)

访问前提不同

<details>
<summary>查看原文（13行）</summary>

```text
| ----------------- | ------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Wildberries**   | 8            | анонимный HTTP                                                             | Поиск, карточки, отзывы, вопросы о товаре, реквизиты продавца, каталог и товары категории |
| **Яндекс Маркет** | 2            | анонимный HTTP                                                             | Цены разных продавцов, разбивка оценок по звёздам, отзывы                                 |
| **Детский мир**   | 3            | анонимный HTTP                                                             | Детские товары, наличие в офлайн-магазинах, категории                                     |
| **Ozon**          | 3            | ваш Chrome; с домашнего IP часто и без него                                | Поиск, карточки, отзывы                                                                   |
| **Авито**         | 3            | ваш Chrome + российский домашний IP и запросы вразрядку — иначе блок по IP | Поиск объявлений, карточки, репутация продавца                                            |
| **Taobao**        | 2            | ваш Chrome с активным входом в Taobao                                      | Поиск и карточки, цены в юанях                                                            |
| **Мегамаркет**    | 2            | ваш Chrome с активным входом — анонимной сессии API отдаёт пусто           | Поиск и карточки через мобильный API                                                      |
| **Lamoda**        | 2            | карточки: HTTP GraphQL → Chrome при отказе; поиск — Chrome                            | Поиск, карточки с размерами                                                               |
| **DNS**           | 2            | ваш Chrome (Qrator)                                                        | Поиск и карточки электроники                                                              |
| **Ситилинк**      | 2            | ваш Chrome (Qrator)                                                        | Поиск и карточки электроники                                                              |
| **AliExpress**    | 2            | ваш Chrome (x5sec)                                                       | Поиск и карточки, цены в рублях                            |
| **Циан**          | 2            | ваш Chrome (WAF по IP)                                                     | Недвижимость: поиск по фильтрам (продажа, аренда, посуточно) и карточка объявления         |
```

</details>

**依据 3 · 作者声明**：[README.md:1151-1165](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/README.md#L1151-L1165)

CDP 模式和独立浏览器

<details>
<summary>查看原文（15行）</summary>

```text
These four read through your Chrome (CDP). Megamarket (`megamarket_*`) goes
through the mobile JSON API behind ServicePipe and needs an active login — an
anonymous session reads empty. DNS (`dns_*`) and Citilink (`citilink_*`) render
DOM behind Qrator with no anonymous path at all. Lamoda (`lamoda_*`) is split:
search through Chrome, cards over HTTP GraphQL first (tier 1). A non-200 response
or `httpx.TransportError` triggers exactly one in-page GraphQL POST through your
Chrome over CDP (tier 2); successful fallback reads report `tier_used: graphql_cdp`.
HTTP 200 skips CDP. The reason is the 2026-10-12 307 loop from GraphQL over HTTPS.
All of them need Chrome with CDP (`scripts/start_chrome_cdp.sh`), but Lamoda cards
only need it for the fallback. Your everyday Chrome can stay open: the launcher
starts a second Chrome with its own `--user-data-dir`, on-screen. If the window
did go off-screen (the connector's autostart on Windows), bring it back (to log
in by hand or pass a site's check) with `marketplace-mcp browser show`. Nine
sources run through CDP in total: these plus
Taobao, AliExpress, Cian, Ozon and Avito; for Ozon and Avito, Chrome is also only the
```

</details>

#### 缺口

- 未部署 MCP
  **影响**：不能确认实际维护成本
  **进一步探讨**：在受控客户端先测匿名来源

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 先比价再验卡能提高决策质量吗？

**研究主题**：新假设与验证

#### 完整回答

比较直接采用搜索首名与加入卡片验证的流程，给出同型号、外币、优惠门槛和错变体样例。记录错误推荐、耗时和站点失败。若查验无改善或代价不合算，则不增设该步骤。

#### 证据与依据

**依据 1 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1174-1189](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1174-L1189)

搜索排序

<details>
<summary>查看原文（16行）</summary>

```text
    # Rank on everyday ruble prices only. The currency check is explicit rather
    # than implied by price_rub being None: an adapter that starts populating
    # price_rub from a foreign-currency field should fail this filter, not
    # quietly win the comparison.
    priced_all = [offer for offer in offers if _ranks_in_rubles(offer)]
    priced = sorted(
        (offer for offer in priced_all if not in_stock_only or offer.in_stock is True),
        key=lambda offer: offer.price_rub or 0.0,
    )
    # Unpriced offers keep their place at the end rather than being dropped:
    # "found, but not priced in rubles" is information, and for Taobao the yuan
    # price still rides along in price_native.
    unpriced = [
        offer for offer in offers if not _ranks_in_rubles(offer) or (in_stock_only and offer.in_stock is not True)
    ]
    ranked = priced + unpriced
```

</details>

**依据 2 · 源码核查**：[packages/compare-connector/src/compare_connector/server.py:1410-1448](https://github.com/Vladimir-Human/ru-marketplace-mcp/blob/416b065d03c971be86d982ccb5a6a1855069f09d/packages/compare-connector/src/compare_connector/server.py#L1410-L1448)

卡片身份与条件价格

<details>
<summary>查看原文（39行）</summary>

```text
            raise_tool_error(
                BadRequestError(
                    f"yandex variant mismatch: expected sku_id {expected_variant_id!r}, card returned {observed_variant or '<missing>'}"
                )
            )
    record = payload if isinstance(payload, dict) else {}
    if name == "wildberries":
        # Price and identity must describe the same requested row, never an
        # arbitrary first item from a batch envelope.
        items = record.get("items")
        candidates = (
            [item for item in items if isinstance(item, dict) and str(item.get("nm_id")) == requested_numeric_id]
            if isinstance(items, list)
            else []
        )
        record = candidates[0] if len(candidates) == 1 else {}
    elif name == "detsky_mir":
        product = record.get("product")
        record = product if isinstance(product, dict) and str(product.get("product_id")) == requested_numeric_id else {}
    verification: dict[str, object] | None = None
    if expected_price_rub is not None:
        price_field = "price" if name == "ozon" else "price_rub"
        price_kind = record.get("price_kind")
        if not isinstance(price_kind, str):
            price_kind = ""
        # A Yandex card without an everyday price carries only the subscriber
        # (Plus) amount: certifying it would confirm a price most buyers cannot
        # get, so the kind is reported instead of the comparison being made.
        if (
            not price_kind
            and name == "yandex_market"
            and record.get("price_rub") is None
            and record.get("price_with_plus") is not None
        ):
            price_kind = "subscription"
        if isinstance(price_kind, str) and price_kind and price_kind != "regular":
            # A conditional amount (WB Wallet, subscription) is not the everyday
            # price, so certifying it against expected_price_rub would confirm a
            # price most buyers cannot get. Report the kind and refuse to compare.
```

</details>

#### 缺口

- 无同任务对照
  **影响**：质量增益未知
  **进一步探讨**：按固定样例标注身份和可用价格

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
