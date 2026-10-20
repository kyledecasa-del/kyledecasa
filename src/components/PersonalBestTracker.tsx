import React, { useState } from 'react';
import { PersonalBestRecord } from '../types';
import {
  Trophy,
  Award,
  Plus,
  Flame,
  TrendingUp,
  Dumbbell,
  Timer,
  Sparkles,
  Search,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  History,
  Zap,
  Filter,
  Medal,
  ChevronRight
} from 'lucide-react';

const INITIAL_RECORDS: PersonalBestRecord[] = [
  {
    id: 'pr_1',
    exerciseName: 'Barbell Bench Press',
    category: 'Strength',
    metricType: 'weight',
    value: 105,
    unit: 'kg',
    repsOrPace: '3 reps',
    achievedDate: '2026-08-01',
    previousBest: '100 kg',
    notes: 'Clean execution with solid pause at chest.',
    isRecentPR: true
  },
  {
    id: 'pr_2',
    exerciseName: 'Barbell Back Squat',
    category: 'Strength',
    metricType: 'weight',
    value: 140,
    unit: 'kg',
    repsOrPace: '5 reps',
    achievedDate: '2026-07-28',
    previousBest: '135 kg',
    notes: 'Parallel depth achieved effortlessly.'
  },
  {
    id: 'pr_3',
    exerciseName: 'Conventional Deadlift',
    category: 'Strength',
    metricType: 'weight',
    value: 180,
    unit: 'kg',
    repsOrPace: '1 rep',
    achievedDate: '2026-07-20',
    previousBest: '172.5 kg',
    notes: 'Heavy lift! Core remained engaged.'
  },
  {
    id: 'pr_4',
    exerciseName: '5K Outdoor Run',
    category: 'Running',
    metricType: 'time',
    value: 21.45, // 21 mins 27 secs
    unit: 'min',
    repsOrPace: '4:17 min/km',
    achievedDate: '2026-08-03',
    previousBest: '22.30 min',
    notes: 'Smashed previous record in Zone 4 pace!',
    isRecentPR: true
  },
  {
    id: 'pr_5',
    exerciseName: '2000m Concept2 Row',
    category: 'Rowing',
    metricType: 'time',
    value: 6.50, // 6 mins 30 secs
    unit: 'min',
    repsOrPace: '1:37.5 / 500m',
    achievedDate: '2026-07-15',
    previousBest: '7.05 min',
    notes: 'Strong final 500m sprint.'
  },
  {
    id: 'pr_6',
    exerciseName: 'Overhead Shoulder Press',
    category: 'Strength',
    metricType: 'weight',
    value: 70,
    unit: 'kg',
    repsOrPace: '5 reps',
    achievedDate: '2026-07-25',
    previousBest: '67.5 kg'
  }
];

export const PersonalBestTracker: React.FC = () => {
  const [records, setRecords] = useState<PersonalBestRecord[]>(INITIAL_RECORDS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedHistoryExercise, setSelectedHistoryExercise] = useState<string | null>(null);

  // Form State
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newCategory, setNewCategory] = useState<'Strength' | 'Running' | 'Rowing' | 'Endurance' | 'HIIT'>('Strength');
  const [newMetricType, setNewMetricType] = useState<'weight' | 'time' | 'distance'>('weight');
  const [newValue, setNewValue] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newRepsOrPace, setNewRepsOrPace] = useState('');
  const [newDate, setNewDate] = useState('2026-08-05');
  const [newNotes, setNewNotes] = useState('');

  // Filtering
  const filteredRecords = records.filter((r) => {
    const matchesCategory =
      selectedCategory === 'all' || r.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      r.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExerciseName.trim() || !newValue) return;

    const valNum = parseFloat(newValue);
    if (isNaN(valNum)) return;

    // Check if there's an existing record to mark previous best
    const existing = records.find(
      (r) => r.exerciseName.toLowerCase() === newExerciseName.trim().toLowerCase()
    );

    const prevStr = existing
      ? `${existing.value} ${existing.unit} (${existing.achievedDate})`
      : undefined;

    const newRecord: PersonalBestRecord = {
      id: `pr_${Date.now()}`,
      exerciseName: newExerciseName.trim(),
      category: newCategory,
      metricType: newMetricType,
      value: valNum,
      unit: newUnit,
      repsOrPace: newRepsOrPace.trim() || undefined,
      achievedDate: newDate,
      previousBest: prevStr,
      notes: newNotes.trim() || undefined,
      isRecentPR: true
    };

    setRecords([newRecord, ...records]);
    setShowAddModal(false);

    // Reset Form
    setNewExerciseName('');
    setNewValue('');
    setNewRepsOrPace('');
    setNewNotes('');
  };

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  // Quick Preset Helper
  const applyPreset = (name: string, category: 'Strength' | 'Running' | 'Rowing', metric: 'weight' | 'time', defaultUnit: string) => {
    setNewExerciseName(name);
    setNewCategory(category);
    setNewMetricType(metric);
    setNewUnit(defaultUnit);
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider">Achievement Hall</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                {records.length} Personal Records Tracked
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-100">Personal Best (PR) Tracker</h2>
            <p className="text-xs text-slate-400">Record and celebrate your highest weights lifted, fastest run times, and all-time fitness milestones.</p>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Personal Best</span>
        </button>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Category Filters */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'strength', label: '🏋️ Strength (Weight)' },
            { id: 'running', label: '🏃 Running (Speed)' },
            { id: 'rowing', label: '🚣 Rowing / Endurance' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

      </div>

      {/* Records Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((record) => {
          const isWeight = record.metricType === 'weight';

          return (
            <div
              key={record.id}
              className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group ${
                record.isRecentPR
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/30 border-amber-500/50 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-950 border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {/* Highlight Badge */}
              {record.isRecentPR && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-400 text-slate-950 px-3 py-0.5 rounded-bl-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3 fill-slate-950" />
                  <span>NEW RECORD!</span>
                </div>
              )}

              <div className="space-y-3">
                
                {/* Title & Category */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px] font-bold uppercase font-mono">
                      {record.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Achieved {record.achievedDate}
                    </span>
                  </div>
                  <h3 className="font-black text-slate-100 text-base group-hover:text-amber-400 transition-colors">
                    {record.exerciseName}
                  </h3>
                </div>

                {/* Big Metric Display */}
                <div className="flex items-baseline gap-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80">
                  <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                    {record.value} <span className="text-sm font-bold text-slate-300">{record.unit}</span>
                  </span>
                  {record.repsOrPace && (
                    <span className="text-xs font-bold text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {record.repsOrPace}
                    </span>
                  )}
                </div>

                {/* Notes & Previous Best */}
                <div className="space-y-1 text-xs text-slate-400">
                  {record.previousBest && (
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Prev Best: {record.previousBest}</span>
                    </div>
                  )}
                  {record.notes && (
                    <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                      "{record.notes}"
                    </p>
                  )}
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedHistoryExercise(record.exerciseName)}
                  className="text-slate-400 hover:text-amber-400 flex items-center gap-1 text-[11px] font-bold transition-colors"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>View PR History</span>
                </button>

                <button
                  onClick={() => handleDeleteRecord(record.id)}
                  className="p-1 rounded text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Remove record"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-slate-950/60 rounded-2xl border border-slate-800 space-y-3">
          <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
          <p className="text-xs text-slate-400">No personal records found matching your filters.</p>
        </div>
      )}

      {/* MODAL: Log New Personal Best */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Medal className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-100 text-base">Log New Personal Record (PR)</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Quick Presets</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: 'Barbell Bench Press', cat: 'Strength', metric: 'weight', unit: 'kg' },
                  { name: 'Barbell Back Squat', cat: 'Strength', metric: 'weight', unit: 'kg' },
                  { name: 'Conventional Deadlift', cat: 'Strength', metric: 'weight', unit: 'kg' },
                  { name: 'Overhead Press', cat: 'Strength', metric: 'weight', unit: 'kg' },
                  { name: '5K Run', cat: 'Running', metric: 'time', unit: 'min' },
                  { name: '2000m Row', cat: 'Rowing', metric: 'time', unit: 'min' }
                ].map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => applyPreset(p.name, p.cat as any, p.metric as any, p.unit)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[11px] font-bold text-slate-300 transition-colors"
                  >
                    + {p.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreatePR} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="e.g. Incline Dumbbell Bench Press"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-bold"
                  >
                    <option value="Strength">Strength (Lifting)</option>
                    <option value="Running">Running</option>
                    <option value="Rowing">Rowing</option>
                    <option value="Endurance">Endurance</option>
                    <option value="HIIT">HIIT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Date Achieved</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Highest Value</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. 100 or 21.5"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Unit</label>
                  <select
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 font-bold font-mono"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                    <option value="min">min</option>
                    <option value="sec">sec</option>
                    <option value="km">km</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Reps or Pace</label>
                  <input
                    type="text"
                    value={newRepsOrPace}
                    onChange={(e) => setNewRepsOrPace(e.target.value)}
                    placeholder="e.g. 5 reps / 4:15 pace"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-100 placeholder-slate-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Achievement Notes (Optional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Felt super smooth, clean depth and strong lock-out!"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 placeholder-slate-500"
                  rows={2}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Save & Celebrate Personal Record 🎉
              </button>
            </form>

          </div>
        </div>
      )}

      {/* History Inspection Drawer / Modal */}
      {selectedHistoryExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <History className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-100 text-base">{selectedHistoryExercise} Progression</h3>
              </div>
              <button
                onClick={() => setSelectedHistoryExercise(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-500 block">Aug 01, 2026 (Current PR)</span>
                  <span className="text-amber-400 font-bold text-sm">105 kg (3 reps)</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">PR</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex justify-between items-center opacity-80">
                <div>
                  <span className="text-[10px] text-slate-500 block">Jul 12, 2026</span>
                  <span className="text-slate-300 font-bold text-sm">100 kg (5 reps)</span>
                </div>
                <span className="text-slate-500 text-[10px]">+5kg jump</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 flex justify-between items-center opacity-60">
                <div>
                  <span className="text-[10px] text-slate-500 block">Jun 04, 2026</span>
                  <span className="text-slate-400 font-bold text-sm">92.5 kg (5 reps)</span>
                </div>
                <span className="text-slate-500 text-[10px]">Baseline</span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
