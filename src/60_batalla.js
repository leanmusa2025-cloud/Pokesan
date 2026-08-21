// ============================================================
//  BATALLA
// ============================================================
let B = null;
const MON = {};
function spriteMon(id) { return MON[id] || (MON[id] = mkArt(MON_ART[id])); }

function empezarBatalla(cfg) {
  const mio = G.equipo.findIndex(b => b.hp > 0);
  B = {
    tipo: cfg.tipo, id: cfg.id, nom: cfg.nom || '', look: cfg.look, duelo: cfg.duelo,
    eq: cfg.eq, ei: 0, plata: cfg.plata || 0,
    mi: mio < 0 ? 0 : mio,
    fase: 'cola', q: [], nuevos: null, msg: '', ch: 0, sel: 0, sel2: 0, t: 0,
    modA: {}, modD: {}, flash: 0, quien: '', huyo: 0, gano: 0, sacudir: 0,
    lista: null, vistoNivel: []
  };
  modo = 'batalla';
  Audio2.play('batalla');
  G.vistos[cfg.eq[0].id] = 1;
  const e = B.eq[0];
  if (B.tipo === 'salvaje') push('¡Un ' + BICHOS[e.id].n + ' salvaje\nse te cruzó!');
  else push('¡' + B.nom + ' te salió al cruce!');
  push('¡Dale ' + yo().mote + ', metele!');
}
function yo() { return G.equipo[B.mi]; }
function ene() { return B.eq[B.ei]; }
// los mensajes que se generan adentro de un paso se meten justo despues de ese paso
function push(msg, auto) { (B.nuevos || B.q).push({ msg, auto: auto === undefined ? 0 : auto }); }
function pushFn(f) { (B.nuevos || B.q).push({ fn: f }); }

// -------- calculos --------
function modMul(s) { return s >= 0 ? (2 + s) / 2 : 2 / (2 - s); }
function dano(atacante, defensor, mv, modAtk, modDef) {
  const A = ATAQUES[mv], sa = statsDe(atacante), sd = statsDe(defensor);
  if (!A.p) return { d: 0, ef: 1 };
  const atk = sa.atk * modMul(modAtk || 0), def = sd.def * modMul(modDef || 0);
  const ef = efect(A.t, BICHOS[defensor.id].t);
  const stab = BICHOS[atacante.id].t.includes(A.t) ? 1.5 : 1;
  const crit = chance(1 / 16) ? 2 : 1;
  let d = Math.floor(Math.floor(Math.floor(2 * atacante.lvl / 5 + 2) * A.p * atk / def) / 50) + 2;
  d = Math.floor(d * ef * stab * crit * (0.85 + Math.random() * 0.15));
  return { d: Math.max(1, d), ef, crit };
}
function textoEf(ef) {
  if (ef > 1.5) return '¡Le pegó justo donde duele!';
  if (ef > 1) return '¡Le entró bien!';
  if (ef === 0) return 'No le hizo ni cosquillas.';
  if (ef < 1) return 'Le hizo cosquillas nomás...';
  return '';
}

// -------- un turno --------
function usarAtaque(esMio, mvId) {
  const at = esMio ? yo() : ene(), df = esMio ? ene() : yo();
  const A = ATAQUES[mvId];
  const quien = esMio ? at.mote : (B.tipo === 'salvaje' ? BICHOS[at.id].n + ' salvaje' : 'El ' + BICHOS[at.id].n + ' rival');
  pushFn(() => {
    if (at.hp <= 0) return;
    if (at.estado === 'aturdido' && chance(0.25)) { push(quien + ' está aturdido\ny no se puede mover.'); return; }
    push(quien + ' usó ' + A.n + '!', 26);
    pushFn(() => {
      Audio2.sfx(A.p >= 60 ? 'fuerte' : A.p ? 'golpe' : 'bip');
      if (A.e === 'cura') {
        const c = Math.floor(at.hpMax / 2); at.hp = Math.min(at.hpMax, at.hp + c);
        push(quien + ' se recuperó un poco.');
        return;
      }
      if (!A.p) {
        if (A.e === 'bajaAtk') { const k = esMio ? 'e' : 'm'; B.modA[k] = clamp((B.modA[k] || 0) - 1, -6, 0); push('¡' + df.mote + ' se comió el verso!\nBajó su ataque.'); }
        else if (A.e === 'bajaDef') { const k = esMio ? 'e' : 'm'; B.modD[k] = clamp((B.modD[k] || 0) - 1, -6, 0); push('Bajó la defensa de ' + df.mote + '.'); }
        return;
      }
      const mA = esMio ? (B.modA.m || 0) : (B.modA.e || 0);
      const mD = esMio ? (B.modD.e || 0) : (B.modD.m || 0);
      const r = dano(at, df, mvId, mA, mD);
      df.hp = Math.max(0, df.hp - r.d);
      B.flash = 10; B.quien = esMio ? 'e' : 'm'; B.sacudir = 8;
      if (r.crit > 1) push('¡Justo en el palo! ¡Golpe crítico!');
      const te = textoEf(r.ef); if (te) push(te);
      if (A.e === 'tufo' && chance(0.35) && !df.estado) { df.estado = 'tufo'; push('¡' + df.mote + ' quedó con TUFO!'); }
      if (A.e === 'aturde' && chance(0.35) && !df.estado) { df.estado = 'aturdido'; push('¡' + df.mote + ' quedó ATURDIDO!'); }
      if (A.e === 'bajaDef' && chance(0.5)) { const k = esMio ? 'e' : 'm'; B.modD[k] = clamp((B.modD[k] || 0) - 1, -6, 0); push('Bajó la defensa de ' + df.mote + '.'); }
      if (A.e === 'chupa') { const c = Math.floor(r.d / 2); at.hp = Math.min(at.hpMax, at.hp + c); push(quien + ' le chupó la energía.'); }
      pushFn(() => { if (df.hp <= 0) caida(!esMio); });
    });
  });
}

function finDeTurno() {
  pushFn(() => {
    for (const [b, esMio] of [[yo(), 1], [ene(), 0]]) {
      if (b.hp > 0 && b.estado === 'tufo') {
        b.hp = Math.max(0, b.hp - Math.max(1, Math.floor(b.hpMax / 16)));
        push('¡El TUFO le está haciendo mal\na ' + b.mote + '!');
        pushFn(() => { if (b.hp <= 0) caida(!esMio); });
      }
    }
  });
}

function caida(cayoElMio) {
  B.q = B.q.filter(q => !q._turno);      // se corta el turno, no sigue nadie
  if (cayoElMio) {
    push('¡' + yo().mote + ' no da más!');
    pushFn(() => {
      if (!equipoVivo()) {
        push('¡Te quedaste sin bichos!');
        push('Te arrastraste hasta el kiosco de Ramón...');
        pushFn(() => terminarBatalla('perdiste'));
      } else { B.fase = 'cambiar'; B.forzado = 1; B.sel = Math.max(0, G.equipo.findIndex(x => x.hp > 0)); }
    });
  } else {
    const e = ene();
    push('¡' + (B.tipo === 'salvaje' ? BICHOS[e.id].n + ' salvaje' : 'El ' + BICHOS[e.id].n) + ' quedó K.O.!');
    pushFn(() => darExp(e));
  }
}

function darExp(e) {
  const g = Math.floor(BICHOS[e.id].x * e.lvl / 7) * (B.tipo === 'salvaje' ? 1 : 1.5);
  const b = yo();
  if (b.hp > 0) {
    b.exp += Math.floor(g);
    push(b.mote + ' ganó ' + Math.floor(g) + ' de experiencia.');
    pushFn(() => subirNivel(b));
  }
  pushFn(() => {
    if (B.tipo === 'salvaje') { terminarBatalla('gano'); return; }
    if (B.ei < B.eq.length - 1) {
      B.ei++; B.modA.e = 0; B.modD.e = 0;
      push(B.nom + ' mandó a ' + BICHOS[ene().id].n + '!');
      pushFn(() => { B.fase = 'menu'; });
    } else {
      push('¡Le ganaste a ' + B.nom + '!');
      pushFn(() => terminarBatalla('gano'));
    }
  });
}

function subirNivel(b) {
  while (b.lvl < 50 && b.exp >= expParaNivel(b.lvl + 1)) {
    b.lvl++;
    const nuevo = statHP(BICHOS[b.id].b[0], b.lvl);
    b.hp += nuevo - b.hpMax; b.hpMax = nuevo;
    Audio2.sfx('medalla');
    push('¡' + b.mote + ' subió a nivel ' + b.lvl + '!');
    for (const [lv, mv] of BICHOS[b.id].ap) {
      if (lv !== b.lvl) continue;
      if (b.ataques.some(a => a.id === mv)) continue;
      if (b.ataques.length < 4) {
        b.ataques.push({ id: mv, pp: ATAQUES[mv].pp, ppMax: ATAQUES[mv].pp });
        push('¡' + b.mote + ' aprendió ' + ATAQUES[mv].n + '!');
      } else {
        pushFn(() => { B.aprender = { b, mv }; B.fase = 'aprender'; B.sel = 0; });
      }
    }
    const ev = BICHOS[b.id].evo;
    if (ev && b.lvl >= ev[1]) {
      pushFn(() => {
        const viejo = BICHOS[b.id].n;
        if (b.mote === viejo) b.mote = BICHOS[ev[0]].n;
        b.id = ev[0];
        const nh = statHP(BICHOS[b.id].b[0], b.lvl);
        b.hp += nh - b.hpMax; b.hpMax = nh;
        G.vistos[b.id] = 1;
        Audio2.sfx('capturado');
        push('¡¿Qué?! ¡' + viejo + ' se transformó\nen ' + BICHOS[b.id].n + '!');
      });
    }
  }
}

// -------- chapitas --------
function tirarChapita(itemId) {
  const it = OBJETOS[itemId], e = ene();
  sacarObjeto(itemId);
  push('¡Le tiraste una ' + it.n + '!', 24);
  pushFn(() => {
    Audio2.sfx('chapita');
    if (B.tipo !== 'salvaje') { push('¡Eh! ¡No le podés robar el bicho\na otro! ¡Qué falta de códigos!'); pushFn(() => { B.fase = 'menu'; }); return; }
    const rate = BICHOS[e.id].cap;
    let p = (1 - (e.hp / e.hpMax) * 0.7) * (rate / 255) * it.rate;
    if (e.estado) p *= 1.4;
    p = clamp(p, 0.03, 0.95);
    let sac = 0; while (sac < 3 && chance(Math.pow(p, 0.34))) sac++;
    if (chance(p)) {
      push('¡Sacudió ' + sac + ' veces...', 20);
      pushFn(() => {
        Audio2.sfx('capturado');
        push('¡Cayó! ¡' + BICHOS[e.id].n + ' es tuyo!');
        const d = darBicho(e);
        G.vistos[e.id] = 1;
        if (d === 'caja') push('Como tenías seis, lo mandaste\na la caja de zapatos de tu pieza.');
        pushFn(() => terminarBatalla('capturo'));
      });
    } else {
      push('Sacudió ' + sac + ' veces...', 20);
      pushFn(() => { Audio2.sfx('escapo'); push('¡Se escapó! Casi.'); pushFn(() => turnoEnemigoSolo()); });
    }
  });
}
function marcarTurno(desde) { for (let i = desde; i < B.q.length; i++) B.q[i]._turno = 1; }
function turnoEnemigoSolo() {
  const desde = B.q.length;
  atacarIA();
  finDeTurno();
  pushFn(() => { if (B.fase === 'cola') B.fase = 'menu'; });
  marcarTurno(desde);
}

function atacarIA() {
  const e = ene(), m = yo();
  const dispo = e.ataques.filter(a => a.pp > 0);
  if (!dispo.length) { usarAtaque(false, 'forcejeo'); return; }
  let mejor = dispo[0], mejorV = -1;
  for (const a of dispo) {
    const A = ATAQUES[a.id];
    let v = A.p ? A.p * efect(A.t, BICHOS[m.id].t) : 25;
    v *= 0.8 + Math.random() * 0.4;
    if (v > mejorV) { mejorV = v; mejor = a; }
  }
  mejor.pp--;
  usarAtaque(false, mejor.id);
}

function turnoJugador(mvId) {
  const mv = yo().ataques.find(a => a.id === mvId);
  if (mv) mv.pp--;
  const A = ATAQUES[mvId];
  let vm = statsDe(yo()).vel, ve = statsDe(ene()).vel;
  if (yo().estado === 'aturdido') vm = Math.floor(vm / 2);
  if (ene().estado === 'aturdido') ve = Math.floor(ve / 2);
  const primero = A.e === 'primero' ? true : (vm === ve ? chance(0.5) : vm > ve);
  const desde = B.q.length;
  if (primero) { usarAtaque(true, mvId); atacarIA(); }
  else { atacarIA(); usarAtaque(true, mvId); }
  finDeTurno();
  pushFn(() => { if (B.fase === 'cola') B.fase = 'menu'; });
  marcarTurno(desde);
  B.fase = 'cola';
}

function intentarRajar() {
  if (B.tipo !== 'salvaje') { push('¡No podés rajar de un duelo!\nQuedás pegado para siempre.'); pushFn(() => { B.fase = 'menu'; }); B.fase = 'cola'; return; }
  const p = clamp(0.35 + (statsDe(yo()).vel - statsDe(ene()).vel) / 100, 0.2, 0.95);
  if (chance(p)) { push('¡Rajaste como si nada!'); pushFn(() => terminarBatalla('rajo')); }
  else { push('¡No pudiste rajar!'); turnoEnemigoSolo(); }
  B.fase = 'cola';
}

function terminarBatalla(res) {
  const d = B.duelo, id = B.id, plata = B.plata, tipo = B.tipo;
  if (res === 'perdiste') {
    const perdida = Math.floor(G.guita / 2);
    G.guita -= perdida;
    curarTodo();
    B = null; modo = 'mundo'; Audio2.play('barrio');
    fundir(() => {
      irAMapa('kiosco', 5, 5, 'u');
      decir(['Ramón te levantó del piso y te curó\nlos bichos.',
        'Se cobró $' + perdida + ' por las molestias.',
        '"No es nada, pibe. Andá tranquilo."']);
    });
    return;
  }
  if (res === 'gano' && tipo === 'entrenador') {
    G.flags['d_' + id] = 1;
    G.guita += plata;
    B = null; modo = 'mundo'; Audio2.play('barrio');
    const lineas = (d.win || []).slice();
    lineas.push('Te dio $' + plata + '.');
    if (d.gym) {
      G.medallas.push(d.gym);
      fundir(() => decir(lineas, () => { Audio2.sfx('medalla'); if (id === 'colectivero') finalDelJuego(); }));
    } else fundir(() => decir(lineas));
    return;
  }
  B = null; modo = 'mundo'; Audio2.play('barrio');
  fundir(() => { });
}

// -------- update --------
function updBatalla() {
  B.t++;
  if (B.flash > 0) B.flash--;
  if (B.sacudir > 0) B.sacudir--;
  if (B.fase === 'cola') { procesarCola(); return; }
  if (B.fase === 'menu') return menuBatalla();
  if (B.fase === 'ataques') return menuAtaques();
  if (B.fase === 'cambiar') return menuCambio();
  if (B.fase === 'bolso') return menuBolsoBatalla();
  if (B.fase === 'aprender') return menuAprender();
}
function procesarCola() {
  if (!B.q.length) { B.fase = 'menu'; return; }
  const it = B.q[0];
  if (it.fn) {
    B.q.shift(); B.nuevos = [];
    it.fn();
    if (!B) return;                       // la batalla se termino adentro del paso
    const n = B.nuevos; B.nuevos = null;
    if (n.length) B.q = n.concat(B.q);
    return;
  }
  if (B.msg !== it.msg) { B.msg = it.msg; B.ch = 0; B.esperando = 0; }
  const total = B.msg.length;
  if (B.ch < total) {
    B.ch += 2;
    if (KP.a || KP.b) B.ch = total;
    return;
  }
  if (it.auto) { it.auto--; if (it.auto <= 0) { B.q.shift(); B.msg = ''; } return; }
  if (KP.a || KP.b) { Audio2.sfx('sel'); B.q.shift(); B.msg = ''; }
}
function navegar(n, cols) {
  cols = cols || 1;
  if (KP.up) { B.sel = (B.sel - cols + n * 2) % n; Audio2.sfx('bip'); }
  if (KP.dn) { B.sel = (B.sel + cols) % n; Audio2.sfx('bip'); }
  if (cols > 1) {
    if (KP.lf) { B.sel = (B.sel + n - 1) % n; Audio2.sfx('bip'); }
    if (KP.rt) { B.sel = (B.sel + 1) % n; Audio2.sfx('bip'); }
  }
}
function menuBatalla() {
  navegar(4, 2);
  if (KP.a) {
    Audio2.sfx('sel');
    if (B.sel === 0) {
      if (yo().ataques.every(a => a.pp <= 0)) {     // sin PP: forcejeo
        B.q = []; push('¡A ' + yo().mote + ' no le quedan\nataques! ¡Se tira a los manotazos!');
        turnoJugador('forcejeo'); return;
      }
      B.fase = 'ataques'; B.sel = 0;
    }
    else if (B.sel === 1) { B.fase = 'cambiar'; B.forzado = 0; B.sel = 0; }
    else if (B.sel === 2) { B.fase = 'bolso'; B.sel = 0; B.lista = Object.keys(G.objetos); }
    else intentarRajar();
  }
}
function menuAtaques() {
  const mv = yo().ataques;
  navegar(mv.length);
  if (KP.b) { Audio2.sfx('sel'); B.fase = 'menu'; B.sel = 0; return; }
  if (KP.a) {
    const a = mv[B.sel];
    if (a.pp <= 0) { Audio2.sfx('escapo'); return; }
    Audio2.sfx('sel');
    turnoJugador(a.id);
  }
}
function menuCambio() {
  navegar(G.equipo.length);
  if (KP.b && !B.forzado) { Audio2.sfx('sel'); B.fase = 'menu'; B.sel = 0; return; }
  if (KP.a) {
    const i = B.sel;
    if (G.equipo[i].hp <= 0) { Audio2.sfx('escapo'); return; }
    if (i === B.mi && !B.forzado) { Audio2.sfx('escapo'); return; }
    Audio2.sfx('sel');
    const era = B.forzado;
    B.mi = i; B.modA.m = 0; B.modD.m = 0;
    const saludo = [{ msg: '¡Vení ' + yo().mote + '!' }];
    B.q = era ? saludo : saludo.concat(B.q);
    B.fase = 'cola'; B.sel = 0;
    if (!era) { atacarIA(); finDeTurno(); pushFn(() => { if (B.fase === 'cola') B.fase = 'menu'; }); }
    B.forzado = 0;
  }
}
function menuBolsoBatalla() {
  const l = B.lista;
  if (!l.length) { B.fase = 'menu'; return; }
  navegar(l.length);
  if (KP.b) { Audio2.sfx('sel'); B.fase = 'menu'; B.sel = 0; return; }
  if (KP.a) {
    const id = l[B.sel], it = OBJETOS[id];
    Audio2.sfx('sel');
    B.fase = 'cola'; B.q = [];
    if (it.tipo === 'bola') { tirarChapita(id); }
    else if (it.tipo === 'cura') {
      const b = yo();
      if (b.hp >= b.hpMax && !b.estado) { push('No hace falta.'); pushFn(() => { B.fase = 'menu'; }); return; }
      sacarObjeto(id);
      const c = Math.min(it.cura, b.hpMax - b.hp); b.hp += c;
      if (it.limpia) b.estado = '';
      Audio2.sfx('curar');
      push('Le diste un ' + it.n + '.\n' + b.mote + ' recuperó ' + c + ' de vida.');
      turnoEnemigoSolo();
    } else if (it.tipo === 'estado') {
      const b = yo();
      if (!b.estado) { push('No le pasa nada.'); pushFn(() => { B.fase = 'menu'; }); return; }
      sacarObjeto(id); b.estado = ''; Audio2.sfx('curar');
      push(b.mote + ' quedó como nuevo.');
      turnoEnemigoSolo();
    } else { push('Acá no sirve.'); pushFn(() => { B.fase = 'menu'; }); }
  }
}
function menuAprender() {
  const { b, mv } = B.aprender;
  navegar(5);
  if (KP.a) {
    Audio2.sfx('sel');
    // ojo: NO se puede vaciar la cola, adentro esta lo que sigue de la batalla
    let nuevos;
    if (B.sel < 4) {
      const viejo = ATAQUES[b.ataques[B.sel].id].n;
      b.ataques[B.sel] = { id: mv, pp: ATAQUES[mv].pp, ppMax: ATAQUES[mv].pp };
      nuevos = [{ msg: 'Se olvidó de ' + viejo + '...' }, { msg: '¡Y aprendió ' + ATAQUES[mv].n + '!' }];
    } else {
      nuevos = [{ msg: b.mote + ' no aprendió ' + ATAQUES[mv].n + '.' }];
    }
    B.q = nuevos.concat(B.q); B.sel = 0; B.fase = 'cola';
  }
}

// -------- dibujo --------
function barraHP(x, y, w, hp, max) {
  rect(x - 1, y - 1, w + 2, 5, PAL['0']);
  rect(x, y, w, 3, PAL['2']);
  const f = Math.max(0, Math.round(w * hp / max));
  const col = hp / max > 0.5 ? PAL['a'] : hp / max > 0.2 ? PAL['i'] : PAL['g'];
  rect(x, y, f, 3, col);
}
function cajaHP(b, x, y, mio) {
  const w = mio ? 74 : 72, h = mio ? 30 : 24;
  panel(x, y, w, h);
  drawText(ctx, b.mote.slice(0, 10), x + 5, y + 4, PAL['0']);
  drawText(ctx, 'N' + b.lvl, x + w - 20, y + 4, PAL['0']);
  drawText(ctx, 'VIDA', x + 5, y + 13, PAL['0']);
  barraHP(x + 28, y + 15, w - 34, b.hp, b.hpMax);
  if (mio) drawText(ctx, b.hp + '/' + b.hpMax, x + 24, y + 21, PAL['0']);
  if (b.estado) drawText(ctx, b.estado === 'tufo' ? 'TUF' : 'ATU', x + 5, y + (mio ? 21 : 15), PAL['g']);
}
function dibujarBatalla() {
  rect(0, 0, W, H, PAL['e']);
  rect(0, 0, W, 40, PAL['d']);
  rect(0, 74, W, 22, PAL['b']);
  rect(0, 88, W, 8, PAL['a']);
  // pisos
  ctx.fillStyle = PAL['a'];
  ctx.beginPath(); ctx.ellipse(128, 56, 30, 8, 0, 0, 7); ctx.fill();
  ctx.fillStyle = PAL['9'];
  ctx.beginPath(); ctx.ellipse(34, 92, 34, 9, 0, 0, 7); ctx.fill();
  const sh = B.sacudir > 0 ? ((B.sacudir >> 1) & 1 ? 2 : -2) : 0;
  const e = ene(), m = yo();
  if (!(B.flash > 0 && B.quien === 'e' && (B.flash >> 1) & 1))
    blit(spriteMon(e.id), 104 + (B.quien === 'e' ? sh : 0), 58 - spriteMon(e.id).height * 2, 2);
  if (!(B.flash > 0 && B.quien === 'm' && (B.flash >> 1) & 1))
    blit(spriteMon(m.id), 8 + (B.quien === 'm' ? sh : 0), 94 - spriteMon(m.id).height * 2, 2);
  cajaHP(e, 4, 6, 0);
  cajaHP(m, 82, 62, 1);
  // caja de texto
  panel(0, 96, 160, 48);
  if (B.fase === 'cola') {
    const ls = B.msg.split('\n'); let n = B.ch;
    for (let i = 0; i < ls.length; i++) {
      drawText(ctx, ls[i].slice(0, Math.max(0, Math.min(ls[i].length, n))), 8, 104 + i * 11, PAL['0']);
      n -= ls[i].length + 1;
    }
    if (B.ch >= B.msg.length && !B.q[0]?.auto && ((B.t >> 3) & 1)) { rect(150, 136, 4, 2, PAL['0']); rect(151, 138, 2, 1, PAL['0']); }
  } else if (B.fase === 'menu') {
    drawText(ctx, '¿Qué hacés?', 8, 104, PAL['0']);
    const op = ['PELEAR', 'BICHO', 'BOLSO', 'RAJAR'];
    for (let i = 0; i < 4; i++) {
      const x = 78 + (i % 2) * 40, y = 104 + ((i / 2) | 0) * 14;
      drawText(ctx, op[i], x, y, PAL['0']);
      if (B.sel === i) drawText(ctx, '>', x - 8, y, PAL['0']);
    }
  } else if (B.fase === 'ataques') {
    const mv = yo().ataques;
    for (let i = 0; i < mv.length; i++) {
      const A = ATAQUES[mv[i].id];
      drawText(ctx, A.n, 14, 102 + i * 10, PAL['0']);
      if (B.sel === i) drawText(ctx, '>', 5, 102 + i * 10, PAL['0']);
    }
    const A = ATAQUES[mv[B.sel].id];
    drawText(ctx, A.t, 100, 102, PAL['0']);
    drawText(ctx, 'PP ' + mv[B.sel].pp + '/' + mv[B.sel].ppMax, 100, 114, PAL['0']);
    drawText(ctx, 'POT ' + (A.p || '--'), 100, 126, PAL['0']);
  } else if (B.fase === 'cambiar') {
    for (let i = 0; i < G.equipo.length; i++) {
      const b = G.equipo[i];
      drawText(ctx, b.mote.slice(0, 9), 14, 100 + i * 8, b.hp > 0 ? PAL['0'] : PAL['3']);
      drawText(ctx, 'N' + b.lvl, 84, 100 + i * 8, PAL['0']);
      drawText(ctx, b.hp + '/' + b.hpMax, 108, 100 + i * 8, PAL['0']);
      if (B.sel === i) drawText(ctx, '>', 5, 100 + i * 8, PAL['0']);
    }
  } else if (B.fase === 'bolso') {
    const l = B.lista;
    for (let i = 0; i < Math.min(4, l.length); i++) {
      const k = l[i];
      drawText(ctx, OBJETOS[k].n, 14, 102 + i * 10, PAL['0']);
      drawText(ctx, 'x' + G.objetos[k], 110, 102 + i * 10, PAL['0']);
      if (B.sel === i) drawText(ctx, '>', 5, 102 + i * 10, PAL['0']);
    }
  } else if (B.fase === 'aprender') {
    const b = B.aprender.b;
    drawText(ctx, '¿Qué ataque olvida?', 8, 100, PAL['0']);
    for (let i = 0; i < 4; i++) {
      drawText(ctx, ATAQUES[b.ataques[i].id].n, 14, 110 + i * 8, PAL['0']);
      if (B.sel === i) drawText(ctx, '>', 5, 110 + i * 8, PAL['0']);
    }
    drawText(ctx, 'NINGUNO', 100, 110 + 24, PAL['0']);
    if (B.sel === 4) drawText(ctx, '>', 92, 134, PAL['0']);
  }
}
