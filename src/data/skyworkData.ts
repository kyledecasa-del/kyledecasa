import { CaseGalleryItem } from '../types';

export const INITIAL_CASE_GALLERY: CaseGalleryItem[] = [
  {
    id: 'hypertrophy_strength',
    title: 'Periodized Hypertrophy & Strength System',
    category: 'general',
    mediaType: 'image',
    subtitle: '4-Day upper/lower progressive overload framework with RPE tracking',
    tags: ['Hypertrophy', 'Periodization', 'RPE Scale', 'Strength'],
    prompt: `Design an evidence-based 4-day Upper/Lower progressive overload training split targeting muscle hypertrophy, balancing compound barbell movements with accessory volume and autoregulated RPE targets.`,
    description: `Sports science-backed training program incorporating optimal hypertrophy principles: 12-16 weekly working sets per muscle group, RPE 7-9 proximity to failure, and planned 4th-week deloads.`,
    toolsUsed: ['Biomechanics Engine', 'Volume Periodizer', 'RPE Autoregulator'],
    executionTime: '2.1s',
    sampleOutput: {
      type: 'markdown',
      content: `# 4-Day Periodized Hypertrophy & Strength System

### Program Architecture: Upper / Lower Progressive Overload
Designed for maximum mechanical tension and metabolic stress with manageable systemic fatigue.

| Day | Focus | Primary Lifts | Target Volume | RPE Target |
|---|---|---|---|---|
| **Day 1** | Upper Heavy (Power) | Barbell Bench Press, Barbell Row | 4 sets x 5-8 reps | RPE 8.0 |
| **Day 2** | Lower Heavy (Squat Focus) | Barbell Back Squat, Romanian Deadlift | 4 sets x 6-8 reps | RPE 8.5 |
| **Day 3** | Rest / Active Recovery | Zone 1 Mobility Walk, Hip Decompression | 30-45 mins | RPE 2.0 |
| **Day 4** | Upper Hypertrophy | Incline Dumbbell Press, Lat Pulldowns | 4 sets x 8-12 reps | RPE 8.5 |
| **Day 5** | Lower Hypertrophy (Hinge Focus) | Trap Bar Deadlift, Bulgarian Split Squats | 3-4 sets x 10-12 reps | RPE 9.0 |

### Key Evidence-Based Coaching Rules:
- **Rest Intervals**: 2.5–3.5 minutes on multi-joint compounds (Bench, Squat, Deadlift) to optimize phosphagen resynthesis.
- **Progressive Overload Rule**: Add 1.25–2.5 kg or 1 rep when top set hits ceiling RPE threshold.`
    }
  },
  {
    id: 'biometrics_hr_zones',
    title: 'Biometric Strain & Zone 2 Heart Rate Matrix',
    category: 'general',
    mediaType: 'image',
    subtitle: 'Fat oxidation threshold, HRV recovery scores, and resting HR trend',
    tags: ['Biometrics', 'Zone 2 Cardio', 'HRV Recovery', 'Fat Oxidation'],
    prompt: `Calculate individualized 5-zone cardiovascular training thresholds using Karvonen formula based on resting heart rate, age, and estimate optimal Zone 2 fat oxidation window.`,
    description: `Cardiopulmonary exercise physiology calculation establishing exact BPM boundaries for Zone 1 active recovery through Zone 5 VO2 max intervals.`,
    toolsUsed: ['Karvonen Calculator', 'HRV Strain Analyzer', 'VO2 Max Estimator'],
    executionTime: '1.8s',
    sampleOutput: {
      type: 'markdown',
      content: `# Individualized 5-Zone Cardiovascular Training Matrix

### Cardiovascular Zones (Calculated via Karvonen Formula)
*Based on 28y, 58 BPM Resting HR, 192 BPM Estimated Max HR:*

| Zone | Target Heart Rate | Primary Fuel Substrate | Training Purpose | Ideal Duration |
|---|---|---|---|---|
| **Zone 1** | 112 - 128 BPM | 85% Free Fatty Acids | Active Recovery & Capillarization | 30 - 60 min |
| **Zone 2** | 129 - 146 BPM | Maximal Mitochondrial Fat Oxidation | Aerobic Base & Lactate Clearance | 45 - 90 min |
| **Zone 3** | 147 - 162 BPM | Mixed (Carbs + Lipids) | Aerobic Tempo / Marathon Pace | 25 - 45 min |
| **Zone 4** | 163 - 176 BPM | 80% Glycogen | Lactate Threshold Power | 15 - 25 min |
| **Zone 5** | 177 - 192 BPM | 95% Anaerobic Glycolysis | VO2 Max & Neuromuscular Speed | 3 - 8 min (Intervals) |

### Coaching Insight:
Zone 2 training promotes mitochondrial biogenesis in Type I slow-twitch muscle fibers without producing high central nervous system fatigue.`
    }
  },
  {
    id: 'precision_macro_fueling',
    title: 'Precision Macro & Nutritional Fueling Protocol',
    category: 'general',
    mediaType: 'image',
    subtitle: 'Clean bulking & lean shredding macros with optimal protein timing',
    tags: ['Sports Nutrition', 'Protein Synthesis', 'Macros', 'Meal Timing'],
    prompt: `Construct an evidence-based daily macronutrient distribution for an athlete aiming for lean muscle retention in a moderate 350 kcal deficit with 2.2g/kg protein.`,
    description: `Nutritional physiology plan distributing protein across multiple feeding windows to maintain muscle protein synthesis (MPS) while ensuring adequate fats for hormone synthesis.`,
    toolsUsed: ['Macro Synthesizer', 'Caloric Balance Engine', 'MPS Timing Calculator'],
    executionTime: '2.0s',
    sampleOutput: {
      type: 'markdown',
      content: `# Precision Macro & Nutritional Fueling Blueprint

### Daily Macronutrient Targets (Athlete Bodyweight: 78 kg)
- **Total Energy Target**: 2,350 kcal *(Mild 350 kcal Deficit)*
- **Protein**: 172 g (2.2 g/kg) • 688 kcal (29%)
- **Carbohydrates**: 240 g (3.1 g/kg) • 960 kcal (41%)
- **Fats**: 78 g (1.0 g/kg) • 702 kcal (30%)
- **Daily Hydration**: 3.5 Liters + 500ml per hour of training

### 4-Window Protein Distribution (MPS Optimization)
1. **Breakfast (07:30)**: 40g Protein (Egg whites, oats, whey isolate)
2. **Lunch (12:30)**: 42g Protein (Grilled chicken breast, quinoa, avocado)
3. **Pre/Post Workout (17:00)**: 45g Protein + 65g Fast Carbs (Greek yogurt, banana, rice cakes)
4. **Dinner (20:30)**: 45g Protein (Wild salmon, sweet potato, steamed greens)`
    }
  },
  // Workouts (document) cases
  {
    id: 'doc_ppl_masterplan',
    title: 'Full 12-Week Push/Pull/Legs Hypertrophy Master Plan',
    category: 'document',
    mediaType: 'content',
    subtitle: 'Complete 3-phase periodized hypertrophy blueprint with auto-deloads',
    tags: ['Push Pull Legs', 'Hypertrophy', 'Periodization', '12-Week'],
    prompt: 'Generate a 12-week Push/Pull/Legs training program with wave loading and weekly volume progression.',
    description: 'Structured 3-phase plan balancing compound barbell loading with targeted hypertrophy isolation.',
    toolsUsed: ['Volume Periodizer', 'Deload Architect'],
    executionTime: '2.6s',
    sampleOutput: {
      type: 'markdown',
      content: `# 12-Week Push/Pull/Legs Periodization Protocol\n\n### Phase 1 (Weeks 1-4): Anatomical Adaptation & Base Volume\n- Push: Bench Press (4x8), OHP (3x10), Incline DB (3x12), Lateral Raises (4x15)\n- Pull: Barbell Row (4x8), Lat Pulldown (3x10), Facepulls (4x15), Bicep Curls (3x12)\n- Legs: Back Squat (4x8), Romanian Deadlift (3x10), Leg Press (3x12), Standing Calf (4x15)`
    }
  },
  // Nutrition (slides) cases
  {
    id: 'slides_meal_plan',
    title: '7-Day High-Protein Anti-Inflammatory Meal Plan',
    category: 'slides',
    mediaType: 'content',
    subtitle: 'Clean nutritional fueling for accelerated muscle tissue repair',
    tags: ['Anti-Inflammatory', 'High Protein', 'Recovery Meal Prep'],
    prompt: 'Create a high-protein 7-day meal plan rich in omega-3 fatty acids and antioxidants for joint recovery.',
    description: 'Detailed whole-foods meal prep strategy designed to reduce exercise-induced oxidative stress.',
    toolsUsed: ['Sports Nutrition Synthesizer', 'Micronutrient Evaluator'],
    executionTime: '1.9s',
    sampleOutput: {
      type: 'slides',
      content: 'Day 1: Wild Alaskan Salmon with Quinoa & Steamed Asparagus (48g Protein)\nDay 2: Grass-Fed Flank Steak with Roasted Sweet Potatoes & Baby Spinach (52g Protein)\nDay 3: Turmeric Ginger Grilled Chicken with Brown Rice & Broccoli (46g Protein)'
    }
  },
  // Biometrics (sheets) cases
  {
    id: 'sheets_wearable_metrics',
    title: 'Wearable Telemetry: HRV Strain & Sleep Recovery Analysis',
    category: 'sheets',
    mediaType: 'content',
    subtitle: 'Correlation matrix between deep sleep percentage, HRV, and workout output',
    tags: ['Biometrics', 'HRV', 'Sleep Tracking', 'Strain Score'],
    prompt: 'Analyze weekly wearable data correlating resting HR, HRV readiness scores, and training volume.',
    description: 'Tabular analysis isolating overtraining indicators before central nervous system fatigue peaks.',
    toolsUsed: ['Biometrics Ingestion Tool', 'Strain Correlation Engine'],
    executionTime: '1.6s',
    sampleOutput: {
      type: 'table',
      content: 'Day | Sleep Duration | Deep Sleep % | HRV Readiness | Day Strain | Recommended Action\nMon | 7h 45m | 22% | 88/100 | 14.2 | High Intensity Upper Lift\nTue | 8h 10m | 24% | 94/100 | 16.5 | Heavy Lower Squat Session\nWed | 6h 15m | 14% | 52/100 | 8.0 | Active Recovery / Zone 1 Walk\nThu | 8h 00m | 21% | 85/100 | 13.8 | Moderate Push Hypertrophy'
    }
  },
  // Biomechanics (developer) cases
  {
    id: 'dev_shoulder_rehab',
    title: 'Exercise Biomechanics & Shoulder Impingement Pre-Hab',
    category: 'developer',
    mediaType: 'content',
    subtitle: 'Scapulohumeral rhythm correction, rotator cuff pre-hab, and overhead press modifications',
    tags: ['Biomechanics', 'Joint Health', 'Rotator Cuff', 'Injury Prevention'],
    prompt: 'Formulate a biomechanically sound shoulder warm-up and overhead press modification routine for anterior shoulder impingement.',
    description: 'Corrective exercise protocol focusing on serratus anterior activation and external rotator strength.',
    toolsUsed: ['Kinesiology Modeler', 'Joint Kinematic Validator'],
    executionTime: '1.8s',
    sampleOutput: {
      type: 'code',
      content: `// Biomechanical Pre-Hab Routine for Healthy Shoulders:
const shoulderPreHab = [
  { exercise: "Banded No-Moneys (External Rotation)", sets: 3, reps: 15, cue: "Keep elbows pinned to ribs" },
  { exercise: "Wall Slides with Serratus Reach", sets: 3, reps: 12, cue: "Protracted scapula at top" },
  { exercise: "Prone Y-T-W Raises on Incline", sets: 3, reps: 10, cue: "Depress scapula before initiating lift" },
  { exercise: "Landmine Press (Replaces Barbell Overhead)", sets: 3, reps: 10, cue: "Scapular plane at 45 degrees" }
];`
    }
  },
  // Audio Pacer (podcasts) cases
  {
    id: 'podcast_hiit_coach',
    title: 'HIIT Voice Pacer: 30s Sprint / 60s Recovery Audio Coaching',
    category: 'podcasts',
    mediaType: 'voice',
    subtitle: 'Real-time audio pacing cues, cadence metronome, and effort coaching',
    tags: ['Audio Pacer', 'Voice Coaching', 'Intervals', 'HIIT'],
    prompt: 'Generate an audio voice pacing script for an 8-round HIIT interval session with countdowns and form cues.',
    description: 'Dynamic voice guidance modulating cadence, reminding diaphragmatic breathing, and driving explosive power.',
    toolsUsed: ['Audio Pacer HD', 'Cadence Metronome Engine'],
    executionTime: '3.8s',
    sampleOutput: {
      type: 'audio',
      content: 'Coach Voice: "Sprint interval starts in 3... 2... 1... Explosive drive! High knees, pump the arms for 30 seconds!"\nCoach Voice: "10 seconds left, hold your form! ... Good, transition into 60s Zone 1 nasal recovery."'
    }
  },
  // Reel Motivate (youvibe) cases
  {
    id: 'youvibe_squat_form',
    title: 'Squat Form Breakdown: Bar Path & Hip Hinge Visual Cues',
    category: 'youvibe',
    mediaType: 'video',
    subtitle: 'Biomechanical video analysis breaking down knee tracking and bar path verticality',
    tags: ['Form Analysis', 'Squat Technique', 'Video Breakdown'],
    prompt: 'Create a video form guide illustrating bar path, foot tripod pressure, and hip hinge kinematics in the barbell back squat.',
    description: 'Frame-by-frame visual cues illustrating pelvic neutrality, knee drive, and foot grounding.',
    toolsUsed: ['Kinematic Vision AI', 'Motion Tracking Synthesizer'],
    executionTime: '3.2s',
    sampleOutput: {
      type: 'markdown',
      content: '00:00 - Setup: Tripod foot pressure (big toe, pinky toe, heel rooted).\n00:08 - Descent: Simultaneous knee flexion and hip hinge maintaining neutral spine.\n00:15 - Depth: Hip crease slightly below parallel while maintaining thoracic rigidity.\n00:22 - Drive: Drive floor away with vertical bar path directly over midfoot.'
    }
  }
];

export const AGENT_MODES_CONFIG = [
  {
    id: 'general' as const,
    label: 'Coach AI',
    description: 'Comprehensive evidence-based AI coach for training, nutrition, and recovery',
    placeholder: 'Ask anything: e.g. "Create a 4-day hypertrophy split", "Calculate my Zone 2 HR", type @ for biometrics',
    iconColor: 'bg-gradient-to-tr from-purple-600 to-fuchsia-400 text-white shadow-[0_0_18px_rgba(217,70,239,0.5)]',
    badgeColor: 'border-fuchsia-500/40 text-fuchsia-300'
  },
  {
    id: 'document' as const,
    label: 'Workouts',
    description: 'Hypertrophy splits, progressive overload routines, strength, and HIIT programs',
    placeholder: 'Specify your training split, days per week, available equipment, and fitness goal...',
    iconColor: 'bg-[#182142] border border-blue-500/40 text-blue-400 hover:text-white',
    badgeColor: 'border-blue-500/40 text-blue-300'
  },
  {
    id: 'slides' as const,
    label: 'Nutrition',
    description: 'Macronutrient targets, meal timing, hydration plans, and sports supplements',
    placeholder: 'Enter current weight, goal (cut/bulk/recomp), dietary preferences, and allergies...',
    iconColor: 'bg-[#2a1420] border border-rose-500/40 text-rose-400 hover:text-white',
    badgeColor: 'border-rose-500/40 text-rose-300'
  },
  {
    id: 'sheets' as const,
    label: 'Biometrics',
    description: 'Heart rate zones, HRV recovery scores, sleep optimization, and wearable sync',
    placeholder: 'Enter resting HR, age, wearable strain scores, or reference @biometrics...',
    iconColor: 'bg-[#0e2a1e] border border-emerald-500/40 text-emerald-400 hover:text-white',
    badgeColor: 'border-emerald-500/40 text-emerald-300'
  },
  {
    id: 'developer' as const,
    label: 'Biomechanics',
    description: 'Exercise joint kinetics, form correction, mobility routines, and injury prevention',
    placeholder: 'Describe joint pain, exercise form issue, or mobility limitation (e.g. tight hips, shoulder pain)...',
    iconColor: 'bg-[#1c1438] border border-violet-500/40 text-violet-400 hover:text-white',
    badgeColor: 'border-violet-500/40 text-violet-300'
  },
  {
    id: 'podcasts' as const,
    label: 'Audio Pacer',
    description: 'Voice-guided workout interval cues, tempo metronomes, and motivational cadence',
    placeholder: 'Enter interval protocol (e.g. Tabata 20/10), workout duration, and vocal intensity...',
    iconColor: 'bg-[#0c242c] border border-cyan-500/40 text-cyan-400 hover:text-white',
    badgeColor: 'border-cyan-500/40 text-cyan-300'
  },
  {
    id: 'youvibe' as const,
    label: 'Reel Motivate',
    description: 'Form breakdown reels, athlete mindset cues, and PR celebration highlights',
    placeholder: 'Describe exercise to analyze form, target lift PR, or athlete motivation theme...',
    iconColor: 'bg-[#2e0f16] border border-red-500/40 text-red-400 hover:text-white',
    badgeColor: 'border-red-500/40 text-red-300'
  }
];
