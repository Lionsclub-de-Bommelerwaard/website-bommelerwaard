// Paginalogica (bouwt op LBPagina uit basis.js) voor: /agenda/
class Component extends LBPagina {
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

LBPagina.start(Component);
