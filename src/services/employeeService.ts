import { Employee } from '../types';
import { dataProvider } from './api/dataProvider';

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    return dataProvider.getEmployees();
  },

  async getById(id: string): Promise<Employee | null> {
    return dataProvider.getEmployee(id);
  },

  async getByCedulaOrCode(query: string): Promise<Employee | null> {
    return dataProvider.getEmployeeByCedulaOrCode(query);
  },

  async create(data: Omit<Employee, 'employee_id' | 'creado_en' | 'actualizado_en'>): Promise<Employee> {
    return dataProvider.createEmployee(data);
  },

  async update(id: string, data: Partial<Employee>): Promise<Employee> {
    return dataProvider.updateEmployee(id, data);
  },

  async deactivate(id: string): Promise<boolean> {
    return dataProvider.deactivateEmployee(id);
  },

  async regenerateQR(id: string): Promise<string> {
    return dataProvider.regenerateEmployeeQR(id);
  },
};
