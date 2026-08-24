import React, { useState } from 'react';
import { Branch, Department, Employee, EmployeeStatus, Schedule } from '../../types';
import { Modal } from '../common/Modal';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  employee?: Employee | null;
  departments: Department[];
  branches: Branch[];
  schedules: Schedule[];
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employee,
  departments,
  branches,
  schedules,
}) => {
  const [nombres, setNombres] = useState(employee?.nombres || '');
  const [apellidos, setApellidos] = useState(employee?.apellidos || '');
  const [cedula, setCedula] = useState(employee?.cedula || '');
  const [email, setEmail] = useState(employee?.email || '');
  const [telefono, setTelefono] = useState(employee?.telefono || '');
  const [cargo, setCargo] = useState(employee?.cargo || '');
  const [departamento, setDepartamento] = useState(employee?.departamento || departments[0]?.nombre || '');
  const [sede, setSede] = useState(employee?.sede || branches[0]?.nombre || '');
  const [horarioId, setHorarioId] = useState(employee?.horario_id || schedules[0]?.horario_id || '');
  const [estado, setEstado] = useState<EmployeeStatus>(employee?.estado || 'ACTIVO');
  const [fotoUrl, setFotoUrl] = useState(employee?.foto_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres || !apellidos || !cedula || !email || !cargo) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSave({
        nombres,
        apellidos,
        cedula: cedula.replace(/\D/g, ''),
        email,
        telefono,
        cargo,
        departamento,
        sede,
        horario_id: horarioId,
        estado,
        foto_url: fotoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        fecha_ingreso: employee?.fecha_ingreso || new Date().toISOString().split('T')[0],
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al guardar el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={employee ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
      subtitle="Ingresa la información institucional y laboral del colaborador."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombres *</label>
            <input
              type="text"
              required
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Juan Carlos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Apellidos *</label>
            <input
              type="text"
              required
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Pérez Gómez"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cédula de Ciudadanía *</label>
            <input
              type="text"
              required
              value={cedula}
              onChange={(e) => setCedula(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
              placeholder="Ej. 1020304050"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="nombre@yordev.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="+57 300 000 0000"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Cargo *</label>
            <input
              type="text"
              required
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Ingeniero de Software"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Departamento</label>
            <select
              value={departamento}
              onChange={(e) => setDepartamento(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {departments.map((d) => (
                <option key={d.department_id} value={d.nombre}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Sede</label>
            <select
              value={sede}
              onChange={(e) => setSede(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {branches.map((b) => (
                <option key={b.sede_id} value={b.nombre}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Horario Asignado</label>
            <select
              value={horarioId}
              onChange={(e) => setHorarioId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {schedules.map((s) => (
                <option key={s.horario_id} value={s.horario_id}>
                  {s.nombre} ({s.hora_entrada} - {s.hora_salida})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value as EmployeeStatus)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ACTIVO">ACTIVO</option>
              <option value="INACTIVO">INACTIVO</option>
              <option value="VACACIONES">VACACIONES</option>
              <option value="SUSPENDIDO">SUSPENDIDO</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Foto de Perfil</label>
          <input
            type="url"
            value={fotoUrl}
            onChange={(e) => setFotoUrl(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            placeholder="https://images.unsplash.com/..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 rounded-xl shadow-lg shadow-sky-900/30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Guardando...' : employee ? 'Actualizar Colaborador' : 'Crear Colaborador'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
