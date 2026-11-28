// Paginalogica (bouwt op LBPagina uit basis.js) voor: /koekeloeretoere/
class Component extends LBPagina {
  renderVals() {
    var self = this;
    var st = this.state || {};
    var extra = st.extra || 0;
    var pers = 2 + extra;
    var gift = st.gift || 0;
    var giftOther = !!st.giftOther;
    var otherVal = st.otherVal || '';
    var wantSp = !!st.wantSp;
    var sp = wantSp ? (st.sp || {}) : {};
    var packs = [['bord', 'Autobordje', 250], ['omslag', 'Omslag routeboek', 175], ['advertentie', 'Advertentie routeboek', 100], ['dranghek', 'Dranghekbanner', 150], ['eigen', 'Eigen reclame', 175], ['hoofd', 'Hoofdsponsor', 1000]];
    var spSum = 0, spN = 0;
    packs.forEach(function (p) { if (sp[p[0]]) { spSum += p[2]; spN++; } });
    var hasMain = !!sp.hoofd;
    var forced = spN > 0;
    var invoice = forced || !!st.invoice;
    var sent = !!st.sent;
    var fmt = function (n) { var e = Math.floor(n), c = Math.round((n - e) * 100); return '€ ' + String(e).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + (c ? ',' + (c < 10 ? '0' : '') + c : ''); };
    var giftAmt = giftOther ? Math.max(0, Math.round(Number(otherVal) || 0)) : gift;
    var kids = st.kids || 0;
    var kidsAmt = kids * 42.5;
    var part = pers * 85;
    var total = part + kidsAmt + spSum + giftAmt;
    var base = 'min-height: 48px; padding: 0 20px; border-radius: 999px; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; ';
    var on = 'background: #00338D; color: #FFFFFF; border: 2px solid #00338D;';
    var off = 'background: #FFFFFF; color: #13203F; border: 2px solid #D6DDEA;';
    var gifts = [[0, 'Geen extra'], [25, '€ 25'], [50, '€ 50'], [100, '€ 100'], ['x', 'Ander bedrag']].map(function (g) {
      var sel = g[0] === 'x' ? giftOther : (!giftOther && gift === g[0]);
      return { label: g[1], pressed: sel ? 'true' : 'false', style: base + (sel ? on : off),
        pick: function () { if (g[0] === 'x') self.setState({ giftOther: true }); else self.setState({ giftOther: false, gift: g[0] }); } };
    });
    var pre = hasMain ? 'vanaf ' : '';
    var parts = ['deelname'];
    if (forced) parts.push('sponsoring');
    if (giftAmt > 0) parts.push('je extra donatie');
    var what = parts.length === 1 ? parts[0] : parts.slice(0, -1).join(', ') + ' en ' + parts[parts.length - 1];
    var payNote = invoice
      ? 'Je ontvangt binnen 2 werkdagen of eerder één factuur op naam van je bedrijf voor ' + what + '. Je inschrijving is definitief zodra de factuur is betaald.'
      : 'Je inschrijving is definitief na betaling van ' + fmt(total) + ' op NL89 RABO 0930 0121 43 t.n.v. Lionsclub De Bommelerwaard, o.v.v. Toertocht Lions 2027 en je naam.';
    var thanks = invoice
      ? 'We sturen je binnen 2 werkdagen of eerder één factuur van ' + pre + fmt(total) + ' op naam van je bedrijf voor ' + what + '.' + (forced ? ' We nemen ook contact met je op over het aanleveren van je logo of advertentie.' : '') + ' De praktische informatie ontvang je per mail.'
      : 'Maak ' + fmt(total) + ' over op NL89 RABO 0930 0121 43 t.n.v. Lionsclub De Bommelerwaard, o.v.v. Toertocht Lions 2027 en je naam. Je ontvangt de praktische informatie per mail.';
    var spons = packs.map(function (p) {
      var on = !!sp[p[0]];
      return { name: p[1], price: (p[0] === 'hoofd' ? 'vanaf ' : '') + fmt(p[2]), on: on,
        toggle: function () { var c = Object.assign({}, sp); c[p[0]] = !c[p[0]]; self.setState({ sp: c }); },
        style: 'display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 14px; border-radius: 12px; font-size: 16px; cursor: pointer; ' + (on ? 'background: #FFF8DD; border: 2px solid #00338D;' : 'background: #FFFFFF; border: 2px solid #D6DDEA;') };
    });
    var sponsLines = packs.filter(function (p) { return sp[p[0]]; }).map(function (p) { return { name: p[1], price: (p[0] === 'hoofd' ? 'vanaf ' : '') + fmt(p[2]) }; });
    return Object.assign(this.menuVals(), this.galleryVals(PHOTOS), {
      accent: this.props.accent ?? '#EBB700',
      extra: extra,
      persLabel: pers === 1 ? '1 persoon' : pers + ' personen',
      kids: kids, hasKids: kids > 0, kidsTxt: fmt(kidsAmt),
      minKids: function () { self.setState({ kids: Math.max(0, kids - 1) }); },
      plusKids: function () { self.setState({ kids: Math.min(6, kids + 1) }); },
      minPers: function () { self.setState({ extra: Math.max(0, extra - 1) }); },
      plusPers: function () { self.setState({ extra: Math.min(6, extra + 1) }); },
      gifts: gifts, giftOther: giftOther, giftOtherVal: otherVal,
      setGiftOther: function (e) { self.setState({ otherVal: e && e.target ? e.target.value : '' }); },
      invoice: invoice, invoiceForced: forced, invoiceFree: !forced,
      wantSp: wantSp, wantBorder: wantSp ? '#00338D' : '#F3D97A',
      toggleWant: function () { self.setState({ wantSp: !wantSp }); },
      spons: spons, sponsLines: sponsLines, hasMain: hasMain,
      totalLabel: 'Totaal',
      toggleInvoice: function () { self.setState({ invoice: !invoice }); },
      invBorder: invoice ? '#00338D' : '#F3D97A', invBg: '#FFFFFF',
      partTxt: fmt(part), giftTxt: fmt(giftAmt), totalTxt: pre + fmt(total),
      payNote: payNote, thanks: thanks,
      sent: sent, notSent: !sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false, extra: 0, kids: 0, gift: 0, giftOther: false, otherVal: '', invoice: false, sp: {}, wantSp: false }); }
    });
  }
}
var PHOTOS = [
[
"/assets/koekeloeretoere-video-startbeeld.png",
"De groene Mercedes-cabrio vertrekt bij de start, met de geblokte vlag",
"50% 55%"
],
[
"/assets/koekeloeretoere-01.jpg",
"Een goudkleurige Opel Manta GT rijdt langs de vrijwilliger met de geblokte vlag",
"50% 50%"
],
[
"/assets/koekeloeretoere-02.jpg",
"Een vrijwilliger buigt zich naar een crèmekleurige Fiat 500 bij de start",
"35% 50%"
],
[
"/assets/koekeloeretoere-03.jpg",
"Een groene MG-roadster komt aanrijden, met de geblokte vlag ernaast",
"45% 55%"
],
[
"/assets/koekeloeretoere-04.jpg",
"Een blauwe Porsche tussen de Lions-vlaggen en strobalen",
"50% 55%"
],
[
"/assets/koekeloeretoere-05.jpg",
"Twee deelnemers voor het Koekeloeretoere-spandoek en de Lions-vlag",
"50% 50%"
],
[
"/assets/koekeloeretoere-06.jpg",
"Een Fiat 500 rijdt voorbij de vrijwilliger met de vlag",
"40% 50%"
],
[
"/assets/koekeloeretoere-07.jpg",
"Een camperbus doet mee en de inzittenden zwaaien",
"50% 55%"
],
[
"/assets/koekeloeretoere-08.jpg",
"Een rode cabrio met lachende bestuurster op de klinkerweg",
"50% 60%"
],
[
"/assets/koekeloeretoere-09.jpg",
"De rode cabrio vertrekt bij Bistro In Petto, met de geblokte vlag",
"50% 55%"
],
[
"/assets/koekeloeretoere-10.jpg",
"Een vrijwilliger wijst de weg aan de inzittenden van de Mercedes-cabrio",
"45% 50%"
],
[
"/assets/koekeloeretoere-11.jpg",
"Een oranje-zwarte Opel Manta bij de start",
"35% 55%"
],
[
"/assets/koekeloeretoere-12.jpg",
"De groene MG-roadster bij de vrijwilliger met de vlag",
"40% 55%"
],
[
"/assets/koekeloeretoere-13.jpg",
"De groene Mercedes-cabrio met lachende inzittenden bij de start",
"50% 55%"
],
[
"/assets/koekeloeretoere-14.jpg",
"Een donkerblauwe Bentley-cabrio vertrekt onder de geblokte vlag",
"60% 55%"
],
[
"/assets/koekeloeretoere-15.jpg",
"Een rij deelnemende auto's onder de bomen bij het Koekeloeretoere-spandoek",
"50% 60%"
],
[
"/assets/nieuws-inschrijving-koekeloeretoere-2027-is-geopend.jpg",
"Twee deelnemers zwaaien vanuit een rode cabrio op het pontje",
"60% 50%"
],
[
"/assets/nieuws-sponsors-gezocht-voor-de-koekeloeretoere-2027.jpg",
"Een rij klassieke auto's geparkeerd langs de dijk",
"70% 50%"
],
[
"/assets/nieuws-koekeloeretoere-2026-bracht-6-184-op.jpg",
"Een groene Morgan-roadster en andere deelnemers op een bomenlaan",
"30% 50%"
]
];

LBPagina.start(Component, {"accent": "#EBB700"});
