import React, { useEffect, useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import { useApp } from '../contexts/AppContext';
import { branchService } from '../services/branchService';
import { employeeService } from '../services/employeeService';
import { Branch, Employee } from '../types';

export const BranchesPage: React.FC = () => {
  const { showToast } = useApp();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('Bogotá, D.C.');

  const loadData = async () => {
    try {
      setLoading(true);
      const [bList, empList] = await Promise.all([
        branchService.getAll(),
        employeeService.getAll(),
      ]);
      setBranches(bList);
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

    await branchService.create({
      nombre,
      direccion,
      ciudad,
      estado: 'ACTIVO',
    });

    showToast({ type: 'success', title: 'Sede creada', message: 'Sede física registrada correctamente.' });
    setIsModalOpen(false);
    setNombre('');
    setDireccion('');
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Sedes Físicas & Sucursales</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Puntos de operación y terminales de registro de acceso de la empresa.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Sede</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Cargando sedes..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {branches.map((b) => {
            const count = employees.filter((e) => e.sede === b.nombre).length;
            return (
              <div
                key={b.sede_id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{b.nombre}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{b.direccion}</p>
                      <p className="text-[11px] text-slate-500">{b.ciudad}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>{count} colaboradores</span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {b.estado}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Sede"
        subtitle="Registra una nueva sucursal u oficina."
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Sede *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Sede Norte - Cedritos"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Calle 140 # 11-20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Ciudad</label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
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
              Guardar Sede
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
