import { Department } from '../types';
import { dataProvider } from './api/dataProvider';

export const departmentService = {
  async getAll(): Promise<Department[]> {
    return dataProvider.getDepartments();
  },

  async create(data: Omit<Department, 'department_id'>): Promise<Department> {
    return dataProvider.createDepartment(data);
  },

  async update(id: string, data: Partial<Department>): Promise<Department> {
    return dataProvider.updateDepartment(id, data);
  },
};
