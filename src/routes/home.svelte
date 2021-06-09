<script context="module">
    import { publicaciones, usuarios, yo } from "$lib/store";

    export async function load({session, fetch}) {
        if(!session.authenticated) {
            return {
                status: 302,
                redirect: '/unautorhized'
            }
        }

        let pub, usr;

        publicaciones.subscribe(val => pub = val);
        usuarios.subscribe(val => usr = val);
        yo.set(session.user);

        if(!pub || !usr) {
            const res = await fetch('/getPublications?pag=1&type=todo');
        
            if(res.ok) {
                const result = await res.json();
                publicaciones.set(result.data);
                const res2 = await fetch('/getUser?key=all');
                if(res2.ok) {
                    const result2 = await res2.json();
                    usuarios.set(result2.usuarios);
                }               
            } else {
                    return {
                        status: 409
                    }
                }
        }
        return {
            status: 200,
            props: {auth: session.authenticated}
        }
    }

</script>

<script>
    import Publications from '$lib/components/Publications.svelte';
    import Sections from "$lib/components/Sections.svelte";
    import Chat from "$lib/components/Chat.svelte";
    export let auth;

    const getAndSetPubsType = async e => {
        const type = e.detail.key;
        const res = await fetch(`/getPublications?type=${type}&pag=1`);
        if(res.ok){
            publicaciones.set(0);
            const result = await res.json();
            publicaciones.set(result.data);
        }
    }
</script>

<div class="home">
    <Sections on:section={getAndSetPubsType}/>
    <Publications auth={auth}/>
    <Chat />
</div>

<style lang="sass">
    .home
        margin-top: 4rem
</style>