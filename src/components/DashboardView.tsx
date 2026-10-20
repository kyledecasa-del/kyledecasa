import React from 'react';
import { SkyworkDashboardView } from './SkyworkDashboardView';
import { UserProfile, WorkoutRoutine, RecoveryMetric, DailyNutrition, WearableDevice, WorkoutHistoryRecord, AuthUser } from '../types';

interface DashboardViewProps {
  profile?: UserProfile;
  routines?: WorkoutRoutine[];
  recovery?: RecoveryMetric;
  nutrition?: DailyNutrition;
  wearables?: WearableDevice[];
  workoutHistory?: WorkoutHistoryRecord[];
  authUser?: AuthUser | null;
  onStartWorkout?: (routine: WorkoutRoutine) => void;
  onNavigateTab?: (tab: any) => void;
  onOpenHistory?: (filter?: 'all' | 'guest' | 'user') => void;
  onOpenLogin?: (mode?: 'signin' | 'signup' | 'demo') => void;
  onOpenUpgrade?: () => void;
  onOpenApiPlatform?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenUpgrade,
  onOpenApiPlatform
}) => {
  return (
    <SkyworkDashboardView
      onOpenUpgrade={onOpenUpgrade}
      onOpenApiPlatform={onOpenApiPlatform}
    />
  );
};
