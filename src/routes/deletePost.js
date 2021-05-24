import db from '$lib/db';
import publications from '$lib/publications';

export async function del({query, context}) {
    if(!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'DontAutorized'
            }
        }
    }

    if(/[!@#$%^&*(),.?":{}|<>]/.test(query.get('id')) || query.get('id').length > 25){
        return {
            status: 409,
            body: {
                message: 'badParams'
            }
        }
    }

    const search = await publications.findById(query.get('id'));

    if(!search){
        return {
            status: 400,
            body: {
                message: 'Not Found'
            }
        }
    }

    if(search.author !== context.user) {
        return {
            status: 409,
            body: {
                message: 'badUser'
            }
        }
    }

    await publications.findByIdAndRemove(query.get('id'));

    return {
        status: 200,
        body: {
            message: 'success'
        }
    }

}