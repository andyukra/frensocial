import db from '$lib/db';
import users from '$lib/users';

export async function post({body, context}) {
    if(!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'dontAutorized'
            }
        }
    }

    const x = await users.findOneAndUpdate({username: context.user}, {avatar: JSON.parse(body).image});

    if(!x) {
        return {
            status: 409,
            body: {
                message: 'errorPost'
            }
        }
    }

    return {
        body: {
            message: 'success'
        }
    }
}