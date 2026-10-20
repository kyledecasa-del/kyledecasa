import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  Zap,
  Gift,
  CheckCircle2,
  Lock,
  ChevronRight,
  Star,
  RefreshCw,
  X,
  Dumbbell,
  TrendingUp,
  Activity,
  PlusCircle,
  Crown
} from 'lucide-react';

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  category: 'Streak' | 'Volume' | 'Strength' | 'Consistency';
  unlocked: boolean;
  icon: string;
  xpReward: number;
  currentValue?: number;
  targetValue?: number;
  unit?: string;
}

export const GamificationBar: React.FC = () => {
  const [level, setLevel] = useState<number>(7);
  const [xp, setXp] = useState<number>(2850);
  const [xpNeeded, setXpNeeded] = useState<number>(3500);
  const [streakDays, setStreakDays] = useState<number>(7);
  const [totalVolumeKg, setTotalVolumeKg] = useState<number>(42500);
  const [totalWorkouts, setTotalWorkouts] = useState<number>(28);
  const [claimedDailyBonus, setClaimedDailyBonus] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const [badges, setBadges] = useState<AchievementBadge[]>([
    {
      id: 'bdg_1',
      title: '7-Day Iron Streak',
      description: 'Completed workouts or logged meals 7 days in a row.',
      category: 'Streak',
      unlocked: true,
      icon: '🔥',
      xpReward: 300,
      currentValue: 7,
      targetValue: 7,
      unit: 'days'
    },
    {
      id: 'bdg_2',
      title: '50,000 kg Centurion Lifter',
      description: 'Achieve a total cumulative workout volume of 50,000 kg.',
      category: 'Volume',
      unlocked: false,
      icon: '🏋️‍♂️',
      xpReward: 750,
      currentValue: 42500,
      targetValue: 50000,
      unit: 'kg'
    },
    {
      id: 'bdg_3',
      title: 'Century Club (100kg PR)',
      description: 'Logged a bench press, squat, or deadlift PR over 100kg.',
      category: 'Strength',
      unlocked: true,
      icon: '🏋️',
      xpReward: 500
    },
    {
      id: 'bdg_4',
      title: '10,000 Kcal Burner',
      description: 'Burn 10,000 total workout calories through active training.',
      category: 'Volume',
      unlocked: true,
      icon: '⚡',
      xpReward: 600,
      currentValue: 12400,
      targetValue: 10000,
      unit: 'kcal'
    },
    {
      id: 'bdg_5',
      title: 'Hydration Titan',
      description: 'Reached 3,000ml daily water goal 5 times.',
      category: 'Consistency',
      unlocked: true,
      icon: '💧',
      xpReward: 250
    },
    {
      id: 'bdg_6',
      title: '30-Day Fitness Legend',
      description: 'Maintain an active fitness streak for 30 consecutive days.',
      category: 'Streak',
      unlocked: false,
      icon: '👑',
      xpReward: 1200,
      currentValue: 7,
      targetValue: 30,
      unit: 'days'
    },
    {
      id: 'bdg_7',
      title: '100,000 kg Titan Lifter',
      description: 'Lift 100,000 kg of total cumulative weight across all routines.',
      category: 'Volume',
      unlocked: false,
      icon: '🏛️',
      xpReward: 1500,
      currentValue: 42500,
      targetValue: 100000,
      unit: 'kg'
    }
  ]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const addXp = (amount: number, reason: string) => {
    let newXp = xp + amount;
    let newLevel = level;
    let newNeeded = xpNeeded;

    if (newXp >= xpNeeded) {
      newLevel += 1;
      newXp = newXp - xpNeeded;
      newNeeded += 1000;
      showToast(`🎉 LEVEL UP! Reached Level ${newLevel}! (+${amount} XP for ${reason})`);
    } else {
      showToast(`⭐ +${amount} XP earned: ${reason}`);
    }

    setXp(newXp);
    setLevel(newLevel);
    setXpNeeded(newNeeded);
  };

  const handleClaimBonus = () => {
    if (claimedDailyBonus) return;
    const streakMultiplier = Math.min(2.0, 1 + streakDays * 0.05);
    const bonusAmount = Math.round(250 * streakMultiplier);

    addXp(bonusAmount, `Daily Streak Bonus (${streakDays} Day Multiplier x${streakMultiplier.toFixed(1)})`);
    setClaimedDailyBonus(true);
  };

  const handleLogWorkoutVolume = (volumeToAddKg: number) => {
    const updatedVolume = totalVolumeKg + volumeToAddKg;
    setTotalVolumeKg(updatedVolume);
    setTotalWorkouts(prev => prev + 1);

    // Check if 50,000 kg badge unlocked
    const updatedBadges = badges.map(b => {
      if (b.id === 'bdg_2' && !b.unlocked && updatedVolume >= 50000) {
        addXp(b.xpReward, `Unlocked Badge: ${b.title}!`);
        return { ...b, unlocked: true, currentValue: updatedVolume };
      }
      if (b.targetValue) {
        return { ...b, currentValue: updatedVolume };
      }
      return b;
    });

    setBadges(updatedBadges);
    addXp(150, `Logged +${volumeToAddKg}kg Workout Volume!`);
  };

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  // Next Volume Milestone Calculation
  const nextVolumeMilestone = 50000;
  const volumeProgressPct = Math.min(100, Math.round((totalVolumeKg / nextVolumeMilestone) * 100));

  return (
    <div className="space-y-4">

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 px-4 py-3 rounded-2xl font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top XP Bar Container */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 rounded-3xl p-5 border border-slate-800 shadow-2xl space-y-4">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* User Level & XP Bar */}
          <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-amber-400 font-black text-xs">
                <Crown className="w-3.5 h-3.5 text-amber-400 mb-0.5" />
                <span>Lvl {level}</span>
              </div>
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-100 flex items-center gap-1.5">
                  <span>Aura Gold Champion</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </span>
                <span className="text-amber-400 font-mono font-bold">
                  {xp} / {xpNeeded} XP
                </span>
              </div>

              {/* XP Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all duration-500"
                  style={{ width: `${(xp / xpNeeded) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Streak & Daily Reward Actions */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            
            {/* Flame Streak Pill */}
            <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-rose-500/30 flex items-center gap-2 text-xs font-black shadow-lg">
              <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
              <span className="text-slate-100">{streakDays} Day Streak!</span>
              <span className="text-[10px] text-amber-400 font-mono bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">
                1.35x Multiplier
              </span>
            </div>

            {/* Daily Reward Chest Button */}
            <button
              onClick={handleClaimBonus}
              disabled={claimedDailyBonus}
              className={`px-3.5 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
                claimedDailyBonus
                  ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-lg shadow-amber-500/20 scale-105 animate-pulse'
              }`}
            >
              <Gift className="w-4 h-4" />
              <span>{claimedDailyBonus ? 'Streak Bonus Claimed' : 'Claim Streak Bonus (+338 XP)'}</span>
            </button>

            {/* Achievements Modal Trigger */}
            <button
              onClick={() => setShowAchievementsModal(true)}
              className="px-3.5 py-2 rounded-2xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 shadow-md transition-colors text-xs font-bold flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Badges ({unlockedCount}/{badges.length})</span>
            </button>

          </div>

        </div>
      </div>

      {/* Gamification Milestone & Workout Volume Banner */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Total Volume Milestone Card */}
        <div className="md:col-span-8 bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Dumbbell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-100 uppercase tracking-wider">Total Cumulative Workout Volume Milestone</h4>
                <p className="text-[11px] text-slate-400">Total weight lifted across all telemetry routines</p>
              </div>
            </div>

            <button
              onClick={() => handleLogWorkoutVolume(1200)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log +1,200kg Routine</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-extrabold text-slate-200">
                {totalVolumeKg.toLocaleString()} kg / {nextVolumeMilestone.toLocaleString()} kg
              </span>
              <span className="text-amber-400 font-bold">
                {volumeProgressPct}% to "50,000 kg Centurion" Badge
              </span>
            </div>

            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-cyan-400 transition-all duration-700"
                style={{ width: `${volumeProgressPct}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-xs">
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Total Workouts</span>
              <span className="font-bold text-slate-200">{totalWorkouts} Completed</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Streak Rank</span>
              <span className="font-bold text-rose-400">{streakDays} Days Active</span>
            </div>
            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80">
              <span className="text-[10px] text-slate-500 block">Milestone Bonus</span>
              <span className="font-bold text-emerald-400">+750 XP Badge Reward</span>
            </div>
          </div>
        </div>

        {/* Recent Unlocked Badge Spotlight */}
        <div className="md:col-span-4 bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black text-amber-400 flex items-center gap-1.5 uppercase">
              <Award className="w-4 h-4" /> Recent Badge Spotlight
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              UNLOCKED
            </span>
          </div>

          <div className="py-2 flex items-center gap-3">
            <div className="text-3xl p-2.5 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-lg">
              🔥
            </div>
            <div>
              <h5 className="text-xs font-extrabold text-slate-100">7-Day Iron Streak</h5>
              <p className="text-[11px] text-slate-400">Completed workouts 7 days in a row</p>
              <span className="text-[10px] font-mono text-amber-400 font-bold">+300 XP Awarded</span>
            </div>
          </div>

          <button
            onClick={() => setShowAchievementsModal(true)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          >
            <span>View All Milestones ({unlockedCount}/{badges.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Trophy / Badges Modal */}
      {showAchievementsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5 text-amber-400">
                <Trophy className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-100 text-base">Gamification Milestone Hall of Fame</h3>
              </div>
              <button
                onClick={() => setShowAchievementsModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Unlocked: {unlockedCount} / {badges.length} Badges</span>
              <span className="text-amber-400 font-bold">Level {level} Gold Champion</span>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                    b.unlocked
                      ? 'bg-slate-950 border-amber-500/40 shadow-lg'
                      : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                  }`}
                >
                  <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                    {b.icon}
                  </div>

                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-100 text-xs">{b.title}</h4>
                      {b.unlocked ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{b.description}</p>
                    
                    {b.targetValue && (
                      <div className="pt-1">
                        <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-0.5">
                          <span>Progress</span>
                          <span>{(b.currentValue || 0).toLocaleString()} / {b.targetValue.toLocaleString()} {b.unit}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-emerald-400"
                            style={{ width: `${Math.min(100, ((b.currentValue || 0) / b.targetValue) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <span className="text-[10px] font-mono text-amber-400 font-bold block pt-1">
                      +{b.xpReward} XP Reward
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
