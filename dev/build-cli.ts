#!/usr/bin/env bun

import { mkdir } from "node:fs/promises"
import path from "node:path"
import { loadMigrations } from "./build-shared.ts"

const rootDir = path.resolve(import.meta.dirname, "..")
process.chdir(rootDir)

const migrations = await loadMigrations(rootDir)
await mkdir(path.join(rootDir, "bin"), { recursive: true })

const result = await Bun.build({
	entrypoints: ["src/index.tsx"],
	format: "esm",
	outdir: "dist",
	target: "bun",
	external: ["@effect/atom-react", "@opentui/core", "@opentui/react", "@opentui/react/jsx-dev-runtime", "@opentui/react/jsx-runtime", "effect", "react", "scheduler"],
	define: {
		YAKA_MIGRATIONS: JSON.stringify(migrations),
	},
})

if (!result.success) {
	for (const log of result.logs) console.error(log)
	process.exit(1)
}

console.log(`Built CLI bundle with ${migrations.length} embedded migrations.`)
