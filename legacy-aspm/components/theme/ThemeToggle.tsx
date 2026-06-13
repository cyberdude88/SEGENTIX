"use client";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Switch to day view" : "Switch to night view"}
      title={isDark ? "Day view" : "Night view"}
      onClick={toggle}
    >
      {isDark ? <Sun size={14} /> : <Moon size={14} />}
    </Button>
  );
}
