import { TextAttributes } from "@opentui/core"
import { theme } from "../../../atoms/theme.tsx"
import { servers } from "../data.ts"
import { MetricCard, SectionTitle } from "../components/primitives.tsx"

export const ServersSection = () => (
	<box flexGrow={1} flexDirection="column" border borderStyle="single" borderColor={theme.border} paddingX={1} paddingY={1} gap={1} backgroundColor={theme.backgroundPanel}>
		<SectionTitle title="Servers" meta={`${servers.length} nodes`} />
		<box height={4} flexDirection="row" gap={1}>
			<MetricCard label="Fleet Load" value="70% ███████░░░" tone={theme.warning} />
			<MetricCard label="Regions" value="fra-1 / iad-2 / sin-1" tone={theme.accent} />
			<MetricCard label="Ingress" value="124 req/s" tone={theme.info} />
		</box>
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
			<SectionTitle title="Server Inventory" meta="dummy" />
			{servers.map((server) => (
				<box
					key={server.name}
					height={4}
					flexDirection="column"
					border
					borderStyle="single"
					borderColor={theme.borderSubtle}
					paddingX={1}
					backgroundColor={theme.backgroundElement}
				>
					<text fg={theme.text} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
						{server.name}
					</text>
					<text fg={server.state === "hot" ? theme.warning : theme.textMuted} wrapMode="none" truncate>
						{server.size} · {server.region} · load {server.load} · {server.state}
					</text>
				</box>
			))}
		</box>
	</box>
)
