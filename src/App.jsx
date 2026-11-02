/**
 * App.jsx — Master Controller for Arrow Puzzle Premium Edition
 * 
 * Features:
 * - Theme Engine (Midnight, Neon, Ocean, Aurora)
 * - Achievements System with Animated Toasts & Gallery
 * - Daily Challenge with Streak Tracking
 * - Ambient Generative Background Music & Audio Synthesizer
 * - Non-Intersecting Snake Puzzle Engine with 100% Solvability Guarantee
 * - Replayable Seeded Campaign Levels (1–20) & Infinite Endless Mode
 * - Multi-User Profile Isolation & Cloud Sync Simulation
 * - Pause Menu, Safe Progress Reset, & Accessibility Settings
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

// Engine
import {
  generateSnakeLevel,
  getRuleBasedHint,
} from './engine/snakeEngine.js';

// Sound & Music
import {
  playExit,
  playBlocked,
  playWin,
  playAchievement,
  toggleBGM,
} from './utils/soundEffects.js';

// Storage & Persistence
import {
  saveLevelProgress,
  saveCurrentLevel,
  loadCurrentLevel,
  loadAllProgress,
  loadSoundEnabled,
  saveSoundEnabled,
  loadBgmEnabled,
  saveBgmEnabled,
  loadThemePreference,
  saveThemePreference,
  loadReducedMotion,
  saveReducedMotion,
  loadAchievements,
  saveAchievements,
  loadStreak,
  recordDailyCompletion,
  resetUserData,
} from './utils/storage.js';

// Theme & Achievements
import { getTheme } from './utils/theme.js';
import { checkNewAchievements } from './utils/achievements.js';

// Components
import LoadingScreen        from './components/LoadingScreen.jsx';
import GoogleAuthModal      from './components/GoogleAuthModal.jsx';
import HomeScreen           from './components/HomeScreen.jsx';
import SnakeBoard           from './components/SnakeBoard.jsx';
import WinModal             from './components/WinModal.jsx';
import RewardAdModal        from './components/RewardAdModal.jsx';
import GameOverModal        from './components/GameOverModal.jsx';
import SettingsModal        from './components/SettingsModal.jsx';
import PauseModal           from './components/PauseModal.jsx';
import LevelModal           from './components/LevelModal.jsx';
import AchievementsModal    from './components/AchievementsModal.jsx';
import DailyChallengeModal  from './components/DailyChallengeModal.jsx';
import ConfirmModal         from './components/ConfirmModal.jsx';
import AchievementToast     from './components/AchievementToast.jsx';

const TIERS = ['Easy', 'Medium', 'Hard', 'Expert'];

function getTierForLevel(levelNum) {
  return TIERS[(levelNum - 1) % 4];
}

const USER_STORAGE_KEY = 'arrow_puzzle_user';

export default function App() {
  // ── Active User Profile ──
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const currentUserEmail = userProfile?.email || 'guest';

  // ── Modals & Screens ──
  const [showGoogleAuth, setShowGoogleAuth] = useState(() => !localStorage.getItem(USER_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading Arrow Puzzle...');
  const [screen, setScreen] = useState('home'); // 'home' | 'play'

  // ── Level Progression ──
  const [levelNumber, setLevelNumber] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    const u = saved ? JSON.parse(saved) : null;
    const userEmail = u?.email || 'guest';
    const savedLvl = loadCurrentLevel(userEmail);
    return savedLvl && Number(savedLvl) > 0 ? Number(savedLvl) : 1;
  });

  const [isDailyActive, setIsDailyActive] = useState(false);
  const currentTier = isDailyActive ? 'Hard' : getTierForLevel(levelNumber);

  // ── Gameplay Puzzle State ──
  const [levelData, setLevelData] = useState(() => generateSnakeLevel(getTierForLevel(1), 1 * 1337 + 42));
  const initialArrowsRef = useRef(levelData.arrows);

  const [hearts, setHearts] = useState(3);
  const [moveCount, setMoveCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintArrowId, setHintArrowId] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isNewBestTime, setIsNewBestTime] = useState(false);

  // ── Preferences & Customization ──
  const [soundEnabled, setSoundEnabled] = useState(() => loadSoundEnabled());
  const [bgmEnabled, setBgmEnabled] = useState(() => loadBgmEnabled());
  const [currentTheme, setCurrentTheme] = useState(() => loadThemePreference());
  const [reducedMotion, setReducedMotion] = useState(() => loadReducedMotion());

  // ── Achievements & Streak ──
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => loadAchievements(currentUserEmail));
  const [activeToast, setActiveToast] = useState(null);
  const [streakData, setStreakData] = useState(() => loadStreak(currentUserEmail));

  // ── Modal Visibility States ──
  const [showWin, setShowWin] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ── Listen for PWA Install Prompt Event ──
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.installPromptEvent = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // ── Ambient Music Controller ──
  useEffect(() => {
    if (bgmEnabled && screen === 'play' && !showPause && !showGameOver && !showWin && !isLoading) {
      toggleBGM(true);
    } else {
      toggleBGM(false);
    }
  }, [bgmEnabled, screen, showPause, showGameOver, showWin, isLoading]);

  // ── Gameplay Timer Tick ──
  useEffect(() => {
    if (screen !== 'play' || showPause || showWin || showGameOver || isLoading) return;
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, showPause, showWin, showGameOver, isLoading]);

  // ── Achievement Toast Auto-Dismiss ──
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  // ── Trigger Achievement Check ──
  const evaluateAchievements = useCallback((context) => {
    const newUnlocks = checkNewAchievements(unlockedAchievements, context);
    if (newUnlocks.length > 0) {
      const updated = [...unlockedAchievements, ...newUnlocks.map(a => a.id)];
      setUnlockedAchievements(updated);
      saveAchievements(updated, currentUserEmail);
      playAchievement();
      setActiveToast(newUnlocks[0]);
    }
  }, [unlockedAchievements, currentUserEmail]);

  // ── Initialize Puzzle ──
  const loadPuzzle = useCallback((lvlNum, isDaily = false) => {
    const tier = isDaily ? 'Hard' : getTierForLevel(lvlNum);
    // Seed levels 1-20 for replayable consistency; endless/daily use dynamic seeds
    const seed = isDaily
      ? new Date().toISOString().slice(0, 10).split('-').reduce((acc, c) => acc * 31 + Number(c), 7)
      : lvlNum <= 20
        ? lvlNum * 1337 + 42
        : null;

    const newLvl = generateSnakeLevel(tier, seed);
    setLevelData(newLvl);
    initialArrowsRef.current = newLvl.arrows;
    setHearts(3);
    setMoveCount(0);
    setHintsUsed(0);
    setHintArrowId(null);
    setMoveHistory([]);
    setElapsedSeconds(0);
    setIsNewBestTime(false);
    setShowWin(false);
    setShowGameOver(false);
    setShowPause(false);

    if (!isDaily) {
      saveCurrentLevel(lvlNum, currentUserEmail);
    }
  }, [currentUserEmail]);

  // When levelNumber changes in campaign mode, load puzzle
  useEffect(() => {
    if (!isDailyActive) {
      loadPuzzle(levelNumber, false);
    }
  }, [levelNumber, isDailyActive, loadPuzzle]);

  // ── Arrow Exit Handler ──
  const handleArrowCleared = (arrowId) => {
    if (soundEnabled) playExit();

    const clearedArrow = levelData.arrows.find(a => a.id === arrowId);
    if (clearedArrow) {
      setMoveHistory(prev => [...prev, { clearedArrow, hearts, moveCount }]);
    }

    const remaining = levelData.arrows.filter(a => a.id !== arrowId);
    setLevelData(prev => ({ ...prev, arrows: remaining }));
    setMoveCount(m => m + 1);

    // WIN CONDITION: All arrows cleared!
    if (remaining.length === 0) {
      if (soundEnabled) playWin();
      if (!reducedMotion) {
        confetti({ particleCount: 170, spread: 85, origin: { y: 0.6 } });
      }

      const calculatedStars = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;
      const finalMoves = moveCount + 1;
      const finalSeconds = elapsedSeconds;

      const progressData = loadAllProgress(currentUserEmail);
      const prevRecord = progressData[levelNumber];
      const isRecord = !prevRecord?.bestTime || finalSeconds < prevRecord.bestTime;
      setIsNewBestTime(isRecord);

      if (!isDailyActive) {
        saveLevelProgress(levelNumber, finalMoves, calculatedStars, finalSeconds, currentUserEmail);
        saveCurrentLevel(levelNumber + 1, currentUserEmail);
      } else {
        const updatedStreak = recordDailyCompletion(currentUserEmail);
        setStreakData(updatedStreak);
      }

      // Check achievements
      const allProg = loadAllProgress(currentUserEmail);
      evaluateAchievements({
        completedLevels: Object.keys(allProg).length,
        currentLevel: levelNumber,
        lastLevelHearts: hearts,
        lastLevelTime: finalSeconds,
        lastLevelTier: currentTier,
        streak: streakData.count,
      });

      setTimeout(() => setShowWin(true), 400);
    }
  };

  // ── Arrow Collision Handler ──
  const handleArrowBlocked = () => {
    if (soundEnabled) playBlocked();

    setHearts(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setShowGameOver(true), 500);
      }
      return Math.max(0, next);
    });
  };

  // ── Undo Move ──
  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    const last = moveHistory[moveHistory.length - 1];
    setMoveHistory(prev => prev.slice(0, -1));
    setLevelData(prev => ({
      ...prev,
      arrows: [...prev.arrows, last.clearedArrow],
    }));
    setMoveCount(m => Math.max(0, m - 1));
  };

  // ── Rule-Based Hint System ──
  const triggerHintDisplay = () => {
    const hint = getRuleBasedHint(levelData.arrows, levelData.width, levelData.height);
    if (hint) {
      setHintArrowId(hint.id);
      setTimeout(() => setHintArrowId(null), 3200);
    }
  };

  const handleHintClick = () => {
    if (hintsUsed >= 3) return;

    if (hintsUsed === 0) {
      triggerHintDisplay();
      setHintsUsed(1);
    } else {
      setShowAdModal(true);
    }
  };

  const handleClaimHintReward = () => {
    triggerHintDisplay();
    setHintsUsed(prev => prev + 1);
  };

  // Revive with Ad (+3 Hearts)
  const handleReviveWithAd = () => {
    setShowGameOver(false);
    setShowAdModal(true);
    window._pendingRevive = true;
  };

  const onAdRewardFinished = () => {
    if (window._pendingRevive) {
      window._pendingRevive = false;
      setHearts(3);
    } else {
      handleClaimHintReward();
    }
  };

  // ── Start / Continue Level ──
  const handleStartOrContinue = (lvlNum) => {
    setIsDailyActive(false);
    setLoadingMessage(`Loading Level ${lvlNum}...`);
    setIsLoading(true);
    setTimeout(() => {
      setLevelNumber(lvlNum);
      setScreen('play');
      setIsLoading(false);
    }, 400);
  };

  // ── Start Endless Mode ──
  const handleStartEndlessMode = () => {
    setIsDailyActive(false);
    setLoadingMessage('Generating Endless Mode...');
    setIsLoading(true);
    setTimeout(() => {
      const endlessLevel = generateSnakeLevel('Hard', null);
      setLevelData(endlessLevel);
      initialArrowsRef.current = endlessLevel.arrows;
      setHearts(3);
      setMoveCount(0);
      setHintsUsed(0);
      setHintArrowId(null);
      setMoveHistory([]);
      setElapsedSeconds(0);
      setScreen('play');
      setIsLoading(false);
    }, 450);
  };

  // ── Start Daily Challenge ──
  const handleStartDailyChallenge = () => {
    setIsDailyActive(true);
    setLoadingMessage("Loading Today's Challenge...");
    setIsLoading(true);
    setTimeout(() => {
      loadPuzzle(levelNumber, true);
      setScreen('play');
      setIsLoading(false);
    }, 450);
  };

  // ── Restart Current Puzzle ──
  const handleRestartLevel = () => {
    setLevelData(prev => ({ ...prev, arrows: [...initialArrowsRef.current] }));
    setHearts(3);
    setMoveCount(0);
    setHintsUsed(0);
    setHintArrowId(null);
    setMoveHistory([]);
    setElapsedSeconds(0);
    setShowGameOver(false);
    setShowWin(false);
  };

  // ── Next Level Progression ──
  const handleNextLevel = () => {
    setShowWin(false);
    if (isDailyActive) {
      setScreen('home');
    } else {
      setLevelNumber(prev => prev + 1);
    }
  };

  // ── Theme Selector ──
  const handleSelectTheme = (themeId) => {
    setCurrentTheme(themeId);
    saveThemePreference(themeId);
  };

  // ── Settings Toggles ──
  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      saveSoundEnabled(!prev);
      return !prev;
    });
  };

  const handleToggleBgm = () => {
    setBgmEnabled(prev => {
      saveBgmEnabled(!prev);
      return !prev;
    });
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion(prev => {
      saveReducedMotion(!prev);
      return !prev;
    });
  };

  // ── Reset All Progress ──
  const handleConfirmReset = () => {
    resetUserData(currentUserEmail);
    setLevelNumber(1);
    setUnlockedAchievements([]);
    setStreakData({ count: 0, lastDate: null });
    loadPuzzle(1, false);
    setShowResetConfirm(false);
    setShowSettings(false);
    setScreen('home');
  };

  // ── Google Account Login / Switch ──
  const handleGoogleLoginSuccess = (profile) => {
    setUserProfile(profile);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setShowGoogleAuth(false);

    setLoadingMessage(`Signing in as ${profile.name}...`);
    setIsLoading(true);

    const userLvl = loadCurrentLevel(profile.email);
    const userAch = loadAchievements(profile.email);
    const userStreak = loadStreak(profile.email);

    setTimeout(() => {
      setLevelNumber(userLvl);
      setUnlockedAchievements(userAch);
      setStreakData(userStreak);
      setIsLoading(false);
    }, 900);
  };

  const handleContinueAsGuest = () => {
    const guestUser = { name: 'Guest Player', email: 'guest', isLoggedIn: false };
    setUserProfile(guestUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    setShowGoogleAuth(false);

    setLoadingMessage('Loading Guest profile...');
    setIsLoading(true);

    const guestLvl = loadCurrentLevel('guest');
    setTimeout(() => {
      setLevelNumber(guestLvl);
      setIsLoading(false);
    }, 700);
  };

  const handleLogout = () => {
    setShowGoogleAuth(true);
  };

  // ── Splash Loading Screen ──
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  const userProgress = loadAllProgress(currentUserEmail);
  const maxUnlocked = Math.max(levelNumber, Object.keys(userProgress).length + 1);
  const todayStr = new Date().toISOString().slice(0, 10);
  const isCompletedToday = streakData.lastDate === todayStr;

  return (
    <div className="min-h-dvh bg-[#080c18] flex items-center justify-center">
      
      {/* ── Screen: Home Screen Dashboard ── */}
      {screen === 'home' && (
        <HomeScreen
          currentLevelNumber={levelNumber}
          isNewPlayer={Object.keys(userProgress).length === 0 && levelNumber <= 1}
          userProfile={userProfile}
          progress={userProgress}
          onContinueGame={handleStartOrContinue}
          onStartNewGame={handleStartOrContinue}
          onOpenLevelSelect={() => setShowLevelModal(true)}
          onStartEndlessMode={handleStartEndlessMode}
          onRestartGame={() => {
            handleRestartLevel();
            setScreen('play');
          }}
          onOpenGoogleAuth={() => setShowGoogleAuth(true)}
          onLogout={handleLogout}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenSettings={() => setShowSettings(true)}
          onOpenAchievements={() => setShowAchievementsModal(true)}
          onOpenDailyChallenge={() => setShowDailyModal(true)}
          streak={streakData.count}
          currentTheme={currentTheme}
          onSelectTheme={handleSelectTheme}
        />
      )}

      {/* ── Screen: Play Screen ── */}
      {screen === 'play' && (
        <SnakeBoard
          levelNumber={isDailyActive ? 'Daily' : levelNumber}
          tier={currentTier}
          levelData={levelData}
          onBackToHome={() => {
            setIsDailyActive(false);
            setScreen('home');
          }}
          onArrowCleared={handleArrowCleared}
          onArrowBlocked={handleArrowBlocked}
          hearts={hearts}
          hintsUsed={hintsUsed}
          onHintClick={handleHintClick}
          hintArrowId={hintArrowId}
          onOpenSettings={() => setShowSettings(true)}
          onOpenPause={() => setShowPause(true)}
          moveCount={moveCount}
          elapsedSeconds={elapsedSeconds}
          onUndo={handleUndo}
          canUndo={moveHistory.length > 0}
          onReset={handleRestartLevel}
          currentTheme={currentTheme}
          reducedMotion={reducedMotion}
        />
      )}

      {/* ── Achievement Banner Notification ── */}
      <AchievementToast
        achievement={activeToast}
        onDismiss={() => setActiveToast(null)}
      />

      {/* ── Achievements Gallery Modal ── */}
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        unlockedIds={unlockedAchievements}
      />

      {/* ── Daily Challenge Modal ── */}
      <DailyChallengeModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
        onPlayDaily={handleStartDailyChallenge}
        streak={streakData.count}
        isCompletedToday={isCompletedToday}
      />

      {/* ── Level Selection Modal ── */}
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        onSelectLevel={(num) => {
          setShowLevelModal(false);
          handleStartOrContinue(num);
        }}
        currentLevelNumber={levelNumber}
        maxUnlockedLevel={maxUnlocked}
        progress={userProgress}
      />

      {/* ── Pause Menu Modal ── */}
      <PauseModal
        isOpen={showPause}
        levelNumber={isDailyActive ? 'Daily' : levelNumber}
        tier={currentTier}
        moveCount={moveCount}
        elapsedSeconds={elapsedSeconds}
        onResume={() => setShowPause(false)}
        onRestart={() => {
          setShowPause(false);
          handleRestartLevel();
        }}
        onExitToHome={() => {
          setShowPause(false);
          setIsDailyActive(false);
          setScreen('home');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* ── Victory Win Celebration Modal ── */}
      <WinModal
        isOpen={showWin}
        moveCount={moveCount}
        elapsedSeconds={elapsedSeconds}
        levelName={isDailyActive ? "Today's Daily Challenge" : `Level ${levelNumber} (${currentTier})`}
        stars={hearts === 3 ? 3 : hearts === 2 ? 2 : 1}
        isNewBestTime={isNewBestTime}
        xpEarned={isDailyActive ? 300 : hearts === 3 ? 200 : 120}
        onNextLevel={handleNextLevel}
        onReplay={handleRestartLevel}
        onClose={() => setShowWin(false)}
      />

      {/* ── Settings & Personalization Modal ── */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        bgmEnabled={bgmEnabled}
        onToggleBgm={handleToggleBgm}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        onOpenResetConfirm={() => setShowResetConfirm(true)}
      />

      {/* ── Confirm Reset Progress Modal ── */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Reset All Progress?"
        message="This will reset your completed campaign levels, high scores, and stats. This cannot be undone."
        confirmText="Yes, Reset Everything"
        cancelText="Keep Progress"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* ── Out of Lives / Game Over Modal ── */}
      <GameOverModal
        isOpen={showGameOver}
        onReviveWithAd={handleReviveWithAd}
        onRestart={handleRestartLevel}
      />

      {/* ── Rewarded Ad Modal ── */}
      <RewardAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onRewardClaimed={onAdRewardFinished}
        hintNumber={window._pendingRevive ? 1 : hintsUsed + 1}
      />

      {/* ── Google Play Sign-In Modal ── */}
      <GoogleAuthModal
        isOpen={showGoogleAuth}
        onLoginSuccess={handleGoogleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
        currentLevel={levelNumber}
      />

    </div>
  );
}
