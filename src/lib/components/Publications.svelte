<script>
    import { publicaciones, usuarios, seccion } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';
    import Loader from '$lib/components/Loader.svelte';

</script>

<section>
    {#if $publicaciones}
        {#each $publicaciones as item}
            <TarjetaPub data={{item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
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
