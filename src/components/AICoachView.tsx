import React, { useState } from 'react';
import { UserProfile, WorkoutRoutine, DailyNutrition } from '../types';
import {
  Sparkles,
  Bot,
  User,
  Send,
  CheckCircle2,
  Calendar,
  Dumbbell,
  Utensils,
  ShoppingBag,
  HeartPulse,
  LineChart,
  MessageSquare,
  Award,
  ChevronRight,
  Flame,
  Droplet,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface AICoachViewProps {
  profile: UserProfile;
  nutrition: DailyNutrition;
  routines: WorkoutRoutine[];
  onUpdateProfile: (updated: UserProfile) => void;
}

interface QuestionStep {
  key: string;
  category: 'About Me' | 'My Goals' | 'Fitness Experience' | 'Workout Preferences' | 'Nutrition' | 'Lifestyle';
  question: string;
  placeholder: string;
  options?: string[];
}

const ONBOARDING_QUESTIONS: QuestionStep[] = [
  {
    key: 'name',
    category: 'About Me',
    question: "What is your name?",
    placeholder: "e.g. Alex Johnson"
  },
  {
    key: 'age',
    category: 'About Me',
    question: "How old are you?",
    placeholder: "e.g. 28"
  },
  {
    key: 'gender',
    category: 'About Me',
    question: "What is your gender?",
    placeholder: "Select or type...",
    options: ['Male', 'Female', 'Non-Binary', 'Prefer not to say']
  },
  {
    key: 'height',
    category: 'About Me',
    question: "How tall are you?",
    placeholder: "e.g. 175 cm or 5 ft 9 in"
  },
  {
    key: 'weight',
    category: 'About Me',
    question: "What is your current weight?",
    placeholder: "e.g. 78 kg or 172 lbs"
  },
  {
    key: 'goalWeight',
    category: 'About Me',
    question: "What is your goal weight? (if you have one)",
    placeholder: "e.g. 70 kg or 154 lbs"
  },
  {
    key: 'primaryGoal',
    category: 'My Goals',
    question: "What primary goal do you want to achieve?",
    placeholder: "Select your main target",
    options: ['Lose weight', 'Build muscle', 'Tone my body', 'Gain strength', 'Improve fitness', 'Increase endurance', 'Boost energy', 'Improve overall health']
  },
  {
    key: 'timeline',
    category: 'My Goals',
    question: "When would you like to reach your goal?",
    placeholder: "e.g. In 12 weeks / 3 months"
  },
  {
    key: 'motivationWhy',
    category: 'My Goals',
    question: "Why is this goal important to you?",
    placeholder: "e.g. To feel energized, healthier, and confident in my body"
  },
  {
    key: 'workoutExperience',
    category: 'Fitness Experience',
    question: "Have you worked out before and what is your fitness experience level?",
    placeholder: "Select your level",
    options: ['Beginner (New to training)', 'Intermediate (Some experience)', 'Advanced (Consistent lifter/runner)']
  },
  {
    key: 'dailyActivity',
    category: 'Fitness Experience',
    question: "How active are you during a typical day?",
    placeholder: "e.g. Sedentary desk job / Moderately active / Very active"
  },
  {
    key: 'weeklyDays',
    category: 'Fitness Experience',
    question: "How many days per week can you work out, and how long per session?",
    placeholder: "e.g. 4 days a week, 45 minutes per session",
    options: ['3 days / 30 mins', '4 days / 45 mins', '5 days / 60 mins', '6 days / 60 mins']
  },
  {
    key: 'locationEquipment',
    category: 'Workout Preferences',
    question: "Do you work out at home or in a gym, and what equipment do you have?",
    placeholder: "e.g. Home with dumbbells & bands / Commercial Gym with full racks"
  },
  {
    key: 'preferredTypes',
    category: 'Workout Preferences',
    question: "What types of workouts do you enjoy or dislike? Any injuries or pain?",
    placeholder: "e.g. Enjoy strength & HIIT; dislike long distance running. No knee pain."
  },
  {
    key: 'eatingHabits',
    category: 'Nutrition',
    question: "What does a typical day of eating look like, and how many meals do you eat?",
    placeholder: "e.g. 3 meals + 1 protein shake; oatmeal breakfast, chicken salad lunch"
  },
  {
    key: 'dietaryRestrictions',
    category: 'Nutrition',
    question: "Do you follow any diet or have food allergies/restrictions?",
    placeholder: "Select or describe...",
    options: ['None / Balanced Diet', 'High Protein', 'Keto / Low Carb', 'Vegetarian / Vegan', 'Lactose Free / Gluten Free']
  },
  {
    key: 'dailyWater',
    category: 'Nutrition',
    question: "How much water do you drink daily?",
    placeholder: "e.g. 2.5 Liters (about 8-10 glasses)"
  },
  {
    key: 'lifestyleFactors',
    category: 'Lifestyle',
    question: "How many hours do you sleep, and rate your stress level (1–10)?",
    placeholder: "e.g. 7.5 hours sleep, Stress level: 4/10"
  }
];

export const AICoachView: React.FC<AICoachViewProps> = ({
  profile,
  nutrition,
  routines,
  onUpdateProfile
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'coach' | 'user'; text: string; time: string }>>([
    {
      sender: 'coach',
      text: "👋 Hello! I am your friendly AI Fitness Coach, Personal Trainer, Nutrition Coach, and Wellness Partner! My mission is to help you become healthier, stronger, and more confident with an evidence-based plan tailored specifically to your lifestyle.\n\nLet's get to know you step-by-step so I can craft your custom plan. First question: What is your name?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [isPlanGenerated, setIsPlanGenerated] = useState(false);
  const [activePlanTab, setActivePlanTab] = useState<'overview' | 'workout' | 'nutrition' | 'mealplan' | 'grocery' | 'recovery' | 'tracking'>('overview');
  
  // Daily check-in simulator state
  const [checkInWorkout, setCheckInWorkout] = useState<string>('yes');
  const [checkInEnergy, setCheckInEnergy] = useState<string>('great');
  const [checkInNotes, setCheckInNotes] = useState<string>('');
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);

  const currentQuestion = ONBOARDING_QUESTIONS[currentStepIndex];

  const handleAnswerSubmit = (valueToSubmit?: string) => {
    const value = valueToSubmit || currentInput.trim();
    if (!value) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const updatedAnswers = { ...answers, [currentQuestion.key]: value };
    setAnswers(updatedAnswers);

    // Add user message to chat history
    const newChat = [
      ...chatHistory,
      { sender: 'user' as const, text: value, time: timeStr }
    ];

    setCurrentInput('');

    if (currentStepIndex < ONBOARDING_QUESTIONS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      const nextQ = ONBOARDING_QUESTIONS[nextIndex];
      setCurrentStepIndex(nextIndex);

      newChat.push({
        sender: 'coach',
        text: `Got it! Thank you. 😊\n\nNext [${nextQ.category}]: ${nextQ.question}`,
        time: timeStr
      });
      setChatHistory(newChat);
    } else {
      // Completed all questions -> Generate Plan!
      newChat.push({
        sender: 'coach',
        text: "🎉 Fantastic! I have gathered all your biometric, fitness, and lifestyle information. Generating your personalized, science-backed workout routine, 7-day meal plan, grocery list, and recovery strategy now!",
        time: timeStr
      });
      setChatHistory(newChat);
      setIsPlanGenerated(true);

      // Update user profile with learned parameters
      onUpdateProfile({
        ...profile,
        name: updatedAnswers.name || profile.name,
        targetWeightKg: parseFloat(updatedAnswers.goalWeight) || profile.targetWeightKg,
        dailyCalorieGoal: updatedAnswers.primaryGoal?.includes('weight') ? 2100 : 2600,
        fitnessGoal: updatedAnswers.primaryGoal || profile.fitnessGoal
      });
    }
  };

  const handleRestartOnboarding = () => {
    setCurrentStepIndex(0);
    setAnswers({});
    setIsPlanGenerated(false);
    setChatHistory([
      {
        sender: 'coach',
        text: "👋 Welcome back! Let's restart our consultation step-by-step. What is your name?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-xl shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Bot className="w-7 h-7" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider">
                  Adaptive AI Wellness Companion
                </span>
                <span className="flex items-center gap-1 text-[10px] text-cyan-400 font-mono">
                  <Sparkles className="w-3 h-3" /> Evidence-Based
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-slate-100 mt-1">
                Your AI Fitness & Nutrition Coach
              </h1>
              <p className="text-xs text-slate-400 max-w-2xl mt-1">
                Personalized workout plans, 7-day meal targets, grocery lists, and daily motivational check-ins built specifically for your body and goals.
              </p>
            </div>
          </div>

          {isPlanGenerated && (
            <button
              onClick={handleRestartOnboarding}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
              <span>Retake Consultation</span>
            </button>
          )}
        </div>
      </div>

      {!isPlanGenerated ? (
        /* STEP 1: Interactive Chat Consultation Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Chat Window */}
          <div className="lg:col-span-8 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col h-[600px] shadow-2xl">
            
            {/* Consultation Progress Bar */}
            <div className="border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">
                  Step 1: Consultation Progress ({currentStepIndex + 1} / {ONBOARDING_QUESTIONS.length})
                </span>
                <span className="text-emerald-400 font-mono font-bold">
                  {Math.round(((currentStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / ONBOARDING_QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {chatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.sender === 'coach'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {msg.sender === 'coach' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'coach'
                        ? 'bg-slate-950 text-slate-200 border border-slate-800 shadow-md whitespace-pre-wrap'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-medium shadow-lg'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block text-[9px] mt-2 font-mono ${
                        msg.sender === 'coach' ? 'text-slate-500' : 'text-slate-900/70'
                      }`}
                    >
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box / Options Bar */}
            <div className="border-t border-slate-800 pt-4 mt-4 space-y-3">
              
              {/* Preset Pill Options if available */}
              {currentQuestion.options && (
                <div className="flex flex-wrap gap-2">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswerSubmit(opt)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/40 text-xs font-medium text-slate-200 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit()}
                  placeholder={currentQuestion.placeholder}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  onClick={() => handleAnswerSubmit()}
                  disabled={!currentInput.trim()}
                  className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Current Category Info Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" />
                <span>Why We Ask</span>
              </div>
              <h3 className="text-sm font-extrabold text-slate-100">
                Category: {currentQuestion.category}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Collecting accurate biometric and lifestyle data allows your AI coach to calculate scientifically sound Basal Metabolic Rates (BMR), target heart rate zones, and safe progressive strength loading.
              </p>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>Evidence-Based Guarantee</span>
                </div>
                <ul className="text-slate-400 space-y-1 text-[11px] list-disc list-inside">
                  <li>No crash diets below 1,200 kcal</li>
                  <li>Gradual weight loss (0.5–1 kg/week)</li>
                  <li>Adaptive fatigue monitoring</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* STEP 2: Full Generated Personalized Plan */
        <div className="space-y-6">
          
          {/* Plan Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 pb-3">
            {[
              { id: 'overview', label: 'Overview & Goals', icon: User },
              { id: 'workout', label: 'Workout Schedule', icon: Dumbbell },
              { id: 'nutrition', label: 'Nutrition & Macros', icon: Utensils },
              { id: 'mealplan', label: '7-Day Meal Plan', icon: Calendar },
              { id: 'grocery', label: 'Grocery List', icon: ShoppingBag },
              { id: 'recovery', label: 'Recovery & Sleep', icon: HeartPulse },
              { id: 'tracking', label: 'Daily Check-in', icon: CheckCircle2 }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activePlanTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePlanTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Fitness Overview */}
          {activePlanTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <User className="w-4 h-4" />
                  <span>Biometric Profile</span>
                </div>
                <div className="space-y-2 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Name:</span>
                    <span className="font-extrabold">{answers.name || profile.name}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Age / Gender:</span>
                    <span className="font-extrabold">{answers.age || '28'}, {answers.gender || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-500">Height / Weight:</span>
                    <span className="font-extrabold">{answers.height || '175 cm'} / {answers.weight || '78 kg'}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Goal Weight:</span>
                    <span className="font-extrabold text-emerald-400">{answers.goalWeight || '70 kg'}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                  <Utensils className="w-4 h-4" />
                  <span>Caloric Strategy</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Maintenance (TDEE):</span>
                    <span className="font-bold text-slate-200">2,450 kcal</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Target Daily Intake:</span>
                    <span className="font-extrabold text-emerald-400">2,050 kcal (-400 deficit)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Expected Rate:</span>
                    <span className="font-bold text-cyan-300">~0.5 kg / week</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                  <Award className="w-4 h-4" />
                  <span>Primary Focus</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-black text-slate-100 block">{answers.primaryGoal || 'Fat Loss & Muscle Retention'}</span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    "{answers.motivationWhy || 'To feel energized, healthy, and confident every day.'}"
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Workout Schedule */}
          {activePlanTab === 'workout' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm">
                  <Dumbbell className="w-5 h-5" />
                  <h3>Weekly Adaptive Training Schedule</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  {answers.weeklyDays || '4 Days / Week'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    day: 'Day 1: Upper Body Strength & Hypertrophy',
                    warmup: '5 mins arm circles + band pull-aparts',
                    main: 'Bench Press (3x8), Bent-Over Row (3x10), Overhead Press (3x10)',
                    rest: '90-120 seconds rest between heavy sets',
                    cardio: '15 mins Zone 2 Incline Treadmill Walk',
                    cooldown: 'Chest wall stretch & shoulder mobility'
                  },
                  {
                    day: 'Day 2: Lower Body & Core Power',
                    warmup: '5 mins bodyweight squats & leg swings',
                    main: 'Goblet Squats (4x10), Romanian Deadlifts (3x10), Walking Lunges (3x12/leg)',
                    rest: '90 seconds rest',
                    cardio: '10 mins Stationary Bike easy spin',
                    cooldown: 'Hamstring & hip flexor stretches'
                  },
                  {
                    day: 'Day 3: Active Rest & Recovery',
                    warmup: '10 mins light walk',
                    main: '20 mins full-body foam rolling & yoga mobility flow',
                    rest: 'N/A',
                    cardio: 'Light outdoor walking',
                    cooldown: 'Diaphragmatic deep breathing'
                  },
                  {
                    day: 'Day 4: Push / Pull Hypertrophy',
                    warmup: '5 mins light rowing',
                    main: 'Dumbbell Incline Press (3x10), Lat Pulldowns (3x12), Lateral Raises (3x15)',
                    rest: '60-90 seconds rest',
                    cardio: '15 mins Steady Row',
                    cooldown: 'Upper back & bicep stretches'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                    <h4 className="font-black text-slate-100 text-xs text-emerald-400">{item.day}</h4>
                    <div className="space-y-1 text-xs text-slate-300">
                      <p><strong className="text-slate-400">Warm-up:</strong> {item.warmup}</p>
                      <p><strong className="text-slate-400">Main Exercises:</strong> {item.main}</p>
                      <p><strong className="text-slate-400">Rest Intervals:</strong> {item.rest}</p>
                      <p><strong className="text-slate-400">Cardio:</strong> {item.cardio}</p>
                      <p><strong className="text-slate-400">Cool-down:</strong> {item.cooldown}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Nutrition & Macros */}
          {activePlanTab === 'nutrition' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 text-cyan-400">
                <Utensils className="w-5 h-5" />
                <span>Daily Macro Targets & Hydration</span>
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Calories</span>
                  <p className="text-lg font-black text-emerald-400 font-mono mt-1">2,050 kcal</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Protein</span>
                  <p className="text-lg font-black text-cyan-400 font-mono mt-1">160g</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Carbs</span>
                  <p className="text-lg font-black text-amber-400 font-mono mt-1">190g</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Fats</span>
                  <p className="text-lg font-black text-indigo-400 font-mono mt-1">65g</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 7-Day Meal Plan */}
          {activePlanTab === 'mealplan' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 text-amber-400">
                <Calendar className="w-5 h-5" />
                <span>7-Day Sample Meal Plan</span>
              </h3>

              <div className="space-y-4">
                {[
                  {
                    day: 'Monday & Tuesday',
                    bf: '3 Scrambled Eggs + 1 slice Whole Wheat Toast + 1/2 Avocado',
                    lunch: 'Grilled Chicken Breast (180g) + Quinoa (1 cup) + Steamed Broccoli',
                    dinner: 'Baked Salmon (180g) + Roasted Sweet Potato + Asparagus',
                    snack: 'Greek Yogurt (200g) with Blueberries + 10 Almonds'
                  },
                  {
                    day: 'Wednesday & Thursday',
                    bf: 'Oatmeal (60g) made with Almond Milk + 1 scoop Whey Protein + Chia seeds',
                    lunch: 'Turkey Breast Wrap in Whole Grain Tortilla + Mixed Greens',
                    dinner: 'Lean Beef Stir-fry with Bell Peppers, Onions & Brown Rice',
                    snack: 'Apple slices with 1 tbsp Natural Peanut Butter'
                  },
                  {
                    day: 'Friday & Weekend',
                    bf: 'Protein Smoothie: Spinach, Frozen Berries, Protein Powder, Almond Milk',
                    lunch: 'Tuna Salad Bowl with Olive Oil, Cucumber, Cherry Tomatoes & Beans',
                    dinner: 'Grilled Lean Steak / Tofu + Grilled Zucchini & Roasted Potatoes',
                    snack: 'Cottage Cheese with Sliced Strawberries'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <h4 className="font-extrabold text-amber-400 text-xs">{item.day}</h4>
                    <p><strong className="text-slate-400">Breakfast:</strong> {item.bf}</p>
                    <p><strong className="text-slate-400">Lunch:</strong> {item.lunch}</p>
                    <p><strong className="text-slate-400">Dinner:</strong> {item.dinner}</p>
                    <p><strong className="text-slate-400">Healthy Snack:</strong> {item.snack}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Grocery List */}
          {activePlanTab === 'grocery' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 text-emerald-400">
                <ShoppingBag className="w-5 h-5" />
                <span>Weekly Organized Grocery List</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-emerald-400">Proteins</h4>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Chicken Breast (1 kg)</li>
                    <li>Fresh Salmon Fillets (500g)</li>
                    <li>Extra Lean Ground Turkey / Beef (500g)</li>
                    <li>Greek Yogurt & Eggs (1 dozen)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-cyan-400">Complex Carbs & Grains</h4>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Rolled Oats & Quinoa</li>
                    <li>Sweet Potatoes & Brown Rice</li>
                    <li>Whole Grain Tortilla Wraps</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-amber-400">Produce & Healthy Fats</h4>
                  <ul className="text-slate-300 space-y-1 list-disc list-inside">
                    <li>Spinach, Broccoli, Asparagus</li>
                    <li>Blueberries, Strawberries, Apples</li>
                    <li>Avocados, Almonds, Olive Oil</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: Recovery Tips */}
          {activePlanTab === 'recovery' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 text-purple-400">
                <HeartPulse className="w-5 h-5" />
                <span>Recovery & Sleep Optimization</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-indigo-300">😴 Sleep Hygiene (7.5 - 9 hrs)</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Growth hormone release and muscle repair occur during deep sleep. Keep your bedroom temperature around 18-20°C and limit screen light 45 minutes before sleep.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-extrabold text-indigo-300">🧘 Active Mobility & Hydration</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Perform 10 minutes of hip and ankle mobility work on rest days. Drink at least 2.5 to 3 liters of water per day to assist in nutrient transport and joint lubrication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: Daily Check-in & Progress Tracking */}
          {activePlanTab === 'tracking' && (
            <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6">
              <h3 className="font-extrabold text-slate-100 text-sm flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Daily Accountability Check-in</span>
              </h3>

              {checkInSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-extrabold text-slate-100 text-sm">Great job logging your check-in today! 🎉</h4>
                  <p className="text-xs text-slate-300">
                    "Consistency beats perfection every single day. Celebrate this win!" — Your AI Coach
                  </p>
                  <button
                    onClick={() => setCheckInSubmitted(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700"
                  >
                    Log another update
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-2">Did you complete your workout today?</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCheckInWorkout('yes')}
                        className={`px-4 py-2 rounded-xl border font-bold ${
                          checkInWorkout === 'yes'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Yes, smashed it! 💪
                      </button>
                      <button
                        onClick={() => setCheckInWorkout('no')}
                        className={`px-4 py-2 rounded-xl border font-bold ${
                          checkInWorkout === 'no'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Rest / Missed day
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-2">How are your energy levels feeling?</label>
                    <select
                      value={checkInEnergy}
                      onChange={(e) => setCheckInEnergy(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 font-bold"
                    >
                      <option value="great">High & Energized (8-10)</option>
                      <option value="normal">Moderate & Steady (5-7)</option>
                      <option value="tired">Tired / Muscle Soreness (1-4)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-2">Notes or challenges today?</label>
                    <textarea
                      value={checkInNotes}
                      onChange={(e) => setCheckInNotes(e.target.value)}
                      placeholder="e.g. Felt great on bench press, drank 3L water!"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-500"
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={() => setCheckInSubmitted(true)}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20"
                  >
                    Submit Daily Check-in
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
