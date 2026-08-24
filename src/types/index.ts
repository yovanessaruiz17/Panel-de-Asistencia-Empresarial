export type Role = 'SUPER_ADMIN' | 'HR' | 'BOSS' | 'EMPLOYEE';
export type UserRole = Role;
export type UserSession = User;
export type AuditLog = AuditRecord;

export type EmployeeStatus = 'ACTIVO' | 'INACTIVO' | 'VACACIONES' | 'SUSPENDIDO';

export type AttendancePunchType = 'ENTRADA' | 'SALIDA';

export type AttendanceMethod = 'QR' | 'CEDULA' | 'ADMIN' | 'MANUAL';

export type AttendanceStatus =
  | 'PUNTUAL'
  | 'LLEGADA_TEMPRANA'
  | 'LLEGADA_TARDE'
  | 'SALIDA_TEMPRANA'
  | 'SALIDA_TARDE'
  | 'HORAS_EXTRA'
  | 'AUSENTE'
  | 'INCOMPLETA'
  | 'PERMISO'
  | 'VACACIONES'
  | 'FESTIVO'
  | 'INCIDENCIA';

export type OvertimeStatus = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';

export type IncidentType =
  | 'PERMISO'
  | 'INCAPACIDAD'
  | 'LICENCIA'
  | 'AUSENCIA_JUSTIFICADA'
  | 'AUSENCIA_NO_JUSTIFICADA'
  | 'CALAMIDAD'
  | 'DIA_COMPENSATORIO'
  | 'TRABAJO_REMOTO'
  | 'VACACIONES'
  | 'ERROR_MARCACION'
  | 'JORNADA_ESPECIAL'
  | 'OTRO';

export type IncidentStatus = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

export interface Employee {
  employee_id: string;
  employee_code: string; // e.g. YDV-EMP-000101
  nombres: string;
  apellidos: string;
  cedula: string;
  email: string;
  telefono: string;
  cargo: string;
  departamento: string;
  sede: string;
  fecha_ingreso: string;
  estado: EmployeeStatus;
  horario_id: string;
  qr_token: string;
  foto_url?: string;
  creado_en: string;
  actualizado_en: string;
}

export interface Schedule {
  horario_id: string;
  nombre: string;
  hora_entrada: string; // "08:00"
  hora_salida: string; // "17:00"
  tolerancia_entrada_minutos: number; // e.g. 10
  tolerancia_salida_minutos: number; // e.g. 10
  permite_horas_extra: boolean;
  inicio_horas_extra?: string; // "17:30"
  fin_horas_extra?: string; // "21:00"
  dias_laborales: number[]; // [1, 2, 3, 4, 5] (1 = Lunes, 7 = Domingo)
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface ScheduleAssignment {
  asignacion_id: string;
  employee_id: string;
  horario_id: string;
  fecha_inicio: string;
  fecha_fin?: string;
  activo: boolean;
}

export interface AttendancePunch {
  marcacion_id: string;
  employee_id: string;
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:mm:ss"
  timestamp: string; // ISO String in America/Bogota
  tipo: AttendancePunchType;
  metodo: AttendanceMethod;
  dispositivo?: string;
  ip?: string;
  observacion?: string;
  registrado_por: string;
}

export interface DailyAttendance {
  asistencia_id: string;
  employee_id: string;
  fecha: string; // "YYYY-MM-DD"
  horario_id: string;
  hora_entrada_programada: string;
  hora_salida_programada: string;
  hora_entrada_real?: string;
  hora_salida_real?: string;
  minutos_anticipacion: number;
  minutos_tarde: number;
  minutos_salida_anticipada: number;
  minutos_extra: number;
  horas_trabajadas: string; // e.g. "8h 15m" or decimal string
  horas_extra: string; // e.g. "1h 30m"
  horas_extra_pendientes_aprobacion?: number; // hours in decimal or mins
  horas_extra_aprobadas?: number;
  estado: AttendanceStatus;
  observacion?: string;
}

export interface User {
  user_id: string;
  nombre: string;
  email: string;
  rol: Role;
  estado: 'ACTIVO' | 'INACTIVO';
  employee_id?: string;
  ultimo_acceso?: string;
  creado_en: string;
  foto_url?: string;
}

export interface Department {
  department_id: string;
  nombre: string;
  descripcion?: string;
  jefe_id?: string;
  jefe_nombre?: string;
  jefe_departamento?: string;
  total_empleados?: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface Branch {
  sede_id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface AuditRecord {
  audit_id: string;
  timestamp: string;
  user_id: string;
  usuario: string;
  rol: Role;
  accion: string;
  modulo: string;
  registro_id?: string;
  datos_anteriores?: string;
  datos_nuevos?: string;
  ip?: string;
  resultado: 'EXITO' | 'FALLO';
}

export interface OvertimeRecord {
  overtime_id: string;
  asistencia_id: string;
  employee_id: string;
  fecha: string;
  hora_inicio: string;
  hora_fin: string;
  minutos_totales: number;
  horas_formato: string;
  motivo: string;
  estado: OvertimeStatus;
  solicitado_por: string;
  aprobado_por?: string;
  fecha_aprobacion?: string;
  comentario_aprobador?: string;
}

export interface Incident {
  incident_id: string;
  employee_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  tipo: IncidentType;
  descripcion: string;
  documento_soporte?: string; // URL / Link opcional de evidencia (ej. excusa médica, incapacidad, soporte)
  documento_soporte_url?: string;
  estado: IncidentStatus;
  creado_por: string;
  aprobado_por?: string;
  fecha_aprobacion?: string;
  creado_en: string;
}

export interface CompanySettings {
  nombre_empresa: string;
  company_name?: string;
  logo_url: string;
  nit: string;
  direccion: string;
  telefono: string;
  email: string;
  zona_horaria: string; // "America/Bogota"
  tolerancia_global_minutos: number; // 10
  tolerancia_entrada_default?: number;
  tolerancia_salida_default?: number;
  tiempo_antiduplicado_segundos: number; // 120
  permitir_marcacion_web: boolean;
  requerir_ubicacion: boolean;
  modo_demo?: boolean;
  google_sheets_url?: string;
}

export interface AttendancePunchResult {
  success: boolean;
  tipo_marcacion?: AttendancePunchType;
  estado?: AttendanceStatus;
  empleado?: {
    employee_id: string;
    employee_code: string;
    nombre_completo: string;
    cargo: string;
    foto_url?: string;
  };
  hora?: string;
  fecha?: string;
  metodo?: AttendanceMethod;
  mensaje?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface DashboardStats {
  total_empleados: number;
  empleados_activos: number;
  presentes_hoy: number;
  ausentes_hoy: number;
  llegadas_tarde_hoy: number;
  salidas_tempranas_hoy: number;
  horas_extra_pendientes: number;
  horas_extra_aprobadas_mes: number;
  incidencias_pendientes: number;
}
