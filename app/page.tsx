'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ToolItem } from '@/lib/data';

const STORAGE_KEY = 'html-tools-menu-preferences';

function loadPreferences() {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    return {};
  }
}

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    const nextCategory = params.get('category') || '';
    if (nextCategory) setCategory(nextCategory);
    fetch('/api/tools', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setTools(Array.isArray(data.tools) ? data.tools : []))
      .catch(() => setTools([]));
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(tools.map((t) => t.category || '未分类'))).sort();
  }, [tools]);

  const orderedTools = useMemo(() => {
    const preferences = loadPreferences();
    const hidden = preferences.hidden || {};
    const order = Array.isArray(preferences.order) ? preferences.order : [];
    const byId = new Map(tools.map((tool) => [tool.id, tool]));
    const ordered = order.map((id: string) => byId.get(id)).filter(Boolean) as ToolItem[];
    const rest = tools
      .filter((tool) => !order.includes(tool.id))
      .sort((a, b) => (a.order || 9999) - (b.order || 9999));
    return [...ordered, ...rest].filter((tool) => !hidden[tool.id] && !tool.hidden);
  }, [mounted, tools]);

  const visibleTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orderedTools.filter((tool) => {
      const haystack = [tool.title, tool.description, tool.category, tool.badge, ...(tool.tags || [])]
        .join(' ')
        .toLowerCase();
      return (!category || tool.category === category) && (!q || haystack.includes(q));
    });
  }, [orderedTools, query, category]);

  return (
    <>
      <style>{`
        :root {
          color-scheme: light;
          --bg: #f6f7f9;
          --panel: #ffffff;
          --text: #20242c;
          --muted: #667085;
          --line: #d9dee8;
          --blue: #2563eb;
        }

        header {
          padding: 18px 32px 16px;
          background: var(--panel);
          border-bottom: 1px solid var(--line);
        }

        .header-inner {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          gap: 14px;
        }

        h1 {
          margin: 0;
          font-size: 21px;
          line-height: 1.25;
        }

        .subtitle {
          margin: 4px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .controls {
          display: grid;
          grid-template-columns: minmax(220px, 1fr) minmax(180px, 260px);
          gap: 12px;
        }

        input,
        select {
          width: 100%;
          min-height: 40px;
          padding: 9px 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--text);
          font: inherit;
          font-size: 14px;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
        }

        main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 18px 32px 40px;
        }

        .meta-row {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
          color: var(--muted);
          font-size: 13px;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px;
        }

        .tool-card {
          display: block;
          min-height: 132px;
          padding: 16px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--panel);
          color: var(--text);
          text-decoration: none;
        }

        .tool-card:hover {
          border-color: #bfdbfe;
          background: #fbfdff;
          text-decoration: none;
        }

        .tool-card b {
          display: block;
          margin-bottom: 6px;
          font-size: 15px;
        }

        .tool-card p {
          margin: 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .card-footer {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .badge {
          display: inline-flex;
          min-height: 24px;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          background: #eff6ff;
          color: var(--blue);
          font-size: 12px;
        }

        .category-badge {
          background: #f3f4f6;
          color: #4b5563;
        }

        .empty {
          padding: 24px;
          border: 1px dashed var(--line);
          border-radius: 8px;
          background: var(--panel);
          color: var(--muted);
          text-align: center;
          font-size: 14px;
        }

        @media (max-width: 700px) {
          header,
          main {
            padding-left: 18px;
            padding-right: 18px;
          }

          .meta-row {
            display: grid;
          }

          .controls {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <header>
        <div className="header-inner">
          <div>
            <h1>工具中心</h1>
            <p className="subtitle">搜索、筛选并打开需要的工具。</p>
          </div>
          <div className="controls">
            <input
              id="searchInput"
              type="search"
              placeholder="搜索工具名称、分类或描述"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              id="categorySelect"
              aria-label="工具分类"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">全部分类</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main>
        <div className="meta-row">
          <span>{visibleTools.length} 个工具</span>
          <span>{category || query ? '已应用筛选' : '全部可用工具'}</span>
        </div>
        <section className="tool-grid">
          {visibleTools.length === 0 ? (
            <div className="empty">没有匹配的工具。</div>
          ) : (
            visibleTools.map((tool) => (
              <a className="tool-card" href={tool.href} key={tool.id}>
                <b>{tool.title}</b>
                <p>{tool.description}</p>
                <span className="card-footer">
                  <span className="badge">{tool.badge || 'Static HTML'}</span>
                  <span className="badge category-badge">{tool.category || '未分类'}</span>
                </span>
              </a>
            ))
          )}
        </section>
      </main>
    </>
  );
}
