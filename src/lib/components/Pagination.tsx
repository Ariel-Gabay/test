import Link from "next/link";
import { buildUrl, getPaginationIndexes } from "../utils/postsPage";

interface Props {
  page: number;
  totalPages: number;
  authorSlug?: string;
  categorySlug?: string;
}

export default function Pagination({
  page,
  totalPages,
  authorSlug,
  categorySlug,
}: Props) {
  if (totalPages <= 1) return null;

  const indexes = getPaginationIndexes(page, totalPages);

  return (
    <nav aria-label="ניווט עמודים" className="my-8">
      <ul
        style={{
          display: "flex",
          gap: 8,
          listStyle: "none",
          padding: 0,
          marginTop: 30,
        }}
      >
        {page > 1 && (
          <li>
            <Link
              href={buildUrl(authorSlug, categorySlug, page - 1)}
              rel="prev"
            >
              {"<"}
            </Link>
          </li>
        )}

        {indexes.map((item, idx) => (
          <li key={idx}>
            {item === "…" ? (
              <span aria-hidden="true">…</span>
            ) : (
              <Link
                href={buildUrl(
                  authorSlug,
                  categorySlug,
                  item === 1 ? undefined : item
                )}
                style={{
                  fontWeight: item === page ? "bold" : "normal",
                  textDecoration: item === page ? "underline" : "none",
                  color: item === page ? "red" : "black",
                }}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link
              href={buildUrl(authorSlug, categorySlug, page + 1)}
              rel="next"
            >
              {">"}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
