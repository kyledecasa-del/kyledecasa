import React, { useState } from 'react';
import { UserProfile, WorkoutRoutine, Exercise, FitnessLevel } from '../types';
import {
  Sparkles,
  Dumbbell,
  Play,
  Plus,
  Zap,
  Flame,
  Clock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Heart,
  Film,
  Video,
  Eye,
  ShieldCheck
} from 'lucide-react';
import { ExerciseVideoDemoModal } from './ExerciseVideoDemoModal';

interface RoutinesViewProps {
  profile: UserProfile;
  routines: WorkoutRoutine[];
  onAddRoutine: (routine: WorkoutRoutine) => void;
  onStartWorkout: (routine: WorkoutRoutine) => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  profile,
  routines,
  onAddRoutine,
  onStartWorkout
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Hypertrophy' | 'HIIT' | 'Active Recovery' | 'Strength'>('All');
  const [expandedRoutineId, setExpandedRoutineId] = useState<string | null>(routines[0]?.id || null);

  // Exercise Video Demo Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [selectedVideoExercise, setSelectedVideoExercise] = useState<Exercise | null>(null);
  const [selectedVideoRoutine, setSelectedVideoRoutine] = useState<WorkoutRoutine | null>(null);

  // AI Generator Modal state
  const [isGenerating, setIsGenerating] = useState(false);
  const [genCategory, setGenCategory] = useState<'Hypertrophy' | 'HIIT' | 'Active Recovery' | 'Strength'>('Hypertrophy');
  const [genFocusArea, setGenFocusArea] = useState('Upper Body (Chest & Back)');

  const handleOpenExerciseVideo = (exercise: Exercise, routine: WorkoutRoutine) => {
    setSelectedVideoExercise(exercise);
    setSelectedVideoRoutine(routine);
    setIsVideoModalOpen(true);
  };

  const handleGenerateAIWorkout = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          category: genCategory,
          focusArea: genFocusArea,
          readinessScore: 84,
          fatigueMap: { quads: 70 }
        })
      });

      const data = await res.json();
      if (data.success && data.routine) {
        const newRoutine: WorkoutRoutine = {
          id: `routine_ai_${Date.now()}`,
          title: data.routine.title,
          category: data.routine.category as any,
          difficulty: profile.fitnessLevel,
          durationMins: data.routine.durationMins,
          estimatedCalories: data.routine.estimatedCalories,
          focusArea: data.routine.focusArea,
          exercises: data.routine.exercises.map((e: any, idx: number) => ({
            id: `ex_ai_${idx}`,
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weightKg: e.weightKg,
            targetZone: e.targetZone,
            restPeriodSec: e.restPeriodSec,
            instructions: e.instructions,
            muscleGroup: e.muscleGroup
          })),
          aiReasoning: data.routine.aiReasoning,
          createdAt: new Date().toISOString().split('T')[0]
        };

        onAddRoutine(newRoutine);
        setExpandedRoutineId(newRoutine.id);
      }
    } catch (e) {
      console.error('Failed to generate AI routine:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRoutines = selectedCategory === 'All'
    ? routines
    : routines.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Generator Toolbar */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Bio-Adaptive Workouts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Personalized Workout Library</h1>
          <p className="text-xs text-slate-400 mt-1">
            Routines automatically adjust set volume, weight, and target heart rate zones based on daily recovery scores.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {(['All', 'Hypertrophy', 'HIIT', 'Active Recovery', 'Strength'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Custom Routine Generator Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Generate New AI Workout Routine</h3>
            <p className="text-xs text-slate-400">Select target focus and let Gemini build custom exercise protocols.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Category</label>
            <select
              value={genCategory}
              onChange={(e) => setGenCategory(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="Hypertrophy">Hypertrophy (Muscle Growth)</option>
              <option value="HIIT">HIIT & Metabolic Burn</option>
              <option value="Active Recovery">Active Recovery & Mobility</option>
              <option value="Strength">Strength & Powerlifting</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Focus Area</label>
            <input
              type="text"
              value={genFocusArea}
              onChange={(e) => setGenFocusArea(e.target.value)}
              placeholder="e.g. Chest & Shoulders"
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerateAIWorkout}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing Protocol...' : 'Generate Routine'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Routine Cards Accordion List */}
      <div className="space-y-4">
        {filteredRoutines.map((routine) => {
          const isExpanded = expandedRoutineId === routine.id;

          return (
            <div
              key={routine.id}
              className={`rounded-2xl border transition-all ${
                isExpanded
                  ? 'bg-slate-900 border-emerald-500/40 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Routine Card Top Bar */}
              <div
                onClick={() => setExpandedRoutineId(isExpanded ? null : routine.id)}
                className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {routine.category}
                    </span>
                    <span className="text-[11px] text-slate-400 capitalize font-medium">
                      Level: {routine.difficulty}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-100">{routine.title}</h3>
                  <p className="text-xs text-slate-400">Focus: {routine.focusArea}</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {routine.durationMins} mins
                    </span>
                    <span className="flex items-center gap-1 font-mono text-amber-400">
                      <Flame className="w-3.5 h-3.5" />
                      {routine.estimatedCalories} kcal
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartWorkout(routine);
                    }}
                    className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-500/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Start</span>
                  </button>

                  <div className="text-slate-400">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Exercises Detail */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                    <span className="font-bold text-emerald-400 block mb-0.5">🧠 AI Biometric Rationale:</span>
                    {routine.aiReasoning}
                  </div>

                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Exercise Lineup ({routine.exercises.length})
                    </h4>

                    {routine.exercises.length > 0 && (
                      <button
                        onClick={() => handleOpenExerciseVideo(routine.exercises[0], routine)}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Watch Routine Video Demos</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {routine.exercises.map((ex, idx) => (
                      <div
                        key={ex.id || idx}
                        className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:border-slate-600 transition-colors group"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-100 text-sm">
                              {idx + 1}. {ex.name}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-mono">
                              {ex.muscleGroup}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{ex.instructions}</p>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-between md:justify-end">
                          <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono font-bold text-slate-200">
                            {ex.sets} sets x {ex.reps}
                          </span>
                          {ex.weightKg && (
                            <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/60 font-mono text-cyan-400 font-bold">
                              {ex.weightKg} kg
                            </span>
                          )}
                          <span className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-semibold">
                            {ex.targetZone}
                          </span>

                          <button
                            onClick={() => handleOpenExerciseVideo(ex, routine)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 hover:from-emerald-500/30 hover:to-cyan-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm group-hover:border-emerald-400"
                            title="Open AI Form Demonstration Video"
                          >
                            <Film className="w-3.5 h-3.5 text-emerald-400" />
                            <span>AI Video & Form</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Exercise Video Demonstration & Form Guidance Modal */}
      {isVideoModalOpen && selectedVideoExercise && (
        <ExerciseVideoDemoModal
          isOpen={isVideoModalOpen}
          onClose={() => setIsVideoModalOpen(false)}
          exercise={selectedVideoExercise}
          routine={selectedVideoRoutine || undefined}
          profile={profile}
          onSelectExercise={(newEx) => setSelectedVideoExercise(newEx)}
        />
      )}

    </div>
  );
};
