import React, { useState } from 'react';
import { WorkoutHistoryRecord, WorkoutRoutine, UserProfile } from '../types';
import {
  X,
  History,
  User,
  Users,
  Plus,
  Trash2,
  Filter,
  Search,
  Calendar,
  Clock,
  Flame,
  Heart,
  Activity,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award,
  CheckCircle2,
  Download,
  Share2,
  Dumbbell,
  ShieldCheck,
  Zap,
  Info
} from 'lucide-react';

interface WorkoutHistoryModalProps {
  isOpen?: boolean;
  onClose: () => void;
  historyRecords?: WorkoutHistoryRecord[];
  onAddRecord?: (record: WorkoutHistoryRecord) => void;
  onDeleteRecord?: (id: string) => void;
  routines?: WorkoutRoutine[];
  currentProfile?: UserProfile;
  initialFilter?: 'all' | 'guest' | 'user';
}

export const WorkoutHistoryModal: React.FC<WorkoutHistoryModalProps> = ({
  isOpen = true,
  onClose,
  historyRecords = [],
  onAddRecord,
  onDeleteRecord,
  routines = [],
  currentProfile = { name: 'Athlete' } as UserProfile,
  initialFilter = 'all'
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'guest' | 'user'>(initialFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedRecordId, setExpandedRecordId] = useState<string | null>(null);

  // Form State for Manual Guest / User Workout Entry
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [formIsGuest, setFormIsGuest] = useState<boolean>(true);
  const [formAthleteName, setFormAthleteName] = useState<string>('Guest Athlete');
  const [formGuestTag, setFormGuestTag] = useState<string>(`Guest #${Math.floor(100 + Math.random() * 900)}`);
  const [formRoutineTitle, setFormRoutineTitle] = useState<string>(routines?.[0]?.title || 'Custom Workout Session');
  const [formCategory, setFormCategory] = useState<'Strength' | 'HIIT' | 'Hypertrophy' | 'Active Recovery' | 'Endurance'>('Hypertrophy');
  const [formDurationMins, setFormDurationMins] = useState<number>(45);
  const [formCaloriesBurned, setFormCaloriesBurned] = useState<number>(380);
  const [formAvgHR, setFormAvgHR] = useState<number>(140);
  const [formMaxHR, setFormMaxHR] = useState<number>(168);
  const [formPerceivedEffort, setFormPerceivedEffort] = useState<number>(7);
  const [formNotes, setFormNotes] = useState<string>('');
  const [formExercises, setFormExercises] = useState<Array<{ name: string; sets: number; reps: string; weightKg?: number; muscleGroup?: string }>>([
    { name: 'Incline Dumbbell Press', sets: 4, reps: '10', weightKg: 24, muscleGroup: 'Chest' },
    { name: 'Cable Flyes', sets: 3, reps: '12', weightKg: 14, muscleGroup: 'Chest' },
    { name: 'Tricep Pushdowns', sets: 3, reps: '12', weightKg: 20, muscleGroup: 'Triceps' }
  ]);

  if (!isOpen) return null;

  // Filter records
  const filteredRecords = historyRecords.filter((record) => {
    if (activeFilter === 'guest' && !record.isGuest) return false;
    if (activeFilter === 'user' && record.isGuest) return false;
    if (categoryFilter !== 'all' && record.category !== categoryFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = record.athleteName.toLowerCase().includes(q);
      const matchRoutine = record.routineTitle.toLowerCase().includes(q);
      const matchNotes = record.guestNotes?.toLowerCase().includes(q) || false;
      const matchTag = record.guestTag?.toLowerCase().includes(q) || false;
      const matchEx = record.exercisesCompleted?.some(e => e.name.toLowerCase().includes(q)) || false;
      if (!matchName && !matchRoutine && !matchNotes && !matchTag && !matchEx) return false;
    }
    return true;
  });

  // Calculate Guest Statistics
  const guestRecords = historyRecords.filter(r => r.isGuest);
  const totalGuestWorkouts = guestRecords.length;
  const totalGuestCalories = guestRecords.reduce((sum, r) => sum + r.caloriesBurned, 0);
  const totalGuestMinutes = guestRecords.reduce((sum, r) => sum + r.durationMins, 0);
  const avgGuestHR = totalGuestWorkouts > 0
    ? Math.round(guestRecords.reduce((sum, r) => sum + r.avgHR, 0) / totalGuestWorkouts)
    : 0;

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRecord: WorkoutHistoryRecord = {
      id: `hist_${formIsGuest ? 'guest' : 'user'}_${Date.now()}`,
      routineTitle: formRoutineTitle,
      category: formCategory,
      date: dateStr,
      timestamp: `${dateStr} ${timeFormatted}`,
      durationMins: Number(formDurationMins) || 30,
      caloriesBurned: Number(formCaloriesBurned) || 250,
      avgHR: Number(formAvgHR) || 135,
      maxHR: Number(formMaxHR) || 165,
      isGuest: formIsGuest,
      athleteName: formIsGuest ? (formAthleteName || 'Guest Athlete') : currentProfile.name,
      guestTag: formIsGuest ? (formGuestTag || 'Guest #101') : undefined,
      guestNotes: formNotes.trim() || undefined,
      perceivedEffort: formPerceivedEffort,
      exercisesCompleted: formExercises.filter(ex => ex.name.trim() !== ''),
      aiFeedbackSummary: formIsGuest
        ? `Guest session logged with ${formExercises.length} movements. Maintained solid cardiovascular response with an average HR of ${formAvgHR} BPM.`
        : `Logged session for ${currentProfile.name}. Maintained steady training volume across ${formCategory} target.`
    };

    onAddRecord(newRecord);
    setIsAddingRecord(false);
    setFormNotes('');
  };

  const handleExportHistory = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(historyRecords, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `aurafit_workout_history_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <History className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-100">Workout & Guest Session History</h2>
                <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider font-mono">
                  {guestRecords.length} Guest Records
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold font-mono">
                  {historyRecords.length} Total Sessions
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Comprehensive training logs, guest athlete trials, telemetry records, and biomechanical feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddingRecord(!isAddingRecord)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isAddingRecord
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 text-amber-300 border-amber-500/40'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingRecord ? 'Close Form' : 'Add Guest / Manual Record'}</span>
            </button>

            <button
              onClick={handleExportHistory}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Export Workout History (JSON)"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Guest Sessions Stat Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 bg-slate-950/70 border-b border-slate-800 text-xs font-mono">
          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Guest Workouts</span>
              <span className="text-sm font-black text-amber-300">{totalGuestWorkouts} sessions</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Guest Calorie Burn</span>
              <span className="text-sm font-black text-rose-300">{totalGuestCalories.toLocaleString()} kcal</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Guest Training Time</span>
              <span className="text-sm font-black text-cyan-300">{totalGuestMinutes} mins</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800/80 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Avg Guest Heart Rate</span>
              <span className="text-sm font-black text-emerald-300">{avgGuestHR > 0 ? `${avgGuestHR} BPM` : '--'}</span>
            </div>
          </div>
        </div>

        {/* Modal Body & Content Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Add Record Form Drawer */}
          {isAddingRecord && (
            <form onSubmit={handleCreateRecord} className="p-4 sm:p-5 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-4 shadow-xl animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-slate-100">Log New Workout or Guest Session</h3>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-semibold">Athlete Type:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormIsGuest(true);
                      if (formAthleteName === currentProfile.name) setFormAthleteName('Guest Athlete');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      formIsGuest
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    👤 Guest Session
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormIsGuest(false);
                      setFormAthleteName(currentProfile.name);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      !formIsGuest
                        ? 'bg-emerald-500 text-slate-950 font-black'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⭐ {currentProfile.name} (Primary)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">
                    {formIsGuest ? 'Guest Athlete Name' : 'Athlete Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formAthleteName}
                    onChange={(e) => setFormAthleteName(e.target.value)}
                    placeholder="e.g. Jordan Miller"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {formIsGuest && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Guest Tag / ID</label>
                    <input
                      type="text"
                      value={formGuestTag}
                      onChange={(e) => setFormGuestTag(e.target.value)}
                      placeholder="e.g. Guest #104"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Routine / Workout Title</label>
                  <input
                    type="text"
                    required
                    value={formRoutineTitle}
                    onChange={(e) => setFormRoutineTitle(e.target.value)}
                    placeholder="e.g. Upper Body Hypertrophy"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Strength">Strength</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Endurance">Endurance</option>
                    <option value="Active Recovery">Active Recovery</option>
                  </select>
                </div>
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={formDurationMins}
                    onChange={(e) => setFormDurationMins(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Calories Burned (kcal)</label>
                  <input
                    type="number"
                    min="10"
                    max="3000"
                    value={formCaloriesBurned}
                    onChange={(e) => setFormCaloriesBurned(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Avg HR (BPM)</label>
                  <input
                    type="number"
                    min="50"
                    max="220"
                    value={formAvgHR}
                    onChange={(e) => setFormAvgHR(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Perceived Exertion (RPE 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formPerceivedEffort}
                    onChange={(e) => setFormPerceivedEffort(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Guest / Session Notes */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Guest Notes & Form Observations</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Guest visited for a drop-in session. Handled incline dumbbells smoothly with strong 3-second negative eccentric control."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingRecord(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-amber-500/20"
                >
                  Save History Record
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
            
            {/* Athlete Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto">
              <button
                onClick={() => setActiveFilter('all')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === 'all'
                    ? 'bg-slate-800 text-slate-100 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Records ({historyRecords.length})
              </button>

              <button
                onClick={() => setActiveFilter('guest')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeFilter === 'guest'
                    ? 'bg-amber-500 text-slate-950 font-black shadow'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Guest Records ({guestRecords.length})</span>
              </button>

              <button
                onClick={() => setActiveFilter('user')}
                className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                  activeFilter === 'user'
                    ? 'bg-emerald-500 text-slate-950 font-black shadow'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Primary ({historyRecords.length - guestRecords.length})</span>
              </button>
            </div>

            {/* Search Box & Category Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search athlete, guest tag, or exercise..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Categories</option>
                <option value="Hypertrophy">Hypertrophy</option>
                <option value="Strength">Strength</option>
                <option value="HIIT">HIIT</option>
                <option value="Endurance">Endurance</option>
                <option value="Active Recovery">Recovery</option>
              </select>
            </div>

          </div>

          {/* History Records List */}
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center bg-slate-950/40 rounded-3xl border border-slate-800/80 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-200">No workout records match this filter</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {activeFilter === 'guest'
                  ? 'No guest workout records found. Click "Add Guest / Manual Record" to log a guest workout!'
                  : 'Try adjusting your search query or category filters.'}
              </p>
              <button
                onClick={() => setIsAddingRecord(true)}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Log a Guest Session</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map((record) => {
                const isExpanded = expandedRecordId === record.id;

                return (
                  <div
                    key={record.id}
                    className={`rounded-2xl border transition-all ${
                      record.isGuest
                        ? 'bg-slate-950/90 border-amber-500/30 hover:border-amber-500/50'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Record Main Row */}
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      {/* Left: Athlete & Title */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-bold text-sm ${
                            record.isGuest
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {record.isGuest ? '👤' : '⭐'}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-extrabold text-slate-100">{record.routineTitle}</h3>
                            
                            {record.isGuest ? (
                              <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase font-mono tracking-wider flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                <span>{record.guestTag || 'Guest Record'}</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase font-mono">
                                Primary Athlete
                              </span>
                            )}

                            <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-mono">
                              {record.category}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
                            <span className="text-slate-300 font-bold">{record.athleteName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {record.date} ({record.timestamp.split(' ')[1] || 'Logged'})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Key Telemetry Pills & Actions */}
                      <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            {record.durationMins}m
                          </span>

                          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-rose-300 flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            {record.caloriesBurned} kcal
                          </span>

                          <span className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 text-emerald-400" />
                            {record.avgHR} bpm
                          </span>

                          {record.perceivedEffort && (
                            <span className="px-2 py-1 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 text-[10px] font-bold">
                              RPE {record.perceivedEffort}/10
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setExpandedRecordId(isExpanded ? null : record.id)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors text-xs flex items-center gap-1"
                            title="Toggle Full Record Details"
                          >
                            <span className="text-[11px] font-bold hidden sm:inline">{isExpanded ? 'Hide' : 'Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => onDeleteRecord(record.id)}
                            className="p-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors"
                            title="Delete History Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Expandable Details Pane */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 bg-slate-950/60 space-y-3 animate-in fade-in duration-100">
                        
                        {/* Guest Notes & AI Analysis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {record.guestNotes && (
                            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                                📝 Session & Guest Notes
                              </span>
                              <p className="text-slate-300 leading-relaxed">{record.guestNotes}</p>
                            </div>
                          )}

                          {record.aiFeedbackSummary && (
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI Biomechanical Feedback
                              </span>
                              <p className="text-emerald-200/90 leading-relaxed">{record.aiFeedbackSummary}</p>
                            </div>
                          )}
                        </div>

                        {/* Exercises Completed Breakdown */}
                        {record.exercisesCompleted && record.exercisesCompleted.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                              Completed Exercise Lineup ({record.exercisesCompleted.length})
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {record.exercisesCompleted.map((ex, idx) => (
                                <div
                                  key={idx}
                                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono"
                                >
                                  <div>
                                    <span className="font-bold text-slate-200 block text-[11px] truncate max-w-[140px]">
                                      {ex.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500">{ex.muscleGroup || 'General'}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-emerald-400 font-bold block text-[11px]">
                                      {ex.sets} x {ex.reps}
                                    </span>
                                    {ex.weightKg && (
                                      <span className="text-cyan-400 text-[10px]">{ex.weightKg} kg</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Bottom Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono">
            Showing <strong className="text-slate-200">{filteredRecords.length}</strong> of {historyRecords.length} session records
          </span>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-colors"
          >
            Close History
          </button>
        </div>

      </div>
    </div>
  );
};
