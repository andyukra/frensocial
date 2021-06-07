<script>
    import { yo, usuarios } from '$lib/store';

    let myFoto;

    $: if($usuarios.length > 0) {
        myFoto = $usuarios.filter(x=>x.username===$yo)[0]['avatar'];
    }

    const closeModalMsgs = e => {
        e.target.parentNode.style.display = 'none';
    }

    const openModalMsgs = () => {
        document.querySelector('.modalMsgs').style.display = 'grid';
    }
</script>

<div class="modalMsgs">
    <i class="fas fa-times" on:click={closeModalMsgs}></i>
    <h1>PRONTO, TENGAN PACIENCIA</h1>
</div>
<section>
    <h4>Buzón de mensajes</h4>
    <button on:click={openModalMsgs}>
        Crear Mensaje
        <i class="fa fa-plus-circle"></i>
    </button>
    <div class="msgsBox"></div>
</section>

<style lang="sass">

    .modalMsgs
        width: 100%
        height: 100%
        background: rgba(0,0,0,.7)
        position: fixed
        top: 0
        left: 0
        z-index: 1000
        backdrop-filter: blur(7px)
        display: none
        place-items: center
        h1
            color: white
        & > i
            position: absolute
            top: 1rem
            right: 1rem
            padding: 0.5rem 0.7rem
            border-radius: 50%
            cursor: pointer
            color: white
            transition: 0.4s
            &:hover
                background: rgba(255,255,255,0.4)

    section
        position: fixed
        min-height: 100vh
        width: 23%
        background: white
        right: 0
        top: 4rem
        padding: 2rem
        border-radius: 2rem
        box-shadow: 0px 4px 35px 4px rgb(0 0 0 / 10%)
        @media (max-width: 500px)
            display: none
        button
            border-radius: 1rem
            border: none
            background: #6C63FF
            padding: 0.4rem 1rem
            font-family: inherit
            color: white
            margin: 1rem auto
            cursor: pointer
        h4
            position: relative
            &::before
               content: ''
               width: 5rem
               height: 3px
               background: black
               position: absolute
               top: 110%
               border-radius: 2rem

</style>