"use client";

import { useEffect, useState } from "react";

function getCurrentTheme(): "light" | "dark" {
  const t = document.documentElement.getAttribute("data-theme");
  return t === "dark" ? "dark" : "light";
}

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; path=/; max-age=31536000`;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    setCookie("theme", next);
    setTheme(next);
  }

  return (
    <>
      <button onClick={toggle} className="theme-light-but">
        ☀️ מצב בהיר
      </button>
      <button onClick={toggle} className="theme-dark-but">
        🌙 מצב כהה
      </button>
    </>
  );
}
