import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "T-O — Train With Omar | Bodyweight Tracker" },
      { name: "description", content: "Start your bodyweight training journey. Pick a split, track every session, build the streak." },
      { property: "og:title", content: "T-O — Train With Omar" },
      { property: "og:description", content: "Bodyweight training tracker built for daily consistency." },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/app" });
      else setChecking(false);
    });
  }, [navigate]);

  if (checking) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      {/* nav */}
      <nav className="flex items-center justify-between border-b border-border px-6 py-5 md:px-12">
        <div className="to-display text-2xl tracking-[0.2em] text-foreground">
          T-O<span className="text-brand">.</span>
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Train With Omar
        </div>
      </nav>

      {/* hero */}
      <section className="relative flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-6 text-center">
        <div className="to-dot" style={{ top: "14%", left: "10%", animationDelay: "0s" }} />
        <div className="to-dot" style={{ top: "22%", right: "14%", animationDelay: "1s" }} />
        <div className="to-dot" style={{ bottom: "30%", left: "16%", animationDelay: "2s", width: 7, height: 7 }} />
        <div className="to-dot" style={{ bottom: "18%", right: "20%", animationDelay: ".5s" }} />
        <div className="to-dot" style={{ top: "50%", left: "6%", animationDelay: "1.5s", width: 6, height: 6 }} />
        <div className="to-dot" style={{ top: "60%", right: "8%", animationDelay: "2.5s", width: 11, height: 11 }} />

        <div className="to-fade-up to-eyebrow mb-5" style={{ animationDelay: ".1s" }}>
          Train With Omar
        </div>
        <h1
          className="to-fade-up to-display text-foreground"
          style={{
            animationDelay: ".3s",
            fontSize: "clamp(48px, 9vw, 110px)",
            lineHeight: 0.95,
          }}
        >
          START YOUR<br />
          <span className="to-stroke">JOURNEY</span>
        </h1>
        <p
          className="to-fade-up mt-6 max-w-md text-sm text-muted-foreground"
          style={{ animationDelay: ".4s" }}
        >
          Bodyweight splits. Daily progress. No equipment, no excuses.
          Track every set and watch the streak grow.
        </p>

        <div className="to-fade-up mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: ".5s" }}>
          <Link to="/auth" search={{ mode: "signup" }} className="to-btn-ghost">
            Sign Up
          </Link>
          <Link to="/auth" search={{ mode: "signin" }} className="to-btn-primary">
            Log In
          </Link>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-4 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        T-O · Bodyweight Tracker · {new Date().getFullYear()}
      </footer>
    </main>
  );
}
