import Link from "next/link";
import { getPublishedGames } from "@/lib/games";

export default async function HomePage() {
  const catalog = await getPublishedGames();

  return (
    <div>
      <section className="mb-10">
        <h1 className="text-3xl font-bold text-white">Game Catalog</h1>
        <p className="mt-2 max-w-2xl text-zinc-400">
          Play single-player browser games and pick up where you left off with cloud saves.
        </p>
      </section>

      {catalog.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-zinc-400">
          No published games yet. An admin can add games from the admin panel.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {catalog.map((game) => (
            <li
              key={game.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-indigo-500/50"
            >
              <h2 className="text-xl font-semibold text-white">{game.name}</h2>
              {game.description && (
                <p className="mt-2 text-sm text-zinc-400">{game.description}</p>
              )}
              <Link
                href={`/play/${game.slug}`}
                className="mt-4 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Play
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
