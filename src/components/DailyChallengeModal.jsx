/**
 * DailyChallengeModal.jsx — Daily Challenge Preview & Streak Tracker
 */

import { X, Calendar, Flame, Trophy, Play, CheckCircle2 } from 'lucide-react';

export default function DailyChallengeModal({
  isOpen,
  onClose,
  onPlayDaily,
  streak = 0,
  isCompletedToday = false,
}) {
  if (!isOpen) return null;

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1129] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-800 p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 transition cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md mx-auto mb-2 flex items-center justify-center shadow-inner">
            <Calendar size={28} />
          </div>

          <h3 className="text-xl font-black">Daily Challenge</h3>
          <p className="text-xs font-semibold text-blue-200 opacity-90 mt-0.5">{today}</p>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          
          {/* Streak Card */}
          <div className="glass-card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-orange-500/20 border border-orange-400/30 flex items-center justify-center text-orange-400">
                <Flame size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Current Streak
                </span>
                <span className="text-xl font-black text-white">{streak} Days 🔥</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Streak Bonus</span>
              <span className="text-xs font-black text-amber-400">+{streak * 50} XP</span>
            </div>
          </div>

          {/* Rewards Pill */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-slate-400 text-[10px] block font-semibold mb-0.5">Completion Reward</span>
              <span className="text-amber-400 font-black text-sm">⭐ +3 Stars</span>
            </div>
            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
              <span className="text-slate-400 text-[10px] block font-semibold mb-0.5">Bonus XP</span>
              <span className="text-cyan-400 font-black text-sm">⚡ +250 XP</span>
            </div>
          </div>

          {/* Action Button */}
          {isCompletedToday ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-2 font-bold text-xs">
              <CheckCircle2 size={16} />
              <span>Today's Challenge Solved! Come back tomorrow</span>
            </div>
          ) : (
            <button
              onClick={() => {
                onClose();
                onPlayDaily();
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 active:scale-98 text-white font-extrabold text-sm shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition cursor-pointer border border-blue-400/30"
            >
              <Play size={18} fill="currentColor" />
              <span>Start Daily Challenge</span>
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
