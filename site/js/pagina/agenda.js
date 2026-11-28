// Paginalogica (menu en eventuele interactie) voor: /agenda/
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
    var days = null;
    try {
      var now = new Date();
      var t = new Date(2027, 3, 18);
      var d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      days = Math.round((t - d0) / 86400000);
    } catch (e) {}
    var txt = days === null || days < 0 ? '' : (days === 0 ? 'Vandaag!' : (days === 1 ? 'Morgen!' : 'Nog ' + days + ' dagen'));
    return Object.assign(this.menuVals(), { hasCountdown: !!txt, countdown: txt });
  }
}

DC.mount(document.getElementById('dc-root'), document.getElementById('dc-tpl').textContent, Component, {});
