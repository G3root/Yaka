import { theme } from "../../../atoms/theme.tsx"
import { useDashboard } from "../dashboard-context.tsx"
import { allDeployments, statusColor, statusLabel } from "../model.ts"
import { SectionTitle } from "../components/primitives.tsx"

export const DeploymentsSection = () => {
	const {
		state: { projects },
	} = useDashboard()
	const deployments = allDeployments(projects)

	return (
		<box flexGrow={1} flexDirection="column" border borderStyle="single" borderColor={theme.border} paddingX={1} paddingY={1} gap={1} backgroundColor={theme.backgroundPanel}>
			<SectionTitle title="Deployments" meta={`${deployments.length} recent`} />
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
				<SectionTitle title="Timeline" meta="dummy" />
				{deployments.map((deployment) => (
					<box key={`${deployment.project}-${deployment.id}`} height={2} flexDirection="column">
						<box height={1} flexDirection="row" justifyContent="space-between">
							<text fg={theme.text} wrapMode="none" truncate>
								{deployment.project} · {deployment.environment} · {deployment.branch}
							</text>
							<text fg={statusColor(deployment.status)} wrapMode="none" truncate>
								{statusLabel[deployment.status]}
							</text>
						</box>
						<text fg={theme.textMuted} wrapMode="none" truncate>
							{deployment.id} · {deployment.commit} · {deployment.createdAt}
						</text>
					</box>
				))}
			</box>
		</box>
	)
}
