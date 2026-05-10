import { mkdir } from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join } from "node:path"
import { Effect } from "effect"

export type ThemeMode = "fixed" | "system"

export type ThemeConfig =
	| {
			readonly mode: "fixed"
			readonly theme: string
	  }
	| {
			readonly mode: "system"
			readonly darkTheme: string
			readonly lightTheme: string
	  }

interface StoredConfig {
	readonly theme?: unknown
	readonly themeMode?: unknown
	readonly darkTheme?: unknown
	readonly lightTheme?: unknown
}

const defaultDarkTheme = "opencode"
const defaultLightTheme = "github"

const configDirectory = () => {
	if (process.env.YAKA_CONFIG_DIR) return process.env.YAKA_CONFIG_DIR
	if (process.env.XDG_CONFIG_HOME) return join(process.env.XDG_CONFIG_HOME, "yaka")
	if (process.platform === "win32" && process.env.APPDATA) return join(process.env.APPDATA, "yaka")
	return join(homedir(), ".config", "yaka")
}

export const configPath = () => join(configDirectory(), "config.json")

const parseConfig = (text: string): StoredConfig => {
	const value = JSON.parse(text) as unknown
	return value && typeof value === "object" && !Array.isArray(value) ? value : {}
}

const readStoredConfig = async () => {
	const file = Bun.file(configPath())
	return (await file.exists()) ? parseConfig(await file.text()) : {}
}

const writeStoredConfig = async (config: StoredConfig) => {
	const path = configPath()
	await mkdir(dirname(path), { recursive: true })
	await Bun.write(path, `${JSON.stringify(config, null, "\t")}\n`)
}

const storedTheme = (value: unknown, fallback: string) => (typeof value === "string" && value.length > 0 ? value : fallback)

export const defaultThemeConfig: ThemeConfig = {
	mode: "fixed",
	theme: defaultDarkTheme,
}

export const normalizeThemeConfig = (config: StoredConfig): ThemeConfig => {
	const fixedTheme = storedTheme(config.theme, defaultDarkTheme)
	if (config.themeMode !== "system") return { mode: "fixed", theme: fixedTheme }

	return {
		mode: "system",
		darkTheme: storedTheme(config.darkTheme, fixedTheme),
		lightTheme: storedTheme(config.lightTheme, defaultLightTheme),
	}
}

export const resolveThemeName = (config: ThemeConfig, appearance: "dark" | "light") => {
	return config.mode === "fixed" ? config.theme : appearance === "dark" ? config.darkTheme : config.lightTheme
}

export const themeConfigWithSelection = (config: ThemeConfig, theme: string, appearance: "dark" | "light"): ThemeConfig => {
	if (config.mode === "fixed") return { mode: "fixed", theme }
	return appearance === "dark" ? { ...config, darkTheme: theme } : { ...config, lightTheme: theme }
}

export const fixedThemeConfig = (theme: string): ThemeConfig => ({ mode: "fixed", theme })

export const systemThemeConfig = (darkTheme: string, lightTheme: string): ThemeConfig => ({
	mode: "system",
	darkTheme,
	lightTheme,
})

export const loadStoredThemeConfig: Effect.Effect<ThemeConfig> = Effect.catchCause(
	Effect.tryPromise(async () => normalizeThemeConfig(await readStoredConfig())),
	() => Effect.succeed(defaultThemeConfig),
)

export const saveStoredThemeConfig = (themeConfig: ThemeConfig): Effect.Effect<void> =>
	Effect.tryPromise(async () => {
		const config = await readStoredConfig()
		const nextConfig =
			themeConfig.mode === "fixed"
				? { ...config, themeMode: "fixed", theme: themeConfig.theme }
				: {
						...config,
						themeMode: "system",
						darkTheme: themeConfig.darkTheme,
						lightTheme: themeConfig.lightTheme,
					}

		await writeStoredConfig(nextConfig)
	})
