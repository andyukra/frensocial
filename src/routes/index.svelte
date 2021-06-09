<script context="module">
    import { publicaciones, usuarios } from "$lib/store";

    export async function load({session, fetch}) {
        if(session.authenticated) {
            return {
                status: 302,
                redirect: '/home'
            }
        }

        let pub, usr;

        publicaciones.subscribe(val => pub = val);
        usuarios.subscribe(val => usr = val);

        if(!pub || !usr){
            const res = await fetch('/getPublications?type=todo&pag=1');
        
            if(res.ok) {
                const result = await res.json();
                publicaciones.set(result.data);
                const res2 = await fetch('/getUser?key=all');
                if(res2.ok) {
                    const result2 = await res2.json();
                    usuarios.set(result2.usuarios);
                }
                    return {
                        status: 200
                    }
                } else {
                    return {
                        status: 409
                    }
            }
        }
            return {
                status: 200
            }
    }
</script>

<script>
    import Publications from '$lib/components/Publications.svelte';
    import { onMount } from 'svelte';

    let username, password;


    const login = () => {
        if(/[!@#$%^&*(),.?":{}|<>]/.test(username) || /[!@#$%^&*(),.?":{}|<>]/.test(password)) return;
        if(username.length > 25 || username.length < 3) return;
        if(password.length > 25 || password.length < 3) return;

        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({username, password})
        })
            .then(response => response.text())
            .then(result => {
                const {message} = JSON.parse(result);
                switch(message){
                    case 'badPassword': alert('Contraseña incorrecta'); break;
                    case 'notExists': alert('El usuario no existe'); break;
                    case 'success': location.href = '/home'; break;
                }
            })
            .catch(err => console.error(err));
        username = ''; password = '';
    }

    onMount(() => {
        let arrInputs = document.querySelectorAll('.formGroup input');
        const loginModal = document.querySelector('.loginModal');
        const btnOpenLogin = document.querySelector('#btnOpenLogin');
        const closeBtnLogin = document.querySelector('.closeModal');
        closeBtnLogin.addEventListener('click', e => {
            loginModal.style.transform = 'scale(0)';
        });
        btnOpenLogin.addEventListener('click', e => {
            loginModal.style.transform = 'scale(1)';
            
        });
        arrInputs.forEach(e => {
            e.addEventListener('focus', e => {
                if(e.target.value !== '') return;
                e.target.previousSibling.previousSibling.style.transform = 'translateY(0)';
            });
            e.addEventListener('blur', e => {
                if(e.target.value !== '') return;
                e.target.previousSibling.previousSibling.style.transform = 'translateY(25px)';
            });
        });
    });
</script>

<div class="loginModal">
    <form on:submit|preventDefault={login}>
        <i class="fa fa-times closeModal" aria-hidden="true"></i>
        <i class="fa fa-user-circle" aria-hidden="true"></i>
        <h3>Ingresar</h3>
        <div class="formGroup">
            <span>Usuario</span>
            <input bind:value={username} type="text" minlength="3" maxlength="25" required>
        </div>
        <div class="formGroup">
            <span>Contraseña</span>
            <input bind:value={password} type="password" minlength="3" maxlength="25" required>
        </div>
        <button>Ingresar</button>
    </form>
</div>

<section>
    <div class="imgBox">
        <img src="/indexBanner.svg" alt="Index Banner">
    </div>
    <div class="textBox">
        <h3>Bienvenidos a Fren<span>social</span></h3>
        <p>La red social más popular del chat y de la internet</p>
        <div class="btnsBox">
            <a href="#" id="btnOpenLogin">Ingresar</a>
            <a href="/register">Registrarse</a>
        </div>
    </div>
</section>

<Publications place={'index'} />

<style lang="sass">
    section
        width: 70%
        display: grid
        grid-template-columns: 1fr 2fr
        margin: 7rem auto
        place-items: center
        @media(max-width: 800px)
            grid-template-columns: 1fr
        .imgBox
            margin-right: 1.5rem
            @media(max-width: 800px)
                grid-row-start: 2
                margin-right: 0
                display: flex
                justify-content: center
                align-items: center
            img
                width: 100%
                @media(max-width: 800px)
                    width: 80%
        .textBox
            padding: 10px
            @media(max-width: 800px)
                text-align: center
            h3
                margin: 5px 0
                font-size: 2rem
                span
                    color: #6C63FF
            p
                font-size: 1.3rem
        .btnsBox
            margin: 30px 0
            display: flex
            @media(max-width: 800px)
                justify-content: center
                align-items: center
            a
                text-decoration: none
                color: black
                font-family: inherit
                padding: 10px
                border-radius: 14px
                background: white
                box-shadow: 0px 4px 23px 2px  rgba(0,0,0,.1)
                cursor: pointer
                &:nth-child(1)
                    margin-right: 15px
    .loginModal
        width: 100%
        height: 100%
        background: rgba(0,0,0,.7)
        position: fixed
        top: 0
        left: 0
        z-index: 1000
        display: flex
        justify-content: center
        align-items: center
        transform: scale(0)
        backdrop-filter: blur(7px)
        transition: 0.1s
        box-shadow: 0px 4px 23px 2px rgba(0,0,0,.3)
        form
            padding: 1rem 4rem
            background: white
            border-radius: 35px
            display: flex
            justify-content: center
            align-items: center
            flex-direction: column
            position: relative
            @media(max-width: 500px)
                padding: 0.5rem 2rem
                width: 90vw
            .fa-times
                position: absolute
                right: 2rem
                top: 1.7rem
                width: 30px
                height: 30px
                transition: 0.3s
                border-radius: 50%
                display: flex
                justify-content: center
                align-items: center
                cursor: pointer
                z-index: 50
                &:hover
                    background: rgba(255,0,0,.4)
            .fa-user-circle
                font-size: 5rem
                padding: 0.5rem 0
            .formGroup
                margin: 0.5rem 0
                display: flex
                flex-direction: column
                @media(max-width: 500px)
                    width: 90%
                span
                    color: #777
                    font-size: 0.8rem
                    transform: translateY(25px)
                    transition: 0.4s
                    position: relative
                    z-index: 0
                    @media(max-width: 500px)
                        font-size: 1.2rem
                        transform: translateY(30px)
                input
                    border: none
                    border-bottom: 3px solid #6C63FF
                    background: transparent
                    position: relative
                    z-index: 1
                    font-family: inherit
                    padding: 7px 0
                    @media(max-width: 500px)
                        font-size: 1.2rem
                    &:focus
                        outline: none
            button
                border: none
                background: #6C63FF
                padding: 10px
                font-family: inherit
                border-radius: 9999px
                width: 100%
                margin: 10px 0
                cursor: pointer
                box-shadow: 0px 4px 20px 4px rgba(0,0,0,.3)
                &:focus
                    outline: none    
</style>