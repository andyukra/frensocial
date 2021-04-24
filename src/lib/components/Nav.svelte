<script>
    export let data;
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    const {auth} = data;
    const {user} = data;

    onMount(() => {
        const menuIcon = document.querySelector('.fa-bars');
        const sideNav = document.querySelector('#sideNav');
        const closeMenu = document.querySelector('.fa-times');
        const menuItems = document.querySelectorAll('#sideNav ul li');
        menuIcon.addEventListener('click', e=> {
            sideNav.style.right = '0';
        });
        closeMenu.addEventListener('click', e=> {
            sideNav.style.right = '-150vw';
        });
        menuItems.forEach(x => {
            x.addEventListener('click', e=> {
                sideNav.style.right = '-150vw';
            });
        });
    });

    const closeSession = () => {
        document.cookie = 'sessionID=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
        location.href = '/';
    }
</script>

<nav>
    <div id="sideNav">
        <i class="fa fa-times" aria-hidden="true"></i>
        <ul>
            {#if auth}
                <li on:click={closeSession}>
                    <i class="fas fa-sign-out-alt"></i>
                    <p>Cerrar sesión</p>
                </li>
                <li on:click={() => goto(`/perfil/${user}`)}>
                    <i class="fa fa-user-circle"></i>
                    <p>Perfil</p>
                </li>
            {/if}
            <li>
                <i class="fas fa-exclamation-circle"></i>
                <p>Acerca de</p>
            </li>
        </ul>
    </div>
    <a href="/">
        <h2>Frensocial</h2>
    </a>
    <i class="fas fa-bars"></i>
</nav>

<style lang="sass">
    nav
        width: 100%
        padding: 5px 20px
        background: white
        border-bottom-left-radius: 20px
        border-bottom-right-radius: 20px
        display: flex
        justify-content: space-between
        align-items: center
        box-shadow: 0px 4px 26px -15px rgba(0, 0, 0, .17)
        @media(max-width: 800px)
            width: 100%
        a
            text-decoration: none
            color: black
            h2
                font-size: 1.2rem
                cursor: pointer
        i
            font-size: 1.3rem
            width: 40px
            height: 40px
            border-radius: 50%
            transition: 0.5s
            display: flex
            align-items: center
            justify-content: center
            cursor: pointer
            &:hover
                background: rgba(0,0,0,.1)
        #sideNav
            position: fixed
            z-index: 10
            top: 0
            right: -150vw
            width: 100vw
            height: 100vh
            background: white
            display: flex
            justify-content: center
            align-items: center
            transition: 0.5s
            .fa-times
                position: absolute
                right: 2rem
                top: 2rem
                cursor: pointer
            ul
                li
                    display: flex
                    align-items: center
                    cursor: pointer
</style>