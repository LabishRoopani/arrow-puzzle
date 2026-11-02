/**
 * achievements.js — Game Achievements System
 * Evaluates performance criteria after moves/levels and triggers rewards.
 */

export const ACHIEVEMENTS = [
  {
    id: 'first_win',
    title: 'First Escape',
    description: 'Solve your very first puzzle successfully',
    icon: '🎯',
    xpReward: 100,
    check: ({ completedLevels }) => completedLevels >= 1,
  },
  {
    id: 'perfect_level',
    title: 'Flawless Strategy',
    description: 'Complete a level without any collision mistakes (3 hearts intact)',
    icon: '💎',
    xpReward: 200,
    check: ({ lastLevelHearts }) => lastLevelHearts === 3,
  },
  {
    id: 'speed_master',
    title: 'Speed Master',
    description: 'Solve a level in under 20 seconds',
    icon: '⚡',
    xpReward: 250,
    check: ({ lastLevelTime }) => lastLevelTime > 0 && lastLevelTime <= 20,
  },
  {
    id: 'streak_master',
    title: 'Dedication Streak',
    description: 'Maintain a consecutive 3-day puzzle solving streak',
    icon: '🔥',
    xpReward: 300,
    check: ({ streak }) => streak >= 3,
  },
  {
    id: 'expert_solver',
    title: 'Expert Tactician',
    description: 'Solve an Expert or Extreme tier puzzle',
    icon: '🧠',
    xpReward: 350,
    check: ({ lastLevelTier }) => lastLevelTier === 'Expert' || lastLevelTier === 'Extreme',
  },
  {
    id: 'century_club',
    title: '100 Levels Escaped',
    description: 'Reach or complete level 100 in the infinite campaign',
    icon: '👑',
    xpReward: 1000,
    check: ({ currentLevel, completedLevels }) => currentLevel >= 100 || completedLevels >= 100,
  },
];

export function checkNewAchievements(unlockedIds = [], context = {}) {
  const newUnlocks = [];
  for (const ach of ACHIEVEMENTS) {
    if (!unlockedIds.includes(ach.id)) {
      if (ach.check(context)) {
        newUnlocks.push(ach);
      }
    }
  }
  return newUnlocks;
}
