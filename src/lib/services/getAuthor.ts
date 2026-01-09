"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { AUTHORS_TAG } from "../supabase/tags";

interface Response {
  success: boolean;
  response: Author | PostgrestError | null;
}

export default async function getAuthor(column: keyof Author, value: string) {
  const supabase = await createClient();

  return unstable_cache(
    async (): Promise<Response> => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .eq(column, value)
        .order("joined_date", { ascending: false })
        .single();

      const response = !!error ? error : !!data.email ? (data as Author) : null;
      return { success: !error, response };
    },
    [`get-author-${column}-${encodeURIComponent(value)}-cache-key`],
    {
      tags: [AUTHORS_TAG],
      revalidate: false,
    }
  )();
}
