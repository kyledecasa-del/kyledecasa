import React, { useState, useEffect, useRef } from 'react';
import { Exercise, WorkoutRoutine, UserProfile } from '../types';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Activity,
  Layers,
  Zap,
  Dumbbell,
  ShieldCheck,
  Maximize2,
  Film,
  Compass,
  Repeat
} from 'lucide-react';

interface ExerciseVideoDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: Exercise | null;
  routine?: WorkoutRoutine;
  profile: UserProfile;
  onSelectExercise?: (exercise: Exercise) => void;
}

export interface ExerciseGuideData {
  exerciseName: string;
  difficulty: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string;
  tempo: string;
  breathingPattern: string;
  visualPhases: {
    phaseNumber: number;
    phaseName: string;
    durationSeconds: number;
    keyFormCues: string[];
    jointAngles: string;
    tensionFocus: string;
  }[];
  commonMistakes: {
    mistake: string;
    correction: string;
    injuryRisk: string;
  }[];
  aiFormScoreTips: string[];
  audioCoachingScript: string;
  biomechanicalPathDescription: string;
}

// Comprehensive instant-fallback dataset for seamless instant loading
const DEFAULT_EXERCISE_GUIDES: Record<string, ExerciseGuideData> = {
  default: {
    exerciseName: 'Exercise Movement',
    difficulty: 'Intermediate',
    primaryMuscle: 'Target Muscle Group',
    secondaryMuscles: ['Core Stabilizers', 'Synergist Muscles'],
    equipment: 'Free Weights / Bodyweight',
    tempo: '3-1-1-0 (3s eccentric, 1s pause, 1s lift)',
    breathingPattern: 'Inhale during eccentric lowering, exhale forcefully on concentric effort.',
    visualPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Phase 1: Setup & Starting Stance',
        durationSeconds: 1.5,
        keyFormCues: ['Plant feet firmly', 'Engage core brace', 'Retract scapulae into stable platform'],
        jointAngles: 'Spine neutral at 180°, joints aligned over base of support',
        tensionFocus: 'Isometric core and grip stabilizer activation'
      },
      {
        phaseNumber: 2,
        phaseName: 'Phase 2: Controlled Eccentric Lowering',
        durationSeconds: 3.0,
        keyFormCues: ['Resist gravity for 3 full seconds', 'Do not let joints collapse or flare', 'Maintain full muscle tension'],
        jointAngles: 'Primary joint hinges to 90° flexion with stable axis',
        tensionFocus: 'High elongation tension across primary agonist fibers'
      },
      {
        phaseNumber: 3,
        phaseName: 'Phase 3: Bottom Stretch & Turnaround',
        durationSeconds: 1.0,
        keyFormCues: ['Pause without resting on joints', 'Feel maximum deep stretch', 'Keep spine aligned'],
        jointAngles: 'Full active range of motion without joint impingement',
        tensionFocus: 'Maximum mechanical stretch under active load'
      },
      {
        phaseNumber: 4,
        phaseName: 'Phase 4: Powerful Concentric Drive',
        durationSeconds: 1.0,
        keyFormCues: ['Drive forcefully through prime movers', 'Exhale through exertion', 'Squeeze target muscle at apex without hyperextending'],
        jointAngles: 'Return to starting lockout position with controlled deceleration',
        tensionFocus: 'Peak shortened muscle contraction'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Using momentum or bouncing at bottom turnaround',
        correction: 'Execute a strict 1-second pause at maximum stretch to eliminate elastic bounce.',
        injuryRisk: 'High risk of connective tissue strain and micro-tears.'
      },
      {
        mistake: 'Excessive joint flare or poor joint trajectory alignment',
        correction: 'Tuck elbows or knees along their natural scapular/acetabular 45° plane.',
        injuryRisk: 'Impingement and chronic tendon inflammation.'
      },
      {
        mistake: 'Losing core brace and arching lumbar spine',
        correction: 'Perform the Valsalva maneuver or brace abdominal wall 360° throughout the rep.',
        injuryRisk: 'Lower back shear strain and disc compression.'
      }
    ],
    aiFormScoreTips: [
      'Maintain continuous tension by avoiding resting or unlocking at joints.',
      'Control the 3-second descent rather than letting the weight drop.',
      'Match your breathing rhythm: Inhale on descent, exhale on drive.',
      'Keep your gaze forward and cervical spine in neutral alignment.'
    ],
    audioCoachingScript: 'Brace your core tightly. Lower under strict control for three seconds, pause at the bottom stretch, then drive upward with explosive power while exhaling.',
    biomechanicalPathDescription: 'Strict linear vertical path with minimal horizontal drift to maximize moment arm efficiency and muscle activation.'
  },
  'incline dumbbell bench press': {
    exerciseName: 'Incline Dumbbell Bench Press',
    difficulty: 'Intermediate',
    primaryMuscle: 'Upper Chest (Clavicular Pectoralis Major)',
    secondaryMuscles: ['Anterior Deltoids', 'Triceps Brachii', 'Serratus Anterior'],
    equipment: 'Incline Bench (30-45°) & Dumbbells',
    tempo: '3-1-1-0 (3s Lower, 1s Stretch, 1s Press)',
    breathingPattern: 'Inhale deep into diaphragm on descent, exhale forcefully through the concentric press.',
    visualPhases: [
      {
        phaseNumber: 1,
        phaseName: 'Phase 1: Setup & Starting Lockout',
        durationSeconds: 1.5,
        keyFormCues: ['Bench angle set between 30° and 45°', 'Retract and depress shoulder blades into bench', 'Dumbbells held directly over upper chest with neutral wrists'],
        jointAngles: 'Elbows extended at 170°, wrists stacked directly over radius/ulna',
        tensionFocus: 'Upper pectoral pre-tension with stable shoulder girdle'
      },
      {
        phaseNumber: 2,
        phaseName: 'Phase 2: Controlled Eccentric Lowering',
        durationSeconds: 3.0,
        keyFormCues: ['Lower dumbbells smoothly over 3 full seconds', 'Keep elbows tucked at ~45-60° to torso (not flared 90°)', 'Maintain arch in upper thoracic without excessive lumbar hyperextension'],
        jointAngles: 'Elbows track down to 90° flexion at mid-chest level',
        tensionFocus: 'Intense eccentric stretch in upper pectoral fibers'
      },
      {
        phaseNumber: 3,
        phaseName: 'Phase 3: Deep Stretch & Turnaround',
        durationSeconds: 1.0,
        keyFormCues: ['Pause for 1 second at chest depth', 'Do not let shoulders roll forward off the bench', 'Keep feet firmly planted on the floor for leg drive'],
        jointAngles: 'Dumbbell handles level with clavicle/upper breastplate',
        tensionFocus: 'Maximum active stretch on clavicular head'
      },
      {
        phaseNumber: 4,
        phaseName: 'Phase 4: Concentric Press to Apex',
        durationSeconds: 1.0,
        keyFormCues: ['Press up and slightly inward in a slight converging arc', 'Do not clank dumbbells together at the top', 'Squeeze upper chest hard at peak without rounding shoulders'],
        jointAngles: 'Elbows return to soft lockout overhead',
        tensionFocus: 'Peak contraction in clavicular pectoralis and triceps'
      }
    ],
    commonMistakes: [
      {
        mistake: 'Flaring elbows out at 90° perpendicular to torso',
        correction: 'Tuck elbows to 45°-60° in the scapular plane to protect rotator cuff.',
        injuryRisk: 'Subacromial impingement and anterior shoulder capsule strain.'
      },
      {
        mistake: 'Setting bench angle too high (>45°)',
        correction: 'Keep bench incline at 30° to isolate upper chest instead of front delts.',
        injuryRisk: 'Shifts workload away from chest to anterior shoulder stabilizers.'
      },
      {
        mistake: 'Bouncing dumbbells out of the bottom or cutting depth short',
        correction: 'Lower until handles are at upper chest height, pause for 1 second with control.',
        injuryRisk: 'Pectoral tendon tear under sudden uncontrolled eccentric loads.'
      }
    ],
    aiFormScoreTips: [
      'Stack wrists directly over elbows at all times to prevent wrist flexion strain.',
      'Maintain retracted scapulae throughout the entire set, never push shoulders forward.',
      'Squeeze dumbbells inward at top without letting them touch.'
    ],
    audioCoachingScript: 'Set bench to 30 degrees. Pin shoulder blades back, lower dumbbells smoothly for three seconds with elbows at 45 degrees, feel the deep chest stretch, and press up with power.',
    biomechanicalPathDescription: 'Curvilinear upward converging trajectory that matches the muscle pennation angle of the clavicular pectoral fibers.'
  }
};

export const ExerciseVideoDemoModal: React.FC<ExerciseVideoDemoModalProps> = ({
  isOpen,
  onClose,
  exercise,
  routine,
  profile,
  onSelectExercise
}) => {
  const [guideData, setGuideData] = useState<ExerciseGuideData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0); // 0.5x, 1x, 1.5x
  const [cameraAngle, setCameraAngle] = useState<'lateral' | 'frontal' | 'isometric'>('isometric');
  const [currentProgress, setCurrentProgress] = useState<number>(0); // 0 to 1
  const [currentRep, setCurrentRep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'phases' | 'mistakes' | 'biomechanics'>('phases');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [showHUD, setShowHUD] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Fetch or load exercise guide when exercise changes
  useEffect(() => {
    if (!exercise) return;

    const normalizedName = exercise.name.toLowerCase().trim();
    const cached = DEFAULT_EXERCISE_GUIDES[normalizedName] || DEFAULT_EXERCISE_GUIDES.default;
    
    // Set initial structured data
    setGuideData({
      ...cached,
      exerciseName: exercise.name,
      primaryMuscle: exercise.muscleGroup || cached.primaryMuscle
    });

    // Fetch dynamic AI analysis from Gemini API
    const fetchAIGuide = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/gemini/exercise-video-guide', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseName: exercise.name,
            muscleGroup: exercise.muscleGroup,
            userProfile: profile,
            routineFocus: routine?.focusArea
          })
        });
        const data = await res.json();
        if (data.success && data.guide) {
          setGuideData(data.guide);
        }
      } catch (err) {
        console.warn('Using default kinematics guide for', exercise.name, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAIGuide();
    setCurrentProgress(0);
    setCurrentRep(1);
    setIsPlaying(true);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [exercise, profile, routine]);

  // Handle Speech Synthesis Coaching Audio
  const toggleSpeechCoaching = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text to speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      if (!guideData?.audioCoachingScript) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(guideData.audioCoachingScript);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechUtteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Video Demo Kinematics Rendering Loop
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let progress = currentProgress;
    const cycleDurationMs = 6000; // 6 seconds per rep cycle

    const render = (time: number) => {
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;

      if (isPlaying) {
        progress += (delta / cycleDurationMs) * playbackSpeed;
        if (progress >= 1.0) {
          progress = 0;
          setCurrentRep(r => (r >= 12 ? 1 : r + 1));
        }
        setCurrentProgress(progress);
      }

      // Drawing dimensions
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas with sleek high-tech sports gradient
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw Sub-grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Compute kinematic motion cycle:
      // 0.0 - 0.25: Phase 1 (Setup/Lockout hold)
      // 0.25 - 0.70: Phase 2 (Eccentric Lowering) -> movement descent
      // 0.70 - 0.80: Phase 3 (Bottom Stretch Pause)
      // 0.80 - 1.00: Phase 4 (Concentric Explosive Drive)
      let phaseIndex = 0;
      let motionYFactor = 0; // 0 = top, 1 = bottom
      let tensionVal = 0.3;

      if (progress < 0.2) {
        phaseIndex = 0;
        motionYFactor = 0;
        tensionVal = 0.4;
      } else if (progress < 0.65) {
        phaseIndex = 1;
        const norm = (progress - 0.2) / 0.45;
        // Smooth easing descent
        motionYFactor = Math.sin((norm * Math.PI) / 2);
        tensionVal = 0.5 + 0.4 * norm;
      } else if (progress < 0.78) {
        phaseIndex = 2;
        motionYFactor = 1.0;
        tensionVal = 1.0; // Peak stretch tension
      } else {
        phaseIndex = 3;
        const norm = (progress - 0.78) / 0.22;
        motionYFactor = 1.0 - Math.sin((norm * Math.PI) / 2);
        tensionVal = 0.9 - 0.5 * norm;
      }

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw Floor Platform & Bench
      ctx.save();
      
      // Platform base shadow & glow
      ctx.fillStyle = 'rgba(16, 185, 129, 0.06)';
      ctx.beginPath();
      ctx.ellipse(centerX, height - 35, 140, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Bench / Stage structure
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX - 80, height - 40);
      ctx.lineTo(centerX + 80, height - 40);
      ctx.stroke();

      // Kinematic Human Figure / Biomechanical Rig
      // Base positions adjusted based on exercise and camera angle
      const isSquatOrLegs = exercise?.muscleGroup.toLowerCase().includes('leg') ||
                            exercise?.muscleGroup.toLowerCase().includes('quad') ||
                            exercise?.name.toLowerCase().includes('squat');
      const isPress = exercise?.name.toLowerCase().includes('press') ||
                      exercise?.muscleGroup.toLowerCase().includes('chest') ||
                      exercise?.muscleGroup.toLowerCase().includes('shoulder');

      // Head & Torso Anchors
      let headX = centerX;
      let headY = centerY - 70 + (isSquatOrLegs ? motionYFactor * 60 : 0);
      let chestX = centerX;
      let chestY = centerY - 25 + (isSquatOrLegs ? motionYFactor * 60 : 0);
      let hipX = centerX;
      let hipY = centerY + 30 + (isSquatOrLegs ? motionYFactor * 60 : 0);

      // Angle Offset
      let angleOffset = 0;
      if (cameraAngle === 'lateral') angleOffset = 40;
      if (cameraAngle === 'isometric') angleOffset = 20;

      // Draw Spine Vector
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(chestX + angleOffset * 0.2, chestY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      // Draw Head
      ctx.fillStyle = '#065f46';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(headX + angleOffset * 0.3, headY, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw Muscle Glow Intensity on Target Zone
      ctx.shadowBlur = 20 * tensionVal;
      ctx.shadowColor = tensionVal > 0.8 ? '#f59e0b' : '#10b981';
      ctx.fillStyle = tensionVal > 0.8 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.4)';
      ctx.beginPath();
      ctx.ellipse(chestX + angleOffset * 0.2, chestY, 28, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw Legs / Base
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 6;
      if (isSquatOrLegs) {
        // Dynamic knee flexion
        const kneeY = hipY + 45 - (motionYFactor * 15);
        const kneeL_X = hipX - 35 - (motionYFactor * 15);
        const kneeR_X = hipX + 35 + (motionYFactor * 15);
        const footL_X = hipX - 40;
        const footR_X = hipX + 40;
        const footY = height - 40;

        // Left Leg
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeL_X, kneeY);
        ctx.lineTo(footL_X, footY);
        ctx.stroke();

        // Right Leg
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeR_X, kneeY);
        ctx.lineTo(footR_X, footY);
        ctx.stroke();

        // Knee joint indicator
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(kneeL_X, kneeY, 4, 0, Math.PI * 2);
        ctx.arc(kneeR_X, kneeY, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Stable bench / standing legs
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(hipX - 35, height - 40);
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(hipX + 35, height - 40);
        ctx.stroke();
      }

      // Upper Limbs / Arm Kinematics & Weights
      const armDisplacement = motionYFactor * 45;
      const leftElbowX = chestX - 45 - (motionYFactor * 10) + angleOffset;
      const leftElbowY = chestY + 10 + (armDisplacement * 0.7);
      const rightElbowX = chestX + 45 + (motionYFactor * 10) + angleOffset;
      const rightElbowY = chestY + 10 + (armDisplacement * 0.7);

      const leftHandX = chestX - 40 + angleOffset;
      const leftHandY = centerY - 55 + armDisplacement;
      const rightHandX = chestX + 40 + angleOffset;
      const rightHandY = centerY - 55 + armDisplacement;

      // Draw Arms
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 5;

      // Left Arm
      ctx.beginPath();
      ctx.moveTo(chestX, chestY - 10);
      ctx.lineTo(leftElbowX, leftElbowY);
      ctx.lineTo(leftHandX, leftHandY);
      ctx.stroke();

      // Right Arm
      ctx.beginPath();
      ctx.moveTo(chestX, chestY - 10);
      ctx.lineTo(rightElbowX, rightElbowY);
      ctx.lineTo(rightHandX, rightHandY);
      ctx.stroke();

      // Barbell / Dumbbell Rendering with Motion Trail
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(leftHandX - 25, leftHandY);
      ctx.lineTo(rightHandX + 25, rightHandY);
      ctx.stroke();

      // Weight Plates / Dumbbell Heads
      ctx.fillStyle = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#f59e0b';
      ctx.fillRect(leftHandX - 32, leftHandY - 14, 8, 28);
      ctx.fillRect(rightHandX + 24, rightHandY - 14, 8, 28);
      ctx.shadowBlur = 0;

      // Draw Vertical Bar Path Motion Trajectory (HUD guideline)
      if (showHUD) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(leftHandX, centerY - 75);
        ctx.lineTo(leftHandX, centerY + 15);
        ctx.moveTo(rightHandX, centerY - 75);
        ctx.lineTo(rightHandX, centerY + 15);
        ctx.stroke();
        ctx.setLineDash([]);

        // Real-time Joint Angle HUD readout
        const currentAngle = Math.round(160 - (motionYFactor * 75));
        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`Joint Angle: ${currentAngle}°`, rightElbowX + 15, rightElbowY);

        // Path Deviation & Tension Tracker
        ctx.fillStyle = tensionVal > 0.8 ? '#f59e0b' : '#38bdf8';
        ctx.fillText(`Tension: ${Math.round(tensionVal * 100)}%`, leftHandX - 70, leftHandY - 10);
      }

      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isPlaying, playbackSpeed, cameraAngle, exercise, showHUD]);

  if (!isOpen || !exercise) return null;

  // Active Phase identification
  const currentPhaseNumber = currentProgress < 0.2 ? 1 : currentProgress < 0.65 ? 2 : currentProgress < 0.78 ? 3 : 4;
  const currentPhaseData = guideData?.visualPhases.find(p => p.phaseNumber === currentPhaseNumber) || guideData?.visualPhases[0];

  // Routine exercise navigation helpers
  const routineExercises = routine?.exercises || [];
  const currentExIndex = routineExercises.findIndex(e => e.id === exercise.id || e.name === exercise.name);
  const prevExercise = currentExIndex > 0 ? routineExercises[currentExIndex - 1] : null;
  const nextExercise = currentExIndex >= 0 && currentExIndex < routineExercises.length - 1 ? routineExercises[currentExIndex + 1] : null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-emerald-400">
                <Film className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-100">{exercise.name}</h2>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider font-mono">
                  AI Video Form Guide
                </span>
                {isLoading && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    <span>Analyzing Kinematics...</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {exercise.muscleGroup} • {exercise.sets} sets x {exercise.reps} • Target: {exercise.targetZone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSpeechCoaching}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isSpeaking
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 animate-pulse'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title="Listen to AI Form Cue Audio"
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Mute Audio Coach' : 'Audio Coach'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Routine Exercise Quick Bar (if multiple in routine) */}
        {routineExercises.length > 1 && (
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2">
            <span className="text-[11px] text-slate-400 font-semibold shrink-0">
              Routine: <strong className="text-slate-200">{routine?.title}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevExercise}
                onClick={() => prevExercise && onSelectExercise && onSelectExercise(prevExercise)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center gap-1 text-[11px] font-bold"
              >
                <ChevronLeft className="w-3 h-3" /> Prev Video
              </button>

              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                Ex {currentExIndex + 1} of {routineExercises.length}
              </span>

              <button
                disabled={!nextExercise}
                onClick={() => nextExercise && onSelectExercise && onSelectExercise(nextExercise)}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 flex items-center gap-1 text-[11px] font-bold"
              >
                Next Video <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 flex-1 overflow-y-auto max-h-[75vh]">
          
          {/* Left Column: AI Video Demonstration Stage & Player Controls */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 space-y-4">
            
            {/* View Angle & HUD Controls */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['isometric', 'lateral', 'frontal'] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setCameraAngle(angle)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold capitalize transition-all ${
                      cameraAngle === angle
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {angle} View
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowHUD(!showHUD)}
                  className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 transition-colors ${
                    showHUD
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Biometric HUD</span>
                </button>

                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] font-mono text-amber-400 font-bold">
                  Rep #{currentRep}
                </span>
              </div>
            </div>

            {/* Kinetic Video Canvas */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center shadow-inner group">
              <canvas
                ref={canvasRef}
                width={640}
                height={360}
                className="w-full h-full object-contain"
              />

              {/* Floating Real-Time Phase Tag */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-400">{currentPhaseData?.phaseName.split(':')[1] || 'Movement Action'}</span>
              </div>

              {/* Tempo & Cadence Tag */}
              <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300">
                Tempo: <strong className="text-cyan-400">{guideData?.tempo.split(' ')[0] || '3-1-1-0'}</strong>
              </div>

              {/* Muscle Tension Glow Tag */}
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] font-mono text-slate-300">
                Target: <strong className="text-amber-400">{guideData?.primaryMuscle}</strong>
              </div>
            </div>

            {/* Video Playback Scrubber & Controls */}
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 space-y-2.5">
              
              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-emerald-400 font-bold">
                    Phase {currentPhaseNumber} of 4: {currentPhaseData?.phaseName.split(':')[1]}
                  </span>
                  <span>{Math.round(currentProgress * 100)}% Rep Cycle</span>
                </div>
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
                    setCurrentProgress(newProgress);
                  }}
                  className="w-full h-2 rounded-full bg-slate-950 overflow-hidden cursor-pointer relative border border-slate-800"
                >
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-amber-400 transition-all duration-75"
                    style={{ width: `${currentProgress * 100}%` }}
                  />
                </div>
              </div>

              {/* Controls Bar */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-md shadow-emerald-500/20 transition-all"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentProgress(0);
                      setCurrentRep(1);
                    }}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Restart Rep"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800 text-[11px] font-mono">
                    <span className="text-slate-400">Speed:</span>
                    {([0.5, 1.0, 1.5] as const).map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          playbackSpeed === spd
                            ? 'bg-emerald-500/20 text-emerald-300 font-extrabold'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                  <Repeat className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Continuous Kinetic Loop</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: AI Evidence-Based Biomechanical Form Coaching */}
          <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-slate-900/60">
            
            {/* Tab Selectors */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('phases')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'phases'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>4 Movement Phases</span>
              </button>

              <button
                onClick={() => setActiveTab('mistakes')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'mistakes'
                    ? 'bg-rose-500 text-slate-100 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Mistakes & Safety</span>
              </button>

              <button
                onClick={() => setActiveTab('biomechanics')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'biomechanics'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Biometrics</span>
              </button>
            </div>

            {/* Tab 1: 4 Movement Phases */}
            {activeTab === 'phases' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Real-Time Phase Breakdown
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-100">{currentPhaseData?.phaseName}</h4>
                  <p className="text-xs text-slate-300 font-mono">
                    Tension Focus: <span className="text-amber-400">{currentPhaseData?.tensionFocus}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  {guideData?.visualPhases.map((phase) => {
                    const isCurrent = phase.phaseNumber === currentPhaseNumber;
                    return (
                      <div
                        key={phase.phaseNumber}
                        className={`p-3 rounded-xl border transition-all ${
                          isCurrent
                            ? 'bg-slate-950 border-emerald-500/50 shadow-lg'
                            : 'bg-slate-950/40 border-slate-800/80 opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-extrabold ${isCurrent ? 'text-emerald-400' : 'text-slate-300'}`}>
                            {phase.phaseName}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">
                            ~{phase.durationSeconds}s
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-mono mb-1.5">
                          📐 {phase.jointAngles}
                        </p>

                        <ul className="space-y-1">
                          {phase.keyFormCues.map((cue, idx) => (
                            <li key={idx} className="text-xs text-slate-200 flex items-start gap-1.5 leading-snug">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{cue}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Mistakes & Safety */}
            {activeTab === 'mistakes' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl text-xs text-rose-300">
                  <span className="font-extrabold block mb-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-rose-400" /> Biomechanical Injury Prevention
                  </span>
                  Eliminate these common kinetic errors to safeguard joint health and maximize motor unit recruitment.
                </div>

                <div className="space-y-2.5">
                  {guideData?.commonMistakes.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex items-start gap-1.5 text-rose-400 text-xs font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{item.mistake}</span>
                      </div>
                      
                      <div className="text-xs text-emerald-300 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Fix:</strong> {item.correction}</span>
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        ⚠️ Risk: <span className="text-slate-300">{item.injuryRisk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Biometrics & Checklist */}
            {activeTab === 'biomechanics' && (
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider">
                    Anatomy & Kinetic Chain
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Primary Agonist</span>
                      <strong className="text-emerald-400">{guideData?.primaryMuscle}</strong>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">Equipment</span>
                      <strong className="text-slate-200">{guideData?.equipment}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
                    <span className="text-[10px] text-slate-500 block font-mono">Secondary / Synergists</span>
                    <span className="text-slate-300 font-medium">
                      {guideData?.secondaryMuscles.join(', ') || 'Core stabilizers'}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs space-y-0.5">
                    <span className="text-[10px] text-cyan-400 font-bold block font-mono">🫁 Breathing Pattern</span>
                    <p className="text-[11px] text-slate-300">{guideData?.breathingPattern}</p>
                  </div>

                  <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs space-y-0.5">
                    <span className="text-[10px] text-amber-400 font-bold block font-mono">📈 Trajectory Mechanics</span>
                    <p className="text-[11px] text-slate-300">{guideData?.biomechanicalPathDescription}</p>
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
                  <h5 className="text-xs font-bold text-slate-200">AI Form Score 100% Checklist</h5>
                  <div className="space-y-1">
                    {guideData?.aiFormScoreTips.map((tip, idx) => (
                      <div key={idx} className="text-[11px] text-slate-300 flex items-start gap-1.5">
                        <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Quick Action */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={toggleSpeechCoaching}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              >
                {isSpeaking ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{isSpeaking ? 'Playing Voiceover...' : 'Read Form Cues'}</span>
              </button>

              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                Got It, Ready to Lift!
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
