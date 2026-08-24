import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { AttendanceStatus, DailyAttendance } from '../../types';
import { getStatusLabel } from '../../utils/attendanceRules';
import { cn } from '../../utils/cn';

interface AttendanceCalendarProps {
  records: DailyAttendance[];
  currentMonthDate?: Date;
  onSelectDay?: (record: DailyAttendance | null, dateStr: string) => void;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  records,
  onSelectDay,
}) => {
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Map of "YYYY-MM-DD" -> DailyAttendance
  const recordsMap = new Map<string, DailyAttendance>(records.map((r) => [r.fecha, r]));

  // Generate calendar dates for August 2026
  const year = 2026;
  const month = 7; // August (0-indexed)
  const daysInMonth = 31;
  const startDayIndex = 5; // August 1 2026 was a Saturday -> Monday index is 5

  const calendarCells = [];
  for (let i = 0; i < startDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({ day, dateStr });
  }

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-sky-400" />
          <h4 className="text-sm font-bold text-white">Calendario Mensual — Agosto 2026</h4>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Puntual</span>
          <span className="w-2 h-2 rounded-full bg-amber-500 ml-2"></span>
          <span>Tarde</span>
          <span className="w-2 h-2 rounded-full bg-purple-500 ml-2"></span>
          <span>Horas Extra</span>
          <span className="w-2 h-2 rounded-full bg-rose-500 ml-2"></span>
          <span>Ausente</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5 text-center">
        {daysOfWeek.map((dow) => (
          <div key={dow} className="py-2 text-[11px] font-bold text-slate-400 uppercase">
            {dow}
          </div>
        ))}

        {calendarCells.map((cell, idx) => {
          if (!cell) {
            return <div key={`empty-${idx}`} className="h-16 rounded-xl bg-slate-950/20" />;
          }

          const record = recordsMap.get(cell.dateStr);
          const statusInfo = record ? getStatusLabel(record.estado) : null;
          const isToday = cell.day === 24;

          return (
            <button
              key={cell.dateStr}
              onClick={() => onSelectDay && onSelectDay(record || null, cell.dateStr)}
              className={cn(
                'h-16 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all group relative',
                isToday
                  ? 'bg-sky-950/30 border-sky-500/50 shadow-inner'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700',
                record && 'hover:scale-[1.02]'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span
                  className={cn(
                    'text-xs font-bold font-mono',
                    isToday ? 'text-sky-400' : 'text-slate-300'
                  )}
                >
                  {cell.day}
                </span>
                {isToday && (
                  <span className="text-[9px] font-bold px-1 rounded bg-sky-500/20 text-sky-300">
                    Hoy
                  </span>
                )}
              </div>

              {record ? (
                <div
                  className={cn(
                    'w-full py-0.5 px-1 rounded text-[10px] font-semibold flex items-center justify-between truncate border',
                    statusInfo?.badgeClass
                  )}
                >
                  <span className="truncate">{statusInfo?.label}</span>
                  <span className="font-mono ml-1">{statusInfo?.symbol}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 italic">--</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
