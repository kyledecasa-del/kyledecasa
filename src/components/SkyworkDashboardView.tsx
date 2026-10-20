import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Plus,
  Paperclip,
  Send,
  Star,
  Dumbbell,
  Flame,
  Activity,
  ShieldCheck,
  AudioLines,
  Play,
  Image as ImageIcon,
  Check,
  ChevronDown
} from 'lucide-react';
import { AgentCategory, GalleryFilterType, CaseGalleryItem } from '../types';
import { AGENT_MODES_CONFIG, INITIAL_CASE_GALLERY } from '../data/skyworkData';
import { SkyworkArtworkCard } from './SkyworkArtworkCards';
import { CaseStudyModal } from './CaseStudyModal';
import { AgentExecutionModal } from './AgentExecutionModal';

interface SkyworkDashboardViewProps {
  onOpenUpgrade?: () => void;
  onOpenApiPlatform?: () => void;
}

export const SkyworkDashboardView: React.FC<SkyworkDashboardViewProps> = ({
  onOpenUpgrade,
  onOpenApiPlatform
}) => {
  // Agent & Prompt State
  const [activeCategory, setActiveCategory] = useState<AgentCategory>('general');
  const [promptInput, setPromptInput] = useState('');
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  // Gallery Filters
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilterType>('image');

  // Modals
  const [selectedCase, setSelectedCase] = useState<CaseGalleryItem | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionPrompt, setExecutionPrompt] = useState('');

  const currentConfig = AGENT_MODES_CONFIG.find((c) => c.id === activeCategory) || AGENT_MODES_CONFIG[0];

  const handleSendPrompt = () => {
    if (!promptInput.trim()) return;
    setExecutionPrompt(promptInput.trim());
    setIsExecuting(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendPrompt();
    }
  };

  const handleSelectCaseStudy = (item: CaseGalleryItem) => {
    setSelectedCase(item);
  };

  const handleUsePromptFromCase = (prompt: string, category: string) => {
    setPromptInput(prompt);
    setActiveCategory(category as AgentCategory);
  };

  // Filter cases for the gallery
  const filteredCases = INITIAL_CASE_GALLERY.filter((item) => {
    if (item.category !== activeCategory && activeCategory !== 'general') {
      return item.category === activeCategory;
    }
    return item.mediaType === galleryFilter || galleryFilter === 'image';
  });

  // Ensure we always have at least the primary 3 cards displayed
  const displayCases = filteredCases.length >= 3 ? filteredCases.slice(0, 3) : INITIAL_CASE_GALLERY.slice(0, 3);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full overflow-hidden pb-16 px-4 sm:px-8">
      
      {/* Cosmic Nebula Background & Stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Radial Violet & Indigo Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-purple-700/15 rounded-full blur-[120px]" />
        <div className="absolute top-48 left-1/3 w-[500px] h-[350px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[300px] bg-fuchsia-900/10 rounded-full blur-[120px]" />

        {/* Scattered Ambient Stars */}
        <div className="absolute top-14 left-[15%] w-1 h-1 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-28 left-[35%] w-1.5 h-1.5 bg-purple-300/50 rounded-full" />
        <div className="absolute top-20 right-[25%] w-1 h-1 bg-white/60 rounded-full" />
        <div className="absolute top-44 right-[15%] w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-pulse" />
        <div className="absolute top-64 left-[20%] w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute top-80 right-[35%] w-1 h-1 bg-purple-200/50 rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto pt-6 sm:pt-10 space-y-8">
        
        {/* Hero Top Title & Version Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#1c1232]/90 border border-purple-500/30 text-purple-300 text-xs font-medium shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <span>OmniSync AI Fitness · Super Agents 1.0</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white font-sans max-w-3xl mx-auto leading-tight">
            AI Fitness Intelligence: Elevate Workouts, Nutrition &amp; Recovery
          </h2>
        </div>

        {/* Central Smart Assistant Prompt Box */}
        <div className="relative rounded-2xl bg-[#140e28]/95 border border-purple-900/40 hover:border-purple-600/50 shadow-[0_16px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300 p-4 sm:p-5">
          
          {/* Top Line inside Prompt Box: Agent indicator and inline placeholder */}
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-3 text-slate-400">
            <span className="text-purple-400 font-bold">✦</span>
            <span className="font-medium text-slate-300">Agent</span>
            <span className="text-slate-600">|</span>
            <span className="font-semibold text-fuchsia-400 capitalize">
              {currentConfig.label}
            </span>
            <span className="text-slate-500 truncate hidden sm:inline">
              {promptInput ? '' : currentConfig.placeholder}
            </span>
          </div>

          {/* Prompt Textarea */}
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentConfig.placeholder}
            rows={4}
            className="w-full bg-transparent text-sm sm:text-base text-slate-100 placeholder-slate-500/80 focus:outline-none resize-none font-sans leading-relaxed"
          />

          {/* Quick Suggestion Chips */}
          {!promptInput && (
            <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none text-[11px] text-slate-400">
              <span className="text-purple-400/80 font-medium shrink-0">Try:</span>
              <button
                onClick={() => setPromptInput('Design a 4-day Upper/Lower progressive overload training split targeting muscle hypertrophy')}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                🔥 4-Day Hypertrophy Routine
              </button>
              <button
                onClick={() => setPromptInput('Calculate my individualized Zone 2 fat-burning heart rate range based on resting HR and age')}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                ❤️ Zone 2 HR &amp; Recovery
              </button>
              <button
                onClick={() => setPromptInput('Construct an optimal high-protein macronutrient distribution for lean muscle retention')}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                🥗 High-Protein Macro Plan
              </button>
              <button
                onClick={() => setPromptInput('Formulate a joint-friendly warm-up and knee-friendly squat alternatives')}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
              >
                ⚡ Joint Pre-Hab Routine
              </button>
            </div>
          )}

          {/* Bottom Actions Bar */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-purple-900/30">
            {/* Left Tools: Web Search & Plus Tool Ingestion */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                title={webSearchEnabled ? 'Web Grounding Active' : 'Enable Web Grounding'}
                className={`p-2 rounded-xl transition-all ${
                  webSearchEnabled
                    ? 'text-purple-300 bg-purple-950/60 border border-purple-700/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Globe className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                  title="Add tool reference or file context"
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-purple-800/40 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>

                {/* Dropdown */}
                {showToolsDropdown && (
                  <div className="absolute left-0 bottom-full mb-2 w-56 rounded-xl bg-[#120a22] border border-purple-500/40 shadow-xl p-2 text-xs z-20">
                    <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Fitness Context
                    </div>
                    <button
                      onClick={() => {
                        setPromptInput((prev) => `${prev} @biometrics:heart_rate_zones `);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-200"
                    >
                      Attach @biometrics:heart_rate_zones
                    </button>
                    <button
                      onClick={() => {
                        setPromptInput((prev) => `${prev} @routine:hypertrophy_split `);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-200"
                    >
                      Attach @routine:hypertrophy_split
                    </button>
                    <button
                      onClick={() => {
                        setPromptInput((prev) => `${prev} @nutrition:macro_targets `);
                        setShowToolsDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-white/5 text-slate-200"
                    >
                      Attach @nutrition:macro_targets
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Tools: Attachment & Send Button */}
            <div className="flex items-center gap-2">
              <button
                title="Attach Document / Media"
                onClick={() => {
                  setPromptInput((prev) => (prev ? `${prev} [Biometrics data synced]` : 'Analyze synced wearable heart rate and sleep metrics'));
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <button
                onClick={handleSendPrompt}
                title="Send Prompt (Enter)"
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(147,51,234,0.5)] hover:shadow-[0_0_20px_rgba(147,51,234,0.7)] transition-all"
              >
                <Send className="w-4 h-4 translate-x-0.5" />
              </button>
            </div>
          </div>

        </div>

        {/* 7 Agent Mode Selectors */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 flex-wrap pt-2">
          
          {/* Coach AI */}
          <button
            onClick={() => setActiveCategory('general')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'general'
                  ? 'bg-gradient-to-tr from-purple-600 to-fuchsia-400 text-white shadow-[0_0_22px_rgba(217,70,239,0.6)] scale-105'
                  : 'bg-[#18112d] border border-purple-900/50 text-slate-400 group-hover:text-purple-300 group-hover:scale-105'
              }`}
            >
              <Star className="w-5 h-5 fill-current" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'general' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Coach AI
            </span>
          </button>

          {/* Workouts */}
          <button
            onClick={() => setActiveCategory('document')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'document'
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] scale-105'
                  : 'bg-[#141b36] border border-blue-500/30 text-blue-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'document' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Workouts
            </span>
          </button>

          {/* Nutrition */}
          <button
            onClick={() => setActiveCategory('slides')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'slides'
                  ? 'bg-gradient-to-tr from-rose-600 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] scale-105'
                  : 'bg-[#29131e] border border-rose-500/30 text-rose-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <Flame className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'slides' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Nutrition
            </span>
          </button>

          {/* Biometrics */}
          <button
            onClick={() => setActiveCategory('sheets')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'sheets'
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] scale-105'
                  : 'bg-[#0f281e] border border-emerald-500/30 text-emerald-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <Activity className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'sheets' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Biometrics
            </span>
          </button>

          {/* Biomechanics */}
          <button
            onClick={() => setActiveCategory('developer')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'developer'
                  ? 'bg-gradient-to-tr from-violet-600 to-purple-400 text-white shadow-[0_0_20px_rgba(139,92,246,0.6)] scale-105'
                  : 'bg-[#1c1438] border border-violet-500/30 text-violet-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'developer' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Biomechanics
            </span>
          </button>

          {/* Audio Pacer */}
          <button
            onClick={() => setActiveCategory('podcasts')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'podcasts'
                  ? 'bg-gradient-to-tr from-cyan-600 to-teal-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-105'
                  : 'bg-[#0b242b] border border-cyan-500/30 text-cyan-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <AudioLines className="w-5 h-5" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'podcasts' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Audio Pacer
            </span>
          </button>

          {/* Reel Motivate */}
          <button
            onClick={() => setActiveCategory('youvibe')}
            className="flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                activeCategory === 'youvibe'
                  ? 'bg-gradient-to-tr from-red-600 to-rose-400 text-white shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-105'
                  : 'bg-[#2c0e15] border border-red-500/30 text-red-400 group-hover:text-white group-hover:scale-105'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
            </div>
            <span
              className={`text-xs font-medium transition-colors ${
                activeCategory === 'youvibe' ? 'text-white font-semibold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              Reel Motivate
            </span>
          </button>

        </div>

        {/* General Case Gallery Section */}
        <div className="space-y-4 pt-6">
          
          {/* Section Header: Title + Media Filter Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {activeCategory === 'general' ? 'AI Fitness Case Gallery' : `${currentConfig.label} Case Gallery`}
            </h3>

            {/* Media Filter Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              
              {/* Image Pill (Active) */}
              <button
                onClick={() => setGalleryFilter('image')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  galleryFilter === 'image'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-[#140e24] hover:bg-[#1f1538] text-slate-400 border border-purple-900/40'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Image</span>
              </button>

              {/* Video Pill */}
              <button
                onClick={() => setGalleryFilter('video')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  galleryFilter === 'video'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-[#140e24] hover:bg-[#1f1538] text-slate-400 border border-purple-900/40'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Video</span>
              </button>

              {/* Voice Pill */}
              <button
                onClick={() => setGalleryFilter('voice')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  galleryFilter === 'voice'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-[#140e24] hover:bg-[#1f1538] text-slate-400 border border-purple-900/40'
                }`}
              >
                <AudioLines className="w-3.5 h-3.5" />
                <span>Voice</span>
              </button>

              {/* Content Pill */}
              <button
                onClick={() => setGalleryFilter('content')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  galleryFilter === 'content'
                    ? 'bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                    : 'bg-[#140e24] hover:bg-[#1f1538] text-slate-400 border border-purple-900/40'
                }`}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                <span>Content</span>
              </button>

            </div>
          </div>

          {/* 3 Showcase Artwork Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {displayCases.map((item) => (
              <SkyworkArtworkCard
                key={item.id}
                item={item}
                onClick={() => handleSelectCaseStudy(item)}
              />
            ))}
          </div>

        </div>

      </div>

      {/* Case Study Detail Modal */}
      <CaseStudyModal
        item={selectedCase}
        onClose={() => setSelectedCase(null)}
        onUsePrompt={handleUsePromptFromCase}
      />

      {/* Live Super Agent Execution Modal */}
      <AgentExecutionModal
        isOpen={isExecuting}
        onClose={() => setIsExecuting(false)}
        prompt={executionPrompt}
        category={activeCategory}
        webSearchEnabled={webSearchEnabled}
      />

    </div>
  );
};
