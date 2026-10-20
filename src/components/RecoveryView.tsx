import React, { useState } from 'react';
import { RecoveryMetric, MuscleFatigue } from '../types';
import {
  HeartPulse,
  Sparkles,
  ShieldAlert,
  Moon,
  Activity,
  Zap,
  RefreshCw,
  Info
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface RecoveryViewProps {
  recovery: RecoveryMetric;
  onUpdateRecovery: (updated: RecoveryMetric) => void;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({
  recovery,
  onUpdateRecovery
}) => {
  const [fatigueMap, setFatigueMap] = useState<MuscleFatigue>(recovery.muscleFatigue);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Historical trend data for chart
  const historyData = [
    { day: 'Mon', hrv: 62, sleep: 7.2, readiness: 78 },
    { day: 'Tue', hrv: 65, sleep: 7.5, readiness: 81 },
    { day: 'Wed', hrv: 58, sleep: 6.4, readiness: 68 },
    { day: 'Thu', hrv: 70, sleep: 8.1, readiness: 88 },
    { day: 'Fri', hrv: 68, sleep: 7.4, readiness: 82 },
    { day: 'Sat', hrv: 64, sleep: 7.0, readiness: 76 },
    { day: 'Sun', hrv: recovery.hrvMs, sleep: recovery.sleepHours, readiness: recovery.readinessScore }
  ];

  const handleFatigueChange = (muscle: keyof MuscleFatigue, val: number) => {
    setFatigueMap((prev) => ({ ...prev, [muscle]: val }));
  };

  const handleRunAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-recovery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hrvMs: recovery.hrvMs,
          sleepHours: recovery.sleepHours,
          sleepQualityScore: recovery.sleepQualityScore,
          strainScore: recovery.strainScore,
          muscleFatigue: fatigueMap
        })
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        const updated: RecoveryMetric = {
          ...recovery,
          readinessScore: data.analysis.readinessScore,
          injuryRisk: data.analysis.injuryRisk,
          muscleFatigue: fatigueMap,
          aiRecoverySummary: data.analysis.aiRecoverySummary,
          recommendedActivity: data.analysis.recommendedActivity
        };
        onUpdateRecovery(updated);
      }
    } catch (e) {
      console.error('Failed to run AI recovery analysis:', e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const muscles: { key: keyof MuscleFatigue; label: string }[] = [
    { key: 'chest', label: 'Chest' },
    { key: 'back', label: 'Back' },
    { key: 'quads', label: 'Quads' },
    { key: 'hamstrings', label: 'Hamstrings' },
    { key: 'shoulders', label: 'Shoulders' },
    { key: 'biceps', label: 'Biceps' },
    { key: 'triceps', label: 'Triceps' },
    { key: 'core', label: 'Core / Abs' }
  ];

  const getFatigueColor = (score: number) => {
    if (score < 35) return 'bg-emerald-500 text-emerald-950';
    if (score < 65) return 'bg-amber-500 text-amber-950';
    return 'bg-rose-500 text-rose-950 animate-pulse';
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>Biometric Readiness & Injury Prevention</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Recovery & Muscle Fatigue Map</h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizes heart rate variability (HRV), sleep staging, and muscular strain to prevent overtraining.
          </p>
        </div>

        <button
          onClick={handleRunAiAnalysis}
          disabled={isAnalyzing}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing Biometrics...' : 'Re-calculate Readiness'}</span>
        </button>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Readiness & Injury Risk */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Readiness & Injury Risk</span>
            <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
              recovery.injuryRisk === 'Low' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {recovery.injuryRisk} Injury Risk
            </span>
          </div>

          <div className="flex items-baseline gap-3 my-2">
            <span className="text-5xl font-extrabold font-mono text-slate-100">{recovery.readinessScore}</span>
            <span className="text-sm text-emerald-400 font-bold uppercase">/ 100 Prime</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            {recovery.aiRecoverySummary}
          </p>
        </div>

        {/* Card 2: HRV Baseline */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Autonomic HRV</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-5xl font-extrabold font-mono text-cyan-300">{recovery.hrvMs}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">ms rMSSD</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
            <span className="text-cyan-400 font-bold block mb-1">Target Threshold: +12% vs Baseline</span>
            Higher HRV indicates autonomic nervous system balance and parasympathetic dominance.
          </div>
        </div>

        {/* Card 3: Sleep Architecture */}
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sleep Quality</span>
            <Moon className="w-4 h-4 text-indigo-400" />
          </div>

          <div className="flex items-baseline gap-2 my-2">
            <span className="text-5xl font-extrabold font-mono text-indigo-300">{recovery.sleepHours}</span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Hours ({recovery.sleepQualityScore}% score)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs text-slate-300">
            <span className="text-indigo-400 font-bold block mb-1">Deep & REM Restoration</span>
            High sleep efficiency achieved. Cellular growth hormone release optimal.
          </div>
        </div>

      </div>

      {/* Grid: Muscle Fatigue Map & Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Interactive Muscle Fatigue Heatmap Grid */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Interactive Muscular Fatigue Heatmap
              </h3>
              <span className="text-[11px] text-slate-400">Adjust sliders to re-calculate risk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {muscles.map(({ key, label }) => {
                const score = fatigueMap[key];
                return (
                  <div key={key} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-200">{label}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${getFatigueColor(score)}`}>
                        {score}% Fatigue
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => handleFatigueChange(key, parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300">
            <span className="font-bold text-amber-400 block mb-1">🛡️ Injury Prevention Protocol:</span>
            {recovery.recommendedActivity}
          </div>
        </div>

        {/* 7-Day HRV & Readiness Trends Chart */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col justify-between shadow-xl">
          <h3 className="font-extrabold text-sm text-slate-100 mb-2">7-Day Readiness & HRV Trend</h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis domain={[50, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="readiness" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#readinessGrad)" name="Readiness Score" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
