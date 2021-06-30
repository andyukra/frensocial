<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();
    let username, password, rePassword, email;

    const sendRegister = () => {
        /*username.trim();
        password.trim();
        if(password !== rePassword){
            alert('Las contraseñas no coinciden');
            username = ''; password = ''; rePassword = ''; email = '';
            return;
        }
        if( /[!$%^&*(),?":{}|<>]/.test(username) ||  /[!#$%^&*(),?":{}|<>]/.test(password) ||  /[!#$%^&*(),?":{}|<>]/.test(email)) return;
        if(username.length > 25 || username.length < 3) return;
        if(password.length > 25 || password.length < 3) return;
        fetch('/registro', {
            method: 'POST',
            body: JSON.stringify({
                username, password, email
            })
        })
            .then(response => response.json())
            .then(({message}) => {
                if(message === 'success') dispatch('success');
                if(message === 'exists') alert('Ese usuario ya existe');
            })
            .catch(err => console.error(err));
        username = ''; password = ''; rePassword = ''; email = '';*/
        location.href = '/';
    }

    onMount(() => {
        let arrInputs = document.querySelectorAll('.formGroup input');
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

<section class="registerPanel">
    <div class="imgBox">
        <img src="/registerBannerImg.svg" alt="Register Banner Img">
    </div>
    <form on:submit|preventDefault={sendRegister}>
        <h3>Registro</h3>
        <div class="formGroup">
            <span>Usuario</span>
            <input bind:value={username} type="text" minlength="3" maxlength="25" required>
        </div>
        <div class="formGroup">
            <span>Email</span>
            <input bind:value={email} type="email" minlength="3" maxlength="25" required>
        </div>
        <div class="formGroup">
            <span>Contraseña</span>
            <input bind:value={password} type="password" minlength="3" maxlength="25" required>
        </div>
        <div class="formGroup">
            <span>Repite la contraseña</span>
            <input bind:value={rePassword} type="password" minlength="3" maxlength="25" required>
        </div>
        <button>Registrarse</button>
    </form>
</section>

<style lang="sass">
    .registerPanel
        width: 70%
        display: flex
        align-items: center
        margin: 5rem auto
        background: white
        justify-content: space-around
        border-radius: 30px
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        padding: 3rem
        @media(max-width: 800px)
            padding: 1rem
        .imgBox
            width: 50%
            @media(max-width: 800px)
                display: none
            img
                width: 80%
        form
            width: 40%
            @media(max-width: 800px)
                width: 90%
            h3
                text-align: center
                font-size: 1.5rem
            .formGroup
                margin: 20px 0
                display: flex
                flex-direction: column
                span
                    color: #777
                    font-size: 0.8rem
                    transform: translateY(25px)
                    transition: 0.4s
                    position: relative
                    z-index: 0
                input
                    border: none
                    border-bottom: 3px solid #6C63FF
                    background: transparent
                    position: relative
                    z-index: 1
                    font-family: inherit
                    padding: 7px 0
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