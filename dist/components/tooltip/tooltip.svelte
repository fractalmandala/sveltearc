<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import styles from './tooltip.module.css';
	import type { Props } from './tooltip.types';

	let { content, children, side = 'top' }: Props = $props();

	const DELAY = 250;
	const SKIP_WINDOW = 300;
</script>

<Tooltip.Provider delayDuration={DELAY} skipDelayDuration={SKIP_WINDOW}>
	<Tooltip.Root>
		<Tooltip.Trigger>
			{#snippet child({ props })}
				{@render children({ props })}
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Portal>
			<Tooltip.Content
				role="tooltip"
				class={styles.tooltip}
				{side}
				sideOffset={8}
				collisionPadding={12}
			>
				{#if typeof content === 'string' || typeof content === 'number'}
					<span class={styles.text}>
						<span class={styles.line}>{content}</span>
					</span>
				{:else}
					{@render content()}
				{/if}
			</Tooltip.Content>
		</Tooltip.Portal>
	</Tooltip.Root>
</Tooltip.Provider>
