<script lang="ts">
	import NotificationCenter from '$lib/components/notification-center/notification-center.svelte';
	import type { NotificationItem } from '$lib/components/notification-center/notification-center.types';

	const items: NotificationItem[] = [
		{ id: '1', title: 'New comment', description: 'Ada replied to your thread.', time: '2m', tone: 'info' },
		{ id: '2', title: 'Deploy finished', description: 'Production is healthy.', time: '1h', tone: 'success', read: true },
		{ id: '3', title: 'Storage almost full', description: 'You have used 92% of your quota.', time: '3h', tone: 'warning' }
	];
</script>

<div class="demo-grid">
	<NotificationCenter notifications={items} />
	<p class="demo-note">Open the bell, then expand a row to mark it read or dismiss it.</p>
</div>
