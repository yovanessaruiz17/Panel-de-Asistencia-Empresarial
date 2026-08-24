import {
  INITIAL_AUDIT_LOGS,
  INITIAL_BRANCHES,
  INITIAL_COMPANY_SETTINGS,
  INITIAL_DAILY_ATTENDANCE,
  INITIAL_DEPARTMENTS,
  INITIAL_EMPLOYEES,
  INITIAL_INCIDENTS,
  INITIAL_OVERTIME,
  INITIAL_SCHEDULES,
  INITIAL_USERS,
} from '../../constants/mockData';
import {
  AttendanceMethod,
  AttendancePunch,
  AttendancePunchResult,
  AuditRecord,
  Branch,
  CompanySettings,
  DailyAttendance,
  Department,
  Employee,
  Incident,
  OvertimeRecord,
  Schedule,
  User,
} from '../../types';
import { processAttendancePunch } from '../../utils/attendanceRules';
import {
  calculateDurationString,
  getCurrentTimeString,
  getTodayDateString,
  timeStringToMinutes,
} from '../../utils/dateUtils';
import { IDataProvider } from './types';

const STORAGE_PREFIX = 'yordev_control_';

function loadFromStorage<T>(key: string, initial: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : initial;
  } catch {
    return initial;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

export class MockDataProvider implements IDataProvider {
  private employees: Employee[];
  private schedules: Schedule[];
  private dailyAttendance: DailyAttendance[];
  private punches: AttendancePunch[];
  private users: User[];
  private departments: Department[];
  private branches: Branch[];
  private overtime: OvertimeRecord[];
  private incidents: Incident[];
  private settings: CompanySettings;
  private auditLogs: AuditRecord[];

  constructor() {
    this.employees = loadFromStorage('employees', INITIAL_EMPLOYEES);
    this.schedules = loadFromStorage('schedules', INITIAL_SCHEDULES);
    this.dailyAttendance = loadFromStorage('daily_attendance', INITIAL_DAILY_ATTENDANCE);
    this.punches = loadFromStorage('punches', []);
    this.users = loadFromStorage('users', INITIAL_USERS);
    this.departments = loadFromStorage('departments', INITIAL_DEPARTMENTS);
    this.branches = loadFromStorage('branches', INITIAL_BRANCHES);
    this.overtime = loadFromStorage('overtime', INITIAL_OVERTIME);
    this.incidents = loadFromStorage('incidents', INITIAL_INCIDENTS);
    this.settings = loadFromStorage('settings', INITIAL_COMPANY_SETTINGS);
    this.auditLogs = loadFromStorage('audit', INITIAL_AUDIT_LOGS);
  }

  // --- EMPLOYEES ---
  async getEmployees(): Promise<Employee[]> {
    return [...this.employees];
  }

  async getEmployee(id: string): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.employee_id === id);
    return emp ? { ...emp } : null;
  }

  async getEmployeeByCedulaOrCode(query: string): Promise<Employee | null> {
    const cleanQuery = query.trim().toUpperCase();
    const cleanDigits = query.replace(/\D/g, '');

    const emp = this.employees.find(
      (e) =>
        e.employee_code.toUpperCase() === cleanQuery ||
        e.qr_token.toUpperCase() === cleanQuery ||
        (cleanDigits.length > 0 && e.cedula === cleanDigits)
    );
    return emp ? { ...emp } : null;
  }

  async createEmployee(data: Omit<Employee, 'employee_id' | 'creado_en' | 'actualizado_en'>): Promise<Employee> {
    const nextNum = (this.employees.length + 101).toString().padStart(4, '0');
    const newId = `EMP-${(this.employees.length + 1).toString().padStart(3, '0')}`;
    const code = data.employee_code || `YDV-EMP-00${nextNum}`;
    const now = new Date().toISOString();

    const newEmp: Employee = {
      ...data,
      employee_id: newId,
      employee_code: code,
      qr_token: code,
      creado_en: now,
      actualizado_en: now,
    };

    this.employees.unshift(newEmp);
    saveToStorage('employees', this.employees);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: 'Gestor de RRHH',
      rol: 'HR',
      accion: 'CREAR_EMPLEADO',
      modulo: 'EMPLEADOS',
      registro_id: newId,
      datos_nuevos: JSON.stringify({ nombre: `${newEmp.nombres} ${newEmp.apellidos}`, cargo: newEmp.cargo }),
      resultado: 'EXITO',
    });

    return newEmp;
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    const index = this.employees.findIndex((e) => e.employee_id === id);
    if (index === -1) throw new Error('Empleado no encontrado');

    const previous = { ...this.employees[index] };
    const updated: Employee = {
      ...previous,
      ...data,
      actualizado_en: new Date().toISOString(),
    };

    this.employees[index] = updated;
    saveToStorage('employees', this.employees);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: 'Gestor de RRHH',
      rol: 'HR',
      accion: 'ACTUALIZAR_EMPLEADO',
      modulo: 'EMPLEADOS',
      registro_id: id,
      datos_anteriores: JSON.stringify(previous),
      datos_nuevos: JSON.stringify(updated),
      resultado: 'EXITO',
    });

    return updated;
  }

  async deactivateEmployee(id: string): Promise<boolean> {
    const emp = this.employees.find((e) => e.employee_id === id);
    if (!emp) return false;
    emp.estado = 'INACTIVO';
    emp.actualizado_en = new Date().toISOString();
    saveToStorage('employees', this.employees);
    return true;
  }

  async regenerateEmployeeQR(id: string): Promise<string> {
    const emp = this.employees.find((e) => e.employee_id === id);
    if (!emp) throw new Error('Empleado no encontrado');
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newToken = `${emp.employee_code}-${randomHex}`;
    emp.qr_token = newToken;
    emp.actualizado_en = new Date().toISOString();
    saveToStorage('employees', this.employees);
    return newToken;
  }

  // --- SCHEDULES ---
  async getSchedules(): Promise<Schedule[]> {
    return [...this.schedules];
  }

  async getSchedule(id: string): Promise<Schedule | null> {
    const sch = this.schedules.find((s) => s.horario_id === id);
    return sch ? { ...sch } : null;
  }

  async createSchedule(data: Omit<Schedule, 'horario_id'>): Promise<Schedule> {
    const newId = `HOR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const newSch: Schedule = { ...data, horario_id: newId };
    this.schedules.push(newSch);
    saveToStorage('schedules', this.schedules);
    return newSch;
  }

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
    const index = this.schedules.findIndex((s) => s.horario_id === id);
    if (index === -1) throw new Error('Horario no encontrado');
    this.schedules[index] = { ...this.schedules[index], ...data };
    saveToStorage('schedules', this.schedules);
    return this.schedules[index];
  }

  async assignSchedule(employeeId: string, scheduleId: string): Promise<boolean> {
    const emp = this.employees.find((e) => e.employee_id === employeeId);
    if (!emp) return false;
    emp.horario_id = scheduleId;
    emp.actualizado_en = new Date().toISOString();
    saveToStorage('employees', this.employees);
    return true;
  }

  // --- ATTENDANCE & PUNCHES ---
  async registerPunch(
    identifier: string,
    method: AttendanceMethod,
    customTime?: string,
    customDate?: string,
    registeredBy = 'KIOSK_PUNCH'
  ): Promise<AttendancePunchResult> {
    const employee = await this.getEmployeeByCedulaOrCode(identifier);
    if (!employee) {
      return {
        success: false,
        error: {
          code: 'EMPLOYEE_NOT_FOUND',
          message: 'No se encontró ningún empleado registrado con el código o cédula proporcionada.',
        },
      };
    }

    const schedule = this.schedules.find((s) => s.horario_id === employee.horario_id) || this.schedules[0];
    const today = customDate || getTodayDateString();
    const nowTime = customTime || getCurrentTimeString();

    // Filter today's punches for this employee
    const todayPunches = this.punches.filter((p) => p.employee_id === employee.employee_id && p.fecha === today);
    const existingDaily = this.dailyAttendance.find((d) => d.employee_id === employee.employee_id && d.fecha === today);

    // Business rules evaluation
    const result = processAttendancePunch({
      employee,
      schedule,
      todayPunches,
      existingDaily,
      antiDuplicateSeconds: this.settings.tiempo_antiduplicado_segundos,
      method,
      customTime: nowTime,
      customDate: today,
      registeredBy,
    });

    if (!result.success || !result.tipo_marcacion) {
      return result;
    }

    // Save Punch
    const punchId = `PCH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newPunch: AttendancePunch = {
      marcacion_id: punchId,
      employee_id: employee.employee_id,
      fecha: today,
      hora: nowTime,
      timestamp: new Date().toISOString(),
      tipo: result.tipo_marcacion,
      metodo: method,
      registrado_por: registeredBy,
    };
    this.punches.unshift(newPunch);
    saveToStorage('punches', this.punches);

    // Update or create DailyAttendance
    let daily = this.dailyAttendance.find((d) => d.employee_id === employee.employee_id && d.fecha === today);

    if (!daily) {
      daily = {
        asistencia_id: `ATT-${today.replace(/-/g, '')}-${employee.employee_id.replace('EMP-', '')}`,
        employee_id: employee.employee_id,
        fecha: today,
        horario_id: schedule.horario_id,
        hora_entrada_programada: schedule.hora_entrada,
        hora_salida_programada: schedule.hora_salida,
        hora_entrada_real: nowTime,
        minutos_anticipacion: 0,
        minutos_tarde: 0,
        minutos_salida_anticipada: 0,
        minutos_extra: 0,
        horas_trabajadas: 'En jornada',
        horas_extra: '0h 0m',
        estado: result.estado || 'PUNTUAL',
      };
      this.dailyAttendance.unshift(daily);
    } else {
      if (result.tipo_marcacion === 'ENTRADA' && !daily.hora_entrada_real) {
        daily.hora_entrada_real = nowTime;
        daily.estado = result.estado || 'PUNTUAL';
      } else if (result.tipo_marcacion === 'SALIDA') {
        daily.hora_salida_real = nowTime;
        if (daily.hora_entrada_real) {
          daily.horas_trabajadas = calculateDurationString(daily.hora_entrada_real, nowTime);
          const schedExitMins = timeStringToMinutes(schedule.hora_salida);
          const nowMins = timeStringToMinutes(nowTime);
          if (nowMins > schedExitMins && schedule.permite_horas_extra) {
            const extraMins = nowMins - schedExitMins;
            const extraHours = Math.floor(extraMins / 60);
            const extraRemainingMins = extraMins % 60;
            daily.horas_extra = `${extraHours}h ${extraRemainingMins}m`;
            daily.horas_extra_pendientes_aprobacion = Number((extraMins / 60).toFixed(2));
            daily.estado = 'HORAS_EXTRA';

            // Automatically queue Overtime record
            const ovtId = `OVT-${Date.now()}`;
            this.overtime.unshift({
              overtime_id: ovtId,
              asistencia_id: daily.asistencia_id,
              employee_id: employee.employee_id,
              fecha: today,
              hora_inicio: schedule.hora_salida,
              hora_fin: nowTime,
              minutos_totales: extraMins,
              horas_formato: daily.horas_extra,
              motivo: 'Registro de marcación posterior al horario laboral',
              estado: 'PENDIENTE',
              solicitado_por: `${employee.nombres} ${employee.apellidos}`,
            });
            saveToStorage('overtime', this.overtime);
          }
        }
      }
    }

    saveToStorage('daily_attendance', this.dailyAttendance);
    return result;
  }

  async getDailyAttendance(date?: string): Promise<DailyAttendance[]> {
    const targetDate = date || getTodayDateString();
    return this.dailyAttendance.filter((d) => d.fecha === targetDate);
  }

  async getEmployeeAttendanceHistory(employeeId: string): Promise<DailyAttendance[]> {
    return this.dailyAttendance.filter((d) => d.employee_id === employeeId);
  }

  async getRecentPunches(limit = 10): Promise<AttendancePunch[]> {
    return this.punches.slice(0, limit);
  }

  // --- OVERTIME ---
  async getOvertimeRecords(): Promise<OvertimeRecord[]> {
    return [...this.overtime];
  }

  async approveOvertime(id: string, approverName: string, comment?: string): Promise<boolean> {
    const record = this.overtime.find((o) => o.overtime_id === id);
    if (!record) return false;
    record.estado = 'APROBADA';
    record.aprobado_por = approverName;
    record.fecha_aprobacion = new Date().toISOString();
    record.comentario_aprobador = comment;
    saveToStorage('overtime', this.overtime);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: approverName,
      rol: 'BOSS',
      accion: 'APROBAR_HORAS_EXTRA',
      modulo: 'HORAS_EXTRAS',
      registro_id: id,
      datos_nuevos: JSON.stringify({ estado: 'APROBADA', comment }),
      resultado: 'EXITO',
    });

    return true;
  }

  async rejectOvertime(id: string, approverName: string, reason?: string): Promise<boolean> {
    const record = this.overtime.find((o) => o.overtime_id === id);
    if (!record) return false;
    record.estado = 'RECHAZADA';
    record.aprobado_por = approverName;
    record.fecha_aprobacion = new Date().toISOString();
    record.comentario_aprobador = reason;
    saveToStorage('overtime', this.overtime);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: approverName,
      rol: 'BOSS',
      accion: 'RECHAZAR_HORAS_EXTRA',
      modulo: 'HORAS_EXTRAS',
      registro_id: id,
      datos_nuevos: JSON.stringify({ estado: 'RECHAZADA', reason }),
      resultado: 'EXITO',
    });

    return true;
  }

  // --- INCIDENTS ---
  async getIncidents(): Promise<Incident[]> {
    return [...this.incidents];
  }

  async createIncident(data: Omit<Incident, 'incident_id' | 'creado_en'>): Promise<Incident> {
    const newInc: Incident = {
      ...data,
      incident_id: `INC-${Date.now()}`,
      creado_en: new Date().toISOString(),
    };
    this.incidents.unshift(newInc);
    saveToStorage('incidents', this.incidents);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: data.creado_por || 'Sistema',
      rol: 'HR',
      accion: 'CREAR_NOVEDAD',
      modulo: 'NOVEDADES',
      registro_id: newInc.incident_id,
      datos_nuevos: JSON.stringify({
        employee_id: newInc.employee_id,
        tipo: newInc.tipo,
        fecha_inicio: newInc.fecha_inicio,
        fecha_fin: newInc.fecha_fin,
        tiene_soporte: !!newInc.documento_soporte,
      }),
      resultado: 'EXITO',
    });

    return newInc;
  }

  async updateIncidentStatus(id: string, status: 'APROBADO' | 'RECHAZADO', approverName: string): Promise<boolean> {
    const inc = this.incidents.find((i) => i.incident_id === id);
    if (!inc) return false;
    inc.estado = status;
    inc.aprobado_por = approverName;
    inc.fecha_aprobacion = new Date().toISOString();
    saveToStorage('incidents', this.incidents);

    await this.recordAudit({
      user_id: 'SYSTEM',
      usuario: approverName,
      rol: 'BOSS',
      accion: status === 'APROBADO' ? 'APROBAR_NOVEDAD' : 'RECHAZAR_NOVEDAD',
      modulo: 'NOVEDADES',
      registro_id: id,
      datos_nuevos: JSON.stringify({ estado: status, aprobado_por: approverName }),
      resultado: 'EXITO',
    });

    return true;
  }

  // --- DEPARTMENTS & BRANCHES ---
  async getDepartments(): Promise<Department[]> {
    return [...this.departments];
  }

  async createDepartment(data: Omit<Department, 'department_id'>): Promise<Department> {
    const newDept: Department = {
      ...data,
      department_id: `DEP-0${this.departments.length + 1}`,
    };
    this.departments.push(newDept);
    saveToStorage('departments', this.departments);
    return newDept;
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const index = this.departments.findIndex((d) => d.department_id === id);
    if (index === -1) throw new Error('Departamento no encontrado');
    this.departments[index] = { ...this.departments[index], ...data };
    saveToStorage('departments', this.departments);
    return this.departments[index];
  }

  async getBranches(): Promise<Branch[]> {
    return [...this.branches];
  }

  async createBranch(data: Omit<Branch, 'sede_id'>): Promise<Branch> {
    const newBranch: Branch = {
      ...data,
      sede_id: `SEDE-0${this.branches.length + 1}`,
    };
    this.branches.push(newBranch);
    saveToStorage('branches', this.branches);
    return newBranch;
  }

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    const index = this.branches.findIndex((b) => b.sede_id === id);
    if (index === -1) throw new Error('Sede no encontrada');
    this.branches[index] = { ...this.branches[index], ...data };
    saveToStorage('branches', this.branches);
    return this.branches[index];
  }

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    return [...this.users];
  }

  async createUser(data: Omit<User, 'user_id' | 'creado_en'>): Promise<User> {
    const newUser: User = {
      ...data,
      user_id: `USR-00${this.users.length + 1}`,
      creado_en: new Date().toISOString(),
    };
    this.users.push(newUser);
    saveToStorage('users', this.users);
    return newUser;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.user_id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    this.users[index] = { ...this.users[index], ...data };
    saveToStorage('users', this.users);
    return this.users[index];
  }

  // --- SETTINGS ---
  async getCompanySettings(): Promise<CompanySettings> {
    return { ...this.settings };
  }

  async updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    this.settings = { ...this.settings, ...data };
    saveToStorage('settings', this.settings);
    return { ...this.settings };
  }

  // --- AUDIT ---
  async getAuditLogs(): Promise<AuditRecord[]> {
    return [...this.auditLogs];
  }

  async recordAudit(log: Omit<AuditRecord, 'audit_id' | 'timestamp'>): Promise<void> {
    const record: AuditRecord = {
      ...log,
      audit_id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(record);
    saveToStorage('audit', this.auditLogs.slice(0, 200));
  }
}
