"use client";

import { useTransition, useState } from "react";
import { signUpAuthor } from "../services/signUp";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const [avatar, setAvatar] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    formData.set(
      "avatar_url",
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}&gender=male`
    );
    setMessage(null);
    startTransition(async () => {
      const { success, response } = await signUpAuthor(formData);
      if (!success) {
        if (response === 409) setMessage("שם או אימייל תפוס");
        else setMessage("אירעה שגיאה בעת רישום הכותב. הפעולה בוטלה");
        return;
      }
      if (!!success) {
        setMessage(`משתמש ${formData.get("full_name")} נוסף בהצלחה`);
        router.push("/authors");
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <input name="full_name" type="text" required placeholder="Full Name" />
      <input name="email" type="email" required placeholder="Email" />
      <input name="password" type="password" required placeholder="Password" />
      <input name="title" type="text" placeholder="Title (Optional)" />
      <textarea name="bio" placeholder="Bio (Optional)" />
      <input name="twitter" type="text" placeholder="Twitter URL (Optional)" />
      <input
        name="linkedin"
        type="text"
        placeholder="LinkedIn URL (Optional)"
      />
      <input name="website" type="text" placeholder="Website URL (Optional)" />
      <input
        name="avatar_url"
        type="text"
        placeholder="avatar url URL (Optional)"
        onChange={(e) => setAvatar(e.target.value)}
      />
      {avatar && (
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatar}&gender=male`}
          alt="avatar"
          height={200}
          width={200}
        />
      )}

      {message && <p>{message}</p>}

      <button type="submit" disabled={isPending}>
        {isPending ? "רושם..." : "שלח"}
      </button>
    </form>
  );
}
