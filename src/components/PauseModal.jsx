/**
 * PauseModal.jsx — Dark Cosmic Pause Menu
 */

import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

export default function PauseModal({
  isOpen, levelNumber, tier, moveCount, elapsedSeconds = 0,
  onResume, onRestart, onExitToHome, soundEnabled, onToggleSound,
}) {
  if (!isOpen) return null;

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-[#111631] border border-white/10 rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center animate-pop-in">
        
        <h3 className="text-2xl font-black text-white mb-1">Game Paused</h3>
        <p className="text-slate-500 text-xs font-semibold mb-4">Level {levelNumber} • {tier}</p>

        {/* Stats */}
        <div className="flex items-center justify-around w-full bg-white/5 border border-white/[0.08] p-3.5 rounded-2xl mb-6 text-center">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Moves</span>
            <p className="text-lg font-black text-cyan-300">{moveCount}</p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase">Time</span>
            <p className="text-lg font-black text-cyan-300">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-2.5">
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition cursor-pointer border border-cyan-400/20"
          >
            <Play size={16} fill="currentColor" /> Resume
          </button>

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl bg-white/[0.06] border border-white/10 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition cursor-pointer"
          >
            <RotateCcw size={15} /> Restart Level
          </button>

          <button
            onClick={onToggleSound}
            className="w-full py-3 rounded-2xl bg-white/5 border border-white/[0.08] text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-white/[0.08] transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} />}
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>

          <button
            onClick={onExitToHome}
            className="w-full py-3 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-500/[0.12] transition cursor-pointer"
          >
            <Home size={15} /> Quit to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
