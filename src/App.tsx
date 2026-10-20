import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutRoutine,
  RecoveryMetric,
  DailyNutrition,
  WearableDevice,
  WeeklyProgressReport,
  SocialChallenge,
  WorkoutHistoryRecord,
  AuthUser,
  AgentCategory
} from './types';
import {
  loadProfile,
  saveProfile,
  loadRoutines,
  saveRoutines,
  loadRecovery,
  saveRecovery,
  loadNutrition,
  saveNutrition,
  loadWearables,
  saveWearables,
  loadWeeklyReport,
  saveWeeklyReport,
  loadChallenges,
  saveChallenges,
  loadTheme,
  saveTheme,
  loadWorkoutHistory,
  saveWorkoutHistory,
  addWorkoutHistoryRecord,
  deleteWorkoutHistoryRecord,
  loadAuthUser,
  saveAuthUser
} from './lib/storage';

// Skywork Components
import { SkyworkSidebar } from './components/SkyworkSidebar';
import { SkyworkTopBar } from './components/SkyworkTopBar';
import { SkyworkDashboardView } from './components/SkyworkDashboardView';
import {
  ProjectsView,
  ScheduledTasksView,
  KnowledgeBaseView,
  AgentDescriptionView,
  TutorialView,
  ProductUpdatesView
} from './components/SkyworkWorkspaces';
import { UpgradePremiumModal } from './components/UpgradePremiumModal';
import { ApiPlatformModal } from './components/ApiPlatformModal';
import { NewProjectModal } from './components/NewProjectModal';

// Modals & Supporting views
import { LoginFormModal } from './components/LoginFormModal';
import { ProfileModal } from './components/ProfileModal';
import { WorkoutHistoryModal } from './components/WorkoutHistoryModal';
import { LiveWorkoutModal } from './components/LiveWorkoutModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { SocialView } from './components/SocialView';

export default function App() {
  // Navigation State
  const [sidebarNav, setSidebarNav] = useState<string>('home');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Skywork Specific Modals
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isApiPlatformOpen, setIsApiPlatformOpen] = useState(false);
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // App State initialized from Local Storage
  const [profile, setProfileState] = useState<UserProfile>(loadProfile);
  const [routines, setRoutinesState] = useState<WorkoutRoutine[]>(loadRoutines);
  const [recovery, setRecoveryState] = useState<RecoveryMetric>(loadRecovery);
  const [nutrition, setNutritionState] = useState<DailyNutrition>(loadNutrition);
  const [wearables, setWearablesState] = useState<WearableDevice[]>(loadWearables);
  const [weeklyReport, setWeeklyReportState] = useState<WeeklyProgressReport>(loadWeeklyReport);
  const [challenges, setChallengesState] = useState<SocialChallenge[]>(loadChallenges);
  const [workoutHistory, setWorkoutHistoryState] = useState<WorkoutHistoryRecord[]>(loadWorkoutHistory);

  // Global Theme State ('dark')
  const [theme] = useState<'dark'>('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.remove('light');
  }, []);

  // Modals
  const [activeLiveRoutine, setActiveLiveRoutine] = useState<WorkoutRoutine | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyModalFilter, setHistoryModalFilter] = useState<'all' | 'guest' | 'user'>('all');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // User Authentication State
  const [authUser, setAuthUserState] = useState<AuthUser | null>(loadAuthUser);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'signin' | 'signup' | 'demo'>('signin');

  const handleOpenLogin = (mode: 'signin' | 'signup' | 'demo' = 'signin') => {
    setLoginModalMode(mode);
    setIsLoginModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setAuthUserState(user);
    saveAuthUser(user);

    if (!user.isGuest) {
      const updatedProfile = {
        ...profile,
        name: user.name,
        goal: user.fitnessGoal || profile.goal,
        fitnessLevel: user.fitnessLevel || profile.fitnessLevel
      };
      setProfileState(updatedProfile);
      saveProfile(updatedProfile);
    }
  };

  const handleLogout = () => {
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Athlete',
      email: 'guest@aurafit.local',
      role: 'guest',
      isGuest: true,
      fitnessGoal: 'general_wellness',
      fitnessLevel: 'intermediate',
      lastLogin: 'Just now'
    };
    setAuthUserState(guestUser);
    saveAuthUser(guestUser);
  };

  const handleOpenHistory = (filter: 'all' | 'guest' | 'user' = 'all') => {
    setHistoryModalFilter(filter);
    setIsHistoryModalOpen(true);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    setProfileState(updated);
    saveProfile(updated);
  };

  const handleAddHistoryRecord = (record: WorkoutHistoryRecord) => {
    const updated = addWorkoutHistoryRecord(record);
    setWorkoutHistoryState(updated);
  };

  const handleDeleteHistoryRecord = (id: string) => {
    const updated = deleteWorkoutHistoryRecord(id);
    setWorkoutHistoryState(updated);
  };

  const handleCreateProject = (proj: { name: string; agent: AgentCategory; description: string }) => {
    setSidebarNav('projects');
  };

  // Determine top bar title
  const getNavTitle = () => {
    switch (sidebarNav) {
      case 'home':
        return 'Dashboard';
      case 'projects':
        return 'Project Workspaces';
      case 'tasks':
        return 'Scheduled Tasks';
      case 'knowledge':
        return 'Knowledge Base';
      case 'showcase':
        return 'Agent Showcase';
      case 'agent_description':
        return 'Agent Description';
      case 'tutorial':
        return 'Tutorial';
      case 'updates':
        return 'Product Updates';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#090710] text-slate-100 font-sans antialiased flex selection:bg-purple-600 selection:text-white">
      
      {/* Left Sidebar (Docked on desktop, drawer on mobile) */}
      <SkyworkSidebar
        activeNav={sidebarNav}
        onSelectNav={(nav) => {
          setSidebarNav(nav);
          setIsMobileNavOpen(false);
        }}
        onOpenNewProject={() => setIsNewProjectOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Right Content Layout */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen bg-[#090710] w-full">
        
        {/* Top Header Bar */}
        <SkyworkTopBar
          title={getNavTitle()}
          authUser={authUser}
          onOpenApiPlatform={() => setIsApiPlatformOpen(true)}
          onOpenUpgrade={() => setIsUpgradeOpen(true)}
          onOpenLogin={handleOpenLogin}
          onLogout={handleLogout}
          onToggleMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* View Content Router */}
        <main className="flex-1 w-full">
          {sidebarNav === 'home' && (
            <SkyworkDashboardView
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
              onOpenApiPlatform={() => setIsApiPlatformOpen(true)}
            />
          )}

          {sidebarNav === 'projects' && (
            <ProjectsView
              onOpenNewProject={() => setIsNewProjectOpen(true)}
              onOpenUpgrade={() => setIsUpgradeOpen(true)}
            />
          )}

          {sidebarNav === 'tasks' && <ScheduledTasksView />}

          {sidebarNav === 'knowledge' && <KnowledgeBaseView />}

          {sidebarNav === 'showcase' && (
            <div className="max-w-5xl mx-auto p-4 sm:p-8">
              <SocialView
                challenges={challenges}
                onUpdateChallenges={(c) => {
                  setChallengesState(c);
                  saveChallenges(c);
                }}
              />
            </div>
          )}

          {sidebarNav === 'agent_description' && <AgentDescriptionView />}

          {sidebarNav === 'tutorial' && <TutorialView />}

          {sidebarNav === 'updates' && <ProductUpdatesView />}
        </main>

      </div>

      {/* Upgrade Pro Modal */}
      <UpgradePremiumModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />

      {/* API Platform (Beta) Modal */}
      <ApiPlatformModal
        isOpen={isApiPlatformOpen}
        onClose={() => setIsApiPlatformOpen(false)}
      />

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      {/* Biometric Athlete Portal Login / Registration Modal */}
      <LoginFormModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={loginModalMode}
      />

      {/* User Profile Settings Modal */}
      {isProfileOpen && (
        <ProfileModal
          profile={profile}
          authUser={authUser}
          onClose={() => setIsProfileOpen(false)}
          onSaveProfile={handleSaveProfile}
          onOpenHistory={handleOpenHistory}
          onOpenLogin={handleOpenLogin}
          onLogout={handleLogout}
        />
      )}

      {/* Workout and Guest History Records Modal */}
      {isHistoryModalOpen && (
        <WorkoutHistoryModal
          isOpen={isHistoryModalOpen}
          historyRecords={workoutHistory}
          onClose={() => setIsHistoryModalOpen(false)}
          onAddRecord={handleAddHistoryRecord}
          onDeleteRecord={handleDeleteHistoryRecord}
          routines={routines}
          currentProfile={profile}
          initialFilter={historyModalFilter}
        />
      )}

      {/* Live Workout Telemetry Modal */}
      {activeLiveRoutine && (
        <LiveWorkoutModal
          routine={activeLiveRoutine}
          onClose={() => setActiveLiveRoutine(null)}
          onCompleteWorkout={() => setActiveLiveRoutine(null)}
        />
      )}

      {/* Global Interactive AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        profile={profile}
        onUpdateProfile={handleSaveProfile}
      />

    </div>
  );
}
