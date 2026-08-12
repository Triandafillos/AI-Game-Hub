import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, saves } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/supabase/server";

export default async function AccountPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const userSaves = await db
    .select({
      slug: games.slug,
      name: games.name,
      updatedAt: saves.updatedAt,
    })
    .from(saves)
    .innerJoin(games, eq(saves.gameId, games.id))
    .where(eq(saves.userId, user.id));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Account</h1>
      <p className="mt-2 text-zinc-400">{user.email}</p>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-white">Saved games</h2>
        {userSaves.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500">No saves yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {userSaves.map((save) => (
              <li
                key={save.slug}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm"
              >
                <span className="text-white">{save.name}</span>
                <span className="text-zinc-500">
                  {save.updatedAt.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
