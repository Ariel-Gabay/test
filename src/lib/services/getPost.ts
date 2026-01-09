"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { POSTS_TAG } from "../supabase/tags";
import { unSlugify } from "../utils/postsPage";

interface Response {
  success: boolean;
  response: Post | PostgrestError | null;
}

export default async function getPost(title: string) {
  const supabase = await createClient();

  return unstable_cache(
    async (): Promise<Response> => {
      console.log({ title });

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("title", title)
        .single();

      const response = !!error ? error : !!data.slug ? (data as Post) : null;
      return { success: !error, response };
    },
    [`get-post-${encodeURIComponent(title)}-cache-key`],
    {
      tags: [POSTS_TAG],
      revalidate: false,
    }
  )();
}
