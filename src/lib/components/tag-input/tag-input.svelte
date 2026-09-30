<script lang="ts">
	import { untrack } from 'svelte';
	import type { Props } from './tag-input.types';
	import styles from './tag-input.module.css';
	import Xmark from '@lucide/svelte/icons/x';

	const fallbackId = $props.id();

	let {
		label,
		value = $bindable(),
		defaultValue = [],
		onValueChange,
		placeholder = 'Add a tag',
		description,
		id = fallbackId,
		class: className,
		'aria-describedby': ariaDescribedBy,
		...restProps
	}: Props = $props();

	let internal = $state(untrack(() => defaultValue));
	let draft = $state('');
	let picked = $state<string | null>(null);
	let notice = $state('');
	let inputEl = $state<HTMLInputElement | null>(null);

	const tags = $derived(value ?? internal);
	const inputId = $derived(id);
	const hintId = $derived(description ? `${inputId}-description` : undefined);
	const describedBy = $derived(
		[ariaDescribedBy, hintId].filter(Boolean).join(' ') || undefined
	);
	const active = $derived(picked !== null && tags.includes(picked) ? picked : null);
	const rootClasses = $derived([styles.field, className].filter(Boolean).join(' '));

	function say(message: string) {
		notice = notice === message ? `${message} ` : message;
	}

	function update(next: string[]) {
		if (value === undefined) internal = next;
		value = next;
		onValueChange?.(next);
	}

	function pick(tag: string | null) {
		picked = tag;
		if (tag !== null) say(`${tag} selected. Press Backspace to remove it.`);
	}

	function add() {
		const tag = draft.trim();
		if (!tag) return;
		const existing = tags.find((item) => item.toLowerCase() === tag.toLowerCase());
		// Phase 1 still-port: the duplicate pulse is motion; the announcement stays.
		if (existing) {
			say(`${existing} is already added`);
			return;
		}
		update([...tags, tag]);
		draft = '';
		picked = null;
		say(`Added ${tag}`);
	}

	function remove(tag: string) {
		update(tags.filter((item) => item !== tag));
		picked = null;
		say(`Removed ${tag}`);
		inputEl?.focus();
	}

	function onKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		const atStart = input.selectionStart === 0 && input.selectionEnd === 0;
		const index = active === null ? tags.length : tags.indexOf(active);
		let handled = true;
		if (event.key === 'Enter' || event.key === ',') add();
		else if ((event.key === 'Backspace' || event.key === 'Delete') && active !== null)
			remove(active);
		else if (event.key === 'Backspace' && atStart && tags.length)
			pick(tags[tags.length - 1]);
		else if (event.key === 'ArrowLeft' && (atStart || active !== null) && index > 0)
			pick(tags[index - 1]);
		else if (event.key === 'ArrowRight' && active !== null) pick(tags[index + 1] ?? null);
		else if (event.key === 'Escape' && active !== null) pick(null);
		else handled = false;
		if (handled) event.preventDefault();
	}

	// A click on a tag picks it without taking focus from the field. The remove button keeps its own press.
	function onTagMouseDown(event: MouseEvent) {
		if ((event.target as HTMLElement).closest('button')) return;
		event.preventDefault();
	}

	function onTagClick(event: MouseEvent, tag: string) {
		if ((event.target as HTMLElement).closest('button')) return;
		pick(active === tag ? null : tag);
		inputEl?.focus();
	}
</script>

{#snippet message(id: string | undefined, text: string)}
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

<div {...restProps} class={rootClasses}>
	<label for={inputId}>{label}</label>
	<div class={styles.control}>
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -- focus-forwarding surface; the input stays keyboard-operable -->
		<div
			class={styles.content}
			onclick={(event) => {
				if (event.target === event.currentTarget) inputEl?.focus();
			}}
		>
			<span class={styles.ring} aria-hidden="true"></span>
			{#if !draft && !tags.length}
				<span class={styles.placeholder} aria-hidden="true">{placeholder}</span>
			{/if}
			{#each tags as tag (tag)}
				<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -- tag pick mirrors ARC mouse behavior; keyboard path is Backspace/arrows in the input -->
				<span
					class={styles.tag}
					data-tag={tag}
					data-picked={tag === active || undefined}
					onmousedown={onTagMouseDown}
					onclick={(event) => onTagClick(event, tag)}
				>
					<span class={styles.tagLabel}>{tag}</span>
					<button type="button" onclick={() => remove(tag)} aria-label={`Remove ${tag}`}>
						<Xmark size={14} aria-hidden="true" />
					</button>
				</span>
			{/each}
			<input
				bind:this={inputEl}
				id={inputId}
				value={draft}
				oninput={(event) => {
					draft = event.currentTarget.value;
					picked = null;
				}}
				onkeydown={onKeyDown}
				onblur={() => {
					add();
					picked = null;
				}}
				placeholder={tags.length ? '' : placeholder}
				aria-describedby={describedBy}
			/>
		</div>
	</div>
	<span class={styles.srOnly} aria-live="polite">{notice}</span>
	{#if description}{@render message(hintId, description)}{/if}
</div>
