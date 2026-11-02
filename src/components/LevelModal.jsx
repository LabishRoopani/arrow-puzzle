/**
 * LevelModal.jsx — Comprehensive Campaign Level Catalog
 * Displays:
 * - Level Number
 * - Difficulty Tier (Easy, Medium, Hard, Expert)
 * - Stars Earned (1–3 ⭐)
 * - Best Completion Time
 * - Locked / Unlocked Status
 */

import { X, Star, Lock, Clock, Trophy } from 'lucide-react';

const TIERS = ['Easy', 'Medium', 'Hard', 'Expert'];

function getTierForLevel(levelNum) {
  return TIERS[(levelNum - 1) % 4];
}

const TIER_COLORS = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  Hard: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Expert: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

function StarRating({ stars = 0 }) {
  return (
    <div className="flex gap-0.5 justify-center mt-1">
      {[1, 2, 3].map(s => (
        <Star
          key={s}
          size={10}
          className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-700 fill-slate-800'}
        />
      ))}
    </div>
  );
}

export default function LevelModal({
  isOpen,
  onClose,
  onSelectLevel,
  currentLevelNumber = 1,
  maxUnlockedLevel = 1,
  progress = {},
}) {
  if (!isOpen) return null;

  const displayCount = Math.max(20, Math.ceil((maxUnlockedLevel + 3) / 4) * 4);
  const levelNumbers = Array.from({ length: displayCount }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1129] border border-white/10 rounded-3xl w-full max-w-sm max-h-[82vh] flex flex-col shadow-2xl overflow-hidden animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-base">Campaign Levels</h2>
            <p className="text-slate-400 text-xs font-semibold mt-0.5">
              {maxUnlockedLevel} of {displayCount} Levels Unlocked
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Level Grid */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
          <div className="grid grid-cols-4 gap-2.5">
            {levelNumbers.map(num => {
              const isUnlocked = num <= maxUnlockedLevel;
              const isCurrent = num === currentLevelNumber;
              const levelProgress = progress[num] || {};
              const stars = levelProgress.stars || 0;
              const bestTime = levelProgress.bestTime || null;
              const tier = getTierForLevel(num);

              return (
                <button
                  key={num}
                  onClick={() => isUnlocked && onSelectLevel(num)}
                  disabled={!isUnlocked}
                  className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl border transition-all min-h-[92px] ${
                    isCurrent
                      ? 'bg-cyan-500/15 border-cyan-400/60 ring-2 ring-cyan-400/20 text-cyan-300 shadow-md shadow-cyan-500/15'
                      : isUnlocked
                        ? 'bg-white/[0.06] border-white/[0.08] text-white hover:border-cyan-400/30 hover:bg-white/10 cursor-pointer active:scale-95'
                        : 'bg-white/[0.02] border-white/[0.04] text-slate-700 cursor-not-allowed'
                  }`}
                >
                  {/* Top Badge: Tier or Lock */}
                  <div className="w-full flex items-center justify-between">
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded-full border ${isUnlocked ? TIER_COLORS[tier] : 'text-slate-700 border-transparent'}`}>
                      {tier[0]}
                    </span>
                    {!isUnlocked && (
                      <Lock size={11} className="text-slate-700" />
                    )}
                    {isCurrent && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    )}
                  </div>

                  {/* Level Number */}
                  <span className={`text-base font-black ${!isUnlocked ? 'text-slate-700' : 'text-white'}`}>
                    {num}
                  </span>

                  {/* Bottom: Stars & Best Time */}
                  <div className="w-full flex flex-col items-center">
                    {isUnlocked ? (
                      <>
                        <StarRating stars={stars} />
                        {bestTime ? (
                          <span className="text-[8px] font-mono text-slate-400 mt-1 flex items-center gap-0.5">
                            <Clock size={8} /> {bestTime}s
                          </span>
                        ) : (
                          <span className="text-[8px] text-slate-600 mt-1">—</span>
                        )}
                      </>
                    ) : (
                      <span className="text-[8px] text-slate-800 mt-1 font-bold">Locked</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
