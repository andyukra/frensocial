<script>
    import { publicaciones, usuarios, pag, seccion, uniquePubs } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import { onMount } from 'svelte';
    export let auth;
    export let profile;

    onMount(() => {
        let upPage = document.querySelector('.fa-angle-up');

        //Detect scrollThumb in bottom
        document.addEventListener('scroll', async e => {
            if(window.scrollY > window.innerHeight){
                console.log('asad')
                upPage.style.transform = 'scale(1)';
            } else {
                upPage.style.transform = 'scale(0)';
            }
            let val1 = Math.floor(window.innerHeight + window.scrollY - 64);
            let val2 = val1 + 1;
            let val3 = val1 - 15;
            let val4 = val1 - 16;
            let res;
            
            if(!profile){
                if(val1 === document.body.offsetHeight || val2 === document.body.offsetHeight){
                    res = await fetch(`/getPublications?type=${$seccion}&pag=${$pag}`);
                    if(res.ok){
                        const result = await res.json();
                        if(result.data && result.data.length > 0) {
                            publicaciones.update(val => val.concat(result.data))
                            $pag++;
                        }
                        return null;   
                    }                              
                }   
            } else {
                if(val4 === document.body.offsetHeight || val3 === document.body.offsetHeight){
                    res = await fetch(`/getPublications?key=${profile}&pag=${$pag}`);
                    if(res.ok){
                        const result = await res.json();
                        if(result.data && result.data.length > 0) {
                            uniquePubs.update(val => val.concat(result.data))
                            $pag++;
                        }
                        return null;   
                    }
                }
            }   
        });
    });

    const openModal = e => {
        let modal = document.querySelector('.modalImg');
        let imgModal = document.querySelector('.modalImg img');
        imgModal.src = e.detail.image;
        modal.style.display = 'flex';
    }

    const closeModal = e => {
        let modal = document.querySelector('.modalImg');
        modal.style.display = 'none';
    }

    const upScroll = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        });
    }
</script>

<section>
    <i class="fas fa-angle-up" on:click={upScroll}></i>
    <div class="modalImg">
        <img src="" alt="img Full Screen Modal">
        <i class="fa fa-times" on:click={closeModal}></i>
    </div>
    {#if !profile}
        {#if $publicaciones}
            {#each $publicaciones as item}
                <TarjetaPub on:openModal={openModal} data={{auth ,item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
            {/each}
        {:else}
            <Loader/>
        {/if}
    {:else}
        {#if $uniquePubs}
            {#each $uniquePubs as item}
                <TarjetaPub on:openModal={openModal} data={{auth ,item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
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
        box-shadow: 0 0 10px rgba(0,0,0,.5)
        cursor: pointer
        transform: scale(0)
        transition: 0.3s
        @media(max-width: 500)
            bottom: 3%
        &:hover
            background: darken(#6C63FF, 20%)
    section
        width: 50%
        margin: auto
        padding: 1rem
        background: white
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        border-radius: 1.5rem
        @media (max-width: 500px)
            width: auto
        .modalImg
            position: fixed
            top: 0
            left: 0
            background: rgba(0,0,0,.8)
            backdrop-filter: blur(4px)
            width: 100%
            height: 100%
            display: none
            justify-content: center
            align-items: center
            z-index: 2000
            img
                max-width: 90vw
                max-height: 90vh
            i
                position: absolute
                right: 2rem
                top: 2rem
                font-size: 1.4rem
                color: white
                cursor: pointer
                padding: 0.5rem 0.8rem
                border-radius: 100%
                transition: 0.3s
                text-shadow: 0 0 4px black
                &:hover
                    background: rgba(255,255,255,0.1)
</style>
