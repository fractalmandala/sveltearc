<script lang="ts">
	import { page } from '$app/state';
</script>

<header class="page-head">
	<div>
		<h1>{page.status}</h1>
		<p>{page.error?.message ?? 'Not found'}</p>
	</div>
</header>

<p class="demo-note"><a href="/">← Back to the gallery</a></p>
