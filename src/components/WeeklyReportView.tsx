import React, { useState } from 'react';
import { UserProfile, WeeklyProgressReport, WorkoutRoutine, DailyNutrition } from '../types';
import { WorkoutCalendar } from './WorkoutCalendar';
import {
  FileBarChart2,
  Sparkles,
  Award,
  TrendingUp,
  RefreshCw,
  CheckCircle2,
  Target,
  Download,
  FileText,
  Copy,
  Check,
  X,
  Share2
} from 'lucide-react';

interface WeeklyReportViewProps {
  profile: UserProfile;
  report: WeeklyProgressReport;
  routines: WorkoutRoutine[];
  nutrition: DailyNutrition;
  onUpdateReport: (updated: WeeklyProgressReport) => void;
}

export const WeeklyReportView: React.FC<WeeklyReportViewProps> = ({
  profile,
  report,
  routines,
  nutrition,
  onUpdateReport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const generateTextSummaryReport = (): string => {
    const todayStr = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const milestonesFormatted = report.keyMilestones.length > 0
      ? report.keyMilestones.map((m, i) => `  ${i + 1}. ${m}`).join('\n')
      : '  • No specific milestones recorded for this period.';

    const routinesFormatted = routines.length > 0
      ? routines.map(r => `  • ${r.title} (${r.targetMuscleGroup.toUpperCase()}) - ${r.exercises.length} Exercises | Target: ${r.estimatedMinutes}m`).join('\n')
      : '  • No active routines scheduled.';

    return `================================================================================
            AURAFIT PERFORMANCE & NUTRITION WEEKLY REPORT
================================================================================
Report Period    : ${report.weekRange}
Exported On      : ${todayStr}

--------------------------------------------------------------------------------
1. ATHLETE PROFILE & BIOMETRICS
--------------------------------------------------------------------------------
• Athlete Name   : ${profile.name}
• Biological Sex : ${profile.gender ? profile.gender.toUpperCase() : 'NOT SPECIFIED'}
• Age            : ${profile.age} years old
• Current Weight : ${profile.weightKg} kg
• Current Height : ${profile.heightCm} cm
• Body Fat %     : ${profile.bodyFatPct || 18}%
• Fitness Goal   : ${profile.goal.replace(/_/g, ' ').toUpperCase()}
• Fitness Level  : ${profile.fitnessLevel.toUpperCase()}
• Resting HR     : ${profile.restingHR} BPM | Max HR: ${profile.maxHR} BPM
• VO2 Max        : ${profile.vo2Max || 50} ml/kg/min

--------------------------------------------------------------------------------
2. WEEKLY ATHLETIC PERFORMANCE SUMMARY
--------------------------------------------------------------------------------
• Workouts Completed : ${report.totalWorkouts} Workouts
• Total Active Time  : ${report.totalMinutes} Minutes
• Total Calorie Burn : ${report.totalCalories} kcal Active
• Macro Adherence    : ${report.macroAdherencePct}% Target Compliance

--------------------------------------------------------------------------------
3. NUTRITION & DAILY MACRO TARGETS
--------------------------------------------------------------------------------
• Daily Calorie Goal : ${profile.dailyCalorieTarget} kcal (Logged: ${nutrition.caloriesConsumed} kcal)
• Protein Target     : ${profile.targetProteinG} g (Logged: ${nutrition.proteinG} g)
• Carbs Target       : ${profile.targetCarbsG} g (Logged: ${nutrition.carbsG} g)
• Fat Target         : ${profile.targetFatG} g (Logged: ${nutrition.fatG} g)
• Water Goal         : ${profile.targetWaterMl} ml (Logged: ${nutrition.waterMl} ml)

--------------------------------------------------------------------------------
4. KEY MILESTONES & PERSONAL RECORDS
--------------------------------------------------------------------------------
${milestonesFormatted}

--------------------------------------------------------------------------------
5. ACTIVE ROUTINES SCHEDULED
--------------------------------------------------------------------------------
${routinesFormatted}

--------------------------------------------------------------------------------
6. AI COMPREHENSIVE PERFORMANCE ANALYSIS
--------------------------------------------------------------------------------
${report.aiComprehensiveAnalysis}

--------------------------------------------------------------------------------
7. BIO-ADAPTIVE NEXT-WEEK STRATEGY
--------------------------------------------------------------------------------
${report.aiNextWeekStrategy}

================================================================================
               End of Report — Powered by AuraFit AI Sports Science
================================================================================`;
  };

  const handleDownloadTextSummary = () => {
    const textContent = generateTextSummaryReport();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedRange = report.weekRange.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `AuraFit_Weekly_Report_${sanitizedRange}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = () => {
    const textContent = generateTextSummaryReport();
    navigator.clipboard.writeText(textContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleGenerateNewReport = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini/weekly-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userProfile: profile,
          workoutSummary: {
            count: 5,
            totalMins: 215,
            totalCalories: 2340
          },
          avgReadiness: 81,
          avgHRV: 71,
          macroAdherence: 92
        })
      });

      const data = await res.json();
      if (data.success && data.report) {
        const updated: WeeklyProgressReport = {
          ...report,
          id: `report_${Date.now()}`,
          weekRange: 'Jul 21 - Jul 27, 2026',
          keyMilestones: data.report.keyMilestones,
          aiComprehensiveAnalysis: data.report.aiComprehensiveAnalysis,
          aiNextWeekStrategy: data.report.aiNextWeekStrategy
        };
        onUpdateReport(updated);
      }
    } catch (e) {
      console.error('Failed to generate weekly report:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileBarChart2 className="w-4 h-4" />
            <span>AI Long-Term Performance Review</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Weekly Progress Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizes progressive overload data, HRV trends, macro compliance, and milestone achievements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowExportModal(true)}
            className="py-2.5 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs border border-slate-700 flex items-center gap-2 transition-all shadow-md"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Export / Download Text Report</span>
          </button>

          <button
            onClick={handleGenerateNewReport}
            disabled={isGenerating}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Compiling Performance Metrics...' : 'Generate AI Weekly Synthesis'}</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Workouts</span>
          <span className="text-3xl font-extrabold text-slate-100 font-mono">{report.totalWorkouts}</span>
          <span className="text-[10px] text-emerald-400 block font-bold mt-1">100% On Schedule</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Active Duration</span>
          <span className="text-3xl font-extrabold text-cyan-400 font-mono">{report.totalMinutes}m</span>
          <span className="text-[10px] text-cyan-300 block font-bold mt-1">Zone 2 & Hypertrophy</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Calorie Burn</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono">{report.totalCalories}</span>
          <span className="text-[10px] text-amber-300 block font-bold mt-1">kcal Active</span>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Macro Compliance</span>
          <span className="text-3xl font-extrabold text-emerald-400 font-mono">{report.macroAdherencePct}%</span>
          <span className="text-[10px] text-emerald-300 block font-bold mt-1">High Accuracy</span>
        </div>
      </div>

      {/* Visual Schedule & Compliance Calendar */}
      <WorkoutCalendar routines={routines} />

      {/* AI Analysis & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Performance Synthesis */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-base text-slate-100">AI Comprehensive Performance Analysis</h3>
            </div>
            <button
              onClick={handleDownloadTextSummary}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            {report.aiComprehensiveAnalysis}
          </p>

          <div className="pt-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-2">
              <Target className="w-4 h-4" />
              Next Week's Bio-Adaptive Strategy
            </h4>
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-200 leading-relaxed">
              {report.aiNextWeekStrategy}
            </div>
          </div>
        </div>

        {/* Right Column: Key Milestones */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h3 className="font-extrabold text-base text-slate-100">Weekly Milestones & PRs</h3>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Summary</span>
            </button>
          </div>

          <div className="space-y-3">
            {report.keyMilestones.map((milestone, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-semibold text-slate-200">{milestone}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Export / Download Text Summary Report Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <FileText className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Weekly Fitness & Nutrition Text Summary</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Period: <strong className="text-slate-200 font-mono">{report.weekRange}</strong></span>
                <span>Format: <strong className="text-emerald-400 font-mono">Plain Text Document (.txt)</strong></span>
              </div>

              {/* Text Preview Box */}
              <div className="relative">
                <textarea
                  readOnly
                  value={generateTextSummaryReport()}
                  className="w-full h-80 bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 leading-relaxed focus:outline-none resize-none select-all scrollbar-thin"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleCopyText}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-colors border border-slate-700"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    <span>Copy Text to Clipboard</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Close
                </button>

                <button
                  onClick={() => {
                    handleDownloadTextSummary();
                    setShowExportModal(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download .txt File</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

