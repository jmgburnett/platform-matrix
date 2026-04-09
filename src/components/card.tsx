"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/button-group";

/* ==========================================================================
   Card — Two root primitives sharing a unified slot system.

   Card (vertical):
   ┌──────────────────────────────────┐
   │ graphic-top                      │
   ├──────────────────────────────────┤
   │ header                           │
   ├──────────────────────────────────┤
   │ callout                          │
   ├──────────────────────────────────┤
   │ body                             │
   ├──────────────────────────────────┤
   │ graphic-bottom                   │
   ├──────────────────────────────────┤
   │ footer                           │
   └──────────────────────────────────┘
   White surface, subtle border.
   Hover: border elevates, backdrop-blur, diffused shadow.

   CardHorizontal:
   ┌────────────┬──────────┬─────────────┐
   │ graphic-   │ header   │ graphic-    │   + CardHorizontalFooter
   │ left       ├──────────┤ right       │     (absolutely positioned,
   │            │ callout  │  (rotates   │      hidden → revealed on hover,
   │            ├──────────┤   on hover) │      floats outside right edge)
   │            │ body     │             │
   └────────────┴──────────┴─────────────┘
   sys-surface-sunken background, no border.
   Hover: right graphic rotates + shadow; footer slides out from behind
   the right graphic with no gap, keeping buttons inside the hit area.

   Variants: CardLink (clickable), CardSkeleton.
   Shared slots: CardHeader, CardHeaderLabel, CardCallout, CardCalloutText,
   CardBody, CardTitle, CardDescription, CardHeaderTrailing, CardGraphic,
   CardGraphicImage.
   ========================================================================== */

// ── Card context ──────────────────────────────────────────────────────

interface CardContextValue {
  orientation: "vertical" | "horizontal";
  responsive: boolean;
  hasBackgroundImage: boolean;
  registerBackgroundImage: () => () => void;
  registerImage: () => () => void;
}

const CardContext = React.createContext<CardContextValue | null>(null);

function useCardContext() {
  return React.useContext(CardContext);
}

// ── Grid area mapping ─────────────────────────────────────────────────

const gridAreaMap: Record<string, string> = {
  "card-graphic-top": "[grid-area:graphic-top]",
  "card-graphic-bottom": "[grid-area:graphic-bottom]",
  "card-graphic-left": "[grid-area:graphic-left]",
  "card-graphic-right": "[grid-area:graphic-right]",
  "card-header": "[grid-area:header]",
  "card-callout": "[grid-area:callout]",
  "card-body": "[grid-area:body]",
  "card-footer": "[grid-area:footer]",
  "card-background-image": "[grid-area:1/1/-1/-1]",
};

// ── Shared context provider ───────────────────────────────────────────

function useCardProvider(
  orientation: "vertical" | "horizontal",
  responsive = false,
) {
  const [bgImageCount, setBgImageCount] = React.useState(0);
  const [imageCount, setImageCount] = React.useState(0);

  const registerBackgroundImage = React.useCallback(() => {
    setBgImageCount((c) => c + 1);
    return () => setBgImageCount((c) => c - 1);
  }, []);

  const registerImage = React.useCallback(() => {
    setImageCount((c) => c + 1);
    return () => setImageCount((c) => c - 1);
  }, []);

  React.useEffect(() => {
    if (process.env.NODE_ENV === "development" && imageCount > 1) {
      console.warn(
        "Card: Only one CardGraphicImage should be rendered per card. Found %d.",
        imageCount,
      );
    }
  }, [imageCount]);

  return React.useMemo<CardContextValue>(
    () => ({
      orientation,
      responsive,
      hasBackgroundImage: bgImageCount > 0,
      registerBackgroundImage,
      registerImage,
    }),
    [
      orientation,
      responsive,
      bgImageCount,
      registerBackgroundImage,
      registerImage,
    ],
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Card (vertical root)
// ══════════════════════════════════════════════════════════════════════

const verticalGridClasses =
  "grid-cols-[1fr] grid-rows-[repeat(6,auto)] [grid-template-areas:'graphic-top'_'header'_'callout'_'body'_'graphic-bottom'_'footer']";

const verticalBaseClasses =
  "group/card relative grid overflow-clip rounded-[var(--radius-lg)] border border-sys-border-subtle bg-card text-card-foreground min-w-[240px] max-w-[420px]";

const verticalHoverClasses =
  "transition-[border-color,box-shadow,backdrop-filter,scale] duration-[var(--duration-moderate)] hover:border-sys-border hover:backdrop-blur-[6px] hover:shadow-[var(--shadow-sys-lg-diffused)] hover:scale-[1.006]";

function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  const ctx = useCardProvider("vertical");

  return (
    <CardContext.Provider value={ctx}>
      <div
        data-slot="card"
        data-orientation="vertical"
        className={cn(
          verticalBaseClasses,
          verticalGridClasses,
          verticalHoverClasses,
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  CardLink (clickable vertical card)
// ══════════════════════════════════════════════════════════════════════

function CardLink({
  className,
  children,
  ...props
}: React.ComponentProps<"a">) {
  const ctx = useCardProvider("vertical");

  return (
    <CardContext.Provider value={ctx}>
      <a
        data-slot="card"
        data-orientation="vertical"
        className={cn(
          verticalBaseClasses,
          verticalGridClasses,
          verticalHoverClasses,
          "cursor-pointer no-underline focus-visible:outline-2 focus-visible:outline-sys-focus-ring focus-visible:outline-offset-2",
          className,
        )}
        {...props}
      >
        {children}
      </a>
    </CardContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  CardHorizontal (horizontal root)
// ══════════════════════════════════════════════════════════════════════

function CardHorizontal({
  className,
  children,
  responsive = false,
  ...props
}: React.ComponentProps<"div"> & {
  /** Collapse to a vertical stack below the `sm:` breakpoint. */
  responsive?: boolean;
}) {
  const ctx = useCardProvider("horizontal", responsive);

  return (
    <CardContext.Provider value={ctx}>
      <div
        data-slot="card"
        data-orientation="horizontal"
        className={cn(
          "group/card relative grid rounded-[var(--radius-lg)] bg-sys-surface-sunken text-card-foreground",
          "transition-[background-color,scale] duration-[var(--duration-moderate)] hover:scale-[1.015] hover:bg-transparent",
          responsive
            ? [
                "grid-cols-[1fr] grid-rows-[repeat(5,auto)]",
                "[grid-template-areas:'graphic-left'_'header'_'callout'_'body'_'graphic-right']",
                "sm:min-h-[180px] sm:grid-cols-[auto_1fr_auto] sm:grid-rows-[auto_auto_1fr]",
                "sm:[grid-template-areas:'graphic-left_header_graphic-right'_'graphic-left_callout_graphic-right'_'graphic-left_body_graphic-right']",
              ]
            : [
                "min-h-[180px] min-w-[480px]",
                "grid-cols-[auto_1fr_auto] grid-rows-[auto_auto_1fr]",
                "[grid-template-areas:'graphic-left_header_graphic-right'_'graphic-left_callout_graphic-right'_'graphic-left_body_graphic-right']",
              ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Shared slot components
// ══════════════════════════════════════════════════════════════════════

// ── CardHeader ────────────────────────────────────────────────────────

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const ctx = useCardContext();

  return (
    <div
      data-slot="card-header"
      className={cn(
        gridAreaMap["card-header"],
        ctx?.hasBackgroundImage && "relative",
        "flex max-h-[68px] min-h-[68px] w-full shrink-0 items-center justify-end gap-2 p-4 [[data-slot=card-graphic]_&]:max-h-none [[data-slot=card-graphic]_&]:min-h-0 [[data-slot=card-graphic]_&]:p-2",
        className,
      )}
      {...props}
    />
  );
}

// ── CardHeaderLabel ───────────────────────────────────────────────────

function CardHeaderLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header-label"
      className={cn("flex flex-1 items-center gap-2 self-stretch", className)}
      {...props}
    />
  );
}

// ── CardGraphic ───────────────────────────────────────────────────────

function CardGraphic({
  className,
  aspectRatio,
  padded = true,
  position,
  ...props
}: React.ComponentProps<"div"> & {
  aspectRatio?: "square" | "video" | "landscape";
  padded?: boolean;
  position?: "top" | "bottom" | "left" | "right";
}) {
  const ctx = useCardContext();
  const isHorizontal = ctx?.orientation === "horizontal";
  const defaultArea = isHorizontal
    ? gridAreaMap["card-graphic-left"]
    : gridAreaMap["card-graphic-top"];
  const resolvedArea = position
    ? gridAreaMap[`card-graphic-${position}`]
    : defaultArea;

  const isRightHorizontal = isHorizontal && position === "right";
  const isResponsiveHorizontal = isHorizontal && (ctx?.responsive ?? false);

  return (
    <div
      data-slot="card-graphic"
      className={cn(
        "relative shrink-0",
        resolvedArea,
        padded
          ? "p-2 [--graphic-radius:var(--radius-sm)]"
          : "[--graphic-radius:0px]",
        isResponsiveHorizontal
          ? "aspect-video w-full sm:aspect-square sm:h-full sm:w-auto"
          : isHorizontal
            ? "aspect-square h-full"
            : "w-full",
        aspectRatio === "square" && "aspect-square",
        aspectRatio === "video" && "aspect-video",
        aspectRatio === "landscape" && "aspect-[4/3]",
        isRightHorizontal &&
          (isResponsiveHorizontal
            ? "z-10 transition-transform duration-[var(--duration-base)] sm:group-hover/card:rotate-2"
            : "z-10 transition-transform duration-[var(--duration-base)] group-hover/card:rotate-2"),
        className,
      )}
      {...props}
    />
  );
}

// ── CardGraphicImage ──────────────────────────────────────────────────

function CardGraphicImage({
  className,
  src,
  alt = "",
  overlay = true,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  src: string;
  alt?: string;
  overlay?: boolean;
}) {
  const ctx = useCardContext();

  React.useEffect(() => {
    if (!ctx) return;
    return ctx.registerImage();
  }, [ctx]);

  return (
    <div
      aria-hidden={!alt || undefined}
      data-slot="card-graphic-image"
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[var(--graphic-radius)] [filter:drop-shadow(0_4px_12px_var(--sys-elevation))]",
        className,
      )}
      {...props}
    >
      <img
        alt={alt}
        src={src}
        className="absolute inset-0 size-full rounded-[inherit] object-cover"
      />
      {overlay && (
        <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-[32%] from-sys-elevation-subtle to-sys-elevation-heavy" />
      )}
    </div>
  );
}

// ── CardCallout ───────────────────────────────────────────────────────

function CardCallout({
  className,
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  icon: React.ReactNode;
}) {
  const ctx = useCardContext();

  return (
    <div
      data-slot="card-callout"
      className={cn(
        gridAreaMap["card-callout"],
        ctx?.hasBackgroundImage && "relative",
        "flex max-h-[200px] w-full shrink-0 items-start gap-2 px-4 pt-4",
        className,
      )}
      {...props}
    >
      {children}
      <span className="shrink-0 text-secondary-fg-accent [&>svg]:size-icon-lg">
        {icon}
      </span>
    </div>
  );
}

// ── CardCalloutText ───────────────────────────────────────────────────

function CardCalloutText({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="card-callout-text"
      className={cn(
        "shrink-0 whitespace-nowrap font-sans text-display-md leading-[var(--text-display-md--line-height)] tracking-heading",
        className,
      )}
      {...props}
    />
  );
}

// ── CardBody ──────────────────────────────────────────────────────────

function CardBody({ className, ...props }: React.ComponentProps<"div">) {
  const ctx = useCardContext();

  return (
    <div
      data-slot="card-body"
      className={cn(
        gridAreaMap["card-body"],
        ctx?.hasBackgroundImage && "relative",
        "flex max-h-[200px] w-full flex-1 flex-col items-start justify-center gap-1 overflow-clip px-4 py-3",
        "[[data-slot=card]:has([data-slot=card-callout])_&]:pt-1",
        className,
      )}
      {...props}
    />
  );
}

// ── CardTitle ─────────────────────────────────────────────────────────

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "w-full shrink-0 font-sans text-secondary-fg-muted text-xl leading-7 tracking-heading",
        className,
      )}
      {...props}
    />
  );
}

// ── CardDescription ──────────────────────────────────────────────────

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "line-clamp-3 w-full shrink-0 font-legible text-body-sm text-sys-fg leading-[var(--text-body-sm--line-height)] tracking-body",
        className,
      )}
      {...props}
    />
  );
}

// ── CardHeaderTrailing ────────────────────────────────────────────────

function CardHeaderTrailing({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header-trailing"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Vertical-only slot components
// ══════════════════════════════════════════════════════════════════════

// ── CardFooter (vertical) ────────────────────────────────────────────

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const ctx = useCardContext();

  return (
    <div
      data-slot="card-footer"
      className={cn(
        gridAreaMap["card-footer"],
        ctx?.hasBackgroundImage && "relative",
        "flex max-h-14 min-h-14 w-full items-center justify-end gap-2 overflow-clip border-sys-border-subtle border-t pl-4",
        className,
      )}
      {...props}
    />
  );
}

// ── CardFooterLeading ─────────────────────────────────────────────────

function CardFooterLeading({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer-leading"
      className={cn("flex flex-1 flex-col items-start", className)}
      {...props}
    />
  );
}

// ── CardFooterActions ─────────────────────────────────────────────────

function CardFooterActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer-actions"
      className={cn("flex items-center self-stretch", className)}
      {...props}
    >
      <ButtonGroup variant="bordered">{children}</ButtonGroup>
    </div>
  );
}

// ── CardBackgroundImage ───────────────────────────────────────────────

function CardBackgroundImage({
  className,
  src,
  alt = "",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  src: string;
  alt?: string;
}) {
  const ctx = useCardContext();

  React.useEffect(() => {
    if (!ctx) return;
    return ctx.registerBackgroundImage();
  }, [ctx]);

  return (
    <div
      aria-hidden
      data-slot="card-background-image"
      className={cn(
        gridAreaMap["card-background-image"],
        "pointer-events-none absolute inset-0",
        className,
      )}
      {...props}
    >
      <img
        alt={alt}
        src={src}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sys-elevation to-sys-elevation-opaque" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  Horizontal-only slot components
// ══════════════════════════════════════════════════════════════════════

// ── CardHorizontalFooter ──────────────────────────────────────────────
// Absolutely positioned action bar that slides out from behind the right
// graphic on hover. Zero gap between card edge and footer keeps the mouse
// inside the card's hit area so buttons remain interactive.

function CardHorizontalFooter({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const ctx = useCardContext();

  return (
    <div
      data-slot="card-horizontal-footer"
      className={cn(
        "absolute inset-y-0 right-0 z-0 flex-col items-center justify-center gap-0.5 px-1",
        "-translate-x-full pointer-events-none",
        "transition-transform duration-[var(--duration-moderate)]",
        "group-hover/card:pointer-events-auto group-hover/card:translate-x-full",
        "group-focus-within/card:pointer-events-auto group-focus-within/card:translate-x-full",
        "flex",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════
//  CardSkeleton (loading placeholder)
// ══════════════════════════════════════════════════════════════════════

function CardSkeleton({
  className,
  showGraphic = true,
  showFooter = true,
  aspectRatio = "landscape",
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  showGraphic?: boolean;
  showFooter?: boolean;
  aspectRatio?: "square" | "video" | "landscape";
}) {
  return (
    <div
      data-slot="card-skeleton"
      aria-hidden
      className={cn(
        "relative grid min-w-[240px] max-w-[420px] overflow-clip rounded-[var(--radius-lg)] border border-sys-border-subtle bg-card",
        verticalGridClasses,
        className,
      )}
      {...props}
    >
      {showGraphic && (
        <div className="p-2 [grid-area:graphic-top]">
          <div
            className={cn(
              "w-full animate-pulse rounded-[var(--radius-sm)] bg-sys-surface-sunken",
              aspectRatio === "square" && "aspect-square",
              aspectRatio === "video" && "aspect-video",
              aspectRatio === "landscape" && "aspect-[4/3]",
            )}
          />
        </div>
      )}
      <div className="flex max-h-[68px] min-h-[68px] items-center gap-2 p-4 [grid-area:header]">
        <div className="size-10 animate-pulse rounded-sm bg-sys-surface-sunken" />
        <div className="h-3 flex-1 animate-pulse rounded-sm bg-sys-surface-sunken" />
      </div>
      <div className="flex flex-col gap-1.5 px-4 pt-1 pb-3 [grid-area:body]">
        <div className="h-5 w-3/4 animate-pulse rounded-sm bg-sys-surface-sunken" />
        <div className="h-3 w-full animate-pulse rounded-sm bg-sys-surface-sunken" />
      </div>
      {showFooter && (
        <div className="flex max-h-14 min-h-14 items-center justify-end gap-2 border-sys-border-subtle border-t px-4 [grid-area:footer]">
          <div className="h-3 w-16 flex-1 animate-pulse rounded-sm bg-sys-surface-sunken" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-sys-surface-sunken" />
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════

export {
  Card,
  CardLink,
  CardHorizontal,
  CardSkeleton,
  CardHeader,
  CardHeaderLabel,
  CardFooter,
  CardFooterLeading,
  CardFooterActions,
  CardTitle,
  CardHeaderTrailing,
  CardDescription,
  CardGraphic,
  CardGraphicImage,
  CardCallout,
  CardCalloutText,
  CardBody,
  CardBackgroundImage,
  CardHorizontalFooter,
};
