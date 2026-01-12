"use client";

import { signOut } from "../services/signOut";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut();
    document.cookie = `full_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `avatar_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.documentElement.classList.remove("is-user");
  };

  return (
    <button onClick={handleSignOut} className="logout-btn">
      התנתקות
    </button>
  );
}
