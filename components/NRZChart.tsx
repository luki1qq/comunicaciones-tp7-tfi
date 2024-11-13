"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { ModulationType } from "@/types/modulation";

interface NRZChartProps {
  binarySequence: string;
  voltage: number;
  modulationType: ModulationType;
}

export default function NRZChart({ binarySequence, voltage, modulationType }: NRZChartProps) {
  const generateNRZData = (sequence: string) => {
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

  const data = generateNRZData(binarySequence);
  const maxVoltage = voltage + 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 20, right: 30, left: 30, bottom: 20 }}
      >
        <XAxis
          dataKey="time"
          type="number"
          domain={[0, binarySequence.length - 1]}
          ticks={[...Array(binarySequence.length)].map((_, i) => i)}
          label={{ value: "Time (bit period)", position: "bottom", offset: 0 }}
        />
        <YAxis
          domain={[0, maxVoltage]}
          ticks={[0, voltage]}
          label={{ value: "Voltage (V)", angle: -90, position: "left" }}
        />
        <Tooltip
          formatter={(value: number) => [`${value}V`, "Voltage"]}
          labelFormatter={(label: number) => `Bit ${Math.floor(label)}`}
        />
        <Line
          type="stepAfter"
          dataKey="voltage"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}