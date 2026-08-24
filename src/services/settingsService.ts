import { CompanySettings } from '../types';
import { dataProvider } from './api/dataProvider';

export const settingsService = {
  async get(): Promise<CompanySettings> {
    return dataProvider.getCompanySettings();
  },

  async update(data: Partial<CompanySettings>): Promise<CompanySettings> {
    return dataProvider.updateCompanySettings(data);
  },
};
