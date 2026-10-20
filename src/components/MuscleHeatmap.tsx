import React, { useState } from 'react';
import {
  Flame,
  Activity,
  RotateCcw,
  Sparkles,
  Zap,
  CheckCircle2,
  Info,
  ShieldCheck
} from 'lucide-react';

export interface MuscleGroupStatus {
  id: string;
  name: string;
  category: 'Upper Front' | 'Upper Back' | 'Core' | 'Lower Body';
  fatigueLevel: number; // 0 (100% rested) to 100 (fully fatigued)
  recoveryHoursLeft: number;
  recommendedExercises: string[];
  lastTrainedDaysAgo: number;
}

export const INITIAL_MUSCLES: MuscleGroupStatus[] = [
  {
    id: 'chest',
    name: 'Pectorals (Chest)',
    category: 'Upper Front',
    fatigueLevel: 75,
    recoveryHoursLeft: 18,
    recommendedExercises: ['Incline Dumbbell Press', 'Cable Flyes', 'Push-ups'],
    lastTrainedDaysAgo: 1
  },
  {
    id: 'shoulders',
    name: 'Deltoids (Shoulders)',
    category: 'Upper Front',
    fatigueLevel: 45,
    recoveryHoursLeft: 8,
    recommendedExercises: ['Overhead Shoulder Press', 'Lateral Raises', 'Face Pulls'],
    lastTrainedDaysAgo: 2
  },
  {
    id: 'biceps',
    name: 'Biceps',
    category: 'Upper Front',
    fatigueLevel: 20,
    recoveryHoursLeft: 0,
    recommendedExercises: ['Incline DB Curls', 'Hammer Curls'],
    lastTrainedDaysAgo: 4
  },
  {
    id: 'abs',
    name: 'Rectus Abdominis (Core)',
    category: 'Core',
    fatigueLevel: 30,
    recoveryHoursLeft: 0,
    recommendedExercises: ['Hanging Leg Raises', 'Cable Woodchoppers', 'Planks'],
    lastTrainedDaysAgo: 3
  },
  {
    id: 'quads',
    name: 'Quadriceps (Front Thighs)',
    category: 'Lower Body',
    fatigueLevel: 85,
    recoveryHoursLeft: 28,
    recommendedExercises: ['Barbell Squats', 'Leg Extension', 'Bulgarian Split Squats'],
    lastTrainedDaysAgo: 1
  },
  {
    id: 'lats',
    name: 'Latissimus Dorsi (Lats/Back)',
    category: 'Upper Back',
    fatigueLevel: 10,
    recoveryHoursLeft: 0,
    recommendedExercises: ['Lat Pulldown', 'Barbell Rows', 'Pull-ups'],
    lastTrainedDaysAgo: 5
  },
  {
    id: 'triceps',
    name: 'Triceps',
    category: 'Upper Back',
    fatigueLevel: 60,
    recoveryHoursLeft: 12,
    recommendedExercises: ['Tricep Rope Pushdowns', 'Skullcrushers'],
    lastTrainedDaysAgo: 1
  },
  {
    id: 'glutes',
    name: 'Gluteus Maximus',
    category: 'Lower Body',
    fatigueLevel: 70,
    recoveryHoursLeft: 22,
    recommendedExercises: ['Barbell Hip Thrusts', 'Romanian Deadlifts'],
    lastTrainedDaysAgo: 1
  },
  {
    id: 'hamstrings',
    name: 'Hamstrings',
    category: 'Lower Body',
    fatigueLevel: 50,
    recoveryHoursLeft: 10,
    recommendedExercises: ['Seated Leg Curls', 'Lying Hamstring Curls'],
    lastTrainedDaysAgo: 2
  },
  {
    id: 'calves',
    name: 'Gastrocnemius (Calves)',
    category: 'Lower Body',
    fatigueLevel: 15,
    recoveryHoursLeft: 0,
    recommendedExercises: ['Standing Calf Raises'],
    lastTrainedDaysAgo: 4
  }
];

export const MuscleHeatmap: React.FC = () => {
  const [muscles, setMuscles] = useState<MuscleGroupStatus[]>(INITIAL_MUSCLES);
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>('chest');
  const [viewAngle, setViewAngle] = useState<'front' | 'back'>('front');

  const selectedMuscle = muscles.find((m) => m.id === selectedMuscleId) || muscles[0];

  const getFatigueColor = (level: number) => {
    if (level >= 75) return { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/50', hex: '#f43f5e', label: 'Fatigued / Recovering' };
    if (level >= 40) return { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/50', hex: '#f59e0b', label: 'Moderate Load' };
    return { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/50', hex: '#10b981', label: 'Fully Rested & Ready' };
  };

  const handleAdjustFatigue = (id: string, delta: number) => {
    setMuscles(
      muscles.map((m) => {
        if (m.id === id) {
          const newLevel = Math.max(0, Math.min(100, m.fatigueLevel + delta));
          return {
            ...m,
            fatigueLevel: newLevel,
            recoveryHoursLeft: newLevel > 30 ? Math.round((newLevel / 100) * 36) : 0
          };
        }
        return m;
      })
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Bio-Adaptive Muscle Fatigue Heatmap</h2>
            <p className="text-xs text-slate-400">Interactive visual anatomy tracking real-time muscle recovery and optimal training readiness.</p>
          </div>
        </div>

        {/* View Angle Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setViewAngle('front')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewAngle === 'front'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Anterior (Front)
          </button>
          <button
            onClick={() => setViewAngle('back')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              viewAngle === 'back'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Posterior (Back)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Interactive Muscle Map Grid */}
        <div className="lg:col-span-7 bg-slate-950/90 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center min-h-[360px] relative shadow-inner">
          
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              {viewAngle === 'front' ? 'Front Body Anatomical Map' : 'Back Body Anatomical Map'}
            </span>
            <span className="text-xs text-slate-400">Tap any muscle group below to inspect recovery metrics</span>
          </div>

          {/* Interactive Silhouette Body Layout */}
          <div className="w-full max-w-md grid grid-cols-2 sm:grid-cols-3 gap-3">
            {muscles
              .filter((m) =>
                viewAngle === 'front'
                  ? ['Upper Front', 'Core', 'Lower Body'].includes(m.category) && !['lats', 'triceps'].includes(m.id)
                  : ['Upper Back', 'Lower Body'].includes(m.category) && !['chest', 'biceps', 'abs'].includes(m.id)
              )
              .map((m) => {
                const isSelected = selectedMuscleId === m.id;
                const colorInfo = getFatigueColor(m.fatigueLevel);

                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMuscleId(m.id)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden ${
                      isSelected
                        ? 'border-emerald-400 bg-slate-900 ring-2 ring-emerald-400/40 shadow-xl scale-[1.02]'
                        : 'border-slate-800/90 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-black text-slate-200 truncate">{m.name.split(' ')[0]}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${colorInfo.bg} animate-pulse`} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Fatigue:</span>
                        <span className={`font-bold ${colorInfo.text}`}>{m.fatigueLevel}%</span>
                      </div>
                      
                      {/* Fatigue Progress Bar */}
                      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className={`h-full ${colorInfo.bg}`}
                          style={{ width: `${m.fatigueLevel}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Heatmap Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-[11px] pt-4 border-t border-slate-800/80 w-full font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">0-39% Rested</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-slate-300">40-74% Moderate</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-300">75-100% Fatigued</span>
            </div>
          </div>

        </div>

        {/* Selected Muscle Deep Inspector */}
        <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Selected Muscle Inspection</span>
              <h3 className="text-base font-extrabold text-slate-100">{selectedMuscle.name}</h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                getFatigueColor(selectedMuscle.fatigueLevel).border
              } ${getFatigueColor(selectedMuscle.fatigueLevel).bg}/20 ${
                getFatigueColor(selectedMuscle.fatigueLevel).text
              }`}
            >
              {getFatigueColor(selectedMuscle.fatigueLevel).label}
            </span>
          </div>

          {/* Fatigue Meter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Current Muscle Fatigue:</span>
              <span className={`font-bold ${getFatigueColor(selectedMuscle.fatigueLevel).text}`}>
                {selectedMuscle.fatigueLevel}%
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div
                className={`h-full ${getFatigueColor(selectedMuscle.fatigueLevel).bg} transition-all duration-300`}
                style={{ width: `${selectedMuscle.fatigueLevel}%` }}
              />
            </div>
          </div>

          {/* Recovery Stats */}
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Est. Recovery Time</span>
              <span className="text-slate-100 font-bold text-sm">
                {selectedMuscle.recoveryHoursLeft > 0 ? `${selectedMuscle.recoveryHoursLeft} hrs remaining` : 'Fully Rested!'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Last Trained</span>
              <span className="text-slate-100 font-bold text-sm">
                {selectedMuscle.lastTrainedDaysAgo === 0 ? 'Today' : `${selectedMuscle.lastTrainedDaysAgo} days ago`}
              </span>
            </div>
          </div>

          {/* Recommended Exercises */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Recommended Exercises for Next Session:</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedMuscle.recommendedExercises.map((ex) => (
                <span
                  key={ex}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-medium"
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>

          {/* Manual Soreness/Fatigue Adjuster */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <span className="text-[11px] text-slate-400 font-bold block">Log Muscle Soreness / Adjust Fatigue:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleAdjustFatigue(selectedMuscle.id, 20)}
                className="flex-1 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition-colors"
              >
                + More Sore
              </button>
              <button
                onClick={() => handleAdjustFatigue(selectedMuscle.id, -20)}
                className="flex-1 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-colors"
              >
                - Less Sore
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
