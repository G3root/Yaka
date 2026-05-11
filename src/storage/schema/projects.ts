import { sqliteTable } from "drizzle-orm/sqlite-core"
import * as t from "drizzle-orm/sqlite-core"

export const projectTable = sqliteTable("project", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	description: t.text("description"),

	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }),
})
