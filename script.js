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

  var heroImages = [
    'assets/Fishnet.jpg',
    'assets/HDPE.jpg',
    'assets/Professional.jpg',
    'assets/Fishnet.jpg',
    'assets/HDPE.jpg',
    'assets/Professional.jpg'
  ];

  window.heroCurrentIndex = 0;

  function setHeroImage(index) {
    window.heroCurrentIndex = (index + heroImages.length) % heroImages.length;

    var mainImg = document.getElementById('heroImgEl');
    if (mainImg) {
      mainImg.style.opacity = '0';
      setTimeout(function () {
        mainImg.src = heroImages[window.heroCurrentIndex];
        mainImg.style.opacity = '1';
      }, 150);
    }

    var lens = document.getElementById('heroZoomLens');
    if (lens) {
      lens.style.backgroundImage = 'url(' + heroImages[window.heroCurrentIndex] + ')';
    }

    document.querySelectorAll('.hero__thumb').forEach(function (t, i) {
      t.classList.toggle('active', i === window.heroCurrentIndex);
    });
  }

  window.heroSet = function (index) { setHeroImage(index); };
  window.heroNav = function (dir) { setHeroImage(window.heroCurrentIndex + dir); };


  function initZoom() {
    var mainImgEl = document.getElementById('heroMainImg');
    var zoomLensEl = document.getElementById('heroZoomLens');
    var cursorDotEl = document.getElementById('heroCursorDot');

    if (!mainImgEl || !zoomLensEl) return;

    zoomLensEl.style.backgroundImage = 'url(' + heroImages[0] + ')';
    zoomLensEl.style.backgroundPosition = '50% 50%';

    mainImgEl.addEventListener('mousemove', function (e) {
      var rect = mainImgEl.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;

      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));

      zoomLensEl.style.backgroundPosition = x + '% ' + y + '%';

      if (cursorDotEl) {
        cursorDotEl.style.left = (e.clientX - rect.left) + 'px';
        cursorDotEl.style.top = (e.clientY - rect.top) + 'px';
      }
    });


    mainImgEl.addEventListener('mouseleave', function () {
      zoomLensEl.style.backgroundPosition = '50% 50%';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initZoom);
  } else {
    initZoom();
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
  var track = document.getElementById('appTrack');
  var prevBtn = document.getElementById('appPrev');
  var nextBtn = document.getElementById('appNext');
  if (!track || !prevBtn || !nextBtn) return;

  var cards = track.querySelectorAll('.app-card');
  var currentIdx = 0;
  var gap = 16;

  function getVisible() {
    var w = window.innerWidth;
    if (w <= 380) return 1;
    if (w <= 600) return 2;
    if (w <= 1080) return 3;
    return 4;
  }

  function getMax() {
    return Math.max(0, cards.length - getVisible());
  }

  function goTo(i) {
    currentIdx = Math.max(0, Math.min(i, getMax()));
    var cardW = cards[0] ? cards[0].offsetWidth + gap : 0;
    track.style.transform = 'translateX(-' + (currentIdx * cardW) + 'px)';
    prevBtn.disabled = currentIdx === 0;
    nextBtn.disabled = currentIdx >= getMax();
  }

  prevBtn.addEventListener('click', function () { goTo(currentIdx - 1); });
  nextBtn.addEventListener('click', function () { goTo(currentIdx + 1); });


  var startX = 0;
  track.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function (e) {
    var diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? currentIdx + 1 : currentIdx - 1);
    }
  }, { passive: true });


  window.addEventListener('resize', function () { goTo(currentIdx); });

  goTo(0); 
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
  if (!track) return;

  var wrap = track.parentElement;
  var cards = Array.from(track.children);
  var total = cards.length;
  var current = 0;
  var startX = 0;
  var dragDelta = 0;
  var isDragging = false;

  function getCardWidth() {
    var gap = parseFloat(getComputedStyle(track).gap) || 24;
    return (cards[0] ? cards[0].offsetWidth : 0) + gap;
  }


  function getMaxIndex() {
    var wrapW = wrap.offsetWidth;
    var cardW = getCardWidth();
    return Math.max(0, total - Math.floor(wrapW / cardW));
  }

  function applyTransform(extra, animated) {
    track.style.transition = animated
      ? 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)'
      : 'none';
    track.style.transform = 'translateX(' + (-(current * getCardWidth()) + (extra || 0)) + 'px)';
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    applyTransform(0, true);
  }

  wrap.addEventListener('mousedown', function (e) {
    isDragging = true;
    startX = e.clientX;
    dragDelta = 0;
    wrap.style.cursor = 'grabbing';
    track.style.transition = 'none';
  });

  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    dragDelta = e.clientX - startX;
    applyTransform(dragDelta, false);
  });

  window.addEventListener('mouseup', function () {
    if (!isDragging) return;
    isDragging = false;
    wrap.style.cursor = 'grab';
    var threshold = getCardWidth() * 0.25;
    if (dragDelta < -threshold) { goTo(current + 1); }
    else if (dragDelta > threshold) { goTo(current - 1); }
    else { applyTransform(0, true); } 
  });

  wrap.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
    dragDelta = 0;
    track.style.transition = 'none';
  }, { passive: true });

  wrap.addEventListener('touchmove', function (e) {
    dragDelta = e.touches[0].clientX - startX;
    applyTransform(dragDelta, false);
  }, { passive: true });

  wrap.addEventListener('touchend', function () {
    var threshold = getCardWidth() * 0.25;
    if (dragDelta < -threshold) { goTo(current + 1); }
    else if (dragDelta > threshold) { goTo(current - 1); }
    else { applyTransform(0, true); }
  });

  track.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('dragstart', function (e) { e.preventDefault(); });
  });

  window.addEventListener('resize', function () { goTo(current); });
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