"use client";

import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        "group/input-group relative flex w-full items-center rounded-sm border border-sys-border-subtle shadow-xs outline-none transition-all duration-200 ease-out",
        "h-10 min-w-0 has-[>textarea]:h-auto",

        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",

        "not-has-[:disabled]:not-has-[[data-slot=input-group-control]:focus-visible]:hover:border-sys-border-contrast not-has-[:disabled]:not-has-[[data-slot=input-group-control]:focus-visible]:hover:bg-sys-surface-highlight",

        "has-[[data-slot=input-group-control]:focus-visible]:border-border-accent has-[[data-slot=input-group-control]:focus-visible]:bg-sys-surface-highlight has-[[data-slot=input-group-control]:focus-visible]:shadow-[inset_0_0_0_1px_var(--border-accent)] has-[[data-slot=input-group-control]:focus-visible]:ring-0",

        "has-[[data-slot][aria-invalid=true]]:border-sys-border-danger has-[[data-slot][aria-invalid=true]]:bg-sys-surface-highlight has-[[data-slot][aria-invalid=true]]:shadow-none has-[[data-slot][aria-invalid=true]]:ring-0 not-has-[:disabled]:has-[[data-slot][aria-invalid=true]]:hover:border-sys-border-danger not-has-[:disabled]:has-[[data-slot][aria-invalid=true]]:hover:bg-sys-surface-highlight",

        "has-[:disabled]:cursor-not-allowed has-[:disabled]:border-sys-border-subtle has-[:disabled]:bg-sys-surface-target has-[:disabled]:opacity-50 has-[:disabled]:shadow-xs",

        className,
      )}
      {...props}
    />
  );
}

const inputGroupAddonVariants = cva(
  [
    "flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-label-md font-medium text-sys-fg-muted transition-colors duration-200 ease-out select-none",
    "group-has-[:disabled]/input-group:text-sys-fg-muted",
    "[&>kbd]:rounded-[calc(var(--radius)-5px)]",
    "group-has-[[data-slot=input-group-control]:focus-visible]/input-group:text-secondary-fg-muted",
    "group-has-[[data-slot][aria-invalid=true]]/input-group:text-sys-fg-danger",
  ].join(" "),
  {
    variants: {
      align: {
        "inline-start": [
          "order-first pl-3 text-sys-fg",
          "has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
          "group-has-[[data-slot=input-group-control]:focus-visible]/input-group:text-secondary-fg-accent",
          "[&>svg:not([class*='size-'])]:size-icon-md",
        ].join(" "),
        "inline-end":
          "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem] [&>svg:not([class*='size-'])]:size-icon-sm",
        "block-start":
          "order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3 [&>svg:not([class*='size-'])]:size-icon-sm",
        "block-end":
          "order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3 [&>svg:not([class*='size-'])]:size-icon-sm",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  },
);

function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      }}
      {...props}
    />
  );
}

const inputGroupButtonVariants = cva(
  "flex items-center gap-2 text-sm shadow-none",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 has-[>svg]:px-2 [&>svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-2.5 has-[>svg]:px-2.5",
        "icon-xs":
          "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0",
      },
    },
    defaultVariants: {
      size: "xs",
    },
  },
);

function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "flex items-center gap-2 text-inherit text-label-md [&_svg:not([class*='size-'])]:size-icon-sm [&_svg]:pointer-events-none",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        "h-auto flex-1 rounded-none border-0 bg-transparent shadow-none",
        "hover:border-0 hover:bg-transparent",
        "focus-visible:border-0 focus-visible:bg-transparent focus-visible:shadow-none focus-visible:ring-0",
        "aria-invalid:border-0 aria-invalid:bg-transparent aria-invalid:ring-0",
        "disabled:bg-transparent dark:disabled:bg-transparent",
        "disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        "flex-1 resize-none rounded-none border-0 bg-transparent shadow-none",
        "hover:border-0 hover:bg-transparent",
        "focus-visible:border-0 focus-visible:bg-transparent focus-visible:shadow-none focus-visible:ring-0",
        "aria-invalid:border-0 aria-invalid:bg-transparent aria-invalid:ring-0",
        "disabled:bg-transparent dark:disabled:bg-transparent",
        "disabled:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
