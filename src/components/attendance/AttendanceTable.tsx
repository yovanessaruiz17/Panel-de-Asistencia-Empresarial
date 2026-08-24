import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  UserCheck,
} from 'lucide-react';
import { DailyAttendance, Employee } from '../../types';
import { maskCedula } from '../../utils/formatters';
import { AttendanceStatusBadge } from '../common/AttendanceStatusBadge';
import { EmptyState } from '../common/EmptyState';
import { SearchInput } from '../common/SearchInput';

interface AttendanceTableProps {
  records: DailyAttendance[];
  employees: Employee[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  onExportCSV?: () => void;
}

export const AttendanceTable: React.FC<AttendanceTableProps> = ({
  records,
  employees,
  selectedDate,
  onDateChange,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const departments = Array.from(new Set(employees.map((e) => e.departamento))).filter(Boolean);

  const filteredRecords = records.filter((r) => {
    const emp = empMap.get(r.employee_id);
    const fullName = emp ? `${emp.nombres} ${emp.apellidos}`.toLowerCase() : '';
    const code = emp ? emp.employee_code.toLowerCase() : '';
    const cedula = emp ? emp.cedula : '';

    const matchesSearch =
      !searchTerm ||
      fullName.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase()) ||
      cedula.includes(searchTerm);

    const matchesStatus = statusFilter === 'ALL' || r.estado === statusFilter;
    const matchesDept = deptFilter === 'ALL' || emp?.departamento === deptFilter;

    return matchesSearch && matchesStatus && matchesDept;
  });

  return (
    <div className="space-y-4">
      {/* Control Bar: Filters & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Date Picker */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <Calendar className="w-4 h-4 text-sky-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-slate-100 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Search Input */}
          <div className="min-w-[200px] flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por nombre, código o cédula..."
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PUNTUAL">Puntual</option>
            <option value="LLEGADA_TEMPRANA">Llegada Temprana</option>
            <option value="LLEGADA_TARDE">Llegada Tarde</option>
            <option value="SALIDA_TEMPRANA">Salida Temprana</option>
            <option value="HORAS_EXTRA">Horas Extras</option>
            <option value="AUSENTE">Ausente</option>
            <option value="VACACIONES">Vacaciones</option>
          </select>

          {/* Dept Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todos los Departamentos</option>
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {onExportCSV && (
          <button
            onClick={onExportCSV}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Exportar CSV</span>
          </button>
        )}
      </div>

      {/* Records Table */}
      {filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900">
          <EmptyState
            title="No se encontraron registros"
            description="No hay asistencias registradas que coincidan con la fecha o filtros seleccionados."
          />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Empleado</th>
                <th className="py-3.5 px-4">Entrada Real</th>
                <th className="py-3.5 px-4">Salida Real</th>
                <th className="py-3.5 px-4">Horas Trabajadas</th>
                <th className="py-3.5 px-4">Horas Extras</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4">Observación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredRecords.map((rec) => {
                const emp = empMap.get(rec.employee_id);
                return (
                  <tr key={rec.asistencia_id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Empleado */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={emp?.nombres}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-200">
                            {emp ? `${emp.nombres} ${emp.apellidos}` : 'Desconocido'}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span className="font-mono text-sky-400">{emp?.employee_code}</span>
                            <span>•</span>
                            <span>{emp?.departamento}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Entrada Real */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-mono font-bold text-slate-200">
                          {rec.hora_entrada_real || '--:--'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Prog: {rec.hora_entrada_programada}
                      </span>
                    </td>

                    {/* Salida Real */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-mono font-bold text-slate-200">
                          {rec.hora_salida_real || '--:--'}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        Prog: {rec.hora_salida_programada}
                      </span>
                    </td>

                    {/* Horas Trabajadas */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-slate-200 px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {rec.horas_trabajadas || '--'}
                      </span>
                    </td>

                    {/* Horas Extras */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono text-xs font-bold ${
                          rec.minutos_extra > 0 || (rec.horas_extra && rec.horas_extra !== '0h 0m')
                            ? 'text-purple-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {rec.horas_extra || '0h 0m'}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="py-3.5 px-4">
                      <AttendanceStatusBadge status={rec.estado} size="sm" />
                    </td>

                    {/* Observación */}
                    <td className="py-3.5 px-4 text-slate-400 max-w-[200px] truncate text-[11px]">
                      {rec.observacion || 'Sin observaciones'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
