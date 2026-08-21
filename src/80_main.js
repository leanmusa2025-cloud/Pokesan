// ============================================================
//  TITULO, BUCLE PRINCIPAL Y GUARDADO
// ============================================================
function drawTextBig(s, x, y, color, sc) {
  const w = textWidth(s) + 2, tmp = document.createElement('canvas');
  tmp.width = w; tmp.height = 9;
  const c = tmp.getContext('2d');
  const a = glyphAtlas(color);
  let cx = 0;
  for (const ch of s) {
    const g = GLYPHS[ch] || GLYPHS['?'];
    const p = a.pos[ch] !== undefined ? a.pos[ch] : a.pos['?'];
    c.drawImage(a.cv, p, 0, 8, 8, cx, 0, 8, 8);
    cx += g.w + 1;
  }
  blit(tmp, x, y, sc);
}
function centrar(s, sc) { return (W - (textWidth(s) * (sc || 1))) / 2; }

const NOMBRES = ['Pibe', 'Brian', 'Kevin', 'Nahuel', 'Jazmín', 'Rocío', 'Maxi'];
let TIT = { sel: 0, t: 0, p: 'menu', nsel: 0, hay: false };

function updTitulo() {
  TIT.t++;
  if (TIT.p === 'menu') {
    const ops = TIT.hay ? 2 : 1;
    if (KP.up || KP.dn) { TIT.sel = (TIT.sel + 1) % ops; Audio2.sfx('bip'); }
    if (KP.a || KP.st) {
      Audio2.unlock(); Audio2.sfx('sel');
      if (TIT.hay && TIT.sel === 0) {
        const s = loadGame();
        if (s) {
          G = s;
          G.flags = G.flags || {}; G.vistos = G.vistos || {}; G.objetos = G.objetos || {};
          modo = 'mundo'; Audio2.play('barrio');
          irAMapa(G.mapa, G.x, G.y, G.dir);
          mostrarCartel(MAPAS[G.mapa].nom);
          return;
        }
      }
      TIT.p = 'nombre'; TIT.nsel = 0;
    }
    return;
  }
  if (TIT.p === 'nombre') {
    if (KP.up) { TIT.nsel = (TIT.nsel + NOMBRES.length - 1) % NOMBRES.length; Audio2.sfx('bip'); }
    if (KP.dn) { TIT.nsel = (TIT.nsel + 1) % NOMBRES.length; Audio2.sfx('bip'); }
    if (KP.b) { TIT.p = 'menu'; Audio2.sfx('sel'); return; }
    if (KP.a) {
      Audio2.sfx('sel');
      nuevaPartida(NOMBRES[TIT.nsel]);
      modo = 'mundo'; Audio2.play('barrio');
      irAMapa('casa', 5, 5, 'd');
      decir([
        'AVELLANEDA, 1996.',
        'Tres de la tarde. Hace calor.\nLa tele está prendida sin que nadie mire.',
        'Vos sos ' + G.nombre + ' y hoy, por fin,\nte vas a hacer conocer en el barrio.',
        '(Movete con las flechas.\nA = hablar. START = menú.)'
      ]);
    }
    return;
  }
}
function dibujarTitulo() {
  // cielo del conurbano al atardecer
  for (let i = 0; i < 9; i++) rect(0, i * 8, W, 8, [PAL['l'], PAL['l'], PAL['f'], PAL['g'], PAL['h'], PAL['h'], PAL['i'], PAL['i'], PAL['h']][i]);
  // siluetas
  const sil = [[0, 96, 22, 48], [20, 84, 14, 60], [32, 100, 26, 44], [56, 78, 18, 66],
  [72, 92, 30, 52], [100, 82, 16, 62], [114, 98, 24, 46], [136, 88, 24, 56]];
  for (const s of sil) {
    rect(s[0], s[1], s[2], s[3], PAL['1']);
    for (let y = s[1] + 4; y < 144; y += 8) for (let x = s[0] + 3; x < s[0] + s[2] - 2; x += 6)
      if ((x * 7 + y * 3) % 5 < 2) rect(x, y, 2, 3, PAL['i']);
  }
  rect(0, 126, W, 18, PAL['0']);
  drawTextBig('POKESAN', centrar('POKESAN', 2), 14, PAL['s'], 2);
  drawText(ctx, 'AVELLANEDA 96', centrar('AVELLANEDA 96'), 34, PAL['0']);
  blit(spriteMon('chorimon'), 10, 52, 1.4);
  blit(spriteMon('bondimon'), 108, 48, 1.4);
  if (TIT.p === 'menu') {
    const ops = TIT.hay ? ['SEGUIR', 'DE CERO'] : ['ARRANCAR'];
    panel(46, 92, 68, ops.length * 12 + 10);
    for (let i = 0; i < ops.length; i++) {
      drawText(ctx, ops[i], 62, 97 + i * 12, PAL['0']);
      if (TIT.sel === i) drawText(ctx, '>', 52, 97 + i * 12, PAL['0']);
    }
    if ((TIT.t >> 4) & 1) drawText(ctx, 'A / START', centrar('A / START'), 131, PAL['5']);
  } else {
    panel(38, 46, 84, 94);
    drawText(ctx, '¿Cómo te llamás?', 44, 50, PAL['0']);
    for (let i = 0; i < NOMBRES.length; i++) {
      drawText(ctx, NOMBRES[i], 58, 62 + i * 11, PAL['0']);
      if (TIT.nsel === i) drawText(ctx, '>', 48, 62 + i * 11, PAL['0']);
    }
  }
}

// ------------------------------------------------------------
//  BUCLE
// ------------------------------------------------------------
const _irAMapa = irAMapa;
irAMapa = function (nom, x, y, dir) {
  const cambio = !G || G.mapa !== nom;
  _irAMapa(nom, x, y, dir);
  if (cambio && MAPAS[nom].nom) mostrarCartel(MAPAS[nom].nom);
};

let acumulado = 0, ultimo = 0;
function paso(dibujar) {
  if (dibujar === undefined) dibujar = true;
  // guardado de posicion
  if (G && modo === 'mundo') { G.x = P.x; G.y = P.y; G.dir = P.dir; }

  if (fade.dir === 1) {
    fade.v += 0.09;
    if (fade.v >= 1) { fade.v = 1; fade.dir = -1; const c = fade.cb; fade.cb = null; c && c(); }
  } else if (fade.dir === -1) {
    fade.v -= 0.09;
    if (fade.v <= 0) { fade.v = 0; fade.dir = 0; }
  } else {
    if (modo === 'titulo') updTitulo();
    else if (modo === 'mundo') updMundo();
    else if (modo === 'dialogo') updDlg();
    else if (modo === 'menu') updMenu();
    else if (modo === 'batalla') updBatalla();
    else if (modo === 'fin') updFin();
  }
  if (G) G.seg += 1 / 60;

  // ---- dibujo ----
  if (!dibujar) { clearPressed(); return; }
  if (modo === 'titulo') dibujarTitulo();
  else if (modo === 'batalla') dibujarBatalla();
  else if (modo === 'fin') dibujarFin();
  else if (modo === 'menu' && MN && MN.p !== 'aviso') dibujarMenu();
  else {
    camaraSeguir();
    dibujarMundo();
    dibujarCartel();
    if (modo === 'dialogo' && dlg) dibujarDlg();
    if (modo === 'menu' && MN) dibujarMenu();
  }
  if (fade.v > 0) { ctx.fillStyle = 'rgba(8,8,14,' + fade.v + ')'; ctx.fillRect(0, 0, W, H); }
  clearPressed();
}

function bucle(t) {
  requestAnimationFrame(bucle);
  if (!ultimo) ultimo = t;
  let dt = t - ultimo; ultimo = t;
  if (dt > 250) dt = 250;
  acumulado += dt;
  let n = 0;
  while (acumulado >= 16.666 && n < 4) { acumulado -= 16.666; n++; paso(acumulado < 16.666 || n >= 4); }
}

// arranque
TIT.hay = !!loadGame();
resize();
requestAnimationFrame(bucle);
