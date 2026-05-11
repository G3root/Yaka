import { existsSync, mkdirSync, readFileSync, readdirSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { Database as SQLiteDatabase } from "bun:sqlite"
import { drizzle, type SQLiteBunDatabase } from "drizzle-orm/bun-sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
export * from "drizzle-orm"
import * as schema from "./schema.js"

type Client = SQLiteBunDatabase<typeof schema> & { $client: SQLiteDatabase }
type JournalEntry = { sql: string; timestamp: number; name: string }
declare const YAKA_MIGRATIONS: JournalEntry[] | undefined

let sqlite: SQLiteDatabase | undefined
let client: Client | undefined

const defaultDataDir = path.join(process.cwd(), ".yaka")
const defaultDatabasePath = path.join(defaultDataDir, "yaka.db")
const databasePath = process.env.YAKA_DB_PATH ?? defaultDatabasePath
const storageDir = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.join(storageDir, "migrations")

// Drizzle's migrate overloads are broader than what we use here; narrow to the journal form.
const migrateFromJournal = migrate as unknown as (db: Client, entries: JournalEntry[]) => void

function ensureDatabaseDirectory(filePath: string) {
	if (filePath === ":memory:") return
	mkdirSync(path.dirname(filePath), { recursive: true })
}

function applyPragmas(db: SQLiteDatabase) {
	db.run("PRAGMA journal_mode = WAL")
	db.run("PRAGMA synchronous = NORMAL")
	db.run("PRAGMA busy_timeout = 5000")
	db.run("PRAGMA cache_size = -64000")
	db.run("PRAGMA foreign_keys = ON")
	db.run("PRAGMA wal_checkpoint(PASSIVE)")
}

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

function loadMigrations(dir: string): JournalEntry[] {
	if (!existsSync(dir)) return []

	const entries = readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.map((name) => {
			const file = path.join(dir, name, "migration.sql")
			if (!existsSync(file)) return undefined
			return {
				sql: readFileSync(file, "utf-8"),
				timestamp: parseTimestamp(name),
				name,
			}
		})
		.filter((entry) => entry !== undefined)

	return entries.sort((left, right) => left.timestamp - right.timestamp)
}

export function getDatabasePath() {
	return databasePath
}

export function getMigrationsPath() {
	return migrationsDir
}

export function createClient(options?: { migrate?: boolean }) {
	if (client) return client

	ensureDatabaseDirectory(databasePath)

	sqlite = new SQLiteDatabase(databasePath)
	applyPragmas(sqlite)

	client = drizzle({ client: sqlite, schema })

	if (options?.migrate !== false) {
		const entries =
			typeof YAKA_MIGRATIONS !== "undefined" ? YAKA_MIGRATIONS : loadMigrations(migrationsDir)
		if (entries.length > 0) migrateFromJournal(client, entries)
	}

	return client
}

export const db = createClient()

export function close() {
	sqlite?.close()
	sqlite = undefined
	client = undefined
}
