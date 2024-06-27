<script lang="ts">
    import {PUBLIC_STORAGE} from "$env/static/public";
    import {page} from "$app/stores";

    export let book: object;
    export let pageType: string;

    let singleBookPage: boolean;
    singleBookPage = ($page.url.pathname === '/books/' + book.isbn);
</script>

<div class="card-body min-h-[300px] flex-col sm:flex-row gap-x-8">
    <div class="min-w-[150px]">
        <div class="flex flex-col gap-y-2">
            <h2 class="card-title sm:hidden">
                <a href="{singleBookPage ? '' : '/books/' + book.isbn}" class="{singleBookPage ? '' : 'hover:text-accent'}">
                    {book.title}
                </a>
            </h2>
            <a href={singleBookPage ? '' : '/books/' + book.isbn}>
                <img src={book.image ? PUBLIC_STORAGE + book.image.image : '/img/temp-book.jpg'} class="w-[100px] h-[140px] object-cover">
            </a>
            <p class="text-sm">ISBN: <span class="font-bold">{book.isbn}</span></p>
            {#if book.pages}
                <p class="text-sm">Страниц: {book.pages}</p>
            {/if}
            <p class="text-sm">Цена: <span class="font-bold">{book.price}₽</span></p>
        {#if singleBookPage}
            <div class="flex flex-col">
                <p class="text-sm font-bold">Авторы:</p>
                <ul>
                    {#each book.authors as author}
                        <li>
                            <p class="text-xs">{author.name}</p>
                        </li>
                    {/each}
                </ul>
            </div>

            <div class="flex flex-col">
                <p class="text-sm font-bold">Жанры</p>
                <ul>
                    {#each book.genres as genre}
                        <li>
                            <p class="text-xs">{genre.value}</p>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        </div>
    </div>
    <div class="flex flex-col gap-y-2 grow">
        <h2 class="card-title hidden sm:inline">
            <a href="{singleBookPage ? '' : '/books/' + book.isbn}" class="{singleBookPage ? '' : 'hover:text-accent'}">
                {book.title}
            </a>
        </h2>
        {#if !singleBookPage}
        <div class="flex">
            <p class="text-sm">Авторы:</p>
            <ul>
                {#each book.authors as author}
                    <li>
                        <p class="text-xs">{author.name}</p>
                    </li>
                {/each}
            </ul>
        </div>

        <div class="flex">
            <p class="text-sm">Жанры</p>
            <ul>
                {#each book.genres as genre}
                    <li>
                        <p class="text-xs">{genre.value}</p>
                    </li>
                {/each}
            </ul>
        </div>
        {/if}
        <div class="mt-10">
            <p>{pageType === 'main' ? book.description : (book.description.slice(0, 200) + '...')}</p>
        </div>

        {#if !singleBookPage}
        <div class="mt-auto self-end">
            <a href={'/books/' + book.isbn} class="btn btn-primary">
                Подробнее
            </a>
        </div>
        {/if}
    </div>
</div>
