import React from 'react';
import {
  Home,
  PlusCircle,
  FolderKanban,
  Clock,
  Box,
  Layers,
  FileText,
  HelpCircle,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface SkyworkSidebarProps {
  activeNav: string;
  onSelectNav: (nav: string) => void;
  onOpenNewProject: () => void;
  onOpenUpgrade: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const SkyworkSidebar: React.FC<SkyworkSidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenNewProject,
  onOpenUpgrade,
  isMobileOpen = false,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-in fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0714] border-r border-[#1a142c] flex flex-col justify-between p-4 transition-transform duration-300 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between px-2 pt-2">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectNav('home')}>
              {/* Skywork Spiral Logo Icon */}
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white relative">
                <svg viewBox="0 0 32 32" className="w-7 h-7 text-white fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 2C8.268 2 2 8.268 2 16c0 4.18 1.83 7.94 4.74 10.53a1 1 0 0 0 1.34-1.48C5.55 22.81 4 19.58 4 16c0-6.627 5.373-12 12-12 5.08 0 9.42 3.16 11.17 7.64a1 1 0 1 0 1.87-.72C26.83 5.92 21.8 2 16 2z" />
                  <path d="M16 8c-4.418 0-8 3.582-8 8 0 2.45 1.11 4.65 2.86 6.13a1 1 0 0 0 1.31-1.52C10.84 19.49 10 17.84 10 16c0-3.314 2.686-6 6-6 2.54 0 4.72 1.58 5.59 3.82a1 1 0 1 0 1.87-.71C22.25 9.87 19.34 8 16 8z" />
                  <circle cx="16" cy="16" r="3.5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white font-sans leading-none">
                  OmniSync
                </span>
                <span className="text-[10px] font-semibold text-purple-400 tracking-wider uppercase mt-0.5">
                  AI Fitness
                </span>
              </div>
            </div>

            {/* Close Button on Mobile */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* MAIN MENU */}
          <div className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              MAIN MENU
            </div>

            {/* Home (Active with pink/fuchsia pill) */}
            <button
              onClick={() => onSelectNav('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                activeNav === 'home'
                  ? 'bg-gradient-to-r from-purple-950/90 via-purple-900/50 to-indigo-950/40 text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  activeNav === 'home'
                    ? 'bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white shadow-sm'
                    : 'text-slate-400'
                }`}
              >
                <Home className="w-3.5 h-3.5" />
              </div>
              <span>Home</span>
            </button>

            {/* + New Project */}
            <button
              onClick={onOpenNewProject}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors group"
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 group-hover:text-purple-300">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span>+ New Project</span>
            </button>

            {/* Project */}
            <button
              onClick={() => onSelectNav('projects')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeNav === 'projects'
                  ? 'bg-purple-950/40 text-white border border-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400">
                <FolderKanban className="w-4 h-4" />
              </div>
              <span>Project</span>
            </button>

            {/* Scheduled Tasks */}
            <button
              onClick={() => onSelectNav('tasks')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeNav === 'tasks'
                  ? 'bg-purple-950/40 text-white border border-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400">
                <Clock className="w-4 h-4" />
              </div>
              <span>Scheduled Tasks</span>
            </button>

            {/* Knowledge Base */}
            <button
              onClick={() => onSelectNav('knowledge')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeNav === 'knowledge'
                  ? 'bg-purple-950/40 text-white border border-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400">
                <Box className="w-4 h-4" />
              </div>
              <span>Knowledge Base</span>
            </button>

            {/* Showcase */}
            <button
              onClick={() => onSelectNav('showcase')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-colors ${
                activeNav === 'showcase'
                  ? 'bg-purple-950/40 text-white border border-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400">
                <Layers className="w-4 h-4" />
              </div>
              <span>Showcase</span>
            </button>
          </div>

          {/* Secondary Menu */}
          <div className="space-y-1 pt-4 border-t border-[#171228]">
            <button
              onClick={() => onSelectNav('agent_description')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeNav === 'agent_description'
                  ? 'text-purple-300 bg-purple-950/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Agent Description</span>
            </button>

            <button
              onClick={() => onSelectNav('tutorial')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeNav === 'tutorial'
                  ? 'text-purple-300 bg-purple-950/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>Tutorial</span>
            </button>

            <button
              onClick={() => onSelectNav('updates')}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                activeNav === 'updates'
                  ? 'text-purple-300 bg-purple-950/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span>Product Updates</span>
            </button>
          </div>

        </div>

        {/* Bottom Upgrade Premium Card with Glowing 3D Diamond */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-b from-[#160f2b] to-[#0c0818] border border-purple-500/20 shadow-[0_8px_20px_rgba(0,0,0,0.5)] relative overflow-hidden text-center group">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-28 h-28 bg-purple-600/20 rounded-full blur-xl pointer-events-none group-hover:bg-purple-600/30 transition-all" />

          {/* 3D Glowing Gemstone Asset */}
          <div className="relative my-2 flex justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative">
              <svg viewBox="0 0 64 64" className="w-14 h-14 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]" fill="none">
                {/* Diamond Facets */}
                <polygon points="32,6 52,22 12,22" fill="url(#gem_top)" />
                <polygon points="12,22 32,58 32,22" fill="url(#gem_left)" />
                <polygon points="52,22 32,58 32,22" fill="url(#gem_right)" />
                <polygon points="22,22 32,6 32,22" fill="#c084fc" opacity="0.6" />
                <polygon points="42,22 32,6 32,22" fill="#e879f9" opacity="0.6" />
                <polygon points="22,22 32,22 32,58" fill="#60a5fa" opacity="0.4" />
                <polygon points="42,22 32,22 32,58" fill="#a855f7" opacity="0.5" />
                <defs>
                  <linearGradient id="gem_top" x1="12" y1="6" x2="52" y2="22" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#e879f9" />
                    <stop offset="1" stopColor="#38bdf8" />
                  </linearGradient>
                  <linearGradient id="gem_left" x1="12" y1="22" x2="32" y2="58" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#38bdf8" />
                    <stop offset="1" stopColor="#1e1b4b" />
                  </linearGradient>
                  <linearGradient id="gem_right" x1="52" y1="22" x2="32" y2="58" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#c084fc" />
                    <stop offset="1" stopColor="#3b0764" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <button
            onClick={onOpenUpgrade}
            className="w-full mt-2 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)] hover:border-purple-400/60 transition-all"
          >
            Upgrade Premium
          </button>
        </div>

      </aside>
    </>
  );
};
