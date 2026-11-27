/*
 * dc-runtime.js — kleine runtime voor de Claude Design-componenten (.dc.html).
 *
 * Wordt op twee plekken gebruikt:
 *  1. In build.py (via JavaScriptCore of Node) om elke pagina vooraf als statische HTML te renderen.
 *  2. In de browser om dezelfde component "tot leven te wekken": setState() rendert opnieuw
 *     en past alleen de gewijzigde DOM-delen aan (menu, tabs, filters, carrousel, lightbox, formulieren).
 *
 * Ondersteunt: {{ pad.naar.waarde }}, <sc-if value>, <sc-for list as>, on*-attributen, DCLogic met
 * this.state / this.setState / this.props / componentDidMount.
 */
(function (G) {
  'use strict';

  var VOID = { area: 1, base: 1, br: 1, col: 1, embed: 1, hr: 1, img: 1, input: 1, link: 1, meta: 1, param: 1, source: 1, track: 1, wbr: 1 };
  var RAW = { script: 1, style: 1, textarea: 1 };
  var EXPR_ONLY = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var EXPR = /\{\{\s*([^}]+?)\s*\}\}/g;

  // ---------- template-parser (string → boom) ----------
  function parse(src) {
    var root = { t: 'root', kids: [] }, stack = [root], i = 0, n = src.length;
    function top() { return stack[stack.length - 1]; }
    while (i < n) {
      var lt = src.indexOf('<', i);
      if (lt === -1) lt = n;
      if (lt > i) top().kids.push({ t: 'text', v: src.slice(i, lt) });
      if (lt >= n) break;
      if (src.startsWith('<!--', lt)) { var ce = src.indexOf('-->', lt); i = ce === -1 ? n : ce + 3; continue; }
      if (src[lt + 1] === '/') {
        var ge = src.indexOf('>', lt), name = src.slice(lt + 2, ge).trim().toLowerCase();
        for (var s = stack.length - 1; s > 0; s--) { if ((stack[s].ltag || stack[s].tag) === name) { stack.length = s; break; } }
        i = ge + 1; continue;
      }
      if (!/[a-zA-Z!]/.test(src[lt + 1] || '')) { top().kids.push({ t: 'text', v: '<' }); i = lt + 1; continue; }
      // open-tag lezen met attributen (let op quotes)
      var j = lt + 1;
      while (j < n && /[^\s>\/]/.test(src[j])) j++;
      var tag = src.slice(lt + 1, j), attrs = [], selfClose = false;
      while (j < n) {
        while (j < n && /\s/.test(src[j])) j++;
        if (src[j] === '>') { j++; break; }
        if (src[j] === '/' && src[j + 1] === '>') { selfClose = true; j += 2; break; }
        var k = j;
        while (k < n && /[^\s=>\/]/.test(src[k])) k++;
        if (k === j) { j++; continue; }
        var an = src.slice(j, k), av = null;
        j = k;
        while (j < n && /\s/.test(src[j])) j++;
        if (src[j] === '=') {
          j++;
          while (j < n && /\s/.test(src[j])) j++;
          var q = src[j];
          if (q === '"' || q === "'") { var e = src.indexOf(q, j + 1); av = src.slice(j + 1, e); j = e + 1; }
          else { var b = j; while (j < n && /[^\s>]/.test(src[j])) j++; av = src.slice(b, j); }
        }
        attrs.push([an, av]);
      }
      var lname = tag.toLowerCase();
      var node;
      if (lname === 'sc-if') node = { t: 'if', tag: lname, expr: attrVal(attrs, 'value'), kids: [] };
      else if (lname === 'sc-for') node = { t: 'for', tag: lname, expr: attrVal(attrs, 'list'), as: attrVal(attrs, 'as') || 'item', kids: [] };
      else node = { t: 'el', tag: tag, ltag: lname, attrs: attrs, kids: [] };
      top().kids.push(node);
      i = j;
      if (node.t === 'el' && RAW[lname]) {
        var close = src.toLowerCase().indexOf('</' + lname, i);
        if (close === -1) close = n;
        node.kids.push({ t: 'text', v: src.slice(i, close) });
        i = src.indexOf('>', close) + 1 || n;
        continue;
      }
      if (!selfClose && !(node.t === 'el' && VOID[lname])) stack.push(node);
    }
    root.unclosed = stack.slice(1).map(function (s) { return s.ltag || s.tag; });
    return root;
  }
  function attrVal(attrs, name) { for (var a = 0; a < attrs.length; a++) if (attrs[a][0] === name) return attrs[a][1]; return null; }

  // ---------- expressies ----------
  function lookup(expr, scope) {
    if (expr == null) return undefined;
    var m = EXPR_ONLY.exec(expr); var path = (m ? m[1] : expr).trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var p = 0; p < parts.length; p++) { if (v == null) return undefined; v = v[parts[p]]; }
    return v;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function str(v) { return v == null || v === false ? '' : (v === true ? 'true' : String(v)); }

  // ---------- renderer (boom + waarden → HTML) ----------
  function render(tree, vals, handlers) {
    var out = [];
    walk(tree.kids, vals);
    return out.join('');
    function walk(kids, scope) { for (var k = 0; k < kids.length; k++) node(kids[k], scope); }
    function node(nd, scope) {
      if (nd.t === 'text') { out.push(nd.v.indexOf('{{') === -1 ? nd.v : nd.v.replace(EXPR, function (_, e) { return esc(str(lookup(e, scope))); })); return; }
      if (nd.t === 'if') { if (lookup(nd.expr, scope)) walk(nd.kids, scope); return; }
      if (nd.t === 'for') {
        var list = lookup(nd.expr, scope) || [];
        for (var x = 0; x < list.length; x++) { var sc = Object.create(scope); sc[nd.as] = list[x]; walk(nd.kids, sc); }
        return;
      }
      out.push('<' + nd.tag);
      for (var a = 0; a < nd.attrs.length; a++) {
        var an = nd.attrs[a][0], av = nd.attrs[a][1];
        if (/^hint-/.test(an)) continue;
        if (av == null) { out.push(' ' + an); continue; }
        if (/^on[A-Z]/.test(an)) {
          var fn = lookup(av, scope);
          if (typeof fn === 'function') { handlers.push(fn); out.push(' data-dc-' + an.slice(2).toLowerCase() + '="' + (handlers.length - 1) + '"'); }
          continue;
        }
        var whole = EXPR_ONLY.exec(av);
        if (whole) {
          var v = lookup(whole[1], scope);
          if (v === false || v == null) continue;
          if (v === true && !/^(aria-|data-)/.test(an)) { out.push(' ' + an); continue; }
          out.push(' ' + an + '="' + esc(str(v)) + '"');
        } else if (av.indexOf('{{') > -1) {
          out.push(' ' + an + '="' + av.replace(EXPR, function (_, e) { return esc(str(lookup(e, scope))); }) + '"');
        } else out.push(' ' + an + '="' + av + '"');
      }
      out.push('>');
      if (nd.t === 'el' && VOID[nd.ltag]) return;
      walk(nd.kids, scope);
      out.push('</' + nd.tag + '>');
    }
  }

  // ---------- DCLogic (basisklasse voor de componenten) ----------
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (patch) {
    var next = typeof patch === 'function' ? patch(this.state) : patch;
    this.state = Object.assign({}, this.state, next);
    if (this._schedule) this._schedule();
  };
  DCLogic.prototype.renderVals = function () { return {}; };

  // ES-klassen kunnen een functie-"klasse" uitbreiden; maak het een echte class zodat super() werkt.
  var DCLogicClass = (function () {
    try { return new Function('Base', 'return class DCLogic { constructor(p){ Base.call(this, p); } }')(DCLogic); } catch (e) { return DCLogic; }
  })();
  if (DCLogicClass !== DCLogic) {
    DCLogicClass.prototype.setState = DCLogic.prototype.setState;
    DCLogicClass.prototype.renderVals = DCLogic.prototype.renderVals;
  }

  // Vooraf renderen (build): geeft HTML terug.
  function renderStatic(tplSrc, Component, props) {
    var c = new Component(props || {});
    if (!c.state) c.state = {};
    var tree = parse(tplSrc);
    if (tree.unclosed.length) throw new Error('Niet afgesloten tags in ontwerp: ' + tree.unclosed.join(', '));
    return render(tree, c.renderVals() || {}, []);
  }

  // ---------- DOM-morph (alleen in de browser) ----------
  var KEEP_ATTRS = { loading: 1, decoding: 1, fetchpriority: 1 };
  function morphChildren(oldP, newP) {
    var o = oldP.firstChild, nw = newP.firstChild;
    while (nw) {
      var nextNew = nw.nextSibling;
      if (!o) { oldP.appendChild(nw); nw = nextNew; continue; }
      var nextOld = o.nextSibling;
      if (o.nodeType === nw.nodeType && (o.nodeType !== 1 || o.nodeName === nw.nodeName)) {
        if (o.nodeType === 1) { morphAttrs(o, nw); morphChildren(o, nw); }
        else if (o.nodeValue !== nw.nodeValue) o.nodeValue = nw.nodeValue;
      } else {
        oldP.replaceChild(nw, o);
      }
      o = nextOld; nw = nextNew;
    }
    while (o) { var nx = o.nextSibling; oldP.removeChild(o); o = nx; }
  }
  function morphAttrs(o, n) {
    var i, a;
    for (i = o.attributes.length - 1; i >= 0; i--) {
      a = o.attributes[i];
      if (!n.hasAttribute(a.name) && !KEEP_ATTRS[a.name]) o.removeAttribute(a.name);
    }
    for (i = 0; i < n.attributes.length; i++) {
      a = n.attributes[i];
      if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
    }
    if (o.nodeName === 'INPUT') {
      if (o.type === 'checkbox' || o.type === 'radio') { if (o.checked !== n.hasAttribute('checked')) o.checked = n.hasAttribute('checked'); }
      else if (n.hasAttribute('value') && o.value !== n.getAttribute('value')) o.value = n.getAttribute('value');
    }
  }

  var EVENTS = ['click', 'submit', 'change', 'input', 'mouseleave', 'keydown'];

  // In de browser: component koppelen aan de vooraf gerenderde HTML.
  function mount(root, tplSrc, Component, props) {
    var tree = parse(tplSrc), handlers = [], c = new Component(props || {}), pending = false;
    if (!c.state) c.state = {};
    function update() {
      pending = false;
      handlers = [];
      var html = render(tree, c.renderVals() || {}, handlers);
      var tmp = document.createElement('template');
      tmp.innerHTML = html;
      morphChildren(root, tmp.content);
      if (G.DC.afterRender) G.DC.afterRender(root, c);
    }
    c._schedule = function () { if (!pending) { pending = true; (G.queueMicrotask || setTimeout)(update); } };
    EVENTS.forEach(function (type) {
      root.addEventListener(type, function (ev) {
        var attr = 'data-dc-' + type, el = ev.target;
        if (type === 'mouseleave') { if (!el.getAttribute || !el.hasAttribute(attr)) return; }
        else { while (el && el !== root.parentNode && !(el.getAttribute && el.hasAttribute(attr))) el = el.parentNode; if (!el || !el.getAttribute || !el.hasAttribute(attr)) return; }
        var fn = handlers[+el.getAttribute(attr)];
        if (!fn) return;
        if (type === 'submit' && G.DC.onSubmit) {
          ev.preventDefault();
          G.DC.onSubmit(el, c, function () { fn.call(c, ev); });
          return;
        }
        fn.call(c, ev);
      }, type === 'mouseleave');
    });
    update();
    if (typeof c.componentDidMount === 'function') c.componentDidMount();
    G.DC.instance = c;
    return c;
  }

  G.DCLogic = DCLogicClass;
  G.DC = { parse: parse, render: render, renderStatic: renderStatic, mount: mount, DCLogic: DCLogicClass };
})(typeof globalThis !== 'undefined' ? globalThis : this);
