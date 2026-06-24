/** Client-side auth helpers. UI imports from here. */
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      data: displayName ? { name: displayName } : undefined,
    },
  });
}

export async function signInWithGoogle() {
  return lovable.auth.signInWithOAuth("google", {
    redirect_uri: typeof window !== "undefined" ? window.location.origin : undefined,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
