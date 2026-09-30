<script module lang="ts">
	const storageKey = (id: string) => `arc-announcement:${id}`;

	/** Forgets a remembered dismissal so the bar with this id shows again. */
	export function clearAnnouncementDismissal(id: string) {
		try {
			window.localStorage.removeItem(storageKey(id));
		} catch {
			/* Storage can be blocked. */
		}
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import ChevronUp from '@lucide/svelte/icons/chevron-up';
	import Pause from '@lucide/svelte/icons/pause';
	import Play from '@lucide/svelte/icons/play';
	import X from '@lucide/svelte/icons/x';
	import styles from './announcement-bar.module.css';
	import type { Announcement, Props } from './announcement-bar.types';

	let {
		messages,
		id,
		open: openProp,
		defaultOpen = true,
		onOpenChange,
		index: indexProp,
		defaultIndex = 0,
		onIndexChange,
		interval = 6000,
		autoPlay = true,
		controls = false,
		dismissible = true,
		tone = 'neutral',
		onAction,
		onCountdownEnd,
		label = 'Announcements',
		class: className = '',
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	const uid = $props.id();
	const total = $derived(messages.length);

	/* Open state: controlled, or internal and hidden at once when this id was dismissed before. */
	// ARC snapshots the defaults with useState(initial); untrack marks the same intent.
	let openInternal = $state(untrack(() => defaultOpen));
	let remembered = $state(false);

	// Storage is only readable on the client; the effect hides a dismissed bar
	// after mount (ARC hides before paint via useLayoutEffect — see gaps).
	$effect(() => {
		if (!id || openProp !== undefined) return;
		try {
			if (window.localStorage.getItem(storageKey(id)) === 'dismissed') remembered = true;
		} catch {
			/* Storage can be blocked. */
		}
	});

	const open = $derived(openProp ?? (openInternal && !remembered));

	function dismiss() {
		if (id) {
			try {
				window.localStorage.setItem(storageKey(id), 'dismissed');
			} catch {
				/* Storage can be blocked. */
			}
		}
		if (openProp === undefined) openInternal = false;
		onOpenChange?.(false);
	}

	/* Rotation. */
	let indexInternal = $state(untrack(() => defaultIndex));
	const current = $derived(total ? (((indexProp ?? indexInternal) % total) + total) % total : 0);
	const announcement = $derived<Announcement | undefined>(messages[current]);

	function go(step: number) {
		if (total < 2) return;
		const next = ((current + step) % total + total) % total;
		if (indexProp === undefined) indexInternal = next;
		onIndexChange?.(next);
	}

	let userPaused = $state(false);
	let hovered = $state(false);
	let focused = $state(false);
	let tabHidden = $state(false);
	let reduced = $state(false);

	$effect(() => {
		reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	$effect(() => {
		const read = () => {
			tabHidden = document.visibilityState === 'hidden';
		};
		document.addEventListener('visibilitychange', read);
		return () => document.removeEventListener('visibilitychange', read);
	});

	const rotating = $derived(autoPlay && !reduced && total > 1);
	const running = $derived(rotating && open && !userPaused && !hovered && !focused && !tabHidden);

	// Rotation timer. Phase 1 still-port: the message swaps instantly, no rise/blur.
	$effect(() => {
		if (!running) return;
		const timer = window.setTimeout(() => go(1), interval);
		return () => window.clearTimeout(timer);
	});

	/* Viewport height follows the current face (ARC springs it; Phase 1 snaps it). */
	let faceH = $state(0);

	/* Countdown clock for the current announcement. */
	const countdownTo = $derived(announcement?.countdown?.to);
	let now = $state<number | null>(null);
	let endedFor = $state<string | null>(null);

	$effect(() => {
		const currentAnnouncement = announcement;
		const to = countdownTo;
		if (!currentAnnouncement?.countdown || to === undefined) {
			now = null;
			return;
		}
		const target = new Date(to).getTime();
		let timer = 0;
		let alive = true;
		const tick = () => {
			if (!alive) return;
			const currentTime = Date.now();
			now = currentTime;
			if (currentTime >= target) {
				if (endedFor !== currentAnnouncement.id) {
					endedFor = currentAnnouncement.id;
					onCountdownEnd?.(currentAnnouncement);
				}
				return;
			}
			// Wake just after each whole second so digits change on the beat.
			timer = window.setTimeout(tick, 1000 - (currentTime % 1000) + 8);
		};
		timer = window.setTimeout(tick, 0);
		return () => {
			alive = false;
			window.clearTimeout(timer);
		};
	});

	function parts(ms: number): { d: number; h: number; m: number; s: number } {
		const totalSecs = Math.max(0, Math.floor(ms / 1000));
		return {
			d: Math.floor(totalSecs / 86400),
			h: Math.floor((totalSecs % 86400) / 3600),
			m: Math.floor((totalSecs % 3600) / 60),
			s: totalSecs % 60
		};
	}

	const pad = (value: number): string => String(value).padStart(2, '0');

	const countdown = $derived.by(() => {
		if (!announcement?.countdown) return null;
		const target = new Date(announcement.countdown.to).getTime();
		const left = now === null ? 0 : target - now;
		return { ...parts(left), pending: now === null };
	});

	const spoken = $derived.by(() => {
		if (!countdown || countdown.pending) return '';
		return `${countdown.d ? `${countdown.d} days ` : ''}${countdown.h} hours ${countdown.m} minutes`;
	});

	const navigable = $derived(controls && total > 1);
	const controlCount = $derived(
		(navigable ? 2 + (rotating ? 1 : 0) : 0) + (dismissible ? 1 : 0)
	);
</script>

{#snippet digit(char: string)}
	<span class={styles.digit}>
		<span class={styles.digitSizer} aria-hidden="true">0</span>
		<span class={styles.digitFace}>{char}</span>
	</span>
{/snippet}

{#if open && announcement}
	<section
		{...restProps}
		bind:this={ref}
		class={[styles.collapse, className].filter(Boolean).join(' ')}
		aria-label={label}
		aria-roledescription={total > 1 ? 'carousel' : undefined}
		onpointerenter={(event) => {
			if (event.pointerType === 'mouse') hovered = true;
		}}
		onpointerleave={() => {
			hovered = false;
		}}
		onfocus={() => {
			focused = true;
		}}
		onblur={(event) => {
			if (!event.currentTarget.contains(event.relatedTarget as Node | null)) focused = false;
		}}
	>
		<div class={styles.bar} data-tone={tone} style={`--controls: ${controlCount};`}>
			<div class={styles.side} aria-hidden="true"></div>
			<div
				class={styles.viewport}
				style={faceH > 0 ? `height: ${faceH}px;` : 'height: auto;'}
				id={`${uid}-slides`}
				aria-live={running ? 'off' : 'polite'}
				aria-atomic="false"
			>
				<div
					class={styles.face}
					bind:offsetHeight={faceH}
					role={total > 1 ? 'group' : undefined}
					aria-roledescription={total > 1 ? 'slide' : undefined}
					aria-label={total > 1 ? `${current + 1} of ${total}` : undefined}
				>
					<p class={styles.message}>
						<span class={styles.text}>
							{#if typeof announcement.message === 'string'}
								{announcement.message}
							{:else}
								{@render announcement.message()}
							{/if}
						</span>
						{#if announcement.countdown && countdown}
							<span class={styles.countdown}>
								{#if announcement.countdown.label}
									<span class={styles.countdownLabel}>{announcement.countdown.label}</span>
								{/if}
								<span
									role="timer"
									aria-live="off"
									aria-label={spoken}
									class={styles.time}
									data-pending={countdown.pending || undefined}
								>
									{#if countdown.d}
										<span class={styles.unit}>
											{@render digit(String(countdown.d))}
											<span class={styles.unitMark} aria-hidden="true">d</span>
										</span>
										<span class={styles.gap} aria-hidden="true"></span>
									{/if}
									{@render digit(pad(countdown.h)[0])}{@render digit(pad(countdown.h)[1])}<span
										class={styles.sep}
										aria-hidden="true">:</span
									>{@render digit(pad(countdown.m)[0])}{@render digit(pad(countdown.m)[1])}<span
										class={styles.sep}
										aria-hidden="true">:</span
									>{@render digit(pad(countdown.s)[0])}{@render digit(pad(countdown.s)[1])}
								</span>
							</span>
						{/if}
						{#if announcement.action}
							{#if announcement.action.href}
								<a
									class={styles.cta}
									href={announcement.action.href}
									onclick={() => {
										announcement.action?.onClick?.();
										onAction?.(announcement);
									}}
								>
									{announcement.action.label}<ArrowRight
										size={14}
										strokeWidth={1.75}
										aria-hidden="true"
									/>
								</a>
							{:else}
								<button
									type="button"
									class={styles.cta}
									onclick={() => {
										announcement.action?.onClick?.();
										onAction?.(announcement);
									}}
								>
									{announcement.action.label}<ArrowRight
										size={14}
										strokeWidth={1.75}
										aria-hidden="true"
									/>
								</button>
							{/if}
						{/if}
					</p>
				</div>
			</div>
			<div class={styles.controls}>
				{#if navigable}
					<button
						type="button"
						class={styles.icon}
						aria-label="Previous announcement"
						aria-controls={`${uid}-slides`}
						onclick={() => go(-1)}
					>
						<ChevronUp size={16} strokeWidth={1.75} aria-hidden="true" />
					</button>
					{#if rotating}
						<button
							type="button"
							class={styles.ring}
							aria-label={userPaused ? 'Resume announcements' : 'Pause announcements'}
							aria-pressed={userPaused}
							onclick={() => (userPaused = !userPaused)}
						>
							<svg viewBox="0 0 20 20" aria-hidden="true">
								<circle cx="10" cy="10" r="8" class={styles.ringTrack} />
								<circle cx="10" cy="10" r="8" class={styles.ringFill} />
							</svg>
							<span class={styles.ringIcon}>
								{#if userPaused}
									<Play size={9} strokeWidth={2.4} aria-hidden="true" />
								{:else}
									<Pause size={9} strokeWidth={2.4} aria-hidden="true" />
								{/if}
							</span>
						</button>
					{/if}
					<button
						type="button"
						class={styles.icon}
						aria-label="Next announcement"
						aria-controls={`${uid}-slides`}
						onclick={() => go(1)}
					>
						<ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" />
					</button>
				{/if}
				{#if dismissible}
					<button
						type="button"
						class={styles.icon}
						aria-label="Dismiss"
						onclick={dismiss}
					>
						<X size={16} strokeWidth={1.75} aria-hidden="true" />
					</button>
				{/if}
			</div>
		</div>
	</section>
{/if}
