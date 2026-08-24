import React, { useEffect, useState } from 'react';
import { Download, FileText, Filter, ShieldCheck } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { SearchInput } from '../components/common/SearchInput';
import { auditService } from '../services/auditService';
import { AuditLog } from '../types';

export const AuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    auditService.getAll().then((list) => {
      setLogs(list);
      setLoading(false);
    });
  }, []);

  const filteredLogs = logs.filter((log) => {
    return (
      !searchTerm ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.modulo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Auditoría Inmutable & Logs</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Trazabilidad completa de acciones, cambios de estado y registros de marcación en el sistema.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="min-w-[240px] flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Filtrar por acción, usuario o módulo..."
          />
        </div>
      </div>

      {loading ? (
        <LoadingState message="Cargando registro de auditoría..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Fecha y Hora</th>
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Módulo</th>
                <th className="py-3.5 px-4">Acción Realizada</th>
                <th className="py-3.5 px-4">Detalle / Payload</th>
                <th className="py-3.5 px-4">Dirección IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.audit_id} className="hover:bg-slate-800/40 font-mono">
                  <td className="py-3 px-4 text-slate-300">{log.timestamp}</td>
                  <td className="py-3 px-4 text-sky-400 font-bold">{log.usuario}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                      {log.modulo}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200">{log.accion}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans max-w-xs truncate text-[11px]">
                    {log.detalle}
                  </td>
                  <td className="py-3 px-4 text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
