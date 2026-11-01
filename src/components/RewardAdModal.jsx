/**
 * RewardAdModal.jsx — Interactive Rewarded Ad Simulation
 * Gives 2nd & 3rd hints after watching a short 4-second simulated ad.
 */

import { useState, useEffect } from 'react';
import { Play, Sparkles, CheckCircle2, Film, X } from 'lucide-react';

export default function RewardAdModal({ isOpen, onClose, onRewardClaimed, hintNumber }) {
  const [countdown, setCountdown] = useState(4);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(4);
      setIsCompleted(false);
      return;
    }

    setCountdown(4);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded tracking-wide uppercase">
              Ad
            </span>
            <span className="text-slate-300 text-xs font-semibold">
              Rewarded Sponsor • Hint #{hintNumber}
            </span>
          </div>

          {isCompleted && (
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Video Canvas Simulation Area */}
        <div className="relative aspect-video bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden border-b border-slate-800">
          
          {/* Animated Glow Rings */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <div className="w-48 h-48 rounded-full bg-indigo-500 animate-ping" />
          </div>

          {!isCompleted ? (
            <div className="flex flex-col items-center gap-3 z-10">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
                <Film size={28} className="animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-slate-200 font-bold text-sm">Arrow Puzzle Master Pro</span>
                <span className="text-slate-400 text-xs mt-0.5">Brain Teasers & Logic Simulator</span>
              </div>
              <div className="mt-2 bg-slate-800/80 border border-indigo-500/30 px-3 py-1 rounded-full text-indigo-300 text-xs font-bold tabular-nums">
                Reward in {countdown}s
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 z-10 animate-pop-in">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={32} />
              </div>
              <span className="text-emerald-300 font-bold text-base">Ad Finished!</span>
              <span className="text-slate-300 text-xs">Your free hint is ready to claim</span>
            </div>
          )}
        </div>

        {/* Action Button Section */}
        <div className="p-4 bg-slate-900/90 flex flex-col gap-2">
          {!isCompleted ? (
            <button
              disabled
              className="w-full py-3 rounded-xl bg-slate-800 text-slate-500 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700/60 cursor-not-allowed"
            >
              <Play size={14} className="fill-current" />
              Watching Ad... ({countdown}s)
            </button>
          ) : (
            <button
              onClick={() => {
                onRewardClaimed();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Sparkles size={16} />
              Claim Hint #{hintNumber}
            </button>
          )}

          <p className="text-slate-500 text-[11px] text-center">
            {hintNumber === 2 ? '1 more hint available after this ad' : 'Final hint for this level'}
          </p>
        </div>

      </div>
    </div>
  );
}

