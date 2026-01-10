import { headers } from "next/headers";

// סימולציה של fetch ל-DB עם cache info
async function fetchDB() {
  // לדוגמה – חצי מהפעמים מה-cache
  const cached = Math.random() > 0.5;

  // זמן אחזור דמה
  const delay = cached ? 10 : 150;
  await new Promise((res) => setTimeout(res, delay));

  return { message: "DB Data", cached };
}

// סוג הדף (SSG / SSR / ISR)
function detectPageType(): string {
  // כאן אפשר לוגיקה אמיתית לפי הנתונים או fallback
  // למשל ניתן להעביר פרופס מה-server
  return "SSG"; // לשינוי: SSR / ISR / Client
}

export async function GET() {
  const requestHeaders = headers();
  const pageCache = requestHeaders.get("x-nextjs-cache") || "UNKNOWN";

  const dbData = await fetchDB();
  const pageType = detectPageType();

  return new Response(
    JSON.stringify({
      pageCache,
      pageType,
      dbCache: dbData.cached,
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}
