"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { ModulationType } from "@/types/modulation";
import { modulationConfigs } from "@/lib/modulation-config";

interface ModulationSelectorProps {
  value: ModulationType;
  onValueChange: (value: ModulationType) => void;
}

export default function ModulationSelector({
  value,
  onValueChange,
}: ModulationSelectorProps) {
  const selectedConfig = modulationConfigs.find(config => config.id === value);

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue placeholder="Seleccionar tipo de modulación" />
        </SelectTrigger>
        <SelectContent>
          {modulationConfigs.map((config) => (
            <SelectItem key={config.id} value={config.id}>
              {config.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <HoverCard>
        <HoverCardTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground cursor-help" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">{selectedConfig?.name}</h4>
            <p className="text-sm text-muted-foreground">
              {selectedConfig?.description}
            </p>
            <div className="mt-4">
              <h5 className="text-sm font-semibold mb-2">Reglas de codificación:</h5>
              <ul className="text-sm text-muted-foreground list-disc pl-4">
                {selectedConfig?.rules.map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}