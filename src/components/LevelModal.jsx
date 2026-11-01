/**
 * LevelModal.jsx — Level Selection Overlay
 * Clean mobile UI for selecting unlocked campaign levels with star ratings and tiers.
 */

import { X, Star, Lock, Play } from 'lucide-react';

const TIERS = ['Easy', 'Medium', 'Hard', 'Expert'];

function getTierForLevel(levelNum) {
  return TIERS[(levelNum - 1) % 4];
}

const TIER_BADGES = {
  Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-blue-50 text-blue-700 border-blue-200',
  Hard: 'bg-amber-50 text-amber-700 border-amber-200',
  Expert: 'bg-rose-50 text-rose-700 border-rose-200',
};

function StarRating({ stars = 0 }) {
  return (
    <div className="flex gap-0.5 justify-center mt-0.5">
      {[1, 2, 3].map(s => (
        <Star
          key={s}
          size={9}
          className={s <= stars ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}
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

  const displayCount = Math.max(24, Math.ceil((maxUnlockedLevel + 4) / 4) * 4);
  const levelNumbers = Array.from({ length: displayCount }, (_, i) => i + 1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-sm max-h-[82vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-slate-800 font-black text-lg">Level Selection</h2>
            <p className="text-slate-400 text-xs mt-0.5">
              Current: Level {currentLevelNumber} ({getTierForLevel(currentLevelNumber)})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tier Legend */}
        <div className="flex items-center justify-around py-2 px-4 bg-slate-50 border-b border-slate-100 text-[10px] font-bold">
          <span className="text-emerald-600">1. Easy</span>
          <span className="text-slate-300">→</span>
          <span className="text-blue-600">2. Medium</span>
          <span className="text-slate-300">→</span>
          <span className="text-amber-600">3. Hard</span>
          <span className="text-slate-300">→</span>
          <span className="text-rose-600">4. Expert</span>
        </div>

        {/* Level Grid */}
        <div className="overflow-y-auto flex-1 p-4 grid grid-cols-4 gap-2.5">
          {levelNumbers.map((num) => {
            const unlocked = num <= maxUnlockedLevel;
            const isActive = num === currentLevelNumber;
            const tier = getTierForLevel(num);
            const levelData = progress[num];
            const isDone = !!levelData;
            const stars = levelData?.stars ?? 0;

            return (
              <button
                key={num}
                onClick={() => {
                  if (unlocked) {
                    onSelectLevel(num);
                    onClose();
                  }
                }}
                disabled={!unlocked}
                className={[
                  'relative flex flex-col items-center justify-center rounded-2xl p-2.5',
                  'border transition-all duration-150 select-none cursor-pointer',
                  unlocked
                    ? isActive
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/50 scale-102 shadow-md shadow-blue-500/10'
                      : isDone
                        ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200/50 cursor-not-allowed opacity-40',
                ].join(' ')}
              >
                {!unlocked ? (
                  <Lock size={12} className="text-slate-400 mb-1" />
                ) : isActive ? (
                  <Play size={12} className="text-blue-600 mb-1 fill-current" />
                ) : (
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border mb-0.5 ${TIER_BADGES[tier]}`}>
                    {tier}
                  </span>
                )}

                <span className={`font-black text-sm ${
                  isActive ? 'text-blue-600' : isDone ? 'text-slate-800' : 'text-slate-600'
                }`}>
                  {num}
                </span>

                {isDone ? (
                  <StarRating stars={stars} />
                ) : (
                  <span className="text-slate-400 text-[9px] mt-0.5 font-medium">
                    {unlocked ? tier : 'Locked'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-slate-400 text-xs font-semibold">
            {Object.keys(progress).length} Levels Completed
          </p>
        </div>

      </div>
    </div>
  );
}
