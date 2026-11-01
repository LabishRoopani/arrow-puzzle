/**
 * PauseModal.jsx — In-Game Pause Menu
 * Lets player pause game, view level objectives, resume, restart, or exit to dashboard.
 */

import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';

export default function PauseModal({
  isOpen,
  levelNumber,
  tier,
  moveCount,
  elapsedSeconds = 0,
  onResume,
  onRestart,
  onExitToHome,
  soundEnabled,
  onToggleSound,
}) {
  if (!isOpen) return null;

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col items-center">
        
        <h3 className="text-2xl font-black text-slate-800 mb-1">Game Paused</h3>
        <p className="text-slate-400 text-xs font-semibold mb-4">Level {levelNumber} • {tier}</p>

        {/* Stats Pill */}
        <div className="flex items-center justify-around w-full bg-slate-50 border border-slate-100 p-3 rounded-2xl mb-6 text-center">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Moves</span>
            <p className="text-lg font-black text-slate-700">{moveCount}</p>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Time</span>
            <p className="text-lg font-black text-slate-700">
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Menu Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Resume */}
          <button
            onClick={onResume}
            className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition cursor-pointer"
          >
            <Play size={16} fill="currentColor" />
            Resume
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <RotateCcw size={15} />
            Restart Level
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="w-full py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200/80 transition cursor-pointer"
          >
            {soundEnabled ? <Volume2 size={16} className="text-emerald-600" /> : <VolumeX size={16} className="text-slate-400" />}
            Sound: {soundEnabled ? 'Enabled' : 'Muted'}
          </button>

          {/* Main Menu */}
          <button
            onClick={onExitToHome}
            className="w-full py-2.5 rounded-full text-slate-400 hover:text-slate-600 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer mt-1"
          >
            <Home size={15} />
            Quit to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}

