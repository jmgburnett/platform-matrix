import * as React from "react";

/**
 * Tracks Radix `data-state="checked"` on a ref'd element via MutationObserver.
 * Returns a stable boolean suitable for driving motion animations.
 */
export function useRadixChecked(
  ref: React.RefObject<HTMLElement | null>,
): boolean {
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setChecked(el.getAttribute("data-state") === "checked");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(el, { attributes: true, attributeFilter: ["data-state"] });
    return () => observer.disconnect();
  }, [ref]);

  return checked;
}
