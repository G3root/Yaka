import { sqliteTable } from "drizzle-orm/sqlite-core"
import * as t from "drizzle-orm/sqlite-core"
import { projectTable } from "./projects.js"

export const tagTable = sqliteTable("tag", {
	id: t.text("id").primaryKey(),
	name: t.text("name").notNull(),

	createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
	updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }),
})

export const projectTagsTable = sqliteTable(
	"project_tags",
	{
		id: t.text("id").primaryKey(),
		projectId: t
			.text("project_id")
			.notNull()
			.references(() => projectTable.id, { onDelete: "cascade" }),
		tagId: t
			.text("tag_id")
			.notNull()
			.references(() => tagTable.id, { onDelete: "cascade" }),

		createdAt: t.integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: t.integer("updated_at", { mode: "timestamp_ms" }),
	},
	(table) => [t.unique("unique_project_tag").on(table.projectId, table.tagId)],
)
