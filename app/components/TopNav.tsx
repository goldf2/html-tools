'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavTool = {
  id: string;
  title: string;
  href: string;
  category: string;
  description?: string;
  hidden?: boolean;
  platforms?: {
    web?: boolean;
  };
};

function toAbsoluteHref(href: string) {
  return href.startsWith('/') ? href : `/${href}`;
}

function categoryHref(category: string) {
  return `/?category=${encodeURIComponent(category)}`;
}

export default function TopNav() {
  const pathname = usePathname() || '/';
  const [tools, setTools] = useState<NavTool[]>([]);
  const [openCategory, setOpenCategory] = useState('');

  useEffect(() => {
    fetch('/api/tools', { cache: 'no-store' })
      .then((response) => response.json())
      .then((data) => setTools(Array.isArray(data.tools) ? data.tools : []))
      .catch(() => setTools([]));
  }, []);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.site-nav__category')) setOpenCategory('');
    }

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const categories = useMemo(() => {
    const visibleTools = tools.filter((tool) => !tool.hidden && tool.platforms?.web !== false);
    const byCategory = new Map<string, NavTool[]>();
    visibleTools.forEach((tool) => {
      const category = tool.category || '未分类';
      byCategory.set(category, [...(byCategory.get(category) || []), tool]);
    });
    return Array.from(byCategory.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN')),
    }));
  }, [tools]);

  return (
    <nav className="site-nav" aria-label="主导航">
      <div className="site-nav__inner">
        <a className="site-nav__brand" href="/">
          HTML Tools
        </a>
        <div className="site-nav__menus">
          <a aria-current={pathname === '/' ? 'page' : undefined} className="site-nav__link" href="/">
            全部工具
          </a>
          {categories.map(({ category, items }) => {
            const categoryActive = items.some((tool) => pathname === toAbsoluteHref(tool.href));

            return (
              <div className={`site-nav__category${openCategory === category ? ' is-open' : ''}`} key={category}>
                <button
                  aria-current={categoryActive ? 'page' : undefined}
                  aria-expanded={openCategory === category}
                  className="site-nav__link site-nav__category-trigger"
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenCategory((current) => current === category ? '' : category);
                  }}
                >
                  {category}
                </button>
                <div className="site-nav__submenu">
                  <a className="site-nav__submenu-link site-nav__submenu-all" href={categoryHref(category)}>
                    查看全部
                  </a>
                  {items.map((tool) => {
                    const href = toAbsoluteHref(tool.href);

                    return (
                      <a
                        aria-current={pathname === href ? 'page' : undefined}
                        className="site-nav__submenu-link"
                        href={href}
                        key={tool.id}
                      >
                        <span>{tool.title}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="site-nav__tools">
          <a
            aria-current={pathname.startsWith('/menu-admin') ? 'page' : undefined}
            className="site-nav__link site-nav__admin-link"
            href="/menu-admin"
          >
            管理
          </a>
        </div>
      </div>
    </nav>
  );
}
