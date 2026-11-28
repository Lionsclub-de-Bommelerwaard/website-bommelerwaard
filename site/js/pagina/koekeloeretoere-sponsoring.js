// Paginalogica (menu en eventuele interactie) voor: /koekeloeretoere/sponsoring/
class Component extends DCLogic {
  menuVals() {
    var self = this;
    var o = !!(this.state && this.state.menuOpen);
    return {
      menuOpen: o, menuClosed: !o,
      menuExpanded: o ? 'true' : 'false',
      menuLabel: o ? 'Menu sluiten' : 'Menu openen',
      toggleMenu: function () { self.setState({ menuOpen: !o }); },
      closeMenu: function () { self.setState({ menuOpen: false }); }
    };
  }
  renderVals() {
    var self = this;
    var st = this.state || {};
    var chosen = st.chosen || {};
    var ride = st.ride || '';
    var sent = !!st.sent;
    var list = [
      { id: 'bord', name: 'Autobordje', text: 'Je logo op een bordje op elke deelnemende auto. De hele dag zichtbaar onderweg.', price: 250, icon: 'M3 13l2-5.5A2 2 0 0 1 6.9 6h10.2a2 2 0 0 1 1.9 1.5L21 13v4a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-11v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM3 13h18M7 16h.01M17 16h.01' },
      { id: 'omslag', name: 'Omslag routeboek', text: 'Je logo plus een advertentie van een kwart pagina op de omslag van het routeboek.', price: 175, icon: 'M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2zM4 17a2 2 0 0 1 2-2h12M8 7h6M8 10h4' },
      { id: 'advertentie', name: 'Advertentie routeboek', text: 'Een advertentie van een kwart pagina tussen de routebeschrijvingen.', price: 100, icon: 'M5 3h14v18H5zM8 7h8M8 11h8M8 15h4' },
      { id: 'dranghek', name: 'Dranghekbanner', text: 'Een grote banner met je logo op het dranghek bij start en finish, inclusief drukwerk.', price: 150, icon: 'M3 6h18v8H3zM5 14v5M19 14v5M3 19h4M17 19h4M7 10h10' },
      { id: 'eigen', name: 'Eigen reclame', text: 'Rij mee met een auto vol reclame, of zet je eigen beachflag of banner neer.', price: 175, icon: 'M6 21V3M6 4c4-2 6 3 12 1v8c-6 2-8-3-12-1' }
    ];
    var main = { id: 'hoofd', name: 'Hoofdsponsor', price: 1000 };
    var all = list.concat([main]);
    var fmt = function (n) { return '€ ' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var toggle = function (id) { return function () { var c = Object.assign({}, chosen); c[id] = !c[id]; self.setState({ chosen: c }); }; };
    var chk = function (on, dark) {
      return 'display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 999px; font-size: 14px; font-weight: 700; white-space: nowrap; ' +
        (on ? 'background: #EBB700; color: #00338D;' : (dark ? 'background: transparent; color: #FFFFFF; border: 2px solid rgba(255,255,255,.6);' : 'background: #E8EDF5; color: #00338D;'));
    };
    var packs = list.map(function (p) {
      var on = !!chosen[p.id];
      return {
        name: p.name, text: p.text, price: fmt(p.price), icon: p.icon,
        pressed: on ? 'true' : 'false', toggle: toggle(p.id),
        checkLabel: on ? '✓ Gekozen' : '+ Kies dit pakket',
        check: chk(on, false),
        iconWrap: 'width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; background: ' + (on ? '#FDF1C7' : '#E8EDF5'),
        style: 'display: flex; flex-direction: column; gap: 10px; text-align: left; font: inherit; color: #13203F; cursor: pointer; padding: 24px; border-radius: 20px; background: #FFFFFF; ' +
          (on ? 'border: 3px solid #EBB700; box-shadow: 0 10px 24px rgba(235,183,0,.25);' : 'border: 3px solid #D6DDEA;')
      };
    });
    var mOn = !!chosen.hoofd;
    var mainV = {
      pressed: mOn ? 'true' : 'false', toggle: toggle('hoofd'),
      checkLabel: mOn ? '✓ Gekozen' : '+ Kies hoofdsponsorschap', check: chk(mOn, true),
      style: 'margin-top: 18px; width: 100%; display: flex; flex-wrap: wrap; gap: 24px; align-items: center; text-align: left; font: inherit; color: #FFFFFF; cursor: pointer; padding: 30px; border-radius: 22px; background: #00338D; ' +
        (mOn ? 'border: 3px solid #EBB700; box-shadow: 0 12px 30px rgba(0,51,141,.3);' : 'border: 3px solid #00338D;')
    };
    var checks = all.map(function (p) {
      var on = !!chosen[p.id];
      return {
        name: p.name, price: p.id === 'hoofd' ? 'vanaf ' + fmt(p.price) : fmt(p.price), on: on, toggle: toggle(p.id),
        style: 'display: flex; align-items: center; gap: 10px; min-height: 48px; padding: 8px 14px; border-radius: 12px; font-size: 16px; cursor: pointer; ' +
          (on ? 'background: #FFF8DD; border: 2px solid #EBB700;' : 'background: #FFFFFF; border: 2px solid #D6DDEA;')
      };
    });
    var sum = 0, n = 0;
    all.forEach(function (p) { if (chosen[p.id]) { sum += p.price; n++; } });
    var total = (mOn ? 'vanaf ' : '') + fmt(sum);
    var rideBase = 'min-height: 48px; padding: 0 20px; border-radius: 999px; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; ';
    var rides = [['ja', 'Ja, we rijden mee'], ['nee', 'Nee'], ['weet', 'Weet ik nog niet']].map(function (r) {
      var on = ride === r[0];
      return { label: r[1], pressed: on ? 'true' : 'false', pick: function () { self.setState({ ride: r[0] }); },
        style: rideBase + (on ? 'background: #00338D; color: #FFFFFF; border: 2px solid #00338D;' : 'background: #FFFFFF; color: #13203F; border: 2px solid #D6DDEA;') };
    });
    return Object.assign(this.menuVals(), {
      packs: packs, main: mainV, checks: checks, total: total,
      noneChosen: n === 0, someChosen: n > 0, rides: rides,
      sent: sent, notSent: !sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false, chosen: {}, ride: '' }); }
    });
  }
}

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
