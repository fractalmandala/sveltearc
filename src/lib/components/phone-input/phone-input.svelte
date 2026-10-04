<script lang="ts">
	import { tick, untrack } from 'svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Search from '@lucide/svelte/icons/search';
	import X from '@lucide/svelte/icons/x';
	import styles from './phone-input.module.css';
	import type {
		PhoneCountry,
		PhoneInputDetails,
		Props
	} from './phone-input.types';
	import {
		PHONE_COUNTRIES,
		capDigits,
		caretAfterDigits,
		countryByIso,
		flagOf,
		formatNational,
		lengthsFor,
		matchesQuery,
		onlyDigits,
		parsePhoneNumber,
		splitTrunk,
		statusOf,
		valueFor
	} from './phone-input.data';

	let {
		label,
		hideLabel = false,
		value = $bindable(),
		defaultValue = '',
		onValueChange,
		country = $bindable(),
		defaultCountry = 'US',
		onCountryChange,
		countries,
		preferredCountries = ['US', 'CA', 'GB'],
		description,
		error,
		validate = true,
		disabled = false,
		required = false,
		name,
		id,
		class: className = '',
		ref = $bindable(null),
		onBlur
	}: Props = $props();

	const fallbackId = $props.id();
	const controlId = $derived(id ?? `${fallbackId}-number`);
	const listId = $derived(`${fallbackId}-list`);
	const hintId = $derived(description ? `${controlId}-description` : undefined);
	const errorId = $derived(error ? `${controlId}-error` : undefined);
	const optionId = (key: string) => `${fallbackId}-opt-${key}`;

	const pool = $derived(
		countries?.length ? PHONE_COUNTRIES.filter((entry) => countries.includes(entry.iso)) : PHONE_COUNTRIES
	);
	const fallback = $derived(countryByIso(defaultCountry, PHONE_COUNTRIES[0]));

	function initialState() {
		const parsed = parsePhoneNumber(value ?? defaultValue ?? '', pool);
		return parsed ? { iso: parsed.country.iso, digits: parsed.national } : { iso: fallback.iso, digits: '' };
	}

	let internalIso = $state(untrack(() => initialState().iso));
	let internalDigits = $state(untrack(() => initialState().digits));
	let seenValue = $state<string | undefined>(value);
	const iso = $derived(country ?? internalIso);
	const digits = $derived(internalDigits);
	const current = $derived(countryByIso(iso, fallback));
	const e164 = $derived(valueFor(current, digits));

	$effect(() => {
		const next = value;
		if (next === seenValue) return;
		seenValue = next;
		if (next !== undefined && next !== e164) {
			const parsed = parsePhoneNumber(next, pool);
			if (parsed) {
				internalIso = parsed.country.iso;
				internalDigits = parsed.national;
			} else {
				internalDigits = '';
			}
		}
	});

	const formatted = $derived(formatNational(current, digits));
	const status = $derived(statusFor(current, digits));
	let touched = $state(false);
	const lengths = $derived(lengthsFor(current));
	const lengthCopy = $derived(
		lengths.length === 1 ? `${lengths[0]}` : `${lengths.slice(0, -1).join(', ')} or ${lengths[lengths.length - 1]}`
	);
	const builtIn = $derived(
		validate && touched && (status === 'incomplete' || status === 'too-long')
			? `Numbers in ${current.name} have ${lengthCopy} digits`
			: undefined
	);
	const message = $derived(error ?? builtIn);

	/* The guide: the rest of the example number, in the shape this country expects, drawn faintly after what was typed. */
	const guide = $derived.by(() => {
		const [trunk, rest] = splitTrunk(current, digits);
		if (rest.length >= current.example.length) return '';
		const full = formatNational(current, trunk + rest + current.example.slice(rest.length));
		return full.startsWith(formatted) ? full.slice(formatted.length) : '';
	});

	let inputEl: HTMLInputElement | null = null;
	let pendingCaret: number | null = null;
	let announcement = $state('');

	function emit(entry: PhoneCountry, nextDigits: string) {
		const details: PhoneInputDetails = {
			country: entry,
			formatted: formatNational(entry, nextDigits),
			status: statusOf(entry, nextDigits),
			valid: statusOf(entry, nextDigits) === 'valid'
		};
		onValueChange?.(valueFor(entry, nextDigits), details);
	}

	function setNumber(nextDigits: string, caretDigits: number | null, entry = current) {
		const capped = capDigits(entry, nextDigits);
		pendingCaret = caretDigits === null ? null : Math.min(caretDigits, capped.length);
		if (entry.iso !== current.iso) onCountryChange?.(entry.iso);
		if (capped === digits && entry.iso === current.iso) {
			const input = ref;
			if (input) input.focus({ preventScroll: true });
			return;
		}
		if (country === undefined) internalIso = entry.iso;
		internalDigits = capped;
		emit(entry, capped);
	}

	$effect(() => {
		void digits;
		void open;
		const count = pendingCaret;
		pendingCaret = null;
		if (count === null) return;
		const input = ref;
		if (!input || (typeof document !== 'undefined' && document.activeElement !== input)) return;
		const position = caretAfterDigits(input.value, count);
		input.setSelectionRange(position, position);
	});

	/* ---------------------------------------------- Number entry ---------------------------------------------- */

	function onNumberChange(input: HTMLInputElement) {
		const raw = input.value;
		// Autofill and dropped text arrive as a change: an international number chooses its own country.
		if (raw.includes('+') || (/^\s*00/.test(raw) && onlyDigits(raw).length > 6)) {
			const parsed = parsePhoneNumber(raw.slice(Math.max(0, raw.indexOf('+'))), pool);
			if (parsed && parsed.national) {
				if (parsed.country.iso !== current.iso) announcement = `Country set to ${parsed.country.name}`;
				setNumber(parsed.national, parsed.national.length, parsed.country);
				return;
			}
		}
		const caret = input.selectionStart ?? raw.length;
		setNumber(onlyDigits(raw), onlyDigits(raw.slice(0, caret)).length);
	}

	function onNumberKeyDown(event: KeyboardEvent & { currentTarget: HTMLInputElement }) {
		const input = event.currentTarget;
		if (event.key === '+' && !event.metaKey && !event.ctrlKey) {
			event.preventDefault();
			openList('+');
			return;
		}
		const start = input.selectionStart ?? 0;
		const end = input.selectionEnd ?? 0;
		if (start !== end || event.metaKey || event.ctrlKey || event.altKey) return;
		// Deleting a separator deletes the digit beside it instead of doing nothing.
		if (event.key === 'Backspace' && start > 0 && !/\d/.test(input.value[start - 1])) {
			event.preventDefault();
			const index = onlyDigits(input.value.slice(0, start)).length;
			if (index > 0) setNumber(digits.slice(0, index - 1) + digits.slice(index), index - 1);
		}
		if (event.key === 'Delete' && start < input.value.length && !/\d/.test(input.value[start])) {
			event.preventDefault();
			const index = onlyDigits(input.value.slice(0, start)).length;
			setNumber(digits.slice(0, index) + digits.slice(index + 1), index);
		}
	}

	function onPaste(event: ClipboardEvent & { currentTarget: HTMLInputElement }) {
		const text = event.clipboardData?.getData('text');
		if (!text) return;
		event.preventDefault();
		const input = event.currentTarget;
		const parsed = /^\s*(\+|00)/.test(text) ? parsePhoneNumber(text, pool) : null;
		if (parsed) {
			if (parsed.country.iso !== current.iso) announcement = `Country set to ${parsed.country.name}`;
			setNumber(parsed.national, parsed.national.length, parsed.country);
			return;
		}
		let pasted = onlyDigits(text);
		// "1 415 555 0132" pasted into a US field: the leading calling code is dropped when the number would not fit otherwise.
		if (pasted.startsWith(current.dial) && pasted.length > capDigits(current, pasted).length)
			pasted = pasted.slice(current.dial.length);
		// A whole number replaces what was there; a fragment goes in at the caret.
		if (pasted.length >= Math.min(...lengths)) {
			setNumber(pasted, pasted.length);
			return;
		}
		const before = onlyDigits(input.value.slice(0, input.selectionStart ?? 0)).length;
		const selected = onlyDigits(input.value.slice(0, input.selectionEnd ?? 0)).length;
		setNumber(digits.slice(0, before) + pasted + digits.slice(selected), before + pasted.length);
	}

	/* ---------------------------------------------- Country picker ---------------------------------------------- */

	let open = $state(false);
	let query = $state('');
	let active = $state<string | null>(null);
	const needle = $derived(query.trim().toLowerCase());

	type PickerRow = { key: string; entry: PhoneCountry };
	type PickerSection = { key: string; label?: string; rows: PickerRow[] };

	const sections = $derived.by((): PickerSection[] => {
		const sorted = [...pool].sort((a, b) => a.name.localeCompare(b.name));
		if (needle && needle !== '+') {
			const hits = sorted.filter((entry) => matchesQuery(entry, needle));
			const digitsOnly = onlyDigits(needle);
			if (digitsOnly)
				hits.sort(
					(a, b) =>
						Number(b.dial === digitsOnly) - Number(a.dial === digitsOnly) || a.dial.length - b.dial.length
				);
			return [{ key: 'results', rows: hits.map((entry) => ({ key: `r-${entry.iso}`, entry })) }];
		}
		const preferred = preferredCountries
			.map((code) => pool.find((entry) => entry.iso === code))
			.filter((entry): entry is PhoneCountry => !!entry);
		const all = {
			key: 'all',
			label: preferred.length ? 'All countries' : undefined,
			rows: sorted.map((entry) => ({ key: `a-${entry.iso}`, entry }))
		};
		return preferred.length
			? [
					{ key: 'preferred', label: 'Suggested', rows: preferred.map((entry) => ({ key: `p-${entry.iso}`, entry })) },
					all
				]
			: [all];
	});
	const rows = $derived(sections.flatMap((section) => section.rows));
	const activeKey = $derived(
		active !== null && rows.some((row) => row.key === active) ? active : (rows[0]?.key ?? null)
	);
	const orderOf = $derived(
		new Map(
			[...pool]
				.sort((a, b) => a.name.localeCompare(b.name))
				.map((entry, index) => [entry.iso, index] as [string, number])
		)
	);

	let rootEl: HTMLDivElement | null = $state(null);
	let controlEl: HTMLDivElement | null = $state(null);
	let measureEl: HTMLSpanElement | null = $state(null);
	let listFaceEl: HTMLDivElement | null = $state(null);
	let scrollEl: HTMLDivElement | null = $state(null);
	let triggerEl: HTMLButtonElement | null = $state(null);
	let searchEl: HTMLInputElement | null = $state(null);
	const rowNodes = new Map<string, HTMLElement>();
	let geometry = $state({ trigger: 0, lid: 0, panel: 0, list: 0, measured: false });
	let highlight = $state<{ top: number; height: number } | null>(null);
	let focusTarget = $state<'trigger' | 'search' | 'number' | null>(null);
	let scrollIntent = false;

	function readMeasurements() {
		const measure = measureEl;
		const control = controlEl;
		const face = listFaceEl;
		const root = rootEl;
		if (!measure || !control || !face || !root) return;
		const panel = Math.min(340, control.offsetWidth);
		root.style.setProperty('--pi-panel-w', `${panel}px`);
		const next = {
			trigger: measure.offsetWidth,
			lid: control.clientHeight,
			panel,
			list: face.offsetHeight
		};
		if (
			!geometry.measured ||
			next.trigger !== geometry.trigger ||
			next.lid !== geometry.lid ||
			next.panel !== geometry.panel ||
			(open && next.list !== geometry.list)
		)
			geometry = { ...next, measured: true };
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		void open;
		void query;
		void sections.length;
		void current.iso;
		void disabled;
		readMeasurements();
		const measure = measureEl;
		const control = controlEl;
		const face = listFaceEl;
		if (!measure || !control || !face || typeof ResizeObserver === 'undefined') return;
		const observer = new ResizeObserver(() => readMeasurements());
		observer.observe(measure);
		observer.observe(control);
		observer.observe(face);
		return () => observer.disconnect();
	});

	$effect(() => {
		const target = focusTarget;
		if (!target) return;
		focusTarget = null;
		void tick().then(() => {
			if (target === 'search') searchEl?.focus({ preventScroll: true });
			if (target === 'trigger') triggerEl?.focus({ preventScroll: true });
			if (target === 'number') {
				const input = ref;
				input?.focus({ preventScroll: true });
				input?.setSelectionRange(input.value.length, input.value.length);
			}
		});
	});

	$effect(() => {
		if (typeof document === 'undefined' || !open || !listFaceEl) {
			if (highlight !== null) highlight = null;
			return;
		}
		const node = activeKey ? rowNodes.get(activeKey) : undefined;
		const next = node
			? { top: node.offsetTop, height: node.offsetHeight }
			: null;
		if ((highlight === null) !== (next === null)) highlight = next;
		else if (highlight && next && (highlight.top !== next.top || highlight.height !== next.height))
			highlight = next;
	});

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!open) return;
		const down = (event: PointerEvent) => {
			if (!rootEl?.contains(event.target as Node)) pendingFocusClear();
		};
		const pendingFocusClear = () => {
			focusTarget = null;
			open = false;
		};
		document.addEventListener('pointerdown', down);
		return () => document.removeEventListener('pointerdown', down);
	});

	function openList(seed = '') {
		if (disabled || open) return;
		query = seed;
		const selectedRow = seed
			? null
			: (sections
					.flatMap((section) => section.rows)
					.find((row) => row.entry.iso === current.iso && !row.key.startsWith('p-')) ?? null);
		active = selectedRow?.key ?? null;
		scrollIntent = true;
		focusTarget = 'search';
		announcement = '';
		open = true;
	}

	function close(focus: 'trigger' | 'number' | null) {
		focusTarget = focus;
		open = false;
	}

	function rowAction(node: HTMLElement, key: string) {
		rowNodes.set(key, node);
		return {
			update(nextKey: string) {
				rowNodes.delete(key);
				key = nextKey;
				rowNodes.set(key, node);
			},
			destroy() {
				rowNodes.delete(key);
			}
		};
	}

	function pick(entry: PhoneCountry | undefined) {
		if (!entry) return;
		if (entry.iso !== current.iso) {
			const nextDigits = capDigits(entry, digits);
			if (country === undefined) internalIso = entry.iso;
			internalDigits = nextDigits;
			onCountryChange?.(entry.iso);
			emit(entry, nextDigits);
			announcement = `${entry.name}, +${entry.dial}`;
		}
		close('number');
	}

	function move(key: string | null | undefined) {
		if (!key) return;
		scrollIntent = true;
		active = key;
	}

	$effect(() => {
		if (!open || !scrollEl || !scrollIntent) return;
		const node = activeKey ? rowNodes.get(activeKey) : undefined;
		scrollIntent = false;
		if (!node) return;
		const pad = 6;
		if (node.offsetTop < scrollEl.scrollTop + pad) scrollEl.scrollTop = node.offsetTop - pad;
		else if (node.offsetTop + node.offsetHeight > scrollEl.scrollTop + scrollEl.clientHeight - pad)
			scrollEl.scrollTop = node.offsetTop + node.offsetHeight - scrollEl.clientHeight + pad;
	});

	function onSearchKeyDown(event: KeyboardEvent) {
		const at = rows.findIndex((row) => row.key === activeKey);
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				move(rows[Math.min(rows.length - 1, at + 1)]?.key);
				return;
			case 'ArrowUp':
				event.preventDefault();
				move(rows[Math.max(0, at - 1)]?.key);
				return;
			case 'PageDown':
				event.preventDefault();
				move(rows[Math.min(rows.length - 1, at + 8)]?.key);
				return;
			case 'PageUp':
				event.preventDefault();
				move(rows[Math.max(0, at - 8)]?.key);
				return;
			case 'Home':
				if (query) return;
				event.preventDefault();
				move(rows[0]?.key);
				return;
			case 'End':
				if (query) return;
				event.preventDefault();
				move(rows[rows.length - 1]?.key);
				return;
			case 'Enter':
				event.preventDefault();
				pick(rows[at]?.entry);
				return;
			case 'Escape':
				event.preventDefault();
				event.stopPropagation();
				close('trigger');
				return;
			case 'Tab':
				close(null);
				return;
		}
	}

	function onTriggerKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			openList();
			return;
		}
		if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
			event.preventDefault();
			openList(event.key);
		}
	}

	function onQuery(next: string) {
		query = next;
		active = null;
		if (scrollEl) scrollEl.scrollTop = 0;
		const text = next.trim().toLowerCase();
		const count = text && text !== '+' ? pool.filter((entry) => matchesQuery(entry, text)).length : pool.length;
		announcement = text ? (count ? `${count} ${count === 1 ? 'country' : 'countries'}` : 'No matches') : '';
	}

	function onRootBlur(event: FocusEvent) {
		const next = event.relatedTarget as Node | null;
		const root = event.currentTarget as HTMLDivElement | null;
		if (open && next && root && !root.contains(next)) close(null);
	}

	const showCheck = $derived(status === 'valid');
	const invalid = $derived(!!message);
	const derivedDescribedBy = $derived([description ? hintId : null, message ? errorId : null].filter(Boolean).join(' ') || undefined);
	const shapeWidth = $derived(
		!geometry.measured ? undefined : open ? Math.max(geometry.trigger, geometry.panel) : geometry.trigger
	);
	const shapeHeight = $derived(
		!geometry.measured ? undefined : open ? geometry.lid + 2 + geometry.list : geometry.lid
	);
</script>

{#snippet face(entry: PhoneCountry)}
	<span class={styles.flag} aria-hidden="true">{flagOf(entry.iso)}</span>
	<span class={styles.dial}>+{entry.dial}</span>
{/snippet}

{#snippet messageRow(id: string | undefined, text: string, tone: 'hint' | 'error')}
	<span class={styles.messageSlot}>
		<span {id} class={tone === 'error' ? styles.error : styles.hint} role={tone === 'error' ? 'alert' : undefined}>
			<span class={styles.srOnly}>{text}</span>
			<span class={styles.words} aria-hidden="true">
				{#each text.split(' ') as word, index (index)}
					<span class={styles.word}>{word}{index < text.split(' ').length - 1 ? ' ' : ''}</span>
				{/each}
			</span>
		</span>
	</span>
{/snippet}

<div
	bind:this={rootEl}
	class={[styles.field, className].filter(Boolean).join(' ')}
	style="--pi-closed-r: 17px"
	data-open={open || undefined}
	data-disabled={disabled || undefined}
	onblur={onRootBlur}
>
	<label for={controlId} class={hideLabel ? styles.srOnly : styles.label}>{label}</label>

	<div bind:this={controlEl} class={styles.control} data-invalid={invalid || undefined}>
		<div class={styles.anchor} style:width={geometry.measured ? `${geometry.trigger}px` : undefined}>
			<span bind:this={measureEl} class={`${styles.trigger} ${styles.measure}`} aria-hidden="true">
				{@render face(current)}
			</span>

			<div
				class={styles.shape}
				style:width={shapeWidth === undefined ? undefined : `${shapeWidth}px`}
				style:height={shapeHeight === undefined ? undefined : `${shapeHeight}px`}
				style:border-radius={open ? '22px' : '17px'}
			>
				<div class={styles.lid}>
					<button
						bind:this={triggerEl}
						type="button"
						class={styles.trigger}
						{disabled}
						inert={open || undefined}
						tabindex={open ? -1 : 0}
						aria-haspopup="listbox"
						aria-expanded={open}
						aria-controls={listId}
						aria-label={`Country, ${current.name} +${current.dial}`}
						onclick={() => (open ? close('trigger') : openList())}
						onkeydown={onTriggerKeyDown}
					>
						<span class={styles.slot} data-hidden={open || undefined}>
							{@render face(current)}
						</span>
					</button>

					<div class={styles.searchRow} inert={!open || undefined}>
						<Search class={styles.searchIcon} size={16} strokeWidth={1.75} aria-hidden="true" />
						<input
							bind:this={searchEl}
							class={styles.search}
							type="text"
							role="combobox"
							aria-label="Search countries or calling codes"
							aria-expanded={open}
							aria-controls={listId}
							aria-autocomplete="list"
							aria-activedescendant={open && activeKey ? optionId(activeKey) : undefined}
							placeholder="Country or code"
							value={query}
							autocomplete="off"
							spellcheck={false}
							oninput={(event) => onQuery(event.currentTarget.value)}
							onkeydown={onSearchKeyDown}
						/>
						{#if query}
							<button
								type="button"
								class={styles.clear}
								aria-label="Clear search"
								onmousedown={(event) => event.preventDefault()}
								onclick={() => {
									onQuery('');
									searchEl?.focus();
								}}
							>
								<X size={14} strokeWidth={1.75} aria-hidden="true" />
							</button>
						{/if}
						<button type="button" class={styles.closeHit} aria-label="Close country list" onclick={() => close('trigger')} />
					</div>

					<span class={styles.chevron} aria-hidden="true">
						<ChevronDown
							size={16}
							strokeWidth={1.75}
							style={open ? 'transform: rotate(180deg);' : undefined}
						/>
					</span>
				</div>

				{#if open}
					<div
						bind:this={listFaceEl}
						class={styles.listFace}
						inert={!open || undefined}
						aria-hidden={!open}
					>
						<div bind:this={scrollEl} class={styles.scroll}>
							<div id={listId} class={styles.options} role="listbox" aria-label="Countries">
								{#if highlight}
									<span
										class={styles.highlight}
										style:top={`${highlight.top}px`}
										style:height={`${highlight.height}px`}
									></span>
								{/if}
								{#each sections as section (section.key)}
									{#if section.label}
										<div role="group" aria-labelledby={`${fallbackId}-${section.key}`} class={styles.group}>
											<div id={`${fallbackId}-${section.key}`} class={styles.groupLabel} role="presentation">
												{section.label}
											</div>
											{#each section.rows as row (row.key)}
												<div
													use:rowAction={row.key}
													id={optionId(row.key)}
													role="option"
													aria-selected={row.entry.iso === current.iso}
													class={styles.option}
													data-active={row.key === activeKey || undefined}
													onpointermove={(event) => {
														if (event.pointerType === 'mouse' && row.key !== activeKey) active = row.key;
													}}
													onpointerdown={(event) => event.preventDefault()}
													onclick={() => pick(row.entry)}
												>
													<span class={styles.flag} aria-hidden="true">{flagOf(row.entry.iso)}</span>
													<span class={styles.name}>{row.entry.name}</span>
													<span class={styles.meta}>+{row.entry.dial}</span>
													<span class={styles.check} data-on={row.entry.iso === current.iso || undefined} aria-hidden="true">
														<Check size={16} strokeWidth={1.75} />
													</span>
												</div>
											{/each}
										</div>
									{:else}
										<div role="presentation" class={styles.group}>
											{#each section.rows as row (row.key)}
												<div
													use:rowAction={row.key}
													id={optionId(row.key)}
													role="option"
													aria-selected={row.entry.iso === current.iso}
													class={styles.option}
													data-active={row.key === activeKey || undefined}
													onpointermove={(event) => {
														if (event.pointerType === 'mouse' && row.key !== activeKey) active = row.key;
													}}
													onpointerdown={(event) => event.preventDefault()}
													onclick={() => pick(row.entry)}
												>
													<span class={styles.flag} aria-hidden="true">{flagOf(row.entry.iso)}</span>
													<span class={styles.name}>{row.entry.name}</span>
													<span class={styles.meta}>+{row.entry.dial}</span>
													<span class={styles.check} data-on={row.entry.iso === current.iso || undefined} aria-hidden="true">
														<Check size={16} strokeWidth={1.75} />
													</span>
												</div>
											{/each}
										</div>
									{/if}
								{/each}
								{#if rows.length === 0}
									<p class={styles.empty}>No countries match “{query.trim()}”</p>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</div>

		<div class={styles.numberWrap}>
			<span class={styles.guide} aria-hidden="true">
				<span class={styles.guideTyped}>{formatted}</span>{guide}
			</span>
			<input
				bind:this={ref}
				id={controlId}
				class={styles.number}
				type="tel"
				inputmode="tel"
				autocomplete="tel"
				value={formatted}
				{disabled}
				{required}
				aria-invalid={invalid || undefined}
				aria-describedby={derivedDescribedBy}
				aria-label={hideLabel ? label : undefined}
				oninput={(event) => onNumberChange(event.currentTarget)}
				onkeydown={onNumberKeyDown}
				onpaste={onPaste}
				onblur={(event) => {
					touched = true;
					onBlur?.(event);
				}}
			/>
			{#if showCheck}
				<span class={styles.valid} aria-hidden="true">
					<Check size={16} strokeWidth={2} />
				</span>
			{/if}
		</div>
	</div>

	{#if description && !message}
		{@render messageRow(hintId, description, 'hint')}
	{/if}
	{#if message}
		{@render messageRow(errorId, message, 'error')}
	{/if}
	{#if name}
		<input type="hidden" {name} value={e164} />
	{/if}
	<span class={styles.srOnly} role="status" aria-live="polite">
		{announcement || (showCheck ? `Valid ${current.name} number` : '')}
	</span>
</div>
