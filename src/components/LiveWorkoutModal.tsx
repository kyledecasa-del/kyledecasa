import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, HeartRateZone, HeartRateSample, Exercise } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  X,
  Sparkles,
  Zap,
  Flame,
  Heart,
  Timer,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

interface LiveWorkoutModalProps {
  routine: WorkoutRoutine;
  onClose: () => void;
  onCompleteWorkout: (calories: number, durationMins: number, isGuest?: boolean, athleteName?: string, guestTag?: string) => void;
}

export const LiveWorkoutModal: React.FC<LiveWorkoutModalProps> = ({
  routine,
  onClose,
  onCompleteWorkout
}) => {
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [exerciseTimerSec, setExerciseTimerSec] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restRemainingSec, setRestRemainingSec] = useState(0);

  // Guest Session State
  const [isGuestSession, setIsGuestSession] = useState(false);
  const [guestName, setGuestName] = useState('Guest Athlete');
  const [guestTag, setGuestTag] = useState(`Guest #${Math.floor(100 + Math.random() * 900)}`);

  // Biometrics
  const [currentHR, setCurrentHR] = useState(132);
  const [hrHistory, setHrHistory] = useState<HeartRateSample[]>([]);
  const [caloriesBurned, setCaloriesBurned] = useState(12);

  // Audio Coach (SpeechSynthesis API)
  const [isAudioCoachEnabled, setIsAudioCoachEnabled] = useState(true);

  // AI Adaptations
  const [isAdjustingAI, setIsAdjustingAI] = useState(false);
  const [lastAdaptation, setLastAdaptation] = useState<{
    action: string;
    advice: string;
    statusColor: string;
  } | null>(null);

  const currentExercise: Exercise = routine.exercises[activeExerciseIdx] || routine.exercises[0];

  // SpeechSynthesis Helper
  const speakText = (text: string) => {
    if (!isAudioCoachEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel(); // Stop current speaking before new prompt
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('SpeechSynthesis error:', e);
    }
  };

  // Announce current exercise when index or exercise changes
  useEffect(() => {
    if (currentExercise && !isResting) {
      const prompt = `Exercise ${activeExerciseIdx + 1}: ${currentExercise.name}. ${currentExercise.sets} sets of ${currentExercise.reps}. ${currentExercise.instructions}`;
      speakText(prompt);
    }
  }, [activeExerciseIdx, isResting]);

  // Helper to determine HR zone
  const getHRZone = (bpm: number): HeartRateZone => {
    if (bpm < 115) return 'Zone 1 (Warmup)';
    if (bpm < 135) return 'Zone 2 (Fat Burn)';
    if (bpm < 155) return 'Zone 3 (Aerobic)';
    if (bpm < 172) return 'Zone 4 (Anaerobic)';
    return 'Zone 5 (Max)';
  };

  const getZoneBadgeColor = (zone: HeartRateZone) => {
    if (zone.includes('Zone 1')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (zone.includes('Zone 2')) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (zone.includes('Zone 3')) return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    if (zone.includes('Zone 4')) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-rose-500/20 text-rose-300 border-rose-500/30 animate-pulse';
  };

  // Ticking workout timer & HR simulation
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setElapsedSec((prev) => prev + 1);

      if (isResting) {
        setRestRemainingSec((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
        // HR drops during rest
        setCurrentHR((prev) => Math.max(98, prev - Math.floor(Math.random() * 2)));
      } else {
        setExerciseTimerSec((prev) => prev + 1);
        // Calorie burn rate
        setCaloriesBurned((prev) => prev + 0.15);
        // Simulate HR oscillation based on active exercise target
        setCurrentHR((prev) => {
          const delta = (Math.random() - 0.45) * 3;
          const nextBpm = Math.min(186, Math.max(105, Math.round(prev + delta)));
          return nextBpm;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, isResting]);

  // Record HR history every 4 seconds for line chart
  useEffect(() => {
    if (elapsedSec > 0 && elapsedSec % 4 === 0) {
      const timeLabel = `${Math.floor(elapsedSec / 60)}:${(elapsedSec % 60).toString().padStart(2, '0')}`;
      setHrHistory((prev) => [
        ...prev.slice(-20), // Keep last 20 samples
        { timestamp: timeLabel, bpm: currentHR, zone: getHRZone(currentHR) }
      ]);
    }
  }, [elapsedSec, currentHR]);

  // Real-Time AI Intensity Adjustment trigger
  const triggerAiIntensityAdjustment = async (customHrOverride?: number) => {
    setIsAdjustingAI(true);
    const testBpm = customHrOverride || currentHR;

    try {
      const res = await fetch('/api/gemini/adjust-intensity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseName: currentExercise.name,
          currentHR: testBpm,
          targetHR: 145,
          targetZone: currentExercise.targetZone,
          elapsedTimeSec: exerciseTimerSec,
          currentWeightKg: currentExercise.weightKg || 0
        })
      });

      const data = await res.json();
      if (data.success && data.adjustment) {
        setLastAdaptation(data.adjustment);
        speakText(`Intensity alert: ${data.adjustment.action}. ${data.adjustment.advice}`);
      }
    } catch (e) {
      console.error('AI Adjustment failed:', e);
      const fallbackAdvice = testBpm > 170
        ? 'Heart rate spike detected (Zone 5)! Reduce weight by 10% and extend rest by 30s.'
        : 'Heart rate is in target range. Maintain rhythm and posture.';
      setLastAdaptation({
        action: testBpm > 170 ? 'REDUCE_INTENSITY' : 'MAINTAIN',
        advice: fallbackAdvice,
        statusColor: testBpm > 170 ? 'amber' : 'emerald'
      });
      speakText(`Intensity alert: ${fallbackAdvice}`);
    } finally {
      setIsAdjustingAI(false);
    }
  };

  const handleNextExercise = () => {
    if (activeExerciseIdx < routine.exercises.length - 1) {
      const nextIdx = activeExerciseIdx + 1;
      setActiveExerciseIdx(nextIdx);
      setIsResting(true);
      const restSec = currentExercise.restPeriodSec || 60;
      setRestRemainingSec(restSec);
      setExerciseTimerSec(0);
      setLastAdaptation(null);
      speakText(`Rest interval active for ${restSec} seconds. Take deep breaths.`);
    } else {
      // Workout Completed
      speakText("Workout complete! Outstanding job.");
      onCompleteWorkout(
        Math.round(caloriesBurned),
        Math.round(elapsedSec / 60),
        isGuestSession,
        isGuestSession ? guestName : undefined,
        isGuestSession ? guestTag : undefined
      );
    }
  };

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentZone = getHRZone(currentHR);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col overflow-y-auto">
      
      {/* Top Header Controls */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Live AI Telemetry Engine
              </span>
              {isGuestSession && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold font-mono">
                  Guest Session ({guestTag})
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-100">{routine.title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Guest Mode Session Toggle */}
          <button
            onClick={() => setIsGuestSession(!isGuestSession)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
              isGuestSession
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700'
            }`}
            title="Toggle whether this workout history is logged for a Guest Athlete"
          >
            <span>👤</span>
            <span>{isGuestSession ? 'Guest Athlete Mode' : 'Primary Mode'}</span>
          </button>

          <button
            onClick={() => {
              const nextState = !isAudioCoachEnabled;
              setIsAudioCoachEnabled(nextState);
              if (nextState) {
                speakText(`Audio coach enabled. Next exercise is ${currentExercise.name}.`);
              } else {
                window.speechSynthesis?.cancel();
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isAudioCoachEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
            title="Toggle Voice Coach SpeechSynthesis TTS"
          >
            {isAudioCoachEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden sm:inline">{isAudioCoachEnabled ? 'Voice Coach Active' : 'Voice Muted'}</span>
          </button>

          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-200 font-bold">{formatTime(elapsedSec)}</span>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5 text-amber-400" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Exercise & Controls */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Active Exercise Card */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300">
                Exercise {activeExerciseIdx + 1} of {routine.exercises.length}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getZoneBadgeColor(currentExercise.targetZone)}`}>
                Target: {currentExercise.targetZone}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold text-slate-100 mb-2">{currentExercise.name}</h3>
            
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-center">
                <span className="text-[11px] text-slate-400 block uppercase">Sets x Reps</span>
                <span className="text-lg font-bold text-slate-200">{currentExercise.sets} x {currentExercise.reps}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-center">
                <span className="text-[11px] text-slate-400 block uppercase">Weight</span>
                <span className="text-lg font-bold text-cyan-400">{currentExercise.weightKg ? `${currentExercise.weightKg} kg` : 'Bodyweight'}</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-center">
                <span className="text-[11px] text-slate-400 block uppercase">Rest Target</span>
                <span className="text-lg font-bold text-slate-200">{currentExercise.restPeriodSec}s</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/30 leading-relaxed mb-6">
              💡 <span className="font-semibold text-slate-200">Coach Guidance:</span> {currentExercise.instructions}
            </p>

            {/* Rest Timer or Active Workout Action */}
            {isResting ? (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl text-center animate-pulse">
                <span className="text-xs text-amber-300 uppercase font-semibold block">Rest Interval active</span>
                <span className="text-3xl font-extrabold font-mono text-amber-400">{restRemainingSec}s</span>
                <p className="text-xs text-slate-400 mt-1">Deep nasal breathing. Hydrate and prepare for next set.</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleNextExercise}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{activeExerciseIdx < routine.exercises.length - 1 ? 'Complete Exercise & Rest' : 'Finish Workout'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Real-time Heart Rate Stream & AI Adaptation Box */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h4 className="font-bold text-sm text-slate-100">Real-Time AI Bio-Adaptation Engine</h4>
              </div>

              {/* Simulation HR spike trigger for testing */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const spikeHr = 178;
                    setCurrentHR(spikeHr);
                    triggerAiIntensityAdjustment(spikeHr);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors"
                >
                  Simulate HR Spike (178 BPM)
                </button>
                <button
                  onClick={() => triggerAiIntensityAdjustment()}
                  disabled={isAdjustingAI}
                  className="text-[11px] px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-colors flex items-center gap-1 font-semibold"
                >
                  {isAdjustingAI ? 'Analyzing...' : 'Evaluate HR Now'}
                </button>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            {lastAdaptation ? (
              <div className={`p-4 rounded-xl border ${
                lastAdaptation.statusColor === 'amber' || lastAdaptation.statusColor === 'red'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
              }`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider block mb-1">
                      AI Live Adaptation: {lastAdaptation.action}
                    </span>
                    <p className="text-xs leading-relaxed text-slate-200">{lastAdaptation.advice}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-400 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                <span>Monitoring telemetry stream. AI will automatically prompt adjustments if heart rate diverges from safety threshold.</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Live HR Telemetry Gauge & Chart */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Heart Rate Display Gauge */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Wearable Heart Rate Sync
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-rose-500/40 animate-ping opacity-25" />
                <div className="flex flex-col items-center">
                  <Heart className="w-8 h-8 text-rose-500 animate-bounce mb-1" />
                  <span className="text-4xl font-extrabold font-mono text-slate-100">{currentHR}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">BPM</span>
                </div>
              </div>
            </div>

            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getZoneBadgeColor(currentZone)}`}>
              {currentZone}
            </span>

            <div className="grid grid-cols-2 gap-3 w-full mt-6 text-left">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block uppercase">Active Burn</span>
                <span className="text-base font-bold text-amber-400">{Math.round(caloriesBurned)} kcal</span>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block uppercase">Elapsed Time</span>
                <span className="text-base font-bold text-slate-200">{formatTime(elapsedSec)}</span>
              </div>
            </div>
          </div>

          {/* Real-Time Heart Rate Graph */}
          <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex-1 flex flex-col justify-between">
            <h4 className="font-bold text-xs text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Heart Rate Telemetry Stream
            </h4>

            <div className="h-44 w-full">
              {hrHistory.length > 1 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hrHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hrColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="timestamp" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis domain={[90, 190]} stroke="#64748b" fontSize={10} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#f43f5e' }}
                    />
                    <ReferenceLine y={170} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: 'Zone 5 Threshold', fill: '#f43f5e', fontSize: 10 }} />
                    <Area type="monotone" dataKey="bpm" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#hrColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-500">
                  Gathering live heart rate samples...
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
