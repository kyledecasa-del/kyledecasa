import {
  UserProfile,
  WorkoutRoutine,
  RecoveryMetric,
  DailyNutrition,
  WearableDevice,
  WeeklyProgressReport,
  SocialChallenge,
  MealLog,
  WorkoutHistoryRecord,
  AuthUser,
  FitnessGoal,
  FitnessLevel
} from '../types';
import {
  initialUserProfile,
  initialRoutines,
  initialRecoveryMetric,
  initialNutrition,
  initialWearableDevices,
  initialWeeklyReport,
  initialSocialChallenges,
  initialWorkoutHistory
} from './mockData';

export interface RegisteredUserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'athlete' | 'coach' | 'admin' | 'guest';
  avatarUrl?: string;
  fitnessGoal?: FitnessGoal;
  fitnessLevel?: FitnessLevel;
  createdAt: string;
}

export const DEFAULT_REGISTERED_USERS: RegisteredUserRecord[] = [
  {
    id: 'user_kyle_1',
    name: 'Kyle Decasa',
    email: 'kyledecasa@gmail.com',
    password: 'password123',
    role: 'athlete',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    fitnessGoal: 'muscle_gain',
    fitnessLevel: 'elite',
    createdAt: '2026-01-15'
  },
  {
    id: 'user_alex_2',
    name: 'Alex Rivera',
    email: 'alex@aurafit.ai',
    password: 'password123',
    role: 'athlete',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    fitnessGoal: 'muscle_gain',
    fitnessLevel: 'intermediate',
    createdAt: '2026-02-10'
  },
  {
    id: 'user_elena_3',
    name: 'Elena Rostova',
    email: 'elena@aurafit.ai',
    password: 'password123',
    role: 'coach',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    fitnessGoal: 'endurance',
    fitnessLevel: 'advanced',
    createdAt: '2026-03-01'
  }
];

export const initialAuthUser: AuthUser = {
  id: 'user_kyle_1',
  name: 'Kyle Decasa',
  email: 'kyledecasa@gmail.com',
  role: 'athlete',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  fitnessGoal: 'muscle_gain',
  fitnessLevel: 'elite',
  lastLogin: 'Just now'
};

const KEYS = {
  PROFILE: 'aurafit_user_profile',
  ROUTINES: 'aurafit_routines',
  RECOVERY: 'aurafit_recovery',
  NUTRITION: 'aurafit_nutrition',
  WEARABLES: 'aurafit_wearables',
  WEEKLY_REPORT: 'aurafit_weekly_report',
  CHALLENGES: 'aurafit_challenges',
  WORKOUT_HISTORY: 'aurafit_workout_history',
  THEME: 'aurafit_theme',
  AUTH_USER: 'aurafit_auth_user',
  REGISTERED_USERS: 'aurafit_registered_users'
};

export const loadTheme = (): 'dark' | 'light' => {
  try {
    const data = localStorage.getItem(KEYS.THEME);
    return data === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const saveTheme = (theme: 'dark' | 'light'): void => {
  localStorage.setItem(KEYS.THEME, theme);
};

export const loadProfile = (): UserProfile => {
  try {
    const data = localStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : initialUserProfile;
  } catch {
    return initialUserProfile;
  }
};

export const saveProfile = (profile: UserProfile): void => {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
};

export const loadRoutines = (): WorkoutRoutine[] => {
  try {
    const data = localStorage.getItem(KEYS.ROUTINES);
    return data ? JSON.parse(data) : initialRoutines;
  } catch {
    return initialRoutines;
  }
};

export const saveRoutines = (routines: WorkoutRoutine[]): void => {
  localStorage.setItem(KEYS.ROUTINES, JSON.stringify(routines));
};

export const loadRecovery = (): RecoveryMetric => {
  try {
    const data = localStorage.getItem(KEYS.RECOVERY);
    return data ? JSON.parse(data) : initialRecoveryMetric;
  } catch {
    return initialRecoveryMetric;
  }
};

export const saveRecovery = (recovery: RecoveryMetric): void => {
  localStorage.setItem(KEYS.RECOVERY, JSON.stringify(recovery));
};

export const loadNutrition = (): DailyNutrition => {
  try {
    const data = localStorage.getItem(KEYS.NUTRITION);
    return data ? JSON.parse(data) : initialNutrition;
  } catch {
    return initialNutrition;
  }
};

export const saveNutrition = (nutrition: DailyNutrition): void => {
  localStorage.setItem(KEYS.NUTRITION, JSON.stringify(nutrition));
};

export const loadWearables = (): WearableDevice[] => {
  try {
    const data = localStorage.getItem(KEYS.WEARABLES);
    return data ? JSON.parse(data) : initialWearableDevices;
  } catch {
    return initialWearableDevices;
  }
};

export const saveWearables = (devices: WearableDevice[]): void => {
  localStorage.setItem(KEYS.WEARABLES, JSON.stringify(devices));
};

export const loadWeeklyReport = (): WeeklyProgressReport => {
  try {
    const data = localStorage.getItem(KEYS.WEEKLY_REPORT);
    return data ? JSON.parse(data) : initialWeeklyReport;
  } catch {
    return initialWeeklyReport;
  }
};

export const saveWeeklyReport = (report: WeeklyProgressReport): void => {
  localStorage.setItem(KEYS.WEEKLY_REPORT, JSON.stringify(report));
};

export const loadChallenges = (): SocialChallenge[] => {
  try {
    const data = localStorage.getItem(KEYS.CHALLENGES);
    return data ? JSON.parse(data) : initialSocialChallenges;
  } catch {
    return initialSocialChallenges;
  }
};

export const saveChallenges = (challenges: SocialChallenge[]): void => {
  localStorage.setItem(KEYS.CHALLENGES, JSON.stringify(challenges));
};

export const loadWorkoutHistory = (): WorkoutHistoryRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.WORKOUT_HISTORY);
    return data ? JSON.parse(data) : initialWorkoutHistory;
  } catch {
    return initialWorkoutHistory;
  }
};

export const saveWorkoutHistory = (history: WorkoutHistoryRecord[]): void => {
  localStorage.setItem(KEYS.WORKOUT_HISTORY, JSON.stringify(history));
};

export const addWorkoutHistoryRecord = (record: WorkoutHistoryRecord): WorkoutHistoryRecord[] => {
  const current = loadWorkoutHistory();
  const updated = [record, ...current];
  saveWorkoutHistory(updated);
  return updated;
};

export const deleteWorkoutHistoryRecord = (id: string): WorkoutHistoryRecord[] => {
  const current = loadWorkoutHistory();
  const updated = current.filter(r => r.id !== id);
  saveWorkoutHistory(updated);
  return updated;
};

// ==========================================
// Authentication & User Account Management
// ==========================================

export const loadAuthUser = (): AuthUser | null => {
  try {
    const data = localStorage.getItem(KEYS.AUTH_USER);
    if (!data) {
      // Default to the initial authenticated user (Kyle Decasa)
      saveAuthUser(initialAuthUser);
      return initialAuthUser;
    }
    return JSON.parse(data);
  } catch {
    return initialAuthUser;
  }
};

export const saveAuthUser = (user: AuthUser | null): void => {
  try {
    if (user) {
      localStorage.setItem(KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.AUTH_USER);
    }
  } catch (err) {
    console.error('Error saving auth user:', err);
  }
};

export const loadRegisteredUsers = (): RegisteredUserRecord[] => {
  try {
    const data = localStorage.getItem(KEYS.REGISTERED_USERS);
    if (!data) {
      localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(DEFAULT_REGISTERED_USERS));
      return DEFAULT_REGISTERED_USERS;
    }
    return JSON.parse(data);
  } catch {
    return DEFAULT_REGISTERED_USERS;
  }
};

export const saveRegisteredUsers = (users: RegisteredUserRecord[]): void => {
  try {
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Error saving registered users:', err);
  }
};

export const authenticateUser = (
  email: string,
  pass: string
): { success: boolean; user?: AuthUser; error?: string } => {
  const normalizedEmail = email.trim().toLowerCase();
  const users = loadRegisteredUsers();

  const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return {
      success: false,
      error: 'Account not found with this email. Check your address or create an account.'
    };
  }

  if (found.password !== pass) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again, or use demo account login.'
    };
  }

  const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const authUser: AuthUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    avatarUrl: found.avatarUrl,
    fitnessGoal: found.fitnessGoal || 'muscle_gain',
    fitnessLevel: found.fitnessLevel || 'intermediate',
    lastLogin: `Today at ${nowFormatted}`,
    isGuest: false
  };

  saveAuthUser(authUser);
  return { success: true, user: authUser };
};

export const registerNewUser = (
  data: Omit<RegisteredUserRecord, 'id' | 'createdAt'>
): { success: boolean; user?: AuthUser; error?: string } => {
  const normalizedEmail = data.email.trim().toLowerCase();
  const users = loadRegisteredUsers();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return {
      success: false,
      error: 'An account with this email address already exists. Please sign in instead.'
    };
  }

  const newId = `user_${Date.now()}`;
  const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newRecord: RegisteredUserRecord = {
    ...data,
    id: newId,
    email: normalizedEmail,
    createdAt: new Date().toISOString().split('T')[0]
  };

  const updatedUsers = [...users, newRecord];
  saveRegisteredUsers(updatedUsers);

  const authUser: AuthUser = {
    id: newRecord.id,
    name: newRecord.name,
    email: newRecord.email,
    role: newRecord.role,
    avatarUrl: newRecord.avatarUrl,
    fitnessGoal: newRecord.fitnessGoal || 'muscle_gain',
    fitnessLevel: newRecord.fitnessLevel || 'intermediate',
    lastLogin: `Today at ${nowFormatted}`,
    isGuest: false
  };

  saveAuthUser(authUser);
  return { success: true, user: authUser };
};

