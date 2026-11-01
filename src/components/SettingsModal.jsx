/**
 * SettingsModal.jsx — In-game Settings
 */

import { X, Volume2, VolumeX, Download, RotateCcw } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  onRestartLevel,
}) {
  if (!isOpen) return null;

  const handleInstallApp = async () => {
    if (window.installPromptEvent) {
      window.installPromptEvent.prompt();
      const choice = await window.installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        window.installPromptEvent = null;
      }
    } else {
      alert('To install this app on your phone:\n\n1. Open Chrome/Safari on your mobile\n2. Tap Browser Menu (⋮ or Share)\n3. Tap "Add to Home Screen" or "Install App"!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl flex flex-col gap-4" onClick={e => e.stopPropagation()}>
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-800 text-lg">Settings</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Audio */}
          <button
            onClick={onToggleSound}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-800 font-bold text-sm">
              {soundEnabled ? <Volume2 size={20} className="text-blue-600" /> : <VolumeX size={20} className="text-slate-400" />}
              <span>Sound Effects</span>
            </div>
            <span className="text-xs font-semibold text-slate-500">{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              onRestartLevel();
              onClose();
            }}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-800 font-bold text-sm">
              <RotateCcw size={18} className="text-amber-500" />
              <span>Restart Level</span>
            </div>
          </button>

          {/* Install Mobile App */}
          <button
            onClick={handleInstallApp}
            className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 text-blue-700 font-bold text-sm transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download size={18} />
              <span>Install to Phone</span>
            </div>
            <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full">App</span>
          </button>
        </div>

      </div>
    </div>
  );
}

