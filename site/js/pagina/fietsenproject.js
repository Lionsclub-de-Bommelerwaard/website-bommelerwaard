// Paginalogica (menu en eventuele interactie) voor: /fietsenproject/
class Component extends DCLogic {
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
  galleryVals() {
    var self = this;
    var st = this.state || {};
    var lb = (typeof st.lb === 'number') ? st.lb : -1;
    var N = PHOTOS.length;
    var photos = PHOTOS.map(function (p, k) {
      return { src: p[0], pos: p[2], label: 'Bekijk foto ' + (k + 1) + ' groot: ' + p[1], open: function () { self.setState({ lb: k }); } };
    });
    var scroll = function (dir) { try { var el = document.getElementById('lb-foto-track'); if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' }); } catch (e) {} };
    return {
      photos: photos,
      scrollPrev: function () { scroll(-1); }, scrollNext: function () { scroll(1); },
      lbOpen: lb > -1, lbSrc: lb > -1 ? PHOTOS[lb][0] : '', lbAlt: lb > -1 ? PHOTOS[lb][1] : '',
      lbClose: function () { self.setState({ lb: -1 }); },
      lbPrev: function () { self.setState({ lb: (lb - 1 + N) % N }); },
      lbNext: function () { self.setState({ lb: (lb + 1) % N }); }
    };
  }
  renderVals() { return Object.assign(this._rv0(), this.galleryVals()); }
  _rv0() { return this.menuVals(); }
}
var PHOTOS = [
[
"/assets/fietsenproject-07.jpg",
"Overzicht van de werkplaats met een jongen op de voorgrond",
"50% 45%"
],
[
"/assets/fietsenproject-08.jpg",
"Een man in een rood poloshirt wijst iets aan naast een opgehangen fiets",
"50% 30%"
],
[
"/assets/fietsenproject-09.jpg",
"Een man smeert een fiets in de werkplaats",
"50% 40%"
],
[
"/assets/fietsenproject-10.jpg",
"Een lachende vrijwilliger zit tussen de fietsen in de werkplaats",
"50% 30%"
],
[
"/assets/fietsenproject-11.jpg",
"Een man stelt het stuur van een blauwe mountainbike af",
"50% 30%"
],
[
"/assets/fietsenproject-12.jpg",
"Een groep mensen bij grote dozen in de werkplaats",
"50% 40%"
]
];

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
