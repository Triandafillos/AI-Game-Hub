"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminGameForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      slug: String(form.get("slug")),
      name: String(form.get("name")),
      description: String(form.get("description") || ""),
      version: String(form.get("version")),
      entryPath: String(form.get("entryPath")),
      isPublished: form.get("isPublished") === "on",
      maxSaveBytes: Number(form.get("maxSaveBytes") || 262144),
    };

    const response = await fetch("/api/admin/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!response.ok) {
      const body = (await response.json().catch(() => ({}))) as { error?: string };
      setMessage(body.error ?? "Failed to register game");
      return;
    }

    setMessage("Game registered.");
    router.refresh();
    event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="text-lg font-medium text-white">Register game</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-zinc-300">
          Slug
          <input name="slug" required className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
        </label>
        <label className="block text-sm text-zinc-300">
          Name
          <input name="name" required className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
        </label>
        <label className="block text-sm text-zinc-300 sm:col-span-2">
          Description
          <input name="description" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
        </label>
        <label className="block text-sm text-zinc-300">
          Version
          <input name="version" required defaultValue="1.0.0" className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2" />
        </label>
        <label className="block text-sm text-zinc-300">
          Entry path
          <input
            name="entryPath"
            required
            defaultValue="/games/click-counter/1.0.0/index.html"
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-zinc-300">
          Max save bytes
          <input
            name="maxSaveBytes"
            type="number"
            defaultValue={262144}
            className="mt-1 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-300">
          <input name="isPublished" type="checkbox" defaultChecked className="rounded" />
          Published
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50"
      >
        {loading ? "Saving..." : "Register game"}
      </button>

      {message && <p className="text-sm text-zinc-400">{message}</p>}
    </form>
  );
}
