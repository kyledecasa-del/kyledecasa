import React, { useState } from 'react';
import { X, FolderPlus, Sparkles } from 'lucide-react';
import { AGENT_MODES_CONFIG } from '../data/skyworkData';
import { AgentCategory } from '../types';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: { name: string; agent: AgentCategory; description: string }) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject
}) => {
  const [name, setName] = useState('');
  const [agent, setAgent] = useState<AgentCategory>('general');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreateProject({
      name: name.trim(),
      agent,
      description: description.trim()
    });
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0e0a1e] border border-purple-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#140e28]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Create New Project</h3>
              <p className="text-xs text-slate-400">Initialize an autonomous Super Agent workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Q4 Marketing Engine or Cross-Domain Research"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16102a] border border-purple-900/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary Agent Specialist
            </label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value as AgentCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16102a] border border-purple-900/40 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors capitalize"
            >
              {AGENT_MODES_CONFIG.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#120b22] text-white">
                  {m.label} Agent - {m.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Scope / Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Define project deliverables and requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#16102a] border border-purple-900/40 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 transition-colors resize-none"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_15px_rgba(147,51,234,0.4)] transition-all"
            >
              Initialize Workspace
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
