import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, useSuspenseQueries } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { listPlans } from "@/lib/plans";
import { getMyProfile, updateMyProfile } from "@/lib/profile";
import { getProgressForPlan, toggleExercise, resetPlanProgress } from "@/lib/progress";
import { getMyCaloric, saveMyCaloric, computeKcal } from "@/lib/caloric";
import { createShare } from "@/lib/shares";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "@/hooks/use-theme";
import { signOut } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app")({
  head: () => ({
    meta: [
      { title: "Tracker — T-O" },
      { name: "description", content: "Your active training plan and weekly progress." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TrackerPage,
});

type Day = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
const DAYS: Day[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS: Record<Day, string> = {
  mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun",
};

interface Exercise { name: string; sets: string; reps: string }
interface ScheduleEntry { label: string; sub: string }

function TrackerPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();

  const listPlansFn = useServerFn(listPlans);
  const getProfileFn = useServerFn(getMyProfile);
  const updateProfileFn = useServerFn(updateMyProfile);
  const getProgressFn = useServerFn(getProgressForPlan);
  const toggleFn = useServerFn(toggleExercise);
  const resetFn = useServerFn(resetPlanProgress);
  const createShareFn = useServerFn(createShare);

  const [{ data: plans = [] }, { data: profile }] = useSuspenseQueries({
    queries: [
      { queryKey: ["plans"], queryFn: () => listPlansFn() },
      { queryKey: ["profile"], queryFn: () => getProfileFn() },
    ],
  });

  const activeKey = profile?.active_plan_key ?? "ppl";
  const plan = useMemo(() => plans.find((p) => p.key === activeKey) ?? plans[0], [plans, activeKey]);

  const { data: progress = [] } = useQuery({
    queryKey: ["progress", activeKey],
    queryFn: () => getProgressFn({ data: { plan_key: activeKey } }),
    enabled: !!activeKey,
  });

  const [activeDay, setActiveDay] = useState<Day>(() => {
    const jsDay = new Date().getDay(); // 0 sun
    return (["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as Day[])[jsDay];
  });

  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);

  // Sync dark mode from profile on mount
  useEffect(() => {
    if (profile?.dark_mode && theme !== "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [profile?.dark_mode, theme]);

  const setActivePlan = useMutation({
    mutationFn: (key: string) => updateProfileFn({ data: { active_plan_key: key } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setShowPlanModal(false);
      toast.success("Plan switched");
    },
  });

  const toggleMut = useMutation({
    mutationFn: (vars: { day: Day; exercise_index: number; completed: boolean }) =>
      toggleFn({ data: { plan_key: activeKey, ...vars } }),
    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["progress", activeKey] });
      const prev = queryClient.getQueryData<{ day: string; exercise_index: number }[]>(["progress", activeKey]) ?? [];
      const next = vars.completed
        ? [...prev, { day: vars.day, exercise_index: vars.exercise_index }]
        : prev.filter((p) => !(p.day === vars.day && p.exercise_index === vars.exercise_index));
      queryClient.setQueryData(["progress", activeKey], next);
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(["progress", activeKey], ctx.prev);
      toast.error("Couldn't save progress");
    },
  });

  const resetMut = useMutation({
    mutationFn: () => resetFn({ data: { plan_key: activeKey } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress", activeKey] });
      toast.success("Week reset");
    },
  });

  const shareMut = useMutation({
    mutationFn: () => createShareFn({ data: { plan_key: activeKey, display_name: profile?.display_name ?? undefined } }),
    onSuccess: (row) => {
      const url = `${window.location.origin}/share/${row.id}`;
      navigator.clipboard.writeText(url).catch(() => {});
      toast.success("Share link copied", { description: url });
    },
    onError: () => toast.error("Couldn't create share link"),
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    navigate({ to: "/", replace: true });
  }

  if (!plan) {
    return <div className="p-12 text-muted-foreground">No plans available.</div>;
  }

  const schedule = plan.schedule as unknown as Record<Day, ScheduleEntry>;
  const exercises = plan.exercises as unknown as Record<Day, Exercise[]>;
  const dayExercises = exercises[activeDay] ?? [];
  const dayInfo = schedule[activeDay];
  const isDone = (day: Day, idx: number) =>
    progress.some((p) => p.day === day && p.exercise_index === idx);
  const doneCount = dayExercises.filter((_, i) => isDone(activeDay, i)).length;
  const pct = dayExercises.length ? Math.round((doneCount / dayExercises.length) * 100) : 0;

  // weekly totals
  const totalEx = DAYS.reduce((sum, d) => sum + (exercises[d]?.length ?? 0), 0);
  const totalDone = progress.length;

  return (
    <div className="min-h-screen bg-background">
      {/* NAV */}
      <nav className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur md:px-10">
        <div className="to-display text-xl tracking-[0.2em]">
          T-O<span className="text-brand">.</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={() => setShowPlanModal(true)} className="to-btn-ghost !text-[10px] !py-2 !px-3">
            Change Plan
          </button>
          <button onClick={() => shareMut.mutate()} className="to-btn-ghost !text-[10px] !py-2 !px-3 !text-brand !border-brand">
            Share
          </button>
          <button onClick={handleSignOut} className="to-btn-ghost !text-[10px] !py-2 !px-3">
            Log Out
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative h-6 w-11 rounded-full border border-border bg-muted transition-colors"
          >
            <span
              className="absolute top-[2px] left-[2px] h-4 w-4 rounded-full bg-brand transition-transform"
              style={{ transform: theme === "dark" ? "translateX(20px)" : "translateX(0)" }}
            />
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="border-b border-border px-4 py-12 md:px-10 md:py-16">
        <div className="to-eyebrow mb-3">Active Plan</div>
        <h1
          className="to-display text-foreground"
          style={{ fontSize: "clamp(40px, 8vw, 88px)", lineHeight: 0.95 }}
          dangerouslySetInnerHTML={{ __html: plan.hero_title }}
        />
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">{plan.description}</p>
        <div className="mt-6 flex flex-wrap gap-8">
          <Stat label="This Week" value={`${totalDone}/${totalEx}`} />
          <Stat label="Days" value={plan.days} />
          <Stat label="Today" value={`${pct}%`} highlight />
        </div>
      </section>

      {/* WEEK STRIP */}
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map((d) => {
          const dayDone = (exercises[d] ?? []).filter((_, i) => isDone(d, i)).length;
          const active = d === activeDay;
          return (
            <button
              key={d}
              onClick={() => setActiveDay(d)}
              className={`border-r border-border px-2 py-4 text-center transition-colors last:border-r-0 ${
                active ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              <div className={`text-[9px] uppercase tracking-[0.25em] ${active ? "opacity-70" : "text-muted-foreground"}`}>
                {DAY_LABELS[d]}
              </div>
              <div className="to-display mt-1 text-base tracking-[0.1em]">
                {schedule[d]?.label}
              </div>
              <div className={`mx-auto mt-2 h-1.5 w-1.5 rounded-full ${dayDone > 0 ? "bg-brand" : active ? "bg-background/40" : "bg-border"}`} />
            </button>
          );
        })}
      </div>

      {/* SESSION */}
      <section className="px-4 py-10 md:px-10 md:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="to-eyebrow mb-2">{dayInfo?.sub ?? "Session"}</div>
            <h2
              className="to-display"
              style={{ fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1 }}
            >
              {dayInfo?.label} <span className="to-stroke">DAY</span>
            </h2>
          </div>
          <div className="flex gap-6">
            <Stat label="Done" value={`${doneCount}/${dayExercises.length}`} />
            <Stat label="Complete" value={`${pct}%`} highlight />
          </div>
        </div>

        {/* progress bar */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Session progress</span>
            <span className="to-display text-lg text-brand">{pct}%</span>
          </div>
          <div className="h-0.5 overflow-hidden rounded bg-border">
            <div className="h-full bg-brand transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* exercises */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dayExercises.map((ex, i) => {
            const done = isDone(activeDay, i);
            return (
              <div
                key={i}
                className={`to-card transition-all ${done ? "border-brand/40 bg-brand/5" : ""}`}
              >
                <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  EX {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mb-3 font-semibold text-foreground">{ex.name}</div>
                <div className="flex items-center justify-between">
                  <div className="to-display text-lg tracking-[0.05em] text-muted-foreground">
                    {ex.sets} <span className="text-brand">×</span> {ex.reps}
                  </div>
                  <button
                    onClick={() => toggleMut.mutate({ day: activeDay, exercise_index: i, completed: !done })}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all ${
                      done
                        ? "border-brand bg-brand text-brand-foreground"
                        : "border-border text-transparent hover:border-brand"
                    }`}
                    aria-label={done ? "Mark incomplete" : "Mark complete"}
                  >
                    ✓
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setShowCalcModal(true)} className="to-btn-ghost">
            Caloric Calculator
          </button>
          <button onClick={() => resetMut.mutate()} className="to-btn-ghost">
            Reset Week
          </button>
        </div>
      </section>

      {showPlanModal && (
        <PlanSwitcherModal
          plans={plans}
          activeKey={activeKey}
          onPick={(k) => setActivePlan.mutate(k)}
          onClose={() => setShowPlanModal(false)}
        />
      )}
      {showCalcModal && <CaloricModal onClose={() => setShowCalcModal(false)} />}
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <div className={`to-display text-3xl ${highlight ? "text-brand" : "text-foreground"}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
    </div>
  );
}

function PlanSwitcherModal({
  plans, activeKey, onPick, onClose,
}: {
  plans: { key: string; name: string; days: string; description: string }[];
  activeKey: string;
  onPick: (k: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal onClose={onClose} title="Choose Your Split">
      <div className="grid gap-3 sm:grid-cols-2">
        {plans.map((p) => (
          <button
            key={p.key}
            onClick={() => onPick(p.key)}
            className={`to-card text-left transition-all hover:border-brand ${
              p.key === activeKey ? "border-brand bg-brand/5" : ""
            }`}
          >
            <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-brand">{p.days}</div>
            <div className="to-display text-xl tracking-[0.05em]">{p.name}</div>
            <div className="mt-2 text-xs text-muted-foreground">{p.description}</div>
            {p.key === activeKey && (
              <div className="mt-3 inline-block rounded bg-brand px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-brand-foreground">
                Current
              </div>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
}

function CaloricModal({ onClose }: { onClose: () => void }) {
  const getFn = useServerFn(getMyCaloric);
  const saveFn = useServerFn(saveMyCaloric);
  const queryClient = useQueryClient();
  const { data: existing } = useQuery({ queryKey: ["caloric"], queryFn: () => getFn() });

  const [form, setForm] = useState({
    age: existing?.age ?? 25,
    weight_kg: existing?.weight_kg ?? 70,
    height_cm: existing?.height_cm ?? 175,
    sex: (existing?.sex ?? "male") as "male" | "female",
    activity: existing?.activity ?? 1.55,
    goal: (existing?.goal ?? "maintain") as "cut" | "maintain" | "bulk",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        age: existing.age,
        weight_kg: Number(existing.weight_kg),
        height_cm: Number(existing.height_cm),
        sex: existing.sex as "male" | "female",
        activity: Number(existing.activity),
        goal: existing.goal as "cut" | "maintain" | "bulk",
      });
    }
  }, [existing]);

  const kcal = computeKcal(form);

  const saveMut = useMutation({
    mutationFn: () => saveFn({ data: form }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caloric"] });
      toast.success(`Daily target: ${kcal} kcal`);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  return (
    <Modal onClose={onClose} title="Caloric Calculator">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Age">
          <input type="number" className="to-input" value={form.age}
            onChange={(e) => setForm({ ...form, age: +e.target.value })} min={10} max={120} />
        </Field>
        <Field label="Sex">
          <select className="to-input" value={form.sex}
            onChange={(e) => setForm({ ...form, sex: e.target.value as "male" | "female" })}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Weight (kg)">
          <input type="number" className="to-input" value={form.weight_kg} step="0.1"
            onChange={(e) => setForm({ ...form, weight_kg: +e.target.value })} min={20} max={400} />
        </Field>
        <Field label="Height (cm)">
          <input type="number" className="to-input" value={form.height_cm}
            onChange={(e) => setForm({ ...form, height_cm: +e.target.value })} min={80} max={260} />
        </Field>
        <Field label="Activity">
          <select className="to-input" value={form.activity}
            onChange={(e) => setForm({ ...form, activity: +e.target.value })}>
            <option value={1.2}>Sedentary</option>
            <option value={1.375}>Light (1–3×/wk)</option>
            <option value={1.55}>Moderate (3–5×/wk)</option>
            <option value={1.725}>Active (6–7×/wk)</option>
            <option value={1.9}>Very Active</option>
          </select>
        </Field>
        <Field label="Goal">
          <select className="to-input" value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value as "cut" | "maintain" | "bulk" })}>
            <option value="cut">Cut (−500)</option>
            <option value="maintain">Maintain</option>
            <option value="bulk">Bulk (+500)</option>
          </select>
        </Field>
      </div>

      <div className="mt-6 rounded border border-border bg-muted p-4">
        <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Daily Target</div>
        <div className="to-display text-4xl text-brand">{kcal} <span className="text-base text-muted-foreground">kcal</span></div>
      </div>

      <button
        onClick={() => saveMut.mutate()}
        disabled={saveMut.isPending}
        className="to-btn-primary mt-5 w-full"
      >
        {saveMut.isPending ? "Saving..." : "Save"}
      </button>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

function Modal({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded border border-border bg-background p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="to-display text-2xl tracking-[0.1em]">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
