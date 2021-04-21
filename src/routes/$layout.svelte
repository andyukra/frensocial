<script context="module">
    export async function load({session}){
        if(!session.authenticated) {
            return {
                props: {auth: false, user: ''}
            }
        }
        return {
                props: {auth: true, user: session.user}
            }
    }
</script>

<script>
    export let auth;
    export let user;
    import Nav from '$lib/components/Nav.svelte';
    import Footer from '$lib/components/Footer.svelte';
</script>

<div class="app">

    <Nav data={{auth, user}}/>

    <slot></slot>

    <Footer/>
</div>

<style lang="sass">
    .app
        width: 100%
        height: 100%
        display: grid
        grid-template-rows: auto 1fr auto
</style>