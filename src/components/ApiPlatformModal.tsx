import React, { useState } from 'react';
import { X, Key, Copy, Check, Terminal, ExternalLink, Code2 } from 'lucide-react';

interface ApiPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiPlatformModal: React.FC<ApiPlatformModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('sk-omnisync-beta-7f9a2e8810b4412c9a9');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateNewKey = () => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    setApiKey(`sk-omnisync-beta-${randomHex}${Date.now().toString(16)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0c081a] border border-purple-500/30 shadow-[0_16px_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/30 bg-[#120b24]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                OmniSync API Platform
                <span className="text-[10px] uppercase font-bold text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/40">
                  Beta
                </span>
              </h3>
              <p className="text-xs text-slate-400">Programmatic access to Super Agents 1.0 engine</p>
            </div>
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
          {/* Key Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Your Developer Sandbox Key
            </label>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#150f2b] border border-purple-900/40">
              <input
                type="text"
                readOnly
                value={apiKey}
                className="flex-1 bg-transparent text-xs font-mono text-purple-200 focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={generateNewKey}
                className="px-3 py-1.5 rounded-lg bg-purple-900/50 hover:bg-purple-800/60 text-xs text-purple-200 transition-colors"
              >
                Roll
              </button>
            </div>
          </div>

          {/* cURL Example */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5" /> Quickstart cURL Request
            </h4>
            <div className="p-4 rounded-xl bg-[#090614] border border-purple-950/70 text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
              <span className="text-purple-400">curl</span> https://api.skywork.ai/v1/agents/execute \<br />
              &nbsp;&nbsp;-H <span className="text-emerald-300">"Authorization: Bearer {apiKey}"</span> \<br />
              &nbsp;&nbsp;-H <span className="text-emerald-300">"Content-Type: application/json"</span> \<br />
              &nbsp;&nbsp;-d '<span className="text-amber-200">{JSON.stringify({ agent: 'general', prompt: 'Summarize quarterly biometrics' }, null, 2)}</span>'
            </div>
          </div>

          {/* Features */}
          <div className="p-4 rounded-xl bg-[#120d24] border border-white/5 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="font-semibold text-slate-200">Rate Limits</p>
              <p className="text-slate-400">120 requests / min in Sandbox</p>
            </div>
            <div>
              <p className="font-semibold text-slate-200">Supported Modalities</p>
              <p className="text-slate-400">Text, Slides, Audio, Vector Embeddings</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-purple-900/30 bg-[#100a20]">
          <span className="text-xs text-slate-400">v1.0.4-beta released 2026</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-all"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
