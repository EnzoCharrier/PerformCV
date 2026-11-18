import { useEffect, useState } from "react";

function getInitialTheme() {
  // Valeur déjà posée par le script anti-flash (voir étape 2)
  const current = document.documentElement.dataset.theme;
  if (current === "light" || current === "dark") return current;

  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") return saved;

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isLight = theme === "light";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? "Passer au thème sombre" : "Passer au thème clair"}
    >
      <span aria-hidden="true">{isLight ? "⏾" : "☀︎"}</span>
    </button>
  );
}