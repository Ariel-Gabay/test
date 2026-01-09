"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { AUTHORS_TAG } from "../supabase/tags";
import getAuthor from "./getAuthor";

interface Response {
  success: boolean;
  response: 409 | AuthError | PostgrestError | null;
}

export async function signUpAuthor(formData: FormData): Promise<Response> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;
  const title = (formData.get("title") as string) || undefined;
  const bio = (formData.get("bio") as string) || undefined;
  const twitter = (formData.get("twitter") as string) || undefined;
  const linkedin = (formData.get("linkedin") as string) || undefined;
  const website = (formData.get("website") as string) || undefined;
  const avatar_url = (formData.get("avatar_url") as string) || undefined;

  const { success: nameExists } = await getAuthor("full_name", full_name);
  if (!!nameExists) return { success: false, response: 409 };

  const { success: emailExists } = await getAuthor("email", email);
  if (!!emailExists) return { success: false, response: 409 };

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (!!authError) return { success: false, response: authError };

  const { error: dbError } = await supabase.from("authors").insert([
    {
      full_name,
      email,
      title,
      bio,
      twitter,
      linkedin,
      website,
      joined_date: new Date().toISOString(),
      avatar_url,
    },
  ]);

  if (!!dbError) return { success: false, response: dbError };

  revalidatePath("/authors");
  revalidateTag(AUTHORS_TAG);
  return { success: true, response: null };
}
