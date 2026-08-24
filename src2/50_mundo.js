// ============================================================
//  MUNDO: caminar, hablar, el aguante
// ============================================================
let modo = 'titulo';
let dlg = null;
let fade = { v: 0, dir: 0, cb: null };

// ---- cuadro de texto ----
function armarPaginas(l) {
  const p = [];
  for (const x of [].concat(l)) {
    const w = wrapText(x, 142);
    for (let i = 0; i < w.length; i += 2) p.push(w.slice(i, i + 2));
  }
  return p;
}
function decir(l, cb) { dlg = { pgs: armarPaginas(l), p: 0, ch: 0, cb: cb || null, op: null, sel: 0, t: 0 }; modo = 'dialogo'; }
function preguntar(l, ops, cb) { dlg = { pgs: armarPaginas(l), p: 0, ch: 0, op: ops, sel: 0, fin: cb, t: 0 }; modo = 'dialogo'; }
function updDlg() {
  const d = dlg, pg = d.pgs[d.p] || [''];
  const total = pg.join('\n').length;
  if (d.ch < total) {
    d.ch += 2;
    if (d.ch % 6 < 2) Audio2.sfx('bip');
    if (KP.a || KP.b) d.ch = total;
    return;
  }
  d.t++;
  if (d.op && d.p >= d.pgs.length - 1) {
    if (KP.up) { d.sel = (d.sel + d.op.length - 1) % d.op.length; Audio2.sfx('bip'); }
    if (KP.dn) { d.sel = (d.sel + 1) % d.op.length; Audio2.sfx('bip'); }
    if (KP.a) { Audio2.sfx('sel'); const f = d.fin, s = d.sel; dlg = null; modo = 'mundo'; f && f(s); }
    return;
  }
  if (KP.a || KP.b) {
    Audio2.sfx('sel');
    if (d.p < d.pgs.length - 1) { d.p++; d.ch = 0; }
    else { const c = d.cb; dlg = null; modo = 'mundo'; c && c(); }
  }
}
function dibujarDlg() {
  const d = dlg;
  panel(0, 96, 160, 48);
  const pg = d.pgs[d.p] || ['']; let n = d.ch;
  for (let i = 0; i < pg.length; i++) {
    const l = pg[i];
    drawText(ctx, l.slice(0, Math.max(0, Math.min(l.length, n))), 8, 104 + i * 11, COL.texto);
    n -= l.length + 1;
  }
  const total = pg.join('\n').length;
  if (d.ch >= total) {
    if (d.op && d.p >= d.pgs.length - 1) {
      let w = 40;
      for (const o of d.op) w = Math.max(w, textWidth(o) + 22);
      const x = 160 - w - 6, y = 96 - 8 - d.op.length * 12;
      panel(x, y, w, d.op.length * 12 + 8);
      for (let i = 0; i < d.op.length; i++) drawText(ctx, d.op[i], x + 14, y + 5 + i * 12, COL.texto);
      drawText(ctx, '>', x + 5, y + 5 + d.sel * 12, COL.acento);
    } else if ((d.t >> 3) & 1) {
      rect(150, 136, 4, 2, COL.acento); rect(151, 138, 2, 1, COL.acento);
    }
  }
}

// ---- personaje ----
const P = { x: 5, y: 6, dir: 'd', mov: 0, off: 0, dx: 0, dy: 0, anim: 0 };
let cam = { x: 0, y: 0 };
const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
function mapaAct() { return MAPAS[G.zona]; }
function tileEn(m, x, y) {
  if (y < 0 || y >= m.t.length || x < 0 || x >= m.t[0].length) return null;
  return m.t[y][x];
}
function npcEn(m, x, y) { return (m.npcs || []).find(n => n.x === x && n.y === y && !npcOculto(n)); }
function npcOculto(n) {
  if (n.duelo === 'juan' && G.pistas.juan) return 0;
  if (n.n === 'hermana' && G.cap > 2 && G.flags.dni) return 0;
  return 0;
}
function pasable(m, x, y) {
  const t = tileEn(m, x, y);
  if (t === null || SOLID.includes(t)) return false;
  return !npcEn(m, x, y);
}
function camaraSeguir() {
  const m = mapaAct(), mw = m.t[0].length * TILE, mh = m.t.length * TILE;
  const px = P.x * TILE + P.dx * P.off, py = P.y * TILE + P.dy * P.off;
  cam.x = mw <= W ? (mw - W) / 2 : clamp(px + 8 - W / 2, 0, mw - W);
  cam.y = mh <= H ? (mh - H) / 2 : clamp(py + 8 - H / 2, 0, mh - H);
}
function entrarZona(z, x, y, dir) {
  G.zona = z; P.x = x === undefined ? 5 : x; P.y = y === undefined ? 5 : y;
  P.dir = dir || 'd'; P.mov = 0; P.off = 0; P.dx = 0; P.dy = 0;
  camaraSeguir();
  const m = MAPAS[z];
  if (m.pistaZona && pista(m.pistaZona[0], m.pistaZona[1])) { }
  cartel = 100; cartelTxt = (ZONAS[z] ? ZONAS[z].n : (z === 'casa' ? 'Tu departamento' : ''));
}
function fundir(cb) { fade.dir = 1; fade.cb = cb; }

// ---- el aguante ----
function aguante() {
  const desde = G.min - (G.ultimaRaya || MIN_INICIO);
  return clamp(1 - desde / 150, 0, 1);
}
function tomarRaya() {
  if (G.stack <= 0) return false;
  G.stack--; G.usos++; G.ultimaRaya = G.min; gastarMin(5);
  return true;
}

// ---- interaccion ----
function hablar() {
  const m = mapaAct(), v = DIRV[P.dir];
  const tx = P.x + v[0], ty = P.y + v[1];
  const n = npcEn(m, tx, ty) || ((tileEn(m, tx, ty) === 'M') ? npcEn(m, tx + v[0], ty + v[1]) : null);
  if (n) {
    n.d = { u: 'd', d: 'u', l: 'r', r: 'l' }[P.dir];
    if (n.duelo && !G.flags['d_' + n.duelo]) { empezarDuelo(n.duelo); return; }
    gastarMin(5);
    const d = NPCS[n.n] && NPCS[n.n].dial();
    if (d) decir(d);
    return;
  }
  // lugares especiales
  if (m.cava && m.cava.x === tx && m.cava.y === ty) return cavar();
  if (m.archivo && m.archivo.x === tx && m.archivo.y === ty) return archivo();
  if (m.final && m.final.x === tx && m.final.y === ty) return escenaFinal();
  const pu = (m.puertas || []).find(p => p.x === tx && p.y === ty);
  if (pu) { Audio2.sfx('sel'); fundir(() => entrarZona(pu.a, pu.ax, pu.ay, 'd')); return; }
  const o = (m.obj || []).find(o => o.x === tx && o.y === ty);
  if (o) { decir(o.txt); return; }
  const t = tileEn(m, tx, ty);
  if (t === 'z' || t === '~') decir('El agua ni se mueve.\nNo devuelve nada.');
  else if (t === 'J') decir('Juncos hasta la cintura.\nHay cosas tiradas.');
  else if (t === 'c') decir('Una carpa. Adentro hay\nalguien durmiendo.');
  else if (t === 'C') decir('Un contenedor. Huele a\nlo de siempre.');
  else if (t === 'Z') decir('El reflector prendido.\nNadie lo apaga.');
  else if (t === 'u') decir('La pileta vacia.\nHojas de dieciseis años.');
  else if (t === 'b') decir('Una cama. Da ganas.');
  else if (t === 'y') decir('Cientos de cajas negras\nordenadas por letra.');
}

function cavar() {
  if (!tenes('plano')) { decir('Hay basura por todos lados.\nNo se por donde empezar.'); return; }
  if (G.flags.cavo) { decir('Ya revisaste aca.'); return; }
  G.flags.cavo = 1; gastarMin(15); dar('envoltorio');
  pista('envoltorio', 'Los envoltorios tirados\nestan envueltos como los\nde ella.');
  aprender('amague');
  decir(['Segun el plano de Musa,\naca.',
    '...',
    'Bolsas, fierros, una\nsilla sin patas.',
    'Y esto.',
    '*Un envoltorio vacio*',
    'Lo miras y lo das vuelta.',
    'La cinta, el nudo, la\nmarca del fibron.',
    'Lo viste cien veces\narriba de una mesa.',
    'Esto lo envolvio ella.']);
}
function archivo() {
  if (G.flags.legajo) { decir('El expediente ya lo\ntenes vos.'); return; }
  G.flags.legajo = 1; gastarMin(10); dar('legajo');
  pista('legajo', 'El expediente confirma:\nla camioneta del Tortuga\nfue robada de verdad.');
  decir(['El archivo. Letra T.',
    '...',
    'Aca esta. La denuncia\noriginal.',
    'Sello de la comisaria,\nfecha, todo en orden.',
    'La camioneta se la\nrobaron de verdad.',
    'Y vos firmaste catorce\nrechazos.',
    '*Te llevaste el legajo*']);
}

// ---- update / draw ----
function updMundo() {
  const m = mapaAct();
  if (P.mov) {
    P.off += 2; P.anim++;
    if (P.off >= TILE) {
      P.x += P.dx; P.y += P.dy; P.off = 0; P.mov = 0; P.dx = 0; P.dy = 0;
      const pu = (m.puertas || []).find(p => p.x === P.x && p.y === P.y);
      if (pu) { Audio2.sfx('sel'); fundir(() => entrarZona(pu.a, pu.ax, pu.ay, 'd')); }
    }
    return;
  }
  if (KP.st) { abrirLibreta(); return; }
  if (KP.b) { abrirMapa(); return; }
  if (KP.a) { hablar(); return; }
  let d = null;
  if (K.up) d = 'u'; else if (K.dn) d = 'd'; else if (K.lf) d = 'l'; else if (K.rt) d = 'r';
  if (!d) { P.anim = 0; return; }
  P.dir = d;
  const v = DIRV[d];
  if (pasable(m, P.x + v[0], P.y + v[1])) { P.mov = 1; P.dx = v[0]; P.dy = v[1]; P.off = 0; }
  else P.anim++;
}

let cartel = 0, cartelTxt = '';
function dibujarMundo() {
  const m = mapaAct();
  rect(0, 0, W, H, PAL['0']);
  const t0x = Math.floor(cam.x / TILE), t0y = Math.floor(cam.y / TILE);
  for (let y = t0y; y <= t0y + 10; y++) for (let x = t0x; x <= t0x + 11; x++) {
    const t = tileEn(m, x, y);
    if (t === null || !TILES[t]) continue;
    blit(TILES[t], x * TILE - cam.x, y * TILE - cam.y);
  }
  for (const n of (m.npcs || [])) {
    if (npcOculto(n)) continue;
    const s = spriteDe(n.n === 'apagado' ? 'apagado' : (LOOKS[n.n] ? n.n : (NPCS[n.n] ? NPCS[n.n].look : 'pibe')));
    const px = n.x * TILE - cam.x, py = n.y * TILE - cam.y;
    if (px < -16 || px > W || py < -16 || py > H) continue;
    if (n.d === 'l') blitFlip(s.s[0], px, py);
    else if (n.d === 'r') blit(s.s[0], px, py);
    else if (n.d === 'u') blit(s.u[0], px, py);
    else blit(s.d[0], px, py);
  }
  const s = spriteDe('yo');
  const fr = P.mov ? ((P.anim >> 3) & 1) : 0;
  const px = P.x * TILE + P.dx * P.off - cam.x, py = P.y * TILE + P.dy * P.off - cam.y;
  if (P.dir === 'l') blitFlip(s.s[fr], px, py);
  else if (P.dir === 'r') blit(s.s[fr], px, py);
  else if (P.dir === 'u') blit(s.u[fr], px, py);
  else blit(s.d[fr], px, py);
  if (G.cap > 0) barraSuperior();
  if (cartel > 0) {
    cartel--;
    const w = textWidth(cartelTxt) + 14;
    panel(4, 14, w, 18); drawText(ctx, cartelTxt, 11, 19, COL.texto);
  }
}

// reloj y guita siempre a la vista
function barraSuperior() {
  rect(0, 0, W, 11, PAL['0']);
  rect(0, 10, W, 1, PAL['2']);
  drawText(ctx, relojTexto(G.min), 3, 2, COL.acento);
  const f = 'FALTA ' + faltaTexto();
  drawText(ctx, f, 62, 2, G.min > MIN_FINAL - 90 ? PAL['g'] : COL.tenue);
  const a = aguante();
  rect(139, 3, 18, 5, PAL['2']);
  rect(139, 3, Math.round(18 * a), 5, a > 0.5 ? PAL['b'] : a > 0.25 ? PAL['i'] : PAL['g']);
}
