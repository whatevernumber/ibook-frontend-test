<script lang="ts">
    import {goto} from "$app/navigation";
    import { user } from "$lib/stores/user-store";
    import BookCard from "$lib/components/card/BookCard.svelte";
    import BookCardButtons from "$lib/components/misc/BookCardButtons.svelte";
    import {refreshUserData} from "$lib/helpers/helpers";
    import ErrorFace from "$lib/components/misc/ErrorFace.svelte";

    export let data: object;

    let books: object = data.cart.data;
    let error: boolean = false;
    let bonus: number = $user.currentUser?.data.bonus;
    let sum: number = 0;
    let expectedBonuses: number;

    $: expectedBonuses =  Math.floor(sum / 100 * 3);

    const buyBooks = async () => {
        if (bonus > $user.currentUser.data.bonus) {
            return error = true;
        }

        let query = '';
        if (bonus > 0) {
            query = '?bonus=' + bonus;
        }
        let res = await fetch('/api/buy' + query, {
            method: 'POST',
            headers: {
                accept: 'application/json'
            },
        })

        if (res.status === 200) {
            $user = await refreshUserData($user.currentUser.data.id);
            goto('/user/' + $user.currentUser.data.id +'/purchases');
        }
    }

    // calculates the final price of all items, recalculates when an item is deleted
$:  if (books.length) {
      sum = books.reduce(
          (accumulator, currentValue) => accumulator + currentValue.price, 0
      )
    }

</script>
<h1 class="title text-center text-lg mb-4">
    Корзина
</h1>
<div class="flex flex-col mb-6 min-h-[600px]">
    {#if data.cart.data.length}
        <ul class="flex flex-col flex-wrap gap-y-10">
            {#each books as book, index}
                <li class="card card-bordered bg-base-200 shadow-xl w-[300px] sm:w-[700px] m-auto">
                    <BookCard {book} />
                    <div class="absolute right-40 bottom-10">
                        <BookCardButtons isbn={book.isbn} bookIndex={index} singleBook={book} bind:books type="cart" />
                    </div>
                </li>
            {/each}
        </ul>
        <div class="flex flex-col bg-base-300 w-2/3 m-auto p-4 rounded-box">
            <h3 class="mb-4">Бонусный счёт</h3>
            <div class="flex justify-between items-center">
                <div>
                    <input type="number" min=0 max={$user.currentUser?.data.bonus} bind:value={bonus} class="input rounded">
                    {#if error}
                        <p>Указано больше бонусов, чем доступно</p>
                    {/if}
                </div>
                <div>
                    <p class="font-sm">Свободных бонусов: <span class="text-warning">{$user.currentUser?.data.bonus}.</span></p>
                    <p class="text-sm">За покупку книг Вам будет начислено 3% бонусами от стоимости корзины.</p>
                </div>
            </div>
        </div>
        <div class="flex items-center m-auto w-2/3 gap-x-4">
            <p class="text-xl">Итого: <span class="font-bold">{sum}</span></p>
            <button class="btn btn-primary" on:click={buyBooks}>Купить</button>
        </div>
    {:else}
        <ErrorFace errorText="В корзине ничего нет" />
    {/if}
</div>