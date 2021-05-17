<script>
    import { publicaciones, usuarios } from "$lib/store";
    import TarjetaPub from '$lib/components/TarjetaPub.svelte';
    import Loader from '$lib/components/Loader.svelte';
    export let auth;

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
</script>

<section>
    <div class="modalImg">
        <img src="" alt="img Full Screen Modal">
        <i class="fa fa-times" on:click={closeModal}></i>
    </div>
    {#if $publicaciones}
        {#each $publicaciones as item}
            <TarjetaPub on:openModal={openModal} data={{auth ,item, avatar: $usuarios.filter(x=>item.author === x.username)[0].avatar}}/>
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
                &:hover
                    background: rgba(255,255,255,0.1)
</style>
