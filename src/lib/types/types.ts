type Author = {
  full_name: string;
  title?: string;
  avatar_url?: string;
  bio?: string;
  email: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  joined_date: string;
};

type Category = {
  name: string;
  description: string;
  color: string;
  icon_url: string;
};

type AuthorCategoryStatus = {
  author_full_name: string;
  category_name: string;
  post_count: number;
};

interface CategoriesByAuthors {
  [authorName: string]: {
    category_name: string;
    posts_count: number;
  }[];
}

interface AuthorsByCategories {
  [categoryName: string]: {
    author_full_name: string;
    posts_count: number;
  }[];
}

type Post = {
  title: string;
  slug: string;
  author_full_name: string;
  category_name: string;
  status: "draft" | "pending" | "published";
  excerpt: string;
  content: string;
  main_image_url: string;
  update_date: string;
  views: number;
  likes: number;
};

type PostPreview = Omit<Post, "status" | "content">;
