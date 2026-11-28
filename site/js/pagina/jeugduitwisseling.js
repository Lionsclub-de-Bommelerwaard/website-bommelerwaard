// Paginalogica (menu en eventuele interactie) voor: /jeugduitwisseling/
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
"/assets/jeugduitwisseling-03.jpg",
"Jongeren kijken hoe een klompenmaker een klomp maakt",
"50% 35%"
],
[
"/assets/jeugduitwisseling-04.jpg",
"Twee jongeren op trialmotoren op een boomstam",
"50% 50%"
],
[
"/assets/jeugduitwisseling-05.jpg",
"Een uitwisselingsstudent leert koeien scheren op een boerderij",
"50% 30%"
],
[
"/assets/jeugduitwisseling-06.jpg",
"Een uitwisselingsstudent op een paard, geholpen door twee vrouwen",
"50% 50%"
],
[
"/assets/jeugduitwisseling-07.jpg",
"Een Lion en een gast steken hun duim op bij de barbecue",
"50% 35%"
],
[
"/assets/jeugduitwisseling-08.jpg",
"Jongeren zwaaien vanaf een zeilboot",
"50% 50%"
],
[
"/assets/jeugduitwisseling-09.jpg",
"Jongeren hangen aan een klimtoestel tijdens een spel in de tuin",
"50% 50%"
],
[
"/assets/jeugduitwisseling-02.jpg",
"Uitwisselingsstudenten op een rondvaartboot bij de molens",
"50% 50%"
]
];

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
