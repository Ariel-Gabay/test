"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../services/signIn";

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
    });
    router.push("/studio");
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
