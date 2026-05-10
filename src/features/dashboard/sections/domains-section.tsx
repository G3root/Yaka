import { theme } from "../../../atoms/theme.tsx"
import { domains } from "../data.ts"
import { SectionTitle } from "../components/primitives.tsx"

export const DomainsSection = () => (
	<box flexGrow={1} flexDirection="column" border borderStyle="single" borderColor={theme.border} paddingX={1} paddingY={1} gap={1} backgroundColor={theme.backgroundPanel}>
		<SectionTitle title="Domains" meta={`${domains.length} routes`} />
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
			<SectionTitle title="Routing Table" meta="dummy" />
			{domains.map((domain) => (
				<box
					key={domain.host}
					height={3}
					flexDirection="column"
					border
					borderStyle="single"
					borderColor={theme.borderSubtle}
					paddingX={1}
					backgroundColor={theme.backgroundElement}
				>
					<box height={1} flexDirection="row" justifyContent="space-between">
						<text fg={theme.text} wrapMode="none" truncate>
							{domain.host}
						</text>
						<text fg={domain.status === "verified" ? theme.success : theme.warning} wrapMode="none" truncate>
							{domain.status}
						</text>
					</box>
					<text fg={theme.textMuted} wrapMode="none" truncate>
						target: {domain.target}
					</text>
				</box>
			))}
		</box>
	</box>
)
