/**
 * AchievementToast.jsx — Animated banner notification when an achievement unlocks
 */

import { Trophy, Sparkles } from 'lucide-react';

export default function AchievementToast({ achievement, onDismiss }) {
  if (!achievement) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm animate-pop-in select-none">
      <div
        onClick={onDismiss}
        className="glass-card-strong p-3.5 rounded-2xl border border-amber-400/40 shadow-2xl flex items-center gap-3.5 bg-gradient-to-r from-amber-500/20 via-slate-900/90 to-purple-500/20 cursor-pointer backdrop-blur-xl"
        style={{
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.35), inset 0 0 15px rgba(245, 158, 11, 0.1)',
        }}
      >
        <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-2xl shrink-0">
          {achievement.icon || '🏆'}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase">
            <Sparkles size={11} />
            <span>Achievement Unlocked!</span>
          </div>
          <h4 className="font-black text-white text-sm truncate">{achievement.title}</h4>
          <p className="text-[11px] text-slate-300 truncate">{achievement.description}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[11px] font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/30">
            +{achievement.xpReward} XP
          </span>
        </div>
      </div>
    </div>
  );
}
