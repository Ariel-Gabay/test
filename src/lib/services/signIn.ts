"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthError, User } from "@supabase/supabase-js";

interface Response {
  success: boolean;
  response: User | AuthError | null;
}

export async function signIn(formData: FormData): Promise<Response> {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  const response = !!data.user ? data.user : !!error ? error : null;

  return { success: !!data.user && !error, response };
}
