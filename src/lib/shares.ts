/** Shareable plan/progress snapshots. */
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const createSchema = z.object({
  plan_key: z.string().min(1).max(50),
  display_name: z.string().trim().max(80).optional(),
});

export const createShare = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => createSchema.parse(d))
  .handler(async ({ data, context }) => {
    // Build a snapshot: profile name + active plan + completed exercises today.
    const { data: progress } = await context.supabase
      .from("user_progress")
      .select("day,exercise_index,completed_at")
      .eq("user_id", context.userId)
      .eq("plan_key", data.plan_key);

    const snapshot = {
      plan_key: data.plan_key,
      progress: progress ?? [],
      shared_at: new Date().toISOString(),
    };
    const { data: row, error } = await context.supabase
      .from("shares")
      .insert({
        owner_id: context.userId,
        plan_key: data.plan_key,
        display_name: data.display_name ?? null,
        snapshot,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return row;
  });

/** Public — used by SSR loader of /share/$shareId. No auth, returns minimal fields. */
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

export const getShare = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { SUPABASE_URL, SUPABASE_KEY } = getPublicSupabaseConfig();
    const client = createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    });
    const { data: row, error } = await client
      .from("shares")
      .select("id,plan_key,display_name,snapshot,created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });
