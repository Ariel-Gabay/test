"use server";

import { unstable_cache } from "next/cache";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "../supabase/server";
import { AUTHORS_TAG, CATEGORIES_TAG, POSTS_TAG } from "../supabase/tags";
import { PAGE_GRID_SIZE } from "../utils/postsPage";

interface Response {
  success: boolean;
  response: PostPreview[] | PostgrestError | null;
  totalPages: number;
}

export default async function getPosts({
  author,
  category,
  page,
}: VerifyQueries): Promise<Response> {
  const supabase = await createClient();

  const from = (page - 1) * PAGE_GRID_SIZE;
  const to = from + PAGE_GRID_SIZE - 1;

  const tags = [POSTS_TAG];
  if (!!author) tags.push(AUTHORS_TAG);
  if (!!category) tags.push(CATEGORIES_TAG);

  return unstable_cache(
    async () => {
      let query = supabase
        .from("posts")
        .select(
          `title,
        slug,
        author_full_name,
        category_name,
        main_image_url,
        update_date,
        views,
        likes,
        excerpt`,
          { count: "exact" }
        )
        .eq("status", "published")
        .range(from, to)
        .order("update_date", { ascending: false });

      if (author?.full_name) {
        query = query.eq("author_full_name", author.full_name);
      }
      if (category?.name) {
        query = query.eq("category_name", category.name);
      }

      const { data, error, status, count } = await query;

      const success = !error && status !== 416;

      const response = !!error
        ? error
        : Array.isArray(data)
        ? (data as PostPreview[])
        : null;

      const totalPages = Math.ceil((count || 0) / PAGE_GRID_SIZE);

      return { success, response, totalPages };
    },
    [
      `get-posts-${author ? encodeURIComponent(author.full_name) : ""}-${
        category ? encodeURIComponent(category.name) : ""
      }-${page}-cache-key`,
    ],
    {
      tags,
      revalidate: false,
    }
  )();
}
