<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Movie List App</title>
	<meta name="description" content="รายการหนังยอดนิยม" />
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="border-b border-gray-200 bg-white shadow-lg">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center">
					<a href="/" class="text-2xl font-bold text-indigo-600 hover:text-indigo-700">
						🎬 Movie List
					</a>
				</div>
				<div class="flex space-x-4">
					<a
						href="/"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
					>
						หน้าหลัก
					</a>
					<a
						href="/movies"
						class="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-indigo-600"
					>
						รายการหนัง
					</a>
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
		{@render children?.()}
	</main>

	<!-- Footer -->
	<footer class="mt-12 border-t border-gray-200 bg-white">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<p class="text-center text-sm text-gray-500">
				© 2024 Movie List App. Made with SvelteKit & Tailwind CSS
			</p>
		</div>
	</footer>
</div>
