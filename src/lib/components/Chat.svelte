<script>
    import { yo, usuarios, msgsChat } from '$lib/store';
    import { io } from 'socket.io-client';
    import MsgsChat from '$lib/components/MsgsChat.svelte';

    let myFoto, socket, inputChatText;
    const socketServidor = 'https://frensocialchat.herokuapp.com';
    let state = false;

    $: if($usuarios.length > 0) {
        myFoto = $usuarios.filter(x=>x.username===$yo)[0]['avatar'];
    }

    $: if(!socket?.connected) {
        state = false;
        console.log('DESCONECTADO');
    }

    $: try {
        socket.on('connected', () => {
            state = true;
            console.log('CONECTADO');
        });

        socket.on('receive', data => {
            msgsChat.update(val => val.concat(data));
        });
    } catch (error) {
        
    }

    const connectChat = () => {
        if(!state){
            socket = io(socketServidor, { transports: ["websocket"] });
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
        console.log(inputChatText)
    }
</script>

<section>
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
    </div>
    {#if state}
        <div class="chat">
            {#if $msgsChat.length > 0}
                {#each $msgsChat as msg}
                    <MsgsChat data={msg}/>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="noChat">
            <p>El chat está desconectado</p>
            <i class="fas fa-unlink"></i>
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
        background: transparentize(#6C63FF, 0.6)
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
        right: 0
        top: 4rem
        padding: 2rem
        border-radius: 2rem
        box-shadow: 0px 4px 35px 4px transparentize(#6C63FF, 0.55)
        @media (max-width: 800px)
            display: none
        .btnConnect
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