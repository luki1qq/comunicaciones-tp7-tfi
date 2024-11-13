"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ModulationType } from "@/types/modulation";
import NRZChart from "@/components/NRZChart";
import ModulationSelector from "@/components/ModulationSelector";

export default function Home() {
  const [binaryInput, setBinaryInput] = useState("1000111");
  const [voltage, setVoltage] = useState(5);
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

    setError("");
    setBinaryInput(value);
  };

  const toggleVoltage = () => {
    setVoltage(voltage === 5 ? 3 : 5);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
            Digital Signal Modulation
          </h1>
          <p className="text-center text-neutral-600 dark:text-neutral-400">
            Visualize different digital signal modulation techniques
          </p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <Label htmlFor="binaryInput" className="text-sm font-medium mb-2 block">
                      Binary Sequence
                    </Label>
                    <Input
                      id="binaryInput"
                      placeholder="Enter binary sequence (e.g., 1000111)"
                      value={binaryInput}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="font-mono"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="voltage-mode"
                      checked={voltage === 3}
                      onCheckedChange={toggleVoltage}
                    />
                    <Label htmlFor="voltage-mode">
                      {voltage}V Mode
                    </Label>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Modulation Type
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