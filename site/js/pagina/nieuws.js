// Paginalogica (menu en eventuele interactie) voor: /nieuws/
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
    var cat = st.cat || 'alle';
    var cats = { evenement: ['Evenement', '#E5EDFF', '#00338D'], actie: ['Doorlopende actie', '#DFF1EE', '#00665B'], jongeren: ['Jongeren', '#FDF1C7', '#6B5200'], internationaal: ['Internationaal', '#E3ECF8', '#2B5FA8'] };
    var all = (window.ITEMS || []).map(function (n) {
      var c = cats[n.cat] || ['Nieuws', '#E5EDFF', '#00338D'];
      return Object.assign({}, n, { catLabel: c[0], tagStyle: 'font-size: 13px; font-weight: 700; padding: 4px 12px; border-radius: 999px; background: ' + c[1] + '; color: ' + c[2] });
    });
    var top = all[0];
    var rest = all.slice(1);
    var base = 'min-height: 44px; padding: 0 16px; border-radius: 999px; font: inherit; font-size: 16px; font-weight: 700; cursor: pointer; ';
    var defs = [['alle', 'Alles'], ['evenement', 'Evenementen'], ['actie', 'Doorlopende acties'], ['internationaal', 'Internationaal']];
    var filters = defs.map(function (d) {
      var on = cat === d[0];
      var count = d[0] === 'alle' ? rest.length : rest.filter(function (n) { return n.cat === d[0]; }).length;
      return { label: d[1], count: count, pressed: on ? 'true' : 'false', pick: function () { self.setState({ cat: d[0] }); },
        style: base + (on ? 'background: #00338D; color: #FFFFFF; border: 2px solid #00338D;' : 'background: #FFFFFF; color: #13203F; border: 2px solid #D6DDEA;') };
    }).filter(function (f) { return f.count > 0; });
    var items = cat === 'alle' ? rest : rest.filter(function (n) { return n.cat === cat; });
    return Object.assign(this.menuVals(), { top: top, filters: filters, items: items });
  }
}

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
