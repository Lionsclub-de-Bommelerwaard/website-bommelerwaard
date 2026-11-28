# website
Website voor Lions club de Bommelerwaard

## Tests
De rekenfuncties in `site/js/hulpfuncties.js` (datums in Nederlandse tijd, zichtbaarheid, nieuwste berichten,
logomaat) en de inhoud van `site/data/nieuws.json` en `site/data/sponsoren.json` hebben unit tests in `tests/`.
Ze gebruiken alleen de ingebouwde testrunner van Node (18 of nieuwer), dus er hoeft niets geïnstalleerd te worden:

```
npm test
```
