/**
 * soundEffects.js — Member 1: Web Audio API Synthesizer
 * Zero-asset synthetic sound effects using OscillatorNode & GainNode.
 *
 * Sounds:
 *  - playClick()     : Quick tap feedback pip
 *  - playExit()      : Smooth upward glide when arrow exits
 *  - playBlocked()   : Low thud when path is blocked
 *  - playWin()       : 4-chord victory arpeggio fanfare
 */

let ctx = null;

/** Lazily initialize AudioContext on first user gesture */
function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  return ctx;
}

/**
 * Internal helper: play a single oscillator note.
 * @param {number} freq      - Frequency in Hz
 * @param {number} endFreq   - End frequency (for glide), same as freq for constant tone
 * @param {number} duration  - Duration in seconds
 * @param {'sine'|'square'|'triangle'|'sawtooth'} type
 * @param {number} volume    - Peak gain (0–1)
 * @param {number} startTime - AudioContext time offset
 */
function playTone(freq, endFreq, duration, type = 'sine', volume = 0.3, startTime = 0) {
  const ac = getCtx();
  const osc  = ac.createOscillator();
  const gain = ac.createGain();

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ac.currentTime + startTime);
  osc.frequency.linearRampToValueAtTime(endFreq, ac.currentTime + startTime + duration);

  gain.gain.setValueAtTime(volume, ac.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + startTime + duration);

  osc.start(ac.currentTime + startTime);
  osc.stop(ac.currentTime + startTime + duration + 0.01);
}

/** Quick high-frequency pip when player taps a cell */
export function playClick() {
  playTone(800, 400, 0.04, 'sine', 0.2);
}

/** Smooth upward glide when arrow successfully exits the board */
export function playExit() {
  playTone(300, 850, 0.18, 'sine', 0.25);
}

/** Low-frequency square thud when path is blocked */
export function playBlocked() {
  playTone(120, 60, 0.12, 'square', 0.3);
}

/** 4-chord arpeggio victory fanfare: C5, E5, G5, C6 */
export function playWin() {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    playTone(freq, freq, 0.25, 'triangle', 0.25, i * 0.15);
  });
}
