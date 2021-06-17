<script>
    import { publicaciones, usuarios, seccion, uniquePubs, pag } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import ModalImg from '$lib/components/ModalImg.svelte';
    import { onMount } from 'svelte';

    export let auth;
    export let profile;
    export let place;

    let state = true;
    let imagen = '';

    onMount(() => {
        let upPage = document.querySelector('.fa-angle-up');

        //Detect scrollThumb in bottom
        document.addEventListener('scroll', async e => {
            if(window.scrollY > window.innerHeight){
                upPage.style.transform = 'scale(1)';
            } else {
                upPage.style.transform = 'scale(0)';
            }
            let val1 = Math.floor(window.innerHeight + window.scrollY);
            let res;
            
            if(!profile){
                if(val1 === document.querySelector('html').offsetHeight || ((val1 + 1) === document.querySelector('html').offsetHeight)){
                    if(!state){
                        return null;
                    }
                    state = false;
                    res = await fetch(`/getPublications?type=${$seccion}&pag=${$pag}`);
                    if(res.ok){
                        const result = await res.json();
                        if(result.data && result.data.length > 0) {
                            publicaciones.update(val => val.concat(result.data))
                            $pag++;
                            setTimeout(()=>state=true, 3000)
                        }
                        return null;   
                    }                              
                }   
            } else {
                if(val1 === document.querySelector('html').offsetHeight || ((val1 + 1) === document.querySelector('html').offsetHeight)){
                    if(!state){
                        return null;
                    }
                    state = false;
                    res = await fetch(`/getPublications?key=${profile}&pag=${$pag}`);
                    if(res.ok){
                        const result = await res.json();
                        if(result.data && result.data.length > 0) {
                            uniquePubs.update(val => val.concat(result.data))
                            $pag++;
                            setTimeout(()=>state=true, 3000)
                        }
                        return null;   
                    }
                }
            }   
        });
    });

    const upScroll = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }
</script>

<section style={(profile || place) ? 'margin: auto;' : 'margin-left: 16%;'}>
    <i class="fas fa-angle-up" on:click={upScroll}></i>
    <ModalImg imagen={imagen} on:closeModal={()=>imagen=''}/>
    {#if !profile}
        {#if $publicaciones}
            {#each $publicaciones as item}
                <TarjetaPub on:openModal={e=>imagen=e.detail.image} data={{auth ,item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
            {/each}
        {:else}
            <Loader/>
        {/if}
    {:else}
        {#if $uniquePubs}
            {#each $uniquePubs as item}
                <TarjetaPub on:openModal={e=>imagen=e.detail.image} data={{auth ,item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
            {/each}
        {:else}
            <Loader/>
        {/if}
    {/if}
</section>

<style lang="sass">
    .fa-angle-up
        position: fixed
        bottom: 10%
        right: 7%
        padding: 0.8rem 1rem
        background: #6C63FF
        border-radius: 100%
        color: white
        box-shadow: 0 0 10px transparentize(#6C63FF, 0.55)
        cursor: pointer
        transform: scale(0)
        transition: 0.3s
        z-index: 98
        @media(max-width: 500px)
            bottom: 3%
        &:hover
            background: darken(#6C63FF, 20%)
    section
        width: 50%
        padding: 1rem
        background: white
        box-shadow: 0px 4px 20px 1px transparentize(#6C63FF, 0.55)
        border-radius: 1.5rem
        @media (max-width: 800px)
            width: 100%
            margin-left: 0 !important
            margin-top: 4rem
</style>
