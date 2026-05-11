import { sqliteTable } from "drizzle-orm/sqlite-core"
import * as t from "drizzle-orm/sqlite-core"

export const appMetaTable = sqliteTable("app_meta", {
	id: t.text("id").primaryKey(),
	key: t.text("key").primaryKey(),
	value: t.text("value"),
})
