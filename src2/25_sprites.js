// ============================================================
//  SPRITES: la gente, el Fox y los iconos del mapa
// ============================================================
const P_DOWN = [
  '................','....OOOOOOOO....','...OHHHHHHHHO...','...OHHHHHHHHO...',
  '...OHHHHHHHHO...','...OKKKKKKKKO...','...OKOKKKKOKO...','...OKKKKKKKKO...',
  '....OKKKKKKO....','..OOSSSSSSSSOO..','..OKSSSSSSSSKO..','..OKSSSSSSSSKO..',
  '..OOSSSSSSSSOO..','...OPPPOOPPPO...','...OPPPOOPPPO...','...OZZO..OZZO...'];
const P_UP = [
  '................','....OOOOOOOO....','...OHHHHHHHHO...','...OHHHHHHHHO...',
  '...OHHHHHHHHO...','...OHHHHHHHHO...','...OHHHHHHHHO...','...OHHHHHHHHO...',
  '....OHHHHHHO....','..OOSSSSSSSSOO..','..OKSSSSSSSSKO..','..OKSSSSSSSSKO..',
  '..OOSSSSSSSSOO..','...OPPPOOPPPO...','...OPPPOOPPPO...','...OZZO..OZZO...'];
const P_SIDE = [
  '................','.....OOOOOOO....','....OHHHHHHHO...','....OHHHHHHHO...',
  '....OHHHHHKKO...','....OKKKKKKKO...','....OKKKKOKKO...','....OKKKKKKKO...',
  '.....OKKKKKO....','...OOSSSSSSOO...','...OKSSSSSSKO...','...OKSSSSSSKO...',
  '...OOSSSSSSOO...','....OPPPPPPO....','....OPPPPPPO....','....OZZZZZZO....'];
const LEGS2 = {
  d: ['...OPPPOOPPPO...','..OPPPPOOPPPPO..','..OZZO....OZZO..'],
  s: ['....OPPPPPPO....','...OPPPO.OPPO...','...OZZO...OZZO..']
};
const CAP_DOWN = ['', '', '', '', '..VVVVVVVVVVVV..'];
const CAP_SIDE = ['', '', '', '', '....VVVVVVVVVV..'];
const PELO_DOWN = ['', '', '', '', '', '..VV........VV..', '..VV........VV..', '..VV........VV..', '...V........V...'];

function buildPerson(col) {
  const c = k => PAL[k] || k;
  const C = {
    O: PAL['0'], H: c(col.pelo), K: c(col.piel || 'j'), S: c(col.remera),
    P: c(col.pant || 'c'), Z: c(col.zapas || '1'), V: c(col.extraCol || col.pelo)
  };
  function comp(base, over, legs) {
    let rows = base.slice();
    if (legs) rows = rows.slice(0, 13).concat(legs);
    if (over) rows = rows.map((r, i) => {
      const o = over[i]; if (!o) return r;
      let out = '';
      for (let x = 0; x < r.length; x++) out += (o[x] && o[x] !== '.') ? o[x] : r[x];
      return out;
    });
    return makeSprite(rows, C);
  }
  const over = col.gorra ? CAP_DOWN : (col.pelolargo ? PELO_DOWN : null);
  const overS = col.gorra ? CAP_SIDE : (col.pelolargo ? PELO_DOWN : null);
  const overU = col.gorra ? null : (col.pelolargo ? PELO_DOWN : null);
  return {
    d: [comp(P_DOWN, over, null), comp(P_DOWN, over, LEGS2.d)],
    u: [comp(P_UP, overU, null), comp(P_UP, overU, LEGS2.d)],
    s: [comp(P_SIDE, overS, null), comp(P_SIDE, overS, LEGS2.s)]
  };
}
const SPR = {};
registrarCache(SPR);
function spriteDe(look) { return SPR[look] || (SPR[look] = buildPerson(LOOKS[look] || LOOKS.pibe)); }

// --- el Ford Fox ---
const FOX_ART = [
  '....gggggggg....',
  '...gg111111gg...',
  '..ggeeeeeeeegg..',
  '.gggggggggggggg.',
  'gggggggggggggggg',
  'gggggggggggggggg',
  'gigggggggggggigg',
  '.00gggggggggg00.',
  '.0110......0110.',
  '..00........00..'];

// --- iconos del mapa del partido (8x8) ---
const ICON_ART = {
  torre:   ['.111111.', '.1i11i1.', '.111111.', '.1i11i1.', '.111111.', '.1i11i1.', '.111111.', '.111111.'],
  casa:    ['...gg...', '..gggg..', '.gggggg.', 'gggggggg', '.777777.', '.77ii77.', '.77ii77.', '.777777.'],
  bar:     ['.iiiiii.', '.i1111i.', '..i11i..', '...ii...', '...ii...', '...ii...', '..iiii..', '........'],
  cancha:  ['.aaaaaa.', '.a5555a.', '.a5aa5a.', '.a5aa5a.', '.a5555a.', '.aaaaaa.', '........', '........'],
  puente:  ['........', '.4....4.', '.44..44.', '.444444.', '.444444.', '.dddddd.', '.dddddd.', '........'],
  agua:    ['........', '.dd..dd.', 'd..dd..d', '........', '.dd..dd.', 'd..dd..d', '........', '........'],
  shop:    ['..5..5..', '.555555.', '.5iiii5.', '.5iiii5.', '.5iiii5.', '.5iiii5.', '.555555.', '........'],
  plaza:   ['..bbb...', '.bbbbb..', 'bbbbbbb.', '.bbbbb..', '..bbb...', '...66...', '...66...', '..6666..'],
  oficina: ['.444444.', '.4eeee4.', '.4eeee4.', '.444444.', '.4eeee4.', '.4eeee4.', '.444444.', '..4444..'],
  video:   ['........', '.111111.', '.1s11s1.', '.1s11s1.', '.111111.', '.1ssss1.', '.111111.', '........'],
  vias:    ['........', '4......4', '44444444', '4......4', '4......4', '44444444', '4......4', '........'],
  quinta:  ['...g....', '..ggg...', '.ggggg..', 'ggggggg.', '.q7q7q..', '.q7q7q..', '.qqqqq..', '........'],
  carpa:   ['...e....', '..eee...', '.eeeee..', 'eeeeeee.', 'ee...ee.', 'ee...ee.', 'eeeeeee.', '........'],
  yo:      ['........', '..gggg..', '.gggggg.', 'gggggggg', '.g1111g.', '..1..1..', '........', '........']
};

const ART = {};
registrarCache(ART);
function reconstruirArte() {
  reconstruirTiles();
  ART.fox = mkArt(FOX_ART);
  ART.iconos = {};
  for (const k in ICON_ART) ART.iconos[k] = mkArt(ICON_ART[k]);
}
