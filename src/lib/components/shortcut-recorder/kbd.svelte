<script lang="ts">
	import styles from './shortcut-recorder.module.css';
	import type { KbdProps } from './shortcut-recorder.types';

	let { children, pressed = false, size = 'md', class: className = '', ...restProps }: KbdProps = $props();
</script>

<kbd
	{...restProps}
	class={[styles.kbd, className].filter(Boolean).join(' ')}
	data-size={size}
	data-pressed={pressed || undefined}
>
	{@render children()}
</kbd>
