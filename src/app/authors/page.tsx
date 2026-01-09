import Link from "next/link";
import getAuthors from "@/lib/services/getAuthors";
import { formatDate } from "@/lib/utils/formatDate";
import getAuthorCategoryState from "@/lib/services/getAuthorCategoryState";
import { buildUrl } from "@/lib/utils/postsPage";

export default async function Authors() {
  const { success, response } = await getAuthors();
  if (!success) return <p>אירעה שגיאה בנסיון לקבל את הכותבים</p>;
  const authors = response as Author[];

  const { success: stateSuccess, response: stateResponse } =
    await getAuthorCategoryState();

  const statsMap: CategoriesByAuthors = {};
  if (!!stateSuccess) {
    (stateResponse as AuthorCategoryStatus[]).forEach((row) => {
      const author = row.author_full_name;
      if (!statsMap[author]) {
        statsMap[author] = [];
      }
      statsMap[author].push({
        category_name: row.category_name,
        posts_count: row.post_count,
      });
    });
  }

  return (
    <main>
      <header>
        <h1>נבחרת המומחים</h1>
        <p>האנשים שמאחורי הידע המקצועי באתר</p>
      </header>
      <hr />
      <section>
        {authors.map((author) => (
          <article
            key={author.full_name}
            style={{
              marginBottom: "40px",
              borderBottom: "1px solid #ccc",
              paddingBottom: "20px",
            }}
          >
            <header>
              <img
                src={author.avatar_url}
                alt={author.full_name}
                style={{ borderRadius: "50%", backgroundColor: "#eee" }}
                width={100}
                height={100}
              />
              <h2>{author.full_name}</h2>
              <p>
                <strong>תואר:</strong> {author.title}
              </p>
            </header>
            <div>
              <h3>אודות</h3>
              <p>{author.bio}</p>
            </div>
            <ul>
              <li>חבר באתר מ- {formatDate(author.joined_date)}</li>
            </ul>
            <nav>
              {author.linkedin && (
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              )}
              {author.website && (
                <a
                  href={author.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: "15px" }}
                >
                  אתר אישי
                </a>
              )}
            </nav>
            <footer style={{ marginTop: "15px" }}>
              {!!stateSuccess && !!statsMap[author.full_name] && (
                <div>
                  <p>{author.full_name} כותב ב:</p>
                  {statsMap[author.full_name]?.map((category, index) => (
                    <Link
                      key={category.category_name}
                      href={buildUrl(
                        author.full_name.replaceAll(" ", "-"),
                        category.category_name
                      )}
                    >
                      {category.category_name} ({category.posts_count})
                      {statsMap[author.full_name].length - 1 === index
                        ? "."
                        : ", "}
                    </Link>
                  ))}
                </div>
              )}
              <Link
                href={`/posts?author=${author.full_name.replaceAll(" ", "-")}`}
              >
                צפייה בכל המאמרים של {author.full_name}
              </Link>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
