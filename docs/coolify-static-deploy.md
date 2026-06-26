# Coolify 部署说明

本项目当前为 Next.js 服务端应用，不再是纯静态导出站点。

## 推荐部署配置

| 配置项 | 值 |
| --- | --- |
| Build Pack | `Nixpacks` / `Node` |
| Base Directory | `.` |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Start Command | `npm run start` |
| Port | `3000` |

## 为什么不再使用 Static

项目现在需要服务端能力：

- 自动扫描 `public/tools/*.html`
- 固定保存菜单配置到 `data/menu-config.json`
- 为后续多人问卷、推荐算法和 AI 分析提供 API

这些能力不能由纯静态托管可靠完成。

## 持久化数据

菜单管理页会写入：

```text
data/menu-config.json
```

如果希望在线修改菜单后，在容器重启或重新部署后仍然保留，请在 Coolify 中为以下目录配置持久化 Volume：

```text
data/
```

## 本地验证

```bash
npm install
npm run build
npm run start
```

访问：

```text
http://localhost:3000
```

API 验证：

```bash
curl http://localhost:3000/api/tools
```

## 旧静态模式说明

旧版本曾使用 Next.js `output: 'export'` 生成静态文件。当前版本已移除静态导出配置，部署时应使用 Node 服务模式。
