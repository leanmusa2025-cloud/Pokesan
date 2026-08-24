// ============================================================
//  EL MAPA DEL PARTIDO Y EL FORD FOX
// ============================================================
const MX = (v) => 6 + v * 1.27, MY = (v) => 14 + v * 1.27;
let MP = null;
let VIAJE = null;

function zonasDisponibles() {
  return ORDEN_ZONAS.filter(z => {
    if (z === 'quinta') return !!G.flags.quinta;
    if (G.cap <= 2) return z === 'nunez' || z === 'fiambreria';
    return true;
  });
}
function abrirMapa() {
  const disp = zonasDisponibles();
  MP = { sel: Math.max(0, disp.indexOf(zonaActual())), disp, t: 0 };
  modo = 'mapa'; Audio2.sfx('sel');
}
function updMapa() {
  MP.t++;
  const d = MP.disp;
  if (KP.b || KP.st) { modo = 'mundo'; Audio2.sfx('sel'); return; }
  let dx = 0, dy = 0;
  if (KP.lf) dx = -1; if (KP.rt) dx = 1; if (KP.up) dy = -1; if (KP.dn) dy = 1;
  if (dx || dy) {
    const cur = ZONAS[d[MP.sel]];
    let mejor = -1, mejorV = 1e9;
    for (let i = 0; i < d.length; i++) {
      if (i === MP.sel) continue;
      const z = ZONAS[d[i]], vx = z.mx - cur.mx, vy = z.my - cur.my;
      const proy = vx * dx + vy * dy;
      if (proy <= 0) continue;
      const perp = Math.abs(vx * dy - vy * dx);
      const v = Math.hypot(vx, vy) + perp * 2;
      if (v < mejorV) { mejorV = v; mejor = i; }
    }
    if (mejor >= 0) { MP.sel = mejor; Audio2.sfx('bip'); }
  }
  if (KP.a) {
    const destino = d[MP.sel];
    const origen = zonaActual();
    if (destino === origen) { modo = 'mundo'; Audio2.sfx('sel'); return; }
    const min = minutosViaje(origen, destino);
    Audio2.sfx('motor');
    VIAJE = { a: origen, b: destino, t: 0, dur: 46, min };
    modo = 'viaje';
  }
}
function dibujarMapaPartido() {
  rect(0, 0, W, H, PAL['0']);
  // el rio de la plata
  rect(0, 11, W, MY(4) - 11, PAL['c']);
  for (let i = 0; i < 30; i++) {
    const x = (i * 41 + ((MP ? MP.t : 0) >> 3)) % 176 - 8;
    rect(x, 14 + (i % 3) * 4, 6, 1, PAL['d']);
  }
  // el Riachuelo bajando por el oeste
  for (let y = 0; y < 60; y++) {
    const x = MX(9 - Math.sin(y / 14) * 4);
    rect(x, MY(2) + y, 3, 1, PAL['c']);
  }
  // las localidades
  LOCALIDADES.forEach((L, i) => {
    const x = MX(L.x), y = MY(L.y), w = L.w * 1.27, h = L.h * 1.27;
    rect(x, y, w, h, i % 2 ? PAL['2'] : PAL['r']);
    rect(x, y, w, 1, PAL['3']); rect(x, y + h - 1, w, 1, PAL['3']);
    rect(x, y, 1, h, PAL['3']); rect(x + w - 1, y, 1, h, PAL['3']);
  });
  // avenidas: Mitre, Belgrano, la autopista
  linea(MX(16), MY(24), MX(94), MY(60), PAL['h']);
  linea(MX(20), MY(24), MX(96), MY(56), PAL['d']);
  linea(MX(10), MY(6), MX(92), MY(64), PAL['f']);
  linea(MX(14), MY(44), MX(96), MY(44), PAL['4']);
  // los lugares
  const d = MP ? MP.disp : zonasDisponibles();
  for (const k of d) {
    const z = ZONAS[k];
    rect(MX(z.mx) - 5, MY(z.my) - 5, 10, 10, PAL['0']);
    blit(ART.iconos[z.ic] || ART.iconos.casa, MX(z.mx) - 4, MY(z.my) - 4);
  }
  // donde estas
  const aqui = ZONAS[zonaActual()];
  if (aqui && ((MP ? MP.t : 0) >> 3) & 1) {
    rect(MX(aqui.mx) - 6, MY(aqui.my) - 6, 12, 1, PAL['b']);
    rect(MX(aqui.mx) - 6, MY(aqui.my) + 5, 12, 1, PAL['b']);
  }
  if (!MP) return;
  // el cursor
  const z = ZONAS[d[MP.sel]];
  if ((MP.t >> 2) & 1) {
    const x = MX(z.mx) - 7, y = MY(z.my) - 7;
    rect(x, y, 4, 1, COL.acento); rect(x, y, 1, 4, COL.acento);
    rect(x + 10, y, 4, 1, COL.acento); rect(x + 13, y, 1, 4, COL.acento);
    rect(x, y + 13, 4, 1, COL.acento); rect(x, y + 10, 1, 4, COL.acento);
    rect(x + 10, y + 13, 4, 1, COL.acento); rect(x + 13, y + 10, 1, 4, COL.acento);
  }
  // ficha del destino
  panel(0, 108, 160, 36);
  const origen = zonaActual();
  drawText(ctx, z.n.slice(0, 26), 6, 112, COL.texto);
  drawText(ctx, z.loc, 6, 123, COL.tenue);
  if (d[MP.sel] === origen) drawText(ctx, 'ESTAS ACA', 6, 133, COL.acento);
  else {
    drawText(ctx, minutosViaje(origen, d[MP.sel]) + ' min', 6, 133, COL.acento);
    if (z.banda) drawText(ctx, z.banda, 62, 133, PAL['g']);
  }
  rect(0, 0, W, 11, PAL['0']); rect(0, 10, W, 1, PAL['2']);
  drawText(ctx, relojTexto(G.min), 3, 2, COL.acento);
  drawText(ctx, 'FALTA ' + faltaTexto(), 62, 2, COL.tenue);
}
function linea(x0, y0, x1, y1, col) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) | 0;
  for (let i = 0; i <= n; i++) rect(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1, 1, col);
}

// ---- el viaje ----
function updViaje() {
  VIAJE.t++;
  if (VIAJE.t === 1) Audio2.play('auto');
  if (VIAJE.t >= VIAJE.dur) {
    gastarMin(VIAJE.min);
    const dest = VIAJE.b; VIAJE = null; MP = null;
    Audio2.play('noche');
    fundir(() => {
      entrarZona(dest, entradaDe(dest).x, entradaDe(dest).y, 'd');
      if (G.min >= MIN_FINAL) return amanecerSinLlegar();
      const m = MAPAS[dest];
      if (m.amb) decir(m.amb);
    });
    modo = 'mundo';
  }
}
function entradaDe(z) {
  const m = MAPAS[z];
  for (let y = m.t.length - 1; y >= 0; y--)
    for (let x = 0; x < m.t[0].length; x++)
      if (!SOLID.includes(m.t[y][x]) && !(m.puertas || []).some(p => p.x === x && p.y === y)) return { x, y };
  return { x: 1, y: 1 };
}
function dibujarViaje() {
  dibujarMapaPartido();
  const a = ZONAS[VIAJE.a], b = ZONAS[VIAJE.b], k = VIAJE.t / VIAJE.dur;
  const x = MX(a.mx + (b.mx - a.mx) * k), y = MY(a.my + (b.my - a.my) * k);
  linea(MX(a.mx), MY(a.my), x, y, COL.acento);
  const izq = b.mx < a.mx;
  if (izq) blitFlip(ART.fox, x - 8, y - 5); else blit(ART.fox, x - 8, y - 5);
  panel(0, 108, 160, 36);
  drawText(ctx, 'Yendo a ' + ZONAS[VIAJE.b].n.slice(0, 16), 6, 114, COL.texto);
  drawText(ctx, '- ' + VIAJE.min + ' min', 6, 128, PAL['g']);
}
