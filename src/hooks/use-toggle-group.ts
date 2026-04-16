"use client";

import * as React from "react";

interface UseToggleGroupOptions {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
}

export function useToggleGroup({
  value,
  defaultValue,
  onValueChange,
}: UseToggleGroupOptions) {
  const [internalValue, setInternalValue] = React.useState<string[]>(
    defaultValue ?? [],
  );
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const toggle = React.useCallback(
    (item: string) => {
      const next = currentValue.includes(item)
        ? currentValue.filter((v) => v !== item)
        : [...currentValue, item];

      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [currentValue, isControlled, onValueChange],
  );

  return { value: currentValue, toggle };
}
