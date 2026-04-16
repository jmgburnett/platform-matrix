import type * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-16 w-full rounded-sm border border-sys-border-subtle bg-transparent px-3 py-3 text-label-md text-sys-fg leading-label-md shadow-xs outline-none transition-all duration-200 ease-out",
        "placeholder:text-sys-fg-muted placeholder:transition-colors placeholder:duration-200",
        "enabled:hover:border-sys-border-contrast enabled:hover:bg-sys-surface-highlight",
        "focus-visible:border-border-accent focus-visible:bg-sys-surface-highlight focus-visible:shadow-[inset_0_0_0_1px_var(--border-accent)] focus-visible:ring-0",
        "aria-invalid:border-sys-border-danger aria-invalid:bg-sys-surface-highlight aria-invalid:shadow-none aria-invalid:ring-0 enabled:aria-invalid:hover:border-sys-border-danger enabled:aria-invalid:hover:bg-sys-surface-highlight",
        "disabled:cursor-not-allowed disabled:border-sys-border-subtle disabled:bg-sys-surface-target disabled:text-sys-fg-muted disabled:opacity-50 disabled:shadow-xs",
        "disabled:placeholder:text-sys-fg-muted",
        "dark:bg-transparent dark:disabled:bg-sys-surface-target",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
