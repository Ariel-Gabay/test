"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../services/signIn";
import { User } from "@supabase/supabase-js";
import getAuthor from "../services/getAuthor";
function setUserCookies(
  {
    full_name,
    email,
    avatar_url,
  }: { full_name: string; email: string; avatar_url: string },
  days = 7
) {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000
  ).toUTCString();
  document.cookie = `full_name=${full_name}; expires=${expires}; path=/`;
  document.cookie = `email=${email}; expires=${expires}; path=/`;
  document.cookie = `avatar_url=${avatar_url}; expires=${expires}; path=/`;

  const root = document.documentElement;
  root.style.setProperty("--user-name", JSON.stringify(full_name));
  root.style.setProperty("--user-email", JSON.stringify(email));
  root.style.setProperty("--user-avatar", 'url("' + avatar_url + '")');
  root.classList.add("is-user");
}

export default function SignInForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const { success, response } = await signIn(formData);

      if (!success) {
        setMessage("אירעה שגיאה בעת נסיון ההתחברות. הפעולה בוטלה");
        return;
      }
      setMessage(`התחברת בהצלחה`);
      const name = (response as User).user_metadata.full_name;
      const { success: s, response: r } = await getAuthor("full_name", name);
      if (!!s) {
        const a = r as Author;
        setUserCookies({
          full_name: a.full_name,
          email: a.email,
          avatar_url: a.avatar_url ?? "",
        });
      }
      router.push("/studio");
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="email" type="email" required placeholder="אימייל" />
      <input name="password" type="password" required placeholder="סיסמה" />
      {message && <p>{message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "מתחבר..." : "שלח"}
      </button>
    </form>
  );
}
