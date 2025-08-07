import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    return (
      <button
        className="border-2 border-gray-300 rounded text-sm flex items-center gap-1 py-1 px-2 rounded disabled:pointer-events-none disabled:opacity-50"
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
