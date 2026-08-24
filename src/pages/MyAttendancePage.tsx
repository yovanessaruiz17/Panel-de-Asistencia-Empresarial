import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Fingerprint,
  QrCode,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { AttendanceStatusBadge } from '../components/common/AttendanceStatusBadge';
import { LoadingState } from '../components/common/LoadingState';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { scheduleService } from '../services/scheduleService';
import { DailyAttendance, Employee, Schedule } from '../types';
import { getTodayDateString } from '../utils/dateUtils';
import { maskCedula } from '../utils/formatters';

interface MyAttendancePageProps {
  onNavigate: (path: string) => void;
}

export const MyAttendancePage: React.FC<MyAttendancePageProps> = ({ onNavigate }) => {
  const { currentUser } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [todayRecord, setTodayRecord] = useState<DailyAttendance | null>(null);
  const [monthlyRecords, setMonthlyRecords] = useState<DailyAttendance[]>([]);
  const [loading, setLoading] = useState(true);

  const today = getTodayDateString();

  useEffect(() => {
    const loadMyData = async () => {
      try {
        setLoading(true);
        const empId = currentUser?.employee_id || 'emp-001';
        const [emp, schList, dailyRecords] = await Promise.all([
          employeeService.getById(empId),
          scheduleService.getAll(),
          attendanceService.getDaily(today),
        ]);

        if (emp) {
          setEmployee(emp);
          const sch = schList.find((s) => s.horario_id === emp.horario_id) || null;
          setSchedule(sch);
        }

        const myToday = dailyRecords.find((r) => r.employee_id === empId) || null;
        setTodayRecord(myToday);
        setMonthlyRecords(dailyRecords.filter((r) => r.employee_id === empId));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadMyData();
  }, [currentUser, today]);

  if (loading) {
    return <LoadingState message="Cargando mi portal de colaborador..." />;
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={employee?.foto_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
          alt={employee?.nombres}
          className="w-20 h-20 rounded-2xl object-cover ring-2 ring-sky-500/40 shadow-lg shrink-0"
        />
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-white">
              {employee?.nombres} {employee?.apellidos}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {employee?.estado}
            </span>
          </div>

          <p className="text-xs text-sky-400 font-semibold mb-2">{employee?.cargo}</p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400 font-mono">
            <span>CÓD: {employee?.employee_code}</span>
            <span>•</span>
            <span>C.C. {maskCedula(employee?.cedula || '')}</span>
            <span>•</span>
            <span>{employee?.departamento}</span>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/marcar')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors shrink-0"
        >
          <Fingerprint className="w-4 h-4" />
          <span>Registrar Marcación</span>
        </button>
      </div>

      {/* Today's Punch Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> Marcación de Entrada Hoy
          </span>
          <p className="text-2xl font-extrabold font-mono text-emerald-400">
            {todayRecord?.hora_entrada_real || 'No Registrada'}
          </p>
          <p className="text-[11px] text-slate-400">
            Horario programado: {todayRecord?.hora_entrada_programada || schedule?.hora_entrada || '08:00'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" /> Marcación de Salida Hoy
          </span>
          <p className="text-2xl font-extrabold font-mono text-sky-400">
            {todayRecord?.hora_salida_real || 'No Registrada'}
          </p>
          <p className="text-[11px] text-slate-400">
            Horario programado: {todayRecord?.hora_salida_programada || schedule?.hora_salida || '17:00'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Estado de Jornada Hoy
          </span>
          <div className="pt-1">
            {todayRecord ? (
              <AttendanceStatusBadge status={todayRecord.estado} size="md" />
            ) : (
              <span className="text-xs text-slate-400 italic">Pendiente de registro</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Horas trabajadas: {todayRecord?.horas_trabajadas || '0h 0m'}
          </p>
        </div>
      </div>

      {/* Monthly Attendance History Calendar */}
      <AttendanceCalendar records={monthlyRecords} />
    </div>
  );
};
