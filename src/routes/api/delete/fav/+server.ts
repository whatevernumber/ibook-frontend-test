import {_SERVER} from '$env/static/private';
import {error} from '@sveltejs/kit';

export async function DELETE({url, cookies}) {

    const isbn: string|null = url.searchParams.get('isbn');

    if (!isbn) {
        error(400);
    }

    if (!cookies.get('bearer')) {
        error(403);
    }

    const response: Response = await fetch(_SERVER + '/favourites/' + isbn, {
        method: 'DELETE',
        headers: {
            accept: 'application/json',
            authorization: cookies.get('bearer')
        },
    });

    if (response.status === 401) {
        cookies.delete('bearer', { path: '/' });
        error(403);
    }

    if (response.status === 204) {
        return new Response(null, {
            status: 204,
        })
    } else {
        return new Response(null, {
            status: 400,
        })
    }
}