// ============================================================
//  GUION: la gente que te cruzas y los duelos de berretines
// ============================================================
const NPCS = {

  oso: { nom: 'El Oso', look: 'oso', dial: () => {
    if (G.cap === 1) return [
      'Otra vez levantado a\nestas horas.',
      'Hace un mes que no sale\nel sol, flaco.',
      'Y vos seguis igual que\ncuando salia.',
      'Anda, hace lo que tengas\nque hacer.',
      'Yo te espero aca. Como\nsiempre.'];
    if (G.cap === 2) return null;   // lo maneja la escena del capitulo 3
    if (G.cap >= 8) return ['Volve entero, pibe.\nNada mas te pido.'];
    return [
      'Vos no dormis y yo no\npuedo dormir.',
      'Somos un buen equipo.',
      'Si necesitas algo,\nestoy aca.'];
  }},

  hermana: { nom: 'La hermana', look: 'hermana', dial: () => {
    if (G.flags.dni) return [
      'Ya te dije todo lo\nque vi.',
      'Andate antes de que\nvengan otra vez.'];
    G.flags.dni = 1; G.cap = 2; dar('dni');
    pista('llevaron', 'Se la llevaron dos tipos\ncerca de las once.');
    pista('peruano', 'Antes paso un peruano\npreguntando por ella.');
    return [
      '¿Vos sos el que le dice\ntia?',
      'No me mires asi. Se lo\ndicen todos.',
      'Se la llevaron hace una\nhora. Eran dos.',
      'Antes de eso paso un\nperuano preguntando.',
      'Yo no le vi la cara.',
      'Y esto estaba tirado\naca en el piso.',
      '*Agarraste tu DNI viejo*',
      'Tiene tu nombre, flaco.\nY tu foto de pibe.',
      'Andate. Y si la\nencontras, avisame.'];
  }},

  fredy: { nom: 'Fredy', look: 'fredy', dial: () => {
    if (G.cap === 3) return [
      'Tanto tiempo, flaco.',
      'Ocho meses sin llamarme.\nNi un mensaje.',
      'Pense que te habias\nmuerto. En serio.',
      '...',
      'Pero bueno. Contame.\n¿A quien buscas?',
      '(Le decis que es tu tia.\nUn familiar.)',
      'Una tia tuya. Mira vos.',
      'Bueno. Subite al auto\nque conozco gente.'];
    if (G.cap >= 8) return ['Aca estamos, flaco.\nComo en otra epoca.'];
    const l = [
      'Tranquilo que la\nencontramos.',
      'Yo conozco a todo el\nmundo de este lado.',
      'Vos manejá. Yo pienso.'];
    if (G.min > 22 * 60 && !G.flags.laTia) {
      G.flags.laTia = 1;
      aprender('mismo');
      pista('laTia', 'Fredy dijo "LA Tia".\nAsi dicen los clientes.');
      return [
        'Che, ¿vos dormiste algo?',
        'Yo hace dos dias que\nno pego un ojo.',
        'Antes aguantaba. Ahora\nno.',
        'Che... ¿y la Tia que\nte dijo exactamente?',
        '(Dijiste algo?)',
        'Nada, nada. Segui\nmanejando.'];
    }
    return l;
  }},

  musa: { nom: 'Musa', look: 'musa', dial: () => {
    if (G.pistas.camioneta) return [
      'Ya te di todo lo que\ntenia, flaco.',
      'Fijate en la orilla.\nAlla tiran todo.'];
    pista('camioneta', 'La camioneta del Tortuga\nfue robo real.');
    pista('plano', 'En la Costa Negra tiran\nlo que no quieren que\naparezca.');
    dar('plano');
    return [
      '¡Pero mira quien vino!',
      'A esta hora y con esa\ncara. Pasa algo.',
      '...',
      'A ver. Contame despacio.',
      '...',
      'Pará. ¿El Tortuga?',
      'Flaco, la camioneta del\nTortuga se la robaron.',
      'De verdad. Yo la vi\ndesarmada en Gerli.',
      'No fue ningun fraude.\nReclamaba lo suyo.',
      'Y vos lo trataste como\na un chorro.',
      '...',
      'Otra cosa. Si buscas\nalgo que alguien tiro,',
      'anda a la Costa Negra.\nAhi va a parar todo.',
      'Tomá, te dibujo donde.',
      '*Te dio un plano*'];
  }},

  micaela: { nom: 'Micaela', look: 'micaela', dial: () => {
    if (G.pistas.camioneta_rara) return ['Ya te conte lo que vi.\nNo me metas en lios.'];
    pista('camioneta_rara', 'Micaela vio una chata\nir al rio a las tres.');
    aprender('sola');
    return [
      'Uy. Vos.',
      'Sentate antes de que\nte caigas.',
      '...',
      'Si, vi pasar una\ncamioneta rara.',
      'Como a las tres. Iba\npara el lado del rio.',
      'Dos tipos adelante.\nNo les vi la cara.',
      'Igual yo no vi nada,\n¿escuchaste?',
      'En este barrio la que\nhabla de mas cobra.'];
  }},

  juan: { nom: 'Juan', look: 'juan', dial: () => {
    if (G.pistas.juan) return [
      'Ya esta, ya te dije.\n¿Que mas queres?',
      'Yo no hice nada malo,\nboludo. En serio.'];
    return ['Che, boludo, tranqui.\nYo no vendi a nadie.',
      '¿Que me mirás asi?'];
  }},

  tortuga: { nom: 'El Tortuga', look: 'tortuga', dial: () => {
    if (G.pistas.tortuga) return [
      'Cuando termines esto\nvenite un domingo.',
      'Traé la libreta y te\nborro el expediente.'];
    return ['Uh. Mirá quien apareció.'];
  }},

  chino: { nom: 'El Chino', look: 'chino', dial: () => {
    if (G.pistas.chip) return ['Ya te dije todo. Andá.'];
    pista('chip', 'Uno con tonada compro\nuna linea prepaga hoy.');
    dar('chip');
    aprender('chamuyo');
    return [
      'Ese celular que traes\nno sirve mas.',
      'Cortaron todo por el\nestado de sitio.',
      '...',
      'Che. Hoy vino un tipo\ncon tonada.',
      'Compro una linea nueva.\nPago en efectivo.',
      'Nadie compra una linea\nnueva un martes de noche',
      'salvo que la vieja\nqueme.',
      'Tomá el numero. No me\nnombres, ¿si?'];
  }},

  paraguayo: { nom: 'El Paraguayo', look: 'paragua', dial: () => {
    if (G.pistas.nafta) return ['Andá tranquilo, jefe.\nEl coche te lo cuido.'];
    pista('nafta', 'Fredy andaba pidiendo\nplata para nafta.');
    return [
      'Una moneda para el\ncoche, maestro.',
      '...',
      'Al peruano lo vi, si.',
      'Andaba por aca hace un\nrato pidiendo.',
      'Pidiendo plata para\ncargar nafta.',
      'Un tipo con mercaderia\nno pide para nafta,',
      '¿o me equivoco?'];
  }},

  kers: { nom: 'Kers', look: 'kers', dial: () => [
    'Cuarenta años atendiendo\nesta barra.',
    'Vi entrar a los padres.\nAhora entran los hijos.',
    'Y todos con la misma\ncara de perro.',
    'Juan esta en el fondo.\nHace rato que esta.'] },

  video: { nom: 'La del videoclub', look: 'video', dial: () => {
    const r = REFERENCIAS[rnd(REFERENCIAS.length)];
    if (!G.flags.video) {
      G.flags.video = 1; aprender('careta');
      return [
        'Pasá, pasá. Sos el\nprimero en tres dias.',
        'No, no cerre nunca.\n¿Para que?',
        'Si igual no tengo a\ndonde ir.',
        'Llevate algo. Va por\nla casa.',
        r[0] + '\n"' + r[1] + '"'];
    }
    return ['Llevate otra.', r[0] + '\n"' + r[1] + '"'];
  }},

  apagado: { nom: '???', look: 'apagado', dial: () => [
    'El turno noche.',
    'El turno noche.',
    'El turno noche.'] },

  nene: { nom: 'Un nene', look: 'pibe', dial: () => ['¿Por que corres?'] },
  barra2: { nom: 'El de la Isla', look: 'barra2', dial: () => [
    'Pasá tranquilo.',
    'Pero no mires a nadie\na los ojos.'] },
  capital: { nom: 'Los de Capital', look: 'capital', dial: () => [
    'Nosotros cruzamos el\npuente y ustedes nada.',
    'Ni un tiro tiraron.'] },
  vecina: { nom: 'Una vecina', look: 'vecino', dial: () => ['Flaco, es de dia.'] },
  hueso: { nom: 'El Hueso', look: 'hueso', dial: () => [
    'Aca hay luz. Cortaron\nel cable, nada mas.',
    'No toques nada con las\nmanos mojadas.',
    'Yo me quedo mirando la\ncalle.'] },
  rusa: { nom: 'La Rusa', look: 'rusa', dial: () => {
    if (G.flags.rusa) return ['Tomá agua. Es lo unico\nque te va a servir.'];
    G.flags.rusa = 1; G.ayudados++;
    return [
      'Tenés la presion por\nlas nubes, boludo.',
      'Sentate. Sentate te\ndije.',
      '...',
      'Yo te conozco de cuando\neras un pibe.',
      'Y esto no sos vos.',
      'Andá. Pero volve.'];
  }},
  chapa: { nom: 'El Gordo Chapa', look: 'chapa', dial: () => {
    if (G.flags.chapa) return ['El Fox te lo dejo\nandando. Cuidalo.'];
    G.flags.chapa = 1; G.ayudados++; aprender('gil');
    return [
      'Subite que te miro\nel motor.',
      '...',
      'Esta hecho mierda pero\nanda. Como vos.',
      'Te acompaño porque me\ndebes una del 2010.',
      'No te la voy a cobrar\nahora. Tranquilo.'];
  }},
  negra: { nom: 'La Negra', look: 'negra', dial: () => {
    if (G.flags.negra) return ['Cuidate, gil.'];
    G.flags.negra = 1; G.ayudados++; aprender('careta');
    return [
      'Estas hecho un desastre,\nflaco.',
      'Te quiero igual, pero\nsos un gil.',
      'Agarrá las cosas y\ncamina rapido.',
      'Y no le creas a nadie\nesta noche.',
      'A nadie. Ni al que te\nlleva en el auto.'];
  }}
};

// ------------------------------------------------------------
//  BERRETINES: los retruques que vas juntando
// ------------------------------------------------------------
const BERRETINES = {
  mismo:   'Sos igual que yo, nada\nmas que peinado.',
  sola:    'Quedaste mas solo que\nun perro en un coche.',
  gil:     'Caminas como guapo y\ncobras como gil.',
  careta:  'Se te cayo la careta y\nabajo no habia nada.',
  chamuyo: 'Vos no tenes calle.\nTenes pasillo.',
  amague:  'Te comiste el amague\ncompleto.',
  vuelto:  'Te abrieron la billetera\ny diste las gracias.'
};

// ------------------------------------------------------------
//  DUELOS
// ------------------------------------------------------------
const DUELOS = {
  santelmo: {
    nom: 'EL DE LA ISLA', look: 'barra2', min: 15,
    pre: ['Este pasillo es privado,\nturista.'],
    rondas: [
      { i: 'Este pasillo es privado,\nturista.',
        o: [{ t: 'Turista sera tu vieja.\nYo se a que vine.', ok: 1 },
            { t: 'Vengo a ver a Fredy.\nDejame pasar.' },
            { t: 'Te rompo la cabeza si\nno te corres.' }] },
      { i: '¿Y vos que sos? ¿Cana?',
        o: [{ t: 'Si fuera cana no te\npediria permiso.', ok: 1 },
            { t: 'No, soy amigo de Fredy.' },
            { t: 'Soy de la barra de\nArsenal, respetame.' }] },
      { i: 'Aca no entra cualquiera,\npapa.',
        o: [{ t: 'Yo no soy cualquiera.\nSoy el que le paga.', ok: 1 },
            { t: 'Dale, por favor, es\nurgente.' },
            { t: 'Entro igual. Corrase.' }] },
      { i: 'Nombrame a alguien de\naca adentro.',
        o: [{ t: 'La Tia. Y vos ya sabes\nde quien te hablo.', ok: 1 },
            { t: 'A Fredy. Ya te dije.' },
            { t: 'No conozco a nadie.' }] }],
    gana: ['...', 'Pasá. Pero rapido.',
      'Y no mires a nadie a\nlos ojos, ¿si?'],
    pierde: ['Andate a tu casa, flaco.',
      'Volve cuando sepas\nhablar.']
  },

  capital: {
    nom: 'LOS DE CAPITAL', look: 'capital', min: 15,
    pre: ['Cruzamos el puente.\nEsto ahora es nuestro.'],
    rondas: [
      { i: 'Cruzamos el puente.\nEsto ahora es nuestro.',
        o: [{ t: 'Cruzaron porque alla no\nlos aguanta nadie.', ok: 1 },
            { t: 'Yo solo quiero pasar.' },
            { t: 'Esto es del Rojo.\nRajen.' }] },
      { i: '¿Y vos de donde sos,\nsorete?',
        o: [{ t: 'De aca. De cuando esto\nera un barrio.', ok: 1 },
            { t: 'De Sarandi. ¿Algun\nproblema?' },
            { t: 'De ningun lado. Dejame\npasar.' }] },
      { i: 'Aca ahora se paga\npeaje.',
        o: [{ t: 'Peaje cobra el que\nconstruyo el puente.', ok: 1 },
            { t: 'Tomá, agarrá esto y\ndejame en paz.' },
            { t: 'No pago nada.' }] },
      { i: 'Te vamos a dar vuelta\nel auto.',
        o: [{ t: 'Ese auto no lo dan\nvuelta ni en el taller.', ok: 1 },
            { t: 'El auto no lo toquen.' },
            { t: 'Probá y vas a ver.' }] }],
    gana: ['Uh, el pibe habla.',
      'Pasá, pasá. Igual ese\nauto no lo queremos.'],
    pierde: ['Volvete a Sarandi,\ncampeon.']
  },

  tortuga: {
    nom: 'EL TORTUGA', look: 'tortuga', min: 20,
    pre: ['¿Vos sos el del seguro?', 'Sentate.'],
    // este duelo se gana admitiendo, no bardeando
    rondas: [
      { i: '¿Vos sos el del seguro?',
        o: [{ t: 'Si. Y me equivoque\ncon vos.', ok: 1 },
            { t: 'No se de que me habla.' },
            { t: 'Usted me amenazo a mi\nprimero.' }] },
      { i: 'Cuatro años estuve\nadentro. ¿Sabes que es?',
        o: [{ t: 'No. Y no voy a hacer\ncomo que si.', ok: 1 },
            { t: 'Me imagino, debe ser\nduro.' },
            { t: 'Yo tambien la pase mal.' }] },
      { i: 'Vos me miraste y ya\nsabias lo que yo era.',
        o: [{ t: 'Si. Y estaba equivocado\nde punta a punta.', ok: 1 },
            { t: 'Yo solo hice mi trabajo.' },
            { t: 'Era mi obligacion\ndesconfiar.' }] },
      { i: '¿Y ahora que queres de\nmi, pibe?',
        o: [{ t: 'Nada. Vine a decirte\nque tenias razon.', ok: 1 },
            { t: 'Necesito que me ayudes.' },
            { t: 'Que me digas donde esta\nla Tia.' }] }],
    gana: ['...',
      '...',
      'La puta madre, pibe.',
      'Nadie me habia dicho\neso nunca.',
      'La camioneta me la\nrobaron de verdad.',
      'Y ustedes me hicieron\nvenir catorce veces.',
      'Pero bueno. Ya esta.',
      'Decime que necesitas y\nte doy gente.'],
    pierde: ['Andate, pibe.',
      'Segui creyendo lo que\nse te canta.']
  },

  juan: {
    nom: 'JUAN', look: 'juan', min: 20,
    pre: ['Che, boludo, tranqui.\nYo no vendi a nadie.'],
    rondas: [
      { i: 'Che, boludo, tranqui.\nYo no vendi a nadie.',
        o: [{ t: 'Yo no dije que vendiste.\nDije que hablaste.', ok: 1 },
            { t: 'Vos sos un traidor de\nmierda.' },
            { t: 'Perdon, me confundi.' }] },
      { i: 'Me preguntaron donde\nparabas y les dije.',
        o: [{ t: '¿Quien te pregunto?\nDecilo despacio.', ok: 1 },
            { t: 'Sos un buchon.' },
            { t: 'Esta bien, no importa.' }] },
      { i: 'Un peruano. Uno que\nvos conoces.',
        o: [{ t: '¿Y que mas le diste\naparte del dato?', ok: 1 },
            { t: 'Fredy. Sabia.' },
            { t: 'No lo conozco a ningun\nperuano.' }] },
      { i: 'Nada. Un papel viejo\nque tenia en casa.',
        o: [{ t: 'Un papel viejo mio.\nDe mi cumpleaños.', ok: 1 },
            { t: '¿Que papel?' },
            { t: 'Me chupa un huevo el\npapel.' }] }],
    gana: ['...',
      'Eran dos gramos de\nprensado, hermano.',
      'Dos gramos.',
      'Te lo juro que no pense\nque iba a pasar nada.',
      'Yo no hice nada, boludo.\nYo hable, nada mas.',
      '(Le creés. Eso es lo\npeor de todo.)'],
    pierde: ['Ya esta, ya esta.\nDejame en paz.']
  },

  fredy: {
    nom: 'FREDY', look: 'fredy', min: 0, final: 1,
    pre: ['Y bueno, flaco.', 'Aca estamos.'],
    rondas: [
      { i: 'Yo no te fui a buscar.\nMe vinieron a contar.',
        o: [{ t: 'Te contaron porque vos\npreguntaste.', ok: 1 },
            { t: 'Juan me lo dijo todo.' },
            { t: 'Devolveme a la Tia y\nlisto.' }] },
      { i: 'Quince años, flaco.\nQuince.',
        o: [{ t: 'Quince años cobrandome\nel doble. Todos.', ok: 1 },
            { t: 'Ya se, ya se. Perdon.' },
            { t: 'No me vengas con eso\nahora.' }] },
      { i: 'Me cambiaste por la\nmitad de precio.',
        o: [{ t: 'Vos me cambiaste antes.\nYo era un cliente.', ok: 1 },
            { t: 'Fue una decision de\nplata, nada personal.' },
            { t: 'Y volveria a hacerlo.' }] },
      { i: '¿Con guita? No.\nLe di lo que no piensa.',
        o: [{ t: 'Sos igual que yo, nada\nmas que peinado.', ok: 1, req: 'mismo' },
            { t: 'Sos una basura, Fredy.' },
            { t: 'Juan es un boludo, no\nes tu merito.' }] },
      { i: 'Vos viniste hasta aca\npor ella. Mentira.',
        o: [{ t: 'Vine por el medio kilo.\nY los dos lo sabemos.', ok: 1 },
            { t: 'Vine por ella. Punto.' },
            { t: 'Vine porque no tengo a\nnadie mas.' }] }],
    gana: ['...'],
    pierde: ['...']
  }
};

// ------------------------------------------------------------
//  EL VIDEOCLUB
// ------------------------------------------------------------
const REFERENCIAS = [
  ['Nueve Reinas', 'Esa la vi ocho veces\ny no entiendo el final.'],
  ['Un Oso Rojo', 'El tipo sale de preso y\nse encuentra con esto.'],
  ['Pizza, birra, faso', 'Es un documental, flaco.\nNo es una pelicula.'],
  ['El Aura', 'Mucho silencio. A mi me\ngusta el silencio.'],
  ['Perros de la calle', 'Todos hablan y nadie\nhace nada. Como aca.'],
  ['Tiempos violentos', 'La del maletin. Nunca te\ndicen que hay adentro.'],
  ['Jackie Brown', 'La misma escena tres\nveces. Ahi lo entendes.'],
  ['Chinatown', 'El que investiga es el\nque menos entiende.'],
  ['Corazon Satanico', 'El detective busca a un\ntipo. Adivina quien era.'],
  ['La escalera de Jacob', 'Al final te das cuenta\nde donde estabas parado.'],
  ['Memento', 'El tipo no se acuerda\nnada y igual sabe todo.'],
  ['Sospechosos comunes', 'El que te cuenta la\nhistoria la hizo.'],
  ['Taxi Driver', 'Un tipo que maneja de\nnoche y se le va.'],
  ['Sin City', 'Blanco y negro con una\nsola cosa de color.'],
  ['Ciudad de Dios', 'Los pibes del barrio,\npero en Brasil.'],
  ['Amores Perros', 'Tres historias y un\nchoque. Muy triste.'],
  ['Blade Runner', 'Llueve todo el tiempo\ny nunca sale el sol.'],
  ['El Marginal', 'Serie. Toda la temporada\nen un pabellon.'],
  ['Okupas', 'Cuatro giles en una casa\nque no es de ellos.'],
  ['Tumberos', 'Mi hijo se sabe todos\nlos parlamentos.'],
  ['El secreto de sus ojos', 'La escena de la cancha.\nNada mas te digo.'],
  ['Relatos salvajes', 'La del auto en la ruta.\nYo hubiera hecho igual.'],
  ['Elefante Blanco', 'Se filmo a treinta\ncuadras de aca.'],
  ['Leon', 'El tipo cuida una planta\ny una nena. Nada mas.'],
  ['Drive', 'Casi no habla y maneja\nmejor que vos.'],
  ['Fuego contra fuego', 'Los dos son iguales y\nse dan cuenta tarde.'],
  ['Kill Bill', 'La lista de nombres.\nYo tengo una parecida.'],
  ['Bastardos sin gloria', 'La escena del sotano.\nTodos hablan y hablan.'],
  ['El Padrino II', 'La segunda es mejor.\nSiempre lo digo.'],
  ['Carlitos Way', 'El tipo quiere salir y\nno lo dejan.']
];
