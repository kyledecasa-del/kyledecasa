export type FitnessGoal = 'muscle_gain' | 'fat_loss' | 'endurance' | 'injury_recovery' | 'general_wellness';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type HeartRateZone = 'Zone 1 (Warmup)' | 'Zone 2 (Fat Burn)' | 'Zone 3 (Aerobic)' | 'Zone 4 (Anaerobic)' | 'Zone 5 (Max)';

export interface UserProfile {
  name: string;
  age: number;
  weightKg: number;
  heightCm: number;
  gender: 'male' | 'female' | 'other';
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  restingHR: number; // e.g. 58
  maxHR: number; // e.g. 185
  bodyFatPct?: number; // e.g. 15%
  vo2Max?: number; // e.g. 54 ml/kg/min
  avatarUrl?: string;
  dailyCalorieTarget: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  targetWaterMl: number;
  connectedDevices: string[]; // device IDs
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string; // e.g., "8-10" or "45 sec"
  weightKg?: number;
  targetZone: HeartRateZone;
  restPeriodSec: number;
  instructions: string;
  muscleGroup: string;
  isAdapted?: boolean;
  adaptationNote?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: 'Strength' | 'HIIT' | 'Hypertrophy' | 'Active Recovery' | 'Endurance';
  difficulty: FitnessLevel;
  durationMins: number;
  estimatedCalories: number;
  focusArea: string;
  exercises: Exercise[];
  aiReasoning: string;
  createdAt: string;
}

export interface HeartRateSample {
  timestamp: string; // e.g., "14:20:05"
  bpm: number;
  zone: HeartRateZone;
}

export interface LiveWorkoutState {
  routineId: string;
  routineTitle: string;
  activeExerciseIndex: number;
  elapsedTimeSec: number;
  totalCaloriesBurned: number;
  currentHR: number;
  targetHR: number;
  hrHistory: HeartRateSample[];
  intensityLevel: number; // percentage e.g., 100
  isPaused: boolean;
  adaptationLogs: {
    time: string;
    trigger: string;
    action: string;
  }[];
}

export interface MuscleFatigue {
  chest: number; // 0 to 100
  back: number;
  quads: number;
  hamstrings: number;
  shoulders: number;
  biceps: number;
  triceps: number;
  core: number;
}

export interface RecoveryMetric {
  id: string;
  date: string;
  readinessScore: number; // 0-100
  hrvMs: number; // e.g. 68ms
  sleepHours: number; // e.g. 7.8
  sleepQualityScore: number; // 0-100
  strainScore: number; // 0-21 WHOOP style
  injuryRisk: 'Low' | 'Moderate' | 'Elevated';
  muscleFatigue: MuscleFatigue;
  aiRecoverySummary: string;
  recommendedActivity: string;
}

export interface MealLog {
  id: string;
  time: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  aiNutritionalTip?: string;
}

export interface DailyNutrition {
  date: string;
  meals: MealLog[];
  waterMl: number;
}

export interface WearableDevice {
  id: string;
  name: string;
  type: 'Apple Watch' | 'Garmin' | 'WHOOP' | 'Fitbit' | 'Oura Ring';
  connected: boolean;
  batteryLevel: number;
  lastSyncTime: string;
  liveHeartRate: number;
  stepsToday: number;
  activeCaloriesToday: number;
  hrvLatest: number;
  sleepScoreLatest: number;
}

export interface WeeklyProgressReport {
  id: string;
  weekRange: string;
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  avgReadiness: number;
  avgHRV: number;
  macroAdherencePct: number;
  keyMilestones: string[];
  aiComprehensiveAnalysis: string;
  aiNextWeekStrategy: string;
}

export interface PersonalBestRecord {
  id: string;
  exerciseName: string;
  category: 'Strength' | 'Running' | 'Rowing' | 'Endurance' | 'HIIT';
  metricType: 'weight' | 'time' | 'distance';
  value: number; // e.g. 100 for weight, 22.5 for time in mins
  unit: string; // 'kg', 'lbs', 'min', 'sec', 'km', 'm'
  repsOrPace?: string; // e.g. "5 reps" or "4:12 min/km"
  achievedDate: string; // YYYY-MM-DD
  previousBest?: string; // e.g. "95 kg"
  notes?: string;
  isRecentPR?: boolean;
}

export interface SocialChallenge {
  id: string;
  title: string;
  category: 'Step Challenge' | 'Calorie Burn' | 'Zone 2 Endurance' | 'Workout Streak';
  description: string;
  participantsCount: number;
  daysRemaining: number;
  goalTarget: number;
  unit: string;
  userProgress: number;
  leaderboard: {
    rank: number;
    name: string;
    avatar: string;
    score: number;
    isUser?: boolean;
  }[];
}

export interface WorkoutHistoryRecord {
  id: string;
  routineId?: string;
  routineTitle: string;
  category: 'Strength' | 'HIIT' | 'Hypertrophy' | 'Active Recovery' | 'Endurance';
  date: string; // YYYY-MM-DD
  timestamp: string; // e.g. "2026-08-24 09:15 AM"
  durationMins: number;
  caloriesBurned: number;
  avgHR: number;
  maxHR: number;
  isGuest: boolean;
  athleteName: string;
  guestTag?: string; // e.g. "Guest #102" or "Guest - Jordan"
  guestNotes?: string;
  exercisesCompleted: {
    name: string;
    sets: number;
    reps: string;
    weightKg?: number;
    muscleGroup?: string;
  }[];
  aiFeedbackSummary?: string;
  perceivedEffort?: number; // 1-10 RPE scale
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'athlete' | 'coach' | 'admin' | 'guest';
  avatarUrl?: string;
  fitnessGoal?: FitnessGoal;
  fitnessLevel?: FitnessLevel;
  lastLogin?: string;
  isGuest?: boolean;
}

export type AgentCategory =
  | 'general'
  | 'document'
  | 'slides'
  | 'sheets'
  | 'developer'
  | 'podcasts'
  | 'youvibe';

export type GalleryFilterType = 'image' | 'video' | 'voice' | 'content';

export interface CaseGalleryItem {
  id: string;
  title: string;
  category: AgentCategory;
  mediaType: GalleryFilterType;
  subtitle?: string;
  tags: string[];
  prompt: string;
  description: string;
  toolsUsed: string[];
  executionTime: string;
  sampleOutput: {
    type: 'markdown' | 'code' | 'slides' | 'table' | 'audio';
    content: string;
  };
}

