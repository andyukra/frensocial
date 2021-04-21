import db from '$lib/db';
import publications from '$lib/publications';

export async function post({body, context}) {
    if(!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'DontAutorized'
            }
        }
    }

    const { image, title, description } = JSON.parse(body);
    let newPublication;

    if(/[#$%^&(){}|<>]/.test(title) || title.length < 3 || title.length > 25 || description?.length > 250) {
        return {
            status: 409,
            body: {
                message: 'BadData'
            }
        }
    }

    if(image) {
        newPublication = new publications({image, title, description: description ? description : '', author: context.user});
    } else {
        newPublication = new publications({title, description: description ? description : '', author: context.user});
    }

    const published = await newPublication.save();

    return {
        status: 200,
        body: {
            message: 'success'
        }
    }

}