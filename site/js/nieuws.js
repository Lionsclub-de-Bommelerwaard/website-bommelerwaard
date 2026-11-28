(function () {
  'use strict';

  function parseDateTime(value) {
    var match = typeof value === 'string'
      ? /^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):([0-5]\d))?$/.exec(value)
      : null;
    if (!match) return null;

    var parts = match.slice(1).map(function (part) { return part ? Number(part) : 0; });
    var date = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4]);
    if (date.getFullYear() !== parts[0] || date.getMonth() !== parts[1] - 1
        || date.getDate() !== parts[2] || date.getHours() !== parts[3] || date.getMinutes() !== parts[4]) {
      return null;
    }
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
        var start = parseDateTime(item.visibleFrom);
        var end = parseDateTime(item.visibleUntil);
        if (start === null || end === null || start > end) {
          throw new Error('Ongeldig zichtbaarheidsvenster voor nieuwsbericht: ' + (item.title || 'zonder titel'));
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
