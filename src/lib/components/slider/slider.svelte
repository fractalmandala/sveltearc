<script lang="ts" generics="T extends SliderValue = number">
	import { untrack } from 'svelte';
	import styles from './slider.module.css';
	import type { Props, SliderMark, SliderValue } from './slider.types';

	let {
		label,
		value = $bindable(undefined),
		defaultValue,
		onValueChange,
		onValueCommit,
		min = 0,
		max = 100,
		step: stepProp = 1,
		largeStep,
		marks,
		minStepsBetweenThumbs = 0,
		format,
		showValue = true,
		thumbLabels,
		start,
		end,
		name,
		disabled,
		class: classNameProp,
		className,
		ref = $bindable(null),
		...restProps
	}: Props<T> = $props();

	type Drag = { pointer: number; index: number | null; grab: number; x: number; raw: number };

	const labelId = $props.id();
	const step = $derived(stepProp > 0 ? stepProp : 1);
	const span = $derived(max - min || 1);
	// React seeds range-ness once from the first value; later value shape changes are not supported.
	// svelte-ignore state_referenced_locally
	const isRange = Array.isArray(value ?? defaultValue);

	function toArray(input: SliderValue | undefined): number[] {
		if (input === undefined) return [min, max].slice(0, isRange ? 2 : 1);
		return Array.isArray(input) ? [input[0], input[1]] : [input];
	}

	/** Uncontrolled mirror; captures only the initial `defaultValue`. */
	let internal = $state(untrack(() => toArray(defaultValue)));
	const values = $derived(value === undefined ? internal : toArray(value));

	const decimals = $derived(Math.max(decimalsOf(step), decimalsOf(min)));
	const formatValue = $derived(
		format ??
			((input: number) =>
				input.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
	);
	const gap = $derived(isRange ? minStepsBetweenThumbs * step : 0);

	function decimalsOf(n: number) {
		return (String(n).split('.')[1] ?? '').length;
	}
	const clamp = (n: number, low: number, high: number) => Math.min(high, Math.max(low, n));
	const pct = (input: number) => ((input - min) / span) * 100;
	const valueAt = (percent: number) => min + (percent / 100) * span;
	const snap = (input: number) => Number((min + Math.round((input - min) / step) * step).toFixed(decimals));
	const lowOf = (index: number, current: number[]) => (index === 1 ? current[0] + gap : min);
	const highOf = (index: number, current: number[]) => (index === 0 && isRange ? current[1] - gap : max);
	const settle = (index: number, input: number, current: number[]) =>
		clamp(snap(clamp(input, min, max)), lowOf(index, current), highOf(index, current));

	let thumbsEl = $state<HTMLDivElement | null>(null);
	let trackEl = $state<HTMLDivElement | null>(null);
	// svelte-ignore state_referenced_locally
	let latest = values;
	let drag: Drag | null = null;
	let pointerFocus = false;
	let lingerTimer: ReturnType<typeof setTimeout> | undefined;
	let dragging = $state<number | null>(null);
	let keyFocus = $state<number | null>(null);
	let linger = $state<number | null>(null);
	// svelte-ignore state_referenced_locally
	let lastActive = $state(isRange ? 1 : 0);
	let quiet = $state<number | null>(null);

	$effect.pre(() => {
		latest = values;
	});
	$effect(() => () => clearTimeout(lingerTimer));

	const emit = (next: number[]) => (isRange ? [next[0], next[1]] : next[0]) as T;

	function commit(index: number, next: number) {
		const current = latest;
		if (current[index] === next) return;
		const updated = current.map((item, at) => (at === index ? next : item));
		latest = updated;
		if (value === undefined) internal = updated;
		else value = emit(updated);
		onValueChange?.(emit(updated));
	}

	const thumbNode = (index: number) => thumbsEl?.querySelector<HTMLElement>(`[data-index="${index}"]`);

	/** Focus that follows a pointer keeps the thumb quiet: no ring and no bubble until a key is pressed. */
	function focusFromPointer(index: number) {
		const node = thumbNode(index);
		if (!node || document.activeElement === node) return;
		quiet = index;
		pointerFocus = true;
		node.focus({ preventScroll: true });
		pointerFocus = false;
	}

	function nearest(at: number, current: number[]) {
		if (!isRange) return 0;
		const low = Math.abs(at - pct(current[0]));
		const high = Math.abs(at - pct(current[1]));
		return low === high ? (at < pct(current[0]) ? 0 : 1) : low < high ? 0 : 1;
	}

	function holdBubble(index: number) {
		clearTimeout(lingerTimer);
		linger = index;
		lingerTimer = setTimeout(() => (linger = null), 700);
	}

	/** Starts tracking one thumb. A press on the track moves the nearest thumb there; a grabbed thumb keeps its grab offset. */
	function begin(state: Drag, index: number, at: number, press: boolean) {
		state.index = index;
		state.grab = press ? 0 : at - pct(latest[index]);
		dragging = index;
		lastActive = index;
		clearTimeout(lingerTimer);
		linger = null;
		focusFromPointer(index);
		if (press) follow(state, at);
	}

	/** Commits the stepped value beneath the pointer, bounded by the thumb's limits. */
	function follow(state: Drag, at: number) {
		const index = state.index;
		if (index === null) return;
		const raw = at - state.grab;
		state.raw = raw;
		commit(index, settle(index, valueAt(raw), latest));
	}

	function percentAt(event: PointerEvent, rect: DOMRect) {
		return ((event.clientX - rect.left) / (rect.width || 1)) * 100;
	}

	function onPointerDown(event: PointerEvent) {
		if (disabled || event.button !== 0 || !event.isPrimary) return;
		const rect = trackEl?.getBoundingClientRect();
		if (!rect) return;
		const at = percentAt(event, rect);
		const grabbed = (event.target as HTMLElement).closest<HTMLElement>('[data-thumb]');
		const current = latest;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		const state: Drag = { pointer: event.pointerId, index: null, grab: 0, x: event.clientX, raw: at };
		drag = state;
		// Stacked range thumbs wait for the first movement to decide which one the pointer means.
		if (grabbed && isRange && current[0] === current[1]) {
			focusFromPointer(Number(grabbed.dataset.index));
			return;
		}
		begin(state, grabbed ? Number(grabbed.dataset.index) : nearest(at, current), at, !grabbed);
	}

	function onPointerMove(event: PointerEvent) {
		const state = drag;
		if (!state || state.pointer !== event.pointerId) return;
		const rect = trackEl?.getBoundingClientRect();
		if (!rect) return;
		const at = percentAt(event, rect);
		if (state.index === null) {
			const dx = event.clientX - state.x;
			if (Math.abs(dx) < 2) return;
			begin(state, dx < 0 ? 0 : 1, at - (dx / (rect.width || 1)) * 100, false);
		}
		follow(state, at);
	}

	function onPointerEnd(event: PointerEvent) {
		const state = drag;
		if (!state || state.pointer !== event.pointerId) return;
		drag = null;
		const index = state.index;
		if (index === null) return;
		commit(index, settle(index, valueAt(state.raw), latest));
		dragging = null;
		holdBubble(index);
		onValueCommit?.(emit(latest));
	}

	function onKeyDown(index: number, event: KeyboardEvent) {
		if (disabled) return;
		const current = latest;
		const now = current[index];
		const large = largeStep ?? Math.max(step, snap(min + span / 10) - min);
		const moves: Record<string, number> = {
			ArrowRight: step,
			ArrowUp: step,
			ArrowLeft: -step,
			ArrowDown: -step,
			PageUp: large,
			PageDown: -large
		};
		let wanted: number;
		if (event.key === 'Home') wanted = lowOf(index, current);
		else if (event.key === 'End') wanted = highOf(index, current);
		else if (event.key in moves)
			wanted = now + (event.shiftKey && /^Arrow/.test(event.key) ? Math.sign(moves[event.key]) * large : moves[event.key]);
		else return;
		event.preventDefault();
		keyFocus = index;
		quiet = null;
		lastActive = index;
		const next = settle(index, wanted, current);
		// Phase 1 still-state: React's strain-at-the-limit bump is a spring, deferred to Phase 2.
		if (next === now) return;
		commit(index, next);
		onValueCommit?.(emit(latest));
	}

	function jumpTo(target: number) {
		if (disabled) return;
		const current = latest;
		const index = nearest(pct(target), current);
		const next = settle(index, target, current);
		lastActive = index;
		focusFromPointer(index);
		if (next === current[index]) return;
		commit(index, next);
		onValueCommit?.(emit(latest));
	}

	const markList = $derived(
		(marks ?? [])
			.map((mark) => (typeof mark === 'number' ? ({ value: mark } as SliderMark) : mark))
			.filter((mark) => mark.value >= min && mark.value <= max)
	);
	const ticks = $derived(markList.filter((mark) => mark.value > min && mark.value < max));
	const labelled = $derived(markList.filter((mark) => mark.label));
	const inRange = (mark: number) => (isRange ? mark >= values[0] && mark <= values[1] : mark <= values[0]);
	const names = $derived(thumbLabels ?? [`${label}, minimum`, `${label}, maximum`]);

	const clipPath = $derived.by(() => {
		const from = isRange ? clamp(pct(values[0]), 0, 100) : 0;
		const to = clamp(pct(isRange ? values[1] : values[0]), 0, 100);
		return `inset(0 ${(100 - to).toFixed(3)}% 0 ${from.toFixed(3)}% round 999px)`;
	});

	const rootClass = $derived([styles.root, classNameProp, className].filter(Boolean).join(' '));
</script>

<div
	bind:this={ref}
	{...restProps}
	class={rootClass}
	data-disabled={disabled || undefined}
	data-dragging={dragging !== null || undefined}
	data-marks={labelled.length > 0 || undefined}
>
	<div class={styles.header}>
		<span id={labelId} class={styles.label}>{label}</span>
		{#if showValue}
			<!-- Phase 1 still-state: RollingNumber renders as plain text; odometer wheels are Phase 2. -->
			<span class={styles.readout} aria-hidden="true">
				<span class={styles.number}>{formatValue(values[0])}</span>
				{#if isRange}<span class={styles.dash}>–</span><span class={styles.number}>{formatValue(values[1])}</span>{/if}
			</span>
		{/if}
	</div>
	<div class={styles.body}>
		{#if start}<div class={styles.start}>{@render start()}</div>{/if}
		<!-- svelte-ignore a11y_no_static_element_interactions -- pointer capture surface; the thumbs are the keyboard-accessible role="slider" elements -->
		<div
			class={styles.control}
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerEnd}
			onpointercancel={onPointerEnd}
			onlostpointercapture={onPointerEnd}
			onmousedown={(event) => event.preventDefault()}
		>
			<div bind:this={trackEl} class={styles.track}>
				{#each ticks as mark (mark.value)}
					<span class={styles.tick} style:left="{pct(mark.value)}%"></span>
				{/each}
				<div class={styles.fill} style:clip-path={clipPath}>
					{#each ticks as mark (mark.value)}
						<span class={styles.tick} style:left="{pct(mark.value)}%"></span>
					{/each}
				</div>
			</div>
			<div bind:this={thumbsEl} class={styles.thumbs}>
				{#each values as item, index (index)}
					{@const shown = pct(item)}
					{@const text = formatValue(item)}
					{@const lifted = dragging === index}
					{@const bubble = dragging === index || keyFocus === index || linger === index}
					<div class={styles.thumbLayer} style:transform="translateX({shown - 100}%)" style:z-index={lastActive === index ? 2 : 1}>
						<div
							role="slider"
							data-thumb=""
							data-index={index}
							data-active={lifted || undefined}
							data-quiet={quiet === index || undefined}
							class={styles.thumb}
							style:transform="scale({lifted ? 1.16 : 1})"
							tabindex={disabled ? -1 : 0}
							aria-label={isRange ? names[index] : undefined}
							aria-labelledby={isRange ? undefined : labelId}
							aria-valuemin={lowOf(index, values)}
							aria-valuemax={highOf(index, values)}
							aria-valuenow={item}
							aria-valuetext={text}
							aria-orientation="horizontal"
							aria-disabled={disabled || undefined}
							onkeydown={(event) => onKeyDown(index, event)}
							onfocus={(event) => {
								if (!pointerFocus && event.currentTarget.matches(':focus-visible')) keyFocus = index;
							}}
							onblur={() => {
								if (keyFocus === index) keyFocus = null;
								if (quiet === index) quiet = null;
							}}
						></div>
						<span class={styles.bubbleAnchor} style:--at={shown}>
							{#if bubble}
								<span class={styles.bubble} aria-hidden="true">
									<span class={styles.number}>{text}</span>
								</span>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>
		{#if end}<div class={styles.end}>{@render end()}</div>{/if}
		{#if labelled.length > 0}
			<div class={styles.marks} aria-hidden="true">
				{#each labelled as mark (mark.value)}
					<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -- pointer shortcut only; the thumbs stay keyboard-operable and this row is aria-hidden -->
					<span
						class={styles.markLabel}
						data-on={inRange(mark.value) || undefined}
						data-edge={mark.value === min ? 'start' : mark.value === max ? 'end' : undefined}
						style:left="{pct(mark.value)}%"
						onclick={() => jumpTo(mark.value)}>{mark.label}</span
					>
				{/each}
			</div>
		{/if}
	</div>
	{#if name}
		{#each values as item, index (index)}
			<input type="hidden" {name} value={item} {disabled} />
		{/each}
	{/if}
</div>
