<script lang="ts">
	import type { Props } from './text-shimmer.types';
	import styles from './text-shimmer.module.css';

	let {
		children,
		active = true,
		duration = 1.8,
		as = 'span',
		class: classNameProp,
		id,
		...restProps
	}: Props = $props();

	const classes = $derived([styles.shimmer, classNameProp].filter(Boolean).join(' '));
</script>

<!--
	Phase-1 still-port: renders the settled label with a static solid gradient.
	The sweep/settle motion values and the label rise are deferred to Phase 2
	(see manifest gaps). `duration` is accepted for API parity only.

	TRAP NOTE: .label sets -webkit-text-fill-color: transparent and the ARC
	component paints the text via a JS-driven background-image. Without any
	background-image the text is INVISIBLE, so the still-port sets a static
	solid-gradient background-image inline (lives INSIDE the component, never
	passed by callers).
-->
<svelte:element
	this={as}
	{id}
	class={classes}
	data-state={active ? 'active' : 'idle'}
	aria-busy={active ? 'true' : undefined}
	{...restProps}
>
	<span class={styles.stage}>
		<span
			class={styles.label}
			style:background-image="linear-gradient(currentColor, currentColor)"
		>{children}</span>
	</span>
</svelte:element>
