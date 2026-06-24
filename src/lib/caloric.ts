/** Caloric calculator profile persistence. */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const caloricSchema = z.object({
  age: z.number().int().min(10).max(120),
  weight_kg: z.number().min(20).max(400),
  height_cm: z.number().min(80).max(260),
  sex: z.enum(["male", "female"]),
  activity: z.number().min(1.0).max(2.5),
  goal: z.enum(["cut", "maintain", "bulk"]),
});

export type CaloricInput = z.infer<typeof caloricSchema>;

export function computeKcal(p: CaloricInput): number {
  const bmr =
    p.sex === "male"
      ? 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age + 5
      : 10 * p.weight_kg + 6.25 * p.height_cm - 5 * p.age - 161;
  const tdee = bmr * p.activity;
  const offset = p.goal === "cut" ? -500 : p.goal === "bulk" ? 500 : 0;
  return Math.round(tdee + offset);
}

export const getMyCaloric = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("caloric_profiles")
      .select("*")
      .eq("user_id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data;
  });

export const saveMyCaloric = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => caloricSchema.parse(d))
  .handler(async ({ data, context }) => {
    const kcal = computeKcal(data);
    const { data: row, error } = await context.supabase
      .from("caloric_profiles")
      .upsert(
        { user_id: context.userId, ...data, computed_kcal: kcal },
        { onConflict: "user_id" },
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  });
