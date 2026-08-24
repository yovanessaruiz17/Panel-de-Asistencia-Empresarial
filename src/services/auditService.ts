import { AuditRecord } from '../types';
import { dataProvider } from './api/dataProvider';

export const auditService = {
  async getAll(): Promise<AuditRecord[]> {
    return dataProvider.getAuditLogs();
  },

  async log(log: Omit<AuditRecord, 'audit_id' | 'timestamp'>): Promise<void> {
    return dataProvider.recordAudit(log);
  },
};
