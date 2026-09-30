<script lang="ts">
	import { AvatarGroup } from '$lib/components/avatar-group';
	import type { AvatarGroupMember } from '$lib/components/avatar-group';

	const team: AvatarGroupMember[] = [
		{ name: 'Ada Lovelace', status: 'online' },
		{ name: 'Grace Hopper', status: 'offline' },
		{ name: 'Alan Turing' },
		{ name: 'Katherine Johnson', status: 'online' },
		{ name: 'Margaret Hamilton' },
		{ name: 'Barbara Liskov' }
	];
</script>

<div class="demo-grid">
	<AvatarGroup members={team} max={3} label="Editors" />
	<AvatarGroup members={team} max={6} label="Contributors" />
	<AvatarGroup members={team} max={1} size="lg" label="Owner" />
</div>
