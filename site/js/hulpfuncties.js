// Gedeelde rekenfuncties voor nieuws.js, home-nieuws.js en sponsoren.js.
// Ze raken de pagina niet aan, zodat ze los te testen zijn (zie tests/ en `npm test`).
// In de browser staan ze op window.LB; in Node via require().
(function (root) {
  'use strict';

  var UUR = 3600000;
  var DAG = 24 * UUR;

  // Tijdstip (ms sinds 1970, UTC) van de laatste zondag van een maand, om 01:00 UTC.
  // maand telt vanaf 0 (0 = januari).
  function laatsteZondagUtc(jaar, maand) {
    var d = new Date(Date.UTC(jaar, maand + 1, 0, 1));   // laatste dag van de maand, 01:00 UTC
    return d.getTime() - d.getUTCDay() * DAG;
  }

  // Nederlandse tijd (Europe/Amsterdam) naar een tijdstip, onafhankelijk van de tijdzone van de bezoeker.
  // Zomertijd (UTC+2) loopt van de laatste zondag van maart tot de laatste zondag van oktober,
  // telkens om 01:00 UTC; daarbuiten wintertijd (UTC+1).
  function nederlandseTijd(jaar, maand, dag, uur, minuut, sec, ms) {
    var alsUtc = Date.UTC(jaar, maand, dag, uur || 0, minuut || 0, sec || 0, ms || 0);
    var zomer = alsUtc - 2 * UUR;
    var j = new Date(zomer).getUTCFullYear();
    var isZomer = zomer >= laatsteZondagUtc(j, 2) && zomer < laatsteZondagUtc(j, 9);
    return isZomer ? zomer : alsUtc - UUR;
  }

  // Datum uit de json, altijd in Nederlandse tijd: JJJJ-MM-DD of JJJJ-MM-DDTUU:MM.
  // eind = false (visibleFrom): zonder tijd vanaf 0:00.
  // eind = true (visibleUntil): zonder tijd tot en met 23:59, met tijd tot en met die minuut.
  // Geeft null bij een ongeldige waarde.
  function tijdstip(value, eind) {
    var m = typeof value === 'string'
      ? /^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):([0-5]\d))?$/.exec(value)
      : null;
    if (!m) return null;
    var jaar = +m[1], maand = +m[2] - 1, dag = +m[3];
    var check = new Date(Date.UTC(jaar, maand, dag));
    if (check.getUTCMonth() !== maand || check.getUTCDate() !== dag) return null;
    var heeftTijd = m[4] !== undefined;
    return nederlandseTijd(jaar, maand, dag,
      heeftTijd ? +m[4] : (eind ? 23 : 0),
      heeftTijd ? +m[5] : (eind ? 59 : 0),
      eind ? 59 : 0,
      eind ? 999 : 0);
  }

  // Is iets met { visibleFrom, visibleUntil } zichtbaar op tijdstip nu?
  // Geeft true of false, of null als een datum ontbreekt, ongeldig is of het einde voor het begin ligt.
  function zichtbaar(venster, nu) {
    if (!venster) return null;
    var start = tijdstip(venster.visibleFrom, false);
    var eind = tijdstip(venster.visibleUntil, true);
    if (start === null || eind === null || start > eind) return null;
    return start <= nu && nu <= eind;
  }

  // De max nieuwste berichten: op visibleFrom, nieuwste eerst; bij gelijke datum de volgorde in de lijst.
  function nieuwste(items, max) {
    return items
      .map(function (n, i) { return { n: n, i: i, t: tijdstip(n.visibleFrom, false) }; })
      .sort(function (a, b) {
        var ta = a.t === null ? -Infinity : a.t, tb = b.t === null ? -Infinity : b.t;
        return ta < tb ? 1 : ta > tb ? -1 : a.i - b.i;
      })
      .slice(0, max)
      .map(function (x) { return x.n; });
  }

  // Afmeting van een sponsorlogo: elk logo krijgt ongeveer even veel oppervlak, binnen een maximale
  // breedte en hoogte. Geeft { breed, hoog } in hele pixels, of null bij een onbruikbare afmeting.
  function logoMaat(natBreed, natHoog, oppervlak, maxBreed, maxHoog) {
    var r = natBreed / natHoog;
    if (!r || !isFinite(r)) return null;
    var w = Math.sqrt(oppervlak * r), h = w / r;
    if (w > maxBreed) { w = maxBreed; h = w / r; }
    if (h > maxHoog) { h = maxHoog; w = h * r; }
    return { breed: Math.round(w), hoog: Math.round(h) };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  var LB = {
    laatsteZondagUtc: laatsteZondagUtc,
    nederlandseTijd: nederlandseTijd,
    tijdstip: tijdstip,
    zichtbaar: zichtbaar,
    nieuwste: nieuwste,
    logoMaat: logoMaat,
    escapeHtml: escapeHtml
  };
  if (typeof module === 'object' && module.exports) module.exports = LB;
  else root.LB = LB;
})(typeof window !== 'undefined' ? window : this);
