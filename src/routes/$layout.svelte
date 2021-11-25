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
</script>

<div class="app">

    <Nav data={{auth, user}}/>

    <slot></slot>

</div>

<style lang="sass">
    .app
        width: 100%
        min-height: 99.9vh
</style>