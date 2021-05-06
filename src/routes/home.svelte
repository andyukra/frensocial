<script context="module">
    import { publicaciones, usuarios } from "$lib/store";

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

        if(!pub) {
            const res = await fetch('/getPublications?key=all');
        
            if(res.ok) {
                const result = await res.json();
                publicaciones.set(result.data);
                const res2 = await fetch('/getUser?key=all');
                if(res2.ok) {
                    const result2 = await res2.json();
                    usuarios.set(result2.usuarios);
                }
                    return {
                        status: 200
                    }
                } else {
                    return {
                        status: 409
                    }
            }
        }
        return {
            status: 200
        }
    }

</script>

<script>
    import Publications from '$lib/components/Publications.svelte';
    import Sections from "$lib/components/Sections.svelte";

</script>

<div class="home">
    <Sections/>
    <Publications />
</div>

<style lang="sass">
    .home
        margin-top: 4rem
</style>