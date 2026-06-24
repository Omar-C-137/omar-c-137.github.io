/** Workout plans: library lookup (public) + user's active plan (authed). */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const planKeySchema = z.object({ key: z.string().min(1).max(50) });

/** Public read of all plans — used by landing and share pages during SSR. */
function getPublicSupabaseConfig() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      "Missing Supabase environment variables: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY must be set.",
    );
  }

  return { SUPABASE_URL, SUPABASE_KEY };
}

export const listPlans = createServerFn({ method: "GET" }).handler(async () => {
  const { SUPABASE_URL, SUPABASE_KEY } = getPublicSupabaseConfig();
  const client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client
    .from("workout_plans")
    .select("key,name,short,days,description,hero_title,schedule,exercises,sort_order")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPlan = createServerFn({ method: "GET" })
  .inputValidator((d) => planKeySchema.parse(d))
  .handler(async ({ data }) => {
    const { SUPABASE_URL, SUPABASE_KEY } = getPublicSupabaseConfig();
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: row, error } = await client
      .from("workout_plans")
      .select("*")
      .eq("key", data.key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
