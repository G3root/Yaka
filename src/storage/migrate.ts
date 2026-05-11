import { close, createClient, getDatabasePath, getMigrationsPath } from "./db.js"

createClient()

console.log(`Applied migrations from ${getMigrationsPath()} to ${getDatabasePath()}.`)

close()
