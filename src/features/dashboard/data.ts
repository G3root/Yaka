import type { Domain, NavigationSection, Project, SecretGroup, Server } from "./types.ts"

export const navigationItems: readonly NavigationSection[] = ["Projects", "Servers", "Deployments", "Domains", "Secrets"]

export const initialProjects: readonly Project[] = [
	{
		id: "api",
		name: "atlas-api",
		description: "Public API and background queues for the Atlas control surface.",
		repo: "github.com/acme/atlas-api",
		status: "healthy",
		environments: [
			{
				id: "api-prod",
				name: "production",
				region: "fra-1",
				domain: "api.atlas.example",
				services: [
					{ id: "api-prod-app", name: "api", type: "app", image: "ghcr.io/acme/api:9f31c8a", status: "healthy", cpu: 42, memory: 68 },
					{ id: "api-prod-db", name: "postgres", type: "db", image: "postgres:17-alpine", status: "healthy", cpu: 28, memory: 71 },
					{ id: "api-prod-cache", name: "redis", type: "cache", image: "redis:7-alpine", status: "healthy", cpu: 18, memory: 34 },
				],
			},
			{
				id: "api-stage",
				name: "staging",
				region: "iad-2",
				domain: "staging-api.atlas.example",
				services: [{ id: "api-stage-app", name: "api", type: "app", image: "ghcr.io/acme/api:next", status: "healthy", cpu: 24, memory: 41 }],
			},
		],
		deployments: [
			{ id: "dpl_1042", commit: "9f31c8a", branch: "main", environment: "production", status: "healthy", createdAt: "3m ago" },
			{ id: "dpl_1041", commit: "7ab18ef", branch: "main", environment: "production", status: "healthy", createdAt: "1h ago" },
			{ id: "dpl_1040", commit: "48d0f2c", branch: "hotfix/cache", environment: "staging", status: "failed", createdAt: "5h ago" },
		],
	},
	{
		id: "web",
		name: "customer-web",
		description: "Next.js customer portal with preview deployments for feature branches.",
		repo: "github.com/acme/customer-web",
		status: "deploying",
		environments: [
			{
				id: "web-preview",
				name: "preview",
				region: "iad-2",
				domain: "preview.customer.example",
				services: [
					{ id: "web-preview-app", name: "web", type: "app", image: "ghcr.io/acme/web:b6c09d4", status: "deploying", cpu: 36, memory: 52 },
					{ id: "web-preview-db", name: "preview-db", type: "db", image: "postgres:17-alpine", status: "healthy", cpu: 19, memory: 43 },
				],
			},
		],
		deployments: [
			{ id: "dpl_2088", commit: "b6c09d4", branch: "feature/billing", environment: "preview", status: "deploying", createdAt: "now" },
			{ id: "dpl_2087", commit: "321e9aa", branch: "main", environment: "preview", status: "healthy", createdAt: "28m ago" },
			{ id: "dpl_2086", commit: "a182f14", branch: "main", environment: "preview", status: "healthy", createdAt: "2h ago" },
		],
	},
	{
		id: "worker",
		name: "queue-worker",
		description: "Async processing fleet for emails, webhooks, billing sync, and imports.",
		repo: "github.com/acme/queue-worker",
		status: "warning",
		environments: [
			{
				id: "worker-prod",
				name: "production",
				region: "sin-1",
				domain: "worker.internal",
				services: [
					{ id: "worker-prod-app", name: "worker", type: "worker", image: "ghcr.io/acme/worker:0f87c1d", status: "warning", cpu: 76, memory: 83 },
					{ id: "worker-prod-cache", name: "redis", type: "cache", image: "redis:7-alpine", status: "healthy", cpu: 23, memory: 48 },
				],
			},
		],
		deployments: [
			{ id: "dpl_5120", commit: "0f87c1d", branch: "main", environment: "production", status: "warning", createdAt: "14m ago" },
			{ id: "dpl_5119", commit: "65cba83", branch: "main", environment: "production", status: "healthy", createdAt: "3h ago" },
			{ id: "dpl_5118", commit: "2d93eee", branch: "main", environment: "production", status: "healthy", createdAt: "8h ago" },
		],
	},
]

export const servers: readonly Server[] = [
	{ name: "fra-prod-01", size: "8 vCPU", region: "fra-1", load: "71%", state: "healthy" },
	{ name: "iad-edge-02", size: "4 vCPU", region: "iad-2", load: "54%", state: "healthy" },
	{ name: "sin-worker-01", size: "6 vCPU", region: "sin-1", load: "86%", state: "hot" },
]

export const domains: readonly Domain[] = [
	{ host: "api.atlas.example", target: "atlas-api / production", status: "verified" },
	{ host: "preview.customer.example", target: "customer-web / preview", status: "verified" },
	{ host: "staging-api.atlas.example", target: "atlas-api / staging", status: "pending" },
]

export const secretGroups: readonly SecretGroup[] = [
	{ name: "atlas-api", scope: "production", count: 8, updatedAt: "11m ago" },
	{ name: "customer-web", scope: "preview", count: 5, updatedAt: "38m ago" },
	{ name: "shared-registry", scope: "global", count: 3, updatedAt: "2d ago" },
]

export const createProject = (index: number): Project => ({
	id: `project-${index}`,
	name: `new-project-${index}`,
	description: "New in-memory project with app and database services ready for deployment.",
	repo: `github.com/acme/new-project-${index}`,
	status: "healthy",
	environments: [
		{
			id: `project-${index}-prod`,
			name: "production",
			region: "fra-1",
			domain: `new-project-${index}.example`,
			services: [
				{ id: `project-${index}-app`, name: "app", type: "app", image: `ghcr.io/acme/new-project-${index}:latest`, status: "healthy", cpu: 12 + index * 3, memory: 28 + index * 4 },
				{ id: `project-${index}-db`, name: "db", type: "db", image: "postgres:17-alpine", status: "healthy", cpu: 18 + index, memory: 42 + index * 2 },
			],
		},
		{
			id: `project-${index}-preview`,
			name: "preview",
			region: "iad-2",
			domain: `preview-new-project-${index}.example`,
			services: [
				{
					id: `project-${index}-preview-app`,
					name: "app",
					type: "app",
					image: `ghcr.io/acme/new-project-${index}:preview`,
					status: "healthy",
					cpu: 9 + index,
					memory: 21 + index * 2,
				},
			],
		},
	],
	deployments: [{ id: `dpl_new_${index}`, commit: "initial", branch: "main", environment: "production", status: "healthy", createdAt: "now" }],
})
