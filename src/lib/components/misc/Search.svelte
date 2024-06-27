<script lang="ts">
    import {goto} from '$app/navigation';

    export let books: object;
    export let genre: string;
    export let text: string;
    export let type: string = 'main';

    const search = async (evt): Promise<void> => {
        evt.preventDefault();

        if (type === 'main') {

            let query: string = '?';

            query += genre ? ('genre=' + genre + '&') : '';
            query += text ? ('text=' + text) : '';

            const response: Response = await fetch('/api/books' + query, {
                method: 'GET',
            });

            if (response.ok) {
                const result: object = await response.json();
                books = result.data;
            } else {
                books = {};
            }
        }

        if (type === 'header') {
            goto('/?text=' + text)
        }
    }
</script>

<search>
    <form>
        <input type="search" id="movie" placeholder="Найти книгу" bind:value={text} class="input input-bordered input-warning mr-1" />
        <button class="btn btn-primary btn-square sm:btn-md" on:click={search} type="submit">Найти</button>
    </form>
</search>