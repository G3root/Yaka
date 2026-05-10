import { theme } from "../../atoms/theme.tsx"
import type { Deployment, Project, ProjectStatus } from "./types.ts"

export const statusLabel: Record<ProjectStatus, string> = {
	healthy: "Healthy",
	deploying: "Deploying",
	warning: "Attention",
	failed: "Failed",
}

export const statusColor = (status: ProjectStatus) => {
	switch (status) {
		case "healthy":
			return theme.success
		case "deploying":
			return theme.info
		case "warning":
			return theme.warning
		case "failed":
			return theme.error
	}
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const progressBar = (value: number, width = 18) => {
	const filled = Math.round((clamp(value, 0, 100) / 100) * width)
	return `${"█".repeat(filled)}${"░".repeat(width - filled)}`
}

export const totalServices = (project: Project) => project.environments.reduce((sum, environment) => sum + environment.services.length, 0)

export const primaryEnvironment = (project: Project) => project.environments[0]!

export const averageMetric = (project: Project, field: "cpu" | "memory") => {
	const services = project.environments.flatMap((environment) => environment.services)
	if (services.length === 0) return 0
	return Math.round(services.reduce((sum, service) => sum + service[field], 0) / services.length)
}

export const allDeployments = (projects: readonly Project[]): readonly (Deployment & { readonly project: string })[] =>
	projects.flatMap((project) => project.deployments.map((deployment) => ({ ...deployment, project: project.name })))
