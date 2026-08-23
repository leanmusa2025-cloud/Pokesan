# Pokesán — Avellaneda 96 · Especificación técnica

Documento pensado para que otra persona (o otra IA) entienda, modifique o
extienda el proyecto sin tener que leer los 3.000 renglones de código.

---

## 1. Qué es

Un RPG de captura de criaturas al estilo Game Boy Color, ambientado en las
calles de Avellaneda (Provincia de Buenos Aires) en 1996. Es un homenaje
paródico: **no usa ni una sola línea, sprite, nombre ni sonido de ningún
juego existente**. Todo es original y está escrito a mano para este proyecto.

Duración actual: entre 45 y 75 minutos según cuánto se cacen bichos.

## 2. Restricciones de diseño (son el corazón del proyecto)

Estas restricciones son innegociables. Cualquier cambio tiene que respetarlas:

| # | Restricción | Por qué |
|---|---|---|
| 1 | **Un solo archivo `.html` autocontenido** | Se manda por WhatsApp como documento y se abre solo |
| 2 | **Cero dependencias externas** — sin CDN, sin `fetch`, sin fuentes web, sin imágenes | Tiene que andar sin internet y desde `file://` |
| 3 | **Peso chico** (hoy ~120 KB) | Que entre en cualquier plan de datos |
| 4 | **Sin emulador ni ROM** | Motor propio, no es un ROM hack |
| 5 | **Anda con teclado y con dedos** | Compu y celular, mismo archivo |
| 6 | **60 fps en celulares viejos** | Nada de canvas gigantes ni cálculos por pixel en el bucle |
| 7 | **Todo el arte es texto** | Se edita con cualquier editor, hace diffs legibles en git |
| 8 | **Español rioplatense**, registro conurbano de los 90 | Es el chiste del juego |

## 3. Estructura del repo

```
Pokesan.html          <- el juego armado (esto es lo que se manda)
build.sh              <- concatena src/ y produce Pokesan.html
src/
  00_head.html        51 líneas   HTML, CSS, botones táctiles
  10_font.js         170 líneas   tipografía 5x7 pixel a pixel
  15_core.js         248 líneas   canvas, paleta, sprites, input, audio, guardado
  20_tiles.js        166 líneas   30 tiles de 16x16
  25_sprites.js      349 líneas   personas del barrio + arte de los 15 bichos
  30_data.js         141 líneas   tipos, ataques, bichos, objetos, fórmulas
  40_maps.js         440 líneas   10 mapas, vecinos, diálogos, 15 duelos
  50_mundo.js        290 líneas   caminar, hablar, warps, encuentros, diálogos
  60_batalla.js      505 líneas   combate por turnos
  70_menus.js        317 líneas   menús, kiosco, escenas especiales, créditos
  80_main.js         160 líneas   pantalla de título, bucle principal
  99_tail.html         2 líneas   cierre del HTML
test/
  driver.js           captura una pantalla de cada parte del juego
  flujo.js            juega una partida entera: starter → gimnasio → jefe final
  stress.js           captura de bichos, derrota y 120.000 frames de teclas al azar
  mapas.js            saca una foto de cada mapa
docs/                 capturas para el README
```

### Build

```sh
sh build.sh      # cat src/00_head.html + <script>src/[1-8]*.js</script> + src/99_tail.html
```

No hay bundler, ni npm install, ni transpilación. Es un `cat` ordenado por
nombre de archivo. **El orden de los prefijos numéricos importa**: define el
orden de evaluación. Todo vive en el scope global; no hay módulos.

---

## 4. Arquitectura de ejecución

### 4.1 Pantalla

Canvas de **160x144** (resolución exacta de la Game Boy), escalado por CSS con
`image-rendering: pixelated`. `resize()` calcula la escala: entera cuando entra
(1x, 1.5x, 2x, 2.5x…), fraccionaria si la pantalla es chica. Nunca se dibuja
en coordenadas mayores a 160x144.

### 4.2 Bucle

```js
requestAnimationFrame(bucle)
  → acumula delta
  → mientras acumulado >= 16.666 y n < 4:  paso(dibujar)
```

Paso fijo de 60 Hz con hasta 4 catch-ups por frame. **Sólo el último paso
dibuja** (`paso(false)` actualiza sin dibujar). Si la pestaña estuvo en
segundo plano, el delta se recorta a 250 ms.

### 4.3 Máquina de estados

Variable global `modo`:

| modo | qué es | update | draw |
|---|---|---|---|
| `titulo` | pantalla de inicio y elección de nombre | `updTitulo` | `dibujarTitulo` |
| `mundo` | caminar por el mapa | `updMundo` | `dibujarMundo` |
| `dialogo` | cuadro de texto (encima del mundo) | `updDlg` | mundo + `dibujarDlg` |
| `menu` | menú START, bolso, fichas, tienda | `updMenu` | `dibujarMenu` |
| `batalla` | combate | `updBatalla` | `dibujarBatalla` |
| `fin` | créditos | `updFin` | `dibujarFin` |

Los fundidos a negro se manejan aparte con `fade = {v, dir, cb}`: `fundir(cb)`
oscurece, ejecuta `cb` en negro, y aclara. Mientras `fade.dir !== 0` no se
procesa input.

### 4.4 Input

Dos objetos globales:

- `K` — tecla mantenida (`K.up`, `K.a`, …). Se usa para caminar.
- `KP` — tecla **recién apretada** este frame. Se usa para menús y diálogos.
  `clearPressed()` la limpia al final de cada `paso()`.

Nombres lógicos: `up dn lf rt a b st`. El mapeo de teclas físicas está en
`MAPK`. Los botones táctiles son `<b data-k="ArrowUp">` en el HTML y se
resuelven por *hit-testing* de `event.touches` contra los rectángulos, así que
soportan multitouch real (caminar y atacar a la vez) y deslizar el dedo de un
botón a otro.

---

## 5. Formato del arte (esto es lo más particular del proyecto)

### 5.1 Paleta

`PAL` es un diccionario de **un caracter → color hex**, 20 colores:

```
0 #0f0f14 negro     6 #5c3a22 marrón osc   c #1f3f7a azul osc   i #f0d858 amarillo
1 #24242f gris osc  7 #8f5f33 marrón       d #3f7fc8 azul       j #e8b48c piel
2 #43435a gris      8 #c39355 marrón claro e #8fc8f0 celeste    k #c98a66 piel osc
3 #6d6d88 gris med  9 #2f6b34 verde osc    f #a02020 rojo osc   l #7a2a6a violeta
4 #a8a8bd gris cl   a #4f9d43 verde        g #d94b3a rojo       m #c85a9a rosa
5 #e6e6f0 blanco    b #8fc45a verde claro  h #f0a03c naranja    n/o/p/q oliva·crema
                                                                 r #3a3a48  s #f5f5ff
```

### 5.2 Sprites

Un sprite es un **array de strings**; cada caracter es un pixel:

- `.` o espacio = transparente
- cualquier clave de `PAL` = ese color
- claves en MAYÚSCULA = "slots" que se resuelven con el segundo argumento

```js
makeSprite(art, extra)   // devuelve un <canvas> offscreen
mkArt(rows, colors)      // igual pero rellena filas cortas con '.' (padArt)
```

`padArt` permite escribir sólo hasta el último pixel útil de cada fila: no hace
falta contar los puntos del final. **Las filas nunca deben pasar el ancho
declarado** (24 para los bichos, 16 para tiles y personas).

### 5.3 Tiles

`TILE_ART` — 30 entradas, cada una **exactamente 16 filas de 16 caracteres**.
La clave es el caracter que se usa en los mapas.

| id | tile | id | tile | id | tile |
|---|---|---|---|---|---|
| `.` | vereda | `L` | poste de luz | `X` | pared interior |
| `,` | asfalto | `B` | banco de plaza | `b` | cama |
| `-` | línea blanca horizontal | `S` | cartel | `t` | televisor |
| `!` | línea blanca vertical | `g` | tierra | `M` | mostrador |
| `"` | pasto corto | `n` | escombros | `H` | heladera de kiosco |
| `*` | yuyal (**hay encuentros**) | `A` | tierra de canchita | `E` | felpudo de salida |
| `~` | agua del Riachuelo | `V` | tribuna | `P` | tablones del puente |
| `#` | pared de ladrillo | `T` | árbol sobre vereda | `Q` | baranda del puente |
| `W` | pared con ventana | `Y` | árbol sobre pasto | `R` | paredón con graffiti |
| `D` | puerta (warp) | `C` | contenedor | `\|` | alambrado |

`SOLID = '#WTYR|CLBSnXbtMHV~Q'` — string con los tiles que frenan al jugador.
Ojo: **cada tile tiene el fondo pintado adentro** (el árbol de vereda tiene
fondo gris, el de plaza fondo verde). Por eso hay dos árboles. Si se agrega un
objeto para un fondo nuevo, hay que hacer una variante.

### 5.4 Personas

En vez de dibujar 10 personajes, hay **una plantilla** de 16x16 en tres vistas
(`P_DOWN`, `P_UP`, `P_SIDE`) con slots de color:

`O` contorno · `H` pelo/gorra · `K` piel · `S` remera · `P` pantalón · `Z` zapatillas · `V` overlay

`buildPerson(look)` compone las 6 imágenes (3 direcciones × 2 cuadros de
caminata) recoloreando la plantilla. La vista izquierda es la derecha
espejada (`blitFlip`). El segundo cuadro de caminata reemplaza las filas 13-15
por `LEGS2` (piernas abiertas), que da el rebote típico.

Overlays opcionales: `gorra: 1` agrega visera, `pelolargo: 1` agrega pelo a los
costados. `LOOKS` tiene 18 combinaciones de colores; agregar un vecino nuevo
son 1 renglón.

### 5.5 Bichos

`MON_ART` — 15 entradas, ancho máximo 24, alto variable. En batalla se dibujan
**a escala 2x** y apoyados en el piso:

- rival: `y = 58 - alto*2`, `x = 104`
- propio: `y = 94 - alto*2`, `x = 8`

Así conviven bichos chatos (Chorimón, 15 filas) con altos (Yuyaco, 23 filas)
sin flotar ni hundirse.

### 5.6 Tipografía

`FONT_SRC` es un string donde **cada renglón es un glifo**:

```
[caracter][fila_inicial][fila0/fila1/fila2/...]
```

Ejemplo: `A0.###./#...#/#...#/#####/#...#/#...#` = la letra A, empezando en la
fila 0, seis filas de 5 pixeles. Las minúsculas arrancan en la fila 1, las que
tienen cola (`g j p q y`) llegan a la 6.

Hay 88 glifos: A-Z, a-z, 0-9, `Ñ ñ á é í ó ú ü`, `¿ ¡` y puntuación. El ancho
de cada letra es variable (se calcula del último pixel usado) más 1 de
separación. Alto de línea: 9 px. Caben ~26 caracteres por renglón.

Para dibujar rápido se genera un **atlas por color** (`glyphAtlas`) la primera
vez que se usa ese color; después cada letra es un solo `drawImage`.

```js
drawText(ctx, texto, x, y, color)
textWidth(texto)          // ancho en pixeles
wrapText(texto, maxw)     // corta en renglones, respeta \n
drawTextBig(s,x,y,col,sc) // sólo para el título
```

---

## 6. Formato de los mapas

`MAPAS` es un diccionario. Cada mapa:

```js
nombre_interno: {
  nom: 'Plaza Alsina',      // cartelito que aparece al entrar
  mus: 'barrio',            // tema musical
  int: 1,                   // opcional: es interior
  t: ['RRRR....', ...],     // filas de tiles, TODAS del mismo ancho
  warps: [...],
  npcs: [...],
  obj:  [...],              // cosas que se pueden mirar
  enc:  {...}               // tabla de encuentros (opcional)
}
```

### Warps

Dos clases:

```js
{ x:2, y:3, a:'casa', ax:5, ay:6, ad:'u' }              // pisar ese tile
{ borde:'n', xs:[9,12], a:'plaza', ax:9, ay:16, ad:'u'} // salir por el borde
```

`borde` es `n` (norte), `s`, `o` (oeste) o `e`. `xs`/`ys` es el rango de tiles
por donde se puede salir. `ax, ay, ad` = dónde y mirando a dónde aparecés.

### Vecinos

```js
{ x:13, y:5, d:'l', c:'rosa', nom:'Doña Rosa', id:'rosa' }
```

`d` = dirección a la que mira (`u d l r`), `c` = clave de `LOOKS`, `id` = clave
en `GENTE`. Los NPCs **bloquean el paso**.

### Cosas mirables

```js
obj: [{ x:19, y:7, txt: 'CALLE MITRE al 300.\nAvellaneda...' }]
```

### Encuentros

```js
enc: {
  tiles: '*',            // en qué tiles se dispara
  rate: 0.11,            // probabilidad por paso
  lista: [['palomin', 3, 6, 30], ...]   // [bicho, nivel min, nivel max, peso]
}
```

Los pesos no necesitan sumar 100; se normalizan solos.

### Diálogos y gente

`GENTE[id]` puede ser:

```js
{ nom:'Vecina', dial: () => ['renglón 1', 'renglón 2\ncon salto'] }  // charla
{ nom:'Kevin',  esp: 'entrenador' }                                   // duelo
{ nom:'Chirola', esp:'chirola' }                                      // escena a mano
{ nom:'Ramón',   esp:'kiosco' }                                       // curar + tienda
```

`dial` es **una función**, así que puede leer y escribir el estado (`G.flags`),
dar objetos, o cambiar según el avance. Ejemplo real (la abuela regala un
Materazzo una sola vez):

```js
abuela: { nom:'Abuela', dial: () => {
  if (G.flags.mate) return ['Cuidámelo al Materazzo, ¿eh?'];
  if (!G.flags.starter) return ['Nene, cuando tengas un bicho vení.'];
  G.flags.mate = 1; darBicho(crearBicho('materazzo', 8));
  return ['Tomá, llevate el mate viejo.', '*Te dio un Materazzo!*'];
}}
```

### Duelos

`DUELOS[id]`:

```js
rosa: {
  nom:'DOÑA ROSA', look:'rosa', plata:500,
  gym:'Medalla Escoba',                       // si existe, es gimnasio
  eq: [['trapin',10], ['palomin',10], ['cumbion',12]],
  pre:  ['lo que dice antes'],
  win:  ['lo que dice cuando le ganás'],
  post: ['lo que dice después, ya derrotada']
}
```

Ganado queda `G.flags['d_' + id] = 1`. El jefe final (`colectivero`) dispara
`finalDelJuego()` desde `terminarBatalla`.

---

## 7. Datos y fórmulas

### 7.1 Tipos

7 tipos: `GRASA YUYO PODRIDO FIERRO CHAMUYO CORRIENTE VOLADOR`

```js
SUPER = {
  GRASA:     ['YUYO', 'CHAMUYO'],
  YUYO:      ['PODRIDO', 'FIERRO'],
  PODRIDO:   ['GRASA', 'CORRIENTE'],
  FIERRO:    ['VOLADOR', 'YUYO'],
  CHAMUYO:   ['FIERRO', 'PODRIDO'],
  CORRIENTE: ['VOLADOR', 'GRASA'],
  VOLADOR:   ['YUYO', 'CHAMUYO']
}
```

`efect(tipoAtaque, tiposDefensor)` devuelve el multiplicador: **2x** si es
súper eficaz, **0,5x** si el defensor es súper eficaz contra el atacante, y se
multiplica por cada tipo del defensor (o sea, un doble tipo puede dar 4x o
0,25x). No hay inmunidades.

### 7.2 Ataques

31 ataques en `ATAQUES`, con:

```js
grasada: { n:'Grasada', t:'GRASA', p:45, pp:30, e:'efecto' }
```

Efectos disponibles: `tufo` (veneno, 35%), `aturde` (parálisis, 35%),
`bajaAtk`, `bajaDef`, `cura` (recupera 50% de la vida máxima), `chupa`
(absorbe la mitad del daño), `primero` (prioridad de turno). `p: 0` = ataque
de estado puro. `forcejeo` (Manotazo, GRASA 32) es el ataque de emergencia
cuando no quedan PP; no está en ninguna lista de aprendizaje.

### 7.3 Bichos

```js
yuyin: {
  n: 'Yuyín',
  t: ['YUYO'],              // uno o dos tipos
  b: [45, 45, 45, 40],      // base de vida, ataque, defensa, velocidad
  x: 62,                    // experiencia que da al caer
  cap: 190,                 // facilidad de captura (más alto = más fácil, 30..200)
  evo: ['yuyaco', 14],      // evoluciona a X al nivel Y (opcional)
  ap: [[1,'yuyazo'], [7,'semillita'], ...],   // aprende ataque a tal nivel
  d: 'Descripción de la ficha (máx ~3 renglones de 25 caracteres)'
}
```

Los 15: `yuyin→yuyaco`, `chorimon→chorizon`, `riachin→riachonzo` (los tres
iniciales, evolucionan al 14), `palomin`, `perrucho`, `cucaracho`, `cumbion`,
`trapin`, `gomon`, `materazzo`, `ferneton`, `bondimon` (el más fuerte, base
72/70/70/42, `cap: 30`).

### 7.4 Fórmulas

```js
vida    = floor(base * nivel / 50) + nivel + 10
resto   = floor(base * nivel / 50) + 5             // ataque, defensa, velocidad
exp para subir a nivel L = L³                       // curva "medium fast"

daño = floor(floor(floor(2*nivel/5 + 2) * potencia * ATQ / DEF) / 50) + 2
       × efectividad × 1,5 si el ataque es del tipo del bicho
       × 2 si es crítico (1 de cada 16)
       × aleatorio entre 0,85 y 1,00
       (mínimo 1)

modificadores de estadística: etapa s → (2+s)/2 si s≥0, si no 2/(2-s), rango -6..0

experiencia ganada = floor(exp_base * nivel_rival / 7) × 1,5 si era un duelo

captura: p = (1 - vida/vida_max × 0,7) × (cap/255) × factor_chapita
         × 1,4 si tiene estado alterado,  recortado entre 0,03 y 0,95
         factor: chapita 1 · chapitona 1,8 · tuper 3,2

huida: p = 0,35 + (vel_propia - vel_rival)/100, recortado entre 0,2 y 0,95
       (no se puede huir de un duelo)

tufo: pierde vida_max/16 al final de cada turno
aturdido: 25% de perder el turno, velocidad a la mitad
```

### 7.5 Objetos

`chapita` ($20) · `chapitona` ($60) · `tuper` ($180) · `sanguche` (cura 30, $30)
· `milanga` (cura 70, $80) · `fernet` (cura todo + estado, $200) · `soda`
(saca el tufo, $25) · `bizcochito` (revive con media vida, $150).

Perder una batalla cuesta **la mitad de la guita** y te deja curado en el
kiosco de Ramón.

---

## 8. El sistema de batalla (la parte delicada)

### 8.1 Cola de mensajes

`B.q` es una **cola de pasos**. Cada paso es `{msg, auto}` (texto con efecto
máquina de escribir; `auto` = frames antes de seguir solo, 0 = espera que
aprietes A) o `{fn}` (código a ejecutar).

Regla de oro: **lo que un `fn` encola durante su ejecución se inserta justo
después de ese `fn`, no al final de la cola.** Se implementa con el buffer
`B.nuevos`:

```js
if (it.fn) {
  B.q.shift(); B.nuevos = [];
  it.fn();
  if (!B) return;                       // la batalla terminó adentro del paso
  const n = B.nuevos; B.nuevos = null;
  if (n.length) B.q = n.concat(B.q);
}
```

Sin esto, los mensajes salen desordenados (el "volvés al menú" aparecía antes
del daño del veneno).

### 8.2 Cancelar el turno

Los pasos que encola `turnoJugador` / `turnoEnemigoSolo` se marcan con
`_turno = 1` (`marcarTurno(desde)`). Cuando alguien queda K.O., `caida()` hace
`B.q = B.q.filter(q => !q._turno)`: se descarta lo que quedaba del turno (el
rival muerto no contraataca) pero **no** lo que vino después (dar experiencia,
mandar el próximo bicho, terminar la batalla).

> **No vaciar nunca `B.q` entero** desde un menú. Ahí adentro está la
> continuación de la batalla. Cuando hay que meter mensajes desde un menú se
> hace `B.q = nuevos.concat(B.q)`. La única excepción es el cambio forzado
> tras un K.O., donde sí corresponde reemplazar la cola.

### 8.3 Fases

`B.fase`: `cola` (procesando mensajes) · `menu` (PELEAR / BICHO / BOLSO /
RAJAR) · `ataques` · `cambiar` · `bolso` · `aprender`.

- Sin PP en ningún ataque, PELEAR usa `forcejeo` automáticamente.
- En el cambio forzado el cursor arranca en el primer bicho **vivo**.
- Al aprender un quinto ataque se elige cuál olvidar (o NINGUNO).

### 8.4 IA del rival

Puntúa cada ataque disponible por `potencia × efectividad` con un ruido
aleatorio de ±20% y usa el mejor. Los ataques de estado valen 25 fijo.

### 8.5 Dibujo

Fondo de bandas de color + dos elipses de piso. Caja de vida del rival arriba a
la izquierda, la tuya abajo a la derecha (con números). Al recibir daño el
sprite parpadea (`B.flash`) y tiembla (`B.sacudir`).

---

## 9. Guardado

`localStorage['pokesan_avellaneda_96']` con `JSON.stringify(G)`. Se guarda
manualmente desde START → GUARDAR. Todo va envuelto en `try/catch`: en modo
incógnito o si el navegador lo bloquea, avisa y el juego sigue andando.

Estado completo:

```js
G = { nombre, mapa, x, y, dir, equipo[], caja[], guita, objetos{},
      medallas[], flags{}, vistos{}, pasos, seg }
```

`equipo` guarda objetos bicho: `{id, mote, lvl, hpMax, hp, exp, estado,
ataques:[{id, pp, ppMax}]}`. Las estadísticas se recalculan siempre desde
`BICHOS[id].b` y el nivel, así que se puede rebalancear un bicho sin romper
partidas viejas.

---

## 10. Audio

`Audio2` es un secuenciador chiptune con WebAudio: onda cuadrada para la
melodía, triangular para el bajo, ruido blanco para la percusión. Tres temas
(`barrio` en cumbia, `batalla`, `victoria`) definidos como arrays de notas por
semicorchea. Los efectos (`bip`, `golpe`, `fuerte`, `chapita`, `capturado`,
`escapo`, `medalla`, `curar`, `plata`) son osciladores cortos.

El contexto se desbloquea al primer toque/tecla (política de autoplay). Se
apaga con `M` o el botón SON.

---

## 11. Contenido actual

**Mapas (10):** `casa` · `barrio` (Calle Mitre) · `kiosco` · `taller` ·
`depto` · `plaza` (Plaza Alsina) · `cancha` · `baldio` · `riachuelo` ·
`terminal`.

**Recorrido:** casa → taller (te dan el bicho) → plaza (**Doña Rosa**, Medalla
Escoba) → cancha (**Nacho el Barra**, Medalla Bombo) → baldío (el **Bocha**,
rival) → Riachuelo (**el Trapito**, Medalla Cuidacoches) → terminal (**el
Colectivero**, 5 bichos, Pase Libre y final).

**Duelos (15):** kevin, jazmin, brian, maxi, ruli, walter, nahuel, uriel,
cacho, suplente, inspector, bocha1, rosa★, nacho★, trapito★, colectivero★.

**Puertas cerradas:** la vecina de la plaza no te deja pasar a la cancha sin la
primera medalla; el Trapito no te deja cruzar el puente sin ganarle.

---

## 12. Cómo extender (recetas)

### Agregar un bicho

1. `src/25_sprites.js` → `MON_ART.nombre = ['...', ...]` (ancho ≤ 24).
2. `src/30_data.js` → `BICHOS.nombre = {n, t, b, x, cap, ap, d}`.
3. Ponerlo en la `lista` de encuentros de algún mapa, o en el `eq` de un duelo.

### Agregar un mapa

1. `src/40_maps.js` → nueva entrada en `MAPAS` con `t` (filas del mismo ancho).
2. Warps de ida **y de vuelta** (los dos mapas).
3. Vecinos con su entrada en `GENTE`.

### Agregar un vecino que da un objeto una sola vez

```js
GENTE.fulano = { nom:'Fulano', dial: () => {
  if (G.flags.fulano) return ['Ya te di, no seas garca.'];
  G.flags.fulano = 1; darObjeto('milanga', 3);
  return ['Tomá, llevate unas milangas.', '*Recibiste 3 Milangas!*'];
}};
```

### Agregar un tile

`src/20_tiles.js` → 16 filas de 16 caracteres + agregar la letra a `SOLID` si
frena. Recordar que el fondo va pintado adentro del tile.

### Trampas conocidas

- Las filas de tiles tienen que medir **exacto** 16; hay un validador en el
  historial de comandos y conviene volver a correrlo.
- Los caracteres de los mapas y las claves de `PAL` son **espacios de nombres
  distintos**: `g` es tierra en un mapa y rojo en un sprite.
- No usar acentos en mayúscula: la tipografía sólo tiene minúsculas acentuadas
  y `Ñ`.
- No vaciar `B.q` desde un menú de batalla (ver 8.2).

---

## 13. Pruebas

```sh
NODE_PATH=$(npm root -g) node test/driver.js   # 16 capturas de pantalla
NODE_PATH=$(npm root -g) node test/flujo.js    # partida completa automática
NODE_PATH=$(npm root -g) node test/stress.js   # captura, derrota y fuzzing
NODE_PATH=$(npm root -g) node test/mapas.js    # una foto de cada mapa
```

Requiere Playwright y Chromium. `test/flujo.js` y `test/stress.js` usan un
truco útil: llaman `paso()` en un `while` sincrónico forzando `KP.a = 1`, lo
que permite jugar 60.000 frames en un segundo y detectar cuelgues. Los tres
scripts fallan si aparece cualquier excepción en la página.

**Bugs que estos tests encontraron y ya están arreglados** (no reintroducirlos):

1. Mensajes de batalla desordenados por encolar al final en vez de después del
   paso actual.
2. Cuelgue total al quedarse sin PP en todos los ataques.
3. Al aprender un ataque nuevo se vaciaba la cola y la batalla quedaba
   trabada con el rival en 0 de vida.
4. El turno seguía corriendo después de que un bicho quedaba K.O.
5. Cursor sobre un bicho desmayado en el cambio forzado (no dejaba avanzar).

---

## 14. Ideas para estirarlo a 4 horas de juego

Lo que está armado banca esto sin refactor:

- **Más mapas**: el Puente Pueyrredón entero, Sarandí, Wilde, la fábrica
  abandonada, el tren Roca, la feria, el club de barrio.
- **Más bichos** hasta 35-40, con una segunda evolución para los iniciales.
- **Segunda vuelta**: después del Colectivero, un torneo con los cuatro
  medallistas al hilo, en niveles altos.
- **Sistema de día/noche** por `G.pasos` o reloj real: cambia la paleta y qué
  bichos aparecen (el Fernetón sólo de noche ya está insinuado en el texto).
- **Pesca en el Riachuelo** con caña: otra tabla de encuentros sobre tiles `~`.
- **Intercambio** entre dos partidas exportando el bicho como código de texto.
- **Misiones secundarias**: buscarle el perro a la vecina, juntar 10 cartones
  para Ruli, ganar el picadito.
- **Línea de visión de los entrenadores** (hoy hay que hablarles): recorrer los
  tiles en la dirección que miran cada vez que el jugador completa un paso.
