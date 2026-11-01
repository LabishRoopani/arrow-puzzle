/**
 * SnakeBoard.jsx — 1:1 Gameplay Canvas & Interaction (Screenshots 4 & 5)
 * Renders non-overlapping, clean snake arrows on an exact-aligned dot grid.
 * Includes: Undo, Reset, Rule-Based Hint (Ad), Trajectory Ruler, Pause, Hearts, Move & Timer.
 */

import { useState } from 'react';
import {
  ChevronLeft,
  Settings,
  Pause,
  Heart,
  Lightbulb,
  Ruler,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';
import { checkRaycastCollision, DIR_DELTA } from '../engine/snakeEngine.js';

export default function SnakeBoard({
  levelNumber = 1,
  tier = 'Easy',
  levelData,
  onBackToHome,
  onArrowCleared,
  onArrowBlocked,
  hearts = 3,
  hintsUsed = 0,
  onHintClick,
  hintArrowId = null,
  onOpenSettings,
  onOpenPause,
  moveCount = 0,
  elapsedSeconds = 0,
  onUndo,
  canUndo = false,
  onReset,
}) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [blockedFeedback, setBlockedFeedback] = useState(null); // { arrowId, hitPoint, direction }
  const [exitingArrowId, setExitingArrowId] = useState(null);

  if (!levelData || !levelData.arrows) return null;

  const { width = 11, height = 15, arrows = [] } = levelData;

  // Exact cell sizing so dots and arrow coordinates match perfectly
  const cellSize = 26;
  const padding = 24;
  const svgWidth = width * cellSize + padding * 2;
  const svgHeight = height * cellSize + padding * 2;

  // Build integer dot coordinates for exact grid alignment (Screenshot 4)
  const gridDots = [];
  for (let x = 1; x < width; x++) {
    for (let y = 1; y < height; y++) {
      gridDots.push({ x, y });
    }
  }

  // Arrow click handler
  const handleArrowTap = (arrow) => {
    if (exitingArrowId) return;

    // Check collision with all other active arrows
    let collision = null;
    let minDistance = Infinity;

    for (const other of arrows) {
      if (other.id === arrow.id) continue;
      const res = checkRaycastCollision(arrow, other, width, height);
      if (res.hit && res.distance < minDistance) {
        minDistance = res.distance;
        collision = {
          blockedBy: other,
          hitPoint: res.hitPoint,
          distance: res.distance,
        };
      }
    }

    if (collision) {
      // BLOCKED! Turn arrow RED and draw projection line (Screenshot 4 & 5)
      setBlockedFeedback({
        arrowId: arrow.id,
        hitPoint: collision.hitPoint,
        head: arrow.points[arrow.points.length - 1],
        direction: arrow.direction,
      });

      if (onArrowBlocked) onArrowBlocked(arrow);

      setTimeout(() => {
        setBlockedFeedback(null);
      }, 550);
    } else {
      // CLEAR! Smooth glide exit
      setExitingArrowId(arrow.id);
      setTimeout(() => {
        setExitingArrowId(null);
        if (onArrowCleared) onArrowCleared(arrow.id);
      }, 320);
    }
  };

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="min-h-dvh flex flex-col justify-between bg-white text-slate-800 max-w-md mx-auto w-full relative shadow-xl overflow-hidden select-none">
      
      {/* ── Top Bar: Back, Level Name, Pause & Settings (Screenshot 4) ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1 border-b border-slate-100">
        <button
          onClick={onBackToHome}
          className="p-2 rounded-full hover:bg-slate-100 text-blue-600 transition cursor-pointer"
          aria-label="Back to Dashboard"
          title="Back to Dashboard"
        >
          <ChevronLeft size={28} strokeWidth={2.5} />
        </button>

        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Level {levelNumber}
        </h2>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenPause}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition cursor-pointer"
            aria-label="Pause Game"
            title="Pause Game"
          >
            <Pause size={21} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={21} />
          </button>
        </div>
      </div>

      {/* ── Sub-Header: Moves, Hearts, Tier & Time (Screenshot 4) ── */}
      <div className="flex items-center justify-between px-5 py-2 bg-slate-50/70 border-b border-slate-100 text-xs font-bold">
        {/* Moves / Remaining arrows count */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1 rounded-xl text-slate-700 shadow-2xs">
          <span className="text-sm">🚀</span>
          <span>{moveCount} moves</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-medium">{arrows.length} left</span>
        </div>

        {/* 3 Hearts System (Screenshot 4: red / grey) */}
        <div className="flex items-center gap-1 bg-white border border-slate-200/80 px-2.5 py-1 rounded-xl shadow-2xs">
          {[1, 2, 3].map(heartIdx => (
            <Heart
              key={heartIdx}
              size={18}
              className={heartIdx <= hearts ? 'text-red-500 fill-red-500' : 'text-slate-300 fill-slate-200'}
            />
          ))}
        </div>

        {/* Tier badge & timer */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 px-2.5 py-1 rounded-xl text-slate-700 shadow-2xs">
          <span className="text-blue-600 font-extrabold">{tier}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 font-mono text-[11px]">{timeStr}</span>
        </div>
      </div>

      {/* ── Main Canvas Board Area with Aligned Dot Grid (Screenshot 4 & 5) ── */}
      <div className="flex-1 flex items-center justify-center p-3 relative overflow-hidden bg-slate-50/30">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full max-h-[66vh] touch-none select-none"
        >
          {/* Aligned Grid Dots (Clean & Subtle) */}
          {gridDots.map(dot => (
            <circle
              key={`dot_${dot.x}_${dot.y}`}
              cx={padding + dot.x * cellSize}
              cy={padding + dot.y * cellSize}
              r={1.3}
              fill="#cbd5e1"
            />
          ))}

          {/* Collision Guideline Line (Red line when blocked - Screenshot 5) */}
          {blockedFeedback && (
            <line
              x1={padding + blockedFeedback.head.x * cellSize}
              y1={padding + blockedFeedback.head.y * cellSize}
              x2={padding + blockedFeedback.hitPoint.x * cellSize}
              y2={padding + blockedFeedback.hitPoint.y * cellSize}
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeDasharray="4 3"
              className="animate-pulse"
            />
          )}

          {/* Trajectory Guide Lines (When Ruler tool is toggled on) */}
          {showGuidelines && arrows.map(arrow => {
            const head = arrow.points[arrow.points.length - 1];
            const { dx, dy } = DIR_DELTA[arrow.direction];
            const endX = head.x + dx * 20;
            const endY = head.y + dy * 20;
            return (
              <line
                key={`guide_${arrow.id}`}
                x1={padding + head.x * cellSize}
                y1={padding + head.y * cellSize}
                x2={padding + endX * cellSize}
                y2={padding + endY * cellSize}
                stroke="#93c5fd"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.5}
              />
            );
          })}

          {/* Render All Distinct Snake Arrows */}
          {arrows.map(arrow => {
            const isBlocked = blockedFeedback && blockedFeedback.arrowId === arrow.id;
            const isHint = hintArrowId === arrow.id;
            const isExiting = exitingArrowId === arrow.id;

            // Generate clean smooth polyline path
            const pathData = arrow.points.reduce((acc, pt, idx) => {
              const px = padding + pt.x * cellSize;
              const py = padding + pt.y * cellSize;
              return `${acc} ${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
            }, '');

            // Arrowhead tip calculation
            const head = arrow.points[arrow.points.length - 1];
            const hx = padding + head.x * cellSize;
            const hy = padding + head.y * cellSize;
            const headSize = 9;
            const dir = arrow.direction;

            let tipPoints = '';
            if (dir === 'RIGHT') {
              tipPoints = `${hx},${hy - headSize} ${hx + headSize * 1.3},${hy} ${hx},${hy + headSize}`;
            } else if (dir === 'LEFT') {
              tipPoints = `${hx},${hy - headSize} ${hx - headSize * 1.3},${hy} ${hx},${hy + headSize}`;
            } else if (dir === 'DOWN') {
              tipPoints = `${hx - headSize},${hy} ${hx},${hy + headSize * 1.3} ${hx + headSize},${hy}`;
            } else if (dir === 'UP') {
              tipPoints = `${hx - headSize},${hy} ${hx},${hy - headSize * 1.3} ${hx + headSize},${hy}`;
            }

            // Colors matching screenshot:
            // Default: Dark slate navy (#0f172a)
            // Blocked: Red (#ef4444)
            // Hint: Yellow glowing (#eab308)
            const strokeColor = isBlocked ? '#ef4444' : isHint ? '#eab308' : '#0f172a';

            // Exit flight translation vector
            const { dx, dy } = DIR_DELTA[dir];
            const exitTransform = isExiting
              ? `translate(${dx * 350}px, ${dy * 350}px)`
              : 'translate(0, 0)';

            return (
              <g
                key={arrow.id}
                onClick={() => handleArrowTap(arrow)}
                className={`cursor-pointer transition-all duration-300 ${
                  isBlocked ? 'animate-shake-block' : ''
                } ${isHint ? 'animate-hint-glow' : ''}`}
                style={{
                  transform: exitTransform,
                  opacity: isExiting ? 0 : 1,
                  transition: isExiting ? 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 250ms' : 'none',
                }}
              >
                {/* Thick Invisible Hit Target for Easy Touch on Mobile */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={28}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Crisp Arrow Body Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={4.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Sharp Pointing Arrowhead */}
                <polygon
                  points={tipPoints}
                  fill={strokeColor}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Bottom Controls: Undo, Hint (Ad), Ruler, Reset ── */}
      <div className="flex items-center justify-around px-6 py-4 bg-white border-t border-slate-100">
        
        {/* Undo Button */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex flex-col items-center gap-1 transition ${
            canUndo ? 'text-slate-700 hover:text-blue-600 active:scale-95 cursor-pointer' : 'text-slate-300 cursor-not-allowed opacity-50'
          }`}
          title="Undo last move"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shadow-xs">
            <RotateCcw size={21} />
          </div>
          <span className="text-[10px] font-bold">Undo</span>
        </button>

        {/* Hint Tool (Lightbulb with blue 'Ad' badge - Screenshot 4) */}
        <button
          onClick={onHintClick}
          className="relative flex flex-col items-center gap-1 active:scale-95 transition cursor-pointer"
          title={hintsUsed === 0 ? 'Free Hint' : 'Watch Ad for Hint'}
        >
          <div className="relative w-14 h-14 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-500 shadow-md shadow-amber-500/20">
            {hintsUsed >= 1 && (
              <span className="absolute -top-1.5 -right-1 bg-blue-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-xs">
                Ad
              </span>
            )}
            <Lightbulb size={26} className="fill-amber-400" />
          </div>
          <span className="text-[10px] font-bold text-amber-600">
            {hintsUsed === 0 ? 'Free Hint' : 'Ad Hint'}
          </span>
        </button>

        {/* Guideline / Ruler Tool (Screenshot 4) */}
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className={`flex flex-col items-center gap-1 active:scale-95 transition cursor-pointer ${
            showGuidelines ? 'text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
          }`}
          title="Toggle trajectory lines"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${
            showGuidelines ? 'bg-indigo-100 ring-2 ring-indigo-500/50 text-indigo-600' : 'bg-slate-100'
          }`}>
            <Ruler size={21} className={showGuidelines ? 'rotate-45 transition-transform' : ''} />
          </div>
          <span className="text-[10px] font-bold">Guides</span>
        </button>

        {/* Reset / Restart Button */}
        <button
          onClick={onReset}
          className="flex flex-col items-center gap-1 text-slate-700 hover:text-rose-600 active:scale-95 transition cursor-pointer"
          title="Restart level"
        >
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shadow-xs">
            <RefreshCw size={20} />
          </div>
          <span className="text-[10px] font-bold">Reset</span>
        </button>

      </div>

    </div>
  );
}
