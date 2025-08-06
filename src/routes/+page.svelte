<script lang="ts">
	import { movies, type Movie } from '$lib/movies.js';
	import { onMount } from 'svelte';

	let searchQuery = $state('');
	let selectedGenre = $state('all');
	let filteredMovies = $state<Movie[]>(movies);
	let genres = $state<string[]>([]);

	// Get unique genres
	onMount(() => {
		const allGenres = new Set<string>();
		movies.forEach((movie) => {
			movie.genre.forEach((g) => allGenres.add(g));
		});
		genres = Array.from(allGenres).sort();
	});

	// Filter movies based on search and genre
	$effect(() => {
		let result = movies;

		// Filter by genre
		if (selectedGenre !== 'all') {
			result = result.filter((movie) => movie.genre.includes(selectedGenre));
		}

		// Filter by search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(movie) =>
					movie.title.toLowerCase().includes(query) ||
					movie.titleTh.toLowerCase().includes(query) ||
					movie.director.toLowerCase().includes(query) ||
					movie.cast.some((actor) => actor.toLowerCase().includes(query))
			);
		}

		filteredMovies = result;
	});

	function formatDuration(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}
</script>

<svelte:head>
	<title>หน้าหลัก - Movie List App</title>
</svelte:head>

<div class="space-y-8">
	<!-- Hero Section -->
	<div
		class="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-12 text-center text-white shadow-xl"
	>
		<h1 class="mb-4 text-4xl font-bold sm:text-5xl">🎬 รายการหนังยอดนิยม</h1>
		<p class="mx-auto max-w-2xl text-xl text-indigo-100">
			ค้นหาและสำรวจหนังที่คุณชื่นชอบ จากคลาสสิกสู่หนังสมัยใหม่
		</p>
	</div>

	<!-- Search and Filter Section -->
	<div class="rounded-lg bg-white p-6 shadow-md">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<!-- Search Input -->
			<div>
				<label for="search" class="mb-2 block text-sm font-medium text-gray-700">
					🔍 ค้นหาหนัง
				</label>
				<input
					id="search"
					type="text"
					bind:value={searchQuery}
					placeholder="ค้นหาชื่อหนัง, ผู้กำกับ, หรือนักแสดง..."
					class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
				/>
			</div>

			<!-- Genre Filter -->
			<div>
				<label for="genre" class="mb-2 block text-sm font-medium text-gray-700">
					🎭 หมวดหมู่
				</label>
				<select
					id="genre"
					bind:value={selectedGenre}
					class="w-full rounded-lg border border-gray-300 px-4 py-2 transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
				>
					<option value="all">ทั้งหมด</option>
					{#each genres as genre}
						<option value={genre}>{genre}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>

	<!-- Results Counter -->
	<div class="text-center">
		<p class="text-gray-600">
			พบหนัง <span class="font-bold text-indigo-600">{filteredMovies.length}</span> เรื่อง
			{#if searchQuery || selectedGenre !== 'all'}
				จากการค้นหา
			{/if}
		</p>
	</div>

	<!-- Movies Grid -->
	<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
		{#each filteredMovies as movie (movie.id)}
			<div
				class="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
			>
				<div class="relative">
					<img src={movie.poster} alt={movie.title} class="h-64 w-full object-cover" />
					<div
						class="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-1 text-sm font-bold text-white"
					>
						⭐ {movie.rating}
					</div>
				</div>

				<div class="p-4">
					<h3 class="mb-1 line-clamp-2 text-lg font-bold text-gray-900">
						{movie.titleTh}
					</h3>
					<p class="mb-2 text-sm text-gray-600">{movie.title}</p>

					<div class="mb-3 flex flex-wrap gap-1">
						{#each movie.genre as genre}
							<span
								class="rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800"
							>
								{genre}
							</span>
						{/each}
					</div>

					<div class="mb-4 space-y-1 text-sm text-gray-500">
						<p>📅 ปี {movie.year}</p>
						<p>🎬 {movie.director}</p>
						<p>⏰ {formatDuration(movie.duration)}</p>
					</div>

					<a
						href="/movie/{movie.id}"
						class="block w-full rounded-lg bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700"
					>
						ดูรายละเอียด
					</a>
				</div>
			</div>
		{/each}
	</div>

	<!-- No Results -->
	{#if filteredMovies.length === 0}
		<div class="py-12 text-center">
			<div class="mb-4 text-6xl">🎭</div>
			<h3 class="mb-2 text-xl font-medium text-gray-900">ไม่พบหนังที่ค้นหา</h3>
			<p class="mb-4 text-gray-500">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่ดูครับ</p>
			<button
				onclick={() => {
					searchQuery = '';
					selectedGenre = 'all';
				}}
				class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700"
			>
				รีเซ็ตการค้นหา
			</button>
		</div>
	{/if}
</div>
