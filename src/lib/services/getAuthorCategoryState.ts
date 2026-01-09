"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { AUTHORS_TAG, CATEGORIES_TAG, POSTS_TAG } from "../supabase/tags";

interface Response {
  success: boolean;
  response: AuthorCategoryStatus[] | PostgrestError | null;
}

export default async function getAuthorCategoryState() {
  const supabase = await createClient();

  return unstable_cache(
    async (): Promise<Response> => {
      const { data, error } = await supabase
        .from("author_category_stats")
        .select("*");

      let response = null;
      if (!!error) response = error;
      else if (Array.isArray(data)) {
        response = data as AuthorCategoryStatus[];
      }

      return { success: !error, response };
    },
    [`get-authors-categories-state-cache-key`],
    {
      tags: [AUTHORS_TAG, CATEGORIES_TAG, POSTS_TAG],
      revalidate: false,
    }
  )();
}
