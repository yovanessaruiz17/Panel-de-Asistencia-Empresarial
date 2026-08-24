import React from 'react';
import { Clock, Edit3, ShieldAlert, Users } from 'lucide-react';
import { Schedule } from '../../types';

interface ScheduleCardProps {
  schedule: Schedule;
  assignedCount?: number;
  onEdit: (schedule: Schedule) => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule,
  assignedCount = 0,
  onEdit,
}) => {
  const daysMap = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h4 className="text-sm font-bold text-white">{schedule.nombre}</h4>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
              schedule.estado === 'ACTIVO'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
            }`}
          >
            {schedule.estado}
          </span>
        </div>

        {/* Schedule Time Box */}
        <div className="p-3 my-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-around">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Entrada</span>
            <span className="text-sm font-mono font-extrabold text-emerald-400">{schedule.hora_entrada}</span>
          </div>
          <div className="text-slate-600 font-mono">→</div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">Salida</span>
            <span className="text-sm font-mono font-extrabold text-sky-400">{schedule.hora_salida}</span>
          </div>
        </div>

        {/* Tolerance & Overtime rules */}
        <div className="space-y-1.5 text-xs text-slate-400">
          <div className="flex items-center justify-between">
            <span>Tolerancia de Entrada:</span>
            <span className="font-mono font-bold text-slate-300">{schedule.tolerancia_entrada_minutos} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tolerancia de Salida:</span>
            <span className="font-mono font-bold text-slate-300">{schedule.tolerancia_salida_minutos} min</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Permite Horas Extras:</span>
            <span className={schedule.permite_horas_extra ? 'text-purple-400 font-bold' : 'text-slate-400'}>
              {schedule.permite_horas_extra ? 'Sí (Habilitado)' : 'No'}
            </span>
          </div>
        </div>

        {/* Days of week chips */}
        <div className="flex flex-wrap gap-1 mt-3.5 pt-3 border-t border-slate-800/60">
          {daysMap.map((d, index) => {
            const isWorkDay = schedule.dias_laborales.includes(index + 1);
            return (
              <span
                key={d}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${
                  isWorkDay
                    ? 'bg-sky-500/10 text-sky-300 border-sky-500/30'
                    : 'bg-slate-950 text-slate-600 border-slate-800'
                }`}
              >
                {d}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>{assignedCount} colaboradores</span>
        </div>
        <button
          onClick={() => onEdit(schedule)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editar</span>
        </button>
      </div>
    </div>
  );
};
