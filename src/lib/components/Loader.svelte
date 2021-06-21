<div class="loader">
    <h2>Por favor espere...</h2>
    <i class="fas fa-cog fa-spin"></i>
</div>

<style lang="sass">
    .loader
        position: fixed
        width: 100vw
        height: 100vh
        top: 0
        left: 0
        z-index: 1001
        background: rgba(0,0,0,.8)
        backdrop-filter: blur(7px)
        display: flex
        justify-content: center
        align-items: center
        color: white
        flex-direction: column
        i
            font-size: 5rem
            margin-top: 2rem
</style>