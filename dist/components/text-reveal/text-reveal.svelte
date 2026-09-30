<script lang="ts">
	import type { Props } from './text-reveal.types';
	import styles from './text-reveal.module.css';
	import { motionTokens } from '../../motion-tokens';

	let {
		text,
		as = 'h2',
		className,
		class: classNameProp,
		id,
		delay = 0,
		...restProps
	}: Props = $props();

	const MAX_STAGGER = motionTokens.duration.considered;

	const lines = $derived(text.split('\n').map((line) => line.split(' ').filter(Boolean)));
	const count = $derived(lines.reduce((total, words) => total + words.length, 0));
	const step = $derived(Math.min(motionTokens.stagger.word, MAX_STAGGER / Math.max(count, 1)));
	const blur = $derived(as === 'p' ? motionTokens.blur.soft : motionTokens.blur.text);
	const classes = $derived([styles.reveal, classNameProp, className].filter(Boolean).join(' '));

	const positionedLines = $derived.by(() => {
		let pos = 0;
		return lines.map((words, lineIndex) => ({
			lineIndex,
			words: words.map((word, wordIndex) => ({
				word,
				wordIndex,
				position: pos++,
				isLastWord: wordIndex === words.length - 1
			})),
			isLastLine: lineIndex === lines.length - 1
		}));
	});
</script>

<svelte:element
	this={as}
	{id}
	class={classes}
	style="--reveal-blur: {blur}px;"
	{...restProps}
>
	<span class={styles.srOnly}>{text.replace(/\n/g, ' ')}</span>
	{#each positionedLines as line (line.lineIndex)}
		<span class={styles.line} aria-hidden="true">
			{#each line.words as item (item.word + '-' + item.position)}
				<span class={styles.clip}>
					<span
						class={styles.word}
						style="--reveal-delay: {delay + item.position * step + line.lineIndex * step}s;"
					>
						{item.word}
					</span>
				</span>
				{#if !item.isLastWord}{' '}{/if}
			{/each}
		</span>
		{#if !line.isLastLine}{' '}{/if}
	{/each}
</svelte:element>
