import db from '$lib/db';
import users from '$lib/users';
import publications from '$lib/publications';

export async function get({context, query}) {
    if(!context.user || !context.authenticated) {
        return {
            status: 409,
            body: {
                message: 'dontAutorized'
            }
        }
    }

    const searchInUser = await users.findOne({username: context.user});

    if(searchInUser) {
        const x = searchInUser[query.get('type')].filter(i => i.id === query.get('id'));
        if(x.length !== 0){
            return {
                body: {
                    message: 'likesSayNo'
                }
            }
        } else {
            const x = await users.findOneAndUpdate({username: context.user}, {$push: {[query.get('type')]: {id: query.get('id')}}})
            if(x.length === 0) {
                return {
                    body: {
                        message: 'likesSayNo'
                    }
                }
            }
            const i = await publications.findByIdAndUpdate(query.get('id'), {$inc: {[query.get('type')] : 1}}, {new: true});
            return {
                status: 200,
                body: {
                    message: 'success'
                }
            }
        }
    } else {
        return {
            status: 409,
            body: {
                message: 'dontAutorized'
            }
        }
    }

}