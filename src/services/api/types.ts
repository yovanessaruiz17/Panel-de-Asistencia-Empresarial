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
  Role,
  Schedule,
  User,
} from '../../types';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface IDataProvider {
  // Employees
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | null>;
  getEmployeeByCedulaOrCode(query: string): Promise<Employee | null>;
  createEmployee(data: Omit<Employee, 'employee_id' | 'creado_en' | 'actualizado_en'>): Promise<Employee>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
  deactivateEmployee(id: string): Promise<boolean>;
  regenerateEmployeeQR(id: string): Promise<string>;

  // Schedules
  getSchedules(): Promise<Schedule[]>;
  getSchedule(id: string): Promise<Schedule | null>;
  createSchedule(data: Omit<Schedule, 'horario_id'>): Promise<Schedule>;
  updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule>;
  assignSchedule(employeeId: string, scheduleId: string): Promise<boolean>;

  // Attendance & Punches
  registerPunch(
    identifier: string, // token or cedula or code
    method: AttendanceMethod,
    customTime?: string,
    customDate?: string,
    registeredBy?: string
  ): Promise<AttendancePunchResult>;
  getDailyAttendance(date?: string): Promise<DailyAttendance[]>;
  getEmployeeAttendanceHistory(employeeId: string): Promise<DailyAttendance[]>;
  getRecentPunches(limit?: number): Promise<AttendancePunch[]>;

  // Overtime
  getOvertimeRecords(): Promise<OvertimeRecord[]>;
  approveOvertime(id: string, approverName: string, comment?: string): Promise<boolean>;
  rejectOvertime(id: string, approverName: string, reason?: string): Promise<boolean>;

  // Incidents
  getIncidents(): Promise<Incident[]>;
  createIncident(data: Omit<Incident, 'incident_id' | 'creado_en'>): Promise<Incident>;
  updateIncidentStatus(id: string, status: 'APROBADO' | 'RECHAZADO', approverName: string): Promise<boolean>;

  // Organization
  getDepartments(): Promise<Department[]>;
  createDepartment(data: Omit<Department, 'department_id'>): Promise<Department>;
  updateDepartment(id: string, data: Partial<Department>): Promise<Department>;

  getBranches(): Promise<Branch[]>;
  createBranch(data: Omit<Branch, 'sede_id'>): Promise<Branch>;
  updateBranch(id: string, data: Partial<Branch>): Promise<Branch>;

  // Users & Roles
  getUsers(): Promise<User[]>;
  createUser(data: Omit<User, 'user_id' | 'creado_en'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;

  // Settings
  getCompanySettings(): Promise<CompanySettings>;
  updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings>;

  // Audit
  getAuditLogs(): Promise<AuditRecord[]>;
  recordAudit(log: Omit<AuditRecord, 'audit_id' | 'timestamp'>): Promise<void>;
}
