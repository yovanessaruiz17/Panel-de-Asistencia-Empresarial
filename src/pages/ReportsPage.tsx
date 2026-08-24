import React, { useEffect, useState } from 'react';
import { Calendar, Download, FileSpreadsheet, Filter } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { useApp } from '../contexts/AppContext';
import { attendanceService } from '../services/attendanceService';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService';
import { overtimeService } from '../services/overtimeService';
import { reportService } from '../services/reportService';
import { DailyAttendance, Department, Employee, OvertimeRecord } from '../types';
import { getTodayDateString } from '../utils/dateUtils';

export const ReportsPage: React.FC = () => {
  const { showToast } = useApp();
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState(getTodayDateString());
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [reportType, setReportType] = useState<'attendance' | 'overtime'>('attendance');

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [attendance, setAttendance] = useState<DailyAttendance[]>([]);
  const [overtime, setOvertime] = useState<OvertimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      employeeService.getAll(),
      departmentService.getAll(),
      attendanceService.getDaily(getTodayDateString()),
      overtimeService.getAll(),
    ]).then(([empList, deptList, attList, ovtList]) => {
      setEmployees(empList);
      setDepartments(deptList);
      setAttendance(attList);
      setOvertime(ovtList);
      setLoading(false);
    });
  }, []);

  const handleExport = () => {
    let filteredEmployees = employees;
    if (selectedDept !== 'ALL') {
      filteredEmployees = employees.filter((e) => e.departamento === selectedDept);
    }

    if (reportType === 'attendance') {
      const csv = reportService.generateAttendanceCSV(attendance, filteredEmployees);
      reportService.downloadCSV(csv, `yordev_reporte_asistencia_${startDate}_a_${endDate}.csv`);
    } else {
      const csv = reportService.generateOvertimeCSV(overtime, filteredEmployees);
      reportService.downloadCSV(csv, `yordev_reporte_horas_extras_${startDate}_a_${endDate}.csv`);
    }

    showToast({
      type: 'success',
      title: 'Reporte descargado',
      message: `El archivo CSV fue exportado exitosamente.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-white tracking-tight">Centro de Reportes & Exportación</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Generación y descarga de sábanas de asistencia, horas extras y novedades en formato tabular CSV / Excel.
        </p>
      </div>

      {loading ? (
        <LoadingState message="Cargando generador de reportes..." />
      ) : (
        <div className="max-w-2xl p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-sky-400" /> Parámetros del Reporte
            </h3>

            {/* Report Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tipo de Reporte</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReportType('attendance')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                    reportType === 'attendance'
                      ? 'bg-sky-500/10 border-sky-500/40 text-sky-300 ring-1 ring-sky-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Asistencia Diaria & Mensual
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('overtime')}
                  className={`p-3 rounded-2xl border text-xs font-bold transition-all text-left ${
                    reportType === 'overtime'
                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-300 ring-1 ring-purple-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Horas Extras & Liquidación
                </button>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Inicial</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha Final</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Filtrar por Departamento</label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="ALL">Todos los Departamentos (Toda la Empresa)</option>
                {departments.map((d) => (
                  <option key={d.department_id} value={d.nombre}>
                    {d.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-500 shadow-lg shadow-sky-900/30 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Generar y Descargar CSV</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
