"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { CATEGORIES_TAG } from "../supabase/tags";

interface Response {
  success: boolean;
  response: Category | PostgrestError | null;
}

export default async function getCategory(
  column: keyof Category,
  value: string
) {
  const supabase = await createClient();

  return unstable_cache(
    async (): Promise<Response> => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq(column, value)
        .single();

      const response = !!error
        ? error
        : !!data.name
        ? (data as Category)
        : null;

      return { success: !error, response };
    },
    [`get-category-${column}-${encodeURIComponent(value)}-cache-key`],
    {
      tags: [CATEGORIES_TAG],
      revalidate: false,
    }
  )();
}
