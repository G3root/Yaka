import { TextAttributes, type RGBA } from "@opentui/core"
import { theme } from "../../../atoms/theme.tsx"

export const CommandHint = ({ label, value }: { readonly label: string; readonly value: string }) => (
	<text fg={theme.textMuted} wrapMode="none" truncate>
		<span fg={theme.accent} attributes={TextAttributes.BOLD}>
			{label}
		</span>{" "}
		{value}
	</text>
)

export const SectionTitle = ({ title, meta }: { readonly title: string; readonly meta?: string }) => (
	<box height={1} flexDirection="row" justifyContent="space-between">
		<text fg={theme.text} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
			{title}
		</text>
		{meta ? (
			<text fg={theme.textMuted} wrapMode="none" truncate>
				{meta}
			</text>
		) : null}
	</box>
)

export const MetricCard = ({ label, value, tone }: { readonly label: string; readonly value: string; readonly tone: RGBA }) => (
	<box border borderStyle="single" borderColor={theme.borderSubtle} paddingX={1} paddingY={0} height={4} flexGrow={1} backgroundColor={theme.backgroundElement}>
		<box flexDirection="column" gap={0}>
			<text fg={theme.textMuted} wrapMode="none" truncate>
				{label}
			</text>
			<text fg={tone} attributes={TextAttributes.BOLD} wrapMode="none" truncate>
				{value}
			</text>
		</box>
	</box>
)

export const EmptySection = ({ title, body }: { readonly title: string; readonly body: string }) => (
	<box flexGrow={1} flexDirection="column" border borderStyle="single" borderColor={theme.border} paddingX={1} paddingY={1} gap={1} backgroundColor={theme.backgroundPanel}>
		<SectionTitle title={title} meta="dummy" />
		<text fg={theme.textMuted} wrapMode="word" truncate>
			{body}
		</text>
	</box>
)
