'use strict';

(function () {
  var btn = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
})();

function closeMobileMenu() {
  var menu = document.getElementById('mobileMenu');
  var btn = document.getElementById('hamburger');
  if (menu) menu.classList.remove('open');
  if (btn) btn.setAttribute('aria-expanded', 'false');
  var mobTrig = document.getElementById('mobileProductsTrigger');
  var mobPanel = document.getElementById('mobileProductsPanel');
  if (mobTrig && mobPanel) {
    mobTrig.setAttribute('aria-expanded', 'false');
    mobPanel.setAttribute('hidden', '');
  }
}



(function () {
  var trigger = document.getElementById('navProductsTrigger');
  var panel = document.getElementById('navProductsPanel');
  if (!trigger || !panel) return;

  function closeNavProducts() {
    trigger.setAttribute('aria-expanded', 'false');
    panel.classList.remove('nav__dropdown--open');
    panel.setAttribute('hidden', '');
  }

  function openNavProducts() {
    trigger.setAttribute('aria-expanded', 'true');
    panel.removeAttribute('hidden');
    requestAnimationFrame(function () {
      panel.classList.add('nav__dropdown--open');
    });
  }

  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    if (trigger.getAttribute('aria-expanded') === 'true') closeNavProducts();
    else openNavProducts();
  });

  panel.addEventListener('click', function (e) {
    if (e.target.closest('a[role="menuitem"]')) closeNavProducts();
  });

  document.addEventListener('click', function () {
    closeNavProducts();
  });

  window.closeNavProductsDropdown = closeNavProducts;
})();

(function () {
  var mobTrigger = document.getElementById('mobileProductsTrigger');
  var mobPanel = document.getElementById('mobileProductsPanel');
  if (!mobTrigger || !mobPanel) return;
  mobTrigger.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = mobTrigger.getAttribute('aria-expanded') === 'true';
    if (open) {
      mobTrigger.setAttribute('aria-expanded', 'false');
      mobPanel.setAttribute('hidden', '');
    } else {
      mobTrigger.setAttribute('aria-expanded', 'true');
      mobPanel.removeAttribute('hidden');
    }
  });
})();



var stickyBar    = document.getElementById('stickyBar');
var stickyHero   = document.querySelector('.hero');
var stickyGone   = false;
var stickyLastY  = 0;
var stickyTick   = false;

document.addEventListener('DOMContentLoaded', function () {
  if (!stickyBar || !stickyHero) return;

  window.scrollTo(0, 0);
  stickyBar.classList.remove('sb--visible');


  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        stickyGone = false;
        stickyBar.classList.remove('sb--visible');
      } else {
        stickyGone = true;
      }
    });
  }, { threshold: 0 });

  observer.observe(stickyHero);

  window.addEventListener('scroll', function () {
    if (!stickyTick) {
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (stickyGone) {
          if (y > stickyLastY) {
            stickyBar.classList.add('sb--visible');
          } else {
            stickyBar.classList.remove('sb--visible');
          }
        }
        stickyLastY = y;
        stickyTick  = false;
      });
      stickyTick = true;
    }
  }, { passive: true });

});

(function () {
  var mainImg = document.getElementById('mainImage');
  var thumbsBox = document.getElementById('thumbsContainer');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var zoomResult = document.getElementById('zoomResult');

  if (!mainImg || !thumbsBox) return;

  var heroImages = [
    mainImg.getAttribute('src') || './images/Fishnet.jpg',
    'assets/HDPE.jpg',
    'assets/Professional.jpg',
    'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=60',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=60',
    'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800&q=60',
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=60'
  ].filter(function (u, i, a) { return u && a.indexOf(u) === i; });

  var idx = 0;

  function setActiveThumb() {
    thumbsBox.querySelectorAll('.thumb').forEach(function (btn, i) {
      btn.classList.toggle('active', i === idx);
    });
  }

  function applyZoomBg() {
    if (!zoomResult) return;
    var u = heroImages[idx];
    zoomResult.style.backgroundImage = 'url("' + String(u).replace(/\\/g, '/').replace(/"/g, '\\"') + '")';
    zoomResult.style.backgroundPosition = '50% 50%';
  }

  function show(i) {
    idx = (i + heroImages.length) % heroImages.length;
    mainImg.style.opacity = '0.85';
    var nextSrc = heroImages[idx];
    var pre = new Image();
    pre.onload = function () {
      mainImg.src = nextSrc;
      mainImg.style.opacity = '1';
      applyZoomBg();
      setActiveThumb();
    };
    pre.onerror = function () {
      mainImg.src = nextSrc;
      mainImg.style.opacity = '1';
      applyZoomBg();
      setActiveThumb();
    };
    pre.src = nextSrc;
  }

  function buildThumbs() {
    thumbsBox.innerHTML = '';
    heroImages.forEach(function (src, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'thumb' + (i === idx ? ' active' : '');
      b.setAttribute('aria-label', 'Show image ' + (i + 1));
      var im = document.createElement('img');
      im.src = src;
      im.alt = '';
      b.appendChild(im);
      b.addEventListener('click', function () { show(i); });
      thumbsBox.appendChild(b);
    });
  }

  function onMainMove(e) {
    if (!zoomResult || window.matchMedia('(max-width: 800px)').matches) return;
    var rect = mainImg.getBoundingClientRect();
    var x = ((e.clientX - rect.left) / rect.width) * 100;
    var y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomResult.style.backgroundPosition =
      Math.max(0, Math.min(100, x)) + '% ' + Math.max(0, Math.min(100, y)) + '%';
  }

  function init() {
    buildThumbs();
    applyZoomBg();
    if (prevBtn) prevBtn.addEventListener('click', function () { show(idx - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { show(idx + 1); });
    mainImg.addEventListener('mousemove', onMainMove);
    mainImg.addEventListener('mouseleave', function () {
      if (zoomResult) zoomResult.style.backgroundPosition = '50% 50%';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


(function () {
  var items = document.querySelectorAll('.faq__item');

  items.forEach(function (item) {
    var btn = item.querySelector('.faq__btn');
    var ans = item.querySelector('.faq__ans');
    if (!btn || !ans) return;

    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open') || item.classList.contains('faq__item--open');

      items.forEach(function (other) {
        other.classList.remove('open', 'faq__item--open');
        var ob = other.querySelector('.faq__btn');
        var oa = other.querySelector('.faq__ans');
        if (ob) ob.setAttribute('aria-expanded', 'false');
        if (oa) oa.classList.remove('open', 'faq__ans--open');
      });

      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        ans.classList.add('open');
      }
    });
  });
})();


function handleCatalogueSubmit() {
  var input = document.getElementById('catEmail');
  if (!input || !input.value.includes('@')) {
    if (input) { input.style.borderColor = '#e53e3e'; input.focus(); }
    return;
  }
  input.style.borderColor = '';
  var btn = input.nextElementSibling;
  var orig = btn.textContent;
  input.value = '';
  btn.textContent = '✓ Sent!';
  btn.disabled = true;

  setTimeout(function () {
    btn.textContent = orig;
    btn.disabled = false;
  }, 3000);
}



(function () {
  var APP_SLIDES = [
    {
      image: './assets/Fishnet.jpg',
      title: 'Fishnet Manufacturing',
      desc: 'High-performance twisting solutions for packaging yarn, strapping materials, and reinforcement threads used in modern packaging applications.'
    },
    {
      image: './assets/HDPE.jpg',
      title: 'HDPE Pipe Systems',
      desc: 'Durable fusion-welded piping for water, gas, and industrial distribution with long service life and low maintenance.'
    },
    {
      image: './assets/Professional.jpg',
      title: 'Industrial Machinery',
      desc: 'Precision-engineered equipment tailored for technical textiles, packaging lines, and demanding production environments.'
    }
  ];

  var AUTO_SPEED = 42;
  var ARROW_PAUSE_MS = 4000;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    AUTO_SPEED = 0;
  }

  var copyCount = 4;

  function renderAppCarouselCards() {
    var track = document.getElementById('appTrack');
    if (!track) return;

    var toRender = [];
    for (var c = 0; c < copyCount; c++) {
      APP_SLIDES.forEach(function (slide) {
        toRender.push(slide);
      });
    }

    track.innerHTML = '';
    toRender.forEach(function (slide) {
      var card = document.createElement('div');
      card.className = 'app-card';
      card.setAttribute('role', 'group');
      card.setAttribute('aria-label', slide.title);
      card.style.backgroundImage = 'url(' + JSON.stringify(slide.image) + ')';

      var desc = document.createElement('p');
      desc.className = 'app-card__desc';
      desc.textContent = slide.desc;

      var title = document.createElement('h3');
      title.className = 'app-card__title';
      title.textContent = slide.title;

      card.appendChild(desc);
      card.appendChild(title);
      track.appendChild(card);
    });
  }

  renderAppCarouselCards();

  var track = document.getElementById('appTrack');
  var prevBtn = document.getElementById('appPrev');
  var nextBtn = document.getElementById('appNext');
  if (!track || !prevBtn || !nextBtn) return;

  var offset = 0;
  var setWidth = 0;
  var cardStep = 0;
  var pausedUntil = 0;
  var lastTs = 0;

  function readGap() {
    var g = parseFloat(window.getComputedStyle(track).gap);
    return isNaN(g) ? 10 : g;
  }

  function measure() {
    var cards = track.querySelectorAll('.app-card');
    var n = APP_SLIDES.length;
    if (cards.length < n * 2 || !cards[0]) {
      setWidth = 0;
      cardStep = 0;
      return;
    }
    var gap = readGap();
    var w = cards[0].getBoundingClientRect().width;
    cardStep = w + gap;
    setWidth = n * w + (n - 1) * gap;
  }

  function adjustCopiesIfNeeded() {
    measure();
    if (setWidth <= 0) return;
    var vw = window.innerWidth || document.documentElement.clientWidth || 0;
    var minTrack = vw + setWidth;
    if (track.scrollWidth >= minTrack - 2) return;
    var needed = Math.max(3, Math.ceil(minTrack / setWidth));
    if (needed <= copyCount) return;
    var offsetNorm = (offset % setWidth + setWidth) % setWidth;
    copyCount = needed;
    renderAppCarouselCards();
    measure();
    offset = offsetNorm;
    wrapOffset();
    applyTransform();
  }

  function wrapOffset() {
    if (setWidth <= 0) return;
    var eps = 0.5;
    while (offset >= setWidth - eps) offset -= setWidth;
    while (offset < -eps) offset += setWidth;
  }

  function applyTransform() {
    track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)';
  }

  function bump(dir) {
    measure();
    if (cardStep <= 0) return;
    pausedUntil = Date.now() + ARROW_PAUSE_MS;
    offset += dir * cardStep;
    wrapOffset();
    applyTransform();
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function tick(ts) {
    if (setWidth <= 0) measure();
    adjustCopiesIfNeeded();
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    if (setWidth > 0 && Date.now() > pausedUntil) {
      offset += AUTO_SPEED * dt;
      wrapOffset();
    }
    applyTransform();
    window.requestAnimationFrame(tick);
  }

  function onResize() {
    var prevSet = setWidth;
    measure();
    if (setWidth > 0 && prevSet > 0) {
      offset = (offset % setWidth + setWidth) % setWidth;
    }
    wrapOffset();
    applyTransform();
  }

  prevBtn.addEventListener('click', function () { bump(-1); });
  nextBtn.addEventListener('click', function () { bump(1); });

  prevBtn.disabled = false;
  nextBtn.disabled = false;

  var startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      bump(diff > 0 ? 1 : -1);
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    onResize();
    adjustCopiesIfNeeded();
    lastTs = 0;
  });

  measure();
  wrapOffset();
  applyTransform();
  window.requestAnimationFrame(function () {
    adjustCopiesIfNeeded();
  });
  window.requestAnimationFrame(tick);
})();



(function () {
  var tabs = document.querySelectorAll('.proc__tab');
  var panels = document.querySelectorAll('.proc__panel');
  var indicator = document.getElementById('procStepIndicator');
  var mobilePrev = document.getElementById('procMobilePrev');
  var mobileNext = document.getElementById('procMobileNext');

  var tabLabels = ['Raw Material', 'Extrusion', 'Cooling', 'Sizing', 'Quality Control', 'Marking', 'Cutting', 'Packaging'];
  var current = 0;

  function activateTab(idx) {
    current = Math.max(0, Math.min(idx, tabs.length - 1));

    tabs.forEach(function (t, i) {
      t.classList.toggle('proc__tab--active', i === current);
      t.setAttribute('aria-selected', String(i === current));
    });

    panels.forEach(function (p, i) {
      p.classList.toggle('proc__panel--active', i === current);
    });

    if (indicator) {
      indicator.textContent = 'Step ' + (current + 1) + '/' + tabs.length + ': ' + tabLabels[current];
    }

    if (mobilePrev) mobilePrev.disabled = current === 0;
    if (mobileNext) mobileNext.disabled = current === tabs.length - 1;


    if (tabs[current]) {
      tabs[current].scrollIntoView({ inline: 'nearest', behavior: 'smooth', block: 'nearest' });
    }
  }


  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activateTab(i); });
  });

  document.querySelectorAll('.proc__img-arrow--prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.closest('.proc__panel').dataset.panel);
      activateTab(idx - 1);
    });
  });
  document.querySelectorAll('.proc__img-arrow--next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = parseInt(btn.closest('.proc__panel').dataset.panel);
      activateTab(idx + 1);
    });
  });

  if (mobilePrev) mobilePrev.addEventListener('click', function () { activateTab(current - 1); });
  if (mobileNext) mobileNext.addEventListener('click', function () { activateTab(current + 1); });

  activateTab(0); 
})();


(function () {
  var track = document.getElementById('testiTrack');
  var wrap = track && track.parentElement;
  if (!track || !wrap) return;

  var originals = Array.from(track.querySelectorAll('.testi__card'));
  var n = originals.length;
  if (!n) return;

  var copyCount = 3;
  var offset = 0;
  var setWidth = 0;
  var cardStep = 0;
  var lastTs = 0;
  var AUTO_SPEED = 28;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    AUTO_SPEED = 0;
  }

  function renderCopies() {
    track.innerHTML = '';
    for (var c = 0; c < copyCount; c++) {
      originals.forEach(function (orig) {
        track.appendChild(orig.cloneNode(true));
      });
    }
  }

  renderCopies();

  function readGap() {
    var g = parseFloat(window.getComputedStyle(track).gap);
    return isNaN(g) ? 24 : g;
  }

  function measure() {
    var cards = track.querySelectorAll('.testi__card');
    if (cards.length < n * 2 || !cards[0]) {
      setWidth = 0;
      cardStep = 0;
      return;
    }
    var gap = readGap();
    var w = cards[0].getBoundingClientRect().width;
    cardStep = w + gap;
    setWidth = n * w + (n - 1) * gap;
  }

  function adjustCopiesIfNeeded() {
    measure();
    if (setWidth <= 0) return;
    var vw = wrap.offsetWidth || window.innerWidth || 0;
    var minTrack = vw + setWidth;
    if (track.scrollWidth >= minTrack - 2) return;
    var needed = Math.max(3, Math.ceil(minTrack / setWidth));
    if (needed <= copyCount) return;
    var offsetNorm = (offset % setWidth + setWidth) % setWidth;
    copyCount = needed;
    renderCopies();
    measure();
    offset = offsetNorm;
    wrapOffset();
    applyTransform();
  }

  function wrapOffset() {
    if (setWidth <= 0) return;
    var eps = 0.5;
    while (offset >= setWidth - eps) offset -= setWidth;
    while (offset < -eps) offset += setWidth;
  }

  function applyTransform() {
    track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)';
  }

  function tick(ts) {
    if (setWidth <= 0) measure();
    adjustCopiesIfNeeded();
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    if (setWidth > 0) {
      offset += AUTO_SPEED * dt;
      wrapOffset();
    }
    applyTransform();
    window.requestAnimationFrame(tick);
  }

  function onResize() {
    var prevSet = setWidth;
    measure();
    if (setWidth > 0 && prevSet > 0) {
      offset = (offset % setWidth + setWidth) % setWidth;
    }
    wrapOffset();
    applyTransform();
  }

  window.addEventListener('resize', function () {
    onResize();
    adjustCopiesIfNeeded();
    lastTs = 0;
  });

  measure();
  wrapOffset();
  applyTransform();
  window.requestAnimationFrame(function () {
    adjustCopiesIfNeeded();
  });
  window.requestAnimationFrame(tick);
})();


(function () {
  var track = document.getElementById('trustedTrack');
  var wrap = track && track.parentElement;
  if (!track || !wrap) return;

  var originals = Array.from(track.querySelectorAll('.tlogo'));
  var n = originals.length;
  if (!n) return;

  var copyCount = 3;
  var offset = 0;
  var setWidth = 0;
  var lastTs = 0;
  var AUTO_SPEED = 40;

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    AUTO_SPEED = 0;
  }

  function renderCopies() {
    track.innerHTML = '';
    for (var c = 0; c < copyCount; c++) {
      originals.forEach(function (orig) {
        track.appendChild(orig.cloneNode(true));
      });
    }
  }

  renderCopies();

  function measure() {
    var items = track.querySelectorAll('.tlogo');
    if (items.length < n * 2 || !items[0] || !items[n - 1]) {
      setWidth = 0;
      return;
    }
    var a = items[0].getBoundingClientRect();
    var b = items[n - 1].getBoundingClientRect();
    setWidth = b.right - a.left;
  }

  function adjustCopiesIfNeeded() {
    measure();
    if (setWidth <= 0) return;
    var vw = wrap.offsetWidth || 0;
    var minTrack = vw + setWidth;
    if (track.scrollWidth >= minTrack - 2) return;
    var needed = Math.max(3, Math.ceil(minTrack / setWidth));
    if (needed <= copyCount) return;
    var offsetNorm = (offset % setWidth + setWidth) % setWidth;
    copyCount = needed;
    renderCopies();
    measure();
    offset = offsetNorm;
    wrapOffset();
    applyTransform();
  }

  function wrapOffset() {
    if (setWidth <= 0) return;
    var eps = 0.5;
    while (offset >= setWidth - eps) offset -= setWidth;
    while (offset < -eps) offset += setWidth;
  }

  function applyTransform() {
    track.style.transform = 'translate3d(' + (-offset) + 'px,0,0)';
  }

  function tick(ts) {
    if (setWidth <= 0) measure();
    adjustCopiesIfNeeded();
    if (!lastTs) lastTs = ts;
    var dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;
    if (setWidth > 0) {
      offset += AUTO_SPEED * dt;
      wrapOffset();
    }
    applyTransform();
    window.requestAnimationFrame(tick);
  }

  function onResize() {
    var prevSet = setWidth;
    measure();
    if (setWidth > 0 && prevSet > 0) {
      offset = (offset % setWidth + setWidth) % setWidth;
    }
    wrapOffset();
    applyTransform();
  }

  window.addEventListener('resize', function () {
    onResize();
    adjustCopiesIfNeeded();
    lastTs = 0;
  });

  measure();
  wrapOffset();
  applyTransform();
  window.requestAnimationFrame(function () {
    adjustCopiesIfNeeded();
  });
  window.requestAnimationFrame(tick);
})();


function openModal(id) {
  var m = document.getElementById(id);
  if (!m) return;
  m.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  var m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('modal--open');
  document.body.style.overflow = '';
}

function openQuoteModal() { openModal('modalQuote'); }
function openDownloadModal() { openModal('modalDownload'); }

document.querySelectorAll('.modal-overlay').forEach(function (overlay) {
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (typeof window.closeNavProductsDropdown === 'function') {
      window.closeNavProductsDropdown();
    }
    document.querySelectorAll('.modal-overlay.modal--open').forEach(function (m) {
      closeModal(m.id);
    });
    closeMobileMenu();
  }
});

(function () {
  var df = document.getElementById('downloadBrochureForm');
  if (df) {
    df.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }
  var qf = document.getElementById('callbackQuoteForm');
  if (qf) {
    qf.addEventListener('submit', function (e) {
      e.preventDefault();
    });
  }
})();