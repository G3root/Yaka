import { TextAttributes } from "@opentui/core"
import { theme, tint } from "../../../atoms/theme.tsx"
import { useDashboard } from "../dashboard-context.tsx"
import { CommandHint } from "./primitives.tsx"

export const Sidebar = () => {
	const {
		state: { selectedNavigationIndex, focusedPane },
		meta: { navigationItems },
	} = useDashboard()
	const focused = focusedPane === "control-plane"

	return (
		<box
			width={24}
			flexShrink={0}
			flexDirection="column"
			border
			borderStyle="single"
			borderColor={focused ? theme.borderActive : theme.border}
			paddingX={1}
			paddingY={1}
			backgroundColor={theme.backgroundPanel}
		>
			<box height={4} flexDirection="column">
				<text fg={theme.accent} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
					yaka
				</text>
				<text fg={focused ? theme.text : theme.textMuted} wrapMode="none" truncate>
					server control plane
				</text>
			</box>
			<box flexDirection="column" gap={1}>
				{navigationItems.map((item, index) => {
					const active = index === selectedNavigationIndex
					return (
						<box key={item} height={1} backgroundColor={active ? tint(theme.primary, theme.backgroundPanel, 0.72) : theme.backgroundPanel}>
							<text fg={active ? theme.text : theme.textMuted} attributes={active ? TextAttributes.BOLD : 0} wrapMode="none" truncate>
								{active ? ">" : " "} {item}
							</text>
						</box>
					)
				})}
			</box>
			<box flexGrow={1} />
			<box flexDirection="column" gap={0}>
				<CommandHint label="tab" value="switch pane" />
				<CommandHint label="↑/↓" value="move focused" />
				<CommandHint label="n" value="new project" />
				<CommandHint label="esc" value="quit" />
			</box>
		</box>
	)
}
