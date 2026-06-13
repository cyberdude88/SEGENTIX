import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-8 w-full border border-accent/25 bg-bg/40 px-2.5 text-[13px] placeholder:text-fg-subtle focus:outline-none focus:border-accent/80 focus:bg-accent/5",
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
      "h-8 border border-accent/25 bg-bg/40 px-2 pr-7 text-[13px] text-fg focus:outline-none focus:border-accent/80 appearance-none [&>option]:bg-bg [&>option]:text-fg",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
