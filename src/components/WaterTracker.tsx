import React, { useState } from 'react';
import { UserProfile, DailyNutrition } from '../types';
import {
  Droplet,
  Plus,
  Minus,
  Settings,
  Target,
  GlassWater,
  Check,
  RotateCcw,
  Sparkles,
  Award,
  Info
} from 'lucide-react';

interface WaterLogEntry {
  id: string;
  time: string;
  amountMl: number;
  label: string;
}

interface WaterTrackerProps {
  profile: UserProfile;
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const WaterTracker: React.FC<WaterTrackerProps> = ({
  profile,
  nutrition,
  onUpdateNutrition,
  onUpdateProfile
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customGoalInput, setCustomGoalInput] = useState<string>(
    (profile.targetWaterMl || 2500).toString()
  );
  const [customAddInput, setCustomAddInput] = useState<string>('');

  // Local log history for today's water intake breakdown
  const [waterEntries, setWaterEntries] = useState<WaterLogEntry[]>([
    { id: '1', time: '08:15 AM', amountMl: 500, label: 'Morning Hydration' },
    { id: '2', time: '11:30 AM', amountMl: 250, label: 'Standard Glass' },
    { id: '3', time: '02:10 PM', amountMl: 500, label: 'Pre-Workout Flask' }
  ]);

  const targetMl = profile.targetWaterMl || 2500;
  const currentMl = nutrition.waterMl;
  const progressPct = Math.min(100, Math.round((currentMl / targetMl) * 100));
  const remainingMl = Math.max(0, targetMl - currentMl);
  const glassesCount = Math.floor(currentMl / 250);
  const targetGlasses = Math.ceil(targetMl / 250);

  const handleAddWater = (amountMl: number, label: string = 'Quick Log') => {
    if (amountMl <= 0) return;
    const newTotal = currentMl + amountMl;
    
    // Add entry log
    const newEntry: WaterLogEntry = {
      id: `w_${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amountMl,
      label
    };

    setWaterEntries([newEntry, ...waterEntries]);
    onUpdateNutrition({
      ...nutrition,
      waterMl: newTotal
    });
  };

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customAddInput);
    if (!isNaN(val) && val > 0) {
      handleAddWater(val, 'Custom Intake');
      setCustomAddInput('');
    }
  };

  const handleResetWater = () => {
    if (confirm('Are you sure you want to reset today\'s logged water intake?')) {
      onUpdateNutrition({
        ...nutrition,
        waterMl: 0
      });
      setWaterEntries([]);
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseInt(customGoalInput);
    if (!isNaN(newTarget) && newTarget >= 500 && onUpdateProfile) {
      onUpdateProfile({
        ...profile,
        targetWaterMl: newTarget
      });
    }
    setIsEditingGoal(false);
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* Header with Goal Preset & Settings Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Droplet className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-100">Daily Hydration Tracker</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {progressPct >= 100 ? 'Goal Achieved! 🎉' : 'In Progress'}
              </span>
            </div>
            <p className="text-xs text-slate-400">Track cellular hydration, prevent muscular fatigue, and boost metabolic rate.</p>
          </div>
        </div>

        <button
          onClick={() => setIsEditingGoal(!isEditingGoal)}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
        >
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>{isEditingGoal ? 'Close Settings' : 'Set Daily Goal'}</span>
        </button>
      </div>

      {/* Goal Edit Panel */}
      {isEditingGoal && (
        <form onSubmit={handleSaveGoal} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              Configure Daily Target Goal (ml)
            </label>
            <span className="text-[11px] text-slate-400">Recommended: 2,500ml - 3,500ml</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[2000, 2500, 3000, 3500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setCustomGoalInput(preset.toString());
                  if (onUpdateProfile) {
                    onUpdateProfile({ ...profile, targetWaterMl: preset });
                  }
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                  targetMl === preset
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset.toLocaleString()} ml
              </button>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <input
              type="number"
              value={customGoalInput}
              onChange={(e) => setCustomGoalInput(e.target.value)}
              placeholder="Custom target ml"
              className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1 shadow-lg shadow-cyan-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Save Goal</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Visual Progress Display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Liquid Fill Visual Bar */}
        <div className="md:col-span-5 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-4">
          <div className="relative w-36 h-48 rounded-3xl bg-slate-900 border-2 border-cyan-500/30 overflow-hidden shadow-inner flex flex-col justify-end">
            {/* Animated Water Fill Layer */}
            <div
              className="w-full bg-gradient-to-t from-cyan-600 via-cyan-500 to-sky-400 transition-all duration-700 relative flex items-center justify-center"
              style={{ height: `${progressPct}%` }}
            >
              {progressPct > 12 && (
                <span className="text-slate-950 font-extrabold text-sm font-mono drop-shadow">
                  {progressPct}%
                </span>
              )}
            </div>

            {/* Overlaid Target Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <Droplet className={`w-8 h-8 ${progressPct > 50 ? 'text-slate-950/80' : 'text-cyan-400/80'} mb-1`} />
              <span className={`text-xs font-mono font-bold ${progressPct > 50 ? 'text-slate-950' : 'text-slate-200'}`}>
                {(currentMl / 1000).toFixed(2)}L
              </span>
              <span className={`text-[10px] font-semibold ${progressPct > 50 ? 'text-slate-900/80' : 'text-slate-400'}`}>
                / {(targetMl / 1000).toFixed(2)}L Goal
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="w-full grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Remaining</span>
              <span className="font-bold text-amber-400 font-mono">{remainingMl} ml</span>
            </div>
            <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block uppercase">Glasses</span>
              <span className="font-bold text-cyan-300 font-mono">{glassesCount} / {targetGlasses}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Logging & Quick Actions */}
        <div className="md:col-span-7 space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Quick Add Presets
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleAddWater(100, 'Espresso / Cup')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <GlassWater className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-200 text-xs block">+100 ml</span>
                <span className="text-[10px] text-slate-400">Cup</span>
              </button>

              <button
                onClick={() => handleAddWater(250, 'Standard Glass')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <GlassWater className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-200 text-xs block">+250 ml</span>
                <span className="text-[10px] text-slate-400">Glass</span>
              </button>

              <button
                onClick={() => handleAddWater(500, 'Water Bottle')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <Droplet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-200 text-xs block">+500 ml</span>
                <span className="text-[10px] text-slate-400">Bottle</span>
              </button>

              <button
                onClick={() => handleAddWater(750, 'Sports Shaker')}
                className="p-3 rounded-2xl bg-slate-950 hover:bg-cyan-500/10 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group"
              >
                <Droplet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-200 text-xs block">+750 ml</span>
                <span className="text-[10px] text-slate-400">Flask</span>
              </button>
            </div>
          </div>

          {/* Custom Intake Form */}
          <form onSubmit={handleCustomAdd} className="flex gap-2">
            <input
              type="number"
              value={customAddInput}
              onChange={(e) => setCustomAddInput(e.target.value)}
              placeholder="Enter custom ml (e.g. 350)"
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-cyan-500 placeholder-slate-600 font-mono"
            />
            <button
              type="submit"
              disabled={!customAddInput.trim()}
              className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 disabled:opacity-50 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Water</span>
            </button>
          </form>

          {/* Hydration Tip Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-start gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Hydration Insight:</strong> Drinking 500ml of water 30 minutes before workouts enhances muscle contractility and prevents early fatigue during high-intensity sets.
            </p>
          </div>

        </div>

      </div>

      {/* Logged Intake Entries History */}
      <div className="pt-2 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Today's Hydration Entries ({waterEntries.length})
          </h4>
          
          <button
            onClick={handleResetWater}
            className="text-[11px] text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Intake</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {waterEntries.map((entry) => (
            <div
              key={entry.id}
              className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <GlassWater className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="font-bold text-slate-200 block">{entry.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{entry.time}</span>
                </div>
              </div>

              <span className="font-extrabold text-cyan-300 font-mono bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                +{entry.amountMl} ml
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
