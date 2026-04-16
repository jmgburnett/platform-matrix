"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { useToggleGroup } from "@/hooks/use-toggle-group";
import {
  type ButtonSize,
  gapBySize,
} from "@/lib/button.config";
import * as React from "react";

interface ToggleGroupContextValue {
  value: string[];
  toggle: (item: string) => void;
  size?: ButtonSize;
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null,
);

export interface ToggleGroupProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

function ToggleGroup({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  className,
  children,
}: ToggleGroupProps) {
  const group = useToggleGroup({ value, defaultValue, onValueChange });

  return (
    <ToggleGroupContext.Provider value={{ ...group, size }}>
      {/* biome-ignore lint/a11y/useSemanticElements: fieldset default styles conflict with flex layout */}
      <div
        role="group"
        className={cn(
          "relative inline-flex items-center overflow-hidden rounded-full border border-sys-border bg-sys-surface-sunken p-0.5",
          gapBySize[size],
          className,
        )}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

export interface ToggleGroupItemProps {
  value: string;
  toggledIconWeight?: "bold" | "fill";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function ToggleGroupItem({
  value,
  toggledIconWeight,
  disabled,
  className,
  children,
}: ToggleGroupItemProps) {
  const context = React.useContext(ToggleGroupContext);
  if (!context) {
    throw new Error("ToggleGroupItem must be used within a ToggleGroup");
  }

  const isSelected = context.value.includes(value);

  return (
    <Button
      variant="ghost"
      toggled={isSelected}
      toggledIconWeight={toggledIconWeight}
      size={context.size}
      shape="round"
      disabled={disabled}
      aria-pressed={isSelected}
      className={className}
      onClick={() => context.toggle(value)}
    >
      {children}
    </Button>
  );
}

export { ToggleGroup, ToggleGroupItem };
