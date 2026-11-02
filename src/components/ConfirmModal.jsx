/**
 * ConfirmModal.jsx — Safety confirmation dialog for resetting progress
 */

import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This will reset your level progress, stars, and records.',
  confirmText = 'Reset Everything',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none"
      onClick={onCancel}
    >
      <div
        className="bg-[#111631] border border-white/10 rounded-3xl p-6 max-w-xs w-full text-center shadow-2xl flex flex-col items-center animate-pop-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
          <AlertTriangle size={28} />
        </div>

        <h3 className="text-lg font-black text-white mb-1.5">{title}</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-5">{message}</p>

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-3 rounded-2xl bg-white/[0.06] hover:bg-white/10 active:scale-95 text-slate-300 font-bold text-xs border border-white/10 transition cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
