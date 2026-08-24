import React, { useEffect, useState } from 'react';
import { AlertCircle, Plus } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import { IncidentTable } from '../components/incidents/IncidentTable';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { employeeService } from '../services/employeeService';
import { incidentService } from '../services/incidentService';
import { Employee, Incident, IncidentType } from '../types';

export const IncidentsPage: React.FC = () => {
  const { showToast } = useApp();
  const { currentRole, currentUser } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New incident form fields
  const [empId, setEmpId] = useState('');
  const [tipo, setTipo] = useState<IncidentType>('PERMISO');
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split('T')[0]);
  const [descripcion, setDescripcion] = useState('');
  const [documentoSoporte, setDocumentoSoporte] = useState('');

  const canApprove = currentRole === 'SUPER_ADMIN' || currentRole === 'HR' || currentRole === 'BOSS';

  const loadData = async () => {
    try {
      setLoading(true);
      const [incList, empList] = await Promise.all([
        incidentService.getAll(),
        employeeService.getAll(),
      ]);
      setIncidents(incList);
      setEmployees(empList);
      if (empList.length > 0 && !empId) {
        setEmpId(empList[0].employee_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empId || !descripcion) return;

    await incidentService.create({
      employee_id: empId,
      tipo,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      descripcion,
      documento_soporte: documentoSoporte.trim() || undefined,
      estado: 'PENDIENTE',
      creado_por: currentUser?.nombre || 'Administrador',
    });

    showToast({ type: 'success', title: 'Novedad registrada', message: 'La novedad / permiso ha sido registrado con éxito.' });
    setIsModalOpen(false);
    setDescripcion('');
    setDocumentoSoporte('');
    loadData();
  };

  const handleApprove = async (inc: Incident) => {
    await incidentService.approve(inc.incident_id, currentUser?.nombre || 'Talento Humano');
    showToast({ type: 'success', title: 'Incidencia aprobada', message: 'La solicitud quedó aprobada.' });
    loadData();
  };

  const handleReject = async (inc: Incident) => {
    await incidentService.reject(inc.incident_id, currentUser?.nombre || 'Talento Humano');
    showToast({ type: 'info', title: 'Incidencia rechazada', message: 'La solicitud quedó rechazada.' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Novedades & Incidencias</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro y control de permisos, ausencias justificadas, vacaciones y correcciones de marcación.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Reportar Novedad</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Cargando incidencias y novedades..." />
      ) : (
        <IncidentTable
          incidents={incidents}
          employees={employees}
          canApprove={canApprove}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* New Incident Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Nueva Incidencia o Permiso"
        subtitle="Ingresa el tipo de novedad y el periodo de vigencia."
        maxWidth="lg"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Empleado *</label>
            <select
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {employees.map((e) => (
                <option key={e.employee_id} value={e.employee_id}>
                  {e.nombres} {e.apellidos} ({e.employee_code}) - {e.cargo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Novedad / Permiso *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as IncidentType)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="PERMISO">Permiso Laboral / Personal</option>
              <option value="INCAPACIDAD">Incapacidad Médica / EPS</option>
              <option value="LICENCIA">Licencia (Maternidad / Paternidad / No Remunerada)</option>
              <option value="AUSENCIA_JUSTIFICADA">Ausencia Justificada / Cita Médica</option>
              <option value="AUSENCIA_NO_JUSTIFICADA">Ausencia No Justificada</option>
              <option value="CALAMIDAD">Calamidad Doméstica</option>
              <option value="DIA_COMPENSATORIO">Día Compensatorio</option>
              <option value="TRABAJO_REMOTO">Trabajo Remoto / Home Office</option>
              <option value="VACACIONES">Vacaciones</option>
              <option value="ERROR_MARCACION">Error de Marcación / Olvido</option>
              <option value="JORNADA_ESPECIAL">Jornada Especial</option>
              <option value="OTRO">Otro Motivo</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Inicio *</label>
              <input
                type="date"
                required
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Fin *</label>
              <input
                type="date"
                required
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Justificación o Motivo *</label>
            <textarea
              required
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Detalla el motivo de la ausencia, cita médica, calamidad o requerimiento..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Link de Documento de Evidencia / Excusa Médica
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Opcional</span>
            </div>
            <input
              type="url"
              value={documentoSoporte}
              onChange={(e) => setDocumentoSoporte(e.target.value)}
              placeholder="https://drive.google.com/... o enlace a soporte digital / PDF"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Puedes adjuntar el enlace a la incapacidad EPS, fórmula médica, citación o soporte digital. No es obligatorio para todos los permisos.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-900/30"
            >
              Guardar Incidencia
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
