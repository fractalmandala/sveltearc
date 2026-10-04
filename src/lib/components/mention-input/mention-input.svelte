<script module lang="ts">
	import type {
		Mention,
		MentionChannel,
		MentionKind,
		MentionPerson,
		MentionValue
	} from './mention-input.types';

	const EMPTY: MentionValue = { text: '', mentions: [] };
	const SYMBOL: Record<MentionKind, string> = { person: '@', channel: '#' };
	const POPOVER_WIDTH = 272;

	export const mentionText = (kind: MentionKind, label: string) => `${SYMBOL[kind]}${label}`;

	/** Turns a value into storage friendly text, `<@id>` for people and `<#id>` for channels by default. */
	export function serializeMentions(
		value: MentionValue,
		format: (mention: Mention) => string = (mention) => `<${SYMBOL[mention.kind]}${mention.id}>`
	) {
		let out = '';
		let at = 0;
		for (const mention of [...value.mentions].sort((a, b) => a.start - b.start)) {
			out += value.text.slice(at, mention.start) + format(mention);
			at = mention.end;
		}
		return out + value.text.slice(at);
	}

	type Suggestion = { kind: 'person'; item: MentionPerson } | { kind: 'channel'; item: MentionChannel };
	type Trigger = { kind: MentionKind; start: number; query: string };

	/** Moves mentions along with an edit and drops any the edit touched. `hint` is the caret before the edit, which settles repeated characters. */
	function reconcile(previous: MentionValue, text: string, hint: number): Mention[] {
		const a = previous.text;
		let prefix = 0;
		const maxPrefix = Math.min(a.length, text.length, Math.max(0, hint));
		while (prefix < maxPrefix && a[prefix] === text[prefix]) prefix++;
		let suffix = 0;
		while (
			suffix < a.length - prefix &&
			suffix < text.length - prefix &&
			a[a.length - 1 - suffix] === text[text.length - 1 - suffix]
		)
			suffix++;
		const oldEnd = a.length - suffix;
		const delta = text.length - a.length;
		return previous.mentions
			.flatMap((mention) => {
				if (mention.end <= prefix) return [mention];
				if (mention.start >= oldEnd)
					return [{ ...mention, start: mention.start + delta, end: mention.end + delta }];
				return [];
			})
			.filter(
				(mention) => text.slice(mention.start, mention.end) === mentionText(mention.kind, mention.label)
			);
	}

	function findTrigger(
		text: string,
		caret: number,
		mentions: Mention[],
		kinds: Record<MentionKind, boolean>
	): Trigger | null {
		for (let index = caret - 1; index >= 0 && index >= caret - 48; index--) {
			const char = text[index];
			if (char === '\n') return null;
			if (char !== '@' && char !== '#') continue;
			const kind: MentionKind = char === '@' ? 'person' : 'channel';
			if (!kinds[kind]) return null;
			if (index > 0 && !/[\s([{"']/.test(text[index - 1])) return null;
			if (mentions.some((mention) => index >= mention.start && index < mention.end)) return null;
			const query = text.slice(index + 1, caret);
			const shape = kind === 'person' ? /^[^\s@#]*( [^\s@#]*)?$/ : /^[^\s@#]*$/;
			return shape.test(query) ? { kind, start: index, query } : null;
		}
		return null;
	}

	function rank(label: string, extra: string, query: string) {
		const name = label.toLowerCase();
		if (!query) return 1;
		if (name.startsWith(query)) return 4;
		if (name.split(/[\s\-_.]+/).some((word) => word.startsWith(query))) return 3;
		if (name.includes(query)) return 2;
		return extra.toLowerCase().includes(query) ? 1 : 0;
	}

	function initials(name: string) {
		return name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0]?.toUpperCase())
			.join('');
	}
</script>

<script lang="ts">
	import { untrack } from 'svelte';
	import Hash from '@lucide/svelte/icons/hash';
	import styles from './mention-input.module.css';
	import type {
		Mention,
		MentionInputHandle,
		MentionKind,
		MentionValue,
		Props
	} from './mention-input.types';

	let {
		value = $bindable(),
		defaultValue = EMPTY,
		onChange,
		people,
		channels,
		onMentionAdd,
		onSubmit,
		submitOnEnter = false,
		placeholder,
		minRows = 1,
		maxRows = 8,
		placement = 'auto',
		maxSuggestions = 6,
		disabled = false,
		name,
		id,
		'aria-label': ariaLabel,
		'aria-describedby': describedBy,
		class: className = '',
		ref = $bindable(null),
		...restProps
	}: Props = $props();

	const fallbackId = $props.id();
	const controlId = $derived(id ?? fallbackId);
	const listId = $derived(`${fallbackId}-list`);

	let inner = $state(untrack(() => defaultValue));
	const current = $derived(value ?? inner);
	let live: MentionValue = untrack(() => current);
	$effect(() => {
		live = current;
	});

	let rootEl: HTMLDivElement | null = $state(null);
	let fieldEl: HTMLDivElement | null = $state(null);
	let areaEl: HTMLTextAreaElement | null = $state(null);
	let backdropEl: HTMLDivElement | null = $state(null);
	let listEl: HTMLUListElement | null = $state(null);
	let lastCaret = 0;
	let pending: Mention | null = null;

	let caret = $state<number | null>(null);
	let focused = $state(false);
	let dismissed = $state<number | null>(null);
	let active = $state(0);
	let fieldHeight = $state<number | 'auto'>('auto');
	let limits = $state({ min: 0, max: Infinity });
	let hasMeasuredHeight = false;
	let anchor = $state<{ x: number; y: number; line: number; above: boolean } | null>(null);
	let highlight = $state<{ top: number; height: number } | null>(null);
	let lastQueryKey = $state('');

	function commit(next: MentionValue) {
		if (value === undefined) inner = next;
		onChange?.(next);
	}

	const kinds = $derived({
		person: (people?.length ?? 0) > 0,
		channel: (channels?.length ?? 0) > 0
	});
	const trigger = $derived(
		caret === null ? null : findTrigger(current.text, caret, current.mentions, kinds)
	);
	const suggestions = $derived.by(() => {
		if (!trigger) return [];
		const query = trigger.query.toLowerCase().trim();
		const scored =
			trigger.kind === 'person'
				? (people ?? []).map((item) => ({
						entry: { kind: 'person' as const, item },
						score: rank(item.name, item.role ?? '', query)
					}))
				: (channels ?? []).map((item) => ({
						entry: { kind: 'channel' as const, item },
						score: rank(item.name, item.description ?? '', query)
					}));
		return scored
			.filter((entry) => entry.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, maxSuggestions)
			.map((entry) => entry.entry);
	});

	// A sentence that simply continues after an unmatched name closes the list instead of showing an empty state.
	const open = $derived(
		focused && !disabled && !!trigger && trigger.start !== dismissed && (suggestions.length > 0 || !trigger.query.includes(' '))
	);
	const activeIndex = $derived(Math.min(active, Math.max(0, suggestions.length - 1)));
	const queryKey = $derived(trigger ? `${trigger.start}:${trigger.query}` : '');
	$effect(() => {
		if (queryKey !== lastQueryKey) {
			lastQueryKey = queryKey;
			active = 0;
		}
		if (dismissed !== null && trigger?.start !== dismissed) dismissed = null;
	});

	const countLabel = $derived(
		open
			? suggestions.length
				? `${suggestions.length} ${trigger?.kind === 'person' ? (suggestions.length === 1 ? 'person' : 'people') : suggestions.length === 1 ? 'channel' : 'channels'}`
				: 'No matches'
			: ''
	);

	type MirrorPart =
		| { type: 'text'; from: number; to: number }
		| { type: 'mention'; mention: Mention };
	const mirrorParts = $derived.by(() => {
		const parts: MirrorPart[] = [];
		let at = 0;
		for (const mention of current.mentions) {
			parts.push({ type: 'text', from: at, to: mention.start });
			parts.push({ type: 'mention', mention });
			at = mention.end;
		}
		parts.push({ type: 'text', from: at, to: current.text.length });
		return parts;
	});
	const markAt = $derived(open && trigger ? trigger.start : -1);

	/* Selection: the caret never rests inside a token. Arrow keys hop over it; a click lands on the nearest edge. */
	function onSelect() {
		const area = areaEl;
		if (!area) return;
		let start = area.selectionStart;
		let end = area.selectionEnd;
		const collapsed = start === end;
		for (const mention of live.mentions) {
			if (collapsed && start > mention.start && start < mention.end) {
				const stepped = Math.abs(start - lastCaret) === 1;
				const forward = start > lastCaret;
				start = end = stepped
					? forward
						? mention.end
						: mention.start
					: start - mention.start < mention.end - start
						? mention.start
						: mention.end;
			} else if (!collapsed) {
				if (start > mention.start && start < mention.end) start = mention.start;
				if (end > mention.start && end < mention.end) end = mention.end;
			}
		}
		if (start !== area.selectionStart || end !== area.selectionEnd)
			area.setSelectionRange(start, end, area.selectionDirection);
		lastCaret = area.selectionStart;
		caret = collapsed ? start : null;
	}

	function onInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		const text = target.value;
		const mentions = reconcile(live, text, lastCaret);
		const added = pending;
		pending = null;
		if (added && text.slice(added.start, added.end) === mentionText(added.kind, added.label)) {
			mentions.push(added);
			mentions.sort((a, b) => a.start - b.start);
		}
		const next = { text, mentions };
		live = next;
		commit(next);
		if (added) onMentionAdd?.(added);
		lastCaret = target.selectionStart;
		caret = target.selectionStart === target.selectionEnd ? target.selectionStart : null;
	}

	/** Types through the browser so the change joins the native undo stack; falls back to a direct edit. */
	function typeText(text: string, from?: number, to?: number) {
		const area = areaEl;
		if (!area) return;
		area.focus({ preventScroll: true });
		if (from !== undefined) area.setSelectionRange(from, to ?? from);
		lastCaret = area.selectionStart;
		const typed =
			typeof document !== 'undefined' &&
			typeof document.execCommand === 'function' &&
			document.execCommand('insertText', false, text);
		if (typed) return;
		const start = area.selectionStart;
		const end = area.selectionEnd;
		const baseline = live;
		const nextText = baseline.text.slice(0, start) + text + baseline.text.slice(end);
		const mentions = reconcile(baseline, nextText, start);
		const added = pending;
		pending = null;
		if (added) mentions.push(added);
		mentions.sort((a, b) => a.start - b.start);
		const next = { text: nextText, mentions };
		live = next;
		commit(next);
		if (added) onMentionAdd?.(added);
		requestAnimationFrame(() => {
			area.setSelectionRange(start + text.length, start + text.length);
			caret = start + text.length;
		});
	}

	function choose(suggestion: { kind: MentionKind; item: { id: string; name: string } } | undefined) {
		if (!suggestion || !trigger || caret === null) return;
		const label = suggestion.item.name;
		const token = mentionText(suggestion.kind, label);
		pending = {
			kind: suggestion.kind,
			id: suggestion.item.id,
			label,
			start: trigger.start,
			end: trigger.start + token.length
		};
		const after = current.text[caret];
		typeText(
			after === undefined || !/\s/.test(after) ? `${token} ` : token,
			trigger.start,
			caret
		);
	}

	function onKeyDown(event: KeyboardEvent) {
		const area = event.currentTarget as HTMLTextAreaElement;
		lastCaret = area.selectionStart;
		if (open) {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				if (suggestions.length)
					active =
						(activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + suggestions.length) % suggestions.length;
				return;
			}
			if ((event.key === 'Enter' || event.key === 'Tab') && suggestions.length && !event.shiftKey) {
				event.preventDefault();
				choose(suggestions[activeIndex]);
				return;
			}
			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				dismissed = trigger?.start ?? null;
				return;
			}
		}
		const start = area.selectionStart;
		const end = area.selectionEnd;
		if (start === end && !event.metaKey && (event.key === 'Backspace' || event.key === 'Delete')) {
			// Select the whole token and let the native delete run, so one keystroke removes it and undo restores it.
			const hit = live.mentions.find((mention) =>
				event.key === 'Backspace'
					? start > mention.start && start <= mention.end
					: start >= mention.start && start < mention.end
			);
			if (hit) area.setSelectionRange(hit.start, hit.end);
			return;
		}
		if (event.key === 'Enter' && submitOnEnter && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			if (live.text.trim()) onSubmit?.(live);
		}
	}

	$effect(() => {
		if (!areaEl) return;
		const element = areaEl;
		const handle: MentionInputHandle = {
			focus: () => element.focus(),
			insert: (text) => typeText(text),
			openSuggestions: (kind) => {
				const at =
					typeof document !== 'undefined' && document.activeElement === element
						? element.selectionStart
						: live.text.length;
				const before = live.text[at - 1];
				dismissed = null;
				typeText(
					`${before && !/\s/.test(before) ? ' ' : ''}${kind === 'person' ? '@' : '#'}`,
					at,
					typeof document !== 'undefined' && document.activeElement === element
						? element.selectionEnd
						: at
				);
			},
			clear: () => {
				commit(EMPTY);
				live = EMPTY;
				caret = 0;
			},
			get textarea() {
				return element;
			}
		};
		ref = handle;
		return () => {
			ref = null;
		};
	});

	/* Autosize: the backdrop mirrors the text, so its height is the content height. */
	$effect(() => {
		if (typeof window === 'undefined' || !backdropEl) return;
		const style = getComputedStyle(backdropEl);
		const line = parseFloat(style.lineHeight) || 24;
		const pad = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		const next = {
			min: line * minRows + pad,
			max: line * Math.max(minRows, maxRows) + pad
		};
		if (next.min !== limits.min || next.max !== limits.max) limits = next;
	});
	$effect(() => {
		if (typeof window === 'undefined' || !backdropEl || !limits.min) return;
		const target = Math.min(limits.max, Math.max(limits.min, backdropEl.offsetHeight));
		if (fieldHeight !== target) fieldHeight = target;
		if (typeof ResizeObserver === 'undefined') return;
		const node = backdropEl;
		const observer = new ResizeObserver(() => {
			if (!limits.min) return;
			const next = Math.min(limits.max, Math.max(limits.min, node.offsetHeight));
			if (next !== fieldHeight) fieldHeight = next;
		});
		observer.observe(node);
		return () => observer.disconnect();
	});

	/* The popover hangs from the trigger character, measured from a marker in the mirrored text. */
	function updateAnchor() {
		if (typeof window === 'undefined') return;
		const marker = backdropEl?.querySelector<HTMLElement>('[data-anchor]');
		const root = rootEl;
		const field = fieldEl;
		const area = areaEl;
		if (!marker || !root || !field || !area) {
			if (anchor !== null) anchor = null;
			return;
		}
		const line = parseFloat(getComputedStyle(marker.parentElement ?? marker).lineHeight) || 24;
		const x = Math.max(
			0,
			Math.min(field.offsetLeft + marker.offsetLeft - 10, root.offsetWidth - POPOVER_WIDTH)
		);
		const top = field.offsetTop + marker.offsetTop - area.scrollTop;
		const box = root.getBoundingClientRect();
		const roomBelow = window.innerHeight - (box.top + top + line);
		const above = placement === 'top' || (placement === 'auto' && roomBelow < 300 && box.top + top > roomBelow);
		const y = above ? top - 6 : top + line + 6;
		if (!anchor || anchor.x !== x || anchor.y !== y || anchor.above !== above || anchor.line !== line)
			anchor = { x, y, line, above };
	}
	$effect(() => {
		if (open) updateAnchor();
	});

	function onScroll(event: Event) {
		const target = event.currentTarget as HTMLTextAreaElement;
		if (backdropEl) backdropEl.style.transform = `translateY(${-target.scrollTop}px)`;
		if (open) updateAnchor();
	}

	/* The list highlight is static in Phase 1; the row stays in the same place so Phase 2 can glide it. */
	$effect(() => {
		if (!open || !listEl) {
			if (highlight !== null) highlight = null;
			return;
		}
		const row = listEl.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
		if (!row) {
			if (highlight !== null) highlight = null;
			return;
		}
		const next = { top: row.offsetTop, height: row.offsetHeight };
		if (!highlight || highlight.top !== next.top || highlight.height !== next.height) highlight = next;
	});

	function optionId(index: number) {
		return `${fallbackId}-option-${index}`;
	}
	const optionCountLabel = open
		? suggestions.length
			? `${suggestions.length} ${trigger?.kind === 'person' ? (suggestions.length === 1 ? 'person' : 'people') : suggestions.length === 1 ? 'channel' : 'channels'}`
			: 'No matches'
		: '';
</script>

{#snippet highlightMatch(text: string, query: string)}
	{@const at = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1}
	{#if at < 0}
		{text}
	{:else}
		{text.slice(0, at)}<mark class={styles.match}
			>{text.slice(at, at + query.length)}</mark
		>{text.slice(at + query.length)}
	{/if}
{/snippet}

{#snippet mirrorText(from: number, to: number)}
	{#if markAt >= from && markAt < to}
		{current.text.slice(from, markAt)}<span data-anchor=""></span>{current.text.slice(markAt, to)}
	{:else}
		{current.text.slice(from, to)}
	{/if}
{/snippet}

<div
	bind:this={rootEl}
	class={[styles.root, className].filter(Boolean).join(' ')}
	data-disabled={disabled || undefined}
	{...restProps}
>
	<div
		bind:this={fieldEl}
		class={styles.field}
		style:height={fieldHeight === 'auto' ? 'auto' : `${fieldHeight}px`}
		data-focused={focused || undefined}
	>
		<div bind:this={backdropEl} class={styles.backdrop} aria-hidden="true">
			{#each mirrorParts as part, index (index)}
				{#if part.type === 'mention'}
					<span class={styles.token} data-kind={part.mention.kind}
						>{current.text.slice(part.mention.start, part.mention.end)}</span
					>
				{:else}
					{@render mirrorText(part.from, part.to)}
				{/if}
			{/each}{'\u200b'}
		</div>
		<textarea
			bind:this={areaEl}
			id={controlId}
			{name}
			class={styles.textarea}
			value={current.text}
			{placeholder}
			{disabled}
			rows={minRows}
			spellcheck
			role="combobox"
			aria-label={ariaLabel}
			aria-describedby={describedBy}
			aria-autocomplete="list"
			aria-haspopup="listbox"
			aria-expanded={open}
			aria-controls={open ? listId : undefined}
			aria-activedescendant={open && suggestions.length ? optionId(activeIndex) : undefined}
			oninput={onInput}
			onselect={onSelect}
			onkeydown={onKeyDown}
			onscroll={onScroll}
			onfocus={() => {
				focused = true;
			}}
			onblur={() => {
				focused = false;
				caret = null;
			}}
		></textarea>
	</div>
	<span class={styles.srOnly} aria-live="polite">{countLabel}</span>
	{#if open && anchor}
		<div
			class={styles.popover}
			data-above={anchor.above || undefined}
			style:left={`${anchor.x}px`}
			style:top={`${anchor.y}px`}
			style:transform-origin={anchor.above ? '14px 100%' : '14px 0'}
			onmousedown={(event) => event.preventDefault()}
		>
			<div class={styles.popoverBody}>
				{#if suggestions.length}
					<ul bind:this={listEl} id={listId} role="listbox" aria-label={trigger?.kind === 'person' ? 'People' : 'Channels'} class={styles.list}>
						{#if highlight}
							<span
								class={styles.highlight}
								style:top={`${highlight.top}px`}
								style:height={`${highlight.height}px`}
							></span>
						{/if}
						{#each suggestions as suggestion, index (suggestion.kind + '-' + suggestion.item.id)}
							{@const query = trigger?.query.trim() ?? ''}
							<li
								id={optionId(index)}
								role="option"
								aria-selected={index === activeIndex}
								data-index={index}
								class={styles.option}
								onpointermove={() => {
									if (index !== activeIndex) active = index;
								}}
								onclick={() => choose(suggestion)}
							>
								{#if suggestion.kind === 'person'}
									<span class={styles.avatar} aria-hidden="true">
										{#if suggestion.item.avatar}
											<img src={suggestion.item.avatar} alt="" width={28} height={28} loading="lazy" />
										{:else}
											{initials(suggestion.item.name)}
										{/if}
									</span>
								{:else}
									<span class={styles.glyph} aria-hidden="true"><Hash size={16} strokeWidth={1.75} /></span>
								{/if}
								<span class={styles.optionText}>
									<span class={styles.optionLabel}
										>{@render highlightMatch(suggestion.item.name, query)}</span
									>
									{#if suggestion.kind === 'person'}
										{#if suggestion.item.role}<span class={styles.optionMeta}>{suggestion.item.role}</span>{/if}
									{:else if suggestion.item.description}
										<span class={styles.optionMeta}>{suggestion.item.description}</span>
									{/if}
								</span>
								{#if suggestion.kind === 'channel' && suggestion.item.members !== undefined}
									<span class={styles.count}>{suggestion.item.members}</span>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p class={styles.empty}>
						No {trigger?.kind === 'person' ? 'people' : 'channels'} match “{trigger?.query}”
					</p>
				{/if}
			</div>
		</div>
	{/if}
</div>
