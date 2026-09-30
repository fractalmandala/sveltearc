<script lang="ts">
	import { DropdownMenu as M } from "bits-ui";
	import ChevronDown from "@lucide/svelte/icons/chevron-down";
	import { motionTokens } from "../../motion-tokens.js";
	import styles from "./dropdown-menu.module.css";
	import type { DropdownMenuProps } from "./dropdown-menu.types.js";

	let { label, items, icon }: DropdownMenuProps = $props();

	type Highlight = { top: number; height: number; danger: boolean; glide: boolean };

	let highlight = $state<Highlight | null>(null);
	let pointer = $state(false);
	let measure = $state<HTMLSpanElement | null>(null);
	let measured = $state<string | null>(null);
	let labelWidth = $state<number | "auto">("auto");
	/** True when the width change is a text morph (first measure settles instantly). Phase 2 springs it. */
	let labelMorph = $state(false);

	let clearTimer: ReturnType<typeof setTimeout> | undefined;

	function setSize(width: number | "auto", animate: boolean) {
		labelWidth = width;
		labelMorph = animate;
	}

	// Phase 1: ResizeObserver tracks the measured label so the trigger width follows text (applied statically).
	// Phase 2 will spring labelWidth on text morphs (labelMorph && !reduced → motionTokens.spring.morph).
	$effect(() => {
		const node = measure;
		if (!node) return;
		const observer = new ResizeObserver(([entry]) => {
			const current = node.textContent;
			// Only a text change morphs; the first measure and font swaps settle instantly.
			const animate = measured !== null && measured !== current;
			measured = current;
			setSize(Math.ceil(entry.borderBoxSize?.[0]?.inlineSize ?? node.offsetWidth), animate);
		});
		observer.observe(node);
		return () => observer.disconnect();
	});

	// Bits UI focuses the highlighted item (pointer or keyboard) and the content when the pointer leaves an item.
	// focusin, not focus: the DOM focus event does not bubble, but Bits UI focuses the ITEM
	// (a child of Content) — React's onFocus bubbled via focusin delegation, so this handler
	// must listen on the bubbling phase or keyboard navigation never lights the highlight.
	function onMenuFocus(event: FocusEvent) {
		const item = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>('[role="menuitem"]') : null;
		window.clearTimeout(clearTimer);
		if (!item) {
			// A short grace period keeps the highlight gliding across separators and item gaps.
			clearTimer = window.setTimeout(() => (highlight = null), pointer ? 70 : 0);
			return;
		}
		const next = { top: item.offsetTop, height: item.offsetHeight, danger: item.dataset.tone === "danger" };
		const glide = pointer;
		highlight = { ...next, glide: glide && highlight !== null };
	}

	// Phase 1 (still state): motion-owned visuals render their END STATES statically.
	//  - label morph: latest label visible, y=0, full opacity, no blur; width applied statically
	//  - highlight: rendered only when a target exists (end state of the opacity-0 hidden variant)
	//  - chevron rotation + hover colors: CSS (dropdown-menu.module.css), untouched
	// Phase 2 will restore: label rise/fall morph, springing trigger width (motionTokens.spring.morph),
	//  gliding highlight span (motionTokens.spring.snappy), blur/opacity transitions.
</script>

<M.Root
	onOpenChange={(open) => {
		if (open) {
			window.clearTimeout(clearTimer);
			highlight = null;
		}
	}}
>
	<M.Trigger class={styles.trigger} type="button">
		{#if icon}<span class={styles.triggerIcon} aria-hidden="true">{@render icon()}</span>{/if}
		<span class={styles.label} style:width={labelWidth === "auto" ? "auto" : `${labelWidth}px`} data-morph={labelMorph ? "true" : undefined}>
			<span bind:this={measure} class={styles.labelMeasure} aria-hidden="true">{label}</span>
			<span class={styles.labelText}>{label}</span>
		</span>
		<ChevronDown class={styles.chevron} size={15} strokeWidth={1.8} aria-hidden="true" />
	</M.Trigger>
	<M.Portal>
		<M.Content
			class={styles.menu}
			loop
			sideOffset={6}
			align="end"
			collisionPadding={12}
			onfocusin={onMenuFocus}
			onpointermovecapture={() => (pointer = true)}
			onkeydowncapture={() => (pointer = false)}
		>
			<!-- One highlight glides between items for the pointer and jumps instantly for the keyboard.
			     DOM parity: the React original keeps this span mounted (opacity animates to 0), so we
			     never {#if} it — top/height hold the last target and opacity carries the hidden state. -->
			<span
				class={styles.highlight}
				data-tone={highlight?.danger ? "danger" : undefined}
				aria-hidden="true"
				style:top={highlight ? `${highlight.top}px` : undefined}
				style:height={highlight ? `${highlight.height}px` : undefined}
				style:opacity={highlight ? undefined : 0}
			></span>
			{#each items as item, index (item.label)}
				{#if item.separatorBefore}<M.Separator class={styles.separator} />{/if}
				<M.Item
					class={[styles.item, item.destructive ? styles.destructive : ""].filter(Boolean).join(" ")}
					data-tone={item.destructive ? "danger" : undefined}
					style={`--i: ${index}`}
					disabled={item.disabled}
					onSelect={() => item.onSelect?.()}
				>
					{#if item.icon}<span class={styles.icon} aria-hidden="true">{@render item.icon()}</span>{/if}
					{item.label}
				</M.Item>
			{/each}
		</M.Content>
	</M.Portal>
</M.Root>
