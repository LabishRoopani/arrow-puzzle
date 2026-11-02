/**
 * AchievementsModal.jsx — Showcase for Player Achievements
 */

import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../utils/achievements.js';

export default function AchievementsModal({
  isOpen,
  onClose,
  unlockedIds = [],
}) {
  if (!isOpen) return null;

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

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
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Trophy size={18} />
            </div>
            <div>
              <h3 className="text-white font-black text-base">Achievements</h3>
              <p className="text-slate-400 text-xs font-semibold">
                {unlockedCount} of {totalCount} Unlocked ({progressPercent}%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-5 pt-3 pb-1">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 scrollbar-thin">
          {ACHIEVEMENTS.map(ach => {
            const isUnlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 ${
                  isUnlocked
                    ? 'bg-amber-500/[0.08] border-amber-400/30 shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.05] opacity-55'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-amber-500/20 border border-amber-400/40'
                      : 'bg-white/5 border border-white/10 grayscale'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-white text-xs truncate">{ach.title}</h4>
                    {isUnlocked ? (
                      <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    ) : (
                      <Lock size={12} className="text-slate-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{ach.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      isUnlocked
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-400/30'
                        : 'bg-white/5 text-slate-500 border border-white/10'
                    }`}
                  >
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
