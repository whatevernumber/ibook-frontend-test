<script lang="ts">
    import {goto} from '$app/navigation';
    import {appendArrayToFormData, clearEmptyData} from "$lib/helpers/helpers.ts";
    import {user} from "$lib/stores/user-store";
    import {onMount} from 'svelte';

    export let book: object|null = null;
    let authors: string[];
    let genres: string[];

    $: authors = [];
    $: genres = [];

    let errors: object;
    $: errors = {};

    onMount(() => {
        if (book) {
            for (let genre of book.genres) {
                genres.push(genre.value);
            }

            genres = genres;

            for (let author of book.authors) {
                authors.push(author.name);
            }

            authors = authors;
        }
    });

    async function submitForm(evt) {
        evt.preventDefault();

        const form = document.forms.book;
        let data: FormData = new FormData(form);

        let path: string = 'add/book';
        let method: string = 'POST';

        if (book) {
            path = 'update/book?isbn=' + book.isbn ;
            method = 'PATCH';
        }

        // removes empty fields from the request
        data = clearEmptyData(data);

        // removes empty values from input arrays and adds it to form-data
        authors = authors.filter(el => el);
        genres = genres.filter(el => el);

        if (!authors.length || ! genres.length) {
            errors = {};

             if (!authors.length) {
                 authors = [''];
                 errors['authors'] = 'Укажите автора';
             }

            if (!genres.length) {
                genres = [''];
                errors['genres'] = 'Укажите жанр';
            }

            return errors;
        }

        authors.length ? data = appendArrayToFormData(authors, 'authors', data) : null;
        genres.length ? data = appendArrayToFormData(genres, 'genres', data): null;

        let response: Response = await fetch('/api/' + path, {
            method: method,
            body: data,
        })

        if (response.status === 403) {
            $user = {};
            goto('/');
        }

        const result: object = await response.json();

        if (result) {
            if (result.errors) {
                errors = result.errors;
            } else {
                goto('/books/' + result.data.isbn)
            }
        }
    }

    // Removes an Attribute
    const remove_field = function (type: string, index: number): void {
        switch (type) {
            case 'author':
                authors.splice(index, 1);
                authors = authors;
                break
            case 'genre':
                genres.splice(index, 1);
                genres = genres;
        }
    }

    // Adds new Author Attribute
    const add_new_field = function (type: string): void {
        switch (type) {
            case 'author':
                authors.push('');
                authors = authors;
                break
            case 'genre':
                genres.push('');
                genres = genres;
        }
    }

</script>

<div class="p-4 flex m-auto justify-center w-[300px] sm:w-[500px]">
    <form name="book" class="flex flex-col w-full gap-y-4">
        <label>
            <span>Название</span>
            <input type="text" name="title" value="{book?.title ?? ''}"  class="input input-bordered w-full {errors.title ? 'input-error' : ''}">
            {#if errors.title}
                <span class="text-error">{errors.title[0]}</span>
            {/if}
        </label>
        <label class="w-full">
            <span>Описание</span>
            <textarea name="description" class="textarea textarea-bordered h-24 w-full {errors.description ? 'input-error' : ''}">{book?.description ?? ''}</textarea>
            {#if errors.description}
                <span class="text-error">{errors.description[0]}</span>
            {/if}
        </label>
        <label >
            <span>ISBN</span>
            <input type="text" name="isbn" value="{book?.isbn ?? ''}" class="input input-bordered w-full {errors.isbn ? 'input-error' : ''}">
            {#if errors.isbn}
                <span class="text-error">{errors.isbn[0]}</span>
            {/if}
        </label>
        <label class="flex justify-between">
            <span>Цена</span>
            <input type="number" name="price" value="{book?.price ?? ''}" class="input input-bordered {errors.price ? 'input-error' : ''}">
            {#if errors.price}
                <span class="text-error">{errors.price[0]}</span>
            {/if}
        </label>
        <label class="flex justify-between">
            <span>Количество страниц</span>
            <input type="number" name="pages" value="{book?.pages ?? ''}" class="input input-bordered {errors.pages ? 'input-error' : ''}">
            {#if errors.pages}
                <span class="text-error">{errors.pages[0]}</span>
            {/if}
        </label>
        <label class="flex justify-between">
            <span>Год публикации</span>
            <input type="number" name="published_year" value="{book?.published_year ?? ''}" class="input input-bordered {errors.published_year ? 'input-error' : ''}">
            {#if errors.published_year}
                <span class="text-error">{errors.published_year[0]}</span>
            {/if}
        </label>
        <fieldset class="flex justify-between">
            <div class="flex gap-x-8">
                <span>Авторы</span>
                <a class="btn btn-ghost btn-sm" on:click={() => add_new_field('author')}>
                    <img src="/img/svg/plus.svg" class="w-4" alt="Иконка с плюсом">
                </a>
            </div>
            <div class="flex flex-col flex-wrap gap-y-2 justify-items-end">
                    {#each authors as author, index}
                    <div class="self-end">
                        {#if index}
                        <a class="btn btn-ghost btn-xs" on:click={() => remove_field('author', index)}>
                            <img src="/img/svg/cancel-black.svg" class="w-4" alt="Иконка с крестиком">
                        </a>
                        {/if}
                        <input type="text" bind:value={author} class="input input-bordered h-8 {errors.authors ? 'input-error' : ''}">
                    </div>
                    {/each}
                {#if errors.authors}
                    <span class="text-error">Укажите автора</span>
                {/if}
            </div>
        </fieldset>

        <fieldset class="flex justify-between">
            <div class="flex gap-x-8">
                <span>Жанры</span>
                <a class="btn btn-ghost btn-sm" on:click={() => add_new_field('genre')}>
                    <img src="/img/svg/plus.svg" class="w-4" alt="Иконка с плюсом">
                </a>
            </div>
            <div class="flex flex-col flex-wrap gap-y-2 justify-items-end">
                {#each genres as genre, index}
                    <div class="self-end">
                        {#if index}
                        <a class="btn btn-ghost btn-xs" on:click={() => remove_field('genre', index)}>
                            <img src="/img/svg/cancel-black.svg" class="w-4" alt="Иконка с крестиком">
                        </a>
                        {/if}
                        <input type="text" bind:value={genre} class="input input-bordered h-8 {errors.genres ? 'input-error' : ''}">
                    </div>
                {/each}
                {#if errors.genres}
                    <span class="text-error">Укажите жанр</span>
                {/if}
            </div>
        </fieldset>

        <button class="btn btn-primary" type="submit" on:click={submitForm}>Сохранить</button>
    </form>
</div>
