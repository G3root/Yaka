import { theme } from "../../../atoms/theme.tsx"
import { secretGroups } from "../data.ts"
import { SectionTitle } from "../components/primitives.tsx"

export const SecretsSection = () => (
	<box flexGrow={1} flexDirection="column" border borderStyle="single" borderColor={theme.border} paddingX={1} paddingY={1} gap={1} backgroundColor={theme.backgroundPanel}>
		<SectionTitle title="Secrets" meta={`${secretGroups.length} groups`} />
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
			<SectionTitle title="Secret Groups" meta="dummy" />
			{secretGroups.map((group) => (
				<box key={group.name} height={3} flexDirection="column" border borderStyle="single" borderColor={theme.borderSubtle} paddingX={1} backgroundColor={theme.backgroundElement}>
					<box height={1} flexDirection="row" justifyContent="space-between">
						<text fg={theme.text} wrapMode="none" truncate>
							{group.name}
						</text>
						<text fg={theme.accent} wrapMode="none" truncate>
							{group.count} keys
						</text>
					</box>
					<text fg={theme.textMuted} wrapMode="none" truncate>
						scope: {group.scope} · updated {group.updatedAt}
					</text>
				</box>
			))}
		</box>
	</box>
)
