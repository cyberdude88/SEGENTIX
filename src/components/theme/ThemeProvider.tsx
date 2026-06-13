"use client";

import * as React from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export const STORAGE_KEY = "aspm-theme";
const themeListeners = new Set<() => void>();

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light")
    ? "light"
    : "dark";
}

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    themeListeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function notifyThemeListeners() {
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = React.useSyncExternalStore<Theme>(
    subscribeTheme,
    readTheme,
    () => "dark",
  );

  const apply = React.useCallback((nextTheme: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("light", nextTheme === "light");
    root.classList.toggle("dark", nextTheme === "dark");

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {}

    notifyThemeListeners();
  }, []);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: apply,
      toggle: () => apply(theme === "dark" ? "light" : "dark"),
    }),
    [apply, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const value = React.useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}

export const themeInitScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=s==='light'||s==='dark'?s:'dark';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('dark');}})();`;
