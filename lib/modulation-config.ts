import { ModulationConfig } from "@/types/modulation";

export const modulationConfigs: ModulationConfig[] = [
  {
    id: 'NRZ-L',
    name: 'NRZ-L (No Retorno a Cero por Nivel)',
    description: 'El binario 1 está representado por un nivel, el binario 0 por otro nivel'
  },
  {
    id: 'NRZ-I',
    name: 'NRZ-I (No Retorno a Cero Invertido)',
    description: 'La señal cambia al inicio del período de bit para 1, permanece igual para 0'
  },
  {
    id: 'RZ',
    name: 'RZ (Retorno a Cero)',
    description: 'La señal retorna a cero en la mitad de cada período de bit'
  },
  {
    id: 'Manchester',
    name: 'Manchester',
    description: 'Transición en medio del período de bit, bajo-a-alto para 1, alto-a-bajo para 0'
  },
  {
    id: 'Differential Manchester',
    name: 'Manchester Diferencial',
    description: 'La polaridad de la transición al inicio del período de bit indica el dato'
  },
  // {
  //   id: 'Bipolar AMI',
  //   name: 'Bipolar AMI',
  //   description: 'Binary 1 is represented by a positive pulse, binary 0 by a negative pulse'
  // },
  // {
  //   id: 'B8ZS',
  //   name: 'B8ZS',
  //   description: 'Bipolar with 8-zero substitution'
  // },
  // {
  //   id: 'HDB3',
  //   name: 'HDB3',
  //   description: 'High-density bipolar 3-zero substitution'
  // }
];