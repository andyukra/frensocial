<script>
    import { onDestroy } from 'svelte';
    import { publicaciones, usuarios } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';

    let data, data2;

    const unsubscribe1 = publicaciones.subscribe(val => data = val);
    const unsubscribe2 = usuarios.subscribe(val => data2 = val);

    onDestroy(unsubscribe1, unsubscribe2);
</script>

<section>
    {#if data}
         {#each data as item}
              <TarjetaPub data={{item, avatar: data2.filter(x=>item.author === x.username)}}/>
         {/each}
    {/if}
</section>

<style lang="sass">
    section
        width: 100%
        padding: 1rem
        background: white
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        display: grid
        grid-template-columns: 1fr 1fr
        place-items: center
        gap: 1rem
        border-top-left-radius: 1.5rem
        border-top-right-radius: 1.5rem
        @media(max-width: 500px)
            grid-template-columns: 1fr
            margin-top: 3rem 0
</style>
