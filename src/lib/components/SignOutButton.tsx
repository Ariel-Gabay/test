"use client";

import { signOut } from "../services/signOut";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut();
  };

  return <button onClick={handleSignOut}>התנתקות</button>;
}
