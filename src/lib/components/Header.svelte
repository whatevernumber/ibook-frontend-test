<script lang="ts">
    import Search from "./misc/Search.svelte";
    import {goto} from '$app/navigation';
    import {user} from "$lib/stores/user-store";
    import { page } from '$app/stores';
    import LoginForm from "$lib/components/form/LoginForm.svelte";

    let loggedIn: boolean = false;
    let showAuth: boolean = false;
    $: loggedIn = $user.currentUser ? true : false;

    setTimeout(() => showAuth = true, 1500);

    const logout = async (): Promise<void> => {
        const response: Response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                accept: 'application/json'
            }
        });

        if (response.status === 200) {
            localStorage.removeItem('id');
            $user = {};
            goto('/');
        }
    }

    const changeTheme = () => {
        let theme: string = document.documentElement.getAttribute('data-theme');
        let newTheme: string = '';

        if (theme === 'fantasy') {
            newTheme = 'nord';
        } else {
            newTheme = 'fantasy';
        }
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

</script>

<header class="flex items-center bg-base-200 mb-4 h-16 pl-2 pr-2">
    <div class="flex items-center gap-x-4">
        <a href="/" class="hover:text-accent flex items-center">
            <img class="w-[40px] sm:w-[60px] rounded-full" src="/img/logo.jpg" alt="Логотип с читающим котиками">
            <p class="ml-2 hidden sm:inline">iBook</p>
        </a>
        <a class="btn btn-xs" on:click={changeTheme}>
            <span class="hidden sm:inline">Сменить тему</span>
            <img src="/img/svg/paint-bucket.svg" class="w-4"/>
        </a>
    </div>
{#if showAuth}
    {#if loggedIn}
        <div class="flex justify-between items-center ml-auto">
        {#if $page.url.pathname !== '/'}
            <div class="mr-4 hidden sm:block">
                <Search type="header" />
            </div>
            {/if}
            <div class="flex flex-col items-center">
                <nav class="flex gap-x-5">
                    {#if $user.currentUser && $user.currentUser.data.admin}
                    <a href="/admin/books/add" class="btn btn-xs">
                        <span class="hidden sm:inline">Добавить книгу</span>
                        <img src="/img/svg/book-add.svg" class="w-4"/>
                    </a>
                    {/if}
                    <a class="btn btn-accent btn-xs" href={`/user/${$user.currentUser.data.id}/favs`}>
                        <span class="hidden sm:inline">Избранное</span>
                        <img src="/img/svg/star.svg" class="w-4"/>
                    </a>
                    <a class="btn btn-secondary btn-xs" href={`/user/${$user.currentUser.data.id}/purchases`}>
                        <span class="hidden sm:inline">Покупки</span>
                        <img src="/img/svg/book-check-trans.svg" class="w-4"/>
                    </a>
                    <a class="btn btn-primary btn-xs" href="/cart">
                        <span class="hidden sm:inline">Корзина</span>
                        <img src="/img/svg/cart-shopping.svg" class="w-4">
                        {#if $user.cart.data.length}
                        <span class="hidden sm:inline">{$user.cart.data.length}</span>
                        {/if}
                    </a>
                    <a class="btn btn-xs" href={`/user/${$user.currentUser.data.id}`}>
                        <span class="hidden sm:inline">Профиль</span>
                        <img src="/img/svg/profile.svg" class="w-4"/>
                    </a>
                    <a class="btn btn-xs btn-error" on:click={logout}>
                        <span class="hidden sm:inline">Выйти</span>
                        <img src="/img/svg/leave-icon.svg" class="w-4"/>
                    </a>
                </nav>
            </div>
        </div>
    {:else}
        <div class="flex gap-x-2 ml-auto pr-4">
            <button class="btn btn-accent btn-sm" on:click={() => login_modal.showModal()}>Войти</button>
            <a class="btn btn-secondary btn-sm" href="/registration">Зарегистрироваться</a>
        </div>
    {/if}
{/if}
</header>
<LoginForm />
