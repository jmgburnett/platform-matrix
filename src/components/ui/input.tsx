import type * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-sm border border-sys-border-subtle bg-transparent px-3 text-label-md text-sys-fg leading-label-md shadow-xs outline-none transition-all duration-200 ease-out",
        "placeholder:text-sys-fg-muted placeholder:transition-colors placeholder:duration-200",
        "selection:bg-primary selection:text-primary-foreground",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-label-sm file:text-sys-fg",
        "enabled:hover:border-sys-border-contrast enabled:hover:bg-sys-surface-highlight",
        "focus-visible:border-border-accent focus-visible:bg-sys-surface-highlight focus-visible:shadow-[inset_0_0_0_1px_var(--border-accent)] focus-visible:ring-0",
        "aria-invalid:border-sys-border-danger aria-invalid:bg-sys-surface-highlight aria-invalid:shadow-none aria-invalid:ring-0 enabled:aria-invalid:hover:border-sys-border-danger enabled:aria-invalid:hover:bg-sys-surface-highlight",
        "disabled:cursor-not-allowed disabled:border-sys-border-subtle disabled:bg-sys-surface-target disabled:text-sys-fg-muted disabled:opacity-50 disabled:shadow-xs",
        "disabled:placeholder:text-sys-fg-muted disabled:file:text-sys-fg-muted",
        "dark:bg-transparent dark:disabled:bg-sys-surface-target",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
