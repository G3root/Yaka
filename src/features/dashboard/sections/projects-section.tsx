import { TextAttributes } from "@opentui/core"
import { theme } from "../../../atoms/theme.tsx"
import { useDashboard } from "../dashboard-context.tsx"
import { averageMetric, progressBar, statusColor, statusLabel, totalServices } from "../model.ts"
import type { Deployment, Environment, Service } from "../types.ts"
import { MetricCard, SectionTitle } from "../components/primitives.tsx"

const DeploymentRow = ({ deployment }: { readonly deployment: Deployment }) => (
	<box height={1} flexDirection="row" justifyContent="space-between">
		<text fg={theme.text} wrapMode="none" truncate>
			{deployment.id} · {deployment.environment} · {deployment.branch}
		</text>
		<text fg={statusColor(deployment.status)} wrapMode="none" truncate>
			{deployment.commit} · {deployment.createdAt}
		</text>
	</box>
)

const EnvironmentRow = ({ active, environment }: { readonly active: boolean; readonly environment: Environment }) => (
	<box
		height={3}
		flexDirection="column"
		border
		borderStyle="single"
		borderColor={active ? theme.borderActive : theme.borderSubtle}
		paddingX={1}
		backgroundColor={active ? theme.backgroundPanel : theme.backgroundElement}
	>
		<box height={1} flexDirection="row" justifyContent="space-between">
			<text fg={theme.text} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
				{environment.name}
			</text>
			<text fg={theme.textMuted} wrapMode="none" truncate>
				{environment.services.length} services
			</text>
		</box>
		<text fg={theme.textMuted} wrapMode="none" truncate>
			{environment.region} · {environment.domain}
		</text>
	</box>
)

const ServiceRow = ({ service }: { readonly service: Service }) => (
	<box height={2} flexDirection="column">
		<box height={1} flexDirection="row" justifyContent="space-between">
			<text fg={theme.text} wrapMode="none" truncate>
				{service.type}:{service.name}
			</text>
			<text fg={statusColor(service.status)} wrapMode="none" truncate>
				{statusLabel[service.status]}
			</text>
		</box>
		<text fg={theme.textMuted} wrapMode="none" truncate>
			{service.image} · CPU {service.cpu}% · MEM {service.memory}%
		</text>
	</box>
)

export const ProjectsSection = () => {
	const {
		state: { focusedPane, selectedEnvironment: environment, selectedEnvironmentIndex, selectedProject: project },
	} = useDashboard()
	const current = project.deployments[0]!
	const cpu = averageMetric(project, "cpu")
	const memory = averageMetric(project, "memory")
	const focused = focusedPane === "content"

	return (
		<box
			flexGrow={1}
			flexDirection="column"
			border
			borderStyle="single"
			borderColor={focused ? theme.borderActive : theme.border}
			paddingX={1}
			paddingY={1}
			gap={1}
			backgroundColor={theme.backgroundPanel}
		>
			<box height={6} flexDirection="column">
				<box height={1} flexDirection="row" justifyContent="space-between">
					<text fg={theme.text} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
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
					{project.repo}
				</text>
				<text fg={theme.textMuted} wrapMode="none" truncate>
					primary: {environment.name} · {environment.domain}
				</text>
			</box>

			<box height={4} flexDirection="row" gap={1}>
				<MetricCard label="Avg CPU" value={`${cpu}% ${progressBar(cpu, 10)}`} tone={cpu > 70 ? theme.warning : theme.success} />
				<MetricCard label="Avg Memory" value={`${memory}% ${progressBar(memory, 10)}`} tone={memory > 80 ? theme.warning : theme.info} />
				<MetricCard label="Services" value={`${totalServices(project)} across ${project.environments.length} envs`} tone={theme.accent} />
			</box>

			<box height={8} flexDirection="row" gap={1}>
				<box
					flexGrow={1}
					flexDirection="column"
					border
					borderStyle="single"
					borderColor={theme.borderSubtle}
					paddingX={1}
					paddingY={0}
					gap={1}
					backgroundColor={theme.backgroundElement}
				>
					<SectionTitle title="Environments" meta={focused ? "j/k select" : "tab focus"} />
					{project.environments.map((projectEnvironment) => (
						<EnvironmentRow key={projectEnvironment.id} environment={projectEnvironment} active={project.environments[selectedEnvironmentIndex]?.id === projectEnvironment.id} />
					))}
				</box>
				<box
					flexGrow={1}
					flexDirection="column"
					border
					borderStyle="single"
					borderColor={theme.borderSubtle}
					paddingX={1}
					paddingY={0}
					gap={0}
					backgroundColor={theme.backgroundElement}
				>
					<SectionTitle title={`${environment.name} Services`} meta="d deploy" />
					{environment.services.map((service) => (
						<ServiceRow key={service.id} service={service} />
					))}
				</box>
			</box>

			<box
				flexGrow={1}
				flexDirection="column"
				border
				borderStyle="single"
				borderColor={theme.borderSubtle}
				paddingX={1}
				paddingY={0}
				gap={0}
				backgroundColor={theme.backgroundElement}
			>
				<SectionTitle title="Recent Deployments" meta={current.createdAt} />
				{project.deployments.map((deployment) => (
					<DeploymentRow key={deployment.id} deployment={deployment} />
				))}
			</box>
		</box>
	)
}
