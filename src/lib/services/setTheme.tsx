"use server";

import { cookies } from "next/headers";

export async function setTheme(theme: "light" | "dark"): Promise<void> {
  await cookies()
    .then((cookies) =>
      cookies.set("theme", theme, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      })
    )
    .catch();
}
