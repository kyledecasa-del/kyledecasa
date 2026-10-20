import React, { useState } from 'react';
import { UserProfile, FitnessGoal, FitnessLevel, AuthUser } from '../types';
import { PRESET_PROFILES } from '../data/presetProfiles';
import {
  X,
  Save,
  User,
  Target,
  Heart,
  Sparkles,
  Activity,
  CheckCircle2,
  Zap,
  LogIn,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface ProfileModalProps {
  profile: UserProfile;
  authUser?: AuthUser | null;
  onClose: () => void;
  onSaveProfile: (profile: UserProfile) => void;
  onOpenHistory?: (filter?: 'all' | 'guest' | 'user') => void;
  onOpenLogin?: (mode?: 'signin' | 'signup' | 'demo') => void;
  onLogout?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  authUser,
  onClose,
  onSaveProfile,
  onOpenHistory,
  onOpenLogin,
  onLogout
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'guest'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  const handleSelectPreset = (preset: UserProfile) => {
    setFormData({ ...preset });
  };

  // Live Biometric Calculations
  const heightM = (formData.heightCm || 175) / 100;
  const bmi = (formData.weightKg / (heightM * heightM)).toFixed(1);
  
  // Revised Harris-Benedict BMR Formula
  const isFemale = formData.gender === 'female';
  const bmr = isFemale
    ? Math.round(447.593 + (9.247 * formData.weightKg) + (3.098 * formData.heightCm) - (4.330 * formData.age))
    : Math.round(88.362 + (13.397 * formData.weightKg) + (4.799 * formData.heightCm) - (5.677 * formData.age));

  const filteredPresets = PRESET_PROFILES.filter((p) => {
    if (genderFilter === 'male') return p.gender === 'male';
    if (genderFilter === 'female') return p.gender === 'female';
    if (genderFilter === 'guest') return p.name.includes('Guest');
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-100">User Profile & Biometrics Engine</h2>
              <p className="text-xs text-slate-400">Select athlete presets or customize male & female biometrics.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenHistory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenHistory('guest');
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all"
              >
                👤 Guest History
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Account Authentication & Portal Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-bold text-sm">
              {authUser && !authUser.isGuest ? authUser.name.charAt(0) : '👤'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-100">
                  {authUser && !authUser.isGuest ? authUser.name : 'Guest Athlete Session'}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {authUser && !authUser.isGuest ? (authUser.role || 'Pro Athlete') : 'Guest Mode'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {authUser && !authUser.isGuest
                  ? `Signed in as ${authUser.email}`
                  : 'Log in to sync your biometrics across devices'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLogin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLogin('signin');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{authUser && !authUser.isGuest ? 'Switch Account' : 'Log In / Register'}</span>
              </button>
            )}

            {authUser && !authUser.isGuest && onLogout && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
                title="Sign out of current account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Athlete Preset Selector */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Preset Athlete Biometrics</span>
            </span>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
              {(['all', 'female', 'male', 'guest'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGenderFilter(g)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                    genderFilter === g
                      ? 'bg-emerald-500 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g === 'female' ? '👩 Female' : g === 'male' ? '👨 Male' : g === 'guest' ? '👤 Guest' : 'All Presets'}
                </button>
              ))}
            </div>
          </div>

          {/* Preset Buttons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredPresets.map((preset) => {
              const isSelected = formData.name === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-100">{preset.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 font-mono text-emerald-400 font-bold">
                      {preset.gender === 'female' ? '♀ Female' : '♂ Male'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    {preset.age}y • {preset.weightKg}kg • {preset.heightCm}cm • {preset.bodyFatPct}% BF
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 capitalize mt-1 truncate">
                    Goal: {preset.goal.replace('_', ' ')}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Biometrics Summary Calculated Cards */}
        <div className="grid grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Live BMI</span>
            <span className="text-sm font-black text-slate-100">{bmi} kg/m²</span>
            <span className="text-[10px] text-emerald-400 block font-bold">Athletic Range</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Estimated BMR</span>
            <span className="text-sm font-black text-cyan-400">{bmr} kcal</span>
            <span className="text-[10px] text-slate-400 block">Basal Metabolic Rate</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">VO2 Max Target</span>
            <span className="text-sm font-black text-amber-400">{formData.vo2Max || 52} ml/kg/m</span>
            <span className="text-[10px] text-slate-400 block">Cardio Efficiency</span>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Biological Sex / Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 font-bold focus:outline-none focus:border-emerald-500"
              >
                <option value="male">Male (♂)</option>
                <option value="female">Female (♀)</option>
                <option value="other">Other / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Primary Fitness Goal</label>
              <select
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value as FitnessGoal })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="muscle_gain">Muscle Gain (Hypertrophy)</option>
                <option value="fat_loss">Fat Loss & Athletic Toning</option>
                <option value="endurance">Cardiovascular Endurance</option>
                <option value="injury_recovery">Injury Recovery & Active Rehab</option>
                <option value="general_wellness">General Longevity & Wellness</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 25 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 170 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseFloat(e.target.value) || 70 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Body Fat %</label>
              <input
                type="number"
                step="0.5"
                value={formData.bodyFatPct || 18}
                onChange={(e) => setFormData({ ...formData, bodyFatPct: parseFloat(e.target.value) || 18 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Resting HR (BPM)</label>
              <input
                type="number"
                value={formData.restingHR}
                onChange={(e) => setFormData({ ...formData, restingHR: parseInt(e.target.value) || 60 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Max HR (BPM)</label>
              <input
                type="number"
                value={formData.maxHR}
                onChange={(e) => setFormData({ ...formData, maxHR: parseInt(e.target.value) || 185 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">VO2 Max</label>
              <input
                type="number"
                value={formData.vo2Max || 50}
                onChange={(e) => setFormData({ ...formData, vo2Max: parseInt(e.target.value) || 50 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800">
            <div>
              <label className="block font-bold text-slate-400 mb-1">Daily Kcal Target</label>
              <input
                type="number"
                value={formData.dailyCalorieTarget}
                onChange={(e) => setFormData({ ...formData, dailyCalorieTarget: parseInt(e.target.value) || 2500 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Protein (g)</label>
              <input
                type="number"
                value={formData.targetProteinG}
                onChange={(e) => setFormData({ ...formData, targetProteinG: parseInt(e.target.value) || 160 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={formData.targetCarbsG}
                onChange={(e) => setFormData({ ...formData, targetCarbsG: parseInt(e.target.value) || 250 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-400 mb-1">Fat (g)</label>
              <input
                type="number"
                value={formData.targetFatG}
                onChange={(e) => setFormData({ ...formData, targetFatG: parseInt(e.target.value) || 65 })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Apply & Save Biometrics</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
