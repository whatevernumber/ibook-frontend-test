<script lang="ts">
    import BookCard from "$lib/components/card/BookCard.svelte";
    import BookCardButtons from "$lib/components/misc/BookCardButtons.svelte";
    import ErrorFace from "$lib/components/misc/ErrorFace.svelte";

    export let data: object;
    let books: object = data.favs.data;
</script>

<h1 class="title text-center text-lg mb-4">
    Избранные
</h1>
<div class="flex flex-col items-center mb-6">
    {#if books.length}
        <ul class="flex flex-col flex-wrap gap-y-10">
            {#each books as book, index (book.isbn)}
                <li class="card card-bordered bg-base-200 shadow-xl w-[300px] sm:w-[700px] m-auto">
                    <BookCard {book} />
                    <div class="absolute right-40 bottom-10">
                        <BookCardButtons isbn={book.isbn} bookIndex={index} singleBook={book} bind:books type="fav" />
                    </div>
                </li>
            {/each}
        </ul>
    {:else}
        <ErrorFace errorText="Нет избранных" />
    {/if}
</div>