// ============================================================
//  LA LIBRETA
// ============================================================
let LB = null;
const LB_OP = ['PISTAS', 'BERRETINES', 'BOLSILLOS', 'AGUANTAR', 'ATAR CABOS', 'GUARDAR', 'CERRAR'];
function abrirLibreta() { LB = { p: 'menu', sel: 0, sel2: 0 }; modo = 'libreta'; Audio2.sfx('sel'); }
function cerrarLibreta() { LB = null; modo = 'mundo'; }
function puedeAtar() { return G.pistas.juan && tenes('dni') && !G.flags.quinta; }

function updLibreta() {
  const p = LB.p;
  if (p === 'menu') {
    if (KP.up) { LB.sel = (LB.sel + LB_OP.length - 1) % LB_OP.length; Audio2.sfx('bip'); }
    if (KP.dn) { LB.sel = (LB.sel + 1) % LB_OP.length; Audio2.sfx('bip'); }
    if (KP.b || KP.st) { cerrarLibreta(); return; }
    if (KP.a) {
      Audio2.sfx('sel');
      const o = LB_OP[LB.sel];
      if (o === 'CERRAR') return cerrarLibreta();
      if (o === 'AGUANTAR') {
        if (G.stack <= 0) { LB.p = 'aviso'; LB.txt = 'No te queda nada.\nY todavia falta.'; return; }
        tomarRaya();
        LB.p = 'aviso'; LB.txt = 'Listo. Otra vez entero.\nTe quedan ' + G.stack + '.';
        return;
      }
      if (o === 'ATAR CABOS') {
        if (!puedeAtar()) { LB.p = 'aviso'; LB.txt = G.flags.quinta ? 'Ya sabes donde es.' : 'Todavia no te cierra\nnada.'; return; }
        cerrarLibreta(); return atarCabos();
      }
      if (o === 'GUARDAR') {
        const ok = saveGame({ G, P: { x: P.x, y: P.y, dir: P.dir } });
        LB.p = 'aviso'; LB.txt = ok ? 'Guardado en el telefono.' : 'No se pudo guardar.';
        return;
      }
      LB.p = o.toLowerCase(); LB.sel2 = 0;
    }
    return;
  }
  if (p === 'aviso') { if (KP.a || KP.b) { Audio2.sfx('sel'); LB.p = 'menu'; } return; }
  if (KP.b || KP.a) { Audio2.sfx('sel'); LB.p = 'menu'; return; }
  const n = p === 'pistas' ? Object.keys(G.pistas).length : p === 'berretines' ? G.berretines.length : Object.keys(G.obj).length;
  if (KP.up && n) LB.sel2 = (LB.sel2 + n - 1) % n;
  if (KP.dn && n) LB.sel2 = (LB.sel2 + 1) % n;
}
function dibujarLibreta() {
  const p = LB.p;
  rect(0, 0, W, H, PAL['1']);
  panel(0, 0, W, H);
  if (p === 'menu' || p === 'aviso') {
    drawText(ctx, 'LIBRETA', 8, 6, COL.acento);
    drawText(ctx, relojTexto(G.min), 112, 6, COL.texto);
    for (let i = 0; i < LB_OP.length; i++) {
      let t = LB_OP[i], col = COL.texto;
      if (t === 'ATAR CABOS' && !puedeAtar()) col = COL.tenue;
      if (t === 'AGUANTAR') t += '  (' + G.stack + ')';
      drawText(ctx, t, 20, 22 + i * 12, col);
      if (LB.sel === i) drawText(ctx, '>', 10, 22 + i * 12, COL.acento);
    }
    drawText(ctx, 'Pistas: ' + Object.keys(G.pistas).length, 8, 112, COL.tenue);
    drawText(ctx, '$' + (G.guita / 1000).toFixed(0) + 'k', 8, 124, COL.tenue);
    drawText(ctx, 'Berretines: ' + G.berretines.length, 76, 112, COL.tenue);
    drawText(ctx, 'Falta ' + faltaTexto(), 76, 124, COL.tenue);
    if (p === 'aviso') { panel(0, 96, 160, 48); const ls = LB.txt.split('\n'); for (let i = 0; i < ls.length; i++) drawText(ctx, ls[i], 8, 106 + i * 11, COL.texto); }
    return;
  }
  if (p === 'pistas') {
    drawText(ctx, 'PISTAS', 8, 6, COL.acento);
    const ks = Object.keys(G.pistas);
    if (!ks.length) drawText(ctx, 'Nada todavia.', 8, 24, COL.tenue);
    let y = 20;
    for (let i = 0; i < ks.length && y < 130; i++) {
      const ls = G.pistas[ks[i]].split('\n');
      for (let j = 0; j < ls.length; j++) drawText(ctx, ls[j], 12, y + j * 9, i === LB.sel2 ? COL.texto : COL.tenue);
      if (i === LB.sel2) drawText(ctx, '>', 3, y, COL.acento);
      y += ls.length * 9 + 3;
    }
    return;
  }
  if (p === 'berretines') {
    drawText(ctx, 'BERRETINES', 8, 6, COL.acento);
    if (!G.berretines.length) drawText(ctx, 'Todavia no te quemo\nnadie.', 8, 24, COL.tenue);
    let y = 20;
    for (const b of G.berretines) {
      const ls = BERRETINES[b].split('\n');
      for (let j = 0; j < ls.length; j++) drawText(ctx, ls[j], 10, y + j * 9, COL.texto);
      y += ls.length * 9 + 4;
    }
    return;
  }
  if (p === 'bolsillos') {
    drawText(ctx, 'BOLSILLOS', 8, 6, COL.acento);
    const ks = Object.keys(G.obj);
    for (let i = 0; i < ks.length; i++) {
      drawText(ctx, OBJETOS[ks[i]].n, 12, 20 + i * 11, i === LB.sel2 ? COL.texto : COL.tenue);
      if (i === LB.sel2) drawText(ctx, '>', 3, 20 + i * 11, COL.acento);
    }
    if (ks.length) {
      panel(0, 100, 160, 44);
      const ls = OBJETOS[ks[LB.sel2]].d.split('\n');
      for (let j = 0; j < ls.length; j++) drawText(ctx, ls[j], 8, 108 + j * 11, COL.texto);
    }
  }
}
