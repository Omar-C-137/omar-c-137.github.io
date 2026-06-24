/** Workout progress tracking. */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const dayEnum = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);

export const getProgressForPlan = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ plan_key: z.string().min(1).max(50) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: rows, error } = await context.supabase
      .from("user_progress")
      .select("day,exercise_index")
      .eq("user_id", context.userId)
      .eq("plan_key", data.plan_key);
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

const toggleSchema = z.object({
  plan_key: z.string().min(1).max(50),
  day: dayEnum,
  exercise_index: z.number().int().min(0).max(99),
  completed: z.boolean(),
});

export const toggleExercise = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => toggleSchema.parse(d))
  .handler(async ({ data, context }) => {
    if (data.completed) {
      const { error } = await context.supabase.from("user_progress").upsert(
        {
          user_id: context.userId,
          plan_key: data.plan_key,
          day: data.day,
          exercise_index: data.exercise_index,
        },
        { onConflict: "user_id,plan_key,day,exercise_index" },
      );
      if (error) throw new Error(error.message);
    } else {
      const { error } = await context.supabase
        .from("user_progress")
        .delete()
        .eq("user_id", context.userId)
        .eq("plan_key", data.plan_key)
        .eq("day", data.day)
        .eq("exercise_index", data.exercise_index);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const resetPlanProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ plan_key: z.string().min(1).max(50) }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("user_progress")
      .delete()
      .eq("user_id", context.userId)
      .eq("plan_key", data.plan_key);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
