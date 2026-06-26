# HTML Tools

基于 Next.js 构建的工具导航与问卷应用。当前项目已经从纯静态站升级为 Next.js 服务端模式，用于支持共享工具目录、自动发现工具页面、菜单后台管理、固定保存配置，以及后续小程序共用数据和 AI 分析扩展。

## 技术栈

- **Next.js 15** App Router
- **React 19**
- **TypeScript**
- **Node.js 服务端 API**
- **JSON 共享数据目录**，供网站和小程序读取同一套工具配置

## 当前工具

| 工具 | 路径 | 说明 |
| --- | --- | --- |
| Markdown HTML Renderer | `/tools/markdown-html-renderer.html` | Markdown 预览、Mermaid 渲染、独立 HTML 导出 |
| 成人性生活满意度统计表 | `/tools/成人性生活满意度统计表.html` | 面向成年人，用五级量表统计亲密关系满意度、沟通舒适度和改善方向 |
| 高一兴趣爱好采集表 | `/tools/高一女生兴趣爱好采集表.html` | 适合高中女生填写的兴趣、学科、技能与未来探索采集表，可预览并导出 CSV |
| 暑期旅游兴趣点采集表 | `/tools/暑期旅游兴趣点采集表.html` | 用多选、李克特五级量表和重要性排序采集旅游偏好，并生成初步旅游地点画像 |

## 版本记录

当前页面版本：

```text
v1.0.1
```

- `v1.0.1`：简化为一级顶部菜单；为所有工具页注入顶部版本号和底部版本页脚；为工具页导航脚本添加版本参数以刷新缓存。
- `v1.0.0`：Next.js 工具门户、共享工具目录、菜单管理、一级顶部导航、页面版本标识、Coolify Node/Nixpacks 部署配置。

## 设计文档

- [多人旅游偏好评分与推荐开发方案](docs/group-travel-recommendation-plan.md)
- [工具类页面 UI 模板](docs/tool-page-ui-template.md)
- [Coolify 部署说明](docs/coolify-static-deploy.md)

## 项目结构

```text
html-tools/
├── app/
│   ├── api/
│   │   ├── menu/route.ts       # 保存菜单排序和隐藏配置
│   │   └── tools/route.ts      # 扫描 public/tools/*.html
│   ├── menu-admin/page.tsx     # 菜单管理页
│   ├── layout.tsx
│   ├── page.tsx                # 首页导航
│   └── globals.css
├── data/
│   ├── tools.json              # 网站/小程序共用的工具目录
│   └── menu-config.json        # 固定保存的菜单排序和隐藏配置
├── lib/
│   └── data.ts                 # 扫描工具页、读写配置
├── public/
│   └── tools/                  # 工具 HTML 页面
├── docs/
├── next.config.ts
├── package.json
└── README.md
```

## 开发

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

菜单管理：

```text
http://localhost:3000/menu-admin
```

## 构建与运行

```bash
npm run build
npm run start
```

生产服务默认端口：

```text
3000
```

## 添加新工具

优先在共享工具目录添加元数据：

```text
data/tools.json
```

如果工具是网页专用页面，再将对应单页 HTML 放入：

```text
public/tools/
```

例如：

```text
public/tools/新问卷.html
```

刷新首页即可。`/api/tools` 会优先读取 `data/tools.json`，并自动补充扫描到但尚未登记的 `public/tools/*.html`。

`/api/tools` 返回结构适合小程序直接消费：

```json
{
  "schemaVersion": 1,
  "tools": []
}
```

工具条目中的 `platforms.miniProgram` 和 `miniProgramPath` 用来标记后续小程序是否有原生页面。

## 删除工具

删除对应文件：

```text
public/tools/某个页面.html
```

刷新首页后菜单会自动更新。

## 菜单管理

访问 `/menu-admin` 可以：

- 调整菜单顺序
- 隐藏/显示工具
- 恢复默认
- 保存配置到 `data/menu-config.json`

保存路径固定：

```text
data/menu-config.json
```

扫描路径固定：

```text
public/tools/*.html
```

## Coolify 部署

本项目现在需要 Node/Next 服务，不再是纯静态部署。

| Coolify 配置项 | 值 |
| --- | --- |
| Build Pack | `Nixpacks` / `Node` |
| Build Command | `npm run build` |
| Start Command | `npm run start` |
| Port | `3000` |

如果需要在线修改菜单并在重启/重部署后保留，请为以下目录配置持久化 Volume：

```text
data/
```

## 维护规则

- 每个工具放在 `public/tools/<tool-name>.html`
- 工具元数据保存在 `data/tools.json`
- 菜单排序和隐藏配置保存在 `data/menu-config.json`
- 需要多人数据、AI 分析、小程序共用数据或在线保存时，优先通过 Next.js API 扩展
- AI API Key 不应放在前端，应放在服务端环境变量中
