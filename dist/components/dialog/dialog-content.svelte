<script lang="ts">
	import { getContext } from 'svelte';
	import { Dialog as DialogPrimitive } from 'bits-ui';
	import X from '@lucide/svelte/icons/x';
	import { AnimatePresence, motion, useReducedMotion } from '@humanspeak/svelte-motion';
	import { motionTokens } from '../../motion-tokens';
	import styles from './dialog.module.css';
	import { DIALOG_ROOT, type DialogRootContext } from './dialog-context';
	import type { Props } from './dialog.types';

	let {
		title,
		description,
		class: className,
		onInteractOutside,
		children,
		ref = $bindable(null),
		...rest
	}: Props = $props();

	const root = getContext<DialogRootContext | undefined>(DIALOG_ROOT);
	/** Resolved open state; `null` when this content sits under a bare bits-ui root (ARC's keyframes path). */
	const open = $derived(root ? root.open() : null);

	// ARC mirrors the open state with a ref + layout effect and remembers when it last
	// changed, so a press that reopens the dialog mid-exit cannot close it again.
	// Same bookkeeping here; effects run browser-only, so `performance.now()` is safe.
	let change = { open: false, at: 0 };
	$effect(() => {
		const next = open;
		if (next !== null) change = { open: next, at: performance.now() };
	});

	function pressOutside(event: PointerEvent) {
		onInteractOutside?.(event);
		// bits-ui closes unless the event is default-prevented; this is ARC's pressOutside guard.
		if (open !== null && (!change.open || event.timeStamp < change.at)) event.preventDefault();
	}

	const classes = $derived([styles.content, className].filter(Boolean).join(' '));

	const reduced = useReducedMotion();
	/** Reduced-motion stand-in: jumps straight to the exit end state. */
	const fade = { duration: motionTokens.duration.instant };
	/** Overlay/content leave timing. */
	const leave = { duration: motionTokens.duration.fast, ease: motionTokens.ease.standard };
</script>

{#snippet swap(text: string)}
	<!-- When the copy changes while open, the new line rises in and the old line leaves upward. -->
	<AnimatePresence mode="popLayout" initial={false}>
		{#key text}
			<motion.span
				key={text}
				class={styles.swap}
				initial={reduced.current
					? false
					: { opacity: 0, y: '0.3em', filter: `blur(${motionTokens.blur.soft}px)` }}
				animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
				exit={reduced.current
					? { opacity: 0, transition: { duration: 0 } }
					: {
							opacity: 0,
							y: '-0.3em',
							filter: `blur(${motionTokens.blur.subtle}px)`,
							transition: { duration: motionTokens.duration.fast, ease: motionTokens.ease.standard }
						}}
				transition={{ duration: motionTokens.duration.standard, ease: motionTokens.ease.enter }}
			>{text}</motion.span>
		{/key}
	</AnimatePresence>
{/snippet}

{#snippet inner()}
	<div class={styles.header}>
		<div>
			<DialogPrimitive.Title class={styles.title}>
				{@render swap(title)}
			</DialogPrimitive.Title>
			{#if description}
				<DialogPrimitive.Description class={styles.description}>
					{@render swap(description)}
				</DialogPrimitive.Description>
			{/if}
		</div>
		<DialogPrimitive.Close class={styles.close} aria-label="Close dialog">
			<X width={18} height={18} aria-hidden="true" />
		</DialogPrimitive.Close>
	</div>
	<div class={styles.body}>{@render children?.()}</div>
{/snippet}

{#if open === null}
	<!-- Bare root: the open state is unknown here, so CSS keyframes keyed off data-state animate the layers (ARC's fallback path). -->
	<DialogPrimitive.Portal>
		<DialogPrimitive.Overlay class={`${styles.overlay} ${styles.keyframes}`} />
		<DialogPrimitive.Content
			{...rest}
			bind:ref
			onInteractOutside={pressOutside}
			class={`${classes} ${styles.keyframes}`}
		>
			{@render inner()}
		</DialogPrimitive.Content>
	</DialogPrimitive.Portal>
{:else}
	<!-- ARC root: AnimatePresence holds the real nodes through the exit, so a reopen mid-flight retargets the springs instead of remounting (React parity). -->
	<AnimatePresence present={open}>
		{#snippet child()}
			<DialogPrimitive.Portal>
				<DialogPrimitive.Overlay forceMount class={styles.overlay}>
					{#snippet child({ props })}
						<motion.div
							{...props}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={reduced.current
								? { opacity: 0, transition: fade }
								: { opacity: 0, transition: leave }}
							transition={reduced.current
								? fade
								: { duration: motionTokens.duration.standard, ease: motionTokens.ease.enter }}
						/>
					{/snippet}
				</DialogPrimitive.Overlay>
				<DialogPrimitive.Content
					{...rest}
					bind:ref
					forceMount
					onInteractOutside={pressOutside}
					class={classes}
				>
					<!--
						child-snippet path (bits-ui): its default children path mounts ScrollLock
						unconditionally, so under our REQUIRED forceMount a CLOSED dialog would hold
						body pointer-events:none + overflow:hidden — the whole page input-dead.
						This path gates the lock on open (bits-ui's own composed-usage behavior);
						the motion.div receives the identical merged props the default path would spread.
					-->
					{#snippet child({ props })}
						<motion.div
							{...props}
							initial={reduced.current ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={reduced.current
								? { opacity: 0, transition: fade }
								: { opacity: 0, y: 4, scale: 0.98, transition: leave }}
							transition={reduced.current
								? fade
								: {
										default: motionTokens.spring.smooth,
										opacity: { duration: motionTokens.duration.fast, ease: motionTokens.ease.enter }
									}}
						>
							{@render inner()}
						</motion.div>
					{/snippet}
				</DialogPrimitive.Content>
			</DialogPrimitive.Portal>
		{/snippet}
	</AnimatePresence>
{/if}
