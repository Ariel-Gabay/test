"use server";

import { createClient } from "@/lib/supabase/SSRServer";
import { AuthError } from "@supabase/supabase-js";
import { headers } from "next/headers";

interface Response {
  success: boolean;
  response: string | AuthError | null;
}

export async function signOut(): Promise<Response> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  let pathname: string | null = null;

  if (!error) {
    const headersList = await headers();
    pathname = headersList.get("server-pathname");
  }

  return { success: !error, response: !!error ? error : pathname };
}
