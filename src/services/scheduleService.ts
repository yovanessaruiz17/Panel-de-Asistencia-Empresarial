import { Schedule } from '../types';
import { dataProvider } from './api/dataProvider';

export const scheduleService = {
  async getAll(): Promise<Schedule[]> {
    return dataProvider.getSchedules();
  },

  async getById(id: string): Promise<Schedule | null> {
    return dataProvider.getSchedule(id);
  },

  async create(data: Omit<Schedule, 'horario_id'>): Promise<Schedule> {
    return dataProvider.createSchedule(data);
  },

  async update(id: string, data: Partial<Schedule>): Promise<Schedule> {
    return dataProvider.updateSchedule(id, data);
  },

  async assignToEmployee(employeeId: string, scheduleId: string): Promise<boolean> {
    return dataProvider.assignSchedule(employeeId, scheduleId);
  },
};
