import { Branch } from '../types';
import { dataProvider } from './api/dataProvider';

export const branchService = {
  async getAll(): Promise<Branch[]> {
    return dataProvider.getBranches();
  },

  async create(data: Omit<Branch, 'sede_id'>): Promise<Branch> {
    return dataProvider.createBranch(data);
  },

  async update(id: string, data: Partial<Branch>): Promise<Branch> {
    return dataProvider.updateBranch(id, data);
  },
};
