import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bell, Menu, User, LogIn, LogOut, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AuthUser } from '../types';

interface SkyworkTopBarProps {
  title?: string;
  authUser: AuthUser | null;
  onOpenApiPlatform: () => void;
  onOpenUpgrade: () => void;
  onOpenLogin: (mode?: 'signin' | 'signup' | 'demo') => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export const SkyworkTopBar: React.FC<SkyworkTopBarProps> = ({
  title = 'Dashboard',
  authUser,
  onOpenApiPlatform,
  onOpenUpgrade,
  onOpenLogin,
  onLogout,
  onToggleMobileMenu
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: 'OmniSync AI Fitness 1.0 Live', time: '10m ago', unread: true },
    { id: 2, title: 'Zone 2 Heart Rate & HRV engine active', time: '1h ago', unread: false },
    { id: 3, title: 'Athlete biometrics sync ready', time: '3h ago', unread: false }
  ];

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-[#090710]/90 backdrop-blur-xl border-b border-[#1b152e] px-4 sm:px-8 flex items-center justify-between">
      
      {/* Left: Mobile Menu & Dashboard Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans">
          {title}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* API Platform (Beta) */}
        <button
          onClick={onOpenApiPlatform}
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-purple-300 transition-colors py-1.5 px-3 rounded-xl hover:bg-white/5"
        >
          {/* Ray / Sparkle Icon */}
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-purple-400 fill-current animate-pulse" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm10-7a1 1 0 0 1-1 1h-2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm14.07-7.07a1 1 0 0 1 0 1.41l-1.41 1.42a1 1 0 1 1-1.42-1.42l1.42-1.41a1 1 0 0 1 1.41 0zM7.76 16.24a1 1 0 0 1 0 1.42l-1.42 1.41a1 1 0 0 1-1.41-1.41l1.41-1.42a1 1 0 0 1 1.42 0zm10.9 10.9a1 1 0 0 1-1.42 0l-1.41-1.41a1 1 0 0 1 1.41-1.42l1.42 1.41a1 1 0 0 1 0 1.42zM6.34 6.34a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 0 1 1.41 1.42L7.76 6.34a1 1 0 0 1-1.42 0z" />
          </svg>
          <span>API Platform (Beta)</span>
        </button>

        {/* Try Assistance Pro Button */}
        <button
          onClick={onOpenUpgrade}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 border border-purple-500/40 text-white text-xs font-semibold shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
        >
          <span className="text-sm">💎</span>
          <span>Try Assistance Pro</span>
        </button>

        {/* Notification Bell Button */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-full bg-[#150f28] border border-purple-900/40 hover:border-purple-500/50 flex items-center justify-center text-slate-300 hover:text-white transition-all relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0f0a20] border border-purple-500/30 shadow-[0_12px_32px_rgba(0,0,0,0.8)] p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-purple-900/30">
                <span className="font-semibold text-white">Notifications</span>
                <span className="text-[10px] text-purple-400">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 transition-colors"
                  >
                    <p className="text-slate-200 font-medium">{n.title}</p>
                    <span className="text-[10px] text-slate-400">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Account / Login Integration */}
        <div className="relative" ref={userMenuRef}>
          {(!authUser || authUser.isGuest) ? (
            <button
              onClick={() => onOpenLogin('signin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-purple-900/40 hover:border-purple-500/40 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-purple-400" />
              <span>Log In</span>
            </button>
          ) : (
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-white/5 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {authUser.name ? authUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="hidden md:inline text-xs font-medium text-slate-200">
                {authUser.name.split(' ')[0]}
              </span>
            </button>
          )}

          {/* User Account Popover */}
          {showUserMenu && authUser && !authUser.isGuest && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f0a20] border border-purple-500/30 shadow-[0_12px_32px_rgba(0,0,0,0.8)] p-3 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="pb-2.5 mb-2.5 border-b border-purple-900/30">
                <p className="font-semibold text-white truncate">{authUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{authUser.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/40 text-purple-300 capitalize">
                  {authUser.role}
                </span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onOpenLogin('signin');
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white transition-colors"
                >
                  Switch Account
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-red-500/10 text-red-400 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
