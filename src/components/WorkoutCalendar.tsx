import React, { useState } from 'react';
import { WorkoutRoutine } from '../types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Moon,
  Sparkles,
  RotateCcw,
  Plus,
  Flame,
  Check,
  X,
  Filter
} from 'lucide-react';

export type CalendarDayStatus = 'completed' | 'scheduled' | 'missed' | 'rest';

export interface CalendarEvent {
  id: string;
  dateStr: string; // YYYY-MM-DD
  title: string;
  category: string;
  status: CalendarDayStatus;
  durationMins?: number;
  caloriesBurned?: number;
  avgHR?: number;
  notes?: string;
}

interface WorkoutCalendarProps {
  routines: WorkoutRoutine[];
}

export const WorkoutCalendar: React.FC<WorkoutCalendarProps> = ({ routines }) => {
  // Current view year & month (August 2026 default based on environment date)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 1)); // August 2026
  const [selectedDay, setSelectedDay] = useState<string | null>('2026-08-05');
  const [filterStatus, setFilterStatus] = useState<CalendarDayStatus | 'all'>('all');

  // Sample schedule data for August 2026
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt_1',
      dateStr: '2026-08-01',
      title: 'Upper Body Hypertrophy',
      category: 'Hypertrophy',
      status: 'completed',
      durationMins: 55,
      caloriesBurned: 480,
      avgHR: 142,
      notes: 'Hit 100kg bench press PR!'
    },
    {
      id: 'evt_2',
      dateStr: '2026-08-02',
      title: 'Zone 2 Cardio & Mobility',
      category: 'Endurance',
      status: 'completed',
      durationMins: 45,
      caloriesBurned: 350,
      avgHR: 128
    },
    {
      id: 'evt_3',
      dateStr: '2026-08-03',
      title: 'Legs & Core Overload',
      category: 'Strength',
      status: 'missed',
      durationMins: 60,
      notes: 'Missed due to travel delay. Need to reschedule.'
    },
    {
      id: 'evt_4',
      dateStr: '2026-08-04',
      title: 'Active Rest & Recovery',
      category: 'Active Recovery',
      status: 'rest',
      durationMins: 20
    },
    {
      id: 'evt_5',
      dateStr: '2026-08-05',
      title: 'Push & Arms Power',
      category: 'Strength',
      status: 'completed',
      durationMins: 50,
      caloriesBurned: 430,
      avgHR: 145
    },
    {
      id: 'evt_6',
      dateStr: '2026-08-06',
      title: 'Pull & Back Hypertrophy',
      category: 'Hypertrophy',
      status: 'scheduled',
      durationMins: 50
    },
    {
      id: 'evt_7',
      dateStr: '2026-08-07',
      title: 'HIIT Metabolic Burn',
      category: 'HIIT',
      status: 'scheduled',
      durationMins: 35
    },
    {
      id: 'evt_8',
      dateStr: '2026-08-08',
      title: 'Mobility & Stretching',
      category: 'Active Recovery',
      status: 'rest'
    },
    {
      id: 'evt_9',
      dateStr: '2026-08-09',
      title: 'Leg Day Volume',
      category: 'Strength',
      status: 'scheduled',
      durationMins: 60
    },
    {
      id: 'evt_10',
      dateStr: '2026-08-10',
      title: 'Chest & Shoulders',
      category: 'Hypertrophy',
      status: 'scheduled',
      durationMins: 45
    },
    {
      id: 'evt_11',
      dateStr: '2026-08-12',
      title: 'Endurance Row & Run',
      category: 'Endurance',
      status: 'scheduled',
      durationMins: 40
    },
    {
      id: 'evt_12',
      dateStr: '2026-08-15',
      title: 'Full Body Functional',
      category: 'HIIT',
      status: 'scheduled',
      durationMins: 45
    }
  ]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to format date string YYYY-MM-DD
  const formatDateStr = (y: number, m: number, d: number) => {
    const mm = (m + 1).toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDay(dateStr);
  };

  const selectedEvent = events.find((e) => e.dateStr === selectedDay);

  // Status counters
  const completedCount = events.filter((e) => e.status === 'completed').length;
  const scheduledCount = events.filter((e) => e.status === 'scheduled').length;
  const missedCount = events.filter((e) => e.status === 'missed').length;
  const restCount = events.filter((e) => e.status === 'rest').length;

  const handleRescheduleMissed = (eventId: string) => {
    // Move missed to tomorrow or mark as scheduled
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? { ...e, status: 'scheduled', notes: 'Rescheduled from past missed session' }
          : e
      )
    );
  };

  const handleMarkCompleted = (eventId: string) => {
    setEvents(
      events.map((e) =>
        e.id === eventId
          ? {
              ...e,
              status: 'completed',
              durationMins: e.durationMins || 45,
              caloriesBurned: e.caloriesBurned || 380,
              avgHR: 138
            }
          : e
      )
    );
  };

  return (
    <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Workout Schedule & Compliance Calendar</h2>
            <p className="text-xs text-slate-400">Visual breakdown of scheduled routines, missed sessions, and completed fitness goals.</p>
          </div>
        </div>

        {/* Month Selector & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-extrabold text-slate-200 font-mono px-3">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-800 text-slate-100'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('completed')}
              className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterStatus === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{completedCount}</span>
            </button>
            <button
              onClick={() => setFilterStatus('scheduled')}
              className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterStatus === 'scheduled'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>{scheduledCount}</span>
            </button>
            <button
              onClick={() => setFilterStatus('missed')}
              className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                filterStatus === 'missed'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              <span>{missedCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Compliance Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Completed</span>
          </div>
          <span className="font-extrabold text-slate-100 font-mono">{completedCount} Days</span>
        </div>

        <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-cyan-400 font-bold">
            <Clock className="w-4 h-4" />
            <span>Scheduled</span>
          </div>
          <span className="font-extrabold text-slate-100 font-mono">{scheduledCount} Days</span>
        </div>

        <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle className="w-4 h-4" />
            <span>Missed</span>
          </div>
          <span className="font-extrabold text-slate-100 font-mono">{missedCount} Days</span>
        </div>

        <div className="p-3 rounded-2xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400 font-bold">
            <Moon className="w-4 h-4" />
            <span>Rest / Recovery</span>
          </div>
          <span className="font-extrabold text-slate-100 font-mono">{restCount} Days</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 shadow-inner">
        
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayIndex }).map((_, idx) => (
            <div key={`empty_${idx}`} className="h-20 sm:h-24 rounded-xl bg-slate-900/30 opacity-20 pointer-events-none" />
          ))}

          {/* Actual Month Days */}
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const dateStr = formatDateStr(year, month, dayNum);
            const dayEvent = events.find((e) => e.dateStr === dateStr);
            const isSelected = selectedDay === dateStr;

            // Apply filter
            const isFilteredOut =
              filterStatus !== 'all' && dayEvent && dayEvent.status !== filterStatus;

            return (
              <div
                key={dateStr}
                onClick={() => handleDayClick(dateStr)}
                className={`h-20 sm:h-24 rounded-xl p-1.5 sm:p-2 border cursor-pointer transition-all flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'border-emerald-400 bg-slate-900 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/30'
                    : 'border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700'
                } ${isFilteredOut ? 'opacity-30' : 'opacity-100'}`}
              >
                {/* Date Number */}
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {dayNum}
                  </span>

                  {dayEvent?.status === 'completed' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {dayEvent?.status === 'scheduled' && (
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  )}
                  {dayEvent?.status === 'missed' && (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  )}
                  {dayEvent?.status === 'rest' && (
                    <Moon className="w-3.5 h-3.5 text-purple-400" />
                  )}
                </div>

                {/* Event Badge */}
                {dayEvent ? (
                  <div className="mt-auto">
                    <div
                      className={`p-1 sm:p-1.5 rounded-lg border text-[10px] font-bold leading-tight truncate transition-transform group-hover:scale-[1.02] ${
                        dayEvent.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : dayEvent.status === 'scheduled'
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                          : dayEvent.status === 'missed'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      }`}
                    >
                      {dayEvent.title}
                    </div>
                  </div>
                ) : (
                  <span className="text-[9px] text-slate-600 block mt-auto italic">No event</span>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Day Detailed Inspector */}
      {selectedDay && (
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Selected Day Inspection</span>
              <h3 className="font-extrabold text-slate-100 text-sm font-mono">
                {selectedDay}
              </h3>
            </div>
            {selectedEvent && (
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border uppercase ${
                  selectedEvent.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : selectedEvent.status === 'scheduled'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                    : selectedEvent.status === 'missed'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}
              >
                {selectedEvent.status}
              </span>
            )}
          </div>

          {selectedEvent ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-100 text-base">{selectedEvent.title}</h4>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold">
                    {selectedEvent.category}
                  </span>
                </div>

                {selectedEvent.notes && (
                  <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    💡 {selectedEvent.notes}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300 font-mono">
                  {selectedEvent.durationMins && (
                    <div className="flex items-center gap-1 text-cyan-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedEvent.durationMins} mins</span>
                    </div>
                  )}
                  {selectedEvent.caloriesBurned && (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span>{selectedEvent.caloriesBurned} kcal</span>
                    </div>
                  )}
                  {selectedEvent.avgHR && (
                    <div className="flex items-center gap-1 text-rose-400">
                      <span>❤️ {selectedEvent.avgHR} bpm avg</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Day Actions */}
              <div className="md:col-span-4 flex flex-col gap-2 justify-end">
                {selectedEvent.status === 'missed' && (
                  <button
                    onClick={() => handleRescheduleMissed(selectedEvent.id)}
                    className="w-full py-2 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reschedule Missed Workout</span>
                  </button>
                )}

                {selectedEvent.status === 'scheduled' && (
                  <button
                    onClick={() => handleMarkCompleted(selectedEvent.id)}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Workout Completed</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400 italic flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>No workout scheduled for this day. Rest and muscle repair recommended.</span>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
