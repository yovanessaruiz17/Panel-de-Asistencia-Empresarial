import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Fingerprint,
  Plus,
  Shield,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react';
import { AttendanceStatusBadge } from '../components/common/AttendanceStatusBadge';
import { LoadingState } from '../components/common/LoadingState';
import { AttendanceChart } from '../components/dashboard/AttendanceChart';
import { DepartmentDistributionChart } from '../components/dashboard/DepartmentDistributionChart';
import { StatCard } from '../components/dashboard/StatCard';
import { useAuth } from '../contexts/AuthContext';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { incidentService } from '../services/incidentService';
import { overtimeService } from '../services/overtimeService';
import { DailyAttendance, Employee, Incident, OvertimeRecord } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { currentRole, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<DailyAttendance[]>([]);
  const [overtimeList, setOvertimeList] = useState<OvertimeRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const today = getTodayDateString();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [empRes, attRes, ovtRes, incRes] = await Promise.all([
          employeeService.getAll(),
          attendanceService.getDaily(today),
          overtimeService.getAll(),
          incidentService.getAll(),
        ]);
        setEmployees(empRes);
        setTodayAttendance(attRes);
        setOvertimeList(ovtRes);
        setIncidents(incRes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [today]);

  if (loading) {
    return <LoadingState message="Cargando panel de control y métricas..." />;
  }

  // Calculate metrics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.estado === 'ACTIVO').length;

  const presentToday = todayAttendance.filter(
    (a) => a.estado === 'PUNTUAL' || a.estado === 'LLEGADA_TEMPRANA' || a.estado === 'LLEGADA_TARDE' || a.estado === 'HORAS_EXTRA' || a.estado === 'SALIDA_TEMPRANA'
  ).length;

  const lateToday = todayAttendance.filter((a) => a.estado === 'LLEGADA_TARDE').length;
  const earlyExitToday = todayAttendance.filter((a) => a.estado === 'SALIDA_TEMPRANA').length;
  const absentToday = todayAttendance.filter((a) => a.estado === 'AUSENTE').length;
  const pendingOvertime = overtimeList.filter((o) => o.estado === 'PENDIENTE').length;
  const pendingIncidents = incidents.filter((i) => i.estado === 'PENDIENTE').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
            {currentRole === 'SUPER_ADMIN'
              ? 'Super Administrador'
              : currentRole === 'HR'
              ? 'Gestión de Talento Humano'
              : 'Jefatura de Área'}
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            Bienvenido, {currentUser?.nombre || 'Administrador'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Resumen en tiempo real de operaciones, puntualidad y asistencia en YORDEV.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/marcar')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-colors"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Abrir Kiosco</span>
          </button>
          <button
            onClick={() => onNavigate('/empleados')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <Users className="w-4 h-4 text-sky-400" />
            <span>Ver Empleados</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Colaboradores Activos"
          value={activeEmployees}
          subtitle={`De ${totalEmployees} total registrados`}
          icon={Users}
          iconColor="text-sky-400"
          badge="100% Sincronizado"
          badgeType="info"
          onClick={() => onNavigate('/empleados')}
        />

        <StatCard
          title="Presentes Hoy"
          value={presentToday}
          subtitle={`${Math.round((presentToday / (activeEmployees || 1)) * 100)}% de asistencia`}
          icon={UserCheck}
          iconColor="text-emerald-400"
          badge="Puntuales & Temprano"
          badgeType="success"
          onClick={() => onNavigate('/asistencia')}
        />

        <StatCard
          title="Llegadas Tarde Hoy"
          value={lateToday}
          subtitle={lateToday > 0 ? 'Requiere seguimiento' : 'Sin retrasos hoy'}
          icon={Clock}
          iconColor="text-amber-400"
          badge={lateToday > 0 ? `${lateToday} Novedad` : 'Excelente'}
          badgeType={lateToday > 0 ? 'warning' : 'success'}
          onClick={() => onNavigate('/asistencia')}
        />

        <StatCard
          title="Horas Extras Pendientes"
          value={pendingOvertime}
          subtitle="Esperando aprobación"
          icon={Activity}
          iconColor="text-purple-400"
          badge={pendingOvertime > 0 ? 'Por Revisar' : 'Al Día'}
          badgeType={pendingOvertime > 0 ? 'warning' : 'info'}
          onClick={() => onNavigate('/horas-extras')}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Ausencias Hoy</span>
          <p className="text-xl font-extrabold text-rose-400 mt-1">{absentToday}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Salidas Tempranas</span>
          <p className="text-xl font-extrabold text-orange-400 mt-1">{earlyExitToday}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Incidencias Activas</span>
          <p className="text-xl font-extrabold text-yellow-400 mt-1">{incidents.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400">Tolerancia Global</span>
          <p className="text-xl font-extrabold text-slate-200 font-mono mt-1">10 min</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>
        <div>
          <DepartmentDistributionChart />
        </div>
      </div>

      {/* Recent Punches Quick Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Marcaciones Recientes de la Jornada</h4>
            <p className="text-xs text-slate-400">Estado de los colaboradores en tiempo real</p>
          </div>
          <button
            onClick={() => onNavigate('/asistencia')}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            Ver todas →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Empleado</th>
                <th className="py-2.5 px-3">Hora Entrada</th>
                <th className="py-2.5 px-3">Hora Salida</th>
                <th className="py-2.5 px-3">Estado</th>
                <th className="py-2.5 px-3">Horas Trabajadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {todayAttendance.slice(0, 5).map((att) => {
                const emp = employees.find((e) => e.employee_id === att.employee_id);
                return (
                  <tr key={att.asistencia_id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {emp ? `${emp.nombres} ${emp.apellidos}` : att.employee_id}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-emerald-400">
                      {att.hora_entrada_real || '--:--'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-sky-400">
                      {att.hora_salida_real || '--:--'}
                    </td>
                    <td className="py-2.5 px-3">
                      <AttendanceStatusBadge status={att.estado} size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-300">{att.horas_trabajadas}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
