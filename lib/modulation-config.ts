import { ModulationType } from "@/types/modulation";

interface ModulationConfig {
  id: ModulationType;
  name: string;
  description: string;
  rules: string[];
}

export const modulationConfigs: ModulationConfig[] = [
  {
    id: "NRZ-L",
    name: "NRZ-L (Non-Return-to-Zero Level)",
    description: "Codificación donde el nivel alto representa '1' y el nivel bajo representa '0'",
    rules: [
      "Bit 1: Voltaje positivo (+V)",
      "Bit 0: Voltaje cero (0V)",
      "No hay retorno a cero durante el intervalo de bit"
    ]
  },
  {
    id: "NRZ-I",
    name: "NRZ-I (Non-Return-to-Zero Inverted)",
    description: "Codificación donde hay transición para '1' y no hay transición para '0'",
    rules: [
      "Bit 1: Transición al inicio del intervalo",
      "Bit 0: No hay transición",
      "El nivel de voltaje se mantiene durante todo el intervalo"
    ]
  },
  {
    id: "RZ",
    name: "RZ (Return-to-Zero)",
    description: "Codificación donde la señal retorna a cero en la mitad de cada intervalo",
    rules: [
      "Bit 1: +V en primera mitad, 0V en segunda mitad",
      "Bit 0: -V en primera mitad, 0V en segunda mitad",
      "Siempre retorna a cero en la mitad del intervalo"
    ]
  },
  {
    id: "Manchester",
    name: "Manchester",
    description: "Codificación con transición en la mitad de cada intervalo",
    rules: [
      "Bit 1: Transición de +V a -V en mitad del intervalo",
      "Bit 0: Transición de -V a +V en mitad del intervalo",
      "Siempre hay transición en la mitad del intervalo"
    ]
  },
  {
    id: "Differential Manchester",
    name: "Manchester Diferencial",
    description: "Codificación Manchester donde la presencia/ausencia de transición al inicio indica el bit",
    rules: [
      "Bit 0: Transición al inicio del intervalo",
      "Bit 1: No hay transición al inicio del intervalo",
      "Siempre hay transición en la mitad del intervalo"
    ]
  },
  {
    id: "Bipolar-AMI",
    name: "Bipolar-AMI",
    description: "Codificación donde los unos alternan entre voltajes positivos y negativos",
    rules: [
      "Bit 0: Voltaje cero (0V)",
      "Bit 1: Alterna entre +V y -V",
      "Los unos consecutivos alternan polaridad"
    ]
  },
  {
    id: "B8ZS",
    name: "B8ZS (Bipolar with 8 Zeros Substitution)",
    description: "Variante de AMI que sustituye secuencias de 8 ceros",
    rules: [
      "Sigue las reglas de AMI normalmente",
      "Secuencia de 8 ceros se sustituye por patrón especial",
      "Patrón para último pulso positivo: 000+-0-+",
      "Patrón para último pulso negativo: 000-+0+-"
    ]
  },
  {
    id: "HDB3",
    name: "HDB3 (High Density Bipolar 3-zeros)",
    description: "Variante de AMI que sustituye secuencias de 4 ceros",
    rules: [
      "Sigue las reglas de AMI normalmente",
      "Secuencia de 4 ceros se sustituye por patrón especial",
      "Si número de pulsos desde última sustitución es par: B00V",
      "Si número de pulsos desde última sustitución es impar: 000V",
      "B y V son pulsos de la misma polaridad"
    ]
  }
];