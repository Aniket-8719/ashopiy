import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="px-4 py-2 rounded bg-primary-500 text-white"
    >
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
