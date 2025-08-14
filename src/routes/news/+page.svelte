<script lang="ts">
	import { onMount } from 'svelte';

	let articles: any[] = [];
	let loading = true;
	let error: string | null = null;
	let currentPage = 1;
	let totalPages = 1;
	let searchQuery = null;

	let selectedCountry = 'All';
	let selectedType = 'All';

	const API_URL = 'https://eventregistry.org/api/v1/article/getArticles';
	const API_KEY = '4a6a7831-db13-4869-85b6-f1ae7eddee4d';

	const countries = [
		{ label: 'All', value: 'All' },
		{ label: 'United States', value: 'http://en.wikipedia.org/wiki/United_States' },
		{ label: 'Canada', value: 'http://en.wikipedia.org/wiki/Canada' },
		{ label: 'United Kingdom', value: 'http://en.wikipedia.org/wiki/United_Kingdom' }
	];

	const types = [
		{ label: 'All', value: 'All' },
		{ label: 'News', value: 'news' },
		{ label: 'PR', value: 'pr' }
	];

	let searchTimeout: NodeJS.Timeout;

	async function fetchArticles(page: number = 1) {
		loading = true;
		error = null;
		try {
			const res = await fetch(API_URL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getArticles',
					keyword: searchQuery,
					sourceLocationUri:
						selectedCountry === 'All' ? countries.slice(1).map((c) => c.value) : [selectedCountry],
					ignoreSourceGroupUri: 'paywall/paywalled_sources',
					articlesPage: page,
					articlesCount: 24,
					articlesSortBy: 'date',
					articlesSortByAsc: false,
					dataType: selectedType === 'All' ? ['news', 'pr'] : [selectedType],
					forceMaxDataTimeWindow: 31,
					resultType: 'articles',
					apiKey: API_KEY
				})
			});
			const data = await res.json();

			// 👇 เพิ่มตรงนี้เพื่อดูข้อมูลที่ได้ทั้งหมด
			console.log('📦 Raw API Response:', data);
			console.log('📰 Articles:', data?.articles?.results);
			if (data?.articles?.results) {
				articles = data.articles.results;
				totalPages = data.articles.pages || 1;
				currentPage = page;
			} else {
				error = 'No articles found.';
			}
		} catch (err) {
			error = 'Failed to fetch articles.';
			console.error(err);
		} finally {
			loading = false;
		}
	}

	function handleSearch() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			currentPage = 1;
			fetchArticles();
		}, 500);
	}

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) fetchArticles(page);
	}

	onMount(() => {
		fetchArticles();
	});
</script>

<svelte:head>
	<title>รายการข่าวทั้งหมด</title>
</svelte:head>

<!-- Background & Container -->
<div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
	<div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
		<!-- Header Section -->
		<header class="mb-12 text-center">
			<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">News Explorer</h1>
			<p class="mt-2 text-lg text-gray-600">Discover the latest news and updates</p>
		</header>

		<!-- Search & Filter Section -->
		<section class="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
			<div class="flex-1">
				<input
					type="text"
					bind:value={searchQuery}
					on:input={handleSearch}
					placeholder="Search for topics..."
					class="w-full rounded-lg border border-gray-300 bg-white px-5 py-3 text-base shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
			<div class="flex gap-4">
				<select
					bind:value={selectedCountry}
					on:change={() => fetchArticles()}
					class="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					{#each countries as c}
						<option value={c.value}>{c.label}</option>
					{/each}
				</select>
				<select
					bind:value={selectedType}
					on:change={() => fetchArticles()}
					class="rounded-lg border border-gray-300 bg-white px-4 py-3 text-base shadow-sm transition hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
				>
					{#each types as t}
						<option value={t.value}>{t.label}</option>
					{/each}
				</select>
			</div>
		</section>

		<!-- Articles Grid Section -->
		<section class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#if loading}
				{#each Array(8) as _, i}
					<div
						class="h-80 animate-pulse rounded-lg border border-gray-200 bg-gray-100 p-6 shadow-sm"
					></div>
				{/each}
			{:else if error}
				<div class="col-span-full text-center text-lg font-medium text-red-600">{error}</div>
			{:else}
				{#each articles as article}
					<div
						class="flex flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl"
					>
						<img
							src={typeof article.image === 'string'
								? article.image
								: article.image?.url || 'https://via.placeholder.com/300x150?text=No+Image'}
							alt={article.title}
							class="mb-4 h-40 w-full rounded-md object-cover"
						/>
						<h2 class="mb-3 line-clamp-2 text-xl font-semibold text-gray-900">
							<a href={article.url} target="_blank" class="transition-colors hover:text-blue-600"
								>{article.title}</a
							>
						</h2>
						<p class="mb-4 line-clamp-3 flex-grow text-sm leading-relaxed text-gray-600">
							{article.body?.slice(0, 100)}{article.body?.length > 100 ? '...' : ''}
						</p>
						<div class="text-xs text-gray-500">
							<span>Source: {article.source?.title}</span> |
							<span>Date: {new Date(article.date).toLocaleDateString()}</span>
						</div>
					</div>
				{/each}
			{/if}
		</section>

		<!-- Pagination Section -->
		{#if !loading && totalPages > 1}
			<section class="mt-12 flex items-center justify-center gap-4">
				<button
					on:click={() => goToPage(currentPage - 1)}
					disabled={currentPage === 1}
					class="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					Previous
				</button>
				<span class="font-medium text-gray-700">Page {currentPage} of {totalPages}</span>
				<button
					on:click={() => goToPage(currentPage + 1)}
					disabled={currentPage === totalPages}
					class="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
				>
					Next
				</button>
			</section>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.line-clamp-3 {
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
