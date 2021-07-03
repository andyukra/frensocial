import db from '$lib/db';
import publications from '$lib/publications';

export async function post({ body, context }) {
    if (!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'DontAutorized'
            }
        }
    }

    let { image, type, description, thumb } = JSON.parse(body);
    description = description.trim();
    let newPublication;

    if (!description || /[{}|<>]/.test(description) || description.length > 250 || /[nñ]*[yi]*[ñn]*[o0]*s*/ig.test(description)) {
        return {
            status: 409,
            body: {
                message: 'BadData'
            }
        }
    }
    if(image){
        if (!/\.png$|\.jpg$|\.jpeg$/.test(image)) {
            return {
                status: 409,
                body: {
                    message: 'BadImageFormat'
                }
            }
        }
    }

    if (image) {
        newPublication = new publications({ image, type, description, author: context.user, thumb });
    } else {
        newPublication = new publications({ type, description, author: context.user });
    }

    await newPublication.save();

    return {
        status: 200,
        body: {
            message: 'success'
        }
    }

}