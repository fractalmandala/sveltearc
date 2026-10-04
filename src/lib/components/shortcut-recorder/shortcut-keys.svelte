<script lang="ts">
	import styles from './shortcut-recorder.module.css';
	import { shortcutTokens } from './shortcut-recorder.data';
	import { usePlatform } from './shortcut-recorder.state.svelte';
	import Kbd from './kbd.svelte';
	import type { ShortcutKeysProps } from './shortcut-recorder.types';

	let {
		shortcut,
		platform: platformProp,
		pressed,
		size = 'md',
		class: className = ''
	}: ShortcutKeysProps = $props();

	const platform = usePlatform(platformProp);
	const tokens = $derived(shortcutTokens(shortcut, platform));
</script>

<span
	class={[styles.keys, className].filter(Boolean).join(' ')}
	role="img"
	aria-label={tokens.map((token) => token.spoken).join(' ')}
>
	{#each tokens as token (`${token.id}-${token.label}`)}
		<Kbd size={size} pressed={pressed?.has(token.id)} aria-hidden="true">
			{token.label}
		</Kbd>
	{/each}
</span>
