import { User } from '../types';
import { dataProvider } from './api/dataProvider';

export const userService = {
  async getAll(): Promise<User[]> {
    return dataProvider.getUsers();
  },

  async create(data: Omit<User, 'user_id' | 'creado_en'>): Promise<User> {
    return dataProvider.createUser(data);
  },

  async update(id: string, data: Partial<User>): Promise<User> {
    return dataProvider.updateUser(id, data);
  },
};
