// ============================================================
//  NUCLEO: pantalla, paleta, sprites, input, audio, guardado
// ============================================================
const W = 160, H = 144;
const cv = document.getElementById('screen');
const ctx = cv.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = false;

// paleta "conurbano 96"
const PAL = {
  '0': '#0f0f14', '1': '#24242f', '2': '#43435a', '3': '#6d6d88', '4': '#a8a8bd', '5': '#e6e6f0',
  '6': '#5c3a22', '7': '#8f5f33', '8': '#c39355', '9': '#2f6b34', 'a': '#4f9d43', 'b': '#8fc45a',
  'c': '#1f3f7a', 'd': '#3f7fc8', 'e': '#8fc8f0', 'f': '#a02020', 'g': '#d94b3a', 'h': '#f0a03c',
  'i': '#f0d858', 'j': '#e8b48c', 'k': '#c98a66', 'l': '#7a2a6a', 'm': '#c85a9a', 'n': '#2a2a1e',
  'o': '#585848', 'p': '#8a8a70', 'q': '#c8c8a8', 'r': '#3a3a48', 's': '#f5f5ff'
};

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

// ---- cuadro de dialogo estilo game boy ----
function panel(x, y, w, h) {
  rect(x, y, w, h, PAL['5']);
  rect(x, y, w, 1, PAL['0']); rect(x, y + h - 1, w, 1, PAL['0']);
  rect(x, y, 1, h, PAL['0']); rect(x + w - 1, y, 1, h, PAL['0']);
  rect(x + 2, y + 2, w - 4, 1, PAL['2']); rect(x + 2, y + h - 3, w - 4, 1, PAL['2']);
  rect(x + 2, y + 2, 1, h - 4, PAL['2']); rect(x + w - 3, y + 2, 1, h - 4, PAL['2']);
}

// ---- input ----
const K = { up: 0, dn: 0, lf: 0, rt: 0, a: 0, b: 0, st: 0 };
const KP = { up: 0, dn: 0, lf: 0, rt: 0, a: 0, b: 0, st: 0 };   // "recien apretado"
const MAPK = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'dn', KeyS: 'dn', ArrowLeft: 'lf', KeyA: 'lf',
  ArrowRight: 'rt', KeyD: 'rt', KeyZ: 'a', Space: 'a', KeyJ: 'a', KeyX: 'b', KeyK: 'b',
  Backspace: 'b', Enter: 'st', Escape: 'st'
};
function setKey(name, v) {
  if (!name) return;
  if (v && !K[name]) KP[name] = 1;
  K[name] = v;
}
addEventListener('keydown', e => {
  if (e.code === 'KeyM' && !e.repeat) { Audio2.toggle(); e.preventDefault(); return; }
  const n = MAPK[e.code]; if (n) { if (!e.repeat) setKey(n, 1); e.preventDefault(); }
});
addEventListener('keyup', e => { const n = MAPK[e.code]; if (n) { setKey(n, 0); e.preventDefault(); } });

function clearPressed() { for (const k in KP) KP[k] = 0; }

// ---- controles tactiles ----
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
    e.preventDefault();
    active.clear();
    for (const t of e.touches) {
      const hits = [];
      for (const z of Z) {
        const r = z.r, m = 6;
        if (t.clientX >= r.left - m && t.clientX <= r.right + m && t.clientY >= r.top - m && t.clientY <= r.bottom + m) hits.push(z.raw);
      }
      if (hits.length) active.set(t.identifier, hits);
    }
    apply();
    Audio2.unlock();
  }
  ['touchstart', 'touchmove', 'touchend', 'touchcancel'].forEach(ev => pad.addEventListener(ev, upd, { passive: false }));
  addEventListener('pointerdown', () => Audio2.unlock(), { once: false });
})();

// ---- escalado a pantalla ----
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

// ---- random ----
const rnd = n => Math.floor(Math.random() * n);
const chance = p => Math.random() < p;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;

// ---- guardado ----
const SAVEKEY = 'pokesan_avellaneda_96';
function saveGame(data) { try { localStorage.setItem(SAVEKEY, JSON.stringify(data)); return true; } catch (e) { return false; } }
function loadGame() { try { return JSON.parse(localStorage.getItem(SAVEKEY) || 'null'); } catch (e) { return null; } }
function eraseGame() { try { localStorage.removeItem(SAVEKEY); } catch (e) { } }

// ============================================================
//  AUDIO: chiptune casero (cumbia de bondi + batalla)
// ============================================================
const Audio2 = (function () {
  let ac = null, master = null, on = true, timer = null, cur = null, step = 0, nextT = 0;
  const N = {};
  (function notes() {
    const nm = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    for (let o = 1; o <= 7; o++) for (let i = 0; i < 12; i++)
      N[nm[i] + o] = 440 * Math.pow(2, (i - 9 + (o - 4) * 12) / 12);
  })();
  const _ = null;
  const SONGS = {
    barrio: {
      bpm: 132,
      lead: ['E5', _, 'G5', _, 'A5', _, 'G5', _, 'E5', _, 'D5', _, 'E5', _, _, _,
             'C5', _, 'E5', _, 'G5', _, 'E5', _, 'D5', _, 'B4', _, 'C5', _, _, _,
             'A4', _, 'C5', _, 'E5', _, 'C5', _, 'B4', _, 'D5', _, 'B4', _, _, _,
             'G4', _, 'B4', _, 'D5', _, 'B4', _, 'A4', _, 'B4', _, 'C5', _, _, _],
      bass: ['A2', _, _, 'A2', _, 'E2', _, _, 'A2', _, _, 'A2', _, 'E2', _, _,
             'C3', _, _, 'C3', _, 'G2', _, _, 'G2', _, _, 'G2', _, 'D2', _, _,
             'A2', _, _, 'A2', _, 'E2', _, _, 'F2', _, _, 'F2', _, 'C3', _, _,
             'G2', _, _, 'G2', _, 'D3', _, _, 'C3', _, _, 'C3', _, 'E2', _, _],
      perc: [1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 2]
    },
    batalla: {
      bpm: 168,
      lead: ['A4', 'A4', 'C5', 'E5', 'A5', _, 'G5', 'E5', 'F5', _, 'E5', 'D5', 'C5', _, _, _,
             'G4', 'G4', 'B4', 'D5', 'G5', _, 'F5', 'D5', 'E5', _, 'D5', 'C5', 'B4', _, _, _,
             'F4', 'F4', 'A4', 'C5', 'F5', _, 'E5', 'C5', 'D5', _, 'C5', 'B4', 'A4', _, _, _,
             'E5', _, 'E5', _, 'F5', _, 'G5', _, 'A5', _, 'G5', 'F5', 'E5', _, _, _],
      bass: ['A2', 'A2', _, 'A2', 'A2', _, 'A2', _, 'A2', 'A2', _, 'A2', 'E2', _, 'E2', _,
             'G2', 'G2', _, 'G2', 'G2', _, 'G2', _, 'G2', 'G2', _, 'G2', 'D2', _, 'D2', _,
             'F2', 'F2', _, 'F2', 'F2', _, 'F2', _, 'F2', 'F2', _, 'F2', 'C3', _, 'C3', _,
             'E2', 'E2', _, 'E2', 'E2', _, 'E2', _, 'A2', 'A2', _, 'A2', 'E2', _, 'E2', _],
      perc: [1, 0, 1, 0, 2, 0, 1, 0, 1, 0, 1, 0, 2, 0, 2, 2]
    },
    victoria: {
      bpm: 150, once: true,
      lead: ['C5', 'E5', 'G5', 'C6', _, 'G5', 'C6', _, _, _, _, _, _, _, _, _],
      bass: ['C3', _, 'C3', _, 'G2', _, 'C3', _, _, _, _, _, _, _, _, _],
      perc: [1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
  };

  function init() {
    if (ac) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = 0.16; master.connect(ac.destination);
  }
  function tone(type, freq, t, dur, vol) {
    if (!freq) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
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
      tone('square', N[song.lead[i]], nextT, spb * 1.6, 0.30);
      tone('triangle', N[song.bass[i % song.bass.length]], nextT, spb * 1.9, 0.55);
      const p = song.perc[i % song.perc.length];
      if (p === 1) noise(nextT, 0.05, 0.28);
      if (p === 2) noise(nextT, 0.03, 0.13);
      nextT += spb; step++;
      if (song.once && step >= song.lead.length) { cur = null; break; }
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
    toggle() {
      on = !on;
      this.unlock();
      if (master) master.gain.value = on ? 0.16 : 0;
    },
    isOn() { return on; },
    sfx(kind) {
      this.unlock(); if (!ac || !on) return;
      const t = ac.currentTime;
      if (kind === 'bip') tone('square', 900, t, 0.05, 0.25);
      else if (kind === 'sel') { tone('square', 700, t, 0.04, 0.25); tone('square', 1100, t + 0.05, 0.06, 0.22); }
      else if (kind === 'golpe') { noise(t, 0.09, 0.4); tone('square', 160, t, 0.1, 0.3); }
      else if (kind === 'flojo') { noise(t, 0.06, 0.2); tone('square', 110, t, 0.08, 0.2); }
      else if (kind === 'fuerte') { noise(t, 0.16, 0.5); tone('sawtooth', 90, t, 0.18, 0.35); }
      else if (kind === 'chapita') { tone('square', 500, t, 0.06, 0.25); tone('square', 800, t + 0.07, 0.08, 0.25); }
      else if (kind === 'capturado') { [660, 830, 990, 1320].forEach((f, i) => tone('square', f, t + i * 0.09, 0.12, 0.25)); }
      else if (kind === 'escapo') { [900, 700, 500].forEach((f, i) => tone('square', f, t + i * 0.06, 0.08, 0.22)); }
      else if (kind === 'medalla') { [523, 659, 784, 1046, 1318].forEach((f, i) => tone('square', f, t + i * 0.11, 0.2, 0.26)); }
      else if (kind === 'curar') { [440, 554, 659].forEach((f, i) => tone('triangle', f, t + i * 0.1, 0.18, 0.4)); }
      else if (kind === 'plata') { tone('square', 1200, t, 0.05, 0.22); tone('square', 1600, t + 0.06, 0.07, 0.2); }
    }
  };
})();
