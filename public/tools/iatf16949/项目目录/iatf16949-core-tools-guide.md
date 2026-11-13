# IATF 16949 与 APQP/PPAP/FMEA/MSA/SPC 关系说明

更新日期: 2026-04-26

## 1. 先说结论

`IATF 16949` 是汽车行业质量管理体系要求。

`APQP / PPAP / FMEA / MSA / SPC` 是汽车行业中用于落实这些要求的核心工具。它们不是对立关系，也不是同一级别的独立规范，而是:

- `IATF 16949` 规定组织必须建立什么样的体系和过程
- `Core Tools` 规定组织通常如何把这些要求做实、做细、做成证据
- `CSR`（客户特殊要求）进一步规定必须按哪一版、哪种格式、哪些提交要求来执行

最实用的记忆方式:

`IATF 16949 -> APQP策划 -> FMEA识别风险 -> Control Plan控制风险 -> MSA验证测量 -> SPC监控过程 -> PPAP提交客户批准`

说明:

- `Control Plan` 严格说不在你最开始问的五个缩写里，但它在实际应用中是连接 `FMEA / MSA / SPC / PPAP` 的关键文件。
- `PPAP` 不是单一条款，而是把前面各工具形成的证据包提交给客户批准。

## 2. 两种关系

### 2.1 层级关系

从层级上看:

1. `IATF 16949` 是上位体系要求
2. `CSR` 叠加在体系要求之上，对 OEM 或客户的具体方法做细化
3. `APQP / PPAP / FMEA / MSA / SPC / Control Plan` 是常用实施工具
4. 审核时看的是这些工具是否真的支撑了体系有效运行

### 2.2 业务流关系

从业务流上看:

1. 接收客户图纸、技术规范、法规要求、CSR
2. 用 `APQP` 组织整个项目和阶段输出
3. 用 `DFMEA / PFMEA` 识别产品和过程风险
4. 把风险转化为 `Control Plan`
5. 用 `MSA` 确认控制计划中的量测手段可靠
6. 用 `SPC` 确认关键过程稳定并具备能力
7. 用 `PPAP` 把上述证据提交客户批准
8. 量产后再把客诉、变更、异常反馈回 `FMEA / Control Plan / SPC`

## 3. IATF 16949 到 Core Tools 的实务映射

注意:

- 下表是面向培训和体系实施的“实务映射”。
- 由于标准正文受版权保护，这里不替代官方标准原文，也不把它表述为官方逐条释义。
- 审核实践中，审核员通常会按下面的思路检查条款与工具是否闭环。

| IATF 16949 条款/主题 | 主要关联工具 | 关系说明 | 常见证据 |
| --- | --- | --- | --- |
| `6.1.2.1` 风险分析 | `FMEA`, `APQP` | 体系要求组织进行风险分析，FMEA 是最常见的落地方法之一，APQP 负责把风险分析纳入项目策划 | 风险清单、DFMEA/PFMEA、阶段评审记录 |
| `7.1.5.1.1` 测量系统分析 | `MSA` | 直接对应测量系统有效性，尤其是控制计划中使用的量具、检具和测量方法 | GRR、偏倚、线性、稳定性、属性一致性分析 |
| `8.1.1` 运行策划和控制 | `APQP` | 新项目和变更项目都需要系统策划，APQP 是最典型的实施路径 | 项目计划、里程碑、职责矩阵、APQP状态表 |
| `8.2.3.1.3` 组织制造可行性 | `APQP`, `PFMEA` | 在接单/开发阶段就要确认制造可行性，不能等量产后才发现过程做不出来 | 可行性评审、设备能力评审、试制评审 |
| `8.3.3.2` 制造过程设计输入 | `APQP`, `PFMEA` | 过程设计必须考虑产品要求、特殊特性、经验教训和类似项目风险 | 过程流程图、经验教训清单、特殊特性清单 |
| `8.3.3.3` 特殊特性 | `FMEA`, `Control Plan`, `SPC` | 特殊特性通常来源于客户要求和风险分析，并最终进入控制计划与统计控制 | 特殊特性矩阵、图纸标识、控制计划、能力研究 |
| `8.3.5.1` 设计和开发输出补充 | `APQP`, `PPAP` | 输出应支持后续验证、制造和客户批准，APQP负责组织输出，PPAP负责汇总提交 | 图纸/BOM、DVP&R、样件验证资料 |
| `8.3.5.2` 制造过程设计输出 | `PFMEA`, `Control Plan`, `MSA`, `SPC`, `PPAP` | 这是过程开发和核心工具连接最紧的条款之一，过程输出要能支持生产和控制 | 流程图、PFMEA、控制计划、作业指导书、检具/工装资料 |
| `8.4.2.4` 供应商监视 | `APQP`, `PPAP`, `FMEA` | 对供应商的管理不仅看交付，也看新项目开发和批准能力 | 供应商APQP跟踪、供应商PPAP状态、二方审核 |
| `8.5.1.1` 控制计划 | `Control Plan`, `FMEA`, `MSA`, `SPC` | 控制计划把风险、测量、过程控制和反应计划连接起来，是现场执行核心文件 | 控制计划、反应计划、检验频次、过程参数监控要求 |
| `8.5.1.3` 换型/设定验证 | `Control Plan`, `SPC` | 换型、调机、首件确认属于现场控制的重要部分，通常受控于控制计划 | 首件记录、换型确认记录、参数设定记录 |
| `8.5.1.4` 停机后验证 | `Control Plan`, `SPC` | 停线、维修、长期停机后恢复生产时，需要验证过程是否回到受控状态 | 复机检查记录、首件验证、能力确认 |
| `8.5.6.1.1` 过程控制临时变更 | `PFMEA`, `Control Plan`, `SPC` | 临时放行、替代控制、主控制失效时，必须基于风险重新定义控制 | 临时变更审批、替代控制、PFMEA/控制计划更新记录 |
| `8.6.2` 全尺寸检验和功能试验 | `PPAP`, `MSA` | PPAP 中的尺寸结果、功能和材料验证与该条款高度相关 | 全尺寸报告、功能试验、材料性能试验 |
| `9.1.1.1` 制造过程监视和测量 | `SPC` | 过程是否稳定、异常是否被识别、趋势是否被反应，是 SPC 的典型应用场景 | 控制图、异常反应记录、过程能力研究 |
| `9.1.1.2` 统计工具识别 | `SPC`, `MSA` | 组织要识别在哪些阶段应用统计方法，不是只在量产末端算一次 Cpk | 统计方法清单、控制图选择依据、MSA策划 |
| `9.1.1.3` 统计概念应用 | `SPC` | 要求在全组织相关职能中理解和应用统计思维 | 培训记录、过程能力准则、异常判定准则 |
| `10.2` 不合格和纠正措施 | `FMEA`, `Control Plan`, `SPC` | 纠正措施不能停留在遏制层面，应回写到 FMEA、控制计划和过程监控逻辑 | 8D、问题解决记录、FMEA修订、控制计划修订 |

## 4. 从五个工具角度反看 IATF 16949

| 工具 | 在体系中的定位 | 最直接关联的 IATF 16949 关注点 |
| --- | --- | --- |
| `APQP` | 新产品导入和项目策划主线 | 运行策划、制造可行性、设计/过程开发输出、客户要求转化 |
| `FMEA` | 风险预防主线 | 风险分析、特殊特性、制造过程设计、变更和异常控制 |
| `MSA` | 数据可信度主线 | 监视和测量资源、量具能力、数据有效性 |
| `SPC` | 过程稳定性主线 | 过程监视、统计工具应用、过程能力、异常反应 |
| `PPAP` | 客户批准与量产放行证据包 | 客户要求满足、验证结果、量产准备、全尺寸/功能验证 |

## 5. 这五个工具之间的输入输出关系

### 5.1 主线

- `APQP` 决定项目何时做什么
- `FMEA` 决定优先控制哪些风险
- `Control Plan` 决定现场怎么控
- `MSA` 决定控制数据是否可信
- `SPC` 决定过程是否稳定和有能力
- `PPAP` 决定客户是否认可你已具备稳定量产条件

### 5.2 常见文件传递链

`客户要求/图纸 -> APQP -> DFMEA/PFMEA -> Process Flow -> Control Plan -> MSA/SPC -> PPAP -> 客户批准`

### 5.3 现场最容易断链的地方

- `FMEA` 做了，但没有同步到 `Control Plan`
- `Control Plan` 写了量具，但 `MSA` 没做或做得不适用
- `SPC` 在做图，但异常没有触发反应计划
- `PPAP` 提交通过后，工程变更没有回写 `FMEA / Control Plan / 作业文件`

## 6. 审核时通常怎么问

审核员常见的思路不是“你有没有这个表”，而是“证据是否互相一致”。

典型追问链路:

1. 客户特殊特性从哪里来
2. 是否进入 `PFMEA`
3. 是否进入 `Control Plan`
4. 现场如何测量
5. 量具是否做了 `MSA`
6. 关键特性是否做 `SPC`
7. 初始能力和量产能力是否满足
8. `PPAP` 提交内容是否与现场实际一致

如果这条链断了，体系虽然“有文件”，但审核会认为工具未有效应用。

## 7. 一张培训用的简化判断图

### 7.1 层级关系图

见文件:

- `iatf16949-core-tools-landscape.mmd`
- `iatf16949-core-tools-landscape.svg`

### 7.2 业务流关系图

见文件:

- `iatf16949-core-tools-flow.mmd`
- `iatf16949-core-tools-flow.svg`

## 8. 最后的判断标准

如果你要判断“某份资料到底属于 IATF 16949 还是五大工具”，可以用下面的方法:

| 看到的内容 | 通常归类 |
| --- | --- |
| 讲组织必须建立什么制度、职责、过程、审核和改进 | 偏 `IATF 16949` 体系要求 |
| 讲 APQP 阶段、FMEA 评分、GRR、控制图、PSW、提交等级 | 偏 `Core Tools` 实施方法 |
| 讲某主机厂要求使用哪一版 APQP/PPAP/FMEA，或补充提交内容 | 偏 `CSR` |

## 9. 版本和边界说明

截至 `2026-04-26`，公开可核对信息显示:

- `IATF 16949` 公开入口仍为 `IATF 16949:2016`
- IATF 官方仍通过 `FAQs` 与 `SIs` 发布解释和修订性说明
- AIAG 官方仍将 `APQP / Control Plan / PPAP / FMEA / MSA / SPC` 作为 `Quality Core Tools`
- AIAG 已发布 `APQP 3rd Edition` 与独立的 `Control Plan 1st Edition`
- AIAG 页面显示 `AIAG & VDA SPC Draft` 于 `2026-02` 开放评审，因此具体采用哪一版 SPC 方法，仍应以客户要求和公司适用规则为准

## 10. 参考来源

- AIAG Quality Core Tools: <https://www.aiag.org/expertise-areas/quality/quality-core-tools>
- AIAG Quality overview: <https://www.aiag.org/quality>
- IATF 16949 About: <https://www.iatfglobaloversight.org/iatf-169492016/about/>
- IATF 16949 FAQs: <https://www.iatfglobaloversight.org/iatf-169492016/iatf-169492016-faqs/>
- IATF 16949 SIs: <https://www.iatfglobaloversight.org/iatf-169492016/iatf-169492016-sis/>
- IATF OEM CSR list: <https://www.iatfglobaloversight.org/oem-requirements/customer-specific-requirements/>
- IATF 2025 GM CSR update note: <https://www.iatfglobaloversight.org/news/23-january-2025-gm-csr-update/>
- IATF 2025 Ford CSR/PPAP update note: <https://www.iatfglobaloversight.org/news/12-february-2025-ford-csr-update-iatf-16949-ppap/>

