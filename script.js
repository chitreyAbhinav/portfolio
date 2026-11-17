(function () {
  'use strict';
  // ===== CONTACT DETAILS: edit here, nowhere else. Leave a value '' to hide that button. =====
  var CONFIG = {
    email: 'chitreyabhinav2006@gmail.com',
    phone: '+91 91157 58678',
    phoneTel: 'tel:+919115758678',
    whatsapp: '+91 95326 23538',
    whatsappUrl: 'https://wa.me/919532623538',
    linkedin: 'https://www.linkedin.com/in/abhinav-chitrey/',
    github: 'https://github.com/chitreyAbhinav'
  };
  // =============================================================================================
  var d = document, R = d.documentElement, $ = function (s, c) { return (c || d).querySelector(s); }, $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var coarse = matchMedia('(pointer:coarse)').matches;
  var isWeakDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || (navigator.deviceMemory && navigator.deviceMemory <= 4) || coarse || (innerWidth < 860);
  if (isWeakDevice) R.classList.add('low-power');
  var si = 0, st = 0, vel = 0, vf = 0, ps = 0, mxT = .5, myT = .5, mxs = .5, mys = .5, seen = false, skHue = -1, G = { x: .5, y: .4, sc: 1 };
  if (rm) R.classList.add('rm');
  var W = 0, H = 0, y = 0, s = 0, run = false, mobile = false, lastW = 0, lastH = 0;

  // 8 sections color stops
  var STOPS = [
    [[30, 64, 255], [124, 58, 237], [6, 10, 40]],      // hero
    [[34, 211, 238], [37, 99, 235], [4, 24, 48]],      // about
    [[147, 51, 234], [217, 70, 239], [30, 8, 50]],     // skills
    [[16, 185, 129], [6, 182, 212], [4, 24, 36]],      // projects (emerald & cyan cyber)
    [[217, 70, 239], [59, 130, 246], [20, 10, 50]],    // moments
    [[236, 72, 153], [124, 58, 237], [40, 8, 40]],     // future
    [[251, 113, 133], [217, 70, 239], [40, 10, 30]],   // brand
    [[37, 99, 235], [34, 211, 238], [4, 16, 44]]       // contact
  ];
  var ov = STOPS[0], ovW = 0, ovT = 0;
  function clampC(a, lo, hi) { var m = Math.max(a[0], a[1], a[2]) || 1, k = m < lo ? lo / m : m > hi ? hi / m : 1; return a.map(function (x) { return Math.min(255, Math.round(x * k)); }); }
  function pal(e) { var p = e.dataset.c.split('|').map(function (x) { return x.split(',').map(Number); }); return [clampC(p[0], 150, 235), clampC(p[1], 130, 225), clampC(p[2], 0, 60)]; }

  var secs = [$('#home'), $('#about'), $('#skills'), $('#projects'), $('#moments'), $('#future'), $('.brand'), $('#contact')].filter(Boolean);
  var navSecs = ['home', 'about', 'skills', 'projects', 'future', 'contact'].map(function (i) { return d.getElementById(i); }).filter(Boolean);
  var nav = $('#nav'), links = $$('#menu a'), top = $('#top'), spEl = $('#sp'), cur = $('.cur');
  var bgc = $('#bgc'), bx = bgc.getContext('2d'), cv = $('#fx'), cx = cv.getContext('2d'), dots = [], dpr = 1, bs = .25;
  var mom = $('#moments'), track = $('#track'), cards = $$('.mc'), tw = 0, heroPal = pal($('.portrait'));
  var sps = $$('#home [data-sp]'), fls = $$('.fl'), htext = $('.htext'), ring = $('.ring'), stmt = $('.statement'), orbit = $('#orbit');

  var C = { secMid: [], nav: [], mom: null, orbit: null };
  function box(el) { return { t: el ? el.offsetTop : 0, h: el ? el.offsetHeight : 0 }; }
  function story(el) { return { el: el, b: null, items: $$('.beat', el), dots: $$('.dots > *', el), pics: $$('.pic', el) }; }
  var ST = [story($('#about')), story($('#future .jt')), story($('.brand'))];

  var probe = d.createElement('div'); probe.style.cssText = 'position:fixed;left:0;top:0;width:0;height:100svh;visibility:hidden;pointer-events:none'; d.body.appendChild(probe);

  // Skills Orbit
  var sks = $$('.sk'), svg = $('.lines'), core = $('.core'), cn = $('#cn'), cd = $('#cd'), lns = [], activeSk = -1, ow = 0, oh = 0;
  sks.forEach(function (b, i) {
    var l = d.createElementNS('http://www.w3.org/2000/svg', 'line'); svg.appendChild(l); lns.push(l);
    ['pointerenter', 'focus', 'click'].forEach(function (ev) { b.addEventListener(ev, function () { act(i); playBlip(); }); });
  });
  function act(i) {
    activeSk = i; skHue = +sks[i].style.getPropertyValue('--h'); request();
    sks.forEach(function (b, j) { b.classList.toggle('on', i === j); lns[j].classList.toggle('on', i === j); });
    cn.textContent = sks[i].textContent; cd.textContent = sks[i].dataset.d; core.style.setProperty('--h', sks[i].style.getPropertyValue('--h'));
  }
  function layout() {
    if (mobile) { return; }
    var w = ow, h = oh, rot = s * 0.00045, n = sks.length;
    sks.forEach(function (b, i) {
      var a = i / n * 6.2832 - 1.5708 + rot, x = Math.cos(a) * w * 0.37, yy = Math.sin(a) * h * 0.41;
      b.style.transform = 'translate3d(calc(-50% + ' + x.toFixed(1) + 'px),calc(-50% + ' + yy.toFixed(1) + 'px),0)';
      if (i === activeSk) { lns[i].setAttribute('x1', w / 2); lns[i].setAttribute('y1', h / 2); lns[i].setAttribute('x2', w / 2 + x); lns[i].setAttribute('y2', h / 2 + yy); }
    });
  }

  function measure() {
    var ph = probe.offsetHeight; H = ph || innerHeight; W = innerWidth; mobile = W < 860;
    if (track) tw = track.scrollWidth;
    C.secMid = secs.map(function (e) { return e.offsetTop + e.offsetHeight / 2; });
    C.nav = navSecs.map(function (e) { return e.offsetTop; });
    C.fut = box(d.getElementById('future')); C.mom = box(mom); C.orbit = box(orbit);
    if (orbit) { ow = orbit.clientWidth; oh = orbit.clientHeight; }
    ST.forEach(function (o) { if (o.el) o.b = box(o.el); });
    if (W !== lastW || Math.abs(H - lastH) > 150) fx();
    lastW = W; lastH = H;
    request();
  }
  function fx() {
    dpr = (coarse || isWeakDevice) ? 1 : Math.min(devicePixelRatio || 1, 1.25);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    bs = (mobile || isWeakDevice) ? .1 : .18;
    bgc.width = Math.max(32, Math.round(W * bs));
    bgc.height = Math.max(32, Math.round(H * bs));
    var n = (W < 700 || isWeakDevice) ? 14 : 26; dots = [];
    for (var i = 0; i < n; i++) dots.push({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.2, k: .06 + Math.random() * .4, a: .18 + Math.random() * .3 });
  }

  var mix = function (a, b, t) { return a + (b - a) * t; };
  var col = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  function colors() {
    var pos = s + H / 2, mids = C.secMid, i = 0;
    while (i < mids.length - 1 && pos > mids[i + 1]) i++;
    var t = Math.min(1, Math.max(0, (pos - mids[i]) / ((mids[i + 1] || mids[i] + 1) - mids[i])));
    t = t * t * (3 - 2 * t); si = i; st = t; var A = STOPS[i] || STOPS[0], B = STOPS[Math.min(i + 1, STOPS.length - 1)];
    for (var j = 0; j < 3; j++) for (var c = 0; c < 3; c++) col[j][c] = mix(mix(A[j][c], B[j][c], t), ov[j][c], ovW * .85);
  }

  var K = [[.5, .4, 1.7], [.82, .3, 1], [.5, .5, 1.15], [.5, .35, 1], [.5, .16, .85], [.5, .55, 1], [.78, .45, 1.25], [.5, .82, .95]];
  function gemPos() {
    var A = K[si] || K[0], B = K[Math.min(si + 1, K.length - 1)];
    var x = mix(A[0], B[0], st), yy = mix(A[1], B[1], st);
    if (C.fut && C.fut.h) {
      var f = (s + H / 2 - C.fut.t) / C.fut.h, w = f > 0 && f < 1 ? Math.min(1, f * 6, (1 - f) * 6) : 0;
      if (w) { x = mix(x, .12 + .76 * f, w); yy = mix(yy, .62 - .22 * Math.sin(f * 3.1416), w); }
    }
    G.x = x; G.y = yy; G.sc = mix(A[2], B[2], st);
  }

  var lastVars = '', lastT = 0;
  function applyVars(force) {
    var now = performance.now(); if (!force && now - lastT < 120) return;
    var v = col.map(function (a) { return a.map(Math.round).join(','); });
    var key = v.join('|'); if (key === lastVars) return; lastVars = key; lastT = now;
    var br = function (a) { return a.map(function (x) { return Math.min(255, Math.round(x * 1.5)); }).join(','); };
    R.style.setProperty('--c1', v[0]); R.style.setProperty('--c2', v[1]); R.style.setProperty('--c3', v[2]);
    R.style.setProperty('--b1', br(col[0])); R.style.setProperty('--b2', br(col[1]));
  }
  function rgba(a, al) { return 'rgba(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ',' + al + ')'; }
  function orb(x, yy, r, stops) {
    var g = bx.createRadialGradient(x, yy, 0, x, yy, r);
    stops.forEach(function (st) { g.addColorStop(st[0], st[1]); });
    bx.fillStyle = g; bx.fillRect(x - r, yy - r, r * 2, r * 2);
  }
  var lastBgKey = '';
  function drawBg(P) {
    var bgKey = col.map(function (c) { return c.map(Math.round).join(','); }).join('|') + '|' + Math.round(G.x * 40) + '|' + Math.round(G.y * 40);
    if (bgKey === lastBgKey && !matrixActive && !seen) return;
    lastBgKey = bgKey;
    var w = bgc.width, h = bgc.height, k = w / W, vm = Math.max(W, H) * k;
    bx.setTransform(1, 0, 0, 1, 0, 0); bx.globalAlpha = 1;
    var g = bx.createRadialGradient(w / 2, h * 1.2, 0, w / 2, h * 1.2, h * 1.2);
    g.addColorStop(0, rgba(col[2], 1)); g.addColorStop(.7, '#05060f'); g.addColorStop(1, '#05060f');
    bx.fillStyle = g; bx.fillRect(0, 0, w, h);
    var c1 = col[0], c2 = col[1], gx = G.x * W * k, gy = G.y * H * k, vs = vf * W * .05 * k;
    orb(W * (.85 - .5 * P) * k - vs, H * (.85 - .5 * P) * k, vm * .45 * .877, [[0, rgba(c2, .42)], [1, rgba(c2, 0)]]);
    orb(gx + vs, gy, vm * .42 * .877, [[0, rgba(c1, .55)], [.6, rgba(c1, .2)], [1, rgba(c1, 0)]]);
    orb((1 - G.x) * W * k, (1 - G.y * .6) * H * k, vm * .3 * .919, [[0, rgba(c2, .3)], [1, rgba(c2, 0)]]);
    if (seen && fine && !rm && !isWeakDevice) orb(mxs * W * k, mys * H * k, vm * .16, [[0, rgba(c1, .22)], [1, rgba(c1, 0)]]);
  }

  // Matrix Rain Toggle
  var matrixActive = false, matrixDrops = [];
  function drawMatrix() {
    cx.fillStyle = 'rgba(5, 8, 20, 0.12)';
    cx.fillRect(0, 0, W, H);
    cx.fillStyle = '#10b981';
    cx.font = '14px monospace';
    for (var i = 0; i < matrixDrops.length; i++) {
      var char = String.fromCharCode(33 + Math.floor(Math.random() * 94));
      cx.fillText(char, i * 20, matrixDrops[i] * 20);
      if (matrixDrops[i] * 20 > H && Math.random() > 0.975) matrixDrops[i] = 0;
      matrixDrops[i]++;
    }
  }

  function drawFx(P) {
    if (matrixActive) { drawMatrix(); return; }
    cx.setTransform(dpr, 0, 0, dpr, 0, 0); cx.clearRect(0, 0, W, H); cx.fillStyle = '#fff';
    dots.forEach(function (p) {
      var py = ((p.y * H - s * p.k) % H + H) % H; cx.globalAlpha = p.a; cx.beginPath(); cx.arc(p.x * W, py, p.r, 0, 6.2832); cx.fill();
    });
    var gs = Math.max(120, Math.min(240, Math.min(W, H) * .22)) * G.sc / 2;
    var gx = G.x * W, gy = G.y * H, ra = P * 12.56;
    var hx = gx - Math.cos(ra) * gs * .4, hy = gy - Math.sin(ra) * gs * .4;
    var g1 = cx.createRadialGradient(gx, gy, gs * .3, gx, gy, gs * 2.1);
    g1.addColorStop(0, rgba(col[0], .3)); g1.addColorStop(1, rgba(col[0], 0));
    cx.globalAlpha = 1; cx.fillStyle = g1; cx.fillRect(gx - gs * 2.1, gy - gs * 2.1, gs * 4.2, gs * 4.2);
    var wk = skHue >= 0 ? Math.max(0, 1 - Math.abs(s + H / 2 - C.secMid[2]) / (H * 1.1)) : 0;
    if (wk > .02) { var g3 = cx.createRadialGradient(gx, gy, gs * .3, gx, gy, gs * 2.6); g3.addColorStop(0, 'hsla(' + skHue + ',90%,62%,' + (.5 * wk).toFixed(2) + ')'); g3.addColorStop(1, 'hsla(' + skHue + ',90%,62%,0)'); cx.fillStyle = g3; cx.fillRect(gx - gs * 2.6, gy - gs * 2.6, gs * 5.2, gs * 5.2); }
    var g2 = cx.createRadialGradient(hx, hy, 0, gx, gy, gs);
    g2.addColorStop(0, 'rgba(255,255,255,.55)'); g2.addColorStop(.4, 'rgba(255,255,255,.06)'); g2.addColorStop(1, rgba(col[1], .28));
    cx.globalAlpha = .6; cx.fillStyle = g2; cx.beginPath(); cx.arc(gx, gy, gs, 0, 6.2832); cx.fill();
    cx.globalAlpha = 1;
  }
  function prog(b) { return b && b.h ? Math.min(1, Math.max(0, (s - b.t) / (b.h - H))) : 0; }
  function near(b) { return b && s > b.t - H && s < b.t + b.h; }
  function beats(o) {
    if (!o.b) return 0;
    var items = o.items, p = prog(o.b), n = items.length, idx = Math.min(n - 1, Math.floor(p * n));
    items.forEach(function (el, i) {
      var dd = p * n - (i + .5); if (i === 0 && dd < 0) dd = 0; if (i === n - 1 && dd > 0) dd = 0;
      var a = Math.abs(dd), op = Math.max(0, Math.min(1, 1 - (a - .25) * 2.6));
      if (!op && !el._v) return;
      el._v = op > 0;
      el.style.opacity = op.toFixed(3); el.style.visibility = op ? 'visible' : 'hidden';
      el.style.transform = 'translate3d(0,' + (-dd * 70).toFixed(1) + 'px,0) scale(' + (1 - Math.min(a, 1) * .12).toFixed(3) + ')';
    });
    if (idx !== o.idx) {
      o.idx = idx;
      o.dots.forEach(function (e, i) { e.classList.toggle('on', i <= idx); });
      o.pics.forEach(function (e) { e.classList.toggle('on', idx >= +e.dataset.a && idx <= +e.dataset.b); });
    }
    var a2 = null; o.pics.forEach(function (e) { if (e.classList.contains('on')) a2 = e; });
    if (a2) { ov = pal(a2); ovT = 1; }
    return p;
  }
  var lastK = -1;
  function render() {
    colors(); gemPos();
    var P = Math.min(1, s / Math.max(1, C.total - H));
    nav.classList.toggle('sm', s > 60); top.classList.toggle('show', s > 700);
    var pos = s + H * .4, cu = 0; C.nav.forEach(function (t, i) { if (t <= pos) cu = i; });
    if (cu !== C.cu) { C.cu = cu; links.forEach(function (a, i) { a.classList.toggle('on', i === cu); }); }
    ovT = 0; if (!rm && s < H * .8) { ov = heroPal; ovT = .8 * (1 - s / (H * .8)); }
    drawBg(P);
    if (rm) { applyVars(true); return; }
    if (s < H * 1.5) {
      sps.forEach(function (e) { e.style.transform = 'translate3d(0,' + (s * e.dataset.sp * (1 + Math.abs(vf) * .2)).toFixed(1) + 'px,0)' + (e.classList.contains('pw') ? ' scale(' + (1 + s / H * .12).toFixed(3) + ')' : ''); });
      htext.style.opacity = Math.max(0, 1 - s / (H * .6)).toFixed(3);
    }
    spEl.style.transform = 'scaleX(' + P.toFixed(4) + ')';
    if (near(C.mom) && track) {
      var mp = prog(C.mom), k = Math.round(mp * (cards.length - 1));
      track.style.transform = 'translate3d(' + (-mp * (tw - W)).toFixed(1) + 'px,0,0)';
      if (k !== lastK) { lastK = k; cards.forEach(function (e, i) { e.classList.toggle('on', i === k); }); }
      if (cards[k]) { ov = pal(cards[k]); ovT = 1; }
    }
    if (near(ST[0].b)) beats(ST[0]);
    if (near(ST[1].b)) { var p = beats(ST[1]); ring.style.transform = 'translate3d(' + (W * (-.3 + 1.5 * p)).toFixed(0) + 'px,0,0) rotate(' + (p * 540).toFixed(0) + 'deg) scale(' + (.6 + p * .9).toFixed(2) + ')'; }
    if (near(ST[2].b)) {
      var q = prog(ST[2].b), o = Math.min(1, .15 + q * 3, (1 - q) * 3 + .25);
      stmt.style.opacity = o.toFixed(3); stmt.style.transform = 'translate3d(0,0,' + (-200 + q * 260).toFixed(0) + 'px) scale(' + (.8 + q * .25).toFixed(3) + ')';
      fls.forEach(function (e) { e.style.transform = 'translate3d(0,' + ((q - .5) * e.dataset.sp * H * .5).toFixed(0) + 'px,0) rotate(' + (q * 160 * e.dataset.sp).toFixed(0) + 'deg)'; });
    }
    if (!mobile && near(C.orbit)) layout();
    drawFx(P);
    applyVars(false);
  }
  function frame() {
    if (rm || coarse) s = y; else { s = s + (y - s) * .16; if (Math.abs(y - s) < .3) s = y; }
    vel += ((s - ps) - vel) * .2; ps = s; vf = rm ? 0 : Math.max(-1, Math.min(1, vel / 50)); mxs += (mxT - mxs) * .1; mys += (myT - mys) * .1;
    render(); ovW += (ovT - ovW) * .08; if (Math.abs(ovT - ovW) < .01) ovW = ovT;
    if (s !== y || ovW !== ovT || Math.abs(vel) > .05 || matrixActive || (seen && (Math.abs(mxT - mxs) > .002 || Math.abs(myT - mys) > .002))) requestAnimationFrame(frame); else { run = false; colors(); applyVars(true); }
  }
  function request() { if (!run) { run = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', function () { y = scrollY; request(); }, { passive: true });
  var rt; addEventListener('resize', function () { if (innerWidth === lastW && Math.abs(innerHeight - lastH) < 160) return; clearTimeout(rt); rt = setTimeout(measure, 150); });
  addEventListener('orientationchange', function () { clearTimeout(rt); rt = setTimeout(measure, 300); });
  addEventListener('load', function () { C.total = d.body.scrollHeight; measure(); });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { C.total = d.body.scrollHeight; measure(); });

  // Contact links & Phone/WhatsApp synchronization
  [['c-mail', 'mailto:' + CONFIG.email + '?subject=Hello%20Abhinav', CONFIG.email], ['c-wa', CONFIG.whatsappUrl, CONFIG.whatsappUrl], ['c-in', CONFIG.linkedin, CONFIG.linkedin], ['c-gh', CONFIG.github, CONFIG.github]].forEach(function (r) {
    var a = d.getElementById(r[0]); if (!a) return; if (r[2]) a.href = r[1]; else a.hidden = true;
  });
  if (CONFIG.phone) {
    ['top-phone-val', 'bottom-phone-val', 'rm-phone-val'].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) el.textContent = CONFIG.phone;
    });
    if (CONFIG.phoneTel) {
      ['top-phone', 'bottom-phone', 'rm-phone'].forEach(function (id) {
        var el = d.getElementById(id);
        if (el) el.href = CONFIG.phoneTel;
      });
    }
  }
  if (CONFIG.whatsapp) {
    ['top-wa-val', 'bottom-wa-val'].forEach(function (id) {
      var el = d.getElementById(id);
      if (el) el.textContent = 'WhatsApp: ' + CONFIG.whatsapp;
    });
    if (CONFIG.whatsappUrl) {
      ['top-wa', 'bottom-wa', 'rm-wa'].forEach(function (id) {
        var el = d.getElementById(id);
        if (el) el.href = CONFIG.whatsappUrl;
      });
    }
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { run = false; } else { request(); }
  });
  setTimeout(function () { var o = $('.intro-ov'); if (o) o.remove(); }, 1400);

  // Copy email button
  var cp = $('#copy');
  if (cp) cp.addEventListener('click', function () {
    var t = CONFIG.email;
    function done() { cp.textContent = 'Copied ✓'; playClick(); setTimeout(function () { cp.textContent = 'Copy email'; }, 2000); }
    function fb() { var a = d.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; d.body.appendChild(a); a.select(); try { d.execCommand('copy'); done(); } catch (e) {} a.remove(); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(done, fb); else fb();
  });

  // Mobile Burger Menu
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(o) { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); burger.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); playClick(); });
  links.forEach(function (a) { a.addEventListener('click', function () { setMenu(false); playClick(); }); });
  d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  top.addEventListener('click', function () { scrollTo({ top: 0, behavior: rm ? 'auto' : 'smooth' }); playClick(); });

  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = d.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
      e.preventDefault(); scrollTo({ top: t.getBoundingClientRect().top + scrollY, behavior: rm ? 'auto' : 'smooth' });
    });
  });

  // Pointer interactions
  var tilts = $$('[data-tilt]'), mags = $$('.mag');
  if (fine) d.addEventListener('pointermove', function (e) {
    var t = e.target.closest && e.target.closest('.glass,.btn');
    if (t) { var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }
    if (rm || e.pointerType !== 'mouse') return;
    seen = true; mxT = e.clientX / W; myT = e.clientY / H; request();
    cur.style.opacity = 1; cur.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
    var m = e.target.closest('.mag');
    mags.forEach(function (b) { if (b !== m) b.style.transform = ''; });
    if (m) { var q = m.getBoundingClientRect(); m.style.transform = 'translate3d(' + ((e.clientX - q.left - q.width / 2) * .22).toFixed(1) + 'px,' + ((e.clientY - q.top - q.height / 2) * .32).toFixed(1) + 'px,0)'; }
    var tl = e.target.closest('[data-tilt]');
    tilts.forEach(function (b) { if (b !== tl) b.style.transform = ''; });
    if (tl) { var z = tl.getBoundingClientRect(), px = (e.clientX - z.left) / z.width - .5, py = (e.clientY - z.top) / z.height - .5; tl.style.transform = 'perspective(800px) rotateX(' + (-py * 8).toFixed(1) + 'deg) rotateY(' + (px * 10).toFixed(1) + 'deg)'; }
  }, { passive: true });
  d.addEventListener('pointerleave', function () { cur.style.opacity = 0; });

  // =========================================================================
  // 1. SYNTHESIZED WEB AUDIO API SOUND FX (Zero External Files)
  // =========================================================================
  var audioCtx = null, soundOn = false;
  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  function playClick() {
    if (!soundOn) return;
    initAudio();
    var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'sine'; osc.frequency.setValueAtTime(1100, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.035);
  }
  function playBlip() {
    if (!soundOn) return;
    initAudio();
    var osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
    osc.type = 'triangle'; osc.frequency.setValueAtTime(550, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.06);
    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.07);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + 0.075);
  }
  var sndBtn = $('#snd-btn');
  if (sndBtn) sndBtn.addEventListener('click', function () {
    soundOn = !soundOn;
    sndBtn.textContent = soundOn ? '🔊' : '🔇';
    sndBtn.title = soundOn ? 'Audio FX: On' : 'Audio FX: Off';
    if (soundOn) { initAudio(); playClick(); }
  });

  // =========================================================================
  // 2. MODAL CONTROLS (Recruiter Mode, Terminal, Command Palette, Cert)
  // =========================================================================
  window.openModal = function (id) {
    var m = d.getElementById(id);
    if (!m) return;
    m.classList.add('open');
    playClick();
    if (id === 'modal-term') {
      setTimeout(function () { var inp = $('#term-cmd-input'); if (inp) inp.focus(); }, 150);
    }
  };
  window.closeModal = function (id) {
    var m = d.getElementById(id);
    if (m) m.classList.remove('open');
    playClick();
  };
  $$('.modal-overlay').forEach(function (m) {
    m.addEventListener('click', function (e) {
      if (e.target === m) { m.classList.remove('open'); playClick(); }
    });
  });

  var rmBtn = $('#rm-toggle');
  if (rmBtn) rmBtn.addEventListener('click', function () { window.openModal('modal-rm'); });
  var termBtn = $('#term-btn');
  if (termBtn) termBtn.addEventListener('click', function () { window.openModal('modal-term'); });
  $$('.cert-trigger').forEach(function (b) {
    b.addEventListener('click', function () { window.openModal('modal-cert'); });
  });

  // =========================================================================
  // 3. PROJECT FILTERING & MINI-TERMINAL SIMULATOR
  // =========================================================================
  var pFilters = $$('.p-filter'), pCards = $$('.p-card');
  pFilters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      playClick();
      pFilters.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var f = btn.dataset.f;
      pCards.forEach(function (c) {
        var match = f === 'all' || c.dataset.cat === f;
        c.style.display = match ? 'flex' : 'none';
      });
    });
  });

  var SIM_LOGS = {
    workforce: [
      "[+] Initializing WorkforceX Intelligence Engine...",
      "[*] Ingesting department attrition telemetry (SAS Hackathon dataset)...",
      "[+] Training predictive regression model: Epoch 100/100 complete.",
      "[✓] Talent retention probability calculated: 94.2%",
      "[!] High risk flagged: Dept Engineering (Tier-2). Recommended ROI reallocation: +12%",
      "[STATUS] Strategy Decision Matrix exported to /output/decision_matrix.json"
    ],
    audit: [
      "[+] Starting AppSec Automated Security Scan...",
      "[*] Target: Flask Web App (Endpoint: /api/v1/auth)",
      "[!] Auditing OWASP Top 10 compliance rules...",
      "[✓] CSRF Token Protection: ACTIVE (SameSite=Strict)",
      "[✓] SQL Parameterization: SECURE (Prepared statements verified)",
      "[!] ADVISORY: Missing Content-Security-Policy (CSP) Header on /static",
      "[STATUS] Security audit score: 92/100 (Clean - 1 Warning)"
    ],
    hook: [
      "[+] Injecting Windhawk OS Mod DLL (hook_telemetry.dll)...",
      "[*] Resolving target process handle: explorer.exe [PID 1420]",
      "[+] Hooking User32.dll!SetWindowPos API trampoline...",
      "[✓] Memory offset patched: 0x7FFA89210000 -> Redirected",
      "[STATUS] Window telemetry active with 0% CPU overhead."
    ],
    benchmark: [
      "[+] Loading hardware benchmark matrix (SoC, Thermals, Battery)...",
      "[*] Normalizing multi-criteria decision weights...",
      "[✓] Executing TOPSIS algorithm on 14 flagship devices...",
      "[★] Winner Rank #1: Efficiency Score 9.4/10 | Thermals: 36.2°C",
      "[STATUS] Head-to-head comparison chart generated successfully."
    ]
  };

  $$('[data-sim]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.sim;
      var term = d.getElementById('term-' + key);
      if (!term) return;
      playClick();
      term.classList.toggle('open');
      if (term.classList.contains('open')) {
        var body = $('.p-term-body', term);
        body.innerHTML = '<span class="p-term-prompt">&gt; Initializing process...</span>\n';
        var logs = SIM_LOGS[key] || ["[+] Running simulation..."];
        logs.forEach(function (line, idx) {
          setTimeout(function () {
            var colorClass = line.indexOf('[!]') >= 0 ? 'p-term-warn' : line.indexOf('[✓]') >= 0 ? 'p-term-ok' : line.indexOf('[★]') >= 0 ? 'p-term-ok' : 'p-term-prompt';
            body.innerHTML += '<span class="' + colorClass + '">' + line + '</span>\n';
            body.scrollTop = body.scrollHeight;
            playBlip();
          }, (idx + 1) * 350);
        });
      }
    });
  });

  $$('.p-term-close').forEach(function (btn) {
    btn.addEventListener('click', function () {
      btn.closest('.p-term').classList.remove('open');
      playClick();
    });
  });

  // =========================================================================
  // 4. INTERACTIVE SECURITY & CRYPTOGRAPHY PLAYGROUND
  // =========================================================================
  var cTabs = $$('.crypto-tab'), cPanels = $$('.crypto-panel');
  cTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      playClick();
      cTabs.forEach(function (t) { t.classList.remove('active'); });
      cPanels.forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      var p = d.getElementById('cpanel-' + tab.dataset.tab);
      if (p) p.classList.add('active');
    });
  });

  // SHA-256 live computation
  var hashIn = $('#hash-input'), hashOut = $('#hash-output');
  async function updateHash() {
    if (!hashIn || !hashOut) return;
    var val = hashIn.value;
    if (!val) { hashOut.textContent = 'Enter text above to compute SHA-256...'; return; }
    try {
      var buf = new TextEncoder().encode(val);
      var digest = await crypto.subtle.digest('SHA-256', buf);
      var hex = Array.from(new Uint8Array(digest)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      hashOut.textContent = hex;
    } catch (e) {
      hashOut.textContent = 'SHA-256: ' + val;
    }
  }
  var hashTimer = null;
  if (hashIn) {
    hashIn.addEventListener('input', function () {
      clearTimeout(hashTimer);
      hashTimer = setTimeout(updateHash, 40);
    });
    updateHash();
  }

  // Password Entropy & Crack Time
  var pwdIn = $('#pwd-input'), entBar = $('#entropy-bar'), entBits = $('#entropy-bits'), entTime = $('#entropy-time');
  function calcEntropy() {
    if (!pwdIn) return;
    var p = pwdIn.value;
    if (!p) { entBar.style.width = '0%'; entBits.textContent = 'Entropy: 0 bits'; entTime.textContent = 'Time: Instant'; return; }
    var pool = 0;
    if (/[a-z]/.test(p)) pool += 26;
    if (/[A-Z]/.test(p)) pool += 26;
    if (/[0-9]/.test(p)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(p)) pool += 33;
    var bits = Math.round(p.length * (Math.log2(pool || 1)));
    var pct = Math.min(100, Math.round((bits / 85) * 100));
    entBar.style.width = pct + '%';
    if (bits < 35) {
      entBar.style.background = '#ef4444';
      entBits.textContent = 'Entropy: ' + bits + ' bits (Very Weak)';
      entTime.textContent = 'Estimated crack time: Under 1 minute';
    } else if (bits < 60) {
      entBar.style.background = '#f59e0b';
      entBits.textContent = 'Entropy: ' + bits + ' bits (Moderate)';
      entTime.textContent = 'Estimated crack time: A few days';
    } else {
      entBar.style.background = '#10b981';
      entBits.textContent = 'Entropy: ' + bits + ' bits (Very Strong / Cryptographic)';
      entTime.textContent = 'Estimated crack time: Hundreds of Millions of Years';
    }
  }
  var entTimer = null;
  if (pwdIn) {
    pwdIn.addEventListener('input', function () {
      clearTimeout(entTimer);
      entTimer = setTimeout(calcEntropy, 40);
    });
    calcEntropy();
  }

  // Base64 Cyber Encoder
  var b64In = $('#b64-input'), b64Out = $('#b64-output');
  function updateB64() {
    if (!b64In || !b64Out) return;
    try {
      b64Out.textContent = 'Encoded: ' + btoa(b64In.value);
    } catch (e) {
      b64Out.textContent = 'Encoding error: invalid characters';
    }
  }
  if (b64In) { b64In.addEventListener('input', updateB64); updateB64(); }

  // =========================================================================
  // 5. INTERACTIVE CYBER TERMINAL INTERPRETER
  // =========================================================================
  var tInput = $('#term-cmd-input'), tScreen = $('#term-screen');
  function printTerm(text, color) {
    var line = d.createElement('div');
    line.style.color = color || '#cbd5e1';
    line.textContent = text;
    tScreen.appendChild(line);
    tScreen.scrollTop = tScreen.scrollHeight;
  }
  if (tInput) {
    tInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        var raw = tInput.value.trim();
        tInput.value = '';
        if (!raw) return;
        printTerm('visitor@abhinav:~$ ' + raw, '#10b981');
        playClick();
        var cmd = raw.toLowerCase().split(' ')[0];
        var arg = raw.toLowerCase().split(' ')[1] || '';

        switch (cmd) {
          case 'help':
            printTerm('AVAILABLE COMMANDS:', '#38bdf8');
            printTerm('  skills     - Display core 9 technical & analytical skills');
            printTerm('  projects   - List top featured GitHub projects');
            printTerm('  cert       - Show IIT Madras Top 5% NPTEL Credential info');
            printTerm('  run <proj> - Simulate running a project (workforce, audit, hook)');
            printTerm('  matrix     - Toggle green digital background matrix rain');
            printTerm('  contact    - Print contact information and direct links');
            printTerm('  hireme     - Send direct email to Abhinav');
            printTerm('  clear      - Clear terminal window');
            printTerm('  exit       - Close cyber terminal');
            break;
          case 'skills':
            printTerm('[+] 9 CORE SKILLS: Python, Java, Cybersecurity, Ethical Hacking, Network Security, Linux, Problem Solving, Critical Thinking, Adaptability', '#38bdf8');
            break;
          case 'projects':
            printTerm('[+] GITHUB PROJECTS (github.com/chitreyAbhinav):', '#38bdf8');
            printTerm('  • workforce-intelligence: WorkforceX SAS Hackathon Platform (Python)');
            printTerm('  • secure-coding-checklist: Flask OWASP Security Auditor (Python)');
            printTerm('  • windhawk-mods: C++ Low-Level Windows API Hook Mods (C++)');
            printTerm('  • Phone-FaceOff: Multi-criteria benchmark algorithm (JS)');
            break;
          case 'cert':
          case 'nptel':
            printTerm('[★] CREDENTIAL: Cyber Security and Privacy (IIT Madras)', '#fbbf24');
            printTerm('  Score: 87% | Proctored Exam: 61.5/75 | Assignments: 24.91/25');
            printTerm('  Badge: Elite + TOPPER (Top 5% out of 20,949 candidates)');
            printTerm('  Roll No: NPTEL26CS144S1253101583');
            break;
          case 'run':
            if (arg === 'workforce' || arg === 'audit' || arg === 'hook') {
              printTerm('[*] Executing ' + arg + ' module simulation...', '#38bdf8');
              (SIM_LOGS[arg] || []).forEach(function (l) { printTerm(l, '#94a3b8'); });
            } else {
              printTerm('Usage: run <workforce | audit | hook>', '#ef4444');
            }
            break;
          case 'matrix':
            matrixActive = !matrixActive;
            if (matrixActive) {
              matrixDrops = [];
              var cols = Math.floor(W / 20);
              for (var c = 0; c < cols; c++) matrixDrops.push(Math.floor(Math.random() * -50));
              printTerm('[✓] Matrix Rain mode ACTIVE! Check canvas background.', '#10b981');
              request();
            } else {
              printTerm('[!] Matrix Rain mode DISABLED.', '#f59e0b');
              request();
            }
            break;
          case 'contact':
            printTerm('• Email: ' + CONFIG.email, '#38bdf8');
            printTerm('• Call: ' + CONFIG.phone, '#38bdf8');
            printTerm('• WhatsApp: ' + CONFIG.whatsapp, '#38bdf8');
            printTerm('• Locations: Mohali (College) | Prayagraj (Hometown)', '#38bdf8');
            printTerm('• LinkedIn: ' + CONFIG.linkedin, '#38bdf8');
            printTerm('• GitHub: ' + CONFIG.github, '#38bdf8');
            break;
          case 'hireme':
            printTerm('[+] Opening email client to: ' + CONFIG.email, '#10b981');
            window.location.href = 'mailto:' + CONFIG.email + '?subject=Opportunity%20for%20Abhinav%20Chitrey';
            break;
          case 'clear':
            tScreen.innerHTML = '';
            break;
          case 'exit':
            window.closeModal('modal-term');
            break;
          default:
            printTerm("Command not found: '" + cmd + "'. Type 'help' for available commands.", '#ef4444');
        }
      }
    });
  }

  // =========================================================================
  // 6. COMMAND PALETTE (Ctrl+K or Cmd+K) & SHORTCUTS
  // =========================================================================
  d.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      var m = $('#modal-cmd');
      if (m.classList.contains('open')) window.closeModal('modal-cmd'); else { window.openModal('modal-cmd'); setTimeout(function () { var i = $('#cmd-input'); if (i) i.focus(); }, 150); }
    }
    if (e.key === '`' || e.key === '~') {
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        var t = $('#modal-term');
        if (t.classList.contains('open')) window.closeModal('modal-term'); else window.openModal('modal-term');
      }
    }
    if (e.key === 'Escape') {
      $$('.modal-overlay').forEach(function (m) { m.classList.remove('open'); });
    }
  });

  // Command Palette filtering and execution
  var cmdInput = $('#cmd-input'), cmdItems = $$('.cmd-item');
  if (cmdInput) {
    cmdInput.addEventListener('input', function () {
      var query = cmdInput.value.toLowerCase();
      cmdItems.forEach(function (item) {
        var match = item.textContent.toLowerCase().indexOf(query) >= 0;
        item.style.display = match ? 'flex' : 'none';
      });
    });
  }
  cmdItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var act = item.dataset.action;
      window.closeModal('modal-cmd');
      switch (act) {
        case 'rm': window.openModal('modal-rm'); break;
        case 'term': window.openModal('modal-term'); break;
        case 'cert': window.openModal('modal-cert'); break;
        case 'goto':
          var target = d.getElementById(item.dataset.target);
          if (target) scrollTo({ top: target.getBoundingClientRect().top + scrollY, behavior: 'smooth' });
          break;
        case 'copy':
          if (cp) cp.click();
          break;
        case 'gh': window.open(CONFIG.github, '_blank'); break;
        case 'in': window.open(CONFIG.linkedin, '_blank'); break;
      }
    });
  });

  // =========================================================================
  // 7. DEVTOOLS CONSOLE GREETING & EASTER EGGS (F12)
  // =========================================================================
  try {
    console.log(
      "%c[!] SYSTEM ACCESSED: Abhinav Chitrey Security Shell\n" +
      "%c3rd Year B.E. Computer Science @ Chandigarh University\n" +
      "Specializing in Cybersecurity, Ethical Hacking & Python\n\n" +
      "Type %chelp()%c or %chireMe()%c to initiate contact.",
      "color: #22d3ee; font-weight: 800; font-size: 16px; font-family: monospace;",
      "color: #94a3b8; font-size: 12px; font-family: monospace;",
      "color: #10b981; font-weight: bold; font-family: monospace;",
      "color: #94a3b8; font-family: monospace;",
      "color: #10b981; font-weight: bold; font-family: monospace;",
      "color: #94a3b8; font-family: monospace;"
    );
    window.hireMe = function () {
      window.location.href = 'mailto:' + CONFIG.email + '?subject=Interview%20Offer%20for%20Abhinav';
      return "Opening email to " + CONFIG.email + "...";
    };
    window.help = function () {
      return "Commands: hireMe(), cert(), skills(), projects()";
    };
    window.cert = function () {
      return "IIT Madras NPTEL: Cyber Security and Privacy (87% - Top 5% Topper)";
    };
    window.projects = function () {
      return "Repositories: workforce-intelligence, secure-coding-checklist, windhawk-mods, Phone-FaceOff";
    };
  } catch (e) {}

  y = scrollY; s = y; C.total = d.body.scrollHeight; measure(); render();
})();
