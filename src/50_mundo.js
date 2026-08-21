// ============================================================
//  ESTADO DEL JUEGO + MUNDO
// ============================================================
let G = null;
let modo = 'titulo';          // titulo | mundo | dialogo | menu | batalla | fin
let dlg = null;               // cuadro de texto activo
let fade = { v: 0, dir: 0, cb: null };
let tiempoJuego = 0;

function nuevaPartida(nombre) {
  G = {
    nombre: nombre || 'Pibe', mapa: 'casa', x: 5, y: 5, dir: 'd',
    equipo: [], caja: [], guita: 500,
    objetos: { chapita: 5, sanguche: 2 },
    medallas: [], flags: {}, vistos: {}, pasos: 0, seg: 0
  };
}

function darBicho(b) {
  if (G.equipo.length < 6) { G.equipo.push(b); return 'equipo'; }
  G.caja.push(b); return 'caja';
}
function darObjeto(id, n) { G.objetos[id] = (G.objetos[id] || 0) + (n || 1); }
function sacarObjeto(id, n) {
  G.objetos[id] = (G.objetos[id] || 0) - (n || 1);
  if (G.objetos[id] <= 0) delete G.objetos[id];
}
function equipoVivo() { return G.equipo.some(b => b.hp > 0); }
function curarTodo() { for (const b of G.equipo) { b.hp = b.hpMax; b.estado = ''; for (const a of b.ataques) a.pp = a.ppMax; } }

// ------------------------------------------------------------
//  CUADRO DE TEXTO
// ------------------------------------------------------------
function armarPaginas(lineas) {
  const pgs = [];
  for (const l of [].concat(lineas)) {
    const w = wrapText(l, 142);
    for (let i = 0; i < w.length; i += 2) pgs.push(w.slice(i, i + 2));
  }
  return pgs;
}
function decir(lineas, cb) {
  dlg = { pgs: armarPaginas(lineas), p: 0, ch: 0, cb: cb || null, op: null, sel: 0, t: 0 };
  modo = 'dialogo';
}
function preguntar(lineas, opciones, cb) {
  dlg = { pgs: armarPaginas(lineas), p: 0, ch: 0, cb: null, op: opciones, sel: 0, fin: cb, t: 0 };
  modo = 'dialogo';
}
function updDlg() {
  const d = dlg;
  const pg = d.pgs[d.p] || [''];
  const total = pg.join('\n').length;
  if (d.ch < total) {
    d.ch += 2;
    if (d.ch % 6 < 2) Audio2.sfx('bip');
    if (KP.a || KP.b) d.ch = total;
    return;
  }
  d.t++;
  if (d.op && d.p >= d.pgs.length - 1) {          // menu de opciones
    if (KP.up) { d.sel = (d.sel + d.op.length - 1) % d.op.length; Audio2.sfx('bip'); }
    if (KP.dn) { d.sel = (d.sel + 1) % d.op.length; Audio2.sfx('bip'); }
    if (KP.a) {
      Audio2.sfx('sel');
      const f = d.fin, s = d.sel; dlg = null; modo = 'mundo'; f && f(s);
    }
    if (KP.b && d.op.length === 2) {
      Audio2.sfx('sel');
      const f = d.fin; dlg = null; modo = 'mundo'; f && f(1);
    }
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
  const pg = d.pgs[d.p] || [''];
  let n = d.ch;
  for (let i = 0; i < pg.length; i++) {
    const l = pg[i];
    const vis = Math.max(0, Math.min(l.length, n));
    drawText(ctx, l.slice(0, vis), 8, 104 + i * 11, PAL['0']);
    n -= l.length + 1;
  }
  const total = pg.join('\n').length;
  if (d.ch >= total) {
    if (d.op && d.p >= d.pgs.length - 1) {
      const w = 62, x = 160 - w - 6, y = 96 - 8 - d.op.length * 12;
      panel(x, y, w, d.op.length * 12 + 8);
      for (let i = 0; i < d.op.length; i++) drawText(ctx, d.op[i], x + 14, y + 5 + i * 12, PAL['0']);
      drawText(ctx, '>', x + 5, y + 5 + d.sel * 12, PAL['0']);
    } else if ((d.t >> 3) & 1) {
      rect(150, 136, 4, 2, PAL['0']); rect(151, 138, 2, 1, PAL['0']);
    }
  }
}

// ------------------------------------------------------------
//  PERSONAJE Y CAMARA
// ------------------------------------------------------------
const SPR = {};
function spriteDe(look) { return SPR[look] || (SPR[look] = buildPerson(LOOKS[look])); }
const DOG = mkArt(DOG_ART, { O: PAL['0'], H: PAL['7'] });

const P = { x: 5, y: 5, dir: 'd', mov: 0, off: 0, dx: 0, dy: 0, fr: 0, anim: 0 };
let cam = { x: 0, y: 0 };
const DIRV = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };

function mapaAct() { return MAPAS[G.mapa]; }
function tileEn(m, x, y) {
  if (y < 0 || y >= m.t.length || x < 0 || x >= m.t[0].length) return null;
  return m.t[y][x];
}
function npcEn(m, x, y) { return (m.npcs || []).find(n => n.x === x && n.y === y && !ocultoNpc(n)); }
function ocultoNpc(n) {
  if (n.id === 'bocha1' && G.flags.d_bocha1) return 0;
  return 0;
}
function pasable(m, x, y) {
  const t = tileEn(m, x, y);
  if (t === null) return false;
  if (SOLID.includes(t)) return false;
  if (npcEn(m, x, y)) return false;
  return true;
}
function camaraSeguir() {
  const m = mapaAct(), mw = m.t[0].length * TILE, mh = m.t.length * TILE;
  const pxx = P.x * TILE + P.dx * P.off, pyy = P.y * TILE + P.dy * P.off;
  cam.x = mw <= W ? (mw - W) / 2 : clamp(pxx + 8 - W / 2, 0, mw - W);
  cam.y = mh <= H ? (mh - H) / 2 : clamp(pyy + 8 - H / 2, 0, mh - H);
}

function irAMapa(nom, x, y, dir) {
  G.mapa = nom; P.x = x; P.y = y; P.dir = dir || P.dir;
  P.mov = 0; P.off = 0; P.dx = 0; P.dy = 0;
  camaraSeguir();
}
function fundir(cb) { fade.dir = 1; fade.cb = cb; }

// ------------------------------------------------------------
//  INTERACCION
// ------------------------------------------------------------
function hablar() {
  const m = mapaAct(), v = DIRV[P.dir];
  let tx = P.x + v[0], ty = P.y + v[1];
  let n = npcEn(m, tx, ty);
  if (!n) {                                  // hablar por arriba del mostrador
    const t = tileEn(m, tx, ty);
    if (t === 'M' || t === 'B') n = npcEn(m, tx + v[0], ty + v[1]);
  }
  if (n) { n.d = { u: 'd', d: 'u', l: 'r', r: 'l' }[P.dir]; interactuarNpc(n); return; }
  const o = (m.obj || []).find(o => o.x === tx && o.y === ty);
  if (o) { decir(o.txt); return; }
  const t = tileEn(m, tx, ty);
  if (t === 'S') decir('Un cartel oxidado. No se lee un carajo.');
  else if (t === '~') decir('El agua está espesa.\nMejor no meter la mano.');
  else if (t === 'C') decir('Un contenedor. Huele a gloria.');
  else if (t === 't') decir('La tele. Dan publicidad de un shampoo.');
  else if (t === 'b') decir('Tu cama. Da ganas de tirarse un rato.');
  else if (t === 'V') decir('La tribuna. Todavía se escucha el eco\ndel domingo pasado.');
}

function interactuarNpc(n) {
  const g = GENTE[n.id];
  if (!g) { decir('...'); return; }
  if (g.esp === 'entrenador') { duelo(n.id); return; }
  if (g.esp === 'chirola') { escenaChirola(); return; }
  if (g.esp === 'kiosco') { escenaKiosco(); return; }
  decir(g.dial());
}

function duelo(id) {
  const d = DUELOS[id];
  if (!d) { decir('...'); return; }
  if (G.flags['d_' + id]) { decir(d.post); return; }
  if (!equipoVivo()) { decir('Tus bichos están hechos bolsa.\nAndá a lo de Ramón antes de pelear.'); return; }
  decir(d.pre, () => {
    fundir(() => {
      empezarBatalla({
        tipo: 'entrenador', id, nom: d.nom, look: d.look,
        eq: d.eq.map(e => crearBicho(e[0], e[1])), plata: d.plata, duelo: d
      });
    });
  });
}

// ------------------------------------------------------------
//  ENCUENTROS
// ------------------------------------------------------------
function chequearEncuentro() {
  const m = mapaAct();
  if (!m.enc) return;
  const t = tileEn(m, P.x, P.y);
  if (!m.enc.tiles.includes(t)) return;
  if (!chance(m.enc.rate)) return;
  if (!equipoVivo()) return;
  const tot = m.enc.lista.reduce((a, e) => a + e[3], 0);
  let r = rnd(tot), pick = m.enc.lista[0];
  for (const e of m.enc.lista) { if (r < e[3]) { pick = e; break; } r -= e[3]; }
  const lvl = pick[1] + rnd(pick[2] - pick[1] + 1);
  fundir(() => empezarBatalla({ tipo: 'salvaje', eq: [crearBicho(pick[0], lvl)] }));
}

// ------------------------------------------------------------
//  UPDATE / DRAW DEL MUNDO
// ------------------------------------------------------------
function updMundo() {
  const m = mapaAct();
  if (P.mov) {
    P.off += 2; P.anim++;
    if (P.off >= TILE) {
      P.x += P.dx; P.y += P.dy; P.off = 0; P.mov = 0; P.dx = 0; P.dy = 0;
      G.pasos++;
      // warps
      const w = (m.warps || []).find(w => !w.borde && w.x === P.x && w.y === P.y);
      if (w) { Audio2.sfx('sel'); fundir(() => irAMapa(w.a, w.ax, w.ay, w.ad)); return; }
      chequearEncuentro();
      return;
    }
    return;
  }
  if (KP.st) { abrirMenu(); return; }
  if (KP.a) { hablar(); return; }
  let d = null;
  if (K.up) d = 'u'; else if (K.dn) d = 'd'; else if (K.lf) d = 'l'; else if (K.rt) d = 'r';
  if (!d) { P.anim = 0; return; }
  P.dir = d;
  const v = DIRV[d], nx = P.x + v[0], ny = P.y + v[1];
  // salida por el borde
  const bw = (m.warps || []).find(w => {
    if (!w.borde) return false;
    if (w.borde === 'n') return ny < 0 && P.x >= w.xs[0] && P.x <= w.xs[1];
    if (w.borde === 's') return ny >= m.t.length && P.x >= w.xs[0] && P.x <= w.xs[1];
    if (w.borde === 'o') return nx < 0 && P.y >= w.ys[0] && P.y <= w.ys[1];
    if (w.borde === 'e') return nx >= m.t[0].length && P.y >= w.ys[0] && P.y <= w.ys[1];
    return false;
  });
  if (bw) { fundir(() => irAMapa(bw.a, bw.ax, bw.ay, bw.ad)); return; }
  if (pasable(m, nx, ny)) { P.mov = 1; P.dx = v[0]; P.dy = v[1]; P.off = 0; }
  else { P.anim++; }
}

function dibujarMundo() {
  const m = mapaAct();
  rect(0, 0, W, H, PAL['0']);
  const t0x = Math.floor(cam.x / TILE), t0y = Math.floor(cam.y / TILE);
  for (let y = t0y; y <= t0y + 10; y++) {
    for (let x = t0x; x <= t0x + 11; x++) {
      const t = tileEn(m, x, y);
      if (t === null || !TILES[t]) continue;
      blit(TILES[t], x * TILE - cam.x, y * TILE - cam.y);
    }
  }
  // gente
  for (const n of (m.npcs || [])) {
    if (ocultoNpc(n)) continue;
    const s = spriteDe(n.c);
    const px = n.x * TILE - cam.x, py = n.y * TILE - cam.y;
    if (px < -16 || px > W || py < -16 || py > H) continue;
    if (n.d === 'l') blitFlip(s.s[0], px, py);
    else if (n.d === 'r') blit(s.s[0], px, py);
    else if (n.d === 'u') blit(s.u[0], px, py);
    else blit(s.d[0], px, py);
  }
  // vos
  const s = spriteDe('pibe');
  const fr = P.mov ? ((P.anim >> 3) & 1) : 0;
  const px = P.x * TILE + P.dx * P.off - cam.x, py = P.y * TILE + P.dy * P.off - cam.y;
  if (P.dir === 'l') blitFlip(s.s[fr], px, py);
  else if (P.dir === 'r') blit(s.s[fr], px, py);
  else if (P.dir === 'u') blit(s.u[fr], px, py);
  else blit(s.d[fr], px, py);
}

// cartelito con el nombre del lugar
let cartelNom = 0, cartelTxt = '';
function mostrarCartel(txt) { cartelNom = 110; cartelTxt = txt; }
function dibujarCartel() {
  if (cartelNom <= 0) return;
  cartelNom--;
  const w = textWidth(cartelTxt) + 14;
  panel(4, 4, w, 18);
  drawText(ctx, cartelTxt, 11, 9, PAL['0']);
}
