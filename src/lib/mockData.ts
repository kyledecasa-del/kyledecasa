import {
  UserProfile,
  WorkoutRoutine,
  RecoveryMetric,
  DailyNutrition,
  WearableDevice,
  WeeklyProgressReport,
  SocialChallenge,
  WorkoutHistoryRecord
} from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Alex Rivera',
  age: 28,
  weightKg: 76,
  heightCm: 178,
  gender: 'male',
  goal: 'muscle_gain',
  fitnessLevel: 'intermediate',
  restingHR: 56,
  maxHR: 188,
  dailyCalorieTarget: 2650,
  targetProteinG: 175,
  targetCarbsG: 280,
  targetFatG: 70,
  targetWaterMl: 3500,
  connectedDevices: ['apple_watch_ultra', 'whoop_4']
};

export const initialRoutines: WorkoutRoutine[] = [
  {
    id: 'routine_hypertrophy_push',
    title: 'AI Hypertrophy - Push & Core',
    category: 'Hypertrophy',
    difficulty: 'intermediate',
    durationMins: 45,
    estimatedCalories: 380,
    focusArea: 'Chest, Shoulders, Triceps, Abs',
    aiReasoning: 'Customized based on 84% readiness score. Pushing chest & shoulder volume while avoiding lower body overload due to high quad fatigue.',
    createdAt: '2026-07-27',
    exercises: [
      {
        id: 'ex_1',
        name: 'Incline Dumbbell Bench Press',
        sets: 4,
        reps: '8-10',
        weightKg: 28,
        targetZone: 'Zone 3 (Aerobic)',
        restPeriodSec: 90,
        instructions: 'Focus on 3-second negative eccentric phase. Maintain steady breathing.',
        muscleGroup: 'Chest'
      },
      {
        id: 'ex_2',
        name: 'Seated Overhead Dumbbell Press',
        sets: 3,
        reps: '10-12',
        weightKg: 20,
        targetZone: 'Zone 3 (Aerobic)',
        restPeriodSec: 75,
        instructions: 'Keep core engaged, do not arch lower back at top lockout.',
        muscleGroup: 'Shoulders'
      },
      {
        id: 'ex_3',
        name: 'Cable Chest Flyes (Mid-Height)',
        sets: 3,
        reps: '12-15',
        weightKg: 15,
        targetZone: 'Zone 2 (Fat Burn)',
        restPeriodSec: 60,
        instructions: 'Peak contraction at center for 1.5 seconds per repetition.',
        muscleGroup: 'Chest'
      },
      {
        id: 'ex_4',
        name: 'Rope Tricep Pushdowns',
        sets: 4,
        reps: '12',
        weightKg: 22.5,
        targetZone: 'Zone 2 (Fat Burn)',
        restPeriodSec: 60,
        instructions: 'Flare ropes outwards at the bottom of movement.',
        muscleGroup: 'Triceps'
      },
      {
        id: 'ex_5',
        name: 'Hanging Knee Raises',
        sets: 3,
        reps: '15',
        targetZone: 'Zone 2 (Fat Burn)',
        restPeriodSec: 45,
        instructions: 'Avoid swinging momentum. Squeeze abdominal wall at apex.',
        muscleGroup: 'Core'
      }
    ]
  },
  {
    id: 'routine_hiit_fatburn',
    title: 'AI Real-Time Adapt - HIIT Endurance Burn',
    category: 'HIIT',
    difficulty: 'intermediate',
    durationMins: 30,
    estimatedCalories: 340,
    focusArea: 'Full Body Cardiovascular & Metabolic Rate',
    aiReasoning: 'Designed with dynamic heart rate throttling. The system will auto-adjust rest periods if HR exceeds Zone 4 (>165 BPM) for longer than 60s.',
    createdAt: '2026-07-26',
    exercises: [
      {
        id: 'ex_hiit_1',
        name: 'Kettlebell Swings',
        sets: 4,
        reps: '45 sec',
        weightKg: 20,
        targetZone: 'Zone 4 (Anaerobic)',
        restPeriodSec: 30,
        instructions: 'Explosive hip hinge. Drive through glutes.',
        muscleGroup: 'Full Body'
      },
      {
        id: 'ex_hiit_2',
        name: 'Rowing Ergometer Sprints',
        sets: 4,
        reps: '250 meters',
        targetZone: 'Zone 4 (Anaerobic)',
        restPeriodSec: 45,
        instructions: 'Drive hard through heels, smooth return.',
        muscleGroup: 'Back & Legs'
      },
      {
        id: 'ex_hiit_3',
        name: 'Plyometric Box Jumps',
        sets: 3,
        reps: '12 reps',
        targetZone: 'Zone 3 (Aerobic)',
        restPeriodSec: 40,
        instructions: 'Soft landing in full squat stance.',
        muscleGroup: 'Legs'
      }
    ]
  },
  {
    id: 'routine_zone2_recovery',
    title: 'AI Active Recovery - Zone 2 & Mobility',
    category: 'Active Recovery',
    difficulty: 'beginner',
    durationMins: 35,
    estimatedCalories: 190,
    focusArea: 'Joint Mobility, Blood Flow, Parasympathetic Activation',
    aiReasoning: 'Auto-recommended on low HRV days. Keeps heart rate in Zone 1-2 (110-130 BPM) to accelerate lactate clearance without strain.',
    createdAt: '2026-07-25',
    exercises: [
      {
        id: 'ex_rec_1',
        name: 'Incline Treadmill Zone 2 Walk',
        sets: 1,
        reps: '20 mins',
        targetZone: 'Zone 2 (Fat Burn)',
        restPeriodSec: 0,
        instructions: 'Maintain 5.5% incline at 5.0 km/h. Nasal breathing only.',
        muscleGroup: 'Cardiovascular'
      },
      {
        id: 'ex_rec_2',
        name: 'Thoracic Spine Mobility & Cat-Cow',
        sets: 3,
        reps: '10 slow breaths',
        targetZone: 'Zone 1 (Warmup)',
        restPeriodSec: 30,
        instructions: 'Slow sync with deep diaphragmatic inhalations.',
        muscleGroup: 'Back & Core'
      }
    ]
  }
];

export const initialRecoveryMetric: RecoveryMetric = {
  id: 'rec_today',
  date: '2026-07-27',
  readinessScore: 84,
  hrvMs: 72,
  sleepHours: 7.6,
  sleepQualityScore: 88,
  strainScore: 11.4,
  injuryRisk: 'Low',
  muscleFatigue: {
    chest: 25,
    back: 30,
    quads: 75,
    hamstrings: 60,
    shoulders: 20,
    biceps: 15,
    triceps: 35,
    core: 20
  },
  aiRecoverySummary: 'High autonomic recovery detected! Your HRV is 12% above your 7-day baseline (64ms). Your lower body (quads/hamstrings) retains moderate fatigue from Saturday heavy squats.',
  recommendedActivity: 'Optimal day for upper-body hypertrophy or pushing movements. Keep heavy squatting to tomorrow.'
};

export const initialNutrition: DailyNutrition = {
  date: '2026-07-27',
  waterMl: 2600,
  meals: [
    {
      id: 'meal_1',
      time: '08:15 AM',
      name: 'Oatmeal with Whey Protein, Chia Seeds & Blueberries',
      mealType: 'Breakfast',
      calories: 520,
      proteinG: 42,
      carbsG: 62,
      fatG: 12,
      aiNutritionalTip: 'Excellent complex carbohydrate & protein ratio prior to mid-day workout.'
    },
    {
      id: 'meal_2',
      time: '01:00 PM',
      name: 'Grilled Salmon Bowl with Jasmine Rice & Steamed Broccoli',
      mealType: 'Lunch',
      calories: 680,
      proteinG: 48,
      carbsG: 65,
      fatG: 22,
      aiNutritionalTip: 'High Omega-3 content aids in reducing exercise-induced muscle inflammation.'
    },
    {
      id: 'meal_3',
      time: '05:30 PM',
      name: 'Greek Yogurt with Honey & Almonds',
      mealType: 'Snack',
      calories: 310,
      proteinG: 24,
      carbsG: 28,
      fatG: 10,
      aiNutritionalTip: 'Slow-digesting casein protein supports steady muscle protein synthesis.'
    }
  ]
};

export const initialWearableDevices: WearableDevice[] = [
  {
    id: 'apple_watch_ultra',
    name: 'Apple Watch Ultra 2',
    type: 'Apple Watch',
    connected: true,
    batteryLevel: 82,
    lastSyncTime: 'Just now',
    liveHeartRate: 64,
    stepsToday: 8420,
    activeCaloriesToday: 510,
    hrvLatest: 72,
    sleepScoreLatest: 88
  },
  {
    id: 'whoop_4',
    name: 'WHOOP Strap 4.0',
    type: 'WHOOP',
    connected: true,
    batteryLevel: 68,
    lastSyncTime: '2 mins ago',
    liveHeartRate: 65,
    stepsToday: 8415,
    activeCaloriesToday: 525,
    hrvLatest: 74,
    sleepScoreLatest: 86
  },
  {
    id: 'garmin_forerunner',
    name: 'Garmin Forerunner 965',
    type: 'Garmin',
    connected: false,
    batteryLevel: 94,
    lastSyncTime: 'Yesterday, 10:45 PM',
    liveHeartRate: 0,
    stepsToday: 0,
    activeCaloriesToday: 0,
    hrvLatest: 68,
    sleepScoreLatest: 82
  },
  {
    id: 'oura_ring_gen3',
    name: 'Oura Ring Horizon',
    type: 'Oura Ring',
    connected: false,
    batteryLevel: 45,
    lastSyncTime: '3 hours ago',
    liveHeartRate: 0,
    stepsToday: 7920,
    activeCaloriesToday: 480,
    hrvLatest: 70,
    sleepScoreLatest: 90
  }
];

export const initialWeeklyReport: WeeklyProgressReport = {
  id: 'report_w30',
  weekRange: 'Jul 21 - Jul 27, 2026',
  totalWorkouts: 5,
  totalMinutes: 215,
  totalCalories: 2340,
  avgReadiness: 81,
  avgHRV: 71,
  macroAdherencePct: 92,
  keyMilestones: [
    'Reached new 8-rep personal record on Dumbbell Incline Press (28kg)',
    'Maintained 100% hydration target for 6 consecutive days',
    'Zone 2 Cardio efficiency improved by 4.2% lower average HR'
  ],
  aiComprehensiveAnalysis: 'Outstanding progression this week! Your progressive overload in hypertrophy routines resulted in a 6.5% total volume increase without excessive central nervous system fatigue. Recovery scores remained consistent around 81%. Nutritional adherence was spot on with a 92% macro target compliance.',
  aiNextWeekStrategy: 'For next week, we will introduce a slight deload on lower body movements to flush out accumulated quad strain while increasing upper body shoulder volume by 1 set per exercise.'
};

export const initialSocialChallenges: SocialChallenge[] = [
  {
    id: 'challenge_1',
    title: 'Summer 70K Step Conquest',
    category: 'Step Challenge',
    description: 'Crush 70,000 steps over 7 days while keeping average resting HR low.',
    participantsCount: 1420,
    daysRemaining: 3,
    goalTarget: 70000,
    unit: 'steps',
    userProgress: 58940,
    leaderboard: [
      { rank: 1, name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', score: 68400 },
      { rank: 2, name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', score: 64200 },
      { rank: 3, name: 'Alex Rivera (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', score: 58940, isUser: true },
      { rank: 4, name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', score: 54100 },
      { rank: 5, name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', score: 51200 }
    ]
  },
  {
    id: 'challenge_2',
    title: 'Zone 2 Heart Rate Mastery',
    category: 'Zone 2 Endurance',
    description: 'Log 150 minutes in Zone 2 Fat Burn HR zone (115-135 BPM) to boost mitochondrial density.',
    participantsCount: 890,
    daysRemaining: 5,
    goalTarget: 150,
    unit: 'mins',
    userProgress: 110,
    leaderboard: [
      { rank: 1, name: 'Alex Rivera (You)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', score: 110, isUser: true },
      { rank: 2, name: 'Liam Davies', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', score: 105 },
      { rank: 3, name: 'Maya Lin', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', score: 95 }
    ]
  }
];

export const initialWorkoutHistory: WorkoutHistoryRecord[] = [
  {
    id: 'hist_guest_01',
    routineId: 'routine_hypertrophy_push',
    routineTitle: 'AI Hypertrophy - Push & Core',
    category: 'Hypertrophy',
    date: '2026-08-23',
    timestamp: '2026-08-23 10:45 AM',
    durationMins: 42,
    caloriesBurned: 360,
    avgHR: 138,
    maxHR: 168,
    isGuest: true,
    athleteName: 'Guest - Jordan Miller',
    guestTag: 'Guest #101',
    guestNotes: 'Guest visitor trial session. Executed full upper body push routine with excellent tempo control.',
    exercisesCompleted: [
      { name: 'Incline Dumbbell Bench Press', sets: 4, reps: '8-10', weightKg: 24, muscleGroup: 'Chest' },
      { name: 'Seated Overhead Dumbbell Press', sets: 3, reps: '10', weightKg: 18, muscleGroup: 'Shoulders' },
      { name: 'Cable Chest Flyes', sets: 3, reps: '12', weightKg: 12.5, muscleGroup: 'Chest' },
      { name: 'Rope Tricep Pushdowns', sets: 4, reps: '12', weightKg: 20, muscleGroup: 'Triceps' },
      { name: 'Hanging Knee Raises', sets: 3, reps: '15', muscleGroup: 'Core' }
    ],
    aiFeedbackSummary: 'Great pacing on eccentric phases. Recommended increasing rest by 15s between compound sets to maintain Zone 3 aerobic baseline.',
    perceivedEffort: 8
  },
  {
    id: 'hist_guest_02',
    routineId: 'routine_hiit_fatburn',
    routineTitle: 'AI Real-Time Adapt - HIIT Endurance Burn',
    category: 'HIIT',
    date: '2026-08-22',
    timestamp: '2026-08-22 04:15 PM',
    durationMins: 28,
    caloriesBurned: 310,
    avgHR: 152,
    maxHR: 178,
    isGuest: true,
    athleteName: 'Guest - Sarah Thorne',
    guestTag: 'Guest #102',
    guestNotes: 'High-intensity interval trial. Maintained solid stamina across all kettlebell rounds.',
    exercisesCompleted: [
      { name: 'Kettlebell Swings', sets: 4, reps: '45 sec', weightKg: 16, muscleGroup: 'Full Body' },
      { name: 'Rowing Ergometer Sprints', sets: 4, reps: '250m', muscleGroup: 'Back & Legs' },
      { name: 'Plyometric Box Jumps', sets: 3, reps: '12', muscleGroup: 'Legs' }
    ],
    aiFeedbackSummary: 'Peak cardiovascular engagement reached 178 BPM in Round 3. Recovery between sprint sets was fast (<60s).',
    perceivedEffort: 9
  },
  {
    id: 'hist_user_01',
    routineId: 'routine_hypertrophy_push',
    routineTitle: 'AI Hypertrophy - Push & Core',
    category: 'Hypertrophy',
    date: '2026-08-21',
    timestamp: '2026-08-21 07:30 AM',
    durationMins: 48,
    caloriesBurned: 410,
    avgHR: 144,
    maxHR: 172,
    isGuest: false,
    athleteName: 'Alex Rivera',
    guestNotes: 'Main athlete session. Progressive overload on incline press.',
    exercisesCompleted: [
      { name: 'Incline Dumbbell Bench Press', sets: 4, reps: '10', weightKg: 28, muscleGroup: 'Chest' },
      { name: 'Seated Overhead Dumbbell Press', sets: 3, reps: '12', weightKg: 20, muscleGroup: 'Shoulders' },
      { name: 'Cable Chest Flyes', sets: 3, reps: '15', weightKg: 15, muscleGroup: 'Chest' },
      { name: 'Rope Tricep Pushdowns', sets: 4, reps: '12', weightKg: 22.5, muscleGroup: 'Triceps' },
      { name: 'Hanging Knee Raises', sets: 3, reps: '15', muscleGroup: 'Core' }
    ],
    aiFeedbackSummary: 'Hit target rep volume on all 4 sets. 28kg dumbbell felt solid with 3s tempo.',
    perceivedEffort: 8
  },
  {
    id: 'hist_guest_03',
    routineId: 'routine_zone2_recovery',
    routineTitle: 'AI Active Recovery - Zone 2 & Mobility',
    category: 'Active Recovery',
    date: '2026-08-20',
    timestamp: '2026-08-20 06:00 PM',
    durationMins: 35,
    caloriesBurned: 205,
    avgHR: 122,
    maxHR: 134,
    isGuest: true,
    athleteName: 'Guest - Taylor Brooks',
    guestTag: 'Guest #103',
    guestNotes: 'Zone 2 treadmill walk and mobility circuit for active recovery.',
    exercisesCompleted: [
      { name: 'Incline Treadmill Zone 2 Walk', sets: 1, reps: '20 mins', muscleGroup: 'Cardiovascular' },
      { name: 'Thoracic Spine Foam Rolling', sets: 2, reps: '60 sec', muscleGroup: 'Upper Back' },
      { name: 'World\'s Greatest Stretch', sets: 2, reps: '10 each side', muscleGroup: 'Hips & Hamstrings' }
    ],
    aiFeedbackSummary: 'Excellent heart rate stability in Zone 2 (average 122 BPM). Perfect active recovery session.',
    perceivedEffort: 4
  }
];
