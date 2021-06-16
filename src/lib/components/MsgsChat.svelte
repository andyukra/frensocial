<script>
    import { onMount } from "svelte";
    import { modalOn } from '$lib/store';
    import ModalImg from '$lib/components/ModalImg.svelte';
    export let data;

    let type = 'text';
    let imagen = '';

    $: if(!$modalOn) imagen = '';

    onMount(() => {
        let shat = document.querySelector('.chat');
        shat.scrollTop = shat.scrollHeight;
    });

    if(/^https\:\/\/(.)*(\.jpg|\.png|\.jpeg)$/.test(data.text)) {
        type = 'img';
    }
</script>

<article>
    <ModalImg imagen={imagen}/>
    {#if data.avatar}
        <img src={data.avatar} alt="avatar of sender">
    {:else}
        <i class="fas fa-user-circle"></i>
    {/if}
    <div class="user-msg">
        <h5>{data.user}</h5>          
        {#if type === 'text'}
            <p>{data.text}</p>
        {:else if  type === 'img'}
            <img src={data.text} on:click={()=>imagen=data.text} alt="imagen subida" class="imgChatcito">
        {:else}
            <div></div>
        {/if}
    </div>

</article>

<style lang="sass">

    .imgChatcito
        margin-top: 0.5rem
        width: 50%
        height: 100%
        border-radius: 0.5rem

    article
        margin: 0.7rem 0
        display: flex
        align-items: start
        gap: 0.5rem
        img
                width: 2rem
                height: 2rem
                border-radius: 100%
                box-shadow: 0 0 5px transparentize(#6C63FF, 0.3)
                cursor: pointer
        p
            font-size: 0.7rem
            font-family: 'Fugaz One', cursive
            padding: 0.18rem 0.5rem
            margin-top: 0.5rem
            background: white
            border-radius: 1rem
            box-shadow: 0 0 4px 1px transparentize(#6C63FF, 0.6)
            word-break: break-all
            position: relative
            &::after
                content: ''
                position: absolute
                top: -0.2rem
                left: 0.7rem
                width: 0.5rem
                height: 0.5rem
                background: transparentize(#6C63FF, 0.5)
                transform: rotateZ(45deg)
                z-index: -1

</style>