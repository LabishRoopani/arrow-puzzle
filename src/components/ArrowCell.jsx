/**
 * ArrowCell.jsx — Member 1: UI Component
 * Individual arrow tile with rotation, shake (blocked), and fly-out (exit) animations.
 *
 * Props:
 *  - direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
 *  - onClick: () => void
 *  - animState: 'idle' | 'shake' | 'fly'
 *  - isHint: boolean — highlight this cell as the next best move
 */

import { ArrowUp } from 'lucide-react';
import { ROTATION } from '../engine/gameRules.js';

const FLY_CLASS = {
  UP:    'animate-fly-up',
  DOWN:  'animate-fly-down',
  LEFT:  'animate-fly-left',
  RIGHT: 'animate-fly-right',
};

export default function ArrowCell({ direction, onClick, animState = 'idle', isHint = false }) {
  const rotation  = ROTATION[direction];
  const flyClass  = animState === 'fly'   ? FLY_CLASS[direction] : '';
  const shakeClass = animState === 'shake' ? 'animate-shake'      : '';
  const hintClass  = isHint               ? 'animate-hint-pulse ring-2 ring-yellow-400' : '';

  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center justify-center rounded-xl',
        'bg-slate-700 hover:bg-slate-600 active:scale-95',
        'border border-slate-600 hover:border-indigo-400',
        'transition-colors duration-150 cursor-pointer select-none',
        'w-full h-full',
        flyClass, shakeClass, hintClass,
      ].join(' ')}
      style={{ '--arrow-rotate': `${rotation}deg` }}
      aria-label={`Arrow pointing ${direction}`}
    >
      <ArrowUp
        size={28}
        strokeWidth={2.5}
        className="text-indigo-300 pointer-events-none"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s' }}
      />
    </button>
  );
}
