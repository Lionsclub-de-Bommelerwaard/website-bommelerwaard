// Sponsorlogo's uit /data/sponsoren.json, per plek op de site.
//
// Per sponsor: name, url (optioneel, maakt het logo klikbaar, opent in een nieuw tabblad),
// description (optioneel, verschijnt onder de naam in de tooltip bij hover; zonder description toont de tooltip alleen de naam), logo (pad naar het plaatje),
// tileBackground (optioneel, achtergrondkleur van de tegel, bijv. voor een wit logo)
// en visibility: per plek een visibleFrom en visibleUntil.
//
// Plekken: "home" (doorlopende band op de homepage), "koekeloeretoere" en "kacheltjes"
// (tegels op die pagina's). Een sponsor staat alleen op een plek als die plek in visibility staat.
// Datum, altijd in Nederlandse tijd: JJJJ-MM-DD of JJJJ-MM-DDTUU:MM. Zonder tijd telt visibleFrom vanaf 0:00 en visibleUntil tot en met
// 23:59 van die dag. Een tijd bij visibleUntil telt tot en met die minuut. Een sponsor met een ongeldige datum
// wordt overgeslagen; de rest blijft zichtbaar.
//
// Op de pagina: een element met data-sponsors="<plek>" en data-dc-keep="1".
//   - class "lb-marquee": doorlopende band
//   - anders: tegels, met optioneel data-title en data-intro als kop en tekst erboven.
//     Zijn er geen zichtbare sponsoren, dan blijft het blok leeg.
(function () {
  'use strict';

  var OPPERVLAK = 6800;   // elk logo krijgt ongeveer even veel oppervlak (px²)
  var MAX_BREED = 160;
  var MAX_HOOG = 80;

  function maatVoorLogo(img) {
    var maat = LB.logoMaat(img.naturalWidth, img.naturalHeight, OPPERVLAK, MAX_BREED, MAX_HOOG);
    if (!maat) return;
    img.style.width = maat.breed + 'px';
    img.style.height = maat.hoog + 'px';
  }

  // Bij hover (of toetsenbordfocus) wordt het logo iets groter.
  (function () {
    var css = document.createElement('style');
    css.textContent =
      '[data-sponsors] img{transition:transform .2s ease}' +
      '[data-sponsors] .lb-marquee-track>div:hover img,[data-sponsors] .lb-logo-tile:hover img,' +
      '[data-sponsors] a:focus-visible img{transform:scale(1.15)}' +
      '@media (prefers-reduced-motion:reduce){[data-sponsors] img{transition:none}}';
    document.head.appendChild(css);
  })();

  // Eén zwevende tooltip met de naam en eventueel de omschrijving, onder het logo. Hij hangt aan <body>, zodat de
  // band (overflow: hidden) hem niet afknipt. De band staat stil zolang de muis erop staat.
  var tip = null;
  var tipBij = null;   // [element, sponsor, link] waar de tooltip nu bij hoort
  function toonTip(el, s, link) {
    tipBij = [el, s, link || null];
    if (!tip) {
      tip = document.createElement('div');
      tip.className = 'lb-sponsor-tip';
      tip.setAttribute('role', 'tooltip');
      tip.setAttribute('style', 'font-family: \'Helvetica Neue\', Helvetica, Arial, sans-serif; position: fixed; z-index: 1000; max-width: 260px; padding: 10px 14px; border-radius: 12px; background: #00338D; color: #FFFFFF; font-size: 15px; line-height: 1.4; box-shadow: 0 10px 24px rgba(0, 31, 87, 0.28); pointer-events: none; transform: translate(-50%, 0); transition: opacity .15s ease; opacity: 0');
      document.body.appendChild(tip);
    }
    tip.innerHTML = '';
    var b = document.createElement('strong');
    b.textContent = s.name;
    b.style.display = 'block';
    tip.appendChild(b);
    if (s.description) tip.appendChild(document.createTextNode(s.description));
    var r = el.getBoundingClientRect();
    var x = Math.min(Math.max(r.left + r.width / 2, 140), window.innerWidth - 140);
    tip.style.left = x + 'px';
    tip.style.top = (r.bottom + 6) + 'px';
    tip.style.opacity = '1';
  }
  function verbergTip() { tipBij = null; if (tip) tip.style.opacity = '0'; }
  // Bij scrollen: tooltip meeschuiven als het logo toetsenbordfocus heeft, anders verbergen.
  window.addEventListener('scroll', function () {
    if (tipBij && tipBij[2] && document.activeElement === tipBij[2]) toonTip(tipBij[0], tipBij[1], tipBij[2]);
    else verbergTip();
  }, { passive: true });

  // Logo (eventueel als link) met tooltip in het gegeven omhulsel.
  function vulLogo(wrap, s, kopie, extraImgStijl) {
    var img = document.createElement('img');
    img.src = s.logo;
    img.alt = kopie ? '' : (s.name || '');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('style', 'max-width: 100%; max-height: ' + MAX_HOOG + 'px; object-fit: contain; border-radius: 8px; display: block' + (extraImgStijl || ''));
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
    if (s.name) {
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
        doel.setAttribute('aria-label', s.name + (s.description ? ': ' + s.description : '') + ' (opent in een nieuw tabblad)');
      }
    }
  }

  function band(lijst) {
    var track = document.createElement('div');
    track.className = 'lb-marquee-track';
    track.setAttribute('style', 'display: flex; align-items: center; width: max-content');
    // Twee keer dezelfde rij, zodat de doorlopende band naadloos rondgaat.
    [false, true].forEach(function (kopie) {
      lijst.forEach(function (s) {
        var wrap = document.createElement('div');
        wrap.setAttribute('style', 'flex: none; height: 96px; padding: 0 26px; display: flex; align-items: center; justify-content: center');
        if (kopie) {
          wrap.className = 'lb-marquee-kopie';
          wrap.setAttribute('aria-hidden', 'true');
        }
        vulLogo(wrap, s, kopie, '; max-width: ' + MAX_BREED + 'px');
        track.appendChild(wrap);
      });
    });
    return track;
  }

  function tegels(lijst, box) {
    var holder = document.createElement('div');
    if (!lijst.length) return holder;
    var titel = box.getAttribute('data-title');
    var intro = box.getAttribute('data-intro');
    if (titel) {
      var h = document.createElement('h3');
      h.textContent = titel;
      h.setAttribute('style', 'margin: 0 0 6px; font-size: 26px');
      holder.appendChild(h);
    }
    if (intro) {
      var p = document.createElement('p');
      p.textContent = intro;
      p.setAttribute('style', 'margin: 0 0 18px; color: #55565A; max-width: 640px');
      holder.appendChild(p);
    }
    var grid = document.createElement('div');
    grid.setAttribute('style', 'display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px');
    lijst.forEach(function (s) {
      var tile = document.createElement('div');
      tile.className = 'lb-logo-tile';
      var bg = s.tileBackground || '#FFFFFF';
      tile.setAttribute('style', 'height: 100px; background: ' + bg + '; ' + (s.tileBackground ? '' : 'border: 1px solid #D6DDEA; ') + 'border-radius: 14px; display: flex; align-items: center; justify-content: center; padding: 10px 18px; box-sizing: border-box');
      vulLogo(tile, s, false);
      grid.appendChild(tile);
    });
    holder.appendChild(grid);
    return holder;
  }

  var gebouwd = {};   // plek -> opgebouwde inhoud

  // De paginaopbouw (dc-runtime) kan de blokken vervangen; hang de inhoud dan opnieuw in.
  function koppel() {
    Object.keys(gebouwd).forEach(function (plek) {
      var box = document.querySelector('[data-sponsors="' + plek + '"]');
      var inhoud = gebouwd[plek];
      if (!box || inhoud.parentNode === box) return;
      box.innerHTML = '';
      box.appendChild(inhoud);
    });
  }

  function zichtbaarOp(sponsoren, plek, nu) {
    return sponsoren.filter(function (s) {
      var v = s.visibility && s.visibility[plek];
      if (!v) return false;
      var z = LB.zichtbaar(v, nu);
      if (!s.logo || z === null) {
        console.warn('Sponsor overgeslagen op "' + plek + '" (logo of datum ontbreekt/ongeldig):', s.name || s);
        return false;
      }
      return z;
    });
  }

  function toon(sponsoren) {
    var nu = Date.now();
    var boxen = document.querySelectorAll('[data-sponsors]');
    for (var i = 0; i < boxen.length; i++) {
      var box = boxen[i];
      var plek = box.getAttribute('data-sponsors');
      var lijst = zichtbaarOp(sponsoren, plek, nu);
      gebouwd[plek] = box.classList.contains('lb-marquee') ? band(lijst) : tegels(lijst, box);
    }
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
