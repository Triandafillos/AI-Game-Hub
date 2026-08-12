import { NextResponse, type NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { saves } from "@/lib/db/schema";
import { getGameBySlug } from "@/lib/games";
import { getSessionUser } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const game = await getGameBySlug(slug);

  if (!game || !game.isPublished) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const existing = await db
    .select()
    .from(saves)
    .where(and(eq(saves.userId, user.id), eq(saves.gameId, game.id)))
    .limit(1);

  return NextResponse.json({ data: existing[0]?.data ?? null });
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await context.params;
  const game = await getGameBySlug(slug);

  if (!game || !game.isPublished) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  let body: { data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (body.data === undefined) {
    return NextResponse.json({ error: "Missing data field" }, { status: 400 });
  }

  const serialized = JSON.stringify(body.data);
  if (serialized.length > game.maxSaveBytes) {
    return NextResponse.json({ error: "Save data too large" }, { status: 413 });
  }

  await db
    .insert(saves)
    .values({
      userId: user.id,
      gameId: game.id,
      data: body.data,
      saveSchemaVersion: game.saveSchemaVersion,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [saves.userId, saves.gameId],
      set: {
        data: body.data,
        saveSchemaVersion: game.saveSchemaVersion,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ ok: true });
}
