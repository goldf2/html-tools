(function () {
  if (document.querySelector('.site-nav')) return;

  var APP_VERSION = '1.0.3';

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
      return '<a class="site-nav__link" href="' + escapeHtml(categoryHref(category)) + '">' + escapeHtml(category) + '</a>';
    }).join('');
  }

  function currentToolFrom(tools) {
    var currentPath = decodeURI(window.location.pathname);
    return visibleTools(tools).find(function (tool) {
      return decodeURI(absoluteHref(tool.href || '')) === currentPath;
    });
  }

  var style = document.createElement('style');
  style.textContent = [
    '.site-nav{position:sticky;top:0;z-index:50;border-bottom:1px solid #d9dee8;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);}',
    '.site-nav__inner{width:min(1180px,calc(100% - 36px));min-height:52px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:14px;}',
    '.site-nav__brand{display:inline-flex;align-items:baseline;gap:7px;color:#20242c;font-size:15px;font-weight:800;text-decoration:none;white-space:nowrap;}',
    '.site-nav__version{color:#667085;font-size:11px;font-weight:700;}',
    '.site-nav__menus,.site-nav__tools{display:flex;align-items:center;gap:6px;}',
    '.site-nav__menus{flex:1;min-width:0;overflow:visible;}',
    '.site-nav__link{display:inline-flex;min-height:32px;align-items:center;padding:6px 9px;border:0;border-radius:8px;background:transparent;color:#475467;font:inherit;font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;cursor:pointer;}',
    '.site-nav__link:hover,.site-nav__link[aria-current=page]{background:#eff6ff;color:#2563eb;}',
    '.site-nav__admin-link{border:1px solid #d9dee8;background:#fff;}',
    '.tool-version-footer{width:min(1120px,calc(100% - 36px));margin:0 auto;padding:18px 0 24px;color:#667085;font-size:12px;line-height:1.5;}',
    '.tool-version-footer__inner{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px 16px;padding-top:12px;border-top:1px solid #d9dee8;}',
    '@media(max-width:700px){.site-nav__inner{width:min(100% - 24px,1120px);min-height:50px;gap:8px;}.site-nav__brand{font-size:14px;}.site-nav__version{font-size:10px;}.site-nav__link{font-size:12px;padding:7px 8px;}.site-nav__tools{display:none;}.site-nav__menus{overflow-x:auto;scrollbar-width:none;}.site-nav__menus::-webkit-scrollbar{display:none;}}'
  ].join('');
  document.head.appendChild(style);

  var nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', '主导航');
  function setNavContent(categoryHtml) {
    nav.innerHTML = [
    '<div class="site-nav__inner">',
    '<a class="site-nav__brand" href="/">HTML Tools<span class="site-nav__version">v' + escapeHtml(APP_VERSION) + '</span></a>',
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

  }

  setNavContent('');

  document.body.insertBefore(nav, document.body.firstChild);

  fetch('/api/tools', { cache: 'no-store' })
    .then(function (response) { return response.json(); })
    .then(function (data) {
      setNavContent(renderCategories(data.tools));
      appendToolVersionFooter(currentToolFrom(data.tools));
    })
    .catch(function () {
      setNavContent('');
      appendToolVersionFooter(null);
    });

  function appendToolVersionFooter(tool) {
    if (window.location.pathname.indexOf('/tools/') !== 0) return;
    if (document.querySelector('.tool-version-footer')) return;

    var title = tool && tool.title ? tool.title : document.title || 'Tool';
    var version = tool && tool.version ? tool.version : APP_VERSION;
    var footer = document.createElement('footer');
    footer.className = 'tool-version-footer';
    footer.innerHTML = [
      '<div class="tool-version-footer__inner">',
      '<span>' + escapeHtml(title) + ' v' + escapeHtml(version) + '</span>',
      '<span>&copy; ' + new Date().getFullYear() + ' EBM001. All rights reserved.</span>',
      '</div>'
    ].join('');
    document.body.appendChild(footer);
  }
}());
