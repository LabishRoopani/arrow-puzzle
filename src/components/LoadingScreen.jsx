/**
 * LoadingScreen.jsx — Step 1: Splash Screen
 * Features the official Arrow Puzzle logo (from Screenshot 1)
 * and the vibrant rotating green arc spinner (from Screenshot 3).
 */

export default function LoadingScreen({ message = 'Loading Arrow Puzzle...' }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white text-slate-800 animate-fade-in select-none">
      
      {/* Official App Logo Icon (Screenshot 1) */}
      <div className="w-24 h-24 rounded-3xl bg-white shadow-2xl border border-slate-100 p-2.5 mb-6 flex items-center justify-center relative">
        <img
          src="/icon.svg"
          alt="Arrow Puzzle Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* App Branding */}
      <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-4">
        Arrow Puzzle
      </h1>

      {/* Rotating Green Arc Spinner (Screenshot 3) */}
      <div className="relative w-14 h-14 flex items-center justify-center mb-3">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full animate-spin"
          style={{ animationDuration: '0.85s' }}
        >
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="8"
          />
          <path
            d="M 50 12 A 38 38 0 0 1 88 50"
            fill="none"
            stroke="#22c55e"
            strokeWidth="9"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-slate-400 text-xs font-semibold tracking-wide">
        {message}
      </p>

    </div>
  );
}
