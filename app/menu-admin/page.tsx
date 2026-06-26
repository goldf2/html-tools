'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { ToolItem } from '@/lib/data';

type MenuState = {
  order: string[];
  hidden: Record<string, boolean>;
};

function getDefaultOrder(tools: ToolItem[]) {
  return [...tools]
    .sort((a, b) => (a.order || 9999) - (b.order || 9999))
    .map((tool) => tool.id);
}

function getState(tools: ToolItem[]): MenuState {
  const order = getDefaultOrder(tools);
  const knownIds = new Set(tools.map((t) => t.id));
  const cleanOrder = [
    ...order.filter((id: string) => knownIds.has(id)),
    ...getDefaultOrder(tools).filter((id: string) => !order.includes(id)),
  ];
  return {
    order: cleanOrder,
    hidden: Object.fromEntries(tools.filter((tool) => tool.hidden).map((tool) => [tool.id, true])),
  };
}

function escapeHtml(text: string) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default function MenuAdminPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [state, setState] = useState<MenuState>({ order: [], hidden: {} });
  const [statusText, setStatusText] = useState('已加载菜单配置。');
  const [configOutput, setConfigOutput] = useState('');
  const tbodyRef = useRef<HTMLTableSectionElement>(null);

  const loadTools = useCallback(async () => {
    const response = await fetch('/api/tools', { cache: 'no-store' });
    const data = await response.json();
    const nextTools = Array.isArray(data.tools) ? data.tools : [];
    setTools(nextTools);
    setState(getState(nextTools));
    setStatusText(`已从固定目录刷新 ${nextTools.length} 个页面。`);
  }, []);

  useEffect(() => {
    loadTools().catch(() => setStatusText('读取工具目录失败。'));
  }, [loadTools]);

  const saveServerState = useCallback(async (next: MenuState) => {
    const response = await fetch('/api/menu', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    });
    const data = await response.json();
    if (Array.isArray(data.tools)) setTools(data.tools);
    setStatusText('已保存到 data/menu-config.json。');
  }, []);

  const move = useCallback((id: string, direction: number) => {
    setState((prev) => {
      const index = prev.order.indexOf(id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= prev.order.length) return prev;
      const newOrder = [...prev.order];
      [newOrder[index], newOrder[nextIndex]] = [newOrder[nextIndex], newOrder[index]];
      const next = { ...prev, order: newOrder };
      void saveServerState(next);
      return next;
    });
  }, [saveServerState]);

  const setVisible = useCallback((id: string, visible: boolean) => {
    setState((prev) => {
      const hidden = { ...prev.hidden };
      if (visible) delete hidden[id];
      else hidden[id] = true;
      const next = { ...prev, hidden };
      void saveServerState(next);
      return next;
    });
  }, [saveServerState]);

  const saveDomOrder = useCallback(() => {
    if (!tbodyRef.current) return;
    const rows = tbodyRef.current.querySelectorAll('tr[data-id]');
    const newOrder = Array.from(rows)
      .map((row) => (row as HTMLElement).dataset.id)
      .filter(Boolean) as string[];
    setState((prev) => {
      const next = { ...prev, order: newOrder };
      void saveServerState(next);
      return next;
    });
  }, [saveServerState]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLTableSectionElement>) => {
    e.preventDefault();
    const tbody = e.currentTarget;
    const draggingRow = tbody.querySelector<HTMLTableRowElement>('tr.dragging');
    if (!draggingRow) return;
    const rows = Array.from(tbody.querySelectorAll<HTMLTableRowElement>('tr[data-id]:not(.dragging)'));
    const afterRow = rows.find((row) => {
      const box = row.getBoundingClientRect();
      return e.clientY < box.top + box.height / 2;
    });
    if (afterRow) tbody.insertBefore(draggingRow, afterRow);
    else tbody.appendChild(draggingRow);
  }, []);

  const reset = () => {
    const next = { order: getDefaultOrder(tools), hidden: {} };
    setState(next);
    void saveServerState(next);
    setStatusText('已恢复默认并保存。');
    setConfigOutput('');
  };

  const copyConfig = async () => {
    const text = JSON.stringify(state, null, 2);
    setConfigOutput(text);
    try {
      await navigator.clipboard.writeText(text);
      setStatusText('配置已复制到剪贴板。');
    } catch {
      setStatusText('配置已显示，可手动复制。');
    }
  };

  const byId = new Map(tools.map((t) => [t.id, t]));

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
          --soft: #fbfcfe;
        }

        header {
          padding: 28px 32px 18px;
          background: var(--panel);
          border-bottom: 1px solid var(--line);
        }

        .header-inner, main {
          max-width: 1080px;
          margin: 0 auto;
        }

        .title-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: start;
        }

        h1 {
          margin: 0 0 8px;
          font-size: 24px;
          line-height: 1.25;
        }

        .subtitle {
          margin: 0;
          color: var(--muted);
          font-size: 14px;
          line-height: 1.6;
        }

        main {
          padding: 24px 32px 42px;
        }

        .toolbar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 14px;
        }

        .btn, .back-link {
          display: inline-flex;
          min-height: 36px;
          align-items: center;
          justify-content: center;
          padding: 7px 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--text);
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          cursor: pointer;
        }

        .btn:hover, .back-link:hover {
          border-color: #bfdbfe;
          background: #eff6ff;
          color: var(--blue);
        }

        .table-wrap {
          overflow-x: auto;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: var(--panel);
        }

        table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
          font-size: 14px;
        }

        th, td {
          padding: 12px;
          border-bottom: 1px solid var(--line);
          text-align: left;
          vertical-align: middle;
        }

        th {
          background: #f8fafc;
          color: #344054;
          font-size: 13px;
          font-weight: 800;
        }

        tr:last-child td {
          border-bottom: 0;
        }

        tr.dragging {
          opacity: 0.55;
          background: #eff6ff;
        }

        .order-cell {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 800;
        }

        .drag-handle {
          display: inline-grid;
          width: 26px;
          height: 26px;
          place-items: center;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--muted);
          cursor: grab;
          font-size: 14px;
          letter-spacing: 1px;
        }

        tr:active .drag-handle {
          cursor: grabbing;
        }

        .tool-title {
          display: grid;
          gap: 4px;
        }

        .tool-title b {
          font-size: 14px;
        }

        .tool-title span {
          color: var(--muted);
          font-size: 12px;
        }

        .move-group {
          display: flex;
          gap: 6px;
        }

        .toggle {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #344054;
          font-size: 13px;
          font-weight: 700;
          user-select: none;
        }

        .toggle input {
          width: 17px;
          height: 17px;
          accent-color: var(--blue);
        }

        .status {
          margin: 12px 0 0;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .note {
          margin: 0 0 14px;
          padding: 12px 14px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--muted);
          font-size: 13px;
          line-height: 1.7;
        }

        code {
          padding: 2px 6px;
          border-radius: 6px;
          background: #f3f4f6;
          color: #344054;
          font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
          font-size: 12px;
        }

        textarea {
          width: 100%;
          min-height: 120px;
          margin-top: 14px;
          padding: 12px;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--text);
          font: inherit;
          font-size: 13px;
          line-height: 1.5;
          resize: vertical;
        }

        .primary-action {
          border-color: var(--blue);
          background: var(--blue);
          color: #fff;
        }

        .primary-action:hover {
          background: #1d4ed8;
          color: #fff;
        }

        @media (max-width: 700px) {
          header, main {
            padding-left: 18px;
            padding-right: 18px;
          }
          .title-row, .toolbar {
            display: grid;
          }
        }
      `}</style>

      <header>
        <div className="header-inner">
          <div className="title-row">
            <div>
              <h1>菜单管理</h1>
              <p className="subtitle">拖动工具行调整导航顺序，或隐藏不需要展示的菜单项。设置固定保存到服务器配置文件。</p>
            </div>
            <a className="back-link" href="../">返回首页</a>
          </div>
        </div>
      </header>

      <main>
        <p className="note">页面清单由服务端扫描 <code>public/tools/*.html</code> 生成；排序和隐藏固定保存到 <code>data/menu-config.json</code>。</p>

        <div className="toolbar">
          <div>
            <button className="btn primary-action" type="button" onClick={reset}>恢复默认</button>
            <button className="btn" type="button" onClick={() => loadTools().catch(() => setStatusText('刷新目录失败。'))}>刷新目录</button>
            <button className="btn" type="button" onClick={copyConfig}>复制当前配置</button>
          </div>
          <span className="status">{statusText}</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>顺序</th>
                <th>工具</th>
                <th>分类</th>
                <th>显示</th>
                <th>移动</th>
              </tr>
            </thead>
            <tbody
              ref={tbodyRef}
              onDragOver={handleDragOver}
            >
              {state.order.map((id, index) => {
                const tool = byId.get(id);
                if (!tool) return null;
                const visible = !state.hidden[id];
                return (
                  <tr
                    key={id}
                    draggable
                    data-id={id}
                    onDragStart={(e) => {
                      e.currentTarget.classList.add('dragging');
                      e.dataTransfer.effectAllowed = 'move';
                    }}
                    onDragEnd={(e) => {
                      e.currentTarget.classList.remove('dragging');
                      saveDomOrder();
                    }}
                  >
                    <td>
                      <span className="order-cell">
                        <span className="drag-handle">::</span>
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <span className="tool-title">
                        <b>{tool.title}</b>
                        <span>{tool.href}</span>
                      </span>
                    </td>
                    <td>{tool.category || '未分类'}</td>
                    <td>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={visible}
                          onChange={(e) => setVisible(id, e.target.checked)}
                        />
                        显示
                      </label>
                    </td>
                    <td>
                      <span className="move-group">
                        <button className="btn" type="button" onClick={() => move(id, -1)}>上移</button>
                        <button className="btn" type="button" onClick={() => move(id, 1)}>下移</button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <textarea value={configOutput} readOnly placeholder="复制配置后会显示在这里。" />
      </main>
    </>
  );
}
