<script lang="ts">
    import {goto} from '$app/navigation';
    import {clearEmptyData} from "../../helpers/helpers";
    import {user} from "$lib/stores/user-store";

    export let editedUser: object|null = null;

    let errors: object;
    $: errors = {}

    async function submitForm(evt: Event) {
        evt.preventDefault();

        const form: HTMLFormElement = document.forms.userForm;
        let data: FormData = new FormData(form);

        // removes empty fields from the request
        data = clearEmptyData(data);

        // if new password is presented, but the old wasn't given
        if (editedUser && (data.get('password') && !data.get('old_password') || data.get('password_confirmation') && !data.get('old_password'))) {
            return errors = {
                'old_password': {
                    0 : 'Ввведите старый пароль',
                }
            }
        }

        let path = 'user/register';
        let method = 'POST';

        if (editedUser) {
            path = 'update/user?id=' + editedUser.id ;
            method = 'PATCH';
        }

        let response = await fetch('/api/' + path, {
            method: method,
            body: data,
        })

        if (response.status === 403) {
            $user = {};
            goto('/');
        }

        const result = await response.json();

        if (result) {
            if (result.errors) {
                errors = result.errors;
                console.log(result);
            } else {
                if (editedUser) {
                    goto('/user/' + result.data.id)
                } else {
                    goto('/?login=1')
                }
            }
        }
    }
</script>

<div class="p-4 flex m-auto justify-center w-[300px] sm:w-[500px]">
    <form name="userForm" class="flex flex-col w-full gap-y-4">
        <label class="w-full">
            <span>Имя</span>
            <input type="text" name="name" value="{editedUser?.name ?? ''}" required class="input input-bordered w-full {errors.name ? 'input-error' : ''}">
            {#if errors.name}
                <span class="text-sm text-error">{errors.name[0]}</span>
            {/if}
        </label>
        <label>
            <span>Почта</span>
            <input type="email" name="email" value="{editedUser?.email ?? ''}" required class="input input-bordered w-full {errors.email ? 'input-error' : ''}">
            {#if errors.email}
                <span class="text-sm text-error">{errors.email[0]}</span>
            {/if}
        </label>
        <label>
            <span>Дата рождения</span>
            <input type="date" name="birthday" value="{editedUser?.birthday ?? ''}" class="input input-bordered w-full {errors.birthday ? 'input-error' : ''}">
            {#if errors.birthday}
                <span class="text-sm text-error">{errors.birthday[0]}</span>
            {/if}
        </label>
        {#if editedUser}
        <label>
            <span>Старый пароль</span>
            <input type="password" name="old_password" class="input input-bordered w-full {errors.old_password ? 'input-error' : ''}">
            {#if errors.old_password}
                <span class="text-sm text-error">{errors.old_password[0]}</span>
            {/if}
        </label>
        {/if}
        <label>
            <span>{editedUser ? 'Пароль' : 'Новый пароль'}</span>
            <input type="password" name="password" class="input input-bordered w-full {errors.password ? 'input-error' : ''}">
            {#if errors.password}
                {#each errors.password as error}
                    <p class="text-sm text-error">{error}</p>
                {/each}
            {/if}
        </label>
        <label>
            <span>Повторить пароль</span>
            <input type="password" name="password_confirmation" class="input input-bordered w-full {errors.password_confirmation ? 'input-error' : ''}">
            {#if errors.password_confirmation}
                <span class="text-sm text-error">{errors.password_confirmation[0]}</span>
            {/if}
        </label>
        <button class="btn btn-primary" type="submit" on:click={submitForm}>Сохранить</button>
    </form>
</div>