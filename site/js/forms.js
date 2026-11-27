/*
 * forms.js — verstuurt de formulieren uit het ontwerp naar een formulierverwerker.
 *
 * Het ontwerp toont na verzenden alleen een bedankmelding. Dit script stuurt de ingevulde
 * gegevens eerst naar het adres in window.LIONS_FORMS.endpoint (zie forms-config.js) en toont
 * pas daarna de bedankmelding uit het ontwerp. Zonder endpoint gedraagt het zich als het ontwerp.
 */
(function () {
  'use strict';
  var cfg = window.LIONS_FORMS || {};

  window.DC = window.DC || {};
  window.DC.onSubmit = function (form, component, done) {
    if (!cfg.endpoint) {
      if (window.console) console.warn('[forms] Geen endpoint ingesteld in forms-config.js; formulier niet verstuurd.');
      done();
      return;
    }
    var data = new FormData(form);
    data.append('_pagina', document.title);
    data.append('_url', location.href);
    var heading = form.closest('section') && form.closest('section').querySelector('h2');
    if (heading) data.append('_formulier', heading.textContent.trim());
    if (component && component.state && component.state.topic) data.append('_onderwerp', component.state.topic);

    var btn = form.querySelector('[type="submit"]');
    if (btn) { btn.disabled = true; btn.setAttribute('aria-busy', 'true'); }

    fetch(cfg.endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); done(); })
      .catch(function () {
        if (btn) { btn.disabled = false; btn.removeAttribute('aria-busy'); }
        alert('Het versturen is helaas niet gelukt. Probeer het later opnieuw of mail naar ' + (cfg.fallbackEmail || 'contact@lionsbommelerwaard.nl') + '.');
      });
  };
})();
