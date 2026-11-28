// Paginalogica (bouwt op LBPagina uit basis.js) voor: /statiegeldactie/
class Component extends LBPagina {
  renderVals() {
    var self = this;
    var sent = !!(this.state && this.state.sent);
    return Object.assign(this.menuVals(), {
      sent: sent, notSent: !sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false }); }
    });
  }
}

LBPagina.start(Component);
