import { sqliteTable } from "drizzle-orm/sqlite-core"
import * as t from "drizzle-orm/sqlite-core"
import { projectTable } from "./projects.ts"

export const environmentTable = sqliteTable("environment", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),
	description: t.text("description"),
	defaultedOn: t.integer("defaulted_on", { mode: "timestamp_ms" }),

	projectId: t
		.text("project_id")
		.notNull()
		.references(() => projectTable.id, { onDelete: "cascade" }),

	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }),
})
