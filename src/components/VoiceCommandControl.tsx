import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  X,
  HelpCircle,
  CheckCircle2,
  Radio,
  Command,
  Flame,
  Droplet
} from 'lucide-react';
import { TabType } from './TabNavigation';

interface VoiceCommandControlProps {
  onSelectTab: (tab: TabType) => void;
  onToggleTheme: () => void;
  onAddWater: (ml: number) => void;
  onStartFirstWorkout: () => void;
  theme: 'dark' | 'light';
}

export const VoiceCommandControl: React.FC<VoiceCommandControlProps> = ({
  onSelectTab,
  onToggleTheme,
  onAddWater,
  onStartFirstWorkout,
  theme
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastActionFeedback, setLastActionFeedback] = useState<string | null>(null);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);

      if (event.results[0].isFinal) {
        processVoiceCommand(currentTranscript.toLowerCase());
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const speakFeedback = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processVoiceCommand = (cmd: string) => {
    console.log('Voice Command Received:', cmd);

    // Navigation triggers
    if (cmd.includes('workout') || cmd.includes('exercise') || cmd.includes('training')) {
      if (cmd.includes('start') || cmd.includes('begin') || cmd.includes('launch')) {
        onStartFirstWorkout();
        const msg = 'Starting live adaptive workout!';
        setLastActionFeedback(msg);
        speakFeedback(msg);
      } else {
        onSelectTab('workouts');
        const msg = 'Opening Workouts Dashboard';
        setLastActionFeedback(msg);
        speakFeedback(msg);
      }
      return;
    }

    if (cmd.includes('nutrition') || cmd.includes('food') || cmd.includes('meal') || cmd.includes('diet')) {
      onSelectTab('nutrition');
      const msg = 'Opening AI Nutrition & Food Logger';
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    if (cmd.includes('report') || cmd.includes('weekly') || cmd.includes('analytics') || cmd.includes('progress') || cmd.includes('calendar')) {
      onSelectTab('weekly_report');
      const msg = 'Opening Weekly Analytics & Workout Calendar';
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    if (cmd.includes('challenge') || cmd.includes('social') || cmd.includes('community') || cmd.includes('leaderboard')) {
      onSelectTab('social');
      const msg = 'Opening Social Challenges';
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    if (cmd.includes('wearable') || cmd.includes('device') || cmd.includes('watch') || cmd.includes('heart rate')) {
      onSelectTab('wearables');
      const msg = 'Opening Connected Wearables';
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    // Theme toggles
    if (cmd.includes('light mode') || cmd.includes('dark mode') || cmd.includes('theme') || cmd.includes('toggle mode')) {
      onToggleTheme();
      const msg = `Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    // Water logging commands (e.g., "log water 250", "add 500 water")
    if (cmd.includes('water') || cmd.includes('drink') || cmd.includes('hydrate')) {
      let amount = 250;
      const match = cmd.match(/\d+/);
      if (match) {
        amount = parseInt(match[0], 10);
      }
      onAddWater(amount);
      const msg = `Logged ${amount} milliliters of water intake!`;
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    if (cmd.includes('help') || cmd.includes('command') || cmd.includes('what can i say')) {
      setShowHelpModal(true);
      const msg = 'Opening voice commands reference guide';
      setLastActionFeedback(msg);
      speakFeedback(msg);
      return;
    }

    // Unrecognized command
    const fallbackMsg = `Command not recognized: "${cmd}". Try saying "Go to Nutrition" or "Log water 250".`;
    setLastActionFeedback(fallbackMsg);
    speakFeedback('Sorry, I did not catch that command. Tap help for available commands.');
  };

  const toggleListening = () => {
    if (!isSupported) {
      alert('Speech Recognition API is not supported in this browser. Please try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      setLastActionFeedback(null);
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  return (
    <>
      {/* Floating Microphone Voice Command Trigger Bar */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        
        {/* Active Transcript / Feedback Pill */}
        {(isListening || lastActionFeedback) && (
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-cyan-500/40 text-xs shadow-2xl animate-in fade-in slide-in-from-bottom-2">
            <Radio className={`w-4 h-4 ${isListening ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className="font-mono text-slate-200">
              {isListening ? (transcript || 'Listening for commands...') : lastActionFeedback}
            </span>
          </div>
        )}

        {/* Mic Control Button */}
        <button
          onClick={toggleListening}
          className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 shadow-2xl transition-all ${
            isListening
              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 border-rose-400 animate-pulse scale-105 shadow-rose-500/30'
              : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 border-cyan-400 shadow-cyan-500/20'
          }`}
          title="Toggle Voice Command Control"
        >
          {isListening ? (
            <Mic className="w-5 h-5 animate-spin" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
          <span className="text-xs font-extrabold hidden md:inline">
            {isListening ? 'Listening...' : 'Voice AI'}
          </span>
        </button>

        {/* Voice Command Help Button */}
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700 shadow-xl transition-colors"
          title="Voice Command Help & Reference"
        >
          <HelpCircle className="w-5 h-5 text-cyan-400" />
        </button>

      </div>

      {/* Voice Commands Reference Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-cyan-400">
                <Command className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-100 text-base">Hands-Free Voice Commands</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Speak naturally into your device microphone to navigate views, launch adaptive AI workouts, log hydration, or change app themes instantly.
            </p>

            {/* List of Voice Commands */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              
              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <Flame className="w-4 h-4" />
                  <span>"Go to Workouts" / "Start Workout"</span>
                </div>
                <p className="text-[11px] text-slate-400">Switches to the Workouts tab or launches your active routine immediately.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <Droplet className="w-4 h-4" />
                  <span>"Log water 250" / "Add 500 water"</span>
                </div>
                <p className="text-[11px] text-slate-400">Automatically logs water intake in milliliters to your daily hydration total.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>"Go to Nutrition" / "Show Food Logger"</span>
                </div>
                <p className="text-[11px] text-slate-400">Opens the AI macro analyzer, food vision scanner, and hydration tracker.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>"Go to Analytics" / "Weekly Report"</span>
                </div>
                <p className="text-[11px] text-slate-400">Navigates to the workout calendar and weekly compliance analytics.</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                  <Volume2 className="w-4 h-4" />
                  <span>"Light Mode" / "Dark Mode"</span>
                </div>
                <p className="text-[11px] text-slate-400">Toggles the high-contrast app visual theme.</p>
              </div>

            </div>

            <button
              onClick={() => {
                setShowHelpModal(false);
                toggleListening();
              }}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Mic className="w-4 h-4" />
              <span>Try Voice Command Now</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
};
