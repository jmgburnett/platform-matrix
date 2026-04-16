"use client";

import { motion, useReducedMotion } from "motion/react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import * as React from "react";

import { useRadixChecked } from "@/hooks/use-radix-checked";
import { springPop, strokeTrim } from "@/lib/motion-presets";
import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  const prefersReduced = useReducedMotion();
  const ref = React.useRef<HTMLButtonElement>(null);
  const checked = useRadixChecked(ref);

  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      className={cn(
        "group/radio relative aspect-square size-5 shrink-0 rounded-full outline-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:bg-sys-surface-target disabled:opacity-50",
        "aria-invalid:ring-2 aria-invalid:ring-sys-border-danger/20",
        "dark:aria-invalid:ring-sys-border-danger/40",
        className,
      )}
      {...props}
    >
      <svg
        className="-rotate-90 absolute inset-0 size-full"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="10"
          cy="10"
          r="9"
          strokeWidth="1"
          className="stroke-sys-border-subtle transition-opacity duration-200 group-hover/radio:stroke-sys-border-contrast group-data-[state=checked]/radio:opacity-0"
        />
        <motion.circle
          cx="10"
          cy="10"
          r="9"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-secondary-fg-accent"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
          transition={strokeTrim(prefersReduced)}
        />
      </svg>
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        forceMount
        className="absolute inset-0 flex items-center justify-center"
      >
        <motion.div
          className="size-3 rounded-full bg-fixed-accent"
          initial={{ scale: 0 }}
          animate={{ scale: checked ? 1 : 0 }}
          transition={springPop(prefersReduced)}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
