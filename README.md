# HTML Tools

这个仓库用于集中存放可以静态部署的 HTML 小工具，适合通过 Coolify 直接发布为静态站点。

## 当前工具

| 工具 | 路径 | 说明 |
| --- | --- | --- |
| Markdown HTML Renderer | `tools/markdown-html-renderer/` | Markdown 预览、Mermaid 渲染、独立 HTML 导出 |

根目录的 `index.html` 是工具首页，会跳转到各个具体工具。

## 目录结构

```text
html-tools/
├── index.html
├── README.md
├── docs/
│   └── coolify-static-deploy.md
└── tools/
    └── markdown-html-renderer/
        └── index.html
```

## Coolify 静态部署

推荐把整个仓库作为一个静态工具站部署：

| Coolify 配置项 | 值 |
| --- | --- |
| Build Pack | `Static` |
| Base Directory | `.` |
| Build Command | 留空 |
| Publish Directory | `.` |
| Install Command | 留空 |

如果只部署 Markdown 工具本身：

| Coolify 配置项 | 值 |
| --- | --- |
| Build Pack | `Static` |
| Base Directory | `tools/markdown-html-renderer` |
| Build Command | 留空 |
| Publish Directory | `.` |
| Install Command | 留空 |

## 迁移到外部 Git 仓库

当前本地仓库路径：

```text
/Volumes/project/html-tools
```

迁移到 GitHub、Gitee 或其它 Git 平台后，执行：

```bash
git remote add origin <your-repo-url>
git push -u origin main
```

然后在 Coolify 中连接这个外部仓库，按上面的静态部署配置发布。

## 维护规则

- 每个工具放在 `tools/<tool-name>/` 下，并提供自己的 `index.html`。
- 根目录 `index.html` 只作为工具导航页。
- 优先使用纯 HTML/CSS/JS；确实需要后端时，再单独建立服务型工具。
- CDN 依赖需要固定版本，避免线上行为随上游变化。
- 不要把 Obsidian 文档库、私有笔记或无关项目文件放进这个仓库。
