import { defineConfig } from "drizzle-kit"

const databaseUrl = process.env.YAKA_DB_PATH ?? "./.yaka/yaka.db"

export default defineConfig({
	schema: "./src/storage/schema.ts",
	out: "./src/storage/migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: databaseUrl,
	},
})
