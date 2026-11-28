// Sponsorlogo's op de homepage uit /data/sponsoren.json.
// Per sponsor: naam, logo (pad naar het plaatje), startdatum en einddatum (JJJJ-MM-DD).
// Een sponsor is zichtbaar van de startdatum tot en met de einddatum.
(function () {
  'use strict';

  var OPPERVLAK = 6800;   // elk logo krijgt ongeveer even veel oppervlak (px²)
  var MAX_BREED = 160;
  var MAX_HOOG = 80;

  function datum(value, eindVanDag) {
    var m = typeof value === 'string' ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
    if (!m) return null;
    var d = eindVanDag
      ? new Date(+m[1], +m[2] - 1, +m[3], 23, 59, 59, 999)
      : new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 ? d.getTime() : null;
  }

  function maatVoorLogo(img) {
    var r = img.naturalWidth / img.naturalHeight;
    if (!r || !isFinite(r)) return;
    var w = Math.sqrt(OPPERVLAK * r), h = w / r;
    if (w > MAX_BREED) { w = MAX_BREED; h = w / r; }
    if (h > MAX_HOOG) { h = MAX_HOOG; w = h * r; }
    img.style.width = Math.round(w) + 'px';
    img.style.height = Math.round(h) + 'px';
  }

  function logo(s, kopie) {
    var wrap = document.createElement('div');
    wrap.setAttribute('style', 'flex: none; height: 96px; padding: 0 26px; display: flex; align-items: center; justify-content: center');
    if (kopie) {
      wrap.className = 'lb-marquee-kopie';
      wrap.setAttribute('aria-hidden', 'true');
    }
    var img = document.createElement('img');
    img.src = s.logo;
    img.alt = kopie ? '' : (s.naam || '');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('style', 'max-width: ' + MAX_BREED + 'px; max-height: ' + MAX_HOOG + 'px; object-fit: contain; border-radius: 8px; display: block');
    if (img.complete && img.naturalWidth) maatVoorLogo(img);
    else img.addEventListener('load', function () { maatVoorLogo(img); });
    wrap.appendChild(img);
    return wrap;
  }

  var track = null;

  // De paginaopbouw (dc-runtime) kan het blok vervangen; hang de rij dan opnieuw in.
  function koppel() {
    var box = document.querySelector('.lb-marquee');
    if (!box || !track || track.parentNode === box) return;
    box.innerHTML = '';
    box.appendChild(track);
  }

  function toon(sponsoren) {
    var nu = Date.now();
    var actief = sponsoren.filter(function (s) {
      var start = datum(s.startdatum, false);
      var eind = datum(s.einddatum, true);
      if (!s.logo || start === null || eind === null) {
        console.warn('Sponsor overgeslagen (logo of datum ontbreekt/ongeldig):', s.naam || s);
        return false;
      }
      return start <= nu && nu <= eind;
    });

    track = document.createElement('div');
    track.className = 'lb-marquee-track';
    track.setAttribute('style', 'display: flex; align-items: center; width: max-content');
    // Twee keer dezelfde rij, zodat de doorlopende band naadloos rondgaat.
    actief.forEach(function (s) { track.appendChild(logo(s, false)); });
    actief.forEach(function (s) { track.appendChild(logo(s, true)); });
    koppel();
  }

  if (window.DC) {
    var vorige = DC.afterRender;
    DC.afterRender = function (root, c) {
      if (vorige) vorige(root, c);
      koppel();
    };
  }

  fetch('/data/sponsoren.json', { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.sponsoren)) throw new Error('sponsoren.json moet een sponsoren-array bevatten');
      toon(data.sponsoren);
    })
    .catch(function (error) {
      console.error('Sponsoren konden niet uit /data/sponsoren.json worden geladen:', error);
    });
})();
