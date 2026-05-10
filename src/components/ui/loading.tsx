import { TextAttributes, type RGBA } from "@opentui/core"
import { useRenderer, useTerminalDimensions } from "@opentui/react"
import { useEffect, useMemo, useState } from "react"
import { DEFAULT_THEMES, resolveTheme, tint } from "../../atoms/theme.tsx"
import { SPINNER_FRAMES, SPINNER_INTERVAL_MS } from "./spinner.ts"

const LOGO = ["█   █  ▄▀▄  █  █  ▄▀▄", " ▀▄▀   █▀█  █▀▄   █▀█", "  █    ▀ ▀  ▀ ▀   ▀ ▀"] as const
const LOGO_WIDTH = Math.max(...LOGO.map((line) => line.length))
const LOGO_HEIGHT = LOGO.length
const LOGO_BLOCK_HEIGHT = LOGO_HEIGHT + 2

const centerCell = (text: string, width: number) => {
	const trimmed = text.length > width ? text.slice(0, Math.max(0, width - 1)) : text
	const left = Math.floor((width - trimmed.length) / 2)
	return `${" ".repeat(Math.max(0, left))}${trimmed}`.padEnd(width, " ")
}

const Filler = ({ rows, prefix }: { readonly rows: number; readonly prefix: string }) => (
	<>
		{Array.from({ length: rows }, (_, index) => (
			<box key={`${prefix}-${index}`} height={1} />
		))}
	</>
)

const PlainLine = ({ text, fg }: { readonly text: string; readonly fg: RGBA }) => (
	<box height={1}>
		<text wrapMode="none" truncate fg={fg}>
			{text}
		</text>
	</box>
)

export const LoadingLogoPane = ({ hint, width, height, frame }: { readonly hint: string; readonly width: number; readonly height: number; readonly frame: number }) => {
	const theme = useMemo(() => resolveTheme(DEFAULT_THEMES.opencode!, "dark"), [])
	const spinner = SPINNER_FRAMES[frame % SPINNER_FRAMES.length]!

	if (width < LOGO_WIDTH + 2 || height < LOGO_BLOCK_HEIGHT) {
		const topRows = Math.max(0, Math.floor((height - 1) / 2))
		const bottomRows = Math.max(0, height - topRows - 1)
		return (
			<box height={height} flexDirection="column">
				<Filler rows={topRows} prefix="loading-logo-compact-top" />
				<PlainLine text={centerCell(`${spinner} ${hint}`, width)} fg={theme.textMuted} />
				<Filler rows={bottomRows} prefix="loading-logo-compact-bottom" />
			</box>
		)
	}

	const topRows = Math.max(0, Math.floor((height - LOGO_BLOCK_HEIGHT) / 2))
	const bottomRows = Math.max(0, height - topRows - LOGO_BLOCK_HEIGHT)
	const left = Math.max(0, Math.floor((width - LOGO_WIDTH) / 2))
	const logoColor = tint(theme.accent, theme.text, 0.28)

	return (
		<box height={height} flexDirection="column">
			<Filler rows={topRows} prefix="loading-logo-top" />
			<box flexDirection="column" width={width}>
				{LOGO.map((row, rowIndex) => (
					<box key={rowIndex} height={1}>
						<text wrapMode="none" truncate>
							<span fg={theme.textMuted}>{" ".repeat(left)}</span>
							{Array.from(row).map((char, index) =>
								char === " " ? (
									<span key={index}> </span>
								) : (
									<span key={index} fg={logoColor} attributes={TextAttributes.BOLD}>
										{char}
									</span>
								),
							)}
						</text>
					</box>
				))}
				<box height={1} />
				<PlainLine text={centerCell(`${spinner} ${hint}`, width)} fg={theme.textMuted} />
			</box>
			<Filler rows={bottomRows} prefix="loading-logo-bottom" />
		</box>
	)
}

export const StartupLogo = () => {
	const renderer = useRenderer()
	const { width, height } = useTerminalDimensions()
	const [frame, setFrame] = useState(0)
	const theme = useMemo(() => resolveTheme(DEFAULT_THEMES.opencode!, "dark"), [])

	useEffect(() => {
		renderer.setBackgroundColor(theme.background)
	}, [renderer, theme.background])

	useEffect(() => {
		const interval = globalThis.setInterval(() => setFrame((current) => current + 1), SPINNER_INTERVAL_MS)
		return () => globalThis.clearInterval(interval)
	}, [])

	return (
		<box width={width} height={height} flexDirection="column" backgroundColor={theme.background}>
			<LoadingLogoPane hint="Starting yaka" width={width} height={height} frame={frame} />
		</box>
	)
}
