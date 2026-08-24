import React, { useEffect, useState } from 'react';
import { Building2, Plus, Users } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import { useApp } from '../contexts/AppContext';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService';
import { Department, Employee } from '../types';

export const DepartmentsPage: React.FC = () => {
  const { showToast } = useApp();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [jefe, setJefe] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [deptList, empList] = await Promise.all([
        departmentService.getAll(),
        employeeService.getAll(),
      ]);
      setDepartments(deptList);
      setEmployees(empList);
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
    if (!nombre) return;

    await departmentService.create({
      nombre,
      jefe_departamento: jefe || 'Sin asignar',
      total_empleados: 0,
      estado: 'ACTIVO',
    });

    showToast({ type: 'success', title: 'Departamento creado', message: 'Área registrada correctamente.' });
    setIsModalOpen(false);
    setNombre('');
    setJefe('');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Departamentos & Áreas</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Estructura organizacional, jefaturas y distribución de colaboradores.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Departamento</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Cargando departamentos..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {departments.map((dept) => {
            const count = employees.filter((e) => e.departamento === dept.nombre).length;
            return (
              <div
                key={dept.department_id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{dept.nombre}</h4>
                      <p className="text-xs text-slate-400">Jefe: {dept.jefe_departamento}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{count} colaboradores</span>
                  </div>
                  <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                    Activo
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Departamento"
        subtitle="Registra una nueva área corporativa."
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Departamento *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Logística & Envíos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Jefe / Líder de Área</label>
            <input
              type="text"
              value={jefe}
              onChange={(e) => setJefe(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Nombre del responsable..."
            />
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
              Guardar Departamento
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
