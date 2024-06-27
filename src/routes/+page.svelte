<script lang="ts">
    import BookCard from "$lib/components/card/BookCard.svelte";
    import BookCardButtons from "$lib/components/misc/BookCardButtons.svelte";
    import {user} from "$lib/stores/user-store";
    import AdminBookCardButton from "$lib/components/misc/AdminBookCardButton.svelte";
    import ModalDelete from "$lib/components/misc/ModalDelete.svelte";
    import Pagination from "$lib/components/misc/Pagination.svelte";
    import Search from "$lib/components/misc/Search.svelte";
    import ErrorFace from "$lib/components/misc/ErrorFace.svelte";

    export let data: object;

    const query: string = data.query;
    let booksData: object = data;
    let books: object = booksData.books.data;

    let authorized: boolean = data.authorized;
    let selectedGenre: string|null = null;
    let text: string|null = null;
    let bookToDelete: string|null = null;

    if (query) {
        text = query;
    }

    // if redirected from registered page, show login form
    if (data.login) {
        login_modal.showModal();
    }

    $: if ($user) {
        if ($user.currentUser?.data.admin) {
            authorized = true;
        } else {
            authorized = false;
        }
    }

    const search = async (value: string, type: string) => {
        let query: string = '';

        if (type === 'genre') {
            selectedGenre = value;
        }

        if (selectedGenre) {
            query += 'genre=' + selectedGenre + '&';
        }

        if (text) {
            query += 'text=' + text;
        }

        const response: Response = await fetch('api/books?' + query, {
            method: 'GET',
        });

        if (response.status === 200) {
            const result: object = await response.json();
            books = result.data;
        } else {
            books = {}
        }
    }
</script>

<div class="flex justify-center gap-x-16 mb-6">
    {#if booksData.genres.data}
        <div class="self-start bg-base-200 rounded p-3 hidden sm:block">
            <h2 class="text-md font-bold mb-2">Фильтр по жанрам</h2>
            <p class="text-sm text-accent hover:text-orange-600 cursor-pointer" on:click={() => search(null, 'genre')}>Сбросить</p>
            <ul class="flex flex-col flex-wrap gap-x-2">
            {#each booksData.genres.data as genre}
                <li class="cursor-pointer hover:text-orange-600 {selectedGenre === genre.value ? 'text-primary' : ''}" on:click={() => search(genre.value, 'genre')}>
                    {genre.value}
                </li>
            {/each}
            </ul>
        </div>
    {/if}
    <div class="flex flex-col w-[300px] sm:w-[700px]">
        <div class="self-center mb-4">
            <Search genre={selectedGenre} bind:books bind:text />
        </div>
        {#if books.length}
        <ul class="flex flex-col flex-wrap gap-y-10 min-h-[600px]">
            {#each books as book, index (book.isbn)}
            <li class="card card-bordered bg-base-200 shadow-xl w-[300px] sm:w-[700px] relative">
                <BookCard {book} />
                {#if $user.currentUser}
                <div class="absolute right-40 bottom-10">
                    <BookCardButtons isbn={book.isbn} bookIndex={index} singleBook={book} />
                </div>
                    {#if authorized}
                <div class="absolute right-2 top-2">
                    <AdminBookCardButton isbn={book.isbn} title={book.title} bookIndex={index} bind:bookToDelete />
                </div>
                    {/if}
                {/if}
            </li>
            {/each}
        </ul>
            {#if !selectedGenre && !text}
                <div class="mt-4 self-center">
                    <Pagination data={booksData.books} bind:list={books} />
                </div>
            {/if}
        {:else}
            <ErrorFace errorText="Ничего не найдено" />
        {/if}
    </div>
</div>

<ModalDelete bind:bookToDelete bind:books bind:booksData currentPage="page"/>


