import { readdir } from "node:fs/promises"
import path from "node:path"

export type MigrationEntry = {
	sql: string
	timestamp: number
	name: string
}

const migrationNamePattern = /^\d{14}/

function parseTimestamp(tag: string) {
	const match = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/.exec(tag)
	if (!match) return 0

	return Date.UTC(
		Number(match[1]),
		Number(match[2]) - 1,
		Number(match[3]),
		Number(match[4]),
		Number(match[5]),
		Number(match[6]),
	)
}

export async function loadMigrations(rootDir: string): Promise<MigrationEntry[]> {
	const migrationsDir = path.join(rootDir, "src/storage/migrations")
	const entries = await readdir(migrationsDir, { withFileTypes: true })
	const migrationDirs = entries
		.filter((entry) => entry.isDirectory() && migrationNamePattern.test(entry.name))
		.map((entry) => entry.name)
		.sort()

	return Promise.all(
		migrationDirs.map(async (name) => {
			const file = path.join(migrationsDir, name, "migration.sql")
			const sql = await Bun.file(file).text()
			return {
				sql,
				timestamp: parseTimestamp(name),
				name,
			}
		}),
	)
}
