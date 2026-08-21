// ============================================================
//  TIPOS, ATAQUES, BICHOS Y CHUCHERIAS
// ============================================================
const TIPOS = ['GRASA', 'YUYO', 'PODRIDO', 'FIERRO', 'CHAMUYO', 'CORRIENTE', 'VOLADOR'];
const SUPER = {
  GRASA: ['YUYO', 'CHAMUYO'],
  YUYO: ['PODRIDO', 'FIERRO'],
  PODRIDO: ['GRASA', 'CORRIENTE'],
  FIERRO: ['VOLADOR', 'YUYO'],
  CHAMUYO: ['FIERRO', 'PODRIDO'],
  CORRIENTE: ['VOLADOR', 'GRASA'],
  VOLADOR: ['YUYO', 'CHAMUYO']
};
function efect(tAtk, tipos) {
  let m = 1;
  for (const d of tipos) {
    if (SUPER[tAtk] && SUPER[tAtk].includes(d)) m *= 2;
    else if (SUPER[d] && SUPER[d].includes(tAtk)) m *= 0.5;
  }
  return m;
}

// ataques:  n nombre, t tipo, p potencia, pp, e efecto
const ATAQUES = {
  cabezazo:  { n: 'Cabezazo', t: 'FIERRO', p: 45, pp: 30 },
  piedrazo:  { n: 'Piedrazo', t: 'FIERRO', p: 55, pp: 20 },
  fierrazo:  { n: 'Fierrazo', t: 'FIERRO', p: 75, pp: 10 },
  mordiscon: { n: 'Mordiscón', t: 'FIERRO', p: 48, pp: 25 },
  empujon:   { n: 'Empujón', t: 'FIERRO', p: 30, pp: 30, e: 'primero' },
  escupitajo:{ n: 'Escupitajo', t: 'PODRIDO', p: 40, pp: 30 },
  chapoteo:  { n: 'Chapoteo', t: 'PODRIDO', p: 50, pp: 25 },
  tufo:      { n: 'Tufo', t: 'PODRIDO', p: 35, pp: 20, e: 'tufo' },
  aguanegra: { n: 'Agua Negra', t: 'PODRIDO', p: 70, pp: 10 },
  grasada:   { n: 'Grasada', t: 'GRASA', p: 45, pp: 30 },
  panzazo:   { n: 'Panzazo', t: 'GRASA', p: 58, pp: 20 },
  aceitazo:  { n: 'Aceitazo', t: 'GRASA', p: 40, pp: 20, e: 'bajaDef' },
  aranazo:   { n: 'Arañazo', t: 'GRASA', p: 35, pp: 35 },
  fritanga:  { n: 'Fritanga', t: 'GRASA', p: 72, pp: 10 },
  yuyazo:    { n: 'Yuyazo', t: 'YUYO', p: 45, pp: 30 },
  latigazo:  { n: 'Latigazo', t: 'YUYO', p: 58, pp: 20 },
  semillita: { n: 'Semillita', t: 'YUYO', p: 30, pp: 20, e: 'chupa' },
  matecocido:{ n: 'Mate Cocido', t: 'YUYO', p: 0, pp: 10, e: 'cura' },
  chamuyo:   { n: 'Chamuyo', t: 'CHAMUYO', p: 0, pp: 25, e: 'bajaAtk' },
  verso:     { n: 'Verso', t: 'CHAMUYO', p: 42, pp: 30 },
  bardeada:  { n: 'Bardeada', t: 'CHAMUYO', p: 58, pp: 20 },
  silbatina: { n: 'Silbatina', t: 'CHAMUYO', p: 35, pp: 25, e: 'bajaDef' },
  cargada:   { n: 'Cargada', t: 'CHAMUYO', p: 75, pp: 8 },
  aletazo:   { n: 'Aletazo', t: 'VOLADOR', p: 40, pp: 35 },
  picotazo:  { n: 'Picotazo', t: 'VOLADOR', p: 52, pp: 25 },
  rasante:   { n: 'Vuelo Rasante', t: 'VOLADOR', p: 70, pp: 10 },
  chispazo:  { n: 'Chispazo', t: 'CORRIENTE', p: 45, pp: 30 },
  cablazo:   { n: 'Cablazo', t: 'CORRIENTE', p: 62, pp: 15 },
  bocinazo:  { n: 'Bocinazo', t: 'CORRIENTE', p: 35, pp: 20, e: 'aturde' },
  descanso:  { n: 'Siestita', t: 'GRASA', p: 0, pp: 10, e: 'cura' },
  forcejeo:  { n: 'Manotazo', t: 'GRASA', p: 32, pp: 99 },
  gritito:   { n: 'Gritito', t: 'CHAMUYO', p: 0, pp: 30, e: 'bajaAtk' }
};

// bichos
const BICHOS = {
  yuyin:     { n: 'Yuyín', t: ['YUYO'], b: [45, 45, 45, 40], x: 62, cap: 190, evo: ['yuyaco', 14],
    ap: [[1, 'yuyazo'], [1, 'gritito'], [7, 'semillita'], [12, 'latigazo'], [18, 'matecocido'], [24, 'cargada']],
    d: 'Crece en las grietas de la vereda. No lo matan ni con lavandina.' },
  yuyaco:    { n: 'Yuyaco', t: ['YUYO'], b: [68, 68, 66, 55], x: 142, cap: 75,
    ap: [[1, 'yuyazo'], [1, 'latigazo'], [16, 'semillita'], [22, 'matecocido'], [28, 'cargada'], [34, 'fierrazo']],
    d: 'Le brotó una flor del baldío. Florece cuando gana el Rojo.' },
  chorimon:  { n: 'Chorimón', t: ['GRASA'], b: [48, 54, 42, 42], x: 64, cap: 190, evo: ['chorizon', 14],
    ap: [[1, 'grasada'], [1, 'aranazo'], [8, 'aceitazo'], [13, 'panzazo'], [19, 'empujon'], [25, 'fritanga']],
    d: 'Nació en la parrilla de la esquina. Siempre a punto, nunca crudo.' },
  chorizon:  { n: 'Chorizón', t: ['GRASA', 'FIERRO'], b: [70, 74, 58, 50], x: 145, cap: 75,
    ap: [[1, 'grasada'], [1, 'panzazo'], [16, 'aceitazo'], [21, 'cabezazo'], [27, 'fritanga'], [33, 'fierrazo']],
    d: 'Doble de chori, doble de pan. Te mira y te sube el colesterol.' },
  riachin:   { n: 'Riachín', t: ['PODRIDO'], b: [44, 46, 48, 48], x: 63, cap: 190, evo: ['riachonzo', 14],
    ap: [[1, 'escupitajo'], [1, 'gritito'], [8, 'tufo'], [13, 'chapoteo'], [19, 'silbatina'], [26, 'aguanegra']],
    d: 'Gotita del Riachuelo. Brilla de noche y nadie sabe por qué.' },
  riachonzo: { n: 'Riachonzo', t: ['PODRIDO'], b: [66, 64, 68, 58], x: 144, cap: 75,
    ap: [[1, 'escupitajo'], [1, 'chapoteo'], [16, 'tufo'], [22, 'silbatina'], [28, 'aguanegra'], [34, 'cargada']],
    d: 'Charco con brazos. Prometieron limpiarlo en mil días. Acá sigue.' },
  palomin:   { n: 'Palomín', t: ['VOLADOR'], b: [40, 46, 36, 62], x: 55, cap: 200,
    ap: [[1, 'aletazo'], [1, 'gritito'], [9, 'picotazo'], [15, 'silbatina'], [22, 'rasante'], [28, 'cargada']],
    d: 'Vive de las migas de la plaza. Le tiene menos miedo a la gente que la gente a él.' },
  perrucho:  { n: 'Perrucho', t: ['GRASA'], b: [52, 54, 40, 52], x: 60, cap: 170,
    ap: [[1, 'aranazo'], [1, 'mordiscon'], [10, 'grasada'], [16, 'empujon'], [23, 'panzazo'], [30, 'fritanga']],
    d: 'Perro de la cuadra. Tiene dueño según a quién le preguntes.' },
  cucaracho: { n: 'Cucaracho', t: ['PODRIDO', 'FIERRO'], b: [42, 42, 60, 46], x: 58, cap: 180,
    ap: [[1, 'escupitajo'], [1, 'cabezazo'], [10, 'tufo'], [17, 'piedrazo'], [24, 'aguanegra'], [31, 'fierrazo']],
    d: 'Sobrevivió a la híper y a dos mudanzas. Te va a sobrevivir a vos también.' },
  cumbion:   { n: 'Cumbión', t: ['CHAMUYO', 'CORRIENTE'], b: [48, 58, 42, 54], x: 70, cap: 140,
    ap: [[1, 'chispazo'], [1, 'gritito'], [11, 'verso'], [17, 'bocinazo'], [24, 'cablazo'], [31, 'cargada']],
    d: 'Parlante que quedó prendido en el 93 y nadie se animó a apagar.' },
  trapin:    { n: 'Trapín', t: ['CHAMUYO'], b: [46, 44, 48, 46], x: 56, cap: 190,
    ap: [[1, 'chamuyo'], [1, 'aranazo'], [9, 'verso'], [15, 'silbatina'], [22, 'bardeada'], [29, 'cargada']],
    d: 'Te cuida el auto aunque no se lo pidas. Aparece de la nada.' },
  gomon:     { n: 'Gomón', t: ['FIERRO'], b: [58, 52, 68, 26], x: 68, cap: 150,
    ap: [[1, 'cabezazo'], [1, 'empujon'], [11, 'piedrazo'], [18, 'aceitazo'], [25, 'fierrazo'], [32, 'panzazo']],
    d: 'Cubierta que rueda sola. Si la ves prendida fuego, algo va a pasar.' },
  materazzo: { n: 'Materazzo', t: ['YUYO'], b: [60, 46, 54, 34], x: 66, cap: 150,
    ap: [[1, 'yuyazo'], [1, 'matecocido'], [12, 'semillita'], [18, 'latigazo'], [25, 'descanso'], [32, 'cargada']],
    d: 'Mate de abuela. Cura todo menos la tristeza del descenso.' },
  ferneton:  { n: 'Fernetón', t: ['CHAMUYO', 'PODRIDO'], b: [52, 60, 46, 50], x: 74, cap: 120,
    ap: [[1, 'verso'], [1, 'escupitajo'], [12, 'bardeada'], [19, 'tufo'], [26, 'cargada'], [33, 'aguanegra']],
    d: 'Aparece solo en las esquinas después de las once de la noche.' },
  bondimon:  { n: 'Bondimón', t: ['FIERRO', 'CORRIENTE'], b: [72, 70, 70, 42], x: 180, cap: 30,
    ap: [[1, 'cabezazo'], [1, 'bocinazo'], [1, 'cablazo'], [1, 'fierrazo'], [30, 'panzazo']],
    d: 'El 22 hecho bicho. Pasa cada 40 minutos y siempre lleno.' }
};

// chucherias
const OBJETOS = {
  chapita:   { n: 'Chapita', d: 'Tapita de gaseosa. Sirve para atrapar bichos.', precio: 20, tipo: 'bola', rate: 1 },
  chapitona: { n: 'Chapitona', d: 'Tapita de cerveza, mas grandota. Atrapa mejor.', precio: 60, tipo: 'bola', rate: 1.8 },
  tuper:     { n: 'Tuper', d: 'El tuper de la vieja. Nunca falla... casi.', precio: 180, tipo: 'bola', rate: 3.2 },
  sanguche:  { n: 'Sanguche', d: 'De miga, medio duro. Cura 30 de vida.', precio: 30, tipo: 'cura', cura: 30 },
  milanga:   { n: 'Milanga', d: 'Con papas. Cura 70 de vida.', precio: 80, tipo: 'cura', cura: 70 },
  fernet:    { n: 'Fernet', d: 'Con coca. Cura todo y despabila.', precio: 200, tipo: 'cura', cura: 999, limpia: 1 },
  soda:      { n: 'Soda', d: 'Del sodero. Saca el tufo de encima.', precio: 25, tipo: 'estado', limpia: 1 },
  bizcochito:{ n: 'Bizcochito', d: 'Levanta a un bicho debilitado con media vida.', precio: 150, tipo: 'revive' }
};

// ------- calculos -------
function statHP(base, lvl) { return Math.floor(base * lvl / 50) + lvl + 10; }
function statOtro(base, lvl) { return Math.floor(base * lvl / 50) + 5; }
function expParaNivel(l) { return l * l * l; }

function crearBicho(id, lvl) {
  const e = BICHOS[id];
  const b = {
    id, mote: e.n, lvl,
    hpMax: statHP(e.b[0], lvl), hp: statHP(e.b[0], lvl),
    exp: expParaNivel(lvl), estado: '', ataques: []
  };
  const pool = e.ap.filter(a => a[0] <= lvl).map(a => a[1]);
  const uniq = [...new Set(pool)];
  for (const m of uniq.slice(-4)) b.ataques.push({ id: m, pp: ATAQUES[m].pp, ppMax: ATAQUES[m].pp });
  if (!b.ataques.length) b.ataques.push({ id: 'cabezazo', pp: 30, ppMax: 30 });
  return b;
}
function statsDe(b) {
  const e = BICHOS[b.id];
  return { atk: statOtro(e.b[1], b.lvl), def: statOtro(e.b[2], b.lvl), vel: statOtro(e.b[3], b.lvl) };
}
