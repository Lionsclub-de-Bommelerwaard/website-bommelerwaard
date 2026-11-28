// Controleert nieuws.json en sponsoren.json: geldige datums, bestaande plaatjes en bekende plekken.
// Zo zie je een tikfout in de json al voordat hij op de site staat.
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const LB = require('../site/js/hulpfuncties.js');

const SITE = path.join(__dirname, '..', 'site');
const lees = (bestand) => JSON.parse(fs.readFileSync(path.join(SITE, 'data', bestand), 'utf8'));
const bestaat = (url) => fs.existsSync(path.join(SITE, url.replace(/^\//, '')));

test.describe('nieuws.json', () => {
  const data = lees('nieuws.json');

  test('heeft een items-lijst', () => {
    assert.ok(Array.isArray(data.items) && data.items.length > 0);
  });

  for (const [i, n] of (data.items || []).entries()) {
    const naam = 'bericht ' + (i + 1) + ': ' + (n.title || '(zonder titel)');
    test(naam, () => {
      assert.ok(n.title, 'title ontbreekt');
      assert.notEqual(LB.zichtbaar(n, Date.now()), null,
        'visibleFrom/visibleUntil ongeldig of einde voor begin: ' + n.visibleFrom + ' / ' + n.visibleUntil);
      if (n.img && n.img.startsWith('/')) assert.ok(bestaat(n.img), 'plaatje bestaat niet: ' + n.img);
    });
  }
});

test.describe('sponsoren.json', () => {
  const data = lees('sponsoren.json');
  const PLEKKEN = ['home', 'koekeloeretoere', 'kacheltjes'];

  test('heeft een sponsors-lijst', () => {
    assert.ok(Array.isArray(data.sponsors) && data.sponsors.length > 0);
  });

  test('geen dubbele namen', () => {
    const namen = data.sponsors.map((s) => s.name);
    const dubbel = namen.filter((n, i) => namen.indexOf(n) !== i);
    assert.deepEqual(dubbel, []);
  });

  for (const s of data.sponsors || []) {
    test(s.name || '(zonder naam)', () => {
      assert.ok(s.name, 'name ontbreekt');
      assert.ok(s.logo, 'logo ontbreekt');
      assert.ok(bestaat(s.logo), 'logo bestaat niet: ' + s.logo);
      if (s.url) assert.match(s.url, /^https?:\/\//, 'url moet met http:// of https:// beginnen');
      if (s.tileBackground) assert.match(s.tileBackground, /^#[0-9A-Fa-f]{6}$/, 'tileBackground moet #RRGGBB zijn');
      assert.ok(s.visibility && typeof s.visibility === 'object', 'visibility ontbreekt');
      for (const [plek, v] of Object.entries(s.visibility)) {
        assert.ok(PLEKKEN.includes(plek), 'onbekende plek: ' + plek);
        assert.notEqual(LB.zichtbaar(v, Date.now()), null,
          plek + ': visibleFrom/visibleUntil ongeldig of einde voor begin: ' + v.visibleFrom + ' / ' + v.visibleUntil);
      }
    });
  }
});
