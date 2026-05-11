import packageJson from "../package.json" with { type: "json" }

const help = `yaka ${packageJson.version}

TODO

Usage:
  yaka              Start the TUI
  yaka -v, --version
                    Print the installed version
  yaka -h, --help   Show this help message
`

const args = Bun.argv.slice(2)
const command = args[0]
const commands = ["help", "version"]

const editDistance = (a: string, b: string) => {
	const distances = Array.from({ length: a.length + 1 }, (_, i) => [i])
	for (let j = 1; j <= b.length; j++) distances[0]![j] = j

	for (let i = 1; i <= a.length; i++) {
		for (let j = 1; j <= b.length; j++) {
			distances[i]![j] = Math.min(
				distances[i - 1]![j]! + 1,
				distances[i]![j - 1]! + 1,
				distances[i - 1]![j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
			)
		}
	}

	return distances[a.length]![b.length]!
}

if (command === "-h" || command === "--help" || command === "help") {
	console.log(help)
	process.exit(0)
}

if (command === "-v" || command === "--version" || command === "version") {
	console.log(packageJson.version)
	process.exit(0)
}

if (command === "upgrade") {
	console.error("Use your package manager to upgrade yaka, for example `brew upgrade yaka`.")
	process.exit(1)
}

if (typeof command === "string") {
	const unknownCommand = command
	const suggestion = commands.find((name) => editDistance(unknownCommand, name) <= 2)
	console.error(`Unknown command: ${unknownCommand}`)
	if (suggestion) console.error(`Did you mean: yaka ${suggestion}?`)
	console.error("Run `yaka --help` for usage.")
	process.exit(1)
}

await import("./index.js")
