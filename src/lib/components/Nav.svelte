<script>
    export let data;
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';
    import { usuarios } from '$lib/store';

    const {auth} = data;
    const {user} = data;
    let allUsers, searchResult, descrip, type, files;

    let unsubscribe = usuarios.subscribe(val => allUsers = val);

    onDestroy(unsubscribe);

    onMount(() => {
        const searchBoxs = document.querySelectorAll('.searchBoxs');
        const boxsUsers = document.querySelectorAll('.boxUsers');
        const closeMenu = document.querySelector('.closeMenu');
        const menuPhoneScreen = document.querySelector('.menuPhoneScreen');
        const menuPhone = document.querySelector('.menuPhone');
        try {
            const postModal = document.querySelector('.postModal');
            const closeModal = document.querySelector('.closeModal');
            const postBtn = document.querySelectorAll('.postBtn');
            const imgUp = document.querySelector('#imgUp');

            postBtn.forEach(x => {
                x.addEventListener('click', () => {
                    postModal.style.display = 'block';
                });
            })
            closeModal.addEventListener('click', () => {
                postModal.style.display = 'none';
            });
            imgUp.addEventListener('change', e => {
                document.querySelector('.fa-image').style.color = '#6C63FF';
            });
        } catch (error) {
            
        }
        closeMenu.addEventListener('click', () => {
            menuPhoneScreen.style.left = '-100vw';
        });
        menuPhone.addEventListener('click', () => {
            menuPhoneScreen.style.left = '0';
        })
        searchBoxs.forEach(x => {
            x.addEventListener('keyup', () => {
                if(x.value.length === 0) {
                    boxsUsers.forEach(x => x.style.display = 'none');
                    return null;
                } else {
                    let regExp = new RegExp(x.value, 'gi');
                    searchResult = allUsers.filter(x => regExp.test(x.username));
                    if(!searchResult || searchResult.length === 0) {
                        return null;
                    }
                    boxsUsers.forEach(x => x.style.display = 'block');
                }
            });
            x.addEventListener('focusout', e => {
                setTimeout(()=>boxsUsers.forEach(x => x.style.display = 'none'), 500);
            });
            x.addEventListener('focus', () => {
                if(x.value.length === 0) return null;
                boxsUsers.forEach(x => x.style.display = 'block');
            });
        });
    });

    const closeSession = () => {
        document.cookie = 'sessionID=;expires=Thu, 01 Jan 1970 00:00:01 GMT';
        location.href = '/';
    }

    const createPost = async () => {
        if(!descrip || descrip.length > 250 || !type){
            alert('Error en el envío');
            return null;
        }
        if(files){
            if(!/png$|jpg$|jpeg$/.test(files[0].type)){
                alert('El archivo debe ser una imágen');
            return null;
            }
            if(files[0].size >= 5000000){
                alert('La imágen es demasiado pesada: max 5mb');
                return null;
            }
            
            let form = new FormData();
            form.set('image', files[0]);

            const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMG_API}`, {
                method: 'POST',
                body: form
            });

            if(res.status === 200){
                const result = await res.json();
                const res2 = await fetch('/publish', {
                    method: 'POST',
                    body: JSON.stringify({
                        image: result.data.url,
                        thumb: result.data.thumb.url,
                        description: descrip.trim(),
                        type
                    })
                });
                if(res2.ok){
                    const result2 = await res2.text();
                    const {message} = JSON.parse(result2);
                    if(message === 'success') {
                        location.href = '/home';
                    }
                }
            }
        } else {
            const res2 = await fetch('/publish', {
                method: 'POST',
                body: JSON.stringify({
                    description: descrip.trim(),
                    type
            })
            });
            if(res2.ok){
                const result2 = await res2.text();
                const {message} = JSON.parse(result2);
                if(message === 'success') {
                    location.href = '/home';
                }
            }
        }
    }

    const openUserMenuToggle = e => {
        document.querySelector('.userMenuToggle').classList.toggle('desactive');
    }
</script>

{#if user || auth}
    <div class="postModal">
        <div class="contentModal">
            <i class="fas fa-times-circle closeModal"></i>
            <form on:submit|preventDefault={createPost}>
                <div class="msgSender">
                    {#if allUsers}
                        <img src={allUsers.filter(x=>x.username===user)[0]['avatar']} alt="My Avatar">
                    {:else}
                        <i class="fas fa-user-circle"></i>
                    {/if}
                    <textarea required rows="3" maxlength="250" placeholder="Escribe algo..." bind:value={descrip}></textarea>
                </div>
                <div class="postOpts">
                    <div class="separeBox">
                        <input id="imgUp" type="file" hidden accept="image/*" bind:files>
                        <label for="imgUp">
                            <i class="fas fa-image"></i>
                        </label>
                        <div class="sectionChoice">
                            <p>Sección : </p>
                            <select bind:value={type}>
                                <option value="todo" selected>De todo</option>
                                <option value="musica">Música</option>
                                <option value="politica">Política</option>
                                <option value="chismes">Chismes</option>
                                <option value="quejas">Quejas</option>
                                <option value="memes">Peleas</option>
                                <option value="chistes">Chistes</option>
                            </select>
                        </div>
                    </div>
                    <button>Publicar</button>
                </div>
            </form>
        </div>
    </div>
{/if}
<nav>
    <a href="/">
        <h2>Frensocial</h2>
    </a>
    <i class="fas fa-bars menuPhone"></i>
    <div class="menuPhoneScreen">
        <i class="fas fa-times closeMenu"></i>
        <div class="searchBox">
            <input class="searchBoxs" type="search" maxlength="25" placeholder="Buscar...">
            <i class="fas fa-search"></i>
            <div class="boxUsers">
                {#if searchResult}
                    {#each searchResult as user}
                         <article class="userSearchBox" on:click={() => goto(`/perfil/${user.username}`)}>
                             {#if user.avatar}
                                <img src={user.avatar} alt={user.username}>
                                <p>{user.username}</p>
                             {:else}
                                <i class="fas fa-user-circle"></i>
                                <p class="bugged">{user.username}</p>
                             {/if}
                             
                         </article>
                    {/each}
                {/if}
            </div>
        </div>
        {#if auth && user}
            <div class="navOptsPhone">
                <button class="postBtn">
                    <p>Crear</p>
                    <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </button>
                <div class="userMenu" on:click={()=>goto(`/perfil/${user}`)}>
                    {#if allUsers && allUsers.filter(x=>x.username===user)[0]['avatar']}
                        <img src={allUsers.filter(x=>x.username===user)[0]['avatar']} alt="My Avatar">
                    {:else}
                        <i class="fas fa-user-circle"></i>
                    {/if}
                    <p>{user}</p>
                </div>
                <div class="closeSession" on:click={closeSession}>
                    <i class="fas fa-power-off"></i>
                    <p>Cerrar sessión</p>
                </div>
            </div>
        {/if}
    </div>
    <div class="navOpts">
        <div class="searchBox">
            <input class="searchBoxs" type="search" maxlength="25" placeholder="Buscar...">
            <i class="fas fa-search"></i>
            <div class="boxUsers">
                {#if searchResult}
                    {#each searchResult as user}
                         <article class="userSearchBox" on:click={() => goto(`/perfil/${user.username}`)}>
                             {#if user.avatar}
                                <img src={user.avatar} alt={user.username}>
                                <p>{user.username}</p>
                             {:else}
                                <i class="fas fa-user-circle"></i>
                                <p class="bugged">{user.username}</p>
                             {/if}                            
                         </article>
                    {/each}
                {/if}
            </div>
        </div>
        {#if auth && user}
            <button class="postBtn">
                <p>Crear</p>
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
            </button>
            <div class="userMenu" on:click={openUserMenuToggle}>
                {#if allUsers && allUsers.filter(x=>x.username===user)[0]['avatar']}
                    <img src={allUsers.filter(x=>x.username===user)[0]['avatar']} alt="My Avatar">
                {:else}
                    <i class="fas fa-user-circle"></i>
                {/if}
                <p>{user}</p>
                <ul class="userMenuToggle desactive">
                    <li on:click={()=>goto(`/perfil/${user}`)}>
                        <i class="fas fa-user"></i>
                        <p>Ir a mi perfil</p>
                    </li>
                    <li on:click={closeSession}>
                        <i class="fas fa-power-off"></i>
                        <p>Cerrar sessión</p>
                    </li>
                </ul>
            </div>
        {/if}
    </div>
</nav>

<style lang="sass">
    .desactive
        display: none !important
    .userMenuToggle
        position: absolute
        top: 130%
        left: -10%
        width: 150%
        padding: 0.5rem 0rem
        background: white
        border-radius: 1rem
        box-shadow: 0 4px 1px rgba(0,0,0,.3)
        display: flex
        flex-direction: column
        gap: 0.5rem
        li
            list-style: none
            display: flex
            justify-content: center
            align-items: center
            gap: 0.5rem
            font-size: 0.8rem
            color: black
            padding: 0.3rem 0
            transition: 0.3s
            width: 100%
            &:nth-child(1)
                margin-top: 0.5rem
            &:nth-child(2):hover
                color: red
            &:hover
                background: rgba(0,0,0,.1)
            i
                font-size: 0.8rem
    .closeSession
        display: flex
        gap: 1rem
        padding: 1rem
        cursor: pointer
        border-radius: 2rem
        &:hover
            background: lighten(green, 55%)
            color: red
    .navOptsPhone
        display: flex
        flex-direction: column
        gap: 2rem
    .postBtn
        display: flex
        padding: 0.3rem 0.5rem
        gap: 0.5rem
        border: none
        background: #6C63FF
        color: white
        font-family: inherit
        border-radius: 2rem
        align-items: center
        box-shadow: 0 2px 5px 0 rgba(0,0,0,.4)
        cursor: pointer
    .userMenu
        display: flex
        gap: 0.5rem
        align-items: center
        cursor: pointer
        position: relative
        i
            font-size: 2rem
        img
            width: 2rem
            height: 2rem
            border-radius: 100%
            object-fit: cover
    .menuPhoneScreen
        width: 100vw
        height: 100vh
        background: white
        position: absolute
        top: 0
        left: -150vw
        z-index: 1500
        transition: 0.5s
        display: flex
        justify-content: center
        align-items: center
        flex-direction: column
        gap: 2rem
        & > i
            position: absolute
            right: 1.4rem
            top: 1.4rem
            font-size: 1.7rem
            padding: 0.4rem 0.7rem
            border-radius: 100%
            color: black
            transition: 0.23s
            cursor: pointer
            &:hover
                background: rgba(0,0,0,.4)
    .menuPhone
        cursor: pointer
        padding: 0.7rem
        border-radius: 100%
        transition: 0.23s ease-in
        &:hover
            background: rgba(90,70,250,.3)
        @media (min-width: 720px)
            display: none
    .postModal
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(0,0,0,.7)
        backdrop-filter: blur(7px)
        z-index: 1001
        display: none
        .contentModal
            width: 100%
            height: 100%
            display: flex
            justify-content: center
            align-items: center
            position: relative
            & > i
                position: absolute
                right: 3rem
                top: 3rem
                color: white
                font-size: 2rem
                cursor: pointer   
            form
                padding: 1.5rem
                border-radius: 2.5rem
                background: white
                box-shadow: 0 4px 15px 0 rgba(0,0,0,.2)
                width: 50%           
                @media (max-width: 720px)
                    width: 95%        
                .postOpts
                    display: flex
                    align-items: center
                    justify-content: space-between
                    margin-top: 2rem
                    padding: 0 1rem
                    button
                        padding: 0.5rem 1.5rem
                        background: #6C63FF
                        font-family: inherit
                        border-radius: 2rem
                        box-shadow: 0 4px 4px 0 rgba(0,0,0,.25)
                        border: none
                        color: white
                        cursor: pointer
                        transition: 0.3s
                        transform: scale(1)
                        &:hover
                            transform: scale(1.1) rotateZ(-5deg)
                            background: black
                    .separeBox
                        display: flex
                        gap: 2rem
                        align-items: center
                        i
                            font-size: 2rem
                            cursor: pointer
                        .sectionChoice
                            display: flex
                            gap: 1rem
                            align-items: center
                            p
                                @media (max-width: 850px)
                                    display: none
                            select
                                padding: 0.3rem 0.7rem
                                border: none
                                background: #E8F9FF
                                color: #777
                                font-family: inherit
                                cursor: pointer
                                box-shadow: 0 4px 11px 1px rgba(0,0,0,.2)
                                border-radius: 0.5rem

                .msgSender
                        display: flex
                        justify-content: center
                        align-items: center
                        gap: 1rem
                        width: 100%
                        img
                            width: 4rem
                            height: 4rem
                            object-fit: cover
                            border-radius: 100%
                            box-shadow: 0 0 5px 1px rgba(0,0,0,.5)
                        & > i
                            font-size: 4rem
                        textarea
                            resize: none
                            border-radius: 1rem
                            padding: 0.8rem
                            background: #E8F9FF
                            border: none
                            box-shadow: 0 4px 4px 0 rgba(0,0,0,.25)
                            font-family: inherit
                            width: 100%
                            overflow-y: auto
                            &:focus
                                outline: none
    nav
        position: fixed
        top: 0
        width: 100%
        padding: 0.5rem 3rem
        background: white
        border-bottom-left-radius: 20px
        border-bottom-right-radius: 20px
        display: flex
        justify-content: space-between
        align-items: center
        box-shadow: 0px 4px 26px -15px rgba(0, 0, 0, .17)
        z-index: 100
        a
            text-decoration: none
            color: black
            font-size: 0.8rem
        .navOpts
            display: flex
            align-items: center
            gap: 1.2rem
            @media (max-width: 720px)
                display: none
.searchBox
    display: flex
    position: relative
    max-height: 2rem
    .boxUsers
        display: none
        position: absolute
        z-index: 500
        top: 170%
        left: -50%
        width: 150%
        height: 15rem
        overflow-x: hidden
        overflow-y: auto
        background: white
        box-shadow: 0 4px 0 0 rgba(0,0,0,.1)
        border-radius: 0.4rem
        padding: 1rem
        article
            display: flex
            width: 100%
            margin-bottom: 1rem
            align-items: center
            gap: 1rem
            position: relative
            cursor: pointer
            transition: 0.4s
            padding: 0 0.5rem
            border-radius: 2rem
            height: 3rem
            &:hover
                background: rgba(0,0,0,.1)
            i
                font-size: 2rem
                color: black
            img
                width: 2rem
                height: 2rem
                object-fit: cover
                border-radius: 100%
            .bugged
                margin-left: 3rem
    [type=search]
        border: none
        border-bottom: 2px solid #6C63FF
        padding-left: 1.1rem
        padding-bottom: 3px
        font-family: inherit
        font-size: 0.8rem
        &:focus
            outline: none
    i
        color: #7a7a7a
        font-size: 0.8rem
        position: absolute

</style>