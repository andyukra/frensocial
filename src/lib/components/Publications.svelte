<script>
    import { onDestroy } from 'svelte';
    import { publicaciones, usuarios } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';
    import Loader from '$lib/components/Loader.svelte';
    export let user;

    let data, data2, unsubscribe1, unsubscribe2;

    if(user){
        unsubscribe1 = publicaciones.subscribe(val => data = val.filter(x => user === x.author));      
    } else {
        unsubscribe1 = publicaciones.subscribe(val => data = val);
    }
    
    unsubscribe2 = usuarios.subscribe(val => data2 = val);

    onDestroy(unsubscribe1, unsubscribe2);
</script>

<section>
    {#if data}
         {#each data as item}
            <TarjetaPub data={{item, avatar: data2.filter(x=>item.author === x.username)[0].avatar}}/>
         {/each}
    {:else}
            <Loader/>
    {/if}
</section>

<style lang="sass">
    section
        width: 50%
        margin: auto
        padding: 1rem
        background: white
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        border-radius: 1.5rem
</style>
