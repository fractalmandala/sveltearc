<script lang="ts">
	import type { Props } from './text-morph.types';
	import styles from './text-morph.module.css';

	let { children, as = 'span', class: classNameProp, id, ...restProps }: Props = $props();

	const glyphs = $derived(Array.from(children));
</script>

<!--
	Phase-1 still-port: renders the current label in its settled end state.
	The glyph-sharing morph, width spring and AnimatePresence choreography
	are deferred to Phase 2 (see manifest gaps).
-->
<svelte:element this={as} {id} class={classNameProp} {...restProps}>
	<span class={styles.srOnly}>{children}</span>
	<span class={styles.frame} aria-hidden="true"><span class={styles.track}>
		{#each glyphs as glyph, i (`${glyph}-${i}`)}
			<span class={styles.glyph}>{glyph === ' ' ? '\u00a0' : glyph}</span>
		{/each}
	</span></span>
</svelte:element>
