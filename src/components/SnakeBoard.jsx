/**
 * SnakeBoard.jsx — Premium 1:1 Gameplay Canvas & Interaction
 * 
 * Features:
 * - Dynamic theme palette (Midnight, Neon, Ocean, Aurora)
 * - Subtle glass container around the grid with ambient glow
 * - Keyboard shortcuts (U=Undo, R=Reset, H=Hint, P/Esc=Pause)
 * - Debounced taps (prevents accidental double clicks)
 * - Directional arrow paths with smooth exit flight & subtle collision shake
 * - Guideline ruler & Rule-based hint pulse
 * - Haptic feedback for mobile devices
 */

import { useState, useEffect, useRef } from 'react';
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
import { getTheme } from '../utils/theme.js';

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
  currentTheme = 'midnight',
  reducedMotion = false,
}) {
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [blockedFeedback, setBlockedFeedback] = useState(null);
  const [exitingArrowId, setExitingArrowId] = useState(null);
  const [hoveredArrowId, setHoveredArrowId] = useState(null);
  const lastTapTimeRef = useRef(0);

  const themeConfig = getTheme(currentTheme);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'u' || e.key === 'U' || (e.ctrlKey && e.key === 'z')) {
        e.preventDefault();
        if (canUndo && onUndo) onUndo();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (onReset) onReset();
      } else if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        if (onHintClick) onHintClick();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        e.preventDefault();
        if (onOpenPause) onOpenPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, onUndo, onReset, onHintClick, onOpenPause]);

  if (!levelData || !levelData.arrows) return null;

  const { width = 11, height = 15, arrows = [] } = levelData;

  const cellSize = 26;
  const padding = 24;
  const svgWidth = width * cellSize + padding * 2;
  const svgHeight = height * cellSize + padding * 2;

  const gridDots = [];
  for (let x = 1; x < width; x++) {
    for (let y = 1; y < height; y++) {
      gridDots.push({ x, y });
    }
  }

  // Arrow click handler with debouncing
  const handleArrowTap = (arrow) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 280) return; // Debounce double tap
    lastTapTimeRef.current = now;

    if (exitingArrowId) return;

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
      if (navigator.vibrate) navigator.vibrate([70, 30, 70]);

      setBlockedFeedback({
        arrowId: arrow.id,
        hitPoint: collision.hitPoint,
        head: arrow.points[arrow.points.length - 1],
        direction: arrow.direction,
      });

      if (onArrowBlocked) onArrowBlocked(arrow);

      setTimeout(() => {
        setBlockedFeedback(null);
      }, 500);
    } else {
      if (navigator.vibrate) navigator.vibrate(30);

      setExitingArrowId(arrow.id);
      setTimeout(() => {
        setExitingArrowId(null);
        if (onArrowCleared) onArrowCleared(arrow.id);
      }, 300);
    }
  };

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className={`min-h-dvh flex flex-col justify-between bg-gradient-to-b ${themeConfig.bgGradient} text-white max-w-md mx-auto w-full relative shadow-2xl overflow-hidden select-none`}>
      
      {/* ── Top Bar ── */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2 bg-black/25 backdrop-blur-xl border-b border-white/[0.08] relative z-10">
        <button
          onClick={onBackToHome}
          className="p-2 rounded-2xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          aria-label="Back to Dashboard"
          title="Back to Dashboard"
        >
          <ChevronLeft size={26} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center">
          <h2 className="text-lg font-black text-white tracking-tight">
            Level {levelNumber}
          </h2>
          <span className={`text-[10px] font-extrabold uppercase tracking-widest ${themeConfig.accentText}`}>
            {tier}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onOpenPause}
            className="p-2 rounded-2xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Pause Game (P)"
            title="Pause Game (P)"
          >
            <Pause size={20} />
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-2xl hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            aria-label="Settings"
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* ── Sub-Header: Moves, Hearts, Time ── */}
      <div className="flex items-center justify-between px-5 py-2 bg-black/15 border-b border-white/[0.06] text-xs font-bold relative z-10">
        {/* Moves & Left */}
        <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-slate-200">
          <span className="text-sm">🚀</span>
          <span>{moveCount} moves</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-medium">{arrows.length} left</span>
        </div>

        {/* 3 Hearts */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl">
          {[1, 2, 3].map(heartIdx => (
            <Heart
              key={heartIdx}
              size={17}
              className={heartIdx <= hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-700 fill-slate-800'}
            />
          ))}
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-xl text-slate-300 font-mono text-[11px]">
          <span>⏱</span>
          <span>{timeStr}</span>
        </div>
      </div>

      {/* ── Board Center with Glass Container ── */}
      <div className="flex-1 flex items-center justify-center p-3 relative overflow-hidden">
        
        {/* Ambient Radial Glow behind the board */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40"
          style={{
            background: `radial-gradient(circle, ${themeConfig.glowColor} 0%, transparent 65%)`,
          }}
        />

        {/* Board Glass Container Frame */}
        <div className={`relative rounded-3xl p-2.5 backdrop-blur-2xl border ${themeConfig.glassBorder} shadow-2xl`}
             style={{ backgroundColor: `${themeConfig.boardBg}cc` }}>
          
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-full max-h-[64vh] touch-none select-none"
          >
            <defs>
              <filter id="collisionGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f43f5e" floodOpacity="0.8" />
              </filter>
              <filter id="arrowGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor={themeConfig.previewColor} floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Grid Dots */}
            {gridDots.map(dot => (
              <circle
                key={`dot_${dot.x}_${dot.y}`}
                cx={padding + dot.x * cellSize}
                cy={padding + dot.y * cellSize}
                r={1.25}
                fill={themeConfig.dotColor}
              />
            ))}

            {/* Collision Guideline Line */}
            {blockedFeedback && (
              <line
                x1={padding + blockedFeedback.head.x * cellSize}
                y1={padding + blockedFeedback.head.y * cellSize}
                x2={padding + blockedFeedback.hitPoint.x * cellSize}
                y2={padding + blockedFeedback.hitPoint.y * cellSize}
                stroke="#f43f5e"
                strokeWidth={2.5}
                strokeDasharray="4 3"
                className="animate-pulse"
                filter="url(#collisionGlow)"
              />
            )}

            {/* Trajectory Guide Lines */}
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
                  stroke={themeConfig.previewColor}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  opacity={0.35}
                />
              );
            })}

            {/* Render Snake Arrows */}
            {arrows.map(arrow => {
              const isBlocked = blockedFeedback && blockedFeedback.arrowId === arrow.id;
              const isHint = hintArrowId === arrow.id;
              const isExiting = exitingArrowId === arrow.id;
              const isHovered = hoveredArrowId === arrow.id;

              const pathData = arrow.points.reduce((acc, pt, idx) => {
                const px = padding + pt.x * cellSize;
                const py = padding + pt.y * cellSize;
                return `${acc} ${idx === 0 ? 'M' : 'L'} ${px} ${py}`;
              }, '');

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

              const strokeColor = isBlocked
                ? themeConfig.arrowBlocked
                : isHint
                  ? themeConfig.arrowHint
                  : isHovered
                    ? '#ffffff'
                    : themeConfig.arrowDefault;

              const { dx, dy } = DIR_DELTA[dir];
              const exitTransform = isExiting
                ? `translate(${dx * 360}px, ${dy * 360}px)`
                : 'translate(0, 0)';

              return (
                <g
                  key={arrow.id}
                  onClick={() => handleArrowTap(arrow)}
                  onMouseEnter={() => setHoveredArrowId(arrow.id)}
                  onMouseLeave={() => setHoveredArrowId(null)}
                  className={`cursor-pointer transition-all ${
                    isBlocked && !reducedMotion ? 'animate-shake-block' : ''
                  } ${isHint ? 'animate-hint-glow' : ''}`}
                  style={{
                    transform: exitTransform,
                    opacity: isExiting ? 0 : 1,
                    transition: isExiting ? 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms' : 'none',
                  }}
                >
                  {/* Invisible Hit Area for Easy Touch on Mobile */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="transparent"
                    strokeWidth={28}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Outer Glow Line on Hover / Hint */}
                  {(isHint || isHovered) && (
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={8}
                      opacity={0.35}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  )}

                  {/* Crisp Arrow Body Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={4.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter={isHint ? 'url(#arrowGlow)' : undefined}
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
      </div>

      {/* ── Bottom Controls: Undo, Hint, Ruler, Reset ── */}
      <div className="flex items-center justify-around px-6 py-3.5 bg-black/30 backdrop-blur-xl border-t border-white/[0.08] relative z-10">
        
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`flex flex-col items-center gap-1 transition ${
            canUndo ? 'text-slate-300 hover:text-white active:scale-95 cursor-pointer' : 'text-slate-600 cursor-not-allowed opacity-30'
          }`}
          title="Undo last move (U)"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center">
            <RotateCcw size={20} />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Undo</span>
        </button>

        {/* Hint Tool (Lightbulb) */}
        <button
          onClick={onHintClick}
          className="relative flex flex-col items-center gap-1 active:scale-95 transition cursor-pointer"
          title={hintsUsed === 0 ? 'Free Rule-Based Hint (H)' : 'Watch Ad for Hint (H)'}
        >
          <div className="relative w-14 h-14 rounded-2xl bg-amber-500/[0.15] border-2 border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            {hintsUsed >= 1 && (
              <span className="absolute -top-1.5 -right-1 bg-cyan-500 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-xs">
                Ad
              </span>
            )}
            <Lightbulb size={26} className="fill-amber-400" />
          </div>
          <span className="text-[10px] font-bold text-amber-400">
            {hintsUsed === 0 ? 'Free Hint' : 'Ad Hint'}
          </span>
        </button>

        {/* Guideline / Ruler Tool */}
        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className={`flex flex-col items-center gap-1 active:scale-95 transition cursor-pointer ${
            showGuidelines ? 'text-cyan-400' : 'text-slate-300 hover:text-white'
          }`}
          title="Toggle trajectory guidelines"
        >
          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${
            showGuidelines
              ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-md shadow-cyan-500/20'
              : 'bg-white/[0.07] border-white/10'
          }`}>
            <Ruler size={20} className={showGuidelines ? 'rotate-45 transition-transform' : ''} />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Guides</span>
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex flex-col items-center gap-1 text-slate-300 hover:text-rose-400 active:scale-95 transition cursor-pointer"
          title="Restart level (R)"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.07] border border-white/10 flex items-center justify-center">
            <RefreshCw size={19} />
          </div>
          <span className="text-[10px] font-bold text-slate-400">Reset</span>
        </button>

      </div>

    </div>
  );
}
