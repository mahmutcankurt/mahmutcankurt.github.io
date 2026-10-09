(function () {
  var root = document.documentElement;
  var themeBtn = document.getElementById('theme-toggle');
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  var systemLight = window.matchMedia('(prefers-color-scheme: light)');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeMeta.setAttribute('content', theme === 'light' ? '#ffffff' : '#0d1117');
    themeBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
  }

  function savedTheme() {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  }

  // the initial theme is set by the inline script in the head; this syncs the button and meta
  applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
  });

  // follow the system theme until the visitor picks one
  if (systemLight.addEventListener) {
    systemLight.addEventListener('change', function (e) {
      var s = savedTheme();
      if (s !== 'dark' && s !== 'light') applyTheme(e.matches ? 'light' : 'dark');
    });
  }

  var menuBtn = document.getElementById('menu-btn');
  var links = document.getElementById('nav-links');
  function setMenu(open) {
    links.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!links.classList.contains('open')); });
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      setMenu(false);
      menuBtn.focus();
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(function (el) { revealObs.observe(el); });

    var navLinks = document.querySelectorAll('.nav-links a');
    var sectionObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { sectionObs.observe(s); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
