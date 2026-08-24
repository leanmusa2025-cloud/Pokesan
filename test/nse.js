const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await p.goto('file://' + path.resolve('NoSaleElSol.html'));
  const shot = async n => { await p.waitForTimeout(280); await p.screenshot({ path: 'shots2/' + n + '.png' }); };
  const key = async (k, n, w) => { for (let i = 0; i < (n || 1); i++) { await p.keyboard.press(k); await p.waitForTimeout(w || 80); } };
  const st = () => p.evaluate(() => ({ modo, zona: G && G.zona, cap: G && G.cap, hora: G && relojTexto(G.min), pistas: G && Object.keys(G.pistas).length, berr: G && G.berretines.length }));
  // pararse al lado de un NPC y mirarlo
  const irA = (zona, npc) => p.evaluate(([z, n]) => {
    modo = 'mundo'; dlg = null; D = null; LB = null; MP = null; fade.v = 0; fade.dir = 0;
    entrarZona(z, 1, 1, 'd');
    const t = MAPAS[z].npcs.find(x => x.n === n || x.duelo === n);
    P.x = t.x; P.y = t.y + 1; P.dir = 'u'; P.mov = 0; P.off = 0;
    if (SOLID.includes(MAPAS[z].t[t.y + 1][t.x])) { P.x = t.x + 1; P.y = t.y; P.dir = 'l'; }
    camaraSeguir();
  }, [zona, npc]);

  await shot('01_titulo');
  await key('z'); await shot('02_2010'); await key('z', 14); await shot('03_quinta_dia');
  // 2010 -> 2026
  await p.evaluate(() => { modo = 'mundo'; dlg = null; NPCS.juan2010.dial(); });
  await p.waitForTimeout(900); await key('z', 22);
  await shot('04_casa'); console.log('cap1 :', JSON.stringify(await st()));

  await irA('casa', 'oso'); await key('z', 12); await shot('05_oso');

  await irA('fiambreria', 'hermana'); await key('z', 28);
  await shot('06_hermana'); console.log('DNI  :', JSON.stringify(await st()));

  await p.evaluate(() => { modo = 'mundo'; dlg = null; entrarZona('nunez', 5, 5, 'd'); });
  await p.waitForTimeout(400); await key('z', 30);
  console.log('cap3 :', JSON.stringify(await st()));
  await p.evaluate(() => { modo = 'mundo'; dlg = null; });
  await key('x'); await shot('07_mapa_completo');
  await key('ArrowLeft', 3); await shot('08_mapa_sel');
  await key('z'); await p.waitForTimeout(1500); await shot('09_llegada');
  console.log('viaje:', JSON.stringify(await st()));

  // duelo: el Tortuga
  await irA('indep', 'tortuga'); await key('z', 2); await shot('10_duelo');
  for (let i = 0; i < 6; i++) { await key('z', 4); }
  await shot('11_duelo2');
  await p.evaluate(() => { let n = 0; while (modo === 'duelo' && n < 4000) { KP.a = 1; K.a = 1; paso(); K.a = 0; n++; } });
  await key('z', 4); console.log('duelo:', JSON.stringify(await st()));

  // Musa, la Costa Negra y el archivo
  await irA('musa', 'musa'); await key('z', 34);
  await p.evaluate(() => { modo = 'mundo'; dlg = null; entrarZona('costanegra', 11, 6, 'u'); });
  await key('z', 24); await shot('12_costanegra');
  await p.evaluate(() => { modo = 'mundo'; dlg = null; entrarZona('roma', 10, 5, 'u'); });
  await key('z', 22); console.log('pistas:', JSON.stringify(await st()));

  // Juan -> atar cabos
  await irA('kers', 'juan');
  await key('z', 2);
  await p.evaluate(() => { let n = 0; while (modo === 'duelo' && n < 4000) { KP.a = 1; K.a = 1; paso(); K.a = 0; n++; } });
  await key('z', 6);
  await p.evaluate(() => { modo = 'mundo'; dlg = null; });
  await key('Enter'); await shot('13_libreta');
  await key('ArrowDown', 4); await key('z'); await key('z', 40);
  console.log('cabos:', JSON.stringify(await p.evaluate(() => ({ quinta: !!G.flags.quinta, pistas: Object.keys(G.pistas).length }))));
  await p.evaluate(() => { modo = 'mundo'; dlg = null; });
  await key('x'); await shot('14_mapa_quinta');

  // el final
  await p.evaluate(() => { modo = 'mundo'; dlg = null; entrarZona('quinta', 9, 7, 'd'); });
  await key('z', 20); await shot('15_final');
  await p.evaluate(() => { let n = 0; while (modo !== 'epilogo' && n < 4000) { KP.a = 1; K.a = 1; paso(); K.a = 0; n++; } return modo; });
  await p.waitForTimeout(500); await shot('16_epilogo');
  console.log('final:', JSON.stringify(await p.evaluate(() => ({ modo, luz: LUZ }))));
  console.log('errores:', errs.length ? errs.slice(0, 5).join(' | ') : 'ninguno');
  await b.close();
})();
