"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    const result =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setMessage(result.error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function handleMagicLink() {
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Check your email for the magic link.");
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h1 className="mb-6 text-2xl font-semibold text-white">
        {mode === "login" ? "Log in" : "Create account"}
      </h1>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <label className="block text-sm text-zinc-300">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </label>

        <label className="block text-sm text-zinc-300">
          Password
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-white"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Working..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <div className="my-4 border-t border-zinc-800 pt-4">
        <button
          type="button"
          disabled={loading || !email}
          onClick={handleMagicLink}
          className="w-full rounded-md border border-zinc-700 py-2 text-zinc-200 hover:bg-zinc-800 disabled:opacity-50"
        >
          Send magic link
        </button>
      </div>

      {message && <p className="text-sm text-zinc-400">{message}</p>}
    </div>
  );
}
