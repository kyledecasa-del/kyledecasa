import React, { useState } from 'react';
import { SocialChallenge } from '../types';
import {
  Users,
  Trophy,
  Flame,
  Award,
  Heart,
  MessageSquare,
  ThumbsUp,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';

interface SocialViewProps {
  challenges: SocialChallenge[];
  onUpdateChallenges: (updated: SocialChallenge[]) => void;
}

export const SocialView: React.FC<SocialViewProps> = ({
  challenges,
  onUpdateChallenges
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(challenges[0]?.id || '');
  const [cheerCount, setCheerCount] = useState<Record<string, number>>({});

  const activeChallenge = challenges.find((c) => c.id === selectedChallengeId) || challenges[0];

  const handleSendCheer = (userName: string) => {
    setCheerCount((prev) => ({
      ...prev,
      [userName]: (prev[userName] || 0) + 1
    }));
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Community Engagement & Peer Accountability</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Social Challenges & Leaderboards</h1>
          <p className="text-xs text-slate-400 mt-1">
            Compete in bio-metric challenges with peer athletes to stay motivated for long-term fitness consistency.
          </p>
        </div>
      </div>

      {/* Challenge Cards Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((c) => {
          const isSelected = c.id === selectedChallengeId;
          const progressPct = Math.min(100, (c.userProgress / c.goalTarget) * 100);

          return (
            <div
              key={c.id}
              onClick={() => setSelectedChallengeId(c.id)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500/40 shadow-xl'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {c.category}
                </span>
                <span className="text-xs text-slate-400 font-semibold">{c.daysRemaining} days left</span>
              </div>

              <h3 className="font-extrabold text-slate-100 text-lg mb-1">{c.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{c.description}</p>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Your Progress</span>
                  <span className="text-emerald-400">{c.userProgress.toLocaleString()} / {c.goalTarget.toLocaleString()} {c.unit}</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Challenge Leaderboard Table */}
      {activeChallenge && (
        <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Live Leaderboard</span>
              <h3 className="font-extrabold text-slate-100 text-lg">{activeChallenge.title}</h3>
            </div>
            <span className="text-xs text-slate-400 font-semibold bg-slate-800 px-3 py-1 rounded-xl">
              {activeChallenge.participantsCount.toLocaleString()} Athletes Participating
            </span>
          </div>

          <div className="space-y-2.5">
            {activeChallenge.leaderboard.map((member) => {
              const cheers = cheerCount[member.name] || 0;

              return (
                <div
                  key={member.rank}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all ${
                    member.isUser
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-xs font-mono ${
                      member.rank === 1 ? 'bg-amber-500 text-amber-950' : member.rank === 2 ? 'bg-slate-300 text-slate-950' : member.rank === 3 ? 'bg-amber-700 text-amber-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      #{member.rank}
                    </span>

                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                    />

                    <div>
                      <span className="font-bold text-slate-100 text-sm block">
                        {member.name}
                      </span>
                      {member.isUser && <span className="text-[10px] text-emerald-400 font-bold uppercase">That's You!</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-extrabold text-sm text-slate-200">
                      {member.score.toLocaleString()} {activeChallenge.unit}
                    </span>

                    <button
                      onClick={() => handleSendCheer(member.name)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 text-[11px] font-bold border border-slate-700/80 transition-colors flex items-center gap-1"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                      <span>Cheer ({cheers})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
