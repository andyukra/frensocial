<script context='module'>
    import { publicaciones, usuarios } from '$lib/store';

    export async function load({page, fetch, session}) {
        let data, search, allUsers, search2, allUsersParsed;

        publicaciones.subscribe( val => data = val);
        usuarios.subscribe( val => allUsers = val);

        if(data || allUsers) {
            search = data.filter(x => x._id === page.params.key);
            allUsersParsed = await allUsers.reduce((acc, i) => ({
                ...acc,
                [i.username]: i.avatar
            }), {});
            return {
                status: 200,
                props: {
                    data: search,
                    user: session.user ? session.user : '',
                    avatars: allUsersParsed
                }
            }
        }

        const res = await fetch(`/searchPublication?key=${page.params.key}`);
        if(!res.ok){
            return {
                status: 302,
                redirect: '/publicationNotFound'
            }
        }
        search = await res.json();
        const res2 = await fetch('/getUser?key=all');
        if(res2.ok) {
            allUsers = await res2.json();
            allUsersParsed = await allUsers.usuarios.reduce((acc, i) => ({
                ...acc,
                [i.username]: i.avatar
            }), {});
        }
        return {
            status: 200,
            props: {
                data: [{...search.search}],
                user: session.user ? session.user : '',
                avatars: allUsersParsed
            }
        }

    }
</script>

<script>
    export let data, user, avatars;
    import {goto} from '$app/navigation';
    import moment from 'moment';
    import {onMount} from 'svelte';

    let comment;

    const postComment = () => {
        if(!user) return null;
        if(comment.length > 100) {
            alert('El comentario es demasiado largo');
            return null;
        }
        fetch('/postComment', {
            method: 'POST',
            body: JSON.stringify({comment : comment.trim(), id: data[0]._id})
        })
            .then(response => response.text())
            .then(result => {
                const {message} = JSON.parse(result);
                if(message === 'success') {
                    location.href = `/publications/${data[0]._id}`;
                }
            });
    }

    const postLikeOrDislike = (type) => {
        if(!user) return null;
        fetch(`/likes?id=${data[0]._id}&type=${type}`)
            .then(response => response.text())
            .then(result => {
                const {message} = JSON.parse(result);
                if(message === 'success'){
                    const who = document.querySelector(`.${type}`);
                    who.style.color = '#6C63FF';
                    who.childNodes[2].textContent = parseInt(who.childNodes[2].textContent) + 1;
                }
            })
            .catch(err => console.error(err));
    }

    onMount(() => {
        const times = document.querySelector('.closeImg');
        const modal = document.querySelector('.modalImg');
        const imagen = document.querySelector('.imagen');
        times.addEventListener('click', e => {
            modal.style.display = 'none';
        });
        imagen.addEventListener('click', e => {
            modal.style.display = 'flex';
        });
    })

</script>

<div class="modalImg">
    <i class="fa fa-times closeImg" aria-hidden="true"></i>
    <img src={data[0].image} alt="imagen">
</div>
<section>
    <div class="header">
        <div class="author">
            {#if avatars}
                 {#if avatars[data[0].author]}
                    <img src={avatars[data[0].author]} on:click={()=>goto(`/perfil/${data[0].author}`)} alt="avatar author">
                 {/if}
            {:else}
                <i class="fa fa-user-circle" on:click={()=>goto(`/perfil/${data[0].author}`)}></i>
            {/if}
            <div class="authorText">
                <h4>{data[0].author.replace(/\"/g, '')}</h4>
                <p>{moment(data[0].time).fromNow()}</p>
            </div>
        </div>
        <div class="likesBox">
            <div class="groupLike likes">
                {#if user}
                    <i class="far fa-thumbs-up" on:click={() => postLikeOrDislike('likes')}></i>
                {:else}
                    <i class="far fa-thumbs-up"></i>
                {/if}
                <span>{data[0].likes}</span>
            </div>
            <div class="groupLike dislikes">
                {#if user}
                    <i class="far fa-thumbs-down" on:click={() => postLikeOrDislike('dislikes')}></i>
                {:else}
                    <i class="far fa-thumbs-down"></i>
                {/if}
                <span>{data[0].dislikes}</span>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="imgBox">
            <img src={data[0].image} class="imagen" alt="imagen">
            <p>{data[0].description}</p>
        </div>
        <div class="commentsBox">
           <h4>Comentarios</h4>
           <div class="comments">
               {#if data[0].comments.length !== 0}
                    {#each data[0].comments as comentario}
                         <article>
                             <div class="authorComment">
                                {#if avatars}
                                    {#if avatars[comentario.author]}
                                        <img src={avatars[comentario.author]} on:click={()=>goto(`/perfil/${comentario.author}`)} alt="avatar author">
                                    {:else}
                                        <i class="fa fa-user-circle" on:click={()=>goto(`/perfil/${comentario.author}`)}></i>
                                    {/if}
                                {:else}
                                    <i class="fa fa-user-circle" on:click={()=>goto(`/perfil/${comentario.author}`)}></i>
                                {/if}
                                <div class="textAuthorComment">
                                    <h5>{comentario.author}</h5>
                                    <p>{moment(comentario.time).fromNow()}</p>
                                </div>
                             </div>
                             <p class="commentText">{comentario.text}</p>
                         </article>
                    {/each}
               {:else}
                    <p style="text-align: center">No hay comentarios</p>
               {/if}
           </div>
           {#if user}
            <form on:submit|preventDefault={postComment}>
                <input type="text" placeholder="Comentá" bind:value={comment} required>
                <button type="submit">
                    <i class="fa fa-paper-plane" aria-hidden="true"></i>
                </button>
            </form>
           {/if}
        </div>
    </div>
</section>

<style lang="sass">
    .modalImg
        display: none
        justify-content: center
        align-items: center
        position: fixed
        top: 0
        left: 0
        width: 100%
        height: 100vh
        background: rgba(0,0,0,.7)
        backdrop-filter: blur(7px)
        z-index: 1200
        .fa-times
            position: absolute
            right: 2rem
            top: 2rem
            cursor: pointer
            font-size: 1.3rem
            width: 40px
            height: 40px
            border-radius: 50%
            transition: 0.5s
            display: flex
            align-items: center
            justify-content: center
            color: white
            z-index: 1201
            &:hover
                background: rgba(0,0,0,.1)
        & > img
            width: 80%
            max-height: 90vh
    i
        cursor: pointer
    section
        width: 70%
        background: white
        padding: 2rem
        box-shadow: 0 4px 32px 0 rgba(0,0,0,.1)
        border-radius: 1.5rem
        margin: 5rem auto
        @media(max-width: 800px)
            padding: 0.8rem
            width: 100%
        .header
            display: flex
            justify-content: space-between
            margin-bottom: 1rem
            .author
                display: flex
                align-items: center
                i
                    font-size: 2.5rem
                    margin-right: 0.7rem
                img
                    width: 2.5rem
                    height: 2.5rem
                    border-radius: 50%
                    margin-right: 0.7rem
                    object-fit: cover
                    cursor: pointer
                p
                    font-size: 0.7rem
                    color: #777
            .likesBox
                display: flex
                .groupLike
                    display: flex
                    align-items: center
                    margin: 0 1rem
                    i
                        font-size: 2rem
                    span
                        font-size: 0.8rem
                        margin-left: 0.5rem
                        padding: 0.2rem 0.4rem
                        background: #6C63FF
                        color: white
                        border-radius: 50%
        .content
            display: flex
            gap: 2rem
            @media(max-width: 800px)
                flex-direction: column
            .commentsBox
                flex: 1
                margin: 0 0.5rem
                background: lighten(#6C63FF, 23%)
                padding: 0.7rem
                border-radius: 1rem
                display: flex
                flex-direction: column
                justify-content: space-between
                box-shadow: 0 4px 32px 0 rgba(0,0,0,.15)
                @media(max-width: 800px)
                    margin: 1rem 0
                form
                    display: flex
                    width: 100%
                    button
                        padding: 0.5rem
                        border: none
                        border-radius: 50%
                        background: #6C63FF
                        color: white
                        box-shadow: 0 0 5px 1px rgba(0,0,0,.3)
                        &:focus
                            outline: none
                    input
                        width: 100%
                        border: none
                        border-bottom: 2px solid #6C63FF
                        background: transparent
                        padding: 0.2rem 0
                        font-family: inherit
                        &:focus
                            outline: none
                h4
                    text-align: center
                .comments
                    overflow-y: auto
                    max-height: 90vh
                    margin: 0.8rem 0
                    padding-right: 0.5rem
                    article
                        word-break: break-word
                        margin: 0.7rem 0
                        .commentText
                            font-size: 0.7rem
                            padding: 0.58rem
                            background: white
                            border-radius: 0.7rem
                            margin: 0.5rem 0
                        .authorComment
                            display: flex
                            align-items: center
                            img
                                width: 1.8rem
                                height: 1.8rem
                                border-radius: 50%
                                object-fit: cover
                                cursor: pointer
                            i
                                font-size: 1.8rem
                            .textAuthorComment
                                margin-left: 0.7rem
                                p
                                    font-size: 0.7rem
                                    color: #777
            .imgBox
                flex: 1.5
                img
                    width: 100%
                    border-radius: 1rem
                    box-shadow: 0 4px 32px 0 rgba(0,0,0,.15)
                p
                    padding: 0.8rem
                    background: lighten(#6C63FF, 23%)
                    border-radius: 1rem
                    box-shadow: 0 4px 32px 0 rgba(0,0,0,.15)
                    @media(max-width: 800px)
                        margin-top: 1rem

</style>