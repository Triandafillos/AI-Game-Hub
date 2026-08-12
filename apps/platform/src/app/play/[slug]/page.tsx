import { redirect } from "next/navigation";
import { GamePlayer } from "@/components/GamePlayer";
import { getGameBySlug } from "@/lib/games";
import { getSessionUser } from "@/lib/supabase/server";

type PlayPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PlayPage({ params }: PlayPageProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game || !game.isPublished) {
    redirect("/");
  }

  const user = await getSessionUser();

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-white">{game.name}</h1>
        {!user && (
          <p className="mt-1 text-sm text-amber-400/90">
            Log in to save and load your progress.
          </p>
        )}
      </div>
      <GamePlayer
        slug={game.slug}
        entryPath={game.entryPath}
        user={user ? { id: user.id, email: user.email } : null}
      />
    </div>
  );
}
