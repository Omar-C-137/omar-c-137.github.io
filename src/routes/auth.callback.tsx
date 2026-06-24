import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check if we got a session from the OAuth callback
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          // Session successfully created, redirect to app
          navigate({ to: "/app" });
        } else {
          // No session, redirect back to auth
          navigate({ to: "/auth" });
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        navigate({ to: "/auth" });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Signing you in...</h1>
        <p className="mt-2 text-gray-600">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
}
