<div class="loader">
    <h2>Por favor espere...</h2>
    <i class="fas fa-cog fa-spin"></i>
</div>

<style lang="sass">
    .loader
        position: fixed
        width: 100%
        height: 100%
        top: 0
        left: 0
        z-index: 700
        background: rgba(0,0,0,.9)
        backdrop-filter: blur(5px)
        display: flex
        justify-content: center
        align-items: center
        color: white
        flex-direction: column
        i
            font-size: 5rem
            margin-top: 2rem
</style>