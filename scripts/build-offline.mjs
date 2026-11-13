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
const template = await fs.readFile(path.join(root, 'scripts/workspace-template.html'), 'utf8');
const output = template
  .replace('__PORTAL_VERSION__', escape(pkg.version))
  .replace('__TOOLS__', JSON.stringify(tools).replace(/</g, String.fromCharCode(92) + 'u003c'));
await fs.writeFile(path.join(root, 'public/toolbox.html'), output);
await fs.writeFile(path.join(root, 'public/offline.html'), output);
console.log(`Built unified toolbox: ${tools.length} tools`);
