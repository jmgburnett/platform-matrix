import { Button, type ButtonProps } from "@/components/button";
import * as React from "react";

type IconButtonProps = Omit<
  ButtonProps,
  "iconOnly" | "leadingIcon" | "trailingIcon" | "children"
> & {
  icon: React.ReactNode;
  "aria-label": string;
};

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, ...props }, ref) => {
    return (
      <Button ref={ref} iconOnly {...props}>
        {icon}
      </Button>
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton, type IconButtonProps };
