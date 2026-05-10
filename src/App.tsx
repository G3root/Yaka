import { useAtom, useAtomSet } from "@effect/atom-react"
import { TextAttributes } from "@opentui/core"
import { useRenderer } from "@opentui/react"
import { Effect } from "effect"
import * as Atom from "effect/unstable/reactivity/Atom"
import { useCallback, useEffect, useRef } from "react"
import { loadStoredThemeConfig, resolveThemeName, type ThemeConfig } from "./themeStore.ts"
import { setActiveTheme, setSystemThemeColors, theme } from "./atoms/theme.tsx"

interface AppProps {
	readonly systemThemeGeneration?: number
}

const initialThemeConfig = await Effect.runPromise(loadStoredThemeConfig)
const initialSystemAppearance = "dark"
const initialThemeName = resolveThemeName(initialThemeConfig, initialSystemAppearance)
setActiveTheme(initialThemeName, initialSystemAppearance)

const themeConfigAtom = Atom.make<ThemeConfig>(initialThemeConfig).pipe(Atom.keepAlive)
const systemAppearanceAtom = Atom.make<"dark" | "light">(initialSystemAppearance).pipe(Atom.keepAlive)
const themeNameAtom = Atom.make(initialThemeName).pipe(Atom.keepAlive)

const pickMode = (value: unknown): "dark" | "light" | undefined => {
	if (value === "dark" || value === "light") return value
	return undefined
}

export function App({ systemThemeGeneration = 0 }: AppProps) {
	const renderer = useRenderer()
	const [themeConfig] = useAtom(themeConfigAtom)
	const [systemAppearance, setSystemAppearance] = useAtom(systemAppearanceAtom)
	const setThemeName = useAtomSet(themeNameAtom)
	const themeConfigRef = useRef(themeConfig)
	const systemAppearanceRef = useRef(systemAppearance)
	themeConfigRef.current = themeConfig
	systemAppearanceRef.current = systemAppearance

	const applyTheme = useCallback(
		async (isCancelled: () => boolean = () => false) => {
			const appearance = pickMode(renderer.themeMode) ?? systemAppearanceRef.current
			const colors = await renderer.getPalette({ size: 16 }).catch(() => undefined)
			if (isCancelled()) return
			if (colors) setSystemThemeColors(colors, appearance)
			const nextTheme = resolveThemeName(themeConfigRef.current, appearance)
			setActiveTheme(nextTheme, appearance)
			setSystemAppearance(appearance)
			setThemeName(nextTheme)
			renderer.setBackgroundColor(theme.background)
		},
		[renderer, setSystemAppearance, setThemeName],
	)

	useEffect(() => {
		let cancelled = false
		void applyTheme(() => cancelled)
		return () => {
			cancelled = true
		}
	}, [applyTheme, systemThemeGeneration])

	useEffect(() => {
		if (themeConfig.mode !== "system") return
		let cancelled = false
		const refreshAppearance = () => {
			const appearance = pickMode(renderer.themeMode) ?? systemAppearanceRef.current
			if (cancelled || appearance === systemAppearanceRef.current) return
			void applyTheme()
		}
		const interval = globalThis.setInterval(refreshAppearance, 1000)
		refreshAppearance()
		return () => {
			cancelled = true
			globalThis.clearInterval(interval)
		}
	}, [applyTheme, renderer.themeMode, themeConfig.mode])

	return (
		<box alignItems="center" justifyContent="center" flexGrow={1} backgroundColor={theme.background}>
			<box justifyContent="center" alignItems="flex-end">
				<ascii-font font="tiny" text="OpenTUI" />
				<text fg={theme.textMuted} attributes={TextAttributes.DIM}>
					What will you build?
				</text>
			</box>
		</box>
	)
}
