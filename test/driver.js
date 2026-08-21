const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text()); });
  await p.goto('file://' + path.resolve('Pokesan.html'));
  const shot = async n => { await p.waitForTimeout(350); await p.screenshot({ path: 'shots/' + n + '.png' }); };
  const key = async (k, n) => { for (let i = 0; i < (n || 1); i++) { await p.keyboard.press(k); await p.waitForTimeout(120); } };
  const hold = async (k, ms) => { await p.keyboard.down(k); await p.waitForTimeout(ms); await p.keyboard.up(k); await p.waitForTimeout(120); };

  await shot('01_titulo');
  await key('z');                    // arrancar
  await shot('02_nombre');
  await key('z');                    // elegir nombre
  await shot('03_intro');
  await key('z', 16);                 // pasar dialogo
  await shot('04_casa');
  await hold('ArrowDown', 1200);      // salir de la pieza
  await shot('05_barrio');
  await hold('ArrowUp', 400);
  await hold('ArrowLeft', 700);
  await shot('06_calle');


  // batalla forzada
  await p.evaluate(() => {
    modo = 'mundo';
    darBicho(crearBicho('chorimon', 9)); darBicho(crearBicho('yuyin', 8));
    darObjeto('chapita', 5);
    empezarBatalla({ tipo: 'salvaje', eq: [crearBicho('palomin', 8)] });
  });
  await shot('08_batalla_intro');
  await key('z', 2);
  await shot('09_batalla_menu');
  await key('z');
  await shot('10_ataques');
  await key('z');
  await p.waitForTimeout(500);
  await shot('11_pelea');
  await key('z', 6);
  await shot('12_pelea2');

  // menus
  await p.evaluate(() => { if (modo === 'batalla') { B = null; modo = 'mundo'; } });
  await key('Enter');
  await shot('13_menu');
  await key('z');
  await shot('14_bichos');
  await key('z');
  await shot('15_ficha');
  await key('x'); await key('x');
  await key('ArrowDown'); await key('z');
  await shot('16_bolso');

  // grilla con todos los bichos para revisar el arte
  await p.evaluate(() => {
    paso = function(){};
    rect(0, 0, W, H, PAL['4']);
    const ids = Object.keys(BICHOS);
    ids.forEach((id, i) => { blit(spriteMon(id), (i % 5) * 32, ((i / 5) | 0) * 48, 1.3); });
  });
  await p.screenshot({ path: 'shots/07_bichos.png' });
  console.log(errs.length ? errs.join('\n') : 'sin errores de js');
  await b.close();
})();
