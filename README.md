# website
Website voor Lions club de Bommelerwaard

## Tests
De rekenfuncties in `site/js/hulpfuncties.js` (datums in Nederlandse tijd, zichtbaarheid, nieuwste berichten,
logomaat) en de inhoud van `site/data/nieuws.json` en `site/data/sponsoren.json` hebben unit tests in `tests/`.
Ze gebruiken alleen de ingebouwde testrunner van Node (18 of nieuwer), dus er hoeft niets geïnstalleerd te worden:

```
npm test
```

## Deployen
Een push naar `main` bouwt en publiceert de site naar SmarterASP.net via FTP. De deploy-build kopieert `site/` naar `dist/` en minimaliseert alle JavaScript-bestanden; de bronbestanden blijven leesbaar.

Stel in GitHub repository **Settings → Secrets and variables → Actions** deze repository secrets in:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

Optioneel kan `FTP_SERVER_DIR` worden ingesteld als de FTP-root niet `/wwwroot/` is. De workflow annuleert een eerdere gelijktijdige deploy en controleert na de upload of `https://www.lionsbommelerwaard.nl/` bereikbaar is.

## Opbouw van css en js
- `site/css/interactie.css`: hover, focus en overgangen voor de vaste `lb-`-classes.
- `site/css/basis.css`: regels die op elke pagina gelden.
- `site/css/kop.css` en `site/css/voet.css`: header met menu, en footer.
- `site/css/componenten.css`: opmaak die op meerdere pagina's terugkomt.
- `site/css/paginas/<pagina>.css`: opmaak die alleen op die pagina voorkomt.
- `site/js/pagina/basis.js`: basisklasse `LBPagina` (bouwt op `DCLogic` uit `dc-runtime.js`) met het menu en de fotocarrousel met lightbox.
- `site/js/pagina/<pagina>.js`: `class Component extends LBPagina` met de eigen `renderVals()` van de pagina; `standaard.js` voor pagina's met alleen het menu.

De `st-`-classes vervangen de vroegere style-attributen. Ze staan onder `#dc-root`, zodat ze net als inline styling
voorgaan op de algemene regels. Styling die van een waarde afhangt (zoals `{{accent}}`) staat nog in de html.
