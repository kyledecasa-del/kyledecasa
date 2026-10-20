import React from 'react';
import { X, Sparkles, Play, Clock, Wrench, ArrowRight } from 'lucide-react';
import { CaseGalleryItem } from '../types';

interface CaseStudyModalProps {
  item: CaseGalleryItem | null;
  onClose: () => void;
  onUsePrompt: (prompt: string, category: string) => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  item,
  onClose,
  onUsePrompt
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0e0a1e] border border-purple-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#140e28]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <h3 className="text-base font-semibold text-white">{item.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Metadata banner */}
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" /> Category: {item.category.toUpperCase()}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Latency: {item.executionTime}
            </span>
            <span>·</span>
            <span className="uppercase">{item.mediaType} Mode</span>
          </div>

          {/* Description */}
          <p className="text-slate-300 leading-relaxed">{item.description}</p>

          {/* Prompt Box */}
          <div className="p-4 rounded-xl bg-[#16102b] border border-purple-900/40 space-y-2">
            <h4 className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
              Exact Prompt Configuration
            </h4>
            <p className="text-xs font-mono text-slate-200 leading-relaxed bg-[#0c0818] p-3 rounded-lg border border-purple-950/60">
              "{item.prompt}"
            </p>
          </div>

          {/* Tools Used */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" /> Sub-Agent Tools Deployed
            </h4>
            <div className="flex flex-wrap gap-2">
              {item.toolsUsed.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-purple-950/50 border border-purple-800/40 text-xs text-purple-300 font-mono"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Sample Output */}
          <div className="p-4 rounded-xl bg-[#110d22] border border-white/5 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Synthesized Artifact Sample
            </h4>
            <div className="text-xs font-mono text-slate-300 bg-[#090614] p-3 rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap">
              {item.sampleOutput.content}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-900/30 bg-[#120c24]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => {
              onUsePrompt(item.prompt, item.category);
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white text-xs font-semibold shadow-[0_0_18px_rgba(217,70,239,0.4)] transition-all"
          >
            <span>Run In Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
