/** Theme toggle hook — persists to localStorage and database (when signed in). */
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { updateMyProfile } from "@/lib/profile";

const KEY = "to_theme";

export function useTheme() {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const updateProfile = useServerFn(updateMyProfile);

  useEffect(() => {
    const saved = (localStorage.getItem(KEY) as "light" | "dark" | null) ?? "light";
    setThemeState(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const setTheme = useCallback(
    (next: "light" | "dark", { persist = true } = {}) => {
      setThemeState(next);
      localStorage.setItem(KEY, next);
      document.documentElement.classList.toggle("dark", next === "dark");
      if (persist) {
        updateProfile({ data: { dark_mode: next === "dark" } }).catch(() => {
          /* ignore — purely a preference sync */
        });
      }
    },
    [updateProfile],
  );

  const toggle = useCallback(() => setTheme(theme === "dark" ? "light" : "dark"), [theme, setTheme]);

  return { theme, setTheme, toggle };
}
