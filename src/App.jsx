/**
 * App.jsx — Master Controller for Arrow Puzzle Mobile App
 * Auth & Loading Sequence:
 * 1. User signs in with Google OR chooses Guest Player.
 * 2. THEN the Splash Loading Screen displays with the rotating green arc.
 * 3. Once loaded, transitions smoothly into the Game!
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';

// Snake Engine (Pure Rule-Based, No AI Solver)
import {
  generateSnakeLevel,
  getFreeArrows,
  getRuleBasedHint,
} from './engine/snakeEngine.js';

// Sound
import { playExit, playBlocked, playWin } from './utils/soundEffects.js';

// Storage (User-Isolated)
import {
  saveLevelProgress,
  saveCurrentLevel,
  loadCurrentLevel,
  loadAllProgress,
  loadSoundEnabled,
  saveSoundEnabled,
} from './utils/storage.js';

// Components
import LoadingScreen   from './components/LoadingScreen.jsx';
import GoogleAuthModal from './components/GoogleAuthModal.jsx';
import HomeScreen      from './components/HomeScreen.jsx';
import SnakeBoard      from './components/SnakeBoard.jsx';
import WinModal        from './components/WinModal.jsx';
import RewardAdModal   from './components/RewardAdModal.jsx';
import GameOverModal   from './components/GameOverModal.jsx';
import SettingsModal   from './components/SettingsModal.jsx';
import PauseModal      from './components/PauseModal.jsx';
import LevelModal      from './components/LevelModal.jsx';

const TIERS = ['Easy', 'Medium', 'Hard', 'Expert'];

function getTierForLevel(levelNum) {
  return TIERS[(levelNum - 1) % 4];
}

const USER_STORAGE_KEY = 'arrow_puzzle_user';

export default function App() {
  // Active User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Google Play Login Modal (shows if no user selected yet)
  const [showGoogleAuth, setShowGoogleAuth] = useState(() => {
    return !localStorage.getItem(USER_STORAGE_KEY);
  });

  // Splash Loading Screen (triggered after login / guest choice)
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Loading Arrow Puzzle...');

  // Track whether active user is a new player on this account
  const [isNewPlayer, setIsNewPlayer] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    const u = saved ? JSON.parse(saved) : null;
    const userEmail = u?.email || 'guest';
    const lvl = loadCurrentLevel(userEmail);
    const prog = loadAllProgress(userEmail);
    return Object.keys(prog).length === 0 && lvl <= 1;
  });

  // Navigation: 'home' | 'play'
  const [screen, setScreen] = useState('home');

  // Level Progression for Active User
  const [levelNumber, setLevelNumber] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    const u = saved ? JSON.parse(saved) : null;
    const userEmail = u?.email || 'guest';
    const savedLvl = loadCurrentLevel(userEmail);
    return savedLvl && Number(savedLvl) > 0 ? Number(savedLvl) : 1;
  });

  const currentTier = getTierForLevel(levelNumber);

  // Active Level Data
  const [levelData, setLevelData] = useState(() => generateSnakeLevel(getTierForLevel(1)));
  const initialArrowsRef = useRef(levelData.arrows);

  // Gameplay State
  const [hearts, setHearts] = useState(3);
  const [moveCount, setMoveCount] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintArrowId, setHintArrowId] = useState(null);
  const [moveHistory, setMoveHistory] = useState([]);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Modals
  const [showWin, setShowWin] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPause, setShowPause] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(() => loadSoundEnabled());

  // Listen for PWA Install Prompt Event
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      window.installPromptEvent = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Timer Tick
  useEffect(() => {
    if (screen !== 'play' || showPause || showWin || showGameOver || isLoading) return;
    const interval = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [screen, showPause, showWin, showGameOver, isLoading]);

  // When user logs in with Google -> Show Splash Loading Screen -> Go to Home/Game
  const handleGoogleLoginSuccess = (profile) => {
    setUserProfile(profile);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    setShowGoogleAuth(false);

    // Show splash loading with green arc
    setLoadingMessage(`Signing in as ${profile.name}...`);
    setIsLoading(true);

    const userLvl = loadCurrentLevel(profile.email);
    const userProgress = loadAllProgress(profile.email);
    const hasHistory = Object.keys(userProgress).length > 0 || userLvl > 1;

    setTimeout(() => {
      if (hasHistory) {
        setIsNewPlayer(false);
        setLevelNumber(userLvl);
      } else {
        setIsNewPlayer(true);
        setLevelNumber(1);
        saveCurrentLevel(1, profile.email);
      }
      setIsLoading(false);
    }, 1100);
  };

  // When user continues as Guest -> Show Splash Loading Screen -> Go to Home/Game
  const handleContinueAsGuest = () => {
    const guestUser = { name: 'Guest Player', email: 'guest', isLoggedIn: false };
    setUserProfile(guestUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(guestUser));
    setShowGoogleAuth(false);

    // Show splash loading with green arc
    setLoadingMessage('Loading Guest profile...');
    setIsLoading(true);

    const guestLvl = loadCurrentLevel('guest');
    const guestProgress = loadAllProgress('guest');
    const hasHistory = Object.keys(guestProgress).length > 0 || guestLvl > 1;

    setTimeout(() => {
      setIsNewPlayer(!hasHistory);
      setLevelNumber(guestLvl);
      setIsLoading(false);
    }, 900);
  };

  // Logout / Switch Account
  const handleLogout = () => {
    setShowGoogleAuth(true);
  };

  // Initialize level whenever levelNumber changes
  const loadLevel = useCallback((lvlNum) => {
    const tier = getTierForLevel(lvlNum);
    const newLvl = generateSnakeLevel(tier);
    setLevelData(newLvl);
    initialArrowsRef.current = newLvl.arrows;
    setHearts(3);
    setMoveCount(0);
    setHintsUsed(0);
    setHintArrowId(null);
    setMoveHistory([]);
    setElapsedSeconds(0);
    setShowWin(false);
    setShowGameOver(false);
    setShowPause(false);
    saveCurrentLevel(lvlNum, userProfile?.email);
  }, [userProfile?.email]);

  // When levelNumber state updates, load corresponding puzzle
  useEffect(() => {
    loadLevel(levelNumber);
  }, [levelNumber, loadLevel]);

  // Handle successful arrow exit
  const handleArrowCleared = (arrowId) => {
    if (soundEnabled) playExit();
    if (navigator.vibrate) navigator.vibrate(35);

    const clearedArrow = levelData.arrows.find(a => a.id === arrowId);
    if (clearedArrow) {
      setMoveHistory(prev => [...prev, { clearedArrow, hearts, moveCount }]);
    }

    const remaining = levelData.arrows.filter(a => a.id !== arrowId);
    setLevelData(prev => ({ ...prev, arrows: remaining }));
    setMoveCount(m => m + 1);

    // Check Win Condition: all arrows cleared!
    if (remaining.length === 0) {
      if (soundEnabled) playWin();
      confetti({ particleCount: 160, spread: 80, origin: { y: 0.6 } });
      const stars = hearts === 3 ? 3 : hearts === 2 ? 2 : 1;
      
      saveLevelProgress(levelNumber, moveCount + 1, stars, userProfile?.email);
      saveCurrentLevel(levelNumber + 1, userProfile?.email);
      setIsNewPlayer(false);
      
      setTimeout(() => setShowWin(true), 400);
    }
  };

  // Handle blocked arrow collision
  const handleArrowBlocked = () => {
    if (soundEnabled) playBlocked();
    if (navigator.vibrate) navigator.vibrate(100);

    setHearts(prev => {
      const next = prev - 1;
      if (next <= 0) {
        setTimeout(() => setShowGameOver(true), 500);
      }
      return Math.max(0, next);
    });
  };

  // Undo Move
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

  // Hint Logic (Rule-Based: 1 Free + 2 Ad-rewarded)
  const triggerHintDisplay = () => {
    const hint = getRuleBasedHint(levelData.arrows, levelData.width, levelData.height);
    if (hint) {
      setHintArrowId(hint.id);
      setTimeout(() => setHintArrowId(null), 3000);
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

  // Start / Continue Game Action with smooth loading transition
  const handleStartOrContinue = (lvlNum) => {
    setLoadingMessage(`Loading Level ${lvlNum}...`);
    setIsLoading(true);
    setTimeout(() => {
      setIsNewPlayer(false);
      setLevelNumber(lvlNum);
      setScreen('play');
      setIsLoading(false);
    }, 450);
  };

  // Start Endless Mode
  const handleStartEndlessMode = () => {
    setLoadingMessage('Generating Endless Mode...');
    setIsLoading(true);
    setTimeout(() => {
      const endlessLevel = generateSnakeLevel('Hard');
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
    }, 500);
  };

  // Restart Current Level
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

  // Next Level Progression (Infinite: Easy -> Medium -> Hard -> Expert -> repeat)
  const handleNextLevel = () => {
    setShowWin(false);
    setLevelNumber(prev => prev + 1);
  };

  // Select Level from Modal
  const handleSelectLevel = (selectedNum) => {
    setShowLevelModal(false);
    handleStartOrContinue(selectedNum);
  };

  // Audio Toggle
  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      saveSoundEnabled(!prev);
      return !prev;
    });
  };

  // ── Show Splash Loading Screen when triggered ──
  if (isLoading) {
    return <LoadingScreen message={loadingMessage} />;
  }

  const currentEmail = userProfile?.email || 'guest';
  const userProgress = loadAllProgress(currentEmail);
  const maxUnlocked = Math.max(levelNumber, Object.keys(userProgress).length + 1);

  return (
    <div className="min-h-dvh bg-slate-200/60 flex items-center justify-center">
      
      {/* ── Screen: Home Screen Dashboard ── */}
      {screen === 'home' && (
        <HomeScreen
          currentLevelNumber={levelNumber}
          isNewPlayer={isNewPlayer}
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
        />
      )}

      {/* ── Screen: Play Screen ── */}
      {screen === 'play' && (
        <SnakeBoard
          levelNumber={levelNumber}
          tier={currentTier}
          levelData={levelData}
          onBackToHome={() => setScreen('home')}
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
        />
      )}

      {/* ── Google Play Account Sign-in Modal (Multi-User) ── */}
      <GoogleAuthModal
        isOpen={showGoogleAuth}
        onLoginSuccess={handleGoogleLoginSuccess}
        onContinueAsGuest={handleContinueAsGuest}
        currentLevel={levelNumber}
      />

      {/* ── Pause Menu Modal ── */}
      <PauseModal
        isOpen={showPause}
        levelNumber={levelNumber}
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
          setScreen('home');
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* ── Level Selection Modal ── */}
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        onSelectLevel={handleSelectLevel}
        currentLevelNumber={levelNumber}
        maxUnlockedLevel={maxUnlocked}
        progress={userProgress}
      />

      {/* ── Rewarded Ad Modal ── */}
      <RewardAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onRewardClaimed={onAdRewardFinished}
        hintNumber={window._pendingRevive ? 1 : hintsUsed + 1}
      />

      {/* ── Game Over (Out of Lives) Modal ── */}
      <GameOverModal
        isOpen={showGameOver}
        onReviveWithAd={handleReviveWithAd}
        onRestart={handleRestartLevel}
      />

      {/* ── Win Celebration Modal ── */}
      <WinModal
        isOpen={showWin}
        moveCount={moveCount}
        levelName={`Level ${levelNumber} (${currentTier})`}
        onNextLevel={handleNextLevel}
        onReplay={handleRestartLevel}
        onClose={() => setShowWin(false)}
      />

      {/* ── In-Game Settings Modal ── */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onRestartLevel={handleRestartLevel}
      />

    </div>
  );
}
