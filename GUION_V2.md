# Avellaneda 96 — Los Apagados
## Plan de la versión 2: presupuesto, sistema y guion

> Documento de diseño. Todavía no se tocó una línea de código.

---

# PARTE 1 · ¿Cuánto le podemos sumar?

## 1.1 Lo que pesa hoy

| Parte | Peso |
|---|---|
| Motor (canvas, input, audio, guardado) | 11,4 KB |
| Tipografía | 5,5 KB |
| Tiles (31) | 11,7 KB |
| Sprites y bichos (15) | 10,0 KB |
| Datos (tipos, ataques, objetos) | 8,9 KB |
| Mapas + vecinos + diálogos (10 mapas) | 21,5 KB |
| Mundo (caminar, hablar) | 10,6 KB |
| Batalla | 20,1 KB |
| Menús y escenas | 13,7 KB |
| Título y bucle | 5,8 KB |
| **Total** | **122 KB** |

## 1.2 Lo que cuesta cada cosa (medido, no estimado)

| Unidad | Costo real |
|---|---|
| 1 personaje/enemigo dibujado (24x24) | **412 bytes** |
| 1 tile nuevo (16x16) | **330 bytes** |
| 1 mapa completo con vecinos | **~1.100 bytes** |
| 1 renglón de diálogo | **~59 bytes** |
| 1 retrato de personaje (busto 48x48) | ~1.600 bytes |
| 1 tema musical chiptune | ~1.000 bytes |

**El dato importante: un renglón de diálogo pesa 59 bytes.** En 1 MB entran
**15.000 renglones de guion**. El guion de un RPG grande son 3.000. O sea: la
historia es prácticamente gratis. Lo caro nunca es el peso, es escribirlo.

## 1.3 Presupuesto de la v2 completa

| Qué | Cantidad | Peso |
|---|---|---|
| Mapas | 40 (hoy 10) | 44 KB |
| Tiles nuevos | +60 | 20 KB |
| Personajes, Apagados y barras | 45 sprites | 19 KB |
| Retratos para el cuadro de diálogo | 20 | 32 KB |
| **Guion** | **3.000 renglones** | **177 KB** |
| Código nuevo (cutscenes, misiones, día/noche, finales, banda de 4) | — | 60 KB |
| Música | 12 temas | 12 KB |
| Lo que ya está | — | 122 KB |
| **TOTAL** | | **~486 KB** |

**Respuesta corta: el mega no lo llenamos ni queriendo.** Con un juego cuatro
veces más grande que el actual quedamos en la mitad del límite. Y 486 KB sigue
siendo un archivo que se manda por WhatsApp sin que nadie se queje.

El techo real no es el peso: es cuánto guion se escribe y cuántos mapas se
dibujan. Eso sí lleva tiempo.

---

# PARTE 2 · En qué gastar el volumen

Ordenado por cuánto cambia el juego, no por lo que cuesta.

### 1. Sistema de escenas (lo que convierte un demo en un juego)
Hoy los diálogos son una lista de frases. Hace falta poder escribir:
*"el personaje camina tres pasos, se para, la pantalla tiembla, se corta la
luz, entra otro por la derecha, suena un ruido, se van los dos"*. Se escribe
como datos, igual que los mapas. **Sin esto no hay historia, hay carteles.**

### 2. Retratos en el cuadro de diálogo
Un busto de 48x48 al costado del texto cuando habla alguien importante. Es
la mejora que más "juego terminado" hace parecer, por 1,6 KB por cara.

### 3. Tu banda (4 en combate en vez de 1)
Peleás con tus amigos, cada uno con su estilo y sus frases propias durante la
pelea. Cambia la sensación de todo el juego.

### 4. Despertar en vez de capturar
Ver abajo. Reusa todo el sistema de captura que ya está hecho y funcionando,
pero invertido moralmente.

### 5. Elecciones con consecuencia
Un contador escondido de **CÓDIGOS** (cómo te portás). Cambia quién te ayuda
en el acto final y cuál de los finales te toca.

### 6. La libreta
Misiones, pistas, quién despertaste, qué te falta. Reemplaza al menú de
bichos.

### 7. Día y noche
De día investigás y hablás. De noche salen los Apagados y el barrio cambia de
paleta. Duplica el valor de cada mapa sin dibujar uno nuevo.

### 8. Peleas de jefe con fases
El jefe habla en el medio de la pelea, cambia de estrategia, y a veces la
pelea se gana perdiendo.

### 9. Flashbacks jugables
Escenas cortas en otra paleta (blanco y negro sucio) donde jugás un recuerdo.
Ahí van los golpes de guion.

### 10. Más barrio
Sarandí, Wilde, Piñeyro, Dock Sud, el hospital, el club, el tren Roca, la
villa, la fábrica entera, el puente de noche.

---

# PARTE 3 · El sistema nuevo

## Los Apagados no se matan: se despiertan

No son muertos vivos. Son **vecinos**. Gente que se quedó sin adentro y sigue
caminando por costumbre, repitiendo la última frase que le importó.

- En combate los frenás (no los lastimás: los cansás).
- Cuando están abajo, hay que **despertarlos**, y cada uno tiene su gatillo
  distinto: un balde de agua, un cachetazo, un mate amargo, la radio con el
  partido, el olor de un guiso, el nombre de un hijo, una canción del 87.
- **Descubrir el gatillo es el acertijo.** Se averigua hablando con quien lo
  conocía. Por eso hablar con la gente sirve para algo, no es decoración.
- Al que despertás **vuelve al barrio** y después te devuelve la mano: te abre
  una puerta, te suelta un dato, o aparece en la última pelea.
- **Nada te obliga a despertarlos.** Podés pasar de largo. El juego lleva la
  cuenta y te la cobra al final.

## Las barras rivales sí son peleas de verdad

Los del Fondo no están apagados. Están enteros y eligen. No se despiertan, se
les gana. Y —acá está el asunto— **no son los malos**.

## Tu banda

Cada amigo entra por un motivo distinto y tiene su forma de pelear. Alguno se
va a ir en el medio. Alguno no va a llegar al final entero.

---

# PARTE 4 · El guion

## Premisa

Avellaneda, enero del 96. Cuarenta grados. Se corta la luz todas las noches.

Tu **tía Nélida** —la que te crió mientras tu vieja hacía doble turno— sale un
martes y no vuelve. Deja la pava en el fuego y la puerta abierta.

Esa misma noche aparecen los primeros. Vecinos caminando a las tres de la
mañana, la mirada apagada, repitiendo una sola frase.

*"El turno noche. El turno noche. El turno noche."*

---

## ACTO 1 · El martes que no volvió

Arranca chiquito y en joda: un mandado al kiosco, chamuyo con los pibes, el
calor, la radio. Se presentan el barrio y la banda. **Diez minutos donde no
pasa nada malo**, para que después duela.

Volvés. La tía no está. La pava quemada. Un olor dulce raro, como a jarabe.

A la noche te cruzás al primero: **Don Osvaldo**, el de la esquina. Repite
*"el turno noche"*. Le tirás la soda en la cara y vuelve en sí, asustado,
sin saber qué día es. Te dice una sola cosa antes de que se lo lleven:

> *"En la empresa dijeron que era una vitamina."*

**Gancho del acto:** la tía hacía changas de enfermera en la enfermería de la
fábrica del Riachuelo.

## ACTO 2 · La banda

Juntás a tus amigos. Cada uno tiene su precio: uno tiene miedo, otro está
peleado con vos desde el verano pasado, otro **no quiere saber nada porque su
viejo labura en la fábrica**.

Aparecen **Los del Fondo**, la barra del club rival. Te cortan el puente. El
que manda, **el Chaqueño**, te dice de frente:

> *"Vos no sabés lo que hay del otro lado. Yo te estoy cuidando, pelotudo."*

Vos no le creés. Le ganás. Te deja pasar escupiendo al piso:

> *"Después no vengas llorando."*

**Lo que el jugador no sabe:** acaba de romper la única barrera que había.

## ACTO 3 · La fábrica

Cruzás el puente. La planta al lado del agua negra. La enfermería. Los
papeles. Y la libreta de tu tía, con su letra.

> ### PLOT TWIST 1
> **A la tía no se la llevaron. Entró sola y a propósito.**
> Venía juntando pruebas hace meses. Los papelitos que te iban apareciendo, que
> vos pensabas que eran de un desconocido que te quería ayudar, **son de ella**.
> Te los dejó ella. Te estuvo guiando desde el primer minuto.

Y ahí entendés qué son los Apagados: la "vitamina" que la empresa le daba a
los operarios para aguantar turnos dobles. No los mató. Les apagó todo menos
la costumbre.

## ACTO 4 · Los códigos

> ### PLOT TWIST 2
> **El que reparte la vitamina en el barrio es Chirola, el ferretero.**
> El que te conoce desde que naciste. El que te fiaba. No es un tipo de traje
> en una oficina: es el vecino. Y no lo hace por guita.
>
> *"Pibe, con eso la gente aguanta el laburo. Aguanta el turno, aguanta al
> capataz, aguanta llegar a fin de mes. ¿Qué querés? ¿Que se queden sin
> nada? Yo les di algo."*

> ### PLOT TWIST 3
> **Uno de tus amigos se está apagando desde el Acto 1 y lo viste todo el
> tiempo.** Se repite. Se olvida cosas. Dice la misma frase dos veces en una
> conversación. Vos te reíste. El viejo le dio la vitamina para que aguantara
> la escuela a la mañana y el laburo a la tarde.
>
> Cuando el jugador vuelve para atrás, las pistas estaban todas desde el
> principio. Están escritas para que no se noten la primera vez.

> ### PLOT TWIST 4
> **El Chaqueño y Los del Fondo se te suman.** Ellos cuidaban el puente para
> que la vitamina no cruzara al barrio. Perdieron pibes con eso. Eran los
> únicos que estaban haciendo algo, y vos les pegaste para pasar.
>
> **Y te lo cobra el juego:** si en el Acto 2 los humillaste, en el final te
> ayudan a medias. Si les ganaste sin ensañarte, vienen enteros.

## ACTO 5 · El apagón

La empresa corta la luz de toda Avellaneda para mover la mercadería sin
testigos. La ciudad a oscuras, llena de Apagados, y vos cruzando de punta a
punta con tu banda y con la barra rival.

Encontrás a la tía.

> ### EL TWIST DE VERDAD
> **La tía se tomó la vitamina a propósito.**
> Era la única forma de entrar y quedarse adentro sin que la sacaran: apagarse.
> Sabía que se apagaba. Lo hizo igual.
>
> Y dejó escrito **su propio gatillo de despertar** en la primera página de la
> libreta que vos venís cargando desde el Acto 1. Lo leíste diez veces sin
> entender qué era.

### La decisión final

El despertador que traés alcanza para **dos**. Y tenés tres:

1. **Tu tía.**
2. **Tu amigo.**
3. **El barrio** — Chirola tiene la fórmula y si lo dejás ir, la sigue
   repartiendo; si lo frenás, se pierde el único que sabe hacer el antídoto.

No hay opción de salvar a todos. No hay final perfecto escondido. Elegís y el
juego te lo respeta.

### Finales

Se cruzan tres cosas: **a quién elegiste acá**, **a cuántos vecinos
despertaste en todo el juego**, y **cómo trataste a los del Fondo**. Cada final
cierra con un epílogo por personaje, uno por uno, contando en qué terminó cada
uno. Como los de las películas.

---

## Por qué este guion se banca

- Los zombies no son monstruos: son laburantes quemados. Es el chiste y es el
  drama, al mismo tiempo.
- El villano no es un empresario: es el ferretero que te conoce de toda la
  vida, y tiene razones.
- La víctima no es víctima: la tía resulta ser la que más agallas tuvo de
  todos, y el jugador se pasa cuatro actos subestimándola.
- La pelea del Acto 2 te la cobran en el Acto 5. Le pegaste a los buenos.
- **Todo está plantado desde el Acto 1.** Nada sale de la galera. El jugador
  que vuelve a jugar encuentra las pistas en la cara.

---

# PARTE 5 · Lo que necesito de vos

El guion está armado con lugares vacíos a propósito. **Sos vos, y son tus
amigos.** Sin esos datos queda genérico, y ahí se cae todo.

### 1. Vos
- Nombre o apodo con el que querés aparecer
- Qué edad tenés en el juego (¿15? ¿17?)
- Cómo te dibujo: pelo, gorra o no, ropa, algo que siempre lleves encima
- Una manía tuya que sirva para los chistes

### 2. Tus amigos (4 a 6)
De cada uno:
- Apodo
- **Una sola cosa** que lo defina ("el que siempre llega tarde", "la que no le
  tiene miedo a nada", "el que habla de más")
- Cómo pelearía si tuviera que pelear
- Qué haría si se corta la luz y hay que entrar a un lugar oscuro

> **Y elegí uno para que sea el que se está apagando.** Tiene que ser el que
> menos te lo esperarías. Decime cuál y por qué es doloroso que sea ese.

### 3. La tía
- Nombre
- De qué labura
- Cómo te trata (¿te reta? ¿te cubre? ¿te caga a pedos y después te da plata?)
- **Una frase que diga siempre.** Esta es la más importante de todas: **es su
  gatillo de despertar** y va a estar escrita en la primera página de la
  libreta desde el minuto uno.

### 4. Anécdotas
Tres o cuatro cosas reales que les hayan pasado, aunque sean boludeces. Los
chistes internos son lo que hace que el juego sea de ustedes y no de
cualquiera.

### 5. Lugares
Kioscos, esquinas, canchas, plazas, el colegio, la casa de alguno. Con
nombres reales si querés.

---

## Nota de oficio

Para la barra rival conviene inventarle el nombre y el club (**Los del Fondo**
es un ejemplo) en vez de usar una hinchada que existe de verdad. Queda mejor
como ficción, se puede escribir con más libertad, y nadie se ofende. Al club
de ustedes, en cambio, se le puede seguir haciendo toda la gamba que quieras.
