import React from 'react';
import {
  Calendar,
  CheckCircle,
  Eye,
  MoreVertical,
  Pencil,
  QrCode,
  ShieldAlert,
  UserMinus,
} from 'lucide-react';
import { Employee, Schedule } from '../../types';
import { maskCedula } from '../../utils/formatters';

interface EmployeeTableProps {
  employees: Employee[];
  schedules: Schedule[];
  onView: (emp: Employee) => void;
  onEdit: (emp: Employee) => void;
  onDeactivate: (emp: Employee) => void;
  onShowQR: (emp: Employee) => void;
  onAssignSchedule: (emp: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  schedules,
  onView,
  onEdit,
  onDeactivate,
  onShowQR,
  onAssignSchedule,
}) => {
  const scheduleMap = new Map(schedules.map((s) => [s.horario_id, s.nombre]));

  const statusStyles: Record<string, string> = {
    ACTIVO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    INACTIVO: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    VACACIONES: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    SUSPENDIDO: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <th className="py-3.5 px-4">Empleado</th>
            <th className="py-3.5 px-4">Código / Cédula</th>
            <th className="py-3.5 px-4">Cargo & Departamento</th>
            <th className="py-3.5 px-4">Sede</th>
            <th className="py-3.5 px-4">Horario Asignado</th>
            <th className="py-3.5 px-4">Estado</th>
            <th className="py-3.5 px-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 text-xs">
          {employees.map((emp) => (
            <tr key={emp.employee_id} className="hover:bg-slate-800/40 transition-colors group">
              {/* Empleado con Foto */}
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={emp.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={emp.nombres}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {emp.nombres} {emp.apellidos}
                    </p>
                    <p className="text-[11px] text-slate-400">{emp.email}</p>
                  </div>
                </div>
              </td>

              {/* Código & Cédula Protegida */}
              <td className="py-3 px-4">
                <span className="font-mono font-bold text-sky-400 block">{emp.employee_code}</span>
                <span className="text-[11px] text-slate-400 font-mono">C.C. {maskCedula(emp.cedula)}</span>
              </td>

              {/* Cargo & Departamento */}
              <td className="py-3 px-4">
                <p className="font-medium text-slate-200">{emp.cargo}</p>
                <p className="text-[11px] text-slate-400">{emp.departamento}</p>
              </td>

              {/* Sede */}
              <td className="py-3 px-4 text-slate-300">{emp.sede}</td>

              {/* Horario */}
              <td className="py-3 px-4">
                <span className="text-slate-300 font-medium block truncate max-w-[180px]">
                  {scheduleMap.get(emp.horario_id) || 'Sin asignar'}
                </span>
              </td>

              {/* Estado */}
              <td className="py-3 px-4">
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[emp.estado] || statusStyles.ACTIVO}`}>
                  {emp.estado}
                </span>
              </td>

              {/* Acciones */}
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onView(emp)}
                    title="Ver perfil completo"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onShowQR(emp)}
                    title="Ver Carnet & QR"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 hover:bg-slate-800 transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onAssignSchedule(emp)}
                    title="Asignar horario"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(emp)}
                    title="Editar empleado"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {emp.estado === 'ACTIVO' && (
                    <button
                      onClick={() => onDeactivate(emp)}
                      title="Desactivar empleado"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    >
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
