import { createClient as c } from "@supabase/supabase-js";

export async function createClient() {
  return c(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
