import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface DepartmentData {
  name: string;
  count: number;
  color: string;
}

const DEFAULT_DEPT_DATA: DepartmentData[] = [
  { name: 'Ingeniería & TI', count: 5, color: '#0ea5e9' },
  { name: 'Talento Humano', count: 2, color: '#a855f7' },
  { name: 'Operaciones', count: 2, color: '#10b981' },
  { name: 'Comercial', count: 1, color: '#f59e0b' },
];

export const DepartmentDistributionChart: React.FC = () => {
  return (
    <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-bold text-slate-100">Personal por Departamento</h4>
        <p className="text-xs text-slate-400">Distribución de los 10 empleados activos</p>
      </div>

      <div className="h-48 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={DEFAULT_DEPT_DATA}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="count"
            >
              {DEFAULT_DEPT_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '0.75rem',
                fontSize: '12px',
                color: '#f8fafc',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
        {DEFAULT_DEPT_DATA.map((dept) => (
          <div key={dept.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: dept.color }} />
            <span className="text-[11px] text-slate-300 truncate">{dept.name}</span>
            <span className="text-[11px] font-mono font-bold text-slate-400 ml-auto">{dept.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
