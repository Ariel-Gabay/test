import { notFound, permanentRedirect } from "next/navigation";
import getAuthor from "../services/getAuthor";
import getCategory from "../services/getCategory";

export const PAGE_GRID_SIZE = 2;

export const slugify = (text: string): string => text.replaceAll(" ", "-");

export const unSlugify = (slug: string): string =>
  decodeURIComponent(slug).replaceAll("-", " ");

export const buildUrl = (
  author?: string,
  category?: string,
  page?: number
): string => {
  const params = new URLSearchParams();
  if (author) params.set("author", slugify(author));
  if (category) params.set("category", slugify(category));
  if (page && page > 1) params.set("page", page.toString());
  const queryString = params.toString();
  return `/posts${queryString ? `?${queryString}` : ""}`;
};

export const verifyQueries = async (
  authorSlug: string | undefined,
  categorySlug: string | undefined,
  pageSlug: string | undefined
): Promise<VerifyQueries> => {
  let author: Author | undefined, category: Category | undefined, page: number;

  if (!!authorSlug) {
    const { success, response } = await getAuthor(
      "full_name",
      unSlugify(authorSlug)
    );
    if (!success) return notFound();
    if (!!response) author = response as Author;
  }

  if (!!categorySlug) {
    const { success, response } = await getCategory(
      "name",
      unSlugify(categorySlug)
    );
    if (!success) return notFound();
    if (!!response) category = response as Category;
  }

  if (pageSlug === undefined) page = 1;
  else {
    page = parseInt(pageSlug);
    if (isNaN(page) || page <= 1)
      permanentRedirect(buildUrl(authorSlug, categorySlug));
  }

  return { author, category, page };
};

export const getPaginationIndexes = (current: number, total: number) => {
  const delta = 1;
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }
  return pages;
};
