export type ModulationType = 'NRZ-L' | 'NRZ-I' | 'RZ' | 'Manchester' | 'Differential Manchester' | 'Bipolar-AMI' | 'B8ZS' | 'HDB3';

export interface ModulationConfig {
  id: ModulationType;
  name: string;
  description: string;
}