import db from '$lib/db';
import users from '$lib/users';

export async function post({body, context, query}) {
    if(!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'dontAutorized'
            }
        }
    }

    if(typeof query.get('key') !== 'string' || /[#$%^&*()":{}|<>]/.test(query.get('key'))) {
        return {
            status: 409,
            body: {
                message: 'errorPost'
            }
        }
    }
    const type = query.get('key');
    let x = '';

    switch(type) {
        case 'avatar':
            x = await users.findOneAndUpdate({username: context.user}, {avatar: JSON.parse(body).image});
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
        case 'descrip':
            x = await users.findOneAndUpdate({username: context.user}, {$set: {descrip: JSON.parse(body).descrip}});
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

}