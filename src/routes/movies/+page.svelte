<script lang="ts">
	import { movies, type Movie } from '$lib/movies.js';

	let sortBy = $state<'title' | 'year' | 'rating' | 'duration'>('rating');
	let sortOrder = $state<'asc' | 'desc'>('desc');
	let viewMode = $state<'grid' | 'list'>('grid');

	let sortedMovies = $state<Movie[]>(movies);

	// Sort movies
	$effect(() => {
		sortedMovies = [...movies].sort((a, b) => {
			let aValue, bValue;

			switch (sortBy) {
				case 'title':
					aValue = a.titleTh.toLowerCase();
					bValue = b.titleTh.toLowerCase();
					break;
				case 'year':
					aValue = a.year;
					bValue = b.year;
					break;
				case 'rating':
					aValue = a.rating;
					bValue = b.rating;
					break;
				case 'duration':
					aValue = a.duration;
					bValue = b.duration;
					break;
				default:
					return 0;
			}

			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortOrder === 'asc'
					? aValue.localeCompare(bValue, 'th')
					: bValue.localeCompare(aValue, 'th');
			} else {
				return sortOrder === 'asc'
					? (aValue as number) - (bValue as number)
					: (bValue as number) - (aValue as number);
			}
		});
	});

	function formatDuration(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	}
</script>

<svelte:head>
	<title>รายการหนังทั้งหมด - Movie List App</title>
</svelte:head>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">รายการหนังทั้งหมด</h1>
			<p class="mt-1 text-gray-600">ทั้งหมด {movies.length} เรื่อง</p>
		</div>
	</div>

	<!-- Controls -->
	<div class="rounded-lg bg-white p-4 shadow-md">
		<div class="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
			<!-- Sort By -->
			<div>
				<label for="sortBy" class="mb-2 block text-sm font-medium text-gray-700"> เรียงตาม </label>
				<select
					id="sortBy"
					bind:value={sortBy}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
				>
					<option value="rating">คะแนน</option>
					<option value="year">ปี</option>
					<option value="title">ชื่อ</option>
					<option value="duration">ระยะเวลา</option>
				</select>
			</div>

			<!-- Sort Order -->
			<div>
				<label for="sortOrder" class="mb-2 block text-sm font-medium text-gray-700"> ลำดับ </label>
				<select
					id="sortOrder"
					bind:value={sortOrder}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
				>
					<option value="desc">มาก → น้อย</option>
					<option value="asc">น้อย → มาก</option>
				</select>
			</div>

			<!-- View Mode -->
			<div>
				<label class="mb-2 block text-sm font-medium text-gray-700"> รูปแบบการแสดงผล </label>
				<div class="flex overflow-hidden rounded-lg border border-gray-300">
					<button
						onclick={() => (viewMode = 'grid')}
						class="flex-1 px-3 py-2 text-sm font-medium transition-colors {viewMode === 'grid'
							? 'bg-indigo-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
					>
						🎛️ กริด
					</button>
					<button
						onclick={() => (viewMode = 'list')}
						class="flex-1 px-3 py-2 text-sm font-medium transition-colors {viewMode === 'list'
							? 'bg-indigo-600 text-white'
							: 'bg-white text-gray-700 hover:bg-gray-50'}"
					>
						📋 รายการ
					</button>
				</div>
			</div>
		</div>
	</div>

	<!-- Movies Display -->
	{#if viewMode === 'grid'}
		<!-- Grid View -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each sortedMovies as movie (movie.id)}
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
	{:else}
		<!-- List View -->
		<div class="space-y-4">
			{#each sortedMovies as movie (movie.id)}
				<div
					class="overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
				>
					<div class="flex flex-col sm:flex-row">
						<div class="h-48 sm:h-auto sm:w-48">
							<img src={movie.poster} alt={movie.title} class="h-full w-full object-cover" />
						</div>

						<div class="flex-1 p-6">
							<div class="mb-2 flex items-start justify-between">
								<div>
									<h3 class="mb-1 text-xl font-bold text-gray-900">
										{movie.titleTh}
									</h3>
									<p class="text-gray-600">{movie.title}</p>
								</div>
								<div class="ml-4 rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-white">
									⭐ {movie.rating}
								</div>
							</div>

							<div class="mb-3 flex flex-wrap gap-2">
								{#each movie.genre as genre}
									<span
										class="rounded-full bg-indigo-100 px-2 py-1 text-sm font-medium text-indigo-800"
									>
										{genre}
									</span>
								{/each}
							</div>

							<p class="mb-4 line-clamp-2 text-sm text-gray-700">
								{movie.descriptionTh}
							</p>

							<div class="mb-4 flex flex-wrap gap-4 text-sm text-gray-500">
								<span>📅 ปี {movie.year}</span>
								<span>🎬 {movie.director}</span>
								<span>⏰ {formatDuration(movie.duration)}</span>
							</div>

							<div class="flex items-center justify-between">
								<div class="text-sm text-gray-600">
									<span class="font-medium">นักแสดง:</span>
									{movie.cast.slice(0, 2).join(', ')}
									{#if movie.cast.length > 2}
										และอื่นๆ
									{/if}
								</div>
								<a
									href="/movie/{movie.id}"
									class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
								>
									ดูรายละเอียด
								</a>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
