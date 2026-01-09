"use client";

import { setTheme } from "../services/setTheme";

export default function Theme() {
  return (
    <div>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>
    </div>
  );
}
