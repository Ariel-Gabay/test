"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { AUTHORS_TAG } from "../supabase/tags";

interface Response {
  success: boolean;
  response: Author[] | PostgrestError | null;
}

export default async function getAuthors(): Promise<Response> {
  const supabase = await createClient();

  return unstable_cache(
    async () => {
      const { data, error } = await supabase
        .from("authors")
        .select("*")
        .order("joined_date", { ascending: false });

      const response = !!error
        ? error
        : Array.isArray(data)
        ? (data as Author[])
        : null;

      return { success: !error, response };
    },
    ["get-authors-cache-key"],
    {
      tags: [AUTHORS_TAG],
      revalidate: false,
    }
  )();
}
