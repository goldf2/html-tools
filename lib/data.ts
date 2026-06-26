import fs from 'node:fs/promises';
import path from 'node:path';

export interface ToolItem {
  id: string;
  title: string;
  href: string;
  description: string;
  category: string;
  badge?: string;
  order?: number;
  tags?: string[];
  hidden?: boolean;
  version?: string;
  kind?: 'static-html' | 'questionnaire' | 'renderer';
  platforms?: {
    web?: boolean;
    miniProgram?: boolean;
  };
  miniProgramPath?: string;
  dataSource?: 'catalog' | 'html';
}

export interface MenuConfig {
  overrides?: Record<string, Partial<ToolItem>>;
  order?: string[];
  hidden?: Record<string, boolean>;
}

interface ToolCatalog {
  schemaVersion?: number;
  tools?: Partial<ToolItem>[];
}

export const STORAGE_KEY = 'html-tools-menu-preferences';
export const TOOL_CATALOG_SCHEMA_VERSION = 1;

const TOOLS_DIR = path.join(process.cwd(), 'public', 'tools');
const CONFIG_DIR = path.join(process.cwd(), 'data');
const CONFIG_PATH = path.join(CONFIG_DIR, 'menu-config.json');
const CATALOG_PATH = path.join(CONFIG_DIR, 'tools.json');

function makeId(fileName: string) {
  return fileName
    .replace(/\.html$/i, '')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-|-$/g, '') || `tool-${Date.now()}`;
}

function parseTitle(html: string, fileName: string) {
  const match = html.match(/<title>(.*?)<\/title>/i);
  return match?.[1]?.trim() || fileName.replace(/\.html$/i, '');
}

async function readConfig(): Promise<MenuConfig> {
  try {
    const raw = await fs.readFile(CONFIG_PATH, 'utf8');
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
}

function normalizeCatalogTool(tool: Partial<ToolItem>, index: number): ToolItem | null {
  if (!tool.title && !tool.href) return null;
  const href = tool.href || '';
  const title = tool.title || parseTitle('', href || `tool-${index + 1}`);
  const id = tool.id || makeId(href || title);

  return {
    id,
    title,
    href,
    description: tool.description || title,
    category: tool.category || '未分类',
    badge: tool.badge || 'Static HTML',
    order: tool.order || (index + 1) * 10,
    tags: Array.isArray(tool.tags) ? tool.tags : [],
    hidden: Boolean(tool.hidden),
    version: tool.version || '1.0.0',
    kind: tool.kind || 'static-html',
    platforms: {
      web: tool.platforms?.web ?? true,
      miniProgram: tool.platforms?.miniProgram ?? false,
    },
    miniProgramPath: tool.miniProgramPath,
    dataSource: 'catalog',
  };
}

async function readToolCatalog(): Promise<ToolItem[]> {
  try {
    const raw = await fs.readFile(CATALOG_PATH, 'utf8');
    const parsed = JSON.parse(raw) as ToolCatalog | Partial<ToolItem>[];
    const tools = Array.isArray(parsed) ? parsed : parsed.tools;
    if (!Array.isArray(tools)) return [];
    return tools
      .map((tool, index) => normalizeCatalogTool(tool, index))
      .filter(Boolean) as ToolItem[];
  } catch {
    return [];
  }
}

async function writeConfig(config: MenuConfig) {
  await fs.mkdir(CONFIG_DIR, { recursive: true });
  await fs.writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

async function scanToolPages(config: MenuConfig): Promise<ToolItem[]> {
  const catalogTools = await readToolCatalog();
  const catalogHrefs = new Set(catalogTools.map((tool) => tool.href).filter(Boolean));
  const hidden = config.hidden || {};
  const overrides = config.overrides || {};

  let files: string[] = [];
  try {
    files = (await fs.readdir(TOOLS_DIR))
      .filter((file) => file.endsWith('.html'))
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  } catch {
    files = [];
  }

  const discoveredTools = await Promise.all(files.map(async (file, index) => {
    const href = `tools/${file}`;
    if (catalogHrefs.has(href)) return null;
    const html = await fs.readFile(path.join(TOOLS_DIR, file), 'utf8');

    return {
      id: makeId(file),
      title: parseTitle(html, file),
      href,
      description: parseTitle(html, file),
      category: '未分类',
      badge: 'Static HTML',
      order: (catalogTools.length + index + 1) * 10,
      tags: [],
      kind: 'static-html',
      platforms: {
        web: true,
        miniProgram: false,
      },
      dataSource: 'html',
    } satisfies ToolItem;
  }));

  const tools = [...catalogTools, ...discoveredTools.filter(Boolean) as ToolItem[]].map((tool) => {
    const override = overrides[tool.href] || overrides[tool.id] || {};
    const id = override.id || tool.id;

    return {
      ...tool,
      ...override,
      id,
      hidden: Boolean(hidden[id] || override.hidden || tool.hidden),
    } satisfies ToolItem;
  });

  const order = Array.isArray(config.order) ? config.order : [];
  const orderIndex = new Map(order.map((id, index) => [id, index]));

  return tools.sort((a, b) => {
    const ai = orderIndex.has(a.id) ? orderIndex.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const bi = orderIndex.has(b.id) ? orderIndex.get(b.id)! : Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return (a.order || 9999) - (b.order || 9999);
  });
}

export async function getMenuTools() {
  const config = await readConfig();
  return scanToolPages(config);
}

export async function saveMenuConfig(next: Pick<MenuConfig, 'order' | 'hidden'>) {
  const current = await readConfig();
  const scanned = await scanToolPages(current);
  const knownIds = new Set(scanned.map((tool) => tool.id));
  const cleanOrder = [
    ...(next.order || []).filter((id) => knownIds.has(id)),
    ...scanned.map((tool) => tool.id).filter((id) => !(next.order || []).includes(id)),
  ];
  const cleanHidden = Object.fromEntries(
    Object.entries(next.hidden || {}).filter(([id]) => knownIds.has(id))
  );

  const config: MenuConfig = {
    ...current,
    order: cleanOrder,
    hidden: cleanHidden,
  };

  await writeConfig(config);
  return scanToolPages(config);
}
