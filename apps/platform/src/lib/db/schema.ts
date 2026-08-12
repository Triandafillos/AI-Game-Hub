import { boolean, integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  version: text("version").notNull(),
  entryPath: text("entry_path").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  saveSchemaVersion: integer("save_schema_version").notNull().default(1),
  maxSaveBytes: integer("max_save_bytes").notNull().default(262144),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const saves = pgTable(
  "saves",
  {
    userId: uuid("user_id").notNull(),
    gameId: uuid("game_id")
      .notNull()
      .references(() => games.id, { onDelete: "cascade" }),
    data: jsonb("data").notNull(),
    saveSchemaVersion: integer("save_schema_version").notNull().default(1),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.gameId] })],
);

export type Game = typeof games.$inferSelect;
export type NewGame = typeof games.$inferInsert;
export type Save = typeof saves.$inferSelect;
