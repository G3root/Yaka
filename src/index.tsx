#!/usr/bin/env bun

import { addDefaultParsers, createCliRenderer } from "@opentui/core"
import { createRoot } from "@opentui/react"
import { useEffect, useState } from "react"
import { setSystemThemeColors, theme } from "./atoms/theme.js"
import { StartupLogo } from "./components/ui/loading.js"

process.env.OTUI_USE_ALTERNATE_SCREEN = "true"

const addYakaParsers = () =>
	addDefaultParsers([
		{
			filetype: "bash",
			aliases: ["sh", "shell", "zsh", "ksh"],
			wasm: "https://github.com/tree-sitter/tree-sitter-bash/releases/download/v0.25.1/tree-sitter-bash.wasm",
			queries: {
				highlights: ["https://raw.githubusercontent.com/tree-sitter/tree-sitter-bash/v0.25.1/queries/highlights.scm"],
			},
		},
	])

const FOCUS_REPORTING_ENABLE = "\x1b[?1004h"
const FOCUS_REPORTING_DISABLE = "\x1b[?1004l"

type AppBundle = {
	readonly RegistryProvider: (typeof import("@effect/atom-react"))["RegistryProvider"]
	readonly App: (typeof import("./App.js"))["App"]
}

let notifySystemThemeReload = () => {}

const renderer = await createCliRenderer({
	exitOnCtrlC: true,
	screenMode: "alternate-screen",
	externalOutputMode: "passthrough",
	onDestroy: () => {
		process.stdout.write(FOCUS_REPORTING_DISABLE)
		process.exit(0)
	},
})

const reloadSystemTheme = async () => {
	renderer.clearPaletteCache()
	const terminalColors = await renderer.getPalette({ timeout: 150, size: 16 })
	setSystemThemeColors(terminalColors)
	renderer.setBackgroundColor(theme.background)
	notifySystemThemeReload()
}

const Bootstrap = () => {
	const [appBundle, setAppBundle] = useState<AppBundle | null>(null)
	const [systemThemeGeneration, setSystemThemeGeneration] = useState(0)

	useEffect(() => {
		let cancelled = false
		notifySystemThemeReload = () => setSystemThemeGeneration((current) => current + 1)
		const timer = globalThis.setTimeout(() => {
			addYakaParsers()

			const appBundlePromise = Promise.all([import("@effect/atom-react"), import("./App.js")])
			const palettePromise = reloadSystemTheme().catch(() => {})

			void Promise.all([appBundlePromise, palettePromise]).then(([[{ RegistryProvider }, { App }]]) => {
				if (cancelled) return
				setAppBundle({ RegistryProvider, App })
			})
		}, 0)

		return () => {
			cancelled = true
			notifySystemThemeReload = () => {}
			globalThis.clearTimeout(timer)
		}
	}, [])

	if (appBundle) {
		const { RegistryProvider, App } = appBundle
		return (
			<RegistryProvider>
				<App systemThemeGeneration={systemThemeGeneration} />
			</RegistryProvider>
		)
	}

	return <StartupLogo />
}

process.on("SIGUSR2", () => {
	void reloadSystemTheme().catch(() => {})
})

process.stdout.write(FOCUS_REPORTING_ENABLE)

createRoot(renderer).render(<Bootstrap />)
