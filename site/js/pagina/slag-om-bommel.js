// Paginalogica (menu en eventuele interactie) voor: /slag-om-bommel/
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
"/assets/slag-om-bommel-08.jpg",
"Een golfer slaat af in de Sint-Maartenskerk, voor het orgel",
"50% 55%"
],
[
"/assets/slag-om-bommel-09.jpg",
"Spandoek De Slag om Bommel, stadsgolf voor het goede doel",
"50% 70%"
],
[
"/assets/slag-om-bommel-10.jpg",
"Een lachende flight bij de Ahlmann-pyramide",
"50% 30%"
],
[
"/assets/slag-om-bommel-11.jpg",
"Vier Lions met golfclubs bij de Ahlmann-pyramide",
"50% 40%"
],
[
"/assets/slag-om-bommel-12.jpg",
"Een flight poseert bij de pyramide, met het spandoek van Wonen &amp; Welzijn",
"50% 35%"
],
[
"/assets/slag-om-bommel-13.jpg",
"Drie mannen putten voor het spandoek van Wonen &amp; Welzijn",
"50% 45%"
],
[
"/assets/slag-om-bommel-14.jpg",
"Een deelneemster slaat af in een bloemrijke tuin",
"50% 55%"
],
[
"/assets/slag-om-bommel-15.jpg",
"Een drummer en een accordeonist spelen in de muziektent",
"50% 55%"
],
[
"/assets/slag-om-bommel-16.jpg",
"Lions schrijven deelnemers in aan de inschrijftafel",
"50% 35%"
],
[
"/assets/slag-om-bommel-17.jpg",
"Lions bouwen een ballonnenboog in Lions-blauw en geel",
"50% 40%"
],
[
"/assets/slag-om-bommel-18.jpg",
"De trofee wordt overhandigd aan de winnende flight",
"50% 35%"
]
];

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
