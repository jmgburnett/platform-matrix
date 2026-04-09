"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { useTabGroup } from "@/hooks/use-tab-group";
import {
  type ButtonSize,
  gapBySize,
} from "@/lib/button.config";
import * as React from "react";

interface TabGroupContextValue {
  value: string;
  setValue: (value: string) => void;
  size?: ButtonSize;
  registerItem: (value: string, element: HTMLButtonElement | null) => void;
}

const TabGroupContext = React.createContext<TabGroupContextValue | null>(null);

export interface TabGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

function TabGroup({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  className,
  children,
}: TabGroupProps) {
  const group = useTabGroup({ value, defaultValue, onValueChange });

  const indicatorRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef(new Map<string, HTMLButtonElement>());
  const isFirstMeasure = React.useRef(true);
  const prevRect = React.useRef<{ left: number; width: number } | null>(null);
  const contractTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const registerItem = React.useCallback(
    (itemValue: string, element: HTMLButtonElement | null) => {
      if (element) {
        itemRefs.current.set(itemValue, element);
      } else {
        itemRefs.current.delete(itemValue);
      }
    },
    [],
  );

  React.useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    const selectedEl = itemRefs.current.get(group.value);

    if (!indicator || !selectedEl) {
      if (indicator) indicator.style.opacity = "0";
      return;
    }

    clearTimeout(contractTimer.current);

    const newLeft = selectedEl.offsetLeft;
    const newWidth = selectedEl.offsetWidth;

    if (isFirstMeasure.current) {
      indicator.style.transition = "none";
      indicator.style.left = `${newLeft}px`;
      indicator.style.width = `${newWidth}px`;
      indicator.style.opacity = "1";
      void indicator.offsetHeight;
      indicator.style.transition = "";
      isFirstMeasure.current = false;
      prevRect.current = { left: newLeft, width: newWidth };
      return;
    }

    const prev = prevRect.current;
    prevRect.current = { left: newLeft, width: newWidth };

    if (!prev) {
      indicator.style.left = `${newLeft}px`;
      indicator.style.width = `${newWidth}px`;
      indicator.style.opacity = "1";
      return;
    }

    const oldRight = prev.left + prev.width;
    const newRight = newLeft + newWidth;
    const stretchLeft = Math.min(prev.left, newLeft);
    const stretchWidth = Math.max(oldRight, newRight) - stretchLeft;

    indicator.style.transition =
      "left 150ms cubic-bezier(0.16, 1, 0.3, 1), width 150ms cubic-bezier(0.16, 1, 0.3, 1)";
    indicator.style.left = `${stretchLeft}px`;
    indicator.style.width = `${stretchWidth}px`;

    contractTimer.current = setTimeout(() => {
      indicator.style.transition =
        "left 200ms cubic-bezier(0.22, 1, 0.36, 1), width 200ms cubic-bezier(0.22, 1, 0.36, 1)";
      indicator.style.left = `${newLeft}px`;
      indicator.style.width = `${newWidth}px`;
    }, 100);

    return () => clearTimeout(contractTimer.current);
  }, [group.value]);

  return (
    <TabGroupContext.Provider value={{ ...group, size, registerItem }}>
      <div
        role="tablist"
        className={cn(
          "relative inline-flex items-center",
          gapBySize[size],
          className,
        )}
      >
        <div
          ref={indicatorRef}
          aria-hidden
          className="pointer-events-none absolute top-0 bottom-0 rounded-full border border-sys-border-subtle bg-sys-surface-highlight opacity-0 shadow-sys-lg-diffused"
        />
        {children}
      </div>
    </TabGroupContext.Provider>
  );
}

export interface TabGroupItemProps {
  value: string;
  toggledIconWeight?: "bold" | "fill";
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}

function TabGroupItem({
  value,
  toggledIconWeight,
  disabled,
  className,
  children,
}: TabGroupItemProps) {
  const context = React.useContext(TabGroupContext);
  if (!context) {
    throw new Error("TabGroupItem must be used within a TabGroup");
  }

  const isSelected = context.value === value;
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  React.useLayoutEffect(() => {
    context.registerItem(value, buttonRef.current);
    return () => context.registerItem(value, null);
  }, [value, context.registerItem]);

  return (
    <Button
      ref={buttonRef}
      role="tab"
      variant="ghost"
      toggled={isSelected}
      toggledIconWeight={toggledIconWeight}
      size={context.size}
      shape="round"
      disabled={disabled}
      aria-selected={isSelected}
      className={cn(
        "z-[1]",
        isSelected &&
          "!bg-transparent hover:!bg-transparent !border-transparent !shadow-none",
        className,
      )}
      onClick={() => context.setValue(value)}
    >
      {children}
    </Button>
  );
}

export { TabGroup, TabGroupItem };
