// ============================================================
//  EL BARRIO: mapas, vecinos y verso
// ============================================================
const LOOKS = {
  pibe:    { pelo: PAL['f'], extraCol: PAL['g'], gorra: 1, remera: PAL['s'], pant: PAL['c'], zapas: PAL['1'] },
  vieja:   { pelo: PAL['6'], pelolargo: 1, remera: PAL['m'], pant: PAL['l'] },
  profe:   { pelo: PAL['4'], remera: PAL['s'], pant: PAL['2'] },
  kiosco:  { pelo: PAL['1'], remera: PAL['d'], pant: PAL['2'] },
  bocha:   { pelo: PAL['c'], extraCol: PAL['1'], gorra: 1, remera: PAL['i'], pant: PAL['2'] },
  rosa:    { pelo: PAL['4'], pelolargo: 1, remera: PAL['l'], pant: PAL['2'] },
  nacho:   { pelo: PAL['1'], remera: PAL['g'], pant: PAL['1'] },
  trapito: { pelo: PAL['6'], extraCol: PAL['h'], gorra: 1, remera: PAL['h'], pant: PAL['2'] },
  bondi:   { pelo: PAL['2'], extraCol: PAL['1'], gorra: 1, remera: PAL['e'], pant: PAL['1'] },
  pibe1:   { pelo: PAL['1'], remera: PAL['a'], pant: PAL['c'] },
  pibe2:   { pelo: PAL['7'], extraCol: PAL['a'], gorra: 1, remera: PAL['d'], pant: PAL['1'] },
  nena:    { pelo: PAL['6'], pelolargo: 1, remera: PAL['e'], pant: PAL['m'] },
  senora:  { pelo: PAL['3'], pelolargo: 1, remera: PAL['b'], pant: PAL['2'] },
  viejo:   { pelo: PAL['4'], remera: PAL['q'], pant: PAL['6'] },
  cartone: { pelo: PAL['6'], remera: PAL['o'], pant: PAL['n'] },
  pesca:   { pelo: PAL['3'], extraCol: PAL['9'], gorra: 1, remera: PAL['9'], pant: PAL['6'] },
  insp:    { pelo: PAL['1'], remera: PAL['3'], pant: PAL['1'] },
  abuela:  { pelo: PAL['4'], pelolargo: 1, remera: PAL['3'], pant: PAL['1'] }
};

const MAPAS = {
  casa: {
    nom: 'Tu pieza', mus: 'barrio', int: 1,
    t: ['XXXXXXXXXX', 'XbXXtXXXXX', 'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFFFFFX',
        'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFEFFFX', 'XXXXXXXXXX'],
    warps: [{ x: 5, y: 7, a: 'barrio', ax: 2, ay: 4, ad: 'd' }],
    npcs: [
      { x: 7, y: 4, d: 'd', c: 'vieja', nom: 'Mamá', id: 'mama' },
      { x: 4, y: 2, d: 'd', c: 'abuela', nom: 'Abuela', id: 'abuela' }
    ],
    obj: [{ x: 4, y: 1, txt: 'Es la tele. Están pasando "Ritmo de la Noche".\nUn tipo tira un tostado a la pileta.' },
          { x: 1, y: 1, txt: 'Tu cama. Tiene la sábana de Independiente\nque te regaló la abuela.' }]
  },

  barrio: {
    nom: 'Calle Mitre', mus: 'barrio',
    t: ['#######..,!,,..#####',
        '#WW#WW#..,!,,..#WW##',
        '#######..,!,,..#####',
        '##D####..,!,,..##D##',
        '.........,!,,.......',
        '..T......,!,,....L..',
        '.........,!,,.......',
        '.C.....L.,!,,......S',
        ',,,,,,,,,,,,,,,,,,,,',
        '--------------------',
        ',,,,,,,,,,,,,,,,,,,,',
        '.........,!,,.......',
        '..L......,!,,..T....',
        '.........,!,,.......',
        '###D###..,!,,..##D##',
        '#######..,!,,..#####',
        '#WW#WW#..,!,,..#WW##',
        '#######..nnnn..#####'],
    warps: [
      { x: 2, y: 3, a: 'casa', ax: 5, ay: 6, ad: 'u', puerta: 1 },
      { x: 17, y: 3, a: 'taller', ax: 5, ay: 6, ad: 'u', puerta: 1 },
      { x: 3, y: 14, a: 'kiosco', ax: 5, ay: 6, ad: 'u', puerta: 1 },
      { x: 17, y: 14, a: 'depto', ax: 5, ay: 6, ad: 'u', puerta: 1 },
      { borde: 'n', xs: [9, 12], a: 'plaza', ax: 9, ay: 16, ad: 'u' },
      { borde: 'e', ys: [8, 10], a: 'baldio', ax: 1, ay: 7, ad: 'r' }
    ],
    npcs: [
      { x: 6, y: 5, d: 'd', c: 'senora', id: 'vecina1' },
      { x: 14, y: 12, d: 'l', c: 'viejo', id: 'viejo1' },
      { x: 4, y: 11, d: 'd', c: 'pibe1', id: 'pibecalle' },
      { x: 10, y: 16, d: 'u', c: 'insp', id: 'obrero' }
    ],
    obj: [{ x: 19, y: 7, txt: 'CALLE MITRE al 300.\nAvellaneda, Provincia de Buenos Aires.' }]
  },

  kiosco: {
    nom: 'Kiosco de Ramón', mus: 'barrio', int: 1,
    t: ['XXXXXXXXXX', 'XHHHHHHHHX', 'XFFFFFFFFX', 'XMMMMFFFFX', 'XFFFFFFFFX',
        'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFEFFFX', 'XXXXXXXXXX'],
    warps: [{ x: 5, y: 7, a: 'barrio', ax: 3, ay: 15, ad: 'd' }],
    npcs: [
      { x: 2, y: 2, d: 'd', c: 'kiosco', nom: 'Ramón', id: 'ramon' },
      { x: 7, y: 5, d: 'l', c: 'nena', id: 'clienta' }
    ]
  },

  taller: {
    nom: 'Taller de Chirola', mus: 'barrio', int: 1,
    t: ['XXXXXXXXXX', 'XMMMXXHHXX', 'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFFFFFX',
        'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFEFFFX', 'XXXXXXXXXX'],
    warps: [{ x: 5, y: 7, a: 'barrio', ax: 17, ay: 4, ad: 'd' }],
    npcs: [{ x: 4, y: 2, d: 'd', c: 'profe', nom: 'Chirola', id: 'chirola' }],
    obj: [{ x: 7, y: 1, txt: 'Una heladera llena de bichos en tuppers.\nMejor no abrir.' }]
  },

  depto: {
    nom: 'Depto del 2do B', mus: 'barrio', int: 1,
    t: ['XXXXXXXXXX', 'XbXXXXttXX', 'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFFFFFX',
        'XFFFFFFFFX', 'XFFFFFFFFX', 'XFFFFEFFFX', 'XXXXXXXXXX'],
    warps: [{ x: 5, y: 7, a: 'barrio', ax: 17, ay: 15, ad: 'd' }],
    npcs: [{ x: 3, y: 3, d: 'd', c: 'pibe2', id: 'nerd' },
           { x: 7, y: 5, d: 'l', c: 'senora', id: 'tia' }]
  },

  plaza: {
    nom: 'Plaza Alsina', mus: 'barrio',
    t: ['RRRRRRRR....RRRRRRRR',
        'R""Y""""....""""Y""R',
        'R"**""""....""""**"R',
        'R"**""""....""""**"R',
        'R"""""""...."""""""R',
        'R"~~~~""....""B""""R',
        'R"~~~~""...."""B"""R',
        'R"""""""...."""""""R',
        'R..................R',
        'R..................R',
        'R"""""""...."""""""R',
        'R"*B""""....""""B*"R',
        'R"**""""....""""**"R',
        'R"""Y"""...."""Y"""R',
        'R"**""""....""""**"R',
        'R"**""""....""""**"R',
        'R"""""""...."""""""R',
        'RRRRRRRR....RRRRRRRR'],
    warps: [
      { borde: 's', xs: [8, 11], a: 'barrio', ax: 10, ay: 1, ad: 'd' },
      { borde: 'n', xs: [8, 11], a: 'cancha', ax: 9, ay: 10, ad: 'u' }
    ],
    enc: { tiles: '*', rate: 0.11, lista: [['palomin', 3, 6, 30], ['yuyin', 3, 5, 25], ['trapin', 4, 6, 25], ['cucaracho', 3, 5, 20]] },
    npcs: [
      { x: 13, y: 5, d: 'l', c: 'rosa', nom: 'Doña Rosa', id: 'rosa' },
      { x: 5, y: 9, d: 'u', c: 'pibe1', id: 'kevin' },
      { x: 15, y: 12, d: 'd', c: 'nena', id: 'jazmin' },
      { x: 3, y: 8, d: 'd', c: 'viejo', id: 'jubilado' },
      { x: 9, y: 3, d: 'd', c: 'senora', id: 'gate_cancha' }
    ],
    obj: [{ x: 16, y: 8, txt: 'PLAZA ALSINA. Prohibido pisar el césped.\n(Alguien tachó "Prohibido").' }]
  },

  cancha: {
    nom: 'Afuera de la cancha', mus: 'barrio',
    t: ['VVVVVVVVVVVVVVVVVVVV',
        'VVVVVVVVVVVVVVVVVVVV',
        '||||||||||||||||||||',
        'AAAAAAAAAAAAAAAAAAAA',
        'AnnAAAAAAnAAAAAAnnAA',
        'AAAAAAAAAAAAAAAAAAAA',
        'nAAAAAAAAAAAAAAAAAAn',
        'AAAAAAAAAnAAAAAAAAAA',
        'AAAAAAAAAAAAAAAAAAAA',
        'AAnnAAAAAAAAAAAnnAAA',
        'AAAAAAAAAAnAAAAAAAAA',
        'RRRRRRRR....RRRRRRRR'],
    warps: [{ borde: 's', xs: [8, 11], a: 'plaza', ax: 9, ay: 1, ad: 'd' }],
    npcs: [
      { x: 9, y: 5, d: 'd', c: 'nacho', nom: 'Nacho', id: 'nacho' },
      { x: 4, y: 7, d: 'r', c: 'pibe2', id: 'brian' },
      { x: 15, y: 6, d: 'l', c: 'pibe1', id: 'maxi' },
      { x: 16, y: 10, d: 'd', c: 'viejo', id: 'hincha' }
    ],
    obj: [{ x: 2, y: 3, txt: 'Un mural gigante: "EL ROJO ES EL PUEBLO".\nAbajo alguien escribió "y la 22 tambien".' }]
  },

  baldio: {
    nom: 'El baldío', mus: 'barrio',
    t: ['||||||||||||||||||||',
        'gg**gggg**gggg**gggg',
        'g**gg**gg**gg**gg**g',
        'gggnnngggggnnngggggg',
        '**gg**gg**gg**gg**gg',
        'gg**gggg**gggg**gggg',
        'ggggnnnggggggnnngggg',
        'gggggggggggggggggggg',
        'gggggggggggggggggggg',
        '**gg**gg**gg**gg**gg',
        'gg**gggg**gggg**gggg',
        'ggggnnnggggggnnngggg',
        '**gg**gg**gg**gg**gg',
        'gg**gggg**gggg**gggg',
        'gggggggggggggggggggg',
        '|||||||||....|||||||'],
    warps: [
      { borde: 'o', ys: [7, 8], a: 'barrio', ax: 18, ay: 9, ad: 'l' },
      { borde: 's', xs: [9, 12], a: 'riachuelo', ax: 10, ay: 1, ad: 'd' }
    ],
    enc: { tiles: '*', rate: 0.12, lista: [['yuyin', 5, 9, 22], ['perrucho', 6, 9, 22], ['cucaracho', 5, 8, 20], ['gomon', 7, 9, 18], ['materazzo', 6, 8, 18]] },
    npcs: [
      { x: 8, y: 8, d: 'd', c: 'bocha', nom: 'Bocha', id: 'bocha1' },
      { x: 3, y: 12, d: 'r', c: 'cartone', id: 'ruli' },
      { x: 16, y: 4, d: 'l', c: 'pibe1', id: 'walter' },
      { x: 13, y: 13, d: 'd', c: 'pibe2', id: 'nahuel' }
    ]
  },

  riachuelo: {
    nom: 'Orilla del Riachuelo', mus: 'barrio',
    t: ['|||||||||....|||||||',
        'gggggggggggggggggggg',
        'gg**gggggggggg**gggg',
        'ggggggnnnggggggggggg',
        'gggggggggggggggggggg',
        'gg**gggggggggg**gggg',
        'QQQQQggggnnngggggggg',
        'PPPPPggggggggggggggg',
        'PPPPPggggggggggggggg',
        'QQQQQ~~~~~~~~~~~~~~~',
        '~~~~~~~~~~~~~~~~~~~~',
        '~~~~~~~~~~~~~~~~~~~~',
        '~~~~~~~~~~~~~~~~~~~~',
        '~~~~~~~~~~~~~~~~~~~~'],
    warps: [
      { borde: 'n', xs: [9, 12], a: 'baldio', ax: 10, ay: 14, ad: 'u' },
      { borde: 'o', ys: [7, 8], a: 'terminal', ax: 18, ay: 7, ad: 'l' }
    ],
    enc: { tiles: '*', rate: 0.12, lista: [['riachin', 8, 12, 26], ['cucaracho', 8, 11, 20], ['ferneton', 10, 12, 14], ['palomin', 9, 11, 20], ['gomon', 9, 12, 20]] },
    npcs: [
      { x: 6, y: 7, d: 'l', c: 'trapito', nom: 'Trapito', id: 'trapito' },
      { x: 14, y: 4, d: 'd', c: 'pesca', id: 'cacho' },
      { x: 3, y: 2, d: 'd', c: 'pibe2', id: 'uriel' },
      { x: 17, y: 8, d: 'l', c: 'cartone', id: 'don' }
    ],
    obj: [{ x: 8, y: 6, txt: 'CARTEL: "PROHIBIDO BAÑARSE".\nAbajo: "igual no te ibas a bañar, no?"' }]
  },

  terminal: {
    nom: 'Terminal del 22', mus: 'barrio',
    t: ['####################',
        '#WW##WW##DD##WW##WW#',
        '####################',
        '....................',
        '.,,,,,,,,,,,,,,,,,,.',
        '.,,,,,,,,,,,,,,,,,,.',
        '.,,,,,,,,,,,,,,,,,,.',
        '....................',
        '.L....S.......L....S',
        '....................',
        'RRRRRRRRRRRRRRRRRRRR',
        'RRRRRRRRRRRRRRRRRRRR'],
    warps: [{ borde: 'e', ys: [7, 8], a: 'riachuelo', ax: 1, ay: 7, ad: 'r' }],
    npcs: [
      { x: 9, y: 5, d: 'd', c: 'bondi', nom: 'El Colectivero', id: 'colectivero' },
      { x: 4, y: 7, d: 'r', c: 'insp', id: 'inspector' },
      { x: 15, y: 4, d: 'd', c: 'bondi', id: 'suplente' },
      { x: 12, y: 9, d: 'd', c: 'senora', id: 'pasajera' }
    ],
    obj: [{ x: 6, y: 8, txt: 'CARTEL: LINEA 22 - AVELLANEDA / ONCE.\nFRECUENCIA: "CUANDO SALGA".' }]
  }
};

// ------------------------------------------------------------
//  DIALOGOS Y GENTE
// ------------------------------------------------------------
const GENTE = {
  mama: {
    nom: 'Mamá',
    dial: () => G.flags.starter
      ? ['¡Mirá vos, ya tenés un bicho!\nOjo con el Riachuelo eh, no te me acerques.',
         'Ah, y si te lastimás pasá por lo de Ramón\nque te lo cura gratis. Es un amor ese hombre.']
      : ['¡' + G.nombre + '! ¡Levantate que son las tres\nde la tarde!',
         'Andá a lo de Chirola, el de la ferretería,\nque te anda buscando hace rato.',
         'Y llevá campera que a la noche refresca.']
  },
  abuela: {
    nom: 'Abuela',
    dial: () => {
      if (G.flags.mate) return ['Cuidámelo al Materazzo, ¿eh?\nEse mate lo cebó tu abuelo en el 78.'];
      if (!G.flags.starter) return ['Nene, cuando tengas un bicho vení\nque te doy algo.'];
      G.flags.mate = 1; darBicho(crearBicho('materazzo', 8));
      return ['Vení, vení. Tomá, llevate el mate viejo.',
              'Se despertó solo el otro día y me pidió\nyerba. Casi me muero.',
              '*Te dio un Materazzo!*'];
    }
  },
  chirola: { nom: 'Chirola', esp: 'chirola' },
  ramon: { nom: 'Ramón', esp: 'kiosco' },
  clienta: { nom: 'Clienta', dial: () => ['Ramón me fía desde el 91.\nUn santo el tipo. Un santo endeudado.'] },
  vecina1: { nom: 'Vecina', dial: () => ['¿Vos sos el hijo de la Marta, no?\n¡Cómo creciste, papito!', 'Decile que le dejé el tupper en la puerta.'] },
  viejo1: { nom: 'Don Osvaldo', dial: () => ['En mi época no había bichos de estos.\nHabía laburo, que es distinto.'] },
  pibecalle: { nom: 'Pibe', dial: () => ['¿Viste que el Riachuelo brilla de noche?\nMi viejo dice que es por la fábrica.', 'Yo digo que son los bichos.'] },
  obrero: {
    nom: 'Obrero', dial: () => ['La calle está cortada por obra.',
      'Empezaron en el 87. Van bien, dicen.']
  },
  nerd: {
    nom: 'Pibe del 2do B',
    dial: () => ['Yo tengo el manual de los bichos.',
      'Cada bicho tiene tipo. GRASA le gana a YUYO\ny a CHAMUYO. PODRIDO le gana a GRASA.',
      'YUYO le gana a PODRIDO y a FIERRO.\nFIERRO le gana a VOLADOR y a YUYO.',
      'CHAMUYO le gana a FIERRO y PODRIDO.\nCORRIENTE a VOLADOR y GRASA.',
      'Y VOLADOR le gana a YUYO y a CHAMUYO.\nDale, tomá nota que después te olvidás.']
  },
  tia: {
    nom: 'Tía Nélida',
    dial: () => {
      if (G.flags.tia) return ['Comé algo, estás flaquito.'];
      G.flags.tia = 1; darObjeto('milanga', 2); darObjeto('soda', 3);
      return ['¡Pero mirá qué flaco estás!',
        'Tomá, llevate unas milangas y unas sodas.',
        '*Recibiste 2 Milangas y 3 Sodas!*'];
    }
  },
  jubilado: { nom: 'Jubilado', dial: () => ['Cobré la jubilación y me alcanzó\npara el café y para el bondi.', 'Uno de los dos, digo.'] },
  gate_cancha: {
    nom: 'Señora',
    dial: () => G.medallas.length >= 1
      ? ['Pasá, pasá. Total hoy no juega nadie.']
      : ['No, para la cancha no vas a ir.',
         'Primero andá a saludar a Doña Rosa,\nque está sentada ahí en el banco.',
         'Y no vuelvas hasta que te dé la medalla,\nque me conozco a los pibes.']
  },
  hincha: { nom: 'Hincha', dial: () => ['Yo vi al Bocha Maradona en el 81.\nDe visitante, pero lo vi.'] },
  cacho: { nom: 'Cacho', esp: 'entrenador' },
  don: { nom: 'Don Cirilo', dial: () => ['Con lo que saco del cartón le doy\nde comer a los bichos.', 'Ellos comen cualquier cosa. Yo también.'] },
  inspector: { nom: 'Inspector', esp: 'entrenador' },
  pasajera: { nom: 'Pasajera', dial: () => ['Hace 40 minutos que espero el 22.',
    'Ah, no. 40 minutos hace que espero\nque el 22 aparezca. Esperar hace más.'] },
  suplente: { nom: 'Chofer suplente', esp: 'entrenador' },
  // entrenadores
  kevin: { nom: 'Kevin', esp: 'entrenador' },
  jazmin: { nom: 'Jazmín', esp: 'entrenador' },
  brian: { nom: 'Brian', esp: 'entrenador' },
  maxi: { nom: 'Maxi', esp: 'entrenador' },
  ruli: { nom: 'Ruli', esp: 'entrenador' },
  walter: { nom: 'Walter', esp: 'entrenador' },
  nahuel: { nom: 'Nahuel', esp: 'entrenador' },
  uriel: { nom: 'Uriel', esp: 'entrenador' },
  bocha1: { nom: 'Bocha', esp: 'entrenador' },
  rosa: { nom: 'Doña Rosa', esp: 'entrenador' },
  nacho: { nom: 'Nacho', esp: 'entrenador' },
  trapito: { nom: 'Trapito', esp: 'entrenador' },
  colectivero: { nom: 'El Colectivero', esp: 'entrenador' }
};

// entrenadores: equipo, guita, verso antes / despues
const DUELOS = {
  kevin: { nom: 'PIBE KEVIN', look: 'pibe1', plata: 120,
    eq: [['palomin', 5], ['yuyin', 5]],
    pre: ['¡Eh, vos! ¿Tenés bichos?', 'Yo los cacé todos acá en la plaza.\n¡Vamo\' a ver quién es más guapo!'],
    win: ['Uh, me ganaste. Bueno, igual\nyo estaba jugando de prueba.'],
    post: ['Cuando quieras la revancha avisá.\nYo estoy siempre acá, no laburo.'] },
  jazmin: { nom: 'NENA JAZMIN', look: 'nena', plata: 140,
    eq: [['trapin', 6], ['cucaracho', 6]],
    pre: ['Mi hermano dice que sos malísimo.', '¿Es verdad? Mostrame.'],
    win: ['Bueno, mi hermano miente mucho.'],
    post: ['Le voy a decir a mi hermano que\ntenía razón... a medias.'] },
  brian: { nom: 'PIBE BRIAN', look: 'pibe2', plata: 260,
    eq: [['perrucho', 12], ['gomon', 12]],
    pre: ['Acá afuera de la cancha se pelea distinto.', '¿Vos de qué cuadro sos?'],
    win: ['Uf. Bueno, del Rojo igual sos, no?'],
    post: ['Ojo con Nacho, ese entrena con\nbombo y todo.'] },
  maxi: { nom: 'PIBE MAXI', look: 'pibe1', plata: 280,
    eq: [['cumbion', 13], ['palomin', 12]],
    pre: ['¡Pará que bajo el volumen!', '...no, mentira, no lo bajo.'],
    win: ['Igual la cumbia sigue sonando, eh.'],
    post: ['El parlante lo saqué de un Fiat 147.\nAnda mejor que el Fiat.'] },
  ruli: { nom: 'CARTONERO RULI', look: 'cartone', plata: 200,
    eq: [['cucaracho', 9], ['gomon', 10]],
    pre: ['Yo revuelvo el baldío desde pibe.', 'Los bichos de acá son bravos, avisá.'],
    win: ['Me ganaste. Llevate esto igual,\nno me sirve.'],
    post: ['Si encontrás una cubierta con ojos,\nno la patees. Te lo digo por experiencia.'] },
  walter: { nom: 'PIBE WALTER', look: 'pibe1', plata: 180,
    eq: [['yuyin', 8], ['perrucho', 9]],
    pre: ['¡Cuidado dónde pisás que hay pozo!', 'Ah, ya está. Bueno, peleá.'],
    win: ['Te dije lo del pozo, eh.'],
    post: ['El pozo ese está desde el 89.\nYa le pusimos nombre.'] },
  nahuel: { nom: 'PIBE NAHUEL', look: 'pibe2', plata: 190,
    eq: [['materazzo', 9], ['cucaracho', 10]],
    pre: ['¿Vos también juntás bichos?', 'Qué manía la de este barrio.'],
    win: ['Bueno, che. Tampoco para tanto.'],
    post: ['Mi vieja dice que en vez de bichos\njunte para el alquiler. Tiene razón.'] },
  uriel: { nom: 'TRAPITO URIEL', look: 'pibe2', plata: 320,
    eq: [['riachin', 13], ['trapin', 13]],
    pre: ['Te lo cuido el bicho, jefe.', '...igual me lo voy a quedar.'],
    win: ['Bueno bueno, era chiste.'],
    post: ['Al que hay que ganarle es al Trapito\ngrande, el del puente. Ese sí.'] },
  cacho: { nom: 'PESCADOR CACHO', look: 'pesca', plata: 340,
    eq: [['riachin', 14], ['gomon', 13], ['cucaracho', 13]],
    pre: ['Cuarenta años pescando acá.', 'Nunca saqué un pescado.\nSaqué de todo, menos un pescado.'],
    win: ['Como los pescados. Se me escapó.'],
    post: ['Ayer saqué una moto. Andando.'] },
  suplente: { nom: 'CHOFER SUPLENTE', look: 'bondi', plata: 420,
    eq: [['gomon', 16], ['bondimon', 15]],
    pre: ['Yo hago el turno noche.', 'El 22 a las cuatro de la mañana\nes otra cosa, pibe.'],
    win: ['Andá nomás, andá a hablar con el jefe.'],
    post: ['Cuando seas grande vas a entender\nlo que es manejar con lluvia.'] },
  inspector: { nom: 'INSPECTOR', look: 'insp', plata: 400,
    eq: [['trapin', 15], ['cumbion', 16]],
    pre: ['Boleto por favor.', '¿No tenés? Bueno, entonces peleamos.'],
    win: ['Pasá, pasá. Pero la próxima sacá boleto.'],
    post: ['Yo tampoco saco boleto. No le digas\na nadie.'] },
  bocha1: { nom: 'TU RIVAL BOCHA', look: 'bocha', plata: 300,
    eq: [['palomin', 9], ['cumbion', 10]],
    pre: ['¡Ahí está! ¡El nene de mamá!',
      'Chirola a mí me dio el bicho primero, eh.\nSiempre fui el favorito.',
      '¡Vamo\' a ver quién agarró el mejor!'],
    win: ['¡Pero la puta madre!',
      '...bueno. Estuvo bien. Estuvo bien.',
      'Nos vemos en la terminal, tortuga.'],
    post: ['Estoy entrenando. Después te busco.'] },
  rosa: { nom: 'DOÑA ROSA', look: 'rosa', plata: 500, gym: 'Medalla Escoba',
    eq: [['trapin', 10], ['palomin', 10], ['cumbion', 12]],
    pre: ['Ay, un pibe con bichos. Qué novedad.',
      'Yo barro esta plaza desde el 74, nene.',
      'Si querés pasar a la cancha, primero\nme vas a tener que ganar a mí.'],
    win: ['¡Bien ahí, pibe! Me hiciste transpirar.',
      'Tomá, la MEDALLA ESCOBA. Se la saqué\na un carrito de la feria, pero vale igual.',
      '*Conseguiste la MEDALLA ESCOBA!*'],
    post: ['Andá tranquilo a la cancha.\nY no te metas en líos.'] },
  nacho: { nom: 'NACHO EL BARRA', look: 'nacho', plata: 900, gym: 'Medalla Bombo',
    eq: [['gomon', 14], ['perrucho', 15], ['chorizon', 17]],
    pre: ['Eh eh eh. ¿Vos quién sos?',
      'Acá no entra cualquiera, papá.',
      'Si aguantás los noventa minutos,\nte dejo pasar. Si no, te vas caminando.'],
    win: ['¡AGUANTE EL PIBE!',
      'Tomá la MEDALLA BOMBO. La hice con\nun parche de bombo que se rompió en el 92.',
      '*Conseguiste la MEDALLA BOMBO!*'],
    post: ['El domingo venite que jugamos\ncon los de al lado. Traé el bombo.'] },
  trapito: { nom: 'EL TRAPITO', look: 'trapito', plata: 1400, gym: 'Medalla Cuidacoches',
    eq: [['riachin', 16], ['ferneton', 17], ['riachonzo', 19]],
    pre: ['Te lo cuido el puente, jefe.',
      'Este puente es mío desde antes que\nvos nacieras. Yo cuido, yo cobro.',
      'Querés cruzar a la terminal, ¿no?\nY bueno. Pagá con bichos.'],
    win: ['Uh. Sos de fierro, pibe.',
      'Tomá, la MEDALLA CUIDACOCHES.\nEs una chapa de auto, pero es MI chapa.',
      '*Conseguiste la MEDALLA CUIDACOCHES!*'],
    post: ['Cruzá tranquilo. Tu bici te la cuido\ngratis de acá en más.'] },
  colectivero: { nom: 'EL COLECTIVERO', look: 'bondi', plata: 3000, gym: 'Pase Libre',
    eq: [['cumbion', 20], ['gomon', 20], ['chorizon', 21], ['riachonzo', 21], ['bondimon', 24]],
    pre: ['Así que vos sos el pibe del que\nhablan en el barrio.',
      'Yo manejo el 22 hace veinte años.\nVi de todo arriba de este bondi.',
      'Vi gente subir con un cordero.\nVi a un tipo cortarse el pelo en el fondo.',
      'Si me ganás, te dejo viajar gratis\nde por vida. Eso es ser leyenda, pibe.',
      '¡Suban que arranca!'],
    win: ['...',
      'La puta madre, pibe. Me ganaste.',
      'Tomá. Este es el PASE LIBRE.',
      'De acá en más el 22 es tu casa.',
      '*Conseguiste el PASE LIBRE!*'],
    post: ['Subí cuando quieras, campeón.\nEso sí: atrás, que adelante voy yo.'] }
};
