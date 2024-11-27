"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ModulationType } from "@/types/modulation";
import NRZChart from "@/components/NRZChart";
import ModulationSelector from "@/components/ModulationSelector";

export default function Home() {
  const [binaryInput, setBinaryInput] = useState("1000111");
  const [voltage, setVoltage] = useState<number>(5);
  const [error, setError] = useState("");
  const [modulationType, setModulationType] = useState<ModulationType>("NRZ-L");

  const validateBinaryInput = (input: string) => {
    return /^[0-1]+$/.test(input);
  };

  const handleInputChange = (value: string) => {
    if (value === "") {
      setBinaryInput("");
      setError("");
      return;
    }

    if (!validateBinaryInput(value)) {
      setError("Please enter only binary digits (0 or 1)");
      return;
    }

    if (value.length > 16) {
      setError("Maximum sequence length is 16 bits");
      return;
    }

    setError("");
    setBinaryInput(value);
  };

  const handleVoltageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    
    if (isNaN(value)) {
      setError("Por favor ingrese un número válido");
      return;
    }

    if (value <= 0) {
      setError("El voltaje debe ser mayor que 0");
      return;
    }

    if (value > 10) {
      setError("El voltaje máximo permitido es 10V");
      return;
    }

    setError("");
    setVoltage(value);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Modulación de Señales Digitales
          </h1>
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Visualiza diferentes técnicas de modulación de señales digitales
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <Label htmlFor="binaryInput" className="text-sm font-medium mb-2 block">
                      Secuencia Binaria
                    </Label>
                    <Input
                      id="binaryInput"
                      placeholder="Ingresa una secuencia binaria (máx. 16 bits)"
                      value={binaryInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="font-mono"
                      maxLength={16}
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="voltageInput" className="text-sm font-medium mb-2 block">
                      Voltaje (V)
                    </Label>
                    <Input
                      id="voltageInput"
                      type="number"
                      placeholder="Ingresa el voltaje (1-10V)"
                      value={voltage}
                      onChange={handleVoltageChange}
                      className="font-mono"
                      min={1}
                      max={10}
                      step={0.5}
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Tipo de Modulación
                  </Label>
                  <ModulationSelector
                    value={modulationType}
                    onValueChange={setModulationType}
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="h-[400px] w-full">
              <NRZChart
                binarySequence={binaryInput}
                voltage={voltage}
                modulationType={modulationType}
              />
            </div>
          </div>
        </Card>

        <div className="text-sm text-center text-neutral-500 dark:text-neutral-400">
          <p>
            Currently showing {modulationType} modulation with {voltage}V signal level
          </p>
        </div>
      </div>
    </main>
  );
}