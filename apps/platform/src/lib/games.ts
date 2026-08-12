import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, type Game } from "@/lib/db/schema";

export async function getPublishedGames(): Promise<Game[]> {
  return db
    .select()
    .from(games)
    .where(eq(games.isPublished, true))
    .orderBy(asc(games.name));
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  const rows = await db.select().from(games).where(eq(games.slug, slug)).limit(1);
  return rows[0];
}

export async function getAllGames(): Promise<Game[]> {
  return db.select().from(games).orderBy(desc(games.createdAt));
}

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) {
    return false;
  }

  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.length === 0) {
    return false;
  }

  return allowlist.includes(email.toLowerCase());
}
