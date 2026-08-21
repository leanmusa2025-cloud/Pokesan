const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 420, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve('Pokesan.html'));
  const lugares = [['plaza', 9, 8], ['cancha', 9, 8], ['baldio', 9, 8], ['riachuelo', 8, 6], ['terminal', 9, 7], ['kiosco', 2, 5], ['taller', 4, 4]];
  for (const [m, x, y] of lugares) {
    await p.evaluate(([m, x, y]) => {
      if (!G) { nuevaPartida('Test'); }
      modo = 'mundo'; dlg = null; MN = null; B = null; fade.v = 0; fade.dir = 0;
      irAMapa(m, x, y, 'd'); cartelNom = 0;
      camaraSeguir(); dibujarMundo();
    }, [m, x, y]);
    await p.waitForTimeout(200);
    await p.screenshot({ path: 'shots/m_' + m + '.png', clip: { x: 10, y: 262, width: 400, height: 360 } });
  }
  console.log(errs.length ? errs.join('\n') : 'mapas ok');
  await b.close();
})();
