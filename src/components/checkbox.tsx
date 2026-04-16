"use client";

import { motion, useReducedMotion } from "motion/react";
import { Checkbox as CheckboxPrimitive } from "radix-ui";
import * as React from "react";

import { useRadixChecked } from "@/hooks/use-radix-checked";
import { strokeTrim } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLButtonElement>(null);
  const checked = useRadixChecked(ref);

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot="checkbox"
      className={cn(
        "peer size-5 shrink-0 rounded-sm border border-sys-border-subtle shadow-sys-sm outline-none transition-all duration-200 ease-out hover:border-sys-border-contrast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-sys-border-danger aria-invalid:ring-sys-border-danger/20 data-[state=checked]:border-fixed-accent data-[state=checked]:bg-fixed-accent data-[state=checked]:text-sys-fg-invert dark:bg-sys-border/30 dark:data-[state=checked]:border-fixed-accent dark:data-[state=checked]:bg-fixed-accent dark:aria-invalid:ring-sys-border-danger/40",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        forceMount
        className="grid place-content-center text-current"
      >
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="size-4"
          aria-hidden="true"
        >
          <motion.path
            d="M3.5 8.5L6.5 11.5L12.5 4.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="stroke-current"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={strokeTrim(prefersReduced)}
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
