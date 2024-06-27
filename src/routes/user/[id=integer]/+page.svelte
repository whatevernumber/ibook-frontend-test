<script lang="ts">
    import { user } from "$lib/stores/user-store";
    import ModalUserDelete from "$lib/components/misc/ModalUserDelete.svelte";

    export let data: object;
    const currentUser: object = data.user.data;

    let age: number;
    let error: string;

    if (currentUser.birthday) {
        const yearInMs = 3.15576e+10;
        age = Math.floor((new Date() - new Date(currentUser.birthday).getTime()) / yearInMs) //
    }

</script>

<div class="flex justify-between shadow-xl bg-base-200 w-[300px] sm:w-[500px] m-auto min-h-32 p-8">
    <div>
        <p class="text-sm font-bold"> Имя пользователя:</p>
        <p>{currentUser.name}</p>
        <p class="text-sm font-bold"> Почтовый ящик:</p>
        <p>{currentUser.email}</p>
        <p class="text-sm font-bold"> Дата рождения:</p>
        <p>{currentUser.birthday}</p>
        {#if age}
        <p class="text-sm font-bold">Возраст</p>
        <p>{age}</p>
        {/if}
    </div>
    {#if $user.currentUser && $user.currentUser.data.id === currentUser.id}
        <div class="flex flex-col gap-y-4">
        <a class="btn btn-secondary btn-xs" href={'/user/' + $user.currentUser.data.id + '/favs'}>
            Избранное
            {#if $user.favs.data.length}
                <span>{$user.favs.data.length}</span>
            {/if}
        </a>
        <a class="btn btn-secondary btn-xs" href={'/user/' + $user.currentUser.data.id + '/purchases'}>
            Покупки
            {#if $user.purchases.data.length}
                <span>{$user.purchases.data.length}</span>
            {/if}
        </a>
        <a class="btn btn-primary btn-xs" href="/cart">
            Корзина
            {#if $user.cart.data.length}
                <span>{$user.cart.data.length}</span>
            {/if}
        </a>
        <a href={currentUser.id + '/edit'} class="btn btn-xs">Редактировать профиль</a>
        <button on:click={() => user_delete_modal.showModal()} class="btn btn-xs btn-error">Удалить профиль</button>
        </div>
    {/if}
</div>

<ModalUserDelete userToDelete={currentUser}/>