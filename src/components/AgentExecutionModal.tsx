import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Sparkles, Copy, Check, Terminal, ExternalLink, RefreshCw, Globe, Dumbbell, Activity, Flame } from 'lucide-react';
import { AgentCategory } from '../types';

interface AgentExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  category: AgentCategory;
  webSearchEnabled: boolean;
}

export const AgentExecutionModal: React.FC<AgentExecutionModalProps> = ({
  isOpen,
  onClose,
  prompt,
  category,
  webSearchEnabled
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [copied, setCopied] = useState(false);

  const steps = [
    { label: 'Ingesting athlete biometrics, training goals & domain constraints', duration: 550 },
    {
      label: webSearchEnabled
        ? 'Querying peer-reviewed sports science indices & physiology benchmarks'
        : 'Loading OmniSync AI Fitness sports science neural models',
      duration: 650
    },
    { label: `Invoking specialized ${category.toUpperCase()} fitness engine & RPE rules`, duration: 750 },
    { label: 'Synthesizing evidence-based workout, nutrition & recovery protocol', duration: 600 }
  ];

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsDone(false);
      return;
    }

    let stepTimer: NodeJS.Timeout;
    const runSteps = (idx: number) => {
      if (idx < steps.length) {
        stepTimer = setTimeout(() => {
          setCurrentStep(idx + 1);
          runSteps(idx + 1);
        }, steps[idx].duration);
      } else {
        setIsDone(true);
      }
    };

    runSteps(0);
    return () => clearTimeout(stepTimer);
  }, [isOpen, prompt]);

  if (!isOpen) return null;

  // Generate realistic AI fitness coaching output
  const generateFitnessOutput = () => {
    const p = prompt.toLowerCase();
    if (category === 'slides' || p.includes('macro') || p.includes('nutrition') || p.includes('diet') || p.includes('protein')) {
      return `# OmniSync AI Fitness: Precision Nutrition & Macro Blueprint

### Target Caloric & Macronutrient Distribution
- **Daily Target**: 2,350 kcal *(Evidence-Based Moderate Caloric Deficit)*
- **Protein**: 175g (2.2g per kg bodyweight) • Optimal Muscle Protein Synthesis
- **Carbohydrates**: 235g • High Glycogen Replenishment & Training Output
- **Healthy Fats**: 72g • Endocrine & Hormonal Homeostasis
- **Hydration**: 3.5 Liters + 500ml electrolyte solution post-exercise

### MPS Meal Timing Schedule:
1. **08:00 AM (Breakfast)**: 40g Protein (Whole eggs, oats, blueberries, whey isolate)
2. **12:30 PM (Lunch)**: 45g Protein (Grilled chicken breast, quinoa, steamed greens)
3. **04:30 PM (Pre-Workout)**: 25g Whey + 40g fast-digesting carbohydrates
4. **08:00 PM (Dinner)**: 45g Protein (Wild salmon, sweet potatoes, olive oil salad)`;
    }

    if (category === 'sheets' || p.includes('heart') || p.includes('zone') || p.includes('biometric') || p.includes('hrv')) {
      return `# OmniSync AI Fitness: Cardiovascular Telemetry & Zone Analysis

### Calculated Heart Rate Training Zones (Karvonen Exercise Formula):
| Zone | BPM Range | % Max HR | Primary Physiological Adaptation | Recommended Duration |
|---|---|---|---|---|
| **Zone 1** | 110 - 126 BPM | 50 - 60% | Active Capillarization & Recovery | 30 - 60 mins |
| **Zone 2** | 127 - 144 BPM | 60 - 70% | Maximal Mitochondrial Fat Oxidation | 45 - 90 mins |
| **Zone 3** | 145 - 160 BPM | 70 - 80% | Aerobic Tempo & Sustained Lactate Pace | 20 - 45 mins |
| **Zone 4** | 161 - 175 BPM | 80 - 90% | Anaerobic Lactate Threshold Power | 15 - 25 mins |
| **Zone 5** | 176 - 190 BPM | 90 - 100% | VO2 Max & Neuromuscular Sprint Power | 3 - 6 mins (Intervals) |

### HRV Strain & Recovery Score:
- Readiness: **88/100 (Optimal)** • Baseline Heart Rate Variability in healthy sympathetic range.`;
    }

    if (category === 'developer' || p.includes('knee') || p.includes('pain') || p.includes('form') || p.includes('joint') || p.includes('shoulder')) {
      return `# OmniSync AI Fitness: Biomechanics & Joint Pre-Hab Protocol

### Biomechanical Joint Integrity & Form Corrections:
1. **Rotator Cuff & Scapular Plane**:
   - Always press dumbbells in the scapular plane (30-45° forward of the coronal plane) to eliminate subacromial impingement.
2. **Knee-Friendly Loading Substitutions**:
   - Swap high-shear Quad Extensions with **Spanish Squats** or **Reverse Nordics** to stimulate patellar tendon remodeling safely.
3. **Hip Hinge Kinematics**:
   - Maintain neutral cervical and lumbar spine; initiate movement by pushing hips posteriorly toward the wall behind you.

### 3-Minute Joint Activation Routine:
- 15x Banded External Rotations (Elbows at 90°)
- 10x Cat-Cow Thoracic Extensions
- 12x Bodyweight Hip Bridges with 2-second isometric squeeze`;
    }

    // Default / Workouts / Coach AI
    return `# OmniSync AI Fitness: Periodized Training Protocol

### Primary Workout Architecture
Designed for progressive mechanical tension, optimal motor unit recruitment, and fatigue management.

| Movement | Sets | Rep Range | RPE / Intensity | Rest Interval |
|---|---|---|---|---|
| **Barbell Bench Press (or Squat)** | 4 | 6 - 8 reps | RPE 8.0 (2 in reserve) | 2.5 - 3.0 min |
| **Incline Dumbbell Press** | 3 | 8 - 10 reps | RPE 8.5 | 2.0 min |
| **Chest-Supported Row** | 4 | 8 - 12 reps | RPE 8.5 | 90 sec |
| **Lateral Dumbbell Raises** | 3 | 12 - 15 reps | RPE 9.0 | 60 sec |
| **Triceps Overhead Extension** | 3 | 10 - 12 reps | RPE 9.0 | 60 sec |

### Evidence-Based Coaching Notes:
- **Autoregulation**: If sleep or HRV readiness is low, reduce working sets by 20% to avoid CNS overreaching.
- **Progressive Overload Rule**: Once you hit the top rep ceiling (8 reps on 4 sets), increase weight by 2.5 kg next session.`;
  };

  const outputText = generateFitnessOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0e0a1e] border border-purple-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#140e28]/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                OmniSync AI Fitness Super Agent
                <span className="text-xs font-normal text-purple-400 px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/50 uppercase tracking-wide">
                  {category}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Autonomous sports science &amp; biometrics engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* User Input Prompt Display */}
          <div className="p-4 rounded-xl bg-[#17112d] border border-purple-900/40">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span className="font-medium text-purple-300">Fitness Requirements &amp; Goals</span>
              {webSearchEnabled && (
                <span className="flex items-center gap-1 text-emerald-400">
                  <Globe className="w-3.5 h-3.5" /> Sports Science Grounded
                </span>
              )}
            </div>
            <p className="text-slate-200 text-sm italic font-sans">
              "{prompt || 'Design an evidence-based progressive hypertrophy and macro split...'}"
            </p>
          </div>

          {/* Stepper Pipeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              AI Coaching Telemetry &amp; Execution Graph
            </h4>
            <div className="space-y-2">
              {steps.map((st, i) => {
                const isCompleted = currentStep > i;
                const isCurrent = currentStep === i && !isDone;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-purple-950/20 border-purple-800/40 text-purple-200'
                        : isCurrent
                        ? 'bg-purple-900/30 border-purple-500/60 text-white shadow-[0_0_12px_rgba(168,85,247,0.2)]'
                        : 'bg-[#110d22] border-white/5 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <RefreshCw className="w-4 h-4 text-purple-400 animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                      )}
                      <span className="text-xs font-medium">{st.label}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 tabular-nums">
                      {isCompleted ? '✓ Done' : isCurrent ? 'Computing...' : 'Queued'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Generated Result Preview */}
          {isDone && (
            <div className="p-4 rounded-xl bg-[#140e28] border border-purple-500/40 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center justify-between border-b border-purple-900/40 pb-2">
                <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> OmniSync AI Fitness Protocol Ready
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Protocol'}
                </button>
              </div>

              <div className="text-xs text-slate-200 font-sans leading-relaxed bg-[#0a0715] p-3 rounded-lg border border-purple-950/60 max-h-64 overflow-y-auto whitespace-pre-wrap">
                {outputText}
              </div>

              <div className="pt-2 text-xs text-emerald-400 font-sans flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>Protocol synced with athlete biometrics and exercise physiology safety guidelines.</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-900/30 bg-[#120c24]">
          <span className="text-xs text-slate-400">
            Powered by OmniSync AI Fitness Super Agents v1.0
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all"
            >
              {isDone ? 'Close & Apply to Routine' : 'Run in Background'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
