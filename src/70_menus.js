// ============================================================
//  MENUES, KIOSCO Y ESCENAS
// ============================================================
let MN = null;
function abrirMenu() { MN = { p: 'principal', sel: 0, sel2: 0, top: 0 }; modo = 'menu'; Audio2.sfx('sel'); }
function cerrarMenu() { MN = null; modo = 'mundo'; }

const MENU_OP = ['BICHOS', 'BOLSO', 'MEDALLAS', 'GUARDAR', 'SALIR'];

function updMenu() {
  const p = MN.p;
  if (p === 'principal') {
    if (KP.up) { MN.sel = (MN.sel + MENU_OP.length - 1) % MENU_OP.length; Audio2.sfx('bip'); }
    if (KP.dn) { MN.sel = (MN.sel + 1) % MENU_OP.length; Audio2.sfx('bip'); }
    if (KP.b || KP.st) { Audio2.sfx('sel'); cerrarMenu(); return; }
    if (KP.a) {
      Audio2.sfx('sel');
      if (MN.sel === 0) { MN.p = 'bichos'; MN.sel2 = 0; }
      else if (MN.sel === 1) { MN.p = 'bolso'; MN.sel2 = 0; }
      else if (MN.sel === 2) { MN.p = 'medallas'; }
      else if (MN.sel === 3) {
        const ok = saveGame(G);
        MN.p = 'aviso'; MN.txt = ok ? 'Guardado en el teléfono.\nPodés cerrar tranquilo.' : 'No se pudo guardar.\n(Modo incógnito?)';
      }
      else cerrarMenu();
    }
    return;
  }
  if (p === 'aviso' || p === 'medallas') {
    if (KP.a || KP.b) { Audio2.sfx('sel'); MN.p = 'principal'; }
    return;
  }
  if (p === 'bichos') {
    const n = G.equipo.length;
    if (KP.up && n) { MN.sel2 = (MN.sel2 + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.dn && n) { MN.sel2 = (MN.sel2 + 1) % n; Audio2.sfx('bip'); }
    if (KP.b) { Audio2.sfx('sel'); MN.p = 'principal'; return; }
    if (KP.a && n) { Audio2.sfx('sel'); MN.p = 'ficha'; }
    return;
  }
  if (p === 'ficha') {
    if (KP.a || KP.b) { Audio2.sfx('sel'); MN.p = 'bichos'; }
    return;
  }
  if (p === 'bolso') {
    const l = Object.keys(G.objetos), n = l.length;
    if (KP.up && n) { MN.sel2 = (MN.sel2 + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.dn && n) { MN.sel2 = (MN.sel2 + 1) % n; Audio2.sfx('bip'); }
    if (KP.b) { Audio2.sfx('sel'); MN.p = 'principal'; return; }
    if (KP.a && n) {
      const it = OBJETOS[l[MN.sel2]];
      Audio2.sfx('sel');
      if (it.tipo === 'cura' || it.tipo === 'estado' || it.tipo === 'revive') { MN.p = 'usarEn'; MN.item = l[MN.sel2]; MN.sel3 = 0; }
      else { MN.p = 'aviso'; MN.txt = it.n + '.\n' + it.d; }
    }
    return;
  }
  if (p === 'usarEn') {
    const n = G.equipo.length;
    if (KP.up) { MN.sel3 = (MN.sel3 + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.dn) { MN.sel3 = (MN.sel3 + 1) % n; Audio2.sfx('bip'); }
    if (KP.b) { Audio2.sfx('sel'); MN.p = 'bolso'; return; }
    if (KP.a) {
      const b = G.equipo[MN.sel3], it = OBJETOS[MN.item];
      if (it.tipo === 'revive') {
        if (b.hp > 0) { MN.p = 'aviso'; MN.txt = 'Ese está bien despierto.'; return; }
        b.hp = Math.floor(b.hpMax / 2); b.estado = ''; sacarObjeto(MN.item);
        Audio2.sfx('curar'); MN.p = 'aviso'; MN.txt = b.mote + ' se levantó.\n"¿Qué pasó?"';
      } else if (it.tipo === 'estado') {
        if (!b.estado) { MN.p = 'aviso'; MN.txt = 'No le pasa nada.'; return; }
        b.estado = ''; sacarObjeto(MN.item); Audio2.sfx('curar');
        MN.p = 'aviso'; MN.txt = b.mote + ' quedó como nuevo.';
      } else {
        if (b.hp <= 0) { MN.p = 'aviso'; MN.txt = 'Ese está desmayado.\nNecesita un Bizcochito.'; return; }
        if (b.hp >= b.hpMax) { MN.p = 'aviso'; MN.txt = 'Está al mango de vida.'; return; }
        const c = Math.min(it.cura, b.hpMax - b.hp); b.hp += c;
        if (it.limpia) b.estado = '';
        sacarObjeto(MN.item); Audio2.sfx('curar');
        MN.p = 'aviso'; MN.txt = b.mote + ' recuperó ' + c + ' de vida.';
      }
      if (!G.objetos[MN.item]) MN.sel2 = 0;
    }
    return;
  }
  if (p === 'tienda') {
    const l = MN.stock, n = l.length + 1;
    if (KP.up) { MN.sel2 = (MN.sel2 + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.dn) { MN.sel2 = (MN.sel2 + 1) % n; Audio2.sfx('bip'); }
    if (KP.b) { Audio2.sfx('sel'); cerrarMenu(); return; }
    if (KP.a) {
      Audio2.sfx('sel');
      if (MN.sel2 >= l.length) { cerrarMenu(); return; }
      const id = l[MN.sel2], it = OBJETOS[id];
      if (G.guita < it.precio) { MN.p = 'aviso2'; MN.txt = 'No te alcanza, pibe.\n"Fiado no, que ya me fundí una vez."'; return; }
      G.guita -= it.precio; darObjeto(id, 1); Audio2.sfx('plata');
      MN.p = 'aviso2'; MN.txt = 'Te llevaste un ' + it.n + '.\n"Gracias, volvé cuando quieras."';
    }
    return;
  }
  if (p === 'aviso2') { if (KP.a || KP.b) { Audio2.sfx('sel'); MN.p = 'tienda'; } return; }
}

function dibujarMenu() {
  const p = MN.p;
  if (p === 'principal') {
    const w = 76, x = W - w - 4, h = MENU_OP.length * 12 + 10;
    panel(x, 4, w, h);
    for (let i = 0; i < MENU_OP.length; i++) {
      drawText(ctx, MENU_OP[i], x + 15, 9 + i * 12, PAL['0']);
      if (MN.sel === i) drawText(ctx, '>', x + 6, 9 + i * 12, PAL['0']);
    }
    panel(4, 108, 90, 32);
    drawText(ctx, G.nombre, 10, 113, PAL['0']);
    drawText(ctx, '$' + G.guita, 10, 126, PAL['0']);
    return;
  }
  if (p === 'bichos' || p === 'usarEn') {
    const sel = p === 'bichos' ? MN.sel2 : MN.sel3;
    rect(0, 0, W, H, PAL['4']);
    panel(0, 0, W, H);
    drawText(ctx, p === 'usarEn' ? '¿A quién?' : 'TU BANDA', 8, 5, PAL['0']);
    for (let i = 0; i < G.equipo.length; i++) {
      const b = G.equipo[i], y = 18 + i * 20;
      blit(spriteMon(b.id), 11, y - 2, 0.6);
      drawText(ctx, b.mote, 34, y, b.hp > 0 ? PAL['0'] : PAL['3']);
      drawText(ctx, 'N' + b.lvl, 118, y, PAL['0']);
      barraHP(34, y + 11, 60, b.hp, b.hpMax);
      drawText(ctx, b.hp + '/' + b.hpMax, 100, y + 8, PAL['0']);
      if (sel === i) drawText(ctx, '>', 3, y, PAL['0']);
    }
    if (!G.equipo.length) drawText(ctx, 'No tenés ni un bicho.', 8, 30, PAL['0']);
    drawText(ctx, 'A = ver   B = volver', 8, 134, PAL['2']);
    return;
  }
  if (p === 'ficha') {
    const b = G.equipo[MN.sel2], e = BICHOS[b.id];
    rect(0, 0, W, H, PAL['e']);
    panel(0, 0, W, H);
    blit(spriteMon(b.id), 6, 8, 1.6);
    drawText(ctx, b.mote, 58, 10, PAL['0']);
    drawText(ctx, 'NIVEL ' + b.lvl, 58, 22, PAL['0']);
    drawText(ctx, e.t.join('/'), 58, 34, PAL['0']);
    drawText(ctx, 'VIDA ' + b.hp + '/' + b.hpMax, 58, 46, PAL['0']);
    const s = statsDe(b);
    drawText(ctx, 'ATQ ' + s.atk + '  DEF ' + s.def + '  VEL ' + s.vel, 6, 62, PAL['0']);
    for (let i = 0; i < b.ataques.length; i++) {
      const A = ATAQUES[b.ataques[i].id];
      drawText(ctx, A.n, 6, 74 + i * 10, PAL['0']);
      drawText(ctx, b.ataques[i].pp + '/' + b.ataques[i].ppMax, 122, 74 + i * 10, PAL['0']);
    }
    const d = wrapText(e.d, 150);
    for (let i = 0; i < Math.min(3, d.length); i++) drawText(ctx, d[i], 6, 115 + i * 10, PAL['2']);
    return;
  }
  if (p === 'bolso') {
    const l = Object.keys(G.objetos);
    rect(0, 0, W, H, PAL['4']); panel(0, 0, W, H);
    drawText(ctx, 'BOLSO', 8, 5, PAL['0']);
    drawText(ctx, '$' + G.guita, 110, 5, PAL['0']);
    if (!l.length) drawText(ctx, 'Vacío. Como la heladera.', 8, 30, PAL['0']);
    for (let i = 0; i < l.length && i < 8; i++) {
      const k = l[i];
      drawText(ctx, OBJETOS[k].n, 14, 20 + i * 12, PAL['0']);
      drawText(ctx, 'x' + G.objetos[k], 128, 20 + i * 12, PAL['0']);
      if (MN.sel2 === i) drawText(ctx, '>', 4, 20 + i * 12, PAL['0']);
    }
    if (l.length) {
      const d = wrapText(OBJETOS[l[MN.sel2]].d, 148);
      for (let i = 0; i < Math.min(2, d.length); i++) drawText(ctx, d[i], 6, 120 + i * 10, PAL['2']);
    }
    return;
  }
  if (p === 'medallas') {
    rect(0, 0, W, H, PAL['4']); panel(0, 0, W, H);
    drawText(ctx, 'MEDALLAS', 8, 6, PAL['0']);
    if (!G.medallas.length) drawText(ctx, 'Ninguna todavía.', 8, 26, PAL['0']);
    for (let i = 0; i < G.medallas.length; i++) drawText(ctx, '* ' + G.medallas[i], 10, 26 + i * 14, PAL['0']);
    drawText(ctx, 'Bichos vistos: ' + Object.keys(G.vistos).length + '/' + Object.keys(BICHOS).length, 8, 96, PAL['0']);
    drawText(ctx, 'Pasos: ' + G.pasos, 8, 108, PAL['0']);
    drawText(ctx, 'Guita: $' + G.guita, 8, 120, PAL['0']);
    return;
  }
  if (p === 'tienda' || p === 'aviso2') {
    rect(0, 0, W, H, PAL['4']); panel(0, 0, W, H);
    drawText(ctx, 'KIOSCO DE RAMON', 8, 5, PAL['0']);
    drawText(ctx, '$' + G.guita, 118, 5, PAL['0']);
    for (let i = 0; i < MN.stock.length; i++) {
      const it = OBJETOS[MN.stock[i]];
      drawText(ctx, it.n, 14, 20 + i * 12, PAL['0']);
      drawText(ctx, '$' + it.precio, 116, 20 + i * 12, PAL['0']);
      if (MN.sel2 === i) drawText(ctx, '>', 4, 20 + i * 12, PAL['0']);
    }
    drawText(ctx, 'CHAU', 14, 20 + MN.stock.length * 12, PAL['0']);
    if (MN.sel2 >= MN.stock.length) drawText(ctx, '>', 4, 20 + MN.stock.length * 12, PAL['0']);
    if (p === 'aviso2') { panel(0, 96, 160, 48); const ls = MN.txt.split('\n'); for (let i = 0; i < ls.length; i++) drawText(ctx, ls[i], 8, 104 + i * 11, PAL['0']); }
    else {
      panel(0, 108, 160, 36);
      const it = OBJETOS[MN.stock[Math.min(MN.sel2, MN.stock.length - 1)]];
      const d = wrapText(MN.sel2 >= MN.stock.length ? 'Nos vemos, pibe.' : it.d, 144);
      for (let i = 0; i < Math.min(2, d.length); i++) drawText(ctx, d[i], 8, 114 + i * 11, PAL['0']);
    }
    return;
  }
  if (p === 'aviso') {
    dibujarMundo();
    panel(0, 96, 160, 48);
    const ls = MN.txt.split('\n');
    for (let i = 0; i < ls.length; i++) drawText(ctx, ls[i], 8, 104 + i * 11, PAL['0']);
  }
}

// ------------------------------------------------------------
//  ESCENAS ESPECIALES
// ------------------------------------------------------------
function escenaChirola() {
  if (!G.flags.starter) {
    decir([
      '¡Ahí está el pibe! Pasá, pasá.',
      'Vos me conocés: Chirola, el de la\nferretería de Mitre y Belgrano.',
      'Pero hace un tiempo que me dedico\na otra cosa.',
      '¿Viste los bichos raros que andan\npor el baldío y la plaza?',
      'Bueno. Los estudio. Alguien tiene\nque hacerlo, ¿no?',
      'Necesito que me llenes esta libreta.\nAgarrá uno y salí a caminar.',
      'Tengo tres. Elegí bien que después\nno hay cambio.'
    ], () => {
      preguntar('¿Cuál te llevás?', ['Chorimón', 'Yuyín', 'Riachín'], (s) => {
        const id = ['chorimon', 'yuyin', 'riachin'][s];
        const b = crearBicho(id, 5);
        darBicho(b); G.vistos[id] = 1;
        G.flags.starter = id;
        darObjeto('chapita', 5);
        Audio2.sfx('capturado');
        decir([
          '¡' + BICHOS[id].n + '! Buena elección, ese\nes de fierro.',
          '*Te dieron un ' + BICHOS[id].n + '!*',
          'Tomá cinco chapitas. Se las tirás al\nbicho cuando esté cansado y listo.',
          'Cuantas más chapitas, más chances.\nY el bicho tiene que estar flojo, eh.',
          'Ah, el Bocha ya se llevó el suyo.\nEse pibe no para.',
          'Andá a la plaza, después al baldío.\nY tenés que juntar tres medallas.',
          'Con las tres, el Colectivero de la\nterminal te va a recibir.'
        ]);
      });
    });
    return;
  }
  if (G.medallas.length >= 3 && !G.flags.chirolaFinal) {
    G.flags.chirolaFinal = 1;
    darObjeto('tuper', 3); darObjeto('fernet', 2);
    decir(['¡Tres medallas! ¿Y ese pibe flaco\nque no sabía atarse los cordones?',
      'Tomá, para el viaje: tres tupers y\ndos fernets.',
      '*Recibiste 3 Tupers y 2 Fernets!*',
      'Andá a la terminal. Y ojo con el\nColectivero, ese vio cosas.']);
    return;
  }
  const consejos = [
    'Los bichos de tipo GRASA le ganan\na los de YUYO. Anotá.',
    'Si el bicho está flojito de vida,\nla chapita agarra mucho mejor.',
    'Con el TUFO encima pierden vida\nsolos. Barato y efectivo.',
    'Cuando suben de nivel a veces se\ntransforman. Es normal. Creo.',
    'Ramón te cura los bichos gratis.\nAprovechá que después cobra.'
  ];
  decir(['¿Cómo va esa libreta?', consejos[rnd(consejos.length)]]);
}

function escenaKiosco() {
  preguntar(['¿Qué hacés, pibe? ¿Todo bien?'], ['Curar', 'Comprar', 'Nada'], (s) => {
    if (s === 0) {
      decir(['Dale, dejámelos un ratito.'], () => {
        curarTodo(); Audio2.sfx('curar');
        decir(['Listo. Como nuevos.',
          '"Y comé algo vos también, eh."']);
      });
    } else if (s === 1) {
      MN = { p: 'tienda', sel: 0, sel2: 0, stock: ['chapita', 'chapitona', 'tuper', 'sanguche', 'milanga', 'soda', 'bizcochito'] };
      modo = 'menu';
    } else decir(['Cuando quieras, pibe.']);
  });
}

// ------------------------------------------------------------
//  FINAL
// ------------------------------------------------------------
let FIN = { y: 0 };
const CREDITOS = [
  '', '', '', '',
  'FIN', '', '',
  'Ganaste el pase libre del 22.', '',
  'Volviste caminando igual,', 'porque el 22 no pasaba.', '', '',
  'Bichos atrapados y vistos:', '', '', '',
  'GRACIAS POR JUGAR', '',
  'Un homenaje trucho a los', 'juegos de bichos de los 90', '',
  'y a Avellaneda, que', 'aguanta todo.', '', '',
  'Hecho en el conurbano.', '', '', '',
  'Apreta A para volver', 'al barrio.', ''
];
function finalDelJuego() {
  G.flags.termino = 1;
  FIN.y = 0; modo = 'fin';
  Audio2.play('victoria');
}
function updFin() {
  FIN.y += 0.35;
  if (KP.a && FIN.y > 40) { modo = 'mundo'; Audio2.play('barrio'); }
}
function dibujarFin() {
  rect(0, 0, W, H, PAL['0']);
  for (let i = 0; i < CREDITOS.length; i++) {
    const y = 144 + i * 12 - FIN.y;
    if (y < -12 || y > 150) continue;
    const t = CREDITOS[i];
    drawText(ctx, t, (W - textWidth(t)) / 2, y, PAL['5']);
  }
  if (FIN.y > 12 * 15) {
    const t = Object.keys(G.vistos).length + ' de ' + Object.keys(BICHOS).length;
    drawText(ctx, t, (W - textWidth(t)) / 2, 144 + 15 * 12 - FIN.y, PAL['i']);
  }
}
