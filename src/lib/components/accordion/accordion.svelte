<script lang="ts">
	import { Accordion as AccordionPrimitive } from 'bits-ui';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import styles from './accordion.module.css';
	import type { Props } from './accordion.types.js';

	/* Ported from arc accordion.tsx. Phase 1 = DOM parity + still-state end values:
	   elements the React original kept mounted stay mounted; motion inline end-states
	   are applied statically. Phase 2 swaps this carrier for <Motion> springs. */

	let { items, defaultOpen = 0, size = 'md' }: Props = $props();

	// React seeded useState from props once (not synced afterwards); $state init mirrors that.
	// The initial-capture warning is suppressed deliberately: parity with the source's semantics.
	// svelte-ignore state_referenced_locally
	let openValue = $state(defaultOpen >= 0 && defaultOpen < items.length ? String(defaultOpen) : '');

	// Still-state mirror of accordion.tsx panelStill/panelOpen/panelClosed (duration: 0 end values).
	const panelStillOpen = 'height: auto; opacity: 1; visibility: visible;';
	const panelStillClosed = 'height: 0px; opacity: 0; visibility: hidden;';
	// Icon rotation end value (React: animate={{ rotate: open ? 180 : 0 }}).
	const iconRotation = (open: boolean) => `transform: rotate(${open ? 180 : 0}deg);`;
</script>

<AccordionPrimitive.Root
	type="single"
	bind:value={openValue}
	class={size === 'lg' ? `${styles.accordion} ${styles.lg}` : styles.accordion}
>
	{#each items as item, index (`${item.title}-${index}`)}
		{@const open = openValue === String(index)}
		<AccordionPrimitive.Item value={String(index)} class={styles.item}>
			<AccordionPrimitive.Header level={3} class={styles.header}>
				<AccordionPrimitive.Trigger class={styles.trigger}>
					<span>{item.title}</span>
					<span class={styles.icon} style={iconRotation(open)}>
						<ChevronDown width={17} height={17} aria-hidden="true" />
					</span>
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
			<!-- Radix kept this node mounted so a mid-flight toggle retargets instead of restarting.
				 Same here: forceMount (never `{#if}`), still-state applied via inline style because
				 bits-ui only hides closed content under hiddenUntilFound, which would block Phase 2
				 height springs. data-state open/closed comes from bits-ui, matching the CSS module's
				 [data-state="open"] selector verbatim. -->
			<AccordionPrimitive.Content forceMount class={styles.panel} style={open ? panelStillOpen : panelStillClosed}>
				<div class={styles.panelInner}>
					{@render item.content?.()}
				</div>
			</AccordionPrimitive.Content>
		</AccordionPrimitive.Item>
	{/each}
</AccordionPrimitive.Root>
