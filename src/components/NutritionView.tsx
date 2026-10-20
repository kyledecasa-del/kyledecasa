import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, DailyNutrition, MealLog } from '../types';
import { WaterTracker } from './WaterTracker';
import {
  Utensils,
  Plus,
  Sparkles,
  Droplet,
  Flame,
  Check,
  TrendingUp,
  Apple,
  Camera,
  X,
  RefreshCw,
  Upload,
  AlertCircle
} from 'lucide-react';

interface NutritionViewProps {
  profile: UserProfile;
  nutrition: DailyNutrition;
  onUpdateNutrition: (updated: DailyNutrition) => void;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  profile,
  nutrition,
  onUpdateNutrition,
  onUpdateProfile
}) => {
  const [mealInput, setMealInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Camera Food Scanner Modal state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Summaries
  const totalCalories = nutrition.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = nutrition.meals.reduce((sum, m) => sum + m.proteinG, 0);
  const totalCarbs = nutrition.meals.reduce((sum, m) => sum + m.carbsG, 0);
  const totalFat = nutrition.meals.reduce((sum, m) => sum + m.fatG, 0);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startCameraStream = async () => {
    stopCameraStream();
    setCameraError(null);
    setCapturedPreview(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access (MediaDevices API) is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error('Failed to start camera:', err);
      setCameraError(err.message || 'Unable to access camera device.');
    }
  };

  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isCameraOpen]);

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
      analyzePhotoBase64(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCapturedPreview(dataUrl);
        analyzePhotoBase64(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzePhotoBase64 = async (base64Image: string) => {
    setIsScanningImage(true);
    try {
      const res = await fetch('/api/gemini/analyze-food-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Image,
          userGoal: profile.goal
        })
      });

      const data = await res.json();
      if (data.success && data.meal) {
        const newMeal: MealLog = {
          id: `meal_photo_${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: `📸 ${data.meal.name}`,
          mealType: data.meal.mealType as any,
          calories: data.meal.calories,
          proteinG: data.meal.proteinG,
          carbsG: data.meal.carbsG,
          fatG: data.meal.fatG,
          aiNutritionalTip: data.meal.aiNutritionalTip
        };

        const updated = {
          ...nutrition,
          meals: [newMeal, ...nutrition.meals]
        };
        onUpdateNutrition(updated);
        setIsCameraOpen(false);
      } else {
        alert(data.error || 'Failed to detect food in image.');
      }
    } catch (err) {
      console.error('Failed to analyze photo:', err);
      alert('Error analyzing image. Please try again.');
    } finally {
      setIsScanningImage(false);
    }
  };

  const handleAddWater = (amountMl: number) => {
    const updated = {
      ...nutrition,
      waterMl: nutrition.waterMl + amountMl
    };
    onUpdateNutrition(updated);
  };

  const handleAnalyzeAndAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/analyze-nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealDescription: mealInput,
          userGoal: profile.goal
        })
      });

      const data = await res.json();
      if (data.success && data.meal) {
        const newMeal: MealLog = {
          id: `meal_${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          name: data.meal.name,
          mealType: data.meal.mealType as any,
          calories: data.meal.calories,
          proteinG: data.meal.proteinG,
          carbsG: data.meal.carbsG,
          fatG: data.meal.fatG,
          aiNutritionalTip: data.meal.aiNutritionalTip
        };

        const updated = {
          ...nutrition,
          meals: [newMeal, ...nutrition.meals]
        };
        onUpdateNutrition(updated);
        setMealInput('');
      }
    } catch (err) {
      console.error('Failed to analyze meal with Gemini:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Apple className="w-4 h-4" />
            <span>Holistic Metabolic & Macro Tracker</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">AI Nutrition & Hydration</h1>
          <p className="text-xs text-slate-400 mt-1">
            Log natural food descriptions or snap a photo with your camera. Gemini AI computes macros instantly.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCameraOpen(true)}
            className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Camera AI Scanner</span>
          </button>

          {/* Hydration Widget */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Droplet className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Water</div>
              <div className="text-xs font-extrabold text-slate-100 font-mono">
                {nutrition.waterMl}/{profile.targetWaterMl}ml
              </div>
              <div className="flex gap-1.5 mt-0.5">
                <button
                  onClick={() => handleAddWater(250)}
                  className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[9px] font-bold border border-cyan-500/30"
                >
                  +250
                </button>
                <button
                  onClick={() => handleAddWater(500)}
                  className="px-1.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[9px] font-bold border border-cyan-500/30"
                >
                  +500
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quick Meal Logger Form & Camera Launcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/80 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
        <form onSubmit={handleAnalyzeAndAddMeal} className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              AI Meal Logger (Text or Camera Scanner)
            </label>
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Scan Food Photo</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              placeholder="e.g. 200g grilled chicken breast, 1 cup brown rice, 1 avocado"
              className="flex-1 bg-slate-800 border border-slate-700 text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !mealInput.trim()}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isAnalyzing ? 'Computing Macros...' : 'Analyze & Log Meal'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Hidden canvas for capturing video frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Camera className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-100 text-base">Camera Food Vision Scanner</h3>
              </div>
              <button
                onClick={() => setIsCameraOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera View / Preview Area */}
            <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              {capturedPreview ? (
                <img src={capturedPreview} alt="Captured food" className="w-full h-full object-cover" />
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {/* Viewfinder Overlay when active camera */}
              {!capturedPreview && !cameraError && (
                <div className="absolute inset-4 border-2 border-dashed border-emerald-400/60 rounded-xl pointer-events-none flex items-center justify-center">
                  <span className="text-[11px] font-bold text-emerald-300 bg-slate-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                    Center meal in camera frame
                  </span>
                </div>
              )}

              {/* Analyzing Indicator */}
              {isScanningImage && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                  <span className="text-xs font-bold text-slate-200">Gemini Computer Vision analyzing food & macros...</span>
                </div>
              )}

              {/* Camera Error fallback message */}
              {cameraError && !capturedPreview && (
                <div className="p-4 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                  <p className="text-xs text-slate-300">{cameraError}</p>
                  <p className="text-[11px] text-slate-500">You can upload a meal photo directly using the button below.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-700"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload Image</span>
              </button>

              {!capturedPreview ? (
                <button
                  type="button"
                  onClick={handleCapturePhoto}
                  disabled={!!cameraError || isScanningImage}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <Camera className="w-4 h-4" />
                  <span>Snap Photo & Analyze</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPreview(null);
                    startCameraStream();
                  }}
                  disabled={isScanningImage}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400" />
                  <span>Retake Photo</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Macro Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase">Calories</span>
            <span className="font-mono">{totalCalories} / {profile.dailyCalorieTarget} kcal</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCalories / profile.dailyCalorieTarget) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase">Protein</span>
            <span className="font-mono text-cyan-300">{totalProtein}g / {profile.targetProteinG}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalProtein / profile.targetProteinG) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase">Carbohydrates</span>
            <span className="font-mono text-amber-300">{totalCarbs}g / {profile.targetCarbsG}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalCarbs / profile.targetCarbsG) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span className="font-semibold uppercase">Fats</span>
            <span className="font-mono text-rose-300">{totalFat}g / {profile.targetFatG}g</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-rose-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalFat / profile.targetFatG) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Water Tracker Component */}
      <WaterTracker
        profile={profile}
        nutrition={nutrition}
        onUpdateNutrition={onUpdateNutrition}
        onUpdateProfile={onUpdateProfile}
      />

      {/* Logged Meals List */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-sm font-extrabold text-slate-100 uppercase tracking-wider">Today's Meal Logs ({nutrition.meals.length})</h3>

        <div className="space-y-3">
          {nutrition.meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px]">{meal.time}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold text-[10px]">
                    {meal.mealType}
                  </span>
                </div>
                <h4 className="font-bold text-slate-100 text-sm">{meal.name}</h4>
                {meal.aiNutritionalTip && (
                  <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                    💡 {meal.aiNutritionalTip}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono font-bold text-amber-400">
                  {meal.calories} kcal
                </span>
                <span className="bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-slate-300">
                  P: <strong className="text-cyan-400">{meal.proteinG}g</strong> | C: <strong className="text-amber-300">{meal.carbsG}g</strong> | F: <strong className="text-rose-300">{meal.fatG}g</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

