<script>
    import { onMount } from 'svelte';

    let title, description, files;

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

    const publicar = () => {
        if(!files) {
            alert('Elije una imágen por favor');
            return null;
        }
        if(files[0].size > 5000000) {
            alert('La imágen es muy pesada')
            return null;
        }
        if(!/img|png|jpeg|gif/.test(files[0].type)) {
            alert('El Archivo debe ser una imágen');
            return null;
        }
        if(title.length > 25 || title.length < 3 || /[#$%^&(){}|<>]/.test(title)) {
            alert('El título contiene caractéres prohibidos');
            return null;
        }

        let form = new FormData();
        form.set('image', files[0])

        fetch('https://api.imgbb.com/1/upload?key=579f935dc936016e8e8217246bd6d65f', {
            method: 'POST',
            body: form
        })
            .then(response => response.json())
            .then(result => {
                if(result.status === 200) {
                    fetch('/publish', {
                        method: 'POST',
                        body: JSON.stringify({
                            image: result.data.display_url,
                            title,
                            description
                        })
                    })
                        .then(response => response.text())
                        .then(result => {
                            const {message} = JSON.parse(result);
                            if(message === 'success') {
                                location.href = '/home';
                            }
                        })
                        title = ''; description = '';
                }
            })
            .catch(err => console.error(err));
    } 
</script>

<form on:submit|preventDefault={publicar}>
    <h3>Comenzá a publicar!!</h3>
    <div class="content">
        <input bind:files id="upImg" type="file" style="display:none;" accept="image/*">
        <label for="upImg">
            <i class="fas fa-image"></i>
        </label>
        <div class="formBox">
            <div class="formGroup">
                <span>Título</span>
                <input type="text" required maxlength="25" minlength="3" bind:value={title}>
            </div>
            <textarea rows="2" placeholder="Descripción" maxlength="250" bind:value={description}></textarea>
        </div>
    </div>
    <button type="submit">Publicar</button>
</form>

<style lang="sass">
    form
        width: 100%
        margin: 5rem 0
        padding: 1.5rem
        background: white
        height: 250px
        border-radius: 50px
        display: flex
        flex-direction: column
        justify-content: center
        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
        @media(max-width: 500px)
            height: 100%
            padding: 1rem
        h3
            text-align: center
        .content
            display: flex
            justify-content: space-around
            align-items: center
            @media(max-width: 500px)
                flex-direction: column
            label
                i
                    font-size: 8.5rem
                    color: rgba(108, 99, 255, .8)
                    cursor: pointer
                    transition: 0.4s
                    &:hover
                        transform: rotateZ(-10deg) scale(1.1)
                        color: rgba(108, 99, 255, 1)
                        text-shadow: 0 0 5px rgba(0,0,0,.2)
            .formBox
                display: flex
                flex-direction: column
                width: 70%
                @media(max-width: 500px)
                    width: 90%
                textarea
                        resize: none
                        background: rgba(108, 99, 255, .24)
                        padding: 1rem
                        border: none
                        border-radius: 0.5rem
                        font-family: inherit
                        margin: 1rem 0
                        box-shadow: 0px 4px 35px 4px rgba(0,0,0,.1)
                        &:focus
                            outline: none
                .formGroup
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
            width: 97%
            padding: 0.5rem
            border-radius: 50px
            border: none
            font-family: inherit
            background: #6C63FF
            font-size: 0.8rem
            color: white
            box-shadow: 0 4px 15px 1px rgba(0,0,0,.25)
            margin: 1rem auto
            cursor: pointer
            @media(max-width: 500px)
                width: 95%
            &:focus
                            outline: none
</style>