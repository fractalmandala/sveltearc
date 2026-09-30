<script lang="ts">
	import { untrack } from 'svelte';
	import { Dialog } from 'bits-ui';
	import X from '@lucide/svelte/icons/x';
	import styles from './card.module.css';
	import type { Props } from './card.types';

	let {
		title,
		description,
		media,
		action,
		avatar,
		meta,
		status,
		details,
		open: openProp,
		defaultOpen = false,
		onOpenChange,
		children,
		class: className,
		...rest
	}: Props = $props();

	let uncontrolled = $state(untrack(() => defaultOpen));
	const open = $derived(details ? (openProp ?? uncontrolled) : false);
	let hovered = $state(false);

	function setOpen(next: boolean) {
		if (openProp === undefined) uncontrolled = next;
		onOpenChange?.(next);
	}

	const cardClasses = $derived([styles.card, className].filter(Boolean).join(' '));
</script>

{#snippet statusLine(text: string)}
	<span class={styles.status} role="status">
		<span class={styles.srOnly}>{text}</span>
		<span class={styles.roll} aria-hidden="true">
			<span class={styles.line}>
				{#each text.split(/(\s+)/) as part, index (index)}<span class={styles.word}>{part}</span>{/each}
			</span>
		</span>
	</span>
{/snippet}

{#snippet footer()}
	{#if avatar || meta || status || action}
		<div class={styles.footer}>
			{#if avatar || meta || status}
				<div class={styles.byline}>
					{#if avatar}<span class={styles.avatar}>{@render avatar()}</span>{/if}
					<span class={styles.bylineText}>
						{#if meta}<span class={styles.meta}>{@render meta()}</span>{/if}
						{#if status}{@render statusLine(status)}{/if}
					</span>
				</div>
			{/if}
			{#if action}<div class={styles.action}>{@render action()}</div>{/if}
		</div>
	{/if}
{/snippet}

{#snippet cardArticle()}
	<article
		{...rest}
		class={cardClasses}
		data-hover={hovered || undefined}
		onpointerenter={() => (hovered = true)}
		onpointerleave={() => (hovered = false)}
	>
		{#if media}
			<div class={styles.media}><div class={styles.zoom}>{@render media()}</div></div>
		{/if}
		<div class={styles.content}>
			<h3 class={styles.title}>
				{#if details}
					<Dialog.Trigger>
						{#snippet child({ props })}
							<button {...props} type="button" class={styles.trigger}>{title}</button>
						{/snippet}
					</Dialog.Trigger>
				{:else}
					{title}
				{/if}
			</h3>
			{#if description}<p class={styles.description}>{description}</p>{/if}
			{@render children?.()}
			{@render footer()}
		</div>
	</article>
{/snippet}

{#if details}
	<Dialog.Root {open} onOpenChange={setOpen}>
		{@render cardArticle()}
		{#if open}
			<Dialog.Portal>
				<Dialog.Overlay class={styles.overlay} />
				<Dialog.Content class={styles.panel}>
					{#if media}
						<div class={styles.media}><div class={styles.zoom}>{@render media()}</div></div>
					{/if}
					<span class={styles.closeSlot}>
						<Dialog.Close>
							{#snippet child({ props })}
								<button {...props} type="button" class={styles.close} aria-label="Close quick look">
									<X width={16} height={16} strokeWidth={1.75} aria-hidden="true" />
								</button>
							{/snippet}
						</Dialog.Close>
					</span>
					<div class={styles.content}>
						<Dialog.Title>
							{#snippet child({ props })}
								<h2 {...props} class={styles.title}>{title}</h2>
							{/snippet}
						</Dialog.Title>
						{#if description}
							<Dialog.Description>
								{#snippet child({ props })}
									<p {...props} class={styles.description}>{description}</p>
								{/snippet}
							</Dialog.Description>
						{/if}
						{@render children?.()}
						{@render footer()}
						<div class={styles.details}>{@render details()}</div>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		{/if}
	</Dialog.Root>
{:else}
	{@render cardArticle()}
{/if}
