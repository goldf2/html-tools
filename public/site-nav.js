(function () {
  if (document.querySelector('.site-nav')) return;

  function absoluteHref(href) {
    return href && href.charAt(0) === '/' ? href : '/' + href;
  }

  function categoryHref(category) {
    return '/?category=' + encodeURIComponent(category);
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function visibleTools(tools) {
    return (Array.isArray(tools) ? tools : []).filter(function (tool) {
      return !tool.hidden && (!tool.platforms || tool.platforms.web !== false);
    });
  }

  function groupTools(tools) {
    var order = [];
    var groups = visibleTools(tools).reduce(function (acc, tool) {
      var category = tool.category || '未分类';
      if (!acc[category]) order.push(category);
      acc[category] = acc[category] || [];
      acc[category].push(tool);
      return acc;
    }, {});

    return { groups: groups, order: order };
  }

  function renderCategories(tools) {
    var grouped = groupTools(tools);
    var groups = grouped.groups;
    var categories = grouped.order;
    if (!categories.length) return '';

    return categories.map(function (category) {
      var links = groups[category]
        .sort(function (a, b) { return String(a.title || '').localeCompare(String(b.title || ''), 'zh-CN'); })
        .map(function (tool) {
          var href = absoluteHref(tool.href || '');
          return [
            '<a class="site-nav__submenu-link" href="' + escapeHtml(href) + '">',
            '<span>' + escapeHtml(tool.title || tool.id) + '</span>',
            '</a>'
          ].join('');
        })
        .join('');

      return [
        '<div class="site-nav__category">',
        '<a class="site-nav__link site-nav__category-trigger" href="' + escapeHtml(categoryHref(category)) + '">' + escapeHtml(category) + '</a>',
        '<div class="site-nav__submenu">' + links + '</div>',
        '</div>'
      ].join('');
    }).join('');
  }

  var style = document.createElement('style');
  style.textContent = [
    '.site-nav{position:sticky;top:0;z-index:50;border-bottom:1px solid #d9dee8;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);}',
    '.site-nav__inner{width:min(1180px,calc(100% - 36px));min-height:52px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px;}',
    '.site-nav__brand{color:#20242c;font-size:15px;font-weight:800;text-decoration:none;white-space:nowrap;}',
    '.site-nav__menus,.site-nav__tools{display:flex;align-items:center;gap:6px;}',
    '.site-nav__menus{flex:1;min-width:0;overflow:visible;}',
    '.site-nav__link{display:inline-flex;min-height:32px;align-items:center;padding:6px 9px;border:0;border-radius:8px;background:transparent;color:#475467;font:inherit;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;cursor:pointer;}',
    '.site-nav__link:hover,.site-nav__link[aria-current=page]{background:#eff6ff;color:#2563eb;}',
    '.site-nav__category{position:relative;flex:0 0 auto;}',
    '.site-nav__category-trigger::after{content:"";width:0;height:0;margin-left:6px;border-left:4px solid transparent;border-right:4px solid transparent;border-top:5px solid currentColor;}',
    '.site-nav__submenu{position:absolute;top:calc(100% + 6px);left:0;width:min(240px,calc(100vw - 36px));display:none;padding:6px;border:1px solid #d9dee8;border-radius:8px;background:#fff;box-shadow:0 18px 45px rgba(15,23,42,.14);}',
    '.site-nav__category:hover .site-nav__submenu,.site-nav__category:focus-within .site-nav__submenu{display:grid;gap:2px;}',
    '.site-nav__submenu-link{display:block;padding:9px 10px;border-radius:8px;color:#20242c;font-size:13px;font-weight:700;line-height:1.35;text-decoration:none;}',
    '.site-nav__submenu-link:hover,.site-nav__submenu-link[aria-current=page]{background:#eff6ff;color:#2563eb;}',
    '.site-nav__admin-link{border:1px solid #d9dee8;background:#fff;}',
    '@media(max-width:700px){.site-nav__inner{width:min(100% - 24px,1120px);min-height:50px;gap:8px;}.site-nav__brand{font-size:14px;}.site-nav__link{font-size:12px;padding:7px 8px;}.site-nav__tools{display:none;}.site-nav__menus{overflow-x:auto;scrollbar-width:none;}.site-nav__menus::-webkit-scrollbar{display:none;}.site-nav__submenu{display:none!important;}}'
  ].join('');
  document.head.appendChild(style);

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', '主导航');
  function setNavContent(categoryHtml) {
    nav.innerHTML = [
    '<div class="site-nav__inner">',
    '<a class="site-nav__brand" href="/">HTML Tools</a>',
    '<div class="site-nav__menus">',
    '<a class="site-nav__link" href="/">全部工具</a>',
    categoryHtml || '',
    '</div>',
    '<div class="site-nav__tools">',
    '<a class="site-nav__link site-nav__admin-link" href="/menu-admin">管理</a>',
    '</div>',
    '</div>'
    ].join('');

    markActiveLinks();
  }

  function markActiveLinks() {
    var path = window.location.pathname;
    nav.querySelectorAll('a[href]').forEach(function (link) {
      var href = link.getAttribute('href');
      if ((href === '/' && path === '/') || (href !== '/' && path.indexOf(href) === 0)) {
        link.setAttribute('aria-current', 'page');
      }
    });

    nav.querySelectorAll('.site-nav__category').forEach(function (category) {
      if (category.querySelector('.site-nav__submenu-link[aria-current=page]')) {
        category.querySelector('.site-nav__category-trigger').setAttribute('aria-current', 'page');
      }
    });
  }

  setNavContent('');

  document.body.insertBefore(nav, document.body.firstChild);

  fetch('/api/tools', { cache: 'no-store' })
    .then(function (response) { return response.json(); })
    .then(function (data) { setNavContent(renderCategories(data.tools)); })
    .catch(function () { setNavContent(''); });
}());
