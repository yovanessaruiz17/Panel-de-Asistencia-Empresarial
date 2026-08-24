import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AttendanceChartProps {
  data?: Array<{
    dia: string;
    puntuales: number;
    tardes: number;
    ausentes: number;
  }>;
}

const DEFAULT_DATA = [
  { dia: 'Lun', puntuales: 8, tardes: 1, ausentes: 1 },
  { dia: 'Mar', puntuales: 9, tardes: 0, ausentes: 1 },
  { dia: 'Mié', puntuales: 7, tardes: 2, ausentes: 1 },
  { dia: 'Jue', puntuales: 8, tardes: 1, ausentes: 1 },
  { dia: 'Vie', puntuales: 9, tardes: 1, ausentes: 0 },
  { dia: 'Sáb', puntuales: 3, tardes: 0, ausentes: 0 },
];

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data = DEFAULT_DATA }) => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Tendencia Semanal de Asistencia</h4>
          <p className="text-xs text-slate-400">Puntuales vs Tardanzas vs Ausencias</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400">Puntual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-400">Tarde</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="text-slate-400">Ausente</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPuntual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorTarde" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="dia" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
            <Area
              type="monotone"
              dataKey="puntuales"
              name="Puntuales"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPuntual)"
            />
            <Area
              type="monotone"
              dataKey="tardes"
              name="Tardanzas"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTarde)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
