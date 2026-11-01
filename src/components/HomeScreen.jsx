/**
 * HomeScreen.jsx — Updated Home Dashboard
 * Features:
 * - Game branding and player profile
 * - Continue Playing / Play Game
 * - Level Selection
 * - Endless Mode
 * - Daily Challenge & Tournament
 * - Statistics & Progress overview
 * - Recently played levels
 * - Settings & Mobile App installation
 */

import { useState } from 'react';
import {
  Calendar,
  Trophy,
  Play,
  RotateCcw,
  LayoutGrid,
  Infinity as InfinityIcon,
  Star,
  Download,
  Volume2,
  VolumeX,
  Home,
  User,
  Settings,
  Flame,
  Award,
  BarChart3,
  LogIn,
  LogOut,
  CheckCircle2,
} from 'lucide-react';

export default function HomeScreen({
  currentLevelNumber = 1,
  isNewPlayer = false,
  userProfile = null,
  progress = {},
  onContinueGame,
  onStartNewGame,
  onOpenLevelSelect,
  onStartEndlessMode,
  onRestartGame,
  onOpenGoogleAuth,
  onLogout,
  soundEnabled = true,
  onToggleSound,
  onOpenSettings,
}) {
  const [activeTab, setActiveTab] = useState('main'); // 'main' | 'daily' | 'stats' | 'me'

  const todayStr = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric' }).format(new Date());

  // Derive stats from progress
  const completedLevelIds = Object.keys(progress).map(Number).filter(n => !isNaN(n));
  const totalCompleted = completedLevelIds.length;
  const totalStars = Object.values(progress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const totalMoves = Object.values(progress).reduce((acc, curr) => acc + (curr.moves || 0), 0);

  // Recently played levels (last 4 unlocked or completed)
  const recentLevels = [];
  for (let i = Math.max(1, currentLevelNumber - 3); i <= currentLevelNumber; i++) {
    recentLevels.push({
      id: i,
      stars: progress[i]?.stars || (i < currentLevelNumber ? 3 : 0),
      isCurrent: i === currentLevelNumber,
    });
  }

  const handleInstallApp = async () => {
    if (window.installPromptEvent) {
      window.installPromptEvent.prompt();
      const choice = await window.installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        window.installPromptEvent = null;
      }
    } else {
      alert('To install this app on your phone:\n\n1. Open in Chrome / Safari on mobile\n2. Tap Browser Menu (⋮ or Share)\n3. Tap "Install App" or "Add to Home Screen"!');
    }
  };

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-800 max-w-md mx-auto w-full relative shadow-xl overflow-hidden select-none">
      
      {/* ── Top Bar: Player Profile & Quick Settings ── */}
      <div className="px-5 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
            {userProfile?.isLoggedIn
              ? (userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'LR')
              : 'GP'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-slate-800 truncate max-w-[150px]">
                {userProfile?.isLoggedIn ? userProfile.name : 'Guest Player'}
              </span>
              {userProfile?.isLoggedIn && (
                <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              )}
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              Level {currentLevelNumber} • {totalStars} ⭐
            </span>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={19} />
        </button>
      </div>

      {/* ── Main Tab Content ── */}
      {activeTab === 'main' && (
        <div className="flex-1 flex flex-col px-5 py-3 gap-4 overflow-y-auto scrollbar-thin animate-fade-in">
          
          {/* Daily Challenge & Tournament Cards */}
          <div className="flex gap-2.5">
            {/* Daily Challenge Card (Blue) */}
            <div className="flex-1 bg-gradient-to-br from-blue-500 to-sky-400 rounded-3xl p-3.5 text-white shadow-lg shadow-blue-500/20 flex flex-col items-center justify-between min-h-[135px]">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1 shadow-inner">
                  <Calendar size={18} className="text-white" />
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-85">Daily Challenge</span>
                <span className="text-xs font-black mt-0.5">{todayStr}</span>
              </div>
              <button
                onClick={() => onContinueGame(currentLevelNumber)}
                className="w-full py-1.5 bg-white text-blue-600 font-extrabold text-xs rounded-full shadow hover:bg-slate-50 active:scale-95 transition cursor-pointer"
              >
                Play
              </button>
            </div>

            {/* Tournament Card (Orange) */}
            <div className="flex-1 bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-3.5 text-white shadow-lg shadow-orange-500/20 flex flex-col items-center justify-between min-h-[135px] relative">
              <span className="absolute top-2 right-2 text-[8px] font-bold bg-black/20 px-1.5 py-0.5 rounded-full">
                ⏱ 1d 23h
              </span>
              <div className="flex flex-col items-center mt-1">
                <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-1 shadow-inner">
                  <Trophy size={18} className="text-white" />
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-85">Tournament</span>
                <span className="text-xs font-black mt-0.5">Cup 1</span>
              </div>
              <button
                onClick={() => onContinueGame(currentLevelNumber)}
                className="w-full py-1.5 bg-white text-orange-600 font-extrabold text-xs rounded-full shadow hover:bg-slate-50 active:scale-95 transition cursor-pointer"
              >
                Play
              </button>
            </div>
          </div>

          {/* Clean App Branding */}
          <div className="flex flex-col items-center my-1">
            <div className="w-16 h-16 rounded-3xl bg-white shadow-xl shadow-slate-200 border border-slate-100 p-2 mb-2 flex items-center justify-center">
              <img
                src="/icon.svg"
                alt="Arrow Puzzle Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Arrow Puzzle
            </h1>
            <p className="text-slate-400 text-xs font-semibold">Directional Logic Escape</p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {isNewPlayer ? (
              <button
                onClick={() => onStartNewGame(1)}
                className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                <span>Play Game</span>
                <span className="text-xs font-semibold text-blue-200 opacity-90">(Level 1)</span>
              </button>
            ) : (
              <button
                onClick={() => onContinueGame(currentLevelNumber)}
                className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-extrabold text-base shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Play size={18} fill="currentColor" />
                <span>Continue Playing</span>
                <span className="text-xs font-semibold text-blue-200 opacity-90">(Level {currentLevelNumber})</span>
              </button>
            )}

            {/* Quick Modes Row: Level Selection & Endless Mode */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenLevelSelect}
                className="py-2.5 px-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 active:scale-95 shadow-sm text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LayoutGrid size={15} className="text-blue-600" />
                Level Selection
              </button>

              <button
                onClick={onStartEndlessMode}
                className="py-2.5 px-3 rounded-2xl bg-white border border-slate-200 hover:border-violet-400 active:scale-95 shadow-sm text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <InfinityIcon size={16} className="text-violet-600" />
                Endless Mode
              </button>
            </div>
          </div>

          {/* Progress Overview & Stats Card */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <BarChart3 size={15} className="text-blue-600" /> Progress Overview
              </span>
              <button
                onClick={() => setActiveTab('stats')}
                className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Levels</span>
                <span className="text-sm font-black text-slate-800">{totalCompleted}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Stars</span>
                <span className="text-sm font-black text-amber-500">{totalStars}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Current</span>
                <span className="text-sm font-black text-blue-600">{currentLevelNumber}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">Streak</span>
                <span className="text-sm font-black text-emerald-600 flex items-center justify-center gap-0.5">
                  <Flame size={12} className="text-orange-500 fill-orange-500" /> {Math.min(7, totalCompleted)}
                </span>
              </div>
            </div>
          </div>

          {/* Recently Played Levels */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Award size={15} className="text-amber-500" /> Recently Played
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Tap to replay</span>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {recentLevels.map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => onContinueGame(lvl.id)}
                  className={`flex-1 min-w-[70px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95 ${
                    lvl.isCurrent
                      ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <span className={`text-[11px] font-black ${lvl.isCurrent ? 'text-blue-600' : 'text-slate-700'}`}>
                    Lvl {lvl.id}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        size={8}
                        className={s <= lvl.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-300 fill-slate-300'}
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Daily Tab Content ── */}
      {activeTab === 'daily' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in text-center my-auto">
          <div className="w-16 h-16 rounded-3xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-1">Daily Challenge</h2>
          <p className="text-slate-500 text-xs mb-6 max-w-xs">
            Solve today's puzzle to maintain your logic streak and earn bonus stars!
          </p>
          <button
            onClick={() => onContinueGame(currentLevelNumber)}
            className="px-8 py-3.5 rounded-full bg-blue-600 text-white font-extrabold text-sm shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
          >
            Play Today's Challenge
          </button>
        </div>
      )}

      {/* ── Statistics Tab Content ── */}
      {activeTab === 'stats' && (
        <div className="flex-1 flex flex-col px-5 py-4 gap-4 overflow-y-auto animate-fade-in">
          <h2 className="text-lg font-black text-slate-800">Player Statistics</h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-1">Highest Level</span>
              <p className="text-2xl font-black text-blue-600">{currentLevelNumber}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-1">Total Stars</span>
              <p className="text-2xl font-black text-amber-500">{totalStars}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-1">Completed</span>
              <p className="text-2xl font-black text-emerald-600">{totalCompleted}</p>
            </div>
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
              <span className="text-xs text-slate-400 font-bold block mb-1">Total Moves</span>
              <p className="text-2xl font-black text-slate-700">{totalMoves}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Me / Settings Tab Content ── */}
      {activeTab === 'me' && (
        <div className="flex-1 flex flex-col px-5 py-4 gap-4 overflow-y-auto animate-fade-in">
          <div className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
              {userProfile?.isLoggedIn
                ? (userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'LR')
                : 'GP'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-slate-800 truncate">
                {userProfile?.isLoggedIn ? userProfile.name : 'Guest Player'}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {userProfile?.isLoggedIn ? userProfile.email : 'Local device play'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm divide-y divide-slate-100">
            {/* Account Switch */}
            {userProfile?.isLoggedIn ? (
              <button
                onClick={onLogout}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={18} className="text-red-500" />
                  <span className="font-bold text-sm text-slate-800">Switch Account</span>
                </div>
                <span className="text-xs text-slate-400">Google Play</span>
              </button>
            ) : (
              <button
                onClick={onOpenGoogleAuth}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogIn size={18} className="text-blue-600" />
                  <span className="font-bold text-sm text-slate-800">Sign in with Google</span>
                </div>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Sign In
                </span>
              </button>
            )}

            {/* Install App on Phone */}
            <button
              onClick={handleInstallApp}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download size={18} className="text-blue-600" />
                <span className="font-bold text-sm text-slate-800">Install Mobile App</span>
              </div>
              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                PWA
              </span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 size={18} className="text-emerald-600" /> : <VolumeX size={18} className="text-slate-400" />}
                <span className="font-bold text-sm text-slate-800">Sound Effects</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Reset Level Progress */}
            <button
              onClick={onRestartGame}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={18} className="text-amber-500" />
                <span className="font-bold text-sm text-slate-800">Restart Current Level</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Navigation Tab Bar ── */}
      <div className="bg-white border-t border-slate-200/80 px-6 py-2.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'main' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home size={22} strokeWidth={activeTab === 'main' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('daily')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'daily' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Calendar size={22} strokeWidth={activeTab === 'daily' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Daily</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'stats' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BarChart3 size={22} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Stats</span>
        </button>

        <button
          onClick={() => setActiveTab('me')}
          className={`flex flex-col items-center gap-0.5 cursor-pointer ${
            activeTab === 'me' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <User size={22} strokeWidth={activeTab === 'me' ? 2.5 : 2} />
          <span className="text-[10px] font-bold">Me</span>
        </button>
      </div>

    </div>
  );
}
