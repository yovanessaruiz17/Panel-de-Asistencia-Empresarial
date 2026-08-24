import { OvertimeRecord } from '../types';
import { dataProvider } from './api/dataProvider';

export const overtimeService = {
  async getAll(): Promise<OvertimeRecord[]> {
    return dataProvider.getOvertimeRecords();
  },

  async approve(id: string, approverName: string, comment?: string): Promise<boolean> {
    return dataProvider.approveOvertime(id, approverName, comment);
  },

  async reject(id: string, approverName: string, reason?: string): Promise<boolean> {
    return dataProvider.rejectOvertime(id, approverName, reason);
  },
};
