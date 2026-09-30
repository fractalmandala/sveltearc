<script lang="ts">
	import type { Props } from './inline-edit.types';
	import styles from './inline-edit.module.css';
	import Check from '@lucide/svelte/icons/check';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import Pencil from '@lucide/svelte/icons/pencil';
	import X from '@lucide/svelte/icons/x';

	const fallbackId = $props.id();

	let {
		value = $bindable(''),
		onSave,
		label,
		validate,
		placeholder = '',
		multiline = false,
		variant = 'title',
		as: Tag = 'span',
		class: className,
		...restProps
	}: Props = $props();

	const baseId = fallbackId;
	const displayHintId = `${baseId}-display`;
	const editHintId = `${baseId}-edit`;
	const messageId = `${baseId}-message`;

	type Phase = 'idle' | 'saving' | 'saved' | 'failed';

	let committed = $state(value);
	let shown = $state(value);
	let seen = $state(value);
	let editing = $state(false);
	let draft = $state(value);
	let phase = $state<Phase>('idle');
	let error = $state<string | null>(null);
	let failed = $state<string | null>(null);
	let flash = $state<'on' | 'off' | null>(null);
	let announcement = $state('');

	let rootEl = $state<HTMLDivElement | null>(null);
	let displayEl = $state<HTMLButtonElement | null>(null);
	let control = $state<HTMLInputElement | HTMLTextAreaElement | null>(null);
	let displayTextEl = $state<HTMLSpanElement | null>(null);

	let selection: number | 'all' | null = null;
	let focusDisplay = false;
	let saveRun = 0;
	let timers: ReturnType<typeof setTimeout>[] = [];

	$effect(() => {
		return () => {
			timers.forEach(clearTimeout);
		};
	});

	// A new value from outside replaces the text, unless the person is typing or a save is still in flight.
	$effect(() => {
		if (value !== seen) {
			seen = value;
			if (value !== committed) {
				committed = value;
				if (!editing && phase !== 'saving' && value !== shown) shown = value;
			}
		}
	});

	const layerText = $derived(editing ? draft : shown);
	const saving = $derived(phase === 'saving');
	const noun = $derived(label.toLowerCase());
	const slot = $derived(editing ? 'edit' : phase);
	const rootClasses = $derived([styles.root, className].filter(Boolean).join(' '));

	function later(fn: () => void, ms: number) {
		timers.push(setTimeout(fn, ms));
	}

	// Focus follows the mode: into the field with the caret where the text was clicked, and back to the text after Enter or Escape.
	$effect(() => {
		if (editing && control && selection !== null) {
			const at = selection;
			selection = null;
			control.focus({ preventScroll: true });
			if (at === 'all') control.select();
			else control.setSelectionRange(at, at);
		}
		if (!editing && focusDisplay) {
			focusDisplay = false;
			displayEl?.focus({ preventScroll: true });
		}
	});

	function startEdit(at: number | 'all', text = shown) {
		if (editing || saving) return;
		draft = text;
		editing = true;
		error = null;
		failed = null;
		flash = null;
		if (phase !== 'idle') phase = 'idle';
		selection = at;
	}

	type CaretDocument = Document & {
		caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
		caretRangeFromPoint?: (x: number, y: number) => Range | null;
	};

	/** The caret lands on the character that was clicked, the way it would in a text field. */
	function caretAt(x: number, y: number) {
		const node = displayTextEl?.firstChild;
		if (!node || !shown) return shown.length;
		const doc = document as CaretDocument;
		const position = doc.caretPositionFromPoint?.(x, y);
		if (position)
			return position.offsetNode === node ? Math.min(position.offset, shown.length) : shown.length;
		const range = doc.caretRangeFromPoint?.(x, y);
		return range && range.startContainer === node
			? Math.min(range.startOffset, shown.length)
			: shown.length;
	}

	function onDisplayClick(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
		if (saving) return;
		// A keyboard activation selects everything, ready to retype; a click puts the caret where it landed.
		startEdit(event.detail === 0 ? 'all' : caretAt(event.clientX, event.clientY));
	}

	const clean = (text: string) => (multiline ? text.trim() : text.replace(/\s+/g, ' ').trim());

	function submit(source: 'key' | 'button' | 'blur') {
		const next = clean(draft);
		const problem = validate?.(next) || null;
		if (problem) {
			error = problem;
			if (source !== 'blur') control?.focus();
			return;
		}
		editing = false;
		error = null;
		if (source !== 'blur') focusDisplay = true;
		if (next === shown) return;
		const previous = committed;
		const run = ++saveRun;
		shown = next;
		value = next;
		phase = 'saving';
		announcement = `Saving ${label.toLowerCase()}`;
		Promise.resolve()
			.then(() => onSave(next))
			.then(
				() => {
					if (run !== saveRun) return;
					committed = next;
					phase = 'saved';
					announcement = `${label} saved`;
					later(() => {
						phase = phase === 'saved' ? 'idle' : phase;
					}, 1800);
				},
				() => {
					if (run !== saveRun) return;
					shown = previous;
					value = previous;
					phase = 'failed';
					failed = next;
					flash = 'on';
					announcement = '';
					later(() => {
						flash = flash === 'on' ? 'off' : flash;
					}, 1400);
					later(() => {
						flash = flash === 'off' ? null : flash;
					}, 2000);
				}
			);
	}

	function cancel() {
		editing = false;
		error = null;
		focusDisplay = true;
	}

	function retry() {
		if (!failed) return;
		startEdit(failed.length, failed);
	}

	function onControlInput(event: Event & { currentTarget: HTMLInputElement | HTMLTextAreaElement }) {
		const next = event.currentTarget.value;
		draft = next;
		if (error) error = validate?.(clean(next)) || null;
	}

	function onControlKeyDown(
		event: KeyboardEvent & { currentTarget: HTMLInputElement | HTMLTextAreaElement }
	) {
		if (event.key === 'Escape') {
			event.preventDefault();
			event.stopPropagation();
			cancel();
			return;
		}
		if (
			event.key === 'Enter' &&
			!event.isComposing &&
			!(multiline && event.shiftKey)
		) {
			event.preventDefault();
			submit('key');
		}
	}

	// Leaving the component saves, the way a rename does; switching windows does not.
	function onRootBlur(event: FocusEvent & { currentTarget: HTMLDivElement }) {
		if (!editing) return;
		const next = event.relatedTarget as Node | null;
		if (next && rootEl?.contains(next)) return;
		if (!next && !document.hasFocus()) return;
		submit('blur');
	}

	const messageTone = $derived(error ? 'error' : failed && !editing ? 'failed' : null);
	const describedBy = (hint: string) =>
		[hint, messageTone ? messageId : null].filter(Boolean).join(' ');
</script>

<div
	{...restProps}
	bind:this={rootEl}
	class={rootClasses}
	data-variant={variant}
	data-multiline={multiline || undefined}
	data-editing={editing || undefined}
	data-phase={phase}
	data-invalid={error ? '' : undefined}
	data-flash={flash ?? undefined}
	onblur={onRootBlur}
>
	<svelte:element this={Tag} class={styles.line}>
		<span class={styles.box}>
			<!-- The text stays in flow while editing, hidden and mirroring the draft, so it sizes the box and can roll back on Escape. -->
			<button
				bind:this={displayEl}
				type="button"
				class={styles.display}
				onclick={onDisplayClick}
				tabindex={editing ? -1 : undefined}
				aria-label={`${label}: ${shown || placeholder}`}
				aria-describedby={describedBy(displayHintId)}
				aria-disabled={saving || undefined}
			>
				<span class={styles.layer} data-empty={layerText ? undefined : ''}>
					<span bind:this={displayTextEl} class={styles.text}>
						{(layerText || placeholder || '\u200b') + (multiline && editing ? '\u200b' : '')}
					</span>
				</span>
			</button>
			{#if editing}
				{#if multiline}
					<textarea
						bind:this={control}
						class={styles.control}
						value={draft}
						oninput={onControlInput}
						onkeydown={onControlKeyDown}
						rows={1}
						enterkeyhint="done"
						{placeholder}
						aria-label={label}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedBy(editHintId)}
						autocomplete="off"
						spellcheck={variant === 'body'}
					></textarea>
				{:else}
					<input
						bind:this={control}
						class={styles.control}
						type="text"
						value={draft}
						oninput={onControlInput}
						onkeydown={onControlKeyDown}
						enterkeyhint="done"
						{placeholder}
						aria-label={label}
						aria-invalid={error ? true : undefined}
						aria-describedby={describedBy(editHintId)}
						autocomplete="off"
						spellcheck={variant === 'body'}
					/>
				{/if}
			{/if}
			<span class={styles.frame}>
				<span class={styles.slot}>
					<span class={styles.slotItem}>
						{#if slot === 'edit'}
							<span class={styles.actions}>
								<button
									type="button"
									class={styles.save}
									aria-label={`Save ${noun}`}
									onpointerdown={(event) => event.preventDefault()}
									onclick={() => submit('button')}
								>
									<Check size={15} strokeWidth={2} aria-hidden="true" />
								</button>
								<button
									type="button"
									class={styles.cancel}
									aria-label="Cancel editing"
									onpointerdown={(event) => event.preventDefault()}
									onclick={cancel}
								>
									<X size={15} strokeWidth={2} aria-hidden="true" />
								</button>
							</span>
						{:else if slot === 'saving'}
							<span class={styles.spinner} aria-hidden="true"></span>
						{:else if slot === 'saved'}
							<span class={styles.saved} aria-hidden="true">
								<svg
									width={16}
									height={16}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width={2.25}
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M4 12.5l5 5L20 6.5" />
								</svg>
							</span>
						{:else if slot === 'failed'}
							<CircleAlert
								class={styles.failedIcon}
								size={16}
								strokeWidth={1.75}
								aria-hidden="true"
							/>
						{:else}
							<Pencil
								class={styles.pencil}
								size={14}
								strokeWidth={1.75}
								aria-hidden="true"
								onclick={() => startEdit(shown.length)}
							/>
						{/if}
					</span>
				</span>
			</span>
		</span>
	</svelte:element>
	<span class={styles.reveal}>
		<span id={messageId} class={styles.revealInner} aria-live="polite">
			{#if messageTone === 'error' && error}
				<span class={styles.message} data-tone="error">
					<CircleAlert class={styles.messageIcon} size={14} strokeWidth={2} aria-hidden="true" />
					<span>{error}</span>
				</span>
			{:else if messageTone === 'failed' && failed}
				<span class={styles.message} data-tone="failed">
					<CircleAlert class={styles.messageIcon} size={14} strokeWidth={2} aria-hidden="true" />
					<span>
						{`Couldn’t save “${failed}”, so the last saved ${noun} is back.`}
						<button type="button" class={styles.retry} onclick={retry}>Try again</button>
					</span>
				</span>
			{/if}
		</span>
	</span>
	<span id={displayHintId} class={styles.srOnly}>Activate to edit.</span>
	<span id={editHintId} class={styles.srOnly}>
		{multiline
			? 'Enter saves, Shift+Enter adds a line break, Escape cancels.'
			: 'Enter saves, Escape cancels.'}
	</span>
	<span class={styles.srOnly} role="status">{announcement}</span>
</div>
