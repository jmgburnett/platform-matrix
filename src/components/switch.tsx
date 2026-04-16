"use client";

import { Switch as SwitchPrimitive } from "radix-ui";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full border border-sys-border-subtle p-1 outline-none transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sys-focus-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-fit data-[size=sm]:h-fit data-[size=default]:w-12 data-[size=sm]:w-6 data-[state=checked]:border-fixed-accent data-[state=checked]:bg-fixed-accent data-[state=unchecked]:bg-sys-surface-deep",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full border border-sys-border bg-sys-surface-highlight shadow-sys-md ring-0 transition-all group-hover/switch:scale-110 data-[state=unchecked]:translate-x-0 data-[state=checked]:border-border-accent group-data-[size=default]/switch:size-5 group-data-[size=sm]/switch:size-3 data-[state=checked]:group-data-[size=default]/switch:translate-x-4.5 data-[state=checked]:group-data-[size=sm]/switch:translate-x-0.5",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
