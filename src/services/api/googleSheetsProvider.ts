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
import { ApiResponse, IDataProvider } from './types';

export class GoogleSheetsProvider implements IDataProvider {
  private apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl || import.meta.env.VITE_API_URL || '';
  }

  private async request<T>(action: string, payload: Record<string, any> = {}): Promise<T> {
    if (!this.apiUrl) {
      throw new Error('VITE_API_URL no está configurada para el proveedor Google Sheets / Apps Script.');
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // GAS Web App friendly
        },
        body: JSON.stringify({
          action,
          payload,
          timestamp: new Date().toISOString(),
        }),
      });

      const json: ApiResponse<T> = await response.json();
      if (!json.success) {
        throw new Error(json.error?.message || json.message || 'Error en la petición a Apps Script');
      }

      return json.data as T;
    } catch (err: any) {
      console.error(`[GoogleSheetsProvider] Action ${action} failed:`, err);
      throw err;
    }
  }

  async getEmployees(): Promise<Employee[]> {
    return this.request<Employee[]>('getEmployees');
  }

  async getEmployee(id: string): Promise<Employee | null> {
    return this.request<Employee | null>('getEmployee', { employee_id: id });
  }

  async getEmployeeByCedulaOrCode(query: string): Promise<Employee | null> {
    return this.request<Employee | null>('getEmployeeByCedulaOrCode', { query });
  }

  async createEmployee(data: Omit<Employee, 'employee_id' | 'creado_en' | 'actualizado_en'>): Promise<Employee> {
    return this.request<Employee>('createEmployee', { data });
  }

  async updateEmployee(id: string, data: Partial<Employee>): Promise<Employee> {
    return this.request<Employee>('updateEmployee', { employee_id: id, data });
  }

  async deactivateEmployee(id: string): Promise<boolean> {
    return this.request<boolean>('deactivateEmployee', { employee_id: id });
  }

  async regenerateEmployeeQR(id: string): Promise<string> {
    return this.request<string>('regenerateEmployeeQR', { employee_id: id });
  }

  async getSchedules(): Promise<Schedule[]> {
    return this.request<Schedule[]>('getSchedules');
  }

  async getSchedule(id: string): Promise<Schedule | null> {
    return this.request<Schedule | null>('getSchedule', { horario_id: id });
  }

  async createSchedule(data: Omit<Schedule, 'horario_id'>): Promise<Schedule> {
    return this.request<Schedule>('createSchedule', { data });
  }

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<Schedule> {
    return this.request<Schedule>('updateSchedule', { horario_id: id, data });
  }

  async assignSchedule(employeeId: string, scheduleId: string): Promise<boolean> {
    return this.request<boolean>('assignSchedule', { employee_id: employeeId, horario_id: scheduleId });
  }

  async registerPunch(
    identifier: string,
    method: AttendanceMethod,
    customTime?: string,
    customDate?: string,
    registeredBy = 'KIOSK_PUNCH'
  ): Promise<AttendancePunchResult> {
    return this.request<AttendancePunchResult>('registerPunch', {
      identifier,
      method,
      customTime,
      customDate,
      registeredBy,
    });
  }

  async getDailyAttendance(date?: string): Promise<DailyAttendance[]> {
    return this.request<DailyAttendance[]>('getDailyAttendance', { date });
  }

  async getEmployeeAttendanceHistory(employeeId: string): Promise<DailyAttendance[]> {
    return this.request<DailyAttendance[]>('getEmployeeAttendanceHistory', { employee_id: employeeId });
  }

  async getRecentPunches(limit = 10): Promise<AttendancePunch[]> {
    return this.request<AttendancePunch[]>('getRecentPunches', { limit });
  }

  async getOvertimeRecords(): Promise<OvertimeRecord[]> {
    return this.request<OvertimeRecord[]>('getOvertimeRecords');
  }

  async approveOvertime(id: string, approverName: string, comment?: string): Promise<boolean> {
    return this.request<boolean>('approveOvertime', { overtime_id: id, approverName, comment });
  }

  async rejectOvertime(id: string, approverName: string, reason?: string): Promise<boolean> {
    return this.request<boolean>('rejectOvertime', { overtime_id: id, approverName, reason });
  }

  async getIncidents(): Promise<Incident[]> {
    return this.request<Incident[]>('getIncidents');
  }

  async createIncident(data: Omit<Incident, 'incident_id' | 'creado_en'>): Promise<Incident> {
    return this.request<Incident>('createIncident', { data });
  }

  async updateIncidentStatus(id: string, status: 'APROBADO' | 'RECHAZADO', approverName: string): Promise<boolean> {
    return this.request<boolean>('updateIncidentStatus', { incident_id: id, status, approverName });
  }

  async getDepartments(): Promise<Department[]> {
    return this.request<Department[]>('getDepartments');
  }

  async createDepartment(data: Omit<Department, 'department_id'>): Promise<Department> {
    return this.request<Department>('createDepartment', { data });
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    return this.request<Department>('updateDepartment', { department_id: id, data });
  }

  async getBranches(): Promise<Branch[]> {
    return this.request<Branch[]>('getBranches');
  }

  async createBranch(data: Omit<Branch, 'sede_id'>): Promise<Branch> {
    return this.request<Branch>('createBranch', { data });
  }

  async updateBranch(id: string, data: Partial<Branch>): Promise<Branch> {
    return this.request<Branch>('updateBranch', { sede_id: id, data });
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('getUsers');
  }

  async createUser(data: Omit<User, 'user_id' | 'creado_en'>): Promise<User> {
    return this.request<User>('createUser', { data });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.request<User>('updateUser', { user_id: id, data });
  }

  async getCompanySettings(): Promise<CompanySettings> {
    return this.request<CompanySettings>('getCompanySettings');
  }

  async updateCompanySettings(data: Partial<CompanySettings>): Promise<CompanySettings> {
    return this.request<CompanySettings>('updateCompanySettings', { data });
  }

  async getAuditLogs(): Promise<AuditRecord[]> {
    return this.request<AuditRecord[]>('getAuditLogs');
  }

  async recordAudit(log: Omit<AuditRecord, 'audit_id' | 'timestamp'>): Promise<void> {
    await this.request('recordAudit', { log });
  }
}
