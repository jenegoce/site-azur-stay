/* Azur Stay — visionneuse photos (lightbox) v1
   Clic sur une photo de galerie → plein écran, flèches, glissement mobile,
   compteur, Échap/croix. Supporte des photos d'album supplémentaires
   masquées sur la page via <div class="g g-more"> (chargées à l'ouverture). */
(function () {
  var gal = document.querySelector('.gallery');
  if (!gal) return;
  var cells = gal.querySelectorAll('.g img');
  if (!cells.length) return;

  var ov, img, cap, idx = 0, startX = null;
  var srcs = [], alts = [];
  cells.forEach ? null : null;
  for (var i = 0; i < cells.length; i++) {
    srcs.push(cells[i].getAttribute('data-full') || cells[i].src || cells[i].getAttribute('data-src'));
    alts.push(cells[i].alt || '');
  }

  function build() {
    ov = document.createElement('div');
    ov.className = 'lb-overlay';
    ov.setAttribute('role', 'dialog');
    ov.setAttribute('aria-modal', 'true');
    ov.innerHTML =
      '<button class="lb-close" aria-label="Fermer">&#10005;</button>' +
      '<button class="lb-prev" aria-label="Photo précédente">&#10094;</button>' +
      '<figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>' +
      '<button class="lb-next" aria-label="Photo suivante">&#10095;</button>' +
      '<div class="lb-count"></div>';
    document.body.appendChild(ov);
    img = ov.querySelector('.lb-img');
    cap = ov.querySelector('.lb-cap');
    ov.querySelector('.lb-close').addEventListener('click', close);
    ov.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); nav(-1); });
    ov.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); nav(1); });
    ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
    ov.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    ov.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) nav(dx > 0 ? -1 : 1);
      startX = null;
    }, { passive: true });
    document.addEventListener('keydown', onKey);
  }

  function onKey(e) {
    if (!ov || !ov.classList.contains('lb-open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') nav(-1);
    else if (e.key === 'ArrowRight') nav(1);
  }

  function show(i) {
    idx = (i + srcs.length) % srcs.length;
    img.src = srcs[idx];
    img.alt = alts[idx];
    cap.textContent = alts[idx];
    ov.querySelector('.lb-count').textContent = (idx + 1) + ' / ' + srcs.length;
    // précharger les voisines
    [idx + 1, idx - 1].forEach(function (j) {
      var k = (j + srcs.length) % srcs.length;
      var p = new Image(); p.src = srcs[k];
    });
  }

  function open(i) {
    if (!ov) build();
    show(i);
    ov.classList.add('lb-open');
    document.documentElement.classList.add('lb-lock');
  }
  function close() {
    ov.classList.remove('lb-open');
    document.documentElement.classList.remove('lb-lock');
  }
  function nav(d) { show(idx + d); }

  for (var j = 0; j < cells.length; j++) {
    (function (k) {
      var cell = cells[k].closest ? cells[k].closest('.g') : cells[k].parentNode;
      (cell || cells[k]).addEventListener('click', function (e) { e.preventDefault(); open(k); });
      if (cell) { cell.style.cursor = 'zoom-in'; cell.setAttribute('tabindex', '0'); cell.setAttribute('role', 'button');
        cell.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(k); } });
      }
    })(j);
  }
})();
