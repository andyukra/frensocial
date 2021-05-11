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

    const {comment, id} = JSON.parse(body);

    if(/[{}|<>]/.test(comment) || comment.length > 101) {
        return {
            status: 409,
            body: {
                message: 'BadData'
            }
        }
    }

    const commentFull = {
        text: comment.toString().trim(),
        author: context.user
    }

    const search = await publications.findByIdAndUpdate(id, {$push: {comments: commentFull}});

    if(search._id) {
        return {
            status: 200,
            body: {
                message: 'success'
            }
        }
    }
}