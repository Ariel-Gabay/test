"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface Response {
  success: boolean;
  response: null | AuthError;
}

export async function signOut(): Promise<Response> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (!error) {
    const headersList = await headers();
    const pathname = headersList.get("server-pathname");
    if (pathname && pathname.startsWith("/studio")) {
      redirect("/auth/sign-in");
    }
  }

  return { success: !!error, response: error };
}
