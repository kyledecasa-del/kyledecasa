import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI client lazily or safely
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Generate AI Workout Routine
app.post("/api/gemini/generate-workout", async (req, res) => {
  try {
    const { userProfile, category, focusArea, readinessScore, fatigueMap } = req.body;
    const ai = getGenAIClient();

    const prompt = `
Generate a highly targeted, personalized workout routine for a user with the following profile:
- Name: ${userProfile.name}
- Fitness Level: ${userProfile.fitnessLevel}
- Goal: ${userProfile.goal}
- Current Readiness Score: ${readinessScore || 80}/100
- Muscle Fatigue Map: ${JSON.stringify(fatigueMap || {})}
- Requested Workout Category: ${category || 'Hypertrophy'}
- Focus Area: ${focusArea || 'Upper Body'}

Create 4-5 exercises that respect current muscle fatigue (e.g. if quad fatigue is high, avoid heavy squats). Provide explicit target heart rate zones and rest intervals.
Return response strictly in JSON matching the schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an evidence-based sports scientist and empathetic AI personal trainer. Generate workout routines based strictly on sound exercise physiology, simple clear instructions, encouraging tone, and adaptive fatigue management. NEVER recommend unsafe, extreme, or dangerous exercises.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            durationMins: { type: Type.NUMBER },
            estimatedCalories: { type: Type.NUMBER },
            focusArea: { type: Type.STRING },
            aiReasoning: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                  weightKg: { type: Type.NUMBER },
                  targetZone: { type: Type.STRING, description: "Zone 1 (Warmup), Zone 2 (Fat Burn), Zone 3 (Aerobic), Zone 4 (Anaerobic), Zone 5 (Max)" },
                  restPeriodSec: { type: Type.NUMBER },
                  instructions: { type: Type.STRING },
                  muscleGroup: { type: Type.STRING }
                },
                required: ["name", "sets", "reps", "targetZone", "restPeriodSec", "instructions", "muscleGroup"]
              }
            }
          },
          required: ["title", "category", "durationMins", "estimatedCalories", "focusArea", "aiReasoning", "exercises"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, routine: parsed });
  } catch (error: any) {
    console.error("Error generating AI workout:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate AI workout routine."
    });
  }
});

// 2. Real-Time Heart Rate & Workout Intensity Adjustment
app.post("/api/gemini/adjust-intensity", async (req, res) => {
  try {
    const { exerciseName, currentHR, targetHR, targetZone, elapsedTimeSec, currentWeightKg } = req.body;
    const ai = getGenAIClient();

    const prompt = `
The user is actively performing exercise "${exerciseName}".
Current Heart Rate: ${currentHR} BPM.
Target HR Zone: ${targetZone} (Target: ~${targetHR} BPM).
Elapsed time in set/exercise: ${elapsedTimeSec}s.
Current weight: ${currentWeightKg || 0} kg.

Analyze if current HR is elevated into cardiovascular danger zone (Zone 5 max >175 BPM) or lagging below optimal stimulus (<120 BPM).
Provide a real-time adjustment recommendation.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a real-time AI biometrics trainer inside a wearable headset. Give instant 1-2 sentence real-time workout adaptations based on heart rate spikes or drops.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, description: "REDUCE_WEIGHT, EXTEND_REST, INCREASE_INTENSITY, MAINTAIN" },
            suggestedWeightKg: { type: Type.NUMBER },
            suggestedRestSec: { type: Type.NUMBER },
            advice: { type: Type.STRING },
            statusColor: { type: Type.STRING, description: "emerald, amber, red, or blue" }
          },
          required: ["action", "advice", "statusColor"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, adjustment: parsed });
  } catch (error: any) {
    console.error("Error adjusting workout intensity:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze real-time heart rate data."
    });
  }
});

// 3. AI Recovery & Injury Prevention Analysis
app.post("/api/gemini/analyze-recovery", async (req, res) => {
  try {
    const { hrvMs, sleepHours, sleepQualityScore, strainScore, muscleFatigue } = req.body;
    const ai = getGenAIClient();

    const prompt = `
Analyze recovery biometrics:
- HRV: ${hrvMs} ms
- Sleep: ${sleepHours} hours (${sleepQualityScore}/100 quality)
- Yesterday Strain Score: ${strainScore}/21
- Muscle Fatigue Levels (0-100): ${JSON.stringify(muscleFatigue)}

Calculate readiness score (0-100), injury risk level (Low, Moderate, Elevated), detailed recovery breakdown, and recommended active recovery or training protocol.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a clinical exercise physiologist and recovery scientist.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            readinessScore: { type: Type.NUMBER },
            injuryRisk: { type: Type.STRING, description: "Low, Moderate, or Elevated" },
            aiRecoverySummary: { type: Type.STRING },
            recommendedActivity: { type: Type.STRING },
            keyActionableTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["readinessScore", "injuryRisk", "aiRecoverySummary", "recommendedActivity", "keyActionableTips"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, analysis: parsed });
  } catch (error: any) {
    console.error("Error analyzing recovery:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze recovery metrics."
    });
  }
});

// 4. AI Meal & Nutrition Analysis
app.post("/api/gemini/analyze-nutrition", async (req, res) => {
  try {
    const { mealDescription, userGoal } = req.body;
    const ai = getGenAIClient();

    const prompt = `
User logged meal: "${mealDescription}".
User Goal: ${userGoal || 'muscle_gain'}.

Estimate macros (calories, protein in grams, carbs in grams, fat in grams), give a short meal name, meal type (Breakfast, Lunch, Dinner, or Snack), and 1 sentence AI tip alignment with user fitness goal.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an evidence-based sports nutritionist. Provide realistic, simple, encouraging, and safe nutritional feedback. NEVER recommend extreme starvation, crash diets, or dangerous supplements.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            mealType: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            proteinG: { type: Type.NUMBER },
            carbsG: { type: Type.NUMBER },
            fatG: { type: Type.NUMBER },
            aiNutritionalTip: { type: Type.STRING }
          },
          required: ["name", "mealType", "calories", "proteinG", "carbsG", "fatG", "aiNutritionalTip"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, meal: parsed });
  } catch (error: any) {
    console.error("Error analyzing nutrition:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze meal."
    });
  }
});

// 5. Weekly AI Progress Report
app.post("/api/gemini/weekly-report", async (req, res) => {
  try {
    const { userProfile, workoutSummary, avgReadiness, avgHRV, macroAdherence } = req.body;
    const ai = getGenAIClient();

    const prompt = `
Generate a weekly fitness progress report for ${userProfile.name}:
- Goal: ${userProfile.goal}
- Workouts completed: ${workoutSummary.count}
- Total exercise time: ${workoutSummary.totalMins} minutes
- Total calories burned: ${workoutSummary.totalCalories} kcal
- Average Readiness: ${avgReadiness}/100
- Average HRV: ${avgHRV} ms
- Macro Adherence: ${macroAdherence}%

Synthesize this data into key milestone achievements, an inspirational comprehensive analysis, and a strategy for next week.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an elite head coach compiling a performance review report.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            keyMilestones: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            aiComprehensiveAnalysis: { type: Type.STRING },
            aiNextWeekStrategy: { type: Type.STRING }
          },
          required: ["keyMilestones", "aiComprehensiveAnalysis", "aiNextWeekStrategy"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, report: parsed });
  } catch (error: any) {
    console.error("Error generating weekly report:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate weekly progress report."
    });
  }
});

// 6. Camera Photo Food Scanner Analysis
app.post("/api/gemini/analyze-food-image", async (req, res) => {
  try {
    const { imageBase64, userGoal } = req.body;
    const ai = getGenAIClient();

    let cleanBase64 = imageBase64 || "";
    let mimeType = "image/jpeg";
    if (cleanBase64.includes(";base64,")) {
      const parts = cleanBase64.split(";base64,");
      mimeType = parts[0].replace("data:", "") || "image/jpeg";
      cleanBase64 = parts[1];
    }

    const prompt = `
Analyze the food in this photo for a user with goal: ${userGoal || 'muscle_gain'}.
Estimate calories, protein in grams, carbs in grams, fat in grams, identify the dish/meal name, determine meal type (Breakfast, Lunch, Dinner, or Snack), and provide 1 sentence AI nutritional tip tailored to the goal.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        {
          inlineData: {
            data: cleanBase64,
            mimeType: mimeType
          }
        },
        prompt
      ],
      config: {
        systemInstruction: "You are an evidence-based sports nutritionist using computer vision. Provide realistic, clear, simple, and safe macro estimations and actionable tips.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            mealType: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            proteinG: { type: Type.NUMBER },
            carbsG: { type: Type.NUMBER },
            fatG: { type: Type.NUMBER },
            aiNutritionalTip: { type: Type.STRING }
          },
          required: ["name", "mealType", "calories", "proteinG", "carbsG", "fatG", "aiNutritionalTip"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, meal: parsed });
  } catch (error: any) {
    console.error("Error analyzing food image:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to analyze food photo."
    });
  }
});

// 7. Interactive Conversational AI Fitness Assistant
app.post("/api/gemini/assistant-chat", async (req, res) => {
  try {
    const { userMessage, history, userProfile } = req.body;
    const ai = getGenAIClient();

    const profileContext = userProfile ? `
USER BIOMETRICS & PROFILE:
- Name: ${userProfile.name}
- Gender/Sex: ${userProfile.gender || 'Not specified'}
- Age: ${userProfile.age} years old
- Weight: ${userProfile.weightKg} kg
- Height: ${userProfile.heightCm} cm
- Body Fat: ${userProfile.bodyFatPct || 18}%
- Fitness Level: ${userProfile.fitnessLevel || 'intermediate'}
- Primary Goal: ${userProfile.goal || 'general_wellness'}
- Resting Heart Rate: ${userProfile.restingHR || 60} BPM
- Max Heart Rate: ${userProfile.maxHR || 185} BPM
- VO2 Max: ${userProfile.vo2Max || 50} ml/kg/min
- Daily Calorie Target: ${userProfile.dailyCalorieTarget || 2500} kcal
- Daily Protein Target: ${userProfile.targetProteinG || 160} g
` : 'No user biometrics profile attached.';

    const systemInstruction = `
You are OmniSync AI Fitness, an elite, evidence-based sports scientist, AI personal trainer, certified nutritionist, and biometric performance assistant.

GUIDELINES YOU MUST FOLLOW STRICTLY:
1. Evidence-Based Advice: All workout plans, exercise selections, heart rate target zones, and macro recommendations must strictly align with peer-reviewed sports science and exercise physiology principles.
2. Simple Language: Explain technical recommendations in clear, accessible, jargon-free terms that any user can easily understand.
3. Encouraging & Realistic: Maintain an encouraging, positive, and supportive tone while setting realistic expectations for muscle growth, fat loss, and athletic performance.
4. Adaptive & Gender-Aware: Tailor advice specifically to the user's age, gender/sex, weight, height, BMR, and current fitness goals.
5. Safety First: NEVER recommend extreme, unsafe, or crash dieting methods (e.g. severe caloric deprivation <1200 kcal) or high-risk training techniques during extreme fatigue.
6. Structured & Scannable: Use clear formatting, bullet points, and clean bold text.
7. Concise, Fast & Direct: Deliver prompt, straightforward, and actionable answers without unnecessary preamble or filler text.

${profileContext}
`;

    // Construct contents with context history
    const contents: any[] = [];
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; text: string }) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
        });
      });
    }
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4,
      }
    });

    const replyText = response.text || "I'm here to help you achieve your fitness and nutrition goals! Could you tell me more about what you'd like to work on today?";

    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.error("Error in AI Assistant chat endpoint:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to communicate with AI Assistant."
    });
  }
});

// 8. AI Exercise Video Demonstration & Biomechanical Form Guidance
app.post("/api/gemini/exercise-video-guide", async (req, res) => {
  try {
    const { exerciseName, muscleGroup, userProfile, routineFocus } = req.body;
    const ai = getGenAIClient();

    const athleteContext = userProfile ? `
Athlete Profile:
- Name: ${userProfile.name}
- Fitness Level: ${userProfile.fitnessLevel || 'intermediate'}
- Height: ${userProfile.heightCm || 178}cm, Weight: ${userProfile.weightKg || 75}kg
- Goal: ${userProfile.goal || 'hypertrophy'}
` : '';

    const prompt = `
Generate a precise, evidence-based biomechanical video demonstration script and step-by-step form execution guide for the exercise: "${exerciseName}".
Target Muscle Group: ${muscleGroup || 'General'}
Routine Context: ${routineFocus || 'General Routine'}
${athleteContext}

Provide an exhaustive, professional breakdown including:
1. Difficulty level and required equipment.
2. Exact repetition tempo (e.g. 3-1-1-0).
3. Breathing coordination pattern.
4. 4 distinct movement phases (Setup/Stance, Eccentric Control, Peak Contraction/Stretch, Concentric Drive) with specific joint angles, tension focus, and key verbal cues.
5. Common form mistakes, risk of injury, and exact corrections.
6. 3-4 golden AI form score checkpoints.
7. Concise audio coaching script for real-time video narration (around 2-3 sentences).
8. Biomechanical motion path description.

Return response strictly formatted in JSON matching the schema.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a master strength coach, biomechanist, and physical therapist. Provide exact, scientifically verified exercise form kinematics, safe joint mechanics, and actionable coaching cues. Never suggest dangerous or unverified variations.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exerciseName: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            primaryMuscle: { type: Type.STRING },
            secondaryMuscles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            equipment: { type: Type.STRING },
            tempo: { type: Type.STRING },
            breathingPattern: { type: Type.STRING },
            visualPhases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phaseNumber: { type: Type.NUMBER },
                  phaseName: { type: Type.STRING },
                  durationSeconds: { type: Type.NUMBER },
                  keyFormCues: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  jointAngles: { type: Type.STRING },
                  tensionFocus: { type: Type.STRING }
                },
                required: ["phaseNumber", "phaseName", "durationSeconds", "keyFormCues", "jointAngles", "tensionFocus"]
              }
            },
            commonMistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  mistake: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  injuryRisk: { type: Type.STRING }
                },
                required: ["mistake", "correction", "injuryRisk"]
              }
            },
            aiFormScoreTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            audioCoachingScript: { type: Type.STRING },
            biomechanicalPathDescription: { type: Type.STRING }
          },
          required: [
            "exerciseName",
            "difficulty",
            "primaryMuscle",
            "secondaryMuscles",
            "equipment",
            "tempo",
            "breathingPattern",
            "visualPhases",
            "commonMistakes",
            "aiFormScoreTips",
            "audioCoachingScript",
            "biomechanicalPathDescription"
          ]
        }
      }
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, guide: parsed });
  } catch (error: any) {
    console.error("Error generating exercise video guide:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to generate exercise demonstration video guidance."
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
