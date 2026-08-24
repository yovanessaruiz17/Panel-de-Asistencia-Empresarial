import { Incident } from '../types';
import { dataProvider } from './api/dataProvider';

export const incidentService = {
  async getAll(): Promise<Incident[]> {
    return dataProvider.getIncidents();
  },

  async create(data: Omit<Incident, 'incident_id' | 'creado_en'>): Promise<Incident> {
    return dataProvider.createIncident(data);
  },

  async updateStatus(id: string, status: 'APROBADO' | 'RECHAZADO', approverName: string): Promise<boolean> {
    return dataProvider.updateIncidentStatus(id, status, approverName);
  },

  async approve(id: string, approverName: string): Promise<boolean> {
    return this.updateStatus(id, 'APROBADO', approverName);
  },

  async reject(id: string, approverName: string): Promise<boolean> {
    return this.updateStatus(id, 'RECHAZADO', approverName);
  },
};
