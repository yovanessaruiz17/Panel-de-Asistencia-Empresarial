import React, { useEffect, useState } from 'react';
import { Calendar, List, Plus } from 'lucide-react';
import { AttendanceCalendar } from '../components/attendance/AttendanceCalendar';
import { AttendanceTable } from '../components/attendance/AttendanceTable';
import { LoadingState } from '../components/common/LoadingState';
import { useApp } from '../contexts/AppContext';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { reportService } from '../services/reportService';
import { DailyAttendance, Employee } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

export const AttendancePage: React.FC = () => {
  const { showToast } = useApp();
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [records, setRecords] = useState<DailyAttendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      const [empList, attList] = await Promise.all([
        employeeService.getAll(),
        attendanceService.getDaily(selectedDate),
      ]);
      setEmployees(empList);
      setRecords(attList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  const handleExportCSV = () => {
    const csv = reportService.generateAttendanceCSV(records, employees);
    reportService.downloadCSV(csv, `yordev_asistencia_${selectedDate}.csv`);
    showToast({
      type: 'success',
      title: 'Reporte generado',
      message: 'Archivo CSV descargado con éxito.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">Centro de Asistencia</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoreo en tiempo real de entradas, salidas, puntualidad y estados de jornada.
          </p>
        </div>

        {/* View Toggle Button */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'table' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Tabla de Asistencia</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'calendar' ? 'bg-sky-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Vista Calendario</span>
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Cargando registros de asistencia..." />
      ) : viewMode === 'table' ? (
        <AttendanceTable
          records={records}
          employees={employees}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          onExportCSV={handleExportCSV}
        />
      ) : (
        <AttendanceCalendar records={records} />
      )}
    </div>
  );
};
