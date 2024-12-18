"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid, Text, Label } from "recharts";
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
      // Si es un 1, usar la polaridad actual y alternarla para el próximo 1
      // Si es un 0, usar voltaje 0
      const currentVoltage = bit === '1'
        ? (lastOnePolarity * voltage)
        : 0;

      if (bit === '1') {
        lastOnePolarity *= -1; // Invertir polaridad para el próximo uno
      }

      // Punto inicial del bit
      data.push({
        time: index,
        voltage: currentVoltage
      });
      // Punto final del bit (para mantener el nivel)
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
      if (bits[i] === '0') {
        zeroCount++;
        console.log('zeroCount:', zeroCount);
        if (zeroCount === 8) {
          // Eliminar los últimos 7 puntos de datos para el patrón B8ZS
          data.splice(data.length - 14, 14);

          // Generar el patrón B8ZS
          const pattern = lastOnePolarity === 1
            ? [0, 0, 0, -voltage, voltage, 0, voltage, -voltage]  // 000-+0+-
            : [0, 0, 0, voltage, -voltage, 0, -voltage, voltage]; // 000+-0-+

          // Retroceder 7 posiciones para escribir el patrón completo
          const startPos = i - 7;
          for (let j = 0; j < 8; j++) {
            data.push({
              time: startPos + j,
              voltage: pattern[j]
            });
            data.push({
              time: startPos + j + 0.999,
              voltage: pattern[j]
            });
          }

          // Actualizar la última polaridad y resetear el contador
          lastOnePolarity = pattern[7] > 0 ? 1 : -1;
          zeroCount = 0;
          i = startPos + 7; // Actualizar i a la última posición del patrón
        } else {
          // Cero normal
          data.push({
            time: i,
            voltage: 0
          });
          data.push({
            time: i + 0.999,
            voltage: 0
          });
        }
      } else {
        // Para los unos, aplicar AMI
        const voltage = lastOnePolarity * 5;
        data.push({
          time: i,
          voltage: voltage
        });
        data.push({
          time: i + 0.999,
          voltage: voltage
        });
        lastOnePolarity *= -1;
        zeroCount = 0;
      }
    }

    return data;
  };

  const generateHDB3Data = (sequence: string) => {
    if (!sequence) return [];
    const data: { time: number; voltage: number }[] = [];
    const bits = sequence.split("");
    
    let lastPolarity = -voltage;
    let pulseCount = 0;
    let zeroCount = 0;
    
    // Helper para agregar puntos al gráfico
    const addPulse = (time: number, value: number) => {
      data.push(
        { time: time, voltage: value },
        { time: time + 0.999, voltage: value }
      );
    };

    for (let i = 0; i < bits.length; i++) {
      if (bits[i] === '1') {
        lastPolarity = -lastPolarity;
        addPulse(i, lastPolarity);
        pulseCount++;
        zeroCount = 0;
      } else {
        zeroCount++;
        
        if (zeroCount === 4) {
          // Eliminar los últimos 4 pulsos
          data.splice(data.length - 6, 6);
          
          if (pulseCount % 2 === 0) {
            // Patrón B00V
            const polarityBV = lastPolarity > 0 ? -voltage : voltage;
            addPulse(i - 3, polarityBV);    // B
            addPulse(i - 2, 0);             // 0
            addPulse(i - 1, 0);             // 0
            addPulse(i, polarityBV);        // V
            lastPolarity = polarityBV;
          } else {
            // Patrón 000V
            const polarityV = lastPolarity > 0 ? voltage : -voltage;
            addPulse(i - 3, 0);             // 0
            addPulse(i - 2, 0);             // 0
            addPulse(i - 1, 0);             // 0
            addPulse(i, polarityV);         // V
            lastPolarity = polarityV;
          }
          
          pulseCount = 0;
          zeroCount = 0;
        } else {
          addPulse(i, 0);
        }
      }
    }

    return data;
  };

  const getData = () => {
    // console.log('modulationType:', modulationType);
    // console.log('binarySequence:', binarySequence);
    
    let data;
    switch (modulationType) {
      case 'NRZ-L':
        data = generateNRZLData(binarySequence);
        console.log('NRZ-L generated data:', data);
        return data;
      case 'NRZ-I':
        data = generateNRZIData(binarySequence);
        console.log('NRZ-I generated data:', data);
        return data;
      case 'RZ':
        data = generatePolarRZData(binarySequence);
        console.log('RZ generated data:', data);
        return data;
      case 'Manchester':
        data = generateManchesterData(binarySequence);
        console.log('Manchester generated data:', data);
        return data;
      case 'Differential Manchester':
        data = generateDifferentialManchesterData(binarySequence);
        console.log('Differential Manchester generated data:', data);
        return data;
      case 'Bipolar-AMI':
        data = generateBipolarAMIData(binarySequence);
        console.log('Bipolar-AMI generated data:', data);
        return data;
      case 'B8ZS':
        data = generateB8ZSData(binarySequence);
        console.log('B8ZS generated data:', data);
        return data;
      case 'HDB3':
        data = generateHDB3Data(binarySequence);
        console.log('HDB3 generated data:', data);
        return data;
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
        margin={{ top: 30, right: 30, left: 30, bottom: 20 }}
      >
        <XAxis
          dataKey="time"
          type="number"
          domain={[0, binarySequence.length - 0.001]}
          tickCount={binarySequence.length}
          ticks={Array.from({ length: binarySequence.length }, (_, i) => i)}
          tick={(props) => {
            const { x, y, payload } = props;
            const bitIndex = payload.value;
            const bit = binarySequence[bitIndex];
            
            // Calculamos el ajuste basado en la longitud de la secuencia
            const adjustment = Math.floor(binarySequence.length / 3) * -15; // -5 pixels por cada 3 bits
            const baseOffset = 100; // Offset base hacia la derecha
            
            return (
              <g transform={`translate(${x + baseOffset + adjustment},${y - 25})`}>
                <text
                  x={0}
                  y={0}
                  dy={16}
                  textAnchor="middle"
                  fill="#666666"
                  style={{
                    fontSize: '30px',
                    fontWeight: 'bold'
                  }}
                >
                  {bit}
                </text>
              </g>
            );
          }}
        >
          <Label value="Tiempo (bits)" position="bottom" offset={10} />
        </XAxis>

        <YAxis domain={getVoltageRange()} ticks={[-voltage, 0, voltage]}>
          <Label value="Voltaje (V)" angle={-90} position="insideLeft" />
        </YAxis>

        <ReferenceLine y={0} stroke="gray" strokeDasharray="3 3" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value: number) => [`${value}V`, "Voltaje"]}
          labelFormatter={(label: number) => `Tiempo ${Math.floor(label)}`}
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