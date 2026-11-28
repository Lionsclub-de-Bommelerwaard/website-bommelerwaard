// Paginalogica (bouwt op LBPagina uit basis.js) voor: /varen-met-ouderen/
class Component extends LBPagina {
  renderVals() { return Object.assign(this._rv0(), this.galleryVals(PHOTOS, 24)); }
  _rv0() {
    var self = this;
    var sent = !!(this.state && this.state.sent);
    return Object.assign(this.menuVals(), {
      sent: sent, notSent: !sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false }); }
    });
  }
}
var PHOTOS = [
[
"/assets/varen-met-ouderen-09.jpg",
"De rondvaartboot vaart over de Maas",
"50% 50%"
],
[
"/assets/varen-met-ouderen-10.jpg",
"Gasten komen lachend van boord",
"50% 40%"
],
[
"/assets/varen-met-ouderen-03.jpg",
"Een gast danst enthousiast mee met de accordeonist",
"55% 35%"
],
[
"/assets/varen-met-ouderen-11.jpg",
"Met de armen wijd op de voorplecht, richting de brug",
"50% 50%"
],
[
"/assets/varen-met-ouderen-12.jpg",
"Een Lion lacht met een dienblad vol toetjes",
"50% 35%"
],
[
"/assets/varen-met-ouderen-13.jpg",
"Een selfie van een Lion met een lachende gast",
"50% 40%"
],
[
"/assets/varen-met-ouderen-14.jpg",
"De accordeonist speelt tussen de tafels",
"50% 40%"
],
[
"/assets/varen-met-ouderen-15.jpg",
"Een kus op de wang bij de haven",
"50% 35%"
],
[
"/assets/varen-met-ouderen-16.jpg",
"Een Lion neemt een toefje slagroom",
"50% 40%"
],
[
"/assets/varen-met-ouderen-17.jpg",
"Lions in schort steken hun duim op bij de boot",
"50% 50%"
],
[
"/assets/varen-met-ouderen-18.jpg",
"Een Lion duwt een gast in rolstoel over de steiger",
"50% 40%"
],
[
"/assets/varen-met-ouderen-19.jpg",
"Gasten lopen over de versierde loopbrug",
"50% 60%"
],
[
"/assets/varen-met-ouderen-20.jpg",
"Een Lion maakt een praatje met een gast en haar toetje",
"50% 40%"
],
[
"/assets/varen-met-ouderen-21.jpg",
"Een begeleidster met kapiteinspet proost aan het raam",
"50% 35%"
],
[
"/assets/varen-met-ouderen-22.jpg",
"Een stralende gast op het achterdek",
"50% 40%"
],
[
"/assets/varen-met-ouderen-23.jpg",
"Een lachende heer met zijn begeleidster",
"50% 35%"
],
[
"/assets/varen-met-ouderen-24.jpg",
"Een lachende Lion met een dienblad vol drankjes en toetjes",
"50% 35%"
],
[
"/assets/varen-met-ouderen-25.jpg",
"Gasten aan tafel in de salon met uitzicht op de Maas",
"50% 50%"
],
[
"/assets/varen-met-ouderen-26.jpg",
"Een stralende gast komt van boord",
"50% 40%"
],
[
"/assets/varen-met-ouderen-27.jpg",
"De schipper in het stuurhuis",
"50% 50%"
],
[
"/assets/varen-met-ouderen-28.jpg",
"Een Lion en een gast wang aan wang voor de boot",
"50% 40%"
],
[
"/assets/varen-met-ouderen-29.jpg",
"Lions helpen een dame met rollator over de loopbrug",
"50% 40%"
],
[
"/assets/varen-met-ouderen-30.jpg",
"Een lachende Lion met een gast op zijn rollator bij de haven",
"50% 30%"
],
[
"/assets/varen-met-ouderen-31.jpg",
"Een Lion serveert soep aan boord",
"50% 50%"
],
[
"/assets/varen-met-ouderen-32.jpg",
"Een oudere heer en een vrijwilligster lachen samen bij de boot",
"50% 50%"
],
[
"/assets/varen-met-ouderen-33.jpg",
"De lachende accordeonist met strohoed in de salon van de Columbus",
"60% 40%"
],
[
"/assets/varen-met-ouderen-34.jpg",
"De accordeonist loopt langs de tafels in de volle salon",
"40% 45%"
],
[
"/assets/varen-met-ouderen-35.jpg",
"De accordeonist speelt voor een tafel gasten met uitzicht op de Maas",
"50% 50%"
],
[
"/assets/varen-met-ouderen-36.jpg",
"De accordeonist voor de Columbus naast de vlag Lions helpen! De Bommelerwaard",
"50% 35%"
],
[
"/assets/varen-met-ouderen-37.jpg",
"Vijf lachende deelnemers voor de boot",
"50% 50%"
],
[
"/assets/varen-met-ouderen-38.jpg",
"Het stuurwiel in de stuurhut met uitzicht op de Maas en de brug",
"50% 50%"
],
[
"/assets/varen-met-ouderen-05.jpg",
"Een dame met rollator loopt over de versierde loopplank",
"50% 30%"
],
[
"/assets/varen-met-ouderen-39.jpg",
"Een lachende Lion brengt een dienblad met glazen rond",
"50% 25%"
],
[
"/assets/varen-met-ouderen-40.jpg",
"Lachend echtpaar voor de Columbus",
"50% 30%"
],
[
"/assets/varen-met-ouderen-41.jpg",
"Een Lion duwt een dame in rolstoel over de steiger",
"50% 40%"
],
[
"/assets/varen-met-ouderen-42.jpg",
"Een dame in rolstoel danst met een gast aan boord",
"50% 35%"
],
[
"/assets/varen-met-ouderen-43.jpg",
"Een dame in rolstoel geniet van een toetje aan boord",
"50% 35%"
],
[
"/assets/varen-met-ouderen-44.jpg",
"Een lachende heer met wandelstok bij de steiger",
"50% 30%"
],
[
"/assets/varen-met-ouderen-45.jpg",
"Twee gasten en een Lion voor de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-46.jpg",
"De volle salon aan boord",
"50% 50%"
],
[
"/assets/varen-met-ouderen-47.jpg",
"Twee lachende dames op de steiger",
"50% 40%"
],
[
"/assets/varen-met-ouderen-48.jpg",
"Een Lion gaat rond met eten in de volle salon",
"50% 50%"
],
[
"/assets/varen-met-ouderen-49.jpg",
"Lachende gasten op de loopplank",
"40% 40%"
],
[
"/assets/varen-met-ouderen-50.jpg",
"Twee dames bij de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-51.jpg",
"Een dame met bril voor de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-52.jpg",
"Gasten komen van boord bij de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-53.jpg",
"Een gast in rolstoel steekt zijn duim op",
"50% 40%"
],
[
"/assets/varen-met-ouderen-54.jpg",
"Een heer voor de Columbus terwijl gasten met rollator aan boord gaan",
"50% 40%"
],
[
"/assets/varen-met-ouderen-55.jpg",
"Een Lion in schort met twee gasten voor de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-56.jpg",
"Een heer in elektrische rolstoel met zijn begeleidster",
"50% 40%"
],
[
"/assets/varen-met-ouderen-57.jpg",
"Een lachende dame op de steiger",
"50% 40%"
],
[
"/assets/varen-met-ouderen-58.jpg",
"Een glas fris en een toetje met uitzicht op de Maas",
"50% 50%"
],
[
"/assets/varen-met-ouderen-59.jpg",
"Gasten en een Lion zwaaien bij de haven",
"50% 35%"
],
[
"/assets/varen-met-ouderen-60.jpg",
"Een gast in rolstoel met begeleiders op de steiger",
"50% 35%"
],
[
"/assets/varen-met-ouderen-61.jpg",
"Drie lachende dames bij de haven",
"50% 40%"
],
[
"/assets/varen-met-ouderen-62.jpg",
"Een lachende dame met begeleidster voor de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-63.jpg",
"Gasten gearmd van boord",
"50% 40%"
],
[
"/assets/varen-met-ouderen-64.jpg",
"Een groep lachende gasten voor de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-65.jpg",
"Een dame gearmd met haar begeleidster",
"50% 35%"
],
[
"/assets/varen-met-ouderen-66.jpg",
"Twee heren voor de Columbus",
"50% 35%"
],
[
"/assets/varen-met-ouderen-67.jpg",
"Drie gasten op de steiger",
"50% 40%"
],
[
"/assets/varen-met-ouderen-68.jpg",
"Twee heren van boord",
"50% 35%"
],
[
"/assets/varen-met-ouderen-69.jpg",
"Een lachende dame bij de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-70.jpg",
"Een gast voor de Columbus terwijl anderen van boord gaan",
"50% 35%"
],
[
"/assets/varen-met-ouderen-71.jpg",
"Een Lion in schort met een dienblad bij de haven",
"50% 30%"
],
[
"/assets/varen-met-ouderen-72.jpg",
"Een Lion in schort met twee gasten",
"50% 35%"
],
[
"/assets/varen-met-ouderen-73.jpg",
"Gasten lopen over de steiger",
"50% 50%"
],
[
"/assets/varen-met-ouderen-74.jpg",
"Een dame met rollator over de versierde steiger",
"50% 35%"
],
[
"/assets/varen-met-ouderen-75.jpg",
"Een begeleidster met een lachende dame voor de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-76.jpg",
"Een lachend echtpaar voor de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-77.jpg",
"Een Lion achter de bar steekt zijn duim op",
"50% 40%"
],
[
"/assets/varen-met-ouderen-78.jpg",
"Een heer en dame met Lions op de achtergrond bij de steiger",
"50% 35%"
],
[
"/assets/varen-met-ouderen-79.jpg",
"Twee dames gearmd voor de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-80.jpg",
"Een lachende dame en heer op de loopplank",
"50% 35%"
],
[
"/assets/varen-met-ouderen-81.jpg",
"Drie lachende dames voor de Columbus",
"50% 40%"
],
[
"/assets/varen-met-ouderen-82.jpg",
"Een Lion met een gast in rolstoel en zijn vrouw",
"50% 40%"
],
[
"/assets/varen-met-ouderen-83.jpg",
"Lions achter de bar aan boord",
"50% 45%"
],
[
"/assets/varen-met-ouderen-84.jpg",
"Een gast met pet en zonnebril met een Lion",
"50% 30%"
],
[
"/assets/varen-met-ouderen-85.jpg",
"Twee dames met rollator en een Lion bij de steiger",
"50% 35%"
],
[
"/assets/varen-met-ouderen-86.jpg",
"Gasten komen van boord, met een hapje in de hand",
"50% 40%"
],
[
"/assets/varen-met-ouderen-87.jpg",
"Drie lachende dames voor de boot",
"50% 40%"
],
[
"/assets/varen-met-ouderen-88.jpg",
"Twee heren komen van boord",
"50% 40%"
],
[
"/assets/varen-met-ouderen-89.jpg",
"Het stuurhuis met uitzicht op de Maas",
"50% 50%"
],
[
"/assets/varen-met-ouderen-90.jpg",
"Een begeleider met een lachende dame met hoed",
"50% 35%"
],
[
"/assets/varen-met-ouderen-91.jpg",
"Een Lion met twee gasten bij de haven",
"50% 30%"
],
[
"/assets/varen-met-ouderen-92.jpg",
"Een gast en haar begeleidster lachen samen aan tafel",
"50% 40%"
],
[
"/assets/varen-met-ouderen-93.jpg",
"Een Lion in geel shirt bij de boot",
"50% 30%"
],
[
"/assets/varen-met-ouderen-94.jpg",
"Gasten aan tafel in de salon",
"50% 50%"
],
[
"/assets/varen-met-ouderen-95.jpg",
"Een gast in rolstoel met haar begeleider voor de boot",
"50% 35%"
],
[
"/assets/varen-met-ouderen-96.jpg",
"Twee dames proosten aan boord",
"50% 40%"
],
[
"/assets/varen-met-ouderen-97.jpg",
"De soep wordt opgeschept",
"50% 40%"
],
[
"/assets/varen-met-ouderen-98.jpg",
"Lions met dienbladen op de trap",
"50% 35%"
],
[
"/assets/varen-met-ouderen-99.jpg",
"Een gast en haar begeleider op de loopplank",
"50% 35%"
],
[
"/assets/varen-met-ouderen-100.jpg",
"Een grote tafel gasten aan de koffie",
"50% 50%"
],
[
"/assets/varen-met-ouderen-101.jpg",
"Twee dames met hun begeleidster aan tafel bij het raam",
"50% 50%"
],
[
"/assets/varen-met-ouderen-102.jpg",
"Een begeleidster en een lachende gast bij de boot",
"50% 30%"
],
[
"/assets/varen-met-ouderen-103.jpg",
"Er worden broodjes rondgedeeld aan boord",
"50% 50%"
],
[
"/assets/varen-met-ouderen-104.jpg",
"Een gast met kapiteinspet",
"50% 30%"
],
[
"/assets/varen-met-ouderen-105.jpg",
"Gasten gaan aan boord van de versierde Columbus",
"50% 50%"
],
[
"/assets/varen-met-ouderen-106.jpg",
"De schipper en een Lion op de loopbrug",
"50% 40%"
],
[
"/assets/varen-met-ouderen-107.jpg",
"Lions aan een statafel met bitterballen",
"50% 40%"
],
[
"/assets/varen-met-ouderen-108.jpg",
"Gasten aan tafel kijken verrast op",
"50% 45%"
],
[
"/assets/varen-met-ouderen-109.jpg",
"Drie gasten aan tafel bij het raam",
"50% 35%"
],
[
"/assets/varen-met-ouderen-110.jpg",
"Een gast met haar familie aan tafel",
"50% 35%"
],
[
"/assets/varen-met-ouderen-111.jpg",
"Een Lion tilt een lachende gast op",
"50% 35%"
]
];

LBPagina.start(Component);
