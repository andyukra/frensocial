<aside>
    <h4>Secciones</h4>
    <div class="card">
        <img src="/todo.png" alt="imagen de todo">
        De todo
    </div>
    <div class="card">
        <img src="/musica.jpg" alt="imagen de música">
        Música
    </div>
    <div class="card">
        <img src="/politica.jpg" alt="imagen de política">
        Política
    </div>
    <div class="card">
        <img src="/chismes.jpg" alt="imagen de chismes">
        Chismes
    </div>
    <div class="card">
        <img src="/peleas.jpg" alt="imagen de peleas">
        Peleas
    </div>
    <div class="card">
        <img src="/chistes.jpg" alt="imagen de chistes">
        Chistes
    </div>
</aside>

<style lang="sass">

    aside
        position: fixed
        background: white
        margin-right: 1rem
        border-radius: 1.5rem
        padding: 1rem
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        width: 20%
        min-height: 100vh
        h4
            margin: 0.5rem 0 2rem 0
            position: relative
            &::before
                content: ''
                width: 20%
                height: 4px
                background: black
                position: absolute
                top: 110%
                border-radius: 4rem
        .card
            padding: 1rem 0.5rem
            display: flex
            align-items: center
            gap: 1rem
            border-radius: 1rem
            margin: 0.8rem 0
            box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
            cursor: pointer
            transition: 0.2s
            transform: scale(1)
            &:hover
                background: #F0EFFF
                transform: scale(1.04)
            img
                width: 3rem
                height: 3rem
                border-radius: 1.5rem
                box-shadow: 0 0 5px 0 rgba(0,0,0,.3)

</style>