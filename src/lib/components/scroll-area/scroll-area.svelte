<script lang="ts">
	import type { Props, ScrollAreaEdges } from './scroll-area.types';
	import styles from './scroll-area.module.css';

	let {
		children,
		orientation = 'vertical',
		fade = 28,
		scrollbars = 'auto',
		hideDelay = 900,
		maxHeight,
		snap,
		label,
		wheelToHorizontal = true,
		viewportClassName,
		viewportStyle,
		viewportRef = $bindable(null),
		onScroll,
		onEdgeChange,
		class: classNameProp,
		className,
		...restProps
	}: Props = $props();

	type Axis = 'x' | 'y';

	let rootElement = $state<HTMLDivElement | null>(null);
	let viewportElement = $state<HTMLDivElement | null>(null);
	let trackY = $state<HTMLDivElement | null>(null);
	let trackX = $state<HTMLDivElement | null>(null);
	let thumbY = $state<HTMLDivElement | null>(null);
	let thumbX = $state<HTMLDivElement | null>(null);

	const vertical = $derived(orientation !== 'horizontal');
	const horizontal = $derived(orientation !== 'vertical');
	const MIN_THUMB = 28;

	let hideTimer: number | undefined;
	let lastEdges = '';

	function wake() {
		if (!rootElement) return;
		rootElement.setAttribute('data-scrolling', '');
		window.clearTimeout(hideTimer);
		hideTimer = window.setTimeout(() => {
			rootElement?.removeAttribute('data-scrolling');
		}, hideDelay);
	}

	function sync() {
		const node = viewportElement;
		const root = rootElement;
		if (!node || !root) return;

		const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = node;
		const maxY = Math.max(0, scrollHeight - clientHeight);
		const maxX = Math.max(0, scrollWidth - clientWidth);
		const left = Math.abs(scrollLeft);

		const edges: ScrollAreaEdges = {
			top: vertical && scrollTop > 0.5,
			bottom: vertical && maxY - scrollTop > 0.5,
			left: horizontal && left > 0.5,
			right: horizontal && maxX - left > 0.5
		};

		if (fade > 0) {
			node.style.setProperty('--fade-top', `${vertical ? Math.min(fade, scrollTop) : 0}px`);
			node.style.setProperty('--fade-bottom', `${vertical ? Math.min(fade, maxY - scrollTop) : 0}px`);
			node.style.setProperty('--fade-left', `${horizontal ? Math.min(fade, left) : 0}px`);
			node.style.setProperty('--fade-right', `${horizontal ? Math.min(fade, maxX - left) : 0}px`);
		}

		const place = (axis: Axis, scroll: number, max: number, client: number, total: number) => {
			const track = axis === 'y' ? trackY : trackX;
			const thumb = axis === 'y' ? thumbY : thumbX;
			if (!track || !thumb) return;

			const overflowing = max > 0.5;
			track.toggleAttribute('data-hidden', !overflowing);
			if (!overflowing) return;

			const length = axis === 'y' ? track.clientHeight : track.clientWidth;
			const size = Math.max(MIN_THUMB, (length * client) / total);
			const offset = (length - size) * (scroll / max);

			thumb.style[axis === 'y' ? 'height' : 'width'] = `${size}px`;
			thumb.style.transform =
				axis === 'y' ? `translate3d(0, ${offset}px, 0)` : `translate3d(${offset}px, 0, 0)`;
		};

		if (vertical) place('y', scrollTop, maxY, clientHeight, scrollHeight);
		if (horizontal) place('x', left, maxX, clientWidth, scrollWidth);
		root.toggleAttribute('data-overflow', maxY > 0.5 || maxX > 0.5);

		const key = `${edges.top}${edges.bottom}${edges.left}${edges.right}`;
		if (key !== lastEdges) {
			lastEdges = key;
			onEdgeChange?.(edges);
		}
	}

	$effect(() => {
		viewportRef = viewportElement;
		const node = viewportElement;
		if (!node) return;

		sync();
		if (typeof ResizeObserver === 'undefined') return;

		const observer = new ResizeObserver(() => sync());
		observer.observe(node);
		Array.from(node.children).forEach((child) => observer.observe(child));

		const mutations = new MutationObserver(() => {
			observer.disconnect();
			observer.observe(node);
			Array.from(node.children).forEach((child) => observer.observe(child));
			sync();
		});
		mutations.observe(node, { childList: true });

		return () => {
			observer.disconnect();
			mutations.disconnect();
			window.clearTimeout(hideTimer);
		};
	});

	// Horizontal wheel conversion
	$effect(() => {
		const node = viewportElement;
		if (!node || orientation !== 'horizontal' || !wheelToHorizontal) return;

		const wheel = (event: WheelEvent) => {
			if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
			const max = node.scrollWidth - node.clientWidth;
			const at = Math.abs(node.scrollLeft);
			if (max <= 0 || (event.deltaY < 0 && at <= 0) || (event.deltaY > 0 && at >= max - 0.5)) return;

			event.preventDefault();
			node.scrollLeft += event.deltaY * (getComputedStyle(node).direction === 'rtl' ? -1 : 1);
		};

		node.addEventListener('wheel', wheel, { passive: false });
		return () => node.removeEventListener('wheel', wheel);
	});

	let drag: { axis: Axis; start: number; scroll: number; ratio: number } | null = null;

	function onThumbDown(event: PointerEvent, axis: Axis) {
		const node = viewportElement;
		const track = axis === 'y' ? trackY : trackX;
		const thumb = axis === 'y' ? thumbY : thumbX;
		if (!node || !track || !thumb || event.button !== 0) return;

		event.preventDefault();
		event.stopPropagation();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

		const length = axis === 'y' ? track.clientHeight : track.clientWidth;
		const size = axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth;
		const max =
			axis === 'y' ? node.scrollHeight - node.clientHeight : node.scrollWidth - node.clientWidth;

		drag = {
			axis,
			start: axis === 'y' ? event.clientY : event.clientX,
			scroll: axis === 'y' ? node.scrollTop : node.scrollLeft,
			ratio: max / Math.max(1, length - size)
		};

		rootElement?.setAttribute('data-dragging', axis);
		node.style.scrollSnapType = 'none';
	}

	function onThumbMove(event: PointerEvent) {
		const state = drag;
		const node = viewportElement;
		if (!state || !node) return;

		const delta =
			((state.axis === 'y' ? event.clientY : event.clientX) - state.start) * state.ratio;
		if (state.axis === 'y') node.scrollTop = state.scroll + delta;
		else node.scrollLeft = state.scroll + delta;
	}

	function onThumbUp(event: PointerEvent) {
		if (!drag) return;
		drag = null;
		if ((event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
			(event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
		}
		rootElement?.removeAttribute('data-dragging');
		if (viewportElement) viewportElement.style.scrollSnapType = '';
		wake();
	}

	function onTrackDown(event: PointerEvent, axis: Axis) {
		const node = viewportElement;
		const thumb = axis === 'y' ? thumbY : thumbX;
		if (!node || !thumb || event.button !== 0 || event.target !== event.currentTarget) return;

		const rect = thumb.getBoundingClientRect();
		const before = axis === 'y' ? event.clientY < rect.top : event.clientX < rect.left;
		const page = (axis === 'y' ? node.clientHeight : node.clientWidth) * 0.9 * (before ? -1 : 1);
		const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		node.scrollBy({ [axis === 'y' ? 'top' : 'left']: page, behavior: reduce ? 'auto' : 'smooth' });
	}

	function handleScroll(event: UIEvent) {
		sync();
		wake();
		onScroll?.(event);
	}

	const rootClasses = $derived([styles.root, classNameProp, className].filter(Boolean).join(' '));
	const viewportClasses = $derived([styles.viewport, viewportClassName].filter(Boolean).join(' '));
</script>

<div
	bind:this={rootElement}
	class={rootClasses}
	data-orientation={orientation}
	data-scrollbars={scrollbars}
	{...restProps}
>
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={viewportElement}
		class={viewportClasses}
		data-fade={fade > 0 ? orientation : undefined}
		style:max-height={typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight}
		style:scroll-snap-type={snap}
		tabindex={0}
		role={label ? 'region' : undefined}
		aria-label={label}
		onscroll={handleScroll}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if vertical}
		<div
			bind:this={trackY}
			class={styles.track}
			data-axis="y"
			data-hidden=""
			aria-hidden="true"
			onpointerdown={(e) => onTrackDown(e, 'y')}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={thumbY}
				class={styles.thumb}
				onpointerdown={(e) => onThumbDown(e, 'y')}
				onpointermove={onThumbMove}
				onpointerup={onThumbUp}
				onpointercancel={onThumbUp}
			></div>
		</div>
	{/if}

	{#if horizontal}
		<div
			bind:this={trackX}
			class={styles.track}
			data-axis="x"
			data-hidden=""
			aria-hidden="true"
			onpointerdown={(e) => onTrackDown(e, 'x')}
		>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				bind:this={thumbX}
				class={styles.thumb}
				onpointerdown={(e) => onThumbDown(e, 'x')}
				onpointermove={onThumbMove}
				onpointerup={onThumbUp}
				onpointercancel={onThumbUp}
			></div>
		</div>
	{/if}
</div>
