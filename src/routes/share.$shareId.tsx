import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getShare } from "@/lib/shares";
import { getPlan } from "@/lib/plans";

type DayName = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface Exercise {
  name: string;
  sets: string;
  reps: string;
}

interface PlanShare {
  name: string;
  description?: string;
  days: string;
  hero_title: string;
  exercises: Record<DayName, Exercise[]>;
  schedule: Record<DayName, { label: string; sub: string }>;
}

interface ShareSnapshot {
  progress?: Array<{ day: DayName; exercise_index: number }>;
}

interface ShareLoaderData {
  share: { display_name?: string; snapshot: ShareSnapshot };
  plan: PlanShare;
}

export const Route = createFileRoute("/share/$shareId")({
  loader: async ({ params, context }) => {
    const share = await getShare({ data: { id: params.shareId } });
    if (!share) throw notFound();
    const plan = await getPlan({ data: { key: share.plan_key } });
    if (!plan) throw notFound();
    await context.queryClient.setQueryData(["share", params.shareId], { share, plan });
    return { share, plan };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.share.display_name ?? "A friend"} is training — T-O` },
      { name: "description", content: `Following the ${loaderData?.plan.name} split on T-O.` },
      { property: "og:title", content: `Training: ${loaderData?.plan.name}` },
      { property: "og:description", content: loaderData?.plan.description ?? "" },
    ],
  }),
  errorComponent: ShareError,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="to-display text-5xl">Share not found</h1>
        <p className="mt-2 text-muted-foreground">This link doesn't exist or was deleted.</p>
        <Link to="/" className="to-btn-primary mt-6 inline-flex">Go home</Link>
      </div>
    </div>
  ),
  component: SharePage,
});

function ShareError({ error }: { error: Error }) {
  return (
    <div className="p-10 text-center">
      <h1 className="to-display text-3xl">Couldn't load share</h1>
      <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
    </div>
  );
}

interface Exercise { name: string; sets: string; reps: string }

function SharePage() {
  const { share, plan } = Route.useLoaderData<ShareLoaderData>();
  const exercises = plan.exercises;
  const schedule = plan.schedule;
  const progress = share.snapshot.progress ?? [];
  const totalEx = Object.values(exercises).reduce((sum, list) => sum + list.length, 0);
  const days: DayName[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  return (
    <main className="min-h-screen bg-background">
      <nav className="flex items-center justify-between border-b border-border px-6 py-5">
        <Link to="/" className="to-display text-2xl tracking-[0.2em]">
          T-O<span className="text-brand">.</span>
        </Link>
        <Link to="/auth" search={{ mode: "signup" }} className="to-btn-primary">
          Start Yours
        </Link>
      </nav>

      <section className="px-6 py-12 md:px-12">
        <div className="to-eyebrow mb-3">Shared Training</div>
        <h1
          className="to-display text-foreground"
          style={{ fontSize: "clamp(40px, 8vw, 88px)", lineHeight: 0.95 }}
          dangerouslySetInnerHTML={{ __html: plan.hero_title }}
        />
        <p className="mt-4 max-w-xl text-sm text-muted-foreground">
          {share.display_name ?? "A friend"} is following <strong>{plan.name}</strong> · {plan.days}
        </p>
        <div className="mt-6 flex gap-8">
          <div>
            <div className="to-display text-3xl text-brand">{progress.length}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Exercises Done</div>
          </div>
          <div>
            <div className="to-display text-3xl">{totalEx}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">This Week</div>
          </div>
        </div>
      </section>

      <section className="border-t border-border px-6 py-10 md:px-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {days.map((d) => (
            <div key={d} className="to-card">
              <div className="to-eyebrow mb-1">{d.toUpperCase()}</div>
              <div className="to-display text-2xl">{schedule[d]?.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">{schedule[d]?.sub}</div>
              <ul className="mt-3 space-y-1 text-sm">
                {(exercises[d] ?? []).map((ex, i) => {
                  const done = progress.some((p) => p.day === d && p.exercise_index === i);
                  return (
                    <li key={i} className={done ? "text-brand" : "text-muted-foreground"}>
                      {done ? "✓ " : "· "}{ex.name} <span className="text-xs opacity-60">({ex.sets}×{ex.reps})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
