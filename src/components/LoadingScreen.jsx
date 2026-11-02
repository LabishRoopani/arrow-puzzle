/**
 * LoadingScreen.jsx — Dark Cosmic Splash Screen
 */

export default function LoadingScreen({ message = 'Loading Arrow Puzzle...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080c18] animate-fade-in select-none">
      
      {/* Ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-64 rounded-full bg-cyan-500/5 blur-3xl" />
      </div>

      {/* Logo */}
      <div className="w-24 h-24 rounded-3xl glass-card-strong p-3 mb-6 flex items-center justify-center relative neon-glow-cyan animate-float">
        <img src="/icon.svg" alt="Arrow Puzzle Logo" className="w-full h-full object-contain" />
      </div>

      {/* Title */}
      <h1 className="text-3xl font-black tracking-tight mb-5 neon-text-cyan relative z-10">
        Arrow Puzzle
      </h1>

      {/* Spinner */}
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '0.85s' }}>
          <circle cx="50" cy="50" r="38" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <path d="M 50 12 A 38 38 0 0 1 88 50" fill="none" stroke="#06b6d4" strokeWidth="8" strokeLinecap="round" />
        </svg>
      </div>

      <p className="text-slate-500 text-xs font-semibold tracking-wide relative z-10">
        {message}
      </p>
    </div>
  );
}
