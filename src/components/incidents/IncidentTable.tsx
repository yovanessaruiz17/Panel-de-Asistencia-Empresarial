import React, { useState } from 'react';
import { AlertCircle, Calendar, Check, ExternalLink, FileText, Filter, ShieldCheck, X } from 'lucide-react';
import { Employee, Incident } from '../../types';

interface IncidentTableProps {
  incidents: Incident[];
  employees: Employee[];
  canApprove?: boolean;
  onApprove?: (incident: Incident) => void;
  onReject?: (incident: Incident) => void;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({
  incidents,
  employees,
  canApprove = false,
  onApprove,
  onReject,
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const empMap = new Map<string, Employee>(employees.map((e) => [e.employee_id, e]));

  const typeLabels: Record<string, { label: string; color: string }> = {
    PERMISO: { label: 'Permiso Laboral', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    INCAPACIDAD: { label: 'Incapacidad Médica (EPS)', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    LICENCIA: { label: 'Licencia', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
    AUSENCIA_JUSTIFICADA: { label: 'Ausencia Justificada', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
    AUSENCIA_NO_JUSTIFICADA: { label: 'Inasistencia Injustificada', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
    CALAMIDAD: { label: 'Calamidad Doméstica', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
    DIA_COMPENSATORIO: { label: 'Día Compensatorio', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
    TRABAJO_REMOTO: { label: 'Trabajo Remoto', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    VACACIONES: { label: 'Vacaciones', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    ERROR_MARCACION: { label: 'Corrección Marcación', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' },
    JORNADA_ESPECIAL: { label: 'Jornada Especial', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    OTRO: { label: 'Otra Novedad', color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' },
  };

  const statusStyles = {
    PENDIENTE: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    APROBADO: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    RECHAZADO: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const filteredIncidents = incidents.filter((inc) => {
    const emp = empMap.get(inc.employee_id);
    const empName = emp ? `${emp.nombres} ${emp.apellidos} ${emp.employee_code} ${emp.cedula}`.toLowerCase() : '';
    const desc = (inc.descripcion || '').toLowerCase();
    const matchesSearch = !searchTerm || empName.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || inc.tipo === filterType;
    const matchesStatus = filterStatus === 'ALL' || inc.estado === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por colaborador, código o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todos los Tipos</option>
            <option value="PERMISO">Permisos</option>
            <option value="INCAPACIDAD">Incapacidades</option>
            <option value="LICENCIA">Licencias</option>
            <option value="AUSENCIA_JUSTIFICADA">Ausencias Justificadas</option>
            <option value="CALAMIDAD">Calamidades</option>
            <option value="TRABAJO_REMOTO">Trabajo Remoto</option>
            <option value="VACACIONES">Vacaciones</option>
            <option value="ERROR_MARCACION">Marcación</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="APROBADO">Aprobados</option>
            <option value="RECHAZADO">Rechazados</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3.5 px-4">Empleado</th>
              <th className="py-3.5 px-4">Tipo de Novedad</th>
              <th className="py-3.5 px-4">Vigencia (Inicio - Fin)</th>
              <th className="py-3.5 px-4">Justificación / Motivo</th>
              <th className="py-3.5 px-4">Soporte / Excusa</th>
              <th className="py-3.5 px-4">Estado</th>
              {canApprove && <th className="py-3.5 px-4 text-right">Acción</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={canApprove ? 7 : 6} className="py-8 text-center text-slate-500 text-xs">
                  No se encontraron novedades registradas con los filtros actuales.
                </td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => {
                const emp = empMap.get(inc.employee_id);
                const typeInfo = typeLabels[inc.tipo] || typeLabels.OTRO;
                const soporteUrl = inc.documento_soporte || inc.documento_soporte_url;

                return (
                  <tr key={inc.incident_id} className="hover:bg-slate-800/40 transition-colors">
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
                            {emp ? `${emp.nombres} ${emp.apellidos}` : 'Empleado'}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">{emp?.employee_code}</p>
                        </div>
                      </div>
                    </td>

                    {/* Tipo */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeInfo.color}`}>
                        {typeInfo.label}
                      </span>
                    </td>

                    {/* Fechas */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>{inc.fecha_inicio}</span>
                        {inc.fecha_fin !== inc.fecha_inicio && (
                          <span className="text-slate-500">→ {inc.fecha_fin}</span>
                        )}
                      </div>
                    </td>

                    {/* Descripción */}
                    <td className="py-3 px-4 text-slate-300 max-w-xs text-[11px]">
                      <p className="line-clamp-2">{inc.descripcion}</p>
                    </td>

                    {/* Soporte / Excusa Médica */}
                    <td className="py-3 px-4">
                      {soporteUrl ? (
                        <a
                          href={soporteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border border-sky-500/30 text-[11px] font-medium transition-colors"
                          title={soporteUrl}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Soporte</span>
                          <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Sin soporte adjunto</span>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusStyles[inc.estado]}`}>
                        {inc.estado}
                      </span>
                      {inc.aprobado_por && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">Por: {inc.aprobado_por}</span>
                      )}
                    </td>

                    {/* Acciones */}
                    {canApprove && (
                      <td className="py-3 px-4 text-right">
                        {inc.estado === 'PENDIENTE' && onApprove && onReject ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onApprove(inc)}
                              title="Aprobar novedad"
                              className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onReject(inc)}
                              title="Rechazar novedad"
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 border border-rose-500/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">Gestionado</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
