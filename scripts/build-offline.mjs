import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = async name => JSON.parse(await fs.readFile(path.join(root, name), 'utf8'));
const [catalog, menu, pkg] = await Promise.all(['data/tools.json', 'data/menu-config.json', 'package.json'].map(read));
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tools = [];
for (const tool of catalog.tools) {
  if (tool.hidden || menu.hidden?.[tool.id] || tool.platforms?.web === false) continue;
  try { await fs.access(path.join(root, 'public', tool.href)); } catch { continue; }
  tools.push(tool);
}
const order = new Map((menu.order || []).map((id, index) => [id, index]));
tools.sort((a, b) => (order.get(a.id) ?? 9999) - (order.get(b.id) ?? 9999) || (a.order || 9999) - (b.order || 9999));
const cards = tools.map(tool => `<a class="card" href="${escape(tool.href)}"><small>${escape(tool.category)}</small><h2>${escape(tool.title)}</h2><p>${escape(tool.description)}</p></a>`).join('\n');
await fs.writeFile(path.join(root, 'public/offline.html'), `<!doctype html>
<html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HTML Tools · 本地工具箱</title><style>
*{box-sizing:border-box}body{margin:0;background:#f6f7f9;color:#20242c;font:16px/1.6 -apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{max-width:1100px;margin:auto;padding:40px 24px}h1{margin:0;font-size:28px}.intro{color:#667085;margin:8px 0 28px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px}.card{display:block;padding:24px;border:1px solid #d9dee8;border-radius:12px;background:white;color:inherit;text-decoration:none}.card:hover{border-color:#2563eb}.card:focus-visible{outline:3px solid #2563eb;outline-offset:3px}small{color:#2563eb}h2{font-size:18px;margin:10px 0}p{font-size:14px;color:#667085;margin:0}footer{margin-top:32px;font-size:13px;color:#667085}</style>
<main><h1>本地工具箱</h1><p class="intro">HTML Tools · 工具与资料统一入口</p><section class="grid">${cards}</section><footer>HTML Tools v${escape(pkg.version)} · 直接打开工具；需要联网的内容依各工具自身要求。</footer></main></html>\n`);
console.log(`Built offline entry: ${tools.length} tools`);
