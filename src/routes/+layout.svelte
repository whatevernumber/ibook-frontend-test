<script lang="ts">
	import {onMount} from 'svelte';
	import {user} from "$lib/stores/user-store";
	import Header from '$lib/components/Header.svelte';
	import {refreshUserData} from '$lib/helpers/helpers.ts';
	import { invalidateAll, afterNavigate } from '$app/navigation'
	import '../app.css';

	export let data: object;

	onMount(async () => {
		let savedTheme = localStorage.getItem('theme');
		let theme: string = document.documentElement.getAttribute('data-theme');

		if (savedTheme !== theme) {
			let newTheme: string = '';

			if (theme === 'fantasy') {
				newTheme = 'nord';
			} else {
				newTheme = 'fantasy';
			}

			document.documentElement.setAttribute('data-theme', newTheme);
		}

		if (data.authorized) {
			const userId: string = data.id;

			if (userId && !$user.currentUser) {
				$user = await refreshUserData(userId);
			}
		} else {
			$user = {};
		}
	});

	afterNavigate(() => {
		invalidateAll();
		if (!data.authorized) {
			$user = {};
		}
	});

</script>

<Header />

<main>
	<slot />
</main>

<footer class="footer mt-auto h-12 bg-base-200 flex items-center">
	<p class="ml-auto pr-4">
		<a class="text-xs" href="https://github.com/whatevernumber" target="_blank" >
			<img src="/img/svg/github.svg" class="w-8">
		</a>
	</p>
</footer>