(function () {
  'use strict';

  // Datums gelden als Nederlandse tijd; zie LB.zichtbaar in hulpfuncties.js.

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
        var z = LB.zichtbaar(item, now);
        if (z === null) {
          // Alleen dit bericht overslaan; de rest wel tonen.
          console.warn('Nieuwsbericht overgeslagen (datum ontbreekt of is ongeldig):', item.title || item);
          return false;
        }
        return z;
      });

      window.ITEMS = activeItems;
      document.dispatchEvent(new CustomEvent('nieuws:geladen', { detail: activeItems }));
      if (window.DC && DC.instance) DC.instance.setState({ newsItemsLoaded: true });
    })
    .catch(function (error) {
      console.error('Nieuwsberichten konden niet uit /data/nieuws.json worden geladen:', error);
    });
})();
