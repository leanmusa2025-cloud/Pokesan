// ============================================================
//  NUCLEO: pantalla, paletas (noche / 2010), sprites, input, audio
// ============================================================
const W = 160, H = 144;
const cv = document.getElementById('screen');
const ctx = cv.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

// la ciudad de noche, hace un mes que no sale el sol
const PAL_NOCHE = {
  '0': '#05050a', '1': '#101018', '2': '#1c1c2a', '3': '#2e2e44', '4': '#4a4a68', '5': '#7a7a98',
  '6': '#2a1c14', '7': '#452c1c', '8': '#654428', '9': '#14261a', 'a': '#22422a', 'b': '#3a6440',
  'c': '#0c1a34', 'd': '#1a3660', 'e': '#3a5c8c', 'f': '#4a1414', 'g': '#8a2a22', 'h': '#a86a20',
  'i': '#d8b040', 'j': '#8a6a52', 'k': '#6a4a3a', 'l': '#3a1a34', 'm': '#6a3050', 'n': '#141410',
  'o': '#2a2a20', 'p': '#44443a', 'q': '#5a5a4c', 'r': '#1a1a24', 's': '#9a9ab0'
};
// la quinta, verano de 2010, y la manana del final
const PAL_DIA = {
  '0': '#20202c', '1': '#3a3a4e', '2': '#5c5c78', '3': '#8a8aa4', '4': '#b8b8ca', '5': '#eeeef6',
  '6': '#6c4426', '7': '#9c6a38', '8': '#d0a062', '9': '#3a7c40', 'a': '#5cb050', 'b': '#9cd868',
  'c': '#2a4c90', 'd': '#4a90dc', 'e': '#a0d8f8', 'f': '#b02828', 'g': '#e85a44', 'h': '#f8b048',
  'i': '#f8e468', 'j': '#f0c098', 'k': '#d09070', 'l': '#8a3a7a', 'm': '#d86aa8', 'n': '#3a3a28',
  'o': '#6c6c50', 'p': '#a0a078', 'q': '#dcdcb4', 'r': '#4a4a5c', 's': '#ffffff'
};
let PAL = PAL_NOCHE, LUZ = 'noche';

// colores de interfaz que acompanan la paleta
const COL = {};
function refrescarUI() {
  const n = LUZ === 'noche';
  COL.panel = n ? PAL['1'] : PAL['5'];
  COL.borde = n ? PAL['4'] : PAL['0'];
  COL.borde2 = n ? PAL['3'] : PAL['2'];
  COL.texto = n ? PAL['s'] : PAL['0'];
  COL.tenue = n ? PAL['4'] : PAL['2'];
  COL.acento = PAL['i'];
}

function makeSprite(art, extra) {
  const h = art.length, w = art[0].length;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const ch = art[y][x];
    if (ch === '.' || ch === ' ') continue;
    const col = (extra && extra[ch]) || PAL[ch];
    if (!col) continue;
    g.fillStyle = col; g.fillRect(x, y, 1, 1);
  }
  return c;
}
function padArt(rows) {
  let w = 0; for (const r of rows) if (r.length > w) w = r.length;
  return rows.map(r => r + '.'.repeat(w - r.length));
}
function mkArt(rows, colors) { return makeSprite(padArt(rows), colors); }

// cambiar de luz reconstruye todo el arte cacheado
const _cachesArte = [];
function registrarCache(obj) { _cachesArte.push(obj); }
function ponerLuz(modo) {
  if (LUZ === modo) return;
  LUZ = modo; PAL = modo === 'dia' ? PAL_DIA : PAL_NOCHE;
  refrescarUI();
  for (const c of _cachesArte) for (const k in c) delete c[k];
  for (const k in _atlas) delete _atlas[k];
  if (typeof reconstruirArte === 'function') reconstruirArte();
}

function blit(s, x, y, sc) {
  sc = sc || 1;
  ctx.drawImage(s, 0, 0, s.width, s.height, x | 0, y | 0, s.width * sc, s.height * sc);
}
function blitFlip(s, x, y, sc) {
  sc = sc || 1;
  ctx.save(); ctx.translate((x | 0) + s.width * sc, y | 0); ctx.scale(-1, 1);
  ctx.drawImage(s, 0, 0, s.width, s.height, 0, 0, s.width * sc, s.height * sc);
  ctx.restore();
}
function rect(x, y, w, h, col) { ctx.fillStyle = col; ctx.fillRect(x | 0, y | 0, w | 0, h | 0); }

function panel(x, y, w, h) {
  rect(x, y, w, h, COL.panel);
  rect(x, y, w, 1, COL.borde); rect(x, y + h - 1, w, 1, COL.borde);
  rect(x, y, 1, h, COL.borde); rect(x + w - 1, y, 1, h, COL.borde);
  rect(x + 2, y + 2, w - 4, 1, COL.borde2); rect(x + 2, y + h - 3, w - 4, 1, COL.borde2);
  rect(x + 2, y + 2, 1, h - 4, COL.borde2); rect(x + w - 3, y + 2, 1, h - 4, COL.borde2);
}

// ---- input ----
const K = { up: 0, dn: 0, lf: 0, rt: 0, a: 0, b: 0, st: 0 };
const KP = { up: 0, dn: 0, lf: 0, rt: 0, a: 0, b: 0, st: 0 };
const MAPK = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'dn', KeyS: 'dn', ArrowLeft: 'lf', KeyA: 'lf',
  ArrowRight: 'rt', KeyD: 'rt', KeyZ: 'a', Space: 'a', KeyJ: 'a', KeyX: 'b', KeyK: 'b',
  Backspace: 'b', Enter: 'st', Escape: 'st'
};
function setKey(name, v) { if (!name) return; if (v && !K[name]) KP[name] = 1; K[name] = v; }
addEventListener('keydown', e => {
  if (e.code === 'KeyM' && !e.repeat) { Audio2.toggle(); e.preventDefault(); return; }
  const n = MAPK[e.code]; if (n) { if (!e.repeat) setKey(n, 1); e.preventDefault(); }
});
addEventListener('keyup', e => { const n = MAPK[e.code]; if (n) { setKey(n, 0); e.preventDefault(); } });
function clearPressed() { for (const k in KP) KP[k] = 0; }

(function touchPad() {
  const pad = document.getElementById('pad');
  const coarse = matchMedia('(pointer:coarse)').matches || 'ontouchstart' in window;
  if (coarse) pad.style.display = 'flex';
  const btns = [...pad.querySelectorAll('[data-k]')];
  const zones = () => btns.map(b => ({ b, r: b.getBoundingClientRect(), k: MAPK[b.dataset.k], raw: b.dataset.k }));
  let Z = zones(); addEventListener('resize', () => setTimeout(() => Z = zones(), 60));
  const active = new Map();
  function apply() {
    const on = new Set([...active.values()].flat());
    for (const z of Z) {
      const hit = on.has(z.raw);
      z.b.classList.toggle('on', hit);
      if (z.raw === 'KeyM') { if (hit && !z._m) { z._m = 1; Audio2.toggle(); } if (!hit) z._m = 0; }
      else setKey(z.k, hit ? 1 : 0);
    }
  }
  function upd(e) {
    e.preventDefault(); active.clear();
    for (const t of e.touches) {
      const hits = [];
      for (const z of Z) {
        const r = z.r, m = 6;
        if (t.clientX >= r.left - m && t.clientX <= r.right + m && t.clientY >= r.top - m && t.clientY <= r.bottom + m) hits.push(z.raw);
      }
      if (hits.length) active.set(t.identifier, hits);
    }
    apply(); Audio2.unlock();
  }
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(ev => pad.addEventListener(ev, upd, { passive: false }));
  addEventListener('pointerdown', () => Audio2.unlock());
})();

function resize() {
  const pad = document.getElementById('pad');
  const padH = pad.style.display === 'flex' ? 150 : 26;
  const availW = innerWidth - 14, availH = innerHeight - padH - 16;
  let s = Math.min(availW / W, availH / H);
  if (s >= 1) s = Math.max(1, Math.floor(s * 2) / 2);
  cv.style.width = Math.floor(W * s) + 'px';
  cv.style.height = Math.floor(H * s) + 'px';
}
addEventListener('resize', resize); addEventListener('orientationchange', () => setTimeout(resize, 120));

const rnd = n => Math.floor(Math.random() * n);
const chance = p => Math.random() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

const SAVEKEY = 'nosaleelsol_avellaneda_2026';
function saveGame(d) { try { localStorage.setItem(SAVEKEY, JSON.stringify(d)); return true; } catch (e) { return false; } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVEKEY) || 'null'); } catch (e) { return null; } }

// ============================================================
//  AUDIO
// ============================================================
const Audio2 = (function () {
  let ac = null, master = null, on = true, timer = null, cur = null, step = 0, nextT = 0;
  const N = {};
  (function () {
    const nm = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let o = 1; o <= 7; o++) for (let i = 0; i < 12; i++)
      N[nm[i] + o] = 440 * Math.pow(2, (i - 9 + (o - 4) * 12) / 12);
  })();
  const _ = null;
  const SONGS = {
    // caminar de noche: lento, feo, hermoso
    noche: {
      bpm: 92,
      lead: ['A4', _, _, _, 'C5', _, _, _, 'B4', _, _, _, 'E4', _, _, _,
             'A4', _, _, _, 'D5', _, _, _, 'C5', _, _, _, 'A4', _, _, _,
             'F4', _, _, _, 'A4', _, _, _, 'G4', _, _, _, 'D4', _, _, _,
             'E4', _, _, 'F4', 'E4', _, _, _, 'D4', _, _, _, _, _, _, _],
      bass: ['A2', _, _, _, _, _, 'A2', _, 'E2', _, _, _, _, _, _, _,
             'F2', _, _, _, _, _, 'F2', _, 'C3', _, _, _, _, _, _, _,
             'D2', _, _, _, _, _, 'D2', _, 'A2', _, _, _, _, _, _, _,
             'E2', _, _, _, _, _, 'E2', _, 'E2', _, _, _, _, _, _, _],
      perc: [1, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 0, 0, 2, 0]
    },
    // el auto andando
    auto: {
      bpm: 118,
      lead: ['E4', _, 'G4', _, 'A4', _, 'G4', _, 'E4', _, 'D4', _, 'E4', _, _, _,
             'C4', _, 'E4', _, 'G4', _, 'E4', _, 'D4', _, 'B3', _, 'C4', _, _, _],
      bass: ['A2', _, 'A2', _, 'E2', _, 'E2', _, 'A2', _, 'A2', _, 'E2', _, 'E2', _,
             'F2', _, 'F2', _, 'C3', _, 'C3', _, 'G2', _, 'G2', _, 'D2', _, 'D2', _],
      perc: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2]
    },
    // duelo de berretines
    duelo: {
      bpm: 150,
      lead: ['A4', 'A4', 'C5', _, 'A4', _, 'E5', _, 'D5', _, 'C5', _, 'B4', _, _, _,
             'G4', 'G4', 'B4', _, 'G4', _, 'D5', _, 'C5', _, 'B4', _, 'A4', _, _, _],
      bass: ['A2', 'A2', _, 'A2', 'E2', _, 'E2', _, 'A2', 'A2', _, 'A2', 'E2', _, 'E2', _,
             'G2', 'G2', _, 'G2', 'D2', _, 'D2', _, 'G2', 'G2', _, 'G2', 'D2', _, 'D2', _],
      perc: [1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 2, 2]
    },
    // la quinta, 2010, con sol
    verano: {
      bpm: 126,
      lead: ['G4', _, 'B4', _, 'D5', _, 'B4', _, 'C5', _, 'E5', _, 'D5', _, _, _,
             'A4', _, 'C5', _, 'E5', _, 'C5', _, 'D5', _, 'B4', _, 'G4', _, _, _],
      bass: ['G2', _, _, 'G2', _, 'D3', _, _, 'C3', _, _, 'C3', _, 'G2', _, _,
             'A2', _, _, 'A2', _, 'E3', _, _, 'D3', _, _, 'D3', _, 'A2', _, _],
      perc: [1, 0, 2, 0, 1, 0, 2, 2, 1, 0, 2, 0, 1, 0, 2, 2]
    }
  };
  function init() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    ac = new AC(); master = ac.createGain(); master.gain.value = 0.15; master.connect(ac.destination);
  }
  function tone(type, freq, t, dur, vol) {
    if (!freq) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(t, dur, vol) {
    const n = ac.sampleRate * dur | 0;
    const buf = ac.createBuffer(1, Math.max(1, n), ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const s = ac.createBufferSource(); s.buffer = buf;
    const g = ac.createGain(); g.gain.value = vol;
    s.connect(g); g.connect(master); s.start(t);
  }
  function tick() {
    if (!ac || !cur || !on) return;
    const song = SONGS[cur], spb = 60 / song.bpm / 2;
    while (nextT < ac.currentTime + 0.25) {
      const i = step % song.lead.length;
      tone('square', N[song.lead[i]], nextT, spb * 1.7, 0.22);
      tone('triangle', N[song.bass[i % song.bass.length]], nextT, spb * 2, 0.5);
      const p = song.perc[i % song.perc.length];
      if (p === 1) noise(nextT, 0.05, 0.2);
      if (p === 2) noise(nextT, 0.03, 0.1);
      nextT += spb; step++;
    }
  }
  return {
    unlock() { init(); if (ac && ac.state === 'suspended') ac.resume(); },
    play(name) {
      if (cur === name) return;
      this.unlock(); if (!ac) return;
      cur = name; step = 0; nextT = ac.currentTime + 0.05;
      if (!timer) timer = setInterval(tick, 60);
    },
    stop() { cur = null; },
    toggle() { on = !on; this.unlock(); if (master) master.gain.value = on ? 0.15 : 0; },
    sfx(kind) {
      this.unlock(); if (!ac || !on) return;
      const t = ac.currentTime;
      if (kind === 'bip') tone('square', 760, t, 0.04, 0.18);
      else if (kind === 'sel') { tone('square', 620, t, 0.04, 0.2); tone('square', 950, t + 0.05, 0.06, 0.18); }
      else if (kind === 'pista') { [660, 880, 1100].forEach((f, i) => tone('square', f, t + i * 0.08, 0.14, 0.22)); }
      else if (kind === 'golpe') { noise(t, 0.09, 0.32); tone('square', 150, t, 0.1, 0.26); }
      else if (kind === 'mal') { [500, 380, 280].forEach((f, i) => tone('sawtooth', f, t + i * 0.07, 0.1, 0.2)); }
      else if (kind === 'gano') { [523, 659, 784, 1046].forEach((f, i) => tone('square', f, t + i * 0.09, 0.16, 0.22)); }
      else if (kind === 'motor') { noise(t, 0.5, 0.12); tone('sawtooth', 70, t, 0.5, 0.18); }
      else if (kind === 'plata') { tone('square', 1100, t, 0.05, 0.18); tone('square', 1500, t + 0.06, 0.07, 0.16); }
      else if (kind === 'reloj') tone('square', 400, t, 0.03, 0.14);
    }
  };
})();
refrescarUI();
