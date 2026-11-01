/**
 * storage.js — User-Isolated LocalStorage Persistence
 * Automatically separates progress, stars, and level numbers for each Google account / user.
 */

const BASE_KEYS = {
  PROGRESS:      'arrow_puzzle_progress',
  CURRENT_LEVEL: 'arrow_puzzle_current_level',
  SOUND_ENABLED: 'arrow_puzzle_sound',
  ACTIVE_USER:   'arrow_puzzle_user',
};

function getActiveUserKey() {
  try {
    const user = JSON.parse(localStorage.getItem(BASE_KEYS.ACTIVE_USER));
    return user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';
  } catch {
    return 'guest';
  }
}

/** Save completed level data for current user */
export function saveLevelProgress(levelId, moves, stars, userEmail = null) {
  const uKey = userEmail ? userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : getActiveUserKey();
  const key = `${BASE_KEYS.PROGRESS}_${uKey}`;
  const existing = loadAllProgress(userEmail);
  existing[levelId] = { moves, stars, completedAt: Date.now() };
  localStorage.setItem(key, JSON.stringify(existing));
}

/** Load all completed level data for current user */
export function loadAllProgress(userEmail = null) {
  const uKey = userEmail ? userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : getActiveUserKey();
  const key = `${BASE_KEYS.PROGRESS}_${uKey}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

/** Get progress for a specific level */
export function getLevelProgress(levelId, userEmail = null) {
  const all = loadAllProgress(userEmail);
  return all[levelId] || null;
}

/** Save currently active level index for current user */
export function saveCurrentLevel(levelId, userEmail = null) {
  const uKey = userEmail ? userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : getActiveUserKey();
  const key = `${BASE_KEYS.CURRENT_LEVEL}_${uKey}`;
  localStorage.setItem(key, String(levelId));
}

/** Load last played level index for current user (defaults to 1 if new player) */
export function loadCurrentLevel(userEmail = null) {
  const uKey = userEmail ? userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_') : getActiveUserKey();
  const key = `${BASE_KEYS.CURRENT_LEVEL}_${uKey}`;
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : 1;
}

/** Toggle sound preference */
export function saveSoundEnabled(enabled) {
  localStorage.setItem(BASE_KEYS.SOUND_ENABLED, JSON.stringify(enabled));
}

/** Load sound preference (defaults to true) */
export function loadSoundEnabled() {
  const val = localStorage.getItem(BASE_KEYS.SOUND_ENABLED);
  return val === null ? true : JSON.parse(val);
}
