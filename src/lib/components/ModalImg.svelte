<script>
    export let imagen;
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    $: if(imagen){
        let modal = document.querySelector('.modalImg');
        let imgModal = document.querySelector('.modalImg img');
        imgModal.src = imagen;
        modal.style.display = 'flex';
    }

    const closeModal = e => {
        let modal = document.querySelector('.modalImg');
        modal.style.display = 'none';
        dispatch('closeModal');
    }
</script>

<div class="modalImg">
    <img src="" alt="img Full Screen Modal">
    <i class="fa fa-times" on:click={closeModal}></i>
</div>

<style lang="sass">

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