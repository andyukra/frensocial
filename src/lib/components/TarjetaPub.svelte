<script>
    import { goto } from "$app/navigation";
    export let data;

    const {item, avatar} = data;

    const openPublication = e => { 
        goto(`publications/${e.target.dataset.key}`)
     }
</script>

<article style={item.image ? `background: url(${item.image}) no-repeat center center/cover` : ``}>
    {#if avatar}
         {#if avatar[0].avatar}
                <img src={avatar[0].avatar} on:click={()=>goto(`/perfil/${item.author}`)} alt="avatar img">
         {:else}
                <i class="fas fa-user-circle" on:click={()=>goto(`/perfil/${item.author}`)}></i>
         {/if}
    {:else}
         <i class="fas fa-user-circle" on:click={()=>goto(`/perfil/${item.author}`)}></i>
    {/if}
    <h2>{item.title}</h2>
    <div class="elementsBox">
        <i class="fas fa-external-link-alt" data-key={item._id} on:click={openPublication}></i>
        <div class="group">
            <i class="far fa-comment"></i>
            <span>{item.comments.length}</span>
        </div>
        <div class="group">
            <i class="far fa-thumbs-up"></i>
            <span>{item.likes}</span>
        </div>
    </div>
</article>

<style lang="sass">
    article
        width: 100%
        height: 50vh
        border-radius: 20px
        box-shadow: 0 4px 10px 5px rgba(0,0,0,.2)
        position: relative
        & > i
            position: absolute
            font-size: 3rem
            top: 3rem
            left: 1rem
            color: white
            text-shadow: 0 0 5px black
            cursor: pointer
        & > img
            width: 3rem
            height: 3rem
            border-radius: 50%
            position: absolute
            box-shadow: 0 0 5px 0 black
            top: 3rem
            left: 1rem
            cursor: pointer
        h2
            font-size: 1rem
            text-align: center
            padding: 0.5rem
            color: white
            background: rgba(0,0,0,.4)
            border-top-left-radius: 20px
            border-top-right-radius: 20px
        .elementsBox
            display: flex
            padding: 0.7rem
            background: white
            position: absolute
            width: 100%
            border-radius: 20px
            bottom: 0
            .fa-external-link-alt
                position: absolute
                right: 2rem
                bottom: 1.5rem
                font-size: 2rem
                background: #6C63FF
                padding: 0.7rem
                border-radius: 100%
                color: white
                box-shadow: 0 0 3px 1px rgba(0,0,0,.5)
                cursor: pointer
            .group
                margin: 0 0.4rem
                span
                    padding: 0.1rem 0.37rem
                    font-size: 0.7rem
                    background: #6C63FF
                    border-radius: 100%
                    color: white
                    box-shadow: 0 0 1px 1px rgba(0,0,0,.3)

</style>