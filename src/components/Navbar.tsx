import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, WearableDevice, AuthUser } from '../types';
import {
  Activity,
  Watch,
  User,
  Flame,
  Heart,
  Sun,
  Moon,
  History,
  Users,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
  UserPlus
} from 'lucide-react';

interface NavbarProps {
  profile: UserProfile;
  wearables: WearableDevice[];
  authUser: AuthUser | null;
  onOpenProfile: () => void;
  onOpenWearables: () => void;
  onOpenAIAssistant: () => void;
  onOpenHistory: (filter?: 'all' | 'guest' | 'user') => void;
  onOpenLogin: (mode?: 'signin' | 'signup' | 'demo') => void;
  onLogout: () => void;
  guestCount?: number;
  liveHR: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  wearables,
  authUser,
  onOpenProfile,
  onOpenWearables,
  onOpenAIAssistant,
  onOpenHistory,
  onOpenLogin,
  onLogout,
  guestCount = 0,
  liveHR,
  theme,
  onToggleTheme
}) => {
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const connectedCount = wearables.filter(d => d.connected).length;

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-emerald-500 to-indigo-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-emerald-200 to-cyan-400 bg-clip-text text-transparent">
                AuraFit
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Pro
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Bio-Adaptive AI Fitness & Recovery</p>
          </div>
        </div>

        {/* Live Telemetry Pill & Profile Controls */}
        <div className="flex items-center gap-3">
          
          {/* Live Heart Rate Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs">
            <Heart className="w-4 h-4 text-rose-500 animate-ping" />
            <span className="font-mono font-bold text-slate-200">{liveHR || 68}</span>
            <span className="text-slate-400 text-[11px]">BPM</span>
          </div>

          {/* Connected Wearables Quick Trigger */}
          <button
            onClick={onOpenWearables}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors text-xs font-medium text-slate-200"
            title="Wearable Device Status"
          >
            <Watch className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Wearables</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-bold">
              {connectedCount} Live
            </span>
          </button>

          {/* Theme Switcher Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 transition-colors text-xs font-semibold text-slate-200"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Dark</span>
              </>
            )}
          </button>

          {/* History & Guest Sessions Button */}
          <button
            onClick={() => onOpenHistory('all')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-amber-500/40 transition-colors text-xs font-bold text-slate-200 group"
            title="View Workout & Guest Session History"
          >
            <History className="w-4 h-4 text-amber-400 group-hover:rotate-[-20deg] transition-transform" />
            <span className="hidden sm:inline">History</span>
            {guestCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 font-black font-mono">
                {guestCount} Guests
              </span>
            )}
          </button>

          {/* AI Assistant Drawer Trigger Button */}
          <button
            onClick={onOpenAIAssistant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-xs font-extrabold text-emerald-300 transition-all shadow-md shadow-emerald-500/10"
            title="Open AI Personal Assistant"
          >
            <Activity className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Authentication & User Profile Controls */}
          {(!authUser || authUser.isGuest) ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('signin')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                title="Log In or Create Athlete Account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>

              <button
                onClick={onOpenProfile}
                className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 transition-all text-xs font-medium text-slate-300"
                title="Biometrics Settings"
              >
                <div className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-slate-300 text-xs font-bold">
                  {profile.name.charAt(0)}
                </div>
                <span className="text-xs">{profile.name}</span>
              </button>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-gradient-to-r from-slate-800 to-slate-800/80 hover:from-slate-700 hover:to-slate-800 border border-slate-700/80 transition-all text-xs font-medium text-slate-200"
                title="Account Menu"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-xs">
                  {authUser.name.charAt(0)}
                </div>
                <div className="text-left hidden md:block">
                  <div className="text-xs font-semibold leading-tight text-slate-100 flex items-center gap-1">
                    <span>{authUser.name}</span>
                    <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-black">
                      {authUser.role || 'Athlete'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {authUser.email}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isAccountDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Account Dropdown Menu */}
              {isAccountDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-1">
                  
                  {/* User Info Header */}
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 mb-1">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-black text-sm">
                        {authUser.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-100 truncate">{authUser.name}</div>
                        <div className="text-[11px] text-slate-400 truncate">{authUser.email}</div>
                      </div>
                    </div>
                    {authUser.lastLogin && (
                      <div className="mt-2 text-[10px] text-slate-500 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        <span>Signed in: {authUser.lastLogin}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors text-left"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Edit Profile & Biometrics</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      onOpenLogin('signin');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors text-left"
                  >
                    <LogIn className="w-4 h-4 text-cyan-400" />
                    <span>Switch / Log In Another</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      onOpenLogin('demo');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-slate-800 transition-colors text-left"
                  >
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>Switch to Demo Account</span>
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={() => {
                      setIsAccountDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

