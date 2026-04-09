import { type VariantProps, cva } from "class-variance-authority";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center cursor-pointer whitespace-nowrap font-legible font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary !text-sys-fg-invert hover:bg-primary/90 hover:[&_[data-slot=leading-icon]_svg]:text-primary-fg-accent",
        secondary:
          "!bg-secondary/64 border border-transparent !text-sys-fg hover:!bg-secondary hover:border-border hover:[&_[data-slot=leading-icon]_svg]:text-secondary-fg-accent ",
        ghost:
          "border border-transparent !text-sys-fg-muted hover:bg-sys-surface-target hover:!text-sys-fg",
        destructive:
          "border border-sys-border-danger !text-sys-fg-danger hover:bg-sys-danger/10",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-label-md [&_svg]:size-icon-md",
        md: "h-10 px-4 text-label-md [&_svg]:size-icon-md",
        lg: "h-[3.125rem] px-5 text-label-lg [&_svg]:size-icon-lg",
      },
      shape: {
        round: "rounded-full",
        square: "rounded-md",
      },
      toggled: {
        true: "",
        false: "",
      },
      iconOnly: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "ghost",
        toggled: true,
        className:
          "bg-sys-surface-highlight hover:bg-sys-surface-highlight border border-sys-border-subtle shadow-sys-lg-diffused !text-sys-fg [&_svg]:text-secondary-fg-accent",
      },
      {
        variant: "primary",
        iconOnly: true,
        className:
          "hover:[&_svg]:text-primary-fg-accent focus-visible:[&_svg]:text-primary-fg-accent",
      },
      {
        variant: "secondary",
        iconOnly: true,
        className:
          "hover:[&_svg]:text-secondary-fg-accent focus-visible:[&_svg]:text-secondary-fg-accent",
      },
      {
        shape: "square",
        size: "sm",
        iconOnly: false,
        className: "rounded-full",
      },
      {
        shape: "square",
        size: "md",
        iconOnly: false,
        className: "h-auto min-h-10",
      },
      {
        shape: "square",
        size: "lg",
        iconOnly: false,
        className: "h-auto min-h-[3.125rem]",
      },
      { size: "sm", iconOnly: true, className: "px-0 size-8" },
      { size: "md", iconOnly: true, className: "px-0 size-10" },
      { size: "lg", iconOnly: true, className: "px-0 size-[3.125rem]" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "round",
      toggled: false,
      iconOnly: false,
    },
  },
);

export type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;
export type ButtonSize = NonNullable<
  VariantProps<typeof buttonVariants>["size"]
>;
export type ButtonShape = NonNullable<
  VariantProps<typeof buttonVariants>["shape"]
>;

export const gapBySize: Record<ButtonSize, string> = {
  sm: "gap-0.5",
  md: "gap-2",
  lg: "gap-4",
};

export const iconPaddingBySize: Record<
  ButtonSize,
  { leadingOnly: string; trailingOnly: string; both: string }
> = {
  sm: { leadingOnly: "pl-2", trailingOnly: "pr-2", both: "px-2" },
  md: { leadingOnly: "pl-3", trailingOnly: "pr-3", both: "px-3" },
  lg: { leadingOnly: "pl-4", trailingOnly: "pr-4", both: "px-4" },
};
