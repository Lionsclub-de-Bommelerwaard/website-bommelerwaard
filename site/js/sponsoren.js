// Sponsorlogo's op de homepage uit /data/sponsoren.json.
// Per sponsor: name, url (optioneel, maakt het logo klikbaar), description (optioneel, verschijnt in een tooltip bij hover),
// logo (pad naar het plaatje), visibleFrom en visibleUntil (JJJJ-MM-DD).
// Een sponsor is zichtbaar van visibleFrom tot en met visibleUntil.
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

  // Eén zwevende tooltip voor de omschrijving. Hij hangt aan <body>, zodat de band
  // (overflow: hidden) hem niet afknipt. De band staat stil zolang de muis erop staat.
  var tip = null;
  var tipBij = null;   // [wrap, sponsor, link] waar de tooltip nu bij hoort
  function toonTip(el, s, link) {
    tipBij = [el, s, link || null];
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'lb-sponsor-tip';
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('style', 'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; position: fixed; z-index: 1000; max-width: 260px; padding: 10px 14px; border-radius: 12px; background: #00338D; color: #FFFFFF; font-size: 15px; line-height: 1.4; box-shadow: 0 10px 24px rgba(0, 31, 87, 0.28); pointer-events: none; transform: translate(-50%, -100%); transition: opacity .15s ease; opacity: 0');
      document.body.appendChild(tip);
    }
    tip.innerHTML = '';
    var b = document.createElement('strong');
    b.textContent = s.name;
    b.style.display = 'block';
    tip.appendChild(b);
    tip.appendChild(document.createTextNode(s.description));
    var r = el.getBoundingClientRect();
    var x = Math.min(Math.max(r.left + r.width / 2, 140), window.innerWidth - 140);
    tip.style.left = x + 'px';
    tip.style.top = (r.top + 4) + 'px';
    tip.style.opacity = '1';
  }
  function verbergTip() { tipBij = null; if (tip) tip.style.opacity = '0'; }
  // Bij scrollen: tooltip meeschuiven als het logo toetsenbordfocus heeft, anders verbergen.
  window.addEventListener('scroll', function () {
    if (tipBij && tipBij[2] && document.activeElement === tipBij[2]) toonTip(tipBij[0], tipBij[1], tipBij[2]);
    else verbergTip();
  }, { passive: true });

  function logo(s, kopie) {
    var wrap = document.createElement('div');
    wrap.setAttribute('style', 'flex: none; height: 96px; padding: 0 26px; display: flex; align-items: center; justify-content: center');
    if (kopie) {
      wrap.className = 'lb-marquee-kopie';
      wrap.setAttribute('aria-hidden', 'true');
    }
    var img = document.createElement('img');
    img.src = s.logo;
    img.alt = kopie ? '' : (s.name || '');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('style', 'max-width: ' + MAX_BREED + 'px; max-height: ' + MAX_HOOG + 'px; object-fit: contain; border-radius: 8px; display: block');
    if (img.complete && img.naturalWidth) maatVoorLogo(img);
    else img.addEventListener('load', function () { maatVoorLogo(img); });
    var doel = img;
    if (s.url && /^https?:\/\//.test(s.url)) {
      var a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';           // opent in een nieuw tabblad
      a.rel = 'noopener';
      a.style.display = 'block';
      if (kopie) a.tabIndex = -1;
      a.appendChild(img);
      wrap.appendChild(a);
      doel = a;
    } else {
      wrap.appendChild(img);
    }
    if (s.description) {
      wrap.addEventListener('mouseenter', function () { toonTip(wrap, s); });
      wrap.addEventListener('mouseleave', verbergTip);
      if (doel !== img) {
        doel.addEventListener('focus', function () { toonTip(wrap, s, doel); });
        doel.addEventListener('blur', function () {
          verbergTip();
          // De browser schuift de band opzij om het gefocuste logo te tonen; zet dat terug.
          var box = wrap.closest('.lb-marquee');
          if (box) box.scrollLeft = 0;
        });
        doel.setAttribute('aria-label', s.name + ': ' + s.description + ' (opent in een nieuw tabblad)');
      }
    }
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
      var start = datum(s.visibleFrom, false);
      var eind = datum(s.visibleUntil, true);
      if (!s.logo || start === null || eind === null) {
        console.warn('Sponsor overgeslagen (logo of datum ontbreekt/ongeldig):', s.name || s);
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
      if (!data || !Array.isArray(data.sponsors)) throw new Error('sponsoren.json moet een sponsors-array bevatten');
      toon(data.sponsors);
    })
    .catch(function (error) {
      console.error('Sponsoren konden niet uit /data/sponsoren.json worden geladen:', error);
    });
})();
