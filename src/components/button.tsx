"use client";

import { SpinnerGap } from "@phosphor-icons/react";
import type { VariantProps } from "class-variance-authority";
import { Slot as SlotPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";
import {
  buttonVariants,
  iconPaddingBySize,
} from "@/lib/button.config";

type IconWeight = "bold" | "fill";

function reweightIcons(
  node: React.ReactNode,
  weight: IconWeight,
): React.ReactNode {
  return React.Children.map(node, (child) => {
    if (React.isValidElement<{ weight?: string }>(child)) {
      return React.cloneElement(child, { weight });
    }
    return child;
  });
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  toggled?: boolean;
  toggledIconWeight?: IconWeight;
  iconOnly?: boolean;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      toggled,
      toggledIconWeight = "bold",
      iconOnly = false,
      isLoading = false,
      leadingIcon,
      trailingIcon,
      asChild = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const hasLeading = !iconOnly && !!leadingIcon;
    const hasTrailing = !iconOnly && !!trailingIcon;
    const resolvedSize = size ?? "md";
    const iconPadding =
      hasLeading && hasTrailing
        ? iconPaddingBySize[resolvedSize].both
        : hasLeading
          ? iconPaddingBySize[resolvedSize].leadingOnly
          : hasTrailing
            ? iconPaddingBySize[resolvedSize].trailingOnly
            : undefined;

    const variantClasses = cn(
      buttonVariants({
        variant,
        size,
        shape,
        toggled,
        iconOnly,
        className,
      }),
      iconPadding,
    );
    if (asChild) {
      return (
        <SlotPrimitive.Slot className={variantClasses} ref={ref} {...props}>
          {children}
        </SlotPrimitive.Slot>
      );
    }

    const resolvedChildren = toggled
      ? reweightIcons(children, toggledIconWeight)
      : children;

    return (
      <button
        className={variantClasses}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <SpinnerGap className="animate-spin" />
          </span>
        )}
        {iconOnly ? (
          <span className={cn(isLoading && "invisible")}>
            {resolvedChildren}
          </span>
        ) : (
          <span
            className={cn(
              "inline-flex items-center gap-1.5",
              isLoading && "invisible",
            )}
          >
            {leadingIcon && (
              <span className="contents" data-slot="leading-icon">
                {toggled
                  ? reweightIcons(leadingIcon, toggledIconWeight)
                  : leadingIcon}
              </span>
            )}
            <span className="inline-flex items-center">{resolvedChildren}</span>
            {trailingIcon && (
              <span className="contents" data-slot="trailing-icon">
                {toggled
                  ? reweightIcons(trailingIcon, toggledIconWeight)
                  : trailingIcon}
              </span>
            )}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
