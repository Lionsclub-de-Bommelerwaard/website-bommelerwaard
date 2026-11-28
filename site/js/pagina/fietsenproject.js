// Paginalogica (bouwt op LBPagina uit basis.js) voor: /fietsenproject/
class Component extends LBPagina {
  renderVals() { return Object.assign(this.menuVals(), this.galleryVals(PHOTOS)); }
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

LBPagina.start(Component);
