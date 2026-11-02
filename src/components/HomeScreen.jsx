/**
 * HomeScreen.jsx — Premium Dark Cosmic Dashboard
 * Features:
 * - Dynamic Theme adaptation (Midnight, Neon, Ocean, Aurora)
 * - Animated Game Branding & Floating Icon
 * - Player XP & Level Rank
 * - Quick Action Hero Buttons (Continue Playing / Large Play Button)
 * - Daily Challenge with Streak Counter
 * - Endless Mode & Level Selection
 * - Achievements Showcase Button
 * - Progress Overview & Real Statistics
 * - Recently Played Levels with Stars & Best Times
 */

import { useState } from 'react';
import {
  Calendar, Trophy, Play, RotateCcw, LayoutGrid, Infinity as InfinityIcon,
  Star, Download, Volume2, VolumeX, Home, User, Settings, Flame, Award,
  BarChart3, LogIn, LogOut, CheckCircle2, Target, TrendingUp, Palette, Sparkles,
} from 'lucide-react';
import { getTheme } from '../utils/theme.js';

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
  onOpenAchievements,
  onOpenDailyChallenge,
  streak = 0,
  currentTheme = 'midnight',
  onSelectTheme,
}) {
  const [activeTab, setActiveTab] = useState('main');

  const themeConfig = getTheme(currentTheme);
  const todayStr = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date());

  const completedLevelIds = Object.keys(progress).map(Number).filter(n => !isNaN(n));
  const totalCompleted = completedLevelIds.length;
  const totalStars = Object.values(progress).reduce((acc, curr) => acc + (curr.stars || 0), 0);
  const totalMoves = Object.values(progress).reduce((acc, curr) => acc + (curr.moves || 0), 0);

  // Derive XP and Player Level
  const totalXP = totalStars * 100 + totalCompleted * 60 + streak * 40;
  const playerRank = Math.floor(totalXP / 500) + 1;
  const xpInRank = totalXP % 500;
  const xpPercent = Math.min(100, Math.round((xpInRank / 500) * 100));

  // Best time across all levels
  const bestTimes = Object.values(progress)
    .map(p => p.bestTime)
    .filter(t => t && t > 0);
  const fastestTime = bestTimes.length > 0 ? Math.min(...bestTimes) : null;

  // Recently played levels
  const recentLevels = [];
  for (let i = Math.max(1, currentLevelNumber - 3); i <= currentLevelNumber; i++) {
    recentLevels.push({
      id: i,
      stars: progress[i]?.stars || (i < currentLevelNumber ? 3 : 0),
      bestTime: progress[i]?.bestTime || null,
      isCurrent: i === currentLevelNumber,
    });
  }

  const handleInstallApp = async () => {
    if (window.installPromptEvent) {
      window.installPromptEvent.prompt();
      const choice = await window.installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') window.installPromptEvent = null;
    } else {
      alert('To install this app on your phone:\n\n1. Open in Chrome / Safari on mobile\n2. Tap Browser Menu (⋮ or Share)\n3. Tap "Add to Home Screen"!');
    }
  };

  return (
    <div className={`min-h-dvh flex flex-col justify-between bg-gradient-to-b ${themeConfig.bgGradient} text-white max-w-md mx-auto w-full relative shadow-2xl overflow-hidden select-none`}>
      
      {/* ── Top Bar: Player Profile, Achievements & Settings ── */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white flex items-center justify-center font-black text-sm shadow-lg shadow-cyan-500/25 ring-2 ring-white/10 shrink-0">
            {userProfile?.isLoggedIn
              ? (userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'LR')
              : 'GP'}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm text-white truncate max-w-[130px]">
                {userProfile?.isLoggedIn ? userProfile.name : 'Guest Player'}
              </span>
              {userProfile?.isLoggedIn && (
                <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
              )}
            </div>
            {/* XP progress bar */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold mt-0.5">
              <span className="text-cyan-400 font-bold">Rank {playerRank}</span>
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-slate-300 font-mono text-[9px]">{totalXP} XP</span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Achievements & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAchievements}
            className="p-2.5 rounded-2xl glass-card text-amber-400 hover:text-amber-300 hover:bg-white/10 transition cursor-pointer"
            aria-label="Achievements"
            title="Achievements"
          >
            <Trophy size={18} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-2xl glass-card text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'main' && (
        <div className="flex-1 flex flex-col px-5 py-2.5 gap-3.5 overflow-y-auto scrollbar-thin animate-fade-in relative z-10">
          
          {/* Daily Challenge & Tournament Cards */}
          <div className="flex gap-2.5">
            {/* Daily Challenge Card */}
            <div
              onClick={onOpenDailyChallenge}
              className="flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-3.5 text-white shadow-lg shadow-blue-600/20 flex flex-col items-center justify-between min-h-[125px] border border-blue-400/20 relative overflow-hidden cursor-pointer hover:border-blue-400/40 active:scale-98 transition"
            >
              <div className="flex flex-col items-center relative z-10">
                <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-1">
                  <Calendar size={17} />
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">Daily Challenge</span>
                <span className="text-xs font-black mt-0.5">{todayStr}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full z-10">
                <Flame size={11} className="text-orange-300 fill-orange-300" />
                <span>{streak}d Streak</span>
              </div>
            </div>

            {/* Tournament Card */}
            <div
              onClick={() => onContinueGame(currentLevelNumber)}
              className="flex-1 bg-gradient-to-br from-amber-600 via-orange-600 to-red-700 rounded-3xl p-3.5 text-white shadow-lg shadow-orange-600/20 flex flex-col items-center justify-between min-h-[125px] relative overflow-hidden border border-amber-400/20 cursor-pointer hover:border-amber-400/40 active:scale-98 transition"
            >
              <span className="absolute top-2 right-2 text-[8px] font-bold bg-black/30 px-1.5 py-0.5 rounded-full z-10">
                ⏱ 1d 23h
              </span>
              <div className="flex flex-col items-center mt-1 relative z-10">
                <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-1">
                  <Trophy size={17} />
                </div>
                <span className="text-[9px] font-bold tracking-wider uppercase opacity-80">Tournament</span>
                <span className="text-xs font-black mt-0.5">Cup 1</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onContinueGame(currentLevelNumber);
                }}
                className="w-full py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-extrabold text-xs rounded-full border border-white/20 active:scale-95 transition cursor-pointer relative z-10"
              >
                Play
              </button>
            </div>
          </div>

          {/* Animated App Branding Logo */}
          <div className="flex flex-col items-center my-1.5 relative">
            <div className="w-16 h-16 rounded-3xl glass-card-strong p-2.5 mb-2 flex items-center justify-center animate-float shadow-xl shadow-cyan-500/15 border border-white/15">
              <img src="/icon.svg" alt="Arrow Puzzle" className="w-11 h-11 object-contain" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
              <span>Arrow Puzzle</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-semibold mt-0.5">Directional Logic Escape</p>
          </div>

          {/* Hero Action Buttons */}
          <div className="flex flex-col gap-2.5">
            {isNewPlayer ? (
              <button
                onClick={() => onStartNewGame(1)}
                className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r ${themeConfig.accentGradient} hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-white/20`}
              >
                <Play size={18} fill="currentColor" />
                <span>Play Game</span>
                <span className="text-xs font-semibold opacity-85">(Level 1)</span>
              </button>
            ) : (
              <button
                onClick={() => onContinueGame(currentLevelNumber)}
                className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r ${themeConfig.accentGradient} hover:brightness-110 active:scale-[0.98] text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer border border-white/20`}
              >
                <Play size={18} fill="currentColor" />
                <span>Continue Playing</span>
                <span className="text-xs font-semibold opacity-85">(Level {currentLevelNumber})</span>
              </button>
            )}

            {/* Quick Modes Row: Level Selection & Endless Mode */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenLevelSelect}
                className="py-2.5 px-3 rounded-2xl glass-card hover:border-cyan-400/40 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <LayoutGrid size={15} className="text-cyan-400" />
                Level Selection
              </button>

              <button
                onClick={onStartEndlessMode}
                className="py-2.5 px-3 rounded-2xl glass-card hover:border-violet-400/40 active:scale-95 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <InfinityIcon size={16} className="text-violet-400" />
                Endless Mode
              </button>
            </div>
          </div>

          {/* Progress Overview & Stats Card */}
          <div className="glass-card p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <BarChart3 size={14} className="text-cyan-400" /> Progress Overview
              </span>
              <button
                onClick={() => setActiveTab('stats')}
                className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-white/5 p-2 rounded-2xl border border-white/[0.06]">
                <Target size={13} className="text-cyan-400 mx-auto mb-0.5" />
                <span className="text-[9px] text-slate-400 font-bold block">Levels</span>
                <span className="text-xs font-black text-cyan-300">{totalCompleted}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-2xl border border-white/[0.06]">
                <Star size={13} className="text-amber-400 mx-auto mb-0.5" />
                <span className="text-[9px] text-slate-400 font-bold block">Stars</span>
                <span className="text-xs font-black text-amber-400">{totalStars}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-2xl border border-white/[0.06]">
                <TrendingUp size={13} className="text-violet-400 mx-auto mb-0.5" />
                <span className="text-[9px] text-slate-400 font-bold block">Current</span>
                <span className="text-xs font-black text-violet-300">{currentLevelNumber}</span>
              </div>
              <div className="bg-white/5 p-2 rounded-2xl border border-white/[0.06]">
                <Flame size={13} className="text-orange-400 mx-auto mb-0.5" />
                <span className="text-[9px] text-slate-400 font-bold block">Streak</span>
                <span className="text-xs font-black text-orange-400">{streak}d</span>
              </div>
            </div>
          </div>

          {/* Recently Played Levels */}
          <div className="glass-card p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                <Award size={14} className="text-amber-400" /> Recently Played
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">Tap to replay</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-none">
              {recentLevels.map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => onContinueGame(lvl.id)}
                  className={`flex-1 min-w-[70px] p-2 rounded-2xl border flex flex-col items-center justify-center gap-0.5 transition cursor-pointer active:scale-95 ${
                    lvl.isCurrent
                      ? 'bg-cyan-500/15 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                      : 'bg-white/5 border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <span className={`text-[11px] font-black ${lvl.isCurrent ? 'text-cyan-300' : 'text-slate-200'}`}>
                    Lvl {lvl.id}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(s => (
                      <Star
                        key={s}
                        size={8}
                        className={s <= lvl.stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-700'}
                      />
                    ))}
                  </div>
                  {lvl.bestTime && (
                    <span className="text-[8px] text-slate-400 font-mono mt-0.5">
                      {lvl.bestTime}s
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ── Daily Tab ── */}
      {activeTab === 'daily' && (
        <div className="flex-1 flex flex-col items-center justify-center px-6 animate-fade-in text-center my-auto relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-400/30 text-blue-400 flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
            <Calendar size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-1">Daily Challenge</h2>
          <p className="text-slate-400 text-xs mb-4 max-w-xs leading-relaxed">
            Solve today's hand-crafted puzzle to keep your daily streak alive and gain bonus stars!
          </p>
          <div className="flex items-center gap-2 mb-6 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
            <Flame size={16} className="text-orange-400" />
            <span className="text-xs font-black text-white">{streak} Days Active Streak</span>
          </div>
          <button
            onClick={onOpenDailyChallenge}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 active:scale-95 cursor-pointer border border-blue-400/30"
          >
            Open Daily Challenge
          </button>
        </div>
      )}

      {/* ── Stats Tab ── */}
      {activeTab === 'stats' && (
        <div className="flex-1 flex flex-col px-5 py-4 gap-3.5 overflow-y-auto animate-fade-in relative z-10">
          <h2 className="text-base font-black text-white">Player Statistics</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Highest Level</span>
              <p className="text-xl font-black text-cyan-300">{currentLevelNumber}</p>
            </div>
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Stars</span>
              <p className="text-xl font-black text-amber-400">{totalStars} ⭐</p>
            </div>
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Levels Cleared</span>
              <p className="text-xl font-black text-emerald-400">{totalCompleted}</p>
            </div>
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Total Moves</span>
              <p className="text-xl font-black text-violet-300">{totalMoves}</p>
            </div>
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Daily Streak</span>
              <p className="text-xl font-black text-orange-400">{streak} Days 🔥</p>
            </div>
            <div className="glass-card p-3.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Fastest Win</span>
              <p className="text-xl font-black text-pink-400">
                {fastestTime ? `${fastestTime}s ⚡` : '—'}
              </p>
            </div>
          </div>

          {/* Quick Achievements Link */}
          <button
            onClick={onOpenAchievements}
            className="glass-card p-3.5 flex items-center justify-between text-left hover:border-amber-400/40 transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Trophy size={18} />
              </div>
              <div>
                <h4 className="text-xs font-black text-white">Achievements Gallery</h4>
                <p className="text-[10px] text-slate-400">View unlocked trophies & badges</p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400">View →</span>
          </button>
        </div>
      )}

      {/* ── Me Tab ── */}
      {activeTab === 'me' && (
        <div className="flex-1 flex flex-col px-5 py-4 gap-3.5 overflow-y-auto animate-fade-in relative z-10">
          <div className="flex items-center gap-3 glass-card p-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-cyan-500/20 shrink-0">
              {userProfile?.isLoggedIn
                ? (userProfile.name ? userProfile.name.slice(0, 2).toUpperCase() : 'LR')
                : 'GP'}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="font-bold text-white text-sm truncate">
                {userProfile?.isLoggedIn ? userProfile.name : 'Guest Player'}
              </h3>
              <p className="text-xs text-slate-400 truncate">
                {userProfile?.isLoggedIn ? userProfile.email : 'Local device account'}
              </p>
            </div>
          </div>

          <div className="glass-card overflow-hidden divide-y divide-white/[0.06]">
            {userProfile?.isLoggedIn ? (
              <button
                onClick={onLogout}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut size={16} className="text-rose-400" />
                  <span className="font-bold text-xs text-slate-200">Switch Account</span>
                </div>
                <span className="text-[10px] text-slate-400">Google Play</span>
              </button>
            ) : (
              <button
                onClick={onOpenGoogleAuth}
                className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogIn size={16} className="text-cyan-400" />
                  <span className="font-bold text-xs text-slate-200">Sign in with Google</span>
                </div>
                <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">Sign In</span>
              </button>
            )}

            <button
              onClick={handleInstallApp}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Download size={16} className="text-cyan-400" />
                <span className="font-bold text-xs text-slate-200">Install Mobile App</span>
              </div>
              <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">PWA</span>
            </button>

            <button
              onClick={onToggleSound}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                {soundEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} className="text-slate-500" />}
                <span className="font-bold text-xs text-slate-200">Sound Effects</span>
              </div>
              <span className={`text-xs font-semibold ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            <button
              onClick={onOpenSettings}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Palette size={16} className="text-purple-400" />
                <span className="font-bold text-xs text-slate-200">Themes & Personalization</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">{currentTheme}</span>
            </button>

            <button
              onClick={onRestartGame}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/5 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <RotateCcw size={16} className="text-amber-400" />
                <span className="font-bold text-xs text-slate-200">Restart Current Level</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ── Bottom Nav Tab Bar ── */}
      <div className="bg-black/35 backdrop-blur-xl border-t border-white/[0.08] px-6 py-2.5 flex items-center justify-around relative z-10">
        {[
          { id: 'main', icon: Home, label: 'Dashboard' },
          { id: 'daily', icon: Calendar, label: 'Daily' },
          { id: 'stats', icon: BarChart3, label: 'Stats' },
          { id: 'me', icon: User, label: 'Me' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 cursor-pointer transition-all ${
              activeTab === tab.id ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 1.8} />
            <span className="text-[10px] font-bold">{tab.label}</span>
            {activeTab === tab.id && (
              <div className="w-1 h-1 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            )}
          </button>
        ))}
      </div>

    </div>
  );
}
