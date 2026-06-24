# HTML Tools

Small browser-based tools for static deployment.

## Tools

- `tools/markdown-html-renderer/`: Markdown document HTML renderer

## Coolify Static Deployment

Recommended deployment for the whole tools portal:

- Build Pack: `Static`
- Base Directory: `.`
- Build Command: leave empty
- Publish Directory: `.`
- Install Command: leave empty

The root `index.html` links to each tool.

## Notes

- Keep each tool self-contained under `tools/<tool-name>/`.
- Prefer static HTML/CSS/JS unless a tool truly needs a backend.
- CDN dependencies are acceptable for internal tools, but pin versions.
