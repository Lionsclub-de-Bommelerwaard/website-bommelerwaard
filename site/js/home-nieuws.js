// Nieuws op de homepage: de 5 nieuwste berichten uit /data/nieuws.json (via js/nieuws.js),
// waarvan er steeds 3 te zien zijn. Elke 5 seconden schuift de rij één bericht op:
// het eerste verdwijnt links en het volgende komt rechts achteraan. Na het 5e komt het 1e weer.
(function () {
  'use strict';

  var MAX_BERICHTEN = 5;
  var ZICHTBAAR = 3;
  var INTERVAL_MS = 5000;
  var DUUR_MS = 600;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  var CATS = { evenement: 'Evenement', actie: 'Doorlopende actie', jongeren: 'Jongeren', internationaal: 'Internationaal' };

  function kaart(n) {
    var label = CATS[n.cat] || 'Nieuws';
    var meta = n.date ? n.date + ' · ' + label : label;
    var a = document.createElement('a');
    a.className = 'lb-news';
    a.href = n.href || '/nieuws/';
    a.setAttribute('style', 'background: #FFFFFF; border: 1px solid #D6DDEA; border-radius: 18px; overflow: hidden; text-decoration: none; color: #13203F; display: flex; flex-direction: column');
    a.innerHTML =
      '<img src="' + escapeHtml(n.img) + '" alt="' + escapeHtml(n.alt) + '" class="lb-news-img" style="height: 180px; width: 100%; object-fit: cover; object-position: ' + escapeHtml(n.pos || '50% 50%') + '; display: block" loading="lazy" decoding="async">' +
      '<div style="padding: 20px 22px 24px; display: flex; flex-direction: column; gap: 8px">' +
      '<span style="font-size: 14px; color: #55565A">' + escapeHtml(meta) + '</span>' +
      '<h3 class="lb-news-title" style="margin: 0; font-size: 21px; line-height: 1.25">' + escapeHtml(n.title) + '</h3></div>';
    return a;
  }

  // Nieuwste eerst: op visibleFrom (publicatiedatum), bij gelijke datum de volgorde in nieuws.json.
  function nieuwste(items) {
    return items
      .map(function (n, i) { return { n: n, i: i }; })
      .sort(function (a, b) {
        var da = a.n.visibleFrom || '', db = b.n.visibleFrom || '';
        return da < db ? 1 : da > db ? -1 : a.i - b.i;
      })
      .slice(0, MAX_BERICHTEN)
      .map(function (x) { return x.n; });
  }

  var timer = null;
  var track = null;
  var gepauzeerd = false;

  // De paginaopbouw (dc-runtime) kan het blok .lb-home-news vervangen door een nieuw, leeg
  // element. Hang de rij daarom na elke render opnieuw in het blok als hij er niet meer in zit.
  function koppel() {
    var box = document.querySelector('.lb-home-news');
    if (!box || !track || track.parentNode === box) return;
    box.innerHTML = '';
    box.appendChild(track);
    // Even stilhouden zolang iemand met de muis of het toetsenbord in de rij zit.
    box.onmouseenter = function () { gepauzeerd = true; };
    box.onmouseleave = function () { gepauzeerd = false; };
    box.onfocusin = function () { gepauzeerd = true; };
    box.onfocusout = function () { gepauzeerd = false; };
  }

  function start(items) {
    if (timer) { clearInterval(timer); timer = null; }
    gepauzeerd = false;

    var lijst = nieuwste(items);
    track = document.createElement('div');
    track.className = 'lb-home-news-track';
    var box = document.querySelector('.lb-home-news');
    if (box) box.innerHTML = '';
    if (!lijst.length) { track = null; return; }

    var aantal = Math.min(ZICHTBAAR, lijst.length);
    for (var i = 0; i < aantal; i++) track.appendChild(kaart(lijst[i]));
    koppel();
    if (lijst.length <= ZICHTBAAR) return; // niets om door te schuiven

    var volgende = aantal;
    var bezig = false;
    var rustig = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function stap() {
      koppel();
      if (bezig || gepauzeerd || document.hidden) return;
      var nieuw = kaart(lijst[volgende]);
      volgende = (volgende + 1) % lijst.length;
      var eerste = track.firstElementChild;

      if (rustig) {
        track.removeChild(eerste);
        track.appendChild(nieuw);
        return;
      }

      bezig = true;
      track.appendChild(nieuw);
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var afstand = eerste.getBoundingClientRect().width + gap;
      eerste.style.transition = 'opacity ' + DUUR_MS + 'ms ease';
      eerste.style.opacity = '0';
      track.style.transition = 'transform ' + DUUR_MS + 'ms ease';
      track.style.transform = 'translateX(' + (-afstand) + 'px)';

      setTimeout(function () {
        track.style.transition = 'none';
        track.style.transform = '';
        if (eerste.parentNode === track) track.removeChild(eerste);
        void track.offsetWidth; // reflow, zodat de reset niet zelf animeert
        track.style.transition = '';
        bezig = false;
      }, DUUR_MS + 30);
    }

    timer = setInterval(stap, INTERVAL_MS);
  }

  if (window.DC) {
    var vorige = DC.afterRender;
    DC.afterRender = function (root, c) {
      if (vorige) vorige(root, c);
      koppel();
    };
  }

  document.addEventListener('nieuws:geladen', function (ev) { start(ev.detail || []); });
  if (Array.isArray(window.ITEMS)) start(window.ITEMS);
})();
