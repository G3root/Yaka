export type ProjectStatus = "healthy" | "deploying" | "warning" | "failed"
export type ServiceType = "app" | "db" | "worker" | "cache"
export type FocusPane = "control-plane" | "projects" | "content"
export type NavigationSection = "Projects" | "Servers" | "Deployments" | "Domains" | "Secrets"

export type Service = {
	readonly id: string
	readonly name: string
	readonly type: ServiceType
	readonly image: string
	readonly status: ProjectStatus
	readonly cpu: number
	readonly memory: number
}

export type Environment = {
	readonly id: string
	readonly name: string
	readonly region: string
	readonly domain: string
	readonly services: readonly Service[]
}

export type Deployment = {
	readonly id: string
	readonly commit: string
	readonly branch: string
	readonly environment: string
	readonly status: ProjectStatus
	readonly createdAt: string
}

export type Project = {
	readonly id: string
	readonly name: string
	readonly description: string
	readonly repo: string
	readonly status: ProjectStatus
	readonly environments: readonly Environment[]
	readonly deployments: readonly Deployment[]
}

export type Server = {
	readonly name: string
	readonly size: string
	readonly region: string
	readonly load: string
	readonly state: "healthy" | "hot" | "draining"
}

export type Domain = {
	readonly host: string
	readonly target: string
	readonly status: "verified" | "pending"
}

export type SecretGroup = {
	readonly name: string
	readonly scope: string
	readonly count: number
	readonly updatedAt: string
}
