// ============================================================
//  DUELOS DE BERRETINES
// ============================================================
let D = null;
function empezarDuelo(id) {
  const d = DUELOS[id];
  D = { id, d, ronda: 0, moral: d.rondas.length, paciencia: aguante() < 0.35 ? 2 : 3, sel: 0, t: 0, fase: 'intro', msg: '', ch: 0, cola: [] };
  modo = 'duelo'; Audio2.play('duelo');
  D.cola = d.pre.slice();
  siguienteMsg();
}
function siguienteMsg() {
  if (D.cola.length) { D.msg = D.cola.shift(); D.ch = 0; D.fase = 'msg'; return true; }
  return false;
}
function opcionesDeRonda() {
  const r = D.d.rondas[D.ronda];
  let ops = r.o.map((o, i) => ({ o, i }));
  // los que piden un berretin que no aprendiste no se te ocurren
  ops = ops.map(x => x.o.req && !G.berretines.includes(x.o.req) ? { o: { t: '(no se te ocurre nada)', mudo: 1 }, i: x.i } : x);
  return ops;
}
function updDuelo() {
  D.t++;
  if (D.fase === 'msg') {
    if (D.ch < D.msg.length) { D.ch += 2; if (KP.a || KP.b) D.ch = D.msg.length; return; }
    if (KP.a || KP.b) {
      Audio2.sfx('sel');
      if (!siguienteMsg()) {
        if (D.fin) return terminarDuelo();
        D.fase = 'elegir'; D.sel = 0; D.ops = opcionesDeRonda();
      }
    }
    return;
  }
  if (D.fase === 'elegir') {
    const n = D.ops.length;
    if (KP.up) { D.sel = (D.sel + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.dn) { D.sel = (D.sel + 1) % n; Audio2.sfx('bip'); }
    if (KP.a) {
      const el = D.ops[D.sel];
      Audio2.sfx('sel');
      if (el.o.mudo) { D.cola = ['(Te quedas sin decir\nnada. Se rie.)']; D.paciencia--; }
      else if (el.o.ok) {
        D.moral--; Audio2.sfx('golpe');
        D.cola = ['VOS: ' + el.o.t, '(Le pego.)'];
      } else {
        D.paciencia--; Audio2.sfx('mal');
        D.cola = ['VOS: ' + el.o.t, '(No le hizo nada.)'];
      }
      D.ronda++;
      if (D.moral <= 0 || D.paciencia <= 0 || D.ronda >= D.d.rondas.length) {
        D.gano = D.moral <= 0 || (D.paciencia > 0 && D.ronda >= D.d.rondas.length && D.moral <= 1);
        D.cola = D.cola.concat(D.gano ? D.d.gana : D.d.pierde);
        D.fin = 1;
      } else {
        D.cola.push(D.d.rondas[D.ronda].i);
      }
      siguienteMsg();
    }
  }
}
function terminarDuelo() {
  const id = D.id, gano = D.gano, min = D.d.min;
  D = null; modo = 'mundo'; Audio2.play('noche');
  gastarMin(min);
  if (id === 'fredy') { G.flags.ganoFredy = gano; return desenlace(); }
  if (!gano) { decir(['(Te fuiste con la cola\nentre las patas.)', '(Podes volver a intentar.)']); return; }
  G.flags['d_' + id] = 1;
  if (id === 'tortuga') {
    pista('tortuga', 'El Tortuga no la tiene.\nLa camioneta se la robaron\nde verdad.');
    G.banda.Independiente = 1; G.ayudados++;
    aprender('vuelto');
  }
  if (id === 'juan') {
    pista('juan', 'Juan le dio a Fredy un\nDNI viejo. Lo tenia de\ntu cumpleaños de 2010.');
    aprender('careta');
  }
  if (id === 'santelmo') { G.banda['San Telmo'] = 1; aprender('gil'); }
  if (id === 'capital') { G.banda['Boca y River'] = 1; aprender('chamuyo'); }
  decir(['(Ganaste el cruce.)']);
}
function dibujarDuelo() {
  rect(0, 0, W, H, PAL['0']);
  rect(0, 30, W, 66, PAL['1']);
  rect(0, 29, W, 1, PAL['2']);
  rect(0, 88, W, 8, PAL['r']);
  const mio = spriteDe('yo'), suyo = spriteDe(D.d.look);
  blit(suyo.s[0], 108, 50, 2.4);
  blitFlip(mio.s[0], 14, 50, 2.4);
  // paciencia y moral
  panel(2, 1, 74, 26);
  drawText(ctx, 'VOS', 7, 5, COL.texto);
  for (let i = 0; i < 3; i++) rect(36 + i * 9, 6, 7, 6, i < D.paciencia ? PAL['b'] : PAL['2']);
  const a = aguante();
  drawText(ctx, a < 0.35 ? 'FUNDIDO' : 'AGUANTE', 7, 16, a < 0.35 ? PAL['g'] : COL.tenue);
  rect(56, 17, 16, 5, PAL['2']);
  rect(56, 17, Math.round(16 * a), 5, a > 0.5 ? PAL['b'] : a > 0.25 ? PAL['i'] : PAL['g']);
  panel(84, 1, 74, 26);
  drawText(ctx, D.d.nom.slice(0, 13), 89, 5, COL.texto);
  drawText(ctx, 'MORAL', 89, 16, COL.tenue);
  for (let i = 0; i < D.d.rondas.length; i++)
    rect(122 + i * 7, 17, 5, 5, i < D.moral ? PAL['g'] : PAL['2']);
  // texto
  panel(0, 96, 160, 48);
  if (D.fase === 'msg') {
    const ls = D.msg.split('\n'); let n = D.ch;
    for (let i = 0; i < ls.length; i++) {
      drawText(ctx, ls[i].slice(0, Math.max(0, Math.min(ls[i].length, n))), 8, 104 + i * 11, COL.texto);
      n -= ls[i].length + 1;
    }
    if (D.ch >= D.msg.length && ((D.t >> 3) & 1)) { rect(150, 136, 4, 2, COL.acento); rect(151, 138, 2, 1, COL.acento); }
  } else {
    let y = 100;
    for (let i = 0; i < D.ops.length; i++) {
      const ls = D.ops[i].o.t.split('\n');
      const col = D.ops[i].o.mudo ? COL.tenue : COL.texto;
      for (let j = 0; j < ls.length; j++) drawText(ctx, ls[j], 12, y + j * 9, col);
      if (D.sel === i) drawText(ctx, '>', 3, y, COL.acento);
      y += ls.length * 9 + 2;
    }
  }
}
