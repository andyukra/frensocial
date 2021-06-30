import db from '$lib/db';
import users from '$lib/users';
import StringHash from 'string-hash';
import cookie from 'cookie';

export async function post({body}){
    return null;
    let { username, password } = JSON.parse(body);
    if(username.length < 3 || username.length > 25 || password.length < 3 || password.length > 25) {
        return {
            status: 409,
            body: {
                message: 'wrongLogin'
            }
        }
    }

    const searchUser = await users.findOne({username});

    if(searchUser) {
        if(StringHash(password) != searchUser.password) {
            return {
                status: 409,
                body: {
                    message: 'badPassword'
                }
            }
        }
    } else {
        return {
            status: 409,
            body: {
                message: 'notExists'
            }
        }
    }

    const headers = {
        'Set-cookie' : cookie.serialize('sessionID', searchUser._id, {
            httpOnly: false,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
            path: '/'
        })
    }

    return {
        status: 200,
        headers,
        body : {
            message: 'success'
        }
    }
}