// Paginalogica (menu en eventuele interactie) voor: /kacheltjes-oekraine/, /over-ons/, /privacy/, /vreemd-en-oud-geld/, /waaljutten/
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
  renderVals() { return this.menuVals(); }
}

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
