import React from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  HeartPulse,
  Utensils,
  Watch,
  FileBarChart2,
  Users,
  Bot,
  Trophy
} from 'lucide-react';

export type TabType =
  | 'dashboard'
  | 'ai_coach'
  | 'routines'
  | 'prs'
  | 'recovery'
  | 'nutrition'
  | 'wearables'
  | 'weekly'
  | 'social';

interface TabNavigationProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onChangeTab
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prs', label: 'Personal Bests (PRs)', icon: Trophy },
    { id: 'ai_coach', label: 'AI Coach Onboarding', icon: Bot },
    { id: 'routines', label: 'AI Routines', icon: Dumbbell },
    { id: 'recovery', label: 'Recovery & Readiness', icon: HeartPulse },
    { id: 'nutrition', label: 'Nutrition & Macros', icon: Utensils },
    { id: 'wearables', label: 'Wearable Sync', icon: Watch },
    { id: 'weekly', label: 'Weekly AI Reports', icon: FileBarChart2 },
    { id: 'social', label: 'Community Challenges', icon: Users }
  ] as const;

  return (
    <nav className="bg-slate-900/80 backdrop-blur border-b border-slate-800 px-2 lg:px-8 py-2 sticky top-[57px] z-20 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center gap-1 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id as TabType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/20 via-cyan-500/15 to-indigo-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
