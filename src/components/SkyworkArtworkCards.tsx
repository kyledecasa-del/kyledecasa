import React from 'react';
import { CaseGalleryItem } from '../types';

interface ArtworkCardProps {
  item: CaseGalleryItem;
  onClick: () => void;
}

export const SkyworkArtworkCard: React.FC<ArtworkCardProps> = ({ item, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-2xl bg-[#141026]/90 border border-purple-900/30 hover:border-purple-500/60 transition-all duration-300 overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.45)] hover:shadow-[0_12px_32px_rgba(168,85,247,0.25)] flex flex-col"
    >
      {/* Visual Artwork Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl bg-[#0d091a]">
        {(item.id === 'hypertrophy_strength' || item.id === 'dickinson_poem') && (
          <HypertrophyStrengthArtwork />
        )}
        {(item.id === 'biometrics_hr_zones' || item.id === 'ai_task_managers') && (
          <BiometricsHrZonesArtwork />
        )}
        {(item.id === 'precision_macro_fueling' || item.id === 'project_management_degree') && (
          <PrecisionMacroFuelingArtwork />
        )}
        {item.id !== 'hypertrophy_strength' &&
          item.id !== 'dickinson_poem' &&
          item.id !== 'biometrics_hr_zones' &&
          item.id !== 'ai_task_managers' &&
          item.id !== 'precision_macro_fueling' &&
          item.id !== 'project_management_degree' && (
            <GenericCaseArtwork item={item} />
          )}

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-purple-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
      </div>

      {/* Card Footer / Caption */}
      <div className="p-4 pt-3.5 flex flex-col justify-between flex-1">
        <h4 className="text-sm font-medium text-slate-100 group-hover:text-purple-300 transition-colors line-clamp-2 leading-snug">
          {item.title}
        </h4>
        {item.subtitle && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {item.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Card 1: Periodized Hypertrophy & Strength System
 * Teal/slate gym studio aesthetic with barbell rack, anatomical muscle vectors, dumbbell silhouette, and progressive overload telemetry.
 */
export const HypertrophyStrengthArtwork: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 250"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Deep Teal Studio */}
      <rect width="400" height="250" fill="#0d242a" />
      <rect x="0" y="0" width="400" height="250" fill="url(#teal_fitness_grad)" />

      {/* Floor with rich shadows */}
      <path d="M0 190 L400 190 L400 250 L0 250 Z" fill="#071518" />
      <path d="M0 190 L400 190" stroke="#163c45" strokeWidth="2" />

      {/* Modern Gym Studio Windows & Power Cage Uprights */}
      <rect x="40" y="25" width="75" height="110" rx="4" stroke="#1f4e59" strokeWidth="2.5" fill="#0b2025" opacity="0.8" />
      <line x1="77" y1="25" x2="77" y2="135" stroke="#1f4e59" strokeWidth="2" />
      <line x1="40" y1="80" x2="115" y2="80" stroke="#1f4e59" strokeWidth="2" />
      
      {/* Heavy Barbell Rack & Olympic Plates on Left */}
      <path d="M125 190 L125 70 M155 190 L155 70" stroke="#2a6675" strokeWidth="3.5" />
      <line x1="120" y1="95" x2="160" y2="95" stroke="#3da6bd" strokeWidth="3" />
      {/* Olympic Weight Plates Stack */}
      <rect x="130" y="100" width="8" height="60" rx="2" fill="#1b454f" stroke="#256473" strokeWidth="1.5" />
      <rect x="139" y="105" width="8" height="50" rx="2" fill="#256473" stroke="#368c9f" strokeWidth="1.5" />
      <rect x="148" y="112" width="7" height="36" rx="2" fill="#368c9f" stroke="#52bfd6" strokeWidth="1.5" />

      {/* Centerpiece: Olympic Barbell with Golden Precision Collar */}
      <rect x="165" y="160" width="135" height="6" rx="2" fill="#4fa8ba" stroke="#68c5d9" strokeWidth="1" />
      {/* 20kg Plates on Barbell */}
      <rect x="175" y="130" width="10" height="66" rx="3" fill="#1b424c" stroke="#2d7182" strokeWidth="2" />
      <rect x="187" y="136" width="8" height="54" rx="2" fill="#296574" stroke="#409db2" strokeWidth="1.5" />
      <rect x="268" y="136" width="8" height="54" rx="2" fill="#296574" stroke="#409db2" strokeWidth="1.5" />
      <rect x="278" y="130" width="10" height="66" rx="3" fill="#1b424c" stroke="#2d7182" strokeWidth="2" />

      {/* Glowing Hypertrophy Heartbeat / Muscle Activation Wave */}
      <path
        d="M170 85 L200 85 L210 65 L220 105 L230 75 L240 85 L290 85"
        stroke="#22d3ee"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="220" cy="105" r="4" fill="#38bdf8" />
      <circle cx="210" cy="65" r="3" fill="#67e8f9" />

      {/* Right Side: Pro Dumbbell Tier Rack & Kettlebells */}
      <rect x="315" y="170" width="55" height="40" rx="4" fill="#1a3d46" stroke="#296371" strokeWidth="2" />
      {/* Pro Dumbbell */}
      <rect x="325" y="152" width="35" height="5" rx="1.5" fill="#4ba6b8" />
      <rect x="322" y="142" width="6" height="25" rx="2" fill="#235460" stroke="#3aa2b6" strokeWidth="1.5" />
      <rect x="357" y="142" width="6" height="25" rx="2" fill="#235460" stroke="#3aa2b6" strokeWidth="1.5" />

      {/* Sports Science Badge on Top Left */}
      <g transform="translate(32, 160)">
        <rect x="0" y="0" width="88" height="20" rx="5" fill="#0d2e36" stroke="#256473" strokeWidth="1" />
        <text x="8" y="14" fill="#38bdf8" fontSize="10" fontWeight="700" fontFamily="sans-serif">
          RPE 8.0 • 16 SETS
        </text>
      </g>

      {/* Gradients */}
      <defs>
        <radialGradient id="teal_fitness_grad" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#1e5563" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#10333b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#08181d" stopOpacity="1" />
        </radialGradient>
      </defs>
    </svg>
  );
};

/**
 * Card 2: Biometric Strain & Zone 2 Heart Rate Matrix
 * Vibrant magenta to purple gradient card with bold fitness telemetry and interactive 5-zone HR matrix checklist.
 */
export const BiometricsHrZonesArtwork: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 250"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background Gradient */}
      <rect width="400" height="250" fill="url(#biometrics_gradient)" />

      {/* Ambient Glow Spheres */}
      <circle cx="80" cy="50" r="140" fill="#f43f5e" opacity="0.3" filter="blur(30px)" />
      <circle cx="330" cy="190" r="130" fill="#a855f7" opacity="0.35" filter="blur(40px)" />

      {/* Left Typography Block: "Biometric Zone 2 Heart Rate" */}
      <g transform="translate(32, 55)">
        <text
          x="0"
          y="24"
          fill="#ffffff"
          fontSize="22"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          Zone 2 Aerobic
        </text>
        <text
          x="0"
          y="52"
          fill="#ffffff"
          fontSize="22"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.5"
        >
          &amp; HRV Strain
        </text>
        <text
          x="0"
          y="80"
          fill="#fbcfe8"
          fontSize="18"
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.3"
        >
          Telemetry
        </text>

        {/* Live BPM Metric Pill */}
        <g transform="translate(0, 95)">
          <rect x="0" y="0" width="130" height="32" rx="16" fill="#000000" fillOpacity="0.3" stroke="#ffffff" strokeOpacity="0.3" />
          <circle cx="16" cy="16" r="5" fill="#f43f5e" />
          <text x="28" y="21" fill="#ffffff" fontSize="13" fontWeight="800" fontFamily="sans-serif">
            138 BPM
          </text>
          <text x="88" y="21" fill="#fbcfe8" fontSize="10" fontWeight="600" fontFamily="sans-serif">
            ZONE 2
          </text>
        </g>
      </g>

      {/* Right Side: 5 Cardiovascular Training Zones Checklist */}
      <g transform="translate(225, 45)">
        {/* Row 1: Zone 1 Active Recovery */}
        <circle cx="10" cy="14" r="7" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" fill="#ffffff" fillOpacity="0.2" />
        <path d="M7 14 L9.5 16.5 L14 11.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="18" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="sans-serif">
          Z1: Active Recovery (112 BPM)
        </text>

        {/* Row 2: Zone 2 Fat Burn */}
        <circle cx="10" cy="40" r="7" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.9" fill="#ffffff" fillOpacity="0.3" />
        <path d="M7 40 L9.5 42.5 L14 37.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="44" fill="#ffffff" fontSize="12" fontWeight="800" fontFamily="sans-serif">
          Z2: Fat Oxidation (138 BPM) ★
        </text>

        {/* Row 3: Zone 3 Aerobic Tempo */}
        <circle cx="10" cy="66" r="7" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" fill="none" />
        <path d="M7 66 L9.5 68.5 L14 63.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="70" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Z3: Aerobic Tempo (155 BPM)
        </text>

        {/* Row 4: Zone 4 Lactate Threshold */}
        <circle cx="10" cy="92" r="7" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" fill="none" />
        <path d="M7 92 L9.5 94.5 L14 89.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="96" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Z4: Lactate Power (170 BPM)
        </text>

        {/* Row 5: Zone 5 VO2 Max Interval */}
        <circle cx="10" cy="118" r="7" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.85" fill="none" />
        <path d="M7 118 L9.5 120.5 L14 115.5" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <text x="25" y="122" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="sans-serif">
          Z5: VO2 Max Peak (188 BPM)
        </text>

        {/* ECG Pulse curve across the bottom */}
        <path
          d="M-40 145 L10 145 L20 135 L28 158 L38 122 L48 150 L58 145 L140 145"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeOpacity="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Gradients */}
      <defs>
        <linearGradient id="biometrics_gradient" x1="0%" y1="30%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="45%" stopColor="#e11d48" />
          <stop offset="70%" stopColor="#c026d3" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

/**
 * Card 3: Precision Macro & Nutritional Fueling Protocol
 * Warm peach/gold/cream editorial layout with bold nutrition typography and macro wheels.
 */
export const PrecisionMacroFuelingArtwork: React.FC = () => {
  return (
    <svg
      viewBox="0 0 400 250"
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Warm Background */}
      <rect width="400" height="250" fill="#faedd9" />

      {/* Architectural Geometric Blocks in Peach & Ochre */}
      <path d="M0 0 L180 0 L220 160 L0 120 Z" fill="#f7dfbf" opacity="0.75" />
      <path d="M190 0 L310 0 L260 110 L160 80 Z" fill="#edd0a8" opacity="0.65" />
      <path d="M250 80 L400 40 L400 250 L270 250 Z" fill="#fed7aa" opacity="0.6" />
      <path d="M80 140 L340 100 L380 250 L60 250 Z" fill="#ffedd5" opacity="0.85" />

      {/* Top Right: Nutrition Macro Badges */}
      <g transform="translate(240, 25)">
        <rect x="0" y="0" width="130" height="26" rx="6" fill="#ea580c" fillOpacity="0.12" stroke="#ea580c" strokeWidth="1.2" />
        <text x="10" y="17" fill="#c2410c" fontSize="11" fontWeight="800" fontFamily="sans-serif">
          PROTEIN: 2.2 g/kg
        </text>
      </g>
      <g transform="translate(240, 60)">
        <rect x="0" y="0" width="130" height="26" rx="6" fill="#f97316" fillOpacity="0.12" stroke="#f97316" strokeWidth="1.2" />
        <text x="10" y="17" fill="#c2410c" fontSize="11" fontWeight="700" fontFamily="sans-serif">
          CALORIES: 2,350 kcal
        </text>
      </g>

      {/* Angular Accent Shapes */}
      <polygon points="120,40 160,20 180,70 140,90" fill="#f97316" opacity="0.15" />
      <polygon points="260,140 310,120 330,170 280,190" fill="#ea580c" opacity="0.12" />

      {/* Main Bold Orange Typography: "Precision Sports Nutrition Protocol" */}
      <g transform="translate(32, 125)">
        <text
          x="0"
          y="30"
          fill="#ea580c"
          fontSize="22"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.3"
        >
          Precision Sports
        </text>
        <text
          x="0"
          y="58"
          fill="#ea580c"
          fontSize="22"
          fontWeight="800"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="-0.3"
        >
          Nutrition Protocol
        </text>
        <text
          x="0"
          y="82"
          fill="#9a3412"
          fontSize="13"
          fontWeight="600"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          4-Window Protein Distribution &amp; MPS Timing
        </text>
      </g>
    </svg>
  );
};

export const GenericCaseArtwork: React.FC<{ item: CaseGalleryItem }> = ({ item }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-[#1b1434] via-[#241a45] to-[#120d24]">
      <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
        <span className="text-xl font-bold">⚡</span>
      </div>
      <p className="text-sm font-semibold text-white text-center">{item.title}</p>
      <span className="text-xs text-purple-300/80 mt-1 uppercase tracking-wider">
        {item.category} · {item.mediaType}
      </span>
    </div>
  );
};
