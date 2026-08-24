import { DailyAttendance, Employee, OvertimeRecord } from '../types';

export interface ReportFilter {
  startDate: string;
  endDate: string;
  department?: string;
  branch?: string;
  employeeId?: string;
  status?: string;
}

export const reportService = {
  generateAttendanceCSV(records: DailyAttendance[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));

    const headers = [
      'ID Asistencia',
      'Fecha',
      'Código Empleado',
      'Empleado',
      'Cédula',
      'Departamento',
      'Sede',
      'Horario Programado Entrada',
      'Horario Programado Salida',
      'Entrada Real',
      'Salida Real',
      'Minutos Tarde',
      'Minutos Anticipación',
      'Minutos Salida Anticipada',
      'Horas Trabajadas',
      'Horas Extras',
      'Estado',
      'Observación',
    ];

    const rows = records.map((r) => {
      const emp = empMap.get(r.employee_id);
      return [
        r.asistencia_id,
        r.fecha,
        emp?.employee_code || '',
        `"${emp ? `${emp.nombres} ${emp.apellidos}` : ''}"`,
        emp?.cedula || '',
        `"${emp?.departamento || ''}"`,
        `"${emp?.sede || ''}"`,
        r.hora_entrada_programada,
        r.hora_salida_programada,
        r.hora_entrada_real || '--',
        r.hora_salida_real || '--',
        r.minutos_tarde || 0,
        r.minutos_anticipacion || 0,
        r.minutos_salida_anticipada || 0,
        r.horas_trabajadas || '',
        r.horas_extra || '0h 0m',
        r.estado,
        `"${r.observacion || ''}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  generateOvertimeCSV(records: OvertimeRecord[], employees: Employee[]): string {
    const empMap = new Map(employees.map((e) => [e.employee_id, e]));

    const headers = [
      'ID Horas Extras',
      'Fecha',
      'Código Empleado',
      'Empleado',
      'Cédula',
      'Departamento',
      'Hora Inicio',
      'Hora Fin',
      'Horas Extras',
      'Motivo',
      'Estado',
      'Aprobado Por',
    ];

    const rows = records.map((r) => {
      const emp = empMap.get(r.employee_id);
      return [
        r.overtime_id,
        r.fecha,
        emp?.employee_code || '',
        `"${emp ? `${emp.nombres} ${emp.apellidos}` : r.solicitado_por}"`,
        emp?.cedula || '',
        `"${emp?.departamento || ''}"`,
        r.hora_inicio,
        r.hora_fin,
        r.horas_formato,
        `"${r.motivo || ''}"`,
        r.estado,
        `"${r.aprobado_por || ''}"`,
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  },

  downloadCSV(content: string, filename: string) {
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
