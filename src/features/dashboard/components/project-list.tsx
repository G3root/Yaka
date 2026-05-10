import { TextAttributes } from "@opentui/core"
import { theme, tint } from "../../../atoms/theme.tsx"
import { useDashboard } from "../dashboard-context.tsx"
import { primaryEnvironment, statusColor, statusLabel, totalServices } from "../model.ts"
import type { Project } from "../types.ts"
import { SectionTitle } from "./primitives.tsx"

export const ProjectRow = ({ project, active }: { readonly project: Project; readonly active: boolean }) => {
	const environment = primaryEnvironment(project)
	return (
		<box
			height={5}
			paddingX={1}
			paddingY={0}
			border={active}
			borderStyle="single"
			borderColor={active ? theme.borderActive : theme.backgroundElement}
			backgroundColor={active ? tint(theme.primary, theme.backgroundPanel, 0.8) : theme.backgroundElement}
		>
			<box flexDirection="column">
				<box height={1} flexDirection="row" justifyContent="space-between">
					<text fg={theme.text} attributes={active ? TextAttributes.BOLD : 0} wrapMode="none" truncate>
						{project.name}
					</text>
					<text fg={statusColor(project.status)} wrapMode="none" truncate>
						● {statusLabel[project.status]}
					</text>
				</box>
				<text fg={theme.textMuted} wrapMode="none" truncate>
					{project.description}
				</text>
				<text fg={theme.textMuted} wrapMode="none" truncate>
					{project.environments.length} envs · {totalServices(project)} services · {environment.region}
				</text>
			</box>
		</box>
	)
}

export const ProjectList = () => {
	const {
		state: { projects, selectedProjectIndex, focusedPane },
	} = useDashboard()
	const focused = focusedPane === "projects"

	return (
		<box
			width={38}
			flexShrink={0}
			flexDirection="column"
			border
			borderStyle="single"
			borderColor={focused ? theme.borderActive : theme.border}
			paddingX={1}
			paddingY={1}
			gap={1}
			backgroundColor={theme.backgroundPanel}
		>
			<SectionTitle title="Projects" meta={`${projects.length} total`} />
			{projects.map((project, index) => (
				<ProjectRow key={project.id} project={project} active={index === selectedProjectIndex} />
			))}
		</box>
	)
}
