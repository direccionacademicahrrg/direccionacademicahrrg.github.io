/* ============================================================
   site.js — Portal Académico HRRG
   Único archivo. Funciones independientes por comportamiento:
   menú mobile, footer accesible, buscador, filtros de catálogo.
   ============================================================ */

/* Menú de navegación mobile: toggle, foco, Escape, focus trap. */
(function () {
  'use strict';
  var btn = document.querySelector('[data-menu-open]');
  var panel = document.getElementById('menu-mobile');
  if (!btn || !panel) return;

  var closeBtn = panel.querySelector('[data-menu-close]');
  var lastFocus = null;

  function focusables() {
    return Array.prototype.filter.call(
      panel.querySelectorAll('a[href], button:not([disabled])'),
      function (el) { return el.offsetParent !== null; }
    );
  }

  function open() {
    lastFocus = document.activeElement;
    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btn.addEventListener('click', function () {
    panel.hidden ? open() : close();
  });
  if (closeBtn) closeBtn.addEventListener('click', close);

  panel.addEventListener('click', function (e) {
    if (e.target.closest('a[href]')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (panel.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var list = focusables();
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  // Si se pasa a desktop con el panel abierto, cerrarlo.
  var mq = window.matchMedia('(min-width: 1024px)');
  mq.addEventListener('change', function (e) { if (e.matches && !panel.hidden) close(); });
})();


/* Footer: los grupos son <details open> para funcionar sin JS.
   En mobile se colapsan; en desktop el CSS oculta el summary y quedan abiertos. */
(function () {
  'use strict';
  var groups = document.querySelectorAll('.ftr-group');
  if (!groups.length) return;
  var mq = window.matchMedia('(min-width: 1024px)');

  function sync() {
    Array.prototype.forEach.call(groups, function (g) {
      if (mq.matches) g.open = true;
      else g.open = false;
    });
  }
  sync();
  mq.addEventListener('change', sync);
})();


/* Buscador global: por ahora deriva la consulta a la página de resultados.
   El índice (assets/search-index.json) se resuelve siempre contra SITE_ROOT,
   nunca contra la ubicación de la página actual. */
(function () {
  'use strict';
  var ROOT = window.SITE_ROOT || './';
  var forms = document.querySelectorAll('form[data-search]');
  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[name="q"]');
      var q = input ? input.value.trim() : '';
      if (!q) { if (input) input.focus(); return; }
      window.location.href = ROOT + 'buscar/index.html?q=' + encodeURIComponent(q);
    });
  });
})();


/* Catálogos filtrables (Recursos, Novedades, Capacitaciones).
   Contrato genérico, sin nombres de página:
   [data-catalog] contenedor
     [data-filter-btn][data-filter-value] botón de categoría (aria-pressed)
     [data-catalog-search] input de texto
     [data-catalog-count][data-count-singular][data-count-plural] contador
     [data-catalog-empty] estado vacío
   Cada ítem lleva [data-category] y opcionalmente [data-search] (texto indexado). */
function normalizeText(s) {
  return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

(function () {
  var catalogs = document.querySelectorAll('[data-catalog]');
  Array.prototype.forEach.call(catalogs, function (root) {
    var filterBtns = root.querySelectorAll('[data-filter-btn]');
    var items = root.querySelectorAll('[data-category]');
    var searchInput = root.querySelector('[data-catalog-search]');
    var countEl = root.querySelector('[data-catalog-count]');
    var emptyEl = root.querySelector('[data-catalog-empty]');
    var active = 'Todas';

    function apply() {
      var q = normalizeText(searchInput && searchInput.value);
      var visible = 0;
      Array.prototype.forEach.call(items, function (item) {
        var cat = item.getAttribute('data-category');
        var text = normalizeText(item.getAttribute('data-search') || item.textContent);
        var matchCat = active === 'Todas' || cat === active;
        var matchText = !q || text.indexOf(q) !== -1;
        var show = matchCat && matchText;
        item.hidden = !show;
        if (show) visible++;
      });
      if (countEl) {
        var singular = countEl.getAttribute('data-count-singular') || 'resultado';
        var plural = countEl.getAttribute('data-count-plural') || 'resultados';
        countEl.textContent = visible + ' ' + (visible === 1 ? singular : plural);
      }
      if (emptyEl) emptyEl.hidden = visible !== 0;
    }

    Array.prototype.forEach.call(filterBtns, function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(filterBtns, function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        active = btn.getAttribute('data-filter-value');
        apply();
      });
    });
    if (searchInput) searchInput.addEventListener('input', apply);
    apply();
  });
})();

/* Página de resultados de búsqueda (buscar/index.html).
   Carga assets/search-index.json vía SITE_ROOT y filtra client-side
   por título, resumen y palabras clave. Sin backend, sin librerías. */
(function () {
  var box = document.querySelector('[data-search-results]');
  if (!box) return;
  var input = document.querySelector('[data-search-page-input]');
  var countEl = document.querySelector('[data-search-page-count]');
  var emptyEl = document.querySelector('[data-search-page-empty]');
  var root = window.SITE_ROOT || './';
  var data = [];

  function typeIcon(external) {
    return external
      ? '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M14 3h7v7"></path><path d="M21 3l-9 9"></path><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"></path></svg>'
      : '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"></path></svg>';
  }

  function render(q) {
    var query = normalizeText(q);
    var results = !query ? [] : data.filter(function (item) {
      var hay = normalizeText(item.title + ' ' + item.summary + ' ' + (item.keywords || []).join(' '));
      return hay.indexOf(query) !== -1;
    });
    box.innerHTML = '';
    results.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'row';
      a.href = item.external ? item.url : root + item.url;
      if (item.external) { a.target = '_blank'; a.rel = 'noopener'; }
      a.innerHTML =
        '<span class="row-cat" style="display:inline-block">' + item.type + '</span>' +
        '<span class="row-title" style="flex:1"><b style="display:block">' + item.title + '</b>' +
        '<span style="display:block;font-weight:400;font-size:12px;color:var(--ink-3);margin-top:2px">' + item.summary + '</span></span>' +
        typeIcon(item.external);
      box.appendChild(a);
    });
    if (countEl) countEl.textContent = query ? (results.length + (results.length === 1 ? ' resultado' : ' resultados')) : '';
    if (emptyEl) emptyEl.hidden = !query || results.length !== 0;
  }

  fetch(root + 'assets/search-index.json').then(function (r) { return r.json(); }).then(function (json) {
    data = json;
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (input) input.value = q;
    render(q);
  }).catch(function () {
    if (emptyEl) { emptyEl.hidden = false; emptyEl.textContent = 'No pudimos cargar el índice de búsqueda.'; }
  });

  if (input) {
    input.addEventListener('input', function () { render(input.value); });
  }
})();