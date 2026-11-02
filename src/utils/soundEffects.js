/**
 * soundEffects.js — Pure Web Audio API Synthesizer with Zero External Assets
 * 
 * Features:
 * - Tap / Click feedback pip
 * - Smooth upward whoosh for arrow exit
 * - Low-frequency thud for blocked arrow
 * - 4-chord victory fanfare for level completion
 * - Triumphant achievement unlock fanfare
 * - Ambient generative cosmic chord BGM (soft, ethereal, loopable, 0 bytes external)
 */

let ctx = null;
let bgmOscillators = [];
let bgmGainNode = null;
let isBgmRunning = false;
let globalMasterVolume = 0.8;

/** Lazily initialize AudioContext on user gesture */
function getCtx() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      ctx = new AudioCtx();
    }
  }
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setMasterVolume(vol) {
  globalMasterVolume = Math.max(0, Math.min(1, vol));
  if (bgmGainNode && ctx) {
    bgmGainNode.gain.setValueAtTime(0.04 * globalMasterVolume, ctx.currentTime);
  }
}

/**
 * Play a synthesized tone
 */
function playTone(freq, endFreq, duration, type = 'sine', volume = 0.3, startTime = 0) {
  try {
    const ac = getCtx();
    if (!ac) return;

    const osc = ac.createOscillator();
    const gain = ac.createGain();

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.type = type;
    const now = ac.currentTime + startTime;
    osc.frequency.setValueAtTime(Math.max(20, freq), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), now + duration);

    const actualVol = volume * globalMasterVolume;
    gain.gain.setValueAtTime(actualVol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Ignore audio errors gracefully on un-interacted browsers
  }
}

/** Quick high-frequency pip when player taps a cell */
export function playClick() {
  playTone(850, 450, 0.04, 'sine', 0.2);
}

/** Smooth upward glide when arrow exits */
export function playExit() {
  playTone(320, 920, 0.2, 'sine', 0.28);
}

/** Low-frequency square thud when path is blocked */
export function playBlocked() {
  playTone(130, 55, 0.14, 'triangle', 0.35);
}

/** 4-chord arpeggio victory fanfare: C5, E5, G5, C6 */
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, freq * 1.02, 0.28, 'triangle', 0.22, i * 0.12);
  });
}

/** Golden achievement fanfare */
export function playAchievement() {
  const chord = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
  chord.forEach((f, i) => {
    playTone(f, f * 1.01, 0.45, 'sine', 0.25, i * 0.08);
  });
}

/**
 * Ambient Cosmic Background Music (Generative Synth Pad)
 * Uses soft detuned sine waves with gentle tremolo, running entirely in browser memory.
 */
export function startBGM() {
  if (isBgmRunning) return;
  try {
    const ac = getCtx();
    if (!ac) return;

    bgmGainNode = ac.createGain();
    bgmGainNode.gain.setValueAtTime(0.035 * globalMasterVolume, ac.currentTime);

    // Low pass filter for soft, warm ambient feel
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, ac.currentTime);

    bgmGainNode.connect(filter);
    filter.connect(ac.destination);

    // Ethereal chord frequencies (F maj7 / C chord tones: F3, A3, C4, E4)
    const baseFreqs = [174.61, 220.0, 261.63, 329.63];
    bgmOscillators = baseFreqs.map((freq, idx) => {
      const osc = ac.createOscillator();
      osc.type = 'sine';
      // Slight detuning for rich chorus effect
      osc.frequency.setValueAtTime(freq + (idx % 2 === 0 ? 0.35 : -0.35), ac.currentTime);
      osc.connect(bgmGainNode);
      osc.start();
      return osc;
    });

    isBgmRunning = true;
  } catch {
    // Audio context not ready yet
  }
}

export function stopBGM() {
  if (!isBgmRunning) return;
  try {
    bgmOscillators.forEach(osc => {
      try { osc.stop(); osc.disconnect(); } catch {}
    });
    bgmOscillators = [];
    if (bgmGainNode) {
      try { bgmGainNode.disconnect(); } catch {}
      bgmGainNode = null;
    }
  } catch {}
  isBgmRunning = false;
}

export function toggleBGM(enable) {
  if (enable) {
    startBGM();
  } else {
    stopBGM();
  }
}

export function isBGMActive() {
  return isBgmRunning;
}
