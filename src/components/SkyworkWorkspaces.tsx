import React, { useState } from 'react';
import {
  FolderKanban,
  Clock,
  Box,
  FileText,
  HelpCircle,
  Sparkles,
  Plus,
  Play,
  CheckCircle2,
  Search,
  Upload,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  Dumbbell,
  Flame,
  Activity,
  Heart
} from 'lucide-react';

interface WorkspaceProps {
  onOpenNewProject: () => void;
  onOpenUpgrade: () => void;
}

export const ProjectsView: React.FC<WorkspaceProps> = ({ onOpenNewProject }) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [search, setSearch] = useState('');

  const projects = [
    {
      id: 1,
      name: '12-Week Push/Pull/Legs Hypertrophy Protocol',
      agent: 'Workouts',
      updated: '15m ago',
      status: 'active',
      artifacts: 4,
      desc: 'Periodized 3-phase hypertrophy routine with progressive volume landmarks'
    },
    {
      id: 2,
      name: 'Zone 2 Aerobic Base & Lactate Threshold Matrix',
      agent: 'Biometrics',
      updated: '2h ago',
      status: 'active',
      artifacts: 3,
      desc: 'Karvonen 5-zone cardiovascular training thresholds based on 58 BPM resting HR'
    },
    {
      id: 3,
      name: 'Precision Anti-Inflammatory Sports Nutrition Plan',
      agent: 'Nutrition',
      updated: '1d ago',
      status: 'completed',
      artifacts: 6,
      desc: 'High-protein whole food meal timing with 2.2g/kg protein and MPS scheduling'
    },
    {
      id: 4,
      name: 'Scapular Kinematics & Shoulder Pre-Hab Routine',
      agent: 'Biomechanics',
      updated: '2d ago',
      status: 'active',
      artifacts: 5,
      desc: 'Rotator cuff activation and overhead press angle modification for joint safety'
    }
  ];

  const filtered = projects.filter((p) => {
    if (filter === 'active' && p.status !== 'active') return false;
    if (filter === 'completed' && p.status !== 'completed') return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Fitness Training Programs</h2>
          <p className="text-xs text-slate-400">Manage autonomous AI fitness routines and synthesized coaching protocols</p>
        </div>
        <button
          onClick={onOpenNewProject}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Fitness Program</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-2 rounded-2xl bg-[#120b22] border border-purple-900/30">
        <div className="flex items-center gap-1 w-full sm:w-auto">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-colors ${
                filter === tab ? 'bg-purple-900/50 text-white border border-purple-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab} Programs
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search training programs..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-purple-900/40 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#130d26]/80 border border-purple-900/30 hover:border-purple-500/50 transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-purple-400 px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-800/40">
                {proj.agent} Agent
              </span>
              <span className="text-[11px] text-slate-500">{proj.updated}</span>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                {proj.name}
              </h3>
              <p className="text-xs text-slate-400 mt-1">{proj.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-purple-900/20 text-xs text-slate-400">
              <span>{proj.artifacts} Protocol modules</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> {proj.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ScheduledTasksView: React.FC = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Daily Morning Resting Heart Rate & HRV Readiness Sync',
      schedule: 'Every day at 07:00 AM',
      agent: 'Biometrics',
      enabled: true,
      lastStatus: 'Success (58 BPM / HRV 88)'
    },
    {
      id: 2,
      title: 'Weekly Progressive Overload & Volume Autoregulation',
      schedule: 'Every Sunday at 08:00 PM',
      agent: 'Workouts',
      enabled: true,
      lastStatus: 'Analyzed 16 Working Sets (+2.5kg target)'
    },
    {
      id: 3,
      title: 'Pre-Workout Glycogen Timing & Hydration Alert',
      schedule: 'Every Training Day at 04:30 PM',
      agent: 'Nutrition',
      enabled: true,
      lastStatus: 'Sent 25g Whey + 40g Carbohydrates timing'
    }
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Scheduled Fitness Tasks</h2>
        <p className="text-xs text-slate-400">Autonomous recurring coaching routines executed by OmniSync AI Fitness</p>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="p-4 rounded-2xl bg-[#130d26]/80 border border-purple-900/30 flex items-center justify-between flex-wrap gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <h4 className="text-sm font-semibold text-white">{t.title}</h4>
              </div>
              <p className="text-xs text-slate-400">
                {t.schedule} · <span className="text-purple-300 font-mono">{t.agent} Agent</span> · Last run:{' '}
                <span className="text-emerald-400">{t.lastStatus}</span>
              </p>
            </div>
            <button
              onClick={() => toggleTask(t.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                t.enabled
                  ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {t.enabled ? 'Enabled' : 'Paused'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const KnowledgeBaseView: React.FC = () => {
  const documents = [
    { name: 'wearable_biometrics_telemetry_2026.csv', size: '2.4 MB', type: 'HRV & HR Logs', chunks: 1420 },
    { name: 'sports_science_hypertrophy_mechanisms.pdf', size: '5.8 MB', type: 'Exercise Physiology', chunks: 3200 },
    { name: 'karvonen_5_zone_cardiovascular_matrix.json', size: '540 KB', type: 'Target BPM Schema', chunks: 450 },
    { name: 'high_protein_anti_inflammatory_meal_plans.pdf', size: '3.1 MB', type: 'Nutrition Guide', chunks: 1100 }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Sports Science Knowledge Base</h2>
          <p className="text-xs text-slate-400">Ground your AI Fitness Super Agents in evidence-based exercise science</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 border border-purple-700/50 text-xs font-semibold transition-colors">
          <Upload className="w-4 h-4" />
          <span>Upload Fitness Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#130d26]/80 border border-purple-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300 font-mono truncate">{doc.name}</span>
              <span className="text-[10px] text-slate-500">{doc.size}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-purple-900/20">
              <span>{doc.type}</span>
              <span className="text-emerald-400">{doc.chunks} vectors indexed</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AgentDescriptionView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">OmniSync AI Fitness Architecture</h2>
        <p className="text-xs text-slate-400">
          Core Principles &amp; Sports Science Coaching Guidelines (AGENTS.md)
        </p>
      </div>

      <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
        <div className="p-5 rounded-2xl bg-[#140e28] border border-purple-900/40 space-y-2">
          <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 1. Evidence-Based Sports Science
          </h3>
          <p>
            All workout routines, hypertrophy volume recommendations, cardiovascular target zones, and macro distributions strictly align with peer-reviewed sports science and exercise physiology principles.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#140e28] border border-purple-900/40 space-y-2">
          <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-purple-400" /> 2. 7 Autonomous Specialized Fitness Agents
          </h3>
          <p>
            Coach AI, Workouts, Nutrition, Biometrics, Biomechanics, Audio Pacer, and Reel Motivate collaborate seamlessly to provide a complete, holistic athlete coaching ecosystem.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#140e28] border border-purple-900/40 space-y-2">
          <h3 className="text-sm font-bold text-purple-300 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400" /> 3. Safety First &amp; Autoregulated Training
          </h3>
          <p>
            OmniSync NEVER recommends extreme crash diets (&lt;1200 kcal) or loading heavy weights during extreme muscular exhaustion. Training intensity and rest intervals dynamically adjust based on user fatigue and heart rate biometrics.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TutorialView: React.FC = () => {
  const steps = [
    {
      title: '1. Select Your Fitness Specialist Agent',
      desc: 'Choose between Coach AI, Workouts, Nutrition, Biometrics, Biomechanics, Audio Pacer, or Reel Motivate to configure your guidance.'
    },
    {
      title: '2. Express Your Fitness Goals in Natural Language',
      desc: 'Type your prompt. Reference specific parameters like @biometrics:heart_rate_zones or @routine:hypertrophy_split.'
    },
    {
      title: '3. Ground with Sports Science & Physiology',
      desc: 'Activate the Globe icon to query peer-reviewed exercise science literature and verified macro formulas.'
    },
    {
      title: '4. Apply Protocols Directly to Your Routine',
      desc: 'Copy generated set/rep tables, export meal plans, or sync target HR zones with your wearable device.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">How to Train with OmniSync AI Fitness</h2>
        <p className="text-xs text-slate-400">Master workouts, nutrition, and recovery with AI Super Agents</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {steps.map((s, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#130d26]/80 border border-purple-900/30 space-y-2">
            <h4 className="text-sm font-bold text-purple-300">{s.title}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProductUpdatesView: React.FC = () => {
  const updates = [
    {
      version: 'OmniSync AI Fitness 1.0',
      date: 'October 2026',
      items: [
        'Cosmic Dark UI Dashboard with evidence-based AI Fitness Case Gallery',
        '7 Specialized Fitness Agent Modes (Coach AI, Workouts, Nutrition, Biometrics, Biomechanics, Audio Pacer, Reel Motivate)',
        'Live Progressive Overload, RPE tracking & Karvonen Zone 2 calculation',
        'Wearable Telemetry sync with Apple Watch, Garmin, and Whoop integration'
      ]
    },
    {
      version: 'v0.9.8 Biometrics Engine',
      date: 'August 2026',
      items: [
        'Real-time heart rate fatigue detection and autoregulated rest intervals',
        'Athlete credential authentication and secure biometric history persistence',
        'Clean bulking & lean shredding macro synthesizer with MPS timing'
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6 animate-in fade-in">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">OmniSync AI Fitness Changelog</h2>
        <p className="text-xs text-slate-400">Release notes and sports science updates</p>
      </div>

      <div className="space-y-4">
        {updates.map((u, i) => (
          <div key={i} className="p-5 rounded-2xl bg-[#130d26]/80 border border-purple-900/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-white">{u.version}</h4>
              <span className="text-xs text-purple-400 font-mono">{u.date}</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              {u.items.map((it, idx) => (
                <li key={idx}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
