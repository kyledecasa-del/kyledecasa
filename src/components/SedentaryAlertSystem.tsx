import React, { useState, useEffect } from 'react';
import {
  Footprints,
  Clock,
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  HeartPulse,
  ChevronRight,
  Flame,
  Activity,
  Bell
} from 'lucide-react';

interface SedentaryAlertSystemProps {
  onAddSteps?: (steps: number) => void;
}

export const MOBILITY_DRILLS = [
  {
    title: '2-Minute Desk Walk',
    duration: '2 mins',
    benefit: 'Reactivates glutes & boosts leg circulation',
    stepsReward: 200,
    instructions: 'Stand up, roll back shoulders, and walk 200 light steps around your room or desk area.'
  },
  {
    title: 'Standing Hip Flexor & Glute Opener',
    duration: '90 secs',
    benefit: 'Relieves lower back tightness from sitting',
    stepsReward: 100,
    instructions: 'Step back into a shallow lunge, tuck pelvis forward, and stretch hip flexors for 45s each side.'
  },
  {
    title: 'Seated Spinal Twist & Neck Rolls',
    duration: '1 min',
    benefit: 'Decompresses upper spine & relieves shoulder tension',
    stepsReward: 50,
    instructions: 'Sit upright, place left hand on right knee, twist gently, then perform 5 slow clockwise neck circles.'
  }
];

export const SedentaryAlertSystem: React.FC<SedentaryAlertSystemProps> = ({ onAddSteps }) => {
  const [inactiveMinutes, setInactiveMinutes] = useState<number>(45);
  const [thresholdMinutes, setThresholdMinutes] = useState<number>(45);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeDrillModal, setActiveDrillModal] = useState<typeof MOBILITY_DRILLS[0] | null>(null);
  const [drillCompleted, setDrillCompleted] = useState<boolean>(false);

  // Simulated timer incrementing inactive minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setInactiveMinutes((prev) => {
        const next = prev + 1;
        if (next >= thresholdMinutes && !showAlert) {
          triggerAlertNotification();
        }
        return next;
      });
    }, 60000); // Check every minute (simulated)

    return () => clearInterval(interval);
  }, [thresholdMinutes, showAlert]);

  const triggerAlertNotification = () => {
    setShowAlert(true);
    if (soundEnabled && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = "Gentle wellness reminder: You have been sitting for 45 minutes. Time for a quick 2-minute movement break!";
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSnooze = (mins: number) => {
    setShowAlert(false);
    setInactiveMinutes(0);
  };

  const handleCompleteDrill = () => {
    if (activeDrillModal && onAddSteps) {
      onAddSteps(activeDrillModal.stepsReward);
    }
    setDrillCompleted(true);
    setTimeout(() => {
      setDrillCompleted(false);
      setActiveDrillModal(null);
      setShowAlert(false);
      setInactiveMinutes(0);
    }, 1800);
  };

  return (
    <>
      {/* Floating Push Alert Banner */}
      {showAlert && (
        <div className="fixed top-20 right-4 md:right-8 z-50 w-full max-w-md animate-in slide-in-from-top-4 duration-300">
          <div className="bg-slate-900/95 backdrop-blur-xl border-2 border-cyan-500/60 rounded-3xl p-5 shadow-2xl shadow-cyan-500/20 text-slate-100 space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/30">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
                    <Footprints className="w-5 h-5 animate-bounce" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider font-mono">
                      Gentle Sedentary Alert
                    </span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-100">Time to Unfurl & Move!</h4>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
                  title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowAlert(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Alert Body */}
            <p className="text-xs text-slate-300 leading-relaxed">
              You've been stationary for <strong className="text-cyan-400 font-mono font-black">{inactiveMinutes} minutes</strong>. Taking a quick 2-minute walking or stretching break restores hip mobility and boosts mental focus.
            </p>

            {/* Recommended Movement Drills */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                Recommended 2-Min Micro-Breaks:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {MOBILITY_DRILLS.map((drill) => (
                  <button
                    key={drill.title}
                    onClick={() => setActiveDrillModal(drill)}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-bold text-xs text-slate-200 group-hover:text-cyan-300 block">
                        {drill.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{drill.benefit}</span>
                    </div>
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/20 shrink-0">
                      +{drill.stepsReward} Steps
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => handleSnooze(15)}
                className="text-slate-400 hover:text-slate-200 font-bold text-[11px]"
              >
                Snooze 15 Mins
              </button>
              <button
                onClick={() => {
                  setInactiveMinutes(0);
                  setShowAlert(false);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px]"
              >
                Dismiss
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Manual Test / Status Control Bar Widget */}
      <div className="fixed bottom-6 left-6 z-40 hidden lg:flex items-center gap-2">
        <button
          onClick={triggerAlertNotification}
          className="px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 text-xs font-bold shadow-xl flex items-center gap-2 transition-colors"
          title="Test Sedentary Inactivity Alert"
        >
          <Bell className="w-4 h-4 text-cyan-400" />
          <span>Sedentary Tracker ({inactiveMinutes}m)</span>
        </button>
      </div>

      {/* Interactive Mobility Drill Modal */}
      {activeDrillModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 text-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400">
                <Activity className="w-5 h-5" />
                <h3 className="font-extrabold text-base">{activeDrillModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveDrillModal(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {drillCompleted ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-black text-lg text-slate-100">Mobility Break Completed! 🎉</h4>
                <p className="text-xs text-slate-400">
                  +{activeDrillModal.stepsReward} steps added to your daily activity total. Great job staying active!
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Instructions</span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {activeDrillModal.instructions}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                  <span>Reward: +{activeDrillModal.stepsReward} Steps</span>
                  <span className="font-mono font-bold">{activeDrillModal.duration}</span>
                </div>

                <button
                  onClick={handleCompleteDrill}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20"
                >
                  Mark Break as Completed 💪
                </button>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
