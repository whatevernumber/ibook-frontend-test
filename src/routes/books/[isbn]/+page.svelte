<script lang="ts">
    import BookCard from "$lib/components/card/BookCard.svelte";
    import AdminBookCardButton from "$lib/components/misc/AdminBookCardButton.svelte";
    import ModalDelete from "$lib/components/misc/ModalDelete.svelte";
    import BookCardButtons from "$lib/components/misc/BookCardButtons.svelte";
    import { user } from "$lib/stores/user-store";

    export let data: object;
    const book: object = data.book.data;

    let bookToDelete: object|null = null;
    let authorized: boolean = false;

    $: if ($user) {
        if ($user.currentUser?.data.admin) {
            authorized = true;
        } else {
            authorized = false;
        }
    }

</script>

<div class="flex m-auto flex-col w-[300px] sm:w-[800px] sm:flex-row bg-accent-content/10">
    <BookCard {book} pageType="main" />
    {#if $user.currentUser}
        <div class="flex items-center justify-between sm:flex-col p-2">
            <div class="">
                <BookCardButtons isbn={book.isbn} singleBook={book} />
            </div>
            {#if authorized}
            <div class="mt-auto">
                <AdminBookCardButton isbn={book.isbn} title={book.title} bind:bookToDelete />
            </div>
            {/if}
        </div>
    {/if}
</div>
{#if bookToDelete}
    <ModalDelete redirect bind:bookToDelete />
{/if}