// Paginalogica (bouwt op LBPagina uit basis.js) voor: /contact/
class Component extends LBPagina {
  componentDidMount() {
    var self = this;
    this._readTopic = function () {
      try {
        var h = (window.location.hash || '').replace('#onderwerp-', '');
        if (['vraag','fiets','inlever','sponsor','doel','vrijwilliger'].indexOf(h) > -1) self.setState({ topic: h, sent: false });
      } catch (e) {}
    };
    this._readTopic();
    try { window.addEventListener('hashchange', this._readTopic); } catch (e) {}
  }
  componentWillUnmount() {
    try { window.removeEventListener('hashchange', this._readTopic); } catch (e) {}
  }
  renderVals() {
    var self = this;
    var st = this.state || {};
    var topic = st.topic || 'vraag';
    var sent = !!st.sent;
    var list = [
      { id: 'vraag', label: 'Algemene vraag', color: '#00338D', msg: 'Je vraag' },
      { id: 'fiets', label: 'Fietsen laten ophalen', color: '#76BC21', msg: 'Toelichting, bijvoorbeeld wanneer we kunnen komen' },
      { id: 'inlever', label: 'Inleverpunt statiegeld worden', color: '#76BC21', msg: 'Toelichting' },
      { id: 'sponsor', label: 'Sponsor worden', color: '#EBB700', msg: 'Waar denk je aan?' },
      { id: 'doel', label: 'Goed doel voordragen', color: '#F68B1F', msg: 'Beschrijf het doel en de concrete hulpvraag' },
      { id: 'vrijwilliger', label: 'Meehelpen als vrijwilliger', color: '#672666', msg: 'Bij welke actie wil je helpen?' }
    ];
    var cur = list.filter(function (t) { return t.id === topic; })[0];
    var base = 'display: flex; align-items: center; gap: 10px; min-height: 52px; padding: 10px 14px; border-radius: 14px; font: inherit; font-size: 16px; font-weight: 600; text-align: left; cursor: pointer; ';
    var topics = list.map(function (t) {
      var on = t.id === topic;
      return {
        label: t.label,
        pressed: on ? 'true' : 'false',
        style: base + (on ? 'background: #00338D; color: #FFFFFF; border: 2px solid #00338D;' : 'background: #FFFFFF; color: #13203F; border: 2px solid #D6DDEA;'),
        dot: 'flex: none; width: 12px; height: 12px; border-radius: 50%; background: ' + t.color + '; box-shadow: 0 0 0 2px ' + (on ? '#FFFFFF' : 'transparent'),
        pick: function () { self.setState({ topic: t.id }); }
      };
    });
    return Object.assign(this.menuVals(), {
      topics: topics, topicLabel: cur.label.toLowerCase(), msgLabel: cur.msg,
      isFiets: topic === 'fiets', isInlever: topic === 'inlever', isSponsor: topic === 'sponsor', isDoel: topic === 'doel',
      sent: sent, notSent: !sent,
      submit: function (e) { if (e && e.preventDefault) e.preventDefault(); self.setState({ sent: true }); },
      reset: function () { self.setState({ sent: false }); }
    });
  }
}

LBPagina.start(Component);
