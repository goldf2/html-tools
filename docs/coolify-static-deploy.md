# Coolify Static Deploy

Use these settings when creating the Coolify resource:

| Field | Value |
| --- | --- |
| Build Pack | `Static` |
| Base Directory | `.` |
| Build Command | empty |
| Publish Directory | `.` |
| Install Command | empty |

After connecting the Git repository, push changes to the selected branch and let Coolify redeploy.

For deploying only the Markdown renderer, set Base Directory to:

```text
tools/markdown-html-renderer
```

and keep Publish Directory as:

```text
.
```
