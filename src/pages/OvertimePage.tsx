import React, { useEffect, useState } from 'react';
import { Activity, CheckCircle, Clock, Plus } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { OvertimeTable } from '../components/overtime/OvertimeTable';
import { useApp } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { employeeService } from '../services/employeeService';
import { overtimeService } from '../services/overtimeService';
import { Employee, OvertimeRecord } from '../types';

export const OvertimePage: React.FC = () => {
  const { showToast } = useApp();
  const { currentRole, currentUser } = useAuth();
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const canApprove = currentRole === 'SUPER_ADMIN' || currentRole === 'HR' || currentRole === 'BOSS';

  const loadData = async () => {
    try {
      setLoading(true);
      const [ovtList, empList] = await Promise.all([
        overtimeService.getAll(),
        employeeService.getAll(),
      ]);
      setRecords(ovtList);
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

  const handleApprove = async (record: OvertimeRecord) => {
    await overtimeService.approve(record.overtime_id, currentUser?.nombre || 'Jefe de Área');
    showToast({ type: 'success', title: 'Horas extras aprobadas', message: 'El registro ha sido marcado como APROBADA.' });
    loadData();
  };

  const handleReject = async (record: OvertimeRecord) => {
    await overtimeService.reject(record.overtime_id, currentUser?.nombre || 'Jefe de Área');
    showToast({ type: 'info', title: 'Horas extras rechazadas', message: 'El registro ha sido marcado como RECHAZADA.' });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Gestión de Horas Extras</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Autorización, control y liquidación de tiempo suplementario y recargos laborales.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Cargando solicitudes de horas extras..." />
      ) : (
        <OvertimeTable
          records={records}
          employees={employees}
          canApprove={canApprove}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
};
