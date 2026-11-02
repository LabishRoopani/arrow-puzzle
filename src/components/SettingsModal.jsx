/**
 * SettingsModal.jsx — Complete Personalization & Game Settings
 * 
 * Features:
 * - 4 Themes: Midnight, Neon, Ocean, Aurora
 * - Background Music (BGM) toggle
 * - Sound Effects toggle
 * - Reduced Motion (Accessibility)
 * - Reset All Progress with Safety Confirmation
 * - Install Mobile App (PWA)
 */

import { X, Volume2, VolumeX, Music, Download, RotateCcw, Palette, Eye } from 'lucide-react';
import { THEMES } from '../utils/theme.js';

export default function SettingsModal({
  isOpen,
  onClose,
  soundEnabled,
  onToggleSound,
  bgmEnabled,
  onToggleBgm,
  currentTheme = 'midnight',
  onSelectTheme,
  reducedMotion = false,
  onToggleReducedMotion,
  onOpenResetConfirm,
}) {
  if (!isOpen) return null;

  const handleInstallApp = async () => {
    if (window.installPromptEvent) {
      window.installPromptEvent.prompt();
      const choice = await window.installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') window.installPromptEvent = null;
    } else {
      alert('To install on your mobile:\n\n1. Open in Chrome / Safari on mobile\n2. Tap Browser Menu (⋮ or Share)\n3. Tap "Add to Home Screen"!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1129] border border-white/10 rounded-3xl p-5 max-w-sm w-full max-h-[85vh] shadow-2xl flex flex-col gap-4 overflow-y-auto scrollbar-thin animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-white text-base">Game Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Theme Selection ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette size={13} className="text-cyan-400" /> Visual Theme
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(THEMES).map(t => {
              const isSelected = currentTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onSelectTheme(t.id)}
                  className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white/10 border-cyan-400 shadow-md ring-1 ring-cyan-400/30'
                      : 'bg-white/5 border-white/[0.06] hover:bg-white/[0.08]'
                  }`}
                >
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                    style={{ backgroundColor: t.previewColor }}
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold text-white truncate">{t.name}</span>
                    <span className="text-[9px] text-slate-400 truncate">{t.id}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Audio Settings ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 size={13} className="text-cyan-400" /> Audio & Music
          </span>
          <div className="space-y-1.5">
            {/* Sound FX */}
            <button
              onClick={onToggleSound}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/[0.06] transition cursor-pointer"
            >
              <div className="flex items-center gap-3 text-slate-200 font-bold text-xs">
                {soundEnabled ? (
                  <Volume2 size={18} className="text-emerald-400" />
                ) : (
                  <VolumeX size={18} className="text-slate-600" />
                )}
                <span>Sound Effects (SFX)</span>
              </div>
              <span className={`text-xs font-black ${soundEnabled ? 'text-emerald-400' : 'text-slate-600'}`}>
                {soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Background Music */}
            <button
              onClick={onToggleBgm}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/[0.06] transition cursor-pointer"
            >
              <div className="flex items-center gap-3 text-slate-200 font-bold text-xs">
                <Music size={18} className={bgmEnabled ? 'text-cyan-400' : 'text-slate-600'} />
                <span>Ambient Music (BGM)</span>
              </div>
              <span className={`text-xs font-black ${bgmEnabled ? 'text-cyan-400' : 'text-slate-600'}`}>
                {bgmEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Accessibility ── */}
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={13} className="text-cyan-400" /> Accessibility
          </span>
          <button
            onClick={onToggleReducedMotion}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/[0.08] border border-white/[0.06] transition cursor-pointer"
          >
            <div className="flex items-center gap-3 text-slate-200 font-bold text-xs">
              <span>Reduced Motion</span>
            </div>
            <span className={`text-xs font-black ${reducedMotion ? 'text-cyan-400' : 'text-slate-600'}`}>
              {reducedMotion ? 'ENABLED' : 'OFF'}
            </span>
          </button>
        </div>

        {/* ── Other Actions ── */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
          <button
            onClick={handleInstallApp}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-cyan-500/[0.1] border border-cyan-500/20 text-cyan-300 font-bold text-xs hover:bg-cyan-500/[0.15] transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Download size={16} />
              <span>Install to Phone (PWA)</span>
            </div>
            <span className="text-[9px] bg-cyan-500 text-white px-2 py-0.5 rounded-full font-black">Free</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenResetConfirm();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/[0.08] border border-rose-500/20 text-rose-400 font-bold text-xs hover:bg-rose-500/[0.12] transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <RotateCcw size={15} />
              <span>Reset Game Progress</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
