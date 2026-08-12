import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { games } from "@/lib/db/schema";
import { isAdminEmail } from "@/lib/games";
import { getSessionUser } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    slug?: string;
    name?: string;
    description?: string;
    version?: string;
    entryPath?: string;
    isPublished?: boolean;
    maxSaveBytes?: number;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { slug, name, description, version, entryPath, isPublished, maxSaveBytes } = body;

  if (!slug || !name || !version || !entryPath) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const [created] = await db
      .insert(games)
      .values({
        slug,
        name,
        description: description || null,
        version,
        entryPath,
        isPublished: Boolean(isPublished),
        maxSaveBytes: maxSaveBytes ?? 262144,
      })
      .returning();

    return NextResponse.json({ game: created }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create game (slug may already exist)" }, { status: 409 });
  }
}
