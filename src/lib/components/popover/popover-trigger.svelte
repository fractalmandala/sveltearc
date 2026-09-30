<script lang="ts">
	import { Popover } from 'bits-ui';
	import styles from './popover.module.css';
	import type { Props } from './popover-trigger.types';

	let { class: className, ref = $bindable(null), children, ...rest }: Props = $props();

	const classes = $derived([styles.anchor, className].filter(Boolean).join(' '));
</script>

<Popover.Trigger {...rest} bind:ref class={classes}>
	{@render children?.()}
</Popover.Trigger>
