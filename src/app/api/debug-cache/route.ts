// src/app/api/debug-cache/route.ts
import { headers } from "next/headers";

// דוגמה לפונקציה המדמה קריאה ל־DB
async function fetchDB() {
  const start = performance.now();

  // כאן תשים את הקריאה האמיתית ל־DB שלך
  const data = { message: "Hello from DB" };

  const end = performance.now();
  return {
    data,
    cacheStatus: "MISS", // כאן תוכל לשים לוגיקה אמיתית אם DB משתמש בקאש או לא
    dbFetchTime: Math.round(end - start),
  };
}

// פונקציה לדוגמה לזיהוי סוג הדף
function detectPageType() {
  // אפשר להוסיף לוגיקה אמיתית לפי need
  return "SSG / ISR / SSR";
}

export async function GET() {
  // Next.js 15 headers() מחזיר Promise
  const requestHeaders = await headers();

  // בדיקה אם הדף נטען מה־cache של Next.js
  const pageCache = requestHeaders.get("x-nextjs-cache") || "UNKNOWN";

  // קריאה ל־DB עם חישוב זמן טעינה
  const dbData = await fetchDB();

  const pageType = detectPageType();

  // החזרת JSON עם כל המידע
  return new Response(
    JSON.stringify({
      pageCache,
      pageType,
      dbCache: dbData.cacheStatus,
      dbFetchTime: dbData.dbFetchTime,
      dbData: dbData.data,
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}
