import React, { useEffect, useState } from 'react';
import { Clock, Plus } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { ScheduleCard } from '../components/schedules/ScheduleCard';
import { ScheduleFormModal } from '../components/schedules/ScheduleFormModal';
import { useApp } from '../contexts/AppContext';
import { employeeService } from '../services/employeeService';
import { scheduleService } from '../services/scheduleService';
import { Employee, Schedule } from '../types';

export const SchedulesPage: React.FC = () => {
  const { showToast } = useApp();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schList, empList] = await Promise.all([
        scheduleService.getAll(),
        employeeService.getAll(),
      ]);
      setSchedules(schList);
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

  const handleSave = async (data: any) => {
    if (selectedSchedule) {
      await scheduleService.update(selectedSchedule.horario_id, data);
      showToast({ type: 'success', title: 'Horario actualizado', message: 'Los turnos fueron modificados.' });
    } else {
      await scheduleService.create(data);
      showToast({ type: 'success', title: 'Horario creado', message: 'Nuevo turno laboral registrado.' });
    }
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Horarios & Turnos</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configuración de jornadas laborales, márgenes de tolerancia de entrada/salida y horas extras.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedSchedule(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Horario</span>
        </button>
      </div>

      {loading ? (
        <LoadingState message="Cargando horarios laborales..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {schedules.map((sch) => {
            const count = employees.filter((e) => e.horario_id === sch.horario_id).length;
            return (
              <ScheduleCard
                key={sch.horario_id}
                schedule={sch}
                assignedCount={count}
                onEdit={(s) => {
                  setSelectedSchedule(s);
                  setIsModalOpen(true);
                }}
              />
            );
          })}
        </div>
      )}

      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        schedule={selectedSchedule}
      />
    </div>
  );
};
