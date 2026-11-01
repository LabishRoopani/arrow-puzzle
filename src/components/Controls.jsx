/**
 * Controls.jsx — Gameplay Control Bar
 * Action bar: Undo, Reset, Rule-Based Hint (1 Free + 2 Ad-rewarded), Level Select, Sound.
 * (AI Auto-Solve completely removed)
 */

import { RotateCcw, Undo2, Lightbulb, LayoutGrid, Volume2, VolumeX, Film } from 'lucide-react';

function ControlBtn({ icon: Icon, label, badge, onClick, variant = 'default', disabled = false }) {
  const base = 'relative flex flex-col items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed';
  const styles = {
    default: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600',
    accent:  'bg-blue-600 hover:bg-blue-500 text-white border border-blue-500',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white border border-amber-500',
    danger:  'bg-red-700   hover:bg-red-600   text-white border border-red-600',
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]}`} title={label}>
      {badge && (
        <span className="absolute -top-1.5 -right-1 px-1.5 py-0.2 bg-emerald-500 text-[9px] font-black text-slate-950 rounded-full shadow">
          {badge}
        </span>
      )}
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </button>
  );
}

export default function Controls({
  onUndo,
  onReset,
  onHint,
  onLevelSelect,
  soundEnabled = true,
  onToggleSound,
  moveCount = 0,
  hintsUsed = 0,
}) {
  let hintLabel = 'Hint (Free)';
  let hintBadge = '1 Free';
  let hintIcon = Lightbulb;
  let hintDisabled = false;

  if (hintsUsed === 1) {
    hintLabel = 'Hint #2';
    hintBadge = 'Watch Ad';
    hintIcon = Film;
  } else if (hintsUsed === 2) {
    hintLabel = 'Hint #3';
    hintBadge = 'Watch Ad';
    hintIcon = Film;
  } else if (hintsUsed >= 3) {
    hintLabel = 'Hints (0)';
    hintBadge = null;
    hintDisabled = true;
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Move & Hint Status Bar */}
      <div className="flex items-center gap-4 text-xs">
        <p className="text-slate-400">
          Moves: <span className="text-blue-400 font-bold text-sm">{moveCount}</span>
        </p>
        <span className="text-slate-600">•</span>
        <p className="text-slate-400">
          Hints Left: <span className="text-amber-400 font-bold text-sm">{Math.max(0, 3 - hintsUsed)}/3</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-2.5">
        <ControlBtn icon={Undo2}      label="Undo"   onClick={onUndo} />
        <ControlBtn icon={RotateCcw}  label="Reset"  onClick={onReset} variant="danger" />
        <ControlBtn
          icon={hintIcon}
          label={hintLabel}
          badge={hintBadge}
          onClick={onHint}
          variant="warning"
          disabled={hintDisabled}
        />
        <ControlBtn icon={LayoutGrid} label="Levels" onClick={onLevelSelect} />
        <ControlBtn
          icon={soundEnabled ? Volume2 : VolumeX}
          label={soundEnabled ? 'Sound' : 'Muted'}
          onClick={onToggleSound}
        />
      </div>
    </div>
  );
}
