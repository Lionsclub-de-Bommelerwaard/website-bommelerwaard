// Gedeelde basisklasse voor alle pagina's. Elke pagina maakt een `class Component extends LBPagina`
// en vult alleen haar eigen renderVals() aan. Pagina's met alleen het menu gebruiken standaard.js.
// DCLogic komt uit /js/dc-runtime.js (state, setState, props, componentDidMount).
class LBPagina extends DCLogic {
  // Het menu (mobiel openen en sluiten). Op elke pagina gelijk.
  menuVals() {
    var self = this;
    var o = !!(this.state && this.state.menuOpen);
    return {
      menuOpen: o,
      menuClosed: !o,
      menuExpanded: o ? 'true' : 'false',
      menuLabel: o ? 'Menu sluiten' : 'Menu openen',
      toggleMenu: function () { self.setState({ menuOpen: !o }); },
      closeMenu: function () { self.setState({ menuOpen: false }); }
    };
  }

  // Fotocarrousel met lightbox.
  //   fotos: lijst van [src, alt, objectPosition]
  //   max (optioneel): toon maximaal zoveel foto's in de carrousel, met een knop "Bekijk alle N foto's";
  //   in de lightbox zijn dan alle foto's te bekijken.
  galleryVals(fotos, max) {
    var self = this;
    var st = this.state || {};
    var lb = (typeof st.lb === 'number') ? st.lb : -1;
    var N = fotos.length;
    var lijst = max ? fotos.slice(0, max) : fotos;
    var photos = lijst.map(function (p, k) {
      return { src: p[0], pos: p[2], label: 'Bekijk foto ' + (k + 1) + ' groot: ' + p[1], open: function () { self.setState({ lb: k }); } };
    });
    var scroll = function (dir) { try { var el = document.getElementById('lb-foto-track'); if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' }); } catch (e) {} };
    var vals = {
      photos: photos, photoCount: N,
      scrollPrev: function () { scroll(-1); }, scrollNext: function () { scroll(1); },
      lbOpen: lb > -1, lbSrc: lb > -1 ? fotos[lb][0] : '', lbAlt: lb > -1 ? fotos[lb][1] : '',
      lbCount: (lb + 1) + ' / ' + N, lbCounter: (lb + 1) + ' / ' + N,
      lbClose: function () { self.setState({ lb: -1 }); },
      lbPrev: function () { self.setState({ lb: (lb - 1 + N) % N }); },
      lbNext: function () { self.setState({ lb: (lb + 1) % N }); }
    };
    if (max) {
      vals.totalLabel = 'Bekijk alle ' + N + ' foto\'s';
      vals.openAll = function () { self.setState({ lb: 0 }); };
    }
    return vals;
  }

  renderVals() { return this.menuVals(); }

  // Koppel een paginacomponent aan #dc-root (de vooraf gerenderde html) en de template #dc-tpl.
  static start(Klasse, props) {
    DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Klasse, props || {});
  }
}
