import { TextAttributes } from "@opentui/core"
import { useKeyboard, useRenderer, useTerminalDimensions } from "@opentui/react"
import { theme } from "../../atoms/theme.tsx"
import { DashboardProvider, useDashboard } from "./dashboard-context.tsx"
import { ProjectList } from "./components/project-list.tsx"
import { Sidebar } from "./components/sidebar.tsx"
import { MainContent } from "./components/main-content.tsx"
import { CommandHint } from "./components/primitives.tsx"

const DashboardKeyboard = () => {
	const renderer = useRenderer()
	const {
		actions: { createProject, deploySelectedProject, moveFocusedSelection, switchFocusPane },
	} = useDashboard()

	useKeyboard((key) => {
		switch (key.name) {
			case "escape":
				renderer.destroy()
				break
			case "tab":
			case "right":
			case "left":
				switchFocusPane()
				break
			case "up":
			case "k":
				moveFocusedSelection(-1)
				break
			case "down":
			case "j":
				moveFocusedSelection(1)
				break
			case "n":
				createProject()
				break
			case "d":
				deploySelectedProject()
				break
		}
	})

	return null
}

const DashboardFrame = () => {
	const { width, height } = useTerminalDimensions()

	return (
		<box width={width} height={height} flexDirection="column" backgroundColor={theme.background} paddingX={1} paddingY={1} gap={1}>
			<box height={3} flexDirection="row" justifyContent="space-between" alignItems="center">
				<box flexDirection="column">
					<text fg={theme.text} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
						Deployments Dashboard
					</text>
					<text fg={theme.textMuted} attributes={TextAttributes.DIM} wrapMode="none" truncate>
						Projects contain environments; environments contain app, db, worker, and cache services
					</text>
				</box>
				<box flexDirection="row" gap={2}>
					<CommandHint label="tab/←/→" value="pane" />
					<CommandHint label="j/k" value="move" />
					<CommandHint label="n" value="new project" />
					<CommandHint label="d" value="deploy" />
					<CommandHint label="esc" value="exit" />
				</box>
			</box>
			<box flexGrow={1} flexDirection="row" gap={1}>
				<Sidebar />
				<ProjectList />
				<MainContent />
			</box>
		</box>
	)
}

export const Dashboard = () => (
	<DashboardProvider>
		<DashboardKeyboard />
		<DashboardFrame />
	</DashboardProvider>
)
