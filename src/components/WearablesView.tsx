import React, { useState } from 'react';
import { WearableDevice } from '../types';
import {
  Watch,
  CheckCircle,
  RefreshCw,
  Power,
  Battery,
  Wifi,
  Activity,
  Heart,
  Moon,
  Footprints,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface WearablesViewProps {
  wearables: WearableDevice[];
  onUpdateWearables: (updated: WearableDevice[]) => void;
}

export const WearablesView: React.FC<WearablesViewProps> = ({
  wearables,
  onUpdateWearables
}) => {
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);

  const handleToggleConnection = (id: string) => {
    const updated = wearables.map((dev) => {
      if (dev.id === id) {
        return { ...dev, connected: !dev.connected };
      }
      return dev;
    });
    onUpdateWearables(updated);
  };

  const handleForceSync = (id: string) => {
    setSyncingDeviceId(id);
    setTimeout(() => {
      const updated = wearables.map((dev) => {
        if (dev.id === id) {
          return {
            ...dev,
            connected: true,
            lastSyncTime: 'Just now',
            stepsToday: dev.stepsToday + Math.floor(Math.random() * 120),
            activeCaloriesToday: dev.activeCaloriesToday + Math.floor(Math.random() * 15)
          };
        }
        return dev;
      });
      onUpdateWearables(updated);
      setSyncingDeviceId(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Watch className="w-4 h-4" />
            <span>Multi-Device Telemetry Integration</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100">Wearable Device Synchronization</h1>
          <p className="text-xs text-slate-400 mt-1">
            Seamlessly streams continuous heart rate, HRV, accelerometer steps, and sleep architecture into AuraFit AI.
          </p>
        </div>

        <button
          onClick={() => wearables.forEach(d => handleForceSync(d.id))}
          className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${syncingDeviceId ? 'animate-spin' : ''}`} />
          <span>Sync All Devices Now</span>
        </button>
      </div>

      {/* Connected Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wearables.map((dev) => {
          const isSyncing = syncingDeviceId === dev.id;

          return (
            <div
              key={dev.id}
              className={`rounded-2xl p-6 border transition-all ${
                dev.connected
                  ? 'bg-slate-900/90 border-cyan-500/30 shadow-xl'
                  : 'bg-slate-900/40 border-slate-800 opacity-75'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
                    dev.connected ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Watch className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">{dev.name}</h3>
                    <p className="text-xs text-slate-400">{dev.type} Telemetry Protocol</p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleConnection(dev.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                    dev.connected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{dev.connected ? 'Connected' : 'Pair Device'}</span>
                </button>
              </div>

              {dev.connected ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                    <span className="flex items-center gap-1">
                      <Battery className="w-4 h-4 text-emerald-400" />
                      Battery: {dev.batteryLevel}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Wifi className="w-4 h-4 text-cyan-400" />
                      Last Sync: {dev.lastSyncTime}
                    </span>
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Footprints className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Steps</span>
                        <span className="font-bold text-slate-100 font-mono">{dev.stepsToday.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Active Burn</span>
                        <span className="font-bold text-amber-400 font-mono">{dev.activeCaloriesToday} kcal</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">HRV Stream</span>
                        <span className="font-bold text-cyan-300 font-mono">{dev.hrvLatest} ms</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2">
                      <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block">Sleep Score</span>
                        <span className="font-bold text-indigo-300 font-mono">{dev.sleepScoreLatest}%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleForceSync(dev.id)}
                    disabled={isSyncing}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Synchronizing Telemetry...' : 'Force Sync Bluetooth Channel'}</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-center text-xs text-slate-500">
                  Device currently paired but offline. Click "Pair Device" to initiate Bluetooth handshaking.
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
