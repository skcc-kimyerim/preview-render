import React from "react";
import { cn } from "../utils/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "border-none bg-gray-100 disabled:pointer-events-none disabled:opacity-50 p-2 rounded",
          {
            // Sizes
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 py-1": size === "sm",
            "h-11 px-6 py-3": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
