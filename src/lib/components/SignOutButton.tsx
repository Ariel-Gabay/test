"use client";

import { useRouter } from "next/navigation";
import { signOut } from "../services/signOut";

export default function SignOutButton() {
  const router = useRouter();
  const handleSignOut = async () => {
    const { success, response } = await signOut();
    console.log({ success, response });

    if (!!success) {
      document.cookie = `full_name=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.cookie = `avatar_url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
      document.documentElement.classList.remove("is-user");
      const pathname = response as string;
      if (pathname === "/studio") router.push("/signin");
    }
  };

  return (
    <button onClick={handleSignOut} className="logout-btn">
      התנתקות
    </button>
  );
}
