<script>
    import { yo, usuarios, msgsChat } from '$lib/store';
    import { io } from 'socket.io-client';
    import MsgsChat from '$lib/components/MsgsChat.svelte';
    import { onMount } from 'svelte';

    let myFoto, socket, inputChatText;
    const socketServidor = 'https://frensocialchat.herokuapp.com';
    let state = false;
    let loader = false;
    let movilVersion = false;

    onMount(() => {
        if(window.innerWidth < 800) movilVersion = true;
        window.addEventListener('resize', () => {
            if(window.innerWidth < 800) {
                movilVersion = true;
            } else {
                movilVersion = false;
            }
        })
    });

    $: if($usuarios.length > 0) {
        myFoto = $usuarios.filter(x=>x.username===$yo)[0]['avatar'];
    }

    $: if(!socket?.connected) {
        state = false;
    }

    $: try {
        socket.on('connected', () => {
            state = true;
            loader = false;
        });

        socket.on('receive', data => {
            msgsChat.update(val => val.concat(data));
        });
    } catch (error) {
        
    }

    const connectChat = () => {
        if(!state){
            socket = io(socketServidor, { transports: ["websocket"] });
            loader = true;
        } else {
            socket.close();
            state = false;
        }
    }

    const sendChatMsg = () => {
        if(/[&{}|<>]/.test(inputChatText) || typeof inputChatText !== 'string' || inputChatText.length === 0 || !state || !socket.connected) return null;

        socket.emit('send', {
            user: $yo,
            avatar: myFoto,
            text: inputChatText
        });

        inputChatText = '';
    }

    const toggleChatBox = () => {
        let chatBox = document.querySelector('.chatBox');
        chatBox.classList.toggle('responsiveChat');
    }
</script>

<section class={movilVersion ? 'chatBox responsiveChat' : 'chatBox'}>
    <div class="btnConnect">
        <h4>Mini chat</h4>
        <button on:click={connectChat}>
            {#if !state}
                Conectar chat
                <i class="fa fa-plus-circle"></i>
            {:else}
                Desconectar chat
                <i class="fa fa-minus-circle"></i>
            {/if}
        </button>
        {#if movilVersion}
            <i class="fas fa-angle-down btnToggleChat" on:click={toggleChatBox}></i>
        {:else}
            <i class="fas fa-angle-down btnToggleChat" style="display:none;"></i>
        {/if}
    </div>
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
            <input bind:value={inputChatText} type="text" maxlength="100" placeholder="Escribe un mensaje" required>
            <button type="submit">
                <i class="fa fa-paper-plane"></i>
            </button>
        </form>
    {:else}
        <div class="sendMsg">
            <input type="text" maxlength="50" placeholder="Escribe un mensaje" required disabled>
            <button disabled>
                <i class="fa fa-paper-plane"></i>
            </button>
        </div>
    {/if}
</section>

<style lang="sass">

    .responsiveChat
        position: absolute
        min-height: 0

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
        p
            font-size: 1.5rem
            text-align: center
        & > i
            font-size: 10rem
    .chat
        overflow-y: auto
        width: 100%
        height: 75vh
        background: transparentize(#6C63FF, 1)
        margin-top: 0.5rem
        border-radius: 0.5rem
        padding: 0.7rem

    .sendMsg
        margin-top: 0.5rem
        width: 100%
        display: flex
        align-items: center
        justify-content: space-between
        gap: 1rem
        input
            width: 100%
            padding: 0.5rem
            border-radius: 0.5rem
            border: none
            background: transparentize(#6C63FF, 0.6)
            font-family: 'Fugaz One', cursive
            &:focus
                outline: none
        button
            border: none
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
        min-height: 100vh
        width: 32.5%
        background: white
        z-index: 99
        right: 0
        top: 4rem
        padding: 2rem
        border-radius: 1.5rem
        box-shadow: 0px 4px 35px 4px transparentize(#6C63FF, 0.55)
        @media (max-width: 800px)
            position: fixed
            top: 4rem
            width: 100%
            min-height: 100vh
            height: 7vh
            overflow: hidden
            padding: 0.3rem 2rem 0 2rem
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