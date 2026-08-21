const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await p.goto('file://' + path.resolve('Pokesan.html'));

  // ---- captura ----
  console.log('captura:', JSON.stringify(await p.evaluate(() => {
    nuevaPartida('Test'); modo = 'mundo'; irAMapa('plaza', 2, 4, 'd');
    darBicho(crearBicho('chorizon', 30)); darObjeto('tuper', 40);
    empezarBatalla({ tipo: 'salvaje', eq: [crearBicho('palomin', 5)] });
    let n = 0;
    while (modo === 'batalla' && n < 8000) {
      // A siempre; en el menu principal ir al BOLSO y tirar chapita
      if (B && B.fase === 'menu') { B.sel = 2; }
      if (B && B.fase === 'bolso') { B.sel = B.lista.indexOf('tuper'); }
      KP.a = 1; K.a = 1; paso(); K.a = 0; n++;
    }
    return { pasos: n, modo, equipo: G.equipo.length, ultimo: G.equipo[G.equipo.length - 1].mote };
  })));

  // ---- derrota (te desmayas) ----
  console.log('derrota:', JSON.stringify(await p.evaluate(() => {
    nuevaPartida('Test'); modo = 'mundo'; irAMapa('baldio', 5, 5, 'd');
    G.guita = 800;
    darBicho(crearBicho('yuyin', 3)); G.equipo[0].hp = 1;
    empezarBatalla({ tipo: 'salvaje', eq: [crearBicho('bondimon', 40)] });
    let n = 0;
    while (n < 8000) { if (modo === 'mundo' && fade.dir === 0 && !B && n > 30) break; KP.a = 1; K.a = 1; paso(); K.a = 0; n++; }
    return { pasos: n, modo, mapa: G.mapa, guita: G.guita, hp: G.equipo[0].hp };
  })));

  // ---- fuzz: teclas al azar por todo el juego ----
  console.log('fuzz:', JSON.stringify(await p.evaluate(() => {
    nuevaPartida('Test'); modo = 'mundo'; irAMapa('barrio', 10, 9, 'd');
    darBicho(crearBicho('chorimon', 14)); darBicho(crearBicho('riachin', 12));
    darObjeto('chapita', 30); darObjeto('sanguche', 20); darObjeto('bizcochito', 5);
    const ks = ['up', 'dn', 'lf', 'rt', 'a', 'b', 'st'];
    const vistos = {};
    for (let i = 0; i < 120000; i++) {
      const k = ks[(Math.random() * ks.length) | 0];
      if (Math.random() < 0.5) { KP[k] = 1; K[k] = 1; }
      paso();
      for (const kk of ks) K[kk] = 0;
      vistos[modo] = (vistos[modo] || 0) + 1;
      if (G.flags.termino) break;
    }
    return { modos: vistos, mapa: G.mapa, medallas: G.medallas.length, equipo: G.equipo.length, pasos: G.pasos, guita: G.guita };
  })));

  console.log(errs.length ? errs.join('\n') : 'sin errores de js');
  await b.close();
})();
