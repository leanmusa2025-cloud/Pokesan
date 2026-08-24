// ============================================================
//  LOS MAPAS DE CADA ZONA
// ============================================================
const MAPAS = {
  nunez: {
    t: ['oooooooooooooooo','oooooooooooooooo','oooooooooooooooo','....D......D....',
        '................','..C..........L..','................','................',
        '................','..L..........C..','................','oooooooooooooooo'],
    npcs: [{ x: 8, y: 6, d: 'd', n: 'chapa' }],
    obj: [{ x: 11, y: 3, txt: 'La puerta del 4to C.\nHace años que no abre.' }],
    puertas: [{ x: 4, y: 3, a: 'casa', ax: 5, ay: 6 }],
    amb: 'Las torres tapan lo que\nquedaria de cielo.'
  },
  casa: {
    interior: 1,
    t: ['XXXXXXXXXXXX','XbXXtXXXXXXX','XFFFFFFFFFFX','XFFFFFFFFFFX','XFFFFFFFFFFX',
        'XFFFFFFFFFFX','XFFFFFFFFFFX','XFFFFEFFFFFX','XXXXXXXXXXXX'],
    npcs: [{ x: 8, y: 4, d: 'd', n: 'oso' }],
    obj: [{ x: 4, y: 1, txt: 'La tele prendida sin\nvolumen. No hay señal.' },
          { x: 1, y: 1, txt: 'Tu cama. Hace tres dias\nque no la usas.' }],
    puertas: [{ x: 5, y: 7, a: 'nunez', ax: 4, ay: 4 }],
    amb: 'Dos ambientes y un olor\na cigarrillo de ayer.'
  },
  musa: {
    t: ['ZZ||||||||||||||ZZ','||ffffffffffffff||','||ffffffffffffff||','||ffffffffffffff||',
        '||ffffffffffffff||','||||||||||||||||||','..................','..................',
        '#####D############','#WW###############','##################','##################'],
    npcs: [{ x: 5, y: 7, d: 'd', n: 'musa' }],
    obj: [{ x: 8, y: 3, txt: 'Doce canchas de sintetico\ncon los reflectores dados.' },
          { x: 2, y: 6, txt: 'Estacion 98. Iba a ser la\nterminal del bondi.' }],
    amb: 'Los reflectores prendidos\ny las canchas vacias.'
  },
  sportbar: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XHHHHXXXXtXXXX','XFFFFFFFFFFFFX','XMMMMMFFFFFFFX',
        'XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 2, y: 2, d: 'd', n: 'micaela' }, { x: 10, y: 5, d: 'l', n: 'negra' }],
    obj: [{ x: 9, y: 1, txt: 'Un partido viejo repetido.\nNadie lo mira.' }],
    amb: 'Neon azul y mesas rayadas.\nEl unico lugar con gente.'
  },
  costanegra: {
    t: ['jjjjjjjjjjjjjjjjjj','jjJJjjjjJJjjjjJJjj','jJJJjjjJJJjjjJJJjj','jjjjjjjjjjjjjjjjjj',
        'jjJJjjjjjjjjJJjjjj','jjjjjjjjjjjjjjjjjj','jjjjJJjjjjJJjjjjjj','jjjjjjjjjjjjjjjjjj',
        'zzzzzzzzzzzzzzzzzz','zzzzzzzzzzzzzzzzzz','zzzzzzzzzzzzzzzzzz','zzzzzzzzzzzzzzzzzz'],
    obj: [{ x: 8, y: 7, txt: 'El agua no se mueve.\nNi con viento.' }],
    cava: { x: 11, y: 5 },
    amb: 'Juncos, barro y el agua\nque no refleja nada.'
  },
  indep: {
    t: ['VVVVVVVVVVVVVVVVVV','VVVVVVVVVVVVVVVVVV','||||||||||||||||||','AAAAAAAAAAAAAAAAAA',
        'AAcAAAAAAAAAAAcAAA','AAAAAAAAAAAAAAAAAA','AAAAAAAAAAAAAAAAAA','AAcAAAAAAAAAAAcAAA',
        'AAAAAAAAAAAAAAAAAA','AAAAAAAAAAAAAAAAAA','AAnAAAAAAAAAAnAAAA','RRRRRRRR....RRRRRR'],
    npcs: [{ x: 8, y: 6, d: 'd', duelo: 'tortuga', n: 'tortuga' },
           { x: 3, y: 9, d: 'r', n: 'hueso' }],
    obj: [{ x: 13, y: 3, txt: 'Un mural: EL ROJO ES EL\nPUEBLO. Lo taparon.' }],
    amb: 'Adentro de la cancha\narmaron ranchadas.'
  },
  racing: {
    t: ['VVVVVVVVVVVVVVVVVV','||||||||||||||||||','AAAAAAAAAAAAAAAAAA','AAAAAcAAAAAcAAAAAA',
        'AAAAAAAAAAAAAAAAAA','AAAAAAAAAAAAAAAAAA','AAAAAcAAAAAcAAAAAA','AAAAAAAAAAAAAAAAAA',
        'AAnAAAAAAAAAAAAnAA','AAAAAAAAAAAAAAAAAA','RRRRRRRR....RRRRRR','RRRRRRRR....RRRRRR'],
    npcs: [{ x: 9, y: 5, d: 'd', n: 'paraguayo' }],
    amb: 'El cilindro de hormigon\ny nadie adentro.'
  },
  barrioindep: {
    t: ['oooooooooooooooo','oooooooooooooooo','oooooooooooooooo','................',
        '..L....C.....L..','................','................','................',
        'oooooooooooooooo','oooooooooooooooo','................','................'],
    npcs: [{ x: 6, y: 6, d: 'd', n: 'rusa' }],
    amb: 'Diez torres y pasillos\nque no terminan nunca.'
  },
  guemes: {
    t: ['oooooooooooooooo','oooooooooooooooo','................','..C....C.....C..',
        '................','................','||||||....||||||','................',
        'oooooooooooooooo','oooooooooooooooo','................','................'],
    obj: [{ x: 7, y: 3, txt: 'Contenedores quemados.\nAdentro hay papel picado.' }],
    pistaZona: ['guemes', 'Juan anduvo por Güemes\nbuscando quien le compre.'],
    amb: 'Rejas altas y contenedores\nprendidos fuego.'
  },
  alto: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XHHHHXXHHHHXXX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX',
        'XFFFFFFFFFFFFX','XMMMMFFFMMMMFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 10, y: 3, d: 'd', n: 'maxi' }],
    obj: [{ x: 3, y: 1, txt: 'Vidrieras a media luz.\nAhorro de energia, dicen.' }],
    amb: 'El shopping abierto y\nvacio. Musica funcional.'
  },
  saladita: {
    t: ['oooooooooooooooo','oooooooooooooooo','................','..M....M.....M..',
        '................','................','..M....M.....M..','................',
        'oooooooooooooooo','oooooooooooooooo','................','................'],
    npcs: [{ x: 5, y: 4, d: 'd', n: 'chino' }],
    amb: 'Puestos de chapa abajo\ny cables entre balcones.'
  },
  plaza: {
    t: ['RRRRRRRR....RRRRRR','R"""""""...."""""R','R"YY""""...."""YYR','R""""""".........R',
        'R................R','R................R','R""""""".........R','R"YY""""....""YY"R',
        'R"""""""...."""""R','RRRRRRRR....RRRRRR'],
    npcs: [{ x: 9, y: 4, d: 'd', duelo: 'capital', n: 'capital' },
           { x: 3, y: 8, d: 'd', n: 'apagado' }],
    obj: [{ x: 14, y: 5, txt: 'El monumento rodeado de\nvallas. Nadie las puso.' }],
    amb: 'Vallas, arboles y un tipo\ncaminando en circulos.'
  },
  fredy: {
    t: ['##############','#............#','#.##########.#','#.#........#.#','#.#.######.#.#',
        '#.#.#....#.#.#','#.#.#.D..#.#.#','#.#.######.#.#','#.#........#.#','#.##########.#',
        '#............#','##############'],
    npcs: [{ x: 3, y: 1, d: 'd', duelo: 'santelmo', n: 'barra2' }],
    obj: [{ x: 6, y: 6, txt: 'La puerta de Fredy.\nCerrada con candado nuevo.' }],
    pistaZona: ['candado', 'El candado de la casa de\nFredy es nuevo. De hoy.'],
    amb: 'Pasillos de chapa que\ndoblan y vuelven a doblar.'
  },
  kers: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XXXXXXXXXXXXXX','XFFFFFFFFFFFFX','XMMMMMMFFFFFFX',
        'XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 3, y: 2, d: 'd', n: 'kers' },
           { x: 11, y: 5, d: 'l', duelo: 'juan', n: 'juan' }],
    amb: 'Barra de madera oscura\ny gente tomando en silencio.'
  },
  puente: {
    t: ['zzzzzzzzzzzzzzzzzz','QQQQQQQQQQQQQQQQQQ','PPPPPPPPPPPPPPPPPP','PPPPPPPPPPPPPPPPPP',
        'PPPPPPPPPPPPPPPPPP','QQQQQQQQQQQQQQQQQQ','zzzzzzzzzzzzzzzzzz','zzzzzzzzzzzzzzzzzz'],
    npcs: [{ x: 9, y: 3, d: 'd', n: 'apagado' }],
    obj: [{ x: 4, y: 2, txt: 'Del otro lado esta la\nCapital. Nadie cruzo hoy.' }],
    pistaZona: ['nadiecruzo', 'Nadie cruzo el puente\nhacia Capital esta noche.'],
    amb: 'Viento y las luces de la\nautopista a lo lejos.'
  },
  sietepuentes: {
    t: ['gggggggggggggggggg','gg||||gggggg||||gg','gggggggggggggggggg','vvvvvvvvvvvvvvvvvv',
        'vvvvvvvvvvvvvvvvvv','gggggggggggggggggg','gg||||gggggg||||gg','gggggggggggggggggg',
        'ggnngggggggggnnggg','gggggggggggggggggg'],
    obj: [{ x: 8, y: 5, txt: 'Fierros oxidados cruzando\nlas vias. Eco de chapa.' }],
    pistaZona: ['bolsa', 'Un tipo paso a pie con\nuna bolsa pesada al oeste.'],
    amb: 'Sombra constante, aunque\nno haya sol que la haga.'
  },
  roma: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XkkXXkkXXkkXXX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX',
        'XkkXXkkXXkkXXX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    obj: [{ x: 5, y: 1, txt: 'Tu escritorio. El mate\nde ayer sigue ahi.' },
          { x: 1, y: 4, txt: 'ROMA SEGUROS. El cartel\nque mirás hace ocho años.' }],
    archivo: { x: 10, y: 4 },
    amb: 'Melamina gris, biblioratos\ny olor a cafe frio.'
  },
  fiambreria: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XeeeeeeeeeeeeX','XFFFFFFFFFFFFX','XMMMMMFFFFFFFX',
        'XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 8, y: 4, d: 'd', n: 'hermana' }],
    obj: [{ x: 3, y: 3, txt: 'El mostrador donde\ntrabajaste dos años.' }],
    amb: 'Ganchos vacios y la\npersiana a media asta.'
  },
  hogar: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XbXbXbXbXbXbXX','XFFFFFFFFFFFFX','XbXbXbXbXbXbXX',
        'XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 9, y: 5, d: 'l', n: 'vecina' }, { x: 3, y: 4, d: 'd', n: 'nene' }],
    pistaZona: ['quintaruta', 'Uno del hogar hablaba de\nuna quinta en la ruta.'],
    amb: 'Camas de caño, lavandina\ny sopa en ollas grandes.'
  },
  videoclub: {
    interior: 1,
    t: ['XXXXXXXXXXXXXX','XyyyyXXyyyyXXX','XFFFFFFFFFFFFX','XFFFFFFFFFFFFX',
        'XyyyyXXyyyyXXX','XFFFFFFFFFFFFX','XMMMFFFFFFFFFX','XFFFFFEFFFFFFX','XXXXXXXXXXXXXX'],
    npcs: [{ x: 2, y: 5, d: 'd', n: 'video' }],
    amb: 'El unico local con luz\nen toda la cuadra.'
  },
  quinta: {
    t: ['hhhhhhhhhhhhhhhhhh','hhhhhhhhhhhhhhhhhh','hhYhhhhhhhhhhhhYhh','hhhhhhhhhhhhhhhhhh',
        'hhhhuuuuuuuuuhhhhh','hhhhuuuuuuuuuhhhhh','hhhhuuuuuuuuuhhhhh','hhhhhhhhhhhhhhhhhh',
        'hhhh##########hhhh','hhhh#WW#DD#WW#hhhh','hhhh##########hhhh','hhhhhhhhhhhhhhhhhh',
        'hhhhhhhhhhhhhhhhhh','iiiiiiiiiiiiiiiiii'],
    obj: [{ x: 8, y: 5, txt: 'La pileta vacia, llena\nde hojas de dieciseis años.' }],
    final: { x: 9, y: 8 },
    amb: 'El mismo lugar. Nada mas\nque sin nadie.'
  }
};
