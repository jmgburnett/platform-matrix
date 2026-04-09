"use client";

import { Avatar as AvatarPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

// ── Shape context ────────────────────────────────────────────────────

type AvatarShape = "circle" | "square";

const AvatarContext = React.createContext<AvatarShape>("circle");

function useAvatarShape() {
  return React.useContext(AvatarContext);
}

// ── Gradient placeholder profiles ────────────────────────────────────

interface BlobShape {
  rx: number;
  ry: number;
  /** SVG transform — combine translate, rotate, scale for positioning */
  transform: string;
  /** Radial gradient center (0–1 fractions) */
  gradientCenter: [number, number];
}

interface GradientProfile {
  name: string;
  base: string;
  accent: string;
  overlay: string;
  accentBlob: BlobShape;
  overlayBlob: BlobShape;
}

const PROFILES: GradientProfile[] = [
  {
    name: "sunset",
    base: "var(--yellow-500)",
    accent: "var(--red-500)",
    overlay: "var(--red-300)",
    accentBlob: {
      rx: 28,
      ry: 36,
      transform: "translate(12 -8) rotate(-30 40 40)",
      gradientCenter: [0.7, 0.6],
    },
    overlayBlob: {
      rx: 32,
      ry: 24,
      transform: "translate(-14 10) rotate(20 40 40)",
      gradientCenter: [0.3, 0.2],
    },
  },
  {
    name: "coral",
    base: "var(--red-500)",
    accent: "var(--yellow-500)",
    overlay: "var(--red-300)",
    accentBlob: {
      rx: 22,
      ry: 42,
      transform: "translate(-10 6) rotate(15 40 40)",
      gradientCenter: [0.25, 0.3],
    },
    overlayBlob: {
      rx: 38,
      ry: 20,
      transform: "translate(8 -12) rotate(-45 40 40)",
      gradientCenter: [0.7, 0.7],
    },
  },
  {
    name: "berry",
    base: "var(--red-300)",
    accent: "var(--purple-500)",
    overlay: "var(--pure-blue-900)",
    accentBlob: {
      rx: 18,
      ry: 44,
      transform: "translate(14 0) rotate(-70 40 40)",
      gradientCenter: [0.75, 0.5],
    },
    overlayBlob: {
      rx: 40,
      ry: 28,
      transform: "translate(-6 12) rotate(10 40 40)",
      gradientCenter: [0.5, 0.8],
    },
  },
  {
    name: "ember",
    base: "var(--yellow-500)",
    accent: "var(--green-900)",
    overlay: "var(--red-500)",
    accentBlob: {
      rx: 20,
      ry: 22,
      transform: "translate(10 14) rotate(50 40 40)",
      gradientCenter: [0.6, 0.75],
    },
    overlayBlob: {
      rx: 42,
      ry: 30,
      transform: "translate(-8 -10) rotate(-15 40 40)",
      gradientCenter: [0.35, 0.3],
    },
  },
  {
    name: "dusk",
    base: "var(--yellow-300)",
    accent: "var(--sage-900)",
    overlay: "var(--yellow-500)",
    accentBlob: {
      rx: 36,
      ry: 28,
      transform: "translate(-4 -12) rotate(-110 40 40)",
      gradientCenter: [0.5, 0.7],
    },
    overlayBlob: {
      rx: 24,
      ry: 20,
      transform: "translate(12 10) rotate(35 40 40)",
      gradientCenter: [0.3, 0.4],
    },
  },
  {
    name: "amethyst",
    base: "var(--purple-500)",
    accent: "var(--red-500)",
    overlay: "var(--pure-blue-900)",
    accentBlob: {
      rx: 26,
      ry: 38,
      transform: "translate(-12 8) rotate(-50 40 40)",
      gradientCenter: [0.3, 0.6],
    },
    overlayBlob: {
      rx: 34,
      ry: 26,
      transform: "translate(10 -6) rotate(65 40 40)",
      gradientCenter: [0.65, 0.35],
    },
  },
];

const MONO_COLORS = {
  base: "var(--ref-mid)",
  accent: "var(--ref-light-accent)",
  overlay: "var(--ref-dark-accent)",
} as const;

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

// ── Avatar ───────────────────────────────────────────────────────────

/**
 * Root container. For gradient placeholders without an image, pass `seed` on
 * `AvatarFallback` or `profileIndex` on `AvatarPlaceholder` so the profile is
 * stable and intentional; otherwise the first profile is used (SSR-safe).
 */
function Avatar({
  className,
  shape = "circle",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  shape?: AvatarShape;
}) {
  return (
    <AvatarContext.Provider value={shape}>
      <AvatarPrimitive.Root
        data-slot="avatar"
        data-shape={shape}
        className={cn(
          "relative flex size-10 shrink-0 overflow-hidden",
          shape === "circle" ? "rounded-full" : "rounded-[var(--radius-lg)]",
          className,
        )}
        {...props}
      />
    </AvatarContext.Provider>
  );
}

// ── AvatarImage ──────────────────────────────────────────────────────

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

// ── AvatarFallback ───────────────────────────────────────────────────

function AvatarFallback({
  className,
  children,
  seed,
  mono,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> & {
  /**
   * Passed to the auto-rendered `AvatarPlaceholder` when no children are
   * provided. Omit for the default profile; pass a stable string (e.g. user
   * id) for a deterministic profile, or render `AvatarPlaceholder` with
   * `profileIndex` for a fixed choice.
   */
  seed?: string;
  /** Passed to the auto-rendered AvatarPlaceholder when no children are provided. */
  mono?: boolean;
}) {
  const shape = useAvatarShape();
  const hasChildren = children != null && children !== false && children !== "";

  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center bg-sys-surface-sunken font-sans text-label-md text-sys-fg-muted tracking-heading",
        shape === "circle" ? "rounded-full" : "rounded-[var(--radius-lg)]",
        !hasChildren && "p-0",
        className,
      )}
      {...props}
    >
      {hasChildren ? children : <AvatarPlaceholder seed={seed} mono={mono} />}
    </AvatarPrimitive.Fallback>
  );
}

// ── AvatarPlaceholder ────────────────────────────────────────────────

function AvatarPlaceholder({
  className,
  seed,
  profileIndex,
  mono = false,
  ...props
}: Omit<React.ComponentProps<"svg">, "children"> & {
  /**
   * Deterministic seed (e.g. user ID). Overrides profileIndex. With neither
   * seed nor profileIndex, profile 0 is used (stable for SSR and hydration).
   */
  seed?: string;
  /**
   * Force a specific profile (0-5). Ignored when seed is provided. Use with or
   * instead of seed for a non-default profile.
   */
  profileIndex?: number;
  /** Use monochrome color theme reference tokens instead. */
  mono?: boolean;
}) {
  const resolvedIndex = React.useMemo(() => {
    if (seed != null) return hashSeed(seed) % PROFILES.length;
    if (profileIndex != null)
      return (
        ((profileIndex % PROFILES.length) + PROFILES.length) % PROFILES.length
      );
    return 0;
  }, [seed, profileIndex]);

  const profile = PROFILES[resolvedIndex];
  const colors = mono
    ? {
        base: MONO_COLORS.base,
        accent: MONO_COLORS.accent,
        overlay: MONO_COLORS.overlay,
      }
    : { base: profile.base, accent: profile.accent, overlay: profile.overlay };
  const id = React.useId();

  return (
    <svg
      viewBox="0 0 80 80"
      overflow="visible"
      xmlns="http://www.w3.org/2000/svg"
      data-slot="avatar-placeholder"
      data-profile={profile.name}
      aria-hidden="true"
      className={cn("size-full", className)}
      {...props}
    >
      <defs>
        <filter id={`${id}-blur`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter
          id={`${id}-blur-lg`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <radialGradient id={`${id}-base`} cx="0.5" cy="0.5" r="0.6">
          <stop offset="0%" style={{ stopColor: `hsl(${colors.base})` }} />
          <stop offset="100%" style={{ stopColor: `hsl(${colors.accent})` }} />
        </radialGradient>
        <radialGradient
          id={`${id}-accent`}
          cx={profile.accentBlob.gradientCenter[0]}
          cy={profile.accentBlob.gradientCenter[1]}
          r="0.55"
        >
          <stop offset="0%" style={{ stopColor: `hsl(${colors.accent})` }} />
          <stop
            offset="100%"
            style={{ stopColor: `hsl(${colors.base} / 0)` }}
          />
        </radialGradient>
        <radialGradient
          id={`${id}-overlay`}
          cx={profile.overlayBlob.gradientCenter[0]}
          cy={profile.overlayBlob.gradientCenter[1]}
          r="0.5"
        >
          <stop offset="0%" style={{ stopColor: `hsl(${colors.overlay})` }} />
          <stop
            offset="100%"
            style={{ stopColor: `hsl(${colors.overlay} / 0)` }}
          />
        </radialGradient>
      </defs>

      <g>
        <rect
          x="-10"
          y="-10"
          width="100"
          height="100"
          fill={`url(#${id}-base)`}
        />
        <ellipse
          cx="40"
          cy="40"
          rx={profile.accentBlob.rx}
          ry={profile.accentBlob.ry}
          fill={`url(#${id}-accent)`}
          filter={`url(#${id}-blur)`}
          transform={profile.accentBlob.transform}
        />
        <ellipse
          cx="40"
          cy="40"
          rx={profile.overlayBlob.rx}
          ry={profile.overlayBlob.ry}
          fill={`url(#${id}-overlay)`}
          filter={`url(#${id}-blur-lg)`}
          style={{ mixBlendMode: "overlay" }}
          transform={profile.overlayBlob.transform}
        />
      </g>
    </svg>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarPlaceholder, PROFILES };
