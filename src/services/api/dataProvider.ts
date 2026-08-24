import { GoogleSheetsProvider } from './googleSheetsProvider';
import { MockDataProvider } from './mockDataProvider';
import { IDataProvider } from './types';

// Detect if demo mode is enabled (defaults to true for standalone preview / Phase 1)
const isDemoMode = import.meta.env.VITE_DEMO_MODE !== 'false';
const apiUrl = import.meta.env.VITE_API_URL;

class DataProviderService {
  private provider: IDataProvider;
  private isDemo: boolean;

  constructor() {
    this.isDemo = isDemoMode || !apiUrl;
    this.provider = this.isDemo ? new MockDataProvider() : new GoogleSheetsProvider(apiUrl);
  }

  getProvider(): IDataProvider {
    return this.provider;
  }

  isDemoActive(): boolean {
    return this.isDemo;
  }

  setDemoMode(active: boolean) {
    this.isDemo = active;
    this.provider = active ? new MockDataProvider() : new GoogleSheetsProvider(apiUrl);
  }
}

export const dataProviderService = new DataProviderService();
export const dataProvider: IDataProvider = dataProviderService.getProvider();
