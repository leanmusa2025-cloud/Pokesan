const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  await p.goto('file://' + path.resolve('Pokesan.html'));
  const key = async (k, n, w) => { for (let i = 0; i < (n || 1); i++) { await p.keyboard.press(k); await p.waitForTimeout(w || 90); } };
  const autoJugar = (max) => p.evaluate((max) => {
    let n = 0;
    while (n < max) {
      if (modo !== 'batalla' && modo !== 'dialogo' && fade.dir === 0 && n > 4) break;
      KP.a = 1; K.a = 1; paso(); K.a = 0; n++;
    }
    return { pasos: n, modo, med: G.medallas.length, guita: G.guita, eq: G.equipo.map(b => b.mote + ' ' + b.hp) };
  }, max);
  const st = () => p.evaluate(() => ({ modo, mapa: G && G.mapa, eq: G && G.equipo.map(b => b.mote + ' N' + b.lvl + ' ' + b.hp + '/' + b.hpMax), med: G && G.medallas, guita: G && G.guita, fase: B && B.fase }));
  const log = async (t) => console.log(t, JSON.stringify(await st()));

  // arrancar partida
  await key('z', 2, 200);
  await key('z', 20);
  await log('1 casa   ');

  // ir al taller y agarrar bicho
  await p.evaluate(() => { irAMapa('taller', 4, 3, 'u'); });
  await key('z', 30);                      // dialogo de chirola
  await p.evaluate(() => { });
  await log('2 eleccion');
  await key('z', 1);                       // elegir Chorimon
  await key('z', 24);
  await log('3 starter');

  // batalla salvaje en la plaza
  await p.evaluate(() => { G.equipo[0].lvl = 12; G.equipo[0].hpMax = statHP(BICHOS[G.equipo[0].id].b[0], 12); G.equipo[0].hp = G.equipo[0].hpMax; irAMapa('plaza', 2, 4, 'u'); });
  let intentos = 0;
  while (intentos++ < 40) {
    await p.keyboard.down('ArrowUp'); await p.waitForTimeout(320); await p.keyboard.up('ArrowUp');
    await p.keyboard.down('ArrowDown'); await p.waitForTimeout(320); await p.keyboard.up('ArrowDown');
    const s = await st(); if (s.modo === 'batalla') break;
  }
  await log('4 salvaje');
  await p.screenshot({ path: 'shots/f1_salvaje.png' });
  // tirar chapita
  await key('ArrowDown', 1); await key('ArrowRight', 1); await key('z', 1);  // BOLSO
  await key('z', 10);
  await log('5 chapita');
  // si sigue la batalla, pelear hasta terminar
  console.log('   salvaje auto:', JSON.stringify(await autoJugar(20000)));
  await log('6 fin batalla');

  // gimnasio: doña rosa
  await p.evaluate(() => {
    G.equipo.length = 0;
    darBicho(crearBicho('chorizon', 40)); darBicho(crearBicho('riachonzo', 40)); darBicho(crearBicho('bondimon', 40));
    irAMapa('plaza', 12, 5, 'r');
  });
  await key('z', 14);
  await log('7 pre-gym');
  await p.screenshot({ path: 'shots/f2_gym.png' });
  console.log('   gym auto:', JSON.stringify(await autoJugar(20000)));
  await key('z', 16);
  await log('8 post-gym');

  // el kiosco
  await p.evaluate(() => { irAMapa('kiosco', 2, 4, 'u'); });
  await key('z', 4);
  await key('ArrowDown', 1); await key('z', 1);
  await p.screenshot({ path: 'shots/f3_tienda.png' });
  await log('9 tienda ');
  await key('z', 2); await key('x', 2);

  // jefe final
  await p.evaluate(() => { irAMapa('terminal', 9, 6, 'u'); G.medallas = ['a', 'b', 'c']; });
  await key('z', 14);
  await log('10 pre-final');
  console.log('   final auto:', JSON.stringify(await autoJugar(60000)));
  await key('z', 20);
  await log('11 final');
  console.log('debug B:', JSON.stringify(await p.evaluate(() => B ? { fase: B.fase, msg: B.msg, q: B.q.length, ene: BICHOS[ene().id].n + ' ' + ene().hp, ei: B.ei, mio: yo().mote + ' ' + yo().hp } : 'sin batalla')));
  await p.screenshot({ path: 'shots/f4_final.png' });
  console.log(errs.length ? errs.join('\n') : 'sin errores de js');
  await b.close();
})();
