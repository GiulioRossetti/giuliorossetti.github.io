/* v2026 — animated network backdrop for headers.
 *
 * A small community-structured network (with a few higher-order "hyperedges")
 * floats gently; information cascades spread along its edges, lighting nodes up
 * as they are reached; the pointer nudges nearby nodes and links to them.
 * Theme-aware (reads the site's CSS tokens), paused when off-screen or when the
 * tab is hidden, static when the user prefers reduced motion. No dependencies.
 *
 * Markup: <canvas class="net-canvas" data-net="hero|page"></canvas>
 * The canvas fills its positioned parent; pointer events are read on the parent.
 */
(function () {
  "use strict";
  var canvases = document.querySelectorAll("canvas[data-net]");
  if (!canvases.length || !window.requestAnimationFrame) return;

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

  function token(name, fallback) {
    var v = getComputedStyle(root).getPropertyValue(name).trim();
    return v || fallback;
  }
  function readPalette() {
    return {
      groups: [token("--accent", "#1f4fd1"), token("--teal", "#2f8586"), token("--magenta", "#a624a6"), token("--ochre", "#9a7a1e"), token("--navy", "#00369f")],
      edge: token("--line-strong", "#cfc9bd"),
      faint: token("--text-faint", "#7a8494"),
      bg: token("--bg", "#fbfaf7"),
      dark: root.getAttribute("data-theme") === "dark" ||
        (!root.getAttribute("data-theme") && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    };
  }
  function rgba(color, a) {
    // supports #rrggbb and rgb(...)
    if (color.charAt(0) === "#") {
      var h = color.length === 4 ? color.replace(/#(.)(.)(.)/, "#$1$1$2$2$3$3") : color;
      var n = parseInt(h.slice(1), 16);
      return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
    }
    var m = color.match(/[\d.]+/g);
    return m ? "rgba(" + m[0] + "," + m[1] + "," + m[2] + "," + a + ")" : color;
  }

  // deterministic RNG so the layout is stable between page loads
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  function Net(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.host = canvas.parentElement;
    this.variant = canvas.getAttribute("data-net") || "page";
    this.pal = readPalette();
    this.pointer = { x: -9999, y: -9999, on: false };
    this.visible = true;
    this.cascades = [];
    this.lastSeed = 0;
    this.t0 = performance.now();
    var self = this;

    this.resize();
    if ("ResizeObserver" in window) new ResizeObserver(function () { self.resize(); if (reduce) self.draw(performance.now()); }).observe(this.host);
    else window.addEventListener("resize", function () { self.resize(); });
    // the portrait may move once fonts/images settle: rebuild the layout then
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { self.resize(); });
    window.addEventListener("load", function () { self.resize(); });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { self.visible = e[0].isIntersecting; if (self.visible) self.kick(); }).observe(canvas);
    }
    document.addEventListener("visibilitychange", function () { if (!document.hidden) self.kick(); });

    this.host.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      self.pointer.x = e.clientX - r.left; self.pointer.y = e.clientY - r.top; self.pointer.on = true;
    }, { passive: true });
    this.host.addEventListener("pointerleave", function () { self.pointer.on = false; });

    // follow theme changes
    new MutationObserver(function () { self.pal = readPalette(); if (reduce) self.draw(performance.now()); })
      .observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onMq = function () { self.pal = readPalette(); if (reduce) self.draw(performance.now()); };
      if (mq.addEventListener) mq.addEventListener("change", onMq); else if (mq.addListener) mq.addListener(onMq);
    }

    this.running = false;
    if (reduce) this.draw(this.t0); else this.kick();
  }

  Net.prototype.kick = function () {
    if (this.running || reduce) return;
    this.running = true;
    var self = this;
    requestAnimationFrame(function loop(t) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      self.step(t); self.draw(t);
      requestAnimationFrame(loop);
    });
  };

  Net.prototype.resize = function () {
    var r = this.host.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.W = Math.max(1, r.width); this.H = Math.max(1, r.height);
    this.c.width = Math.round(this.W * dpr); this.c.height = Math.round(this.H * dpr);
    this.c.style.width = this.W + "px"; this.c.style.height = this.H + "px";
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.build();
  };

  // Community anchor positions (px). On the home hero the communities wrap the
  // portrait (read from .hero-photo); elsewhere they sit on the right-hand side.
  Net.prototype.anchors = function () {
    var W = this.W, H = this.H, host = this.host;
    var photo = this.variant === "hero" && host.querySelector(".hero-photo");
    if (photo && W >= 900) {
      var hr = host.getBoundingClientRect(), pr = photo.getBoundingClientRect();
      var x0 = pr.left - hr.left, y0 = pr.top - hr.top, w = pr.width, h = pr.height;
      return [
        [x0 - w * .06, y0 - h * .04], [x0 + w * 1.12, y0 - h * .02], [x0 + w * .55, y0 - h * .24],
        [x0 - w * .1, y0 + h * 1.0], [x0 + w * 1.1, y0 + h * .92], [x0 + w * .55, y0 + h * 1.2]
      ];
    }
    if (this.variant === "hero") return [[.18 * W, .1 * H], [.82 * W, .08 * H], [.5 * W, .2 * H], [.9 * W, .3 * H]];
    return [[.6 * W, .32 * H], [.82 * W, .2 * H], [.72 * W, .78 * H], [.95 * W, .65 * H]];
  };

  Net.prototype.build = function () {
    var W = this.W, rand = rng(11);
    var layout = this.anchors();
    var big = this.variant === "hero" && W >= 900;
    var perGroup = big ? 13 : 9;
    var spread = big ? Math.min(95, W * .068) : Math.min(75, W * .09);
    var nodes = [], edges = [], key = {}, self = this;

    layout.forEach(function (c, g) {
      var start = nodes.length;
      for (var i = 0; i < perGroup; i++) {
        // sunflower layout + jitter: round, evenly filled communities
        var r = spread * Math.sqrt((i + .5) / perGroup), a = i * 2.39996 + rand() * .6;
        var ax = c[0] + Math.cos(a) * r * 1.15 + (rand() - .5) * 10, ay = c[1] + Math.sin(a) * r * .9 + (rand() - .5) * 10;
        nodes.push({ g: g % 5, ax: ax, ay: ay, x: ax, y: ay, vx: 0, vy: 0, ph: rand() * 6.28, sp: .2 + rand() * .35, amp: 5 + rand() * 9, deg: 0, act: 0 });
      }
      for (var i2 = start; i2 < nodes.length; i2++) {
        var ds = [];
        for (var j = start; j < nodes.length; j++) if (j !== i2) ds.push([Math.hypot(nodes[i2].ax - nodes[j].ax, nodes[i2].ay - nodes[j].ay), j]);
        ds.sort(function (p, q) { return p[0] - q[0]; });
        addEdge(i2, ds[0][1], false); addEdge(i2, ds[1][1], false);
        if (rand() < .45) addEdge(i2, ds[2][1], false);
      }
    });
    // weak ties: link each community to its two nearest communities (closest node pairs)
    layout.forEach(function (c, g) {
      var others = layout.map(function (o, k) { return [Math.hypot(o[0] - c[0], o[1] - c[1]), k]; })
        .filter(function (p) { return p[1] !== g; }).sort(function (p, q) { return p[0] - q[0]; }).slice(0, 2);
      others.forEach(function (o) {
        var best = null;
        for (var i = g * perGroup; i < (g + 1) * perGroup; i++)
          for (var j = o[1] * perGroup; j < (o[1] + 1) * perGroup; j++) {
            var d = Math.hypot(nodes[i].ax - nodes[j].ax, nodes[i].ay - nodes[j].ay);
            if (!best || d < best[0]) best = [d, i, j];
          }
        if (best) addEdge(best[1], best[2], true);
      });
    });
    // higher-order interactions: one compact triad per community (node + its 2 nearest)
    var hyper = [];
    for (var h = 0; h < layout.length; h++) {
      if (h % 2) continue;
      var base = h * perGroup + 1, ds2 = [];
      for (var q = h * perGroup; q < (h + 1) * perGroup; q++) if (q !== base) ds2.push([Math.hypot(nodes[base].ax - nodes[q].ax, nodes[base].ay - nodes[q].ay), q]);
      ds2.sort(function (p, r2) { return p[0] - r2[0]; });
      // among the 4 nearest neighbours pick the pair forming the widest triangle
      var bestT = null;
      for (var u1 = 0; u1 < 4; u1++) for (var u2 = u1 + 1; u2 < 4; u2++) {
        var A = nodes[base], B = nodes[ds2[u1][1]], C = nodes[ds2[u2][1]];
        var area = Math.abs((B.ax - A.ax) * (C.ay - A.ay) - (C.ax - A.ax) * (B.ay - A.ay));
        if (!bestT || area > bestT[0]) bestT = [area, ds2[u1][1], ds2[u2][1]];
      }
      hyper.push([base, bestT[1], bestT[2]]);
    }
    function addEdge(a, c, bridge) {
      var id = a < c ? a + "-" + c : c + "-" + a;
      if (a === c || key[id]) return;
      key[id] = edges.length + 1; edges.push({ a: a, b: c, bridge: bridge, hot: 0 }); nodes[a].deg++; nodes[c].deg++;
    }
    this.adj = nodes.map(function () { return []; });
    edges.forEach(function (e, i) { self.adj[e.a].push([e.b, i]); self.adj[e.b].push([e.a, i]); });
    this.nodes = nodes; this.edges = edges; this.hyper = hyper;
    this.cascades = []; this.lastSeed = 0;
  };

  // ---------- information cascades (independent-cascade style) ----------
  Net.prototype.seed = function (t) {
    var start = Math.floor(Math.random() * this.nodes.length);
    var c = { seen: {}, signals: [], color: this.nodes[start].g };
    c.seen[start] = 1;
    this.activate(start, t, c);
    this.cascades.push(c);
    if (this.cascades.length > 3) this.cascades.shift();
  };
  Net.prototype.activate = function (i, t, c) {
    var n = this.nodes[i];
    n.act = t;
    var nb = this.adj[i];
    for (var k = 0; k < nb.length; k++) {
      var j = nb[k][0];
      if (c.seen[j]) continue;
      var e = this.edges[nb[k][1]];
      var p = e.bridge ? .8 : .55;
      if (Math.random() < p) { c.seen[j] = 1; c.signals.push({ from: i, to: j, e: nb[k][1], t0: t + Math.random() * 300, dur: 650 + Math.random() * 500 }); }
    }
  };

  Net.prototype.step = function (t) {
    var dt = (t - this.t0) / 1000, P = this.pointer;
    for (var i = 0; i < this.nodes.length; i++) {
      var n = this.nodes[i];
      // drifting anchor (slow orbit around the home position)
      var tx = n.ax + Math.cos(dt * n.sp + n.ph) * n.amp;
      var ty = n.ay + Math.sin(dt * n.sp * 1.3 + n.ph) * n.amp * .8;
      n.vx += (tx - n.x) * .02; n.vy += (ty - n.y) * .02;
      if (P.on) {
        var dx = n.x - P.x, dy = n.y - P.y, d2 = dx * dx + dy * dy;
        if (d2 < 14400 && d2 > 1) { var f = (1 - Math.sqrt(d2) / 120) * 1.4; n.vx += dx / Math.sqrt(d2) * f; n.vy += dy / Math.sqrt(d2) * f; }
      }
      n.vx *= .86; n.vy *= .86; n.x += n.vx; n.y += n.vy;
    }
    // cascades
    if (t - this.lastSeed > 2200) { this.seed(t); this.lastSeed = t; }
    for (var c = 0; c < this.cascades.length; c++) {
      var cas = this.cascades[c];
      for (var s = cas.signals.length - 1; s >= 0; s--) {
        var sg = cas.signals[s];
        if (t >= sg.t0 + sg.dur) { cas.signals.splice(s, 1); this.edges[sg.e].hot = t; this.activate(sg.to, t, cas); }
      }
    }
  };

  Net.prototype.draw = function (t) {
    var ctx = this.ctx, pal = this.pal, W = this.W, H = this.H, nodes = this.nodes;
    ctx.clearRect(0, 0, W, H);
    var edgeA = pal.dark ? .55 : .85;

    // hyperedges
    for (var h = 0; h < this.hyper.length; h++) {
      var tri = this.hyper[h], col = pal.groups[nodes[tri[0]].g];
      ctx.beginPath();
      ctx.moveTo(nodes[tri[0]].x, nodes[tri[0]].y);
      ctx.lineTo(nodes[tri[1]].x, nodes[tri[1]].y);
      ctx.lineTo(nodes[tri[2]].x, nodes[tri[2]].y);
      ctx.closePath();
      ctx.fillStyle = rgba(col, pal.dark ? .14 : .1);
      ctx.strokeStyle = rgba(col, .22);
      ctx.lineWidth = 10; ctx.lineJoin = "round";
      ctx.stroke(); ctx.fill();
    }

    // edges
    ctx.lineWidth = 1;
    for (var i = 0; i < this.edges.length; i++) {
      var e = this.edges[i], a = nodes[e.a], b = nodes[e.b];
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      var heat = e.hot ? Math.max(0, 1 - (t - e.hot) / 1800) : 0;
      if (heat > 0) { ctx.setLineDash([]); ctx.strokeStyle = rgba(pal.groups[a.g], .25 + .55 * heat); ctx.lineWidth = 1 + 1.4 * heat; }
      else if (e.bridge) { ctx.setLineDash([4, 5]); ctx.strokeStyle = rgba(pal.groups[3], pal.dark ? .5 : .55); ctx.lineWidth = 1.1; }
      else { ctx.setLineDash([]); ctx.strokeStyle = rgba(pal.edge, edgeA); ctx.lineWidth = 1.1; }
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // pointer links
    if (this.pointer.on) {
      var P = this.pointer, near = [];
      for (var k = 0; k < nodes.length; k++) { var d = Math.hypot(nodes[k].x - P.x, nodes[k].y - P.y); if (d < 170) near.push([d, k]); }
      near.sort(function (p, q) { return p[0] - q[0]; });
      for (var m = 0; m < Math.min(4, near.length); m++) {
        var nn = nodes[near[m][1]];
        ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(nn.x, nn.y);
        ctx.strokeStyle = rgba(pal.groups[0], .7 * (1 - near[m][0] / 170)); ctx.lineWidth = 1.3; ctx.stroke(); ctx.lineWidth = 1;
      }
      ctx.beginPath(); ctx.arc(P.x, P.y, 3, 0, 6.283); ctx.fillStyle = rgba(pal.groups[0], .6); ctx.fill();
    }

    // signals travelling along edges
    for (var c = 0; c < this.cascades.length; c++) {
      var cas = this.cascades[c];
      for (var s = 0; s < cas.signals.length; s++) {
        var sg = cas.signals[s];
        if (t < sg.t0) continue;
        var u = Math.min(1, (t - sg.t0) / sg.dur), ue = u < .5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        var A = nodes[sg.from], B = nodes[sg.to];
        var x = A.x + (B.x - A.x) * ue, y = A.y + (B.y - A.y) * ue, col = pal.groups[A.g];
        var grd = ctx.createRadialGradient(x, y, 0, x, y, 13);
        grd.addColorStop(0, rgba(col, .9)); grd.addColorStop(1, rgba(col, 0));
        ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, 13, 0, 6.283); ctx.fill();
        ctx.fillStyle = rgba(col, 1); ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.283); ctx.fill();
      }
    }

    // nodes
    for (var n = 0; n < nodes.length; n++) {
      var nd = nodes[n], col2 = pal.groups[nd.g];
      var r = 3 + Math.min(nd.deg, 7) * .6;
      var age = nd.act ? (t - nd.act) / 1600 : 9;
      if (age < 1) {
        // activation ring
        ctx.beginPath(); ctx.arc(nd.x, nd.y, r + 4 + age * 16, 0, 6.283);
        ctx.strokeStyle = rgba(col2, .5 * (1 - age)); ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1;
      }
      var hub = nd.deg >= 6;
      var lit = age < 2.2 ? 1 - age / 2.2 : 0;
      ctx.beginPath(); ctx.arc(nd.x, nd.y, r + (lit * 1.5), 0, 6.283);
      if (hub || lit > 0) {
        ctx.fillStyle = rgba(col2, hub ? .95 : .35 + .6 * lit); ctx.fill();
      } else {
        ctx.fillStyle = pal.bg; ctx.fill();
        ctx.strokeStyle = rgba(col2, pal.dark ? .75 : .7); ctx.lineWidth = 1.3; ctx.stroke(); ctx.lineWidth = 1;
      }
    }
  };

  for (var i = 0; i < canvases.length; i++) {
    try { new Net(canvases[i]); } catch (err) { if (window.console) console.warn("net.js:", err); }
  }
})();
