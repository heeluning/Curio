import { pgTable, varchar,serial,timestamp } from "drizzle-orm/pg-core";

export const fileTable = pgTable("files", {
  id: serial("id").primaryKey(),
  file_name: varchar('file_name').notNull(),
  file_key: varchar('file_key').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});

export type FileModal = typeof fileTable.$inferSelect;