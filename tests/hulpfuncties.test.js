// Unit tests voor site/js/hulpfuncties.js. Draaien: `npm test` (of `node --test`).
// Gebruikt alleen de ingebouwde testrunner van Node (versie 18 of nieuwer), geen extra pakketten.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const LB = require('../site/js/hulpfuncties.js');

const iso = (t) => new Date(t).toISOString();

test.describe('laatsteZondagUtc', () => {
  test('begin en einde van de zomertijd in 2026 en 2027', () => {
    assert.equal(iso(LB.laatsteZondagUtc(2026, 2)), '2026-03-29T01:00:00.000Z');
    assert.equal(iso(LB.laatsteZondagUtc(2026, 9)), '2026-10-25T01:00:00.000Z');
    assert.equal(iso(LB.laatsteZondagUtc(2027, 2)), '2027-03-28T01:00:00.000Z');
    assert.equal(iso(LB.laatsteZondagUtc(2027, 9)), '2027-10-31T01:00:00.000Z');
  });

  test('maand waarvan de laatste dag zelf een zondag is', () => {
    // 31 maart 2024 was een zondag.
    assert.equal(iso(LB.laatsteZondagUtc(2024, 2)), '2024-03-31T01:00:00.000Z');
  });
});

test.describe('nederlandseTijd', () => {
  test('wintertijd is UTC+1', () => {
    assert.equal(iso(LB.nederlandseTijd(2026, 10, 28, 16, 0)), '2026-11-28T15:00:00.000Z');
    assert.equal(iso(LB.nederlandseTijd(2027, 0, 1, 0, 0)), '2026-12-31T23:00:00.000Z');
  });

  test('zomertijd is UTC+2', () => {
    assert.equal(iso(LB.nederlandseTijd(2026, 6, 1, 12, 0)), '2026-07-01T10:00:00.000Z');
  });

  test('rond de overgang naar zomertijd (29 maart 2026)', () => {
    assert.equal(iso(LB.nederlandseTijd(2026, 2, 29, 1, 59)), '2026-03-29T00:59:00.000Z');
    assert.equal(iso(LB.nederlandseTijd(2026, 2, 29, 3, 0)), '2026-03-29T01:00:00.000Z');
  });

  test('rond de overgang naar wintertijd (25 oktober 2026)', () => {
    assert.equal(iso(LB.nederlandseTijd(2026, 9, 25, 1, 0)), '2026-10-24T23:00:00.000Z');
    assert.equal(iso(LB.nederlandseTijd(2026, 9, 25, 4, 0)), '2026-10-25T03:00:00.000Z');
  });

  test('hangt niet af van de tijdzone van de computer', () => {
    // De functie gebruikt alleen UTC-rekenwerk; de uitkomst is een vast getal.
    assert.equal(LB.nederlandseTijd(2026, 10, 28, 16, 0), Date.UTC(2026, 10, 28, 15, 0));
  });
});

test.describe('tijdstip', () => {
  test('datum zonder tijd: visibleFrom vanaf 0:00', () => {
    assert.equal(iso(LB.tijdstip('2026-12-31', false)), '2026-12-30T23:00:00.000Z');
  });

  test('datum zonder tijd: visibleUntil tot en met 23:59', () => {
    assert.equal(iso(LB.tijdstip('2026-12-31', true)), '2026-12-31T22:59:59.999Z');
  });

  test('met tijd: visibleFrom precies op die minuut', () => {
    assert.equal(iso(LB.tijdstip('2027-04-18T18:00', false)), '2027-04-18T16:00:00.000Z');
  });

  test('met tijd: visibleUntil tot en met die minuut', () => {
    assert.equal(iso(LB.tijdstip('2027-04-18T18:00', true)), '2027-04-18T16:00:59.999Z');
  });

  test('T00:00 en T23:59 geven hetzelfde als een datum zonder tijd', () => {
    assert.equal(LB.tijdstip('2026-11-28T00:00', false), LB.tijdstip('2026-11-28', false));
    assert.equal(LB.tijdstip('2026-11-28T23:59', true), LB.tijdstip('2026-11-28', true));
  });

  test('schrikkeldag', () => {
    assert.notEqual(LB.tijdstip('2028-02-29', false), null);
    assert.equal(LB.tijdstip('2027-02-29', false), null);
  });

  for (const fout of ['', 'kapot', '2026-13-01', '2026-02-30', '2026-00-10', '2026-1-5',
                      '2026-11-28T24:00', '2026-11-28T12:60', '2026-11-28 12:00',
                      '2026-11-28T12:00:00', null, undefined, 20261128]) {
    test('ongeldig: ' + JSON.stringify(fout), () => {
      assert.equal(LB.tijdstip(fout, false), null);
      assert.equal(LB.tijdstip(fout, true), null);
    });
  }
});

test.describe('zichtbaar', () => {
  const venster = { visibleFrom: '2026-12-01', visibleUntil: '2026-12-31' };
  const nl = (j, m, d, u, mi, s) => LB.nederlandseTijd(j, m - 1, d, u, mi, s || 0);

  test('voor het begin niet zichtbaar', () => {
    assert.equal(LB.zichtbaar(venster, nl(2026, 11, 30, 23, 59, 59)), false);
  });

  test('vanaf 0:00 op de begindag zichtbaar', () => {
    assert.equal(LB.zichtbaar(venster, nl(2026, 12, 1, 0, 0)), true);
  });

  test('tot en met 23:59 op de einddag zichtbaar', () => {
    assert.equal(LB.zichtbaar(venster, nl(2026, 12, 31, 23, 59, 59)), true);
  });

  test('vanaf 0:00 de dag erna niet meer zichtbaar', () => {
    assert.equal(LB.zichtbaar(venster, nl(2027, 1, 1, 0, 0)), false);
  });

  test('met tijden: tot en met de laatste minuut', () => {
    const v = { visibleFrom: '2027-04-18T09:30', visibleUntil: '2027-04-18T18:00' };
    assert.equal(LB.zichtbaar(v, nl(2027, 4, 18, 9, 29, 59)), false);
    assert.equal(LB.zichtbaar(v, nl(2027, 4, 18, 9, 30)), true);
    assert.equal(LB.zichtbaar(v, nl(2027, 4, 18, 18, 0, 59)), true);
    assert.equal(LB.zichtbaar(v, nl(2027, 4, 18, 18, 1)), false);
  });

  test('ongeldig venster geeft null, zodat alleen dat item wordt overgeslagen', () => {
    assert.equal(LB.zichtbaar({ visibleFrom: 'kapot', visibleUntil: '2026-12-31' }, Date.now()), null);
    assert.equal(LB.zichtbaar({ visibleFrom: '2026-12-01' }, Date.now()), null);
    assert.equal(LB.zichtbaar({ visibleFrom: '2026-12-31', visibleUntil: '2026-12-01' }, Date.now()), null);
    assert.equal(LB.zichtbaar(null, Date.now()), null);
  });

  test('begin- en einddag gelijk is geldig', () => {
    assert.equal(LB.zichtbaar({ visibleFrom: '2026-12-05', visibleUntil: '2026-12-05' }, nl(2026, 12, 5, 12, 0)), true);
  });
});

test.describe('nieuwste', () => {
  const items = [
    { title: 'a', visibleFrom: '2026-01-01T00:00' },
    { title: 'b', visibleFrom: '2026-11-28T00:00' },
    { title: 'c', visibleFrom: '2026-06-15' },
    { title: 'd', visibleFrom: '2026-11-28T00:00' },
    { title: 'e', visibleFrom: '2026-11-28T10:00' },
    { title: 'f', visibleFrom: '2025-12-31' }
  ];
  const titels = (l) => l.map((n) => n.title).join('');

  test('nieuwste eerst; bij gelijke datum de volgorde in de lijst', () => {
    assert.equal(titels(LB.nieuwste(items, 10)), 'ebdcaf');
  });

  test('maximaal het gevraagde aantal', () => {
    assert.equal(titels(LB.nieuwste(items, 5)), 'ebdca');
  });

  test('met en zonder tijd worden goed vergeleken', () => {
    const l = [{ title: 'x', visibleFrom: '2026-11-28' }, { title: 'y', visibleFrom: '2026-11-28T08:00' }];
    assert.equal(titels(LB.nieuwste(l, 2)), 'yx');
  });

  test('past de oorspronkelijke lijst niet aan', () => {
    const kopie = items.slice();
    LB.nieuwste(items, 3);
    assert.deepEqual(items, kopie);
  });

  test('lege lijst', () => {
    assert.deepEqual(LB.nieuwste([], 5), []);
  });
});

test.describe('logoMaat', () => {
  const maat = (w, h) => LB.logoMaat(w, h, 6800, 160, 80);

  test('logo binnen de grenzen krijgt het afgesproken oppervlak', () => {
    // 2:1 geeft 117 x 58, ongeveer 6800 px².
    assert.deepEqual(maat(400, 200), { breed: 117, hoog: 58 });
  });

  test('vierkant logo wordt begrensd op 80 hoog', () => {
    // Zonder grens zou het 82 x 82 worden.
    assert.deepEqual(maat(500, 500), { breed: 80, hoog: 80 });
  });

  test('breed logo wordt begrensd op de maximale breedte', () => {
    assert.deepEqual(maat(1000, 100), { breed: 160, hoog: 16 });
  });

  test('hoog logo wordt begrensd op de maximale hoogte', () => {
    assert.deepEqual(maat(100, 1000), { breed: 8, hoog: 80 });
  });

  test('verhouding blijft gelijk', () => {
    const m = maat(578, 300);
    assert.ok(Math.abs(m.breed / m.hoog - 578 / 300) < 0.05);
  });

  test('onbruikbare afmeting geeft null', () => {
    assert.equal(maat(0, 0), null);
    assert.equal(maat(100, 0), null);
    assert.equal(maat(0, 100), null);
  });
});

test.describe('escapeHtml', () => {
  test('zet speciale tekens om', () => {
    assert.equal(LB.escapeHtml('<a href="x">Jan & \'Piet\'</a>'),
      '&lt;a href=&quot;x&quot;&gt;Jan &amp; &#39;Piet&#39;&lt;/a&gt;');
  });

  test('null en undefined worden een lege tekst', () => {
    assert.equal(LB.escapeHtml(null), '');
    assert.equal(LB.escapeHtml(undefined), '');
  });
});
