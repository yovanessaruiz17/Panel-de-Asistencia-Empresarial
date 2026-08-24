import React, { useEffect, useState } from 'react';
import { Plus, UserPlus, Users } from 'lucide-react';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { LoadingState } from '../components/common/LoadingState';
import { SearchInput } from '../components/common/SearchInput';
import { EmployeeDetailModal } from '../components/employees/EmployeeDetailModal';
import { EmployeeFormModal } from '../components/employees/EmployeeFormModal';
import { EmployeeTable } from '../components/employees/EmployeeTable';
import { useApp } from '../contexts/AppContext';
import { branchService } from '../services/branchService';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService';
import { scheduleService } from '../services/scheduleService';
import { Branch, Department, Employee, Schedule } from '../types';

export const EmployeesPage: React.FC = () => {
  const { showToast } = useApp();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [deactivateTarget, setDeactivateTarget] = useState<Employee | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [empList, deptList, branchList, schList] = await Promise.all([
        employeeService.getAll(),
        departmentService.getAll(),
        branchService.getAll(),
        scheduleService.getAll(),
      ]);
      setEmployees(empList);
      setDepartments(deptList);
      setBranches(branchList);
      setSchedules(schList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveEmployee = async (data: any) => {
    if (selectedEmp) {
      await employeeService.update(selectedEmp.employee_id, data);
      showToast({ type: 'success', title: 'Colaborador actualizado', message: 'Los datos fueron guardados.' });
    } else {
      await employeeService.create(data);
      showToast({ type: 'success', title: 'Colaborador creado', message: 'Se ha registrado el nuevo empleado y su QR único.' });
    }
    loadData();
  };

  const handleDeactivate = async () => {
    if (!deactivateTarget) return;
    await employeeService.deactivate(deactivateTarget.employee_id);
    showToast({ type: 'info', title: 'Colaborador desactivado', message: 'El estado cambió a INACTIVO.' });
    setDeactivateTarget(null);
    loadData();
  };

  const handleRegenerateQR = async (id: string): Promise<string> => {
    const newToken = await employeeService.regenerateQR(id);
    showToast({ type: 'success', title: 'QR Regenerado', message: 'Nuevo token asignado correctamente.' });
    loadData();
    return newToken;
  };

  const filteredEmployees = employees.filter((emp) => {
    const fullName = `${emp.nombres} ${emp.apellidos}`.toLowerCase();
    const code = emp.employee_code.toLowerCase();
    const matchesSearch =
      !searchTerm || fullName.includes(searchTerm.toLowerCase()) || code.includes(searchTerm.toLowerCase()) || emp.cedula.includes(searchTerm);
    const matchesDept = selectedDept === 'ALL' || emp.departamento === selectedDept;
    const matchesStatus = selectedStatus === 'ALL' || emp.estado === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Directorio de Colaboradores</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión institucional de empleados, carnets, credenciales QR y horarios de trabajo.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedEmp(null);
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Colaborador</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="min-w-[220px] flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Buscar por nombre, código o cédula..."
          />
        </div>

        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">Todos los Departamentos</option>
          {departments.map((d) => (
            <option key={d.department_id} value={d.nombre}>
              {d.nombre}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-sky-500"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="ACTIVO">ACTIVO</option>
          <option value="INACTIVO">INACTIVO</option>
          <option value="VACACIONES">VACACIONES</option>
          <option value="SUSPENDIDO">SUSPENDIDO</option>
        </select>
      </div>

      {loading ? (
        <LoadingState message="Cargando directorio de colaboradores..." />
      ) : (
        <EmployeeTable
          employees={filteredEmployees}
          schedules={schedules}
          onView={(emp) => {
            setSelectedEmp(emp);
            setIsDetailOpen(true);
          }}
          onEdit={(emp) => {
            setSelectedEmp(emp);
            setIsFormOpen(true);
          }}
          onShowQR={(emp) => {
            setSelectedEmp(emp);
            setIsDetailOpen(true);
          }}
          onAssignSchedule={(emp) => {
            setSelectedEmp(emp);
            setIsFormOpen(true);
          }}
          onDeactivate={(emp) => setDeactivateTarget(emp)}
        />
      )}

      {/* Form Modal */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveEmployee}
        employee={selectedEmp}
        departments={departments}
        branches={branches}
        schedules={schedules}
      />

      {/* Detail Modal */}
      <EmployeeDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        employee={selectedEmp}
        schedule={schedules.find((s) => s.horario_id === selectedEmp?.horario_id)}
        onRegenerateQR={handleRegenerateQR}
      />

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deactivateTarget}
        onClose={() => setDeactivateTarget(null)}
        onConfirm={handleDeactivate}
        title="¿Desactivar Colaborador?"
        message={`¿Estás seguro de desactivar a ${deactivateTarget?.nombres} ${deactivateTarget?.apellidos}? El colaborador no podrá registrar asistencia hasta que sea reactivado.`}
        confirmText="Desactivar"
        isDestructive
      />
    </div>
  );
};
