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

    const { image, type, description } = JSON.parse(body);
    let newPublication;

    if (!description || /[&{}|<>]/.test(description) || description.length > 250) {
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
        newPublication = new publications({ image, type, description, author: context.user });
    } else {
        newPublication = new publications({ type, description, author: context.user });
    }

    const published = await newPublication.save();

    return {
        status: 200,
        body: {
            message: 'success'
        }
    }

}