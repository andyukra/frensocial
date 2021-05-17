<script>
    import moment from 'moment';
    import { usuarios } from "$lib/store";
    import { onDestroy, createEventDispatcher } from "svelte";
    import { goto } from '$app/navigation';
    export let data;

    const {item, avatar} = data;
    let comment, allUsers;
    let commentsBoxState = 0;
    const dispatch = createEventDispatcher();

    const unsubscribe = usuarios.subscribe(val => allUsers = val);

    onDestroy(unsubscribe);

     const sendLikeOrDislike = async (type, e) => {
        const res = await fetch(`/likes?type=${type}&id=${item._id}`);
        if(res.ok){
            const result = await res.json();
            const {message} = result;
            if(message === 'success') {
                e.target.style.color = '#6C63FF';
                let x = parseInt(e.target.nextElementSibling.textContent) + 1;
                e.target.nextElementSibling.textContent = x;
            }
        }
     }

     const postComment = async () => {
        if(/[{}|<>]/.test(comment) || comment.length > 100) {
            alert('Error de envío');
            return null;
        }
        const res = await fetch('/postComment', {
            method: 'POST',
            body: JSON.stringify({comment, id:item._id})
        });
        if(res.ok){
            const result = await res.json();
            if(result.message === 'success'){
                location.href = '/home';
            }
        }
     }

     const toggleCommentsBox = e => {
        const commentsBox = e.target.parentNode.parentNode.nextElementSibling;
        if(commentsBoxState){
            commentsBox.style.display = 'none';
            commentsBoxState = !commentsBoxState;
        } else {
            commentsBox.style.display = 'block';
            commentsBoxState = !commentsBoxState;
        }
     }

     const openImageModal = (image) => {
         dispatch('openModal', {
             image
         });
     }
</script>

<article data-type={item.type}>
    <div class="header">
        <div class="author">
            {#if avatar}
                <img src={avatar} alt="Imagen de perfil" on:click={()=>goto(`/perfil/${item.author}`)}>
            {:else}
                <i class="fas fa-user-circle" on:click={()=>goto(`/perfil/${item.author}`)}></i>
            {/if}
            <div class="authorBox">
                <h4>{item.author}</h4>
                <p>{moment(item.time).fromNow()}</p>
            </div>
        </div>
        <i class="fas fa-arrow-alt-circle-right" on:click={()=>goto(`/publications/${item._id}`)}></i>
    </div>
    <div class="body">
        <p>{item.description}</p>
        {#if item.image}
            <img src={item.image} on:click={()=>openImageModal(item.image)} alt="Imágen de la publicación">
        {/if}
    </div>
    <div class="footer">
        <div class="likeBox">
            <i class="fas fa-thumbs-up" on:click={e=>sendLikeOrDislike('likes', e)}></i>
            <span>{item.likes}</span>
        </div>
        <div class="likeBox">
            <i class="fas fa-thumbs-down" on:click={e=>sendLikeOrDislike('dislikes', e)}></i>
            <span>{item.dislikes}</span>
        </div>
        <div class="likeBox">
            <i class="fas fa-comments" on:click={toggleCommentsBox}></i>
            <span>{item.comments.length}</span>
        </div>
    </div>
    <div class="commentsBox">
        {#if item.comments.length === 0}
            <p>No hay comentarios</p>
        {:else}
            {#each item.comments as comentario}
                <div class="comment">
                    <div class="author">
                        {#if allUsers.filter(x=>x.username===comentario.author)[0].avatar}
                            <img src={allUsers.filter(x=>x.username===comentario.author)[0].avatar} alt="author avatar">
                        {:else}
                            <i class="fas fa-user-circle"></i>
                        {/if}
                        <div class="authorComment">
                            <h6>{comentario.author}</h6>
                            <p>{moment(comentario.time).fromNow()}</p>
                        </div>
                    </div>
                    <p>{comentario.text}</p>
                </div>        
            {/each}
        {/if}
        {#if data.auth}
            <div class="commentsPost">
                {#if avatar}
                    <img src={avatar} alt="Imagen de perfil">
                {:else}
                    <i class="fas fa-user-circle"></i>
                {/if}
                <form on:submit|preventDefault={postComment}>
                    <input type="text" placeholder="Escribe un comentario..." maxlength="100" minlength="1" bind:value={comment}>
                    <button>
                        <i class="fa fa-paper-plane" aria-hidden="true"></i>
                    </button>
                </form>
            </div>
        {/if}
    </div>
</article>

<style lang="sass">
    article
        width: 100%
        padding: 1rem
        border-radius: 1rem
        border: 2px solid #F0F0F0
        margin: 0.7rem 0
        .commentsBox
            display: none
            margin: 2rem 0
            .commentsPost
                        display: flex
                        align-items: center
                        gap: 0.7rem
                        margin-top: 2rem
                        form
                            display: flex
                            width: 100%
                            gap: 0.5rem
                            button
                                border: none
                                background: transparent
                                .fa-paper-plane
                                    padding: 0.5rem
                                    background: #6C63FF
                                    border-radius: 100%
                                    color: white
                                    cursor: pointer
                                    box-shadow: 0 4px 10px 0 rgba(0,0,0,.3)
                            input
                                border-radius: 1rem
                                border: none
                                background: lighten(#6C63FF, 25%)
                                padding: 0.5rem
                                font-family: inherit
                                width: 100%
                                font-size: 0.7rem
                                &:focus
                                    outline: none
                        img
                            width: 1.5rem
                            height: 1.5rem
                            border-radius: 100%
                            box-shadow: 0 0 5px 0 rgba(0,0,0,.4)
                            cursor: pointer
            .comment
                margin: 0.8rem 0 0 1rem
                word-break: break-word
                & > p
                    margin: 0.7rem 0
                    padding: 0.6rem
                    background: #F0EFFF
                    border-radius: 1rem
                    box-shadow: 0 4px 11px 0 rgba(0,0,0,.1)
                    font-size: 0.75rem
                .author
                    display: flex
                    gap: 0.7rem
                    .authorComment
                                p
                                    font-size: 0.6rem
                                    color: #777
                    & > img
                        width: 1.5rem
                        height: 1.5rem
                        border-radius: 100%
                        box-shadow: 0 4px 10px 0 rgba(0,0,0,.3)
                    
        .header
            display: flex
            gap: 0.7rem
            align-items: center
            justify-content: space-between
            .author
                display: flex
                gap: 0.5rem
            img
                width: 2rem
                height: 2rem
                object-fit: cover
                border-radius: 100%
                box-shadow: 0 0 5px 0 rgba(0,0,0,.4)
                cursor: pointer
            i
                font-size: 1.3rem
                cursor: pointer
                transition: 0.4s
                color: #6C63FF
                &:hover
                    color: darken(#6C63FF, 40%)
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