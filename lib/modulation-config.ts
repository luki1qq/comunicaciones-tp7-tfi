import { ModulationConfig } from "@/types/modulation";

export const modulationConfigs: ModulationConfig[] = [
  {
    id: 'NRZ-L',
    name: 'NRZ-L (Non-Return-to-Zero Level)',
    description: 'Binary 1 is represented by one level, binary 0 by another level'
  },
  {
    id: 'NRZ-I',
    name: 'NRZ-I (Non-Return-to-Zero Inverted)',
    description: 'Signal changes at the beginning of bit period for 1, stays the same for 0'
  },
  {
    id: 'RZ',
    name: 'RZ (Return to Zero)',
    description: 'Signal returns to zero in the middle of each bit period'
  },
  {
    id: 'Manchester',
    name: 'Manchester',
    description: 'Transition in middle of bit period, low-to-high for 1, high-to-low for 0'
  },
  {
    id: 'Differential Manchester',
    name: 'Differential Manchester',
    description: 'Transition polarity at start of bit period indicates data'
  }
];