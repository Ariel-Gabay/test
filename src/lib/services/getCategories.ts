"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { CATEGORIES_TAG } from "../supabase/tags";

interface Response {
  success: boolean;
  response: Category[] | PostgrestError | null;
}

export default async function getCategories(): Promise<Response> {
  const supabase = await createClient();

  return unstable_cache(
    async () => {
      const { data, error } = await supabase.from("categories").select("*");

      const response = !!error
        ? error
        : Array.isArray(data)
        ? (data as Category[])
        : null;

      return { success: !error, response };
    },
    ["get-categories-cache-key"],
    {
      tags: [CATEGORIES_TAG],
      revalidate: false,
    }
  )();
}
