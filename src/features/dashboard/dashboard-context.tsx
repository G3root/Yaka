import { createContext, use, useMemo, useState, type ReactNode } from "react"
import { createProject, initialProjects, navigationItems } from "./data.ts"
import { clamp } from "./model.ts"
import type { Environment, FocusPane, NavigationSection, Project } from "./types.ts"

type DashboardState = {
	readonly projects: readonly Project[]
	readonly selectedProjectIndex: number
	readonly selectedNavigationIndex: number
	readonly selectedEnvironmentIndex: number
	readonly focusedPane: FocusPane
	readonly selectedProject: Project
	readonly selectedEnvironment: Environment
	readonly selectedSection: NavigationSection
}

type DashboardActions = {
	readonly moveFocusedSelection: (direction: -1 | 1) => void
	readonly switchFocusPane: () => void
	readonly createProject: () => void
	readonly deploySelectedProject: () => void
}

type DashboardMeta = {
	readonly navigationItems: typeof navigationItems
}

type DashboardContextValue = {
	readonly state: DashboardState
	readonly actions: DashboardActions
	readonly meta: DashboardMeta
}

const DashboardContext = createContext<DashboardContextValue | null>(null)

export const useDashboard = () => {
	const value = use(DashboardContext)
	if (!value) throw new Error("useDashboard must be used within DashboardProvider")
	return value
}

export const DashboardProvider = ({ children }: { readonly children: ReactNode }) => {
	const [projects, setProjects] = useState<readonly Project[]>(initialProjects)
	const [selectedProjectIndex, setSelectedProjectIndex] = useState(0)
	const [selectedNavigationIndex, setSelectedNavigationIndex] = useState(0)
	const [selectedEnvironmentIndex, setSelectedEnvironmentIndex] = useState(0)
	const [focusedPane, setFocusedPane] = useState<FocusPane>("projects")

	const selectedProject = projects[clamp(selectedProjectIndex, 0, projects.length - 1)]!
	const selectedEnvironment = selectedProject.environments[clamp(selectedEnvironmentIndex, 0, selectedProject.environments.length - 1)]!
	const selectedSection = navigationItems[selectedNavigationIndex]!

	const value = useMemo<DashboardContextValue>(
		() => ({
			state: {
				projects,
				selectedProjectIndex,
				selectedNavigationIndex,
				selectedEnvironmentIndex,
				focusedPane,
				selectedProject,
				selectedEnvironment,
				selectedSection,
			},
			actions: {
				moveFocusedSelection: (direction) => {
					if (focusedPane === "control-plane") {
						setSelectedNavigationIndex((current) => clamp(current + direction, 0, navigationItems.length - 1))
					} else if (focusedPane === "projects") {
						setSelectedProjectIndex((current) => clamp(current + direction, 0, projects.length - 1))
						setSelectedEnvironmentIndex(0)
					} else if (selectedSection === "Projects") {
						setSelectedEnvironmentIndex((current) => clamp(current + direction, 0, selectedProject.environments.length - 1))
					}
				},
				switchFocusPane: () =>
					setFocusedPane((current) => {
						if (current === "control-plane") return "projects"
						if (current === "projects") return "content"
						return "control-plane"
					}),
				createProject: () => {
					setProjects((current) => {
						const nextProject = createProject(current.length + 1)
						setSelectedProjectIndex(current.length)
						setFocusedPane("projects")
						return [...current, nextProject]
					})
				},
				deploySelectedProject: () => {
					setProjects((current) =>
						current.map((project, index) => {
							if (index !== selectedProjectIndex) return project
							const deploymentNumber = project.deployments.length + 1
							return {
								...project,
								status: "deploying",
								deployments: [
									{
										id: `dpl_dummy_${deploymentNumber}`,
										commit: `local-${deploymentNumber}`,
										branch: "main",
										environment: selectedEnvironment.name,
										status: "deploying",
										createdAt: "now",
									},
									...project.deployments,
								],
							}
						}),
					)
				},
			},
			meta: { navigationItems },
		}),
		[focusedPane, projects, selectedEnvironment, selectedEnvironmentIndex, selectedNavigationIndex, selectedProject, selectedProjectIndex, selectedSection],
	)

	return <DashboardContext value={value}>{children}</DashboardContext>
}
