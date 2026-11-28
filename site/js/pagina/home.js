// Paginalogica (menu en eventuele interactie) voor: /
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
  constructor(props) {
    super(props);
    this.state = { filter: 'alles' };
  }
  renderVals() {
    var accent = this.props.accent ?? '#EBB700';
    var self = this;
    var cats = {
      evenement: { label: 'Evenement', bg: '#E5EDFF', fg: '#00338D' },
      actie: { label: 'Doorlopende actie', bg: '#DFF1EE', fg: '#00665B' },
      jongeren: { label: 'Jongeren', bg: '#FDF1C7', fg: '#6B5200' },
      internationaal: { label: 'Internationaal', bg: '#E3ECF8', fg: '#2B5FA8' }
    };
    var all = [
      { key: 'evenement', title: 'De Slag om Bommel', text: 'Stadsgolf langs 10 ludieke holes in en om de Zaltbommelse binnenstad.', photo: '', img: '/assets/slag-om-bommel-08.jpg', alt: 'Een golfer slaat af in de Sint-Maartenskerk', pos: '50% 40%', cta: 'Uitslag en foto\u2019s', href: '/slag-om-bommel/' },
      { key: 'evenement', title: 'Koekeloeretoere', text: 'De gezelligste toertocht van Nederland, met jaarlijks zo’n 60 auto’s.', photo: 'Foto: toertocht', img: '/assets/nieuws-inschrijving-koekeloeretoere-2027-is-geopend.jpg', alt: 'Twee deelnemers zwaaien vanuit een rode cabrio op het pontje tijdens de Koekeloeretoere', cta: 'Inschrijven voor 2027', href: '/koekeloeretoere/' },
      { key: 'evenement', title: 'Varen met ouderen', text: 'Een middag op de Maas met lunch en muziek voor 150 ouderen uit de regio.', photo: 'Foto: boot op de Maas', img: '/assets/home-02.jpg', alt: 'Ouderen gaan aan boord van de rondvaartboot voor de vaartocht', cta: 'Meer over de vaartocht', href: '/varen-met-ouderen/' },
      { key: 'actie', cause: 'Kerndoel milieu', causeColor: '#76BC21', title: 'Statiegeldactie', text: 'Lege flesjes en blikjes inleveren bij bedrijven of De Kringloop.', photo: '', img: '/assets/nieuws-statiegeldactie-730-voor-robin-in-actie-tegen-spierziekte.jpg', alt: 'Twee Lions-inzamelcontainers met oranje deksel en statiegeldsticker', pos: '50% 55%', cta: 'Vind een inleverpunt', href: '/statiegeldactie/' },
      { key: 'actie', cause: 'Kerndoel zicht', causeColor: '#672666', title: 'Vreemd en oud geld', text: 'Lever oude munten en buitenlandse biljetten in bij de zuil in PLUS Rossum, voor oogzorg.', photo: 'Foto: inzamelzuil', img: '/assets/vreemd-en-oud-geld-01.jpg', alt: 'De Lions-inzamelzuil voor vreemd en oud geld', pos: '50% 65%', cta: 'Zo werkt het', href: '/vreemd-en-oud-geld/' },
      { key: 'actie', cause: 'Kerndoel milieu', causeColor: '#76BC21', title: 'Fietsenproject', text: 'Oude fietsen krijgen een tweede leven bij de sociale fietswerkplaats van Elliz in Company.', photo: '', img: '/assets/fietsenproject-06.jpg', alt: 'Een jongen helpt een fiets opknappen in de werkplaats', pos: '50% 35%', cta: 'Fiets laten ophalen', href: '/fietsenproject/' },
      { key: 'actie', cause: 'Kerndoel milieu', causeColor: '#76BC21', title: 'Waaljutten', text: 'Elke maand houden we samen de uiterwaarden schoon.', photo: '', img: '/assets/waaljutten-01.jpg', alt: 'Twee Lions met volle vuilniszakken op de dijk langs de Waal', pos: '62% 60%', cta: 'Help een keer mee', href: '/waaljutten/' },
      { key: 'jongeren', title: 'Jeugduitwisseling', text: 'Drie weken naar het buitenland voor jongeren van 17 tot 23 jaar.', photo: 'Foto: jongeren op zomerkamp', img: '/assets/jeugduitwisseling-02.jpg', alt: 'Twee uitwisselingsstudenten maken een selfie op een rondvaartboot bij de molens', pos: '50% 60%', cta: 'Aanmelden en meer info', href: '/jeugduitwisseling/' },
      { key: 'internationaal', title: 'Kacheltjes voor Oekra\u00efne', text: 'Al ruim \u20ac29.715 gedoneerd voor warmte in Oekra\u00efense huishoudens.', photo: '', img: '/assets/kacheltjes-oekraine-01.jpg', alt: 'Pallets met kacheltjes worden uitgeladen in Oekra\u00efne', pos: '45% 50%', cta: 'Lees het verhaal', href: '/kacheltjes-oekraine/' }
    ];
    var f = this.state.filter;
    var opts = [
      { id: 'alles', label: 'Alles' },
      { id: 'evenement', label: 'Evenementen' },
      { id: 'actie', label: 'Doorlopende acties' },
      { id: 'jongeren', label: 'Jongeren' },
      { id: 'internationaal', label: 'Internationaal' }
    ];
    var base = 'min-height: 44px; padding: 10px 18px; border-radius: 999px; font: inherit; font-size: 16px; font-weight: 600; cursor: pointer; ';
    var filters = opts.map(function (o) {
      var on = o.id === f;
      return {
        label: o.label,
        pressed: on ? 'true' : 'false',
        style: base + (on ? 'background: #00338D; color: #FFFFFF; border: 1px solid #00338D;' : 'background: #FFFFFF; color: #13203F; border: 1px solid #C9D0DF;'),
        pick: function () { self.setState({ filter: o.id }); }
      };
    });
    var cards = all.filter(function (c) { return f === 'alles' || c.key === f; }).map(function (c) {
      var k = cats[c.key];
      return Object.assign({ pos: '60% 50%' }, c, { noImg: !c.img, cat: k.label, tagBg: k.bg, tagFg: k.fg });
    });
    return Object.assign(this.menuVals(), { accent: accent, filters: filters, cards: cards });
  }
}

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {"accent": "#EBB700"});
