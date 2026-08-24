import {
  AttendanceMethod,
  AttendancePunch,
  AttendancePunchResult,
  AttendancePunchType,
  AttendanceStatus,
  DailyAttendance,
  Employee,
  Schedule,
} from '../types';
import {
  calculateDurationString,
  getCurrentTimeString,
  getFormattedFullDate,
  getTodayDateString,
  timeStringToMinutes,
} from './dateUtils';

export interface PunchContext {
  employee: Employee;
  schedule: Schedule;
  todayPunches: AttendancePunch[];
  existingDaily?: DailyAttendance;
  antiDuplicateSeconds?: number;
  method: AttendanceMethod;
  customTime?: string;
  customDate?: string;
  registeredBy?: string;
}

/**
 * Validates and processes a punch according to strict enterprise business rules.
 */
export function processAttendancePunch(ctx: PunchContext): AttendancePunchResult {
  const {
    employee,
    schedule,
    todayPunches,
    existingDaily,
    antiDuplicateSeconds = 120,
    method,
    customTime,
    customDate,
    registeredBy = 'SYSTEM',
  } = ctx;

  const today = customDate || getTodayDateString();
  const nowTime = customTime || getCurrentTimeString();
  const currentMinutes = timeStringToMinutes(nowTime);

  // 1. Employee Active Check
  if (employee.estado !== 'ACTIVO') {
    return {
      success: false,
      error: {
        code: 'EMPLOYEE_INACTIVE',
        message: `El empleado se encuentra en estado ${employee.estado}. No es posible registrar marcación.`,
      },
    };
  }

  // 2. Anti-duplicate window verification
  if (todayPunches.length > 0) {
    const lastPunch = todayPunches[todayPunches.length - 1];
    const lastPunchMinutes = timeStringToMinutes(lastPunch.hora);
    const diffSeconds = (currentMinutes - lastPunchMinutes) * 60;

    if (diffSeconds >= 0 && diffSeconds < antiDuplicateSeconds) {
      return {
        success: false,
        error: {
          code: 'DUPLICATE_ATTENDANCE',
          message: `Ya registramos tu ${lastPunch.tipo.toLowerCase()} hace un momento (${lastPunch.hora}). Por favor espera antes de marcar nuevamente.`,
        },
      };
    }
  }

  // 3. Determine Entrance vs Exit
  // If no punches or last punch was SALIDA -> ENTRADA
  // If last punch was ENTRADA -> SALIDA
  let nextType: AttendancePunchType = 'ENTRADA';
  if (todayPunches.length > 0) {
    const lastPunch = todayPunches[todayPunches.length - 1];
    if (lastPunch.tipo === 'ENTRADA') {
      nextType = 'SALIDA';
    } else {
      nextType = 'ENTRADA';
    }
  }

  const scheduledEntryMinutes = timeStringToMinutes(schedule.hora_entrada);
  const scheduledExitMinutes = timeStringToMinutes(schedule.hora_salida);
  const entryTolerance = schedule.tolerancia_entrada_minutos || 10;
  const exitTolerance = schedule.tolerancia_salida_minutos || 10;

  let calculatedStatus: AttendanceStatus = 'PUNTUAL';
  let lateMinutes = 0;
  let earlyMinutes = 0;
  let earlyExitMinutes = 0;
  let extraMinutes = 0;

  if (nextType === 'ENTRADA') {
    if (currentMinutes < scheduledEntryMinutes - entryTolerance) {
      calculatedStatus = 'LLEGADA_TEMPRANA';
      earlyMinutes = scheduledEntryMinutes - currentMinutes;
    } else if (currentMinutes <= scheduledEntryMinutes + entryTolerance) {
      calculatedStatus = 'PUNTUAL';
    } else {
      calculatedStatus = 'LLEGADA_TARDE';
      lateMinutes = currentMinutes - scheduledEntryMinutes;
    }
  } else {
    // SALIDA
    if (currentMinutes < scheduledExitMinutes - exitTolerance) {
      calculatedStatus = 'SALIDA_TEMPRANA';
      earlyExitMinutes = scheduledExitMinutes - currentMinutes;
    } else if (currentMinutes <= scheduledExitMinutes + exitTolerance) {
      calculatedStatus = 'PUNTUAL';
    } else {
      // Exceeded regular shift
      const overtimeDiff = currentMinutes - scheduledExitMinutes;
      if (schedule.permite_horas_extra && overtimeDiff > (schedule.tolerancia_salida_minutos || 10)) {
        calculatedStatus = 'HORAS_EXTRA';
        extraMinutes = overtimeDiff;
      } else {
        calculatedStatus = 'SALIDA_TARDE';
      }
    }
  }

  return {
    success: true,
    tipo_marcacion: nextType,
    estado: calculatedStatus,
    empleado: {
      employee_id: employee.employee_id,
      employee_code: employee.employee_code,
      nombre_completo: `${employee.nombres} ${employee.apellidos}`,
      cargo: employee.cargo,
      foto_url: employee.foto_url,
    },
    hora: nowTime,
    fecha: today,
    metodo: method,
    mensaje: `${nextType === 'ENTRADA' ? 'Entrada' : 'Salida'} registrada con éxito.`,
  };
}

/**
 * Human friendly label and styling for attendance status
 */
export function getStatusLabel(status: AttendanceStatus): {
  label: string;
  symbol: string;
  badgeClass: string;
  borderClass: string;
} {
  switch (status) {
    case 'PUNTUAL':
      return {
        label: 'Puntual',
        symbol: '✓',
        badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        borderClass: 'border-emerald-500',
      };
    case 'LLEGADA_TEMPRANA':
      return {
        label: 'Llegada Temprana',
        symbol: '↑',
        badgeClass: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        borderClass: 'border-sky-500',
      };
    case 'LLEGADA_TARDE':
      return {
        label: 'Llegada Tarde',
        symbol: '!',
        badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        borderClass: 'border-amber-500',
      };
    case 'SALIDA_TEMPRANA':
      return {
        label: 'Salida Anticipada',
        symbol: '↓',
        badgeClass: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
        borderClass: 'border-orange-500',
      };
    case 'SALIDA_TARDE':
      return {
        label: 'Salida Tardía',
        symbol: '→',
        badgeClass: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
        borderClass: 'border-indigo-500',
      };
    case 'HORAS_EXTRA':
      return {
        label: 'Horas Extras',
        symbol: '⏱',
        badgeClass: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        borderClass: 'border-purple-500',
      };
    case 'AUSENTE':
      return {
        label: 'Ausente',
        symbol: '✕',
        badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        borderClass: 'border-rose-500',
      };
    case 'INCOMPLETA':
      return {
        label: 'Marcación Incompleta',
        symbol: '⊘',
        badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        borderClass: 'border-slate-500',
      };
    case 'PERMISO':
      return {
        label: 'Permiso Autorizado',
        symbol: 'ℹ',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        borderClass: 'border-blue-500',
      };
    case 'VACACIONES':
      return {
        label: 'En Vacaciones',
        symbol: '🌴',
        badgeClass: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
        borderClass: 'border-teal-500',
      };
    case 'FESTIVO':
      return {
        label: 'Día Festivo',
        symbol: '★',
        badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
        borderClass: 'border-zinc-500',
      };
    case 'INCIDENCIA':
      return {
        label: 'Con Incidencia',
        symbol: '⚠',
        badgeClass: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        borderClass: 'border-yellow-500',
      };
    default:
      return {
        label: status,
        symbol: '•',
        badgeClass: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
        borderClass: 'border-slate-500',
      };
  }
}
