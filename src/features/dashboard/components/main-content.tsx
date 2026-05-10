import { useDashboard } from "../dashboard-context.tsx"
import { DeploymentsSection } from "../sections/deployments-section.tsx"
import { DomainsSection } from "../sections/domains-section.tsx"
import { ProjectsSection } from "../sections/projects-section.tsx"
import { SecretsSection } from "../sections/secrets-section.tsx"
import { ServersSection } from "../sections/servers-section.tsx"

export const MainContent = () => {
	const {
		state: { selectedSection },
	} = useDashboard()

	switch (selectedSection) {
		case "Projects":
			return <ProjectsSection />
		case "Servers":
			return <ServersSection />
		case "Deployments":
			return <DeploymentsSection />
		case "Domains":
			return <DomainsSection />
		case "Secrets":
			return <SecretsSection />
	}
}
