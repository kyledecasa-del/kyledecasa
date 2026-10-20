import React, { useState } from 'react';
import { X, Check, Sparkles, Zap, Shield, Crown } from 'lucide-react';

interface UpgradePremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
}

export const UpgradePremiumModal: React.FC<UpgradePremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [upgraded, setUpgraded] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = (tier: string) => {
    setUpgraded(true);
    setTimeout(() => {
      onUpgradeSuccess?.();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#0c081a] border border-purple-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-900/30 bg-[#120b24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <span className="text-xl">💎</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                OmniSync AI Fitness Pro
                <span className="text-[11px] font-medium text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/50">
                  Super Agents 1.0
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Unlock autonomous AI coaching, unlimited sports science calculations, and wearable telemetry sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Billing Switch */}
          <div className="flex justify-center">
            <div className="p-1 rounded-xl bg-[#17102e] border border-purple-900/40 flex items-center gap-1 text-xs">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  billingCycle === 'yearly'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yearly <span className="text-amber-300 font-semibold">(Save 25%)</span>
              </button>
            </div>
          </div>

          {/* Pricing Tier Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Pro Tier (Featured) */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#191032] to-[#110a22] border-2 border-purple-500/60 shadow-[0_0_25px_rgba(168,85,247,0.2)] flex flex-col justify-between relative">
              <div className="absolute top-3 right-3 text-[10px] font-semibold tracking-wider text-purple-300 uppercase px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-700/60">
                Recommended
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <h4 className="text-base font-bold text-white">Athlete Pro</h4>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$19' : '$14'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  For athletes and fitness enthusiasts demanding progressive overload and biometric tracking.
                </p>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Unlimited AI Fitness Super Agent coaching queries</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Real-time sports science grounding &amp; macro calculations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Wearable sync (Apple Watch, Garmin, Whoop)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full Biomechanical form breakdown &amp; joint safety protocols</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade('Pro')}
                disabled={upgraded}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_18px_rgba(147,51,234,0.45)] transition-all"
              >
                {upgraded ? 'Activated!' : 'Upgrade to Athlete Pro'}
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="p-5 rounded-2xl bg-[#120c22] border border-purple-900/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-base font-bold text-white">Coach &amp; Team</h4>
                </div>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-3xl font-extrabold text-white">
                    {billingCycle === 'monthly' ? '$49' : '$39'}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  For certified trainers, strength coaches, and athletic facilities managing athlete rosters.
                </p>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Multi-athlete roster &amp; cohort volume tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Custom periodization templates &amp; deload automations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Priority sub-agent latency (&lt;0.6s)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Full API access for wearable telemetry webhooks</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleUpgrade('Team')}
                disabled={upgraded}
                className="mt-6 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-purple-500/30"
              >
                {upgraded ? 'Activated!' : 'Contact Coach Sales'}
              </button>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-purple-900/30 bg-[#0f091c] flex items-center justify-between text-xs text-slate-400">
          <span>7-day risk-free trial. Cancel anytime with 1 click.</span>
          <button onClick={onClose} className="hover:text-white transition-colors">
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
