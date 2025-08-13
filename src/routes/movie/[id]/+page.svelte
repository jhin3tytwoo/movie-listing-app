<script lang="ts">
	import { page } from '$app/stores';
	import { getMovieById, movies, type Movie } from '$lib/movies.js';
	import { goto } from '$app/navigation';

	let movie = $state<Movie | undefined>(undefined);
	let relatedMovies = $state<Movie[]>([]);
	let currentImageIndex = $state(0);
	let isLoading = $state(true);

	// Get movie data when page loads or ID changes
	$effect(() => {
		isLoading = true;
		const idParam = $page.params.id;
		if (!idParam) {
			isLoading = false;
			return;
		}
		const movieId = parseInt(idParam);
		// Small delay to show loading state
		setTimeout(() => {
			movie = getMovieById(movieId);
			if (movie) {
				// Get related movies
				relatedMovies = movies
					.filter(
						(m) => m.id !== movie!.id && m.genre.some((genre) => movie!.genre.includes(genre))
					)
					.slice(0, 4);
			} else {
				relatedMovies = [];
			}
			isLoading = false;
		}, 100);
	});

	function formatDuration(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours} ชั่วโมง ${mins} นาที`;
	}

	function goHome() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{movie ? movie.titleTh : isLoading ? 'กำลังโหลด' : 'ไม่พบหนัง'} - Movie List App</title>
	{#if movie}
		<meta name="description" content={movie.descriptionTh} />
	{/if}
</svelte:head>

{#if isLoading}
	<div class="py-16 text-center">
		<div
			class="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-b-4 border-indigo-600"
		></div>
		<h1 class="mb-2 text-2xl font-bold text-gray-900">กำลังโหลด...</h1>
		<p class="text-gray-600">กรุณารอสักครู่</p>
	</div>
{:else if !movie}
	<div class="py-16 text-center">
		<div class="mb-4 text-6xl">🎭</div>
		<h1 class="mb-2 text-2xl font-bold text-gray-900">ไม่พบหนังที่ค้นหา</h1>
		<p class="mb-6 text-gray-600">ขออภัย หนังที่คุณกำลังมองหาไม่มีในระบบ</p>
		<div class="space-x-4">
			<button
				onclick={goHome}
				class="rounded-lg bg-indigo-600 px-6 py-2 text-white transition-colors hover:bg-indigo-700"
			>
				🏠 กลับหน้าหลัก
			</button>
			<a
				href="/movies"
				class="inline-block rounded-lg bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
			>
				📋 ดูหนังทั้งหมด
			</a>
		</div>
	</div>
{:else}
	<div class="space-y-8">
		<!-- Back Button -->
		<button
			onclick={goHome}
			class="flex items-center font-medium text-indigo-600 transition-colors hover:text-indigo-700"
		>
			← กลับ
		</button>

		<!-- Movie Hero Section -->
		<div class="overflow-hidden rounded-xl bg-white shadow-xl">
			<div class="lg:flex">
				<!-- Movie Poster -->
				<div class="bg-gray-100 lg:w-1/3">
					<img src={movie.poster} alt={movie.title} class="h-96 w-full object-contain lg:h-full" />
				</div>

				<!-- Movie Info -->
				<div class="p-8 lg:w-2/3">
					<div class="space-y-6">
						<!-- Title and Rating -->
						<div>
							<h1 class="mb-2 text-3xl font-bold text-gray-900 lg:text-4xl">
								{movie.titleTh}
							</h1>
							<p class="mb-4 text-xl text-gray-600">{movie.title}</p>

							<div class="flex items-center space-x-4">
								<div class="flex items-center rounded-full bg-yellow-500 px-3 py-1 text-white">
									<span class="text-lg font-bold">⭐ {movie.rating}</span>
								</div>
								<span class="text-gray-600">ปี {movie.year}</span>
								<span class="text-gray-600">{formatDuration(movie.duration)}</span>
							</div>
						</div>

						<!-- Genres -->
						<div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">หมวดหมู่</h3>
							<div class="flex flex-wrap gap-2">
								{#each movie.genre as genre}
									<span
										class="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
									>
										{genre}
									</span>
								{/each}
							</div>
						</div>

						<!-- Director -->
						<div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">🎬 ผู้กำกับ</h3>
							<p class="text-gray-700">{movie.director}</p>
						</div>

						<!-- Cast -->
						<div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">🎭 นักแสดง</h3>
							<div class="flex flex-wrap gap-2">
								{#each movie.cast as actor}
									<span class="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
										{actor}
									</span>
								{/each}
							</div>
						</div>

						<!-- Description -->
						<div>
							<h3 class="mb-2 text-lg font-semibold text-gray-900">📖 เรื่องย่อ</h3>
							<p class="mb-3 leading-relaxed text-gray-700">
								{movie.descriptionTh}
							</p>
							<p class="text-sm text-gray-600 italic">
								{movie.description}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Movie Stats -->
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-4">
			<div class="rounded-lg bg-white p-6 text-center shadow-md">
				<div class="mb-2 text-3xl font-bold text-indigo-600">
					{movie.rating}
				</div>
				<div class="text-sm text-gray-600">คะแนน IMDb</div>
			</div>

			<div class="rounded-lg bg-white p-6 text-center shadow-md">
				<div class="mb-2 text-3xl font-bold text-green-600">
					{movie.year}
				</div>
				<div class="text-sm text-gray-600">ปีที่เข้าฉาย</div>
			</div>

			<div class="rounded-lg bg-white p-6 text-center shadow-md">
				<div class="mb-2 text-3xl font-bold text-purple-600">
					{Math.floor(movie.duration / 60)}h {movie.duration % 60}m
				</div>
				<div class="text-sm text-gray-600">ความยาว</div>
			</div>

			<div class="rounded-lg bg-white p-6 text-center shadow-md">
				<div class="mb-2 text-3xl font-bold text-orange-600">
					{movie.genre.length}
				</div>
				<div class="text-sm text-gray-600">หมวดหมู่</div>
			</div>
		</div>

		<!-- Related Movies -->
		{#if relatedMovies.length > 0}
			<div class="space-y-6">
				<h2 class="text-2xl font-bold text-gray-900">หนังที่เกี่ยวข้อง</h2>
				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{#each relatedMovies as relatedMovie}
						<div
							class="overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
						>
							<div class="relative bg-gray-100">
								<img
									src={relatedMovie.poster}
									alt={relatedMovie.title}
									class="h-48 w-full object-cover"
								/>

								<div
									class="absolute top-2 right-2 rounded-full bg-yellow-500 px-2 py-1 text-xs font-bold text-white"
								>
									⭐ {relatedMovie.rating}
								</div>
							</div>
							<div class="p-4">
								<h3 class="mb-1 line-clamp-2 text-sm font-bold text-gray-900">
									{relatedMovie.titleTh}
								</h3>
								<p class="mb-2 text-xs text-gray-600">{relatedMovie.title}</p>
								<div class="mb-3 flex flex-wrap gap-1">
									{#each relatedMovie.genre as genre}
										<span class="rounded-full bg-indigo-100 px-2 py-1 text-xs text-indigo-800">
											{genre}
										</span>
									{/each}
								</div>
								<a
									href="/movie/{relatedMovie.id}"
									class="block w-full rounded-lg bg-indigo-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-indigo-700"
								>
									ดูรายละเอียด
								</a>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Action Buttons -->
		<div class="flex flex-col justify-center gap-4 sm:flex-row">
			<button
				onclick={goHome}
				class="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
			>
				🏠 กลับหน้าหลัก
			</button>
			<a
				href="/movies"
				class="rounded-lg bg-gray-600 px-8 py-3 text-center font-medium text-white transition-colors hover:bg-gray-700"
			>
				📋 ดูหนังทั้งหมด
			</a>
		</div>
	</div>
{/if}
