<script>
    import { yo, usuarios, msgsChat } from '$lib/store';
    import { io } from 'socket.io-client';
    import MsgsChat from '$lib/components/MsgsChat.svelte';
    import { onMount, onDestroy } from 'svelte';

    let myFoto, socket, inputChatText, files;
    const socketServidor = 'https://frensocialchat.herokuapp.com';
    const servidorDePrueba = 'http://localhost:5000';
    let state = false;
    let loader = false;
    let movilVersion = false;
    let chatUsers = [];
    let stateChatToggle = false;
    let connectingBtn = false;

    onMount(() => {
        socket = io(socketServidor, { transports: ["websocket"], query: {user: $yo} });
        loader = true;
        connectingBtn = true;
        socket.on('connected', data => {
                chatUsers = [...data];
                state = true;
                loader = false;
                connectingBtn = false;
        });
        if(window.innerWidth < 800) movilVersion = true;
        window.addEventListener('resize', () => {
            if(window.innerWidth < 800) {
                movilVersion = true;
            } else {
                movilVersion = false;
            }
        })
    });

    onDestroy(() => {
        try {
            socket.close();
        } catch (error) {}
    });

    $: if($usuarios.length > 0) {
        myFoto = $usuarios.filter(x=>x.username===$yo)[0]['avatar'];
    }

    $: if(!socket?.connected) {
        state = false;
    }

    $: if(state) {
        socket.on('receive', data => {
            msgsChat.update(val => val.concat(data));
        });

        socket.on('updateUsers', data => {
            chatUsers = [...data];
        });

        socket.on('newUser', data => {
            chatUsers = [...data];
        });
    }

    const connectChat = () => {
        if(!state && !connectingBtn){
            connectingBtn = true;
            socket = io(socketServidor, { transports: ["websocket"], query: {user: $yo} });
            socket.on('connected', data => {
                chatUsers = [...data];
                state = true;
                loader = false;
                connectingBtn = false;
             });
            loader = true;
        } else {
            socket.close();
            state = false;
        }
    }

    const sendChatMsg = () => {
        if(/[{}|<>]/.test(inputChatText) || typeof inputChatText !== 'string' || inputChatText.length === 0 || !state || !socket.connected) return null;

        socket.emit('send', {
            user: $yo,
            avatar: myFoto,
            text: inputChatText.trim()
        });

        inputChatText = '';
    }

    const toggleChatBox = () => {
        stateChatToggle = !stateChatToggle;
        let chatBox = document.querySelector('.chatBox');
        let sendMsg = document.querySelectorAll('.sendMsg');
        chatBox.classList.toggle('responsiveChat');
        document.body.classList.toggle('bodyBlockScroll');
        sendMsg.forEach(x => {
            x.classList.toggle('dBlock2');
        });
        try {
            let chat = document.querySelector('.chat');
            chat.classList.toggle('dBlock');
        } catch (error) {}
    }

    const upImg = async () => {
        if(!files[0] || !/(jpg|png|jpeg)$/.test(files[0].type) || files[0].size > 5000000) return null;
        let form = new FormData();
        form.append('file', files[0]);
        const res = await fetch(`${socketServidor}/upImg`, {
            method: 'POST',
            body: form,

        });
        if(res.ok){
            const result = await res.text();
            inputChatText = result;
            sendChatMsg();
        }
    }
</script>

<i class="far fa-comment-alt btnToggleChat off" on:click={toggleChatBox}></i>
<section class={movilVersion ? 'chatBox responsiveChat' : 'chatBox'}>
    <div class="btnConnect">
        <h4>Mini chat</h4>
        {#if movilVersion}
            {#if stateChatToggle}
            <button on:click={connectChat}>
                {#if !state}
                    Conectar chat
                    <i class="fa fa-plus-circle"></i>
                {:else}
                    Desconectar chat
                    <i class="fa fa-minus-circle"></i>
                {/if}
            </button>
        {:else}
            <button disabled>
                {#if !state}
                    Conectar chat
                    <i class="fa fa-plus-circle"></i>
                {:else}
                    Desconectar chat
                    <i class="fa fa-minus-circle"></i>
                {/if}
            </button>
    {/if}
        {:else}
            <button on:click={connectChat}>
                {#if !state}
                    Conectar chat
                    <i class="fa fa-plus-circle"></i>
                {:else}
                    Desconectar chat
                    <i class="fa fa-minus-circle"></i>
                {/if}
            </button>
        {/if}
        {#if movilVersion}
            <i class="fas fa-angle-down btnToggleChat" on:click={toggleChatBox}></i>
        {:else}
            <i class="fas fa-angle-down btnToggleChat" style="display:none;"></i>
        {/if}
    </div>
    {#if state}
        <div class="usersList">
            <ul>
                {#each chatUsers as user}
                    <li>
                        {#if $usuarios.filter(x=>x.username===user)[0].avatar}
                            <img src={$usuarios.filter(x=>x.username===user)[0].avatar} alt="user Avatar">
                        {:else}
                            <i class="fas fa-user-circle"></i>
                        {/if}
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
    {#if state}
        <div class="chat">
            <p style="font-size: 0.8rem">Bienvenido al chat de Frensocial®, diviertete!!</p>
            {#if $msgsChat.length > 0}
                {#each $msgsChat as msg}
                    <MsgsChat data={msg}/>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="noChat">
            {#if loader}
                <p>Conectando...</p>
                <i class="fas fa-circle-notch fa-spin"></i>
            {:else}
                <p>El chat está desconectado</p>
                <i class="fas fa-unlink"></i>
            {/if}
        </div>
    {/if}
    {#if state}
        <form class="sendMsg" on:submit|preventDefault={sendChatMsg}>
            <div class="formGroup">
                <input bind:value={inputChatText} type="text" maxlength="100" placeholder="Escribe un mensaje" required>
                <input type="file" id="imgChatcito" hidden bind:files on:change={upImg}>
                <label for="imgChatcito">
                    <i class="fas fa-image"></i>
                </label>
            </div>
            <button type="submit">
                <i class="fa fa-paper-plane"></i>
            </button>
        </form>
    {:else}
        <div></div>
    {/if}
</section>

<style lang="sass">

    .off
        position: fixed
        right: 7%
        bottom: 15%
        padding: 0.8rem !important
        animation: tintin 0.7s ease-out infinite !important

    @keyframes tintin
        0%
            box-shadow: 0 0 0 #6C63FF
        100%
            box-shadow: 0 0 15px 5px #6C63FF

    .formGroup
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        background: rgba(108, 99, 255, 0.4)
        padding: 0.7rem
        border-radius: 1rem
        input
            border: none
            font-family: 'Fugaz One', cursive
            background: transparent
            &:focus
                outline: none
        i
            color: black

    .usersList
        margin-top: 0.9rem
        ul
            display: flex
            gap: 0.7rem
            width: 100%
            overflow-x: auto
            padding: 0.2rem
            li
                list-style: none
                img
                    width: 2rem
                    height: 2rem
                    box-shadow: 0 0 5px transparentize(#6C63FF, 0.5)
                    border-radius: 100%
                    cursor: pointer
                i
                    font-size: 2rem
                    box-shadow: 0 0 5px transparentize(#6C63FF, 0.5)
                    border-radius: 100%
                    cursor: pointer

    .responsiveChat
        position: absolute
        min-height: 0
        transform: scale(0)
        opacity: 0

    .btnToggleChat
        padding: 0.4rem 0.62rem
        background: #6C63FF
        border-radius: 100%
        color: white
        transition: 0.3s
        cursor: pointer
        &:hover
            box-shadow: 0 0 5px 2px transparentize(#6C63FF, 0.3)
    .noChat
        width: 100%
        height: 75vh
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        gap: 5rem
        @media (max-width: 800px)
            height: 71.5vh
        p
            font-size: 1.5rem
            text-align: center
        & > i
            font-size: 10rem
    .chat
        overflow-y: auto
        width: 100%
        height: 65vh
        background: transparentize(#6C63FF, 1)
        border-radius: 0.5rem
        display: block
        @media (max-width: 800px)
            height: 70vh
    .sendMsg
        margin-top: 0.5rem
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        gap: 1rem
        position: relative
        label
            color: white
            cursor: pointer
            &:hover
                color: #6C63FF
        button
            border: none
            border-radius: 100%
            &:focus
                outline: none
            & > i
                padding: 0.5rem
                background: #6C63FF
                border-radius: 100%
                color: white
                text-shadow: 0 0 5px rgba(0,0,0,.35)
                box-shadow: 0 0 5px 2px transparentize(#6C63FF, 0.3)
                cursor: pointer
                transition: 0.3s
                &:hover
                    background: darken(#6C63FF, 10%)
                
    section
        position: fixed
        height: 91vh
        width: 32.5%
        background: white
        z-index: 99
        right: 0
        top: 4rem
        padding: 2rem
        border-radius: 1.5rem
        box-shadow: 0px 4px 20px 1px transparentize(#6C63FF, 0.55)
        @media (max-width: 800px)
            position: fixed
            inset: 0
            z-index: 100
            width: 100%
            height: 100vh
            overflow: hidden
            padding: 0.3rem 2rem 0 2rem
            transform: scale(1)
            opacity: 1
            transition: 0.2s
        .btnConnect
            margin-top: 0.3rem
            display: flex
            align-items: center
            justify-content: space-between
            button
                border-radius: 1rem
                border: none
                background: #6C63FF
                padding: 0.4rem 1rem
                font-family: inherit
                color: white
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