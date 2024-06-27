<script lang="ts">
    import BookCard from "$lib/components/card/BookCard.svelte";
    import ErrorFace from "$lib/components/misc/ErrorFace.svelte";

    export let data: object;
    let books: object = data.purchases.data;
</script>

<h1 class="title text-center text-lg mb-4">
    Покупки
</h1>
<div class="flex flex-col mb-6">
    {#if books.length}
    <ul class="flex flex-col flex-wrap gap-y-10">
        {#each books as book}
            <li class="card card-bordered bg-base-200 shadow-xl w-[300px] sm:w-[700px] m-auto">
                <BookCard {book} />
            </li>
        {/each}
    </ul>
    {:else}
        <ErrorFace errorText="Нет покупок" />
    {/if}
</div>