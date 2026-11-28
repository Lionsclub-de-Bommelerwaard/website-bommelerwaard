// Paginalogica (bouwt op LBPagina uit basis.js) voor: /slag-om-bommel/
class Component extends LBPagina {
  renderVals() { return Object.assign(this.menuVals(), this.galleryVals(PHOTOS)); }
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

LBPagina.start(Component);
