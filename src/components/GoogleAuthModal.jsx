/**
 * GoogleAuthModal.jsx — Multi-User Google Account Sign-In
 * Allows any user/colleague to sign in with their OWN Google account/email,
 * switch accounts, or play as guest. Each user gets their own isolated save data.
 */

import { useState, useEffect } from 'react';
import { Gamepad2, HardDrive, Check, User, Plus, Edit2 } from 'lucide-react';

const RECENT_USERS_KEY = 'arrow_puzzle_recent_accounts';

export default function GoogleAuthModal({
  isOpen,
  onLoginSuccess,
  onContinueAsGuest,
  currentLevel = 1,
}) {
  const [selectedAll, setSelectedAll] = useState(true);
  const [playGamesCheck, setPlayGamesCheck] = useState(true);
  const [driveCheck, setDriveCheck] = useState(true);

  // Custom User Inputs
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  // List of known accounts on this device
  const [savedAccounts, setSavedAccounts] = useState(() => {
    try {
      const data = JSON.parse(localStorage.getItem(RECENT_USERS_KEY));
      return Array.isArray(data) && data.length > 0
        ? data
        : [
            { name: 'Labesh R.', email: 'labeshroopani@gmail.com', level: Math.max(3, currentLevel) },
          ];
    } catch {
      return [{ name: 'Labesh R.', email: 'labeshroopani@gmail.com', level: Math.max(3, currentLevel) }];
    }
  });

  // Current selected account
  const [selectedAccount, setSelectedAccount] = useState(() => savedAccounts[0]);

  useEffect(() => {
    if (selectedAccount) {
      setUserName(selectedAccount.name);
      setUserEmail(selectedAccount.email);
    }
  }, [selectedAccount]);

  if (!isOpen) return null;

  const handleSelectAllToggle = () => {
    const next = !selectedAll;
    setSelectedAll(next);
    setPlayGamesCheck(next);
    setDriveCheck(next);
  };

  // Derive initials from name or email
  const getInitials = (name, email) => {
    if (name && name.trim()) {
      const parts = name.trim().split(/\s+/);
      if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (email && email.includes('@')) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'GP';
  };

  const handleSignIn = () => {
    const finalEmail = (userEmail.trim() || 'player@gmail.com').toLowerCase();
    const finalName = userName.trim() || finalEmail.split('@')[0];

    // Check if this account already had saved progress
    const existingAcct = savedAccounts.find(a => a.email.toLowerCase() === finalEmail);
    const savedLevel = existingAcct?.level || 1;

    const userProfile = {
      name: finalName,
      email: finalEmail,
      isLoggedIn: true,
      savedLevel,
    };

    // Save to recent accounts list
    const updatedAccounts = [
      userProfile,
      ...savedAccounts.filter(a => a.email.toLowerCase() !== finalEmail),
    ].slice(0, 5);

    try {
      localStorage.setItem(RECENT_USERS_KEY, JSON.stringify(updatedAccounts));
    } catch {
      // ignore
    }

    onLoginSuccess(userProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="bg-[#121212] text-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-800 flex flex-col font-sans">
        
        {/* Top Google Header */}
        <div className="px-6 pt-5 pb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Google G logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="text-slate-300 text-xs font-semibold">Sign in with Google</span>
          </div>

          <button
            onClick={() => setIsEditingAccount(!isEditingAccount)}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
          >
            {isEditingAccount ? 'Choose Account' : '+ Add / Switch'}
          </button>
        </div>

        {/* Title */}
        <div className="px-6 py-2">
          <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
            Arrow Puzzle wants access to your Google Account
          </h2>

          {/* Account Card / Input Form */}
          {!isEditingAccount ? (
            /* Selected Account Capsule */
            <div className="flex items-center justify-between mt-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow">
                  {getInitials(userName, userEmail)}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-slate-100 truncate">{userName || 'Player'}</span>
                  <span className="text-[11px] text-slate-400 truncate">{userEmail}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditingAccount(true)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                title="Switch or enter custom account"
              >
                <Edit2 size={14} />
              </button>
            </div>
          ) : (
            /* Custom Account Input Form for ANY user */
            <div className="mt-3 bg-slate-900/90 p-3 rounded-2xl border border-blue-500/40 flex flex-col gap-2 animate-fade-in">
              <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                Enter Your Google Account
              </span>
              <div>
                <label className="text-[10px] text-slate-400">Your Name / Gamer Tag</label>
                <input
                  type="text"
                  value={userName}
                  onChange={e => setUserName(e.target.value)}
                  placeholder="e.g. Ali Khan"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400">Your Google Email</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Saved accounts quick selector */}
              {savedAccounts.length > 1 && (
                <div className="mt-1">
                  <span className="text-[10px] text-slate-500">Quick select:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {savedAccounts.map(acct => (
                      <button
                        key={acct.email}
                        onClick={() => {
                          setSelectedAccount(acct);
                          setIsEditingAccount(false);
                        }}
                        className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg border border-slate-700 truncate max-w-[120px]"
                      >
                        {acct.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Permissions list (Screenshot 2) */}
        <div className="px-6 py-2 flex flex-col gap-2.5">
          <p className="text-[11px] text-slate-400 font-medium">
            Select what Arrow Puzzle can access
          </p>

          {/* Select all toggle */}
          <div
            onClick={handleSelectAllToggle}
            className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-900 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border ${selectedAll ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
              {selectedAll && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
            <span className="text-xs font-bold text-slate-200">Select all</span>
          </div>

          <div className="h-px bg-slate-800/80 my-0.5" />

          {/* Play Games activity */}
          <div
            onClick={() => setPlayGamesCheck(!playGamesCheck)}
            className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-900 cursor-pointer"
          >
            <Gamepad2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                Google Play Games activity
              </span>
              <span className="text-[10px] text-blue-400">Independent cloud save for {userEmail || 'this account'}</span>
            </div>
            <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${playGamesCheck ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
              {playGamesCheck && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
          </div>

          {/* Google Drive config sync */}
          <div
            onClick={() => setDriveCheck(!driveCheck)}
            className="flex items-start gap-3 p-1.5 rounded-xl hover:bg-slate-900 cursor-pointer"
          >
            <HardDrive size={18} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1 flex flex-col">
              <span className="text-xs font-semibold text-slate-200 leading-tight">
                Cloud configuration data in Google Drive
              </span>
              <span className="text-[10px] text-blue-400">Stores progress & high scores</span>
            </div>
            <div className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${driveCheck ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
              {driveCheck && <Check size={12} className="text-white" strokeWidth={3} />}
            </div>
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="p-6 pt-2 flex flex-col gap-2 bg-[#121212]">
          {/* Sign In as this User */}
          <button
            onClick={handleSignIn}
            className="w-full py-3.5 px-4 rounded-full bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
          >
            <span>Continue as {userName || userEmail.split('@')[0] || 'Player'}</span>
          </button>

          {/* Play as Guest */}
          <button
            onClick={onContinueAsGuest}
            className="w-full py-2.5 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold text-xs border border-slate-800 transition cursor-pointer"
          >
            Play as Guest (Without Login / Level 1)
          </button>
        </div>

      </div>
    </div>
  );
}
