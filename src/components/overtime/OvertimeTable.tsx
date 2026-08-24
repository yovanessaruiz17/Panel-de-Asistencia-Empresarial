import React from 'react';
import { Check, Clock, X } from 'lucide-react';
import { Employee, OvertimeRecord } from '../../types';

interface OvertimeTableProps {
  records: OvertimeRecord[];
  employees: Employee[];
  canApprove?: boolean;
  onApprove: (record: OvertimeRecord) => void;
  onReject: (record: OvertimeRecord) => void;
}

export const OvertimeTable: React.FC<OvertimeTableProps> = ({
  records,
  employees,
  canApprove = false,
  onApprove,
  onReject,
}) => {
  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const statusStyles = {
    PENDIENTE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    APROBADA: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    RECHAZADA: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4">Empleado</th>
            <th className="py-3.5 px-4">Fecha</th>
            <th className="py-3.5 px-4">Franja Horaria</th>
            <th className="py-3.5 px-4">Total Horas Extras</th>
            <th className="py-3.5 px-4">Motivo / Justificación</th>
            <th className="py-3.5 px-4">Estado</th>
            {canApprove && <th className="py-3.5 px-4 text-right">Aprobación</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {records.map((r) => {
            const emp = empMap.get(r.employee_id);
            return (
              <tr key={r.overtime_id} className="hover:bg-slate-800/40 transition-colors">
                {/* Empleado */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={emp?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={emp?.nombres}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-slate-200">
                        {emp ? `${emp.nombres} ${emp.apellidos}` : r.solicitado_por}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">{emp?.employee_code}</p>
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td className="py-3 px-4 font-mono text-slate-300">{r.fecha}</td>

                {/* Franja */}
                <td className="py-3 px-4">
                  <span className="font-mono text-slate-200">
                    {r.hora_inicio} → {r.hora_fin}
                  </span>
                </td>

                {/* Horas extras */}
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/30 px-2 py-0.5 rounded-md">
                    {r.horas_formato}
                  </span>
                </td>

                {/* Motivo */}
                <td className="py-3 px-4 text-slate-300 max-w-xs truncate text-[11px]">
                  {r.motivo}
                </td>

                {/* Estado */}
                <td className="py-3 px-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[r.estado]}`}>
                    {r.estado}
                  </span>
                  {r.aprobado_por && (
                    <span className="text-[10px] text-slate-400 block mt-0.5">Por: {r.aprobado_por}</span>
                  )}
                </td>

                {/* Aprobación */}
                {canApprove && (
                  <td className="py-3 px-4 text-right">
                    {r.estado === 'PENDIENTE' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onApprove(r)}
                          title="Aprobar horas extras"
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onReject(r)}
                          title="Rechazar horas extras"
                          className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Procesado</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
