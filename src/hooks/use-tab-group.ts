"use client";

import * as React from "react";

interface UseTabGroupOptions {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function useTabGroup({
  value,
  defaultValue,
  onValueChange,
}: UseTabGroupOptions) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange],
  );

  return { value: currentValue, setValue };
}
