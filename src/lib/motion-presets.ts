import type { Transition } from "motion/react";

const EASE_DRAW = [0.22, 1, 0.36, 1] as const;
const INSTANT: Transition = { duration: 0 };

export const strokeTrim = (reduced: boolean | null): Transition =>
  reduced
    ? INSTANT
    : {
        pathLength: { duration: 0.5, ease: EASE_DRAW },
        opacity: { duration: 0.05 },
      };

export const springPop = (reduced: boolean | null): Transition =>
  reduced ? INSTANT : { type: "spring", stiffness: 500, damping: 30 };
