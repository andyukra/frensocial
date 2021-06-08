<script context="module">
    import { uniquePubs, usuarios } from "$lib/store";

    export async function load({page, session, fetch}) {

        const res = await fetch(`/getUser?key=${page.params.key}`);

        if(!res.ok) {
            return {
                status: 404
            }
        } 

        let user, publications, allUsers;

        user = await res.json();

        uniquePubs.subscribe(val => publications = val);
        usuarios.subscribe(val => allUsers = val);

        const res2 = await fetch(`/getPublications?key=${page.params.key}&pag=1`);
        const res3 = await fetch('/getUser?key=all');

        if(!res2.ok || !res3.ok) {
            return {
                status: 404
            }
        }

        publications = await res2.json();
        allUsers = await res3.json();

        uniquePubs.set(publications.data);
        usuarios.set(allUsers.usuarios); 

        if(!session.authenticated) {
            return {
                props: {auth: ![], user: user.usuario}
            }
        }

        if(page.params.key !== session.user) {
            return {
                props: {auth: ![], user: user.usuario}
            }
        }

        return {
            props: {auth: true, user: user.usuario}
        }
    }
</script>

<script>
    export let auth;
    export let user;
    import Publications from "$lib/components/Publications.svelte";

    let files;

    const changeAvatar = () => {
        if(!auth) return null;
        if(files[0].size > 5000000) {
            alert('La imágen es muy pesada');
            return null;
        }
        if(!/img|png|jpeg|gif/.test(files[0].type)) {
                alert('El Archivo debe ser una imágen');
                return null;
        }

        let form = new FormData();
        form.set('image', files[0]);

        fetch('https://api.imgbb.com/1/upload?key=579f935dc936016e8e8217246bd6d65f', {
            method: 'POST',
            body: form
        })
            .then(response => response.json())
            .then(result => {
                if(result.status === 200){
                    fetch('/changeAvatar', {
                        method: 'POST',
                        body: JSON.stringify({
                            image: result.data.display_url
                        })
                    })
                        .then(response => response.text())
                        .then(result => {
                            const {message} = JSON.parse(result);
                            if(message === 'success') {
                                location.href = location.href
                            }
                        })
                }
            })
    }
</script>

<section>
    <div class="perfil">
        <div class="imgBox">
            {#if auth}
                <input type="file" bind:files on:change={changeAvatar} id="changeAvatar" hidden>
            {/if}
            <label for="changeAvatar">
                {#if user?.avatar}
                    <img src={user.avatar} alt="Avatar Perfil">
                {:else}
                    <i class="fa fa-user-circle"></i>
                {/if}
            </label>
            <h2>{user?.username}</h2>
            <p>{user?.email}</p>
        </div>
    </div>
</section>

<h2 class="myPublicationsText">Mis publicaciones</h2>

<Publications profile={user?.username}/>

<style lang="sass">
    .myPublicationsText
        text-align: center
        margin: 1rem 0
    section
        width: 100%
        .perfil
            margin: 5rem 0
            padding: 1rem
            background: white
            box-shadow: 0 4px 32px 0 rgba(0,0,0,.1)
            .imgBox
                width: 100%
                display: flex
                flex-direction: column
                align-items: center
                justify-content: center
                position: relative
                z-index: 0
                i
                    font-size: 10rem
                    cursor: pointer
                label
                    img
                        object-fit: cover
                        width: 10rem
                        height: 10rem
                        border-radius: 50%
                        cursor: pointer
                        box-shadow: 0 2px 10px 0 rgba(0,0,0,.3)
                h2
                    margin: 1rem 0
</style>