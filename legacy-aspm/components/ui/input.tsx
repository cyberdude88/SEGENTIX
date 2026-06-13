import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-8 w-full rounded-md bg-surface-2 border [border-width:0.5px] border-line-strong px-2.5 text-[13px] placeholder:text-fg-subtle focus:outline-none focus:border-accent-ring focus:bg-surface-3",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-8 rounded-md bg-surface-2 border [border-width:0.5px] border-line-strong px-2 pr-7 text-[13px] text-fg focus:outline-none focus:border-accent-ring appearance-none",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
