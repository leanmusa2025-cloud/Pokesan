// ============================================================
//  SPRITES: gente del barrio + bichos
// ============================================================
// completa las filas cortas con transparente asi no hay que contar pixeles
function padArt(rows) {
  let w = 0; for (const r of rows) if (r.length > w) w = r.length;
  return rows.map(r => r + '.'.repeat(w - r.length));
}
function mkArt(rows, colors) { return makeSprite(padArt(rows), colors); }

// --- persona generica: H pelo, K piel, S remera, P pantalon, Z zapas, O contorno
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
// patas del segundo cuadro (caminando)
const LEGS2 = {
  d: ['...OPPPOOPPPO...','..OPPPPOOPPPPO..','..OZZO....OZZO..'],
  s: ['....OPPPPPPO....','...OPPPO.OPPO...','...OZZO...OZZO..']
};
function legsSwap(base, alt) {
  const a = base.slice(0, 13).concat(alt);
  return a;
}
const CAP_DOWN = ['','','','','..VVVVVVVVVVVV..'];
const CAP_SIDE = ['','','','','....VVVVVVVVVV..'];
const HAIR_DOWN = ['','','','','','..VV........VV..','..VV........VV..','..VV........VV..','...V........V...'];

function buildPerson(col) {
  const C = { O: PAL['0'], H: col.pelo, K: col.piel || PAL['j'], S: col.remera, P: col.pant || PAL['c'], Z: col.zapas || PAL['1'], V: col.extraCol || col.pelo };
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
  const over = col.gorra ? CAP_DOWN : (col.pelolargo ? HAIR_DOWN : null);
  const overS = col.gorra ? CAP_SIDE : (col.pelolargo ? HAIR_DOWN : null);
  return {
    d: [comp(P_DOWN, over, null), comp(P_DOWN, over, LEGS2.d)],
    u: [comp(P_UP, col.gorra ? null : (col.pelolargo ? HAIR_DOWN : null), null),
        comp(P_UP, col.gorra ? null : (col.pelolargo ? HAIR_DOWN : null), LEGS2.d)],
    s: [comp(P_SIDE, overS, null), comp(P_SIDE, overS, LEGS2.s)]
  };
}

// --- perro callejero del overworld
const DOG_ART = [
  '................','................','................','................',
  '...OO......OO...','..OHHO....OHHO..','..OHHHOOOOHHHO..','.OHHHHHHHHHHHHO.',
  '.OHHHHHHHHHHHHO.','.OHOHHHHHHHHHHO.','.OHHHHHHHHHHHHO.','..OHHHHHHHHHHO..',
  '..OHHO..OHHO....','..OHHO..OHHO....','..OOOO..OOOO....','................'];

// ============================================================
//  BICHOS  (arte de batalla, se dibuja x2)
// ============================================================
const MON_ART = {
  yuyin: [
    '..........aa',
    '.........abba',
    '...aa....abbba',
    '..abba...abbba...aa',
    '.abbbba..abbba..abba',
    '.abbbbba..abba.abbbba',
    '..abbbba...aa..abbbba',
    '...abba....aa...abba',
    '....a......aa....a',
    '..........aaaa',
    '........9aaaaaa9',
    '.......9aabbbbaa9',
    '......9aabbbbbbaa9',
    '......9ab0bbbb0ba9',
    '......9abbbbbbbba9',
    '......9abb0000bba9',
    '......9aabbbbbbaa9',
    '.......9aabbbbaa9',
    '........99aaaa99',
    '.........7....7',
    '........77....77',
    '.......77......77'],
  yuyaco: [
    '.........m..m',
    '........mimim',
    '.........mmm',
    '..........a',
    '...aa.....a.....aa',
    '..abba....a....abba',
    '.abbbba...a...abbbba',
    '.abbbbba..a..abbbbba',
    '..abbbba..a..abbbba',
    '...abba..aaa..abba',
    '......99aaaaaa99',
    '.....9aabbbbbbaa9',
    '....9aabbbbbbbbaa9',
    '....9ab0bbbbbb0ba9',
    '....9abbbbbbbbbba9',
    '....9abb000000bba9',
    '....9ab0bbbbbb0ba9',
    '....9aabbbbbbbbaa9',
    '.....9aabbbbbbaa9',
    '......99aaaaaa99',
    '.......7......7',
    '......77........77',
    '.....77..........77'],
  chorimon: [
    '...88888888888888',
    '..8888888888888888',
    '.888888888888888888',
    '.888888888888888888',
    '.88aaaaaaaaaaaaaa88',
    'gggggggggggggggggggg',
    'gg0gggggggggggg0gggg',
    'gggggggggggggggggggg',
    'ggggg0000000000ggggg',
    'gggggggggggggggggggg',
    '.88aaaaaaaaaaaaaa88',
    '.888888888888888888',
    '.888888888888888888',
    '..8888888888888888',
    '...88888888888888'],
  chorizon: [
    '....88888888888888',
    '..888888888888888888',
    '.88888888888888888888',
    '.88888888888888888888',
    '.888aaaaaaaaaaaaaa888',
    'gggggggggggggggggggggg',
    'gg0gggggggggggggg0gggg',
    'gggggggggggggggggggggg',
    'gggg00000000000000gggg',
    'gggggggggggggggggggggg',
    '.888aaaaaaaaaaaaaa888',
    '.88888888888888888888',
    'gggggggggggggggggggggg',
    'gg0gggggggggggggg0gggg',
    'gggg00000000000000gggg',
    'gggggggggggggggggggggg',
    '.88888888888888888888',
    '..888888888888888888',
    '....88888888888888'],
  riachin: [
    '..........0',
    '.........090',
    '........09a90',
    '........0aa90',
    '.......09aaa90',
    '......09aaaaa90',
    '.....09aaaaaaa90',
    '....09aaaaaaaaa90',
    '....0aaaaaaaaaa90',
    '...09aa0aaaa0aa90',
    '...09aaaaaaaaaaa90',
    '...09aaaaaaaaaaa90',
    '...09aaa000000aa90',
    '...09aaaaaaaaaaa90',
    '....09aaaaaaaaa90',
    '.....099999999990',
    '......0000000'],
  riachonzo: [
    '.....0..........0',
    '....090........090',
    '....0a90......09a0',
    '...09aa90....09aa90',
    '...0aaaa9....9aaaa0',
    '..09aaaaa9999aaaaa90',
    '..09aaaaaaaaaaaaaa90',
    '.09aaa0aaaaaaaa0aaa90',
    '.09aaaaaaaaaaaaaaaa90',
    '.09aaaaaaaaaaaaaaaa90',
    '.09aa000000000000aa90',
    '.09aa0aaaaaaaaaa0aa90',
    '.09aaaaaaaaaaaaaaaa90',
    '..09aaaaaaaaaaaaaa90',
    '..009aaaaaaaaaaaa900',
    '....099999999999990',
    '.....00000000000'],
  palomin: [
    '',
    '.......333333',
    '......34444443',
    '.....3444444443',
    '.....34404440443',
    '.....3444444443hh',
    '.....34444444443hh',
    '...333444444433',
    '..34444444444443',
    '.3444444444444443',
    '.3444444444444443',
    '..34444444444443',
    '...344444444443',
    '....3344444433',
    '......344443',
    '.......h..h',
    '......hh..hh'],
  perrucho: [
    '',
    '...77........77',
    '..7887......7887',
    '..78887777778887',
    '.7888888888888887',
    '.7888888888888887',
    '.78808888888880887',
    '.7888888888888887',
    '.7888880008888887',
    '..78888888888887',
    '..7888888888887',
    '..78888888888887',
    '..7887..7887',
    '..7887..7887',
    '..7777..7777'],
  cucaracho: [
    '...0............0',
    '....0..........0',
    '.....0........0',
    '......07777770',
    '.....7766667777',
    '....776666666677',
    '...77660666066677',
    '...7766666666677',
    '..776600660066777',
    '..77666666666677',
    '.0776666666666770',
    '.0776666666666770',
    '.0.7766666666777.0',
    '....77666666777',
    '.....77777777',
    '....0..0..0..0',
    '...0...0..0...0'],
  cumbion: [
    '',
    '..llllllllllllll',
    '..l0000000000000l',
    '..l0mmmm00mmmm0l',
    '..l0m00m00m00m0l',
    '..l0m0im00mi0m0l',
    '..l0m00m00m00m0l',
    '..l0mmmm00mmmm0l',
    '..l000000000000l',
    '..l0iiiiiiiiii0l',
    '..l0i00iiii00i0l',
    '..l0iiiiiiiiii0l',
    '..l000000000000l',
    '..llllllllllllll',
    '...l0l......l0l',
    '...lll......lll'],
  trapin: [
    '',
    '....hh....hh',
    '...hihh..hhih',
    '..hiiihhhhiiih',
    '.hiiiiiiiiiiiih',
    '.hii0iiiiii0iih',
    '.hiiiiiiiiiiiih',
    'hiiiiiiiiiiiiiih',
    'hiii00000000iiih',
    'hiiiiiiiiiiiiiih',
    '.hiiiiiiiiiiiih',
    '.dhiiiiiiiiiihd',
    '..dhhiiiiiihhd',
    '...ddhhhhhhdd',
    '....d.d..d.d'],
  gomon: [
    '',
    '.....11111111',
    '...111111111111',
    '..112222222222211',
    '..12211111111221',
    '.1221133331122221',
    '.121133333331121',
    '.121330000333121',
    '.121330000333121',
    '.121133333331121',
    '.1221133331122221',
    '..12211111111221',
    '..112222222222211',
    '...111111111111',
    '.....11111111'],
  materazzo: [
    '',
    '.........33',
    '........33',
    '.......33',
    '......33',
    '....6666666',
    '...667777766',
    '..66777777766',
    '.6677777777766',
    '.6770777770776',
    '.6677777777766',
    '.6677700077766',
    '.6677777777766',
    '..667777777766',
    '...6667777666',
    '.....6666666',
    '......66666'],
  ferneton: [
    '',
    '........99',
    '........99',
    '.......0990',
    '.......0990',
    '......099990',
    '.....09999990',
    '....0999999990',
    '....0999999990',
    '....09iiiiii90',
    '....09i0ii0i90',
    '....09iiiiii90',
    '....09i0000i90',
    '....09iiiiii90',
    '....0999999990',
    '....0999999990',
    '....0999999990',
    '.....00000000'],
  bondimon: [
    '',
    '..3333333333333333',
    '..3iiiiiiiiiiiiii3',
    '..3i222222222222i3',
    '..3eeeeeeeeeeeeee3',
    '..3e0eeeeeeee0eee3',
    '..3eeeeeeeeeeeeee3',
    '..3333333333333333',
    '..3gggggggggggggg3',
    '..33333333333333333',
    '..3ii3333333333ii3',
    '..3ii300000003ii3',
    '..3333333333333333',
    '...3111333331113',
    '...1001333310013',
    '...1001333310013',
    '....11.......11']
};
