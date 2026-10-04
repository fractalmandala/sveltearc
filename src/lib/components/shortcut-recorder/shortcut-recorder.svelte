<script lang="ts">
	import { untrack } from 'svelte';
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';
	import X from '@lucide/svelte/icons/x';
	import styles from './shortcut-recorder.module.css';
	import {
		RESERVED,
		formatShortcut,
		normalizeShortcut,
		shortcutFromEvent,
		shortcutTokens,
		splitShortcut as splitShortcutModel
	} from './shortcut-recorder.data';
	import { usePlatform, usePressedKeys } from './shortcut-recorder.state.svelte';
	import Kbd from './kbd.svelte';
	import type { Platform, Props, ShortcutBinding } from './shortcut-recorder.types';

	let {
		label,
		hideLabel = false,
		value = $bindable<string | null>(),
		defaultValue = null,
		onValueChange,
		resetValue,
		bindings = [],
		warnReserved = true,
		requireModifier = true,
		platform: platformProp,
		placeholder = 'Record shortcut',
		description,
		disabled = false,
		id,
		class: className = ''
	}: Props = $props();

	const platform = usePlatform(platformProp);
	const heldStrings = usePressedKeys(true);
	const reduced = reducedMotion();

	function reducedMotion() {
		let reduced = $state(false);
		$effect(() => {
			if (typeof window === 'undefined') return;
			reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		});
		return reduced;
	}

	const fallbackId = $props.id();
	const buttonId = $derived(id ?? `${fallbackId}-button`);
	const labelId = $derived(`${fallbackId}-label`);
	const messageId = $derived(`${fallbackId}-message`);

	let inner = $state<string | null>(untrack(() => defaultValue));
	const current = $derived(value ?? inner);
	const restoreTo = $derived(resetValue !== undefined ? resetValue : defaultValue);

	let recording = $state(false);
	let live = $state<string[]>([]);
	let pending = $state<{ shortcut: string; conflict: ShortcutBinding; reserved: boolean } | null>(null);
	let nudge = $state<string | null>(null);
	let settled = $state(0);
	let announcement = $state('');
	let buttonEl: HTMLButtonElement | null = $state(null);

	const spoken = (shortcut: string | null) =>
		shortcut ? formatShortcut(shortcut, platform).spoken : 'none';

	function commit(next: string | null, replaced?: ShortcutBinding) {
		pending = null;
		nudge = null;
		if (value === undefined) inner = next;
		onValueChange?.(next, { replaced });
		settled += 1;
		announcement = next ? `Shortcut set to ${formatShortcut(next, platform).spoken}` : 'Shortcut cleared';
	}

	function start() {
		if (disabled) return;
		pending = null;
		nudge = null;
		live = [];
		recording = true;
		announcement = 'Recording. Press the new shortcut, or Escape to cancel.';
	}

	function stop() {
		recording = false;
		live = [];
	}

	function conflictFor(shortcut: string) {
		const normal = normalizeShortcut(shortcut, platform);
		if (current && normalizeShortcut(current, platform) === normal) return null;
		const taken = bindings.find((binding) => normalizeShortcut(binding.shortcut, platform) === normal);
		if (taken) return { shortcut, conflict: taken, reserved: false };
		const reserved = warnReserved
			? RESERVED.find((binding) => normalizeShortcut(binding.shortcut, platform) === normal)
			: undefined;
		return reserved ? { shortcut, conflict: reserved, reserved: true } : null;
	}

	function liveMods(event: KeyboardEvent) {
		const mods: string[] = [];
		if (event.ctrlKey && platform === 'mac') mods.push('ctrl');
		if (event.altKey) mods.push('alt');
		if (event.shiftKey) mods.push('shift');
		if (platform === 'mac' ? event.metaKey : event.ctrlKey) mods.push('mod');
		if (platform === 'other' && event.metaKey) mods.push('meta');
		return mods;
	}

	function onKeyDown(event: KeyboardEvent) {
		if (!recording) {
			if ((event.key === 'Backspace' || event.key === 'Delete') && current) {
				event.preventDefault();
				commit(null);
			}
			return;
		}
		if (event.key === 'Tab' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
			stop();
			return;
		}
		event.preventDefault();
		const bare = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;
		if (bare && event.key === 'Escape') {
			stop();
			announcement = 'Recording canceled';
			return;
		}
		if (bare && (event.key === 'Backspace' || event.key === 'Delete')) {
			stop();
			commit(null);
			return;
		}
		const shortcut = shortcutFromEvent(event, platform);
		if (!shortcut) {
			live = liveMods(event);
			return;
		}
		const { mods, key } = splitShortcut(shortcut);
		const strong = mods.has('mod') || mods.has('ctrl') || mods.has('alt') || mods.has('meta');
		if (requireModifier && !strong && !/^f\d+$/.test(key)) {
			const hint = platform === 'mac' ? 'Include ⌘, ⌃, or ⌥' : 'Include Ctrl or Alt';
			nudge = hint;
			announcement = hint;
			live = liveMods(event);
			return;
		}
		stop();
		const conflict = conflictFor(shortcut);
		if (conflict) {
			pending = conflict;
			announcement = `${formatShortcut(shortcut, platform).spoken} is ${conflict.reserved ? 'reserved for' : 'used by'} ${conflict.conflict.label}. Use anyway, or record another.`;
			return;
		}
		commit(shortcut);
	}

	function onKeyUp(event: KeyboardEvent) {
		if (recording) live = liveMods(event);
	}

	const shown = $derived(pending?.shortcut ?? current);
	const tokens = $derived(recording ? shortcutTokens(live.join('+'), platform) : shown ? shortcutTokens(shown, platform) : []);
	const phase = $derived(recording ? 'recording' : pending ? 'conflict' : 'idle');
	const canReset = $derived(!recording && (pending !== null || (current ?? null) !== (restoreTo ?? null)));
	const canClear = $derived(!recording && !!current && !pending);
	const message = $derived(
		pending || nudge || recording || description
			? { tone: pending ? ('warning' as const) : ('hint' as const) }
			: null
	);
	const describedBy = $derived(message ? messageId : undefined);

	function splitShortcut(shortcut: string) {
		return splitShortcutModel(shortcut);
	}

	$effect(() => {
		if (!settled) return;
		const timer = window.setTimeout(() => (settled = 0), 700);
		return () => window.clearTimeout(timer);
	});
</script>

<div class={[styles.field, className].filter(Boolean).join(' ')} data-disabled={disabled || undefined}>
	<span id={labelId} class={hideLabel ? styles.srOnly : styles.label}>{label}</span>
	<div class={styles.control} data-state={phase}>
		<button
			bind:this={buttonEl}
			id={buttonId}
			type="button"
			class={styles.recorder}
			{disabled}
			aria-labelledby={`${labelId} ${buttonId}`}
			aria-describedby={describedBy}
			aria-pressed={recording}
			onclick={(event) => {
				if (recording) {
					if (event.detail !== 0) {
						stop();
						announcement = 'Recording canceled';
					}
					return;
				}
				start();
			}}
			onkeydown={onKeyDown}
			onkeyup={onKeyUp}
			onblur={() => {
				if (recording) {
					stop();
					nudge = null;
				}
			}}
		>
			<span class={styles.srOnly}>
				{recording ? 'Recording' : shown ? spoken(shown) : placeholder}
			</span>
			<span class={styles.row} aria-hidden="true">
				{#if recording}
					<span class={styles.dot} data-reduced={reduced || undefined}></span>
				{/if}
				{#each tokens as token (`${token.id}-${token.label}`)}
					<Kbd pressed={recording || (settled > 0 && !pending)} data-tone={pending ? 'warning' : undefined}>
						{token.label}
					</Kbd>
				{/each}
				{#if tokens.length === 0}
					<span class={styles.placeholder} data-recording={recording || undefined}>
						{recording ? 'Press keys' : placeholder}
					</span>
				{/if}
			</span>
		</button>

		<span class={styles.actions}>
			{#if canReset}
				<button
					type="button"
					class={styles.action}
					aria-label={`Reset to ${restoreTo ? formatShortcut(restoreTo, platform).spoken : 'none'}`}
					onclick={() => {
						commit(restoreTo ?? null);
						buttonEl?.focus();
					}}
				>
					<RotateCcw size={15} strokeWidth={1.75} aria-hidden="true" />
				</button>
			{/if}
			{#if canClear}
				<button
					type="button"
					class={styles.action}
					aria-label="Clear shortcut"
					onclick={() => {
						commit(null);
						buttonEl?.focus();
					}}
				>
					<X size={15} strokeWidth={1.75} aria-hidden="true" />
				</button>
			{/if}
		</span>
	</div>

	{#if message}
		<div class={styles.messageSlot}>
			<div id={messageId} class={styles.message} data-tone={message.tone}>
				<span class={styles.messageText}>
					{#if pending}
						{pending.reserved ? 'Reserved for' : 'Already used by'}
						<strong class={styles.strong}>{pending.conflict.label}</strong>
					{:else if nudge}
						{nudge}
					{:else if recording}
						Esc to cancel, Backspace to clear
					{:else if description}
						{description}
					{/if}
				</span>
				{#if pending}
					<span class={styles.messageActions}>
						<button
							type="button"
							class={styles.link}
							onclick={() => {
								const taken = pending;
								if (!taken) return;
								commit(taken.shortcut, taken.reserved ? undefined : taken.conflict);
								buttonEl?.focus();
							}}
						>
							Use anyway
						</button>
						<button
							type="button"
							class={styles.link}
							data-quiet=""
							onclick={() => {
								pending = null;
								announcement = 'Kept the previous shortcut';
								buttonEl?.focus();
							}}
						>
							Cancel
						</button>
					</span>
				{/if}
			</div>
		</div>
	{/if}
	<span class={styles.srOnly} role="status" aria-live="polite">{announcement}</span>
</div>
