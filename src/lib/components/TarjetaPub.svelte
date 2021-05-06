<script>
    import { goto } from "$app/navigation";
    import moment from 'moment';
    export let data;

    const {item, avatar} = data;

    const openPublication = e => { 
        goto(`/publications/${e.target.dataset.key}`)
     }
</script>

<article>
    <div class="header">
        {#if avatar}
            <img src={avatar} alt="Imagen de perfil">
        {:else}
            <i class="fas fa-user-circle"></i>
        {/if}
        <div class="authorBox">
            <h4>{item.author}</h4>
            <p>{moment(item.time).fromNow()}</p>
        </div>
    </div>
    <div class="body">
        <p>{item.description}</p>
        {#if item.image}
            <img src={item.image} alt="Imágen de la publicación">
        {/if}
    </div>
    <div class="footer">
        <div class="likeBox">
            <i class="fas fa-thumbs-up"></i>
            <span>{item.likes}</span>
        </div>
        <div class="likeBox">
            <i class="fas fa-thumbs-down"></i>
            <span>{item.dislikes}</span>
        </div>
        <div class="likeBox">
            <i class="fas fa-comments"></i>
            <span>{item.comments.length}</span>
        </div>
    </div>
</article>

<style lang="sass">
    article
        width: 100%
        padding: 1rem
        border-radius: 1rem
        border: 2px solid #F0F0F0
        margin: 0.7rem 0
        .header
            display: flex
            gap: 0.7rem
            align-items: center
            img
                width: 2rem
                height: 2rem
                object-fit: cover
                border-radius: 100%
                box-shadow: 0 0 5px 0 rgba(0,0,0,.4)
                cursor: pointer
            i
                font-size: 2rem
                cursor: pointer
            .authorBox
                p
                    font-size: 0.7rem
                    color: #6A6A6A
        .body
            margin: 1.5rem 0
            img
                width: 15rem
                border-radius: 1rem
                box-shadow: 0 4px 10px 0 rgba(0,0,0,.1)
                margin: 1rem 0
                cursor: pointer
        .footer
            display: flex
            gap: 1rem
            i
                cursor: pointer

</style>