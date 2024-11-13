export type ModulationType = 'NRZ-L' | 'NRZ-I' | 'RZ' | 'Manchester' | 'Differential Manchester';

export interface ModulationConfig {
  id: ModulationType;
  name: string;
  description: string;
}