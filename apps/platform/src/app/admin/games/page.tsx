import { redirect } from "next/navigation";
import { AdminGameForm } from "@/components/AdminGameForm";
import { getAllGames, isAdminEmail } from "@/lib/games";
import { getSessionUser } from "@/lib/supabase/server";

export default async function AdminGamesPage() {
  const user = await getSessionUser();

  if (!user || !isAdminEmail(user.email)) {
    redirect("/");
  }

  const allGames = await getAllGames();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin — Games</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Register game metadata after uploading static bundles to{" "}
          <code className="text-zinc-300">/games/&lt;slug&gt;/&lt;version&gt;/</code>.
        </p>
      </div>

      <AdminGameForm />

      <section>
        <h2 className="mb-3 text-lg font-medium text-white">All games</h2>
        <ul className="space-y-2">
          {allGames.map((game) => (
            <li
              key={game.id}
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-white">
                  {game.name}{" "}
                  <span className="text-zinc-500">({game.slug} v{game.version})</span>
                </span>
                <span
                  className={
                    game.isPublished ? "text-emerald-400" : "text-zinc-500"
                  }
                >
                  {game.isPublished ? "Published" : "Draft"}
                </span>
              </div>
              <p className="mt-1 text-zinc-500">{game.entryPath}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
