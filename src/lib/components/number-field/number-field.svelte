<script lang="ts">
	import { untrack } from 'svelte';
	import type { Props } from './number-field.types';
	import styles from './number-field.module.css';
	import Minus from '@lucide/svelte/icons/minus';
	import Plus from '@lucide/svelte/icons/plus';

	const fallbackId = $props.id();

	let {
		label,
		value = $bindable(),
		defaultValue = 0,
		onValueChange,
		min = 0,
		max = Number.MAX_SAFE_INTEGER,
		step: stepProp = 1,
		largeStep,
		description,
		disabled = false,
		id = fallbackId,
		prefix,
		suffix,
		scrub = false,
		locale = 'en-US',
		formatOptions,
		size = 'md',
		limitHint = true,
		class: className,
		'aria-describedby': ariaDescribedBy,
		'aria-invalid': ariaInvalid,
		...restProps
	}: Props = $props();

	/** Pixels of label drag per step, the pause before a held control repeats, and the fastest repeat. */
	const SCRUB_PX = 6;
	const HOLD_DELAY = 400;
	const HOLD_FASTEST = 40;
	/** A held press keeps leaning on a limit at this cadence, and how long the limit note stays. */
	const LIMIT_PUSH = 240;
	const LIMIT_HINT_MS = 1500;
	const UNDER_WARN_MS = 700;

	type Source = 'button' | 'key' | 'scrub' | 'type';

	const decimalsOf = (n: number) => (String(n).split('.')[1] ?? '').length;
	const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
	const affixText = (affix: Props['prefix'], current: number) =>
		typeof affix === 'function' ? affix(current) : (affix ?? '');

	let internal = $state(untrack(() => defaultValue));
	let draft = $state('');
	let editing = $state(false);
	let pressed = $state(0);
	let scrubbing = $state(false);
	let announcement = $state('');
	/** The limit a press just met, shown for a moment; and whether a draft under the minimum has sat long enough to warn. */
	let pushed = $state<1 | -1 | 0>(0);
	let underWarn = $state(false);

	let controlEl = $state<HTMLDivElement | null>(null);
	let inputEl = $state<HTMLInputElement | null>(null);

	let holdTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let pushedTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let underTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let strainTimer: ReturnType<typeof setTimeout> | undefined = undefined;
	let pushCount = 0;
	let pushEdge = 0;
	let pushAt = 0;
	let drag: { pointer: number; x: number; from: number; active: boolean } | null = null;
	let suppressClick = false;
	let editStart = 0;
	let selectNext = false;

	$effect(() => {
		return () => {
			clearTimeout(holdTimer);
			clearTimeout(pushedTimer);
			clearTimeout(underTimer);
			clearTimeout(strainTimer);
		};
	});

	const current = $derived(value ?? internal);
	// Fresh-value mirror for the hold-repeat ticks, which outlive a single render's closure.
	let latest: number = untrack(() => current);
	$effect(() => {
		latest = current;
	});

	const step = $derived(stepProp > 0 ? stepProp : 1);
	const base = $derived(Number.isFinite(min) ? min : 0);
	const decimals = $derived(Math.max(decimalsOf(step), decimalsOf(base)));
	const minFraction = $derived(formatOptions?.minimumFractionDigits ?? decimals);
	const maxFraction = $derived(
		Math.max(minFraction, formatOptions?.maximumFractionDigits ?? decimals)
	);
	const grouping = $derived(formatOptions?.useGrouping ?? true);
	const format = $derived(
		new Intl.NumberFormat(locale, {
			minimumFractionDigits: minFraction,
			maximumFractionDigits: maxFraction,
			useGrouping: grouping,
			numberingSystem: 'latn'
		})
	);
	const symbols = $derived(() => {
		const parts = new Intl.NumberFormat(locale).formatToParts(-1234.5);
		return {
			group: parts.find((part) => part.type === 'group')?.value ?? ',',
			decimal: parts.find((part) => part.type === 'decimal')?.value ?? '.'
		};
	});
	const round = (next: number) => Number(next.toFixed(decimals)) || 0;
	const clamp = (next: number) => Math.min(max, Math.max(min, next));
	const snap = (next: number) => round(base + Math.round((next - base) / step) * step);
	/** Off-grid values move to the next grid line in the direction of travel, then whole steps from there. */
	const stepFrom = (from: number, steps: number) => {
		const index = (from - base) / step;
		return round(
			base + ((steps > 0 ? Math.floor(index + 1e-7) : Math.ceil(index - 1e-7)) + steps) * step
		);
	};
	const spoken = (next: number) =>
		`${affixText(prefix, next)}${format.format(next)}${affixText(suffix, next)}`.trim();

	function parse(text: string) {
		const syms = symbols();
		const normalized = text
			.split(syms.group)
			.join('')
			.replace(syms.decimal, '.')
			.replace(/[^\d.-]/g, '');
		if (!/\d/.test(normalized)) return null;
		const parsed = Number(normalized);
		return Number.isFinite(parsed) ? parsed : null;
	}

	const typed = $derived(editing ? parse(draft) : null);
	const shown = $derived(typed ?? current);
	/** A typed value past a limit holds a calm warning until it commits. */
	const outside = $derived<1 | -1 | 0>(
		typed === null ? 0 : typed > max ? 1 : typed < min && underWarn ? -1 : 0
	);
	const noteEdge = $derived<1 | -1 | 0>(limitHint ? outside || pushed : 0);
	const noteLimit = $derived(noteEdge > 0 ? max : min);
	const noteText = $derived(
		!noteEdge
			? ''
			: typeof limitHint === 'function'
				? limitHint(noteEdge > 0 ? 'max' : 'min', noteLimit)
				: `${noteEdge > 0 ? 'Max' : 'Min'} ${spoken(noteLimit)}`
	);

	const inputId = $derived(id);
	const hintId = $derived(description ? `${inputId}-description` : undefined);
	const limitId = $derived(`${inputId}-limit`);
	const describedBy = $derived(
		[ariaDescribedBy, hintId, outside && limitHint ? limitId : undefined]
			.filter(Boolean)
			.join(' ') || undefined
	);
	const invalid = $derived(outside ? true : (ariaInvalid ?? undefined));
	const showLimit = $derived(noteEdge !== 0 && noteText !== '');
	const fieldClasses = $derived([styles.field, className].filter(Boolean).join(' '));

	/** A press past a limit. Phase 1 still-port: the strain tint, the shake and the
	 * spring kick are motion; the limit note and the announcement stay. */
	function strain(edge: 1 | -1) {
		const now = Date.now();
		pushCount = pushEdge === edge && now - pushAt < 700 ? pushCount + 1 : 1;
		pushEdge = edge;
		pushAt = now;
		const control = controlEl;
		if (control) {
			control.dataset.strain = edge > 0 ? 'max' : 'min';
			clearTimeout(strainTimer);
			strainTimer = setTimeout(() => {
				delete control.dataset.strain;
			}, 420);
		}
		if (limitHint) {
			pushed = edge;
			clearTimeout(pushedTimer);
			pushedTimer = setTimeout(() => {
				pushed = 0;
			}, LIMIT_HINT_MS);
		}
	}

	/** Every change lands here. A value past a limit clamps, strains toward it, and says which limit it met. */
	function commitValue(next: number, source: Source) {
		if (!Number.isFinite(next)) return false;
		const clamped = clamp(next);
		const limit = Math.sign(next - clamped);
		if (limit && source !== 'scrub') {
			strain(limit > 0 ? 1 : -1);
			announcement = `${spoken(clamped)}, ${limit > 0 ? 'maximum' : 'minimum'}`;
		} else if (source === 'button' && clamped !== latest) announcement = spoken(clamped);
		if (clamped === latest) return false;
		latest = clamped;
		if (value === undefined) internal = clamped;
		value = clamped;
		onValueChange?.(clamped);
		return true;
	}

	const nudge = (toward: 1 | -1, steps: number, source: Source) =>
		commitValue(stepFrom(latest, toward * steps), source);

	function clearUnder() {
		clearTimeout(underTimer);
		underWarn = false;
	}

	function commitDraft() {
		if (!editing) return;
		editing = false;
		clearUnder();
		const parsed = parse(draft);
		if (parsed !== null) commitValue(snap(parsed), 'type');
	}

	function stopHold() {
		clearTimeout(holdTimer);
		holdTimer = undefined;
		pressed = 0;
	}

	/** One step now; after a pause, repeats that speed up gently until release. Held into a
	 * limit, it keeps leaning on it at a steady cadence until the press lets go. */
	function startHold(toward: 1 | -1, amount: number, source: Source) {
		stopHold();
		commitDraft();
		const steps = Math.max(1, Math.round(amount / step));
		if (source === 'button') pressed = toward;
		let count = 0;
		const tick = () => {
			const moved = nudge(toward, steps, source);
			holdTimer = setTimeout(
				tick,
				moved ? Math.max(HOLD_FASTEST, 150 * 0.86 ** ++count) : LIMIT_PUSH
			);
		};
		holdTimer = setTimeout(tick, nudge(toward, steps, source) ? HOLD_DELAY : LIMIT_PUSH + 120);
	}

	function onStepDown(toward: 1 | -1) {
		if (disabled) return;
		startHold(toward, step, 'button');
	}

	function onStepActivate(toward: 1 | -1) {
		commitDraft();
		nudge(toward, 1, 'button');
	}

	function onKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		const large = largeStep ?? step * 10;
		const move = (
			{
				ArrowUp: [1, event.shiftKey ? large : step],
				ArrowDown: [-1, event.shiftKey ? large : step],
				PageUp: [1, large],
				PageDown: [-1, large]
			} as Record<string, [1 | -1, number]>
		)[event.key];
		if (move) {
			event.preventDefault();
			if (!event.repeat) startHold(move[0], move[1], 'key');
			return;
		}
		// Home and End reach the limits; while a draft is open they move the caret as in any text field.
		if (
			!editing &&
			((event.key === 'Home' && Number.isFinite(min)) ||
				(event.key === 'End' && max < Number.MAX_SAFE_INTEGER))
		) {
			event.preventDefault();
			commitValue(event.key === 'Home' ? min : max, 'key');
			return;
		}
		if (event.key === 'Enter') {
			event.preventDefault();
			if (editing) {
				selectNext = true;
				commitDraft();
			} else event.currentTarget.select();
		}
		if (event.key === 'Escape' && editing) {
			event.preventDefault();
			editing = false;
			clearUnder();
			selectNext = true;
			commitValue(editStart, 'type');
		}
	}

	function onKeyUp(event: KeyboardEvent) {
		if (/^(Arrow(Up|Down)|Page(Up|Down))$/.test(event.key)) stopHold();
	}

	function onInput(event: Event & { currentTarget: HTMLInputElement }) {
		const syms = symbols();
		const allowed = new RegExp(
			`[^0-9${escapePattern(syms.group)}${decimals || maxFraction ? escapePattern(syms.decimal) : ''}${min < 0 ? '\\-' : ''}]`,
			'g'
		);
		const next = event.currentTarget.value.replace(allowed, '');
		if (!editing) editStart = current;
		draft = next;
		editing = true;
		// Valid drafts apply as they are typed, so anything that depends on the value follows along.
		const parsed = parse(next);
		if (parsed !== null && parsed >= min && parsed <= max && snap(parsed) === parsed)
			commitValue(parsed, 'type');
		// Past the maximum warns at once; under the minimum waits, since "1" is often the start of "12".
		clearUnder();
		if (parsed !== null && parsed < min)
			underTimer = setTimeout(() => {
				underWarn = true;
			}, UNDER_WARN_MS);
		// After a commit the caret collapses to the end, so no selection box sits over the digits.
		if (selectNext) {
			selectNext = false;
			const input = inputEl;
			if (input && document.activeElement === input) {
				const end = input.value.length;
				input.setSelectionRange(end, end);
			}
		}
	}

	function onScrubStart(event: PointerEvent & { currentTarget: HTMLLabelElement }) {
		suppressClick = false;
		if (!scrub || disabled || event.button !== 0) return;
		commitDraft();
		drag = { pointer: event.pointerId, x: event.clientX, from: latest, active: false };
		event.currentTarget.setPointerCapture(event.pointerId);
	}

	function onScrubMove(event: PointerEvent & { currentTarget: HTMLLabelElement }) {
		const state = drag;
		if (!state || state.pointer !== event.pointerId) return;
		const dx = event.clientX - state.x;
		if (!state.active) {
			if (Math.abs(dx) < 3) return;
			state.active = true;
			scrubbing = true;
		}
		const travel = dx / SCRUB_PX;
		const steps = Math.trunc(travel);
		commitValue(steps ? stepFrom(state.from, steps) : state.from, 'scrub');
	}

	function onScrubEnd(event: PointerEvent & { currentTarget: HTMLLabelElement }) {
		const state = drag;
		if (!state || state.pointer !== event.pointerId) return;
		drag = null;
		if (!state.active) return;
		suppressClick = true;
		scrubbing = false;
		announcement = spoken(latest);
	}
</script>

{#snippet fieldMessage(id: string | undefined, text: string)}
	{@const parts = text.split(' ')}
	<span class={styles.messageSlot}>
		<span {id} class={styles.hint}>
			<span class={styles.srOnly}>{text}</span>
			<span class={styles.words} aria-hidden="true">
				{#each parts as word, index (index)}<span class={styles.word}
						>{word}{index < parts.length - 1 ? ' ' : ''}</span
					>{/each}
			</span>
		</span>
	</span>
{/snippet}

<div {...restProps} class={fieldClasses} data-size={size}>
	<div class={styles.head}>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -- scrub handle per ARC; keyboard path is the input arrows/PageUp/PageDown -->
		<label
			for={inputId}
			class={styles.label}
			data-scrub={scrub && !disabled || undefined}
			onpointerdown={onScrubStart}
			onpointermove={onScrubMove}
			onpointerup={onScrubEnd}
			onpointercancel={onScrubEnd}
			onclick={(event) => {
				if (suppressClick) {
					event.preventDefault();
					suppressClick = false;
				}
			}}
		>
			{label}
		</label>
		{#if showLimit}
			<span id={limitId} class={styles.limit}>{noteText}</span>
		{/if}
	</div>
	<div
		bind:this={controlEl}
		class={styles.control}
		data-scrubbing={scrubbing || undefined}
		data-disabled={disabled || undefined}
		data-warn={outside ? (outside > 0 ? 'max' : 'min') : undefined}
	>
		<button
			type="button"
			class={styles.step}
			disabled={disabled}
			aria-controls={inputId}
			aria-label={`Decrease ${label}`}
			aria-disabled={shown <= min || undefined}
			data-pressed={pressed === -1 || undefined}
			onpointerdown={(event) => {
				if (event.button === 0) onStepDown(-1);
			}}
			onpointerup={stopHold}
			onpointerleave={stopHold}
			onpointercancel={stopHold}
			onmousedown={(event) => event.preventDefault()}
			onclick={(event) => {
				if (event.detail === 0) onStepActivate(-1);
			}}
			oncontextmenu={(event) => event.preventDefault()}
		>
			<span class={styles.icon}><Minus size={16} strokeWidth={1.75} aria-hidden="true" /></span>
		</button>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -- focus-forwarding surface; the input stays keyboard-operable -->
		<div
			class={styles.valueWrap}
			onmousedown={(event) => {
				if (event.target !== inputEl) event.preventDefault();
			}}
			onclick={(event) => {
				if (!disabled && event.target !== inputEl) {
					inputEl?.focus();
					inputEl?.select();
				}
			}}
		>
			<span class={styles.value}>
				<span class={styles.affix}>{affixText(prefix, shown)}</span>
				<span class={styles.number}>
					<span class={styles.display} data-hidden={editing || undefined} aria-hidden="true">
						{format.format(shown)}
					</span>
					{#if editing}
						<span class={styles.mirror} aria-hidden="true">{draft}</span>
					{/if}
					<input
						bind:this={inputEl}
						id={inputId}
						class={styles.input}
						type="text"
						role="spinbutton"
						inputmode={min < 0 ? 'text' : decimals || maxFraction ? 'decimal' : 'numeric'}
						autocomplete="off"
						spellcheck={false}
						value={editing ? draft : format.format(current)}
						{disabled}
						aria-describedby={describedBy}
						aria-invalid={invalid}
						aria-valuenow={current}
						aria-valuetext={spoken(current)}
						aria-valuemin={Number.isFinite(min) ? min : undefined}
						aria-valuemax={max < Number.MAX_SAFE_INTEGER ? max : undefined}
						oninput={onInput}
						onkeydown={onKeyDown}
						onkeyup={onKeyUp}
						onblur={() => {
							stopHold();
							commitDraft();
						}}
					/>
				</span>
				<span class={styles.affix}>{affixText(suffix, shown)}</span>
			</span>
		</div>
		<button
			type="button"
			class={styles.step}
			disabled={disabled}
			aria-controls={inputId}
			aria-label={`Increase ${label}`}
			aria-disabled={shown >= max || undefined}
			data-pressed={pressed === 1 || undefined}
			onpointerdown={(event) => {
				if (event.button === 0) onStepDown(1);
			}}
			onpointerup={stopHold}
			onpointerleave={stopHold}
			onpointercancel={stopHold}
			onmousedown={(event) => event.preventDefault()}
			onclick={(event) => {
				if (event.detail === 0) onStepActivate(1);
			}}
			oncontextmenu={(event) => event.preventDefault()}
		>
			<span class={styles.icon}><Plus size={16} strokeWidth={1.75} aria-hidden="true" /></span>
		</button>
	</div>
	{#if description}{@render fieldMessage(hintId, description)}{/if}
	<span class={styles.srOnly} aria-live="polite" aria-atomic="true">{announcement}</span>
</div>
