import { AttendanceMethod, AttendancePunch, AttendancePunchResult, DailyAttendance } from '../types';
import { dataProvider } from './api/dataProvider';

export const attendanceService = {
  async registerPunch(
    identifier: string,
    method: AttendanceMethod,
    customTime?: string,
    customDate?: string,
    registeredBy = 'KIOSK_PUNCH'
  ): Promise<AttendancePunchResult> {
    return dataProvider.registerPunch(identifier, method, customTime, customDate, registeredBy);
  },

  async getDaily(date?: string): Promise<DailyAttendance[]> {
    return dataProvider.getDailyAttendance(date);
  },

  async getHistoryByEmployee(employeeId: string): Promise<DailyAttendance[]> {
    return dataProvider.getEmployeeAttendanceHistory(employeeId);
  },

  async getRecentPunches(limit = 10): Promise<AttendancePunch[]> {
    return dataProvider.getRecentPunches(limit);
  },
};
