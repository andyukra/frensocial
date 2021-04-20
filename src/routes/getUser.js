import db from '$lib/db';
import users from '$lib/users';

export async function get({query, headers}) {

    if(!headers.referer) return null;

    if(/[#$%^&*()":{}|<>]/.test(query.get('key'))){
        return {
            status: 409,
            body: {
                message: 'badParams'
            }
        }
    }

    if(query.get('key') === "all") {
        const search = await users.find({}, {username: true, avatar: true, _id: false});
        if(!search) {
            return {
                status: 404,
                body: {
                    message: 'NotFound'
                }
            }
        }
        return {
            status: 200,
            body: {
                usuarios: search
            }
        }

    }

    const key = query.get('key').trim();

    const search = await users.findOne({username: key}, {password: false, _id: false});

    if(!search) {
        return {
            status: 404,
            body: {
                message: 'NotFound'
            }
        }
    }

    return {
        status: 200,
        body: {
            usuario: search
        }
    }
}