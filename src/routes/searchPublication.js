import db from '$lib/db';
import publications from '$lib/publications';

export async function get({query}) {
    if(/[!@#$%^&*(),.?":{}|<>]/.test(query.get('key')) || query.get('key').length > 25){
        return {
            status: 409,
            body: {
                message: 'badParams'
            }
        }
    }

    const search = await publications.findById(query.get('key'));

    if(!search?._id) {
        return {
            status: 409,
            body: {
                message: 'notExists'
            }
        }
    }

    return {
        status: 200,
        body: {
            search
        }
    }
}