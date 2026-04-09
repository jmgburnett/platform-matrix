"use client";

import { cn } from "@/lib/utils";
import {
  type ButtonSize,
  gapBySize,
} from "@/lib/button.config";
import * as React from "react";

type ButtonGroupVariant = "default" | "bordered";

export interface ButtonGroupProps {
  variant?: ButtonGroupVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

const ButtonGroupContext = React.createContext<{ size?: ButtonSize } | null>(
  null,
);

export function useButtonGroupContext() {
  return React.useContext(ButtonGroupContext);
}

function ButtonGroup({
  variant = "default",
  size = "md",
  className,
  children,
}: ButtonGroupProps) {
  const ctx = React.useMemo(() => ({ size }), [size]);

  return (
    <ButtonGroupContext.Provider value={ctx}>
      {/* biome-ignore lint/a11y/useSemanticElements: fieldset default styles conflict with flex layout */}
      <div
        role="group"
        className={cn(
          "inline-flex items-center",
          variant === "bordered"
            ? "-m-px [&>button]:!h-full self-stretch overflow-hidden border border-sys-border-subtle bg-sys-surface [&>button]:rounded-none"
            : gapBySize[size],
          className,
        )}
      >
        {children}
      </div>
    </ButtonGroupContext.Provider>
  );
}

export { ButtonGroup };
