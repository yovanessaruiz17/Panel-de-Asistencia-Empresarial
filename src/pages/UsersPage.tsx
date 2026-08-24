import React, { useEffect, useState } from 'react';
import { Plus, Shield, User, UserCheck } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { Modal } from '../components/common/Modal';
import { useApp } from '../contexts/AppContext';
import { userService } from '../services/userService';
import { UserRole, UserSession } from '../types';

export const UsersPage: React.FC = () => {
  const { showToast } = useApp();
  const [users, setUsers] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<UserRole>('HR');

  const loadData = async () => {
    try {
      setLoading(true);
      const list = await userService.getAll();
      setUsers(list);
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
    if (!nombre || !email) return;

    await userService.create({
      nombre,
      email,
      rol,
      estado: 'ACTIVO',
    });

    showToast({ type: 'success', title: 'Usuario creado', message: 'Acceso al sistema concedido.' });
    setIsModalOpen(false);
    setNombre('');
    setEmail('');
    loadData();
  };

  const roleStyles: Record<UserRole, string> = {
    SUPER_ADMIN: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    HR: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    BOSS: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    EMPLOYEE: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Usuarios & Permisos (RBAC)</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Control de cuentas administrativas, roles y privilegios en el sistema.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Cargando usuarios..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Usuario</th>
                <th className="py-3.5 px-4">Correo Electrónico</th>
                <th className="py-3.5 px-4">Rol Asignado</th>
                <th className="py-3.5 px-4">ID de Usuario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {users.map((u) => (
                <tr key={u.user_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sky-400">
                        {u.nombre.charAt(0)}
                      </div>
                      <span className="font-bold text-slate-200">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleStyles[u.rol]}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500">{u.user_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Usuario"
        subtitle="Asigna un rol y credenciales de acceso."
        maxWidth="md"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              placeholder="Ej. Andrés Morales"
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
              placeholder="correo@yordev.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Rol en el Sistema *</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as UserRole)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN (Acceso Total)</option>
              <option value="HR">HR (Talento Humano)</option>
              <option value="BOSS">BOSS (Jefe de Área)</option>
              <option value="EMPLOYEE">EMPLOYEE (Colaborador)</option>
            </select>
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
              Crear Usuario
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
