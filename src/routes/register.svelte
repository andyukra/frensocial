<script>
    import RegisterPanel from '$lib/components/RegisterPanel.svelte';

    const redirectToHome = () => {
        location.href = '/';
    }
</script>

<RegisterPanel on:success={redirectToHome}/>

<div class="comunity">
    <h1>SÉ PARTE DE NUESTRA COMUNIDAD</h1>
    <div class="icons">
        <i class="fas fa-user-circle"></i>
        <i class="fas fa-user-circle"></i>
        <i class="fas fa-user-circle"></i>
        <i class="fas fa-user-circle"></i>
    </div>
</div>

<style lang="sass">
    .comunity
        display: flex
        justify-content: center
        flex-direction: column
        align-items: center
        h1
            text-align: center
        .icons
            margin: 20px 0
            i
                font-size: 3rem
</style>