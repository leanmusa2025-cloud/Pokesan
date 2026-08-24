// ============================================================
//  DATOS: gente, zonas del partido, objetos, reloj
// ============================================================
const LOOKS = {
  yo:      { pelo: '1', remera: '3', pant: 'c', zapas: '1' },
  oso:     { pelo: '4', remera: 'o', pant: '2', zapas: '1' },
  fredy:   { pelo: '0', remera: 'f', pant: '1', piel: 'k' },
  tia:     { pelo: '0', pelolargo: 1, remera: 'm', pant: '2', piel: 'k' },
  hermana: { pelo: '0', pelolargo: 1, remera: 'q', pant: '2', piel: 'k' },
  juan:    { pelo: '2', extraCol: '1', gorra: 1, remera: '4', pant: 'c' },
  tortuga: { pelo: '0', remera: 'g', pant: '1' },
  musa:    { pelo: '6', remera: 'd', pant: '1' },
  micaela: { pelo: '6', pelolargo: 1, remera: 's', pant: 'c' },
  chapa:   { pelo: '1', remera: '0', pant: 'o' },
  rusa:    { pelo: 'i', pelolargo: 1, remera: 's', pant: 'c' },
  tano:    { pelo: '7', extraCol: '2', gorra: 1, remera: 'g', pant: 'o' },
  maxi:    { pelo: '2', remera: 'd', pant: '2' },
  negra:   { pelo: '0', pelolargo: 1, remera: 'a', pant: 'c' },
  hueso:   { pelo: '0', extraCol: '3', gorra: 1, remera: '3', pant: 'o' },
  chino:   { pelo: '0', extraCol: 'h', gorra: 1, remera: 'i', pant: 'c' },
  kers:    { pelo: '4', remera: 'q', pant: '6' },
  paragua: { pelo: '4', extraCol: 'd', gorra: 1, remera: 'd', pant: 'o' },
  barra:   { pelo: '1', remera: 'g', pant: '1' },
  barra2:  { pelo: '1', remera: 'e', pant: '1' },
  capital: { pelo: '1', extraCol: 'i', gorra: 1, remera: 'i', pant: 'c' },
  cana:    { pelo: '1', remera: 'c', pant: 'c' },
  vecino:  { pelo: '4', remera: 'p', pant: '2' },
  pibe:    { pelo: '6', remera: 'a', pant: 'c' },
  video:   { pelo: '4', pelolargo: 1, remera: 'l', pant: '1' },
  apagado: { pelo: '2', remera: '2', pant: '2', piel: '3' }
};

// ------------------------------------------------------------
//  LAS 20 ZONAS. mx/my es la posicion en el mapa del partido (0..100)
// ------------------------------------------------------------
const ZONAS = {
  nunez:      { n: 'Barrio Nuñez', loc: 'Sarandi', banda: 'Arsenal', ic: 'torre', mx: 55, my: 50 },
  musa:       { n: 'Casa de Musa', loc: 'Sarandi', banda: '', ic: 'cancha', mx: 58, my: 47 },
  sportbar:   { n: 'Sport Bar', loc: 'Sarandi', banda: 'Arsenal', ic: 'bar', mx: 52, my: 44 },
  costanegra: { n: 'Costa Negra', loc: 'Sarandi', banda: '', ic: 'agua', mx: 70, my: 28 },
  indep:      { n: 'Cancha de Independiente', loc: 'Avellaneda Centro', banda: 'Independiente', ic: 'cancha', mx: 24, my: 30 },
  racing:     { n: 'Cancha de Racing', loc: 'Avellaneda Centro', banda: 'Racing', ic: 'cancha', mx: 28, my: 28 },
  barrioindep:{ n: 'Barrio Independiente', loc: 'Avellaneda Centro', banda: 'Independiente', ic: 'torre', mx: 22, my: 33 },
  guemes:     { n: 'Barrio Güemes', loc: 'Avellaneda Centro', banda: 'Independiente', ic: 'torre', mx: 32, my: 32 },
  alto:       { n: 'Alto Avellaneda', loc: 'Avellaneda Centro', banda: '', ic: 'shop', mx: 35, my: 28 },
  saladita:   { n: 'Torres de La Saladita', loc: 'Sarandi', banda: 'Arsenal', ic: 'torre', mx: 60, my: 54 },
  plaza:      { n: 'Plaza Alsina', loc: 'Avellaneda Centro', banda: 'Boca y River', ic: 'plaza', mx: 20, my: 27 },
  fredy:      { n: 'Casa de Fredy', loc: 'Isla Maciel', banda: 'San Telmo', ic: 'casa', mx: 12, my: 14 },
  kers:       { n: 'Bar de Kers', loc: 'Sarandi', banda: 'Arsenal', ic: 'bar', mx: 50, my: 46 },
  puente:     { n: 'Puente Pueyrredón', loc: 'Avellaneda Centro', banda: 'Boca y River', ic: 'puente', mx: 14, my: 8 },
  sietepuentes:{ n: 'Los Siete Puentes', loc: 'Piñeyro', banda: 'El Porvenir', ic: 'vias', mx: 18, my: 50 },
  roma:       { n: 'Roma Seguros', loc: 'Avellaneda Centro', banda: 'Boca y River', ic: 'oficina', mx: 21, my: 26 },
  fiambreria: { n: 'Ex Queso y Dulce', loc: 'Sarandi', banda: 'Arsenal', ic: 'casa', mx: 49, my: 57 },
  hogar:      { n: 'Hogar Comunal', loc: 'Avellaneda Centro', banda: '', ic: 'carpa', mx: 26, my: 25 },
  videoclub:  { n: 'Videoclub Retro', loc: 'Wilde', banda: '', ic: 'video', mx: 90, my: 50 },
  quinta:     { n: 'La Quinta', loc: 'la ruta', banda: '', ic: 'quinta', mx: 112, my: 86, extra: 20, oculta: 1 }
};
const ORDEN_ZONAS = Object.keys(ZONAS);

// las localidades, para dibujar el partido de fondo
const LOCALIDADES = [
  { n: 'DOCK SUD', x: 8, y: 4, w: 42, h: 20 },
  { n: 'RESERVA', x: 50, y: 4, w: 46, h: 18 },
  { n: 'AV. CENTRO', x: 14, y: 24, w: 26, h: 20 },
  { n: 'CRUCECITA', x: 40, y: 24, w: 8, h: 18 },
  { n: 'SARANDI', x: 48, y: 24, w: 24, h: 36 },
  { n: 'V. DOMINICO', x: 72, y: 24, w: 14, h: 36 },
  { n: 'WILDE', x: 86, y: 22, w: 12, h: 42 },
  { n: 'PIÑEYRO', x: 10, y: 44, w: 22, h: 20 },
  { n: 'GERLI', x: 32, y: 44, w: 28, h: 26 }
];

// casa y el flashback no son destinos del mapa: cuentan como el Barrio Nuñez
function zonaActual() { return ZONAS[G.zona] ? G.zona : 'nunez'; }
function distZona(a, b) {
  if (!ZONAS[a] || !ZONAS[b]) return 0;
  const A = ZONAS[a], B = ZONAS[b];
  return Math.hypot(A.mx - B.mx, A.my - B.my);
}
function minutosViaje(a, b) {
  if (a === b || !ZONAS[a] || !ZONAS[b]) return 0;
  return 4 + Math.round(distZona(a, b) * 0.45) + (ZONAS[b].extra || 0) + (ZONAS[a].extra || 0);
}

// ------------------------------------------------------------
//  RELOJ: arranca 20:00, el sitio empieza a las 06:00
// ------------------------------------------------------------
const MIN_INICIO = 20 * 60, MIN_FINAL = 30 * 60;   // 600 minutos de juego
function relojTexto(m) {
  const t = m % 1440;
  return String(Math.floor(t / 60)).padStart(2, '0') + ':' + String(t % 60).padStart(2, '0');
}
function faltaTexto() {
  const f = Math.max(0, MIN_FINAL - G.min);
  return String(Math.floor(f / 60)).padStart(2, '0') + ':' + String(f % 60).padStart(2, '0');
}
function gastarMin(n) {
  G.min += n;
  if (G.min >= MIN_FINAL) G.min = MIN_FINAL;
}

// ------------------------------------------------------------
//  OBJETOS
// ------------------------------------------------------------
const OBJETOS = {
  dni:      { n: 'DNI del 2010', d: 'Vencido. La foto sos vos a los 18.\nAlguien lo dejo tirado ahi.' },
  libreta:  { n: 'Libreta', d: 'Anotas todo. Es lo unico\nque sabes hacer.' },
  llaves:   { n: 'Llaves del Fox', d: 'Un Ford Fox del 2004.\nHuele a puchos.' },
  plano:    { n: 'Plano dibujado', d: 'Un croquis a mano de la orilla.\nHay una cruz marcada.' },
  legajo:   { n: 'Legajo del Tortuga', d: 'La denuncia original.\nLa camioneta se la robaron.' },
  chip:     { n: 'Chip prepago', d: 'La linea que compro un tipo\ncon tonada. El Chino lo vendio.' },
  envoltorio:{ n: 'Envoltorio', d: 'Tirado en los juncos.\nEnvuelto igual que lo de ella.' },
  foto:     { n: 'Foto de 2010', d: 'Veinte caras y la pileta atras.\nEn el borde, ella.' }
};

// ------------------------------------------------------------
//  ESTADO
// ------------------------------------------------------------
let G = null;
function nuevaPartida() {
  G = {
    zona: 'nunez', x: 5, y: 6, dir: 'd',
    min: MIN_INICIO, guita: 480000, stack: 0, usos: 0,
    obj: { libreta: 1 }, pistas: {}, berretines: [], flags: {},
    banda: { Arsenal: 0, Independiente: 0, Racing: 0, 'San Telmo': 0, 'El Porvenir': 0, 'Boca y River': 0 },
    ayudados: 0, cap: 1
  };
}
function tenes(o) { return !!G.obj[o]; }
function dar(o) { G.obj[o] = 1; Audio2.sfx('pista'); }
function pista(id, txt) {
  if (G.pistas[id]) return false;
  G.pistas[id] = txt; Audio2.sfx('pista'); return true;
}
function aprender(b) {
  if (G.berretines.includes(b)) return false;
  G.berretines.push(b); return true;
}
