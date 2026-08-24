// ============================================================
//  ARRANQUE, CAPITULOS Y FINALES
// ============================================================
function drawTextBig(s, x, y, color, sc) {
  const w = textWidth(s) + 2, tmp = document.createElement('canvas');
  tmp.width = w; tmp.height = 9;
  const c = tmp.getContext('2d'), a = glyphAtlas(color);
  let cx = 0;
  for (const ch of s) {
    const g = GLYPHS[ch] || GLYPHS['?'];
    const p = a.pos[ch] !== undefined ? a.pos[ch] : a.pos['?'];
    c.drawImage(a.cv, p, 0, 8, 8, cx, 0, 8, 8); cx += g.w + 1;
  }
  blit(tmp, x, y, sc);
}
const centrar = (s, sc) => (W - textWidth(s) * (sc || 1)) / 2;

// el 2010 tiene su propio mapa
MAPAS.quinta2010 = {
  t: MAPAS.quinta.t,
  npcs: [{ x: 2, y: 9, d: 'd', n: 'juan2010' }, { x: 15, y: 11, d: 'l', n: 'chapa2010' }],
  obj: [{ x: 8, y: 5, txt: 'La pileta. Alguien tiro\nuna reposera adentro.' }],
  amb: ''
};
NPCS.juan2010 = { nom: 'Juan', look: 'juan', dial: () => {
  G.flags.juan2010 = 1;
  return ['¡Feliz cumple, boludo!',
    'Dieciocho. Ya sos un\nviejo choto.',
    'Uh, mira la hora.',
    'Che... quedate a dormir.',
    'Deja las cosas aca que\nmañana las buscas.'];
}};
NPCS.chapa2010 = { nom: 'El Gordo Chapa', look: 'chapa', dial: () => [
  'Traje los parlantes.',
  'Esta noche no se corta\nla musica ni a palos.'] };

let TIT = { t: 0, sel: 0, hay: false };
function updTitulo() {
  TIT.t++;
  if (KP.a || KP.st) {
    Audio2.unlock(); Audio2.sfx('sel');
    if (TIT.hay && TIT.sel === 0) {
      const s = loadGame();
      if (s && s.G) {
        G = s.G; ponerLuz('noche'); modo = 'mundo'; Audio2.play('noche');
        entrarZona(G.zona, s.P.x, s.P.y, s.P.dir); return;
      }
    }
    return empezar2010();
  }
  if ((KP.up || KP.dn) && TIT.hay) { TIT.sel = 1 - TIT.sel; Audio2.sfx('bip'); }
}
function dibujarTitulo() {
  rect(0, 0, W, H, PAL['0']);
  for (let i = 0; i < 40; i++) {
    const x = (i * 61) % 160, y = (i * 37) % 60;
    rect(x, y, 1, 1, i % 3 ? PAL['2'] : PAL['3']);
  }
  // siluetas de torres
  const sil = [[2, 74, 18, 70], [22, 62, 14, 82], [38, 84, 22, 60], [62, 70, 16, 74],
  [80, 88, 26, 56], [108, 66, 18, 78], [128, 92, 30, 52]];
  for (const s of sil) {
    rect(s[0], s[1], s[2], s[3], PAL['1']);
    for (let y = s[1] + 4; y < 144; y += 9)
      for (let x = s[0] + 3; x < s[0] + s[2] - 2; x += 7)
        if ((x * 7 + y * 5) % 6 < 2) rect(x, y, 2, 3, PAL['i']);
  }
  drawTextBig('NO SALE', centrar('NO SALE', 2), 16, PAL['s'], 2);
  drawTextBig('EL SOL', centrar('EL SOL', 2), 34, PAL['s'], 2);
  drawText(ctx, 'Avellaneda, 2026', centrar('Avellaneda, 2026'), 56, PAL['h']);
  const ops = TIT.hay ? ['SEGUIR', 'DE CERO'] : ['ARRANCAR'];
  panel(48, 100, 64, ops.length * 12 + 10);
  for (let i = 0; i < ops.length; i++) {
    drawText(ctx, ops[i], 64, 105 + i * 12, COL.texto);
    if (TIT.sel === i) drawText(ctx, '>', 54, 105 + i * 12, COL.acento);
  }
  if ((TIT.t >> 4) & 1) drawText(ctx, 'A / START', centrar('A / START'), 132, PAL['4']);
}

// ---- capitulo 0: la quinta, 2010 ----
function empezar2010() {
  nuevaPartida();
  G.zona = 'quinta2010'; G.cap = 0;
  ponerLuz('dia'); Audio2.play('verano');
  modo = 'mundo';
  entrarZona('quinta2010', 2, 12, 'u');
  cartel = 0;
  decir(['VERANO DE 2010.',
    'Tu quinta. Tu cumpleaños\nde dieciocho.',
    'Vinieron veinte.',
    'Es la ultima vez que van\na estar todos juntos,',
    'pero eso todavia no lo\nsabe nadie.',
    '(Hablá con Juan.)']);
}
function chequear2010() {
  if (G.cap === 0 && G.flags.juan2010 && modo === 'mundo') {
    G.cap = 1;
    fundir(() => {
      ponerLuz('noche'); Audio2.play('noche');
      entrarZona('casa', 5, 6, 'd');
      G.stack = 3; G.ultimaRaya = MIN_INICIO;
      decir(['DIECISEIS AÑOS DESPUES.',
        'Hace un mes que no sale\nel sol.',
        'En la radio dijeron que\nen 24 horas arranca',
        'el estado de sitio.',
        'Antes de que cierren\ntodo tenes que comprar.',
        'Medio kilo. Tenes la\nguita junta.',
        'La Tia te paso un punto\nde encuentro:',
        'la vieja fiambreria\ndonde laburabas.',
        '(B = subir al Fox)\n(Enter = libreta)']);
    });
  }
}

// ---- capitulo 3: llamar a Fredy ----
function chequearCapitulo() {
  if (G.cap === 2 && modo === 'mundo' && !dlg && G.zona !== 'fiambreria') {
    G.cap = 3;
    decir(['No podes ir a la cana.\nTu documento estaba ahi.',
      'Hay un solo tipo que se\nmueve de noche por aca.',
      'El que te vendia antes.\nEl que dejaste sin avisar.',
      '...',
      'Lo llamas.',
      'Atiende al segundo tono.'],
      () => {
        decir(NPCS.fredy.dial(), () => {
          decir(['(Le dijiste que buscas a\nuna tia tuya.)',
            '(Un familiar.)',
            '(No es mentira del todo:\nasi le dice todo el mundo.)',
            '(Ahora se abrio todo el\npartido en el mapa.)']);
        });
      });
  }
}

// ---- atar cabos ----
function atarCabos() {
  G.flags.quinta = 1;
  Audio2.sfx('pista');
  decir(['Sacas el documento y lo\nmiras de nuevo.',
    'Vencido. Foto tuya a los\ndieciocho.',
    'Juan lo tenia guardado\nhace dieciseis años.',
    '...',
    'Pero Juan no lo saco de\nningun lado.',
    'Se le quedo esa noche.',
    'La noche de tu cumple.',
    'En la quinta.',
    '...',
    'Fredy tiene el documento\ny tiene el dato del lugar.',
    'Se los dio los dos el\nmismo pibe.',
    'Pero nadie le dijo nunca\nque eran la misma cosa.',
    '...',
    'La prueba que dejo para\nhundirte',
    'es la direccion donde la\ntiene.',
    '*LA QUINTA se abrio en\nel mapa*']);
}

// ---- el final ----
function escenaFinal() {
  if (G.flags.finalVisto) return;
  G.flags.finalVisto = 1; G.cap = 8;
  decir(['La puerta esta abierta.',
    '...',
    'Adentro hay luz. Y olor\na comida.',
    '...',
    'Estan los dos.',
    'Sentados en la cocina de\ntu casa de la infancia.',
    'Hablando en un idioma que\nes el tuyo',
    'pero de un lugar que no.',
    'De gente que no conoces.\nDe cosas del 2009.',
    '...',
    'Ella te ve y no se\nsorprende.',
    'Fredy tampoco.',
    'No te estaban esperando.'],
    () => empezarDuelo('fredy'));
}

function desenlace() {
  const denunciable = 1;
  preguntar(['Fredy pone el medio kilo\narriba de la mesa.',
    '"Llevatelo y andate."',
    '"Y esto no paso."',
    '...',
    'Ella no dice nada.',
    'Se queda mirando el\nmantel.',
    '¿Que hacés?'],
    ['Agarrarlo', 'Dejarlo ahi'], (s) => {
      G.flags.agarro = (s === 0);
      fundir(() => { ponerLuz('dia'); Audio2.play('verano'); epilogo(); });
    });
}
function amanecerSinLlegar() {
  G.flags.tarde = 1;
  fundir(() => { ponerLuz('dia'); Audio2.play('verano'); epilogo(); });
}

// ---- epilogo ----
let EP = null;
function epilogo() {
  modo = 'epilogo';
  EP = { y: 0, t: 0, lineas: armarEpilogo() };
}
function armarEpilogo() {
  const L = [];
  L.push('', '', '');
  if (G.flags.tarde) {
    L.push('Amanecio.', '', 'No llegaste.', '',
      'A las seis en punto', 'entraron por el puente.', '');
  } else {
    L.push('Volviste por la autopista.', '',
      'Avellaneda se fue por la', 'ventana de atras.', '');
    L.push('Y en el camino,', 'sin que nadie lo anuncie,', 'empezo a aclarar.', '');
  }
  L.push('---', '');
  if (G.usos === 0) {
    L.push('EL SOL', '',
      'No usaste nada en toda', 'la noche.', '',
      'Podes mirarlo de frente.', '',
      'Te dura tres segundos y', 'despues te arden los ojos.', '',
      'Pero lo miraste.', '');
  } else if (G.ayudados >= 3 && G.guita < 250000) {
    L.push('EL QUE LLEGO SIN NADA', '',
      'Gastaste la guita en', 'el camino.', '',
      'En coimas, en remedios,', 'en gente.', '',
      'No pudiste comprar nada.', '',
      'Pero llegaste con ocho', 'personas atras.', '');
  } else if (G.ayudados === 0) {
    L.push('EL QUE FUE SOLO', '',
      'No paraste a ayudar a', 'nadie.', '',
      'Llegaste solo.', '',
      'Y no hubo escena.', '');
  } else if (G.pistas.laTia) {
    L.push('EL QUE SE DIO CUENTA', '',
      'Lo escuchaste decir', '"la Tia" a las tres de', 'la mañana.', '',
      'Y desde ahi manejaste', 'sabiendo.', '',
      'Eso no lo hizo mas facil.', '');
  } else {
    L.push('EL ARREGLO', '',
      'Se quedaron juntos.', '',
      'Quince años, otro pais,', 'gente en comun.', '',
      'Vos eras el cliente.', '');
  }
  L.push('', '---', '');
  if (G.flags.agarro) L.push('Te llevaste el medio kilo.', '', 'Nadie te va a preguntar', 'de donde salio.', '');
  else if (G.flags.agarro === false) L.push('Lo dejaste arriba de la', 'mesa.', '', 'No sabes bien por que.', '');
  L.push('', 'Nunca supiste como se', 'llamaba de verdad.', '');
  L.push('', 'Pistas juntadas: ' + Object.keys(G.pistas).length,
    'Berretines aprendidos: ' + G.berretines.length,
    'Gente que ayudaste: ' + G.ayudados,
    'Veces que aguantaste: ' + G.usos, '');
  L.push('', '', 'NO SALE EL SOL', 'Avellaneda, 2026', '', '',
    'Hecho en el conurbano.', '', '', 'A = volver al titulo', '');
  return L;
}
function updEpilogo() {
  EP.t++; EP.y += 0.32;
  if (KP.a && EP.t > 90) { ponerLuz('noche'); modo = 'titulo'; TIT.hay = !!loadGame(); Audio2.play('noche'); }
}
function dibujarEpilogo() {
  rect(0, 0, W, H, PAL['e']);
  rect(0, 96, W, 48, PAL['b']);
  rect(0, 92, W, 4, PAL['a']);
  // el sol
  ctx.fillStyle = PAL['i'];
  ctx.beginPath(); ctx.arc(128, 26, 12, 0, 7); ctx.fill();
  for (let i = 0; i < EP.lineas.length; i++) {
    const y = 150 + i * 11 - EP.y;
    if (y < -12 || y > 150) continue;
    const t = EP.lineas[i];
    drawText(ctx, t, centrar(t), y, t === t.toUpperCase() && t.length > 3 ? PAL['0'] : PAL['1']);
  }
}

// ============================================================
//  BUCLE
// ============================================================
let acumulado = 0, ultimo = 0;
function paso(dibujar) {
  if (dibujar === undefined) dibujar = true;
  if (fade.dir === 1) {
    fade.v += 0.08;
    if (fade.v >= 1) { fade.v = 1; fade.dir = -1; const c = fade.cb; fade.cb = null; c && c(); }
  } else if (fade.dir === -1) {
    fade.v -= 0.08; if (fade.v <= 0) { fade.v = 0; fade.dir = 0; }
  } else {
    if (modo === 'titulo') updTitulo();
    else if (modo === 'mundo') { updMundo(); chequear2010(); chequearCapitulo(); }
    else if (modo === 'dialogo') updDlg();
    else if (modo === 'mapa') updMapa();
    else if (modo === 'viaje') updViaje();
    else if (modo === 'duelo') updDuelo();
    else if (modo === 'libreta') updLibreta();
    else if (modo === 'epilogo') updEpilogo();
  }
  if (!dibujar) { clearPressed(); return; }

  if (modo === 'titulo') dibujarTitulo();
  else if (modo === 'mapa') dibujarMapaPartido();
  else if (modo === 'viaje') dibujarViaje();
  else if (modo === 'duelo') dibujarDuelo();
  else if (modo === 'libreta') dibujarLibreta();
  else if (modo === 'epilogo') dibujarEpilogo();
  else { camaraSeguir(); dibujarMundo(); if (modo === 'dialogo' && dlg) dibujarDlg(); }
  if (fade.v > 0) { ctx.fillStyle = 'rgba(3,3,8,' + fade.v + ')'; ctx.fillRect(0, 0, W, H); }
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
reconstruirArte();
TIT.hay = !!loadGame();
resize();
requestAnimationFrame(bucle);
