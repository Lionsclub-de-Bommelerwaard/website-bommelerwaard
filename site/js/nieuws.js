(function () {
  'use strict';

  // Datum: JJJJ-MM-DD of JJJJ-MM-DDTUU:MM. Zonder tijd telt visibleFrom vanaf 0:00 en visibleUntil
  // tot en met 23:59 van die dag. Een tijd bij visibleUntil telt tot en met die minuut.
  function parseDateTime(value, eindVanMinuut) {
    var match = typeof value === 'string'
      ? /^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):([0-5]\d))?$/.exec(value)
      : null;
    if (!match) return null;

    var heeftTijd = match[4] !== undefined;
    var uur = heeftTijd ? +match[4] : (eindVanMinuut ? 23 : 0);
    var minuut = heeftTijd ? +match[5] : (eindVanMinuut ? 59 : 0);
    var date = new Date(+match[1], +match[2] - 1, +match[3], uur, minuut,
      eindVanMinuut ? 59 : 0, eindVanMinuut ? 999 : 0);
    if (date.getMonth() !== +match[2] - 1 || date.getDate() !== +match[3]) return null;
    return date.getTime();
  }

  fetch('/data/nieuws.json', { cache: 'no-cache' })
    .then(function (response) {
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    })
    .then(function (data) {
      if (!data || !Array.isArray(data.items)) {
        throw new Error('nieuws.json moet een items-array bevatten');
      }

      var now = Date.now();
      var activeItems = data.items.filter(function (item) {
        var start = parseDateTime(item.visibleFrom, false);
        var end = parseDateTime(item.visibleUntil, true);
        if (start === null || end === null || start > end) {
          // Alleen dit bericht overslaan; de rest wel tonen.
          console.warn('Nieuwsbericht overgeslagen (datum ontbreekt of is ongeldig):', item.title || item);
          return false;
        }
        return start <= now && now <= end;
      });

      window.ITEMS = activeItems;
      document.dispatchEvent(new CustomEvent('nieuws:geladen', { detail: activeItems }));
      if (window.DC && DC.instance) DC.instance.setState({ newsItemsLoaded: true });
    })
    .catch(function (error) {
      console.error('Nieuwsberichten konden niet uit /data/nieuws.json worden geladen:', error);
    });
})();
