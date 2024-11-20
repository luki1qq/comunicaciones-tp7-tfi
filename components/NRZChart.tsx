"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from "recharts";
import { ModulationType } from "@/types/modulation";

interface NRZChartProps {
  binarySequence: string;
  voltage: number;
  modulationType: ModulationType;
}

export default function NRZChart({ binarySequence, voltage, modulationType }: NRZChartProps) {
  const generateNRZLData = (sequence: string) => {
    if (!sequence) return [];

    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    // For now, we'll keep the NRZ-L implementation
    // Future implementations will handle different modulation types
    bits.forEach((bit, index) => {
      // Add point at the start of the bit period
      data.push({
        time: index,
        voltage: bit === "1" ? voltage : 0,
      });
      // Add point just before the next bit period (to create the step effect)
      data.push({
        time: index + 0.999,
        voltage: bit === "1" ? voltage : 0,
      });
    });

    return data;
  };

  const generateNRZIData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    let currentVoltage = voltage;

    bits.forEach((bit, index) => {
      // Si es un 1, invertimos el voltaje para este bit
      if (bit === "1") {
        currentVoltage = currentVoltage === voltage ? -voltage : voltage;
      }
      if (bit === "0") {
        // currentVoltage = 0;
      }
      data.push({
        time: index,
        voltage: currentVoltage
      });
      // Añadir punto justo antes del siguiente período (para crear efecto escalón)
      data.push({
        time: index + 0.999,
        voltage: currentVoltage
      });
    });

    return data;
  };

  const generatePolarRZData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    bits.forEach((bit, index) => {
      // Inicio del bit
      data.push({
        time: index,
        voltage: bit === '1' ? voltage : -voltage
      });

      // Mitad del bit (t = 0.5)
      data.push({
        time: index + 0.5,
        voltage: bit === '1' ? voltage : -voltage
      });

      // Después de la mitad, volver a cero
      data.push({
        time: index + 0.5,
        voltage: 0
      });

      // Final del bit
      data.push({
        time: index + 0.999,
        voltage: 0
      });
    });

    return data;
  };

  const generateManchesterData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    bits.forEach((bit, index) => {
      // Primera mitad del bit
      data.push({
        time: index,
        voltage: bit === '1' ? voltage : -voltage
      });
      // Transición en medio del bit
      data.push({
        time: index + 0.5,
        voltage: bit === '1' ? voltage : -voltage
      });
      data.push({
        time: index + 0.5,
        voltage: bit === '1' ? -voltage : voltage
      });
      // Final del bit
      data.push({
        time: index + 0.999,
        voltage: bit === '1' ? -voltage : voltage
      });
    });

    return data;
  };

  const generateDifferentialManchesterData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    let currentPolarity = 1; // Comenzamos con transición positiva a negativa

    bits.forEach((bit, index) => {
      if (bit === '0') {
        // Para 0, invertimos la polaridad
        currentPolarity *= -1;
      }
      // Primera mitad del bit
      data.push({
        time: index,
        voltage: currentPolarity * voltage
      });
      // Transición en medio del bit (siempre presente)
      data.push({
        time: index + 0.5,
        voltage: currentPolarity * voltage
      });
      data.push({
        time: index + 0.5,
        voltage: -currentPolarity * voltage
      });
      // Final del bit
      data.push({
        time: index + 0.999,
        voltage: -currentPolarity * voltage
      });
    });

    return data;
  };

  const generateBipolarAMIData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    let lastOnePolarity = 1; // Alternar entre 1 y -1 para los unos

    bits.forEach((bit, index) => {
      const currentVoltage = bit === '1'
        ? (lastOnePolarity * voltage)
        : 0;

      if (bit === '1') {
        lastOnePolarity *= -1; // Invertir polaridad para el próximo uno
      }

      data.push({
        time: index,
        voltage: currentVoltage
      });
      data.push({
        time: index + 0.999,
        voltage: currentVoltage
      });
    });

    return data;
  };

  const generateB8ZSData = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    let lastOnePolarity = 1;
    let zeroCount = 0;

    for (let i = 0; i < bits.length; i++) {
      let currentVoltage = 0;

      // Detectar secuencia de 8 ceros
      if (bits[i] === '0') {
        zeroCount++;
        if (zeroCount === 8) {
          // Aplicar patrón B8ZS: 000VB0VB
          const pattern = [0, 0, 0, lastOnePolarity, -lastOnePolarity, 0, lastOnePolarity, -lastOnePolarity];
          for (let j = 0; j < 8; j++) {
            data.push({
              time: i - 7 + j,
              voltage: pattern[j] * voltage
            });
            data.push({
              time: i - 7 + j + 0.999,
              voltage: pattern[j] * voltage
            });
          }
          zeroCount = 0;
          i++; // Saltar al siguiente bit después del patrón
          continue;
        }
      } else {
        currentVoltage = lastOnePolarity * voltage;
        lastOnePolarity *= -1;
        zeroCount = 0;
      }

      data.push({
        time: i,
        voltage: currentVoltage
      });
      data.push({
        time: i + 0.999,
        voltage: currentVoltage
      });
    }

    return data;
  };

  const generateHDB3Data = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");

    let lastOnePolarity = 1;
    let zeroCount = 0;
    let onesCount = 0;

    for (let i = 0; i < bits.length; i++) {
      let currentVoltage = 0;

      if (bits[i] === '0') {
        zeroCount++;
        if (zeroCount === 4) {
          // Determinar si el número de pulsos desde el último código de sustitución es par o impar
          const pattern = onesCount % 2 === 0
            ? [lastOnePolarity, 0, 0, lastOnePolarity] // B00V
            : [0, 0, 0, lastOnePolarity];              // 000V

          for (let j = 0; j < 4; j++) {
            data.push({
              time: i - 3 + j,
              voltage: pattern[j] * voltage
            });
            data.push({
              time: i - 3 + j + 0.999,
              voltage: pattern[j] * voltage
            });
          }
          zeroCount = 0;
          onesCount = 1; // El código de sustitución cuenta como un pulso
          i++; // Saltar al siguiente bit después del patrón
          continue;
        }
      } else {
        currentVoltage = lastOnePolarity * voltage;
        lastOnePolarity *= -1;
        zeroCount = 0;
        onesCount++;
      }

      data.push({
        time: i,
        voltage: currentVoltage
      });
      data.push({
        time: i + 0.999,
        voltage: currentVoltage
      });
    }

    return data;
  };

  const getData = () => {
    switch (modulationType) {
      case 'NRZ-L':
        return generateNRZLData(binarySequence);
      case 'NRZ-I':
        return generateNRZIData(binarySequence);
      case 'RZ':
        return generatePolarRZData(binarySequence);
      case 'Manchester':
        return generateManchesterData(binarySequence);
      case 'Differential Manchester':
        return generateDifferentialManchesterData(binarySequence);
      // case 'Bipolar-AMI':
      //   return generateBipolarAMIData(binarySequence);
      // case 'B8ZS':
      //   return generateB8ZSData(binarySequence);
      // case 'HDB3':
      //   return generateHDB3Data(binarySequence);
      default:
        return [];
    }
  };

  const data = getData();
  const maxVoltage = voltage + 1;

  const getVoltageRange = (): [number, number] => {
    switch (modulationType) {
      case 'NRZ-L':
        return [-1, voltage + 1];
      case 'Bipolar-AMI':
      case 'B8ZS':
      case 'HDB3':
      case 'NRZ-I':
      case 'RZ':
      case 'Manchester':
      case 'Differential Manchester':
        return [-voltage - 1, voltage + 1];
      default:
        return [-voltage - 1, voltage + 1];
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <XAxis
          dataKey="time"
          type="number"
          domain={[0, binarySequence.length - 0.001]}
          tickCount={binarySequence.length + 1}
        />
        <YAxis
          domain={getVoltageRange()}
          ticks={[-voltage, 0, voltage]}
          label={{ value: "Voltaje (V)", angle: -90, position: "insideLeft" }}
        />
        <ReferenceLine
          y={0}
          stroke="gray"
          strokeDasharray="3 3"
          ifOverflow="extendDomain"
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value: number) => [`${value}V`, "Voltaje"]}
          labelFormatter={(label: number) => `Bit ${Math.floor(label)}`}
        />
        <Line
          type="linear"
          dataKey="voltage"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}