// Paginalogica (bouwt op LBPagina uit basis.js) voor: /jeugduitwisseling/
class Component extends LBPagina {
  renderVals() { return Object.assign(this.menuVals(), this.galleryVals(PHOTOS)); }
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

LBPagina.start(Component);
