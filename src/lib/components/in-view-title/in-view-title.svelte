<script lang="ts">
	import type { Props } from './in-view-title.types';
	import styles from './in-view-title.module.css';

	let {
		text,
		variant = 'blur',
		as = 'h2',
		lines,
		class: classNameProp,
		id,
		once = true,
		...restProps
	}: Props = $props();

	const words = $derived(text.split(' ').filter(Boolean));
	const titleLines = $derived(lines?.length ? lines : [text]);
	const wrapperClass = $derived([styles.wrap, classNameProp].filter(Boolean).join(' '));
	const blurWordClass = $derived(`${styles.blurWord} ${styles.part}`);
	const trackWordClass = $derived(`${styles.trackWord} ${styles.part}`);
</script>

<!--
	Phase-1 still-port: always renders the final visible end state.
	`once` is accepted for API parity only — there is no scroll observer yet (see manifest gaps).
-->
<div class={wrapperClass} {...restProps}>
	{#if variant === 'word'}
		<svelte:element this={as} {id} aria-label={text}>
			{#each words as word, index (`${word}-${index}`)}
				<span class={styles.clip} aria-hidden="true"><span class={styles.part}>{word}</span></span>{#if index < words.length - 1}{' '}{/if}
			{/each}
		</svelte:element>
	{:else if variant === 'line'}
		<svelte:element this={as} {id} aria-label={text}>
			{#each titleLines as line, index (`${line}-${index}`)}
				<span class={styles.lineClip} aria-hidden="true"><span class={styles.part}>{line}</span></span>
			{/each}
		</svelte:element>
	{:else if variant === 'blur'}
		<svelte:element this={as} {id} aria-label={text}>
			{#each words as word, index (`${word}-${index}`)}
				<span class={blurWordClass} aria-hidden="true">{word}</span>{#if index < words.length - 1}{' '}{/if}
			{/each}
		</svelte:element>
	{:else if variant === 'tracking'}
		<svelte:element this={as} {id} aria-label={text}>
			{#each words as word, index (`${word}-${index}`)}
				<span class={trackWordClass} aria-hidden="true">
					{#each Array.from(word) as letter, letterIndex (letterIndex)}
						<span class={styles.part}>{letter}</span>
					{/each}
				</span>{#if index < words.length - 1}{' '}{/if}
			{/each}
		</svelte:element>
	{:else}
		<div class={`${styles.wipe} ${styles.part}`} style="--wipe: 0%;">
			<svelte:element this={as} {id}>{text}</svelte:element>
		</div>
	{/if}
</div>
