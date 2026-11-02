/**
 * storage.js — User-Isolated LocalStorage Persistence
 * Automatically separates progress, stars, settings, themes, and achievements per user profile.
 */

const BASE_KEYS = {
  PROGRESS:      'arrow_puzzle_progress',
  CURRENT_LEVEL: 'arrow_puzzle_current_level',
  SOUND_ENABLED: 'arrow_puzzle_sound',
  BGM_ENABLED:   'arrow_puzzle_bgm',
  ACTIVE_USER:   'arrow_puzzle_user',
  THEME:         'arrow_puzzle_theme',
  REDUCED_MOTION:'arrow_puzzle_reduced_motion',
  ACHIEVEMENTS:  'arrow_puzzle_achievements',
  STREAK:        'arrow_puzzle_streak',
  BEST_TIMES:    'arrow_puzzle_best_times',
  STATS:         'arrow_puzzle_stats',
};

function getActiveUserKey(userEmail = null) {
  if (userEmail) {
    return userEmail.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  try {
    const user = JSON.parse(localStorage.getItem(BASE_KEYS.ACTIVE_USER));
    return user?.email ? user.email.toLowerCase().replace(/[^a-z0-9]/g, '_') : 'guest';
  } catch {
    return 'guest';
  }
}

/** Save completed level data with moves, stars, and time */
export function saveLevelProgress(levelId, moves, stars, timeSecs = 0, userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.PROGRESS}_${uKey}`;
  const existing = loadAllProgress(userEmail);
  
  const prevRecord = existing[levelId];
  const bestTime = prevRecord?.bestTime
    ? Math.min(prevRecord.bestTime, timeSecs)
    : timeSecs;

  existing[levelId] = {
    moves,
    stars,
    bestTime,
    completedAt: Date.now(),
  };

  localStorage.setItem(key, JSON.stringify(existing));

  // Update best times cache
  saveBestTime(levelId, bestTime, userEmail);
}

/** Load all completed level records */
export function loadAllProgress(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.PROGRESS}_${uKey}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

/** Save Best Time for Level */
export function saveBestTime(levelId, timeSecs, userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.BEST_TIMES}_${uKey}`;
  try {
    const times = JSON.parse(localStorage.getItem(key)) || {};
    if (!times[levelId] || timeSecs < times[levelId]) {
      times[levelId] = timeSecs;
      localStorage.setItem(key, JSON.stringify(times));
    }
  } catch {}
}

export function loadBestTimes(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.BEST_TIMES}_${uKey}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

/** Active Level */
export function saveCurrentLevel(levelId, userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.CURRENT_LEVEL}_${uKey}`;
  localStorage.setItem(key, String(levelId));
}

export function loadCurrentLevel(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.CURRENT_LEVEL}_${uKey}`;
  const val = localStorage.getItem(key);
  return val ? parseInt(val, 10) : 1;
}

/** Audio & Music Settings */
export function saveSoundEnabled(enabled) {
  localStorage.setItem(BASE_KEYS.SOUND_ENABLED, JSON.stringify(enabled));
}

export function loadSoundEnabled() {
  const val = localStorage.getItem(BASE_KEYS.SOUND_ENABLED);
  return val === null ? true : JSON.parse(val);
}

export function saveBgmEnabled(enabled) {
  localStorage.setItem(BASE_KEYS.BGM_ENABLED, JSON.stringify(enabled));
}

export function loadBgmEnabled() {
  const val = localStorage.getItem(BASE_KEYS.BGM_ENABLED);
  return val === null ? true : JSON.parse(val);
}

/** Theme Selection ('midnight' | 'neon' | 'ocean' | 'aurora') */
export function saveThemePreference(themeId) {
  localStorage.setItem(BASE_KEYS.THEME, themeId);
}

export function loadThemePreference() {
  return localStorage.getItem(BASE_KEYS.THEME) || 'midnight';
}

/** Reduced Motion */
export function saveReducedMotion(enabled) {
  localStorage.setItem(BASE_KEYS.REDUCED_MOTION, JSON.stringify(enabled));
}

export function loadReducedMotion() {
  const val = localStorage.getItem(BASE_KEYS.REDUCED_MOTION);
  return val === null ? false : JSON.parse(val);
}

/** Achievements */
export function saveAchievements(unlockedIds, userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.ACHIEVEMENTS}_${uKey}`;
  localStorage.setItem(key, JSON.stringify(unlockedIds));
}

export function loadAchievements(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.ACHIEVEMENTS}_${uKey}`;
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

/** Streak System */
export function loadStreak(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.STREAK}_${uKey}`;
  try {
    const data = JSON.parse(localStorage.getItem(key));
    if (!data) return { count: 0, lastDate: null };
    
    // Check if streak was broken (missed more than 1 day)
    const today = new Date().toISOString().slice(0, 10);
    const last = data.lastDate;
    if (!last) return { count: 0, lastDate: null };
    
    const diffDays = Math.floor((new Date(today) - new Date(last)) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
      // Streak broken
      return { count: 0, lastDate: null };
    }
    return data;
  } catch {
    return { count: 0, lastDate: null };
  }
}

export function recordDailyCompletion(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  const key = `${BASE_KEYS.STREAK}_${uKey}`;
  const today = new Date().toISOString().slice(0, 10);
  const current = loadStreak(userEmail);

  if (current.lastDate === today) {
    // Already recorded today
    return current;
  }

  const prevYesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = (current.lastDate === prevYesterday) ? current.count + 1 : 1;
  const updated = { count: newCount, lastDate: today };

  localStorage.setItem(key, JSON.stringify(updated));
  return updated;
}

/** Reset All User Data */
export function resetUserData(userEmail = null) {
  const uKey = getActiveUserKey(userEmail);
  localStorage.removeItem(`${BASE_KEYS.PROGRESS}_${uKey}`);
  localStorage.removeItem(`${BASE_KEYS.CURRENT_LEVEL}_${uKey}`);
  localStorage.removeItem(`${BASE_KEYS.ACHIEVEMENTS}_${uKey}`);
  localStorage.removeItem(`${BASE_KEYS.STREAK}_${uKey}`);
  localStorage.removeItem(`${BASE_KEYS.BEST_TIMES}_${uKey}`);
  localStorage.removeItem(`${BASE_KEYS.STATS}_${uKey}`);
}
