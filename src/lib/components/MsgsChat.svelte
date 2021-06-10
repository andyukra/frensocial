<script>
    import { onMount } from "svelte";

    export let data;

    onMount(() => {
        let shat = document.querySelector('.chat');
        shat.scrollTop = shat.scrollHeight;
    });
</script>

<article>
    <div class="msgAuthor">
        {#if data.avatar}
            <img src={data.avatar} alt="avatar of sender">
        {:else}
            <i class="fas fa-user-circle"></i>
        {/if}
        <h5>{data.user}</h5>
    </div>
    
    <p>{data.text}</p>
</article>

<style lang="sass">

    article
        margin: 0.7rem 0
        display: flex
        flex-direction: column
        align-items: start
        p
            font-size: 0.7rem
            font-family: 'Fugaz One', cursive
            margin: 0.85rem 0
            padding: 0.3rem 0.5rem
            background: white
            border-radius: 1rem
            box-shadow: 0 0 4px 1px transparentize(#6C63FF, 0.6)
            word-break: break-all
        .msgAuthor
            display: flex
            gap: 0.7rem
            align-items: center
            img
                width: 2rem
                height: 2rem
                border-radius: 100%
                box-shadow: 0 0 5px 2px transparentize(#6C63FF, 0.1)

</style>